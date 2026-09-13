#!/usr/bin/env node
// 廠商對接的那一頁 → preview/line-vendor/index.html
//
// ⚠⚠ 這一頁「不放任何一則訊息的文字」—— 七則的字各有出處（六份 Flex JSON ＋
//    auto-reply.txt）且各自有守門，抄進來就是第八個真相。這裡只放：現在有哪幾則
//    在跑、廠商改了什麼、對方回覆涵蓋到哪裡、還沒有答案的是什麼。
//
// ⚠ 資料的唯一出處是 vendor-log.json，這一支只做排版。改內容改 JSON 再重跑。
// ⚠ 零 JS（守門連 script 標籤都擋）。
//
// ⚠⚠ 2026-09-11 使用者：「文字太多了　精簡一點　也要附圖對照文字看　不要有
//    太情緒或是指控誰說謊　只要基於事實　客觀的敘述就好」。三件因此改掉：
//    ① 每一則旁邊擺它自己那一頁拍的縮圖（node drafts/channels/vendor-shots.mjs）
//    ② 九顆浮水印**內嵌成 SVG**（幾何從 brand/shapes/ 讀、寬度從 wm-sizes.json 讀，
//       不抄第二份；內嵌所以不必多幾個圖檔，也不會有 JS）
//    ③ 「真／假」那一組判語整組拿掉，改成「這句話說明的是什麼／還沒回答的是什麼」
//
// 跑完驗：node drafts/channels/check-vendor.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-vendor");

const D = JSON.parse(readFileSync(join(HERE, "vendor-log.json"), "utf8"));

const esc = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* **…** 加粗。⚠ 警示色那一條 2026-09-11 拿掉了 —— 這一頁現在只敘述事實，
   不靠顏色喊。 */
const b = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

/* ── 科別的中文名：從 index.html 的標記那一排讀回來，不另外維護一份 ───── */
const SPEC_NAME = (() => {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");
  const m = {};
  /* ⚠ 一定要連 href 一起比對 —— 只寫 data-spec 的話，樣式表那一段的 CSS 註解
     （「它和 [data-spec="kids"] 權重相同…」）會先命中，名字就變成註解裡的一段話，
     **而且不報錯**（2026-09-11 踩過，畫出來是「裡的時間，和這顆」）。 */
  for (const x of html.matchAll(
    /<a href="\/topics\/([a-z]+)\/"\s+data-spec="\1"\s*>([^<]{2,20})<\/a>/g))
    m[x[1]] = x[2].trim();
  if (Object.keys(m).length !== 7) throw new Error(`index.html 讀到 ${Object.keys(m).length} 科，應該是七科`);
  return m;
})();

/* ── 九顆浮水印：形狀讀 brand/shapes/，寬度與顏色讀 wm-sizes.json ───────── */
/* ⚠ 濃度不可以在這裡寫死：唯一的出處是 booked-card.json 引用的檔名（wm-<形狀>-12.png），
   那批 PNG 的 alpha 就是烘在檔案裡的（booked-mark.mjs 的 ALPHAS）。換成 -08 這裡要跟著淡。 */
const WM_A = (() => {
  const j = readFileSync(join(ROOT, "drafts", "channels", "booked-card.json"), "utf8");
  const hit = [...j.matchAll(/wm-[^"]*-(\d{2})\.png/g)].map((m) => m[1]);
  const uniq = [...new Set(hit)];
  if (uniq.length !== 1) throw new Error(`booked-card.json 的浮水印濃度不只一種：${uniq}`);
  return Number(uniq[0]) / 100;
})();

const WM = (() => {
  const sizes = JSON.parse(
    readFileSync(join(ROOT, "preview", "line-booked", "wm-sizes.json"), "utf8"));
  const names = Object.keys(sizes).sort();
  if (names.length !== 9) throw new Error(`wm-sizes.json 應該是九顆，讀到 ${names.length}`);
  const widest = Math.max(...names.map((n) => sizes[n].w));
  return names.map((n) => {
    const f = join(ROOT, "brand", "shapes", `shape-${n}.svg`);
    if (!existsSync(f)) throw new Error(`找不到 ${f}`);
    const svg = readFileSync(f, "utf8");
    /* ⚠ brand/shapes/*.svg ＝ 一條路徑 ＋ 一個帶 scale(1 -1) 的外層 transform。
       只抄 <path d> 會畫出一張全透明、而且不報錯的圖（booked-mark.mjs 檔頭）。 */
    const d = (svg.match(/\sd="([^"]+)"/) || [])[1];
    const gt = (svg.match(/<g\s+transform="([^"]+)"/) || [])[1];
    const vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
    if (!d || !gt || vb.length !== 2) throw new Error(`shape-${n}.svg 讀不出 path／transform／viewBox`);
    const s = sizes[n];
    const 科 = SPEC_NAME[s.spec];
    if (!科) throw new Error(`${n} 的科別 ${s.spec} 在 index.html 上找不到名字`);
    /* ⚠⚠ 九顆的寬度不一樣是刻意的（按墨的面積正規化，看起來才一樣重）——
       所以這裡給的是**相對寬度的百分比**，縮到任何螢幕上比例都不變。 */
    return { n, d, gt, vw: vb[0], vh: vb[1], pct: (s.w / widest * 100).toFixed(1),
             色: s.color, 科, w: s.w, ratio: s.ratio };
  });
})();

/* ⚠⚠ 九顆的相對高度從 0.28 到 0.50 都有（寬度是按墨的面積正規化的，不是等高）——
   直接排下去，同一列的虛線會落在不同高度（第九節第 28 條 ① 那一種「同一欄不同列對不齊」）。
   所以每一格的框固定成「最高的那一顆」的長寬比、形狀垂直置中。 */
const WM_BOX = (1 / Math.max(...WM.map((s) => s.pct / 100 / s.ratio))).toFixed(4);

const CSS = `
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:760px;margin:0 auto;padding:26px 14px 72px}
h1{font-size:1.3rem;line-height:1.5;margin:0 0 .3em}
.lede{color:var(--soft);font-size:.92rem;margin:0 0 1.5em}
.h2{font-size:1.04rem;margin:2.4em 0 .6em;padding-top:1em;border-top:1px solid var(--rule)}
.h2 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.25em}
.now{background:var(--card);border-radius:11px;padding:13px 15px;margin:0;font-size:.93rem}
.now ol{margin:.3em 0 0;padding-left:1.2em}
.now li{margin:.5em 0}
.note{font-size:.88rem;color:var(--soft);background:var(--card);border-radius:9px;
  padding:.7em .85em;margin:.9em 0 0}

/* ── 一則一格：左邊是那一則自己的縮圖 ─────────────────────────── */
.mg{font-size:.93rem;font-weight:600;margin:1.15em 0 .15em}
.mg:first-of-type{margin-top:.5em}
.mg .n{font-weight:400;font-size:.79rem;color:var(--soft);margin-left:.5em}
.msgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));
  gap:9px;margin:.2em 0 0}
.msg{display:flex;gap:10px;background:var(--card);border-radius:10px;padding:9px 10px}
.msg .ims{display:flex;flex-direction:column;gap:4px;flex:0 0 64px}
.msg img{width:64px;height:64px;border-radius:6px;object-fit:cover;
  background:var(--paper)}
.msg .ph{width:64px;height:64px;flex:0 0 64px;border-radius:6px;background:var(--paper)}
.msg .x{min-width:0}
.msg .nm{font-size:.9rem;font-weight:600;line-height:1.45}
.msg .mt{font-size:.79rem;color:var(--soft);line-height:1.55;margin-top:.15em}

/* ── 改版：左邊規格圖、右邊逐項 ───────────────────────────────── */
.fig{margin:.9em 0 0}
.fig img{display:block;max-width:100%;height:auto;border-radius:8px;background:var(--card)}
.fig figcaption{font-size:.8rem;color:var(--soft);margin-top:.4em}
.scroll{overflow-x:auto}
.scroll img{max-width:none}
.two{display:grid;gap:14px;margin:.9em 0 0}
@media(min-width:620px){.two{grid-template-columns:268px 1fr;align-items:start}}
ul.tick{list-style:none;margin:.2em 0 0;padding:0;font-size:.92rem}
ul.tick li{padding:.28em 0 .28em 1.15em;position:relative}
ul.tick li::before{content:"・";position:absolute;left:0;color:var(--soft)}
.rows{margin:.2em 0 0}
.row{border-top:1px solid var(--rule);padding:.8em 0}
.row .k{font-weight:600;font-size:.93rem}
.row .v{font-size:.9rem;margin-top:.25em}
.row .v i{font-style:normal;color:var(--soft);margin-right:.35em}

/* ── 廠商送來的畫面 ────────────────────────────────────────── */
.vs{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:14px 12px;margin:.5em 0 0}
.vs figure{margin:0}
.vs img{display:block;width:100%;height:auto;border-radius:8px;background:var(--card)}
.vs .t{font-size:.88rem;font-weight:600;margin:.45em 0 0}
.vs figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.15em}

/* ── 九宮格 ────────────────────────────────────────────────── */
.nine{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 10px;
  margin:.9em 0 0;background:var(--card);border-radius:11px;padding:15px 14px}
.nine figure{margin:0;text-align:center}
.nine svg{display:block;margin:0 auto;height:auto}
.nine .sw{display:flex;align-items:center;justify-content:center;
  aspect-ratio:${WM_BOX} / 1}
.nine .wm{margin-top:8px;border-top:1px dashed var(--rule)}
.nine figcaption{font-size:.72rem;color:var(--soft);line-height:1.5;margin-top:.45em}

/* ── 大小與位置的對照 ──────────────────────────────────────── */
.cmpwrap{margin:1.2em 0 0}
.cmpt{font-size:.9rem;font-weight:600;margin:0 0 .35em}
.cmprow{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));gap:14px 10px}
.cmp{margin:0}
.cmp svg{display:block;width:100%;max-width:268px;height:auto}
.cmp figcaption{font-size:.76rem;color:var(--soft);line-height:1.6;margin-top:.2em;max-width:268px}

/* ── 綁定完成的兩個方向 ────────────────────────────────────── */
.dir{background:var(--card);border-radius:11px;padding:13px 15px;margin:.9em 0 0}
.dir .t{font-size:.95rem;font-weight:600;margin:0 0 .45em}
.dir p{font-size:.89rem;margin:.5em 0 0}
.dir i{font-style:normal;color:var(--soft);margin-right:.4em}

/* ── 待答 ──────────────────────────────────────────────────── */
.grp{margin:1.6em 0 0}
.grp .t{font-size:.93rem;font-weight:600;margin:0 0 .1em}
.grp .c{font-size:.79rem;color:var(--soft);margin:0}
ul.ask{list-style:none;margin:.35em 0 0;padding:0}
ul.ask li{padding:.55em 0;border-bottom:1px solid var(--rule);font-size:.91rem}
ul.ask .y{display:block;color:var(--soft);font-size:.85rem;margin-top:.2em}
ul.ask .s{display:inline-block;width:1.35em;color:var(--soft)}
details{margin:.3em 0 0}
summary{font-size:.87rem;color:var(--soft);cursor:pointer;padding:.5em 0;
  border-bottom:1px solid var(--rule)}
summary::marker{color:var(--rule)}
/* ── 約診狀態那四個值的顏色：兩套色票各畫一次 ─────────────────
   卡片畫成輪播上真正的寬度（207px ＝ 268 × .772），
   欄位要吃得下手機的寬度，所以是 auto-fit 不是寫死兩欄。 */
.pal{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));
  gap:16px;margin:1em 0 0}
.pal .h{font-size:.93rem;font-weight:600;margin:0 0 .1em}
.pal .src{font-size:.79rem;color:var(--soft);line-height:1.65;margin:0 0 .55em}
.stcard{background:var(--card);border:1px solid var(--rule);border-radius:9px;
  padding:9px 11px}
.stcard .r{display:flex;gap:9px;align-items:baseline;font-size:13px;
  line-height:1.95;margin:0}
.stcard .lb{color:var(--soft);flex:0 0 auto}
.stcard .vv{font-weight:700}
.stlist{list-style:none;margin:.6em 0 0;padding:0;
  font-size:.79rem;color:var(--soft);line-height:1.75}
.stlist b{font-weight:600;color:var(--ink)}
.pal .h .pick{font-weight:400;font-size:.79rem;color:var(--soft);margin-left:.4em}
/* 藥丸：底是那一科的套色、字是白的，形狀照站上那一族（圓角 8.5px）。
   行高與上下內距要和 preview/line-booked/ 定案那一份**逐字相同** ——
   塊要包住「字面框」不是「行框」（同 /history/spec-tag-fit.html 那一輪），
   寫回 line-height:1.6 ＋ 上下對稱的話，這一頁會畫出一顆低 1.40px 的藥丸，
   和定案那一頁對不起來，而且畫面看起來完全正常。 */
.stcard .pill{display:inline-block;border-radius:8.5px;line-height:1;
  padding:.42em .63em .38em;color:#fff;font-weight:700}
.foot{margin:2.8em 0 0;padding-top:1.1em;border-top:1px solid var(--rule);
  font-size:.83rem;color:var(--soft);line-height:1.85}
a{color:#214d48}
code{font-size:.92em}
`.trim();

/* ── ① 現在會自動送出哪幾則 ────────────────────────────────── */
/* ⚠ `圖` 可以是一個字串，也可以是一組（2026-09-12：⑤ 要同時看得到公版藍色卡
   與我們新做的那一張）。兩張時**直向疊**，不要並排 —— 那一欄只有 64px 寬，
   並排會把右邊的字擠到剩 80 幾 px（格子最窄只有 232px）。 */
/* ⚠⚠ 2026-09-12 使用者：「12 則照順序看有點混亂　先區分成　已完成　待調整
   （或是有落差）」—— 所以這一節分兩組排，**但 ①~⑫ 那組編號一個都不換**：
   廠商兩封回信都照那組編號在講，那是雙方共用的詞。組別由資料自己宣告
   （每一列的 `組`），不要從「狀態」那串字去猜。 */
const GROUPS = [
  { k: "done", 標: "已完成" },
  { k: "open", 標: "待調整（或是有落差）" },
];
{
  const bad = D.訊息.列.filter((r) => !GROUPS.some((g) => g.k === r.組));
  if (bad.length)
    throw new Error("這幾列沒有宣告組別（done／open）：" + bad.map((r) => r.n).join("、"));
}
let seen = 0;
const msgs = GROUPS.map((g) => {
  const rows = D.訊息.列.filter((r) => r.組 === g.k);
  const cards = rows.map((r) => {
    const ims = [].concat(r.圖 || []).filter(Boolean);
    const lazy = seen++ > 3;
    return `<div class="msg">${
    ims.length
      ? `<span class="ims">${ims.map((x, k) => `<img src="t-${esc(x)}.jpg" width="210" height="210" ${
          lazy ? 'loading="lazy" ' : ""}alt="${esc(r.名)}的模擬圖${ims.length > 1 ? `（${k + 1}）` : ""}">`).join("")}</span>`
      : `<span class="ph"></span>`
  }<div class="x">
<p class="nm">${esc(r.n)}　${esc(r.名)}</p>
<p class="mt">${esc(r.時機)}／${esc(r.誰送)}送・${esc(r.狀態)}<br>${b(r.註)}</p>
</div></div>`;
  }).join("\n");
  return `<p class="mg">${esc(g.標)}<span class="n">${rows.length} 則</span></p>
<div class="msgs">
${cards}
</div>`;
}).join("\n");

/* ── ② 09-10 改版 ─────────────────────────────────────────── */
const 改 = D.改版;
const revised = `
<div class="two">
<figure class="fig">
<img src="../line-booked/shot-booked.png" width="804" height="450" loading="lazy"
  alt="我們送過去的預約成功通知規格圖">
<figcaption>我們送過去的規格圖（預約成功通知）</figcaption>
</figure>
<div>
<p style="font-size:.93rem;margin:0"><b>對上的六件</b></p>
<ul class="tick">${改.對上.map((t) => `<li>${b(t)}</li>`).join("")}</ul>
</div>
</div>

<p style="font-size:.93rem;margin:1.4em 0 0"><b>廠商送來的畫面</b></p>
<p style="font-size:.88rem;color:var(--soft);margin:.25em 0 0">${b(改.圖說)}</p>
<div class="vs">
${改.圖.map((g) => `<figure>
<a href="${esc(g.檔)}"><img src="${esc(g.檔)}" width="${g.w}" height="${g.h}" loading="lazy"
  alt="${esc(g.標)}"></a>
<p class="t">${esc(g.標)}</p>
<figcaption>${b(g.說)}</figcaption>
</figure>`).join("\n")}
</div>

<div class="rows" style="margin-top:1.4em">
<p style="font-size:.93rem;margin:0 0 .2em"><b>還沒對上的四件</b></p>
${改.未對上.map((x) => `<div class="row"><p class="k">${b(x.事)}</p><p class="v">${b(x.說明)}</p></div>`).join("\n")}
</div>

<figure class="fig">
<div class="scroll"><img src="../line-booked/shot-query.png" width="2565" height="366"
  style="width:855px" loading="lazy" alt="我們送過去的約診紀錄查詢規格圖（輪播）"></div>
<figcaption>我們送過去的規格圖（約診紀錄查詢，輪播．這一條可以左右滑）。日期會被截斷的是這一種
micro 卡，不是單張的 mega 卡。</figcaption>
</figure>`.trim();

/* ── ③ 浮水印九顆 ─────────────────────────────────────────── */
/* ⚠⚠ 兩張是同一份幾何、同一個相對寬度，差的只有濃度：
   上面是原色（看得出形狀與是哪一科），下面是它在卡片上真正的樣子。
   ⚠ 九宮格的底本來就是 --card ＝ 卡片色，所以下面那一張不必再墊一層底。 */
const swatch = (s, a) =>
  `<svg viewBox="0 0 ${s.vw} ${s.vh}" width="${s.vw}" height="${s.vh}" style="width:${s.pct}%"
  role="img" aria-label="${a === 1 ? "原色" : "浮水印濃度"} ${esc(s.科)} ${s.n}"><g transform="${s.gt}"><path
  fill="${s.色}"${a === 1 ? "" : ` fill-opacity="${a}"`} fill-rule="evenodd" d="${s.d}"/></g></svg>`;

const nine = `<div class="nine">
${WM.map((s) => `<figure>
<span class="sw">${swatch(s, 1)}</span>
<span class="sw wm">${swatch(s, WM_A)}</span>
<figcaption>${esc(s.科)}<br>${esc(s.n)}・${s.w}px</figcaption>
</figure>`).join("\n")}
</div>`;

/* ── ③之二 大小與位置的對照 ───────────────────────────────────
   同一張卡畫三次（我們的 JSON／我們的模擬圖／廠商送來的），形狀與顏色完全一樣，
   差的只有大小與位置。⚠ 形狀仍然是從 brand/shapes/ 讀回來的那一份，不抄第二份。 */
const byName = Object.fromEntries(WM.map((s2) => [s2.n, s2]));
const cmp = D.浮水印.對照;
const cardBox = cmp.卡;
const plate = (shape, g) => {
  const s2 = byName[shape];
  if (!s2) throw new Error(`對照表用到不存在的形狀 ${shape}`);
  const h = g.size / s2.ratio;
  const x = cardBox.w - g.size + g.right;
  const y = cardBox.h - h + g.bottom;
  const id = `clip-${shape}-${g.標.length}-${g.size}-${g.right}`;
  /* 卡片自己會把跑出去的那一塊切掉 —— 所以一定要 clipPath，不然畫出來
     和廠商實際看到的不一樣（那正是這一節在比的東西） */
  /* 卡片右下留一塊空白，跑出卡片的那一截才畫得下（三格用同一個框，才比得出來） */
  const PR = 26, PB = 18, PL = 6, PT = 6;
  return `<figure class="cmp">
<svg viewBox="${-PL} ${-PT} ${cardBox.w + PL + PR} ${cardBox.h + PT + PB}"
  width="${cardBox.w + PL + PR}" height="${cardBox.h + PT + PB}"
  role="img" aria-label="${esc(g.標)}：浮水印 ${g.size}px，往右 ${g.right}、往下 ${g.bottom}">
<defs><clipPath id="${id}"><rect x="0" y="0" width="${cardBox.w}" height="${cardBox.h}" rx="9"/></clipPath></defs>
<rect x="0" y="0" width="${cardBox.w}" height="${cardBox.h}" rx="9" fill="#f4f4f5"/>
<g clip-path="url(#${id})" opacity="0.12">
<svg x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${g.size}" height="${h.toFixed(2)}"
  viewBox="0 0 ${s2.vw} ${s2.vh}" preserveAspectRatio="none"><g transform="${s2.gt}"><path
  fill="${s2.色}" fill-rule="evenodd" d="${s2.d}"/></g></svg>
</g>
<rect x=".5" y=".5" width="${cardBox.w - 1}" height="${cardBox.h - 1}" rx="9"
  fill="none" stroke="#c9ccc9"/>
<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${g.size}" height="${h.toFixed(2)}"
  fill="none" stroke="${s2.色}" stroke-width="1" stroke-dasharray="3 2" opacity=".55"/>
</svg>
<figcaption><b>${esc(g.標)}</b>　${g.size}px<br>${b(g.註)}</figcaption>
</figure>`;
};
const compare = cmp.組.map((row) => `<div class="cmpwrap">
<p class="cmpt">${esc(row.名)}</p>
<div class="cmprow">${row.格.map((g) => plate(row.形, g)).join("\n")}</div>
</div>`).join("\n");

/* ── ④ 約診狀態那四個值的顏色 ─────────────────────────────────
   2026-09-12 使用者：現況那張卡上表示會到的那個值本來就是綠字，所以新版那四個
   值也要套色、加粗，並且用兩套色票各做一次給他看。
   對比度**在這裡現算**，不寫進資料 —— 寫死的話哪天換一顆顏色，數字不會跟著動。 */
const _lin = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const _lum = (h) => { const n = parseInt(h.slice(1), 16);
  return .2126 * _lin(n >> 16 & 255) + .7152 * _lin(n >> 8 & 255) + .0722 * _lin(n & 255); };
const _cr = (a, z) => { const x = _lum(a), y = _lum(z);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
/* 對比度無條件捨去到小數第二位 —— 四捨五入會把 4.4995 印成
   「4.50（低於 4.5）」，那一行讀起來自相矛盾。捨去只會低報一點點，
   不會在門檻那一格印出一個不成立的數字。 */
const SC = D.狀態色;
const pals = SC.組.map((g) => `<div>
<p class="h">${esc(g.標)}${g.挑定 ? `<span class="pick">挑定</span>` : ""}</p>
<p class="src">${b(g.源)}<br>${b(g.註)}</p>
<div class="stcard" style="max-width:${SC.卡.w}px">
${g.值.map((v) => `<p class="r"><span class="lb">約診狀態</span><span class="vv" style="color:${v.色}">${esc(v.名)}</span></p>`).join("\n")}
</div>
<ul class="stlist">
${g.值.map((v) => { const n = Math.floor(_cr(v.色, "#f4f4f5") * 100) / 100;
  return `<li><b>${esc(v.名)}</b>　${esc(v.科)}　${v.色.toUpperCase()}　對比 ${n.toFixed(2)}${
    n < 4.5 ? "（低於 4.5）" : ""}</li>`; }).join("\n")}
</ul>
</div>`).join("\n");

/* ── ④之〇 定案（2026-09-12 一格一格挑完的）────────────────────
   放在整節最前面：底下那幾格是走到這裡的過程，這一段才是要拿給廠商的那一份。
   ⚠ 這個註解在樣板字串外面 —— 寫在裡面會被原字印進 HTML（第 ⑨ 道守門擋得到）。 */
const SET = SC.定案, PILLVAL = SC.藥丸.值;
const settled = `<div class="stcard" style="max-width:${SC.卡.w}px">
${PILLVAL.map((v) => `<p class="r"><span class="lb">約診狀態</span><span class="pill"
  style="background:${v.色}">${esc(v.名)}</span></p>`).join("\n")}
</div>
<div class="rows" style="margin-top:1.2em">
${SET.條.map(([k, t]) => `<div class="row"><p class="k">${esc(k)}</p><p class="v">${b(t)}</p></div>`).join("\n")}
<div class="row"><p class="k">先問的是哪一題</p><p class="v">${b(SET.前提)}</p></div>
<div class="row"><p class="k">還要一支測試訊息</p><p class="v">${b(SET.要一支測試訊息)}</p></div>
</div>`;

/* ── ④之二 做成藥丸（底套色、白字）─────────────────────────────
   使用者問的那一題。⚠ 對比度一樣現算，只是這一次量的是「白字壓在填色上」。 */
const PILL = SC.藥丸;
const pill = `<div class="stcard" style="max-width:${SC.卡.w}px">
${PILL.值.map((v) => `<p class="r"><span class="lb">約診狀態</span><span class="pill"
  style="background:${v.色}">${esc(v.名)}</span></p>`).join("\n")}
</div>
<ul class="stlist">
${PILL.值.map((v) => { const n = Math.floor(_cr("#ffffff", v.色) * 100) / 100;
  return `<li><b>${esc(v.名)}</b>　${esc(v.科)}　${v.色.toUpperCase()}　白字 ${n.toFixed(2)}${
    n < 4.5 ? "（低於 4.5）" : ""}</li>`; }).join("\n")}
</ul>`;

/* ── ⑤ 往返 ───────────────────────────────────────────────── */
const rounds = D.往返.map((r) => `<div class="row">
<p class="k">${esc(r.日)}　${esc(r.誰)}</p>
<p class="v"><i>他說</i>${b(r.他說)}</p>
<p class="v"><i>我們</i>${b(r.我們)}</p>
${r.註 ? `<p class="v">${b(r.註)}</p>` : ""}
</div>`).join("\n");

/* ── ⑥ 回覆涵蓋到哪裡 ─────────────────────────────────────── */
const replies = D.回覆.列.map((r) => `<div class="row">
<p class="k">${esc(r.句)}</p>
<p class="v"><i>說明的是</i>${b(r.成立)}</p>
<p class="v"><i>還沒回答</i>${b(r.未答)}</p>
</div>`).join("\n");

/* ── ⑥ 綁定完成的兩個方向 ─────────────────────────────────────
   使用者 2026-09-11 指定整理的一節。圖是廠商自己的回覆（他指定要附），
   ⚠ 別家診所的畫面仍然不進 repo、不上頁面 —— 那是另一件事。 */
const bind = (() => {
  const B = D.綁定;
  const dir = (x) => `<div class="dir">
<p class="t">${esc(x.標)}</p>
<p><i>要的是</i>${b(x.要的)}</p>
<p><i>對方說</i>${b(x.對方)}</p>
<p><i>現在知道的</i>${b(x.現在知道的)}</p>
<p><i>還沒有答案的</i>${b(x.還沒有答案的)}</p>
<p><i>別家的畫面</i>${b(x.別家)}</p>
</div>`;
  /* 2026-09-12：先擺「我們自己現在長什麼樣」—— 兩個方向都是為了這一張畫面。
     ⚠ 門號在出圖時就遮掉了（repo 是公開的），不是靠 CSS 蓋。 */
  const now = B.現況 ? `<div class="two">
<figure class="fig">
<a href="${esc(B.現況.圖.檔)}"><img src="${esc(B.現況.圖.檔)}" width="${B.現況.圖.w}" height="${B.現況.圖.h}"
  alt="綁定完成那一刻，病人那一側看到的畫面"></a>
<figcaption>${b(B.現況.圖.說)}</figcaption>
</figure>
<div class="dir">
<p class="t">${esc(B.現況.標)}</p>
<p><i>看到</i>${b(B.現況.看到)}</p>
<p><i>說明的是</i>${b(B.現況.說明的是)}</p>
<p><i>還沒說明的</i>${b(B.現況.還沒說明的)}</p>
<p><i>順帶</i>${b(B.現況.順帶)}</p>
</div>
</div>

<h3 style="font-size:.95rem;margin:1.8em 0 .2em">廠商的回覆，與兩個處理方向</h3>` : "";
  return `${now}<div class="two">
<figure class="fig">
<a href="${esc(B.圖.檔)}"><img src="${esc(B.圖.檔)}" width="${B.圖.w}" height="${B.圖.h}"
  loading="lazy" alt="廠商 2026-09-10 的回覆"></a>
<figcaption>${b(B.圖.說)}</figcaption>
</figure>
<div>
${B.方向.map(dir).join("\n")}
</div>
</div>

<h3 style="font-size:.95rem;margin:1.8em 0 .2em">別家帳號的三種現象</h3>
<p style="font-size:.88rem;color:var(--soft);margin:0">${esc(B.現象._說明)}</p>
<div class="rows">
${B.現象.列.map((r) => `<div class="row">
<p class="k">${esc(r.型)}<span style="font-weight:400;color:var(--soft);font-size:.82rem">　${esc(r.家)}</span></p>
<p class="v"><i>看到</i>${b(r.看到)}</p>
<p class="v"><i>說明的是</i>${b(r.說明的是)}</p>
<p class="v"><i>還沒說明的</i>${b(r.還沒說明的)}</p>
</div>`).join("\n")}
</div>
<p class="note">${b(B.一起解)}</p>`;
})();

/* ── ⑦ 別家帳號 ───────────────────────────────────────────────
   兩張最用得上的寫完整，其餘五張各收成一行 —— 附給廠商時本來就是一次只附
   對應那一句的那一張，五張攤開等於在頁面上重複一件不會一起送出去的事。 */
const refs = D.參考.主.map((r) => `<div class="row">
<p class="k">${esc(r.家)}<span style="font-weight:400;color:var(--soft);font-size:.82rem">　${esc(r.用)}</span></p>
<p class="v"><i>看到</i>${b(r.看到)}</p>
<p class="v"><i>說明的是</i>${b(r.說)}</p>
</div>`).join("\n") + `
<div class="row"><p class="k">另外五個帳號</p>
<ul class="tick">${D.參考.背景.map((r) => `<li><b>${esc(r.家)}</b>　${b(r.說)}</li>`).join("")}</ul>
</div>`;

/* ── ⑧ 待答 ───────────────────────────────────────────────── */
const groupKeys = ["廠商", "後台", "診所", "素材"];
const item = (x) => `<li><span class="s">${x.急 ? "★" : "・"}</span>${b(x.問)}${
  x.為 ? `<span class="y">${b(x.為)}</span>` : ""}</li>`;
/* ★ 的永遠攤開，其餘收進 <details> —— 整頁一眼看得完，清單一項都沒有少。
   ⚠ 用 details 不用 JS（守門連 script 標籤都擋）。 */
const groups = groupKeys.map((k) => {
  const g = D.待答[k];
  const hot = g.列.filter((x) => x.急);
  const rest = g.列.filter((x) => !x.急);
  return `<div class="grp">
<p class="t">${esc(g.標)}</p>
<p class="c">${g.列.length} 題${hot.length ? "・其中 " + hot.length + " 題最先要" : ""}</p>
${hot.length ? `<ul class="ask">\n${hot.map(item).join("\n")}\n</ul>` : ""}
${rest.length ? `<details><summary>其餘 ${rest.length} 題</summary>
<ul class="ask">
${rest.map(item).join("\n")}
</ul></details>` : ""}
</div>`;
}).join("\n");

const total = groupKeys.reduce((n, k) => n + D.待答[k].列.length, 0);
const hotAll = groupKeys.reduce((n, k) => n + D.待答[k].列.filter((x) => x.急).length, 0);

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 廠商對接　現況與待答</title>
<style>
${CSS}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 廠商對接　現況與待答</h1>
<p class="lede">更新於 ${esc(D.更新日)}　這一頁不放任何一則訊息的文字，只放四件事：<br>
現在有哪幾則在跑、廠商改了什麼、對方的回覆涵蓋到哪裡、還沒有答案的是什麼。</p>

<div class="now">
<b>現在停在哪</b>
<ol>
${D.現在.map((t) => `<li>${b(t)}</li>`).join("\n")}
</ol>
</div>

<h2 class="h2">① 這個帳號會自動送出哪幾則<span class="t">${D.訊息.列.length} 則．圖是那一則自己的規格頁拍的</span></h2>
${msgs}
<p class="note">${b(D.訊息.缺口)}</p>

<h2 class="h2">② 廠商 ${esc(改.日)} 的改版<span class="t">${esc(改._說明)}</span></h2>
${revised}

<h2 class="h2">③ 浮水印那九顆<span class="t">形狀取自 brand/shapes／寬度與顏色取自 wm-sizes.json</span></h2>
<p class="note">每一格<b>上面是原色</b>（看得出形狀與是哪一科），
<b>虛線底下是它壓在卡片上真正的濃度</b>（${(WM_A * 100).toFixed(0)}%，就是那批 PNG 烘進去的 alpha）。
兩張是同一份幾何、同一個相對寬度 —— <b>九顆的寬度不一樣是刻意的</b>（按墨的面積正規化，看起來才一樣重）。</p>
${nine}
<div class="rows">
<div class="row"><p class="k">現況</p><p class="v">${b(D.浮水印.現況)}</p></div>
<div class="row"><p class="k">大小與位置</p><p class="v">${b(D.浮水印.大小與位置)}</p></div>
</div>

<h3 style="font-size:.95rem;margin:1.8em 0 .2em">同一張卡畫三次</h3>
<p style="font-size:.88rem;color:var(--soft);margin:0">${esc(cmp._說明)}</p>
${compare}
<p class="note">${b(cmp.量)}</p>

<div class="rows" style="margin-top:1.4em">
<div class="row"><p class="k">是不是平台的限制</p><p class="v">${b(D.浮水印.是不是平台的限制)}</p></div>
<div class="row"><p class="k">接下來問什麼</p><p class="v">${b(D.浮水印.接下來問什麼)}</p></div>
<div class="row"><p class="k">順帶</p><p class="v">${b(D.浮水印.順帶)}</p></div>
<div class="row"><p class="k">還要確認的</p><p class="v">${b(D.浮水印.要確認)}</p></div>
</div>
<p class="note">${b(D.浮水印._說明)}</p>

<h2 class="h2">④ 約診狀態那一列<span class="t">2026-09-12 定案・卡片畫成輪播上真正的 ${SC.卡.w}px 寬</span></h2>
<p class="note">${b(SET._說明)}</p>
${settled}

<h3 style="font-size:.95rem;margin:2em 0 .2em">走到這裡的過程：那四個值的顏色</h3>
<p class="note" style="margin-top:.4em">${b(SC.起點)}</p>
<p style="font-size:.88rem;color:var(--soft);margin:1em 0 0">${b(SC._說明)}</p>
${pals}
<div class="rows" style="margin-top:1.5em">
<div class="row"><p class="k">挑定</p><p class="v">${b(SC.挑定)}</p></div>
<div class="row"><p class="k">對比</p><p class="v">${b(SC.量)}</p></div>
<div class="row"><p class="k">橘那一顆</p><p class="v">${b(SC.橘)}</p></div>
<div class="row"><p class="k">要不要加粗</p><p class="v">${b(SC.加粗)}</p></div>
<div class="row"><p class="k">要注意的</p><p class="v">${b(SC.注意)}</p></div>
</div>

<h3 style="font-size:.95rem;margin:1.8em 0 .2em">做成藥丸：底套色、白字</h3>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(PILL._說明)}</p>
${pill}
<div class="rows" style="margin-top:1.4em">
<div class="row"><p class="k">為什麼反而變好</p><p class="v">${b(PILL.為什麼變好)}</p></div>
<div class="row"><p class="k">Flex 做得到嗎</p><p class="v">${b(PILL.做得到嗎)}</p></div>
<div class="row"><p class="k">對比</p><p class="v">${b(PILL.量)}</p></div>
<div class="row"><p class="k">兒童牙科那一顆</p><p class="v">${b(PILL.兒牙那一顆)}</p></div>
<div class="row"><p class="k">換到什麼・付出什麼</p><p class="v">${b(PILL.代價)}</p></div>
<div class="row"><p class="k">套回我們的設計</p><p class="v">${b(SC.套回設計)}</p></div>
<div class="row"><p class="k">沒有動的</p><p class="v">${b(PILL.沒有動的)}</p></div>
</div>

<h2 class="h2">⑤ 和廠商的四封往返</h2>
<div class="rows">
${rounds}
</div>

<h2 class="h2">⑥ 對方的回覆涵蓋到哪裡<span class="t">「做不到」一律先改寫成「誰做不到」再往下談</span></h2>
<div class="rows">
${replies}
</div>

<h2 class="h2">⑦ 綁定完成：兩個方向<span class="t">先是我們自己那一刻的畫面，再是廠商 ${esc(D.往返[2].日)} 的回覆</span></h2>
${bind}

<h2 class="h2">⑧ 別家帳號的畫面<span class="t">${esc(D.參考._說明.replace(/^[^。]*。/, "").trim())}</span></h2>
<div class="rows">
${refs}
</div>
<p class="note">${b(D.參考.用法)}</p>

<h2 class="h2">⑨ 還沒有答案的 ${total} 題<span class="t">照「誰能答」分開・★ 是最先要的 ${hotAll} 題</span></h2>
${groups}

<p class="foot">
這一頁由 <code>node drafts/channels/build-vendor.mjs</code> 產生，資料在
<code>drafts/channels/vendor-log.json</code>，縮圖由
<code>node drafts/channels/vendor-shots.mjs</code> 從各則規格頁的產出檔縮出來。<br>
七則訊息的文字、圖檔與規格在另一頁：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);
console.log(`✓ preview/line-vendor/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  在跑的訊息 ${D.訊息.列.length} 則・改版對上 ${改.對上.length}／還沒對上 ${改.未對上.length}`);
console.log(`  逐句 ${D.回覆.列.length} 句・別家 ${D.參考.主.length + D.參考.背景.length} 家・浮水印 ${WM.length} 顆`);
console.log(`  待答 ${total} 題（廠商 ${D.待答.廠商.列.length}／後台 ${D.待答.後台.列.length}／診所 ${D.待答.診所.列.length}／素材 ${D.待答.素材.列.length}）・最先要 ${hotAll} 題`);
