/* 懶人包 → Flex 的 hero ＋ 每一張自己的顏色（2026-08-28 第三輪）
 *
 * 兩件事一起做：
 *   ① 裁一條**橫的** hero（1.91:1），**連紙本自己那圈外框一起留著** ——
 *      那圈框是整張圖裡最大的一塊顏色，第一版裁掉它，卡片就變成黑白的
 *      （實測彩色面積 4.1~11.4%，留著是 12.2~18.6%）。
 *   ② **從那圈框把顏色取出來**，寫進 handouts/colors.json 給卡片用。
 *
 * ⚠⚠ **顏色不跟著科別走**（2026-08-28 使用者定的方向）。理由有三個，
 *   三個都是他點出來的：
 *     ・有些懶人包**歸不了科**（輻射劑量、預約協議、掛號費用）。
 *     ・**顏色是他自己挑的**，每一張不一樣，那是這一批東西自己的識別。
 *     ・跟著科別走的話，卡片上會同時出現兩種顏色（紙本的框 vs 科別的按鈕），
 *       在第二輪的 preview-hero-variants-2.png 第 1、3 格看得很清楚。
 *   ⚠ 所以第二輪那個「把青綠換成科別套色」的 Ⓓ 案**不必做了** ——
 *     它解的正是這個衝突，而衝突的根源是「硬要配科別」。
 *
 * ⚠⚠ 取出來的顏色**不能直接拿去當按鈕底** —— 那幾張的框是印刷用的淺色，
 *   白字壓上去過不了 4.5。所以按鈕的底是「同色相同飽和、把明度壓到剛好過關」，
 *   外框鈕的字同理（對卡片底 #F4F4F5 算）。兩個值都寫進 colors.json。
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
const RATIO = 1200 / 628;
const CARD = "#F4F4F5";                 // 卡片底（＝站上的 --card）
const AA = 4.5;

const ff = execFileSync("python3",
  ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();

const raw = (src, args = []) => {
  const tmp = path.join(os.tmpdir(), `hc-${Math.random().toString(36).slice(2)}.rgb`);
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", src, ...args,
    "-pix_fmt", "rgb24", "-f", "rawvideo", tmp]);
  const b = fs.readFileSync(tmp); fs.unlinkSync(tmp); return b;
};
const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function hsl2rgb(h, s, l) {
  if (s === 0) { const v = l * 255; return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => v * 255);
}
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* 同色相同飽和，把明度往下壓到對 against 過 AA。壓不動就回最深的那一階。 */
function darkenUntil(color, against, target = AA) {
  const [h, s, l0] = rgb2hsl(...[1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)));
  for (let l = l0; l >= 0; l -= 0.005) {
    const c = hex(...hsl2rgb(h, s, l));
    if (ratio(c, against) >= target) return c;
  }
  return hex(...hsl2rgb(h, s, 0));
}

function dims(f) {
  const d = fs.readFileSync(f); let i = 2;
  while (i < d.length) {
    if (d[i] !== 0xFF) { i++; continue; }
    const m = d[i + 1];
    if (m === 0xC0 || m === 0xC1 || m === 0xC2) return { h: d.readUInt16BE(i + 5), w: d.readUInt16BE(i + 7) };
    i += (m === 0xD8 || m === 0xD9 || (m >= 0xD0 && m <= 0xD7)) ? 2 : 2 + d.readUInt16BE(i + 2);
  }
  throw new Error("讀不到 JPEG 尺寸：" + f);
}

/* 卡片在截圖裡的範圍（跳過手機截圖的黑邊，但**保留**紙本自己那圈框） */
function cardBox(src, W, H) {
  const g = raw(src, ["-vf", "scale=120:-1"]);
  const w = 120, h = g.length / (w * 3);
  const bright = (x, y) => { const o = (y * w + x) * 3; return Math.max(g[o], g[o + 1], g[o + 2]); };
  const dark = (arr) => arr.every((v) => v < 40);
  let t = 0; while (t < h && dark([...Array(w).keys()].map((x) => bright(x, t)))) t++;
  let b = h - 1; while (b > t && dark([...Array(w).keys()].map((x) => bright(x, b)))) b--;
  let l = 0; while (l < w && dark([...Array(h).keys()].map((y) => bright(l, y)))) l++;
  let r = w - 1; while (r > l && dark([...Array(h).keys()].map((y) => bright(r, y)))) r--;
  return { x: Math.round(l * W / w), y: Math.round(t * H / h),
           w: Math.round((r - l + 1) * W / w), h: Math.round((b - t + 1) * H / h), grid: { g, w, h, t, b, l, r } };
}

/* 那圈框的顏色：取左右兩條邊上「最有彩」那一群像素的中位數。
   ⚠ 不要取平均 —— 框裡混著白底與陰影，平均會被拉淡（同 CLAUDE.md 第九節第 11 條）。 */
function frameColor(box) {
  const { g, w, t, b, l, r } = box.grid;
  const picks = [];
  for (let y = t + 2; y <= b - 2; y++) {
    for (const x of [l, l + 1, r - 1, r]) {
      const o = (y * w + x) * 3;
      const [, s, ll] = rgb2hsl(g[o], g[o + 1], g[o + 2]);
      if (s > 0.15 && ll > 0.15 && ll < 0.9) picks.push([g[o], g[o + 1], g[o + 2], s]);
    }
  }
  if (picks.length < 20) throw new Error("框上取不到夠多的有彩像素 —— 這張的邊框可能不是色塊");
  picks.sort((a, c) => c[3] - a[3]);                 // 飽和度高的優先
  const keep = picks.slice(0, Math.max(20, Math.round(picks.length * 0.5)));
  const med = (i) => { const v = keep.map((p) => p[i]).sort((a, c) => a - c); return v[v.length >> 1]; };
  return hex(med(0), med(1), med(2));
}

const out = {};
for (const f of fs.readdirSync(DIR).filter((f) => /^handout-[a-z]+\.jpg$/.test(f)).sort()) {
  const name = f.match(/^handout-([a-z]+)\.jpg$/)[1];
  const src = path.join(DIR, f);
  const { w: W, h: H } = dims(src);
  const box = cardBox(src, W, H);
  const even = (n) => n - (n % 2);
  const w = even(Math.min(box.w, W - box.x));
  const h = even(Math.min(Math.round(w / RATIO), H - box.y));
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", src,
    "-vf", `crop=${w}:${h}:${box.x}:${box.y}`, "-q:v", "3",
    path.join(DIR, `handout-${name}-hero.jpg`)]);

  const frame = frameColor(box);
  const fill = darkenUntil(frame, "#FFFFFF");        // 填色鈕：白字要過 4.5
  const ink = darkenUntil(frame, CARD);              // 外框鈕與 ▌：字壓在卡片底上
  out[name] = { frame, fill, ink, hero: `${w}:${h}` };
  console.log(`  ${name.padEnd(10)} 框 ${frame} 白字 ${ratio(frame, "#FFFFFF").toFixed(2)}` +
    `　→ 填色 ${fill}（${ratio(fill, "#FFFFFF").toFixed(2)}）　字 ${ink}（${ratio(ink, CARD).toFixed(2)}）　hero ${w}×${h}`);
}
fs.writeFileSync(path.join(DIR, "colors.json"), JSON.stringify(out, null, 2) + "\n");
