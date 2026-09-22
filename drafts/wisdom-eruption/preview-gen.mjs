// 產生 preview/wisdom-eruption/index.html —— 〈智齒要不要拔〉的文章草稿預覽
//
// 用法：node drafts/wisdom-eruption/preview-gen.mjs
//
// 骨架抓 posts/wisdom-tooth/index.html（同一科 surg、同一個 tag「口腔外科」），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 pulp-calcification／ortho-article 那幾次）。
//
// 這一種要處理的六件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og:url／JSON-LD 全部指向一個**還沒上線的網址**。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//    ⚠ 夜間模式那顆開關就接在 .views 後面，切的時候不要連它一起切掉。
//  ③ 同層連結：preview/<name>/ 和 posts/<slug>/ 深度相同，所以 ../../assets/… 照樣對；
//    但 ../wisdom-tooth/ 這種同層連結會指到 preview/ 底下去 —— 一律寫成 ../../posts/<slug>/。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。
//  ⑤ HERO 還沒畫，放一塊佔位說明（不要放破圖）；「最後更新」那一行也一起拿掉，
//    草稿還沒有上線日期，印出來是假話。
//  ⑥ theme-color 跟著科別走（surg 是 #12656a），骨架本來就是同一科，不必換。
//
// ⚠ 提案頁自己的 class 一律 pv- 前綴（2026-08-16 踩過：短名字會和站上的撞）。
// ⚠ 這一支是模板字串：CSS 註解裡不可以出現反引號，也不可以出現註解的結束記號。
//
// 文中每一個數字的出處逐條列在同一個資料夾的 SOURCES.md，改內文的數字前先看那一份。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(resolve(root, 'posts/wisdom-tooth/index.html'), 'utf8');

const TITLE = '智齒要不要拔：該拔的，要趁早';

/* HERO 的 alt。⚠ 這一頁刻意只用 JPEG、不做 <picture> ＋ <source type="image/webp">：
   tools/webp.mjs 只掃 index.html／assets/style.css／posts/ 底下，掃不到 preview/，
   所以現在還沒有對應的 .webp，寫了 <source> 會 404。
   定案搬進 posts/ 那天再跑一次 node tools/webp.mjs。 */
const ALT = "插畫：一間明亮的牙科諮詢室。左邊一位穿紫色刷手服、外罩白色醫師袍的鮑伯頭女醫師站著，一手微微抬起、掌心朝上，正在聽。她右邊一位二十歲上下、穿鏽紅色外套與深色牛仔褲的男生坐在諮詢椅上，一手按著自己下顎靠近耳下的位置，那一處畫著幾道磚紅色的短折線與淡淡的排線表示痠痛。他頭頂上方一個大對話框，框裡畫著他從鏡子會看到的下顎後段：三顆後牙，最後那一顆只露出一半，牙齦瓣蓋住後半、鼓起來、比旁邊的淡粉紅一階。後方牆上是一台發光的看片燈箱，上緣夾著一張全景 X 光片，電源線沿著牆垂下；旁邊是洗手台與鏡子、芥末黃門的矮櫃、杯子、紙盤、面紙盒、盆栽、乾洗手與手套盒、一排資料夾與瓶子、沒有數字的圓鐘、掛著帆布袋的掛鉤。畫面右側有一支粗寬的紫色 S 形箭頭，從右緣的淡灰紫漸漸轉深、到左端箭頭尖變成深紫，指向坐著的男生；箭頭上站著同一個人的五個年紀，由右往左愈來愈高：最右邊的地上是一個在爬的嬰兒，接著是背著圓背包、手上拿著蠟筆的幼兒園男孩、背方書包掛水壺的小學男孩、斜背側背包的國中男生，最靠近箭頭尖的是抱著書、背著書包的高中男生。最右邊的門口露出一張診療椅的扶手與無影燈的一角。";
const DESC  = '「你的智齒是阻生齒，建議拔掉。」智齒什麼時候長、東亞人為什麼比較容易阻生、為什麼「長得正」不等於「刷得到」，以及為什麼確定要拔的那幾顆，愈早處理對你愈省事。';
const OGDESC = '什麼時候長、為什麼「長得正」不等於「刷得到」，以及確定要拔的那幾顆為什麼愈早處理愈省事。';

let out = src;
const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap('<title>拔智齒之後：傷口填補、術後照顧與保險怎麼問 — 芳仁牙醫診所</title>',
     `<title>${TITLE} — 芳仁牙醫診所（草稿預覽）</title>\n<meta name="robots" content="noindex, nofollow, noarchive">`,
     'title');

out = out.replace(/<meta name="description"[^>]*>\n/, `<meta name="description" content="${DESC}">\n`);
out = out.replace(/<meta property="og:title"[^>]*>\n/, `<meta property="og:title" content="${TITLE}">\n`);
out = out.replace(/<meta property="og:description"[^>]*>\n/, `<meta property="og:description" content="${OGDESC}">\n`);
out = out.replace(/<link rel="canonical"[^>]*>\n/, '');

const seoStart = out.indexOf('<!-- SEO:START');
const seoEnd = out.indexOf('<!-- SEO:END -->');
if (seoStart < 0 || seoEnd < 0) throw new Error('找不到 SEO 區塊');
out = out.slice(0, seoStart) +
  '<!-- 這一頁是還沒上線的草稿預覽：原本 build 產的 SEO 區塊（canonical／og:url／JSON-LD）\n' +
  '     整段拿掉了 —— 那些欄位會指向一個還不存在的網址。noindex 寫在 <title> 底下。 -->\n' +
  out.slice(seoEnd + '<!-- SEO:END -->'.length + 1);

/* post-meta：換成這一篇的（給人看的規格，build 掃不到 preview/）
   ⚠ 智齒拔除 Q849893 與阻生智齒 Q1968827 沿用 posts/wisdom-tooth 已經查證過的兩筆。
   ⚠ 「第三大臼齒萌發」查不到對應項目，留白 —— 容器連不到 wikidata.org，不要猜 Q 編號
     （CLAUDE.md 第十節第 3 項）。 */
const metaStart = out.indexOf('<script type="application/json" id="post-meta">');
const metaEnd = out.indexOf('</script>', metaStart) + '</script>'.length;
out = out.slice(0, metaStart) + `<script type="application/json" id="post-meta">
{
  "slug": "wisdom-eruption",
  "title": "${TITLE}",
  "excerpt": "被告知「你有阻生智齒」的那張片子，多半拍在大學時期。有些智齒後來確實會自己長出來——但真正要緊的是早一點把「留還是拔」判斷清楚：年輕時骨頭還軟、牙根還沒長完，該拔的那幾顆會好拔很多，腫痛與請假的天數也少。",
  "tag": "口腔外科",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "hero-wisdom-eruption-photo-1600.jpg",
  "heroAlt": ${JSON.stringify(ALT)},
  "about": [
    { "type": "MedicalCondition", "name": "阻生智齒", "sameAs": "https://www.wikidata.org/wiki/Q1968827" },
    { "type": "MedicalProcedure", "name": "智齒拔除", "sameAs": "https://www.wikidata.org/wiki/Q849893" },
    { "type": "MedicalCondition", "name": "智齒冠周炎" },
    { "type": "MedicalCondition", "name": "牙周病", "sameAs": "https://www.wikidata.org/wiki/Q520127" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── ② 標題列：拿掉計數器、換日期與標題 ───────────────────── */
/* ⚠ 夜間模式的開關就接在 .views 後面，所以終點抓 .theme-toggle 那一行的開頭，
   不要抓「</span> 之後的 </p>」——那會把開關一起切掉。 */
const viewsStart = out.indexOf('        <span class="views"');
const toggleStart = out.indexOf('        <button class="theme-toggle"', viewsStart);
if (viewsStart < 0 || toggleStart < 0) throw new Error('找不到 .views 那一塊');
out = out.slice(0, viewsStart) + out.slice(toggleStart);

swap('<time datetime="2026-08-19">2026/08/19</time>',
     '<time datetime="2026-09-21">草稿・尚未上線</time>', 'date');
swap('<h1>拔智齒之後：傷口填補、術後照顧與保險怎麼問</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒畫，放一塊佔位說明；「最後更新」那一行一起拿掉 ── */
const figStart = out.indexOf('    <figure class="post-hero">');
const updEnd = out.indexOf('</p>', out.indexOf('<p class="post-updated-line">')) + '</p>'.length;
if (figStart < 0 || updEnd < 3) throw new Error('找不到 HERO 那一塊');
out = out.slice(0, figStart) + `    <figure class="post-hero">
      <img src="../../assets/hero-wisdom-eruption-photo-1600.jpg"
           srcset="../../assets/hero-wisdom-eruption-photo-800.jpg 800w,
                   ../../assets/hero-wisdom-eruption-photo-1600.jpg 1600w,
                   ../../assets/hero-wisdom-eruption-photo-2000.jpg 2000w"
           sizes="(min-width: 1041px) 656px, (min-width: 721px) 660px, calc(100vw - 28px)"
           fetchpriority="high" alt="${ALT}" width="2000" height="1116">
    </figure>` + out.slice(updEnd);

/* ── ④ 內文 ───────────────────────────────────────────────── */
const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + BODY() + out.slice(bodyEnd);

function BODY() { return `    <p class="lede">「這顆智齒建議要拔掉喔！」很多人第一次聽到這句話，是在大學時牙齒檢查的時候。也有人剛好相反——二十幾歲了還沒看到智齒冒出來，以為自己天生就沒有。智齒是全口最後報到的牙齒，也是變異最大的一顆；但<strong>真正要緊的不是它什麼時候長出來，是你什麼時候把「留還是拔」判斷清楚。時間抓對，拔智齒的後續影響會減少很多。</strong></p>

    <h2>智齒什麼時候長出來</h2>
    <p>大多數人的智齒在十七到二十六歲之間開始動作，順序是固定的：先埋在齒槽骨裡，接著從骨頭表面露出、穿過牙齦，最後才可能抵達咬合平面——也就是上下真的咬得到的高度。</p>
    <p><a href="https://link.springer.com/article/10.1186/s13005-024-00431-3" target="_blank" rel="noopener">德國一份以 605 張全景 X 光片建立的參考資料</a>量過這幾個階段：穿過牙齦、但還沒到咬合平面，中位數落在 <strong>19.8 到 20.8 歲</strong>；完全長到咬合平面，中位數 <strong>20.8 到 21.8 歲</strong>（男女略有差別）。</p>
    <p>但那份資料真正的結論不是這兩個數字，而是<strong>各階段之間的年齡重疊非常大</strong>。同一個階段裡的人，年紀可以差上好幾歲：最早完全長好的，女性 16.1 歲、男性 17.1 歲；也有人到了二十五、六歲才長出來。</p>
    <p>所以比較準確的講法是：<strong>「口內看得到智齒」多半發生在十八到二十一歲之間，「完全長到定位」平均要到二十一歲上下，而二十五歲以後才長好也還在正常範圍內。</strong>這也是為什麼有些人二十出頭覺得自己沒有智齒，過幾年卻突然冒出來。</p>

    <h2>十八歲的「阻生」，不一定是最後的樣子</h2>
    <p>「阻生」這兩個字聽起來像是一個已經確定的結論。但長期追蹤的研究說，這個判斷在二十幾歲這幾年還會改變。</p>

    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>追蹤了誰</th><th>後來發生什麼</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/1923392/" target="_blank" rel="noopener">芬蘭，20 → 26 歲</a><br><small>120 人、412 顆智齒</small></td>
            <td>原本只長出一半的，將近一半在這六年內長了出來。但下顎原本完全看不到的，只有 <strong>9%</strong> 後來長出來。</td>
          </tr>
          <tr>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/11505260/" target="_blank" rel="noopener">紐西蘭出生世代，18 → 26 歲</a><br><small>821 人</small></td>
            <td>十八歲時被判定為阻生的智齒，到二十六歲有 <strong>33.7% 已經完全萌發</strong>、31.4% 已經被拔掉。上顎（36.2%）比下顎（25.6%）更容易翻案。</td>
          </tr>
          <tr>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/11289622/" target="_blank" rel="noopener">芬蘭，20 → 32 歲</a></td>
            <td>十二年間仍有 <strong>22%</strong> 陸續萌發，有些是在二十六歲之後才長出來的；同一段時間有 42% 被拔除。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>所以「十八歲被判定為阻生」不等於「這顆一定留不住」。<strong>但這句話只對一種人成立</strong>：沒有症狀、刷得到、前面那顆牙也沒被影響的人——他要做的是定期追蹤，看著它往哪裡長，不必為了「反正遲早要拔」而把四顆都當成一樣的東西處理掉。</p>
    <p>有一項不成立就完全不同了。已經反覆冠周炎（牙齦蓋著牙冠的一角，疲勞或睡眠不足時就腫痛一次）、前面那顆第二大臼齒已經被蛀掉、或者那個位置根本清不到——<strong>那不是「再等等看」，是該安排處理了</strong>。而且愈早處理，你要付出的代價愈小，理由寫在後面那一節。</p>

    <h2>東亞人的智齒，比較容易卡住</h2>
    <p>智齒阻生的比例，族群之間差得非常明顯。<a href="https://pubmed.ncbi.nlm.nih.gov/39768456/" target="_blank" rel="noopener">一份涵蓋 98 篇研究、183,828 人的統合分析</a>算出來的全球平均是 36.9%，其中<strong>亞洲 43.1%，明顯高於歐洲的 24.5%</strong>。</p>
    <p>華人族群另外有兩份數字更具體的研究：</p>

    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>看的是誰</th><th>量到什麼</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/14759117/" target="_blank" rel="noopener">新加坡華人</a><br><small>1,000 張全景片，20–40 歲</small></td>
            <td><strong>68.6%</strong> 至少有一顆阻生智齒。下顎的機率（90%）是上顎（28%）的三倍，而且八成的阻生智齒只是<strong>部分埋在骨頭裡</strong>，不是整顆埋著。</td>
          </tr>
          <tr>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/12777649/" target="_blank" rel="noopener">香港華人</a><br><small>7,486 位就診者</small></td>
            <td>28.3% 至少有一顆阻生牙。在所有阻生牙裡，<strong>下顎智齒就佔了 82.5%</strong>，上顎智齒 15.6%。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>兩份指向同一件事：<strong>下顎比上顎容易卡住，而且差距是好幾倍。</strong></p>
    <p><a href="https://journals.sagepub.com/doi/abs/10.1177/1010539512448814" target="_blank" rel="noopener">台灣的健保資料顯示</a>：<strong>上顎與下顎智齒是國人最常被拔掉的兩個牙位</strong>，其中下顎智齒多半因為阻生，上顎智齒則多半因為蛀牙。</p>

    <h2>一顆智齒的四種狀態</h2>
    <p>以「一顆」來看，智齒大致有四種狀態。分清楚自己是哪一種，比記住任何一個比例都有用：</p>

    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>哪一種</th><th>大致情形</th><th>臨床上的意義</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>先天就沒有</strong></td>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/25883107/" target="_blank" rel="noopener">全球約 22.6% 的人至少少一顆</a>智齒，東亞的比例偏高。</td>
            <td>最省事的一種。</td>
          </tr>
          <tr>
            <td><strong>完全萌發</strong><br><small>長到咬合平面</small></td>
            <td>上顎比較常見，下顎比較少。</td>
            <td><strong>不等於沒問題</strong>——理由在下一節。</td>
          </tr>
          <tr>
            <td><strong>只露出一部分</strong></td>
            <td>風險最高的一種。<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3873309/" target="_blank" rel="noopener">韓國 3,799 人的資料</a>裡，下顎部分阻生在 25–29 歲是 35.1%，到 30–39 歲降到 19.2%。</td>
            <td>比例下降<strong>多半不是因為後來長好了，是因為出問題被拔掉了</strong>。</td>
          </tr>
          <tr>
            <td><strong>完全埋在骨頭裡</strong></td>
            <td>比例低，而且終生變化不大——同一份資料裡，60–69 歲 1.0%、70 歲以上 1.7%。</td>
            <td>沒有和口腔相通，所以不會蛀、不會冠周炎；但<strong>不等於一輩子沒事</strong>——見下一段。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>這張表最值得看的是「<strong>只露出一部分</strong>」那一列：它是一個<strong>待不久的狀態</strong>。牙冠露出一角，牙刷卻刷不進那個角落——細菌住得下、刷毛進不去，於是冠周炎與蛀牙接連出現，然後被拔除。</p>
    <p>另一件常被忽略的是<strong>完全埋著的那些</strong>。它們確實多半安靜，但不是完全沒事：牙冠外面那層牙囊有機會變成<strong>含齒囊腫</strong>，慢慢把周圍的骨頭撐開、推擠旁邊的牙齒，而且在長大之前通常不痛也不腫，<strong>只有 X 光看得到</strong>。</p>
    <p>比例不高。<a href="https://pubmed.ncbi.nlm.nih.gov/40756917/" target="_blank" rel="noopener">一份兩萬多顆下顎阻生智齒的統計</a>裡，影像上看得到囊腫或腫瘤的是 0.8%（其他研究多落在 2% 到 6%），其中四分之三是含齒囊腫。真正要注意的是<strong>它隨年齡上升</strong>：同一份資料裡六十幾歲 7.3%、七十幾歲 18.6%。所以「埋著就不用管」比較準確的說法是——<strong>埋著的那一顆，要有人固定用 X 光看著它。</strong></p>

    <h2>「長出來了」不代表「刷得到」</h2>
    <p>這是最容易被誤會的一點。聽到「你的智齒長得很正」就放心了，但<strong>正位萌發只代表位置正常，不代表清潔得到。</strong></p>
    <p><a href="https://pubmed.ncbi.nlm.nih.gov/21958663/" target="_blank" rel="noopener">美國一項針對「四顆智齒都沒有症狀」的年輕成人所做的研究</a>（409 人，平均 25 歲）量到的結果相當有參考價值：</p>
    <ul>
      <li><strong>55%</strong> 的人，至少一顆智齒周圍測得 4 毫米以上的牙周囊袋；</li>
      <li>在<strong>四顆智齒都已經長到咬合平面</strong>的人身上，這個比例升高到 <strong>72%</strong>；至少有一顆還沒長全的人反而只有 33%。</li>
    </ul>
    <p><a href="https://pubmed.ncbi.nlm.nih.gov/12420253/" target="_blank" rel="noopener">另一項同類研究</a>（329 位無症狀者）則發現，其中 25% 至少有一處量到 5 毫米以上。</p>
    <p>4 毫米是一條界線：那是牙刷與牙線清不到底的深度（同一個數字在<a href="../../posts/perio-prevalence/">〈八成人有牙周病〉</a>那一篇也出現過）。換成白話：</p>
    <p><strong>智齒長得直、長得滿，不保證好照顧。</strong>位置太後面、牙刷的角度進不去、食物常常塞在它和前一顆牙之間——這些才是真正決定它能不能留下來的條件。</p>
    <p>而且智齒帶來的麻煩往往不只是它自己。香港那份資料裡，與阻生智齒相鄰的第二大臼齒，<strong>約 8% 在靠近智齒的那一面骨頭喪失超過 5 毫米、約 7% 在同一面蛀蝕</strong>。用一顆第二大臼齒去換一顆智齒，不是划算的交換。</p>

    <h2>該留還是該拔：三個問題</h2>
    <p>判斷的依據不是年齡，是這顆牙現在的條件。<strong>三個問題</strong>：</p>
    <ol>
      <li><strong>刷得到嗎？</strong></li>
      <li><strong>有對咬的牙、真的在咀嚼嗎？</strong></li>
      <li><strong>有沒有影響到前面那一顆牙？</strong></li>
    </ol>
    <p>三題都是肯定的，這顆智齒就值得留下來、定期看著它；有一題長期是否定的，就該和醫師討論拔除——<strong>而且討論完就不要再拖，理由是下一節。</strong></p>
    <p>⚠ 這三題問的是<strong>看得到的那幾顆</strong>。完全埋在骨頭裡的那一種不適用——它的問題不在清潔，在於要定期拍片看那層牙囊有沒有變化。</p>
    <p>另外兩件可以自己安排：</p>
    <ul>
      <li><strong>十八到二十二歲之間拍一張全景 X 光。</strong>確認智齒的數量、角度與深度——後面每一次判斷，都是拿這張片子當基準，而這個年紀正好也是最好處理的時候。</li>
      <li><strong>沒有症狀不等於不用追蹤。</strong><a href="../../posts/regular-checkup/">半年一次的例行檢查</a>時，可以請醫師順便探一下智齒周圍的牙周囊袋深度。那一區在嘴巴最深處，自己在家看不到也量不到。</li>
    </ul>
    <h2>確定要拔的話，愈早愈省事</h2>
    <p>這是這一篇最想講清楚的一件事：<strong>「要不要拔」需要判斷，但判斷出來要拔，就不要拖。</strong>年輕和年長的差別不在忍不忍得住，在骨頭。</p>
    <ul>
      <li><strong>年輕人的齒槽骨比較軟、比較有彈性</strong>，牙根也常常還沒完全形成。同一顆牙要取出來，需要動到的骨頭比較少。</li>
      <li><strong>年紀愈大，骨頭愈緻密</strong>，牙齒和骨頭愈不容易分開，同一顆牙就得磨掉更多骨頭、手術時間拉長。<a href="https://pubmed.ncbi.nlm.nih.gov/41556399/" target="_blank" rel="noopener">一份分析 12,649 顆智齒拔除的研究</a>裡，需要翻瓣、分牙的那一種（手術性拔除）確實是年紀愈大愈吃力。</li>
      <li><strong>手術時間拉長、年紀增加，術後的腫脹、疼痛與開口受限也跟著明顯。</strong><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3114767/" target="_blank" rel="noopener">一份研究</a>把這兩件事同時列為術後不適的預測因子；<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8749374/" target="_blank" rel="noopener">另一份</a>則發現年紀較長、手術難度較高的人，術後第一週的疼痛、腫脹與開口受限都比較嚴重。</li>
    </ul>
    <p>這些對你來說不是抽象的風險，是<strong>要請幾天假、幾天不能好好吃飯、幾天講話會不順</strong>。三十幾、四十幾歲要挪出這幾天，通常比二十出頭難得多——那個年紀多半已經有工作、有小孩要顧。</p>
    <p>至於手術本身安不安全：<a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0246625" target="_blank" rel="noopener">台灣一份 16,609 人的全國資料</a>裡，下顎阻生智齒拔除後的乾性齒槽炎是 3.6%、術後感染 0.17%，<strong>整體是相當可預期的手術</strong>。那份資料統計的是併發症的發生率；年紀真正會改變的，是上面那三件——難度、時間，以及你要花幾天才回得去正常生活。</p>
    <p>真的要拔的時候會怎麼進行、拔完那幾天怎麼過，寫在<a href="../../posts/wisdom-tooth/">〈拔智齒之後〉</a>那一篇。</p>

    <h2>最後</h2>
    <p>智齒的問題，常被解釋成演化跟不上飲食的變化：顎骨變小了，牙齒的數量卻沒有跟著減少。不論成因怎麼說，它<strong>不是一顆壞掉的牙齒，而是一顆位置不一定好、報到時間又特別晚的正常牙齒。</strong></p>
    <p>所以答案從來不是「所有智齒都該拔」，也不是「不痛就別管」。而是——<strong>早一點看清楚它在哪個位置：該留的看著它，該拔的趁骨頭還軟的時候處理掉。</strong></p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>智齒大概幾歲會長出來？</dt>
      <dd>口內看得到，多半在十八到二十一歲之間；完全長到咬合平面，平均要到二十一歲上下。但各階段的年齡重疊很大，二十五歲以後才長好也在正常範圍內——所以二十出頭覺得自己沒有智齒，幾年後又冒出來，並不奇怪。</dd>

      <dt>二十歲被說是阻生齒，可以先觀察嗎？</dt>
      <dd>要看是哪一種。長期追蹤的資料顯示，十八歲時被判定為阻生的智齒，到二十六歲有三分之一已經完全萌發，所以「阻生」不等於「一定留不住」——沒有症狀、刷得到、也沒有影響前一顆牙的話，定期追蹤是合理的。但已經反覆冠周炎、或已經讓第二大臼齒蛀掉的，就不是觀察的問題了，而且<strong>愈早處理愈省事</strong>：年輕時骨頭還軟、牙根常常還沒長完，手術與恢復都比較單純。</dd>

      <dt>台灣人的智齒是不是比較容易卡住？</dt>
      <dd>台灣沒有自己的全國調查，但亞洲的阻生率（43.1%）明顯高於歐洲（24.5%），新加坡華人是 68.6%、香港華人的阻生牙有 82.5% 是下顎智齒。健保資料則顯示，上下顎智齒是國人最常被拔掉的兩個牙位。</dd>

      <dt>智齒長得很正，是不是就不用管了？</dt>
      <dd>不是。位置正常不等於清潔得到。在四顆智齒都沒有症狀的年輕成人裡，有 55% 至少一顆智齒周圍量得到 4 毫米以上的牙周囊袋；而且四顆都長到咬合平面的人，這個比例反而更高（72%）。真正決定它能不能留的是刷不刷得到，不是長得正不正。</dd>

      <dt>如果決定要拔，什麼時候比較好？</dt>
      <dd>愈早愈好。年輕人的齒槽骨比較軟、牙根常常還沒完全形成，取出同一顆牙需要動到的骨頭比較少；年紀愈大骨頭愈緻密，手術時間拉長，術後的腫脹、疼痛與開口受限也跟著明顯，要請的假、不能好好吃飯的天數都跟著變多。台灣一份 16,609 人的資料顯示，拔除後乾性齒槽炎 3.6%、術後感染 0.17%，整體相當可預期——年紀改變的不是這些併發症的機率，是手術的難度與恢復期。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，不能取代臨床診斷。文中的萌發年齡、阻生比例與追蹤數字來自國內外的研究，族群與取樣方式各不相同，結果因人而異。你的智齒該留該拔、要不要追蹤、什麼時候處理，都要經醫師檢查並搭配 X 光等影像評估後判斷。</p>

`; }

/* ── ⑤ 文末導覽：同層連結會指到 preview/ 底下，一律改成絕對深度 ── */
swap('        <a class="btn btn-ghost" href="../perio-laser/">&larr; 上一篇：牙周病治療</a>\n' +
     '        <a class="btn" href="../../#articles">回文章列表 &rarr;</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/wisdom-tooth/">&larr; 拔智齒之後</a>\n' +
     '        <a class="btn" href="../../#articles">回文章列表 &rarr;</a>\n', 'post-nav');

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
/* ⚠⚠ 守門一：比喻不可以撐起整篇（COPY.md 第十之四節，2026-09-21 使用者當面指出）。
   這一篇的骨架刻意用**這件事本身的名詞**（時間、狀態、比例、清潔、決定），
   不是空間比喻 —— 所以「路／走／方向」應該接近零。
   ⚠ 只掃內文（lede 到 post-foot 之間）—— 掃整頁會撞到這段說明自己
     （CLAUDE.md 第九節第 4 條「掃整頁等於沒掃」）。 */
{
  const b0 = out.indexOf('    <p class="lede">');
  const b1 = out.indexOf('    <div class="post-foot">');
  const body = out.slice(b0, b1).replace(/<[^>]*>/g, '');
  const n = (p) => (body.match(new RegExp(p, 'g')) || []).length;
  const road = n('路'), walk = n('走'), dir = n('方向');
  if (road + walk + dir > 3) {
    throw new Error('比喻的「路／走／方向」長出來了：路 ' + road + '、走 ' + walk +
      '、方向 ' + dir + '（上限 3）—— 換成具體的名詞（時間／狀態／條件／做法）');
  }
  /* ⚠ 守門二：這一篇整篇在講「卡住／長不出來」，很容易讓同一個字變口頭禪。
     「阻生」是臨床的正式名詞（留著），「卡住」是白話的轉述 —— 限三次。 */
  const stuck = n('卡住');
  if (stuck > 3) throw new Error('「卡住」用了 ' + stuck + ' 次（上限 3）');
  console.log('　守門：內文 ' + body.replace(/\s/g, '').length +
    ' 字，路 ' + road + '、走 ' + walk + '、方向 ' + dir + '、卡住 ' + stuck);
}

const must = [
  ['noindex', 'noindex 不見了'],
  ['智齒要不要拔：該拔的，要趁早', '標題沒換到'],
  ['theme-toggle', '夜間模式的開關被切掉了'],
  ['重點整理', '重點整理不見了'],
  ['class="note"', '免責段落不見了'],
  ['posts/wisdom-tooth/', '沒有連回〈拔智齒之後〉'],
  ['hero-wisdom-eruption-photo-1600.jpg', 'HERO 沒接上'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['post-updated-line', '「最後更新」那一行沒拿掉：草稿沒有上線日期'],
  ['pv-hero-slot', 'HERO 的佔位還在'],
  ['拔智齒之後：傷口填補', '舊標題殘留'],
  ['還不是定局', '第一版的標題方向殘留（2026-09-21 使用者退回）'],
  ['hero-wisdom-photo', '舊的 HERO 圖殘留'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/wisdom-eruption/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/wisdom-eruption/index.html　' + out.length + ' 字元');
