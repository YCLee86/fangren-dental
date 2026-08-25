/* drafts/prosth-flow-shapes.png —— 四種流程圖骨架的對照圖（2026-08-25 第五輪）
   使用者給了臨床的四個階段（去感染／手術／重建／維護），並指出
   「流程圖不是真的循環，不然病患會以為怎麼沒有終點」。
   這一張是**給使用者挑的對照圖**（所以可以有 A B C D 的標籤），
   不是餵給生成模型的參考圖 —— 選定之後再單獨出一張乾淨的。
   跑法：node drafts/prosth-flow-shapes.mjs                                     */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const C = ['#7d9cc0', '#5f83ab', '#476e97', '#335b8b'];
const DEEP = '#182f4b', PAPER = '#f3ece0', FAINT = '#9db2c7';
const F = 'Helvetica, Arial, sans-serif';

const num = (x, y, n, s = 44) =>
  `<text x="${x}" y="${y + s * 0.36}" font-family="${F}" font-size="${s}" font-weight="700" fill="#fff" text-anchor="middle">${n}</text>`;
const back = d => `<path d="${d}" stroke="${FAINT}" stroke-width="5" fill="none" stroke-dasharray="14 11" stroke-linecap="round"/>`;
const tip = (x, y, dir = 'up') => {
  const p = dir === 'up' ? `M${x - 13} ${y + 20} L${x} ${y} L${x + 13} ${y + 20}`
                         : `M${x - 20} ${y - 13} L${x} ${y} L${x - 20} ${y + 13}`;
  return `<path d="${p} z" fill="${FAINT}"/>`;
};

/* A. 階梯 ＋ 最後一階是平台 */
function stair(ox, oy) {
  let s = '', W = 108, H = 74, DX = 132, DY = 62;
  for (let i = 0; i < 4; i++) {
    const w = i === 3 ? 186 : W;
    const x = ox + 40 + i * DX, y = oy + 300 - i * DY;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${H}" rx="12" fill="${C[i]}" stroke="${DEEP}" stroke-width="4"/>`;
    s += num(x + (i === 3 ? 44 : w / 2), y + H / 2, i + 1);
    if (i < 3) {
      const ax = x + w + 4, ay = y + H / 2;
      s += `<path d="M${ax} ${ay} h${DX - w - 22}" stroke="${DEEP}" stroke-width="8"/>`;
      s += `<path d="M${ax + DX - w - 26} ${ay - 15} L${ax + DX - w - 4} ${ay} L${ax + DX - w - 26} ${ay + 15} z" fill="${DEEP}"/>`;
    }
  }
  const px = ox + 40 + 3 * DX + 132, py = oy + 300 - 3 * DY + H;
  const bx = ox + 40 + DX + W / 2;
  s += back(`M${px} ${py + 10} C ${px} ${oy + 430}, ${bx} ${oy + 430}, ${bx} ${oy + 300 - DY + H + 26}`);
  s += tip(bx, oy + 300 - DY + H + 6);
  return s;
}

/* B. 路線圖：一條路 ＋ 四個站，終點是雙圈 */
function road(ox, oy) {
  const pts = [[ox + 80, oy + 330], [ox + 230, oy + 300], [ox + 400, oy + 200], [ox + 550, oy + 160]];
  const d = `M${pts[0][0]} ${pts[0][1]} C ${ox + 150} ${oy + 336}, ${ox + 170} ${oy + 306}, ${pts[1][0]} ${pts[1][1]}`
          + ` C ${ox + 310} ${oy + 292}, ${ox + 330} ${oy + 208}, ${pts[2][0]} ${pts[2][1]}`
          + ` C ${ox + 460} ${oy + 194}, ${ox + 490} ${oy + 164}, ${pts[3][0]} ${pts[3][1]}`;
  let s = `<path d="${d}" stroke="#d9cfc0" stroke-width="36" fill="none" stroke-linecap="round"/>`;
  pts.forEach(([x, y], i) => {
    if (i === 3) s += `<circle cx="${x}" cy="${y}" r="52" fill="none" stroke="${DEEP}" stroke-width="4"/>`;
    s += `<circle cx="${x}" cy="${y}" r="38" fill="${C[i]}" stroke="${DEEP}" stroke-width="4"/>`;
    s += num(x, y, i + 1);
  });
  s += back(`M${pts[3][0]} ${pts[3][1] + 66} C ${pts[3][0]} ${oy + 420}, ${pts[1][0]} ${oy + 430}, ${pts[1][0]} ${pts[1][1] + 60}`);
  s += tip(pts[1][0], pts[1][1] + 44);
  return s;
}

/* C. 階段閘門：方框 ＋ 中間的菱形確認 ＋ 最後一段延伸的維護帶 */
function gate(ox, oy) {
  let s = '', W = 104, H = 82, DX = 148;
  for (let i = 0; i < 4; i++) {
    const x = ox + 46 + i * DX, y = oy + 210;
    if (i === 3) {
      s += `<path d="M${x} ${y} h190 a${H / 2} ${H / 2} 0 0 1 0 ${H} h-190 z" fill="${C[3]}" stroke="${DEEP}" stroke-width="4"/>`;
      s += num(x + 52, y + H / 2, 4);
      for (let k = 0; k < 3; k++)
        s += `<path d="M${x + 104 + k * 30} ${y + 24} l16 ${H / 2 - 24} l-16 ${H / 2 - 24}" stroke="#fff" stroke-width="5" fill="none" opacity=".75" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    }
    s += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="12" fill="${C[i]}" stroke="${DEEP}" stroke-width="4"/>`;
    s += num(x + W / 2, y + H / 2, i + 1);
    const mx = x + W + (DX - W) / 2, my = y + H / 2;
    s += `<path d="M${mx} ${my - 31} L${mx + 31} ${my} L${mx} ${my + 31} L${mx - 31} ${my} z" fill="${PAPER}" stroke="${DEEP}" stroke-width="4"/>`;
  }
  const bx = ox + 46 + DX + W / 2;
  s += back(`M${ox + 46 + 3 * DX + 120} ${oy + 210 + H + 10} C ${ox + 46 + 3 * DX + 120} ${oy + 380}, ${bx} ${oy + 380}, ${bx} ${oy + 210 + H + 26}`);
  s += tip(bx, oy + 210 + H + 6);
  return s;
}

/* D. 疊起來：地基在最下面，一層一層往上蓋 */
function stack(ox, oy) {
  let s = '';
  const cx = ox + 300, w0 = 400, dw = 62, H = 62, GAP = 10;
  for (let i = 0; i < 4; i++) {
    const w = w0 - i * dw, x = cx - w / 2, y = oy + 330 - i * (H + GAP);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${H}" rx="10" fill="${C[i]}" stroke="${DEEP}" stroke-width="4"/>`;
    s += num(cx, y + H / 2, i + 1);
  }
  const topY = oy + 330 - 3 * (H + GAP) + H / 2, y2 = oy + 330 - (H + GAP) + H / 2;
  const lx = cx - (w0 - 3 * dw) / 2 - 16, l2 = cx - (w0 - dw) / 2 - 16;
  s += back(`M${lx} ${topY} C ${lx - 120} ${topY}, ${l2 - 130} ${y2}, ${l2 - 26} ${y2}`);
  s += `<path d="M${l2 - 30} ${y2 - 14} L${l2 - 4} ${y2} L${l2 - 30} ${y2 + 14} z" fill="${FAINT}"/>`;
  return s;
}

const label = (x, y, t, sub) =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="34" font-weight="700" fill="${DEEP}">${t}</text>` +
  `<text x="${x + 40}" y="${y}" font-family="${F}" font-size="24" fill="#6b6a63">${sub}</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="960" viewBox="0 0 1400 960">
<rect width="1400" height="960" fill="${PAPER}"/>
${label(50, 70, 'A', '  stairs to a platform')}${stair(30, 30)}
${label(750, 70, 'B', '  road with a destination')}${road(730, 30)}
${label(50, 550, 'C', '  stage gates + maintenance band')}${gate(30, 470)}
${label(750, 550, 'D', '  foundation first, built upward')}${stack(730, 470)}
<path d="M700 40 V920" stroke="#ddd3c4" stroke-width="2"/>
<path d="M40 490 H1360" stroke="#ddd3c4" stroke-width="2"/>
</svg>`;
writeFileSync('/tmp/shapes.html', `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>${svg}`);
const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1400,960',
  '--screenshot=drafts/prosth-flow-shapes.png', '/tmp/shapes.html'], { stdio: 'ignore' });
console.log('→ drafts/prosth-flow-shapes.png');
