/* 夜間模式・地圖的停車場藍與入口指標（2026-09-15 提案頁）
 *   node tools/night-map-preview.mjs   → preview/night-map-park/index.html
 *
 * 起因是使用者的手機截圖（夜間）：「停車場的藍好像在夜間模式變得不太清楚，
 * 雖然停車場因為圖形不小還算可以辨認，但入口的指標就幾乎看不到了。」
 *
 * ⚠⚠⚠ 量出來是**兩件各自獨立的事**，而且成因是同一個（第九節第 28 條 ②：
 *   夜間那一輪把路牌藍原封不動留著，可是它周圍的東西全部換過了）：
 *
 *   ① 入口指標壓在**路面**上，而夜間的路面比街廓亮 16 L 星（Ⓜ1 是使用者挑的）。
 *      白天路面比街廓**暗**，所以同一支深藍在路面上有 4.79；
 *      夜間路面亮起來、藍沒動，對比掉到 **1.11**（1.00 就是完全看不見）。
 *      ⚠ 它沒有第二條路：要比路面暗到 3:1 需要負的亮度，**只能提亮**。
 *   ② 點到的方塊壓在**街廓**上，對比 6.76 → **1.91**；
 *      而且「點到」在白天只比「沒點到」暗 3.6 L 星（＝**換色相**），
 *      夜間變成暗 **15.8** L 星 —— 深底上暗就是退後，**語意翻面了**。
 *
 * ⚠⚠ 兩件不能共用同一支顏色，這是幾何不是偏好：方塊的底是街廓、箭頭的底是路面，
 *   夜間那兩塊差 16 L 星。要箭頭對路面過 3:1 得走到 L 星 64.5，
 *   而白色的 P 壓在那個亮度上只剩 2.49 —— **白 P 就是方塊那一把尺的天花板**
 *   （第 28 條 ③：自己推出來的限制正在壓縮成品時要當場講）。
 *
 * 做法照第八節：index.html 的完整快照 ＋ 切換條。四件一起做了 ——
 *   ・相對路徑（assets → ../../assets、posts → /posts）
 *   ・data-views-self 降成 data-views（只有 -self 會 POST +1，所以不灌計數、
 *     又印得出真數字，而且沒有任何假數字可以被搬回正式站。同 chip-carry 那一輪）
 *   ・切換條插在**最後一個** body 結束標籤前面（註解裡就寫著那幾個字，用 lastIndexOf）
 *   ・樣式放 head 的最後（塞在頁尾的話關著的東西會在開頁那 180ms 閃出來）
 * ⚠ class 一律 pv- 前綴（站上有 .foot、.date 這種短名字，撞名會被站上的規則染色）。
 * ⚠ 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 吃不到帶數字的值。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "preview/night-map-park/index.html");

/* ---------- 色彩：算候選值（同色相同彩度，只提亮度 —— 照 tools/night-mode.mjs） ---------- */
const hex2rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
const lin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const unlin = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
const lum = (x) => { const [r, g, b] = hex2rgb(x).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
const WP = [0.95047, 1, 1.08883];
function toLch(x) {
  const [r, g, b] = hex2rgb(x).map(lin);
  const X = 0.4124 * r + 0.3576 * g + 0.1805 * b, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X / WP[0]), fy = f(Y / WP[1]), fz = f(Z / WP[2]);
  const A = 500 * (fx - fy), B = 200 * (fy - fz);
  return [116 * fy - 16, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
}
function fromLch(L, C, H) {
  const h = H * Math.PI / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const g = (t) => (t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787);
  const X = g(fx) * WP[0], Y = g(fy) * WP[1], Z = g(fz) * WP[2];
  const rgb = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z].map(unlin);
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
}
/* 同色相同彩度往上提，直到對每一個底都過門檻 */
function liftTo(hex, bgs, target) {
  const [L0, C, H] = toLch(hex);
  for (let L = L0; L <= 100; L += 0.1) { const c = fromLch(L, C, H); if (bgs.every((b) => cr(c, b) >= target)) return c; }
  throw new Error("提不到 " + target + "：" + hex);
}

const PARK = "#365685";                 /* 路牌藍，白天與夜間現況都是它 */
const CARD = "#282b31";                 /* 夜間的街廓 */
const ROAD = "#4c4f55";                 /* 夜間的路面（卡色 +16 L 星） */
const OFFC = "#7a7d77";                 /* 夜間沒點到的那三塊 */
const MAPPARK = "#7a96ca";              /* 夜間的 --map-park：路線的點與牌子在用 */
const [, PC, PH] = toLch(PARK);

/* 尺一 入口指標：底是**路面**。判準 3:1（裝飾性圖形的門檻，同 iPad 那顆指標那一輪）。 */
const ENT = [
  ["a", "現況", PARK],
  ["b", "路線的點", MAPPARK],
  ["c", "剛好 3:1", liftTo(PARK, [ROAD], 3)],
  ["d", "再亮一階", liftTo(PARK, [ROAD], 4.5)],
];
/* 尺二 點到的方塊：底是**街廓**，天花板是壓在上面的白色 P。 */
const LOT = [
  ["a", "現況", PARK],
  ["b", "對街廓 3:1", liftTo(PARK, [CARD], 3)],
  ["c", "釘在 L 星 52", fromLch(toLch(OFFC)[0], PC, PH)],
  ["d", "路線的點", MAPPARK],
];
/* 尺三 **沒點到**的那三塊（2026-09-15 第二輪，使用者：「沒點到的停車場感覺可以暗一點」）。
 * ⚠⚠ 他是對的，而且量得出來：`#7a7d77` 是**白天那一支原封不動釘回來的**
 *   （白天 ＝ 柔墨混 80%），白天它壓在 L 星 96 的卡上是「暗下去」，
 *   夜間壓在 L 星 17.5 的街廓上就變成**整張圖上最亮的一群大塊**——
 *   **對街廓 3.40，比診所自己那塊綠（2.14）還跳**。一張「診所在哪」的地圖上，
 *   份量最重的東西是三塊停車場，那是排錯了。
 * ⚠ 暗下去同時修好另一格：白色的 P 壓在上面現在只有 3.80，愈暗愈好讀。
 * ⚠⚠ 但有一個死區：路面是 L 星 33.5，塊走到那附近時「貼著路的那一邊」
 *   就沒有邊界了（對路面 1.0）。三塊都有一角是貼著路的，所以面板要一起量。 */
const darkTo = (hex, bg, target) => {
  const [L0, C, H] = toLch(hex);
  for (let L = L0; L >= 0; L -= 0.1) { const c = fromLch(L, C, H); if (cr(c, bg) <= target) return c; }
  throw new Error("暗不到 " + target + "：" + hex);
};
const OFFS = [
  ["a", "現況", OFFC],
  ["b", "暗一階", darkTo(OFFC, CARD, 2.75)],
  ["c", "和診所同級", darkTo(OFFC, CARD, cr("#3f654a", CARD))],
  ["d", "再暗一階", darkTo(OFFC, CARD, 1.75)],
];
const DEF_E = "c", DEF_L = "c", DEF_O = "c";

/* ---------- 快照 ---------- */
let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const rep = (find, to, label) => {
  const next = typeof find === "string" ? html.split(find).join(to) : html.replace(find, to);
  if (next === html) throw new Error("沒有命中：" + label);
  html = next;
};
const repAll = (re, fn, label) => {
  let n = 0;
  html = html.replace(re, (...a) => { n++; return fn(...a); });
  if (!n) throw new Error("沒有命中：" + label);
};

/* 相對路徑往上兩層。⚠ 不要用 base 標籤代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
repAll(/(href|src)="assets\//g, (_, a) => a + '="../../assets/', "assets 的 href/src");
repAll(/srcset="([^"]*)"/g, (_, v) => 'srcset="' + v.replace(/(^|,\s*)assets\//g, (m, p) => p + "../../assets/") + '"', "srcset");
repAll(/url\("assets\//g, () => 'url("../../assets/', "CSS 的 url()");
repAll(/href="posts\//g, () => 'href="/posts/', "文章連結");
rep('href="site.webmanifest', 'href="/site.webmanifest', "webmanifest");
rep('href="./"', 'href="/"', "品牌連結");

/* 計數器降級：只有 -self 會 POST +1，所以數字仍然是真的、但不會灌到正式站。 */
rep('data-views-self="home"', 'data-views="home"', "窄帶的計數器");
if (/data-views-self/.test(html)) throw new Error("還有 data-views-self 沒降級");

/* 三道 noindex 的第一道（另外兩道在 Worker 與 robots.txt，已經就位）。 */
rep('<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex, nofollow, noarchive">',
  "noindex");

/* 這一頁在談夜間，沒存過偏好就直接開夜間（存過的仍然照他自己的選擇）。 */
rep("s=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';", "s='dark';", "預設夜間");

const ENT_CSS = ENT.map(([k, , c]) => `html[data-theme="dark"][data-pv-e="${k}"] .lot.on .ent { fill: ${c}; }`).join("\n");
const LOT_CSS = LOT.map(([k, , c]) => `html[data-theme="dark"][data-pv-l="${k}"] .lot.on :is(rect, path):not(.ent) { fill: ${c}; }`).join("\n");
/* ⚠ 要寫 `.lot:not(.on)`，不能只寫 `.lot` —— 只寫 .lot 的話這一條排在點到那一條前面，
     權重又一樣，點到的那一塊會被它蓋掉。 */
const OFF_CSS = OFFS.map(([k, , c]) => `html[data-theme="dark"][data-pv-o="${k}"] .lot:not(.on) :is(rect, path) { fill: ${c}; }`).join("\n");

/* ⚠ 樣式要插在 head 的最後（NIGHT 區塊後面）—— 同權重靠順序決勝，
     而且關著的東西不會在開頁那 180ms 閃出來。 */
const STYLE = `<style>
/* 提案頁的切換條（2026-09-15，夜間地圖的停車場藍）。定案時整段刪掉。 */
${ENT_CSS}
${LOT_CSS}
${OFF_CSS}
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: color-mix(in srgb, var(--card) 92%, transparent);
  backdrop-filter: blur(8px) saturate(1.1); -webkit-backdrop-filter: blur(8px) saturate(1.1);
  border-top: 1px solid var(--rule); padding: .5rem var(--pad, 1rem) calc(.5rem + env(safe-area-inset-bottom, 0px));
  font-size: .78rem; line-height: 1.5; color: var(--ink); }
.pv-bar[hidden] { display: none; }
.pv-row { display: flex; align-items: center; gap: .26rem; margin-bottom: .22rem; }
.pv-row > b { flex: none; width: 4.4em; font-weight: 600; color: var(--ink-soft); font-size: .7rem; }
.pv-row .pv-seg { display: flex; gap: .26rem; flex: 1 1 auto; min-width: 0; }
.pv-bar button { appearance: none; font: inherit; cursor: pointer; flex: 1 1 0; min-width: 0;
  padding: .24rem .1rem; border-radius: 8px; border: 1px solid var(--rule);
  background: transparent; color: var(--ink-soft); white-space: nowrap; font-size: .74rem; }
.pv-bar button[aria-pressed="true"] { background: var(--ink); color: var(--card); border-color: var(--ink); }
.pv-panel { margin-top: .26rem; font-size: .68rem; line-height: 1.45; color: var(--ink-soft); }
.pv-panel div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pv-panel b { color: var(--ink); font-weight: 600; }
.pv-panel .pv-no { color: #ff8b8b; font-weight: 600; }
.pv-foot { display: flex; gap: .26rem; margin-top: .28rem; }
.pv-open { position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom, 0px)); z-index: 90;
  appearance: none; font: inherit; font-size: .78rem; cursor: pointer; padding: .4rem .7rem; border-radius: 10px;
  border: 1px solid var(--rule); background: var(--card); color: var(--ink); }
.pv-open[hidden] { display: none; }
</style>
`;
rep("</head>", STYLE + "</head>", "把樣式插進 head");

const BAR = `
<div class="pv-bar" id="pv-bar">
  <div class="pv-row"><b>沒點到的</b><span class="pv-seg">${OFFS.map(([k, t]) => `<button type="button" data-o="${k}">${t}</button>`).join("")}</span></div>
  <div class="pv-panel" id="pv-panel"></div>
  <div class="pv-foot">
    <button type="button" id="pv-day">對照白天</button>
    <button type="button" id="pv-map">跳到地圖</button>
    <button type="button" id="pv-fold">收起</button>
  </div>
</div>
<button class="pv-open" id="pv-open" hidden>切換條</button>
<script>
(function () {
  var r = document.documentElement, bar = document.getElementById('pv-bar');
  var qs = location.search, mE = qs.match(/[?&]e=([a-z0-9]+)/), mL = qs.match(/[?&]l=([a-z0-9]+)/), mO = qs.match(/[?&]o=([a-z0-9]+)/);
  var E = ${JSON.stringify(ENT.map((x) => x[0]))}, L = ${JSON.stringify(LOT.map((x) => x[0]))}, O = ${JSON.stringify(OFFS.map((x) => x[0]))};
  /* 入口指標與點到的那一塊 2026-09-15 第一輪已經定案（他挑的都是 c），
     所以收成寫死的值、從切換條上拿掉；網址參數仍然吃得到，要回頭比隨時開得出來。 */
  var e = mE && E.indexOf(mE[1]) >= 0 ? mE[1] : '${DEF_E}';
  var l = mL && L.indexOf(mL[1]) >= 0 ? mL[1] : '${DEF_L}';
  var o = mO && O.indexOf(mO[1]) >= 0 ? mO[1] : '${DEF_O}';

  /* 對比與 L 星都現場從 computed style 算 —— 面板不印任何寫死的數字。 */
  function rgb(s) { var m = String(s).match(/(-?[\\d.]+)/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
  function li(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * li(c[0]) + 0.7152 * li(c[1]) + 0.0722 * li(c[2]); }
  function cr(a, b) { var A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); }
  function Ls(c) { var y = lum(c); return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y; }
  function f2(n) { return n.toFixed(2); }

  function paint() {
    r.setAttribute('data-pv-e', e); r.setAttribute('data-pv-l', l); r.setAttribute('data-pv-o', o);
    Array.prototype.forEach.call(bar.querySelectorAll('[data-o]'), function (b) { b.setAttribute('aria-pressed', b.dataset.o === o); });
    measure();
  }

  function measure() {
    var p = document.getElementById('pv-panel'), on = document.querySelector('.lot.on');
    if (!on) { p.innerHTML = '<div>點一下地圖上的三塊停車場，這裡才量得到。</div>'; return; }
    /* ⚠ 路面與街廓要讀**畫出來的那個元素**，不要讀自訂屬性 ——
       getPropertyValue 回的是原字（一串 16 進位），拿去配對數字會撿到色碼裡的位數。 */
    var road = rgb(getComputedStyle(document.querySelector('.map-svg [fill="var(--map-road)"]')).fill);
    var card = rgb(getComputedStyle(document.querySelector('.map-svg [fill="var(--map-bg)"]')).fill);
    var blk = on.querySelector('rect, path:not(.ent)'), ent = on.querySelector('.ent');
    var off = document.querySelector('.lot:not(.on) rect, .lot:not(.on) path:not(.ent)');
    var cb = rgb(getComputedStyle(blk).fill), ce = rgb(getComputedStyle(ent).fill);
    var co = off ? rgb(getComputedStyle(off).fill) : cb;
    var pk = on.querySelector('.pk');
    var cp = pk ? rgb(getComputedStyle(pk).fill) : [244, 244, 245];
    var dL = Ls(cb) - Ls(co);
    /* 診所那塊綠是這一輪的錨點：沒點到的停車場不該比診所自己還跳。 */
    var gm = document.querySelector('.map-svg .cm-solid, .map-svg .cm-plot');
    var cg = gm ? rgb(getComputedStyle(gm).fill) : card;
    var pOff = cr(cp, co), road2 = cr(co, road);
    var row = function (s) { return '<div>' + s + '</div>'; };
    p.innerHTML =
      row('沒點到的塊對街廓 <b class="' + (cr(co, card) > cr(cg, card) ? 'pv-no' : '') + '">' + f2(cr(co, card))
          + '</b>　診所那塊綠是 ' + f2(cr(cg, card)) + (cr(co, card) > cr(cg, card) ? '（比診所還跳）' : '')) +
      row('　　　　對路面 <b class="' + (road2 < 1.2 ? 'pv-no' : '') + '">' + f2(road2) + '</b>'
          + (road2 < 1.2 ? '（貼著路的那一邊沒有邊界了）' : '') + '　白 P 壓在上面 <b>' + f2(pOff) + '</b>') +
      row('點到的塊對街廓 ' + f2(cr(cb, card)) + '・白 P ' + f2(cr(cp, cb)) + '　入口指標壓在路面上 ' + f2(cr(ce, road))) +
      row('點到比沒點到<b>' + (dL >= 0 ? '亮 ' : '暗 ') + Math.abs(dL).toFixed(1) + '</b> L 星　白天是暗 3.6（那時底是亮的）');
  }

  bar.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.o) { o = b.dataset.o; paint(); }
    else if (b.id === 'pv-day') { r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark'; measure(); }
    else if (b.id === 'pv-map') { var f = document.querySelector('.card-map'); if (f) f.scrollIntoView({ block: 'center' }); }
    else if (b.id === 'pv-fold') { bar.hidden = true; document.getElementById('pv-open').hidden = false; }
  });
  document.getElementById('pv-open').addEventListener('click', function () {
    bar.hidden = false; this.hidden = true;
  });
  /* 地圖上點一塊停車場之後要重量（亮的那一塊換人了）。 */
  var fig = document.querySelector('.map-fig');
  if (fig) fig.addEventListener('click', function () { setTimeout(measure, 260); });
  paint();
  /* ⚠⚠ 站上那支「開頁先亮壹車房」是等圖與腳本都跑完才掛上 .on 的，
     手機上（4G）比這裡慢很多 —— 第一版只在 load ＋300ms 量一次，
     使用者手機上的面板因此一直停在「點一下地圖上的三塊停車場」，
     而畫面完全正常。改成量到為止（最多 8 秒），並在 class 變動時重量。 */
  var tries = 0, timer = setInterval(function () {
    if (document.querySelector('.lot.on') || ++tries > 32) { clearInterval(timer); measure(); }
  }, 250);
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { measure(); });
    Array.prototype.forEach.call(document.querySelectorAll('.lot'), function (g) {
      mo.observe(g, { attributes: true, attributeFilter: ['class'] });
    });
  }
  /* 開頁直接停在地圖上 —— 這一頁只有那一塊要看，不要讓他自己滑一屏。 */
  addEventListener('load', function () {
    if (location.hash) return;
    var f = document.querySelector('.card-map'); if (!f) return;
    var prev = r.style.scrollBehavior; r.style.scrollBehavior = 'auto';
    f.scrollIntoView({ block: 'center' });
    r.style.scrollBehavior = prev;
  });
})();
</script>
`;
/* ⚠⚠ 一定要用 lastIndexOf —— 這一站的註解裡就寫著結束標籤那幾個字，
     字串取代會換到註解裡那一個，切換條會落在樣式表中間、整段不執行。 */
const i = html.lastIndexOf("</body>");
if (i < 0) throw new Error("找不到 body 的結束標籤");
html = html.slice(0, i) + BAR + html.slice(i);

/* 產生器寫出來的東西要自己驗一次（第九節第 24 條）。 */
{
  const s = html.slice(html.lastIndexOf("<script>\n(function () {\n  var r = document.documentElement, bar"));
  const q = (s.match(/'/g) || []).length;
  if (q % 2) throw new Error("切換條那段腳本的單引號是奇數個");
  /* ⚠ 只驗「真的會被瀏覽器拿去要檔案」的那幾種寫法 —— 註解裡、
       以及 https://fangren.net/assets/ 這種絕對網址都是對的，不要一起掃進來。 */
  const bad = html.match(/(?:(?:href|src|srcset)="|url\(")assets\/[^"]*/g) || [];
  if (bad.length) throw new Error("還有沒改到的 assets 路徑：\n" + bad.slice(0, 5).join("\n"));
  if (/(?:href|src)="posts\//.test(html)) throw new Error("還有相對的文章連結");
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log("✓ preview/night-map-park/index.html");
console.log("\n入口指標（底是路面 " + ROAD + "，門檻 3:1）");
for (const [k, t, c] of ENT) console.log("  " + k + " " + t.padEnd(6) + " " + c + "  對路面 " + cr(c, ROAD).toFixed(2) + "  L星 " + toLch(c)[0].toFixed(1));
console.log("點到的方塊（底是街廓 " + CARD + "，天花板是白色的 P）");
for (const [k, t, c] of LOT) console.log("  " + k + " " + t.padEnd(6) + " " + c + "  對街廓 " + cr(c, CARD).toFixed(2) + "  白P " + cr("#f4f4f5", c).toFixed(2) + "  對沒點到 ΔL星 " + (toLch(c)[0] - toLch(OFFC)[0]).toFixed(1));
console.log("沒點到的那三塊（診所那塊綠對街廓是 " + cr("#3f654a", CARD).toFixed(2) + "，路面 L星 " + toLch(ROAD)[0].toFixed(1) + "）");
for (const [k, t, c] of OFFS) console.log("  " + k + " " + t.padEnd(6) + " " + c + "  對街廓 " + cr(c, CARD).toFixed(2) + "  對路面 " + cr(c, ROAD).toFixed(2) + "  白P " + cr("#f4f4f5", c).toFixed(2) + "  L星 " + toLch(c)[0].toFixed(1));
