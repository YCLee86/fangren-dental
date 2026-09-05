#!/usr/bin/env node
/* 「看診後的評價邀約」那一則的圖片檔
 *
 *   node drafts/channels/review-png.mjs           → shot-review.png       新版那一張卡（建議的那一格）
 *   node drafts/channels/review-png.mjs --old     → shot-review-old.png   現況那一張
 *   node drafts/channels/review-png.mjs --chat    → shot-review-chat.png  在 LINE 裡長什麼樣
 *   node drafts/channels/review-png.mjs --all     → shot-review-asks.png  五案並排（下面那一段）
 *   node drafts/channels/review-png.mjs --ask=c   → shot-review-c.png     指定其中一案
 *
 *   全部在 preview/line-review/ 底下。
 *
 * ⚠⚠ 「五案並排」是**先各拍一張真的卡，再把那五張圖排進一頁重拍** —— 不是用 CSS
 *   把卡片畫五次（同 og-topic-card 那一輪：提案頁要擺真的產出檔）。這樣那張並排圖
 *   永遠等於提案頁上按下去會看到的東西。
 *
 * ⚠⚠ 出的檔案放 `preview/` 不是 `drafts/` —— drafts 進不了 `_site`（CLAUDE.md 第二節），
 *   放在那裡就只有 repo 看得到、線上打不開。同 remind-png.mjs／bind-done-png.mjs。
 * ⚠⚠ 拍的是**提案頁自己的那張卡**，不是另外畫一份（同 og-topic-card 那一輪：
 *   提案頁要擺真的產出檔）—— 所以**那一頁改了就要重跑這支**，不然圖會開始說謊。
 * ⚠ 這一則還在提案中（兩把尺都沒定案），所以出的是**建議的那一格**：
 *   下面那一段 ＝ Ⓐ 拜託一件事（a=a）／聯繫那一塊 ＝ 只跟櫃檯說（f=desk）。
 * ⚠⚠ 頭圖**還沒畫**，卡上是佔位框（使用者 2026-09-04：「先保留圖卡空間」）——
 *   佔位框和真圖一樣高（aspect-ratio 2/1），所以圖進來之後卡片高度不會變。
 * ⚠ 卡片實寬 268px（LINE 聊天室裡的真實大小），deviceScaleFactor 3 → 檔案 804px 寬。
 * ⚠⚠ 切換條是 fixed 的，Playwright 的元素截圖照樣拍得到它（CLAUDE.md 第九節第 22 條）
 *   —— 拍之前一定要先藏起來。
 * ⚠ 連聊天室拍要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線都被拿掉
 *   （那是為了在真手機上擠出 268px 的卡片，不是給截圖用的）。
 *   ⚠⚠ 換寬度截圖之前要先量「要展示的那個東西有沒有跟著變」—— 這一頁 390 與 430
 *     卡片都是 268.0px、高都是 539.8px，只有周邊留白差 12px。
 * ⚠ 一律 headless_shell（第九節第 18 條：完整版 chrome 畫出來會比 --window-size 少 87px，
 *   而且 PNG 仍然輸出完整尺寸、不報錯）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-review");
const SCALE = 3;
const OLD = process.argv.includes("--old");
const ALL = process.argv.includes("--all");
/* ⚠ 五案的字母與標籤要和提案頁的 ASK 一致 —— 改那一邊要回來改這一邊。 */
const ASKS = [["a","Ⓐ 你寫的"],["b","Ⓑ 不分流"]];
const ASK = (process.argv.find((x) => x.startsWith("--ask=")) || "--ask=a").slice(6);
if (!ASKS.some(([k]) => k === ASK)) throw new Error("沒有這一案：" + ASK);
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

const query = OLD ? "?v=old" : "?v=new&a=" + ASK + "&f=desk";
const out = path.join(DIR, OLD ? "shot-review-old.png"
  : CHAT ? "shot-review-chat.png"
  : ASK === "a" ? "shot-review.png" : "shot-review-" + ASK + ".png");

/* 拍一張卡（或整個聊天室），回傳寫到哪一個檔 */
async function shot(q, file, whole) {
  const page = await browser.newPage({
    viewport: { width: whole ? 430 : 390, height: 900 }, deviceScaleFactor: SCALE });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("file://" + path.join(DIR, "index.html") + q);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
  /* ⚠⚠ 切換條是 fixed 的，元素截圖照樣拍得到（CLAUDE.md 第九節第 22 條）—— 先藏起來 */
  await page.evaluate(() => {
    const bar = document.querySelector(".pv-bar");
    if (bar) bar.style.display = "none";
  });
  const el = await page.$(whole ? ".pv-phone" : "#pv-body");
  if (!el) throw new Error("找不到要拍的元素");
  await el.screenshot({ path: path.join(DIR, file), omitBackground: !whole });
  await page.close();
  return file;
}

/* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
   要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
function verify(file, wantCss, scale, strip) {
  scale = scale || SCALE;
  const buf = fs.readFileSync(path.join(DIR, file));
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (Math.abs(w - wantCss * scale) > scale * 3)
    throw new Error(`${file} 出圖 ${w}px 寬，該是 ${wantCss * scale} 左右`);
  /* ⚠ 並排那一張本來就是橫的，這一道只對單張卡有意義 */
  if (!strip && h < w) throw new Error(`${file} 出圖 ${w}×${h} —— 高比寬還小，多半只拍到一截`);
  console.log(`preview/line-review/${file}　${w}×${h}` +
    `（${scale}×，實寬 ${w / scale}px）　${(buf.length / 1024).toFixed(0)}KB`);
  return { w, h };
}

const made = [];
if (ALL) {
  /* 每一案各拍一張真的卡 */
  const sizes = {};
  for (const [k] of ASKS) {
    const file = k === "a" ? "shot-review.png" : "shot-review-" + k + ".png";
    await shot("?v=new&a=" + k + "&f=desk", file, false);
    sizes[k] = verify(file, 268);
    made.push(file);
  }
  /* ⚠⚠ 並排那一張是**把上面那幾張真的圖排進一頁重拍**，不是用 CSS 再畫一次卡片 ——
     所以它永遠等於提案頁上按下去會看到的東西。 */
  const maxH = Math.max(...ASKS.map(([k]) => sizes[k].h)) / SCALE;
  const strip = ASKS.map(([k, label]) =>
    `<figure><figcaption>${label}</figcaption>` +
    `<img src="${k === "a" ? "shot-review.png" : "shot-review-" + k + ".png"}"></figure>`).join("");
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:20px;background:#e2e5e6;
      font-family:"Noto Sans TC","PingFang TC",system-ui,sans-serif}
    #s{display:flex;gap:18px;align-items:flex-start;width:max-content}
    figure{margin:0;width:268px}
    figcaption{font-size:14px;font-weight:700;color:#2a2c27;margin:0 0 8px 2px}
    img{display:block;width:268px}
  </style><div id="s">${strip}</div>`;
  const tmp = path.join(DIR, "_strip.html");
  fs.writeFileSync(tmp, html);
  const page = await browser.newPage({
    viewport: { width: 1600, height: Math.ceil(maxH) + 80 }, deviceScaleFactor: 2 });
  await page.goto("file://" + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  const el = await page.$("#s");
  await el.screenshot({ path: path.join(DIR, "shot-review-asks.png") });
  await page.close();
  fs.unlinkSync(tmp);
  /* ⚠ 寬度由案數算出來，**不要寫死** —— 案數變過兩次（五案 → 兩案），
     寫死的話下一次改案數就會誤報「出圖寬度不對」。 */
  verify("shot-review-asks.png", 268 * ASKS.length + 18 * (ASKS.length - 1), 2, true);
  made.push("shot-review-asks.png");
} else {
  const file = OLD ? "shot-review-old.png"
    : CHAT ? "shot-review-chat.png"
    : ASK === "a" ? "shot-review.png" : "shot-review-" + ASK + ".png";
  await shot(OLD ? "?v=old" : query, file, CHAT);
  verify(file, CHAT ? VW - 28 : 268);
  made.push(file);
}
await browser.close();

console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
for (const f of made) console.log("  https://fangren.net/preview/line-review/" + f);
