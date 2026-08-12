#!/usr/bin/env node
/* =============================================================================
   從 assets/icon.svg 產生「加到主畫面」用的點陣圖示
   -----------------------------------------------------------------------------
   用法：  node tools/app-icons.mjs
           node tools/app-icons.mjs --check     (只比對，不寫檔；不一致就回傳非零)

   產物（都已進版控）：
     assets/icon-180.png            iOS「加入主畫面」——  <link rel="apple-touch-icon">
     assets/icon-192.png            Android，site.webmanifest 的 purpose: any
     assets/icon-512.png            同上，安裝畫面／啟動畫面會用到大的那張
     assets/icon-maskable-512.png   Android 的 purpose: maskable（它會自己裁形狀）

   什麼時候要跑：**只有動到 assets/icon.svg 的顏色或幾何時。**
   和 tools/favicon-ico.mjs 一樣需要 headless Chromium，所以
   `npm run build` 不會呼叫它（這個 repo 零 npm 依賴，Windows 本機通常沒有那個執行檔）。
   產物已經進版控，跑不動它完全不影響建置與部署。

   ---------------------------------------------------------------------------
   為什麼不能沿用 favicon —— 三件事都不一樣

   1. **底不能是透明的。** iOS 收到帶 alpha 的 apple-touch-icon 會直接壓在純黑上，
      標誌本身是暗色，壓完就是一塊看不出東西的黑磚。所以 icon.svg 有一張滿版的
      <rect> 當底，而這支腳本會**逐像素檢查產物完全不透明**（見下面的保險絲）。
   2. **要方的。** favicon 的標誌是橫的 2.03:1，放進方框只佔中間一條 ——
      那在分頁列是對的（PALETTE 第六之七節：不要為了填滿方框加底色方塊），
      但主畫面的圖示本來就是一塊磚，四周留白是磚的一部分，不是「沒填滿」。
   3. **尺寸差一個數量級。** favicon 最小 16px，主畫面最小 180px。
      favicon 把牙洞放大 1.6 倍是為了 16px 下那個洞不被抗鋸齒吃掉；
      這裡用原始比例，洞在 180px 上有 14px 寬，放大反而失真。

   ---------------------------------------------------------------------------
   maskable 是怎麼來的

   Android 會把 maskable 圖示裁成各家自己的形狀（圓、方、水滴…），
   規範保證不被裁掉的只有**正中央直徑 80% 的圓**。
   2.02918:1 的標誌要塞進直徑 819.2 的圓，寬度上限是 734.8px；
   icon.svg 給 iOS 用的是 778px（76%），會超出，所以這裡把那個 scale 換成 .696
   （696px、68%）再算一張。**換的是字串，不是重寫一份 SVG** ——
   兩張的路徑、顏色永遠同一個來源，不會有一邊改了另一邊忘了改的情況。
   ============================================================================= */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SVG_FILE = path.join(ROOT, "assets", "icon.svg");

const CHECK_ONLY = process.argv.includes("--check");

/* 要產生哪幾張。maskable 為 true 的那張會先把 scale 換掉。 */
const TARGETS = [
  { file: "icon-180.png", size: 180, maskable: false },
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
];

/* maskable 版要把 icon.svg 的放大倍率換成這個值（68%，理由見上面）。 */
const SCALE_MASKABLE = ".696";

/* ⚠⚠ **一定要連 `transform="translate(512 512) ` 一起比對，不能只找 `scale(…)`。**
   icon.svg 的註解裡就在討論那個倍率，字面上寫著 scale(.778) —— 全檔共三處，
   真正生效的 <g> 上那個排在最後。用字串或寬鬆的正規式去換，換到的是**註解裡
   那一個**，<g> 紋風不動，於是 maskable 版和一般版**逐位元組完全相同**。
   已經踩過一次：兩張 512 都是 7900 位元組、連顏色數都一樣，光看檔案列表看不出來，
   要 cmp 過才發現。（和 CLAUDE.md 第八節那個「replace('</body>') 換到註解裡那一個」
   是同一種坑 —— 這一站的註解寫得很長，特別容易中。）
   下面另外有一道「只准命中一次」的檢查，把這件事釘死。 */
const SCALE_RE = /(transform="translate\(512 512\) )scale\([^)]*\)/g;

/* ---------- 找 headless Chromium ---------- */
/* 和 tools/favicon-ico.mjs 同一套候選順序，理由也一樣：
   **headless_shell 要排在 chrome 前面** —— 新版 headless 的 chrome 在這個容器裡
   畫得出背景色卻畫不出 <path>，算出來會是一張只有底色的圖。 */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);

  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    }
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "chrome"));
      out.push(path.join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      out.push(path.join(pw, d, "chrome-win", "chrome.exe"));
    }
  }

  out.push(
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  );
  return out;
};

const findChrome = () => chromeCandidates().find((p) => p && fs.existsSync(p));

/* ---------- 算一張 PNG ---------- */

const renderPng = (chrome, svg, size, dir, tag) => {
  const page = path.join(dir, `${tag}.html`);
  const png = path.join(dir, `${tag}.png`);
  fs.writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0}` +
      `svg{display:block;width:${size}px;height:${size}px}</style>` +
      svg,
    "utf8"
  );

  // headless_shell 本身就是無頭的，沒有 --headless 這個旗標
  const isShell = path.basename(chrome).startsWith("headless_shell");

  execFileSync(
    chrome,
    [
      ...(isShell ? [] : ["--headless"]),
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      /* ⚠ 這裡和 favicon-ico.mjs 相反，**底要不透明**（ARGB 全 f）。
         icon.svg 自己有一張滿版的 <rect>，正常情況輪不到這個預設值；
         留白底當第二道保險，萬一 <rect> 被改壞了也不會產出帶 alpha 的圖給 iOS。 */
      "--default-background-color=ffffffff",
      `--screenshot=${png}`,
      `--window-size=${size},${size}`,
      `--user-data-dir=${path.join(dir, `profile-${tag}`)}`,
      `file://${page}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  if (!fs.existsSync(png)) throw new Error(`Chromium 沒有產出 ${tag}`);
  const buf = fs.readFileSync(png);

  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (w !== size || h !== size) {
    throw new Error(`${tag} 要 ${size}×${size}，算出來卻是 ${w}×${h}`);
  }
  return buf;
};

/* ---------- 保險絲：確定圖上真的有東西、而且完全不透明 ----------
   擋的是 favicon-ico.mjs 註解裡記過的那兩種「看起來很正常的空圖」：
   Chromium 畫不出 <path>（只剩底色）、或 SVG 被改壞導致整張透明。
   兩種都不會讓 Chromium 報錯，只能自己把像素讀出來看。
   容器裡沒有 PIL 也沒有 ImageMagick，所以用 zlib 自己解 PNG
   （8-bit、非交錯，只需要認得 RGB 與 RGBA 兩種，不必寫通用解碼器）。

   ⚠ **色彩型態是 2 還是 6 要現讀，不能寫死。** icon.svg 的底是不透明的，
   Chromium 因此會把 alpha 通道整個省掉、寫成色彩型態 2（RGB，每像素 3 位元組）；
   favicon 那邊是透明底，出來的才是型態 6（RGBA，4 位元組）。
   寫死 6 的話這裡會在「產物其實完全正確」的情況下報錯。
   順帶一提，**沒有 alpha 通道正是我們要的結果** —— 下面那個
   「有沒有半透明像素」的檢查在型態 2 時恆真，等於天生就過。 */
const inspect = (buf, tag) => {
  const depth = buf.readUInt8(24);
  const colourType = buf.readUInt8(25);
  if (depth !== 8 || (colourType !== 2 && colourType !== 6)) {
    throw new Error(`${tag} 是 ${depth}-bit／色彩型態 ${colourType}，保險絲只認得 8-bit 的 RGB 與 RGBA`);
  }
  const bpp = colourType === 6 ? 4 : 3;
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);

  // 把所有 IDAT 串起來再解壓
  const idat = [];
  for (let off = 8; off + 8 <= buf.length; ) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    if (type === "IDAT") idat.push(buf.subarray(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));

  const stride = w * bpp;
  const cur = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);
  const colours = new Set();
  let transparent = 0;

  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    raw.copy(cur, 0, y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = cur[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
    for (let x = 0; x < w; x++) {
      const o = x * bpp;
      if (bpp === 4 && cur[o + 3] !== 255) transparent++;
      colours.add((cur[o] << 16) | (cur[o + 1] << 8) | cur[o + 2]);
    }
    cur.copy(prev);
  }

  /* 只有底色 ＝ 標誌沒畫出來。抗鋸齒會製造很多中間色，正常至少幾十種，
     所以門檻設在 8 已經很寬鬆，純粹是擋「一張純色」。 */
  if (colours.size < 8) {
    throw new Error(`${tag} 只有 ${colours.size} 種顏色 —— 標誌沒有畫出來`);
  }
  if (transparent > 0) {
    throw new Error(`${tag} 有 ${transparent} 個半透明像素 —— iOS 會把它壓在純黑上`);
  }
  return { colours: colours.size };
};

/* ---------- 主流程 ---------- */

const chrome = findChrome();
if (!chrome) {
  console.error("× 找不到 headless Chromium。設 CHROME_PATH 指到瀏覽器執行檔再跑一次。");
  process.exit(1);
}

const source = fs.readFileSync(SVG_FILE, "utf8");

/* 命中次數必須剛好 1：0 ＝ <g> 的寫法被改過、比對不到（maskable 會悄悄退化成
   一般版）；≥2 ＝ 比對太寬鬆，咬到註解了。兩種都要當場停下來，
   因為產物在這兩種情況下**看起來都是正常的**。 */
const hits = source.match(SCALE_RE) || [];
if (hits.length !== 1) {
  throw new Error(
    `assets/icon.svg 裡的 scale(…) 應該剛好命中 1 次，實際 ${hits.length} 次 —— ` +
      `maskable 版換不到正確的位置`
  );
}
const maskableSource = source.replace(SCALE_RE, `$1scale(${SCALE_MASKABLE})`);
if (maskableSource === source) {
  throw new Error("maskable 版和一般版一模一樣 —— 倍率沒有被換掉");
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "app-icons-"));
let changed = 0;

try {
  for (const { file, size, maskable } of TARGETS) {
    const svg = maskable ? maskableSource : source;
    const tag = file.replace(/\.png$/, "");
    const buf = renderPng(chrome, svg, size, dir, tag);
    const { colours } = inspect(buf, file);

    const dest = path.join(ROOT, "assets", file);
    const same = fs.existsSync(dest) && fs.readFileSync(dest).equals(buf);

    if (same) {
      console.log(`  = assets/${file}  ${size}×${size}・${colours} 色`);
      continue;
    }
    changed++;
    if (CHECK_ONLY) {
      console.log(`  ≠ assets/${file}  和 icon.svg 不同步`);
    } else {
      fs.writeFileSync(dest, buf);
      console.log(`  ✓ assets/${file}  ${size}×${size}・${colours} 色・${(buf.length / 1024).toFixed(1)} KB`);
    }
  }
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

if (CHECK_ONLY && changed) {
  console.error(`× ${changed} 張圖示和 assets/icon.svg 不同步，跑 node tools/app-icons.mjs 重算`);
  process.exit(1);
}
console.log(changed ? `主畫面圖示已更新（${changed} 張）` : "主畫面圖示都是最新的");
