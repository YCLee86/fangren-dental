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
import { bubble } from "./bubble.mjs";

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
   框放在建築右邊的天空，尾巴往左下指到外牆 —— 尾巴不可以穿過紅招牌。

   ⚠⚠⚠ 2026-09-03 這一版整個換掉了。前一版是「有機的抖動輪廓」，使用者：
     「現在的對話框變得好怪喔」，並給了四張參考（Tully's 問卷卡／JR Suica 海報／
     かまわぬ 傳單／無印良品海報）。四張的共同點是：
       ・框是**乾淨的幾何形**（圓角矩形、膠囊、角狀多邊形），不是不規則的曲線
       ・尾巴是**短短的三角形**，直邊
       ・底是**實的**，不是半透明的玻璃
     最早那張 YEBISU 的「手繪感」講的是**線的質感**，不是輪廓要抖 —— 我讀錯了。
   ⚠ 通則：參考圖要看「它像什麼」，不要抓一個形容詞去發揮。 */
const BOX = { x: 512, y: 26, w: 344, h: 288 };
const SIGN = { x0: 620, y0: 165, x1: 660, y1: 325 };   /* 劉家那支紅招牌 */

/* 四種做法。fill: "white" ＝ 白底綠字綠框；"green" ＝ 綠底白字（かまわぬ 那種實心） */
const LOOKS = {
  round:   { label: "圓角矩形", fill: "white",
             geo: { ...BOX, shape: "round", r: 44, tail: { cx: 600, wid: 54, dx: -30, dy: 50 } } },
  stadium: { label: "膠囊",     fill: "white",
             geo: { ...BOX, shape: "stadium", tail: { cx: 684, wid: 40, dx: -46, dy: 50 } } },
  poly:    { label: "角狀",     fill: "white",
             geo: { ...BOX, shape: "poly", sides: 9, jitter: .07, seed: 2,
                    tail: { wid: 54, dx: -26, dy: 54 } } },
  polyG:   { label: "角狀・綠底", fill: "green",
             geo: { ...BOX, shape: "poly", sides: 9, jitter: .07, seed: 2,
                    tail: { wid: 54, dx: -26, dy: 54 } } },
};
const STROKE = 7;               /* 均勻細線（×0.223 → 聊天室 1.56px），參考圖都是均勻的 */
const FS = 104, LH = 1.06;
const STAGGER = 22;             /* 兩行刻意錯開：芳仁往右、哩厚往左 */
const FILL_A = .93;             /* 底幾乎是實的（四張參考都不是半透明） */

/* 守門：尾巴不可以撞到紅招牌 */
for (const [k, L] of Object.entries(LOOKS)) {
  const d = bubble(L.geo);
  const ys = [...d.matchAll(/[ ,](-?\d+\.?\d*) (-?\d+\.?\d*)/g)].map((m) => [+m[1], +m[2]]);
  const low = ys.filter((p) => p[1] > BOX.y + BOX.h - 4);     /* 尾巴那一帶 */
  const hit = low.some((p) => p[0] > SIGN.x0 && p[0] < SIGN.x1 && p[1] > SIGN.y0 && p[1] < SIGN.y1);
  if (hit) throw new Error(k + " 的尾巴撞到紅招牌了");
}
if (BOX.x - 430 < 60) throw new Error("對話框離外牆只有 " + (BOX.x - 430) + "px，太擠");
if (STROKE * 232 / 1040 < 1.5) throw new Error("框線在聊天室只有 " + (STROKE * 232 / 1040).toFixed(2) + "px");
console.log("框離外牆 " + (BOX.x - 430) + "px、框線 " + STROKE + "px（聊天室 " +
  (STROKE * 232 / 1040).toFixed(2) + "px）、四種形狀都沒撞到招牌");

const TX = BOX.x + BOX.w / 2, TY = BOX.y + BOX.h / 2;

const page = (fontId, lookKey, withPhoto = true) => {
  const L = LOOKS[lookKey];
  const d = bubble(L.geo);
  const green = L.fill === "green";
  const ink = green ? "#ffffff" : DEEP;          /* 綠底就用白字（かまわぬ 那張的做法） */
  const bg = green ? DEEP : "#ffffff";
  return `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-CX0 * sc).toFixed(2)}px;top:${(-CY0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
svg{position:absolute;inset:0}
.body{fill:${bg};fill-opacity:${FILL_A}}
.line{stroke:${green ? "none" : DEEP};stroke-width:${STROKE}px;fill:none;
  stroke-linejoin:round;stroke-linecap:round}
text{font-family:"${FAM[fontId]}";font-weight:900;font-size:${FS}px;fill:${ink};letter-spacing:.04em}
</style>
<div class="w">
  ${withPhoto ? `<img src="data:image/jpeg;base64,${photo64}">` : ""}
  <svg viewBox="0 0 ${W} ${H}">
    <path class="body" d="${d}"/>
    <path class="line" d="${d}"/>
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

const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const Yof = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const crf = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);

const CASES = [];
for (const look of Object.keys(LOOKS))
  for (const font of ["mplus", "zenmaru", "ntc"])
    CASES.push({ id: `hero-${look}-${font}`, look, font });

console.log("案                      形狀        字在聊天室  框裡的字對底  檔案");
for (const c of CASES) {
  await p.setContent(page(c.font, c.look), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });

  const box = await p.evaluate(() => {
    const t = document.querySelector("text"); const r = t.getBBox();
    return { w: Math.round(r.width), h: Math.round(r.height), fs: parseFloat(getComputedStyle(t).fontSize) };
  });
  const onChat = box.fs * 232 / 1040;
  if (onChat < 11) throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px`);

  /* 框裡是實底，所以字對底的對比是算得準的定值 —— 直接算，不必量像素 */
  const green = LOOKS[c.look].fill === "green";
  const Ybg = green ? Yof(0x2c, 0x52, 0x38) : 1, Yink = green ? 1 : Yof(0x2c, 0x52, 0x38);
  const contrast = crf(Yink, Ybg);
  if (contrast < 4.5) throw new Error(`${c.id} 字對底只有 ${contrast.toFixed(2)}`);

  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c, look: c.look, lookLabel: LOOKS[c.look].label, fill: LOOKS[c.look].fill,
                fs: box.fs, onChat: +onChat.toFixed(1), stroke: STROKE,
                strokeOnChat: +(STROKE * 232 / 1040).toFixed(2),
                contrast: +contrast.toFixed(2), kb: Math.round(kb) });
  console.log(`${c.id.padEnd(23)} ${LOOKS[c.look].label.padEnd(7)} ${onChat.toFixed(1)}px      ${contrast.toFixed(2)}        ${kb.toFixed(0)}KB`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n出圖 ${CASES.length} 張 → preview/line-hello/hero-*.jpg`);
