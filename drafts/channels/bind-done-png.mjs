#!/usr/bin/env node
/* 「綁定完成」那一則的圖片檔（給使用者存檔、之後整包轉給廠商看）
 *
 *   node drafts/channels/bind-done-png.mjs
 *     → preview/line-bind-done/shot-card-{pa,bl,br}.png   Ⓗ 圖卡，三格底色各一張
 *       preview/line-bind-done/shot-text.png              Ⓖ 純文字泡泡
 *       preview/line-bind-done/shot-cards.png             三格並排的對照表
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

/* 三格底色 ＝ 提案頁上那把尺（見 README 第 19-18 節）。使用者還沒挑，所以三張都出。 */
const TINTS = [
  ["pa", "紙灰"],
  ["bl", "淡藍 .10"],
  ["br", "同上面（磚紅 .09）"],
];

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
  const page = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: SCALE });
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
  const el = await page.$("#pv-body");
  if (!el) throw new Error("找不到 #pv-body");
  await el.screenshot({ path: out, omitBackground: true });
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

console.log("Ⓗ 圖卡（三格底色）");
const cards = [];
for (const [k, name] of TINTS) {
  const out = path.join(DIR, `shot-card-${k}.png`);
  await shot(`?v=h&s=${k}`, out);
  check(out, 268);
  cards.push([out, name]);
}

console.log("Ⓖ 純文字泡泡");
const textOut = path.join(DIR, "shot-text.png");
await shot("?v=g", textOut);
/* 泡泡是 shrink-to-fit，寬度由最長那一行決定（上限 244 ＋ 左右內距）—— 不驗寬度，
   只擋「空的／被切掉」這兩種。 */
{
  const buf = fs.readFileSync(textOut);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (w < 150 * SCALE) throw new Error(`泡泡只有 ${w / SCALE}px 寬，多半是沒畫出來`);
  if (h < w) throw new Error(`泡泡 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  console.log(`  preview/line-bind-done/shot-text.png　${w}×${h}（${SCALE}×，實寬 ${w / SCALE}px）　` +
    `${(buf.length / 1024).toFixed(0)}KB`);
}

/* 三格並排的對照表（他在手機上一眼比得出來哪一格重） */
console.log("三格並排");
{
  const cells = cards.map(([f, n]) =>
    `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}">` +
    `<figcaption>${n}</figcaption></figure>`).join("");
  const page = await browser.newPage({ viewport: { width: 1120, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(
    `<style>body{margin:0;background:#e2e5e6;color:#2a2c27;` +
    `font:14px system-ui,"Noto Sans TC","PingFang TC",sans-serif}` +
    `.g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;padding:18px}` +
    `figure{margin:0}img{width:100%;display:block;border-radius:12px}` +
    `figcaption{text-align:center;padding-top:8px;font-weight:600}</style>` +
    `<div class="g">${cells}</div>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  const out = path.join(DIR, "shot-cards.png");
  await page.screenshot({ path: out, fullPage: true });
  await page.close();
  const buf = fs.readFileSync(out);
  console.log(`  preview/line-bind-done/shot-cards.png　${buf.readUInt32BE(16)}×${buf.readUInt32BE(20)}　` +
    `${(buf.length / 1024).toFixed(0)}KB`);
}

await browser.close();
console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
console.log("  https://fangren.net/preview/line-bind-done/shot-cards.png　等");
