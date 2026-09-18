// 量這一篇 HERO 的兩個門檻：邊緣密度、每個人的線一樣實（TEAM.md 第 9 號的交件門檻）
//   node drafts/kids-sedation/measure-ink.mjs drafts/kids-sedation/hero-v1.jpg
// 做法同 drafts/og-measure-ink.mjs，只是把人物框換成這一張的。
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const f = process.argv[2];
// 正規化座標 [x0, y0, x1, y1]
const people = {
  "①建議":   [0.02, 0.03, 0.49, 0.48],
  "②電話":   [0.51, 0.03, 0.98, 0.48],
  "③治療":   [0.02, 0.52, 0.49, 0.97],
  "④術後":   [0.51, 0.52, 0.98, 0.97],
};
// 四格版：框改成一格一個。⚠ 第一版那張是單一場景，框是逐人給的，換梗之後不能沿用。
const extra = {};
const uri = `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
const r = await pg.evaluate(async ({ uri, people }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const lum = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * d[i] + 0.7152 * d[i+1] + 0.0722 * d[i+2]; };
  // 邊緣密度：|dx|+|dy| > 12 的像素比例
  let edge = 0, n = 0;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    n++;
    if (Math.abs(lum(x+1,y) - lum(x-1,y)) + Math.abs(lum(x,y+1) - lum(x,y-1)) > 12) edge++;
  }
  // 每個人框內「最暗 5 百分位」的平均亮度 ＝ 線的實度
  const dark = {};
  for (const [k, b] of Object.entries(people)) {
    const x0 = Math.round(b[0]*W), y0 = Math.round(b[1]*H), x1 = Math.round(b[2]*W), y1 = Math.round(b[3]*H);
    const v = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) v.push(lum(x, y));
    v.sort((a, b2) => a - b2);
    const k5 = Math.max(1, Math.round(v.length * 0.05));
    dark[k] = +(v.slice(0, k5).reduce((s, t) => s + t, 0) / k5).toFixed(1);
  }
  return { W, H, edgePct: +(edge / n * 100).toFixed(1), dark };
}, { uri, people: { ...people, ...extra } });
await browser.close();
console.log(JSON.stringify(r, null, 1));
const vals = Object.entries(r.dark).filter(([k]) => !(k in extra)).map(([, v]) => v);
console.log(`\n邊緣密度 ${r.edgePct}%　門檻 ≥30% → ${r.edgePct >= 30 ? "過" : "⚠ 不過"}`);
console.log(`線的實度 最暗5%：最深 ${Math.min(...vals)}／最淺 ${Math.max(...vals)}，差 ${(Math.max(...vals)-Math.min(...vals)).toFixed(1)} 階　門檻 <20 → ${(Math.max(...vals)-Math.min(...vals)) < 20 ? "過" : "⚠ 不過"}`);
