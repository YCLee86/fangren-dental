#!/usr/bin/env node
/* 招呼圖卡的圖片檔（給使用者存檔／轉給廠商看）
 *   node drafts/channels/card-png.mjs            → preview/line-welcome/shot-welcome.png
 *   node drafts/channels/card-png.mjs --chat     → 連聊天室的底一起拍（-chat.png）
 *
 * ⚠⚠ 2026-09-05：出圖從 drafts/ 搬到 preview/line-welcome/。
 *   drafts 進不了 _site（CLAUDE.md 第二節），放在那裡就只有 repo 看得到、線上打不開，
 *   而整合給廠商的那一頁（preview/line-spec/）要引用它 —— 引用得到才算數。
 *   其餘六則的圖本來就出在 preview/ 底下，這一支是最後一個對齊的。
 *
 * ⚠⚠ 拍的是 **preview/line-welcome/ 那一頁的卡片本身**，不是另外畫一份 ——
 *   另外畫一份的話，哪天那一頁改了這張圖就開始說謊（同 og-topic-card 那一輪：
 *   提案頁要擺真的產出檔）。而那一頁又由 check-welcome.mjs 綁著 welcome-card.json，
 *   所以這張圖 → 提案頁 → Flex 的 JSON 是同一條鏈。
 * ⚠ 卡片實寬 268px（LINE 聊天室裡的真實大小），這裡用 deviceScaleFactor 3 出圖，
 *   所以檔案是 804px 寬 —— 存下來縮放檢視都還清楚。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const CHAT = process.argv.includes("--chat");
const OUT = path.join(ROOT, "preview", "line-welcome",
  CHAT ? "shot-welcome-chat.png" : "shot-welcome.png");
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
const page = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: SCALE });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + path.join(ROOT, "preview", "line-welcome", "index.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  [...document.images].every((i) => i.complete && i.naturalWidth > 0));
if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));

/* 拍之前把「這一頁自己的東西」藏起來（頭像那顆圓點在卡片外面，不必藏） */
const el = await page.$(CHAT ? ".chat" : ".hc");
if (!el) throw new Error("找不到要拍的元素");
await el.screenshot({ path: OUT, omitBackground: !CHAT });

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
   要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
const buf = fs.readFileSync(OUT);
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
const want = (CHAT ? 358 : 268) * SCALE;
if (Math.abs(w - want) > SCALE * 2) throw new Error(`出圖 ${w}px 寬，該是 ${want} 左右`);
if (h < w) throw new Error(`出圖 ${w}×${h} —— 高比寬還小，多半是只拍到一截`);
console.log(`${path.relative(ROOT, OUT)}　${w}×${h}（${SCALE}×，卡片實寬 ${w / SCALE}px）　` +
  `${(buf.length / 1024).toFixed(0)}KB`);
await browser.close();
