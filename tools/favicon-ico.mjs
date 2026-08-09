#!/usr/bin/env node
/* =============================================================================
   從 assets/favicon.svg 產生根目錄的 favicon.ico
   -----------------------------------------------------------------------------
   用法：  node tools/favicon-ico.mjs
           node tools/favicon-ico.mjs --check     (只比對，不寫檔)

   什麼時候要跑：**只有動到 assets/favicon.svg 的顏色或幾何時。**
   平常編修文章、改版型都用不到它，`npm run build` 也不會呼叫它 ——
   因為它需要一個 headless Chromium 來算圖，那不是這個專案的日常需求
   （這個 repo 零 npm 依賴，Windows 本機通常也沒有這個執行檔）。
   產物 favicon.ico 已經進版控，跑不動它完全不影響建置與部署。

   ---------------------------------------------------------------------------
   為什麼需要這個檔 —— SVG 已經有了，為什麼還要一顆點陣的？

   給 Google 的。`assets/favicon.svg` 管的是瀏覽器分頁列，那條路很順；
   但搜尋結果那顆小圖是 Google 另一支爬蟲另外抓的，而 /favicon.ico 是它
   在讀不到、或不採用 <link> 宣告的圖示時，會主動去試的老位置。
   多放一顆點陣圖等於多給它一條確定吃得下的路。

   ⚠ **刻意不在任何 <head> 裡宣告它。**
   瀏覽器只有在「頁面完全沒有 <link rel="icon">」時才會去要 /favicon.ico；
   我們每一頁都宣告了 SVG，所以瀏覽器一律走 SVG，行為和現在一模一樣。
   這點很重要：Safari 目前拿到的是 SVG 裡沒有條件的那一行（#4f8065），
   那是 2026-08-08 為了不被墊白底特意調過的結果（PALETTE.md 第六之七節）。
   如果在 <head> 加一行 <link rel="icon" href="/favicon.ico">，Safari 很可能
   改用這顆點陣圖，那次調整就等於白做。**不要順手把它加進 <head>。**

   ---------------------------------------------------------------------------
   顏色：一律用 SVG 裡「沒有條件」的那一行，也就是深色版 #4f8065。

   ICO 是一張圖走天下，沒有 prefers-color-scheme 可用，而 Google 的搜尋結果
   淺色深色兩種底都會出現。#4f8065 正好是為了這種「算圖器不看深色模式」的情境
   挑的那一顆，兩邊都站得住（對白底 4.56:1、對純黑 4.61:1，都過非文字圖形的 3.0）。
   淺色版 #4f6361 對純黑只有 3.29、對深色列 2.67，單張用會在深底吃虧。
   所以這支腳本會**主動把 <style> 拿掉**，避免 Chromium 當下是淺色模式就吃到
   media query 裡那一行 —— 算出來的顏色必須是可預測的，不能看環境臉色。

   底是**透明**的，跟 SVG 一致（SVG 本身沒有背景方塊）。

   ---------------------------------------------------------------------------
   尺寸 16 / 32 / 48 / 96：48 與 96 是給 Google 的（它要求邊長是 48 的倍數），
   16 與 32 是給會退回 /favicon.ico 的老工具（RSS 閱讀器、桌面捷徑）。
   四張都是 PNG，直接包進 ICO —— ICO 從 Vista 起就允許內容是 PNG 而不是 BMP，
   現代瀏覽器與 Google 都吃得下，檔案也比 BMP 小一個數量級。
   ============================================================================= */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SVG_FILE = path.join(ROOT, "assets", "favicon.svg");
const ICO_FILE = path.join(ROOT, "favicon.ico");

const CHECK_ONLY = process.argv.includes("--check");
const SIZES = [16, 32, 48, 96];

/* ---------- 找 headless Chromium ---------- */

const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);

  /* Playwright 裝的那份（這個容器與 Claude Code 雲端 session 都有）。

     ⚠ headless_shell 要排在 chrome 前面，順序是有理由的：
     **新版 headless 的 chrome 在這個容器裡畫不出 SVG 的圖形** ——
     背景色照樣上得去，<rect>／<polygon>／<path> 卻一個都沒有，
     算出來就是一張只有底色的圖。headless_shell（舊 headless）三種都正常。
     下面那道「有沒有真的畫出東西」的保險絲就是為了擋這件事。 */
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

/* ---------- 產生一張 N×N 的 PNG ---------- */

/* 把 <style> 整段拿掉，並把裡面「沒有條件」的那個 fill 寫死到 path 的屬性上。
   兩件事一起做，算出來的顏色才不會受 Chromium 當下的深淺色模式影響，
   而且改 SVG 的顏色時這支腳本會自動跟上，不必兩邊各改一次。

   ⚠ **一定要先把 <!-- --> 註解剪掉，再去找 <style>。**
   favicon.svg 的註解裡本來就在討論 `<style>` 這個標籤，字面上就有 "<style>"。
   直接用 /<style>[\s\S]*?<\/style>/ 去比對，咬到的是**註解裡那一個**，
   一路刪到真正的 </style> 為止 —— 連註解自己的 --> 都被刪掉，
   於是 <path> 整條被吞進一個沒有結尾的註解裡，算出來是一張全透明的空圖。
   （已經踩過一次，症狀是 ICO 結構完全正常、每張尺寸也對，就是看不見圖。） */
const flatten = (svg) => {
  const source = svg.replace(/<!--[\s\S]*?-->/g, "");

  const unconditional = source
    .replace(/@media[^{]*\{[\s\S]*?\}\s*\}/g, "")          // 再剪掉 media query 整塊
    .match(/path\s*\{[^}]*fill\s*:\s*(#[0-9a-fA-F]{3,8})/);
  if (!unconditional) {
    throw new Error("favicon.svg 的 <style> 裡找不到沒有條件的 path { fill: … }");
  }
  const fill = unconditional[1];
  const flat = source
    .replace(/<style>[\s\S]*?<\/style>/i, "")
    .replace(/(<path\b[^>]*\bfill=")[^"]*(")/i, `$1${fill}$2`);
  if (!flat.includes(`fill="${fill}"`)) {
    throw new Error("favicon.svg 的 <path> 上找不到 fill 屬性，無法寫入顏色");
  }
  return { flat, fill };
};

const renderPng = (chrome, svg, size, dir, tag = "icon") => {
  const page = path.join(dir, `${tag}-${size}.html`);
  const png = path.join(dir, `${tag}-${size}.png`);
  fs.writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0;background:transparent}` +
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
      "--default-background-color=00000000",   // ARGB，全 0 ＝ 透明
      `--screenshot=${png}`,
      `--window-size=${size},${size}`,
      `--user-data-dir=${path.join(dir, `profile-${tag}-${size}`)}`,
      `file://${page}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  if (!fs.existsSync(png)) throw new Error(`Chromium 沒有產出 ${size}×${size} 的 PNG`);
  const buf = fs.readFileSync(png);

  // PNG 的 IHDR 就在檔頭後面，順手確認尺寸真的是我們要的
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (w !== size || h !== size) {
    throw new Error(`${size}×${size} 算出來卻是 ${w}×${h}，Chromium 的視窗尺寸沒吃到`);
  }
  return buf;
};

/* ---------- 把幾張 PNG 包成一個 ICO ----------
   格式：6 位元組檔頭 ＋ 每張 16 位元組的目錄項 ＋ 各張影像資料。
   目錄項裡的邊長是 1 個位元組，所以 256 要寫成 0；我們最大只到 96，用不到。 */
const buildIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);              // 保留
  header.writeUInt16LE(1, 2);              // 1 ＝ 圖示（2 是滑鼠游標）
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, at + 0);   // 寬
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);   // 高
    dir.writeUInt8(0, at + 2);                        // 調色盤色數，全彩填 0
    dir.writeUInt8(0, at + 3);                        // 保留
    dir.writeUInt16LE(1, at + 4);                     // 色彩平面
    dir.writeUInt16LE(32, at + 6);                    // 每像素位元數
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...images.map((im) => im.data)]);
};

/* ---------- 主流程 ---------- */

if (!fs.existsSync(SVG_FILE)) {
  console.error(`找不到 ${path.relative(ROOT, SVG_FILE)}`);
  process.exit(1);
}

const chrome = findChrome();
if (!chrome) {
  console.error(
    "× 找不到可用的 headless Chromium，無法算圖。\n" +
      "  這支腳本只有在改過 assets/favicon.svg 時才需要跑；\n" +
      "  favicon.ico 已經在版本控制裡，跑不動它不影響建置或部署。\n" +
      "  若確實要重產，設一個環境變數指向 Chrome／Chromium／Edge 的執行檔：\n" +
      "    CHROME_PATH=/path/to/chrome node tools/favicon-ico.mjs"
  );
  process.exit(1);
}

const { flat, fill } = flatten(fs.readFileSync(SVG_FILE, "utf8"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fangren-favicon-"));

let ico;
try {
  ico = buildIco(
    SIZES.map((size) => {
      const data = renderPng(chrome, flat, size, tmp);

      /* 「有沒有真的畫出東西」的保險絲。
         底是透明的，所以圖沒畫出來時算出來就是一張全透明的圖 —— ICO 的結構、
         每張的尺寸全都正常，只有內容是空的，光看檔案看不出來。
         這裡把同一張頁面**不放 SVG** 再算一次當對照組：兩張如果一個位元組都不差，
         就代表 SVG 根本沒畫上去，寧可直接失敗也不要產出一顆空圖示。 */
      const blank = renderPng(chrome, "", size, tmp, "blank");
      if (data.equals(blank)) {
        throw new Error(
          `${size}×${size} 算出來是一張空圖 —— SVG 沒有被畫出來。\n` +
            `  算圖用的是 ${chrome}\n` +
            "  最可能的原因：新版 headless 的 chrome 畫不出 SVG 圖形（只上得了背景色）。\n" +
            "  改用 Playwright 的 headless_shell，或用 CHROME_PATH 指到別的執行檔再試一次。"
        );
      }
      return { size, data };
    })
  );
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const before = fs.existsSync(ICO_FILE) ? fs.readFileSync(ICO_FILE) : null;
const same = before && before.equals(ico);

if (CHECK_ONLY) {
  console.log(
    same
      ? "[檢查] favicon.ico 與 assets/favicon.svg 一致。"
      : "[檢查] favicon.ico 與 assets/favicon.svg 不一致，需要重新產生。"
  );
  if (!same) process.exitCode = 1;
} else {
  if (!same) fs.writeFileSync(ICO_FILE, ico);
  console.log(
    `${same ? "favicon.ico 沒有變動" : "已寫入 favicon.ico"}` +
      `（${SIZES.join(" / ")} px，顏色 ${fill}，共 ${ico.length} 位元組）\n` +
      `算圖用的是 ${chrome}`
  );
}
