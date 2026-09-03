#!/usr/bin/env node
/* 招呼圖卡的頭圖：Ⓒ3b 的街景 ＋ 白色玻璃遮罩 ＋「芳仁／哩厚」
 *   node drafts/line-hello/generate.mjs
 * 產出 preview/line-hello/hero-<行距>-<框大小>-<字體>.jpg（各 1040×520 ＝ Flex 頭圖的 2:1）
 *
 * 使用者 2026-09-03：「選 Ⓒ3b。文字要放 芳仁 哩厚，感覺可以斷行，
 * 加點白色的玻璃遮罩看看。」（哩厚 ＝ 台語的你好）
 *
 * ⚠⚠ 這一輪字體的選項變多了：實測 **M PLUS Rounded 1c 與 Zen Maru Gothic
 *   這四個漢字全都有**（前一輪「你」不在日文圓體裡，這一次「芳仁哩厚」都在，
 *   連罕用的「哩」也在——它在 JIS 裡是「マイル」）。所以中文終於拿得到
 *   **真正的圓體**，不必再靠圓角描邊去逼近。
 *   ⚠ 但日文字型畫漢字用的是**日本字形**，這四個字在日／繁形上結構相同，
 *     風險低——出圖之後仍要用眼睛看一次，不要只看數字。
 *
 * ⚠⚠ 有了白色玻璃之後，對比度就不再是難題（前幾輪那個「中間調的綠壓在照片上」
 *   的問題，玻璃一墊就沒了）。所以這一支的量測重點換成兩件：
 *   ① 玻璃到底有沒有生效（backdrop-filter 若被靜靜忽略，畫面看起來只是一塊白）
 *   ② 字在聊天室的 232px 下有多大
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { outline, closedPath } from "./bubble.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "preview", "line-hello");
const photo64 = fs.readFileSync(path.join(HERE, "source-2080.jpg")).toString("base64");

const FDIR = path.join(HERE, "fonts");
const chunks = JSON.parse(fs.readFileSync(path.join(FDIR, "chunks.json"), "utf8"));
const FAM = { mplus: "MPlus", zenmaru: "ZenMaru", baloo: "Baloo", fredoka: "Fredoka", ntc: "NotoTC" };
const faces = chunks.map((c) => {
  const b64 = fs.readFileSync(path.join(FDIR, c.name)).toString("base64");
  return `@font-face{font-family:"${FAM[c.id]}";font-style:normal;font-weight:900;` +
         `src:url(data:font/woff2;base64,${b64}) format("woff2");unicode-range:${c.ur}}`;
}).join("\n");

const DEEP = "#2c5238";                 /* 一般牙科的深階（PALETTE.md），亮底上的字用這一階 */
const W = 1040, H = 520;
/* Ⓒ3b 的裁切框（原檔 8000×3982 座標），和 crop.mjs 同一組值 */
const IW = 8000, IH = 3982, CX0 = 934, CY0 = 403, CW = 6680, CH = 3340;
const sc = W / CW;

/* ⚠⚠ 位置是量出來的（在成品的 1040×520 座標裡，疊格線讀的）：
     診所外牆右緣 x≈430、劉家紅招牌 x 620~660／y 165~325、遮陽棚上緣 y≈360。

   ✅ 2026-09-03 第三輪修正（使用者看過第四版之後）：
     「還是不要缺口好了。兩段字感覺有點擠，分開一點。對話框也可以範圍再大一點。」
   → **缺口整個拿掉**（描邊改吃封閉路徑，`openPath()` 已從 bubble.mjs 移除）
   → 這一輪要選的兩把尺換成：**兩行的距離** 與 **框多大**
   ⚠ **字級不跟著框長大**（使用者要的是「不要擠」，字一起放大等於沒鬆到）。 */
const SIGN = { x0: 620, y0: 165, x1: 660, y1: 325 };
const GLASS = { a: .58, blur: 11 };
const STROKE = 7;
const FS = 104, STAGGER = 22;

/* 尺一：兩行的距離（行高的倍數）。s ＝ 第四版的值。 */
const LHS = { s: 1.06, m: 1.20, l: 1.34 };
/* 尺二：框多大（對第四版的倍率）。s ＝ 第四版的值。
   ⚠ 放大時框心順帶往右下推 —— 純粹以中心放大的話左緣會往回長，
     把上一輪「往右下移」那件事吃掉。 */
const SIZES = { s: 1.00, m: 1.09, l: 1.18 };
const LABEL = { s: "現況", m: "中", l: "大" };
/* 別的頁面引用的那一版（會另存成 hero-current.jpg） */
const DEFAULT = { lh: "m", size: "m", font: "zenmaru" };

const BASE = { cx: 720, cy: 200, w: 352, h: 296, n: 2.6,
               tail: { off: -56, wid: 52, dx: -34, dy: 46 } };
const boxOf = (k) => {
  const z = SIZES[k];
  const cx = BASE.cx + (z - 1) * 130, cy = BASE.cy + (z - 1) * 105;
  const w = BASE.w * z, h = BASE.h * z;
  return { x: cx - w / 2, y: cy - h / 2, w, h, n: BASE.n,
           tail: { cx: cx + BASE.tail.off * z, wid: BASE.tail.wid * z,
                   dx: BASE.tail.dx * z, dy: BASE.tail.dy * z } };
};
const BOXES = {}, GEOS = {}, PATHS = {};
for (const k of ["s", "m", "l"]) {
  BOXES[k] = boxOf(k); GEOS[k] = outline(BOXES[k]); PATHS[k] = closedPath(GEOS[k]);
}

/* 點在不在多邊形裡（射線法）＋ 離邊界多遠。
   ⚠ 換成超橢圓之後不能再用「離邊界幾 px」估，邊界不是直線了，要真的算。 */
const inside = ([px, py], pts) => {
  let on = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) on = !on;
  }
  return on;
};
const clearance = ([px, py], pts) => {
  let best = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    const dx = xj - xi, dy = yj - yi, L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, ((px - xi) * dx + (py - yi) * dy) / L2)) : 0;
    best = Math.min(best, Math.hypot(px - (xi + t * dx), py - (yi + t * dy)));
  }
  return inside([px, py], pts) ? best : -best;
};

for (const k of ["s", "m", "l"]) {
  const B = BOXES[k], G = GEOS[k];
  const tip = G.pts[G.tailI + 1];
  if (tip[0] > SIGN.x0 && tip[0] < SIGN.x1 && tip[1] > SIGN.y0 && tip[1] < SIGN.y1)
    throw new Error(`框「${LABEL[k]}」的尾巴尖端撞到紅招牌了`);
  const xs = G.pts.map((q) => q[0]), ys = G.pts.map((q) => q[1]);
  const left = Math.min(...xs);
  if (left - 430 < 60) throw new Error(`框「${LABEL[k]}」離外牆只有 ${(left - 430).toFixed(0)}px`);
  if (Math.max(...xs) > W - 8 || left < 8 || Math.max(...ys) > H - 8 || Math.min(...ys) < 8)
    throw new Error(`框「${LABEL[k]}」（含尾巴）超出畫面`);
  console.log(`框「${LABEL[k]}」×${SIZES[k].toFixed(2)}　x ${left.toFixed(0)}~${Math.max(...xs).toFixed(0)}、` +
    `y ${Math.min(...ys).toFixed(0)}~${Math.max(...ys).toFixed(0)}　離外牆 ${(left - 430).toFixed(0)}px　` +
    `尾巴尖端 (${tip.map((v) => v.toFixed(0)).join(", ")})`);
}
if (STROKE * 232 / 1040 < 1.5) throw new Error("框線在聊天室太細");

const page = (fontId, lhKey, sizeKey, inkOnly = false) => {
  const B = BOXES[sizeKey], LH = LHS[lhKey];
  const TX = B.x + B.w / 2, TY = B.y + B.h / 2;
  return `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${inkOnly ? "#fff" : "#000"}}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-CX0 * sc).toFixed(2)}px;top:${(-CY0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
/* ⚠ 玻璃：外層裁切、裡層放一份自己模糊的照片複本。
   backdrop-filter ＋ clip-path 放同一個元素上，模糊會被靜靜丟掉（實測過）。 */
.clip{position:absolute;inset:0;clip-path:path('${PATHS[sizeKey]}')}
.clip img{filter:blur(${GLASS.blur}px) saturate(1.06)}
.tint{position:absolute;inset:0;background:rgba(255,255,255,${GLASS.a})}
svg{position:absolute;inset:0}
.line{stroke:${DEEP};stroke-width:${STROKE}px;fill:none;
  stroke-linejoin:round;stroke-linecap:round}
text{font-family:"${FAM[fontId]}";font-weight:900;font-size:${FS}px;fill:${DEEP};letter-spacing:.04em}
</style>
<div class="w">
  ${inkOnly ? "" : `<img src="data:image/jpeg;base64,${photo64}">
  <div class="clip"><img src="data:image/jpeg;base64,${photo64}"><div class="tint"></div></div>`}
  <svg viewBox="0 0 ${W} ${H}">
    ${inkOnly ? "" : `<path class="line" d="${PATHS[sizeKey]}"/>`}
    <text x="${TX}" y="${TY}" text-anchor="middle" dominant-baseline="central">
      <tspan x="${TX + STAGGER}" dy="${(-FS * LH / 2).toFixed(1)}">芳仁</tspan>
      <tspan x="${TX - STAGGER}" dy="${(FS * LH).toFixed(1)}">哩厚</tspan>
    </text>
  </svg>
</div>`;
};

const chromePath = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;                 /* 一律 headless_shell（第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chromePath });
const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const clip = { x: 0, y: 0, width: W, height: H };
const report = [], skipped = [];

const CASES = [];
for (const lh of ["s", "m", "l"])
  for (const size of ["s", "m", "l"])
    for (const font of ["mplus", "zenmaru", "ntc"])
      CASES.push({ id: `hero-${lh}-${size}-${font}`, lh, size, font });

console.log("\n案                        兩行距離  框      字離框邊  檔案");
for (const c of CASES) {
  /* ⚠⚠ 「擠不擠」要量**墨真正蓋到哪裡**，不能用 getBBox()。
     getBBox() 回的是字面框（含 ascent/descent），拉丁字母的上伸下伸中文用不到，
     這四個字算出來的框比實際的墨高一截 —— 直接拿它判斷「離框邊多遠」，
     現行這一版（一直都好好的）會被算成**超出框外 10.4px**。
     所以另外畫一張「白底黑字、沒有照片也沒有框線」的圖，掃暗像素求墨的範圍。 */
  await p.setContent(page(c.font, c.lh, c.size, true), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const shot = (await p.screenshot({ clip })).toString("base64");
  const m = await p.evaluate(async (src) => {
    const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    const rows = [];
    for (let y = 0; y < cv.height; y++) {
      let any = false;
      for (let x = 0; x < cv.width; x++) {
        if (d[(y * cv.width + x) * 4] < 140) {
          any = true;
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
      rows.push(any);
    }
    /* 兩行中間那一段完全沒有墨的列數 ＝ 眼睛看到的「兩段字的距離」 */
    let gap = 0, best = 0, started = false;
    for (let y = y0; y <= y1; y++) {
      if (rows[y]) { if (started) best = Math.max(best, gap); gap = 0; started = true; }
      else if (started) gap++;
    }
    return { x0, x1, y0, y1, lineGap: best };
  }, "data:image/png;base64," + shot);
  m.fs = FS;
  const pts = GEOS[c.size].pts;
  const corners = [[m.x0, m.y0], [m.x1, m.y0], [m.x0, m.y1], [m.x1, m.y1]];
  const clear = Math.min(...corners.map((q) => clearance(q, pts)));
  /* 字的四角要留在框裡，而且離框線還有餘裕（框線本身 7px 佔一半）。
     ⚠⚠ 不到就**跳過這一格、不出圖**，切換條會自己把它變成不能點的。
     使用者要的是「兩行分開一點」＋「框大一點」，所以「行距拉開但框沒跟著大」
     本來就不該是一個選項 —— 給出去的每一格都要是「選了就能上線」的（第八節）。 */
  if (clear < 10) {
    skipped.push({ ...c, clear: +clear.toFixed(1) });
    console.log(`${c.id.padEnd(25)} — 跳過：字離框邊只有 ${clear.toFixed(1)}px（要 ≥10）`);
    continue;
  }

  await p.setContent(page(c.font, c.lh, c.size), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 86, clip });

  const onChat = m.fs * 232 / 1040;
  if (onChat < 11) throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px`);
  const kb = fs.statSync(file).size / 1024;
  const B = BOXES[c.size];
  report.push({ ...c,
    lhLabel: LABEL[c.lh], sizeLabel: LABEL[c.size],
    lhRatio: LHS[c.lh], sizeZoom: SIZES[c.size],
    boxW: Math.round(B.w), boxH: Math.round(B.h),
    lineGap: +m.lineGap.toFixed(0), lineGapOnChat: +(m.lineGap * 232 / 1040).toFixed(1),
    clear: +clear.toFixed(0),
    fs: m.fs, onChat: +onChat.toFixed(1), stroke: STROKE,
    strokeOnChat: +(STROKE * 232 / 1040).toFixed(2),
    glassA: GLASS.a, glassBlur: GLASS.blur, nExp: BASE.n, kb: Math.round(kb) });
  console.log(`${c.id.padEnd(25)} ${String(report.at(-1).lineGap).padStart(4)}px    ` +
    `${Math.round(B.w)}×${Math.round(B.h)}  ${clear.toFixed(0).padStart(4)}px    ${kb.toFixed(0)}KB`);
}
await browser.close();
/* ⚠⚠ 別的頁面（preview/line-reply/）要引用「目前這一版的頭圖」。
   直接寫檔名的話，每次改尺、改命名規則它就變成破圖，而且**不會報錯**——
   2026-09-03 已經壞過兩次。所以固定另存一份 hero-current.jpg，
   別的頁面一律指這一個，命名規則怎麼改都不會再壞。 */
const DEFAULT_ID = `hero-${DEFAULT.lh}-${DEFAULT.size}-${DEFAULT.font}`;
if (!report.some((r) => r.id === DEFAULT_ID))
  throw new Error(`預設那一格 ${DEFAULT_ID} 沒有出圖 —— hero-current.jpg 會是舊的`);
fs.copyFileSync(path.join(OUT, `${DEFAULT_ID}.jpg`), path.join(OUT, "hero-current.jpg"));
console.log(`hero-current.jpg ← ${DEFAULT_ID}.jpg（給 preview/line-reply/ 引用）`);

fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
if (!report.length) throw new Error("一張都沒出 —— 尺的範圍全都過不了守門");
for (const k of ["s", "m", "l"]) {
  if (!report.some((r) => r.lh === k)) throw new Error(`行距「${LABEL[k]}」一格都出不了`);
  if (!report.some((r) => r.size === k)) throw new Error(`框「${LABEL[k]}」一格都出不了`);
}
if (skipped.length) console.log(`\n跳過 ${skipped.length} 格（字會太靠框）：` +
  skipped.map((c) => `行距${LABEL[c.lh]}×框${LABEL[c.size]}`).filter((v, i, a) => a.indexOf(v) === i).join("、"));
const total = report.reduce((s, r) => s + r.kb, 0);
console.log(`\n出圖 ${report.length} 張（${CASES.length} 格裡跳過 ${skipped.length}）→ preview/line-hello/hero-*.jpg，合計 ${(total / 1024).toFixed(1)}MB`);
