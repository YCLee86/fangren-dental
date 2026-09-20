/* 產生 preview/kids-arch-expansion/index.html —— 〈擴張牙弓〉補厚之後的預覽。
   ⚠ 這一頁是 posts/kids-arch-expansion/index.html 的**快照，不要手改**，
     改完內文重跑這一支。定案上線時連同這支腳本一起刪掉。

   和 ortho-article／bioceramic-article 那兩次一樣，是「文章草稿的預覽」，
   不是設計提案 —— 但多一件事：使用者要看「調了哪裡」，所以這一頁帶一條
   只有一顆開關的切換條，把新增與改寫過的段落標出來。

   做的六件事（CLAUDE.md 第八節那四個坑 ＋ 文章複本多出來的兩個）：
     1. <head> 的 SEO 區塊整段換成 noindex（原本的 canonical／JSON-LD／og:*
        全部指向正式站那一頁，留著等於對外宣告兩個同樣的頁面）
     2. 計數器：data-views-self 拿掉、counter.js 拿掉（不然每開一次預覽，
        正式站那一篇就多算一次）
     3. 同層連結改絕對路徑（../regular-checkup/ 會指到 preview/ 底下去）
     4. 樣式放進 <head>（塞在 </body> 前面的話，關著的東西會在開頁那一瞬間閃出來）
     5. 切換條插在**最後一個** </body> 前面（這一站的註解裡就寫著那幾個字）
     6. class 一律 pv- 前綴（站上有的短名字幾乎一定會撞）                       */

import fs from "node:fs";
import path from "node:path";

const SRC = "posts/kids-arch-expansion/index.html";
const OUT = "preview/kids-arch-expansion/index.html";

let s = fs.readFileSync(SRC, "utf8");

/* ── 1. SEO 區塊換成 noindex ─────────────────────────────────────────── */
const a = s.indexOf("<!-- SEO:START");
const b = s.indexOf("<!-- SEO:END -->");
if (a < 0 || b < 0) throw new Error("找不到 SEO 區塊");
s = s.slice(0, a) +
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' +
  s.slice(b + "<!-- SEO:END -->".length);

/* 正式站那一頁的 canonical 也要拿掉（它在 SEO 區塊外面，手寫的） */
s = s.replace(/<link rel="canonical"[^>]*>\n?/, "");
s = s.replace(/<meta property="og:[^>]*>\n?/g, "");

/* ── 2. 計數器降級：整塊拿掉（提案頁不需要，留著會灌到正式站的數字） ──── */
s = s.replace(/\n\s*<span class="views"[\s\S]*?<\/span>\n(\s*<\/span>\n)?/, "\n");
s = s.replace(/<span class="views"[\s\S]*?次瀏覽\n\s*<\/span>/, "");
s = s.replace(/<script src="\.\.\/\.\.\/assets\/counter\.js"[^>]*><\/script>\n?/, "");

/* ── 3. 同層連結改絕對路徑 ───────────────────────────────────────────── */
s = s.replace(/href="\.\.\/([a-z0-9-]+)\/"/g, 'href="/posts/$1/"');

/* ── 4. 標出改動的地方 ───────────────────────────────────────────────── */
/* 每一筆是 [這個元素開頭獨一無二的一段, new｜edit]。
   ⚠ 掃整頁等於沒掃（CLAUDE.md 第九節第 4 條）—— 每一段都在檔案裡驗過只出現一次，
     底下的 mark() 會再檢查一次，出現 0 次或 2 次就直接 throw。 */
const MARKS = [
  ["<h2>什麼是「牙弓擴大」？和把牙齒排整齊差在哪</h2>", "edit"],
  ["<p>牙弓擴大動的是<strong>骨頭</strong>", "new"],
  ["<li><strong>讓鼻腔多一點空間</strong>", "edit"],
  ["<h2>年齡只是參考，真正要看的是上顎那道骨縫</h2>", "new"],
  ["<p>上顎不是一整塊骨頭", "new"],
  ["<p>而骨縫的成熟速度", "new"],
  ["<p>也因為這樣，<a href=\"https://aaoinfo.org", "new"],
  ["<p>孩子的牙弓要不要現在擴", "new"],
  ["<p>用一系列量身訂做的透明牙套", "new"],
  ["<li>要戴得夠久才算數", "new"],
  ["<p>用有彈性的活動裝置", "new"],
  ["<li>它的重點比較接近", "new"],
  ["<div class=\"callout\">\n      <p><b>費用怎麼算？</b>", "new"],
  ["<tr><td>孩子要配合什麼</td>", "new"],
  ["<tr><td>比較適合的情況</td>", "new"],
  ["<tr><td>要先知道的限制</td>", "new"],
  ["<h2>打呼、張著嘴睡，擴弓幫得上忙嗎</h2>", "new"],
  ["<p>可能有幫助，但<strong>它不是治打呼的方法</strong>", "new"],
  ["<p>研究上的情形是這樣", "new"],
  ["<p>孩子如果幾乎每晚都打呼", "new"],
  ["<h2>不是每個孩子都要現在開始</h2>", "new"],
  ["<p>評估完最常見的結論", "new"],
  ["<li><strong>「先追蹤」不是沒處理。</strong>", "new"],
  ["<li><strong>早期處理最明確的好處", "new"],
  ["<li><strong>早期矯正常常不是一次做完。</strong>", "new"],
  ["<p>排整齊只是一半", "new"],
  ["<p>下面這些在家就看得到", "new"],
  ["<li>咬起來的時候，上排牙齒", "new"],
  ["<li>上下門牙咬不攏", "new"],
  ["<li>乳牙掉得比預期早", "new"],
  ["<dt>什麼是牙弓擴大？和把牙齒排整齊差在哪？</dt>", "edit"],
  ["<dd>牙弓是支撐牙齒的骨骼範圍。擴大動的是骨頭", "edit"],
  ["<dt>幾歲該帶去看？看了就要開始做嗎？</dt>", "new"],
  ["<dd>美國齒顎矯正學會建議最晚七歲", "new"],
  ["<dd>為後續萌發的恆牙創造空間", "edit"],
  ["<dt>孩子打呼、張著嘴睡，擴弓治得好嗎？</dt>", "new"],
  ["<dd>擴弓不是治打呼的方法。", "new"],
  ["<dd>門牙長出來就重疊擁擠、牙弓呈狹窄的 V 型", "edit"],
  ["<dt>要花多少錢？健保有給付嗎？</dt>", "new"],
  ["<dd>齒顎矯正屬於自費項目", "new"],
  ["<p class=\"note\">本文為一般口腔衛教資訊", "edit"],
];

function mark(html, needle, kind) {
  const hits = html.split(needle).length - 1;
  if (hits !== 1) throw new Error("錨點命中 " + hits + " 次（要剛好 1 次）：" + needle);
  const m = needle.match(/^<([a-z0-9]+)([^>]*)>/i);
  if (!m) throw new Error("錨點要從一個開始標籤開頭：" + needle);
  const tag = m[1], attrs = m[2];
  const cls = "pv-mark pv-" + kind;
  let open;
  if (/class="/.test(attrs)) open = "<" + tag + attrs.replace(/class="([^"]*)"/, 'class="$1 ' + cls + '"') + ">";
  else open = "<" + tag + attrs + ' class="' + cls + '">';
  return html.replace(needle, open + needle.slice(m[0].length));
}
for (const [needle, kind] of MARKS) s = mark(s, needle, kind);

/* ── 5. 樣式放進 <head> ──────────────────────────────────────────────── */
/* ⚠ 顏色一律從站上既有的變數拿（--brick／--blue），夜間模式那一份自己會換掉，
     不必另外寫一套。--brick 對紙只有 4.17:1，所以它只當框線與底色，不當文字。 */
const CSS = [
  '<style>',
  '  .pv-mark { position: relative; }',
  '  html[data-pv="1"] .pv-mark {',
  '    border-left: 3px solid var(--rule);',
  '    padding-left: .8rem;',
  '    border-radius: 0 4px 4px 0;',
  '  }',
  '  html[data-pv="1"] .pv-new  { border-left-color: var(--brick);',
  '    background: color-mix(in srgb, var(--brick) 9%, transparent); }',
  '  html[data-pv="1"] .pv-edit { border-left-color: var(--blue);',
  '    background: color-mix(in srgb, var(--blue) 10%, transparent); }',
  '  html[data-pv="1"] li.pv-mark { margin-left: -.2rem; }',
  '  html[data-pv="1"] tr.pv-new td { background: color-mix(in srgb, var(--brick) 9%, transparent); }',
  '  html[data-pv="1"] tr.pv-mark { border-left: 3px solid var(--brick); padding-left: 0; }',
  '  html[data-pv="1"] dd.pv-mark, html[data-pv="1"] dt.pv-mark { padding-left: .8rem; }',
  '',
  '  .pv-bar {',
  '    position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;',
  '    background: color-mix(in srgb, var(--card) 94%, transparent);',
  '    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);',
  '    border-top: 1px solid var(--rule);',
  '    padding: .5rem max(14px, env(safe-area-inset-left)) calc(.5rem + env(safe-area-inset-bottom));',
  '    display: flex; align-items: center; gap: .7rem; flex-wrap: wrap;',
  '    font-size: .82rem; color: var(--ink-soft); line-height: 1.5;',
  '  }',
  '  .pv-bar b { color: var(--ink); font-weight: 600; }',
  '  .pv-key { display: inline-flex; align-items: center; gap: .3rem; }',
  '  .pv-chip { width: .85rem; height: .85rem; border-radius: 3px; display: inline-block;',
  '    border-left: 3px solid var(--brick); background: color-mix(in srgb, var(--brick) 20%, transparent); }',
  '  .pv-chip.e { border-left-color: var(--blue); background: color-mix(in srgb, var(--blue) 20%, transparent); }',
  '  .pv-sw { margin-left: auto; display: inline-flex; align-items: center; gap: .45rem;',
  '    border: 1px solid var(--rule); border-radius: 999px; padding: .28rem .7rem;',
  '    background: var(--paper); color: var(--ink); font: inherit; cursor: pointer; }',
  '  .pv-dot { width: .6rem; height: .6rem; border-radius: 50%; background: var(--rule); }',
  '  html[data-pv="1"] .pv-dot { background: var(--teal); }',
  '  body { padding-bottom: 5.5rem; }',
  '</style>'
].join("\n");
s = s.replace("</head>", CSS + "\n</head>");

/* ── 6. 切換條插在最後一個 </body> 前面 ──────────────────────────────── */
/* ⚠ 這一站的註解裡就寫著 </body> 這幾個字，String.replace 會換到註解裡那一個。 */
const BAR = [
  '<div class="pv-bar">',
  '  <span class="pv-key"><i class="pv-chip"></i>新增</span>',
  '  <span class="pv-key"><i class="pv-chip e"></i>改寫</span>',
  '  <span>這一頁是預覽，還沒上線</span>',
  '  <button class="pv-sw" type="button" aria-pressed="true">',
  '    <i class="pv-dot"></i><b>標出改動</b></button>',
  '</div>',
  '<script>',
  '(function () {',
  '  var r = document.documentElement;',
  '  var q = (location.search.match(/[?&]pv=([a-z0-9]+)/) || [])[1];',
  '  r.dataset.pv = q === "0" ? "0" : "1";',
  '  var btn = document.querySelector(".pv-sw");',
  '  function sync() { btn.setAttribute("aria-pressed", r.dataset.pv === "1" ? "true" : "false"); }',
  '  sync();',
  '  btn.addEventListener("click", function () {',
  '    r.dataset.pv = r.dataset.pv === "1" ? "0" : "1";',
  '    sync();',
  '    var u = new URL(location.href);',
  '    u.searchParams.set("pv", r.dataset.pv);',
  '    history.replaceState(null, "", u);',
  '  });',
  '})();',
  '<\/script>'
].join("\n");
const i = s.lastIndexOf("</body>");
if (i < 0) throw new Error("找不到 </body>");
s = s.slice(0, i) + BAR + "\n" + s.slice(i);

/* ── 守門 ────────────────────────────────────────────────────────────── */
if (/data-views-self/.test(s)) throw new Error("計數器沒拿乾淨（data-views-self 還在）");
if (/counter\.js/.test(s)) throw new Error("計數器沒拿乾淨（counter.js 還在）");
if (/rel="canonical"/.test(s)) throw new Error("canonical 還在");
if (!/noindex, nofollow, noarchive/.test(s)) throw new Error("noindex 沒進去");
if (/href="\.\.\/[a-z0-9-]+\//.test(s)) throw new Error("還有同層相對連結沒改成絕對路徑");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, s);
const n = MARKS.filter(m => m[1] === "new").length;
console.log("寫出 " + OUT + " —— 標了 " + MARKS.length + " 處（新增 " + n + "、改寫 " + (MARKS.length - n) + "）");
