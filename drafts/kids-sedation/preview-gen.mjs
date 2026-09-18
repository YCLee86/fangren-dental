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
const HERO = "hero-kids-sedation-photo";
const HERO_ALT = "四格插畫，由左上、右上、左下到右下說一個故事。左上：明亮的兒童牙科診間，戴著印花手術帽、白袍敞開的兒牙醫師坐在小圓椅上伸手說明；右邊是一家三口，媽媽蹲著摟住男孩，男孩雙手抓著媽媽的衣服、一邊的下顎有點鼓、臉色泛紅，爸爸站在後面一手搭著媽媽的肩。右上：家裡的餐桌，媽媽拿著手機講電話、另一手拿筆，爸爸在旁邊探頭看桌上的紙，男孩在地上玩積木；右上角一個圓形對話框，裡面是穿松樹印花刷手服、戴同布手術帽的麻醉科醫師拿著話筒看著一張空白的紙。左下：治療進行中，男孩蓋著薄毯睡在治療椅上，兒牙醫師在他頭側工作，麻醉科醫師站在後方一手放在生理監視器上、眼睛看著孩子，麻醉護理師在右邊拿著板夾記錄，三位都戴口罩與手套，旁邊有點滴架與只顯示三條波形的螢幕。右下：治療結束，兒牙醫師與麻醉科醫師並肩向家長說明，麻醉科醫師空手拿著一張空白的紙；右邊爸爸抱著趴在肩上半夢半醒的男孩，媽媽在旁邊笑著。四格之間有幾條極細的白線貫穿。";
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
  "hero": "${HERO}-1600.jpg",
  "heroAlt": "${HERO_ALT}",
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

/* ── ③ HERO ───────────────────────────────────────────────
 * 2026-09-18 定案（第七版）。原檔 drafts/kids-sedation/hero-final.jpg（2000×1493，4:3），
 * 三個尺寸由 `node tools/hero-resize.mjs drafts/kids-sedation/hero-final.jpg kids-sedation-photo` 產生。
 * ⚠ 這一頁刻意只用 JPEG，不包 <picture>：tools/webp.mjs 只掃 index.html、style.css 與各篇文章
 *   資料夾，掃不到 preview，所以現在還沒有對應的 .webp。搬進文章那天跑一次 webp.mjs 就會有。
 *   ⚠⚠ 上一行原本寫成「posts 斜線星號斜線」，那個記號會把這段註解提早關掉，整支語法錯誤
 *   （DECISIONS.md 第九節那張坑表第 1 條，2026-09-18 又踩了一次）。
 * 逐版的提示詞與每一輪改了什麼，寫在 drafts/kids-sedation/HERO-PROMPTS.md。 */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
if (figStart < 0) throw new Error('找不到 post-hero');
out = out.slice(0, figStart) + `    <figure class="post-hero">
      <img src="../../assets/${HERO}-1600.jpg"
           srcset="../../assets/${HERO}-800.jpg 800w,
                   ../../assets/${HERO}-1600.jpg 1600w,
                   ../../assets/${HERO}-2000.jpg 2000w"
           sizes="(min-width: 1041px) 656px, (min-width: 721px) 660px, calc(100vw - 28px)"
           alt="${HERO_ALT}" width="2000" height="1493">
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
  [`${HERO}-1600.jpg`, 'HERO 沒接上'],
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
  ['pv-hero-slot', '⚠ HERO 佔位框又跑回來了 —— 圖已經定案（drafts/kids-sedation/hero-final.jpg）'],
  ['本院', '⚠ 診所實際做到哪一格還沒問到，不可用第一人稱（FACTCHECK 第二節）'],
  ['我們診所', '同上'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/kids-sedation/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/kids-sedation/index.html　' + out.length + ' 字元');
