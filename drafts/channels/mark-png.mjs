/* 按鈕上那顆 logo → preview/line-welcome/mark-{white,green}.png
 *   node drafts/channels/mark-png.mjs
 *
 * 使用者 2026-09-03 指定兩顆按鈕都「加 logo」。
 * ⚠⚠ LINE Flex 的 `button` **不支援圖示** —— 它只有一個 label。
 *   要圖示＋文字，做法是把按鈕做成一個**可點的 box**（box 掛 action），
 *   裡面放 image ＋ text。代價是失去按鈕內建的按壓效果，換來完全的排版控制。
 *
 * ⚠⚠ 2026-09-03 稍晚：**兩顆按鈕改用兩個不同的形狀**（使用者：「介紹芳仁給朋友的
 *   logo 選 shape_r2c3」）。
 *     點這裡綁定    → index.html 頁首那一條（＝ brand/shapes/mark，長寬比 2.029）
 *     介紹芳仁給朋友 → brand/shapes/shape-r2c3.svg（細長那一顆，長寬比 3.081）
 *   ⚠ 顏色仍然是兩種底各一顆（白疊在實心綠上、深階疊在外框按鈕的卡片底色上）——
 *     透明底的暗綠疊在綠底上會看不見，所以不能只做一顆。
 * ⚠ 綁定那一顆取的是 **index.html 頁首那一條**（和 tools/logo-png.mjs 同一條，理由見那支
 *   檔頭第 3 點：icon.svg 的牙洞是為了扛 iOS 柔化調過的，那是裝置補償）。
 * ⚠⚠ **兩張圖用同一個高度輸出**（79px），Flex 那邊也用「同高」去算寬度 ——
 *   形狀並排時眼睛比的是高度，照寬度對齊的話細長那顆會矮一截、看起來小很多。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-welcome");
const PH = 79;                         /* 兩張圖共用的輸出高度（白那顆原本就是 160×79） */

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/* 來源一：index.html 頁首那個 <svg> —— 路徑與外層的 transform 都要抄 */
const headerMark = () => {
  const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
  const svgTag = home.match(/<svg[^>]*viewBox="0 0 44\.2873 21\.8244"[^>]*>[\s\S]*?<\/svg>/);
  if (!svgTag) throw new Error("index.html 裡找不到頁首那個標誌 <svg>");
  const d = (svgTag[0].match(/\sd="([^"]+)"/) || [])[1];
  if (!d) throw new Error("頁首的標誌 <svg> 裡找不到 <path d=…>");
  /* ⚠⚠ 那條路徑的座標**不在 viewBox 裡**（實際落在 x 231~280、y 332~356），
     是靠外層 <g transform="translate(…)"> 搬進 0 0 44.2873 21.8244 的。
     只抄 <path d> 會畫出一張**全透明的圖，而且不報錯** —— 檔案照樣產生、
     尺寸也對，只是什麼都沒有。所以那個 transform 一定要一起抄。 */
  const gt = (svgTag[0].match(/<g\s+transform="([^"]+)"/) || [])[1];
  if (!gt) throw new Error("頁首的標誌 <svg> 裡找不到外層 <g transform=…>");
  return { d, gt, ratio: 2.02918, where: "index.html 頁首" };
};

/* 來源二：brand/shapes/<名字>.svg —— 那些檔一樣是「一條路徑 ＋ 一個外層 transform」，
   ⚠ 它的 transform 帶 scale(1 -1)（PDF 的座標系是 y 往上），所以**不能只讀 translate**。 */
const brandShape = (name) => {
  const file = path.join(ROOT, "brand", "shapes", name + ".svg");
  const svg = fs.readFileSync(file, "utf8");
  const d = (svg.match(/\sd="([^"]+)"/) || [])[1];
  if (!d) throw new Error(`${name}.svg 裡找不到 <path d=…>`);
  const gt = (svg.match(/<g\s+transform="([^"]+)"/) || [])[1];
  if (!gt) throw new Error(`${name}.svg 裡找不到外層 <g transform=…>`);
  const vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
  if (vb.length !== 2) throw new Error(`${name}.svg 的 viewBox 讀不出來`);
  return { d, gt, ratio: vb[0] / vb[1], where: `brand/shapes/${name}.svg` };
};

/* ⚠ 白＝實心綠按鈕上（綁定）、深階＝外框按鈕上（介紹給朋友）。
   形狀是使用者各自指定的，**不是同一顆換顏色**。 */
const CASES = [
  { name: "white", color: "#ffffff", src: headerMark() },
  { name: "green", color: "#2c5238", src: brandShape("shape-r2c3") },
  /* ⚠⚠ 2026-09-05 新增：**頁首那一條的深階版**，給取消卡的白底鈕用
       （使用者：「按錯惹的 logo 是現在主要的那個」）。
     ⚠ `mark-green.png` **不是**主要那顆 —— 它是招呼卡「介紹芳仁給朋友」
       用的 shape-r2c3（細長那一顆）。名字容易誤導，**要主要那顆就用這一張**。 */
  { name: "head-green", color: "#2c5238", src: headerMark() },
];

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;      /* ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

/* 用瀏覽器量一次路徑的真實外框（getBBox），再拿量到的框當 viewBox。
   ⚠ 頁首那一條量出來和它的 viewBox 完全一樣（44.287 × 21.824）—— 所以照抄 viewBox
     其實也對。留著這段量測是當守門用：路徑哪天被換掉、或 viewBox 被改動，
     這裡會先 throw，而不是靜靜出一張被切掉的圖。
   ⚠⚠ 一度以為圖被切了，是因為我用「path 的數字奇偶位當 x/y」手算座標範圍 ——
     那個算法對這條路徑是錯的（不是每個指令都兩個數）。**要量就用 getBBox，
     不要自己拆 path 的數字。** */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mark-"));
const report = [];
for (const c of CASES) {
  const { d, gt, ratio: want, where } = c.src;
  /* ⚠⚠ 外層的 transform 不見得只有 translate（brand/shapes 那些帶 scale(1 -1)），
     所以「畫面上的外框」不能用手算 —— 讓瀏覽器連 transform 一起量。 */
  /* ⚠⚠ `getBBox()` 回的是**元素自己座標系**裡的框 —— 對 `<g transform>` 呼叫它，
     它自己那個 transform **不算在內**（子元素的才算）。所以要在外面再包一層 `<g>`
     去量，量到的才是畫面上的位置。
     ⚠ 踩過：直接量那個 `<g>`，頁首那顆回的是路徑的原始座標（x 231~280、y 332~356），
       拿它當 viewBox 就把整張圖框在空白處 —— 出來是一張全透明的圖。
       （舊版是手動加 translate 的兩個數字才對，那招對帶 scale(1 -1) 的
       brand/shapes 就不成立了。） */
  await page.setContent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">` +
    `<g id="outer"><g transform="${gt}"><path d="${d}"/></g></g></svg>`);
  const box = await page.evaluate(() => {
    const r = document.getElementById("outer").getBBox();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const ratio = box.w / box.h;
  if (Math.abs(ratio - want) > .01)
    throw new Error(`${c.name}：量到的長寬比 ${ratio.toFixed(4)} 對不上 ${want.toFixed(5)}（形狀被切了？）`);
  const PW = Math.round(PH * ratio);

  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${gt}"><path fill="${c.color}" fill-rule="evenodd" d="${d}"/></g>
</svg>`;
  const pg = path.join(tmp, c.name + ".html"), png = path.join(tmp, c.name + ".png");
  fs.writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}` +
    `svg{display:block;width:${PW}px;height:${PH}px}</style>${svg}`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });

  const buf = fs.readFileSync(png);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (w !== PW || h !== PH) throw new Error(`${c.name}：出圖 ${w}×${h}，該是 ${PW}×${PH}`);
  if (buf.length < 900) throw new Error(`${c.name}：檔案只有 ${buf.length} 位元組 —— 多半是全透明的空圖`);
  fs.copyFileSync(png, path.join(OUT, `mark-${c.name}.png`));

  /* 墨佔多少（不透明的像素比例）—— 兩顆並排時「一樣高」不等於「一樣重」，
     這個數字是用來判斷細長那顆會不會看起來更胖的。 */
  const ink = await page.evaluate(async (src) => {
    const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const a = cx.getImageData(0, 0, cv.width, cv.height).data;
    let n = 0; for (let i = 3; i < a.length; i += 4) if (a[i] > 127) n++;
    return n / (cv.width * cv.height);
  }, "data:image/png;base64," + buf.toString("base64"));

  report.push({ ...c, w, h, ratio, kb: buf.length / 1024, where, ink, box });
  console.log(`mark-${c.name}.png　${w}×${h}　長寬比 ${ratio.toFixed(4)}　` +
    `墨 ${(ink * 100).toFixed(1)}%　${(buf.length / 1024).toFixed(1)}KB　${c.color}　← ${where}`);
}
await browser.close();

/* Flex 那邊要填的兩個值：aspectRatio ＝ 長寬比、size ＝ **寬**。
   ⚠ size 給的是寬度，所以「兩顆一樣高」要各自換算，不能兩顆都寫 34px。 */
const H = 34 / report[0].ratio;                 /* 綁定那顆現在的高度 */
console.log(`\n按鈕上要一樣高 ＝ ${H.toFixed(2)}px：`);
for (const r of report)
  console.log(`  ${r.name}　size ${Math.round(H * r.ratio)}px　` +
    `aspectRatio "${Math.round(r.ratio * 1000)}:1000"　墨面積 ${(r.ink * r.ratio * H * H).toFixed(0)}px²`);
