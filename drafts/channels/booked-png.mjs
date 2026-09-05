#!/usr/bin/env node
/* 「預約成功通知 ＋ 約診紀錄查詢」那兩則的圖片檔（2026-09-05 定稿之後）
 *
 *   node drafts/channels/booked-png.mjs          → 五張全出
 *   node drafts/channels/booked-png.mjs --chat   → 只出兩張聊天室模擬
 *
 *   出的檔（都在 preview/line-booked/ 底下）：
 *     shot-booked.png        預約成功那一張卡本身
 *     shot-query.png         約診紀錄查詢的**整條輪播**（四張並排，含滑出畫面的那幾張）
 *     shot-booked-chat.png   預約成功在 LINE 裡長什麼樣
 *     shot-query-chat.png    查詢輪播在 LINE 裡長什麼樣
 *     shot-wm.png            九顆浮水印的形狀與顏色對照表（給廠商的那一張）
 *
 * ⚠⚠ 出的檔案放 `preview/` 不是 `drafts/` —— drafts 進不了 `_site`（CLAUDE.md 第二節），
 *   放在那裡就只有 repo 看得到、線上打不開。同 bind-done-png.mjs／remind-png.mjs。
 * ⚠⚠ 拍的是**規格頁自己畫的那幾張卡**，不是另外畫一份（同 og-topic-card 那一輪：
 *   要擺真的產出檔）—— 所以**那一頁改了就要重跑這支**，不然圖會開始說謊。
 * ⚠⚠⚠ 這一頁的浮水印是 `fetch("wm-sizes.json")` 讀回來的，`file://` 拿不到
 *   （九顆會退回同一個寬度、對照表整塊畫不出來）。所以這一支**自己起一個
 *   HTTP 伺服器**再拍，不能像另外兩支那樣直接開檔案。
 * ⚠ 連聊天室拍要用 **430 寬**：429 以下手機框會貼齊頁面兩邊、圓角與左右框線都被拿掉
 *   （那是為了在真手機上擠出 268px 的卡片，不是給截圖用的）。
 *   ⚠⚠ 換寬度截圖之前要先量「要展示的那個東西有沒有跟著變」—— 這一頁 360~430
 *     卡片都是 268.0／207.0px，只有周邊留白會變（同 bind-done 第 19-21 節那條通則）。
 * ⚠⚠ 輪播那一張要拍的是 `.row`（整條，四張並排），不是 `#pv-slot2`
 *   —— 後者有 `overflow-x: auto`，拍到的只有露出來的那一截。
 * ⚠ 定稿之後切換條已經整條拿掉了，所以這一支不必再藏它（第九節第 22 條那件事
 *   在這一頁已經沒有對象），但守門仍然照量。
 * ⚠ 一律 headless_shell（第九節第 18 條：完整版 chrome 畫出來會比 --window-size 少 87px，
 *   而且 PNG 仍然輸出完整尺寸、不報錯）。
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-booked");
const SCALE = 3;
const CHAT_ONLY = process.argv.includes("--chat");

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();

/* ---- 最小的靜態伺服器（只為了讓 fetch("wm-sizes.json") 拿得到）------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".css": "text/css", ".js": "text/javascript" };
const server = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (f.endsWith("/")) f = path.join(f, "index.html");
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = "http://127.0.0.1:" + server.address().port + "/preview/line-booked/";

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });

/* 每一張：[檔名, 選擇器, 視窗寬, 透明底?, 期望寬（CSS px）, 拍之前要做的事] */
/* ⚠⚠ 輪播那一張要「整條」拍 —— `.row` 住在 `overflow-x: auto` 的框裡，
   它的 bounding box 會被那個框夾成看得到的那一截（實測只有 337px，而整條是 854）。
   所以拍之前先把框放開、讓 `.row` 撐成 `max-content`。
   ⚠ 這只影響截圖那一瞬間的那一個分頁，規格頁本身一個字都沒改。
   ⚠⚠⚠ 放開 overflow 還不夠 —— 元素比視窗寬的時候，截圖仍然停在視窗那一刀
     （拍出來是兩張半、右邊一片乾淨的底色，**寬度是對的所以守門抓不到**）。
     所以那一張的視窗開到 1000。**卡片寬不受影響**：每一張 `.pv-hc` 在輪播裡
     是寫死的 207px，不是跟著容器長的（量過，1000 上仍然是 207.0）。 */
const OPEN_ROW = () => {
  const slot = document.getElementById("pv-slot2");
  slot.style.overflow = "visible";
  slot.style.flex = "none";
  slot.style.maxWidth = "none";
  slot.querySelector(".row").style.width = "max-content";
  /* ⚠⚠ 放開 `.row` 自己不夠 —— 手機外框也是 `overflow: hidden`，
     第三、四張仍然會被它切掉（拍出來是一張半、右邊一片空白，
     **而且不報錯**：出圖的寬度是對的，只是後面兩張沒有畫）。
     祖先每一層的 overflow 都要放開。 */
  document.getElementById("pv-ph2").style.overflow = "visible";
};
const SHOTS = [
  ["shot-booked.png",      "#pv-slot .pv-hc",  390, true,  268],
  ["shot-query.png",       "#pv-slot2 .row",   1000, true, null, OPEN_ROW],
  ["shot-booked-chat.png", "#pv-ph1",          430, false, 430 - 28],
  ["shot-query-chat.png",  "#pv-ph2",          430, false, 430 - 28],
  ["shot-wm.png",          "#pv-wmref",        430, false, 430 - 28]
];
const want = CHAT_ONLY ? SHOTS.filter((s) => s[0].includes("-chat")) : SHOTS;

for (const [name, sel, vw, alpha, wantW, prep] of want) {
  const page = await browser.newPage({
    viewport: { width: vw, height: 900 }, deviceScaleFactor: SCALE });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  /* ⚠ 九顆的寬度是 fetch 回來之後才重畫的 —— 沒等到就拍，會拍到退回值那一版
     （九顆同寬、對照表是空的）。等它畫出九格再拍。 */
  await page.waitForFunction(() =>
    document.querySelectorAll("#pv-wmref figure").length === 9);
  if (errs.length) throw new Error("那一頁有 JS 錯誤：" + errs.join(" / "));
  if (prep) await page.evaluate(prep);
  const el = await page.$(sel);
  if (!el) throw new Error("找不到要拍的元素：" + sel);
  /* ⚠⚠ 拍之前先量那個元素本來多大 —— 守門要比對的是「**出圖 ＝ 那個元素**」，
     不是「高有沒有比寬大」。這一頁的卡片是**橫的**（268 × 149、207 × 115），
     照抄提醒卡那一支的「高比寬還小就是拍到一截」會誤報 —— 而那條在那一支是對的，
     因為那一張卡本來就很高。**守門要跟著這一張圖的形狀走，不要跨頁照抄。** */
  const box = await el.boundingBox();
  const out = path.join(DIR, name);
  await el.screenshot({ path: out, omitBackground: alpha });
  await page.close();

  /* ⚠ 守門：出圖之後量一次，不要出一張空的或被切掉的（同 logo-png.mjs 那一條：
     要檢查「形狀對不對」，不是只檢查檔案有沒有產生）。 */
  const buf = fs.readFileSync(out);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (wantW != null && Math.abs(w - wantW * SCALE) > SCALE * 3)
    throw new Error(`${name} 出圖 ${w}px 寬，該是 ${wantW * SCALE} 左右`);
  if (Math.abs(w - box.width * SCALE) > SCALE * 2 ||
      Math.abs(h - box.height * SCALE) > SCALE * 2)
    throw new Error(`${name} 出圖 ${w}×${h}，但那個元素是 ` +
      `${(box.width * SCALE).toFixed(0)}×${(box.height * SCALE).toFixed(0)} —— 拍到一截`);
  if (buf.length < 3000) throw new Error(`${name} 只有 ${buf.length} 位元組，多半是空的`);
  console.log(`preview/line-booked/${name}　${w}×${h}` +
    `（${SCALE}×，實寬 ${(w / SCALE).toFixed(1)}px）　${(buf.length / 1024).toFixed(0)}KB`);
}

await browser.close();
server.close();

console.log("\n線上網址（等 Cloudflare 建置跑完才打得開，先看 /version.txt）：");
for (const [name] of want) console.log("  https://fangren.net/preview/line-booked/" + name);
