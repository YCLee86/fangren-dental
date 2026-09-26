/* =============================================================================
   點擊紀錄 —— 守門（2026-09-20）
   -----------------------------------------------------------------------------
   `node tools/click-test.mjs`            對 repo 裡的檔案跑
   `node tools/click-test.mjs --site`     對 _site/（剝過註解的上線版）跑
   `node tools/click-test.mjs --shot`     順便把報告頁截圖存到 /tmp

   為什麼要有這一支：這條線**壞了站上完全看不出來**（同 search-test.mjs 的理由），
   而且它比搜尋那一條更脆——代碼是從既有的 class 與 href 推出來的
   （assets/click-log.js 的 RULES，刻意不去改站上的標記，理由寫在那支的檔頭），
   所以**版面改了 class，那一顆就會靜靜地不再被記**。
   這一支會真的在瀏覽器裡把每一種按一次，對不上就在這裡擋下來。

   零依賴：資料庫用 node 內建的 node:sqlite 假裝成 D1（Node ≥ 22），
   瀏覽器用 Playwright ＋ 站上既有的那顆 Chromium（找法抄 tools/webp.mjs）。

   ⚠ 改過 src/click.js、assets/click-log.js、admin/search/ 任何一支都要跑它。
   ⚠ 改過 index.html 上任何一顆可以按的東西（尤其是 class），也要跑——
      【八】驗的就是七科頁的快照有沒有跟著重新產生（node tools/topics.mjs）。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { logClick, clickReport, normCode, normScope } from "../src/click.js";

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
const post = (body) => logClick(new Request("https://fangren.net/api/click", {
  method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }), env);
const report = async (win = "30d", key = KEY) => {
  const url = new URL("https://fangren.net/api/click-report?win=" + win);
  const res = await clickReport(new Request(url, { headers: key === null ? {} : { "X-Report-Key": key } }), url, env);
  return { status: res.status, body: await res.json() };
};
const count = () => env.DB.raw.prepare("SELECT COUNT(*) c FROM click_log").get().c;

/* =============================== 資料那一側 =============================== */
console.log("\n【一】代碼的白名單");
eq(normCode("tel"), "tel", "固定代碼收下");
eq(normCode("card:bass-brushing"), "card:bass-brushing", "文章卡帶真的 slug 收下");
eq(normCode("card:no-such-post"), null, "站上沒有這一篇 → 丟掉");
eq(normCode("card:home"), null, "home 不是文章，不能當卡片");
eq(normCode("chip:ortho"), "chip:ortho", "科別標記");
eq(normCode("chip:all"), "chip:all", "「全部」那一顆也算一科");
eq(normCode("chip:dermatology"), null, "站上沒有這一科 → 丟掉");
eq(normCode("theme:dark"), "theme:dark", "夜間開關記的是切過去之後那一邊");
eq(normCode("theme:sepia"), null, "第三種主題不存在 → 丟掉");
eq(normCode("park:d"), null, "第四個停車場不存在 → 丟掉");
eq(normCode("fb:liao-liyang"), "fb:liao-liyang", "醫師卡上的臉書粉專");
eq(normCode("fb:li-binghui"), null, "沒有粉專的醫師 → 丟掉");
eq(normCode("doc:li-binghui"), "doc:li-binghui", "文章裡的醫師 → 首頁那張卡");
eq(normCode("doc:nobody"), null, "站上沒有這一位 → 丟掉");
eq(normCode("doc-more:endo"), "doc-more:endo", "文章裡「○○・N 位」→ 著陸頁");
eq(normCode("sk:li-binghui"), "sk:li-binghui", "醫師卡專長 → 打開小框");
eq(normCode("sk:nobody"), null, "站上沒有這一位 → 丟掉");
eq(normCode("sk-post:bass-brushing"), "sk-post:bass-brushing", "專長小框 → 文章");
eq(normCode("sk-post:no-such-post"), null, "站上沒有這一篇 → 丟掉");
eq(normCode("doc-peek"), "doc-peek", "文章頂端「N 位醫師」");
eq(normCode("nav:topics"), "nav:topics", "頁首選單");
eq(normCode("<script>x"), null, "夾標籤的 → 丟掉");
eq(normCode("card:"), null, "半截的代碼 → 丟掉");
eq(normCode(null), null, "null 不會炸");
eq(normCode("x".repeat(90)), null, "過長 → 丟掉");

console.log("\n【二】從哪一頁按的");
eq(normScope("home"), "home", "首頁");
eq(normScope("topic:ortho"), "topic:ortho", "著陸頁");
eq(normScope("post:bass-brushing"), "post:bass-brushing", "文章頁");
eq(normScope("post:not-a-post"), null, "不存在的文章 → 丟掉");
eq(normScope("topic:evil"), null, "不存在的科 → 丟掉");
eq(normScope("admin"), null, "自己編的來源 → 丟掉");

console.log("\n【三】寫入");
await post({ code: "tel", scope: "home" });
await post({ code: "tel", scope: "post:missing-tooth" });
await post({ code: "card:bioceramic", scope: "home" });
eq(count(), 3, "三筆正常的都收下了");
await post({ code: "tel", scope: "evil" });
await post({ code: "hack", scope: "home" });
await post("這不是 JSON");
await post({ code: "x".repeat(400), scope: "home" });
await post({});
eq(count(), 3, "來源或代碼不合法、body 壞掉、過長，都不收也不會炸");
eq(env.DB.raw.prepare("SELECT at FROM click_log LIMIT 1").get().at.endsWith("Z"), true,
   "時間戳是 ISO 8601（UTC、帶 Z）");

console.log("\n【四】密碼");
eq((await report("30d", "wrong")).status, 401, "密碼錯 → 401");
eq((await report("30d", null)).status, 401, "沒帶密碼 → 401");
{
  const saved = env.REPORT_KEY; env.REPORT_KEY = undefined;
  const r = await report("30d", KEY);
  eq(r.status, 503, "後台沒設 REPORT_KEY 時一律拒絕");
  eq(r.body.error, "unconfigured", "而且說的是「還沒設密碼」不是「密碼不對」");
  env.REPORT_KEY = saved;
}
eq((await report()).status, 200, "密碼對 → 200");
{
  const r = (await report()).body;
  const row = r.rows.find((x) => x.code === "tel" && x.scope === "home");
  eq(row.n, 1, "同一顆在同一頁累計");
  eq(r.rows.filter((x) => x.code === "tel").length, 2,
     "同一顆在不同頁面上分開存（首頁的電話和文章頁的電話不是同一件事）");
}

console.log("\n【五】期間這把尺");
{
  const old = new Date(Date.now() - 400 * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  env.DB.raw.prepare("INSERT INTO click_log (code, scope, at) VALUES ('btt','home',?)").run(old);
  for (const [win, want] of [["7d", false], ["30d", false], ["90d", false], ["180d", false],
                             ["365d", false], ["730d", true], ["all", true]]) {
    eq(!!(await report(win)).body.rows.find((x) => x.code === "btt"), want,
       `${win} ${want ? "撈得到" : "撈不到"} 400 天前那一筆`);
  }
}

console.log("\n【六】每日上限");
{
  const e2 = { DB: makeDB(), REPORT_KEY: KEY };
  for (let i = 0; i < 20010; i++) {
    await logClick(new Request("https://fangren.net/api/click",
      { method: "POST", body: JSON.stringify({ code: "btt", scope: "home" }) }), e2);
  }
  eq(e2.DB.raw.prepare("SELECT COUNT(*) c FROM click_log").get().c, 20000,
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
  console.log("\n⚠ 這台沒有 Playwright／Chromium，瀏覽器那幾項跳過（資料那一側已經驗完）。");
  console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
  process.exit(fail ? 1 : 0);
}

/* 本機的假 Worker：靜態檔 ＋ 真的那兩個 API（搜尋與計數器給個空的） */
const web = { DB: makeDB(), REPORT_KEY: KEY };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon" };
const send = async (res, r) => { res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/click" && req.method === "POST") {
    const c = []; for await (const k of req) c.push(k);
    return send(res, await logClick(new Request("http://x/api/click", { method: "POST", body: Buffer.concat(c).toString() }), web));
  }
  if (url.pathname === "/api/click-report") {
    const u = new URL("http://x" + req.url);
    return send(res, await clickReport(new Request(u, { headers: req.headers }), u, web));
  }
  if (url.pathname === "/api/search" || url.pathname === "/api/search-report") {
    res.writeHead(200, { "Content-Type": "application/json" }); return res.end('{"ok":true,"rows":[],"sums":[],"recent":[],"span":{"first":null,"n":0}}');
  }
  if (url.pathname === "/api/views") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end('{"counts":{}}'); }
  let p = path.join(SITE, decodeURIComponent(url.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;
const logged = () => web.DB.raw.prepare("SELECT code, scope FROM click_log ORDER BY id").all();

const browser = await chromium.launch({ executablePath: chrome });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
/* ⚠ 連結一律不要真的跳走（否則一頁只驗得到一顆）。攔在**捕獲階段**只擋預設行為，
   事件照樣往上冒到 document，所以要驗的那支代理仍然會收到——
   真的會換頁那一顆另外在【十】用真的導覽驗。 */
await ctx.addInitScript(() => {
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a) e.preventDefault();
  }, true);
});
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));

/* 按一顆。用 dispatchEvent 是因為有幾顆平常看不到（搜尋列的 ✕、回到最上面、
   跳到主要內容），真的要滑到那個狀態才按的話，這一支會變成在測版面不是測紀錄。 */
const hit = async (sel) => {
  const ok = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    return true;
  }, sel);
  await page.waitForTimeout(90);
  return ok;
};
const last = () => (logged()[logged().length - 1] || {});
const one = async (sel, code, scope, name) => {
  const found = await hit(sel);
  if (!found) { fail++; console.log(`  ✗ ${name}\n      站上找不到 ${sel}（版面改過 class？）`); return; }
  eq([last().code, last().scope], [code, scope], name);
};

console.log(`\n【七】首頁上的每一顆（${SITE === ROOT ? "repo" : "_site"}）`);
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForTimeout(200);
await one('.hero-contact.c-tel a', "tel", "home", "撥電話（HERO 那一行）");
await one('.foot-tel a', "tel", "home", "撥電話（頁尾）");
await one('.hero-contact.c-addr a', "map:clinic", "home", "地址 → Google 地圖");
await one('.cm-link', "map:pin", "home", "地圖上的診所");
await one('.doc-fb[data-doc="liao-liyang"]', "fb:liao-liyang", "home", "醫師卡上的臉書粉專");
await one('#doc-li-binghui .sk-go', "sk:li-binghui", "home", "醫師卡專長 → 打開小框（沒過就是 doctor-skills.js 沒跑）");
await one('#doc-li-binghui .sk-pop a.sk-pop-a[href$="bass-brushing/"]', "sk-post:bass-brushing", "home", "專長小框 → 文章");
await one('.rlab[data-lot="a"] .rl-link', "park:a", "home", "停車場的名字 → Google 地圖");
await one('.lot[data-lot="b"]', "lot:b", "home", "地圖上點停車場那一塊");
await one('.bay-chip', "bays", "home", "鄰近停車格");
await one('.chips a[data-spec="ortho"]', "chip:ortho", "home", "科別標記");
await one('.hours-filter button[data-spec="perio"]', "hours:perio", "home", "門診表的科別篩選");
await one('.site-nav a[href$="#doctors"]', "nav:doctors", "home", "頁首選單");
await one('.foot-nav a[href$="#clinic"]', "foot:clinic", "home", "頁尾導覽");
await one('.nav-q', "search-open", "home", "頁首的放大鏡");
await one('.hs-x', "search-close", "home", "關閉搜尋");
await one('.skip-link', "skip", "home", "跳到主要內容");
await one('.brand', "brand", "home", "頁首標誌");
await one('.hero-cue', "hero-cue", "home", "HERO 底下的往下看");
await one('.btt', "btt", "home", "回到最上面");
await one('.cards a.card[href$="bass-brushing/"]', "card:bass-brushing", "home", "文章卡");
{
  /* 夜間開關記的是**切過去之後**那一邊 —— 這一項在驗冒泡的順序，
     反過來寫的話每一筆都會差一拍，而畫面上完全看不出來。 */
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await hit(".theme-toggle");
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  eq([last().code, before === after], ["theme:" + after, false],
     `夜間開關記的是切過去之後那一邊（${before} → ${after}）`);
}
eq(errs, [], "首頁沒有冒出任何 JS 錯誤");

console.log("\n【八】著陸頁（七科的快照）");
await page.goto(base + "/topics/ortho/", { waitUntil: "load" });
await page.waitForTimeout(200);
await one('.hero-contact.c-tel a, .foot-tel a', "tel", "topic:ortho",
          "著陸頁上的來源是 topic:<spec>（沒過就是忘了重跑 node tools/topics.mjs）");
await one('.tp-count a[href="#doctors"]', "count:doctors", "topic:ortho", "「N 位醫師」那個連結");
await one('.doc-fb[data-doc="liao-liyang"]', "fb:liao-liyang", "topic:ortho", "矯正頁醫師卡上的臉書粉專");
await one('#doc-wang-junwei .sk-go', "sk:wang-junwei", "topic:ortho", "著陸頁的醫師卡專長 → 打開小框");
await one('.chips a[data-spec="perio"]', "chip:perio", "topic:ortho", "從這一科跳到另一科");

console.log("\n【九】文章頁");
await page.goto(base + "/posts/missing-tooth/", { waitUntil: "load" });
await page.waitForTimeout(200);
await one('.post-tag', "tag:prosth", "post:missing-tooth", "文章上的科別標記");
/* ⚠ 延伸閱讀那三張卡是 build 產的，**發一篇新文章就會換人**（2026-09-21
   〈植牙能用多久〉上線那天中了：第一張從 crown-materials 變成 implant-lifespan）。
   所以這一項不寫死是哪一篇，改成現場讀那個連結指到哪裡、再要求代碼對得上 ——
   要驗的本來就是「代碼是不是從那個 href 推出來的」，不是「那一格現在放誰」。 */
const relSlug = await page.evaluate(() =>
  new URL(document.querySelector(".rel-card a").href).pathname.split("/").filter(Boolean).pop());
await one('.rel-card a', "rel:" + relSlug, "post:missing-tooth", `延伸閱讀（現在第一張是 ${relSlug}）`);
await one('.post-nav a.btn-ghost', "prev:kids-first-visit", "post:missing-tooth", "上一篇");
await one('.post-nav a.btn:not(.btn-ghost)', "next:regular-checkup", "post:missing-tooth", "下一篇");
await one('.foot-tel a', "tel", "post:missing-tooth", "文章頁尾的電話");
/* 「這一科的醫師」（2026-09-25）。〈缺牙之後〉是假牙與植牙，三位（李侑津、楊小瑩、陳芷鈴） */
await one('.pd-peek', "doc-peek", "post:missing-tooth", "頂端那一行底下的「N 位醫師」");
await one('.pd-btt', "doc-btn", "post:missing-tooth", "右下角那一顆「醫師」");
await one('.pd-go[href$="#doc-yang-xiaoying"]', "doc:yang-xiaoying", "post:missing-tooth", "那一塊裡的某一位 → 首頁那張卡");
await page.goto(base + "/posts/bass-brushing/", { waitUntil: "load" });
await page.waitForTimeout(200);
await one('.post-nav a.btn-ghost', "back-list", "post:bass-brushing",
          "第一篇那一顆是「回文章列表」不是上一篇（class 一樣，只有字不同）");
eq(errs, [], "文章頁沒有冒出任何 JS 錯誤");

console.log("\n【十】真的按下去會換頁的那一顆");
{
  const before = logged().length;
  /* 這一次不擋導覽：驗的正是「頁面要走了，那一筆還送得出去嗎」——
     sendBeacon 就是為了這件事存在的，用 fetch 寫的話這一項會不穩定地失敗。 */
  /* ⚠ 要**另開一個 context**：上面那個掛了「攔掉所有連結」的 addInitScript，
     沿用的話這一項等於在驗自己的攔截器。 */
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await ctx2.newPage();
  await p2.goto(base + "/", { waitUntil: "load" });
  await p2.waitForTimeout(200);
  await p2.evaluate(() => {
    const a = document.querySelector('.cards a.card[href$="wisdom-tooth/"]');
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  await p2.waitForTimeout(900);
  const rows = logged().slice(before);
  eq(rows.some((r) => r.code === "card:wisdom-tooth" && r.scope === "home"), true,
     "換頁那一刻那一筆有送出去（sendBeacon）");
  eq(new URL(p2.url()).pathname, "/posts/wisdom-tooth/", "而且頁面真的換過去了（沒有被攔住）");
  await ctx2.close();
}

console.log("\n【十一】報告頁");
{
  const ins = web.DB.raw.prepare("INSERT INTO click_log (code, scope, at) VALUES (?,?,?)");
  const iso = (d) => new Date(Date.now() - d * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  for (const [code, sc, days] of [["tel", "home", [0.2, 1, 5, 44, 300]],
                                  ["tel", "post:missing-tooth", [0.3, 2]],
                                  ["park:c", "home", [0.4, 9]],
                                  ["btt", "home", [0.1, 0.2, 0.3, 1, 2, 3, 4]],
                                  ["chip:ortho", "topic:ortho", [0.5, 3]]]) {
    for (const d of days) ins.run(code, sc, iso(d));
  }

  await page.goto(base + "/admin/search/", { waitUntil: "load" });
  const src = await page.content();
  /* ⚠ 不能掃「撥電話」「壹車房」這種字——那是**代碼的中文名字**，本來就寫在
     這一頁的腳本裡（同 DECISIONS.md 那條「掃整頁等於沒掃」）。
     只有資料才有的東西是「哪一篇文章的頁」與時間戳。 */
  eq(["missing-tooth", "topic:ortho"].filter((w) => src.includes(w)), [],
     "還沒登入時，頁面原始碼裡沒有任何一筆資料");
  eq(await page.isVisible("#app"), false, "而且整份報告是關著的");
  await page.fill("#key", KEY);
  await page.click("button.go");
  await page.waitForSelector("#app:not([hidden])");
  await page.waitForTimeout(300);
  eq(await page.isVisible("#view-search"), true, "進去先看到搜尋那一份");

  await page.click('#tabs button:text-is("點擊紀錄")');
  await page.waitForTimeout(500);
  eq(await page.isVisible("#view-click"), true, "切到點擊那一份");
  eq(await page.textContent("h1"), "點擊紀錄", "標題跟著換");

  const out = await page.textContent("#c-t-out"), inside = await page.textContent("#c-t-in");
  eq(out.includes("撥電話") && out.includes("壹車房停車場"), true, "離站的那幾顆在第一張表");
  eq(out.includes("回到最上面"), false, "站內的不會混進離站那一張");
  eq(inside.includes("回到最上面"), true, "站內的在第二張");

  /* 畫面上的數字要拿**資料庫真的有幾筆**來對，不要在測試裡寫死——
     上面那幾項瀏覽器測試也在同一個資料庫裡留下了紀錄（寫死的話這一項會
     隨著上面加一顆就壞掉，而且壞在一個看起來完全無關的地方）。 */
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString().replace(/\.\d+Z$/, "Z");
  const n = (where, ...a) => web.DB.raw.prepare(
    `SELECT COUNT(*) c FROM click_log WHERE at >= ?${where ? " AND " + where : ""}`).get(since30, ...a).c;
  const allN = n(""), outN = n("(code IN ('tel','line') OR code LIKE 'map:%' OR code LIKE 'park:%' OR code LIKE 'fb:%')");
  const telN = n("code = 'tel'");
  eq(await page.textContent("#c-all"), String(allN), `摘要的總點擊 ＝ 資料庫這 30 天的筆數（${allN}）`);
  eq(await page.textContent("#c-out"), outN + "（" + Math.round(outN / allN * 100) + "%）",
     `摘要的離站動作 ＝ 電話／導航／LINE 的筆數（${outN}）`);
  {
    const first = await page.$$eval("#c-t-out tbody tr", (rs) =>
      /* ⚠ 名字那一格後面還掛著幾個「來源 次數」的小標籤，要取的是**第一個文字節點**，
         整格的 textContent 會把標籤的字一起撈進來。 */
      rs.slice(0, 1).map((r) => [r.querySelector("td.q").childNodes[0].textContent.trim(),
                                 Number(r.querySelector("td.n").textContent)])[0]);
    eq(first, ["撥電話", telN],
       `同一顆在不同頁面上要合起來算一個名次（撥電話共 ${telN} 次，散成幾列的話每一列都看起來很少）`);
  }

  /* 代碼裡是 slug，報告上要印中文（來源 assets/post-titles.json，build 產的）——
     three-month-recall 與 regular-checkup 看字面分不出來，印 slug 等於沒印。 */
  eq(/文章卡：[^\x00-\x7f]/.test(inside), true, "文章卡印的是中文標題不是 slug");
  eq(inside.includes("wisdom-tooth"), false, "英文 slug 不會露在畫面上");
  eq((await page.textContent("#c-t-log")).includes("缺牙之後頁"), true,
     "「在哪一頁」那一欄也印中文（取冒號前那一段，整句會把表格撐破）");

  await page.click('#scopes button:text-is("文章頁")');
  await page.waitForTimeout(250);
  eq((await page.textContent("#c-t-out")).includes("壹車房"), false,
     "只看文章頁時，首頁按的那幾顆不出現");
  await page.click('#scopes button:text-is("全部")');
  await page.waitForTimeout(250);

  const totals = [];
  for (const label of ["一週", "一個月", "兩個月", "三個月", "半年", "一年", "兩年", "全部"]) {
    await page.click(`#wins button:text-is("${label}")`);
    await page.waitForTimeout(260);
    totals.push(Number(await page.textContent("#c-all")));
  }
  eq(totals.every((v, i) => i === 0 || v >= totals[i - 1]), true, `期間愈長次數愈多：${totals.join(" → ")}`);
  eq(totals[0] < totals[7], true, "一週明顯少於全部");

  const times = await page.$$eval("#c-t-log tbody tr td.t", (ns) => ns.map((n) => n.textContent));
  eq(/20\d\d-\d\d-\d\d \d\d:\d\d:\d\d/.test(times[0] || ""), true, "逐筆明細印到秒");
  eq(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
     "390 寬沒有破框");

  await page.click('#tabs button:text-is("搜尋紀錄")');
  await page.waitForTimeout(400);
  eq(await page.isVisible("#view-search"), true, "切得回搜尋那一份");
  eq(errs, [], "報告頁沒有 JS 錯誤");

  if (SHOT) {
    for (const scheme of ["light", "dark"]) {
      const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
      const p2 = await c2.newPage();
      await p2.goto(base + "/admin/search/", { waitUntil: "load" });
      await p2.fill("#key", KEY);
      await p2.click("button.go");
      await p2.waitForSelector("#app:not([hidden])");
      await p2.click('#tabs button:text-is("點擊紀錄")');
      await p2.waitForTimeout(500);
      await p2.screenshot({ path: `/tmp/click-report-${scheme}.png`, fullPage: true });
      await c2.close();
      console.log(`  · 截圖 /tmp/click-report-${scheme}.png`);
    }
  }
}

await browser.close();
server.close();
console.log(`\n${fail ? "✗" : "✓"} ${pass} 項通過，${fail} 項失敗\n`);
process.exit(fail ? 1 : 0);
