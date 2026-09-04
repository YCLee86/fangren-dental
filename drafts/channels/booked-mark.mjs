/* 約診卡上那顆「浮水印」標誌 → preview/line-booked/mark-wm-{08,12,18}.png
 *   node drafts/channels/booked-mark.mjs
 *
 * 使用者 2026-09-04：「我也不喜歡本來的 logo 在頁首，LINE 裡可以設置對話框浮水印嗎」。
 *
 * ⚠⚠⚠ **聊天室的背景設不了**（查證過，見 channels/README 第 21-12 節）——
 *   那是每個使用者在自己手機上設的，而且只有他自己看得到，官方帳號動不了。
 *   做得到的是**在卡片自己裡面**放一顆很淡的標誌。
 *
 * ⚠⚠ **Flex 的 box 沒有背景圖**：`background` 只認 `linearGradient` 一種
 *   （line-bot-sdk-python 的 flex_message.py 裡只有 LinearGradientBackground）。
 *   所以浮水印只能用一個 `image` 元件 ＋ `position: absolute` 疊上去。
 *
 * ⚠⚠ **Flex 的 image 沒有 opacity** —— 淡是**烘進 PNG 的 alpha 裡**的，
 *   同 mark-white.png／mark-green.png 那兩顆（那兩顆是烘顏色，這顆是烘濃度）。
 *   出三個濃度讓使用者挑，網址參數 `?k=08|12|18`。
 *
 * ⚠ 形狀取 **index.html 頁首那一條**（＝ brand/shapes/mark、tools/logo-png.mjs 同一條）：
 *   icon.svg 的牙洞是為了扛 iOS 柔化調過的，那是裝置補償，不該帶進通用的標誌檔。
 * ⚠ 顏色是品牌真值 `#3f654a`（PALETTE.md 一般牙科的套色），**沒有新增顏色**。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-booked");
const GREEN = "#3f654a";
const RATIO = 2.02918;              /* 頁首那一條的長寬比（守門用） */
const PW = 420;                     /* 卡片上最大會用到約 150px，出 420 給 DPR3 */
const ALPHAS = [["08", .08], ["12", .12], ["18", .18]];

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/* 頁首那個 <svg>：路徑與外層 transform 都要抄。
   ⚠ 只抄 <path d> 會畫出一張**全透明、而且不報錯**的圖（mark-png.mjs 檔頭那一條）。 */
const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
const svgTag = home.match(/<svg[^>]*viewBox="0 0 44\.2873 21\.8244"[^>]*>[\s\S]*?<\/svg>/);
if (!svgTag) throw new Error("index.html 裡找不到頁首那個標誌 <svg>");
const d = (svgTag[0].match(/\sd="([^"]+)"/) || [])[1];
const gt = (svgTag[0].match(/<g\s+transform="([^"]+)"/) || [])[1];
if (!d || !gt) throw new Error("頁首的標誌 <svg> 缺 path 或外層 transform");

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;    /* ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });

/* 讓瀏覽器連 transform 一起量外框 —— 不要自己拆 path 的數字。 */
await page.setContent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">` +
  `<g id="outer"><g transform="${gt}"><path d="${d}"/></g></g></svg>`);
const box = await page.evaluate(() => {
  const r = document.getElementById("outer").getBBox();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const ratio = box.w / box.h;
if (Math.abs(ratio - RATIO) > .01)
  throw new Error(`量到的長寬比 ${ratio.toFixed(4)} 對不上 ${RATIO}（形狀被切了？）`);
const PH = Math.round(PW / ratio);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wm-"));
const report = [];
for (const [tag, a] of ALPHAS) {
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}">
  <g transform="${gt}"><path fill="${GREEN}" fill-opacity="${a}" fill-rule="evenodd" d="${d}"/></g>
</svg>`;
  const pg = path.join(tmp, tag + ".html"), png = path.join(tmp, tag + ".png");
  fs.writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}` +
    `svg{display:block;width:${PW}px;height:${PH}px}</style>${svg}`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });

  const buf = fs.readFileSync(png);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  if (w !== PW || h !== PH) throw new Error(`${tag}：出圖 ${w}×${h}，該是 ${PW}×${PH}`);
  if (w > 1024 || h > 1024) throw new Error(`${tag}：超過 LINE 對 image 的 1024 上限`);

  /* ⚠ 守門：不能只檢查「檔案有多大」（淡圖本來就小）——要真的看 alpha。
     牙洞是 fill-rule: evenodd 挖穿的，挖掉了才對；所以同時檢查
     「有墨」與「墨不是滿版」。 */
  const st = await page.evaluate(async (src) => {
    const img = await new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const p = cx.getImageData(0, 0, cv.width, cv.height).data;
    let ink = 0, max = 0;
    for (let i = 3; i < p.length; i += 4) { if (p[i] > 2) ink++; if (p[i] > max) max = p[i]; }
    return { ink: ink / (cv.width * cv.height), max };
  }, "data:image/png;base64," + buf.toString("base64"));
  if (st.ink < .2) throw new Error(`${tag}：只有 ${(st.ink * 100).toFixed(1)}% 有墨 —— 多半是空圖`);
  if (st.ink > .95) throw new Error(`${tag}：${(st.ink * 100).toFixed(1)}% 有墨 —— 牙洞沒被挖穿？`);
  const wantA = Math.round(a * 255);
  if (Math.abs(st.max - wantA) > 3) throw new Error(`${tag}：最濃處 alpha ${st.max}，該是 ${wantA}`);

  fs.copyFileSync(png, path.join(OUT, `mark-wm-${tag}.png`));
  report.push(`  mark-wm-${tag}.png  ${PW}×${PH}  alpha ${a}（最濃 ${st.max}/255）　墨佔 ${(st.ink * 100).toFixed(1)}%`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log("✅ 浮水印標誌（頁首那一條，" + GREEN + "）：\n" + report.join("\n"));
