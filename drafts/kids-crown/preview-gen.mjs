// 產生 preview/kids-crown/index.html —— 〈小朋友的牙套〉的文章草稿預覽
//
// 用法：node drafts/kids-crown/preview-gen.mjs
//
// 骨架抓 posts/kids-first-visit/index.html（同一科 kids、同一個 tag），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 ortho-article／bioceramic-article／
//   three-month-recall 那三次）。
//
// ⚠⚠ **內文只有一份出處：drafts/kids-crown/BODY.html。**
//   那一份寫的是「將來放進 posts/kids-crown/ 之後」的相對路徑（../<slug>/），
//   這支腳本在產生預覽時才把它改寫成 ../../posts/<slug>/ ——
//   所以定案那天直接把 BODY.html 貼進文章頁就對了，不必改連結。
//
// 這一種要處理的四件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og／JSON-LD 全部指向一個**還沒上線的網址**。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//  ③ 同層連結：preview/<name>/ 和 posts/<slug>/ 深度相同，所以 ../../assets/… 照樣對；
//    但 ../kids-first-visit/ 這種同層連結會指到 preview/ 底下去 —— 見上面那段。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const src = readFileSync(resolve(root, 'posts/kids-first-visit/index.html'), 'utf8');

const TITLE = '同一顆補了又掉：小朋友的牙套什麼時候該做，有哪兩種';
const DESC  = '補了又掉多半不是體質，是條件——洞的大小、剩下的齒質，以及那幾分鐘能不能保持乾燥。什麼時候該從「補」換成「整顆包起來」，不鏽鋼牙套與全鋯牙套差在哪裡。';
const EXCERPT = '同一顆牙補了又掉，很多爸媽的第一個念頭是孩子的牙齒特別不好。真正的原因通常在別的地方：黏著要的是乾燥的環境，而那正是小朋友最給不起的東西。當「補不住」變成反覆發生的事，要換的往往不是材料，是做法。';

let out = src;
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
  "slug": "kids-crown",
  "title": "${TITLE}",
  "excerpt": "${EXCERPT}",
  "tag": "兒童牙科",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "【文案定案之後才畫】",
  "about": [
    { "type": "MedicalCondition", "name": "兒童齲齒" },
    { "type": "MedicalProcedure", "name": "乳牙牙冠" },
    { "type": "MedicalProcedure", "name": "根管治療" },
    { "type": "MedicalProcedure", "name": "空間維持器" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── ② 標題列：拿掉計數器、換日期與標題 ───────────────────── */
const viewsStart = out.indexOf('        <span class="views"');
const viewsEnd = out.indexOf('</span>\n      </p>', viewsStart);
if (viewsStart < 0 || viewsEnd < 0) throw new Error('找不到 .views 那一塊');
out = out.slice(0, viewsStart) + out.slice(viewsEnd + '</span>\n'.length);

swap('<time datetime="2026-05-06">2026 年 5 月 6 日</time>',
     '<time datetime="2026-09-06">草稿・尚未上線</time>', 'date');
swap('<h1>孩子第一次看牙：時機、氟化物與窩溝封填</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒畫，放一塊佔位說明（不要放破圖） ─────────── */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
if (figStart < 0) throw new Error('找不到 post-hero');
out = out.slice(0, figStart) + `    <div class="wrap-text">
      <p class="pv-hero-slot">HERO 插畫的位置<br><small>文案定案之後才畫（圖是開場那一幕的畫面，兩件事是一組的）</small></p>
    </div>` + out.slice(figEnd);

/* ── ④ 內文（唯一出處：BODY.html） ────────────────────────── */
let body = readFileSync(resolve(here, 'BODY.html'), 'utf8');
// 同層連結改寫：../<slug>/ → ../../posts/<slug>/（見檔頭）
body = body.replace(/href="\.\.\/([a-z0-9-]+)\//g, 'href="../../posts/$1/');

const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + body + '\n' + out.slice(bodyEnd);

/* ── ⑤ 文末導覽：拿掉「上一篇」（同層連結會指到 preview/ 底下） ── */
swap('        <a class="btn btn-ghost" href="../gum-bleeding/">&larr; 上一篇：牙齦流血不是火氣大</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/kids-first-visit/">&larr; 孩子第一次看牙</a>\n',
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
.pv-hero-slot { display: grid; place-content: center; gap: .4rem; text-align: center;
                min-height: 34vw; padding: 2rem 1rem; border: 1px dashed var(--rule);
                border-radius: 12px; color: var(--ink-soft); font-size: .92rem; }
.pv-hero-slot small { font-size: .82rem; opacity: .85; }
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
  ['不鏽鋼牙套', '內文沒接上'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['孩子第一次看牙：時機、氟化物與窩溝封填 —', '舊標題殘留'],
  ['href="../gum-bleeding/', '同層連結殘留，會指到 preview/ 底下'],
  ['健保', '⚠ 給付與費用還沒問到診所，這一篇不寫（CLAUDE.md 第九節紅線 11）'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/kids-crown/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/kids-crown/index.html　' + out.length + ' 字元');
