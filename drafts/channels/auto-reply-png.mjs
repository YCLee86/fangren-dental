#!/usr/bin/env node
/* 「自動回應」那一則的圖片檔
 *
 *   node drafts/channels/auto-reply-png.mjs          → shot-auto-reply.png       定稿那一則（泡泡本身）
 *   node drafts/channels/auto-reply-png.mjs --chat   → shot-auto-reply-chat.png  在 LINE 裡長什麼樣
 *   node drafts/channels/auto-reply-png.mjs --old    → shot-auto-reply-old.png   廠商現在在送的那一則
 *
 *   三張都在 preview/line-auto-reply/ 底下。
 *
 * ⚠⚠ 出的檔案放 `preview/` 不是 `drafts/` —— drafts 進不了 `_site`（CLAUDE.md 第二節），
 *   放在那裡就只有 repo 看得到、線上打不開。同 remind-png.mjs／bind-done-png.mjs。
 * ⚠⚠ 拍的是**規格頁自己那一則**，不是另外畫一份 —— 所以**那一頁改了就要重跑這支**，
 *   不然圖會開始說謊。
 * ⚠ 這一則是**純文字**，泡泡的寬度是由最長那一行決定的（定稿量到 204px），
 *   不像另外三則是固定 268 的卡片 —— 所以守門只查「不超過 268」，不查「等於 268」。
 * ⚠ 連聊天室拍要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線都被拿掉
 *   （那是為了在真手機上擠出 268px 的上限，不是給截圖用的）。
 * ⚠ 一律 headless_shell（第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-auto-reply");
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

/* ⚠ 2026-09-05 定稿之後五把尺都寫死了，所以定稿那一張**不必帶參數**；
   只有現況那一張要 `?n=now`（＝廠商目前在送的那一則，逐字）。 */
const query = OLD ? "?n=now" : "";
const out = path.join(DIR, OLD ? "shot-auto-reply-old.png"
  : CHAT ? "shot-auto-reply-chat.png" : "shot-auto-reply.png");

const page = await browser.newPage({
  viewport: { width: VW, height: 900 }, deviceScaleFactor: SCALE });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + path.join(DIR, "index.html") + query);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  [...document.images].every((i) => i.complete && i.naturalWidth > 0));
if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));

/* 泡泡那一張拍的是**診所送出的第一個泡泡**（他自己那一句綠的不算）。 */
const el = await page.$(CHAT ? ".pv-phone" : ".pv-chat .pv-msg:not(.me) .pv-bub");
if (!el) throw new Error("找不到要拍的元素");
await el.screenshot({ path: out, omitBackground: !CHAT });
await page.close();
await browser.close();

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的。 */
{
  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (CHAT) {
    const want = (VW - 28) * SCALE;   /* 手機框寬＝視窗扣掉頁面左右內距 14 */
    if (Math.abs(w - want) > SCALE * 3) throw new Error(`出圖 ${w}px 寬，該是 ${want} 左右`);
    if (h < w) throw new Error(`出圖 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  } else {
    if (w > 268 * SCALE + 2) throw new Error(`泡泡 ${w / SCALE}px 寬，超過 LINE 的上限 268`);
    if (w < 120 * SCALE) throw new Error(`泡泡只有 ${w / SCALE}px 寬 —— 多半沒拍到內容`);
    if (h < 60 * SCALE) throw new Error(`泡泡只有 ${h / SCALE}px 高 —— 定稿是 13 行，不可能這麼矮`);
  }
  console.log(`preview/line-auto-reply/${path.basename(out)}　${w}×${h}` +
    `（${SCALE}×，實寬 ${(w / SCALE).toFixed(1)}px）　${(buf.length / 1024).toFixed(0)}KB`);
}
console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
console.log("  https://fangren.net/preview/line-auto-reply/" + path.basename(out));
