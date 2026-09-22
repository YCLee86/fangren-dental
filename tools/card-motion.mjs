/* 首頁文章圖卡的動態疊層（2026-09-22 定案上線）
 * --------------------------------------------------------------------------
 * 被 tools/build.mjs 匯入，不單獨執行。
 *
 * 起點：〈隱形矯正〉的文章頁 HERO 上線之後，使用者問「首頁的文章圖卡也能呈現嗎」，
 * 看過提案頁 /preview/card-motion/ 之後說「可以了　上線」。
 * 推導與量測在 /history/card-motion.html。
 *
 * ⚠⚠ 規格（速度、幅度、遮罩的形狀、軸心、硬邊界）**只有一份**，
 *   就是文章頁 posts/<slug>/index.html 的 <head> 裡那個 style#hero-fx-css。
 *   這一支從那裡讀出動畫的部分，只補「卡片才需要」的三件：
 *     ① 外框 .card-shot（圖與疊層擺同一個盒子，hover 的放大搬到這一層）
 *     ② 座標換算（卡片是 16/9 的 object-fit: cover）
 *     ③ 疊層自己的遮罩與硬邊界（座標跟著換算）
 *   **不要在這裡另外調速度或幅度** —— 兩邊遲早會不一樣。
 *
 * ⚠ 卡片的裁切：實測左右各裁掉 0.59~0.69%、上下 0%（盒子 16/9 ＝ 1.7778，
 *   圖 1.799~1.803）。所以橫向的座標一律 (x/800 − 0.0059) / 0.9882，縱向不變，
 *   而遮罩的 viewBox 高度用 450（16/9）不是文章頁的 445.6。
 *
 * ⚠⚠ 放大**一定要掛在內層**（.card-fx-err-in），外層那一道 clip-path 不能跟著動。
 *   外層跟著放大的話，硬邊界就失去意義 —— 2026-09-22 踩過：警告標示放大時
 *   把旁邊螢幕的藍框一起往外推，推出插圖的螢幕範圍。成因與三個數字的由來
 *   寫在文章頁那一段註解裡，改之前先讀。
 *
 * ⚠ 驗收不能只看「有沒有水平捲動」—— 那件事發生在圖**裡面**。
 *   要把倍率停在最大、和「疊層關掉」逐像素相減，看螢幕外那一片有沒有變
 *   （定案時量到的是 0）。
 */

import fs from "node:fs";
import path from "node:path";

/* 哪幾篇的卡片要加疊層。⚠ 寫死 slug —— 首頁依上架日排序，用「第幾張」會跟著跑掉。 */
export const CARD_FX = {
  "aligner-simulation": {
    /* 五個驚嘆號在文章頁座標系（800 × 445.6）的位置 */
    blips: [[226, 91], [354, 95], [314, 126], [199, 161], [261, 186]],
    /* 黃色警告標示：遮罩的圓角矩形、硬邊界、放大的軸心（都已換算成卡片的座標） */
    maskRect: { x: 375.7, y: 64.6, w: 85, h: 60.6, r: 12, blur: 3.5 },
    clip: "12.12% 41.4% 69.93% 45.7%",
    origin: "57.46% 21.05%",
  },
};

const CROP_X = 0.0059;      /* 左右各裁掉的比例 */
const CROP_W = 0.9882;      /* 剩下的比例 */
const H_ART = 445.6;        /* 文章頁的 viewBox 高 */
const H_CARD = 450;         /* 卡片的 viewBox 高（16/9） */

const cx = (x) => (x / 800 - CROP_X) / CROP_W * 800;
const cy = (y) => y / H_ART * H_CARD;

/* 把文章頁 <head> 那一段裡「卡片也要用」的部分抓出來：兩組 @keyframes ＋ 驚嘆號那一條。
   ⚠ 抓不到就 throw —— 靜靜地少一段 CSS 的話，畫面會變成「五個驚嘆號永久亮著」，
     而且不會報錯（2026-09-22 已經踩過一次，成因是舊的共用樣式表）。 */
export function readFxCss(root, slug) {
  const file = path.join(root, "posts", slug, "index.html");
  const html = fs.readFileSync(file, "utf8");
  const m = /<style id="hero-fx-css">([\s\S]*?)<\/style>/.exec(html);
  if (!m) throw new Error(`${slug} 的 <head> 裡找不到 style#hero-fx-css`);
  const css = m[1];
  const want = [
    /\.hero-fx-blip\s*\{[\s\S]*?\}/,
    /@keyframes heroFxBlip\s*\{[\s\S]*?\n\}/,
    /@keyframes heroFxErr\s*\{[\s\S]*?\n\}/,
  ].map((re) => {
    const hit = re.exec(css);
    if (!hit) throw new Error(`${slug} 的 style#hero-fx-css 裡找不到 ${re}`);
    return hit[0];
  });
  return want.join("\n");
}

/* 卡片才需要的那幾條。⚠ 名字一律 card-fx- 前綴，和文章頁的 hero-fx- 分開 ——
   兩者的盒子不一樣（卡片會裁、而且 hover 會放大）。 */
export function cardCss(fx) {
  const rects = Object.values(CARD_FX).map((c) => c.maskRect);
  const r = rects[0];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${H_CARD}" preserveAspectRatio="none">` +
    `<filter id="b" x="-50%" y="-50%" width="200%" height="200%">` +
    `<feGaussianBlur stdDeviation="${r.blur}"/></filter>` +
    `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${r.r}" fill="%23fff" filter="url(%23b)"/></svg>`;
  const clip = Object.values(CARD_FX)[0].clip;
  const origin = Object.values(CARD_FX)[0].origin;
  return `/* ⚠ 這一段由 tools/card-motion.mjs 產生，請勿手動編輯。
   動畫的規格（速度、幅度）是從 posts/aligner-simulation/index.html 的
   style#hero-fx-css 讀出來的 —— 規格只有一份，要改去改那裡。 */
${fx}

/* 外框：圖與疊層擺在同一個盒子裡，hover 的放大搬到這一層。
   ⚠⚠ 不搬的話桌機上滑過去那一刻兩層會錯開，警告標示會浮到旁邊去。 */
.card-shot { display: block; position: relative; transition: transform .5s cubic-bezier(.22, .61, .36, 1); }
.card:hover .card-shot { transform: scale(1.05); }
.card-shot .card-thumb { transition: none; }
.card:hover .card-shot .card-thumb { transform: none; }

/* 黃色的警告標示放大縮小。外層只負責「切在哪裡」，而且**不跟著放大**。 */
.card-fx-err {
  position: absolute; inset: 0; display: block; pointer-events: none;
  -webkit-mask-image: url('data:image/svg+xml;utf8,${svg}');
          mask-image: url('data:image/svg+xml;utf8,${svg}');
  -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  clip-path: inset(${clip});
}
.card-fx-err-in {
  display: block; width: 100%; height: 100%;
  transform-origin: ${origin};
  animation: heroFxErr 2s ease-in-out infinite;
}
.card-fx-err img { display: block; width: 100%; height: 100%; object-fit: cover; }
.card-fx { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

@media (max-width: 720px) {
  /* 手機沒有 hover，那兩條規則用不到；留著也無妨，寫在這裡只是提醒 */
  .card:hover .card-shot { transform: none; }
}`;
}

/* 把一張卡的 <picture> 包成「圖 ＋ 疊層」。picture 原樣傳進來，
   ⚠ 疊層那一份**直接複製它**（srcset／sizes／loading 一模一樣）——
     這樣瀏覽器挑到的是同一個檔案，直接命中快取，一個位元組都不會多載。
     重寫過一次就會兩邊不一樣，然後多載一份圖（文章頁那一輪踩過，多了 151 KiB）。 */
export function cardOverlay(slug, pictureHtml, indent = "        ") {
  const c = CARD_FX[slug];
  if (!c) return pictureHtml;
  const copy = pictureHtml
    .replace(/class="card-thumb"/, 'class="card-fx-img"')
    .replace(/ alt="[^"]*"/, ' alt=""');
  const blips = c.blips.map(([x, y], i) =>
    `\n${indent}    <circle class="hero-fx-blip" style="opacity:0; transform-box:view-box; ` +
    `transform-origin:${cx(x).toFixed(1)}px ${cy(y).toFixed(1)}px; ` +
    `animation-delay:${(i * 0.28).toFixed(2)}s" cx="${cx(x).toFixed(1)}" cy="${cy(y).toFixed(1)}" ` +
    `r="12.1" fill="url(#cardFxGlow)"/>`
  ).join("");
  return `<span class="card-shot" style="position:relative;display:block">${pictureHtml}
${indent}  <span class="card-fx-err" aria-hidden="true" style="position:absolute;inset:0;display:block;pointer-events:none"><span class="card-fx-err-in" style="display:block;width:100%;height:100%">${copy}</span></span>
${indent}  <svg class="card-fx" viewBox="0 0 800 ${H_CARD}" preserveAspectRatio="none" aria-hidden="true" focusable="false" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
${indent}    <defs><radialGradient id="cardFxGlow"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".55" stop-color="#ffffff" stop-opacity=".45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>${blips}
${indent}  </svg>
${indent}</span>`;
}
