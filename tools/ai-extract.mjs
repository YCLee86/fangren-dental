#!/usr/bin/env node
/* =============================================================================
   從 Adobe Illustrator 原始檔（.ai）抽出向量與預覽圖
   -----------------------------------------------------------------------------
     node tools/ai-extract.mjs brand/fangren-logo-2024-12-05.ai brand
   會對每一個工作區域產出：
     <out>/artboard-<n>-<名字>.svg    向量（單色，直接可讀）
     <out>/artboard-<n>-<名字>.png    1200px 寬的預覽（白底）

   ⚠⚠ **為什麼需要這一支**：雲端 session 沒有 Illustrator，容器裡也沒有
   poppler／mutool／ghostscript／PIL（都確認過），所以 .ai 進了 repo 之後
   **沒有任何人打得開它**。這一支把它變成「看得到、量得到」的東西 ——
   `.ai` 存的是原件，SVG／PNG 存的是「不必裝東西就能用」的那一份。

   做法：Illustrator 存檔時預設會寫成 PDF 相容格式（檔頭就是 %PDF），
   所以只要把頁面的內容流用 zlib 解開，再把 PDF 的路徑算符翻成 SVG 的
   `d` 就好。**沒有用任何 npm 套件**（這個 repo 零依賴，見 CLAUDE.md 第三節）。

   支援到的算符只有這個檔用到的那些：q Q cm / m l c v y h re / W n / S f B / w。
   ⚠ **沒有支援文字（Tj／TJ）與影像（Do）** —— 這一份標誌全部是外框化的路徑，
   所以夠用。日後換一個帶活字的 .ai 進來，產出會少東西而且**不會報錯**，
   所以下面留了一道守門（見 EXPECT）。

   ⚠ 顏色一律當成單色輸出（這一份整份是 CMYK 的 `0 0 0 1` ＝ 純黑 K）。
   要拿去用的時候自己套色，**不要以為 SVG 裡的黑就是品牌色** ——
   品牌真值是 #3f654a，見 PALETTE.md。

   ⚠⚠ Chromium 要挑 headless_shell、不能挑完整版 chrome（見 CLAUDE.md
   第九節第 18 條：完整版畫出來會比 --window-size 少 87px，而且不報錯）。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const [, , SRC, OUT_DIR = "brand"] = process.argv;
if (!SRC) {
  console.error("用法：node tools/ai-extract.mjs <檔案.ai> [輸出資料夾]");
  process.exit(1);
}

/* 這一份標誌的工作區域各是什麼 —— 檔名用得到，順序也是守門的一部分 */
const NAMES = ["wordmark", "latin", "lockups"];

/* 守門：抽完之後這幾件事要成立，不成立就停下來不寫檔。
   ⚠ 2.02918 是站上標誌的外框長寬比（assets/icon.svg 與 tools/logo-png.mjs
   的 RATIO 都是這個數字）——抽出來的東西裡找不到它，就表示不是同一份標誌，
   或者這支腳本漏抽了東西。 */
const EXPECT = { markRatio: 2.02918, tol: 0.0005, minPaths: 200 };

/* ── PDF：把物件與內容流挖出來 ────────────────────────────────────────── */
const buf = fs.readFileSync(SRC);
const raw = buf.toString("latin1");
if (!raw.startsWith("%PDF")) {
  console.error("× 這個檔不是 PDF 相容的 .ai（Illustrator 存檔時要勾「建立 PDF 相容檔案」）");
  process.exit(1);
}

const objAt = (id) => {
  const m = new RegExp(`(?:^|[^0-9])${id} 0 obj`).exec(raw);
  if (!m) return null;
  const start = m.index + m[0].length;
  return { start, dict: raw.slice(start, raw.indexOf("endobj", start)) };
};

const streamOf = (id) => {
  const o = objAt(id);
  if (!o) return null;
  const i = o.dict.indexOf("stream");
  if (i < 0) return null;
  let j = i + "stream".length;
  if (raw[o.start + j] === "\r") j++;
  if (raw[o.start + j] === "\n") j++;
  const len = +(/\/Length (\d+)/.exec(o.dict) || [])[1];
  const bytes = buf.subarray(o.start + j, o.start + j + len);
  return /\/FlateDecode/.test(o.dict) ? zlib.inflateSync(bytes).toString("latin1")
                                      : bytes.toString("latin1");
};

/* 頁面（＝工作區域）照 /Kids 的順序來，不要照物件編號 —— 兩者不一定一致 */
const kids = (/\/Kids\s*\[([^\]]*)\]/.exec(raw) || [])[1];
if (!kids) { console.error("× 找不到 /Kids，這個 PDF 的結構不是預期的樣子"); process.exit(1); }
const pageIds = [...kids.matchAll(/(\d+) 0 R/g)].map((m) => +m[1]);

/* ── PDF 路徑算符 → SVG 的 d ──────────────────────────────────────────── */
const mul = (a, b) => [                       // a 先套、b 後套（cm 是左乘目前矩陣）
  a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
  a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5],
];
const n = (v) => Math.round(v * 1000) / 1000;

function toPaths(src) {
  const toks = src.replace(/[\r\n]+/g, " ").split(/\s+/).filter(Boolean);
  const isNum = (t) => /^[-+]?[\d.]+$/.test(t);
  let st = { ctm: [1, 0, 0, 1, 0, 0], w: 1 };
  const stack = [], out = [];
  let d = [], cur = [0, 0], start = [0, 0], nums = [];
  const at = (i) => nums[nums.length + i];
  const P = (x, y) => {
    const m = st.ctm;
    return `${n(m[0] * x + m[2] * y + m[4])} ${n(m[1] * x + m[3] * y + m[5])}`;
  };
  const strokeW = () => {
    /* 線寬要跟著 CTM 縮放；用行列式開根號當等效比例（這一份只有平移，＝1） */
    const s = Math.sqrt(Math.abs(st.ctm[0] * st.ctm[3] - st.ctm[1] * st.ctm[2])) || 1;
    return n(st.w * s);
  };

  for (const t of toks) {
    if (isNum(t)) { nums.push(parseFloat(t)); continue; }
    switch (t) {
      case "q": stack.push({ ...st }); break;
      case "Q": st = stack.pop() || st; break;
      case "cm": st.ctm = mul(nums.slice(-6), st.ctm); break;
      case "w": st.w = at(-1); break;
      case "m": cur = start = [at(-2), at(-1)]; d.push(`M ${P(cur[0], cur[1])}`); break;
      case "l": cur = [at(-2), at(-1)]; d.push(`L ${P(cur[0], cur[1])}`); break;
      case "c":
        d.push(`C ${P(at(-6), at(-5))} ${P(at(-4), at(-3))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "v":                                   // 第一個控制點 ＝ 目前點
        d.push(`C ${P(cur[0], cur[1])} ${P(at(-4), at(-3))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "y":                                   // 第二個控制點 ＝ 終點
        d.push(`C ${P(at(-4), at(-3))} ${P(at(-2), at(-1))} ${P(at(-2), at(-1))}`);
        cur = [at(-2), at(-1)]; break;
      case "h": d.push("Z"); cur = start; break;
      case "re": {
        const [x, y, w, h] = nums.slice(-4);
        d.push(`M ${P(x, y)} L ${P(x + w, y)} L ${P(x + w, y + h)} L ${P(x, y + h)} Z`);
        cur = start = [x, y]; break;
      }
      /* W n ＝ 設裁切區。這一份的裁切一律是整張頁面，所以直接丟掉；
         n 本身是「不描不填」，路徑同樣作廢。 */
      case "W": case "W*": case "n": d = []; break;
      case "f": case "F": case "f*":
        if (d.length) out.push({ d: d.join(" "), fill: true });
        d = []; break;
      case "s": case "S":
        if (t === "s") d.push("Z");
        if (d.length) out.push({ d: d.join(" "), fill: false, w: strokeW() });
        d = []; break;
      case "B": case "B*": case "b": case "b*":
        if (d.length) {
          out.push({ d: d.join(" "), fill: true });
          out.push({ d: d.join(" "), fill: false, w: strokeW() });
        }
        d = []; break;
      default: break;
    }
    nums = [];
  }
  return out;
}

/* 真貝茲極值求外框 —— 只拿控制點會高估，認不出「哪一條是標誌」 */
function bboxOf(d) {
  const t = d.match(/[MLCZ]|-?[\d.]+/g) || [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const pt = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
  const cubic = (p0, p1, p2, p3) => {
    pt(p3[0], p3[1]);
    for (const k of [0, 1]) {
      const a = -p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k];
      const b = 2 * (p0[k] - 2 * p1[k] + p2[k]);
      const c = -p0[k] + p1[k];
      const roots = [];
      if (Math.abs(a) < 1e-12) { if (Math.abs(b) > 1e-12) roots.push(-c / b); }
      else { const D = b * b - 4 * a * c; if (D >= 0) { const r = Math.sqrt(D); roots.push((-b + r) / (2 * a), (-b - r) / (2 * a)); } }
      for (const u of roots) {
        if (!(u > 0 && u < 1)) continue;
        const m = 1 - u;
        const v = m * m * m * p0[k] + 3 * m * m * u * p1[k] + 3 * m * u * u * p2[k] + u * u * u * p3[k];
        if (k === 0) { x0 = Math.min(x0, v); x1 = Math.max(x1, v); }
        else { y0 = Math.min(y0, v); y1 = Math.max(y1, v); }
      }
    }
  };
  while (i < t.length) {
    const c = t[i++];
    if (c === "M") { cx = +t[i++]; cy = +t[i++]; sx = cx; sy = cy; pt(cx, cy); }
    else if (c === "L") { cx = +t[i++]; cy = +t[i++]; pt(cx, cy); }
    else if (c === "C") {
      const p1 = [+t[i++], +t[i++]], p2 = [+t[i++], +t[i++]], p3 = [+t[i++], +t[i++]];
      cubic([cx, cy], p1, p2, p3); cx = p3[0]; cy = p3[1];
    } else if (c === "Z") { cx = sx; cy = sy; }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

/* ── Chromium（預覽用）────────────────────────────────────────────────── */
/* ⚠ headless_shell 一定要排在完整版 chrome 前面，理由見檔頭與 CLAUDE.md 第九節第 18 條 */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "chrome"));
      out.push(path.join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      out.push(path.join(pw, d, "chrome-win", "chrome.exe"));
    }
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome");
  return out;
};

/* ── 跑 ──────────────────────────────────────────────────────────────── */
fs.mkdirSync(OUT_DIR, { recursive: true });
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "ai-extract-"));
const PNG_W = 1200;

let total = 0, markRatio = null;
const written = [];

pageIds.forEach((pid, idx) => {
  const page = objAt(pid);
  if (!page) throw new Error(`找不到頁面物件 ${pid}`);
  const art = (/\/ArtBox\[([^\]]*)\]/.exec(page.dict) || [])[1];
  const box = (art || (/\/MediaBox\[([^\]]*)\]/.exec(page.dict) || [])[1]).trim().split(/\s+/).map(Number);
  const cid = +(/\/Contents (\d+) 0 R/.exec(page.dict) || [])[1];
  const paths = toPaths(streamOf(cid));
  total += paths.length;

  for (const p of paths) {
    const b = bboxOf(p.d);
    if (b.h > 1 && Math.abs(b.w / b.h - EXPECT.markRatio) < EXPECT.tol && b.w > 20) markRatio = b.w / b.h;
  }

  const [x0, y0, x1, y1] = box;
  const W = n(x1 - x0), H = n(y1 - y0);
  const body = paths.map((p) => p.fill
    ? `  <path d="${p.d}" fill="currentColor"/>`
    : `  <path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${p.w}" stroke-linecap="round" stroke-linejoin="round"/>`
  ).join("\n");
  /* PDF 的 y 軸往上、SVG 往下 —— 整組翻過來，不要逐點去減 */
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="芳仁牙醫診所標誌・工作區域 ${idx + 1}">
<g transform="translate(${n(-x0)} ${n(y1)}) scale(1 -1)" color="#000">
${body}
</g>
</svg>
`;
  const base = `artboard-${idx + 1}-${NAMES[idx] || "art"}`;
  const svgPath = path.join(OUT_DIR, `${base}.svg`);
  fs.writeFileSync(svgPath, svg, "utf8");
  written.push(svgPath);

  if (chrome) {
    const h = Math.round(PNG_W * (H / W));
    const html = path.join(tmp, `${base}.html`);
    const png = path.join(OUT_DIR, `${base}.png`);
    fs.writeFileSync(html,
      `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}` +
      `svg{display:block;width:${PNG_W}px;height:${h}px}</style>${svg}`, "utf8");
    execFileSync(chrome, [
      ...(path.basename(chrome).startsWith("headless_shell") ? [] : ["--headless"]),
      "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
      `--screenshot=${png}`, `--window-size=${PNG_W},${h}`,
      `--user-data-dir=${path.join(tmp, "profile")}`, `file://${html}`,
    ], { stdio: ["ignore", "ignore", "pipe"] });
    if (!fs.existsSync(png)) throw new Error("Chromium 沒有產出 PNG");
    written.push(png);
    console.log(`  工作區域 ${idx + 1}（${NAMES[idx] || "art"}）：${paths.length} 條路徑・${W}×${H}pt → ${PNG_W}×${h}px`);
  } else {
    console.log(`  工作區域 ${idx + 1}（${NAMES[idx] || "art"}）：${paths.length} 條路徑・${W}×${H}pt（沒找到 Chromium，略過 PNG）`);
  }
});

fs.rmSync(tmp, { recursive: true, force: true });

/* 守門 —— 東西不對就出聲，不要靜靜地產出一份少東西的 SVG */
if (total < EXPECT.minPaths) {
  console.error(`× 只抽到 ${total} 條路徑（預期至少 ${EXPECT.minPaths}）—— 多半是有活字或影像沒被抽出來`);
  process.exitCode = 1;
}
if (markRatio === null) {
  console.error(`× 找不到長寬比 ${EXPECT.markRatio} 的那條路徑 —— 這一份不是站上那顆標誌，或抽取有漏`);
  process.exitCode = 1;
} else {
  console.log(`  ✓ 標誌外框長寬比 ${markRatio.toFixed(5)}（＝ assets/icon.svg 與 tools/logo-png.mjs 的 RATIO）`);
}
console.log(`  共 ${written.length} 個檔案寫進 ${OUT_DIR}/`);
