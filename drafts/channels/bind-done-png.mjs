#!/usr/bin/env node
/* 「綁定完成」那一則的圖片檔（給使用者存檔、之後整包轉給廠商看）
 *
 *   node drafts/channels/bind-done-png.mjs           → shot-bind-done.png       卡片本身
 *   node drafts/channels/bind-done-png.mjs --chat    → shot-bind-done-chat.png  連聊天室一起拍
 *
 *   兩張都在 preview/line-bind-done/ 底下。--chat 那一張是**在 LINE 裡長什麼樣**的
 *   模擬：帳號抬頭 ＋「今天」＋ 廠商系統以病人身分送的那顆綠泡泡 ＋ 我們這一則
 *   ＋「此官方帳號正在自動回覆訊息」。⚠ 近似，不是 LINE 自己的算繪。
 *
 * ⚠⚠ **只出定稿那一張**（使用者：「最後定稿的是這個　存這個就好」）——
 *   2026-09-04 稍早出過五張（三格底色 ＋ 純文字 ＋ 並排對照），他挑完之後全部刪掉了。
 *   落選案要看就回 git 或 drafts/channels/README.md 第十九節。
 *
 * ⚠⚠ 出的檔案放在 `preview/` 不是 `drafts/` —— **drafts 進不了 `_site`**
 *   （CLAUDE.md 第二節），放在那裡就只有 repo 看得到、線上打不開。
 *   使用者要的是「也存在網路上」，所以一律落在 preview/line-bind-done/ 底下。
 *   （招呼卡那支 card-png.mjs 出在 drafts/，那是它當時只要一個檔案給他存。）
 *
 * ⚠⚠ 拍的是 **提案頁自己的那張卡**，不是另外畫一份 —— 另外畫一份的話，
 *   哪天那一頁改了這些圖就開始說謊（同 og-topic-card 那一輪：要擺真的產出檔）。
 * ⚠ 卡片實寬 268px（LINE 聊天室裡的真實大小），這裡用 deviceScaleFactor 3 出圖，
 *   所以檔案是 804px 寬。
 * ⚠⚠ 切換條是 fixed 的，**Playwright 的元素截圖照樣拍得到它**（CLAUDE.md 第九節
 *   第 22 條）—— 拍之前一定要先藏起來。
 * ⚠ 一律 headless_shell（第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-bind-done");
const SCALE = 3;
const CHAT = process.argv.includes("--chat");
/* ⚠ 連聊天室拍的時候要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線
   都被拿掉（那是為了在真手機上擠出 268px 的卡片，不是給截圖用的）。 */
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

const src = "file://" + path.join(DIR, "index.html");
const shot = async (query, out) => {
  const page = await browser.newPage({ viewport: { width: VW, height: 900 }, deviceScaleFactor: SCALE });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(src + query);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
  /* 切換條是 fixed 的，不藏會被拍進來 */
  await page.evaluate(() => {
    const bar = document.querySelector(".pv-bar");
    if (bar) bar.style.display = "none";
  });
  const el = await page.$(CHAT ? ".pv-phone" : "#pv-body");
  if (!el) throw new Error("找不到要拍的元素");
  await el.screenshot({ path: out, omitBackground: !CHAT });
  await page.close();
  return out;
};

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
   要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
const check = (out, wantW) => {
  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (Math.abs(w - wantW * SCALE) > SCALE * 3)
    throw new Error(`${path.basename(out)} 出圖 ${w}px 寬，該是 ${wantW * SCALE} 左右`);
  if (h < w) throw new Error(`${path.basename(out)} 出圖 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  console.log(`  preview/line-bind-done/${path.basename(out)}　${w}×${h}` +
    `（${SCALE}×，實寬 ${w / SCALE}px）　${(buf.length / 1024).toFixed(0)}KB`);
  return { w, h };
};

const out = path.join(DIR, CHAT ? "shot-bind-done-chat.png" : "shot-bind-done.png");
await shot("", out);   /* 規格頁已經寫死 Ⓗ ＋ 有頭圖 ＋ 淡藍，不必再帶參數 */

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
   要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
{
  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const want = CHAT ? VW - 28 : 268;   /* 聊天室那張＝手機框寬＝視窗扣掉頁面左右內距 14 */
  if (Math.abs(w - want * SCALE) > SCALE * 3)
    throw new Error(`出圖 ${w}px 寬，該是 ${want * SCALE} 左右`);
  if (h < w) throw new Error(`出圖 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  console.log(`preview/line-bind-done/${path.basename(out)}　${w}×${h}` +
    `（${SCALE}×，實寬 ${w / SCALE}px）　${(buf.length / 1024).toFixed(0)}KB`);
}

await browser.close();
console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
console.log("  https://fangren.net/preview/line-bind-done/" + path.basename(out));
