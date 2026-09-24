// 產生 preview/perio-full-mouth/index.html —— 〈牙周病為什麼要全口治療〉的文章草稿預覽
//
// 用法：node drafts/perio-full-mouth/preview-gen.mjs            → preview/perio-full-mouth/
//       node drafts/perio-full-mouth/preview-gen.mjs --publish  → posts/perio-full-mouth/
//
// 做法照抄 drafts/pulp-calcification/preview-gen.mjs（那一支的檔頭有六件事的完整說明）。
// 骨架抓 posts/perio-laser/index.html（同一科 perio、同一個 tag「牙周照護」），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案。
//
// ⚠⚠ 定案之後**不要手改 posts/ 底下那一份**：內文與 post-meta 的唯一來源仍然是這一支。
// ⚠ 提案頁自己的 class 一律 pv- 前綴。
// ⚠ 這一支是模板字串：CSS 註解裡不可以出現反引號，也不可以出現註解的結束記號。
//
// 文中每一個數字的出處逐條列在同一個資料夾的 SOURCES.md，改內文的數字前先看那一份。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SLUG = 'perio-full-mouth';
const PUBLISH = process.argv.includes('--publish');
const PUBDATE = '【上線那天填】';                  // 上架日（--publish 之前改成 YYYY-MM-DD）
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(resolve(root, 'posts/perio-laser/index.html'), 'utf8');

const TITLE = '牙周病為什麼要全口治療：會痛的，通常只是最嚴重的那一顆';
const DESC  = '明明只有一顆牙在痛，醫師卻說要做全口的牙周檢查與治療？牙周病多半不痛，會痛的那一顆往往只是最嚴重的一顆。為什麼偏偏是它、其他牙齒放著會怎樣、全口檢查在看什麼，以及正在痛的那一顆會先怎麼處理。';
const OGDESC = '會痛的那一顆，往往只是最嚴重的一顆。為什麼偏偏是它、其他牙齒放著會怎樣，以及正在痛的那一顆會先怎麼處理。';
const EXCERPT = '「只有右下那一顆在痛，為什麼要檢查整口？」牙周病大部分時候不痛，會腫會痛的那一顆，往往只是最嚴重、最先出現症狀的一顆。這一篇講為什麼偏偏是它、其他牙齒放著會怎樣，以及正在痛的那一顆會先怎麼處理。';

let out = src;
const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap('<title>牙周病治療：清創、水雷射與再生手術 — 芳仁牙醫診所</title>',
     PUBLISH ? `<title>${TITLE} — 芳仁牙醫診所</title>`
             : `<title>${TITLE} — 芳仁牙醫診所（草稿預覽）</title>\n<meta name="robots" content="noindex, nofollow, noarchive">`,
     'title');

out = out.replace(/<meta name="description"[^>]*>\n/, `<meta name="description" content="${DESC}">\n`);
out = out.replace(/<meta property="og:title"[^>]*>\n/, `<meta property="og:title" content="${TITLE}">\n`);
out = out.replace(/<meta property="og:description"[^>]*>\n/, `<meta property="og:description" content="${OGDESC}">\n`);
{
  const a = out.indexOf('<!-- SEO:START');
  const z = out.indexOf('<!-- SEO:END -->');
  if (a < 0 || z < 0) throw new Error('找不到 SEO 區塊');
  if (PUBLISH) {
    out = out.replace(/<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="https://fangren.net/posts/${SLUG}/">`);
    out = out.slice(0, a) + '<!-- SEO:START — 由 tools/build.mjs 產生，請勿手動編輯 -->\n' + out.slice(z);
  } else {
    out = out.slice(0, a) +
      '<!-- 這一頁是還沒上線的草稿預覽：原本 build 產的 SEO 區塊（canonical／og:url／JSON-LD）\n' +
      '     整段拿掉了 —— 那些欄位會指向一個還不存在的網址。noindex 寫在 <title> 底下。 -->\n' +
      out.slice(z + '<!-- SEO:END -->'.length + 1);
    out = out.replace(/<link rel="canonical"[^>]*>\n/, '');
  }
}

/* post-meta。Q 編號都是 2026-09-23 去 Wikidata 逐一驗過的（P279／MeSH／維基條目），見 SOURCES.md。 */
const metaStart = out.indexOf('<script type="application/json" id="post-meta">');
const metaEnd = out.indexOf('</script>', metaStart) + '</script>'.length;
out = out.slice(0, metaStart) + `<script type="application/json" id="post-meta">
{
  "slug": "${SLUG}",
  "title": "${TITLE}",
  "excerpt": "${EXCERPT}",
  "tag": "牙周照護",
  "author": "芳仁牙醫診所 編輯室",
  "published": "${PUBDATE}",
  "hero": "hero-${SLUG}-photo-1600.jpg",
  "heroAlt": "【HERO 還沒畫】",
  "about": [
    { "type": "MedicalCondition", "name": "牙周病", "sameAs": "https://www.wikidata.org/wiki/Q520127" },
    { "type": "MedicalCondition", "name": "根分岔病變", "sameAs": "https://www.wikidata.org/wiki/Q3090996" },
    { "type": "MedicalCondition", "name": "咬合創傷", "sameAs": "https://www.wikidata.org/wiki/Q7075713" },
    { "type": "MedicalTherapy", "name": "牙根整平術", "sameAs": "https://www.wikidata.org/wiki/Q24894161" }
  ]
}
</script>` + out.slice(metaEnd);

/* ── ② 標題列：拿掉計數器、換日期與標題 ───────────────────── */
if (PUBLISH) {
  swap('data-views-self="perio-laser"', `data-views-self="${SLUG}"`, 'views');
} else {
  const viewsStart = out.indexOf('        <span class="views"');
  const toggleStart = out.indexOf('        <button class="theme-toggle"', viewsStart);
  if (viewsStart < 0 || toggleStart < 0) throw new Error('找不到 .views 那一塊');
  out = out.slice(0, viewsStart) + out.slice(toggleStart);
}
swap('<time datetime="2026-08-16">2026/08/16</time>',
     PUBLISH ? `<time datetime="${PUBDATE}">${PUBDATE.replace(/-/g, '/')}</time>`
             : '<time datetime="2026-09-23">草稿・尚未上線</time>', 'date');
swap('<h1>牙周病治療：清創、水雷射與再生手術</h1>', `<h1>${TITLE}</h1>`, 'h1');

/* ── ③ HERO：還沒畫，放一塊佔位說明；「最後更新」那一行一起拿掉 ── */
{
  const figStart = out.indexOf('    <figure class="post-hero">');
  const updEnd = out.indexOf('</p>', out.indexOf('<p class="post-updated-line">')) + '</p>'.length;
  if (figStart < 0 || updEnd < 3) throw new Error('找不到 HERO 那一塊');
  if (PUBLISH) throw new Error('HERO 還沒畫：先出圖、跑 hero-resize.mjs，再把 <picture> 補進這一支（照 pulp-calcification 那一支的 PUBLISH 分支）');
  out = out.slice(0, figStart) + `    <figure class="post-hero">
      <div class="pv-hero-slot">
        <span>HERO 插畫還沒畫</span>
        <small>文字定案之後再出圖</small>
      </div>
    </figure>` + out.slice(updEnd);
}

/* ── ④ 內文 ───────────────────────────────────────────────── */
{
  const bodyStart = out.indexOf('    <p class="lede">');
  const bodyEnd = out.indexOf('    <div class="post-foot">');
  if (bodyStart < 0 || bodyEnd < 0) throw new Error('找不到內文範圍');
  out = out.slice(0, bodyStart) + BODY() + out.slice(bodyEnd);
}

function BODY() { return `    <p class="lede">因為「右下那一顆在痛」或「那邊的牙齦腫起來了」來看牙，醫師檢查完卻說：「我們先幫你做全口的牙周檢查和治療。」心裡難免有疑問：明明只有一個地方不舒服，為什麼要處理整口牙？簡單的答案是：<strong>會痛的那一顆，通常是最嚴重的一顆，卻不是唯一生病的一顆。</strong></p>

    <h2>牙周病大部分時候不痛</h2>
    <p>牙周病是一種慢性、安靜的發炎。它在牙齦底下慢慢破壞托住牙齒的骨頭，很長一段時間只會刷牙流血，不痛不癢（這件事單獨寫過一篇：<a href="../../posts/perio-prevalence/">〈八成人有牙周病〉</a>）。</p>
    <p>等到出現腫痛、流膿、牙齒搖動，通常代表那個位置已經發展到比較嚴重的程度。所以會痛的那一顆，其實是<strong>最嚴重、最先出現症狀的一顆</strong>；同一張嘴裡的其他牙齒，可能也有牙周囊袋加深、骨頭流失的情形，只是還沒到會痛的階段。</p>

    <h2>為什麼偏偏是那一顆特別嚴重</h2>
    <p>造成牙周病的原因——牙菌斑與牙結石——是整口都有的。但同樣的清潔習慣，有些位置天生就比較吃虧：</p>
    <ul>
      <li><strong>大臼齒的根分岔</strong>：大臼齒有兩到三支牙根，牙根分開的那個夾角，牙刷刷不到、器械也不容易伸進去。一份統合分析發現，<a href="https://pubmed.ncbi.nlm.nih.gov/26932323/" target="_blank" rel="noopener">有根分岔病變的大臼齒，在長期的牙周維護中掉牙的風險大約是沒有的兩倍</a>。</li>
      <li><strong>牙齒天生的形狀</strong>：有些大臼齒的琺瑯質會往下多延伸一小段，伸進兩支牙根之間（稱為「琺瑯突起」），牙齦在那裡貼不牢，細菌容易往下鑽。高雄醫學大學的研究發現，<a href="https://pubmed.ncbi.nlm.nih.gov/3478466/" target="_blank" rel="noopener">已經出現根分岔病變的大臼齒，有八成以上有這個構造；沒有病變的只有不到兩成</a>。</li>
      <li><strong>咬合力量過大</strong>：某一顆牙如果長期承受比較大的咬合力，在已經有牙周病的情況下，可能會加速那一顆的破壞。研究觀察到，<a href="https://pubmed.ncbi.nlm.nih.gov/11338301/" target="_blank" rel="noopener">有咬合不協調的牙齒，囊袋比較深、動搖度也比較大</a>；<a href="https://pubmed.ncbi.nlm.nih.gov/11338302/" target="_blank" rel="noopener">咬合問題沒有處理的牙齒，囊袋每年持續加深</a>。</li>
    </ul>
    <p>這些條件解釋了<strong>為什麼是這一顆先壞</strong>，但不代表其他牙齒沒事。原因在整口，只是這一顆的條件最差。</p>

    <h2>其他還不痛的牙齒，放著會怎樣</h2>
    <p>牙周病多數是以年為單位、慢慢加重的；但也有少數人進展得特別快。一項在斯里蘭卡、從未接受過牙科治療的族群身上做的長期追蹤裡，<a href="https://pubmed.ncbi.nlm.nih.gov/3487557/" target="_blank" rel="noopener">大約每十二個人就有一個屬於快速進展，那一群人的牙周附著與牙齒都流失得又早又快</a>。而且它不是等速變差的，<a href="https://pubmed.ncbi.nlm.nih.gov/6582072/" target="_blank" rel="noopener">同一個位置可能安靜好幾年，然後在一段時間裡明顯惡化</a>。</p>
    <p>「只是刷牙會流血」也不是小事。一項在挪威奧斯陸追蹤了 26 年的研究，對象是每天刷牙、也定期看牙醫的一般民眾。即使如此，牙齦長期處在發炎狀態的位置，<a href="https://pubmed.ncbi.nlm.nih.gov/14710769/" target="_blank" rel="noopener">失去的牙周附著仍比牙齦健康的位置多了大約七成</a>；整圈牙齦持續發炎的牙齒，<a href="https://pubmed.ncbi.nlm.nih.gov/15560816/" target="_blank" rel="noopener">掉牙的風險更高出數十倍</a>。</p>
    <p>換句話說，其他還不痛的那幾顆，如果放著不處理，就是幾年後下一顆會痛的牙。</p>

    <h2>全口檢查在看什麼</h2>
    <p>正式治療之前，醫師會先把整口的狀況看清楚：</p>
    <ul>
      <li><strong>牙周囊袋的深度</strong>：每一顆牙都要檢查好幾個位置，同時記錄哪些地方會流血、牙齦有沒有退縮。</li>
      <li><strong>X 光</strong>：一顆一顆確認牙齒周圍的骨頭還剩多少、流失的範圍有多大。</li>
      <li><strong>牙齒的動搖度與咬合</strong>：哪幾顆會搖、咬合的力量有沒有集中在某幾顆上。</li>
    </ul>

    <h2>治療後留下的深囊袋，決定哪一顆最容易掉</h2>
    <p>基礎的牙周治療是深層牙結石刮除（也就是牙根整平），把牙齦底下、牙刷碰不到的結石與感染組織清掉，同時調整每天的清潔方式，讓牙齦的發炎整體降下來（治療的細節寫在<a href="../../posts/perio-laser/">〈牙周病治療：清創、水雷射與再生手術〉</a>）。</p>
    <p>治療結束後，醫師會再檢查一次囊袋的深度。這一步很重要，因為治療後還留著的深囊袋，和日後會不會掉牙關係很大。</p>
    <p>先有一個尺度：<strong>牙根埋在骨頭裡大約十三毫米（mm）</strong>，健康的牙齦溝只有 1 到 3 毫米。囊袋變深，代表牙根上段已經和牙齦、骨頭分開。粗略換算，<strong>5 毫米的囊袋大約流失了四分之一的牙根，7 毫米以上接近四成</strong>；牙齦如果已經退縮，實際流失的還要更多。這只是一個概念，確切還剩多少，要看檢查紀錄搭配 X 光。</p>
    <p>有了這個尺度，再看<a href="https://pubmed.ncbi.nlm.nih.gov/18549447/" target="_blank" rel="noopener">這份平均追蹤 11 年的研究</a>，比較了治療後囊袋深度不同的牙齒：</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>治療後留下的囊袋深度</th><th>日後掉牙的機會（和 3 毫米以內相比）</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>3 毫米以內</strong></td><td>作為比較基準</td></tr>
          <tr><td><strong>5 毫米</strong></td><td>約 7.7 倍</td></tr>
          <tr><td><strong>6 毫米</strong></td><td>約 11 倍</td></tr>
          <tr><td><strong>7 毫米以上</strong></td><td>約 64 倍</td></tr>
        </tbody>
      </table>
    </div>
    <p>這張表說的是：牙周治療的成果要一顆一顆算。會痛的那一顆治好了，旁邊如果還有一顆留著 6 毫米的囊袋沒有處理，那一顆就是日後最容易出問題的一顆。深層清潔之後仍然清不到底的地方，醫師會評估是否需要進一步的處理。</p>
    <p>另外，研究也發現牙周病的嚴重程度和血糖控制有關：<a href="https://doi.org/10.1002/jper.70064" target="_blank" rel="noopener">糖化血色素越高，牙周病往往越嚴重</a>。有糖尿病的人，更需要把整口的發炎控制下來。</p>

    <h2>那現在正在痛的那一顆怎麼辦</h2>
    <ul>
      <li><strong>先處理急性的腫痛</strong>：牙齦腫起來、會痛、化膿的那一顆，會先處理，讓你舒服下來。全口的檢查與治療，不是要你忍著痛等排程。</li>
      <li><strong>全口治療不是一次做完</strong>：深層牙結石刮除會局部麻醉、分區進行，分成幾次完成。</li>
      <li><strong>最嚴重的那一顆可能需要多一點照顧</strong>：例如根分岔的位置清潔起來比較困難，咬合力量集中的牙齒也可能需要評估咬合。少數已經嚴重到保不住的牙，醫師會在全口的狀況都清楚之後，和你一起討論怎麼安排。</li>
      <li><strong>治療後還有維護期</strong>：牙周病是會復發的慢性病，治療結束後要固定回診，逐次比對囊袋深度與出血的位置（見<a href="../../posts/three-month-recall/">〈三個月一次的洗牙與塗氟〉</a>）。</li>
    </ul>

    <h2>芳仁牙醫的牙周治療怎麼做</h2>
    <p>從檢查開始：X 光一顆顆確認牙齒的地基還剩多少，檢查完告訴你數字、牙周病到第幾期。接著是深層牙結石刮除，同時帶你找到自己刷牙的死角；深處清不到的地方搭配水雷射，骨頭已經缺損的地方有再生手術。治療結束之後，牙周要長期維護——靠定期回診，也靠你每天的清潔。</p>

    <h2>這一篇想講的一件事</h2>
    <p>牙周病很少是單一顆牙的問題。從全口開始，是為了找出還沒發出症狀的那幾顆、把每一顆的發炎都控制下來，讓牙齒留得更久、用得更好。</p>
    <p>如果最近有刷牙流血、牙齦腫、口氣變重或牙齒鬆動的情形，就值得安排一次完整的牙周檢查——千萬不要等到哪一顆開始痛。</p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>只有一顆牙在痛，為什麼要做全口的牙周檢查？</dt>
      <dd>牙周病大部分時候不痛，會腫會痛的那一顆，通常只是最嚴重、最先出現症狀的一顆。其他牙齒可能也有囊袋加深、骨頭流失，只是還沒到會痛的程度。</dd>

      <dt>為什麼偏偏是那一顆特別嚴重？</dt>
      <dd>原因在整口，但有些位置天生比較吃虧：大臼齒牙根分開的夾角（根分岔）清不到、有些牙齒的琺瑯質天生往下延伸讓牙齦貼不牢、某一顆長期承受過大的咬合力。這些條件讓那一顆先壞，但不代表其他牙齒沒事。</dd>

      <dt>其他牙齒現在不痛，放著會怎樣？</dt>
      <dd>牙周病多數是慢慢加重的，但少數人進展很快，而且同一個位置可能安靜幾年後突然惡化。即使每天刷牙、定期看牙，牙齦長期發炎的位置 26 年間失去的牙周附著，仍比健康的位置多了大約七成。今天不痛的那幾顆，放著就是幾年後下一顆會痛的牙。</dd>

      <dt>治療完為什麼還要再檢查一次？</dt>
      <dd>牙根埋在骨頭裡大約十三毫米（mm），5 毫米的囊袋大約代表四分之一的牙根已經失去附著。治療後留下的深囊袋，和日後掉牙的關係很大：和 3 毫米以內相比，留下 5 毫米的牙齒日後掉牙的機會約 7.7 倍、6 毫米約 11 倍、7 毫米以上約 64 倍。牙周治療的成果要一顆一顆算，清不到底的地方要再評估。</dd>

      <dt>正在痛的那一顆會先處理嗎？</dt>
      <dd>會。急性的腫痛會先處理，讓你舒服下來，再安排全口的檢查與治療。深層牙結石刮除會局部麻醉、分區分次完成，治療後還有固定回診的維護期。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，不能取代臨床診斷。文中的盛行率與追蹤數字來自國外的研究，個別條件不同，結果因人而異。牙周病的分期、哪些牙齒需要優先處理、治療要分幾次完成，都要經牙周檢查並搭配 X 光評估後判斷。</p>

`; }

/* ── ⑤ 文末導覽：最新那一篇只往回指一篇，右邊固定「回文章列表」 ── */
swap('        <a class="btn btn-ghost" href="../kids-arch-expansion/">&larr; 上一篇：擴張牙弓</a>\n',
     PUBLISH ? '        <a class="btn btn-ghost" href="../【上一篇 slug】/">&larr; 上一篇：【上一篇】</a>\n'
             : '        <a class="btn btn-ghost" href="../../posts/perio-prevalence/">&larr; 八成人有牙周病</a>\n',
     'post-nav');

/* ── ⑥ RELATED 區塊：草稿預覽整段拿掉（build 產物） ─────────── */
if (!PUBLISH) {
  const relStart = out.indexOf('<!-- RELATED:START');
  const relEnd = out.indexOf('<!-- RELATED:END -->');
  if (relStart < 0 || relEnd < 0) throw new Error('找不到 RELATED 區塊');
  out = out.slice(0, relStart) + out.slice(relEnd + '<!-- RELATED:END -->'.length + 1);
}

/* ── ⑦ 這一頁自己的樣式（pv- 前綴）＋草稿橫幅 ───────────── */
const css = `<style>
/* 這一頁專用。class 一律 pv- 前綴。 */
.pv-flag { max-width: var(--content); margin: 0 auto; padding: .55rem var(--pad); font-size: .82rem;
           color: var(--ink-soft); text-align: center; letter-spacing: .02em; }
.pv-flag b { color: var(--accent-deep); }
.pv-hero-slot { display: grid; place-content: center; gap: .4rem; text-align: center;
                min-height: 34vw; padding: 2rem 1rem; border: 1px dashed var(--rule);
                border-radius: 12px; color: var(--ink-soft); font-size: .92rem; }
.pv-hero-slot small { font-size: .82rem; opacity: .85; }
</style>`;
if (!PUBLISH) {
  swap('<link rel="stylesheet" href="../../assets/style.css">',
       '<link rel="stylesheet" href="../../assets/style.css">\n' + css, 'style');
  swap('<main id="main">\n<article>',
       '<main id="main">\n<p class="pv-flag"><b>草稿預覽</b>：這一頁還沒上線，網址沒有被搜尋引擎收錄。</p>\n<article>',
       'flag');
}

/* ── 守門 ─────────────────────────────────────────────────── */
/* 比喻的「路／走／方向」上限 3（COPY.md 第十之四節）。只掃內文，掃整頁會撞到這段說明。 */
{
  const b0 = out.indexOf('    <p class="lede">');
  const b1 = out.indexOf('    <div class="post-foot">');
  const body = out.slice(b0, b1).replace(/<[^>]*>/g, '');
  const n = p => (body.match(new RegExp(p, 'g')) || []).length;
  const road = n('路'), walk = n('走'), dir = n('方向');
  if (road + walk + dir > 3) throw new Error(`比喻的「路／走／方向」太多：路 ${road}、走 ${walk}、方向 ${dir}（上限 3）`);
  /* 著陸頁定案過的兩件，文章也照做：不寫「牙周專科醫師」（站上沒有人有這個部定專科）、
     不寫「每一顆都清乾淨」（深度有極限，那正是進階治療存在的理由）。 */
  for (const w of ['牙周專科', '仔細清乾淨', '徹底清乾淨', '隨時']) if (body.includes(w)) throw new Error('內文出現「' + w + '」');
  console.log(`　守門：內文 ${body.replace(/\s/g, '').length} 字，路 ${road}、走 ${walk}、方向 ${dir}（上限 3）`);
}

const must = [
  [TITLE, '標題沒換到'],
  ['theme-toggle', '夜間模式的開關被切掉了'],
  ['重點整理', '重點整理不見了'],
  ['class="note"', '免責段落不見了'],
  ['noindex', 'noindex 不見了'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['清創、水雷射與再生手術 —', '舊標題殘留'],
  ['hero-perio-photo', '舊的 HERO 圖殘留'],
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['post-updated-line', '「最後更新」那一行沒拿掉'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, `preview/${SLUG}/index.html`);
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log(`寫好了：preview/${SLUG}/index.html　${out.length} 字元`);
