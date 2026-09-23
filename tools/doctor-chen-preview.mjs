#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-chen/ 的產生器
   --------------------------------------------------------------------------
   陳芷鈴醫師的形象照：把 index.html 做成快照，在他那張卡上掛照片。
   起因：2026-09-23 使用者給了一張，「合成陳芷鈴醫師的圖卡 預覽給我看」。
   照謝耀慶那一支（git show 8a3fc2da:tools/doctor-xie-preview.mjs）改的。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-chen-preview.mjs
   ⚠ 圖檔由 tools/doctor-chen-crop.mjs 產生，在 preview/doctor-chen/img/。

   ⚠⚠ **版面不必在這裡做** —— 圓頭像那一套 2026-09-19 已經定案上線在
       index.html 裡，這一頁只換 img 的 src。只有一張照片，所以切換條上
       那幾格是**框的大小**（頭在圓裡多滿），不是不同的照片。

   ⚠ 定案之後要做的：把選中那一格的框搬進 tools/doctor-photo-crop.mjs 的 FACES、
     產出 assets/doctor-chen-yaoqing-400.jpg、在 index.html 那張卡補 data-face
     與 picture（照現有那三張抄），再跑 webp → topics → build；
     然後刪掉這一頁與這兩支，推導搬進 history/。

   CLAUDE.md 第八節那四個陷阱都照做了（同 doctor-liao-preview.mjs），
   另外也剝掉 search-log.js 與 click-log.js（會真的打正式站的 API）。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR  = join(ROOT, 'preview', 'doctor-chen');
const OUT  = join(DIR, 'index.html');
const KEYS = ['a', 'b', 'c', 'd'];

KEYS.forEach((k) => {
  if (!existsSync(join(DIR, 'img', 'chen-' + k + '-400.jpg')))
    throw new Error('找不到 img/chen-' + k + '-400.jpg —— 先跑 node tools/doctor-chen-crop.mjs');
});

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const NOTE = `<!-- ==========================================================================
     提案：陳芷鈴醫師的形象照（2026-09-23）
     --------------------------------------------------------------------------
     使用者給了一張，「合成陳芷鈴醫師的圖卡 預覽給我看」。

     ---- 要挑的是什麼 -------------------------------------------------------
     **不是版面。** 圓頭像那一套 2026-09-19 已經定案上線，這一頁完全沿用。
     只有一張照片，所以要挑的是**框的大小**（頭在圓裡多滿）。
     起點照謝耀慶那一輪的結論：直接從頭頂留白 ~5% 給（Ⓒ 預設）。

       Ⓐ 框 640　頭頂留白 8.1%　頭高 68%
       Ⓑ 框 615　頭頂留白 6.7%　頭高 71%
       Ⓒ 框 590　頭頂留白 5.1%　頭高 74%（預設，和廖立揚定案的 74% 同）
       Ⓓ 框 565　頭頂留白 3.4%　頭高 78%

     ---- 裁切怎麼來的 -------------------------------------------------------
     原圖 1122x1402，量到 髮頂 140／眼睛 371／下巴 578／臉中線 528，
     照李柄輝的比例（眼睛在框高 44.2%、臉中線在框寬 49.3%）定位置。
       Ⓐ 212,88,640,640　Ⓑ 225,99,615,615　Ⓒ 237,110,590,590　Ⓓ 249,121,565,565

     ---- 切換條 -------------------------------------------------------------
     網址參數 ?p=off|a|b|c|d（off ＝ 沒有照片；不帶 ＝ Ⓒ）
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

/* ---- 陳芷鈴那張卡：掛 data-face、插一張 picture -----------------------
   ⚠⚠ 錨點用**完整的 h3**（名字＋藥丸文字，全站唯一），再往回找最近的 article。
       **不可以用 data-spec** —— 同一科可能不只一位，
       掛錯的話畫面完全正常，只是圖長在別人身上（2026-09-19 踩過同一族）。 */
const TAG = '<article class="doc"';
const H3  = '<h3>陳芷鈴<span class="doc-role">顯微根管專科醫師</span></h3>';
if (html.split(H3).length !== 2) throw new Error('找不到（或找到不只一個）陳芷鈴的 h3');
const at  = html.indexOf(H3);
const art = html.lastIndexOf(TAG, at);
if (art < 0) throw new Error('陳芷鈴的 h3 前面找不到 article');
html = html.slice(0, art) + TAG + ' data-face' + html.slice(art + TAG.length);
const ALT = '陳芷鈴醫師的形象照，身著白袍站在診所樓梯間前';
html = html.replace(H3, '<picture class="doc-face">\n' +
  '            <img class="pv-face" src="img/chen-c-400.jpg" width="400" height="400" alt="' + ALT + '">\n' +
  '          </picture>\n          ' + H3);
/* 守門：站上原本四張 ＋ 陳芷鈴這張 ＝ 5。數字不對就是掛錯人或掛了兩次。 */
const got = (html.match(/<article class="doc" data-face/g) || []).length;
if (got !== 5) throw new Error('data-face 有 ' + got + ' 張，預期 5 張（站上四位＋陳芷鈴）');

const BAR_CSS = ".pvbar, .pvbar * { box-sizing: border-box; }\n.pvbar {\n  position: fixed; z-index: 999; right: 12px; top: 12px;\n  font: 400 13px/1.6 \"PingFang TC\",\"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;\n  color: #f2f0ee;\n}\n.pvbar-btn {\n  display: flex; align-items: center; gap: .4em; margin-left: auto;\n  padding: .5em .8em; min-height: 36px;\n  background: rgba(20,18,16,.92); color: #f2f0ee;\n  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;\n  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;\n  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);\n}\n.pvbar-btn b { font-weight: 700; opacity: .8; }\n.pvbar-panel {\n  display: none; margin-top: 8px; width: min(340px, calc(100vw - 24px));\n  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */\n  flex-direction: column; max-height: calc(100svh - 68px);\n  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);\n  border-radius: 10px; overflow: hidden;\n  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);\n  box-shadow: 0 12px 34px rgba(0,0,0,.45);\n}\n.pvbar[data-open=\"1\"] .pvbar-panel { display: flex; }\n.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }\n.pvbar-g { padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }\n.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }\n.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }\n.pvbar-row button {\n  flex: 1 1 0; padding: .45em .2em; min-height: 42px;\n  background: rgba(255,255,255,.07); color: #cfc9c2;\n  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;\n  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;\n}\n.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }\n.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }\n.pvbar-row button[aria-pressed=\"true\"] {\n  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;\n}\n.pvbar-row button[aria-pressed=\"true\"] small { color: rgba(20,18,15,.7); }\n.pvbar-row.is-off { opacity: .38; }\n.pvbar-foot {\n  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);\n  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;\n}\n.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }\n.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }\n.pvbar-foot .m.good b { color: #8fd6a4; }\n.pvbar-foot .m.bad  b { color: #ff9a9a; }\n.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }\n.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }\n.pvbar-note b { color: #cfc9c2; font-weight: 600; }\n@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }\n@media print { .pvbar { display: none; } }";
const NOTE_MAP = JSON.stringify({ a: "裁切 212,88,640,640　頭頂留白 8.1%、頭高 68%", b: "裁切 225,99,615,615　頭頂留白 6.7%、頭高 71%", c: "裁切 237,110,590,590　頭頂留白 5.1%、頭高 74%", d: "裁切 249,121,565,565　頭頂留白 3.4%、頭高 78%" });

const BAR = `
<!-- 切換條（提案用）。定案之後整段連同 pv-face 那張圖一起刪掉。 -->
<style>
BARCSS
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">陳芷鈴 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">框的大小　<em>版面已定案，這裡只換裁切</em></div>
      <div class="pvbar-row" data-k="p">
        <button type="button" data-v="a">Ⓐ<small>640</small></button>
        <button type="button" data-v="b">Ⓑ<small>615</small></button>
        <button type="button" data-v="c">Ⓒ<small>590</small></button>
        <button type="button" data-v="d">Ⓓ<small>565</small></button>
      </div>
      <div class="pvbar-row">
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
  var img  = document.querySelector('.pv-face');
  var pic  = img.parentNode;
  var card = pic.parentNode;
  var ALL  = ['a','b','c','d','off'];
  var LBL  = { a:'Ⓐ 640', b:'Ⓑ 615', c:'Ⓒ 590', d:'Ⓓ 565', off:'現況（沒有照片）' };
  var NOTE = NOTEMAP;
  var st = 'c';

  var q = new URLSearchParams(location.search).get('p');
  if (q !== null && ALL.indexOf(q) >= 0) st = q;

  /* 每一格都先抓下來，切換才不必等下載 —— Worker 對 preview 設 no-store，
     不預抓的話每按一次都要重抓一遍（og-topic-card 那一輪定下的做法）。 */
  addEventListener('load', function () {
    ['a','b','c','d'].forEach(function (k) { new Image().src = 'img/chen-' + k + '-400.jpg'; });
  });

  function apply() {
    if (st === 'off') { card.removeAttribute('data-face'); pic.style.display = 'none'; }
    else { card.setAttribute('data-face', ''); pic.style.display = ''; img.src = 'img/chen-' + st + '-400.jpg'; }
    Array.prototype.forEach.call(box.querySelectorAll('.pvbar-row button'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === st));
    });
    history.replaceState(null, '', st === 'c' ? location.pathname : '?p=' + st);
    btn.querySelector('b').textContent = LBL[st];
    measure();
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.pvbar-row button'); if (!b) return;
    st = b.dataset.v; apply();
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
      foot.innerHTML = rows + '<hr><div class="pvbar-note">這一格是<b>對照現況</b>：' +
        '陳芷鈴那張卡沒有照片，和另外四位一樣。</div>';
      return;
    }
    var cr = card.getBoundingClientRect(), fr = img.getBoundingClientRect();
    var h3 = card.querySelector('h3'), t = h3.firstChild;
    var rg = document.createRange(); rg.setStart(t, 0); rg.setEnd(t, t.length);
    var ink = rg.getBoundingClientRect();
    var g = [fr.left - cr.left, fr.top - cr.top, ink.left - fr.right];
    var even = Math.max.apply(null, g) - Math.min.apply(null, g) < 0.6;
    var mates = Array.prototype.filter.call(document.querySelectorAll('.docs .doc'), function (c) {
      return Math.abs(c.offsetTop - card.offsetTop) < 4 && c !== card;
    });
    var need = Math.round(fr.width * (window.devicePixelRatio || 1));
    var over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    rows += '<div class="m"><span>頭像</span><b>' + n(fr.width) + ' × ' + n(fr.height) + '</b></div>';
    rows += '<div class="m ' + (400 >= need ? 'good' : 'bad') + '"><span>原檔夠不夠（需 ' + need + '）</span><b>400 ' + (400 >= need ? '夠' : '不夠') + '</b></div>';
    rows += '<div class="m ' + (even ? 'good' : 'bad') + '"><span>照片四周三個間距</span><b>' + g.map(n).join(' / ') + '</b></div>';
    rows += '<div class="m"><span>同一列還有</span><b>' + mates.length + ' 張</b></div>';
    rows += '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>';
    rows += '<hr><div class="pvbar-note"><b>' + LBL[st] + '</b>：' + NOTE[st] +
      '<br>版面是 2026-09-19 已經定案的那一套，這一頁只換裁切；各格差在頭在圓裡多滿，' +
      '和站上那四顆並排比比看。要對照沒有照片的樣子按最底下那一顆。</div>';
    foot.innerHTML = rows;
  }
  addEventListener('resize', measure);
  apply();
})();
</script>
`.replace('BARCSS', BAR_CSS).replace('NOTEMAP', NOTE_MAP);

/* ---- (3) 切換條插在**最後一個** body 結束標籤前面 ---------------------
   ⚠ 這一站的註解裡就寫著那幾個字，用 String.replace 會換到註解裡那一個。 */
const END = '</' + 'body>';
const i = html.lastIndexOf(END);
if (i < 0) throw new Error('找不到 body 的結束標籤');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(DIR, { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-chen/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
