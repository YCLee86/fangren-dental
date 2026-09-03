/* 按鈕上那顆 logo → preview/line-welcome/mark-{white,green}.png
 *   node drafts/channels/mark-png.mjs
 *
 * 使用者 2026-09-03 指定兩顆按鈕都「加 logo」。
 * ⚠⚠ LINE Flex 的 `button` **不支援圖示** —— 它只有一個 label。
 *   要圖示＋文字，做法是把按鈕做成一個**可點的 box**（box 掛 action），
 *   裡面放 image ＋ text。代價是失去按鈕內建的按壓效果，換來完全的排版控制。
 *
 * ⚠ 路徑取的是 **index.html 頁首那一條**（和 tools/logo-png.mjs 同一條，理由見那支
 *   檔頭第 3 點：icon.svg 的牙洞是為了扛 iOS 柔化調過的，那是裝置補償）。
 * ⚠ 兩個顏色是**兩種底**各一顆：
 *     白  → 疊在實心綠的按鈕上
 *     深階 → 疊在外框按鈕的卡片底色上（#2C5238，PALETTE.md 一般牙科的深階）
 *   透明底的暗綠疊在綠底上會看不見，所以不能只做一顆。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-welcome");
const RATIO = 2.02918;                 /* 標誌的長寬比（原始外框 68.6097 × 33.8115 pt） */


const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
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

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;      /* ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

/* 用瀏覽器量一次路徑的真實外框（getBBox），再拿量到的框當 viewBox。
   ⚠ 量出來的結果是：**真實外框和頁首的 viewBox 完全一樣**（44.287 × 21.824）——
     所以照抄 viewBox 其實也對。留著這段量測是當守門用：頁首那條路徑哪天被換掉、
     或 viewBox 被改動，這裡會先 throw，而不是靜靜出一張被切掉的圖。
   ⚠⚠ 一度以為圖被切了，是因為我用「path 的數字奇偶位當 x/y」手算座標範圍 ——
     那個算法對這條路徑是錯的（不是每個指令都兩個數）。**要量就用 getBBox，
     不要自己拆 path 的數字。** */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
await page.setContent(
  `<svg id="s" xmlns="http://www.w3.org/2000/svg" width="300" height="150">` +
  `<g transform="${gt}"><path id="p" d="${d}"/></g></svg>`);
const bb = await page.evaluate(() => {
  const r = document.getElementById("p").getBBox();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
/* 那個 g 的 translate 要一起算進去，才是畫面上的座標 */
const [tx, ty] = gt.match(/-?\d+\.?\d*/g).map(Number);
const box = { x: bb.x + tx, y: bb.y + ty, w: bb.w, h: bb.h };
const ratio = box.w / box.h;
if (Math.abs(ratio - RATIO) > .01)
  throw new Error(`量到的長寬比 ${ratio.toFixed(4)} 對不上 ${RATIO}（形狀被切了？）`);
const PW = 160, PH = Math.round(PW / ratio);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mark-"));
for (const [name, color] of [["white", "#ffffff"], ["green", "#2c5238"]]) {
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${gt}"><path fill="${color}" fill-rule="evenodd" d="${d}"/></g>
</svg>`;
  const pg = path.join(tmp, name + ".html"), png = path.join(tmp, name + ".png");
  fs.writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}` +
    `svg{display:block;width:${PW}px;height:${PH}px}</style>${svg}`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });

  const buf = fs.readFileSync(png);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (w !== PW || h !== PH) throw new Error(`${name}：出圖 ${w}×${h}，該是 ${PW}×${PH}`);
  if (buf.length < 900) throw new Error(`${name}：檔案只有 ${buf.length} 位元組 —— 多半是全透明的空圖`);
  fs.copyFileSync(png, path.join(OUT, `mark-${name}.png`));
  console.log(`mark-${name}.png　${w}×${h}　${(buf.length / 1024).toFixed(1)}KB　${color}`);
}
await browser.close();
console.log(`真實外框 ${box.w.toFixed(3)} × ${box.h.toFixed(3)}　長寬比 ${ratio.toFixed(4)}（頁首 viewBox 說 ${RATIO}）`);
