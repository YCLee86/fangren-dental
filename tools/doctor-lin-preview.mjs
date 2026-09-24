#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-lin/ 的產生器
   --------------------------------------------------------------------------
   林晏妤醫師換照片（第二輪）：把 index.html 做成快照，把她那張卡的照片換成新的。
   起因：2026-09-24 第一張（框 1051）上線同日，使用者「林晏妤換這張 做預覽給我看」。
   照楊小瑩第二輪那一支（git show 482014fd:tools/doctor-yang-preview.mjs）改的。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-lin-crop.mjs && node tools/doctor-lin-preview.mjs

   ⚠ 定案之後要做的：新原檔蓋掉 drafts/doctor-photo/src/lin-yanyu.png、
     挑中那一格的框寫進 tools/doctor-photo-crop.mjs 的 FACES → 重出
     assets/doctor-lin-yanyu-400.jpg → webp → topics → build（檔名沒變，
     index.html 不必動）；然後刪掉這一頁與兩支腳本，推導搬進 history/doctor-photo.html。
     ⚠ LINE 那條線的醫師卡（924f4763）也吃這張照片，定案後要重跑它的產生器。

   CLAUDE.md 第八節那四個陷阱都照做了，另外也剝掉 search-log.js 與 click-log.js。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INFO } from './doctor-lin-crop.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR  = join(ROOT, 'preview', 'doctor-lin');
const OUT  = join(DIR, 'index.html');
const KEYS = ['a', 'b', 'c', 'd'];

KEYS.forEach((k) => {
  if (!existsSync(join(DIR, 'img', 'lin-' + k + '-400.jpg')))
    throw new Error('找不到 img/lin-' + k + '-400.jpg —— 先跑 node tools/doctor-lin-crop.mjs');
});

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const NOTE = `<!-- ==========================================================================
     提案：林晏妤醫師換照片・第二輪（2026-09-24）
     --------------------------------------------------------------------------
     第一張（框 1051）當天已經上線，使用者：「林晏妤換這張 做預覽給我看」。
     新照片 1051x1497，取景和第一張幾乎一樣，背景換成冷灰的診間。
     量到 帽頂 150／眼睛 580／下巴 965／臉中線 548。
     做法同第一張：帽子高、取景近，整張寬 1051 就是最鬆的一格；
     上緣用「帽頂留白 4%」定、臉中線 49.3% 但夾在原圖裡。

       Ⓐ ${INFO.a}（預設，和第一張同框）
       Ⓑ ${INFO.b}
       Ⓒ ${INFO.c}
       Ⓓ ${INFO.d}
       現況　站上現在那張（第一張、框 0,113,1051,1051）

     網址參數 ?p=now|a|b|c|d（不帶 ＝ Ⓐ）
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

/* ---- 林晏妤那張卡：她的照片已經在站上（第一張），這裡把整個 picture 換掉 --
   ⚠ 換成**沒有 source 的 picture**：留著 webp 的 source 的話，改 img.src 不會生效
     （瀏覽器仍然吃 source 那一張），切換條就會一直顯示現況。
   ⚠⚠ 錨點用**完整的 h3**（名字＋藥丸文字，全站唯一），再往回找最近的 article。 */
const TAG = '<article class="doc"';
const H3  = '<h3>林晏妤<span class="doc-role">兒牙專科醫師</span></h3>';
if (html.split(H3).length !== 2) throw new Error('找不到（或找到不只一個）林晏妤的 h3');
const at  = html.indexOf(H3);
const art = html.lastIndexOf(TAG, at);
if (art < 0) throw new Error('林晏妤的 h3 前面找不到 article');
const seg = html.slice(art, at);
const PIC = /<picture class="doc-face">[\s\S]*?<\/picture>/;
if (!PIC.test(seg) || !seg.includes('doctor-lin-yanyu-400')) throw new Error('林晏妤那張卡上找不到現況的 picture');
const ALT = '林晏妤醫師的形象照，身著白袍、戴著花布手術帽站在診所候診區';
html = html.slice(0, art) + seg.replace(PIC, '<picture class="doc-face">\n' +
  '            <img class="pv-face" src="img/lin-a-400.jpg" width="400" height="400" alt="' + ALT + '">\n' +
  '          </picture>') + html.slice(at);
/* 守門：站上八位有照片，這一輪不增不減。 */
const got = (html.match(/<article class="doc" data-face/g) || []).length;
if (got !== 8) throw new Error('data-face 有 ' + got + ' 張，預期 8 張');

const BAR_CSS = ".pvbar, .pvbar * { box-sizing: border-box; }\n.pvbar {\n  position: fixed; z-index: 999; right: 12px; top: 12px;\n  font: 400 13px/1.6 \"PingFang TC\",\"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;\n  color: #f2f0ee;\n}\n.pvbar-btn {\n  display: flex; align-items: center; gap: .4em; margin-left: auto;\n  padding: .5em .8em; min-height: 36px;\n  background: rgba(20,18,16,.92); color: #f2f0ee;\n  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;\n  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;\n  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);\n}\n.pvbar-btn b { font-weight: 700; opacity: .8; }\n.pvbar-panel {\n  display: none; margin-top: 8px; width: min(340px, calc(100vw - 24px));\n  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */\n  flex-direction: column; max-height: calc(100svh - 68px);\n  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);\n  border-radius: 10px; overflow: hidden;\n  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);\n  box-shadow: 0 12px 34px rgba(0,0,0,.45);\n}\n.pvbar[data-open=\"1\"] .pvbar-panel { display: flex; }\n.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }\n.pvbar-g { padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }\n.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }\n.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }\n.pvbar-row button {\n  flex: 1 1 0; padding: .45em .2em; min-height: 42px;\n  background: rgba(255,255,255,.07); color: #cfc9c2;\n  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;\n  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;\n}\n.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }\n.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }\n.pvbar-row button[aria-pressed=\"true\"] {\n  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;\n}\n.pvbar-row button[aria-pressed=\"true\"] small { color: rgba(20,18,15,.7); }\n.pvbar-row.is-off { opacity: .38; }\n.pvbar-foot {\n  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);\n  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;\n}\n.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }\n.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }\n.pvbar-foot .m.good b { color: #8fd6a4; }\n.pvbar-foot .m.bad  b { color: #ff9a9a; }\n.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }\n.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }\n.pvbar-note b { color: #cfc9c2; font-weight: 600; }\n@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }\n@media print { .pvbar { display: none; } }";
const NOTE_MAP = JSON.stringify(INFO);

const BAR = `
<!-- 切換條（提案用）。定案之後整段連同 pv-face 那張圖一起刪掉。 -->
<style>
BARCSS
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">林晏妤 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">框的大小　<em>版面已定案，這裡只換裁切</em></div>
      <div class="pvbar-row" data-k="p">
        <button type="button" data-v="a">Ⓐ<small>1051</small></button>
        <button type="button" data-v="b">Ⓑ<small>1020</small></button>
        <button type="button" data-v="c">Ⓒ<small>990</small></button>
        <button type="button" data-v="d">Ⓓ<small>960</small></button>
      </div>
      <div class="pvbar-row">
        <button type="button" data-v="now">對照現況（站上現在那張）</button>
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
  var ALL  = ['a','b','c','d','now'];
  var LBL  = { a:'Ⓐ 1051', b:'Ⓑ 1020', c:'Ⓒ 990', d:'Ⓓ 960', now:'現況（第一張）' };
  var NOTE = NOTEMAP;
  var st = 'a';

  var q = new URLSearchParams(location.search).get('p');
  if (q !== null && ALL.indexOf(q) >= 0) st = q;

  /* 每一格都先抓下來，切換才不必等下載 —— Worker 對 preview 設 no-store，
     不預抓的話每按一次都要重抓一遍（og-topic-card 那一輪定下的做法）。 */
  addEventListener('load', function () {
    ['a','b','c','d'].forEach(function (k) { new Image().src = 'img/lin-' + k + '-400.jpg'; });
  });

  function apply() {
    img.src = st === 'now' ? '../../assets/doctor-lin-yanyu-400.jpg' : 'img/lin-' + st + '-400.jpg';
    Array.prototype.forEach.call(box.querySelectorAll('.pvbar-row button'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === st));
    });
    history.replaceState(null, '', st === 'a' ? location.pathname : '?p=' + st);
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
    rows += '<hr><div class="pvbar-note"><b>' + LBL[st] + '</b>：' + (NOTE[st] || '站上現在那張：第一張照片，裁切 0,113,1051,1051') +
      '<br>版面是 2026-09-19 已經定案的那一套，這一頁只換照片與裁切；' +
      '要對照站上現在那張（第一張）按最底下那一顆。</div>';
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
console.log('寫好 preview/doctor-lin/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
