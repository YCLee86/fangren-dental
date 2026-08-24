/* 牙周線稿底圖的提案頁 → preview/topic-lineart-perio/index.html
 *   node drafts/lineart-perio-preview.mjs
 *
 * 它是 **topics/perio/index.html 的快照** ＋ 一段線稿的 CSS ＋ 一條切換條。
 * ⚠⚠ **正式站的 index.html 一個字都沒動** —— 定案那天才把選中的那一格
 *   （url 去掉 ../../）貼進 index.html 那三條選擇器，再跑 tools/topics.mjs。
 *
 * 2026-08-24 第二版：使用者「手機上看有點淡　做幾個版本讓我選　大小也讓我切換
 * 　感覺可以再大一點」，所以切換條長出兩條尺 ＋ 一條細調：
 *   大小 76%/360（現況）→ 86/410 → 93/440 → 100%/480
 *   濃度 手機 .10（現況）/.115（AA 上限）/.15/.20　　≥834 .48（現況）/.56/.64/.72
 *   細調：往下沉 0（現況）/12/24px
 * ⚠⚠ **尺只顯示「目前這個寬度吃得到的那一條」** —— 手機與 ≥834 是兩個獨立的值
 *   （站上本來就分兩段），兩條都攤開會吃掉半個手機畫面（hero-motion 那一輪踩過）。
 * ⚠⚠ **量測面板要能自己下判斷**：這一輪真正的判準不是濃度好不好看，是
 *   **有字壓在線上時那幾個字還讀不讀得到**。面板逐行量「字底下真的有沒有墨」
 *   （框相交不算），對命中的那幾行算實際對比，並印出「濃度上限」。
 * ⚠ 大小**不改變對比度**，只改變有多少字落在圖上（一般牙科那一輪量出來的）。
 *
 * 踩過的坑（CLAUDE.md 第八節）都照做了：
 * ・切換條插在**最後一個** </body> 前面（這一頁的註解裡就有兩個 </body>）。
 * ・class 一律 `pv-` 前綴。網址參數的正規式寫 [a-z0-9]+。
 * ・`<!-- SEO:START -->` 整段換成 noindex（那一段的 canonical／og／JSON-LD 指向 /topics/perio/）。
 * ・相對路徑不必改：/preview/topic-lineart-perio/ 和 /topics/perio/ 一樣深兩層。
 * ・counter.js 留著（這一頁沒有 data-views-self，只會讀不會 +1）。
 * ・寬度**不准超過 100%** —— 偽元素是 right:0，比容器寬就會往左凸出版心，
 *   手機上直接多出水平捲動。
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "topics/perio/index.html";
const OUT = "preview/topic-lineart-perio/index.html";
let h = fs.readFileSync(SRC, "utf8");

/* 1. SEO 整段 → noindex */
const a = h.indexOf("<!-- SEO:START");
const b = h.indexOf("<!-- SEO:END -->");
if (a < 0 || b < 0) throw new Error("找不到 SEO 區塊");
h = h.slice(0, a) +
  `<!-- ⚠ 提案頁：SEO 區塊整段換成 noindex（原本那一段指向 /topics/perio/） -->
<meta name="robots" content="noindex, nofollow, noarchive">` +
  h.slice(b + "<!-- SEO:END -->".length);

/* 2. 線稿的樣式。定案時把 --pv-* 換成選中的那一組定值再搬進 index.html。 */
const CSS = `
<style>
/* 提案中：牙周的線稿底圖。定案時把這一段搬進 index.html 的
   「3-0 介紹區右下角的線稿底圖」旁邊，url 改回 assets/lineart-perio.png，
   var(--pv-*) 換成選中的定值。 */
[data-topic="perio"] .tp-intro { position: relative; }
[data-topic="perio"] .tp-intro::before {
  content: ""; position: absolute; right: 0; bottom: calc(-1 * var(--pv-y, 0px));
  width: var(--pv-w, min(76%, 360px)); aspect-ratio: 1024 / 755;
  background: url("../../assets/lineart-perio.png") center / contain no-repeat;
  opacity: var(--pv-op, .10); pointer-events: none; z-index: 0;
}
@media (min-width: 834px) { [data-topic="perio"] .tp-intro::before { opacity: var(--pv-op, .48); } }
[data-topic="perio"] .tp-intro > * { position: relative; z-index: 1; }
html[data-pvfig="off"] [data-topic="perio"] .tp-intro::before { display: none; }

/* 切換條（提案用，定案時整段消失） */
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(30,32,29,.94); color: #f4f4f5;
  padding: .45rem .6rem calc(.45rem + env(safe-area-inset-bottom));
  font: 500 12.5px/1.3 system-ui, "Noto Sans TC", sans-serif; }
.pv-row { display: flex; gap: .3rem; align-items: center; margin-top: .3rem; }
.pv-row:first-child { margin-top: 0; }
.pv-lab { flex: 0 0 2.6em; opacity: .72; font-size: 11.5px; }
.pv-row button { flex: 1; min-height: 32px; border-radius: 8px;
  border: 1px solid rgba(244,244,245,.32); background: transparent; color: inherit;
  font: 500 12.5px/1 system-ui, "Noto Sans TC", sans-serif; padding: 0; }
.pv-row button[aria-pressed="true"] { background: #317d78; border-color: #317d78; }
.pv-meas { margin-top: .35rem; opacity: .82; font-size: 11px; white-space: pre-line; }
.pv-meas b { color: #ffd9d0; font-weight: 700; }
.pv-fine[hidden] { display: none; }
.pv-more { margin-top: .3rem; background: none; border: 0; color: inherit; opacity: .7;
  font: 500 11.5px system-ui, sans-serif; padding: .2rem 0; }
</style>
`;
h = h.replace("</head>", CSS + "</head>");

/* 3. 切換條 ＋ 現場量測（插在最後一個 </body> 前面） */
const BAR = `
<div class="pv-bar">
  <div class="pv-row" data-k="w">
    <span class="pv-lab">大小</span>
    <button type="button" data-v="a">現況</button>
    <button type="button" data-v="b">大</button>
    <button type="button" data-v="c">更大</button>
    <button type="button" data-v="d">最大</button>
  </div>
  <div class="pv-row" data-k="op">
    <span class="pv-lab" id="pvOpLab">濃度</span>
    <button type="button" data-v="1">現況</button>
    <button type="button" data-v="2" id="pvOp2">濃</button>
    <button type="button" data-v="3">更濃</button>
    <button type="button" data-v="4">最濃</button>
  </div>
  <div class="pv-row pv-fine" data-k="y" hidden>
    <span class="pv-lab">下沉</span>
    <button type="button" data-v="0">0</button>
    <button type="button" data-v="1">12px</button>
    <button type="button" data-v="2">24px</button>
  </div>
  <div class="pv-row">
    <button type="button" id="pvReset">對照現況（整組回站上的值）</button>
  </div>
  <button type="button" class="pv-more" id="pvMore">細調 ▾</button>
  <div class="pv-meas" id="pvMeas"></div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var ACCENT = [0x31, 0x7d, 0x78];
  var W  = { a: "min(76%, 360px)", b: "min(86%, 410px)", c: "min(93%, 440px)", d: "min(100%, 480px)" };
  /* ⚠ 手機第二格 .115 是**算出來的 AA 上限**（柔墨 #5c5f57 壓在牙周套色上剛好 4.5），
     不是隨手挑的一階。第三、四格已經在 4.5 底下，面板會即時標出來。 */
  var OPM = { "1": .10, "2": .115, "3": .15, "4": .20 };  /* 手機（<834） */
  var OPD = { "1": .48, "2": .56, "3": .64, "4": .72 };   /* iPad／電腦（≥834） */
  var Y   = { "0": "0px", "1": "12px", "2": "24px" };
  var st = { w: "a", op: "1", y: "0", fig: "on" };
  var q = location.search;
  ["w", "op", "y", "fig"].forEach(function (k) {
    var m = q.match(new RegExp("[?&]" + k + "=([a-z0-9]+)"));
    if (m) st[k] = m[1];
  });

  function isWide() { return matchMedia("(min-width: 834px)").matches; }
  function opVal() { return (isWide() ? OPD : OPM)[st.op] || (isWide() ? .48 : .10); }

  function paint() {
    root.dataset.pvfig = st.fig;
    root.style.setProperty("--pv-w", W[st.w] || W.a);
    root.style.setProperty("--pv-op", String(opVal()));
    root.style.setProperty("--pv-y", Y[st.y] || "0px");
    document.querySelectorAll(".pv-row[data-k]").forEach(function (row) {
      var k = row.dataset.k;
      row.querySelectorAll("button").forEach(function (bt) {
        bt.setAttribute("aria-pressed", String(bt.dataset.v === st[k]));
      });
    });
    document.getElementById("pvOpLab").textContent = "濃度";
    document.getElementById("pvOp2").textContent = isWide() ? "濃" : "濃（上限）";
    meas();
  }

  /* ---- 量測 ------------------------------------------------------------
     判準不是濃度本身，是「有字壓在線上時那幾個字還讀不讀得到」。
     所以逐行量「字底下真的有沒有墨」（框相交不算），命中的行才算對比。 */
  var img = new Image(); var imgOK = false;
  img.onload = function () { imgOK = true; meas(); };
  img.src = "../../assets/lineart-perio.png";
  var cv = document.createElement("canvas");

  function lin(v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }
  function lum(c) { return .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]); }
  function ratio(f, bg) { var a = lum(f), b2 = lum(bg); var hi = Math.max(a, b2), lo = Math.min(a, b2); return (hi + .05) / (lo + .05); }
  function rgbOf(s) { var m = s.match(/(\\d+(?:\\.\\d+)?)/g); return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0]; }
  function baseBg(el) {
    for (var n = el; n && n !== document.documentElement; n = n.parentElement) {
      var c = getComputedStyle(n).backgroundColor, m = c.match(/[\\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0)) return [+m[0], +m[1], +m[2]];
    }
    return [226, 229, 230];
  }
  function mix(base, al) { return base.map(function (p, i) { return p * (1 - al) + ACCENT[i] * al; }); }

  function meas() {
    var intro = document.querySelector(".tp-intro"); if (!intro) return;
    var ir = intro.getBoundingClientRect();
    var cs = getComputedStyle(intro, "::before");
    var fw = parseFloat(cs.width) || 0, fh = parseFloat(cs.height) || 0, al = parseFloat(cs.opacity) || 0;
    var yOff = parseFloat(getComputedStyle(root).getPropertyValue("--pv-y")) || 0;
    var fig = { left: ir.right - fw, right: ir.right, top: ir.bottom + yOff - fh, bottom: ir.bottom + yOff };
    var on = st.fig !== "off";

    /* ⚠ 用 file:// 打開時 canvas 會被判定為跨來源、getImageData 直接丟例外
       —— 站上是同來源不會發生，但這裡要接住，不然面板會停在上一格的數字。 */
    var ink = null;
    if (imgOK && fw > 0) {
      try {
        cv.width = Math.max(1, Math.round(fw)); cv.height = Math.max(1, Math.round(fh));
        var g = cv.getContext("2d", { willReadFrequently: true });
        g.clearRect(0, 0, cv.width, cv.height);
        g.drawImage(img, 0, 0, cv.width, cv.height);
        ink = g.getImageData(0, 0, cv.width, cv.height).data;
      } catch (e) { ink = null; }
    }

    var lines = 0, hit = 0, worst = Infinity, worstCol = "", base = baseBg(intro);
    intro.querySelectorAll("p, li, blockquote").forEach(function (el) {
      var col = rgbOf(getComputedStyle(el).color);
      var rg = document.createRange(); rg.selectNodeContents(el);
      Array.prototype.forEach.call(rg.getClientRects(), function (rr) {
        if (rr.width < 2 || rr.height < 2) return;
        lines++;
        if (!on || !ink) return;
        var x0 = Math.max(0, Math.floor(rr.left - fig.left)), x1 = Math.min(cv.width, Math.ceil(rr.right - fig.left));
        var y0 = Math.max(0, Math.floor(rr.top - fig.top)), y1 = Math.min(cv.height, Math.ceil(rr.bottom - fig.top));
        if (x1 <= x0 || y1 <= y0) return;
        var n = 0;
        for (var y = y0; y < y1 && n === 0; y++) for (var x = x0; x < x1; x++) {
          if (ink[(y * cv.width + x) * 4 + 3] > 77) { n = 1; break; }
        }
        if (!n) return;
        hit++;
        var c = ratio(col, mix(base, al));
        if (c < worst) { worst = c; worstCol = "rgb(" + col.join(",") + ")"; }
      });
    });

    /* 這一格的濃度上限：讓「壓到線的那幾行裡最不利的那個字色」剛好 4.5 */
    var cap = "—";
    if (worst < Infinity) {
      var col2 = rgbOf(worstCol), lo = 0, hi2 = 1;
      for (var i = 0; i < 24; i++) {
        var m2 = (lo + hi2) / 2;
        if (ratio(col2, mix(base, m2)) >= 4.5) lo = m2; else hi2 = m2;
      }
      cap = lo.toFixed(3);
    }

    var sw = root.scrollWidth > innerWidth;
    var txt = "視窗 " + Math.round(innerWidth) + "×" + Math.round(innerHeight) +
      "　圖 " + Math.round(fw) + "×" + Math.round(fh) + "（" + (fw / ir.width * 100).toFixed(0) + "% 寬）" +
      "　濃度 " + al.toFixed(2) +
      "\\n壓到線的字 " + hit + "／" + lines + " 行";
    if (hit) {
      txt += "　最差對比 " + (worst >= 4.5 ? worst.toFixed(2) + " ✓" : "<b>" + worst.toFixed(2) + " ⚠ 低於 4.5</b>") +
             "　這一格的濃度上限 " + cap;
    } else {
      txt += ink ? "　沒有字壓在線上，濃度純粹是美感" : "　（量不到墨圖，請用 http 開這一頁）";
    }
    txt += "\\n介紹區高 " + ir.height.toFixed(1) + "px" + (sw ? "　<b>⚠ 有水平捲動</b>" : "　無水平捲動");
    document.getElementById("pvMeas").innerHTML = txt;
  }

  document.querySelectorAll(".pv-row[data-k] button").forEach(function (bt) {
    bt.addEventListener("click", function () { st[bt.parentElement.dataset.k] = bt.dataset.v; st.fig = "on"; paint(); });
  });
  document.getElementById("pvReset").addEventListener("click", function () {
    st.w = "a"; st.op = "1"; st.y = "0"; st.fig = st.fig === "off" ? "on" : "off"; paint();
  });
  document.getElementById("pvMore").addEventListener("click", function () {
    var f = document.querySelector(".pv-fine"); f.hidden = !f.hidden;
    this.textContent = f.hidden ? "細調 ▾" : "細調 ▴";
  });
  addEventListener("resize", paint);
  addEventListener("load", meas);
  paint();
})();
</script>
`;
const i = h.lastIndexOf("</body>");
h = h.slice(0, i) + BAR + h.slice(i);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, h);
console.log("✓ " + OUT + "  " + (Buffer.byteLength(h) / 1024).toFixed(1) + "KB");
