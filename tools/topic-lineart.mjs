#!/usr/bin/env node
/* 從科別插畫裡抽一段人物出來，做成**只有線條**的綠色 PNG → assets/lineart-<spec>.png
 *
 *   node tools/topic-lineart.mjs <spec> [--region A|B] [--out <檔>]
 *
 * 2026-08-22 使用者提的：著陸頁上沒有那張分享圖，但「把圖片放進來會壓縮到版面，
 * 我不要那樣。我想到把圖片的某個部分做成頁面的底，但只要保留線條，
 * 而且是做成一般牙科的主題綠」。他還指定了取哪一段：
 * 「畫面中間的女醫事人員和老先生對話的部分，或是右邊兩個醫事人員輕鬆自然
 *   和其他人打招呼的樣子，應該節錄他們的半身就好」。
 *
 * ⚠⚠ **線稿不是「把暗的地方留下來」。** 用絕對亮度去砍，頭髮、深色褲子、
 *   門框整塊都會變成色塊 —— 那不是線稿，是剪影。這一支用的是
 *   **「比周圍暗多少」**（局部平均 − 自己）：大片暗區裡的局部平均也是暗的，
 *   差值自然小，所以只有**筆畫**留得下來。
 *
 * ⚠ 四邊要淡出（smoothstep），不然它是一個有邊的方塊，貼在頁面上很突兀。
 *
 * ⚠ 顏色取 PALETTE.md 各科的**套色**那一階 —— 這是「填在頁面上的圖形」不是
 *   白底上的字，用深階會太重。實際濃度由頁面那一側的 opacity 控制。
 *
 * ⚠⚠ **原檔是 drafts/og-topic-<spec>-src.jpg**（1422×752），不是 assets/ 底下
 *   那張已經疊過帶子的成品 —— 疊過的那張上緣有玻璃帶，抽出來會多一條橫線。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* 各科的套色（PALETTE.md）。和 tools/og-plate.mjs 的 ACCENT 是同一組值。 */
const ACCENT = {
  general: "#3f654a", perio: "#317d78", kids: "#c28229", endo: "#ae4f4d",
  prosth: "#335b8b", surg: "#8e6299", ortho: "#4478b5",
};

/* 半身的裁切（在 1422×752 的原檔上量的）。
   量法：頭頂往上留一點、腰際切齊 —— Ａ 的腰際卡在腳踏車手把（y≈505），
   Ｂ 的腰際在助理拿飲料的手附近（y≈540）。 */
const REGIONS = {
  general: {
    A: { x: 612, y: 330, w: 312, h: 196, name: "中間・女醫師與老先生在門口說話" },
    B: { x: 972, y: 348, w: 228, h: 196, name: "右邊・兩位醫事人員打招呼" },
  },
};

/* 線稿的參數。三組都試過，中間那一組線最完整又不糊（見 /history/topic-lineart.html）。 */
const P = { r: 7, t0: 12, t1: 56, gamma: 1.0 };
const FADE_X = 0.18, FADE_Y = 0.14;   // 四邊淡出佔的比例

const args = process.argv.slice(2);
const spec = args[0];
if (!spec || !ACCENT[spec]) {
  console.error("用法：node tools/topic-lineart.mjs <spec> [--region A|B]");
  console.error("spec：" + Object.keys(ACCENT).join(" / "));
  process.exit(1);
}
const rIdx = args.indexOf("--region");
const rk = rIdx >= 0 ? args[rIdx + 1] : "B";
const R = REGIONS[spec]?.[rk];
if (!R) { console.error(`× ${spec} 沒有區塊 ${rk}（有的：${Object.keys(REGIONS[spec] || {}).join(" / ") || "無"}）`); process.exit(1); }

const SRC = path.join(ROOT, "drafts", `og-topic-${spec}-src.jpg`);
if (!fs.existsSync(SRC)) { console.error(`× 找不到原檔 ${path.relative(ROOT, SRC)}`); process.exit(1); }
const oIdx = args.indexOf("--out");
const OUT = oIdx >= 0 ? path.resolve(ROOT, args[oIdx + 1]) : path.join(ROOT, "assets", `lineart-${spec}.png`);

const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;   // ⚠ headless_shell 排在前面（CLAUDE.md 第九節第 18 條）
})();
const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) throw new Error("找不到 Playwright");

const rgb = [1, 3, 5].map((i) => parseInt(ACCENT[spec].slice(i, i + 2), 16));
const browser = await chromium.launch({ executablePath: chromePath });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

const res = await pg.evaluate(async ({ uri, R, P, rgb, FADE_X, FADE_Y }) => {
  const im = new Image(); im.src = uri; await im.decode();
  if (R.x + R.w > im.naturalWidth || R.y + R.h > im.naturalHeight) {
    return { err: `區塊超出原檔（原檔 ${im.naturalWidth}×${im.naturalHeight}）` };
  }
  const c = document.createElement("canvas"); c.width = R.w; c.height = R.h;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(im, R.x, R.y, R.w, R.h, 0, 0, R.w, R.h);
  const d = g.getImageData(0, 0, R.w, R.h).data;
  const L = new Float32Array(R.w * R.h);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) L[j] = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
  /* 局部平均（方框，半徑 r，隔一格取樣就夠） */
  const mean = new Float32Array(R.w * R.h);
  for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) {
    let s = 0, n = 0;
    for (let dy = -P.r; dy <= P.r; dy += 2) for (let dx = -P.r; dx <= P.r; dx += 2) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || yy >= R.h || xx < 0 || xx >= R.w) continue;
      s += L[yy * R.w + xx]; n++;
    }
    mean[y * R.w + x] = s / n;
  }
  const S = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const out = g.createImageData(R.w, R.h);
  let ink = 0;
  for (let j = 0, k = 0; j < L.length; j++, k += 4) {
    let a = (mean[j] - L[j] - P.t0) / (P.t1 - P.t0);
    a = Math.pow(Math.max(0, Math.min(1, a)), P.gamma);
    const x = j % R.w, y = (j / R.w) | 0;
    const fx = Math.min(S(x / (R.w * FADE_X)), S((R.w - 1 - x) / (R.w * FADE_X)));
    const fy = Math.min(S(y / (R.h * FADE_Y)), S((R.h - 1 - y) / (R.h * FADE_Y)));
    const A = a * fx * fy;
    if (A > 0.5) ink++;
    out.data[k] = rgb[0]; out.data[k + 1] = rgb[1]; out.data[k + 2] = rgb[2];
    out.data[k + 3] = Math.round(A * 255);
  }
  g.putImageData(out, 0, 0);
  return { data: c.toDataURL("image/png"), ink: ink / L.length };
}, { uri, R, P, rgb, FADE_X, FADE_Y });
await browser.close();

if (res.err) { console.error("× " + res.err); process.exit(1); }
/* ⚠ 一道守門：線太少就是參數壞了（或裁到了空白的牆），寧可讓它出聲。 */
if (res.ink < 0.02) {
  console.error(`× 抽出來的線只佔 ${(res.ink * 100).toFixed(1)}%，太少了 —— 參數或裁切不對。`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, Buffer.from(res.data.split(",")[1], "base64"));
console.log(`${rk} ${R.name}　原檔 x${R.x} y${R.y} ${R.w}×${R.h}　線佔 ${(res.ink * 100).toFixed(1)}%`);
console.log(`✓ ${path.relative(ROOT, OUT)}  ${R.w}×${R.h}  ${(fs.statSync(OUT).size / 1024).toFixed(1)}KB`);
