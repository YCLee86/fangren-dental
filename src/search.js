/* =============================================================================
   搜尋紀錄 —— 寫入與報告（2026-09-20）
   -----------------------------------------------------------------------------
   起因（使用者）：「我的網站上有放搜尋條　可以記錄使用者的輸入紀錄嗎?」
   接著指定了五件事：每筆要有時間戳、同樣的字累計次數看排名、
   一週／一個月／兩個月／三個月／半年／一年／兩年各自的排名、
   搜到與搜不到要分開、而且只有他看得到。

   這一支只做資料那一側（寫入 ＋ 查詢），路由掛在 src/worker.js，
   前端送資料的是 assets/search-log.js，看報告的是 admin/search/index.html。

   ── 三件刻意的設計 ────────────────────────────────────────────────────────
   ① **不存 IP、不存 User-Agent、不發 cookie。** 這是牙醫診所的站，有人會打
      「牙齦流血會不會是癌」這種字。只要同時存下 IP 或任何能串起同一個人的
      識別碼，它就從「統計」變成「可回溯到個人的健康相關紀錄」。
      存的只有：字串、命中筆數、從哪一區搜的、時間。
      ⚠ 要加 IP 之前請先想清楚個資法那條線，不要順手加。
   ② **時間戳由 Worker 用 ISO 8601（UTC、帶 Z）寫進去**，不用 SQLite 的
      datetime('now')。理由有兩個：ISO 字串**照字典序排就是照時間排**，
      所以區間比較可以直接用字串比；而且 'YYYY-MM-DD HH:MM:SS' 那種格式
      丟進 JS 的 new Date() 各家瀏覽器解讀不一致（有的當本地時間），
      報告頁要換算成台灣時間就會差八小時而且不會報錯。
   ③ **資料表由程式自己建（CREATE TABLE IF NOT EXISTS）**，不必另外去跑
      wrangler。d1-schema.sql 裡有同一份定義，那是給人看的紀錄。
      每個 isolate 只跑一次（ready 這個旗標），不是每次請求都跑。
   ============================================================================= */

/* 一次搜尋最多記幾個字。超過的截掉——正常的查詢不會這麼長，
   會這麼長的多半是貼進來的整段文字或機器人。 */
const MAX_Q = 40;

/* 一天最多收幾筆。這一站的流量離這個數字很遠，它擋的是有人拿這個端點灌資料表
   ——/api/views 是用白名單擋的（只收得了既有的文章代碼），這裡收的是自由文字，
   白名單那一招用不上，所以改用每日總量。滿了就安靜地丟掉，不回錯誤：
   回錯誤等於告訴對方「這裡有一道可以打的門」。 */
const DAY_CAP = 5000;

const DDL = [
  `CREATE TABLE IF NOT EXISTS search_log (
     id    INTEGER PRIMARY KEY AUTOINCREMENT,
     q     TEXT    NOT NULL,
     scope TEXT    NOT NULL DEFAULT 'home',
     hits  INTEGER NOT NULL DEFAULT 0,
     at    TEXT    NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_search_at ON search_log (at)`,
  `CREATE INDEX IF NOT EXISTS idx_search_q  ON search_log (q)`,
  `CREATE TABLE IF NOT EXISTS search_quota (
     day TEXT PRIMARY KEY,
     n   INTEGER NOT NULL DEFAULT 0
   )`,
];

/* ⚠ 這個旗標要**綁在資料庫物件上**，不要用一個模組層級的 let。
   寫成 let 的話「只要這個 isolate 建過一次表就不再建」，換一個 DB 就會撞到
   no such table——正式站只有一個 DB 所以不會發作，但本機拿假的 D1 測試時
   第二個資料庫必炸，而那正是這種錯誤唯一會被發現的地方。 */
const READY = new WeakSet();
async function ensure(env) {
  if (READY.has(env.DB)) return;
  await env.DB.batch(DDL.map((s) => env.DB.prepare(s)));
  READY.add(env.DB);
}

/* 現在時間，ISO 8601、UTC、秒為止（毫秒切掉，省位元組也夠用了）。 */
const nowIso = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
/* n 天前的同一時刻，格式同上——區間查詢就是 `at >= 這個字串`。 */
const agoIso = (days) =>
  new Date(Date.now() - days * 86400000).toISOString().replace(/\.\d+Z$/, "Z");

/* -----------------------------------------------------------------------------
   查詢字串的正規化 —— 寫入與排名共用同一支
   -----------------------------------------------------------------------------
   NFKC 把全形英數與全形空白收成半形（手機注音鍵盤打出來的「ＡＢＣ」和「ABC」
   是兩個不同的字串，不收的話排名會分裂成兩列）。
   ⚠ 空白是**收成一個半形空白**，不是整個拿掉——站上那支篩選器是整個拿掉
   （`replace(/\s+/g, '')`），但那是為了比對，這裡要印在報告上給人讀，
   "root canal" 變成 "rootcanal" 會很難認。
   ⚠ toLowerCase() 對中文是空操作，它只收 ABC/abc。 */
export function normQ(s) {
  return String(s == null ? "" : s)
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, MAX_Q);
}

/* 來源。'home' ＝ 全站搜尋（首頁那個框、頁首放大鏡、從文章頁帶回來的 ?q=），
   'topic:<spec>' ＝ 七科著陸頁右上那個「在這一科裡找」。
   ⚠ 兩者的「搜不到」意思不一樣（頁內那個只找得到該科的內容），
   所以報告上分開算，這裡也分開存。 */
function normScope(s) {
  const v = String(s == null ? "" : s).trim().toLowerCase();
  if (v === "home") return "home";
  const m = /^topic:([a-z]{2,10})$/.exec(v);
  return m ? `topic:${m[1]}` : null;
}

/* 看起來像機器人或貼上整串網址的，直接不收。 */
function looksJunk(q) {
  return !q || /https?:|:\/\/|<[a-z/]/i.test(q);
}

/* =============================================================================
   POST /api/search —— 記一筆
   -----------------------------------------------------------------------------
   前端是用 navigator.sendBeacon 送的（見 assets/search-log.js），
   那支送出去的 Content-Type 是 text/plain，所以**不能用 request.json()**
   ——要自己讀 text 再 parse。
   回應一律是 { ok: true }，連被配額擋掉、被判定成垃圾的時候也一樣：
   前端不需要知道，而且 beacon 本來就沒有人在聽回應。
   ============================================================================= */
export async function logSearch(request, env) {
  const ok = () =>
    new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 500) return ok();          /* 正常的一筆不到 120 位元組 */
    body = JSON.parse(raw);
  } catch {
    return ok();
  }

  const q = normQ(body && body.q);
  const scope = normScope(body && body.scope);
  if (!q || !scope || looksJunk(q)) return ok();

  const hits = Math.max(0, Math.min(999, parseInt(body && body.hits, 10) || 0));

  await ensure(env);

  /* 先加配額再決定收不收。兩次往返，這個流量完全不成問題。 */
  const day = nowIso().slice(0, 10);
  const quota = await env.DB.prepare(
    `INSERT INTO search_quota (day, n) VALUES (?, 1)
       ON CONFLICT (day) DO UPDATE SET n = n + 1
     RETURNING n`
  ).bind(day).first();
  if (quota && quota.n > DAY_CAP) return ok();

  await env.DB.prepare(
    `INSERT INTO search_log (q, scope, hits, at) VALUES (?, ?, ?, ?)`
  ).bind(q, scope, hits, nowIso()).run();

  return ok();
}

/* =============================================================================
   GET /api/search-report —— 報告要的數字
   -----------------------------------------------------------------------------
   密碼放在 Cloudflare 的加密環境變數 REPORT_KEY（後台 Settings → Variables），
   **不在這個 repo 裡**——repo 是 public 的，寫進來等於沒鎖。
   沒設 REPORT_KEY 的時候一律拒絕（fail closed），不會變成「沒設＝不用密碼」。
   ============================================================================= */
const WINDOWS = {
  "7d": 7, "30d": 30, "60d": 60, "90d": 90,
  "180d": 180, "365d": 365, "730d": 730, all: 0,
};

/* 定時比較，不要用 ===。字串比較會在第一個不同的位元組就回來，
   逐位元組試出密碼是真的做得到的事。 */
function keyOk(given, want) {
  if (!want) return false;
  const enc = new TextEncoder();
  const a = enc.encode(String(given == null ? "" : given));
  const b = enc.encode(String(want));
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function searchReport(request, url, env) {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        /* 這份資料只有自己人看，別人的網頁不准拿去讀 */
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });

  /* 後台還沒設 REPORT_KEY —— 這時候一律拒絕（fail closed，不會變成「沒設＝不用密碼」），
     但要**說實話**。回「密碼不對」的話，人會在一組其實是對的密碼上反覆試，
     而真正的原因在伺服器那一側，他怎麼試都不會對。
     ⚠ 這句話等於承認「這裡有一個還沒設定好的端點」，但它同時什麼都不給——
       沒設的時候它拒絕**所有**請求，所以講清楚不會換來任何存取。
       設好之後這句話就再也不會出現。 */
  if (!env.REPORT_KEY) {
    return json({ ok: false, error: "unconfigured" }, 503);
  }

  const given = request.headers.get("X-Report-Key") || "";
  if (!keyOk(given, env.REPORT_KEY)) {
    /* 慢一點回，猜密碼的成本才不會等於零 */
    await new Promise((r) => setTimeout(r, 400));
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const win = WINDOWS[url.searchParams.get("win")] === undefined
    ? 30
    : WINDOWS[url.searchParams.get("win")];
  /* all ＝ 0 天 ＝ 不設下界。用一個排在所有 ISO 字串前面的值。 */
  const since = win ? agoIso(win) : "0000";

  await ensure(env);

  const [rows, sums, recent, span] = await env.DB.batch([
    /* 排名：同一個字在同一區累計。miss ＝ 其中幾次是零筆。
       ⚠ 同一個字可能有時候搜得到、有時候搜不到（站上後來多了那篇文章），
         所以**不是**把字分成兩堆，是每一列都帶著 n 與 miss，
         報告頁再各自排。這樣不會有一個字在兩張表裡互相矛盾。 */
    env.DB.prepare(
      `SELECT q, scope, COUNT(*) AS n,
              SUM(CASE WHEN hits = 0 THEN 1 ELSE 0 END) AS miss,
              MAX(at) AS last
         FROM search_log
        WHERE at >= ?
        GROUP BY q, scope
        ORDER BY n DESC, last DESC
        LIMIT 600`
    ).bind(since),
    env.DB.prepare(
      `SELECT scope, COUNT(*) AS n,
              SUM(CASE WHEN hits = 0 THEN 1 ELSE 0 END) AS miss,
              COUNT(DISTINCT q) AS uniq
         FROM search_log
        WHERE at >= ?
        GROUP BY scope`
    ).bind(since),
    /* 逐筆明細（使用者第 1 點：每個紀錄都要有時間戳記）。
       只回最近 200 筆——再多在手機上也捲不完，而且要看更久以前的
       就把上面那把尺往外拉。 */
    env.DB.prepare(
      `SELECT q, scope, hits, at
         FROM search_log
        WHERE at >= ?
        ORDER BY at DESC, id DESC
        LIMIT 200`
    ).bind(since),
    /* 資料從哪一天開始、總共幾筆——報告頁要用它說清楚
       「兩年」那一格現在其實只有多久的資料。 */
    env.DB.prepare(`SELECT MIN(at) AS first, COUNT(*) AS n FROM search_log`),
  ]);

  return json({
    ok: true,
    now: nowIso(),
    win: url.searchParams.get("win") || "30d",
    since: win ? since : null,
    rows: rows.results || [],
    sums: sums.results || [],
    recent: recent.results || [],
    span: (span.results && span.results[0]) || { first: null, n: 0 },
  });
}
