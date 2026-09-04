/* 約診紀錄查詢・輪播的「順序號碼」頭圖 → preview/line-booked/num-01.png … num-12.png
 *   node drafts/channels/booked-num.mjs
 *
 * 使用者 2026-09-04：「輪播頭圖如果變成有順序的數字做得到嗎　假如他今天看診前
 *   查看有 4 次約診　那今天看完診後他再點查詢　剩 3 次　但是跳出來的還是從 1 開始」
 *
 * ⚠⚠⚠ **「從 1 開始重編」＝ 按位置算，不是按約診算。** 那正是第 22-13 節替
 *   浮水印否決掉的那條規則（「取消一筆後面全部換人」）—— 在那裡是缺點，
 *   **在這裡是他要的行為本身**。同一條規則，兩個相反的評價，因為問題不一樣：
 *   浮水印要的是「同一筆約診每次查都長一樣」（＝身分），
 *   號碼要的是「這是清單裡的第幾張」（＝位置）。
 *
 * ⚠⚠⚠ **靜態圖只放得下號碼，放不下「1 / 4」** —— 總數會變，1~12 × 1~12 ＝ 144 張。
 *   要寫「第 1 筆・共 4 筆」只能用**卡片上的文字**（廠商的迴圈自己知道總數）。
 *   這是這一輪最關鍵的限制，提案頁上兩種都擺出來讓你比。
 *
 * ⚠ 上限 12 —— LINE 的 carousel 最多 12 個 bubble。
 * ⚠ 顏色沒有新增：底＝`--paper #e2e5e6`、數字＝一般牙科的**深階** `#2c5238`
 *   （PALETTE：深階給淺底上的**字**）。
 * ⚠ 數字是**襯線**（站上 2026-08-08 那條：數字襯線、單位黑體）。
 * ⚠ 出 1024×512（2:1）＝ 這條線頭圖的統一規格（CLAUDE.md 第十一之二節）。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "preview", "line-booked");
const PAPER = "#e2e5e6";      /* --paper */
const DEEP = "#2c5238";       /* 一般牙科的深階 */
const W = 1024, H = 512, MAX = 12;

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const dir of fs.readdirSync(base)) {
    const p = path.join(base, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;    /* ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

/* 對比度先算一次 —— 數字是字，過不了 AA 就不要出圖 */
const lin = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return .2126 * lin(n >> 16 & 255) + .7152 * lin(n >> 8 & 255) + .0722 * lin(n & 255);
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const CR = ratio(DEEP, PAPER);
if (CR < 4.5) throw new Error(`數字對底只有 ${CR.toFixed(2)}，過不了 AA`);

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "num-"));
const rows = [];
for (let i = 1; i <= MAX; i++) {
  const tag = String(i).padStart(2, "0");
  const pg = path.join(tmp, tag + ".html"), png = path.join(tmp, tag + ".png");
  fs.writeFileSync(pg,
`<!doctype html><meta charset="utf-8"><style>
html,body{margin:0}
.f{width:${W}px;height:${H}px;background:${PAPER};display:flex;
   align-items:center;justify-content:center}
/* ⚠ 容器裡沒有 Noto Serif TC，數字本來就會落到 Times/Liberation Serif ——
   和站上「數字命中 Times」那一條（第九節第 4 點）是同一件事，不是將就。 */
.n{font-family:"Times New Roman","Liberation Serif",serif;font-size:300px;
   line-height:1;color:${DEEP};letter-spacing:.02em}
</style><div class="f"><span class="n">${i}</span></div>`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", `--screenshot=${png}`,
    `--window-size=${W},${H}`, "file://" + pg], { stdio: "pipe" });

  const buf = fs.readFileSync(png);
  if (buf.readUInt32BE(16) !== W || buf.readUInt32BE(20) !== H)
    throw new Error(`${tag}：出圖 ${buf.readUInt32BE(16)}×${buf.readUInt32BE(20)}，不是 ${W}×${H}`);
  if (W > 1024 || H > 1024) throw new Error("超過 LINE 對 image 的 1024 上限");

  /* ⚠ 守門要看「墨」不是看檔案大小 —— 空的一片紙色也是一個很正常的 PNG。
     順便量數字的實際外框，確認它真的置中、也真的夠大。 */
  const st = await page.evaluate(async (src) => {
    const img = await new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = src; });
    const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
    const p = cx.getImageData(0, 0, cv.width, cv.height).data;
    let n = 0, x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
      const o = (y * cv.width + x) * 4;
      /* 深綠 vs 紙色：綠通道差很多，取中間當門檻 */
      if (p[o + 1] < 150) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    return { ink: n / (cv.width * cv.height), x0, x1, y0, y1, w: cv.width, h: cv.height };
  }, "data:image/png;base64," + buf.toString("base64"));
  if (st.ink < .005 || st.ink > .2)
    throw new Error(`${tag}：墨佔 ${(st.ink * 100).toFixed(2)}% —— 空圖或整片糊了？`);
  const capH = st.y1 - st.y0 + 1;
  if (capH < H * .3) throw new Error(`${tag}：數字只有 ${capH}px 高，不到畫面的三成`);
  const offC = Math.abs((st.x0 + st.x1) / 2 - W / 2);
  if (offC > 6) throw new Error(`${tag}：數字水平偏離中線 ${offC.toFixed(1)}px`);

  fs.copyFileSync(png, path.join(OUT, `num-${tag}.png`));
  rows.push({ n: i, 墨: +(st.ink * 100).toFixed(2), 高: capH, 寬: st.x1 - st.x0 + 1 });
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`num-01 ~ num-${String(MAX).padStart(2, "0")}.png　${W}×${H}　深階 ${DEEP} 對紙色 ${PAPER} ＝ ${CR.toFixed(2)}:1 ✓`);
console.table(rows);
console.log("⚠ 靜態圖只有號碼，沒有總數 —— 要「第 1 筆・共 4 筆」只能用卡片上的文字。");
