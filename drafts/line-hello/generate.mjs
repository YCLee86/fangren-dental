#!/usr/bin/env node
/* 招呼圖卡的頭圖：白天的診所街景 ＋ 壓在右邊天空上的「hello／你好」
 *   node drafts/line-hello/generate.mjs
 * 產出 preview/line-hello/hero-*.jpg（各 1040×520 ＝ Flex hero 的 2:1）
 *
 * 使用者 2026-09-03：「照片裡診所建築右邊的街道到右邊緣的房子可以壓上 hello 或是
 * 你好的文字，字體類型像我另外附圖的那種設計感粗體、帶點圓潤邊緣，顏色用診所一般牙科主題色。」
 * 參考圖是 URBAN RESEARCH 的「final sale」海報：幾何、等粗、端點全圓、字重很重。
 *
 * ⚠⚠ 顏色為什麼預設是深階 #2c5238 不是套色 #3f654a：
 *   這顆綠是**中間調**（套色 L* 39.3、深階 L* 31.5），所以壓在照片上的最壞情況
 *   既不是背景最亮處、也不是最暗處，是「背景剛好和它一樣亮」的那些像素 ——
 *   我前兩版都算錯方向。實測那一塊天空：套色有 18.7% 的像素對比低於 4.5，深階只有 6.4%。
 *   這也正是站上的規矩：深階給亮底上的**字**，套色給填實的**塊**。
 *
 * ⚠⚠ 落點是量出來的，不是挑好看的。右半邊掃過五塊，最乾淨的是
 *   「診所右邊那條街的上方天空」（原圖 2000×995 座標的 x990~1560、y90~430，
 *   深階只有 6.4% 不合格）。街屋與招牌那一塊 73.8% 不合格（深色遮陽棚、紅招牌），
 *   灰樓牆面 22.7% —— 那兩塊都不能放字。
 *
 * ⚠⚠⚠ 2026-09-03 稍晚：使用者決定**先處理裁切**，所以這一支產出的圖已經從
 *   preview/ 撤掉了。它壓字的落點 (663,138) 是相對於**未裁切**的整張照片量的 ——
 *   裁法一改，那塊「只有 6.4% 不合格」的乾淨天空就換位置。
 *   **裁法定案之後要做的兩件：把 SPOT 重新量一次、把 CASES 重跑一次。**
 *   量法在 drafts/line-hello/README.md 第五節。
 *
 * ⚠ 中文是近似：M PLUS Rounded 1c 與 Zen Maru Gothic 都是日文圓體，
 *   實測**「你」不在它們的字集裡**（只有「好」）。Google Fonts 沒有圓體的繁中，
 *   所以「你好」用 Noto Sans TC 900 ＋ 一圈同色的圓角描邊逼近。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "preview", "line-hello");
fs.mkdirSync(OUT, { recursive: true });

const PHOTO = path.join(HERE, "source-2080.jpg");
if (!fs.existsSync(PHOTO)) throw new Error(`找不到照片 ${PHOTO}`);
const photo64 = fs.readFileSync(PHOTO).toString("base64");

const FDIR = path.join(HERE, "fonts");
const chunks = JSON.parse(fs.readFileSync(path.join(FDIR, "chunks.json"), "utf8"));
const FAM = { mplus: "MPlus", zenmaru: "ZenMaru", baloo: "Baloo", fredoka: "Fredoka", ntc: "NotoTC" };
const faces = chunks.map((c) => {
  const b64 = fs.readFileSync(path.join(FDIR, c.name)).toString("base64");
  return `@font-face{font-family:"${FAM[c.id]}";font-style:normal;font-weight:900;` +
         `src:url(data:font/woff2;base64,${b64}) format("woff2");unicode-range:${c.ur}}`;
}).join("\n");

const C = { deep: "#2c5238", accent: "#3f654a" };
const W = 1040, H = 520, IW = 2080, IH = 1035;
const sc = Math.max(W / IW, H / IH), pw = IW * sc, ph = IH * sc;
const SPOT = { cx: 663, cy: 138 };

const shell = (body) => `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.wrap{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${((W - pw) / 2).toFixed(2)}px;top:${((H - ph) / 2).toFixed(2)}px;
  width:${pw.toFixed(2)}px;height:${ph.toFixed(2)}px}
svg{position:absolute;inset:0}
</style><div class="wrap">${body}</div>`;

const textSvg = (fam, text, color, size, stroke) =>
  `<svg viewBox="0 0 ${W} ${H}"><text x="${SPOT.cx}" y="${SPOT.cy}" text-anchor="middle"` +
  ` dominant-baseline="central" style="font-family:'${fam}';font-weight:900;font-size:${size}px;` +
  `fill:${color};paint-order:stroke fill;stroke:${color};stroke-width:${stroke}px;` +
  `stroke-linejoin:round;stroke-linecap:round;letter-spacing:-.01em">${text}</text></svg>`;
const IMG = `<img src="data:image/jpeg;base64,${photo64}">`;

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

const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const Yof = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const crf = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);

const CASES = [
  /* 三軸完整交叉：文字 × 字體 × 顏色。⚠ 每一格都要真的出圖 ——
     切換條上按得下去的每一格，按了都必須換到一張不同的圖（第九節第 24、25 條）。 */
  { id: "mplus-hello",        font: "mplus",   text: "hello", color: "deep",   size: 132, stroke: 0 },
  { id: "zenmaru-hello",      font: "zenmaru", text: "hello", color: "deep",   size: 132, stroke: 0 },
  { id: "baloo-hello",        font: "baloo",   text: "hello", color: "deep",   size: 148, stroke: 0 },
  { id: "fredoka-hello",      font: "fredoka", text: "hello", color: "deep",   size: 140, stroke: 0 },
  { id: "mplus-hello-acc",    font: "mplus",   text: "hello", color: "accent", size: 132, stroke: 0 },
  { id: "zenmaru-hello-acc",  font: "zenmaru", text: "hello", color: "accent", size: 132, stroke: 0 },
  { id: "baloo-hello-acc",    font: "baloo",   text: "hello", color: "accent", size: 148, stroke: 0 },
  { id: "fredoka-hello-acc",  font: "fredoka", text: "hello", color: "accent", size: 140, stroke: 0 },
  /* ⚠ 中文那兩支：描邊 3px 是為了逼近圓體；7px 試過，字腔被塞死（900 的中文本來就滿）。
     不描邊那張是對照 —— 乾淨，但就不圓了。 */
  { id: "ntc-nihao",          font: "ntc",     text: "你好",  color: "deep",   size: 108, stroke: 3 },
  { id: "ntc-nihao-acc",      font: "ntc",     text: "你好",  color: "accent", size: 108, stroke: 3 },
  { id: "ntcflat-nihao",      font: "ntc",     text: "你好",  color: "deep",   size: 108, stroke: 0 },
  { id: "ntcflat-nihao-acc",  font: "ntc",     text: "你好",  color: "accent", size: 108, stroke: 0 },
  /* 大小不進切換條（是我加的軸，不是使用者要的）。留兩張當紀錄：
     放大到 168 之後字會伸進右邊那棟灰樓，不合格的比例 2.1% → 14.2%。 */
  { id: "zz-mplus-big",       font: "mplus",   text: "hello", color: "deep",   size: 168, stroke: 0 },
  { id: "zz-mplus-sm",        font: "mplus",   text: "hello", color: "deep",   size: 104, stroke: 0 },
];

const browser = await chromium.launch({ executablePath: chromePath });
const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const clip = { x: 0, y: 0, width: W, height: H };
const report = [];

/* 只有照片的那一張，量背景用（也順便當「沒有字」的對照） */
await p.setContent(shell(IMG), { waitUntil: "load" });
const bgB64 = (await p.screenshot({ clip })).toString("base64");

for (const c of CASES) {
  const fam = FAM[c.font];
  /* ① 字的遮罩：黑底白字，沒有照片 */
  await p.setContent(shell(textSvg(fam, c.text, "#fff", c.size, c.stroke)), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const maskB64 = (await p.screenshot({ clip })).toString("base64");
  /* ② 成品 */
  await p.setContent(shell(IMG + textSvg(fam, c.text, C[c.color], c.size, c.stroke)), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });

  /* ⚠⚠ 判準是「字的筆畫底下那些像素」，不是整塊區域的平均 */
  const px = await p.evaluate(async ({ m, b }) => {
    const load = (d) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = d; });
    const [mi, bi] = await Promise.all([load(m), load(b)]);
    const cv = document.createElement("canvas"); cv.width = mi.width; cv.height = mi.height;
    const cx = cv.getContext("2d");
    cx.drawImage(mi, 0, 0); const M = cx.getImageData(0, 0, cv.width, cv.height).data;
    cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(bi, 0, 0);
    const B = cx.getImageData(0, 0, cv.width, cv.height).data;
    const out = []; let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
    for (let i = 0; i < M.length; i += 4) {
      if (M[i] < 200) continue;
      const q = i / 4, x = q % cv.width, y = (q / cv.width) | 0;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      out.push([B[i], B[i + 1], B[i + 2]]);
    }
    return { px: out, box: [minX, minY, maxX, maxY] };
  }, { m: "data:image/png;base64," + maskB64, b: "data:image/png;base64," + bgB64 });

  if (px.px.length < 2000)
    throw new Error(`${c.id} 只量到 ${px.px.length} 個筆畫像素 —— 字八成沒畫出來（掉字或字型沒載到）`);

  const Yt = Yof(...(c.color === "deep" ? [0x2c, 0x52, 0x38] : [0x3f, 0x65, 0x4a]));
  let bad3 = 0, bad45 = 0, min = 99;
  for (const [r, g, b] of px.px) {
    const v = crf(Yt, Yof(r, g, b));
    if (v < 3) bad3++; if (v < 4.5) bad45++; if (v < min) min = v;
  }
  const n = px.px.length;
  const [x0, y0, x1, y1] = px.box;
  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c, n, bad3: +(bad3 / n * 100).toFixed(1), bad45: +(bad45 / n * 100).toFixed(1),
                min: +min.toFixed(2), box: px.box, kb: Math.round(kb) });
  console.log(`${c.id.padEnd(17)} 字框 ${String(x1 - x0).padStart(3)}×${String(y1 - y0).padStart(3)}` +
    `　筆畫 ${String(n).padStart(6)}px　低於 3 的 ${(bad3 / n * 100).toFixed(1)}%・低於 4.5 的 ${(bad45 / n * 100).toFixed(1)}%` +
    `　最低 ${min.toFixed(2)}　${kb.toFixed(0)}KB`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n出圖 ${CASES.length} 張 → preview/line-hello/`);
