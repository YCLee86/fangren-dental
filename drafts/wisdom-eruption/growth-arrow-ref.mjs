// 〈智齒要不要拔〉HERO 的參考圖 ①：S 形的粗寬箭頭 ＋ 每個人的大小與位置
//
// 用法：node drafts/wisdom-eruption/growth-arrow-ref.mjs
// 產出：drafts/wisdom-eruption/growth-arrow-ref.png（1600×700）
//
// ⚠⚠ 2026-09-22 第三版。前兩版都被退回，理由逐條記在這裡（不要再走回去）：
//   第一版 growth-row-ref：成長列做成畫面下緣獨立的一帶、用細橫線和診間隔開。
//     > 「圖片現在這樣分上下 很難聯想起來 應該是同一個水平」
//   第二版 growth-ribbon-ref：改成同一個地面上的一條帶子。出圖之後：
//     > 「這個畫法很像在這個診間裡有很多人／那個帶子現在在地上很像地毯，
//     >   把那個帶子改成立起來的粗寬漸層箭頭看看」
//     > 「左右先反過來　另外醫師和患者占的比例太少，
//     >   或許患者每個生長階段的帶子改成 S 形」
//
// 第三版因此改四件：
//  ① **帶子改成箭頭，而且「立起來」** —— 不貼在地板上、不做透視，
//     是一條畫在畫面平面上的平面圖形（像緞帶橫幅），所以一眼就知道它不是地毯。
//     這同時治掉「很像診間裡有很多人」：那五個人站在一個**圖形**上，不是站在地板上。
//  ② **S 形**，而且**粗寬、有漸層**（尾端淡、箭頭端深）。
//     ⚠ 漸層是使用者指定的。ILLUSTRATION.md 第三節寫著「漸層只用來描述光，不當裝飾」——
//       這是那一條的例外，**而且只限這支箭頭**，畫面其他地方仍然是平塗。
//     ⚠ 2026-09-22 顏色從陶土色改成**口腔外科的紫**（使用者指定）：
//       尾 #e6dce9 → 中 #8e6299 → 箭頭 #784e84。科別色因此在畫面上出現兩處
//       （醫師的刷手服與這支箭頭），兩者同一個家族、讀起來是一組。
//  ③ **左右反過來**：醫師與病患在左，箭頭從右邊進來、箭頭尖指向病患。
//  ④ **醫師與病患畫大**：兩個大人是畫面裡最大的人，五個階段明顯小一階。
//
// ⚠ 這張只提供**箭頭的走向、每個人的大小與位置**，不提供顏色、衣服與畫法。
// ⚠ 一個字都沒有（參考圖上的字會被模型直接畫進成品）。

import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 700;

const INK   = '#4a3c33';
const BODY  = '#b9b2a8';
const SHADE = '#a39c92';

/* ── S 形的箭頭：中線用一段正弦，兩側各外推半個寬度 ──────────
   尾在右上（t=0）、箭頭在左（t=1）。
   ⚠ 第一版用三次貝茲，S 拉不開、讀起來只是一條波浪帶；改成正弦好控制振幅。
   ⚠ 寬度從尾到頭變粗 —— 方向感因此不必只靠箭頭那一個三角形。 */
const bez = (t) => [
  1555 - 930 * t,
  415 + 205 * Math.sin(2 * Math.PI * (0.78 * t - 0.23)),
];
const tangent = (t) => {
  const [x0, y0] = bez(Math.max(0, t - 0.002));
  const [x1, y1] = bez(Math.min(1, t + 0.002));
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  return [dx / L, dy / L];
};
const widthAt = (t) => 52 + 56 * t;
const TIP = 0.955;

const left = [], right = [];
for (let i = 0; i <= 80; i++) {
  const t = (i / 80) * TIP;
  const [x, y] = bez(t), [tx, ty] = tangent(t), w = widthAt(t) / 2;
  left.push([x - ty * w, y + tx * w]);
  right.push([x + ty * w, y - tx * w]);
}
const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
const bandPath = `M ${pt(left[0])} ` + left.slice(1).map((p) => `L ${pt(p)}`).join(' ') +
  ' ' + right.reverse().map((p) => `L ${pt(p)}`).join(' ') + ' Z';

/* 箭頭：底邊只比帶子寬一點、長度也收斂 —— 第一版的三角形太大，
   讀起來像一個獨立的三角形貼在旁邊，不像同一支箭頭的頭。 */
const [hx, hy] = bez(TIP), [htx, hty] = tangent(TIP);
const hw = widthAt(TIP) * 0.78, hl = widthAt(TIP) * 0.86;
const headPath = `M ${pt([hx - hty * hw, hy + htx * hw])}
  L ${pt([hx + htx * hl, hy + hty * hl])}
  L ${pt([hx + hty * hw, hy - htx * hw])} Z`;

const arrow = `
  <defs>
    <linearGradient id="g" x1="1555" y1="300" x2="625" y2="430" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#e6dce9"/>
      <stop offset="0.55" stop-color="#8e6299"/>
      <stop offset="1" stop-color="#784e84"/>
    </linearGradient>
  </defs>
  <path d="${bandPath}" fill="url(#g)"/>
  <path d="${headPath}" fill="#784e84"/>`;

/* ── 人：極簡剪影，只為了鎖大小與位置 ─────────────────────── */
const R = (x, y, w, h, r, f) =>
  `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${r.toFixed(1)}" fill="${f || BODY}" stroke="${INK}" stroke-width="2"/>`;

const stand = (cx, base, h) => {
  const headR = h * 0.105, headY = base - h + headR, neck = headY + headR;
  const hip = base - h * 0.44, bw = h * 0.24;
  return `
    <circle cx="${cx.toFixed(1)}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${R(cx - bw / 2, neck, bw, hip - neck, bw * 0.3)}
    ${R(cx - bw * 0.78, neck + h * 0.02, bw * 0.24, h * 0.30, bw * 0.12)}
    ${R(cx + bw * 0.54, neck + h * 0.02, bw * 0.24, h * 0.30, bw * 0.12)}
    ${R(cx - bw * 0.46, hip, bw * 0.38, base - hip, bw * 0.15)}
    ${R(cx + bw * 0.08, hip, bw * 0.38, base - hip, bw * 0.15)}`;
};

const crawl = (cx0, base, h) => {
  const hr = h * 0.24, tx = cx0 - h * 0.20, tw = h * 0.62;
  const ty = base - h * 0.66, th = h * 0.42;
  const limb = (x, back) => R(x, base - h * 0.32, h * 0.13, h * 0.32, h * 0.055, back ? SHADE : BODY);
  return `
    ${limb(cx0 - h * 0.05, true)}${limb(cx0 + h * 0.33, true)}
    ${R(tx, ty, tw, th, h * 0.15)}
    <circle cx="${(cx0 - h * 0.25).toFixed(1)}" cy="${(base - h + hr).toFixed(1)}" r="${hr.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${limb(cx0 - h * 0.16, false)}${limb(cx0 + h * 0.22, false)}`;
};

/* 坐著的病患：面向左（面向醫師），所以椅背在他右邊 */
const seated = (cx, base, h) => {
  const seat = base - h * 0.30, bw = h * 0.24, headR = h * 0.105;
  const headY = seat - h * 0.44 + headR;
  return `
    ${R(cx + h * 0.205, seat - h * 0.42, h * 0.055, h * 0.44, h * 0.02, SHADE)}
    ${R(cx - h * 0.18, seat, h * 0.44, h * 0.055, h * 0.02, SHADE)}
    ${R(cx - h * 0.16, seat + h * 0.055, h * 0.045, h * 0.25, h * 0.015, SHADE)}
    ${R(cx + h * 0.195, seat + h * 0.055, h * 0.045, h * 0.25, h * 0.015, SHADE)}
    <circle cx="${cx.toFixed(1)}" cy="${headY.toFixed(1)}" r="${headR.toFixed(1)}" fill="${BODY}" stroke="${INK}" stroke-width="2"/>
    ${R(cx - bw / 2, headY + headR, bw, seat - headY - headR, bw * 0.3)}
    ${R(cx - h * 0.22, seat - h * 0.055, h * 0.24, h * 0.085, h * 0.04)}
    ${R(cx - h * 0.245, seat + h * 0.03, h * 0.085, h * 0.27, h * 0.04)}`;
};

/* 五個階段沿著箭頭放：t 大 ＝ 靠近箭頭尖 ＝ 年紀大。腳踩在中線上。 */
const FLOOR = 640;
const STAGES = [
  { t: 0.09, h: 92,  crawl: true },   // 嬰兒（爬）
  { t: 0.30, h: 152 },                // 幼兒園
  { t: 0.50, h: 198 },                // 小學
  { t: 0.68, h: 242 },                // 國中
  { t: 0.84, h: 278 },                // 高中
];
const stages = STAGES.map((s) => {
  const [x, y] = bez(s.t);
  const base = y + widthAt(s.t) * 0.30;        // 腳踩在帶子的下緣，不是站在正中間
                                               // ⚠ 第一版寫成 y + tx*w（tx 往左是負的），整組被推到帶子上面去浮著
  return s.crawl ? crawl(x, base, s.h) : stand(x, base, s.h);
}).join('\n');

/* 兩個大人：畫面裡最大的人（使用者：醫師和患者占的比例太少） */
const adults = seated(470, FLOOR, 470) + stand(190, FLOOR, 505);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f6f1e6"/>
  ${arrow}
  ${stages}
  ${adults}
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
await pg.screenshot({ path: resolve(here, 'growth-arrow-ref.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字 —— 參考圖不可以有任何字元');
console.log('寫好了：drafts/wisdom-eruption/growth-arrow-ref.png　' + W + '×' + H);
