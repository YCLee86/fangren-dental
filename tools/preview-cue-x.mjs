/* 一次性腳本：從 index.html 產生 preview/cue-x/index.html
   （iPad「往下滑」指標的水平位置 —— 提案頁）

   定案上線後這支腳本和提案頁一起刪掉，推導文字搬進 history/。
   index.html 改過之後要重新產一次：node tools/preview-cue-x.mjs
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTDIR = path.join(ROOT, 'preview/cue-x');
let h = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---- 1. 相對路徑往上兩層 ----
   ⚠ 要連 srcset 那種「逗號／換行／空白之後」的寫法一起換（2026-08-15 踩過，
     只換 ="assets/ 與 , assets/ 的話多行 srcset 會漏掉，圖直接不出來）。
   絕對網址（og:image、JSON-LD）前面是 `/`，不會被這條吃到。 */
h = h.replace(/(["'\s,])assets\//g, '$1../../assets/');

/* ---- 2. robots 換成 noindex ---- */
h = h.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');

/* ---- 3. 計數器整支拿掉，窄帶的數字寫死並手動加 .is-on ----
   不拿掉的話每開一次提案頁，首頁的真實計數就多一次。
   ⚠ 這個假數字絕對不要跟著版型搬回正式站（2026-08-07 踩過）。 */
h = h.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
h = h.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on">');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">1275</span>');

/* ---- 4. 標題 ---- */
h = h.replace(/<title>[^<]*<\/title>/,
  '<title>提案：往下滑的指標要往左多少 — 芳仁牙醫診所</title>');

const HEADNOTE = `
<!-- ==========================================================================
     提案：iPad「往下滑」指標的水平位置（2026-08-15）
     --------------------------------------------------------------------------
     使用者（看過上線版之後）：「有了。角形的位置太右下，往左一點。」

     ---- 現況 ------------------------------------------------------------
     .hero-cue 是 right: var(--pad)，也就是**貼齊窄帶內容的右緣**。
     --pad 是 clamp(1.25rem, 3vw, 2.5rem)，所以離螢幕右緣只有 21.6~30.7px：

         視窗        --pad    離螢幕右緣   離「5個／部定專科」字尾
         721x1200    21.6     21.6         93.1
         744x1133    22.3     22.3         103.9
         746x977     22.4     22.4         104.9
         768x1024    23.0     23.0         115.2
         820x1180    24.6     24.6         139.6
         834x1194    25.0     25.0         146.2
         1024x1366   30.7     30.7         235.5

     ---- 這一頁在比什麼 --------------------------------------------------
     只有一個變數：**往左再讓開多少 px**。
     right: calc(var(--pad) + N)，N ∈ {0, 16, 28, 44, 64}。

     ⚠ 為什麼是「固定 px」不是「對齊第三格」：第三格字尾到版心右緣的距離
       隨視窗從 93px 一路變到 235px（窄帶三格是置中的，版心卻是滿版），
       用它當錨點的話，同一條規則在 iPad mini 和 12.9 吋上會差一倍以上。
       使用者感覺到的是「離右下角多遠」，那是離**螢幕邊**的距離，所以用定值。

     ⚠ 垂直位置一個字都沒動（仍然是距窄帶下緣 34.9px ＝「5個／部定專科」
       那一列的中線）—— 使用者只說「往左」。

     ⚠ 44px 的觸控目標、慢速浮動、點到會亮、點下去自己 rAF 捲，全部照舊。
     ========================================================================== -->
`;

const BAR = `
<style>
/* ---- 提案：指標往左讓開多少（只作用在平板／直立那一段）---- */
@media (min-width: 721px) and (max-aspect-ratio: 9 / 10) {
  html[data-x="x0"] .hero-cue { right: var(--pad); }
  html[data-x="x1"] .hero-cue { right: calc(var(--pad) + 16px); }
  html[data-x="x2"] .hero-cue { right: calc(var(--pad) + 28px); }
  html[data-x="x3"] .hero-cue { right: calc(var(--pad) + 44px); }
  html[data-x="x4"] .hero-cue { right: calc(var(--pad) + 64px); }
}
/* 切換條自己 */
#sw { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(20, 19, 18, .93); color: #e8e6e2; padding: 7px 8px 9px;
  font: 12px/1.35 -apple-system, "Noto Sans TC", sans-serif;
  backdrop-filter: blur(8px); box-shadow: 0 -1px 0 rgba(255, 255, 255, .12); }
#sw .r { display: flex; align-items: center; gap: 4px; margin: 3px 0; }
#sw .r > b { flex: 0 0 4.6em; font-weight: 600; opacity: .72; font-size: 11px; }
#sw button { flex: 1 1 auto; min-width: 0; appearance: none; border: 1px solid rgba(255,255,255,.28);
  background: transparent; color: inherit; border-radius: 7px; padding: 6px 2px;
  font: inherit; font-size: 11.5px; letter-spacing: .01em; }
#sw button[aria-pressed="true"] { background: #e8e6e2; color: #191614; border-color: #e8e6e2; font-weight: 700; }
#sw .m { font-size: 10.5px; opacity: .62; margin-top: 5px; font-variant-numeric: tabular-nums; }
#sw .x { position: absolute; right: 6px; top: -30px; background: rgba(20,19,18,.93);
  border: 0; color: #e8e6e2; border-radius: 7px; padding: 5px 9px; font: inherit; }
#sw .more { width: 100%; margin-top: 5px; border-style: dashed; }
#swn { max-height: 46svh; overflow: auto; margin-top: 6px; padding-top: 6px;
  border-top: 1px solid rgba(255,255,255,.18); font-size: 11.5px; line-height: 1.6; }
#swn p { margin: 0 0 .7em; }
#swn code { font-size: 11px; opacity: .85; }
#swn .fine { opacity: .65; }
body { padding-bottom: 112px; }
</style>

<div id="sw">
  <button class="x" type="button" data-x>收起</button>
  <div class="r" data-k="x"><b>往左讓開</b>
    <button type="button" data-v="x0">原本</button><button type="button" data-v="x1">16</button><button type="button" data-v="x2">28 現行</button><button type="button" data-v="x3">44</button><button type="button" data-v="x4">64</button></div>
  <p class="m" id="swm"></p>
  <button class="more" type="button" data-more>說明 &#x25be;</button>
  <div id="swn" hidden>
    <p><b>28 已經上線了</b>（這一頁打開就是它，正式站現在也是這個）。
      原本離螢幕右緣只有 22~31px，
      比它自己的寬度（44px）還窄 —— 眼睛讀起來就是「卡在角落」。
      讓開 28 之後離邊 50~59px，大約是它自己的一個身寬，看起來是刻意擺的，
      而不是被擠到底。</p>
    <p><b>為什麼是固定 px、不是對齊第三格。</b>窄帶的三格是置中的，版心卻是滿版，
      所以「5個／部定專科」的字尾到右緣，從 iPad mini 的 104px 到 12.9 吋的 236px
      差了一倍以上。拿它當錨點，同一條規則在兩台 iPad 上會差很多；
      而使用者感覺到的「太右下」是離**螢幕角落**多遠。</p>
    <p><b>44 和 64 也留著比。</b>44 ＝ 讓開一個身寬（離邊 66~75px）、
      64 ＝ 讓開一個半（離邊 86~95px）。再往左就會開始靠近「5個／部定專科」，
      在最窄的 721 上只剩 29px。</p>
    <p class="fine">※ 垂直位置一個字都沒動（距窄帶下緣 34.9px ＝ 三格那一列的中線）。
      觸控目標 44×39.5、慢速浮動、點到會亮、點下去自己捲，全部照舊。</p>
  </div>
</div>

<script>
(function () {
  var root = document.documentElement;
  /* 網址參數。正規式一定要 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 x2 這種帶數字的值。 */
  var q = location.search, def = { x: 'x2' };
  Object.keys(def).forEach(function (k) {
    var m = q.match(new RegExp('[?&]' + k + '=([a-z0-9]+)'));
    root.setAttribute('data-' + k, m ? m[1] : def[k]);
  });

  function paint() {
    var cue = document.querySelector('.hero-cue');
    var m = document.getElementById('swm');
    if (!cue || getComputedStyle(cue).display === 'none') { m.textContent = '（這個尺寸看不到指標 —— 要用 iPad 直放或把視窗轉成直的）'; return; }
    var r = cue.getBoundingClientRect();
    var li = document.querySelectorAll('.stats li')[2];
    var ink = 0;
    if (li) { var rg = document.createRange(); rg.selectNodeContents(li); ink = rg.getBoundingClientRect().right; }
    m.textContent = '離螢幕右緣 ' + (innerWidth - r.right).toFixed(1) + 'px'
      + '　離「部定專科」字尾 ' + (r.left - ink).toFixed(1) + 'px'
      + '　指標 ' + r.width.toFixed(0) + '×' + r.height.toFixed(0)
      + '　視窗 ' + innerWidth + '×' + innerHeight;
  }

  document.querySelectorAll('#sw .r').forEach(function (row) {
    var k = row.dataset.k;
    row.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        root.setAttribute('data-' + k, b.dataset.v);
        sync(); paint();
        var u = new URL(location.href); u.searchParams.set(k, b.dataset.v);
        history.replaceState(null, '', u);
      });
    });
  });
  function sync() {
    document.querySelectorAll('#sw .r').forEach(function (row) {
      var v = root.getAttribute('data-' + row.dataset.k);
      row.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === v));
      });
    });
  }
  document.querySelector('#sw [data-more]').addEventListener('click', function () {
    var n = document.getElementById('swn');
    n.hidden = !n.hidden;
    this.textContent = n.hidden ? '說明 ▾' : '說明 ▴';
  });
  document.querySelector('#sw [data-x]').addEventListener('click', function () {
    var sw = document.getElementById('sw');
    var off = sw.style.transform === 'translateY(78%)';
    sw.style.transform = off ? '' : 'translateY(78%)';
    this.textContent = off ? '收起' : '打開';
  });
  sync(); paint();
  addEventListener('resize', paint);
  addEventListener('orientationchange', function () { setTimeout(paint, 250); });
  addEventListener('load', paint);
})();
</script>
`;

const hi = h.lastIndexOf('</head>');
if (hi < 0) throw new Error('找不到 </head>');
h = h.slice(0, hi) + HEADNOTE + h.slice(hi);

/* ⚠ 切換條要插在**最後一個** </body> 前面 —— 這一站的註解裡就有那個字串。 */
const i = h.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
h = h.slice(0, i) + BAR + h.slice(i);

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, 'index.html'), h);
console.log('寫入', path.join(OUTDIR, 'index.html'), (h.length / 1024).toFixed(0) + 'KB');
