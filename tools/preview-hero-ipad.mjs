/* 一次性腳本：從 index.html 產生 preview/hero-ipad-fullbleed/index.html
   （iPad／直立螢幕的 HERO 照片要多大 —— 提案頁）

   定案上線後這支腳本和提案頁一起刪掉，推導文字搬進 history/。
   index.html 改過之後要重新產一次：node tools/preview-hero-ipad.mjs
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUTDIR = path.join(ROOT, 'preview/hero-ipad-fullbleed');
let h = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---- 1. 相對路徑往上兩層。絕對網址（og:image、JSON-LD）一個都不能動 ---- */
h = h.replace(/="assets\//g, '="../../assets/').replace(/, assets\//g, ', ../../assets/');

/* ---- 2. robots 換成 noindex ---- */
h = h.replace(/<meta name="robots" content="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');

/* ---- 3. 計數器整支拿掉，窄帶的數字寫死並手動加 .is-on ----
   不拿掉的話每開一次提案頁，首頁的真實計數就多一次。
   ⚠ 這個假數字絕對不要跟著版型搬回正式站（2026-08-07 踩過）。 */
h = h.replace(/\s*<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, '');
h = h.replace('<p class="band-views" data-views-self="home">', '<p class="band-views is-on">');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">1275</span>');

h = h.replace(/<title>[^<]*<\/title>/, '<title>提案：iPad 的 HERO 照片要多大 — 芳仁牙醫診所</title>');

/* 窄帶接縫的漸層：和正式站同一條曲線 S(t^1.6)，只換起點的顏色。 */
function ramp(seamHex, endHex = '#2d3037') {
  const rgb = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r0, g0, b0] = rgb(seamHex), [r1, g1, b1] = rgb(endHex);
  const stops = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, u = Math.pow(t, 1.6), s = 3 * u * u - 2 * u * u * u;
    const c = [r0 + (r1 - r0) * s, g0 + (g1 - g0) * s, b0 + (b1 - b0) * s]
      .map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    stops.push(`#${c} ${(t * 100).toFixed(0)}%`);
  }
  return `linear-gradient(180deg, ${stops.join(', ')})`;
}

const HEADNOTE = `
<!-- ==========================================================================
     提案：iPad／直立螢幕的 HERO 照片要多大（2026-08-15）
     --------------------------------------------------------------------------
     使用者：「iPad 版也有類似的問題。」—— 同一天手機版剛把照片從一屏的 34%
     改成 85% 並上線（/history/hero-mobile-fullbleed.html）。

     ---- 一、現況：兩個分支都留了一大塊紙色在第一屏 ----------------------
     這一站的平板有兩段 @media，一台 iPad 只會落在其中一段：

       A. iPad 直放（min-width 721 ＋ 比例 (2/3, 9/10]）　照片 70svh、窄帶接在下面
       B. 直立螢幕（min-width 721 ＋ 比例 ≤ 2/3）　　　　照片 62svh、窄帶壓在照片下緣

     ⚠ **iPad mini 直放（744×1133 ＝ 0.657）其實落在 B**，不是 A —— 比例比 2/3
        還瘦。所以最小的那台 iPad 反而套到最小的照片。

     實測（第一屏底下露出多少紙色）：

         裝置                    比例   分支  照片        HERO 收在   露出紙色
         iPad mini 744×1133     0.657   B    702px 62%   702px       431px（38%）
         iPad 9.7 768×1024      0.750   A    717px 70%   843px       181px（18%）
         iPad Air 820×1180      0.695   A    826px 70%   952px       228px（19%）
         iPad Pro 11 834×1194   0.698   A    836px 70%   962px       232px（19%）
         iPad Pro 12.9 1024×1366 0.750  A    956px 70%  1083px       283px（21%）

     和手機那一輪同一句話：**問題不在照片，在框的高度。**

     ---- 二、詩在 iPad 上其實是對的，不要順手改 --------------------------
     頁首下緣到詩第一行 ink 上緣的空隙 ÷ 詩的字高：

         電腦 1440　　　　6.00
         iPad 直放　　　　6.36（各尺寸都一樣，見下面）
         手機（改動前）　 1.02　← 手機那一輪要修的就是這個

     iPad 這一格本來就對，因為 .hero-copy 的 padding-top 是
     \`calc(var(--head-h) + clamp(2.6rem, 9vh, 5.4rem))\`，在所有 iPad 上都
     **撞到 5.4rem 的上限 ＝ 86.4px**，所以空隙固定 95.4px。
     ⚠ 照片一拉高，空隙的絕對值不變、但**佔照片的比例會從 11.4% 掉到 8.9%**
        （電腦版是 10.0%）。所以「位置」那把尺是給這個用的，不是因為現在有問題。
     ⚠ 字級同理：iPad 是 \`clamp(15px, 1.15svh, 24px)\`，1194 高上 1.15svh 只有
        13.7px，**永遠撞在 15px 的下限**。照片變大之後字相對變小
        （15/1068 ＝ 1.40%，電腦版是 1.67%），所以有「字級」那把尺。

     ---- 三、裁切：拉高只往左右裁，上下一列都不會少 ----------------------
     和手機那一輪同一件事（cover 的倍率由高度那一項決定）：

         照片高    倍率    看得到原圖寬       等效
         836px     0.79    1055px (66%)       現況 70svh（iPad Pro 11）
         955px     0.90     924px (58%)       八成
         1068px    1.01     826px (52%)       抵下緣
         1194px    1.13     739px (46%)       整屏

     ⚠⚠ **iPad 是這一輪唯一會踩到「照片不夠大」的版型。** 原圖是 1600×1058，
        抵下緣在 iPad Pro 12.9 上要 1240px 高 ＝ **放大 1.17 倍**，而 iPad 的
        DPR 是 2，等於用 1058 列去填 2480 個實體像素。現況（956px、0.90 倍）
        本來就已經在放大（DPR 2 → 1.81 倍），這一輪會變成 2.34 倍。
        夜景照片糊得不明顯，但**如果使用者手上有更大的原檔，換一張 2400px 寬的
        進來是這一輪唯一「花錢就能解決」的品質問題**。
        （手機不受影響：390×844 只要 719px 高 ＝ 0.68 倍。）

     ---- 四、窄帶接縫：這一輪**不用動** ----------------------------------
     手機那一輪要把起點色從 #151311 換成 #181614，是因為手機沒有柏油層、
     接縫直接吃照片的像素。A 段有柏油層，而且它在最後 24% 已經收到 alpha 1 ——
     接縫色由柏油層自己決定。實測（照片最後一列的中位數，含兩層）：
     834×1194／1024×1366／768×1024 × 現況／抵下緣 六組全部都是 **#161413**，
     一個位元都沒變。B（窄帶壓在照片上）本來就沒有接縫，和電腦版一樣。

     ---- 五、切換條 ------------------------------------------------------
     照片　現況 ｜ 八成 80svh ｜ 抵下緣 ｜ 整屏
           A 的「抵下緣」＝ .hero 直向 flex ＋ 100svh，照片 flex:1（窄帶接在下面）
           B 的「抵下緣」＝ 照片 100svh（窄帶本來就壓在照片上，兩者已經一屏）
           所以 B 的「抵下緣」和「整屏」是同一件事。
     裁切　置中（＝現況）｜ 偏右一階
     詩·低　現況（固定 86.4px）｜ .100×照片高 ｜ .115×照片高
     詩·大　現況（15px 下限）｜ .0155×照片高 ｜ .0170×照片高

     ---- 六、建議 --------------------------------------------------------
     **抵下緣 ＋ 置中 ＋ 詩·低② ＋ 詩·大③**。
     照片＋窄帶正好一屏，和手機、電腦版三邊同一個做法。詩·大③ 是唯一同時對上
     電腦版兩個比值的一格：字÷照片 1.70%（電腦版 1.67%）、空隙÷照片 11.0%
     （電腦版 10.0%）、空隙÷字高 6.49（電腦版 6.00）。iPad Pro 11 上詩 18.2px。
     只想動照片的話，「抵下緣 ＋ 詩兩把尺都維持現況」也完全成立 ——
     那一組的空隙比仍然是 6.36，只是詩相對照片小一點。

     ---- 定案要帶進 index.html 的東西（別漏）-----------------------------
     1. 窄帶那個假數字 1275 與 .is-on 不要帶。
     2. data-* 與整條切換條刪掉，選上那一組的值寫死進兩段平板 @media。
     3. A 段要新增 \`.hero { display:flex; flex-direction:column; height:100svh }\`
        ＋ \`.hero-photo { height:auto; flex:1 1 auto; min-height:0 }\`；
        B 段只要把 62svh 改成 100svh。
     4. --ph 在正式站寫成純 CSS：A 段 calc(100svh - 126px)、B 段 100svh。
     5. 「往下看」的角形在 A 段是關著的（bottom:100% 會落進接縫裡），
        照片變高之後那個理由沒有變，維持關著。
     ========================================================================== -->
`;

const BAR = `
<!-- ==========================================================================
     切換條（提案用，定案後連同 data-* 屬性一起刪掉）
     ========================================================================== -->
<style>
/* ---- A：iPad 直放（窄帶接在照片下面）------------------------------------ */
@media (min-width: 721px) and (min-aspect-ratio: 2 / 3) and (max-aspect-ratio: 9 / 10) {
  html[data-h="h80"] .hero-photo { height: 80svh; }
  html[data-h="fit"] .hero { display: flex; flex-direction: column; height: 100svh; }
  html[data-h="fit"] .hero-photo { height: auto; flex: 1 1 auto; min-height: 0; }
  html[data-h="full"] .hero-photo { height: 100svh; }

  /* --ph ＝ 照片高度。窄帶在這一段實測 126px。 */
  html[data-h="now"]  { --ph: 70svh; }
  html[data-h="h80"]  { --ph: 80svh; }
  html[data-h="fit"]  { --ph: calc(100svh - 126px); }
  html[data-h="full"] { --ph: 100svh; }

  /* 接縫：**這一段不必改**。柏油層在最後 24% 已經收到 alpha 1，接縫色由柏油層
     自己決定、對裁切完全不敏感 —— 三個尺寸 × 現況／抵下緣，照片最後一列的
     中位數量下來都是 #161413，一個位元都沒變。手機那一輪要換起點色，是因為
     手機沒有柏油層、接縫直接吃照片的像素。 */
}
/* ---- B：直立螢幕／iPad mini 直放（窄帶壓在照片下緣）--------------------- */
@media (min-width: 721px) and (max-aspect-ratio: 2 / 3) {
  html[data-h="h80"] .hero-photo { height: 80svh; }
  html[data-h="fit"] .hero-photo,
  html[data-h="full"] .hero-photo { height: 100svh; }

  html[data-h="now"]  { --ph: 62svh; }
  html[data-h="h80"]  { --ph: 80svh; }
  html[data-h="fit"]  { --ph: 100svh; }
  html[data-h="full"] { --ph: 100svh; }

  /* ---- 順便發現的破圖（和照片高度無關，現在線上就有）--------------------
     這一段的窄帶沿用電腦版：地址電話絕對定位貼在版心外緣、和 1983／9／5 同一列。
     電腦版 1440 上剛好差 −2.6px 不會撞，但這一段的視窗只有 721~900 寬，
     實測**撞在一起**：
         744×1133（iPad mini 直放）  水平重疊 92.9px、垂直重疊 32.7px
         900×1600（旋轉螢幕）        水平重疊 19.6px、垂直重疊 32.6px
     修法直接抄 A 段（iPad 直放）：地址電話改成 static、一行置中，
     自然落在瀏覽數與三格之間。⚠ 選擇器要寫 body .contact-pair（0,1,1）——
     ≤1159 那段「退成兩行」就是這個權重，只寫 .contact-pair 會被它蓋掉。 */
  html[data-band="fix"] body .contact-pair {
    position: static;
    flex-direction: row; align-items: center; gap: 1.9rem;
  }
  html[data-band="fix"] .hero-contact a { gap: .45rem; }
  html[data-band="fix"] .hero-contact .ico { flex: 0 0 auto; }
  html[data-band="fix"] .band .shell { gap: .8rem; padding-block: 1rem; }
  /* 窄帶多長一列，收尾句要跟著讓開。這一段的窄帶是壓在照片上的，
     .hero-copy 的 padding-bottom 本來就是 calc(var(--band-h) + clamp(1rem,3vh,2rem))，
     所以只要把 --band-h 從 84px 換成量到的 126px，讓開的量自己會跟上
     —— 不寫死 padding，日後窄帶再變高也不會又蓋住。
     ⚠ 不改的話收尾句會被窄帶蓋掉 9px（744×1133 實測）。 */
  html[data-band="fix"] { --band-h: 126px; }
}
/* ---- 詩：兩段共用（只有 ≥721 的直式螢幕吃得到）-------------------------- */
@media (min-width: 721px) and (max-aspect-ratio: 9 / 10) {
  html[data-pos="p2"] .hero-copy { padding-top: calc(var(--head-h) + var(--ph) * .100); }
  html[data-pos="p3"] .hero-copy { padding-top: calc(var(--head-h) + var(--ph) * .115); }

  html[data-size="s2"] { --hero-fs: clamp(15px, calc(var(--ph) * .0155), 22px); }
  html[data-size="s3"] { --hero-fs: clamp(15px, calc(var(--ph) * .0170), 24px); }
}
/* 切換條自己 */
#sw { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(20, 19, 18, .93); color: #e8e6e2; padding: 8px 10px 10px;
  font: 13px/1.35 -apple-system, "Noto Sans TC", sans-serif;
  backdrop-filter: blur(8px); box-shadow: 0 -1px 0 rgba(255, 255, 255, .12); }
#sw .r { display: flex; align-items: center; gap: 5px; margin: 4px 0; }
#sw .r > b { flex: 0 0 4.2em; font-weight: 600; opacity: .72; font-size: 12px; }
#sw button { flex: 1 1 auto; min-width: 0; appearance: none; border: 1px solid rgba(255,255,255,.28);
  background: transparent; color: inherit; border-radius: 8px; padding: 7px 4px;
  font: inherit; font-size: 12.5px; }
#sw button[aria-pressed="true"] { background: #e8e6e2; color: #191614; border-color: #e8e6e2; font-weight: 700; }
#sw .m { font-size: 11.5px; opacity: .64; margin: 6px 0 0; white-space: pre-line;
  font-variant-numeric: tabular-nums; }
#sw .x { position: absolute; right: 8px; top: -34px; background: rgba(20,19,18,.93);
  border: 0; color: #e8e6e2; border-radius: 8px; padding: 6px 11px; font: inherit; }
#sw .more { width: 100%; margin-top: 6px; border-style: dashed; }
#swn { max-height: 46svh; overflow: auto; margin-top: 7px; padding-top: 7px;
  border-top: 1px solid rgba(255,255,255,.18); font-size: 12.5px; line-height: 1.65; }
#swn p { margin: 0 0 .7em; }
#swn table { width: 100%; border-collapse: collapse; margin: 0 0 .8em; font-size: 11.5px;
  font-variant-numeric: tabular-nums; }
#swn th, #swn td { border: 1px solid rgba(255,255,255,.16); padding: 3px 4px; text-align: center; }
#swn td:first-child, #swn th:first-child { text-align: left; white-space: nowrap; }
#swn th { font-weight: 600; opacity: .8; font-size: 10.5px; line-height: 1.25; }
#swn tr.win { background: rgba(255,255,255,.12); font-weight: 700; }
body { padding-bottom: 210px; }
</style>

<div id="sw">
  <button class="x" type="button" data-x>收起</button>
  <div class="r" data-k="h"><b>照片</b>
    <button type="button" data-v="now">現況</button><button type="button" data-v="h80">八成</button><button type="button" data-v="fit">抵下緣</button><button type="button" data-v="full">整屏</button></div>
  <div class="r" data-k="crop"><b>裁切</b>
    <button type="button" data-v="mid">置中</button><button type="button" data-v="right">偏右一階</button></div>
  <div class="r" data-k="band"><b>窄帶</b>
    <button type="button" data-v="now">現況</button><button type="button" data-v="fix">修掉重疊</button></div>
  <div class="r" data-k="pos"><b>詩·低</b>
    <button type="button" data-v="p1">現況</button><button type="button" data-v="p2">②</button><button type="button" data-v="p3">③</button></div>
  <div class="r" data-k="size"><b>詩·大</b>
    <button type="button" data-v="s1">現況</button><button type="button" data-v="s2">②</button><button type="button" data-v="s3">③</button></div>
  <p class="m" id="swm"></p>
  <button class="more" type="button" data-more>評分與建議 ▾</button>
  <div id="swn" hidden>
    <p><b>結論：建議「抵下緣 ＋ 置中 ＋ 詩·低② ＋ 詩·大③」</b>（這一頁打開就是它）。
      照片＋窄帶正好一屏 —— 和手機（今天上線）、電腦版三邊同一個做法。
      只想動照片的話，「抵下緣 ＋ 詩兩把尺都維持現況」也完全成立。</p>
    <table>
      <tr><th>裝置</th><th>比例</th><th>分支</th><th>現在照片</th><th>第一屏<br>露出紙色</th><th>抵下緣<br>之後</th></tr>
      <tr><td>iPad mini 744×1133</td><td>0.657</td><td>B</td><td>702px 62%</td><td>431px 38%</td><td>1133px</td></tr>
      <tr><td>iPad 9.7 768×1024</td><td>0.750</td><td>A</td><td>717px 70%</td><td>181px 18%</td><td>898px</td></tr>
      <tr><td>iPad Air 820×1180</td><td>0.695</td><td>A</td><td>826px 70%</td><td>228px 19%</td><td>1054px</td></tr>
      <tr class="win"><td>iPad Pro 11 834×1194</td><td>0.698</td><td>A</td><td>836px 70%</td><td>232px 19%</td><td>1068px</td></tr>
      <tr><td>iPad Pro 12.9 1024×1366</td><td>0.750</td><td>A</td><td>956px 70%</td><td>283px 21%</td><td>1240px</td></tr>
    </table>
    <p><b>iPad mini 其實吃到另一段。</b>它的比例 0.657 比 2/3 還瘦，落在「直立螢幕」
      那一段（62svh、窄帶壓在照片上），所以最小的那台 iPad 反而照片最小、
      底下露出最多紙色（38%）。這一輪兩段一起改。</p>
    <p><b>詩在 iPad 上本來就是對的。</b>空隙 ÷ 字高 ＝ 6.36（電腦版 6.00），
      不像手機改動前只有 1.02。但照片一拉高，空隙佔照片的比例會從 11.4% 掉到
      8.9%（電腦版 10.0%），字也相對變小（1.41%，電腦版 1.67%）——
      兩把尺是為了補回這個，不是因為現在有問題。
      建議那一組（低②＋大③）把兩個比值都拉回電腦版：空隙 11.0%、字 1.70%。
      <b>只想動照片、詩兩把尺都按「現況」也完全成立</b> —— 那一組的空隙÷字高
      仍然是 6.36，只是詩相對照片小一點。</p>
    <p><b>⚠ 這一輪唯一的品質代價：照片不夠大。</b>原圖 1600×1058，抵下緣在
      iPad Pro 12.9 上要 1240px 高 ＝ 放大 1.17 倍，而 iPad 是 DPR 2，
      等於用 1058 列填 2480 個實體像素。現況本來就已經在放大（1.81 倍），
      這一輪會變成 2.34 倍。夜景糊得不明顯，但<b>如果手邊有更大的原檔，
      換一張 2400px 寬的進來，是這一輪唯一能靠素材解決的問題</b>。
      手機不受影響（719px 高 ＝ 0.68 倍，還在縮小）。</p>
    <p><b>⚠ 順便發現一個破圖，和照片高度無關、現在線上就有。</b>
      「直立螢幕」那一段（iPad mini 直放、旋轉螢幕）的窄帶沿用電腦版：地址電話
      絕對定位貼在版心外緣、和 1983／9／5 同一列。電腦版 1440 上剛好差 −2.6px
      不會撞，但這一段的視窗只有 721~900 寬 —— 實測 744×1133 水平重疊
      <b>92.9px</b>、900×1600 重疊 19.6px，「部定專科」直接被電話蓋住。
      「窄帶」那把尺可以切換看。修法是直接抄 iPad 直放那一段：地址電話改成
      一行置中，落在瀏覽數與三格之間。<b>這一頁預設是修好的</b>，
      要看線上的樣子請按「現況」。</p>
    <p><b>窄帶接縫這一輪不用動。</b>手機那一輪要換起點色，是因為手機沒有柏油層、
      接縫直接吃照片的像素；iPad 有柏油層而且收到不透明，實測六組（三個尺寸 ×
      現況／抵下緣）照片最後一列都是 #161413，一個位元都沒變。</p>
  </div>
</div>

<script>
(function () {
  var root = document.documentElement;
  /* 網址參數。正規式一定要 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 p2 這種帶數字的值。 */
  var q = location.search, def = { h: 'fit', crop: 'mid', pos: 'p2', size: 's3', band: 'fix' };
  Object.keys(def).forEach(function (k) {
    var m = q.match(new RegExp('[?&]' + k + '=([a-z0-9]+)'));
    root.setAttribute('data-' + k, m ? m[1] : def[k]);
  });

  /* 裁切用**原圖的錨點**算 object-position：照片一拉高，看得到的原圖寬就變窄，
     同一個百分比會指到完全不同的地方。置中 = 視窗中心落在原圖 50%。 */
  var SW = 1600, SH = 1058, AN = { mid: .50, right: .565 };
  function paint() {
    var fig = document.querySelector('.hero-photo'), img = fig.querySelector('img');
    var W = fig.clientWidth, H = fig.clientHeight;
    var tablet = matchMedia('(min-width: 721px) and (max-aspect-ratio: 9/10)').matches;
    if (!tablet) { img.style.objectPosition = ''; document.getElementById('swm').textContent =
      '這一頁的切換條只作用在直式的平板／直立螢幕（寬 ≥ 721 且比例 ≤ 9:10）。目前是 ' + W + '×' + innerHeight + '。'; return; }
    var s = Math.max(W / SW, H / SH), vis = Math.min(SW, W / s);
    var p = (SW - vis > .5)
      ? Math.max(0, Math.min(SW - vis, (AN[root.getAttribute('data-crop')] || .5) * SW - vis / 2)) / (SW - vis) * 100
      : 50;
    img.style.objectPosition = p.toFixed(2) + '% 50%';

    var band = document.querySelector('.band').getBoundingClientRect();
    var hero = document.querySelector('.hero').getBoundingClientRect();
    var hd = document.querySelector('header').getBoundingClientRect();
    var rg = document.createRange();
    rg.selectNodeContents(document.querySelector('.hero-poem > span'));
    var l1 = rg.getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(document.querySelector('.hero-poem')).fontSize);
    var gap = l1.top - hd.bottom;
    document.getElementById('swm').textContent =
      '照片 ' + H.toFixed(0) + 'px（一屏的 ' + (H / innerHeight * 100).toFixed(0) + '%）'
      + '　窄帶 ' + band.height.toFixed(0) + 'px'
      + '　第一屏底下露出紙色 ' + Math.max(0, innerHeight - hero.bottom).toFixed(0) + 'px'
      + '\\n裁切 ' + p.toFixed(1) + '%（原圖寬的 ' + (vis / SW * 100).toFixed(0) + '%）'
      + '　放大 ' + s.toFixed(2) + ' 倍'
      + '\\n詩 ' + fs.toFixed(1) + 'px　離頁首 ' + gap.toFixed(1) + 'px'
      + '　＝ ' + (gap / fs).toFixed(2) + ' 個字高（電腦版 6.00）';
  }

  document.querySelectorAll('#sw .r').forEach(function (row) {
    var k = row.dataset.k;
    row.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        root.setAttribute('data-' + k, b.dataset.v);
        sync(); paint();
        var u = new URL(location.href); u.searchParams.set(k, b.dataset.v);
        history.replaceState(null, '', u);
      });
    });
  });
  function sync() {
    document.querySelectorAll('#sw .r').forEach(function (row) {
      var v = root.getAttribute('data-' + row.dataset.k);
      row.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.v === v));
      });
    });
  }
  document.querySelector('#sw [data-more]').addEventListener('click', function () {
    var n = document.getElementById('swn');
    n.hidden = !n.hidden;
    this.textContent = n.hidden ? '評分與建議 \\u25be' : '評分與建議 \\u25b4';
  });
  document.querySelector('#sw [data-x]').addEventListener('click', function () {
    var sw = document.getElementById('sw');
    var off = sw.style.transform === 'translateY(88%)';
    sw.style.transform = off ? '' : 'translateY(88%)';
    this.textContent = off ? '收起' : '打開';
  });
  sync(); paint();
  addEventListener('resize', paint);
  addEventListener('orientationchange', function () { setTimeout(paint, 250); });
  addEventListener('load', paint);
})();
</script>
`;

const hi = h.lastIndexOf('</head>');
if (hi < 0) throw new Error('找不到 </head>');
h = h.slice(0, hi) + HEADNOTE + h.slice(hi);

/* ⚠ 切換條插在**最後一個** </body> 前面 —— 這一站的註解裡就有 </body> 這個字串
   （.nav-lamp 那一段），用 String.replace 會換到註解裡那一個。 */
const i = h.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
h = h.slice(0, i) + BAR + h.slice(i);

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, 'index.html'), h);
console.log('寫入', path.join(OUTDIR, 'index.html'), (h.length / 1024).toFixed(0) + 'KB');
