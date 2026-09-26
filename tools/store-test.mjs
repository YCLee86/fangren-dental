/* =============================================================================
   資料庫的容量 ＋ 完整匯出 —— 守門（2026-09-26）
   -----------------------------------------------------------------------------
   `node tools/store-test.mjs`            對 repo 裡的檔案跑
   `node tools/store-test.mjs --site`     對 _site/（剝過註解的上線版）跑
   `node tools/store-test.mjs --shot`     順便把報告頁「資料庫」那一份截圖存到 /tmp

   這一支擋三件站上完全看不出來的事：
     ・筆數用「最大 id − 最小 id ＋ 1」算，刪掉最舊的之後還對不對
     ・那幾個 MIN／MAX 有沒有真的走索引（寫錯了照樣算得出對的數字，只是整張表掃一遍，
       而 9/1 起讀取額度是硬上限——這一項是 src/store.js 設計②的守門）
     ・分段匯出接起來有沒有少一筆、多一筆
   ⚠ 改過 src/store.js、admin/search/ 都要跑它。
   零依賴，做法抄 tools/source-test.mjs（node:sqlite 假裝成 D1 ＋ 站上那顆 Chromium）。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { storeReport, exportRows, PAGE, TABLES, DBS } from "../src/store.js";
import { searchReport } from "../src/search.js";
import { clickReport } from "../src/click.js";
import { sourceReport } from "../src/source.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.argv.includes("--site") ? path.join(ROOT, "_site") : ROOT;
const SHOT = process.argv.includes("--shot");
const KEY = "test-key-1234567890";
const PORT = 8798;

let pass = 0, fail = 0;
const eq = (a, b, name) => {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${ok ? "" : `\n      得到 ${JSON.stringify(a)}\n      要   ${JSON.stringify(b)}`}`);
};

/* ---------- node:sqlite 假裝成 D1。meta.size_after 用 page_count × page_size 模擬 ---------- */
class Stmt {
  constructor(db, sql) { this.db = db; this.sql = sql; this.args = []; }
  bind(...a) { const s = new Stmt(this.db, this.sql); s.args = a; return s; }
  st() { return this.db.prepare(this.sql); }
  meta() {
    const p = this.db.prepare("PRAGMA page_count").get().page_count;
    const z = this.db.prepare("PRAGMA page_size").get().page_size;
    return { size_after: p * z };
  }
  async first() { const r = this.st().get(...this.args); return r === undefined ? null : r; }
  async run() { this.st().run(...this.args); return { success: true, meta: this.meta() }; }
  async all() { return { results: this.st().all(...this.args), meta: this.meta() }; }
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
/* 三份紀錄的表由各自那一支建（CREATE TABLE IF NOT EXISTS），這裡打一次報告讓它們建起來。 */
async function build(env) {
  for (const [fn, p] of [[searchReport, "search"], [clickReport, "click"], [sourceReport, "source"]]) {
    const u = new URL(`https://fangren.net/api/${p}-report?win=30d`);
    await fn(new Request(u, { headers: { "X-Report-Key": KEY } }), u, env);
  }
  env.DB.raw.exec(`CREATE TABLE IF NOT EXISTS page_views (slug TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0,
                   updated_at TEXT NOT NULL DEFAULT (datetime('now')))`);
}
const iso = (days) => new Date(Date.now() - days * 86400000).toISOString().replace(/\.\d+Z$/, "Z");

const env = { DB: makeDB(), REPORT_KEY: KEY };
const store = async (key = KEY) => {
  const res = await storeReport(new Request("https://fangren.net/api/store-report",
    { headers: key === null ? {} : { "X-Report-Key": key } }), env);
  return { status: res.status, body: await res.json() };
};
const exp = async (qs, key = KEY) => {
  const url = new URL("https://fangren.net/api/export?" + qs);
  const res = await exportRows(new Request(url, { headers: { "X-Report-Key": key } }), url, env);
  return { status: res.status, body: await res.json() };
};
const tbl = (body, t) => body.dbs[0].tables.find((x) => x.table === t);
const count = (t, where = "1", ...a) => env.DB.raw.prepare(`SELECT COUNT(*) c FROM ${t} WHERE ${where}`).get(...a).c;

console.log("\n【一】密碼");
eq((await store("wrong")).status, 401, "密碼錯 → 401");
eq((await store(null)).status, 401, "沒帶密碼 → 401");
eq((await exp("table=click_log&month=2026-09", "wrong")).status, 401, "匯出也要密碼");
{
  const saved = env.REPORT_KEY; env.REPORT_KEY = undefined;
  eq((await store()).status, 503, "後台沒設 REPORT_KEY 時一律拒絕");
  env.REPORT_KEY = saved;
}

console.log("\n【二】表還沒建的時候");
{
  const r = await store();
  eq(r.status, 200, "不會掛掉");
  eq(r.body.dbs[0].tables.map((t) => t.rows), [0, 0, 0], "三份都當成 0 筆");
  eq(r.body.dbs[0].limit, 500 * 1024 * 1024, "上限是 500 MB（免費方案的單一資料庫）");
}

console.log("\n【三】筆數、最早、近 30 天");
await build(env);
{
  const ins = env.DB.raw.prepare("INSERT INTO click_log (code, scope, at) VALUES (?,?,?)");
  for (const d of [400, 200, 95, 40, 29, 10, 3, 0.1]) ins.run("tel", "home", iso(d));
  const s = env.DB.raw.prepare("INSERT INTO search_log (q, scope, hits, at) VALUES (?,?,?,?)");
  for (const d of [50, 5]) s.run("植牙", "home", 3, iso(d));
  env.DB.raw.prepare("INSERT INTO page_views (slug, views) VALUES ('home', 120), ('missing-tooth', 30)").run();
}
{
  const r = (await store()).body;
  const c = tbl(r, "click_log");
  eq(c.rows, count("click_log"), `點擊的筆數 ＝ COUNT(*)（${count("click_log")}）`);
  eq(c.recent30, count("click_log", "at >= ?", iso(30)), "近 30 天 ＝ 資料庫實數");
  eq(c.first, env.DB.raw.prepare("SELECT MIN(at) m FROM click_log").get().m, "最早一筆");
  eq(tbl(r, "search_log").rows, 2, "搜尋 2 筆");
  eq(tbl(r, "source_log").rows, 0, "來源 0 筆");
  eq(r.dbs[0].counter, { pages: 2, views: 150 }, "瀏覽計數：兩頁、累計 150");
  eq(typeof r.dbs[0].bytes === "number" && r.dbs[0].bytes > 0, true, "讀得到資料庫大小（meta.size_after）");
}
env.DB.raw.prepare("DELETE FROM click_log WHERE at < ?").run(iso(100));
eq(tbl((await store()).body, "click_log").rows, count("click_log"),
   "刪掉最舊的之後，筆數仍然 ＝ COUNT(*)（id 從最舊那一端刪，中間沒有洞）");
{
  const saved = env.DB;
  env.DB = { ...saved, prepare: (sql) => {
    const s = saved.prepare(sql);
    if (sql === "SELECT 1") return { all: async () => ({ results: [{ 1: 1 }] }) };   /* 沒有 meta */
    return s;
  } };
  eq((await store()).body.dbs[0].bytes, null, "D1 沒回報大小 → null（報告頁說量不到，不亂猜）");
  env.DB = saved;
}

console.log("\n【四】不整張表掃描（設計②）");
for (const t of Object.keys(TABLES)) {
  const plan = env.DB.raw.prepare(`EXPLAIN QUERY PLAN
    SELECT (SELECT MAX(id) FROM ${t}) AS hi, (SELECT MIN(id) FROM ${t}) AS lo,
           (SELECT MIN(at) FROM ${t}) AS first, (SELECT MAX(at) FROM ${t}) AS last,
           (SELECT id FROM ${t} WHERE at >= ? ORDER BY at LIMIT 1) AS lo30`).all("2026-01-01")
    .map((r) => r.detail);
  eq(plan.filter((d) => /^SCAN (?!CONSTANT ROW)/.test(d)), [],
     `${t}：五個子查詢都走索引或主鍵（${plan.length} 步）`);
}
{
  const src = fs.readFileSync(path.join(ROOT, "src/store.js"), "utf8");
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "");
  eq(/COUNT\(\*\)[^"`]*FROM \$\{/.test(code), false, "紀錄表上沒有 COUNT(*)（只有一頁一列的 page_views 可以）");
}

console.log("\n【五】匯出");
{
  const cur = new Date().toISOString().slice(0, 7);
  const r = await exp("table=click_log&month=" + cur);
  eq(r.body.rows.length, count("click_log", "substr(at,1,7) = ?", cur), "這個月的筆數對得上");
  eq(r.body.cols, TABLES.click_log.cols, "欄位照資料庫原樣");
  eq(r.body.next, null, "一段就完");
  eq((await exp("table=users&month=" + cur)).status, 400, "白名單以外的表 → 400");
  eq((await exp("table=click_log;DROP TABLE click_log&month=" + cur)).status, 400, "拼 SQL 的表名 → 400");
  eq((await exp("table=click_log&month=2026-13")).status, 400, "不合法的月份 → 400");
  eq((await exp("table=click_log")).status, 400, "沒給月份 → 400");
  const pv = await exp("table=page_views");
  eq(pv.body.rows.map((x) => [x.slug, x.views]), [["home", 120], ["missing-tooth", 30]], "瀏覽計數一次全給");
}
{
  /* 分段：塞 PAGE × 2 ＋ 7 筆在同一個月，接起來要剛好一筆不差。 */
  const e2 = { DB: makeDB(), REPORT_KEY: KEY };
  await build(e2);
  const ins = e2.DB.raw.prepare("INSERT INTO source_log (src, via, host, page, at) VALUES ('line','tag',NULL,'home',?)");
  const N = PAGE * 2 + 7;
  e2.DB.raw.exec("BEGIN");
  for (let i = 0; i < N; i++) ins.run(`2026-08-${String(1 + (i % 28)).padStart(2, "0")}T0${i % 10}:00:00Z`);
  ins.run("2026-07-31T23:59:59Z"); ins.run("2026-09-01T00:00:00Z");      /* 月份的邊界 */
  e2.DB.raw.exec("COMMIT");
  const ids = []; let after = 0, calls = 0;
  while (after !== null) {
    const url = new URL(`https://x/api/export?table=source_log&month=2026-08&after=${after}`);
    const j = await (await exportRows(new Request(url, { headers: { "X-Report-Key": KEY } }), url, e2)).json();
    ids.push(...j.rows.map((r) => r.id)); after = j.next; calls++;
  }
  eq(calls, 3, `分三段（一段最多 ${PAGE} 筆）`);
  eq(ids.length, N, `接起來 ${N} 筆，一筆不差`);
  eq(new Set(ids).size, ids.length, "沒有重複");
  eq(ids.every((v, i) => i === 0 || v > ids[i - 1]), true, "照 id 排");
}
eq(DBS.every((d) => d.tables.every((t) => TABLES[t])), true, "DBS 列的每一張表都在 TABLES 裡");

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

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json" };
const send = async (res, r) => { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
const server = http.createServer(async (req, res) => {
  const u = new URL("http://x" + req.url);
  const r = new Request(u, { headers: req.headers });
  if (u.pathname === "/api/store-report") return send(res, await storeReport(r, env));
  if (u.pathname === "/api/export") return send(res, await exportRows(r, u, env));
  if (u.pathname === "/api/search-report") return send(res, await searchReport(r, u, env));
  if (u.pathname === "/api/click-report") return send(res, await clickReport(r, u, env));
  if (u.pathname === "/api/source-report") return send(res, await sourceReport(r, u, env));
  let p = path.join(SITE, decodeURIComponent(u.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;

console.log(`\n【六】報告頁「資料庫」那一份（${SITE === ROOT ? "repo" : "_site"}）`);
const browser = await chromium.launch({ executablePath: chrome });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto(base + "/admin/search/", { waitUntil: "load" });
await page.fill("#key", KEY);
await page.click("button.go");
await page.waitForSelector("#app:not([hidden])");
await page.click('#tabs button:text-is("資料庫")');
await page.waitForSelector("#st-dbs .db");
eq(await page.textContent("h1"), "資料庫", "切到資料庫那一份");
eq([await page.isVisible("#wins"), await page.isVisible("#scopes"), await page.isVisible("#csv")], [false, false, false],
   "期間、來源兩排尺與「下載 CSV」藏起來");
eq(await page.isVisible(".gauge"), true, "有容量條");
eq((await page.textContent("#st-dbs")).includes("還很空"), true, "狀態：還很空");
const cells = await page.$$eval("#st-dbs tbody tr", (rs) => rs.map((r) => [r.cells[0].childNodes[0].textContent, r.cells[1].textContent]));
eq(cells.find((c) => c[0] === "點擊紀錄")[1], String(count("click_log")), "表上的點擊筆數對得上資料庫");

await page.click('#st-tables button:text-is("點擊紀錄")');
const opts = await page.$$eval("#st-from option", (o) => o.map((x) => x.textContent));
eq(opts[0], env.DB.raw.prepare("SELECT substr(MIN(at),1,7) m FROM click_log").get().m, "月份從最早那一筆開始");
const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#st-go")]);
const csv = fs.readFileSync(await dl.path(), "utf8");
const lines = csv.replace(/^\ufeff/, "").trim().split("\r\n");
eq(csv.charCodeAt(0), 0xfeff, "開頭有 BOM（Excel 才認得中文）");
eq(lines[0], "id,code,scope,at,tw_time", "欄位：原始四欄 ＋ 台灣時間");
eq(lines.length - 1, count("click_log"), `匯出全部月份 ＝ ${count("click_log")} 筆`);
eq(/^"\d+","tel","home","[^"]+Z","20\d\d-\d\d-\d\d \d\d:\d\d:\d\d"$/.test(lines[1]), true, "一列的樣子：" + lines[1]);
await page.waitForFunction(() => /完成/.test(document.getElementById("st-msg").textContent));

await page.click('#st-tables button:text-is("來源紀錄")');
eq(await page.isDisabled("#st-go"), true, "沒有資料的那一份，匯出鈕按不下去");
await page.click('#st-tables button:text-is("瀏覽計數")');
eq(await page.isVisible("#st-range"), false, "瀏覽計數沒有月份可選");
const [dl2] = await Promise.all([page.waitForEvent("download"), page.click("#st-go")]);
eq(fs.readFileSync(await dl2.path(), "utf8").replace(/^\ufeff/, "").split("\r\n")[0], "slug,views,updated_at,tw_time",
   "瀏覽計數的檔：slug、views、updated_at ＋ 台灣時間");

eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, "390 寬沒有破框");
await page.click('#tabs button:text-is("點擊紀錄")');
await page.waitForTimeout(400);
eq([await page.isVisible("#view-click"), await page.isVisible("#wins"), await page.isVisible("#csv")], [true, true, true],
   "切回點擊那一份，兩排尺與「下載 CSV」回來");
eq(errs, [], "沒有 JS 錯誤");

if (SHOT) {
  for (const scheme of ["light", "dark"]) {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
    const p2 = await c2.newPage();
    await p2.goto(base + "/admin/search/", { waitUntil: "load" });
    await p2.fill("#key", KEY);
    await p2.click("button.go");
    await p2.waitForSelector("#app:not([hidden])");
    await p2.click('#tabs button:text-is("資料庫")');
    await p2.waitForSelector("#st-dbs .db");
    await p2.screenshot({ path: `/tmp/store-report-${scheme}.png`, fullPage: true });
    await c2.close();
    console.log(`  · 截圖 /tmp/store-report-${scheme}.png`);
  }
}

await browser.close();
server.close();
console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
process.exit(fail ? 1 : 0);
