#!/usr/bin/env node
/* =============================================================================
   把文章的 HERO 插圖轉成分享用的點陣圖
   -----------------------------------------------------------------------------
   用法：  node tools/og-images.mjs
           node tools/og-images.mjs --chrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
           node tools/og-images.mjs --force      (已存在也重畫)

   產出：  assets/hero-gum.svg  →  assets/hero-gum-1600.png   （1600×900）

   ⚠ 這支**不會**被 npm run build 呼叫，和 tools/favicon-ico.mjs 一樣是一次性的工具。
     產出的 PNG 已經進版控，只有在改了 HERO 插圖、或新增文章時才要跑一次。

   ---------------------------------------------------------------------------
   為什麼非做不可
   ---------------------------------------------------------------------------
   文章的 HERO 是 SVG。SVG 在網站上很好（無限解析度、幾 KB），但是：

     · **Facebook 與 LINE 的爬蟲不吃 SVG 當分享圖**。og:image 指到 .svg
       等於沒設，對方看到的卡片是空白的，或是爬蟲自己從頁面裡亂撿一張。
       這個坑首頁 2026 年踩過一次（見 index.html 的 og:image 註解），
       當時只補了首頁，六篇文章頁一直沒有 og:image。
     · Article 結構化資料的 image 建議是 1200px 以上的點陣圖。

   所以要有一份點陣的複本。命名沿用這個 repo 既有的慣例：**後綴就是寬度**
   （hero-clinic-night-800.jpg、clinic-room-1-600.jpg），所以是 -1600.png。

   ---------------------------------------------------------------------------
   為什麼用 Chrome 而不是裝一個轉檔套件
   ---------------------------------------------------------------------------
   這個專案是**零 npm 依賴**（CLAUDE.md 第三節），不會為了一次性的轉檔破例。
   系統上本來就有的瀏覽器已經是最好的 SVG 算圖器 —— 網站上那張圖長什麼樣，
   靠的就是同一個引擎，所以轉出來的一定和使用者看到的一致。

   做法是開一個只有一張圖的 HTML，用 --screenshot 整頁截圖。
   SVG 自己已經畫滿整個 800×450 的底（每一張都有一個滿版的 <rect> 或漸層），
   所以不必另外墊背景色，也不會有透明角落。
   ============================================================================= */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "posts");
const ASSETS_DIR = path.join(ROOT, "assets");

const WIDTH = 1600;
const HEIGHT = 900;          // 16:9，和 HERO 原本的 800×450 同比例，不裁切也不留黑邊

const FORCE = process.argv.includes("--force");

/* ---------- 找一個可用的瀏覽器 ----------
   雲端 session 是 Linux＋Playwright 的 Chromium，使用者的 Windows 是一般的 Chrome／Edge。
   兩邊都試，都找不到就請他用 --chrome= 指路徑。 */

const fromArg = process.argv.find((a) => a.startsWith("--chrome="));
const CANDIDATES = [
  fromArg && fromArg.slice("--chrome=".length).replace(/^"|"$/g, ""),
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

/* Playwright 的資料夾名稱帶版本號（chromium-1194），版本一換路徑就變，
   所以先照 glob 的精神自己掃一次，掃到的排在寫死的路徑前面。 */
const PW_ROOT = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
if (fs.existsSync(PW_ROOT)) {
  for (const dir of fs.readdirSync(PW_ROOT)) {
    if (!dir.startsWith("chromium")) continue;
    const p = path.join(PW_ROOT, dir, "chrome-linux", "chrome");
    if (fs.existsSync(p)) CANDIDATES.unshift(p);
  }
}

const chrome = CANDIDATES.find((p) => {
  try { return fs.existsSync(p); } catch { return false; }
});

if (!chrome) {
  console.error("× 找不到 Chrome／Chromium。請用 --chrome=\"<執行檔路徑>\" 指定。");
  console.error("  試過的位置：");
  for (const c of CANDIDATES) console.error(`    ${c}`);
  process.exit(1);
}

/* ---------- 掃出所有文章用到的 HERO ---------- */

const heroes = new Set();
for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(POSTS_DIR, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const m = fs.readFileSync(file, "utf8")
    .match(/<script[^>]*id=["']post-meta["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m) continue;
  try {
    const hero = JSON.parse(m[1]).hero;
    if (hero && hero.endsWith(".svg")) heroes.add(hero);
  } catch { /* build.mjs 會抱怨壞掉的 post-meta，這裡安靜跳過就好 */ }
}

if (!heroes.size) {
  console.log("沒有任何 SVG 格式的 HERO，不需要轉檔。");
  process.exit(0);
}

/* ---------- 逐張截圖 ---------- */

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fangren-og-"));
let made = 0;
let skipped = 0;

for (const hero of [...heroes].sort()) {
  const src = path.join(ASSETS_DIR, hero);
  const out = path.join(ASSETS_DIR, hero.replace(/\.svg$/, `-${WIDTH}.png`));

  if (!fs.existsSync(src)) {
    console.error(`× 找不到 ${hero}`);
    process.exitCode = 1;
    continue;
  }

  // 原圖沒動過就不重畫，免得每次跑都產生一個位元不同的 PNG、把版控洗成一片雜訊
  if (!FORCE && fs.existsSync(out) &&
      fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) {
    skipped++;
    continue;
  }

  /* 用 file:// 直接載 SVG 檔本身也可以，但那樣尺寸由 SVG 自己的 width/height 決定
     （800×450），截出來只有 800 寬。包一層 HTML 才控得住輸出尺寸。 */
  const page = path.join(tmp, "page.html");
  fs.writeFileSync(page, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0}img{display:block;width:${WIDTH}px;height:${HEIGHT}px}</style>
<img src="${src.replace(/\\/g, "/")}">
`, "utf8");

  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${WIDTH},${HEIGHT}`,
    `--screenshot=${out}`,
    "--allow-file-access-from-files",
    `file://${page.replace(/\\/g, "/")}`,
  ], { stdio: ["ignore", "ignore", "pipe"] });

  if (!fs.existsSync(out)) {
    console.error(`× ${hero} 轉檔失敗`);
    process.exitCode = 1;
    continue;
  }
  console.log(`  ${hero}  →  ${path.basename(out)}  (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
  made++;
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\n完成：新產生 ${made} 張、沿用 ${skipped} 張。`);
console.log("（產出的 PNG 要一起 commit —— 它們是 og:image 與 Article schema 的圖片來源。）");
