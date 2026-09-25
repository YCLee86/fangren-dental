#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-fb-night/ 的產生器（一次性）
   --------------------------------------------------------------------------
   廖立揚醫師卡上的臉書標誌，**夜間模式**的顏色。
   起因：使用者 2026-09-25（上線當天）拿手機的夜間截圖：「深夜模式下的臉書標記顏色不好看」。

   成因（量過）：標誌吃 --accent-deep，夜間的矯正科那一支是 #6897b5 ——
   那是為了「深底上的字」提亮到 4.5 的色，拿來當**白 f 的底**就只剩 3.14:1，
   f 發白、整塊看起來像褪色。白天那一支 #31637f 上的白 f 是 6.52。

   這一頁是 index.html 的快照，**開頁強制夜間**，切換條只有一條「標誌的底色」：
     ?n=a  同藥丸 --accent #4478b5　白 f 4.57／對卡 3.11　← 旁邊那顆藥丸就是這個色
     ?n=b  再深一階 #3b6a9a　　　　 白 f 5.65／對卡 2.51（方塊開始沉進卡片）
     ?n=c  反白：#6897b5 底 ＋ 深色 f　f 4.51／對卡 4.51
     ?n=d  現況 #6897b5 ＋ 白 f　　　 白 f 3.14（對照）
   ⚠ 只動夜間，白天一個值都不動（:root[data-theme="dark"] 底下才生效）。
   ⚠ 快照、不要手改；定案後這支與 preview/doctor-fb-night/ 一起刪掉，
     推導補進 history/doctor-fb.html。
   四個陷阱照 CLAUDE.md 第八節做（路徑往上兩層、計數器降級、lastIndexOf('</body>')、pv- 前綴）。
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = join(ROOT, 'preview', 'doctor-fb-night', 'index.html');

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
if (!html.includes('class="doc-fb"')) throw new Error('站上那顆 .doc-fb 不見了');

/* ── 開頁強制夜間 ─────────────────────────────────────────────────────
   插在 <head> 那段決定主題的內嵌腳本後面；不寫 localStorage（同網域，會改到他在正式站的偏好）。 */
const NIGHT = "r.dataset.theme=s;})();</script>";
if (html.split(NIGHT).length !== 2) throw new Error('找不到 <head> 那段主題腳本');
html = html.replace(NIGHT, NIGHT + "\n<script>document.documentElement.dataset.theme='dark';</script>");

/* ── 候選的樣式放進 <head>（放在 </body> 前面的話開頁那一下會閃現況）── */
const STYLE = `
<style>
/* 提案用：夜間臉書標誌的底色。定案後只留選上的那一格寫回 index.html 的 .doc-fb。 */
:root[data-theme="dark"][data-fbn="a"] .doc-fb { color: var(--accent); }
:root[data-theme="dark"][data-fbn="b"] .doc-fb { color: #3b6a9a; }
:root[data-theme="dark"][data-fbn="c"] .doc-fb path { fill: var(--card); }
</style>`;
html = html.replace('<meta name="robots" content="noindex, nofollow, noarchive">',
  '<meta name="robots" content="noindex, nofollow, noarchive">' + STYLE);

const BAR = `
<!-- 切換條（提案用）。定案之後整塊刪掉。 -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: min(560px, calc(100vw - 16px));
  font: 400 13px/1.5 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee; background: rgba(8,9,11,.94); border: 1px solid rgba(255,255,255,.14);
  border-radius: 12px; padding: 8px 10px 9px; box-shadow: 0 6px 24px rgba(0,0,0,.4);
}
.pvbar-r { display: flex; align-items: center; gap: 6px; }
.pvbar-k { flex: none; color: #b9bcbf; font-size: 12px; }
.pvbar-r button {
  flex: 1; min-width: 0; font: inherit; color: inherit; cursor: pointer; white-space: nowrap;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px; padding: 5px 2px;
}
.pvbar-r button[aria-pressed="true"] { background: #f2f0ee; color: #1c1e22; border-color: #f2f0ee; font-weight: 600; }
@media print { .pvbar { display: none; } }
</style>
<div class="pvbar">
  <div class="pvbar-r"><span class="pvbar-k">底色</span>
    <button type="button" data-v="a">Ⓐ 同藥丸</button>
    <button type="button" data-v="b">Ⓑ 再深</button>
    <button type="button" data-v="c">Ⓒ 反白</button>
    <button type="button" data-v="d">Ⓓ 現況</button>
  </div>
</div>
<script>
(function () {
  var root = document.documentElement, box = document.querySelector('.pvbar');
  var OK = ['a','b','c','d'], st = 'a', q = new URLSearchParams(location.search).get('n');
  if (q && OK.indexOf(q) >= 0) st = q;
  function apply() {
    root.setAttribute('data-fbn', st);
    box.querySelectorAll('button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === st)); });
    var u = new URLSearchParams(location.search); if (st === 'a') u.delete('n'); else u.set('n', st);
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }
  box.addEventListener('click', function (e) { var b = e.target.closest('button[data-v]'); if (b) { st = b.dataset.v; apply(); } });
  apply();
  var card = document.querySelector('.doc-fb').closest('.doc');
  addEventListener('load', function () { setTimeout(function () {
    var y = card.getBoundingClientRect().top + scrollY - Math.max(16, (innerHeight - box.offsetHeight - card.offsetHeight) / 2);
    scrollTo({ top: y });
  }, 300); });
})();
</script>
`;
const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + BAR + '\n' + html.slice(i);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-fb-night/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
