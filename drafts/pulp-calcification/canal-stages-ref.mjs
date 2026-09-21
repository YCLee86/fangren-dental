// 〈根管鈣化〉HERO 的參考圖 —— 同一顆牙、三個階段的剖面
//
// 用法：node drafts/pulp-calcification/canal-stages-ref.mjs
// 產出：drafts/pulp-calcification/canal-stages-ref.png（1600×900）
//
// ⚠⚠ 為什麼要有這張圖：ILLUSTRATION.md 第十之一 ——「形狀不要用文字描述，用參考圖」。
//   上一篇同科的〈生物陶瓷〉，根管的分支用文字描述**連續失敗四輪**，改成給圖一次就中。
//   這一篇要講的形狀更難用文字講：「同一條管子愈來愈細、腔室愈來愈小、入口最後不見了」。
//
// ⚠⚠ 三件刻意的決定（照文章，不是照教科書）：
//  ① **管子是全長一起變細**，不是只有上半段。文章第五版把「鈣化多半從牙冠往根尖進行」
//     那句拿掉了（使用者更正：冠中段、末端一樣會鈣化）。這張圖不可以把那句畫回去。
//  ② **第三格的入口是「被蓋住」不是「不見」** —— 腔室頂多一層新的牙本質，
//     原本管口的位置留一個顏色略深的小凹，那正是文章說的「跟著那條比較暗的線找」。
//  ③ **一個字都沒有。** 參考圖上的字會被模型直接畫進成品（第十一節踩過三種形式）。
//     三格的年紀靠牙冠上的東西表示：小蛀點 → 補綴體 → 牙套的邊。
//
// ⚠ 畫法照 drafts/canal-ref.png：白牙、暖棕輪廓、奶油色骨頭帶斑點、粉紅牙齦、
//   牙髓是鮭魚粉。**這是結構圖不是插畫** —— 提示詞要明講「抄形狀，不要抄畫法」。

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 900;

/* ── 顏色（同 canal-ref.png 那一張） ───────────────────────── */
const INK   = '#4a3c33';   // 暖棕輪廓，不是純黑
const BONE  = '#efe6c9';
const SPECK = '#dccfa4';
const GUM   = '#f0c0c4';
const ENAM  = '#ffffff';
const PULP  = '#e79aa0';   // 還通著的牙髓／管腔
const NEW   = '#f2ead8';   // 新生的牙本質（比牙本體暖一點，看得出是後來長的）
const GHOST = '#d9cfc2';   // 原本管腔的位置（虛線，只在第二、三格）
const FILL  = '#b9bec4';   // 補綴體
const CROWN = '#dfd2b8';   // 牙套的邊

/* ── 幾何：一顆下顎大臼齒，兩支牙根 ────────────────────────
   cx 是那一格的中線，牙齦線固定在 y=340。三格完全同一個機位、
   同一個形狀 —— 只有管腔的粗細與牙冠上的東西在變（第七節第 2 條）。 */
const GUMY = 340;
const tooth = (cx) => `
  M ${cx-106} ${GUMY}
  C ${cx-104} ${GUMY-90} ${cx-98} ${GUMY-150} ${cx-84} ${GUMY-190}
  C ${cx-66} ${GUMY-238} ${cx-34} ${GUMY-258} ${cx} ${GUMY-258}
  C ${cx+34} ${GUMY-258} ${cx+66} ${GUMY-238} ${cx+84} ${GUMY-190}
  C ${cx+98} ${GUMY-150} ${cx+104} ${GUMY-90} ${cx+106} ${GUMY}
  C ${cx+104} ${GUMY+120} ${cx+92} ${GUMY+250} ${cx+62} ${GUMY+340}
  C ${cx+54} ${GUMY+364} ${cx+38} ${GUMY+364} ${cx+32} ${GUMY+340}
  C ${cx+18} ${GUMY+250} ${cx+14} ${GUMY+170} ${cx+13} ${GUMY+120}
  C ${cx+12} ${GUMY+100} ${cx-12} ${GUMY+100} ${cx-13} ${GUMY+120}
  C ${cx-14} ${GUMY+170} ${cx-18} ${GUMY+250} ${cx-32} ${GUMY+340}
  C ${cx-38} ${GUMY+364} ${cx-54} ${GUMY+364} ${cx-62} ${GUMY+340}
  C ${cx-92} ${GUMY+250} ${cx-104} ${GUMY+120} ${cx-106} ${GUMY} Z`;

/* 牙髓腔 ＋ 兩條根管，粗細由 k 控制（1 ＝ 年輕時的原寸）。
   ⚠ 兩個係數一起縮 —— 全長一起變細，不是只縮上面那一段（上面第 ① 條）。 */
const pulp = (cx, k) => {
  const cw = 58 * k;              // 腔室的半寬
  const ct = GUMY - 168;          // 腔室頂
  const cb = GUMY + 26;           // 腔室底（髓腔底）
  const rw = 13 * k;              // 根管在髓腔底的半寬
  const tw = 3.2 * k;             // 根管在根尖的半寬
  const tipY = GUMY + 336;
  const canal = (s) => `
    M ${cx + s*22 - s*rw} ${cb}
    C ${cx + s*26 - s*rw} ${cb+90} ${cx + s*40 - s*tw} ${cb+200} ${cx + s*47 - s*tw} ${tipY}
    L ${cx + s*47 + s*tw} ${tipY}
    C ${cx + s*40 + s*tw} ${cb+200} ${cx + s*26 + s*rw} ${cb+90} ${cx + s*22 + s*rw} ${cb} Z`;
  const chamber = `
    M ${cx-cw} ${cb}
    C ${cx-cw-4} ${ct+54} ${cx-cw*0.72} ${ct} ${cx-cw*0.34} ${ct+6}
    C ${cx-cw*0.12} ${ct+22} ${cx+cw*0.12} ${ct+22} ${cx+cw*0.34} ${ct+6}
    C ${cx+cw*0.72} ${ct} ${cx+cw+4} ${ct+54} ${cx+cw} ${cb} Z`;
  return chamber + canal(1) + canal(-1);
};

/* ── 三格 ──────────────────────────────────────────────── */
const speckles = (cx) => {
  let s = '', seed = cx;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 46; i++) {
    const x = cx - 250 + rnd() * 500, y = GUMY + 20 + rnd() * 470, r = 1.6 + rnd() * 5;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${SPECK}" opacity=".62"/>`;
  }
  return s;
};

const panel = (cx, stage) => {
  // stage 0：年輕　1：補過之後　2：現在（要做根管治療的這一顆）
  const k = [1, 0.62, 0.3][stage];
  let crownThing = '';
  if (stage === 0) {
    // 小蛀點：咬合面上一個淺的深色凹
    crownThing = `<path d="M ${cx-16} ${GUMY-252} q 16 -12 32 0 q -6 22 -16 22 q -10 0 -16 -22 Z" fill="#8c7b62" opacity=".85"/>`;
  } else if (stage === 1) {
    // 補綴體：咬合面上一塊灰的填補
    crownThing = `<path d="M ${cx-46} ${GUMY-250} q 46 -22 92 0 l -6 44 q -40 -16 -80 0 Z" fill="${FILL}" stroke="${INK}" stroke-width="3"/>`;
  } else {
    // 大面積的深補綴：咬合面幾乎整片，而且往下伸得很深（離腔室只剩一點）——
    // ⚠ 第一版畫成牙套，整頂蓋住腔室，就看不到這一格真正要看的東西了。
    crownThing = `<path d="M ${cx-56} ${GUMY-238} q 56 -26 112 0 l -8 50 q -18 32 -26 58 q -30 -13 -60 0 q -8 -26 -26 -58 Z"
      fill="${FILL}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`;
  }
  // 原本管腔的位置（第二、三格用虛線當對照，讓「變細」讀得出來）
  const ghost = stage === 0 ? '' :
    `<path d="${pulp(cx, 1)}" fill="none" stroke="${GHOST}" stroke-width="2.6"
       stroke-dasharray="9 9" fill-rule="evenodd" opacity=".9"/>`;
  // 第三格：管口被一層新生牙本質蓋住，原位置留一個略深的小凹
  const covered = stage === 2 ?
    `<ellipse cx="${cx-22}" cy="${GUMY+22}" rx="10" ry="4.6" fill="#b9a98e" opacity=".95"/>
     <ellipse cx="${cx+22}" cy="${GUMY+22}" rx="10" ry="4.6" fill="#b9a98e" opacity=".95"/>` : '';
  return `
    <g>
      <rect x="${cx-244}" y="${GUMY}" width="488" height="498" fill="${BONE}" rx="12"/>
      ${speckles(cx)}
      <rect x="${cx-244}" y="${GUMY-46}" width="488" height="52" fill="${GUM}" rx="8"/>
      <path d="${tooth(cx)}" fill="${ENAM}" stroke="${INK}" stroke-width="4.2" stroke-linejoin="round"/>
      <path d="${pulp(cx, 1)}" fill="${NEW}" fill-rule="evenodd"/>
      ${ghost}
      <path d="${pulp(cx, k)}" fill="${PULP}" fill-rule="evenodd"/>
      ${covered}
      ${crownThing}
    </g>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  ${panel(280, 0)}${panel(800, 1)}${panel(1320, 2)}
  <line x1="540" y1="40" x2="540" y2="860" stroke="#c9c2b6" stroke-width="2.5"/>
  <line x1="1060" y1="40" x2="1060" y2="860" stroke="#c9c2b6" stroke-width="2.5"/>
</svg>`;

/* ── 出圖（Chromium，做法同 tools/webp.mjs） ───────────────── */
const pwDir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const cands = [];
if (existsSync(pwDir)) for (const d of readdirSync(pwDir)) {
  cands.push(join(pwDir, d, 'chrome-linux', 'headless_shell'));   // ⚠ 挑 headless_shell（第九節第 18 條）
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
const dest = resolve(here, 'canal-stages-ref.png');
await pg.screenshot({ path: dest, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

/* ── 守門 ─────────────────────────────────────────────── */
if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字 —— 參考圖不可以有任何字元');
console.log('寫好了：drafts/pulp-calcification/canal-stages-ref.png　' + W + '×' + H);
