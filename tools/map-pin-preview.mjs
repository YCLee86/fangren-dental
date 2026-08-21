/* ==========================================================================
   tools/map-pin-preview.mjs　—— 產生 preview/clinic-map-pin/index.html
   --------------------------------------------------------------------------
   提案：診所在地圖上改用「圖釘 ＋ 綠塊寫字」標示（2026-08-21 開）。
   跑法：node tools/map-pin-preview.mjs　（在 repo 根目錄）

   ⚠ 產出的那一頁是 index.html 的**快照** —— 另一台推東西上 main、或這一頁的
     index.html 被改過之後，要**重跑一次**，不然使用者在提案頁上看到的
     「對照現況」不等於正式站（CLAUDE.md 第八節記過這一條）。
   ⚠ 定案上線之後：把選上的那一案搬進 index.html，然後把 preview/clinic-map-pin/
     **和這支產生器一起刪掉**，推導文字搬進 history/clinic-map-pin.html。
   ⚠ 這支是模板字串，裡面的註解**不可以出現反引號**（會提早關掉樣板，
     整支語法錯誤）—— 所以底下一律用 「」。
   ========================================================================== */
import fs from 'node:fs';

const SRC = 'index.html';
const OUT = 'preview/clinic-map-pin/index.html';
let h = fs.readFileSync(SRC, 'utf8');

/* ---- 1. 相對路徑往上兩層（提案頁在 /preview/<name>/） --------------------- */
h = h.replace(/(["'\s(])assets\//g, '$1../../assets/');
h = h.replace(/href="posts\//g, 'href="/posts/');
h = h.replace(/href="\.\/"/g, 'href="/"');
h = h.replace(/href="site\.webmanifest[^"]*"/g, 'href="/site.webmanifest"');

/* ---- 2. 計數器整支拿掉（不然每開一次提案頁，首頁的計數就多一次） --------- */
h = h.replace(/\n<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/,
  '\n<!-- 提案頁：assets/counter.js 整支拿掉（CLAUDE.md 第八節）。 -->');
h = h.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on"><!-- 提案頁：寫死 ＋ 手動加 .is-on。這個數字絕對不要跟著版型搬回正式站 -->');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">—</span>');
/* ⚠ 這兩道要在**剝掉註解之後**驗 —— 站上的註解裡就寫著 data-views-self
   與 counter.js 那幾個字（那是在講它們為什麼不能寫錯），照字面 grep 一定誤報。 */
const bare = h.replace(/<!--[\s\S]*?-->/g, '');
if (/data-views-self/.test(bare)) throw new Error('data-views-self 還在');
/* ⚠ 只驗有沒有真的載進來 —— 站上那段往上數的 JS 註解裡也寫著 counter.js。 */
if (/src="[^"]*counter\.js"/.test(bare)) throw new Error('counter.js 還在');

/* ---- 3. noindex ---------------------------------------------------------- */
h = h.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<meta name="robots" content="noindex, nofollow, noarchive">');
h = h.replace(/<link rel="canonical"[^>]*>\n/, '');
h = h.replace('<title>芳仁牙醫診所｜雲林斗六・永樂街</title>',
  '<title>提案：診所改用圖釘標示｜芳仁牙醫</title>');

/* ---- 4. 地圖：新的標記（圖釘 ＋ 綠塊寫字）疊在現況旁邊 -------------------- */
/* 標誌的路徑直接從 index.html 那個綠塊裡抄出來 —— 不留第二份
   （同 tools/logo-png.mjs 的做法：形狀只有一個出處）。 */
const mLogo = /<g class="mark">[\s\S]*?<path fill="var\(--card\)" fill-rule="evenodd" d="([^"]+)"/.exec(h);
if (!mLogo) throw new Error('找不到綠塊裡那顆標誌的路徑');
const LOGO = mLogo[1];

const anchor = '                    </a>\n                  </g>\n                </g>\n';
const iA = h.indexOf('<!-- 診所。貼在永樂街');
const iB = h.indexOf(anchor, iA);
if (iA < 0 || iB < 0) throw new Error('找不到診所標記那一段');
if (h.indexOf(anchor, iB + 1) >= 0) throw new Error('收尾那一段不唯一');

const NEW = `<!-- ⚠⚠ 提案（2026-08-21）：**現況與新案兩組標記同時放在圖上**，
                     由切換條用 opacity 決定看哪一組 —— 不用 display:none，
                     因為站上那支 sizeLabels() 是靠 getBBox() 量牌子的大小，
                     display:none 量出來全是 0，切回現況時對話框會塌掉。
                     ・現況 ＝ 下面 .mark（綠塊裡放標誌）＋ .clab（綠底白字的對話框）
                     ・新案 ＝ .cmark（綠塊裡寫「芳仁牙醫」）＋ .cm-pin（圖釘，圈裡放標誌）
                     定案時把沒選上的那一組連同這段註解一起刪掉。 -->

                <!-- 診所（現況）。貼在永樂街與平和街19巷那一角的橫長方形。 -->
                <g class="mark">
                  <path d="M228 236H320A4 4 0 0 1 324 240V287H228Z" fill="var(--map-mark)"/>
                  <g transform="translate(249.4 248.4) scale(1.2) translate(-232.8729 -333.8286)">
                    <path fill="var(--card)" fill-rule="evenodd" d="${LOGO}"/>
                  </g>
                </g>

                <!-- 診所的名牌（現況）：實心綠底白字的對話框，尖端朝上進到綠色裡。 -->
                <g class="clab" data-dir="up" data-tx="258" data-ty="287" data-bx="250" data-bw="12" data-gap="0" data-tail="8.5"
                   data-pin-k="0.92" data-ink-gap=".25em">
                  <path class="bub"/><path class="tail"/>
                  <g class="rl-body">
                    <a class="rl-link" href="https://maps.app.goo.gl/bKSrVyS2Qu2xvnMj7" target="_blank" rel="noopener">
                      <g class="rl-pin"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></g>
                      <text class="cl-nm" x="226" y="319" text-anchor="middle">芳仁牙醫診所</text>
                      <line class="rl-ul"/>
                    </a>
                  </g>
                </g>

                <!-- ===== 新案：圖釘 ＋ 綠塊直接寫字 =====
                     ・綠塊的路徑一個單位都沒動（M228 236…），改的只有塊裡放什麼：
                       標誌 → 「芳仁牙醫」四個字（白，＝ --card，同一塊綠上只准一個白）。
                     ・圖釘的幾何全部由切換條的腳本現算（大小／位置／樣式三條尺），
                       所以這裡只留空的 path／circle，d 與 transform 由 JS 填。
                     ・整組包在一個 <a> 裡（綠塊也可以點，觸控目標比原本大很多），
                       連結仍然是使用者自己分享出來的那條 Google 地圖短網址。
                     ⚠ class 用 「cm-」 前綴、連結用 「cm-link」 不用 「rl-link」 ——
                       站上那支 sizeLabels() 會對每一個 .rl-link 找 .rl-nm/.rl-pin/.rl-ul，
                       混進去會在 nm.getBBox() 那一行整支掛掉（整張地圖的牌子都不會畫）。 -->
                <a class="cm-link" href="https://maps.app.goo.gl/bKSrVyS2Qu2xvnMj7" target="_blank" rel="noopener"
                   aria-label="芳仁牙醫診所・在 Google 地圖上開啟">
                  <g class="cmark">
                    <path class="cm-plot" d="M228 236H320A4 4 0 0 1 324 240V287H228Z"/>
                    <text class="cm-nm" x="276" y="268" text-anchor="middle">芳仁牙醫</text>
                    <line class="cm-ul"/>
                    <g class="cm-pin">
                      <g class="cm-sh" aria-hidden="true"></g>
                      <path class="cm-body"/>
                      <circle class="cm-disc" cx="0" cy="0" r="0"/>
                      <path class="cm-logo" fill-rule="evenodd" d="${LOGO}"/>
                    </g>
                  </g>
                </a>
`;
h = h.slice(0, iA) + NEW + h.slice(iB + anchor.length);

/* ---- 5. 提案用的樣式（pv 前綴，見 CLAUDE.md 第八節） --------------------- */
const CSS = `/* ==========================================================================
   提案：診所在地圖上改用「圖釘 ＋ 綠塊寫字」標示（2026-08-21）
   --------------------------------------------------------------------------
   ⚠ 這一整段是提案頁專用，定案時要把選上的那幾條搬進 index.html 的地圖那一節、
     其餘連同切換條一起刪掉。class 一律 「cm-」／「pv-」 前綴（CLAUDE.md 第八節：
     提案頁是 index.html 的完整複本，短名字幾乎一定會撞）。
   ⚠ 顏色一顆都沒有新增：釘身與標誌只用一般牙科的套色 「--map-mark」 #3f654a
     與紙卡色 「--card」 —— 綠塊裡本來那顆牙齒標誌用的就是它。
   ========================================================================== */

/* 現況與新案兩組標記同時在圖上，用 opacity 切。
   ⚠ 不要改成 display:none —— 站上那支 sizeLabels() 靠 getBBox() 量牌子，
     量到 0 的話切回現況時對話框會塌成一條線。 */
body[data-cmp="new"] .mark,
body[data-cmp="new"] .clab   { opacity: 0; pointer-events: none; }
body[data-cmp="now"] .cmark  { opacity: 0; pointer-events: none; }
body[data-cmp="now"] .cm-link { pointer-events: none; }

.cm-link { cursor: pointer; }
.map-svg .cm-plot { fill: var(--map-mark); }
/* 綠塊裡的字：白（＝紙卡色），粗體。字級由切換條的「細調」給，預設 18。
   ⚠ 選擇器要兩階（0,2,0）才蓋得過 「.map-svg text { fill: var(--map-ink) }」。 */
.map-svg .cm-nm { fill: var(--card); font-weight: 700; letter-spacing: .04em;
                  font-size: var(--cm-fs, 18px); }
/* 連結的底線：位置由 JS 現量（同站上那三塊牌子的做法，不用 text-decoration）。 */
.map-svg .cm-ul { stroke: var(--card); stroke-width: 1.2; }
body[data-ul="off"] .cm-ul { display: none; }

/* 三案。⚠ 三案都只有那兩顆顏色在換位置，沒有第三顆。
   Ⓐ 綠釘 ＋ 白圈 ＋ 圈裡綠標誌　（＝使用者給的那張參考圖的長相）
   Ⓑ 綠釘 ＋ 標誌直接反白　　　　（沒有內圈，所以標誌可以放到最大）
   Ⓒ 白釘 ＋ 綠框 ＋ 綠標誌　　　（最輕的一案，代價是壓在淺色街廓上會退掉） */
body[data-pin="a"] .cm-body { fill: var(--map-mark); }
body[data-pin="a"] .cm-disc { fill: var(--card); }
body[data-pin="a"] .cm-logo { fill: var(--map-mark); }

body[data-pin="b"] .cm-body { fill: var(--map-mark); }
body[data-pin="b"] .cm-logo { fill: var(--card); }
body[data-pin="b"] .cm-disc { display: none; }

body[data-pin="c"] .cm-body { fill: var(--card); stroke: var(--map-mark); stroke-width: 2.2; }
body[data-pin="c"] .cm-logo { fill: var(--map-mark); }
body[data-pin="c"] .cm-disc { display: none; }

/* 影子：圖釘是「浮在圖上」的東西，和地圖上其他都貼平的色塊不同。
   ⚠⚠⚠ 2026-08-21 第三輪：**不可以用 filter: drop-shadow()**。
     第二輪用的是 CSS 的 drop-shadow，Chromium 上四階都畫得好好的，
     **iOS Safari 上一階都沒有畫**。使用者的螢幕錄影（1126x2436、60fps）
     逐幀量出來：切在「重」的那一幀對切在「無」的那一幀，最深只差 3.3 階、
     有感的像素只有 2 個 —— 也就是完全沒有畫（同一組值在 Chromium 上是
     90 階、2000 CSS px²）。成因是這張 SVG 的每一個東西都在
     「g id=map-clip」那個 clip-path 底下，WebKit 對「被裁切的群組裡再套
     CSS filter」會整個丟掉。
   ⚠ 所以影子改成**畫出來的**：同一條釘身路徑疊十六層，每一層往下挪一點、
     以頭的圓心為中心放大一點、每層都很淡 —— 疊起來就是一圈由濃到淡的暈，
     完全沒有用到 filter，Safari／Chromium 都一定畫得出來。
     ⚠⚠ 十六層是量過的下限：十層時「最重」那一階的暈上緣看得出一圈一圈的台階
       （放大截圖比對得到），十六層就看不出來了（同 CLAUDE.md
       第九節第 10 條那個馬赫帶，只是這裡是台階不是斜坡）。
   ⚠ 墨色用站上卡片陰影那一支 --ink（rgba 42,44,39），不要自己再調一顆。
   四階的參數與實測強度都在底下那支腳本的 SH 表裡。 */
.map-svg .cm-sh path { fill: var(--ink); }
body[data-shadow="off"] .cm-sh { display: none; }

/* ==========================================================================
   切換條（提案用，定案時整段刪掉）
   ⚠ 手機上不能吃掉半個畫面 —— 這一頁要判斷的正是地圖那一塊。
     四條尺攤開、其餘收進「細調」。
   ========================================================================== */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 999;
  background: rgba(244, 244, 245, .94); backdrop-filter: blur(8px) saturate(1.1);
  border-top: 1px solid var(--rule);
  padding: .5rem .7rem calc(.5rem + env(safe-area-inset-bottom));
  font-size: 12px; line-height: 1.4; color: var(--ink);
  max-height: 46vh; overflow: auto;
}
.pv-row { display: flex; align-items: center; gap: .3rem; flex-wrap: wrap; margin-bottom: .34rem; }
.pv-row:last-child { margin-bottom: 0; }
.pv-lab { width: 3.4em; flex: none; color: var(--ink-soft); }
.pv-bar button {
  font: inherit; padding: .28rem .5rem; border-radius: 8px; cursor: pointer;
  border: 1px solid var(--rule); background: #fff; color: var(--ink);
}
.pv-bar button[aria-pressed="true"] { background: #3f654a; border-color: #3f654a; color: #fff; }
.pv-bar .pv-alt[aria-pressed="true"] { background: #5f5d5c; border-color: #5f5d5c; }
.pv-panel { margin-top: .4rem; padding-top: .4rem; border-top: 1px dashed var(--rule);
            color: var(--ink-soft); font-size: 11.5px; }
.pv-panel b { color: var(--ink); font-weight: 700; }
.pv-panel .pv-bad { color: #89202d; font-weight: 700; }
.pv-fold[hidden] { display: none; }
/* 切換條會蓋住頁尾最後一段，讓頁面多墊一塊。 */
body { padding-bottom: 12rem; }
/* 「回到最上面」那顆和切換條會疊在一起，提案頁先藏起來（正式站不動它）。 */
.btt { display: none !important; }`;
/* ---- 5.5 這一輪的推導：放在 <head> 最上面（定案時整段搬進 history/） ---- */
const NOTE = `<!-- ==========================================================================
     提案：診所在地圖上改用「圖釘 ＋ 綠塊寫字」標示（2026-08-21 開）
     --------------------------------------------------------------------------
     起因：使用者拿 cizoo.com 的一張手機截圖 ——「我喜歡這個圖釘釘在地圖上的樣子。
     我們目前診所的圖是用對話框標示診所名稱，我把那個診所地圖改成用圖釘標示，
     然後圖釘上圓圈就放診所的 logo，那個綠色的區塊就直接寫芳仁牙醫。」

     所以這一輪動的是兩件事，而且是**互換**：
       ・綠塊裡本來放標誌 → 改成直接寫「芳仁牙醫」（白字，＝紙卡色）
       ・標誌搬到圖釘頭上的那個圓圈裡，圖釘的尖端指進綠塊
       ・原本那塊「綠底白字的對話框（芳仁牙醫診所＋圖釘＋底線）」整個取消

     ⚠ 顏色一顆都沒有新增：釘身、字、標誌只用一般牙科的套色 #3f654a（--map-mark）
       與紙卡色 --card —— 綠塊裡原本那顆標誌用的就是它（PALETTE.md 第六之二十一節：
       這一塊綠上只准一個白）。

     ⚠ 地圖的 viewBox 與街廓、路名、停車場的座標**一個單位都沒有動**（那張圖排了
       四十二輪）。綠塊自己的路徑 M228 236… 也原封不動，改的只有塊裡放什麼。

     ⚠⚠⚠ **影子不可以用 CSS 的 filter: drop-shadow()**（2026-08-21 第三輪查出來的）。
     第二輪用的是它，Chromium 上四階都畫得好好的，**iOS Safari 上一階都沒有畫**。
     使用者的螢幕錄影（1126x2436、60fps）逐幀量：切在「重」的那一幀對切在「無」
     的那一幀，最深只差 3.3 階、有感的像素只有 2 個 —— 等於完全沒有畫
     （同一組值在 Chromium 上是 90 階、2000 CSS px²）。
     成因是這張 SVG 的每一樣東西都在「g id=map-clip」那個 clip-path 底下，
     WebKit 對「被裁切的群組裡再套 CSS filter」會整個丟掉。
     現在的影子是**畫出來的**：同一條釘身路徑疊十六層，每層往右下挪一點、
     以頭的圓心為中心放大一點、每層都很淡。沒有用到任何 filter。

     ⚠⚠ **影子要有角度，不是在背後暈開**（2026-08-21 第四輪，使用者：
     「你仔細看他的陰影是有角度的，像太陽從左上照下去，你做的陰影是在背後
     暈開怪怪的」）。回頭量那張參考截圖（1488x2266）：那顆圖釘的頭半徑 32px，
     影子整團**貼在右下緣**、往外約 10~14px（＝ 0.31~0.44 個半徑），
     左上那一側乾淨到量不出東西（低於底色 6 階的像素只有 2~3px）。
     所以每一層是往**右下**挪，x 與 y 挪一樣多（45 度 ＝ 光從左上打下來），
     挪多少用「半徑的倍數」寫，圖釘一放大影子才會跟著等比例。
     ⚠ 疊起來的總濃度是 1−(1−a)^層數，不是 a×層數 —— 層數一改 a 要跟著換算。

     切換條上的三條尺（都可以用網址參數直接開，正規式 [a-z0-9]+）：
       樣式 ?pin=a|b|c   Ⓐ 綠釘＋白圈＋圈裡綠標誌（＝參考圖的長相）
                         Ⓑ 綠釘＋標誌直接反白（沒有內圈，標誌可以放到最大 21px）
                         Ⓒ 白釘＋綠框＋綠標誌（最輕，壓在淺色街廓上會退掉）
       大小 ?size=s|m|l  52／60／68 單位（手機上 45／51／58 CSS px）
       位置 ?pos=c|r|rr  尖端落在綠塊的 x=276／294／312
       底線 ?ul=on|off   綠塊那四個字要不要保留超連結的底線
       細調 ?fs=16|18|20 綠塊的字級　?shadow=off|s1|s2|s3|s4 影子四階（量過的，見樣式那一段）
       另有「對照現況」一鍵切回站上現在跑的那一版（對話框那一案）。

     量測面板現場算四件（不是印數字而已，會直接下判斷）：
       ・圖釘與標誌實際幾個 CSS px（手機與電腦不同，因為手機把整張圖裁窄放大了）
       ・綠塊那四個字有沒有撐出綠塊（字級開到 20 就會）
       ・白字對綠 6.02:1、標誌對釘身的對比（圖形的門檻是 3:1）
       ・圖釘有沒有壓到停車場Ⓐ／「平和街19巷」／「永樂街」——「位置」選「中」時
         會壓到停車場Ⓐ 那一塊的右下角約 9×26px，面板會標紅。

     這一輪要注意的三件（做的時候踩到或先擋掉的）：
     ⚠ **現況與新案兩組標記同時放在圖上，用 opacity 切，不能用 display:none。**
       站上那支 sizeLabels() 是靠 getBBox() 現量牌子的內容再畫盒子與尾巴，
       display:none 量出來全是 0，按下「對照現況」時對話框會塌成一條線。
     ⚠ **新的連結不能掛 「rl-link」。** sizeLabels() 會對每一個 .rl-link 找
       .rl-nm／.rl-pin／.rl-ul，找不到就在 nm.getBBox() 那一行整支掛掉，
       連停車場那三塊牌子都不會畫。所以新案自己一套 cm-* 前綴，
       擋冒泡的 handler 也自己掛一份（地圖底層有「點空白處＝收回」那一層）。
     ⚠ **圖釘的幾何全部現算，不寫死**：頭的半徑 ＝ .36×高，從尖端拉兩條切線碰到
       圓（切點 ±R√(d²−R²)/d, −d+R²/d），標誌的寬度是半徑的倍數。三條尺任一格
       都因此等比例 —— 這一站踩過好幾次「寫死的絕對值配上不同字級就跑掉」。

     定案上線要做的四件：
       ① 把選上的那一案搬進 index.html 的地圖那一節（樣式那幾條 ＋ markup），
          沒選上的兩案與現況那兩組（.mark 的標誌、.clab 整塊）一起刪掉。
       ② 圖釘的幾何改成**算好之後寫死在 markup 裡**（正式站沒有切換條，
          不要為了它多掛一支 JS）；底線那條 <line> 仍然要現量，做法沿用
          sizeLabels()（--map-ul-gap 手機是 .16、電腦是 .1375）。
       ③ 「<desc id="md">」 裡「診所位在…」那句可以順手提一下新的標示方式。
       ④ 這一頁刪掉，這段推導搬進 /history/clinic-map-pin.html。
     ========================================================================== -->`;
h = h.replace('<head>\n', '<head>\n' + NOTE);

const iHead = h.lastIndexOf('</head>');
h = h.slice(0, iHead) + '<style>\n' + CSS + '\n</style>\n' + h.slice(iHead);

/* ---- 6. 切換條：插在**最後一個** </body> 前面 ---------------------------- */
/*    ⚠ 這一站的註解裡就寫著 </body> 那幾個字，用 replace 會換到註解裡那一個。 */
const BAR = `
<!-- ==========================================================================
     切換條（提案用）。⚠ 定案時連同 data-* 屬性一起刪掉，不要留到正式站。
     網址可帶參數直接開到某一格（正規式一律 [a-z0-9]+）：
       ?pin=a|b|c  ?size=s|m|l  ?pos=c|r|rr  ?ul=on|off  ?shadow=off|s1|s2|s3|s4  ?neck=a|b|c|d  ?tip=s|m|r
       ?fs=16|18|20  ?cmp=now|new
     ========================================================================== -->
<div class="pv-bar" id="pvBar">
  <div class="pv-row">
    <span class="pv-lab">樣式</span>
    <button data-k="pin" data-v="a">Ⓐ 綠釘白圈</button>
    <button data-k="pin" data-v="b">Ⓑ 綠釘白標誌</button>
    <button data-k="pin" data-v="c">Ⓒ 白釘綠標誌</button>
  </div>
  <div class="pv-row">
    <span class="pv-lab">大小</span>
    <button data-k="size" data-v="s">小</button>
    <button data-k="size" data-v="m">中</button>
    <button data-k="size" data-v="l">大</button>
    <span class="pv-lab">位置</span>
    <button data-k="pos" data-v="c">中</button>
    <button data-k="pos" data-v="r">右</button>
    <button data-k="pos" data-v="rr">更右</button>
  </div>
  <div class="pv-row">
    <span class="pv-lab">釘型</span>
    <button data-k="neck" data-v="a">Ⓐ 相切</button>
    <button data-k="neck" data-v="b">Ⓑ 微收</button>
    <button data-k="neck" data-v="c">Ⓒ 明顯</button>
    <button data-k="neck" data-v="d">Ⓓ 很細</button>
  </div>
  <div class="pv-row">
    <span class="pv-lab">底線</span>
    <button data-k="ul" data-v="on">有</button>
    <button data-k="ul" data-v="off">無</button>
    <button class="pv-alt" id="pvCmp" data-k="cmp" data-v="now">對照現況</button>
    <button id="pvMore">細調 ▾</button>
  </div>
  <div class="pv-fold" id="pvFold" hidden>
    <div class="pv-row">
      <span class="pv-lab">字級</span>
      <button data-k="fs" data-v="16">16</button>
      <button data-k="fs" data-v="18">18</button>
      <button data-k="fs" data-v="20">20</button>
      <span class="pv-lab">尖端</span>
      <button data-k="tip" data-v="s">尖</button>
      <button data-k="tip" data-v="m">中</button>
      <button data-k="tip" data-v="r">圓</button>
    </div>
    <div class="pv-row">
      <span class="pv-lab">陰影</span>
      <button data-k="shadow" data-v="off">無</button>
      <button data-k="shadow" data-v="s1">輕</button>
      <button data-k="shadow" data-v="s2">中</button>
      <button data-k="shadow" data-v="s3">重</button>
      <button data-k="shadow" data-v="s4">最重</button>
    </div>
  </div>
  <div class="pv-panel" id="pvPanel">量測中…</div>
</div>

<script>
/* ==========================================================================
   提案：診所改用圖釘標示 —— 切換條與現場量測（一次性，定案時整段刪掉）
   --------------------------------------------------------------------------
   圖釘的幾何全部現算，不寫死：
     H   整顆的高（尖端到頭頂）
     R   頭那個圓的半徑 ＝ .36H；圓心到尖端 d ＝ H − R
     切點 P± ＝ (±R·√(d²−R²)/d, −d + R²/d)  ← 從尖端拉兩條切線碰到圓
   路徑就是「左切點 → 走大弧繞過頭頂 → 右切點 → 尖端 → 收」。
   ⚠ 大弧旗標要 1、掃掠旗標要 1（SVG 的 y 軸朝下，看起來就是順時針）。
   ⚠ 標誌的寬度是**圓半徑的倍數**，不要寫死單位 —— 三條尺任一格都要等比例。
      圓內能塞下的最大 2.02926:1 矩形寬 ＝ 1.794R，取 1.30R 留邊。
   ========================================================================== */
(function () {
  var body = document.body, fig = document.querySelector('.map-fig');
  if (!fig) return;
  var svg  = fig.querySelector('.map-svg');
  var pin  = fig.querySelector('.cm-pin'),  pbody = fig.querySelector('.cm-body');
  var disc = fig.querySelector('.cm-disc'), logo  = fig.querySelector('.cm-logo');
  var shg  = fig.querySelector('.cm-sh');
  var nm   = fig.querySelector('.cm-nm'),   ul    = fig.querySelector('.cm-ul');

  /* 標誌的原始外框（量出來的，見 /history/ 那一頁）：2.02926:1 */
  var LX = 232.87294, LY = 333.82855, LW = 44.28734, LH = 21.82440;

  /* ⚠ 三格都要是「選了就能上線」的（CLAUDE.md：尺的下界要先量過再給）：
     52 以下標誌只剩 13px、洞就糊成一點；68 以上頭頂會頂出街廓的上緣。 */
  /* 腰身（度，離正下方）。愈小 ＝ 釘子愈細。a 那一格用相切（＝原本的水滴）。 */
  var WAIST = { b: 50, c: 40, d: 30 };
  /* 尖端的圓角，用頭的半徑的倍數給。s＝接近參考圖那種尖、r＝接近 Google 那種圓。 */
  var TIP = { s: .06, m: .11, r: .18 };
  var SIZE = { s: 52, m: 60, l: 68 };
  var POS  = { c: 276, r: 294, rr: 312 };
  var TIPY = 238;                 /* 尖端進到綠塊裡 2 個單位（綠塊上緣 236） */
  var PLOT = { x: 228, y: 236, w: 96, h: 51 };

  var DEF = { pin: 'a', size: 'm', pos: 'r', ul: 'on', shadow: 's2', fs: '18', neck: 'c', tip: 'm', cmp: 'new' };
  var st = {};
  var q = location.search;
  Object.keys(DEF).forEach(function (k) {
    var m = new RegExp('[?&]' + k + '=([a-z0-9]+)').exec(q);
    st[k] = m ? m[1] : DEF[k];
  });

  function n(v) { return (+v).toFixed(2); }

  /* 影子四階。a＝每一層的不透明度、dy＝整體往下挪幾個單位、sp＝最外層放大多少。
     max／area 是 Chromium DPR3 逐像素量到的（最深讓底下暗幾階／覆蓋幾 CSS px²），
     ⚠ 改了 a/dy/sp 就要重量一次，不要沿用舊數字。
     ⚠⚠ **層數一改，a 也要跟著改** —— 疊起來的總濃度是 1−(1−a)^層數，
       不是 a×層數。十層換成十六層時忘了換算，四階整組黑掉一倍
       （s1 從 54 階跳到 81）。換算式：a_new ＝ 1−(1−a_old)^(舊層數/新層數)。 */
  var SH = {
    off: null,
    s1: { a: .022, off: .05, sp: .07, max: 61, area: 72 },
    s2: { a: .032, off: .09, sp: .11, max: 91, area: 154 },
    s3: { a: .041, off: .13, sp: .15, max: 97, area: 240 },
    s4: { a: .051, off: .18, sp: .20, max: 121, area: 346 }
  };

  /* 釘身的路徑。三個參數：
       R    頭那個圓的半徑（圓心在 (0, -d)，尖端在原點）
       phi  **腰身**：頭與釘子交接的那兩個點，離「正下方」幾度。
            phi 愈小 ＝ 釘子愈細、頭與釘子的分界愈明顯。
            ⚠ 相切（＝原本那顆水滴）就是 phi ＝ acos(R/d)：那時交接處
              完全平順、看不出哪裡是圓哪裡是釘子 —— 2026-08-21 第五輪
              使用者指出的正是這件事（「目前診所的圖釘從圓形標籤外框到
              釘子的部分是整個連在一起」）。
       rt   尖端的圓角半徑（用 R 的倍數給）。參考圖那顆很尖，使用者不要；
            Google 那顆太圓潤，也不要 —— 中間那一格是預設。
     做法：頭的大弧 → 右腰點拉一條**切線**到尖端的小圓 → 繞過小圓 → 左腰點收回。
     ⚠ 切線要用算的，不能用「連到尖端再導圓角」——那樣兩側會在尖端附近凸出來。 */
  function pinPath(R, d, phiDeg, rtK) {
    var phi = phiDeg * Math.PI / 180, cy = -d;
    var PX = R * Math.sin(phi), PY = cy + R * Math.cos(phi);
    var rt = Math.max(0.02, rtK) * R, tcy = -rt;          /* 尖端小圓的圓心 */
    /* 右腰點對小圓的切點 */
    var vx = 0 - PX, vy = tcy - PY, dist = Math.hypot(vx, vy);
    var th = Math.acos(Math.min(1, rt / dist));           /* 切點與連心線的夾角 */
    var base = Math.atan2(PY - tcy, PX - 0);              /* 小圓心 → 腰點 */
    var a1 = base - th;                                   /* 右側那個切點 */
    var qx = 0 + rt * Math.cos(a1), qy = tcy + rt * Math.sin(a1);
    /* 左邊鏡射；沿順時針（角度遞增）從右切點繞過底部到左切點 */
    var a2 = Math.PI - a1;
    var delta = a2 - a1; while (delta < 0) delta += 2 * Math.PI;
    var big = delta > Math.PI ? 1 : 0;
    return 'M' + n(-PX) + ' ' + n(PY) +
           'A' + n(R) + ' ' + n(R) + ' 0 1 1 ' + n(PX) + ' ' + n(PY) +
           'L' + n(qx) + ' ' + n(qy) +
           'A' + n(rt) + ' ' + n(rt) + ' 0 ' + big + ' 1 ' + n(-qx) + ' ' + n(qy) +
           'Z';
  }

  function drawPin() {
    var H = SIZE[st.size] || SIZE.m, R = 0.36 * H, d = H - R;
    var tanPhi = Math.acos(R / d) * 180 / Math.PI;        /* 相切那一格（原本的水滴） */
    var phi = st.neck === 'a' ? tanPhi : (WAIST[st.neck] || WAIST.c);
    var rtK = TIP[st.tip] || TIP.m;
    pbody.setAttribute('d', pinPath(R, d, phi, st.neck === 'a' ? 0.02 : rtK));
    var dr = 0.72 * R;
    disc.setAttribute('r', n(dr));
    disc.setAttribute('cy', n(-d));
    /* Ⓐ 的標誌關在白圈裡，所以基準換成內圈的半徑 */
    var w = st.pin === 'a' ? 1.46 * dr : 1.30 * R;
    var sc = w / LW, hh = LH * sc;
    logo.setAttribute('transform',
      'translate(' + n(-w / 2) + ' ' + n(-d - hh / 2) + ') scale(' + sc.toFixed(5) +
      ') translate(' + (-LX) + ' ' + (-LY) + ')');
    pin.setAttribute('transform', 'translate(' + (POS[st.pos] || POS.r) + ' ' + TIPY + ')');
    drawShadow(pbody.getAttribute('d'), d, R);
    return { H: H, R: R, w: w, phi: phi, neck: 2 * R * Math.sin(phi * Math.PI / 180) };
  }

  /* 影子：同一條釘身路徑疊 LAYERS 層（16），往下挪 ＋ 以頭的圓心為中心放大。
     ⚠ 不要改回 CSS 的 drop-shadow —— iOS 在 clip-path 底下不畫（見樣式那一段）。 */
  var NS = 'http://www.w3.org/2000/svg', LAYERS = 16;
  function drawShadow(dAttr, d, R) {
    var sh = SH[st.shadow];
    while (shg.firstChild) shg.removeChild(shg.firstChild);
    if (!sh) return;
    for (var i = 0; i < LAYERS; i++) {
      var t = i / (LAYERS - 1);
      var sc = 1 + sh.sp * t, k = sh.off * R * (0.4 + 0.6 * t);
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', dAttr);
      p.setAttribute('opacity', sh.a.toFixed(3));
      /* ⚠ 往**右下**挪，x 與 y 一樣多（＝光從左上打下來，45 度）——
         2026-08-21 第四輪使用者指出：參考圖那顆的影子是有角度的，
         我做的是「在背後暈開」。量過那張截圖：影子整團貼在圖釘的右下緣，
         往外約 10~14px（那顆頭的半徑 32px ＝ 0.31~0.44 R），左上角乾淨。
         ⚠ 第五輪再收一次（使用者：「範例看起來是從更高的角度照下來，
           所以不用像你畫的那麼長」）：off 與 sp 整組砍一半，影子貼著
           右下緣就收掉，覆蓋面積從 315 降到 154 CSS px²（「中」那一階）。
         ⚠ 以頭的圓心 (0, -d) 為中心放大，不是以尖端 —— 以尖端放大的話
           影子會整個往下長，看起來像倒影。 */
      p.setAttribute('transform', 'translate(' + n(k) + ' ' + n(k) + ') translate(0 ' + n(-d) +
        ') scale(' + sc.toFixed(4) + ') translate(0 ' + n(d) + ')');
      shg.appendChild(p);
    }
  }

  /* 字面下緣（單位＝該元素的 user unit）。做法同站上那三塊牌子。 */
  var CTX = (function () { try { return document.createElement('canvas').getContext('2d'); } catch (e) { return null; } })();
  function ink(el) {
    if (!CTX) return null;
    var cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
    if (!fs) return null;
    CTX.font = cs.fontStyle + ' ' + cs.fontWeight + ' 400px ' + cs.fontFamily;
    var m = CTX.measureText(el.textContent);
    return { a: m.actualBoundingBoxAscent / 400 * fs, d: m.actualBoundingBoxDescent / 400 * fs, fs: fs };
  }

  function placeText() {
    var fs = +st.fs || 18;
    svg.style.setProperty('--cm-fs', fs + 'px');
    var i = ink(nm) || { a: .862 * fs, d: .172 * fs, fs: fs };
    var cy = PLOT.y + PLOT.h / 2;
    var ulk = parseFloat(getComputedStyle(nm).getPropertyValue('--map-ul-gap')) || .1375;
    /* 底線也算進「這一塊要置中的東西」裡，不然開了底線整塊看起來會往下沉。 */
    var low = st.ul === 'on' ? i.d + ulk * fs : i.d;
    var y = cy + (i.a - low) / 2;
    nm.setAttribute('y', n(y));
    var b = nm.getBBox();
    var uy = y + i.d + ulk * fs;
    ul.setAttribute('x1', n(b.x)); ul.setAttribute('x2', n(b.x + b.width));
    ul.setAttribute('y1', n(uy));  ul.setAttribute('y2', n(uy));
    return b;
  }

  /* ---- 對比度（WCAG） ---- */
  function rgb(c) {
    var m = /rgba?\(([^)]+)\)/.exec(c);
    if (m) { var p = m[1].split(',').map(parseFloat); return [p[0], p[1], p[2]]; }
    m = /^#([0-9a-f]{6})$/i.exec(c.trim());
    if (m) { var v = parseInt(m[1], 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
    return [0, 0, 0];
  }
  function lum(c) {
    return rgb(c).map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); })
      .reduce(function (a, v, i) { return a + v * [.2126, .7152, .0722][i]; }, 0);
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return ((Math.max(x, y) + .05) / (Math.min(x, y) + .05)); }

  function overlaps() {
    var pr = pin.getBoundingClientRect(), hits = [];
    var targets = [
      ['停車場Ⓐ', fig.querySelector('.lot[data-lot="a"] rect')],
      ['「平和街19巷」', fig.querySelectorAll('.lbl-xs')[0]],
      ['「永樂街」', fig.querySelectorAll('.lbl')[4]]
    ];
    targets.forEach(function (t) {
      if (!t[1]) return;
      var r = t[1].getBoundingClientRect();
      var ox = Math.min(pr.right, r.right) - Math.max(pr.left, r.left);
      var oy = Math.min(pr.bottom, r.bottom) - Math.max(pr.top, r.top);
      if (ox > .5 && oy > .5) hits.push(t[0] + ' ' + ox.toFixed(0) + '×' + oy.toFixed(0) + 'px');
    });
    return hits;
  }

  function paint() {
    Object.keys(DEF).forEach(function (k) { body.dataset[k] = st[k]; });
    document.querySelectorAll('.pv-bar button[data-k]').forEach(function (b) {
      if (b.id === 'pvCmp') { b.setAttribute('aria-pressed', String(st.cmp === 'now')); return; }
      b.setAttribute('aria-pressed', String(st[b.dataset.k] === b.dataset.v));
    });
    var g = drawPin(), tb = placeText();
    measure(g, tb);
  }

  function measure(g, tb) {
    var p = document.getElementById('pvPanel');
    var r = svg.getBoundingClientRect(), k = r.width / 560;   /* 1 單位 ＝ 幾個 CSS px */
    var cs = getComputedStyle(document.documentElement);
    var card = cs.getPropertyValue('--card') || '#f4f4f5';
    var green = '#3f654a';
    var cText = ratio(card, green);
    var cLogo = st.pin === 'b' ? ratio(card, green) : ratio(green, card);
    var hits = overlaps();
    var over = tb.width > PLOT.w - 12;
    var lines = [];
    lines.push('圖釘 <b>' + g.H + '</b> 單位＝<b>' + (g.H * k).toFixed(1) + 'px</b>' +
               '（頭 ⌀' + (2 * g.R * k).toFixed(1) + '、標誌寬 ' + (g.w * k).toFixed(1) + 'px）');
    lines.push('釘型：腰身 ' + g.phi.toFixed(1) + '°，頭與釘子的交接處寬 <b>' +
               (g.neck * k).toFixed(1) + 'px</b>（＝頭的 ' + (g.neck / (2 * g.R) * 100).toFixed(0) + '%）');
    lines.push('綠塊的字 ' + tb.width.toFixed(1) + ' / ' + PLOT.w + ' 單位 —— ' +
               (over ? '<span class="pv-bad">撐出綠塊了</span>' : '兩邊各留 ' +
                ((PLOT.w - tb.width) / 2).toFixed(1) + ' 單位'));
    lines.push('對比：白字對綠 <b>' + cText.toFixed(2) + '</b>:1、標誌對釘身 <b>' + cLogo.toFixed(2) + '</b>:1' +
               (cText < 4.5 ? ' <span class="pv-bad">字沒過 AA</span>' : '') +
               (cLogo < 3 ? ' <span class="pv-bad">標誌低於圖形的 3:1</span>' : ''));
    var sh = SH[st.shadow];
    lines.push('影子：' + (sh ? '最深讓底下暗 <b>' + sh.max + '</b> 階（0~255）、覆蓋約 ' + sh.area + ' CSS px²'
                              : '沒有'));
    lines.push('圖釘壓到：' + (hits.length ? '<span class="pv-bad">' + hits.join('、') + '</span>' : '沒有壓到別的東西'));
    p.innerHTML = lines.join('<br>');
  }

  document.querySelectorAll('.pv-bar button[data-k]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.id === 'pvCmp') { st.cmp = st.cmp === 'now' ? 'new' : 'now'; paint(); return; }
      st[b.dataset.k] = b.dataset.v;
      if (st.cmp === 'now') st.cmp = 'new';      /* 動任何一條尺就切回新案 */
      paint();
    });
  });
  document.getElementById('pvMore').addEventListener('click', function () {
    var f = document.getElementById('pvFold');
    f.hidden = !f.hidden;
    this.textContent = f.hidden ? '細調 ▾' : '細調 ▴';
  });
  /* 牌子上的連結一定要擋住冒泡 —— 地圖底層有「點空白處＝收回」那一層。 */
  fig.querySelectorAll('.cm-link').forEach(function (a) {
    a.addEventListener('click', function (e) { e.stopPropagation(); });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);
  paint();
  addEventListener('resize', paint);

  /* 開頁直接停在地圖那張卡（手機上要判斷的就是它）。 */
  if (!location.hash) {
    addEventListener('load', function () {
      var c = document.querySelector('.card-map');
      if (!c) return;
      var bar = document.getElementById('pvBar').getBoundingClientRect().height;
      /* ⚠ 頁首是黏著的，讓開它的高度，不然卡片標題會被蓋住。 */
      var hd = document.querySelector('.site-head');
      var hh = hd ? hd.getBoundingClientRect().height : 0;
      var r = c.getBoundingClientRect(), top = r.top + scrollY;
      var room = innerHeight - bar - hh;
      scrollTo({ top: Math.max(0, top - hh - Math.max(10, (room - r.height) / 2)), behavior: 'auto' });
      setTimeout(paint, 60);
    });
  }
})();
</script>`;
const iBody = h.lastIndexOf('</body>');
if (iBody < 0) throw new Error('找不到 </body>');
h = h.slice(0, iBody) + BAR + '\n' + h.slice(iBody);

fs.mkdirSync('preview/clinic-map-pin', { recursive: true });
fs.writeFileSync(OUT, h);
console.log('寫出', OUT, (h.length / 1024).toFixed(1) + 'KB');
