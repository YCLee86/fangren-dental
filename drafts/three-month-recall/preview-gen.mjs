// 產生 preview/three-month-recall/index.html —— 〈三個月一次的洗牙與塗氟〉的文章草稿預覽
//
// 用法：node drafts/three-month-recall/preview-gen.mjs
//
// 骨架抓 posts/regular-checkup/index.html（同一科 general、同一個 tag），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 ortho-article／bioceramic-article 那兩次）。
//
// 這一種要處理的四件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og／JSON-LD 全部指向一個**還沒上線的網址**，等於對外宣告一個
//    不存在的頁面。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//  ③ 同層連結：preview/<name>/ 和 posts/<slug>/ 深度相同，所以 ../../assets/… 照樣對；
//    但 ../missing-tooth/ 這種同層連結會指到 preview/ 底下去 —— 上一篇那顆直接拿掉，
//    文中要連舊那篇就寫 ../../posts/regular-checkup/。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。
//
// ⚠ 提案頁自己的 class 一律 pv- 前綴（2026-08-16 踩過：短名字會和站上的撞）。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(resolve(root, 'posts/regular-checkup/index.html'), 'utf8');

const TITLE = '三個月一次的洗牙與塗氟：哪些人適用，為什麼是三個月';
const DESC  = '半年一次是給大多數人的間隔。六十五歲以上、洗腎、吃骨鬆藥、癌症治療中的人，健保另外開了一條路：洗牙與塗氟縮短到三個月，而且塗氟不再只是小孩才做的事。';

let out = src;
const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap(
  '<title>半年一次的洗牙：健保給付的那一次，到底在做什麼 — 芳仁牙醫診所</title>',
  `<title>${TITLE} — 芳仁牙醫診所（草稿預覽）</title>\n<meta name="robots" content="noindex, nofollow, noarchive">`,
  'title');

swap(
  '<meta name="description" content="洗牙不是美白，是清除牙結石。洗牙會不會把牙齒洗壞、為什麼洗完會酸、以及定期檢查真正的價值在哪裡。">',
  `<meta name="description" content="${DESC}">`, 'description');

// og:* 與 canonical：這一頁還沒上線，不要對外宣告任何網址
out = out.replace(/<meta property="og:title"[^>]*>\n/, `<meta property="og:title" content="${TITLE}">\n`);
out = out.replace(/<meta property="og:description"[^>]*>\n/, `<meta property="og:description" content="${DESC}">\n`);
out = out.replace(/<link rel="canonical"[^>]*>\n/, '');

// SEO 區塊整段換掉
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
  "slug": "three-month-recall",
  "title": "${TITLE}",
  "excerpt": "半年一次，是給大多數人的間隔。正在洗腎、在吃骨鬆藥、癌症治療中，或是年紀到了牙根露出來——這幾種嘴，和半年這個數字對不上。健保為他們把洗牙與塗氟的間隔都縮短到三個月，而且塗氟不再只是小孩的事。",
  "tag": "定期檢查",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "【還沒畫】",
  "about": [
    { "type": "MedicalProcedure", "name": "牙結石清除" },
    { "type": "MedicalProcedure", "name": "氟化物治療" },
    { "type": "MedicalCondition", "name": "根面齲齒" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── ② 標題列：拿掉計數器、換日期與標題 ───────────────────── */
const viewsStart = out.indexOf('        <span class="views"');
const viewsEnd = out.indexOf('</span>\n      </p>', viewsStart);
if (viewsStart < 0 || viewsEnd < 0) throw new Error('找不到 .views 那一塊');
out = out.slice(0, viewsStart) + out.slice(viewsEnd + '</span>\n'.length);

swap('<time datetime="2026-07-08">2026 年 7 月 8 日</time>',
     '<time datetime="2026-09-04">草稿・尚未上線</time>', 'date');
swap('<h1>半年一次的洗牙：健保給付的那一次，到底在做什麼</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒畫，放一塊佔位說明（不要放破圖） ─────────── */
const figStart = out.indexOf('    <figure class="post-hero">');
const figEnd = out.indexOf('</figure>', figStart) + '</figure>'.length;
out = out.slice(0, figStart) + `    <div class="wrap-text">
      <p class="pv-hero-slot">HERO 插畫的位置<br><small>文案定案之後才畫（圖是開場那一幕的畫面，兩件事是一組的）</small></p>
    </div>` + out.slice(figEnd);

/* ── ④ 內文 ───────────────────────────────────────────────── */
const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + `    <p class="lede">一般人通常是半年洗一次牙。因為拿牙刷的手還穩、大部分人的唾液分泌正常、傷口癒合正常。</p>
    <p>這些條件少了一項，只過了三個月，口腔裡累積出來的東西很有可能就和一般人很不一樣。健保考慮到這類人的需求，加開密集照護專案、將洗牙的間隔縮短到三個月；塗氟也是，而且<strong>塗氟不再只是小孩才做的事</strong>。</p>

    <h2>為什麼是三個月</h2>
    <p>牙菌斑留在牙面上超過一兩天就開始鈣化成牙結石，一旦鈣化，牙刷與牙線就拿它沒辦法了（細節寫在<a href="../../posts/regular-checkup/">〈半年一次的洗牙〉</a>那一篇）。牙齦健康的人，半年一次還追得上這個速度。真正讓速度改變的是這幾件事：</p>
    <ul>
      <li><strong>嘴巴乾</strong>：唾液本來會沖走殘渣、中和酸；唾液少了，牙菌斑黏得更久，蛀牙也來得更快。</li>
      <li><strong>血糖不穩</strong>：牙齦的發炎比較不容易收，牙周破壞也走得比較快。</li>
      <li><strong>傷口不容易癒合</strong>：牙齦一旦發炎，恢復得比別人慢。</li>
    </ul>
    <p>同樣三個月，這幾種情況累積出來的傷害，和一般人不是同一個量級。</p>

    <h2>不只是把牙結石清掉</h2>
    <p>縮短間隔，另一半的價值是<strong>被看到得早</strong>。半年一次，中間那半年是沒有人看的，等到下一次坐上診療椅，蛀牙常常已經不是補一補就好的規模。</p>
    <p>三個月檢查一次，等於把那段空白切短。一顆剛開始的蛀牙，這一次就看得到、接著安排處理，不必等它自己長大。</p>

    <h2>哪些人適用</h2>
    <p><strong>洗牙</strong>（正式名稱是牙結石清除）：六十五歲以上、心血管疾病、洗腎（血液透析或腹膜透析）、正在使用骨質疏鬆藥物、惡性腫瘤治療中、口乾症、糖尿病、孕婦，以及部分身障人士。健保把這些人分在幾個名稱不一樣的專案裡，但對你來說是同一件事：間隔從半年縮短到三個月。</p>
    <p><strong>塗氟</strong>也有三個月一次，針對蛀牙傾向比較大的情形。</p>
    <p>簡單講：年紀到了、有慢性病在追蹤、正在吃骨鬆藥或做癌症治療、在洗腎，大概都在範圍內。類別與條件健保署會調整，實際以就診當時的公告為準；不確定自己算不算，掛號的時候可以先問。</p>
    <p>在芳仁牙醫，醫師會針對你的牙齦狀況與牙結石堆積的速度來判斷，<strong>最短的間隔是三個月回診照護一次</strong>。</p>

    <h2>年紀大了，氟的角色會變</h2>
    <p>氟的作用，是讓已經被酸侵蝕、還沒破洞的地方重新變硬。這件事和年紀無關，只是小孩做得多，久了就被當成兒童專屬的項目。</p>
    <p>年紀大了以後，牙齦退縮，牙根露出來。牙根表面沒有琺瑯質，比牙冠軟，蛀起來快，而且不一定會痛——等到自己發現，往往已經蛀得很深。這種蛀牙，正是塗氟最派得上用場的地方。</p>

    <h2>在吃骨鬆藥、或正在做癌症治療</h2>
    <p>這兩類藥會影響顎骨的修復能力，真的必須拔牙的時候，傷口的處理會比一般人複雜。所以順序很重要：趁狀況穩定先把牙結石清掉、小蛀牙補起來，盡量不要走到必須拔牙那一步。如果你快要開始這類治療，在開始之前先做一次口腔檢查會更好——這一步是為了讓你在療程進行中間，不必再臨時處理牙齒的問題。</p>

    <h2>來的時候</h2>
    <ul>
      <li>洗牙的同一次會檢查牙菌斑、做潔牙指導，把一直沒刷到的位置指出來。</li>
      <li>洗牙和塗氟同一次做完，不必為了塗氟另外跑一趟。</li>
      <li><strong>把藥帶著。</strong>這幾類病人的用藥常會影響牙科的處置方式，尤其骨質疏鬆藥物與抗凝血劑；開藥的醫師如果特別交代過看牙要注意什麼，也請一起告訴我們。如果記不清楚藥名，最好把藥袋或用藥紀錄帶來。<strong>特別是自費藥劑一定要讓我們知道</strong>，因為健保雲端上沒有紀錄。</li>
    </ul>
    <p>牙齒的問題幾乎都是慢慢累積的，中間有很長一段時間處理得掉。如果你落在前面那幾類裡，下次來的時候讓醫師看一次你的間隔該不該縮短。</p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>三個月洗一次牙，哪些人適用？</dt>
      <dd>六十五歲以上、心血管疾病、洗腎、使用骨質疏鬆藥物、惡性腫瘤治療中、口乾症、糖尿病、孕婦與部分身障人士。健保分在幾個名稱不同的專案裡，對民眾來說都是同一件事：間隔從半年縮短到三個月。實際條件依就診當時健保署公告為準。</dd>

      <dt>三個月的檢查，和半年那一次有什麼不一樣？</dt>
      <dd>半年一次，中間那半年沒有人看。間隔縮短之後，剛開始的蛀牙這一次就看得到、接著安排處理，不必等它變大。</dd>

      <dt>滿三個月一定要馬上來嗎？</dt>
      <dd>三個月是間隔，不是期限。實際多久檢查一次，由醫師依牙齦狀況與牙結石堆積的速度判斷。</dd>

      <dt>大人也可以塗氟嗎？</dt>
      <dd>可以。氟的作用是讓被酸侵蝕、還沒破洞的地方重新變硬；除了六十五歲以上，符合其他蛀牙高風險的情形也適用。</dd>

      <dt>在吃骨質疏鬆藥，看牙要注意什麼？</dt>
      <dd>這類藥會影響顎骨的修復能力，必須拔牙時傷口處理比較複雜。重點是趁狀況穩定先把牙結石清掉、小蛀牙補起來；看診時把藥袋或用藥紀錄帶著。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，健保給付規定可能調整，實際以就診當時公告為準。個別口腔狀況請由醫師評估。</p>

` + out.slice(bodyEnd);

/* ── ⑤ 文末導覽：拿掉「上一篇」（同層連結會指到 preview/ 底下） ── */
swap('        <a class="btn btn-ghost" href="../missing-tooth/">&larr; 上一篇：缺牙之後怎麼選</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/regular-checkup/">&larr; 半年一次的洗牙</a>\n', 'post-nav');

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
  ['三個月一次的洗牙與塗氟', '標題沒換到'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['半年一次的洗牙：健保給付的那一次', '舊標題殘留'],
  ['href="../missing-tooth/', '同層連結殘留，會指到 preview/ 底下'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/three-month-recall/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/three-month-recall/index.html　' + out.length + ' 字元');
