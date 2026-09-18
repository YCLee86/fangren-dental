// 「33 巷過了永樂街那一條更窄的巷子」的提案頁 —— 站上那張簡易地圖，
// 永樂街～永安路那一欄多切一條比 33 巷更窄的巷子。
//
//   node tools/map-alley-preview.mjs   →  preview/map-alley-east/index.html
//
// ⚠⚠ 這一頁是 index.html 的**完整複本**，所以 CLAUDE.md 第八節那四件全部照做：
//    (1) 相對路徑往上兩層（不用 base href，那會讓 #topics 這種錨點跳回首頁）
//    (2) 計數器**降級**不是拿掉：data-views-self → data-views
//        —— 只有 -self 會 POST +1，所以「不灌計數」與「印得出真數字」同時成立
//    (3) 切換條要用 lastIndexOf 找最後那個結束標籤才插（這一站的註解裡就寫著它）
//    (4) 樣式要放進 head，塞在頁尾的話關著的東西會在開頁那 180ms 閃出來
//
// ⚠⚠ **街廓是真的兩塊 rect，不是在街廓上蓋一條路面色的長條** ——
//    站上每一塊街廓都有 rx=4 的圓角（2026-08-14 使用者指定），蓋一條長條的話
//    巷子兩側會是直角，那就不是「照站上那張圖的畫法」，而是一張看起來很像的假圖。
//    所以這一頁把那一欄原本那塊 rect 換成上下兩塊，尺一動就由 JS 改它們的 y/height。
//
// ⚠ 座標全部是站上那張圖的 viewBox 使用者單位（0 0 560 620）：
//    永樂街 324~354、永安路 455~487、那一欄的街廓 354~455、
//    33 巷那一條 321~333（寬 12、中心 327）。
//
// ⚠ class 一律 pv 前綴（第八節：短名字幾乎一定會和站上的撞名）。
// ⚠ 顏色一個都沒新增，連一條 CSS 都沒有動到地圖 —— 改的只有兩塊街廓的 y/height。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const src = readFileSync(new URL('index.html', ROOT), 'utf8');
let h = src;

const must = (cond, msg) => { if (!cond) throw new Error(msg); };

/* ---- 1. 相對路徑往上兩層 ------------------------------------------------ */
h = h.replace(/(\s(?:href|src)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
h = h.replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)assets\//g, '$1../../assets/')}"`);
h = h.replace(/url\((["']?)assets\//g, 'url($1../../assets/');
{
  const n = (h.match(/href="\.\/"/g) || []).length;
  must(n, '找不到 href="./"（回首頁那個連結）');
  h = h.replace(/href="\.\/"/g, 'href="../../"');
}

/* ---- 2. 計數器降級（不是拿掉）------------------------------------------ */
{
  const n = (h.match(/data-views-self=/g) || []).length;
  must(n, '找不到 data-views-self —— 計數器的掛勾換過名字了？');
  h = h.replace(/data-views-self=/g, 'data-views=');
}

/* ---- 3. noindex --------------------------------------------------------- */
{
  const a = '<meta charset="utf-8">';
  must(h.includes(a), '找不到 charset');
  h = h.replace(a, a + '\n<meta name="robots" content="noindex, nofollow, noarchive">');
}

/* ---- 3.5 推導（定案之後這一段搬進 history/）------------------------------ */
const DERIV = `
<!-- =====================================================================
     提案：平和街33巷過了永樂街那一條更窄的巷子（2026-09-18 開）

     起點 —— 使用者拿 Google 地圖的空照截圖（2436×1125）：
       「網站上的地圖調整　仔細看平和街33巷過了永樂街，
         有一條更窄的既有道路連通到永安路」

     現況（viewBox 0 0 560 620 的使用者單位）
       ・永樂街～永安路那一欄的街廓是**一整塊**：x 354~455、y 197~403
         （北邊接永安路14巷、南邊接大同路）
       ・33 巷那一條只切「平和街～永樂街」那一欄：y 321~333（寬 12、中心 327），
         過了永樂街就停住
       ・站上的路寬分三族：主要道路 38~46（大同路 38、中華路 46）、
         街 30~32（平和街、永樂街、永安路）、巷 12~17（19 巷 17、14 巷 17、
         33 巷 12、文化路北邊那條沒有名字的小巷 12）
         → **站上最窄的就是 12**，所以「更窄」＝ 要開一個比 12 更小的階

     那張截圖上量到的
       ・永樂街中心 x≈1300、永安路中心 x≈2025 → 1 個 viewBox 單位 ≈ 5.5 個截圖像素
       ・Google 自己畫的 33 巷路帶（半透明灰）在 x≈1330 就收成一個圓頭 ——
         **它的圖資裡 33 巷過了永樂街就沒有了**。所以使用者說的是「地上有、
         圖資沒有」的那一種，他叫我「仔細看」的是空照影像不是路名。
       ・旁證在自己家的檔案裡：drafts/door-notice/parking-survey.json 那一輪
         使用者現地走過，「平和街33巷 整條 約 230 m」；而同一份清查裡
         文化路第 9 段（永樂街 → 平和街）約 100 m、大同路第 7 段
         （永樂街 → 永安路）約 85 m —— 兩段加起來 185 m，**比 230 m 短**。
         33 巷確實比「只到永樂街」長得多。

     量不到的（所以做成尺，不是送一個我估的值）
       ・那條巷子**實際多寬**、以及**到底齊不齊 33 巷**。
         那張截圖上 1 個 viewBox 單位只有 5.5 px，巷子本身在圖上只有幾個像素，
         而且是斜照的 3D 影像（房子會倒），逐像素放大到底還是糊的。
       → 三條尺：這一條有沒有（對照現況）／多寬（6・8・10・12）／
         中心齊不齊 33 巷（往北 8・齊・往南 8）。預設 8 ＋ 齊 33 巷。

     畫法
       ・**街廓是真的兩塊 rect，不是在街廓上蓋一條路面色的長條** ——
         站上每一塊街廓都有 rx=4 的圓角，蓋長條的話巷子兩側會是直角，
         那就不是站上那張圖的畫法。
       ・顏色一個都沒新增，地圖的 viewBox、其餘座標、CSS、JS、停車格那一段
         一個字都沒動。驗收：切到「沒有（對照現況）」時，390／375／430／834／1440
         五個寬度 × DPR 3 對站上**逐像素 0 個有差**。

     定案要做的
       1. index.html 那一塊 rect x=354 y=197 width=101 height=206 換成上下兩塊
       2. node tools/topics.mjs（七科的著陸頁是 index.html 的快照）
       3. node tools/build.mjs
       4. 門口那張停車告示與商家貼文的地圖圖都是**讀 index.html 畫的**，
          要跟著重跑：drafts/door-notice/gen.mjs、drafts/channels/post-map-door.mjs
       5. node tools/night-mode.mjs 只改顏色不改座標，這一輪不必跑（但可以 check）

     還沒問到的
       ・那條巷子有沒有名字（Google 上沒有標）—— 站上已經有兩條沒有名字的巷子
         （文化路北邊那條、19 巷北邊那條平行巷），不標是有前例的。
       ・空照圖上另外看得到一條**南北向**的窄巷，落在這一欄的中間
         （換算約 viewBox x≈388、寬約 7），從這一條往北通。要不要一起畫還沒問。
===================================================================== -->`;
{
  const a = '<meta name="robots" content="noindex, nofollow, noarchive">';
  must(h.includes(a), '找不到剛插進去的 noindex');
  h = h.replace(a, a + '\n' + DERIV);
}

/* ---- 4. 那一欄的街廓換成上下兩塊 ---------------------------------------- */
/* 站上那一塊是「永樂街～永安路」從 14 巷以南到大同路以北的整塊（y 197~403）。 */
const BLOCK = '<rect x="354" y="197" width="101" height="206" rx="4"/>';
{
  const n = (h.match(new RegExp(BLOCK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  must(n === 1, '找不到（或找到不只一塊）永樂街～永安路那一塊街廓：' + n);
  h = h.replace(BLOCK,
    '<!-- 提案：33 巷過了永樂街那一條（tools/map-alley-preview.mjs 產生，不要手改）'
    + ' —— 原本是一塊 rect x=354 y=197 width=101 height=206 -->'
    + '<rect id="pv-blk-n" x="354" y="197" width="101" height="126" rx="4"/>'
    + '<rect id="pv-blk-s" x="354" y="331" width="101" height="72" rx="4"/>');
}

/* ---- 5. 樣式（只有切換條，地圖一條都沒動）------------------------------ */
const css = [
'<style>',
'/* ===== 提案：33 巷過了永樂街那一條 ==================================',
'   這一段只畫切換條與面板。地圖本身一個顏色、一條規則都沒有動 ——',
'   改的只有兩塊街廓的 y 與 height，由底下那支腳本寫。',
'   切換條在手機上不能吃掉半個畫面（第八節），所以「收起」是右下角一顆小的。 */',
'.pv-bar {',
'  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;',
'  background: rgba(20,20,20,.94); color: #f4f4f5;',
'  font: 12px/1.45 system-ui, sans-serif;',
'  padding: .35rem .6rem calc(.35rem + env(safe-area-inset-bottom, 0px));',
'  max-height: 46vh; overflow: auto;',
'}',
'.pv-bar[hidden] { display: none !important; }',
'.pv-row { display: flex; flex-wrap: wrap; align-items: center; gap: 3px; margin-bottom: 2px; }',
'.pv-row > b { flex: 0 0 3.6em; font-weight: 400; opacity: .72; font-size: 11px; }',
'.pv-row button {',
'  font: inherit; font-size: 11.5px; padding: 2px 7px; border-radius: 6px; cursor: pointer;',
'  background: transparent; color: #f4f4f5; border: 1px solid rgba(244,244,245,.35);',
'}',
'.pv-row button[aria-pressed="true"] { background: #f4f4f5; color: #1a1a1a; border-color: #f4f4f5; }',
'#pv-hide { position: absolute; top: 3px; right: 6px; font: 11px/1 system-ui, sans-serif;',
'  padding: 4px 7px; border-radius: 6px; background: transparent; color: #f4f4f5;',
'  border: 1px solid rgba(244,244,245,.35); cursor: pointer; }',
'.pv-panel { font-size: 10.5px; line-height: 1.4; opacity: .82;',
'  border-top: 1px solid rgba(244,244,245,.2); margin-top: 4px; padding-top: 4px; white-space: pre-wrap; }',
'.pv-mini { position: fixed; right: 10px; bottom: calc(10px + env(safe-area-inset-bottom, 0px)); z-index: 91;',
'  font: 12px/1 system-ui, sans-serif; padding: 8px 11px; border-radius: 9px; cursor: pointer;',
'  background: rgba(20,20,20,.94); color: #f4f4f5; border: 0; }',
'</style>',
].join('\n');
{
  const a = '</head>';
  const i = h.indexOf(a);
  must(i !== -1, '找不到 head 的結尾');
  h = h.slice(0, i) + css + '\n' + h.slice(i);
}

/* ---- 6. 切換條 ＋ 腳本 -------------------------------------------------- */
/* ⚠ 三條尺（第九節第 28 條 ①：版面的事要給一把尺，不要送一個我估的值）：
     這一條有沒有（對照現況）／多寬／中心落在哪。
   ⚠ 「多寬」的預設是 8：站上最窄的巷子是 12（33 巷與平行巷），
     所以「更窄」在這張圖上就是要開一個比 12 更小的階。
   ⚠ 「位置」預設齊 33 巷 —— 使用者的原話是「33 巷過了永樂街」，
     直直過去是最直接的讀法；但那張截圖上量不到它到底偏不偏，所以留一把尺。 */
const ROWS = [
  ['on', '這一條', [['1', '有'], ['0', '沒有（對照現況）']]],
  ['w',  '多寬',   [['6', '6'], ['8', '8'], ['10', '10'], ['12', '12（同 33 巷）']]],
  ['y',  '位置',   [['319', '往北 8'], ['327', '齊 33 巷'], ['335', '往南 8']]],
];
const bar =
'<button class="pv-mini" type="button" id="pv-open" hidden>提案</button>\n' +
'<div class="pv-bar" id="pv-bar">\n' +
'  <button type="button" id="pv-hide">收起</button>\n' +
ROWS.map(([k, label, opts]) =>
  '  <div class="pv-row" data-k="' + k + '"><b>' + label + '</b>' +
  opts.map(([v, t]) => '<button type="button" data-v="' + v + '">' + t + '</button>').join('') +
  '</div>').join('\n') +
'\n  <div class="pv-panel" id="pv-panel">量測中…</div>\n' +
'</div>\n';

const script = [
'<script>',
'(function () {',
'  /* 站上那張圖的固定座標（viewBox 使用者單位）*/',
'  var TOP = 197, BOT = 403, X0 = 354, X1 = 455;   /* 那一欄的街廓：14 巷以南 ~ 大同路以北 */',
'  var A33 = { y0: 321, y1: 333 };                 /* 33 巷那一條 */',
'  var DEF = { on: "1", w: "8", y: "327" };',
'',
'  var root = document.documentElement, q = new URLSearchParams(location.search);',
'  var st = {};',
'  /* ⚠ 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到帶數字的值（第九節）*/',
'  Object.keys(DEF).forEach(function (k) {',
'    var v = q.get(k);',
'    st[k] = (v && /^[a-z0-9]+$/.test(v)) ? v : DEF[k];',
'  });',
'',
'  var n = document.getElementById("pv-blk-n");',
'  var s = document.getElementById("pv-blk-s");',
'  var svg = document.querySelector("svg.map-svg");',
'  var win = document.querySelector(".map-win");',
'  var panel = document.getElementById("pv-panel");',
'',
'  function geom() {',
'    var w = +st.w, c = +st.y;',
'    if (st.on !== "1") return { w: 0, c: c, y0: BOT, y1: BOT };',
'    return { w: w, c: c, y0: c - w / 2, y1: c + w / 2 };',
'  }',
'',
'  function paint() {',
'    var g = geom();',
'    n.setAttribute("y", TOP);',
'    n.setAttribute("height", Math.max(0, g.y0 - TOP));',
'    s.setAttribute("y", g.y1);',
'    s.setAttribute("height", Math.max(0, BOT - g.y1));',
'    [].slice.call(document.querySelectorAll(".pv-row")).forEach(function (row) {',
'      var k = row.getAttribute("data-k");',
'      [].slice.call(row.querySelectorAll("button")).forEach(function (b) {',
'        b.setAttribute("aria-pressed", b.getAttribute("data-v") === st[k] ? "true" : "false");',
'      });',
'    });',
'    measure();',
'  }',
'',
'  /* 螢幕 px 與 viewBox 使用者單位的比例尺 —— 現場量，不要寫死。',
'     手機是 slice，左右會被裁掉，所以順便算出「現在看得到 x 的哪一段」。 */',
'  function scale() {',
'    var m = svg.getScreenCTM();',
'    if (!m) return null;',
'    /* ⚠ 電腦版 .map-win 是 display:contents（沒有盒子），getBoundingClientRect 回 0 ——',
'       量到的可見範圍會變成 -560 ~ -560。那一邊要改量 svg 自己（同 map-bays 那一輪）。 */',
'    var r = (win && win.getBoundingClientRect().width) ? win.getBoundingClientRect() : svg.getBoundingClientRect();',
'    var inv = m.inverse();',
'    var p1 = svg.createSVGPoint(), p2 = svg.createSVGPoint();',
'    p1.x = r.left; p1.y = r.top; p2.x = r.right; p2.y = r.bottom;',
'    var A = p1.matrixTransform(inv), B = p2.matrixTransform(inv);',
'    return { k: m.a, x0: A.x, x1: B.x, y0: A.y, y1: B.y };',
'  }',
'',
'  function measure() {',
'    var g = geom(), sc = scale(), L = [];',
'    var px = function (u) { return sc ? (u * sc.k).toFixed(2) + "px" : "—"; };',
'    if (g.w) {',
'      L.push("這一條 " + g.w + " 單位（畫出來 " + px(g.w) + "）・長 " + (X1 - X0) + "（永樂街 → 永安路）");',
'      L.push("\\n33 巷 12 單位（" + px(12) + "）→ 這一條是它的 " + (g.w / 12 * 100).toFixed(0) + "%");',
'      L.push("\\n中心 " + g.c + "（33 巷 327，差 " + (g.c - 327) + "）・" + g.y0 + "~" + g.y1 + "・上下街廓 " + (g.y0 - TOP) + "／" + (BOT - g.y1));',
'    } else {',
'      L.push("對照現況：那一欄仍然是一整塊 " + TOP + "~" + BOT + "（高 " + (BOT - TOP) + "）");',
'    }',
'    if (sc) {',
'      var vis = (g.w === 0) || (X0 >= sc.x0 - 0.5 && X1 <= sc.x1 + 0.5);',
'      L.push("\\n這個寬度看得到 x " + sc.x0.toFixed(0) + "~" + sc.x1.toFixed(0) + "（手機是 slice）→ " + X0 + "~" + X1 + (vis ? " 整條都在 ✓" : " ⚠ 被裁掉一截"));',
'    }',
'    var ow = document.documentElement.scrollWidth - document.documentElement.clientWidth;',
'    L.push("\\n" + (g.w ? "離合廷下緣 " + (g.y0 - 273) + "・離最上面那格停車格 " + (375 - g.y1) + "・" : "") + "溢出 " + (ow > 0 ? ow + "px ⚠" : "0 ✓") + "・JS 錯 " + ERR);',
'    panel.textContent = L.join("");',
'  }',
'',
'  var ERR = 0;',
'  window.addEventListener("error", function () { ERR++; });',
'',
'  [].slice.call(document.querySelectorAll(".pv-row button")).forEach(function (b) {',
'    b.addEventListener("click", function () {',
'      var k = b.parentNode.getAttribute("data-k");',
'      st[k] = b.getAttribute("data-v");',
'      paint();',
'    });',
'  });',
'',
'  var bar = document.getElementById("pv-bar"), mini = document.getElementById("pv-open");',
'  document.getElementById("pv-hide").addEventListener("click", function () {',
'    bar.hidden = true; mini.hidden = false;',
'  });',
'  mini.addEventListener("click", function () { bar.hidden = false; mini.hidden = true; });',
'',
'  paint();',
'  window.addEventListener("load", measure);',
'  window.addEventListener("resize", measure);',
'})();',
'<\/script>',
].join('\n');

{
  const i = h.lastIndexOf('</body>');
  must(i !== -1, '找不到最後那個 body 結尾');
  h = h.slice(0, i) + bar + script + '\n' + h.slice(i);
}

/* ---- 7. 守門 ------------------------------------------------------------ */
{
  must(!h.includes('data-views-self'), '計數器沒有降級乾淨');
  must(h.includes('name="robots" content="noindex'), 'noindex 沒有插進去');
  must((h.match(/id="pv-blk-n"/g) || []).length === 1, 'pv-blk-n 不是剛好一個');
  must((h.match(/id="pv-blk-s"/g) || []).length === 1, 'pv-blk-s 不是剛好一個');
  must(!h.includes(BLOCK), '原本那塊街廓還在');
  /* 切換條一定要落在最後那個 body 結尾之前（不是註解裡那一個）*/
  const ib = h.lastIndexOf('</body>');
  must(h.indexOf('id="pv-bar"') < ib && h.indexOf('id="pv-bar"') !== -1, '切換條沒有插在頁尾');
  must(h.indexOf('id="pv-bar"') > h.indexOf('</head>'), '切換條掉進 head 裡了');
  /* 那支 inline 腳本要編得過（map-bays 那一輪的守門：不編一次就會靜靜地壞掉）*/
  const body = script.replace(/^<script>\n/, '').replace(/\n<\/script>$/, '').replace('<\\/script>', '');
  // eslint-disable-next-line no-new-func
  new Function(body);
}

mkdirSync(new URL('preview/map-alley-east/', ROOT), { recursive: true });
writeFileSync(new URL('preview/map-alley-east/index.html', ROOT), h);
console.log('寫好了 preview/map-alley-east/index.html（' + (h.length / 1024).toFixed(1) + ' KB）');
