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

/* 圖檔要先在（不在的話整頁會是破圖，而這一頁要判斷的正是圖）。
   ⚠ 守門放在最前面：缺圖的時候要在寫檔之前就停，不要產出一頁破圖。 */
const NEED = ['li-binghui', 'li-youjin'];
NEED.forEach((slug) => ['sq-400', 'wide-400', 'wide-800', 'tall-400', 'tall-800'].forEach((k) => {
  const f = `${slug}-${k}.jpg`;
  if (!existsSync(join(DIR, 'img', f)))
    throw new Error(`找不到 img/${f} —— 先跑 node tools/doctor-photo-crop.mjs`);
}));

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

     ==== 第二輪（同日）：使用者選了「Ⓑ 圓頭像 ＋ 大」====================

     回報：「頭像和圖卡文字排版有點擠在一起、雜亂的感覺。」
     在 375 寬量出三件事 —— **前兩件是缺陷，直接修掉，沒有放上切換條**：

       ① 頭像下緣到「專長」那一列 ＝ **0px**（沒有頭像時是 11.2px）
          h3 的 margin-bottom 被 76px 的頭像整個吃掉。
          → h3 下邊距歸零，距離交給 grid 的 row-gap，和頭像大小脫鉤。
       ② 名字的墨比頭像中心高 **5.98px**
          align-self: center 對的是盒子（含那 11.2px），眼睛讀的是墨。
          → ① 修完順手歸零（實測 −0.39）。
       ③ 資料左緣比名字左緣往左 90px，視線要折回去 —— **這件是選擇**，
          做成尺一的三格。

     另外，面板當場印出紅字「原檔 200 不夠（需 228）」：76px × 他手機的
     DPR 3。圓頭像的裁切因此從 200 改成 **400**（份量加到 88 也蓋得住）。

     ---- 尺一：排法（375 / 1440 實測）--------------------------------------
       Ⓐ 資料全寬  資料欄 244／281，最長那一欄 4 行。卡最矮。
                    代價：視線往右看名字、再折回最左讀資料。
       Ⓑ 跟著縮排  資料對齊名字左緣，視線不折返。
                    **手機代價很重**：資料欄 244 → 154、最長那一欄 4 → 7 行。
                    電腦版三欄撐得住（189，仍是 4 行）。
       Ⓒ 上下疊    頭像在上、名字在下，全部靠左。資料欄和 Ⓐ 一樣寬、
                    也是 4 行，視線一路往下，但每張卡高 **+85px**（九張 ≈ 760）。

     ---- 尺二：留白 8／12／18（頭像下緣到「專長」）--------------------------
     中間那格 12 最接近現況（沒有頭像時名字到專長是 11.2）。

     ---- 尺三：份量 64／76／88（重新定階，他選的 76 收進中間那一格）--------

     ---- 已定案、從切換條上收掉的兩條（網址參數仍然吃得到）-----------------
       ?dp=off|av|top|bn   放法（定案 av）
       ?ph=none|ini        另外八位（目前 none）
     做法同 head-search 與 night-map-park 那兩輪，切換條不會愈長愈長。

     ==== 第三輪（同日）：第二張圖進來 =======================================

     使用者：「照這樣」（＝ Ⓐ 資料全寬／留白 12／份量 76 定下來了），
     並給了**李侑津醫師**的形象照（1086×1448，3:4）。

     ⚠⚠ 產生器因此從「寫死一位」改成吃一份 DOCTORS 清單。第一版想拿
       data-initial="李" 當錨點 —— **九位裡面姓李的有兩位**
       （李柄輝 general、李侑津 perio），會把圖掛到錯的那一張，
       而且畫面完全正常，只是圖長在別人身上。改成用完整的 <h3>
       （名字＋藥丸文字，全站唯一）定位、再往回找最近的 <article>，
       末尾加一道「掛上去的張數 ＝ 清單長度」的守門。

     ⚠⚠ **兩張要看起來像同一組，裁切框不能各裁各的。** 先在原圖上量
       髮頂／眼睛／下巴／臉中線，換算成李柄輝那張的比例（眼睛在框高
       44.2%、臉中線在框寬 49.3%、頭高佔 63%）：
         李柄輝 1145×1374：髮頂 175、眼睛 400、下巴 610、臉中線 545
         李侑津 1086×1448：髮頂 290、眼睛 520、下巴 700、臉中線 540
       ⚠ 兩人的頭寬高比不一樣（李侑津的臉窄），照**頭高**算出來的框
         （651）會讓他在圓裡看起來比較小，照**頭寬**算（591）才對得上。
         最後是把 590／625／640 三個圓和李柄輝並排比出來的 —— 625 與 640
         的臉都偏左。定案 sq = 244,255,590,590。

     ⚠ 兩張圖的**背景色溫差很多**（李柄輝冷灰診間、李侑津暖木走廊），
       圓頭像裁得緊所以影響小，但九張到齊時要整組再看一次。
       另外李侑津那張的背景**看起來像診所真實的空間**（木地板、白牆、
       點狀霧面玻璃），和站上那兩張診間照對得上；李柄輝那張不是
       —— 見上面第一輪的第 ③ 點。

     ⚠ Ⓓ 橫幅那一格的理由（「創辦醫師本來就不同級」）**有兩張圖之後
       就不成立了** —— 它現在會變成兩條橫幅。那一格仍然在
       （?dp=bn），但不要再拿第一輪那句話去說服自己。

     ---- 切換條 -------------------------------------------------------------
     網址參數 ?al=full|indent|stack 、?gp=s|m|l 、?sz=s|m|l
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

/* ── 有圖的那幾張卡：掛 data-photo，把三份裁切塞在 <h3> 前面 ────────────
   三張同時在文件裡、由 CSS 決定顯示哪一張。一位多載兩個檔（約 50KB）
   換來切換不必等下載，值得 —— 提案頁是 no-store，本來每次都要重抓。

   ⚠⚠ **不可以拿 `<article class="doc" data-initial="X"` 當錨點** ——
       九位裡面姓李的有兩位（李柄輝 general、李侑津 perio），
       字首一樣的錨點會換到錯的那一張，而且畫面上看起來完全正常
       （只是圖長在別人身上）。做法改成：先用**完整的 <h3>**（名字＋
       藥丸文字，全站唯一）定位，再往回找**離它最近的**那個 <article>。
   ⚠ 圖要插在 <h3> 前面而不是 <article> 後面 —— 有兩張卡的
     <article> 與 <h3> 之間夾著一段註解，插在 <article> 後面會讓
     註解跑到圖的後面，grid 的列序跟著亂掉。 */
const DOCTORS = [
  { slug: 'li-binghui', name: '李柄輝', role: '創辦醫師',
    alt: '李柄輝醫師的形象照，身著白袍站在診療室內' },
  { slug: 'li-youjin',  name: '李侑津', role: '醫師',
    alt: '李侑津醫師的形象照，身著診療服站在診所走廊' },
];
const TAG = '<article class="doc"';
DOCTORS.forEach((d) => {
  const h3 = `<h3>${d.name}<span class="doc-role">${d.role}</span></h3>`;
  if (html.split(h3).length !== 2) throw new Error(`找不到（或找到不只一個）${d.name} 的 <h3>`);
  const at  = html.indexOf(h3);
  const art = html.lastIndexOf(TAG, at);
  if (art < 0) throw new Error(`${d.name} 的 <h3> 前面找不到 <article>`);
  html = html.slice(0, art) + `${TAG} data-photo="${d.slug}"` + html.slice(art + TAG.length);
  html = html.replace(h3, `<img class="pv-face pv-sq" src="img/${d.slug}-sq-400.jpg" width="400" height="400" alt="${d.alt}">
          <img class="pv-face pv-wide" src="img/${d.slug}-wide-400.jpg" srcset="img/${d.slug}-wide-400.jpg 1x, img/${d.slug}-wide-800.jpg 2x" width="400" height="267" alt="${d.alt}">
          <img class="pv-face pv-tall" src="img/${d.slug}-tall-400.jpg" srcset="img/${d.slug}-tall-400.jpg 1x, img/${d.slug}-tall-800.jpg 2x" width="400" height="480" alt="${d.alt}">
          ${h3}`);
});
/* 守門：掛上去的張數要等於清單長度（換到錯的卡、或名字改過都會在這裡停）。 */
const got = (html.match(/<article class="doc" data-photo=/g) || []).length;
if (got !== DOCTORS.length) throw new Error(`data-photo 掛了 ${got} 張，預期 ${DOCTORS.length} 張`);

/* ── 四種放法的樣式 ──────────────────────────────────────────────────────
   ⚠⚠ 覆寫 :root 的變數不能寫 html —— :root 是虛擬類別（0,1,0），
       權重比 html（0,0,1）高，排在後面也贏不了。
   ⚠ 三張圖預設全部不顯示，所以 Ⓐ 現況和站上逐像素相同。 */
const RULERS = `
<style>
/* 尺三的三個值，一個 data-sz 餵三種放法各自的變數。 */
/* 份量：2026-09-19 第二輪重新定階 —— 使用者在第一輪選了當時的「大」76px，
   所以把 76 收成中間那一格，上下各再給一格（64／76／88）。
   留白 ＝ 頭像下緣到「專長」那一列的距離，中間那格 12 最接近現況
   （沒有頭像時名字到專長是 11.2px）。 */
:root               { --pv-av: 76px; --pv-gap: 12px; --pv-top: 3/2; --pv-bn: 230px; }
:root[data-sz="s"]  { --pv-av: 64px; --pv-top: 5/2; --pv-bn: 180px; }
:root[data-sz="l"]  { --pv-av: 88px; --pv-top: 4/3; --pv-bn: 280px; }
:root[data-gp="s"]  { --pv-gap: 8px; }
:root[data-gp="l"]  { --pv-gap: 18px; }

.pv-face { display: none; }

/* ---- Ⓑ 圓頭像 ----------------------------------------------------------
   2026-09-19 第二輪：使用者選了圓頭像＋大，回報「頭像和圖卡文字排版有點擠
   在一起、雜亂」。在 375 寬量出三件事，前兩件是缺陷、第三件才是選擇：

     ① 頭像下緣到「專長」那一列 ＝ **0px**
        h3 的 margin-bottom（11.2px）整個被 76px 的頭像吃掉了 —— 那一列的
        高度由頭像決定，h3 連同下邊距只有 41px，全部落在列裡面。
        沒有頭像時，名字到專長本來有 11.2px。
        → 修法：h3 的下邊距歸零，改由 grid 的 row-gap（--pv-gap）負責，
          這樣不論頭像多大、名字折幾行，那段距離都是同一個值。
     ② 名字的墨比頭像中心高 **5.98px**
        align-self: center 對齊的是 h3 那個**盒子**（含 11.2px 下邊距），
        眼睛讀的是墨 —— CLAUDE.md 第九節第 5 條那個坑。
        → ① 的「下邊距歸零」順手把這件事一起修掉（11.2 ÷ 2 ≒ 5.6）。
     ③ 文字左緣和名字左緣差 14.4px
        名字在頭像右邊，專長／資歷／學歷卻從卡的最左邊重新開始，
        視線「往右看名字、再折回最左讀資料」。**這一件是選擇不是缺陷**，
        所以做成尺一的三格。

   ⚠ 三種排法對「另外八位」的字首圓章要一模一樣，否則切到 ?ph=ini
     會看到九張卡用兩套排版。底下每一條都寫成兩個選擇器並列。 */

:root[data-dp="av"] .doc[data-photo],
:root[data-dp="av"][data-ph="ini"] .doc {
  display: grid; grid-template-columns: var(--pv-av) 1fr;
  column-gap: .9rem; row-gap: var(--pv-gap); align-items: start;
}
:root[data-dp="av"] .doc[data-photo] .pv-sq {
  display: block; grid-column: 1; grid-row: 1;
  width: var(--pv-av); height: var(--pv-av);
  border-radius: 50%; object-fit: cover;
}
/* 其餘八張的字首圓章。::before 當 grid item 用；
   底是各自的科別色（--accent 掛在 [data-spec] 上），字用 --on-fill。 */
:root[data-dp="av"][data-ph="ini"] .doc:not([data-photo])::before {
  content: attr(data-initial); grid-column: 1; grid-row: 1;
  width: var(--pv-av); height: var(--pv-av); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: var(--on-fill);
  font-size: calc(var(--pv-av) * .42); font-weight: 500; line-height: 1;
}
/* ⚠ margin-bottom 一定要歸零 —— 見上面 ① ②，那 11.2px 同時造成
     「貼著專長」與「名字偏高」兩個症狀。距離一律交給 row-gap。 */
:root[data-dp="av"] .doc[data-photo] > h3,
:root[data-dp="av"][data-ph="ini"] .doc > h3 {
  grid-column: 2; grid-row: 1; align-self: center; margin-bottom: 0;
}
:root[data-dp="av"] .doc[data-photo] > dl,
:root[data-dp="av"][data-ph="ini"] .doc > dl { grid-column: 1 / -1; grid-row: 2; }

/* 尺一 Ⓑ 跟著縮排：資料欄改對齊名字的左緣，視線不折回去。
   代價是文字欄窄掉一個頭像＋間距（面板會印出窄多少、最長那一句折幾行）。 */
:root[data-dp="av"][data-al="indent"] .doc[data-photo] > dl,
:root[data-dp="av"][data-al="indent"][data-ph="ini"] .doc > dl { grid-column: 2; }

/* 尺一 Ⓒ 上下疊：頭像在上、名字在下，全部靠左，視線一路往下不折返。
   ⚠ 這一格 row-gap 要關掉（三列各自的距離不一樣），改用各自的 margin。 */
:root[data-dp="av"][data-al="stack"] .doc[data-photo],
:root[data-dp="av"][data-al="stack"][data-ph="ini"] .doc {
  grid-template-columns: 1fr; row-gap: 0;
}
:root[data-dp="av"][data-al="stack"] .doc[data-photo] > h3,
:root[data-dp="av"][data-al="stack"][data-ph="ini"] .doc > h3 {
  grid-column: 1; grid-row: 2; align-self: start; margin: .55rem 0 0;
}
:root[data-dp="av"][data-al="stack"] .doc[data-photo] > dl,
:root[data-dp="av"][data-al="stack"][data-ph="ini"] .doc > dl {
  grid-column: 1; grid-row: 3; margin-top: var(--pv-gap);
}

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
  <button class="pvbar-btn" type="button" aria-expanded="false">圓頭像 <b></b></button>
  <div class="pvbar-panel">
    <div class="pvbar-body">
      <div class="pvbar-g">排法　<em>名字和資料怎麼排</em></div>
      <div class="pvbar-row" data-k="al">
        <button type="button" data-v="full">Ⓐ<small>資料全寬</small></button>
        <button type="button" data-v="indent">Ⓑ<small>跟著縮排</small></button>
        <button type="button" data-v="stack">Ⓒ<small>上下疊</small></button>
      </div>
      <div class="pvbar-g">留白　<em>頭像下緣到「專長」</em></div>
      <div class="pvbar-row" data-k="gp">
        <button type="button" data-v="s">Ⓐ<small>8</small></button>
        <button type="button" data-v="m">Ⓑ<small>12</small></button>
        <button type="button" data-v="l">Ⓒ<small>18</small></button>
      </div>
      <div class="pvbar-g">份量　<em>頭像直徑</em></div>
      <div class="pvbar-row" data-k="sz">
        <button type="button" data-v="s">Ⓐ<small>64</small></button>
        <button type="button" data-v="m">Ⓑ<small>76</small></button>
        <button type="button" data-v="l">Ⓒ<small>88</small></button>
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
  /* ⚠ 已定案的那兩條尺（放法 dp、另外八位 ph）2026-09-19 從切換條上收掉了
     —— 使用者選了「圓頭像＋大」。**網址參數仍然吃得到**（?dp=off|av|top|bn、
     ?ph=none|ini），要回去看落選的三案或八張圓章直接改網址，不必重開一頁。
     做法同 head-search 與 night-map-park 那兩輪：已定案的收成預設值、
     新的尺接上去，切換條不會愈長愈長。 */
  var KEYS = { dp: ['off','av','top','bn'], ph: ['none','ini'],
               al: ['full','indent','stack'], gp: ['s','m','l'], sz: ['s','m','l'] };
  var DEF  = { dp: 'av', ph: 'none', al: 'full', gp: 'm', sz: 'm' };
  var BARK = ['al','gp','sz'];   /* 切換條上看得到的三條 */
  var LBL  = { full: '全寬', indent: '縮排', stack: '上下疊' };
  var st   = {};
  Object.keys(KEYS).forEach(function (k) { st[k] = DEF[k]; });

  var qs = new URLSearchParams(location.search);
  Object.keys(KEYS).forEach(function (k) {
    var v = qs.get(k);
    if (v !== null && KEYS[k].indexOf(v) >= 0) st[k] = v;
  });

  function apply() {
    Object.keys(KEYS).forEach(function (k) { root.setAttribute('data-' + k, st[k]); });
    BARK.forEach(function (k) {
      var row = box.querySelector('.pvbar-row[data-k="' + k + '"]');
      Array.prototype.forEach.call(row.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === st[k]));
      });
    });
    /* 三條尺都只對圓頭像有作用 —— 用 ?dp= 切到別的放法時淡掉，
       不要讓人以為按了沒反應。 */
    BARK.forEach(function (k) {
      box.querySelector('.pvbar-row[data-k="' + k + '"]').classList.toggle('is-off', st.dp !== 'av');
    });
    var q = new URLSearchParams();
    Object.keys(KEYS).forEach(function (k) { if (st[k] !== DEF[k]) q.set(k, st[k]); });
    history.replaceState(null, '', q.toString() ? '?' + q : location.pathname);
    btn.querySelector('b').textContent = st.dp === 'av' ? LBL[st.al] + '　' + getComputedStyle(root).getPropertyValue('--pv-av').trim() : '?dp=' + st.dp;
    measure();
  }

  BARK.forEach(function (k) {
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
  var SRC = { sq: 400, wide: 800, tall: 800 };   /* 各裁切最大的那一檔的寬 */
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
    var withPic = all.filter(function (d) { return d.hasAttribute('data-photo'); }).length;
    var noPic   = all.length - withPic;
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
    /* ── 圓頭像那三個數字（2026-09-19 第二輪使用者回報「擠、雜亂」的成因）──
       ⚠ 全部量**畫出來的墨**，不是盒子、也不是屬性：
         ・名字要用 Range 框住那個文字節點 —— 量 h3 的盒子會連下邊距一起算，
           那正是第一版偏高 5.98px 的原因。
         ・折幾行要把 Range 的 rect 照 top 分組，直接數 rect 會誤判
           （CLAUDE.md 第九節第 2 條那個近親）。 */
    function inkRect(el) {
      var t = el.firstChild;
      if (!t || t.nodeType !== 3) return null;
      var rg = document.createRange(); rg.setStart(t, 0); rg.setEnd(t, t.length);
      var r = rg.getBoundingClientRect();
      return r.width ? r : null;
    }
    function lineCount(el) {
      var rg = document.createRange(); rg.selectNodeContents(el);
      var tops = [];
      Array.prototype.forEach.call(rg.getClientRects(), function (r) {
        if (r.width < .5 && r.height < .5) return;
        for (var i = 0; i < tops.length; i++) if (Math.abs(tops[i] - r.top) < 3) return;
        tops.push(r.top);
      });
      return tops.length;
    }
    var avRows = '';
    if (st.dp === 'av') {
      var face = hero.querySelector('.pv-sq');
      var h3   = hero.querySelector('h3');
      var dlEl = hero.querySelector('dl');
      var fr = face.getBoundingClientRect();
      var ink = inkRect(h3);
      /* ⚠ Ⓒ 上下疊時，頭像和名字**不在同一列**，所以「對中心」那一項沒有
           意義（會印出 +61 這種嚇人的數字），而「頭像下緣到專長」中間還隔著
           一整行名字。那一格改量「名字下緣到專長」，並把對中心那一行拿掉。 */
      var above = st.al === 'stack' ? (ink || h3.getBoundingClientRect()) : fr;
      var below = dlEl.getBoundingClientRect().top - above.bottom;
      avRows += '<div class="m ' + (below >= 7 ? 'good' : 'bad') + '">' +
        '<span>' + (st.al === 'stack' ? '名字下緣到「專長」' : '頭像下緣到「專長」') + '</span><b>' + n(below) + '</b></div>';
      if (ink && st.al !== 'stack') {
        var off = (ink.top + ink.bottom) / 2 - (fr.top + fr.bottom) / 2;
        avRows += '<div class="m ' + (Math.abs(off) <= 1.5 ? 'good' : 'bad') + '">' +
          '<span>名字的墨對頭像中心</span><b>' + (off > 0 ? '+' : '') + n(off) + '</b></div>';
      }
      if (ink) {
        avRows += '<div class="m ' + (st.al === 'full' ? '' : 'good') + '">' +
          '<span>資料左緣對名字左緣</span><b>' + n(dlEl.getBoundingClientRect().left - ink.left) + '</b></div>';
      }
      if (st.al === 'stack') {
        avRows += '<div class="m"><span>卡比 Ⓐ 高</span><b>+' +
          n(fr.height + parseFloat(getComputedStyle(h3).marginTop)) + '</b></div>';
      }
      /* 縮排那一格的代價：資料欄窄掉多少、最長那一句變幾行。 */
      var dds = hero.querySelectorAll('dd');
      var maxLines = 0, ddW = 0;
      Array.prototype.forEach.call(dds, function (el) {
        maxLines = Math.max(maxLines, lineCount(el));
        ddW = Math.max(ddW, el.getBoundingClientRect().width);
      });
      avRows += '<div class="m"><span>資料欄寬</span><b>' + n(ddW) + '</b></div>';
      avRows += '<div class="m ' + (maxLines > 4 ? 'bad' : '') + '">' +
        '<span>最長那一欄折</span><b>' + maxLines + ' 行</b></div>';
    }
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
    rows += avRows;
    rows += '<div class="m ' + (over > 0 ? 'bad' : 'good') + '"><span>水平捲動</span><b>' + (over > 0 ? over + 'px' : '無') + '</b></div>';
    rows += '<div class="m"><span>現在是</span><b>' + (dark ? '夜間' : '白天') + '</b></div>';
    rows += '<hr>';
    rows += '<div class="pvbar-note">' + (st.dp === 'av' ? ({
      full:   '<b>Ⓐ 資料全寬</b>：名字在頭像右邊，專長／資歷／學歷仍從卡的最左邊開始。' +
              '文字欄最寬，代價是視線「往右看名字、再折回最左讀資料」。',
      indent: '<b>Ⓑ 跟著縮排</b>：資料改對齊名字的左緣，整張卡變成乾淨的兩欄、' +
              '視線不折返。<b>代價在手機上很重</b> —— 資料欄從 244 掉到 154、' +
              '最長那一欄從 4 行變 7 行。電腦版三欄比較撐得住（見上面的實測）。',
      stack:  '<b>Ⓒ 上下疊</b>：頭像在上、名字在下，全部靠左，一路往下讀。' +
              '最不會亂，但卡會長高一個頭像。'
    })[st.al] + '<br>目前 <b>' + withPic + ' 位有圖、' + noPic + ' 位還沒有</b>。' +
       '<br>⚠ 這三條尺只管圓頭像。要回去看落選的三案用網址：' +
       '<b>?dp=off</b>（現況）<b>?dp=top</b>（卡片頂圖）<b>?dp=bn</b>（橫幅）；' +
       '沒有圖的那幾張補字首圓章是 <b>?ph=ini</b>。' : ({
      off: '<b>Ⓐ 現況</b>：九張都沒有圖，和正式站一模一樣，拿來比對用的。',
      top: '<b>Ⓒ 卡片頂圖</b>：份量最重，代價也最貴 —— 1440 上同一列另外兩張' +
           '字底下會空 <b>285px</b>（Ⓐ 現況是 53）。而且圖裡的診間' +
           '<b>不是芳仁的診間</b>（往下捲就是兩張真的診間照）。',
      bn:  '<b>Ⓓ 橫幅</b>：有圖的那幾張跨整列、其餘原封不動。' +
           '⚠ 這一格是<b>一張圖</b>的時候提的（創辦醫師本來就不同級）；' +
           '有兩張之後會變成兩條橫幅，理由就不成立了。'
    })[st.dp]) + '</div>';
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
