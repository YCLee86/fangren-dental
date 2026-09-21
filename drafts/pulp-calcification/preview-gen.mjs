// 產生 preview/pulp-calcification/index.html —— 〈根管鈣化〉的文章草稿預覽
//
// 用法：node drafts/pulp-calcification/preview-gen.mjs
//
// 骨架抓 posts/bioceramic/index.html（同一科 endo、同一個 tag「顯微根管」），只換內容。
// ⚠ 這一頁是**文章草稿的預覽，不是設計提案**：沒有切換條、沒有候選案，
//   用途只是讓使用者在手機上讀完整篇（同 implant-lifespan／ortho-article 那幾次）。
//
// 這一種要處理的六件（CLAUDE.md 第八節）：
//  ① <head> 的 SEO:START~SEO:END 整段換成 noindex —— 那一段是 build 照 post-meta 產的，
//    裡面的 canonical／og:url／JSON-LD 全部指向一個**還沒上線的網址**。
//  ② 計數器：把 .views 整塊拿掉（data-views-self 留著的話，每開一次預覽就 POST +1）。
//    ⚠ 夜間模式那顆開關就接在 .views 後面，切的時候不要連它一起切掉。
//  ③ 同層連結：preview/<name>/ 和 posts/<slug>/ 深度相同，所以 ../../assets/… 照樣對；
//    但 ../bioceramic/ 這種同層連結會指到 preview/ 底下去 —— 一律寫成 ../../posts/<slug>/。
//  ④ RELATED:START~RELATED:END 是 build 產物，這一頁不留。
//  ⑤ HERO 還沒畫，放一塊佔位說明（不要放破圖）；「最後更新」那一行也一起拿掉，
//    草稿還沒有上線日期，印出來是假話。
//  ⑥ theme-color 跟著科別走（endo 是 #12656a），骨架本來就是同一科，不必換。
//
// ⚠ 提案頁自己的 class 一律 pv- 前綴（2026-08-16 踩過：短名字會和站上的撞）。
// ⚠ 這一支是模板字串：CSS 註解裡不可以出現反引號，也不可以出現註解的結束記號。
//
// 文中每一個數字的出處逐條列在同一個資料夾的 SOURCES.md，改內文的數字前先看那一份。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(resolve(root, 'posts/bioceramic/index.html'), 'utf8');

const TITLE = '根管鈣化：牙齒自己把管子封起來，不一定要打開它';
const DESC  = '「醫師說我這顆牙鈣化了，是不是很嚴重？」牙齒一輩子都在把自己的管子補窄。外傷後的鈣化反而代表神經還活著，冷測沒反應是常態——三種鈣化的差別、台灣的數字怎麼讀，以及為什麼第一個問題是「要不要打開」而不是「怎麼打開」。';
const OGDESC = '外傷後的鈣化代表神經還活著，冷測沒反應是常態。三種鈣化的差別、台灣的數字怎麼讀，以及為什麼第一個問題是「要不要打開」。';

let out = src;
const swap = (from, to, what) => {
  if (!out.includes(from)) throw new Error('找不到要替換的片段：' + what);
  out = out.replace(from, to);
};

/* ── ① <head> ─────────────────────────────────────────────── */
swap('<title>根管治療的生物陶瓷：它多做了什麼 — 芳仁牙醫診所</title>',
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
   ⚠ 根管鈣化與髓石查不到 Wikidata 對應項目，sameAs 留白 —— 不要猜 Q 編號。 */
const metaStart = out.indexOf('<script type="application/json" id="post-meta">');
const metaEnd = out.indexOf('</script>', metaStart) + '</script>'.length;
out = out.slice(0, metaStart) + `<script type="application/json" id="post-meta">
{
  "slug": "pulp-calcification",
  "title": "${TITLE}",
  "excerpt": "「醫師說我這顆牙鈣化了」「小時候撞到的門牙愈來愈黃，是不是死掉了？」牙齒一輩子都在把自己的管子補窄，鈣化多半不是壞消息——外傷之後還在繼續鈣化，反而代表那條神經還活著。這一篇聊聊三種鈣化的差別、台灣的數字要怎麼讀，以及為什麼第一個問題不是「怎麼打開」，是「要不要打開」。",
  "tag": "顯微根管",
  "author": "芳仁牙醫診所 編輯室",
  "published": "【上線那天填】",
  "hero": "【還沒畫】",
  "about": [
    { "type": "MedicalCondition", "name": "根管鈣化" },
    { "type": "MedicalCondition", "name": "髓石" },
    { "type": "MedicalCondition", "name": "牙齒外傷", "sameAs": "https://www.wikidata.org/wiki/Q2346266" },
    { "type": "MedicalProcedure", "name": "根管治療", "sameAs": "https://www.wikidata.org/wiki/Q905815" },
    { "type": "MedicalProcedure", "name": "活髓治療", "sameAs": "https://www.wikidata.org/wiki/Q17146150" }
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

swap('<time datetime="2026-08-21">2026/08/21</time>',
     '<time datetime="2026-09-21">草稿・尚未上線</time>', 'date');
swap('<h1>根管治療的生物陶瓷：它多做了什麼</h1>', `<h1>${TITLE}</h1>`, 'h1');

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
out = out.slice(0, bodyStart) + BODY() + out.slice(bodyEnd);

function BODY() { return `    <p class="lede">「醫師說我這顆牙『鈣化』了，是不是很嚴重？」「小時候撞到的那顆門牙，這幾年愈來愈黃，是不是已經死掉了？」「同樣是根管治療，為什麼這一顆要花特別久？」這三句話問的其實是同一件事——牙齒把自己中間那條管子，愈補愈窄了。而它最違反直覺的地方是：<strong>多數時候，那並不是壞消息。</strong></p>

    <h2>鈣化不是蛀掉，是牙齒一直在往內補牆</h2>
    <p>牙齒中間那條容納神經與血管的空間，叫做牙髓腔與根管。管壁上有一層細胞終其一生都在分泌牙本質，所以這條管子<strong>一輩子都在慢慢變窄</strong>——二十歲的臼齒和六十歲的同一顆，剖開來粗細是不一樣的。這是正常的老化，不是病。</p>
    <p>會被特別提出來講，是因為它有時候縮得特別快、特別多，快到治療時找不到入口。這時候醫師才會說「這顆牙鈣化了」。</p>

    <h2>同一個詞，其實指三種不同的東西</h2>
    <p>診間裡講的「鈣化」涵蓋三種狀況，成因與處理方式都不一樣：</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>說法</th><th>X 光上長什麼樣</th><th>對治療的意義</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>髓石</strong></td>
            <td>牙髓腔裡有一顆或數顆界線清楚的硬塊，像管子裡卡了小石頭</td>
            <td>擋住入口、卡住器械，但底下的根管本身常常還是通的</td>
          </tr>
          <tr>
            <td><strong>瀰漫性鈣化</strong></td>
            <td>沒有具體形狀，整片牙髓腔變得模糊，像結了一層霧</td>
            <td>常和長期發炎、年紀一起出現</td>
          </tr>
          <tr>
            <td><strong>根管閉鎖</strong></td>
            <td>硬組織沿著管壁往中間長，整條管子逐漸消失，牙冠跟著變黃</td>
            <td>這一種才是真正「找不到根管」的主因</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>三種可以同時發生在同一顆牙上。順帶提一件容易搞混的事：新聞或衛教文章上看到的「鈣化盛行率」，講的幾乎都是<strong>髓石</strong>；而醫師說「這一顆閉鎖了」，指的是第三種。兩個數字不能互相換算。</p>

    <h2>為什麼會鈣化</h2>
    <ul>
      <li><strong>年紀</strong>：最強的一項。管子一輩子都在變窄，年齡本身就是最好的預測因子。</li>
      <li><strong>蛀牙、磨耗，或做過大面積的填補與牙套</strong>：牙髓受到刺激時，會在受刺激的那一側加速補上一層新的牙本質，把自己和外界隔開。這是牙齒的防衛反應，不是併發症。</li>
      <li><strong>撞擊過</strong>：外傷之後最典型的一種，下一節整節在講這件事。</li>
      <li><strong>矯正</strong>：有研究觀察到矯正過的牙齒髓石比例較高；也有另一種看法認為，那反映的是矯正之前就已經存在的撞擊傷害。兩種說法目前都還在。</li>
      <li><strong>治療本身</strong>：做過<a href="../../posts/bioceramic/">活髓治療</a>、或在牙髓上放過氫氧化鈣與生物陶瓷材料的牙齒，會在材料底下長出一層硬組織——那正是那些材料被放進去的目的。</li>
    </ul>

    <h2>撞過的那顆門牙變黃：黃是它還活著的證據</h2>
    <p>這是全篇最重要、也最常被誤會的一段。</p>
    <p>牙齒受到撞擊之後（上顎那兩顆門牙首當其衝），供應牙髓的血流可能短暫中斷；等血流重新接回來，管壁上那層細胞有時會「過度工作」，把根管一路往內填起來。牙冠因此逐漸變黃、變暗，看起來像一顆已經死掉的牙。</p>
    <p><strong>但要反過來讀：還在繼續造牙本質，代表那條神經還活著。</strong>壞死的牙髓不會蓋房子。</p>
    <p>接著是第二個誤會——冷測。鈣化過的牙齒管腔變小、神經末梢的分布也變了，<strong>對冷測或電測沒有反應是常態</strong>，並不等於壞死。醫師會一起看的是另外四件事：會不會自發性地痛、牙齦有沒有腫、有沒有長出竇道（膿包），以及 X 光片上根尖有沒有暗影。這四項都正常的話，一顆變黃、冷測沒反應的門牙，多半只需要追蹤。</p>
    <p>北歐一份研究追蹤了 <strong>82 顆</strong>外傷後鈣化的恆門齒，追蹤 7 到 22 年、平均 16 年：最後一次檢查時 <strong>51%</strong> 電測反應正常，另外 <strong>40%</strong> 雖然電測沒反應，但臨床與 X 光都在正常範圍。整段追蹤期內真的出現根尖病灶的，只有 <a href="https://pubmed.ncbi.nlm.nih.gov/9198446/" target="_blank" rel="noopener">7 顆，<strong>8.5%</strong></a>。</p>

    <h2>哪些牙齒最常遇到</h2>
    <ul>
      <li><strong>上顎的兩顆門牙</strong>：外傷的第一受害者，也是根管閉鎖最典型的位置。外傷後的恆牙，<a href="https://www.scielo.br/j/bor/a/CRsJdZQnpWNmcXRy6VkdFXc/abstract/?lang=en" target="_blank" rel="noopener">約 27.6% 會出現根管閉鎖</a>。</li>
      <li><strong>上顎第一大臼齒的近心頰側根</strong>：那裡常常還藏著第二條根管，入口又細又偏，很容易被一層新生的牙本質蓋住。一份 CBCT 研究統計已經做過根管治療的牙齒，<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8257386/" target="_blank" rel="noopener">整體有 18% 漏掉了根管，其中上顎第一大臼齒高達 40.6%</a>；而在這些漏掉根管的牙齒裡，有 90% 併發了根尖周圍的發炎。這正是這一類牙齒值得在顯微鏡下多花時間的原因。</li>
      <li><strong>下顎大臼齒</strong>：髓腔原本就寬大，髓石最常在這裡被看見。</li>
      <li><strong>下顎門牙</strong>：本來就扁窄，舌側那一條容易被漏掉。</li>
      <li><strong>任何撞過、磨耗嚴重、補過大洞或做過牙套的牙齒</strong>：刺激是慢慢累積的。</li>
    </ul>

    <h2>台灣的數字，以及它為什麼看起來特別高</h2>
    <p>台灣北部一份 CBCT 研究看了 144 人、2,554 顆牙：<a href="https://www.sciencedirect.com/science/article/pii/S1991790217301289" target="_blank" rel="noopener">120 人（<strong>83.3%</strong>）至少有一顆牙有髓石</a>，牙齒層級則是 800 顆（31.3%）。臼齒最多，第一大臼齒 50.0%、第一小臼齒 18.8% 最少；<strong>補過的牙齒出現髓石的機率是沒補過的 2.1 倍，上顎更達 4.7 倍。</strong></p>
    <p>83.3% 看起來很嚇人。要拿它跟別的數字並排之前，得先知道有三件事會左右它：</p>
    <ul>
      <li><strong>用什麼影像看</strong>：電腦斷層看得到的，環口片看不到。</li>
      <li><strong>收了哪些年齡</strong>：年齡是最強的因子，納入的年齡層愈廣，數字就愈高。有些研究只收二十到四十歲、而且牙齒要完整的人，得到的數字就低很多。</li>
      <li><strong>有沒有把補過的牙排除掉</strong>：補過的牙本來就多 2.1 倍。</li>
    </ul>
    <p>所以各國的數字差到接近三倍，多半不是體質差異，是方法不同。不分族群的全球統合分析（16 篇研究、14,093 人）給的是 <a href="https://onlinelibrary.wiley.com/doi/10.1111/jebm.12331" target="_blank" rel="noopener">36.53%</a>，牙齒層級 9.57%。</p>

    <div class="callout">
      <p><b>這些數字都不是「需要治療的比例」。</b>髓石本身不會痛、沒有症狀，也不需要為了它做任何處理。它只有在那一顆牙真的要做根管治療的時候，才變成一個要繞過的障礙。在 X 光片上看到一顆髓石，不是一個要被解決的問題。</p>
    </div>

    <h2>第一個問題不是「怎麼打開」，是「要不要打開」</h2>
    <p>這一步最容易被跳過，卻是整件事裡最要緊的判斷。</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>這顆牙的狀況</th><th>通常的建議</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>鈣化，沒有症狀，X 光上根尖也乾淨</td>
            <td><strong>追蹤就好。</strong>每半年到一年拍一張根尖片。冷測沒反應是這種牙的常態，本身不構成治療的理由</td>
          </tr>
          <tr>
            <td>鈣化，牙冠變黃，在意外觀</td>
            <td>先考慮<strong>外漂白</strong>。不會為了顏色去做「預防性」的根管治療</td>
          </tr>
          <tr>
            <td>會自發性地痛、牙齦腫、長出竇道，或 X 光上根尖出現暗影</td>
            <td>這時候才依一般的根管治療流程介入</td>
          </tr>
          <tr>
            <td>鈣化，而且這顆牙即將做牙套或大範圍的假牙</td>
            <td>個別判斷。「反正以後可能會痛，不如先做掉」不是一個好理由</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>為什麼可以等？因為真正走到壞死的比例並不高——上一節那 82 顆追蹤 16 年，只有 8.5%。而<strong>一旦開始鑽，就回不去了</strong>：鈣化的牙齒剩下的齒質本來就比較少，為了找一條可能根本不需要打開的管子而磨掉一大塊，換來的是這顆牙日後更容易裂開。等待不是消極，是替你保留那一塊還撐得住咬合的齒質。</p>
    <p>一份整理了各國病例報告的系統性回顧，結論也是同一個方向：<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8625069/" target="_blank" rel="noopener">觀察等待是最常被採用的做法</a>；變色但沒有症狀的牙齒以外漂白處理，不應該把根管治療當成預防性的手段。</p>

    <h2>真的需要治療的時候，難在哪</h2>
    <p>也要老實講：這種牙確實比較難做。而且要說清楚一件事——<strong>下面這些風險，大多不是鈣化本身造成的，是「打開它」的過程造成的。</strong>這正是為什麼上一節要先問「要不要打開」。</p>
    <ul>
      <li><strong>找不到入口，就一直往深處鑽</strong>：磨掉的是牙頸部那一圈最關鍵的齒質，這顆牙日後容易從那裡裂開。</li>
      <li><strong>髓腔底已經被新生的牙本質墊高</strong>，仍照「正常深度」估算的話，會直接穿破髓腔底。破孔的位置愈靠近牙齦，日後愈麻煩。</li>
      <li><strong>細小的器械在鈣化的管子裡硬推</strong>：可能折斷在裡面，或者推出一條不通往根尖的假通道。</li>
      <li><strong>時間</strong>：光是找到一條鈣化的根管，即使在顯微鏡下也可能花掉將近一小時。所以這種牙的療程比較長、次數可能比較多，那不是拖延。</li>
    </ul>

    <h2>顯微鏡下是怎麼做的</h2>
    <ul>
      <li><strong>術前先看清楚</strong>：小範圍高解析的電腦斷層可以先回答幾個問題——整條管子都閉鎖了，還是只有靠近牙冠的那一段？根尖那三分之一還通不通（鈣化多半是從牙冠往根尖方向進行，根尖段常常還留著）？髓腔底還剩多厚？根分岔處的齒質夠不夠。這幾個答案會決定值不值得動、以及從哪個角度進去。</li>
      <li><strong>靠顏色找，不是靠猜</strong>：新生的鈣化牙本質偏白、不透光，原本的髓腔底比較暗。在高倍率與同軸光底下，那條深色的線就是路。這也是顯微鏡在這裡無可取代的地方——看得見顏色的差異，磨掉的齒質就少得多。</li>
      <li><strong>用超音波一層一層刮，不是一路鑽下去</strong>：在乾燥、看得見的狀態下，一次只去掉零點幾公釐，停下來重新評估。</li>
      <li><strong>事先設好停損點</strong>：從預期的髓腔底再往下超過兩三公釐仍然沒有進展，就停手、重新拍片定位，而不是繼續往下。<strong>願意停下來，是避免穿破最有效的一件事</strong>，而停下來保住的是你這顆牙的齒質。</li>
    </ul>
    <p>近年另外有一種「導引式」的做法：先用電腦斷層與口內掃描合成一條路徑，再用 3D 列印的導板或即時導航，把鑽針精準帶到還通著的那一段。<a href="https://link.springer.com/article/10.1007/s00784-023-04863-0" target="_blank" rel="noopener">2023 年一篇收了 45 篇研究的系統性回顧</a>指出，它在定位的準確度與保留齒質上都優於徒手。不過它需要額外的設備與流程，不是每一間診所都有，也不是每一顆鈣化的牙都需要——目前主要用在前牙那種整條閉鎖、徒手風險偏高的情況。遇到這種牙齒，醫師會把可以走的路與各自的代價說清楚，再一起決定。</p>
    <p>芳仁的顯微根管門診由受過牙髓病專科訓練的醫師看診。遇到鈣化的牙齒，順序是上面那張表：先判斷要不要打開；真的要打開，就在顯微鏡下慢慢來，並且事先講好停損點。如果評估下來這顆牙的條件超出這裡能處理的範圍，會直接說，而不是先開了再說。</p>

    <h2>治療之後，還有兩件事</h2>
    <ul>
      <li><strong>把牙齒保護起來</strong>：鈣化的牙齒剩下的齒質本來就少，根管治療做完通常需要能覆蓋牙尖的<a href="../../posts/crown-materials/">牙套</a>。反過來，為了放釘子（樁）而再把牙頸部那一圈挖掉，要特別謹慎——那一圈正是這顆牙最需要的部分。</li>
      <li><strong>追蹤</strong>：半年、一年、兩年各拍一次根尖片。曾經穿破、或原本就有根尖病灶的，追蹤期要再拉長。<strong>沒有打開、只是觀察的那些牙齒也一樣要回診拍片</strong>——變黃不必急，但根尖的暗影要能在早期被看見。</li>
    </ul>
    <p>至於怎麼避免走到這一步：鈣化跟年紀有關，擋不住；但蛀牙與磨耗造成的那一部分擋得住，而那要靠<a href="../../posts/regular-checkup/">定期檢查</a>在洞還小的時候就處理掉。愈晚被發現的蛀牙，牙髓被刺激得愈久，補牆也補得愈厚。</p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>醫師說我的牙齒「鈣化」了，嚴重嗎？</dt>
      <dd>多數時候不嚴重。牙齒中間那條管子一輩子都在慢慢變窄，這是正常的老化。鈣化本身不會痛、也不需要處理，它只有在那一顆牙真的要做根管治療時，才變成一個要繞過的障礙。</dd>

      <dt>小時候撞到的門牙變黃了，是不是已經死掉了？</dt>
      <dd>多半相反。外傷之後牙齒還在繼續製造牙本質、把根管填起來，代表那條神經還活著——壞死的牙髓不會蓋房子。牙冠變黃正是這個過程的外觀。追蹤 16 年的研究裡，這樣的牙齒後來真的出現根尖病灶的只有 8.5%。</dd>

      <dt>冷測沒反應，是不是就代表壞死？</dt>
      <dd>不是。鈣化過的牙齒對冷測或電測沒有反應是常態。要一起看的是會不會自發性地痛、牙齦有沒有腫、有沒有長出竇道，以及 X 光上根尖有沒有暗影。</dd>

      <dt>鈣化了就一定要先做根管治療嗎？</dt>
      <dd>不是。沒有症狀、根尖也乾淨的話，追蹤就好，每半年到一年拍一張根尖片。只在意顏色的話，先考慮外漂白，不會為了外觀去做預防性的根管治療。有自發痛、腫脹、竇道或根尖暗影，才依一般流程介入。</dd>

      <dt>為什麼這顆牙的療程特別久？</dt>
      <dd>因為入口被新生的牙本質蓋住了，光是找到一條鈣化的根管，在顯微鏡下都可能花掉將近一小時。而這種牙最大的風險其實來自「打開它的過程」——鑽太深會穿破髓腔底、磨太多會讓牙齒日後裂開。所以慢，是為了少磨掉一點。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，不能取代臨床診斷。文中的盛行率與追蹤數字來自國外與國內的研究，個別條件不同，結果因人而異。一顆鈣化的牙齒該追蹤還是該治療、適不適合處理、需要分幾次完成，都要經醫師檢查並搭配 X 光等影像評估後判斷。</p>

`; }

/* ── ⑤ 文末導覽：同層連結會指到 preview/ 底下，一律改成絕對深度 ── */
swap('        <a class="btn btn-ghost" href="../orthodontics/">&larr; 上一篇：牙齒矯正</a>\n' +
     '        <a class="btn" href="../crown-materials/">下一篇：一體成型的假牙好在哪 &rarr;</a>\n',
     '        <a class="btn btn-ghost" href="../../posts/bioceramic/">&larr; 根管治療的生物陶瓷</a>\n' +
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
  ['根管鈣化：牙齒自己把管子封起來', '標題沒換到'],
  ['theme-toggle', '夜間模式的開關被切掉了'],
  ['重點整理', '重點整理不見了'],
  ['class="note"', '免責段落不見了'],
];
for (const [s, msg] of must) if (!out.includes(s)) throw new Error(msg);
const banned = [
  ['data-views-self', '計數器沒拿掉：每開一次預覽就會 POST +1'],
  ['SEO:START', 'SEO 區塊沒拿掉：canonical／og:url 會指向還不存在的網址'],
  ['RELATED:START', 'RELATED 區塊沒拿掉'],
  ['post-updated-line', '「最後更新」那一行沒拿掉：草稿沒有上線日期'],
  ['生物陶瓷：它多做了什麼 —', '舊標題殘留'],
  ['hero-bioceramic-photo', '舊的 HERO 圖殘留'],
];
for (const [s, msg] of banned) if (out.includes(s)) throw new Error(msg);
if (/href="\.\.\/(?!\.\/)[a-z]/.test(out)) throw new Error('還有同層的 ../<資料夾>/ 連結');

const dest = resolve(root, 'preview/pulp-calcification/index.html');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out);
console.log('寫好了：preview/pulp-calcification/index.html　' + out.length + ' 字元');
