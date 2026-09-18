// 產生 preview/kids-sedation/index.html —— 〈兒童舒眠治療〉的文章草稿預覽
//
// 用法：node drafts/kids-sedation/preview-gen.mjs
//
// 骨架抓 posts/kids-first-visit/index.html（同一科 kids、同一個 tag），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 ortho-article／bioceramic-article／
//   three-month-recall／kids-crown 那幾次）。
//
// ⚠⚠ **內文只有一份出處：drafts/kids-sedation/BODY.html。**
//   那一份寫的是「將來放進 posts/kids-sedation/ 之後」的相對路徑（../<slug>/），
//   這支腳本在產生預覽時才把它改寫成 ../../posts/<slug>/。
//
// 這一種要處理的四件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og／JSON-LD 全部指向一個**還沒上線的網址**。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//  ③ 同層連結：../kids-crown/ 這種會指到 preview/ 底下去 —— 見上面那段。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。
//
// ⚠⚠⚠ **HERO 還沒有圖**（這個容器出不了圖），所以這一版放的是一個佔位框。
//   圖到了之後：node tools/hero-resize.mjs <原檔> kids-sedation-photo && node tools/webp.mjs
//   再把下面 HERO 那一段換成真的 <picture>，並把守門的 pv-hero-slot 那一條移到 banned。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
let out = readFileSync(resolve(root, 'posts/kids-first-visit/index.html'), 'utf8');

const TITLE = '這麼小就要麻醉？認識兒童舒眠牙科治療';
const DESC  = '孩子蛀了好幾顆、一坐上診療椅就哭，醫師提到舒眠。它和全身麻醉差在哪、什麼情況才會被建議、安全看的是什麼，以及禁食與術後那一天要注意什麼。';
const EXCERPT = '孩子滿口蛀牙，一坐上診療椅就哭、就掙扎。醫師提到「舒眠治療」的時候，多數爸媽第一個冒出來的念頭往往不是別的，是安全——這麼小就讓他睡著看牙，真的可以嗎？舒眠不是一個開關，是一條從清醒到睡著的連續刻度；決定它安不安全的，是旁邊有誰在看著、看的是什麼。';

const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap('<title>孩子第一次看牙：時機、氟化物與窩溝封填 — 芳仁牙醫診所</title>',
     `<title>${TITLE} — 芳仁牙醫診所（草稿預覽）</title>\n<meta name="robots" content="noindex, nofollow, noarchive">`,
     'title');

out = out.replace(/<meta name="description"[^>]*>\n/, `<meta name="description" content="${DESC}">\n`);
out = out.replace(/<meta property="og:title"[^>]*>\n/, `<meta property="og:title" content="${TITLE}">\n`);
out = out.replace(/<meta property="og:description"[^>]*>\n/, `<meta property="og:description" content="${DESC}">\n`);
out = out.replace(/<link rel="canonical"[^>]*>\n/, '');

const seoStart = out.indexOf('<!-- SEO:START');
const seoEnd = out.indexOf('<!-- SEO:END -->');
if (seoStart < 0 || seoEnd < 0) throw new Error('找不到 SEO 區塊');
out = out.slice(0, seoStart) +
  '<!-- 這一頁是還沒上線的草稿預覽：原本 build 產的 SEO 區塊（canonical／og:url／JSON-LD）\n' +
  '     整段拿掉了 —— 那些欄位會指向一個還不存在的網址。noindex 寫在 <title> 底下。 -->\n' +
  out.slice(seoEnd + '<!-- SEO:END -->'.length + 1);

// post-meta：換成這一篇的（給人看的規格，build 掃不到 preview/）
const metaStart = out.indexOf('<script type="application/json" id="post-meta">');
const metaEnd = out.indexOf('</script>', metaStart) + '</script>'.length;
out = out.slice(0, metaStart) + `<script type="application/json" id="post-meta">
{
  "slug": "kids-sedation",
  "title": "${TITLE}",
  "excerpt": "${EXCERPT}",
  "tag": "兒童牙科",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "【還沒有圖 —— 見 drafts/kids-sedation/HERO-PROMPTS.md】",
  "heroAlt": "【出圖之後補】",
  "about": [
    { "type": "MedicalProcedure", "name": "牙科鎮靜" },
    { "type": "MedicalProcedure", "name": "全身麻醉" },
    { "type": "MedicalCondition", "name": "兒童齲齒" },
    { "type": "MedicalCondition", "name": "牙科恐懼症" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── ② 標題列：拿掉計數器、換日期與標題 ───────────────────── */
// ⚠ .views 後面接的是夜間模式的開關（2026-09-15 加的），不是 </p> ——
//   所以結束錨點抓 .theme-toggle 那一行，不要抓 </p>（kids-crown 那一支是舊的）。
const viewsStart = out.indexOf('        <span class="views"');
const viewsEnd = out.indexOf('        <button class="theme-toggle"', viewsStart);
if (viewsStart < 0 || viewsEnd < 0) throw new Error('找不到 .views 那一塊');
out = out.slice(0, viewsStart) + out.slice(viewsEnd);

swap('<time datetime="2026-05-06">2026/05/06</time>',
     '<time datetime="2026-09-18">草稿・尚未上線</time>', 'date');
swap('<h1>孩子第一次看牙：時機、氟化物與窩溝封填</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒有圖，放佔位框 ───────────────────────────── */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
if (figStart < 0) throw new Error('找不到 post-hero');
out = out.slice(0, figStart) + `    <figure class="post-hero">
      <div class="pv-hero-slot">HERO 插圖還沒畫<br><small>提示詞已經寫好，出圖之後換上這一格</small></div>
    </figure>` + out.slice(figEnd);

/* ── ④ 內文（唯一出處：BODY.html） ────────────────────────── */
let body = readFileSync(resolve(here, 'BODY.html'), 'utf8');
// 同層連結改寫：../<slug>/ → ../../posts/<slug>/（見檔頭）
body = body.replace(/href="\.\.\/([a-z0-9-]+)\//g, 'href="../../posts/$1/');

const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + body + '\n' + out.slice(bodyEnd);

/* ── ⑤ 文末導覽：拿掉同層連結（會指到 preview/ 底下） ──────── */
swap('        <a class="btn btn-ghost" href="../gum-bleeding/">&larr; 上一篇：牙齦流血不是火氣大</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/kids-crown/">&larr; 同一顆補了又掉</a>\n',
     'post-nav（上一篇）');
swap('        <a class="btn" href="../missing-tooth/">下一篇：缺牙之後怎麼選 &rarr;</a>\n',
     '        <a class="btn" href="../../#articles">回文章列表 &rarr;</a>\n',
     'post-nav（下一篇）');

/* ── ⑥ RELATED 區塊整段拿掉（build 產物） ─────────────────── */
const relStart = out.indexOf('<!-- RELATED:START');
const relEnd = out.indexOf('<!-- RELATED:END -->');
if (relStart < 0 || relEnd < 0) throw new Error('找不到 RELATED 區塊');
out = out.slice(0, relStart) + out.slice(relEnd + '<!-- RELATED:END -->'.length + 1);

/* ── ⑦ 這一頁自己的樣式（pv- 前綴）＋草稿橫幅 ───────────── */
const css = `<style>
/* 這一頁專用。⚠ class 一律 pv- 前綴：站上有的短名字幾乎一定會撞（2026-08-16 踩過）。 */
.pv-flag { max-width: var(--content); margin: 0 auto; padding: .55rem var(--pad); font-size: .82rem;
           color: var(--ink-soft); text-align: center; letter-spacing: .02em; }
.pv-flag b { color: var(--accent-deep); }
.pv-hero-slot { display: flex; flex-direction: column; align-items: center; justify-content: center;
                aspect-ratio: 16 / 9; border: 2px dashed var(--rule); border-radius: 10px;
                background: var(--card); color: var(--ink-soft); text-align: center;
                font-size: .95rem; line-height: 1.8; gap: .2rem; }
.pv-hero-slot small { font-size: .78rem; }
</style>`;
swap('<link rel="stylesheet" href="../../assets/style.css">',
     '<link rel="stylesheet" href="../../assets/style.css">\n' + css, 'style');

swap('<main id="main">\n<article>',
     '<main id="main">\n<p class="pv-flag"><b>草稿預覽</b>：這一頁還沒上線，網址沒有被搜尋引擎收錄。</p>\n<article>',
     'flag');

/* ── 守門 ─────────────────────────────────────────────────── */
const must = [
  ['noindex', 'noindex 不見了'],
  [TITLE, '標題沒換到'],
  ['data-spec="kids"', '科別標記掉了'],
  ['潮氣末二氧化碳', '內文沒接上'],
  ['pv-hero-slot', 'HERO 佔位框不見了 —— 圖到了要改這一支，不是刪掉守門'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['孩子第一次看牙：時機、氟化物與窩溝封填 —', '舊標題殘留'],
  ['href="../gum-bleeding/', '同層連結殘留，會指到 preview/ 底下'],
  // ⚠⚠ 2026-09-18 使用者指定「拿掉七、費用參考」。費用與健保都還沒問到診所
  //    （drafts/kids-sedation/FACTCHECK.md 第二節第 7 題），這一篇一律不寫。
  // ⚠ 這兩條刻意掃整頁（含 <head> 的描述與 post-meta 的 excerpt）——
  //   第一次跑就是被自己寫的 excerpt「不是費用」擋下來的，那一句已經改掉。
  ['費用', '⚠ 使用者指定拿掉費用那一節 —— 不要再寫回來'],
  ['健保', '⚠ 給付還沒問到診所，這一篇不寫（同上）'],
  ['萬元', '同上'],
  // ⚠ 診所實際做到哪一格還沒問到，全篇一律用通稱，不可出現第一人稱
  ['本院', '⚠ 診所實際做到哪一格還沒問到，不可用第一人稱（FACTCHECK 第二節）'],
  ['我們診所', '同上'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/kids-sedation/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/kids-sedation/index.html　' + out.length + ' 字元');
