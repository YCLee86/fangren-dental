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

const TITLE = '根管鈣化：要做根管治療、抽神經，卻找不到那條神經';
const DESC  = '「這顆牙要做根管治療，不過它鈣化了。」需要根管治療的牙齒往往正是被刺激很久的那一顆，兩件事是同一個原因的兩個結果。根管鈣化怎麼辦：這一次的療程會多出什麼、顯微鏡下實際在做什麼，以及過程中真的出狀況了怎麼處理。';
const OGDESC = '鈣化會讓這一次的根管治療多出什麼、顯微鏡下實際在做什麼，以及過程中真的出狀況了怎麼處理。';

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
  "excerpt": "「這顆牙要做根管治療。」然後醫師又補了一句：「不過它鈣化了。」這一篇講的就是這個處境——為什麼偏偏是要治療的這一顆鈣化、這一次會多出什麼、顯微鏡下實際在做什麼，以及過程中真的出了狀況該怎麼處理。",
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

function BODY() { return `    <p class="lede">「這顆牙要做根管治療。」然後醫師看著 X 光片又補了一句：「不過它鈣化了。」——或者療程已經開始，你在診療椅上躺了很久，最後聽到的是「今天先到這裡」。這一篇講的就是這個處境：<strong>這顆牙很可能要、或者已經確定要做根管治療，偏偏那條神經已經被塞住了，接下來會怎麼處理。</strong></p>

    <h2>為什麼偏偏是要治療的這一顆鈣化了</h2>
    <p>這不是巧合，也不是運氣特別差。</p>
    <p>牙髓受到刺激的時候，反應就是在受刺激的那一側加速補上一層新的牙本質，把自己和外界隔開——這是牙齒的防衛動作。而會需要根管治療的牙齒，幾乎都是被刺激了很久的牙齒：蛀得很深、磨耗嚴重、補過大洞或做過牙套、撞擊過，或者以前抽過神經、幾年後又發炎。<strong>「需要根管治療」和「鈣化」不是兩件事，是同一個原因的兩個結果。</strong></p>
    <p>台灣北部一份 CBCT 研究看得到這件事：<a href="https://www.sciencedirect.com/science/article/pii/S1991790217301289" target="_blank" rel="noopener">補過的牙齒出現髓石的機率是沒補過的 2.1 倍，上顎更達 4.7 倍</a>；144 人裡有 120 人（83.3%）至少有一顆牙有髓石，其中臼齒最多，第一大臼齒 50.0%。</p>
    <p>所以醫師說「這顆鈣化了」，多半不是一個突然冒出來的壞消息，而是這顆牙長年狀況的結果。</p>

    <h2>鈣化分三種，成因不一樣，但都讓治療變難</h2>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>說法</th><th>X 光上長什麼樣</th><th>它讓治療難在哪</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>髓石</strong></td>
            <td>牙髓腔裡有一顆或數顆界線清楚的硬塊，像管子裡卡了小石頭</td>
            <td>擋住入口、卡住器械。要先在顯微鏡下把它移開，才進得到底下的根管</td>
          </tr>
          <tr>
            <td><strong>瀰漫性鈣化</strong></td>
            <td>沒有具體形狀，整片牙髓腔變得模糊，像結了一層霧</td>
            <td>入口與管壁的界線變模糊，找入口與判斷角度都要多花時間</td>
          </tr>
          <tr>
            <td><strong>根管閉鎖</strong></td>
            <td>硬組織沿著管壁往中間長，整條管子逐漸消失，牙冠跟著變黃</td>
            <td>真正「找不到根管」的那一種，難度最高。這一篇後半講的就是它</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>還有一件事會影響難度：<strong>鈣化可以發生在任何一段</strong>——靠近牙冠的入口、根管的中段，或是接近根尖的末端。位置不同，難的地方也不同：卡在入口的是「找不到門」，卡在中段與末端的是「進得去、卻到不了底」。</p>

    <h2>根管鈣化怎麼辦</h2>
    <ul>
      <li><strong>時間</strong>：光是找到一條鈣化的根管，即使在顯微鏡下也可能花掉將近一小時。這顆牙的約診會比一般的根管治療長。</li>
      <li><strong>次數</strong>：療程可能要分比較多次。中間的等待不是拖延，是每一次只推進能安全推進的那一段。</li>
      <li><strong>術前的影像</strong>：一般的根尖片不一定夠。小範圍高解析的電腦斷層可以先回答四個問題——整條都閉鎖了還是只有冠側那一段？根尖那三分之一還通不通？髓腔底還剩多厚？根分岔處的齒質夠不夠。這四個答案會決定要不要動、從哪個角度進去、以及該不該一開始就改用別的做法。</li>
      <li><strong>把所有的神經都找出來</strong>：鈣化最常蓋住的就是那些本來就細、本來就偏的入口。一份 CBCT 研究統計已經做過根管治療的牙齒，<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8257386/" target="_blank" rel="noopener">整體有 18% 漏掉了根管，上顎第一大臼齒高達 40.6%</a>；而在這些漏掉根管的牙齒裡，有 90% 併發了根尖周圍的發炎。多花的那一小時，換的就是這件事。</li>
      <li><strong>費用與次數</strong>：會在治療計畫確定的時候，連同要用到哪些材料一併說明。</li>
    </ul>

    <h2>顯微鏡下實際在做什麼</h2>
    <ul>
      <li><strong>靠顏色找，不是靠猜</strong>：新生的鈣化牙本質偏白、不透光，原本的髓腔底比較暗。在高倍率與同軸光底下，跟著那條比較暗的線找。這是顯微鏡在這裡無可取代的地方——看得見顏色的差異，磨掉的齒質就少得多。</li>
      <li><strong>用超音波一層一層刮，不是一次鑽到底</strong>：在乾燥、看得見的狀態下，一次只去掉零點幾公釐，停下來重新評估。</li>
      <li><strong>找到疑似的入口之後要雙重確認</strong>：用細小的手用器械探，再用根尖定位器與 X 光片各驗一次，確定進的是真正的管腔，而不是一條磨出來的假通道。</li>
      <li><strong>事先設好停損點</strong>：從預期的髓腔底再往下超過兩三公釐仍然沒有進展，就停手、重新拍片定位，而不是繼續往下。<strong>願意停下來，是避免穿破最有效的一件事</strong>；停下來保住的，是你這顆牙剩下的齒質。</li>
    </ul>

    <h2>過程中可能遇到的狀況，遇到了怎麼辦</h2>
    <p>要老實說：這種牙確實比較容易出狀況。而且有一件事值得講明白——<strong>下面這些風險大多不是鈣化本身造成的，是「打開它」的過程造成的。</strong>這也是為什麼停損點要事先講好。</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th>狀況</th><th>怎麼發生的</th><th>接下來怎麼處理</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>髓腔底或根管壁破孔</strong></td>
            <td>髓腔底已經被新生的牙本質墊高，仍照「正常深度」估算就會穿破</td>
            <td>用<a href="../../posts/bioceramic/">生物陶瓷</a>把洞補起來，讓根管內部和外面的牙周組織重新隔開。</td>
          </tr>
          <tr>
            <td><strong>器械斷在裡面</strong></td>
            <td>細小的器械在還沒開通的鈣化管裡硬推</td>
            <td>依位置決定：在顯微鏡下取出、從旁邊繞過去，或留在原處長期追蹤。</td>
          </tr>
          <tr>
            <td><strong>磨掉太多齒質</strong></td>
            <td>找不到入口就一直往深處鑽</td>
            <td>被磨掉的是牙頸部那一圈最關鍵的齒質，這顆牙日後容易從那裡裂開。所以治療完成後的牙套設計要一起考慮進去</td>
          </tr>
          <tr>
            <td><strong>找了很久仍然沒進展</strong></td>
            <td>閉鎖的程度超出術前影像看到的</td>
            <td>照事先講好的停損點停下來，重新拍片定位、改期，或和你討論接下來怎麼做。<strong>停下來不是放棄，是不要為了今天做完而讓這顆牙以後撐不住</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>這些狀況不代表醫師不認真——鈣化的牙齒本來就難。真正能事先做的，是把影像看清楚、把停損點與備案在動手之前就講好。</p>

    <h2>芳仁牙醫的顯微根管專科怎麼做</h2>
    <p>芳仁的顯微根管門診由受過牙髓病專科訓練的醫師看診，根尖手術也在同一個門診處理。遇到鈣化的牙齒，順序是：先用影像判斷值不值得從牙冠這一側進去、講好要花多久與停損點，再開始；如果評估下來這顆牙的條件超出這裡能處理的範圍，會直接說，而不是先開了再說。</p>
    <p>另外有一種「導引式開髓」——先用電腦斷層與口內掃描算出鑽針該進去的角度與深度，再用 3D 列印的導板把它帶到定位。它需要額外的設備與流程，不是每一間診所都有，也不是每一顆鈣化的牙都用得上。真的需要的時候，醫師會把可以做的與各自的代價說清楚，再一起決定。</p>

    <h2>治療完成之後</h2>
    <ul>
      <li><strong>把牙齒保護起來</strong>：鈣化的牙齒剩下的齒質本來就少，療程結束後通常需要能覆蓋牙尖的<a href="../../posts/crown-materials/">牙套</a>。反過來，為了放釘子（樁）而再把牙頸部那一圈挖掉要特別謹慎——那一圈正是這顆牙最需要的部分。</li>
      <li><strong>追蹤</strong>：半年、一年、兩年各拍一次根尖片。曾經穿破、或原本就有根尖病灶的，追蹤期要再拉長；破孔的那一處還要加測牙周的狀況。</li>
      <li><strong>剛做完有點酸痛是正常的</strong>：那是治療之後組織的正常反應，多半會在幾天之內慢慢消退。<strong>不要一直刻意去咬那顆牙測試</strong>——每咬一次，就刺激一次正在修復的根尖組織，酸痛反而會拖得更久。想知道它好了沒有，回診讓醫師檢查會比自己咬看看準確。</li>
    </ul>
    <p>至於怎麼避免再來一次：鈣化跟年紀有關，擋不住；但蛀牙與磨耗造成的那一部分擋得住，而那要靠<a href="../../posts/regular-checkup/">定期檢查</a>在洞還小的時候就處理掉。愈晚被發現的蛀牙，牙髓被刺激得愈久，補牆也補得愈厚——等到需要根管治療的時候，管子也就愈難找。</p>

    <h2>重點整理</h2>
    <dl class="keypoints">
      <dt>醫師說「這顆要做根管治療，但它鈣化了」，是什麼意思？</dt>
      <dd>意思是該清乾淨的那條管子已經被新生的牙本質填住了一段，入口不容易找、器械不容易進。它不會改變「這顆牙需要治療」這件事，改變的是這一次要花多久、分幾次，以及萬一打不通時接下來怎麼處理。</dd>

      <dt>為什麼偏偏是這一顆？</dt>
      <dd>不是運氣差。牙髓受到刺激時的反應就是往內補上一層新的牙本質，而會需要根管治療的牙齒，幾乎都是被刺激很久的牙齒——深蛀、磨耗、補過大洞或做過牙套、撞擊過。「需要根管治療」和「鈣化」是同一個原因的兩個結果。補過的牙出現髓石的機率是沒補過的 2.1 倍。</dd>

      <dt>如果入口真的找不到怎麼辦？</dt>
      <dd>醫師會照事先講好的停損點停下來，重新拍片評估，再和你討論接下來怎麼做——而不是繼續往下鑽。硬做下去的代價是磨掉牙頸部那一圈最關鍵的齒質，這顆牙日後反而更容易裂開。</dd>

      <dt>治療中萬一穿破、或器械斷在裡面？</dt>
      <dd>破孔可以用生物陶瓷補起來，愈早補預後愈好。斷掉的器械依位置決定取出、繞過或留置追蹤。要強調的是：這些風險大多來自「打開它」的過程，所以事先講好停損點——找了一段時間沒進展就停下來重新評估——比事後處理更要緊。</dd>

      <dt>那如果我的牙齒只是鈣化、沒有症狀呢？</dt>
      <dd>那就不是這一篇講的情況。沒有症狀、根尖也乾淨的話追蹤就好，每半年到一年拍一張根尖片；只在意牙齒變黃的話，先考慮外漂白，不會為了外觀去做預防性的根管治療。</dd>
    </dl>

    <p class="note">本文為一般口腔衛教資訊，不能取代臨床診斷。文中的盛行率與追蹤數字來自國內外的研究，個別條件不同，結果因人而異。一顆鈣化的牙齒該從哪一側處理、需要哪些影像、要分幾次完成，以及萬一打不通時接下來怎麼處理，都要經醫師檢查並搭配 X 光等影像評估後判斷。</p>

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
/* ⚠⚠ 守門：比喻的「路／走」不可以撐起整篇（2026-09-21 使用者當面指出）
   -----------------------------------------------------------------
   第二版被退回一次：「為什麼文章一直會出現 怎麼走 哪一條路 完全不一樣的路
   這種字眼」。去數才發現 4,027 字裡「路」16 次、「走」17 次 ——
   成因是把整篇的骨架訂成一個空間比喻（「打不通的時候還有哪些路」），
   骨架是比喻，每一段就都會回到那個字。
   ⚠ 字面的那一組**留著**：打得通／打不通／還通著／開通／假通道 ——
     根管確實有通不通這回事，那是這個題目的真實字彙，不是比喻。
   ⚠ 只掃內文（lede 到 post-foot 之間）—— 掃整頁會撞到這段說明自己
     （CLAUDE.md 第九節第 4 條，已經踩到第十六次）。 */
{
  const b0 = out.indexOf('    <p class="lede">');
  const b1 = out.indexOf('    <div class="post-foot">');
  const body = out.slice(b0, b1).replace(/<[^>]*>/g, '');
  const road = (body.match(/路/g) || []).length;
  const walk = (body.match(/走/g) || []).length;
  const dir  = (body.match(/方向/g) || []).length;
  if (road + walk + dir > 3) {
    throw new Error('比喻的「路／走／方向」又長回來了：路 ' + road +
      '、走 ' + walk + '、方向 ' + dir + '（上限 3）—— 換成具體的名詞' +
      '（做法／入口／從另一側／角度與深度）');
  }
  console.log('　守門：內文 ' + body.replace(/\s/g, '').length +
    ' 字，路 ' + road + '、走 ' + walk + '、方向 ' + dir + '（上限 3）');
}

const must = [
  ['noindex', 'noindex 不見了'],
  ['根管鈣化：要做根管治療', '標題沒換到'],
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
