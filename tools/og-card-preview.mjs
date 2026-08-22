#!/usr/bin/env node
/* 產生 preview/og-topic-card/ —— 科別分享卡的提案頁（玻璃濃度 × 地名排法）
 *
 *   node tools/og-card-preview.mjs [spec]      預設 general
 *
 * 為什麼要有這一頁（CLAUDE.md 第八節）：提案只放 fangren.net，不用截圖也不用
 * artifact。使用者 2026-08-22：「我想要像之前那樣另外開網頁看預覽，
 * 另外 ABC 的淡中濃我還沒選，一起做給我選。」
 *
 * ⚠⚠ **這一頁擺的是真的產出檔，不是用 CSS 再做一次玻璃帶。**
 *   理由有兩個：① 用 CSS 重寫一份，哪天 og-plate.mjs 改了這一頁就開始說謊；
 *   ② 要判斷的是 250px 下讀不讀得懂，而**真實的訊息卡是把 1200 的 JPEG
 *   縮下來的點陣圖**，用 CSS 縮放的向量文字會比實際清楚，等於在騙自己。
 *   所以這一支跑十二次 og-plate.mjs，把十二張真的圖寫進 preview/。
 *
 * ⚠ 十二張圖 ≈ 1.7MB。Worker 對 /preview/* 設 no-store（提案頁改得勤），
 *   所以**不要**指望瀏覽器快取 —— 頁面先畫出目前選的那一張，其餘十一張
 *   等 load 之後在背景預抓，切換才不會每次都等下載。
 *
 * ⚠ 定案上線時要做的三件（同第八節）：把選中的那一組跑一次 og-plate 寫進
 *   assets/og-topic-<spec>.jpg、刪掉 preview/og-topic-card/、
 *   把這個檔頭與頁面 <head> 的推導搬進 history/og-topic-card.html。
 *   **這一支是一次性的**（十二格選完就沒事做了），定案時連它一起刪掉。
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = process.argv[2] || "general";
const OUT = path.join(ROOT, "preview", "og-topic-card");

const { TOPICS } = await import("./topic-copy.mjs");
const t = TOPICS[spec];
if (!t) throw new Error(`topic-copy.mjs 裡沒有 ${spec}`);

/* 玻璃的三格。數字是量出來的，不是憑感覺挑的 —— 見下面 GLASS 裡的兩組實測。 */
const GLASS = {
  a: { name: "淡", tint: 0.58, ink: 0.12, mid: 5.01, hi: 3.32, dim: 21.1, keep: 24 },
  b: { name: "中", tint: 0.70, ink: 0.18, mid: 5.90, hi: 4.40, dim: 26.3, keep: 16 },
  c: { name: "濃", tint: 0.82, ink: 0.24, mid: 6.83, hi: 5.73, dim: 31.1, keep: 10 },
};
/* 地名的四格。loc/locpos 直接餵給 og-plate.mjs。 */
const LOC = {
  n: { name: "不放", loc: "none", pos: "right",
       note: "目前線上那一張就是這個。分享出去只有科別名與診所名。" },
  d: { name: "並排", loc: "city", pos: "right",
       note: "電腦版首頁的 .brand-text：同一條 baseline、中間一條 1px 細豎線、字級 73.6%。" },
  g: { name: "兩行", loc: "city", pos: "stack",
       note: "手機版首頁那一套。⚠ 只有四個字，兩行不等長，靠右切齊（硬 justify 會變成四個孤字）。" },
  h: { name: "兩行＋街名", loc: "full", pos: "stack",
       note: "手機版首頁那一套，而且兩行自然寬 181.8／191.4 幾乎相等 —— 這是唯一完整重現首頁的一格。" },
};

/* ---- 1. 乾淨的底圖（每次都從原檔重算，不要吃已經疊過牌子的檔）------------
   ⚠ og-plate.mjs 是讀寫同一個檔的，所以底圖一定要另外放一份，
     不然十二張會一張比一張多疊一層玻璃。 */
fs.mkdirSync(OUT, { recursive: true });
const src = path.join(ROOT, "drafts", `og-topic-${spec}-src.jpg`);
if (!fs.existsSync(src)) throw new Error(`找不到原檔 ${path.relative(ROOT, src)}`);
const node = process.execPath;
const run = (args) => execFileSync(node, args, { cwd: ROOT, encoding: "utf8" });

const baseKeep = path.join(ROOT, "assets", `og-topic-${spec}.jpg`);
const stash = fs.existsSync(baseKeep) ? fs.readFileSync(baseKeep) : null;
run([path.join(ROOT, "tools", "og-resize.mjs"), path.relative(ROOT, src), spec]);
const BASE = path.join(OUT, "base.jpg");
fs.copyFileSync(baseKeep, BASE);
if (stash) fs.writeFileSync(baseKeep, stash);   // 線上那一張原封不動放回去
console.log(`底圖 → ${path.relative(ROOT, BASE)}`);

/* ---- 2. 十二張真的產出檔 ------------------------------------------------ */
const combos = [];
for (const [lk, l] of Object.entries(LOC)) {
  for (const [gk, g] of Object.entries(GLASS)) {
    const rel = `preview/og-topic-card/card-${lk}${gk}.jpg`;
    run([path.join(ROOT, "tools", "og-plate.mjs"), spec, "--from", "preview/og-topic-card/base.jpg",
         "--tint", String(g.tint), "--ink", String(g.ink),
         "--loc", l.loc, "--locpos", l.pos, "--out", rel]);
    combos.push({ lk, gk, rel: `card-${lk}${gk}.jpg`,
                  kb: (fs.statSync(path.join(ROOT, rel)).size / 1024).toFixed(0) });
  }
}
console.log(`十二張 → ${(combos.reduce((a, c) => a + Number(c.kb), 0) / 1024).toFixed(2)}MB`);

/* ---- 3. 頁面 ------------------------------------------------------------- */
const seg = (row, keys, map, cur) => keys.map((k) =>
  `<button type="button" data-row="${row}" data-k="${k}"${k === cur ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${map[k].name}</button>`).join("");

/* ⚠ 卡片上的標題與描述**要從產出的那一頁讀回來**，不要照 topic-copy.mjs 自己拼 ——
   og:title 在 2026-08-22 拿掉了地名、og:description 是 lead 三句接起來的，
   自己拼會拼出一個訊息 app 上不會出現的東西，等於在假的東西上做決定。 */
const page = fs.readFileSync(path.join(ROOT, "topics", spec, "index.html"), "utf8");
const og = (p) => {
  const m = page.match(new RegExp(`<meta property="og:${p}" content="([^"]*)"`));
  if (!m) throw new Error(`topics/${spec}/index.html 裡找不到 og:${p} —— 先跑 node tools/topics.mjs`);
  return m[1];
};
const TITLE = og("title");
const DESC = og("description");

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>科別分享卡・玻璃濃度與地名排法｜提案</title>
<!--
  ============================================================================
  科別著陸頁的分享圖（og:image）—— 玻璃帶要多濃、地名要不要放、怎麼排
  ============================================================================
  起點：ILLUSTRATION.md 第十一節。分享卡在訊息 app 裡只有 250px，
  **標誌單獨出現認不出是誰**，所以識別必須燒進圖裡（拿掉 og:title 沒有用，
  LINE／FB／iMessage 一律會顯示標題，拿掉只會退回 <title> 或網址）。

  ── 為什麼是玻璃不是實心色牌 ──────────────────────────────────
  第一版做的是左下角一塊實心的科別色牌。使用者 2026-08-22 退回：
  「忽略了一個很重要的要素 —— 不搶戲、和諧，這也是診所品牌的核心概念之一。
    我建議把這段改成透明感的遮罩或是玻璃概念，壓在圖片的上緣。」
  改成頂部的玻璃帶，做法照站上頁首那條玻璃（PALETTE.md 第六之三節）：
  模糊 ＋ 低透明度的套色 ＋ 一條細邊。

  ── 玻璃要用哪一階色、要不要墊墨 ──────────────────────────────
  ⚠ **要用深階不是套色，而且底下要墊一層墨**，這是量出來的不是挑的。
  紙色字壓在玻璃上的對比度（站上門檻 4.5）：
      套色 .34            中位 3.12 ・最亮處 1.74   ✗ 白字幾乎看不見
      套色 .72 ＋墨 .16   中位 4.93 ・最亮處 3.78   ✗
      深階 .70 ＋墨 .18   中位 5.90 ・最亮處 4.40   ← 這一頁的「中」
  「最亮處」是天空從玻璃後面透上來的那一段，是最難讀的地方，要單獨量：
  只取兩段文字**中間**那塊沒有字的玻璃（x 48%~62%），
  否則會把紙色的字本身算進背景裡、底色量得太亮。

  ── 這一頁在問的第一件事：淡／中／濃 ──────────────────────────
  兩邊都量了，因為這一格是**兩個相反的要求在拔河**：
      玻璃  底色中位  最亮處  壓暗    照片還剩
      淡    5.01     3.32   21.1    24%
      中    5.90     4.40   26.3    16%
      濃    6.83     5.73   31.1    10%
  「照片還剩」＝ 玻璃帶那一塊的 L* 標準差 ÷ 底圖的，也就是照片的細節
  有沒有被壓平 —— 那就是「搶不搶戲」的量。
  ⚠ **淡那一格最亮處只有 3.32，過不了 4.5**；中是 4.40，也還差一點；
  只有濃是全過的。但濃只剩 10% 的照片，玻璃帶已經接近一條實心的板 ——
  這正是要使用者自己選的原因，不是我可以代選的。

  ── 這一頁在問的第二件事：地名 ────────────────────────────────
  使用者的兩個考量：① 對受眾有沒有辨識度、有沒有幫助 ②「台灣對醫療診所
  並沒有限制不能取同名，我如果寫了雲林斗六 永樂街，以後會不會有台中芳仁」。
  三件查得到的事實：
  ・**街名會過期** —— 診所 1983 年是在**中華路**開的，已經搬過一次，
    首頁窄帶自己就寫著「1983年 中華路開業」。
  ・**圖會單獨旅行** —— 卡片被轉存再轉發時只剩圖，圖上的字是唯一還在的識別。
  ・**真正被搜的詞是「牙醫診所 ＋ 斗六」**（index.html 自己的註解記著）。
  ⚠ 同一輪順手改掉的一件：訊息卡標題原本是「… — 芳仁牙醫診所（雲林斗六）」，
    使用者：「這個應該是在網站裡的，可以拿掉不要在這裡顯示嗎」。
    現在 og:title **不帶地名**，<title> 與 JSON-LD 的 name **留著地名**
    （機器讀的東西要完整），兩個標題刻意不一樣，見 tools/topics.mjs。

  ── 地名的排法為什麼是這四格 ──────────────────────────────────
  使用者看過前一版：「BC 的雲林斗六的位置我都不喜歡，感覺都很刻意不好看，
  首頁上的擺放看起來就不刻意、很講究。」去量首頁才發現原因：
  **首頁根本不是把地名疊在診所名底下**，而是同一條 baseline 並排、
  中間一條 1px 細豎線、字級 73.6%、透明度 .65。照抄之後就是這裡的「並排」。
  接著使用者要「像手機版首頁的排法」，那是另一套（兩行、沒有豎線、
  兩行都 text-align-last: justify 所以左右緣切齊、字級比值 0.774）。

  ⚠⚠ **手機版那一套第一版四項全錯**，而且錯的都是比例不是字級 ——
  使用者拿他手機的截圖對照才發現。在 390×844 上打開 index.html 量回來：
                        量到的   第一版   現在
      標誌寬 ÷ 主名字級  2.156    1.759   2.156
      間距 ÷ 主名        0.807    0.333   0.807
      主名字重           700      500     700
      主名字距           .01em    .06em   .01em
      行高               兩行 1.3 緊貼    1 ＋ 4.8px margin
  **標誌小了 18%、間距只有一半**才是「看起來不一樣」的主因。
  主名字距改回 .01em 還順帶讓 justify 回到首頁那個狀態：主名 181.8 比
  地名 191.4 窄，被撐開的是**主名**、每格 0.064em（首頁量到 0.076em）；
  寫 .06em 時兩行剛好等寬，justify 等於沒作用，「切齊」是巧合不是機制。

  ⚠ **兩行的排法只有帶街名才成立**：只寫「雲林斗六」四個字時，
  窄的那一行每格要被撐開 1.366em ＝ 首頁的十八倍，會變成
  「雲　林　斗　六」四個孤字。og-plate.mjs 因此加了一道量測，
  超過 0.15em 就不 justify、改成靠右切齊 —— 這一頁的「兩行」就是那一態。

  ── 兩件修不掉的，先寫在這裡 ──────────────────────────────────
  ・**字形本身不一樣。** 站上 font-family 第一順位是 Noto Sans TC，
    但全站**沒有載任何 webfont**，使用者的 iPhone 上實際渲染的是 PingFang。
    產圖用的是 Noto Sans TC（宣告的第一順位），筆畫本來就會有差；
    要完全一致得把 PingFang 打進圖裡，那是 Apple 的字型、不能散布。
  ・**地名的字重。** 站上算出來是 400，子集只做了 500／700 兩個字重。
    刻意不補：250px 的卡片上細一階更難讀，而這一輪的硬條件就是 250px。

  ── 這一頁的做法本身 ──────────────────────────────────────────
  ⚠⚠ 擺的是**十二張真的產出檔**，不是用 CSS 再做一次玻璃帶。
    ① 用 CSS 重寫一份，哪天 og-plate.mjs 改了這一頁就開始說謊；
    ② 真實的訊息卡是把 1200 的 JPEG 縮下來的**點陣圖**，
       用 CSS 縮放的向量文字會比實際清楚，等於在騙自己。
  ⚠ Worker 對 /preview/* 設 no-store，切換不能指望快取 ——
    先畫目前這一張，其餘十一張等 load 之後在背景預抓。

  完整的檔案：git show <commit>:preview/og-topic-card/index.html
  ============================================================================
-->
<style>
:root{
  /* 全部取自 index.html 的 :root，一個值都沒有另外挑 */
  --paper:#e2e5e6; --card:#f4f4f5; --rule:#cdd0d2; --note:#f9f9fa;
  --ink:#2a2c27; --ink-soft:#5c5f57;
  --accent:#3f654a; --accent-deep:#2c5238;
  --bar-h:106px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{background:var(--paper);color:var(--ink);
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei","Hiragino Sans TC",
    system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  line-height:1.7;letter-spacing:.01em;
  padding:22px 14px calc(var(--bar-h) + 22px)}
.pv-wrap{max-width:640px;margin:0 auto}
h1{font-size:1.18rem;line-height:1.45;letter-spacing:.02em;margin-bottom:.35em}
.pv-lede{font-size:.88rem;color:var(--ink-soft);margin-bottom:1.4em}
h2{font-size:.94rem;letter-spacing:.04em;margin:1.8em 0 .6em;
  padding-left:.6em;border-left:3px solid var(--accent)}
/* ---- 訊息卡（真實 250px）------------------------------------------------
   ⚠ 卡片寬度寫死 250px，不要跟著視窗縮 —— 這一頁存在的理由就是那個尺寸。 */
.pv-phone{background:#8fa9bd;border-radius:16px;padding:14px 12px;
  display:flex;gap:9px;align-items:flex-start}
.pv-av{width:30px;height:30px;border-radius:50%;background:#cfd8dc;flex:none}
.pv-card{width:250px;flex:none;background:#fff;border-radius:12px;overflow:hidden;
  box-shadow:0 1px 3px rgba(0,0,0,.18)}
.pv-thumb{width:250px;height:131px;overflow:hidden;background:#dfe3e5}
.pv-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.pv-meta{padding:8px 10px 9px}
.pv-t{font-size:13px;line-height:1.35;font-weight:700;color:#16191b;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pv-d{font-size:11.5px;line-height:1.4;color:#5d6467;margin-top:3px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pv-u{font-size:11px;color:#8a9093;margin-top:5px}
/* ---- 原尺寸 -------------------------------------------------------------- */
.pv-full{border-radius:10px;overflow:hidden;box-shadow:0 1px 5px rgba(20,24,20,.16);
  background:#dfe3e5;aspect-ratio:1200/628}
.pv-full img{width:100%;display:block}
/* ---- 量測面板 ------------------------------------------------------------ */
.pv-panel{background:var(--note);border:1px solid var(--rule);border-radius:10px;
  padding:14px 15px;font-size:.83rem;line-height:1.75}
.pv-panel dl{display:grid;grid-template-columns:max-content 1fr;gap:.15em .8em}
.pv-panel dt{color:var(--ink-soft);white-space:nowrap}
.pv-panel dd{font-variant-numeric:tabular-nums}
.pv-verdict{margin-top:.7em;padding-top:.7em;border-top:1px solid var(--rule)}
.pv-bad{color:#89202d;font-weight:700}
.pv-ok{color:var(--accent-deep);font-weight:700}
.pv-note{font-size:.8rem;color:var(--ink-soft);margin-top:.6em}
/* ---- 切換條 --------------------------------------------------------------
   ⚠ 這一頁要判斷的是 250px 的小圖，切換條不能吃掉半個畫面（第八節，
     hero-motion-mobile 那一輪踩過）：兩排分段按鈕 ＋ 一行提示，量到 106px。 */
.pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:9;
  background:rgba(244,244,245,.92);backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  border-top:1px solid var(--rule);padding:8px 12px calc(8px + env(safe-area-inset-bottom));
  box-shadow:0 -2px 12px rgba(20,24,20,.08)}
.pv-row{display:flex;align-items:center;gap:8px}
.pv-row + .pv-row{margin-top:6px}
.pv-lab{font-size:.74rem;color:var(--ink-soft);flex:none;width:3.6em;letter-spacing:.04em}
.pv-seg{display:flex;gap:5px;flex:1;min-width:0}
.pv-seg button{flex:1;min-width:0;min-height:34px;border:1px solid var(--rule);
  background:var(--card);color:var(--ink);border-radius:8px;
  font:inherit;font-size:.8rem;letter-spacing:.02em;cursor:pointer;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 .3em}
.pv-seg button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);
  color:var(--card);font-weight:500}
.pv-hint{font-size:.72rem;color:var(--ink-soft);margin-top:5px;line-height:1.5;
  overflow:hidden;text-overflow:ellipsis;display:-webkit-box;
  -webkit-line-clamp:2;-webkit-box-orient:vertical}
@media (max-width:400px){ .pv-lab{width:3em;font-size:.7rem} }
</style>
</head>
<body>
<div class="pv-wrap">
  <h1>科別分享卡：玻璃要多濃、地名要不要放</h1>
  <p class="pv-lede">底下兩排切換。上面那張是<b>真實 250px</b>（訊息 app 裡就是這麼大），
    下面那張是原尺寸。要判斷的是小的那一張。</p>

  <h2>訊息卡・真實 250px</h2>
  <div class="pv-phone">
    <span class="pv-av"></span>
    <div class="pv-card">
      <div class="pv-thumb"><img id="pv-img-s" src="card-nb.jpg" alt=""></div>
      <div class="pv-meta">
        <div class="pv-t">${TITLE}</div>
        <div class="pv-d">${DESC}</div>
        <div class="pv-u">fangren.net</div>
      </div>
    </div>
  </div>

  <h2>原尺寸 1200×628</h2>
  <div class="pv-full"><img id="pv-img-l" src="card-nb.jpg" alt=""></div>

  <h2>現場量測</h2>
  <div class="pv-panel">
    <dl>
      <dt>玻璃</dt><dd id="m-glass">—</dd>
      <dt>字壓在玻璃上・中位</dt><dd id="m-mid">—</dd>
      <dt>同上・最亮處</dt><dd id="m-hi">—</dd>
      <dt>玻璃帶把照片壓暗</dt><dd id="m-dim">—</dd>
      <dt>照片還剩多少細節</dt><dd id="m-keep">—</dd>
      <dt>檔案大小</dt><dd id="m-kb">—</dd>
    </dl>
    <div class="pv-verdict" id="m-verdict">—</div>
    <p class="pv-note" id="m-note">—</p>
  </div>
  <p class="pv-note">「最亮處」是天空從玻璃後面透上來那一段，是整條帶子最難讀的地方，
    所以單獨量。門檻 4.5 是站上一直在用的（PALETTE.md）。
    「照片還剩多少細節」＝ 玻璃帶那一塊的 L* 起伏 ÷ 底圖的，
    也就是「搶不搶戲」的量 —— 兩個數字是反向的，這一格要你自己權衡。</p>
</div>

<div class="pv-bar">
  <div class="pv-row"><span class="pv-lab">玻璃</span>
    <span class="pv-seg" id="seg-g">${seg("g", ["a", "b", "c"], GLASS, "b")}</span></div>
  <div class="pv-row"><span class="pv-lab">地名</span>
    <span class="pv-seg" id="seg-l">${seg("l", ["n", "d", "g", "h"], LOC, "n")}</span></div>
  <p class="pv-hint" id="pv-hint"></p>
</div>

<script>
/* ⚠ 網址參數的正規式要寫 [a-z0-9]+（CLAUDE.md 第八節）—— 寫 [a-z]+ 會吃不到
   帶數字的值，比對失敗後悄悄退回預設，等於參數沒作用。 */
var GLASS = ${JSON.stringify(GLASS)};
var LOC = ${JSON.stringify(LOC)};
var KB = ${JSON.stringify(Object.fromEntries(combos.map((c) => [c.lk + c.gk, c.kb])))};
var cur = { g: "b", l: "n" };

(function readUrl() {
  var q = location.search;
  var mg = q.match(/[?&]glass=([a-z0-9]+)/); if (mg && GLASS[mg[1]]) cur.g = mg[1];
  var ml = q.match(/[?&]loc=([a-z0-9]+)/);   if (ml && LOC[ml[1]])   cur.l = ml[1];
})();

var imgS = document.getElementById("pv-img-s");
var imgL = document.getElementById("pv-img-l");

function apply(push) {
  var f = "card-" + cur.l + cur.g + ".jpg";
  imgS.src = f; imgL.src = f;
  document.querySelectorAll("#seg-g button").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.k === cur.g)); });
  document.querySelectorAll("#seg-l button").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.dataset.k === cur.l)); });
  var g = GLASS[cur.g], l = LOC[cur.l];
  document.getElementById("m-glass").textContent =
    g.name + "（深階 " + g.tint.toFixed(2) + " ＋ 墨 " + g.ink.toFixed(2) + "）";
  document.getElementById("m-mid").textContent = g.mid.toFixed(2);
  document.getElementById("m-hi").textContent = g.hi.toFixed(2);
  document.getElementById("m-dim").textContent = "L* −" + g.dim.toFixed(1);
  document.getElementById("m-keep").textContent = g.keep + "%";
  document.getElementById("m-kb").textContent = KB[cur.l + cur.g] + " KB";
  /* 判斷直接寫出來，不要只印數字（第八節，tag-fade 那一輪學到的）。 */
  var v = document.getElementById("m-verdict");
  if (g.hi >= 4.5) v.innerHTML = '<span class="pv-ok">最亮處 ' + g.hi.toFixed(2) +
    ' ≥ 4.5，整條帶子都讀得到</span>　照片只剩 ' + g.keep + '%，玻璃已經接近實心的板';
  else v.innerHTML = '<span class="pv-bad">最亮處 ' + g.hi.toFixed(2) +
    ' 過不了 4.5</span>　天空透上來那一段的字會比較吃力；換來的是照片留住 ' + g.keep + '%';
  document.getElementById("m-note").textContent = l.note;
  document.getElementById("pv-hint").textContent = g.name + "・" + l.name + "　" + l.note;
  var u = "?glass=" + cur.g + "&loc=" + cur.l;
  if (push) history.replaceState(null, "", u);
}

document.querySelector(".pv-bar").addEventListener("click", function (e) {
  var b = e.target.closest("button[data-row]"); if (!b) return;
  cur[b.dataset.row] = b.dataset.k; apply(true);
});
apply(false);

/* 其餘十一張在背景預抓（/preview/* 是 no-store，不預抓的話每次切換都要等下載）。 */
addEventListener("load", function () {
  setTimeout(function () {
    Object.keys(LOC).forEach(function (l) { Object.keys(GLASS).forEach(function (g) {
      if (l + g === cur.l + cur.g) return;
      var i = new Image(); i.src = "card-" + l + g + ".jpg";
    }); });
  }, 400);
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`✓ preview/og-topic-card/index.html`);
console.log(`  本機：http://localhost:8791/preview/og-topic-card/`);
console.log(`  線上：https://fangren.net/preview/og-topic-card/`);
