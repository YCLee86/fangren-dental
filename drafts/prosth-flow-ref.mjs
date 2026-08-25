/* 產生 drafts/prosth-flow-ref.png —— 治療流程圖的「形狀參考圖」。
   使用者 2026-08-25：「像那个图比如说有箭头啊或是有数字的概念，這樣比較知道有流的感覺，
   像一般經營管理的 PDCA，一個步驟一個步驟、甚至循環回來。」
   ⚠ 這推翻了 ILLUSTRATION.md 第十一節硬規格 6 的一半（箭頭、數字），是使用者指定的。
   限度：只有四個大圓 ＋ 1234 ＋ 粗箭頭 ＋ 一條繞回來的弧，**沒有任何文字**。
   ⚠ 給生成模型看形狀用，不是風格參考。跑法：node drafts/prosth-flow-ref.mjs      */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const INK = '#4a463f', PAPER = '#f3ece0';
const R = 78, CY = 250, X0 = 150, DX = 300;

let s = '';
/* 四個大圓 ＋ 圓裡的數字 */
for (let i = 0; i < 4; i++) {
  const cx = X0 + i * DX;
  s += `<circle cx="${cx}" cy="${CY}" r="${R}" fill="${PAPER}" stroke="${INK}" stroke-width="7"/>`;
  s += `<text x="${cx}" y="${CY + 30}" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="${INK}" text-anchor="middle">${i + 1}</text>`;
  /* 圓之間的粗箭頭 */
  if (i < 3) {
    const a = cx + R + 26, b = cx + DX - R - 26;
    s += `<path d="M${a} ${CY} H${b - 26}" stroke="${INK}" stroke-width="11" fill="none"/>`;
    s += `<path d="M${b - 34} ${CY - 26} L${b} ${CY} L${b - 34} ${CY + 26} z" fill="${INK}"/>`;
  }
}
/* 最後一格繞回第一格的弧（循環：該調整就調整） */
const xEnd = X0 + 3 * DX, xStart = X0;
s += `<path d="M${xEnd} ${CY + R + 20} C ${xEnd} ${CY + 260}, ${xStart} ${CY + 260}, ${xStart + 34} ${CY + R + 34}"
      stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
s += `<path d="M${xStart + 8} ${CY + R + 6} L${xStart + 62} ${CY + R + 24} L${xStart + 20} ${CY + R + 62} z" fill="${INK}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="620" viewBox="0 0 1200 620">
<rect width="1200" height="620" fill="#ffffff"/>${s}</svg>`;
writeFileSync('/tmp/prosth-flow-ref.html', `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style>${svg}`);
const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
if (!bin) throw new Error('找不到 Chromium');
if (bin.endsWith('chrome')) console.warn('⚠ 用到完整版 chrome，畫面會少 87px（CLAUDE.md 第九節第 18 條）');
execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1200,620',
  '--screenshot=drafts/prosth-flow-ref.png', '/tmp/prosth-flow-ref.html'], { stdio: 'ignore' });
console.log('→ drafts/prosth-flow-ref.png');
