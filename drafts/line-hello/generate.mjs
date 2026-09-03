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
import { speechBubble, bubbleStrokes } from "./bubble.mjs";

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
     診所外牆右緣 x≈430（y 100~390）、屋簷右尖 (440, 90)
     劉家那支紅招牌 x 620~660、y 165~325
     右邊灰樓的牆 x 700~960、y 60~390
     遮陽棚上緣 y≈360
   對話框放在建築右邊的天空，**尾巴往左下指到清水模外牆**，
   看起來就是這棟房子在說話。⚠ 尾巴不可以穿過紅招牌 —— 所以框放左邊不放右邊。 */
const BUBBLE = { x: 512, y: 22, w: 344, h: 296, r: 118, amp: 11, seed: 3,
                 tail: { at: .635, spread: .075, len: 70, angle: 150 } };
/* ⚠⚠ 2026-09-03 使用者：「對話框和房子有點擠，那個延伸角形拉好長好怪。」兩件都對：
   ・框原本在 x468，離外牆右緣（x≈430）只有 **38px**  → 挪到 x512，空出 **82px**
   ・尾巴原本是絕對座標的尖端，實際長 **148px** —— 那是一根刺不是對話框的尾巴
     → 改成「長度＋角度」表示，收到 **70px**、根部加寬（spread .055 → .075）
   九組試過（離房子 38/82/126 × 尾巴 45/70/95）之後定這一組。
   ⚠ 尾巴的角度 150° 是往左下 —— 指向房子那一側。 */
const SIGN = { x0: 620, y0: 165, x1: 660, y1: 325 };   /* 劉家那支紅招牌 */
{
  const rad = BUBBLE.tail.angle * Math.PI / 180;
  /* 尾巴根部大約在下緣左段（見 bubble.mjs 的周長順序），尖端由長度與角度算出來 */
  const bx = BUBBLE.x + 102.5, by = BUBBLE.y + BUBBLE.h;
  const tx = bx + Math.cos(rad) * BUBBLE.tail.len, ty = by + Math.sin(rad) * BUBBLE.tail.len;
  const box = { x0: Math.min(bx, tx), x1: Math.max(bx, tx), y0: Math.min(by, ty), y1: Math.max(by, ty) };
  if (box.x0 < SIGN.x1 && box.x1 > SIGN.x0 && box.y0 < SIGN.y1 && box.y1 > SIGN.y0)
    throw new Error("尾巴撞到紅招牌了 —— 換個角度或把框往左移");
  if (BUBBLE.x - 430 < 60)
    throw new Error("對話框離外牆右緣只有 " + (BUBBLE.x - 430) + "px，太擠（至少 60）");
  if (BUBBLE.tail.len > 90)
    throw new Error("尾巴 " + BUBBLE.tail.len + "px 太長，會變成一根刺（上限 90）");
  console.log("對話框：離外牆 " + (BUBBLE.x - 430) + "px、尾巴 " + BUBBLE.tail.len +
    "px、尖端 (" + tx.toFixed(0) + ", " + ty.toFixed(0) + ")");
}
/* ⚠⚠ 線不再是一個定值：使用者說「好粗，比較不像手繪，很像油漆的感覺」。
   均勻的粗線讀起來就是滾出來的；真的手繪筆壓會變、線寬跟著變。
   做法：把輪廓切成 9 段，每段自己的線寬（8 ± 26%），圓端點讓接縫自然消失。
   ⚠⚠ 光是線變細還不夠 —— 使用者說的「可愛自然」有一半在**形狀**上。
   五組試過之後，圓角 86 → **118**、抖動 5 → **11**：方框感消失，讀起來才是手繪的泡泡。
   實測線寬 5.6~9.3px → 在聊天室 1.21~2.08px（原本是一律 2.23px 的均勻粗線）。 */
const STROKE = { base: 7, vary: .34, n: 9 };
/* ⚠ 兩行刻意錯開：字面框其實完全對齊（量過都是 216.3px 寬、中線 0 偏差），
   看起來錯位是**字本身的墨色分布** —— 「仁」右邊留白多、「厚」填滿整格。
   使用者要的是把它反過來：芳仁往右、哩厚往左。 */
const STAGGER = 22;
const FS = 104, LH = 1.06;      /* 使用者 2026-09-03：「字再大一點」88 → 104 */

const GLASS = {
  none: { a: 0,   blur: 0,  label: "不加玻璃" },
  soft: { a: .34, blur: 7,  label: "淡" },
  mid:  { a: .58, blur: 11, label: "中" },
  hard: { a: .80, blur: 15, label: "濃" },
};

const bubblePath = speechBubble(BUBBLE);
const strokes = bubbleStrokes(BUBBLE, STROKE);
{
  const ws = strokes.map((x) => x.w);
  const onChat = (w) => w * 232 / 1040;
  const avg = ws.reduce((a, b) => a + b, 0) / ws.length;
  console.log(`框線 ${ws.length} 段：${Math.min(...ws)}~${Math.max(...ws)}px → 聊天室 ` +
    `${onChat(Math.min(...ws)).toFixed(2)}~${onChat(Math.max(...ws)).toFixed(2)}px，平均 ${onChat(avg).toFixed(2)}px`);
  if (onChat(avg) < 1.5) throw new Error(`框線平均只有 ${onChat(avg).toFixed(2)}px，太細會看不見`);
  if (onChat(Math.min(...ws)) < 1.1) throw new Error(`最細那一段只有 ${onChat(Math.min(...ws)).toFixed(2)}px，會斷掉`);
}
/* 字排在對話框本體的正中央（不含尾巴） */
const TX = BUBBLE.x + BUBBLE.w / 2, TY = BUBBLE.y + BUBBLE.h / 2;

const page = (fontId, g, withText, withBubble, withPhoto = true) => `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-CX0 * sc).toFixed(2)}px;top:${(-CY0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
svg{position:absolute;inset:0}
/* ⚠⚠⚠ 玻璃**不能**用 backdrop-filter ＋ clip-path 放在同一個元素上 ——
   2026-09-03 實測：白色上得去（RING 亮度 +0.056）但**模糊整個被丟掉**
   （起伏 0.0636 → 0.0637，一點都沒降）。同 CLAUDE.md 第九節第 20 條那一類：
   被裁切的東西上面再掛濾鏡，瀏覽器會靜靜地不畫，而且不報錯。
   做法改成：外層只負責裁切，裡面放一份**同樣位置、自己 filter: blur 的照片複本**，
   再疊一層白。這是一般的 filter 不是 backdrop-filter，可靠得多。 */
.clip{position:absolute;inset:0;clip-path:path('${bubblePath}')}
.clip img{filter:blur(${g.blur}px) saturate(1.06)}
.tint{position:absolute;inset:0;background:rgba(255,255,255,${g.a})}
text{font-family:"${FAM[fontId]}";font-weight:900;font-size:${FS}px;
  fill:${withText ? DEEP : "transparent"};letter-spacing:.04em}
.line{stroke:${DEEP};fill:none;stroke-linejoin:round;stroke-linecap:round}
</style>
<div class="w">
  ${withPhoto ? `<img src="data:image/jpeg;base64,${photo64}">` : ""}
  ${withBubble && g.a > 0 ? `<div class="clip">
     <img src="data:image/jpeg;base64,${photo64}"><div class="tint"></div>
   </div>` : ""}
  <svg viewBox="0 0 ${W} ${H}">
    ${withBubble ? strokes.map((x) => `<path class="line" d="${x.d}" stroke-width="${x.w}"/>`).join("") : ""}
    <text x="${TX}" y="${TY}" text-anchor="middle" dominant-baseline="central">
      <tspan x="${TX + STAGGER}" dy="${(-FS * LH / 2).toFixed(1)}">芳仁</tspan>
      <tspan x="${TX - STAGGER}" dy="${(FS * LH).toFixed(1)}">哩厚</tspan>
    </text>
  </svg>
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

/* ⚠ 量「玻璃有沒有生效」要挑對話框裡**沒有字**的一塊 —— 字塊約 x532~748、y58~278，
   所以取**框線與字之間**那一條（框線在 x≈468、字塊從 x532 起，取 x492~526）。
   ⚠ 取整塊會被字的深綠拉低；貼著框放又會量到框線本身
   —— 第一版兩個都踩到了（不加玻璃那一格居然量出「起伏變大 42%」）。 */
/* ⚠⚠ RING 一定要從 BUBBLE 推算，不可以寫死座標 ——
   2026-09-03 踩過：框從 x468 移到 x512，寫死的 RING 就落到框外面去了，
   量出「玻璃沒有提亮」的假警報。**跟著別人動的東西，就要用別人算出來。** */
const RING = { x: BUBBLE.x + 26, y: BUBBLE.y + 98, w: 32, h: 110 };


const CASES = [];
for (const font of ["mplus", "zenmaru", "ntc"])
  for (const gk of ["none", "soft", "mid", "hard"])
    CASES.push({ id: `hero-${font}-${gk}`, font, gk });

const report = [];
const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const Yof = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const crf = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const Ydeep = Yof(0x2c, 0x52, 0x38);

/* 對話框那條線的遮罩（只有線、沒有照片沒有字），用來量「線壓在什麼亮度上」 */
await p.setContent(page("ntc", GLASS.none, false, true, false)
  .replace("stroke:" + DEEP, "stroke:#fff"), { waitUntil: "load" });
const lineMaskB64 = (await p.screenshot({ clip })).toString("base64");

/* 沒有對話框的底圖（量線的背景用） */
await p.setContent(page("ntc", GLASS.none, false, false), { waitUntil: "load" });
const photoOnlyB64 = (await p.screenshot({ clip })).toString("base64");

const underMask = async (maskB64, bgB64) => p.evaluate(async ({ m, b }) => {
  const load = (d) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = d; });
  const [mi, bi] = await Promise.all([load(m), load(b)]);
  const cv = document.createElement("canvas"); cv.width = mi.width; cv.height = mi.height;
  const cx = cv.getContext("2d");
  cx.drawImage(mi, 0, 0); const M = cx.getImageData(0, 0, cv.width, cv.height).data;
  cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(bi, 0, 0);
  const B = cx.getImageData(0, 0, cv.width, cv.height).data;
  const out = [];
  for (let i = 0; i < M.length; i += 4) if (M[i] > 200) out.push([B[i], B[i + 1], B[i + 2]]);
  return out;
}, { m: "data:image/png;base64," + maskB64, b: "data:image/png;base64," + bgB64 });

const linePx = await underMask(lineMaskB64, photoOnlyB64);
if (linePx.length < 3000) throw new Error(`對話框的線只量到 ${linePx.length} 個像素 —— 八成沒畫出來`);
{
  let bad = 0;
  for (const [r, g, b] of linePx) if (crf(Ydeep, Yof(r, g, b)) < 3) bad++;
  console.log(`對話框那條線：${linePx.length} px，壓在對比低於 3 的地方 ${(bad / linePx.length * 100).toFixed(1)}%`);
  if (bad / linePx.length > 0.12)
    throw new Error(`線有 ${(bad / linePx.length * 100).toFixed(0)}% 落在對比不足的地方 —— 換個落點`);
}


/* ⚠⚠⚠ 模糊要在**有紋理的地方**量，不能在平滑的天空上量。
   2026-09-03 踩過：RING 落在乾淨的天空，而**模糊不會改變平滑漸層的起伏** ——
   量出 0% 降幅，害我以為 backdrop-filter 又被丟掉，其實它一直有生效
   （另外做了一張探測圖，紅招牌明顯糊了）。
   所以拆成兩件各自量：
     ① 模糊 —— 開／關兩張圖在對話框範圍內的平均差異（一次性）
     ② 白底 —— RING 的亮度提升（每一案） */
{
  const bbox = { x: BUBBLE.x, y: BUBBLE.y, w: BUBBLE.w, h: BUBBLE.h };
  const shot = async (blur) => {
    await p.setContent(page("ntc", { a: .001, blur }, false, true), { waitUntil: "load" });
    return (await p.screenshot({ clip })).toString("base64");
  };
  const [on, off] = [await shot(11), await shot(0)];
  const diff = await p.evaluate(async ({ a, b, box }) => {
    const load = (d) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = d; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const cv = document.createElement("canvas"); cv.width = 1040; cv.height = 520;
    const cx = cv.getContext("2d");
    cx.drawImage(ia, 0, 0); const A = cx.getImageData(box.x, box.y, box.w, box.h).data;
    cx.clearRect(0, 0, 1040, 520); cx.drawImage(ib, 0, 0);
    const B = cx.getImageData(box.x, box.y, box.w, box.h).data;
    let sum = 0, n = 0;
    for (let i = 0; i < A.length; i += 4) { sum += Math.abs(A[i] - B[i]); n++; }
    return sum / n;
  }, { a: "data:image/png;base64," + on, b: "data:image/png;base64," + off, box: bbox });
  console.log(`模糊生效檢查：對話框範圍內平均差 ${diff.toFixed(2)} 階（0 ＝ 完全沒作用）`);
  if (diff < 1) throw new Error(`模糊沒有生效（平均差 ${diff.toFixed(2)} 階）—— 濾鏡八成被裁切吃掉了`);
}

console.log("案                    玻璃  白底提亮   字在聊天室  檔案");
let base = null;                         /* 每換一支字體，用它自己的 none 當基準 */
for (const c of CASES) {
  const g = GLASS[c.gk];
  await p.setContent(page(c.font, g, true, true), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });

  const shotB64 = (await p.screenshot({ clip })).toString("base64");
  const m = await stat(shotB64, RING);
  if (c.gk === "none") { base = m; }
  if (!base) throw new Error("還沒有基準 —— CASES 的順序必須讓 none 排在同一支字體的最前面");
  const lift = m.mean - base.mean;
  const drop = (1 - m.sd / base.sd) * 100;

  /* 字實際多大（量 SVG 的字面框，不是字級） */
  const box = await p.evaluate(() => {
    const t = document.querySelector("text");
    const r = t.getBBox();
    return { w: Math.round(r.width), h: Math.round(r.height),
             fs: parseFloat(getComputedStyle(t).fontSize) };
  });
  const onChat = box.fs * 232 / 1040;

  if (g.a > 0 && lift < .02)
    throw new Error(`${c.id} 玻璃沒有提亮（${lift.toFixed(4)}）—— 遮罩八成沒生效`);
  if (onChat < 11)
    throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px，低於 11px 的下限`);
  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c, glass: g.label, alpha: g.a, blur: g.blur,
                lift: +lift.toFixed(4), drop: +drop.toFixed(1),
                fs: box.fs, tw: box.w, th: box.h, onChat: +onChat.toFixed(1),
                lineOnChat: +(STROKE.base * 232 / 1040).toFixed(2), kb: Math.round(kb) });
  console.log(`${c.id.padEnd(21)} ${g.label.padEnd(5)} ${lift >= 0 ? "+" : ""}${lift.toFixed(3)}    ${onChat.toFixed(1)}px      ${kb.toFixed(0)}KB`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n出圖 ${CASES.length} 張 → preview/line-hello/hero-*.jpg`);
