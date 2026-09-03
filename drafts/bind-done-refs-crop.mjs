/* 把「創造亞當 Q 版」那張參考圖從手機截圖裡裁出來（2026-09-03）
 *   node drafts/bind-done-refs-crop.mjs
 *   → drafts/bind-done-ref-adam-gesture.jpg   只有畫，沒有 App 介面
 * 使用者給的是整張手機截圖（1125×2436，含新浪的介面與中文搜尋列）。
 * ⚠⚠ 參考圖一定要裁乾淨再餵：
 *   ① 一張參考圖只准提供一件事（ILLUSTRATION.md 第十二節之二），
 *      介面與縮圖列會變成第二、第三件事；
 *   ② **截圖裡的中文字會被生成模型抄進畫面**（第七節第 4 條那條 no-text 的反面）。
 * 這一張只提供「兩隻手伸出來、指尖快要碰到」那個手勢與構圖，
 * **風格與人物一律不參考它**（那是別人的水墨作品）—— 風格由站上的成品圖負責。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const SRC = "drafts/bind-done-ref-adam-gesture.png";
/* 座標在 1125×2436 的原截圖上量：畫的上緣在標題列下方；下緣**刻意切在 1140**，把左下角那顆 Google Lens 按鈕與右下的浮水印一起切掉 */
const BOX = [12, 312, 1101, 1140];
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/png;base64,${fs.readFileSync(SRC).toString("base64")}`;
const b64 = await pg.evaluate(async ({ uri, box }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const [x, y, w, h] = box;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
  g.drawImage(img, x, y, w, h, 0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.92).split(",")[1];
}, { uri, box: BOX });
fs.writeFileSync("drafts/bind-done-ref-adam-gesture.jpg", Buffer.from(b64, "base64"));
console.log("drafts/bind-done-ref-adam-gesture.jpg", BOX.join(","),
  (fs.statSync("drafts/bind-done-ref-adam-gesture.jpg").size / 1024).toFixed(0) + "KB");
await browser.close();
