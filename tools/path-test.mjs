/* =============================================================================
   訪客軌跡 —— 守門（2026-09-26）
   -----------------------------------------------------------------------------
   `node tools/path-test.mjs`            對 repo 裡的檔案跑
   `node tools/path-test.mjs --site`     對 _site/（剝過註解的上線版）跑
   `node tools/path-test.mjs --shot`     順便把報告頁「訪客軌跡」那一份截圖存到 /tmp

   這條線壞了站上完全看不出來，而且有幾件只有真的瀏覽器裡驗得到：
     ・同一次來訪的每一步是不是同一個代碼、n 有沒有一步一步往上加
     ・按下去就換頁的那幾顆（文章卡、打電話）有沒有在離開之前記到
     ・重新整理不多一步、上一頁要多一步、閒置 30 分鐘換一組代碼
     ・?from= 被 source-log.js 擦掉之後，這裡還讀不讀得到
     ・報告頁算定的日子有沒有存回去、下一次是不是只讀摘要
   ⚠ 改過 src/paths.js、assets/path-log.js、assets/path-summary.js、assets/click-log.js、
     admin/search/ 都要跑它。七科頁是快照：改過 index.html 底下那排 <script> 要重跑 topics.mjs。
   零依賴，做法抄 tools/source-test.mjs（node:sqlite 假裝成 D1 ＋ 站上那顆 Chromium）。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { logPath, pathReport, dayStart, twDay, V, SETTLE_H } from "../src/paths.js";
import { logClick, clickReport } from "../src/click.js";
import { logSource } from "../src/source.js";
import { storeReport, exportRows } from "../src/store.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.argv.includes("--site") ? path.join(ROOT, "_site") : ROOT;
const SHOT = process.argv.includes("--shot");
const KEY = "test-key-1234567890";
const PORT = 8799;

let pass = 0, fail = 0;
const eq = (a, b, name) => {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${ok ? "" : `\n      得到 ${JSON.stringify(a)}\n      要   ${JSON.stringify(b)}`}`);
};

/* ---------- node:sqlite 假裝成 D1 ---------- */
class Stmt {
  constructor(db, sql) { this.db = db; this.sql = sql; this.args = []; }
  bind(...a) { const s = new Stmt(this.db, this.sql); s.args = a; return s; }
  st() { return this.db.prepare(this.sql); }
  async first() { const r = this.st().get(...this.args); return r === undefined ? null : r; }
  async run() { this.st().run(...this.args); return { success: true }; }
  async all() { return { results: this.st().all(...this.args) }; }
}
function makeDB() {
  const db = new DatabaseSync(":memory:");
  return {
    prepare: (sql) => new Stmt(db, sql),
    batch: async (list) => {
      const out = [];
      for (const s of list) out.push(/^\s*(select|with)/i.test(s.sql) ? await s.all() : (await s.run(), { results: [] }));
      return out;
    },
    raw: db,
  };
}

const env = { DB: makeDB(), PATHS: makeDB(), REPORT_KEY: KEY };
const post = (body, e = env) => logPath(new Request("https://fangren.net/api/path", {
  method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }), e);
const rep = async (qs, { key = KEY, method = "GET", body, e = env } = {}) => {
  const url = new URL("https://fangren.net/api/path-report?" + qs);
  const res = await pathReport(new Request(url, { method, body, headers: key === null ? {} : { "X-Report-Key": key } }), url, e);
  return { status: res.status, body: await res.json() };
};
const rows = (e = env) => e.PATHS.raw.prepare("SELECT sid, n, kind, scope, code, src, back FROM path_log ORDER BY id").all()
  .map((r) => [r.sid, r.n, r.kind, r.scope, r.code, r.src, r.back]);

/* =============================== 資料那一側 =============================== */
console.log("\n【一】寫入");
const A = "abc123def456";
await post({ sid: A, n: 1, k: "v", s: "home", f: "line" });
await post({ sid: A, n: 2, k: "c", s: "home", c: "card:wisdom-tooth" });
await post({ sid: A, n: 3, k: "v", s: "post:wisdom-tooth" });
await post({ sid: A, n: 4, k: "c", s: "post:wisdom-tooth", c: "tel" });
await post({ sid: "zzzzzzzzzzz1", n: 1, k: "v", s: "topic:ortho", h: "www.google.com" });
await post({ sid: "zzzzzzzzzzz2", n: 1, k: "v", s: "home", i: 1, h: "www.google.com" });
await post({ sid: "zzzzzzzzzzz3", n: 2, k: "v", s: "home", f: "line", b: 1 });
eq(rows(), [
  [A, 1, "view", "home", null, "line", 0],
  [A, 2, "click", "home", "card:wisdom-tooth", null, 0],
  [A, 3, "view", "post:wisdom-tooth", null, null, 0],
  [A, 4, "click", "post:wisdom-tooth", "tel", null, 0],
  ["zzzzzzzzzzz1", 1, "view", "topic:ortho", null, "google", 0],
  ["zzzzzzzzzzz2", 1, "view", "home", null, "resume", 0],
  ["zzzzzzzzzzz3", 2, "view", "home", null, null, 1],
], "七筆正常的都收下了；來源只記在第一步、閒置後接著逛算 resume、上一頁帶 back");
const before = rows().length;
for (const bad of [
  { sid: "ABC123DEF456", n: 5, k: "v", s: "home" },           /* 大寫 */
  { sid: "short", n: 5, k: "v", s: "home" },
  { sid: A, n: 0, k: "v", s: "home" },
  { sid: A, n: 9999, k: "v", s: "home" },
  { sid: A, n: 1.5, k: "v", s: "home" },
  { sid: A, n: 5, k: "v", s: "admin" },
  { sid: A, n: 5, k: "v", s: "post:no-such-post" },
  { sid: A, n: 5, k: "c", s: "home", c: "evil" },
  { sid: A, n: 5, k: "x", s: "home" },
]) await post(bad);
await post("不是 JSON");
await post({ sid: A, n: 5, k: "v", s: "home", junk: "x".repeat(500) });
await post(null);
eq(rows().length, before, "代碼、步數、頁面、按鈕、種類不合法，或 body 壞掉、過長——都不收也不會炸");
eq(env.PATHS.raw.prepare("PRAGMA table_info(path_log)").all().map((c) => c.name),
   ["id", "sid", "n", "kind", "scope", "code", "src", "back", "at"], "資料表只有這九欄（沒有 IP、UA）");
eq(env.DB.raw.prepare("SELECT name FROM sqlite_master WHERE name LIKE 'path%'").all().length, 0,
   "軌跡一筆都沒有寫進計數器那個資料庫（另開一個）");
{
  const e2 = { DB: makeDB(), REPORT_KEY: KEY };
  const r = await post({ sid: A, n: 1, k: "v", s: "home" }, e2);
  eq((await r.json()).ok, true, "PATHS 還沒綁的時候寫入安靜地回 ok");
  eq((await rep("op=days", { e: e2 })).body.off, true, "報告回 off（報告頁說「還沒接上」）");
}

console.log("\n【二】報告的資料");
eq((await rep("op=days", { key: "wrong" })).status, 401, "密碼錯 → 401");
eq((await rep("op=days", { key: null })).status, 401, "沒帶密碼 → 401");
{
  const saved = env.REPORT_KEY; env.REPORT_KEY = undefined;
  eq((await rep("op=days")).status, 503, "後台沒設 REPORT_KEY → 503");
  env.REPORT_KEY = saved;
}
eq((await rep("op=nope")).status, 400, "不認得的 op → 400");
eq((await rep("op=rows&from=x&to=y")).status, 400, "時間格式不對 → 400");
{
  const r = (await rep("op=recent")).body.rows;
  eq([...new Set(r.map((x) => x.sid))].sort(), [A, "zzzzzzzzzzz1", "zzzzzzzzzzz2"],
     "最近幾次來訪：只挑有第一步的（zzz3 沒有 n = 1）");
}
const yesterday = twDay(new Date(Date.now() - 86400000 * 2).toISOString());
const today = twDay(new Date().toISOString());
eq((await rep("op=day", { method: "POST", body: JSON.stringify({ day: today, v: V, data: "{}" }) })).body.error,
   "not settled", "今天還沒過完 → 不收（存了就不會再重算）");
eq((await rep("op=day", { method: "POST", body: JSON.stringify({ day: yesterday, v: V + 1, data: "{}" }) })).status,
   400, "版本不對 → 不收");
eq((await rep("op=day", { method: "POST", body: JSON.stringify({ day: yesterday, v: V, data: "{壞" }) })).status,
   400, "摘要不是 JSON → 不收");
eq((await rep("op=day", { method: "POST", body: JSON.stringify({ day: yesterday, v: V, data: '{"sessions":1}' }) })).body.ok,
   true, "算定的日子 → 收下");
eq((await rep("op=days&since=" + yesterday)).body.days.map((d) => d.day), [yesterday], "讀得回來");
eq(dayStart("2026-09-26"), "2026-09-25T16:00:00Z", "台灣的一天從 UTC 前一天 16:00 開始");
eq(twDay("2026-09-25T16:00:00Z"), "2026-09-26", "UTC 16:00 ＝ 台灣隔天 0 點");
{
  const plan = env.PATHS.raw.prepare("EXPLAIN QUERY PLAN SELECT (SELECT MIN(at) FROM path_log) AS first").all().map((r) => r.detail);
  eq(plan.filter((d) => /^SCAN (?!CONSTANT ROW)/.test(d)), [], "「最早一筆」走索引（不整張掃）");
}
{
  const s = (await (await storeReport(new Request("https://x/api/store-report", { headers: { "X-Report-Key": KEY } }), env)).json());
  eq(s.dbs.map((d) => d.name), ["fangren-dental-views", "fangren-dental-paths"], "資料庫那一份多一塊「訪客軌跡」");
  const u = new URL(`https://x/api/export?table=path_log&month=${new Date().toISOString().slice(0, 7)}`);
  const x = await (await exportRows(new Request(u, { headers: { "X-Report-Key": KEY } }), u, env)).json();
  eq(x.rows.length, rows().length, "原始逐筆匯出得到");
}

console.log("\n【三】歸納（assets/path-summary.js）");
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(SITE, "assets/path-summary.js"), "utf8"), ctx);
const PS = ctx.fangrenPathSummary;
eq(PS.V, V, "摘要版本和 src/paths.js 一致");
let t0 = Date.parse("2026-09-20T02:00:00Z");
const mk = (sid, steps, start = t0) => steps.map((s, i) => ({ sid, n: i + 1, kind: s[0], scope: s[1], code: s[2] || null,
  src: i === 0 ? (s[3] || "google") : null, back: 0, at: new Date(start + i * 60000).toISOString().replace(/\.\d+Z$/, "Z") }));
const S = {
  act1: mk("s1", [["view", "post:missing-tooth"], ["click", "post:missing-tooth", "tel"]]),
  cmp:  mk("s2", [["view", "post:missing-tooth"], ["click", "post:missing-tooth", "doc:li-binghui"], ["view", "home"],
                  ["click", "home", "map:clinic"]]),
  ret:  mk("s3", [["view", "home", null, "direct"], ["click", "home", "hours:general"]]),
  info: mk("s4", [["view", "post:gum-bleeding"], ["click", "post:gum-bleeding", "btt"]]),
  brw:  mk("s5", [["view", "home"], ["view", "topic:perio"], ["view", "topic:perio"], ["view", "post:perio-laser"]]),
};
eq(Object.fromEntries(Object.entries(S).map(([k, ev]) => [k, PS.one(ev).type])),
   { act1: "act1", cmp: "compare", ret: "ret", info: "info", brw: "browse" }, "五種訪客類型各認得出一個");
eq(PS.one(S.brw).tokens, ["home", "topic:perio", "post:perio-laser"], "連續兩步同一頁收成一步");
eq(PS.one(S.cmp).tokens, ["post:missing-tooth", "home", "!map"], "站內按鈕不進路徑、離站動作進");
{
  const sum = PS.summarize(Object.values(S));
  eq([sum.sessions, sum.converted, sum.views], [5, 2, 9], "來訪 5、有行動 2、看了 9 頁");
  eq(sum.paths["post:missing-tooth>!tel"], 1, "路徑：看了缺牙那篇就打電話");
  eq(sum.trans["post:missing-tooth\thome"], 1, "轉移：缺牙那篇 → 首頁");
  eq(sum.trans["!map\t!out"], 1, "開導航之後離開");
  eq(sum.entriesConv["post:missing-tooth"], 2, "從缺牙那篇進來的兩次都有行動");
  eq(sum.exits["post:missing-tooth"], 1, "act1 最後停在缺牙那篇");
  const long = PS.summarize([mk("s6", ["home", "topic:perio", "home", "topic:ortho", "home", "topic:kids", "home", "topic:surg"].map((p) => ["view", p]))]);
  eq(Object.keys(long.paths)[0].split(">").slice(-1)[0], "…", "超過六步的路徑後面接「…」");
  const m = PS.merge([sum, sum]);
  eq([m.sessions, m.types.compare, m.paths["post:missing-tooth>!tel"]], [10, 2, 2], "兩天的摘要合起來是逐格相加");
}
{
  const late = mk("s7", [["view", "home"], ["view", "topic:kids"]], Date.parse("2026-09-20T15:59:00Z"));   /* 台灣 23:59 開始 */
  const g = PS.group(late.concat(S.brw).concat(mk("s8", [["view", "home"]]).map((r) => ({ ...r, n: 2 }))),
                     "2026-09-19T16:00:00Z", "2026-09-20T16:00:00Z");
  eq(g.map((ev) => ev[0].sid).sort(), ["s5", "s7"], "跨午夜的來訪算在開始那天；沒有第一步的整次不算");
  eq(g.find((ev) => ev[0].sid === "s7").length, 2, "跨過午夜的那一步也收進來");
}

console.log("\n【三之二】讀到哪裡（寫入 ＋ 歸納）");
{
  const n0 = () => env.PATHS.raw.prepare("SELECT COUNT(*) c FROM path_read").get().c;
  await post({ sid: A, k: "r", r: 3, s: "post:wisdom-tooth", d: 60, x: 2, y: 7, t: 41 });
  eq(env.PATHS.raw.prepare("SELECT sid, ref, scope, depth, sec, total, secs FROM path_read").all()
       .map((r) => [r.sid, r.ref, r.scope, r.depth, r.sec, r.total, r.secs]),
     [[A, 3, "post:wisdom-tooth", 60, 2, 7, 41]], "一筆正常的收下了");
  const c = n0();
  for (const bad of [{ d: 55 }, { d: 110 }, { x: 8 }, { t: 99999 }, { r: 0 }, { y: 61, x: 0 }, { s: "admin" }, { sid: "BAD" }]) {
    await post({ sid: A, k: "r", r: 3, s: "post:wisdom-tooth", d: 60, x: 2, y: 7, t: 41, ...bad });
  }
  eq(n0(), c, "滑到幾成不是 10 的倍數、節數超過總數、秒數離譜、頁面不合法——都不收");
  eq(rows().length, before, "讀到哪裡不是一步（path_log 沒有多一筆）");

  const reads = [
    { sid: "s1", ref: 1, scope: "post:missing-tooth", depth: 40, sec: 2, total: 7, secs: 20 },
    { sid: "s1", ref: 1, scope: "post:missing-tooth", depth: 100, sec: 7, total: 7, secs: 95 },   /* 切回來又讀完 */
    { sid: "s2", ref: 1, scope: "post:missing-tooth", depth: 30, sec: 1, total: 7, secs: 8 },
    { sid: "s4", ref: 1, scope: "post:gum-bleeding", depth: 90, sec: 5, total: 6, secs: 400 },
    { sid: "nobody", ref: 1, scope: "home", depth: 100, sec: 3, total: 3, secs: 5 },               /* 不是這一天的來訪 */
  ];
  const sum = PS.summarize(Object.values(S), reads);
  const m = sum.read["post:missing-tooth"];
  eq([m.n, m.depth, m.done, m.doneConv], [2, 130, 1, 1], "同一頁取最大值：缺牙那篇看了 2 次、滑到的加總 130、讀完 1 次（那一次有打電話）");
  eq(m.reach, { 1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 }, "每一節有幾次讀到");
  eq(sum.read["post:gum-bleeding"].done, 1, "滑到九成算讀完");
  eq(sum.read.home, undefined, "不屬於這一天的來訪不算");
  eq(PS.merge([sum, sum]).read["post:missing-tooth"].reach["1"], 4, "合併兩天逐格相加");
}

/* =============================== 瀏覽器那一側 =============================== */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome");
  return out;
};
let chromium = null;
for (const p of [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean)) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chromium || !chrome) {
  console.log("\n⚠ 這台沒有 Playwright／Chromium，瀏覽器那幾項跳過（資料那一側已經驗完）。");
  console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
  process.exit(fail ? 1 : 0);
}

const web = { DB: makeDB(), PATHS: makeDB(), REPORT_KEY: KEY };
let rowCalls = 0;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon" };
const send = async (res, r) => { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
const EMPTY = '{"ok":true,"rows":[],"sums":[],"recent":[],"hosts":[],"span":{"first":null,"n":0}}';
const server = http.createServer(async (req, res) => {
  const u = new URL("http://x" + req.url);
  const c = []; for await (const k of req) c.push(k);
  const body = c.length ? Buffer.concat(c).toString() : undefined;
  const r = new Request(u, { method: req.method, headers: req.headers, body });
  if (u.pathname === "/api/path") return send(res, await logPath(r, web));
  if (u.pathname === "/api/path-report") { if (u.searchParams.get("op") === "rows") rowCalls++; return send(res, await pathReport(r, u, web)); }
  if (u.pathname === "/api/click") return send(res, await logClick(r, web));
  if (u.pathname === "/api/click-report") return send(res, await clickReport(r, u, web));
  if (u.pathname === "/api/source") return send(res, await logSource(r, web));
  if (u.pathname.startsWith("/api/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(u.pathname === "/api/views" ? '{"counts":{}}' : EMPTY);
  }
  let p = path.join(SITE, decodeURIComponent(u.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));
await post({ sid: "warmupwarmup", n: 1, k: "v", s: "home" }, web);            /* 讓資料表建起來 */
web.PATHS.raw.exec("DELETE FROM path_log");
{ const u = new URL("http://x/api/click-report"); await clickReport(new Request(u, { headers: { "X-Report-Key": KEY } }), u, web); }
const base = `http://localhost:${PORT}`;
const logged = () => web.PATHS.raw.prepare("SELECT sid, n, kind, scope, code, src, back FROM path_log ORDER BY id").all();

const browser = await chromium.launch({ executablePath: chrome });
const ctxB = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctxB.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
const settle = () => page.waitForTimeout(400);

console.log(`\n【四】真的逛一次（${SITE === ROOT ? "repo" : "_site"}）`);
await page.goto(base + "/?from=line", { waitUntil: "load" });
await settle();
eq(await page.evaluate(() => location.search), "", "?from= 照樣被 source-log.js 擦掉");
await Promise.all([page.waitForNavigation({ waitUntil: "load" }),
  page.evaluate(() => document.querySelector('.cards a.card[href$="wisdom-tooth/"]').click())]);
await settle();
await page.evaluate(() => { const a = document.querySelector('a[href^="tel:"]'); a.addEventListener("click", (e) => e.preventDefault()); a.click(); });
await settle();
await page.reload({ waitUntil: "load" });
await settle();
await page.goBack({ waitUntil: "load" });
await settle();
{
  const L = logged();
  const sid = L[0] && L[0].sid;
  eq(L.every((r) => r.sid === sid) && /^[a-z0-9]{12}$/.test(sid), true, "每一步同一個 12 碼代碼：" + sid);
  eq(L.map((r) => r.n), L.map((_, i) => i + 1), "n 一步一步往上加、沒有跳號");
  eq(L.map((r) => [r.kind, r.scope, r.code, r.src, r.back]), [
    ["view", "home", null, "line", 0],
    ["click", "home", "card:wisdom-tooth", null, 0],
    ["view", "post:wisdom-tooth", null, null, 0],
    ["click", "post:wisdom-tooth", "tel", null, 0],
    ["view", "home", null, null, 1],
  ], "首頁（LINE 進來）→ 按文章卡 → 文章頁 → 打電話 →（重新整理不算）→ 上一頁回首頁");
  eq(web.DB.raw.prepare("PRAGMA table_info(click_log)").all().map((c) => c.name), ["id", "code", "scope", "at"],
     "點擊紀錄那一份本身沒有變（仍然沒有代碼）");
  eq(web.DB.raw.prepare("SELECT code FROM click_log ORDER BY id").all().map((r) => r.code),
     ["card:wisdom-tooth", "tel"], "點擊紀錄照樣記到那兩顆");
}
await page.goto(base + "/topics/ortho/", { waitUntil: "load" });
await settle();
eq(logged().slice(-1)[0].scope, "topic:ortho", "著陸頁也記得到（沒過就是忘了重跑 node tools/topics.mjs）");
{
  const sid0 = logged()[0].sid;
  await page.evaluate(() => { const s = JSON.parse(sessionStorage.getItem("fangren:path")); s.t -= 31 * 60 * 1000;
                              sessionStorage.setItem("fangren:path", JSON.stringify(s)); });
  await Promise.all([page.waitForNavigation({ waitUntil: "load" }),
    page.evaluate(() => document.querySelector('.cards a.card').click())]);
  await settle();
  const last = logged().filter((r) => r.kind === "view").slice(-1)[0];
  const first = logged().find((r) => r.sid === last.sid && r.n === 1);
  eq([last.sid !== sid0, first.kind, first.scope, first.src, last.n], [true, "view", "topic:ortho", "resume", 3],
     "閒置超過 30 分鐘才按 → 換一組代碼：先補「在著陸頁（閒置後接著逛）」、再記那一顆、再記新的一頁");
}
{
  const p2 = await (await browser.newContext()).newPage();
  await p2.goto(base + "/posts/gum-bleeding/", { waitUntil: "load", referer: "https://www.google.com/" });
  await p2.waitForTimeout(400);
  const last = logged().slice(-1)[0];
  eq([last.n, last.src, last.scope], [1, "google", "post:gum-bleeding"], "另一個分頁是另一次來訪（從 Google 進文章頁）");
}
eq(errs, [], "沒有 JS 錯誤");

console.log("\n【四之二】真的讀一篇（讀到哪裡）");
{
  const reads = () => web.PATHS.raw.prepare("SELECT sid, ref, scope, depth, sec, total, secs FROM path_read ORDER BY id").all();
  const c0 = reads().length;
  await page.goto(base + "/posts/missing-tooth/", { waitUntil: "load" });
  await settle();
  const me = logged().filter((r) => r.kind === "view").slice(-1)[0];
  const heads = await page.evaluate(() => Array.from(document.querySelectorAll("main h2")).filter((h) => h.getClientRects().length).length);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  await page.goto(base + "/", { waitUntil: "load" });                    /* 離開那一頁 → 送出 */
  await settle();
  const r = reads().slice(c0).filter((x) => x.scope === "post:missing-tooth").pop();
  eq(!!r, true, "離開那一頁時送出了一筆");
  eq([r && r.sid, r && r.ref], [me.sid, me.n], "掛在那一頁的那一步上（同一個代碼、ref ＝ 那一頁的 n）");
  eq([r && r.depth, r && r.sec, r && r.total], [100, heads, heads], `滑到底：100%、讀到第 ${heads} 節（共 ${heads} 節）`);
  eq(r && r.secs >= 1 && r.secs < 30, true, "停留秒數有算到：" + (r && r.secs));

  const c1 = reads().length;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.goto(base + "/posts/gum-bleeding/", { waitUntil: "load" });
  await settle();
  await page.reload({ waitUntil: "load" });
  await settle();
  await page.goto(base + "/", { waitUntil: "load" });
  await settle();
  const g = reads().slice(c1).filter((x) => x.scope === "post:gum-bleeding");
  const gv = logged().filter((x) => x.kind === "view" && x.scope === "post:gum-bleeding").pop();
  eq(g.length >= 1 && g.every((x) => x.ref === gv.n), true, "重新整理之後讀到哪裡仍然掛回同一步（沒有多一步）");
  eq(g.every((x) => x.depth < 100), true, "沒往下滑的那一頁不會被記成讀完");
}
eq(errs, [], "讀到哪裡：沒有 JS 錯誤");

console.log("\n【五】報告頁「訪客軌跡」那一份");
{
  /* 塞三天的資料：前天、昨天（算定了）、今天（沒算定）。 */
  web.PATHS.raw.exec("DELETE FROM path_log");
  const ins = web.PATHS.raw.prepare("INSERT INTO path_log (sid, n, kind, scope, code, src, back, at) VALUES (?,?,?,?,?,?,?,?)");
  let k = 0;
  const put = (dayOffset, hour, steps) => {
    const sid = ("t" + String(k++).padStart(11, "0"));
    const start = Date.parse(dayStart(twDay(new Date(Date.now() - dayOffset * 86400000).toISOString()))) + hour * 3600000;
    steps.forEach((s, i) => ins.run(sid, i + 1, s[0], s[1], s[2] || null, i === 0 ? (s[3] || "google") : null, 0,
      new Date(Math.min(start + i * 60000, Date.now() - 1000)).toISOString().replace(/\.\d+Z$/, "Z")));
  };
  for (const d of [2, 1]) {
    put(d, 10, [["view", "post:missing-tooth"], ["click", "post:missing-tooth", "tel"]]);
    put(d, 11, [["view", "home", null, "line"], ["click", "home", "hours:general"]]);
    put(d, 12, [["view", "post:gum-bleeding"]]);
  }
  put(0, 0, [["view", "post:missing-tooth"], ["view", "home"], ["click", "home", "map:clinic"]]);
  const total = 7;
  web.PATHS.raw.exec("DELETE FROM path_read");
  {
    const insR = web.PATHS.raw.prepare("INSERT INTO path_read (sid, ref, scope, depth, sec, total, secs, at) VALUES (?,?,?,?,?,?,?,?)");
    for (const r of web.PATHS.raw.prepare("SELECT sid, n, scope, at FROM path_log WHERE kind='view' AND scope='post:missing-tooth'").all()) {
      insR.run(r.sid, r.n, r.scope, 100, 7, 7, 70, r.at);
    }
  }
  await page.goto(base + "/admin/search/", { waitUntil: "load" });
  await page.fill("#key", KEY);
  await page.click("button.go");
  await page.waitForSelector("#app:not([hidden])");
  rowCalls = 0;
  await page.click('#tabs button:text-is("訪客軌跡")');
  await page.waitForFunction(() => document.getElementById("p-all").textContent !== "—");
  eq(await page.textContent("h1"), "訪客軌跡", "切到訪客軌跡");
  eq([await page.isVisible("#wins"), await page.isVisible("#scopes"), await page.isVisible("#csv")], [true, false, false],
     "有期間那一排；來源與「下載 CSV」藏起來");
  eq(await page.textContent("#p-all"), String(total), `來訪次數 ＝ ${total}`);
  eq(await page.textContent("#p-conv"), "3（43%）", "有採取行動 3 次（兩次打電話、一次開導航）");
  const stored = web.PATHS.raw.prepare("SELECT day FROM path_day ORDER BY day").all().map((r) => r.day);
  const settledDays = [2, 1].map((d) => twDay(new Date(Date.now() - d * 86400000).toISOString()))
    .filter((d) => Date.parse(dayStart(d)) + (24 + SETTLE_H) * 3600000 <= Date.now());
  eq(stored, settledDays, "算定的日子存回去了（今天沒有存）：" + stored.join("、"));
  eq((await page.textContent("#p-t-path")).includes("打電話"), true, "路徑表看得到「打電話」");
  eq((await page.textContent("#p-t-type")).includes("直接行動"), true, "訪客類型表");
  eq((await page.$$("#p-t-recent tbody tr")).length, total, "最近幾次來訪逐筆列出");
  eq(await page.textContent('#p-t-read details[data-sc="post:missing-tooth"] summary .rdm'),
     "平均滑到 100%・讀完 100%・停留中位數 1–2 分・讀完的那幾次有行動 100%", "讀到哪裡：缺牙那篇 3 次都讀完");
  await page.click('#p-t-read details[data-sc="post:missing-tooth"] summary');
  await page.waitForSelector('#p-t-read details[data-sc="post:missing-tooth"] .bar-row');
  eq((await page.textContent('#p-t-read details[data-sc="post:missing-tooth"] .rdb')).includes("1. 不處理會發生什麼"), true,
     "點開看得到每一節的名字（從那一頁抓回來的 <h2>）");

  rowCalls = 0;
  await page.click('#wins button:text-is("一週")');
  await page.waitForTimeout(600);
  await page.click('#wins button:text-is("一個月")');
  await page.waitForTimeout(600);
  eq(rowCalls, 2, "換期間時，算定的日子只讀摘要——原始逐筆只為了今天各讀一次");
  eq(await page.textContent("#p-all"), String(total), "數字不變");
  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, "390 寬沒有破框");
  eq(errs, [], "報告頁沒有 JS 錯誤");

  if (SHOT) {
    for (const scheme of ["light", "dark"]) {
      const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
      const p2 = await c2.newPage();
      await p2.goto(base + "/admin/search/", { waitUntil: "load" });
      await p2.fill("#key", KEY);
      await p2.click("button.go");
      await p2.waitForSelector("#app:not([hidden])");
      await p2.click('#tabs button:text-is("訪客軌跡")');
      await p2.waitForFunction(() => document.getElementById("p-all").textContent !== "—");
      await p2.screenshot({ path: `/tmp/path-report-${scheme}.png`, fullPage: true });
      await p2.click('#p-t-read details summary');
      await p2.waitForSelector('#p-t-read .bar-row');
      await (await p2.$("#p-t-read")).screenshot({ path: `/tmp/path-read-${scheme}.png` });
      await c2.close();
      console.log(`  · 截圖 /tmp/path-report-${scheme}.png`);
    }
  }
}

await browser.close();
server.close();
console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
process.exit(fail ? 1 : 0);
