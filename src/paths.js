/* =============================================================================
   訪客軌跡 —— 寫入與報告的資料（2026-09-26）
   -----------------------------------------------------------------------------
   起因（使用者）：「我現在想知道軌跡……有沒有什麼可歸納的模式」→ 同一天
   「紅線可以解開」「都保留」「軌跡開工」。定了的七件在 DECISIONS.md「訪客軌跡」那一列。

   這一支只做資料那一側，路由掛在 src/worker.js；前端送資料的是 assets/path-log.js，
   歸納（路徑、轉移表、訪客類型）在 assets/path-summary.js，報告在 /admin/search/ 的「訪客軌跡」。

   ── 五件刻意的設計 ────────────────────────────────────────────────────────
   ① **另一個資料庫**（binding 叫 PATHS，名稱 fangren-dental-paths）。全部保留、會一直長，
      滿了不可以拖累瀏覽數與另外三份紀錄。**沒綁的時候整條線安靜地不作用**（寫入回 ok、
      報告回 off），不會報錯——所以 wrangler.toml 還沒加那一段之前推上線也不會壞。
   ② **識別碼只有分頁代碼 sid**：前端隨機產生、存 sessionStorage（不是 cookie），
      關掉分頁就沒了、30 分鐘沒動作換一組。**仍然沒有 IP、UA、cookie**。
      它只串得起「這一次來訪」，認不出同一個人隔天又來——那是這條線的界線，
      ⚠ 不要為了串得更完整加任何能跨來訪認人的東西。
   ③ **代碼與頁面沿用點擊紀錄的白名單**（normCode／normScope），來源沿用來源紀錄的
      classify()——三份報告的「首頁」「撥電話」「LINE」指的必須是同一件事。
   ④ **歸納不在 Worker 裡做**：免費方案一次請求只有 10 ms 的 CPU。Worker 只負責
      「給原始逐筆」與「收一天的摘要存起來」，路徑、轉移表、分類都在報告頁的瀏覽器裡算。
      一天結束 3 小時後（跨午夜還在逛的人也走完了）那一天就算定，摘要存進 path_day，
      之後打開報告只讀摘要——**原始逐筆一天只會被讀一次**（使用者：「讀取不一定要全跑」）。
   ⑤ **一天以台灣時間切**（報告上的「一週」「一個月」是他的日子，不是 UTC 的），
      一次來訪算在它第一筆那一天。
   ============================================================================= */

import { nowIso, keyOk } from "./search.js";
import { normCode, normScope } from "./click.js";
import { classify } from "./source.js";

/* 一天最多收幾筆。一筆是兩次寫入（配額 ＋ 紀錄），D1 免費方案每天 10 萬次寫入是
   **整個帳號共用**的，另外三份紀錄與計數器也在裡面——所以這裡不能開太大。 */
const DAY_CAP = 20000;
/* 一次來訪最多記幾步。擋的是機器人或開著不關的分頁，不是正常人。 */
const MAX_N = 300;
/* 給原始逐筆時一段最多幾筆，同 src/store.js 的 PAGE。 */
const PAGE = 20000;
/* 一天結束之後多久才算定（還在逛的人要走完）。前端的 30 分鐘閒置是上限，這裡留寬一點。 */
export const SETTLE_H = 3;
/* 摘要的格式版本。assets/path-summary.js 的 V 要一致；改了格式要加一，
   報告頁看到版本不符的那幾天會重算、蓋掉舊的。 */
export const V = 2;          /* 2：2026-09-26 加上「讀到哪裡」 */

export const SID = /^[a-z0-9]{12}$/;

const DDL = [
  `CREATE TABLE IF NOT EXISTS path_log (
     id    INTEGER PRIMARY KEY AUTOINCREMENT,
     sid   TEXT    NOT NULL,
     n     INTEGER NOT NULL,
     kind  TEXT    NOT NULL,
     scope TEXT    NOT NULL,
     code  TEXT,
     src   TEXT,
     back  INTEGER NOT NULL DEFAULT 0,
     at    TEXT    NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_path_at  ON path_log (at)`,
  `CREATE INDEX IF NOT EXISTS idx_path_sid ON path_log (sid, n)`,
  /* 每一頁讀到哪裡（2026-09-26）。一頁可能不只一筆（切走又回來會再送，數字只會變大），
     報告取同一個 (sid, ref) 的最大值。ref ＝ 那一頁在 path_log 裡的 n。 */
  `CREATE TABLE IF NOT EXISTS path_read (
     id    INTEGER PRIMARY KEY AUTOINCREMENT,
     sid   TEXT    NOT NULL,
     ref   INTEGER NOT NULL,
     scope TEXT    NOT NULL,
     depth INTEGER NOT NULL,
     sec   INTEGER NOT NULL,
     total INTEGER NOT NULL,
     secs  INTEGER NOT NULL,
     at    TEXT    NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_read_at ON path_read (at)`,
  `CREATE TABLE IF NOT EXISTS path_quota (
     day TEXT PRIMARY KEY,
     n   INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE TABLE IF NOT EXISTS path_day (
     day  TEXT PRIMARY KEY,
     v    INTEGER NOT NULL,
     data TEXT    NOT NULL,
     at   TEXT    NOT NULL
   )`,
];

/* ⚠ 旗標綁在資料庫物件上，理由同 src/search.js 的 READY。 */
const READY = new WeakSet();
async function ensure(db) {
  if (READY.has(db)) return;
  await db.batch(DDL.map((s) => db.prepare(s)));
  READY.add(db);
}

/* 台灣時間的某一天 → 那一天在 UTC 的起點（ISO，秒為止）。 */
export function dayStart(day) {
  return new Date(`${day}T00:00:00+08:00`).toISOString().replace(/\.\d+Z$/, "Z");
}
export function twDay(iso) {
  return new Date(new Date(iso).getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
const DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/* =============================================================================
   POST /api/path —— 記一步
   body: { sid, n, k: 'v'|'c', s: scope, c?: code, b?: 1, f?: from, h?: host, i?: 1 }
     或  { sid, k: 'r', r: ref, s: scope, d: 0~100, x: 讀到第幾節, y: 共幾節, t: 秒 }（讀到哪裡，不是一步）
     k 'v' ＝ 看了一頁（b ＝ 上一頁／下一頁回來的）、'c' ＝ 按了一顆
     f／h 只有這次來訪的第一步才帶（同來源紀錄：?from= 的值與 referrer 的網域）；
     i ＝ 閒置超過 30 分鐘後在站內接著逛（換了一組代碼，但不是從站外進來的）
   回應一律 { ok: true }，理由同 src/click.js。
   ============================================================================= */
export async function logPath(request, env) {
  const ok = () =>
    new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  const db = env.PATHS;
  if (!db) return ok();

  let b;
  try {
    const raw = await request.text();
    if (raw.length > 400) return ok();
    b = JSON.parse(raw);
  } catch {
    return ok();
  }
  if (!b || typeof b !== "object") return ok();

  const sid = String(b.sid || "");
  if (!SID.test(sid)) return ok();
  const scope = normScope(b.s);
  if (!scope) return ok();

  if (b.k === "r") {
    const ref = Number(b.r), d = Number(b.d), x = Number(b.x), y = Number(b.y), t = Number(b.t);
    const int = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
    if (!int(ref, 1, MAX_N) || !int(d, 0, 100) || d % 10 || !int(y, 0, 60) || !int(x, 0, y) || !int(t, 0, 7200)) return ok();
    await ensure(db);
    const at = nowIso();
    const quota = await db.prepare(
      `INSERT INTO path_quota (day, n) VALUES (?, 1)
         ON CONFLICT (day) DO UPDATE SET n = n + 1
       RETURNING n`
    ).bind(at.slice(0, 10)).first();
    if (quota && quota.n > DAY_CAP) return ok();
    await db.prepare(
      `INSERT INTO path_read (sid, ref, scope, depth, sec, total, secs, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(sid, ref, scope, d, x, y, t, at).run();
    return ok();
  }

  const n = Number(b.n);
  if (!Number.isInteger(n) || n < 1 || n > MAX_N) return ok();
  let kind, code = null, src = null, back = 0;
  if (b.k === "v") {
    kind = "view";
    back = b.b ? 1 : 0;
    if (n === 1) src = b.i ? "resume" : classify(b.f, b.h).src;
  } else if (b.k === "c") {
    kind = "click";
    code = normCode(b.c);
    if (!code) return ok();
  } else {
    return ok();
  }

  await ensure(db);
  const at = nowIso();
  const quota = await db.prepare(
    `INSERT INTO path_quota (day, n) VALUES (?, 1)
       ON CONFLICT (day) DO UPDATE SET n = n + 1
     RETURNING n`
  ).bind(at.slice(0, 10)).first();
  if (quota && quota.n > DAY_CAP) return ok();

  await db.prepare(
    `INSERT INTO path_log (sid, n, kind, scope, code, src, back, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(sid, n, kind, scope, code, src, back, at).run();
  return ok();
}

/* =============================================================================
   /api/path-report —— 報告頁要的資料（一律要 X-Report-Key）
     GET  ?op=days&since=YYYY-MM-DD      → 已經算好的每日摘要 ＋ 最早一筆的時間
     GET  ?op=rows&from=ISO&to=ISO&after=id → 一段時間的原始逐筆（一段最多 PAGE 筆）
     GET  ?op=recent                     → 最近 30 次來訪的逐筆
     POST ?op=day   body { day, v, data } → 存一天的摘要（那一天要已經算定）
   ============================================================================= */
export async function pathReport(request, url, env) {
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
  const db = env.PATHS;
  if (!db) return json({ ok: true, off: true, now: nowIso() });
  await ensure(db);

  const op = url.searchParams.get("op") || "";

  if (request.method === "POST" && op === "day") {
    let b;
    try {
      const raw = await request.text();
      if (raw.length > 600000) return json({ ok: false, error: "too large" }, 400);
      b = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: "bad body" }, 400);
    }
    const day = String((b && b.day) || "");
    if (!DAY.test(day) || b.v !== V || typeof b.data !== "string") return json({ ok: false, error: "bad day" }, 400);
    try { JSON.parse(b.data); } catch { return json({ ok: false, error: "bad data" }, 400); }
    /* 還沒算定的日子不收——存進去就不會再重算，半天的數字會永遠留在報告上。 */
    const end = new Date(dayStart(day)).getTime() + (24 + SETTLE_H) * 3600000;
    if (Date.now() < end) return json({ ok: false, error: "not settled" }, 400);
    await db.prepare(
      `INSERT INTO path_day (day, v, data, at) VALUES (?, ?, ?, ?)
         ON CONFLICT (day) DO UPDATE SET v = excluded.v, data = excluded.data, at = excluded.at`
    ).bind(day, V, b.data, nowIso()).run();
    return json({ ok: true });
  }
  if (request.method !== "GET") return json({ ok: false, error: "method not allowed" }, 405);

  if (op === "days") {
    const since = url.searchParams.get("since") || "0000-01-01";
    if (!DAY.test(since) && since !== "0000-01-01") return json({ ok: false, error: "bad since" }, 400);
    const [days, first] = await db.batch([
      db.prepare(`SELECT day, v, data FROM path_day WHERE day >= ? ORDER BY day`).bind(since),
      db.prepare(`SELECT (SELECT MIN(at) FROM path_log) AS first`),   /* 走索引，讀一列 */
    ]);
    return json({ ok: true, now: nowIso(), settleH: SETTLE_H, v: V,
                  first: (first.results && first.results[0] && first.results[0].first) || null,
                  days: days.results || [] });
  }

  if (op === "rows") {
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const iso = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/;
    if (!iso.test(from) || !iso.test(to)) return json({ ok: false, error: "bad range" }, 400);
    const after = Math.max(0, parseInt(url.searchParams.get("after") || "0", 10) || 0);
    const r = await db.prepare(
      `SELECT id, sid, n, kind, scope, code, src, back, at FROM path_log
        WHERE at >= ? AND at < ? AND id > ?
        ORDER BY id LIMIT ?`
    ).bind(from, to, after, PAGE).all();
    const rows = r.results || [];
    return json({ ok: true, rows, next: rows.length === PAGE ? rows[rows.length - 1].id : null });
  }

  if (op === "reads") {
    /* 讀到哪裡的原始逐筆，用法同 op=rows。 */
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const iso = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/;
    if (!iso.test(from) || !iso.test(to)) return json({ ok: false, error: "bad range" }, 400);
    const after = Math.max(0, parseInt(url.searchParams.get("after") || "0", 10) || 0);
    const r = await db.prepare(
      `SELECT id, sid, ref, scope, depth, sec, total, secs, at FROM path_read
        WHERE at >= ? AND at < ? AND id > ?
        ORDER BY id LIMIT ?`
    ).bind(from, to, after, PAGE).all();
    const rows = r.results || [];
    return json({ ok: true, rows, next: rows.length === PAGE ? rows[rows.length - 1].id : null });
  }

  if (op === "recent") {
    /* 最近 30 次來訪：先從 n = 1 那一列挑出 30 個代碼（走 at 的索引），再撈它們的每一步。 */
    const s = await db.prepare(
      `SELECT sid FROM path_log WHERE n = 1 ORDER BY at DESC LIMIT 30`
    ).all();
    const sids = (s.results || []).map((x) => x.sid);
    if (!sids.length) return json({ ok: true, rows: [] });
    const r = await db.prepare(
      `SELECT sid, n, kind, scope, code, src, back, at FROM path_log
        WHERE sid IN (${sids.map(() => "?").join(",")})
        ORDER BY sid, n LIMIT 3000`
    ).bind(...sids).all();
    return json({ ok: true, rows: r.results || [] });
  }

  return json({ ok: false, error: "bad op" }, 400);
}
