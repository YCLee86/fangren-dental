#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-linxu/ 的產生器
   --------------------------------------------------------------------------
   林晏妤、許馨文兩位醫師的形象照：把 index.html 做成快照，在兩張卡上掛照片。
   起因：2026-09-24 使用者給兩張，「黃襯衫是林晏妤醫師 紫襯衫是許馨文醫師
   合上網站醫師圖卡 給我看預覽」。照楊小瑩那一支
   （git show 482014fd:tools/doctor-yang-preview.mjs）改的，一頁掛兩位。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-linxu-crop.mjs && node tools/doctor-linxu-preview.mjs

   ⚠⚠ 版面不必在這裡做 —— 圓頭像那一套 2026-09-19 已經定案上線，
       這一頁只在兩張卡補 data-face 與 picture（和站上那六張同一個寫法）。
       切換條上那幾格是**框的大小**（頭在圓裡多滿）。

   ⚠ 定案之後要做的：挑中那一格的框搬進 tools/doctor-photo-crop.mjs 的 FACES
     （slug 用 lin-yanyu、xu-xinwen）→ 出正式檔 → index.html 兩張卡補 data-face
     與 picture → webp → topics → build；然後刪掉這一頁與兩支產生器，推導搬進 history/。

   CLAUDE.md 第八節那四個陷阱都照做了，另外也剝掉 search-log.js 與 click-log.js。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JOBS } from './doctor-linxu-crop.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR  = join(ROOT, 'preview', 'doctor-linxu');
const OUT  = join(DIR, 'index.html');
const KEYS = ['a', 'b', 'c', 'd'];

for (const who of ['lin', 'xu']) KEYS.forEach((k) => {
  if (!existsSync(join(DIR, 'img', who + '-' + k + '-400.jpg')))
    throw new Error('找不到 img/' + who + '-' + k + '-400.jpg —— 先跑 node tools/doctor-linxu-crop.mjs');
});

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const NOTE = `<!-- ==========================================================================
     提案：林晏妤、許馨文兩位醫師的形象照（2026-09-24）
     --------------------------------------------------------------------------
     使用者：「黃襯衫是林晏妤醫師 紫襯衫是許馨文醫師 合上網站醫師圖卡 給我看預覽」

     尺的單位照廖立揚那一輪：頭高（髮頂到下巴）佔框高的比例。
     站上現在：李柄輝 81／李侑津 81／謝耀慶 ~79／王俊偉 77／楊小瑩 74／陳芷鈴 71%。

     許馨文（原圖 1086x1448；髮頂 185／眼睛 490／下巴 775／臉中線 570）
       Ⓐ 71%　框 831　頭頂留白 7.5%
       Ⓑ 74%　框 797　頭頂留白 5.9%（預設，和楊小瑩、廖立揚挑的同一格）
       Ⓒ 77%　框 766　頭頂留白 4.4%
       Ⓓ 81%　框 728　頭頂留白 2.3%

     林晏妤（原圖 1051x1497；帽頂 155／眼睛 580／下巴 960／臉中線 548）
       ⚠ 手術帽很高、照片取景近：整張寬 1051 當框就是最鬆的一格。
         上緣改成「帽頂留白 4%」定（照眼睛 44.2% 定的話帽頂會被切掉）。
       Ⓐ 77%　框 1051（預設；臉中線 52.1%，原圖邊界所限）
       Ⓑ 79%　框 1020
       Ⓒ 81%　框 990
       Ⓓ 84%　框 960
       Ⓐ 那一格「眼睛到下巴」佔框 36.2%，和許馨文 Ⓑ 的 35.8% 幾乎一樣 ——
       臉的大小兩位對得上，差的只是那頂帽子。

     網址參數 ?lin=a|b|c|d&xu=a|b|c|d（不帶 ＝ 林 Ⓐ、許 Ⓑ）
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

/* ---- 兩張卡：補 data-face 與 picture（沒有 source —— 切換條改 img.src 才會生效）
   ⚠⚠ 錨點用**完整的 h3**（名字＋藥丸文字，全站唯一），再往回找最近的 article。
   ⚠ data-face 是屬性不是 class —— schema.mjs 用 <article class="doc" 緊接引號比對醫師。 */
const ALT = {
  lin: '林晏妤醫師的形象照，身著白袍、戴著花布手術帽站在診所候診區',
  xu:  '許馨文醫師的形象照，身著白袍站在診所候診區',
};
const DEF = { lin: 'a', xu: 'b' };
const H3 = {
  lin: '<h3>林晏妤<span class="doc-role">兒牙專科醫師</span></h3>',
  xu:  '<h3>許馨文<span class="doc-role">口外專科醫師</span></h3>',
};
for (const who of ['lin', 'xu']) {
  if (html.split(H3[who]).length !== 2) throw new Error('找不到（或找到不只一個）' + who + ' 的 h3');
  const at  = html.indexOf(H3[who]);
  const art = html.lastIndexOf('<article class="doc"', at);
  const seg = html.slice(art, at);
  if (seg.includes('data-face') || seg.includes('<picture')) throw new Error(who + ' 那張卡已經有照片了？');
  const open = seg.match(/^<article class="doc" data-spec="[a-z]+">/);
  if (!open) throw new Error(who + ' 那張卡的 article 開頭和預期不同');
  const fixed = open[0].replace('<article class="doc"', '<article class="doc" data-face') +
    seg.slice(open[0].length).replace(/\n(\s*)$/, '\n$1<picture class="doc-face">\n' +
    '            <img class="pv-face" data-who="' + who + '" src="img/' + who + '-' + DEF[who] + '-400.jpg" width="400" height="400" alt="' + ALT[who] + '">\n' +
    '          </picture>\n$1');
  html = html.slice(0, art) + fixed + html.slice(at);
}
const got = (html.match(/<article class="doc" data-face/g) || []).length;
if (got !== 8) throw new Error('data-face 有 ' + got + ' 張，預期 8 張（站上 6 ＋ 這一輪 2）');

const BAR_CSS = ".pvbar, .pvbar * { box-sizing: border-box; }\n.pvbar {\n  position: fixed; z-index: 999; right: 12px; top: 12px;\n  font: 400 13px/1.6 \"PingFang TC\",\"Noto Sans TC\",\"Microsoft JhengHei\",system-ui,sans-serif;\n  color: #f2f0ee;\n}\n.pvbar-btn {\n  display: flex; align-items: center; gap: .4em; margin-left: auto;\n  padding: .5em .8em; min-height: 36px;\n  background: rgba(20,18,16,.92); color: #f2f0ee;\n  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;\n  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;\n  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);\n}\n.pvbar-btn b { font-weight: 700; opacity: .8; }\n.pvbar-panel {\n  display: none; margin-top: 8px; width: min(340px, calc(100vw - 24px));\n  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */\n  flex-direction: column; max-height: calc(100svh - 68px);\n  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);\n  border-radius: 10px; overflow: hidden;\n  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);\n  box-shadow: 0 12px 34px rgba(0,0,0,.45);\n}\n.pvbar[data-open=\"1\"] .pvbar-panel { display: flex; }\n.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }\n.pvbar-g { padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }\n.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }\n.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }\n.pvbar-row button {\n  flex: 1 1 0; padding: .45em .2em; min-height: 42px;\n  background: rgba(255,255,255,.07); color: #cfc9c2;\n  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;\n  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;\n}\n.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }\n.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }\n.pvbar-row button[aria-pressed=\"true\"] {\n  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;\n}\n.pvbar-row button[aria-pressed=\"true\"] small { color: rgba(20,18,15,.7); }\n.pvbar-row.is-off { opacity: .38; }\n.pvbar-foot {\n  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);\n  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;\n}\n.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }\n.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }\n.pvbar-foot .m.good b { color: #8fd6a4; }\n.pvbar-foot .m.bad  b { color: #ff9a9a; }\n.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }\n.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }\n.pvbar-note b { color: #cfc9c2; font-weight: 600; }\n@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }\n@media print { .pvbar { display: none; } }";

const info = (k) => { const j = JOBS[k], [x, y, w] = j.sq;
  return '框 ' + j.sq.join(',') + '　頭頂留白 ' + ((j.p.hair - y) / w * 100).toFixed(1) + '%、頭高 ' +
    ((j.p.chin - j.p.hair) / w * 100).toFixed(0) + '%'; };
const NOTE_MAP = JSON.stringify(Object.fromEntries(Object.keys(JOBS).map((k) => [k, info(k)])));
const SZ = (who, k) => JOBS[who + '-' + k].sq[2];
const PCT = (who, k) => { const j = JOBS[who + '-' + k]; return Math.round((j.p.chin - j.p.hair) / j.sq[2] * 100) + '%'; };
const row = (who) => KEYS.map((k) => '        <button type="button" data-v="' + k + '">' + 'ⒶⒷⒸⒹ'[KEYS.indexOf(k)] +
  '<small>' + PCT(who, k) + '・' + SZ(who, k) + '</small></button>').join('\n');

const BAR = `
<!-- 切換條（提案用）。定案之後整段連同 pv-face 兩張圖一起刪掉。 -->
<style>
BARCSS
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">林・許 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">林晏妤（黃襯衫）　<em>頭高佔圓・框</em></div>
      <div class="pvbar-row" data-k="lin">
ROWLIN
      </div>
      <div class="pvbar-g">許馨文（紫襯衫）　<em>頭高佔圓・框</em></div>
      <div class="pvbar-row" data-k="xu">
ROWXU
      </div>
      <div class="pvbar-row">
        <button type="button" data-go="1">捲到醫師介紹</button>
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
  var imgs = { lin: document.querySelector('.pv-face[data-who="lin"]'), xu: document.querySelector('.pv-face[data-who="xu"]') };
  var DEF  = { lin: 'a', xu: 'b' };
  var st   = { lin: DEF.lin, xu: DEF.xu };
  var NOTE = NOTEMAP;
  var qs = new URLSearchParams(location.search);
  ['lin','xu'].forEach(function (w) { var v = qs.get(w); if (v && /^[a-d]$/.test(v)) st[w] = v; });

  addEventListener('load', function () {
    ['lin','xu'].forEach(function (w) { ['a','b','c','d'].forEach(function (k) { new Image().src = 'img/' + w + '-' + k + '-400.jpg'; }); });
  });

  function apply() {
    ['lin','xu'].forEach(function (w) {
      imgs[w].src = 'img/' + w + '-' + st[w] + '-400.jpg';
      Array.prototype.forEach.call(box.querySelectorAll('.pvbar-row[data-k="' + w + '"] button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[w]));
      });
    });
    var p = [];
    ['lin','xu'].forEach(function (w) { if (st[w] !== DEF[w]) p.push(w + '=' + st[w]); });
    history.replaceState(null, '', location.pathname + (p.length ? '?' + p.join('&') : '') + location.hash);
    btn.querySelector('b').textContent = '林 ' + 'ⒶⒷⒸⒹ'['abcd'.indexOf(st.lin)] + '・許 ' + 'ⒶⒷⒸⒹ'['abcd'.indexOf(st.xu)];
    measure();
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.pvbar-row button'); if (!b) return;
    if (b.dataset.go) { document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' }); return; }
    st[b.parentNode.dataset.k] = b.dataset.v; apply();
  });
  btn.addEventListener('click', function () {
    var o = box.dataset.open === '1' ? '0' : '1';
    box.dataset.open = o; btn.setAttribute('aria-expanded', o === '1');
    if (o === '1') measure();
  });

  function n(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function measure() {
    if (box.dataset.open !== '1') return;
    var rows = '<div class="m"><span>視窗寬</span><b>' + window.innerWidth + '</b></div>';
    ['lin','xu'].forEach(function (w) {
      var img = imgs[w], card = img.parentNode.parentNode;
      var cr = card.getBoundingClientRect(), fr = img.getBoundingClientRect();
      var t = card.querySelector('h3').firstChild;
      var rg = document.createRange(); rg.setStart(t, 0); rg.setEnd(t, t.length);
      var ink = rg.getBoundingClientRect();
      var g = [fr.left - cr.left, fr.top - cr.top, ink.left - fr.right];
      var even = Math.max.apply(null, g) - Math.min.apply(null, g) < 0.6;
      rows += '<div class="m ' + (even ? 'good' : 'bad') + '"><span>' + (w === 'lin' ? '林' : '許') + '・頭像 ' + n(fr.width) + '，四周間距</span><b>' + g.map(n).join(' / ') + '</b></div>';
    });
    var need = Math.round(76 * (window.devicePixelRatio || 1));
    var over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    rows += '<div class="m ' + (400 >= need ? 'good' : 'bad') + '"><span>原檔 400 夠不夠（需 ' + need + '）</span><b>' + (400 >= need ? '夠' : '不夠') + '</b></div>';
    rows += '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>';
    rows += '<hr><div class="pvbar-note"><b>林</b>：' + NOTE['lin-' + st.lin] + '<br><b>許</b>：' + NOTE['xu-' + st.xu] +
      '<br>站上現在：李柄輝 81／李侑津 81／王俊偉 77／楊小瑩 74／陳芷鈴 71%。' +
      '林醫師的帽子很高、照片取景近，Ⓐ 已經是整張寬（最鬆），臉的大小和許醫師 Ⓑ 差不多。</div>';
    foot.innerHTML = rows;
  }
  addEventListener('resize', measure);
  apply();
})();
</script>
`.replace('BARCSS', BAR_CSS).replace('NOTEMAP', NOTE_MAP).replace('ROWLIN', row('lin')).replace('ROWXU', row('xu'));

const END = '</' + 'body>';
const i = html.lastIndexOf(END);
if (i < 0) throw new Error('找不到 body 的結束標籤');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(DIR, { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-linxu/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
