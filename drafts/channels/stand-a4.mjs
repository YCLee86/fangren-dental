#!/usr/bin/env node
/* 櫃檯的小立牌 —— 一張 A4 印四張（2026-09-17）
 *
 *   node drafts/channels/stand-a4.mjs
 *     → drafts/channels/芳仁-LINE立牌-A4.pdf   （要印的就是這一份）
 *     → drafts/channels/stand-a4.png           （看一眼用的）
 *     → drafts/channels/stand-a4.html          （自給自足的一頁，帶去任何一台電腦開、Ctrl+P）
 *
 *   可帶：--cols=2 --rows=2（改幾張一排）　--mark=0（不要那圈裁切線）
 *
 * 起點：使用者 2026-09-17 拿尺量了櫃檯現在那張廠商的立牌（≈97×146 mm），
 * 「這樣可以了　照這個立牌尺寸　做成 A4 列印。看能放幾張就多放，立牌不只一個」。
 *
 * ⚠⚠⚠ **一張 A4 放得下四張，那是算出來的**：卡片 98×146、A4 210×297 →
 *   2 欄 ＝ 196（左右各餘 7 mm）、2 列 ＝ 292（上下各餘 **2.5 mm**）。
 *   再多一欄或一列都放不下（3 欄要 294 > 210、3 列要 438 > 297）。
 * ⚠⚠ **上下只剩 2.5 mm，比多數印表機印得到的範圍還窄** —— 白底的地方被切掉看不出來，
 *   但**最下面那一排卡片的插圖是滿版貼著卡片下緣的**，可能會被切掉一兩 mm。
 *   印的時候選「實際大小／100%」**不要選「符合頁面」**（那會整張縮，卡片就不是 98 mm 了）。
 *
 * ⚠⚠⚠ **這一張不重畫卡片**（同 remind-a4）：把 `/preview/line-stand/` 那一頁上定稿的
 *   那張卡整個抓下來（markup ＋ 那一頁的樣式表），只做三件事：圖檔內嵌、縮成 98 mm、
 *   排成 2×2。**那一頁改了就要重跑這一支。**
 * ⚠ 成品住在 `drafts/`，進不了 `_site`；三個檔不進版控。
 *
 * ⚠ 換媒介逐項問過的（CLAUDE.md 第九節第 28 條 ⑤）：
 *   ① **圓角拿掉、換成一圈很淡的裁切線** —— 這是要裁開的一張紙，圓角會和裁刀打架；
 *      而卡片是白的，不畫線就看不出要裁在哪。相鄰兩張共用同一條線。
 *   ② **陰影拿掉**（螢幕上的東西，印不出來）。
 *   ③ **字、QR、插圖、分隔線一個都沒動** —— 立牌本來就是「照那一頁印出來」。
 * ⚠ 一律 headless_shell（第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S, CARD, lines, 印的案, 切抬頭 } from "./stand-card.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(ROOT, "preview", "line-stand", "index.html");
const OUT_HTML = path.join(HERE, "stand-a4.html");
const OUT_PDF = path.join(HERE, "芳仁-LINE立牌-A4.pdf");
const OUT_PNG = path.join(HERE, "stand-a4.png");
const A4 = { w: 210, h: 297 };
const MM = 96 / 25.4;
const arg = (k, d) => {
  const h = process.argv.find((a) => a.startsWith("--" + k + "="));
  return h ? h.slice(k.length + 3) : d;
};
const COLS = Number(arg("cols", 2)), ROWS = Number(arg("rows", 2));
const MARK = arg("mark", "1") !== "0";
const CW = CARD.寬mm, CH = Math.round(CARD.寬mm * CARD.比例);
if (COLS * CW > A4.w || ROWS * CH > A4.h)
  throw new Error(`${COLS}×${ROWS} 放不下：要 ${COLS * CW}×${ROWS * CH} mm，A4 只有 ${A4.w}×${A4.h}`);
const MX = (A4.w - COLS * CW) / 2, MY = (A4.h - ROWS * CH) / 2;

/* ---- 1. 從規格頁把那張卡抓下來 ---- */
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
const page = await browser.newPage({ viewport: { width: 430, height: 1400 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + SRC);
await page.waitForFunction(() => !!document.querySelector(".card"));
if (errs.length) throw new Error("規格頁有 JS 錯誤：" + errs.join(" / "));
const picked = await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".card")].filter((c) => !c.classList.contains("sc"));
  if (cards.length !== 1) throw new Error("規格頁上不是剛好一張卡，是 " + cards.length);
  const css = [...document.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  return { html: cards[0].outerHTML, css, text: cards[0].innerText };
});
await page.close();

/* ---- 2. 守門：卡上每一行字都要是定稿那一案的 ---- */
const 案 = 印的案[0];
const flat = picked.text.replace(/\s/g, "");
/* ⚠ 抬頭裡的 LINE 是一張**官方授權的標誌圖**不是字，所以 innerText 讀不到它 ——
   比對之前要照同一個地方切開（切法的唯一出處是 stand-card.mjs 的 切抬頭()）。 */
for (const t of lines(案)) {
  for (const seg of 切抬頭(String(t))) {
    const s = seg.replace(/\s/g, "");
    if (s && !flat.includes(s)) throw new Error("卡上少了定稿那一案的這一段：" + seg);
  }
}

/* ---- 3. 圖檔內嵌（這一頁要能單獨帶去別台電腦印）---- */
const dir = path.dirname(SRC);
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml" };
let n圖 = 0;
const cardHtml = picked.html.replace(/src="([^"]+)"/g, (m, src) => {
  if (/^data:/.test(src)) return m;
  const f = path.resolve(dir, src);
  if (!fs.existsSync(f)) throw new Error("卡上引用的圖不在：" + src);
  const mime = MIME[f.split(".").pop().toLowerCase()];
  if (!mime) throw new Error("不認得的圖檔型別：" + src);
  n圖++;
  return `src="data:${mime};base64,${fs.readFileSync(f).toString("base64")}"`;
});
if (n圖 < 3) throw new Error("卡上只內嵌到 " + n圖 + " 張圖（標誌、QR、插圖至少三張）");

/* ---- 4. 字型：只取這張紙用得到的那幾個字（同 remind-a4）---- */
let fontCss = "";
try {
  const chars = [...new Set(picked.text.replace(/\s/g, ""))].join("");
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    + "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  const css = await (await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&text=" + encodeURIComponent(chars),
    { headers: { "User-Agent": UA } })).text();
  const out = [];
  for (const blk of css.split("@font-face").slice(1)) {
    const w = (blk.match(/font-weight:\s*(\d+)/) || [])[1] || "400";
    const u = (blk.match(/url\((https:[^)]+)\)/) || [])[1];
    if (!u) continue;
    const buf = Buffer.from(await (await fetch(u, { headers: { "User-Agent": UA } })).arrayBuffer());
    out.push(`@font-face{font-family:"Noto Sans TC";font-style:normal;font-weight:${w};`
      + `src:url(data:font/woff2;base64,${buf.toString("base64")}) format("woff2")}`);
  }
  if (!out.length) throw new Error("那份 CSS 裡沒有 woff2");
  fontCss = out.join("\n");
  console.log("字型：內嵌 Noto Sans TC（%d 個字，%s KB）",
    new Set(picked.text.replace(/\s/g, "")).size, (Buffer.byteLength(fontCss) / 1024).toFixed(0));
} catch (e) {
  console.log("⚠ 取不到 Noto Sans TC（%s）—— 這一份會用系統字型排。", e.message);
}

/* ---- 5. 組出那一張 A4 ---- */
function sheet(k) {
  const cells = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
    cells.push(`<div class="cell" style="left:${(MX + c * CW).toFixed(3)}mm;top:${(MY + r * CH).toFixed(3)}mm">`
      + `<div class="holder">${cardHtml}</div></div>`);
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<title>芳仁牙醫診所・LINE 立牌（A4 ${COLS}×${ROWS}）</title>
<!--
  櫃檯的小立牌，一張 A4 印 ${COLS * ROWS} 張，每一張 ${CW}×${CH} mm。
  由 node drafts/channels/stand-a4.mjs 產生，卡片整個抓自 /preview/line-stand/ 那一頁。
  這個檔不要手改 —— 要改內容改那一頁（或 stand-card.json）再重跑。
  印的時候選「實際大小／100%」，不要選「符合頁面」。
-->
<style>
${fontCss}
${picked.css}
/* ---- 這一張紙自己的規則（排在規格頁那一份後面，靠順序決勝）---- */
html,body{background:#fff;padding:0;margin:0}
@page{size:A4 portrait;margin:0}
.sheet{position:relative;width:${A4.w}mm;height:${A4.h}mm;margin:0 auto;background:#fff;overflow:hidden}
.cell{position:absolute;width:${CW}mm;height:${CH}mm}
.holder{width:var(--cw);transform:scale(${k});transform-origin:top left}
/* ⚠ 圓角與陰影是螢幕上的東西：這是要裁開的一張紙，換成一圈很淡的裁切線（相鄰兩張共用）。 */
.cell .card{border-radius:0;box-shadow:none${MARK ? ";outline:.1mm solid #c9ccce;outline-offset:-.05mm" : ""}}
@media screen{body{background:#e9edf1;padding:16px 0}.sheet{box-shadow:0 2px 14px rgba(0,0,0,.18)}}
</style>
</head>
<body><div class="sheet">${cells.join("")}</div></body>
</html>`;
}

/* 第一趟：量卡片原生多寬，算倍率；倍率寫死進 CSS（這一頁零 JS）。 */
fs.writeFileSync(OUT_HTML, sheet(1));
const vp = { width: Math.round(A4.w * MM), height: Math.round(A4.h * MM) };
const p1 = await browser.newPage({ viewport: vp });
const e1 = [];
p1.on("pageerror", (e) => e1.push(String(e)));
await p1.goto("file://" + OUT_HTML);
await p1.evaluate(() => document.fonts.ready);
await p1.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
const nat = await p1.evaluate(() => {
  const c = document.querySelector(".card").getBoundingClientRect();
  return { w: c.width, h: c.height };
});
await p1.close();
if (e1.length) throw new Error("A4 那一頁有 JS 錯誤：" + e1.join(" / "));
const k = CW * MM / nat.w;

/* 第二趟：量每一張真的畫成幾 mm，再出 PDF 與 PNG。 */
fs.writeFileSync(OUT_HTML, sheet(k));
const p2 = await browser.newPage({ viewport: vp });
const e2 = [];
p2.on("pageerror", (e) => e2.push(String(e)));
await p2.goto("file://" + OUT_HTML);
await p2.evaluate(() => document.fonts.ready);
await p2.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
const box = await p2.evaluate(() => {
  const s = document.querySelector(".sheet").getBoundingClientRect();
  return [...document.querySelectorAll(".card")].map((c) => {
    const r = c.getBoundingClientRect();
    return { w: r.width, h: r.height, l: r.left - s.left, t: r.top - s.top,
      rr: s.right - r.right, b: s.bottom - r.bottom };
  });
});
if (e2.length) throw new Error("A4 那一頁有 JS 錯誤：" + e2.join(" / "));
const mm = (px) => px / MM;
if (box.length !== COLS * ROWS) throw new Error(`紙上只有 ${box.length} 張卡（要 ${COLS * ROWS}）`);
for (const b of box) {
  if (Math.abs(mm(b.w) - CW) > 0.3 || Math.abs(mm(b.h) - CH) > 0.3)
    throw new Error(`有一張卡畫成 ${mm(b.w).toFixed(1)}×${mm(b.h).toFixed(1)} mm，不是 ${CW}×${CH}`);
  if (Math.min(b.l, b.t, b.rr, b.b) < -0.5) throw new Error("有一張卡超出紙面");
}
console.log("一張 A4 印 %d 張（%d 欄 × %d 列）　每一張 %s×%s mm　留白 左右 %s、上下 %s mm",
  COLS * ROWS, COLS, ROWS, mm(box[0].w).toFixed(1), mm(box[0].h).toFixed(1),
  MX.toFixed(1), MY.toFixed(1));
console.log("⚠ 上下只剩 %s mm —— 印表機印不到那麼邊的話，最下面那一排的插圖會被切掉一點；"
  + "印的時候選「實際大小／100%%」不要選「符合頁面」", MY.toFixed(1));
await p2.screenshot({ path: OUT_PNG, clip: { x: 0, y: 0, width: A4.w * MM, height: A4.h * MM }, scale: "css" });
await p2.pdf({ path: OUT_PDF, printBackground: true, preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await p2.close();
await browser.close();

const pdf = fs.readFileSync(OUT_PDF).toString("latin1");
const pages = Math.max(...[...pdf.matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]), 0);
if (pages !== 1) throw new Error("PDF 不是一頁，是 " + pages + " 頁");
console.log("放大 %s 倍　裁切線：%s\n好了：\n  %s\n  %s\n  %s",
  k.toFixed(4), MARK ? "有" : "無",
  path.relative(ROOT, OUT_PDF), path.relative(ROOT, OUT_PNG), path.relative(ROOT, OUT_HTML));
