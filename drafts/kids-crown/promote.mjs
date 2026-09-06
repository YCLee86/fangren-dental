// 把〈小朋友的牙套〉搬進 posts/kids-crown/index.html —— 定案上線用，跑一次就好
//
//   node drafts/kids-crown/promote.mjs && node tools/build.mjs
//
// 骨架同樣抓 posts/kids-first-visit/index.html（同一科 kids、同一個 tag）。
// ⚠ 和 preview-gen.mjs 的差別，就是那一支刻意拿掉的每一樣都要留著：
//   ① SEO:START~SEO:END 的標記**留著不動** —— build.mjs 會照 post-meta 填進去
//   ② 計數器要有，而且是 data-views-self="kids-crown"（少了 -self 就不會 +1）
//   ③ 內文的同層連結維持 ../<slug>/ 的原形（BODY.html 本來就是照 posts/ 寫的）
//   ④ RELATED:START~RELATED:END 的標記留著，build.mjs 會填三張卡
// ⚠ CLAUDE.md 第九節第 27 條：**只搬 index.html**，drafts/kids-crown/ 底下的
//   ARTICLE／FACTCHECK／HERO-PROMPTS／原圖一律留在原地（dist.mjs 會遞迴複製 posts/）。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
let out = readFileSync(resolve(root, 'posts/kids-first-visit/index.html'), 'utf8');

const SLUG    = 'kids-crown';
const TITLE   = '同一顆補了又掉：小朋友的牙套什麼時候該做，怎麼選';
const DESC    = '補了又掉多半不是體質，是條件——洞的大小、剩下的齒質，以及那幾分鐘能不能保持乾燥。什麼時候該從「補」換成「整顆包起來」，不鏽鋼牙套與全鋯牙套又差在哪裡。';
const OGDESC  = '補了又掉多半不是體質，是條件。什麼時候該從「補」換成「整顆包起來」。';
const EXCERPT = '同一顆牙補了又掉，很多爸媽的第一個念頭是孩子的牙齒特別不好。真正的原因通常在別的地方：黏著要的是乾燥的環境，而那正是小朋友最給不起的東西。當「補不住」變成反覆發生的事，要換的往往不是材料，是做法。';
const PUB     = '2026-09-07';
const PUBTXT  = '2026 年 9 月 7 日';
const HERO    = 'hero-kids-crown-photo';
const HERO_ALT = '四格插畫。上排三格：同一位媽媽帶著兒子看了三位不同的牙醫師，三位都露出為難又抱歉的樣子——第一位攤著手、額頭冒汗，第二位低頭看著小卡片、頭上浮著一團打結的線，第三位搔著後腦不好意思地朝門口比；媽媽從雙手合十拜託、按著胸口焦急，到最後一格眉頭深鎖。下面一整條寬格是兒童牙科的診間：戴著印花手術帽、白袍敞開的兒牙醫師坐在小圓椅上微笑解說，左邊是穿圓點刷手服、端著托盤的助理，右邊是坐在治療椅上的男孩與在旁邊微笑的爸媽；醫師左右各一個對話框，每個裡面都有三顆牙，左邊中間那顆包著銀色的牙套、右邊中間那顆包著白色的牙套';

const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── <head> ───────────────────────────────────────────────── */
swap('<title>孩子第一次看牙：時機、氟化物與窩溝封填 — 芳仁牙醫診所</title>',
     `<title>${TITLE} — 芳仁牙醫診所</title>`, 'title');
out = out.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${DESC}">`);
out = out.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${TITLE}">`);
out = out.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${OGDESC}">`);
swap('<link rel="canonical" href="https://fangren.net/posts/kids-first-visit/">',
     `<link rel="canonical" href="https://fangren.net/posts/${SLUG}/">`, 'canonical');

/* post-meta ───────────────────────────────────────────────── */
const metaStart = out.indexOf('<script type="application/json" id="post-meta">');
const metaEnd = out.indexOf('</script>', metaStart) + '</script>'.length;
out = out.slice(0, metaStart) + `<script type="application/json" id="post-meta">
{
  "slug": "${SLUG}",
  "title": "${TITLE}",
  "excerpt": "${EXCERPT}",
  "tag": "兒童牙科",
  "author": "芳仁牙醫診所 編輯室",
  "published": "${PUB}",
  "updated": "${PUB}",
  "hero": "${HERO}-1600.jpg",
  "heroAlt": "${HERO_ALT}",
  "about": [
    { "type": "MedicalCondition", "name": "兒童齲齒" },
    { "type": "MedicalProcedure", "name": "乳牙牙冠" },
    { "type": "MedicalProcedure", "name": "根管治療" },
    { "type": "MedicalProcedure", "name": "空間維持器" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── 標題列 ───────────────────────────────────────────────── */
swap('<time datetime="2026-05-06">2026 年 5 月 6 日</time>',
     `<time datetime="${PUB}">${PUBTXT}</time>`, 'date');
swap('data-views-self="kids-first-visit"', `data-views-self="${SLUG}"`, 'counter');
swap('<h1>孩子第一次看牙：時機、氟化物與窩溝封填</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── HERO ─────────────────────────────────────────────────── */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
if (figStart < 0) throw new Error('找不到 post-hero');
out = out.slice(0, figStart) + `    <figure class="post-hero">
      <img src="../../assets/${HERO}-1600.jpg"
           srcset="../../assets/${HERO}-800.jpg 800w,
                   ../../assets/${HERO}-1600.jpg 1600w,
                   ../../assets/${HERO}-2000.jpg 2000w"
           sizes="(min-width: 1041px) 656px, (min-width: 721px) 660px, calc(100vw - 28px)"
           alt="${HERO_ALT}" width="2000" height="1116">
    </figure>` + out.slice(figEnd);

/* ── 內文（唯一出處：BODY.html，連結本來就是 posts/ 的相對路徑） ── */
const body = readFileSync(resolve(here, 'BODY.html'), 'utf8');
const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + body + '\n' + out.slice(bodyEnd);

/* ── 文末導覽 ─────────────────────────────────────────────── */
// ⚠ 站上最近兩篇（crown-materials、three-month-recall）都只有「上一篇 ＋ 回文章列表」，
//   沒有回頭補「下一篇」——照那個做法，所以 three-month-recall 一個字都不必動
//   （動了它 <main> 裡的東西，它的「最後更新」會跳成今天）。
swap('        <a class="btn btn-ghost" href="../gum-bleeding/">&larr; 上一篇：牙齦流血不是火氣大</a>\n        <a class="btn" href="../missing-tooth/">下一篇：缺牙之後怎麼選 &rarr;</a>\n',
     '        <a class="btn btn-ghost" href="../three-month-recall/">&larr; 上一篇：三個月一次的洗牙與塗氟</a>\n        <a class="btn" href="../../#articles">回文章列表 &rarr;</a>\n',
     'post-nav');

/* ── 守門 ─────────────────────────────────────────────────── */
const must = [
  ['<!-- SEO:START', 'SEO 標記不見了 —— build.mjs 會找不到地方填'],
  ['<!-- SEO:END -->', '同上'],
  ['<!-- RELATED:START', 'RELATED 標記不見了'],
  [`data-views-self="${SLUG}"`, '計數器沒接上'],
  [`href="https://fangren.net/posts/${SLUG}/"`, 'canonical 沒換'],
  [`${HERO}-1600.jpg`, 'HERO 沒接上'],
  ['不鏽鋼牙套', '內文沒接上'],
  ['data-spec="kids"', '科別標記掉了'],
];
for (const [s, m] of must) if (!out.includes(s)) throw new Error(m);
// ⚠ 掃「不該出現的字」時要先把 SEO 與 RELATED 兩個區塊剝掉 —— 它們是 build.mjs 的產物，
//   現在裡面裝的還是骨架那一篇的標題（headline／name／麵包屑），跑完 build 就會被換掉。
//   不剝的話這一支會卡在一個根本不必修的地方。
const strip = (s, a, b) => {
  const i = s.indexOf(a), j = s.indexOf(b);
  return (i < 0 || j < 0) ? s : s.slice(0, i) + s.slice(j + b.length);
};
const scan = strip(strip(out, '<!-- SEO:START', '<!-- SEO:END -->'),
                   '<!-- RELATED:START', '<!-- RELATED:END -->');
const banned = [
  ['noindex', '草稿的 noindex 跑進來了'],
  ['kids-first-visit：', '骨架的舊字殘留'],
  ['孩子第一次看牙：時機', '舊標題殘留'],
  ['data-views-self="kids-first-visit"', '計數器還指著舊 slug'],
  ['豪氏', '豪氏牙套那一節已經拿掉了 —— 見 drafts/kids-crown/PENDING-hall.md'],
  ['健保', '給付與費用還沒問到診所，這一篇不寫'],
  ['pv-', '提案頁的 class 殘留'],
];
for (const [s, m] of banned) if (scan.includes(s)) throw new Error(m);

const dest = resolve(root, `posts/${SLUG}/index.html`);
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log(`寫好了：posts/${SLUG}/index.html　${out.length} 字元`);
console.log('接下來：node tools/build.mjs');
