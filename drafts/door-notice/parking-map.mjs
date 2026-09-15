// 周邊路邊停車格的地圖 —— 拿站上那張簡易地圖當底，把格子畫在路旁。
//
//   node drafts/door-notice/parking-map.mjs   →  drafts/door-notice/parking-survey-map.png
//
// ⚠⚠ 底圖是 index.html 的 .map-svg **本人**（開那一頁、把格子注進去再截圖），
//    所以站上的地圖改了這張圖會跟著改 —— 街廓、路名、三塊停車場、診所圖釘
//    一個座標都不在這一支裡面。
// ⚠⚠ 格號的唯一出處是 parking-survey.json；這一支只有「畫在哪裡」。
//    兩邊對不上就 throw（見底下那道守門）——不擋的話，清查資料改了圖還是舊的，
//    而畫面完全正常。
// ⚠ 顏色一個都沒新增：停車格 --map-park #365685、卸貨區 --ink-soft #5c5f57。
// ⚠ 容器裡要用 headless_shell，完整版 chrome 會少畫 87px（CLAUDE.md 第九節第 18 條）。
// ⚠ 永安路東側那九格的先後順序還沒現地確認，圖上是由北往南 010→002 的推定畫法。

import { readFileSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;

// 顏色一律取站上既有的變數，不新增顏色（PALETTE.md）
const BLUE = '#365685';   // --map-park（路牌藍）＝ 站上「點到的停車場」那一支
const GREY = '#5c5f57';   // --ink-soft ＝ 裝卸貨車專用區
const SOFT = '#8b8f89';   // 號碼還沒讀到的那幾格

// 道路走廊（從 index.html 的街廓 rect 反推）
//   永樂街 x324–354  永安路 x455–487  文化路 y21–59  大同路 y403–441
const W = 11, L = 20;

// 直的格子：x = 矩形左緣, y = 上緣, lab = 號碼, side = 號碼擺哪一邊
const V = (x, y, n, side, dim) => ({ t: 'v', x, y, n, side, dim });
const H = (x, y, n, side, dim) => ({ t: 'h', x, y, n, side, dim });

const BAYS = [
  // 永樂街・東側（貼東緣 354）
  V(343, 196, '002', 'e'),
  V(343, 232, '001', 'e'),
  // 永樂街・西側＝診所這一側（貼西緣 324）
  V(324, 282, '005', 'w'),
  V(324, 320, '004', 'w'),
  V(324, 372, '003', 'w'),
  // 永安路・東側（貼東緣 487），文化路→大同路那一段，九格
  ...['010','009','008','007','006','005','004','003','002']
      .map((n, i) => V(476, 118 + i * 27, n, 'e', n === '009' || n === '004')),
  // 永安路・西側（貼西緣 455）
  V(456, 118, '013', 'w'),
  V(456, 458, '012', 'w'),
];
const LOAD = V(456, 80, '卸貨', 'w');          // 郵局裝卸貨車專用區，靠文化路那一頭
const HBAYS = [
  H(226, 22, '039', 'n'),                      // 文化路北側
  H(256, 22, '040', 'n'),
  H(252, 404, '001', 'n'),                     // 大同路北側
];


// ── 守門：圖上畫的格號要和 parking-survey.json 對得起來 ────────────────
{
  const d = JSON.parse(readFileSync(new URL('./parking-survey.json', import.meta.url), 'utf8'));
  const 清查 = new Set();
  for (const st of d['街'])
    for (const b of st['停車格'] || [])
      if (b['網站地圖範圍內'] !== false)
        清查.add(st['路名'].replace(/（.*/, '') + '/' + b['號'].replace(/（.*/, ''));
  const 圖上 = new Set([
    ...BAYS.filter(o => o.x < 400).map(o => '永樂街/' + o.n),
    ...BAYS.filter(o => o.x >= 400).map(o => '永安路/' + o.n),
    ...HBAYS.slice(0, 2).map(o => '文化路/' + o.n),
    '大同路/' + HBAYS[2].n,
  ]);
  const 少 = [...清查].filter(k => !圖上.has(k));
  const 多 = [...圖上].filter(k => !清查.has(k));
  if (少.length || 多.length)
    throw new Error('停車格對不上 parking-survey.json —— 圖上少了 [' + 少 + ']、多了 [' + 多 + ']');
}

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await b.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 });
await p.goto('file:///home/user/fangren-dental/index.html', { waitUntil: 'load' });
await p.waitForTimeout(1200);

await p.evaluate(({ BAYS, LOAD, HBAYS, BLUE, GREY, SOFT, W, L }) => {
  const svg = document.querySelector('svg.map-svg');
  const NS = 'http://www.w3.org/2000/svg';

  // 圖上原本的東西：路線、牌子、亮起來的停車場 —— 這一張圖不需要
  svg.querySelectorAll('.routes, .rl-body, .rl-pin, .rl-nm, .rl-d, .rl-ul').forEach(el => el.remove());
  svg.querySelectorAll('.lot').forEach(el => el.classList.remove('on'));
  svg.querySelectorAll('.dim').forEach(el => el.classList.remove('dim'));

  // 兩條直街的名字往南挪，讓出停車格那幾段
  const move = (x, y) => {
    const t = [...svg.querySelectorAll('text.lbl')]
      .find(e => e.getAttribute('x') === String(x));
    if (!t) return;
    t.setAttribute('y', String(y));
    [...t.querySelectorAll('tspan')].forEach((s, i) => {
      s.setAttribute('x', String(x));
      if (i) s.setAttribute('dy', '26');
    });
  };
  move(339, 462);   // 永樂街 → 大同路與中華路之間
  move(471, 505);   // 永安路 → 再往南，讓開 012

  const g = document.createElementNS(NS, 'g');
  g.setAttribute('id', 'pbays');

  const rect = (x, y, w, h, fill) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('rx', 2.5);
    r.setAttribute('fill', fill);
    r.setAttribute('stroke', '#f4f4f5');
    r.setAttribute('stroke-width', 1.2);
    g.appendChild(r);
  };
  const label = (x, y, s, anchor, fill, size) => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('text-anchor', anchor);
    t.setAttribute('fill', fill);
    t.setAttribute('font-size', size || 13);
    t.setAttribute('font-weight', '600');
    t.setAttribute('letter-spacing', '.02em');
    t.textContent = s;
    g.appendChild(t);
  };

  const drawV = (o, fill) => {
    rect(o.x, o.y, W, L, fill);
    const cy = o.y + L / 2 + 4.5;
    if (o.side === 'e') label(o.x + W + 6, cy, o.n, 'start', o.dim ? SOFT : '#2a2c27');
    else label(o.x - 6, cy, o.n, 'end', o.dim ? SOFT : '#2a2c27');
  };
  const drawH = (o, fill) => {
    rect(o.x, o.y, L, W, fill);
    label(o.x + L / 2, o.y - 5, o.n, 'middle', '#2a2c27', 12);
  };

  BAYS.forEach(o => drawV(o, BLUE));
  drawV(LOAD, GREY);
  HBAYS.forEach(o => drawH(o, BLUE));

  svg.querySelector('#map-clip').appendChild(g);

  // 只把地圖那張圖拉出來排版，不要頁首與那顆晶片
  const fig = svg.closest('figure') || svg.parentElement;
  const box = document.createElement('div');
  box.id = 'shotbox';
  box.style.cssText = 'width:1000px;padding:18px;background:#e2e5e6;font:14px/1.7 "Noto Sans TC",system-ui,sans-serif;color:#2a2c27';
  document.body.prepend(box);
  const h = document.createElement('div');
  h.style.cssText = 'font-size:19px;font-weight:700;padding:0 4px 12px';
  h.textContent = '芳仁牙醫診所周邊・路邊停車格現地清查';
  box.appendChild(h);
  box.appendChild(svg);
  svg.style.cssText = 'width:100%;height:auto;display:block';

  const lg = document.createElement('div');
  lg.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 22px;padding:12px 4px 0;font-size:13.5px';
  lg.innerHTML =
    '<span><i style="display:inline-block;width:11px;height:20px;border-radius:2.5px;background:' + BLUE + ';vertical-align:-6px;margin-right:6px"></i>路邊停車格（號碼為格位編號）</span>' +
    '<span><i style="display:inline-block;width:11px;height:20px;border-radius:2.5px;background:' + GREY + ';vertical-align:-6px;margin-right:6px"></i>裝卸貨車專用區（郵局門口）</span>' +
    '<span style="color:' + SOFT + '">淡色號碼 ＝ 現場還沒讀到</span>';
  box.appendChild(lg);

  const note = document.createElement('div');
  note.style.cssText = 'padding:10px 4px 0;font-size:12.5px;color:#5c5f57';
  note.innerHTML =
    '永樂街 5 格、文化路北側 2 格（039 · 040）、大同路北側 1 格、永安路 11 格（東側 9 ＋ 西側 013 · 012），另有郵局門口裝卸貨車專用區 1 格。<br>' +
    '平和街、平和街33巷、文化路南側、文化路往東、大同路往西過平和街與往東到永安路 —— 現地確認沒有汽車停車格。<br>' +
    '⚠ 永安路東側那九格的先後順序還沒確認（圖上是由北往南 010→002 的推定畫法）；另有一格 011 現場還沒找到，圖上沒有畫。';
  box.appendChild(note);

  document.querySelectorAll('body > *:not(#shotbox)').forEach(e => e.style.display = 'none');
}, { BAYS, LOAD, HBAYS, BLUE, GREY, SOFT, W, L });

await p.waitForTimeout(400);
await p.locator('#shotbox').screenshot({ path: new URL('./parking-survey-map.png', import.meta.url).pathname });
await b.close();
console.log('ok');
