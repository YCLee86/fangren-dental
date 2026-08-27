/* tools/card-more-preview.mjs —— 文章卡「閱讀更多」那顆的提案頁產生器
   ==========================================================================
   使用者在一般對話裡做了一版文章卡的版面調整，貼了一段 CSS 過來
   （.card .foot / .card .date / .card .more，藥丸狀、色塊底、箭頭 hover 位移）。
   這一支把 index.html 抓成快照，把那顆做進日期那一列，配一條切換條讓他挑。

   跑法：node tools/card-more-preview.mjs
   產出：preview/card-more-button/index.html

   ⚠ 這一支**有進版控**（不是一次性）：main 中途被另一台推過東西的話，
     快照要跟著重抓（CLAUDE.md 第八節 tag-fade 那一輪的教訓）。

   ---- 快照要一起做的事（CLAUDE.md 第八節那四件）---------------------------
   1. 相對路徑往上兩層（含 srcset 與 CSS 的 url()）。不用 <base href="/">。
   2. counter.js 與 data-views-self 拿掉 —— 不拿掉的話每開一次提案頁，
      首頁的計數就多一次。窄帶的數字改用 data-count 給示範值。
      ⚠ 但文章卡的瀏覽數這一輪**不能留空**：這一頁要判斷的正是日期那一列
        擠不擠，印一條「—」會讓量出來的餘量整個失真。所以填示範值，
        面板上標明是示範值。
   3. 切換條插在**最後一個** </body> 前面（用 lastIndexOf）——
      這一站的 CSS 註解裡就寫著那幾個字。
   4. preview/ 進得了 _site（tools/dist.mjs 的 OPTIONAL 已經有它）。

   ---- 這一輪額外守的三條 ---------------------------------------------------
   ・提案頁的 class 一律 pv- 前綴。⚠ 這一輪特別要緊：使用者那段 CSS 用的
     .foot 站上**已經有了**（index.html:2622 的頁尾，帶 var(--card) 底色、
     1px 上框線、padding-block 2.4rem/1.6rem）。照原字面貼進卡片裡，
     日期上面會多一條線、卡片高度多 64px。
   ・樣式放 <head>，不能塞在頁尾 —— 快照裡的元素在樣式表之前就被解析出來，
     關著的東西會在開頁那 180ms 閃出來。
   ・網址參數的正規式寫 [a-z0-9]+，寫 [a-z]+ 會吃不到 r999 這種值。
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "index.html");
const OUT  = path.join(ROOT, "preview", "card-more-button", "index.html");

let h = fs.readFileSync(SRC, "utf8");

/* ---------- 1. 相對路徑往上兩層 ---------- */
h = h.replace(/(\s(?:href|src)=")(assets\/|posts\/|site\.webmanifest)/g, "$1../../$2");
h = h.replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)assets\//g, "$1../../assets/")}"`);
h = h.replace(/url\((["']?)assets\//g, "url($1../../assets/");

/* ---------- 2. 計數器：拿掉掛勾、填示範值 ---------- */
const before = h;
h = h.replace(/\n\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, "");
if (h === before) throw new Error("找不到 counter.js 那一行 —— index.html 改過了");
h = h.replace(/ data-views-self="home"/, ' data-count="1284"');
/* ⚠ 比對前先把註解剝掉 —— index.html 的註解裡就寫著 data-views-self 那幾個字
   （第 5870 行在解釋那個掛勾），連註解一起掃會誤判。 */
const noComment = (x) => x.replace(/<!--[\s\S]*?-->/g, "");
if (/data-views-self/.test(noComment(h))) throw new Error("還有 data-views-self 沒拿掉");

/* 文章卡的瀏覽數改示範值。⚠ 這是提案頁專用，絕對不要跟著版型搬回正式站
   （CLAUDE.md 第八節：2026-08-07 那個 8642 把真實的 190 蓋掉過）。 */
const DEMO = [1284, 973, 412, 2065, 158, 87, 640, 331, 1120, 46, 205];
let di = 0;
h = h.replace(/<span class="views" data-views="([^"]*)" data-state="loading"><span class="views-n">—<\/span>/g,
  (m, slug) => `<span class="views" data-views="${slug}" data-state="ok"><span class="views-n">${DEMO[di++ % DEMO.length]}</span>`);

/* ---------- 3. 把那顆放進每一張文章卡的日期那一列 ---------- */
/* ⚠ markup 只加一個 <span>，不動卡片的結構 —— 理由見 <head> 的推導：
   整張卡本身就是 <a>，裡面再放一個 <a> 是巢狀連結，HTML 不合法。 */
const MORE = '<span class="pv-more" aria-hidden="true"><span class="pv-more-t"></span>'
  + '<svg class="pv-arrow" width="9" height="18" viewBox="0 0 9 18" fill="none" stroke="currentColor"'
  + ' stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l7 8-7 8"/></svg></span>';

let injected = 0;
h = h.replace(/(<span class="views" data-views="[^"]*"[\s\S]*?<\/span>\n)(\s*)(<\/p>)/g,
  (m, views, ind, close) => { injected++; return views + ind + "  " + MORE + "\n" + ind + close; });
if (injected < 6) throw new Error(`只放進 ${injected} 張卡 —— 產生器和 index.html 對不上了`);

/* ---------- 4. <head>：noindex ＋ 推導 ＋ 樣式 ---------- */
h = h.replace(/<title>[^<]*<\/title>/,
  "<title>文章卡的「閱讀更多」——提案 — 芳仁牙醫診所</title>");
h = h.replace(/<link rel="canonical"[^>]*>\n?/, "");
h = h.replace("<head>", "<head>\n" + `
<meta name="robots" content="noindex, nofollow, noarchive">
<!-- ==========================================================================
     文章卡的「閱讀更多」那顆　—— 提案頁（2026-08-27 開）
     ==========================================================================

     起點：使用者在一般對話裡做了一版文章卡的版面調整，貼過來的是這一段 ——

       .card .foot{ display:flex; align-items:center; justify-content:space-between;
                    gap:12px; margin-top:14px; }
       .card .date{ white-space:nowrap; }
       .card .more{ display:inline-flex; align-items:center; gap:7px;
                    white-space:nowrap; flex:none; text-decoration:none;
                    color:var(--c); font-weight:700; font-size:.95rem;
                    background:color-mix(in srgb, var(--c) 9%, #fff);
                    padding:8px 17px; border-radius:999px; }
       .card .more:hover{ background:color-mix(in srgb, var(--c) 15%, #fff); }
       .card .more .arrow{ transition:transform .18s ease; }
       .card .more:hover .arrow{ transform:translateX(4px); }
       (prefers-reduced-motion) .card .more .arrow{ transition:none; }

     ---- 想法是成立的，但那段字面貼上去這一站有六處接不上 ----------------

     ① .foot 這個名字站上已經被用掉了。index.html:2622：
          .foot { background: var(--card); border-top: 1px solid var(--rule);
                  padding-block: 2.4rem 1.6rem; }
        那是頁尾。<div class="foot"> 放進卡片裡會同時吃到這一條 ——
        日期上面多一條框線、上下多出 2.4rem/1.6rem 的內距。
        （同 /history/hero-motion-mobile.html 那一輪：提案頁的 class 用了 .foot
          撞到頁尾，整條切換條被染成白色一大塊。）

     ② .date 這個 class 站上不存在，日期那一列叫 .card-date，
        而且它**本來就是 flex**（align-items:center、flex-wrap:wrap、gap:.3rem），
        還靠 margin-top:auto 推到卡底、把三欄的日期對齊成一直線。
        再包一層 .foot 會把那個推底機制蓋掉。
        → 這一版不新增容器：那顆直接放進 .card-date，靠 margin-left:auto 收右，
          等於原案的 justify-content:space-between，而 markup 只多一個 span。

     ③ var(--c) 站上不存在。科別色的兩階是 --accent（填實的塊）與
        --accent-deep（白底上的字），由每張卡自己的 data-spec 給
        （index.html:2262 起）。

     ④ #fff 不是這一頁的底色。卡片是 --card #f4f4f5、頁面是 --paper #e2e5e6。
        color-mix(… 9%, #fff) 在卡片上會是一塊「比卡片還白」的東西。
        → 改成 color-mix(in srgb, var(--accent) 9%, var(--card))。
        （PALETTE.md 是配色的唯一依據，這裡沒有新增任何色值。）

     ⑤ border-radius: 999px 撞到已定案的形狀語彙。2026-08-15 使用者原話：
        「圓圈跟網站主題不搭，主題是方框導圓」。站上小標籤是一族 6~12px
        （.doc dt 6 / --frame-r 8 / .card-tag 8.5 / .info-card h3 9 / 卡 12）。
        → 做成一條尺（8.5 / 12 / 999），讓他自己決定要不要為這顆開例外。

     ⑥ :hover 手機會黏住，而且定案表已經寫著「手機版的卡片只有靜止陰影，
        沒有 hover」。→ hover 那一組整段關在 @media (hover: hover) 裡。

     ---- 一件不是樣式、是 HTML 的事：這顆**不能是連結** ------------------

     文章卡本身就是 <a class="card" href="posts/…">（整張卡可點）。
     在它裡面再放一個 <a class="more"> 是巢狀連結，HTML 不合法，
     瀏覽器會在解析時把內層拆到外面 —— DOM 被重寫成兩塊，版面直接壞掉。

     而且就算改成「卡是 div、標題是連結」那種結構，這顆指的仍然是同一個網址，
     等於同一張卡有兩個指向同一頁的連結，錨點文字還從標題退成「閱讀更多」——
     對搜尋是往下走的（CLAUDE.md 第一節第 1 條的精神：爬蟲讀得到的東西要對）。

     → 這一版做成 <span aria-hidden="true">：**純視覺提示**，整張卡照舊是那個連結。
       螢幕閱讀器不會多念一句「閱讀更多」（那句話本來就沒有資訊），
       觸控目標也不必另外撐到 44px —— 可按的一直是整張卡。

     ---- 這一頁要決定的（切換條上七條尺）--------------------------------

       樣式　　無（現況）／ 只有字＋角形 ／ 淡色塊（原案）／ 填滿套色
       圓角　　8.5px（同標籤）／ 12px（同卡）／ 999px（原案）
       字級　　.78rem（同日期那一列）／ .85rem（同摘要）／ .95rem（原案）
       胖瘦　　1.85 ／ 2.15 ／ 2.36 ／ 2.88（原案）　＝ 塊高是字級的幾倍
       角形　　0.6（原案）／ 1.0 ／ 1.4 ／ 1.8　＝ 畫到畫面上的實際粗細（px）
       ── 細調 ──
       箭頭　　角形（站上語彙）／ →／ 無
       文字　　閱讀更多 ／ 繼續讀 ／ 看這篇
       手機　　也放 ／ 不放

     ⚠ 字級那條先講清楚：.95rem 在電腦版（根字級 18px）算出 17.1px，
       而同一張卡的摘要是 15.3、日期 14.04、標題 18.36。
       一顆輔助的提示比摘要大、逼近標題，順序會反過來。面板有現場量的值。

     ⚠ 瀏覽數是**示範值**（正式站是 D1 的真值）。這一頁要量的正是
       日期那一列擠不擠，印一條「—」的話餘量會量得太寬鬆。

     ---- 第二輪（2026-08-27，使用者：「那個閱讀更多的標籤好胖」）----------

     量出來成立，而且兩軸都超出站上那一族 —— 390 上、他當時選的 .78rem：

       　　　　　　　　　塊高÷字級　左右內距÷字級
       提案這顆　　　　　　2.88　　　　1.36
       主題與科別 chip　　 2.36　　　　0.89   ← 站上最鬆的那一顆
       門診表標記　　　　　2.41　　　　0.80
       文章卡標籤　　　　　1.90　　　　0.63
       專科藥丸　　　　　　1.84　　　　0.75
       醫師卡灰標籤　　　　1.80　　　　0.41

     ⚠⚠ 成因是原案的 padding 寫死 px（8px 17px）——**字愈小它愈胖**：
       .95rem 上塊高÷字級是 2.65，收到 .78rem 反而變成 2.88。
       他先挑了比較小的字，於是把這個問題放大了，兩件事看起來像一件。
       改法：內距一律 em（--pv-pv／--pv-ph），塊高÷字級 ＝ 1.6 + 2 × --pv-pv。

     ⚠ 四格的值不是憑感覺配的，左右那一欄直接取站上同一族的實測比值。
       面板現在直接印「在不在站上那一族裡（1.80~2.41）」，不要只印塊高幾 px ——
       塊高 36px 這個數字本身說不出胖不胖。

     ---- 第三輪（2026-08-27，使用者：「閱讀更多後面的角形 可以粗一點嗎」）----

     ⚠⚠ 角形原本畫到畫面上只有 **0.56px** —— 站上「往下滑」與「回到最上面」
       那兩顆角形是 1.4px，這裡只有四成。而 SVG 裡寫的數字是 1.4，逐字一樣。

     成因：**stroke-width 是 viewBox 的使用者單位，會跟著圖一起縮。**
     那兩顆站上的角形是固定 18×9、不縮放，所以寫 1.4 就是 1.4px；
     這一顆是 inline 的、高度 .58em 跟著字級走，viewBox 高 18 個單位卻只畫
     7.23px（.78rem 上），縮放比 0.402 —— 1.4 × 0.402 = 0.56px。

       字級      角形高    縮放比    SVG 寫 3.5 → 畫面上
       .78rem    7.23px    0.402     1.41px
       .95rem    8.81px    0.490     1.71px

     ⚠ 沒有用 vector-effect: non-scaling-stroke —— 那會讓粗細不跟著字級走，
       字級一調，角形和旁邊那幾個字的關係就跑掉了。要的是等比例。
     ⚠⚠ **切換條上那四格印的是畫面上的實際粗細，不是 SVG 裡寫的數字**
       （在手機上差 2.5 倍，印錯的那個會騙人）。字級一改縮放比就變，
       所以面板現場量一次再印，不照表念。

     定案之後：把選中的那一組寫進 index.html 的樣式表 ＋ tools/build.mjs
     的卡片模板（多一個 span），這一頁刪掉、推導搬進 history/。
     ========================================================================== -->
`);

/* ---------- 5. 樣式（一定要進 <head>）---------- */
/* ⚠ 2026-08-26 head-search 那一輪踩過：樣式塞在 </body> 前面的話，
   快照裡的元素在樣式表之前就被解析出來，關著的東西會在開頁那 180ms 閃出來。 */
const STYLE = `
<style>
/* ====== 提案的那顆（pv- 前綴，定案時只有這一段會搬回 index.html）====== */
.pv-more{
  display: none;                       /* 樣式＝無（現況）時就是這一格 */
  align-items: center; gap: .5em;
  margin-left: auto;                   /* ＝ 原案的 justify-content: space-between */
  white-space: nowrap; flex: none;
  font-weight: 700;
  font-size: var(--pv-fs, .95rem);
  line-height: 1.6;
  /* ⚠⚠ 內距一定要跟著字級走（em），不可以寫死 px —— 原案是 padding: 8px 17px，
     字級從 .95 收到 .78 的時候內距沒跟著收，塊高÷字級反而從 2.65 胖到 2.88。
     同 CLAUDE.md 第九節那條「標記內距是 calc((34px − 1.6em − 2px)/2)，不要寫死 px」。
     行高是 1.6em，所以 塊高÷字級 = 1.6 + 2 × --pv-pv。 */
  padding: var(--pv-pv, .64em) var(--pv-ph, 1.36em);
  border-radius: var(--pv-r, 999px);
  color: var(--accent-deep);
  background: color-mix(in srgb, var(--accent) 9%, var(--card));
}
[data-shape="text"] .pv-more,
[data-shape="tint"] .pv-more,
[data-shape="fill"] .pv-more{ display: inline-flex; }
[data-shape="text"] .pv-more{ background: none; padding-inline: 0; }
[data-shape="fill"] .pv-more{ background: var(--accent); color: var(--on-fill, #fff); }

.pv-more-t::before{ content: "閱讀更多"; }
[data-txt="t2"] .pv-more-t::before{ content: "繼續讀"; }
[data-txt="t3"] .pv-more-t::before{ content: "看這篇"; }

/* ⚠⚠ SVG 的 stroke-width 是 **viewBox 的使用者單位**，會跟著圖一起縮。
   這張的 viewBox 高 18 個單位、實際只畫 .58em，所以在 .78rem（12.48px）上
   縮放比只有 7.24 ÷ 18 = 0.402 —— 照站上那兩顆角形寫 1.4，
   畫到畫面上只剩 **0.56px**，四成不到。要多粗就要先除以那個縮放比。
   ⚠ 不用 vector-effect: non-scaling-stroke —— 那會讓粗細不跟著字級走，
     字級一調，角形和旁邊那幾個字的關係就跑掉了。 */
.pv-arrow{ width: auto; height: .58em; flex: none; stroke-width: var(--pv-aw, 1.4); }
[data-arrow="arw"] .pv-arrow,
[data-arrow="no"]  .pv-arrow{ display: none; }
[data-arrow="arw"] .pv-more::after{ content: "\\2192"; }

/* hover 整組關在 (hover: hover) 裡 —— 手機沒有游標，:hover 會黏住
   （定案表：手機版的卡片只有靜止陰影，沒有 hover）。
   ⚠ 觸發的是 .card:hover 不是 .pv-more:hover：這顆不是可以單獨點的東西，
     可按的一直是整張卡，游標在卡上的任何地方都該讓它亮。 */
@media (hover: hover){
  .pv-arrow{ transition: transform .18s ease; }
  .card:hover .pv-more{ background: color-mix(in srgb, var(--accent) 15%, var(--card)); }
  [data-shape="text"] .card:hover .pv-more{ background: none; }
  [data-shape="fill"] .card:hover .pv-more{ background: var(--accent-deep); }
  .card:hover .pv-arrow{ transform: translateX(4px); }
  [data-arrow="arw"] .card:hover .pv-more::after{ display: inline-block; transform: translateX(4px); }
}
@media (prefers-reduced-motion: reduce){
  .pv-arrow{ transition: none; }
  .card:hover .pv-arrow{ transform: none; }
}
@media (max-width: 720px){
  [data-mob="off"] .pv-more{ display: none; }
}

/* ====== 切換條 ====== */
.pv-bar{
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: rgba(24,22,20,.94);
  backdrop-filter: blur(8px) saturate(1.1);
  color: #f2f2ef; font-size: 12px; line-height: 1.3;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255,255,255,.14);
}
.pv-bar[hidden]{ display: none; }
.pv-hd{ display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.pv-hd b{ font-size: 12px; font-weight: 700; letter-spacing: .04em; }
.pv-hd .pv-sp{ margin-left: auto; }
.pv-row{ display: flex; align-items: center; gap: 6px; margin-top: 5px; }
.pv-row > i{ font-style: normal; opacity: .62; flex: none; width: 2.6em; font-size: 11px; }
.pv-row .pv-btns{ display: flex; gap: 5px; flex-wrap: wrap; }
.pv-bar button{
  font: inherit; color: inherit; cursor: pointer;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.20);
  border-radius: 8px; padding: 5px 9px; min-height: 30px;
}
.pv-bar button[aria-pressed="true"]{ background: #f2f2ef; color: #181614; border-color: #f2f2ef; font-weight: 700; }
.pv-bar .pv-mini{ padding: 4px 8px; min-height: 26px; font-size: 11px; opacity: .9; }
.pv-fold[hidden]{ display: none; }
.pv-panel{
  margin-top: 7px; padding-top: 7px; border-top: 1px solid rgba(255,255,255,.14);
  font-size: 11px; line-height: 1.55; max-height: 26vh; overflow: auto;
}
/* ⚠ 切換條在手機上不能吃掉半個畫面（CLAUDE.md 第八節，hero-motion-mobile 那一輪
   第一版量到 28%）—— 這一頁要判斷的正是文章卡本身，條子高一分，能比的就少一分。
   做法有三件：按鈕收小、面板再矮一階，以及「細調」與「量測」互斥（見腳本）。 */
@media (max-width: 480px){
  .pv-bar{ font-size: 11px; padding: 6px 8px calc(6px + env(safe-area-inset-bottom)); }
  .pv-row{ gap: 5px; margin-top: 4px; }
  .pv-bar button{ padding: 4px 7px; min-height: 27px; border-radius: 7px; }
  .pv-row .pv-btns{ gap: 4px; }
  .pv-panel{ max-height: 19vh; font-size: 10.5px; line-height: 1.5; }
}
.pv-panel[hidden]{ display: none; }
.pv-panel b{ color: #fff; }
.pv-ok{ color: #8fd9a0; }
.pv-no{ color: #ff9b9b; }
.pv-open{
  position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 90;
  background: rgba(24,22,20,.94); color: #f2f2ef; border: 1px solid rgba(255,255,255,.2);
  border-radius: 10px; padding: 8px 11px; font: 700 12px/1 inherit; cursor: pointer;
}
.pv-open[hidden]{ display: none; }
</style>
`;
h = h.replace("</head>", STYLE + "</head>");

/* ---------- 6. 切換條 ＋ 量測面板 ---------- */
/* ⚠⚠ 一定要用 lastIndexOf('</body>')：這一站的 CSS 註解裡就寫著那幾個字
   （.nav-lamp 那一段），String.replace 會換到註解裡那一個，
   切換條會落在 <head> 的樣式表中間、整段不執行。 */
const BAR = `
<button class="pv-open" id="pvOpen" hidden>切換條</button>
<div class="pv-bar" id="pvBar">
  <div class="pv-hd">
    <b>文章卡的「閱讀更多」</b>
    <span class="pv-sp"></span>
    <button class="pv-mini" id="pvFoldBtn" aria-expanded="false">細調</button>
    <button class="pv-mini" id="pvPanelBtn" aria-expanded="false">量測</button>
    <button class="pv-mini" id="pvHide">收起</button>
  </div>

  <div class="pv-row"><i>樣式</i><span class="pv-btns" data-k="shape">
    <button data-v="none">無</button>
    <button data-v="text">只有字</button>
    <button data-v="tint">淡塊</button>
    <button data-v="fill">填滿</button></span></div>

  <div class="pv-row"><i>圓角</i><span class="pv-btns" data-k="r">
    <button data-v="r85">8.5px</button>
    <button data-v="r12">12px</button>
    <button data-v="r999">999px</button></span></div>

  <div class="pv-row"><i>字級</i><span style="opacity:.5;font-size:10px">日/摘/原</span><span class="pv-btns" data-k="fs">
    <button data-v="f78">.78</button>
    <button data-v="f85">.85</button>
    <button data-v="f95">.95</button></span></div>

  <div class="pv-row"><i>胖瘦</i><span style="opacity:.5;font-size:10px">塊高÷字</span><span class="pv-btns" data-k="pad">
    <button data-v="p0">1.85</button>
    <button data-v="p1">2.15</button>
    <button data-v="p2">2.36</button>
    <button data-v="p3">2.88</button></span></div>

  <div class="pv-row"><i>角形</i><span style="opacity:.5;font-size:10px">粗細</span><span class="pv-btns" data-k="aw">
    <button data-v="w06">0.6</button>
    <button data-v="w10">1.0</button>
    <button data-v="w14">1.4</button>
    <button data-v="w18">1.8</button></span></div>

  <div class="pv-fold" id="pvFold" hidden>
    <div class="pv-row"><i>箭頭</i><span class="pv-btns" data-k="arrow">
      <button data-v="chev">角形</button>
      <button data-v="arw">&#8594;</button>
      <button data-v="no">無</button></span></div>
    <div class="pv-row"><i>文字</i><span class="pv-btns" data-k="txt">
      <button data-v="t1">閱讀更多</button>
      <button data-v="t2">繼續讀</button>
      <button data-v="t3">看這篇</button></span></div>
    <div class="pv-row"><i>手機</i><span class="pv-btns" data-k="mob">
      <button data-v="on">也放</button>
      <button data-v="off">不放</button></span></div>
  </div>

  <div class="pv-panel" id="pvPanel" hidden></div>
</div>
<script>
(function () {
  var B = document.body, D = document.documentElement;
  /* ⚠ 正規式寫 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 r999、f95 這種帶數字的值，
     比對失敗後悄悄退回預設，等於網址參數沒作用（CLAUDE.md 第九節）。 */
  var KEYS = {
    shape: ['none','text','tint','fill'],
    r:     ['r85','r12','r999'],
    fs:    ['f78','f85','f95'],
    arrow: ['chev','arw','no'],
    txt:   ['t1','t2','t3'],
    mob:   ['on','off'],
    pad:   ['p0','p1','p2','p3'],
    aw:    ['w06','w10','w14','w18']
  };
  var DEF = { shape:'tint', r:'r999', fs:'f95', arrow:'chev', txt:'t1', mob:'on', pad:'p3', aw:'w06' };
  var RVAL = { r85:'8.5px', r12:'12px', r999:'999px' };
  var FVAL = { f78:'.78rem', f85:'.85rem', f95:'.95rem' };
  /* 四格的上下內距是從「塊高÷字級」回推的（行高 1.6em）：pv = (目標 − 1.6) / 2。
     左右那一欄直接取站上同一族的實測比值，不是憑感覺配的：
       1.85 ／ .63em  ＝ 文章卡標籤（1.90）與專科藥丸（1.84）那一族
       2.15 ／ .75em  ＝ 兩族中間
       2.36 ／ .89em  ＝ 主題與科別的 chip，站上最鬆的那一顆
       2.88 ／ 1.36em ＝ 原案（padding: 8px 17px 在 .78rem 上換算回來的） */
  var PVAL = { p0:['.125em','.63em'], p1:['.275em','.75em'], p2:['.38em','.89em'], p3:['.64em','1.36em'] };
  /* 四格印的是**畫面上的實際粗細**（px），不是 SVG 裡寫的數字 ——
     後者要再乘上縮放比，在手機上差 2.5 倍，印出來會騙人。
     使用者單位 ＝ 目標 px ÷ 縮放比，縮放比在 .78rem 上是 0.402。
     1.4px 那一格 ＝ 站上「往下滑」與「回到最上面」那兩顆角形的粗細。
     ⚠ 字級一改縮放比就變，所以面板要現場量一次，不能照這張表念。 */
  var AVAL = { w06:'1.4', w10:'2.5', w14:'3.5', w18:'4.5' };
  var PLABEL = { p0:'≈ 文章卡標籤那一族', p1:'兩族中間', p2:'≈ 主題與科別的 chip', p3:'原案' };

  var qs = location.search;
  function fromUrl(k) {
    var m = qs.match(new RegExp('[?&]' + k + '=([a-z0-9]+)'));
    return (m && KEYS[k].indexOf(m[1]) >= 0) ? m[1] : DEF[k];
  }
  var state = {};
  Object.keys(KEYS).forEach(function (k) { state[k] = fromUrl(k); });

  function paint() {
    Object.keys(state).forEach(function (k) { B.setAttribute('data-' + k, state[k]); });
    D.style.setProperty('--pv-r', RVAL[state.r]);
    D.style.setProperty('--pv-fs', FVAL[state.fs]);
    D.style.setProperty('--pv-pv', PVAL[state.pad][0]);
    D.style.setProperty('--pv-ph', PVAL[state.pad][1]);
    D.style.setProperty('--pv-aw', AVAL[state.aw]);
    Array.prototype.forEach.call(document.querySelectorAll('.pv-btns'), function (g) {
      var k = g.getAttribute('data-k');
      Array.prototype.forEach.call(g.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === state[k]));
      });
    });
    var q = Object.keys(state).map(function (k) { return k + '=' + state[k]; }).join('&');
    history.replaceState(null, '', location.pathname + '?' + q);
    measure();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.pv-btns button') : null;
    if (!b) return;
    state[b.parentNode.getAttribute('data-k')] = b.getAttribute('data-v');
    paint();
  });

  var bar = document.getElementById('pvBar'), open = document.getElementById('pvOpen');
  document.getElementById('pvHide').onclick = function () { bar.hidden = true; open.hidden = false; };
  open.onclick = function () { bar.hidden = false; open.hidden = true; measure(); };
  /* ⚠ 兩塊互斥：兩塊一起開，390 上量到 456px ＝ 一屏的 54%，
     而這一頁要看的正是文章卡。開一塊就把另一塊收起來。 */
  var FOLDS = [['pvFoldBtn','pvFold'], ['pvPanelBtn','pvPanel']];
  FOLDS.forEach(function (pair, i) {
    var btn = document.getElementById(pair[0]), box = document.getElementById(pair[1]);
    btn.onclick = function () {
      var willOpen = box.hidden;
      FOLDS.forEach(function (o, j) {
        var b = document.getElementById(o[1]), t = document.getElementById(o[0]);
        var open = (j === i) ? willOpen : false;
        b.hidden = !open;
        t.setAttribute('aria-expanded', String(open));
      });
      if (willOpen) measure();
    };
  });

  /* ---------- 量測面板 ----------
     ⚠ 面板要直接下判斷，不要只印數字（CLAUDE.md 第八節 tag-fade 那一輪）。 */
  /* ⚠⚠ color-mix() 的 computed value 是 color(srgb 0.89 0.90 0.92)，通道是 **0~1**，
     不是 rgb() 的 0~255。照 rgb 的寫法除以 255 會把一塊很淡的底算成近黑 ——
     這一輪第一版量出「淡色塊對比 1.54」就是這樣來的（實際是 12 以上）。 */
  function lum(c) {
    var m = c.match(/[\\d.]+/g); if (!m) return 1;
    var unit = /^color\\(/.test(c) ? 1 : 255;
    var f = [0,1,2].map(function (i) {
      var v = m[i] / unit;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  }
  function ratio(a, b) {
    var x = lum(a), y = lum(b);
    return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05));
  }
  function px(v) { return Math.round(v * 100) / 100; }

  function measure() {
    var box = document.getElementById('pvPanel');
    if (!box || box.hidden) return;
    var cards = [].slice.call(document.querySelectorAll('.cards .card:not(.is-filtered-out)'));
    if (!cards.length) { box.textContent = '找不到文章卡'; return; }
    var card = cards[0];
    var more = card.querySelector('.pv-more');
    var dateRow = card.querySelector('.card-date');
    var sum = card.querySelector('.card-body > p:not(.card-date)');
    var h3 = card.querySelector('h3');
    var out = [];

    var mcs = getComputedStyle(more);
    var shown = mcs.display !== 'none';
    var vw = Math.round(window.innerWidth) + '×' + Math.round(window.innerHeight);
    out.push('<b>' + vw + '　卡片寬 ' + px(card.getBoundingClientRect().width) + '</b>');

    if (!shown) {
      out.push('這一格沒有那顆（樣式＝無' +
        (state.mob === 'off' && window.innerWidth <= 720 ? '，或手機＝不放' : '') + '）。');
    } else {
      /* ⚠⚠ 兩件事都要掃**全部十一張卡**，不能只量第一張：
         ・對比度跟著那一科的套色走，七科七個值（最緊的是兒牙，站上最淺的那一支）；
         ・擠不擠跟著標題折幾行、瀏覽數幾位數走，每張卡都不一樣。
         只量第一張會漏掉真正會出事的那一張。 */
      var worstC = null, worstF = null;
      cards.forEach(function (c) {
        var m = c.querySelector('.pv-more'), v = c.querySelector('.views');
        var cs = getComputedStyle(m);
        var bg = cs.backgroundColor;
        if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') bg = getComputedStyle(c).backgroundColor;
        var r = ratio(cs.color, bg);
        var tag = c.querySelector('.card-tag');
        var name = tag ? tag.textContent.trim() : c.getAttribute('data-spec');
        if (!worstC || r < worstC.r) worstC = { r: r, name: name };
        var mr = m.getBoundingClientRect(), vr = v.getBoundingClientRect();
        var rec = { wrapped: mr.top >= vr.bottom, free: mr.left - vr.right, name: name,
                    rowH: c.querySelector('.card-date').getBoundingClientRect().height,
                    digit: vr.width / Math.max(1, (v.textContent || '').replace(/\\D/g, '').length || 1) };
        if (!worstF || rec.wrapped && !worstF.wrapped || (rec.wrapped === worstF.wrapped && rec.free < worstF.free)) worstF = rec;
      });

      /* ① 最緊的那一科：那幾個字對它自己的底 */
      out.push('對比（最緊的 <b>' + worstC.name + '</b>）　<b>' + (Math.round(worstC.r * 100) / 100) + '</b>　' +
        (worstC.r >= 4.5 ? '<span class="pv-ok">✓ 七科都過 4.5</span>'
                         : '<span class="pv-no">⚠ 低於站上的 4.5</span>'));

      /* ② 最緊的那一張：日期那一列擠不擠 */
      if (worstF.wrapped) {
        out.push('日期那一列（<b>' + worstF.name + '</b>）　<span class="pv-no">⚠ 已經折成兩行</span>' +
          '，那一列高 ' + px(worstF.rowH));
      } else {
        out.push('日期那一列（最緊的 <b>' + worstF.name + '</b>）　<span class="pv-ok">✓ 一行收得下</span>' +
          '　還剩 <b>' + px(worstF.free) + 'px</b>（≈ 再 ' + Math.floor(worstF.free / Math.max(1, worstF.digit)) + ' 位數）');
      }

      /* ③ 胖瘦。⚠ 判準是「塊高是字級的幾倍」不是「塊高幾 px」——
         塊高 36px 這個數字本身說不出胖不胖，要和站上同一族的標記比才知道。
         站上實測：文章卡標籤 1.90／專科藥丸 1.84／醫師卡灰標籤 1.80／
         門診表 2.41／主題與科別 chip 2.36（最鬆的那一顆）。 */
      var mh = more.getBoundingClientRect().height, fmm = parseFloat(mcs.fontSize);
      var k = mh / fmm, kh = parseFloat(mcs.paddingLeft) / fmm;
      out.push('胖瘦　塊高÷字級 <b>' + (Math.round(k * 100) / 100) + '</b>　左右÷字級 <b>' +
        (Math.round(kh * 100) / 100) + '</b>　' +
        (k > 2.41 ? '<span class="pv-no">⚠ 比站上最鬆的那顆還鬆</span>'
                  : '<span class="pv-ok">✓ 在站上那一族裡（1.80~2.41）</span>'));
      out.push('塊高 ' + px(mh) + 'px　<span style="opacity:.7">' +
        '（這顆是 span 不是連結，44px 觸控下限不適用 —— 可按的是整張卡）</span>');

      /* ④ 角形畫到畫面上到底多粗。⚠ 一定要現場量 —— SVG 裡寫的數字
         要乘上縮放比才是畫面上的粗細，而縮放比跟著字級走。 */
      var arw = more.querySelector('.pv-arrow');
      if (arw && getComputedStyle(arw).display !== 'none') {
        var ar = arw.getBoundingClientRect();
        var vb = (arw.getAttribute('viewBox') || '0 0 9 18').split(/\\s+/);
        var scale = ar.height / parseFloat(vb[3]);
        var eff = parseFloat(getComputedStyle(arw).strokeWidth) * scale;
        out.push('角形　畫面上 <b>' + (Math.round(eff * 100) / 100) + 'px</b>' +
          '（SVG 裡寫 ' + AVAL[state.aw] + '，縮放比 ' + (Math.round(scale * 1000) / 1000) + '）　' +
          (Math.abs(eff - 1.4) < 0.16 ? '<span class="pv-ok">≈ 站上那兩顆角形（1.4px）</span>'
            : eff < 1.4 ? '比站上那兩顆細' : '比站上那兩顆粗'));
      }

      /* ⑤ 字級的順序有沒有反過來 */
      var fm = parseFloat(mcs.fontSize), fs = parseFloat(getComputedStyle(sum).fontSize),
          fd = parseFloat(getComputedStyle(dateRow).fontSize), fh = parseFloat(getComputedStyle(h3).fontSize);
      out.push('字級　這顆 <b>' + px(fm) + '</b>　摘要 ' + px(fs) + '　日期 ' + px(fd) + '　標題 ' + px(fh) +
        '　' + (fm > fs ? '<span class="pv-no">⚠ 比摘要大</span>' : '<span class="pv-ok">✓ 不搶戲</span>'));
    }

    /* ⑤ 卡片高度／一屏幾張：和「樣式＝無」現場比一次 */
    var keep = B.getAttribute('data-shape');
    var hNow = card.getBoundingClientRect().height;
    B.setAttribute('data-shape', 'none');
    var hBase = card.getBoundingClientRect().height;
    B.setAttribute('data-shape', keep);
    out.push('卡片高　' + px(hNow) + 'px　對現況 ' + (hNow === hBase ? '±0' :
      (hNow > hBase ? '+' : '') + px(hNow - hBase)) + 'px');

    var vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    var seen = 0, whole = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.cards .card:not(.is-filtered-out)'), function (c) {
      var r = c.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) seen++;
      if (r.top >= 0 && r.bottom <= vh) whole++;
    });
    out.push('這一屏　看得到 ' + seen + ' 張卡（完整 ' + whole + ' 張）' +
      (seen === 0 ? '　<span style="opacity:.65">— 捲到文章那一區再看這一列</span>' : ''));

    var over = D.scrollWidth > D.clientWidth + 1;
    out.push('水平捲動　' + (over ? '<span class="pv-no">⚠ 有（' +
      (D.scrollWidth - D.clientWidth) + 'px）</span>' : '<span class="pv-ok">✓ 無</span>'));

    out.push('<span style="opacity:.65">瀏覽數是示範值，正式站是 D1 的真值。</span>');
    box.innerHTML = out.join('<br>');
  }

  paint();
  addEventListener('resize', measure);
  addEventListener('scroll', measure, { passive: true });
})();
</` + `script>
`;

const bi = h.lastIndexOf("</body>");
if (bi === -1) throw new Error("找不到 </body>");
h = h.slice(0, bi) + BAR + h.slice(bi);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, h);

/* ---------- 7. 出門前自己驗一次 ---------- */
const checks = [
  [!/data-views-self/.test(noComment(h)),      "data-views-self 還在（開一次提案頁就會幫首頁 +1）"],
  [!/<script src="[^"]*counter\.js"/.test(h),  "counter.js 還在"],
  [/noindex, nofollow, noarchive/.test(h),     "少了 noindex"],
  [h.indexOf('class="pv-bar"') > h.lastIndexOf("</head>"), "切換條落在 <head> 裡了（要用 lastIndexOf）"],
  [h.indexOf("<style>\n/* ====== 提案的那顆") < h.indexOf("</head>"), "樣式沒有進 <head>"],
  /* ⚠ 只掃卡片那一段：站上的頁尾本來就有 class="foot"（index.html:2622 那條規則），
     整份文件一起掃會誤判成提案頁沒加前綴。 */
  [!/class="(foot|date|more)"/.test(
      h.slice(h.indexOf("<!-- POSTS:START"), h.indexOf("<!-- POSTS:END"))),
   "卡片裡出現了沒有 pv- 前綴的 class"],
];
const bad = checks.filter(([ok]) => !ok).map(([, m]) => m);
if (bad.length) throw new Error("驗收沒過：\n  ・" + bad.join("\n  ・"));

console.log(`✔ preview/card-more-button/index.html（${injected} 張卡都放進去了，${(h.length / 1024).toFixed(0)} KB）`);
console.log("  本機：node tools/serve.mjs → http://localhost:8791/preview/card-more-button/");
