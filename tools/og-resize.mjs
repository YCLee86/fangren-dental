#!/usr/bin/env node
/* 著陸頁分享圖的原檔 → assets/og-topic-<spec>.jpg（1200×628）
 *
 *   node tools/og-resize.mjs <原檔> <spec>
 *   例：node tools/og-resize.mjs drafts/og-topic-general-src.jpg general
 *
 * 為什麼不共用 tools/hero-resize.mjs（ILLUSTRATION.md 第十一節）：
 * ・那一支鎖死文章 HERO 的 2000×1116（16:9），比例對不上就拒絕寫檔；
 *   分享卡是 **1200×628（1.91:1）**，是另一套規格，不要互相套用。
 * ・這一支允許**往內裁**到 1.91:1（只裁不變形），因為出圖模型給的比例
 *   常常是 1.89 之類的近似值。
 *
 * 出圖前擋兩件，不過就拒絕寫檔：
 *   ① 四邊有沒有烘進去的白框（第七節第 6 條，〈牙齦流血〉那張踩過）
 *   ② 裁切量太大（> 8%）—— 那通常表示拿錯了原檔，不是比例微調
 *
 * ⚠ 一律挑 headless_shell，不要挑完整版 chrome（CLAUDE.md 第九節第 18 條）。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200, H = 628;
const RATIO = W / H;
const QUALITY = 0.82;
const MAX_CROP = 0.08;

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

const [, , srcArg, specArg] = process.argv;
if (!srcArg || !specArg) {
  console.error("用法：node tools/og-resize.mjs <原檔> <spec>");
  console.error("例：  node tools/og-resize.mjs drafts/og-topic-general-src.jpg general");
  process.exit(1);
}
const src = path.resolve(ROOT, srcArg);
if (!fs.existsSync(src)) { console.error(`× 找不到 ${srcArg}`); process.exit(1); }

const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
if (!chromium) { console.error("× 找不到 Playwright（雲端 session 有）"); process.exit(1); }
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chrome) { console.error("× 找不到 Chromium"); process.exit(1); }

const ext = path.extname(src).toLowerCase().replace(".", "") || "png";
const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
const dataUri = `data:${mime};base64,${fs.readFileSync(src).toString("base64")}`;

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
const res = await pg.evaluate(async ({ uri, W, H, RATIO, quality }) => {
  const img = new Image();
  img.src = uri;
  await img.decode();
  const sw0 = img.naturalWidth, sh0 = img.naturalHeight;

  /* 白框：逐列／行取亮度平均與標準差，連續「很亮又很平」的算白邊 */
  const c0 = document.createElement("canvas");
  c0.width = sw0; c0.height = sh0;
  const g0 = c0.getContext("2d", { willReadFrequently: true });
  g0.drawImage(img, 0, 0);
  const d = g0.getImageData(0, 0, sw0, sh0).data;
  const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const stat = (idxs) => {
    let s = 0; for (const i of idxs) s += lum(i);
    const m = s / idxs.length;
    let v = 0; for (const i of idxs) v += (lum(i) - m) ** 2;
    return [m, Math.sqrt(v / idxs.length)];
  };
  const rowIdx = (y) => { const a = []; for (let x = 0; x < sw0; x += 3) a.push((y * sw0 + x) * 4); return a; };
  const colIdx = (x) => { const a = []; for (let y = 0; y < sh0; y += 3) a.push((y * sw0 + x) * 4); return a; };
  const scan = (n, idx) => { let k = 0; while (k < n) { const [m, sd] = stat(idx(k)); if (m > 238 && sd < 6) k++; else break; } return k; };
  const border = {
    top: scan(Math.floor(sh0 / 4), rowIdx),
    bottom: scan(Math.floor(sh0 / 4), (k) => rowIdx(sh0 - 1 - k)),
    left: scan(Math.floor(sw0 / 4), colIdx),
    right: scan(Math.floor(sw0 / 4), (k) => colIdx(sw0 - 1 - k)),
  };

  /* 薄白邊（≤4 列）直接裁掉：出圖模型常常在下緣留 1~2 列
     （ILLUSTRATION.md 第八之一節，〈拔智齒〉那張踩過）。厚的留給下面 throw。 */
  const THIN = 4;
  const trim = {
    top: border.top <= THIN ? border.top : 0,
    bottom: border.bottom <= THIN ? border.bottom : 0,
    left: border.left <= THIN ? border.left : 0,
    right: border.right <= THIN ? border.right : 0,
  };
  const thick = {
    top: border.top > THIN ? border.top : 0,
    bottom: border.bottom > THIN ? border.bottom : 0,
    left: border.left > THIN ? border.left : 0,
    right: border.right > THIN ? border.right : 0,
  };

  /* 往內裁到 1.91:1（只裁不變形），多的那一軸置中裁掉 */
  let sx = trim.left, sy = trim.top;
  let sw = sw0 - trim.left - trim.right, sh = sh0 - trim.top - trim.bottom;
  {
    const x0 = sx, y0 = sy, w0 = sw, h0 = sh;
    if (w0 / h0 > RATIO) { const nw = h0 * RATIO; sx = x0 + (w0 - nw) / 2; sw = nw; }
    else { const nh = w0 / RATIO; sy = y0 + (h0 - nh) / 2; sh = nh; }
  }
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = "high";
  g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  return { sw0, sh0, border, trim, thick, crop: { sx, sy, sw, sh }, data: c.toDataURL("image/jpeg", quality) };
}, { uri: dataUri, W, H, RATIO, quality: QUALITY });
await browser.close();

console.log(`原檔 ${res.sw0}×${res.sh0}（比例 ${(res.sw0 / res.sh0).toFixed(4)}）`);

const k = res.thick;
if (k.top || k.bottom || k.left || k.right) {
  console.error(`× 四邊有烘進去的白框（上 ${k.top}／下 ${k.bottom}／左 ${k.left}／右 ${k.right} 列）。`);
  console.error("  這種厚度不是出圖模型的邊緣雜訊，先確認是不是拿錯檔或圖本身畫了白框");
  console.error("  （ILLUSTRATION.md 第七節第 6 條）。");
  process.exit(1);
}
const t = res.trim;
if (t.top || t.bottom || t.left || t.right) {
  console.log(`薄白邊已自動裁掉：上 ${t.top}／下 ${t.bottom}／左 ${t.left}／右 ${t.right} 列`);
}

const dropX = 1 - res.crop.sw / res.sw0, dropY = 1 - res.crop.sh / res.sh0;
if (dropX > MAX_CROP || dropY > MAX_CROP) {
  console.error(`× 裁掉太多（左右 ${(dropX * 100).toFixed(1)}%／上下 ${(dropY * 100).toFixed(1)}%，上限 ${MAX_CROP * 100}%）。`);
  console.error("  分享卡是 1.91:1，原檔比例差太多通常表示拿錯檔了。");
  process.exit(1);
}
console.log(`裁切：左右 −${(dropX * 100).toFixed(2)}%／上下 −${(dropY * 100).toFixed(2)}%（只往內裁，沒有變形）`);

const out = path.join(ROOT, "assets", `og-topic-${specArg}.jpg`);
fs.writeFileSync(out, Buffer.from(res.data.split(",")[1], "base64"));
console.log(`✓ assets/og-topic-${specArg}.jpg  ${W}×${H}  ${(fs.statSync(out).size / 1024).toFixed(1)}KB`);
