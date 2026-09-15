/* ==========================================================================
   tools/map-alley-preview.mjs　—— 產生 preview/clinic-map-alley/index.html
   --------------------------------------------------------------------------
   提案：簡易地圖上補一條沒畫到的小巷（2026-09-15 開）。
   使用者：「文化路上平和街口跟元大銀行中間有一條小巷」。

   跑法：node tools/map-alley-preview.mjs　（在 repo 根目錄）

   ⚠ 產出的那一頁是 index.html 的**快照** —— main 被推過、或 index.html 改過
     之後要**重跑一次**，不然「對照現況」不等於正式站（CLAUDE.md 第八節）。
   ⚠ 定案上線之後：把選上的那一格搬進 index.html，然後把 preview/clinic-map-alley/
     和這支產生器一起刪掉，推導搬進 history/clinic-map-alley.html。
   ⚠ 這支是模板字串，裡面的註解**不可以出現反引號**，也不可以出現註解的結束記號
     ——所以一律用 「」（CLAUDE.md 第九節第 8、24 條）。
   ========================================================================== */
import fs from 'node:fs';

const SRC = 'index.html';
const DIR = 'preview/clinic-map-alley';
const OUT = DIR + '/index.html';
let h = fs.readFileSync(SRC, 'utf8');

/* ---- 1. 相對路徑往上兩層（提案頁在 /preview/<name>/） --------------------- */
h = h.replace(/(["'\s(])assets\//g, '$1../../assets/');
h = h.replace(/href="posts\//g, 'href="/posts/');
h = h.replace(/href="topics\//g, 'href="/topics/');
h = h.replace(/href="\.\/"/g, 'href="/"');
h = h.replace(/href="site\.webmanifest[^"]*"/g, 'href="/site.webmanifest"');

/* ---- 2. 計數器整支拿掉（不然每開一次提案頁，首頁的計數就多一次） --------- */
h = h.replace(/\n<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/,
  '\n<!-- 提案頁：assets/counter.js 整支拿掉（CLAUDE.md 第八節）。 -->');
h = h.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on">');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">—</span>');
/* ⚠ 這兩道要在剝掉註解之後驗 —— 站上的註解裡就寫著那兩個字。 */
const bare = h.replace(/<!--[\s\S]*?-->/g, '');
if (/data-views-self/.test(bare)) throw new Error('data-views-self 還在');
if (/src="[^"]*counter\.js"/.test(bare)) throw new Error('counter.js 還在');

/* ---- 3. noindex ---------------------------------------------------------- */
h = h.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<meta name="robots" content="noindex, nofollow, noarchive">');
h = h.replace(/<link rel="canonical"[^>]*>\n/, '');
h = h.replace('<title>芳仁牙醫診所｜雲林斗六・永樂街</title>',
  '<title>提案：地圖補一條小巷｜芳仁牙醫</title>');

/* ---- 4. 文化路北邊那一排街廓 --------------------------------------------- */
/*    兩件事都發生在同一排：
        ・補一條小巷（x 212 附近）
        ・平和街到文化路就到底了，北邊那一截要補起來（使用者 2026-09-15 指出）
      ⚠ 街廓與街道的座標一個單位都沒動 —— 只是把那一排的兩塊各自換成可以現算寬度的
        三塊，由切換條決定：現況 ＝ 逐格等於站上那兩塊。 */
const OLD_W = '                  <rect x="-20" y="-20" width="114" height="41" rx="4"/>';
const OLD_M = '                  <rect x="124" y="-20" width="200" height="41" rx="4"/>';
if (h.split(OLD_W).length !== 2) throw new Error('平和街以西、文化路北邊那一塊找不到、或不只一塊');
if (h.split(OLD_M).length !== 2) throw new Error('平和街～永樂街、文化路北邊那一塊找不到、或不只一塊');
h = h.replace(OLD_W, '                  <rect class="pv-blk-w" x="-20" y="-20" width="114" height="41" rx="4"/>');
h = h.replace(OLD_M,
  '                  <rect class="pv-blk-l" x="124" y="-20" width="200" height="41" rx="4"/>\n' +
  '                  <rect class="pv-blk-r" x="324" y="-20" width="0" height="41" rx="4"/>');

/* ---- 5. 提案用的樣式（pv 前綴，見 CLAUDE.md 第八節） --------------------- */
const CSS = '<style>\n' +
'.pv-bar {\n' +
'  position: fixed; left: 0; right: 0; bottom: 0; z-index: 999;\n' +
'  background: rgba(244, 244, 245, .94); backdrop-filter: blur(8px) saturate(1.1);\n' +
'  border-top: 1px solid var(--rule);\n' +
'  padding: .5rem .7rem calc(.5rem + env(safe-area-inset-bottom));\n' +
'  font-size: 12px; line-height: 1.4; color: var(--ink);\n' +
'  max-height: 42vh; overflow: auto;\n' +
'}\n' +
'.pv-row { display: flex; align-items: center; gap: .3rem; flex-wrap: wrap; margin-bottom: .34rem; }\n' +
'.pv-row:last-child { margin-bottom: 0; }\n' +
'.pv-lab { width: 3.4em; flex: none; color: var(--ink-soft); }\n' +
'.pv-bar button {\n' +
'  font: inherit; padding: .28rem .5rem; border-radius: 8px; cursor: pointer;\n' +
'  border: 1px solid var(--rule); background: #fff; color: var(--ink);\n' +
'}\n' +
'.pv-bar button[aria-pressed="true"] { background: #3f654a; border-color: #3f654a; color: #fff; }\n' +
'.pv-panel { margin-top: .4rem; padding-top: .4rem; border-top: 1px dashed var(--rule);\n' +
'            color: var(--ink-soft); font-size: 11.5px; }\n' +
'.pv-panel b { color: var(--ink); font-weight: 700; }\n' +
'</style>\n';
h = h.replace('</head>', CSS + '</head>');

/* ---- 6. 切換條：插在**最後一個** </body> 前面 ---------------------------- */
/*    ⚠ 這一站的註解裡就寫著結束標籤那幾個字，用 replace 會換到註解裡那一個。 */
const BAR = [
'',
'<!-- ==========================================================================',
'     切換條（提案用）。⚠ 定案時連同 data-* 屬性一起刪掉，不要留到正式站。',
'     網址參數（正規式一律 [a-z0-9]+）：?w=now|w12|w17|w21',
'     ========================================================================== -->',
'<div class="pv-bar" id="pvBar">',
'  <div class="pv-row">',
'    <span class="pv-lab">小巷</span>',
'    <button data-v="now">對照現況</button>',
'    <button data-v="w12">窄 12</button>',
'    <button data-v="w17">中 17</button>',
'    <button data-v="w21">寬 21</button>',
'  </div>',
'  <div class="pv-panel" id="pvPanel">量測中…</div>',
'</div>',
'<script>',
'(function () {',
'  /* 小巷的中心 x ＝ 212（viewBox 單位）。',
'     那是量出來的不是挑的：使用者那張 Google 地圖截圖（1125 寬）上，',
'     平和街中心 169、永樂街中心 890、小巷中心 491 —— 小巷落在兩條街之間的 44.7%。',
'     這張圖上平和街中心 109、永樂街中心 339，109 + 0.4466 × 230 ＝ 211.7。 */',
'  var CX = 212, L0 = 124, R0 = 324;',
'  var W = { now: 0, w12: 12, w17: 17, w21: 21 };',
'  var order = ["now", "w12", "w17", "w21"];',
'  var cur = "w12";',
'  var m = /[?&]w=([a-z0-9]+)/.exec(location.search);',
'  if (m && W[m[1]] !== undefined) cur = m[1];',
'',
'  var blkW = document.querySelector(".pv-blk-w");',
'  var blkL = document.querySelector(".pv-blk-l");',
'  var blkR = document.querySelector(".pv-blk-r");',
'  var svg  = document.querySelector(".map-svg");',
'',
'  /* 平和街以西那一塊的原樣（現況 ＝ -20 到 94，北邊留著平和街的缺口）。 */',
'  var WX = -20, WR = 94;',
'',
'  function paint() {',
'    var w = W[cur];',
'    if (!w) {',
'      /* 對照現況：逐格等於站上那兩塊。 */',
'      blkW.setAttribute("width", WR - WX);',
'      blkL.setAttribute("x", L0); blkL.setAttribute("width", R0 - L0);',
'      blkR.setAttribute("x", R0); blkR.setAttribute("width", 0);',
'    } else {',
'      /* 平和街到文化路就到底 —— 西邊那一塊直接長到小巷的左緣，中間那一塊收成 0。 */',
'      blkW.setAttribute("width", (CX - w / 2) - WX);',
'      blkL.setAttribute("x", CX - w / 2); blkL.setAttribute("width", 0);',
'      blkR.setAttribute("x", CX + w / 2);',
'      blkR.setAttribute("width", R0 - (CX + w / 2));',
'    }',
'    document.querySelectorAll(".pv-bar button[data-v]").forEach(function (b) {',
'      b.setAttribute("aria-pressed", b.dataset.v === cur ? "true" : "false");',
'    });',
'    var u = new URL(location.href); u.searchParams.set("w", cur);',
'    history.replaceState(null, "", u);',
'    measure();',
'  }',
'',
'  function measure() {',
'    var w = W[cur], p = document.getElementById("pvPanel");',
'    /* 螢幕上多大：拿 SVG 自己的 CTM 算，不要自己推 preserveAspectRatio 的比例尺。 */',
'    var ctm = svg.getScreenCTM(), k = ctm ? ctm.a : 0;',
'    /* 街廓北緣露出來的那一段 ＝ 0 ~ 21（rect 從 -20 畫到 21，框外那 20 看不到）。 */',
'    var stub = 21;',
'    var pct = ((CX - 109) / (339 - 109) * 100).toFixed(1);',
'    var road = 30;',
'    var out = document.documentElement.scrollWidth - document.documentElement.clientWidth;',
'    p.innerHTML =',
'      (w ? "小巷 <b>寬 " + w + "</b>（圖上 " + (w * k).toFixed(1) + "px）・往北一段 " + stub +',
'           "（圖上 " + (stub * k).toFixed(1) + "px）<br>平和街 <b>到文化路就到底</b>，北邊那一截補起來了"',
'         : "<b>現況：沒有這條巷子，而且平和街穿過文化路往北</b>") +',
'      "<br>中心 x <b>" + CX + "</b>　＝ 平和街到永樂街之間的 <b>" + pct + "%</b>" +',
'      "（Google 地圖上量到 44.7%）" +',
'      "<br>寬度比一條街（" + road + "）＝ " + (w ? (w / road * 100).toFixed(0) + "%" : "—") +',
'      "　現有的巷子：平行巷與 33 巷 12、19 巷與 14 巷 17" +',
'      "<br>比例尺 1 單位 ＝ " + k.toFixed(3) + "px　水平捲動 " + (out > 0 ? "<b>⚠ " + out + "px</b>" : "0");',
'  }',
'',
'  document.querySelectorAll(".pv-bar button[data-v]").forEach(function (b) {',
'    b.addEventListener("click", function () { cur = b.dataset.v; paint(); });',
'  });',
'  addEventListener("resize", measure);',
'  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);',
'  paint();',
'',
'  /* 開頁直接停在地圖那張卡（手機上要判斷的就是它）。 */',
'  if (!location.hash) addEventListener("load", function () {',
'    var c = document.querySelector(".card-map"); if (!c) return;',
'    var bar = document.getElementById("pvBar").getBoundingClientRect().height;',
'    var hd = document.querySelector(".site-head");',
'    var hh = hd ? hd.getBoundingClientRect().height : 0;',
'    var r = c.getBoundingClientRect(), top = r.top + scrollY;',
'    var room = innerHeight - bar - hh;',
'    scrollTo({ top: Math.max(0, top - hh - Math.max(10, (room - r.height) / 2)), behavior: "auto" });',
'    setTimeout(measure, 60);',
'  });',
'})();',
'<\/script>'
].join('\n');

const iBody = h.lastIndexOf('</body>');
if (iBody < 0) throw new Error('找不到 body 的結束標籤');
h = h.slice(0, iBody) + BAR + '\n' + h.slice(iBody);

/* ---- 7. 守門：產出的 script 逐行數單引號（CLAUDE.md 第九節第 24 條） ------ */
const scripts = h.match(/<script>[\s\S]*?<\/script>/g) || [];
scripts.forEach(function (s, i) {
  s.split('\n').forEach(function (line, n) {
    if ((line.match(/'/g) || []).length % 2) throw new Error('第 ' + (i + 1) + ' 段 script 第 ' + (n + 1) + ' 行單引號沒有成對：' + line.trim());
  });
});

fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(OUT, h);
console.log('寫出 ' + OUT + '　' + (h.length / 1024).toFixed(1) + 'KB');
