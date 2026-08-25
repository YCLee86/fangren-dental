/* 著陸頁線稿底圖的提案頁產生器（通用，吃科別代碼）。
 *   node tools/lineart-preview.mjs <spec>
 *   → preview/topic-lineart-<spec>/index.html
 *
 * 前三科（一般牙科／牙周／顯微根管／兒牙）每一輪都臨時寫一支一次性腳本，
 * 2026-08-24 矯正這一輪改寫成通用的留在 tools/：植牙與口外還要各做一次。
 *
 * ⚠ 提案頁的規矩（CLAUDE.md 第八節）：
 *   ・noindex 三道（頁面 meta ＋ Worker 的 X-Robots-Tag ＋ robots.txt）——後兩道已就位。
 *   ・切換條要插在**最後一個** </body> 前面（用 lastIndexOf；註解裡就有那幾個字）。
 *   ・網址參數的正規式寫 [a-z0-9.]+，不然吃不到 "0.121" 這種值。
 *   ・這一份是 topics/<spec>/ 的快照，和 preview/<name>/ **同樣深兩層**，
 *     所以 ../../assets/ 的相對路徑不必改（index.html 的複本才要）。
 *   ・counter.js **留著**：著陸頁只有唯讀的 data-views、沒有 data-views-self，
 *     不會讓首頁的計數多跳（CLAUDE.md 第九之〇節上線那天的兩件之一）。
 *
 * ⚠ 這一輪的尺都只改偽元素的 width/opacity，不影響任何「開頁量一次」的 JS，
 *   所以切換是**即時套用、不重新載入**（判準見 CLAUDE.md 第八節 back-to-top 那一段）。
 */
import fs from "node:fs";
import path from "node:path";

const spec = process.argv[2];
if (!spec) { console.error("用法：node tools/lineart-preview.mjs <spec>"); process.exit(1); }
const ROOT = path.resolve(import.meta.dirname, "..");
const src = path.join(ROOT, "topics", spec, "index.html");
if (!fs.existsSync(src)) { console.error(`× 找不到 ${src}`); process.exit(1); }
let h = fs.readFileSync(src, "utf8");

/* 1. noindex（提案頁自己那一道） */
h = h.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow, noarchive">');
if (!/noindex/.test(h)) h = h.replace(/<head>/, '<head>\n<meta name="robots" content="noindex, nofollow, noarchive">');

/* 2. 把該科的線稿規則改寫成吃 CSS 變數（尺才調得動）。
      原本兩段（基底 ＝ 手機、@media min-width:721px ＝ 平板以上）各有自己的值，
      這裡都換成 var()，預設值就是站上現在跑的那一組。 */
const reW = new RegExp(`(\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?)width: min\\(([^,]+), ([^)]+)\\);`);
const mW = h.match(reW);
/* ⚠ 站上寫的是 `right: 0;`（沒有 px），正規式要求 px 就整條命中不到 ——
   JS 照樣設了 --la-right，但 CSS 沒人吃它，症狀是「按了沒反應」（2026-08-24 踩過）。 */
const reRight = new RegExp(`(\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?)right: (-?[\\d.]+)(?:px)?;`);
const mR = h.match(reRight);
const baseRight = mR ? mR[2] : "0";
if (mR) h = h.replace(reRight, `$1right: var(--la-right, ${baseRight}px);`);

/* 出血：框不動，背景往右推，超出框的被裁掉 —— 沒有水平捲動。
   ⚠ 這是「再往右」的第二段機制（兒牙 2026-08-24 定案用的就是它的等價寫法）：
     第一段是 right 給負值（上限＝頁面內距），推到底之後只剩這一條路。 */
/* ⚠⚠ 站上這條規則有**兩種寫法**，兩種都要接（2026-08-25 踩過）：
     ① 一般牙科／顯微根管：`background: url("…") center / contain no-repeat;`
     ② 矯正／植牙：`background: url("…") no-repeat; background-size: contain;`
        ＋下一行自己的 `background-position: calc(50% + Npx) center;`
   只接 ① 的話，②那兩科的「出血」按了完全沒反應、圖永遠停在 CSS 寫死的那個值 ——
   而植牙的基底正好是 +48px，等於醫師的手指一直被框裁掉，怎麼改裁切都救不回來。
   底下第 2.5 步有一道守門，接不上就直接 throw。 */
const reBgShort = new RegExp(`(\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?)background: url\\("([^"]+)"\\) center / contain no-repeat;`);
const reBgLong = new RegExp(`(\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?)background: url\\("([^"]+)"\\) no-repeat; background-size: contain;\\s*background-position: calc\\(50% \\+ (-?[\\d.]+)px\\) center;`);
let mBg = h.match(reBgShort);
if (mBg) {
  h = h.replace(reBgShort,
    `$1background-image: var(--la-img, url("${mBg[2]}")); background-repeat: no-repeat;` +
    ` background-size: contain;` +
    ` background-position: calc(50% + var(--la-bleed, 0px)) center;`);
} else {
  mBg = h.match(reBgLong);
  if (mBg) h = h.replace(reBgLong,
    `$1background-image: var(--la-img, url("${mBg[2]}")); background-repeat: no-repeat;` +
    ` background-size: contain;` +
    ` background-position: calc(50% + var(--la-bleed, ${mBg[3]}px)) center;`);
}
/* 「沒翻的那一版」：drafts/lineart-<spec>-noflip.png 存在就多一把「翻轉」的尺
   （2026-08-25 植牙那一輪加的 —— 使用者：「做一個沒翻的選項切換」）。
   ⚠ 圖複製進提案頁自己的資料夾，用同層相對路徑，定案時整個資料夾一起刪。 */
const noflipSrc = path.join(ROOT, "drafts", `lineart-${spec}-noflip.png`);
const hasNoflip = fs.existsSync(noflipSrc);
const flipUrl = `url("${mBg ? mBg[2] : ""}")`;

/* ⚠ 這裡要抓的是「這一科自己的」出血預設值，不是整份檔案第一個命中的
   —— 六科的規則排在同一份樣式表裡，用不限定選擇器的正規式會抓到別科的。 */
const baseBleed = mBg && mBg[3] != null ? mBg[3]
  : (h.match(new RegExp(`\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?background-position: calc\\(50% \\+ var\\(--la-bleed, ([-\\d.]+)px\\)\\)`)) || [,"0"])[1];
const reOp = new RegExp(`(\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?)opacity: ([.\\d]+);`);
const mOp = h.match(reOp);
if (!mW || !mOp) { console.error("× 找不到該科的線稿規則，先把 CSS 加進 index.html 再跑這一支"); process.exit(1); }
const baseW = mW[3].trim(), baseOp = mOp[2];
h = h.replace(reW, `$1width: min(var(--la-pct, ${mW[2].trim()}), var(--la-w, ${baseW}));`);
h = h.replace(reOp, `$1opacity: var(--la-op, ${baseOp});`);

/* ≥721 那一段：**整塊抓出來、在塊內各自替換再放回去**。
   ⚠ 原本用一個大正規式配 $1/$4 分組拼接，right 與 background-position 會被吃掉
     （2026-08-24 踩過，症狀是 iPad 段那兩把尺沒東西可調）。 */
const reMediaBlock = new RegExp(
  `@media \\(min-width: 721px\\) \\{\\s*\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?\\}\\s*\\}`);
const mBlock = h.match(reMediaBlock);
let wideW = baseW, wideOp = baseOp, widePct = mW[2].trim();
if (mBlock) {
  let blk = mBlock[0];
  const mw = blk.match(/width: min\(([^,]+), ([^)]+)\);/);
  if (mw) { widePct = mw[1].trim(); wideW = mw[2].trim();
    blk = blk.replace(mw[0], `width: min(var(--la-pct, ${widePct}), var(--la-w, ${wideW}));`); }
  const mo = blk.match(/opacity: ([.\d]+);/);
  if (mo) { wideOp = mo[1]; blk = blk.replace(mo[0], `opacity: var(--la-op, ${wideOp});`); }
  blk = blk.replace(/right: (-?[\d.]+)px;/, (_, v) => `right: var(--la-right, ${v}px);`);
  blk = blk.replace(/background-position: calc\(50% \+ ([-\d.]+)px\) center;/,
    (_, v) => `background-position: calc(50% + var(--la-bleed, ${v}px)) center;`);
  h = h.replace(mBlock[0], blk);
}

const wideBleed = mBlock ? ((mBlock[0].match(/var\(--la-bleed, ([-\d.]+)px\)/) || [,baseBleed])[1]) : baseBleed;

/* 2.5 守門：四把尺都要真的接上 CSS。
   ⚠ 「按了沒反應」這個症狀不報錯、畫面也正常，只有拿數字量才看得出來 ——
   2026-08-24（right 少了 px）與 2026-08-25（背景那條是另一種寫法）各踩過一次。 */
const specRule = (h.match(new RegExp(`\\[data-topic="${spec}"\\] \\.tp-intro::before \\{[\\s\\S]*?\\}`)) || [""])[0];
/* ⚠ 牙周／兒牙走的是另一套機制（框窄一截 ＋ 圖照高度撐滿靠左，`auto 100%`），
   那兩科本來就沒有「出血」可調 —— 只有 contain 那一套才要檢查它。 */
const hasBleed = !/auto 100%/.test(specRule);
for (const [v, name] of [["--la-w", "大小"], ["--la-right", "左右"], ...(hasBleed ? [["--la-bleed", "出血"]] : []), ["--la-op", "濃度"]]) {
  if (!specRule.includes(v)) {
    console.error(`× 「${name}」那把尺沒接上（${v} 沒有出現在 ${spec} 的規則裡）——`);
    console.error(`  index.html 那條規則的寫法和產生器的正規式對不上，先去對一次再跑。`);
    process.exit(1);
  }
}

/* 3. 切換條 ＋ 量測面板。⚠ 這一段是模板字串：CSS 註解裡不可以出現反引號。 */
/* 往右：把框推出版心，貼齊螢幕邊。⚠ 上限兩段不同 ——
   手機是頁面內距 14px；≥721 是**最窄的那台**（721 只有 23.8、iPad mini 744 只有 22.5），
   兒牙那次給 32 就在 744 上多出 10px 水平捲動（CLAUDE.md 第九節）。 */
const BLEEDS = [-48, -32, -16, 0, 16, 32, 48, 64];   /* 負值＝背景往左推 */   /* 出血：往右推幾 px（圖的右邊會被裁掉同樣多） */
const RIGHTS_N = [24, 12, 0, -6, -10, -14];   /* 正值＝框往左（離右緣），負值＝推出版心往右 */
const RIGHTS_W = [48, 32, 16, 0, -8, -14, -20];
const PCTS = [60, 68, 76, 84, 92];      /* 手機：真正在作用的是百分比 */
const PXS  = [280, 310, 330, 360, 400];  /* ≥721：介紹區夠寬，卡住的是 px 上限 */
/* 濃度也依斷點分兩組：手機被柔墨卡住（AA 上限就在 .10~.15 之間），
   ≥721 那一段多半只壓到深墨，上限寬鬆得多（顯微根管定案 .30、兒牙 .22、牙周 .15）。 */
const OPS_N = [0.10, 0.121, 0.15, 0.18, 0.24];
const OPS_W = [0.15, 0.22, 0.30, 0.40, 0.55];
const bar = `
<style>
/* pv 前綴：這一份是著陸頁的完整快照，站上有的 class 全都在，短名字會撞 */
.pvbar{position:fixed;left:0;right:0;bottom:0;z-index:99;background:rgba(24,22,20,.92);
  backdrop-filter:blur(8px);color:#e8e6e2;font:500 13px/1.4 system-ui,sans-serif;
  padding:8px 10px calc(8px + env(safe-area-inset-bottom));max-height:24vh;overflow:auto}
.pvbar.is-min{max-height:none;padding:4px 10px}
.pvbar.is-min .pvrow,.pvbar.is-min .pvout{display:none}
.pvrow{display:flex;gap:5px;align-items:center;margin:4px 0;flex-wrap:nowrap;overflow-x:auto}
.pvrow b{flex:none;width:2.6em;color:#a8a49e;font-weight:500}
.pvbar button{flex:none;border:1px solid #4a4642;background:#2a2724;color:#e8e6e2;
  border-radius:7px;padding:5px 9px;font:inherit;min-height:30px;cursor:pointer}
.pvbar button[aria-pressed="true"]{background:#e8e6e2;color:#1c1a18;border-color:#e8e6e2}
.pvout{margin-top:5px;font-size:11.5px;line-height:1.5;color:#c9c5bf;white-space:pre-wrap}
.pvout .bad{color:#ff9a8a}.pvout .ok{color:#9fd6a0}
.pvmin{position:fixed;right:10px;bottom:calc(6px + env(safe-area-inset-bottom));z-index:100;
  border:1px solid #4a4642;background:rgba(24,22,20,.92);color:#e8e6e2;border-radius:8px;
  padding:5px 9px;font:500 12px system-ui,sans-serif;min-height:30px}
</style>
<div class="pvbar" id="pvbar">
  <div class="pvrow" id="pvsize"><b>大小</b></div>
  <div class="pvrow" id="pvright"><b>左右</b></div>
  <div class="pvrow"><b>出血</b>${BLEEDS.map(v => `<button data-k="b" data-v="${v}">${v === 0 ? "0" : (v > 0 ? "→" + v : "←" + (-v))}</button>`).join("")}</div>
  <div class="pvrow" id="pvop"><b>濃度</b></div>${hasNoflip ? `
  <div class="pvrow"><b>翻轉</b><button data-k="f" data-v="1">翻（現在）</button><button data-k="f" data-v="0">不翻</button></div>` : ""}
  <div class="pvout" id="pvout">量測中…</div>
</div>
<button class="pvmin" id="pvmin">收起</button>
<script>
(function(){
  var root=document.documentElement, bar=document.getElementById('pvbar'), out=document.getElementById('pvout');
  var wide=matchMedia('(min-width: 721px)');
  var DEF={w:{narrow:${mW[2].trim().replace("%","")},wide:${wideW.replace("px","")}},
           op:{narrow:${baseOp},wide:${wideOp}}, r:{narrow:${baseRight},wide:${(mBlock && (mBlock[0].match(/right: (-?[\d.]+)px/)||[])[1]) || baseRight}},
           b:{narrow:${baseBleed},wide:${wideBleed}}, f:{narrow:1,wide:1}};
  var st={w:null,op:null,r:null,b:null,f:null,off:false};
  var IMG={flip:'${flipUrl}',noflip:'url("noflip.png")'}, HASF=${hasNoflip};
  var qs=new URLSearchParams(location.search);
  ['w','op','r','b','f'].forEach(function(k){var v=qs.get(k); if(v&&/^-?[a-z0-9.]+$/.test(v)) st[k]=parseFloat(v);});

  var PCTS=${JSON.stringify(PCTS)}, PXS=${JSON.stringify(PXS)};
  var RN=${JSON.stringify(RIGHTS_N)}, RW=${JSON.stringify(RIGHTS_W)};
  var ON=${JSON.stringify(OPS_N)}, OW=${JSON.stringify(OPS_W)};
  function sizes(){ return wide.matches?PXS:PCTS; }
  function unit(){ return wide.matches?'px':'%'; }
  function buildSizes(){
    var row=document.getElementById('pvsize');
    row.innerHTML='<b>大小</b>'+sizes().map(function(v){
      return '<button data-k="w" data-v="'+v+'">'+v+unit()+'</button>';}).join('');
    var o=document.getElementById('pvop');
    o.innerHTML='<b>濃度</b>'+(wide.matches?OW:ON).map(function(v){
      return '<button data-k="op" data-v="'+v+'">'+v+'</button>';}).join('')
      +'<button data-k="off" data-v="1">關掉圖</button>';
    var r=document.getElementById('pvright');
    r.innerHTML='<b>左右</b>'+(wide.matches?RW:RN).map(function(v){
      return '<button data-k="r" data-v="'+v+'">'+(v===0?'0':(v>0?'←'+v:'→'+(-v)))+'</button>';}).join('');
  }
  function cur(k){ return st[k]!=null?st[k]:DEF[k][wide.matches?'wide':'narrow']; }
  function apply(){
    /* ⚠ 手機那一段被 min() 的百分比卡住、≥721 被 px 上限卡住 ——
       所以尺要各自設自己那一個變數，另一個放寬，否則按了沒反應（2026-08-24 踩過）。 */
    if(wide.matches){ root.style.setProperty('--la-pct','100%'); root.style.setProperty('--la-w', cur('w')+'px'); }
    else { root.style.setProperty('--la-pct', cur('w')+'%'); root.style.setProperty('--la-w','9999px'); }
    root.style.setProperty('--la-op', st.off?0:cur('op'));
    root.style.setProperty('--la-right', cur('r')+'px');
    root.style.setProperty('--la-bleed', cur('b')+'px');
    if(HASF) root.style.setProperty('--la-img', cur('f') ? IMG.flip : IMG.noflip);
    bar.querySelectorAll('button[data-k]').forEach(function(b){
      var k=b.dataset.k, v=parseFloat(b.dataset.v);
      b.setAttribute('aria-pressed', k==='off' ? String(st.off) : String(Math.abs(cur(k)-v)<1e-6));
    });
    measure();
  }
  bar.addEventListener('click', function(e){
    var b=e.target.closest('button[data-k]'); if(!b) return;
    var k=b.dataset.k;
    if(k==='off') st.off=!st.off; else { st[k]=parseFloat(b.dataset.v); st.off=false; }
    var u=new URL(location); ['w','op','r','b','f'].forEach(function(x){ if(st[x]!=null) u.searchParams.set(x,st[x]); });
    history.replaceState(null,'',u); apply();
  });
  document.getElementById('pvmin').addEventListener('click', function(){
    bar.classList.toggle('is-min');
    this.textContent = bar.classList.contains('is-min') ? '打開' : '收起';
  });

  /* 對比度：柔墨與深墨壓在「紙色×(1-k) + 套色×k」上 */
  function lum(c){var s=c.map(function(x){x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);});
    return .2126*s[0]+.7152*s[1]+.0722*s[2];}
  function cr(a,b){var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
  function rgb(v){var m=getComputedStyle(root).getPropertyValue(v).trim();
    var x=m.match(/\\d+/g); return x?x.slice(0,3).map(Number):null;}
  function hex2(h){return [1,3,5].map(function(i){return parseInt(h.substr(i,2),16);});}

  /* 逐行量：哪幾行的字壓在圖上（Range 取 rect，照 top 分組） */
  function lines(el){
    var out=[], w=document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var n; while((n=w.nextNode())){
      if(!n.nodeValue.trim()) continue;
      var r=document.createRange(); r.selectNodeContents(n);
      Array.prototype.forEach.call(r.getClientRects(), function(x){
        if(x.width<1||x.height<1) return;
        var g=out.find(function(o){return Math.abs(o.top-x.top)<4;});
        if(g){g.left=Math.min(g.left,x.left);g.right=Math.max(g.right,x.right);}
        else out.push({top:x.top,bottom:x.bottom,left:x.left,right:x.right,el:n.parentElement});
      });
    }
    return out;
  }
  function measure(){
    var intro=document.querySelector('.tp-intro'); if(!intro){out.textContent='找不到介紹區';return;}
    var cs=getComputedStyle(intro,'::before'), ib=intro.getBoundingClientRect();
    var w=parseFloat(cs.width), hh=parseFloat(cs.height), op=parseFloat(cs.opacity);
    var box={left:ib.right-w, right:ib.right, top:ib.bottom-hh, bottom:ib.bottom};
    var hit=lines(intro).filter(function(L){return !(L.right<box.left||L.left>box.right||L.bottom<box.top||L.top>box.bottom);});
    var soft=0, ink=0;
    hit.forEach(function(L){ var c=getComputedStyle(L.el).color;
      var m=c.match(/\\d+/g); if(!m) return;
      var l=lum(m.slice(0,3).map(Number));
      if(l>0.10) soft++; else ink++; });
    var paper=hex2('#e2e5e6'), acc=rgb('--accent')||hex2('#4478b5');
    var bg=paper.map(function(p,i){return p*(1-op)+acc[i]*op;});
    var crSoft=cr(hex2('#5c5f57'), bg), crInk=cr(hex2('#2a2c27'), bg);
    var over=hh-ib.height, hscroll=root.scrollWidth>root.clientWidth;
    out.innerHTML =
      '圖 '+w.toFixed(0)+'×'+hh.toFixed(0)+'　介紹區高 '+ib.height.toFixed(0)+
      '　'+(over>0?'<span class="bad">比介紹區高 '+over.toFixed(0)+'px（會凸到標題那一區）</span>'
                 :'<span class="ok">收在介紹區裡（還差 '+(-over).toFixed(0)+'px）</span>')+'\\n'+
      '壓到圖的字：柔墨 '+soft+' 行・深墨 '+ink+' 行　'+
      (soft>0 ? (crSoft>=4.5?'<span class="ok">柔墨 '+crSoft.toFixed(2)+' ✓</span>'
                            :'<span class="bad">柔墨 '+crSoft.toFixed(2)+'（低於 4.5）</span>')
              : '<span class="ok">沒有柔墨壓到，濃度不影響可讀性</span>')+
      '　深墨 '+crInk.toFixed(2)+'\\n'+
      '圖的右緣離螢幕 '+(innerWidth-box.right).toFixed(0)+'px'+
      (cur('b')>0 ? '　圖被裁掉右邊 '+cur('b')+'px（'+(cur('b')/w*100).toFixed(0)+'%）' : '')+'　'+
      '視窗 '+innerWidth+'×'+innerHeight+'　'+(wide.matches?'≥721 那一段':'手機那一段')+
      '　'+(hscroll?'<span class="bad">⚠ 有水平捲動</span>':'<span class="ok">無水平捲動</span>')+
      '　濃度 '+op.toFixed(3);
  }
  wide.addEventListener('change', function(){ st.w=null; buildSizes(); apply(); });
  addEventListener('resize', function(){clearTimeout(window.__t);window.__t=setTimeout(apply,120);});
  addEventListener('load', apply);
  buildSizes(); apply();
})();
</script>
`;
const i = h.lastIndexOf("</body>");
h = h.slice(0, i) + bar + h.slice(i);

const dir = path.join(ROOT, "preview", `topic-lineart-${spec}`);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "index.html"), h);
if (hasNoflip) fs.copyFileSync(noflipSrc, path.join(dir, "noflip.png"));
console.log(`✓ preview/topic-lineart-${spec}/index.html`);
console.log(`  手機那一段預設 ${baseW}／${baseOp}　≥721 預設 ${wideW}／${wideOp}`);
console.log(`  網址參數：?w=360&op=0.121`);
