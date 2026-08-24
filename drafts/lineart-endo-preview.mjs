/* 顯微根管線稿底圖的提案頁 → preview/topic-lineart-endo/index.html
 *   node drafts/lineart-endo-preview.mjs
 *
 * 它是 **topics/endo/index.html 的快照** ＋ 一段線稿的 CSS ＋ 一條切換條。
 * ⚠⚠ **正式站的 index.html 一個字都沒動** —— 定案那天才把選中的那一格
 *   （url 去掉 ../../）貼進 index.html 那三條選擇器，再跑 tools/topics.mjs。
 *
 * 和牙周那一輪（drafts/lineart-perio-preview.mjs）的三個差別：
 * ① **沒有「裁右」那條尺。** 牙周要它是因為圖檔右緣不是人物的邊（白袍下襬與水管
 *    尾巴佔了 192px）；這一張的墨最右端 886／887 就是醫師椅的椅背本身，
 *    靠右對齊對到的就是人，沒有空白可以裁。
 * ② **沒有「下沉」那條尺。** 牙周量過：390 上下沉 0／12／24px，壓到線的行數
 *    19／20／18 —— 位置換不到可讀性（手機上文字是滿版的，圖往哪沉都在文字帶裡）。
 * ③ **多一道「圖比介紹區高」的警示。** 這一張是近正方（887×949，牙周是橫的
 *    1024×755），同樣寬度高很多：min(100%,480px) 算出來 514px，比 1440 上的
 *    介紹區（約 476px）還高，偽元素是 bottom:0，會往上凸到 h1 那邊去。
 *    面板現場比，凸出去就標紅。
 *
 * ⚠ 濃度第二格 .107 是**算出來的 AA 上限**（柔墨 #5c5f57 壓在顯微根管套色
 *   #ae4f4d 上剛好 4.5），不是隨手挑的一階 —— 三支套色各不同：
 *   一般牙科 .101／牙周 .116／顯微根管 **.107**（愈深愈緊）。
 *
 * 踩過的坑（CLAUDE.md 第八節）都照做了：
 * ・切換條插在**最後一個** </body> 前面。
 * ・class 一律 `pv-` 前綴。網址參數的正規式寫 [a-z0-9]+。
 * ・`<!-- SEO:START -->` 整段換成 noindex（那一段的 canonical／og／JSON-LD 指向 /topics/endo/）。
 * ・相對路徑不必改：/preview/topic-lineart-endo/ 和 /topics/endo/ 一樣深兩層。
 * ・counter.js 留著（這一頁沒有 data-views-self，只會讀不會 +1）。
 * ・寬度**不准超過 100%** —— 偽元素是 right:0，比容器寬就會往左凸出版心，
 *   手機上直接多出水平捲動。
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "topics/endo/index.html";
const OUT = "preview/topic-lineart-endo/index.html";
const IMG = { w: 887, h: 949 };
let h = fs.readFileSync(SRC, "utf8");

/* 1. SEO 整段 → noindex */
const a = h.indexOf("<!-- SEO:START");
const b = h.indexOf("<!-- SEO:END -->");
if (a < 0 || b < 0) throw new Error("找不到 SEO 區塊");
h = h.slice(0, a) +
  `<!-- ⚠ 提案頁：SEO 區塊整段換成 noindex（原本那一段指向 /topics/endo/） -->
<meta name="robots" content="noindex, nofollow, noarchive">` +
  h.slice(b + "<!-- SEO:END -->".length);

/* 2. 線稿的樣式。定案時把 --pv-* 換成選中的那一組定值再搬進 index.html。 */
const CSS = `
<style>
/* 提案中：顯微根管的線稿底圖。定案時把這一段搬進 index.html 的
   「3-0 介紹區右下角的線稿底圖」旁邊，url 改回 assets/lineart-endo.png，
   var(--pv-*) 換成選中的定值。 */
[data-topic="endo"] .tp-intro { position: relative; }
[data-topic="endo"] .tp-intro::before {
  content: ""; position: absolute; right: 0; bottom: 0;
  width: var(--pv-w, min(76%, 360px)); aspect-ratio: ${IMG.w} / ${IMG.h};
  background: url("../../assets/lineart-endo.png") center / contain no-repeat;
  opacity: var(--pv-op, .10); pointer-events: none; z-index: 0;
}
@media (min-width: 834px) { [data-topic="endo"] .tp-intro::before { opacity: var(--pv-op, .48); } }
[data-topic="endo"] .tp-intro > * { position: relative; z-index: 1; }
html[data-pvfig="off"] [data-topic="endo"] .tp-intro::before { display: none; }

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
.pv-row button[aria-pressed="true"] { background: #ae4f4d; border-color: #ae4f4d; }
.pv-seg { opacity: .6; font-size: 11px; margin-bottom: .3rem; }
.pv-meas { margin-top: .35rem; opacity: .82; font-size: 11px; white-space: pre-line; }
.pv-meas b { color: #ffd9d0; font-weight: 700; }
</style>
`;
h = h.replace("</head>", CSS + "</head>");

/* 3. 切換條 ＋ 現場量測（插在最後一個 </body> 前面） */
const BAR = `
<div class="pv-bar">
  <div class="pv-seg" id="pvSeg"></div>
  <div class="pv-row" data-k="w">
    <span class="pv-lab">大小</span>
    <button type="button" data-v="a">基準</button>
    <button type="button" data-v="b">大</button>
    <button type="button" data-v="c">更大</button>
    <button type="button" data-v="d">最大</button>
  </div>
  <div class="pv-row" data-k="op">
    <span class="pv-lab">濃度</span>
    <button type="button" data-v="1">基準</button>
    <button type="button" data-v="2" id="pvOp2">濃</button>
    <button type="button" data-v="3">更濃</button>
    <button type="button" data-v="4">最濃</button>
  </div>
  <div class="pv-row">
    <button type="button" id="pvReset">把圖關掉／打開（看版面有沒有被動到）</button>
  </div>
  <div class="pv-meas" id="pvMeas"></div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var ACCENT = [0xae, 0x4f, 0x4d];
  var IMG_W = ${IMG.w}, IMG_H = ${IMG.h};
  var W  = { a: "min(76%, 360px)", b: "min(86%, 410px)", c: "min(93%, 440px)", d: "min(100%, 480px)" };
  /* ⚠ 手機第二格 .107 是**算出來的 AA 上限**（柔墨 #5c5f57 壓在 #ae4f4d 上剛好 4.5）。
     第三、四格已經在 4.5 底下，面板會即時標出來。 */
  var OPM = { "1": .10, "2": .107, "3": .13, "4": .15 };  /* 手機（<834） */
  var OPD = { "1": .48, "2": .56, "3": .64, "4": .72 };   /* iPad／電腦（≥834） */
  /* ⚠⚠ 手機與 ≥834 是**兩組獨立的值**（站上本來就分兩段）——
     牙周那一輪量出來：iPad 的文字比較長（字級 +19%），同一組值在 834 上會讓
     流程那幾行（柔墨）壓到線。所以大小也要分兩段記，不能只分濃度。 */
  var st = { wM: "a", opM: "1", wD: "a", opD: "1", fig: "on" };
  var q = location.search;
  ["w", "op"].forEach(function (k) {
    var m = q.match(new RegExp("[?&]" + k + "=([a-z0-9]+)"));
    if (m) { st[k + "M"] = m[1]; st[k + "D"] = m[1]; }
  });
  var mf = q.match(/[?&]fig=([a-z0-9]+)/); if (mf) st.fig = mf[1];

  function isWide() { return matchMedia("(min-width: 834px)").matches; }
  function key(k) { return k + (isWide() ? "D" : "M"); }
  function get(k) { return st[key(k)]; }
  function opVal() { return (isWide() ? OPD : OPM)[get("op")] || (isWide() ? .48 : .10); }

  function paint() {
    root.dataset.pvfig = st.fig;
    root.style.setProperty("--pv-w", W[get("w")] || W.a);
    root.style.setProperty("--pv-op", String(opVal()));
    document.querySelectorAll(".pv-row[data-k]").forEach(function (row) {
      var k = row.dataset.k;
      row.querySelectorAll("button").forEach(function (bt) {
        bt.setAttribute("aria-pressed", String(bt.dataset.v === get(k)));
      });
    });
    var seg = isWide() ? "iPad／電腦" : "手機";
    document.getElementById("pvSeg").textContent = "調的是「" + seg + "」這一段（兩段各記各的）";
    document.getElementById("pvOp2").textContent = isWide() ? "濃" : "濃（AA 上限）";
    meas();
  }

  /* ---- 量測 ------------------------------------------------------------
     判準不是濃度本身，是「有字壓在線上時那幾個字還讀不讀得到」。
     所以逐行量「字底下真的有沒有墨」（框相交不算），命中的行才算對比。 */
  var img = new Image(); var imgOK = false;
  img.onload = function () { imgOK = true; meas(); };
  img.src = "../../assets/lineart-endo.png";
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
    var fig = { left: ir.right - fw, right: ir.right, top: ir.bottom - fh, bottom: ir.bottom };
    var on = st.fig !== "off";

    /* ⚠ 用 file:// 打開時 canvas 會被判定為跨來源、getImageData 直接丟例外
       —— 站上是同來源不會發生，但這裡要接住，不然面板會停在上一格的數字。 */
    var ink = null;
    if (imgOK && fw > 0) {
      try {
        cv.width = Math.max(1, Math.round(fw)); cv.height = Math.max(1, Math.round(fh));
        var g = cv.getContext("2d", { willReadFrequently: true });
        g.clearRect(0, 0, cv.width, cv.height);
        g.drawImage(img, 0, 0, cv.width, cv.height);   /* 和 CSS 的 contain 同一個做法 */
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
    var over = fh - ir.height;   /* > 0 ＝ 圖比介紹區高，會往上凸到 h1 那邊 */
    var txt = "視窗 " + Math.round(innerWidth) + "×" + Math.round(innerHeight) +
      "　圖 " + Math.round(fw) + "×" + Math.round(fh) + "（" + IMG_W + "×" + IMG_H + "）" +
      "　濃度 " + al.toFixed(2) +
      "\\n壓到線的字 " + hit + "／" + lines + " 行";
    if (hit) {
      txt += "　最差對比 " + (worst >= 4.5 ? worst.toFixed(2) + " ✓" : "<b>" + worst.toFixed(2) + " ⚠ 低於 4.5</b>") +
             "　這一格的濃度上限 " + cap;
    } else {
      txt += ink ? "　沒有字壓在線上，濃度純粹是美感" : "　（量不到墨圖，請用 http 開這一頁）";
    }
    txt += "\\n介紹區高 " + ir.height.toFixed(1) + "px" +
      (on && over > 1 ? "　<b>⚠ 圖高出 " + over.toFixed(0) + "px，凸到標題那一區</b>" : "　圖收在介紹區裡") +
      (sw ? "　<b>⚠ 有水平捲動</b>" : "　無水平捲動");
    document.getElementById("pvMeas").innerHTML = txt;
  }

  document.querySelectorAll(".pv-row[data-k] button").forEach(function (bt) {
    bt.addEventListener("click", function () { st[key(bt.parentElement.dataset.k)] = bt.dataset.v; st.fig = "on"; paint(); });
  });
  document.getElementById("pvReset").addEventListener("click", function () {
    st.fig = st.fig === "off" ? "on" : "off"; paint();
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
