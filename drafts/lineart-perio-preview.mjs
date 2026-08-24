/* 牙周線稿底圖的提案頁 → preview/topic-lineart-perio/index.html
 *   node drafts/lineart-perio-preview.mjs
 *
 * 它是 **topics/perio/index.html 的快照** ＋ 一段線稿的 CSS ＋ 一條切換條。
 * ⚠⚠ **正式站的 index.html 一個字都沒動** —— 這一輪只要「先看看」，
 *   所以線稿的樣式暫時只活在這一頁裡。定案那天才把同一段（url 去掉 ../../）
 *   貼進 index.html 那三條選擇器，再跑 tools/topics.mjs。
 *
 * 踩過的坑（CLAUDE.md 第八節）都照做了：
 * ・切換條插在**最後一個** </body> 前面（這一頁的註解裡就有兩個 </body>，
 *   用 String.replace 會換到註解裡那一個）。
 * ・class 一律 `pv-` 前綴（站上的短名字幾乎一定撞）。
 * ・網址參數的正規式寫 [a-z0-9]+。
 * ・`<!-- SEO:START -->` 整段換成 noindex —— 那一段的 canonical／og／JSON-LD
 *   全指向 /topics/perio/，留著等於對外宣告一個不是這一頁的網址。
 * ・相對路徑不必改：/preview/topic-lineart-perio/ 和 /topics/perio/ 一樣深兩層。
 * ・counter.js **留著**（這一頁沒有 data-views-self，只會讀不會 +1，
 *   拿掉的話文章卡的瀏覽數會變成一條「—」）。
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

/* 2. 線稿的樣式（＝定案時要貼進 index.html 的那一段，只有 url 多了 ../../） */
const CSS = `
<style>
/* 提案中：牙周的線稿底圖。定案時把這一段搬進 index.html 的
   「3-0 介紹區右下角的線稿底圖」旁邊，url 改回 assets/lineart-perio.png。
   大小與濃度沿用一般牙科那組量出來的值，沒有重挑。 */
[data-topic="perio"] .tp-intro { position: relative; }
[data-topic="perio"] .tp-intro::before {
  content: ""; position: absolute; right: 0; bottom: 0;
  width: min(76%, 360px); aspect-ratio: 1024 / 755;
  background: url("../../assets/lineart-perio.png") center / contain no-repeat;
  opacity: .10; pointer-events: none; z-index: 0;
}
@media (min-width: 834px) { [data-topic="perio"] .tp-intro::before { opacity: .48; } }
[data-topic="perio"] .tp-intro > * { position: relative; z-index: 1; }
html[data-pvfig="off"] [data-topic="perio"] .tp-intro::before { display: none; }

/* 切換條（提案用，定案時整段消失） */
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(30,32,29,.92); color: #f4f4f5; padding: .5rem .7rem calc(.5rem + env(safe-area-inset-bottom));
  font: 500 13px/1.35 system-ui, "Noto Sans TC", sans-serif; }
.pv-row { display: flex; gap: .4rem; align-items: center; }
.pv-row button { flex: 1; min-height: 34px; border-radius: 8px; border: 1px solid rgba(244,244,245,.35);
  background: transparent; color: inherit; font: inherit; }
.pv-row button[aria-pressed="true"] { background: #317d78; border-color: #317d78; }
.pv-meas { margin-top: .35rem; opacity: .8; font-size: 11.5px; white-space: pre-line; }
</style>
`;
h = h.replace("</head>", CSS + "</head>");

/* 3. 切換條 ＋ 現場量測（插在最後一個 </body> 前面） */
const BAR = `
<div class="pv-bar">
  <div class="pv-row">
    <button type="button" data-fig="on">有線稿底圖</button>
    <button type="button" data-fig="off">對照現況</button>
  </div>
  <div class="pv-meas" id="pvMeas"></div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var m = location.search.match(/[?&]fig=([a-z0-9]+)/);
  var cur = (m && m[1] === "off") ? "off" : "on";
  var btns = document.querySelectorAll(".pv-row button");
  function paint() {
    root.dataset.pvfig = cur;
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.fig === cur)); });
    meas();
  }
  function meas() {
    var intro = document.querySelector(".tp-intro");
    if (!intro) return;
    var ir = intro.getBoundingClientRect();
    var cs = getComputedStyle(intro, "::before");
    var w = parseFloat(cs.width) || 0, hh = parseFloat(cs.height) || 0, op = cs.opacity;
    var fig = { left: ir.right - w, right: ir.right, top: ir.bottom - hh, bottom: ir.bottom };
    /* 有幾行字真的壓在圖上（逐行量，不是逐段） */
    var hit = 0, tot = 0;
    intro.querySelectorAll(".tp-case, .tp-flow li, .tp-stance, .tp-close, p, li").forEach(function (el) {
      var rg = document.createRange(); rg.selectNodeContents(el);
      Array.prototype.forEach.call(rg.getClientRects(), function (r) {
        if (r.width < 2 || r.height < 2) return;
        tot++;
        if (cur === "on" && r.right > fig.left && r.left < fig.right && r.bottom > fig.top && r.top < fig.bottom) hit++;
      });
    });
    document.getElementById("pvMeas").textContent =
      "視窗 " + Math.round(window.innerWidth) + "×" + Math.round(window.innerHeight) +
      "　圖 " + Math.round(w) + "×" + Math.round(hh) + "　濃度 " + op +
      "\\n介紹區高 " + ir.height.toFixed(1) + "px　壓到字 " + hit + "／" + tot + " 行" +
      (document.documentElement.scrollWidth > window.innerWidth ? "　⚠ 有水平捲動" : "　無水平捲動");
  }
  btns.forEach(function (b) { b.addEventListener("click", function () { cur = b.dataset.fig; paint(); }); });
  addEventListener("resize", meas);
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
