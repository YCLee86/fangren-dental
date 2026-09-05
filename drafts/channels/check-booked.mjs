#!/usr/bin/env node
/* 守門：預約成功通知 ＋ 約診紀錄查詢的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-booked.mjs
 *
 * 同 check-welcome.mjs／check-bind-done.mjs／check-remind.mjs 那條道理：
 * **規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 * 這一支比對八件：
 *   ① 兩則的每一段文字逐字（含加粗的姓名）
 *   ② 字級（LINE Flex 的固定 px 表 —— 定案 日期 lg 19／姓名 md 16／小字 xs 13）
 *   ③ 顏色（卡 #F4F4F5・墨 #2A2C27・柔墨 #5C5F57，一顆都沒新增）
 *   ④ 浮水印：九顆的寬度與長寬比要**逐筆等於 wm-sizes.json**（唯一出處）
 *   ⑤ 浮水印：九顆 × 三個濃度的 PNG 都在，而且不超過 LINE 的 1024×1024
 *   ⑥ 浮水印的顏色：JSON 的對照表要等於 wm-sizes.json 算出來的那一組
 *   ⑦ 紅線：不可以出現「有問題隨時問」那一類的承諾；emoji 0 個
 *   ⑧ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠⚠ 而且那一頁的浮水印是 fetch("wm-sizes.json") 讀回來的，`file://` 拿不到
 *   —— 這一支自己起一個 HTTP 伺服器再開（同 booked-png.mjs）。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠⚠ **姓名與日期兩處刻意不逐字比對**：JSON 寫 {{patient}}／{{date}}，
 *   規格頁寫看得懂的示範值（〔病人姓名〕／8月25日 (二) 10:15）。
 *   所以這兩處檢查的是「兩邊都是變數的位置」＋「規格頁上不准直接印 {{…}}」。
 *   （check-remind 那一支第一版照字面比，兩處都誤報。）
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-booked");
const JSONF = path.join(HERE, "booked-card.json");
const SIZESF = path.join(DIR, "wm-sizes.json");

const card = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const sizes = JSON.parse(fs.readFileSync(SIZESF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const ORDER = ["r1c1", "r1c2", "r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r3c2", "r3c3"];
const flat = (t) => (t.text != null ? t.text : t.contents.map((c) => c.text).join(""));

function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  throw new Error("只支援 PNG：" + file);
}

/* ---- ① 兩則的殼：內容 box（relative）＋ 浮水印（absolute）------------ */
const BOOKED = card["預約成功通知"];
const QUERY = card["約診紀錄查詢"].contents[0];
for (const [name, b] of [["預約成功", BOOKED], ["查詢輪播", QUERY]]) {
  const kids = b.body.contents;
  ok(kids.length === 2, `${name}：body 應該只有兩個子元件（內容 ＋ 浮水印），現在 ${kids.length}`);
  /* ⚠⚠⚠ 這一條是這一支最要緊的：Flex **不准一個 box 的第一個子元件是 absolute**。
     內容排前面、浮水印排後面 —— 順序寫反的話 LINE 直接不畫，而且錯誤訊息很難讀。 */
  ok(kids[0].position !== "absolute",
    `${name}：第一個子元件不可以是 position: absolute（Flex 的硬限制）`);
  ok(kids[0].position === "relative",
    `${name}：內容那個 box 要 position: relative，浮水印才會被壓在它下面`);
  ok(kids[1].position === "absolute", `${name}：浮水印要 position: absolute`);
  ok(b.body.backgroundColor === "#F4F4F5", `${name}：卡色要 #F4F4F5`);
  ok(b.body.paddingAll === "14px", `${name}：內距要 14px（和另外三則同一套）`);
}

/* ---- ② 文字逐字 ＋ 字級 ＋ 顏色 -------------------------------------- */
const bk = BOOKED.body.contents[0].contents;
const qk = QUERY.body.contents[0].contents;
ok(bk.length === 4, `預約成功：應該是 4 段（開場／日期／小字 ×2），現在 ${bk.length}`);
ok(qk.length === 2, `查詢輪播：應該是 2 段（姓名／日期），現在 ${qk.length}`);

/* 開場那一段：加粗的姓名變數 ＋「　約好囉」（使用者自己寫的，逐字） */
ok(bk[0].contents && bk[0].contents[0].weight === "bold",
  "預約成功：開場那個姓名沒有加粗");
ok(bk[0].contents[0].text === "{{patient}}", "預約成功：姓名要是 {{patient}} 變數");
ok(bk[0].contents[1].text === "　約好囉",
  `預約成功：開場的第二段該是「　約好囉」，現在「${bk[0].contents[1].text}」`);
ok(PX[bk[0].size] === 16, `預約成功：開場字級該是 md 16，現在 ${bk[0].size}`);

const FINE = ["異動請在2天前(不含假日)與診所聯繫", "看診前2天會再提醒一次，記得回覆喔～"];
FINE.forEach((t, i) => {
  ok(bk[2 + i].text === t, `預約成功：第 ${i + 1} 條小字對不上 —— 「${bk[2 + i].text}」`);
  ok(PX[bk[2 + i].size] === 13, `預約成功：第 ${i + 1} 條小字該是 xs 13`);
  ok(bk[2 + i].color === "#5C5F57", `預約成功：第 ${i + 1} 條小字該是柔墨`);
  /* ⚠ 括號是**半形**（使用者 2026-09-05 指定，全形一組多吃約 19px）。 */
  ok(!/[（）]/.test(t), `預約成功：第 ${i + 1} 條裡有全形括號，定案是半形`);
});

/* 日期：兩則都是 lg 19、粗體、墨，而且**一定要 wrap**（那是這一輪唯一在修的 bug） */
for (const [name, d] of [["預約成功", bk[1]], ["查詢輪播", qk[1]]]) {
  ok(d.text === "{{date}}", `${name}：日期要是 {{date}} 變數`);
  ok(PX[d.size] === 19, `${name}：日期字級該是 lg 19，現在 ${d.size}`);
  ok(d.weight === "bold", `${name}：日期要粗體`);
  ok(d.color === "#2A2C27", `${name}：日期要用墨 #2A2C27`);
  /* ⚠⚠⚠ 這一條就是這兩則現在正在出錯的那件事：廠商那一版設了 maxLines: 1，
     日期在輪播的寬度上被**截斷**（截圖上真的截了）。wrap 才不會有字消失。 */
  ok(d.wrap === true, `${name}：日期一定要 wrap: true —— 現在線上是 maxLines: 1，字會被截掉`);
  ok(d.maxLines == null, `${name}：日期不可以有 maxLines`);
}
ok(qk[0].text === "{{patient}}", "查詢輪播：姓名要是 {{patient}} 變數");
ok(PX[qk[0].size] === 16, `查詢輪播：姓名字級該是 md 16，現在 ${qk[0].size}`);
ok(qk[0].color === "#5C5F57", "查詢輪播：姓名要用柔墨（它是標籤不是主角）");

/* ---- ③ 沒有按鈕、沒有彩色方塊（這兩則是收據）------------------------ */
const dump = JSON.stringify([BOOKED, QUERY]);
ok(!/"action"/.test(dump), "這兩則上不該有任何按鈕（沒有「現在請你做」的動作）");
ok(!/"backgroundColor":"(?!#F4F4F5)/.test(dump.replace(/\s/g, "")) ||
   (dump.match(/"backgroundColor": ?"(#[0-9A-Fa-f]{6})"/g) || [])
     .every((s) => /#F4F4F5/i.test(s)),
  "這兩則上不該有淡底彩色方塊 —— 那是給警示與行動用的");

/* ---- ④⑤⑥ 浮水印：對照表 ↔ wm-sizes.json ↔ 真的 PNG ------------------ */
const table = card["_浮水印"];
ok(Object.keys(table).length === 9, `浮水印對照表該有九筆，現在 ${Object.keys(table).length}`);
ok(JSON.stringify(Object.keys(table)) === JSON.stringify(ORDER),
  "浮水印對照表的順序要照 r1c1…r3c3 —— (月＋日)%9 就是對到這個順序");
for (const n of ORDER) {
  const t = table[n], z = sizes[n];
  if (!t || !z) { bad.push(`浮水印 ${n} 少了一邊`); continue; }
  ok(t.watermark_size === z.w + "px",
    `浮水印 ${n} 的寬度 ${t.watermark_size} 對不上 wm-sizes.json 的 ${z.w}px`);
  ok(t.watermark_ratio === z.ratio + ":1",
    `浮水印 ${n} 的長寬比 ${t.watermark_ratio} 對不上 wm-sizes.json 的 ${z.ratio}`);
  ok(t["色"].toLowerCase() === z.color.toLowerCase(),
    `浮水印 ${n} 的顏色 ${t["色"]} 對不上 wm-sizes.json 的 ${z.color}`);
  /* 九顆 × 三個濃度都要在，而且不超過 LINE 的 1024×1024 */
  for (const k of ["08", "12", "18"]) {
    const f = path.join(DIR, `wm-${n}-${k}.png`);
    if (!fs.existsSync(f)) { bad.push(`少了 ${path.basename(f)}（跑 booked-mark.mjs）`); continue; }
    const s = imgSize(f);
    ok(s.w <= 1024 && s.h <= 1024, `${path.basename(f)} 是 ${s.w}×${s.h}，超過 LINE 的 1024`);
    /* ⚠ 長寬比要對得上 —— 寫錯 aspectRatio 在 LINE 上**不報錯也不變形**，
       只會靜靜地縮小、四周留白（第十一之二節）。 */
    if (k === "12")
      ok(Math.abs(s.w / s.h - z.ratio) < 0.02,
        `${path.basename(f)} 真實長寬比 ${(s.w / s.h).toFixed(3)} 對不上 ${z.ratio}`);
  }
}
/* 樣板本身要用變數，不要不小心寫死某一顆 */
const wmEl = BOOKED.body.contents[1];
ok(/\{\{watermark\}\}/.test(wmEl.url), "浮水印的網址要用 {{watermark}} 變數（哪一顆由系統算）");
ok(/-12\.png$/.test(wmEl.url), "浮水印定案用濃度 12");
ok(wmEl.size === "{{watermark_size}}" && wmEl.aspectRatio === "{{watermark_ratio}}",
  "浮水印的 size 與 aspectRatio 要跟著那一顆走（九顆各不相同）");

/* ---- ⑦ 紅線 --------------------------------------------------------- */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "馬上回", "找得到人", "有專人"];
const words = [flat(bk[0]), ...FINE, "{{date}}", "{{patient}}"].join("")
  .replace(/沒有專人/g, "＿");
LIE.forEach((w) => ok(words.indexOf(w) < 0, `卡上出現「${w}」—— 這個帳號沒有專人即時回覆`));
ok(!/[☀-➿]|[\ud83c-\ud83e][\udc00-\udfff]/.test(words), "卡上有 emoji");

/* ---- ⑧ 規格頁：切換條要拿掉、兩則都畫得出來、浮水印九顆都讀得到 ------ */
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (f.endsWith("/")) f = path.join(f, "index.html");
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = "http://127.0.0.1:" + server.address().port + "/preview/line-booked/";

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
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForFunction(() =>
  document.querySelectorAll("#pv-wmref figure").length === 9, { timeout: 8000 })
  .catch(() => bad.push("規格頁畫不出九顆浮水印的對照表（wm-sizes.json 讀不到？）"));
const got = await page.evaluate(() => {
  const T = (el) => (el ? (el.innerText || "").replace(/\s+/g, " ").trim() : null);
  return {
    bar: !!document.querySelector(".pv-bar"),
    booked: T(document.querySelector("#pv-slot .pv-hc")),
    q1: T(document.querySelector("#pv-slot2 .pv-hc")),
    cw: +document.querySelector("#pv-slot .pv-hc").getBoundingClientRect().width.toFixed(1),
    qw: +document.querySelector("#pv-slot2 .pv-hc").getBoundingClientRect().width.toFixed(1),
    shapes: [...document.querySelectorAll("#pv-slot2 .wm")].map((e) => e.dataset.shape),
    bkShape: (document.querySelector("#pv-slot .wm") || {}).dataset?.shape,
    dtFs: getComputedStyle(document.querySelector("#pv-slot .dt")).fontSize,
    whoFs: getComputedStyle(document.querySelector("#pv-slot2 .who")).fontSize,
    tmpl: document.body.innerText.indexOf("{{") >= 0,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});
await browser.close();
server.close();

ok(errs.length === 0, "規格頁有 JS 錯誤：" + errs.join(" / "));
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");
ok(!got.tmpl, "規格頁上直接印出了 {{…}} —— 那是給廠商的變數，頁面上要寫看得懂的示範值");
ok(got.cw === 268, `預約成功那張卡量到 ${got.cw}px，該是 268`);
ok(got.qw === 207, `輪播那張卡量到 ${got.qw}px，該是 207`);
ok(got.overflow === 0, `規格頁有 ${got.overflow}px 水平捲動`);
ok(got.dtFs === "19px", `規格頁的日期是 ${got.dtFs}，定案是 19px`);
ok(got.whoFs === "16px", `規格頁的姓名是 ${got.whoFs}，定案是 16px`);
FINE.forEach((t, i) =>
  ok(got.booked && got.booked.indexOf(t) >= 0, `規格頁上找不到第 ${i + 1} 條小字`));
ok(got.booked && got.booked.indexOf("約好囉") >= 0, "規格頁上找不到「約好囉」");
/* ⚠⚠ 這一條是「按日期算」那條規則的實證：同一筆約診（8/25）在兩則上要是同一顆。
   隨機或按位置的話這裡就會不一樣 —— 規則壞掉的時候只有這一項看得出來。 */
ok(got.bkShape && got.bkShape === got.shapes[1],
  `同一筆約診在兩則上的浮水印不一樣（預約成功 ${got.bkShape}、查詢 ${got.shapes[1]}）`);
ok(new Set(got.shapes).size === got.shapes.length,
  `輪播四張裡有重複的浮水印：${got.shapes.join("、")}`);

if (bad.length) {
  console.error("✗ " + bad.length + " 項對不上：");
  bad.forEach((b) => console.error("  ・" + b));
  process.exit(1);
}
console.log("✓ 預約成功 ＋ 約診紀錄查詢：JSON ↔ 規格頁 ↔ wm-sizes.json ↔ 27 張 PNG 全部對得上");
console.log("  卡片 268 / 207px　日期 lg 19　姓名 md 16　小字 xs 13　浮水印九顆・濃度 12");
