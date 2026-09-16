/* 櫃檯小立牌的人物插圖：原檔 → 卡片上那一條（2026-09-16）
 *
 * 原檔是 16:9、四周留著大片白（提示詞刻意要求上下各留 11%），卡片上那一塊
 * 只有 98 × 43.8 mm ＝ 比例 2.24 —— **整張 16:9 放進去一定爆框**
 * （照寬度縮高 54.7 mm、照高度縮則左右空掉 19.5 mm，人還跟著縮小四分之一）。
 * 這一支只做一件事：**裁到墨的框**，四邊各留一點點白。
 *
 * ⚠⚠ 裁完的比例要 ≤ 2.237（＝ 98 ÷ 43.8）—— 比它寬的話就換成寬度在卡，
 *   人物會比這一塊給得起的還小；守門在擋。
 * ⚠ 墨不可以碰到邊（碰到 ＝ 原檔本來就被切掉了，要回去重生成，不是裁一裁就好）。
 *
 *   node drafts/channels/stand-illus-crop.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pkg;

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(R, "drafts/stand-card-illus-v1-src.jpg");
const OUT = path.join(R, "preview/line-stand/illus.jpg");
const CHECK = process.argv.includes("--check");

/* 卡片上那一塊（和 stand-card.mjs 的 CARD.寬mm ／ 餘裕mm 對得起來，
   數字在那一支現算，這裡只記它算出來的結果當守門的上限） */
const 卡寬mm = 98, 那一塊mm = 43.8;
const 上限比 = 卡寬mm / 那一塊mm;          // 2.237
const 邊白 = 8;                            // 裁完四邊各留幾 px 的白
const 門檻 = 12;                           // 離純白多遠才算墨

const 頭 = fs.readFileSync(SRC);
const b64 = 頭.toString("base64");

const br = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const p = await br.newPage();
const r = await p.evaluate(async ({ src, 門檻, 邊白 }) => {
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
  const x0 = Math.max(0, L - 邊白), y0 = Math.max(0, T - 邊白);
  const x1 = Math.min(W - 1, Rr + 邊白), y1 = Math.min(H - 1, B - 0 + 邊白);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const o = document.createElement("canvas"); o.width = cw; o.height = ch;
  const og = o.getContext("2d");
  og.fillStyle = "#ffffff"; og.fillRect(0, 0, cw, ch);
  og.drawImage(img, x0, y0, cw, ch, 0, 0, cw, ch);
  return {
    W, H, L, R: Rr, T, B, x0, y0, cw, ch,
    jpg: o.toDataURL("image/jpeg", 0.92).split(",")[1],
  };
}, { src: `data:image/jpeg;base64,${b64}`, 門檻, 邊白 });
await br.close();

const 比 = r.cw / r.ch;
const 畫出來寬 = +(比 * 那一塊mm).toFixed(1);

/* ── 守門 ───────────────────────────────────────────────────────── */
const bad = [];
if (r.L < 2 || r.T < 2 || r.R > r.W - 3 || r.B > r.H - 3)
  bad.push(`墨碰到原檔的邊（x ${r.L}..${r.R} / ${r.W}、y ${r.T}..${r.B} / ${r.H}）—— 原檔本來就被切掉了，要回去重生成`);
if (比 > 上限比)
  bad.push(`裁完比例 ${比.toFixed(3)} > ${上限比.toFixed(3)} —— 這樣是寬度在卡，人物會比那一塊給得起的還小`);
if (r.ch < 900 / 2)
  bad.push(`裁完只有 ${r.ch}px 高 —— 印 ${那一塊mm} mm 至少要 ${Math.ceil(那一塊mm / 25.4 * 300)}px（300 dpi）`);
if (r.ch * 25.4 / 那一塊mm < 300)
  bad.push(`解析度只有 ${(r.ch * 25.4 / 那一塊mm).toFixed(0)} dpi，低於 300`);

console.log(`原檔 ${r.W}×${r.H}（比例 ${(r.W / r.H).toFixed(3)}）`);
console.log(`墨的框 x ${r.L}..${r.R}  y ${r.T}..${r.B}`);
console.log(`裁成 ${r.cw}×${r.ch}（比例 ${比.toFixed(3)}）`);
console.log(`放進卡片那一塊（${卡寬mm} × ${那一塊mm} mm）：畫出來 ${畫出來寬} × ${那一塊mm} mm，左右各餘 ${((卡寬mm - 畫出來寬) / 2).toFixed(1)} mm`);
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
