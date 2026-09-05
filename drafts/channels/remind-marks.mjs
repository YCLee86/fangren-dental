#!/usr/bin/env node
/* 提醒卡那兩顆新按鈕的 logo → preview/line-remind/mark-{nogo,tel}.png
 *   node drafts/channels/remind-marks.mjs
 *
 * 使用者 2026-09-04：「(加logo shape_r2c3嘴巴倒過來，牙洞你們看怎麼調)取消按鈕」
 * 以及「按鈕(電話logo+電話號碼)」。
 *
 * ⚠⚠ **主鈕那顆不在這裡** —— 它直接用招呼卡已經產好的
 *   `preview/line-welcome/mark-white.png`（由 drafts/channels/mark-png.mjs 維護）。
 *   同一顆形狀不要產第二份。
 *
 * ⚠⚠⚠ **「牙洞怎麼調」的答案是：不必調，整個翻過去就對了。**
 *   實測三種做法（暫存區那張對照圖）：
 *     Ⓐ 原樣            —— 牙洞在右邊那一葉的**上半**
 *     Ⓑ 整個上下翻      —— 牙洞跟著翻到**下半**，仍然完整包在形狀裡　✅ 定案
 *     Ⓒ 外框翻、牙洞留原位 —— **牙洞整顆不見了**
 *   Ⓒ 不見的原因：外框翻過去之後，牙洞原本的位置落到形狀**外面**，
 *   `fill-rule: evenodd` 就把它算成「本來就沒有墨的地方」——
 *   **不報錯、圖也照樣產生，只是洞消失了**（同 brand-extract.mjs 檔頭那條：
 *   牙洞畫錯會靜靜消失在牙齒裡）。所以「把牙洞留在上面」這條路不存在。
 *
 * ⚠ 翻轉是**繞它自己外框的水平中軸**翻（`translate(0 2cy) scale(1 -1)`），
 *   所以外框一個像素都不動、viewBox 不必重算。
 *
 * ⚠ 話筒取的是**頁尾那一顆**（Font Awesome Free 6 solid，512×512）——
 *   站上「話筒 ＋ 05-5339369」本來就是那一顆配那個號碼，這一顆是同一組。
 *   ⚠ 不是 HERO 窄帶那顆（Lucide 空心線條）：線條圖示縮到按鈕大小會糊，
 *     而且實心的才和標誌那一族（實心色塊）同一種語彙。
 *
 * ⚠ 顏色一律**深階 `#2c5238`** —— 這三顆都在**外框按鈕**上（卡片底色），
 *   同招呼卡 `.btn.line` 那一顆。白色那顆只給實心綠底用。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠ 要量外框一定用 `getBBox()`，不要自己拆 path 的數字（mark-png.mjs 檔頭那條）。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-remind");
const DEEP = "#2c5238";
const PH = 79;                       /* 和 mark-png.mjs 同一個輸出高度 */

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/* 來源一：brand/shapes/shape-r2c3.svg（要上下翻） */
const shapeR2c3 = () => {
  const svg = fs.readFileSync(path.join(ROOT, "brand", "shapes", "shape-r2c3.svg"), "utf8");
  const d = (svg.match(/\sd="([^"]+)"/) || [])[1];
  const gt = (svg.match(/<g\s+transform="([^"]+)"/) || [])[1];
  if (!d || !gt) throw new Error("shape-r2c3.svg 讀不出 path 或外層 transform");
  const vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
  return { d, gt, ratio: vb[0] / vb[1], flip: true, where: "brand/shapes/shape-r2c3.svg（上下翻）" };
};

/* 來源二：index.html 頁尾那顆話筒 */
const footPhone = () => {
  const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
  const i = home.indexOf('class="foot-tel"');
  if (i < 0) throw new Error("index.html 裡找不到 .foot-tel");
  const sv = home.slice(i, i + 1400).match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  if (!sv) throw new Error(".foot-tel 底下找不到 <svg>");
  const d = (sv[2].match(/\sd="([^"]+)"/) || [])[1];
  if (!d) throw new Error("話筒那個 <svg> 裡找不到 <path d=…>");
  /* ⚠ 那一顆是 512×512 的方框，圖形沒有填滿整格 —— viewBox 用量到的外框，
     不要用 512×512（不然按鈕上會有一圈看不見的留白，圖看起來偏小又偏位）。 */
  return { d, gt: "translate(0 0)", ratio: null, flip: false, where: "index.html 頁尾的話筒" };
};

/* 來源三：站上那顆角形（「往下滑」與「回到最上面」用的同一條），**轉成朝右**。
   站上是 18×9 的 `M1 1l8 7 8-7`、筆畫 1.4、圓頭圓角；朝右就是把 x/y 對調：
   在 9×18 的框裡走 (1,1) → (8,9) → (1,17)。
   ⚠⚠ 這一顆是**筆畫不是填色**，所以 `getBBox()` 量不到它的實際範圍
     （那個函式不含 stroke）—— 外框要自己算：筆畫往四面各長出半個 .7。
   ⚠ 為什麼要做成圖檔而不是打一個「›」：Flex 裡的字要靠系統字型，
     那個字在 Android 與 iOS 上長得不一樣、粗細也對不上站上這一支。 */
const CHEV_W = 1.4;
const chevron = () => ({
  d: "M1 1l7 8-7 8", gt: "translate(0 0)", ratio: null, flip: false,
  stroke: CHEV_W, box: { x: 1 - CHEV_W / 2, y: 1 - CHEV_W / 2, w: 7 + CHEV_W, h: 16 + CHEV_W },
  where: "站上「往下滑／回到最上面」那顆角形（轉成朝右）",
});

const CASES = [
  { name: "nogo", color: DEEP, src: shapeR2c3() },
  /* ⚠ 白色那顆是給**取消卡的綠底主鈕**用的（preview/line-cancel/）——
     那一張的語意是反過來的：綠底 ＝「是喔　要取消」（＝不去）。
     形狀與翻轉和上面那顆完全相同，只有顏色不同，**不要另外開一支產生器**。 */
  { name: "nogo-white", color: "#ffffff", src: shapeR2c3() },
  { name: "tel",  color: DEEP, src: footPhone() },
  { name: "chev-white", color: "#ffffff", src: chevron() },
  { name: "chev-deep",  color: DEEP,      src: chevron() },
];

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "remind-mark-"));
const report = [];

for (const c of CASES) {
  const { d, gt, ratio: want, flip, where } = c.src;
  await page.setContent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">` +
    `<g id="outer"><g transform="${gt}"><path d="${d}"/></g></g></svg>`);
  const box = c.src.box || await page.evaluate(() => {
    const r = document.getElementById("outer").getBBox();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const ratio = box.w / box.h;
  if (want != null && Math.abs(ratio - want) > .01)
    throw new Error(`${c.name}：量到的長寬比 ${ratio.toFixed(4)} 對不上 ${want.toFixed(5)}（形狀被切了？）`);

  /* 翻轉繞**自己外框的水平中軸**，所以外框不變、viewBox 照用 */
  const cy = box.y + box.h / 2;
  const wrap = flip ? `translate(0 ${2 * cy}) scale(1 -1)` : "translate(0 0)";
  const PW = Math.round(PH * ratio);
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${wrap}"><g transform="${gt}"><path ${c.src.stroke
      ? `fill="none" stroke="${c.color}" stroke-width="${c.src.stroke}" stroke-linecap="round" stroke-linejoin="round"`
      : `fill="${c.color}" fill-rule="evenodd"`} d="${d}"/></g></g>
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
  /* ⚠ 角形是一條細線，檔案本來就小得多，所以門檻改看「墨佔多少」不是看位元組 */
  if (buf.length < 300) throw new Error(`${c.name}：檔案只有 ${buf.length} 位元組 —— 多半是全透明的空圖`);

  const ink = await page.evaluate(async (src) => {
    const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const a = cx.getImageData(0, 0, cv.width, cv.height).data;
    let n = 0; for (let i = 3; i < a.length; i += 4) if (a[i] > 127) n++;
    return n / (cv.width * cv.height);
  }, "data:image/png;base64," + buf.toString("base64"));

  /* ⚠⚠ 守門：翻過去之後**牙洞一定要還在**。做法是看圖形內部有沒有一塊透明 ——
     只驗「檔案有產生」抓不到這件事（Ⓒ 那個做法出的圖一樣正常，只是沒有洞）。 */
  if (c.name.startsWith("nogo")) {
    const hole = await page.evaluate(async (src) => {
      const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
      const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
      const a = cx.getImageData(0, 0, cv.width, cv.height).data;
      const A = (x, y) => a[(y * cv.width + x) * 4 + 3];
      let n = 0;
      /* 逐列往內掃：左右都遇得到墨、自己卻是透明的像素 ＝ 被包住的洞 */
      for (let y = 0; y < cv.height; y++) {
        let l = -1, r = -1;
        for (let x = 0; x < cv.width; x++) if (A(x, y) > 127) { if (l < 0) l = x; r = x; }
        if (l < 0) continue;
        for (let x = l; x <= r; x++) if (A(x, y) <= 127) n++;
      }
      return n;
    }, "data:image/png;base64," + buf.toString("base64"));
    if (hole < 30)
      throw new Error(`${c.name}：翻過去之後**牙洞不見了**（只量到 ${hole} 個被包住的透明像素）`);
    report.push({ hole });
  }

  if (ink < .02) throw new Error(`${c.name}：墨只有 ${(ink * 100).toFixed(2)}% —— 圖幾乎是空的`);

  fs.copyFileSync(png, path.join(OUT, `mark-${c.name}.png`));
  console.log(`mark-${c.name}.png　${w}×${h}　長寬比 ${ratio.toFixed(4)}　` +
    `墨 ${(ink * 100).toFixed(1)}%　${(buf.length / 1024).toFixed(1)}KB　${c.color}　← ${where}`);
  report.push({ name: c.name, ratio, ink });
}
await browser.close();

/* 按鈕上要填的尺寸。⚠ 三顆**不能都用同一個寬度**：
   標誌那一族是扁的（2.03／3.08），話筒接近方的 —— 34px 寬的話筒會有 34px 高，
   比整行字還高。所以話筒改成**和主鈕那顆標誌一樣高**再回推寬度。 */
const MAINW = 34, MAINR = 2.02918;
const mainH = MAINW / MAINR;
console.log(`\n主鈕那顆標誌：34px 寬 → ${mainH.toFixed(1)}px 高`);
for (const r of report) {
  if (!r.name) continue;
  if (r.name.startsWith("nogo"))
    console.log(`  ${r.name}　34px 寬（同招呼卡那顆 shape-r2c3）→ ${(34 / r.ratio).toFixed(1)}px 高`);
  else if (r.name === "tel")
    console.log(`  tel 　${(mainH * r.ratio).toFixed(1)}px 寬（＝和主鈕的標誌同高 ${mainH.toFixed(1)}px）`);
  else
    console.log(`  ${r.name}　11px 高 → ${(11 * r.ratio).toFixed(1)}px 寬` +
      `（角形跟著字走，不跟著標誌走：主鈕的字 16px，站上那一族是字高的 .58~.7）`);
}
const h = report.find((r) => r.hole);
if (h) console.log(`\n牙洞守門：翻轉後仍量到 ${h.hole} 個被包住的透明像素 ✓`);
