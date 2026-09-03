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
     診所外牆右緣 x≈430、**一樓飾邊**（掛著「芳仁牙醫診所」那條深色橫帶）
     x 55~430／y 386~408、劉家紅招牌 x 620~660／y 165~325、遮陽棚上緣 y≈360。

   ✅ 2026-09-03 第四輪：使用者在提案頁上選了「更開 × 更大」並說「這樣可以」，
     所以那兩把尺**收成寫死的值、從切換條上拿掉**（同 head-search 那一輪的做法）。
     剩下的一件事是他同時提的：
       「那個延伸角形指向感覺是對著右邊的車頭，把它改成對著一樓飾邊的位置。」
     → 尾巴改成用 **aim（指著哪一點）** 指定，見 bubble.mjs 的說明。 */
const SIGN = { x0: 620, y0: 165, x1: 660, y1: 325 };      /* 劉家的紅招牌，別戳到 */
const FASCIA = { x0: 55, y0: 386, x1: 430, y1: 408 };     /* 一樓飾邊 —— 尾巴要指這裡 */
const AIM = [395, 397];                                   /* 飾邊靠右那一段，就是他畫的箭頭指的位置 */
const GLASS = { a: .58, blur: 11 };
const STROKE = 7;
const FS = 104, STAGGER = 22;
/* 驚嘆號：使用者 2026-09-03「哩厚後面可以加一個斜的驚嘆號看看」。
   ⚠ 它**不放在同一個 <text> 裡** —— 那一行是 text-anchor:middle，加進去會把「哩厚」
     整個往左推（等於順手動了上一輪定案的 ±22 錯位）。所以另外一個 <text>，
     位置由**量到的「哩厚」右緣**決定，「哩厚」一格都不動。
   ⚠ 半形的「!」不是全形的「！」：全形在 CJK 字型裡兩側各留一大塊空，
     轉了角度之後那塊空會把它推得離「厚」很遠。 */
const BANG = { ch: "!", deg: 12, gap: 16, dy: 0, scale: .86 };

/* ✅ 定案：兩行的距離「更開」、框「更大」（＝ 前一版的 1.18 倍） */
const LH = 1.34;
/* 尾巴：接在 .78π（左下）、根部弧長 62、長 70。
   ⚠⚠ 這一組是**使用者選的**，不是算出來的。我一度自作主張改成 52／88
     （理由是「往左指的時候 62／70 讀起來鈍」），他看過之後指名要原本那一組：
     「我喜歡這個版本，以這個版本為主。」—— 而他指的正是 62／70 那一張。
     **不要再用「比值 1.6 比較像尾巴」這種理由改回去。** */
const TAIL_T = .78, TAIL_W = 62, TAIL_L = 70;
const BOX = { x: 535.7, y: 44.2, w: 415.4, h: 349.3, n: 2.6,
              tail: { t: TAIL_T, wid: TAIL_W, len: TAIL_L, aim: AIM } };

const GEO = outline(BOX);
const CLOSED = closedPath(GEO);
const TX = BOX.x + BOX.w / 2, TY = BOX.y + BOX.h / 2;

/* 點在不在多邊形裡（射線法）＋ 離邊界多遠。
   ⚠ 邊界是曲線，不能用「離框幾 px」估，要真的算。 */
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

{
  const tip = GEO.tip;
  /* ⚠⚠ 這一條是這一輪的重點：尾巴要指著**一樓飾邊**，不是右邊那台車。
     方向是由 AIM 算出來的，所以只要驗 AIM 真的落在飾邊上就夠了 ——
     日後框放大或形狀微調，尾巴會自己跟著轉，不必再試角度。 */
  if (AIM[0] < FASCIA.x0 || AIM[0] > FASCIA.x1 || AIM[1] < FASCIA.y0 || AIM[1] > FASCIA.y1)
    throw new Error(`尾巴指的 (${AIM}) 不在一樓飾邊上`);
  if (tip[0] > SIGN.x0 && tip[0] < SIGN.x1 && tip[1] > SIGN.y0 && tip[1] < SIGN.y1)
    throw new Error("尾巴的尖端撞到紅招牌了");
  const xs = GEO.pts.map((q) => q[0]), ys = GEO.pts.map((q) => q[1]);
  const left = Math.min(...xs);
  /* ⚠⚠ 「離外牆多遠」要量**框身**，不能把尾巴算進去 —— 尾巴現在本來就是往診所伸的，
     那是這一輪要的效果。把兩件事混在一起量，尾巴一拉長就會被自己的守門擋下來。 */
  const bodyLeft = Math.min(...GEO.pts.filter((_, i) => i !== GEO.tailI + 1).map((q) => q[0]));
  if (bodyLeft - 430 < 60) throw new Error(`框身離外牆只有 ${(bodyLeft - 430).toFixed(0)}px`);
  if (GEO.tip[0] < 445) throw new Error(`尾巴的尖端 x=${GEO.tip[0].toFixed(0)} 壓到診所外牆上了`);
  if (Math.max(...xs) > W - 8 || left < 8 || Math.max(...ys) > H - 8 || Math.min(...ys) < 8)
    throw new Error("對話框（含尾巴）超出畫面");
  if (STROKE * 232 / 1040 < 1.5) throw new Error("框線在聊天室太細");
  console.log(`框身 x ${bodyLeft.toFixed(0)}~${Math.max(...xs).toFixed(0)}、y ${Math.min(...ys).toFixed(0)}~${Math.max(...ys).toFixed(0)}` +
    `　離外牆 ${(bodyLeft - 430).toFixed(0)}px　行高 ${LH}`);
  console.log(`尾巴接在 ${BOX.tail.t}π（左下）、長 ${BOX.tail.len}px、尖端 (${tip.map((v) => v.toFixed(0)).join(", ")})、` +
    `指向 ${(GEO.aimAng * 180 / Math.PI).toFixed(0)}° → 一樓飾邊 (${AIM})`);
}

const page = (fontId, inkOnly = false, bang = null) => {
  return `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${inkOnly ? "#fff" : "#000"}}
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
  ${inkOnly ? "" : `<img src="data:image/jpeg;base64,${photo64}">
  <div class="clip"><img src="data:image/jpeg;base64,${photo64}"><div class="tint"></div></div>`}
  <svg viewBox="0 0 ${W} ${H}">
    ${inkOnly ? "" : `<path class="line" d="${CLOSED}"/>`}
    <text x="${TX}" y="${TY}" text-anchor="middle" dominant-baseline="central">
      <tspan x="${TX + STAGGER}" dy="${(-FS * LH / 2).toFixed(1)}">芳仁</tspan>
      <tspan x="${TX - STAGGER}" dy="${(FS * LH).toFixed(1)}">哩厚</tspan>
    </text>
    ${bang ? `<text x="${bang.x.toFixed(1)}" y="${bang.y.toFixed(1)}" text-anchor="start"
      font-size="${(FS * BANG.scale).toFixed(1)}px"
      transform="rotate(${BANG.deg} ${bang.x.toFixed(1)} ${bang.y.toFixed(1)})">${BANG.ch}</text>` : ""}
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

/* ✅ 兩把尺已定案，這一輪只剩字體 */
/* ✅ 全部定案了：字體 Zen Maru 圓體（使用者指名的那一張就是它，逐像素比對過）。
   只出這一張，不再出另外兩支字體 —— 留著會變成沒有人引用的孤兒檔。 */
const CASES = [{ id: "hero-zenmaru", font: "zenmaru" }];

console.log("\n案                兩行之間  字離框邊  檔案");
for (const c of CASES) {
  /* ⚠⚠ 「擠不擠」要量**墨真正蓋到哪裡**，不能用 getBBox()。
     getBBox() 回的是字面框（含拉丁字母的 ascent/descent），中文用不到那麼多 ——
     直接拿它判斷「離框邊多遠」，先前那一版（畫面上一直好好的）會被算成
     「超出框外 10.4px」。所以另外畫一張「白底黑字、沒有照片也沒有框線」掃暗像素。 */
  /* ⚠⚠ 驚嘆號要接在「哩厚」的**右緣**，那個右緣要**量**不要算：
     SVG 的 letter-spacing 會在最後一個字後面也加一次，用「字數 × 字級」估會少一截。
     所以先畫一次沒有驚嘆號的，量第二行的 bbox，再把位置算出來重畫。 */
  await p.setContent(page(c.font, true), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  /* ⚠⚠ 用 getStartPositionOfChar／getEndPositionOfChar 取**基線**與**右緣**。
     getBBox() 回的是版面框（em box），底邊在基線**下面**一大截 —— 拿它當基線，
     驚嘆號會整個掉到「哩厚」下方，而且會把墨推出框外 8px（守門擋下來過）。 */
  const line2 = await p.evaluate(() => {
    const t = [...document.querySelectorAll("text tspan")][1];
    const n = t.getComputedTextLength ? t.textContent.length : 0;
    return { right: t.getEndPositionOfChar(n - 1).x, base: t.getStartPositionOfChar(0).y };
  });
  const bang = { x: line2.right + BANG.gap, y: line2.base + BANG.dy };

  /* 掃暗像素，回墨的外框與「中間完全沒有墨的最長一段」 */
  const scan = async () => {
    const shot = (await p.screenshot({ clip })).toString("base64");
    return p.evaluate(async (src) => {
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
      let gap = 0, best = 0, started = false;
      for (let y = y0; y <= y1; y++) {
        if (rows[y]) { if (started) best = Math.max(best, gap); gap = 0; started = true; }
        else if (started) gap++;
      }
      return { x0, x1, y0, y1, lineGap: best };
    }, "data:image/png;base64," + shot);
  };

  /* ⚠⚠ 「兩行之間」要量**沒有驚嘆號**的那一張。
     驚嘆號站在第二行的基線上、往上長，橫向掃描會掃到它，量出來從 45px 掉到 16px ——
     那不是兩行變近了，是**量錯了東西**。兩件事分兩張圖量：
       兩行的距離 → 沒有驚嘆號的（此時畫面還停在上一次 setContent）
       字離框邊   → 有驚嘆號的（驚嘆號也是墨，一定要算進去） */
  const noBang = await scan();

  await p.setContent(page(c.font, true, bang), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const m = await scan();
  m.lineGap = noBang.lineGap;

  const corners = [[m.x0, m.y0], [m.x1, m.y0], [m.x0, m.y1], [m.x1, m.y1]];
  const clear = Math.min(...corners.map((q) => clearance(q, GEO.pts)));
  if (clear < 10) throw new Error(`${c.id} 字離框邊只有 ${clear.toFixed(1)}px（要 ≥10）`);

  await p.setContent(page(c.font, false, bang), { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${c.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip });

  const onChat = FS * 232 / 1040;
  if (onChat < 11) throw new Error(`${c.id} 字在聊天室只有 ${onChat.toFixed(1)}px`);
  const kb = fs.statSync(file).size / 1024;
  report.push({ ...c,
    lineGap: +m.lineGap.toFixed(0), lineGapOnChat: +(m.lineGap * 232 / 1040).toFixed(1),
    clear: +clear.toFixed(0), lhRatio: LH,
    boxW: Math.round(BOX.w), boxH: Math.round(BOX.h),
    bang: BANG.ch, bangDeg: BANG.deg,
    tailAim: AIM, tailAng: +(GEO.aimAng * 180 / Math.PI).toFixed(0),
    tailTip: GEO.tip.map((v) => +v.toFixed(0)),
    fs: FS, onChat: +onChat.toFixed(1), stroke: STROKE,
    strokeOnChat: +(STROKE * 232 / 1040).toFixed(2),
    glassA: GLASS.a, glassBlur: GLASS.blur, nExp: BOX.n, kb: Math.round(kb) });
  console.log(`${c.id.padEnd(17)} ${String(m.lineGap).padStart(4)}px    ${clear.toFixed(0).padStart(4)}px    ${kb.toFixed(0)}KB`);
}
await browser.close();

/* ⚠⚠ 別的頁面（preview/line-reply/）要引用「目前這一版的頭圖」。
   直接寫當下的檔名，每次改尺或改命名規則它就變成破圖，而且**不會報錯**——
   2026-09-03 已經壞過兩次。固定另存一份 hero-current.jpg，別的頁面一律指它。 */
const DEFAULT_ID = "hero-zenmaru";
if (!report.some((r) => r.id === DEFAULT_ID))
  throw new Error(`預設那一格 ${DEFAULT_ID} 沒有出圖 —— hero-current.jpg 會是舊的`);
fs.copyFileSync(path.join(OUT, `${DEFAULT_ID}.jpg`), path.join(OUT, "hero-current.jpg"));

fs.writeFileSync(path.join(HERE, "report.json"), JSON.stringify(report, null, 2));
console.log(`\nhero-current.jpg ← ${DEFAULT_ID}.jpg（給 preview/line-reply/ 引用）`);
console.log(`出圖 ${report.length} 張 → preview/line-hello/hero-*.jpg`);
