#!/usr/bin/env node
/* 科別色的提案頁產生器（換一顆科別色，逐案在真實版面上比）。
 *
 *   node tools/spec-color-preview.mjs prosth   → preview/spec-prosth-line58/
 *   node tools/spec-color-preview.mjs ortho    → preview/spec-ortho-twosteps/
 *
 * ⚠⚠ **2026-08-31 兩頁都已定案上線並刪除**（矯正深階 `#31637f`、植牙 Ⓒ
 *   `#465885`／`#182b4c`），推導在 `/history/spec-ortho-deep.html` 與
 *   `/history/spec-prosth-line58.html`。**所以下面 CANDS 的 "現況" 已經不是現況了，
 *   現在站上跑的是 Ⓒ；ORTHO 的 g0 也不是現況，是舊值。** 這一支留著是為了
 *   下一次要換某一顆科別色時還跑得動 —— 重開之前先把候選表換掉。
 *
 * 2026-08-31 植牙・假牙重建這一輪寫的：使用者拍了富山路面電車的路線圖，
 * 「5、8 號線的顏色看起來跟植牙假牙贗復的標籤主題色很像」，要一份套色預覽
 * 和現在版本的比較。同一天他在提案頁上看出矯正的深階不對，於是長出第二頁。
 *
 * ⚠⚠ **快照取的是 `topics/<spec>/index.html`，不是 `index.html`。** 理由是那一頁
 *   把這顆色的每一種用法一次擺齊，而且**全部在「亮起來」那一態**：
 *   ・那一科的 chip `aria-current="page"` ＝ 套色填滿
 *   ・文章卡的 `.card-tag.tag-on` ＝ 套色填滿（產生時寫死的，不是 JS 加的）
 *   ・醫師的專長 `.sk.tag-on` ＝ 套色 12% 淡填、專科藥丸 `.doc-role.tag-off` ＝ 白底
 *   ・內文的 `<strong>`、流程的標號 ＝ 深階
 *   ・介紹區右下角的線稿底圖 ＝ 套色（**烘進 PNG**，見下面）
 *   首頁不篩選的時候只看得到「白底＋深階的字」那一態，比不出填色。
 *
 * ⚠ 它和 `preview/<name>/` **同樣深兩層**，所以 `../../assets/` 的相對路徑不必改
 *   （`index.html` 的完整複本才要改，CLAUDE.md 第八節那四件事）。
 *   counter.js 也留著：著陸頁只有唯讀的 `data-views`、沒有 `data-views-self`，
 *   開幾次都不會讓首頁的計數多跳。
 *
 * ⚠⚠ **線稿底圖的顏色是烘進 PNG 的**（`tools/topic-lineart.mjs`），
 *   所以換色不能只改 CSS —— 這一支會用 `--color` 幫每個候選各產一張，
 *   放進提案頁的資料夾裡，切換時連圖一起換。**提案頁擺的必須是真的產出檔。**
 *   ⚠ 只有**填色**變的時候才要重產（線稿吃的是套色那一階）。矯正這一輪只動
 *   白底上的字那一階，`assets/lineart-ortho.png` 一個位元組都不必動 ——
 *   所以那一頁 `HAS_LA` 是 false，`--pv-la` 不會被設，圖走 CSS 原本那個值。
 *
 * ⚠ 切換條是**即時套用不重新載入**：這一輪只改顏色，不影響任何
 *   「開頁量一次」的 JS（`sizeLabels`、`--topic-pad`、卡片折行那幾支量的是
 *   字面框與幾何，和顏色無關）。判準見 CLAUDE.md 第八節 back-to-top 那一段。
 *
 * ⚠ 覆寫要寫成 `html [data-spec="…"]`（0,1,1）才一定贏得過站上那條
 *   `[data-spec="…"]`（0,1,0）—— 靠排序決勝的話，日後樣式表一搬位置就失效。
 *
 * ⚠⚠ **模板字串裡的換行一律寫 `\\n` 不是 `\n`** —— 這一支整段切換條是 JS 的
 *   模板字串，`\n` 會在**產生的當下**就變成真的換行，把產出頁面裡那個字串
 *   從中間切斷、整支腳本語法錯誤（2026-08-31 踩過）。最後有一道守門在擋。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const spec = process.argv[2] || "prosth";

/* ---- 植牙的候選 -----------------------------------------------------------
   量測：富山路面電車 5・8 號線那條深藍，八段逐段取中位數之後
   用旁邊的看板底色做白平衡還原（做法與數字寫在 PALETTE.md 六之二十二）。
   ・看板當純白還原 → #3f527e
   ・看板當米白 #F2EDE4 還原 → #3c4c71
   兩個白點假設都合理，所以兩個都給使用者看。
   Ⓒ 是站上既有的做法（兒牙那一輪定的）：**顏色的出處是色相，不是那個 HEX** ——
   取實測的色相與彩度，只把亮度拉回七科的家族帶（L* 36~48）。
   深階三案共用一顆：色相跟著實測走（281.5）、佔色域比例照現行深階的 74%、
   亮度挑在「對矯正深階的 ΔE 不低於現行那 10.5」的那一格（L* 17.5）。 */
const CANDS = [
  { k: "now", label: "舊值",        fill: "#335b8b", deep: "#182f4b" },   /* ⚠ 2026-08-31 起這不是現況了 */
  { k: "a",   label: "Ⓐ 實測原值",  fill: "#3f527e", deep: "#182b4c" },
  { k: "b",   label: "Ⓑ 實測較深",  fill: "#3c4c71", deep: "#182b4c" },
  { k: "c",   label: "Ⓒ 亮度回家族帶（定案）", fill: "#465885", deep: "#182b4c" },
];

/* ---- 矯正的深階（2026-08-31 使用者在提案頁上看出來的）------------------------
   「矯正的深階字套色顏色看起來很深，反而很像假牙重建的顏色。」**他是對的**：
   同一排標記上，**被選到那顆用填色、其餘六顆用深階**，所以真正並排的是
   「矯正深階 × 植牙填色」—— 而那一對 ΔE 只有 **11.3**，其他六科的深階對植牙填色
   是 27~87。色相更只差 0.7°（273.9 vs 273.2），本來就是同一支藍。

   ⚠⚠ **這一格 PALETTE.md 從來沒有算過** —— 全篇比的是「填色對填色、深階對深階」，
     而標記那一排上不會有兩顆同時填色。下一次動任何科別色都要把這個交叉的算進去。

   ⚠⚠ **只提亮是陷阱，不要放進候選**：同色相往上提會直接撞進植牙的填色
     （L*37.9 那一格算出來是 `#335b8c`，對現行植牙填色 ΔE **0.6**），
     四種植牙候選的最小值只剩 5.0~7.2，比現況還糟。
     **卡住的不是亮度，是「矯正和植牙同色相」** —— 要治就得動色相。
   ⚠ Ⓖ3 的 h 249 正好是**矯正原本那一支藍**（`#3C596B` 是 h 248.1，
     2026-08-10 換成 `#4478b5` 之前用的就是它），不是憑空挑的。
   ⚠ 代價：Ⓖ1~Ⓖ3 會讓矯正變成全站唯一「兩階不同色相」的科（Δh 17~24°）。
     牙周 2026-08-09 的 Ⓟ Ⓠ 就是被這一條擋下來的，那次有同色相的路可走，這次沒有。 */
/* ⚠ 2026-08-31 定案 Ⓖ3 `#31637f` 並上線，`preview/spec-ortho-twosteps/` 已刪除、
   文字在 `/history/spec-ortho-deep.html`。這一份留著是為了：① 那一頁要重開時
   還跑得動 ② 植牙那一頁的 `st.o` 預設值要指到現在站上跑的那一顆。
   **所以 g0 已經不是「現況」了，是舊值。** */
const ORTHO = [
  { k: "g0", label: "舊值 #244369", deep: "#244369" },
  { k: "g1", label: "Ⓖ1 偏藍",      deep: "#274f6a" },
  { k: "g2", label: "Ⓖ2 偏藍・提亮", deep: "#2c5977" },
  { k: "g3", label: "Ⓖ3 原本那支藍（定案）", deep: "#31637f" },
];

/* ---- 第三輪：植牙的深階要不要提亮（2026-08-31 使用者在成品上看出來的）--------
   「內文的字可以也調看看？現在的看起來很深色很黑。」**他是對的，而且有一格數字
   直接說明了為什麼**：

     全站的墨 `--ink #2a2c27` 是 **L* 17.6**，而植牙的深階是 **L* 17.7** ——
     那顆「彩色的重點字」和普通黑字**一樣深**，所以讀起來就是黑的，不是藍的。

   ⚠⚠ **它被壓那麼深是有歷史原因的，而那個原因今天已經消失了**：2026-08-09 為了
     讓牙周（後來整組給矯正）的深階活下來，植牙的字階被往下探到 L* 18.9
     （六之十四節：「這一組能成立完全靠贋復的字階讓到 L* 18.9」）。
     **矯正的深階 2026-08-31 已經搬到 `#31637f`，兩者現在 ΔE 25.4** —— 約束解除。
   ⚠ 它也是全站唯一的離群值：深階 L* 17.7 比第二深的根管（30.7）還深 **13.1 階**；
     兩階落差 20.1 是全站最大（其餘 5.9~15.1）—— 和今天早上矯正那 21.6 是同一種病。
   ⚠ 四案的對比度都很寬鬆（對紙 7.4~11.1），這一輪卡不到 AA，純粹是「讀起來像不像
     一個顏色」。 */
const PROSTH_DEEP = [
  { k: "d0", label: "現況（和黑字一樣深）", deep: "#182b4c" },
  { k: "d1", label: "Ⓓ1 提亮一階",        deep: "#213962" },
  { k: "d2", label: "Ⓓ2 提亮兩階",        deep: "#263f6c" },
  { k: "d3", label: "Ⓓ3 回到家族的深度",   deep: "#2a4677" },
];

/* ---- 每一頁要做什麼 --------------------------------------------------------
   ⚠ demo ＝「兩階並排」的示範（2026-08-31 使用者：「不同色相是什麼意思，我看不懂」）。
     它把**同一顆標記的兩態**擺在一起：被選到（填色）與沒被選到（白底＋深階的字），
     再放一組口腔外科當對照（那一科的兩階色相只差 0.5°，是全站的常態）。
     ⚠⚠ 用的是**站上自己的 class**（`.chips` ＋ `[data-spec]` ＋ `aria-current`），
       不是拿 CSS 另外做一份假的 —— 假的哪天樣式改了這一頁就開始說謊
       （同 og-topic-card 那一輪「提案頁要擺真的產出檔」）。
     ⚠ 示範裡的 `<a>` **不給 href**，並且 `pointer-events: none` —— 它是拿來看的，
       點下去換頁就毀了現場。 */
const PAGES = {
  prosth: { dir: "spec-prosth-line58",  rows: ["c"],      lineart: true,  demo: false },
  ortho:  { dir: "spec-ortho-twosteps", rows: ["o"],      lineart: false, demo: true  },
  /* 第三輪：只調植牙的深階。⚠ 線稿吃的是**填色**、這一輪沒動，所以 lineart 是 false；
     但**分享圖的帶子吃深階**，定案時要跟著重跑（補償色要重校）。 */
  "prosth-deep": { dir: "spec-prosth-deep", rows: ["d"], lineart: false, demo: false, spec: "prosth" },
};
const PAGE = PAGES[spec];
const SPEC = PAGE && PAGE.spec ? PAGE.spec : spec;   /* 頁面代碼 ≠ 科別代碼時（prosth-deep）用這個 */
if (!PAGE) { console.error(`× 這一支只做 ${Object.keys(PAGES).join(" / ")}`); process.exit(1); }

/* 線稿要用哪一張原檔重產（＝ CLAUDE.md 定案表裡那一行指令的參數） */
const LINEART = {
  prosth: { art: "drafts/lineart-prosth-v2.jpg", crop: "36,83,972,896", flip: false },
};

const dir = path.join(ROOT, "preview", PAGE.dir);
fs.mkdirSync(dir, { recursive: true });

/* ---- 1. 各候選的線稿 ------------------------------------------------------ */
const la = PAGE.lineart ? LINEART[SPEC] : null;
if (la) {
  for (const c of CANDS) {
    const out = path.join(dir, `la-${c.k}.png`);
    const args = [path.join(ROOT, "tools/topic-lineart.mjs"), SPEC,
      "--art", la.art, "--crop", la.crop, "--color", c.fill, "--out", path.relative(ROOT, out)];
    if (la.flip) args.push("--flip");
    execFileSync("node", args, { cwd: ROOT, stdio: "pipe" });
    process.stdout.write(`  線稿 ${c.label} → ${path.basename(out)} ${c.fill}\n`);
  }
}

/* ---- 2. 快照 -------------------------------------------------------------- */
const src = path.join(ROOT, "topics", SPEC, "index.html");
if (!fs.existsSync(src)) { console.error(`× 找不到 ${src}`); process.exit(1); }
let h = fs.readFileSync(src, "utf8");

/* noindex（提案頁自己那一道；Worker 的 X-Robots-Tag 與 robots.txt 已就位） */
h = h.replace(/<meta name="robots"[^>]*>/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
if (!/noindex/.test(h)) throw new Error("noindex 沒有寫進去");

/* 線稿改吃變數（url 只出現一次，@media 那一段只調大小與濃度） */
if (PAGE.lineart) {
  const reLa = new RegExp(`background: url\\("(\\.\\./\\.\\./assets/lineart-${SPEC}\\.png)"\\) no-repeat;`);
  if (!reLa.test(h)) throw new Error(`接不到 ${SPEC} 的線稿那一行 —— 站上的寫法變了`);
  h = h.replace(reLa, `background-image: var(--pv-la, url("$1")); background-repeat: no-repeat;`);
}

/* ---- 3. 切換條 ------------------------------------------------------------
   ⚠ 樣式一定要在 <head> 裡：塞在頁尾的話，切換條在樣式表之前就被解析出來，
     開頁那 180ms 會整條閃出來（head-search 那一輪踩過）。 */
const css = `
<style>
/* pv 前綴：這一份是著陸頁的完整快照，站上有的 class 全都在，短名字幾乎一定會撞 */
.pvbar{position:fixed;left:0;right:0;bottom:0;z-index:99;background:rgba(24,22,20,.93);
  backdrop-filter:blur(8px);color:#e8e6e2;font:500 13px/1.4 system-ui,sans-serif;
  padding:8px 10px calc(8px + env(safe-area-inset-bottom));max-height:24vh;overflow:auto}
.pvbar.is-min{max-height:none;padding:4px 10px}
.pvbar.is-min .pvrow,.pvbar.is-min .pvout,.pvbar.is-min .pvdemo{display:none}
.pvrow{display:flex;gap:5px;align-items:center;margin:4px 0;flex-wrap:nowrap;overflow-x:auto}
.pvrow b{flex:none;width:2.6em;color:#a8a49e;font-weight:500}
.pvbar button{flex:none;border:1px solid #4a4642;background:#2a2724;color:#e8e6e2;
  border-radius:7px;padding:5px 9px;font:inherit;min-height:30px;cursor:pointer}
.pvbar button[aria-pressed="true"]{background:#e8e6e2;color:#1c1a18;border-color:#e8e6e2}
.pvout{margin-top:5px;font-size:11.5px;line-height:1.55;color:#c9c5bf;white-space:pre-wrap}
.pvout .bad{color:#ff9a8a}.pvout .ok{color:#9fd6a0}
.pvout b{color:#e8e6e2}
.pvout i{width:20px;height:12px;border-radius:3px;display:inline-block;vertical-align:-1px}
/* 兩階並排的示範：擺在紙色上，因為站上那一排標記就是站在紙色上的 */
.pvdemo{background:var(--paper);color:var(--ink);border-radius:10px;padding:8px 10px;margin:6px 0}
.pvdemo .t{font-size:11.5px;color:#5c5f57;margin:0 0 5px}
.pvdemo .g{display:flex;gap:10px;align-items:center;margin:0 0 6px;flex-wrap:wrap}
.pvdemo .g:last-child{margin-bottom:0}
.pvdemo .n{font-size:11.5px;color:#5c5f57;flex:none;width:5.2em}
.pvdemo ul.chips{margin:0;flex:1 1 auto;overflow:visible}
.pvdemo ul.chips a{pointer-events:none}
.pvmin{position:fixed;right:10px;bottom:calc(6px + env(safe-area-inset-bottom));z-index:100;
  border:1px solid #4a4642;background:rgba(24,22,20,.93);color:#e8e6e2;border-radius:8px;
  padding:5px 9px;font:500 12px system-ui,sans-serif;min-height:30px}
</style>`;
h = h.replace("</head>", css + "\n<style id=\"pvspec\"></style>\n</head>");

/* 示範用的兩顆標記：同一科、兩種狀態。用站上自己的 markup 與 class。 */
const pair = (sp, name) =>
  `<ul class="chips"><li><a data-spec="${sp}" aria-current="page">${name}</a></li>` +
  `<li><a data-spec="${sp}">${name}</a></li></ul>`;
const demo = !PAGE.demo ? "" : `
  <div class="pvdemo">
    <p class="t">同一顆標記的兩態：<b>左＝被選到（填色）・右＝沒被選到（字與框吃深階）</b>。同色相 ＝ 左右是同一個顏色的深淺。</p>
    <div class="g"><span class="n">齒顎矯正</span>${pair("ortho", "齒顎矯正")}</div>
    <div class="g"><span class="n">口腔外科<br>（對照）</span>${pair("surg", "口腔外科")}</div>
  </div>`;

const rowC = `  <div class="pvrow"><b>植牙</b>${CANDS.map(c => `<button data-k="c" data-v="${c.k}">${c.label}</button>`).join("")}</div>\n`;
const rowD = `  <div class="pvrow"><b>重點字</b>${PROSTH_DEEP.map(c => `<button data-k="d" data-v="${c.k}">${c.label}</button>`).join("")}</div>\n`;
const rowO = `  <div class="pvrow"><b>矯正</b>${ORTHO.map(c => `<button data-k="o" data-v="${c.k}">${c.label}</button>`).join("")}</div>\n`;

const bar = `
<div class="pvbar" id="pvbar">
${PAGE.rows.includes("c") ? rowC : ""}${PAGE.rows.includes("o") ? rowO : ""}${PAGE.rows.includes("d") ? rowD : ""}${demo}
  <div class="pvout" id="pvout">量測中…</div>
</div>
<button class="pvmin" id="pvmin">收起</button>
<script>
(function(){
  var CANDS=${JSON.stringify(CANDS)}, ORTHO=${JSON.stringify(ORTHO)}, DEEPS=${JSON.stringify(PROSTH_DEEP)};
  /* ⚠⚠ 哪幾條覆寫規則要發出去，由這一頁有哪幾排決定 —— **不能全部都發**：
     CANDS 那一條會同時設 --accent 與 --accent-deep，而它的 'now' 已經是**舊值**，
     在沒有植牙那一排的頁面上發出去，等於把站上剛換好的填色改回舊的。 */
  var ROWS=${JSON.stringify(PAGE.rows)};
  var HAS_LA=${PAGE.lineart}, SPEC=${JSON.stringify(spec)}, DEMO=${PAGE.demo};
  var bar=document.getElementById('pvbar'), out=document.getElementById('pvout'),
      sty=document.getElementById('pvspec');
  var PAPER='#e2e5e6', CARD='#f4f4f5', WHITE='#ffffff';
  var ORTHO_FILL='#4478b5', SURG_FILL='#8e6299', SURG_DEEP='#784e84';
  /* 其餘五科：填色與深階都列，因為標記那一排上被選到的用填色、其他用深階 */
  var NB=[{n:'牙周',f:'#317d78',d:'#2a6d69'},{n:'一般',f:'#3f654a',d:'#2c5238'},
          {n:'兒牙',f:'#c28229',d:'#9e6301'},{n:'根管',f:'#ae4f4d',d:'#89202d'},
          {n:'口外',f:'#8e6299',d:'#784e84'},{n:'全部',f:'#5f5d5c',d:'#4c4948'}];

  var st={c:'now', o:'g3', d:'d0'};   /* ⚠ 預設一律指到站上現在跑的那一顆 */
  /* ⚠ 正規式寫 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 g0 這種帶數字的值（CLAUDE.md 第八節） */
  var qs=new URLSearchParams(location.search);
  ['c','o','d'].forEach(function(k){var v=qs.get(k);
    if(v && /^[a-z0-9]+$/.test(v) && list(k).some(function(x){return x.k===v;})) st[k]=v;});
  function list(k){ return k==='c'?CANDS:(k==='o'?ORTHO:DEEPS); }
  function cur(k){ return list(k).filter(function(x){return x.k===st[k];})[0]; }

  function hx(h){return [1,3,5].map(function(i){return parseInt(h.substr(i,2),16);});}
  function lum(c){var s=c.map(function(x){x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);});
    return .2126*s[0]+.7152*s[1]+.0722*s[2];}
  function cr(a,b){var l1=lum(hx(a)),l2=lum(hx(b));return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
  function lab(h){var c=hx(h).map(function(x){x/=255;return x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);});
    var X=(.4124564*c[0]+.3575761*c[1]+.1804375*c[2])/.95047,
        Y=(.2126729*c[0]+.7151522*c[1]+.0721750*c[2]),
        Z=(.0193339*c[0]+.1191920*c[1]+.9503041*c[2])/1.08883;
    var f=function(t){return t>.008856?Math.cbrt(t):7.787*t+16/116;};
    return [116*f(Y)-16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))];}
  /* ⚠ ΔE 用 CIE76（ΔE*ab）—— PALETTE.md 全篇記的就是這一把尺
     （矯正×贋復 13.3／10.5 用它算出來逐位數對得上）。換 CIEDE2000 會得到
     11.1／6.9，數字對不上文件，後人會以為顏色被動過。 */
  function dE(a,b){var A=lab(a),B=lab(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);}
  function lch(h){var L=lab(h);return [L[0],Math.hypot(L[1],L[2]),(Math.atan2(L[2],L[1])*180/Math.PI+360)%360];}
  /* 色相是繞一圈的，差值要收進 ±180 */
  function dh(a,b){var d=Math.abs(lch(a)[2]-lch(b)[2])%360; return d>180?360-d:d;}
  function f1(n){return n.toFixed(1);} function f2(n){return n.toFixed(2);}
  function mark(v,t){return v>=t?'<span class="ok">'+f2(v)+' ✓</span>':'<span class="bad">'+f2(v)+' ✗</span>';}
  function sw(c){return '<i style="background:'+c+'"></i>';}

  function apply(){
    var c=cur('c'), o=cur('o');
    /* ⚠⚠ 目標科別一律寫死，**不可以用當頁的 spec**（2026-08-31 踩過：
       矯正那一頁的 SPEC 是 'ortho'，套進去會把植牙候選的填色蓋到矯正頭上）。
       ⚠⚠ 而且**只發這一頁真的有那一排的規則** —— CANDS 那一條會同時設
       --accent 與 --accent-deep，它的 'now' 已經是舊值，發出去等於改回舊色。 */
    sty.textContent=
      (ROWS.indexOf('c')>=0 ? 'html [data-spec="prosth"]{--accent:'+c.fill+';--accent-deep:'+c.deep+';}' : '')+
      (ROWS.indexOf('o')>=0 ? 'html [data-spec="ortho"]{--accent-deep:'+o.deep+';}' : '')+
      (ROWS.indexOf('d')>=0 ? 'html [data-spec="prosth"]{--accent-deep:'+cur('d').deep+';}' : '')+
      (HAS_LA ? ':root{--pv-la:url("la-'+c.k+'.png");}' : '');
    bar.querySelectorAll('button[data-k]').forEach(function(b){
      b.setAttribute('aria-pressed', String(st[b.dataset.k]===b.dataset.v));});
    var u=new URL(location); ROWS.forEach(function(k){u.searchParams.set(k,st[k]);});
    history.replaceState(null,'',u);
    measure();
  }
  function measure(){
    var c=cur('c'), o=cur('o');
    var L=lch(c.fill), D=lch(o.deep);
    /* ⚠⚠ 這一行才是這一輪的主角：同一排標記上，被選到那顆用**填色**、
       其餘六顆用**深階**，所以真正並排的是「矯正深階 × 植牙填色」。
       PALETTE.md 全篇只算填色對填色、深階對深階，漏掉的就是這一格。 */
    var cross=dE(o.deep, c.fill);
    var others=NB.map(function(n){return {n:n.n, v:dE(n.d, c.fill)};});
    var minOther=others.reduce(function(a,b){return b.v<a.v?b:a;});
    var hs=document.documentElement.scrollWidth>document.documentElement.clientWidth;
    var oh=dh(ORTHO_FILL, o.deep), sh=dh(SURG_FILL, SURG_DEEP);
    var tail = hs ? '<span class="bad">⚠ 有水平捲動</span>' : '<span class="ok">無水平捲動</span>';
    /* 這一輪的判準不是 AA（四案的對比度都很寬鬆），是「讀起來像不像一個顏色」——
       關鍵的一格是：全站的墨 --ink #2a2c27 是 L* 17.6，重點字如果也在那個深度，
       眼睛就只會讀到黑。所以面板第一行報的是「比全站的墨亮幾階」。 */
    if(ROWS.indexOf('d')>=0){
      var dd=cur('d'), D2=lch(dd.deep), INK=lch('#2a2c27')[0], FILL=lch('#465885')[0];
      var above=D2[0]-INK;
      out.innerHTML=
        sw(dd.deep)+' 重點字 '+dd.deep+' L*'+f1(D2[0])+' h'+f1(D2[2])+
        '　'+sw('#2a2c27')+' 全站的墨 #2a2c27 L*'+f1(INK)+'\\n'+
        '<b>比全站的墨亮 '+f1(above)+' 階</b>　'+
        (above<2 ? '<span class="bad">幾乎一樣深 —— 讀起來會是黑的，不是這一科的顏色</span>'
         : above<8 ? '<span class="ok">看得出是顏色了</span>'
                   : '<span class="ok">明顯是一個顏色</span>')+
        '　字對卡 '+mark(cr(dd.deep,CARD),4.5)+'　對紙 '+mark(cr(dd.deep,PAPER),4.5)+'\\n'+
        '兩階落差 '+f1(FILL-D2[0])+'（家族 5.9~15.1，現況 20.1 是全站最大）'+
        '　對其他七科最小 ΔE '+f1(Math.min.apply(null,NB.map(function(n){return dE(dd.deep,n.d);})
          .concat([dE(dd.deep,'#31637f'),dE(dd.deep,'#465885')])))+
        '　視窗 '+innerWidth+'×'+innerHeight+'　'+tail;
      return;
    }
    var head = DEMO
      ? sw(ORTHO_FILL)+' 矯正填色 #4478b5 h'+f1(lch(ORTHO_FILL)[2])+
        '　'+sw(o.deep)+' 矯正深階 '+o.deep+' h'+f1(D[2])+'\\n'+
        '<b>矯正這兩階的色相差 Δh '+f1(oh)+'°</b>　'+
        (oh<=5 ? '<span class="ok">同色相（＝同一個顏色的深淺，和其他六科一樣）</span>'
               : '<span class="bad">不同色相（左右是兩個顏色，全站唯一）</span>')+
        '　對照 口外 '+f1(sh)+'°・其他六科 0.2~4.1°\\n'
      : sw(c.fill)+' 植牙填色 '+c.fill+' L*'+f1(L[0])+' h'+f1(L[2])+
        '　'+sw(o.deep)+' 矯正深階 '+o.deep+' L*'+f1(D[0])+' h'+f1(D[2])+'\\n';

    /* ⚠ 示範頁的面板刻意只印兩行：那一頁的主角是上面那組並排的標記，
       切換條連示範一起要收在 24vh 之內（CLAUDE.md 第八節：不能吃掉半個畫面）。 */
    out.innerHTML = DEMO
      ? head +
        '字對卡 '+mark(cr(o.deep,CARD),4.5)+'　對紙 '+mark(cr(o.deep,PAPER),4.5)+
        '　兩階落差 '+f1(49.5-D[0])+'（家族 5.9~15.1）'+
        '　對植牙填色 ΔE '+f1(cross)+'　'+tail
      : head +
        '<b>矯正深階 × 植牙填色（同一排標記上並排）：ΔE '+f1(cross)+'</b>　'+
        (cross>=13 ? '<span class="ok">分得開（比現況那 11.3 好）</span>'
         : cross>=9 ? '<span class="ok">和現況那 11.3 差不多</span>'
         : cross>=6.1 ? '<span class="bad">比現況更像（現況 11.3）</span>'
                      : '<span class="bad">低於出局線 6.1</span>')+'\\n'+
        '對照：其餘五科的深階對這個填色最小的是 '+minOther.n+' '+f1(minOther.v)+
        '（'+others.map(function(x){return x.n+f1(x.v);}).join('・')+'）\\n'+
        '白字在塊 '+mark(cr(c.fill,WHITE),4.5)+'　塊對紙 '+mark(cr(c.fill,PAPER),3)+
        '　矯正深階對卡 '+mark(cr(o.deep,CARD),4.5)+'　對紙 '+mark(cr(o.deep,PAPER),4.5)+
        '　矯正兩階落差 '+f1(49.5-D[0])+'（家族 5.9~15.1）\\n'+
        '植牙深階 '+c.deep+' 對卡 '+mark(cr(c.deep,CARD),4.5)+'　對紙 '+mark(cr(c.deep,PAPER),4.5)+
        '　視窗 '+innerWidth+'×'+innerHeight+'　'+tail;
  }
  bar.addEventListener('click', function(e){
    var b=e.target.closest('button[data-k]'); if(!b) return;
    st[b.dataset.k]=b.dataset.v; apply();
  });
  document.getElementById('pvmin').addEventListener('click', function(){
    bar.classList.toggle('is-min');
    this.textContent = bar.classList.contains('is-min') ? '打開' : '收起';
  });
  addEventListener('resize', function(){clearTimeout(window.__pvt);window.__pvt=setTimeout(measure,120);});
  apply();
})();
</script>
`;
/* ⚠ 一定要用 lastIndexOf：這一站的註解裡就寫著結束標籤那幾個字，
   String.replace 會換到註解裡那一個（CLAUDE.md 第八節）。 */
const i = h.lastIndexOf("</body>");
if (i < 0) throw new Error("找不到 </body>");
h = h.slice(0, i) + bar + h.slice(i);

/* 守門 */
if (!/id="pvspec"/.test(h)) throw new Error("覆寫用的 <style> 沒插進 <head>");
if (h.indexOf('class="pvbar"') < h.lastIndexOf("</main>")) throw new Error("切換條落在 </main> 之前");
/* ⚠ 產出的腳本裡不能有「字串從中間被切斷」的行 —— 模板字串裡忘了跳脫 \n 就會這樣，
   而且畫面上完全看不出來（整支腳本不執行、切換條按了沒反應）。 */
const js = h.slice(h.lastIndexOf("<script>") + 8, h.lastIndexOf("</script>"));
const broken = js.split("\n").filter((l) => (l.match(/'/g) || []).length % 2 === 1 && !l.includes("//"));
if (broken.length) throw new Error(`產出的腳本有 ${broken.length} 行字串被切斷（模板字串裡的 \\n 忘了跳脫）：\n  ${broken[0].trim()}`);

fs.writeFileSync(path.join(dir, "index.html"), h);
console.log(`✓ preview/${PAGE.dir}/index.html`);
if (PAGE.rows.includes("c")) console.log(`  植牙：${CANDS.map(c => c.k + "=" + c.fill).join("  ")}`);
console.log(`  矯正深階：${ORTHO.map(c => c.k + "=" + c.deep).join("  ")}`);
console.log(`  網址參數：?c=now|a|b|c　?o=g0|g1|g2|g3`);
