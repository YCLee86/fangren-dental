#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-liao/ 的產生器
   --------------------------------------------------------------------------
   廖立揚醫師的形象照四選一。把 index.html 做成快照，在他那張卡上切四個候選。
   起因：2026-09-23 使用者給了四張，「把這四張做成廖立揚醫師的圖卡，
        作成站上首頁提案頁給我看」。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-liao-preview.mjs
   ⚠ 圖檔由 tools/doctor-liao-crop.mjs 產生，在 preview/doctor-liao/img/。

   ⚠⚠ **版面不必在這裡做。** 圓頭像那一套（76px、往左 6px、四周三個間距一致、
       名字和藥丸放不下時斷行且切齊左緣）2026-09-19 已經定案上線在 index.html 裡，
       這一頁完全沿用，只換 img 的 src。**不要在這裡重寫任何版面規則**，
       不然這一頁會開始說謊（og-topic-card 那一輪記過同一條）。

   ⚠ 定案之後要做的：把選中的那張搬進 tools/doctor-photo-crop.mjs 的 FACES、
     產出 assets/doctor-liao-liyang-400.jpg、在 index.html 那張卡補 data-face
     與 picture（照現有那三張抄），再跑 webp → topics → build；
     然後刪掉這一頁與這兩支，推導搬進 history/。五個步驟在 /history/doctor-photo.html。

   CLAUDE.md 第八節那四個陷阱都照做了：
     (1) 相對路徑往上兩層（assets/ posts/ site.webmanifest，srcset 另外處理）
     (2) 拿掉 counter.js 與 data-views-self，窄帶數字寫死並手動加 .is-on
     (3) 切換條用 lastIndexOf 找 body 的結束標籤插入（註解裡就有那幾個字）
     (4) class 一律 pv- 前綴
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACES, RATIOS, box } from './doctor-liao-crop.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR  = join(ROOT, 'preview', 'doctor-liao');
const OUT  = join(DIR, 'index.html');
const KEYS = ['a', 'b', 'c', 'd'];

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const MARKS = Object.entries(FACES).map(([k, f]) => {
  const m = f.marks;
  return '       ' + k.toUpperCase() + ' 髮頂 ' + m.hair + ' 眼睛 ' + m.eyes +
    ' 下巴 ' + m.chin + ' 臉中線 ' + m.midX + '\n' +
    RATIOS.map((r) => '           ' + r.k + '% → ' + box(m, r.k).join(',')).join('\n');
}).join('\n');

const NOTE = `<!-- ==========================================================================
     提案：廖立揚醫師的形象照四選一（2026-09-23）
     --------------------------------------------------------------------------
     使用者給了四張，「把這四張做成廖立揚醫師的圖卡，作成站上首頁提案頁給我看」。

     ---- 要挑的是什麼 -------------------------------------------------------
     **不是版面。** 圓頭像那一套 2026-09-19 已經定案上線，這一頁完全沿用
     index.html 現行的規則，只換 img 的 src。

     ✅ **第三輪（2026-09-23）：頭的大小定案了 —— 使用者「留 74%」。**
       那條尺已經從切換條上拿掉、收成寫死的 74%（同 head-search、
       night-map-park 那兩輪的做法），**網址參數 ?h=70|77|81 仍然吃得到**，
       要回頭比另外三格還打得開。
       ⚠ 74% 比站上那三位（77／81）鬆一點，**那是他看過四格之後挑的，
         不是算出來的** —— 不要拿「和王俊偉一致」去把它訂正回 77。

     所以這一頁現在只剩一件事要挑：**哪一種表情**。

       Ⓐ 露齒笑，畫法最接近照片（原檔 1024x1536，和另外三張不同組）
       Ⓑ 微笑不露齒
       Ⓒ 露齒笑
       Ⓓ 抿嘴笑，頭略大

     ---- 第二輪：尺的單位從「框幾 px」改成「頭高佔圓的比例」---------------
     第一輪四張全部太小（使用者：「698好像還有點小　再大一點」）。
     回頭把四張和站上那三顆圓一起套格線量，才看出問題不在某一個數字：

       李柄輝 81%　李侑津 81%　王俊偉 77%
       Ⓐ 70%　Ⓑ 69%　Ⓒ 70%　Ⓓ 73%

     四張都比站上那三位小一級。**框的 px 沒辦法跨醫師比**（四個人的原檔
     尺寸與取景都不一樣，王俊偉的 660 和廖立揚的 698 不在同一把尺上），
     頭高佔比可以 —— 所以尺改成這個單位，而且 77%／81% 兩格直接等於站上那三位。
     順帶修掉第一輪量偏的臉中線（Ⓐ 505 → 495，臉原本偏左 2~3%）。

     ---- 裁切怎麼來的 -------------------------------------------------------
     框的位置仍照 /history/doctor-photo.html 定下的兩個錨：
     **眼睛在框高 44.2%、臉中線在框寬 49.3%**；這一輪只動框的大小。
     marks 是在已經裁出來的 400px 成品上套格線讀、再換算回原檔座標的。

${MARKS}
     ---- 切換條 -------------------------------------------------------------
     網址參數 ?p=off|a|b|c|d（off ＝ 對照現況，那張卡沒有照片）＋ ?h=70|74|77|81
     ========================================================================== -->`;

/* ---- (1) 相對路徑往上兩層。不要改用 base href —— 錨點會跳回首頁。 ---- */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');

html = html.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE);

/* ---- (2) 計數器整支拿掉，窄帶數字寫死。
   ⚠⚠ 那個數字是提案頁專用的示範值，**絕對不要跟著版型搬回正式站**
       （2026-08-07 踩過：示範值 8642 把真實的 190 蓋掉還不會動）。 */
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
html = html.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on"><!-- 提案頁的示範值，不要搬回正式站 -->');
html = html.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">697</span>');
html = html.replace(/<span class="dot" aria-hidden="true">・<\/span>\s*<span class="views"[^>]*>[\s\S]*?<\/span>\s*<\/p>/g, '</p>');

/* ---- (2b) 搜尋紀錄與點擊紀錄也整支拿掉（2026-09-20 上線的兩支）。
   理由和計數器一模一樣：它們都用 sendBeacon 打正式站的 /api/search、/api/click，
   而 API 的位置是**從腳本自己的網址推**的（見 assets/click-log.js 檔頭第 ③ 條），
   所以提案頁載進來就是真的在記 —— 每按一次切換條的頭像，/admin/search/ 的
   報告就多一筆從提案頁來的假資料，而且分不出來。
   ⚠ 這兩支是這一輪新冒出來的：CLAUDE.md 第八節那張「提案頁四件事」寫的是
     counter.js 那一支，**日後再多一支會打 API 的腳本，也要加到這裡。** */
for (const f of ['search-log', 'click-log']) {
  const re = new RegExp('\\s*<script src="\\.\\./\\.\\./assets/' + f + '\\.js"[^>]*></script>');
  if (!re.test(html)) throw new Error('找不到 ' + f + '.js 的 script 標籤（站上換過寫法？）');
  html = html.replace(re, '');
}

/* ---- 廖立揚那張卡：掛 data-face、插一張 picture -----------------------
   ⚠⚠ 錨點用**完整的 h3**（名字＋藥丸文字，全站唯一），再往回找最近的 article。
       **不可以用姓氏或 data-spec** —— 矯正科有兩位（王俊偉、廖立揚），
       掛錯的話畫面完全正常，只是圖長在別人身上（2026-09-19 踩過同一族）。 */
const TAG = '<article class="doc"';
const H3  = '<h3>廖立揚<span class="doc-role">矯正專科醫師</span></h3>';
if (html.split(H3).length !== 2) throw new Error('找不到（或找到不只一個）廖立揚的 h3');
const at  = html.indexOf(H3);
const art = html.lastIndexOf(TAG, at);
if (art < 0) throw new Error('廖立揚的 h3 前面找不到 article');
html = html.slice(0, art) + TAG + ' data-face' + html.slice(art + TAG.length);
const ALT = '廖立揚醫師的形象照，身著白袍站在診所候診區';
html = html.replace(H3, '<picture class="doc-face">\n' +
  '            <img class="pv-liao" src="img/liao-a-74-400.jpg" width="400" height="400" alt="' + ALT + '">\n' +
  '          </picture>\n          ' + H3);
/* 守門：站上原本三張 ＋ 廖立揚這張 ＝ 4。數字不對就是掛錯人或掛了兩次。 */
const got = (html.match(/<article class="doc" data-face/g) || []).length;
if (got !== 4) throw new Error('data-face 有 ' + got + ' 張，預期 4 張（站上三位＋廖立揚）');

const BAR_CSS = ".pvbar, .pvbar * { box-sizing: border-box; }\n.pvbar {\n  position: fixed; z-index: 999; right: 12px; top: 12px;\n  font: 400 13px/1.6 \"PingFang TC\",\"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;\n  color: #f2f0ee;\n}\n.pvbar-btn {\n  display: flex; align-items: center; gap: .4em; margin-left: auto;\n  padding: .5em .8em; min-height: 36px;\n  background: rgba(20,18,16,.92); color: #f2f0ee;\n  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;\n  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;\n  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);\n}\n.pvbar-btn b { font-weight: 700; opacity: .8; }\n.pvbar-panel {\n  display: none; margin-top: 8px; width: min(340px, calc(100vw - 24px));\n  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */\n  flex-direction: column; max-height: calc(100svh - 68px);\n  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);\n  border-radius: 10px; overflow: hidden;\n  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);\n  box-shadow: 0 12px 34px rgba(0,0,0,.45);\n}\n.pvbar[data-open=\"1\"] .pvbar-panel { display: flex; }\n.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }\n.pvbar-g { padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }\n.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }\n.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }\n.pvbar-row button {\n  flex: 1 1 0; padding: .45em .2em; min-height: 42px;\n  background: rgba(255,255,255,.07); color: #cfc9c2;\n  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;\n  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;\n}\n.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }\n.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }\n.pvbar-row button[aria-pressed=\"true\"] {\n  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;\n}\n.pvbar-row button[aria-pressed=\"true\"] small { color: rgba(20,18,15,.7); }\n.pvbar-row.is-off { opacity: .38; }\n.pvbar-foot {\n  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);\n  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;\n}\n.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }\n.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }\n.pvbar-foot .m.good b { color: #8fd6a4; }\n.pvbar-foot .m.bad  b { color: #ff9a9a; }\n.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }\n.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }\n.pvbar-note b { color: #cfc9c2; font-weight: 600; }\n.pvbar-row.slim button { min-height: 32px; font-size: 11.5px; }\n.pvbar-det > summary {\n  list-style: none; cursor: pointer; padding: 4px 0 2px;\n  color: #8f8a84; font-size: 11px; letter-spacing: .06em;\n}\n.pvbar-det > summary::-webkit-details-marker { display: none; }\n.pvbar-det > summary::before { content: \"▸ \"; }\n.pvbar-det[open] > summary::before { content: \"▾ \"; }\n@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }\n@media print { .pvbar { display: none; } }";
/* 表情的說明。框的數字不寫在這裡 —— 那是 BOXES 算出來的（下面那一段）。 */
const NOTE_MAP = JSON.stringify(Object.fromEntries(
  Object.entries(FACES).map(([k, f]) => [k, '原檔 ' + f.src[0] + '×' + f.src[1] + '　' + f.note])));

/* 每一張 × 每一格的裁切框，直接跟 tools/doctor-liao-crop.mjs 要。
   ⚠ 不要在這裡自己再算一次 —— 兩邊各記一份的話，改了一邊另一邊會靜靜地說謊。 */
const BOXES = JSON.stringify(Object.fromEntries(
  Object.entries(FACES).map(([k, f]) => [k, Object.fromEntries(
    RATIOS.map((r) => [r.k, box(f.marks, r.k).join(',')]))])));

const HS = JSON.stringify(RATIOS.map((r) => r.k));

/* 尺的每一格要先確定圖真的在 —— 少一張的話畫面是破圖，不會報錯。 */
for (const k of KEYS) for (const r of RATIOS) {
  const f = 'liao-' + k + '-' + r.k + '-400.jpg';
  if (!existsSync(join(DIR, 'img', f)))
    throw new Error('找不到 img/' + f + ' —— 先跑 node tools/doctor-liao-crop.mjs');
}

const BAR = `
<!-- 切換條（提案用）。定案之後整段連同 pv-liao 那張圖一起刪掉。 -->
<style>
BARCSS
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">廖立揚 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">四張照片　<em>版面已定案，這裡只換照片</em></div>
      <div class="pvbar-row" data-k="p">
        <button type="button" data-v="a">Ⓐ<small>露齒・像照片</small></button>
        <button type="button" data-v="b">Ⓑ<small>微笑</small></button>
        <button type="button" data-v="c">Ⓒ<small>露齒</small></button>
        <button type="button" data-v="d">Ⓓ<small>抿嘴</small></button>
      </div>
      <div class="pvbar-row slim">
        <button type="button" data-v="off">對照現況（這張卡沒有照片）</button>
      </div>
    </div>
    <div class="pvbar-foot"></div>
  </div>
</div>

<script>
(function () {
  var box  = document.querySelector('.pvbar');
  var btn  = box.querySelector('.pvbar-btn');
  var foot = box.querySelector('.pvbar-foot');
  var img  = document.querySelector('.pv-liao');
  var pic  = img.parentNode;
  var card = pic.parentNode;
  var ALL  = ['a','b','c','d','off'];
  var LBL  = { a:'Ⓐ 露齒・像照片', b:'Ⓑ 微笑', c:'Ⓒ 露齒', d:'Ⓓ 抿嘴', off:'現況（沒有照片）' };
  var SAME = { 70:'第一輪那一格（最鬆）', 74:'比站上那三位鬆一點，使用者挑的',
               77:'和站上的王俊偉一樣', 81:'和站上的李柄輝、李侑津一樣（最滿）' };
  var NOTE  = NOTEMAP;
  var BOXES = BOXMAP;
  var HS    = HSLIST;
  var st = 'a', hs = 74, open1 = false;   /* 2026-09-23 使用者定案：「留 74%」 */

  var qs = new URLSearchParams(location.search);
  var q = qs.get('p'); if (q !== null && ALL.indexOf(q) >= 0) st = q;
  /* ⚠ 那條尺 2026-09-23 已經定案收掉（留 74%），但網址參數留著吃得到
     ——要回頭比另外三格時 ?h=70|77|81 仍然打得開（同 night-map-park 那一輪）。 */
  var h = parseInt(qs.get('h'), 10); if (HS.indexOf(h) >= 0) hs = h;

  function src(k, r) { return 'img/liao-' + k + '-' + r + '-400.jpg'; }

  /* 十六張都先抓下來，切換才不必等下載 —— Worker 對 preview 設 no-store，
     不預抓的話每按一次都要重抓一遍（og-topic-card 那一輪定下的做法）。
     ⚠ 先抓同一張的其他尺寸（使用者這一輪主要在動那條尺），再抓其餘的。 */
  addEventListener('load', function () {
    ['a','b','c','d'].forEach(function (k) { new Image().src = src(k, hs); });
  });

  function apply() {
    if (st === 'off') { card.removeAttribute('data-face'); pic.style.display = 'none'; }
    else { card.setAttribute('data-face', ''); pic.style.display = ''; img.src = src(st, hs); }
    Array.prototype.forEach.call(box.querySelectorAll('.pvbar-row button'), function (b) {
      if (b.dataset.h) b.setAttribute('aria-pressed', String(+b.dataset.h === hs));
      else b.setAttribute('aria-pressed', String(b.dataset.v === st));
    });
    var u = [];
    if (st !== 'a')  u.push('p=' + st);
    if (hs !== 74)   u.push('h=' + hs);
    history.replaceState(null, '', u.length ? '?' + u.join('&') : location.pathname);
    btn.querySelector('b').textContent = st === 'off' ? LBL.off : LBL[st] + '・' + hs + '%';
    measure();
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.pvbar-row button'); if (!b) return;
    if (b.dataset.h) hs = +b.dataset.h; else st = b.dataset.v;
    apply();
  });
  btn.addEventListener('click', function () {
    var o = box.dataset.open === '1' ? '0' : '1';
    box.dataset.open = o; btn.setAttribute('aria-expanded', o === '1');
    if (o === '1') measure();
  });

  /* ---- 現場量測：版面是站上定案的那一套，所以量的是「有沒有照著跑」。
     ⚠ 量畫出來的墨不要量屬性 —— 名字要用 Range 框住那個文字節點。 */
  function n(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function measure() {
    if (box.dataset.open !== '1') return;
    var rows = '<div class="m"><span>視窗寬</span><b>' + window.innerWidth + '</b></div>';
    if (st === 'off') {
      foot.innerHTML = '<div class="pvbar-note">這一格是<b>對照現況</b>：' +
        '廖立揚那張卡沒有照片，和另外五位一樣。</div>';
      return;
    }
    var cr = card.getBoundingClientRect(), fr = img.getBoundingClientRect();
    var h3 = card.querySelector('h3'), t = h3.firstChild;
    var rg = document.createRange(); rg.setStart(t, 0); rg.setEnd(t, t.length);
    var ink = rg.getBoundingClientRect();
    var g = [fr.left - cr.left, fr.top - cr.top, ink.left - fr.right];
    var even = Math.max.apply(null, g) - Math.min.apply(null, g) < 0.6;
    var need = Math.round(fr.width * (window.devicePixelRatio || 1));
    var over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    /* ⚠⚠ 面板不可以長到蓋住那張卡 —— 這一頁要判斷的正是那顆頭像
       （hero-motion-mobile 那一輪踩過）。所以預設只留一句說明，
       量測那幾行（是給我看的守門，不是給使用者看的）收進「量測」裡。 */
    var ok = (400 >= need) && even && !(over > 0);
    var det = '<div class="m"><span>頭高佔圓</span><b>' + hs + '%</b></div>' +
      '<div class="m"><span>裁切框</span><b>' + BOXES[st][hs] + '</b></div>' +
      '<div class="m"><span>頭像</span><b>' + n(fr.width) + ' × ' + n(fr.height) + '</b></div>' +
      '<div class="m ' + (400 >= need ? 'good' : 'bad') + '"><span>原檔夠不夠（需 ' + need + '）</span><b>400 ' + (400 >= need ? '夠' : '不夠') + '</b></div>' +
      '<div class="m ' + (even ? 'good' : 'bad') + '"><span>照片四周三個間距</span><b>' + g.map(n).join(' / ') + '</b></div>' +
      '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>';
    foot.innerHTML =
      '<div class="pvbar-note"><b>' + LBL[st] + '</b>：' + NOTE[st] +
      '<br>頭的大小已定案：<b>頭高佔圓 ' + hs + '%</b>（' + SAME[hs] + '）。' +
      '這一頁現在只剩一件事要挑：<b>哪一種表情</b>。</div>' +
      '<details class="pvbar-det"' + (open1 ? ' open' : '') + '><summary>量測 ' +
      (ok ? '・都對' : '・⚠ 有一項不對') + '</summary>' + rows + det + '</details>';
    /* 使用者自己打開過就記著，換一格不要又收起來。 */
    foot.querySelector('.pvbar-det').addEventListener('toggle', function () { open1 = this.open; });
  }
  addEventListener('resize', measure);
  apply();
})();
</script>
`.replace('BARCSS', BAR_CSS).replace('NOTEMAP', NOTE_MAP)
 .replace('BOXMAP', BOXES).replace('HSLIST', HS);

/* ---- (3) 切換條插在**最後一個** body 結束標籤前面 ---------------------
   ⚠ 這一站的註解裡就寫著那幾個字，用 String.replace 會換到註解裡那一個。 */
const END = '</' + 'body>';
const i = html.lastIndexOf(END);
if (i < 0) throw new Error('找不到 body 的結束標籤');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(DIR, { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-liao/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
