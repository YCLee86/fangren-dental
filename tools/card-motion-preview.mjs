#!/usr/bin/env node
/* 提案頁產生器：首頁的文章圖卡要不要也加上 HERO 那組動態（2026-09-21）
 *
 *   node tools/card-motion-preview.mjs        產生 preview/card-motion/index.html
 *
 * 起點：〈隱形矯正〉的文章頁 HERO 已經上線（驚嘆號依序亮 ＋ 警告標示放大縮小），
 * 使用者接著問「首頁的文章圖卡也能呈現嗎」。量過之後答案是可以，而且零成本 ——
 * 卡片用的就是同一批 HERO 圖、同一份 srcset，連顯示尺寸都幾乎一樣
 * （卡片 360×203、文章頁 362×202，390 的手機上）。
 *
 * 這一頁要判斷的不是「做不做得到」，是**一排靜止的卡裡有一張在動會不會突兀**。
 * 所以切換條只有一支尺（不動／只有驚嘆號／和文章頁一樣）＋ 一顆模擬 hover。
 *
 * ⚠⚠ 這一頁是 index.html 的完整複本，CLAUDE.md 第八節那四件都做了：
 *   ① 相對路徑往上兩層（assets/ → ../../assets/，posts/ 與 topics/ 改成絕對路徑）
 *   ② data-views-self 降成 data-views —— 只有 -self 會 POST +1，所以
 *      「不灌計數」與「印得出真數字」同時成立，也沒有任何假數字可以被搬回正式站
 *      （chip-carry 那一輪的做法，比整支剝掉 counter.js 好）
 *   ③ 切換條插在**最後一個** </body> 前面（用 lastIndexOf —— 這一站的註解裡
 *      就寫著那幾個字，String.replace 會換到註解裡那一個）
 *   ④ preview/ 已經在 tools/dist.mjs 的 OPTIONAL 裡
 *   另外把 <meta name="robots"> 換成 noindex。
 *
 * ⚠ 疊層的 CSS **不在這一頁裡**：.hero-fx-blip / .hero-fx-err 已經上線在
 *   assets/style.css，這份快照連的就是同一支，所以動的規格與正式站一模一樣。
 *   這一頁只補「卡片才需要」的三條（外框、hover 一起縮放、座標微調）。
 *
 * ⚠ main 被另一台推過東西的話要重跑這一支，快照才會跟上（所以它進版控，
 *   不放暫存區）。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "index.html");
const OUT_DIR = path.join(ROOT, "preview", "card-motion");
const OUT = path.join(OUT_DIR, "index.html");

/* 要加疊層的那一張卡。⚠ 寫死 slug，不要用「第一張」或「當頁那一科」——
   首頁依上架日排序，新發一篇文章順序就變了（DECISIONS.md 第 25 條的近親）。 */
const SLUG = "aligner-simulation";

let s = fs.readFileSync(SRC, "utf8");
const before = s.length;

/* ---------- ① 相對路徑 ---------------------------------------------------- */
s = s.replace(/(["'(\s])assets\//g, "$1../../assets/");
s = s.replace(/(href=")(posts|topics|history|admin)\//g, "$1/$2/");
s = s.replace(/(href=")index\.html/g, "$1/");

/* ---------- ② 計數器降級（不灌數字，但仍印得出真值） ---------------------- */
s = s.replace(/data-views-self=/g, "data-views=");

/* ---------- noindex ------------------------------------------------------- */
s = s.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
if (!/noindex/.test(s)) throw new Error("robots 那一行沒換到 —— 首頁的 SEO 區塊格式變了嗎");

/* ---------- ③ 把那一張卡的 <picture> 包起來、後面接疊層 -------------------- */
const cardRe = new RegExp(
  '(<a class="card" href="/posts/' + SLUG + '/"[^>]*>\\s*)(<picture>[\\s\\S]*?<\\/picture>)');
const m = cardRe.exec(s);
if (!m) throw new Error("找不到 " + SLUG + " 那張卡 —— 首頁卡片的格式變了嗎");

/* 疊層的圖要和卡片抓到同一個檔：srcset／sizes／loading 直接從那張卡複製，
   不要自己重寫（重寫過一次就會兩邊不一樣，然後多載一份圖）。 */
const pic = m[2];
const overlay =
  '<span class="pv-shot">' + pic +
  '\n          <span class="pv-card-err" aria-hidden="true">' +
  pic.replace(/class="card-thumb"/, 'class="pv-card-img"').replace(/ alt="[^"]*"/, ' alt=""') +
  '</span>' +
  '\n          <svg class="pv-card-fx" viewBox="0 0 800 450" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
  '\n            <defs><radialGradient id="pvcGlow">' +
  '<stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>' +
  '<stop offset=".55" stop-color="#ffffff" stop-opacity=".45"/>' +
  '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
  '</radialGradient></defs>' +
  blips() +
  '\n          </svg>' +
  '\n        </span>';
s = s.slice(0, m.index) + m[1] + overlay + s.slice(m.index + m[0].length);

/* 五個驚嘆號。座標是文章頁那一組（800 × 445.6 的使用者座標）換算過來的：
   卡片是 16/9 的 object-fit: cover，實測**左右各裁掉 0.59~0.69%、上下 0%**，
   所以 x 要除以 0.988、y 不動。換算之後橫向差 0.2px —— 小到看不出來，
   但還是算對的值寫進去，免得日後有人以為可以不管裁切。 */
function blips() {
  const pts = [[226, 91], [354, 95], [314, 126], [199, 161], [261, 186]];
  return pts.map(([x, y], i) => {
    const cx = (x / 800 - 0.0059) / 0.9882 * 800;
    const cy = y / 445.6 * 450;
    return '\n            <circle class="hero-fx-blip pv-blip" style="--ox:' + cx.toFixed(1) +
      'px; --oy:' + cy.toFixed(1) + 'px; --i:' + i + '" cx="' + cx.toFixed(1) +
      '" cy="' + cy.toFixed(1) + '" r="12.1" fill="url(#pvcGlow)"/>';
  }).join("");
}

/* ---------- 只有卡片才需要的那幾條樣式 ------------------------------------ */
const CSS = [
'<style id="pv-card-css">',
'/* 提案頁自己的樣式。⚠ class 一律 pv- 前綴 —— 這是 index.html 的完整複本，',
'   站上有的名字全部都在，短名字幾乎一定會撞（hero-motion 那一輪踩過 .foot）。',
'   疊層本身的規格不在這裡，走上線那一支樣式表裡的 .hero-fx-* —— 規格只有一份。',
'   ⚠ 這一段註解刻意不寫那支樣式表的相對路徑：產生器有一道守門在掃',
'     「還有沒有沒改到的相對路徑」，寫下去會被它抓到。 */',
'',
'/* 外框：圖與疊層擺在同一個盒子裡，hover 的放大搬到這一層 ——',
'   ⚠⚠ 不搬的話桌機上滑過去那一刻兩層會錯開，警告標示會浮到旁邊去。 */',
'.pv-shot { display: block; position: relative; transition: transform .5s cubic-bezier(.22,.61,.36,1); }',
'.card:hover .pv-shot, .card.pv-hover .pv-shot { transform: scale(1.05); }',
'.pv-shot .card-thumb { transition: none; }',
'.card:hover .pv-shot .card-thumb, .card.pv-hover .pv-shot .card-thumb { transform: none; }',
'',
'/* 放大縮小的那一塊。座標與遮罩尺寸是文章頁那一組除以 0.988（卡片左右各裁 0.59%）。',
'   ⚠ 這裡刻意沿用 .hero-fx-err 的動畫（速度中 2 秒、幅度 1.208），',
'     只換遮罩的位置與大小 —— 規格要和正式站同一份，不要在這裡另外調。 */',
'.pv-card-err {',
'  position: absolute; inset: 0; display: block; pointer-events: none;',
'  -webkit-mask-image: radial-gradient(ellipse 6.48% 8.2% at 53.05% 20.65%, #000 78%, transparent 100%);',
'          mask-image: radial-gradient(ellipse 6.48% 8.2% at 53.05% 20.65%, #000 78%, transparent 100%);',
'  transform-origin: 53.05% 20.65%;',
'  animation: heroFxErr 2s ease-in-out infinite;',
'}',
'.pv-card-img { width: 100%; height: 100%; aspect-ratio: auto; object-fit: cover; display: block; }',
'.pv-card-fx { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }',
'</style>',
'',
'<!-- 底下這一整塊是提案頁自己的（切換條、量測面板、三格的開關），',
'     定案上線的話一行都不會帶過去。量測面板算的位元組刻意不含這一塊。 -->',
'<style>',
'/* 切換條的三格 */',
'html[data-cm="a"] .pv-card-err, html[data-cm="a"] .pv-card-fx { display: none; }',
'html[data-cm="b"] .pv-card-err { display: none; }',
'',
'/* ---- 切換條 ---- */',
'.pvbar {',
'  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;',
'  background: rgba(244,244,245,.96); border-top: 1px solid var(--rule);',
'  backdrop-filter: blur(8px); padding: .5rem 12px calc(.5rem + env(safe-area-inset-bottom));',
'  font-size: .8rem; color: var(--ink);',
'}',
'.pvbar .pvin { max-width: 780px; margin: 0 auto; }',
'.pvrow { display: flex; flex-wrap: wrap; align-items: center; gap: .3rem; margin-bottom: .34rem; }',
'.pvrow:last-child { margin-bottom: 0; }',
'.pvlab { color: var(--ink-soft); font-size: .76rem; }',
'.pvbar button {',
'  font: inherit; font-size: .78rem; line-height: 1.5; padding: .16rem .52rem;',
'  border-radius: 999px; border: 1px solid var(--rule); background: var(--note);',
'  color: var(--ink-soft); cursor: pointer; white-space: nowrap;',
'}',
'.pvbar button[aria-pressed="true"] { background: var(--teal); border-color: var(--teal); color: #fff; }',
'.pvpanel { margin-top: .3rem; padding-top: .3rem; border-top: 1px dashed var(--rule);',
'  font-size: .67rem; line-height: 1.38; color: var(--ink-soft); display: none; max-height: 32vh; overflow: auto; }',
'html[data-cmp="1"] .pvpanel { display: block; }',
'.pvpanel b { color: var(--ink); }',
'.pvgrid { display: grid; grid-template-columns: auto 1fr; gap: 0 .5rem; }',
'.pvgrid > div:nth-child(odd) { white-space: nowrap; }',
'html[data-cmbar="0"] .pvbar .pvin > *:not(.pvmini) { display: none; }',
'.pvmini { display: none; } html[data-cmbar="0"] .pvmini { display: flex; justify-content: flex-end; }',
'body { padding-bottom: 150px; }',
'</style>'
].join("\n");

s = s.replace("</head>", CSS + "\n</head>");

/* ---------- 切換條 ＋ 量測面板 -------------------------------------------- */
const BAR = [
'<div class="pvbar">',
'  <div class="pvin">',
'    <div class="pvrow">',
'      <span class="pvlab">文章圖卡</span>',
'      <button data-v="a">Ⓐ 不動（現況）</button>',
'      <button data-v="b">Ⓑ 只有驚嘆號</button>',
'      <button data-v="c">Ⓒ 和文章頁一樣</button>',
'    </div>',
'    <div class="pvrow">',
'      <button id="pvh">模擬滑鼠移上去</button>',
'      <button id="pvm">量測</button>',
'      <button id="pvx">收起</button>',
'      <span class="pvlab">只有〈隱形矯正〉那一張</span>',
'    </div>',
'    <div class="pvpanel"><div class="pvgrid" id="pvo"></div></div>',
'    <div class="pvrow pvmini"><button id="pvs">切換條</button></div>',
'  </div>',
'</div>',
'<script>',
'(function () {',
'  var root = document.documentElement;',
'  var st = { cm: "c", cmp: "0", cmbar: "1", cmh: "0" };',
'  /* 網址參數的正規式一定要寫 [a-z0-9]+ —— 寫成 [a-z]+ 會吃不到 "0"/"1" 這種值，',
'     比對失敗之後會悄悄退回預設，等於參數沒作用（DECISIONS.md 那一條踩過）。 */',
'  var q = location.search.slice(1).split("&");',
'  for (var i = 0; i < q.length; i++) {',
'    var mm = /^([a-z]+)=([a-z0-9]+)$/.exec(q[i]);',
'    if (mm && st.hasOwnProperty(mm[1])) st[mm[1]] = mm[2];',
'  }',
'  function card() { return document.querySelector(".pv-shot") ? document.querySelector(".pv-shot").closest(".card") : null; }',
'  function apply() {',
'    root.setAttribute("data-cm", st.cm);',
'    root.setAttribute("data-cmp", st.cmp);',
'    root.setAttribute("data-cmbar", st.cmbar);',
'    var c = card(); if (c) c.classList.toggle("pv-hover", st.cmh === "1");',
'    var bs = document.querySelectorAll(".pvbar button[data-v]");',
'    for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-v") === st.cm ? "true" : "false");',
'    document.getElementById("pvh").setAttribute("aria-pressed", st.cmh === "1" ? "true" : "false");',
'    document.getElementById("pvm").setAttribute("aria-pressed", st.cmp === "1" ? "true" : "false");',
'    var keep = []; for (var k in st) keep.push(k + "=" + st[k]);',
'    history.replaceState(null, "", location.pathname + "?" + keep.join("&"));',
'  }',
'  document.querySelector(".pvbar").addEventListener("click", function (e) {',
'    var b = e.target.closest ? e.target.closest("button") : null; if (!b) return;',
'    if (b.hasAttribute("data-v")) { st.cm = b.getAttribute("data-v"); apply(); return; }',
'    if (b.id === "pvh") { st.cmh = st.cmh === "1" ? "0" : "1"; apply(); return; }',
'    if (b.id === "pvm") { st.cmp = st.cmp === "1" ? "0" : "1"; apply(); measure(); return; }',
'    if (b.id === "pvx") { st.cmbar = "0"; apply(); return; }',
'    if (b.id === "pvs") { st.cmbar = "1"; apply(); return; }',
'  });',
'  var fps = 0, fr = 0, last = performance.now();',
'  (function t(now) { fr++; if (now - last >= 500) { fps = Math.round(fr * 1000 / (now - last)); fr = 0; last = now; } requestAnimationFrame(t); })(performance.now());',
'  function bytes(x) { return new Blob([x]).size; }',
'  function measure() {',
'    if (st.cmp !== "1") return;',
'    var shot = document.querySelector(".pv-shot");',
'    var thumb = shot ? shot.querySelector(".card-thumb") : null;',
'    var over = shot ? shot.querySelector(".pv-card-err") : null;',
'    var fx = shot ? shot.querySelector(".pv-card-fx") : null;',
'    var css = document.getElementById("pv-card-css");',
'    var addHtml = (over ? bytes(over.outerHTML) : 0) + (fx ? bytes(fx.outerHTML) : 0);',
'    var addCss = css ? bytes(css.textContent) : 0;',
'    var add = addHtml + addCss;',
'    var urls = {}, imgBytes = 0;',
'    var res = performance.getEntriesByType("resource");',
'    for (var i = 0; i < res.length; i++) if (/hero-aligner/.test(res[i].name)) {',
'      urls[res[i].name.split("/").pop()] = (urls[res[i].name.split("/").pop()] || 0) + 1;',
'      imgBytes += res[i].encodedBodySize || 0;',
'    }',
'    var names = Object.keys(urls);',
'    var t1 = thumb ? thumb.getBoundingClientRect() : null;',
'    var t2 = over ? over.getBoundingClientRect() : null;',
'    var shown = over && getComputedStyle(over).display !== "none";',
'    var gap = (t1 && t2 && shown) ? Math.round(Math.abs(t2.left - t1.left)) : null;',
'    var rows = [',
'      ["上線會多花的位元組", add.toLocaleString() + " B（標記 " + addHtml.toLocaleString() + " ＋ CSS " + addCss.toLocaleString() + "），<b>壓縮後約 " + Math.round(add / 4).toLocaleString() + " B</b>"],',
'      ["這張圖被抓幾次", names.length ? names.map(function (n) { return urls[n] + "x " + n; }).join("、") : "量不到（快取命中）"],',
'      ["多載的檔案數", (names.length > 1 ? "<b>⚠ " + (names.length - 1) + " 個</b>" : "<b>0</b> 個")],',
'      ["卡片圖／視窗", (t1 ? Math.round(t1.width) + "×" + Math.round(t1.height) : "—") + " ／ " + innerWidth + "×" + innerHeight + " px"],',
'      ["兩層錯開／破框", (gap === null ? "—" : (gap === 0 ? "0 px" : "<b>⚠ 差 " + gap + " px</b>")) + " ／ " + (root.scrollWidth > root.clientWidth ? "<b>⚠ 破框</b>" : "沒有")],',
'      ["現在的幀率", fps ? fps + " fps" : "量測中"],',
'      ["減少動態效果", "你的系統" + (matchMedia("(prefers-reduced-motion: reduce)").matches ? "<b>開著</b>" : "關著") + "，這一項刻意不跟（同文章頁）"]',
'    ];',
'    var h = ""; for (var r = 0; r < rows.length; r++) h += "<div>" + rows[r][0] + "</div><div>" + rows[r][1] + "</div>";',
'    document.getElementById("pvo").innerHTML = h;',
'  }',
'  setInterval(measure, 1000);',
'  apply();',
'})();',
'</script>'
].join("\n");

/* ⚠ 一定要用 lastIndexOf：這一站的註解裡就寫著 </body> 這幾個字
   （.nav-lamp 那一段），String.replace 會換到註解裡那一個，切換條會落在
   <head> 的樣式表中間、整段不會執行。症狀是「按鈕不見了」。 */
const bodyAt = s.lastIndexOf("</body>");
if (bodyAt < 0) throw new Error("找不到 </body>");
s = s.slice(0, bodyAt) + BAR + "\n" + s.slice(bodyAt);

/* ---------- 守門：產出來的東西自己驗一次 ---------------------------------- */
const gate = [];
if (/data-views-self/.test(s)) gate.push("計數器沒有降級（還有 data-views-self）");
if (!/noindex/.test(s)) gate.push("少了 noindex");
if (/["'(\s]assets\//.test(s)) gate.push("還有沒改到的 assets/ 相對路徑");
if (!/\.\.\/\.\.\/assets\/style\.css/.test(s)) gate.push("樣式表的路徑不對");
if ((s.match(/class="pv-shot"/g) || []).length !== 1) gate.push("疊層的外框不是剛好一個");
if ((s.match(/class="hero-fx-blip pv-blip"/g) || []).length !== 5) gate.push("驚嘆號不是五個");
if (s.lastIndexOf('<div class="pvbar">') < s.lastIndexOf("</main>")) gate.push("切換條插在 </main> 前面了");
/* 注入的那一段 <script> 逐行數單引號與雙引號，奇數就是字串被切斷了 */
const inj = BAR.slice(BAR.indexOf("<script>"));
inj.split("\n").forEach((line, i) => {
  const d = (line.match(/"/g) || []).length;
  if (d % 2) gate.push("切換條第 " + (i + 1) + " 行的雙引號是奇數：" + line.trim().slice(0, 50));
});
if (gate.length) { console.error("✗ 守門沒過：\n  - " + gate.join("\n  - ")); process.exit(1); }

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, s);
console.log("✓ preview/card-motion/index.html");
console.log("  來源 index.html " + (before / 1024).toFixed(0) + "KB → 產出 " + (s.length / 1024).toFixed(0) + "KB");
console.log("  守門 8 項全過（計數器降級、noindex、相對路徑、外框、驚嘆號五個、切換條位置、引號成對）");
console.log("  網址 /preview/card-motion/?cm=a|b|c&cmh=0|1&cmp=0|1");
