#!/usr/bin/env node
/* 產生 preview/topic-lineart/ —— 著陸頁的線稿底圖（多大 × 放哪裡 × 多濃）
 *
 *   node tools/lineart-preview.mjs
 *
 * 起因（2026-08-22）使用者：「一般牙科的著陸頁並沒有我們剛剛做好的那張圖片，
 * 但那個圖片放進來會壓縮到版面，我不要那樣。我想到把圖片的某個部分做成頁面的底，
 * 但只要保留線條，而且是做成一般牙科的主題綠。」
 * 2026-08-23 圖定稿之後他說：「現在來把它放到著陸頁，做幾個不同大小的版本給我看，
 * 但也要考慮到文字的可讀性，在濃淡上做調整。」→ 這一版的主軸從「區塊」換成「大小」。
 *
 * ⚠⚠ **「大小」不影響對比度，「位置」才影響。** 這是這一輪最要緊的一句：
 *   字壓在線上時，最壞情況的底色 ＝ 紙色與套色按濃度混合，**和圖多大完全無關**；
 *   圖變大只是**讓更多字落在那個底色上**。所以可讀性的關卡掛在**濃度**，
 *   而濃度要不要受限，取決於**字有沒有壓在圖上**：
 *     ・側邊（圖在文字欄外面）→ 濃度純粹是美感，不影響任何一個字。
 *     ・浮水印（圖墊在內文底下）→ 有天花板，見下面那個 0.101。
 *
 * ⚠⚠ **卡住的是柔墨的次要文字，不是主文。** 閉式解（紙 #e2e5e6、套色 #3f654a）：
 *     --ink      #2a2c27　紙上 11.15 → 濃度 .45 仍有 5.84，.58 才掉到 4.5
 *     --ink-soft #5c5f57　紙上 **5.14** → **濃度 .101 就掉到 4.5**
 *   `.tp-case`／`.tp-flow`（那幾個現場與流程）用的正是柔墨，它在紙上本來就只剩
 *   0.64 的餘裕。**所以浮水印那一格的天花板是 .10，不是「看起來淡不淡」。**
 *
 * ⚠ 線稿本身由 `tools/topic-lineart.mjs` 產生（那一支是永久的），
 *   這一支只負責把它擺到頁面上讓使用者挑。定案時：把選中的那一組寫進
 *   `index.html` 的 `[data-topic]` 樣式段、刪掉這一頁、文字搬進 history/。
 *
 * ⚠⚠ **這一頁是 `topics/general/index.html` 的完整複本**，所以 CLAUDE.md 第八節
 *   那幾個坑要一起處理：
 *   ・**相對路徑不必動** —— `/topics/general/` 與 `/preview/topic-lineart/`
 *     都是根目錄下兩層，`../../assets/…` 解出來一模一樣。
 *   ・**`<head>` 那段 SEO 要整個換成 noindex** —— 它裡面的 canonical／og／JSON-LD
 *     全都指向**正式的著陸頁網址**，照抄等於對外宣告一個重複的頁面。
 *   ・**切換條插在最後一個 `</body>` 前面**，用 `lastIndexOf`。
 *   ・**電腦版預覽要插在 `<body>` 的開頭，而且要從 `</head>` 之後才開始找 `<body>`**
 *     —— `<head>` 的註解裡就有四個 `<body>`，直接 match 會插進樣式表中間、不報錯。
 *   ・**計數器不要拿掉**：這七頁只有唯讀的 `data-views`（沒有 `data-views-self`）。
 *   ・**class 一律加 `pv-` 前綴**。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "preview", "topic-lineart");
const SPEC = "general";

/* 線稿的長寬（assets/lineart-general.png）—— 開頁時由圖自己回報，這裡只當後備。 */
const ART = "../../assets/lineart-general.png";
const AR = "832 / 788";

/* ---- 大小 ---------------------------------------------------------------
   側邊：寬度上限用 `calc(100vw - 884px)` 夾住 —— 量出來 ≥1041 時
     「介紹右緣到版心右緣」的空隙 ＝ 100vw − 852px，扣掉 1.6rem 的間距
     還要再留一點，884 是安全值（1200 上算出 316，實測空隙 348）。
   浮水印：用介紹區自己的百分比，手機才跟著縮。 */
const SIZES = {
  s: { name: "小",   side: "min(200px, calc(100vw - 884px))", mark: "min(40%, 180px)" },
  m: { name: "中",   side: "min(260px, calc(100vw - 884px))", mark: "min(52%, 240px)" },
  l: { name: "大",   side: "min(320px, calc(100vw - 884px))", mark: "min(64%, 300px)" },
  x: { name: "特大", side: "min(400px, calc(100vw - 884px))", mark: "min(76%, 360px)" },
};

/* ⚠ 側邊那一格只有 ≥1200 才放得下：1041 上介紹右邊只剩 189px、834 以下只剩 25px。
   ⚠⚠ **「右下」在 ≥834 其實一個字都不會壓到**（實測 1440／1200／1041／834 全部 0%）
     —— 那幾行文字都比介紹區窄（iPad 上一行約 420px、區塊寬 784px），
     右下角是真的空白。**只有手機才會壓到字**（390 上 8~46%）。
     所以多給一格 mark2：只在 ≥834 放，手機就不放。 */
const SPOTS = {
  side:  { name: "右側", min: 1200,
           note: "圖在文字欄外面。⚠ 只在 ≥1200 出現。" },
  mark:  { name: "右下", min: 0,
           note: "墊在介紹區右下角。**手機會壓到字**（大小愈大壓愈多），平板以上不會。" },
  mark2: { name: "右下（平板以上）", min: 834,
           note: "同上，但**手機不放** —— 手機是唯一會壓到字的寬度。" },
  none:  { name: "不放", min: 99999, note: "誠實的選項。" },
};

const INKS = {
  i0: { name: "極淡", v: 0.10 },
  i1: { name: "淡",   v: 0.20 },
  i2: { name: "中",   v: 0.32 },
  i3: { name: "濃",   v: 0.48 },
};

if (!fs.existsSync(path.join(ROOT, "assets", `lineart-${SPEC}.png`))) {
  throw new Error(`找不到 assets/lineart-${SPEC}.png —— 先跑 node tools/topic-lineart.mjs ${SPEC} --art <線稿檔>`);
}
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let html = fs.readFileSync(path.join(ROOT, "topics", SPEC, "index.html"), "utf8");

/* ---- 1. SEO 整段換成 noindex ------------------------------------------- */
/* ⚠ START 那個標記後面還跟著一句「由 tools/topics.mjs 產生，請勿手動編輯」，
   所以**不能用整串比對** —— 只找前綴。 */
const a = html.indexOf("<!-- SEO:START"), b = html.indexOf("<!-- SEO:END -->");
if (a < 0 || b < 0) throw new Error("找不到 SEO:START / SEO:END —— 先跑 node tools/topics.mjs");
html = html.slice(0, a) +
  '<meta name="robots" content="noindex, nofollow, noarchive">' +
  html.slice(b + "<!-- SEO:END -->".length);
if (/rel="canonical"/.test(html)) throw new Error("還留著 canonical —— 它指向正式的著陸頁網址");

/* ⚠ 手寫的那組 og 也在 <head> 裡，一起拿掉：提案頁不該被分享出去。 */
html = html.replace(/^\s*<meta property="og:[^"]*"[^>]*>\s*$/gm, "");
html = html.replace(/<title>[^<]*<\/title>/, "<title>著陸頁的線稿底圖｜提案</title>");

/* ---- 2. 線稿的樣式（全部 pv- 前綴，只作用在這一頁）---------------------- */
const css = `
<style id="pv-lineart">
/* ============================================================================
   線稿底圖 —— 掛在 .tp-intro 的 ::before／::after 上，**不動任何 markup**，
   所以版面高度一個像素都不會變（使用者：「放進來會壓縮到版面，我不要那樣」）。
   ============================================================================ */
:root{ --pv-ink: .20; --pv-w: min(52%, 240px); --pv-ar: ${AR}; }

/* ---- 介紹右側（電腦版）--------------------------------------------------
   ⚠ 只在 ≥1200 開：1041 上介紹右邊只剩 189px（扣掉間距剩 162），
     塞進去會擠成一條；834 以下根本沒有側邊空間。
   ⚠ 寬度用 calc 跟著視窗長並夾上限 —— 寫死 px 在 1200 會溢出版心。 */
@media (min-width: 1200px) {
  body[data-pv-spot="side"] .tp-intro { position: relative; }
  body[data-pv-spot="side"] .tp-intro::after {
    content: ""; position: absolute; left: 100%; top: 50%;
    transform: translateY(-50%); margin-left: 1.6rem;
    width: var(--pv-w); aspect-ratio: var(--pv-ar);
    background: url("${ART}") center / contain no-repeat;
    opacity: var(--pv-ink); pointer-events: none;
  }
}
/* ---- 介紹右下的浮水印（所有寬度都能用）----------------------------------
   ⚠⚠ **不能用 background-image 直接掛在 .tp-intro 身上**（第一版就是，踩到了）：
     background 吃不到 opacity，濃度那條尺對它完全沒作用 —— 手機上它是**全濃度**
     壓在內文底下，量出來「改變的面積 0.0%」就是那個徵兆。改用 ::before ＋ opacity。
   ⚠ 它是 absolute 的偽元素，**不佔高度也不影響換行** —— 這正是「不壓縮版面」的做法。 */
body[data-pv-spot="mark"] .tp-intro,
body[data-pv-spot="mark2"] .tp-intro { position: relative; }
body[data-pv-spot="mark"] .tp-intro::before {
  /* ⚠ right 不能給負值：手機上介紹區已經貼著版心，往外凸就會多出水平捲動
     （踩過，390 上 -1rem 直接讓整頁可以左右拉）。 */
  content: ""; position: absolute; right: 0; bottom: 0;
  width: var(--pv-w); aspect-ratio: var(--pv-ar);
  background: url("${ART}") center / contain no-repeat;
  opacity: var(--pv-ink); pointer-events: none; z-index: 0;
}
/* mark2 ＝ 同一件事，但只在 ≥834（手機不放，那是唯一會壓到字的寬度） */
@media (min-width: 834px) {
  body[data-pv-spot="mark2"] .tp-intro::before {
    content: ""; position: absolute; right: 0; bottom: 0;
    width: var(--pv-w); aspect-ratio: var(--pv-ar);
    background: url("${ART}") center / contain no-repeat;
    opacity: var(--pv-ink); pointer-events: none; z-index: 0;
  }
}
/* ⚠ 內文要壓在浮水印上面，否則字會被蓋住 */
body[data-pv-spot="mark"] .tp-intro > *,
body[data-pv-spot="mark2"] .tp-intro > * { position: relative; z-index: 1; }
/* ⚠⚠ **side 在 <1200 直接不放，不要退成浮水印。**
   手機的介紹區是一整塊密排的字、沒有空白可借，退成浮水印等於偷偷換掉使用者選的東西。 */
</style>`;
html = html.replace("</head>", css + "\n</head>");

/* ---- 3. 切換條（插在最後一個 </body> 前面）------------------------------ */
/* ⚠⚠ 這是模板字串裡的 CSS/JS，**註解裡不能出現反引號**（CLAUDE.md 第九節第 8 條的近親）。 */
const bar = `
<style>
.pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:99;
  background:rgba(244,244,245,.93);backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  border-top:1px solid #cdd0d2;padding:7px 12px calc(7px + env(safe-area-inset-bottom));
  box-shadow:0 -2px 12px rgba(20,24,20,.08);
  font-family:"Noto Sans TC","PingFang TC",system-ui,sans-serif}
.pv-row{display:flex;align-items:center;gap:8px}
.pv-row + .pv-row{margin-top:5px}
.pv-lab{font-size:.72rem;color:#5c5f57;flex:none;width:2.8em;letter-spacing:.04em}
.pv-seg{display:flex;gap:5px;flex:1;min-width:0}
.pv-seg button{flex:1;min-width:0;min-height:32px;border:1px solid #cdd0d2;
  background:#f4f4f5;color:#2a2c27;border-radius:8px;font:inherit;font-size:.76rem;
  cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 .25em}
.pv-seg button[aria-pressed="true"]{background:#3f654a;border-color:#3f654a;color:#f4f4f5;font-weight:500}
.pv-hint{font-size:.7rem;color:#5c5f57;margin-top:5px;line-height:1.5}
.pv-ok{color:#2c5238;font-weight:700}
.pv-no{color:#8a3b2f;font-weight:700}
body{padding-bottom:186px}
/* ---- 電腦版預覽 ---------------------------------------------------------
   ⚠⚠ 使用者所有東西都用手機看，而**側邊那一格只在 ≥1200 出現** ——
     沒有這一塊他會打開只看到一片空白（2026-08-22 踩過，他說「好像沒有欸」）。
     做法：擺真的東西，用 iframe 載同一頁、寬度鎖 1440，再用 transform 縮到手機寬。
   ⚠ iframe 裡帶 frame=1，那一態不再畫這一塊也不畫切換條 —— 否則會遞迴。
   ⚠ 頁首是固定的，所以這一塊要自己讓開它（讀站上同一個 --topic-pad）；
     讓開之後 #main 自己那份上內距就多餘了，這一頁把它收掉。 */
.pv-frame{margin:0;padding:calc(var(--topic-pad, 70px) + 12px) 12px 10px;
  background:#dfe3e5;border-bottom:1px solid #cdd0d2}
body[data-topic] #main{ padding-top: 1rem; }
.pv-fl{font-size:.72rem;color:#5c5f57;line-height:1.5;margin-bottom:8px}
.pv-fw{position:relative;width:100%;overflow:hidden;border-radius:8px;
  box-shadow:0 1px 4px rgba(20,24,20,.16);background:#e2e5e6}
.pv-fw iframe{width:1440px;height:820px;border:0;display:block;
  transform-origin:0 0;transform:scale(var(--pv-k,1))}
</style>
<div class="pv-bar">
  <div class="pv-row"><span class="pv-lab">大小</span><span class="pv-seg" id="pv-z">${
    Object.entries(SIZES).map(([k, s]) => `<button type="button" data-row="z" data-k="${k}" aria-pressed="${k === "m"}">${s.name}</button>`).join("")}</span></div>
  <div class="pv-row"><span class="pv-lab">位置</span><span class="pv-seg" id="pv-s">${
    Object.entries(SPOTS).map(([k, s]) => `<button type="button" data-row="s" data-k="${k}" aria-pressed="${k === "mark"}">${s.name}</button>`).join("")}</span></div>
  <div class="pv-row"><span class="pv-lab">濃度</span><span class="pv-seg" id="pv-i">${
    Object.entries(INKS).map(([k, i]) => `<button type="button" data-row="i" data-k="${k}" aria-pressed="${k === "i1"}">${i.name}</button>`).join("")}</span></div>
  <p class="pv-hint" id="pv-hint"></p>
</div>
<script>
/* ⚠ 網址參數的正規式要寫 [a-z0-9]+（第八節）—— 寫 [a-z]+ 會吃不到帶數字的值。 */
var Z = ${JSON.stringify(SIZES)}, S = ${JSON.stringify(SPOTS)}, I = ${JSON.stringify(INKS)};
var cur = { z: "m", s: "mark", i: "i1" };
(function(){ var q=location.search,m;
  m=q.match(/[?&]size=([a-z0-9]+)/); if(m&&Z[m[1]]) cur.z=m[1];
  m=q.match(/[?&]spot=([a-z0-9]+)/); if(m&&S[m[1]]) cur.s=m[1];
  m=q.match(/[?&]ink=([a-z0-9]+)/);  if(m&&I[m[1]]) cur.i=m[1];
})();

/* ---- 現場算對比度（閉式解，不必抓像素）--------------------------------
   最壞情況 ＝ 字正好壓在**全濃度的線**上：底色 ＝ 紙色與套色按 opacity 混合。
   ⚠ 這和圖多大無關 —— 大小只決定「多少字落在那個底色上」。 */
function lum(c){var f=c.map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
  return 0.2126*f[0]+0.7152*f[1]+0.0722*f[2];}
function cr(a,b){var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);}
var PAPER=[226,229,230], ACC=[63,101,74], INK=[42,44,39], SOFT=[92,95,87];
function ratios(al){
  var bg=PAPER.map(function(p,k){return p*(1-al)+ACC[k]*al;});
  return { ink: cr(INK,bg), soft: cr(SOFT,bg) };
}
/* ---- 大小真正改變的那個量：**有多少字落在圖上** -------------------------
   對比度和圖多大無關，但「多少字會踩到那個底色」完全是大小決定的。
   量法：把介紹區每一段文字的行框拿出來，和浮水印的矩形取交集，除以行框總面積。
   ⚠ 探針要插在 .tp-intro 裡面 —— 寬度是 min(64%, 300px) 這種式子，
     百分比要對得上正確的父層才算得對（掛到 body 上會算成整頁的 64%）。 */
function overlapPct(){
  var it=document.querySelector(".tp-intro"); if(!it) return null;
  var v=getComputedStyle(document.body).getPropertyValue("--pv-w").trim(); if(!v) return null;
  var probe=document.createElement("div");
  probe.style.cssText="position:absolute;visibility:hidden;height:0;width:"+v;
  it.appendChild(probe);
  var w=probe.getBoundingClientRect().width;
  it.removeChild(probe);
  if(!w) return null;
  var h=w*788/832;
  var r=it.getBoundingClientRect();
  var art={left:r.right-w, top:r.bottom-h, right:r.right, bottom:r.bottom};
  var total=0, hit=0, walker=document.createTreeWalker(it, NodeFilter.SHOW_TEXT), n, rng=document.createRange();
  while((n=walker.nextNode())){
    if(!n.nodeValue.trim()) continue;
    rng.selectNodeContents(n);
    var rects=rng.getClientRects();
    for(var i=0;i<rects.length;i++){
      var bx=rects[i], ar=bx.width*bx.height; if(!ar) continue; total+=ar;
      var ox=Math.max(0, Math.min(bx.right,art.right)-Math.max(bx.left,art.left));
      var oy=Math.max(0, Math.min(bx.bottom,art.bottom)-Math.max(bx.top,art.top));
      hit+=ox*oy;
    }
  }
  return total ? 100*hit/total : 0;
}

function apply(push){
  var b=document.body, sp=S[cur.s], sz=Z[cur.z];
  b.dataset.pvSpot=cur.s;
  b.style.setProperty("--pv-ink", I[cur.i].v);
  b.style.setProperty("--pv-w", cur.s.indexOf("mark")===0 ? sz.mark : sz.side);
  ["z","s","i"].forEach(function(k){
    document.querySelectorAll("#pv-"+k+" button").forEach(function(x){
      x.setAttribute("aria-pressed", String(x.dataset.k===cur[k])); }); });

  var r=ratios(I[cur.i].v), head=sz.name+"・"+sp.name+"・"+I[cur.i].name+"　";
  var msg, vw=innerWidth;
  if(cur.s==="none"){ msg="不放。"; }
  else if(vw < sp.min){
    msg="這個寬度（"+vw+"px）<b>不放</b> —— 這一格只在 ≥"+sp.min+" 出現，用上面那個電腦版預覽看。";
  } else {
    /* ⚠⚠ 判準是**有沒有字落在圖上**，不是濃度本身。濃度只決定「壓到的時候有多糟」。 */
    var ov=(cur.s.indexOf("mark")===0) ? overlapPct() : 0;
    if(!ov){
      msg="這個寬度<b class='pv-ok'>沒有任何字落在圖上</b>（0%）—— 濃度只影響好不好看，不影響可讀性。";
    } else {
      msg="有 <b>"+ov.toFixed(0)+"%</b> 的字落在圖上。壓到的地方最壞的底色："+
        "主文 "+r.ink.toFixed(2)+"、<b>次要文字（柔墨）"+r.soft.toFixed(2)+"</b>　"+
        (r.soft>=4.5 ? "<b class='pv-ok'>過</b> 4.5" : "<b class='pv-no'>沒過</b> 4.5 —— 那幾個現場與流程會變糊")+
        "（紙上本來 5.14，臨界濃度 .101）。";
    }
  }
  document.getElementById("pv-hint").innerHTML = head + msg + "　" + sp.note.replace(/\\*\\*(.+?)\\*\\*/g,"<b>$1</b>");
  syncFrame();
  if(push) history.replaceState(null,"","?size="+cur.z+"&spot="+cur.s+"&ink="+cur.i);
}
/* iframe 的縮放：外框寬 ÷ 1440。高度要跟著縮，不然下面會空一大塊。 */
function sizeFrame(){
  var w=document.querySelector(".pv-fw"); if(!w) return;
  var k=w.clientWidth/1440;
  w.style.setProperty("--pv-k",k);
  w.style.height=Math.round(820*k)+"px";
}
function syncFrame(){
  var f=document.getElementById("pv-if"); if(!f) return;
  /* ⚠ 預覽框裡是 1440 —— side 與 mark/mark2 在那個寬度都成立，直接照使用者選的那一格。 */
  var u="?frame=1&size="+cur.z+"&spot="+cur.s+"&ink="+cur.i;
  if(f.getAttribute("src")!==u) f.setAttribute("src",u);
}
addEventListener("resize",sizeFrame);
document.querySelector(".pv-bar").addEventListener("click",function(e){
  var t=e.target.closest("button[data-row]"); if(!t) return;
  cur[t.dataset.row]=t.dataset.k; apply(true);
});
/* frame=1 ＝ 被自己嵌在 iframe 裡的那一份：不畫預覽框也不畫切換條。 */
if (/[?&]frame=1/.test(location.search)) {
  var fr=document.getElementById("pv-frame"); if(fr) fr.remove();
  var br=document.querySelector(".pv-bar"); if(br) br.remove();
  document.body.style.paddingBottom="0";
}
apply(false);
sizeFrame(); syncFrame();
</script>`;

/* ⚠⚠ 電腦版預覽要插在 **<body> 的開頭**，不是切換條旁邊。
   ⚠⚠ **`<body>` 這幾個字在 `<head>` 的註解裡出現四次**（CLAUDE.md 第八節那個坑）——
   直接 match 會抓到註解裡的第一個，整塊就插進樣式表中間、完全不會顯示，
   而且**不報錯**。所以從 `</head>` 之後才開始找。 */
const afterHead = html.indexOf("</head>");
if (afterHead < 0) throw new Error("找不到 </head>");
const bodyTag = html.slice(afterHead).match(/<body[^>]*>/);
if (!bodyTag) throw new Error("找不到真正的 <body>");
const frameBlock = `
<div class="pv-frame" id="pv-frame">
  <div class="pv-fl">電腦版（1440 寬）縮進來看 —— <b>側邊那一格只在 ≥1200 出現</b>，用手機直接看是看不到的。底下那一整頁是手機版本身（切到「介紹右下」就會出現在那裡）。</div>
  <div class="pv-fw"><iframe id="pv-if" title="電腦版預覽" scrolling="no"></iframe></div>
</div>`;
html = html.slice(0, afterHead) + html.slice(afterHead).replace(bodyTag[0], bodyTag[0] + frameBlock);

const i = html.lastIndexOf("</body>");
if (i < 0) throw new Error("找不到 </body>");
html = html.slice(0, i) + bar + "\n" + html.slice(i);

/* ⚠ 三道守門：計數器要留著、不可以有 data-views-self、線稿要真的被引用到。 */
if (!/counter\.js/.test(html)) throw new Error("counter.js 不見了 —— 文章卡的瀏覽次數會印一條「—」");
if (/data-views-self/.test(html)) throw new Error("出現 data-views-self —— 開這一頁會讓正式站多算一次");
if (!html.includes(ART)) throw new Error("線稿沒有被引用到");

fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`✓ preview/topic-lineart/index.html`);
console.log(`  線上：https://fangren.net/preview/topic-lineart/`);
