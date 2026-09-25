#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-fb/ 的產生器（一次性）
   --------------------------------------------------------------------------
   把 index.html 做成提案頁的快照，在廖立揚醫師的卡上加一顆臉書標誌，
   連到他自己的粉絲專頁。兩條尺：位置（名字旁／右上角／卡片底）× 顏色（臉書藍／科別色）。
   起因：使用者 2026-09-25「廖立揚在臉書有自己的粉絲專頁 我想把這個粉專連結
        做在他的醫師圖卡 用臉書的logo標記 做預覽給我看」。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-fb-preview.mjs
   ⚠ 定案上線之後，這支與 preview/doctor-fb/ 一起刪掉，
     推導文字搬進 history/doctor-fb.html（CLAUDE.md 第八節）。

   CLAUDE.md 第八節列的四個陷阱，這裡都照做了：
     ① 相對路徑往上兩層（assets/ posts/ topics/ site.webmanifest）
     ② 計數器「降級」不拿掉：data-views-self → data-views（只有 -self 會 +1），
        所以不灌首頁的計數、也印得出真數字（chip-carry 那一輪的做法）
     ③ 切換條用 lastIndexOf('</body>') 插入（註解裡就有那幾個字）
     ④ class 一律 pv- 前綴（站上的短名字幾乎一定會撞）
   另外兩件：SEO 區塊整段換成 noindex（不然快照對外宣告 canonical ＝ 首頁）；
   search-log.js 與 click-log.js 拿掉（不然提案頁上的操作會混進正式的紀錄）。

   ⚠⚠ 粉專網址**使用者還沒給** —— 下面 FB_URL 是空的時候，
       標誌照樣畫、按下去只跳一句提示，不會連到任何猜的網址。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'doctor-fb', 'index.html');
const FB_URL = '';   // ← 使用者給了粉專網址就填這裡，再跑一次

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ── ① 相對路徑往上兩層 ────────────────────────────────────────────────
   ⚠ 不要改用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|topics\/|site\.webmanifest|favicon)/g, '$1../../$2');
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');
/* CSS 裡的 url(assets/…) 與 image-set("assets/…") 也要跟著往上兩層（線稿、字型）。 */
html = html.replace(/url\((['"]?)assets\//g, 'url($1../../assets/');
html = html.replace(/image-set\(([^)]*)\)/g, (m, s) => 'image-set(' + s.replace(/(['"])assets\//g, '$1../../assets/') + ')');

/* ── SEO 區塊整段換成 noindex ───────────────────────────────────────── */
const s0 = html.indexOf('<!-- SEO:START'), s1 = html.indexOf('<!-- SEO:END -->');
if (s0 < 0 || s1 < 0) throw new Error('找不到 SEO 區塊');
html = html.slice(0, s0) + '<meta name="robots" content="noindex, nofollow, noarchive">\n' + html.slice(s1 + 16);
html = html.replace(/<link rel="canonical"[^>]*>\n?/, '');

/* ── ② 計數器降級、兩支紀錄拿掉 ─────────────────────────────────────── */
/* ⚠ 要連 class 一起比對：那一行上面的註解裡也寫著 data-views-self="home"。 */
html = html.replace('<p class="band-views" data-views-self="home">', '<p class="band-views" data-views="home">');
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/(?:search|click)-log\.js" defer><\/script>/g, '');
if (/data-views-self|search-log\.js|click-log\.js/.test(html.replace(/<!--[\s\S]*?-->/g, '')))
  throw new Error('計數器或紀錄沒拿乾淨');

/* ── 臉書標誌 ─────────────────────────────────────────────────────────
   形狀是臉書 2019 起的官方標誌（圓 ＋ 挖空的 f），單一路徑、currentColor。
   ⚠ 底下墊一個白圓：路徑的 f 是挖空的，夜間模式會透出深色卡底，官方標誌的 f 是白的。
   按鈕本身只有標誌沒有字，所以 aria-label 要把「臉書粉絲專頁」與「另開視窗」講清楚。 */
const FB_PATH = 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z';
const svg = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11.4" fill="#fff"/><path fill="currentColor" d="' + FB_PATH + '"/></svg>';
const href = FB_URL || '#pv-fb-todo';
const a = (cls, txt) =>
  `<a class="pv-fb ${cls}" href="${href}" target="_blank" rel="noopener" aria-label="廖立揚醫師的臉書粉絲專頁（另開視窗）">${svg}${txt || ''}</a>`;

/* 三個位置三份標記都放著，由 <html data-fbpos> 決定哪一份看得到。
   ⚠ 用 display 切沒問題：這張卡沒有照片，skFit() 的探針插在第一張卡（李柄輝），
     量到的東西和這三顆無關。 */
const H3 = '<h3>廖立揚<span class="doc-role">矯正專科醫師</span></h3>';
if (html.split(H3).length !== 2) throw new Error('廖立揚那一行不是剛好一個');
html = html.replace(H3,
  '<h3>廖立揚<span class="doc-role">矯正專科醫師</span>' + a('pv-fb-a') + '</h3>\n          ' + a('pv-fb-b'));
/* 卡片底那一份接在廖立揚那張的 </dl> 後面 —— 從 H3 往後找第一個 </dl>。 */
const at = html.indexOf('<h3>廖立揚');
const dl = html.indexOf('</dl>', at);
html = html.slice(0, dl + 5) + '\n          ' + a('pv-fb-c', '<span>臉書粉絲專頁</span>') + html.slice(dl + 5);
html = html.replace('<article class="doc" data-spec="ortho">\n          <!-- ⚠ 形象照',
                    '<article class="doc pv-fb-card" data-spec="ortho">\n          <!-- ⚠ 形象照');
if (!html.includes('pv-fb-card')) throw new Error('廖立揚那張卡沒掛上 pv-fb-card');

/* ── 樣式放進 <head>（放在 </body> 前面的話開頁那一下三顆會一起閃出來）── */
const NOTE = `<!-- ==========================================================================
     提案：廖立揚醫師卡上的臉書粉專連結（2026-09-25）
     使用者：「廖立揚在臉書有自己的粉絲專頁 我想把這個粉專連結 做在他的醫師圖卡
     用臉書的logo標記 做預覽給我看」
     兩條尺：位置 ?pos=a|b|c（名字旁／右上角／卡片底一行）× 顏色 ?c=blue|spec
     （臉書官方藍 #1877F2／這張卡自己的科別色 --accent-deep）。
     ========================================================================== -->`;
const STYLE = `
<style>
/* 提案用。定案後只留選上的那一格，其餘連同 <html data-fbpos / data-fbc> 一起刪掉。 */
.pv-fb { display: none; color: var(--pv-fb, #1877F2); text-decoration: none; }
:root[data-fbc="spec"] .pv-fb { --pv-fb: var(--accent-deep); }
.pv-fb svg { display: block; width: 100%; height: 100%; }
.pv-fb:focus-visible { outline: 2px solid var(--pv-fb, #1877F2); outline-offset: 2px; border-radius: 50%; }
.pv-fb-card { position: relative; }

/* Ⓐ 名字旁：跟在藥丸後面，和藥丸同高、墨對齊名字那一行 */
:root[data-fbpos="a"] .pv-fb-a {
  display: inline-block; width: 1.15em; height: 1.15em; margin-left: .45rem;
  vertical-align: -.2em;
}
/* Ⓑ 右上角：和卡片上緣、右緣的距離＝卡片的內距 */
:root[data-fbpos="b"] .pv-fb-b {
  display: block; position: absolute; top: 1.1rem; right: 1.2rem;
  width: 1.55rem; height: 1.55rem;
}
/* Ⓒ 卡片底：一行字 ＋ 標誌，和「專長／資歷／學歷」的左緣切齊 */
:root[data-fbpos="c"] .pv-fb-c {
  display: inline-flex; align-items: center; gap: .45rem; margin-top: .8rem;
  font-size: .83rem; line-height: 1.5; font-weight: 500;
}
:root[data-fbpos="c"] .pv-fb-c svg { width: 1.3rem; height: 1.3rem; flex: none; }
:root[data-fbpos="c"] .pv-fb-c span { color: var(--ink-soft); }
:root[data-fbpos="c"] .pv-fb-c:hover span { text-decoration: underline; text-underline-offset: 3px; }
</style>`;
html = html.replace('<meta name="robots" content="noindex, nofollow, noarchive">',
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE + STYLE);

/* ── 切換條 ─────────────────────────────────────────────────────────── */
const BAR = `
<!-- 切換條（提案用）。定案之後整塊刪掉。 -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: min(560px, calc(100vw - 16px));
  font: 400 13px/1.5 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee; background: rgba(28,30,34,.92); border-radius: 12px;
  padding: 8px 10px 9px; box-shadow: 0 6px 24px rgba(0,0,0,.25);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
}
.pvbar-r { display: flex; align-items: center; gap: 6px; }
.pvbar-r + .pvbar-r { margin-top: 6px; }
.pvbar-k { flex: none; width: 2.6em; color: #b9bcbf; font-size: 12px; }
.pvbar-r button {
  flex: 1; min-width: 0; font: inherit; color: inherit; cursor: pointer; white-space: nowrap;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px; padding: 5px 4px;
}
.pvbar-r button[aria-pressed="true"] { background: #f2f0ee; color: #1c1e22; border-color: #f2f0ee; font-weight: 600; }
.pvbar-go { flex: none !important; width: auto; padding: 5px 8px !important; }
@media print { .pvbar { display: none; } }
</style>
<div class="pvbar">
  <div class="pvbar-r" data-k="pos"><span class="pvbar-k">位置</span>
    <button type="button" data-v="a">Ⓐ 名字旁</button>
    <button type="button" data-v="b">Ⓑ 右上角</button>
    <button type="button" data-v="c">Ⓒ 卡片底</button>
  </div>
  <div class="pvbar-r" data-k="c"><span class="pvbar-k">顏色</span>
    <button type="button" data-v="blue">臉書藍</button>
    <button type="button" data-v="spec">矯正科的藍灰</button>
    <button type="button" class="pvbar-go" aria-label="捲到廖立揚醫師的卡">↥ 看卡</button>
  </div>
</div>
<script>
(function () {
  var root = document.documentElement, box = document.querySelector('.pvbar');
  var KEYS = { pos: ['a','b','c'], c: ['blue','spec'] }, DEF = { pos: 'a', c: 'blue' };
  var st = { pos: DEF.pos, c: DEF.c }, qs = new URLSearchParams(location.search);
  Object.keys(KEYS).forEach(function (k) { var v = qs.get(k); if (v && KEYS[k].indexOf(v) >= 0) st[k] = v; });
  function apply() {
    root.setAttribute('data-fbpos', st.pos); root.setAttribute('data-fbc', st.c);
    Object.keys(KEYS).forEach(function (k) {
      box.querySelectorAll('.pvbar-r[data-k="' + k + '"] button[data-v]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      });
    });
    var q = new URLSearchParams(location.search);
    Object.keys(KEYS).forEach(function (k) { if (st[k] !== DEF[k]) q.set(k, st[k]); else q.delete(k); });
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
  }
  var card = document.querySelector('.pv-fb-card');
  function go() {
    var y = card.getBoundingClientRect().top + scrollY - Math.max(16, (innerHeight - box.offsetHeight - card.offsetHeight) / 2);
    scrollTo({ top: y, behavior: 'smooth' });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('pvbar-go')) { go(); return; }
    st[b.closest('.pvbar-r').dataset.k] = b.dataset.v; apply();
  });
  /* 網址還沒給：按下去只提示，不連到任何猜的網址。 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.pv-fb[href="#pv-fb-todo"]'); if (!a) return;
    e.preventDefault(); alert('粉專網址還沒給 —— 給了之後這顆就會連過去（另開視窗）。');
  });
  apply();
  addEventListener('load', function () { setTimeout(go, 300); });
})();
</script>
`;
const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-fb/index.html（' + (html.length / 1024).toFixed(0) + ' KB）' + (FB_URL ? '' : '　⚠ 粉專網址還沒填'));
