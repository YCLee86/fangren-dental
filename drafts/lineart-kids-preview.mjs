/* 兒童牙科線稿底圖的提案頁 → preview/topic-lineart-kids/index.html
 *   node drafts/lineart-kids-preview.mjs
 *
 * 它是 **topics/kids/index.html 的快照** ＋ 一段線稿的 CSS ＋ 一條切換條。
 * ⚠⚠ **正式站的 index.html 那一段仍是暫定值** —— 定案那天才把選中的那一格貼進去。
 *
 * 和顯微根管那一輪（drafts/lineart-endo-preview.mjs）的三個差別：
 * ① **多一條「翻轉」的尺** —— 這一科的方向還沒定（醫師在左、小孩在右／左右對調）。
 *    做法是 `transform: scaleX(-1)`，不另外產一個 PNG；定案選翻轉的話
 *    再用 `node tools/topic-lineart.mjs kids --art … --flip` 產正式的圖檔。
 *    ⚠ 量測那一側要跟著鏡射 x 座標，不然「哪幾行壓到墨」會算在反邊。
 * ② **尺整把往上移** —— 使用者看過暫定的 min(81.25%,390px) 之後說「可以再大一點」。
 * ③ 濃度第二格 **.152** 是這一科算出來的 AA 上限（柔墨 #5c5f57 壓在 #c28229 上剛好 4.5）
 *    —— 四科裡最寬鬆的（一般牙科 .101／牙周 .116／顯微根管 .107），因為兒牙的套色最淺。
 *
 * 踩過的坑（CLAUDE.md 第八節）都照做了：切換條插在**最後一個** </body> 前面、
 * class 一律 `pv-` 前綴、網址參數正規式 [a-z0-9]+、SEO 區塊整段換 noindex、
 * 相對路徑不必改（同樣深兩層）、counter.js 留著（這一頁沒有 data-views-self）、
 * 寬度不准超過 100%（偽元素是 right:0，比容器寬會往左凸出版心）。
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "topics/kids/index.html";
const OUT = "preview/topic-lineart-kids/index.html";
const IMG = { w: 998, h: 857 };
let h = fs.readFileSync(SRC, "utf8");

/* 1. SEO 整段 → noindex */
const a = h.indexOf("<!-- SEO:START");
const b = h.indexOf("<!-- SEO:END -->");
if (a < 0 || b < 0) throw new Error("找不到 SEO 區塊");
h = h.slice(0, a) +
  `<!-- ⚠ 提案頁：SEO 區塊整段換成 noindex（原本那一段指向 /topics/kids/） -->
<meta name="robots" content="noindex, nofollow, noarchive">` +
  h.slice(b + "<!-- SEO:END -->".length);

/* 2. 線稿的樣式。定案時把 --pv-* 換成選中的那一組定值再搬進 index.html。 */
const CSS = `
<style>
/* 提案中：兒童牙科的線稿底圖。定案時把這一段搬進 index.html 的
   「3-0 介紹區右下角的線稿底圖」旁邊，url 改回 assets/lineart-kids.png，
   var(--pv-*) 換成選中的定值。 */
[data-topic="kids"] .tp-intro { position: relative; }
[data-topic="kids"] .tp-intro::before {
  content: ""; position: absolute; right: 0; bottom: 0;
  width: var(--pv-w, min(76%, 360px)); aspect-ratio: ${IMG.w} / ${IMG.h};
  background: url("../../assets/lineart-kids.png") center / contain no-repeat;
  opacity: var(--pv-op, .12); pointer-events: none; z-index: 0;
  transform: var(--pv-flip, none); transform-origin: center;
}
@media (min-width: 721px) { [data-topic="kids"] .tp-intro::before { opacity: var(--pv-op, .15); } }
[data-topic="kids"] .tp-intro > * { position: relative; z-index: 1; }
html[data-pvfig="off"] [data-topic="kids"] .tp-intro::before { display: none; }

/* 切換條（提案用，定案時整段消失） */
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(30,32,29,.94); color: #f4f4f5;
  padding: .35rem .55rem calc(.35rem + env(safe-area-inset-bottom));
  font: 500 12px/1.25 system-ui, "Noto Sans TC", sans-serif; }
.pv-bar.is-min .pv-row, .pv-bar.is-min .pv-meas, .pv-bar.is-min .pv-seg { display: none; }
.pv-min { position: absolute; top: -30px; right: .55rem; min-height: 28px; padding: 0 .6rem;
  border-radius: 8px 8px 0 0; border: 0; background: rgba(30,32,29,.94); color: #f4f4f5;
  font: 500 12px/28px system-ui, "Noto Sans TC", sans-serif; }
.pv-row { display: flex; gap: .3rem; align-items: center; margin-top: .3rem; }
.pv-row:first-child { margin-top: 0; }
.pv-lab { flex: 0 0 2.6em; opacity: .72; font-size: 11.5px; }
.pv-row button { flex: 1; min-height: 28px; border-radius: 8px;
  border: 1px solid rgba(244,244,245,.32); background: transparent; color: inherit;
  font: 500 12.5px/1 system-ui, "Noto Sans TC", sans-serif; padding: 0; }
.pv-row button[aria-pressed="true"] { background: #c28229; border-color: #c28229; color:#241a06 }
.pv-seg { opacity: .6; font-size: 11px; margin-bottom: .3rem; }
.pv-meas { margin-top: .35rem; opacity: .82; font-size: 11px; white-space: pre-line; }
.pv-meas b { color: #ffdca8; font-weight: 700; }
</style>
`;
h = h.replace("</head>", CSS + "</head>");

/* 3. 切換條 ＋ 現場量測（插在最後一個 </body> 前面） */
const BAR = `
<div class="pv-bar">
  <button type="button" class="pv-min" id="pvMin">收起</button>
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
    <button type="button" data-v="2">濃</button>
    <button type="button" data-v="3">更濃</button>
    <button type="button" data-v="4">最濃</button>
  </div>
  <div class="pv-row" data-k="flip">
    <span class="pv-lab">方向</span>
    <button type="button" data-v="off">原方向（醫師在左）</button>
    <button type="button" data-v="on">翻轉（醫師在右）</button>
  </div>
  <div class="pv-row">
    <button type="button" id="pvReset">把圖關掉／打開（看版面有沒有被動到）</button>
  </div>
  <div class="pv-meas" id="pvMeas"></div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var ACCENT = [0xc2, 0x82, 0x29];
  var IMG_W = ${IMG.w}, IMG_H = ${IMG.h};
  /* ⚠⚠ 兩段的「大小」是**兩把不同的尺**（2026-08-24 第二輪）：使用者看過 iPad 那一段
     360／.48 之後說「好像太大了　而且太濃」，所以 ≥721 這一段整把尺往下移
     —— 原本的第一格 360 變成這一段的**最後一格**，另外三格全是比它小的。
     手機那把沒有動（他已經選定 a ＝ min(76%,360px) ＋ .107）。 */
  var WM = { a: "min(81.25%, 390px)", b: "min(90%, 430px)", c: "min(96%, 460px)", d: "min(100%, 490px)" };
  var WD = { a: "min(76%, 400px)", b: "min(88%, 460px)", c: "min(96%, 520px)", d: "min(100%, 580px)" };
  var WDPX = { a: "400", b: "460", c: "520", d: "580" };
  var WMTXT = { a: "現況", b: "大", c: "更大", d: "最大" };
  /* ⚠ 手機第二格 .107 是**算出來的 AA 上限**（柔墨 #5c5f57 壓在 #ae4f4d 上剛好 4.5）。
     第三、四格已經在 4.5 底下，面板會即時標出來。 */
  var OPM = { "1": .12, "2": .152, "3": .20, "4": .28 };  /* 手機（<721） */
  /* ≥721 這一段整組往下移（同上）：原本的第一格 .48 退到最後一格。
     ⚠ 這一段被壓到的只有深墨（.tp-reply／.tp-close），濃度上限 .665，
     所以四格都過得了 AA —— 這條尺純粹是美感，不是可讀性。
     ⚠ 牙周 ≥721 定案是 .15，一般牙科 ≥834 是 .48，兩支差很多，本來就不必一致。 */
  var OPD = { "1": .15, "2": .22, "3": .30, "4": .42 };   /* iPad／電腦（≥721） */
  var OPDTXT = { "1": ".15", "2": ".22", "3": ".30", "4": ".42" };
  /* ⚠⚠ 手機與 ≥721 是**兩組獨立的值**（站上本來就分兩段）——
     牙周那一輪量出來：iPad 的文字比較長（字級 +19%），同一組值在那一段會讓
     流程那幾行（柔墨）壓到線。所以大小也要分兩段記，不能只分濃度。
     ⚠⚠ **分段用 721 不是 834**（牙周定案時同一件事）：使用者的 iPad 是
     **mini 直放 744**，用 834 分會把他那台歸到「手機」那一段，
     他看到的和定案的就不是同一件事。 */
  var st = { wM: "b", opM: "2", wD: "b", opD: "2", fig: "on", flip: "off" };
  var q = location.search;
  ["w", "op"].forEach(function (k) {
    var m = q.match(new RegExp("[?&]" + k + "=([a-z0-9]+)"));
    if (m) { st[k + "M"] = m[1]; st[k + "D"] = m[1]; }
  });
  var mf = q.match(/[?&]fig=([a-z0-9]+)/); if (mf) st.fig = mf[1];
  var mp = q.match(/[?&]flip=([a-z0-9]+)/); if (mp) st.flip = mp[1];

  function isWide() { return matchMedia("(min-width: 721px)").matches; }
  function key(k) { return k + (isWide() ? "D" : "M"); }
  function get(k) { return st[key(k)]; }
  function opVal() { return (isWide() ? OPD : OPM)[get("op")] || (isWide() ? .48 : .10); }

  function paint() {
    root.dataset.pvfig = st.fig;
    root.style.setProperty("--pv-flip", st.flip === "on" ? "scaleX(-1)" : "none");
    document.querySelectorAll('.pv-row[data-k="flip"] button').forEach(function (bt) {
      bt.setAttribute("aria-pressed", String(bt.dataset.v === st.flip));
    });
    root.style.setProperty("--pv-w", (isWide() ? WD : WM)[get("w")] || WM.a);
    root.style.setProperty("--pv-op", String(opVal()));
    document.querySelectorAll(".pv-row[data-k]").forEach(function (row) {
      var k = row.dataset.k;
      row.querySelectorAll("button").forEach(function (bt) {
        bt.setAttribute("aria-pressed", String(bt.dataset.v === get(k)));
      });
    });
    var seg = isWide() ? "iPad／電腦" : "手機";
    document.getElementById("pvSeg").textContent = "調的是「" + seg + "」這一段（兩段各記各的）";
    /* ⚠ 按鈕上直接印實際值（牙周那一輪的做法）——「大」「更大」這種相對詞
       在兩段的尺不一樣時會騙人。 */
    var wBt = document.querySelectorAll('.pv-row[data-k="w"] button');
    var oBt = document.querySelectorAll('.pv-row[data-k="op"] button');
    if (isWide()) {
      wBt.forEach(function (bt) { bt.textContent = WDPX[bt.dataset.v] + "px"; });
      oBt.forEach(function (bt) { bt.textContent = OPDTXT[bt.dataset.v]; });
    } else {
      var mo = { "1": ".12 現況", "2": ".152 上限", "3": ".20", "4": ".28" };
      wBt.forEach(function (bt) { bt.textContent = WMTXT[bt.dataset.v]; });
      oBt.forEach(function (bt) { bt.textContent = mo[bt.dataset.v]; });
    }
    meas();
  }

  /* ---- 量測 ------------------------------------------------------------
     判準不是濃度本身，是「有字壓在線上時那幾個字還讀不讀得到」。
     所以逐行量「字底下真的有沒有墨」（框相交不算），命中的行才算對比。 */
  var img = new Image(); var imgOK = false;
  img.onload = function () { imgOK = true; meas(); };
  img.src = "../../assets/lineart-kids.png";
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
        var rx0 = rr.left - fig.left, rx1 = rr.right - fig.left;
        if (st.flip === "on") { var t = cv.width - rx1; rx1 = cv.width - rx0; rx0 = t; }  /* ⚠ scaleX(-1) 之後座標要鏡射 */
        var x0 = Math.max(0, Math.floor(rx0)), x1 = Math.min(cv.width, Math.ceil(rx1));
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
      "　濃度 " + al.toFixed(3) + "　" + (st.flip === "on" ? "翻轉" : "原方向") +
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
    bt.addEventListener("click", function () {
      var k = bt.parentElement.dataset.k;
      if (k === "flip") st.flip = bt.dataset.v; else st[key(k)] = bt.dataset.v;
      st.fig = "on"; paint();
    });
  });
  document.getElementById("pvMin").addEventListener("click", function () {
    var bar = document.querySelector(".pv-bar");
    var min = bar.classList.toggle("is-min");
    this.textContent = min ? "調整" : "收起";
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
