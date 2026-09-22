// 〈智齒要不要拔〉HERO 的參考圖 ②：牆上那張全景片的內容
//
// 用法：node drafts/wisdom-eruption/pano-ref.mjs
// 產出：drafts/wisdom-eruption/pano-ref.png（1400×760）
//
// ⚠⚠ 為什麼要有這張：ILLUSTRATION.md 第十之一 ——「形狀不要用文字描述，用參考圖」。
//   而且同科的〈拔智齒〉第八節第 9 條已經踩過兩件，文字每次都講不動：
//     ・**智齒一定往前傾**（頂著前面那顆），模型會畫成往後倒。
//     ・**它的後面不准有牙** —— 智齒是最後一顆。
//   這兩件是「角度」與「有沒有東西」，正是文字最講不清楚的兩種。
//
// ⚠⚠ 2026-09-22 第二版：牙根改短改粗、顆數從 16 減到 14。
//   使用者看過成品：「插圖中間的 X 光片上一版比較好，用上一版的」——
//   差別在**片子被畫大之後，細長的牙根就變成一排火柴棒**。
//   真的全景片上，牙冠佔的比例比牙根想像中大，而且根短而鈍。
//   顆數減少 ＝ 每顆分到的像素變多（同 ILLUSTRATION.md 第七節第 10 條那條：
//   「圈存在不代表像素夠」）。
//
// ⚠ 這張只提供一件事：**片子裡的排列**（弓形、上下排、四顆智齒各自的角度）。
//   畫法不提供 —— 提示詞要明講「抄排列，不要抄這張的畫法」，
//   不然模型會把這裡的平塗深灰底整片抄過去（第十一節那條）。
//
// ⚠ 一個字都沒有（參考圖上的字會被畫進成品）。片子上不標編號、不標左右。

import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1400, H = 760;

const FILM = '#2f3338';   // 片子的底（深，但不是純黑）
const BONE = '#6d7278';   // 骨頭
const TOOTH = '#ddd8cc';  // 牙齒
const EDGE = '#9aa0a6';

const cx = W / 2, yOcc = 400, curve = 0.00030;   // 咬合線：中間低、兩側高（全景片的「微笑」弧）
const occ = (x) => yOcc - curve * (x - cx) * (x - cx);

/* 一顆牙：冠朝 -y，根朝 +y。只有輪廓，細節一律不畫 —— 這是排列參考。 */
const tooth = (w, crown, root, prongs) => {
  const hw = w / 2;
  let d = `M ${-hw} 0 L ${-hw * 0.86} ${-crown * 0.72} Q 0 ${-crown} ${hw * 0.86} ${-crown * 0.72} L ${hw} 0 Z`;
  if (prongs === 1) d += ` M ${-hw * 0.5} 0 L ${-hw * 0.28} ${root} Q 0 ${root * 1.1} ${hw * 0.28} ${root} L ${hw * 0.5} 0 Z`;
  else d += ` M ${-hw * 0.72} 0 L ${-hw * 0.62} ${root} Q ${-hw * 0.3} ${root * 1.06} ${-hw * 0.08} ${root} L ${-hw * 0.06} 0 Z` +
            ` M ${hw * 0.06} 0 L ${hw * 0.08} ${root} Q ${hw * 0.3} ${root * 1.06} ${hw * 0.62} ${root} L ${hw * 0.72} 0 Z`;
  return d;
};

/* 一排牙：沿著咬合弧放，每一顆跟著弧的法線轉。up=true 是下排（冠朝上）。 */
const row = (up, n, spread, tilts) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i - (n - 1) / 2) / ((n - 1) / 2);
    const x = cx + t * spread;
    const y = occ(x);
    const slope = -2 * curve * (x - cx);                   // 弧的斜率
    const base = Math.atan(slope) * 180 / Math.PI;
    const idx = Math.abs(i - (n - 1) / 2);                 // 離中線幾顆（0 ＝ 門牙）
    const molar = idx > 3.6;
    const w = molar ? 88 : idx > 2.0 ? 74 : 56;
    const crown = molar ? 64 : 70;
    const root = molar ? 58 : 70;          // ⚠ 根要短而鈍，不是細長的火柴棒
    const extra = tilts[i] || 0;
    const flip = up ? 0 : 180;
    /* ⚠⚠ tooth() 的原點是**牙頸**（冠在 -y、根在 +y），不是咬合面。
       兩排都錨在咬合線的話，上排的冠會整個蓋在下排的冠上（第一版就是這樣，
       出來是一團分不出上下的牙）。下排的牙頸在咬合線**下方**一個牙冠，
       上排的牙頸在**上方**一個牙冠。 */
    const ay = y + (up ? crown : -crown);
    out.push(`<path d="${tooth(w, crown, root, molar ? 2 : 1)}" fill="${TOOTH}" stroke="${EDGE}" stroke-width="2.5"
      transform="translate(${x.toFixed(1)} ${ay.toFixed(1)}) rotate(${(base + flip + extra).toFixed(1)})"/>`);
  }
  return out.join('\n');
};

/* ⚠⚠ 這張圖的重點就在這兩組角度：
   ・下排（16 顆）最外側那兩顆 ＝ 下顎智齒，**往前傾 42 度頂著前面那顆**。
     左端那顆往右前方倒（＋42），右端那顆往左前方倒（−42）。
   ・上排（16 顆）最外側那兩顆 ＝ 上顎智齒，**站得直、長到咬合平面**
     （文章裡那一句：上顎比下顎更常完全萌發）。 */
const lowerTilt = { 0: 42, 13: -42 };
const upperTilt = {};

/* 下顎骨的輪廓：中間一條帶 ＋ 兩側上升的下顎枝 */
const ramus = (sx) => {
  const d = sx < cx ? -1 : 1;
  return `<path d="M ${sx} ${(occ(sx) + 250).toFixed(1)} L ${sx} ${(occ(sx) + 40).toFixed(1)}
    L ${(sx + d * 92).toFixed(1)} ${(occ(sx) - 170).toFixed(1)} L ${(sx + d * 168).toFixed(1)} ${(occ(sx) - 150).toFixed(1)}
    L ${(sx + d * 138).toFixed(1)} ${(occ(sx) + 258).toFixed(1)} Z"
    fill="${BONE}" stroke="${EDGE}" stroke-width="2.5" opacity="0.45"/>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f6f1e6"/>
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="18" fill="${FILM}"/>
  ${ramus(232)}${ramus(W - 232)}
  <path d="M 232 ${(occ(232) + 196).toFixed(1)} Q ${cx} ${(occ(cx) + 300).toFixed(1)} ${W - 232} ${(occ(W - 232) + 196).toFixed(1)}"
        fill="none" stroke="${BONE}" stroke-width="30" opacity="0.4"/>
  ${row(false, 14, 430, upperTilt)}
  ${row(true, 14, 430, lowerTilt)}
</svg>`;

/* ── 出圖（Chromium，做法同 tools/webp.mjs） ───────────────── */
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
const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await pg.setContent(`<body style="margin:0">${svg}</body>`);
await pg.screenshot({ path: resolve(here, 'pano-ref.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字 —— 參考圖不可以有任何字元');
console.log('寫好了：drafts/wisdom-eruption/pano-ref.png　' + W + '×' + H);
