/* 一次性腳本：從 index.html 產生 preview/hero-mobile-fullbleed/index.html
   （手機版 HERO 照片要多大 —— 提案頁）

   定案上線後這支腳本和提案頁一起刪掉，推導文字搬進 history/。
   index.html 改過之後要重新產一次：node gen-preview.mjs
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUTDIR = path.join(ROOT, 'preview/hero-mobile-fullbleed');
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
h = h.replace('<p class="band-views" data-views-self="home">',
  '<p class="band-views is-on">');
h = h.replace('<span class="views-n" aria-hidden="true">0</span>',
  '<span class="views-n" aria-hidden="true">1275</span>');

/* ---- 4. 標題（不影響版型，只是別在分頁列上和正式站混在一起） ---- */
h = h.replace(/<title>[^<]*<\/title>/, '<title>提案：手機版 HERO 照片要多大 — 芳仁牙醫診所</title>');

/* ---- 5. 切換條插在**最後一個** </body> 前面 ----
   ⚠ 這一站的註解裡就有 </body> 這個字串（.nav-lamp 那一段），
      用 String.replace('</body>', …) 會換到註解裡那一個，
      切換條會落在 <head> 的樣式表中間、整段不會執行。一定要用 lastIndexOf。 */

/* 窄帶接縫的漸層：和正式站同一條曲線 S(t^1.6)，只換起點的顏色。
   起點＝那個裁切下照片最後一列的中位數色（實測，見頁面抬頭的表）。 */
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
     提案：手機版 HERO 的照片要多大（2026-08-15）
     --------------------------------------------------------------------------
     使用者：「電腦版上看現在的首頁效果很好因為是滿版的，但是手機上看那個照片
     他就縮小了，感覺那個效果或那個感覺就沒有像電腦版那麼好。」

     ---- 一、問題不在照片，在框的形狀 ------------------------------------
     手機的 .hero-photo 寫死 74.72vw。實測：

         視窗        照片高      佔一屏      詩的字級
         320x568     239px       42%         9.79px
         375x812     280px       35%         11.48px
         390x844     291px       34%         11.50px
         430x932     321px       34%         11.50px
         電腦 1440   900px      100%         15.00px   <- 使用者說「效果很好」的那個

     一棟三層樓的轉角建築壓進一條 2.5:1 的橫帶，屋簷的挑出、招牌、亮著燈的
     門面全部變成細節。**詩也被連帶壓小**：Ⓢ1（2026-08-10）那組字距 .131em、
     行高 1.75、字級 11.5px，是被 291px 高的天空逼出來的，不是設計上想要的
     （電腦版是 .32em／2.45／15px）。

     ---- 二、拉高不會裁掉照片的上下（這一輪最關鍵的一件） ----------------
     直式的框比照片瘦，object-fit: cover 的縮放倍率 s = max(W/1600, H/1058)
     由**高度**那一項決定（H >= 258 時都是），所以顯示高度恆等於框高 ——
     **垂直方向永遠是整張照片**，天空在上、街面在下一列都沒少。拉高只往左右裁：

         照片高    看得到原圖寬          等效
         291px     1418px (88.6%)        現況（右緣裁 13%）
         440px      938px (58.6%)        半屏
         570px      724px (45.2%)        三分二
         719px      574px (35.9%)        抵下緣（390x844）
         844px      489px (30.6%)        整屏

     於是天空那個楔形**整個放大**，詩反而變寬鬆。逐像素量過（藍減紅 > 8 判天空，
     沿用 2026-08-10 的判準）三行詩到房子的餘裕，390x844：

         現況＋Ⓢ1 的詩          +22 / +28 / +16 px
         抵下緣＋詩鬆兩階        +81 / +78 / +53 px

     ---- 三、順便修掉一件舊帳 --------------------------------------------
     「巷口」壓在對街車頭燈上（2026-08-10 為它加了 Ⓔ2 那塊暗斑，CLAUDE.md
     第九節第 11 項）。新裁法把那盞燈整個裁掉：收尾句底下最亮的一列
     L*97 -> L*40，白字對比度 1.09 -> 6.50。Ⓔ2 那塊暗斑**先留著**（不礙事，
     而且 320 上還有 L*52／對比 4.21），但它已經不是非有不可。

     ---- 四、照片庫沒有第二張可以換 --------------------------------------
     站上四張實拍：hero-clinic.jpg（日景，天空是亮的，白字讀不到）、
     clinic-room-1/2.jpg（診間，整片白底，同上）、hero-clinic-night.jpg（現用）。
     詩是白字、要壓在照片上，所以只有夜景這一張能當 HERO。
     **這一輪動的是裁切與框，不是換照片。**

     ---- 五、切換條的三把尺 ----------------------------------------------
     照片　現況 74.72vw ｜ 半屏 52svh ｜ 三分二 67svh ｜ 抵下緣 ｜ 整屏 100svh
           「抵下緣」＝照片 ＋ 窄帶正好一屏（窄帶下緣壓在螢幕底線上），
           用 flex 讓照片吃掉剩下的高度 —— 和電腦版案二同一個做法。
     裁切　街景多（視窗中心落在原圖 50%）｜ 平衡 57.5% ｜ 建築滿 64%
           ⚠ 用**原圖的錨點**算 object-position，不是寫死百分比 ——
              照片一拉高看得到的原圖寬就變窄，同一個百分比會指到完全不同的地方
              （抵下緣 61.7% 和半屏 68.2% 其實是同一個構圖）。
           ⚠「現況」那一格固定 0% 50%（＝正式站現在的裁法），比較才有基準。
     詩　　現況 ｜ 鬆一階 ｜ 鬆兩階（字距 .131 -> .19 -> .25em，行高 1.75 -> 2.0 -> 2.2）

     ---- 六、詩與裁切是一組的，不能各挑各的 ------------------------------
     「鬆兩階」只在「街景多」成立。往左裁露出更多天空（天空的右界在原圖裡是
     固定的，視窗左緣往左移，界線在螢幕上就更右），逐視窗量：

         抵下緣 ＋ 平衡 ＋ 鬆兩階     390x844 餘裕 +82 / -3 / -28  <- 壓到房子
         抵下緣 ＋ 街景多 ＋ 鬆兩階   390x844 餘裕 +82 / +79 / +53
         抵下緣 ＋ 平衡 ＋ 鬆一階     390x844 餘裕 +124 / +64 / +47

     ---- 七、踩過兩次的坑：詩的參數要跟著「照片高度」，不是跟著寬度 ------
     第一版位置寫 21vw／25vw：390x844 上餘裕 +124/+60/+43，但 320x568 是
     -9/-12/-24、360x640 -6/-6/-22。成因是**照片高度改由螢幕高度決定之後，
     天空的楔形跟著螢幕高縮放，字卻還跟著寬度算** —— 短螢幕上字相對變大。
     第二版把位置換成 svh：抵下緣過關，但半屏／三分二又壓到（L3 -4 ~ -19），
     因為 svh 只對「照片高＝一屏扣窄帶」那一格準。
     第三版（本案）：JS 把量到的照片高度寫進 --ph，位置與字級**一律按它等比例**，
     再用 vw 與絕對上下限夾住。七個視窗 x 五種高度全部轉正。

     ---- 八、窄帶接縫的起點色要重新量 ------------------------------------
     正式站是 #151311 —— 那是**現況這個裁法**下照片最後一列的中位數色
     （2026-08-12 四輪定案的那條，CLAUDE.md 第九節第 16 項）。照片一拉高就換
     一批像素，實測 L* 5.30 -> 7.28（每一列取中位數，不是平均 —— 路燈與車頭燈
     幾顆亮點就能把平均拉高 4 個 L*）。不換的話那條線會回來。
     曲線一模一樣（S(t^1.6)，頭尾斜率 0），只換起點：

         半屏                #171413（L* 6.70）
         三分二／抵下緣／整屏 #181614（L* 7.28）

     ---- 九、評分（使用者體驗 ＋ 品牌，各項 5 分）-------------------------
                     品牌  詩與照片  讀得  找資訊  風險   總分
                     份量  相合      清楚  的效率  相容
         現況 34%     2.0   4.0       2.5   5.0     5.0    18.5
         半屏 52%     3.5   4.5       4.0   5.0     4.5    21.5
         三分二 67%   4.0   4.5       4.0   4.5     4.5    21.5
         抵下緣 85%   5.0   4.5       5.0   4.0     4.0    22.5  <- 建議
         整屏 100%    5.0   3.5       5.0   2.0     3.0    18.5

     ・現況在「找資訊」拿滿分是真的：第一屏一半是紙色區，主題與科別、搜尋框
       都已經露出來了。它輸在品牌份量與可讀性。
     ・整屏在「找資訊」只有 2.0：窄帶（地址、電話、1983／9／5）整條被推出第一屏，
       牙醫診所的網站不該讓人先捲一下才看到電話。
     ・整屏在「相合」也掉一階：只看得到 30.6% 的原圖寬，對街的房子與車全部裁掉，
       而詩講的是「從中華路到永樂街」「到巷口的芳仁」—— 街景是文案的一半。
     ・抵下緣在「風險」是 4.0（不是 5.0）：多了一條「照片高度看螢幕高度」的
       相依，320x568 這種短螢幕的餘裕只剩 +6 ~ +12px。

     ---- 十、建議 --------------------------------------------------------
     **抵下緣 ＋ 街景多 ＋ 詩鬆兩階**（這一頁打開就是它）。
     照片從一屏的 34% 變成 85%，照片＋窄帶剛好一屏 —— 和電腦版是同一件事。
     詩 14.4px（現在 11.5）、字距 .25em（現在 .131），第一次和電腦版同一個氣。
     退一步的話選「三分二 ＋ 街景多」：第一屏底下還會露出一點紙色區，
     品牌份量少一階，但完全不必討論「第一屏要不要提示下面還有」。

     ==========================================================================
     第二輪（同一天）：詩還是和 logo 黏在一起
     --------------------------------------------------------------------------
     使用者看過第一輪：「你這樣設計很不錯欸。不過我發現詩可以再鬆一點或是
     再往下一點，還是字可以再大一點，因為就算鬆兩階，看起來和 logo 還是有點近、
     黏在一起的感覺。」

     ---- 十一、量出來是「距離」差 2.2 倍，字其實已經不小 ------------------
     拿電腦版（使用者說「效果很好」的那個）當基準，量頁首下緣到詩第一行
     ink 上緣的空隙。用 Range 量 ink，不要量 span 的 rect —— 那個框含
     line-height 的半行距，會多算幾 px：

         版型                空隙     ÷詩的字高   ÷照片高   詩÷診所名
         電腦 1280x800       80.0px     5.95       10.0%     0.792
         電腦 1440x900       90.0px     6.00       10.0%     0.884
         手機 現況（線上）   11.7px     1.02        4.0%     0.774
         手機 第一輪鬆兩階   38.6px     2.67        5.4%     0.972

     ・**空隙差 2.2 倍**（2.67 對 6.00）—— 這就是「黏在一起」，量得出來。
     ・**字反而已經偏大**：詩÷照片高，手機 2.01%、電腦 1.67%；
       詩÷診所名手機 0.97、電腦 0.88 —— 再放大就和 logo 一樣大，
       那正是 2026-08-09 朋友回報「兩塊字大小差不多、看起來 noisy」的成因。
     ⚠ 兩個比值會指向不同答案（÷字高 說差 2.2 倍、÷照片高 說差 1.85 倍），
        因為手機的字相對照片本來就比較大。「黏在一起」是**字與字的關係**，
        所以以 ÷字高 ＝ 6.0 為準。
     ・所以切換條從「鬆一階／鬆兩階」兩個套餐，拆成**位置、字級、鬆緊三把尺**
       ＋一把「上緣壓深」，各自可以單獨動。

     ---- 十二、⚠⚠ 這一輪推翻了一個沿用五天的前提 -------------------------
     Ⓢ1（2026-08-10）把「詩不准碰到房子」當成硬約束，整組字距與位置都是照
     天空那個楔形解出來的。第一輪也照著用（餘裕表就是它）。
     **但那個約束真正的理由是對比度** —— 而它是在照片只有 291px、牆又小又花的
     前提下訂的。照片拉到 719px、又是夜景之後，牆自己就夠暗了。
     逐行取 ink bbox 裡最亮的一格換算白字對比度（詩 15.5px、坐到第⑤階）：

         上緣壓深                 第一行   第二行   第三行   六個視窗最低
         不放                     8.49     6.54     5.88     5.00
         電腦版那層 46% .52/.30  10.54     7.97     6.85     5.53
         厚一階 58% .62/.40      12.05     9.46     8.23     6.74

     **連「不放」都全部過 AA（4.5）。** 所以詩不必再擠在天空裡 —— 這是這一輪
     最大的解鎖，位置與字級因此可以一路推到和電腦版同一個空隙比。
     ⚠ 數字過關不等於好看：牆上有窗框與亮著的窗，「花」是主觀的，所以做成
        開關讓使用者自己看。預設開電腦版那一層（和電腦版一致，也最保守）。
     ⚠ 那一層在電腦版本來就有，手機版是刻意關掉的，理由寫在 index.html：
        「手機的頁首壓在天空上，不需要，留著只會讓天空變濁」——
        那句話在照片只有 291px 的時候成立，滿版之後不成立了。

     ---- 十三、位置 x 字級 x 鬆緊的階梯（390x844、抵下緣、街景多）---------
         位置階  字級階  鬆緊階   字級    空隙     ÷字高   第一行右緣
         ②      ②      ③      14.5px  38.7px   2.68    307.7
         ③      ③      ④      15.5px  57.2px   3.70    346.2
         ④      ③      ④      15.5px  74.4px   4.81    346.2
         ⑤      ③      ④      15.5px  91.7px   5.93    346.2  <- 建議
         ⑤      ④      ④      16.5px  92.7px   5.62    368.5
         ⑥      ④      ④      16.5px  110px    6.67    368.5
     ⚠ 字級只到第③階（15.5px）：第④階的第一行右緣 368.5px，390 寬上離右緣
        只剩 21.5px（左內距是 20px），看起來就滿出去了。
     ⚠ 短螢幕（320x568、375x667）字級會被 min(12px, 3.8vw) 的下限接住 ＝ 12px，
        空隙比因此只有 4.68 ~ 4.7 —— 那是照片本身只有 443／542px 高，
        再往下就要壓到門面了。這是刻意的，不是漏改。

     ---- 十四、第二輪的建議 ----------------------------------------------
     **抵下緣 ＋ 街景多 ＋ 位置⑤ ＋ 字級③ ＋ 鬆緊④（電腦版）＋ 上緣壓深「電腦版」**
     （這一頁打開就是它）。
     ・空隙 91.7px ＝ 5.93 個字高，電腦版是 6.00 —— 兩邊第一次同一個關係。
     ・字距／行高／全形空格／首行後間隔**和電腦版逐字相同**（.32em／2.45／1em／.9em）。
     ・字級 15.5px（線上 11.5px），電腦版 15px。
     使用者的三個方向（再鬆、再往下、字再大）**三個都做了**，主力是「往下」。

     ---- 定案要帶進 index.html 的東西（別漏）-----------------------------
     1. 窄帶那個假數字 1275 與 .is-on **不要帶**，真值只能來自 D1。
     2. data-h／data-crop／data-pos／data-size／data-air／data-veil／data-cue
        與整條切換條刪掉，
        選上那一組的值直接寫死進 @media (max-width: 720px)。
     3. object-position 若定案在「街景多」，390 上是 50% 50% —— 但**不要寫死**，
        它會隨螢幕高度變（320x568 是 50%、430x932 也是 50%，因為 50% 那一格
        剛好落在夾限外側；改成「平衡」就一定要留 JS 或改用固定的裁切檔）。
     4. --ph 那段 JS 要一起搬，或改成純 CSS 的近似值（100svh - 窄帶高）。
     5. Ⓔ2 那塊暗斑與 hero-cue 的預設狀態照使用者選的來。
     6. 上緣那層 .hero-photo::after 在手機版目前是 display:none，選了「壓深」
        就要把那條 none 拿掉（並把 index.html 裡那句「手機不需要」的註解改掉）。
     7. CLAUDE.md 第九節第 6 項與 /history/hero-mobile-skyline.html 的
        「詩不准碰到房子」那條約束要標成**只適用於 291px 那個版型**，
        不然下一個人又會照那張楔形表去解字距。

     完整的提案頁留在 git，還原：
       git show <commit>:preview/hero-mobile-fullbleed/index.html > /tmp/x.html
     ========================================================================== -->
`;

const BAR = `
<!-- ==========================================================================
     切換條（提案用，定案後連同 data-* 屬性一起刪掉）
     ========================================================================== -->
<style>
@media (max-width: 720px) {
  /* ---- 尺①　照片高度 ------------------------------------------------------
     現況只有 74.72vw（390 上 291px ＝ 一屏的 34%），電腦版是 100svh。
     ⚠ cover 之下**垂直永遠是整張照片**（框比照片瘦，s 由高度決定），
        所以把照片拉高只會往左右裁 —— 天空、屋簷、街面的上下關係一個都沒動。 */
  html[data-h="half"] .hero-photo { height: 52svh; }
  html[data-h="two3"] .hero-photo { height: 67svh; }
  /* 抵下緣：照片 ＋ 窄帶正好一屏，窄帶下緣壓在螢幕底線上（＝電腦版案二）。
     用 flex 讓照片吃掉剩下的高度，窄帶多高都不必寫死。 */
  html[data-h="fit"] .hero { display: flex; flex-direction: column; height: 100svh; }
  html[data-h="fit"] .hero-photo { height: auto; flex: 1 1 auto; min-height: 0; }
  html[data-h="full"] .hero-photo { height: 100svh; }

  /* ---- 窄帶的接縫：起點色跟著裁切重新量 --------------------------------
     正式站那條是 #151311 —— 那是**現況這個裁法**下照片最後一列的中位數色。
     照片一拉高就換一批像素，接縫色跟著變（實測 L* 5.3 → 7.3），
     不換的話 2026-08-12 那四輪修掉的線會回來。曲線一模一樣（S(t^1.6)）。 */
  html[data-h="half"] .band { background-image: ${ramp('#171413')}; }
  html[data-h="two3"] .band,
  html[data-h="fit"] .band,
  html[data-h="full"] .band { background-image: ${ramp('#181614')}; }

  /* ---- 尺③④⑤　詩：位置、字級、鬆緊三把尺分開 ---------------------------
     第一版把三件事綁成「鬆一階／鬆兩階」兩個套餐，使用者看過之後：
     「詩可以再鬆一點或是再往下一點，還是字可以再大一點，因為就算鬆兩階，
       看起來和 logo 還是有點近、黏在一起的感覺。」
     所以拆成三把尺，各自可以單獨動。

     ---- 量出來是「距離」不夠，不是字太小 ----
     拿電腦版（使用者說「效果很好」的那個）當基準，量頁首下緣到詩第一行
     ink 上緣的空隙：

         版型              空隙     ÷詩的字高   ÷照片高    詩÷診所名
         電腦 1440x900     90.0px     6.00       10.0%      0.884
         電腦 1280x800     80.0px     5.95       10.0%      0.792
         手機 現況         11.7px     1.02        4.0%      0.774
         手機 第一版鬆兩階 38.6px     2.67        5.4%      0.972

     ・**空隙差了 2.2 倍**（2.67 對 6.00）—— 這就是「黏在一起」。
     ・**字其實已經不小**：詩÷照片高，手機 2.01%、電腦 1.67%，手機還比較大；
       而詩÷診所名手機已經 0.97（電腦 0.88），再放大會和 logo **一樣大**，
       那正是 2026-08-09 朋友回報「兩塊字大小差不多、看起來 noisy」的成因。
       所以主力給位置，字級只留兩階小幅上調（給使用者自己比）。
     ⚠ 兩個比值（÷字高、÷照片高）在手機上會指向不同的答案，因為手機的字
        相對照片本來就比較大。「黏在一起」是**字與字之間的關係**，
        所以以 ÷字高 ＝ 6.0 為準（位置的第④階正好落在那裡）。 */
  /* ---- --ph ＝ 照片實際高度 ------------------------------------------------
     詩的位置與字級都按這個等比例算（見下面兩組）。CSS 這裡先給一個算得出來的
     近似值，開頁不會閃；JS 再用量到的實際高度覆寫（窄帶多高都對得上）。 */
  html[data-h="now"]  { --ph: 74.72vw; }
  html[data-h="half"] { --ph: 52svh; }
  html[data-h="two3"] { --ph: 67svh; }
  html[data-h="fit"]  { --ph: calc(100svh - 125px); }
  html[data-h="full"] { --ph: 100svh; }

  /* ⚠⚠ 這兩組的位置與字級**都要跟著照片高度走，不能只看 vw**（實測踩過兩次）。
     現況那一組全部是 vw，因為現況的照片高度也是 vw（74.72vw）—— 兩者同步。
     照片一改成看螢幕高度（抵下緣／整屏），天空的楔形就跟著螢幕高縮放，
     字卻還跟著寬度算，於是短螢幕上字相對變大、一定壓到房子：
       第一版（21vw / 25vw）　320×568 餘裕 −9／−12／−24px，360×640 −6／−6／−22
                              （390×844 上明明還有 +124／+60／+43）
       第二版（位置吃 svh）　　抵下緣過關，但半屏／三分二又壓到（L3 −4 ~ −19）——
                              svh 只對「照片高＝一屏扣窄帶」那一格準。
     第三版（現在這一版）：位置與字級**一律按 --ph（照片實際高度）等比例**，
     再用 vw 與絕對上下限夾住。這樣照片多高、詩就多大、坐多低，五格都成立。 */
  /* 尺③　位置（詩往下坐多少）。因為 .hero-copy 是 inset:0，padding-top 的 %
     會拿**寬度**去算，所以一律寫 calc(var(--ph) * k) 用照片高度算。 */
  html[data-pos="d0"] .hero-copy { padding-top: calc(var(--ph) * .108); }
  html[data-pos="d1"] .hero-copy { padding-top: calc(var(--ph) * .129); }
  html[data-pos="d2"] .hero-copy { padding-top: calc(var(--ph) * .152); }
  html[data-pos="d3"] .hero-copy { padding-top: calc(var(--ph) * .176); }
  html[data-pos="d4"] .hero-copy { padding-top: calc(var(--ph) * .200); }
  html[data-pos="d5"] .hero-copy { padding-top: calc(var(--ph) * .225); }

  /* 尺⑥　上緣壓深（詩壓到清水模牆上時用）------------------------------------
     ⚠⚠ 這一格推翻了一個從 2026-08-10 沿用到現在的前提。
     Ⓢ1 那一輪把「詩不准碰到房子」當成硬約束，整組字距／位置都是照那個楔形
     解出來的。但**那個約束的真正理由是對比度，而 291px 高的照片上牆很小又很花**。
     照片拉到 719px、而且是夜景之後，牆自己就夠暗了 —— 逐行取 ink bbox 裡
     最亮的一格換算白字對比度（390x844、詩 15.5px、坐到第⑤階）：

         上緣的深化層            第一行   第二行   第三行
         不放                    8.49     6.54     5.88
         電腦版那層 46% .52/.30  10.54    7.97     6.85
         厚一階 58% .62/.40      12.05    9.46     8.23

     **連「不放」都全部過 AA（4.5）**，五個視窗最低是 320x568 的第三行 5.00。
     所以詩不必再擠在天空裡 —— 這是這一輪最大的解鎖，位置與字級因此可以一路
     推到「和電腦版同一個空隙比」。
     ⚠ 數字過關不等於好看：牆上有窗框與亮著的窗，**花**是主觀的，所以做成開關
        讓使用者自己看。預設開電腦版那一層（和電腦版一致，而且最保守）。
     ⚠ 這一層在電腦版本來就有（.hero-photo::after，46% .52/.30），手機版
        2026-08-10 之前刻意關掉，理由是「手機的頁首壓在天空上，不需要，
        留著只會讓天空變濁」—— 那句話在照片只有 291px 的時候成立。 */
  html[data-veil="v1"] .hero-photo::after { display: block; }
  html[data-veil="v2"] .hero-photo::after {
    display: block; height: 58%;
    background: linear-gradient(180deg,
      rgba(25, 22, 20, .62) 0%, rgba(25, 22, 20, .40) 42%, rgba(25, 22, 20, 0) 100%);
  }

  /* 尺④　字級 */
  html[data-size="s0"] { --hero-fs: clamp(min(11.5px, 3.20vw), calc(var(--ph) * .0181), 13px); }
  html[data-size="s1"] { --hero-fs: clamp(min(11.5px, 3.60vw), calc(var(--ph) * .0201), 14.5px); }
  html[data-size="s2"] { --hero-fs: clamp(min(12px, 3.80vw), calc(var(--ph) * .0215), 15.5px); }
  html[data-size="s3"] { --hero-fs: clamp(min(12px, 4.00vw), calc(var(--ph) * .0230), 16.5px); }

  /* 尺⑤　鬆緊（字距、行高、全形空格、首行後間隔一起走）。
     a3 ＝ 和電腦版逐字相同（.32em／2.45／全形空格不縮／首行後 .9em）。 */
  html[data-air="a0"] .hero-poem { letter-spacing: .131em; line-height: 1.75; }
  html[data-air="a0"] .hero-poem .g { font-size: .65em; }
  html[data-air="a0"] .hero-poem .lead { margin-bottom: .55em; }

  html[data-air="a1"] .hero-poem { letter-spacing: .19em; line-height: 2.00; }
  html[data-air="a1"] .hero-poem .g { font-size: .80em; }
  html[data-air="a1"] .hero-poem .lead { margin-bottom: .70em; }

  html[data-air="a2"] .hero-poem { letter-spacing: .25em; line-height: 2.20; }
  html[data-air="a2"] .hero-poem .g { font-size: .92em; }
  html[data-air="a2"] .hero-poem .lead { margin-bottom: .82em; }

  html[data-air="a3"] .hero-poem { letter-spacing: .32em; line-height: 2.45; }
  html[data-air="a3"] .hero-poem .g { font-size: 1em; }
  html[data-air="a3"] .hero-poem .lead { margin-bottom: .90em; }

  /* ---- 開關　往下看的角形 -------------------------------------------------
     ⚠ 這一項 2026-08-13 在 cta-mobile 的十九項裡**落選過**（「第一屏的下面還有」）。
        當時第一屏底下已經露出半個紙色區，本來就看得出還有東西；
        滿版之後第一屏什麼都不露，情況不一樣，所以再問一次。預設是關的。
     ⚠ 電腦版那顆是**置中**的（窄帶上緣正中央）。手機不能照搬 —— 收尾句
        「到巷口的芳仁　一起想辦法」就躺在那個位置，390 上量到和「辦法」重疊
        （角形的框 40px 寬、中心在 x195，收尾句右緣 200）。所以手機改貼右緣。 */
  html[data-cue="1"] .hero-cue { display: flex; left: auto; right: 0; transform: none; }
}
/* 切換條自己 */
#sw { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99;
  background: rgba(20, 19, 18, .93); color: #e8e6e2; padding: 7px 8px 9px;
  font: 12px/1.35 -apple-system, "Noto Sans TC", sans-serif;
  backdrop-filter: blur(8px); box-shadow: 0 -1px 0 rgba(255, 255, 255, .12); }
#sw .r { display: flex; align-items: center; gap: 4px; margin: 3px 0; }
#sw .r > b { flex: 0 0 3.6em; font-weight: 600; opacity: .72; font-size: 11px; }
#sw button { flex: 1 1 auto; min-width: 0; appearance: none; border: 1px solid rgba(255,255,255,.28);
  background: transparent; color: inherit; border-radius: 7px; padding: 6px 2px;
  font: inherit; font-size: 11.5px; letter-spacing: .01em; }
#sw button[aria-pressed="true"] { background: #e8e6e2; color: #191614; border-color: #e8e6e2; font-weight: 700; }
#sw .m { font-size: 10.5px; opacity: .62; margin-top: 5px; font-variant-numeric: tabular-nums;
  white-space: pre-line; }
#sw .x { position: absolute; right: 6px; top: -30px; background: rgba(20,19,18,.93);
  border: 0; color: #e8e6e2; border-radius: 7px; padding: 5px 9px; font: inherit; }
#sw .more { width: 100%; margin-top: 5px; border-style: dashed; }
#swn { max-height: 52svh; overflow: auto; margin-top: 6px; padding-top: 6px;
  border-top: 1px solid rgba(255,255,255,.18); font-size: 11.5px; line-height: 1.6; }
#swn p { margin: 0 0 .7em; }
#swn code { font-size: 11px; opacity: .85; }
#swn table { width: 100%; border-collapse: collapse; margin: 0 0 .8em; font-size: 10.5px;
  font-variant-numeric: tabular-nums; }
#swn th, #swn td { border: 1px solid rgba(255,255,255,.16); padding: 3px 2px; text-align: center; }
#swn td:first-child, #swn th:first-child { text-align: left; white-space: nowrap; }
#swn th { font-weight: 600; opacity: .8; font-size: 9.5px; line-height: 1.25; }
#swn tr.win { background: rgba(255,255,255,.12); font-weight: 700; }
#swn .fine { opacity: .65; }
body { padding-bottom: 168px; }
</style>

<div id="sw">
  <button class="x" type="button" data-x>收起</button>
  <div class="r" data-k="h"><b>照片</b>
    <button type="button" data-v="now">現況</button><button type="button" data-v="half">半屏</button><button type="button" data-v="two3">三分二</button><button type="button" data-v="fit">抵下緣</button><button type="button" data-v="full">整屏</button></div>
  <div class="r" data-k="crop"><b>裁切</b>
    <button type="button" data-v="street">街景多</button><button type="button" data-v="mid">平衡</button><button type="button" data-v="bldg">建築滿</button></div>
  <div class="r" data-k="pos"><b>詩·低</b>
    <button type="button" data-v="d0">①</button><button type="button" data-v="d1">②</button><button type="button" data-v="d2">③</button><button type="button" data-v="d3">④</button><button type="button" data-v="d4">⑤</button><button type="button" data-v="d5">⑥</button></div>
  <div class="r" data-k="size"><b>詩·大</b>
    <button type="button" data-v="s0">①</button><button type="button" data-v="s1">②</button><button type="button" data-v="s2">③</button><button type="button" data-v="s3">④</button></div>
  <div class="r" data-k="air"><b>詩·鬆</b>
    <button type="button" data-v="a0">①</button><button type="button" data-v="a1">②</button><button type="button" data-v="a2">③</button><button type="button" data-v="a3">④電腦版</button></div>
  <div class="r" data-k="veil"><b>壓深</b>
    <button type="button" data-v="v0">不放</button><button type="button" data-v="v1">電腦版</button><button type="button" data-v="v2">厚一階</button></div>
  <div class="r" data-k="cue"><b>角形</b>
    <button type="button" data-v="0">不放</button><button type="button" data-v="1">放</button></div>
  <p class="m" id="swm"></p>
  <button class="more" type="button" data-more>評分與建議 ▾</button>
  <div id="swn" hidden>
    <p><b>結論：照片用「抵下緣 ＋ 街景多」，詩用「位置⑤ ＋ 字級③ ＋ 鬆緊④ ＋ 壓深電腦版」</b>
      （這一頁打開就是它）。照片從一屏的 34% 變成 85%，照片＋窄帶剛好一屏 ——
      和電腦版「照片一整屏、窄帶壓在下緣」是同一個做法。</p>
    <p><b>詩和 logo 為什麼會黏在一起 —— 量出來差 2.2 倍。</b>頁首下緣到詩第一行的空隙，
      除以詩自己的字高：電腦版 <b>6.00</b>、線上手機 <b>1.02</b>、第一版鬆兩階 <b>2.67</b>、
      這一版 <b>5.93</b>。字其實已經不小 —— 詩÷診所名，手機 0.97、電腦 0.88，
      再放大就和 logo 一樣大了，那反而是 noisy 的來源。所以主力給「往下」，
      字級只加一階到 15.5px，鬆緊直接抄電腦版（字距 .32em、行高 2.45）。</p>
    <p><b>順帶解掉一條沿用五天的限制。</b>詩原本不准碰到房子（2026-08-10 Ⓢ1 那一輪的
      前提），但那條的真正理由是對比度，而它是在照片只有 291px 時訂的。
      夜景的清水模牆自己就夠暗：詩壓在牆上，白字對比度 <b>5.5 ~ 10.5</b>（AA 是 4.5），
      六個視窗最低 5.53。所以詩可以坐到和電腦版同一個位置。
      「壓深」那把尺是給眼睛用的 —— 牆上有窗框，花不花是主觀的。</p>
    <table>
      <tr><th></th><th>品牌<br>份量</th><th>詩與<br>照片相合</th><th>讀得<br>清楚</th><th>找資訊<br>的效率</th><th>風險<br>相容</th><th>總分</th></tr>
      <tr><td>現況 34%</td><td>2.0</td><td>4.0</td><td>2.5</td><td>5.0</td><td>5.0</td><td>18.5</td></tr>
      <tr><td>半屏 52%</td><td>3.5</td><td>4.5</td><td>4.0</td><td>5.0</td><td>4.5</td><td>21.5</td></tr>
      <tr><td>三分二 67%</td><td>4.0</td><td>4.5</td><td>4.0</td><td>4.5</td><td>4.5</td><td>21.5</td></tr>
      <tr class="win"><td>抵下緣 85%</td><td>5.0</td><td>4.5</td><td>5.0</td><td>4.0</td><td>4.0</td><td>22.5</td></tr>
      <tr><td>整屏 100%</td><td>5.0</td><td>3.5</td><td>5.0</td><td>2.0</td><td>3.0</td><td>18.5</td></tr>
    </table>
    <p><b>為什麼現況弱。</b>不是照片檔案的問題，是<b>框的形狀</b>：手機的照片框寫死
      74.72vw，390 上只有 291px ＝ 一屏的 34%（電腦版是 100%）。一棟三層樓的
      轉角建築壓進一條 2.5:1 的橫帶，屋簷、招牌、街面全部縮成細節。
      詩也被連帶壓小：字距只剩 .131em（電腦版 .32em）、行高 1.75（電腦版 2.45）、
      字級 11.5px —— 那是被 291px 的天空逼出來的，不是設計上想要的。</p>
    <p><b>為什麼拉高不會裁掉照片的上下。</b>框比照片瘦的時候，<code>object-fit: cover</code>
      的縮放倍率由<b>高度</b>決定 —— 所以垂直方向永遠是整張照片（天空在上、街面在下
      一列都沒少），拉高只是往左右裁。天空的楔形因此整個<b>放大</b>，詩反而變寬鬆：
      抵下緣那一格三行的餘裕是 +80／+78／+53px（現況只有 +22／+28／+16）。</p>
    <p><b>四種都試過的三個方向。</b>「詩·低」①→⑥ 是往下坐（空隙 1.0 → 6.7 個字高）、
      「詩·大」①→④ 是字級（13 → 16.5px 上限）、「詩·鬆」①→④ 是字距與行高
      （④ 就是電腦版逐字相同）。字級不建議到第④階：第一行右緣會到 368.5px，
      390 寬上離右緣只剩 21.5px，看起來滿出去。</p>
    <p><b>順便修掉的一件。</b>「巷口」那兩個字壓在對街車頭燈上（2026-08-10 為它加了
      Ⓔ2 那塊暗斑）。新裁法把那盞燈整個裁掉了：收尾句底下最亮的一列從
      L*97 掉到 L*40，白字對比度 1.09 → 6.50。</p>
    <p><b>照片庫沒有第二張可以換。</b>站上只有四張實拍：日景外觀（天空是亮的，白字讀不到）、
      兩張診間（整片白底，同上）、和現在這張夜景。所以這一輪動的是<b>裁切與框</b>，
      不是換照片。</p>
    <p class="fine">※ 七個視窗（320×568 ~ 430×932）逐一量過：三行詩都沒有壓到房子、
      沒有橫向捲動。窄帶接縫的起點色跟著裁切重新量過（#151311 → #181614）。</p>
  </div>
</div>

<script>
(function () {
  var root = document.documentElement;
  /* 網址參數。正規式一定要 [a-z0-9]+ —— 寫 [a-z]+ 會吃不到 p2 這種帶數字的值。 */
  var q = location.search;
  var def = { h: 'fit', crop: 'street', pos: 'd4', size: 's2', air: 'a3', veil: 'v1', cue: '0' };
  /* 舊網址相容：第一版的 poem=p1|p2|p3 是三件事綁在一起的套餐，拆成三把尺之後
     還是要吃得到（已經把連結給過使用者了）。 */
  var OLD = { p1: { pos: 'd0', size: 's0', air: 'a0', veil: 'v0' },
              p2: { pos: 'd0', size: 's0', air: 'a1', veil: 'v0' },
              p3: { pos: 'd1', size: 's1', air: 'a2', veil: 'v0' } };
  var old = q.match(/[?&]poem=([a-z0-9]+)/);
  if (old && OLD[old[1]]) Object.keys(OLD[old[1]]).forEach(function (k) { def[k] = OLD[old[1]][k]; });
  Object.keys(def).forEach(function (k) {
    var m = q.match(new RegExp('[?&]' + k + '=([a-z0-9]+)'));
    root.setAttribute('data-' + k, m ? m[1] : def[k]);
  });

  /* 裁切：用**原圖的錨點**算 object-position，而不是寫死百分比 ——
     照片一拉高，看得到的原圖寬就變窄，同一個百分比會指到完全不同的地方。
     街景多 = 視窗中心落在原圖 50%、平衡 57.5%、建築滿 64%。
     ⚠ 現況那一格固定用 0% 50%（＝正式站現在的裁法），這樣比較才有基準。 */
  var SW = 1600, SH = 1058, AN = { street: .50, mid: .575, bldg: .64 };
  function paint() {
    var fig = document.querySelector('.hero-photo'), img = fig.querySelector('img');
    var W = fig.clientWidth, H = fig.clientHeight, wide = matchMedia('(max-width: 720px)').matches;
    if (!wide) { img.style.objectPosition = ''; return; }
    root.style.setProperty('--ph', H.toFixed(2) + 'px');   /* 詩按這個等比例算 */
    var s = Math.max(W / SW, H / SH), vis = Math.min(SW, W / s);
    var p = 0;
    if (root.getAttribute('data-h') === 'now') p = 0;
    else if (SW - vis > .5) {
      var xc = AN[root.getAttribute('data-crop')] || .575;
      p = Math.max(0, Math.min(SW - vis, xc * SW - vis / 2)) / (SW - vis) * 100;
    } else p = 50;
    img.style.objectPosition = p.toFixed(2) + '% 50%';
    /* 現場量「頁首下緣到詩第一行 ink 上緣」的空隙。用 Range 量 ink，
       不要量 <span> 的 rect —— 那個框含 line-height 的半行距，會多算幾 px。 */
    var band = document.querySelector('.band');
    var hd = document.querySelector('header').getBoundingClientRect();
    var rg = document.createRange();
    rg.selectNodeContents(document.querySelector('.hero-poem > span'));
    var l1 = rg.getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(document.querySelector('.hero-poem')).fontSize);
    var gap = l1.top - hd.bottom;
    document.getElementById('swm').textContent =
      '照片 ' + H.toFixed(0) + 'px（一屏的 ' + (H / innerHeight * 100).toFixed(0) + '%）'
      + '　窄帶 ' + band.getBoundingClientRect().height.toFixed(0) + 'px'
      + '　裁切 ' + p.toFixed(1) + '%（原圖寬的 ' + (vis / SW * 100).toFixed(0) + '%）'
      + '\\n詩 ' + fs.toFixed(1) + 'px　離頁首 ' + gap.toFixed(1) + 'px'
      + '　＝ ' + (gap / fs).toFixed(2) + ' 個字高（電腦版 6.00、改動前 1.02）';
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
    this.textContent = n.hidden ? '評分與建議 \u25be' : '評分與建議 \u25b4';
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

const i = h.lastIndexOf('</body>');
if (i < 0) throw new Error('找不到 </body>');
h = h.slice(0, i) + BAR + h.slice(i);

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, 'index.html'), h);
console.log('寫入', path.join(OUTDIR, 'index.html'), (h.length / 1024).toFixed(0) + 'KB');
console.log('半屏  接縫 #171413 →', ramp('#171413').slice(0, 90) + '…');
console.log('其餘  接縫 #181614 →', ramp('#181614').slice(0, 90) + '…');
