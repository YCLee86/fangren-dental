// 產生 preview/implant-lifespan/index.html —— 〈植牙能用多久〉的文章草稿預覽
//
// 用法：node drafts/implant-lifespan/preview-gen.mjs
//
// 骨架抓 posts/missing-tooth/index.html（同一科 prosth、同一個 tag「缺牙重建」），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 three-month-recall／ortho-article 那幾次）。
//
// 這一種要處理的五件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og:url／JSON-LD 全部指向一個**還沒上線的網址**。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//    ⚠ 夜間模式那顆開關就接在 .views 後面，切的時候不要連它一起切掉。
//  ③ 同層連結：preview/<name>/ 和 posts/<slug>/ 深度相同，所以 ../../assets/… 照樣對；
//    但 ../missing-tooth/ 這種同層連結會指到 preview/ 底下去 —— 一律寫成 ../../posts/<slug>/。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。
//  ⑤ HERO 還沒畫，放一塊佔位說明（不要放破圖）；「最後更新」那一行也一起拿掉，
//    草稿還沒有上線日期，印出來是假話。
//
// ⚠ 提案頁自己的 class 一律 pv- 前綴（2026-08-16 踩過：短名字會和站上的撞）。
//
// 文獻與數字的出處逐條列在同一個資料夾的 SOURCES.md，改內文的數字前先看那一份。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(resolve(root, 'posts/missing-tooth/index.html'), 'utf8');

const TITLE = '植牙能用多久：世界第一顆植牙用了四十年';
const DESC  = '1965 年植入的那四顆，陪了患者四十年直到他過世。但十年、二十年的群體數字說的是另一件事：植牙能用多久，一半取決於植入之後的清潔與回診。';

let out = src;
const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap(
  '<title>缺牙之後：活動假牙、牙橋與植牙怎麼選 — 芳仁牙醫診所</title>',
  `<title>${TITLE} — 芳仁牙醫診所（草稿預覽）</title>\n<meta name="robots" content="noindex, nofollow, noarchive">`,
  'title');

swap(
  '<meta name="description" content="缺一顆牙不只是缺一顆牙。三種重建方式的原理、代價與適應症比較，以及為什麼「再看看」通常是最貴的選項。">',
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
  "slug": "implant-lifespan",
  "title": "${TITLE}",
  "excerpt": "1965 年植入的第一組鈦植體，陪了患者四十年直到他過世；第二位患者的十一顆，紀錄上至少用了四十八年。但十年 96.4%、二十年約八成的群體數字，以及「存活」與「成功」的差別，說的是另一件事：植牙能用多久，一半取決於植入之後。",
  "tag": "缺牙重建",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "【還沒畫】",
  "about": [
    { "type": "MedicalProcedure", "name": "人工植牙", "sameAs": "https://www.wikidata.org/wiki/Q68892328" },
    { "type": "MedicalCondition", "name": "植體周圍炎" },
    { "type": "MedicalCondition", "name": "磨牙症" }
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

swap('<time datetime="2026-06-02">2026/06/02</time>',
     '<time datetime="2026-09-20">草稿・尚未上線</time>', 'date');
swap('<h1>缺牙之後：活動假牙、牙橋與植牙怎麼選</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒畫，放一塊佔位說明；「最後更新」那一行一起拿掉 ── */
const figStart = out.indexOf('    <figure class="post-hero">');
const updEnd = out.indexOf('</p>', out.indexOf('<p class="post-updated-line">')) + '</p>'.length;
if (figStart < 0 || updEnd < 3) throw new Error('找不到 HERO 那一塊');
out = out.slice(0, figStart) + `    <div class="wrap-text">
      <p class="pv-hero-slot">HERO 插畫的位置<br><small>文案定案之後才畫（圖是開場那一幕的畫面，兩件事是一組的）</small></p>
    </div>` + out.slice(updEnd);

/* ── ④ 內文 ───────────────────────────────────────────────── */
const bodyStart = out.indexOf('    <p class="lede">');
const bodyEnd = out.indexOf('    <div class="post-foot">');
if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
out = out.slice(0, bodyStart) + `    <p class="lede">「植牙可以用一輩子嗎？」這是還沒決定要不要做的人，最常問的一句。</p>
    <p>要回答它，可以先看兩位患者。他們的植體是世界上最早的那幾顆，而且一直被追蹤到今天。</p>

    <h2>世界第一顆植牙，陪了他四十年</h2>
    <p>1965 年，瑞典哥德堡大學的 Per-Ingvar Brånemark 教授，為一位名叫 Gösta Larsson 的患者植入人類史上第一組骨整合鈦金屬植體。Larsson 天生顎骨發育異常，當時已經全口無牙；那天植入下顎的四顆鈦植體撐起一副固定式的全口假牙，他終於能夠正常進食與說話。</p>
    <p><a href="https://www.dental-tribune.com/news/the-man-who-made-people-smile/" target="_blank" rel="noopener">Larsson 在 2006 年過世</a>，距離那場手術超過四十年，四顆植體仍在原位、功能正常。這是骨整合能夠長期使用的第一個證據。</p>

    <h2>第二位患者：同一組植體，紀錄上至少四十八年</h2>
    <p>Brånemark 的第二位患者 Sven Johansson 是哥德堡的計程車司機。他是在載客途中，從乘客口中聽說植牙這件事的——而那位乘客正是 Larsson，把 Brånemark 教授的聯絡方式給了他。</p>
    <p>1967 年，<a href="https://www.nobelbiocare.com/blog/news/two-men-make-history-together/" target="_blank" rel="noopener">Johansson 上下顎一共植入十一顆植體</a>，撐起兩副全顎固定牙橋。這些年他換過牙橋，<strong>植體本身沒有換過</strong>；到 2015 年滿四十八年，是公開紀錄裡使用骨整合口腔植體時間最長的人。</p>

    <div class="callout">
      <p><b>這兩組還是最早期的設計。</b>當年用的是直壁、外六角的植體，表面處理與接合方式都和現在不一樣。今天的植體在這些地方已經改良很多，但那兩組最原始的設計，本身就撐過了數十年。</p>
    </div>

    <h2>那一般人呢：十年與二十年的數字</h2>
    <p>個案讓人振奮，但要決定自己做不做，看的是群體的數字。</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>追蹤年限</th><th>植體的存活率</th><th>這個數字從哪裡來</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>10 年</td>
            <td><strong>96.4%</strong>；把中途失聯、沒被追蹤到的那些人也一併算成失敗（比較保守的算法）之後是 <strong>93.2%</strong></td>
            <td><a href="https://pubmed.ncbi.nlm.nih.gov/30904559/" target="_blank" rel="noopener">2019 年一篇收了 18 份前瞻研究的系統性回顧</a></td>
          </tr>
          <tr>
            <td>20 年</td>
            <td>前瞻研究 <strong>92%</strong>、回溯研究 <strong>88%</strong>；同樣把缺漏的資料補算進去之後約 <strong>78%</strong></td>
            <td><a href="https://doi.org/10.1007/s00784-024-05929-3" target="_blank" rel="noopener">2024 年的統合分析</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>二十年那份分析的結論裡有一句話值得記住：長期存活是可以期待的，但<strong>追蹤照護不可或缺，而且不該在植牙完成之後、甚至滿十年之後就停下來</strong>。</p>

    <h2>「存活」和「成功」不是同一件事</h2>
    <p>讀這些數字之前，要先知道兩個很容易被混在一起的詞：</p>
    <ul>
      <li><strong>存活</strong>：植體還在嘴裡。</li>
      <li><strong>成功</strong>：植體周圍的骨頭穩定、沒有發炎、不會痛，上面的假牙功能正常。</li>
    </ul>
    <p>一顆已經流失一半骨頭、每年腫痛出血的植體，在統計上仍然算「存活」。所以「九成以上的存活率」和「身邊就有人植牙出問題」這兩件事，可以同時是真的。</p>

    <h2>失敗分成兩種，時間點完全不同</h2>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>類型</th><th>什麼時候發生</th><th>本質是什麼</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>早期失敗</strong></td><td>植入後數週到數月，多半在裝上假牙之前</td><td>骨整合從一開始就沒有形成</td></tr>
          <tr><td><strong>晚期失敗</strong></td><td>已經咬合使用幾年之後</td><td>已經形成的骨整合被破壞掉</td></tr>
        </tbody>
      </table>
    </div>
    <p>兩種的成因幾乎沒有重疊，能做的事情也不一樣。下面五個原因，前兩個屬於早期，後三個屬於晚期。</p>

    <h2>五個常見的原因</h2>

    <h3>一、骨整合沒有形成</h3>
    <p>鑽骨時產熱過高造成骨壞死、植體一開始就不夠穩固、骨質太過疏鬆、手術區域受到污染或感染——這些都會讓骨頭長不上去。<a href="https://pubmed.ncbi.nlm.nih.gov/27146701/" target="_blank" rel="noopener">一份分析 2,670 位患者、10,096 顆植體的研究</a>，看的正是「裝上假牙之前」這一段的失敗。這一類發生得很早也很快，和後續的清潔維護幾乎無關。</p>

    <h3>二、抽菸，以及影響癒合的全身狀況</h3>
    <p><a href="https://doi.org/10.1016/j.jdent.2015.03.003" target="_blank" rel="noopener">一份比較了八萬顆植體的統合分析</a>裡，抽菸者的失敗率是 <strong>6.35%</strong>，不抽菸者是 <strong>3.18%</strong>。菸會讓牙齦的血管收縮、癒合變慢，剛好落在骨整合最需要血流的那幾週。</p>
    <p>未受控制的糖尿病、頭頸部放射線治療的病史、部分影響骨代謝的藥物，也都會削弱傷口癒合與骨整合。這些不一定是「不能做」，但會改變評估的方式與時機——把病史與正在吃的藥完整告訴醫師，是為了讓手術排在你身體狀況最撐得住的時候。</p>

    <h3>三、植體周圍炎</h3>
    <p>這是晚期失敗最主要的元兇。細菌的生物膜讓植體周圍的黏膜發炎，接著一路往下啃掉支撐它的骨頭。<a href="https://doi.org/10.1111/jcpe.12334" target="_blank" rel="noopener">一份統合分析</a>估計：植體周圍黏膜炎的盛行率約 <strong>43%</strong>、植體周圍炎約 <strong>22%</strong>，而且<strong>使用的時間越長，比例越高</strong>。</p>
    <p>「植牙不會蛀牙，所以不用管它」——這句話最危險的地方就在這裡。植體確實不會蛀，但它周圍的骨頭會被發炎吃掉，而且和<a href="../../posts/perio-prevalence/">牙周病</a>一樣，過程中通常不太會痛。</p>

    <h3>四、咬合過載與磨牙</h3>
    <p>天然牙的牙根和骨頭之間有一層牙周韌帶，像避震器一樣吸收力量；<strong>植體沒有</strong>，它是直接長在骨頭上的剛性連結。夜裡磨牙的力量因此幾乎原封不動地傳到植體、骨頭與上面的零件。</p>
    <p>數字看得出差距：<a href="https://doi.org/10.1111/joor.12431" target="_blank" rel="noopener">磨牙者的植體失敗率 13.0%、非磨牙者 4.6%</a>；<a href="https://doi.org/10.1111/cid.12300" target="_blank" rel="noopener">另一份統合分析</a>算出磨牙者的失敗風險約是非磨牙者的四倍。除了失敗，螺絲鬆脫、假牙崩瓷、支架斷裂這些機械性的問題也比較常出現。有磨牙習慣不代表不能植牙，但這件事要在規劃的時候就講出來——咬合怎麼設計、要不要在夜間多加一層保護，都會因此不一樣。</p>

    <h3>五、沒有規律回診維護</h3>
    <p><a href="https://doi.org/10.1177/0022034515622432" target="_blank" rel="noopener">一份統合分析</a>發現：有沒有接受植體周圍的維護治療、回診的間隔有多長，都會影響植體周圍炎發生的比例；有牙周病史的人，風險又比別人高。作者因此主張<strong>回診間隔至少要維持在五到六個月以內</strong>，並強調植牙不能只停在「植入與裝上假牙」這兩步。</p>

    <h2>能用多久，一半取決於植入之後</h2>
    <p>回到最初那個問題。1965 年那四顆陪了患者四十年，直到他生命的終點；1967 年那十一顆，紀錄上至少服役了四十八年。<strong>所以「植牙能用多久」從來不是一個關於品牌的問題。</strong>它取決於三件事：</p>
    <ul>
      <li><strong>植入前</strong>：全身狀況有沒有控制好、有沒有戒菸、骨頭的條件夠不夠。</li>
      <li><strong>植入時</strong>：手術的品質，以及假牙的設計有沒有讓咬合的力量分散得宜。</li>
      <li><strong>植入後</strong>：每天的清潔，還有固定回診做專業維護。</li>
    </ul>
    <p>前兩件由醫師負責，第三件只有你自己做得到。而長期研究一致指向同一個結論：決定植牙能不能陪你二十年、三十年的，往往就是第三件。</p>
    <p><a href="../../posts/missing-tooth/">〈缺牙之後：活動假牙、牙橋與植牙怎麼選〉</a>裡提過，植體周圍發炎起來比自然牙更快、卻同樣不太會痛，所以建議每三到六個月回診檢查一次，包含清潔、咬合檢查與必要的 X 光追蹤——文獻給的上限是五到六個月，這個間隔正好落在裡面。</p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>植牙可以用一輩子嗎？</dt>
      <dd>有機會，但不是保證。世界第一位植牙患者用了超過四十年直到過世，第二位公開紀錄至少四十八年。群體數字則是：十年存活率 96.4%（保守算法 93.2%），二十年約八成上下。</dd>

      <dt>存活率九成以上，為什麼還是常聽到植牙失敗？</dt>
      <dd>因為「存活」只代表植體還在嘴裡。一顆已經流失一半骨頭、反覆腫痛出血的植體，統計上仍然算存活。骨頭穩定、不發炎、功能正常才叫「成功」。</dd>

      <dt>植體周圍炎是什麼？</dt>
      <dd>細菌讓植體周圍的黏膜發炎，進一步破壞支撐的骨頭，是晚期失敗最主要的原因。盛行率估計約 22%，而且使用的時間越長比例越高。植體不會蛀牙，但它周圍的骨頭會被發炎吃掉。</dd>

      <dt>會磨牙的人可以植牙嗎？</dt>
      <dd>可以，但風險比較高：磨牙者的失敗率 13.0%、非磨牙者 4.6%。植體沒有牙周韌帶當緩衝，力量會直接傳到骨頭與零件上，所以有磨牙習慣要在規劃前就讓醫師知道。</dd>

      <dt>植牙之後多久要回診一次？</dt>
      <dd>建議每三到六個月一次，包含清潔、咬合檢查與必要的 X 光追蹤。文獻建議的上限是五到六個月，有牙周病史、抽菸或磨牙的人應該更密集。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，不能取代臨床診斷。文中的存活率與盛行率來自國外的長期追蹤與統合分析，個別條件不同，結果因人而異。是否適合植牙、需要哪些前置處理，需經醫師檢查並搭配 X 光等影像評估後判斷。</p>

` + out.slice(bodyEnd);

/* ── ⑤ 文末導覽：同層連結會指到 preview/ 底下，一律改成絕對深度 ── */
swap('        <a class="btn btn-ghost" href="../kids-first-visit/">&larr; 上一篇：孩子第一次看牙</a>\n' +
     '        <a class="btn" href="../regular-checkup/">下一篇：半年一次的洗牙 &rarr;</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/missing-tooth/">&larr; 缺牙之後怎麼選</a>\n' +
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
  ['植牙能用多久', '標題沒換到'],
  ['theme-toggle', '夜間模式的開關被切掉了'],
  ['重點整理', '重點整理不見了'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['post-updated-line', '「最後更新」那一行沒拿掉：草稿沒有上線日期'],
  ['缺牙之後：活動假牙、牙橋與植牙怎麼選 —', '舊標題殘留'],
  ['hero-implant-photo', '舊的 HERO 圖殘留'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/implant-lifespan/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/implant-lifespan/index.html　' + out.length + ' 字元');
