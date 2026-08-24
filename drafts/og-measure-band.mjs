/* 量分享圖的「帶子那一條」與邊緣密度。剩下幾科都用得到。
   用法：node drafts/og-measure-band.mjs <圖> [<科別套色 hex>]
   輸出：頂 17% 的明度分佈與 B 通道、安靜區有沒有被東西佔到、整張的邊緣密度、
         以及該科落在套色上的補償色（公式見 ILLUSTRATION.md 第十一節）。 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [file, tintHex = "#4478b5"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
const r = await pg.evaluate(async (uri) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const at = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const lum = ([r, g2, b]) => 0.2126 * r + 0.7152 * g2 + 0.0722 * b;
  // 頂 17%
  const bandH = Math.round(H * 0.17);
  const Ls = [], Bs = [];
  for (let y = 0; y < bandH; y++) for (let x = 0; x < W; x++) { const p = at(x, y); Ls.push(lum(p)); Bs.push(p[2]); }
  const q = (a, p) => { const s = [...a].sort((m, n) => m - n); return s[Math.floor(s.length * p)]; };
  // 安靜區有沒有東西：逐欄看「比該欄中位暗 25 階以上」的像素
  let dark = 0;
  const med = q(Ls, .5);
  for (const l of Ls) if (l < med - 25) dark++;
  // 邊緣密度（Sobel 近似：和右邊、下面的鄰居比）
  let edge = 0, tot = 0;
  for (let y = 0; y < H - 1; y += 2) for (let x = 0; x < W - 1; x += 2) {
    const a = lum(at(x, y)), b = lum(at(x + 1, y)), cc = lum(at(x, y + 1));
    tot++; if (Math.abs(a - b) > 8 || Math.abs(a - cc) > 8) edge++;
  }
  return { W, H, bandH, bandL: { p5: q(Ls, .05), med, p95: q(Ls, .95) },
           bandB: { p5: q(Bs, .05), med: q(Bs, .5) }, darkPct: +(dark / Ls.length * 100).toFixed(2),
           edgePct: +(edge / tot * 100).toFixed(1) };
}, uri);
await browser.close();
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const ink = [42, 44, 39], t = hex(tintHex);
const num = t.map((x, i) => ((x / 255 - 0.18 * (ink[i] / 255)) / 0.82) * 255);
const wall = [Math.round(r.bandL.med), Math.round(r.bandL.med), r.bandB.med]; // 近似：用帶子區的中位
const M = num.map((n, i) => n * 255 / wall[i]);
console.log(JSON.stringify(r, null, 1));
console.log(`頂 17%：B 通道中位 ${r.bandB.med}（這一科要 ≥ ${Math.round(num[2])}）　` +
  `安靜區被佔 ${r.darkPct}%（要 < 1%）　邊緣密度 ${r.edgePct}%（要 ≥ 30%）`);
console.log(`補償色估計 ${"#" + M.map((x) => Math.round(Math.min(255, x)).toString(16).padStart(2, "0")).join("")}` +
  (Math.max(...M) > 255 ? "　⚠ 超過 255，帶子追不上套色，牆太暗" : ""));
