#!/usr/bin/env node
/* 產生 preview/expression-marks/index.html —— 情緒標記的規格頁（給使用者在手機上看）。
 *
 *   node drafts/expression-marks/preview-gen.mjs
 *
 * ⚠ 那一頁是**快照，不要手改**，改這一支再重跑。
 * ⚠⚠ 九張參考圖**刻意不放進頁面** —— 它們帶著素材站的浮水印，
 *    /preview/ 雖然有三道 noindex，放上去仍然是把別人的圖重新發布。
 *    頁面上畫的是**我們自己照量到的比例重畫的九個符號**。
 * 規格與數字的唯一出處是 ILLUSTRATION.md 第十八節，這裡不另外維護一份判斷。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "../..");
const OUT = path.join(ROOT, "preview/expression-marks/index.html");

const S = `fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;

/* 一顆頭：⑮⑰ 的規格。髮頂 y=16、下巴 y=94 → 頭高 78 單位 */
const HEAD_UNITS = 78;
const head = (mouth = "smile") => {
  const m = { smile: `M 52 78 q 8 7 16 0`,
              talk:  `M 56 80 a 4.5 5 0 1 0 8 0 a 4.5 5 0 1 0 -8 0`,
              worry: `M 52 80 q 8 -6 16 0` }[mouth];
  return `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 33 56 q 0 -34 27 -34 q 27 0 27 34 q 0 30 -27 38 q -27 -8 -27 -38"/>
    <path d="M 30 50 q 2 -34 30 -34 q 28 0 30 34 q -6 -14 -30 -16 q -18 -1 -30 16 z" fill="currentColor"/>
    <path d="M 44 58 q 5 -3 10 0"/><path d="M 66 58 q 5 -3 10 0"/>
    <path d="M 58 66 q -2 5 2 6"/>
    <path d="${m}" ${mouth === "talk" ? 'fill="currentColor" stroke="none"' : ""}/>
  </g>
  <g fill="currentColor"><ellipse cx="49" cy="66" rx="2.6" ry="3.4"/><ellipse cx="71" cy="66" rx="2.6" ry="3.4"/></g>`;
};

const MARKS = [
  { name: "驚嘆號", pct: 24, mean: "嚇一跳、發現不對", use: "「原來我刷錯了」那一類的<b>第一格</b>",
    warn: "要<b>傾斜</b>，不要正立的", draw:
    `<g transform="rotate(12 50 50)"><path d="M 50 14 L 50 64" ${S}/><circle cx="50" cy="84" r="5" fill="currentColor"/></g>` },
  { name: "問號", pct: 26, mean: "不懂、在疑惑", use: "病患端的疑問",
    warn: "⚠ <b>不要給醫師用</b>", draw:
    `<path d="M 30 32 q 2 -22 22 -20 q 20 2 16 20 q -3 13 -16 18 q -4 2 -4 12" ${S}/><circle cx="48" cy="86" r="5" fill="currentColor"/>` },
  { name: "三條短斜線", pct: 30, mean: "開心、有精神、事情成了", use: "四格故事的<b>最後一格</b>",
    warn: "可以左右各一組，<b>對稱版更興奮一階</b>", draw:
    `<path d="M 20 76 L 12 44" ${S}/><path d="M 50 70 L 50 22" ${S}/><path d="M 80 76 L 88 44" ${S}/>` },
  { name: "汗滴", pct: 28, mean: "尷尬、有點為難", use: "家長的「會不會很貴」那種為難",
    warn: "尖端<b>朝上</b>", draw:
    `<path d="M 50 12 q 22 38 22 50 a 22 22 0 0 1 -44 0 q 0 -12 22 -50 z" ${S}/>` },
  { name: "螺旋＋小圈", pct: 33, mean: "困擾、想不通", use: "資訊太多、選項太多的場面",
    warn: "", draw:
    `<path d="M 86 20 q -30 -10 -44 8 q -14 18 6 26 q 16 6 20 -6 q 3 -10 -8 -12 q -10 -1 -12 8" ${S}/>
     <circle cx="26" cy="72" r="8" ${S}/><circle cx="12" cy="88" r="5" ${S}/>` },
  { name: "四角星", pct: 18, mean: "想通了、發亮、變好了", use: "這一顆<b>推翻了一條我們自己定的 AVOID</b>",
    warn: "只有<b>四</b>個角；一顆，或一大一小兩顆", draw:
    `<path d="M 50 6 Q 56 44 92 50 Q 56 56 50 94 Q 44 56 8 50 Q 44 44 50 6 z" fill="currentColor"/>` },
  { name: "三個漸大的圓", pct: 49, mean: "正在想事情", use: "「要不要做」的猶豫",
    warn: "⚠ 只畫引導泡，<b>不畫泡泡本體</b> —— 那是長字的落點", draw:
    `<circle cx="18" cy="86" r="7" ${S}/><circle cx="44" cy="58" r="12" ${S}/><circle cx="76" cy="24" r="18" ${S}/>` },
  { name: "耳邊同心弧線", pct: 35, mean: "⚠ <b>正在講電話</b>（<b>不是</b>「在聽別人說話」）",
    use: "打電話預約；<b>麻醉醫師打電話來做術前諮詢</b>",
    warn: "⚠⚠ <b>那隻手和那支手機一定要畫出來</b> —— 沒有它們，弧線什麼都不是", draw:
    `<rect x="6" y="28" width="22" height="44" rx="6" ${S}/>
     <path d="M 38 26 q 22 24 0 48" ${S}/><path d="M 58 16 q 30 34 0 68" ${S}/>
     <path d="M 78 8 q 36 42 0 84" ${S}/>` },
  { name: "燈泡", pct: 30, mean: "想到了", use: "⚠ 九個裡<b>最像廣告</b>的一個",
    warn: "<b>只給病患端</b>。醫師頭上亮燈泡 ＝ 他想到一個方案要賣你", draw:
    `<path d="M 50 26 a 18 18 0 0 1 12 31 l 0 8 l -24 0 l 0 -8 a 18 18 0 0 1 12 -31 z" ${S}/>
     <path d="M 40 74 L 60 74" ${S}/><path d="M 50 12 L 50 2" ${S}/>
     <path d="M 22 24 L 14 17" ${S}/><path d="M 78 24 L 86 17" ${S}/>` },
];

/* 「被禁的那四個」長什麼樣 —— 使用者 2026-09-20 問「這是什麼」，畫出來比形容有用 */
const T = `fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"`;
const BANNED = [
  { name: "背景速度線", what: "人或物後面拉一排平行長線，表示<b>跑得很快</b>。",
    who: "漫畫用的，和我們這種手繪雜誌插畫不同調",
    svg: [0,1,2,3,4,5].map(i=>`<path d="M ${6+i%2*6} ${18+i*11} L ${62+i%2*5} ${18+i*11}" ${T}/>`).join("")
       + `<circle cx="80" cy="50" r="13" ${T}/>` },
  { name: "集中線", what: "從畫面四周往一個點聚攏的放射狀密線，表示<b>震驚、快看這裡</b>。",
    who: "日本漫畫的招牌手法",
    svg: Array.from({length:28},(_,i)=>{const a=i/28*Math.PI*2;
      return `<path d="M ${(50+Math.cos(a)*52).toFixed(1)} ${(50+Math.sin(a)*52).toFixed(1)} L ${(50+Math.cos(a)*24).toFixed(1)} ${(50+Math.sin(a)*24).toFixed(1)}" ${T}/>`;}).join("") },
  { name: "爆炸狀星芒", what: "一圈<b>鋸齒狀</b>的爆炸形，或從一點射出很多條長短不一的光。",
    who: "⚠ 左邊是它，右邊是我們要的<b>四角星</b> —— <b>兩件事</b>",
    svg: `<g transform="translate(-6 0) scale(.78)">`
       + `<path d="${Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2-Math.PI/2, r=i%2?20:48;
           return `${i?"L":"M"} ${(50+Math.cos(a)*r).toFixed(1)} ${(50+Math.sin(a)*r).toFixed(1)}`;}).join(" ")} z" fill="currentColor"/></g>`
       + `<path d="M 50 6 Q 56 44 92 50 Q 56 56 50 94 Q 44 56 8 50 Q 44 44 50 6 z" fill="currentColor"
            transform="translate(72 30) scale(.42)"/>` },
  { name: "對話框", what: "白色泡泡，<b>裡面要填字</b>。",
    who: "⚠ 這一個我建議<b>維持禁用</b>，理由在下面",
    svg: `<path d="M 10 16 h 80 a 6 6 0 0 1 6 6 v 40 a 6 6 0 0 1 -6 6 h -46 l -18 16 v -16 h -16 a 6 6 0 0 1 -6 -6 v -40 a 6 6 0 0 1 6 -6 z" ${T}/>` },
];
const bannedCells = BANNED.map((x) => `
  <figure class="mk bad">
    <svg viewBox="-6 -6 112 112" role="img" aria-label="${x.name}">${x.svg}</svg>
    <figcaption><b class="nm">${x.name}</b>
      <span class="mean">${x.what}</span>
      <span class="warn">${x.who}</span></figcaption>
  </figure>`).join("");

/* 把一個標記擺到頭旁邊，高度 = 頭高 × pct */
const placed = (draw, pct, x, y) => {
  const k = (HEAD_UNITS * pct / 100) / 100;
  return `<g transform="translate(${x} ${y}) scale(${k.toFixed(4)})">${draw}</g>`;
};

const cells = MARKS.map((m) => `
  <figure class="mk">
    <svg viewBox="-6 -6 112 112" role="img" aria-label="${m.name}">${m.draw}</svg>
    <figcaption>
      <b class="nm">${m.name}</b>
      <span class="pct">頭高的 ${m.pct}%</span>
      <span class="mean">${m.mean}</span>
      <span class="use">${m.use}</span>
      ${m.warn ? `<span class="warn">${m.warn}</span>` : ""}
    </figcaption>
  </figure>`).join("");

/* 尺寸示範：一顆頭 ＋ 三個實際比例的標記 */
const star = MARKS.find((m) => m.name === "四角星");
const lines = MARKS.find((m) => m.name === "三條短斜線");
const think = MARKS.find((m) => m.name === "三個漸大的圓");
const H = HEAD_UNITS;                        /* 78 */
const shelf = (m, x) => {                    /* 底部對齊下巴線 y=94 */
  const h = H * m.pct / 100;
  return `<g transform="translate(${x} ${(94 - h).toFixed(2)}) scale(${(h / 100).toFixed(4)})">${m.draw}</g>`;
};
const scaleDemo = `<svg viewBox="8 6 286 112" class="demo" role="img"
  aria-label="一顆頭和三個照實際比例畫的標記，共用同一條下巴基線">
  ${head("smile")}
  ${shelf(star, 130)}${shelf(lines, 180)}${shelf(think, 232)}
  <g class="ann" fill="none" stroke="currentColor" stroke-width=".9">
    <path d="M 22 16 L 22 94" stroke-dasharray="3 3"/>
    <path d="M 19 16 L 25 16 M 19 94 L 25 94"/>
    <path d="M 118 94 L 286 94" stroke-dasharray="2 4" opacity=".55"/>
  </g>
  <g class="lbl" font-size="8" text-anchor="middle">
    <text x="60" y="108">頭高 100%</text>
    <text x="137" y="108">星 18%</text>
    <text x="191" y="108">斜線 30%</text>
    <text x="251" y="108">引導泡 49%</text>
  </g>
</svg>`;

/* 一人一組的三個例外 */
const q = MARKS.find((m) => m.name === "問號");
const ex1 = `<svg viewBox="-4 6 248 96" role="img" aria-label="兩個人共用一個問號">
  ${head("worry")}<g transform="translate(240 0) scale(-1 1)">${head("worry")}</g>
  ${placed(q.draw, 30, 96, 22)}</svg>`;
const ex2 = `<svg viewBox="-4 6 128 96" role="img" aria-label="一大一小兩顆星">
  ${head("smile")}${placed(star.draw, 18, 94, 18)}${placed(star.draw, 11, 84, 40)}</svg>`;
const ex3 = `<svg viewBox="-52 6 224 96" role="img" aria-label="左右對稱兩組斜線">
  ${head("talk")}${placed(lines.draw, 30, 96, 14)}
  <g transform="translate(-46 14) scale(${((HEAD_UNITS * 0.3) / 100).toFixed(4)})">${lines.draw}</g></svg>`;

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>情緒標記的字彙 — 芳仁牙醫</title>
<style>
:root{
  --paper:#e2e5e6; --card:#f4f4f5; --rule:#cdd0d2;
  --ink:#2a2c27; --ink-soft:#5c5f57;
  --teal:#214D48; --blue:#3C596B; --brick:#AF4C52;
  --head:#393736; --pad:clamp(1.25rem,3vw,2.5rem); --radius:12px;
  --shadow:0 1px 2px rgba(42,44,39,.07),0 4px 10px rgba(42,44,39,.09);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei","Hiragino Sans TC",
              system-ui,-apple-system,"Segoe UI",sans-serif;
  font-size:17px;line-height:1.85;letter-spacing:.01em;overflow-x:hidden}
.wrap{max-width:52rem;margin:0 auto;padding:0 var(--pad) 5rem}
.pv-head{background:var(--head);color:#f4f4f5;padding:2rem var(--pad) 1.6rem;margin-bottom:1.6rem}
.pv-head .in{max-width:52rem;margin:0 auto}
.pv-head .kick{font-size:.78rem;letter-spacing:.16em;opacity:.72;margin:0 0 .3rem}
.pv-head h1{font-size:1.5rem;line-height:1.4;margin:0 0 .6rem;letter-spacing:.02em}
.pv-head p{margin:0;font-size:.95rem;line-height:1.75;opacity:.88}
h2{font-size:1.18rem;line-height:1.5;margin:2.8rem 0 .5rem;padding-top:1.4rem;border-top:2px solid var(--rule)}
h2 .n{color:var(--ink-soft);font-size:.86rem;letter-spacing:.1em;display:block;margin-bottom:.2rem}
h3{font-size:1rem;margin:1.8rem 0 .4rem}
p{margin:.5rem 0 1rem}
.lead{color:var(--ink-soft);font-size:.95rem;margin-top:0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.86em;
     background:rgba(42,44,39,.07);padding:.08em .35em;border-radius:4px}
.card{background:var(--card);border-radius:var(--radius);padding:1rem 1.1rem;
      box-shadow:var(--shadow);margin:1rem 0 1.4rem}
.card h3{margin-top:0}
.quote{border-left:4px solid var(--blue);background:rgba(60,89,107,.07);
  border-radius:0 8px 8px 0;padding:.7rem .9rem;margin:.8rem 0;font-size:.92rem;line-height:1.8}
.quote.bad{border-left-color:var(--brick);background:rgba(175,76,82,.06)}
.quote.good{border-left-color:var(--teal);background:rgba(33,77,72,.07)}

.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;margin:1rem 0 1.6rem}
@media(min-width:680px){.grid{grid-template-columns:repeat(3,1fr)}}
.mk{margin:0;background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);
    padding:.8rem .8rem .9rem;display:flex;flex-direction:column}
.mk svg{display:block;width:100%;max-width:104px;margin:0 auto .5rem;color:var(--ink)}
.mk figcaption{font-size:.8rem;line-height:1.6}
.mk .nm{display:block;font-size:.95rem;line-height:1.5}
.mk .pct{display:inline-block;font-size:.7rem;letter-spacing:.04em;color:#f4f4f5;
  background:var(--blue);border-radius:4px;padding:.05em .45em;margin:.15rem 0 .3rem}
.mk .mean{display:block;color:var(--ink-soft)}
.mk .use{display:block;margin-top:.3rem}
.mk.bad{border-left:4px solid var(--brick)}
.mk .warn{display:block;margin-top:.35rem;padding-top:.35rem;border-top:1px dashed var(--rule);
  color:var(--brick);font-size:.76rem;line-height:1.6}

.figbox{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);
  padding:1rem .8rem;margin:1rem 0}
.figbox svg{display:block;width:100%;height:auto;color:var(--ink)}
.figbox .cap{font-size:.82rem;line-height:1.65;color:var(--ink-soft);margin:.6rem .3rem 0}
.demo .ann{opacity:.5}
.demo .lbl{fill:var(--ink-soft)}

table{width:100%;border-collapse:collapse;font-size:.86rem;line-height:1.65;margin:.8rem 0 1.4rem}
th,td{text-align:left;padding:.5rem .55rem;border-bottom:1px solid var(--rule);vertical-align:top}
th{font-size:.76rem;letter-spacing:.05em;color:var(--ink-soft);font-weight:600}
.tw{overflow-x:auto}
ul,ol{margin:.4rem 0 1.2rem;padding-left:1.3rem}
li{margin:.35rem 0}
.ask{background:var(--card);border-radius:var(--radius);padding:1rem 1.1rem;
  box-shadow:var(--shadow);margin:.8rem 0;border-left:4px solid var(--blue)}
.ask > b:first-child{display:block;margin-bottom:.2rem}
.foot-note{font-size:.82rem;color:var(--ink-soft);line-height:1.7;margin-top:2.4rem;
  padding-top:1.2rem;border-top:1px solid var(--rule)}
</style>
</head>
<body>

<header class="pv-head"><div class="in">
  <p class="kick">插畫規格・2026-09-20</p>
  <h1>表情外面那些標記</h1>
  <p>你貼的九組參考，整理成一套可以直接用的字彙。
     <b>頁面上這九個符號是我照量到的比例自己重畫的</b> ——
     參考圖帶著素材站的浮水印，我沒有把它們放上站。</p>
</div></header>

<div class="wrap">

<p class="lead">規格的唯一出處是 <code>ILLUSTRATION.md</code> 第十八節，參考圖在
  <code>drafts/expression-marks/</code>（九張，不會上站）。</p>

<h2><span class="n">§ 1</span>你點到的正是最貴的那條病</h2>
<p>不是新問題。翻一次紀錄，六輪都在同一件事上來回：</p>
<div class="tw"><table>
  <tr><th>哪一輪</th><th>症狀</th></tr>
  <tr><td>〈牙齒矯正〉</td><td>表情要「屬於那個場合」，來回改過</td></tr>
  <tr><td>〈生物陶瓷〉</td><td>臉會<b>顯老</b>，成因是風格段自己造成的</td></tr>
  <tr><td>〈三個月一次〉第四版</td><td>治完「太寫實」，臉<b>變呆板</b></td></tr>
  <tr><td>〈小朋友的牙套〉第七、八版</td><td>表情<b>串台</b>，連著兩輪、方向相反</td></tr>
  <tr><td>〈隱形矯正〉第六輪</td><td>重生成的男醫師<b>長出法令紋與眼下陰影</b></td></tr>
  <tr><td>〈八成人有牙周病〉第三輪</td><td>四位醫事人員<b>同一張臉、同一個開口</b></td></tr>
</table></div>
<div class="quote good">
  <b>前面每一輪都在治「臉本身」。你這九組給的是另一條路：</b>
  臉維持極簡，情緒交給臉<b>外面</b>的符號。那條路我們幾乎沒走過 ——
  站上只有「動作線」（貼在物體上），<b>沒有情緒標記</b>。
</div>

<h2><span class="n">§ 2</span>臉本身：九組的共通規格</h2>
<div class="figbox">
  <svg viewBox="16 6 88 96" style="max-width:220px;margin:0 auto">${head("smile")}</svg>
  <p class="cap">眼＝<b>實心小橢圓</b>（沒有眼白、沒有高光、沒有睫毛）・
    眉＝一條細短弧，離眼睛有距離・鼻＝一個小勾・嘴＝小。
    這顆頭是照 ⑮⑰ 的規格畫的。</p>
</div>
<ul>
  <li><b>眉毛是情緒差異最大的零件</b>，比嘴巴管用（往上＝驚訝、往下靠近眼＝專注或不悅）。</li>
  <li><b>眼睛愈簡單愈不會顯老</b> —— 這正好治我們踩過的「畫得太準」。</li>
  <li>腮紅要用就用<b>兩三條小斜線</b>，不要圓粉餅（圓的會把年齡讀低）。</li>
  <li>⚠ 你貼的第九組（六格多彩那張）<b>眼睛有眼白、線也最粗</b> ——
      那一組<b>只看標記，不要照抄臉</b>。</li>
</ul>

<h2><span class="n">§ 3</span>九個符號（這就是字彙表）</h2>
<p class="lead">每一格下面那個藍籤是<b>實測</b>：那個符號應該有頭高的百分之幾。</p>
<div class="grid">${cells}</div>

<h2><span class="n">§ 4</span>實際多大：照比例擺一次給你看</h2>
<div class="figbox">${scaleDemo}
  <p class="cap">符號要<b>很輕</b> —— 實測墨量只有頭的 4%~16%。
    重了就從「修飾」變成「主角」。⚠ 數字當<b>上限</b>用，不要當目標值。</p>
  <p class="cap" style="margin-top:.5rem;padding-top:.5rem;border-top:1px dashed var(--rule)">
    ⚠⚠⚠ <b>還有一個「用得上的下限」</b>（2026-09-20 試改那一輪量出來的，見 §11）：
    標記只有頭高的 1/5~1/3，所以<b>頭在畫面上至少要 30px</b>，標記才有 10px、才看得見。
    換算回母檔 ＝ <b>頭在原圖裡至少要 180px 高</b>。<b>算不到就不要加</b> ——
    加了也是白加。多格分割的圖幾乎一定過不了這一關。</p>
</div>

<h2><span class="n">§ 5</span>兩個家族，不可以混在同一個人身上</h2>
<p>站上<b>已經有</b>一套標記規格（動作線）。新的這一套不是取代它，是另一個家族。</p>
<div class="tw"><table>
  <tr><th></th><th>家族 A・動作線（既有）</th><th>家族 B・情緒標記（新）</th></tr>
  <tr><td>貼著誰</td><td>物體或身體部位（指尖、手腕、那顆牙）</td><td>整個人，浮在輪廓<b>外</b></td></tr>
  <tr><td>位置</td><td>緊貼那個東西的外緣</td><td>頭的斜上方、正上方或耳側，<b>和頭髮之間留一道白</b></td></tr>
  <tr><td>講什麼</td><td>這個東西<b>剛剛動了</b></td><td>這個人<b>心裡在想什麼</b></td></tr>
  <tr><td>長相</td><td>2~4 條同向、等距的極短直線</td><td>一個<b>有形狀的符號</b></td></tr>
  <tr><td>尺寸</td><td>不超過它所屬東西的寬度</td><td>一般 ≤ 頭高 1/3；星 ≤ 1/4；一串的可到 1/2</td></tr>
  <tr><td>顏色</td><td>線色</td><td>線色，<b>不另外上色</b></td></tr>
</table></div>
<div class="quote bad"><b>⚠⚠ 兩個家族可以同時出現在一張圖裡，
  但不可以同時出現在同一個人身上。</b><br>
  一個人既有指尖動作線、頭上又有星星，讀起來是兩件事在搶同一個人。</div>

<h2><span class="n">§ 6</span>「一人一組」的三個例外</h2>
<p class="lead">都是從你補的那三組新的看出來的 —— 不要當成違規。</p>
<div class="figbox">${ex1}
  <p class="cap"><b>① 兩個人共用一個符號。</b>
    「他們兩個都不懂」。⚠ 只在兩人<b>並排且同一個情緒</b>時成立。</p></div>
<div class="figbox">${ex2}
  <p class="cap"><b>② 一大一小成組。</b>兩顆星算<b>一組</b>，不是兩個標記。</p></div>
<div class="figbox">${ex3}
  <p class="cap"><b>③ 左右對稱的兩半。</b>也算一組，而且對稱版讀起來
    <b>比單側更興奮一階</b> —— 可以當強度的尺。</p></div>

<h2><span class="n">§ 7</span>⚠ 兩條紅線（照抄參考圖就會踩）</h2>
<div class="card">
  <h3>① 頭上的手寫文字，一個都不准</h3>
  <p>你貼的粉彩那一組，有幾格頭上是<b>手寫的日文假名</b>當語氣標記。
     那是日本素材的做法。我們站上「圖裡不准有任何文字」是硬紅線，
     而且〈口腔外科〉那一輪已經踩過三種「字漏進圖裡」的形式。</p>
  <p class="cap"><b>文字型標記 ＝ 在提示詞裡自己開一個長字的洞。</b></p>
</div>
<div class="card">
  <h3>② 標記不可以拿來取代表情</h3>
  <p>九組裡<b>每一張臉都還是有表情</b>，標記只是把它講得更清楚一點。
     反過來做（臉畫平、全靠符號）會得到一張像貼圖包的圖 ——
     而且縮到首頁卡 335px 的時候<b>符號會先糊掉</b>，等於什麼都沒講。</p>
</div>

<h2><span class="n">§ 8</span>⚠ 那條「禁用清單」——我要先認一件事</h2>
<div class="quote bad">
  你問「這是什麼　怎麼會有這個禁止」。查完了：<b>那不是你定的，是我自己加的。</b><br><br>
  2026-09-19 我在寫〈隱形矯正〉第三輪的提示詞時，順手加了一行
  「AVOID：背景速度線、集中線、星芒、任何形式的對話框」——
  <b>那只是那一張圖的一行防守</b>，怕模型飄成漫畫風。<br>
  它<b>不在紅線表裡</b>（A 類是你親口說的、B 類是我推的、可以被推翻），
  <b>兩類都沒有它</b>。然後我在寫這份規格時，
  把它升格成「全站全禁、一條都沒放寬」——<b>那是我越權。</b>
</div>

<h3>先看那四個到底長什麼樣</h3>
<div class="grid">${bannedCells}</div>

<h3>它們現在的狀態（已更正）</h3>
<div class="tw"><table>
  <tr><th></th><th>狀態</th><th>理由</th></tr>
  <tr><td><b>爆炸狀星芒</b></td><td>維持不要</td>
      <td>它和你參考圖裡那顆<b>四角星是兩件事</b>。四角星已經放行</td></tr>
  <tr><td><b>對話框</b></td><td><b>建議維持禁用</b></td>
      <td>這一條有真的理由，不是我的偏好：全站硬紅線是「圖裡不准有任何文字」，
          而<b>泡泡一出現，模型就會想往裡面填字</b>。〈口腔外科〉那一輪已經踩過三種漏字</td></tr>
  <tr><td><b>背景速度線</b></td><td>⬇ 降成<b>「我推的，可以推翻」</b></td>
      <td>我的理由只有「會變漫畫風」。<b>那是美感判斷，該你決定，不是我</b></td></tr>
  <tr><td><b>集中線</b></td><td>⬇ 同上</td><td>同上</td></tr>
</table></div>
<div class="quote good"><b>所以要不要用，你說了算。</b>
  我把後面兩條移到「可以被推翻」那一類了，日後不會再拿它擋你。</div>

<h3>四角星那一條（這個沒變）</h3>
<p>你貼的三組參考都大方用了四角星，所以它放行，四個條件：
   ① 只有<b>四</b>個角；② 一組（一顆或一大一小）；③ 在頭的斜上方，不在背景也不在物體上；
   ④ 高度<b>不超過頭高的 1/4</b>。</p>
<p class="cap">⚠ 已經上線的〈隱形矯正〉那張<b>不必回去改</b>（那張圖沒有情緒標記）。</p>

<h2><span class="n">§ 9</span>順帶解掉一個踩過兩次的坑</h2>
<div class="quote good">
  你補的那組<b>全男性</b>的參考，八張男臉<b>沒有一張有法令紋或眼下陰影</b> ——
  皮膚一個平塗色，臉上只有眉、眼、鼻的小勾、嘴四樣，
  <b>年齡差異完全靠髮型與髮色</b>。<br><br>
  我們在〈生物陶瓷〉和〈隱形矯正〉各踩過一次「男臉顯老」。
  <b>下次畫男性角色，那一張就是參考圖</b> —— 比在提示詞裡寫「三十出頭、不要顯老」可靠得多。
</div>

<h2><span class="n">§ 10</span>第一次試用的結果（〈八成人有牙周病〉）</h2>
<div class="quote bad"><b>你看完第一句話是「好像沒差多少」。量完之後證實你是對的，
  而且原因不是你的眼睛 —— 是那張圖根本不夠大。</b></div>

<h3>① 最重要的一條：那張圖不適合當試驗場</h3>
<div class="tw"><table>
  <tr><th></th><th>原圖 2000 寬</th><th>你手機上（圖寬 335）</th><th>LINE 分享卡（212）</th></tr>
  <tr><td>少年的頭</td><td>84px</td><td><b>14.1px</b></td><td>8.9px</td></tr>
  <tr><td>耳邊弧線</td><td>28px</td><td><b>4.6px</b></td><td>2.9px</td></tr>
  <tr><td>那顆星</td><td>51px</td><td>8.5px</td><td>5.4px</td></tr>
</table></div>
<p><b>一個 4.6px 的標記不可能被看見。</b>那張圖的周邊四格各只佔 22% 寬，
  人本來就小 —— <b>標記再怎麼畫對都沒有用。</b></p>
<div class="quote bad">⚠ <b>我挑錯題目了。</b>我是因為「四個人、四種情緒」聽起來最對才挑那張，
  <b>那是憑語意挑的，不是量出來挑的</b>。下次要試，先量頭有多高。</div>

<h3>② 弧線規格完全命中，但<b>意思被我記錯了</b></h3>
<p>實測頭高的 <b>33%</b>（規格寫 35%）、墨量 <b>6%</b>（規格寫 4~16%）——
  <b>模型做得到，規格是對的。</b></p>
<div class="quote good">你當場更正：<b>「耳邊同心圓是這個人正在聽手機」</b>。
  回去看那組全男性的參考 —— 那個人<b>手裡拿著手機貼在耳朵上</b>，弧線是從手機散出來的。<br>
  我記成「聽到了」還寫成「病患在聽醫師說明」，<b>是錯的</b>。這一輪正好掛在一個
  <b>沒拿手機</b>的少年耳邊，結果讀起來像旁邊的檯燈在響。<br>
  <b>§3 那一格已經改好了</b>，符號現在連手機一起畫。</div>

<h3>③ 星星三項全錯，而成因可以推廣</h3>
<p>規格要四角、不超過頭高 1/4、墨量 4~16%。實際畫出來是
  <b>五角、頭高的 60%、墨量 65%</b>，純黑實心，位置飄到天花板附近——<b>像一張貼紙</b>。</p>
<div class="quote"><b>通則：畫面裡沒有先例的形狀，模型會去拿現成的圖示貼上來。</b><br>
  弧線之所以畫對，是因為那張圖裡<b>本來就有一整套手繪短線標記</b>可以接；
  星星在那張圖裡沒有任何近親，模型就退回它最熟的那顆五角星。<br>
  <b>對策</b>：要加一個畫面裡沒有先例的符號，就給一個<b>畫面內的參照</b>
  （「和右邊那幾條短線同一支筆畫的」「不比他的眼睛大」），不要只描述它。</div>

<h3>④ ⚠ 它沒有改圖，是<b>整張重畫</b></h3>
<p>逐像素比對：<b>6.60% 的像素有差，而且平均散在整張圖的每一格</b>。
  構圖、人物、道具都還在（所以才會「好像沒差多少」），
  但<b>每一條線都重新落點了一次</b>，中央那面螢幕因此有可見的退步：
  警示三角裡的驚嘆號糊掉、島上的圓點變成空心圈、<code>24.7%</code> 的百分號變形。</p>
<div class="quote bad">⚠⚠ 所以「只加東西就改圖、不要重生成」<b>有一個前提：工具真的做得到改圖</b>。
  下次改圖回來，<b>第一件事是逐像素比對，不要用看的</b> ——
  看起來一樣不代表沒被重畫，而被重畫過的圖，已經對的細節是靠運氣留下來的。</div>

<h3>⑤ 唯一完全通過的一項</h3>
<div class="quote good"><b>串台沒有發生。</b>左上、左下與中控室那五個人身上
  <b>一個標記都沒有多長出來</b>。§9 那三個配套（逐格點名、四格等重、兩邊都寫）有效。</div>

<h2><span class="n">§ 11</span>要你決定的</h2>
<div class="ask"><b>那張圖到此為止，不要再改它。</b>
  它過不了「頭 180px」那一關，再改幾輪也一樣。</div>
<div class="ask"><b>要不要我去量十六張文章 HERO 的頭有多高，挑一張過得了門檻的？</b>
  單格、一到兩個人的圖才有機會；四格分割的一定不行。量完給你一張表挑。</div>

<p class="foot-note">
  這一頁是規格頁，三道 noindex 都在（頁面 meta、Worker 的標頭、robots.txt），
  搜尋引擎抓不到，但<b>拿到網址的人看得到</b>。<br>
  ⚠ 這一頁是<b>快照，不要手改</b> —— 改
  <code>drafts/expression-marks/preview-gen.mjs</code> 再重跑。<br>
  ⚠ 九張參考圖<b>刻意沒有放進這一頁</b>：它們帶著素材站的浮水印，
  /preview/ 雖然擋了搜尋引擎，放上去仍然是把別人的圖重新發布。
</p>

</div>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ ${path.relative(ROOT, OUT)}　${(html.length / 1024).toFixed(1)} KB　符號 ${MARKS.length} 個`);
