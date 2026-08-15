/* 一次性腳本：從 index.html 產生 preview/ipad-cue/index.html
   （iPad 的「往下滑」暗示，第三輪 —— 六個方向不同的做法）

   定案上線後這支腳本和提案頁一起刪掉，推導文字搬進 history/。
   index.html 改過之後要重新產一次：node tools/preview-ipad-cue.mjs
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUTDIR = path.join(ROOT, 'preview/ipad-cue');
let h = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* 相對路徑往上兩層。⚠ 前面是引號、逗號或空白才換（多行 srcset 也吃得到）；
   絕對網址 https://fangren.net/assets/ 前面是斜線，吃不到。 */
h = h.replace(/(["'\s,])assets\//g, '$1../../assets/');
h = h.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
h = h.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
h = h.replace('<p class="band-views" data-views-self="home">', '<p class="band-views is-on">');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">1275</span>');
h = h.replace(/<title>[^<]*<\/title>/, '<title>提案：iPad 往下滑的暗示（第三輪） — 芳仁牙醫診所</title>');

const HEADNOTE = `
<!-- ==========================================================================
     提案：iPad「往下滑」的暗示，第三輪（2026-08-15）
     --------------------------------------------------------------------------
     使用者看過上線的那一版：「那個往下的暗示很不明顯，放在柱子上，
     那個角型上還一條線，其實真的完全看不到、看不出來那個有什麼意思。
     我覺得這樣做好像不太對，你再想幾個辦法看看。」

     ---- 為什麼上一版會不見（量出來的）----------------------------------
     把指標藏起來，量它正下方那一塊 44x59 的背景：

         裝置          最暗    平均    最亮
         你的 iPad     L* 0    L* 15   L* 45
         iPad Pro 11   L* 0    L*  7   L* 52
         iPad 12.9     L* 0    L*  3   L* 52

     **同一塊 44x59 裡，背景從 L* 0（門口那根深色柱子）跳到 L* 52（亮著的門）。**
     所以問題不是「亮度不夠」而是**變異太大**：白色的細線落在亮處就不見，
     暗暈落在暗處也不見。加上那條線只有 1px、上端還淡出，本來就接近雜訊。

     ---- 結論：兩條路，這一輪兩條都做 ------------------------------------
     ① **不要把記號放在照片上** —— 改放在乾淨的底上（窄帶），或乾脆不放記號、
        改用**版面**暗示（第一屏底下露出一點下一段）。
     ② **如果一定要放在照片上，就要一塊不透明的地**（藥丸／圓鈕），
        讓背景的變異完全不影響它。

     ---- 第四輪的四案（第三輪的 Ⓑ~Ⓔ 使用者都不喜歡，已拿掉）--------------
     位置　　　右下（＝「5 個／部定專科」那一列的中線、貼版心右緣）｜ 置中（上一版）
     Ⓖ 雙角　　兩條角形疊著，沒有底也沒有框
     Ⓗ 框＋單角　方框導圓（8px，抄頁首那三個玻璃框）＋ 一條角形
     Ⓘ 框＋雙角　同上，裡面兩條角形
     不放　　　只留「露一角」
     要不要動　不動 ｜ 慢速移動

     ---- 第三輪的六案（留著看推導，已從切換條拿掉）------------------------
     露一角　　　第一屏底下露出 44px 的紙色（**獨立開關，可以和記號並用**）。
                 最不著痕跡的做法：看得到下一段的邊，本來就知道還有東西。
                 代價是照片不再「正好一屏」。
     Ⓑ 窄帶把手　一塊小圓角片騎在窄帶上緣，裡面一個角形。底是窄帶的顏色，
                 背景乾淨、一定看得到，而且它長得像「可以往上拉／往下看」的把手。
     Ⓒ 圓鈕　　　44px 的半透明圓（毛玻璃＋細框）＋ 角形，站在照片上。
                 最像一顆「可以按」的東西。
     Ⓓ 字＋角　　「往下」兩個小字 ＋ 角形，共用一塊藥丸底。語意最明確。
                 ⚠ 這一案會在畫面上多兩個字，屬於文案決定（COPY.md），要使用者點頭。
     Ⓔ 雙角形　　兩個加粗的角形上下排（⌄⌄）＋ 藥丸底 ＋ 慢速浮動。
                 純符號，但「兩個往下」比一個明確得多。
     Ⓕ 現況　　　線＋角＋小點（就是使用者說看不到的那一版），留著當對照。

     每一案的底色都量過對比度，寫在切換條的量測列。
     ========================================================================== -->
`;

const BAR = `
<style>
/* ---- 兩段直式平板共用（A：比例 2/3~9/10；B：≤2/3）---------------------- */
@media (min-width: 721px) and (max-aspect-ratio: 9 / 10) {

  /* ===== 記號：不放 ===================================================== */
  html[data-k="a"] .hero-cue { display: none; }
}
/* ===== 露一角：第一屏底下露出 44px 的紙色（獨立開關，可和記號並用）=======
   這一案不放任何記號也成立 —— 看得到下一段的邊，本來就知道還有東西。
   代價是照片不再「正好一屏」。 */
@media (min-width: 721px) and (min-aspect-ratio: 2 / 3) and (max-aspect-ratio: 9 / 10) {
  html[data-rv="1"] .hero { height: calc(100svh - 44px); }
}
@media (min-width: 721px) and (max-aspect-ratio: 2 / 3) {
  html[data-rv="1"] .hero-photo { height: calc(100svh - 44px); }
}

@media (min-width: 721px) and (max-aspect-ratio: 9 / 10) {
  /* ===== 第四輪：位置搬到右下，記號只留「兩條角形」與「方框導圓」==========
     使用者：「目前的腳型我都不是很喜歡，第一個它的位置在那邊非常突兀。
     如果 iPad 版面夠的話，可以把那個腳型移到右下，就是在那個『5 個專科』的高度
     再往右一點，這樣感覺比較有暗示性、但是也看得到效果。
     另外那個腳型幫我做兩個：一個是雙角，但上面那個雙角很複雜，只要兩條角形的
     樣子疊在一起就好；另外一個是加框 —— 我不喜歡那個圓圈，圓圈跟整個網站的
     主題不搭，網站的主題是方框導圓，還是做成方框導圓的樣子。再一個是方框導圓
     ＋ 雙角的樣子。」

     ---- 位置：右下（預設）----
     ⚠ 這一下把「底」的問題整個解掉了：記號從照片搬到**窄帶**上，
        窄帶是一整片乾淨的深色，不再有 L*0 跳到 L*52 的問題。
     ⚠ 垂直對齊「5 個／部定專科」那一列的中線 —— 實測**四個尺寸都是距窄帶
        下緣 34.9px**（窄帶的內容不會重排，所以是常數，可以寫死）。
     ⚠ 水平貼版心右緣，比第三格再往右（第三格右緣離螢幕還有 107~246px）。
     ⚠ 「置中」那一格留著，就是上一版那個位置，用來對照。 */

  /* 位置 */
  html[data-p="br"] .hero-cue {
    left: auto; right: var(--pad); transform: none;   /* 貼版心右緣，不是螢幕邊 */
    bottom: calc(34.9px - var(--cue-h, 30px) / 2);
    filter: none;
  }
  html[data-p="mid"] .hero-cue {
    left: 50%; right: auto; transform: translateX(-50%);
    bottom: calc(100% + 96px);
  }

  /* 記號：共用 —— 上一版那條細線與小點全部拿掉 */
  html:not([data-k="f"]) .hero-cue::after { content: none; }
  html:not([data-k="f"]) .hero-cue {
    flex-direction: column; align-items: center; gap: 0;
    background-color: transparent; border: 0; border-radius: 0; padding: 0;
    backdrop-filter: none; -webkit-backdrop-filter: none;
  }
  html:not([data-k="f"]) .hero-cue::before { content: none; }

  /* Ⓖ 兩條角形疊著（沒有底、沒有框）*/
  html[data-k="g"] { --cue-h: 24px; }
  html[data-k="g"] .hero-cue { padding: 4px 12px; }
  html[data-k="g"] .hero-cue::before {
    content: ''; display: block; width: 12px; height: 12px; margin-bottom: -5px;
    /* ⚠ background 與 border-radius 一定要歸零 —— 正式站的 .hero-cue::before
       是那條 1px 的細線（帶 linear-gradient），不清掉這裡會變成一顆實心菱形。 */
    background: none; border-radius: 0;
    border-right: 1.4px solid rgba(255, 255, 255, .62);
    border-bottom: 1.4px solid rgba(255, 255, 255, .62);
    transform: rotate(45deg);
  }
  html[data-k="g"] .hero-cue svg { width: 18px; height: 9px; stroke-width: 1.4; }

  /* Ⓗ 方框導圓 ＋ 一條角形。框與圓角抄頁首那三個玻璃框（--frame-r ＝ 8px、
     .75px 的紙色線），這一站的「框」就是這一種，不是圓圈。 */
  html[data-k="h"] { --cue-h: 32px; }
  html[data-k="h"] .hero-cue {
    width: 42px; height: 32px; padding: 0;
    border: .75px solid rgba(226, 229, 230, .34);
    border-radius: var(--frame-r, 8px);
  }
  html[data-k="h"] .hero-cue svg { width: 18px; height: 9px; stroke-width: 1.4; }

  /* Ⓘ 方框導圓 ＋ 兩條角形 */
  html[data-k="i"] { --cue-h: 40px; }
  html[data-k="i"] .hero-cue {
    width: 42px; height: 40px; padding: 0;
    border: .75px solid rgba(226, 229, 230, .34);
    border-radius: var(--frame-r, 8px);
  }
  html[data-k="i"] .hero-cue::before {
    content: ''; display: block; width: 12px; height: 12px; margin-bottom: -5px;
    /* ⚠ background 與 border-radius 一定要歸零 —— 正式站的 .hero-cue::before
       是那條 1px 的細線（帶 linear-gradient），不清掉這裡會變成一顆實心菱形。 */
    background: none; border-radius: 0;
    border-right: 1.4px solid rgba(255, 255, 255, .62);
    border-bottom: 1.4px solid rgba(255, 255, 255, .62);
    transform: rotate(45deg);
  }
  html[data-k="i"] .hero-cue svg { width: 18px; height: 9px; stroke-width: 1.4; }

  /* 不放 */
  html[data-k="a"] .hero-cue { display: none; }

  /* 慢速移動：右下那個位置不能用 translateX（transform 已經 none），
     所以兩個位置各寫一組。 */
  @keyframes cueBobBR { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
  @keyframes cueBobMid { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 4px); } }
  html[data-p="br"][data-mo="1"] .hero-cue { animation: cueBobBR 2.4s ease-in-out infinite; }
  html[data-p="mid"][data-mo="1"] .hero-cue { animation: cueBobMid 2.4s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    html[data-mo="1"] .hero-cue { animation: none; }
  }
}
/* 切換條 */
#sw { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(20, 19, 18, .93); color: #e8e6e2; padding: 8px 10px 10px;
  font: 13px/1.35 -apple-system, "Noto Sans TC", sans-serif;
  backdrop-filter: blur(8px); box-shadow: 0 -1px 0 rgba(255, 255, 255, .12); }
#sw .r { display: flex; align-items: center; gap: 5px; margin: 4px 0; }
#sw .r > b { flex: 0 0 3.4em; font-weight: 600; opacity: .72; font-size: 12px; }
#sw button { flex: 1 1 auto; min-width: 0; appearance: none; border: 1px solid rgba(255,255,255,.28);
  background: transparent; color: inherit; border-radius: 8px; padding: 8px 4px; font: inherit; font-size: 12.5px; }
#sw button[aria-pressed="true"] { background: #e8e6e2; color: #191614; border-color: #e8e6e2; font-weight: 700; }
#sw .m { font-size: 11.5px; opacity: .66; margin: 6px 0 0; white-space: pre-line; font-variant-numeric: tabular-nums; }
#sw .x { position: absolute; right: 8px; top: -34px; background: rgba(20,19,18,.93);
  border: 0; color: #e8e6e2; border-radius: 8px; padding: 6px 11px; font: inherit; }
body { padding-bottom: 150px; }
</style>

<div id="sw">
  <button class="x" type="button" data-x>收起</button>
  <div class="r" data-k="rv"><b>露一角</b>
    <button type="button" data-v="0">不露</button><button type="button" data-v="1">露 44px</button></div>
  <div class="r" data-k="p"><b>位置</b>
    <button type="button" data-v="br">右下</button><button type="button" data-v="mid">置中（上一版）</button></div>
  <div class="r" data-k="k"><b>記號</b>
    <button type="button" data-v="a">不放</button><button type="button" data-v="g">Ⓖ雙角</button><button type="button" data-v="h">Ⓗ框＋單角</button><button type="button" data-v="i">Ⓘ框＋雙角</button><button type="button" data-v="f">現況</button></div>
  <div class="r" data-k="mo"><b>要不要動</b>
    <button type="button" data-v="0">不動</button><button type="button" data-v="1">慢速浮動</button></div>
  <p class="m" id="swm"></p>
</div>

<script>
(function () {
  var root = document.documentElement;
  /* 正規式一定要 [a-z0-9]+ */
  var q = location.search, def = { rv: '0', p: 'br', k: 'i', mo: '0' };
  Object.keys(def).forEach(function (kk) {
    var m = q.match(new RegExp('[?&]' + kk + '=([a-z0-9]+)'));
    root.setAttribute('data-' + kk, m ? m[1] : def[kk]);
  });
  function paint() {
    var cu = document.querySelector('.hero-cue');
    var hero = document.querySelector('.hero').getBoundingClientRect();
    var bd = document.querySelector('.band').getBoundingClientRect();
    var cs = getComputedStyle(cu), r = cu.getBoundingClientRect();
    document.getElementById('swm').textContent =
      '第一屏底下露出紙色 ' + Math.max(0, innerHeight - hero.bottom).toFixed(0) + 'px'
      + '　窄帶 ' + bd.height.toFixed(0) + 'px'
      + '\\n記號 ' + (cs.display === 'none' ? '不放'
          : r.width.toFixed(0) + '×' + r.height.toFixed(0) + '　離窄帶上緣 ' + (bd.top - r.bottom).toFixed(0) + 'px'
            + '　底 ' + (cs.backgroundColor === 'rgba(0, 0, 0, 0)' ? '無' : cs.backgroundColor));
  }
  document.querySelectorAll('#sw .r').forEach(function (row) {
    var kk = row.dataset.k;
    row.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        root.setAttribute('data-' + kk, b.dataset.v);
        sync(); paint();
        var u = new URL(location.href); u.searchParams.set(kk, b.dataset.v);
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
  document.querySelector('#sw [data-x]').addEventListener('click', function () {
    var sw = document.getElementById('sw');
    var off = sw.style.transform === 'translateY(84%)';
    sw.style.transform = off ? '' : 'translateY(84%)';
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
h = h.slice(0, hi) + HEADNOTE + h.slice(hi);
/* ⚠ 一定要 lastIndexOf —— 這一站的註解裡就有 </body> 這個字串 */
const i = h.lastIndexOf('</body>');
h = h.slice(0, i) + BAR + h.slice(i);

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, 'index.html'), h);
console.log('寫入', path.join(OUTDIR, 'index.html'), (h.length / 1024).toFixed(0) + 'KB');
