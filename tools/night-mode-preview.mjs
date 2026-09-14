/* 夜間模式的提案頁產生器（2026-09-15 開）。
 *   node tools/night-mode-preview.mjs  → preview/night-mode/index.html
 *
 * 起點：使用者給了 https://snowmed-taiwan.com/ ，「看他有設定白天／夜間模式，
 * 然後做一個診所網站夜間模式的提案頁給我看」。那一站的做法（2026-09-15 實際量的）：
 *   ・預設深色（底 #08243c 深藍、字 #dbeaf6），<head> 裡一小段腳本讀 localStorage
 *     'snowmed:theme'，是 'light' 才在 <html> 掛 data-theme="light"。
 *   ・**不看手機的深色設定**（沒有 prefers-color-scheme），只認手動那一顆。
 *   ・開關在頁首最右邊：一格有框的鈕，圖示＋字（手機直排、電腦橫排），
 *     字寫的是「按下去會變成什麼」（深色時寫「白天模式」配太陽）。
 *   ・整站配色是一組 CSS 變數，[data-theme="light"] 整組換掉。
 *
 * 這一站照同一個骨架做，但顏色**一個都不另外挑**：
 *   ・Ⓐ 暗夜：PALETTE.md 第四節 A 那組（從照片量出來的，站上 HERO 已經在用）。
 *   ・Ⓑ 窄帶藍灰：HERO 底下那條窄帶的漸層（同一組照片的夜空 × 柏油），
 *     ⚠ 分隔線與次要文字那兩階沒有現成的值，是「同色相、亮度對齊 Ⓐ 那兩階」算出來的。
 *   ・七科的字階（--accent-deep）在深底上會沉下去，一律「同色相同彩度、只提亮度」
 *     到 4.5:1 ＝ PALETTE.md 第六之七節 favicon 深色版那條做法，產生器現算。
 *
 * ⚠ 提案頁的規矩（CLAUDE.md 第八節）照做：相對路徑往上兩層、SEO 區塊換成 noindex、
 *   data-views-self 降成 data-views（不灌計數、還印得出真數字）、
 *   切換條插在最後一個 </body> 前面、class 一律 pv 前綴。
 * ⚠ 只做首頁。文章頁與著陸頁吃 assets/style.css，定案之後才要做那一份。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const must = (re, what) => { if (!re.test(h)) throw new Error("× 找不到：" + what); };

/* ---------- 色彩計算（sRGB ↔ CIE L*C*h，D65） ---------- */
const hex2rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const lum = (x) => { const [r, g, b] = hex2rgb(x).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
const W = [0.95047, 1, 1.08883];
function toLch(x) {
  const [r, g, b] = hex2rgb(x).map(lin);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / W[0], Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / W[2];
  const L = 116 * f(Y) - 16, A = 500 * (f(X) - f(Y)), B = 200 * (f(Y) - f(Z));
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}
function fromLch(L, C, H) {
  for (let c = C; c >= 0; c -= 0.25) {
    const A = c * Math.cos(H), B = c * Math.sin(H), fy = (L + 16) / 116;
    const X = W[0] * fi(fy + A / 500), Y = fi(fy), Z = W[2] * fi(fy - B / 200);
    const rgb = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z].map(unlin);
    if (rgb.every((v) => v >= -0.001 && v <= 1.001))
      return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
  }
  throw new Error("色域外");
}
/* 同色相同彩度，把 L* 往上推到對 bg 剛好 ≥ target */
function liftTo(hex, bgs, target) {
  const [, C, H] = toLch(hex);
  for (let L = toLch(hex)[0]; L <= 98; L += 0.25) {
    const c = fromLch(L, C, H);
    if (bgs.every((b) => cr(c, b) >= target)) return c;
  }
  throw new Error("推不到 " + hex);
}

/* ---------- 兩組夜間配色 ---------- */
const PAL = {
  a: { name: "暗夜", paper: "#191614", card: "#211e1b", rule: "#38342f", ink: "#e3e1e0", soft: "#aaa49e" },
  b: { name: "窄帶藍灰", paper: "#17191d", card: "#282b31" },
};
{ // Ⓑ 缺的三階：色相取窄帶那一支，亮度對齊 Ⓐ（分隔線、次要文字），主文字取白天的紙色（H=203）
  const [, Cb, Hb] = toLch("#282b31");
  const dRule = toLch(PAL.a.rule)[0] - toLch(PAL.a.card)[0];
  PAL.b.rule = fromLch(toLch(PAL.b.card)[0] + dRule, Cb, Hb);
  PAL.b.ink = "#e2e5e6";
  const [, Cp, Hp] = toLch("#e2e5e6");
  PAL.b.soft = fromLch(toLch(PAL.a.soft)[0], Cp, Hp);
}
const SPEC = { all: "#4c4948", general: "#2c5238", prosth: "#2a4677", perio: "#2a6d69", ortho: "#31637f", endo: "#89202d", surg: "#784e84", kids: "#9e6301" };
const FILL = { all: "#5f5d5c", general: "#3f654a", prosth: "#465885", perio: "#317d78", ortho: "#4478b5", endo: "#ae4f4d", surg: "#8e6299", kids: "#c28229" };
const DEEP = {};
/* 官方色票裡被當成「字」用的那幾支（連結的深綠松、門診表標題的灰褐…），深底上一樣要提亮 */
const SWATCH = { teal: "#214D48", taupe: "#7D5A58", blue: "#3C596B", moss: "#5D6D55", brick: "#AF4C52" };
const LIFT = {};
for (const k in PAL) {
  DEEP[k] = {};
  for (const s in SPEC) DEEP[k][s] = liftTo(SPEC[s], [PAL[k].paper, PAL[k].card], 4.5);
  LIFT[k] = Object.fromEntries(Object.entries(SWATCH).map(([n, c]) => [n, liftTo(c, [PAL[k].paper, PAL[k].card], 4.5)]));
}
const NUM = {};
for (const k in PAL) {
  const p = PAL[k];
  NUM[k] = {
    ink: [cr(p.ink, p.paper), cr(p.ink, p.card)].map((v) => v.toFixed(2)),
    soft: [cr(p.soft, p.paper), cr(p.soft, p.card)].map((v) => v.toFixed(2)),
    lift: toLch(p.card)[0] - toLch(p.paper)[0],
    spec: Object.fromEntries(Object.keys(SPEC).map((s) => [s, [DEEP[k][s], cr(DEEP[k][s], p.card).toFixed(2), cr("#ffffff", FILL[s]).toFixed(2)]])),
  };
}

/* ---------- 1. 快照的四件事 ---------- */
must(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, "SEO 區塊");
h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, '<meta name="robots" content="noindex, nofollow, noarchive">');
h = h.replace(/(["'(\s,])((?:assets|posts|topics|history)\/|site\.webmanifest)/g, "$1../../$2");
h = h.replace(/href="\.\/"/g, 'href="../../"');
h = h.replace(/data-views-self=/g, "data-views=");
if (/data-views-self/.test(h)) throw new Error("× data-views-self 沒剝乾淨");
h = h.replace(/<title>[^<]*<\/title>/, "<title>夜間模式（提案）｜芳仁牙醫診所</title>");

/* ---------- 2. 頁首的開關（放大鏡後面）與頁尾的開關 ---------- */
/* 圖示：Lucide "moon"／"sun"，ISC 授權，https://lucide.dev */
const ICON = `<svg class="pv-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><svg class="pv-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const navQ = /(<a class="nav-q"[\s\S]*?<\/a>)/;
must(navQ, "放大鏡");
h = h.replace(navQ, `$1\n      <button class="pv-th pv-th-head" type="button" aria-label="切換到夜間模式">${ICON}</button>`);
const footNav = /(<ul class="foot-nav">[\s\S]*?<\/ul>)/;
must(footNav, "頁尾導覽");
h = h.replace(footNav, `$1\n        <button class="pv-th pv-th-foot" type="button" aria-label="切換到夜間模式">${ICON}<span class="pv-th-t"></span></button>`);

/* ---------- 3. 夜間的樣式（放在 <head>，不能塞在頁尾 —— 第一幀就要對） ---------- */
const palCss = Object.entries(PAL).map(([k, p]) => `
html[data-theme="dark"][data-pal="${k}"] {
  --paper: ${p.paper}; --card: ${p.card}; --note: ${p.card}; --rule: ${p.rule};
  --ink: ${p.ink}; --ink-soft: ${p.soft};
  ${Object.entries(LIFT[k]).map(([n, c]) => `--${n}: ${c};`).join(" ")}
}
${Object.keys(SPEC).map((s) => `html[data-theme="dark"][data-pal="${k}"] [data-spec="${s}"] { --accent-deep: ${DEEP[k][s]}; }`).join("\n")}`).join("\n");

const CSS = `
<style id="pv-night">
/* ===== 夜間模式提案（產生器 tools/night-mode-preview.mjs，不要手改） ===== */
html[data-theme="dark"] { color-scheme: dark; }
${palCss}
html[data-theme="dark"] body { background: var(--paper); color: var(--ink); }
/* 「回到最上面」那一顆寫死的是白天的卡色與柔墨，換成同一個比例的夜間值 */
html[data-theme="dark"] .btt { background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: color-mix(in srgb, var(--ink-soft) 82%, transparent); }
${Object.keys(PAL).map((k) => `html[data-theme="dark"][data-pal="${k}"] :is(.foot-addr, .foot-tel) a { color: ${DEEP[k].general}; }`).join("\n")}

/* 開關本身：頁首那一顆只有圖示（同放大鏡）、頁尾那一顆有字 */
.pv-th { appearance: none; border: 0; background: none; padding: 0; font: inherit; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: .4em;
  -webkit-tap-highlight-color: transparent; }
.pv-th svg { width: 1.15em; height: 1.15em; fill: none; stroke: currentColor; stroke-width: 1.3;
  stroke-linecap: round; stroke-linejoin: round; }
.pv-th svg :is(circle, path) { vector-effect: non-scaling-stroke; }
.pv-th .pv-sun { display: none; }
html[data-theme="dark"] .pv-th .pv-sun { display: block; }
html[data-theme="dark"] .pv-th .pv-moon { display: none; }
/* 頁首那一顆的寬度只有圖示本身（同放大鏡），觸控範圍靠 ::after 撐，不佔版面 */
.site-nav .pv-th-head { position: relative; color: rgba(255, 255, 255, .88); }
.site-nav .pv-th-head::after { content: ""; position: absolute; inset: -15px -6px; }
.pv-th-foot { margin-top: 1rem; color: var(--ink-soft); border: 1px solid var(--rule);
  border-radius: 8px; padding: .5em .8em; min-height: 44px; font-size: .9rem; }
html[data-tpos="foot"] .pv-th-head,
html[data-tpos="head"] .pv-th-foot,
html[data-tpos="none"] .pv-th { display: none; }
html[data-qopen="1"] .pv-th-head { opacity: 0; pointer-events: none; }
</style>`;
const bodyAt = h.search(/\n<body>\n/);
if (bodyAt < 0) throw new Error("× 找不到 <body>");
const headEnd = h.lastIndexOf("</head>", bodyAt);
h = h.slice(0, headEnd) + CSS + "\n" + h.slice(headEnd);

/* 開頁那一刻就決定 data-theme（放 <head> 最前面，不然會先閃一張白天的） */
const EARLY = `<script>(function(){var u=new URLSearchParams(location.search),r=document.documentElement;
var th=u.get('th');if(!/^(dark|light)$/.test(th||''))th='dark';
var p=u.get('pal');if(!/^[ab]$/.test(p||''))p='a';var pos=u.get('pos');if(!/^(head|foot|none)$/.test(pos||''))pos='foot';
r.dataset.theme=th;r.dataset.pal=p;r.dataset.tpos=pos;})();</script>`;
h = h.replace(/<head>/, "<head>\n" + EARLY);

/* ---------- 4. 切換條 ---------- */
const SPECNAME = { all: "全部", general: "一般", prosth: "植牙", perio: "牙周", ortho: "矯正", endo: "根管", surg: "口外", kids: "兒牙" };
const BAR = `
<style>
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(20,20,22,.94);
  color: #eee; font: 13px/1.45 system-ui, -apple-system, "PingFang TC", "Noto Sans TC", sans-serif;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); backdrop-filter: blur(6px); }
.pv-bar .pv-r { display: flex; gap: 6px; align-items: center; overflow-x: auto; white-space: nowrap; }
.pv-bar .pv-r + .pv-r { margin-top: 5px; }
.pv-bar .pv-l { color: #aaa; min-width: 3.2em; }
.pv-bar button { appearance: none; border: 1px solid #555; background: #2a2a2c; color: #eee;
  border-radius: 7px; padding: 5px 10px; font: inherit; cursor: pointer; }
.pv-bar button[aria-pressed="true"] { background: #e2e5e6; color: #111; border-color: #e2e5e6; }
.pv-bar .pv-x { margin-left: auto; }
.pv-panel { margin-top: 6px; color: #bbb; font-size: 12px; white-space: normal; max-height: 30vh; overflow: auto; }
.pv-panel[hidden] { display: none; }
.pv-panel table { border-collapse: collapse; margin-top: 4px; }
.pv-panel td { padding: 1px 8px 1px 0; }
.pv-sw { display: inline-block; width: .9em; height: .9em; border-radius: 3px; vertical-align: -1px; border: 1px solid #666; }
.pv-mini { position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 9999;
  appearance: none; border: 0; border-radius: 8px; background: rgba(20,20,22,.9); color: #eee; padding: 8px 12px; font: 13px system-ui, sans-serif; }
.pv-mini[hidden], .pv-bar[hidden] { display: none; }
</style>
<div class="pv-bar" id="pv-bar">
  <div class="pv-r"><span class="pv-l">模式</span>
    <button data-k="th" data-v="light">白天（現況）</button><button data-k="th" data-v="dark">夜間</button>
    <button class="pv-x" id="pv-more">數字</button><button id="pv-hide">收起</button></div>
  <div class="pv-r"><span class="pv-l">夜間配色</span>
    <button data-k="pal" data-v="a">Ⓐ 暗夜</button><button data-k="pal" data-v="b">Ⓑ 窄帶藍灰</button></div>
  <div class="pv-r"><span class="pv-l">開關放</span>
    <button data-k="pos" data-v="head">頁首</button><button data-k="pos" data-v="foot">頁尾</button><button data-k="pos" data-v="none">不放（跟手機）</button></div>
  <div class="pv-panel" id="pv-panel" hidden></div>
</div>
<button class="pv-mini" id="pv-mini" hidden>切換條</button>
<script>
(function(){
  var r=document.documentElement, NUM=${JSON.stringify(NUM)}, PAL=${JSON.stringify(PAL)}, SN=${JSON.stringify(SPECNAME)};
  function sync(){
    document.querySelectorAll('.pv-bar [data-k]').forEach(function(b){ b.setAttribute('aria-pressed', r.dataset[b.dataset.k]===b.dataset.v); });
    var dark=r.dataset.theme==='dark';
    document.querySelectorAll('.pv-th').forEach(function(b){ b.setAttribute('aria-label', dark?'切換到白天模式':'切換到夜間模式'); });
    document.querySelectorAll('.pv-th-t').forEach(function(s){ s.textContent = dark?'白天模式':'夜間模式'; });
    var m=document.querySelector('meta[name="theme-color"]'); if(m) m.content = dark ? PAL[r.dataset.pal].paper : '#12656a';
    var u=new URL(location.href); u.searchParams.set('th',r.dataset.theme); u.searchParams.set('pal',r.dataset.pal); u.searchParams.set('pos',r.dataset.tpos);
    history.replaceState(null,'',u); panel();
  }
  function panel(){
    var k=r.dataset.pal, p=PAL[k], n=NUM[k];
    var sw=function(c){return '<span class="pv-sw" style="background:'+c+'"></span> '+c;};
    var rows=Object.keys(n.spec).map(function(s){var v=n.spec[s];return '<tr><td>'+SN[s]+'</td><td>'+sw(v[0])+'</td><td>字對卡 '+v[1]+'</td><td>填色白字 '+v[2]+'</td></tr>';}).join('');
    var over=document.documentElement.scrollWidth>innerWidth+1;
    var head='';
    if(r.dataset.tpos==='head'){var bt=document.querySelector('.brand-text').getBoundingClientRect(),nv=document.querySelector('.site-nav').getBoundingClientRect(),gp=nv.left-bt.right;
      head='<br>頁首（這個寬度 '+innerWidth+'px）：品牌到選單還剩 '+gp.toFixed(1)+'px　'+(gp<8?'<b style="color:#f88">⚠ 放不下，診所名和選單疊在一起</b>':'✓ 放得下');}
    document.getElementById('pv-panel').innerHTML =
      'Ⓐ／Ⓑ 目前看的是 <b>'+(k==='a'?'Ⓐ 暗夜':'Ⓑ 窄帶藍灰')+'</b>：底 '+sw(p.paper)+'　卡 '+sw(p.card)+'（亮 '+n.lift.toFixed(1)+' L*）　線 '+sw(p.rule)+
      '<br>主文字 '+sw(p.ink)+' 對底 '+n.ink[0]+'／對卡 '+n.ink[1]+'　次要 '+sw(p.soft)+' 對底 '+n.soft[0]+'／對卡 '+n.soft[1]+
      '<br>科別的字階（同色相、只提亮度到對卡 4.5；填色那一階沒動）：<table>'+rows+'</table>'+
      head.slice(4)+'<br>水平捲動：'+(over?'<b style="color:#f88">有（'+(document.documentElement.scrollWidth-innerWidth)+'px）</b>':'沒有');
  }
  document.querySelectorAll('.pv-bar [data-k]').forEach(function(b){ b.addEventListener('click',function(){ r.dataset[b.dataset.k]=b.dataset.v; sync(); }); });
  document.querySelectorAll('.pv-th').forEach(function(b){ b.addEventListener('click',function(){ r.dataset.theme = r.dataset.theme==='dark'?'light':'dark'; sync(); }); });
  document.getElementById('pv-more').onclick=function(){ var q=document.getElementById('pv-panel'); q.hidden=!q.hidden; };
  document.getElementById('pv-hide').onclick=function(){ document.getElementById('pv-bar').hidden=true; document.getElementById('pv-mini').hidden=false; };
  document.getElementById('pv-mini').onclick=function(){ document.getElementById('pv-bar').hidden=false; this.hidden=true; };
  addEventListener('resize', panel); sync();
})();
</script>
`;
const bi = h.lastIndexOf("</body>");
h = h.slice(0, bi) + BAR + h.slice(bi);

fs.mkdirSync(path.join(ROOT, "preview/night-mode"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "preview/night-mode/index.html"), h);
console.log("✓ preview/night-mode/index.html");
for (const k in NUM) console.log(k, PAL[k], "ink", NUM[k].ink, "soft", NUM[k].soft, "lift", NUM[k].lift.toFixed(1), Object.entries(NUM[k].spec).map(([s, v]) => s + " " + v.join("/")).join("  "));
