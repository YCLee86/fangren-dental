#!/usr/bin/env node
/* 提案頁產生器：文章頁頂端那一行（首頁 › 科別 › 日期 › 瀏覽數 › 夜間開關）
   —— 開關現在會掉到第二列，這一頁在比「怎麼把那一行壓回一列」。

   起因（2026-09-15，使用者的手機截圖）：
     「首頁那一行還有空間可以壓縮給 白天/夜間模式切換滑桿嗎」

   量出來：390 寬可用 362px、排成一列要 387px，差 25px；一行的最小螢幕寬是
   416px，所以 430 以外每一支手機都會掉第二列。CLAUDE.md 定案表那句
   「320 寬才會掉」是錯的，定案時要一起訂正。
   而且日期是最長的一段：10 月起兩位數的月份進來，要 412px、連 430 都會掉。

   ⚠ 這一頁是 posts/kids-crown/ 的完整複本，所以第八節那幾個坑要一起處理：
     ・SEO 區塊整段換成 noindex（不然等於對外宣告一個不存在的頁面）
     ・data-views-self 降級成 data-views（只有 -self 會 POST +1）——
       不是剝掉 counter.js：這一頁要判斷的就是那一列排不排得下，
       瀏覽數印一條破折號的話量出來的寬度是假的（同 chip-carry 那一輪）
     ・同層連結 ../<slug>/ 一律改成絕對路徑，不然會指到 preview/ 底下
     ・切換條要插在最後一個 body 結束標籤前面（用 lastIndexOf，
       這一站的註解裡就寫著那幾個字）
     ・樣式放 head，不要塞頁尾（關著的東西會在開頁那 180ms 閃出來）

   跑法：node tools/crumbs-preview.mjs
   ⚠ 快照會過期：main 被推過就要重跑一次。
*/
import fs from "node:fs";
import path from "node:path";

const SRC = "posts/kids-crown/index.html";
const OUT = "preview/crumbs-line/index.html";

let h = fs.readFileSync(SRC, "utf8");
const must = (cond, msg) => { if (!cond) { console.error("✗ " + msg); process.exit(1); } };

/* 1. SEO 區塊 → noindex */
const seoStart = h.indexOf("<!-- SEO:START");
const seoEnd = h.indexOf("<!-- SEO:END -->");
must(seoStart > 0 && seoEnd > seoStart, "找不到 SEO 區塊");
h = h.slice(0, seoStart) +
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' +
  h.slice(seoEnd + "<!-- SEO:END -->".length);
must(!h.includes("application/ld+json"), "JSON-LD 沒有剝乾淨");

/* 2. canonical 也要拿掉（它指向正式站那一篇） */
const before = h;
h = h.replace(/<link rel="canonical"[^>]*>\n?/, "");
must(h !== before, "canonical 沒有剝掉");

/* 3. 同層連結 → 絕對路徑 */
h = h.replace(/href="\.\.\/([a-z0-9-]+)\//g, 'href="/posts/$1/');
must(!/href="\.\.\/[a-z]/.test(h), "還有同層相對連結");

/* 4. 計數器降級：只有 -self 會加一 */
must(h.includes('data-views-self='), "找不到 data-views-self");
h = h.replace(/data-views-self=/g, "data-views=");

/* 5. 「 次瀏覽」那個純文字節點要包起來，CSS 才關得掉（Ⓓ 用） */
const vBefore = h;
h = h.replace(/(<span class="views-n">—<\/span>)\s*次瀏覽/, '$1<span class="pv-vt"> 次瀏覽</span>');
must(h !== vBefore, "包不到「次瀏覽」那個文字節點");

/* 6. 日期換成六個 span：三種長度 × 兩種寫法 */
const DATES = [
  ["s", "2026 年 9 月 7 日", "2026/09/07", "9/7 最短"],
  ["m", "2026 年 8 月 27 日", "2026/08/27", "8/27 現在最長"],
  ["l", "2026 年 12 月 11 日", "2026/12/11", "12/11 十月起"],
];
const dtSpans = DATES.map(([k, z, n]) =>
  `<span class="z ${k}">${z}</span><span class="n ${k}">${n}</span>`).join("");
const dBefore = h;
h = h.replace(/<time datetime="2026-09-07">[^<]*<\/time>/,
  `<time class="pv-dt" datetime="2026-09-07">${dtSpans}</time>`);
must(h !== dBefore, "換不到那個 time");

/* 7. 樣式 —— 放 head。class 一律 pv- 前綴（.foot 那次撞名已經踩過） */
const CSS = `
<style>
/* ── 提案用，定案時整段刪掉 ─────────────────────────────
   Ⓐ 現況／Ⓑ 日期換寫法／Ⓒ Ⓑ＋溝收一階／Ⓓ Ⓒ＋瀏覽數收成圖示／
   Ⓔ 不壓縮、開關釘在右上角讓文字自己折
   顏色一個都沒有新增，全部吃站上既有的 token。 */

/* 日期：六個 span 只露一個 */
.pv-dt > span { display: none; }
html[data-pv-f="z"][data-pv-d="s"] .pv-dt > .z.s,
html[data-pv-f="z"][data-pv-d="m"] .pv-dt > .z.m,
html[data-pv-f="z"][data-pv-d="l"] .pv-dt > .z.l,
html[data-pv-f="n"][data-pv-d="s"] .pv-dt > .n.s,
html[data-pv-f="n"][data-pv-d="m"] .pv-dt > .n.m,
html[data-pv-f="n"][data-pv-d="l"] .pv-dt > .n.l { display: inline; }

/* Ⓒ Ⓓ：那幾道溝從 .7rem 收到 .5rem（只有這一列，別處沒有動） */
html[data-pv="c"] .crumbs, html[data-pv="d"] .crumbs { column-gap: .5rem; }

/* Ⓓ：瀏覽數收成「眼睛圖示 ＋ 數字」。站上那顆 svg 本來是 display:none */
html[data-pv="d"] .crumbs .pv-vt { display: none; }
html[data-pv="d"] .crumbs .views svg {
  display: inline-block; width: 1.15em; height: 1.15em; align-self: center;
}

/* Ⓔ：開關釘在右上角。::before 是一根零寬 30px 高的柱子，
   把第一列撐到和開關一樣高，開關 top:0 就自然對齊；
   負的右外距是為了抵消它自己多佔的那一道溝。 */
html[data-pv="e"] .crumbs { position: relative; padding-right: 61px; }
html[data-pv="e"] .crumbs::before {
  content: ""; width: 0; height: 30px; margin-right: -.7rem;
}
html[data-pv="e"] .crumbs .theme-toggle {
  position: absolute; right: 0; top: 0; margin-left: 0;
}

/* ── 切換條 ───────────────────────────────── */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: var(--card); border-top: 1px solid var(--rule);
  padding: .5rem clamp(.75rem, 3vw, 1.5rem) calc(.5rem + env(safe-area-inset-bottom, 0px));
  font-size: .8rem; color: var(--ink);
  box-shadow: 0 -6px 18px rgba(0, 0, 0, .10);
}
.pv-row { display: flex; align-items: center; gap: .26rem; flex-wrap: wrap; margin-bottom: .28rem; }
.pv-row > b { font-weight: 600; color: var(--ink-soft); font-size: .76rem; margin-right: .1rem; }
.pv-row button {
  appearance: none; font: inherit; font-size: .76rem; cursor: pointer;
  padding: .28rem .5rem; border-radius: 8px;
  border: 1px solid var(--rule); background: transparent; color: var(--ink-soft);
}
.pv-row button[aria-pressed="true"] {
  background: var(--accent); border-color: var(--accent); color: var(--on-fill);
}
.pv-panel {
  margin: .3rem 0 0; font-size: .71rem; line-height: 1.5; color: var(--ink-soft);
  border-top: 1px dashed var(--rule); padding-top: .35rem;
}
.pv-panel b { color: var(--ink); font-weight: 600; }
.pv-ok { color: #2c5238; font-weight: 600; }
html[data-theme="dark"] .pv-ok { color: #729b7d; }
.pv-no { color: #89202d; font-weight: 600; }
html[data-theme="dark"] .pv-no { color: #e06f72; }
.pv-min {
  position: absolute; right: .5rem; top: -1.9rem;
  appearance: none; font: inherit; font-size: .72rem; cursor: pointer;
  padding: .2rem .5rem; border-radius: 8px;
  border: 1px solid var(--rule); background: var(--card); color: var(--ink-soft);
}
html.pv-fold .pv-row, html.pv-fold .pv-panel { display: none; }
html.pv-fold .pv-bar { padding-block: .25rem; height: .5rem; }
body { padding-bottom: 11rem; }
html.pv-fold body { padding-bottom: 2rem; }
</style>
`;
must(!CSS.includes("</st" + "yle>\n<style"), "樣式重複");
h = h.replace("</head>", CSS + "</head>");

/* 8. 切換條 —— 一定要插在最後一個 body 結束標籤前面 */
const CASES = [
  ["a", "Ⓐ 現況"],
  ["b", "Ⓑ 日期"],
  ["c", "Ⓒ ＋溝"],
  ["d", "Ⓓ ＋圖示"],
  ["e", "Ⓔ 釘右上"],
];
const BAR = `
<div class="pv-bar" id="pv-bar">
  <button class="pv-min" id="pv-min" type="button">收起</button>
  <div class="pv-row" id="pv-c"><b>案</b>${
    CASES.map(([k, t]) => `<button type="button" data-c="${k}">${t}</button>`).join("")
  }</div>
  <div class="pv-row" id="pv-d"><b>日期</b>${
    DATES.map(([k, , , t]) => `<button type="button" data-d="${k}">${t}</button>`).join("")
  }</div>
  <p class="pv-panel" id="pv-panel">量測中…</p>
</div>
<script>
(function () {
  var r = document.documentElement;
  var q = new URLSearchParams(location.search);
  var pick = function (name, re, dflt) {
    var v = q.get(name);
    return v && re.test(v) ? v : dflt;
  };
  var c = pick("c", /^[a-z0-9]+$/, "a");
  var d = pick("d", /^[a-z0-9]+$/, "s");

  function apply() {
    r.dataset.pv = c;
    r.dataset.pvD = d;
    r.dataset.pvF = (c === "a" || c === "e") ? "z" : "n";
    [].forEach.call(document.querySelectorAll("#pv-c button"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.c === c));
    });
    [].forEach.call(document.querySelectorAll("#pv-d button"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.d === d));
    });
    var u = location.pathname + "?c=" + c + "&d=" + d;
    history.replaceState(null, "", u);
    measure();
  }

  document.getElementById("pv-c").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; c = b.dataset.c; apply();
  });
  document.getElementById("pv-d").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; d = b.dataset.d; apply();
  });
  document.getElementById("pv-min").addEventListener("click", function () {
    r.classList.toggle("pv-fold");
    this.textContent = r.classList.contains("pv-fold") ? "打開" : "收起";
  });

  function need() {
    var el = document.querySelector(".crumbs");
    var cl = el.cloneNode(true);
    cl.style.cssText = "position:fixed;left:-9999px;top:0;width:2000px;flex-wrap:nowrap;visibility:hidden";
    document.body.appendChild(cl);
    var cs = getComputedStyle(cl);
    var gap = parseFloat(cs.columnGap) || 0;
    var padR = parseFloat(cs.paddingRight) || 0;
    var flow = [], abs = 0;
    [].forEach.call(cl.children, function (k) {
      var ks = getComputedStyle(k);
      if (ks.display === "none") return;
      if (ks.position === "absolute") { abs += k.getBoundingClientRect().width; return; }
      flow.push(k.getBoundingClientRect().width);
    });
    var sum = flow.reduce(function (a, b) { return a + b; }, 0);
    var n = sum + gap * Math.max(0, flow.length - 1) + (abs ? padR : 0);
    document.body.removeChild(cl);
    return n;
  }

  function measure() {
    var el = document.querySelector(".crumbs");
    var kids = [].filter.call(el.children, function (k) {
      var ks = getComputedStyle(k);
      return ks.display !== "none" && ks.position !== "absolute";
    });
    var mids = kids.map(function (k) {
      var b = k.getBoundingClientRect(); return b.top + b.height / 2;
    }).sort(function (a, b) { return a - b; });
    var lines = mids.reduce(function (acc, t) {
      if (!acc.length || t - acc[acc.length - 1] > 8) acc.push(t);
      return acc;
    }, []).length;

    var tg = el.querySelector(".theme-toggle").getBoundingClientRect();
    var first = el.querySelector("a").getBoundingClientRect();
    var onFirst = Math.abs((tg.top + tg.height / 2) - (first.top + first.height / 2)) < 10;

    var avail = el.clientWidth;
    var nd = need();
    var short = nd - avail;
    var chrome = window.innerWidth - avail;
    var minW = Math.ceil(nd + chrome);

    var vn = el.querySelector(".views-n");
    var digits = (vn.textContent || "").replace(/[^0-9]/g, "").length;
    var de = document.documentElement;
    var over = Math.max(0, de.scrollWidth - de.clientWidth);

    var y = function (s) { return '<span class="pv-ok">' + s + "</span>"; };
    var n2 = function (s) { return '<span class="pv-no">' + s + "</span>"; };
    var t = [];
    t.push("現在 <b>" + lines + " 列</b>，開關 " +
      (onFirst ? y("在第一列 ✓") : n2("掉到第二列 ✗")) +
      (r.dataset.pv === "e" ? "（釘住的，每個寬度都在第一列，折的是文字）" : ""));
    t.push("排一列要 <b>" + nd.toFixed(1) + "</b>，可用 <b>" + avail.toFixed(1) + "</b> → " +
      (short > 0 ? n2("差 " + short.toFixed(1) + "px") : y("餘 " + (-short).toFixed(1) + "px")));
    t.push("一行的最小螢幕寬 <b>" + minW + "px</b>；你這支 " + window.innerWidth +
      "px " + (window.innerWidth >= minW ? y("夠") : n2("不夠")));
    t.push("瀏覽數 " + digits + " 位數" +
      (digits >= 4 ? "（最壞的一種）" : "，四位數再多約 " + ((4 - digits) * 7).toFixed(0) + "px") +
      "・水平溢出 " + (over ? n2(over + "px") : y("0")));
    document.getElementById("pv-panel").innerHTML = t.join("<br>");
  }

  apply();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  document.addEventListener("fangren:views", measure);
})();
</sc` + `ript>
`;
const bodyEnd = h.lastIndexOf("</body>");
must(bodyEnd > 0, "找不到 body 結束標籤");
h = h.slice(0, bodyEnd) + BAR + h.slice(bodyEnd);

/* 9. 守門 */
must(h.includes('content="noindex, nofollow, noarchive"'), "少了 noindex");
must(!h.includes("data-views-self"), "還有 data-views-self");
must(h.includes("assets/counter.js"), "counter.js 不見了");
must((h.match(/<div class="pv-bar"/g) || []).length === 1, "切換條不只一條");
must(h.indexOf('<div class="pv-bar"') > h.lastIndexOf("</head>"), "切換條落在 head 裡");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, h);
console.log("✓ " + OUT + "（" + (h.length / 1024).toFixed(1) + " KB）");
