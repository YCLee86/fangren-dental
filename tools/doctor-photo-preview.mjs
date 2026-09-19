#!/usr/bin/env node
/* ==========================================================================
   preview/doctor-photo/ 的產生器
   --------------------------------------------------------------------------
   把 index.html 做成提案頁的快照，在李柄輝醫師那張卡上比四種放法。
   起因：使用者 2026-09-19 給了一張他的形象圖照（1145×1374），
        「討論一下可以怎麼跟現有的醫師圖卡結合」。

   ⚠ 這一頁是**快照**，不要手改。要改就改這支再跑一次：
        node tools/doctor-photo-crop.mjs && node tools/doctor-photo-preview.mjs
   ⚠ 圖檔由 tools/doctor-photo-crop.mjs 產生，在 preview/doctor-photo/img/。
   ⚠ 定案之後：這一頁與這兩支一起刪掉，推導搬進 history/doctor-photo.html
     （CLAUDE.md 第八節）。原檔留在 drafts/doctor-photo/src/。

   CLAUDE.md 第八節那四個陷阱都照做了：
     ① 相對路徑往上兩層（assets/ posts/ site.webmanifest，srcset 另外處理）
     ② 拿掉 counter.js 與 data-views-self，窄帶數字寫死並手動加 .is-on
     ③ 切換條用 lastIndexOf('</body>') 插入（註解裡就有那幾個字）
     ④ class 一律 pv- 前綴（站上的短名字幾乎一定會撞）
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR  = join(ROOT, 'preview', 'doctor-photo');
const OUT  = join(DIR, 'index.html');

/* 圖檔要先在（不在的話整頁會是破圖，而這一頁要判斷的正是圖）。 */
['li-binghui-sq-200.jpg', 'li-binghui-wide-400.jpg', 'li-binghui-tall-400.jpg']
  .forEach((f) => {
    if (!existsSync(join(DIR, 'img', f)))
      throw new Error(`找不到 img/${f} —— 先跑 node tools/doctor-photo-crop.mjs`);
  });

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* ── 推導（定案後整段搬進 history/doctor-photo.html）───────────────────── */
const NOTE = `<!-- ==========================================================================
     提案：醫師的形象圖照怎麼跟醫師圖卡結合（2026-09-19）
     --------------------------------------------------------------------------
     使用者給了一張李柄輝醫師的形象圖照（PNG 1145×1374，比例正好 5:6），
     「討論一下可以怎麼跟現有的醫師圖卡結合」。

     ---- 先講三件在挑版面之前就要決定的事 ------------------------------------

     ① **九位醫師，目前只有一張圖。**
        這是這一輪真正的題目，不是「圖要多大」。九張卡排成三欄三列，
        其中一張有臉、八張沒有，grid 會把同一列拉到最高那張的高度 ——
        放愈大，旁邊兩張的空白就愈明顯。
        這一站已經處理過同一個問題：2026-08-15 六篇文章換 HERO 插畫時，
        使用者指定「**所有的文章都做好再一次換**」，圖一張一張進來、
        六篇湊齊才一起上線（/history/hero-photos.html）。
        所以這一頁給的四格其實是**兩條路**：
          ・Ⓓ 只有創辦醫師有圖 —— 九張不必湊齊，今天就能上線
          ・Ⓑ／Ⓒ 每張都要有圖 —— 要等九張到齊，中間用佔位撐著

     ② **這張是 AI 生成的形象圖，不是實拍照片。**
        看得出來的地方：天花板的管線接不起來、左邊那台燈的支臂、
        白袍的皺褶是畫的不是拍的。**要先確認這張臉是照李柄輝醫師本人做的**——
        醫療院所的網站把一張臉標上真實醫師的姓名，是在對讀者宣告一件事實。
        不是本人的話，要嘛換成實拍，要嘛整組都做成不指認的插畫。

     ③ **背景不是芳仁的診間。**
        同一頁往下捲就是兩張真的診間照（assets/clinic-room-1/2）：
        木質地板、白牆、沒有藍綠色的診療椅。這張圖裡是藍綠椅、深色檯面、
        裸露的天花板管線。兩者並排會互相拆台。
        →  裁得愈緊，這個問題愈小（Ⓑ 圓頭像幾乎看不到背景，
           Ⓒ／Ⓓ 看得到一大片）。

     ---- 四格（尺一：放法）--------------------------------------------------
       Ⓐ 現況      九張都沒有圖。當基準用的，不是候選案。
       Ⓑ 圓頭像    名字左邊一顆圓的頭像。侵入最小、背景幾乎看不到，
                    卡的高度不會變 —— 但九張湊不齊的時候，一顆圓圖配八個空位。
       Ⓒ 卡片頂圖  圖橫跨卡片上緣（像文章卡的縮圖）。份量最重、
                    也最看得出「這一頁有人」，代價是那張卡比旁邊高一截。
       Ⓓ 創辦醫師橫幅  李柄輝醫師那張抽出來、跨整列放在最上面，圖左文右，
                    其餘八張原封不動。**只有一張圖的時候，這一格是唯一
                    「不必解釋為什麼別人沒有」的放法**——創辦醫師本來就不同級。
                    代價：剩下八張排三欄變成 3＋3＋2，最後一列缺一格。

     ---- 尺二：另外八位怎麼辦（只在 Ⓑ／Ⓒ 有作用）---------------------------
       Ⓐ 空著      維持現在的文字卡。一顆圓圖配八個空位，落差很明顯。
       Ⓑ 字首圓章  姓氏一個字，套各自的科別色。**不是為了好看，是為了
                    讓那個位置在九張卡上都有東西**，圖到齊就一張一張換掉。

     ---- 尺三：份量 ---------------------------------------------------------
       每一種放法各自的三格：圓頭像 56／64／76px、
       卡片頂圖 5:2／3:2／4:3、橫幅的圖欄 180／230／280px。

     ---- 圖檔 ---------------------------------------------------------------
     原檔 drafts/doctor-photo/src/li-binghui.png（1145×1374）。
     裁三份（tools/doctor-photo-crop.mjs，裁切框寫在那一支的 FACES 裡）：
       sq   205,95,690,690    → 200        圓頭像
       wide 0,90,1145,763     → 400／800   卡片頂圖（3:2）
       tall 0,0,1145,1374     → 400／800   橫幅（5:6，整張沒裁）
     ⚠ 提案頁只出 JPEG，**沒有 WebP** —— 定案要上線時才跑 tools/webp.mjs
       並改成 <picture>＋<source type="image/webp">（站上照片的既定寫法）。

     ---- 還沒做、定案時要一起做的 -------------------------------------------
       ・JSON-LD：九位醫師的 Person 節點目前沒有 image 欄位，
         有圖之後要補（tools/schema.mjs 從 #doctors 讀，所以是加在那裡）。
       ・夜間模式：白袍在深底上很亮，這一頁可以直接開站上的日夜開關看。
       ・alt 文字：現在寫的是暫定值。

     ---- 切換條 -------------------------------------------------------------
     網址參數 ?dp=off|av|top|bn 、?ph=none|ini 、?sz=s|m|l
     ========================================================================== -->`;

/* ── ① 相對路徑往上兩層 ──────────────────────────────────────────────────
   ⚠ 不要改用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
html = html.replace(/(\s(?:src|href)=")(assets\/|posts\/|site\.webmanifest)/g, '$1../../$2');
html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) =>
  ' srcset="' + s.replace(/(^|,\s*)(assets\/)/g, '$1../../$2') + '"');

/* ── noindex（三道的第一道，另外兩道在 Worker 與 robots.txt）───────────── */
html = html.replace(
  /<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">\n' + NOTE);

/* ── ② 計數器：整支拿掉，窄帶的數字寫死 ─────────────────────────────────
   ⚠⚠ 底下那個數字是提案頁專用的示範值，**絕對不要跟著版型搬回正式站**
       （2026-08-07 踩過：示範值 8642 把真實的 190 蓋掉還不會動）。 */
html = html.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
html = html.replace(
  '<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on"><!-- ⚠ 提案頁的示範值，不要搬回正式站 -->');
html = html.replace(
  '<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">697</span>');
/* 文章卡的數字沒有 counter.js 就停在「—」，連前面那顆「・」一起收掉。 */
html = html.replace(/<span class="dot" aria-hidden="true">・<\/span>\s*<span class="views"[^>]*>[\s\S]*?<\/span>\s*<\/p>/g, '</p>');

/* ── 九張醫師卡各補一個 data-initial（尺二的字首圓章讀它）──────────────
   ⚠ 有兩張卡的 <article> 與 <h3> 之間夾著註解，所以中間要用 [\s\S]*?。
     守門：換到的張數一定要是 9，對不上就停 —— 少換一張的症狀是
     那一張的圓章空白，畫面不會報錯。 */
let initials = 0;
html = html.replace(
  /(<article class="doc") (data-spec="[a-z]+">[\s\S]*?<h3>)([^<]+)(<span class="doc-role">)/g,
  (m, a, mid, name, tail) => { initials++; return `${a} data-initial="${name.trim()[0]}" ${mid}${name}${tail}`; });
if (initials !== 9) throw new Error(`data-initial 只補到 ${initials} 張，預期 9 張`);

/* ── 李柄輝那張卡：掛 data-photo，把三份裁切塞在 <h3> 前面 ────────────
   三張同時在文件裡、由 CSS 決定顯示哪一張。只有一張卡，多載兩個檔
   （合計 47KB）換來切換不必等下載，值得。 */
const H3 = '<h3>李柄輝<span class="doc-role">創辦醫師</span></h3>';
if (html.split(H3).length !== 2) throw new Error('找不到（或找到不只一個）李柄輝的 <h3>');
const ALT = '李柄輝醫師的形象照，身著白袍站在診療室內';
html = html
  .replace('<article class="doc" data-initial="李" data-spec="general">',
           '<article class="doc" data-photo="li-binghui" data-initial="李" data-spec="general">')
  .replace(H3, `<img class="pv-face pv-sq" src="img/li-binghui-sq-200.jpg" width="200" height="200" alt="${ALT}">
          <img class="pv-face pv-wide" src="img/li-binghui-wide-400.jpg" srcset="img/li-binghui-wide-400.jpg 1x, img/li-binghui-wide-800.jpg 2x" width="400" height="267" alt="${ALT}">
          <img class="pv-face pv-tall" src="img/li-binghui-tall-400.jpg" srcset="img/li-binghui-tall-400.jpg 1x, img/li-binghui-tall-800.jpg 2x" width="400" height="480" alt="${ALT}">
          ${H3}`);

/* ── 四種放法的樣式 ──────────────────────────────────────────────────────
   ⚠⚠ 覆寫 :root 的變數不能寫 html —— :root 是虛擬類別（0,1,0），
       權重比 html（0,0,1）高，排在後面也贏不了。
   ⚠ 三張圖預設全部不顯示，所以 Ⓐ 現況和站上逐像素相同。 */
const RULERS = `
<style>
/* 尺三的三個值，一個 data-sz 餵三種放法各自的變數。 */
:root            { --pv-av: 64px;  --pv-top: 3/2; --pv-bn: 230px; }
:root[data-sz="s"] { --pv-av: 56px; --pv-top: 5/2; --pv-bn: 180px; }
:root[data-sz="l"] { --pv-av: 76px; --pv-top: 4/3; --pv-bn: 280px; }

.pv-face { display: none; }

/* ---- Ⓑ 圓頭像：名字左邊一顆圓，卡的高度不變 ---------------------------- */
:root[data-dp="av"] .doc[data-photo] {
  display: grid; grid-template-columns: var(--pv-av) 1fr;
  column-gap: .9rem; align-items: start;
}
:root[data-dp="av"] .doc[data-photo] .pv-sq {
  display: block; grid-column: 1; grid-row: 1;
  width: var(--pv-av); height: var(--pv-av);
  border-radius: 50%; object-fit: cover;
}
:root[data-dp="av"] .doc[data-photo] > h3 { grid-column: 2; grid-row: 1; align-self: center; }
:root[data-dp="av"] .doc[data-photo] > dl { grid-column: 1 / -1; grid-row: 2; }

/* 尺二 Ⓑ：其餘八張的字首圓章。::before 當 grid item 用。
   底是各自的科別色（--accent 掛在 [data-spec] 上），字用 --on-fill。 */
:root[data-dp="av"][data-ph="ini"] .doc:not([data-photo]) {
  display: grid; grid-template-columns: var(--pv-av) 1fr;
  column-gap: .9rem; align-items: start;
}
:root[data-dp="av"][data-ph="ini"] .doc:not([data-photo])::before {
  content: attr(data-initial); grid-column: 1; grid-row: 1;
  width: var(--pv-av); height: var(--pv-av); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: var(--on-fill);
  font-size: calc(var(--pv-av) * .42); font-weight: 500; line-height: 1;
}
:root[data-dp="av"][data-ph="ini"] .doc:not([data-photo]) > h3 { grid-column: 2; grid-row: 1; align-self: center; }
:root[data-dp="av"][data-ph="ini"] .doc:not([data-photo]) > dl { grid-column: 1 / -1; grid-row: 2; }

/* ---- Ⓒ 卡片頂圖：圖滿到卡的三個邊，靠 overflow 切圓角 ------------------ */
:root[data-dp="top"] .doc[data-photo] { padding-top: 0; overflow: hidden; }
:root[data-dp="top"] .doc[data-photo] .pv-wide {
  display: block; width: calc(100% + 2.4rem); height: auto;
  margin: 0 -1.2rem 1rem; aspect-ratio: var(--pv-top); object-fit: cover;
}
/* 尺二 Ⓑ：其餘八張的頂圖位置放一塊淡的科別色＋字首，撐住同一個高度。
   ⚠ 這一塊**刻意做得很淡**（12% 的科別色）。第一版做成滿版實心，
     八張飽和色塊把唯一那張真的照片整個壓過去 —— 那樣比出來的不是
     「頂圖好不好」，是「色塊吵不吵」，等於在替 Ⓒ 作弊。
   ⚠ color-mix 沒有的瀏覽器會整條 background 失效，所以前一行留一個
     --paper 的宣告當退路。 */
:root[data-dp="top"][data-ph="ini"] .doc:not([data-photo]) { padding-top: 0; overflow: hidden; }
:root[data-dp="top"][data-ph="ini"] .doc:not([data-photo])::before {
  content: attr(data-initial); display: flex; align-items: center; justify-content: center;
  width: calc(100% + 2.4rem); margin: 0 -1.2rem 1rem; aspect-ratio: var(--pv-top);
  background: var(--paper);
  background: color-mix(in srgb, var(--accent) 12%, var(--card));
  color: var(--accent-deep);
  font-size: 2rem; font-weight: 400; line-height: 1;
}

/* ---- Ⓓ 創辦醫師橫幅：跨整列，圖左文右 --------------------------------- */
:root[data-dp="bn"] .doc[data-photo] {
  grid-column: 1 / -1;
  display: grid; grid-template-columns: var(--pv-bn) 1fr;
  column-gap: 1.4rem; padding: 0; overflow: hidden;
}
:root[data-dp="bn"] .doc[data-photo] .pv-tall {
  display: block; grid-column: 1; grid-row: 1 / span 2;
  width: 100%; height: 100%; object-fit: cover; object-position: 50% 16%;
}
:root[data-dp="bn"] .doc[data-photo] > h3 { grid-column: 2; grid-row: 1; padding: 1.1rem 1.2rem 0 0; }
:root[data-dp="bn"] .doc[data-photo] > dl { grid-column: 2; grid-row: 2; padding: 0 1.2rem 1.2rem 0; align-content: start; }

/* 手機一欄：橫幅改成上下疊，圖換成 3:2 那一張（直式在窄螢幕會高得誇張）。
   ⚠⚠ 三個 grid-column **都要重設**，不能只改 grid-template-columns ——
       電腦版那三條把 h3／dl 釘在第二欄（grid-column: 2），只換欄定義的話它們還在
       第二欄，grid 會生出一條隱含的第二軌，圖那一軌被擠成 0px、整張圖不見。
       症狀是「手機版橫幅沒有圖」，而且**不會報錯**（2026-09-19 踩過）。 */
@media (max-width: 720px) {
  :root[data-dp="bn"] .doc[data-photo] { grid-template-columns: 1fr; column-gap: 0; }
  :root[data-dp="bn"] .doc[data-photo] .pv-tall { display: none; }
  :root[data-dp="bn"] .doc[data-photo] .pv-wide {
    display: block; grid-column: 1; grid-row: 1;
    width: 100%; height: auto; aspect-ratio: 3/2; object-fit: cover;
  }
  :root[data-dp="bn"] .doc[data-photo] > h3 { grid-column: 1; grid-row: 2; padding: 1.1rem 1.2rem 0; }
  :root[data-dp="bn"] .doc[data-photo] > dl { grid-column: 1; grid-row: 3; padding: 0 1.2rem 1.2rem; }
}
</style>`;

/* ── 切換條 ──────────────────────────────────────────────────────────────
   ⚠ 網址參數用明確的字串清單比對，不要用 [a-z]+ 那種正規式。 */
const BAR = `
<!-- ==========================================================================
     切換條（提案用）。定案之後連同 <html> 上的 data-dp / data-ph / data-sz
     與上面那整塊樣式一起刪掉。
     ========================================================================== -->
<style>
.pvbar, .pvbar * { box-sizing: border-box; }
.pvbar {
  position: fixed; z-index: 999; right: 12px; top: 12px;
  font: 400 13px/1.6 "PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
  color: #f2f0ee;
}
.pvbar-btn {
  display: flex; align-items: center; gap: .4em; margin-left: auto;
  padding: .5em .8em; min-height: 36px;
  background: rgba(20,18,16,.92); color: #f2f0ee;
  border: 1px solid rgba(255,255,255,.28); border-radius: 8px;
  font: inherit; font-weight: 700; letter-spacing: .05em; cursor: pointer;
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}
.pvbar-btn b { font-weight: 700; opacity: .8; }
.pvbar-panel {
  display: none; margin-top: 8px; width: min(340px, calc(100vw - 24px));
  /* ⚠ 用 svh 不用 vh —— iOS 的 vh 是工具列收起後的大視窗高度。 */
  flex-direction: column; max-height: calc(100svh - 68px);
  background: rgba(20,18,16,.95); border: 1px solid rgba(255,255,255,.22);
  border-radius: 10px; overflow: hidden;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 12px 34px rgba(0,0,0,.45);
}
.pvbar[data-open="1"] .pvbar-panel { display: flex; }
.pvbar-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px 0 8px; }
.pvbar-g { padding: 9px 11px 5px; font-size: 11px; letter-spacing: .1em; color: #8f8a84; }
.pvbar-g em { font-style: normal; color: #cfc9c2; letter-spacing: 0; }
.pvbar-row { display: flex; gap: 6px; padding: 0 9px 6px; }
.pvbar-row button {
  flex: 1 1 0; padding: .45em .2em; min-height: 42px;
  background: rgba(255,255,255,.07); color: #cfc9c2;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px;
  font: inherit; font-size: 12px; line-height: 1.35; cursor: pointer;
}
.pvbar-row button small { display: block; font-size: 10px; color: #8f8a84; }
.pvbar-row button:hover { background: rgba(255,255,255,.15); color: #f2f0ee; }
.pvbar-row button[aria-pressed="true"] {
  background: #6fb3a8; border-color: #6fb3a8; color: #14120f; font-weight: 700;
}
.pvbar-row button[aria-pressed="true"] small { color: rgba(20,18,15,.7); }
.pvbar-row.is-off { opacity: .38; }
.pvbar-foot {
  flex: 0 0 auto; padding: 8px 11px 10px; border-top: 1px solid rgba(255,255,255,.16);
  font-size: 11.5px; line-height: 1.8; color: #b8b2ab;
}
.pvbar-foot .m { display: flex; justify-content: space-between; gap: 8px; }
.pvbar-foot .m b { color: #f2f0ee; font-weight: 600; font-variant-numeric: tabular-nums; }
.pvbar-foot .m.good b { color: #8fd6a4; }
.pvbar-foot .m.bad  b { color: #ff9a9a; }
.pvbar-foot hr { border: 0; border-top: 1px solid rgba(255,255,255,.14); margin: 7px 0; }
.pvbar-note { color: #8f8a84; font-size: 11px; line-height: 1.7; }
.pvbar-note b { color: #cfc9c2; font-weight: 600; }
@media (max-width: 420px) { .pvbar { right: 8px; top: 8px; } .pvbar-panel { width: calc(100vw - 16px); } }
@media print { .pvbar { display: none; } }
</style>

<div class="pvbar" data-open="0">
  <button class="pvbar-btn" type="button" aria-expanded="false">醫師圖卡 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">放法　<em>圖擺在卡的哪裡</em></div>
      <div class="pvbar-row" data-k="dp">
        <button type="button" data-v="off">Ⓐ<small>現況</small></button>
        <button type="button" data-v="av">Ⓑ<small>圓頭像</small></button>
        <button type="button" data-v="top">Ⓒ<small>卡片頂圖</small></button>
        <button type="button" data-v="bn">Ⓓ<small>創辦橫幅</small></button>
      </div>
      <div class="pvbar-g">另外八位　<em>圖還沒到的那八張怎麼辦</em></div>
      <div class="pvbar-row" data-k="ph">
        <button type="button" data-v="none">Ⓐ<small>空著</small></button>
        <button type="button" data-v="ini">Ⓑ<small>字首圓章</small></button>
      </div>
      <div class="pvbar-g">份量　<em>圖佔多大</em></div>
      <div class="pvbar-row" data-k="sz">
        <button type="button" data-v="s">Ⓐ<small>小</small></button>
        <button type="button" data-v="m">Ⓑ<small>中</small></button>
        <button type="button" data-v="l">Ⓒ<small>大</small></button>
      </div>
    </div>
    <div class="pvbar-foot"></div>
  </div>
</div>

<script>
/* 切換條的行為。定案後連同上面那塊 HTML／CSS 與 <html> 的 data-* 一起刪掉。 */
(function () {
  var root = document.documentElement;
  var box  = document.querySelector('.pvbar');
  var btn  = box.querySelector('.pvbar-btn');
  var foot = box.querySelector('.pvbar-foot');
  var KEYS = { dp: ['off','av','top','bn'], ph: ['none','ini'], sz: ['s','m','l'] };
  var DEF  = { dp: 'off', ph: 'none', sz: 'm' };
  var LBL  = { off: '現況', av: '圓頭像', top: '卡片頂圖', bn: '創辦橫幅' };
  var st   = { dp: DEF.dp, ph: DEF.ph, sz: DEF.sz };

  var qs = new URLSearchParams(location.search);
  Object.keys(KEYS).forEach(function (k) {
    var v = qs.get(k);
    if (v !== null && KEYS[k].indexOf(v) >= 0) st[k] = v;
  });

  function apply() {
    Object.keys(KEYS).forEach(function (k) {
      root.setAttribute('data-' + k, st[k]);
      var row = box.querySelector('.pvbar-row[data-k="' + k + '"]');
      Array.prototype.forEach.call(row.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      });
    });
    /* 尺二在 Ⓐ 現況與 Ⓓ 橫幅底下沒有作用（那兩格的另外八張本來就不動），
       尺三在 Ⓐ 也沒有作用 —— 淡掉，不要讓人以為按了沒反應。 */
    box.querySelector('.pvbar-row[data-k="ph"]').classList.toggle('is-off', st.dp === 'off' || st.dp === 'bn');
    box.querySelector('.pvbar-row[data-k="sz"]').classList.toggle('is-off', st.dp === 'off');
    var q = new URLSearchParams();
    Object.keys(KEYS).forEach(function (k) { if (st[k] !== DEF[k]) q.set(k, st[k]); });
    history.replaceState(null, '', q.toString() ? '?' + q : location.pathname);
    btn.querySelector('b').textContent = LBL[st.dp];
    measure();
  }

  Object.keys(KEYS).forEach(function (k) {
    box.querySelector('.pvbar-row[data-k="' + k + '"]').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st[k] = b.dataset.v; apply();
    });
  });
  btn.addEventListener('click', function () {
    var o = box.dataset.open === '1' ? '0' : '1';
    box.dataset.open = o; btn.setAttribute('aria-expanded', o === '1');
    if (o === '1') measure();
  });

  /* ── 現場量測 ──────────────────────────────────────────────────────────
     這一頁真正要回答的三件事，面板直接給判斷、不只印數字：
       ① 有圖那張卡比旁邊高多少（三欄的 grid 會把整列拉到最高那張）
       ② 最後一列缺幾格（Ⓓ 抽掉一張之後 8 張排三欄是 3＋3＋2）
       ③ 圖在畫面上多大、原檔夠不夠這個尺寸的兩倍
     ⚠ 量的是**畫出來的東西**（getBoundingClientRect），不是 width 屬性。 */
  var SRC = { sq: 200, wide: 800, tall: 800 };   /* 各裁切最大的那一檔的寬 */
  function n(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function measure() {
    if (box.dataset.open !== '1') return;
    var grid = document.querySelector('.docs');
    var hero = grid && grid.querySelector('.doc[data-photo]');
    if (!hero) { foot.textContent = '（找不到醫師卡）'; return; }
    var all  = Array.prototype.slice.call(grid.querySelectorAll('.doc'));
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;

    /* 同一列的卡：用 offsetTop 分組。
       ⚠⚠ **不要比卡片的高度** —— grid 預設 align-items: stretch，同一列每一張
           一定一樣高，比出來永遠是 0（第一版就是這樣，量了等於沒量）。
           變高的是整列，代價落在**旁邊那張卡的字底下多出來的空白**。
           所以量的是「卡的下緣 − 最後一個元素的下緣 − 卡自己的下內距」。 */
    var others = all.filter(function (d) { return d !== hero; });
    var rowMates = others.filter(function (d) { return Math.abs(d.offsetTop - hero.offsetTop) < 4; });
    function slack(card) {
      var kids = card.children;
      var last = kids[kids.length - 1];
      if (!last) return 0;
      var padB = parseFloat(getComputedStyle(card).paddingBottom) || 0;
      return card.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom - padB;
    }
    var gap = rowMates.length ? Math.max.apply(null, rowMates.map(slack)) : 0;

    /* 最後一列缺幾格 */
    var spanning = st.dp === 'bn';
    var inGrid = spanning ? others.length : all.length;
    var short = (cols - (inGrid % cols)) % cols;

    /* 現在顯示的是哪一張圖 */
    var shown = null, kind = '';
    ['sq','wide','tall'].forEach(function (k) {
      var el = hero.querySelector('.pv-' + k);
      if (el && getComputedStyle(el).display !== 'none') { shown = el; kind = k; }
    });
    var over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    var dark = root.getAttribute('data-theme') === 'dark'
      || (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);

    var rows = '';
    rows += '<div class="m"><span>視窗寬</span><b>' + window.innerWidth + '</b></div>';
    rows += '<div class="m"><span>醫師卡欄數</span><b>' + cols + '</b></div>';
    if (shown) {
      var r = shown.getBoundingClientRect();
      var need = Math.round(r.width * (window.devicePixelRatio || 1));
      var ok = SRC[kind] >= need;
      rows += '<div class="m"><span>圖的實際大小</span><b>' + n(r.width) + ' × ' + n(r.height) + '</b></div>';
      rows += '<div class="m ' + (ok ? 'good' : 'bad') + '"><span>原檔夠不夠（需 ' + need + '）</span><b>' + SRC[kind] + (ok ? ' 夠' : ' 不夠') + '</b></div>';
    } else {
      rows += '<div class="m"><span>圖</span><b>沒有顯示</b></div>';
    }
    if (cols > 1 && rowMates.length) {
      /* 門檻是拿 Ⓐ 現況量出來的 53px 當基準訂的（各人資歷行數不同，本來就空一點）。 */
      rows += '<div class="m ' + (gap < 70 ? 'good' : (gap > 180 ? 'bad' : '')) + '">' +
        '<span>旁邊卡底下空白</span><b>' + n(gap) + '</b></div>';
      rows += '<div class="pvbar-note">同一列每一張一定一樣高（grid 會拉齊），' +
        '所以代價不是「這張變高」，是<b>旁邊那 ' + rowMates.length + ' 張字底下多出 ' + n(gap) + 'px 的空白</b>。' +
        '基準：Ⓐ 現況本來就有一點（各人的資歷行數不一樣）。</div>';
    }
    rows += '<div class="m ' + (short ? '' : 'good') + '"><span>最後一列缺</span><b>' + (short ? short + ' 格' : '沒缺') + '</b></div>';
    /* Ⓓ 橫幅最大的弱點：這張卡跨整列，但李柄輝醫師的字只有三欄那麼多，
       右邊會空一大片。量「最長那一行的右緣」到「卡的右緣」，不要目測。 */
    if (st.dp === 'bn' && cols > 1) {
      var right = hero.getBoundingClientRect().right;
      var far = 0;
      Array.prototype.forEach.call(hero.querySelectorAll('dd'), function (el) {
        /* dd 是區塊、寬度等於整欄，量它等於量欄寬 —— 要用 Range 量真的墨。 */
        var rg = document.createRange(); rg.selectNodeContents(el);
        Array.prototype.forEach.call(rg.getClientRects(), function (r) { far = Math.max(far, r.right); });
      });
      var blank = far ? right - far : 0;
      rows += '<div class="m ' + (blank > 260 ? 'bad' : (blank > 160 ? '' : 'good')) + '">' +
        '<span>右邊空白</span><b>' + n(blank) + '</b></div>';
      rows += '<div class="pvbar-note">字最長那一行的右緣到卡的右緣。' +
        '跨整列之後字沒有跟著變多，空白會很明顯 —— 把「份量」調大可以吃掉一部分。</div>';
    }
    rows += '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>';
    rows += '<div class="m"><span>現在是</span><b>' + (dark ? '夜間' : '白天') + '</b></div>';
    rows += '<hr>';
    rows += '<div class="pvbar-note">' + ({
      off: '<b>Ⓐ 現況</b>：九張都沒有圖，和正式站一模一樣，拿來比對用的。',
      av:  '<b>Ⓑ 圓頭像</b>：卡的高度幾乎不變、背景也幾乎看不到（裁得最緊）。' +
           '代價是九張要湊齊才不奇怪 —— 把「另外八位」切到 Ⓑ 看看撐得住嗎。',
      top: '<b>Ⓒ 卡片頂圖</b>：份量最重，代價也最貴 —— 1440 上同一列另外兩張' +
           '字底下會空 <b>285px</b>（Ⓐ 現況是 53）。而且圖裡的診間' +
           '<b>不是芳仁的診間</b>（往下捲就是兩張真的診間照）。',
      bn:  '<b>Ⓓ 創辦橫幅</b>：其餘八張原封不動，' +
           '<b>只有一張圖的時候唯一不必解釋「為什麼別人沒有」的放法</b>。' +
           '代價在上面那一行：八張排三欄，最後一列缺一格。'
    })[st.dp] + '</div>';
    foot.innerHTML = rows;
  }
  addEventListener('resize', measure);
  /* 站上的日夜開關換的是 <html data-theme>，面板要跟著重算。 */
  new MutationObserver(measure).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  apply();
})();
</script>
`;

/* ── ③ 切換條插在**最後一個** </body> 前面 ──────────────────────────────
   ⚠ 這一站的註解裡就寫著那幾個字（.nav-lamp 那一段），
     用 String.replace('</body>', …) 會換到註解裡那一個。 */
const i = html.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
html = html.slice(0, i) + RULERS + BAR + '\n' + html.slice(i);

mkdirSync(DIR, { recursive: true });
writeFileSync(OUT, html);
console.log('寫好 preview/doctor-photo/index.html（' + (html.length / 1024).toFixed(0) + ' KB）');
