#!/usr/bin/env node
/* 科別色的提案頁產生器（換一顆科別色，逐案在真實版面上比）。
 *
 *   node tools/spec-color-preview.mjs prosth
 *   → preview/spec-<spec>-line58/index.html ＋ 各候選的線稿 PNG
 *
 * 2026-08-31 植牙・假牙重建這一輪寫的：使用者拍了富山路面電車的路線圖，
 * 「5、8 號線的顏色看起來跟植牙假牙贗復的標籤主題色很像」，要一份套色預覽
 * 和現在版本的比較。
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
 *
 * ⚠ 切換條是**即時套用不重新載入**：這一輪只改顏色，不影響任何
 *   「開頁量一次」的 JS（`sizeLabels`、`--topic-pad`、卡片折行那幾支量的是
 *   字面框與幾何，和顏色無關）。判準見 CLAUDE.md 第八節 back-to-top 那一段。
 *
 * ⚠ 覆寫要寫成 `html [data-spec="…"]`（0,1,1）才一定贏得過站上那條
 *   `[data-spec="…"]`（0,1,0）—— 靠排序決勝的話，日後樣式表一搬位置就失效。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const spec = process.argv[2] || "prosth";

/* ---- 候選 ---------------------------------------------------------------
   量測：富山路面電車 5・8 號線那條深藍，八段逐段取中位數之後
   用旁邊的看板底色做白平衡還原（做法與數字寫在 history 那一頁）。
   ・看板當純白還原 → #3f527e
   ・看板當米白 #F2EDE4 還原 → #3c4c71
   兩個白點假設都合理，所以兩個都給使用者看。
   Ⓒ 是站上既有的做法（兒牙那一輪定的）：**顏色的出處是色相，不是那個 HEX** ——
   取實測的色相與彩度，只把亮度拉回七科的家族帶（L* 36~48）。
   深階三案共用一顆：色相跟著實測走（281.5）、佔色域比例照現行深階的 74%、
   亮度挑在「對矯正深階的 ΔE 不低於現行那 10.5」的那一格（L* 17.5）。 */
const CANDS = [
  { k: "now", label: "現況",        fill: "#335b8b", deep: "#182f4b" },
  { k: "a",   label: "Ⓐ 實測原值",  fill: "#3f527e", deep: "#182b4c" },
  { k: "b",   label: "Ⓑ 實測較深",  fill: "#3c4c71", deep: "#182b4c" },
  { k: "c",   label: "Ⓒ 亮度回家族帶", fill: "#465885", deep: "#182b4c" },
];

/* 線稿要用哪一張原檔重產（＝ CLAUDE.md 定案表裡那一行指令的參數） */
const LINEART = {
  prosth: { art: "drafts/lineart-prosth-v2.jpg", crop: "36,83,972,896", flip: false },
};

const dir = path.join(ROOT, "preview", `spec-${spec}-line58`);
fs.mkdirSync(dir, { recursive: true });

/* ---- 1. 各候選的線稿 ------------------------------------------------------ */
const la = LINEART[spec];
if (la) {
  for (const c of CANDS) {
    const out = path.join(dir, `la-${c.k}.png`);
    const args = [path.join(ROOT, "tools/topic-lineart.mjs"), spec,
      "--art", la.art, "--crop", la.crop, "--color", c.fill, "--out", path.relative(ROOT, out)];
    if (la.flip) args.push("--flip");
    execFileSync("node", args, { cwd: ROOT, stdio: "pipe" });
    process.stdout.write(`  線稿 ${c.label} → ${path.basename(out)} ${c.fill}\n`);
  }
}

/* ---- 2. 快照 -------------------------------------------------------------- */
const src = path.join(ROOT, "topics", spec, "index.html");
if (!fs.existsSync(src)) { console.error(`× 找不到 ${src}`); process.exit(1); }
let h = fs.readFileSync(src, "utf8");

/* noindex（提案頁自己那一道；Worker 的 X-Robots-Tag 與 robots.txt 已就位） */
h = h.replace(/<meta name="robots"[^>]*>/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
if (!/noindex/.test(h)) throw new Error("noindex 沒有寫進去");

/* 線稿改吃變數（url 只出現一次，@media 那一段只調大小與濃度） */
const reLa = new RegExp(`background: url\\("(\\.\\./\\.\\./assets/lineart-${spec}\\.png)"\\) no-repeat;`);
if (!reLa.test(h)) throw new Error(`接不到 ${spec} 的線稿那一行 —— 站上的寫法變了`);
h = h.replace(reLa, `background-image: var(--pv-la, url("$1")); background-repeat: no-repeat;`);

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
.pvbar.is-min .pvrow,.pvbar.is-min .pvout{display:none}
.pvrow{display:flex;gap:5px;align-items:center;margin:4px 0;flex-wrap:nowrap;overflow-x:auto}
.pvrow b{flex:none;width:2.6em;color:#a8a49e;font-weight:500}
.pvbar button{flex:none;border:1px solid #4a4642;background:#2a2724;color:#e8e6e2;
  border-radius:7px;padding:5px 9px;font:inherit;min-height:30px;cursor:pointer}
.pvbar button[aria-pressed="true"]{background:#e8e6e2;color:#1c1a18;border-color:#e8e6e2}
.pvsw{display:inline-flex;align-items:center;gap:4px;flex:none;margin-right:6px;font-size:11.5px;color:#c9c5bf}
.pvsw i{width:22px;height:14px;border-radius:3px;display:inline-block}
.pvout{margin-top:5px;font-size:11.5px;line-height:1.55;color:#c9c5bf;white-space:pre-wrap}
.pvout .bad{color:#ff9a8a}.pvout .ok{color:#9fd6a0}
.pvmin{position:fixed;right:10px;bottom:calc(6px + env(safe-area-inset-bottom));z-index:100;
  border:1px solid #4a4642;background:rgba(24,22,20,.93);color:#e8e6e2;border-radius:8px;
  padding:5px 9px;font:500 12px system-ui,sans-serif;min-height:30px}
</style>`;
h = h.replace("</head>", css + "\n<style id=\"pvspec\"></style>\n</head>");

const bar = `
<div class="pvbar" id="pvbar">
  <div class="pvrow"><b>配色</b>${CANDS.map(c => `<button data-v="${c.k}">${c.label}</button>`).join("")}</div>
  <div class="pvrow" id="pvsw"><b>色票</b></div>
  <div class="pvout" id="pvout">量測中…</div>
</div>
<button class="pvmin" id="pvmin">收起</button>
<script>
(function(){
  var CANDS=${JSON.stringify(CANDS)};
  var bar=document.getElementById('pvbar'), out=document.getElementById('pvout'),
      sty=document.getElementById('pvspec'), swrow=document.getElementById('pvsw');
  var PAPER='#e2e5e6', CARD='#f4f4f5', WHITE='#ffffff';
  /* 鄰居：全站最近的一對就在這裡（矯正 × 贋復），牙周是第三顆冷色 */
  var NB=[{n:'矯正',f:'#4478b5',d:'#244369'},{n:'牙周',f:'#317d78',d:'#2a6d69'},
          {n:'口外',f:'#8e6299',d:'#784e84'},{n:'全部',f:'#5f5d5c',d:'#4c4948'}];

  var st='now';
  /* ⚠ 正規式寫 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到帶數字的值（CLAUDE.md 第八節） */
  var qs=new URLSearchParams(location.search).get('c');
  if(qs && /^[a-z0-9]+$/.test(qs) && CANDS.some(function(c){return c.k===qs;})) st=qs;

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
  function f1(n){return n.toFixed(1);} function f2(n){return n.toFixed(2);}
  function mark(v,t){return v>=t?'<span class="ok">'+f2(v)+' ✓</span>':'<span class="bad">'+f2(v)+' ✗</span>';}

  function cand(){return CANDS.filter(function(c){return c.k===st;})[0];}

  function apply(){
    var c=cand();
    sty.textContent='html [data-spec="${spec}"]{--accent:'+c.fill+';--accent-deep:'+c.deep+';}'+
      ':root{--pv-la:url("la-'+c.k+'.png");}';
    bar.querySelectorAll('button[data-v]').forEach(function(b){
      b.setAttribute('aria-pressed', String(b.dataset.v===st));});
    var u=new URL(location); u.searchParams.set('c',st); history.replaceState(null,'',u);
    swatches(); measure();
  }
  function swatches(){
    var c=cand();
    swrow.innerHTML='<b>色票</b>'+
      [['本案',c.fill]].concat(NB.map(function(n){return [n.n,n.f];}))
      .map(function(p){return '<span class="pvsw"><i style="background:'+p[1]+'"></i>'+p[0]+'</span>';}).join('');
  }
  function measure(){
    var c=cand(), L=lch(c.fill), D=lch(c.deep);
    var near=NB.map(function(n){return {n:n.n,f:dE(c.fill,n.f),d:dE(c.deep,n.d)};});
    var minF=near.reduce(function(a,b){return b.f<a.f?b:a;});
    var minD=near.reduce(function(a,b){return b.d<a.d?b:a;});
    var hs=document.documentElement.scrollWidth>document.documentElement.clientWidth;
    out.innerHTML=
      '填色 '+c.fill+'　L*'+f1(L[0])+' C*'+f1(L[1])+' h'+f1(L[2])+
      '　　深階 '+c.deep+'　L*'+f1(D[0])+' C*'+f1(D[1])+' h'+f1(D[2])+'\\n'+
      '白字在塊 '+mark(cr(c.fill,WHITE),4.5)+'　塊對紙 '+mark(cr(c.fill,PAPER),3)+
      '　深階對卡 '+mark(cr(c.deep,CARD),4.5)+'　深階對紙 '+mark(cr(c.deep,PAPER),4.5)+'\\n'+
      'ΔE 對鄰居：'+near.map(function(n){return n.n+' '+f1(n.f)+'/'+f1(n.d);}).join('　')+'\\n'+
      '最近的一對：填色 '+minF.n+' '+f1(minF.f)+
      (minF.f>=13.3?'<span class="ok">（不比現況那 13.3 緊）</span>'
                   :'<span class="bad">（比現況那 13.3 還緊）</span>')+
      '　深階 '+minD.n+' '+f1(minD.d)+
      (minD.d>=10.5?'<span class="ok">（不比現況那 10.5 緊）</span>'
                   :'<span class="bad">（比現況那 10.5 還緊）</span>')+'\\n'+
      '家族帶 L* 36~48：'+(L[0]>=36&&L[0]<=48?'<span class="ok">在帶內</span>'
        :'<span class="bad">低了 '+f1(36-L[0])+' 階（七科裡最深的一顆）</span>')+
      '　視窗 '+innerWidth+'×'+innerHeight+'　'+
      (hs?'<span class="bad">⚠ 有水平捲動</span>':'<span class="ok">無水平捲動</span>');
  }
  bar.addEventListener('click', function(e){
    var b=e.target.closest('button[data-v]'); if(!b) return;
    st=b.dataset.v; apply();
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

/* 守門：切換條真的插在最後、覆寫規則的選擇器沒有寫錯 */
if (!/id="pvspec"/.test(h)) throw new Error("覆寫用的 <style> 沒插進 <head>");
if (h.indexOf('class="pvbar"') < h.lastIndexOf("</main>")) throw new Error("切換條落在 </main> 之前");

fs.writeFileSync(path.join(dir, "index.html"), h);
console.log(`✓ preview/spec-${spec}-line58/index.html`);
console.log(`  候選：${CANDS.map(c => c.k + "=" + c.fill).join("  ")}`);
console.log(`  網址參數：?c=now|a|b|c`);
