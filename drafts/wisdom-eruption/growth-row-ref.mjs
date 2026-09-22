// 〈智齒要不要拔〉HERO 的參考圖 ①：成長列的高度級距、間距與剪影
//
// 用法：node drafts/wisdom-eruption/growth-row-ref.mjs
// 產出：drafts/wisdom-eruption/growth-row-ref.png（1600×520）
//
// ⚠⚠ 為什麼要有這張：ILLUSTRATION.md 第十之一 ——「形狀不要用文字描述，用參考圖」。
//   同科的〈拔智齒〉八之一節那五支箭頭，用文字描述失敗三輪、改成給圖一次就中。
//   這一張要鎖的正是**大小關係**（六個階段的身高級距），而那是文字最講不清楚的東西。
//
// ⚠⚠ 三件刻意的決定：
//  ① **身高級距是刻意「拉平」的，不是真實比例。** 真實比例（以成人 165 為 1）是
//     幼兒園 0.67／小學 0.81／國中 0.94／高中 0.98 —— 後面三個差不到 5%，
//     縮到手機上（HERO 只有 335px 寬）三個一模一樣，整條成長列就只有前半讀得出來。
//     這裡用 0.22／0.45／0.62／0.78／0.90／1.00，每一階都看得出來。
//     ⚠ 這是成長圖表的慣例，不是畫錯 —— 不要有人拿真實身高表回頭「訂正」它。
//  ② **這張圖只提供一件事：高度級距、間距與地線。**
//     第一版連書包也畫進來（圓背包 → 方書包 → 側背包 → 大後背包 → 側肩包），
//     拿掉了，兩個理由：ILLUSTRATION.md 第十二節「參考圖要分組，每一組只准提供一件事」；
//     而且**書包是叫得出名字的東西，文字講得清楚** —— 參考圖要留給文字講不清楚的
//     「大小關係」。每個階段的衣服與隨身物寫在提示詞的 THE GROWING-UP STRIP 那一段。
//  ③ **全部塗成同一個灰**，而且**一個字都沒有**。
//     ・同一個灰：這張只提供形狀與大小，**不提供顏色** —— 六個階段是同一個人的
//       不同年紀，衣服必須各自不同色（第七節第 18 條：不逐人指派顏色會全家同色）。
//     ・沒有字：參考圖上的字會被模型直接畫進成品（第十一節踩過三種形式）。

import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 520;

const INK  = '#4a3c33';   // 暖棕輪廓，不是純黑（同站上其他參考圖）
const BODY = '#b9b2a8';   // 所有人同一個灰 —— 這張不提供顏色
const SHADE = '#a39c92';  // 遠側的手腳，只為了讓四肢讀得出是四隻
const LINE = '#cfc7ba';

const BASE = 440;          // 地線
const TALL = 340;          // 最高的那一個（現在的他）
const SLOT = [150, 400, 650, 900, 1150, 1400];
const RATIO = [0.22, 0.45, 0.62, 0.78, 0.90, 1.00];

/* 站著的人：頭、身體、兩腿、兩臂。刻意畫得極簡 —— 這是剪影參考不是畫法參考。 */
const stand = (cx, h) => {
  const headR = h * 0.105;
  const headY = BASE - h + headR;
  const neck  = headY + headR;
  const hip   = BASE - h * 0.44;
  const bw    = h * 0.24;
  return `
    <circle cx="${cx}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="${(cx - bw / 2).toFixed(1)}" y="${neck.toFixed(1)}" width="${bw.toFixed(1)}" height="${(hip - neck).toFixed(1)}" rx="${(bw * 0.3).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="${(cx - bw * 0.78).toFixed(1)}" y="${(neck + h * 0.02).toFixed(1)}" width="${(bw * 0.24).toFixed(1)}" height="${(h * 0.30).toFixed(1)}" rx="${(bw * 0.12).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="${(cx + bw * 0.54).toFixed(1)}" y="${(neck + h * 0.02).toFixed(1)}" width="${(bw * 0.24).toFixed(1)}" height="${(h * 0.30).toFixed(1)}" rx="${(bw * 0.12).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="${(cx - bw * 0.46).toFixed(1)}" y="${hip.toFixed(1)}" width="${(bw * 0.38).toFixed(1)}" height="${(BASE - hip).toFixed(1)}" rx="${(bw * 0.15).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <rect x="${(cx + bw * 0.08).toFixed(1)}" y="${hip.toFixed(1)}" width="${(bw * 0.38).toFixed(1)}" height="${(BASE - hip).toFixed(1)}" rx="${(bw * 0.15).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>`;
};

/* 在地上爬的嬰兒：頭在左、軀幹橫躺、四肢撐地。 */
/* 在地上爬的嬰兒：頭大、軀幹短、四肢撐地。
   ⚠ 第一版軀幹畫成 1.05h 長、頭只有 0.30h，讀起來是一隻四腳動物。
      嬰兒的頭大約是全身的四分之一，爬的時候軀幹幾乎和頭一樣長 —— 照這個改就對了。 */
const crawl = (cx0, h) => {
  const hr = h * 0.24;                        // 嬰兒的頭 ≒ 全身高的四分之一（半徑 0.24h ＝ 直徑近半）
  const tx = cx0 - h * 0.20, tw = h * 0.62;   // 軀幹橫躺
  const ty = BASE - h * 0.66, th = h * 0.38;
  const limb = (x, back) =>
    `<rect x="${x.toFixed(1)}" y="${(BASE - h * 0.32).toFixed(1)}" width="${(h * 0.13).toFixed(1)}" height="${(h * 0.32).toFixed(1)}" rx="${(h * 0.055).toFixed(1)}" fill="${back ? SHADE : BODY}" stroke="${INK}" stroke-width="2"/>`;
  return `
    ${limb(cx0 - h * 0.05, true)}
    ${limb(cx0 + h * 0.33, true)}
    <rect x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" width="${tw.toFixed(1)}" height="${th.toFixed(1)}" rx="${(h * 0.15).toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${(cx0 - h * 0.25).toFixed(1)}" cy="${(BASE - h + hr).toFixed(1)}" r="${hr.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${limb(cx0 - h * 0.16, false)}
    ${limb(cx0 + h * 0.22, false)}`;
};

const figs = [
  crawl(SLOT[0], TALL * RATIO[0]),
  ...SLOT.slice(1).map((x, i) => stand(x, TALL * RATIO[i + 1])),
].join('\n');

/* 上緣那條細線 ＝ 這一帶和上面的診間是分開的兩個時間（同〈拔智齒〉那張的垂直分隔線）。 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f6f1e6"/>
  <line x1="0" y1="40" x2="${W}" y2="40" stroke="${LINE}" stroke-width="4"/>
  <line x1="0" y1="${BASE}" x2="${W}" y2="${BASE}" stroke="${INK}" stroke-width="3"/>
  ${figs}
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
await pg.screenshot({ path: resolve(here, 'growth-row-ref.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字 —— 參考圖不可以有任何字元');
console.log('寫好了：drafts/wisdom-eruption/growth-row-ref.png　' + W + '×' + H);
