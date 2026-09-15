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

// 直的格子：x = 矩形左緣, y = 上緣, side = 號碼擺哪一邊
// 橫的格子：x = 左緣, y = 上緣, an = 號碼的對齊（middle／end／start）
const V = (st, x, y, n, side, dim) => ({ t: 'v', st, x, y, n, side, dim });
const H = (st, x, y, n, an, dim) => ({ t: 'h', st, x, y, n, an: an || 'middle', dim });

const BAYS = [
  // ── 永樂街（走廊 x324–354）─────────────────────────────
  // 東側（貼東緣 354）
  V('永樂街', 343, 224, '002', 'e'),
  V('永樂街', 343, 292, '001', 'e'),
  // 西側＝診所這一側（貼西緣 324）
  //   005 在「平和街33巷（y321~333）與診所（y236~276）之間」那一塊，
  //   2026-09-15 使用者指正再往南一點 —— 下緣離 33 巷剩 7px（那一塊的南界）
  V('永樂街', 324, 294, '005', 'w'),
  //   003 與 004 同一個街區（33 巷以南 ~ 大同路 y403 以北），003 最靠大同路
  V('永樂街', 324, 345, '004', 'w'),
  V('永樂街', 324, 375, '003', 'w'),

  // ── 永安路・東側（貼東緣 487）────────────────────────────
  //   010→004 連續（一格接一格），004 的南邊界 y253 ＝ 合廷停車場的入口
  //   （那顆入口箭頭在 index.html 裡是 translate(466 253)）
  ...['010','009','008','007','006','005','004']
      .map((n, i) => V('永安路', 476, 113 + i * L, n, 'e', n === '009' || n === '004')),
  //   003 與 004 隔一點、002 與 003 再隔一點
  V('永安路', 476, 262, '003', 'e'),
  V('永安路', 476, 293, '002', 'e'),

  // ── 永安路・西側（貼西緣 455）────────────────────────────
  V('永安路', 456, 375, '013', 'w'),   // 幾乎在永安路與大同路口（大同路 y403 起）
  V('永安路', 456, 518, '012', 'w'),   // 大同路與中華路之間
];

// 郵局門口的裝卸貨車專用區，靠文化路那一頭
const LOAD = V('永安路', 456, 80, '卸貨', 'w');

const HBAYS = [
  // 文化路北側・平和街口（x94~124）與那條小巷（x206~218）之間
  H('文化路', 150, 22, '039', 'end'),
  H('文化路', 170, 22, '040', 'start'),
  // 大同路北側
  H('大同路', 252, 404, '001'),
];

// 文化路・平和街口以西（照片沒拍，號碼還沒清查）——
// 北側一整排連續、南側一格。⚠ 畫的數量是示意，不是清查結果。
const WEST = [
  ...[4, 24, 44, 64].map(x => ({ t: 'h', st: '文化路西', x, y: 22, n: '', an: 'middle' })),
  { t: 'h', st: '文化路西', x: 44, y: 47, n: '', an: 'middle' },
];

// ── 守門：圖上畫的格號要和 parking-survey.json 對得起來 ────────────────
// ⚠ 只比對「有號碼」的格子 —— 文化路平和街口以西那一排還沒清查號碼，
//   資料裡是空的、圖上也不寫號碼，兩邊都跳過。
{
  const d = JSON.parse(readFileSync(new URL('./parking-survey.json', import.meta.url), 'utf8'));
  const 純 = t => t.replace(/（.*/, '').replace(/[（(].*/, '');
  const 清查 = new Set();
  for (const st of d['街'])
    for (const b of st['停車格'] || []) {
      const n = 純(b['號']);
      if (!/^\d+$/.test(n)) continue;                       // 未確認的跳過
      if (b['網站地圖範圍內'] === false) continue;
      清查.add(純(st['路名']) + '/' + n);
    }
  const 圖上 = new Set(
    [...BAYS, ...HBAYS].filter(o => /^\d+$/.test(o.n)).map(o => o.st + '/' + o.n));
  const 少 = [...清查].filter(k => !圖上.has(k));
  const 多 = [...圖上].filter(k => !清查.has(k));
  if (少.length || 多.length)
    throw new Error('停車格對不上 parking-survey.json —— 圖上少了 [' + 少 + ']、多了 [' + 多 + ']');
}


const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await b.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 });
await p.goto('file:///home/user/fangren-dental/index.html', { waitUntil: 'load' });
await p.waitForTimeout(1200);

await p.evaluate(({ BAYS, LOAD, HBAYS, WEST, BLUE, GREY, SOFT, W, L }) => {
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
  move(471, 448);   // 永安路 → 讓開西側的 013(y375) 與 012(y518)

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
    if (!o.n) return;                       // 還沒清查號碼的那一排不寫字
    // 兩格緊鄰時號碼會疊在一起 —— 靠左那一格的字靠右切齊、靠右那一格靠左切齊
    const lx = o.an === 'end' ? o.x + L - 2 : o.an === 'start' ? o.x + 2 : o.x + L / 2;
    label(lx, o.y - 5, o.n, o.an, o.dim ? SOFT : '#2a2c27', 12);
  };

  BAYS.forEach(o => drawV(o, BLUE));
  drawV(LOAD, GREY);
  HBAYS.forEach(o => drawH(o, BLUE));
  WEST.forEach(o => drawH(o, BLUE));

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
    '平和街、平和街33巷、文化路南側（平和街口以東）、文化路往東、大同路往西過平和街與往東到永安路 —— 現地確認沒有汽車停車格。<br>' +
    '⚠ 文化路・平和街口以西那幾格（北側一排、南側一格）<b>照片沒拍到、號碼還沒清查</b> —— 圖上畫的數量是示意，不是清查結果。<br>' +
    '⚠ 永安路東側那九格的先後順序還沒確認（圖上是由北往南 010→002 的推定畫法）；另有一格 011 現場還沒找到，圖上沒有畫。';
  box.appendChild(note);

  document.querySelectorAll('body > *:not(#shotbox)').forEach(e => e.style.display = 'none');
}, { BAYS, LOAD, HBAYS, WEST, BLUE, GREY, SOFT, W, L });

await p.waitForTimeout(400);
await p.locator('#shotbox').screenshot({ path: new URL('./parking-survey-map.png', import.meta.url).pathname });
await b.close();
console.log('ok');
