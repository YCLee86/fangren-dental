#!/usr/bin/env node
/* 〈小朋友的牙套〉HERO：把出圖四邊烘進去的白邊裁掉 → PNG（無損中繼）
 *
 *   node drafts/kids-crown/hero-crop.mjs <原檔> <輸出.png> [上,右,下,左]
 *
 * ⚠ 為什麼要有這一支：Gemini 出的第九版右邊有 5px、下面有 1px 的白，
 *   tools/hero-resize.mjs 的第一道守門會擋下來（ILLUSTRATION.md 第七節第 6 條：
 *   站上的卡片與 .post-hero 都是圓角滿版，白邊會變成圖裡自己畫了一個框）。
 *
 * ⚠⚠ 裁的量不是只有白邊：下面多裁 2 列，是為了讓長寬比**正好**回到站上那一族
 *   （2000/1116 = 1.792115）。這樣 hero-resize 產出的三張會是 2000×1116／
 *   1600×893／800×446 —— 和現在站上那三張逐格相同，文章頁那個手寫的
 *   width/height 一個字都不必改（CLAUDE.md 第九節「文章 HERO 的比例」那一列）。
 *
 * ⚠ 輸出 PNG 不是 JPEG：這只是中繼檔，再壓一次 JPEG 等於白白掉一次品質。
 * ⚠ 產生器一律挑 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";

const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser");
  return out;
};

const [, , srcArg, outArg, cropArg = "0,5,3,0"] = process.argv;
if (!srcArg || !outArg) {
  console.error("用法：node drafts/kids-crown/hero-crop.mjs <原檔> <輸出.png> [上,右,下,左]");
  process.exit(1);
}
const [ct, cr, cb, cl] = cropArg.split(",").map(Number);
const src = path.resolve(srcArg);
if (!fs.existsSync(src)) { console.error(`× 找不到 ${srcArg}`); process.exit(1); }

let chromium = null;
for (const p of [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean)) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chromium || !chrome) { console.error("× 找不到 Playwright 或 Chromium"); process.exit(1); }

const ext = path.extname(src).toLowerCase().replace(".", "") || "png";
const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
const uri = `data:${mime};base64,${fs.readFileSync(src).toString("base64")}`;

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
const r = await pg.evaluate(async ({ uri, ct, cr, cb, cl }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const w = W - cl - cr, h = H - ct - cb;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, cl, ct, w, h, 0, 0, w, h);

  /* 裁完自己再掃一次四邊，確認白邊真的沒了 */
  const d = g.getImageData(0, 0, w, h).data;
  const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const stat = (idxs) => {
    let s = 0; for (const i of idxs) s += lum(i);
    const m = s / idxs.length;
    let v = 0; for (const i of idxs) v += (lum(i) - m) ** 2;
    return [m, Math.sqrt(v / idxs.length)];
  };
  const rowIdx = (y) => { const a = []; for (let x = 0; x < w; x += 3) a.push((y * w + x) * 4); return a; };
  const colIdx = (x) => { const a = []; for (let y = 0; y < h; y += 3) a.push((y * w + x) * 4); return a; };
  const scan = (n, idx) => { let k = 0; while (k < n) { const [m, sd] = stat(idx(k)); if (m > 238 && sd < 6) k++; else break; } return k; };
  const border = {
    top: scan(Math.floor(h / 4), rowIdx),
    bottom: scan(Math.floor(h / 4), (k) => rowIdx(h - 1 - k)),
    left: scan(Math.floor(w / 4), colIdx),
    right: scan(Math.floor(w / 4), (k) => colIdx(w - 1 - k)),
  };
  return { W, H, w, h, border, data: c.toDataURL("image/png") };
}, { uri, ct, cr, cb, cl });
await browser.close();

console.log(`原檔 ${r.W}×${r.H} → 裁成 ${r.w}×${r.h}（比例 ${(r.w / r.h).toFixed(6)}）`);
const b = r.border;
if (b.top + b.bottom + b.left + b.right > 0) {
  console.error(`× 裁完仍有白邊：上 ${b.top}／下 ${b.bottom}／左 ${b.left}／右 ${b.right} px —— 再裁多一點`);
  process.exit(1);
}
const target = 2000 / 1116;
if (Math.abs(r.w / r.h - target) > 0.0005) {
  console.error(`× 長寬比 ${(r.w / r.h).toFixed(6)} 沒有回到站上那一族 ${target.toFixed(6)}`);
  process.exit(1);
}
fs.writeFileSync(path.resolve(outArg), Buffer.from(r.data.split(",")[1], "base64"));
console.log(`✓ 寫出 ${outArg}（白邊 0、比例對上 2000/1116）`);
