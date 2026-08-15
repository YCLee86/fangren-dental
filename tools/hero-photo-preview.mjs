/* 文章 HERO 換點陣插畫 —— 提案期間的產生器（2026-08-15 起）
   ================================================================
   使用者一次給一張圖，六篇都湊齊之後**一次一起上線**（他 2026-08-15 指定的）。
   所以這支腳本的工作是：把「目前已經有新圖的那幾篇」組成提案頁給他看，
   正式站的 index.html 與 posts/ 一個字都不要動。

       node tools/hero-photo-preview.mjs            產生提案頁
       node tools/hero-photo-preview.mjs --check    只檢查、不寫檔

   產出（都是 index.html／文章頁的**快照**，不要手改，要改就改這支再跑一次）：
       preview/hero-photos-cards/          首頁複本，READY 裡每一篇的卡片縮圖都換掉
       preview/hero-photos-<slug>/         文章頁複本，一篇一頁，只換 .post-hero

   兩種頁面底下都有切換條可以和現況的幾何 SVG 對比：?img=old|new。

   ⚠ 這是**提案期間**的工具，六篇定案上線之後連同 preview/ 那幾頁一起刪掉，
     推導搬進 history/。npm run build 不會呼叫它。

   ⚠ 圖檔要先自己準備好（這支不做縮圖）。命名照站上的慣例「後綴＝寬度」：
       assets/<photo>-800.jpg / -1600.jpg / -2000.jpg
     三個尺寸的理由：文章內文欄最寬 624px，DPR3 要到 1872；首頁縮圖 375 上
     335px、DPR2 要 670。詳見 CLAUDE.md 第九節第 15 條（sizes 那一條坑）。 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

/* ── 已經有新圖的文章。使用者每給一張就在這裡加一筆 ────────────────────────
   photo   ＝ assets/<photo>-{800,1600,2000}.jpg 的檔名主體
   oldHero ＝ 現況那張幾何 SVG（切換條的另一半，也是定案時要被取代的那一張）
   alt     ＝ 新圖的替代文字。要描述**圖裡實際有什麼**，不是抄文章標題 */
const READY = [
  {
    slug: "bass-brushing",
    photo: "hero-brushing-photo",
    oldHero: "hero-brushing.svg",
    alt:
      "洗手台前一整排人各自對著鏡子刷牙：踩著小凳的男孩、背書包的學生、上班族、長輩，" +
      "還有一位長者站在前面用牙線；上方三個放大圈畫出刷毛斜靠在牙齦溝上、以及小幅度來回的方向",
    src: "Gemini_Generated_Image_38gyk538gyk538gy.jpg（2752×1536，使用者 2026-08-15 提供）",
  },
];

/* 窄帶與文章卡的瀏覽數。counter.js 在提案頁要整支拿掉（不然每開一次首頁就 +1），
   所以數字改成寫死的示範值。這一組是 2026-08-15 從 D1 取回來的真值。
   ⚠⚠ 這些數字絕對不要跟著版型搬回正式站 —— 2026-08-07 踩過（8642 蓋掉真實的 190）。 */
const VIEWS = {
  home: 676, "bass-brushing": 30, "gum-bleeding": 27, "kids-arch-expansion": 28,
  "kids-first-visit": 23, "missing-tooth": 28, "regular-checkup": 25,
};

const SIZES_THUMB = "(min-width: 1160px) 373px, (min-width: 721px) 46vw, 92vw";
const SIZES_HERO = "(min-width: 1160px) 624px, calc(100vw - 2 * clamp(1.25rem, 3vw, 2.5rem))";

/* JPEG 的 SOF 標記，用來讀真實尺寸 —— 寫死在這裡遲早會和檔案對不上。 */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`讀不到尺寸：${file}`);
}

const WIDTHS = [800, 1600, 2000];
const srcsetOf = (photo) =>
  WIDTHS.map((w) => `../../assets/${photo}-${w}.jpg ${w}w`).join(", ");

/* 切換條。網址參數 ?img=old|new。
   ⚠ 正規式一定要寫 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到帶數字的值（CLAUDE.md 第八節）。 */
function bar(label, jump) {
  return `
<style>
/* ── 提案用的切換條。定案後連同這一段、下面那支 script 與 data-pv-* 一起消失
      （這幾頁整個會被刪掉，不會有東西留到正式站）。 ── */
.pv-bar{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);
  z-index:9999;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;justify-content:center;
  max-width:calc(100vw - 24px);padding:.5rem .7rem;border-radius:12px;
  background:rgba(30,32,29,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:.82rem;color:#e9eae6;
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}
.pv-bar b{font-weight:500;opacity:.72;letter-spacing:.04em;font-size:.76rem}
.pv-bar button{appearance:none;border:1px solid rgba(233,234,230,.34);background:transparent;color:#e9eae6;
  font:inherit;padding:.3rem .75rem;border-radius:8px;cursor:pointer;line-height:1.6}
.pv-bar button[aria-pressed="true"]{background:#e9eae6;color:#23251f;border-color:#e9eae6}
.pv-bar a{color:#e9eae6;opacity:.7;text-decoration:underline;text-underline-offset:3px}
@media (max-width:420px){.pv-bar{font-size:.78rem;gap:.35rem;padding:.45rem .55rem}}
</style>
<div class="pv-bar" role="group" aria-label="提案切換">
  <b>${label}</b>
  <button type="button" data-img="old" aria-pressed="false">現況（幾何 SVG）</button>
  <button type="button" data-img="new" aria-pressed="true">新圖（點陣插畫）</button>${jump}
</div>
<script>
(function () {
  var imgs = document.querySelectorAll('img[data-pv-new-src]');
  if (!imgs.length) return;
  function apply(v) {
    imgs.forEach(function (img) {
      var p = 'data-pv-' + v + '-';
      var set = img.getAttribute(p + 'srcset');
      if (set) { img.setAttribute('srcset', set); img.setAttribute('sizes', img.getAttribute('data-pv-sizes')); }
      else { img.removeAttribute('srcset'); img.removeAttribute('sizes'); }
      img.setAttribute('src', img.getAttribute(p + 'src'));
      img.setAttribute('alt', img.getAttribute(p + 'alt'));
      img.setAttribute('width', img.getAttribute(p + 'w'));
      img.setAttribute('height', img.getAttribute(p + 'h'));
    });
    document.querySelectorAll('.pv-bar button[data-img]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-img') === v));
    });
    var u = new URL(location.href); u.searchParams.set('img', v);
    history.replaceState(null, '', u);
  }
  var m = /[?&]img=([a-z0-9]+)/.exec(location.search);
  apply(m && m[1] === 'old' ? 'old' : 'new');
  document.querySelectorAll('.pv-bar button[data-img]').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-img')); });
  });
})();
</script>
`;
}

/* ⚠ 切換條一定要插在**最後一個** </body> 前面。這一站的註解裡就寫著那幾個字
   （.nav-lamp 那一段），用 String.replace 會換到註解裡那一個，整段落在 <head>
   的樣式表中間、完全不會執行。症狀是「按鈕不見了」。 */
function appendBeforeBody(html, chunk) {
  const i = html.lastIndexOf("</body>");
  if (i < 0) throw new Error("找不到 </body>");
  return html.slice(0, i) + chunk + html.slice(i);
}

const noindex = (h) => {
  const out = h.replace(
    /<meta name="robots" content="[^"]*">/,
    '<meta name="robots" content="noindex, nofollow, noarchive">'
  );
  if (out === h) throw new Error("robots meta 沒有換成 noindex");
  return out;
};

const dropCounter = (h) => {
  const out = h.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, "");
  if (out === h) throw new Error("counter.js 沒有被拿掉 —— 不拿掉每開一次提案頁首頁就 +1");
  return out;
};

/* 新圖的 <img>。舊圖那一半塞進 data-pv-old-*，切換條靠它切回去。 */
function imgTag(entry, { cls, sizes, extra = "" }) {
  const big = jpegSize(path.join(ROOT, "assets", `${entry.photo}-1600.jpg`));
  const a = [
    cls ? `class="${cls}"` : "",
    `src="../../assets/${entry.photo}-1600.jpg"`,
    `srcset="${srcsetOf(entry.photo)}"`,
    `sizes="${sizes}"`,
    `alt="${entry.alt}"`,
    `width="${big.w}" height="${big.h}"`,
    extra,
    `data-pv-sizes="${sizes}"`,
    `data-pv-new-src="../../assets/${entry.photo}-1600.jpg"`,
    `data-pv-new-srcset="${srcsetOf(entry.photo)}"`,
    `data-pv-new-alt="${entry.alt}"`,
    `data-pv-new-w="${big.w}" data-pv-new-h="${big.h}"`,
    `data-pv-old-src="../../assets/${entry.oldHero}"`,
    `data-pv-old-srcset=""`,
    `data-pv-old-alt="${entry.oldAlt}"`,
    `data-pv-old-w="800" data-pv-old-h="450"`,
  ].filter(Boolean);
  return `<img ${a.join("\n             ")}>`;
}

const written = [];
const write = (rel, s) => {
  written.push(rel);
  if (CHECK) return;
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, s);
};

/* 圖檔先點名，缺一個就停 —— 產生一頁圖是壞的提案頁沒有意義。 */
for (const e of READY) {
  for (const w of WIDTHS) {
    const f = path.join(ROOT, "assets", `${e.photo}-${w}.jpg`);
    if (!fs.existsSync(f)) throw new Error(`缺圖：assets/${e.photo}-${w}.jpg`);
  }
  if (!fs.existsSync(path.join(ROOT, "assets", e.oldHero))) {
    throw new Error(`缺現況那張圖：assets/${e.oldHero}`);
  }
}

/* ───────── 甲、首頁的文章卡（READY 裡每一篇都換） ───────── */
{
  let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

  /* 相對路徑往上兩層。
     ⚠ 不要用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
  h = h.replace(/(src|href)="assets\//g, '$1="../../assets/');
  h = h.replace(/(src|href)="posts\//g, '$1="../../posts/');
  h = h.replace(/href="site\.webmanifest/g, 'href="../../site.webmanifest');
  h = h.replace(/href="\.\/"/g, 'href="../../"');
  /* srcset 整串一起處理：它有好幾個候選，而且**中間那一個沒有寬度後綴**
     （`assets/hero-clinic-night.jpg 1600w` ＝ 基底檔就是 1600w）。
     照「-數字.jpg」去比對會漏掉它，症狀是 HERO 那張照片 404。 */
  h = h.replace(/srcset="([^"]*)"/g, (m, v) =>
    'srcset="' + v.replace(/(^|\s)assets\//g, "$1../../assets/") + '"');

  h = dropCounter(noindex(h));

  h = h.replace(
    '<p class="band-views" data-views-self="home">',
    "<!-- ⚠ 提案頁：上面那句「不要寫死 data-count」講的是正式站。這一頁反過來 ——\n" +
      "           counter.js 已經整支拿掉（不然每開一次首頁的計數就多一次），\n" +
      "           所以數字改用寫死的示範值，來源是 tools/hero-photo-preview.mjs 的 VIEWS。\n" +
      `           ⚠⚠ 這一行絕對不要跟著版型搬回正式站。 -->\n      <p class="band-views" data-count="${VIEWS.home}">`
  );
  if (h.includes('band-views" data-views-self')) throw new Error("窄帶的 data-views-self 沒換掉");

  /* 文章卡的數字：counter.js 拿掉之後會停在「—」，改成寫死的真值。 */
  for (const [slug, n] of Object.entries(VIEWS)) {
    if (slug === "home") continue;
    h = h.replace(
      `<span class="views" data-views="${slug}" data-state="loading"><span class="views-n">—</span>`,
      `<span class="views" data-state="ok"><span class="views-n">${n}</span>`
    );
  }

  for (const e of READY) {
    const re = new RegExp(
      `<img class="card-thumb" src="\\.\\./\\.\\./assets/${e.oldHero.replace(".", "\\.")}" alt="([^"]*)"[^>]*>`
    );
    const m = h.match(re);
    if (!m) throw new Error(`找不到 ${e.slug} 的卡片縮圖`);
    h = h.replace(re, imgTag({ ...e, oldAlt: m[1] }, { cls: "card-thumb", sizes: SIZES_THUMB }));
  }

  const label = READY.length === 1 ? `${READY[0].slug} 的圖` : `${READY.length} 篇的圖`;
  h = appendBeforeBody(h, bar(label, '\n  <a href="#articles">跳到文章列表</a>'));
  write("preview/hero-photos-cards/index.html", h);
}

/* ───────── 乙、文章內文（一篇一頁） ───────── */
for (const e of READY) {
  let h = fs.readFileSync(path.join(ROOT, "posts", e.slug, "index.html"), "utf8");

  /* preview/<name>/ 和 posts/<slug>/ 一樣深，所以 ../../ 全部原封不動；
     只有指向隔壁文章的 ../<slug>/（麵包屑、上下篇、延伸閱讀）要補回 posts/。 */
  h = h.replace(/href="\.\.\/([a-z0-9-]+)\/"/g, 'href="../../posts/$1/"');

  h = dropCounter(noindex(h));

  h = h.replace(`<span class="views" data-views-self="${e.slug}" data-state="loading">`,
    '<span class="views" data-state="ok">');
  h = h.replace('<span class="views-n">—</span>', `<span class="views-n">${VIEWS[e.slug] ?? 0}</span>`);
  if (h.includes("data-views-self")) throw new Error(`${e.slug}：data-views-self 沒換掉`);

  /* ⚠ 只換 .post-hero 那一張。底部「延伸閱讀」三張卡的縮圖也在同一頁，
     那是別篇的圖，不要跟著換。 */
  const re = new RegExp(`<img src="\\.\\./\\.\\./assets/${e.oldHero.replace(".", "\\.")}" alt="([^"]*)"[^>]*>`);
  const m = h.match(re);
  if (!m) throw new Error(`找不到 ${e.slug} 的 HERO 圖`);
  h = h.replace(re, imgTag({ ...e, oldAlt: m[1] }, { sizes: SIZES_HERO }));

  h = appendBeforeBody(h, bar(`${e.slug} 的圖`, ""));
  write(`preview/hero-photos-${e.slug}/index.html`, h);
}

console.log(`${CHECK ? "[檢查] " : ""}已經有新圖的文章：${READY.length} 篇`);
for (const e of READY) console.log(`  ${e.slug.padEnd(20)} ${e.photo}  ← ${e.src}`);
console.log(CHECK ? "\n會產生：" : "\n產生：");
for (const rel of written) console.log(`  ${rel.replace(/\\/g, "/")}`);
if (CHECK) console.log("\n(--check 模式，未寫入任何檔案)");
