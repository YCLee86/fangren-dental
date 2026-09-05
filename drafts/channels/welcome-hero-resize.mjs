/* 招呼圖卡的頭圖：產生器出的 1040×520 → **1024×512**（Flex 的上限）
 *   node drafts/channels/welcome-hero-resize.mjs
 *   preview/line-hello/hero-current.jpg  →  preview/line-welcome/hero-welcome.jpg
 *
 * ⚠⚠⚠ 為什麼要多這一支：**LINE Flex 的 image 上限是 1024×1024**
 *   （CLAUDE.md 第十一之二節），而招呼圖卡的頭圖是七則裡唯一一張 1040 寬的 ——
 *   其餘五張頭圖（綁定完成／提醒／評價／颱風）本來就出 1024×512。
 *   `welcome-card.json` 從一開始就寫著 `hero-welcome.jpg`，但**沒有任何一支腳本產它**，
 *   所以那個網址一直是空的。這一支就是補上那個缺口。
 *
 * ⚠⚠ **不去改 `drafts/line-hello/generate.mjs` 的 W／H**：那一支裡面的位置
 *   （對話框、尾巴、驚嘆號）全部是**在 1040×520 的座標裡量出來的**定案值，
 *   守門也用 `/1040` 換算聊天室上的實寬。動 W 等於要重新量那一整組，
 *   而這一張圖的長相已經定案（2026-09-03）。
 *   → 產生器維持 1040 的量測座標，**這一支只做最後一次等比例縮小**（98.4615%），
 *     和其餘幾張頭圖的 `*-hero-crop.mjs` 是同一個位置：出「要上線的那一張」。
 *
 * ⚠ 這是**純等比例縮小，不是裁切** —— 兩邊都是 2:1，所以構圖一個像素都沒有移動。
 *   守門因此比的是「墨的外框在正規化座標裡有沒有跑掉」（跑掉就代表被裁到或被拉伸）。
 * ⚠ 產圖一律用 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
const SRC = "preview/line-hello/hero-current.jpg";
const OUT = "preview/line-welcome/hero-welcome.jpg";
const W_OUT = 1024, H_OUT = 512;

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const r = await pg.evaluate(async ({ uri, W_OUT, H_OUT }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;

  /* ⚠⚠ 地標是**對話框那條深綠的線與字**，不是亮度 —— 底下是診所的實景照，
     暗的地方（騎樓、車、窗）和亮的地方（天空、水泥牆）都鋪滿整張圖，
     用亮度取外框會回 0~1，那是一個永遠會通過的守門（同 typhoon 那一支的教訓：
     地標要挑「這一張圖才有、而且一定存在」的東西）。
     深綠 #2C5238 ＝ rgb(44,82,56)：綠比紅高、綠比藍高，而且整體是暗的。 */
  const box = (cv) => {
    const g = cv.getContext("2d");
    const d = g.getImageData(0, 0, cv.width, cv.height).data;
    let x0 = cv.width, x1 = -1, y0 = cv.height, y1 = -1, n = 0;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
      const i = (y * cv.width + x) * 4, R = d[i], G = d[i + 1], B = d[i + 2];
      if (G - R > 18 && G - B > 12 && G < 150) {
        n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    return { x0: x0 / cv.width, x1: x1 / cv.width, y0: y0 / cv.height, y1: y1 / cv.height,
      ink: n / (cv.width * cv.height) };
  };

  const a = document.createElement("canvas"); a.width = W; a.height = H;
  a.getContext("2d").drawImage(img, 0, 0);
  const src = box(a);

  const c = document.createElement("canvas"); c.width = W_OUT; c.height = H_OUT;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, 0, W, H, 0, 0, W_OUT, H_OUT);
  const out = box(c);

  return { W, H, src, out, jpeg: c.toDataURL("image/jpeg", 0.9) };
}, { uri, W_OUT, H_OUT });
await browser.close();

const bad = [];
if (Math.abs(r.W / r.H - 2) > 0.01) bad.push(`原檔不是 2:1（${r.W}×${r.H}）`);
if (Math.abs(W_OUT / H_OUT - 2) > 0.01) bad.push("成品不是 2:1");
if (W_OUT > 1024 || H_OUT > 1024) bad.push("超過 LINE 的 1024×1024");
if (r.out.ink < 0.02) bad.push(`找不到那個對話框（深綠只有 ${(r.out.ink * 100).toFixed(1)}%）—— 換圖了就要重新定地標`);
for (const k of ["x0", "x1", "y0", "y1"]) {
  const d = Math.abs(r.src[k] - r.out[k]);
  if (d > 0.005) bad.push(`墨的外框 ${k} 跑了 ${(d * 100).toFixed(2)}%（等比例縮小不該動）`);
}
if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

fs.writeFileSync(OUT, Buffer.from(r.jpeg.split(",")[1], "base64"));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`${OUT}　${r.W}×${r.H} → ${W_OUT}×${H_OUT}　${kb}KB`);
console.log(`  對話框的深綠 ${(r.out.ink * 100).toFixed(1)}%、外框 x ${r.out.x0.toFixed(3)}~${r.out.x1.toFixed(3)}`
  + `／y ${r.out.y0.toFixed(3)}~${r.out.y1.toFixed(3)}（原檔逐項相同 ✓）`);
