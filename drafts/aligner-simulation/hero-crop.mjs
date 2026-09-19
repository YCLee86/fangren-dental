/* 把 HERO 原檔四邊烘進去的白邊裁掉 → drafts/aligner-simulation/hero-src-cropped.jpg
 *
 *   node drafts/aligner-simulation/hero-crop.mjs
 *
 * 為什麼需要這一支：Gemini 出的圖四邊常帶 1~3px 的白，
 * tools/hero-resize.mjs 會擋下來（ILLUSTRATION.md 第七節第 6 條：站上的卡片與
 * .post-hero 都是圓角滿版，白邊會變成圖裡自己畫了一個框）。
 *
 * 零依賴，和站上其他產生器一樣用 Chromium 的 canvas 讀像素與寫檔。
 * ⚠ 挑 headless_shell，不要完整版 chrome（DECISIONS.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "hero-src.jpg");
const OUT = path.join(HERE, "hero-src-cropped.jpg");

const CANDIDATES = [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
];
const chrome = CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) { console.error("× 找不到 Chromium"); process.exit(1); }

const pw = await import("/opt/node22/lib/node_modules/playwright/index.js");
const browser = await pw.default.chromium.launch({ executablePath: chrome });
const page = await browser.newPage();

const b64 = fs.readFileSync(SRC).toString("base64");
const res = await page.evaluate(async (dataUrl) => {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, W, H).data;

  /* ⚠⚠ 判準要和 tools/hero-resize.mjs 那一支**逐字相同**，否則裁完還是過不了它那一關
     （第一版自己定了「95% 的像素 ≥248」，裁完仍被擋下來）：
     每一列／行每隔三個像素取亮度，平均 > 238 且標準差 < 6 就算白邊。 */
  const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const stat = (idxs) => {
    let s = 0; for (const i of idxs) s += lum(i);
    const m = s / idxs.length;
    let v = 0; for (const i of idxs) v += (lum(i) - m) ** 2;
    return [m, Math.sqrt(v / idxs.length)];
  };
  const rowIdx = (y) => { const a = []; for (let px = 0; px < W; px += 3) a.push((y * W + px) * 4); return a; };
  const colIdx = (px) => { const a = []; for (let y = 0; y < H; y += 3) a.push((y * W + px) * 4); return a; };
  const white = (idxs) => { const [m, sd] = stat(idxs); return m > 238 && sd < 6; };

  let top = 0, bottom = H - 1, left = 0, right = W - 1;
  while (top < bottom && white(rowIdx(top))) top++;
  while (bottom > top && white(rowIdx(bottom))) bottom--;
  while (left < right && white(colIdx(left))) left++;
  while (right > left && white(colIdx(right))) right--;

  /* 再往內收一個像素：抗鋸齒會讓最外圈是半白的，量不到但看得見 */
  top += 1; left += 1; bottom -= 1; right -= 1;

  const w = right - left + 1, h = bottom - top + 1;
  const o = document.createElement("canvas");
  o.width = w; o.height = h;
  const ox = o.getContext("2d");
  ox.imageSmoothingQuality = "high";
  ox.drawImage(img, left, top, w, h, 0, 0, w, h);
  return { W, H, left, top, w, h, url: o.toDataURL("image/jpeg", 0.95) };
}, `data:image/jpeg;base64,${b64}`);

await browser.close();
fs.writeFileSync(OUT, Buffer.from(res.url.split(",")[1], "base64"));
console.log(`原檔 ${res.W}×${res.H} → 裁掉 上${res.top} 左${res.left} 右${res.W - res.left - res.w} 下${res.H - res.top - res.h}`);
console.log(`✓ ${path.relative(process.cwd(), OUT)}　${res.w}×${res.h}　比例 ${(res.w / res.h).toFixed(4)}（16:9 ＝ 1.7778）`);
