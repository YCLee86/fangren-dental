#!/usr/bin/env node
/* =============================================================================
   提案頁產生器：科別著陸頁　preview/topic-<spec>/index.html
   -----------------------------------------------------------------------------
   用法：node tools/topic-preview.mjs

   為什麼是「拿 index.html 當底」而不是自己寫一頁：
   使用者 2026-08-18 定案 ——「搜尋框還是留著，現在首頁怎麼做的著陸頁就怎麼做，
   只是增加篩選下的科別說明或介紹而已」。照這個做法，chips、搜尋框、醫師卡、
   門診表、地圖的 CSS 與 JS 全部沿用，不必抄第二份、也不會走樣。

   -----------------------------------------------------------------------------
   這支做了什麼（每一項都是為了避開 CLAUDE.md 第八節那幾個陷阱）
   -----------------------------------------------------------------------------
   1. 相對路徑往上兩層。**不用 <base href="/">** —— 那會讓 #topics 這種錨點跳回首頁。
   2. 拿掉 assets/counter.js。窄帶連同 data-views-self 一起隨 HERO 消失，
      所以不會發生「每開一次提案頁首頁計數就多一次」。
   3. 切換條插在**最後一個** </body> 前面（用 lastIndexOf）——
      這一站的註解裡就寫著那幾個字，String.replace 會換到註解裡那一個。
   4. class 一律 pv- 前綴（切換條）／tp-（科別介紹），避開站上既有的短名字。

   -----------------------------------------------------------------------------
   兩個和 SEO 有關、不能省的處理
   -----------------------------------------------------------------------------
   ・**文章與醫師是在這裡「真的刪掉」，不是靠 JS 藏起來。**
     靠 JS 篩的話，Google 抓到的仍然是七科全部的內容，這一頁就不是牙周的頁了 ——
     那正是現在首頁篩選的毛病，繞回原點。同 CLAUDE.md 第一節第 1 條的精神。
   ・**chips 從 <button> 換成 <a>。** 這是整件事的關鍵：按鈕沒有網址，
     爬蟲點不下去；連結才有。目前這一頁的顏色與狀態和按鈕版完全一樣
     （aria-pressed 保留給樣式用，另外加 aria-current="page" 給輔助技術）。

   ⚠ 站上那支篩選 JS 的第一行是 `.chips button[data-spec]`，找不到就整段 return，
     而**搜尋框 #q 也在同一個 IIFE 裡** —— 不改選擇器的話搜尋框會一起失效。
     所以下面把選擇器放寬成 `.chips [data-spec]`，並把 chips 的 click 監聽
     改成掛在空陣列上（連結本來就會換頁，再跑一次篩選只會閃一下）。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "index.html");

/* 每一科的介紹。**這是新的對外文字，使用者必須逐字看過**（COPY.md）。
   規則：不寫「專業團隊／頂尖設備／歡迎諮詢」那一類；不承諾療效；
   醫療說法盡量取自站上既有的文章，沒有文章的科別要標出來讓使用者確認。

   lede  = 開場一段（三種份量都有）
   std   = 「這一科在處理什麼」（標準與完整才有）
   full  = 再往下的細節（只有完整才有）
   sign  = 什麼時候該來一趟（三種份量都有，條列） */
const TOPICS = {
  perio: {
    label: "牙周治療",
    title: "牙周病治療",
    lede: "牙齦流血、口臭、牙齒開始有點搖 —— 這些多半不是火氣大，是牙周組織正在發炎。牙周病幾乎不會痛，等到感覺不對勁，齒槽骨往往已經流失一半以上。",
    std: [
      ["牙周治療在處理什麼",
       ["牙齒像一棵樹，牙周組織 —— 牙齦與齒槽骨 —— 是托著它的那塊土壤。樹再健康，土鬆了、被慢慢掏空了，還是會開始晃。牙周治療要處理的從來不是牙齒本身，是牙齒站著的那塊地。",
        "成因是牙菌斑。清不乾淨的地方細菌會結成一層生物膜，時間拉長和唾液中的礦物質結合成牙結石，持續釋放毒素刺激牙齦、侵蝕齒槽骨。牙結石刷不掉，而且表面粗糙、更容易讓新的牙菌斑附著上去 —— 它不是清潔問題，是必須由器械清除的東西。"]],
    ],
    signs: [
      "刷牙或用牙線<strong>持續流血超過兩週</strong>。",
      "牙齦由粉紅轉為<strong>暗紅、腫脹</strong>，或按壓會有分泌物。",
      "牙齦萎縮、<strong>牙根外露怕酸</strong>，牙齒看起來變長。",
      "<strong>持續性口臭</strong>，刷完牙沒多久又出現。",
      "牙縫變大、開始<strong>塞食物</strong>，原本不會卡的地方天天卡。",
      "咬東西使不上力，或<strong>牙齒開始搖動、位移</strong>。",
    ],
    full: [
      ["治療分成幾層",
       ["第一步永遠是<strong>清創</strong>，而且沒有捷徑 —— 後面所有進階的療程都是加在它上面，不是拿來取代它。"],
       ["<strong>檢查與牙周探測</strong>：量每顆牙六個點的囊袋深度，搭配 X 光評估骨頭高度，確認嚴重程度。",
        "<strong>洗牙</strong>：清除牙齦上方看得見的牙結石。健保成人每半年給付一次。",
        "<strong>牙根整平術</strong>：局部麻醉、分區進行，清除藏在牙周囊袋裡的結石與感染組織，讓牙齦重新貼合牙根。健保給付。",
        "<strong>水雷射（自費輔助）</strong>：進到手動器械不易貼到的狹窄囊袋與死角，出血與術後不適一般較輕。它提高的是舒適度與死角的完整度，不能取代上面的物理清創。",
        "<strong>牙周再生手術（自費）</strong>：骨缺損嚴重且不規則時，翻瓣清創後填入骨粉、覆蓋再生膜，接下來六到九個月讓骨頭與牙周韌帶長回一部分。效果取決於缺損的形狀。",
        "<strong>維護期</strong>：牙周病是慢性、會復發的疾病，治療結束後每三到六個月回診量囊袋、清掉新長的結石。"],
       ["哪一層適合你，要經過牙周探測與 X 光檢查才能判定 —— 這一頁只能幫你認得訊號，判斷得由醫師來。"]],
    ],
  },

  ortho: {
    label: "齒顎矯正",
    title: "齒顎矯正",
    /* ⚠⚠ 這一科站上**一篇文章都沒有**，所以整頁的份量全靠這段文字撐 ——
       它正是「零文章的科別會不會太空」那個問題的實測對象。
       ⚠ 療程那一段只寫得出站上有憑據的（王俊偉醫師的專長欄寫著「隱適美」、
         〈擴張牙弓〉那篇提到兒童隱適美與肌功能矯正）。**診所實際提供哪些方式，
         要使用者確認之後才能補**，不要自己加「傳統固定式矯正器」這種沒有依據的項目。 */
    lede: "牙齒排列不整齊，影響的不只是好不好看。咬合對不上的時候，某幾顆牙會長期承擔過多的力量，某些位置則怎麼刷都刷不乾淨 —— 蛀牙與牙周問題常常就是從那裡開始的。",
    std: [
      ["矯正在處理什麼",
       ["矯正是用持續而輕微的力量，讓牙齒在齒槽骨裡慢慢移動到該在的位置。受力的一側骨頭吸收、另一側重建，牙齒就這樣一點一點被帶過去。所以它需要時間，也急不得 —— 力量下得太重，牙根與骨頭都會受傷。",
        "要移動就得有空間。空間從哪裡來，是矯正計畫裡最關鍵的一題：小朋友的顎骨還沒定型，可以把牙弓引導得寬一點；成人的骨架已經固定，就得從別的地方挪。"]],
    ],
    signs: [
      "門牙<strong>重疊、擁擠</strong>，或有明顯的縫。",
      "咬起來上下排<strong>對不上</strong>（暴牙、戽斗、開咬、深咬）。",
      "習慣只用<strong>單側咀嚼</strong>，或咬合時特定一顆牙先撞到。",
      "孩子換牙期間，<strong>恆牙一長出來就擠在一起</strong>。",
      "已經在治療牙周，醫師建議<strong>排整齊之後比較好清潔</strong>。",
    ],
    full: [
      ["大人和小孩不是同一件事",
       ["<strong>6 到 12 歲</strong>是顎骨還沒定型的階段，上顎中間的骨縫尚未完全癒合，對外力的反應比成年後好得多。這時候能做的是<strong>引導骨骼發育</strong> —— 把牙弓帶寬，讓後面要長出來的恆牙有位置站，長大後需要拔牙矯正的機率也跟著降低。",
        "<strong>成年之後</strong>顎骨已經定型，能移動的是牙齒本身，不是骨架。同樣的擁擠，這時候要挪出空間就得靠別的辦法，療程也通常比較長。",
        "這是為什麼矯正這件事，早一點評估往往比較省事 —— 不是急著做，是先知道有沒有非趁早不可的部分。"]],
      ["這裡怎麼做",
       ["兩位醫師都是<strong>衛生福利部齒顎矯正專科</strong>。透明牙套（隱適美）與兒童的早期矯正（兒童隱適美、肌功能矯正）都有在做，實際適合哪一種，要照 X 光與口內檢查之後才知道。",
        "矯正是一段長期的關係，中間要固定回診調整。開始之前把療程長度、總費用與分期方式問清楚，比什麼都重要。"]],
      ["拆掉之後才是一半",
       ["牙齒有回到原來位置的傾向，所以矯正結束不等於結束 —— 維持器要戴多久、怎麼戴，由醫師依個別狀況決定。這一步做不好，前面那一兩年會白費。"]],
    ],
  },
};

const SPECS = Object.keys(TOPICS);

/* ---------- 提案頁自己的推導（定案後整段搬進 history/topic-pages.html） ---------- */
const headNote = (spec, t) => `<!-- =============================================================================
     提案：科別著陸頁　${t.label}（preview/topic-${spec}/）　2026-08-18
     -----------------------------------------------------------------------------
     這一頁由 tools/topic-preview.mjs 從 index.html 產生，**是快照，不要手改** ——
     要改內容改那支裡的 TOPICS，要改版型改 index.html 再重跑。

     怎麼走到這個做法的（使用者四輪修正）
     -----------------------------------------------------------------------------
     ① 第一版是自己寫的一頁獨立頁（走 assets/style.css）。使用者：
        「這個跟我首頁已經有的篩選很像欸，以 SEO 或 GEO 來說我覺得還是我的篩選
          其實不太符合 SEO GEO 要件。」——他兩件都說對了。
     ② 「或是篩選點下去，版面就像我剛才說的，但其實是開了另外一個網頁？」
        ＝ chips 從 <button> 換成 <a>。這是整件事的關鍵：按鈕沒有網址，
        爬蟲點不下去、AI 引用不了、也分享不出去；連結才有。
     ③ 「把主題與科別標籤繼續做在新開啟的網頁上」＝ 那一排變成全站的科別導覽列，
        每一頁都帶著它、目前在哪一科就哪一顆亮。這一補把 chips 變連結原本會失去的
        「即時切換」補回來了，而且長出一張內部連結網（八頁互連，錨點文字正好是科別名）。
     ④ 「搜尋框還是留著，現在首頁怎麼做的著陸頁就怎麼做，只是增加篩選下的
          科別說明或介紹而已。」＝ 所以這一頁是 index.html 的快照，不是另外寫的版型。

     兩個和 SEO 有關、不能省的處理
     -----------------------------------------------------------------------------
     ・文章與醫師是**真的刪掉**，不是靠 JS 藏起來 —— 靠 JS 篩的話 Google 抓到的
       仍然是七科全部，這一頁就不是這一科的頁了，繞回原點（同第一節第 1 條的精神）。
     ・HERO 拿掉：那張照片與那首詩是全站門面，七頁各放一次會稀釋掉它，
       也會把真正的內容推到很下面。

     切換條：科別介紹的份量（精簡／標準／完整），面板現場量 #main 的可見字數。
     這一格真正要解的是**矯正這一頁**——它一篇文章都沒有，全靠文字撐。

     定案後要做的（都還沒做）
     -----------------------------------------------------------------------------
     ・網址 /preview/topic-<spec>/ → /topics/<spec>/，補 canonical、JSON-LD
       （MedicalWebPage ＋ 指回 #dentist）、sitemap 各一筆。
     ・首頁那一排 chips 也要換成同一組連結（不然同一個東西在首頁是篩選、
       在別頁是換頁，行為不一致）。
     ・七科要全部寫完才切換 —— 標記連到空頁比現在還糟。
     ・tp-* 的樣式搬進 index.html 的樣式表，pv-* 與 tp-when-* 一起刪掉。
     ⚠ 矯正那頁「這裡怎麼做」那一段只寫得出站上有憑據的（王俊偉醫師專長欄的
       「隱適美」、〈擴張牙弓〉提到的兒童隱適美與肌功能矯正）。
       **診所實際提供哪些方式要使用者確認之後才能補。**
     ============================================================================= -->`;

/* ---------- 產生「科別介紹」那一塊 ---------- */
const introBlock = (spec, t) => {
  const secs = (list, cls) =>
    list.map(([h, ...groups]) =>
      `        <div class="tp-sec ${cls}">\n` +
      `          <h2>${h}</h2>\n` +
      groups.map((g) =>
        Array.isArray(g) && g.length && /^</.test(g[0]) && g[0].startsWith("<strong")
          ? `          <ul>\n${g.map((li) => `            <li>${li}</li>`).join("\n")}\n          </ul>`
          : g.map((p) => `          <p>${p}</p>`).join("\n")
      ).join("\n") +
      `\n        </div>`
    ).join("\n");

  return `
      <!-- ===== 科別介紹（提案中）=====================================
           使用者 2026-08-18：「篩選點下去 版面就像我剛才說的 但其實是開了
           另外一個網頁」＋「主題與科別標籤繼續做在新開啟的網頁上」。
           所以這一塊就長在標記那一排底下，其餘版面和首頁完全一樣。
           ⚠ 這是**新的對外文字**，要逐字看過再上。 -->
      <div class="tp-intro">
        <h1>${t.title}</h1>
        <p class="tp-lede">${t.lede}</p>
${secs(t.std, "tp-when-std")}
        <div class="tp-sec">
          <h2>什麼時候該來一趟</h2>
          <ul>
${t.signs.map((s) => `            <li>${s}</li>`).join("\n")}
          </ul>
        </div>
${secs(t.full, "tp-when-full")}
        <p class="tp-note">本段為一般口腔衛教資訊，不能取代臨床診斷。實際狀況需經檢查後由醫師評估。</p>
      </div>
`;
};

/* ---------- 主流程 ---------- */
const src = fs.readFileSync(SRC, "utf8");

for (const spec of SPECS) {
  const t = TOPICS[spec];
  let h = src;

  /* 1. 相對路徑往上兩層。
     ⚠ **srcset 要另外處理** —— 正規式寫 `\s(href|src)="` 抓不到 `srcset="`
       （src 後面接的是 set=，不是 ="），第一版就是這樣讓兩張卡片圖 404 的。
       srcset 的值是「網址 寬度」用逗號分隔的清單，每一段的開頭都要換。
     ⚠ 不用 <base href="/"> 代替 —— 那會讓 #topics 這種錨點跳回首頁。 */
  h = h.replace(/(\s(?:href|src)=")(assets\/|posts\/|site\.webmanifest)/g, "$1../../$2");
  h = h.replace(/srcset="([^"]*)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)assets\//g, "$1../../assets/")}"`);

  /* 2. HERO 整塊拿掉（窄帶、詩、瀏覽計數的掛勾都在裡面一起消失） */
  const hs = h.indexOf('  <div class="hero">');
  const he = h.indexOf('  <section id="topics">');
  if (hs === -1 || he === -1) throw new Error("找不到 HERO 或 #topics 的邊界");
  h = h.slice(0, hs) + `  <!-- HERO 在著陸頁上拿掉：那張照片與那首詩是全站的門面，
       七頁各放一次會把它稀釋掉，而且會把真正的內容推到很下面。 -->\n` + h.slice(he);

  /* 3. 首頁那個 sr-only 的 h1 拿掉 —— 這一頁的 h1 是科別名（在介紹那一塊裡） */
  h = h.replace(/\s*<h1 class="sr-only">[^<]*<\/h1>/, "");

  /* 4. chips：<button> → <a>，指到各自的提案頁；目前這一科標成 current
     ⚠⚠ **只能換 <ul class="chips"> 裡面那一排。** 門診表底下還有一排長得幾乎一樣的
        科別標記（.hours-filter），它是那張表自己的篩選器，換成連結會讓人一點就被
        帶去別的頁 —— 第一版沒有限定範圍，8 顆全部被改掉了。 */
  const cs = h.indexOf('<ul class="chips">');
  const ce = h.indexOf("</ul>", cs);
  if (cs === -1 || ce === -1) throw new Error("找不到 chips 那一排");
  const chipsHtml = h.slice(cs, ce).replace(
    /<button type="button" data-spec="([a-z]+)"\s*aria-pressed="(?:true|false)">([^<]*)<\/button>/g,
    (_m, s, label) => {
      const href = s === "all" ? "../../" : `../${"topic-" + s}/`;
      const cur = s === spec;
      const known = s === "all" || SPECS.includes(s);
      /* ⚠ 連結上**不要**寫 aria-pressed —— 那是給 role="button" 用的，
         放在 <a> 上是無效的 ARIA。連結的「目前這一頁」是 aria-current="page"。
         樣式那一側由下面第 8.5 步把 CSS 選擇器一起改掉，外觀完全不變。 */
      return `<a href="${known ? href : "#"}" data-spec="${s}"` +
             (cur ? ' aria-current="page"' : "") +
             (known ? "" : ' data-todo="還沒做這一頁"') + `>${label}</a>`;
    }
  );
  h = h.slice(0, cs) + chipsHtml + h.slice(ce);

  /* 5. 科別介紹插在標記那一排底下（.filter-note 之前） */
  h = h.replace('      <p class="filter-note" hidden></p>', introBlock(spec, t) + '      <p class="filter-note" hidden></p>');

  /* 6. 文章：不是這一科的**真的刪掉**（不是藏起來，理由見檔頭） */
  h = h.replace(/\n\s*<a class="card"[\s\S]*?<\/a>/g, (m) => {
    const s = /data-spec="([a-z]+)"/.exec(m);
    return s && s[1] === spec ? m : "";
  });

  /* 7. 醫師：專科或專長命中才留（和站上 2026-08-11 那一輪同一條規則） */
  h = h.replace(/\n\s*<article class="doc"[\s\S]*?<\/article>/g, (m) => {
    const own = new RegExp(`<article class="doc" data-spec="${spec}"`).test(m);
    const skill = new RegExp(`class="sk" data-spec="${spec}"`).test(m);
    return own || skill ? m : "";
  });

  /* 8.5 樣式：站上所有 chips 的規則都寫 `.chips button`，換成連結之後會整組掉光
     （第一版就是這樣，標記變成一排純文字）。用 :is(button,a) 一次涵蓋兩種，
     ⚠ 而且**權重不變** —— :is() 取參數裡最高的那一個，button 與 a 都是型別選擇器。
     「目前這一頁」那一條再單獨改成同時吃 aria-pressed（按鈕版）與
     aria-current（連結版），這樣正式站不管走哪一種都不必再改一次 CSS。 */
  h = h.split(".chips button").join(".chips :is(button,a)");
  h = h.split('.chips :is(button,a)[aria-pressed="true"]')
       .join('.chips :is(button[aria-pressed="true"],a[aria-current="page"])');

  /* 8. 篩選 JS：選擇器放寬（否則搜尋框會一起失效），並且不要在連結上掛 click */
  h = h.replace(".chips button[data-spec]", ".chips [data-spec]");
  h = h.replace(
    "Array.prototype.forEach.call(chips, function (btn) {\n    btn.addEventListener('click'",
    "Array.prototype.forEach.call([], function (btn) {   /* 提案頁：chips 是連結，不掛 click */\n    btn.addEventListener('click'"
  );

  /* 9. counter.js 拿掉 */
  h = h.replace(/\n<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/, "");

  /* 10. <head>：noindex、標題、拿掉 canonical 與 SEO 產生區塊 */
  h = h.replace(/<title>[^<]*<\/title>/, `<title>提案：科別著陸頁（${t.label}） — 芳仁牙醫診所</title>`);
  h = h.replace(/<link rel="canonical"[^>]*>\n?/, "");
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, "<!-- 提案頁不產生 SEO 區塊 -->");
  h = h.replace("<head>", '<head>\n<meta name="robots" content="noindex, nofollow, noarchive">\n' + headNote(spec, t));

  /* 11. 樣式與切換條，插在**最後一個** </body> 前面 */
  const bar = fs.readFileSync(path.join(ROOT, "tools", "topic-preview-bar.html"), "utf8");
  const b = h.lastIndexOf("</body>");
  h = h.slice(0, b) + bar + h.slice(b);

  const dir = path.join(ROOT, "preview", `topic-${spec}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), h, "utf8");

  const text = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
                .replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s/g, "");
  console.log(`preview/topic-${spec}/  文章 ${(h.match(/class="card"/g) || []).length} 篇・` +
              `醫師 ${(h.match(/class="doc"/g) || []).length} 位・可見字約 ${text.length}`);
}
