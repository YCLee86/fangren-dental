#!/usr/bin/env node
/* ==========================================================================
   preview/head-search/ 的產生器（一次性）
   --------------------------------------------------------------------------
   把 index.html 做成提案頁的快照，在頁首那三個選單的**右邊**加一顆放大鏡，
   點下去頁首就變成一條搜尋列；三條尺讓使用者自己挑。

   起因（使用者 2026-08-26，附首頁截圖）：
     「我想要在右上那三個選單裡面在右邊再增加一個搜尋的欄位，因為這樣子搜尋
       我還要拉回去剛剛那個主題科別標籤下面有點麻煩。那主題科別標籤下面那個
       搜尋就保留，只是在上面那三個元素讓那三個是往左移一點，然後有一個
       放大鏡的圖案點下去可以按可以變成搜尋頁面。」

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/head-search-preview.mjs
   ⚠ 定案上線之後，這支與 preview/head-search/ 一起刪掉，
     推導文字搬進 history/head-search.html（CLAUDE.md 第八節）。
   ⚠ main 中途被另一台推過東西的話，這一頁要**重跑一次**才對得起「對照現況」
     （2026-08-17 tag-fade 那一輪踩過）。

   CLAUDE.md 第八節列的四個陷阱，這裡都照做了：
     ① 相對路徑往上兩層（assets/ posts/ site.webmanifest，含 srcset 與 CSS 的 url()）
     ② 拿掉 counter.js 與 data-views-self，窄帶數字寫死並手動加 .is-on
     ③ 切換條用 lastIndexOf('</body>') 插入（註解裡就有那幾個字）
     ④ class 一律 pv- 前綴（站上的短名字幾乎一定會撞）
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'head-search', 'index.html');

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ── 推導（定案後整段搬進 history/head-search.html）───────────────────── */
const NOTE = `<!-- ==========================================================================
     提案：頁首那三個選單的右邊加一顆放大鏡（2026-08-26）
     --------------------------------------------------------------------------
     使用者要解的是一件很具體的事：**搜尋框只有一個，而且在頁面中間。**
     人捲到第七張卡片才想到要搜尋，就得先往回捲到「主題與科別」那一列。
     頁首是 fixed 的、一直都在，所以搜尋的入口放在頁首就永遠伸手可及。

     ⚠ 「主題與科別」底下那個搜尋框**留著**（使用者指定）。這一顆不是第二個
        搜尋功能，是**同一個搜尋的第二個入口** —— 兩邊的字互相同步，
        篩選的仍然是同一批文章卡與醫師卡（站上那支 IIFE 一行都沒有改）。

     ---- 先量再做：頁首還有多少空間 ----------------------------------------
     「品牌右緣 → 選單左緣」的餘量，現況與加了放大鏡之後（2026-08-26 實測）：

                現況      加了放大鏡     選單那一排變寬
         320     9.59        9.59          +22.88
         360    29.52       10.80          +24.75
         375    42.72       16.92          +25.80
         390    47.41       20.59          +26.81   ← 使用者的手機大約在這一段
         430    61.19       32.50          +28.69
         744   135.33       83.34          +51.98
         834   220.30      168.31          +51.98
        1440   668.33      616.34          +51.98

     ⚠⚠ **320 那一格看起來沒變，是因為讓步的是品牌那個 <a> 的空盒子，不是字。**
        頁首是 grid-template-columns: minmax(0,1fr) max-content（2026-08-16 定案），
        選單那一欄不讓步、品牌那一欄可縮，而品牌的 <a> 本來就帶著 22.88px 的空盒。
        八個寬度逐項量過：**品牌主名與副標的寬度、行數、頁首高度全部一個字都沒動**
        （320 上主名 91.53、副標 91.53、兩行，加了放大鏡之後逐字相同）。
        所以這一輪**沒有踩到那格全站最緊的餘量**。

     ---- 三條尺 -------------------------------------------------------------
     ① 點下去怎麼展開
        Ⓐ 就地　　整條選單淡出，輸入框從放大鏡往左長到品牌旁邊（品牌留著）
        Ⓑ 整條　　品牌也讓開，輸入框佔滿整條頁首
        Ⓒ 掉一條　頁首不動，底下掉出一條搜尋列（三個選單留著）
        390 上輸入框的實寬：就地 226／整條 362／掉一條 362。
        ⚠ 就地那一種在電腦版收在 26rem 靠右 —— 1440 上不收的話會長成 907px 的大槽。
     ② 放大鏡長什麼樣
        Ⓐ 只有圖示（沒有框）　Ⓑ 圖示＋玻璃框（和三個選單同一種）　Ⓒ 圖示＋「搜尋」
     ③ 打了字之後
        Ⓐ 立刻捲到主題與科別（看得到卡片被篩掉）
        Ⓑ 按 Enter（手機鍵盤上的「搜尋」）才捲
        Ⓒ 不捲，只在框裡報「N 篇・M 位」
        ⚠ 框窄的時候（<250px）那個筆數會自動收起來 —— 390 上就地那一種只有
          226px，「2 篇・2 位」會把輸入框吃掉三分之一。

     另有一顆「對照現況」＝ 整顆放大鏡收起來，等於站上目前跑的那一版。

     ==========================================================================
     第二輪（2026-08-26 稍晚）：使用者定案 Ⓑ 整條 ／ Ⓐ 只有圖示 ／ Ⓐ 立刻捲過去，
     並問：「如果搜尋 地址、電話 是沒有結果的，或是打醫師也不會出現，怎麼辦？」
     --------------------------------------------------------------------------
     ⚠ **先量再說。** 十四個查詢實測（首頁現況）：

         地址 0篇0位    電話 0篇0位    看診時間 0篇0位   停車 0篇0位
         週六 0篇0位    永樂街 0篇0位  預約 0篇0位       假日 0篇0位
         醫師 1篇9位    矯正 2篇4位    李柄輝 0篇1位     健保 3篇0位
         費用 1篇0位    洗牙 1篇0位

     量出來是**三件不同的事，各自要治**：

     ① **範圍太窄。** 搜尋只索引文章卡與醫師卡，**診所資訊那一整區不在裡面** ——
        「永樂街」「停車」「看診時間」「假日」這些字站上明明就印著（實測
        #clinic 整段都有），卻一律 0 筆。
     ② **有些詞站上根本沒有印。** 「地址」「電話」在這一站是**圖示不是文字**
        （刻意的，見 PALETTE.md 第六之十七節），「週一／週六」門診表用的是
        「一二三四五」，「預約」全站沒有這兩個字。
        ⚠⚠ **這一類不可能靠擴大索引解決** —— 索引再大，站上沒有的字就是搜不到。
     ③ **「醫師」其實有中，是看不到。** 實測 1 篇文章、9 位醫師，可是打完字捲到
        「主題與科別」之後，390×844 上第一位醫師在 y=949 ——**在畫面下緣外 105px**，
        畫面上只看得到那 1 張文章卡，所以讀起來就是「沒有出現」。
        結果那一句（.filter-note）在 y=265，13px 的柔墨小字，說了「9 位醫師」
        而且「醫師」是連結，但份量太輕，沒有人會讀。

     ---- 三條尺（第二輪）---------------------------------------------------
     ① 診所資訊要不要一起搜
        Ⓐ 不搜（現況）　Ⓑ 一起搜（看診時間、位置與周邊停車那兩張卡）
     ② 都搜不到的時候
        Ⓐ 只有那一句「沒有符合的…」（現況）
        Ⓑ 給三個出口：〔看診時間〕〔位置與停車〕〔撥打 (05)5339-369〕
     ③ 結果那一句
        Ⓐ 一句灰字（現況）　Ⓑ 改成三顆看得見、可以點的　Ⓒ Ⓑ ＋ 自動去結果最多的那一區

     ⚠⚠ **為什麼不做「同義詞對照表」**（地址→永樂街、電話→05、掛號→…）：
        這一站的篩選原則是「讀的就是畫面上那句話裡的詞，不是另外維護的隱藏屬性 ——
        所以『篩得到什麼』和『畫面上寫什麼』不可能對不起來」（index.html 那支
        IIFE 的註解，2026-08-11 定的）。同義詞表正好違反它：表要人維護、猜錯了
        沒有人會發現，而且會長成一份和畫面對不起來的第二真相。
        **改用「② 給出口」** —— 不猜他打了什麼，直接給這個站上最常被找的三件事。

     ⚠ 出口的三顆用的是站上既有的 chip 語彙（卡色底、深階字與框、圓角 12px），
       **一個新顏色都沒有加**。

     ---- 三件已知的事（不是漏做）-------------------------------------------
     ① **沒有 JavaScript 的時候它仍然可以用。** 這一顆是 <a href="#topics">，
        不是 <button> —— 沒有 JS 就退回「跳到主題與科別」（＝現在使用者手動做的事），
        有 JS 才 preventDefault 改成就地展開。方向和站上 HERO 那條動畫一樣：
        **JS 只會讓它變好。**
        ⚠ 因此頁首那支 scrollspy 的選擇器要排除它（\`a:not(.nav-q)[href^="#"]\`），
          不然它會被當成第四節、燈會滑到放大鏡上。
     ② **輸入框的字級一定要 ≥ 16px**，否則 iOS 一聚焦就把整頁放大
        （站上 .topic-search 的手機那一段就是為了這件事寫的）。
     ③ **「對照現況」那一格和站上逐項相同。** 八個寬度（320~1440）× 29 個選擇器
        × 15 個 computed 屬性 ＋ bbox 比對，只有兩項有差：
        .site-head .shell 的 position: static → relative（搜尋列要一個定位
        參考框，不影響版面），以及 .hero-photo img 的 ±0.3px —— 那是那條
        10% 推近動畫的取樣雜訊，站上每一輪驗收都會出現。
     ④ **這一頁只做首頁。** 文章頁（走 assets/style.css）底下沒有可以篩的清單，
        放大鏡要嘛連到 /#topics、要嘛不放，那是定案時要另外決定的一題。
     ========================================================================== -->`;

/* ── ① 相對路徑往上兩層 ──────────────────────────────────────────────────
   ⚠ 不要改用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
/* srcset 是逗號分隔的一整串，上面那條只換得到第一個。 */
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');
/* 樣式表裡的 url("assets/…")（線稿底圖那幾條）。2026-08-23 topics.mjs 踩過：
   路徑錯了會 404 **而且不報錯**，只是圖不見。 */
html = html.replace(/url\((["']?)assets\//g, 'url($1../../assets/');

/* ── noindex（三道的第一道，另外兩道在 Worker 與 robots.txt）───────────── */
html = html.replace(
  /<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE);

/* ── ② 計數器：整支拿掉，窄帶的數字寫死 ─────────────────────────────────
   不拿掉的話**每開一次提案頁，首頁的計數就多一次**。
   ⚠⚠ 底下那個數字是提案頁專用的示範值，**絕對不要跟著版型搬回正式站**。 */
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
html = html.replace(
  '<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on"><!-- ⚠ 提案頁的示範值，不要搬回正式站 -->');
html = html.replace(
  '<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">1080</span>');
html = html.replace(
  /<span class="dot" aria-hidden="true">・<\/span>\s*<span class="views"[^>]*>[\s\S]*?<\/span>\s*<\/p>/g, '</p>');

/* ── ③ scrollspy 的選擇器要排除放大鏡 ───────────────────────────────────
   站上那支抓的是 `.site-nav a[href^="#"]`，而放大鏡是 <a href="#topics">
   （沒有 JS 時的退路）。不排除的話它會被當成第四個小節，燈會滑過去。
   **這一行就是上線時要一起改的那一行。** */
const SPY_SEL = `document.querySelectorAll('.site-nav a[href^="#"]')`;
if (!html.includes(SPY_SEL)) throw new Error('找不到 scrollspy 的選擇器，index.html 換過寫法了');
html = html.replace(SPY_SEL, `document.querySelectorAll('.site-nav a:not(.nav-q)[href^="#"]')`);

/* ── ④ 放大鏡與搜尋列的標記 ─────────────────────────────────────────────
   放大鏡接在三個選單後面（所以那三個自然往左移，＝使用者要的）。
   搜尋列是 .site-head .shell 的**絕對定位**子元素：它不參與 grid，
   所以關著的時候頁首的每一個像素都和現況相同。 */
const ICON_Q = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.6" cy="10.6" r="7"/><path d="m20.4 20.4-4.85-4.85"/></svg>`;
const ICON_X = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.5 5.5 5.5 18.5M5.5 5.5l13 13"/></svg>`;

const NAV_OLD = `      <a href="#clinic">診所資訊</a>
    </nav>`;
if (!html.includes(NAV_OLD)) throw new Error('找不到主選單的結尾，index.html 換過寫法了');
html = html.replace(NAV_OLD, `      <a href="#clinic">診所資訊</a>
      <!-- 放大鏡。素材出處：Lucide "search"，ISC 授權，https://lucide.dev ——
           這一行註解就是署名，改圖或搬檔的時候不要刪。
           ⚠ **是 <a href="#topics"> 不是 <button>**：沒有 JS 的時候它退回
             「跳到主題與科別」（＝使用者現在手動在做的事），有 JS 才改成就地展開。
           ⚠ 它會被頁首那支 scrollspy 抓到，所以那一行選擇器加了 :not(.nav-q)。 -->
      <a class="nav-q" href="#topics" aria-label="搜尋文章與醫師" aria-expanded="false" aria-controls="headsearch">
        <span class="nav-q-i" aria-hidden="true">${ICON_Q}</span><span class="nav-q-t">搜尋</span>
      </a>
    </nav>
    <!-- 頁首的搜尋列。關著的時候 visibility: hidden ＋ inert，**不佔任何版面**
         （絕對定位），所以頁首在關著的狀態下和現況逐像素相同。
         ⚠ 輸入框字級 16px 是硬條件：iOS 對 <16px 的輸入框會在聚焦時放大整頁。 -->
    <form class="head-search" id="headsearch" role="search" inert>
      <span class="hs-ico" aria-hidden="true">${ICON_Q}</span>
      <input class="hs-in" type="search" placeholder="搜尋文章與醫師" aria-label="搜尋文章與醫師"
             autocomplete="off" spellcheck="false" enterkeyhint="search">
      <span class="hs-n" aria-hidden="true"></span>
      <button class="hs-x" type="button" aria-label="關閉搜尋">${ICON_X}</button>
    </form>`);

/* ── ④-2 結果那一句底下多一個容器（第二輪）─────────────────────────────
   ⚠ 它預設 hidden、內容全部由 JS 填 —— 和 .filter-note 是同一種東西
     （搜尋結果本來就沒有靜態內容可言），不違反「首頁文章列表要靜態」那一條。 */
const QX_OLD = '      <p class="filter-note" hidden></p>';
if (!html.includes(QX_OLD)) throw new Error('找不到 .filter-note，index.html 換過寫法了');
html = html.replace(QX_OLD, QX_OLD + '\n      <div class="qx" hidden></div>');

/* ── ⑤ 樣式。排在整份樣式表之後（電腦版那一段是靠順序決勝的），
      所以和切換條一起塞在 </body> 前面。 ──────────────────────────────── */
const FEATURE_CSS = `
<style>
/* ==========================================================================
   頁首的搜尋入口（提案中，2026-08-26）
   --------------------------------------------------------------------------
   ⚠ 這一整段是提案頁的東西。定案上線時要搬進 index.html 的樣式表，
     並把 data-qm / data-qf / data-qs 那幾條「尺」收成定案的那一格。
   ========================================================================== */

/* 搜尋列要蓋在頁首上，所以頁首那個 .shell 需要一個定位參考框。
   ⚠ 只限定 .site-head .shell —— .shell 是全站共用的 class。 */
.site-head .shell { position: relative; }

/* ---- 放大鏡：和三個選單同一列、同一種玻璃框 ---------------------------- */
.site-nav .nav-q {
  display: flex; align-items: center; justify-content: center; gap: .34em;
  /* padding-block 和 .site-nav a 一模一樣（那個值決定點擊範圍，也決定玻璃框
     垂直置中的參考盒）。⚠ 不要改它 —— CLAUDE.md 第九節：動它會連動頁首高度。 */
  color: rgba(255, 255, 255, .88);
  -webkit-tap-highlight-color: transparent;
}
.nav-q-i { display: flex; }
.nav-q svg {
  display: block; width: 1.15em; height: 1.15em;
  fill: none; stroke: currentColor; stroke-width: 1.3;
  stroke-linecap: round; stroke-linejoin: round;
}
/* ⚠ non-scaling-stroke 要下在圖形上（不會繼承）。沒有它，圖示在不同字級的
   斷點上會畫成不同粗細；有了它就固定 1.3px ＝ 旁邊那幾個字的筆畫重量。 */
.nav-q svg :is(circle, path) { vector-effect: non-scaling-stroke; }
.nav-q-t { display: none; }
html[data-qf="text"] .nav-q-t { display: inline; }
html[data-qf="none"] .nav-q::before { display: none; }
/* 展開的時候整條選單讓位給輸入框（就地／整條兩種）。掉一條那一種它留著、且亮起來。
   ⚠ 要淡掉的是 **.site-nav 整條**，不是三個 <a> —— 那三個玻璃框是 ::before、
     跟著 a 走沒問題，但滑過去的那塊底（.nav-lamp）是 nav 的直接子元素，
     只淡 a 的話它會單獨留在輸入框底下（實測就是這樣，玻璃是半透明的，看得見）。 */
html[data-qopen="1"]:is([data-qm="in"], [data-qm="full"]) .site-nav {
  opacity: 0; pointer-events: none;
}
html[data-qopen="1"][data-qm="drop"] .nav-q::before {
  box-shadow: inset 0 0 0 1px rgba(226, 229, 230, .55);
}
html[data-qopen="1"][data-qm="drop"] .nav-q { color: #fff; }
html[data-qopen="1"][data-qm="full"] .brand { opacity: 0; pointer-events: none; }
.brand, .site-nav { transition: opacity .18s ease; }
.site-nav a { transition: color .25s ease; }

/* ---- 搜尋列 ------------------------------------------------------------ */
.head-search {
  position: absolute; z-index: 4;
  display: flex; align-items: center; gap: .45em;
  /* 字級跟著選單走，框高就自動吃同一個 --frame-em ＝ 和那三個玻璃框一樣高。 */
  font-size: .86rem;
  height: calc(var(--frame-em) * 1em);
  padding-inline: .6em;
  border-radius: var(--frame-r);
  background: rgba(226, 229, 230, .16);
  box-shadow: inset 0 0 0 1px rgba(226, 229, 230, .5);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  color: #fff;
  /* 關著：不佔版面、拿不到焦點、也讀不到。 */
  visibility: hidden; opacity: 0; pointer-events: none;
  transition: opacity .18s ease, visibility 0s linear .18s;
}
html[data-qopen="1"] .head-search {
  visibility: visible; opacity: 1; pointer-events: auto;
  transition: opacity .18s ease, visibility 0s;
}
/* 就地／整條：貼在頁首那一列的垂直中線上。--hs-left 由 JS 量品牌的右緣寫進來。 */
html:is([data-qm="in"], [data-qm="full"]) .head-search {
  top: 50%; transform: translateY(-50%);
  right: var(--pad); left: calc(var(--pad) + var(--hs-left, 0px));
}
/* 就地那一種在電腦版上不要長成一條 900px 的大槽 —— 這一站搜尋的字都很短
   （牙周／植牙／矯正），框太長讀起來像是別人家的網站。收在 26rem 靠右，
   左緣仍然落在原本三個選單的左邊，看得出「是那一排變成了搜尋」。
   ⚠ left 與 right 同時給了值又給 max-width ＝ 過度約束，要靠 margin-left: auto
     才會靠右（不寫的話 LTR 會忽略 right、變成靠左）。 */
html[data-qm="in"] .head-search { max-width: 26rem; margin-left: auto; }
html[data-qm="full"] .head-search { --hs-left: 0px; }
/* 掉一條：頁首不動，這一條掛在頁首下緣外面，自己帶一塊底。 */
html[data-qm="drop"] .head-search {
  top: calc(100% + 6px); left: var(--pad); right: var(--pad);
  background: rgba(33, 31, 30, .92);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  box-shadow: inset 0 0 0 1px rgba(226, 229, 230, .42), 0 10px 26px rgba(0, 0, 0, .35);
  height: calc(var(--frame-em) * 1.08em);
}
.hs-ico { display: flex; flex: 0 0 auto; opacity: .82; }
.hs-ico svg {
  display: block; width: 1.05em; height: 1.05em;
  fill: none; stroke: currentColor; stroke-width: 1.3;
  stroke-linecap: round; stroke-linejoin: round;
}
.hs-ico svg :is(circle, path) { vector-effect: non-scaling-stroke; }
.hs-in {
  flex: 1 1 auto; min-width: 0;
  /* ⚠ 16px 是硬條件，不是造型：iOS 對 <16px 的輸入框一聚焦就放大整頁。 */
  font: inherit; font-size: 16px; line-height: 1.2;
  background: none; border: 0; color: #fff; padding: 0;
}
.hs-in::placeholder { color: rgba(255, 255, 255, .58); }
.hs-in:focus { outline: none; }
/* Safari 自己那顆叉叉會和我們的叉叉重疊。 */
.hs-in::-webkit-search-cancel-button { -webkit-appearance: none; appearance: none; }
.hs-n {
  flex: 0 0 auto; font-size: .78em; letter-spacing: .02em;
  color: rgba(255, 255, 255, .72); font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.hs-n:empty { display: none; }
/* ⚠ 窄的時候不印筆數 —— 390 上就地那一種只有 206px，「2 篇・2 位」會把輸入框
   吃掉三分之一。這一條由 JS 現量寫上（門檻 250px），不是憑斷點猜。 */
.head-search.is-narrow .hs-n { display: none; }
.hs-x {
  flex: 0 0 auto; display: flex; align-items: center; justify-content: center;
  width: 1.75em; height: 1.75em; margin-right: -.3em;
  background: none; border: 0; padding: 0; cursor: pointer;
  color: rgba(255, 255, 255, .78); border-radius: 999px;
  -webkit-tap-highlight-color: transparent;
}
.hs-x:hover { color: #fff; background: rgba(255, 255, 255, .12); }
.hs-x svg {
  display: block; width: .95em; height: .95em;
  fill: none; stroke: currentColor; stroke-width: 1.5;
  stroke-linecap: round; stroke-linejoin: round;
}
.hs-x svg path { vector-effect: non-scaling-stroke; }

/* 手機／窄螢幕：選單字級是 clamp，搜尋列跟著同一條，框高才對得上。 */
@media (max-width: 720px) {
  .head-search { font-size: clamp(11px, 3.2vw, 13px); }
}

@media (prefers-reduced-motion: reduce) {
  .head-search, .brand, .site-nav, .site-nav a { transition: none; }
}

/* ==========================================================================
   結果那一句與「搜不到」的出口（第二輪）
   --------------------------------------------------------------------------
   ⚠ 顏色一個都沒有新增：三顆出口與三顆結果標記用的是站上 chip 的那一組
     （卡色底、深階字與框、圓角 12px、字級 .82rem、內距 .25/.8rem）。
   ========================================================================== */
.qx { margin: .7rem 0 0; }
.qx-lead { margin: 0 0 .5rem; font-size: .82rem; line-height: 1.7; color: var(--ink-soft); }
.qx-lead b { color: var(--ink); font-weight: 500; }
.qx-row { display: flex; flex-wrap: wrap; gap: .55rem; }
.qx-row :is(a, span) {
  font: inherit; font-size: .82rem; line-height: 1.6;
  padding: .25rem .8rem; border-radius: 12px;
  background: var(--card); color: var(--accent-deep); border: 1px solid var(--accent-deep);
  text-decoration: none; display: inline-block;
  transition: background-color .15s ease, color .15s ease;
}
.qx-row a:hover { background: color-mix(in srgb, var(--accent) 8%, var(--card)); }
.qx-row a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
/* 0 筆的那一顆：退成柔墨的線框，看得出「這裡沒有」但不搶戲。 */
.qx-row span { color: var(--ink-soft); border-color: var(--rule); }
.qx-row b { font-weight: 600; }
/* 手機上和兩排標記同一個塊高（34px），不要自己長成另一種尺寸。 */
@media (max-width: 720px) {
  .qx-row :is(a, span) { font-size: .90rem; padding-block: calc((34px - 1.6em - 2px) / 2); }
}

/* 對照現況：整顆收起來，等於站上目前跑的那一版。 */
html[data-qhide="1"] .nav-q { display: none; }
html[data-qhide="1"] .head-search { display: none; }
html[data-qhide="1"] .qx { display: none !important; }
</style>`;

/* ── ⑥ 行為 ─────────────────────────────────────────────────────────────
   ⚠ 站上那支篩選的 IIFE **一行都沒有改**：這裡只是把字寫進 #q 再送一個
     input 事件，剩下的完全交給它。兩個入口 ＝ 同一個搜尋。 */
const FEATURE_JS = `
<script>
/* ==========================================================================
   頁首的搜尋入口（提案中，2026-08-26）
   --------------------------------------------------------------------------
   ⚠ 定案上線時整段搬進 index.html 的頁尾腳本區，並把三條尺收成定案的那一格。
   ⚠ 沒有 JS 的時候：放大鏡是一個 <a href="#topics">，點下去跳到主題與科別，
     那正是使用者現在手動在做的事。**這一支只會讓它變好。**
   ========================================================================== */
(function () {
  var root = document.documentElement;
  var btn  = document.querySelector('.nav-q');
  var box  = document.querySelector('.head-search');
  if (!btn || !box) return;
  var input = box.querySelector('.hs-in');
  var nOut  = box.querySelector('.hs-n');
  var xBtn  = box.querySelector('.hs-x');
  var brand = document.querySelector('.site-head .brand');
  var shell = document.querySelector('.site-head .shell');
  var q     = document.getElementById('q');
  var open  = false, scrolled = false;

  /* 就地那一種：輸入框從品牌右緣 12px 開始。品牌的寬度會隨捲動（頁首收合）
     與視窗改變，所以每次量。⚠ 用 --pad 當左右邊界，和頁首的內距同一個值。 */
  function place() {
    if (!brand || !shell) return;
    var b = brand.getBoundingClientRect(), s = shell.getBoundingClientRect();
    var pad = parseFloat(getComputedStyle(shell).paddingLeft) || 0;
    var left = Math.max(0, b.right - s.left - pad + 12);
    /* 太窄就整條讓開 —— 一個 120px 的輸入框不如把品牌收起來。 */
    var avail = s.width - pad * 2 - left;
    if (avail < 150) left = 0;
    root.style.setProperty('--hs-left', left.toFixed(2) + 'px');
    /* 筆數印不印，看框自己有多寬，不看斷點。 */
    box.classList.toggle('is-narrow', box.getBoundingClientRect().width < 250);
  }

  function counts() {
    var a = 0, d = 0, i;
    var cards = document.querySelectorAll('.cards .card');
    var docs  = document.querySelectorAll('.docs .doc');
    for (i = 0; i < cards.length; i++) if (!cards[i].classList.contains('is-filtered-out')) a++;
    for (i = 0; i < docs.length;  i++) if (!docs[i].classList.contains('is-filtered-out')) d++;
    return { a: a, d: d };
  }

  /* 把字送進站上原本那個搜尋框，剩下的交給它自己那支 IIFE。 */
  function push() {
    if (q) { q.value = input.value; q.dispatchEvent(new Event('input', { bubbles: true })); }
    var c = counts();
    nOut.textContent = input.value.trim() ? (c.a + ' 篇・' + c.d + ' 位') : '';
  }

  function toTopics() {
    var sec = document.getElementById('topics');
    if (sec) sec.scrollIntoView();
  }

  function setOpen(v) {
    open = v;
    /* ⚠ 先把位置量好再現身 —— 反過來的話會先畫一幀「左緣還在 0」的滿版框。 */
    if (v) place();
    root.setAttribute('data-qopen', v ? '1' : '0');
    btn.setAttribute('aria-expanded', String(v));
    /* 開的時候先把站上那個搜尋框現在的字接過來 —— 兩個入口是同一個搜尋，
       打開卻看到空白（或看到上一次的字）都是說謊。 */
    if (v) { box.removeAttribute('inert'); if (q) input.value = q.value; input.focus(); push(); }
    else { box.setAttribute('inert', ''); scrolled = false; }
  }

  btn.addEventListener('click', function (e) {
    /* 有 JS 就不要真的跳走 —— 那是沒有 JS 時的退路。 */
    e.preventDefault();
    setOpen(!open);
  });
  xBtn.addEventListener('click', function () { setOpen(false); btn.focus(); });

  input.addEventListener('input', function () {
    push();
    /* ⚠ data-qr === 'auto' 那一格由第二支腳本（防抖之後捲到結果最多的那一區）
       接手，這裡就不要再捲一次 —— 兩支各捲各的會變成連跳兩下。 */
    if (root.getAttribute('data-qr') !== 'auto' &&
        root.getAttribute('data-qs') === 'live' && input.value.trim() && !scrolled) {
      scrolled = true; toTopics();
    }
  });
  box.addEventListener('submit', function (e) {
    e.preventDefault();
    if (root.getAttribute('data-qs') !== 'none') toTopics();
    input.blur();
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); }
  });
  /* 點到頁首以外的地方就收起來（但別把「捲到結果去看」也當成要收起來）。 */
  addEventListener('pointerdown', function (e) {
    if (!open) return;
    if (box.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });
  /* 站上那個搜尋框改了字，頁首這一個要跟上（同一個搜尋，兩個入口）。 */
  if (q) q.addEventListener('input', function () {
    if (document.activeElement === input) return;
    input.value = q.value;
    if (open) push();
  });

  place();
  addEventListener('resize', function () { if (open) place(); });
  addEventListener('scroll', function () { if (open) place(); }, { passive: true });
  setOpen(false);
})();
</script>`;

const AUGMENT_JS = `
<script>
/* ==========================================================================
   搜尋結果：把診所資訊也算進來、搜不到時給出口（提案中，2026-08-26 第二輪）
   --------------------------------------------------------------------------
   起因（使用者）：「如果搜尋 地址、電話 是沒有結果的，或是打醫師也不會出現，
   像這樣你們覺得要怎麼辦？」量出來是三件事，見這一頁 <head> 的推導。

   ⚠⚠ **站上那支篩選的 IIFE 一行都沒有改。** 這一支只是在它後面再掛一個
     #q 的 input 監聽（後掛的後跑），把它寫好的那一句話接手改寫。
     定案上線時可以照這個做法整段搬過去，也可以併進那支 —— 兩者等價。
   ⚠ **沒有做同義詞對照表**（地址→永樂街、電話→05…）。理由寫在推導裡：
     那會長出一份和畫面對不起來的第二真相，違反這一站「篩得到什麼 ＝
     畫面上寫什麼」的原則。搜不到就給出口，不猜他打了什麼。
   ========================================================================== */
(function () {
  var root  = document.documentElement;
  var q     = document.getElementById('q');
  var note  = document.querySelector('.filter-note');
  var qx    = document.querySelector('.qx');
  if (!q || !note || !qx) return;

  /* 診所資訊那兩張卡的文字先算好收起來 —— 做法和站上那支的 indexOf() 一樣：
     **讀的就是畫面上的字**，不另外維護一份關鍵字。 */
  var infoIdx = Array.prototype.map.call(
    document.querySelectorAll('#clinic .info-card'),
    function (el, i) {
      if (!el.id) el.id = 'clinic-card-' + i;
      var h = el.querySelector('h3');
      /* ⚠ 門診表那張卡裡有一排科別標記（.hours-filter），那是**控制項不是內容** ——
         不剔掉的話「矯正」「兒童牙科」這種查詢每一次都會多命中一次看診時間，
         而看的人要的是文章與醫師，不是門診表（實測：矯正 2篇4位＋看診時間 1，
         最後那一項純粹是雜訊）。 */
      var clone = el.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll('.hours-filter'), function (x) { x.remove(); });
      return { el: el, id: el.id, name: h ? h.textContent.trim() : '診所資訊',
               text: (clone.textContent || '').replace(/\\s+/g, '').toLowerCase() };
    });

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function counts() {
    var a = 0, d = 0, i;
    var cards = document.querySelectorAll('.cards .card');
    var docs  = document.querySelectorAll('.docs .doc');
    for (i = 0; i < cards.length; i++) if (!cards[i].classList.contains('is-filtered-out')) a++;
    for (i = 0; i < docs.length;  i++) if (!docs[i].classList.contains('is-filtered-out')) d++;
    return { a: a, d: d };
  }
  function infoHits(s) {
    if (root.getAttribute('data-qc') !== 'on' || !s) return [];
    return infoIdx.filter(function (r) { return r.text.indexOf(s) >= 0; });
  }
  function chip(n, label, href) {
    if (!n) return '<span>' + label.replace('%', '0') + '</span>';
    return '<a href="' + href + '"><b>' + n + '</b> ' + label.replace('%', '').trim() + '</a>';
  }

  /* 三顆結果標記。0 的那一顆退成柔墨線框、不能點 —— 「這裡沒有」也是答案。 */
  function renderChips(raw, c, hits) {
    var row = chip(c.a, '% 篇文章', '#articles') + chip(c.d, '% 位醫師', '#doctors');
    if (root.getAttribute('data-qc') === 'on') {
      row += hits.length
        ? '<a href="#' + hits[0].id + '">' + esc(hits[0].name) + (hits.length > 1 ? ' 等 ' + hits.length + ' 項' : '') + '</a>'
        : '<span>診所資訊</span>';
    }
    qx.innerHTML = '<p class="qx-lead">搜尋「<b>' + esc(raw) + '</b>」</p><div class="qx-row">' + row + '</div>';
    qx.hidden = false;
  }

  /* 搜不到的出口。**不猜他打了什麼** —— 直接給這個站上最常被找的三件事，
     前兩顆的名字是從診所資訊那兩張卡的 <h3> 讀回來的（畫面上寫什麼就是什麼）。 */
  function renderExits(raw) {
    var row = infoIdx.map(function (r) {
      return '<a href="#' + r.id + '">' + esc(r.name) + '</a>';
    }).join('');
    row += '<a href="tel:+88655339369">撥打 (05)5339-369</a>';
    qx.innerHTML = '<p class="qx-lead">站上搜不到「<b>' + esc(raw) +
      '</b>」。你可能要找的是：</p><div class="qx-row">' + row + '</div>';
    qx.hidden = false;
  }

  /* 落點：捲到**結果最多**的那一區。都沒有就回主題與科別（出口在那裡）。
     ⚠ 要防抖 —— 打字中每一個字都捲一次，畫面會跳個不停。 */
  var tid = 0, lastTarget = '';
  function autoJump(c, hits) {
    clearTimeout(tid);
    tid = setTimeout(function () {
      var best = 'topics', n = 0;
      if (c.a > n) { best = 'articles'; n = c.a; }
      if (c.d > n) { best = 'doctors';  n = c.d; }
      if (hits.length > n) { best = hits[0].id; n = hits.length; }
      if (best === lastTarget) return;
      lastTarget = best;
      var el = document.getElementById(best);
      if (el) el.scrollIntoView();
    }, 450);
  }

  function render() {
    var raw = q.value.trim();
    var s   = q.value.replace(/\\s+/g, '').toLowerCase();
    if (!raw) { qx.hidden = true; qx.innerHTML = ''; lastTarget = ''; clearTimeout(tid); return; }

    var c = counts(), hits = infoHits(s), total = c.a + c.d + hits.length;
    var mode  = root.getAttribute('data-qr');
    var exits = root.getAttribute('data-qe') === 'on';

    /* 頁首搜尋列裡那個筆數也要把診所資訊算進去 —— 不然「停車」會印
       「0 篇・0 位」，可是底下明明找到了一項。
       ⚠⚠ 要排到下一個任務再寫：頁首那支的 push() 是**先**在 #q 上送 input
         （於是這裡同步跑完）**再**寫 .hs-n，直接寫會被它蓋掉（實測踩過）。 */
    var kA = c.a, kD = c.d, kI = hits.length;
    setTimeout(function () {
      var hs = document.querySelector('.hs-n');
      if (hs && hs.textContent) {
        hs.textContent = kA + ' 篇・' + kD + ' 位' + (kI ? '・' + kI + ' 項' : '');
      }
    }, 0);

    if (total === 0 && exits) { note.hidden = true; renderExits(raw); }
    else if (mode === 'plain') {
      /* 現況那一句。診所資訊有命中的話要補上去，不然「0 篇 0 位」會說謊。 */
      note.hidden = false; qx.hidden = true; qx.innerHTML = '';
      if (hits.length) {
        note.innerHTML = note.innerHTML.replace(/。\\s*$/, '') +
          '、<a href="#' + hits[0].id + '">診所資訊</a> ' + hits.length + ' 項。';
      }
    } else { note.hidden = true; renderChips(raw, c, hits); }

    if (mode === 'auto') autoJump(c, hits);
  }

  /* ⚠ 後掛的後跑：站上那支在解析時就掛好了 input → apply，所以這一支拿到的
     一定是它算完之後的畫面（.is-filtered-out 都已經套好、note 也已經寫好）。 */
  q.addEventListener('input', render);
  /* 切換條改了尺也要重畫一次。 */
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ['data-qc', 'data-qe', 'data-qr', 'data-qhide'] });
})();
</script>`;

/* ── ⑦ 切換條 ───────────────────────────────────────────────────────────
   ⚠ 網址參數的正規式一律用「明確的字串清單」比對，不要寫 [a-z]+
     （吃不到 glass1 這種帶數字的值，CLAUDE.md 記過一次）。 */
const BAR = `
<!-- ==========================================================================
     切換條（提案用）。定案之後連同 <html> 上的 data-q* 一起刪掉。
     ⚠ class 一律 pv- 前綴 —— 站上的短名字幾乎一定會撞（2026-08-16 .foot 踩過）。
     ⚠ 預設收起來（只留右上一顆小鈕）：這一頁要判斷的正是頁首長什麼樣，
       切換條攤開會把它蓋掉（2026-08-16 hero-motion-mobile 那一輪的教訓）。
     ========================================================================== -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; right: 12px; bottom: 12px;
  font: 400 13px/1.6 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee;
}
.pvbar-btn {
  display: flex; align-items: center; gap: .4em; margin-left: auto;
  padding: .5em .8em; min-height: 40px;
  background: rgba(20,18,16,.92); color: #f2f0ee;
  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;
  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}
.pvbar-btn b { font-weight: 700; opacity: .8; }
.pvbar-panel {
  display: none; margin-bottom: 8px; width: min(340px, calc(100vw - 24px));
  /* ⚠ svh 不是 vh —— iOS 的 vh 是工具列收起後的大視窗高度，面板會比看得到的還高。 */
  /* ⚠ 攤開最多吃 52% 的畫面 —— 要判斷的東西在**頁首**，面板長到蓋住它
     這一頁就沒有意義了（2026-08-16 hero-motion-mobile 那一輪的教訓）。
     實測 375×667 上不夾住會長到 92.8%，整條頁首被蓋掉。內容超過就自己捲。
     ⚠ svh 不是 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */
  flex-direction: column; max-height: 52svh;
  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);
  border-radius: 10px; overflow: hidden;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 12px 34px rgba(0,0,0,.45);
}
.pvbar[data-open="1"] .pvbar-panel { display: flex; }
.pvbar[data-open="1"] { top: auto; }
.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }
.pvbar-g { padding: 7px 11px 4px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }
.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }
.pvbar-row { display: flex; gap: 6px; padding: 0 9px 5px; }
.pvbar-row button {
  flex: 1 1 0; padding: .4em .2em; min-height: 44px;
  background: rgba(255,255,255,.07); color: #cfc9c2;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;
  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;
}
.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }
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
@media (max-width: 420px) { .pvbar { right: 8px; bottom: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }
@media print { .pvbar { display: none; } }
</style>

<div class="pvbar" data-open="0">
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">診所資訊要不要一起搜　<em>永樂街・停車・看診時間</em></div>
      <div class="pvbar-row" data-k="qc">
        <button type="button" data-v="off">Ⓐ<small>不搜（現況）</small></button>
        <button type="button" data-v="on">Ⓑ<small>一起搜</small></button>
      </div>
      <div class="pvbar-g">都搜不到的時候　<em>像「地址」「電話」</em></div>
      <div class="pvbar-row" data-k="qe">
        <button type="button" data-v="off">Ⓐ<small>只有一句話</small></button>
        <button type="button" data-v="on">Ⓑ<small>給三個出口</small></button>
      </div>
      <div class="pvbar-g">結果那一句　<em>「醫師」其實有 9 位，只是看不到</em></div>
      <div class="pvbar-row" data-k="qr">
        <button type="button" data-v="plain">Ⓐ<small>一句灰字</small></button>
        <button type="button" data-v="chips">Ⓑ<small>可以點的三顆</small></button>
        <button type="button" data-v="auto">Ⓒ<small>Ⓑ＋自動帶過去<br>（會猜）</small></button>
      </div>
      <div class="pvbar-g">對照</div>
      <div class="pvbar-row" data-k="qhide">
        <button type="button" data-v="0">提案</button>
        <button type="button" data-v="1">現況（沒有放大鏡）</button>
      </div>
    </div>
    <div class="pvbar-foot"></div>
  </div>
  <button class="pvbar-btn" type="button" aria-expanded="false">搜尋結果 <b></b></button>
</div>

<script>
(function () {
  var root = document.documentElement;
  var box  = document.querySelector('.pvbar');
  var btn  = box.querySelector('.pvbar-btn');
  var foot = box.querySelector('.pvbar-foot');
  /* ⚠ 第一輪那三條尺 2026-08-26 已經定案（Ⓑ 整條 ／ Ⓐ 只有圖示 ／ Ⓐ 立刻捲過去），
     所以它們變成寫死的值、不再出現在切換條上（CLAUDE.md：已定案的事不要重開）。
     ⚠ 要退回去看那三條，把它們搬回 KEYS 就好，樣式與行為都還在。 */
  var FIXED = { qm: 'full', qf: 'none', qs: 'live' };
  var KEYS = { qc: ['off','on'], qe: ['off','on'], qr: ['plain','chips','auto'], qhide: ['0','1'] };
  var DEF  = { qc: 'on', qe: 'on', qr: 'chips', qhide: '0' };
  var LBL  = { plain: '一句話', chips: '三顆', auto: '三顆＋帶過去' };
  var st   = { qc: DEF.qc, qe: DEF.qe, qr: DEF.qr, qhide: DEF.qhide };
  Object.keys(FIXED).forEach(function (k) { document.documentElement.setAttribute('data-' + k, FIXED[k]); });

  var qs = new URLSearchParams(location.search);
  Object.keys(KEYS).forEach(function (k) {
    var v = qs.get(k);
    if (v !== null && KEYS[k].indexOf(v) >= 0) st[k] = v;
  });

  function apply() {
    Object.keys(KEYS).forEach(function (k) {
      root.setAttribute('data-' + k, st[k]);
      var row = box.querySelector('.pvbar-row[data-k="' + k + '"]');
      Array.prototype.forEach.call(row.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      });
    });
    var u = new URLSearchParams();
    Object.keys(KEYS).forEach(function (k) { if (st[k] !== DEF[k]) u.set(k, st[k]); });
    history.replaceState(null, '', u.toString() ? '?' + u : location.pathname);
    btn.querySelector('b').textContent = st.qhide === '1' ? '現況' : LBL[st.qr];
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
     這一頁真正要盯的是**版面夠不夠**，所以面板直接下判斷，不要只印數字
     （2026-08-17 tag-fade 那一輪的教訓）。 */
  function n(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  /* 這一輪真正要盯的：查了什麼、三個地方各找到幾筆。 */
  function hits() {
    var inp = document.getElementById('q');
    var raw = inp ? inp.value.trim() : '';
    if (!raw) return '<div class="m"><span>目前的查詢</span><b>（沒有）</b></div>';
    var s = raw.replace(/\s+/g, '').toLowerCase(), i;
    var cards = document.querySelectorAll('.cards .card'), docs = document.querySelectorAll('.docs .doc');
    var a = 0, d = 0;
    for (i = 0; i < cards.length; i++) if (!cards[i].classList.contains('is-filtered-out')) a++;
    for (i = 0; i < docs.length;  i++) if (!docs[i].classList.contains('is-filtered-out')) d++;
    var info = Array.prototype.filter.call(document.querySelectorAll('#clinic .info-card'), function (el) {
      return (el.textContent || '').replace(/\s+/g, '').toLowerCase().indexOf(s) >= 0;
    }).length;
    var tot = a + d + info;
    return '<div class="m"><span>目前的查詢</span><b>' + raw + '</b></div>' +
      '<div class="m ' + (a ? 'good' : '') + '"><span>文章</span><b>' + a + '</b></div>' +
      '<div class="m ' + (d ? 'good' : '') + '"><span>醫師</span><b>' + d + '</b></div>' +
      '<div class="m ' + (info ? 'good' : '') + '"><span>診所資訊</span><b>' + info + '</b></div>' +
      '<div class="m ' + (tot ? 'good' : 'bad') + '"><span>合計</span><b>' + (tot ? tot + ' 筆' : '搜不到 → 看出口') + '</b></div>';
  }
  function measure() {
    if (box.dataset.open !== '1') return;
    var brand = document.querySelector('.site-head .brand');
    var nav   = document.querySelector('.site-nav');
    var mag   = document.querySelector('.nav-q');
    var field = document.querySelector('.head-search');
    if (!brand || !nav) { foot.textContent = '（找不到頁首）'; return; }
    var b = brand.getBoundingClientRect(), v = nav.getBoundingClientRect();
    var slack = v.left - b.right;
    /* 品牌折行：.brand-text 是 flex-wrap: wrap，兩行時高度會跳一階。 */
    var bt = brand.querySelector('.brand-text');
    var nm = bt && bt.querySelector('b'), sm = bt && bt.querySelector('small');
    /* ⚠ 手機版的品牌**本來就是兩行**（主名一行、地名一行），所以「折了沒」不是
       判準。要盯的是「字有沒有被壓到」——.brand-text 的內容寬超過它的框就是。 */
    var squeezed = !!bt && bt.scrollWidth > bt.clientWidth + 1;
    var nmW = nm ? n(nm.getBoundingClientRect().width) : '—';
    var over = root.scrollWidth - root.clientWidth;
    var opened = root.getAttribute('data-qopen') === '1';
    var fw = field ? field.getBoundingClientRect().width : 0;
    var fs = field ? getComputedStyle(field.querySelector('.hs-in')).fontSize : '—';
    foot.innerHTML =
      '<div class="m"><span>視窗寬</span><b>' + innerWidth + '</b></div>' +
      '<div class="m ' + (slack >= 8 ? 'good' : 'bad') + '"><span>品牌 → 選單 餘量</span><b>' + n(slack) + '</b></div>' +
      '<div class="m ' + (squeezed ? 'bad' : 'good') + '"><span>品牌文字（主名 ' + nmW + '）</span><b>' + (squeezed ? '被壓到了' : '沒被壓到') + '</b></div>' +
      '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>' +
      '<hr>' +
      '<div class="m"><span>搜尋列</span><b>' + (opened ? '展開中 ' + n(fw) + 'px' : '收著') + '</b></div>' +
      '<div class="m ' + (parseFloat(fs) >= 16 ? 'good' : 'bad') + '"><span>輸入框字級</span><b>' + fs + '</b></div>' +
      '<hr>' + hits() +
      '<div class="pvbar-note">「地址」「電話」在這一站是<b>圖示不是文字</b>，' +
      '「週一／週六」門診表寫的是「一二三四五」—— 這一類<b>擴大索引也搜不到</b>，' +
      '只能靠出口。</div>';
  }
  addEventListener('resize', measure);
  /* 展開／收合搜尋列之後也要重量一次。 */
  new MutationObserver(measure).observe(root, { attributes: true, attributeFilter: ['data-qopen'] });
  var qEl = document.getElementById('q');
  if (qEl) qEl.addEventListener('input', function () { setTimeout(measure, 0); });
  apply();
})();
</script>
`;

/* ── ⑧ 插在**最後一個** </body> 前面 ────────────────────────────────────
   ⚠ 這一站的註解裡就寫著那幾個字（.nav-lamp 那一段），
     用 String.replace('</body>', …) 會換到註解裡那一個。 */
/* 樣式進 <head>（＝上線時它該在的地方）。⚠ 不能塞在 </body> 前面：
   這個 <form> 在樣式表之前就已經被解析出來了，於是有 180ms 是**可見的** ——
   關著的搜尋列會在開頁那一瞬間整條閃出來（實測過，就是這樣長出來的）。
   放進 <head> 之後它從第一幀就是隱形的。
   ⚠ 這一份排在站上那份樣式表**後面**，所以同權重的規則（.site-head .shell）
     由它決勝 —— 和上線時搬進 index.html 的位置是同一個道理。 */
const hi = html.lastIndexOf('</head>');
if (hi < 0) throw new Error('找不到 </head>');
html = html.slice(0, hi) + FEATURE_CSS + '\n' + html.slice(hi);

const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + FEATURE_JS + AUGMENT_JS + BAR + '\n' + html.slice(i);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/head-search/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
