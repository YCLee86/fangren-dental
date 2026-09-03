#!/usr/bin/env node
/* 招呼圖卡的頭圖：Ⓒ3b 的街景 ＋ 白色玻璃遮罩 ＋「芳仁／哩厚」
 *   node drafts/line-hello/generate.mjs
 * 產出 preview/line-hello/hero-<字體>-<玻璃>.jpg（各 1040×520 ＝ Flex 頭圖的 2:1）
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

/* ⚠⚠ 乾淨區是**量出來的**（逐列／逐行掃「有多少 % 的像素 L* ≥ 70」）：x 480~960、y 0~340。
   三個要避開的東西：x≈440 診所右牆的邊、**x≈640 劉家那支招牌的柱子**（只有 60% 夠亮）、
   x≥980 右邊公寓的暗部。所以面板放在柱子**右邊**，整塊落在灰樓的亮牆與天空上。
   ⚠ 面板一定要整塊落在乾淨區裡 —— backdrop-filter 的模糊會把框外的暗色吸進來，
     壓到遮陽棚的話下緣會糊掉一塊（第一版就是這樣）。 */
const CLEAN = { x0: 480, y0: 0, x1: 960, y1: 340 };
const PANEL = { x: 688, y: 40, w: 272, h: 264, r: 24 };
if (PANEL.x < CLEAN.x0 || PANEL.x + PANEL.w > CLEAN.x1
    || PANEL.y < CLEAN.y0 || PANEL.y + PANEL.h > CLEAN.y1) {
  throw new Error("遮罩 x" + PANEL.x + "~" + (PANEL.x + PANEL.w)
    + " y" + PANEL.y + "~" + (PANEL.y + PANEL.h)
    + " 超出量到的乾淨區 x" + CLEAN.x0 + "~" + CLEAN.x1 + " y" + CLEAN.y0 + "~" + CLEAN.y1
    + " —— 邊緣的模糊會把暗色吸進來");
}
const GLASS = {
  none: { a: 0,   blur: 0,  label: "不加玻璃" },
  soft: { a: .34, blur: 7,  label: "淡" },
  mid:  { a: .58, blur: 11, label: "中" },
  hard: { a: .80, blur: 15, label: "濃" },
};

const page = (fontId, g, withText, withPanel) => `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-CX0 * sc).toFixed(2)}px;top:${(-CY0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
.g{position:absolute;left:${PANEL.x}px;top:${PANEL.y}px;width:${PANEL.w}px;height:${PANEL.h}px;
  border-radius:${PANEL.r}px;background:rgba(255,255,255,${g.a});
  ${g.blur ? `backdrop-filter:blur(${g.blur}px) saturate(1.06);` : ""}
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.06em}
.g b{display:block;font-family:"${FAM[fontId]}";font-weight:900;font-size:88px;line-height:1.16;
  color:${withText ? DEEP : "transparent"};letter-spacing:.04em;text-indent:.04em}
</style>
<div class="w">
  <img src="data:image/jpeg;base64,${photo64}">
  ${withPanel ? `<div class="g"><b>芳仁</b><b>哩厚</b></div>` : ""}
</div>`;

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

/* 沒有遮罩的底圖，拿來驗「玻璃到底有沒有生效」 */
await p.setContent(page("ntc", GLASS.none, false, false), { waitUntil: "load" });
const bareB64 = (await p.screenshot({ clip })).toString("base64");

const stat = async (shotB64, box) => p.evaluate(async ({ s, b }) => {
  const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = s; });
  const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
  const d = cx.getImageData(b.x, b.y, b.w, b.h).data;
  const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  let sum = 0, n = 0; const vals = [];
  for (let i = 0; i < d.length; i += 4) {
    const y = .2126 * lin(d[i]) + .7152 * lin(d[i + 1]) + .0722 * lin(d[i + 2]);
    sum += y; n++; vals.push(y);
  }
  const mean = sum / n;
  const varc = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
  return { mean, sd: Math.sqrt(varc) };
}, { s: "data:image/png;base64," + shotB64, b: box });

/* 只量玻璃的邊緣一圈（避開中央的字），才看得出模糊與提亮 */
const RING = { x: PANEL.x + 8, y: PANEL.y + 8, w: PANEL.w - 16, h: 34 };
const bare = await stat(bareB64, RING);

const CASES = [];
for (const font of ["mplus", "zenmaru", "ntc"])
  for (const gk of ["none", "soft", "mid", "hard"])
    CASES.push({ id: `hero-${font}-${gk}`, font, gk });

const report = [];
console.log(`底圖那一圈：亮度 ${bare.mean.toFixed(3)}　起伏 ${bare.sd.toFixed(4)}`);
console.log("案                    玻璃  提亮      模糊(起伏降幅)  字在聊天室  檔案");
for (const c of CASES) {
  const g = GLASS[c.gk];
  await p.setContent(page(c.font, g, true, true), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });

  const shotB64 = (await p.screenshot({ clip })).toString("base64");
  const m = await stat(shotB64, RING);
  const lift = m.mean - bare.mean;
  const drop = (1 - m.sd / bare.sd) * 100;

  /* 字實際多大（量字面框，不是字級） */
  const box = await p.evaluate(() => {
    const bs = [...document.querySelectorAll(".g b")];
    const r0 = bs[0].getBoundingClientRect(), r1 = bs[bs.length - 1].getBoundingClientRect();
    return { w: Math.round(r0.width), h: Math.round(r1.bottom - r0.top), fs: parseFloat(getComputedStyle(bs[0]).fontSize) };
  });
  const onChat = box.fs * 232 / 1040;

  /* ⚠ 守門：宣告了玻璃就一定要看得到效果，不然是 backdrop-filter 被靜靜忽略 */
  if (g.a > 0 && lift < .02)
    throw new Error(`${c.id} 玻璃沒有提亮（${lift.toFixed(4)}）—— 遮罩八成沒生效`);
  if (g.blur > 0 && drop < 15)
    throw new Error(`${c.id} 起伏只降 ${drop.toFixed(0)}% —— backdrop-filter 八成被忽略了`);
  if (onChat < 11)
    throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px，低於 11px 的下限`);

  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c, glass: g.label, alpha: g.a, blur: g.blur,
                lift: +lift.toFixed(4), drop: +drop.toFixed(1),
                fs: box.fs, onChat: +onChat.toFixed(1), kb: Math.round(kb) });
  console.log(`${c.id.padEnd(21)} ${g.label.padEnd(5)} ${lift >= 0 ? "+" : ""}${lift.toFixed(3)}` +
    `   ${drop >= 0 ? " " : ""}${drop.toFixed(0)}%          ${onChat.toFixed(1)}px      ${kb.toFixed(0)}KB`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n出圖 ${CASES.length} 張 → preview/line-hello/hero-*.jpg`);
