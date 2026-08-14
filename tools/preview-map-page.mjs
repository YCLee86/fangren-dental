// 產生 preview/clinic-map-page/index.html —— 「位置與周邊停車」放進診所資訊的**整頁預覽**。
//
// ⚠ 這是**提案期間的一次性工具**，和 npm run build 沒有關係，build 也不會呼叫它。
//   定案把卡片搬進 index.html 之後，連同 preview/clinic-map-page/ 一起刪掉。
//
//   用法：node tools/preview-map-page.mjs
//   來源：index.html（整頁）＋ preview/clinic-simple-map/index.html（地圖本體）
//
// ⚠ 從提案頁抽 CSS／SVG／JS **一律用字串標記切，不要用行號** ——
//   提案頁天天在改，行號一天就失效（2026-08-14 踩過：切出來的 JS 少了半個函式，
//   瀏覽器只回一句 Unexpected token）。

import { readFileSync, writeFileSync } from 'node:fs';

// 專案根目錄 ＝ 這支檔案的上一層
const ROOT = new URL('../', import.meta.url).pathname;
let src = readFileSync(ROOT + 'index.html', 'utf8');
const comp = readFileSync(ROOT + 'preview/clinic-simple-map/index.html', 'utf8');
// ⚠ **一律用字串標記切，不要用行號** —— 提案頁天天在改，行號一天就失效
//   （2026-08-14 踩過：切出來的 JS 少了半個函式，只回一句 Unexpected token）。
const cut = (from, to) => {
  const a = comp.indexOf(from);
  const b = comp.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('切不到：' + from.slice(0, 24));
  return comp.slice(a, b);
};

// ---- 從提案頁抽出地圖的 CSS（兩塊，中間那段是那一頁自己的版面，不要）------
const mapVars = `:root {
  /* 地圖自己的值，全部指回站上既有的變數 */
  --map-block: #d4cfca;
  --map-bg:    var(--card);
  --map-road:  var(--rule);
  --map-ink:   var(--ink-soft);
  --map-mark:  #3f654a;
  --map-park:  #365685;
  --lbl-op: 1;
}`;
const cssA = cut('/* 兩種畫法 ＝ 底與路互換 */', '*, *::before, *::after { box-sizing: border-box; }');
const cssB = cut('.card-map { grid-column: 1 / -1; }', '/* ---- 切換條');
const mapCss = mapVars + '\n' + cssA + '\n' + cssB;

// ---- SVG 本體 -------------------------------------------------------------
let svg = comp.slice(comp.indexOf('<template id="map-tpl">') + '<template id="map-tpl">'.length,
                     comp.indexOf('</template>'));
svg = svg.trim().replace('<g id="map-clip">', '<g id="map-clip" clip-path="url(#clip-round)">');

// ---- JS（去掉切換條與 template/slot 那一套）--------------------------------
let js = cut('  // ---- 停車場的點選', "  document.getElementById('sw')");
js = `(function () {
  var fig = document.querySelector('.map-fig');
  if (!fig) return;

` + js + `
})();`;

// ---- 開始改 index.html ----------------------------------------------------
// 1) 相對路徑往上兩層（⚠ 不要用 <base href="/">，那會讓 #topics 這種錨點跳回首頁）
src = src.replace(/(href|src)="assets\//g, '$1="../../assets/')
         .replace(/href="site\.webmanifest/g, 'href="../../site.webmanifest')
         .replace(/href="posts\//g, 'href="../../posts/')
         .replace(/href="\.\/"/g, 'href="../../"');
// ⚠ srcset 裡面也有 assets/，而且是逗號分隔的多筆 —— 上面那條只吃 href=/src=，
//   漏掉會少一張 HERO 大圖（2026-08-14 踩過，requestfailed 才看到）。
src = src.replace(/srcset="([^"]*)"/g,
  (m, v) => 'srcset="' + v.replace(/(^|[\s,])assets\//g, '$1../../assets/') + '"');

// 2) 計數器整支拿掉，窄帶的數字寫死並手動加 .is-on
src = src.replace('<script src="../../assets/counter.js" defer></script>', '');
src = src.replace('<p class="band-views" data-views-self="home">',
                  '<p class="band-views is-on">');
src = src.replace('<span class="views-n" aria-hidden="true">0</span>',
                  '<span class="views-n" aria-hidden="true">—</span>');
// 文章卡的計數器掛勾也拿掉
src = src.replace(/ data-views="[^"]*"/g, '');

// 3) SEO 區塊換成 noindex
const a = src.indexOf('<!-- SEO:START'), b = src.indexOf('<!-- SEO:END');
const bEnd = src.indexOf('-->', b) + 3;
src = src.slice(0, a) +
  '<meta name="robots" content="noindex, nofollow, noarchive">' +
  src.slice(bEnd);

// 3.5) canonical 與 og:url 也要拿掉 —— 它們指向首頁，等於叫搜尋引擎
//      「這一頁的正本是 fangren.net/」。noindex 之外再擋一層。
src = src.replace(/\n<link rel="canonical"[^>]*>/g, '')
         .replace(/\n<meta property="og:url"[^>]*>/g, '');

// 4) <html> 掛上地圖要用的 data-*
src = src.replace(/<html lang="zh-Hant-TW"/,
  '<html lang="zh-Hant-TW" data-style="line" data-shape="round" data-mark="plot" data-hue="green" data-txt="soft" data-corner="edge" data-block="warm" data-park="sign" data-chip="outline" data-clab="on"');

// 5) 標題
src = src.replace(/<title>[^<]*<\/title>/, '<title>提案：位置與周邊停車（整頁預覽）｜芳仁牙醫診所</title>');

// 6) 地圖的 CSS 接在既有樣式表後面
src = src.replace('</head>', '<style>\n/* ==== 位置與周邊停車（提案）==== */\n' + mapCss + '\n</style>\n</head>');

// 7) 卡片插進「診所資訊」那一格的最後
const card = `
        <!-- 位置與周邊停車。⚠ 提案中，推導在 /preview/clinic-simple-map/ -->
        <div class="info-card card-map" data-hue="taupe">
          <h3>位置與周邊停車</h3>
${svg.split('\n').map(l => l ? '          ' + l : l).join('\n')}
        </div>
`;
const anchor = '        <p class="info-note">國定假日與各科特別門診請來電確認。</p>\n        </div>\n';
if (src.indexOf(anchor) < 0) throw new Error('找不到門診表那張卡的結尾');
src = src.replace(anchor, anchor + card);

// 8) JS 放在**最後一個** </body> 前面（⚠ 註解裡也有一個 </body>，一定要用 lastIndexOf）
const i = src.lastIndexOf('</body>');
src = src.slice(0, i) + '<script>\n' + js + '\n</script>\n' + src.slice(i);

// 9) 抬頭：這一頁是怎麼來的
const head = `<!--
  ==========================================================================
  提案：把「位置與周邊停車」放進診所資訊（整頁預覽）　2026-08-14
  ==========================================================================
  ⚠⚠ **這一頁是 index.html 的快照，不是手寫的。** 直接改這裡等於白改 ——
     下次重新產生就蓋掉了。要改請改來源：
       ・地圖本體（SVG／CSS／JS）→ preview/clinic-simple-map/index.html
       ・其餘整頁的東西        → index.html
     然後重跑 **tools/preview-map-page.mjs**（那支腳本跟著 git 走）。

  產生的時候做了六件事（CLAUDE.md 第八節那四個陷阱都在裡面）：
    1. 相對路徑往上兩層：href/src **以及 srcset**（srcset 是逗號分隔的多筆，
       只改 href/src 會漏掉 HERO 那張大圖）。⚠ 不要用 <base href="/"> 代替，
       那會讓 #topics 這種錨點跳回首頁。
    2. 計數器整支拿掉，窄帶的數字寫死成「—」並手動加 .is-on
       —— 不拿掉的話每開一次這一頁，首頁的瀏覽數就多一次。
    3. SEO 區塊換成 noindex/nofollow/noarchive，canonical 與 og:url 一併刪掉
       （它們指向首頁，等於說「這一頁的正本是 fangren.net/」）。
    4. <html> 掛上地圖要用的 data-*（提案頁那些切換條在正式站不存在，
       這裡直接把選定的那一案寫死）。
    5. 地圖的 CSS 接在既有樣式表後面、卡片插進 .info 的最後、
       JS 放在**最後一個** </body> 前面（⚠ 這一站的註解裡就有 </body> 這幾個字，
       一定要用 lastIndexOf）。
    6. 從提案頁抽 CSS／SVG／JS 一律**用字串標記切，不要用行號** ——
       提案頁天天在改，行號一天就失效。
  ========================================================================== -->
`;
src = src.replace(/<!doctype html>/i, function (m) { return m + '\n' + head; });

writeFileSync(ROOT + 'preview/clinic-map-page/index.html', src);
console.log('寫好了', src.length, 'bytes');
