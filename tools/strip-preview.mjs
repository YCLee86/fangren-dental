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
  + ' aria-selected="' + (i === 0 ? "true" : "false") + '">' + s.name + '</button>').join("");

const newArticles =
  '<div class="sec-head"><h2>最新文章</h2></div>'
  + '<div class="cards pv-top">' + topHtml + '</div>\n'
  + '<div class="pv-strip">'
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
/* 自動：一排剛好排得下幾張就顯示幾張。斷點**照站上 .cards 那一組**
   （≥1041 三欄、721~1040 兩欄、≤720 一欄），不要另外發明一組 ——
   .pv-top 本身就掛著 cards，欄數是站上那三條在決定，張數跟它對齊才不會出現
   「兩欄放三張」那種 2＋1 的斷行（2026-09-26 使用者截圖回報）。
   ⚠ 這三條要寫在上面那幾條的後面：同一個權重，靠順序決勝。 */
html[data-pvn="auto"] .pv-top .card[data-pvi="2"],
html[data-pvn="auto"] .pv-top .card[data-pvi="3"] { display: flex; }
@media (max-width: 1040px) { html[data-pvn="auto"] .pv-top .card[data-pvi="3"] { display: none; } }
@media (max-width: 720px)  { html[data-pvn="auto"] .pv-top .card[data-pvi="2"] { display: none; } }


/* 標籤：逐條照站上 .chips 的宣告抄過來（同字級、同內距、同圓角、同色權）。
   不共用那個 class —— 站上那支篩選腳本認 .chips [data-spec]，混進去會被它接管。 */
.pv-strip { margin-top: 1.2rem; }
.pv-tabs { display: flex; gap: .55rem; overflow-x: auto; padding: .1rem .1rem .6rem; scrollbar-width: none; }
.pv-tabs::-webkit-scrollbar { display: none; }
.pv-tab {
  flex: 0 0 auto; font: inherit; line-height: 1.6;
  /* ⚠ 字級與上下內距要抄站上那一排的**最後一條**（index.html 的
     .chips :is(button,a) 的 font-size .90rem 與 padding-block calc(…)），
     不是前面那條 .82rem／.25rem —— 後面那一條把兩個都蓋掉了。
     只抄前面那條的話，量出來字小 1.28px、塊矮 0.96px（畫面上就是「小一號」）。 */
  font-size: .90rem; padding: calc((34px - 1.6em - 2px) / 2) .8rem;
  border-radius: 12px; cursor: pointer;
  -webkit-appearance: none; appearance: none; white-space: nowrap;
  background: var(--card); color: var(--accent-deep); border: 1px solid var(--accent-deep);
  transition: background-color var(--pv-tabt, .45s) ease, color var(--pv-tabt, .45s) ease, border-color var(--pv-tabt, .45s) ease;
}
.pv-tab[aria-selected="true"] { background: var(--accent); color: var(--on-fill); border-color: var(--accent); }
.pv-tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* 沒有 JS 的時候：七科依序攤開，每一科帶自己的小標，橫向仍然可以用手指滑。
   有 JS 才收成一次一科。 */
.pv-gh { margin: 1.1rem 0 .5rem; font-size: .92rem; color: var(--accent-deep); }
html.pv-js .pv-gh { display: none; }
html.pv-js .pv-group { display: none; }
html.pv-js .pv-group.pv-on { display: block; }
/* 換科時圖卡要和標籤同時到位。原本圖卡是 display 直接換（0 秒），
   標籤的顏色是 0.6 秒的漸變 —— 每一次換科圖卡都比標籤早 0.6 秒到，
   看起來就是「標籤還沒全亮圖卡就先切了」（2026-09-26 使用者回報）。
   讓進來的那一組用**同一個變數、同一條曲線**淡入，兩邊就對齊了。
   ⚠ 用 animation 不用 transition：這一組是從 display:none 變回來的，
   transition 在同一幀裡不會跑（起始值沒有被算過）。
   ⚠ 不做「兩組同時疊著對拉」的 cross-fade —— 那要把七組一起留在版面上
   （grid 疊層 ＋ visibility），二十張卡的圖會全部被載進來。 */
@keyframes pv-fade { from { opacity: 0; } to { opacity: 1; } }
html.pv-js .pv-group.pv-on { animation: pv-fade var(--pv-tabt, .6s) ease both; }

.pv-strip, .pv-groups, .pv-group { min-width: 0; }
.pv-rail.cards {
  display: flex; grid-template-columns: none; gap: 1rem; min-width: 0; max-width: 100%;
  overflow-x: auto; padding-bottom: .7rem;
  scroll-snap-type: x proximity; scrollbar-width: thin;
  /* ⚠⚠ 自動滑動的時候一定要把吸附關掉。scroll-snap 會把每一幀的小位移
     吸回最近的那一格，畫面上看到的是「每隔幾秒跳一張卡」，不是緩慢滑動
     （桌機量到 0,0,0,0,388,388 —— 388 剛好是一張卡 370 ＋ 間距 16）。 */
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
/* 夜間：沒選到的標籤 ＝ 套色 20% 的淡色塊、字用 --pill-ink。
   這一條逐字抄站上那排科別標記的夜間規則（index.html 的
   html[data-theme="dark"] :is(.chips …, .hours-filter …, .card-tag…) 那一段）——
   不抄的話夜間會停在白天的長相（白底 ＋ 深色框），和上面那一排對不起來。
   ⚠ 選到的那一顆夜間沒有被覆寫，維持 --accent ＋ --on-fill，和站上一致。 */
html[data-theme="dark"] .pv-tab[aria-selected="false"] {
  background: color-mix(in srgb, var(--accent) 20%, var(--card));
  border-color: color-mix(in srgb, var(--accent) 20%, var(--card));
  color: var(--pill-ink);
}
html[data-pvglide="1"] .pv-rail.cards { scroll-snap-type: none; }
html[data-pvall="0"] .pv-all { display: none; }
/* 「全部」那一條要不要把已經在上面當大卡的那幾張藏起來。 */
html[data-pvd="on"][data-pvn="1"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="2"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="2"] .pv-group[data-spec="all"] .card[data-pvdup="2"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="1"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="2"],
html[data-pvd="on"][data-pvn="3"] .pv-group[data-spec="all"] .card[data-pvdup="3"],
html[data-pvd="on"][data-pvn="auto"] .pv-group[data-spec="all"] .card[data-pvdup] { display: none; }
@media (max-width: 1040px) { html[data-pvd="on"][data-pvn="auto"] .pv-group[data-spec="all"] .card[data-pvdup="3"] { display: flex; } }
@media (max-width: 720px)  { html[data-pvd="on"][data-pvn="auto"] .pv-group[data-spec="all"] .card[data-pvdup="2"] { display: flex; } }

/* ⚠ 卡寬只有一個來源：--pv-cw，由 JS 照「這一條橫幅實際有多寬」現算成 px。
   原本這裡還有兩個寫死的覆蓋值（電腦 30%、平板 44%），結果「一屏幾張」那條尺
   在電腦上按了完全沒反應 —— 它只改得到手機那一條宣告。 */


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
.pv-fine { max-height: 30vh; overflow-y: auto; }
.pv-fine[hidden] { display: none; }
.pv-note { margin: .2rem 0 .35rem; font-size: .7rem; color: var(--ink-soft); line-height: 1.6; }
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
    <button data-v="auto">自動（跟版面）</button><button data-v="1">1 張</button><button data-v="2">2 張</button><button data-v="3">3 張</button>
  </span>
  <button class="pv-more" id="pv-more" type="button">細調</button></div>
  <div class="pv-fine" id="pv-fine" hidden>
    <p class="pv-note">⚠ 這一頁的自動播放刻意不跟系統的「減少動態效果」—— 跟了就什麼都看不到。</p>
    <div class="pv-row"><span class="pv-lab">按標籤</span><span class="pv-seg" data-k="t">
      <button data-v="here">就地切換</button><button data-v="here2">就地＋末張看全部</button><button data-v="land">跳著陸頁</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">滑動速度</span><span class="pv-seg" data-k="g">
      <button data-v="g1">極慢 8</button><button data-v="g2">很慢 14</button><button data-v="g3">慢 25</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">換科時</span><span class="pv-seg" data-k="p">
      <button data-v="keep">橫幅停在原處</button><button data-v="reset">回到最前面</button>
    </span></div>
    <div class="pv-row"><span class="pv-lab">一屏幾張</span><span class="pv-seg" data-k="w">
      <button data-v="w1">少</button><button data-v="w2">中</button><button data-v="w3">多</button>
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
  /* 預設 ＝ 2026-09-26 使用者在電腦上挑定的那一組（他的截圖逐格對過）：
   自動播放 科別＋卡片滑動／上面大卡 自動（跟版面）／按標籤 就地切換／
   滑動 很慢 14／換科時 橫幅停在原處／一屏幾張 中／全部那條 接在大卡後面。
   ⚠ 手機那一側他還沒看，所以尺**先不收**，等他看完再一起定。 */
  var DEF = { a: 'both', t: 'here', n: 'auto', g: 'g2', s: 's5', x: 'x4', p: 'keep', w: 'w2', d: 'on', cur: '0' };
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
  var idx = 0, stopped = false, timer = null, raf = null, gpos = [], done = [];
  /* ✅ 2026-09-26 使用者定案：**換科 2.67 秒、標籤換色 0.6 秒**。
     兩條尺收成預設值、從切換條上拿掉（同 head-search 與 night-map-park 那兩輪），
     網址參數仍然吃得到（?s=s0…、?x=x2…），要回頭比對不必改程式。
     ⚠ 滑動速度與換科快慢**拆成兩條尺**（2026-09-26 使用者：滑動要比「慢」再慢、
     換科要再快一點）。原本停留時間是從「這一條滑得完」反推的，兩件事綁在一起，
     滑得愈慢就停得愈久 —— 他要的正好是相反的組合。 */
  var V = { g1: 8, g2: 14, g3: 25 };                    /* 橫向滑動，px/s，定速 */
  var SPEED = { s0: 2000, s4: 2500, s5: 2670, s6: 2840, s1: 3000, s2: 4500 }; /* 一科停多久就換 */
  var XT = { x2: '.45s', x4: '.6s', x5: '.7s', x3: '.8s' }; /* 標籤換色的時間 */

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
    if (timer) { clearTimeout(timer); timer = null; }
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    D.removeAttribute('data-pvglide');
    if (hint) hint.hidden = true;
    measure(why || 'stopped');
  }
  /* ⚠⚠ 不可以寫 r.scrollLeft += 每幀的量。16px/s ÷ 60fps ＝ 每幀 0.27px，
     讀回來被捨掉，卡片永遠停在 0 而畫面完全正常（自動換科照常在跑，
     所以看起來只是「這一科沒滑」）。要自己記一個累加器，再整個指派回去。
     速度不是給死的：照這一科實際滑得動的距離 ÷ 停留時間現算，
     讓它在換到下一科之前剛好滑完；三段速度各有自己的上限，再快就頭暈。 */
  /* 這一科要停多久：滑得完就照滑完的時間（再加 1.2 秒讓人看清最後一張），
     但不少於「至少停多久」、不多於「最多停多久」。二十篇那一條因此會停久一點。 */
  function dwell() { return SPEED[st.s]; }
  function glide() {
    if (st.a !== 'both' || stopped) return;
    D.setAttribute('data-pvglide', '1');
    var last = performance.now();
    function step(now) {
      if (stopped || st.a !== 'both') { raf = null; D.removeAttribute('data-pvglide'); return; }
      var r = railOf(idx), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (r) {
        var max = r.scrollWidth - r.clientWidth;
        if (max > 2) {
          /* 位置記在各科自己身上：滑得慢又換得快的話，如果每次回來都歸零，
             二十篇那一條永遠只看得到最前面兩三張。
             ⚠⚠ 但**滑到底不可以就這樣停著**（2026-09-26 使用者回報）——
             底部不是任何一張卡的邊界，畫面會變成「左邊固定掛著半張卡、而且再也
             不動」，讀的人得自己猜那半張是剛剛看過的哪一篇。量過：電腦上
             一般牙科／植牙假牙只可滑 115px，轉兩三圈就卡死；牙周／兒童 507px，
             十幾圈之後一樣卡死。做法是**記下「這一條已經滑完」，等換科之後
             （那時它已經 display:none）再把它歸零**，下次輪回來從第一張重新滑。
             在畫面上歸零的話會看到它跳一下。 */
          var cur = (gpos[idx] || 0) + V[st.g] * dt;
          if (cur >= max) { cur = max; done[idx] = true; }
          gpos[idx] = cur; r.scrollLeft = cur;
        }
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function startAuto() {
    if (stopped || st.a === 'off' || st.cur === '1') { if (hint) hint.hidden = true; return; }
    if (hint) hint.hidden = false;
    (function next() {
      timer = setTimeout(function () {
        if (stopped) return;
        var prev = idx;
        if (st.p === 'reset') { var r = railOf(prev); if (r) r.scrollLeft = 0; gpos[prev] = 0; }
        show(idx + 1);
        /* 滑完的那一條在這裡歸零 —— show() 之後它已經是 display:none，看不到跳動。 */
        if (done[prev]) { var r2 = railOf(prev); if (r2) r2.scrollLeft = 0; gpos[prev] = 0; done[prev] = false; }
        measure('auto');
        next();
      }, dwell());
    })();
    glide();
  }

  /* 捲出畫面就暫停 —— 看不到還在動只是白費電，而且量到的數字會一直跳。 */
  if (window.IntersectionObserver && strip) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (stopped) return;
        if (!e.isIntersecting) { if (raf) { cancelAnimationFrame(raf); raf = null; } if (timer) { clearTimeout(timer); timer = null; } }
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
    D.style.setProperty('--pv-tabt', XT[st.x]);
    sizeCards();
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
      if (timer) { clearTimeout(timer); timer = null; }
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

  /* 一屏看到幾張：手機、平板、電腦各有自己的三段（同一個數字在三種寬度上
     意思差太多）。卡寬照「這一條橫幅實際量到的寬」現算成 px，
     n 張卡 ＋ (n−1) 個間距要剛好填滿，所以 cardW = (railW − (n−1)×gap) ÷ n。 */
  var WN = {
    phone:  { w1: 1.15, w2: 1.35, w3: 1.6 },
    tablet: { w1: 1.8,  w2: 2.2,  w3: 2.7 },
    desk:   { w1: 2.6,  w2: 3.2,  w3: 4.0 }
  };
  function sizeCards() {
    var r = railOf(idx); if (!r) return;
    var railW = r.clientWidth, gap = 16;
    var band = railW < 560 ? 'phone' : (railW < 980 ? 'tablet' : 'desk');
    var n = WN[band][st.w] || WN[band].w2;
    D.style.setProperty('--pv-cw', Math.round((railW - (n - 1) * gap) / n) + 'px');
  }

  /* ---- 量測面板。要量畫出來的東西，不要量屬性。 ---- */
  function measure(why) {
    var H = innerHeight;
    var docs = document.getElementById('doctors');
    var total = document.documentElement.scrollHeight;
    var dy = docs ? docs.getBoundingClientRect().top + scrollY : 0;
    var r = railOf(idx), left = r ? Math.max(0, r.scrollWidth - r.clientWidth) : 0;
    /* ⚠ 要抓「看得見的」第一張。「全部」那一條最前面幾張是重複卡、被藏起來了，
       抓到它的話寬度是 0，一除就變成「一屏看到 22.63 張」。 */
    var one = 0;
    if (r) {
      var cs = r.querySelectorAll('.card');
      for (var i = 0; i < cs.length; i++) {
        var wd = cs[i].getBoundingClientRect().width;
        if (wd > 1) { one = wd + 16; break; }
      }
    }
    var seen = one ? r.clientWidth / one : 0;
    /* 現況的基準線：在正式站的 index.html 上逐寬度量出來的（2026-09-26）。
       ⚠ 原本寫死一組 19.2／12.8，那是 390 寬的數字 —— 在電腦上印出來就是假話。
       ⚠ index.html 的版面改過就要重量一次。 */
    var BASE = [
      { w: 1888, s: 8.1, d: 4.8 }, { w: 1440, s: 8.8, d: 5.2 }, { w: 1041, s: 8.4, d: 4.9 },
      { w: 744, s: 9.7, d: 5.8 }, { w: 390, s: 19.2, d: 12.8 }, { w: 375, s: 19.7, d: 13.1 }
    ];
    var base = BASE[0];
    for (var bi = 0; bi < BASE.length; bi++) {
      if (Math.abs(BASE[bi].w - innerWidth) < Math.abs(base.w - innerWidth)) base = BASE[bi];
    }
    panel.innerHTML =
      '整頁 <b>' + (total / H).toFixed(1) + ' 屏</b>（現況 ' + base.s + '）・醫師介紹在第 <b>'
      + (dy / H).toFixed(1) + ' 屏</b>（現況 ' + base.d + '，基準 ' + base.w + '）<br>'
      + '這一科 <b>' + (tabs[idx] ? tabs[idx].textContent.replace(/\\d+$/, '') : '') + '</b>'
      + '・一屏看到 <b>' + seen.toFixed(2) + ' 張</b>・還能滑 <b>' + Math.round(left) + 'px</b>'
      + '・自動播放 <b>' + (stopped ? '已停' : (st.a === 'off' ? '關' : '進行中')) + '</b>'
      + ' ' + V[st.g] + 'px/秒・' + (SPEED[st.s] / 1000) + ' 秒換科・換色 ' + XT[st.x]
;
  }

  show(0); paint(); startAuto();
  addEventListener('load', function () { measure('load'); });
  addEventListener('resize', function () { sizeCards(); measure('resize'); });
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
