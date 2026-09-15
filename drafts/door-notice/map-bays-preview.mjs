// 「鄰近停車格」那顆標籤的提案頁 —— 站上那張簡易地圖，多一顆標籤，按下去才出現路邊停車格。
//
//   node drafts/door-notice/map-bays-preview.mjs   →  preview/map-bays/index.html
//
// ⚠⚠ 這一頁是 index.html 的**完整複本**，所以 CLAUDE.md 第八節那四件全部照做：
//    ① 相對路徑往上兩層（不用 <base href="/">，那會讓 #topics 這種錨點跳回首頁）
//    ② 計數器**降級**不是拿掉：`data-views-self` → `data-views`
//       —— 只有 -self 會 POST +1，所以「不灌計數」與「印得出真數字」同時成立，
//          而且沒有任何假數字可以被搬回正式站（同 chip-carry 那一輪）
//    ③ 切換條要用 lastIndexOf('</body>') 插 —— 這一站的註解裡就寫著 </body> 這幾個字
//    ④ 樣式要放進 <head>，塞在頁尾的話關著的東西會在開頁那 180ms 閃出來
//
// ⚠⚠ 格子的座標**一個都不在這一支裡面** —— 從 parking-map.mjs import 進來，
//    所以那張清查圖與這一頁永遠畫在同一個位置。號碼的唯一出處仍然是
//    parking-survey.json（那一支有守門在對）。
//
// ⚠ 顏色一個都沒新增：格子與標籤吃 --map-park（路牌藍）或 --ink-soft（柔墨），
//   兩支都是站上既有的變數 —— 寫成 var() 不寫死 HEX，夜間模式才跟得上。
//
// ⚠ **裝卸貨車專用區（郵局門口）刻意沒有畫**：那一格停不得，
//   畫在一張叫「鄰近停車格」的圖上是陷阱。要加回去先問使用者。
//
// ⚠ class 一律 `pv` 前綴（第八節：短名字幾乎一定會和站上的撞名）。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { BAYS, HBAYS, WEST, W, L } from './parking-map.mjs';

const ROOT = new URL('../../', import.meta.url);
const src = readFileSync(new URL('index.html', ROOT), 'utf8');
let h = src;

/* ── 1. 相對路徑往上兩層 ─────────────────────────────────────────────── */
h = h.replace(/(\s(?:href|src)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
h = h.replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)assets\//g, '$1../../assets/')}"`);
h = h.replace(/url\((["']?)assets\//g, 'url($1../../assets/');
{
  const n = (h.match(/href="\.\/"/g) || []).length;
  if (!n) throw new Error('找不到 href="./"（回首頁那個連結）');
  h = h.replace(/href="\.\/"/g, 'href="../../"');
}

/* ── 2. 計數器降級（不是拿掉）───────────────────────────────────────── */
{
  const n = (h.match(/data-views-self=/g) || []).length;
  if (!n) throw new Error('找不到 data-views-self —— 計數器的掛勾換過名字了？');
  h = h.replace(/data-views-self=/g, 'data-views=');
}

/* ── 3. noindex ──────────────────────────────────────────────────────── */
{
  const a = '<meta charset="utf-8">';
  if (!h.includes(a)) throw new Error('找不到 charset');
  h = h.replace(a, a + '\n<meta name="robots" content="noindex, nofollow, noarchive">');
}

/* ── 4. 格子 ─────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rects = [], nums = [];
const rect = (x, y, w, hh, cls) =>
  `<rect class="pv-bay${cls}" x="${x}" y="${y}" width="${w}" height="${hh}" rx="2.5"/>`;
const num = (x, y, s, an, size) =>
  `<text class="pv-n" x="${x}" y="${y}" text-anchor="${an}" font-size="${size}">${esc(s)}</text>`;

for (const o of BAYS) {
  rects.push(rect(o.x, o.y, W, L, ''));
  const cy = o.y + L / 2 + 4.5;
  if (o.side === 'e') nums.push(num(o.x + W + 6, cy, o.n, 'start', 13));
  else nums.push(num(o.x - 6, cy, o.n, 'end', 13));
}
for (const o of HBAYS) {
  rects.push(rect(o.x, o.y, L, W, ''));
  const lx = o.an === 'end' ? o.x + L - 2 : o.an === 'start' ? o.x + 2 : o.x + L / 2;
  nums.push(num(lx, o.y - 5, o.n, o.an, 12));
}
// 文化路・平和街口以西：**數量是示意的、號碼還沒清查**，所以自己一組、可以關掉
const west = WEST.map(o => rect(o.x, o.y, L, W, ' pv-w')).join('');

const bays =
  '\n                <!-- ▼ 提案：鄰近停車格（drafts/door-notice/map-bays-preview.mjs 產生，不要手改）-->\n' +
  '                <g id="pv-bays" aria-hidden="true">' +
  rects.join('') + west +
  '<g class="pv-ns">' + nums.join('') + '</g>' +
  '</g>\n';

{
  const s = h.indexOf('<g id="map-clip"');
  if (s === -1) throw new Error('找不到 #map-clip');
  const e = h.indexOf('</svg>', s);
  const g = h.lastIndexOf('</g>', e);          // 收掉 #map-clip 的那一個
  if (g === -1 || g < s) throw new Error('找不到 #map-clip 的收尾');
  h = h.slice(0, g) + bays + h.slice(g);
}

/* ── 5. 標籤（兩個位置各放一份，切換條決定顯示哪一個）─────────────── */
const chip = pos =>
  `<ul class="pv-mapchips pv-${pos}"><li><button type="button" class="pv-chip" aria-pressed="false">鄰近停車格</button></li></ul>`;
{
  const a = '          <h3>位置與周邊停車</h3>';
  if (!h.includes(a)) throw new Error('找不到「位置與周邊停車」那個標題');
  /* ⚠ 「標題旁邊」那一版直接接在 <h3> 後面 —— 那個 h3 本來就是 inline-block
     的灰藥丸（.info-card h3），所以不必另外包一層 flex；包了會動到站上的
     margin 與 :first-child，那是這一頁最不該動的地方。 */
  h = h.replace(a, a + chip('side') + '\n          ' + chip('top'));
  const b = '            <figcaption class="map-note">';
  if (!h.includes(b)) throw new Error('找不到地圖的圖說');
  h = h.replace(b, '            ' + chip('bot') + '\n' + b);
}

/* ── 6. 樣式放進 <head> ──────────────────────────────────────────────── */
const css = `
<style>
/* ===== 提案：鄰近停車格 ===============================================
   ⚠ 顏色一個都沒新增 —— 吃站上的 --map-park 與 --ink-soft，寫成 var()
     夜間模式才跟得上。
   ⚠ 標籤沒按下去的時候，地圖與站上**逐像素相同**（#pv-bays 是 display:none）。 */
:root { --pv-bay: var(--map-park); }
html[data-pv-c="ink"] { --pv-bay: var(--ink-soft); }

#pv-bays { display: none; }
.card-map[data-bays="1"] #pv-bays { display: inline; }

/* 格子：路牌藍的實心塊 ＋ **虛線的框**（2026-09-15 使用者指定）。
   ⚠ 虛線的顏色是卡色（＝路面上畫出來的白線那個意思），不是新顏色。
   ⚠ dasharray 的單位是 viewBox 的使用者單位，會跟著圖一起縮 ——
     手機上 1 單位 ＝ 0.748px，所以 3 個單位畫出來只有 2.2px。 */
.pv-bay {
  fill: var(--pv-bay); stroke: var(--card);
  stroke-width: var(--pv-dw, 1.4); stroke-dasharray: var(--pv-da, 3 2.4);
}
html[data-pv-d="a"] { --pv-dw: 1.2; --pv-da: 2 1.6; }
html[data-pv-d="b"] { --pv-dw: 1.4; --pv-da: 3 2.4; }
html[data-pv-d="c"] { --pv-dw: 1.8; --pv-da: 4 3.2; }
html[data-pv-d="d"] { --pv-dw: 2.2; --pv-da: 5.5 4.4; }
html[data-pv-c="out"] .pv-bay { fill: none; stroke: var(--map-park); stroke-width: 2.6; }

.pv-n { fill: var(--ink); font-weight: 600; letter-spacing: .02em; }
.pv-ns { display: none; }
html[data-pv-num="on"] .pv-ns { display: inline; }

/* 文化路・平和街口以西那一排：數量是示意的、號碼還沒清查 */
.pv-w { display: none; }
html[data-pv-w="on"] .pv-w { display: inline; }

/* 標籤 —— **幾何整組照抄它旁邊那顆 .card-map h3**（字級 .88rem、
   上下內距 calc((34px − 1.6em − 2px)/2)、圓角 12px），只換顏色。
   ⚠ 兩顆藥丸並排，高度就不可以各算各的 —— 站上那顆在 ≥721px 會乘 --type-scale，
     這裡也要乘，不然電腦版一顆 38.25、一顆 32.2。
   ⚠ 上下內距**不要換算成 px**（字級一改塊高就被頂開，第九節那一條）。 */
.pv-mapchips {
  display: inline-flex; flex-wrap: wrap; gap: .45rem; padding: 0; list-style: none;
  margin: 0 0 .55rem .45rem; vertical-align: top;
}
.pv-mapchips.pv-top { display: flex; margin: 0 0 1.15rem; }
.pv-mapchips.pv-bot { display: flex; margin: .7rem 0 0; }
.pv-mapchips button {
  font: inherit; font-size: .88rem; line-height: 1.6; letter-spacing: normal;
  padding: calc((34px - 1.6em - 2px) / 2) .7rem;
  border-radius: 12px; cursor: pointer;
  -webkit-appearance: none; appearance: none;
  background: var(--card); color: var(--pv-bay); border: 1px solid var(--pv-bay);
  transition: background-color .15s ease, color .15s ease;
}
@media (min-width: 721px) {
  .pv-mapchips button {
    padding: calc((34px * var(--type-scale) - 1.6em - 2px) / 2) .7rem;
    border-radius: calc(12px * var(--type-scale));
  }
}
.pv-mapchips button[aria-pressed="true"] { background: var(--pv-bay); color: #fff; border-color: var(--pv-bay); }
html[data-pv-p="side"] .pv-top, html[data-pv-p="side"] .pv-bot { display: none; }
html[data-pv-p="top"]  .pv-side, html[data-pv-p="top"] .pv-bot  { display: none; }
html[data-pv-p="bot"]  .pv-side, html[data-pv-p="bot"] .pv-top  { display: none; }

/* ===== 切換條（定案時整條刪掉）===================================== */
/* ⚠ 切換條在手機上不能吃掉半個畫面（第八節 hero-motion-mobile 那一輪）——
     「收起」做成右上角一顆小的，不另外佔一列。 */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: rgba(20,20,20,.94); color: #f4f4f5;
  font: 12px/1.45 system-ui, sans-serif;
  padding: .35rem .6rem calc(.35rem + env(safe-area-inset-bottom, 0px));
  max-height: 46vh; overflow: auto;
}
.pv-bar[hidden] { display: none !important; }
.pv-row { display: flex; flex-wrap: wrap; align-items: center; gap: 3px; margin-bottom: 3px; }
.pv-row > b { flex: 0 0 5.2em; font-weight: 400; opacity: .72; font-size: 11px; }
.pv-row button {
  font: inherit; font-size: 11.5px; padding: 2px 7px; border-radius: 6px; cursor: pointer;
  background: transparent; color: #f4f4f5; border: 1px solid rgba(244,244,245,.35);
}
.pv-row button[aria-pressed="true"] { background: #f4f4f5; color: #1a1a1a; border-color: #f4f4f5; }
#pv-hide { position: absolute; top: 3px; right: 6px; font: 11px/1 system-ui, sans-serif;
  padding: 4px 7px; border-radius: 6px; background: transparent; color: #f4f4f5;
  border: 1px solid rgba(244,244,245,.35); cursor: pointer; }
.pv-panel { font-size: 11px; line-height: 1.45; opacity: .82; border-top: 1px solid rgba(244,244,245,.2); margin-top: 4px; padding-top: 4px; white-space: pre-wrap; }
.pv-mini { position: fixed; right: 10px; bottom: calc(10px + env(safe-area-inset-bottom, 0px)); z-index: 91;
  font: 12px/1 system-ui, sans-serif; padding: 8px 11px; border-radius: 9px; cursor: pointer;
  background: rgba(20,20,20,.94); color: #f4f4f5; border: 0; }
</style>`;
{
  const a = '</head>';
  const i = h.indexOf(a);
  if (i === -1) throw new Error('找不到 </head>');
  h = h.slice(0, i) + css + '\n' + h.slice(i);
}

/* ── 7. 切換條 ＋ 腳本（一定要用 lastIndexOf，註解裡就寫著那個標籤）──── */
/* ⚠ 2026-09-15 使用者把五條尺一次挑完了（標籤放標題旁邊／路牌藍＋虛線框／
     不寫號碼／按下去停車場與街名一起熄滅／未清查那一排畫出來），
     所以那五條**收成寫死的預設值、從切換條上拿掉** ——
     網址參數仍然吃得到（?p=top|bot、?c=ink|out、?num=on、?lots=keep、?w=off），
     要回頭比對還開得出來（同 head-search 那一輪）。
   ⚠ 只留新的那一條：虛線多疏、多粗 —— 那是他還沒看過的東西，
     所以給一把尺不是給一個我估的值（第九節第 28 條 ①）。 */
const R = [
  ['d', '虛線', [['a', '最細密'], ['b', '細'], ['c', '中'], ['d', '疏']]],
];
const bar =
'<button class="pv-mini" type="button" id="pv-open" hidden>提案</button>\n' +
'<div class="pv-bar" id="pv-bar">\n' +
'  <button type="button" id="pv-hide">收起</button>\n' +
R.map(([k, label, opts]) =>
  `  <div class="pv-row" data-k="${k}"><b>${label}</b>` +
  opts.map(([v, t]) => `<button type="button" data-v="${v}">${t}</button>`).join('') +
  '</div>').join('\n') +
'\n' +
'  <div class="pv-panel" id="pv-panel">量測中…</div>\n' +
'</div>\n' +
`<script>
(function () {
  var DEF = { p: 'side', c: 'blue', num: 'off', lots: 'off', w: 'on', d: 'd' };
  var root = document.documentElement, q = new URLSearchParams(location.search);
  var st = {};
  /* ⚠ 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到帶數字的值（CLAUDE.md 第九節）*/
  Object.keys(DEF).forEach(function (k) {
    var v = q.get(k);
    st[k] = (v && /^[a-z0-9]+$/.test(v)) ? v : DEF[k];
    root.setAttribute('data-pv-' + k, st[k]);
  });

  var card = document.querySelector('.card-map');
  var fig  = document.querySelector('.map-fig');
  var win  = document.querySelector('.map-win');
  var svg  = document.querySelector('svg.map-svg');
  var chips = [].slice.call(document.querySelectorAll('.pv-chip'));
  var on = false;

  function paint() {
    card.setAttribute('data-bays', on ? '1' : '0');
    function syncDim() {
    var want = on && st.lots === 'off';
    var has = svg.classList.contains('dim');
    if (want && !has) svg.classList.add('dim');
  }
  new MutationObserver(syncDim).observe(svg, { attributes: true, attributeFilter: ['class'] });

  chips.forEach(function (b) { b.setAttribute('aria-pressed', String(on)); });
    /* 「停車場熄滅」＝ 借站上自己那條規則：點地圖的其他地方就全部收回。
       ⚠ 那支 IIFE 是關起來的，外面叫不到 paintLots()，所以用它自己的
         figure click handler（pinned = null）。 */
    if (on && st.lots === 'off') fig.click();
    /* ⚠⚠ 街名要跟著淡下去（2026-09-15 使用者：「道路文字也要滅掉」）——
       站上那一條是 .map-svg.dim .lbl 的 opacity .28，而 dim 只有在
       「有停車場亮著」時才會掛上；這裡是**沒有**停車場亮著的狀態，
       所以自己補掛。顏色與那個 .28 都是站上的，一個值都沒新增。
       ⚠ 站上那支 paintLots() 每次跑都會把 dim 拿掉（它看的是有沒有停車場亮著），
         所以不能只掛一次 —— 底下那個 MutationObserver 負責補回來。 */
    syncDim();
    measure();
  }
  chips.forEach(function (b) {
    b.addEventListener('click', function (e) {
      /* ⚠⚠ 一定要擋住冒泡：「圖說上面」那個位置在 <figure> 裡面，
             不擋的話按標籤會順手觸發站上那條「點地圖其他地方＝全部熄滅」。 */
      e.stopPropagation();
      on = !on; paint();
    });
  });

  /* ⚠⚠ 點三塊停車場的時候，格子要收起來（2026-09-15 使用者：「點停車場的時候
     不要顯示停車格」）—— 兩種模式互斥：按標籤 ＝ 停車場熄滅、點停車場 ＝ 格子收起來。
     ⚠ 一定要用**捕獲階段**（第三個參數 true）：站上那三塊自己的 handler 有
       stopPropagation()，掛在冒泡階段的永遠收不到。捕獲比目標早跑，所以
       我們先把格子收掉，站上那支 paintLots() 再照它自己的邏輯把停車場點亮。
     ⚠ 桌機的 hover 不管 —— 那只是預覽，滑開就回去，跟著收會一直閃。 */
  function offOnLot(e) {
    if (!on) return;
    var t = e.target;
    if (t && t.closest && t.closest('.lot')) { on = false; paint(); }
  }
  fig.addEventListener('click', offOnLot, true);
  fig.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') offOnLot(e);
  }, true);

  document.querySelectorAll('.pv-row[data-k]').forEach(function (row) {
    var k = row.dataset.k;
    row.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      b.addEventListener('click', function () {
        st[k] = b.dataset.v;
        root.setAttribute('data-pv-' + k, st[k]);
        row.querySelectorAll('button').forEach(function (o) {
          o.setAttribute('aria-pressed', String(o.dataset.v === st[k]));
        });
        var u = new URL(location.href);
        u.searchParams.set(k, st[k]);
        history.replaceState(null, '', u);
        paint();
      });
    });
  });

  var bar = document.getElementById('pv-bar'), mini = document.getElementById('pv-open');
  document.getElementById('pv-hide').addEventListener('click', function () { bar.hidden = true; mini.hidden = false; measure(); });
  mini.addEventListener('click', function () { bar.hidden = false; mini.hidden = true; measure(); });

  /* ── 量測面板 ───────────────────────────────────────────────────────
     ⚠ 量的是**畫出來的東西**（getBoundingClientRect），不是屬性值 —— 屬性
       寫對不等於畫出來是那個大小。
     ⚠ 手機那一段是 preserveAspectRatio="slice"，viewBox 的左右兩側會被裁掉，
       所以「幾格看得到」要拿每一格的螢幕座標去和 .map-win 的框比。 */
  function measure() {
    var p = document.getElementById('pv-panel');
    if (!p) return;
    // ⚠ 電腦版 .map-win 是 display:contents（沒有盒子、rect 回 0），退回 svg 自己的框
    var wr = win.getBoundingClientRect();
    if (!wr.width) wr = svg.getBoundingClientRect();
    var all = [].slice.call(svg.querySelectorAll('#pv-bays .pv-bay'));
    var shown = all.filter(function (r) { return r.getClientRects().length; });
    var vis = 0, cut = 0;
    shown.forEach(function (r) {
      var b = r.getBoundingClientRect();
      if (b.right > wr.left + 1 && b.left < wr.right - 1) vis++; else cut++;
    });
    // 號碼也要各自量一次 —— 永安路東側那一排的字在手機上會落在裁切線外面
    var nAll = [].slice.call(svg.querySelectorAll('#pv-bays .pv-n'));
    var nShown = nAll.filter(function (e) { return e.getClientRects().length; });
    var nCut = 0;
    nShown.forEach(function (e) {
      var b = e.getBoundingClientRect();
      if (!(b.right < wr.right - 1 && b.left > wr.left + 1)) nCut++;
    });
    var one = shown[0] ? shown[0].getBoundingClientRect() : null;
    var k = svg.getBoundingClientRect().width / 560;
    var nEl = svg.querySelector('#pv-bays .pv-n');
    var nPx = nEl && nEl.getClientRects().length ? parseFloat(getComputedStyle(nEl).fontSize) : 0;
    var lotOn = [].slice.call(svg.querySelectorAll('.lot.on')).length;
    var ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var chip = document.querySelector('.pv-' + st.p + ' .pv-chip');
    var cb = (chip && chip.getClientRects().length) ? chip.getBoundingClientRect() : null;
    var h3h = card.querySelector('h3').getBoundingClientRect().height;
    /* 虛線一段畫出來多長 —— dasharray 的單位是 viewBox 的使用者單位，會跟著圖縮 */
    var da = (getComputedStyle(svg.querySelector('#pv-bays .pv-bay')).strokeDasharray || '')
             .split(/[ ,]+/).map(parseFloat).filter(function (v) { return v === v; });
    var dw = parseFloat(getComputedStyle(svg.querySelector('#pv-bays .pv-bay')).strokeWidth) || 0;
    var per = da.length ? (da[0] + (da[1] || da[0])) : 0;
    p.textContent =
      '標籤 ' + (on ? '按下去了' : '沒按') +
      '　畫出來 ' + (cb ? Math.round(cb.width) + '×' + Math.round(cb.height) + 'px' : '—') +
      /* ⚠ 拿它旁邊那顆 .card-map h3 現場量一次比對 —— 兩顆藥丸並排，高度要一樣；
         寫死 34px 的話電腦版會誤報（那邊乘了 --type-scale）*/
      (cb ? '（旁邊那顆標題 ' + h3h.toFixed(1) + 'px，' + (Math.abs(cb.height - h3h) < .6 ? '一樣高' : '差 ' + (cb.height - h3h).toFixed(1) + 'px') + '）' : '') + '\\n' +
      '格子 ' + shown.length + ' 個' +
      (shown.length ? '　看得到 ' + vis + '　被裁掉 ' + cut : '') +
      (cut ? '　⚠ 手機是 slice，左右會裁' : '') + '\\n' +
      '一格畫出來 ' + (one ? one.width.toFixed(1) + '×' + one.height.toFixed(1) + 'px' : '—') +
      '　地圖寬 ' + Math.round(svg.getBoundingClientRect().width) + 'px（1 單位 ＝ ' + k.toFixed(3) + 'px）\\n' +
      '號碼 ' + (st.num === 'on'
        ? nPx.toFixed(1) + 'px' + (nPx < 9 ? '（小於 9px）' : '') +
          (nCut ? '　⚠ 有 ' + nCut + ' 個被裁到' : '　沒有被裁到')
        : '不寫') +
      '　亮著的停車場 ' + lotOn + ' 塊　水平溢出 ' + ov + 'px\\n' +
      '虛線 一段 ' + (da[0] * k).toFixed(1) + 'px・空 ' + ((da[1] || da[0]) * k).toFixed(1) +
      'px・粗 ' + (dw * k).toFixed(2) + 'px　一圈 ' + (per ? (62 / per).toFixed(1) : '—') + ' 段' +
      ((da[0] * k) < 2.5 ? '　⚠ 一段不到 2.5px，畫出來讀不出是虛線' : '') +
      '　街名 ' + (svg.classList.contains('dim') ? '淡下去了' : '滿的');
  }
  addEventListener('resize', measure);
  addEventListener('load', measure);
  paint();
})();
<\/script>
`;
{
  const i = h.lastIndexOf('</body>');
  if (i === -1) throw new Error('找不到 </body>');
  h = h.slice(0, i) + bar + h.slice(i);
}

mkdirSync(new URL('preview/map-bays/', ROOT), { recursive: true });
writeFileSync(new URL('preview/map-bays/index.html', ROOT), h);
console.log('ok　格子', BAYS.length + HBAYS.length, '＋示意', WEST.length);
