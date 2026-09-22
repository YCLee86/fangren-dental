// 〈智齒要不要拔〉HERO 原檔的裁切 —— 去掉烘進去的白邊，再置中裁回 16:9
//
// 用法：node drafts/wisdom-eruption/hero-crop.mjs
// 產出：drafts/wisdom-eruption/hero-src-crop.jpg
//
// ⚠⚠ 為什麼要有這一支：Gemini 交回來的那張下緣有 17px 的白列，
//   tools/hero-resize.mjs 的第一道守門直接擋下來（ILLUSTRATION.md 第七節第 6 條：
//   站上的卡片與 .post-hero 都是圓角滿版，白邊會變成圖裡自己畫了一個框）。
//   〈拔智齒〉八之一節那次也踩過同一件（交回來下緣 1px 白列）。
//
// ⚠ 裁掉白邊之後比例會跑掉（1376×751 ＝ 1.832，超出 hero-resize 的 ±0.02 容差），
//   所以要再**置中裁寬**回 16:9（那一支用的是 2000/1116 ＝ 1.7921，不是 1.7778）。
//
// 白邊的判準抄 hero-resize.mjs 那一把尺：整列／整行的亮度平均 > 238 且標準差 < 6。

import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, 'hero-src.jpg');
const DEST = resolve(here, 'hero-src-crop.jpg');
const TARGET = 2000 / 1116;      // hero-resize.mjs 的 16:9

const pwDir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const cands = [];
if (existsSync(pwDir)) for (const d of readdirSync(pwDir)) {
  cands.push(join(pwDir, d, 'chrome-linux', 'headless_shell'));
  cands.push(join(pwDir, d, 'chrome-linux', 'chrome'));
}
cands.push('/usr/bin/chromium');
const chrome = cands.find((p) => existsSync(p));
let chromium = null;
for (const p of ['/opt/node22/lib/node_modules/playwright/index.js', 'playwright']) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
if (!chromium || !chrome) { console.error('× 找不到 Playwright／Chromium'); process.exit(1); }

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
await pg.goto('about:blank');

const out = await pg.evaluate(async ({ dataUrl, target }) => {
  const img = new Image();
  await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = dataUrl; });
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const lum = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  const blank = (pts) => {
    let s = 0, s2 = 0;
    for (const i of pts) { const v = lum(i); s += v; s2 += v * v; }
    const m = s / pts.length;
    return m > 238 && Math.sqrt(Math.max(0, s2 / pts.length - m * m)) < 6;
  };
  const rowPts = (y) => { const a = []; for (let x = 0; x < W; x++) a.push((y * W + x) * 4); return a; };
  const colPts = (x) => { const a = []; for (let y = 0; y < H; y++) a.push((y * W + x) * 4); return a; };
  let top = 0, bot = H - 1, left = 0, right = W - 1;
  while (top < bot && blank(rowPts(top))) top++;
  while (bot > top && blank(rowPts(bot))) bot--;
  while (left < right && blank(colPts(left))) left++;
  while (right > left && blank(colPts(right))) right--;
  const trimmed = { x: left, y: top, w: right - left + 1, h: bot - top + 1 };

  /* 置中裁回目標比例：只裁多出來的那一邊 */
  let { x, y, w, h } = trimmed;
  if (w / h > target) { const nw = Math.round(h * target); x += Math.round((w - nw) / 2); w = nw; }
  else { const nh = Math.round(w / target); y += Math.round((h - nh) / 2); h = nh; }

  const o = document.createElement('canvas');
  o.width = w; o.height = h;
  const og = o.getContext('2d');
  og.imageSmoothingEnabled = true; og.imageSmoothingQuality = 'high';
  og.drawImage(c, x, y, w, h, 0, 0, w, h);
  return { url: o.toDataURL('image/jpeg', 0.95), W, H, trimmed, crop: { x, y, w, h } };
}, { dataUrl: 'data:image/jpeg;base64,' + (await import('node:fs')).readFileSync(SRC).toString('base64'), target: TARGET });

await browser.close();
writeFileSync(DEST, Buffer.from(out.url.split(',')[1], 'base64'));
const t = out.trimmed, c2 = out.crop;
console.log('原檔 ' + out.W + '×' + out.H);
console.log('去白邊 → ' + t.w + '×' + t.h + '（上 ' + t.y + '／左 ' + t.x + '）');
console.log('置中裁回 16:9 → ' + c2.w + '×' + c2.h + '　比例 ' + (c2.w / c2.h).toFixed(4) +
  '（目標 ' + TARGET.toFixed(4) + '）');
console.log('寫好了：drafts/wisdom-eruption/hero-src-crop.jpg');
