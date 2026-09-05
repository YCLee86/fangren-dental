#!/usr/bin/env node
/* 「颱風／臨時休診通知」的圖片檔（2026-09-05 定稿之後存下來的）
 *
 *   node drafts/channels/typhoon-png.mjs          → shot-typhoon.png       定案那張圖卡
 *   node drafts/channels/typhoon-png.mjs --chat   → shot-typhoon-chat.png  在 LINE 裡長什麼樣
 *   node drafts/channels/typhoon-png.mjs --text   → shot-typhoon-text.png  退路Ａ 純文字那一則
 *   node drafts/channels/typhoon-png.mjs --all    → 上面三張一次出完
 *
 *   三張都在 preview/line-typhoon/ 底下。
 *
 * ⚠⚠ 出的檔案放 `preview/` 不是 `drafts/` —— drafts 進不了 `_site`（CLAUDE.md 第二節），
 *   放在那裡就只有 repo 看得到、線上打不開。同 cancel-png.mjs／remind-png.mjs。
 * ⚠⚠ 拍的是**規格頁自己畫的那幾張**，不是另外畫一份（同 og-topic-card 那一輪：
 *   提案頁要擺真的產出檔）—— 所以**那一頁改了就要重跑這支**，不然圖會開始說謊。
 * ⚠ 卡片實寬 268px（LINE 聊天室裡的真實大小），deviceScaleFactor 3 → 檔案 804px 寬。
 * ⚠ 連聊天室拍要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線都被拿掉
 *   （那是為了在真手機上擠出 268px 的卡片，不是給截圖用的）。
 *   ⚠⚠ 換寬度截圖之前要先量「要展示的那個東西有沒有跟著變」—— 這一頁 360~430
 *     卡片都是 268.0px，只有周邊留白在變（同 bind-done 第 19-21 節那條通則）。
 * ⚠⚠ 守門要跟著**這一張圖自己的形狀**走，不要跨頁照抄（booked-png 那一輪的教訓：
 *   remind-png 那條「高一定大於寬」對橫的圖會直接誤報）—— 這裡改成拍之前先量
 *   那個元素、出圖之後和它比對。
 * ⚠ 一律 headless_shell（第九節第 18 條：完整版 chrome 畫出來會比 --window-size 少 87px，
 *   而且 PNG 仍然輸出完整尺寸、不報錯）。
 * ⚠ 定案之後切換條已經整條拿掉了，所以不必先藏它。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-typhoon");
const SCALE = 3;
const ALL = process.argv.includes("--all");
const CHAT = ALL || process.argv.includes("--chat");
const TEXT = ALL || process.argv.includes("--text");
const CARD = ALL || (!process.argv.includes("--chat") && !process.argv.includes("--text"));

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

async function shot(sel, file, vw, opaque) {
  const page = await browser.newPage({
    viewport: { width: vw, height: 900 }, deviceScaleFactor: SCALE });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("file://" + path.join(DIR, "index.html"));
  await page.evaluate(() => document.fonts.ready);
  /* ⚠ 頭圖沒載完就拍，卡片會矮 134px（＝那張 2:1 的高度），而且不報錯。 */
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
  const el = await page.$(sel);
  if (!el) throw new Error("找不到要拍的元素：" + sel);
  const box = await el.boundingBox();
  const out = path.join(DIR, file);
  await el.screenshot({ path: out, omitBackground: !opaque });
  await page.close();

  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (Math.abs(w - box.width * SCALE) > SCALE * 2 || Math.abs(h - box.height * SCALE) > SCALE * 2)
    throw new Error(`出圖 ${w}×${h}，但那個元素是 ${(box.width * SCALE).toFixed(0)}×`
      + `${(box.height * SCALE).toFixed(0)} —— 拍到的不是它`);
  console.log(`preview/line-typhoon/${file}　${w}×${h}`
    + `（${SCALE}×，實寬 ${(w / SCALE).toFixed(0)}px）　${(buf.length / 1024).toFixed(0)}KB`);
  return file;
}

const made = [];
/* ⚠ 用 `[data-blk]` 抓，不要寫死順序 —— 這一頁有五段，順序日後可能會調。 */
if (CARD) made.push(await shot('.pv-sec[data-blk="card"] .fx', "shot-typhoon.png", 390, false));
if (TEXT) made.push(await shot('.pv-sec[data-blk="text"] .pv-bub', "shot-typhoon-text.png", 390, false));
if (CHAT) made.push(await shot('.pv-sec[data-blk="card"] .pv-phone', "shot-typhoon-chat.png", 430, true));
await browser.close();

console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
for (const f of made) console.log("  https://fangren.net/preview/line-typhoon/" + f);
