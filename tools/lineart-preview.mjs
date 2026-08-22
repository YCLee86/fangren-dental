#!/usr/bin/env node
/* 產生 preview/topic-lineart/ —— 著陸頁的線稿底圖（取哪一段 × 放哪裡 × 多濃）
 *
 *   node tools/lineart-preview.mjs
 *
 * 起因（2026-08-22）使用者：「一般牙科的著陸頁並沒有我們剛剛做好的那張圖片，
 * 但那個圖片放進來會壓縮到版面，我不要那樣。我想到把圖片的某個部分做成頁面的底，
 * 但只要保留線條，而且是做成一般牙科的主題綠。你們幫我找看看圖片的區塊哪邊適合
 * （我想到是畫面中間的女醫事人員和老先生對話的部分，或是右邊兩個醫事人員
 *   輕鬆自然和其他人打招呼的樣子，應該節錄他們的半身就好）和放在著陸頁上的位置。」
 * 他另外附了兩張 FRIEND LAB 的 IG 廣告當風格參考：**細線、單色、無填色**。
 *
 * ⚠⚠ **這一頁是 `topics/general/index.html` 的完整複本**，所以 CLAUDE.md 第八節
 *   那幾個坑要一起處理：
 *   ・**相對路徑不必動** —— `/topics/general/` 與 `/preview/topic-lineart/`
 *     都是根目錄下兩層，`../../assets/…` 解出來一模一樣。（複製 index.html 的
 *     提案頁才要往上兩層，這一次不用。）
 *   ・**`<head>` 那段 SEO 要整個換成 noindex** —— 它裡面的 canonical／og／JSON-LD
 *     全都指向**正式的著陸頁網址**，照抄等於對外宣告一個重複的頁面。
 *   ・**切換條插在最後一個 `</body>` 前面**，用 `lastIndexOf` —— 站上的註解裡
 *     就寫著 `</body>` 這幾個字，`String.replace` 會換到註解裡那一個。
 *   ・**計數器不要拿掉**：這七頁只有唯讀的 `data-views`（沒有 `data-views-self`），
 *     不會多算；剝掉反而讓文章卡的瀏覽次數印一條「—」（2026-08-21 踩過）。
 *   ・**class 一律加 `pv-` 前綴** —— 這是完整複本，站上有的短名字幾乎一定會撞。
 *
 * ⚠ 線稿本身由 `tools/topic-lineart.mjs` 產生（那一支是永久的），
 *   這一支只負責把它擺到頁面上讓使用者挑。定案時：把選中的那一組寫進
 *   `index.html` 的 `[data-topic]` 樣式段、刪掉這一頁、文字搬進 history/。
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "preview", "topic-lineart");
const SPEC = "general";

const REGIONS = {
  a: { key: "A", name: "中間・對話", w: 312, h: 196,
       note: "女醫師與老先生在門口說話。⚠ 兩人中間隔著騎樓的窗與椅子，線比較多。" },
  b: { key: "B", name: "右邊・打招呼", w: 228, h: 196,
       note: "兩位醫事人員。背景只有門框的直線，最乾淨的一段。" },
};
/* ⚠ 側邊那一格只有 ≥1200 才放得下：1041 上介紹右邊只剩 189px（扣掉間距剩 162），
   1200 是 348（剩 321）。834 以下完全沒有側邊空間（只剩 25px）。 */
const SPOTS = {
  side: { name: "介紹右側", note: "電腦版介紹右邊那塊空白（1200 上有 348px 完全是空的）。⚠ 只在 ≥1200 出現 —— 1041 只剩 189px、834 以下沒有側邊空間。" },
  mark: { name: "介紹右下", note: "⚠⚠ 墊在內文底下。量出來：濃度 .10 時那一區的中位對比 4.65（剛過 4.5）、.28 掉到 4.09、.45 掉到 3.62；而且線最濃的 2% 會把次要文字壓到 1.2~1.5。**只有「極淡」撐得住。**" },
  none: { name: "不放", note: "手機與 iPad 沒有空白可用，不放是誠實的選項。" },
};
const INKS = { s0: { name: "極淡", v: 0.10 }, s1: { name: "淡", v: 0.28 }, s2: { name: "中", v: 0.45 }, s3: { name: "濃", v: 0.62 } };

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const [k, r] of Object.entries(REGIONS)) {
  execFileSync(process.execPath, [path.join(ROOT, "tools", "topic-lineart.mjs"), SPEC,
    "--region", r.key, "--out", `preview/topic-lineart/line-${k}.png`],
    { cwd: ROOT, stdio: "inherit" });
}

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

/* ⚠ 手寫的那組 og 也在 <head> 裡（og:image 等），一起拿掉：提案頁不該被分享出去。 */
html = html.replace(/^\s*<meta property="og:[^"]*"[^>]*>\s*$/gm, "");
html = html.replace(/<title>[^<]*<\/title>/, "<title>著陸頁的線稿底圖｜提案</title>");

/* ---- 2. 線稿的樣式（全部 pv- 前綴，只作用在這一頁）---------------------- */
const css = `
<style id="pv-lineart">
/* ============================================================================
   線稿底圖 —— 掛在 .tp-intro 的 ::after／background 上，**不動任何 markup**，
   所以版面高度一個像素都不會變（使用者：「放進來會壓縮到版面，我不要那樣」）。
   ============================================================================ */
:root{ --pv-line: url("line-b.png"); --pv-ink: .45; }
body[data-pv-region="a"]{ --pv-line: url("line-a.png"); }
body[data-pv-region="b"]{ --pv-line: url("line-b.png"); }

/* ---- 介紹右側（電腦版）--------------------------------------------------
   ⚠ 只在 ≥1200 開：1041 上介紹右邊只剩 189px（扣掉間距 27 剩 162），
     塞進去會擠成一條；834 以下根本沒有側邊空間。
   ⚠ 寬度用 vw 跟著長，並用 min() 夾住上限 —— 寫死 px 在 1200 會溢出版心。 */
@media (min-width: 1200px) {
  body[data-pv-spot="side"] .tp-intro { position: relative; }
  body[data-pv-spot="side"] .tp-intro::after {
    content: ""; position: absolute; left: 100%; top: 50%;
    transform: translateY(-50%); margin-left: 1.6rem;
    width: min(22vw, 340px); aspect-ratio: var(--pv-ar);
    background: var(--pv-line) center / contain no-repeat;
    opacity: var(--pv-ink); pointer-events: none;
  }
}
/* ---- 介紹右下的浮水印（所有寬度都能用）----------------------------------
   ⚠⚠ **不能用 background-image**（第一版就是，踩到了）：background 吃不到
     opacity，濃度那條尺對它完全沒作用 —— 手機上它是**全濃度**壓在內文底下，
     量出來「改變的面積 0.0%」就是那個徵兆。改用 ::before ＋ opacity。
   ⚠ 它是 absolute 的偽元素，**不佔高度也不影響換行** —— 這正是「不壓縮版面」的做法。
   ⚠ .tp-intro 站上沒有用到 ::before／::after（grep 過），所以借用是安全的；
     側邊那一格用 ::after，兩個不會打架。 */
body[data-pv-spot="mark"] .tp-intro { position: relative; }
body[data-pv-spot="mark"] .tp-intro::before {
  /* ⚠ right 不能給負值：手機上介紹區已經貼著版心，往外凸就會多出水平捲動
     （踩過，390 上 -1rem 直接讓整頁可以左右拉）。 */
  content: ""; position: absolute; right: 0; bottom: 0;
  width: min(58%, 260px); aspect-ratio: var(--pv-ar);
  background: var(--pv-line) center / contain no-repeat;
  opacity: var(--pv-ink); pointer-events: none; z-index: 0;
}
/* ⚠ 內文要壓在浮水印上面，否則字會被蓋住 */
body[data-pv-spot="mark"] .tp-intro > * { position: relative; z-index: 1; }
/* ⚠⚠ **side 在 <1200 直接不放，不要退成浮水印。**
   量過：浮水印墊在內文底下，那一區的中位對比 —— 濃度 .10 是 4.65（剛過站上的 4.5）、
   .28 掉到 4.09、.45 掉到 3.62；而且線最濃的 2% 會把次要文字壓到 1.2~1.5。
   手機的介紹區是一整塊密排的字、沒有空白可借，**放什麼都在吃可讀性**。 */
</style>`;
html = html.replace("</head>", css + "\n</head>");

/* ---- 3. 切換條（插在最後一個 </body> 前面）------------------------------ */
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
.pv-hint{font-size:.7rem;color:#5c5f57;margin-top:4px;line-height:1.45}
body{padding-bottom:150px}
/* ---- 電腦版預覽 ---------------------------------------------------------
   ⚠⚠ 這一塊是 2026-08-22 補的。第一版沒有，使用者在手機上打開只看到一片空白
     （「好像沒有欸」）—— **側邊那一格只在 ≥1200 出現**，而他所有東西都用手機看。
     做法和訊息卡那幾張一樣：**擺真的東西，然後縮到看得到的尺寸**，
     用 iframe 載同一頁、寬度鎖 1440，再用 transform 縮到手機寬。
   ⚠ iframe 裡帶 frame=1，那一態不再畫這一塊也不畫切換條 —— 否則會遞迴。 */
/* ⚠ 頁首是固定的，所以這一塊要自己讓開它 —— 讀站上同一個 --topic-pad
     （著陸頁 #main 的上內距就是讀它，由頁面裡那支腳本現量寫入）。
   ⚠ 讓開之後 #main 自己那份上內距就多餘了，這一頁把它收掉，不然中間會空一大塊。
   ⚠⚠ 這是模板字串裡的 CSS 註解，**不能出現反引號**（CLAUDE.md 第九節第 8 條）。 */
.pv-frame{margin:0;padding:calc(var(--topic-pad, 70px) + 12px) 12px 10px;
  background:#dfe3e5;border-bottom:1px solid #cdd0d2}
body[data-topic] #main{ padding-top: 1rem; }
.pv-fl{font-size:.72rem;color:#5c5f57;line-height:1.5;margin-bottom:8px}
.pv-fw{position:relative;width:100%;overflow:hidden;border-radius:8px;
  box-shadow:0 1px 4px rgba(20,24,20,.16);background:#e2e5e6}
.pv-fw iframe{width:1440px;height:760px;border:0;display:block;
  transform-origin:0 0;transform:scale(var(--pv-k,1))}
</style>
<div class="pv-bar">
  <div class="pv-row"><span class="pv-lab">區塊</span><span class="pv-seg" id="pv-r">${
    Object.entries(REGIONS).map(([k, r]) => `<button type="button" data-row="r" data-k="${k}" aria-pressed="${k === "b"}">${r.name}</button>`).join("")}</span></div>
  <div class="pv-row"><span class="pv-lab">位置</span><span class="pv-seg" id="pv-s">${
    Object.entries(SPOTS).map(([k, s]) => `<button type="button" data-row="s" data-k="${k}" aria-pressed="${k === "side"}">${s.name}</button>`).join("")}</span></div>
  <div class="pv-row"><span class="pv-lab">濃度</span><span class="pv-seg" id="pv-i">${
    Object.entries(INKS).map(([k, i]) => `<button type="button" data-row="i" data-k="${k}" aria-pressed="${k === "s2"}">${i.name}</button>`).join("")}</span></div>
  <p class="pv-hint" id="pv-hint"></p>
</div>
<script>
/* ⚠ 網址參數的正規式要寫 [a-z0-9]+（第八節）—— 寫 [a-z]+ 會吃不到帶數字的值。 */
var R = ${JSON.stringify(REGIONS)}, S = ${JSON.stringify(SPOTS)}, I = ${JSON.stringify(INKS)};
var cur = { r: "b", s: "side", i: "s2" };
(function(){ var q=location.search,m;
  m=q.match(/[?&]region=([a-z0-9]+)/); if(m&&R[m[1]]) cur.r=m[1];
  m=q.match(/[?&]spot=([a-z0-9]+)/);   if(m&&S[m[1]]) cur.s=m[1];
  m=q.match(/[?&]ink=([a-z0-9]+)/);    if(m&&I[m[1]]) cur.i=m[1];
})();
function apply(push){
  var b=document.body;
  b.dataset.pvRegion=cur.r; b.dataset.pvSpot=cur.s;
  b.style.setProperty("--pv-ink", I[cur.i].v);
  b.style.setProperty("--pv-ar", R[cur.r].w + " / " + R[cur.r].h);
  ["r","s","i"].forEach(function(k){
    document.querySelectorAll("#pv-"+k+" button").forEach(function(x){
      x.setAttribute("aria-pressed", String(x.dataset.k===cur[k])); }); });
  document.getElementById("pv-hint").textContent =
    R[cur.r].name + "・" + S[cur.s].name + "・" + I[cur.i].name + "　" + R[cur.r].note + "　" + S[cur.s].note;
  syncFrame();
  if(push) history.replaceState(null,"","?region="+cur.r+"&spot="+cur.s+"&ink="+cur.i);
}
/* iframe 的縮放：外框寬 ÷ 1440。高度要跟著縮，不然下面會空一大塊。 */
function sizeFrame(){
  var w=document.querySelector(".pv-fw"); if(!w) return;
  var k=w.clientWidth/1440;
  w.style.setProperty("--pv-k",k);
  w.style.height=Math.round(760*k)+"px";
}
function syncFrame(){
  var f=document.getElementById("pv-if"); if(!f) return;
  var u="?frame=1&region="+cur.r+"&spot=side&ink="+cur.i;
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
   第一版跟著切換條放在 </body> 前面 —— 那是整頁的最底下，使用者在手機上
   打開只看到原本的著陸頁、什麼都沒有（「好像沒有欸」）。 */
/* ⚠⚠ **`<body>` 這幾個字在 `<head>` 的註解裡出現四次**（CLAUDE.md 第八節那個坑）——
   直接 match 會抓到註解裡的第一個，整塊就插進樣式表中間、完全不會顯示，
   而且**不報錯**（第一版就是這樣：使用者在手機上看只看到原本的頁）。
   所以從 `</head>` 之後才開始找。 */
const afterHead = html.indexOf("</head>");
if (afterHead < 0) throw new Error("找不到 </head>");
const bodyTag = html.slice(afterHead).match(/<body[^>]*>/);
if (!bodyTag) throw new Error("找不到真正的 <body>");
const frameBlock = `
<div class="pv-frame" id="pv-frame">
  <div class="pv-fl">電腦版（1440 寬）縮進來看 —— 側邊那一格只在 ≥1200 出現，用手機直接看是看不到的。底下那一整頁是手機版本身。</div>
  <div class="pv-fw"><iframe id="pv-if" title="電腦版預覽" scrolling="no"></iframe></div>
</div>`;
html = html.slice(0, afterHead) + html.slice(afterHead).replace(bodyTag[0], bodyTag[0] + frameBlock);

const i = html.lastIndexOf("</body>");
if (i < 0) throw new Error("找不到 </body>");
html = html.slice(0, i) + bar + "\n" + html.slice(i);

/* ⚠ 兩道守門：計數器要留著、而且不可以有 data-views-self（2026-08-21 那一輪的教訓）。 */
if (!/counter\.js/.test(html)) throw new Error("counter.js 不見了 —— 文章卡的瀏覽次數會印一條「—」");
if (/data-views-self/.test(html)) throw new Error("出現 data-views-self —— 開這一頁會讓正式站多算一次");

fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`✓ preview/topic-lineart/index.html`);
console.log(`  線上：https://fangren.net/preview/topic-lineart/`);
