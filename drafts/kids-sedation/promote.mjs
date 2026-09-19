// 把〈兒童舒眠治療〉搬進 posts/kids-sedation/index.html —— 定案上線用，跑一次就好
//
//   node drafts/kids-sedation/promote.mjs && node tools/build.mjs && node tools/webp.mjs \
//     && node tools/topics.mjs && node tools/build.mjs
//
// 骨架抓 posts/kids-first-visit/index.html（同一科 kids、同一個 tag），做法同
// drafts/kids-crown/promote.mjs。和 preview-gen.mjs 的差別，就是那一支刻意拿掉的每一樣
// 都要留著：
//   ① SEO:START~SEO:END 的標記留著不動 —— build.mjs 會照 post-meta 填進去
//   ② 計數器要有，而且是 data-views-self="kids-sedation"（少了 -self 就不會 +1）
//   ③ 內文的同層連結維持 ../<slug>/ 的原形（BODY.html 本來就是照文章資料夾寫的）
//   ④ RELATED:START~RELATED:END 的標記留著，build.mjs 會填三張卡
// ⚠ DECISIONS.md 第九節第 27 條：只搬 index.html，drafts 底下的工作檔一律留在原地。
//
// ⚠⚠ post-meta 多一個選填欄位 `card`（2026-09-19 新增，tools/build.mjs 支援）：
//   首頁卡與延伸閱讀卡的縮圖是 16:9 置中裁切，這一篇的 HERO 是 4:3 的四格圖，
//   裁下去會把上排的頭頂與下排的腳切斷。所以卡片另外用「電話諮詢」那一格
//   （assets/card-kids-sedation.jpg，1000×563，使用者選的）。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
let out = readFileSync(resolve(root, 'posts/kids-first-visit/index.html'), 'utf8');

const SLUG   = 'kids-sedation';
const TITLE  = '這麼小就要麻醉？認識兒童舒眠牙科治療';
const DESC   = '孩子蛀了好幾顆、一坐上診療椅就哭，醫師提到舒眠。它和全身麻醉差在哪、什麼情況才會被建議、安全看的是什麼，以及禁食與術後那一天要注意什麼。';
const OGDESC = '「舒眠」不是醫學名詞，做的就是鎮靜麻醉。它和全身麻醉差在哪、什麼情況才會被建議、安全看的是什麼。';
const EXCERPT = '孩子滿口蛀牙，一坐上診療椅就哭、就掙扎。醫師提到「舒眠治療」的時候，多數爸媽第一個冒出來的念頭往往不是別的，是安全——這麼小就讓他睡著看牙，真的可以嗎？舒眠不是一個開關，是一條從清醒到睡著的連續刻度；決定它安不安全的，是旁邊有誰在看著、看的是什麼。';
const PUB    = '2026-09-19';
const HERO   = 'hero-kids-sedation-photo';
const CARD   = 'card-kids-sedation.jpg';
const HERO_ALT = readFileSync(resolve(here, 'HERO-ALT.txt'), 'utf8').trim();
// ⚠ 卡片只看得到 HERO 的右上那一格，所以它要有自己的替代文字，不能沿用 HERO_ALT。
const CARD_ALT = '插畫：家裡的餐桌前，媽媽一手拿著手機講電話、一手拿筆，爸爸在旁邊探頭看桌上的紙；右上角一個圓形對話框，裡面是穿松樹印花刷手服、戴同一塊布做的手術帽的麻醉科醫師，拿著話筒看著一張空白的紙。';

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
  "card": "${CARD}",
  "cardAlt": "${CARD_ALT}",
  "heroAlt": "${HERO_ALT}",
  "about": [
    { "type": "MedicalProcedure", "name": "牙科鎮靜" },
    { "type": "MedicalProcedure", "name": "全身麻醉" },
    { "type": "MedicalCondition", "name": "兒童齲齒" },
    { "type": "MedicalCondition", "name": "牙科恐懼症" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── 標題列 ───────────────────────────────────────────────── */
swap('<time datetime="2026-05-06">2026/05/06</time>',
     `<time datetime="${PUB}">${PUB.replace(/-/g, '/')}</time>`, 'date');
swap('data-views-self="kids-first-visit"', `data-views-self="${SLUG}"`, 'counter');
swap('<h1>孩子第一次看牙：時機、氟化物與窩溝封填</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── HERO ─────────────────────────────────────────────────── */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
if (figStart < 0) throw new Error('找不到 post-hero');
out = out.slice(0, figStart) + `    <figure class="post-hero">
      <picture>
        <source type="image/webp" srcset="../../assets/${HERO}-800.webp 800w,
                                          ../../assets/${HERO}-1600.webp 1600w,
                                          ../../assets/${HERO}-2000.webp 2000w"
                sizes="(min-width: 1041px) 656px, (min-width: 721px) 660px, calc(100vw - 28px)">
        <img src="../../assets/${HERO}-1600.jpg"
             srcset="../../assets/${HERO}-800.jpg 800w,
                     ../../assets/${HERO}-1600.jpg 1600w,
                     ../../assets/${HERO}-2000.jpg 2000w"
             sizes="(min-width: 1041px) 656px, (min-width: 721px) 660px, calc(100vw - 28px)"
             alt="${HERO_ALT}" width="2000" height="1493">
      </picture>
    </figure>` + out.slice(figEnd);

/* ── 內文（唯一出處：BODY.html） ──────────────────────────── */
const body = readFileSync(resolve(here, 'BODY.html'), 'utf8');
const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + body + '\n' + out.slice(bodyEnd);

/* ── 文末導覽 ─────────────────────────────────────────────── */
// 站上最近幾篇都只有「上一篇 ＋ 回文章列表」，沒有回頭補「下一篇」——照那個做法，
// 所以 posts/kids-crown/ 一個字都不必動（動了它 <main> 裡的東西，它的 updated 會跳成今天）。
swap('        <a class="btn btn-ghost" href="../gum-bleeding/">&larr; 上一篇：牙齦流血不是火氣大</a>\n        <a class="btn" href="../missing-tooth/">下一篇：缺牙之後怎麼選 &rarr;</a>\n',
     '        <a class="btn btn-ghost" href="../kids-crown/">&larr; 上一篇：同一顆補了又掉</a>\n        <a class="btn" href="../../#articles">回文章列表 &rarr;</a>\n',
     'post-nav');

/* ── 守門 ─────────────────────────────────────────────────── */
const must = [
  ['<!-- SEO:START', 'SEO 標記不見了 —— build.mjs 會找不到地方填'],
  ['<!-- SEO:END -->', '同上'],
  ['<!-- RELATED:START', 'RELATED 標記不見了'],
  [`data-views-self="${SLUG}"`, '計數器沒接上'],
  [`href="https://fangren.net/posts/${SLUG}/"`, 'canonical 沒換'],
  [`${HERO}-1600.jpg`, 'HERO 沒接上'],
  [`"card": "${CARD}"`, '卡片專用圖沒接上'],
  ['"cardAlt"', '卡片的替代文字沒接上 —— 不可以沿用 HERO 那一段'],
  ['潮氣末二氧化碳', '內文沒接上'],
  ['data-spec="kids"', '科別標記掉了'],
];
for (const [s, m] of must) if (!out.includes(s)) throw new Error(m);
// ⚠ 掃「不該出現的字」要先剝掉 SEO 與 RELATED 兩塊 —— 它們現在裝的還是骨架那一篇的
//   標題與麵包屑，跑完 build 才會換掉。不剝的話會卡在一個根本不必修的地方。
const strip = (s, a, b) => {
  const i = s.indexOf(a), j = s.indexOf(b);
  return (i < 0 || j < 0) ? s : s.slice(0, i) + s.slice(j + b.length);
};
const scan = strip(strip(out, '<!-- SEO:START', '<!-- SEO:END -->'),
                   '<!-- RELATED:START', '<!-- RELATED:END -->');
const banned = [
  ['noindex', '草稿的 noindex 跑進來了'],
  ['孩子第一次看牙：時機', '骨架的舊標題殘留'],
  ['data-views-self="kids-first-visit"', '計數器還指著舊 slug'],
  ['pv-', '提案頁的 class 殘留'],
  ['草稿預覽', '提案頁的橫幅殘留'],
  // ⚠ 2026-09-18 使用者指定拿掉「費用參考」那一節；費用與健保都還沒問到診所
  //   （drafts/kids-sedation/FACTCHECK.md 第二節），這一篇一律不寫。
  ['費用', '⚠ 使用者指定拿掉費用那一節 —— 不要再寫回來'],
  ['健保', '⚠ 給付還沒問到診所，這一篇不寫'],
  // ⚠ 診所實際做到哪一格還沒問到，全篇用通稱，不可出現第一人稱
  ['本院', '⚠ 診所實際做到哪一格還沒問到，不可用第一人稱'],
  ['我們診所', '同上'],
];
for (const [s, m] of banned) if (scan.includes(s)) throw new Error(m);

const dest = resolve(root, `posts/${SLUG}/index.html`);
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log(`寫好了：posts/${SLUG}/index.html　${out.length} 字元`);
console.log('接下來：node tools/build.mjs && node tools/webp.mjs && node tools/topics.mjs && node tools/build.mjs');
