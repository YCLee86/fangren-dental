#!/usr/bin/env node
/* =============================================================================
   芳仁牙醫診所部落格 — 首頁卡片產生器
   -----------------------------------------------------------------------------
   用法：  node tools/build.mjs
           node tools/build.mjs --check     (只檢查，不寫檔；CI 用)

   它會做四件事：
     1. 掃描 posts/<slug>/index.html，讀出每篇文章嵌在 HTML 裡的 post-meta。
     2. 比對內容雜湊，若文章內容有改動，就把「最後更新日期」換成今天，
        並同步寫回文章頁面上顯示的日期。沒改動的文章日期維持不變。
     3. 依「最後更新日期」由新到舊排序，重新產生 index.html 的卡片區塊
        （直接寫成靜態 HTML，不需要前端 JavaScript 讀 JSON）。
     4. 在每一頁的 <head> 補上 canonical（絕對網址，指回 site.json 的正式站）。
     5. 產生 sitemap.xml。首頁的 lastmod 和文章一樣是比對內容雜湊得來的，
        不是抄最新那篇文章的日期 —— 只改首頁、沒發新文章的時候也要動。

   新增文章：複製一個現有的 posts/<slug>/ 資料夾、改內容與 post-meta，
             再跑一次這個指令，首頁卡片就會自己出現並排到最前面。
   ============================================================================= */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "posts");
const INDEX_FILE = path.join(ROOT, "index.html");
const MANIFEST_FILE = path.join(ROOT, "tools", "build-manifest.json");
const SITE_FILE = path.join(ROOT, "site.json");

const CHECK_ONLY = process.argv.includes("--check");

/* ---------- 小工具 ---------- */

const today = () => {
  // 以台灣時間為準，避免在 UTC 的 CI 機器上跨日跳錯天
  const tw = new Date(Date.now() + 8 * 3600 * 1000);
  return tw.toISOString().slice(0, 10);
};

const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);

const zhDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
};

const slashDate = (iso) => iso.replace(/-/g, "/");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const read = (f) => fs.readFileSync(f, "utf8");

/* ---------- 正式站網址 ----------
   canonical 與 sitemap 都要用，所以在掃描文章之前就先讀出來。 */

let siteUrl = "";
if (fs.existsSync(SITE_FILE)) {
  try {
    // 去掉 BOM，否則 JSON.parse 會直接失敗
    siteUrl = (JSON.parse(read(SITE_FILE).replace(/^﻿/, "")).url || "").replace(/\/+$/, "");
  } catch (err) {
    console.error(`× site.json 讀取失敗（${err.message}），將略過 canonical 與 sitemap。`);
    process.exitCode = 1;
  }
}

/* 在 <head> 裡放一行絕對網址的 canonical，宣告「這一頁的正本在 fangren.net」。

   為什麼要有：同一份 HTML 目前有兩個網址送得出去——正式站，以及還活著的舊站
   yclee86.github.io/fangren-dental/（GitHub Pages 直接讀 main 分支根目錄）。
   Google 看到兩份一樣的內容會分散評價。canonical 是絕對網址，所以舊站送出去的
   每一頁都會指回正式站，收錄與評價就集中在 fangren.net。
   順帶也解決 www、結尾斜線、以及網址被加上 ?fbclid=… 這類追蹤參數時被當成不同頁。

   放在 <head>，不在內容雜湊涵蓋的 post-meta 與 <main> 之內，所以加這一行
   不會讓所有文章的「最後更新日期」一起跳成今天。 */
const withCanonical = (html, url) => {
  if (!siteUrl) return html;
  const tag = `<link rel="canonical" href="${url}">`;
  if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, tag);
  }
  // 排在 favicon 那一行前面，跟其他 <link> 待在一起
  if (/<link[^>]+rel=["']icon["'][^>]*>/i.test(html)) {
    return html.replace(/(<link[^>]+rel=["']icon["'][^>]*>)/i, `${tag}\n$1`);
  }
  return html.replace(/<\/head>/i, `${tag}\n</head>`);
};

/* 內容雜湊只看「這篇文章自己的東西」：post-meta 加上 <main> 裡的內容。
   刻意排除兩類東西——
     a) 會被本腳本改寫的日期欄位，否則寫入新日期就會讓下次雜湊改變、永遠停不下來；
     b) 頁首與頁尾等全站共用區塊，改一次診所電話不該讓五篇文章同時「更新」。 */
const normalize = (html) => {
  const meta = html.match(/<script[^>]*id=["']post-meta["'][^>]*>([\s\S]*?)<\/script>/i);
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return [meta ? meta[1] : "", main ? main[1] : html]
    .join("\n---\n")
    .replace(/("updated"\s*:\s*")[^"]*"/g, '$1@"')
    .replace(/<time class="post-updated"[^>]*>[^<]*<\/time>/g, '<time class="post-updated">@</time>')
    .replace(/\r\n/g, "\n");
};

/* ---------- 1. 掃描文章 ---------- */

if (!fs.existsSync(POSTS_DIR)) {
  console.error(`找不到文章資料夾：${POSTS_DIR}`);
  process.exit(1);
}

const manifest = fs.existsSync(MANIFEST_FILE)
  ? JSON.parse(read(MANIFEST_FILE))
  : {};

const nextManifest = {};
const posts = [];
const changed = [];

for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(POSTS_DIR, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;

  let html = read(file);

  const m = html.match(
    /<script[^>]*id=["']post-meta["'][^>]*>([\s\S]*?)<\/script>/i
  );
  if (!m) {
    console.error(`× ${entry.name}/index.html 沒有 post-meta 區塊，已略過`);
    process.exitCode = 1;
    continue;
  }

  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (err) {
    console.error(`× ${entry.name}/index.html 的 post-meta 不是合法 JSON：${err.message}`);
    process.exitCode = 1;
    continue;
  }

  for (const key of ["slug", "title", "excerpt", "tag", "author", "published", "hero"]) {
    if (!meta[key]) {
      console.error(`× ${entry.name}/index.html 的 post-meta 缺少 "${key}"`);
      process.exitCode = 1;
    }
  }
  if (meta.slug !== entry.name) {
    console.error(`× 資料夾名稱 "${entry.name}" 與 post-meta.slug "${meta.slug}" 不一致`);
    process.exitCode = 1;
  }

  /* ---------- 2. 判斷是否需要換上新的更新日期 ---------- */
  const hash = sha(normalize(html));
  const prev = manifest[meta.slug];
  let updated;

  if (prev && prev.hash === hash) {
    updated = prev.updated;                       // 內容沒動，沿用舊日期
  } else {
    updated = prev ? today() : (meta.updated || meta.published);
    if (prev) changed.push(meta.slug);            // 既有文章被修改 → 換今天
  }

  if (meta.updated !== updated) {
    html = html.replace(/("updated"\s*:\s*")[^"]*"/, `$1${updated}"`);
    meta.updated = updated;
  }
  // 同步文章頁面上顯示的「最後更新」
  html = html.replace(
    /<time class="post-updated"[^>]*>[^<]*<\/time>/,
    `<time class="post-updated" datetime="${updated}">${zhDate(updated)}</time>`
  );

  html = withCanonical(html, `${siteUrl}/posts/${meta.slug}/`);

  if (!CHECK_ONLY && html !== read(file)) fs.writeFileSync(file, html, "utf8");

  nextManifest[meta.slug] = { hash, updated };
  posts.push(meta);
}

if (!posts.length) {
  console.error("posts/ 底下沒有任何可用的文章。");
  process.exit(1);
}

/* ---------- 3. 排序並產生卡片 ---------- */

posts.sort((a, b) =>
  b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published)
);

/* 標籤 → 科別代碼。首頁的「主題與科別」用 data-spec 同時篩文章與醫師，
   三個地方（chip、文章標籤、醫師藥丸）共用同一組代碼，同一科才會是同一個色。
   新增標籤時要一起加進來，不然那篇文章不會被任何一顆 chip 篩到。 */
const SPEC = {
  "一般牙科": "general", "定期檢查": "general", "日常保健": "general",
  "牙周照護": "perio",   "牙周治療": "perio",   "植牙": "perio",
  "兒童牙科": "kids",
  "齒顎矯正": "ortho",
  "缺牙重建": "prosth",  "贋復假牙": "prosth",
  "口腔外科": "surg",
  "顯微根管": "endo",
};

const card = (p) => {
  const spec = SPEC[p.tag];
  if (!spec) console.warn(`  ⚠ 標籤「${p.tag}」沒有對應的科別代碼，${p.slug} 不會被主題與科別篩到`);
  return `      <a class="card" href="posts/${esc(p.slug)}/"${spec ? ` data-spec="${spec}"` : ""}>
        <img class="card-thumb" src="assets/${esc(p.hero)}" alt="${esc(p.heroAlt || p.title)}" width="800" height="450" loading="lazy">
        <div class="card-body">
          <span class="card-tag">${esc(p.tag)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <p class="card-date">
            <span><span class="sr-only">更新 </span><time datetime="${p.updated}">${slashDate(p.updated)}</time></span>
            <span class="dot" aria-hidden="true">・</span>
            <span class="views" data-views="${esc(p.slug)}" data-state="loading"><span class="views-n">—</span><small>次瀏覽</small></span>
          </p>
        </div>
      </a>`;
};

const START = "<!-- POSTS:START";
const END = "<!-- POSTS:END -->";

let index = read(INDEX_FILE);
const s = index.indexOf(START);
const e = index.indexOf(END);
if (s === -1 || e === -1) {
  console.error("index.html 找不到 <!-- POSTS:START ... --> / <!-- POSTS:END --> 標記。");
  process.exit(1);
}
const startEnd = index.indexOf("-->", s) + 3;

const block =
  "\n" + posts.map(card).join("\n") + "\n      ";

let nextIndex =
  index.slice(0, startEnd) + block + index.slice(e);

/* 首頁上若有「網站最後更新」的欄位，顯示的是所有文章中最新的那一天。
   （目前的版型沒有這個元素，這一行等於沒作用，留著是為了版型改回來時會自己接上。）
   ⚠ 這個值**不是** sitemap 給首頁的 lastmod，兩者是不同的東西，見下一段。 */
const siteUpdated = posts[0].updated;
nextIndex = nextIndex.replace(
  /<time class="site-updated"[^>]*>[^<]*<\/time>/,
  `<time class="site-updated" datetime="${siteUpdated}">${zhDate(siteUpdated)}</time>`
);

/* 文章篇數 */
nextIndex = nextIndex.replace(
  /(<b data-post-count>)[^<]*(<\/b>)/,
  `$1${posts.length}$2`
);

nextIndex = withCanonical(nextIndex, `${siteUrl}/`);

/* ---------- 3.5 首頁自己的最後更新日（給 sitemap 用） ----------

   首頁在 sitemap 裡的 lastmod 原本抄的是「最新那篇文章的更新日」。
   那個值在文章沒動、只改首頁的時候完全不會變 —— 而首頁被改的次數遠比發新文章多
   （換版型、改標題與 description、換頁首標誌、調 HERO…）。
   實際踩到的後果：2026-08-07 整頁換版型、08-08 換 favicon、08-09 改 <title> 與
   description，sitemap 卻一路宣稱首頁「最後更新 2026-08-02」。
   Google 是看 lastmod 決定要不要回頭重抓的，等於一直在告訴它「別來了，沒變」，
   搜尋結果就長期停在舊的標題與描述上。

   所以首頁改用和文章同一套辦法：對首頁自己的內容取雜湊，變了才換成今天。
   紀錄同樣存在 build-manifest.json，鍵值用 "/"（資料夾名稱不可能長這樣，不會和 slug 撞）。 */
const HOME_KEY = "/";

/* 雜湊前要先把「這支腳本自己寫進去的東西」抹掉，否則每跑一次 build 都會有東西不一樣，
   日期就永遠停在今天、和原本抄文章日期一樣沒有意義（只是換個方向壞）。
   ⚠ 文章卡片那一整塊**要算進去**：卡片的標題、摘要、日期變了，
   首頁對讀者來說就是真的變了，這時候請 Google 回來看是對的。 */
const normalizeHome = (html) =>
  html
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, "")
    .replace(/<time class="site-updated"[^>]*>[^<]*<\/time>/, "")
    .replace(/(<b data-post-count>)[^<]*(<\/b>)/, "$1$2")
    .replace(/\r\n/g, "\n");

const homeHash = sha(normalizeHome(nextIndex));
const prevHome = manifest[HOME_KEY];
const homeChanged = !prevHome || prevHome.hash !== homeHash;
const homeUpdated = homeChanged ? today() : prevHome.updated;
nextManifest[HOME_KEY] = { hash: homeHash, updated: homeUpdated };

if (!CHECK_ONLY && nextIndex !== index) fs.writeFileSync(INDEX_FILE, nextIndex, "utf8");

/* ---------- 4. 計數器允許的代碼清單 ----------
   計數 API 只接受這份清單裡的代碼，避免有人往資料表塞不存在的頁面。 */

const slugList = ["home", ...posts.map((p) => p.slug)];
const slugsSrc =
  "// 由 tools/build.mjs 自動產生，請勿手動編輯。\n" +
  `export const ALLOWED = ${JSON.stringify(slugList, null, 2)};\n`;

if (!CHECK_ONLY) {
  const slugsFile = path.join(ROOT, "src", "allowed-slugs.js");
  fs.mkdirSync(path.dirname(slugsFile), { recursive: true });
  if (!fs.existsSync(slugsFile) || read(slugsFile) !== slugsSrc) {
    fs.writeFileSync(slugsFile, slugsSrc, "utf8");
  }
}

/* ---------- 5. sitemap ---------- */

if (siteUrl && !CHECK_ONLY) {
  const urls = [
    `  <url><loc>${siteUrl}/</loc><lastmod>${homeUpdated}</lastmod><priority>1.0</priority></url>`,
    ...posts.map(
      (p) => `  <url><loc>${siteUrl}/posts/${p.slug}/</loc><lastmod>${p.updated}</lastmod><priority>0.8</priority></url>`
    ),
  ];
  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    "utf8"
  );
  /* preview/ 是未上線的改版提案頁（Worker 另外用密碼擋著），不要被收錄。
     這個檔案每次 build 都整個重寫，所以規則要寫在這裡，手改 robots.txt 會被蓋掉。 */
  fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /preview/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    "utf8"
  );
}

if (!CHECK_ONLY) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(nextManifest, null, 2) + "\n", "utf8");
}

/* ---------- 報告 ---------- */

console.log(`${CHECK_ONLY ? "[檢查]" : "[建置]"} 共 ${posts.length} 篇文章，排序後：`);
for (const p of posts) {
  console.log(`  ${p.updated}  ${p.slug.padEnd(20)} ${p.title}`);
}
console.log(`\n首頁 lastmod：${homeUpdated}${homeChanged ? "（內容有變動，已換成今天）" : "（內容沒動，沿用）"}`);
if (changed.length) console.log(`內容有變動、已換成今天(${today()})的：${changed.join(", ")}`);
if (!siteUrl) console.log("\n提示：site.json 尚未填入 url，這次略過 canonical、sitemap.xml 與 robots.txt。");
console.log(CHECK_ONLY ? "\n(--check 模式，未寫入任何檔案)" : "\n完成。");
