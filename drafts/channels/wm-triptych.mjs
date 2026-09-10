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
 *   放在臉書上」→「**因為臉書沒有像 line 那樣的版面　我比較傾向用之前的版本
 *   單一張看順眼就好**　但你們還是把這兩張和地圖弄成臉書適合的尺寸
 *   **地圖也挑一個不一樣的浮水印**壓上去」）。
 *
 * ＝ 臉書版**不是**三格拼一顆，是**回到三格版之前那一組「一張一顆」的浮水印**：
 *   那顆騎在十字縫上的圓只有三格並排時才拼得起來，臉書是一則一則被看到的
 *   （中間隔著別人的貼文、隔著好幾天），每一張上只剩一塊往畫布外流出去的弧
 *   （＝ CLAUDE.md 第九節第 28 條 ⑤：舊媒介裡沒有意義的性質，換了媒介就開始說話）。
 *
 * ⚠⚠ **這一組的值一個都不是新挑的**，全部是 2026-09-08 使用者自己在那兩頁上挑定的：
 *   門診表 r3c1・660px・壓右下（right −60 / top 470）・**5%**（壓在表的後面）
 *   科別醫師 r1c2・952px・壓左上・左邊切 440・4%（壓在最上面）
 * ⚠⚠ **地圖那一張是唯一一個新決定**：它原本和科別醫師共用 r1c2，理由是
 *   「兩個小格並排，浮水印不一樣會讀成兩件事」—— **那個理由在臉書上不成立**
 *   （兩則分開貼），所以他指定換一顆。那是一把尺，用 `WM_FB_MAP` 傳形狀。
 * ⚠ 寬度**不可以沿用同一個數字**：九顆的長寬比 1.00~3.08、墨佔外框 59.6~83.2%，
 *   同寬的話細長那幾顆會輕很多 —— 一律按墨的面積正規化（基準 r3c1 畫 660）。 */
/* ⚠⚠⚠ 2026-09-09 再一輪，使用者兩件（**兩件都是「牙洞」的事，判準同一條**）：
 *   「**地圖那個 logo 選得不錯　不過 logo 原本的牙洞在左上　這裡看不到了
 *     把牙洞移到右上**」／「**科別醫師那個 logo 在左上　移到右下比較好**」
 *
 * ⚠⚠ 牙洞是這顆標誌**唯一的識別特徵** —— 沒有它，剩下的就只是一團圓角形狀，
 *   所以預設要讓它看得到。**但那不是硬條件**：2026-09-09 稍晚使用者對科別醫師那一張
 *   說「不要轉　牙洞不要出來沒關係」—— **一顆倒過來的標誌比一個看不到的洞更糟**。
 *   所以每一格自己宣告 `hole: "show" | "cut"`，守門照它驗。做法是把每一顆的牙洞量出來
 *   （逐一算過：r1c2 在 71.3%／75.7%、r2c2 在 17.5%／23.9%、r3c1 在 56.7%／81.9%），
 *   再確認它落在畫布看得到的那一段裡；守門有一道真的去 PNG 上找那個洞。
 * ⚠ 翻轉一律**整個 `<svg>` 元素**做（`transform: scale(±1)`），外框與洞一起翻。
 *   **絕對不要只翻 `<path d>`** —— 洞是 fill-rule 挖的，只翻外框洞會落在形狀外面、
 *   靜靜地消失而且不報錯（remind-marks 那一輪已經踩過一次）。 */
export const FB = {
  /* 基準：`r3c1` 畫 660px 那麼重。**換形狀時基準不可以跟著換**
     （2026-09-08 踩過：把預設換掉，整把尺一起縮水 31%）。 */
  REF: "r3c1", REFW: 660,
  /* `tl` ＝ 左上角切掉 cutX／cutY；`br` ＝ 右下角切掉同樣那兩個量。
     ⚠ 門診表那一組（cutX 60、cutY 50）就是他 09-08 挑定的 right −60 / top 470，
       換算過來一模一樣 —— **值沒有改，只是寫法統一了**。 */
  hours: { shape: "r3c1", pos: "br", opacity: .05, cutX: 60, cutY: 50, hole: "show" },
  /* ⚠⚠ 科別醫師：2026-09-09 從壓左上**搬到右下**（使用者指定）。
     ⚠⚠⚠ **不轉**（2026-09-09 使用者：「科別醫師那個 logo 不要轉　牙洞不要出來沒關係」）——
     所以這一張看得到的是形狀的**左上那一塊**，牙洞（71.3%／75.7%，在右下）落在畫布外面。
     那是他知情的取捨：**轉 180° 洞會回來，但那顆標誌就是倒過來的**。
     ⚠ `hole: "cut"` 是講給守門聽的 —— 沒有它，那道「牙洞要看得到」會擋下這一張。
     ⚠ `WM_FB_DOCS=flip` 仍然產得出轉過的那一版（留著看，頁面上沒有）。 */
  docs:  { shape: "r1c2", pos: "br", opacity: .04, cutX: 440, cutYr: 50 / 660, hole: "cut",
           flipX: process.env.WM_FB_DOCS === "flip", flipY: process.env.WM_FB_DOCS === "flip" },
  /* ⚠ 地圖這一顆是尺：`WM_FB_MAP` 換形狀。預設 r2c2（長寬比 1.33 —— 和門診表的
     正圓、科別醫師的長條都分得出來）。
     ⚠⚠ **切掉多少不是另一把尺**：一律切到「看得到 512px」為止 ＝ 科別醫師那一張
     切 440 之後剩下的寬度，這樣換形狀時份量不會跟著跳。
     ⚠⚠⚠ **左右鏡射**（2026-09-09 使用者：「牙洞移到右上」）—— r2c2 的洞在左上，
     而這一張切掉左邊那一截，洞正好被切走；鏡射之後洞落在畫布 (379, 94) ＝ 右上。 */
  map:   { shape: process.env.WM_FB_MAP || "r2c2", pos: "tl", opacity: .04,
           seen: 512, cutYr: 50 / 660, flipX: true, hole: "show" },
};
const WMSIZES = JSON.parse(fs.readFileSync(
  path.join(ROOT, "preview", "line-booked", "wm-sizes.json"), "utf8"));
/** 等重換算：那一顆要畫多寬，才和「r3c1 畫 660」一樣重 */
export function fbWidth(sh) {
  const a = WMSIZES[sh], b = WMSIZES[FB.REF];
  if (!a) throw new Error(`wm-sizes.json 裡沒有 ${sh}`);
  return Math.round(FB.REFW * a.w / b.w);
}
/* 每一顆形狀的牙洞在哪（外框的百分比，逐一量出來的 —— 見 README 第 38-11 節）。
   ⚠ 這是**資料不是猜的**：把那份 SVG 畫成黑的、從邊界 flood fill，剩下沒被淹到的
     白色連通區就是洞。要加新形狀就照同一個方法量一次再填進來。 */
export const HOLE = {
  r1c1: [0.294, 0.815], r1c2: [0.713, 0.757], r2c1: [0.500, 0.203],
  r2c2: [0.175, 0.239], r3c1: [0.567, 0.819], r3c2: [0.500, 0.240],
};

function wmFbFor(tile, opt = {}) {
  const c = FB[tile];
  if (!c) throw new Error(`不認識的格子：${tile}（只有 hours／docs／map）`);
  const shape = opt.shape ?? c.shape;
  const w = fbWidth(shape), h = w / shapeRatio(shape);
  /* `br` ＝ 從右下角切掉；`tl` ＝ 從左上角切掉。兩種都是他挑定的裁法，
     **切出去是刻意的**，不要改成「整顆進到畫布裡」。 */
  const cutX = c.cutX ?? Math.max(0, w - c.seen);
  const cutY = c.cutY ?? Math.round(h * (c.cutYr ?? 0));
  const left = c.pos === "br" ? TRI.CANVAS - w + cutX : -cutX;
  const top  = c.pos === "br" ? TRI.CANVAS - h + cutY : -cutY;
  const fx = c.flipX ? -1 : 1, fy = c.flipY ? -1 : 1;
  /* 牙洞畫在畫布的哪裡（翻轉之後）—— 面板與守門都要用它 */
  const [hx, hy] = HOLE[shape] ?? [NaN, NaN];
  const hole = { x: +(left + (fx < 0 ? 1 - hx : hx) * w).toFixed(1),
                 y: +(top  + (fy < 0 ? 1 - hy : hy) * h).toFixed(1) };
  return {
    shape, opacity: c.opacity, scale: 1, mode: "fb-solo", pos: c.pos, cutX, cutY,
    holeMode: c.hole ?? "show",
    flipX: fx < 0, flipY: fy < 0, hole,
    w, h: +h.toFixed(1), left: +left.toFixed(1), top: +top.toFixed(1),
    /* 看得到多寬 —— 面板要印的就是這個（切掉之後還剩多少形狀） */
    seen: w - cutX,
    css: `width:${w}px;height:${h.toFixed(1)}px;left:${left.toFixed(1)}px;top:${top.toFixed(1)}px`
       + (fx < 0 || fy < 0 ? `;transform:scale(${fx},${fy})` : ""),
  };
}

/* 面板要印的那一句 —— 三支產生器共用一份，不要各寫各的
   （寫法一分家，同一顆浮水印在三張面板上就會有三種說法）。 */
export function wmDesc(WM) {
  if (WM.mode !== "fb-solo") return "三格共用的那一顆，圓心在十字縫上";
  const 角 = { br: "壓右下", tl: "壓左上" }[WM.pos] ?? WM.pos;
  const 翻 = WM.flipX && WM.flipY ? "・轉 180°"
    : WM.flipX ? "・左右鏡射" : WM.flipY ? "・上下鏡射" : "・不轉";
  /* ⚠ 牙洞那一句要照它自己宣告的講：`cut` 的那一張說「被切掉（他知情）」，
     不要印一個看起來像壞掉的座標。 */
  const 洞 = WM.holeMode === "cut"
    ? `・牙洞在畫布外 (${WM.hole.x}, ${WM.hole.y})＝他選的不轉`
    : `・牙洞落在畫布 (${WM.hole.x}, ${WM.hole.y})`;
  return `一張一顆（fb-solo・留著當退路）：${角}、切掉 ${WM.cutX}×${WM.cutY}`
    + `（看得到 ${WM.seen}px）${翻}${洞}`;
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

/* ⚠⚠⚠ 2026-09-09 最後一輪：**臉書的相簿貼文也是三格，而且是同一種排法。**
 *   使用者拿了粉專上那一則的截圖：「**結果貼文也有三格是欸　那還是像 line 那樣
 *   做一下讓同一個 logo 完整顯示好了　給我適合放在臉書貼文的圖片**」。
 *
 * ⚠⚠⚠ **這推翻了 38-2 那整段推理。** 我當時寫「臉書沒有像 LINE 那樣的版面，
 *   所以退回一張一顆」，那句話是**從第一原理推的、沒有量過** ——
 *   而臉書把「一次三張照片」排成的正是「上面一張寬的、下面兩張方的」。
 *   **通則：「那個平台沒有這種版面」是一句可以被一張截圖推翻的話 ——
 *   在推翻它之前，先貼三張上去看一眼。**
 *
 * ⚠⚠ 下面這一組是**從那張截圖逐像素量的**（截圖 838×1063，臉書深色模式，
 *   所以縫是暗的不是白的 —— 找的是「整列幾乎全暗」的帶）：
 *     大格　x 3—831・y 136—548　→ 829×413（2.007:1）
 *     縫　　y 549—551、x 416—418　→ **3**
 *     小格　x 3—415 與 419—831・y 552—965　→ 413×413
 *   而且 **829 ＝ 413 ＋ 3 ＋ 413**，和 LINE 那一組一樣對得起來。
 *
 * ⚠ 和 LINE 那一組（823／409／5）差不到 1%，**但還是各記一份** ——
 *   兩邊都是量出來的事實，寫成同一份就等於說「它們一定一樣」，那沒有人驗過。
 * ⚠ 大格一樣是 **cover 裁切**（截圖上「芳仁牙醫開診時段」那行標題與最下面
 *   那行電話都不見了），所以圓心對大格仍然落在它看得到那一段的下緣外一點點。 */
export const TRI_FB = {
  CANVAS: 1080,
  BIG_W: 829, BIG_H: 413,
  SLOT: 413, GAP: 3,
};
const metricsOf = (mode) => mode === "fb" ? TRI_FB : TRI;
const rectsOf = (m) => ({
  hours: { x: 0, y: 0, w: m.BIG_W, h: m.BIG_H },
  docs:  { x: 0, y: m.BIG_H + m.GAP, w: m.SLOT, h: m.SLOT },
  map:   { x: m.BIG_W - m.SLOT, y: m.BIG_H + m.GAP, w: m.SLOT, h: m.SLOT },
});
const centerOf = (m) => ({ x: m.BIG_W / 2, y: m.BIG_H + m.GAP / 2 });

/**
 * 某一格的浮水印要畫在它自己那張 1080 原圖的哪裡、多大。
 * @param {"hours"|"docs"|"map"} tile
 * @param {{dia?:number, shape?:string}} opt
 * @returns {{shape,w,h,left,top,opacity,scale,css}}  left/top 是 SVG 外框的左上角（1080 座標）
 */
export function wmFor(tile, opt = {}) {
  /* ⚠⚠ 版本由環境變數切（同 WM_DIA 那把尺的做法），三支產生器一行都不用改。
     ⚠ 沒有第二個地方在算浮水印，所以幾個版本不可能分家。
       `fb`      ＝ 臉書相簿貼文的三格（2026-09-09 定案，量出來和 LINE 同一種排法）
       `fb-solo` ＝ 一張一顆的那一版（2026-09-08 挑定的值，**留著當紀錄與退路**，
                    哪天真的要一則一則單獨貼才會用到） */
  const mode = opt.mode ?? process.env.WM_MODE;
  if (mode === "fb-solo") return wmFbFor(tile, opt);
  const m = metricsOf(mode);
  const r = rectsOf(m)[tile];
  if (!r) throw new Error(`不認識的格子：${tile}（只有 hours／docs／map）`);
  const dia = opt.dia ?? TRI.DIA;
  const shape = opt.shape ?? TRI.SHAPE;
  const C = m.CANVAS;
  const ctr = centerOf(m);

  /* cover：比例尺由「比較長的那一邊」決定；1080 是正方形，所以就是寬與高取大的那個 */
  const s = Math.max(r.w, r.h) / C;
  /* 原圖上看得到的那一段（cover 是置中裁的） */
  const offX = (C - r.w / s) / 2, offY = (C - r.h / s) / 2;

  const cx = (ctr.x - r.x) / s + offX;
  const cy = (ctr.y - r.y) / s + offY;

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
export function checkOne(dia = TRI.DIA, mode = process.env.WM_MODE) {
  /* ⚠ 一張一顆那一版本來就不該接成一顆 —— 這一道跳過。 */
  if (mode === "fb-solo") return [];
  const m = metricsOf(mode), RE = rectsOf(m), ctr = centerOf(m);
  const out = [];
  for (const tile of Object.keys(RE)) {
    const g = wmFor(tile, { dia, mode }), r = RE[tile];
    const s = g.scale, offY = (m.CANVAS - r.h / s) / 2, offX = (m.CANVAS - r.w / s) / 2;
    out.push({ tile,
      cx: +(((g.left + g.w / 2) - offX) * s + r.x).toFixed(2),
      cy: +(((g.top + g.h / 2) - offY) * s + r.y).toFixed(2),
      d:  +(g.w * s).toFixed(2) });
  }
  for (const o of out) {
    if (Math.abs(o.cx - ctr.x) > .05 || Math.abs(o.cy - ctr.y) > .05)
      throw new Error(`${o.tile} 的圓心接不上：(${o.cx}, ${o.cy})，應該是 (${ctr.x}, ${ctr.y})`);
    if (Math.abs(o.d - dia) > .05)
      throw new Error(`${o.tile} 的圓畫出來是 ${o.d}，不是 ${dia}`);
  }
  return out;
}

/* ⚠⚠ 主頁三格的模擬圖：**版面只有這一份**（三支產生器各自畫一份的話，
   哪一支的縫或順序寫錯就會靜靜地畫出一顆接不起來的圓）。
   ⚠ 順序是使用者指定的：大格＝門診表、左下＝科別醫師、右下＝地圖停車。 */
export const MOCK = { w: TRI.BIG_W, h: TRI.BIG_H + TRI.GAP + TRI.SLOT };
/* ⚠ 臉書相簿貼文那一組的模擬尺寸（量出來的，見上面 TRI_FB） */
export const mockOf = (mode) => { const m = metricsOf(mode);
  return { w: m.BIG_W, h: m.BIG_H + m.GAP + m.SLOT }; };
export function tripleHtml({ hours, docs, map }, rule = "#cdd0d2", mode) {
  const m = metricsOf(mode);
  const cell = (uri, w, h) =>
    `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${rule}">`
    + (uri ? `<img src="${uri}" style="width:100%;height:100%;object-fit:cover;display:block">` : "")
    + `</div>`;
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>`
    + `<div style="width:${m.BIG_W}px;background:#fff;display:flex;`
    + `flex-direction:column;gap:${m.GAP}px">`
    + cell(hours, m.BIG_W, m.BIG_H)
    + `<div style="display:flex;gap:${m.GAP}px">`
    + cell(docs, m.SLOT, m.SLOT) + cell(map, m.SLOT, m.SLOT)
    + `</div></div>`;
}
