#!/usr/bin/env node
/* 文章 HERO 的原檔 → assets/hero-<name>-{2000,1600,800}.jpg
 *
 *   node tools/hero-resize.mjs <原檔> <name>
 *   例：node tools/hero-resize.mjs drafts/bioceramic-hero.png bioceramic-photo
 *       → assets/hero-bioceramic-photo-2000.jpg（以及 -1600、-800）
 *
 * 為什麼要有這一支（ILLUSTRATION.md 第七節）：
 * ・站上的慣例是三個寬度，後綴＝寬度；post-meta 的 hero 只寫 -1600.jpg，
 *   另外兩張由 tools/build.mjs 的 heroSrcset() 從檔名推出來。
 * ・這一站沒有任何 npm 依賴，容器裡也沒有 PIL／ImageMagick，
 *   所以縮圖是用 Chromium 的 canvas 做的（imageSmoothingQuality = "high"、
 *   JPEG 品質 0.82）—— 那正是 2026-08-16 六張與 08-19 矯正那張的做法。
 *   ⚠ 原本文件裡寫的 PowerShell System.Drawing 只在 Windows 那台跑得動。
 *
 * ⚠⚠ 產生器一律挑 headless_shell，不要挑完整版 chrome
 *    （CLAUDE.md 第九節第 18 條：完整版畫出來會比 --window-size 少 87px）。
 *    這一支不靠視窗尺寸截圖（用 canvas + toDataURL），但清單照抄同一份，
 *    免得日後有人改成截圖又踩回去。
 *
 * 出圖前會自動驗兩件事，不過就拒絕寫檔：
 *   ① 四邊有沒有烘進去的白框（第七節第 6 條，〈牙齦流血〉那張踩過）
 *   ② 長寬比落不落在允許的那幾種（`RATIOS`）
 *
 * ⚠⚠ 2026-09-05：這一支本來只收 16:9（站上前十一張都是 2000×1116）。
 *    〈三個月一次的洗牙與塗氟〉那張是 **4:3**（使用者指定「不要拘泥於橫幅」），
 *    所以改成一張允許清單。⚠ 換了比例要一起看兩件：
 *    ・**首頁卡的縮圖是 `aspect-ratio: 16/9` ＋ `object-fit: cover`**，
 *      所以非 16:9 的圖在卡片上會被**置中裁掉上下**（4:3 各裁 12.4%）——
 *      臉與關鍵的東西不能放在那兩條裡（見 ILLUSTRATION.md 第七節附三）。
 *    ・**`<img>` 的 width/height 要寫真值**：`.post-hero img` 是 `height:auto`，
 *      寫錯不會變形但會在載入前留錯高度；`tools/build.mjs` 產的兩處已改成
 *      用 `jpegSize()` 現讀，不再寫死 2000×1116。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTHS = [2000, 1600, 800];
const QUALITY = 0.82;
// 允許的長寬比。⚠ 要再加一種之前先讀上面那一段的兩條。
const RATIOS = [
  { name: "16:9", r: 2000 / 1116 },   // 站上前十一張
  { name: "4:3",  r: 4 / 3 },         // 〈三個月一次的洗牙與塗氟〉起
];
const RATIO_TOL = 0.02;

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
const findChrome = () => chromeCandidates().find((p) => p && fs.existsSync(p));

const [, , srcArg, nameArg] = process.argv;
if (!srcArg || !nameArg) {
  console.error("用法：node tools/hero-resize.mjs <原檔> <name>");
  console.error("例：  node tools/hero-resize.mjs drafts/bioceramic-hero.png bioceramic-photo");
  process.exit(1);
}
const src = path.resolve(ROOT, srcArg);
if (!fs.existsSync(src)) { console.error(`× 找不到 ${srcArg}`); process.exit(1); }

/* ⚠ 為什麼用 Playwright 而不是像 tools/app-icons.mjs 那樣直接叫 chrome：
   那一支是「畫 SVG → 截圖」，同步就結束了；這一支要 await img.decode() 再算像素，
   而 `--dump-dom` 會在 decode 完成之前就把 DOM 倒出來（實測拿不到結果，
   連 try/catch 的錯誤訊息都印不出來）。Playwright 可以等到頁面真的算完。
   容器裡 Playwright 在 /opt/node22/lib/node_modules —— 這是開發用的工具，
   不是建置管線的一環，所以不算破壞「零 npm 依賴」那條（npm run build 不會叫它）。*/
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
const chrome = findChrome();
if (!chrome) { console.error("× 找不到 Chromium"); process.exit(1); }

const ext = path.extname(src).toLowerCase().replace(".", "") || "png";
const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
const dataUri = `data:${mime};base64,${fs.readFileSync(src).toString("base64")}`;

console.log("讀取原檔並縮圖中…");
const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
const res = await pg.evaluate(async ({ uri, widths, quality }) => {
  const img = new Image();
  img.src = uri;
  await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);

  /* 四邊掃白框：每一列／行取亮度平均與標準差，連續「很亮又很平」的算白邊 */
  const d = g.getImageData(0, 0, W, H).data;
  const lum = (i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const stat = (idxs) => {
    let s = 0; for (const i of idxs) s += lum(i);
    const m = s / idxs.length;
    let v = 0; for (const i of idxs) v += (lum(i) - m) ** 2;
    return [m, Math.sqrt(v / idxs.length)];
  };
  const rowIdx = (y) => { const a = []; for (let x = 0; x < W; x += 3) a.push((y * W + x) * 4); return a; };
  const colIdx = (x) => { const a = []; for (let y = 0; y < H; y += 3) a.push((y * W + x) * 4); return a; };
  const scan = (n, idx) => { let k = 0; while (k < n) { const [m, sd] = stat(idx(k)); if (m > 238 && sd < 6) k++; else break; } return k; };
  const border = {
    top: scan(Math.floor(H / 4), rowIdx),
    bottom: scan(Math.floor(H / 4), (k) => rowIdx(H - 1 - k)),
    left: scan(Math.floor(W / 4), colIdx),
    right: scan(Math.floor(W / 4), (k) => colIdx(W - 1 - k)),
  };

  const outs = {};
  for (const w of widths) {
    const h = Math.round(w * H / W);
    const cc = document.createElement("canvas");
    cc.width = w; cc.height = h;
    const gg = cc.getContext("2d");
    gg.imageSmoothingEnabled = true;
    gg.imageSmoothingQuality = "high";
    gg.drawImage(img, 0, 0, w, h);
    outs[w] = { h, data: cc.toDataURL("image/jpeg", quality) };
  }
  return { W, H, border, outs };
}, { uri: dataUri, widths: WIDTHS, quality: QUALITY });
await browser.close();

console.log(`原檔 ${res.W}×${res.H}`);

const ratio = res.W / res.H;
const hit = RATIOS.find((x) => Math.abs(ratio - x.r) <= RATIO_TOL);
if (!hit) {
  console.error(`× 長寬比 ${ratio.toFixed(4)} 不在允許的清單裡：` +
    RATIOS.map((x) => `${x.name}（${x.r.toFixed(4)}）`).join("、") + `（±${RATIO_TOL}）`);
  console.error("  先裁到其中一種再跑，或到這一支的檔頭把新的比例加進 RATIOS（那一段寫著要一起看的兩件事）。");
  process.exit(1);
}
const b = res.border;
if (b.top + b.bottom + b.left + b.right > 0) {
  console.error(`× 四邊有烘進去的白框：上 ${b.top}／下 ${b.bottom}／左 ${b.left}／右 ${b.right} px`);
  console.error("  站上的卡片與 .post-hero 都是圓角滿版，白邊會變成圖裡自己畫了一個框（ILLUSTRATION.md 第七節第 6 條）。");
  console.error("  先把白邊裁掉再跑。");
  process.exit(1);
}
console.log(`✓ 四邊沒有白框、比例對得上（${hit.name}）`);
if (hit.name !== "16:9") {
  console.log("⚠ 這不是 16:9 —— 首頁卡的縮圖會置中裁成 16:9（4:3 上下各裁 12.4%），");
  console.log("  確認臉與關鍵的東西都不在那兩條裡；文章頁看得到完整的原比例。");
}

for (const w of WIDTHS) {
  const o = res.outs[w];
  const file = path.join(ROOT, "assets", `hero-${nameArg}-${w}.jpg`);
  fs.writeFileSync(file, Buffer.from(o.data.split(",")[1], "base64"));
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  → assets/hero-${nameArg}-${w}.jpg  ${w}×${o.h}  ${kb}KB`);
}
console.log("完成。接下來：post-meta 的 hero 寫 -1600.jpg，補 heroAlt 與 .post-hero 的 alt，再跑 node tools/build.mjs");
