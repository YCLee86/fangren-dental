#!/usr/bin/env node
/* 整合規格頁的守門：preview/line-spec/index.html
 *   node drafts/channels/check-spec.mjs
 *
 * ⚠⚠ **2026-09-07 這一頁改寫成「只留模擬圖」**（使用者：廠商對接窗口是專業的
 *   LINE 設計工程師，只要模擬圖 ＋ 標題 ＋ 一句說明），所以這一支跟著縮：
 *   原本第 ③ 道「圖檔清單逐筆對 assets/line/」**整段拿掉了** —— 那張表不在頁面上了。
 *   ⚠ 那件事沒有沒人管：`node drafts/channels/publish-assets.mjs --check` 在做同一件事，
 *     而且它的清單出處是那七份 Flex JSON，比手打進表格可靠。
 *
 * 這一頁**不重抄任何一則的文字**（那些字有自己的出處與守門），
 * 所以這裡要擋的是它自己會說謊的兩個地方：
 *   ① 圖 —— 每一張都要找得到、要有 alt，而且 width/height 屬性要等於實檔 ÷ 它自己的倍率
 *      （不寫或寫錯的話，沒載完之前高度是 0、整頁跳版；那個坑這條線踩過兩次）
 *      ⚠⚠ **倍率不是一個常數**：那七頁自己拍的是 3×（DPR 3），
 *        而 line-oa 那三組卡是 `oa-shots.mjs` 從 DPR 2／3 的原檔縮成 1× 搬過來的。
 *        寫死 SCALE = 3 的話後面那四張全部會誤報。
 *   ② 連結 —— 每一則的「完整規格」要真的連得到那一頁，錨點不可以是死的
 * 另外掃兩件：紅線（不可以承諾有人即時回覆）、以及「切換條與 JS 真的沒有」。
 *
 * ⚠ 守門寫好要故意改壞幾個地方看它擋不擋得住（第 19-20 節那條）。
 * ⚠ 舊版有一個坑值得記著：紅線掃描曾經被頁面自己的「兩條紅線」那一節擋下來
 *   （那一節引用著禁語本身）。那一節這一輪拿掉了，所以現在整頁掃；
 *   **哪天再把說明寫回頁面上，就要重新把自己的說明切掉。**
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PAGE = path.join(ROOT, "preview", "line-spec", "index.html");
const DIR = path.dirname(PAGE);
const html = fs.readFileSync(PAGE, "utf8");
const body = html.slice(html.indexOf("<body>"));   /* 註解與樣式不算 */
const bad = [];

/* 那七頁的 *-png.mjs 一律 DPR 3 拍；line-oa 那三組是 oa-shots.mjs 縮成 1× 搬過來的 */
const scaleOf = (src) => (src.startsWith("shot-oa-") ? 1 : 3);

const png = (b) => [b.readUInt32BE(16), b.readUInt32BE(20)];
const jpeg = (b) => {
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};
const dim = (f) => (f.endsWith(".png") ? png : jpeg)(fs.readFileSync(f));

/* ---- ① 圖 ------------------------------------------------------------ */
let nImg = 0;
for (const m of body.matchAll(/<img\s([^>]*)>/g)) {
  const at = m[1];
  const src = (at.match(/src="([^"]+)"/) || [])[1];
  const w = +(at.match(/width="(\d+)"/) || [])[1];
  const h = +(at.match(/height="(\d+)"/) || [])[1];
  if (!src) { bad.push("有一張 img 沒有 src"); continue; }
  if (!w || !h) { bad.push(`${src} 沒有寫 width/height`); continue; }
  const f = path.join(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`找不到 ${src}`); continue; }
  const [nw, nh] = dim(f);
  const k = scaleOf(src);
  if (Math.abs(w * k - nw) > 1 || Math.abs(h * k - nh) > 1)
    bad.push(`${src} 寫著 ${w}×${h}，但實檔 ${nw}×${nh} ÷ ${k} ＝ ${nw / k}×${nh / k}`);
  if (!at.includes("alt=")) bad.push(`${src} 沒有 alt`);
  nImg++;
}
if (nImg !== 16) bad.push(`找到 ${nImg} 張圖，該有 16 張`);

/* ---- ①之二 捲軸裡那幾張的寬度 -----------------------------------------
   ⚠⚠⚠ 2026-09-07 踩過：`.pv-scroll img{width:auto}` 會**蓋掉 `<img>` 的 width 屬性**，
   圖因此退回「原始像素尺寸」—— 3× 拍的那幾張畫成三倍大（`shot-query` 855 → 2565）。
   症狀是使用者說「手機上有幾張特別巨大」，而**版面沒有破、水平溢出仍然是 0**，
   只有把每一張的 `getBoundingClientRect().width` 印出來才看得到。
   所以這裡守兩件：捲軸裡每一張都要自己寫 inline 的寬度、而且樣式表不准再出現 width:auto。 */
let nScroll = 0;
for (const m of body.matchAll(/class="pv-scroll">\s*(<img\s[^>]*>)/g)) {
  nScroll++;
  const at = m[1];
  const src = (at.match(/src="([^"]+)"/) || [])[1];
  const w = +(at.match(/\swidth="(\d+)"/) || [])[1];
  const css = +(at.match(/style="width:(\d+)px"/) || [])[1];
  if (!css) bad.push(`${src} 在捲軸裡卻沒有寫 inline 的 style="width:…px" —— 會退回原始像素尺寸`);
  else if (css !== w) bad.push(`${src} 的 width 屬性是 ${w}、inline 卻寫 ${css}px`);
}
if (/\.pv-scroll\s+img\s*\{[^}]*width:\s*auto/.test(html))
  bad.push(".pv-scroll img 又出現 width:auto —— 那會讓圖退回原始像素尺寸（3× 拍的變三倍大）");

/* ---- ② 連結 ----------------------------------------------------------- */
const links = new Set();
for (const m of body.matchAll(/href="(\.\.\/[^"]+)"/g)) links.add(m[1]);
for (const l of links)
  if (!fs.existsSync(path.join(DIR, l, "index.html")) && !fs.existsSync(path.join(DIR, l)))
    bad.push(`連結 ${l} 指不到東西`);
/* 八則各要有一條「完整規格」的連結 */
for (const d of ["line-welcome", "line-auto-reply", "line-bind-done", "line-remind",
  "line-booked", "line-cancel", "line-review", "line-typhoon"])
  if (!body.includes(`../${d}/`)) bad.push(`頁面上沒有連到 ${d}`);
/* 錨點 */
for (const m of body.matchAll(/href="#([a-z0-9]+)"/g))
  if (!new RegExp(`id="${m[1]}"`).test(body)) bad.push(`死錨點 #${m[1]}`);

/* ---- 紅線：不可以承諾有人即時回覆 ------------------------------------- */
const text = body.replace(/<[^>]+>/g, "");
for (const re of [/隨時(問|詢問|聯絡)/, /有問題.{0,4}問我們/, /即時回(覆|應)您/, /都會有人回/])
  if (re.test(text)) bad.push(`紅線：頁面上寫了「${text.match(re)[0]}」—— 這個帳號沒有專人即時回覆`);

/* ---- 切換條與 JS 真的沒有 ---------------------------------------------- */
if (/<button/.test(body)) bad.push("頁面上有 <button> —— 這是規格頁，不放切換條");
if (/<script/.test(body)) bad.push("頁面上有 <script> —— 這一頁刻意是零 JS 的");

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
console.log(`✓ preview/line-spec/　圖 ${nImg} 張（尺寸都對得上實檔）、`
  + `捲軸裡 ${nScroll} 張都寫了 inline 寬度、連結 ${links.size} 條都通、錨點 0 個死的、紅線 0、零 JS`);
