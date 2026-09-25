#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-posts/ 的產生器（一次性）
   --------------------------------------------------------------------------
   把 index.html 做成提案頁的快照，在九張醫師卡上加「往文章走」的入口。三案：
     Ⓐ 專長／資歷／學歷底下多一列「文章」：這位醫師涵蓋的每一科一個連結
        「牙周治療・4 篇 ›」→ 那一科著陸頁的文章區（/topics/<spec>/#articles）
     Ⓑ 同一列，先列兩篇文章的標題（點了直接進文章），底下再接 Ⓐ 那一排
     Ⓒ 卡片不加任何東西，把「專長」那幾個詞變成連結 → 那個詞所屬那一科的著陸頁
   起因：使用者 2026-09-25「醫師介紹的瀏覽明顯高於其他頁面不少，有想到在醫師圖卡
        做文章導流」→「ABC都做提案頁」。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-posts-preview.mjs
   ⚠ 定案上線之後，這支與 preview/doctor-posts/ 一起刪掉，
     推導文字搬進 history/doctor-posts.html（CLAUDE.md 第八節）。

   CLAUDE.md 第八節的四個陷阱照 doctor-fb 那一輪做：
     ① 相對路徑往上兩層 ② 計數器降級（data-views-self → data-views）
     ③ 切換條用 lastIndexOf 插在最後一個 body 結束標籤前 ④ class 一律 pv- 前綴
   另外：SEO 區塊換成 noindex；search-log.js 與 click-log.js 拿掉。

   ⚠⚠ 名單規則和文章頁「這一科的醫師」同一條，方向相反：
       醫師涵蓋的科 ＝ 他的專科 ＋ 專長裡出現過的科（專科排第一，其餘照專長出現的順序）。
   ⚠⚠ Ⓐ／Ⓑ 加進卡片的字**不進首頁搜尋**：首頁搜尋讀的是整張醫師卡的 textContent，
       不排除的話搜「植牙」會多跑出三位醫師（他們卡上印著那篇的標題）。
       這一頁把 indexOf() 改成先拿掉 .pv-dp 再讀字，上線時要照做。
   ⚠ 文章卡上的措辭不能寫成「某某醫師的文章」—— 文章的作者是診所編輯室，
     全站 2026-08-02 起不署名（CLAUDE.md 第六節）。一律寫「文章」。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'doctor-posts', 'index.html');
const SPEC_NAME = {
  general: '一般牙科', perio: '牙周治療', ortho: '齒顎矯正', kids: '兒童牙科',
  surg: '口腔外科', prosth: '假牙與植牙', endo: '顯微根管',
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ── 文章：post-meta ＋ 頂端科別藥丸的 data-spec（和 build.mjs 同一個來源）── */
const posts = readdirSync(join(ROOT, 'posts'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const h = readFileSync(join(ROOT, 'posts', d.name, 'index.html'), 'utf8');
    const meta = JSON.parse(/<script type="application\/json" id="post-meta">([\s\S]*?)<\/script>/.exec(h)[1]);
    const spec = /<a class="post-tag"[^>]*data-spec="([a-z]+)"/.exec(h)?.[1];
    if (!spec) throw new Error(`posts/${d.name} 找不到頂端科別藥丸的 data-spec`);
    return { slug: meta.slug, title: meta.title, published: meta.published, updated: meta.updated, spec };
  })
  .sort((a, b) => b.published.localeCompare(a.published) || (b.updated || '').localeCompare(a.updated || ''));
const bySpec = (s) => posts.filter((p) => p.spec === s);
/* 標題只取冒號前那一段 —— 卡片上一行放得下，整句（平均 30 字）在手機上會折三行。 */
const shortTitle = (t) => { const s = t.split('：')[0]; return s.length > 12 ? s.replace(/^(.+?[？！]).*$/, '$1') : s; };

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ── 醫師：讀 #doctors（和 build.mjs 的 allDoctors 同一組正規式）── */
const a0 = html.indexOf('<section id="doctors">'), a1 = html.indexOf('</section>', a0);
const doctors = [...html.slice(a0, a1).matchAll(/<article class="doc"([^>]*)>([\s\S]*?)<\/article>/g)].map((m) => {
  const slug = /\bid="doc-([a-z-]+)"/.exec(m[1])[1];
  const spec = /data-spec="([a-z]+)"/.exec(m[1])[1];
  const specs = [spec];
  for (const x of m[2].matchAll(/<span class="sk" data-spec="([a-z]+)">/g)) if (!specs.includes(x[1])) specs.push(x[1]);
  return { slug, name: /<h3>([^<]+)</.exec(m[2])[1], spec, specs };
});
if (doctors.length !== 9) throw new Error('醫師卡不是九張：' + doctors.length);

/* ── 三案的標記 ──────────────────────────────────────────────────────
   Ⓐ 與 Ⓑ 都是 dl 裡多一列 dt「文章」＋ dd，和專長／資歷／學歷同一套欄位，
   左緣、灰底標籤、行高全部沿用，不另外發明一種版面。 */
const specLinks = (d) => d.specs.map((s) =>
  `<a class="pv-dp-spec" data-spec="${s}" href="topics/${s}/#articles">${SPEC_NAME[s]}・${bySpec(s).length} 篇<span aria-hidden="true"> ›</span></a>`
).join('<span class="sep">　</span>');

/* Ⓑ 的兩篇：專科那一科最新的一篇 ＋ 另一科最新的一篇；只有一科的就是那一科最新的兩篇。 */
const pickTwo = (d) => {
  const first = bySpec(d.spec)[0];
  const other = posts.find((p) => p !== first && d.specs.includes(p.spec) && p.spec !== d.spec);
  const second = other || bySpec(d.spec)[1];
  return [first, second].filter(Boolean);
};
const titleLinks = (d) => pickTwo(d).map((p) =>
  `<a class="pv-dp-post" data-spec="${p.spec}" href="posts/${p.slug}/">${esc(shortTitle(p.title))}</a>`
).join('');

const block = (d) => `
            <dt class="pv-dp pv-dp-a">文章</dt><dd class="pv-dp pv-dp-a">${specLinks(d)}</dd>
            <dt class="pv-dp pv-dp-b">文章</dt><dd class="pv-dp pv-dp-b">${titleLinks(d)}<span class="pv-dp-more">${specLinks(d)}</span></dd>`;

let n = 0;
html = html.slice(0, a0) + html.slice(a0, a1).replace(/(<article class="doc"[^>]*\bid="doc-([a-z-]+)">[\s\S]*?)(\n\s*<\/dl>)/g, (m, head, slug, tail) => {
  n++;
  const d = doctors.find((x) => x.slug === slug);
  /* Ⓒ：專長那幾個詞換成連結。平常看起來仍是一句話，只多一道虛線底線。 */
  head = head.replace(/<span class="sk" data-spec="([a-z]+)">([^<]+)<\/span>/g,
    (_, s, t) => `<span class="sk" data-spec="${s}">${t}</span><a class="sk pv-sk-c" data-spec="${s}" href="topics/${s}/#articles" aria-label="${t}：${SPEC_NAME[s]}的文章">${t}</a>`);
  return head + block(d) + tail;
}) + html.slice(a1);
if (n !== 9) throw new Error('只有 ' + n + ' 張卡插進去');

/* ── 首頁搜尋不讀 .pv-dp（見檔頭）───────────────────────────────── */
const IDX = "return { el: el, text: (el.textContent || '').replace(/\\s+/g, '').toLowerCase() };";
if (html.split(IDX).length !== 2) throw new Error('indexOf() 那一行不是剛好一個');
html = html.replace(IDX,
  "var c = el.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.pv-dp, .pv-sk-c'), function (x) { x.remove(); });\n" +
  "      return { el: el, text: (c.textContent || '').replace(/\\s+/g, '').toLowerCase() };");

/* ── ① 相對路徑往上兩層 ─────────────────────────────────────────── */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|topics\/|site\.webmanifest|favicon)/g, '$1../../$2');
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');
html = html.replace(/url\((['"]?)assets\//g, 'url($1../../assets/');
html = html.replace(/image-set\(([^)]*)\)/g, (m, s) => 'image-set(' + s.replace(/(['"])assets\//g, '$1../../assets/') + ')');

/* ── SEO 區塊整段換成 noindex ───────────────────────────────────── */
const s0 = html.indexOf('<!-- SEO:START'), s1 = html.indexOf('<!-- SEO:END -->');
if (s0 < 0 || s1 < 0) throw new Error('找不到 SEO 區塊');
html = html.slice(0, s0) + '<meta name="robots" content="noindex, nofollow, noarchive">\n' + html.slice(s1 + 16);
html = html.replace(/<link rel="canonical"[^>]*>\n?/, '');

/* ── ② 計數器降級、兩支紀錄拿掉 ─────────────────────────────────── */
html = html.replace('<p class="band-views" data-views-self="home">', '<p class="band-views" data-views="home">');
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/(?:search|click|source)-log\.js" defer><\/script>/g, '');
if (/data-views-self|search-log\.js|click-log\.js|source-log\.js/.test(html.replace(/<!--[\s\S]*?-->/g, '')))
  throw new Error('計數器或紀錄沒拿乾淨');

/* ── 樣式放進 head（放在 body 尾巴的話，開頁那一下三案會一起閃出來）── */
const NOTE = `<!-- ==========================================================================
     提案：醫師卡往文章導流（2026-09-25）
     使用者：「醫師介紹的瀏覽明顯高於其他頁面不少，有想到在醫師圖卡做文章導流」
     →「ABC都做提案頁」。?dp=off|a|b|c
       Ⓐ 卡片多一列「文章」：每一科一個連結「牙周治療・4 篇 ›」→ 著陸頁的文章區
       Ⓑ 同一列先列兩篇標題（直接進文章），底下再接 Ⓐ 那一排
       Ⓒ 卡片不加東西，專長那幾個詞變成連結 → 那一科的著陸頁
     ========================================================================== -->`;
const STYLE = `
<style>
/* 提案用。定案後只留選上的那一案，其餘連同 <html data-dp> 一起刪掉。 */
.pv-dp, .pv-sk-c { display: none; }
:root[data-dp="a"] .pv-dp-a, :root[data-dp="b"] .pv-dp-b { display: block; }
:root[data-dp="c"] .pv-sk-c { display: inline; }
:root[data-dp="c"] .skills > span.sk { display: none; }

/* Ⓐ Ⓑ 的連結：字色 ＝ 那一科的 --accent-deep（連結自己帶 data-spec，
   站上那排 [data-spec] 變數宣告會落在它身上），夜間跟著那一科一起提亮。 */
.pv-dp-spec, .pv-dp-post { color: var(--accent-deep); text-decoration: none; font-weight: 500; }
.pv-dp-spec { white-space: nowrap; }
.pv-dp-spec:hover, .pv-dp-post:hover { text-decoration: underline; text-underline-offset: 3px; }
.pv-dp-post { display: block; }
/* 標題不加〈〉：全形括號左半是空白，行首會比「牙周治療・4 篇」那一行內縮半個字。 */
.pv-dp-more { display: block; margin-top: .15rem; font-size: .92em; }
.pv-dp-more .pv-dp-spec { font-weight: 400; }

/* Ⓒ：仍然是一句話，只多一道那一科顏色的虛線 —— 按得到，但不搶名字與藥丸的份量。 */
.pv-sk-c {
  color: inherit; text-decoration: underline dotted; text-decoration-thickness: 1.5px;
  text-underline-offset: 4px; text-decoration-color: var(--accent-deep);
  /* 用 --accent-deep 不用 --accent：夜間的一般牙科綠 --accent 在深卡上幾乎看不見那道虛線 */
}
.pv-sk-c:hover { color: var(--accent-deep); text-decoration-style: solid; }
/* 著陸頁那支篩選 JS 會幫命中的專長加 .tag-on（淡色塊），連結版要跟著長一樣 */
.pv-sk-c.tag-on { text-decoration: none; }
</style>`;
html = html.replace('<meta name="robots" content="noindex, nofollow, noarchive">',
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE + STYLE);

/* ── 切換條 ───────────────────────────────────────────────────────── */
const BAR = `
<!-- 切換條（提案用）。定案之後整塊刪掉。 -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: min(560px, calc(100vw - 16px));
  font: 400 13px/1.5 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee; background: rgba(28,30,34,.92); border-radius: 12px;
  padding: 8px 10px 8px; box-shadow: 0 6px 24px rgba(0,0,0,.25);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
}
.pvbar-r { display: flex; align-items: center; gap: 6px; }
.pvbar-r button {
  flex: 1; min-width: 0; font: inherit; color: inherit; cursor: pointer; white-space: nowrap;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px; padding: 5px 4px;
}
.pvbar-r button[aria-pressed="true"] { background: #f2f0ee; color: #1c1e22; border-color: #f2f0ee; font-weight: 600; }
.pvbar-go { flex: none !important; padding: 5px 8px !important; }
.pvbar-m { margin-top: 5px; font-size: 12px; color: #b9bcbf; line-height: 1.45; }
.pvbar-m b { color: #f2f0ee; font-weight: 600; }
@media print { .pvbar { display: none; } }
</style>
<div class="pvbar">
  <div class="pvbar-r">
    <button type="button" data-v="off">現況</button>
    <button type="button" data-v="a">Ⓐ 科別</button>
    <button type="button" data-v="b">Ⓑ 標題</button>
    <button type="button" data-v="c">Ⓒ 專長</button>
    <button type="button" class="pvbar-go" aria-label="捲到醫師介紹">↥ 醫師</button>
  </div>
  <div class="pvbar-m" aria-live="polite"></div>
</div>
<script>
(function () {
  var root = document.documentElement, box = document.querySelector('.pvbar');
  var KEYS = ['off', 'a', 'b', 'c'], DEF = 'b', cur = DEF;
  var DESC = {
    off: '站上現在的樣子',
    a: '卡片多一列：每一科一個連結 → 那一科的文章',
    b: '卡片多一列：兩篇標題直接進文章 ＋ 各科「全部 N 篇」',
    c: '卡片不變，專長的詞可以按 → 那一科的文章'
  };
  var v = new URLSearchParams(location.search).get('dp');
  if (v && KEYS.indexOf(v) >= 0) cur = v;
  var sec = document.getElementById('doctors'), docs = document.querySelectorAll('.docs .doc');
  /* 量：整段「醫師介紹」與最高那張卡，比現況多幾 px。
     切到「現況」量一次再切回來 —— 同一個 task 裡做完，畫面不會閃。 */
  function measure() {
    var keep = root.getAttribute('data-dp');
    root.setAttribute('data-dp', 'off');
    var h0 = sec.offsetHeight, c0 = [];
    docs.forEach(function (d) { c0.push(d.offsetHeight); });
    root.setAttribute('data-dp', keep);
    var h1 = sec.offsetHeight, most = 0;
    docs.forEach(function (d, i) { most = Math.max(most, d.offsetHeight - c0[i]); });
    var ov = document.documentElement.scrollWidth > innerWidth + 0.5;
    return '醫師介紹整段 <b>' + (h1 - h0 >= 0 ? '+' : '') + (h1 - h0) + 'px</b>・單張卡最多 <b>+' + most + 'px</b>・' +
      innerWidth + ' 寬' + (ov ? '・<b>⚠ 破框</b>' : '・沒破框');
  }
  function apply() {
    root.setAttribute('data-dp', cur);
    box.querySelectorAll('button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === cur)); });
    box.querySelector('.pvbar-m').innerHTML = DESC[cur] + (cur === 'off' ? '' : '<br>' + measure());
    var q = new URLSearchParams(location.search);
    if (cur !== DEF) q.set('dp', cur); else q.delete('dp');
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
  }
  function go() {
    var y = sec.getBoundingClientRect().top + scrollY - 8;
    scrollTo({ top: y, behavior: 'smooth' });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('pvbar-go')) { go(); return; }
    cur = b.dataset.v; apply();
  });
  apply();
  /* 照片與字型晚到會改變卡高 —— load 之後再量一次，轉向或拉寬視窗也重量。 */
  addEventListener('load', function () { apply(); if (!location.hash) setTimeout(go, 300); });
  var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(apply, 200); });
})();
</script>
`;
const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-posts/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
for (const d of doctors) console.log(`  ${d.name}　${d.specs.map((s) => SPEC_NAME[s] + ' ' + bySpec(s).length).join('、')}　Ⓑ：${pickTwo(d).map((p) => shortTitle(p.title)).join('／')}`);
