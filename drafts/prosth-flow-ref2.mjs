/* 產生兩張流程圖的形狀參考圖（2026-08-25 第四輪，使用者：「流程圖太簡陋」＋ 附 PDCA／流程圖截圖）
     drafts/prosth-flow-ref-linear.png  ← 橫向流程：四個色塊 ＋ 粗箭頭 ＋ 繞回來的弧
     drafts/prosth-flow-ref-cycle.png   ← 環形循環：四段粗弧箭頭（他給的 PDCA 那一種）
   ⚠ 顏色是植牙的主題色四階（套色 #335b8b 往亮處推），使用者指定「要套植牙假牙標籤主題色」。
   ⚠ 圖上只有 1 2 3 4，沒有任何文字 —— 療程分幾階段還沒問到診所，寫了就是編。
   跑法：node drafts/prosth-flow-ref2.mjs                                                */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const C = ['#7d9cc0', '#5f83ab', '#476e97', '#335b8b'];   // 主題色四階（最深 = 套色）
const DEEP = '#182f4b';                                    // 深階，箭頭用
const PAPER = '#f3ece0';

/* ---------- 1. 橫向流程 ---------- */
function linear() {
  const W = 200, H = 132, GAP = 62, Y = 232, X0 = 96;
  let s = `<rect width="1200" height="620" fill="${PAPER}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = X0 + i * (W + GAP);
    s += `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="26" fill="${C[i]}" stroke="${DEEP}" stroke-width="6"/>`;
    s += `<text x="${x + W / 2}" y="${Y + H / 2 + 28}" font-family="Helvetica, Arial, sans-serif" font-size="78" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
    if (i < 3) {
      const a = x + W + 10, b = x + W + GAP - 10;
      s += `<path d="M${a} ${Y + H / 2} H${b - 22}" stroke="${DEEP}" stroke-width="13" fill="none"/>`;
      s += `<path d="M${b - 30} ${Y + H / 2 - 24} L${b} ${Y + H / 2} L${b - 30} ${Y + H / 2 + 24} z" fill="${DEEP}"/>`;
    }
  }
  /* 第 4 格繞回第 2 格 */
  const x4 = X0 + 3 * (W + GAP) + W / 2, x2 = X0 + (W + GAP) + W / 2, yB = Y + H;
  s += `<path d="M${x4} ${yB + 16} C ${x4} ${yB + 150}, ${x2} ${yB + 150}, ${x2} ${yB + 40}"
        stroke="${DEEP}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${x2 - 26} ${yB + 46} L${x2} ${yB + 6} L${x2 + 26} ${yB + 46} z" fill="${DEEP}"/>`;
  return s;
}

/* ---------- 2. 環形循環 ---------- */
function cycle() {
  const cx = 600, cy = 310, R = 226, r = 126;
  const P = (a, rad) => [cx + rad * Math.cos(a * Math.PI / 180), cy + rad * Math.sin(a * Math.PI / 180)];
  let s = `<rect width="1200" height="620" fill="${PAPER}"/>`;
  for (let i = 0; i < 4; i++) {
    const a0 = i * 90 - 84, a1 = i * 90 - 22, tip = i * 90 - 4;
    const [ox0, oy0] = P(a0, R), [ox1, oy1] = P(a1, R);
    const [ix0, iy0] = P(a0, r), [ix1, iy1] = P(a1, r);
    const [bx, by] = P(a1, R + 26), [tx, ty] = P(tip, (R + r) / 2), [cx2, cy2] = P(a1, r - 26);
    s += `<path d="M${ox0} ${oy0} A${R} ${R} 0 0 1 ${ox1} ${oy1} L${bx} ${by} L${tx} ${ty} L${cx2} ${cy2} L${ix1} ${iy1} A${r} ${r} 0 0 0 ${ix0} ${iy0} Z"
          fill="${C[i]}" stroke="${DEEP}" stroke-width="6" stroke-linejoin="round"/>`;
    const [nx, ny] = P((a0 + a1) / 2, (R + r) / 2);
    s += `<text x="${nx}" y="${ny + 26}" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff" text-anchor="middle">${i + 1}</text>`;
  }
  return s;
}

const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
if (!bin) throw new Error('找不到 Chromium');
if (bin.endsWith('chrome')) console.warn('⚠ 用到完整版 chrome，畫面會少 87px（CLAUDE.md 第九節第 18 條）');

for (const [name, body] of [['linear', linear()], ['cycle', cycle()]]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="620" viewBox="0 0 1200 620">${body}</svg>`;
  writeFileSync(`/tmp/flow-${name}.html`, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>${svg}`);
  execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', '--window-size=1200,620',
    `--screenshot=drafts/prosth-flow-ref-${name}.png`, `/tmp/flow-${name}.html`], { stdio: 'ignore' });
  console.log(`→ drafts/prosth-flow-ref-${name}.png`);
}
