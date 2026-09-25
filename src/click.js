/* =============================================================================
   點擊紀錄 —— 寫入與報告（2026-09-20）
   -----------------------------------------------------------------------------
   起因（使用者）：「能記錄網站上的按鈕或超連結點擊次數嗎」→「我覺得都要記」。
   所以記的範圍是**全部**：離站的三件（打電話、開導航、加 LINE）＋ 站內每一顆
   會動的東西（科別標記、文章卡、延伸閱讀、上下篇、頁首頁尾選單、放大鏡、
   夜間開關、回到最上面、停車格、門診表的篩選、地圖上的停車場）。

   這一支只做資料那一側（寫入 ＋ 查詢），路由掛在 src/worker.js，
   前端送資料的是 assets/click-log.js，看報告的是 admin/search/index.html
   （和搜尋紀錄同一頁，上面多一排分頁）。

   ── 四件刻意的設計 ────────────────────────────────────────────────────────
   ① **代碼的白名單在這一側，不在前端。** 同 /api/views 那條線的作法
      （src/allowed-slugs.js）：前端推出來的代碼不算數，這裡對不上就安靜丟掉。
      端點是公開的，不擋的話任何人都能往報告裡塞自己編的項目。
   ② **不存 IP、不存 User-Agent、不發 cookie。** 理由同 src/search.js 的檔頭：
      這是牙醫診所的站。點擊比搜尋字串更容易串成軌跡（「誰在幾點看了植牙那篇、
      然後打了電話」），所以這裡更要守住——存的只有「哪一顆、在哪一頁、什麼時候」。
      ⚠ 要加任何能串起同一個人的欄位（連 session id 也算）之前先想清楚個資法那條線。
   ③ **時間戳、期間這把尺、密碼比對，三件都和搜尋紀錄共用同一支**
      （從 src/search.js 匯入）。兩份報告的「一週」要指同一段時間，
      各寫一份遲早會走鐘。
   ④ **一次一筆，不在前端累積後批次送。** 累積的話「還沒送出就關掉分頁」
      那幾筆會整批不見，而點擊最有價值的那幾顆（打電話、開導航）正好都是
      「按下去就離開這一頁」的。
   ============================================================================= */

import { ALLOWED } from "./allowed-slugs.js";
import { nowIso, agoIso, keyOk, WINDOWS } from "./search.js";

/* 一天最多收幾筆。點擊比搜尋密得多，所以上限比那邊（5000）鬆，
   但仍然要有——這是公開端點，沒有上限就是一張可以被灌爆的資料表。
   ⚠ 這個數字和 D1 的免費額度綁在一起：一筆點擊是**兩次寫入**
   （配額那一列 ＋ 紀錄那一列），20000 筆 ＝ 40000 次，
   加上計數器（每次瀏覽一次寫入）仍然在每天十萬次以內。 */
const DAY_CAP = 20000;

/* 站上那七科。和 tools/topic-copy.mjs 的鍵一致——那邊多一科的話這裡要跟著加，
   不然新那一科的標記按下去會被當成偽造的代碼丟掉。 */
const SPECS = new Set(["general", "perio", "endo", "kids", "ortho", "prosth", "surg"]);

/* 地圖上的三處停車場。a ＝ 斗六永樂站、b ＝ 合廷、c ＝ 壹車房，
   對應 index.html 那三個 data-lot（不要重新編號，舊資料會對不上）。 */
const LOTS = new Set(["a", "b", "c"]);

/* 醫師卡上有自己臉書粉專的那幾位（2026-09-25 起）。對應 index.html 那顆 .doc-fb 的 data-doc。
   ⚠ 再加一位醫師的粉專時這裡要跟著加，不然他那一顆按下去的紀錄會被當成偽造的丟掉。 */
const DOC_FB = new Set(["liao-liyang"]);

/* 沒有參數的那些。⚠ 這張表就是「站上有哪些可以按的東西」的清單，
   版面上新增一顆要按的東西時，這裡與 assets/click-log.js 的規則表要一起加。 */
const FLAT = new Set([
  "tel",            /* 撥電話（首頁窄帶、頁尾、七科頁、每一篇文章頁尾） */
  "line",           /* LINE 官方帳號。⚠ 站上目前沒有任何一個看得到的 LINE 連結
                       （只在 JSON-LD 的 sameAs 裡），先留著——哪天頁尾放一顆，
                       前端那支不必改就會開始記。 */
  "map:clinic",     /* 地址那一行 → Google 地圖（hero 與頁尾） */
  "map:pin",        /* 簡易地圖上的診所綠塊／圖釘 → Google 地圖 */
  "brand",          /* 頁首標誌回首頁 */
  "skip",           /* 跳到主要內容（無障礙的那一條） */
  "hero-cue",       /* HERO 底下那顆「往下看主題與科別」 */
  "search-open",    /* 頁首的放大鏡 */
  "search-close",   /* 搜尋列的 ✕ */
  "btt",            /* 回到最上面 */
  "bays",           /* 地圖上的「鄰近停車格」標籤 */
  "back-list",      /* 文章頁的「← 回文章列表」 */
]);

/* 有參數的那些：前綴 → 值合不合法。
   回傳原字串（合法）或 null（不合法，安靜丟掉）。 */
const POSTS = new Set(ALLOWED.filter((s) => s !== "home"));
const HASHES = new Set(["topics", "doctors", "clinic", "articles"]);

export function normCode(raw) {
  const code = String(raw == null ? "" : raw).trim().toLowerCase().slice(0, 40);
  if (!code) return null;
  if (FLAT.has(code)) return code;

  const i = code.indexOf(":");
  if (i < 1) return null;
  const k = code.slice(0, i), v = code.slice(i + 1);
  switch (k) {
    case "park":                        /* 停車場的名字 → Google 地圖 */
    case "lot":                         /* 地圖上點停車場那一塊（展開牌子） */
      return LOTS.has(v) ? code : null;
    case "chip":                        /* 「主題與科別」那一排 */
    case "hours":                       /* 門診表上的科別篩選 */
      return v === "all" || SPECS.has(v) ? code : null;
    case "fb":                          /* 醫師卡上的臉書粉專（離站） */
      return DOC_FB.has(v) ? code : null;
    case "tag":                         /* 文章頁最上面那顆科別標記 */
      return SPECS.has(v) ? code : null;
    case "nav":                         /* 頁首選單 */
    case "foot":                        /* 頁尾的站內導覽 */
    case "count":                       /* 著陸頁那句「N 位醫師・N 篇文章」 */
      return HASHES.has(v) ? code : null;
    case "card":                        /* 首頁／著陸頁的文章卡 */
    case "rel":                         /* 文章頁底下的延伸閱讀 */
    case "prev":                        /* 上一篇 */
    case "next":                        /* 下一篇 */
      return POSTS.has(v) ? code : null;
    case "theme":                       /* 夜間開關。值是**切過去之後**的那一邊 */
      return v === "dark" || v === "light" ? code : null;
    default:
      return null;
  }
}

/* 從哪一頁按的。home／topic:<spec>／post:<slug> 三種。
   ⚠ 和搜尋紀錄的 scope 多了 post: 那一種——搜尋框只出現在首頁與七科頁，
     點擊則是每一頁都有。 */
export function normScope(raw) {
  const v = String(raw == null ? "" : raw).trim().toLowerCase();
  if (v === "home") return "home";
  let m = /^topic:([a-z]{2,10})$/.exec(v);
  if (m) return SPECS.has(m[1]) ? v : null;
  m = /^post:([a-z0-9-]{2,40})$/.exec(v);
  if (m) return POSTS.has(m[1]) ? v : null;
  return null;
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS click_log (
     id    INTEGER PRIMARY KEY AUTOINCREMENT,
     code  TEXT    NOT NULL,
     scope TEXT    NOT NULL,
     at    TEXT    NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_click_at   ON click_log (at)`,
  `CREATE INDEX IF NOT EXISTS idx_click_code ON click_log (code)`,
  `CREATE TABLE IF NOT EXISTS click_quota (
     day TEXT PRIMARY KEY,
     n   INTEGER NOT NULL DEFAULT 0
   )`,
];

/* ⚠ 旗標綁在資料庫物件上，不要用模組層級的 let——理由同 src/search.js 的 READY。 */
const READY = new WeakSet();
async function ensure(env) {
  if (READY.has(env.DB)) return;
  await env.DB.batch(DDL.map((s) => env.DB.prepare(s)));
  READY.add(env.DB);
}

/* =============================================================================
   POST /api/click —— 記一筆
   -----------------------------------------------------------------------------
   前端用 navigator.sendBeacon 送（見 assets/click-log.js），送出去的
   Content-Type 是 text/plain，所以**不能用 request.json()**。
   回應一律 { ok: true }，被配額擋掉或代碼不合法時也一樣：beacon 沒有人在聽回應，
   而回錯誤等於告訴對方「這裡有一道可以打的門」。
   ============================================================================= */
export async function logClick(request, env) {
  const ok = () =>
    new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 300) return ok();          /* 正常的一筆不到 60 位元組 */
    body = JSON.parse(raw);
  } catch {
    return ok();
  }

  const code = normCode(body && body.code);
  const scope = normScope(body && body.scope);
  if (!code || !scope) return ok();

  await ensure(env);

  const day = nowIso().slice(0, 10);
  const quota = await env.DB.prepare(
    `INSERT INTO click_quota (day, n) VALUES (?, 1)
       ON CONFLICT (day) DO UPDATE SET n = n + 1
     RETURNING n`
  ).bind(day).first();
  if (quota && quota.n > DAY_CAP) return ok();

  await env.DB.prepare(
    `INSERT INTO click_log (code, scope, at) VALUES (?, ?, ?)`
  ).bind(code, scope, nowIso()).run();

  return ok();
}

/* =============================================================================
   GET /api/click-report —— 報告要的數字
   -----------------------------------------------------------------------------
   密碼和搜尋紀錄同一組（Cloudflare 加密變數 REPORT_KEY），報告也在同一頁，
   所以這裡不要另立一把鑰匙——兩把的話使用者要記兩串亂碼。
   ============================================================================= */
export async function clickReport(request, url, env) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });

  /* 後台還沒設 REPORT_KEY：一律拒絕，但要說實話（理由同 src/search.js）。 */
  if (!env.REPORT_KEY) return json({ ok: false, error: "unconfigured" }, 503);

  if (!keyOk(request.headers.get("X-Report-Key") || "", env.REPORT_KEY)) {
    await new Promise((r) => setTimeout(r, 400));
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const raw = url.searchParams.get("win");
  const win = WINDOWS[raw] === undefined ? 30 : WINDOWS[raw];
  const since = win ? agoIso(win) : "0000";

  await ensure(env);

  const [rows, sums, recent, span] = await env.DB.batch([
    /* 排名：同一顆在同一種頁面上累計。
       ⚠ 不要在這裡就把 scope 合併掉——「文章頁的電話」和「首頁的電話」
         是兩件不同的事（前者代表文章真的把人帶到要打電話的地步）。
         報告頁那排「來源」的尺才決定要不要合。 */
    env.DB.prepare(
      `SELECT code, scope, COUNT(*) AS n, MAX(at) AS last
         FROM click_log
        WHERE at >= ?
        GROUP BY code, scope
        ORDER BY n DESC, last DESC
        LIMIT 600`
    ).bind(since),
    env.DB.prepare(
      `SELECT scope, COUNT(*) AS n, COUNT(DISTINCT code) AS uniq
         FROM click_log
        WHERE at >= ?
        GROUP BY scope`
    ).bind(since),
    /* 逐筆明細。只回最近 200 筆，理由同搜尋紀錄。 */
    env.DB.prepare(
      `SELECT code, scope, at
         FROM click_log
        WHERE at >= ?
        ORDER BY at DESC, id DESC
        LIMIT 200`
    ).bind(since),
    env.DB.prepare(`SELECT MIN(at) AS first, COUNT(*) AS n FROM click_log`),
  ]);

  return json({
    ok: true,
    now: nowIso(),
    win: raw || "30d",
    since: win ? since : null,
    rows: rows.results || [],
    sums: sums.results || [],
    recent: recent.results || [],
    span: (span.results && span.results[0]) || { first: null, n: 0 },
  });
}
