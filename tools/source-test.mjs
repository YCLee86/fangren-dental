/* =============================================================================
   來源紀錄 —— 守門（2026-09-25）
   -----------------------------------------------------------------------------
   `node tools/source-test.mjs`            對 repo 裡的檔案跑
   `node tools/source-test.mjs --site`     對 _site/（剝過註解的上線版）跑
   `node tools/source-test.mjs --shot`     順便把報告頁截圖存到 /tmp

   這條線壞了站上完全看不出來（同 search-test／click-test 的理由），而且它有兩件
   只有在真的瀏覽器裡才驗得到的事：
     ・網址列上的 ?from= 有沒有被擦掉、其他參數與 #錨點有沒有被誤擦
     ・重新整理、上一頁、站內換頁**不可以**多算一筆
   ⚠ 改過 src/source.js、assets/source-log.js、admin/search/ 任何一支都要跑它。
   ⚠ 七科頁是快照：改過 index.html 底下那排 <script> 之後要重跑 node tools/topics.mjs，
      不然【六】的著陸頁那一項會過不了。

   零依賴，做法抄 tools/click-test.mjs（node:sqlite 假裝成 D1 ＋ 站上那顆 Chromium）。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { logSource, sourceReport, classify, normHost } from "../src/source.js";

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
const post = (body) => logSource(new Request("https://fangren.net/api/source", {
  method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }), env);
const report = async (win = "30d", key = KEY) => {
  const url = new URL("https://fangren.net/api/source-report?win=" + win);
  const res = await sourceReport(new Request(url, { headers: key === null ? {} : { "X-Report-Key": key } }), url, env);
  return { status: res.status, body: await res.json() };
};
const count = () => env.DB.raw.prepare("SELECT COUNT(*) c FROM source_log").get().c;

/* =============================== 資料那一側 =============================== */
console.log("\n【一】歸類");
const cls = (from, host) => { const c = classify(from, host); return [c.src, c.via, c.host]; };
eq(cls("line", ""), ["line", "tag", null], "?from=line → LINE（標記）");
eq(cls("gbp", "www.google.com"), ["gbp", "tag", null], "標記優先於 referrer（商家檔案不能被算成 Google 搜尋）");
eq(cls("LINE", ""), ["line", "tag", null], "標記不分大小寫");
eq(cls("evil", ""), ["direct", "none", null], "白名單以外的標記 → 當成沒帶");
eq(cls("", "www.google.com"), ["google", "ref", "google.com"], "www.google.com → Google");
eq(cls("", "www.google.com.tw"), ["google", "ref", "google.com.tw"], "google.com.tw → Google");
eq(cls("", "www.google.co.jp"), ["google", "ref", "google.co.jp"], "google.co.jp → Google");
eq(cls("", "gemini.google.com"), ["ai", "ref", "gemini.google.com"], "gemini.google.com 先被 AI 接走");
eq(cls("", "chatgpt.com"), ["ai", "ref", "chatgpt.com"], "ChatGPT → AI 助理");
eq(cls("", "l.facebook.com"), ["facebook", "ref", "l.facebook.com"], "l.facebook.com → Facebook");
eq(cls("", "com.facebook.katana"), ["facebook", "ref", "com.facebook.katana"], "Android 臉書 App 的套件名 → Facebook");
eq(cls("", "jp.naver.line.android"), ["line", "ref", "jp.naver.line.android"], "Android LINE App 的套件名 → LINE");
eq(cls("", "tw.search.yahoo.com"), ["yahoo", "ref", "tw.search.yahoo.com"], "Yahoo 奇摩");
eq(cls("", "www.bing.com"), ["bing", "ref", "bing.com"], "Bing");
eq(cls("", "yclee86.github.io"), ["other", "ref", "yclee86.github.io"], "舊站 → 其他網站（網域留著）");
eq(cls("", "notgoogle.com"), ["other", "ref", "notgoogle.com"], "notgoogle.com 不能被當成 Google");
eq(cls("", ""), ["direct", "none", null], "兩個都沒有 → 沒帶來源");

console.log("\n【二】網域這道閘門（個資）");
eq(normHost("www.google.com/search?q=牙齦流血"), null, "帶路徑或查詢字串的 → 不收（整段網址不存）");
eq(normHost("https://google.com"), null, "帶協定的 → 不收");
eq(normHost("localhost"), null, "沒有點的 → 不收");
eq(normHost("a".repeat(90) + ".com"), null, "過長 → 不收");
eq(normHost("WWW.Example.COM"), "example.com", "大小寫與 www. 收掉");

console.log("\n【三】寫入");
await post({ page: "home", from: "line", host: "" });
await post({ page: "post:missing-tooth", from: "", host: "www.google.com" });
await post({ page: "topic:ortho", from: "", host: "" });
eq(count(), 3, "三筆正常的都收下了");
await post({ page: "admin", from: "line" });
await post({ page: "post:no-such-post", from: "line" });
await post("這不是 JSON");
await post({ page: "home", host: "x".repeat(400) });
await post(null);
await post({});
eq(count(), 3, "頁面不合法、body 壞掉、過長，都不收也不會炸");
eq(env.DB.raw.prepare("SELECT host FROM source_log WHERE src='google'").get().host, "google.com",
   "存的是網域");
eq(env.DB.raw.prepare("SELECT at FROM source_log LIMIT 1").get().at.endsWith("Z"), true,
   "時間戳是 ISO 8601（UTC、帶 Z）");
eq(env.DB.raw.prepare("PRAGMA table_info(source_log)").all().map((c) => c.name),
   ["id", "src", "via", "host", "page", "at"], "資料表只有這六欄（沒有 IP、UA、流水號）");

console.log("\n【四】密碼與期間");
eq((await report("30d", "wrong")).status, 401, "密碼錯 → 401");
eq((await report("30d", null)).status, 401, "沒帶密碼 → 401");
{
  const saved = env.REPORT_KEY; env.REPORT_KEY = undefined;
  eq((await report()).status, 503, "後台沒設 REPORT_KEY 時一律拒絕");
  env.REPORT_KEY = saved;
}
{
  const old = new Date(Date.now() - 400 * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  env.DB.raw.prepare("INSERT INTO source_log (src, via, host, page, at) VALUES ('bing','ref','bing.com','home',?)").run(old);
  eq(!!(await report("365d")).body.rows.find((x) => x.src === "bing"), false, "一年撈不到 400 天前那一筆");
  eq(!!(await report("730d")).body.rows.find((x) => x.src === "bing"), true, "兩年撈得到");
  eq((await report("all")).body.hosts.some((x) => x.host === "bing.com"), true, "網域那張表有它");
}

console.log("\n【五】每日上限");
{
  const e2 = { DB: makeDB(), REPORT_KEY: KEY };
  for (let i = 0; i < 5010; i++) {
    await logSource(new Request("https://fangren.net/api/source",
      { method: "POST", body: JSON.stringify({ page: "home", from: "line" }) }), e2);
  }
  eq(e2.DB.raw.prepare("SELECT COUNT(*) c FROM source_log").get().c, 5000, "超過上限之後安靜地丟掉");
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
  console.log("\n⚠ 這台沒有 Playwright／Chromium，瀏覽器那幾項跳過（資料那一側已經驗完）。");
  console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
  process.exit(fail ? 1 : 0);
}


const web = { DB: makeDB(), REPORT_KEY: KEY };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon" };
const send = async (res, r) => { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
const EMPTY = '{"ok":true,"rows":[],"sums":[],"recent":[],"hosts":[],"span":{"first":null,"n":0}}';
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/source" && req.method === "POST") {
    const c = []; for await (const k of req) c.push(k);
    return send(res, await logSource(new Request("http://x/api/source", { method: "POST", body: Buffer.concat(c).toString() }), web));
  }
  if (url.pathname === "/api/source-report") {
    const u = new URL("http://x" + req.url);
    return send(res, await sourceReport(new Request(u, { headers: req.headers }), u, web));
  }
  if (url.pathname.startsWith("/api/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(url.pathname === "/api/views" ? '{"counts":{}}' : EMPTY);
  }
  let p = path.join(SITE, decodeURIComponent(url.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));
/* 資料表是第一次用到時才建的，先打一次報告讓它建起來，底下的 logged() 才讀得到。 */
{ const u = new URL("http://x/api/source-report"); await sourceReport(new Request(u, { headers: { "X-Report-Key": KEY } }), u, web); }
const base = `http://localhost:${PORT}`;
const logged = () => web.DB.raw.prepare("SELECT src, via, host, page FROM source_log ORDER BY id").all()
  .map((r) => [r.src, r.via, r.host, r.page]);

const browser = await chromium.launch({ executablePath: chrome });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
const settle = () => page.waitForTimeout(350);
const newRows = async (fn) => { const n = logged().length; await fn(); await settle(); return logged().slice(n); };

console.log(`\n【六】真的從站外進來（${SITE === ROOT ? "repo" : "_site"}）`);
eq(await newRows(() => page.goto(base + "/?from=line", { waitUntil: "load" })),
   [["line", "tag", null, "home"]], "LINE 圖文選單的連結 → 一筆 LINE、落在首頁");
eq(await page.evaluate(() => location.href), base + "/", "網址列上的 ?from=line 被擦掉了");
eq(await newRows(() => page.reload({ waitUntil: "load" })), [], "重新整理不多算一筆");

eq(await newRows(() => page.goto(base + "/posts/missing-tooth/?from=gbp&x=1#faq", { waitUntil: "load" })),
   [["gbp", "tag", null, "post:missing-tooth"]], "文章頁也記得到");
eq(await page.evaluate(() => location.pathname + location.search + location.hash),
   "/posts/missing-tooth/?x=1#faq", "只擦 from 一個，其他參數與 #錨點原樣留著");
eq(await newRows(() => page.goBack({ waitUntil: "load" })), [], "上一頁不多算一筆");

eq(await newRows(() => page.goto(base + "/posts/bass-brushing/", { waitUntil: "load", referer: "https://www.google.com/" })),
   [["google", "ref", "google.com", "post:bass-brushing"]], "從 Google 點進文章頁（靠 referrer）");
eq(await newRows(() => page.goto(base + "/topics/ortho/", { waitUntil: "load", referer: "https://l.facebook.com/" })),
   [["facebook", "ref", "l.facebook.com", "topic:ortho"]],
   "著陸頁也記得到（沒過就是忘了重跑 node tools/topics.mjs）");
eq(await newRows(() => page.goto(base + "/?q=植牙&from=line", { waitUntil: "load" })),
   [["line", "tag", null, "home"]], "帶搜尋字的首頁");
eq(decodeURIComponent(await page.evaluate(() => location.search)), "?q=植牙", "?q= 留著（首頁的搜尋要讀它）");

console.log("\n【七】站內換頁不算");
await page.goto(base + "/", { waitUntil: "load" });
await settle();
eq(await newRows(() => Promise.all([page.waitForNavigation({ waitUntil: "load" }),
  page.evaluate(() => document.querySelector('.cards a.card[href$="wisdom-tooth/"]').click())])),
   [], "從首頁點文章卡進文章頁 → 不記");
eq(new URL(page.url()).pathname, "/posts/wisdom-tooth/", "而且真的換過去了");
eq(errs, [], "沒有冒出任何 JS 錯誤");

console.log("\n【八】報告頁");
{
  const ins = web.DB.raw.prepare("INSERT INTO source_log (src, via, host, page, at) VALUES (?,?,?,?,?)");
  const iso = (d) => new Date(Date.now() - d * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  for (const [s, v, h, p, days] of [["google", "ref", "google.com", "post:perio-laser", [0.2, 1, 5, 44]],
                                    ["line", "tag", null, "home", [0.3, 2, 3]],
                                    ["other", "ref", "ptt.cc", "post:wisdom-tooth", [0.4]],
                                    ["direct", "none", null, "home", [0.1, 0.5, 9, 300]]]) {
    for (const d of days) ins.run(s, v, h, p, iso(d));
  }
  await page.goto(base + "/admin/search/", { waitUntil: "load" });
  eq((await page.content()).includes("ptt.cc"), false, "還沒登入時，頁面原始碼裡沒有任何一筆資料");
  await page.fill("#key", KEY);
  await page.click("button.go");
  await page.waitForSelector("#app:not([hidden])");
  await page.click('#tabs button:text-is("來源紀錄")');
  await page.waitForTimeout(500);
  eq(await page.isVisible("#view-source"), true, "切到來源那一份");
  eq([await page.isVisible("#view-search"), await page.isVisible("#view-click")], [false, false], "另外兩份藏起來");
  eq(await page.textContent("h1"), "來源紀錄", "標題跟著換");

  const since30 = new Date(Date.now() - 30 * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  const n = (where, ...a) => web.DB.raw.prepare(
    `SELECT COUNT(*) c FROM source_log WHERE at >= ?${where ? " AND " + where : ""}`).get(since30, ...a).c;
  eq(await page.textContent("#r-all"), String(n("")), `摘要 ＝ 資料庫這 30 天的筆數（${n("")}）`);
  const top = await page.$$eval("#r-t-src tbody tr", (rs) => rs.map((r) =>
    [r.querySelector("td.q").childNodes[0].textContent.trim(), Number(r.querySelector("td.n b").textContent)]));
  const want = web.DB.raw.prepare(`SELECT src, COUNT(*) c FROM source_log WHERE at >= ? GROUP BY src ORDER BY c DESC`).all(since30);
  eq(top.length, want.length, "每一種來源一列");
  eq(top.find((r) => r[0] === "Google 搜尋")[1], want.find((r) => r.src === "google").c, "Google 的次數對得上資料庫");
  eq((await page.textContent("#r-t-host")).includes("ptt.cc"), true, "「其他網站」看得到是哪個網域");
  eq((await page.textContent("#r-t-page")).includes("perio-laser"), false, "進站頁印中文標題不是 slug");
  await page.click('#scopes button:text-is("文章頁")');
  await page.waitForTimeout(250);
  eq((await page.textContent("#r-t-src")).includes("LINE"), false, "只看文章頁時，落在首頁的 LINE 不出現");
  await page.click('#scopes button:text-is("全部")');
  const totals = [];
  for (const label of ["一週", "一個月", "一年", "全部"]) {
    await page.click(`#wins button:text-is("${label}")`);
    await page.waitForTimeout(260);
    totals.push(Number(await page.textContent("#r-all")));
  }
  eq(totals.every((v, i) => i === 0 || v >= totals[i - 1]) && totals[0] < totals[3], true,
     `期間愈長次數愈多：${totals.join(" → ")}`);
  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, "390 寬沒有破框");
  await page.click('#tabs button:text-is("點擊紀錄")');
  await page.waitForTimeout(400);
  eq([await page.isVisible("#view-click"), await page.isVisible("#view-source")], [true, false], "切得回點擊那一份");
  eq(errs, [], "報告頁沒有 JS 錯誤");

  if (SHOT) {
    for (const scheme of ["light", "dark"]) {
      const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
      const p2 = await c2.newPage();
      await p2.goto(base + "/admin/search/", { waitUntil: "load" });
      await p2.fill("#key", KEY);
      await p2.click("button.go");
      await p2.waitForSelector("#app:not([hidden])");
      await p2.click('#tabs button:text-is("來源紀錄")');
      await p2.waitForTimeout(500);
      await p2.screenshot({ path: `/tmp/source-report-${scheme}.png`, fullPage: true });
      await c2.close();
      console.log(`  · 截圖 /tmp/source-report-${scheme}.png`);
    }
  }
}

await browser.close();
server.close();
console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
process.exit(fail ? 1 : 0);
