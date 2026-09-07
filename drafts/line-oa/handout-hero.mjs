/* 懶人包 → Flex hero 的四種做法（2026-08-28 第二輪）
 *
 * 起因：使用者「原本的懶人包那個邊框我蠻喜歡的，你給我的圖幾乎都裁掉了，
 * 只剩重點文字有主題色……這樣很黑白」。第一版把**整張圖裡最大的一塊顏色**
 * （四周那圈青綠外框）裁掉了，剩下的青綠只在幾個重點字上，所以讀起來是黑白的。
 *
 *   Ⓐ 現況    無框　1.91:1
 *   Ⓑ 有框    留外框　1.91:1
 *   Ⓒ 有框高  留外框　4:3（看得到兩列，顏色的面積跟著變大）
 *   Ⓓ 換色    留外框　4:3　**整張的青綠換成該科的套色**
 *
 * ⚠ Ⓓ 是**改到醫師的原圖**，只用在 LINE 的 hero、紙本不動；要不要走這條要先問過。
 *   好處是這三張從此落在站上的色票裡（PALETTE.md），不會出現「紙本的青綠
 *   #54bcac」和「牙周的青綠 #317d78」在同一張卡上打架。
 *
 *   node drafts/line-oa/handout-hero.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const DIR = path.join(HERE, "handouts");
const ff = execFileSync("python3",
  ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const ACC = (spec) => {
  const m = html.match(new RegExp(`\\[data-spec=["']${spec}["']\\][^{]*\\{[^}]*--accent:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`index.html 裡找不到 ${spec} 的 --accent`);
  return m[1];
};
const SHEETS = [
  { name: "perio",  spec: "perio" },
  { name: "wisdom", spec: "surg" },
  { name: "xray",   spec: "endo" },
];

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function hsl2rgb(h, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
}

const raw = (src, args = []) => {
  const tmp = path.join(os.tmpdir(), `hh-${Math.random().toString(36).slice(2)}.rgb`);
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y", "-i", src, ...args,
    "-pix_fmt", "rgb24", "-f", "rawvideo", tmp]);
  const b = fs.readFileSync(tmp); fs.unlinkSync(tmp); return b;
};
const jpg = (buf, w, h, out) => {
  const tmp = path.join(os.tmpdir(), `hh-${Math.random().toString(36).slice(2)}.rgb`);
  fs.writeFileSync(tmp, buf);
  execFileSync(ff, ["-hide_banner", "-loglevel", "error", "-y",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${w}x${h}`, "-i", tmp, "-q:v", "3", out]);
  fs.unlinkSync(tmp);
};

/* 圖是手機截圖：四周可能有黑邊。逐列逐行掃出真正的卡片範圍（含那圈青綠外框）。 */
function cardBox(src, W, H) {
  const g = raw(src, ["-vf", "scale=100:-1"]);
  const w = 100, h = g.length / (w * 3);
  const bright = (x, y) => { const o = (y * w + x) * 3; return Math.max(g[o], g[o + 1], g[o + 2]); };
  let t = 0; while (t < h && [...Array(w).keys()].every((x) => bright(x, t) < 40)) t++;
  let b = h - 1; while (b > 0 && [...Array(w).keys()].every((x) => bright(x, b) < 40)) b--;
  let l = 0; while (l < w && [...Array(h).keys()].every((y) => bright(l, y) < 40)) l++;
  let r = w - 1; while (r > 0 && [...Array(h).keys()].every((y) => bright(r, y) < 40)) r--;
  const sx = W / w, sy = H / h;
  return { x: Math.round(l * sx), y: Math.round(t * sy),
           w: Math.round((r - l + 1) * sx), h: Math.round((b - t + 1) * sy) };
}

function dims(f) {
  const d = fs.readFileSync(f); let i = 2;
  while (i < d.length) {
    if (d[i] !== 0xFF) { i++; continue; }
    const m = d[i + 1];
    if (m === 0xC0 || m === 0xC1 || m === 0xC2) return { h: d.readUInt16BE(i + 5), w: d.readUInt16BE(i + 7) };
    i += 2 + (m === 0xD8 || m === 0xD9 || (m >= 0xD0 && m <= 0xD7) ? -2 + 2 : d.readUInt16BE(i + 2));
  }
  throw new Error("讀不到 JPEG 尺寸：" + f);
}

/* 彩色面積 ＝ 飽和度 > .15 的像素佔比。「很黑白」這句話量出來就是這個數。 */
function chroma(buf) {
  let n = 0; const px = buf.length / 3;
  for (let i = 0; i < px; i++) {
    const [, s] = rgb2hsl(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
    if (s > 0.15) n++;
  }
  return n / px;
}

const VARIANTS = [
  { tag: "a", frame: false, ratio: 1200 / 628, recolor: false },
  { tag: "b", frame: true,  ratio: 1200 / 628, recolor: false },
  { tag: "c", frame: true,  ratio: 4 / 3,      recolor: false },
  { tag: "d", frame: true,  ratio: 4 / 3,      recolor: true  },
];

for (const sheet of SHEETS) {
  const src = path.join(DIR, `handout-${sheet.name}.jpg`);
  const { w: W, h: H } = dims(src);
  const box = cardBox(src, W, H);
  const acc = ACC(sheet.spec);
  const [tH, tS] = rgb2hsl(...hex2rgb(acc));
  const out = [];
  for (const v of VARIANTS) {
    /* Ⓐ 不要外框：往內縮到白底才開始（逐列找第一列「大部分是白的」） */
    let x = box.x, y = box.y, w = box.w;
    if (!v.frame) {
      const g = raw(src, ["-vf", "scale=100:-1"]);
      const gw = 100, gh = g.length / (gw * 3);
      let yy = Math.round(box.y / H * gh);
      while (yy < gh) {
        let br = 0;
        for (let xx = 0; xx < gw; xx++) { const o = (yy * gw + xx) * 3; if (g[o] > 200 && g[o + 1] > 200 && g[o + 2] > 200) br++; }
        if (br > gw * 0.8) break;
        yy++;
      }
      y = Math.round(yy / gh * H);
      const pad = Math.round(W * 0.021);
      x = box.x + pad; w = box.w - pad * 2;
    }
    /* ⚠ crop 的寬高會被**進位成偶數**（來源 JPEG 是 yuv420p），自己先取偶數，
       不然回來的 rawvideo 和這裡算的尺寸差一列，寫檔那一步會失敗。（踩過。） */
    const even = (n) => n - (n % 2);
    w = even(Math.min(w, W - x));
    const h = even(Math.min(Math.round(w / v.ratio), H - y));
    let buf = raw(src, ["-vf", `crop=${w}:${h}:${x}:${y}`]);
    if (buf.length !== w * h * 3) throw new Error(`${sheet.name} ${v.tag}：回來的畫面尺寸對不上（${buf.length / 3} px vs ${w * h}）`);
    if (v.recolor) {
      for (let i = 0; i < buf.length; i += 3) {
        const [hh, ss, ll] = rgb2hsl(buf[i], buf[i + 1], buf[i + 2]);
        if (ss > 0.12) {          // 有彩的才換，灰與黑白不動
          const [r, g2, b2] = hsl2rgb(tH, Math.min(1, ss * (tS / 0.40)), ll);
          buf[i] = r; buf[i + 1] = g2; buf[i + 2] = b2;
        }
      }
    }
    const file = path.join(DIR, `handout-${sheet.name}-hero${v.tag}.jpg`);
    jpg(buf, w, h, file);
    out.push(`${v.tag.toUpperCase()} ${w}×${h} 彩色 ${(chroma(buf) * 100).toFixed(1)}%`);
  }
  console.log(`  ${sheet.name.padEnd(7)} ${acc}　${out.join("　")}`);
}
