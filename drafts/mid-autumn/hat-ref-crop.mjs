/* 柚子帽的形狀參考：從使用者給的 IG 限動截圖裡只裁出兩顆頭與帽子（2026-09-25）
 *   node drafts/mid-autumn/hat-ref-crop.mjs
 *   → drafts/mid-autumn/refs/5-pomelo-hat-shape.jpg
 * ⚠ 截圖上有「中秋節快樂!!」與作者署名 @asarisoba，裁掉，不然會被抄進畫面。
 * ⚠ 那是別人的作品（asarisoba），只拿「帽子的形狀」，畫風與鳥一律不參考；也不上線。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const SRC = "drafts/mid-autumn/refs/pomelo-hat-screenshot.png";
const OUT = "drafts/mid-autumn/refs/5-pomelo-hat-shape.jpg";
const BOX = [341, 937, 438, 281]; // 1125×2436 上量：標題字下緣之下、署名之上
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/png;base64,${fs.readFileSync(SRC).toString("base64")}`;
const b64 = await pg.evaluate(async ({ uri, box }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const [x, y, w, h] = box, k = 2;
  const c = document.createElement("canvas"); c.width = w * k; c.height = h * k;
  const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
  g.drawImage(img, x, y, w, h, 0, 0, w * k, h * k);
  return c.toDataURL("image/jpeg", 0.92).split(",")[1];
}, { uri, box: BOX });
fs.writeFileSync(OUT, Buffer.from(b64, "base64"));
console.log(OUT, BOX.join(","));
await browser.close();
