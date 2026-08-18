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

/* 文案在 tools/topic-copy.mjs（獨立一檔，之後只要改那一份）。
   ⚠ 沒有「對照舊版」那一格了：使用者已經連退兩版，拿被否決的草稿當對照
     不是他要做的決定，留著只是讓這一頁變長。 */
import { TOPICS } from "./topic-copy.mjs";

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

/* ---------- 產生「科別介紹」那一塊 ----------
   形狀（2026-08-18 使用者連退兩次之後定的）：
     開場兩段短句 → （症狀清單，預設不放）→ 三組一問一答。
   目標 **250 字上下、明顯不到一屏**。第一版 825 字／2.1 屏，第二版 388 字／1.2 屏。

   ⚠⚠ 第三次回退時使用者講出了真正的判準，這一段比任何數字都重要：
     「想想看什麼樣的人才需要自己在家裡花時間從網站上找資訊、找自己覺得合適的
       診所或醫師。……他可能找了好幾個醫師或問了很多朋友，但依然覺得困惑、
       資訊紊亂，可是看到這個著陸頁覺得『這間診所我願意試試看』……
       至少這個網站看起來願意懂我。從這個基礎，我覺得不能寫太多。」
     所以這一頁的工作**不是把事情講清楚，是讓他覺得被看見** ——
     他已經被資訊淹沒了，再堆一段衛教上去等於再推他一次。詳見 COPY.md 第九之七節。
   ⚠ 問答那一塊刻意用 <dl>，和文章末尾的「重點整理」同一個語彙 ——
     短、好掃，而且 AI 搜尋抓的正是這種一問一答的段落。 */

/* [[…]] 是還沒問過使用者的待填格，在提案頁上標成醒目的樣子。 */
const todo = (t) => t.replace(/\[\[([^\]]*)\]\]/g, '<span class="tp-todo">$1</span>');

const introBlock = (spec, t) => `
      <!-- ===== 科別介紹（提案中）=====================================
           使用者 2026-08-18：「篩選點下去…其實是開了另外一個網頁」＋
           「主題與科別標籤繼續做在新開啟的網頁上」。所以這一塊就長在
           標記那一排底下，其餘版面和首頁完全一樣。
           ⚠ 這是**新的對外文字**，要逐字看過再上。文案在 tools/topic-copy.mjs。 -->
      <div class="tp-intro">
        <h1>${t.h1}</h1>
${t.lede.map((x) => `        <p class="tp-lede">${todo(x)}</p>`).join("\n")}

        <!-- 症狀清單：**預設不顯示**。它讓人自我檢查，不是讓人覺得被理解 ——
             是健檢問卷的聲音，不是陪伴的聲音。留成切換條的一格讓使用者選。 -->
        <div class="tp-checks">
          <p class="tp-checks-h">這些狀況，該來看一下</p>
          <ul>
${t.checks.map((c) => `            <li>${todo(c)}</li>`).join("\n")}
          </ul>
        </div>

        <dl class="tp-qa">
${t.qa.map(([q, a]) => `          <dt>${q}</dt>\n          <dd>${todo(a)}</dd>`).join("\n\n")}
        </dl>

      </div>

`;

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

  /* 5.5 免責聲明放在頁面內容的最後（診所資訊之前），不要卡在開場的答案前面 ——
     文章頁本來就是這樣排的（.note 是 .post-body 的最後一個元素）。
     2026-08-18 使用者說「字太多、篇幅太長」之後搬的：它是必要的但不是他要看的，
     擺在開場裡等於在他問的問題前面先擋一段免責。 */
  h = h.replace('  <section id="clinic">',
    '  <p class="tp-note wrap-note">本頁為一般口腔衛教資訊，不能取代臨床診斷。實際狀況需經檢查後由醫師評估。</p>\n\n  <section id="clinic">');

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
