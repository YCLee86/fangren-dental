// 〈智齒要不要拔〉HERO 的參考圖 ①：成長列 —— 一條帶子、六個階段、同一個水平
//
// 用法：node drafts/wisdom-eruption/growth-ribbon-ref.mjs
// 產出：drafts/wisdom-eruption/growth-ribbon-ref.png（1600×620）
//
// ⚠⚠ 2026-09-22 第二版。第一版（growth-row-ref）被使用者退回，兩個理由：
//   > 「他的成長圖要像我傳的那種，有個帶子或曲線表示有連續性，
//   >   另外圖片現在這樣分上下 很難聯想起來 應該是同一個水平」
//   第一版把成長列做成畫面下緣獨立的一帶、用一條細橫線和診間隔開。
//   那個做法是從 ILLUSTRATION.md 第八節第 3 條推的（同一個人畫在同一個空間會
//   被讀成「路人剛好走過，而且長得一模一樣」），**但代價是兩層之間沒有關係**。
//   使用者給的 Pixta 參考圖（兒童成長：從小到大）用的是另一個解法：
//   **一條帶子把各階段串起來**，帶子本身就宣告了「這是同一條時間」。
//   所以第二版：分隔線拿掉、六個階段和診間在同一個地面上，改用帶子接。
//
// ⚠⚠ 第六個階段**就是坐在診療椅上的那位病患本人**，不是另外再畫一個站著的人。
//   這一條同時治掉第八節第 3 條那個坑：畫面裡不會有兩個長得一樣的人。
//   帶子的終點就在他的椅子底下。
//
// ⚠ 身高級距和第一版一樣是**刻意拉平的**（0.22／0.45／0.62／0.78／0.90／1.00）。
//   真實比例是幼兒園 0.67／小學 0.81／國中 0.94／高中 0.98 —— 後三段差不到 5%，
//   縮到手機上（HERO 只有 335px 寬）三個一模一樣。這是成長圖表的慣例，不是畫錯。
//
// ⚠ 這張只提供**大小、間距與帶子的走向**，不提供顏色、衣服與畫法。
//   每個階段穿什麼寫在提示詞裡（第七節第 18 條：不逐人指派就會六個階段同一色）。
// ⚠ 一個字都沒有（參考圖上的字會被模型直接畫進成品）。

import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 620;

const INK    = '#4a3c33';
const BODY   = '#b9b2a8';   // 所有人同一個灰 —— 這張不提供顏色
const SHADE  = '#a39c92';   // 遠側的手腳，只為了讓四肢讀得出是四隻
const RIBBON = '#ddd0c0';

/* ── 帶子：一條從左下往右上的緩 S，六個階段站在它上面 ──────── */
const X0 = 70, X1 = 1520;
const t = (x) => (x - X0) / (X1 - X0);
const ribbonY = (x) => 470 - 34 * Math.sin(2 * Math.PI * t(x)) - 108 * t(x);

let d = `M ${X0} ${ribbonY(X0).toFixed(1)}`;
for (let x = X0 + 10; x <= X1; x += 10) d += ` L ${x} ${ribbonY(x).toFixed(1)}`;
const ribbon = `<path d="${d}" fill="none" stroke="${RIBBON}" stroke-width="54" stroke-linecap="round"/>`;

/* ── 人：極簡剪影，只為了鎖大小 ───────────────────────────── */
const TALL = 300;
const SLOT  = [165, 405, 645, 885, 1125];              // 前五階（第六階是坐著的病患）
const RATIO = [0.22, 0.45, 0.62, 0.78, 0.90];

const stand = (cx, h) => {
  const base = ribbonY(cx) - 6;
  const headR = h * 0.105, headY = base - h + headR, neck = headY + headR;
  const hip = base - h * 0.44, bw = h * 0.24;
  const R = (x, y, w, ht, r, f) =>
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${ht.toFixed(1)}" rx="${r.toFixed(1)}" fill="${f || BODY}" stroke="${INK}" stroke-width="2"/>`;
  return `
    <circle cx="${cx}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${R(cx - bw / 2, neck, bw, hip - neck, bw * 0.3)}
    ${R(cx - bw * 0.78, neck + h * 0.02, bw * 0.24, h * 0.30, bw * 0.12)}
    ${R(cx + bw * 0.54, neck + h * 0.02, bw * 0.24, h * 0.30, bw * 0.12)}
    ${R(cx - bw * 0.46, hip, bw * 0.38, base - hip, bw * 0.15)}
    ${R(cx + bw * 0.08, hip, bw * 0.38, base - hip, bw * 0.15)}`;
};

/* 在地上爬的嬰兒：頭大、軀幹短、四肢撐地 */
const crawl = (cx0, h) => {
  const base = ribbonY(cx0) - 6;
  const hr = h * 0.24;
  const tx = cx0 - h * 0.20, tw = h * 0.62;
  const ty = base - h * 0.66, th = h * 0.42;
  const limb = (x, back) =>
    `<rect x="${x.toFixed(1)}" y="${(base - h * 0.32).toFixed(1)}" width="${(h * 0.13).toFixed(1)}" height="${(h * 0.32).toFixed(1)}" rx="${(h * 0.055).toFixed(1)}" fill="${back ? SHADE : BODY}" stroke="${INK}" stroke-width="2"/>`;
  return `
    ${limb(cx0 - h * 0.05, true)}${limb(cx0 + h * 0.33, true)}
    <rect x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" width="${tw.toFixed(1)}" height="${th.toFixed(1)}" rx="${(h * 0.15).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${(cx0 - h * 0.25).toFixed(1)}" cy="${(base - h + hr).toFixed(1)}" r="${hr.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${limb(cx0 - h * 0.16, false)}${limb(cx0 + h * 0.22, false)}`;
};

/* 第六階 ＝ 坐在諮詢椅上的病患本人，帶子的終點就在椅腳底下 */
/* 第六階 ＝ 坐在諮詢椅上的病患本人，帶子的終點就在椅腳底下。
   ⚠ 他面向右（面向醫師），所以**椅背在他左邊**、大腿往右伸。
      第一版椅背畫在右邊，讀起來像坐反了。 */
const seated = (cx) => {
  const base = ribbonY(cx) - 6;
  const h = TALL;
  const seat = base - h * 0.30;          // 座面
  const bw = h * 0.24;
  const headR = h * 0.105;
  const headY = seat - h * 0.44 + headR;
  const R = (x, y, w, ht, r, fill) =>
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${ht.toFixed(1)}" rx="${r.toFixed(1)}" fill="${fill || BODY}" stroke="${INK}" stroke-width="2"/>`;
  return `
    ${R(cx - h * 0.26, seat - h * 0.42, h * 0.055, h * 0.44, h * 0.02, SHADE)}
    ${R(cx - h * 0.26, seat, h * 0.44, h * 0.055, h * 0.02, SHADE)}
    ${R(cx - h * 0.24, seat + h * 0.055, h * 0.045, h * 0.25, h * 0.015, SHADE)}
    ${R(cx + h * 0.13, seat + h * 0.055, h * 0.045, h * 0.25, h * 0.015, SHADE)}
    <circle cx="${cx.toFixed(1)}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${R(cx - bw / 2, headY + headR, bw, seat - headY - headR, bw * 0.3)}
    ${R(cx - h * 0.02, seat - h * 0.055, h * 0.24, h * 0.085, h * 0.04)}
    ${R(cx + h * 0.16, seat + h * 0.03, h * 0.085, h * 0.27, h * 0.04)}`;
};

const figs = [
  crawl(SLOT[0], TALL * RATIO[0]),
  ...SLOT.slice(1).map((x, i) => stand(x, TALL * RATIO[i + 1])),
  seated(1390),
].join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f6f1e6"/>
  ${ribbon}
  ${figs}
</svg>`;

/* ── 出圖（Chromium，做法同 tools/webp.mjs） ───────────────── */
const pwDir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const cands = [];
if (existsSync(pwDir)) for (const dd of readdirSync(pwDir)) {
  cands.push(join(pwDir, dd, 'chrome-linux', 'headless_shell'));
  cands.push(join(pwDir, dd, 'chrome-linux', 'chrome'));
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
await pg.screenshot({ path: resolve(here, 'growth-ribbon-ref.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字 —— 參考圖不可以有任何字元');
console.log('寫好了：drafts/wisdom-eruption/growth-ribbon-ref.png　' + W + '×' + H);
