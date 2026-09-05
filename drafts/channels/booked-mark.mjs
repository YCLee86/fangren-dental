/* 約診卡上那顆「浮水印」標誌 → preview/line-booked/wm-<形狀>-<濃度>.png
 *   node drafts/channels/booked-mark.mjs
 *
 * 使用者 2026-09-04：「我也不喜歡本來的 logo 在頁首，LINE 裡可以設置對話框浮水印嗎」
 * 稍晚：「我們有 9 個 logo，可以自動選擇不同的浮水印嗎」。
 *
 * ⚠⚠⚠ **聊天室的背景設不了**（channels/README 第 21-12 節）—— 那是每個使用者
 *   在自己手機上設的、而且只有他自己看得到。做得到的是**卡片自己裡面**。
 * ⚠⚠ **Flex 的 box 沒有背景圖**（`background` 只認 `linearGradient`），
 *   所以浮水印只能是一個 `image` ＋ `position: absolute`。
 * ⚠⚠ **Flex 的 image 沒有 opacity** —— 淡是**烘進 PNG 的 alpha 裡**的。
 *
 * 那九顆 ＝ `brand/shapes/shape-r{1,2,3}c{1,2,3}.svg`（九宮格，照畫面位置命名）。
 * ⚠ **`r1c2` 就是站上頁首那顆 `mark`**（brand/README 第一節），所以「九顆」裡
 *   本來就含著現在用的那一顆，不是第十顆。
 *
 * ⚠⚠⚠ **九顆不能用同一個寬度**：它們有四種長寬比（1.00／1.33／2.03／3.08），
 *   同寬的話細長那幾顆會矮一大截、看起來輕很多。招呼卡那一輪（第 18-10 節）已經
 *   學過一次：**「粗」是墨量不是厚度**。所以這裡**按墨的面積正規化** ——
 *   每一顆各自算一個寬度，讓九顆的**墨面積相同**（＝視覺重量相同）。
 *   基準是 `r1c2` 在 150px 寬時的墨面積（＝ 2026-09-04 那一版的浮水印）。
 * ⚠ 算出來的寬度寫進 `wm-sizes.json`，提案頁與日後的 Flex JSON 都讀它，
 *   **不要在別的地方再寫一份**。
 *
 * ⚠ 顏色是品牌真值 `#3f654a`（PALETTE.md 一般牙科的套色），**沒有新增顏色**。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-booked");
const GREEN = "#3f654a";      /* 頁首那顆標誌用的品牌真值（浮水印改成逐顆上色，見下） */

/* ---- 每一顆浮水印自己的顏色（2026-09-05）-----------------------------
   使用者：「浮水印現在是有點綠灰底，能不能每個浮水印的顏色不一樣，隨機輪播？」
   ⚠⚠ **顏色一個都沒有新增** —— 全部是站上七科的**套色**（PALETTE 第六節，
     填實的塊用套色不用深階）。九顆配七色，所以有兩色各用兩次。
   ⚠⚠⚠ **顏色綁在「形狀」上，不是另外抽一次**，理由有兩個：
     ① 第 22-13 節已經算過：**顏色若用「日期 mod 7」，相差 7／14／21 天
        的兩筆一定同色**（任何 a·月＋b·日 mod 7 都躲不掉），而七天正是
        真的會發生的回診間隔。綁在形狀上，就直接繼承 mod 9 那組好性質
        （7／14／21／28／30 天都不撞）。
     ② 第 22-13 節那五對「裁切之後幾乎分不出來」的形狀，**指定成不同顏色
        就分得出來了** —— 顏色不只是變化，它同時修掉上一輪那個已知缺陷。
   ⚠ 因此下面這張表的每一個配對都要滿足：那五對彼此顏色不同。
     （r1c1×r3c1、r1c3×r2c3、r3c1×r3c2、r1c1×r3c2、r1c2×r2c1） */
const SPEC = {
  general: "#3f654a", perio: "#317d78", kids: "#c28229", endo: "#ae4f4d",
  prosth:  "#465885", surg:  "#8e6299", ortho: "#4478b5"
};
/* ⚠⚠⚠ 九顆配七色 → **一定有兩色各用兩次**，而「哪兩對共用」是量出來的不是挑的：
   先把顏色壓掉只比形狀（`filter: brightness(0)`，alpha 不動），
   取**形狀本來就差最多**的兩對來共用 —— 實測
   `r1c1×r3c3 69.1%`、`r2c3×r3c1 61.1%`（只看有墨的像素）。
   反過來，形狀最像的三對（`r2c2×r3c2 5%`、`r1c1×r3c1 14.3%`、`r1c3×r2c3 14.3%`）
   一定要給不同的顏色 —— 下面那道守門就是擋這個。 */
const SHAPE_SPEC = {
  r1c1: "general", r1c2: "perio",  r1c3: "ortho",
  r2c1: "endo",    r2c2: "prosth", r2c3: "surg",
  r3c1: "surg",    r3c2: "kids",   r3c3: "general"
};
/* 形狀本來就分不出來的那幾對，顏色一定要不一樣 —— 改表的人會被擋下來 */
for (const [a, b] of [["r2c2","r3c2"],["r1c1","r3c1"],["r1c3","r2c3"],
                      ["r3c1","r3c2"],["r1c1","r3c2"],["r1c2","r2c1"]])
  if (SHAPE_SPEC[a] === SHAPE_SPEC[b])
    throw new Error(`${a} 和 ${b} 是「裁切之後分不出來」的一對，顏色不可以一樣`);

/* 墨壓在浮水印最濃處還讀不讀得到 —— 每一色 × 每一濃度都先算過再出圖 */
const INK = "#2a2c27", SOFT = "#5c5f57", CARD = "#f4f4f5";
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const lum = (rgb) => .2126 * lin(rgb[0]) + .7152 * lin(rgb[1]) + .0722 * lin(rgb[2]);
const cr = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
const ALPHAS = [["08", .08], ["12", .12], ["18", .18]];
const BASE = "r1c2";          /* 基準形狀 ＝ 站上頁首那顆 */
const BASE_W = 150;           /* 它在卡片上的顯示寬度（2026-09-04 那一版） */
const DPR = 2.8;              /* 出圖倍率（150 × 2.8 = 420，同前一版） */
const SHAPES = ["r1c1", "r1c2", "r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r3c2", "r3c3"];

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;    /* ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

/* brand/shapes/*.svg ＝ 一條路徑 ＋ 一個外層 transform（帶 scale(1 -1)，PDF 座標系）。
   ⚠ 只抄 <path d> 會畫出一張**全透明、而且不報錯**的圖。 */
const readShape = (name) => {
  const file = path.join(ROOT, "brand", "shapes", "shape-" + name + ".svg");
  const svg = fs.readFileSync(file, "utf8");
  const d = (svg.match(/\sd="([^"]+)"/) || [])[1];
  const gt = (svg.match(/<g\s+transform="([^"]+)"/) || [])[1];
  const vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
  if (!d || !gt || vb.length !== 2) throw new Error(`shape-${name}.svg 讀不出 path／transform／viewBox`);
  return { d, gt, vw: vb[0], vh: vb[1] };
};

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 600, height: 400 } });

/* 第一趟：量每一顆的真實外框與**墨佔外框的比例**。
   ⚠⚠ 要用 getBBox 連 transform 一起量，不要自己拆 path 的數字（mark-png.mjs 檔頭）。 */
const PROBE = 300;                       /* 量墨用的統一寬度，只是中間值 */
const info = {};
for (const name of SHAPES) {
  const { d, gt, vw, vh } = readShape(name);
  await page.setContent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">` +
    `<g id="outer"><g transform="${gt}"><path d="${d}"/></g></g></svg>`);
  const box = await page.evaluate(() => {
    const r = document.getElementById("outer").getBBox();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const ratio = box.w / box.h;
  const want = vw / vh;
  if (Math.abs(ratio - want) > .01)
    throw new Error(`${name}：量到的長寬比 ${ratio.toFixed(4)} 對不上 viewBox 的 ${want.toFixed(4)}`);

  /* 墨佔外框多少 —— 在同一個寬度上量，之後才好換算面積 */
  const ph = Math.round(PROBE / ratio);
  await page.setContent(
    `<style>html,body{margin:0}svg{display:block}</style>` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PROBE}" height="${ph}" ` +
    `viewBox="${box.x} ${box.y} ${box.w} ${box.h}">` +
    `<g transform="${gt}"><path fill="#000" fill-rule="evenodd" d="${d}"/></g></svg>`);
  const cov = await page.evaluate(async (a) => {
    const w = a.w, h = a.h;
    const svg = new XMLSerializer().serializeToString(document.querySelector("svg"));
    const img = await new Promise((r) => {
      const i = new Image(); i.onload = () => r(i);
      i.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    });
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0, w, h);
    const p = cx.getImageData(0, 0, w, h).data;
    let n = 0; for (let i = 3; i < p.length; i += 4) if (p[i] > 127) n++;
    return n / (w * h);
  }, { w: PROBE, h: ph });
  if (cov < .2 || cov > .95)
    throw new Error(`${name}：墨佔外框 ${(cov * 100).toFixed(1)}% —— 空圖或牙洞沒挖穿？`);
  info[name] = { box, gt, d, ratio, cov };
}

/* 第二趟：按**墨面積**算每一顆的顯示寬度。
   墨面積 ＝ 寬 × 高 × 墨佔比 ＝ 寬² ÷ 長寬比 × 墨佔比，所以
     寬 = sqrt(目標面積 × 長寬比 ÷ 墨佔比) */
const b = info[BASE];
const TARGET = BASE_W * BASE_W / b.ratio * b.cov;
for (const name of SHAPES)
  info[name].w = Math.round(Math.sqrt(TARGET * info[name].ratio / info[name].cov));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wm-"));
const rows = [];
for (const name of SHAPES) {
  const { box, gt, d, ratio, cov, w: cssW } = info[name];
  const PW = Math.round(cssW * DPR), PH = Math.round(PW / ratio);
  if (PW > 1024 || PH > 1024) throw new Error(`${name}：${PW}×${PH} 超過 LINE 對 image 的 1024 上限`);
  const COLOR = SPEC[SHAPE_SPEC[name]];
  for (const [tag, a] of ALPHAS) {
    /* 最壞底色 ＝ 卡色與這一色按濃度混合；墨壓上去要過 AA */
    const mixed = hex(CARD).map((c, i) => c * (1 - a) + hex(COLOR)[i] * a);
    /* ⚠⚠ 墨**和柔墨都要算**：2026-09-05 起預約成功那一則也有浮水印，
       而壓在它上面的是**小字（柔墨 #5c5f57）**不是日期。
       柔墨對卡色本來就只有 5.92，餘裕比墨（12.84）小得多 —— 只驗墨會漏掉。 */
    for (const [nm2, fg] of [["墨", INK], ["柔墨", SOFT]]) {
      const r2 = cr(hex(fg), mixed);
      if (r2 < 4.5)
        throw new Error(`${name}-${tag}（${COLOR}）：${nm2}壓在最濃處只有 ${r2.toFixed(2)}`);
    }
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${gt}"><path fill="${COLOR}" fill-opacity="${a}" fill-rule="evenodd" d="${d}"/></g>
</svg>`;
    const pg = path.join(tmp, `${name}-${tag}.html`), png = path.join(tmp, `${name}-${tag}.png`);
    fs.writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}` +
      `svg{display:block;width:${PW}px;height:${PH}px}</style>${svg}`, "utf8");
    execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
      "--force-color-profile=srgb", "--default-background-color=00000000",
      `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });

    const buf = fs.readFileSync(png);
    if (buf.readUInt32BE(16) !== PW || buf.readUInt32BE(20) !== PH)
      throw new Error(`${name}-${tag}：出圖尺寸不對`);
    /* ⚠ 守門不能只看檔案大小（淡圖本來就小）—— 要真的看 alpha 的最濃處。 */
    const st = await page.evaluate(async (src) => {
      const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
      const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
      const p = cx.getImageData(0, 0, cv.width, cv.height).data;
      let ink = 0, max = 0;
      for (let i = 3; i < p.length; i += 4) { if (p[i] > 2) ink++; if (p[i] > max) max = p[i]; }
      return { ink: ink / (cv.width * cv.height), max };
    }, "data:image/png;base64," + buf.toString("base64"));
    const wantA = Math.round(a * 255);
    if (Math.abs(st.max - wantA) > 3) throw new Error(`${name}-${tag}：最濃 alpha ${st.max}，該是 ${wantA}`);
    if (Math.abs(st.ink - cov) > .04)
      throw new Error(`${name}-${tag}：墨佔 ${(st.ink * 100).toFixed(1)}%，第一趟量到 ${(cov * 100).toFixed(1)}%`);
    fs.copyFileSync(png, path.join(OUT, `wm-${name}-${tag}.png`));
  }
  rows.push({ name, w: cssW, h: +(cssW / ratio).toFixed(1), ratio: +ratio.toFixed(3),
              cov: +(cov * 100).toFixed(1), png: `${PW}×${PH}` });
}
/* ---- 卡片頂端那顆標誌（2026-09-05）-----------------------------------
   使用者：「原版的診所 logo 在對話框頭的樣子好醜，那個大小可以多大呢，
   現在做的好小。」
   ⚠⚠ 廠商那一張的標誌**是咖啡色的**（從他的截圖逐像素叢集：ink ≈ #9b7254），
     而同一個聊天室的頭像是品牌綠 #3f654a —— 不是我們挑的顏色，是量出來的。
   ⚠ 這一顆和上面那九顆浮水印不同：**不透明**（alpha 1）、只出 BASE 那一形，
     而且出得夠大（720 寬）讓卡片上放到 240px 都還是 3× 銳利。 */
{
  const { box, gt, d, ratio } = info[BASE];
  const PW = 720, PH = Math.round(PW / ratio);
  if (PW > 1024 || PH > 1024) throw new Error("頁首標誌超過 LINE 的 1024 上限");
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${gt}"><path fill="${GREEN}" fill-rule="evenodd" d="${d}"/></g>
</svg>`;
  const pg = path.join(tmp, "head.html"), png = path.join(tmp, "head.png");
  fs.writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}` +
    `svg{display:block;width:${PW}px;height:${PH}px}</style>${svg}`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });
  const buf = fs.readFileSync(png);
  if (buf.readUInt32BE(16) !== PW || buf.readUInt32BE(20) !== PH)
    throw new Error("頁首標誌出圖尺寸不對");
  /* 守門：不透明（最濃 alpha 要到 255）＋ 墨佔外框要對得上第一趟量到的 */
  const st = await page.evaluate(async (src) => {
    const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const p = cx.getImageData(0, 0, cv.width, cv.height).data;
    let ink = 0, max = 0;
    for (let i = 3; i < p.length; i += 4) { if (p[i] > 2) ink++; if (p[i] > max) max = p[i]; }
    return { ink: ink / (cv.width * cv.height), max };
  }, "data:image/png;base64," + buf.toString("base64"));
  if (st.max !== 255) throw new Error(`頁首標誌最濃 alpha ${st.max}，該是 255（它不是浮水印）`);
  if (Math.abs(st.ink - info[BASE].cov) > .04)
    throw new Error(`頁首標誌墨佔 ${(st.ink * 100).toFixed(1)}%，第一趟量到 ${(info[BASE].cov * 100).toFixed(1)}%`);
  fs.copyFileSync(png, path.join(OUT, "mark-head.png"));
  console.log(`頁首標誌 mark-head.png　${PW}×${PH}　${GREEN}　不透明　長寬比 ${ratio.toFixed(3)}`);
}

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

/* 寬度表 —— 提案頁與日後的 Flex JSON 都讀這一份，不要再寫第二份。 */
const manifest = {};
for (const r of rows)
  manifest[r.name] = { w: r.w, ratio: r.ratio, spec: SHAPE_SPEC[r.name], color: SPEC[SHAPE_SPEC[r.name]] };
fs.writeFileSync(path.join(OUT, "wm-sizes.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

/* 九顆的墨面積要幾乎一樣（那正是這支腳本在做的事）—— 印出來當驗收。 */
const areas = rows.map((r) => r.w * r.h * r.cov / 100);
const spread = (Math.max(...areas) - Math.min(...areas)) / (areas.reduce((a, x) => a + x, 0) / areas.length);
console.log("✅ 九顆浮水印（brand/shapes 的九宮格，**逐顆上色**，三個濃度）");
console.log("   形狀      長寬比   墨佔外框   顯示寬 × 高      出圖");
for (const r of rows)
  console.log(`   ${r.name}${r.name === BASE ? "*" : " "}    ${r.ratio.toFixed(3)}    ${String(r.cov).padStart(5)}%   ` +
              `${String(r.w).padStart(3)} × ${String(r.h).padStart(5)}    ${r.png}   ` +
              `${SHAPE_SPEC[r.name].padEnd(7)} ${SPEC[SHAPE_SPEC[r.name]]}`);
console.log(`   * ＝ 站上頁首那顆（基準，${BASE_W}px）`);
console.log(`   墨面積離散度 ${(spread * 100).toFixed(2)}%（按面積正規化過，越小越好）`);
if (spread > .02) throw new Error(`九顆的墨面積差 ${(spread * 100).toFixed(1)}% —— 正規化沒生效？`);
console.log(`   共 ${rows.length * ALPHAS.length} 張 ＋ wm-sizes.json`);
