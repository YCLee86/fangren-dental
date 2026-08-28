/* 懶人包的 hero 裁切（2026-08-28）
 *
 * 三張紙本都是直的（約 0.66~0.69），整張塞進 Flex 的 hero 會長到 450px，
 * carousel 又會把每一格拉齊成最高的那一格 —— 一屏只看得到一格。
 * 所以裁一條**橫的**當 hero：留最上面那一段（標題 ＋ 第一列），
 * 那一段是「這是哪一張」唯一認得出來的地方，理由同 ILLUSTRATION.md 第十一節
 * 「250px 下讀不讀得懂」那一輪的實測。
 *
 * ⚠ **不能用 LINE 自己的 aspectMode: cover 代替** —— 它是置中裁的，
 *   裁出來會是中間那幾格圖示，標題整條不見。
 *
 *   node drafts/line-oa/handout-crop.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, "handouts");
const RATIO = 1200 / 628;          // LINE hero 常用的比例，也是站上分享圖那一支

const ff = execFileSync("python3",
  ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();

/* ⚠ 這三張是**手機截圖**，上下有黑邊（截圖的邊界，不是圖自己的）。
   直接從 y=0 裁會把黑邊烘進 hero 裡。先逐列掃出真正的內容起點再裁。
   （踩過一次：perio 那張黑邊有 34px，裁出來的 hero 頂端一條黑。） */
function contentTop(src) {
  const tmp = path.join(os.tmpdir(), `hc-${path.basename(src)}.gray`);
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", src,
    "-vf", "scale=100:-1", "-pix_fmt", "gray", "-f", "rawvideo", tmp]);
  const b = fs.readFileSync(tmp); const w = 100, h = b.length / w;
  let y = 0;
  while (y < h) { let m = 0; for (let x = 0; x < w; x++) m = Math.max(m, b[y * w + x]); if (m >= 40) break; y++; }
  /* ⚠ 過了黑邊還有**紙本自己那一圈青綠外框**，不跳過的話 hero 頂端會多一條
     不屬於內容的色帶（第一版就是這樣）。往下找到第一列「大部分是白的」，
     那才是卡片裡面。 */
  while (y < h) {
    let bright = 0; for (let x = 0; x < w; x++) if (b[y * w + x] > 200) bright++;
    if (bright > w * 0.8) break;
    y++;
  }
  fs.unlinkSync(tmp);
  return { y, scale: h };   // 回縮圖座標，呼叫端自己按原圖高度換算
}

for (const f of fs.readdirSync(DIR).filter((f) => /^handout-[a-z]+\.jpg$/.test(f))) {
  const src = path.join(DIR, f);
  const W = 1125, PAD = 24;
  const w = W - PAD * 2, h = Math.round(w / RATIO);
  const out = path.join(DIR, f.replace(/\.jpg$/, "-hero.jpg"));
  const probe = contentTop(src);
  /* 縮圖是 100 寬，原圖 1125 寬 → 每一列等於原圖的 11.25 列 */
  const top = Math.round(probe.y * (W / 100));
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", src,
    "-vf", `crop=${w}:${h}:${PAD}:${top}`, "-q:v", "3", out]);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`  ${path.basename(out).padEnd(26)} ${w}×${h}　從 y=${top} 起裁　${kb}KB`);
}
