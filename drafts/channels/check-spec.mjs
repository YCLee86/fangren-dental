#!/usr/bin/env node
/* 整合規格頁的守門：preview/line-spec/index.html
 *   node drafts/channels/check-spec.mjs
 *
 * 這一頁**不重抄任何一則的文字**（那些字有自己的出處與守門），
 * 所以這裡要擋的是它自己會說謊的三個地方：
 *   ① 圖 —— 每一張都要找得到，而且 width/height 屬性要等於實檔 ÷ 3
 *      （不寫或寫錯的話，沒載完之前高度是 0、整頁跳版；那個坑這條線踩過兩次）
 *   ② 連結 —— 每一則的「完整規格」要真的連得到那一頁
 *   ③ 圖檔清單 —— 檔名與尺寸是**手打進表格的**，那是這一頁唯一的第二真相，
 *      所以逐筆對 assets/line/ 底下真正的檔案（數量、檔名、長寬、總大小都要對）
 * 另外掃兩件：紅線（不可以承諾有人即時回覆）、以及「切換條真的沒有」。
 *
 * ⚠ 守門寫好要故意改壞幾個地方看它擋不擋得住（第 19-20 節那條）——
 *   這一支負向測過：改一個 width、改一個尺寸、刪一個檔、加一顆按鈕，四種都擋得下來。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PAGE = path.join(ROOT, "preview", "line-spec", "index.html");
const DIR = path.dirname(PAGE);
const ASSETS = path.join(ROOT, "assets", "line");
const SCALE = 3;                                   /* 那幾張圖都是 3× 拍的 */
const html = fs.readFileSync(PAGE, "utf8");
const body = html.slice(html.indexOf("<body>"));   /* 註解與樣式不算 */
const bad = [];

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
  if (Math.abs(w * SCALE - nw) > 1 || Math.abs(h * SCALE - nh) > 1)
    bad.push(`${src} 寫著 ${w}×${h}，但實檔 ${nw}×${nh} ÷ ${SCALE} ＝ ${nw / SCALE}×${nh / SCALE}`);
  if (!at.includes("alt=")) bad.push(`${src} 沒有 alt`);
  nImg++;
}
if (nImg < 12) bad.push(`只找到 ${nImg} 張圖，該有 13 張`);

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

/* ---- ③ 圖檔清單 ------------------------------------------------------- */
if (!fs.existsSync(ASSETS)) bad.push("assets/line/ 不存在 —— 先跑 node drafts/channels/publish-assets.mjs");
else {
  const real = new Map();
  let bytes = 0;
  for (const n of fs.readdirSync(ASSETS).sort()) {
    const f = path.join(ASSETS, n);
    real.set(n, dim(f).join("×"));
    bytes += fs.statSync(f).size;
  }
  const listed = new Map();
  for (const m of body.matchAll(/<td class="mono">([^<]+)<\/td><td>(\d+×\d+)<\/td>/g))
    listed.set(m[1], m[2]);
  for (const [n, size] of listed) {
    if (!real.has(n)) bad.push(`表上列著 ${n}，但 assets/line/ 裡沒有`);
    else if (real.get(n) !== size)
      bad.push(`${n} 表上寫 ${size}，實檔是 ${real.get(n)}`);
  }
  for (const n of real.keys())
    if (!listed.has(n)) bad.push(`assets/line/${n} 沒有列在表上`);
  /* 那一句「共 N 個檔、X MB」 */
  const say = body.match(/共\s*(\d+)\s*個檔、([\d.]+)MB/);
  if (!say) bad.push("找不到「共 N 個檔、X MB」那一句");
  else {
    if (+say[1] !== real.size) bad.push(`那一句寫 ${say[1]} 個檔，實際 ${real.size} 個`);
    const mb = bytes / 1024 / 1024;
    if (Math.abs(+say[2] - mb) > 0.05) bad.push(`那一句寫 ${say[2]}MB，實際 ${mb.toFixed(2)}MB`);
  }
  /* LINE 的上限 */
  for (const [n, size] of real) {
    const [w, h] = size.split("×").map(Number);
    if (w > 1024 || h > 1024) bad.push(`${n} ${size} 超過 LINE 的 1024×1024`);
  }
}

/* ---- 紅線：不可以承諾有人即時回覆 -------------------------------------
   ⚠⚠ **掃之前要把「兩條紅線」那一節切掉** —— 那一節自己就引用著那句禁語
   （「不可以出現『有問題隨時問』那一類的承諾」），照掃第一次跑就誤報。
   同 check-review 那一支：這條線每一份檔案都把說明寫在資料裡面，掃字一定會撞到。 */
const scanned = body.split('id="red"')[0];
const text = scanned.replace(/<[^>]+>/g, "");
for (const re of [/隨時(問|詢問|聯絡)/, /有問題.{0,4}問我們/, /即時回(覆|應)您/, /都會有人回/])
  if (re.test(text)) bad.push(`紅線：頁面上寫了「${text.match(re)[0]}」—— 這個帳號沒有專人即時回覆`);

/* ---- 切換條真的沒有 ---------------------------------------------------- */
if (/<button/.test(body)) bad.push("頁面上有 <button> —— 這是規格頁，不放切換條");
if (/<script/.test(body)) bad.push("頁面上有 <script> —— 這一頁刻意是零 JS 的");

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
console.log(`✓ preview/line-spec/　圖 ${nImg} 張（尺寸都對得上實檔）、`
  + `連結 ${links.size} 條都通、圖檔清單逐筆對得上 assets/line/、紅線 0、零 JS`);
