#!/usr/bin/env node
/* =============================================================================
   把要上線的檔案組進 _site/
   -----------------------------------------------------------------------------
   只複製真正要對外的東西，tools/、site.json、README 等都不會進去。
   用 Node 寫是為了 Windows 本機與 Cloudflare / GitHub 的 Linux 環境行為一致。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { stripFile } from "./strip-notes.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_site");

/* favicon.ico 一定要在根目錄、也一定要進 _site/ ——
   Google 的圖示爬蟲會直接去試 /favicon.ico，路徑錯了等於沒放。
   它不是 build 產物，是 tools/favicon-ico.mjs 從 assets/favicon.svg 算出來、
   已經進版控的檔案，所以缺了就是有東西不對，寧可讓建置出聲。 */
/* site.webmanifest 也一定要在根目錄：它裡面的 start_url／scope 都寫死 "/"，
   而各頁的 <link rel="manifest"> 指的就是根目錄那一份。Android 的
   「加到主螢幕」讀不到它就會退回猜圖示，圖示與名稱都會變成瀏覽器自己撿的。 */
/* ⚠ 根目錄**刻意沒有** apple-touch-icon.png（2026-08-12 第六輪拿掉）。
   那條慣例路徑等於多給 iOS 一個候選，而「候選一多就挑錯那張再縮放」
   正是圖示一直糊掉的原因。整站的 any 版現在只有 assets/icon-192.png 一張。 */
const ALWAYS = ["index.html", "404.html", "favicon.ico", "site.webmanifest",
  "assets", "posts"];
/* history/ 是改版紀錄（原 preview/ 的推導文字），沒有也不影響建置。
   preview/ 是**進行中**的提案頁：定案上線後那一頁會被刪掉、文字搬進 history/，
   所以這個資料夾常常是空的甚至不存在 —— 一樣是選配。
   兩者都靠三道 noindex 擋搜尋引擎（頁面自己的 meta、Worker 的 X-Robots-Tag、
   robots.txt 的 Disallow），沒有鎖。 */
const OPTIONAL = ["sitemap.xml", "robots.txt", "history", "preview"];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let count = 0;
const copy = (name, required) => {
  const src = path.join(ROOT, name);
  if (!fs.existsSync(src)) {
    if (required) {
      console.error(`× 找不到 ${name}`);
      process.exitCode = 1;
    }
    return;
  }
  fs.cpSync(src, path.join(OUT, name), { recursive: true });
  count++;
};

ALWAYS.forEach((n) => copy(n, true));
OPTIONAL.forEach((n) => copy(n, false));

// GitHub Pages 用：告訴它不要跑 Jekyll
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p) : files.push(p);
  }
})(OUT);

console.log(`_site/ 已產生：${count} 個項目、共 ${files.length} 個檔案`);

/* =============================================================================
   把設計註解剝掉（2026-08-13 起）
   -----------------------------------------------------------------------------
   這一站的決策紀錄寫在原始碼註解裡，而 index.html 自己就是送給訪客的檔案 ——
   在這之前每個訪客都會連著 165 KB 的中文推導一起下載（首頁 gzip 的 76%）。

   ⚠ **只剝 _site/ 裡的複本，原始碼一個字都不動。**
   註解留在版控裡繼續當唯一的決策紀錄，CLAUDE.md 那套「決定要寫進註解」的
   規矩完全不受影響；改變的只有訪客拿到的那一份。

   ⚠ 這不是 minifier，只拿掉註解。程式碼一個位元組都沒改，所以「畫面一樣」
   是可以逐項證明的（見 tools/strip-notes.mjs 的說明）。

   ⚠ 剝完會過語法檢查：內嵌 JS 要還能 parse、JSON-LD 要還是合法 JSON、
   CSS 大括號要成對。任何一項不過就讓建置失敗 —— 這一類錯誤在瀏覽器裡
   **不會報錯**，只會讓後面整段悄悄失效，一定要在這裡攔下來。

   要看剝之前的樣子：DIST_KEEP_NOTES=1 node tools/dist.mjs
   ============================================================================= */
const gz = (s) => zlib.gzipSync(Buffer.from(s), { level: 9 }).length;
const STRIPPABLE = /\.(?:html?|css|m?js)$/i;

if (process.env.DIST_KEEP_NOTES === "1") {
  console.log("⚠ DIST_KEEP_NOTES=1 —— 註解保留在 _site/ 裡，不要這樣上線");
} else {
  const problems = [];
  const pending = [];
  let before = 0;
  let after = 0;

  /* ⚠ 先全部算完、確認乾淨，才真的寫檔 —— 邊寫邊檢查的話，
     檢查沒過的時候 _site/ 已經是半剝好的狀態了。 */
  for (const file of files) {
    if (!STRIPPABLE.test(file)) continue;
    const rel = path.relative(OUT, file);
    const src = fs.readFileSync(file, "utf8");
    const { text, problems: found } = stripFile(rel, src);
    problems.push(...found);
    before += gz(src);
    after += gz(text);
    if (text !== src) pending.push([file, text]);
  }

  if (problems.length) {
    console.error("× 剝除註解之後檢查沒過，一個字都沒改，_site/ 不可上線：");
    problems.forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }

  const touched = pending.length;
  pending.forEach(([file, text]) => fs.writeFileSync(file, text));

  const saved = before - after;
  const pct = before ? ((saved / before) * 100).toFixed(1) : "0";
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(
    `設計註解已從 ${touched} 個檔案剝除：` +
    `gzip ${kb(before)} KB → ${kb(after)} KB（少 ${kb(saved)} KB、${pct}%）`,
  );
}
