/* =============================================================================
   assets/line-<name>.png — LINE 圖卡按鈕上的三顆小圖示
   -----------------------------------------------------------------------------
       node tools/line-icons.mjs           算一次，寫檔
       node tools/line-icons.mjs --check   只比對，不寫檔；不一致就回傳非零

   這三張**站上任何一頁都不會顯示**，用途只有一個：LINE 的 Flex Message 只吃
   HTTPS 的 PNG／JPEG，不吃 SVG，也不能把站上那幾個 inline 的 <svg> 直接送過去。
   所以要把頁尾那三顆圖示各算成一張透明底的 PNG 放在 assets/ 下面，
   由 drafts/line-oa/*.json 用 https://fangren.net/assets/line-*.png 指過去。
   （和 assets/logo.png 同一種：進版控、會上線、但沒有一頁會畫它。）

     assets/line-pin.png     地圖導航那顆按鈕　純白　384×512（Font Awesome 實心釘）
     assets/line-phone.png   致電診所那顆按鈕　純白　512×512（同上，話筒）
     assets/line-logo.png    診所網站那顆按鈕　#3f654a　44.2873×21.8244（品牌標誌）

   ⚠ 幾何一律從 index.html 的頁尾讀回來，這裡不抄第二份（同 logo-png.mjs）。
     標誌另外對頁首那一條做一致性檢查 —— 兩處本來就該一模一樣。
   ⚠ 顏色：釘子與話筒在綠色按鈕上，所以是純白（站上頁尾是 #3f654a，那是紙底）；
     標誌在白底外框鈕上，用品牌真值 #3f654a（＝站上頁尾標誌以外那兩顆的顏色）。
   ⚠ 站上那三顆的輪廓**和自己的 viewBox 四邊相切**（index.html 有一整段註解在講
     這件事，靠 overflow: visible 才沒被削掉）。這裡改用「畫布留 4% 邊」處理，
     不改 viewBox，也就不會動到任何比例。
   ⚠⚠ headless_shell 一定要排在完整版 chrome 前面（CLAUDE.md 第九節第 18 條）。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");
const BRAND = "#3f654a";
const PADR = 0.04;                 // 畫布四周各留 4%，讓相切的那一列畫得完整
const HI = 8;                      // 出圖倍率（相對於 LINE 上的顯示寬度）

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));

/* ---------- 從 index.html 取出一個 <svg> 的 viewBox 與所有 <path d> ---------- */
function grab(viewBox, { nth = 0 } = {}) {
  const re = new RegExp(`<svg[^>]*viewBox="${viewBox.replace(/\./g, "\\.")}"[^>]*>[\\s\\S]*?<\\/svg>`, "g");
  const all = [...home.matchAll(re)].map((m) => m[0]);
  if (!all[nth]) throw new Error(`index.html 裡找不到第 ${nth + 1} 個 viewBox="${viewBox}" 的 <svg>`);
  const ds = [...all[nth].matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length) throw new Error(`viewBox="${viewBox}" 的 <svg> 裡沒有 <path d=…>`);
  return { all, d: ds.join(" ") };
}

const [vbW, vbH] = [44.2873, 21.8244];
const pin = grab("0 0 384 512");
const tel = grab("0 0 512 512");

/* ⚠⚠ 標誌取的是**頁首那一條**，不是頁尾那一條 —— 兩處的外框一模一樣，
   但**牙洞不一樣大**（2026-08-28 量到，這是第三個變體）：

     index.html 頁首   外框 2.02926　牙洞寬÷外框寬 0.102514  ← 這一支與 logo.png 用它
     index.html 頁尾   外框 2.02926　牙洞寬÷外框寬 0.117891  （大 15%）
     assets/icon.svg   外框 2.02918　牙洞寬÷外框寬 0.093080  （小 9.2%）

   取頁首的理由同 tools/logo-png.mjs：2026-08-19 使用者從兩案挑了頁首那一條當
   通用標誌檔的比例，LINE 這一顆也是通用的用途，跟著它走。
   ⚠ **不要順手把三處統一** —— CLAUDE.md 第九節第 19 條那筆落差還沒查清楚，
     現在只是多知道頁尾是第三個值。外框相同這件事下面有一道 assert 守著。 */
const logoHead = grab(`0 0 ${vbW} ${vbH}`, { nth: 0 });
const logoFoot = grab(`0 0 ${vbW} ${vbH}`, { nth: 1 });
const outerOf = (d) => d.split(/(?=M )/)[0].trim();
if (outerOf(logoHead.d) !== outerOf(logoFoot.d)) {
  throw new Error("頁首與頁尾的標誌**外框**不一樣了 —— 那不只是牙洞的差別，先查清楚再出圖");
}

/* 標誌那個 <svg> 外面包著一層 translate，路徑座標不是從 0 起算的（同 logo-png.mjs）。 */
const logoShift = logoHead.all[0].match(/transform="translate\((-?[\d.]+)\s+(-?[\d.]+)\)"/);
if (!logoShift) throw new Error("頁首標誌的 <g transform=translate(…)> 不見了");

const ICONS = [
  { name: "line-pin",   vb: [0, 0, 384, 512],     d: pin.d, fill: "#ffffff", w: 12,  ratio: 384 / 512 },
  { name: "line-phone", vb: [0, 0, 512, 512],     d: tel.d, fill: "#ffffff", w: 13,  ratio: 1 },
  { name: "line-logo",  vb: [0, 0, vbW, vbH],     d: logoHead.d, fill: BRAND, w: 27, ratio: vbW / vbH,
    shift: [+logoShift[1], +logoShift[2]] },
];

/* ---------- 解 PNG（同 logo-png.mjs；容器裡沒有 PIL 也沒有 ImageMagick） ---------- */
function decode(buf) {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const depth = buf.readUInt8(24), colour = buf.readUInt8(25);
  if (depth !== 8) throw new Error(`只認得 8-bit，實際 ${depth}`);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colour];
  if (!ch) throw new Error(`不認得的色彩型態 ${colour}`);
  const parts = [];
  for (let off = 8; off + 8 <= buf.length;) {
    const len = buf.readUInt32BE(off);
    if (buf.toString("ascii", off + 4, off + 8) === "IDAT") parts.push(buf.subarray(off + 8, off + 8 + len));
    off += len + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(parts));
  const stride = w * ch, px = Buffer.alloc(h * stride);
  let o = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[o++];
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let v = raw[o + x];
      if (f === 1) v += a; else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
    o += stride;
  }
  return { w, h, ch, colour, px };
}

/* ---------- 三道保險絲（每一道對應一種「不報錯但圖是壞的」） ---------- */
function inspect(buf, { fill, ratio }) {
  const { w, h, ch, colour, px } = decode(buf);
  if (colour !== 6) throw new Error(`底應該是透明的（RGBA／型態 6），實際型態 ${colour}`);
  const rows = [], cols = new Set();
  const opaque = new Map();
  let nAlpha0 = 0;
  for (let y = 0; y < h; y++) {
    let n = 0;
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * ch, a = px[o + 3];
      if (a === 0) { nAlpha0++; continue; }
      n++; cols.add(x);
      if (a === 255) {
        const k = `#${px[o].toString(16).padStart(2, "0")}${px[o + 1].toString(16).padStart(2, "0")}${px[o + 2].toString(16).padStart(2, "0")}`;
        opaque.set(k, (opaque.get(k) || 0) + 1);
      }
    }
    rows.push(n);
  }
  const ys = rows.map((n, y) => (n ? y : -1)).filter((y) => y >= 0);
  if (!ys.length) throw new Error("整張圖是空的 —— 路徑多半落在 viewBox 外面");
  const mh = ys[ys.length - 1] - ys[0] + 1;
  const xs = [...cols].sort((a, b) => a - b);
  const mw = xs[xs.length - 1] - xs[0] + 1;
  const kinds = [...opaque.entries()].sort((a, b) => b[1] - a[1]);
  if (kinds[0][0] !== fill.toLowerCase()) throw new Error(`不透明像素最多的顏色是 ${kinds[0][0]}，應該是 ${fill}`);
  const purity = kinds[0][1] / [...opaque.values()].reduce((a, b) => a + b, 0);
  if (purity < 0.999) throw new Error(`不透明像素混到別的顏色（${fill} 只佔 ${(purity * 100).toFixed(1)}%）`);
  const got = mw / mh;
  if (Math.abs(got / ratio - 1) > 0.03) {
    throw new Error(`長寬比 ${got.toFixed(4)} 對不上 ${ratio.toFixed(4)} —— 多半是上下被截（見檔頭那段）`);
  }
  return { w, h, mw, mh, ratio: got, transparent: nAlpha0 / (w * h) };
}

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
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chrome) throw new Error("找不到 Chromium —— 設 CHROME_PATH 指到一支");
const isShell = path.basename(chrome).startsWith("headless_shell");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "line-icons-"));

let dirty = 0;
for (const ic of ICONS) {
  const [, , vw, vh] = ic.vb;
  const W = Math.round(ic.w * HI);
  const H = Math.round(W / ic.ratio);
  const inner = 1 - 2 * PADR;
  const s = Math.min((W * inner) / vw, (H * inner) / vh);
  const tx = (W - vw * s) / 2, ty = (H - vh * s) / 2;
  /* ⚠ 這裡是**照抄**頁首那個 <g> 的 translate（值本身已經是負的），
     不要再加一次負號 —— 加了整條路徑會落到 viewBox 外面，
     Chromium 不報錯，產出一張全透明的空圖。（2026-08-28 踩過。） */
  const shift = ic.shift ? ` translate(${ic.shift[0]} ${ic.shift[1]})` : "";
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g transform="translate(${tx} ${ty}) scale(${s})${shift}">
    <path fill="${ic.fill}" fill-rule="evenodd" d="${ic.d}"/>
  </g>
</svg>`;
  const page = path.join(dir, `${ic.name}.html`);
  const png = path.join(dir, `${ic.name}.png`);
  fs.writeFileSync(page,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0}` +
    `svg{display:block;width:${W}px;height:${H}px}</style>${svg}`, "utf8");
  execFileSync(chrome, [
    ...(isShell ? [] : ["--headless"]),
    "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
    "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${W},${H}`,
    `--user-data-dir=${path.join(dir, "profile")}`, `file://${page}`,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  if (!fs.existsSync(png)) throw new Error(`Chromium 沒有產出 ${ic.name}.png`);
  const buf = fs.readFileSync(png);
  const info = inspect(buf, ic);
  const dest = path.join(ROOT, "assets", `${ic.name}.png`);
  const same = fs.existsSync(dest) && fs.readFileSync(dest).equals(buf);
  if (!same) dirty++;
  if (!CHECK_ONLY && !same) fs.writeFileSync(dest, buf);
  console.log(`  ${ic.name.padEnd(11)} ${String(info.w).padStart(3)}×${String(info.h).padEnd(3)}` +
    `　圖形 ${info.mw}×${info.mh}　長寬比 ${info.ratio.toFixed(4)}` +
    `　透明 ${(info.transparent * 100).toFixed(1)}%　${ic.fill}　` +
    `LINE 上 ${ic.w}px 寬　${same ? "沒變" : CHECK_ONLY ? "⚠ 不一樣" : "已寫入"}`);
}
if (CHECK_ONLY) process.exit(dirty ? 1 : 0);
