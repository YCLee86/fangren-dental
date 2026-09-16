/* 櫃檯小立牌的人物插圖：原檔 → 卡片上那一條（2026-09-16）
 *
 * v1 的原檔是 16:9、四周留著大片白（那一版的提示詞刻意要求上下各留 11%），
 * 而卡片上那一條窄得多 —— **整張 16:9 放進去一定爆框**。
 * 這一支只做一件事：**裁到墨的框**，四邊各留一點點白。
 *
 * ⚠⚠ 「那一條」＝ QR 底下到帶子 ＋ 一個帶子高（插圖沉進帶子後面），
 *   兩個數字都從 stand-card.mjs 現算 —— 這裡一個都不寫死。
 *   裁完的比例要 ≤ 卡寬 ÷ 那一條，比它寬就換成寬度在卡、人物比那一條給得起的還小。
 * ⚠⚠⚠ **下緣可以碰到邊，那從 v2 起是規格**（人的下半身要被畫面下緣切掉、藏在帶子後面）；
 *   左右與上緣碰到邊仍然是「原檔本來就被切掉了」，要回去重生成。
 *
 *   node drafts/channels/stand-illus-crop.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "/opt/node22/lib/node_modules/playwright/index.js";
import { S, CARD, 餘裕mm, 帶高, 印的案 } from "./stand-card.mjs";
const { chromium } = pkg;

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
/* ⚠ 原檔的路徑只有一個出處（stand-card.json 的 插圖.原檔）—— 換一版改那一份就好，
   這一支和守門都跟著走，不會留下一個指著舊檔的名字。 */
const SRC = path.join(R, S.插圖.原檔);
const OUT = path.join(R, "preview/line-stand/illus.jpg");
const CHECK = process.argv.includes("--check");

/* 卡片上那一塊（和 stand-card.mjs 的 CARD.寬mm ／ 餘裕mm 對得起來，
   數字在那一支現算，這裡只記它算出來的結果當守門的上限） */
/* ⚠⚠ 2026-09-16 起插圖**沉進帶子後面**（使用者：「腳藏進帶子裡」），所以要比的是
   「那一條」＝ QR 底下到帶子 ＋ 一個帶子高 —— 兩個數字都在 stand-card.mjs 現算，
   這裡一個都不寫死（那一行 ID 加上去之後它就變了，寫死的話這裡會靜靜地說謊）。 */
const 卡寬mm = CARD.寬mm;
const 那一塊mm = +(餘裕mm(印的案.find((c) => c.id === "e")) + 帶高() * CARD.寬mm).toFixed(1);
const 上限比 = 卡寬mm / 那一塊mm;
const 邊白 = 8;                            // 裁完四邊各留幾 px 的白
const 門檻 = 12;                           // 離純白多遠才算墨

const 頭 = fs.readFileSync(SRC);
const b64 = 頭.toString("base64");

const br = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const p = await br.newPage();
const r = await p.evaluate(async ({ src, 門檻, 邊白, 上限比 }) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  let L = W, Rr = -1, T = H, B = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (Math.max(255 - d[i], 255 - d[i + 1], 255 - d[i + 2]) > 門檻) {
      if (x < L) L = x; if (x > Rr) Rr = x; if (y < T) T = y; if (y > B) B = y;
    }
  }
  const x0 = Math.max(0, L - 邊白), x1 = Math.min(W - 1, Rr + 邊白);
  const y1 = Math.min(H - 1, B + 邊白);
  const cw = x1 - x0 + 1;
  /* ⚠⚠⚠ 上緣**把白補回來**，不是裁到墨就算了 —— 裁到墨之後若比那一條還寬，
     就變成寬度在卡、人物比那一條給得起的還小。頭頂上那塊白本來就是空的，
     從那裡借回來一點，比例就正好是那一條，而借回來的白落在畫面最上緣、看不出來。
     ⚠ **只補不裁**：比那一條瘦是好的那一種（高度在卡、填滿整條）。 */
  const 需高 = Math.ceil(cw / 上限比);
  const y0墨 = Math.max(0, T - 邊白);
  const y0 = 需高 > y1 - y0墨 + 1 ? Math.max(0, y1 - 需高 + 1) : y0墨;
  const ch = y1 - y0 + 1;
  const o = document.createElement("canvas"); o.width = cw; o.height = ch;
  const og = o.getContext("2d");
  og.fillStyle = "#ffffff"; og.fillRect(0, 0, cw, ch);
  og.drawImage(img, x0, y0, cw, ch, 0, 0, cw, ch);
  return {
    W, H, L, R: Rr, T, B, x0, y0, cw, ch, 補: y0墨 - y0,
    jpg: o.toDataURL("image/jpeg", 0.92).split(",")[1],
  };
}, { src: `data:image/jpeg;base64,${b64}`, 門檻, 邊白, 上限比 });
await br.close();

const 比 = r.cw / r.ch;
const 畫出來寬 = +(比 * 那一塊mm).toFixed(1);

/* ── 守門 ───────────────────────────────────────────────────────── */
const bad = [];
/* ⚠⚠⚠ **只有上緣不准碰到邊，那從 v2 起是規格**：下半身要被畫面下緣切掉（藏在帶子後面）、
   兩側的人要被左右緣切掉（「擠進來」就是這樣畫的）——所以三邊出血是刻意的，
   只有**上緣碰到邊**才是「原檔本來就被切掉了」（頭被切掉，裁一裁救不回來）。
   ⚠ 上緣同時是這一支唯一的調節閥（下面那一段從那裡把白補回來），碰到邊就沒有閥可以調。 */
if (r.T < 2)
  bad.push(`墨碰到原檔的上緣（y 從 ${r.T}）—— 頭被切掉了，要回去重生成；上緣也是唯一可以補白的那一側`);
if (r.L < 2 || r.R > r.W - 3)
  console.log(`（兩側出血：墨 x ${r.L}..${r.R} / ${r.W} —— v2 是刻意的，v1 不是）`);
if (比 > 上限比 + 1e-6)
  bad.push(`裁完比例 ${比.toFixed(3)} > ${上限比.toFixed(3)}，而且頭頂上的白已經借光了 —— 原檔要再高一點（人畫得太扁）`);
if (r.ch < 900 / 2)
  bad.push(`裁完只有 ${r.ch}px 高 —— 印 ${那一塊mm} mm 至少要 ${Math.ceil(那一塊mm / 25.4 * 300)}px（300 dpi）`);
if (r.ch * 25.4 / 那一塊mm < 300)
  bad.push(`解析度只有 ${(r.ch * 25.4 / 那一塊mm).toFixed(0)} dpi，低於 300`);

console.log(`原檔 ${r.W}×${r.H}（比例 ${(r.W / r.H).toFixed(3)}）`);
console.log(`墨的框 x ${r.L}..${r.R}  y ${r.T}..${r.B}`);
console.log(`裁成 ${r.cw}×${r.ch}（比例 ${比.toFixed(3)}）` +
  (r.補 ? `　⚠ 上緣把 ${r.補}px 的白補回來了（裁到墨是 ${(r.cw / (r.ch - r.補)).toFixed(3)}，比那一條寬）` : ""));
console.log(`放進卡片那一條（${卡寬mm} × ${那一塊mm} mm ＝ QR 底下到帶子 ＋ 沉進帶子後面）：畫出來 ${畫出來寬} × ${那一塊mm} mm，左右各餘 ${((卡寬mm - 畫出來寬) / 2).toFixed(1)} mm`);
console.log(`（下面 ${(帶高() * 卡寬mm / 那一塊mm * 100).toFixed(0)}% 會被那條標誌帶子蓋住 —— 重要的東西不要放在那裡）`);
console.log(`印出來 ${(r.ch * 25.4 / 那一塊mm).toFixed(0)} dpi`);
console.log(`（對照：整張 16:9 直接放，照寬度縮會高 ${(卡寬mm / (r.W / r.H)).toFixed(1)} mm ＝ 爆框 ${(卡寬mm / (r.W / r.H) - 那一塊mm).toFixed(1)} mm）`);

if (bad.length) { bad.forEach((b) => console.error("✗ " + b)); process.exit(1); }

const buf = Buffer.from(r.jpg, "base64");
if (CHECK) {
  const 舊 = fs.existsSync(OUT) ? fs.readFileSync(OUT) : null;
  console.log(舊 && 舊.equals(buf) ? "✓ --check：和現有的檔一樣" : "✗ --check：和現有的檔不一樣（或還沒產過）");
  process.exit(舊 && 舊.equals(buf) ? 0 : 1);
}
fs.writeFileSync(OUT, buf);
console.log(`✓ 寫出 ${path.relative(R, OUT)}（${(buf.length / 1024).toFixed(0)} KB）`);
