/* 手機版 HERO 動態的提案頁產生器（2026-08-16，提案期間專用）。
 *
 *   node tools/hero-motion-preview.mjs
 *   → preview/hero-motion-mobile/index.html
 *
 * 這一頁是 index.html 的**快照**，不要手改 —— 要改就改這支再跑一次。
 * 定案上線之後，連同 preview/hero-motion-mobile/ 與這支一起刪掉，
 * 推導文字搬進 history/hero-motion-mobile.html（CLAUDE.md 第八節）。
 *
 * 快照要做的六件事（CLAUDE.md 第八節，前四件是踩過的坑）：
 *   1. 相對路徑往上兩層（assets/ → ../../assets/）。不要用 <base href="/">，
 *      那會讓 #topics 這種錨點跳回首頁。
 *   2. 拿掉 assets/counter.js 與 data-views-self，窄帶數字寫死並手動加 .is-on
 *      （不拿掉的話每開一次提案頁，首頁的計數就多一次）。
 *   3. robots 改成 noindex, nofollow, noarchive。
 *   4. 切換條插在**最後一個** </body> 前面 —— 這一站的註解裡就有 </body> 這幾個字
 *      （.nav-lamp 那一段），用 String.replace 會換到註解裡那一個。所以用 lastIndexOf。
 *   5. 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到 lin1 這種值。
 *   6. preview/ 進 _site/ 的三處管線（dist.mjs 的 OPTIONAL、robots.txt 的
 *      Disallow、Worker 的 X-Robots-Tag ＋ no-store）都已經就位，不必再動。
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'preview/hero-motion-mobile/index.html');

let html = readFileSync(resolve(ROOT, 'index.html'), 'utf8');

/* ---- 1. 相對路徑往上兩層 ------------------------------------------------ */
/* srcset 是逗號分隔、而且跨行，所以一個一個切開來處理，不要整串取代。 */
html = html.replace(/\b(href|src|srcset)="([^"]*)"/g, (m, attr, val) => {
  const fixed = val.split(',').map(part => {
    const t = part.trim();
    if (!t || /^(https?:|mailto:|tel:|data:|#|\/)/.test(t)) return part;
    return part.replace(t, t === './' ? '../../' : '../../' + t);
  }).join(',');
  return `${attr}="${fixed}"`;
});

/* ---- 2. 計數器：整支拿掉，窄帶的數字寫死 -------------------------------- */
html = html.replace(/\n<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>\n/, '\n');
html = html.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on">');
/* ⚠ 這個數字是提案頁專用的示範值，絕對不要跟著版型搬回正式站（真值只能來自 D1）。 */
html = html.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">—</span>');

/* ---- 3. noindex --------------------------------------------------------- */
html = html.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
html = html.replace(/<title>[^<]*<\/title>/,
  '<title>提案：手機版 HERO 的動態 — 芳仁牙醫診所</title>');


/* ---- 3.5 推導寫進 <head>（定案後搬進 history/hero-motion-mobile.html） ---- */
/* ⚠ HTML 註解裡不能出現兩個連續的 ASCII 減號，破折號一律用全形。 */
const HEADNOTE = `
<!--
  ============================================================================
  提案：手機版 HERO 的動態（2026-08-16）

  使用者：「目前手機版本打開的時候 HERO 圖片都不會動，好像也是可以稍微動一下，
  但因為手機的畫面比較小，所以動得太誇張或是動的幅度太大好像也不是很好。」

  ── 先查「為什麼不會動」，不要直接再加一個動畫 ──

  站上其實已經有一組放大動畫，而且手機那一段也在（hero-push-10，10%／6 秒，
  2026-08-15 commit fe1baab 上線）。所以問題不是沒做，是在他的手機上沒跑。
  Playwright 在 390×844 DPR3 逐 100ms 取樣，量到兩件事，兩件都是真的：

    情境                    結果
    一般（不節流）           6 秒走完 10%，正常
    開了「減少動態效果」      scale 從頭到尾 1.0000，完全不動  ← 幾乎確定是這一個
    4x CPU ＋ 4Mbps         照片 1756ms 才解好，那一刻 10% 的行程已經走掉 37%

  ① prefers-reduced-motion。站上那條 CSS 的最後一段是
     @media (prefers-reduced-motion: reduce) 底下的 .hero-photo img { animation: none }。
     旁證：2026-08-15 使用者回報「在 iPad 上沒有慢速浮動」，成因就是同一個設定
     （那一輪的解法是讓 .hero-cue 不看它）。所以他的手機大機率開著這個設定。

  ② 起跑點。動畫是 CSS 解析完就開跑，可是照片要等下載＋解碼。節流下量到
     1756ms，而 cubic-bezier(.22,.61,.36,1) 是先快後慢 —— 被吃掉的正是最快的
     那一段，剩下的尾巴每秒只走零點幾個百分點。

  ── 三個版本 ──

    Ⓐ 輕　　　　放大 4%／10 秒／等速　　頂緣共走 28.8px，2.9px 每秒
    Ⓑ 中　　　　放大 7%／12 秒／等速　　頂緣共走 50.3px，4.2px 每秒
    Ⓒ 跟著捲動　放大 8%，第一屏捲完正好走完；手指停它就停
    現況　　　　放大 10%／6 秒／先快後慢（頂緣共走 71.9px，開頭約 20px 每秒）
    不動　　　　比較用

  三案都改掉②：等 <img> 真的畫出來才開跑（img.complete 或 load）。
  Ⓐ Ⓑ 改成等速，理由是「先快後慢」把大部分位移集中在使用者還沒看到的頭兩秒，
  在手機上等於白走；等速比較容易被看見，而且每秒的量更好預測。
  Ⓒ 是另一種答案：不看時間，所以永遠不會「錯過」。

  ⚠ 沒有做「來回呼吸」。那是 2026-08-15 電腦版那一輪就否決過的
    （一張靜止的建築照片來回縮放看起來像壞掉，而且永遠不會停在定案的構圖上）。
  ⚠ transform-origin 維持 50% 100%，三案都沒動。原點放下緣，照片最後一列
    完全不動 —— 那一列的顏色（#181614）是照片與窄帶接縫四輪定案的依據。
    原點改成正中的話接縫會直接毀掉（實測 ΔL 星號 +6.42）。

  ── 切換條上那一排「要不要跟著減少動態效果」──

  這是真正要他決定的一題，而且不是純美感：

    跟（＝現在線上的做法）　開著那個設定的人完全看不到動畫。他自己就是。
    不跟　　　　　　　　　　設定開著也照動。

  站上已經有一個先例是「不跟」的：窄帶那個往上數的瀏覽數（2026-08-08 定的，
  理由是那個設定針對的是位移／視差／縮放，原地長大的數字不屬於那一類）。
  但一張滿版照片的緩慢放大**正是**那一類，所以這一顆和那一顆不一樣，
  要他自己選。折衷也可以：跟著設定，但改成更小的幅度而不是完全不動。

  ⚠ 這一頁的切換條預設是「不跟」，否則他在自己的手機上會什麼都看不到，
    整個提案頁就失去意義。

  ── 這一頁做了什麼 ──

  index.html 的快照，由 tools/hero-motion-preview.mjs 產生，不要手改。
  站上那條 CSS 動畫被一條 animation: none !important 關掉，改由 Web Animations
  驅動 —— 這樣才能重播、才能等照片畫出來再開跑、才能不理會減少動態效果。

  ⚠ 切換條的 class 一律加 pv 前綴。第一版用了 .foot，和站上的頁尾撞名
    （站上的 .foot 帶著卡片底色與 padding-block: 2.4rem），
    整條切換條被染成白色的一大塊。
  ============================================================================
-->
`;
html = html.replace('</head>', HEADNOTE + '</head>');

/* ---- 4. 切換條 ---------------------------------------------------------- */
const BAR = String.raw`
<style>
/* ===== 提案頁的切換條（定案後連同這一頁一起刪掉） ===== */
.pv, .pv * { box-sizing: border-box; }
.pv {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999;
  background: rgba(18, 20, 19, .93);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  color: #eceeec; font: 500 13px/1.45 system-ui, -apple-system, "Noto Sans TC", sans-serif;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  max-height: 70svh; overflow: auto;
}
.pv[hidden] { display: none; }
.pvh { margin: 0 0 4px; font-size: 11px; font-weight: 600; letter-spacing: .06em;
         color: #a9aeaa; text-transform: none; }
.pv .pvrow { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 7px; }
.pv #pv-more[hidden] { display: none; }
.pv button.pvseg {
  flex: 1 1 auto; min-width: 52px; min-height: 40px; padding: 4px 7px;
  border: 1px solid rgba(236, 238, 236, .28); border-radius: 8px;
  background: transparent; color: inherit; font: inherit; line-height: 1.25;
  -webkit-tap-highlight-color: transparent;
}
.pv button.pvseg small { display: block; font-size: 10.5px; color: #a9aeaa; }
.pv button.pvseg[aria-pressed="true"] { background: #eceeec; color: #161a18; border-color: #eceeec; }
.pv button.pvseg[aria-pressed="true"] small { color: #4a524c; }
.pv .pvrow.dim { opacity: .38; }
.pv .pvfoot { display: flex; gap: 6px; align-items: center; background: none; padding: 0; border: 0; }
.pv .pvfoot button { min-height: 40px; padding: 6px 11px; border-radius: 8px; font: inherit;
  border: 1px solid rgba(236, 238, 236, .28); background: transparent; color: inherit;
  white-space: nowrap; flex: 0 0 auto; }
.pv .pvmeter { flex: 1 1 auto; min-width: 0; font-size: 10.5px; line-height: 1.3; color: #a9aeaa;
  font-variant-numeric: tabular-nums; }
.pv .pvnote { font-size: 11px; color: #9aa09b; margin: 0 0 7px; }
.pv .pvnote b { color: #f0d9a4; font-weight: 600; }
.pvopen {
  position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 9999;
  width: 44px; height: 44px; border-radius: 9px;
  border: 1px solid rgba(236, 238, 236, .3); background: rgba(18, 20, 19, .82);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  color: #eceeec; font: 600 12px/1 system-ui, sans-serif;
}
.pvopen[hidden] { display: none; }
</style>

<button class="pvopen" hidden type="button" id="pvopen" aria-label="打開切換條">切換</button>

<div class="pv" id="pv">
  <h4 class="pvh">三個版本（點一下就重播）</h4>
  <div class="pvrow" id="pv-preset">
    <button class="pvseg" type="button" data-k="a">Ⓐ 輕<small>4%／10秒</small></button>
    <button class="pvseg" type="button" data-k="b">Ⓑ 中<small>7%／12秒</small></button>
    <button class="pvseg" type="button" data-k="c">Ⓒ 跟著捲動<small>滑到哪走到哪</small></button>
    <button class="pvseg" type="button" data-k="now">現況<small>10%／6秒</small></button>
    <button class="pvseg" type="button" data-k="off">不動<small>比較用</small></button>
  </div>

  <p class="pvnote" id="pv-rmnote"></p>

  <div id="pv-more" hidden>
  <h4 class="pvh">幅度（放大多少）</h4>
  <div class="pvrow" id="pv-amp">
    <button class="pvseg" type="button" data-v="3">3%</button>
    <button class="pvseg" type="button" data-v="4">4%</button>
    <button class="pvseg" type="button" data-v="5">5%</button>
    <button class="pvseg" type="button" data-v="7">7%</button>
    <button class="pvseg" type="button" data-v="10">10%</button>
  </div>

  <h4 class="pvh">時間（走完要幾秒）</h4>
  <div class="pvrow" id="pv-dur">
    <button class="pvseg" type="button" data-v="6">6秒</button>
    <button class="pvseg" type="button" data-v="8">8秒</button>
    <button class="pvseg" type="button" data-v="10">10秒</button>
    <button class="pvseg" type="button" data-v="12">12秒</button>
    <button class="pvseg" type="button" data-v="16">16秒</button>
  </div>

  <h4 class="pvh">快慢的分布</h4>
  <div class="pvrow" id="pv-cv">
    <button class="pvseg" type="button" data-v="lin">等速<small>從頭到尾一樣</small></button>
    <button class="pvseg" type="button" data-v="fast">先快後慢<small>現況用的</small></button>
  </div>

  <h4 class="pvh">要不要跟著手機的「減少動態效果」</h4>
  <div class="pvrow" id="pv-rm">
    <button class="pvseg" type="button" data-v="0">不跟<small>設定開著也會動</small></button>
    <button class="pvseg" type="button" data-v="1">跟<small>＝現在線上的做法</small></button>
  </div>

  </div>

  <div class="pvfoot">
    <button type="button" id="pv-replay">重播</button>
    <span class="pvmeter" id="pv-meter"></span>
    <button type="button" id="pv-more-t">細調</button>
    <button type="button" id="pv-hide">收起</button>
  </div>
</div>

<script>
/* 提案頁專用。定案後連同這一頁一起刪掉，一個字都不要搬進正式站。 */
(function () {
  var img = document.querySelector('.hero-photo img');
  var fig = document.querySelector('.hero-photo');
  if (!img || !fig) return;

  /* 站上自己那條 CSS 動畫整個關掉，改由這裡用 Web Animations 驅動 ——
     這樣才能重播、才能等照片畫出來再開跑、才能不理會減少動態效果。 */
  var kill = document.createElement('style');
  kill.textContent = '.hero-photo img { animation: none !important; }';
  document.head.appendChild(kill);

  var PRESET = {
    a:   { amp: 4,  dur: 10, cv: 'lin',  scroll: 0 },
    b:   { amp: 7,  dur: 12, cv: 'lin',  scroll: 0 },
    c:   { amp: 8,  dur: 12, cv: 'lin',  scroll: 1 },
    now: { amp: 10, dur: 6,  cv: 'fast', scroll: 0 },
    off: { amp: 0,  dur: 6,  cv: 'lin',  scroll: 0 }
  };
  var EASE = { lin: 'linear', fast: 'cubic-bezier(.22,.61,.36,1)' };

  var st = { m: 'a', amp: 4, dur: 10, cv: 'lin', rm: 0 };

  /* ⚠ [a-z0-9]+ 不是 [a-z]+ —— 後者吃不到帶數字的值。 */
  var q = location.search;
  function readParam(name, re) {
    var m = q.match(new RegExp('[?&]' + name + '=([a-z0-9]+)'));
    return (m && re.test(m[1])) ? m[1] : null;
  }
  var p;
  if ((p = readParam('m', /^(a|b|c|now|off)$/))) st.m = p;
  applyPreset(st.m, true);
  if ((p = readParam('am', /^(3|4|5|7|10)$/))) { st.amp = +p; st.m = ''; }
  if ((p = readParam('dur', /^(6|8|10|12|16)$/))) { st.dur = +p; st.m = ''; }
  if ((p = readParam('cv', /^(lin|fast)$/))) { st.cv = p; st.m = ''; }
  if ((p = readParam('rm', /^(0|1)$/))) st.rm = +p;

  function applyPreset(k, quiet) {
    var d = PRESET[k]; if (!d) return;
    st.m = k; st.amp = d.amp; st.dur = d.dur; st.cv = d.cv;
    if (!quiet) sync();
  }

  var anim = null, onScroll = null;
  function stop() {
    if (anim) { anim.cancel(); anim = null; }
    if (onScroll) { removeEventListener('scroll', onScroll); onScroll = null; }
    img.style.transform = '';
  }

  function reduced() {
    return st.rm === 1 &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function play() {
    stop();
    if (st.amp === 0 || reduced()) { paint(); return; }
    var to = 1 + st.amp / 100;

    if (PRESET[st.m] && PRESET[st.m].scroll) {
      /* Ⓒ 跟著捲動：不看時間，第一屏捲完正好走完。手指停它就停。 */
      var tick = false;
      onScroll = function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          tick = false;
          var span = fig.getBoundingClientRect().height || innerHeight;
          var pr = Math.min(1, Math.max(0, (scrollY || pageYOffset) / span));
          img.style.transform = 'scale(' + (1 + (to - 1) * pr).toFixed(5) + ')';
        });
      };
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return;
    }

    /* 等照片真的畫出來才開跑 —— 這正是「在手機上看不到」的第二個成因：
       實測 4x CPU ＋ 4Mbps 時照片 1756ms 才解好，那一刻 10% 的行程已經
       走掉 37%，而且用掉的是最快的那一段。 */
    var go = function () {
      anim = img.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(' + to + ')' }],
        { duration: st.dur * 1000, easing: EASE[st.cv], fill: 'both' }
      );
    };
    if (img.complete && img.naturalWidth) go();
    else img.addEventListener('load', go, { once: true });
  }

  var meter = document.getElementById('pv-meter');
  var lastS = 1, lastT = 0, vSm = 0;
  function paint() {
    var s = 1;
    var t = getComputedStyle(img).transform;
    if (t && t !== 'none') { var m = new DOMMatrixReadOnly(t); s = m.a; }
    var h = fig.getBoundingClientRect().height;
    var now = performance.now();
    var v = (lastT && now > lastT) ? (s - lastS) * h / ((now - lastT) / 1000) : 0;
    lastS = s; lastT = now;
    vSm = vSm * .88 + v * .12;
    meter.textContent = '放大 ' + ((s - 1) * 100).toFixed(2) + '％　頂緣位移 ' +
      (h * (s - 1)).toFixed(0) + 'px　' + (vSm > .05 ? vSm.toFixed(1) + 'px/秒' : '靜止');
  }
  (function loop() { paint(); requestAnimationFrame(loop); })();

  function mark(box, val) {
    box.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String((b.dataset.k || b.dataset.v) === String(val)));
    });
  }
  var rowAmp = document.getElementById('pv-amp');
  var rowDur = document.getElementById('pv-dur');
  var rowCv = document.getElementById('pv-cv');

  function sync() {
    mark(document.getElementById('pv-preset'), st.m);
    mark(rowAmp, st.amp); mark(rowDur, st.dur); mark(rowCv, st.cv);
    mark(document.getElementById('pv-rm'), st.rm);
    var isScroll = !!(PRESET[st.m] && PRESET[st.m].scroll);
    rowDur.classList.toggle('dim', isScroll);
    rowCv.classList.toggle('dim', isScroll);
    var on = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('pv-rmnote').innerHTML = on
      ? '這台的「減少動態效果」是<b>開著</b>的 —— 線上那一版因此完全不動，成因就是這個。'
      : '這台的「減少動態效果」是關著的。';
    history.replaceState(null, '', location.pathname +
      '?m=' + (st.m || 'x') + '&am=' + st.amp + '&dur=' + st.dur + '&cv=' + st.cv + '&rm=' + st.rm);
    play();
  }

  document.getElementById('pv-preset').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; applyPreset(b.dataset.k);
  });
  rowAmp.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; st.amp = +b.dataset.v; st.m = ''; sync();
  });
  rowDur.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; st.dur = +b.dataset.v; st.m = ''; sync();
  });
  rowCv.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; st.cv = b.dataset.v; st.m = ''; sync();
  });
  document.getElementById('pv-rm').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; st.rm = +b.dataset.v; sync();
  });
  document.getElementById('pv-replay').addEventListener('click', function () {
    scrollTo({ top: 0, behavior: 'auto' }); play();
  });

  var more = document.getElementById('pv-more'), moreT = document.getElementById('pv-more-t');
  moreT.addEventListener('click', function () {
    more.hidden = !more.hidden;
    moreT.textContent = more.hidden ? '細調' : '收合';
  });

  var bar = document.getElementById('pv'), openBtn = document.getElementById('pvopen');
  document.getElementById('pv-hide').addEventListener('click', function () {
    bar.hidden = true; openBtn.hidden = false;
  });
  openBtn.addEventListener('click', function () { bar.hidden = false; openBtn.hidden = true; });

  sync();
})();
</script>
`;

const cut = html.lastIndexOf('</body>');
if (cut < 0) throw new Error('找不到 </body>');
html = html.slice(0, cut) + BAR + '\n' + html.slice(cut);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫出 ' + OUT.replace(ROOT + '/', '') + '（' + (html.length / 1024).toFixed(0) + ' KB）');
