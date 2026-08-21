/* ==========================================================================
   tools/door-map-preview.mjs　—— 產生 preview/clinic-map-door/index.html
   --------------------------------------------------------------------------
   提案（2026-08-21 開）：**貼在診所門口的停車參考圖**。
   使用者：「我想要製作一張正對診所角度版本的地圖，用意是放在診所門口的
   停車場參考。」

   跑法：node tools/door-map-preview.mjs　（在 repo 根目錄）

   做法：**不重畫一張地圖** —— 直接把 index.html 那張（排了四十二輪的）
   整個抽出來，只做三件事：
     ① 整張圖轉向（父層 rotate），
     ② 該直立的東西各自反轉回來（子層 rotate(−θ) 繞自己的錨點 ——
        父轉 ∘ 子反轉 ＝ 只剩位移，所以字與牌子留在轉過去的位置、但不歪），
     ③ 主要街名在「直排／橫排」之間換一種排法（路的方向轉了 90 度，
        字的排法要跟著換，不然會沿著路豎著讀）。
   ⚠ 地圖的 viewBox、街廓、路名、停車場座標**一個單位都沒有動**。
   ⚠ 這一頁是提案頁：定案之後要嘛輸出成圖／PDF 給使用者印，要嘛整頁刪掉。
   ⚠ 這支是模板字串，註解裡不可以出現反引號 —— 一律用 「」。
   ========================================================================== */
import fs from 'node:fs';

const SRC = 'index.html';
const OUT = 'preview/clinic-map-door/index.html';
const src = fs.readFileSync(SRC, 'utf8');

/* ---- 1. 從 index.html 抽三塊：地圖的 markup、CSS、JS ---------------------- */
function slice(start, end, what) {
  const i = src.indexOf(start);
  if (i < 0) throw new Error('找不到 ' + what + ' 的開頭');
  const j = src.indexOf(end, i);
  if (j < 0) throw new Error('找不到 ' + what + ' 的結尾');
  return src.slice(i, j + end.length);
}

const FIG = slice('<figure class="map-fig">', '</figure>', '地圖 markup');
const MAPCSS = slice('/* ==========================================================================\n   位置與周邊停車（2026-08-14 定案上線）',
                     '.mn-first { display: block; margin-bottom: .35rem; }', '地圖 CSS');
const MAPJS = slice('/* 位置與周邊停車：點停車場帶出步行路線與時間。推導見 /history/clinic-simple-map.html */',
                    '\n})();', '地圖 JS');

/* 幾何要能整組轉向 —— 在 map-clip 底下再包一層 g#geo。 */
const fig = FIG.replace('<g id="map-clip" clip-path="url(#clip-round)">',
                        '<g id="map-clip" clip-path="url(#clip-round)"><g id="geo">')
               .replace(/(\s*)<\/g>(\s*)<\/svg>/, '$1</g></g>$2</svg>');
if (!/id="geo"/.test(fig)) throw new Error('geo 包不進去');

const CSS = fs.readFileSync('tools/door-map-style.css', 'utf8');
const BODY = fs.readFileSync('tools/door-map-body.html', 'utf8');
const JS = fs.readFileSync('tools/door-map-script.js', 'utf8');

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>提案：門口的停車參考圖｜芳仁牙醫</title>
<style>
${CSS}
/* ---- 以下整段是從 index.html 抽出來的地圖樣式，一個字都沒改 ---- */
${MAPCSS}
</style>
</head>
${BODY.replace('<!--MAP-->', fig)}
<script>
${MAPJS}
</script>
<script>
${JS}
</script>
</body>
</html>
`;
fs.mkdirSync('preview/clinic-map-door', { recursive: true });
fs.writeFileSync(OUT, html);
console.log('寫出', OUT, (html.length / 1024).toFixed(1) + 'KB');
