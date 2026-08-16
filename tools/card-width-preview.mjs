#!/usr/bin/env node
/* ==========================================================================
   preview/card-width-desktop/ 的產生器（一次性）
   --------------------------------------------------------------------------
   把 index.html 做成提案頁的快照，加上「版心寬度 × 左右內距」兩條尺。
   起因：使用者 2026-08-16 拿 blog.ichentsai.tw 的截圖說
        「電腦版的版面 卡片大小 比照 蔡依橙 的網站版面」。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/card-width-preview.mjs
   ⚠ 定案上線之後，這支與 preview/card-width-desktop/ 一起刪掉，
     推導文字搬進 history/card-width-desktop.html（CLAUDE.md 第八節）。

   CLAUDE.md 第八節列的四個陷阱，這裡都照做了：
     ① 相對路徑往上兩層（assets/ posts/ site.webmanifest）
     ② 拿掉 counter.js 與 data-views-self，窄帶數字寫死並手動加 .is-on
     ③ 切換條用 lastIndexOf('</body>') 插入（註解裡就有那幾個字）
     ④ class 一律 pv- 前綴（站上的短名字幾乎一定會撞）
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'card-width-desktop', 'index.html');

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ── 推導（定案後整段搬進 history/card-width-desktop.html）─────────────── */
const NOTE = `<!-- ==========================================================================
     提案：電腦版的卡片要多寬（2026-08-16）
     --------------------------------------------------------------------------
     使用者拿 blog.ichentsai.tw 的截圖：「電腦版的版面 卡片大小 比照 蔡依橙 的
     網站版面。」

     ⚠ **先量再做。** 兩站在 1440×900 上逐項比對之後，差的其實**只有一件事**：

                              芳仁（現況）      蔡依橙（參考站）
       版心 max-width          1160             1280
       左右內距                43.2（3vw）       24
       內容寬                  1073.63          1232
       欄數 × 欄距             3 × 25.2         3 × 24
       ── 卡片寬               341.08           394.66      ← 差 53.6（15.7%）
       縮圖比例                16:9             16:9
       卡片圓角                13.5             14
       卡片框線                1px              1px
       標題字級／行高          18.36／28.46     19／28.5
       摘要字級／行高          15.30／27.54     15／27
       日期字級                14.04            14

     **字級那四列 2026-08-15「電腦版整體放大 12%」那一輪已經對齊了**（就是拿同一個
     參考站比出來的），圓角、框線、縮圖比例本來就一樣。**剩下沒對上的只有卡片寬度**，
     而它是版心與左右內距這兩個值算出來的：

         卡片寬 ＝（版心 − 左右內距 × 2 − 欄距 × 2）÷ 3

     所以這一頁的切換條就是這兩條尺，不是「卡片大小」那條尺 ——
     直接寫死卡片寬度會讓卡片脫離版心，和上面的「主題與科別」、下面的醫師卡
     與診所資訊對不齊。

     ---- 兩條尺在 1440×900 上算出來的卡片寬（與參考站 394.66 的差）----------

              內距 43.2（現況）    內距 32        內距 24（參考站）
       1160    341.06  −53.60     348.53 −46.13   353.86 −40.80
       1240    367.73  −26.93     375.20 −19.46   380.53 −14.13
       1280    381.06  −13.60     388.53  −6.13   393.86  −0.80  ← 逐字比照
       1360    407.73  +13.07     415.20 +20.54   420.53 +25.87

     十二格全部沒有水平捲動（1440 與 1280 兩個視窗都量過）。

     ---- 要一起知道的四件事 -------------------------------------------------
     ① **版心是整站的骨架，不是只有卡片在用。** 改 --shell 會同時動到頁首、頁尾、
        HERO 窄帶、主題與科別、醫師介紹（三欄）、診所資訊（兩欄）與地圖。
        這是刻意的 —— 只把卡片放寬會讓它比同一頁的其他區塊寬出一截。
     ② **文章頁要跟著改。** 2026-08-15 定案「首頁切到文章頁，頁首不要變」，
        當時把兩份樣式表的版心都設成 1160px。這一輪若改了首頁，
        assets/style.css 的 --wide 與 --pad 要照抄，否則那條定案立刻失效。
        ⚠ 文章的內文欄寬吃的是 --content: 44rem，**不會**跟著變寬。
     ③ **文章卡的 sizes 要重算。** 站上寫的是 (min-width: 1160px) 373px，
        但實際只有 341（+12% 那一輪把內距與欄距一起放大之後就對不上了）。
        2026-08-16 換點陣 HERO 那一輪學到的：提案頁看得出「圖對不對」，
        看不出「挑了哪一張檔」—— 上線時要按定案的卡片寬重寫這個值。
     ④ **窄帶不受影響。** 地址電話在 +12% 那一輪已經從絕對定位改成置中一列，
        「三格 ＋ 聯絡方式」的分組不再靠版心的餘裕撐著。

     ---- 切換條 -------------------------------------------------------------
     網址參數 ?w=1160|1240|1280|1360 與 ?p=0|32|24（0 ＝ 現況的 clamp）。
     兩條尺都關在 @media (min-width: 1041px) 裡 —— 那正是卡片還是三欄的範圍，
     手機與 iPad 一個值都不會動。
     ========================================================================== -->`;

/* ── ① 相對路徑往上兩層 ──────────────────────────────────────────────────
   ⚠ 不要改用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
/* srcset 是逗號分隔的一整串，上面那條只換得到第一個 —— 要單獨處理，
   不然六張縮圖在提案頁上全部載不出來（src 對了、srcset 卻贏過 src）。 */
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');

/* ── noindex（三道 noindex 的第一道，另外兩道在 Worker 與 robots.txt）──── */
html = html.replace(
  /<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE);

/* ── ② 計數器：整支拿掉，窄帶的數字寫死 ─────────────────────────────────
   不拿掉的話**每開一次提案頁，首頁的計數就多一次**。
   ⚠⚠ 底下那個數字是提案頁專用的示範值，**絕對不要跟著版型搬回正式站**
       （2026-08-07 踩過：示範值 8642 把真實的 190 蓋掉還不會動）。 */
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
html = html.replace(
  '<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on"><!-- ⚠ 提案頁的示範值，不要搬回正式站 -->');
html = html.replace(
  '<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">697</span>');
/* 文章卡的數字沒有 counter.js 就停在「—」，連前面那顆「・」一起收掉，
   免得六張卡都掛著一個破折號干擾字級的判斷。 */
html = html.replace(/<span class="dot" aria-hidden="true">・<\/span>\s*<span class="views"[^>]*>[\s\S]*?<\/span>\s*<\/p>/g, '</p>');

/* ── 兩條尺的樣式 ────────────────────────────────────────────────────────
   ⚠⚠ 覆寫 :root 的變數**不能寫 html** —— :root 是虛擬類別（0,1,0），
       權重比 html（0,0,1）高，排在後面也贏不了（CLAUDE.md 電腦版字級那一輪踩過）。
       這裡寫成 :root[data-w=…]（0,2,0）才蓋得過去。
   ⚠ 兩條尺都關在 min-width: 1041px 裡：那正是 .cards 還是三欄的範圍，
     而且手機不該被內距那條尺影響（版心 1160→1280 在窄螢幕本來就沒作用，
     但 --pad 有，40px 的內距在 375 上會把版面吃掉一大半）。 */
const RULERS = `
<style>
@media (min-width: 1041px) {
  :root[data-w="1240"] { --shell: 1240px; }
  :root[data-w="1280"] { --shell: 1280px; }
  :root[data-w="1360"] { --shell: 1360px; }
  :root[data-p="32"]   { --pad: 32px; }
  :root[data-p="24"]   { --pad: 24px; }
}
</style>`;

/* ── 切換條 ──────────────────────────────────────────────────────────────
   ⚠ 網址參數的正規式寫 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 1280 這種值，
     比對失敗後悄悄退回預設，等於參數沒作用（CLAUDE.md 記過一次）。 */
const BAR = `
<!-- ==========================================================================
     切換條（提案用）。定案之後連同 <html> 上的 data-w / data-p 一起刪掉。
     ========================================================================== -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; right: 12px; top: 12px;
  font: 400 13px/1.6 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee;
}
.pvbar-btn {
  display: flex; align-items: center; gap: .4em; margin-left: auto;
  padding: .5em .8em; min-height: 36px;
  background: rgba(20,18,16,.92); color: #f2f0ee;
  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;
  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}
.pvbar-btn b { font-weight: 700; font-variant-numeric: tabular-nums; opacity: .8; }
.pvbar-panel {
  display: none; margin-top: 8px; width: min(330px, calc(100vw - 24px));
  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度，
     用 vh 會讓面板比看得到的範圍還高，最下面的量測數字永遠捲不到。 */
  flex-direction: column; max-height: calc(100svh - 68px);
  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);
  border-radius: 10px; overflow: hidden;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 12px 34px rgba(0,0,0,.45);
}
.pvbar[data-open="1"] .pvbar-panel { display: flex; }
.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }
.pvbar-g {
  padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84;
}
.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }
.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }
.pvbar-row button {
  flex: 1 1 0; padding: .45em .2em; min-height: 40px;
  background: rgba(255,255,255,.07); color: #cfc9c2;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;
  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;
}
.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }
.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }
.pvbar-row button[aria-pressed="true"] {
  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;
}
.pvbar-row button[aria-pressed="true"] small { color: rgba(20,18,15,.7); }
.pvbar-foot {
  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);
  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;
}
.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }
.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }
.pvbar-foot .m.good b { color: #8fd6a4; }
.pvbar-foot .m.bad  b { color: #ff9a9a; }
.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }
.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }
@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }
@media print { .pvbar { display: none; } }
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">版心與卡片 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">版心寬度　<em>決定卡片多寬</em></div>
      <div class="pvbar-row" data-k="w">
        <button type="button" data-v="1160">Ⓐ<small>1160 現況</small></button>
        <button type="button" data-v="1240">Ⓑ<small>1240</small></button>
        <button type="button" data-v="1280">Ⓒ<small>1280</small></button>
        <button type="button" data-v="1360">Ⓓ<small>1360</small></button>
      </div>
      <div class="pvbar-g">左右內距　<em>版心再往內縮多少</em></div>
      <div class="pvbar-row" data-k="p">
        <button type="button" data-v="0">Ⓐ<small>現況 43</small></button>
        <button type="button" data-v="32">Ⓑ<small>32</small></button>
        <button type="button" data-v="24">Ⓒ<small>24 參考站</small></button>
      </div>
    </div>
    <div class="pvbar-foot"></div>
  </div>
</div>

<script>
/* 切換條的行為。定案後連同上面那塊 HTML／CSS 與 <html> 的 data-* 一起刪掉。 */
(function () {
  var root = document.documentElement;
  var box  = document.querySelector('.pvbar');
  var btn  = box.querySelector('.pvbar-btn');
  var foot = box.querySelector('.pvbar-foot');
  var KEYS = { w: ['1160','1240','1280','1360'], p: ['0','32','24'] };
  var DEF  = { w: '1160', p: '0' };
  var st   = { w: DEF.w, p: DEF.p };

  /* 網址參數。⚠ 用明確的字串比對，不要用 [a-z]+ 那種正規式。 */
  var qs = new URLSearchParams(location.search);
  Object.keys(KEYS).forEach(function (k) {
    var v = qs.get(k);
    if (v !== null && KEYS[k].indexOf(v) >= 0) st[k] = v;
  });

  function apply() {
    root.setAttribute('data-w', st.w);
    root.setAttribute('data-p', st.p);
    Object.keys(KEYS).forEach(function (k) {
      var row = box.querySelector('.pvbar-row[data-k="' + k + '"]');
      Array.prototype.forEach.call(row.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      });
    });
    var q = new URLSearchParams();
    Object.keys(KEYS).forEach(function (k) { if (st[k] !== DEF[k]) q.set(k, st[k]); });
    history.replaceState(null, '', q.toString() ? '?' + q : location.pathname);
    btn.querySelector('b').textContent = st.w + (st.p === '0' ? '' : '／' + st.p);
    measure();
  }

  Object.keys(KEYS).forEach(function (k) {
    box.querySelector('.pvbar-row[data-k="' + k + '"]').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st[k] = b.dataset.v; apply();
    });
  });
  btn.addEventListener('click', function () {
    var o = box.dataset.open === '1' ? '0' : '1';
    box.dataset.open = o; btn.setAttribute('aria-expanded', o === '1');
    if (o === '1') measure();
  });

  /* ── 現場量測 ──────────────────────────────────────────────────────────
     參考站 blog.ichentsai.tw 在 1440×900 上量到的（2026-08-16）：
       版心 1280（max-width）、左右內距 24 → 內容 1232
       三欄、gap 24 → 卡片 394.66、縮圖 16:9 = 220.86
       標題 19／28.5、摘要 15／27、日期 14／23.8、圓角 14、框 1px         */
  var REF = 394.66;
  function n(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function measure() {
    if (box.dataset.open !== '1') return;
    var grid  = document.querySelector('.cards');
    var card  = grid && grid.querySelector('.card');
    var shell = grid && grid.closest('.shell');
    if (!card) { foot.textContent = '（找不到文章卡）'; return; }
    var cw = card.getBoundingClientRect().width;
    var d  = cw - REF;
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    var thumb = card.querySelector('.card-thumb');
    var h3 = card.querySelector('h3');
    /* 水平捲動：文件比視窗寬就是破圖。 */
    var over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    foot.innerHTML =
      '<div class="m"><span>視窗寬</span><b>' + window.innerWidth + '</b></div>' +
      '<div class="m"><span>版心實寬</span><b>' + n(shell.getBoundingClientRect().width) + '</b></div>' +
      '<div class="m"><span>左右內距</span><b>' + getComputedStyle(shell).paddingLeft + '</b></div>' +
      '<div class="m"><span>欄數</span><b>' + cols + '</b></div>' +
      '<div class="m ' + (Math.abs(d) <= 8 ? 'good' : '') + '"><span>卡片寬</span><b>' + n(cw) + '</b></div>' +
      '<div class="m ' + (Math.abs(d) <= 8 ? 'good' : '') + '"><span>對參考站 394.66</span><b>' + (d >= 0 ? '+' : '') + n(d) + '</b></div>' +
      '<div class="m"><span>縮圖高</span><b>' + n(thumb.getBoundingClientRect().height) + '</b></div>' +
      '<div class="m"><span>標題字級</span><b>' + getComputedStyle(h3).fontSize + '</b></div>' +
      '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>' +
      '<hr>' +
      '<div class="pvbar-note">參考站 1440 上：版心 1280、內距 24、gap 24、卡片 <b>394.66</b>、' +
      '標題 19／28.5、摘要 15／27、日期 14／23.8。<br>' +
      '這一站的字級 2026-08-15 已經對齊過（標題 18.36／28.46、摘要 15.3／27.54、日期 14.04），' +
      '剩下沒對上的就是<b>卡片寬度</b>。</div>';
  }
  addEventListener('resize', measure);
  apply();
})();
</script>
`;

/* ── ③ 切換條插在**最後一個** </body> 前面 ──────────────────────────────
   ⚠ 這一站的註解裡就寫著那幾個字（.nav-lamp 那一段），
     用 String.replace('</body>', …) 會換到註解裡那一個，
     切換條會落在 <head> 的樣式表中間、整段不會執行。 */
const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

/* 尺的樣式排在整份樣式表之後（電腦版那一段是靠順序決勝的），
   所以也塞在切換條前面 —— 它在 <body> 尾端，比 <head> 裡任何一條都後面。 */
html = html.replace(BAR, RULERS + BAR);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/card-width-desktop/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
