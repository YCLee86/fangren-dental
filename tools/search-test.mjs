/* =============================================================================
   搜尋紀錄 —— 守門（2026-09-20）
   -----------------------------------------------------------------------------
   `node tools/search-test.mjs`            對 repo 裡的檔案跑
   `node tools/search-test.mjs --site`     對 _site/（剝過註解的上線版）跑
   `node tools/search-test.mjs --shot`     順便把報告頁截圖存到 /tmp

   為什麼要有這一支：這條線的每一段都**壞了也不會有人發現**——
   紀錄沒送出去、來源標錯、搜到的被記成搜不到、密碼失效，
   站上通通看不出任何異狀，要等幾個月後打開報告才會知道那幾個月是空的。

   零依賴：資料庫用 node 內建的 node:sqlite 假裝成 D1（Node ≥ 22），
   瀏覽器用 Playwright ＋ 站上既有的那顆 Chromium（找法抄 tools/webp.mjs）。

   ⚠ 改過 src/search.js、assets/search-log.js、admin/search/ 任何一支都要跑它。
   ⚠ 改過 index.html 的搜尋那一段，也要跑——【六】那一項驗的就是
      七科頁的快照有沒有跟著重新產生（node tools/topics.mjs）。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { logSearch, searchReport, normQ } from "../src/search.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.argv.includes("--site") ? path.join(ROOT, "_site") : ROOT;
const SHOT = process.argv.includes("--shot");
const KEY = "test-key-1234567890";
const PORT = 8797;

let pass = 0, fail = 0;
const eq = (a, b, name) => {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${ok ? "" : `\n      得到 ${JSON.stringify(a)}\n      要   ${JSON.stringify(b)}`}`);
};

/* ---------- node:sqlite 假裝成 D1（只實作真的用到的那幾支） ---------- */
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

const env = { DB: makeDB(), REPORT_KEY: KEY };
const post = (body) => logSearch(new Request("https://fangren.net/api/search", {
  method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }), env);
const report = async (win = "30d", key = KEY) => {
  const url = new URL("https://fangren.net/api/search-report?win=" + win);
  const res = await searchReport(new Request(url, { headers: key === null ? {} : { "X-Report-Key": key } }), url, env);
  return { status: res.status, body: await res.json() };
};
const count = () => env.DB.raw.prepare("SELECT COUNT(*) c FROM search_log").get().c;

/* =============================== 資料那一側 =============================== */
console.log("\n【一】字串正規化");
eq(normQ("  植牙  "), "植牙", "前後空白收掉");
eq(normQ("ＲＯＯＴ　ＣＡＮＡＬ"), "root canal", "全形→半形、大寫→小寫、全形空白→半形");
eq(normQ("root   canal"), "root canal", "中間連續空白收成一個（不是整個拿掉，要給人讀）");
eq(normQ("x".repeat(60)).length, 40, "超過 40 字截斷");
eq(normQ(null), "", "null 不會炸");

console.log("\n【二】寫入");
await post({ q: "植牙", scope: "home", hits: 3 });
await post({ q: "植牙", scope: "home", hits: 3 });
await post({ q: "植牙費用", scope: "home", hits: 0 });
await post({ q: "牙齒矯正", scope: "topic:ortho", hits: 2 });
await post({ q: "貼片", scope: "topic:prosth", hits: 0 });
eq(count(), 5, "五筆正常的都收下了");
await post({ q: "spam", scope: "evil", hits: 1 });
await post({ q: "spam", scope: "topic:NOT A SPEC", hits: 1 });
eq(count(), 5, "來源不合法的不收（只收 home 或 topic:<spec>）");
await post({ q: "看這裡 https://spam.example", scope: "home", hits: 0 });
await post({ q: "<script>x", scope: "home", hits: 0 });
await post({ q: "   ", scope: "home", hits: 0 });
await post("這不是 JSON");
await post({ q: "x".repeat(600), scope: "home", hits: 0 });
eq(count(), 5, "夾網址／夾標籤／空字串／壞掉的 body 都不收，也不會炸");
await post({ q: "洗牙", scope: "home", hits: "99999" });
eq(env.DB.raw.prepare("SELECT hits FROM search_log WHERE q='洗牙'").get().hits, 999, "hits 夾在 0~999");

console.log("\n【三】密碼");
eq((await report("30d", "wrong")).status, 401, "密碼錯 → 401");
eq((await report("30d", null)).status, 401, "沒帶密碼 → 401");
{
  const saved = env.REPORT_KEY; env.REPORT_KEY = undefined;
  eq((await report("30d", "")).status, 401, "後台沒設 REPORT_KEY 時一律拒絕（不會變成不用密碼）");
  env.REPORT_KEY = saved;
}
eq((await report()).status, 200, "密碼對 → 200");

console.log("\n【四】排名與搜到／搜不到");
{
  const r = (await report("30d")).body;
  const row = (q) => r.rows.find((x) => x.q === q);
  eq(row("植牙").n, 2, "同樣的字累計次數");
  eq(row("植牙").miss, 0, "「植牙」兩次都搜得到");
  eq(row("植牙費用").miss, 1, "「植牙費用」是搜不到的那一種");
  eq(r.rows[0].q, "植牙", "排名照次數由多到少");
  eq(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(r.recent[0].at), true, "每一筆都有 ISO 時間戳（UTC）");
}

console.log("\n【五】期間這把尺");
{
  const old = new Date(Date.now() - 400 * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  env.DB.raw.prepare("INSERT INTO search_log (q, scope, hits, at) VALUES ('舊查詢','home',0,?)").run(old);
  for (const [win, want] of [["7d", false], ["30d", false], ["90d", false], ["180d", false],
                             ["365d", false], ["730d", true], ["all", true]]) {
    eq(!!(await report(win)).body.rows.find((x) => x.q === "舊查詢"), want,
       `${win} ${want ? "撈得到" : "撈不到"} 400 天前那一筆`);
  }
}

console.log("\n【六】每日上限");
{
  const e2 = { DB: makeDB(), REPORT_KEY: KEY };
  for (let i = 0; i < 5010; i++) {
    await logSearch(new Request("https://fangren.net/api/search",
      { method: "POST", body: JSON.stringify({ q: "洗牙" + (i % 7), scope: "home", hits: 1 }) }), e2);
  }
  eq(e2.DB.raw.prepare("SELECT COUNT(*) c FROM search_log").get().c, 5000,
     "超過上限之後安靜地丟掉（回的仍然是 ok，不告訴對方有一道門）");
}

/* =============================== 瀏覽器那一側 =============================== */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "chrome"));
      out.push(path.join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      out.push(path.join(pw, d, "chrome-win", "chrome.exe"));
    }
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
  console.log("\n⚠ 這台沒有 Playwright／Chromium，瀏覽器那六項跳過（資料那一側已經驗完）。");
  console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
  process.exit(fail ? 1 : 0);
}

/* 本機的假 Worker：靜態檔 ＋ 真的那兩個 API */
const web = { DB: makeDB(), REPORT_KEY: KEY };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon" };
const send = async (res, r) => { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/search" && req.method === "POST") {
    const c = []; for await (const k of req) c.push(k);
    return send(res, await logSearch(new Request("http://x/api/search", { method: "POST", body: Buffer.concat(c).toString() }), web));
  }
  if (url.pathname === "/api/search-report") {
    const u = new URL("http://x" + req.url);
    return send(res, await searchReport(new Request(u, { headers: req.headers }), u, web));
  }
  /* 本機沒有 Worker，計數器照站上的行為給個空的 */
  if (url.pathname === "/api/views") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end('{"counts":{}}'); }
  let p = path.join(SITE, decodeURIComponent(url.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;
const rows = () => web.DB.raw.prepare("SELECT q, scope, hits FROM search_log ORDER BY id").all();

const browser = await chromium.launch({ executablePath: chrome });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));

console.log(`\n【七】首頁打字（${SITE === ROOT ? "repo" : "_site"}）`);
await page.goto(base + "/", { waitUntil: "load" });
await page.fill("#q", "植牙");
await page.waitForTimeout(150);
const onScreen = await page.evaluate(() => {
  const vis = (s) => [...document.querySelectorAll(s)].filter((e) => !e.classList.contains("is-filtered-out")).length;
  return vis(".cards .card") + vis(".docs .doc");
});
await page.evaluate(() => document.getElementById("q").blur());
await page.waitForTimeout(400);
eq(rows().length, 1, "失焦時送出一筆");
eq(rows()[0].scope, "home", "來源是 home");
eq(rows()[0].hits >= onScreen, true, `命中筆數不少於畫面上看得到的（記 ${rows()[0].hits}、畫面 ${onScreen}）`);
await page.fill("#q", "植牙");
await page.evaluate(() => document.getElementById("q").blur());
await page.waitForTimeout(250);
eq(rows().length, 1, "同一次瀏覽、同一個字不記第二次");
await page.fill("#q", "隱形眼鏡");
await page.evaluate(() => document.getElementById("q").blur());
await page.waitForTimeout(400);
eq(rows()[1].hits, 0, "搜不到的字記成 0");
await page.fill("#q", "停車");
await page.evaluate(() => document.getElementById("q").blur());
await page.waitForTimeout(400);
eq((rows().find((r) => r.q === "停車") || {}).hits > 0, true,
   "「停車」要算命中 —— 診所資訊那兩張卡也在搜尋範圍裡，漏算會叫人去寫一篇不缺的文章");

console.log("\n【八】換頁那一刻與七科頁");
await page.fill("#q", "牙套");
await page.goto(base + "/topics/ortho/", { waitUntil: "load" });
await page.waitForTimeout(500);
eq(!!rows().find((r) => r.q === "牙套"), true, "離開頁面前那個字有送出去（pagehide／sendBeacon）");
await page.fill("#q", "戴多久");
await page.evaluate(() => document.getElementById("q").blur());
await page.waitForTimeout(400);
eq((rows().find((r) => r.q === "戴多久") || {}).scope, "topic:ortho",
   "七科頁內的搜尋標成 topic:<spec>（沒過就是 topics/ 的快照忘了重跑 node tools/topics.mjs）");
eq(errs, [], "站上沒有冒出任何 JS 錯誤");

console.log("\n【九】報告頁");
{
  const ins = web.DB.raw.prepare("INSERT INTO search_log (q, scope, hits, at) VALUES (?,?,?,?)");
  const iso = (d) => new Date(Date.now() - d * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  for (const [q, sc, h, days] of [["植牙", "home", 3, [0.2, 1, 5, 44, 300, 500]],
                                  ["植牙費用", "home", 0, [0.5, 6, 40, 200]],
                                  ["隱適美", "topic:ortho", 0, [0.2, 10, 48]],
                                  ["牙周雷射", "topic:perio", 2, [2, 17]]]) {
    for (const d of days) ins.run(q, sc, h, iso(d));
  }
  ins.run("牙周雷射", "topic:perio", 0, iso(400));   /* 同一個字有時候搜得到、有時候搜不到 */

  await page.goto(base + "/admin/search/", { waitUntil: "load" });
  const src = await page.content();
  eq(["植牙費用", "隱適美"].filter((w) => src.includes(w)), [],
     "還沒登入時，頁面原始碼裡沒有任何一筆資料");
  await page.fill("#key", "wrong");
  await page.click("button.go");
  await page.waitForTimeout(700);
  eq(await page.isVisible("#app"), false, "密碼錯進不去");
  await page.fill("#key", KEY);
  await page.click("button.go");
  await page.waitForSelector("#app:not([hidden])");
  await page.waitForTimeout(300);

  const totals = [];
  for (const label of ["一週", "一個月", "兩個月", "三個月", "半年", "一年", "兩年", "全部"]) {
    await page.click(`#wins button:text-is("${label}")`);
    await page.waitForTimeout(220);
    totals.push(Number(await page.textContent("#s-all")));
  }
  eq(totals.every((v, i) => i === 0 || v >= totals[i - 1]), true, `期間愈長次數愈多：${totals.join(" → ")}`);
  eq(totals[0] < totals[6], true, "一週明顯少於兩年");

  const hit = await page.textContent("#t-hit"), miss = await page.textContent("#t-miss");
  eq(hit.includes("植牙") && !hit.includes("植牙費用"), true, "「植牙」在搜得到那張、「植牙費用」不在");
  eq(miss.includes("植牙費用") && miss.includes("隱適美"), true, "搜不到的都在另一張");
  eq(hit.includes("牙周雷射") && miss.includes("牙周雷射"), true,
     "有時搜得到、有時搜不到的字兩張表都出現（硬歸成一類會讓其中一張說謊）");

  await page.click('#scopes button:text-is("全站搜尋")');
  await page.waitForTimeout(220);
  eq((await page.textContent("#t-hit") + await page.textContent("#t-miss")).includes("隱適美"), false,
     "只看全站時，科別頁內的字不出現");
  await page.click('#scopes button:text-is("全部")');
  await page.waitForTimeout(220);

  const times = await page.$$eval("#t-log tbody tr td.t", (ns) => ns.map((n) => n.textContent));
  eq(/20\d\d-\d\d-\d\d \d\d:\d\d:\d\d/.test(times[0] || ""), true, "逐筆明細印到秒");
  eq(times.length > 5 && times.every((t, i) => i === 0 || times[i - 1] >= t), true,
     "明細照時間由新到舊（不是照寫入順序）");
  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
     "390 寬沒有破框");
  eq(errs, [], "報告頁沒有 JS 錯誤");

  if (SHOT) {
    for (const scheme of ["light", "dark"]) {
      const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
      const p2 = await c2.newPage();
      await p2.goto(base + "/admin/search/", { waitUntil: "load" });
      await p2.fill("#key", KEY);
      await p2.click("button.go");
      await p2.waitForSelector("#app:not([hidden])");
      await p2.waitForTimeout(300);
      await p2.screenshot({ path: `/tmp/search-report-${scheme}.png`, fullPage: true });
      await c2.close();
      console.log(`  · 截圖 /tmp/search-report-${scheme}.png`);
    }
  }
}

await browser.close();
server.close();
console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
process.exit(fail ? 1 : 0);
