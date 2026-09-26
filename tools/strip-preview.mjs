/* ==========================================================================
   提案頁：首頁文章區改成「最新 N 張大卡 ＋ 科別橫幅」（2026-09-26）
   --------------------------------------------------------------------------
   使用者的原案：最新兩篇維持大卡，底下做成科別篩選後的橫向圖卡；
   使用者還沒動手之前自動在科別之間切換、卡片緩慢滑動，一按標籤或卡片就停。

   這一支產生 preview/topic-strip/index.html（index.html 的快照，**不要手改**，
   改完重跑）。CLAUDE.md 第八節那四個坑全部照做：
     ・相對路徑往上兩層（assets/、posts/、site.webmanifest）
     ・計數器降級 data-views-self → data-views（只有 -self 會 POST +1，
       但數字照樣印得出來，同 chip-carry 那一輪）
     ・切換條用 lastIndexOf('</body>') 插入（註解裡也寫著那幾個字）
     ・class 一律 pv- 前綴（站上有 .foot、.card、.chips，短名字一定撞）
   樣式插在 </head> 前面（head-search 那一輪：塞在頁尾會閃一下）。

   ⚠ 卡片仍然全部在靜態 HTML 裡（二十張一張不少），沒有 JS 的時候七科依序攤開、
     每一科有自己的小標 —— CLAUDE.md 第一節第 1 條那條紅線沒有被碰到。
   ⚠ 橫幅的容器帶著 cards 這個 class，站上那支搜尋篩選（.cards .card[data-spec]）
     才抓得到它們，不然在提案頁上打字搜尋會變成「只篩得到上面那兩張」。
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = fs.readFileSync(path.join(root, "index.html"), "utf8");
const outDir = path.join(root, "preview", "topic-strip");

/* ---------- 1. 取出 POSTS 區塊的二十張卡 ---------- */
const S = "<!-- POSTS:START", E = "<!-- POSTS:END -->";
const i0 = src.indexOf(S), i1 = src.indexOf(E);
if (i0 < 0 || i1 < 0) { console.error("× 找不到 POSTS 區塊"); process.exit(1); }
const blockStart = src.indexOf("-->", i0) + 3;
const cardsHtml = src.slice(blockStart, i1);

const parts = cardsHtml.split(/(?=<a class="card")/).map((s) => s.trim()).filter(Boolean);
if (parts.length !== 20) console.warn("⚠ 抓到 " + parts.length + " 張卡（預期 20）");
const cards = parts.map((html) => ({
  html,
  spec: (html.match(/data-spec="([a-z]+)"/) || [])[1] || "",
}));

/* 科別的名字與順序照首頁那排標記讀回來，不另外維護一份。 */
const chipRe = /<a href="\/topics\/([a-z]+)\/" data-spec="([a-z]+)"\s*>([^<]+)<\/a>/g;
const SPECS = [];
for (let m; (m = chipRe.exec(src)); ) SPECS.push({ spec: m[2], name: m[3].trim() });
if (SPECS.length !== 7) { console.error("× 讀到 " + SPECS.length + " 科（預期 7）"); process.exit(1); }

const byCount = {};
for (const c of cards) byCount[c.spec] = (byCount[c.spec] || 0) + 1;
console.log("每一科幾篇：" + SPECS.map((s) => s.name + " " + (byCount[s.spec] || 0)).join("、"));

/* ---------- 2. 新的文章區 ---------- */
const TOPN = 3;                       /* 大卡最多留三張，切換條再收成 1/2/3 */
const top = cards.slice(0, TOPN);
const topHtml = top.map((c, i) => c.html.replace('<a class="card"', '<a class="card pv-big" data-pvi="' + (i + 1) + '"')).join("\n");

/* 橫幅：七科各一組，卡片照原本的上架順序（cards 已經是新到舊）。
   每一科最後掛一張「看○○全部」的小卡，切換條可以關掉。 */
/* 「全部」排在最前面，和首頁那排標記的順序一致（那一排也是「全部」打頭）。
   ⚠ 它和上面的大卡是同一批文章、同一個順序，所以最前面那幾張會重複 ——
   給它們 data-pvdup，切換條的「全部這一條」可以選要不要把它們藏起來。 */
const TABS = [{ spec: "all", name: "全部" }].concat(SPECS);
const groups = TABS.map((s) => {
  const mine = s.spec === "all" ? cards : cards.filter((c) => c.spec === s.spec);
  const rail = mine.map((c, i) => (s.spec === "all" && i < TOPN)
    ? c.html.replace('<a class="card"', '<a class="card" data-pvdup="' + (i + 1) + '"')
    : c.html).join("\n");
  const tail = s.spec === "all" ? ""
    : '<a class="pv-all" data-spec="' + s.spec + '" href="/topics/' + s.spec + '/">看' + s.name + '<br>全部 ' + mine.length + ' 篇 ›</a>';
  return '<div class="pv-group" data-spec="' + s.spec + '">'
    + '<h3 class="pv-gh">' + s.name + '</h3>'
    + '<div class="pv-rail cards">' + rail + tail
    + '</div></div>';
}).join("\n");

const tabs = TABS.map((s, i) => '<button class="pv-tab" type="button" data-spec="' + s.spec + '"'
  + ' aria-selected="' + (i === 0 ? "true" : "false") + '">' + s.name
  + '<span class="pv-n">' + (s.spec === "all" ? cards.length : (byCount[s.spec] || 0)) + '</span></button>').join("");

const newArticles =
  '<div class="cards pv-top">' + topHtml + '</div>\n'
  + '<div class="pv-strip">'
  + '<div class="pv-shead"><span class="pv-stitle">照科別看</span>'
  + '<span class="pv-hint" hidden>自動播放中 —— 點一下就停</span></div>'
  + '<div class="pv-tabs" role="tablist">' + tabs + '</div>'
  + '<div class="pv-groups">' + groups + '</div>'
  + '</div>\n'
  + '<div class="pv-orig cards">' + cardsHtml + '</div>';

/* ---------- 3. 組頁面 ---------- */
let out = src.slice(0, blockStart) + "\n" + newArticles + "\n" + src.slice(i1);

/* ⚠⚠ 外面那個 <div class="cards"> 要換掉。它是 grid-template-columns: repeat(3, 1fr)，
   新版的三塊（大卡區／橫幅／對照現況）塞進去會各自只拿到**畫面的三分之一**，
   卡片被擠成一行一個字。手機上那個 grid 收成一欄，所以 390 寬完全正常 ——
   只有電腦版看得出來（2026-09-26 使用者截圖回報）。
   ⚠ 站上那支搜尋篩選找的是 .cards .card[data-spec]，而 .pv-top 與 .pv-rail
   自己都帶著 cards，所以換掉外層不影響它。 */
out = out.replace('<div class="cards">\n        <!-- POSTS:START', '<div class="pv-wrap">\n        <!-- POSTS:START');
if (out.indexOf('pv-wrap') < 0) { console.error("× 外層那個 cards 沒有換到"); process.exit(1); }

/* 相對路徑往上兩層。前面必須是引號、括號、空白或逗號 —— 這樣 /assets/ 這種
   絕對路徑不會被改到（它前面是斜線）。 */
out = out.replace(/(["'(\s,])(assets\/|posts\/|site\.webmanifest)/g, "$1../../$2");

/* 計數器降級：只有 -self 會 POST +1。 */
out = out.replace(/data-views-self=/g, "data-views=");

/* noindex。插在 <head> 之後第一行。 */
out = out.replace(/<head>/, '<head>\n  <meta name="robots" content="noindex, nofollow, noarchive">');

/* ---------- 4. 樣式（插在 </head> 前面） ----------
   ⚠ 註解裡不可以出現樣式表的結束標籤，也不可以出現註解的結束記號。
   ⚠ 這支產生器是模板字串，CSS 註解裡不可以有反引號。 */
const css = `
<style>
/* 提案頁自己的樣式。名字一律 pv- 前綴 —— 站上 .card .cards .chips .foot 都已經有人用了。 */
.pv-wrap { display: block; }
.pv-top { margin-bottom: 1.6rem; }
.pv-top .card[data-pvi="2"] { display: none; }
.pv-top .card[data-pvi="3"] { display: none; }
html[data-pvn="2"] .pv-top .card[data-pvi="2"] { display: flex; }
html[data-pvn="3"] .pv-top .card[data-pvi="2"],
html[data-pvn="3"] .pv-top .card[data-pvi="3"] { display: flex; }

.pv-shead { display: flex; align-items: baseline; gap: .7rem; margin: 0 0 .55rem; }
.pv-stitle { font-size: .92rem; font-weight: 500; color: var(--ink); }
.pv-hint { font-size: .76rem; color: var(--ink-soft); }

/* 標籤：逐條照站上 .chips 的宣告抄過來（同字級、同內距、同圓角、同色權）。
   不共用那個 class —— 站上那支篩選腳本認 .chips [data-spec]，混進去會被它接管。 */
.pv-tabs { display: flex; gap: .55rem; overflow-x: auto; padding: .1rem .1rem .6rem; scrollbar-width: none; }
.pv-tabs::-webkit-scrollbar { display: none; }
.pv-tab {
  flex: 0 0 auto; font: inherit; font-size: .82rem; line-height: 1.6;
  padding: .25rem .8rem; border-radius: 12px; cursor: pointer;
  -webkit-appearance: none; appearance: none; white-space: nowrap;
  background: var(--card); color: var(--accent-deep); border: 1px solid var(--accent-deep);
  transition: background-color .15s ease, color .15s ease;
}
.pv-tab[aria-selected="true"] { background: var(--accent); color: var(--on-fill); border-color: var(--accent); }
.pv-tab .pv-n { margin-left: .4em; opacity: .72; font-variant-numeric: tabular-nums; }
.pv-tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* 沒有 JS 的時候：七科依序攤開，每一科帶自己的小標，橫向仍然可以用手指滑。
   有 JS 才收成一次一科。 */
.pv-gh { margin: 1.1rem 0 .5rem; font-size: .92rem; color: var(--accent-deep); }
html.pv-js .pv-gh { display: none; }
html.pv-js .pv-group { display: none; }
html.pv-js .pv-group.pv-on { display: block; }

.pv-strip, .pv-groups, .pv-group { min-width: 0; }
.pv-rail.cards {
  display: flex; grid-template-columns: none; gap: 1rem; min-width: 0; max-width: 100%;
  overflow-x: auto; padding-bottom: .7rem;
  scroll-snap-type: x proximity; scrollbar-width: thin;
  overscroll-behavior-x: contain;
}
.pv-rail.cards > .card {
  flex: 0 0 var(--pv-cw, 74%); scroll-snap-align: start;
  /* ⚠ 一定要 relative：卡片裡那顆 .sr-only 是 position:absolute 而卡片本來是 static，
     定位脈絡會跑到橫幅外面去，於是它**不被橫幅裁切**、整頁在 390 寬多出 180px 的
     水平捲動（畫面完全看不出來，只有量 scrollWidth 才知道）。 */
  position: relative;
}
.pv-rail .card-body { padding: .85rem .95rem 1rem; }
.pv-all {
  flex: 0 0 9.5rem; scroll-snap-align: start; display: flex; align-items: center; justify-content: center;
  text-align: center; text-decoration: none; font-size: .86rem; line-height: 1.7;
  border-radius: 12px; border: 1px dashed var(--accent-deep); color: var(--accent-deep);
  background: var(--card);
}
html[data-pvall="0"] .pv-all { display: none; }
/* 「全部」那一條要不要把已經在上面當大卡的那幾張藏起來。 */
html[data-pvd="on"][data-pvn="1"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="2"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="2"] .pv-group[data-spec="all"] .card[data-pvdup="2"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="2"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="3"] { display: none; }

@media (min-width: 721px) {
  .pv-rail.cards > .card { flex-basis: var(--pv-cwd, 44%); }
}
@media (min-width: 1041px) {
  .pv-rail.cards > .card { flex-basis: var(--pv-cwl, 30%); }
  .pv-top { display: grid; gap: 1.4rem; grid-template-columns: repeat(3, 1fr); }
}

/* 對照現況：把新的收起來、把原本那二十張直排放出來。
   ⚠ 不可以用 hidden 屬性 —— .cards 的 display:grid 是作者樣式，
   贏過 UA 樣式表的 [hidden]，那二十張會一直在畫面上（量到 +7.7 屏才發現）。 */
.pv-orig { display: none; }
html[data-pvcur="1"] .pv-top, html[data-pvcur="1"] .pv-strip { display: none; }
html[data-pvcur="1"] .pv-orig { display: grid; }

/* ---- 切換條 ---- */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
  border-top: 1px solid var(--rule); padding: .5rem .7rem calc(.5rem + env(safe-area-inset-bottom));
  font-size: .78rem; color: var(--ink);
}
.pv-row { display: flex; align-items: center; gap: .4rem; margin: .25rem 0; }
.pv-lab { flex: 0 0 4.3rem; color: var(--ink-soft); font-size: .74rem; }
.pv-seg { display: flex; gap: .3rem; flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; }
.pv-seg::-webkit-scrollbar { display: none; }
.pv-seg button {
  font: inherit; font-size: .74rem; white-space: nowrap; cursor: pointer;
  padding: .2rem .55rem; border-radius: 9px; border: 1px solid var(--rule);
  background: var(--card); color: var(--ink-soft);
}
.pv-seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.pv-more { margin-left: auto; font-size: .72rem; color: var(--ink-soft); background: none; border: 0; cursor: pointer; text-decoration: underline; }
.pv-fine[hidden] { display: none; }
.pv-panel { margin-top: .35rem; padding-top: .35rem; border-top: 1px dashed var(--rule); font-size: .72rem; color: var(--ink-soft); line-height: 1.75; }
.pv-panel b { color: var(--ink); font-weight: 500; }
.pv-fold { position: absolute; right: .55rem; top: .3rem; font: inherit; font-size: .8rem;
  line-height: 1; padding: .2rem .4rem; border: 1px solid var(--rule); border-radius: 8px;
  background: var(--card); color: var(--ink-soft); cursor: pointer; }
.pv-open { position: fixed; right: .8rem; bottom: calc(.8rem + env(safe-area-inset-bottom)); z-index: 91;
  font: inherit; font-size: .74rem; padding: .35rem .7rem; border-radius: 999px;
  border: 1px solid var(--rule); background: var(--card); color: var(--ink); cursor: pointer;
  box-shadow: var(--card-shadow); }
.pv-bar { position: fixed; }
html[data-pvbar="0"] .pv-bar { display: none; }
body { padding-bottom: 9.5rem; }
html[data-pvbar="0"] body { padding-bottom: 3rem; }
</style>
`;
out = out.replace("</head>", css + "</head>");

/* ---------- 5. 切換條與行為（插在最後一個 </body> 前面） ---------- */
const bar = `
<div class="pv-bar" id="pv-bar">
  <div class="pv-row"><span class="pv-lab">自動播放</span><span class="pv-seg" data-k="a">
    <button data-v="both">科別＋卡片滑動</button><button data-v="spec">只換科別</button><button data-v="off">關掉</button>
  </span></div>
  <div class="pv-row"><span class="pv-lab">上面大卡</span><span class="pv-seg" data-k="n">
    <button data-v="1">1 張</button><button data-v="2">2 張</button><button data-v="3">3 張</button>
  </span>
  <button class="pv-more" id="pv-more" type="button">細調</button></div>
  <div class="pv-fine" id="pv-fine" hidden>
    <div class="pv-row"><span class="pv-lab">按標籤</span><span class="pv-seg" data-k="t">
      <button data-v="here">就地切換</button><button data-v="here2">就地＋末張看全部</button><button data-v="land">跳著陸頁</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">速度</span><span class="pv-seg" data-k="s">
      <button data-v="slow">慢</button><button data-v="mid">中</button><button data-v="fast">快</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">一屏幾張</span><span class="pv-seg" data-k="w">
      <button data-v="115">1.15</button><button data-v="135">1.35</button><button data-v="160">1.6</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">全部那條</span><span class="pv-seg" data-k="d">
      <button data-v="on">接在大卡後面</button><button data-v="off">完整 20 篇</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">對照</span><span class="pv-seg" data-k="cur">
      <button data-v="0">新版</button><button data-v="1">現況（直排 20 張）</button>
    </span></div>
  </div>
  <div class="pv-panel" id="pv-panel">量測中…</div>
  <button class="pv-fold" id="pv-fold" type="button" aria-label="收起切換條">▾</button>
</div>
<button class="pv-open" id="pv-open" type="button" hidden>切換條</button>
<script>
(function () {
  var D = document.documentElement;
  var DEF = { a: 'both', t: 'here2', n: '2', s: 'mid', w: '135', d: 'on', cur: '0' };
  var st = {};
  Object.keys(DEF).forEach(function (k) {
    var m = location.search.match(new RegExp('[?&]' + k + '=([a-z0-9]+)'));
    st[k] = m ? m[1] : DEF[k];
  });

  var strip = document.querySelector('.pv-strip');
  var tabs = [].slice.call(document.querySelectorAll('.pv-tab'));
  var groups = [].slice.call(document.querySelectorAll('.pv-group'));
  var hint = document.querySelector('.pv-hint');
  var panel = document.getElementById('pv-panel');
  var idx = 0, stopped = false, timer = null, raf = null;
  var SPEED = { slow: 9000, mid: 6000, fast: 3500 };
  var CAP = { slow: 35, mid: 60, fast: 90 };            /* 滑動速度的上限，px/s */

  D.classList.add('pv-js');

  function railOf(i) { return groups[i].querySelector('.pv-rail'); }
  function show(i) {
    idx = (i + groups.length) % groups.length;
    groups.forEach(function (g, j) { g.classList.toggle('pv-on', j === idx); });
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === idx ? 'true' : 'false'); });
  }
  function stopAuto(why) {
    if (stopped) return;
    stopped = true;
    if (timer) { clearInterval(timer); timer = null; }
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (hint) hint.hidden = true;
    measure(why || 'stopped');
  }
  /* ⚠⚠ 不可以寫 r.scrollLeft += 每幀的量。16px/s ÷ 60fps ＝ 每幀 0.27px，
     讀回來被捨掉，卡片永遠停在 0 而畫面完全正常（自動換科照常在跑，
     所以看起來只是「這一科沒滑」）。要自己記一個累加器，再整個指派回去。
     速度不是給死的：照這一科實際滑得動的距離 ÷ 停留時間現算，
     讓它在換到下一科之前剛好滑完；三段速度各有自己的上限，再快就頭暈。 */
  function glide() {
    if (st.a !== 'both' || stopped) return;
    var last = performance.now(), gi = idx, pos = 0;
    function step(now) {
      if (stopped || st.a !== 'both') { raf = null; return; }
      var r = railOf(idx), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (gi !== idx) { gi = idx; pos = 0; }
      if (r) {
        var max = r.scrollWidth - r.clientWidth;
        if (max > 2) {
          var v = Math.min(CAP[st.s], max / Math.max(1, SPEED[st.s] / 1000 - 1.1));
          pos = Math.min(max, pos + v * dt);
          r.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function startAuto() {
    if (stopped || st.a === 'off' || st.cur === '1') { if (hint) hint.hidden = true; return; }
    if (hint) hint.hidden = false;
    timer = setInterval(function () {
      var r = railOf(idx); if (r) r.scrollLeft = 0;
      show(idx + 1);
      measure('auto');
    }, SPEED[st.s]);
    glide();
  }

  /* 捲出畫面就暫停 —— 看不到還在動只是白費電，而且量到的數字會一直跳。 */
  if (window.IntersectionObserver && strip) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (stopped) return;
        if (!e.isIntersecting) { if (raf) { cancelAnimationFrame(raf); raf = null; } if (timer) { clearInterval(timer); timer = null; } }
        else if (!timer) { startAuto(); }
      });
    }, { threshold: 0.15 }).observe(strip);
  }

  tabs.forEach(function (t, j) {
    t.addEventListener('click', function () {
      if (st.t === 'land') {
        var sp = t.getAttribute('data-spec');
        location.href = sp === 'all' ? '/#topics' : '/topics/' + sp + '/';
        return;
      }
      stopAuto('tab'); show(j);
    });
  });
  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest && (e.target.closest('.pv-rail') || e.target.closest('.pv-strip .card'))) stopAuto('touch');
  }, true);

  /* ---- 切換條 ---- */
  function url() {
    var q = Object.keys(DEF).filter(function (k) { return st[k] !== DEF[k]; })
      .map(function (k) { return k + '=' + st[k]; }).join('&');
    history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
  }
  function paint() {
    [].forEach.call(document.querySelectorAll('.pv-seg'), function (seg) {
      var k = seg.getAttribute('data-k');
      [].forEach.call(seg.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-v') === st[k] ? 'true' : 'false');
      });
    });
    D.setAttribute('data-pvn', st.n);
    D.setAttribute('data-pvcur', st.cur);
    D.setAttribute('data-pvall', st.t === 'here2' ? '1' : '0');
    D.setAttribute('data-pvd', st.d);
    D.style.setProperty('--pv-cw', (100 / (parseInt(st.w, 10) / 100) - 4).toFixed(1) + '%');
    url();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.pv-seg button') : null;
    if (!b) return;
    var k = b.parentNode.getAttribute('data-k');
    st[k] = b.getAttribute('data-v');
    paint();
    if (k === 'a' || k === 's' || k === 'cur') {
      stopped = false;
      if (timer) { clearInterval(timer); timer = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      startAuto();
    }
    measure('bar');
  });
  var fold = document.getElementById('pv-fold'), openBtn = document.getElementById('pv-open');
  function bar(on) {
    D.setAttribute('data-pvbar', on ? '1' : '0');
    openBtn.hidden = on;
    document.body.style.paddingBottom = on ? '' : '3rem';
  }
  fold.addEventListener('click', function () { bar(false); });
  openBtn.addEventListener('click', function () { bar(true); measure('bar'); });
  bar(true);

  document.getElementById('pv-more').addEventListener('click', function () {
    var f = document.getElementById('pv-fine');
    f.hidden = !f.hidden;
    this.textContent = f.hidden ? '細調' : '收起';
  });

  /* ---- 量測面板。要量畫出來的東西，不要量屬性。 ---- */
  function measure(why) {
    var H = innerHeight;
    var docs = document.getElementById('doctors');
    var total = document.documentElement.scrollHeight;
    var dy = docs ? docs.getBoundingClientRect().top + scrollY : 0;
    var r = railOf(idx), left = r ? Math.max(0, r.scrollWidth - r.clientWidth) : 0;
    var seen = r ? (r.clientWidth / (r.querySelector('.card') ? r.querySelector('.card').getBoundingClientRect().width + 16 : 1)) : 0;
    panel.innerHTML =
      '整頁 <b>' + (total / H).toFixed(1) + ' 屏</b>（現況 19.2）・醫師介紹在第 <b>'
      + (dy / H).toFixed(1) + ' 屏</b>（現況 12.8）<br>'
      + '這一科 <b>' + (tabs[idx] ? tabs[idx].textContent.replace(/\\d+$/, '') : '') + '</b>'
      + '・一屏看到 <b>' + seen.toFixed(2) + ' 張</b>・還能滑 <b>' + Math.round(left) + 'px</b>'
      + '・自動播放 <b>' + (stopped ? '已停' : (st.a === 'off' ? '關' : '進行中')) + '</b>'
      + '<br>⚠ 自動播放刻意不跟系統的「減少動態效果」。';
  }

  show(0); paint(); startAuto();
  addEventListener('load', function () { measure('load'); });
  addEventListener('resize', function () { measure('resize'); });
  setTimeout(function () { measure('t'); }, 400);
})();
</script>
`;
const b = out.lastIndexOf("</body>");
if (b < 0) { console.error("× 找不到 </body>"); process.exit(1); }
out = out.slice(0, b) + bar + out.slice(b);

/* ---------- 6. 守門 ---------- */
const guards = [
  ["切換條在最後一個 body 之前", out.lastIndexOf("pv-bar") < out.lastIndexOf("</body>")],
  ["樣式在 head 裡", out.indexOf(".pv-rail.cards") < out.indexOf("</head>")],
  ["noindex 有了", /content="noindex, nofollow, noarchive"/.test(out)],
  ["計數器降級了", !/data-views-self/.test(out)],
  ["二十張卡都在（新的那一份）", (out.match(/<a class="card"|<a class="card pv-big"/g) || []).length >= 20],
  ["相對路徑改了", !/src="assets\//.test(out) && !/href="posts\//.test(out)],
];
let bad = 0;
for (const [name, ok] of guards) { if (!ok) { console.error("× 守門沒過：" + name); bad++; } }
if (bad) process.exit(1);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), out);
console.log("✓ 寫好 preview/topic-strip/index.html（" + (out.length / 1024).toFixed(0) + " KB）");
