/* 分享卡的三個門檻＋兩個這一輪加的量，一支跑完。
 *   node drafts/og-measure-card.mjs <圖檔> [名稱=x0,y0,x1,y1 ...]
 *   例：node drafts/og-measure-card.mjs drafts/og-topic-endo-v1.jpg 醫師=.155,.11,.345,.95 牙齒=.53,.25,.78,.93
 *
 * 框用**比例**（0~1），不用像素 —— 出圖模型給的尺寸每次都不一樣。
 *
 * ⚠⚠ 邊緣密度一律**先縮到 1200×628 再量**：同一張圖放在不同尺寸上，
 *   固定門檻（|dx|+|dy| > 12）數出來的比例不一樣，不縮就不能和牙周那張的 31.6% 比。
 * ⚠ 「頂 104px 有沒有東西伸進來」是這一輪加的（v1 的顯微鏡臂爬到 y=0）——
 *   判準是「偏離那一條的亮度中位超過 15 階」，比用眼睛看可靠。
 * ⚠ 這一支用容器裡的 playwright，只在雲端 session 跑得動；
 *   Windows 那台請用 drafts/og-measure-win.ps1。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const [file, ...rest] = process.argv.slice(2);
if (!file) { console.error("用法：node drafts/og-measure-card.mjs <圖檔> [名稱=x0,y0,x1,y1 ...]"); process.exit(1); }
const boxes = {};
for (const a of rest) { const [k, v] = a.split("="); boxes[k] = v.split(",").map(Number); }

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const mime = /\.png$/i.test(file) ? "png" : "jpeg";
const uri = `data:image/${mime};base64,${fs.readFileSync(file).toString("base64")}`;
const r = await pg.evaluate(async ({ uri, boxes }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = 1200, H = 628, TOP = 104;                       // 一律縮到成品尺寸再量
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H).data;
  const at = (x, y) => (y * W + x) * 4;
  const lum = (x, y) => { const i = at(x, y); return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; };
  const hsl = (r_, g_, b_) => { r_ /= 255; g_ /= 255; b_ /= 255;
    const mx = Math.max(r_, g_, b_), mn = Math.min(r_, g_, b_), l = (mx + mn) / 2;
    return [mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)) * 100, l * 100]; };
  let edge = 0, n = 0, pale = 0, all = 0;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    n++; if (Math.abs(lum(x + 1, y) - lum(x - 1, y)) + Math.abs(lum(x, y + 1) - lum(x, y - 1)) > 12) edge++;
  }
  for (let i = 0; i < d.length; i += 4) { const [s, l] = hsl(d[i], d[i + 1], d[i + 2]); all++; if (s < 12 && l > 80) pale++; }
  const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
  const R = [], G = [], B = [], L = [];
  for (let y = 0; y < TOP; y++) for (let x = 0; x < W; x++) { const i = at(x, y); R.push(d[i]); G.push(d[i + 1]); B.push(d[i + 2]); L.push(lum(x, y)); }
  const med = q(L, .5);
  let off = 0, firstY = TOP;
  for (let y = 0; y < TOP; y++) { let bad = 0;
    for (let x = 0; x < W; x++) if (Math.abs(lum(x, y) - med) > 15) { off++; bad++; }
    if (bad > 6 && firstY === TOP) firstY = y; }
  const p5 = ([x0, y0, x1, y1]) => { const v = [];
    for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y++)
      for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x++) v.push(lum(x, y));
    v.sort((a, b) => a - b); return +v[Math.floor(v.length * 0.05)].toFixed(1); };
  const out = { edgePct: +(100 * edge / n).toFixed(1), palePct: +(100 * pale / all).toFixed(2),
    topMed: [q(R, .5), q(G, .5), q(B, .5)], topOffPct: +(100 * off / (TOP * W)).toFixed(2), firstY, people: {} };
  for (const k in boxes) out.people[k] = p5(boxes[k]);
  return out;
}, { uri, boxes });
await browser.close();

const hx = (a) => "#" + a.map((v) => v.toString(16).padStart(2, "0")).join("");
const ok = (b) => (b ? "✅" : "❌");
console.log(`\n【${file}】（縮到 1200×628 後量）`);
console.log(`  無彩空白 ${r.palePct}%　門檻 < 5%　${ok(r.palePct < 5)}`);
console.log(`  邊緣密度 ${r.edgePct}%　門檻 ≥ 30%　${ok(r.edgePct >= 30)}`);
console.log(`  頂 104px 牆色中位 ${hx(r.topMed)}（R ${r.topMed[0]}）　顯微根管要 R ≥ 203　${ok(r.topMed[0] >= 203)}`);
console.log(`  頂 104px 裡「不是牆」的像素 ${r.topOffPct}%　最早從 y=${r.firstY}　門檻 ≈ 0　${ok(r.topOffPct < 0.5)}`);
const ppl = Object.entries(r.people);
if (ppl.length) {
  const v = ppl.map((p) => p[1]); const diff = Math.max(...v) - Math.min(...v);
  console.log(`  各框最暗 5 百分位：` + ppl.map(([k, x]) => `${k} ${x}`).join("／") + `　相差 ${diff.toFixed(1)} 階　門檻 < 20　${ok(diff < 20)}`);
}
