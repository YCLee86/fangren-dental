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

/* =============================================================================
   剝掉註解 —— 只動 _site/ 裡的複本，原始檔一個字都不碰
   -----------------------------------------------------------------------------
   這一站的長註解是專案最珍貴的東西（每個數字的來由都寫在裡面），
   **原始碼裡一個字都不該刪**。但它們沒有理由跟著上線：

     index.html   原始 252KB／gzip 92KB → 去掉註解 84KB／gzip 22KB
                  省下 gzip 70KB，佔 HTML 傳輸量的 76%

   對一個在戶外用手機開這一頁的人，那 70KB 是實實在在的等待。

   ⚠ 三件不能碰：
     ① **build 的錨點**（POSTS／SEO／RELATED 那三組 START/END）留著。
        build.mjs 讀的是原始檔不是 _site/，所以理論上剝掉也不會壞，
        但留著成本是零，而且 _site/ 還能和原始檔對照，不值得省。
     ② **條件註解**（開頭是 `<!--[`）留著。目前全站沒有，先擋著。
     ③ **<script> 的內容整段不碰**。JS 裡的字串或正規式可能長得像註解，
        用正規表示式去剝一定會踩到。做法是先把 script 整段換成佔位符，
        處理完再換回來。CSS 註解則只在 <style> 區塊裡剝。
   ============================================================================= */
const KEEP_MARK = /^\s*(?:POSTS|SEO|RELATED):(?:START|END)\b/;

const stripComments = (html) => {
  /* ③ 先把 script 整段收起來，處理完再放回去。
     ⚠ 佔位符不能用「空格 ＋ 編號 ＋ 空格」那種寫法 —— 正文裡真的出現一樣的字
        就會被換掉，而且相鄰兩個佔位符會共用中間那個空格、還原時少一個。
        這裡用一個不會出現在這些檔案裡的記號，並在用之前先驗一次。 */
  const TOKEN = (n) => `@@FR-SCRIPT-${n}@@`;
  if (html.includes("@@FR-SCRIPT-")) {
    throw new Error("原始檔裡出現了佔位符記號，請換一個 TOKEN");
  }
  const scripts = [];
  let s = html.replace(/<script\b[\s\S]*?<\/script>/gi, (m) => {
    scripts.push(m);
    return TOKEN(scripts.length - 1);
  });

  /* CSS 註解：只在 style 區塊裡面剝。
     ⚠ 取代值一定要用「函式」，不能傳字串 —— CSS 裡只要出現一個錢字號，
        字串形式的取代值會被當成 $& 那一類的樣式去解析，內容就被改掉了。 */
  s = s.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (m, open, css, close) => open + css.replace(/\/\*[\s\S]*?\*\//g, "") + close);

  /* HTML 註解：跳過 build 錨點與條件註解 */
  s = s.replace(/<!--([\s\S]*?)-->/g, (m, body) =>
    (KEEP_MARK.test(body) || body.startsWith("[")) ? m : "");

  /* 剝完會留下一堆空行與行尾空白，收乾淨 */
  s = s.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");

  return s.replace(/@@FR-SCRIPT-(\d+)@@/g, (m, i) => scripts[+i]);
};

let saved = 0;
for (const p of files) {
  if (!p.endsWith(".html")) continue;
  const before = fs.readFileSync(p, "utf8");
  const after = stripComments(before);
  if (after.length < before.length) {
    fs.writeFileSync(p, after);
    saved += before.length - after.length;
  }
}

const kb = (n) => (n / 1024).toFixed(0);
console.log(`_site/ 已產生：${count} 個項目、共 ${files.length} 個檔案`);
console.log(`註解已剝除：省下 ${kb(saved)}KB（原始檔未變動）`);
