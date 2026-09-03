#!/usr/bin/env node
/* 招呼圖卡的頭圖：Ⓒ3b 的街景 ＋ 白色玻璃遮罩 ＋「芳仁／哩厚」
 *   node drafts/line-hello/generate.mjs
 * 產出 preview/line-hello/hero-<缺口>-<字體>.jpg（各 1040×520 ＝ Flex 頭圖的 2:1）
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
import { outline, closedPath, openPath } from "./bubble.mjs";

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

   ✅ 2026-09-03 使用者定案：
     「介於圓角矩形和膠囊之間的形狀，風格要像 Tully's 那張照片下方的手繪對話框，
       一筆劃最後帶一個小缺口，比較有人畫的感覺。玻璃濃度是中。」
   → 圓角 **92**（圓角矩形是 44、膠囊是 144，取中間）
   → 描邊是**開放路徑**、收尾留缺口；填色仍然封閉（不然玻璃會漏出去）
   → 玻璃回到「中」（白 .58、模糊 11） */
const BOX = { x: 512, y: 26, w: 344, h: 288, r: 92,
              tail: { cx: 640, wid: 52, dx: -30, dy: 48 } };
const SIGN = { x0: 620, y0: 165, x1: 660, y1: 325 };
const GLASS = { a: .58, blur: 11 };
const STROKE = 7;
const FS = 104, LH = 1.06, STAGGER = 22;
const GAPS = { s: .028, m: .048, l: .075 };
/* ⚠⚠ 缺口擺在哪裡，和它多大一樣要緊。
   第一版用 .06，算出來落在**上緣正中央**（x 641，框心 684 附近）——
   對稱的位置讀起來像印壞了，不像有人畫到最後把筆提起來。
   .16 落在上緣、右上圓角**之前**（x 749，圓角從 764 起）：偏一邊、在一段長直線上，
   而且那一段的底是乾淨的天空，232px 縮下去也讀得出來。 */
const GAPSTART = .16;
const GAPLABEL0 = { s: "小", m: "中", l: "大" };

/* 周長（給缺口的守門換算成 px 用） */
const PERIMETER = (() => {
  const r = Math.min(BOX.r, BOX.w / 2, BOX.h / 2);
  return 2 * (BOX.w - 2 * r) + 2 * (BOX.h - 2 * r) + 2 * Math.PI * r;
})();
const PTS = outline(BOX);
const CLOSED = closedPath(PTS);

{
  const tip = [BOX.tail.cx + BOX.tail.dx, BOX.y + BOX.h + BOX.tail.dy];
  if (tip[0] > SIGN.x0 && tip[0] < SIGN.x1 && tip[1] > SIGN.y0 && tip[1] < SIGN.y1)
    throw new Error("尾巴的尖端撞到紅招牌了");
  if (BOX.x - 430 < 60) throw new Error("對話框離外牆只有 " + (BOX.x - 430) + "px");
  if (STROKE * 232 / 1040 < 1.5) throw new Error("框線在聊天室太細");
  console.log("框離外牆 " + (BOX.x - 430) + "px、圓角 " + BOX.r +
    "（圓角矩形 44 ↔ 膠囊 " + (BOX.h / 2) + " 的中間）、框線 " + STROKE +
    "px（聊天室 " + (STROKE * 232 / 1040).toFixed(2) + "px）、尾巴尖端 (" +
    tip[0].toFixed(0) + ", " + tip[1].toFixed(0) + ")");
}

/* 缺口的位置守門：三件事都要成立，否則它讀起來就不是「筆提起來」。
   ⚠ 這一段是實際去看那一段路徑落在哪裡，不是重算一次幾何 —— 圓角、尾巴一改就會移位。 */
{
  const n = PTS.length, s0 = Math.round(n * GAPSTART);
  const near = (k) => PTS[((k % n) + n) % n];
  for (const g of ["s", "m", "l"]) {
    const keep = Math.round(n * (1 - GAPS[g]));
    const a = near(s0), b = near(s0 + keep - 1);
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
    /* ① 要在上緣的直線段上（不在圓角、不在尾巴、不在有字的那一半） */
    if (Math.abs(cy - BOX.y) > 3)
      throw new Error(`缺口「${GAPLABEL0[g]}」不在上緣（落在 ${cx.toFixed(0)}, ${cy.toFixed(0)}）`);
    if (cx < BOX.x + BOX.r || cx > BOX.x + BOX.w - BOX.r)
      throw new Error(`缺口「${GAPLABEL0[g]}」壓到圓角了（x ${cx.toFixed(0)}）`);
    /* ② 不可以落在正中央 —— 對稱就讀成印壞了 */
    const off = Math.abs(cx - (BOX.x + BOX.w / 2));
    if (off < 40) throw new Error(`缺口「${GAPLABEL0[g]}」離框心只有 ${off.toFixed(0)}px，太對稱`);
    /* ③ 兩端都要離尾巴的根部夠遠 */
    const tailL = BOX.tail.cx - BOX.tail.wid / 2 - 30, tailR = BOX.tail.cx + BOX.tail.wid / 2 + 30;
    for (const [px, py] of [a, b])
      if (py > BOX.y + BOX.h - 3 && px > tailL && px < tailR)
        throw new Error(`缺口「${GAPLABEL0[g]}」開在尾巴根部`);
  }
  const keepM = Math.round(n * (1 - GAPS.m));
  const a = near(s0), b = near(s0 + keepM - 1);
  console.log(`缺口開在上緣 x ${((a[0] + b[0]) / 2).toFixed(0)}（框心 ${(BOX.x + BOX.w / 2).toFixed(0)}、右上圓角從 ${(BOX.x + BOX.w - BOX.r).toFixed(0)} 起）`);
}

const TX = BOX.x + BOX.w / 2, TY = BOX.y + BOX.h / 2;

const page = (fontId, gapKey, withPhoto = true) => {
  const open = openPath(PTS, GAPS[gapKey], GAPSTART);
  return `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-CX0 * sc).toFixed(2)}px;top:${(-CY0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
/* ⚠ 玻璃：外層裁切、裡層放一份自己模糊的照片複本。
   backdrop-filter ＋ clip-path 放同一個元素上，模糊會被靜靜丟掉（實測過）。 */
.clip{position:absolute;inset:0;clip-path:path('${CLOSED}')}
.clip img{filter:blur(${GLASS.blur}px) saturate(1.06)}
.tint{position:absolute;inset:0;background:rgba(255,255,255,${GLASS.a})}
svg{position:absolute;inset:0}
.line{stroke:${DEEP};stroke-width:${STROKE}px;fill:none;
  stroke-linejoin:round;stroke-linecap:round}
text{font-family:"${FAM[fontId]}";font-weight:900;font-size:${FS}px;fill:${DEEP};letter-spacing:.04em}
</style>
<div class="w">
  ${withPhoto ? `<img src="data:image/jpeg;base64,${photo64}">` : ""}
  ${withPhoto ? `<div class="clip"><img src="data:image/jpeg;base64,${photo64}"><div class="tint"></div></div>` : ""}
  <svg viewBox="0 0 ${W} ${H}">
    <path class="line" d="${open}"/>
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
const report = [];
const GAPLABEL = { s: "小", m: "中", l: "大" };
const GAPMEASURE = {};   /* 缺口的實測值，量完之後併進 report 給預覽頁的面板用 */

const CASES = [];
for (const gap of ["s", "m", "l"])
  for (const font of ["mplus", "zenmaru", "ntc"])
    CASES.push({ id: `hero-${gap}-${font}`, gap, font });

/* 缺口到底畫出來沒有：把描邊單獨畫在黑底上，量白色像素比封閉版少多少 */
{
  const strokeOnly = (dPath) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0}html,body{width:${W}px;height:${H}px;background:#000;overflow:hidden}
svg{position:absolute;inset:0}path{stroke:#fff;stroke-width:${STROKE}px;fill:none;
stroke-linejoin:round;stroke-linecap:round}</style>
<svg viewBox="0 0 ${W} ${H}"><path d="${dPath}"/></svg>`;
  const ink = async (dPath) => {
    await p.setContent(strokeOnly(dPath), { waitUntil: "load" });
    const b64 = (await p.screenshot({ clip })).toString("base64");
    return p.evaluate(async (s) => {
      const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = s; });
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
      const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
      const d = cx.getImageData(0, 0, cv.width, cv.height).data;
      let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200) n++;
      return n;
    }, "data:image/png;base64," + b64);
  };
  const full = await ink(CLOSED);
  for (const g of ["s", "m", "l"]) {
    const cut = await ink(openPath(PTS, GAPS[g], GAPSTART));
    const pct = (1 - cut / full) * 100;
    /* ⚠⚠ 量到的減量本來就會**少於**缺口的名目比例：stroke-linecap:round 會在
       開放路徑的兩端各補一個半圓，加起來約等於一個線寬的墨。
       所以判準不是比例，是**眼睛真正看得到的缺口有幾 px**：
         看得到的缺口 ≈ 缺口的弧長 − 線寬（兩個半圓合起來填掉一個線寬）
       低於 12px 就只是一個小缺角、讀不出「筆畫沒接回去」。 */
    const gapPx = GAPS[g] * PERIMETER;
    const visible = gapPx - STROKE;
    console.log(`缺口「${GAPLABEL[g]}」：弧長 ${gapPx.toFixed(0)}px、看得到 ${visible.toFixed(0)}px` +
      `（聊天室 ${(visible * 232 / 1040).toFixed(1)}px）　描邊的墨少了 ${pct.toFixed(1)}%`);
    if (visible < 12) throw new Error(`缺口「${GAPLABEL[g]}」看得到的只有 ${visible.toFixed(0)}px，太小`);
    GAPMEASURE[g] = { gapPx: +gapPx.toFixed(0), visiblePx: +visible.toFixed(0),
                      visibleOnChat: +(visible * 232 / 1040).toFixed(1), inkDrop: +pct.toFixed(1) };
    if (pct <= 0) throw new Error(`缺口「${GAPLABEL[g]}」根本沒少墨 —— 開放路徑沒生效`);
  }
}

console.log("案                    缺口  字在聊天室  檔案");
for (const c of CASES) {
  await p.setContent(page(c.font, c.gap), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });
  const box = await p.evaluate(() => {
    const t = document.querySelector("text"); const r = t.getBBox();
    return { fs: parseFloat(getComputedStyle(t).fontSize) };
  });
  const onChat = box.fs * 232 / 1040;
  if (onChat < 11) throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px`);
  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c, ...GAPMEASURE[c.gap], gapLabel: GAPLABEL[c.gap], gapPct: +(GAPS[c.gap] * 100).toFixed(1),
                fs: box.fs, onChat: +onChat.toFixed(1), stroke: STROKE,
                strokeOnChat: +(STROKE * 232 / 1040).toFixed(2),
                glassA: GLASS.a, glassBlur: GLASS.blur, r: BOX.r, kb: Math.round(kb) });
  console.log(`${c.id.padEnd(21)} ${GAPLABEL[c.gap]}     ${onChat.toFixed(1)}px      ${kb.toFixed(0)}KB`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n出圖 ${CASES.length} 張 → preview/line-hello/hero-*.jpg`);
