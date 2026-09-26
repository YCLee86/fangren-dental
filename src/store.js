/* =============================================================================
   資料庫的容量 ＋ 完整匯出（2026-09-26）
   -----------------------------------------------------------------------------
   起因（使用者）：軌跡紀錄定案「資料全部保留」之後，問到 D1 的容量上限——
   「軌跡資料另開一個資料庫」與「快滿的時候把舊資料匯出成檔案存起來、再從資料庫刪掉」
   兩個都要，「但我不知道什麼時候是快滿的時候，可能要做在報告頁，然後也先做匯出的按鈕」。

   所以這一支做兩件事，報告頁（admin/search/）的第四個分頁「資料庫」來讀：
     GET /api/store-report            → 每個資料庫用了多少、每張表幾筆、照最近的速度幾時會滿
     GET /api/export?table=&month=&after=  → 某一張表某一個月的**原始逐筆**（備份用，一次一段）

   ── 四件刻意的設計 ────────────────────────────────────────────────────────
   ① **容量讀 D1 自己回報的 meta.size_after**（整個資料庫的位元組數），不自己估。
      上限是免費方案**單一資料庫 500 MB**（帳號總量 5 GB 是另一回事）——滿了之後
      那個資料庫的**所有寫入都會失敗**，連文章上的瀏覽數都不會再動。
   ② **這一支刻意不做 COUNT(*)。** 9/1 起免費額度的讀取是硬上限（每天 500 萬列，
      超過之後整站的 D1 讀取到台灣時間早上 8 點才恢復），而 COUNT(*) 是整張表掃一遍。
      筆數改用「最大 id − 最小 id ＋ 1」：id 是 AUTOINCREMENT，而刪舊資料只會從最舊的
      那一端刪，所以中間沒有洞，這個數字是準的。每一個 MIN／MAX 都要寫成**自己一個子查詢**
      ——SQLite 只有在「整句只有一個 MIN 或 MAX」時才走索引讀一列，寫在同一個 SELECT 裡
      會退回整張表掃描（而且不報錯）。
   ③ **匯出一次只給一個月、而且一段最多 PAGE 筆**，前端用 after（上一段最後一個 id）接著要。
      理由同②：資料累積好幾年之後，一次要一整張表就是一次把當天的讀取額度用光。
      匯出本身一定要讀它匯出的那些列，這一筆省不掉，但至少不會一次爆掉。
   ④ **表名是白名單**，不是從網址直接拼進 SQL。
   ⚠ 軌跡紀錄上線時會**另開一個資料庫**（binding 預計叫 PATHS，見 DECISIONS.md 那一列），
     到時候在 DBS 加一筆就好，這一頁會自己多一塊。
   ============================================================================= */

import { nowIso, agoIso, keyOk } from "./search.js";

/* 免費方案單一資料庫的上限。付費方案是 10 GB，換方案時改這裡。 */
export const DB_LIMIT = 500 * 1024 * 1024;
/* 到這個比例就在報告頁上說「快滿了」。留兩成是為了匯出與刪除要花的那幾天。 */
export const WARN_AT = 0.8;
/* 匯出一段最多幾筆。一筆不到 100 位元組，2 萬筆約 2 MB，手機也接得住。 */
export const PAGE = 20000;

/* 逐筆的紀錄表：一定有 id 與 at（ISO 8601、UTC），欄位照 d1-schema.sql。
   ⚠ 新增一張紀錄表時這裡要加一筆，不然報告頁看不到它、也匯出不了。 */
export const TABLES = {
  search_log: { label: "搜尋紀錄", cols: ["id", "q", "scope", "hits", "at"] },
  click_log:  { label: "點擊紀錄", cols: ["id", "code", "scope", "at"] },
  source_log: { label: "來源紀錄", cols: ["id", "src", "via", "host", "page", "at"] },
};

/* 資料庫：binding 是 wrangler.toml 裡的名字。沒有綁的（例如軌跡那一個還沒建）就跳過。 */
export const DBS = [
  { binding: "DB", name: "fangren-dental-views", label: "計數器與紀錄",
    tables: ["search_log", "click_log", "source_log"], counter: true },
];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });

async function gate(request, env) {
  if (!env.REPORT_KEY) return json({ ok: false, error: "unconfigured" }, 503);
  if (!keyOk(request.headers.get("X-Report-Key") || "", env.REPORT_KEY)) {
    await new Promise((r) => setTimeout(r, 400));
    return json({ ok: false, error: "unauthorized" }, 401);
  }
  return null;
}

/* 一張表的筆數、最早／最近一筆、最近 30 天幾筆。全部走索引，一張表只讀幾列。
   表還沒建（那一條線還沒有人用過）→ 當成 0 筆，不要讓整份報告掛掉。 */
async function tableStat(db, table, since30) {
  try {
    const r = await db.prepare(
      `SELECT (SELECT MAX(id) FROM ${table}) AS hi,
              (SELECT MIN(id) FROM ${table}) AS lo,
              (SELECT MIN(at) FROM ${table}) AS first,
              (SELECT MAX(at) FROM ${table}) AS last,
              (SELECT id FROM ${table} WHERE at >= ? ORDER BY at LIMIT 1) AS lo30`
    ).bind(since30).first();
    if (!r || r.hi == null) return { rows: 0, first: null, last: null, recent30: 0 };
    return {
      rows: r.hi - r.lo + 1,
      first: r.first,
      last: r.last,
      recent30: r.lo30 == null ? 0 : r.hi - r.lo30 + 1,
    };
  } catch {
    return { rows: 0, first: null, last: null, recent30: 0 };
  }
}

/* 整個資料庫的位元組數。D1 在每一次查詢的 meta 裡都附上 size_after；
   讀不到（本機的假 D1、或 D1 哪天改了欄位名）就回 null，報告頁會說「量不到」，不會亂猜。 */
async function dbBytes(db) {
  try {
    const r = await db.prepare("SELECT 1").all();
    const n = r && r.meta && r.meta.size_after;
    return typeof n === "number" && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/* =============================================================================
   GET /api/store-report
   ============================================================================= */
export async function storeReport(request, env) {
  const denied = await gate(request, env);
  if (denied) return denied;

  const since30 = agoIso(30);
  const out = [];
  for (const d of DBS) {
    const db = env[d.binding];
    if (!db) continue;
    const tables = [];
    for (const t of d.tables) tables.push({ table: t, label: TABLES[t].label, ...(await tableStat(db, t, since30)) });
    let counter = null;
    if (d.counter) {
      try {
        const r = await db.prepare("SELECT COUNT(*) AS n, SUM(views) AS v FROM page_views").first();
        counter = { pages: r ? r.n : 0, views: r ? r.v || 0 : 0 };   /* 一頁一列，幾十列而已 */
      } catch { counter = null; }
    }
    out.push({ binding: d.binding, name: d.name, label: d.label, bytes: await dbBytes(db),
               limit: DB_LIMIT, warnAt: WARN_AT, tables, counter });
  }
  return json({ ok: true, now: nowIso(), page: PAGE, dbs: out });
}

/* =============================================================================
   GET /api/export?table=click_log&month=2026-09&after=0
   -----------------------------------------------------------------------------
   month 是台灣時間的月份還是 UTC？——**UTC**，和 at 欄位同一套（字串比較才對）。
   差的只有每月 1 日凌晨 0~8 點那幾筆會落在前一個月的檔案裡，備份不會少任何一筆。
   table=page_views 是例外：計數器一頁一列，沒有月份，一次全給。
   ============================================================================= */
export async function exportRows(request, url, env) {
  const denied = await gate(request, env);
  if (denied) return denied;

  const table = url.searchParams.get("table") || "";
  const d = DBS.find((x) => env[x.binding] && (x.tables.includes(table) || (x.counter && table === "page_views")));
  if (!d) return json({ ok: false, error: "bad table" }, 400);
  const db = env[d.binding];

  if (table === "page_views") {
    const r = await db.prepare("SELECT slug, views, updated_at FROM page_views ORDER BY views DESC").all();
    return json({ ok: true, table, cols: ["slug", "views", "updated_at"], rows: r.results || [], next: null });
  }

  const month = url.searchParams.get("month") || "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return json({ ok: false, error: "bad month" }, 400);
  const [y, m] = month.split("-").map(Number);
  const end = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const after = Math.max(0, parseInt(url.searchParams.get("after") || "0", 10) || 0);
  const cols = TABLES[table].cols;

  let rows = [];
  try {
    const r = await db.prepare(
      `SELECT ${cols.join(", ")} FROM ${table}
        WHERE at >= ? AND at < ? AND id > ?
        ORDER BY id LIMIT ?`
    ).bind(month, end, after, PAGE).all();
    rows = r.results || [];
  } catch { rows = []; }
  return json({ ok: true, table, month, cols, rows,
                next: rows.length === PAGE ? rows[rows.length - 1].id : null });
}
