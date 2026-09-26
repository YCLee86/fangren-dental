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
import { CARD_FX, cardCss, cardOverlay, readFxCss } from "./card-motion.mjs";

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
   版面看起來沒問題但照片是糊的（DECISIONS.md 第九節第 15 條踩過）。
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

const missingWebp = new Set();

/* 同一組 srcset 的 WebP 版本（2026-09-18 起）。檔案由 tools/webp.mjs 產生 ——
   `npm run build` **不會**呼叫它，換過圖之後要自己跑一次。
   ⚠ 三個寬度**缺一張就整組回空字串**，那時呼叫端退回只有 JPEG 的舊寫法：
     忘了跑產生器只會少省一點流量，不會變成破圖。 */
const webpSrcset = (hero, prefix) => {
  const m = /^(.*)-1600\.jpg$/.exec(hero || "");
  if (!m) return "";
  for (const w of HERO_WIDTHS) {
    if (!fs.existsSync(path.join(ROOT, "assets", `${m[1]}-${w}.webp`))) { missingWebp.add(m[1]); return ""; }
  }
  return HERO_WIDTHS.map((w) => `${prefix}${m[1]}-${w}.webp ${w}w`).join(", ");
};

/* 把產好的 <img …> 包成 <picture> ＋ 一行 WebP 的 <source>。
   ⚠ <source> 也要自己的 sizes —— 它不會去抄 <img> 那一份。
   ⚠ 版面靠樣式表那條 `picture { display: contents }` 保持不變
     （首頁卡與延伸閱讀卡的 <img> 都是 flex item，殼一生盒子就換它當 item）。 */
const picture = (hero, prefix, sizes, indent, imgTag) => {
  const ws = webpSrcset(hero, prefix);
  if (!ws) return imgTag;
  return `<picture>\n${indent}  <source type="image/webp" srcset="${ws}" sizes="${sizes}">\n${indent}  ${imgTag}\n${indent}</picture>`;
};

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
    /* 「這一科的醫師」那兩塊是本腳本寫進 <main> 的（見第 2.7 節），**整段連同插入時補的空白一起拿掉**，
       不是換成佔位符 —— 換成佔位符的話，第一次寫進去那天二十篇的雜湊全部會變、日期一起跳成當天。 */
    .replace(/<!-- DOCS:START[\s\S]*?<!-- DOCS:END -->\n\n    /g, "")
    .replace(/<!-- DOCPEEK:START[\s\S]*?<!-- DOCPEEK:END -->\n        /g, "")
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
  /* 文章頁 HERO 圖下面那一行「最後更新」，靠這個 class 找到它。
     ⚠ 2026-08-18 到 2026-09-20 之間這一行是空轉的（那段時間畫面上任何一處
       都不顯示 updated）。**2026-09-20 起它真的有對象了**：十六篇的 HERO 圖
       下面各有一個 <p class="post-updated-line">，裡面就是這個 time。
       所以上面那句「留著只是因為無害」已經不成立，不要照它去清掉這一段。
     ⚠ 首頁卡與延伸閱讀卡仍然顯示 published（第 3 節那段長註解沒有被推翻），
       只有文章頁多這一行。
     ⚠ 格式是 2026/09/20 不是 zhDate 的「2026 年 9 月 20 日」——
       同一頁頂端那一行的上架日期就是斜線寫法，兩個日期要看起來是同一種東西。
       頁尾那句「網站最後更新」仍然用 zhDate，那是另一件事。
     ⚠ 這一行的內容**不進內容雜湊** —— normalize() 已經把它換成佔位符了，
       否則會變成「寫進新日期 → 雜湊變了 → 下次又換成今天」的迴圈。 */
  html = html.replace(
    /<time class="post-updated"[^>]*>[^<]*<\/time>/,
    `<time class="post-updated" datetime="${updated}">${updated.replace(/-/g, "/")}</time>`
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
      /* spec 是麵包屑第二層要指到哪一個著陸頁用的（2026-09-20）。
         ⚠ SPEC 那張表因此搬到這個迴圈**前面**了 —— const 有暫時性死區，
           留在原地（第 513 行附近）會在這一行炸 ReferenceError。 */
      ldScript(postGraph({ site: siteUrl, clinic, meta: { ...meta, updated }, image,
                          spec: SPEC[meta.tag] })),
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

/* ---------- 3. 排序並產生卡片 ----------
   -----------------------------------------------------------------------------
   **依上架日期排，不是最後更新日期**（2026-08-18 使用者定案，推翻原本的排法）。

   起因：那一天七篇同時補上「重點整理」，updated 一起跳成當天，
   於是首頁七張卡的日期全變成同一天。使用者：
   「文章卡片上的日期應該是上架時間，而不是最後更新時間。」

   ⚠ **日期與排序一定要用同一個欄位。** 卡片印 published 卻依 updated 排，
     日後改一篇兩年前的舊文，它會跳到第一張、卡片上卻寫著兩年前的日期 ——
     讀起來就是壞掉。所以這兩件事是綁在一起改的，不要只改其中一個。

   ⚠ **updated 沒有被廢掉，只是不再出現在畫面上。** 它仍然由內容雜湊維護，
     而且是三個機器讀的欄位的唯一來源：sitemap 的 lastmod、JSON-LD 的
     dateModified、頁尾那句「網站最後更新」。那三處**不要**改成 published ——
     它們的語意本來就是「這一頁最後改於何時」，是給爬蟲看的。

   ⚠ 同一天上架的兩篇，用 updated 當第二順位（原本的主鍵降級成 tie-break）。 */

posts.sort((a, b) =>
  b.published.localeCompare(a.published) || b.updated.localeCompare(a.updated)
);

/* ---------- 2.9 每篇文章底下的「延伸閱讀」 ----------

   ⚠ **這一段一定要放在 </main> 外面。**
   文章的內容雜湊涵蓋整個 <main>，把卡片放進去的話，每加一篇新文章就會讓
   舊文的 <main> 跟著變、六篇的「最後更新」全部跳成今天、排序也跟著亂
   （CLAUDE.md 第五節的陷阱）。放在 <main> 與 <footer> 之間就完全不會碰到雜湊，
   而且語意上也對 —— 這是補充導覽，不是這篇文章的內容，所以用 <aside>。

   **刻意沒有可見的小標題**，只留 aria-label。這不是偷懶，是照首頁已經定案的做法：
   首頁「最新文章」那個小標題 2026-08-07 就被拿掉了，只留 aria-label（DECISIONS.md 第九節）。
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

/* HERO 的 width/height：讀真實的檔案，不要寫死。
   ⚠⚠ 2026-09-05 以前這兩處寫死 `2000×1116`（站上前十一張都是 16:9），
   〈三個月一次的洗牙與塗氟〉那張是 4:3，寫死就會在圖載入前留錯高度。
   ⚠ 首頁卡的 `.card-thumb` 是 `aspect-ratio: 16/9` ＋ `object-fit: cover`，
   所以那一張在卡片上會被置中裁掉上下 —— 版面不受影響，這裡只是把
   內在尺寸講對（CLS 與 srcset 的挑選都看它）。 */
const heroDim = (hero) => {
  const px = jpegSize(path.join(ROOT, "assets", hero));
  if (!px) return ` width="2000" height="1116"`;   // 非 JPEG（舊的 .svg）就退回原本那組
  return ` width="${px.width}" height="${px.height}"`;
};

/* 首頁卡與延伸閱讀卡要用的圖（2026-09-19 起）。
   post-meta 的 **選填**欄位 `card`：有就用它，沒有就照舊用 `hero`。
   ⚠ 為什麼要有這個欄位：卡片的縮圖是 `aspect-ratio: 16/9` ＋ `object-fit: cover`，
     **非 16:9 的 hero 會被置中裁掉上下**（4:3 各裁 12.3%）。四格式的插畫因此會被
     切斷上排的頭頂與下排的腳 —— 〈兒童舒眠治療〉那一篇當場被使用者抓到。
     那一篇的解法是另外給卡片一張「只有一格」的 16:9 圖。
   ⚠ 站上另一篇 4:3 的 HERO（〈三個月一次的洗牙與塗氟〉）也有同樣的裁切，
     只是它是蜂巢狀分格、切到的不是臉，所以沒有填這個欄位。
   ⚠ `card` 不必是 `-1600.jpg` 那種三尺寸的檔名：檔名不符時
     heroSrcset／webpSrcset 會回空字串，呼叫端自動退回單張 <img> 的舊寫法。 */
const cardImg = (p) => p.card || p.hero;
/* 卡片的替代文字。⚠ 有 `card` 的時候**不能沿用 heroAlt** —— 那一段描述的是完整的
   HERO，而卡片上只看得到裁出來的那一小塊，唸出來會和畫面對不上。
   所以 `card` 一定要配一個 `cardAlt`；沒填就退回 heroAlt（再沒有就用標題）。 */
const cardAlt = (p) => (p.card ? p.cardAlt : null) || p.heroAlt || p.title;

const relCard = (p) => {
  const spec = SPEC[p.tag];
  return `        <li class="rel-card"${spec ? ` data-spec="${spec}"` : ""}>
          <a href="../${esc(p.slug)}/">
            ${picture(cardImg(p), "../../assets/", SIZES_REL, "            ", `<img src="../../assets/${esc(cardImg(p))}"${srcsetAttr(heroSrcset(cardImg(p), "../../assets/"), SIZES_REL)} alt=""${heroDim(cardImg(p))} loading="lazy">`)}
            <span class="rel-body">
              <span class="rel-tag">${esc(p.tag)}</span>
              <span class="rel-title">${esc(p.title)}</span>
              <time class="rel-date" datetime="${p.published}">${slashDate(p.published)}</time>
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


/* ⚠ 那顆分隔點 2026-08-27 從全形的「・」換成半形的「·」。
   起因是使用者在 iPad 上：「日期跟瀏覽次數中間間隔還大的，這邊空空看起來怪怪的。」
   全形字元自己就佔 16.2px（744 上），換成半形省下 11px 左右，
   日期那一列因此塞得下右邊那顆「繼續讀」。
   ⚠ 這一行同時餵首頁與七科著陸頁（著陸頁是 index.html 的快照）——
     改完 index.html 記得跑 node tools/topics.mjs。
   ⚠ 「繼續讀」那三個字**不寫在這裡**，由 .card-more-t::before 的 content 產生：
     寫成文字節點的話，首頁那支篩選會讓「繼續」「讀」命中每一張卡。 */
const card = (p) => {
  const spec = SPEC[p.tag];
  if (!spec) console.warn(`  ⚠ 標籤「${p.tag}」沒有對應的科別代碼，${p.slug} 不會被主題與科別篩到`);
  const pic = picture(cardImg(p), "assets/", SIZES_THUMB, "        ", `<img class="card-thumb" src="assets/${esc(cardImg(p))}"${srcsetAttr(heroSrcset(cardImg(p), "assets/"), SIZES_THUMB)} alt="${esc(cardAlt(p))}"${heroDim(cardImg(p))} loading="lazy">`);
  /* 有動態疊層的那幾篇（目前只有〈隱形矯正〉）把 <picture> 再包一層。
     規格與座標的由來見 tools/card-motion.mjs 的檔頭。 */
  return `      <a class="card" href="posts/${esc(p.slug)}/"${spec ? ` data-spec="${spec}"` : ""}>
        ${cardOverlay(p.slug, pic)}
        <div class="card-body">
          <span class="card-tag">${esc(p.tag)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <p class="card-date">
            <span><span class="sr-only">上架 </span><time datetime="${p.published}">${slashDate(p.published)}</time></span>
            <span class="dot" aria-hidden="true">·</span>
            <span class="views" data-views="${esc(p.slug)}" data-state="loading"><span class="views-n">—</span><small>次瀏覽</small></span>
            <span class="card-more" aria-hidden="true"><span class="card-more-t"></span><svg width="9" height="18" viewBox="0 0 9 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l7 8-7 8"/></svg></span>
          </p>
        </div>
      </a>`;
};

/* ---------- 2.7 文章頁的「這一科的醫師」（2026-09-25 上線）----------
   使用者：「文章點開後出現該科的醫師資訊（不然看文章還要回去查有誰在做這個相關治療）」。
   四輪提案定案的樣子（推導與落選案在 /history/post-doctors.html）：
     ・內文結尾（上下篇按鈕之前）一塊「這一科的醫師」：一位一列，頭像＋名字＋專科藥丸＋
       **這一科的專長**（淡色填滿），整列點下去跳到首頁那一位的醫師卡（/#doc-<代號>）
     ・頂端那一行底下一句「N 位醫師 ›」，點了捲到那一塊（夜間開關留在原位）
     ・右下角一顆「醫師 ﹀」小方塊（照首頁「回到最上面」），捲過半個螢幕出現、
       捲到那一塊就收起來。行為在 assets/post-doctors.js
   ⚠ 名單不另外維護：回頭讀 index.html 的 #doctors，規則和首頁點科別、七科著陸頁同一條 ——
     **專科是這一科，或專長裡有一顆是這一科**。專科藥丸：本科實心、不是本科退成白底。
   ⚠⚠ 這兩塊在 <main> 裡面，所以 normalize() 會把它們整段拿掉 —— 插入的時候補的空白
     要和那兩條正規式**一字不差**，改其中一邊就要改另一邊，不然二十篇的日期會一起跳成當天。
   ⚠ 科別看的是那一篇頂端科別藥丸的 data-spec（和頁面自己連過去的著陸頁同一科）。 */
const DOCS_START = "<!-- DOCS:START — 由 tools/build.mjs 產生，請勿手動編輯 -->";
const DOCS_END = "<!-- DOCS:END -->";
const PEEK_START = "<!-- DOCPEEK:START — 由 tools/build.mjs 產生 -->";
const PEEK_END = "<!-- DOCPEEK:END -->";
/* 標題「○○醫師」用的科別名 ＝ 首頁「主題與科別」那一排的字（一般牙科那一顆是「一般牙科・定期檢查」，取前半）。
   ⚠ 2026-09-26 使用者：「這裡只要寫　齒顎矯正醫師　這一科的醫師　2位都不用」——
     標題原本是「這一科的醫師」、右上角有一個「齒顎矯正・2 位 ›」連到著陸頁，兩個都拿掉了。 */
const SPEC_NAME = {
  general: "一般牙科", perio: "牙周治療", ortho: "齒顎矯正", kids: "兒童牙科",
  surg: "口腔外科", prosth: "植牙・假牙重建", endo: "顯微根管",
};
const allDoctors = (() => {
  const h = read(INDEX_FILE);
  const a = h.indexOf('<section id="doctors">');
  const b = h.indexOf("</section>", a);
  return [...h.slice(a, b).matchAll(/<article class="doc"([^>]*)>([\s\S]*?)<\/article>/g)].map((m) => {
    const [attrs, body] = [m[1], m[2]];
    const id = /\bid="doc-([a-z-]+)"/.exec(attrs);
    const h3 = /<h3>([^<]+)<span class="doc-role">([^<]+)<\/span>/.exec(body);
    if (!id || !h3) throw new Error("index.html 的醫師卡少了 id=\"doc-<代號>\" 或名字／專科那一行，文章頁的醫師區塊產生不出來");
    return {
      slug: id[1], name: h3[1], role: h3[2],
      spec: /data-spec="([a-z]+)"/.exec(attrs)[1],
      face: /<img src="assets\/(doctor-[a-z-]+-400)\.jpg"/.exec(body)?.[1] || null,
      skills: [...body.matchAll(/<span class="sk" data-spec="([a-z]+)">([^<]+)<\/span>/g)].map((x) => ({ spec: x[1], text: x[2] })),
    };
  });
})();
const doctorsFor = (spec) => allDoctors.filter((d) => d.spec === spec || d.skills.some((k) => k.spec === spec));

const docRow = (d, spec) => {
  const face = d.face
    ? `<picture><source type="image/webp" srcset="../../assets/${d.face}.webp"><img src="../../assets/${d.face}.jpg" width="400" height="400" loading="lazy" alt=""></picture>`
    : "";
  const sk = d.skills.filter((k) => k.spec === spec).map((k) => `<span class="sk tag-on">${esc(k.text)}</span>`).join("");
  return `        <li class="pd-row" data-spec="${d.spec}">
          <span class="pd-face">${face}</span>
          <span class="pd-main">
            <span class="pd-name">${esc(d.name)}<span class="doc-role${d.spec === spec ? "" : " tag-off"}">${esc(d.role)}</span></span>${sk ? `
            <span class="pd-sk" data-spec="${spec}">${sk}</span>` : ""}
          </span>
          <span class="pd-chev" aria-hidden="true">›</span>
          <a class="pd-go" href="../../#doc-${d.slug}" aria-label="到首頁看${esc(d.name)}醫師的介紹"></a>
        </li>`;
};
const docsBlock = (spec) => {
  const list = doctorsFor(spec);
  if (!list.length) return "";
  return `${DOCS_START}
    <section class="pd" id="pd" aria-labelledby="pd-h">
      <h2 id="pd-h">${SPEC_NAME[spec]}醫師</h2>
      <ul class="pd-rows">
${list.map((d) => docRow(d, spec)).join("\n")}
      </ul>
      <button class="pd-btt" type="button" aria-label="看${SPEC_NAME[spec]}醫師"><span aria-hidden="true">醫師<svg viewBox="0 0 12 7"><path d="M1 1l5 5 5-5"/></svg></span></button>
    </section>
    ${DOCS_END}`;
};
const peekLink = (spec) => {
  const n = doctorsFor(spec).length;
  return n ? `${PEEK_START}<a class="pd-peek" href="#pd">${n} 位醫師<span aria-hidden="true"> ›</span></a>${PEEK_END}` : "";
};
const injectDocs = (html) => {
  const spec = /<a class="post-tag"[^>]*data-spec="([a-z]+)"/.exec(html)?.[1];
  if (!spec) { console.warn("  ⚠ 找不到頂端科別藥丸的 data-spec，這一篇不放醫師區塊"); return html; }
  /* 先拿掉舊的（連同插入時補的空白），再照現在的名單重寫 —— 和 normalize() 是同一組正規式 */
  let h = html
    .replace(/<!-- DOCS:START[\s\S]*?<!-- DOCS:END -->\n\n    /g, "")
    .replace(/<!-- DOCPEEK:START[\s\S]*?<!-- DOCPEEK:END -->\n        /g, "");
  const block = docsBlock(spec), peek = peekLink(spec);
  const foot = h.indexOf('<div class="post-foot">');
  if (block && foot !== -1) h = h.slice(0, foot) + block + "\n\n    " + h.slice(foot);
  const tg = h.indexOf('<button class="theme-toggle"');
  if (peek && tg !== -1) h = h.slice(0, tg) + peek + "\n        " + h.slice(tg);
  /* 行為那一支：放在最後一個 </body> 前面（在 </main> 外面，不進雜湊） */
  if (!h.includes("assets/post-doctors.js")) {
    const b = h.lastIndexOf("</body>");
    h = h.slice(0, b) + '<script src="../../assets/post-doctors.js" defer></script>\n' + h.slice(b);
  }
  return h;
};

/* 第二趟：把「延伸閱讀」寫進每一篇。
   要等 posts 排序完才知道誰排在誰前面，所以不能併進上面那個掃描迴圈。 */
if (!CHECK_ONLY) {
  for (const p of posts) {
    const file = path.join(POSTS_DIR, p.slug, "index.html");
    const before = read(file);
    const after = injectDocs(injectRelated(before, relatedBlock(p, posts, navSlugs(before))));
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

/* ---------- 3.35 首頁圖卡的動態疊層（2026-09-22 定案上線）----------
   ⚠ 動畫的規格（速度、幅度）是從文章頁 <head> 的 style#hero-fx-css 讀出來的，
     這裡只是把它 ＋ 卡片才需要的那幾條寫進首頁的 <head>。規格只有一份。
   ⚠ 首頁沒有連共用樣式表（它的 CSS 全部內嵌），所以寫在這裡就不會有
     「HTML 換了、CSS 還是舊的」那種問題 —— 2026-09-22 在文章頁踩過一次。
   ⚠ 沒有任何一篇要疊層的時候，這一段會是空的（區塊仍然留著）。 */
const CARDFX_START = "<!-- CARDFX:START — 由 tools/build.mjs 產生，請勿手動編輯 -->";
const CARDFX_END = "<!-- CARDFX:END -->";
{
  const slugs = posts.map((p) => p.slug).filter((sl) => CARD_FX[sl]);
  const body = slugs.length
    ? `<style>\n${cardCss(readFxCss(ROOT, slugs[0]))}\n</style>`
    : "";
  const blk = `${CARDFX_START}\n${body}\n${CARDFX_END}`;
  const a = nextIndex.indexOf("<!-- CARDFX:START");
  const b = nextIndex.indexOf(CARDFX_END);
  nextIndex = (a !== -1 && b !== -1)
    ? nextIndex.slice(0, a) + blk + nextIndex.slice(b + CARDFX_END.length)
    : nextIndex.replace(/<\/head>/i, `${blk}\n</head>`);
  if (slugs.length > 1) console.warn(`  ⚠ 有 ${slugs.length} 篇要疊層，但 CSS 只吃得下一組遮罩座標 —— 要做第二篇得先改 tools/card-motion.mjs`);
}

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

/* ---------- 4之二. 點擊報告要用的「代碼 → 中文標題」 ----------
   /admin/search/ 的點擊紀錄那一份會印出「文章卡：<slug>」，而 slug 是英文的
   （three-month-recall、regular-checkup 這兩個看字面分不出來）。報告頁載入這一份
   把它換成文章真正的標題。
   ⚠ 這是**產生的檔案**，不要手改；標題的唯一來源仍然是各篇的 post-meta。
   ⚠ 站上任何一頁都不會載它，只有報告頁會——所以它不影響首頁的載入。 */

if (!CHECK_ONLY) {
  const titles = {};
  for (const p of posts) titles[p.slug] = p.title;
  const titlesFile = path.join(ROOT, "assets", "post-titles.json");
  const titlesSrc = JSON.stringify(titles, null, 2) + "\n";
  if (!fs.existsSync(titlesFile) || read(titlesFile) !== titlesSrc) {
    fs.writeFileSync(titlesFile, titlesSrc, "utf8");
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

  /* 科別著陸頁 /topics/<spec>/（2026-08-21 上線）。
     ⚠ 它們是 index.html 的快照，內容跟著首頁與文案走 ——
       所以 lastmod 直接用**首頁那一個**，不另外算一份雜湊。
     ⚠ 目錄不存在就整段略過（還沒跑過 tools/topics.mjs 的環境）。
     ⚠ 沒有 <image:image>：著陸頁目前一張自己的圖都沒有
       （DECISIONS.md 第九節第 19 項還沒定案），不要拿別科文章的 HERO 頂。 */
  const topicsDir = path.join(ROOT, "topics");
  const topics = fs.existsSync(topicsDir)
    ? fs.readdirSync(topicsDir).filter((d) =>
        fs.existsSync(path.join(topicsDir, d, "index.html"))).sort()
    : [];

  const urls = [
    `  <url><loc>${siteUrl}/</loc><lastmod>${homeUpdated}</lastmod><priority>1.0</priority>` +
      `${homeImages.map(img).join("")}</url>`,
    ...topics.map(
      (d) => `  <url><loc>${siteUrl}/topics/${d}/</loc><lastmod>${homeUpdated}</lastmod><priority>0.9</priority></url>`
    ),
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
     這個檔案每次 build 都整個重寫，所以規則要寫在這裡，手改 robots.txt 會被蓋掉。

     ⚠⚠ 2026-09-20 加了 AI 機器人的立場（使用者定案「擋訓練、放檢索」）。
       三件不知道就會做錯的事：
       ① **檢索型與訓練型是兩組不同的機器人**，不是一個開關。擋錯邊 ＝ 從那一家的
          AI 回答裡消失，而且沒有任何補償。
       ② **robots.txt 是「最明確的那一組全拿」** —— 替某支機器人開了自己的群組，
          它就不看 `*` 那一組了。所以檢索型那一組要把 /history/ 與 /preview/
          再寫一次，否則對它們變成開放的。
       ③ **Google-Extended 不要擋**：它不影響 AI Overviews／AI Mode，但擋了
          連 Gemini 的引用也會一起沒有。
     ⚠ 這擋不住不守規矩的爬蟲（Bytespider 之類），原理上也做不到 ——
       真要擋只能在 Cloudflare 的 WAF 那一層。而且這個 repo 是 public 的，
       同一份 HTML 在 GitHub 上誰都讀得到。**不要再往這個方向加碼**
       （同 assets/img-guard.js 檔頭那一條）。 */
  fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    [
      "# 一般的搜尋引擎（含 Googlebot —— AI Overviews 與 AI Mode 吃的就是這一份索引）",
      "User-agent: *",
      "Allow: /",
      "Disallow: /history/",
      "Disallow: /preview/",
      "Disallow: /version.txt",
      "# admin/ 是搜尋紀錄的報告頁（2026-09-20，另一台做的）。Worker 已經給它",
      "# noindex ＋ no-store，這裡再擋一次爬取，做法和 history 與 preview 一致。",
      "Disallow: /admin/",
      "",
      "# 檢索型的 AI 機器人：有人發問的當下才來抓，而且會在答案裡附上連結。",
      "# ⚠⚠ 這一組**一定要放行** —— 擋掉等於從 ChatGPT／Claude／Perplexity 的",
      "#   回答裡整個消失（2026-09-20 使用者定案）。",
      "# ⚠ 規則要在這裡再寫一次：robots.txt 是「最明確的那一組全拿」，",
      "#   一旦替某支機器人開了自己的群組，它就**完全不看上面那個 * 群組**了，",
      "#   不重寫的話 /history/ 與 /preview/ 對它們就變成開放的。",
      "User-agent: OAI-SearchBot",
      "User-agent: ChatGPT-User",
      "User-agent: Claude-SearchBot",
      "User-agent: Claude-User",
      "User-agent: PerplexityBot",
      "Allow: /",
      "Disallow: /history/",
      "Disallow: /preview/",
      "Disallow: /version.txt",
      "Disallow: /admin/",
      "",
      "# 訓練型：只拿內容去訓練模型，不會回連。2026-09-20 使用者選擇擋掉。",
      "User-agent: GPTBot",
      "Disallow: /",
      "",
      "User-agent: ClaudeBot",
      "Disallow: /",
      "",
      "# ⚠⚠ **Google-Extended 刻意不擋。** 它不影響 AI Overviews 與 AI Mode",
      "#   （那兩個看的是上面那個 * 群組），但它同時管 Gemini 的 grounding ——",
      "#   擋掉的話訓練停了，Gemini 的**引用也會一起沒有**。使用者定案不擋。",
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
      "",
    ].join("\n"),
    "utf8"
  );
}

if (!CHECK_ONLY) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(nextManifest, null, 2) + "\n", "utf8");
}

/* ---------- 報告 ---------- */

console.log(`${CHECK_ONLY ? "[檢查]" : "[建置]"} 共 ${posts.length} 篇文章，排序後：`);
for (const p of posts) {
  /* 印的是「上架日期」——2026-08-18 起卡片顯示與排序都吃 published。
     後面括號裡是 updated，它仍然是 sitemap 的 lastmod 與 JSON-LD 的
     dateModified 的來源，所以一起印出來對得上。 */
  console.log(`  ${p.published}（更新 ${p.updated}）  ${p.slug.padEnd(20)} ${p.title}`);
}
console.log(`\n首頁 lastmod：${homeUpdated}${homeChanged ? "（內容有變動，已換成今天）" : "（內容沒動，沿用）"}`);
if (changed.length) console.log(`內容有變動、已換成今天(${today()})的：${changed.join(", ")}`);
if (missingWebp.size) {
  /* 只是少省流量，不是壞掉 —— 那幾張的卡片會退回只有 JPEG 的舊寫法。 */
  console.log(`\n提示：這幾張還沒有 WebP，卡片暫時只出 JPEG：${[...missingWebp].join(", ")}`);
  console.log("      跑一次 node tools/webp.mjs 再 build 就會補上。");
}
if (!siteUrl) console.log("\n提示：site.json 尚未填入 url，這次略過 canonical、sitemap.xml 與 robots.txt。");
console.log(CHECK_ONLY ? "\n(--check 模式，未寫入任何檔案)" : "\n完成。");
