/* 給廠商那一頁的守門：preview/line-spec/index.html
 *   node drafts/channels/check-spec.mjs
 *
 * ⚠⚠ **2026-09-07：模擬圖總覽與交付包合併成這一頁**（使用者：「可以把模擬圖跟
 *   交付包結合成一份嗎」），所以這一支也把 check-handover.mjs 併進來了。
 *   兩支合併之後，最強的一道是第 ① 條「重跑產生器、逐位比對」——
 *   那一頁現在整份是 build-spec.mjs 產的，不一樣就代表有人手改了它，
 *   或是改了某一則的 JSON 卻忘了重跑。
 *
 * 其餘各道，每一道都是踩過才長出來的：
 *   ② 圖 —— 每一張都要找得到、要有 alt，width/height 要等於實檔 ÷ 它自己的倍率
 *      ⚠⚠ **倍率不是一個常數**：那八則自己拍的是 3×（DPR 3），
 *        line-oa 那三組卡是 oa-shots.mjs 縮成 1× 搬過來的。寫死 3 的話那三張全部誤報。
 *   ②之二 捲軸裡每一張都要自己寫 inline 寬度，而且樣式表不准出現 width:auto
 *      （那會蓋掉 width 屬性、讓圖退回原始像素尺寸，3× 拍的畫成三倍大）
 *   ③ 頁上列的每一個 fangren.net 圖檔，repo 裡都要真的有那個檔
 *   ④ 內部連結與錨點都要通
 *   ⑤ 紅線（這個帳號沒有專人即時回覆，不可以承諾「隨時問」）
 *   ⑥ 抬頭那四行（漏了 charset 就是整頁亂碼，而算繪測驗抓不到）
 *   ⑦ 不准出現 <button> 或 <script>（這是規格頁，不放切換條；交給廠商的東西不必跑腳本）
 *   ⑧ 衛教那幾十張圖要真的上線，而且不可以超過 LINE 的 12 格
 *
 * ⚠ 守門寫好要故意改壞幾個地方看它擋不擋得住（第 19-20 節那條）。
 * ⚠ 紅線掃描曾經被頁面自己的說明擋下來（那一節引用著禁語本身）——
 *   所以只掃到「還需要答案的事」為止。**哪天再把說明寫回頁面上，要重新把自己的說明切掉。**
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-spec", "index.html");
const DIR = path.dirname(PAGE);
const bad = [];

if (!fs.existsSync(PAGE)) { console.error("× 還沒有 preview/line-spec/index.html"); process.exit(1); }

/* ---- ① 重跑一次，逐位比對 --------------------------------------------- */
const before = fs.readFileSync(PAGE, "utf8");
execFileSync(process.execPath, [path.join(HERE, "build-spec.mjs")], { cwd: ROOT, stdio: "ignore" });
const html = fs.readFileSync(PAGE, "utf8");
if (before !== html)
  bad.push("這一頁和「從 JSON 重新產生」的結果不一樣 —— 有人手改了它，"
    + "或是改了某一則的 JSON／某一頁的模擬圖卻沒有重跑 build-spec.mjs（已經幫你重新產生了一份）");

const body = html.slice(html.indexOf("<body>"));   /* 註解與樣式不算 */

/* 那八則的出圖腳本一律 DPR 3 拍；line-oa 那三組是 oa-shots.mjs 縮成 1× 搬過來的 */
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
  return [0, 0];
};
const dim = (f) => (f.endsWith(".png") ? png : jpeg)(fs.readFileSync(f));

/* ---- ② 圖 ------------------------------------------------------------- */
let nImg = 0;
for (const m of body.matchAll(/<img\s([^>]*)>/g)) {
  const at = m[1];
  const src = (at.match(/src="([^"]+)"/) || [])[1];
  const w = +(at.match(/\swidth="(\d+)"/) || [])[1];
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
/* ⚠ 只擋「變少」：少一張多半是某一頁的出圖腳本沒重跑（產生器那邊會 throw，這裡是第二道）；
   多一張是有人刻意加的，不必擋。 */
if (nImg < 16) bad.push(`只找到 ${nImg} 張模擬圖，該有 16 張以上 —— 是不是哪一則的圖掉了`);

/* ---- ②之二 捲軸裡那幾張的寬度 -----------------------------------------
   ⚠⚠⚠ 2026-09-07 踩過：`.pv-scroll img{width:auto}` 會**蓋掉 `<img>` 的 width 屬性**，
   圖因此退回「原始像素尺寸」—— 3× 拍的那幾張畫成三倍大（`shot-query` 855 → 2565）。
   症狀是使用者說「手機上有幾張特別巨大」，而**版面沒有破、水平溢出仍然是 0**，
   只有把每一張的 `getBoundingClientRect().width` 印出來才看得到。 */
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

/* ---- ③ 線上的圖檔真的在 ------------------------------------------------ */
const urls = [...new Set([...html.matchAll(/href="(https:\/\/fangren\.net\/assets\/[^"]+)"/g)].map((m) => m[1]))];
for (const u of urls) {
  const p = path.join(ROOT, u.replace("https://fangren.net/", ""));
  if (!fs.existsSync(p)) bad.push(`頁上連著 ${u}，但 repo 裡沒有那個檔`);
}
if (urls.length < 20) bad.push(`只列到 ${urls.length} 個圖檔，太少了 —— 抽取大概壞了`);

/* ---- ④ 內部連結與錨點 -------------------------------------------------- */
const links = new Set();
for (const m of body.matchAll(/href="(\.\.\/[^"]+)"/g)) links.add(m[1]);
for (const l of links)
  if (!fs.existsSync(path.join(DIR, l, "index.html")) && !fs.existsSync(path.join(DIR, l)))
    bad.push(`連結 ${l} 指不到東西`);
/* 八則各要有一條「完整規格」的連結 */
for (const d of ["line-welcome", "line-auto-reply", "line-bind-done", "line-remind",
  "line-booked", "line-cancel", "line-review", "line-typhoon"])
  if (!body.includes(`../${d}/`)) bad.push(`頁面上沒有連到 ${d}`);
for (const m of body.matchAll(/href="#([a-z0-9]+)"/g))
  if (!new RegExp(`id="${m[1]}"`).test(body)) bad.push(`死錨點 #${m[1]}`);

/* ---- ⑤ 紅線：不可以承諾有人即時回覆 ------------------------------------ */
const cut = body.indexOf('id="ask"');
const text = (cut > 0 ? body.slice(0, cut) : body).replace(/<[^>]+>/g, "");
for (const re of [/隨時(問|詢問|聯絡)/, /有問題.{0,4}問我們/, /即時回(覆|應)您/, /都會有人回/])
  if (re.test(text)) bad.push(`紅線：頁面上寫了「${text.match(re)[0]}」—— 這個帳號沒有專人即時回覆`);

/* ---- ⑥ 抬頭那四行（漏了就是整頁亂碼）----------------------------------
   ⚠⚠⚠ 2026-09-07 踩過：漏了 charset，使用者在 iPhone 上開起來整頁中文都是亂碼。
   ⚠⚠ **算繪測驗抓不到** —— Playwright 用 file:// 載入時 Chromium 自己嗅得出 UTF-8，
   八個寬度全綠。編碼只能對原始碼做靜態斷言。順手把 preview 底下每一頁都掃一次。 */
for (const [re, what] of [
  [/^<!doctype html>/i, "<!doctype html>"],
  [/<html lang="zh-Hant-TW">/, 'html lang="zh-Hant-TW"'],
  [/<meta charset="utf-8">/i, "meta charset utf-8"],
  [/<meta name="viewport"[^>]*width=device-width/i, "meta viewport"],
]) if (!re.test(html)) bad.push(`抬頭少了 ${what}`);

const PV = path.join(ROOT, "preview");
for (const d of fs.readdirSync(PV)) {
  const f = path.join(PV, d, "index.html");
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, "utf8").slice(0, 800);
  if (!/<meta charset="utf-8">/i.test(h)) bad.push(`preview/${d}/ 沒有宣告 charset —— 手機上會整頁亂碼`);
}

/* ---- ⑦ 切換條與 JS 真的沒有 -------------------------------------------- */
if (/<button/.test(body)) bad.push("頁面上有 <button> —— 這是規格頁，不放切換條");
if (/<script/.test(body)) bad.push("頁面上有 <script> —— 這一頁刻意是零 JS 的");

/* ---- ⑧ 衛教那幾十張圖要真的上線，而且不可以超過 12 格 ------------------- */
try {
  execFileSync(process.execPath, [path.join(HERE, "publish-handouts.mjs"), "--check"],
    { cwd: ROOT, stdio: "pipe" });
} catch (e) {
  bad.push("publish-handouts.mjs --check 沒過：\n    " + String(e.stdout || e.message).trim().replace(/\n/g, "\n    "));
}
const health = JSON.parse(fs.readFileSync(
  path.join(ROOT, "drafts", "line-oa", "health-carousel-d.json"), "utf8")).contents.length;
/* ⚠ 12 是 LINE 的硬上限，超過整條送不出去（health-carousel.mjs 也擋一次，兩邊都要）。 */
if (health > 12) bad.push(`衛教輪播 ${health} 格，超過 LINE 的 12 格上限`);

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
console.log(`✓ preview/line-spec/　和 JSON 重新產生的結果逐位相同、模擬圖 ${nImg} 張（尺寸都對得上實檔）、`
  + `捲軸裡 ${nScroll} 張都寫了 inline 寬度、線上圖檔 ${urls.length} 個都在、`
  + `連結 ${links.size} 條都通、錨點 0 個死的、紅線 0、零 JS、衛教 ${health} 格`);
