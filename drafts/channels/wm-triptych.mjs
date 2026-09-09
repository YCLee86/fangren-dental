/* 主頁「最新貼文」那三格的浮水印 —— 一顆標誌跨在三張圖上，拼起來是完整的一顆。
 *   import { wmFor, TRI } from "./wm-triptych.mjs";
 *
 * ⚠⚠⚠ 2026-09-09 使用者：「logo 浮水印要選一樣的　讓這三張呈現一個完整的 logo。
 *   第一張是門診表 logo 要壓在下方，左下是科別醫師 logo 壓在右上，
 *   右下是地圖停車 logo 壓在左上。logo 用門診表那張圓圓的。」
 *
 * ＝ 一顆圓標誌**騎在三格中間那個十字縫上**：大格看到上半、左下看到左下角那一象限、
 *   右下看到右下角那一象限。所以三格的幾何只有一個出處，就是這一份。
 *
 * ⚠⚠⚠ 這一份存在的理由（也是這一輪最貴的一課）：**同一個 px 寬度在三格上不一樣大。**
 *   大格與小格在主頁上是用**不同的比例尺**縮的 ——
 *     大格 823 ÷ 1080 ＝ 0.7620　　小格 409 ÷ 1080 ＝ 0.3787
 *   兩者差 **2.012 倍**。所以「三張都畫 660px 的圓」畫出來會是「大格一顆大的、
 *   小格兩顆小的」，接不成一顆。**要接得起來，小格那兩張在原圖上就得畫成兩倍大。**
 *   （同 booked 那一輪「九顆不能同寬」的道理，只是這裡差的是顯示比例不是墨量。）
 *
 * ⚠⚠ 三格的尺寸是 2026-09-09 從使用者的後台截圖**逐像素量的**（iPhone 1125×2436）：
 *     大格 1023×508、小格 508×508、三道縫都是 6 —— 換算回 823 那一組就是
 *     大格 823×409、小格 409×409、縫 5，而且 **823 ＝ 409 ＋ 5 ＋ 409**（剛好對得起來）。
 *   ⚠ 那張截圖同時回答了 CLAUDE.md 34-7 那個開著很久的問題：
 *     **大格是 cover 裁切不是留白**（科別醫師那張上下真的被切掉了）。
 *
 * ⚠ 顏色一個都沒有新增（墨 --ink ＋ 很低的 opacity），形狀從 brand/shapes/ 讀。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const TRI = {
  CANVAS: 1080,          /* 每一張原圖都是 1080 見方 */
  BIG_W: 823, BIG_H: 409,
  SLOT: 409, GAP: 5,
  SHAPE: "r3c1",         /* 「門診表那張圓圓的」＝ 使用者指名的那一顆 */
  /* ⚠ 三格現在是同一個物件，所以濃度**一定要同一個值** ——
     門診表那張本來是 5%、地圖那張是 4%，接在一起會在縫上看得出一深一淺。
     取 4%（地圖那一輪使用者說的「可能要更淡一點」）。 */
  OPACITY: 0.04,
  /* 圓的直徑，單位是「三格合起來」那個座標系（大格寬 823）。
     ✅ **2026-09-09 使用者定案 500**（＝大格寬的 61%；三格 380／500／620 都看過
     「排在一起」與「三張各自獨立」兩種）—— 這個 500 是**挑定的值不是暫定的預設**。
     ⚠⚠ 它仍然是一把尺，而且**跨三支產生器**：三張圖要一起重跑才比得出來，
     所以用環境變數傳（`WM_DIA=380 node …`），由 post-triptych.mjs 一次跑完三張。
     ⚠ 三格的數字見 drafts/channels/README.md 第 36-17 節。 */
  DIA: +(process.env.WM_DIA || 500),
};

/* ⚠⚠⚠ 2026-09-09：同一組圖要貼到 **Facebook** 上（使用者：「這三個圖片似乎也很適合
 *   放在臉書上」）。臉書是**一則一則被看到的**，三張不會並排 ——
 *   所以那顆騎在十字縫上的圓，在臉書上每一張只剩一塊往外流出去的弧，
 *   讀起來是一團淡灰不是標誌（＝ CLAUDE.md 第九節第 28 條 ⑤：
 *   一個在舊媒介裡沒有意義的性質，換了媒介就開始說話）。
 *   **臉書版每一張各自一顆完整的標誌**，貼在它原本那一角、整顆進到畫布裡。
 * ⚠ 形狀與濃度沿用他挑定的那一組（r3c1・4%），只改「完整」與「大小」。
 * ⚠ 角落沿用他 2026-09-09 指定的那三個（門診表下方／科別醫師右上／地圖左上），
 *   所以兩組圖擺在一起時是同一個語彙，不是兩套設計。 */
export const SOLO = {
  /* 直徑（畫布 px，三張同一個數字）—— 656 ＝ 定案那顆在**門診表**那張上畫出來的大小，
     所以不是新猜的值，是他一直在看的那一顆。⚠ 它是一把尺，用 WM_SOLO_DIA 傳。 */
  DIA: +(process.env.WM_SOLO_DIA || 656),
  CORNER: { hours: "b", docs: "tr", map: "tl" },
};
function wmSoloFor(tile, opt = {}) {
  const corner = SOLO.CORNER[tile];
  if (!corner) throw new Error(`不認識的格子：${tile}`);
  const shape = opt.shape ?? TRI.SHAPE;
  const dia = opt.dia ?? SOLO.DIA;
  const C = TRI.CANVAS;
  const w = dia, h = w / shapeRatio(shape);
  /* 整顆都要在畫布裡 —— 這就是臉書版存在的理由，貼著邊但不切出去 */
  const left = corner === "tr" ? C - w : corner === "b" ? (C - w) / 2 : 0;
  const top  = corner === "b" ? C - h : 0;
  if (left < -.01 || top < -.01 || left + w > C + .01 || top + h > C + .01)
    throw new Error(`臉書版的標誌切出畫布了（${tile} ${dia}px）—— 直徑要 ≤ ${C}`);
  return {
    shape, opacity: TRI.OPACITY, scale: 1, mode: "fb", corner,
    w: +w.toFixed(1), h: +h.toFixed(1), left: +left.toFixed(1), top: +top.toFixed(1),
    css: `width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;`
       + `left:${left.toFixed(1)}px;top:${top.toFixed(1)}px`,
  };
}

/* 形狀的長寬比從 SVG 的 viewBox 讀回來，不要用 img.naturalWidth
   （瀏覽器對 SVG 會進位到整數，2.029 會回 2.000）。 */
export function shapeRatio(sh = TRI.SHAPE) {
  const vb = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
    .match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!vb) throw new Error(`shape-${sh}.svg 讀不到 viewBox`);
  return +vb[1] / +vb[2];
}

/* 三格在「合起來」那個座標系裡各自的框 */
const RECT = {
  hours: { x: 0, y: 0, w: TRI.BIG_W, h: TRI.BIG_H },
  docs:  { x: 0, y: TRI.BIG_H + TRI.GAP, w: TRI.SLOT, h: TRI.SLOT },
  map:   { x: TRI.BIG_W - TRI.SLOT, y: TRI.BIG_H + TRI.GAP, w: TRI.SLOT, h: TRI.SLOT },
};
/* 十字縫的正中央 —— 圓心就放這裡 */
export const CENTER = { x: TRI.BIG_W / 2, y: TRI.BIG_H + TRI.GAP / 2 };

/**
 * 某一格的浮水印要畫在它自己那張 1080 原圖的哪裡、多大。
 * @param {"hours"|"docs"|"map"} tile
 * @param {{dia?:number, shape?:string}} opt
 * @returns {{shape,w,h,left,top,opacity,scale,css}}  left/top 是 SVG 外框的左上角（1080 座標）
 */
export function wmFor(tile, opt = {}) {
  /* ⚠⚠ 臉書版：三支產生器一行都不用改，由環境變數切（同 WM_DIA 那把尺的做法）。
     ⚠ 沒有第二個地方在算浮水印，所以兩個版本不可能分家。 */
  if ((opt.mode ?? process.env.WM_MODE) === "fb") return wmSoloFor(tile, opt);
  const r = RECT[tile];
  if (!r) throw new Error(`不認識的格子：${tile}（只有 hours／docs／map）`);
  const dia = opt.dia ?? TRI.DIA;
  const shape = opt.shape ?? TRI.SHAPE;
  const C = TRI.CANVAS;

  /* cover：比例尺由「比較長的那一邊」決定；1080 是正方形，所以就是寬與高取大的那個 */
  const s = Math.max(r.w, r.h) / C;
  /* 原圖上看得到的那一段（cover 是置中裁的） */
  const offX = (C - r.w / s) / 2, offY = (C - r.h / s) / 2;

  const cx = (CENTER.x - r.x) / s + offX;
  const cy = (CENTER.y - r.y) / s + offY;

  const w = dia / s, h = w / shapeRatio(shape);
  const left = cx - w / 2, top = cy - h / 2;
  return {
    shape, opacity: TRI.OPACITY, scale: s,
    w: +w.toFixed(1), h: +h.toFixed(1), left: +left.toFixed(1), top: +top.toFixed(1),
    css: `width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;`
       + `left:${left.toFixed(1)}px;top:${top.toFixed(1)}px`,
  };
}

/* ⚠ 守門用：三格的圓在「合起來」那個座標系裡要是同一顆（同心、同大小）。
   算回去比一次 —— 哪一支的比例尺寫錯了，這裡會翻臉。 */
export function checkOne(dia = TRI.DIA) {
  /* ⚠ 臉書版三張各自一顆完整的，本來就不該接成一顆 —— 這一道跳過。 */
  if (process.env.WM_MODE === "fb") return [];
  const out = [];
  for (const tile of Object.keys(RECT)) {
    const g = wmFor(tile, { dia }), r = RECT[tile];
    const s = g.scale, offY = (TRI.CANVAS - r.h / s) / 2, offX = (TRI.CANVAS - r.w / s) / 2;
    out.push({ tile,
      cx: +(((g.left + g.w / 2) - offX) * s + r.x).toFixed(2),
      cy: +(((g.top + g.h / 2) - offY) * s + r.y).toFixed(2),
      d:  +(g.w * s).toFixed(2) });
  }
  for (const o of out) {
    if (Math.abs(o.cx - CENTER.x) > .05 || Math.abs(o.cy - CENTER.y) > .05)
      throw new Error(`${o.tile} 的圓心接不上：(${o.cx}, ${o.cy})，應該是 (${CENTER.x}, ${CENTER.y})`);
    if (Math.abs(o.d - dia) > .05)
      throw new Error(`${o.tile} 的圓畫出來是 ${o.d}，不是 ${dia}`);
  }
  return out;
}

/* ⚠⚠ 主頁三格的模擬圖：**版面只有這一份**（三支產生器各自畫一份的話，
   哪一支的縫或順序寫錯就會靜靜地畫出一顆接不起來的圓）。
   ⚠ 順序是使用者指定的：大格＝門診表、左下＝科別醫師、右下＝地圖停車。 */
export const MOCK = { w: TRI.BIG_W, h: TRI.BIG_H + TRI.GAP + TRI.SLOT };
export function tripleHtml({ hours, docs, map }, rule = "#cdd0d2") {
  const cell = (uri, w, h) =>
    `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${rule}">`
    + (uri ? `<img src="${uri}" style="width:100%;height:100%;object-fit:cover;display:block">` : "")
    + `</div>`;
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>`
    + `<div style="width:${TRI.BIG_W}px;background:#fff;display:flex;`
    + `flex-direction:column;gap:${TRI.GAP}px">`
    + cell(hours, TRI.BIG_W, TRI.BIG_H)
    + `<div style="display:flex;gap:${TRI.GAP}px">`
    + cell(docs, TRI.SLOT, TRI.SLOT) + cell(map, TRI.SLOT, TRI.SLOT)
    + `</div></div>`;
}
