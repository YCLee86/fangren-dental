#!/usr/bin/env node
/* 首頁的分享圖 assets/hero-clinic-night-2000.jpg → assets/og-home.jpg（1200×628）
 *
 *   node tools/og-home.mjs
 *
 * 2026-08-22 定案（推導在 /history/og-home.html）：
 *   裁切「寬」＋ 左上的標示 ＋ 下緣三格 1.8×
 *
 * ⚠⚠ **這一支不是一次性的。** 只要換了首頁那張夜景、或窄帶那三格的數字變了
 *   （1983年 中華路開業／9位 醫師駐診／6個 部定專科），就要重跑它。
 *   ⚠ 三格的字是寫在 tools/og-plate.mjs 的 STATS_CELLS 裡的 —— 那是**第二份**，
 *     站上那一份在 index.html 的窄帶。改了其中一邊要記得改另一邊。
 *
 * 為什麼首頁不能直接沿用 hero-clinic-night.jpg（2026-08-22 查出來的）：
 * ・**比例不對**：1600×1058 ＝ 1.512:1，而訊息卡是 1.91:1。LINE 不裁圖、
 *   照原比例顯示，所以那張會長成一張**又高又暗**的卡（實測平均 L* 21.3、
 *   幾乎全黑的像素 48.0%、邊緣密度 16.9% —— 比 ILLUSTRATION.md 第十一節記著的
 *   那張「像鬼屋欸」失敗版 19.3% 還低）。
 * ・**沒有識別**：照片裡診所自己的招牌在 212px 的卡上只有幾個像素寬。
 *   而圖會單獨旅行（被轉存再轉發時只剩圖），圖上的字是唯一還在的識別。
 *
 * ⚠ 卡片實際寬度是 **212 CSS px**（從使用者的 LINE 截圖量的：635 裝置 px ÷ DPR 3），
 *   比一般說的 250 還小 —— 判斷字級大小時用這個數字。
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets", "hero-clinic-night-2000.jpg");
const OUT = path.join(ROOT, "assets", "og-home.jpg");
const W = 1200, H = 628;

/* 定案的裁切「寬」。亮處重心量出來是 (1054, 767)，亮著的騎樓在原檔 y 860~1220、
   招牌在 (≈1150, ≈1080)；框下緣貼照片底邊（1323）才留得住路面。
   ⚠ 這三個數字是那一輪十幾格比出來的，不要憑感覺調 —— 要改先讀 /history/og-home.html。 */
const CROP = { w: 1500, cx: 1120, bottom: 1323 };

if (!fs.existsSync(SRC)) throw new Error(`找不到原檔 ${path.relative(ROOT, SRC)}`);

const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;   // ⚠ headless_shell 排在前面（CLAUDE.md 第九節第 18 條）
})();
const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) throw new Error("找不到 Playwright");

/* ---- 1. 裁成 1200×628 -------------------------------------------------- */
const browser = await chromium.launch({ executablePath: chromePath });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
const data = await pg.evaluate(async ({ uri, W, H, w, cx, bottom }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const IW = img.naturalWidth, IH = img.naturalHeight, h = w / (W / H);
  const sx = Math.max(0, Math.min(IW - w, cx - w / 2));
  const sy = Math.max(0, Math.min(IH - h, bottom - h));
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
  g.drawImage(img, sx, sy, w, h, 0, 0, W, H);
  return c.toDataURL("image/jpeg", 0.86);
}, { uri, W, H, ...CROP });
await browser.close();
fs.writeFileSync(OUT, Buffer.from(data.split(",")[1], "base64"));

/* ---- 2. 疊上左上的標示與下緣的三格 --------------------------------------
   ⚠⚠ og-plate.mjs 是**讀寫同一個檔**的，所以上面那一步一定要先寫好乾淨的底圖，
     而且要重做就得從第一步再來一次 —— 只跑第二步兩次會疊兩層。
   ⚠ --label "" 一定要帶：不帶的話左邊會掛「一般牙科・定期檢查」，**首頁不是科別**。
   ⚠ --statspos plate ＝ 照片維持 1.91 的裁法（建築完整）、帶子疊在下緣；
     用 below 會把照片壓成 2.4:1，屋頂被切掉（使用者退過）。 */
execFileSync(process.execPath, [path.join(ROOT, "tools", "og-plate.mjs"), "general",
  "--from", "assets/og-home.jpg", "--out", "assets/og-home.jpg",
  "--style", "plain", "--label", "",
  "--loc", "full", "--locpos", "stack",
  "--stats", "--statscale", "1.8", "--statspos", "plate"],
  { cwd: ROOT, stdio: "inherit" });

console.log(`✓ ${path.relative(ROOT, OUT)}  ${W}×${H}  ${(fs.statSync(OUT).size / 1024).toFixed(1)}KB`);
