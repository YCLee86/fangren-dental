#!/usr/bin/env node
/* 「看診前 48 小時提醒」那一則的圖片檔
 *
 *   node drafts/channels/remind-png.mjs           → shot-remind.png          新版那一張卡
 *   node drafts/channels/remind-png.mjs --old     → shot-remind-old.png      現況那一張
 *   node drafts/channels/remind-png.mjs --chat    → shot-remind-chat.png     在 LINE 裡長什麼樣
 *
 *   三張都在 preview/line-remind/ 底下。
 *
 * ⚠⚠ 出的檔案放 `preview/` 不是 `drafts/` —— drafts 進不了 `_site`（CLAUDE.md 第二節），
 *   放在那裡就只有 repo 看得到、線上打不開。同 bind-done-png.mjs。
 * ⚠⚠ 拍的是**提案頁自己的那張卡**，不是另外畫一份（同 og-topic-card 那一輪：
 *   提案頁要擺真的產出檔）—— 所以**那一頁改了就要重跑這支**，不然圖會開始說謊。
 * ⚠ 這一則還在提案中（四把尺都還沒定案），所以出的是**現在的預設那一格**：
 *   我會到 ／ 不克前往留著 ／ 24 小時用淡底方塊 ／ 就診須知兩句。
 * ⚠ 卡片實寬 268px（LINE 聊天室裡的真實大小），deviceScaleFactor 3 → 檔案 804px 寬。
 * ⚠⚠ 切換條是 fixed 的，Playwright 的元素截圖照樣拍得到它（CLAUDE.md 第九節第 22 條）
 *   —— 拍之前一定要先藏起來。
 * ⚠ 連聊天室拍要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線都被拿掉
 *   （那是為了在真手機上擠出 268px 的卡片，不是給截圖用的）。
 *   ⚠⚠ 換寬度截圖之前要先量「要展示的那個東西有沒有跟著變」—— 這一頁 390 與 430
 *     卡片都是 268.0px，只有周邊留白差 12px（同 bind-done 第 19-21 節那條通則）。
 * ⚠ 一律 headless_shell（第九節第 18 條：完整版 chrome 畫出來會比 --window-size 少 87px，
 *   而且 PNG 仍然輸出完整尺寸、不報錯）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-remind");
const SCALE = 3;
const OLD = process.argv.includes("--old");
const CHAT = process.argv.includes("--chat");
const VW = CHAT ? 430 : 390;

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

const query = OLD ? "?v=old" : "?v=new&h=y&n=line&w=none&k=two";   /* ＝ 2026-09-04 定的預設：有頭圖／線框鈕／不寫 24 小時／須知兩條 */
const out = path.join(DIR, OLD ? "shot-remind-old.png"
  : CHAT ? "shot-remind-chat.png" : "shot-remind.png");

const page = await browser.newPage({
  viewport: { width: VW, height: 900 }, deviceScaleFactor: SCALE });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + path.join(DIR, "index.html") + query);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  [...document.images].every((i) => i.complete && i.naturalWidth > 0));
if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
await page.evaluate(() => {
  const bar = document.querySelector(".pv-bar");
  if (bar) bar.style.display = "none";
});
const el = await page.$(CHAT ? ".pv-phone" : "#pv-body");
if (!el) throw new Error("找不到要拍的元素");
await el.screenshot({ path: out, omitBackground: !CHAT });
await page.close();
await browser.close();

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
   要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
{
  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const want = CHAT ? VW - 28 : 268;   /* 聊天室那張＝手機框寬＝視窗扣掉頁面左右內距 14 */
  if (Math.abs(w - want * SCALE) > SCALE * 3)
    throw new Error(`出圖 ${w}px 寬，該是 ${want * SCALE} 左右`);
  if (h < w) throw new Error(`出圖 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  console.log(`preview/line-remind/${path.basename(out)}　${w}×${h}` +
    `（${SCALE}×，實寬 ${w / SCALE}px）　${(buf.length / 1024).toFixed(0)}KB`);
}
console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
console.log("  https://fangren.net/preview/line-remind/" + path.basename(out));
