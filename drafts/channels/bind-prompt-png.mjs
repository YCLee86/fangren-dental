#!/usr/bin/env node
/* 「還沒綁定就按約診查詢」那一則的圖片檔
 *
 *   node drafts/channels/bind-prompt-png.mjs
 *     → preview/line-bind-prompt/shot-bind-prompt.png       我們新做的那張（30秒快速綁定）
 *     → preview/line-bind-prompt/shot-bind-prompt-old.png   現況那張公版藍色卡
 *
 * 2026-09-12 使用者：「放上現有的公版藍色卡，以及新作好的30秒快速綁定圖卡」——
 * 指的是廠商對接那一頁（/preview/line-vendor/）第 ① 節那一格要看得到這兩張。
 *
 * ⚠⚠ 拍的是**規格頁自己畫的那兩張卡**，不是另外畫一份（同 cancel-png.mjs）——
 *   所以**那一頁改了就要重跑這支**，不然圖會開始說謊。
 * ⚠⚠ 現況那一張是**我們照截圖重畫的結構**，不是廠商的截圖本人
 *   （吉祥物沒有畫；repo 是公開的）。
 * ⚠ 卡片實寬 268px，deviceScaleFactor 3 → 檔案 804px 寬。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠ 這是這個資料夾裡唯一准許存在的兩個產出檔 —— check-bind-prompt.mjs 的第 ② 道
 *   仍然擋著「複製別人的圖進來」。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-bind-prompt");
const SCALE = 3;

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });

async function shot(sel, file) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 }, deviceScaleFactor: SCALE });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("file://" + path.join(DIR, "index.html"));
  await page.evaluate(() => document.fonts.ready);
  /* ⚠ 等圖只問「它結束了沒」，不要順便問「結果對不對」——
     載不到的圖是 complete:true、naturalWidth:0，寫進等待條件就會等成永遠
     （第三十七節那條）。對不對是等完之後 errs 與尺寸守門的事。 */
  await page.waitForFunction(() => [...document.images].every((i) => i.complete),
    null, { timeout: 8000 });
  if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
  const el = await page.$(sel);
  if (!el) throw new Error("找不到要拍的元素：" + sel);
  /* 守門跟著這一張圖的形狀走：拍之前先量那個元素，出圖之後和它比 */
  const box = await el.boundingBox();
  const out = path.join(DIR, file);
  await el.screenshot({ path: out });
  await page.close();

  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (Math.abs(w - box.width * SCALE) > SCALE * 2 || Math.abs(h - box.height * SCALE) > SCALE * 2)
    throw new Error(`出圖 ${w}×${h}，但那個元素是 ${(box.width * SCALE).toFixed(0)}×`
      + `${(box.height * SCALE).toFixed(0)} —— 拍到的不是它`);
  console.log(`preview/line-bind-prompt/${file}　${w}×${h}`
    + `（${SCALE}×，實寬 ${(w / SCALE).toFixed(0)}px）　${(buf.length / 1024).toFixed(0)}KB`);
  return file;
}

const made = [
  await shot("#pv-chat1 .fx", "shot-bind-prompt.png"),
  await shot("#pv-chat3 .oem", "shot-bind-prompt-old.png"),
];
await browser.close();

console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
for (const f of made) console.log("  https://fangren.net/preview/line-bind-prompt/" + f);
console.log("⚠ 換過圖之後要重跑：node drafts/channels/vendor-shots.mjs");
