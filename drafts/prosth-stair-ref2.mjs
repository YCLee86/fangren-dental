/* drafts/prosth-stair-ref-ribbon.png —— 弧形（緞帶）階梯的構圖參考（2026-08-25 第七輪）
   使用者退回前兩版：「為了強調樓梯，人都變小了，而且看起來好累喔。
   我傳給你的之前那個螺旋樓梯是很有趣味的。」
   → 反過來做：**人是主角、階梯是舞台**。階梯是一條**捲上去的緞帶**（弧線，不是鋸齒），
     踏面少而寬，人物大（最前面那組約畫面高 40%），姿態各不相同。
   跑法：node drafts/prosth-stair-ref2.mjs                                        */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TOP = ['#8aa7c8', '#6b8db3', '#4f759c', '#3a6390'];
const SIDE = ['#5f7fa4', '#4a6d92', '#3a5c80', '#294b6e'];
const DEEP = '#182f4b', BG = '#f3ece0', INK = '#4a463f';

const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t, a = u ** 3, b = 3 * u * u * t, c = 3 * u * t * t, d = t ** 3;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};
const A = [[1010, 566], [830, 592], [520, 520], [386, 430]];
const B = [[386, 430], [300, 330], [600, 244], [886, 286]];
const at = t => t < 0.5 ? bez(...A, t / 0.5) : bez(...B, (t - 0.5) / 0.5);
const width = t => 132 - 58 * t;                       // 由近而遠收窄

const S = 400, pts = [];
for (let i = 0; i <= S; i++) {
  const t = i / S, [x, y] = at(t);
  const [x2, y2] = at(Math.min(1, t + 0.004));
  const a = Math.atan2(y2 - y, x2 - x);
  const nx = -Math.sin(a), ny = Math.cos(a), w = width(t) / 2;
  pts.push({ t, x, y, nx, ny, w, a });
}
const band = (i0, i1, fill, dy) => {
  const L = [], R = [];
  for (let i = i0; i <= i1; i++) { const p = pts[i];
    L.push(`${(p.x + p.nx * p.w).toFixed(1)},${(p.y + p.ny * p.w + dy).toFixed(1)}`);
    R.unshift(`${(p.x - p.nx * p.w).toFixed(1)},${(p.y - p.ny * p.w + dy).toFixed(1)}`); }
  return `<polygon points="${L.concat(R).join(' ')}" fill="${fill}" stroke="${DEEP}" stroke-width="3.5" stroke-linejoin="round"/>`;
};

let s = `<rect width="1200" height="628" fill="${BG}"/>`;
s += `<defs><radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient></defs><ellipse cx="900" cy="300" rx="240" ry="180" fill="url(#g)"/>`;

/* 先畫厚度（往下偏移的暗面），再畫踏面；四段各一色 */
for (let k = 3; k >= 0; k--) {
  const i0 = Math.floor(S * k / 4), i1 = Math.min(S, Math.floor(S * (k + 1) / 4) + 2);
  s += band(i0, i1, SIDE[k], 26);
}
for (let k = 3; k >= 0; k--) {
  const i0 = Math.floor(S * k / 4), i1 = Math.min(S, Math.floor(S * (k + 1) / 4) + 2);
  s += band(i0, i1, TOP[k], 0);
}
/* 踏面分隔線 ＝ 一階一條，跨過整條帶 */
for (let i = 12; i < S - 6; i += 26) {
  const p = pts[i];
  s += `<line x1="${(p.x + p.nx * p.w).toFixed(1)}" y1="${(p.y + p.ny * p.w).toFixed(1)}"
        x2="${(p.x - p.nx * p.w).toFixed(1)}" y2="${(p.y - p.ny * p.w).toFixed(1)}"
        stroke="${DEEP}" stroke-width="3" opacity=".85"/>`;
}
/* 頂端的大平台 */
{
  const p = pts[S];
  s += `<ellipse cx="${p.x + 52}" cy="${p.y + 10}" rx="116" ry="32" fill="${TOP[3]}" stroke="${DEEP}" stroke-width="3.5"/>`;
}

const person = (cx, footY, h, lean = 0) => {
  const hr = h * 0.145, cy = footY - h + hr;
  return `<g transform="rotate(${lean} ${cx} ${footY})">` +
    `<circle cx="${cx}" cy="${cy}" r="${hr}" fill="${INK}"/>` +
    `<path d="M${cx - h * 0.17} ${footY} L${cx - h * 0.14} ${footY - h * 0.6} Q${cx} ${footY - h * 0.8} ${cx + h * 0.14} ${footY - h * 0.6} L${cx + h * 0.17} ${footY} Z" fill="${INK}"/></g>`;
};
const P = t => pts[Math.round(t * S)];
let q = P(0.02); s += person(q.x + 34, q.y + 8, 248);
q = P(0.05);     s += person(q.x - 44, q.y + 8, 258);
q = P(0.34);     s += person(q.x + 6, q.y + 6, 224, -4);
q = P(0.60);     s += person(q.x, q.y + 4, 186);
q = P(0.82);     s += person(q.x - 8, q.y + 4, 158);
q = P(1.0);      s += person(q.x + 60, q.y + 10, 146);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628">${s}</svg>`;
writeFileSync('/tmp/ribbon.html', `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>${svg}`);
const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1200,628',
  '--screenshot=drafts/prosth-stair-ref-ribbon.png', '/tmp/ribbon.html'], { stdio: 'ignore' });
console.log('→ drafts/prosth-stair-ref-ribbon.png');
