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

import { homeGraph, parseDoctors, parseHours, parseTopics, postGraph } from "./schema.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "posts");
const INDEX_FILE = path.join(ROOT, "index.html");
const MANIFEST_FILE = path.join(ROOT, "tools", "build-manifest.json");
const SITE_FILE = path.join(ROOT, "site.json");
const CLINIC_FILE = path.join(ROOT, "clinic.json");

const CHECK_ONLY = process.argv.includes("--check");

/* 分享圖的尺寸。tools/og-images.mjs 產出的就是這個大小，兩邊要一致。
   ⚠ 2026-08-16 六篇的 HERO 換成點陣插畫之後，這兩個常數只剩「hero 還是 .svg」
     那條舊路在用（現在六篇都不是了）。點陣的 HERO 直接拿 -1600.jpg 當分享圖，
     寬高由 jpegSize() 讀檔頭算出來，不是寫死的。 */
const OG_WIDTH = 1600;
const OG_HEIGHT = 900;

/* 點陣 HERO 的三個寬度（後綴＝寬度，和 assets/ 裡的檔名一致）。
   post-meta 的 hero 只寫 -1600.jpg 那一張，另外兩張由檔名推出來。 */
const HERO_WIDTHS = [800, 1600, 2000];

/* 各個位置的 sizes。⚠ 一律不准寫 100vw —— 高 DPR 的手機會挑到太小的檔再放大，
   版面看起來沒問題但照片是糊的（CLAUDE.md 第九節第 15 條踩過）。
   ⚠ 這幾個值是在瀏覽器裡**量出來的**，不是估的：文章頁的欄寬上限是 --content 44rem
     ＝ 704px，所以 721~1159 那一段圖不會跟著視窗長（實測 900 上是 650 不是 846）。
     延伸閱讀那三張在 ≥1041 是 395.73px、721~1040 約 29vw。
   ⚠ **2026-08-16 版心 1160 → 1280、內距 → 24px 之後這兩個值重量過**（斷點也跟著
     從 1160 換成 **1041**，那是三欄的下界，和兩份樣式表的 @media 同一個數字）：
     首頁縮圖 1440 上實測 392.53（原本寫 373，那個數字在 +12% 那一輪就已經對不上了），
     延伸閱讀 395.73（原本 350）。兩者在 ≥1041 都是「1041 偏小、1280 以上封頂」，
     所以寫封頂值 —— 高估只會多載一點，低估會糊。
   ⚠ **2026-08-17 手機的左右內距 20 → 14px 之後，最後那一段跟著改成 `100vw - 28px`**
     （原本寫的是 `2 * clamp(1.25rem, 3vw, 2.5rem)` ＝ 舊的內距，一改就對不上）。
     ≤720px 的內距現在是定值 14，所以直接寫 28 比抄一份 clamp 準也好讀。
     ⚠ 這不是無關痛癢的 3.4%：430 寬的 DPR2 手機上，舊字串算出 780 會挑 800w，
       實際要 804 —— 正好跨過 800 那個候選的界線，圖就是放大的。
     同一個字串在文章頁的 HERO 也有一份（寫在各篇的 <main> 裡，不是這裡產生的），
     兩邊要一起改。 */
const SIZES_THUMB = "(min-width: 1041px) 393px, (min-width: 721px) 46vw, 92vw";
const SIZES_REL = "(min-width: 1041px) 396px, (min-width: 721px) 30vw, calc(100vw - 28px)";

/* hero 檔名 → srcset。hero 不是 -1600.jpg 這種點陣檔（例如還是 .svg）就回空字串，
   呼叫端會退回只有 src 的舊寫法。 */
const heroSrcset = (hero, prefix) => {
  const m = /^(.*)-1600\.jpg$/.exec(hero || "");
  if (!m) return "";
  return HERO_WIDTHS.map((w) => `${prefix}${m[1]}-${w}.jpg ${w}w`).join(", ");
};

/* srcset 有值才寫這兩個屬性；hero 還是 .svg 的話整組省略，維持舊寫法。 */
const srcsetAttr = (srcset, sizes) => (srcset ? ` srcset="${srcset}" sizes="${sizes}"` : "");

/* JPEG 的寬高：掃檔頭的 SOF 標記。這站沒有任何 npm 依賴，所以自己讀。
   og:image:width / og:image:height 寫錯的話，分享出去的卡片比例會歪。 */
const jpegSize = (file) => {
  let b;
  try { b = fs.readFileSync(file); } catch { return null; }
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = b.readUInt16BE(i + 2);
    // SOF0~SOF15，但 c4（DHT）、c8（JPG）、cc（DAC）不是
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
};

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

/* ---------- 產生的 SEO 區塊（結構化資料＋機器讀的 meta） ----------

   放在 <head> 裡兩個標記之間，整段由本腳本重寫。和 canonical 一樣，
   它**不在內容雜湊涵蓋的 post-meta 與 <main> 之內**，所以加這些東西
   不會讓六篇文章的「最後更新日期」一起跳成今天、把首頁排序打亂。

   標記不存在的話就插在 </head> 前面（新文章從別篇複製過來就會自動長出來）。 */
const SEO_START = "<!-- SEO:START — 由 tools/build.mjs 產生，請勿手動編輯 -->";
const SEO_END = "<!-- SEO:END -->";

const injectSeo = (html, body) => {
  const block = `${SEO_START}\n${body}\n${SEO_END}`;
  const s = html.indexOf("<!-- SEO:START");
  const e = html.indexOf(SEO_END);
  if (s !== -1 && e !== -1) {
    return html.slice(0, s) + block + html.slice(e + SEO_END.length);
  }
  return html.replace(/<\/head>/i, `${block}\n</head>`);
};

/* JSON-LD 是放在 <script> 裡的，字串內容出現 "</" 會提早關掉那個標籤。
   跳成 "<\/" 之後 JSON 的值完全不變（JSON 規範允許這個跳脫），但 HTML 解析器不會誤判。 */
const ldScript = (obj) =>
  `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/<\//g, "<\\/")}\n</script>`;

/* 這一行決定 Google 能不能在搜尋結果放大圖。沒有它預設只給小縮圖。 */
const ROBOTS_META =
  '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';

const metaTag = (attr, name, content) =>
  `<meta ${attr}="${name}" content="${esc(content)}">`;

/* ---------- 診所實體的設定 ---------- */

let clinic = null;
if (fs.existsSync(CLINIC_FILE)) {
  try {
    clinic = JSON.parse(read(CLINIC_FILE).replace(/^﻿/, ""));
  } catch (err) {
    console.error(`× clinic.json 不是合法 JSON（${err.message}），將略過結構化資料。`);
    process.exitCode = 1;
  }
} else {
  console.error("× 找不到 clinic.json，將略過結構化資料。");
  process.exitCode = 1;
}

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

  /* ---------- 2.5 結構化資料與分享用的 meta ----------

     ⚠ 分享圖不能用 HERO 那張 SVG。**Facebook 與 LINE 的爬蟲不吃 SVG**，
       og:image 指到 .svg 等於沒設，對方看到的卡片是空的、或爬蟲自己從頁面亂撿一張。
       首頁 2026 年就踩過這個坑（見 index.html 的 og:image 註解），當時只補了首頁。

     2026-08-16 起六篇的 HERO 是**點陣插畫**，所以分享圖直接就是那張 -1600.jpg
     （爬蟲不吃的是 SVG，JPEG 從來沒問題），不必再轉一份 PNG。
     hero 還是 .svg 的話走舊路：tools/og-images.mjs 轉出來的 PNG 複本。 */
  if (siteUrl && clinic) {
    const url = `${siteUrl}/posts/${meta.slug}/`;
    const isVector = /\.svg$/.test(meta.hero);
    const shareFile = isVector ? meta.hero.replace(/\.svg$/, `-${OG_WIDTH}.png`) : meta.hero;
    const sharePath = path.join(ROOT, "assets", shareFile);
    const hasShare = fs.existsSync(sharePath);
    if (!hasShare) {
      console.warn(`  ⚠ 找不到 assets/${shareFile}，${meta.slug} 不會有分享圖。` +
        (isVector ? "跑一次 node tools/og-images.mjs" : ""));
    }
    /* 點陣的寬高從檔頭讀，不要沿用 OG_WIDTH/OG_HEIGHT ——
       這批插畫是 1600×893（16:8.93），寫成 900 高就是錯的。 */
    const px = hasShare && !isVector ? jpegSize(sharePath) : null;
    const image = hasShare
      ? {
          url: `${siteUrl}/assets/${shareFile}`,
          width: px?.width ?? OG_WIDTH,
          height: px?.height ?? OG_HEIGHT,
          alt: meta.heroAlt || meta.title,
        }
      : null;

    const seo = [
      ROBOTS_META,
      metaTag("property", "og:url", url),
      metaTag("property", "og:locale", "zh_TW"),
      ...(image
        ? [
            metaTag("property", "og:image", image.url),
            metaTag("property", "og:image:width", String(image.width)),
            metaTag("property", "og:image:height", String(image.height)),
            metaTag("property", "og:image:alt", image.alt),
            metaTag("name", "twitter:card", "summary_large_image"),
          ]
        : []),
      metaTag("property", "article:published_time", meta.published),
      metaTag("property", "article:modified_time", updated),
      metaTag("property", "article:section", meta.tag),
      ldScript(postGraph({ site: siteUrl, clinic, meta: { ...meta, updated }, image })),
    ].join("\n");

    html = injectSeo(html, seo);
  }

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

/* ---------- 2.9 每篇文章底下的「延伸閱讀」 ----------

   ⚠ **這一段一定要放在 </main> 外面。**
   文章的內容雜湊涵蓋整個 <main>，把卡片放進去的話，每加一篇新文章就會讓
   舊文的 <main> 跟著變、六篇的「最後更新」全部跳成今天、排序也跟著亂
   （CLAUDE.md 第五節的陷阱）。放在 <main> 與 <footer> 之間就完全不會碰到雜湊，
   而且語意上也對 —— 這是補充導覽，不是這篇文章的內容，所以用 <aside>。

   **刻意沒有可見的小標題**，只留 aria-label。這不是偷懶，是照首頁已經定案的做法：
   首頁「最新文章」那個小標題 2026-08-07 就被拿掉了，只留 aria-label（CLAUDE.md 第九節）。
   同一個站不該一邊拿掉、一邊又加一個回來。

   挑哪三篇：**同科別的優先**（照更新日新到舊），不夠再用其他科別的最新文章補滿。
   六篇的規模下這樣就夠了，不需要標籤權重之類的東西。 */
const REL_START = "<!-- RELATED:START — 由 tools/build.mjs 產生，請勿手動編輯 -->";
const REL_END = "<!-- RELATED:END -->";
const REL_COUNT = 3;

/* 文章底部本來就有一組「上一篇／下一篇」（<nav class="post-nav">，手寫在 <main> 裡）。
   那兩篇要從卡片裡排除 —— 否則同一個畫面上、上下相鄰的兩塊會指到同一篇。
   實測六篇裡有五篇會撞，其中兩篇是上下篇兩個都撞。
   一樣是回頭讀頁面本身，不另外維護一份對照表。 */
const navSlugs = (html) => {
  const nav = html.match(/<nav class="post-nav"[\s\S]*?<\/nav>/i);
  if (!nav) return new Set();
  return new Set([...nav[0].matchAll(/href="\.\.\/([a-z0-9-]+)\/"/g)].map((m) => m[1]));
};

const relatedFor = (self, all, skip) => {
  const others = all.filter((p) => p.slug !== self.slug && !skip.has(p.slug));
  const same = others.filter((p) => SPEC[p.tag] && SPEC[p.tag] === SPEC[self.tag]);
  const rest = others.filter((p) => !same.includes(p));
  return [...same, ...rest].slice(0, REL_COUNT);
};

const relCard = (p) => {
  const spec = SPEC[p.tag];
  return `        <li class="rel-card"${spec ? ` data-spec="${spec}"` : ""}>
          <a href="../${esc(p.slug)}/">
            <img src="../../assets/${esc(p.hero)}"${srcsetAttr(heroSrcset(p.hero, "../../assets/"), SIZES_REL)} alt="" width="2000" height="1116" loading="lazy">
            <span class="rel-body">
              <span class="rel-tag">${esc(p.tag)}</span>
              <span class="rel-title">${esc(p.title)}</span>
              <time class="rel-date" datetime="${p.updated}">${slashDate(p.updated)}</time>
            </span>
          </a>
        </li>`;
};

const relatedBlock = (self, all, skip) => {
  const picks = relatedFor(self, all, skip);
  if (!picks.length) return "";
  return `${REL_START}
<aside class="related" aria-label="延伸閱讀">
  <div class="wrap">
    <ul class="rel-list">
${picks.map(relCard).join("\n")}
    </ul>
  </div>
</aside>
${REL_END}`;
};

const injectRelated = (html, block) => {
  const s = html.indexOf("<!-- RELATED:START");
  const e = html.indexOf(REL_END);
  if (s !== -1 && e !== -1) return html.slice(0, s) + block + html.slice(e + REL_END.length);
  // 第一次：插在 </main> 後面（**不是裡面**）
  return html.replace(/<\/main>/i, `</main>\n\n${block}`);
};

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
        <img class="card-thumb" src="assets/${esc(p.hero)}"${srcsetAttr(heroSrcset(p.hero, "assets/"), SIZES_THUMB)} alt="${esc(p.heroAlt || p.title)}" width="2000" height="1116" loading="lazy">
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

/* 第二趟：把「延伸閱讀」寫進每一篇。
   要等 posts 排序完才知道誰排在誰前面，所以不能併進上面那個掃描迴圈。 */
if (!CHECK_ONLY) {
  for (const p of posts) {
    const file = path.join(POSTS_DIR, p.slug, "index.html");
    const before = read(file);
    const after = injectRelated(before, relatedBlock(p, posts, navSlugs(before)));
    if (after !== before) fs.writeFileSync(file, after, "utf8");
  }
}

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

/* 文章篇數 */
nextIndex = nextIndex.replace(
  /(<b data-post-count>)[^<]*(<\/b>)/,
  `$1${posts.length}$2`
);

nextIndex = withCanonical(nextIndex, `${siteUrl}/`);

/* ---------- 3.4 首頁的結構化資料 ----------

   看診時間、醫師名冊、服務項目全部是**回頭讀這一頁自己的內容**產生的，
   不是另外維護一份（理由寫在 clinic.json 與 tools/schema.mjs 開頭）。
   所以改了 #clinic 那張看診時間卡、或加了一位醫師，JSON-LD 會自己跟上。

   dateModified 先寫成一個佔位符，等下面算出首頁的 lastmod 再換掉 ——
   它自己就是雜湊的輸入之一，先填日期會變成「每跑一次 build 就變一次」的循環。 */
const HOME_UPDATED_TOKEN = "@@HOME_UPDATED@@";

if (siteUrl && clinic) {
  const facts = {
    hours: parseHours(nextIndex),
    topics: parseTopics(nextIndex),
    doctors: parseDoctors(nextIndex),
  };

  const homeTitle = (nextIndex.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
  const homeDesc =
    (nextIndex.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || "";

  const seo = [
    ROBOTS_META,
    metaTag("property", "og:locale", "zh_TW"),
    metaTag("name", "twitter:card", "summary_large_image"),
    ldScript(
      homeGraph({
        site: siteUrl,
        clinic,
        facts,
        title: homeTitle,
        description: homeDesc,
        updatedToken: HOME_UPDATED_TOKEN,
      })
    ),
  ].join("\n");

  nextIndex = injectSeo(nextIndex, seo);

  console.log(
    `結構化資料：${facts.doctors.length} 位醫師、` +
      `${Object.keys(facts.topics).length} 個科別、${facts.hours.length} 段營業時間`
  );
}

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

/* 佔位符換成真正的日期。**一定要排在 homeHash 算完之後** ——
   否則 dateModified 會進到雜湊裡，於是「換了日期 → 雜湊變了 → 下次又換成今天」，
   首頁的 lastmod 從此天天跳，等於這個欄位沒有意義。 */
nextIndex = nextIndex.replace(HOME_UPDATED_TOKEN, homeUpdated);

/* 頁尾那行「網站最後更新」（2026-08-13 起由這裡維護）。
   在那之前它是手寫的，一路停在 8 月 2 日 —— 期間門診表換版型、主畫面圖示換兩輪、
   照片與窄帶的接縫改四輪，一次都沒跟上。手寫的欄位沒有人維護，只會愈差愈多。

   值 ＝ **首頁自己的 lastmod** 與 **最新那篇文章的更新日** 取較新的那個。
   ISO 日期可以直接字串比大小，不必轉 Date。
     · 只改首頁（換版型、改文案）→ homeUpdated 動，這一行跟著動
     · 只發新文章 → posts[0].updated 動，這一行也跟著動
   舊版只看 posts[0].updated，所以「改了首頁但沒發文」的時候完全不會動 ——
   那正是這一行會落後十一天的原因。

   ⚠⚠ **一定要排在 homeHash 算完之後**，理由和上面那行佔位符一樣。
     （其實 normalizeHome() 已經把整個 <time class="site-updated"> 剔除掉了，
     所以就算寫在前面也不會回饋到雜湊 —— 但那是第二道保險，不是可以依賴的順序。）
   ⚠ 對應的元素在 index.html 頁尾，**不要手改那個日期**。 */
const siteUpdated = [homeUpdated, posts[0].updated].sort().pop();
nextIndex = nextIndex.replace(
  /<time class="site-updated"[^>]*>[^<]*<\/time>/,
  `<time class="site-updated" datetime="${siteUpdated}">${zhDate(siteUpdated)}</time>`
);

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
  /* 圖片 sitemap（image 擴充）。列的是**那一頁上真的有的圖**：
     首頁是外觀夜景與兩張診療室內景，文章是它自己的 HERO 插圖。
     診所實景才是這裡真正的目的 —— 讓「斗六 牙醫」在 Google 圖片裡找得到人。

     只寫 <image:loc>。image:caption／title／license／geo_location 這幾個
     Google 2022 年就停用了，寫了也不會讀，徒增檔案大小。 */
  const img = (p) => `<image:image><image:loc>${siteUrl}/assets/${p}</image:loc></image:image>`;
  const homeImages = ["hero-clinic-night.jpg", "clinic-room-1-600.jpg", "clinic-room-2-600.jpg"]
    .filter((f) => fs.existsSync(path.join(ROOT, "assets", f)));

  const urls = [
    `  <url><loc>${siteUrl}/</loc><lastmod>${homeUpdated}</lastmod><priority>1.0</priority>` +
      `${homeImages.map(img).join("")}</url>`,
    ...posts.map(
      (p) => `  <url><loc>${siteUrl}/posts/${p.slug}/</loc><lastmod>${p.updated}</lastmod><priority>0.8</priority>` +
             `${p.hero ? img(p.hero) : ""}</url>`
    ),
  ];
  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
      `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`,
    "utf8"
  );
  /* history/ 是改版紀錄（定案後留下的文字），preview/ 是進行中的提案頁，
     兩者都不要被收錄。
     這個檔案每次 build 都整個重寫，所以規則要寫在這裡，手改 robots.txt 會被蓋掉。 */
  fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /history/\nDisallow: /preview/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
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
