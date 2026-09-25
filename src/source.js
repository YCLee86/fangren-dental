/* =============================================================================
   來源紀錄 —— 寫入與報告（2026-09-25）
   -----------------------------------------------------------------------------
   起因（使用者）：「有辦法記錄使用者是從那邊進入網站的嗎」。
   同一輪也請他打開 Cloudflare 的 Web Analytics（B 案），這一支是 A 案：
   和搜尋紀錄、點擊紀錄放在同一頁報告裡，所以「從 LINE 進來的人按了什麼」
   可以在同一個期間裡對著看。

   這一支只做資料那一側（寫入 ＋ 查詢），路由掛在 src/worker.js，
   前端送資料的是 assets/source-log.js，看報告的是 admin/search/index.html
   （第三個分頁）。

   ── 記什麼 ────────────────────────────────────────────────────────────────
   **只在「從站外進來的那一下」記一筆**，站內換頁不記。一筆只有五欄：
     src   歸好類的來源（google／line／facebook／direct…，見 BUCKETS）
     via   這個來源是怎麼認出來的：tag ＝ 網址上的 ?from=、ref ＝ 瀏覽器帶的
           referrer、none ＝ 兩個都沒有（直接輸入、書籤、App 內瀏覽器沒帶）
     host  referrer 的**網域**（只有 via=ref 才有）。報告上「其他網站」要靠它
           才知道是哪一站；⚠ 只存網域，**整段網址不存**——搜尋引擎、論壇的
           網址裡可能帶著他搜的字或他的帳號
     page  進站的第一頁（home／topic:<spec>／post:<slug>，白名單同點擊紀錄）
     at    ISO 時間戳

   ── 三件刻意的設計 ────────────────────────────────────────────────────────
   ① **和另外兩份同一條紅線：不存 IP、不存 User-Agent、不發 cookie、沒有流水號。**
      理由在 src/search.js 與 src/click.js 的檔頭——這是牙醫診所的站。
      「從哪裡來」本身不是個資，但只要多一個能串起同一個人的欄位，
      它就能和點擊紀錄接成「這個人從 LINE 進來、看了植牙、打了電話」。
   ② **歸類在這一側做，不在前端做。** 前端只送它看到的網域與 ?from= 的值；
      哪個網域算 Google、哪個算 LINE 由這裡決定。改規則只要改這一支，
      而且 host 原樣存著，歸錯了日後還能重算。
   ③ **?from= 的值是白名單**（TAGS）。這個參數是我們自己貼在 LINE 圖文選單、
      Google 商家檔案上的，值是我們定的；對不上的一律當成沒帶，
      不讓任何人往報告裡塞自己編的來源。
   ============================================================================= */

import { nowIso, agoIso, keyOk, WINDOWS } from "./search.js";
import { normScope } from "./click.js";

/* 一天最多收幾筆。一次瀏覽最多一筆，而且只有從站外進來的那一下才算，
   所以一定比計數器少——這個數字擋的是有人拿端點灌資料表，不是正常流量。 */
const DAY_CAP = 5000;

/* ?from= 的值 → 來源。⚠ 要貼新的地方（例如門口立牌的 QR）先在這裡加一個值，
   前端那支不必改。報告頁的 SRC 表也要加一個中文名字（漏加只會印出英文代碼）。 */
export const TAGS = {
  line: "line",        /* LINE 官方帳號的圖文選單、自動回應、訊息卡 */
  gbp: "gbp",          /* Google 商家檔案（地圖上那一格「網站」） */
  fb: "facebook",      /* 臉書粉專 */
  ig: "instagram",
  qr: "qr",            /* 印出來的東西上的 QR code */
};

/* 網域 → 來源。由上往下比，**第一條對上的就算**，所以順序有意義：
   gemini.google.com 要先被 ai 接走，不然會落進 google。
   ⚠ Android 上從 App 點出來時 referrer 是 android-app://<套件名>/，
     網域那一段就是套件名（com.google.android.gm、jp.naver.line.android），
     所以底下有幾條是套件名不是網址。 */
const BUCKETS = [
  ["ai",        /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|copilot\.microsoft\.com)$|^gemini\.google\.com$/],
  ["line",      /(^|\.)(line\.me|line-apps\.com|naver\.jp)$|^jp\.naver\.line\./],
  ["facebook",  /(^|\.)(facebook\.com|fb\.com|fb\.me)$|^com\.facebook\./],
  ["instagram", /(^|\.)instagram\.com$|^com\.instagram\./],
  ["threads",   /(^|\.)threads\.(net|com)$/],
  ["youtube",   /(^|\.)(youtube\.com|youtu\.be)$/],
  ["google",    /(^|\.)google(\.[a-z]{2,3}){1,2}$|^com\.google\.android\.googlequicksearchbox$/],
  ["bing",      /(^|\.)bing\.com$/],
  ["yahoo",     /(^|\.)yahoo(\.[a-z]{2,3}){1,2}$/],
  ["other",     /./],
];

/* 報告上會出現的全部來源（驗 src 欄位、也給守門用）。 */
export const SOURCES = new Set([...BUCKETS.map((b) => b[0]), ...Object.values(TAGS), "direct"]);

/* 網域的形狀：小寫英數、點、連字號，最長 80。
   ⚠ 這一步同時是個資的閘門——對不上的就不存，不會有路徑或查詢字串混進來。 */
export function normHost(raw) {
  const h = String(raw == null ? "" : raw).trim().toLowerCase().replace(/^www\./, "");
  return /^[a-z0-9](?:[a-z0-9.-]{0,78}[a-z0-9])?$/.test(h) && h.includes(".") ? h : null;
}

/* 前端送來的 { from, host } → { src, via, host }。
   先看 ?from=（我們自己貼的標記最可靠），再看 referrer，兩個都沒有就是 direct。 */
export function classify(from, host) {
  const tag = String(from == null ? "" : from).trim().toLowerCase();
  if (TAGS[tag]) return { src: TAGS[tag], via: "tag", host: null };
  const h = normHost(host);
  if (h) {
    for (const [src, re] of BUCKETS) if (re.test(h)) return { src, via: "ref", host: h };
  }
  return { src: "direct", via: "none", host: null };
}

const DDL = [
  `CREATE TABLE IF NOT EXISTS source_log (
     id   INTEGER PRIMARY KEY AUTOINCREMENT,
     src  TEXT    NOT NULL,
     via  TEXT    NOT NULL,
     host TEXT,
     page TEXT    NOT NULL,
     at   TEXT    NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_source_at  ON source_log (at)`,
  `CREATE INDEX IF NOT EXISTS idx_source_src ON source_log (src)`,
  `CREATE TABLE IF NOT EXISTS source_quota (
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
   POST /api/source —— 記一筆
   -----------------------------------------------------------------------------
   前端用 sendBeacon 送（Content-Type 是 text/plain，所以不能用 request.json()）。
   回應一律 { ok: true }，理由同 src/click.js。
   ============================================================================= */
export async function logSource(request, env) {
  const ok = () =>
    new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 300) return ok();          /* 正常的一筆不到 100 位元組 */
    body = JSON.parse(raw);
  } catch {
    return ok();
  }
  if (!body || typeof body !== "object") return ok();

  const page = normScope(body.page);
  if (!page) return ok();
  const { src, via, host } = classify(body.from, body.host);

  await ensure(env);

  const day = nowIso().slice(0, 10);
  const quota = await env.DB.prepare(
    `INSERT INTO source_quota (day, n) VALUES (?, 1)
       ON CONFLICT (day) DO UPDATE SET n = n + 1
     RETURNING n`
  ).bind(day).first();
  if (quota && quota.n > DAY_CAP) return ok();

  await env.DB.prepare(
    `INSERT INTO source_log (src, via, host, page, at) VALUES (?, ?, ?, ?, ?)`
  ).bind(src, via, host, page, nowIso()).run();

  return ok();
}

/* =============================================================================
   GET /api/source-report —— 報告要的數字（同一把 REPORT_KEY）
   ============================================================================= */
export async function sourceReport(request, url, env) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });

  if (!env.REPORT_KEY) return json({ ok: false, error: "unconfigured" }, 503);

  if (!keyOk(request.headers.get("X-Report-Key") || "", env.REPORT_KEY)) {
    await new Promise((r) => setTimeout(r, 400));
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const raw = url.searchParams.get("win");
  const win = WINDOWS[raw] === undefined ? 30 : WINDOWS[raw];
  const since = win ? agoIso(win) : "0000";

  await ensure(env);

  const [rows, hosts, recent, span] = await env.DB.batch([
    /* 來源 × 進站的第一頁 × 認法。報告頁再決定要怎麼合。 */
    env.DB.prepare(
      `SELECT src, via, page, COUNT(*) AS n, MAX(at) AS last
         FROM source_log
        WHERE at >= ?
        GROUP BY src, via, page
        ORDER BY n DESC, last DESC
        LIMIT 800`
    ).bind(since),
    /* 靠 referrer 認出來的那些，各是哪個網域——「其他網站」只有這張看得出是誰。 */
    env.DB.prepare(
      `SELECT host, src, page, COUNT(*) AS n, MAX(at) AS last
         FROM source_log
        WHERE at >= ? AND host IS NOT NULL
        GROUP BY host, src, page
        ORDER BY n DESC, last DESC
        LIMIT 400`
    ).bind(since),
    env.DB.prepare(
      `SELECT src, via, host, page, at
         FROM source_log
        WHERE at >= ?
        ORDER BY at DESC, id DESC
        LIMIT 200`
    ).bind(since),
    env.DB.prepare(`SELECT MIN(at) AS first, COUNT(*) AS n FROM source_log`),
  ]);

  return json({
    ok: true,
    now: nowIso(),
    win: raw || "30d",
    since: win ? since : null,
    rows: rows.results || [],
    hosts: hosts.results || [],
    recent: recent.results || [],
    span: (span.results && span.results[0]) || { first: null, n: 0 },
  });
}
