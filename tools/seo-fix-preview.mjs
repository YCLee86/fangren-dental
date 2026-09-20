/* =============================================================================
   SEO／GEO 三項修正的提案頁產生器（2026-09-20）
   -----------------------------------------------------------------------------
   node tools/seo-fix-preview.mjs
     → preview/seo-fix-topic/index.html   著陸頁的標記結構（報告 P1-2 ＝ ②）
     → preview/seo-fix-post/index.html    文章的麵包屑與引用版位（P1-1 ＝ ①、P2-1 ＝ ③）

   兩頁都是**快照**，不要手改 —— 改完重跑這一支。
   推導與扣分的依據在 drafts/seo-geo-audit/REPORT.md。

   ⚠⚠ 這一支是一次性的，定案之後連同兩頁一起刪掉，
     真正的修改要回 tools/topics.mjs（②）與 tools/build.mjs＋tools/schema.mjs（①）。
     但它**有進版控** —— main 中途被另一台推過東西的話快照要重抓，
     放暫存區會掉（同 map-pin-preview、head-search-preview 那兩輪）。

   ⚠ 提案頁的四件事（CLAUDE.md 第八節）在 previewize() 裡一起做掉：
     ① 相對路徑：來源在 topics/<spec>/ 與 posts/<slug>/，都是**深度 2**，
        而 preview/seo-fix-… 底下也是深度 2 → ../../ 照樣對。
        **但同層連結（../perio-laser/）會指到 preview/ 底下**，一律改絕對路徑。
     ② 計數器：不剝掉，**降級** —— data-views-self 改成 data-views
        （只有 -self 會 POST +1，所以不灌計數，又印得出真數字，
         而且沒有任何假數字可以被搬回正式站。同 chip-carry 那一輪）。
     ③ 切換條插在**最後一個** </body> 前面，用 lastIndexOf ——
        這一站的註解裡就寫著那幾個字。
     ④ preview/ 進得了 _site（dist.mjs 的 OPTIONAL 已列），
        robots.txt 與 Worker 的 noindex 三道都已就位。
   ⚠ 樣式放 <head>，不能塞在 </body> 前面（開頁那 180ms 會整條閃出來）。
   ⚠ class 一律 pv 前綴 —— 這是 index.html 的完整複本，短名字幾乎一定會撞。
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const rd = (p) => fs.readFileSync(path.join(R, p), "utf8");
const wr = (p, s) => {
  fs.mkdirSync(path.dirname(path.join(R, p)), { recursive: true });
  fs.writeFileSync(path.join(R, p), s);
};
const ok = [];
const must = (cond, msg) => { if (!cond) throw new Error("守門沒過：" + msg); ok.push(msg); };


/* 提案頁抬頭的推導。定案之後這一段會搬進 history/seo-fix.html，
   頁面本身刪掉（CLAUDE.md 第八節）。 */
const NOTE_TOPIC = `<!-- =============================================================================
     提案　科別著陸頁的標記結構　/preview/seo-fix-topic/
     ＝ SEO／GEO 體檢報告的 P1-2（報告在 drafts/seo-geo-audit/REPORT.md）
     -----------------------------------------------------------------------------
     ⚠⚠ 這一頁是產生出來的快照，不要手改 —— 改 tools/seo-fix-preview.mjs 再重跑。
     來源是正式站的 /topics/perio/，除了切換條與下面那幾條樣式之外一個字都沒有動。

     為什麼要開這一頁
     -----------------------------------------------------------------------------
     七個科別著陸頁是 2026-08-21 專為 SEO 做的，但體檢量出來它們是三組頁面裡
     分數最低的（59 分，首頁 89、文章 78）。兩個成因都在標記不在文案：

     ① **h1 排在 h2 後面。** 著陸頁是 index.html 的快照，所以首頁那個
        「主題與科別」的 h2 會先出現，大綱長成 h2 → h1 → h3。
     ② **這一頁唯一不與首頁重複的那一塊沒有任何標題。**
        三個病人的問句、五步流程，全部是 <p class="tp-case"> 與
        <p class="tp-step"><b>檢查</b>…。七頁與首頁的文字重疊 68～77%，
        獨有的只有 200～350 個字，而那一塊正好是 AI 最會引用的兩種形狀
        （問答、有順序的流程），現在卻是最抓不到的。

     三把尺
     -----------------------------------------------------------------------------
     ・標題層級　Ⓐ現況／Ⓑ把「主題與科別」降成純文字標籤／Ⓒ把這一科的標題整塊搬到上面
     ・三個處境　Ⓐ現況（三個 p）／Ⓑ 一個 dl，三個 dt 共用一個 dd
     ・五步流程　Ⓐ現況（五個 p）／Ⓑ 一個 ol ＋ 小標改成真的 h2

     ⚠⚠ **文案一個字都沒有改**，改的只有標記。所以不必回 COPY.md 重審。
     ⚠ Ⓑ 量過了：Ⓐ→Ⓑ 的 35 個文字節點，位置、字級、粗細、顏色**逐項完全相同**
       （Chromium 390×844，量 getClientRects 與 computed style）。Ⓒ 會動到版面。
     ⚠ 量的過程中抓到兩件只有量才看得出來的事，真的改 tools/topics.mjs 時要一起帶：
       ・h2 的粗體是瀏覽器預設值，降成 p 之後 font-weight 會從 700 掉到 400
         （位置完全沒動，只有粗細）。
       ・.tp-first-h 那個 p 的行高是繼承 body 的，不是 --tp-lh；
         換成 h2 時若把 line-height 釘成 var(--tp-lh)，整塊流程會往上跑 2px。
     ⚠ .sec-head h2 那條規則在兩個中斷點各有一份、另有兩條 [data-topic] 的版型規則，
       降級要用 :is(h2, .sec-h) 一次改到四條，只改一條會在手機上跑掉。
============================================================================== -->
`;

const NOTE_POST = `<!-- =============================================================================
     提案　文章的麵包屑與引用版位　/preview/seo-fix-post/
     ＝ SEO／GEO 體檢報告的 P1-1（麵包屑）與 P2-1（外部權威引用）
     -----------------------------------------------------------------------------
     ⚠⚠ 快照，不要手改。來源是正式站的 /posts/gum-bleeding/。

     ① 麵包屑　15 篇文章**沒有任何一篇回指科別著陸頁**
     -----------------------------------------------------------------------------
     畫面上那一格科別是 <span class="post-tag" data-spec="perio">，是 span 不是連結；
     JSON-LD 的 BreadcrumbList 第 2 層指向 https://fangren.net/#topics（首頁錨點）。
     data-spec 早就在那個 span 上了，對應關係一直都知道，只是沒接起來。
     結果七個著陸頁各只有 8 個站內入口，而且等於在跟爬蟲說「這一篇的上一層是首頁」。

     ・Ⓐ 現況／Ⓑ 接到 /topics/perio/，文字不變／Ⓒ 接到著陸頁，文字改成科別名「牙周治療」
     ⚠ Ⓑ 與 Ⓐ 量過了：藥丸的位置、大小、底色、字色完全一樣，只是變成可以點。
     ⚠⚠ 量的時候抓到一條坑：.crumbs a 的權重（0,2,0）贏過 .post-tag（0,1,0），
       span 直接換成 a 的話那顆藥丸的字會被染成 ink-soft。真的改的時候要一起帶
       .crumbs a.post-tag { color: #fff; text-decoration: none }。
     ⚠ 畫面與 JSON-LD **要一起改** —— 只改畫面的話機器讀的還指著首頁。
       那一行在 tools/schema.mjs 第 475 行，tag → spec 的對照表在 tools/build.mjs 第 513 行。
     ⚠ 這一段在 <main> 裡面，所以真的改下去 15 篇的內容雜湊會一起變、
       updated 會全部跳成當天。照 CLAUDE.md 第五節把 build-manifest.json 的日期改回去。

     ② 外部權威引用　15 篇裡 14 篇是 0
     -----------------------------------------------------------------------------
     ・Ⓐ 不放／Ⓑ 句尾附註（依據：…）
     ⚠⚠ **連結的網址是空的。** 這個容器連不到 nhi.gov.tw、cda.org.tw、taop.org.tw
       與 pubmed（curl 回 000、WebFetch 回 EGRESS_BLOCKED），沒查證過的網址
       不可以寫進醫療網站 —— 猜一個等於把讀者送到一個不知道是什麼的地方。
       這一頁要判斷的是**版位與錨點怎麼寫**，網址等使用者給或在有網路的電腦上補
       （同 CLAUDE.md 第十節那個 Wikidata sameAs 的處理方式）。
     ⚠ 版位只在內文那一段動手。第一版掃整頁，兩個錨點分別命中了 <head> 裡
       og:description 的**屬性值**與底部「重點整理」的 <dd> —— 兩個都不報錯。
============================================================================== -->
`;

/* ---------- 共用：把一份正式站的頁面變成提案頁 ---------- */
function previewize(html, { url, title, desc }) {
  /* SEO 區塊整段換成 noindex —— 裡面的 canonical 與 og:* 全部指著正式網址，
     留著等於對外宣告一個提案頁就是那一頁（ortho-article 那一輪學到的）。 */
  const s = html.indexOf("<!-- SEO:START");
  const e = html.indexOf("SEO:END -->");
  must(s !== -1 && e !== -1, "找得到 SEO:START／SEO:END");
  html = html.slice(0, s) +
    '<meta name="robots" content="noindex, nofollow, noarchive">' +
    html.slice(e + "SEO:END -->".length);

  /* 標題與描述也換掉，分享出去不會被誤認成正式頁 */
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}（提案頁）</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc}">`);
  html = html.replace(/<link rel="canonical"[^>]*>/, "");

  /* 計數器降級，不剝掉 */
  html = html.replace(/data-views-self=/g, "data-views=");

  /* 同層連結改絕對路徑（../perio-laser/ 會指到 preview/perio-laser/） */
  html = html.replace(/href="\.\.\/([a-z0-9-]+)\/"/g, (m, slug) =>
    url.startsWith("/posts/") ? `href="/posts/${slug}/"` : `href="/topics/${slug}/"`);

  return html;
}

/* 切換條 ＋ 量測面板插在最後一個 </body> 前面 */
function inject(html, styleBlock, barHtml, scriptBlock) {
  const h = html.lastIndexOf("</head>");
  must(h !== -1, "找得到 </head>");
  html = html.slice(0, h) + styleBlock + html.slice(h);
  const b = html.lastIndexOf("</body>");
  must(b !== -1, "找得到最後一個 </body>");
  return html.slice(0, b) + barHtml + scriptBlock + html.slice(b);
}

/* ============================================================================
   ②　著陸頁的標記結構
   ========================================================================== */
const SPEC = "perio";

/* --- 轉換 1：三個處境 ＋ 一句回應 → <dl> ---------------------------------
   HTML 允許一個 <dl> 底下多個 <dt> 共用一個 <dd>，所以**文案一個字都不用改**，
   三問一答的節奏原樣保留，只是變成機器讀得懂的問答對。
   ⚠ 兒牙那一科用的是 groups（兩組 cases ＋ 各自一句 reply），
     所以這裡要一組一個 <dl>，不能整塊包成一個。 */
function toDl(html) {
  const re = /((?:[ \t]*<p class="tp-case">[\s\S]*?<\/p>\n?)+)([ \t]*<p class="tp-reply">[\s\S]*?<\/p>)?/g;
  let n = 0;
  const out = html.replace(re, (m, cases, reply) => {
    n++;
    const dts = cases.replace(/<p class="tp-case">([\s\S]*?)<\/p>/g,
      '<dt class="tp-case">$1</dt>');
    const dd = reply
      ? reply.replace(/<p class="tp-reply">([\s\S]*?)<\/p>/, '<dd class="tp-reply">$1</dd>')
      : "";
    return `        <dl class="tp-cases">\n${dts}${dd ? dd + "\n" : ""}        </dl>\n`;
  });
  must(n >= 1, "著陸頁找得到 tp-case 那幾段");
  return out;
}

/* --- 轉換 2：五步流程 → <ol>，小標 → <h2> -------------------------------
   有順序的東西用有順序的標記；那一行本來就是標題，只是寫成了 <p>。 */
function toOl(html) {
  let hit = 0;
  html = html.replace(/<p class="tp-first-h">([\s\S]*?)<\/p>/, (m, t) => {
    hit++; return `<h2 class="tp-first-h">${t}</h2>`;
  });
  must(hit === 1, "著陸頁找得到 tp-first-h（而且只有一個）");
  const re = /((?:[ \t]*<p class="tp-step">[\s\S]*?<\/p>\n?)+)/;
  must(re.test(html), "著陸頁找得到 tp-step 那一串");
  return html.replace(re, (m) => {
    const lis = m.replace(/<p class="tp-step">([\s\S]*?)<\/p>/g, '<li class="tp-step">$1</li>');
    return `          <ol class="tp-steps">\n${lis}          </ol>\n`;
  });
}

/* --- 轉換 3-Ⓑ：把「主題與科別」降成純文字標籤 ---------------------------
   畫面完全不變（選擇器一起改），但它不再是標題，h1 因此變成這一頁的第一個標題。
   ⚠ CSS 要用 :is() 一起改到，那條規則在兩個中斷點各有一份、
     還有兩條 [data-topic] 的版型規則，只改一條會在手機上跑掉。 */
function demoteSecHead(html) {
  const before = (html.match(/\.sec-head h2/g) || []).length;
  must(before >= 3, "找得到 .sec-head h2 的全部規則（量到 " + before + " 條）");
  html = html.replace(/\.sec-head h2/g, ".sec-head :is(h2, .sec-h)");
  const hit = html.replace(/<h2>主題與科別<\/h2>/, '<p class="sec-h">主題與科別</p>');
  must(hit !== html, "找得到那一顆 <h2>主題與科別</h2>");
  return hit;
}

/* --- 轉換 3-Ⓒ：把 .tp-intro 整塊搬到 chips 那一排上面 -------------------
   h1 真的排到最前面，代價是畫面會變（這一科的標題跑到「主題與科別」上面）。 */
function moveIntro(html) {
  const m = html.match(/[ \t]*<div class="tp-intro">[\s\S]*?\n[ \t]*<\/div>\n/);
  must(!!m, "切得出 .tp-intro 整塊");
  const block = m[0];
  html = html.replace(block, "");
  const anchor = '      <div class="sec-head">';
  must(html.includes(anchor), "找得到 .sec-head 的錨點（連縮排）");
  return html.replace(anchor, block + anchor);
}

function buildTopic() {
  let html = rd(`topics/${SPEC}/index.html`);
  html = previewize(html, {
    url: `/topics/${SPEC}/`,
    title: "著陸頁的標記結構",
    desc: "提案頁：科別著陸頁的標題層級、問答與流程的標記。",
  });

  /* 三把尺各自產出「真的轉換過的那一份」，放進 <template> 讓切換條即時換。
     ⚠ 不是用 CSS 把成品再做一次 —— template 裡是這一支真的跑出來的標記，
       定案時整段可以直接搬進 tools/topics.mjs。 */
  const introRe = /<div class="tp-intro">[\s\S]*?\n[ \t]*<\/div>\n/;
  const intro0 = html.match(introRe);
  must(!!intro0, "抓得到 .tp-intro 原樣");
  const introQ = toDl(intro0[0]);
  const introS = toOl(intro0[0]);
  const introQS = toOl(toDl(intro0[0]));

  const tpl = (id, s) => `<template id="${id}">${s}</template>\n`;
  const templates =
    tpl("pv-intro-0", intro0[0]) + tpl("pv-intro-q", introQ) +
    tpl("pv-intro-s", introS) + tpl("pv-intro-qs", introQS);

  /* Ⓑ 的 CSS 一定要先改，不然切到 Ⓑ 的時候那一行會掉成內文大小 */
  html = demoteSecHead(html);
  /* 預設先回到 Ⓐ 的標記：把剛降下去的那一顆換回 h2，由 JS 決定要不要降 */
  html = html.replace('<p class="sec-h">主題與科別</p>', '<h2 id="pv-sechead">主題與科別</h2>');

  /* Ⓒ 要用到的「搬到上面」在 JS 裡做（純 DOM 搬移，不會走樣） */

  const style = `
<style>
/* 提案頁自己的樣式。pv 前綴，和站上的 class 不會撞。 */
.pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:var(--card,#fff);
  border-top:1px solid var(--rule,#dcdcd4);padding:.5rem .7rem calc(.5rem + env(safe-area-inset-bottom));
  font-size:.78rem;line-height:1.5;box-shadow:0 -6px 18px rgba(0,0,0,.08)}
.pv-row{display:flex;align-items:center;gap:.35rem;flex-wrap:nowrap;overflow-x:auto;margin:.22rem 0}
.pv-lb{flex:0 0 auto;color:var(--ink-soft,#5a5f57);letter-spacing:.02em;min-width:4.1em}
.pv-b{flex:0 0 auto;border:1px solid var(--rule,#dcdcd4);background:transparent;color:inherit;
  border-radius:8px;padding:.2rem .5rem;font:inherit;cursor:pointer;white-space:nowrap}
.pv-b[aria-pressed="true"]{background:var(--accent-deep,#12656a);color:#fff;border-color:transparent}
.pv-now{margin-left:auto;flex:0 0 auto;border-style:dashed}
.pv-foot{display:flex;align-items:center;gap:.5rem;margin-top:.3rem}
.pv-hint{color:var(--ink-soft,#5a5f57);font-size:.72rem}
.pv-panel{display:none;margin-top:.4rem;padding-top:.4rem;border-top:1px dashed var(--rule,#dcdcd4);
  max-height:20vh;overflow:auto;font-size:.72rem}
.pv-bar.pv-open .pv-panel{display:block}
.pv-panel ul{margin:.2rem 0 .5rem;padding-left:1.1rem}
.pv-panel li{margin:.08rem 0}
.pv-ok{color:#1a7a4a;font-weight:700}
.pv-no{color:#b4451f;font-weight:700}
.pv-tag{display:inline-block;min-width:1.7em;font-weight:700;color:var(--accent-deep,#12656a)}
body{padding-bottom:7.5rem}

/* --- 新標記要用到的樣式。目的只有一個：畫面和現況一模一樣 ---
   dl／dd／ol／h2 都帶著瀏覽器的預設值，不歸零就會位移。 */
/* ⚠ h2 的粗體是瀏覽器預設值，不是 .sec-head 那條規則給的 ——
   降成 <p> 之後量出來 font-weight 700 掉成 400（位置完全沒動，只有粗細）。
   真的要改 tools/topics.mjs 的時候，這一行一定要一起帶。 */
.sec-head .sec-h{font-weight:700}
.tp-cases{margin:0;padding:0}
.tp-cases dt{margin:0 0 .2rem}
.tp-cases dd{margin-inline-start:0}
.tp-intro dd.tp-reply{margin:.28rem 0 .62rem}
.tp-intro dl.tp-cases:last-of-type dd.tp-reply{margin-bottom:.2rem}
.tp-steps{margin:0;padding:0;list-style:none}
.tp-steps li{margin:0 0 .1rem}
/* h2 帶著 1.5em 的字級，這一行本來是 p，要釘回去。
   ⚠ 只釘 font-size —— 第一版連 line-height 也一起釘成 var(--tp-lh)，
     量出來整塊流程往上跑了 2px（那個 p 本來是繼承 body 的行高，不是 --tp-lh）。 */
h2.tp-first-h{font-size:1rem;line-height:inherit}
</style>
`;

  const bar = `
<div class="pv-bar" id="pv-bar">
  <div class="pv-row"><span class="pv-lb">標題層級</span>
    <button class="pv-b" data-k="h" data-v="0">Ⓐ 現況</button>
    <button class="pv-b" data-k="h" data-v="1">Ⓑ 降成標籤（畫面不變）</button>
    <button class="pv-b" data-k="h" data-v="2">Ⓒ 標題搬到上面</button></div>
  <div class="pv-row"><span class="pv-lb">三個處境</span>
    <button class="pv-b" data-k="q" data-v="0">Ⓐ 現況</button>
    <button class="pv-b" data-k="q" data-v="1">Ⓑ 問答結構</button></div>
  <div class="pv-row"><span class="pv-lb">五步流程</span>
    <button class="pv-b" data-k="s" data-v="0">Ⓐ 現況</button>
    <button class="pv-b" data-k="s" data-v="1">Ⓑ 有序清單</button>
    <button class="pv-b pv-now" id="pv-reset">對照現況</button></div>
  <div class="pv-foot"><span class="pv-hint">文案一個字都沒有改，改的只有標記</span>
    <button class="pv-b" id="pv-toggle" style="margin-left:auto">量測</button></div>
  <div class="pv-panel" id="pv-panel"></div>
</div>
${templates}`;

  const script = `
<script>
(function(){
  var qs = new URLSearchParams(location.search);
  /* ⚠ 正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到 glass1 這種值（第八節第 2 條） */
  var st = { h:'0', q:'0', s:'0' };
  Object.keys(st).forEach(function(k){
    var v = qs.get(k); if (v && /^[a-z0-9]+$/.test(v)) st[k] = v;
  });

  var host = document.querySelector('.tp-intro').parentNode;
  var sec  = document.getElementById('pv-sechead');
  var secHome = sec.parentNode;             /* .sec-head */
  var tools = document.querySelector('.topic-tools');

  function introTpl(){
    var id = st.q==='1' && st.s==='1' ? 'pv-intro-qs'
           : st.q==='1' ? 'pv-intro-q'
           : st.s==='1' ? 'pv-intro-s' : 'pv-intro-0';
    return document.getElementById(id).content.cloneNode(true);
  }

  function apply(){
    /* 換掉 .tp-intro 整塊 */
    var cur = host.querySelector('.tp-intro') || document.querySelector('.tp-intro');
    var frag = introTpl();
    var next = frag.querySelector('.tp-intro');
    cur.parentNode.replaceChild(next, cur);

    /* 標題層級三態 */
    var want = st.h === '1' ? 'P' : 'H2';
    if (sec.tagName !== want){
      var el = document.createElement(want === 'P' ? 'p' : 'h2');
      el.id = 'pv-sechead'; el.textContent = '主題與科別';
      if (want === 'P') el.className = 'sec-h';
      sec.parentNode.replaceChild(el, sec); sec = el;
    }
    /* Ⓒ：把整塊搬到 .sec-head 前面；其餘搬回 chips 後面 */
    var shell = secHome.parentNode;
    if (st.h === '2') shell.insertBefore(next, secHome);
    else if (tools && tools.parentNode) tools.parentNode.insertBefore(next, tools.nextSibling);

    document.querySelectorAll('.pv-b[data-k]').forEach(function(b){
      b.setAttribute('aria-pressed', String(st[b.dataset.k] === b.dataset.v));
    });
    var u = new URL(location); Object.keys(st).forEach(function(k){ u.searchParams.set(k, st[k]); });
    history.replaceState(null, '', u);
    measure();
  }

  /* ---- 量測面板。⚠ 要下判斷，不要只印數字（第八節那一輪學到的）。 ---- */
  function measure(){
    var p = document.getElementById('pv-panel');
    if (!document.getElementById('pv-bar').classList.contains('pv-open')) return;
    var main = document.querySelector('main') || document.body;
    var hs = [].slice.call(main.querySelectorAll('h1,h2,h3'));
    var firstH1 = hs.findIndex(function(e){ return e.tagName === 'H1'; });
    var badBefore = hs.slice(0, firstH1 < 0 ? hs.length : firstH1)
                      .filter(function(e){ return e.tagName === 'H2'; });
    var intro = document.querySelector('.tp-intro');
    var dl = intro.querySelectorAll('dl').length,
        dt = intro.querySelectorAll('dt').length,
        ol = intro.querySelectorAll('ol').length,
        li = intro.querySelectorAll('ol li').length;
    var verdict = badBefore.length
      ? '<span class="pv-no">⚠ 有 ' + badBefore.length + ' 個 h2 排在 h1 前面</span>（' +
        badBefore.map(function(e){ return e.textContent.trim(); }).join('、') + '）'
      : '<span class="pv-ok">✅ h1 是這一頁的第一個標題</span>';
    var chunk = (dl ? dl + ' 組問答（' + dt + ' 問）' : '<span class="pv-no">0 組問答</span>') +
                '、' + (ol ? ol + ' 個有序清單（' + li + ' 步）' : '<span class="pv-no">0 個清單</span>');
    var outline = hs.slice(0, 6).map(function(e){
      var t = e.textContent.trim().slice(0, 18);
      return '<li><span class="pv-tag">' + e.tagName.toLowerCase() + '</span>' + t + '</li>';
    }).join('');
    p.innerHTML =
      '<div>' + verdict + '</div>' +
      '<div style="margin-top:.25rem">可被整段擷取的區塊：' + chunk + '</div>' +
      '<div style="margin-top:.35rem">大綱（前 6 個）：</div><ul>' + outline + '</ul>' +
      '<div class="pv-hint">Ⓑ 與現況的差別只有標記，版面量起來應該完全一樣；Ⓒ 會把標題搬到上面。</div>';
  }

  document.addEventListener('click', function(ev){
    var b = ev.target.closest('.pv-b'); if (!b) return;
    if (b.id === 'pv-reset'){ st = { h:'0', q:'0', s:'0' }; apply(); return; }
    if (b.id === 'pv-toggle'){
      document.getElementById('pv-bar').classList.toggle('pv-open'); measure(); return;
    }
    if (b.dataset.k){ st[b.dataset.k] = b.dataset.v; apply(); }
  });
  apply();
})();
</script>
`;

  html = inject(html, style, bar, script);
  html = html.replace("<head>", "<head>\n" + NOTE_TOPIC);
  wr("preview/seo-fix-topic/index.html", html);
  return html;
}

/* ============================================================================
   ①＋③　文章頁
   ========================================================================== */
function buildPost() {
  const SLUG = "gum-bleeding";
  const raw = rd(`posts/${SLUG}/index.html`);

  /* ⚠ 麵包屑的 JSON-LD 在 SEO 區塊裡，而 previewize() 會把那一整塊換成 noindex ——
     所以要**先抄一份**給量測面板讀，不然面板會印「讀不到」。 */
  let bcJson = null;
  for (const m of raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const o = JSON.parse(m[1]);
      for (const n of o["@graph"] || [o]) if (n["@type"] === "BreadcrumbList") bcJson = n;
    } catch { /* 壞掉的就跳過 */ }
  }
  must(!!bcJson, "抄得到正式站那一份 BreadcrumbList");
  must(/#topics/.test(JSON.stringify(bcJson)), "正式站的麵包屑第 2 層確實指著 #topics");

  let html = previewize(raw, {
    url: `/posts/${SLUG}/`,
    title: "麵包屑與引用版位",
    desc: "提案頁：文章的科別麵包屑要不要接到著陸頁，以及外部權威來源擺哪裡。",
  });

  must(/<span class="post-tag" data-spec="perio">牙周照護<\/span>/.test(html),
    "找得到文章的 post-tag（span、帶 data-spec）");
  html = html.replace('<span class="post-tag" data-spec="perio">牙周照護</span>',
    '<span id="pv-crumb" class="post-tag" data-spec="perio">牙周照護</span>');

  /* ③ 的版位。⚠⚠ 網址**故意留空** —— 這個容器連不到 nhi.gov.tw、cda.org.tw、
     taop.org.tw、pubmed（curl 回 000、WebFetch 回 EGRESS_BLOCKED），
     沒查證過的網址不可以寫進醫療網站。這一頁要判斷的是**版位與錨點怎麼寫**。

     ⚠⚠ **只在內文那一段動手，不可以掃整頁**（CLAUDE.md 第九節第 4 條）。
       第一版用 indexOf 掃整份，兩個錨點分別命中了
       ① <head> 裡 og:description 的**屬性值**（整個 meta 被塞進一個 span），
       ② 底部「重點整理」的 <dd>（那裡的句子和內文很像）。
       兩個都不報錯、畫面也幾乎正常。 */
  const BODY_A = '<div class="post-body';
  const BODY_B = "<h2>重點整理</h2>";
  const bs = html.indexOf(BODY_A), be = html.indexOf(BODY_B);
  must(bs !== -1 && be > bs, "切得出內文那一段（post-body → 重點整理之前）");
  let body = html.slice(bs, be);

  /* ⚠ 錨點要連標籤一起寫死 —— 內文是「而這一步<strong>不可逆</strong>。」，
     只寫純文字的「而這一步不可逆」是找不到的（第一版就卡在這裡）。 */
  const CITES = [
    { after: "而這一步<strong>不可逆</strong>",
      text: "牙周病的分期與治療流程",
      src: "臺灣牙周病醫學會／牙醫師公會全聯會〈牙周病統合治療方案〉" },
    { after: "它有明確的階段",
      text: "健保給付的牙周基本處置",
      src: "衛生福利部中央健康保險署（牙周病治療給付項目）" },
  ];
  for (const c of CITES) {
    const i = body.indexOf(c.after);
    must(i !== -1, `內文裡找得到錨點「${c.after}」`);
    must(body.indexOf(c.after, i + 1) === -1, `錨點「${c.after}」在內文裡只出現一次`);
    /* 插在那一句的句尾標點後面，不是插在錨點後面 —— 不然會卡在句子中間 */
    let end = i + c.after.length;
    while (end < body.length && !"。：".includes(body[end])) end++;
    must(end < body.length, "找得到那一句的句尾");
    const slot = `<span class="pv-cite" data-src="${c.src}">${c.text}</span>`;
    body = body.slice(0, end + 1) +
      `<span class="pv-cwrap" hidden>（依據：${slot}）</span>` + body.slice(end + 1);
  }
  html = html.slice(0, bs) + body + html.slice(be);
  must((html.match(/class="pv-cwrap"/g) || []).length === CITES.length, "兩個版位都在，而且只有兩個");
  must(!/content="[^"]*pv-cwrap/.test(html), "沒有任何一個版位掉進屬性值裡");

  const style = `
<style>
.pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:var(--card,#fff);
  border-top:1px solid var(--rule,#dcdcd4);padding:.5rem .7rem calc(.5rem + env(safe-area-inset-bottom));
  font-size:.78rem;line-height:1.5;box-shadow:0 -6px 18px rgba(0,0,0,.08)}
.pv-row{display:flex;align-items:center;gap:.35rem;flex-wrap:nowrap;overflow-x:auto;margin:.22rem 0}
.pv-lb{flex:0 0 auto;color:var(--ink-soft,#5a5f57);min-width:4.1em}
.pv-b{flex:0 0 auto;border:1px solid var(--rule,#dcdcd4);background:transparent;color:inherit;
  border-radius:8px;padding:.2rem .5rem;font:inherit;cursor:pointer;white-space:nowrap}
.pv-b[aria-pressed="true"]{background:var(--accent-deep,#12656a);color:#fff;border-color:transparent}
.pv-now{margin-left:auto;flex:0 0 auto;border-style:dashed}
.pv-foot{display:flex;align-items:center;gap:.5rem;margin-top:.3rem}
.pv-hint{color:var(--ink-soft,#5a5f57);font-size:.72rem}
.pv-panel{display:none;margin-top:.4rem;padding-top:.4rem;border-top:1px dashed var(--rule,#dcdcd4);
  max-height:20vh;overflow:auto;font-size:.72rem}
.pv-bar.pv-open .pv-panel{display:block}
.pv-ok{color:#1a7a4a;font-weight:700}
.pv-no{color:#b4451f;font-weight:700}
body{padding-bottom:7.5rem}

/* ⚠ 這一條是這一輪量出來的坑：.crumbs a 的權重（0,2,0）贏過 .post-tag（0,1,0），
   span 換成 a 之後那顆藥丸的字會被染成 ink-soft。真的要改的時候這一條要一起帶。 */
.crumbs a.post-tag{color:#fff;text-decoration:none}
html[data-theme="dark"] .crumbs a.post-tag{color:#fff}
.crumbs a.post-tag:hover{text-decoration:none;filter:brightness(1.08)}

.pv-cwrap{color:var(--ink-soft,#5a5f57);font-size:.92em}
.pv-cite{color:var(--accent-deep,#12656a);border-bottom:1px dashed currentColor;cursor:help}
.pv-cite::after{content:"（網址待查證）";font-size:.85em;opacity:.75}
</style>
`;

  const bar = `
<div class="pv-bar" id="pv-bar">
  <div class="pv-row"><span class="pv-lb">科別那一格</span>
    <button class="pv-b" data-k="b" data-v="0">Ⓐ 現況（不能點）</button>
    <button class="pv-b" data-k="b" data-v="1">Ⓑ 接到著陸頁</button>
    <button class="pv-b" data-k="b" data-v="2">Ⓒ 接到著陸頁＋改用科別名</button></div>
  <div class="pv-row"><span class="pv-lb">外部引用</span>
    <button class="pv-b" data-k="c" data-v="0">Ⓐ 不放</button>
    <button class="pv-b" data-k="c" data-v="1">Ⓑ 句尾附註</button>
    <button class="pv-b pv-now" id="pv-reset">對照現況</button></div>
  <div class="pv-foot"><span class="pv-hint">引用的網址是空的 —— 這個容器連不到那些網站</span>
    <button class="pv-b" id="pv-toggle" style="margin-left:auto">量測</button></div>
  <div class="pv-panel" id="pv-panel"></div>
</div>
<script type="application/json" id="pv-bc">${JSON.stringify(bcJson)}</script>`;

  const script = `
<script>
(function(){
  var qs = new URLSearchParams(location.search);
  var st = { b:'0', c:'0' };
  Object.keys(st).forEach(function(k){
    var v = qs.get(k); if (v && /^[a-z0-9]+$/.test(v)) st[k] = v;
  });
  var slotHost = document.getElementById('pv-crumb').parentNode;

  function apply(){
    var cur = document.getElementById('pv-crumb');
    var want = st.b === '0' ? 'SPAN' : 'A';
    var label = st.b === '2' ? '牙周治療' : '牙周照護';
    var el = cur;
    if (cur.tagName !== want){
      el = document.createElement(want === 'A' ? 'a' : 'span');
      el.id = 'pv-crumb'; el.className = 'post-tag'; el.dataset.spec = 'perio';
      cur.parentNode.replaceChild(el, cur);
    }
    el.textContent = label;
    if (want === 'A') el.setAttribute('href', '/topics/perio/'); else el.removeAttribute('href');

    document.querySelectorAll('.pv-cwrap').forEach(function(w){ w.hidden = st.c !== '1'; });

    document.querySelectorAll('.pv-b[data-k]').forEach(function(b){
      b.setAttribute('aria-pressed', String(st[b.dataset.k] === b.dataset.v));
    });
    var u = new URL(location); Object.keys(st).forEach(function(k){ u.searchParams.set(k, st[k]); });
    history.replaceState(null, '', u);
    measure();
  }

  function measure(){
    var p = document.getElementById('pv-panel');
    if (!document.getElementById('pv-bar').classList.contains('pv-open')) return;
    var el = document.getElementById('pv-crumb');
    var isLink = el.tagName === 'A';
    /* ⚠ 讀的是抄自正式站的那一份（提案頁自己的 SEO 區塊已經換成 noindex 了）。 */
    var bc = null;
    try { bc = JSON.parse(document.getElementById('pv-bc').textContent); } catch(e){}
    var lvl2 = bc && bc.itemListElement && bc.itemListElement[1];
    var rows = [];
    rows.push(isLink
      ? '<span class="pv-ok">✅ 科別那一格是連結</span>，指向 ' + el.getAttribute('href')
      : '<span class="pv-no">⚠ 科別那一格是 span，點不下去</span>');
    rows.push('JSON-LD 麵包屑第 2 層：' +
      (lvl2 ? '「' + lvl2.name + '」→ ' + (lvl2.item || '（沒有 item）') : '（讀不到）') +
      (lvl2 && /#topics/.test(lvl2.item || '')
        ? ' <span class="pv-no">⚠ 指的是首頁錨點，不是著陸頁</span>'
        : ' <span class="pv-ok">✅</span>'));
    if (isLink && lvl2 && /#topics/.test(lvl2.item || ''))
      rows.push('<span class="pv-no">⚠ 兩邊要一起改</span> —— 畫面接上了，機器讀的還指著首頁。真的修的時候 tools/schema.mjs 那一行也要換。');
    var cites = document.querySelectorAll('.pv-cwrap:not([hidden])').length;
    rows.push('外部權威引用：' + (cites
      ? cites + ' 處（' + [].slice.call(document.querySelectorAll('.pv-cite'))
          .map(function(c){ return c.dataset.src; }).join('；') + '）'
      : '<span class="pv-no">0 處</span>　全站 15 篇裡 14 篇是 0'));
    /* ⚠ label 是 apply() 的區域變數，不要在這裡用 —— 第一版寫了，
       整個 measure() 丟 ReferenceError，面板變成空的一條（畫面完全正常，
       只有量它的高度才看得出來）。從畫面上讀回來才對。 */
    if (isLink) rows.push('改完以後第 2 層會是：「' + el.textContent + '」→ https://fangren.net/topics/perio/');
    rows.push('<span class="pv-hint">⚠ 上面那一行是從正式站抄過來的真值，這一頁沒有改它 —— 真的要改是 tools/schema.mjs 第 475 行。</span>');
    p.innerHTML = rows.map(function(r){ return '<div style="margin:.18rem 0">' + r + '</div>'; }).join('');
  }

  document.addEventListener('click', function(ev){
    var b = ev.target.closest('.pv-b'); if (!b) return;
    if (b.id === 'pv-reset'){ st = { b:'0', c:'0' }; apply(); return; }
    if (b.id === 'pv-toggle'){
      document.getElementById('pv-bar').classList.toggle('pv-open'); measure(); return;
    }
    if (b.dataset.k){ st[b.dataset.k] = b.dataset.v; apply(); }
  });
  apply();
})();
</script>
`;

  html = inject(html, style, bar, script);
  html = html.replace("<head>", "<head>\n" + NOTE_POST);
  wr("preview/seo-fix-post/index.html", html);
  return html;
}

/* ---------- 跑 ---------- */
const t = buildTopic();
const p = buildPost();

/* 出門前的守門 */
for (const [name, h] of [["著陸頁", t], ["文章頁", p]]) {
  must(/<meta name="robots" content="noindex, nofollow, noarchive">/.test(h), name + " 有 noindex");
  must(!/data-views-self/.test(h), name + " 沒有 data-views-self（計數器已降級）");
  must(!/<link rel="canonical"/.test(h), name + " 沒有 canonical");
  must(h.lastIndexOf('<div class="pv-bar"') > h.lastIndexOf("</main>"), name + " 切換條在 main 之後");
  /* 那幾支 inline script 編得過（map-bays 那一輪的守門） */
  for (const m of h.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
}
console.log("✓ " + ok.length + " 道守門都過了");
console.log("  preview/seo-fix-topic/index.html  " + (t.length / 1024).toFixed(0) + "KB");
console.log("  preview/seo-fix-post/index.html   " + (p.length / 1024).toFixed(0) + "KB");
