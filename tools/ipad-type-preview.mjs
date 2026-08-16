/* ==========================================================================
   preview/type-scale-ipad-2/ 的產生器（2026-08-16，提案期間專用）
   --------------------------------------------------------------------------
   使用者：「這幾張是 iPad 打開的樣子，你幫我做像手機那樣放大字級的幾個版本，
   我來看看那個效果。」（附三張 iPad mini 直放 744×1133 的截圖：文章卡、
   醫師介紹、診所資訊）

   iPad 2026-08-15 已經整站 +19%（根字級 19px），但那是**主尺**——
   手機那一輪（preview/card-type-mobile/）走的是另一條路：主尺不動，
   **逐區塊**再抬（文章卡 22.4／17.6、醫師卡內文 16、門診表、地圖）。
   這一頁把兩條路都給他：一條主尺 ＋ 三條區塊的尺。

   ⚠ 這一頁是 index.html 的**完整複本（快照）**，不要手改 —— 改 index.html
     或改這支之後重跑一次。CLAUDE.md 第八節那四個陷阱這裡全部照做：
       ① 相對路徑往上兩層（不用 <base href="/">，那會讓 #topics 跳回首頁）
       ② 拿掉 counter.js 與 data-views-self（不拿掉每開一次首頁計數就 +1）
       ③ 切換條插在**最後一個** </body> 前面（用 lastIndexOf —— 這一站的
          註解裡就有 </body> 那個字串，String.replace 會換到註解裡那一個）
       ④ preview/ 進 _site/、robots.txt、Worker 的 no-store 三處都已經就位

   定案之後：把 preview/type-scale-ipad-2/ 與這支一起刪掉，推導搬進
   history/type-scale-ipad-2.html。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'type-scale-ipad-2');

let h = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ---- ② 計數器：整支拿掉，數字由切換條那支 JS 寫死 ---------------------- */
h = h.replace(/[ \t]*<script src="assets\/counter\.js" defer><\/script>\n/, '');
h = h.replace(' data-views-self="home"', '');

/* ---- ① 相對路徑往上兩層 ------------------------------------------------- */
h = h.replace(/(["'\s])assets\//g, '$1../../assets/');
h = h.replace(/href="posts\//g, 'href="../../posts/');
h = h.replace(/href="site\.webmanifest/g, 'href="../../site.webmanifest');

/* ---- 機器讀的那一段整塊換掉：提案頁只要 noindex ------------------------- */
h = h.replace(
  /<!-- SEO:START[\s\S]*?SEO:END -->/,
  '<meta name="robots" content="noindex, nofollow, noarchive">'
);
h = h.replace(/<link rel="canonical"[^>]*>\n/, '');
h = h.replace('<title>', '<title>iPad 字級提案 · ');

/* ==========================================================================
   四條尺
   --------------------------------------------------------------------------
   全部寫成 rem，所以區塊的尺**會跟著主尺一起長**（面板上顯示的是現場量到的
   px，不必自己乘）。基底值就是站上現在的值，所以第一格「現況」和線上
   逐字相同。
   ========================================================================== */
const RULERS = [
  { key: 'r', name: '全站主尺',
    note: '頁首、選單、兩排科別標記、卡片留白…整組一起長',
    steps: [
      { id: 'r0', label: '現況 +19%', vars: { '--u-root': '1' },      hint: '根 19px' },
      { id: 'r1', label: '+25%',      vars: { '--u-root': '1.05263' }, hint: '根 20px' },
      { id: 'r2', label: '+31%',      vars: { '--u-root': '1.10526' }, hint: '根 21px' },
    ] },

  { key: 'c', name: '文章卡',
    note: '標題／摘要／日期',
    steps: [
      { id: 'c0', label: '現況', hint: '19.4 / 16.2 / 14.8',
        vars: { '--f-card-h3': '1.02rem', '--f-card-p': '.85rem',  '--f-card-date': '.78rem' } },
      { id: 'c1', label: 'Ⓐ',   hint: '20.9 / 17.1 / 15.2',
        vars: { '--f-card-h3': '1.10rem', '--f-card-p': '.90rem',  '--f-card-date': '.80rem' } },
      { id: 'c2', label: 'Ⓑ 手機同尺', hint: '22.4 / 17.6 / 15.2',
        vars: { '--f-card-h3': '1.179rem','--f-card-p': '.926rem', '--f-card-date': '.80rem' } },
      { id: 'c3', label: 'Ⓒ',   hint: '23.9 / 18.6 / 16.0',
        vars: { '--f-card-h3': '1.26rem', '--f-card-p': '.98rem',  '--f-card-date': '.84rem' } },
    ] },

  { key: 'd', name: '醫師卡',
    note: '醫師名／專長・資歷・學歷／灰標籤與專長標記',
    steps: [
      { id: 'd0', label: '現況', hint: '20.0 / 15.8 / 15.4',
        vars: { '--f-doc-h3': '1.05rem', '--f-doc-dd': '.83rem',  '--f-doc-dt': '.81rem' } },
      { id: 'd1', label: 'Ⓐ',   hint: '21.3 / 16.7 / 16.3',
        vars: { '--f-doc-h3': '1.12rem', '--f-doc-dd': '.88rem',  '--f-doc-dt': '.86rem' } },
      { id: 'd2', label: 'Ⓑ 手機同尺', hint: '22.4 / 17.6 / 17.1',
        vars: { '--f-doc-h3': '1.179rem','--f-doc-dd': '.926rem', '--f-doc-dt': '.90rem' } },
      { id: 'd3', label: 'Ⓒ',   hint: '23.9 / 18.6 / 18.1',
        vars: { '--f-doc-h3': '1.26rem', '--f-doc-dd': '.98rem',  '--f-doc-dt': '.955rem' } },
    ] },

  { key: 'i', name: '診所資訊',
    note: '門診表的時間與點／說明兩句／位置與周邊停車的內文／診間照說明',
    steps: [
      { id: 'i0', label: '現況', hint: '15.2 / 17.7 · 點 10.6',
        vars: { '--f-hours': '.8rem',   '--w-lab': '6.3rem',  '--f-dot': '.56rem',
                '--f-infop': '.93rem',  '--f-small': '.8rem' } },
      { id: 'i1', label: 'Ⓐ',   hint: '16.3 / 18.6 · 點 11.4',
        vars: { '--f-hours': '.86rem',  '--w-lab': '6.77rem', '--f-dot': '.60rem',
                '--f-infop': '.98rem',  '--f-small': '.86rem' } },
      { id: 'i2', label: 'Ⓑ 手機同尺', hint: '17.6 / 19.8 · 點 12.4',
        vars: { '--f-hours': '.926rem', '--w-lab': '7.29rem', '--f-dot': '.65rem',
                '--f-infop': '1.04rem', '--f-small': '.926rem' } },
      { id: 'i3', label: 'Ⓒ',   hint: '18.6 / 20.9 · 點 13.3',
        vars: { '--f-hours': '.98rem',  '--w-lab': '7.72rem', '--f-dot': '.70rem',
                '--f-infop': '1.10rem', '--f-small': '.98rem' } },
    ] },
];

/* 面板上要現場量的幾格。sel ＝ 選擇器，what ＝ 量什麼。 */
const PROBES = [
  ['根字級',      'html',                  'fs'],
  ['文章卡標題',  '.card h3',              'fs'],
  ['文章卡摘要',  '.card p',               'fs'],
  ['文章卡日期',  '.card-date',            'fs'],
  ['醫師名',      '.doc h3',               'fs'],
  ['醫師卡內文',  '.doc dd',               'fs'],
  ['專長標記',    '.sk',                   'fs'],
  ['門診表時間',  '.hours-grid tbody th',  'fs'],
  ['門診表的點',  '.hours-grid .d',        'w'],
  ['停車內文',    '.card-map p',           'fs'],
  ['頁首選單',    '.site-nav a',           'fs'],
  ['科別標記',    '.chips button',         'fs'],
];

const BAR = `
<!-- ==========================================================================
     切換條（提案期間專用，定案後連同 data-* 屬性一起刪掉）
     --------------------------------------------------------------------------
     ⚠ **按一下會重新載入**，不是即時套用。這一站有三支「開頁量一次」的 JS：
       有底色的小標籤（--sk-padT／--role-padT，見 index.html 那支 FIT）、
       選單那顆燈的 --lamp-pad、以及頁首高度連動的幾個量測。字級一改它們
       全部要重算，即時套用會讀到上一組的值。
       （back-to-top 那一輪可以即時套用，是因為那一輪不動任何字級 ——
        CLAUDE.md 第八節寫著「要先確認這件事再決定哪一種」。）
     ⚠ 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到 c2 這種值。
     ========================================================================== -->
<style>
/* ---- 四條尺的預設值 ＝ 站上現在的值（所以第一格和線上逐字相同）-------- */
:root{
  --u-root:1;
  --f-card-h3:1.02rem; --f-card-p:.85rem; --f-card-date:.78rem;
  --f-doc-h3:1.05rem; --f-doc-dd:.83rem; --f-doc-dt:.81rem;
  --f-hours:.8rem; --w-lab:6.3rem; --f-dot:.56rem; --f-infop:.93rem; --f-small:.8rem;
}
/* ⚠ 這一段的媒體條件要和站上 iPad 那一段**一模一樣**（min-width:721 ＋
     max-aspect-ratio 9/10），不然電腦版與手機版會被波及。
   ⚠ 這個 <style> 在 <body> 裡、排在整份樣式表後面，所以同權重的 :root
     一定贏（和站上那幾段靠順序決勝是同一個道理）。 */
@media (min-width:721px) and (max-aspect-ratio: 9/10){
  :root{ --type-scale: calc(1.1875 * var(--u-root)); }

  .card h3   { font-size: var(--f-card-h3); }
  .card p    { font-size: var(--f-card-p); }
  .card-date { font-size: var(--f-card-date) !important; }

  .doc h3 { font-size: var(--f-doc-h3); }
  .doc dd { font-size: var(--f-doc-dd); }
  .doc dt { font-size: var(--f-doc-dt); }
  /* 專長標記的字級 ＝ 內文（站上的定案：套色之後完全不縮，動一個要動兩個）。
     它上下的內距是 em ＋ 由 JS 現量，字一大就自己跟著長。 */
  :root   { --sk-fs: var(--f-doc-dd); }
  /* 醫師名一變大，專科藥丸的抬升量就要跟著重算（CLAUDE.md 第九節第 9 條）。
     站上的 .158em 是 h3 ＝ 1.05rem 時使用者點頭的值；名字每長一階，
     字面中線就低 0.345 ×（名 − 藥丸）÷ 藥丸。藥丸固定 .8rem，所以
       Δ ＝ 0.345 × 1.05 ÷ 0.8 ×（倍率 − 1）＝ .4528em ×（倍率 − 1）
     倍率 ＝ 1 時正好還原成 .158em，現況一個像素都不會動。 */
  .doc-role { vertical-align: calc(.158em + .4528em * (var(--f-doc-h3) / 1.05rem - 1)); }

  .hours-grid thead th, .hours-grid tbody th { font-size: var(--f-hours); }
  /* 「早／午／晚」按站上原本的比值 .82 ÷ .8 ＝ 1.025 跟上，不然時間會比它大。 */
  #clinic .hours-grid tbody th b { font-size: calc(var(--f-hours) * 1.025); }
  /* ⚠⚠ 左欄一定要跟著字級長。表格是 table-layout: fixed ＋ tbody th 是
       nowrap，左欄太窄不會有水平捲動，時間會**橫著蓋到第一顆點**。
       每一格的 --w-lab 都是照 6.3 ÷ .8 這個比例算出來的。 */
  .hours-grid col.lab { width: var(--w-lab); }
  .hours-grid .d      { width: var(--f-dot); height: var(--f-dot); }
  .info-card p        { font-size: var(--f-infop); }
  .map-note, .gallery figcaption { font-size: var(--f-small); }
  /* 站上這一條自己帶 !important，所以這裡也要。 */
  .info-note { font-size: var(--f-small) !important; }
}

/* ---- 切換條本身 ------------------------------------------------------- */
#tsbar{
  position:fixed; left:0; right:0; bottom:0; z-index:9999;
  background:rgba(22,24,22,.94); backdrop-filter:blur(10px);
  color:#eef0ec; font:400 13px/1.5 system-ui,-apple-system,"Noto Sans TC",sans-serif;
  padding:8px 10px calc(8px + env(safe-area-inset-bottom));
  box-shadow:0 -6px 24px rgba(0,0,0,.28);
}
/* 收起 ＝ 縮成右下角一顆小鈕，不是變矮的一條。
   ⚠ 這一站 iPad 的 HERO 是「照片＋窄帶正好一屏」，整條的切換條會把窄帶
     （地址、電話、1983／9／5）整個蓋掉 —— 要看那一屏就得讓它離開版面底部。 */
#tsbar.mini{
  left:auto; right:10px; bottom:calc(10px + env(safe-area-inset-bottom));
  border-radius:10px; padding:4px 6px;
}
#tsbar.mini .row, #tsbar.mini #tspanel,
#tsbar.mini .head b, #tsbar.mini .head span, #tsbar.mini #tsmeasure{ display:none; }
#tsbar.mini #tsmini{ display:inline-block; }
#tsbar .row{ display:flex; align-items:center; gap:6px; margin:5px 0; flex-wrap:wrap; }
#tsbar .nm{ flex:0 0 5.4em; font-size:12px; color:#aeb3ac; }
#tsbar button{
  font:inherit; font-size:12.5px; color:#eef0ec; background:transparent;
  border:1px solid rgba(238,240,236,.32); border-radius:8px;
  padding:6px 9px; min-height:34px; cursor:pointer;
}
#tsbar button[aria-pressed="true"]{ background:#eef0ec; color:#161816; border-color:#eef0ec; }
#tsbar .head{ display:flex; align-items:center; gap:8px; }
#tsbar .head b{ font-weight:600; font-size:12.5px; }
#tsbar .head span{ color:#9aa097; font-size:11.5px; }
#tsbar .head .sp{ margin-left:auto; }
#tspanel{
  margin-top:6px; padding-top:6px; border-top:1px solid rgba(238,240,236,.18);
  color:#c9cec6; font-size:11.5px; line-height:1.7;
  display:grid; grid-template-columns:repeat(3,1fr); gap:2px 10px;
}
#tspanel .bad{ color:#f0a1a1; }
#tspanel .ok{ color:#a9d7ad; }
body{ padding-bottom:190px; }
body.tsmini{ padding-bottom:0; }
</style>

<div id="tsbar" hidden>
  <div class="head">
    <b>iPad 字級</b><span id="tsvp"></span>
    <span class="sp"></span>
    <button type="button" id="tsmeasure">量測</button>
    <button type="button" id="tsmini">收起</button>
  </div>
  <div id="tsrows"></div>
  <div id="tspanel" hidden></div>
</div>

<script>
(function(){
  var RULERS = ${JSON.stringify(RULERS)};
  var PROBES = ${JSON.stringify(PROBES)};

  /* ---- 讀網址參數。⚠ 正規式一定要 [a-z0-9]+ ---------------------------- */
  var q = location.search, pick = {};
  RULERS.forEach(function(r){
    var m = new RegExp('[?&]' + r.key + '=([a-z0-9]+)').exec(q);
    var ids = r.steps.map(function(s){ return s.id; });
    pick[r.key] = (m && ids.indexOf(m[1]) >= 0) ? m[1] : ids[0];
  });

  /* ---- 套用：把選到的那一格的變數寫進 :root ---------------------------- */
  var root = document.documentElement;
  RULERS.forEach(function(r){
    var st = r.steps.filter(function(s){ return s.id === pick[r.key]; })[0];
    Object.keys(st.vars).forEach(function(k){ root.style.setProperty(k, st.vars[k]); });
  });

  /* ---- 畫切換條 -------------------------------------------------------- */
  var bar = document.getElementById('tsbar'), rows = document.getElementById('tsrows');
  RULERS.forEach(function(r){
    var row = document.createElement('div');
    row.className = 'row';
    var nm = document.createElement('span');
    nm.className = 'nm'; nm.textContent = r.name; nm.title = r.note;
    row.appendChild(nm);
    r.steps.forEach(function(s){
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s.label;
      b.title = s.hint;
      b.setAttribute('aria-pressed', String(pick[r.key] === s.id));
      b.addEventListener('click', function(){ go(r.key, s.id); });
      row.appendChild(b);
    });
    rows.appendChild(row);
  });
  bar.hidden = false;

  /* 重新載入（見上面那段註解：三支「開頁量一次」的 JS 要重算）。
     捲動位置留住，不然每按一次都跳回最上面。 */
  function go(key, id){
    var next = {};
    RULERS.forEach(function(r){ next[r.key] = pick[r.key]; });
    next[key] = id;
    var qs = RULERS.map(function(r){ return r.key + '=' + next[r.key]; }).join('&');
    try { sessionStorage.setItem('tsy', String(window.scrollY)); } catch (e) {}
    location.replace(location.pathname + '?' + qs);
  }
  try {
    var y = sessionStorage.getItem('tsy');
    if (y !== null) { sessionStorage.removeItem('tsy'); window.scrollTo(0, +y); }
  } catch (e) {}

  /* 收起／展開的狀態要撐過重新載入（每按一次尺就會重載一次）。 */
  var mini = document.getElementById('tsmini');
  function setMini(on){
    bar.classList.toggle('mini', on);
    document.body.classList.toggle('tsmini', on);
    mini.textContent = on ? '字級' : '收起';
    try { sessionStorage.setItem('tsmini', on ? '1' : '0'); } catch (e) {}
  }
  mini.addEventListener('click', function(){ setMini(!bar.classList.contains('mini')); });
  try { if (sessionStorage.getItem('tsmini') === '1') setMini(true); } catch (e) {}

  /* ---- 現場量測 -------------------------------------------------------- */
  var panel = document.getElementById('tspanel'), mOn = false;
  function px(n){ return (Math.round(n * 100) / 100) + 'px'; }
  function measure(){
    var out = [];
    PROBES.forEach(function(p){
      var el = document.querySelector(p[1]);
      if (!el) return;
      var cs = getComputedStyle(el);
      out.push(p[0] + ' <b>' + px(parseFloat(p[2] === 'w' ? cs.width : cs.fontSize)) + '</b>');
    });
    /* 這一段最緊的一格：品牌到選單之間還剩多少（744 寬的 iPad mini 上，
       主尺 +19% 已經從 192.6 掉到 94.6px —— 再往上加就是這一格先出事）。 */
    var brand = document.querySelector('.site-head .brand');
    var nav = document.querySelector('.site-head .site-nav');
    if (brand && nav) {
      var gap = nav.getBoundingClientRect().left - brand.getBoundingClientRect().right;
      out.push('<span class="' + (gap < 24 ? 'bad' : 'ok') + '">品牌→選單 <b>' + px(gap) + '</b></span>');
    }
    /* 水平捲動（＝破框）。 */
    var se = document.scrollingElement || document.documentElement;
    var over = se.scrollWidth - se.clientWidth;
    out.push('<span class="' + (over > 1 ? 'bad' : 'ok') + '">水平捲動 <b>' + px(over) + '</b></span>');
    /* 門診表：時間的字尾到第一顆點還剩多少（負的就是橫著蓋上去了）。
       ⚠ 表格是 table-layout: fixed ＋ tbody th 是 nowrap，左欄不夠寬**不會**
         有水平捲動，症狀是重疊 —— 所以這一格要單獨量。
       ⚠ 字尾要用 Range 量（元素的 rect 是整個欄寬，量不出字到哪裡）。 */
    var th = document.querySelector('.hours-grid tbody th');
    var d1 = document.querySelector('.hours-grid tbody td .d');
    if (th && d1) {
      var rg = document.createRange();
      rg.selectNodeContents(th);
      var room = d1.getBoundingClientRect().left - rg.getBoundingClientRect().right;
      out.push('<span class="' + (room < 8 ? 'bad' : 'ok') + '">時間→第一顆點 <b>' + px(room) + '</b></span>');
    }
    panel.innerHTML = out.map(function(s){ return '<div>' + s + '</div>'; }).join('');
  }
  document.getElementById('tsmeasure').addEventListener('click', function(){
    mOn = !mOn; panel.hidden = !mOn; this.setAttribute('aria-pressed', String(mOn));
    if (mOn) measure();
  });

  /* 視窗資訊：這一頁只在 iPad／直式平板那一段生效，別的比例要講清楚。 */
  var vp = document.getElementById('tsvp');
  function vpInfo(){
    var w = innerWidth, hh = innerHeight, ar = w / hh;
    var inSeg = w >= 721 && ar <= 0.9;
    vp.textContent = w + '×' + hh + '（' + ar.toFixed(2) + '）' + (inSeg ? '' : ' ⚠ 不在 iPad 那一段，尺不會生效');
    if (mOn) measure();
  }
  vpInfo();
  addEventListener('resize', vpInfo);

  /* ---- 提案頁的計數器：整支 counter.js 已經拿掉了 ----------------------
     ⚠ 每開一次提案頁首頁的計數就 +1 —— 這是 CLAUDE.md 第八節的第二個陷阱。
     ⚠ 這裡的數字是**示範值**，絕對不要跟著版型搬回正式站（2026-08-07 踩過：
       示範值 8642 把真實的 190 蓋掉還不會動）。 */
  if (window.fangrenCountUp) window.fangrenCountUp(1274);
  var DEMO = { 'kids-arch-expansion':28, 'regular-checkup':25, 'missing-tooth':28,
               'kids-first-visit':25, 'gum-bleeding':31, 'bass-brushing':46 };
  Array.prototype.forEach.call(document.querySelectorAll('.views[data-views]'), function(el){
    var n = DEMO[el.getAttribute('data-views')];
    if (n == null) return;
    el.setAttribute('data-state', 'ok');
    var s = el.querySelector('.views-n');
    if (s) s.textContent = String(n);
  });
})();
</script>
`;

/* ---- ③ 切換條插在最後一個 </body> 前面 ---------------------------------- */
const at = h.lastIndexOf('</body>');
if (at < 0) throw new Error('找不到 </body>');
h = h.slice(0, at) + BAR + h.slice(at);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'index.html'), h);
console.log('寫好 preview/type-scale-ipad-2/index.html（' + (h.length / 1024).toFixed(0) + ' KB）');
