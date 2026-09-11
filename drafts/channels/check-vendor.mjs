#!/usr/bin/env node
// 守門：廠商對接那一頁（preview/line-vendor/）
//
// 擋八件：
//  ① 重跑 build-vendor.mjs、逐位比對（有人手改了頁面，或改了 JSON 卻忘了重跑）
//  ② ⚠⚠ 頁面上不可以出現「七則訊息的文字」—— 那些字的出處是各自的 Flex JSON 與
//     auto-reply.txt，抄進來就是第八個真相。這一道從那些檔裡現抽長句去掃。
//  ③ noindex 三個關鍵字都在
//  ④ 零 JS（交給人看的現況表沒有理由需要跑腳本）
//  ⑤ 紅線（「隨時問」那一類 —— 這個帳號沒有專人即時回覆）
//  ⑥ 內部連結指得到真的檔案
//  ⑦ 八個寬度水平溢出 0、JS 錯 0
//  ⑧ 頁上每一張圖都找得到、width/height 對得上實檔、沒有孤兒縮圖
//  ⑨ 只敘述事實：不出現「真／假」那一組判語，也不留警示色的標籤
//     （2026-09-11 使用者：「不要有太情緒或是指控誰說謊　只要基於事實
//      客觀的敘述就好」。加回去不會讓任何一道版面守門翻臉，所以要有一道盯著。）
//     ⚠ 縮圖是 vendor-shots.mjs 從各則規格頁的產出檔縮出來的 —— 那幾頁重跑過
//       出圖腳本之後，這一支也要重跑，不然這一頁的圖會停在舊版。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-vendor", "index.html");
const bad = [];
const ok = (m) => console.log("  ✓ " + m);

/* ① 重跑逐位比對 ------------------------------------------------------ */
const before = fs.readFileSync(PAGE);
execFileSync("node", [path.join(HERE, "build-vendor.mjs")], { stdio: "pipe" });
const after = fs.readFileSync(PAGE);
if (!before.equals(after)) bad.push("① 重跑之後內容變了 ＝ 有人手改了頁面，或改了 JSON 沒重跑");
else ok("① 重跑逐位相同");

const html = after.toString("utf8");

/* ② 不可以抄任何一則訊息的文字 ---------------------------------------- */
const sources = [
  "welcome-card.json", "bind-done-card.json", "reminder-card.json",
  "review-card.json", "cancel-card.json", "booked-card.json", "typhoon-card.json",
];
let scanned = 0;
const texts = [];
for (const f of sources) {
  const p = path.join(HERE, f);
  if (!fs.existsSync(p)) continue;
  scanned++;
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      for (const [k, v] of Object.entries(n)) {
        if (k.startsWith("_")) continue;          // 說明鍵不是成品的字
        if (k === "text" && typeof v === "string") texts.push(v);
        else walk(v);
      }
    }
  };
  walk(JSON.parse(fs.readFileSync(p, "utf8")));
}
const auto = path.join(HERE, "auto-reply.txt");
if (fs.existsSync(auto)) { scanned++; texts.push(...fs.readFileSync(auto, "utf8").split("\n")); }

/* 只拿「夠長、夠獨特」的句子去掃 —— 短詞（例如「綁定」）本來就會出現在說明裡 */
const probes = [...new Set(texts.flatMap((t) => t.split(/\n/)))]
  .map((t) => t.replace(/\{\{\w+\}\}/g, "").trim())
  .filter((t) => t.length >= 10);
const leaked = probes.filter((t) => html.includes(t));
if (!scanned) bad.push("② 一份訊息 JSON 都沒讀到 ＝ 這一道等於沒跑");
else if (leaked.length) bad.push(`② 頁面上抄了訊息的文字（${leaked.length} 句）：${leaked[0].slice(0, 24)}…`);
else ok(`② 沒有抄任何一則訊息的文字（${scanned} 份來源、${probes.length} 句掃過）`);

/* ③ noindex ----------------------------------------------------------- */
for (const w of ["noindex", "nofollow", "noarchive"])
  if (!html.includes(w)) bad.push(`③ 缺 ${w}`);
if (!bad.some((b) => b.startsWith("③"))) ok("③ noindex 三個都在");

/* ④ 零 JS ------------------------------------------------------------- */
if (/<script/i.test(html)) bad.push("④ 出現 script 標籤");
else ok("④ 零 JS");

/* ⑤ 紅線 -------------------------------------------------------------- */
const RED = ["隨時問", "隨時詢問", "即時回覆您", "都會回覆", "有問題歡迎私訊", "小編"];
const hit = RED.filter((w) => html.includes(w));
if (hit.length) bad.push(`⑤ 踩到紅線：${hit.join("、")}`);
else ok("⑤ 紅線 0");

/* ⑥ 內部連結 ---------------------------------------------------------- */
for (const m of html.matchAll(/href="(\/preview\/[^"]+)"/g)) {
  const p = path.join(ROOT, m[1].replace(/^\//, ""), "index.html");
  if (!fs.existsSync(p)) bad.push(`⑥ 連結指不到檔案：${m[1]}`);
}
if (!bad.some((b) => b.startsWith("⑥"))) ok("⑥ 內部連結都通");

/* ⑦ 版面 -------------------------------------------------------------- */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const errs = [];
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  page.on("pageerror", (e) => errs.push(`${w}: ${e.message}`));
  await page.goto("file://" + PAGE, { waitUntil: "load" });
  const over = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  if (over > 0) bad.push(`⑦ ${w} 水平溢出 ${over}px`);
  await page.close();
}
await browser.close();
if (errs.length) bad.push(`⑦ JS 錯 ${errs.length}：${errs[0]}`);
if (!bad.some((b) => b.startsWith("⑦"))) ok("⑦ 八個寬度水平溢出 0、JS 錯 0");

/* ⑧ 圖 ---------------------------------------------------------------- */
const DIR = path.dirname(PAGE);
const sizeOf = (f) => {
  const b2 = fs.readFileSync(f);
  if (b2[0] === 0x89 && b2[1] === 0x50) return { w: b2.readUInt32BE(16), h: b2.readUInt32BE(20) };
  /* JPEG 要掃 SOF，不能像 PNG 那樣讀固定位移 */
  for (let i = 2; i < b2.length - 9; ) {
    if (b2[i] !== 0xff) { i++; continue; }
    const m2 = b2[i + 1];
    if (m2 >= 0xc0 && m2 <= 0xcf && m2 !== 0xc4 && m2 !== 0xc8 && m2 !== 0xcc)
      return { w: b2.readUInt16BE(i + 7), h: b2.readUInt16BE(i + 5) };
    i += 2 + b2.readUInt16BE(i + 2);
  }
  throw new Error(`${f} 讀不出尺寸`);
};
const used = new Set();
let imgs = 0;
for (const m of html.matchAll(/<img\s[^>]*>/g)) {
  const tag = m[0];
  const src = (tag.match(/src="([^"]+)"/) || [])[1];
  const w = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
  const h = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
  if (!src) { bad.push("⑧ 有一張 img 沒有 src"); continue; }
  if (!/alt="[^"]+"/.test(tag)) bad.push(`⑧ ${src} 沒有 alt`);
  const f = path.resolve(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`⑧ 找不到圖：${src}`); continue; }
  if (f.startsWith(DIR + path.sep)) used.add(path.basename(f));
  const s2 = sizeOf(f);
  if (s2.w !== w || s2.h !== h)
    bad.push(`⑧ ${src} 宣告 ${w}×${h}，實檔是 ${s2.w}×${s2.h}`);
  imgs++;
}
/* 孤兒縮圖：改過 vendor-log.json 之後留在資料夾裡沒人引用的那幾張 */
for (const f of fs.readdirSync(DIR))
  if (/^t-.*\.jpg$/.test(f) && !used.has(f)) bad.push(`⑧ 沒有人引用的縮圖：${f}`);
/* 縮圖本身要和來源對得上（尺寸；來源換圖了就重跑 vendor-shots.mjs） */
try {
  execFileSync("node", [path.join(HERE, "vendor-shots.mjs"), "--check"], { stdio: "pipe" });
} catch (e) {
  bad.push("⑧ vendor-shots.mjs --check 沒過：" + String(e.stdout || e).slice(0, 160));
}
if (!bad.some((x) => x.startsWith("⑧"))) ok(`⑧ ${imgs} 張圖都在、尺寸對得上、沒有孤兒縮圖`);

/* ⑨ 只敘述事實 -------------------------------------------------------- */
const JUDGE = ["真不真", "說謊", "指控", "有反例", "只有一半對", "講太寬",
               "答的是另一個問題", "答的是另一件事", "證據力", "主力", "補刀"];
const j = JUDGE.filter((w) => html.includes(w));
if (j.length) bad.push(`⑨ 出現判語：${j.join("、")}`);
else if (/class="tag/.test(html)) bad.push("⑨ 還留著警示色的標籤（class=\"tag…\"）");
else if (html.includes("⚠")) bad.push("⑨ 還留著警示記號（⚠）");
else ok("⑨ 沒有判語、沒有警示色、沒有警示記號");

if (bad.length) { console.error("\n✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log("\n全部通過。");
