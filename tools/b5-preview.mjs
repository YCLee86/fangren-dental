/* B5 提案頁的產生器 —— 「文章上要不要印出最後更新日期」。
   來源是 posts/gum-bleeding/index.html 的快照，產出 preview/b5-updated/index.html。

   ⚠ 快照，不要手改那一頁 —— 改完重跑這一支。
   ⚠ main 若被另一台推了東西，也要重跑（快照會過期）。

   三個候選（頂端那一行 Ⓐ 已經量掉了：連 430px 都塞不下，所以不列）：
     Ⓑ 併進文末免責那一句
     Ⓒ 免責上面獨立一行（在 main 裡面）
     Ⓓ「延伸閱讀」上面獨立一行（在 main 外面）
     Ⓔ 貼著 HERO 圖的下緣（照 .post-hero figcaption 的規格：.55rem／.78rem／ink-soft）
     Ⓕ 內文開頭、導言上面

   ⚠ 首頁與延伸閱讀的卡片**不加**，那兩處照 CLAUDE.md 第一節第 3 條顯示 published。
      文章頁因此會同時看得到兩個日期：頂端那一行是上架日，這一行是最後更新日 ——
      那正是 Google 對文章日期的要求（兩個都給、而且要和結構化資料對得上）。

   日期不會造成雜湊迴圈：tools/build.mjs 的 normalize() 已經有一條
   把 time.post-updated 的內容換成佔位符的規則，所以印在 main 裡面也安全。

   照 CLAUDE.md 第八節，文章頁的複本要處理四件事：
     1. SEO 區塊整段換成 noindex（原本指向還在線上的正式網址）
     2. data-views-self 降成 data-views（只有 -self 會 POST +1）
     3. 同層的兄弟連結 ../<slug>/ 會指到 preview/ 底下，改成絕對路徑
     4. 切換條插在最後一個 </body> 前面（用 lastIndexOf，註解裡也有那幾個字） */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "posts", "gum-bleeding", "index.html");
const OUT_DIR = path.join(ROOT, "preview", "b5-updated");

const UPDATED = "2026-09-20";
const UPDATED_TW = "2026/09/20";

let html = fs.readFileSync(SRC, "utf8");

/* ---------- 1. SEO 區塊 → noindex ---------- */
const iS = html.indexOf("<!-- SEO:START");
const iE = html.indexOf("<!-- SEO:END -->");
if (iS < 0 || iE < 0) throw new Error("找不到 SEO 區塊");
html = html.slice(0, iS) +
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' +
  html.slice(iE + "<!-- SEO:END -->".length);

/* canonical 是手寫在 SEO 區塊外面的（第 20 行），要另外拿掉 ——
   留著等於對外宣告這一頁就是正式站那一篇 */
html = html.replace(/^.*<link rel="canonical"[^>]*>\n/m, "");

/* ---------- 2. 計數器降級 ---------- */
if (!html.includes("data-views-self")) throw new Error("找不到 data-views-self");
html = html.replace(/data-views-self=/g, "data-views=");

/* ---------- 3. 兄弟連結改絕對路徑 ---------- */
html = html.replace(/href="\.\.\/([a-z0-9-]+)\/"/g, 'href="/posts/$1/"');

/* ---------- 4. 三個候選塞進去（預設都藏著） ---------- */
const LINE = (k) =>
  `<p class="pv-updline pv-${k}">最後更新：` +
  `<time class="post-updated" datetime="${UPDATED}">${UPDATED_TW}</time></p>`;

// Ⓑ：免責那一句的句首
const noteAt = html.indexOf('<p class="note">');
if (noteAt < 0) throw new Error("找不到免責那一段");
html = html.slice(0, noteAt + '<p class="note">'.length) +
  `<span class="pv-b">本文最後更新於 ` +
  `<time class="post-updated" datetime="${UPDATED}">${UPDATED_TW}</time>。</span>` +
  html.slice(noteAt + '<p class="note">'.length);

// Ⓒ：免責上面（還在 main 裡）
const noteAt2 = html.indexOf('<p class="note">');
html = html.slice(0, noteAt2) + LINE("c") + "\n    " + html.slice(noteAt2);

// Ⓔ：貼著 HERO 圖的下緣（在 figure 後面，不是塞進 figure 當 figcaption ——
//     日期不是圖說，借的只是它的視覺規格）
const figEnd = html.indexOf("</figure>");
if (figEnd < 0) throw new Error("找不到 HERO 那張圖");
html = html.slice(0, figEnd + "</figure>".length) + "\n      " +
  LINE("e").replace('class="pv-updline pv-e"', 'class="pv-updline pv-e pv-figline"') +
  html.slice(figEnd + "</figure>".length);

// Ⓕ：內文開頭（導言上面）
const bodyAt = html.indexOf('<div class="post-body wrap-text">');
if (bodyAt < 0) throw new Error("找不到內文那一塊");
const bodyEnd = bodyAt + '<div class="post-body wrap-text">'.length;
html = html.slice(0, bodyEnd) + "\n    " + LINE("f") + html.slice(bodyEnd);

// Ⓓ：延伸閱讀上面（在 main 外）
const relAt = html.indexOf('<aside class="related"');
if (relAt < 0) throw new Error("找不到延伸閱讀那一塊");
html = html.slice(0, relAt) +
  LINE("d").replace('class="pv-updline pv-d"', 'class="pv-updline pv-d wrap-text"') +
  "\n" + html.slice(relAt);

/* ---------- 5. 樣式（一定要放進 head，不然開頁那一瞬間會整條閃出來） ---------- */
const STYLE = `
<style id="pv-style">
/* 候選的那一行本身：對齊免責聲明的字級與次要色 */
.pv-updline { font-size: .84rem; color: var(--ink-soft); margin: 0 auto .8rem; }
.pv-updline.wrap-text { margin: 0 auto 1.6rem; }
/* 三個候選預設都藏著，由 html 上的 data-upd 決定顯示哪一個 */
.pv-b { display: none; }
.pv-updline { display: none; }
[data-upd="b"] .pv-b { display: inline; }
[data-upd="c"] .pv-c { display: block; }
[data-upd="d"] .pv-d { display: block; }
[data-upd="e"] .pv-e { display: block; }
[data-upd="f"] .pv-f { display: block; }
/* Ⓔ 借 .post-hero figcaption 的規格：同樣的上距、字級與次要色，
   寬度也跟著 HERO 圖（--content ＋ --pad），所以左緣會對齊圖的左緣 */
.pv-figline {
  max-width: var(--content); padding-inline: var(--pad);
  margin: .55rem auto 0; font-size: .78rem;
}

/* 切換條 —— class 一律 pv- 前綴，站上短名字幾乎一定會撞（.foot 就是頁尾） */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: var(--card); border-top: 1px solid var(--rule);
  box-shadow: 0 -2px 14px rgba(0,0,0,.14);
  padding: .55rem var(--pad) calc(.55rem + env(safe-area-inset-bottom));
  font-size: .82rem; color: var(--ink);
}
.pv-row { display: flex; gap: .4rem; flex-wrap: wrap; }
.pv-btn {
  flex: 1 1 0; min-width: 4.6rem;
  font: inherit; line-height: 1.3; padding: .42rem .3rem;
  border: 1px solid var(--rule); border-radius: .5rem;
  background: transparent; color: var(--ink); cursor: pointer;
}
/* 選中那一格用 ink/paper 反白 —— 夜間模式的 accent-deep 是亮青，白字壓不住 */
.pv-btn[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
/* 上一輪那三格收起來 —— 六顆按鈕全攤開的話，切換條在 320 上吃掉 22.6%，
   而這一頁要判斷的正是「那一行貼在圖下面好不好看」。收起來之後是 15% 上下。 */
.pv-sub {
  display: block; margin: .45rem 0 0; padding: .15rem 0;
  font: inherit; font-size: .72rem; color: var(--ink-soft);
  background: none; border: 0; cursor: pointer; text-align: left;
}
.pv-fold { display: none; margin-top: .3rem; }
[data-more="1"] .pv-fold { display: flex; }
.pv-panel { margin-top: .5rem; font-size: .76rem; color: var(--ink-soft); line-height: 1.5; }
.pv-panel b { color: var(--ink); font-weight: 600; }
/* 頁尾要墊高，不然切換條會蓋住最後一行 */
body { padding-bottom: 13rem; }
</style>`;
html = html.replace("</head>", STYLE + "\n</head>");

/* ---------- 6. 切換條 ＋ 量測面板 ---------- */
const BAR = `
<div class="pv-bar" role="group" aria-label="候選切換">
  <div class="pv-row">
    <button class="pv-btn" type="button" data-u="off">現況</button>
    <button class="pv-btn" type="button" data-u="e">Ⓔ 貼著圖下緣</button>
    <button class="pv-btn" type="button" data-u="f">Ⓕ 內文開頭</button>
  </div>
  <button class="pv-sub" type="button" id="pv-more" aria-expanded="false">＋ 上一輪那三格（擺在文末）</button>
  <div class="pv-row pv-fold">
    <button class="pv-btn" type="button" data-u="b">Ⓑ 併進免責</button>
    <button class="pv-btn" type="button" data-u="c">Ⓒ 免責上面</button>
    <button class="pv-btn" type="button" data-u="d">Ⓓ 延伸閱讀</button>
  </div>
  <p class="pv-panel" id="pv-panel">量測中…</p>
</div>
<script>
(function () {
  var root = document.documentElement;
  var panel = document.getElementById("pv-panel");
  var btns = [].slice.call(document.querySelectorAll(".pv-btn"));
  var base = null;

  // 文件高要扣掉切換條自己墊出來的那一塊，量到的才是「版面真的長多少」
  function docH() {
    var pad = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    return Math.round(document.body.scrollHeight - pad);
  }
  // 頂端那一行折了幾列 —— 照「左緣有沒有往回跳」數。
  // ⚠ 不可以用「top 不一樣就算一列」：那一行是 flex，各元素高度不同、
  //    對齊之後 top 本來就不一樣，會全部誤判成已經折行。
  function crumbRows() {
    var c = document.querySelector(".crumbs");
    if (!c) return 0;
    var ks = [].slice.call(c.children)
      .filter(function (e) { return getComputedStyle(e).display !== "none"; })
      .map(function (e) { return e.getBoundingClientRect(); });
    var rows = ks.length ? 1 : 0;
    for (var i = 1; i < ks.length; i++) if (ks[i].left < ks[i - 1].left - 0.5) rows++;
    return rows;
  }
  function measure() {
    var u = root.getAttribute("data-upd") || "off";
    if (u === "off") base = docH();
    var h = docH();
    var d = base == null ? 0 : h - base;
    var el = u === "off" ? null : document.querySelector(".pv-" + u);
    var eh = el ? Math.round(el.getBoundingClientRect().height) : 0;
    var over = document.documentElement.scrollWidth > window.innerWidth + 1;
    var parts = [];
    parts.push("文件高 <b>" + h + "px</b>");
    parts.push(u === "off" ? "（基準）" : "比現況 <b>" + (d >= 0 ? "+" : "") + d + "px</b>");
    if (u !== "off") parts.push("那一行本身 <b>" + eh + "px</b>");
    parts.push("頂端那一行 <b>" + crumbRows() + " 列</b>");
    parts.push(over ? "<b>⚠ 破框</b>" : "無水平捲動");
    panel.innerHTML = parts.join("　");
  }
  function apply(u, push) {
    root.setAttribute("data-upd", u);
    if ("bcd".indexOf(u) >= 0 && root.getAttribute("data-more") !== "1") {
      root.setAttribute("data-more", "1");
      var mb = document.getElementById("pv-more");
      mb.setAttribute("aria-expanded", "true");
      mb.textContent = "− 上一輪那三格（擺在文末）";
    }
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.u === u)); });
    if (push) {
      var q = new URLSearchParams(location.search);
      q.set("u", u);
      history.replaceState(null, "", location.pathname + "?" + q + location.hash);
    }
    // 圖與字型還沒定位好的話量到的高度是假的，下一格再量一次
    measure();
    requestAnimationFrame(measure);
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.u, true); });
  });
  var more = document.getElementById("pv-more");
  more.addEventListener("click", function () {
    var on = root.getAttribute("data-more") === "1";
    root.setAttribute("data-more", on ? "0" : "1");
    more.setAttribute("aria-expanded", String(!on));
    more.textContent = (on ? "＋" : "−") + " 上一輪那三格（擺在文末）";
  });
  // 網址參數的正規式要寫 [a-z0-9]+，寫 [a-z]+ 會吃不到 glass1 這種值
  var m = /[?&]u=([a-z0-9]+)/.exec(location.search);
  var init = m && ["off", "b", "c", "d", "e", "f"].indexOf(m[1]) >= 0 ? m[1] : "off";
  // 先量一次現況當基準，再切到使用者選的那一格
  apply("off", false);
  window.addEventListener("load", function () {
    base = docH();
    apply(init, false);
  });
  window.addEventListener("resize", measure);
})();
</script>
`;
/* ⚠ 這一站的註解裡就寫著那幾個字，String.replace 會換到註解裡那一個 —— 用 lastIndexOf */
const iB = html.lastIndexOf("</body>");
if (iB < 0) throw new Error("找不到 body 結尾");
html = html.slice(0, iB) + BAR + html.slice(iB);

/* ---------- 7. 守門 ---------- */
const guards = [
  ["還留著 data-views-self（會灌計數）", /data-views-self/.test(html)],
  ["還留著指向正式網址的 canonical", /rel="canonical"/.test(html)],
  ["沒有 noindex", !/noindex/.test(html)],
  ["切換條掉到 head 裡了", html.indexOf('class="pv-bar"') < html.indexOf("</head>")],
  ["五個候選沒有都塞進去", !"bcdef".split("").every((k) => html.includes("pv-" + k))],
  ["切換條的按鈕和候選對不起來",
    [...html.matchAll(/data-u="([a-z]+)"/g)].map((m) => m[1]).sort().join() !== "b,c,d,e,f,off"],
  ["兄弟連結還指向 preview 底下", /href="\.\.\/[a-z0-9-]+\/"/.test(html)],
];
const bad = guards.filter((g) => g[1]).map((g) => g[0]);
if (bad.length) throw new Error("守門沒過：\n  - " + bad.join("\n  - "));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "index.html"), html);
console.log("✓ preview/b5-updated/index.html　" + (html.length / 1024).toFixed(0) + " KB");
