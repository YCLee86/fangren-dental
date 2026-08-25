/* drafts/prosth-stair-ref.png —— 階梯的「構圖參考圖」（2026-08-25 第六輪）
   使用者：「我喜歡階梯感，這個階梯也可以稍微有點旋轉的感覺，每隔幾階就有人在那邊
   加油打氣、支持，可以是醫療人員也可以是家人，然後要治療的病患正在一步一步往上往前走，
   如果年紀大一點，可能有人牽著或扶著一起走。」
   ⚠ 這張只給**階梯的形狀、四段的分界、平台在哪、人站在哪、多大**。
     風格另外附 style-ref-*.jpg；人物姿勢由提示詞寫。
   ⚠ 畫布就是分享卡的 1200×628，位置可以直接對上。
   跑法：node drafts/prosth-stair-ref.mjs                                            */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const C = ['#7d9cc0', '#5f83ab', '#476e97', '#335b8b'];
const DEEP = '#182f4b', BG = '#f3ece0', SKIN = '#4a463f';

/* 四段階梯：每段的階數、踏面寬、級高（段與段的比例不同 ＝ 蜿蜒感），段末有小平台 */
const SEGS = [
  { n: 3, tread: 68, riser: 18, plat: 90 },    // 緩（起步）
  { n: 3, tread: 62, riser: 26, plat: 80 },    // 陡
  { n: 3, tread: 50, riser: 22, plat: 70 },    // 緩
  { n: 3, tread: 40, riser: 28, plat: 170 },   // 陡 → 最後是大平台（終點）
];

let x = 90, y = 560;
const outline = [`M${x} ${y}`];
const segRects = [], platPts = [];
for (let s2 = 0; s2 < SEGS.length; s2++) {
  const { n, tread, riser, plat } = SEGS[s2];
  const x0 = x;
  for (let i = 0; i < n; i++) { y -= riser; outline.push(`V${y}`); x += tread; outline.push(`H${x}`); }
  x += plat; outline.push(`H${x}`);
  platPts.push([x - plat / 2, y]);
  segRects.push({ x0, x1: x, c: C[s2] });
}
const topX = x, topY = y;
outline.push(`V600 H90 Z`);

let s = `<rect width="1200" height="628" fill="${BG}"/>`;
s += `<defs><clipPath id="st"><path d="${outline.join(' ')}"/></clipPath>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient></defs>`;
s += `<ellipse cx="${topX - 90}" cy="${topY - 60}" rx="240" ry="180" fill="url(#glow)"/>`;
s += `<g clip-path="url(#st)">`;
for (const r of segRects) s += `<rect x="${r.x0 - 4}" y="0" width="${r.x1 - r.x0 + 8}" height="628" fill="${r.c}"/>`;
s += `</g>`;
s += `<path d="${outline.join(' ')}" fill="none" stroke="${DEEP}" stroke-width="5" stroke-linejoin="round"/>`;

const person = (cx, footY, h, dark = SKIN) => {
  const headR = h * 0.145;
  return `<circle cx="${cx}" cy="${footY - h + headR}" r="${headR}" fill="${dark}"/>` +
         `<path d="M${cx - h * 0.16} ${footY} L${cx - h * 0.13} ${footY - h * 0.62} Q${cx} ${footY - h * 0.79} ${cx + h * 0.13} ${footY - h * 0.62} L${cx + h * 0.16} ${footY} Z" fill="${dark}"/>`;
};
/* 近大遠小：越往上越小 ＝ 縱深，也讓頂端的人頭遠低於頂 17% 那條線 */
s += person(120, 560, 226);                          // 長輩（被牽著）
s += person(196, 560, 238);                          // 牽他的家人
s += person(platPts[0][0], platPts[0][1], 205);      // 第一個平台：加油的人
s += person(platPts[1][0] - 6, platPts[1][1], 186);  // 第二個平台：正在往上走的病患（主角）
s += person(platPts[2][0], platPts[2][1], 150);      // 第三個平台：加油的人
s += person(topX - 118, topY, 122);                  // 頂端平台：已經走完的人

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628">${s}</svg>`;
writeFileSync('/tmp/stair.html', `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>${svg}`);
const bin = ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
             '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => existsSync(p));
execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1200,628',
  '--screenshot=drafts/prosth-stair-ref.png', '/tmp/stair.html'], { stdio: 'ignore' });
console.log('→ drafts/prosth-stair-ref.png');
