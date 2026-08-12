#!/usr/bin/env node
/* =============================================================================
   把要上線的檔案組進 _site/
   -----------------------------------------------------------------------------
   只複製真正要對外的東西，tools/、site.json、README 等都不會進去。
   用 Node 寫是為了 Windows 本機與 Cloudflare / GitHub 的 Linux 環境行為一致。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_site");

/* favicon.ico 一定要在根目錄、也一定要進 _site/ ——
   Google 的圖示爬蟲會直接去試 /favicon.ico，路徑錯了等於沒放。
   它不是 build 產物，是 tools/favicon-ico.mjs 從 assets/favicon.svg 算出來、
   已經進版控的檔案，所以缺了就是有東西不對，寧可讓建置出聲。 */
/* site.webmanifest 也一定要在根目錄：它裡面的 start_url／scope 都寫死 "/"，
   而各頁的 <link rel="manifest"> 指的就是根目錄那一份。Android 的
   「加到主螢幕」讀不到它就會退回猜圖示，圖示與名稱都會變成瀏覽器自己撿的。 */
/* apple-touch-icon*.png 也必須在根目錄：那是 iOS 找不到 <link> 時自己會去試的
   固定路徑（同 favicon.ico 的慣例），少了它就只剩 <link> 那一條路。 */
const ALWAYS = ["index.html", "404.html", "favicon.ico", "site.webmanifest",
  "apple-touch-icon.png", "apple-touch-icon-precomposed.png", "assets", "posts"];
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
