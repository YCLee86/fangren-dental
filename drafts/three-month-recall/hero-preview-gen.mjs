#!/usr/bin/env node
/* 〈三個月一次的洗牙與塗氟〉HERO 五個提案的提案頁
 *
 *   node drafts/three-month-recall/hero-preview-gen.mjs
 *   → preview/three-month-recall-hero/index.html
 *
 * ⚠ 這一頁是**自己寫的獨立頁**，不是 index.html 的複本
 *   （同 clinic-schedule 那一輪，CLAUDE.md 第八節：小元件的提案頁這樣做省事很多），
 *   所以第八節那四個坑一個都不必踩：沒有相對路徑要改、沒有 counter.js、
 *   沒有 SEO:START、沒有 RELATED。class 一律 pv- 前綴。
 *
 * ⚠⚠ **五份提示詞的唯一出處是 HERO-PROMPTS.md**，這一支只把它的 fenced code block
 *   抓出來排版 —— 不要在這裡再寫一份，不然哪天改了一邊就開始說謊。
 *
 * 守門：抓不到五塊、少了 noindex、或提示詞裡出現中文，都 throw。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "preview/three-month-recall-hero/index.html");

const md = fs.readFileSync(path.join(HERE, "HERO-PROMPTS.md"), "utf8");

// 只抓「四、五份提示詞」那一節底下的 code block
const sec = md.split("## 四、五份提示詞")[1];
if (!sec) throw new Error("HERO-PROMPTS.md 裡找不到第四節");
const blocks = [...sec.matchAll(/### (Ⓐ|Ⓑ|Ⓒ|Ⓓ|Ⓔ|Ⓕ) ([^\n]+)\n\n```\n([\s\S]*?)\n```/g)]
  .map((m) => ({ key: m[1], title: m[2].trim(), prompt: m[3] }));
if (blocks.length !== 6) throw new Error(`抓到 ${blocks.length} 份提示詞，應該是 6 份`);
for (const b of blocks) {
  if (/[一-鿿]/.test(b.prompt)) throw new Error(`${b.key} 的提示詞裡有中文`);
  if (!/CRITICAL — NO WRITING ANYWHERE/.test(b.prompt)) throw new Error(`${b.key} 少了 NO WRITING 那一段`);
  if (!/\b(16:9|4:3|3:2|5:4|1:1|4:5)\b/.test(b.prompt)) throw new Error(`${b.key} 開頭沒有指定長寬比`);
}

// ⚠ Ⓕ 排到最前面 —— 它是建議的那一案，手機上不能要他捲過五案才看到。
//    markdown 裡仍然照字母順序寫，兩邊不必一致。
const ORDER = ["Ⓕ", "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ"];
blocks.sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));

// 每一案的中文說明（畫面／對到哪一段／擋的坑）
const NOTES = {
  "Ⓐ": {
    lead: "同一張診療椅、同一個機位、同一位醫師，四格裡換的是坐上去的人。",
    maps: "〈哪些人適用〉",
    scene: [
      "三十幾歲的孕婦、五十幾歲的男性上班族、七十幾歲的阿嬤、四十幾歲綁著頭巾的女性，四個人依序坐上同一張椅子。",
      "醫師的動作每一格微調：拿口鏡看／側頭聽／遞漱口杯／笑著點頭。",
    ],
    guards: [
      "身分靠<b>手邊的東西</b>給，不靠身體給 —— 媽媽手冊、膝上的藥袋、靠著椅子的拐杖、手邊的保溫杯。不畫點滴、不畫輪椅、不畫病容。",
      "四個人的姿勢、視線、表情各自不同，衣服顏色互不重複 —— 不然會變成型錄。",
      "站上最好讀的手法是「同一個機位重複、只有一件事在變」；〈牙齦流血〉那張變的是時間，這一張變的是人。",
    ],
    why: "直接畫「對象」＝ 這一篇的定位，而且一眼破掉「這是老人的事」那個刻板印象。",
  },
  "Ⓑ": {
    lead: "一張診間桌面幾乎佔滿整張圖，桌上是藥袋、藥板、用藥紀錄、健保卡。",
    maps: "〈來的時候〉",
    scene: [
      "微微俯視。只看得到兩雙手：病患的手把藥袋推過去，醫師的手扶著翻開的小冊。",
      "畫面最上緣只露出一點診療椅的扶手與白袍下襬，剛好夠說這是牙科。",
    ],
    guards: [
      "這一格長字的風險最高（藥板、小冊、卡片、藥袋都是「該有字的表面」），所以那一段禁令要逐項點名。",
      "桌上每多一個「沒指定內容的表面」，就多一個外溢的落點 —— 每一樣東西的表面都寫死了。",
    ],
    why: "最不像牙科插畫、辨識度最高，而且畫的是診所真正希望病人做的那件事。缺點是它只講到文章最後一段。",
  },
  "Ⓒ": {
    lead: "孫女剛塗完氟拿到貼紙，阿公手上也有一張一模一樣的。",
    maps: "〈年紀大了，氟的角色會變〉",
    scene: [
      "兩張並排的診療椅。右邊小孫女得意地伸手接貼紙，左邊阿公側坐著看她，半是覺得自己好笑、半是有點得意。",
      "中間的媽媽笑出來。人是主角、佔畫面一大半。",
    ],
    guards: [
      "貼紙上不能有字，畫一顆簡單的牙。",
      "旁邊的人不可以看起來在笑他 —— 要寫成「一起覺得好玩」，不是「笑一個老人在做小孩的事」。〈缺牙之後〉那篇踩過這個坑。",
      "阿公不可以被畫成虛弱、駝背、可憐的樣子。",
    ],
    why: "解掉整篇最反直覺的那一句「塗氟不再只是小孩才做的事」，記憶點最高。",
  },
  "Ⓓ": {
    lead: "醫師和病患在談，上面一個大泡泡分三段，畫的是他自己的生活。",
    maps: "〈為什麼是三個月〉",
    scene: [
      "泡泡裡三段：半夜起來倒水喝（嘴巴乾）／早餐前在餐桌上量血糖／早上刷牙時停下來，對著鏡子看一處紅腫的牙齦。",
      "一個大圓角泡泡加兩條細分隔線，不是三個泡泡，也沒有箭頭。",
    ],
    guards: [
      "三段都不要器械、不要剖面圖 —— 使用者嫌過「太學術了，是我們看模型或書上才會出現的樣子」。",
      "牙齦的紅靠<b>形狀</b>（邊緣鼓起、乳突最腫）不是靠色名，而且不畫血。",
      "⚠ 這個骨架和〈拔智齒〉那張一樣。選它就要接受兩張圖一眼看過去像親戚。",
    ],
    why: "唯一畫得出「口乾／血糖／傷口慢」那三件的做法，而且用生活場景講、不是醫學圖。",
  },
  "Ⓔ": {
    lead: "同一個窗邊、同一張椅子、同一個人，三格裡變的只有窗外的季節。",
    maps: "〈不只是把牙結石清掉〉",
    scene: [
      "六十幾歲的男人坐在候診的長椅上等，很自在。窗外依序是綠葉的樹／下著雨／葉子黃了。",
      "他每一格穿的不一樣（短袖 → 薄外套 → 毛背心），手上的東西也不同（帽子／傘／保溫杯）。",
    ],
    guards: [
      "這一格沒有任何「牙」的資訊，所以識別物要自己列：牆上無字的牙齒海報、門內露出的診療椅一角、淺色刷手服。",
      "窗外的雨要畫成<b>一群同向的短線</b>，不是一條長曲線 —— 〈擴張牙弓〉那張的「靈魂出竅」就是這樣來的。",
      "不准出現月曆、時鐘或任何數字。",
    ],
    why: "最安靜、最像站上的調性，講的是「這件事已經是他生活的一部分」。缺點是它講「常來」不講「誰」。",
  },
  "Ⓕ": {
    lead: "整張圖是七格拼起來的：六個不同的人各自一格，中間一格是醫師。",
    maps: "〈哪些人適用〉（Ⓐ 的改寫）",
    scene: [
      "格子是<b>不規則的多角形</b>、大小不一，中間隔著手繪的細線 —— 不是整齊的四方格。每一格自己一個很淡的底色。",
      "六格：孕婦／拿拐杖的阿嬤／膝上放著藥袋的中年男子／餐桌上量血糖／半夜起來倒水喝／綁著頭巾、手邊保溫杯的中年女性。<b>每個人都在自己家裡，不是在診間。</b>",
      "中間那一格最大：女醫師一手向外攤開，看著四周那幾個人。",
      "<b>比例 4:3</b>，比站上現在那十一張高（見最上面那一段）。",
    ],
    guards: [
      "⚠ <b>不做對話框</b> —— 這一站的圖一個字都不能有，而空的對話框讀起來是「在想一件沒有內容的事」。參考的那三張日本海報全部靠文字說話，我們不能照抄那一半。<b>要對話框版，一句話就換得掉。</b>",
      "⚠ <b>醫師不看鏡頭</b>（站上的紅線）。呼籲靠攤開的手與「她在看那幾個人」給。要她看鏡頭也是一句話，但要你先點頭。",
      "⚠⚠ <b>上下各 12% 會被首頁的卡片切掉</b>（卡片縮圖固定 16:9），所以臉和那幾樣關鍵的東西一個都不能放在那裡 —— 提示詞裡已經寫死這一條。",
      "六格各一個底色，正是為了治 Ⓐ 那個「四格共用同一個診間」的單調。",
    ],
    why: "把 Ⓐ 的內容（誰要三個月一次）換一個排法：從「同一張椅子換人坐」變成「六個人各自在自己的生活裡，中間有人在看著他們」。單調的成因是背景一直沒變，不是人不夠多。",
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cards = blocks.map((b, i) => {
  const n = NOTES[b.key];
  return `
  <section class="pv-case" id="case-${i + 1}">
    <h2><span class="pv-mark">${b.key}</span>${esc(b.title)}</h2>
    <p class="pv-lead">${n.lead}</p>
    <p class="pv-maps">對到文章的　<b>${n.maps}</b></p>
    <h3>畫面</h3>
    ${n.scene.map((s) => `<p>${s}</p>`).join("\n    ")}
    <h3>擋掉的坑</h3>
    <ul>${n.guards.map((g) => `<li>${g}</li>`).join("")}</ul>
    <h3>為什麼提這一案</h3>
    <p>${n.why}</p>
    <div class="pv-pbar"><span>提示詞</span><button class="pv-copy" type="button" data-i="${i}">複製</button></div>
    <pre class="pv-prompt" id="p${i}">${esc(b.prompt)}</pre>
  </section>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>三個月一次的洗牙・HERO 五個提案 — 芳仁牙醫診所</title>
<style>
:root{
  --paper:#e2e5e6; --card:#f4f4f5; --ink:#2a2c27; --ink-soft:#5c5f57;
  --rule:#c9ccc6; --accent:#3f654a; --deep:#2c5238;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  line-height:1.85;font-size:16px}
.pv-shell{max-width:44rem;margin:0 auto;padding:0 14px 4rem}
.pv-head{background:#393736;color:#f4f4f5;padding:.9rem 0}
.pv-head .pv-shell{padding-bottom:0}
.pv-head b{font-weight:700;letter-spacing:.04em}
.pv-head span{color:#c9ccc6;font-size:.86rem;margin-left:.6rem}
h1{font-size:1.5rem;line-height:1.5;margin:1.8rem 0 .4rem}
.pv-sub{color:var(--ink-soft);font-size:.94rem;margin:0 0 1.4rem}
.pv-note{background:var(--card);border:1px solid var(--rule);border-radius:12px;
  padding:1rem 1.1rem;margin:0 0 2rem}
.pv-note p{margin:.4rem 0}
.pv-note p:first-child{margin-top:0}
.pv-note p:last-child{margin-bottom:0}
.pv-ratio table{border-collapse:collapse;width:100%;font-size:.88rem;margin:.6rem 0}
.pv-ratio th,.pv-ratio td{border-bottom:1px solid var(--rule);padding:.4rem .3rem;text-align:right;white-space:nowrap}
.pv-ratio th:first-child,.pv-ratio td:first-child{text-align:left}
.pv-ratio tr.pv-pick td{background:rgba(63,101,74,.09)}
.pv-tw{overflow-x:auto}
.pv-ratio code{font-size:.9em;background:#fff;border:1px solid var(--rule);border-radius:4px;padding:0 .25em}
.pv-case{background:var(--card);border:1px solid var(--rule);border-radius:12px;
  padding:1.1rem 1.1rem 1.3rem;margin:0 0 1.6rem}
.pv-case h2{font-size:1.18rem;line-height:1.5;margin:0 0 .5rem;display:flex;
  align-items:baseline;gap:.5rem;flex-wrap:wrap}
.pv-mark{display:inline-block;background:var(--accent);color:#fff;border-radius:8px;
  padding:.05em .45em;font-size:.92em;line-height:1.5}
.pv-case h3{font-size:.86rem;letter-spacing:.06em;color:var(--deep);
  margin:1.2rem 0 .3rem;font-weight:700}
.pv-case p{margin:.35rem 0}
.pv-lead{font-weight:700}
.pv-maps{color:var(--ink-soft);font-size:.92rem}
.pv-case ul{margin:.3rem 0;padding-left:1.2rem}
.pv-case li{margin:.35rem 0}
.pv-pbar{display:flex;align-items:center;justify-content:space-between;
  margin:1.3rem 0 .4rem;gap:.8rem}
.pv-pbar span{font-size:.86rem;letter-spacing:.06em;color:var(--deep);font-weight:700}
.pv-copy{font:inherit;font-size:.86rem;line-height:1;background:var(--accent);color:#fff;
  border:0;border-radius:8px;padding:.6rem 1.1rem;min-height:44px;cursor:pointer}
.pv-copy.is-done{background:var(--deep)}
.pv-prompt{margin:0;background:#fff;border:1px solid var(--rule);border-radius:8px;
  padding:.8rem .9rem;overflow-x:auto;font-size:12.5px;line-height:1.6;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  white-space:pre-wrap;word-break:break-word;color:#3a3d36;max-height:22rem;overflow-y:auto}
footer{color:var(--ink-soft);font-size:.9rem;margin-top:2.4rem}
footer ol{padding-left:1.2rem}
</style>
</head>
<body>
<header class="pv-head"><div class="pv-shell"><b>芳仁牙醫診所</b><span>提案頁・尚未上線</span></div></header>
<div class="pv-shell">
<h1>〈三個月一次的洗牙與塗氟〉<br>插畫・六個提案</h1>
<p class="pv-sub">文章已經定稿，這一頁只決定圖要畫什麼。都還沒畫，先挑梗。</p>

<div class="pv-note">
<p><b>2026-09-05：Ⓕ 是照你的方向新加的，建議走它。</b></p>
<p>你選了 Ⓐ 但指出它單調 —— <b>成因是四格共用同一個診間、同一片背景</b>，變的只有坐上去的人。
Ⓕ 把它換成七格拼起來的鑲嵌：六個人各自在<b>自己的生活裡</b>、各自一個底色，中間一格是醫師。</p>
<p>Ⓐ~Ⓔ 留著沒有動，往下捲還在。</p>
</div>

<div class="pv-note pv-ratio">
<p><b>拉高之後會長多高（實測）</b></p>
<p>站上十一張 HERO 全部是 16:9。下面是<b>圖高 px ／佔一屏的百分比</b>：</p>
<div class="pv-tw"><table>
<tr><th>比例</th><th>390</th><th>744</th><th>1440</th></tr>
<tr><td>16:9 現況</td><td>204／24%</td><td>371／33%</td><td>369／41%</td></tr>
<tr><td>3:2</td><td>241／29%</td><td>440／39%</td><td>437／49%</td></tr>
<tr class="pv-pick"><td><b>4:3 建議</b></td><td>272／32%</td><td>495／44%</td><td>492／55%</td></tr>
<tr><td>5:4</td><td>290／34%</td><td>528／47%</td><td>525／58%</td></tr>
<tr><td>1:1</td><td>362／43%</td><td>659／58%</td><td>656／73%</td></tr>
<tr><td>4:5</td><td>453／54%</td><td>824／73%</td><td>820／91%</td></tr>
</table></div>
<p>⚠⚠ <b>卡住的是電腦版不是手機</b>：1440 上內文欄 656px，1:1 就吃掉 73% 的螢幕、
4:5 是 91%（點進文章第一眼只有一張圖）。<b>4:3 的 55% 還在可以接受的一側</b>，
而且它正好落在你給的兩張圖中間（絨毛玩偶那張跨頁約 1.45、羽扇豆那張 1:1）。</p>
<p>⚠⚠ <b>首頁的文章卡不能跟著變</b> —— 縮圖固定 16:9，十一張並排，改一張就要重裁十張。
所以拉高的圖<b>在卡片上只露出中間一條</b>：4:3 露 75%、5:4 露 70%、1:1 只剩 56%。
Ⓕ 的提示詞已經把「上下各 12% 不可以放臉與關鍵物件」寫死。</p>
<p>⚠ 另外兩支工具要跟著改（<b>等你挑定再動，各兩行</b>）：縮圖那一支寫死了 16:9 會拒絕出圖、
產生首頁卡的那一支寫死了 <code>width="2000" height="1116"</code>。</p>
</div>

${cards}

<footer>
<p><b>挑定之後</b></p>
<ol>
<li>你出圖（16:9），把原檔給我。</li>
<li>我縮成站上的三個寬度並接進文章，出圖前會擋兩件：四邊有沒有烘進去的白框、長寬比對不對。</li>
<li>定稿的提示詞逐字存進插畫規範，日後要改圖從那一份改、只換出問題的那一段。</li>
<li>文章從草稿搬進正式站、跑一次建置，首頁就會多一張卡。</li>
</ol>
</footer>
</div>
<script>
document.querySelectorAll(".pv-copy").forEach(function (b) {
  b.addEventListener("click", function () {
    var t = document.getElementById("p" + b.dataset.i).textContent;
    var done = function () {
      b.textContent = "已複製";
      b.classList.add("is-done");
      setTimeout(function () { b.textContent = "複製"; b.classList.remove("is-done"); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function () { fallback(t, done); });
    } else { fallback(t, done); }
  });
});
function fallback(t, done) {
  var a = document.createElement("textarea");
  a.value = t; a.setAttribute("readonly", "");
  a.style.position = "fixed"; a.style.top = "-1000px";
  document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(a);
}
</script>
</body>
</html>
`;

if (!/noindex/.test(html)) throw new Error("少了 noindex");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`寫好了：${path.relative(ROOT, OUT)}　${html.length} 字元　${blocks.length} 案：${blocks.map((b) => b.key).join(" ")}`);
