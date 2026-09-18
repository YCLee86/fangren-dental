#!/usr/bin/env node
/* 站上圖片的 WebP 版本 → assets/<原檔名>.webp
 *
 *   node tools/webp.mjs            產生／更新
 *   node tools/webp.mjs --check    只比對、不寫檔（同 app-icons.mjs 的用法）
 *
 * 為什麼要有這一支（2026-09-18，使用者貼了 Google PageSpeed Insights 的診斷）：
 * ・那份報告上「使用新式圖片格式」是最大的一條 —— 首頁一次要載 1327 KiB 的圖，
 *   它算得出來的可省量是 465 KiB，其中光是 HERO 那張夜景就佔 200 KiB。
 * ・站上的照片都是 JPEG（tools/hero-resize.mjs 出的，品質 0.82）；
 *   七科著陸頁的底圖線稿是 PNG（tools/topic-lineart.mjs 與 night-mode.mjs 出的）。
 *
 * 做法：**不重畫、不換內容**，只是把已經上線的那張圖轉存成 WebP。
 * ・照片：頁面上用 <picture> ＋ <source type="image/webp">，<img> 那一行原封不動 ——
 *   所以吃不到 WebP 的瀏覽器、以及抓 og:image 的爬蟲，拿到的都還是同一張 JPEG。
 * ・線稿：它是 CSS 的 background，包不了 <picture>，改用
 *   `background-image: image-set(url(…webp) type("image/webp"), url(…png) type("image/png"))`，
 *   **前一行照舊留一份只有 PNG 的宣告當退路**（不支援 image-set 的瀏覽器會整行丟掉）。
 *
 * ⚠⚠ AVIF 產不出來，而且**不會報錯**（2026-09-18 踩到）。
 *    Chromium 的 canvas.toDataURL("image/avif") 不支援 AVIF 編碼，
 *    它會**靜靜地回一張 PNG**（同一張圖量到 2959 KiB，比 JPEG 大 8 倍，
 *    檔頭是 data:image/png）。所以第 ① 道守門是「回來的字串真的是 WebP 嗎」。
 *    要 AVIF 只能另外裝編碼器，這一站沒有 npm 依賴，先不做。
 *
 * ⚠ 這一支和 tools/hero-resize.mjs 一樣要 Playwright（容器裡有，正式建置用不到），
 *   `npm run build` 不會呼叫它 —— 換過圖之後自己跑一次。
 *
 * 三道守門，過不了就不寫那一張：
 *   ① 回來的真的是 WebP（見上面那個 AVIF 的坑）
 *   ② 長寬和原檔一模一樣
 *   ③ 比原檔小，而且和原檔的逐像素差在容許範圍內
 *      （mean|Δ| ≤ 4.0、99.9 百分位 ≤ 24；實測最差 2.5 與 16）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

/* 照片用的品質。和 tools/hero-resize.mjs 的 JPEG 品質同一個數字，刻意的：
   兩邊都是「同一張圖的有損編碼」，一個站上只該有一個品質基準。 */
const QUALITY = 0.82;
/* ③ 的容許範圍。放寬之前先看這一支印出來的那張表。 */
const MAX_MEAN = 4.0;
const MAX_P999 = 24;

/* ---------- 要轉哪些：從頁面上真的用到的圖反查 ---------- */
/* 刻意**不寫死清單**。兩種來源各掃各的：
   ・照片 → <img>／<source> 的 src 與 srcset 裡的 .jpg
   ・線稿 → CSS 的 url("assets/….png")
   ⚠ 刻意**不掃 content= 與 JSON 的 "url"**：og:image、JSON-LD 與 sitemap 走的是那兩條，
     分享圖那一路一律留在 JPEG（第十節第 4 條那條「爬蟲不吃 SVG」同一族的顧慮 ——
     各家爬蟲對 WebP 的支援沒有保證）。
   ⚠ preview/ 與 history/ 不掃：提案頁與存檔不是正式站的效能問題。 */
const pages = [
  path.join(ROOT, "index.html"),
  path.join(ROOT, "assets", "style.css"),
  ...fs.readdirSync(path.join(ROOT, "posts"))
    .map((d) => path.join(ROOT, "posts", d, "index.html"))
    .filter((f) => fs.existsSync(f)),
];

const wanted = new Set();
for (const page of pages) {
  const src = fs.readFileSync(page, "utf8");
  for (const m of src.matchAll(/\s(?:src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(",")) {
      const hit = /(?:^|\/)assets\/([a-z0-9._-]+\.jpg)$/i.exec(part.trim().split(/\s+/)[0]);
      if (hit) wanted.add(hit[1]);
    }
  }
  for (const m of src.matchAll(/url\(["']?(?:\.\.\/\.\.\/)?assets\/([a-z0-9._-]+\.png)["']?\)/gi)) {
    wanted.add(m[1]);
  }
}
const files = [...wanted].sort();
if (!files.length) { console.error("× 掃不到任何圖 —— 先確認頁面還在"); process.exit(1); }

/* ---------- Chromium（抄 tools/hero-resize.mjs 那一份） ---------- */

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

const pwPaths = [
  process.env.PLAYWRIGHT_MODULE,
  "/opt/node22/lib/node_modules/playwright/index.js",
  "playwright",
].filter(Boolean);
let chromium = null;
for (const p of pwPaths) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
if (!chromium) {
  console.error("× 找不到 Playwright。這一支要在有 Playwright 的環境跑（雲端 session 就有）。");
  process.exit(1);
}
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chrome) { console.error("× 找不到 Chromium"); process.exit(1); }

/* ---------- 逐張轉 ---------- */

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();

let written = 0, skipped = 0, failed = 0, stale = 0;
let sumSrc = 0, sumOut = 0;
const rows = [];

for (const name of files) {
  const isPng = /\.png$/i.test(name);
  const srcPath = path.join(ROOT, "assets", name);
  const outName = name.replace(/\.(jpg|png)$/i, ".webp");
  const outPath = path.join(ROOT, "assets", outName);
  const orig = fs.readFileSync(srcPath);

  /* 照片只試有損 0.82；線稿（PNG、有 alpha 的平塗線畫）**兩種都試，取小的那一個** ——
     白天那七張無損反而比有損小（線畫的色塊少、有損還得編碼它自己的振鈴），
     夜間那七張則是有損小。取小的同時保證「不會比另一種差」。 */
  const tries = isPng ? [1, QUALITY] : [QUALITY];

  const res = await pg.evaluate(async ({ uri, tries }) => {
    const load = async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; };
    const a = await load(uri);
    const W = a.naturalWidth, H = a.naturalHeight;
    const mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = H; return c; };
    const ctx = (c) => c.getContext("2d", { willReadFrequently: true });
    const ca = mk(); ctx(ca).drawImage(a, 0, 0);
    const A = ctx(ca).getImageData(0, 0, W, H).data;

    /* 逐像素比對：把產出的 WebP 再解回來，量它和原檔差多少。
       ⚠ 要量「解出來的像素」不是量檔案（第九節第 5 條：量畫出來的東西）。
       ⚠ 有 alpha 的圖不能直接比 RGB —— 全透明的地方 RGB 本來就是任意值，
         有損編碼把它改掉完全看不出來。所以**疊在白底上之後**再比，alpha 另外比。 */
    const measure = async (uri2) => {
      const b = await load(uri2);
      const cb = mk(); ctx(cb).drawImage(b, 0, 0);
      const B = ctx(cb).getImageData(0, 0, W, H).data;
      let sum = 0, n = 0;
      const hist = new Uint32Array(256);
      for (let k = 0; k < A.length; k += 4) {
        const aa = A[k + 3] / 255, ab = B[k + 3] / 255;
        for (let o = 0; o < 3; o++) {
          const va = A[k + o] * aa + 255 * (1 - aa);
          const vb = B[k + o] * ab + 255 * (1 - ab);
          const d = Math.min(255, Math.round(Math.abs(va - vb)));
          sum += d; n++; hist[d]++;
        }
        const d3 = Math.abs(A[k + 3] - B[k + 3]);
        sum += d3; n++; hist[d3]++;
      }
      let acc = 0, p999 = 0;
      const lim = n * 0.999;
      for (let d = 0; d < 256; d++) { acc += hist[d]; if (acc >= lim) { p999 = d; break; } }
      return { w2: b.naturalWidth, h2: b.naturalHeight, mean: +(sum / n).toFixed(3), p999 };
    };

    let best = null;
    for (const q of tries) {
      const uri2 = ca.toDataURL("image/webp", q);
      const b64 = uri2.split(",")[1];
      const cand = { q, head: uri2.slice(0, 20), b64, bytes: Math.round(b64.length * 0.75), ...(await measure(uri2)) };
      if (!best || cand.bytes < best.bytes) best = cand;
    }
    return { W, H, ...best };
  }, { uri: `data:image/${isPng ? "png" : "jpeg"};base64,${orig.toString("base64")}`, tries });

  const bad = [];
  // ① 回來的真的是 WebP 嗎（AVIF 那個坑：不支援就靜靜回 PNG）
  if (!res.head.startsWith("data:image/webp")) bad.push(`不是 WebP（${res.head.split(";")[0]}）`);
  // ② 長寬一模一樣嗎
  if (res.w2 !== res.W || res.h2 !== res.H) bad.push(`長寬跑掉（${res.W}×${res.H} → ${res.w2}×${res.h2}）`);

  const buf = Buffer.from(res.b64, "base64");
  // ③ 真的比較小嗎、差得夠少嗎
  if (buf.length >= orig.length) bad.push(`比原檔大（${(buf.length / 1024).toFixed(1)} ≥ ${(orig.length / 1024).toFixed(1)} KiB）`);
  if (res.mean > MAX_MEAN) bad.push(`mean|Δ| ${res.mean} > ${MAX_MEAN}`);
  if (res.p999 > MAX_P999) bad.push(`99.9 百分位 ${res.p999} > ${MAX_P999}`);

  const kbS = orig.length / 1024, kbO = buf.length / 1024;
  const cut = ((1 - kbO / kbS) * 100).toFixed(0);
  const how = res.q === 1 ? "無損" : `${res.q}`;

  if (bad.length) {
    failed++;
    rows.push(`  × ${outName.padEnd(30)} ${bad.join("；")}`);
    continue;
  }

  sumSrc += orig.length; sumOut += buf.length;
  const same = fs.existsSync(outPath) && fs.readFileSync(outPath).equals(buf);
  const line = `${outName.padEnd(30)} ${kbS.toFixed(1).padStart(6)} → ${kbO.toFixed(1).padStart(6)} KiB  −${cut.padStart(2)}%  ${how.padEnd(4)} Δ${res.mean}/${res.p999}`;

  if (CHECK) {
    if (!same) { stale++; rows.push(`  ! ${outName.padEnd(30)} 和現有的不一樣（或還沒產生）`); }
    else rows.push(`  = ${line}`);
    continue;
  }
  if (same) { skipped++; rows.push(`  = ${line}`); continue; }
  fs.writeFileSync(outPath, buf);
  written++;
  rows.push(`  → ${line}`);
}

await browser.close();

console.log(`${CHECK ? "比對" : "產生"} WebP（來源是 assets/ 裡已經上線的 JPEG 與 PNG）`);
console.log(rows.join("\n"));
const tot = ((1 - sumOut / sumSrc) * 100).toFixed(0);
console.log(`\n${files.length} 張：原檔 ${(sumSrc / 1024).toFixed(0)} KiB → WebP ${(sumOut / 1024).toFixed(0)} KiB（−${tot}%）`);
console.log(`那一欄是挑中的編碼（照片一律 ${QUALITY}，線稿在無損與 ${QUALITY} 之間取檔案小的那一個）`);
console.log("Δ 那兩個數字 ＝ 疊在白底上之後的逐像素 mean|Δ| / 99.9 百分位（上限 " + MAX_MEAN + " / " + MAX_P999 + "，alpha 另外算進去）");

if (failed) { console.error(`\n× ${failed} 張沒過守門，那幾張沒有寫檔。`); process.exitCode = 1; }
else if (CHECK && stale) { console.error(`\n× ${stale} 張和現有的不一樣 —— 跑一次 node tools/webp.mjs`); process.exitCode = 1; }
else if (!CHECK) console.log(`\n完成：新寫 ${written} 張、沿用 ${skipped} 張。接下來跑 node tools/build.mjs`);
