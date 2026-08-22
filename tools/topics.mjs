#!/usr/bin/env node
/* =============================================================================
   科別著陸頁產生器：topics/<spec>/index.html（七科，2026-08-21 上線）
   -----------------------------------------------------------------------------
   用法：node tools/topics.mjs

   ⚠⚠ **這支不是一次性腳本，也不是提案頁產生器了。** 它產出的七頁就是正式站上的
     /topics/<spec>/，所以：
     ・**改完 index.html 之後要自己跑一次這支**（build.mjs 不會呼叫它），
       否則七頁會停在舊版 —— 首頁新增文章、改版面、改頁尾都算。
     ・**topics/ 底下的 HTML 不要手改**，下次重跑就沒了。文案改 topic-copy.mjs、
       版型改這一支。
     ・原名 tools/topic-preview.mjs（產出到 preview/topic-<spec>/、帶 noindex），
       上線那天改名並改輸出路徑。舊名字在 COPY.md／history 裡還看得到。

   為什麼是「拿 index.html 當底」而不是自己寫一頁：
   使用者 2026-08-18 定案 ——「搜尋框還是留著，現在首頁怎麼做的著陸頁就怎麼做，
   只是增加篩選下的科別說明或介紹而已」。照這個做法，chips、搜尋框、醫師卡、
   門診表、地圖的 CSS 與 JS 全部沿用，不必抄第二份、也不會走樣。

   -----------------------------------------------------------------------------
   這支做了什麼（每一項都是為了避開 CLAUDE.md 第八節那幾個陷阱）
   -----------------------------------------------------------------------------
   1. 相對路徑往上兩層。**不用 <base href="/">** —— 那會讓 #topics 這種錨點跳回首頁。
   2. ⚠ **counter.js 留著**（2026-08-21 改的，原本是拿掉）。這七頁是正式站的頁，
      文章卡上的瀏覽次數不能印成一條「—」。安全是因為 HERO 拿掉時
      data-views-self 跟著消失了 —— 只剩唯讀的 data-views，不會替任何一篇 +1。
      第 9 步有兩條 assert 在守這件事。
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

/* 正式站網址（sitemap、canonical、JSON-LD 都要）。和 build.mjs 讀同一份，
   ⚠ 不要在這裡寫死網域 —— site.json 是唯一的出處。 */
const SITE = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url.replace(/\/$/, "");
if (!SITE) throw new Error("site.json 沒有 url，著陸頁的 canonical 與 JSON-LD 產不出來");

/* 純文字（給 description 與 JSON-LD 用）：把 <strong> 這類標記拿掉。 */
const plain = (x) => String(x).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/* 每一頁自己的 description。
   ⚠⚠ **不要另外寫一份行銷文案** —— 用這一頁開場那幾句自己的話接起來，
     頁面上寫什麼、搜尋結果就顯示什麼，兩邊不可能對不起來（同 build.mjs
     從 <main> 取 description 的做法）。
   ⚠ Google 大約在 155~160 個半形字元截斷，中文抓 78 字左右。 */
const descOf = (t) => {
  const head = t.lead ? plain(t.lead) : plain(t.stance || "");
  const body = (t.groups ? t.groups[0].cases : t.cases).slice(0, 2).map(plain).join("");
  const d = `${t.h1}｜${head}${body}`.replace(/。。/g, "。");
  return d.length > 78 ? d.slice(0, 77) + "…" : d;
};

/* 這一頁的 <head> SEO 區塊。快照下來的那一段是 build.mjs 為**首頁**產的，
   整段換掉，否則七頁會一起宣告自己是首頁。
   ⚠ 用 MedicalWebPage：這一頁確實是在描述一個醫療科別，而且它**不宣告
     lastReviewed**（CLAUDE.md 第十節第 2 條：宣告一個沒有人做的審閱等於造假）。
   ⚠ 診所節點只放 @id 指回首頁的 #dentist，不重抄一份（第十節第 1 條）。
   ⚠⚠ **og:image 2026-08-22 起由這裡產**（原本沿用 index.html 手寫的那張夜景）。
     規則只有一條：**`assets/og-topic-<spec>.jpg` 存在就用它，沒有就退回首頁那張
     分享圖**（`assets/og-home.jpg`，1200×628），所以還沒畫圖的科目照樣有圖、
     不是空白卡。目前只有 general 有自己的圖（2026-08-22 定稿，十六輪）。
     ⚠⚠ **退路 2026-08-22 稍晚從 `hero-clinic-night.jpg` 換成 `og-home.jpg`**：
       前者是 1600×1058 ＝ **1.512:1**，而 LINE 不裁圖、照原比例顯示 ——
       那張會長成一張又高又暗的卡（平均 L* 21.3、幾乎全黑 48.0%），
       而且照片裡的招牌在 212px 的卡上只有幾個像素寬，**等於沒有識別**。
       `og-home.jpg` 是同一張照片但裁成 1.91:1、左上有標誌與診所名、
       下緣有那三格，退到它至少還認得出是誰。
     ⚠ 尺寸寫死 1200×628 是**分享卡的規格**（ILLUSTRATION.md 第十一節），
       和文章 HERO 的 2000×1116 是兩套，不要互相套用。圖用 tools/og-resize.mjs 產。
     ⚠ 既然這裡開始產 og:image，**步驟 10 就必須把手寫的那組一起刪掉** ——
       重複的 og 屬性，FB／LINE 一律取第一個（2026-08-22 那一輪的教訓）。
     ⚠ 不要拿別科文章的 HERO 頂：會缺圖的正好是文章最少的那幾科。 */
const OG_FALLBACK = { file: "assets/og-home.jpg", w: 1200, h: 628,
                      alt: "入夜後的永樂街街角，芳仁牙醫診所的清水模建築與亮著燈的騎樓；左上是診所標誌與名稱，下緣一條深色帶寫著 1983年中華路開業、9位醫師駐診、5個部定專科" };
/* ⚠ alt 要描述**圖裡實際有什麼**，不是抄標題（ILLUSTRATION.md 第七節第 4 條）。 */
const OG_ALT = {
  general: "白天的永樂街轉角，芳仁牙醫診所的騎樓前：醫師和牽著腳踏車的老先生站著聊天，"
         + "小男孩向對街的醫師揮手，學生騎車經過。",
};
const ogImage = (spec) => {
  const rel = `assets/og-topic-${spec}.jpg`;
  if (!fs.existsSync(path.join(ROOT, rel))) return OG_FALLBACK;
  return { file: rel, w: 1200, h: 628, alt: OG_ALT[spec] || OG_FALLBACK.alt };
};

const seoBlock = (spec, t, canonical, cnt) => {
  const desc = descOf(t);
  /* ⚠⚠ 兩個標題刻意不一樣（2026-08-22 使用者指定）：
     ・<title>（下面步驟 10）＝ `… — 芳仁牙醫診所（雲林斗六）`
       地名留著，那是給搜尋引擎與分頁列看的（首頁那一條「牙醫診所＋斗六」
       正是真正在被搜尋的字，見 index.html 開頭的註解）。
     ・og:title ＝ **不帶地名**。使用者：「訊息標題有（雲林斗六），
       這個應該是在網站裡的，可以拿掉不要在這裡顯示嗎」——
       分享卡上地名已經壓在圖裡的玻璃帶上了（tools/og-plate.mjs），
       卡片標題再寫一次就是同一句話講兩遍。
     ⚠ JSON-LD 的 name 跟著 <title> 那一版（機器讀的東西要完整）。 */
  const titleFull = `${t.h1} — 芳仁牙醫診所（雲林斗六）`;
  const title = `${t.h1} — 芳仁牙醫診所`;
  const og = ogImage(spec);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: titleFull,
        description: desc,
        inLanguage: "zh-Hant-TW",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#dentist` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: t.label },
        ],
      },
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "芳仁牙醫診所", inLanguage: "zh-Hant-TW" },
      { "@type": "Dentist", "@id": `${SITE}/#dentist`, name: "芳仁牙醫診所", url: `${SITE}/` },
    ],
  };
  return `<!-- SEO:START — 由 tools/topics.mjs 產生，請勿手動編輯 -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:locale" content="zh_TW">
<meta property="og:image" content="${SITE}/${og.file}">
<meta property="og:image:width" content="${og.w}">
<meta property="og:image:height" content="${og.h}">
<meta property="og:image:alt" content="${og.alt}">
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<!-- SEO:END -->`;
};

/* ---------- 提案頁自己的推導（定案後整段搬進 history/topic-pages.html） ---------- */
const headNote = (spec, t) => `<!-- =============================================================================
     科別著陸頁　${t.label}　/topics/${spec}/
     -----------------------------------------------------------------------------
     ⚠⚠ **這一頁是產生出來的，不要手改。**
       由 tools/topics.mjs 從 index.html 產生（是那一份的快照）。
       ・要改**文字** → tools/topic-copy.mjs
       ・要改**版型或樣式** → index.html（著陸頁的樣式在它樣式表的最後一段）
       改完跑 \`node tools/topics.mjs\`，七頁一起重產。

     為什麼是「index.html 的快照」而不是自己寫一頁（2026-08-18 使用者定案）
     -----------------------------------------------------------------------------
     「現在首頁怎麼做的著陸頁就怎麼做，只是增加篩選下的科別說明或介紹而已。」
     照這個做法，chips、搜尋框、醫師卡、門診表、地圖的 CSS 與 JS 全部沿用，
     不必抄第二份、也不會走樣。

     兩個和 SEO 有關、不能省的處理
     -----------------------------------------------------------------------------
     ・**別科的文章與醫師是真的刪掉，不是靠 JS 藏起來** —— 靠 JS 篩的話
       Google 抓到的仍然是七科全部，這一頁就不是這一科的頁了，繞回原點
       （同 CLAUDE.md 第一節第 1 條的精神）。
     ・**chips 是 <a> 不是 <button>** —— 按鈕沒有網址，爬蟲點不下去、
       AI 引用不了、也分享不出去。那一排同時是全站的科別導覽列，
       八頁互連，錨點文字正好是科別名。

     ⚠ 「按下那一科」的套色（醫師專長淡色填滿、專科藥丸退階、文章標籤套色）
       是在**產生時就寫進 HTML** 的（第 7.5 步）—— 那三件在首頁是 JS 掛的 class，
       而這一頁的 chips 已經是連結、沒有人按，JS 不會跑到那一段。

     文字的推導、每一科被退回幾次、為什麼這樣寫：COPY.md 第九節（九之一 ~ 九之十九），
     方法的總表在第九之十七節「著陸頁的檢查表」。
     ============================================================================= -->`;

/* ---------- 產生「科別介紹」那一塊 ----------
   形狀（2026-08-18 使用者連退兩次之後定的）：
     三種處境（一種一段）→ 一句同時回答三個人 → （症狀清單，預設不放）→「第一次來，大概是這樣」。
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

/* 「幾篇文章、幾位醫師」。**在產生時就算好寫進 HTML**，不是靠 JS ——
   同第一節第 1 條的精神（爬蟲與無 JS 都要看得到）。
   ⚠ 0 的那一項整個不寫：矯正那頁是 0 篇文章，原樣印出來等於在自曝其短。
     首頁那個 .filter-note 會印 0 是因為它是「你剛按下去的篩選結果」，
     著陸頁的身分不同 —— 這一頁是那一科的門面。 */
const countLine = (n, d) => {
  /* 形式：`2 位醫師 ・ 2 篇文章`（2026-08-18 使用者定案）。
     走到這裡改過三輪，每一輪解掉一件事：
       ①「2 篇文章・2 位醫師」→ 文章排第一，讀起來像在宣告這一科的內容就是那兩篇。
       ②「文章 2 篇・醫師 2 位」→ 數字退後了，但「文章」還是第一個名詞。
       ③「駐診醫師 2 位…」→ 醫師排到前面，方向對了，但限定詞多餘。
       ④ 定案：**醫師在前、數字用平常的講法**，其餘什麼都不加。

     ⚠⚠ 連結範圍與視覺**刻意不一樣**：
       ・`<a>` 包整串「2 位醫師」—— 只包兩個字的話觸控目標太小。
       ・顏色與底線**只上在名詞**（.tp-t），數字（.tp-n）維持內文的柔墨。
         使用者：「連結底線放在醫師、文章，數字不要套標籤顏色。」
     ⚠ 底線用 `border-bottom` 不用 `text-decoration` —— text-decoration 會
       傳給所有子元素，而且子元素**沒辦法**用 `text-decoration: none` 取消掉，
       數字那一段會跟著被畫線。 */
  const link = (href, num, noun) =>
    `<a href="${href}"><span class="tp-n">${num}</span><span class="tp-t">${noun}</span></a>`;
  const dot = '<span class="tp-dot" aria-hidden="true">・</span>';
  const parts = [];
  if (d) parts.push(link("#doctors", `${d} 位`, "醫師"));
  if (n) parts.push(link("#articles", `${n} 篇`, "文章"));
  return parts.length ? parts.join(dot) : "";
};

const introBlock = (spec, t, cnt) => `
      <!-- ===== 科別介紹（2026-08-18 版面定案）==========================
           走到這個版面經過使用者七輪修正，推導寫在 COPY.md 第九節。
           順序：h1 → 幾位醫師幾篇文章 →〔開場句 lead〕→ 三個處境 →〔一句回應 stance〕
           → 流程（標題在 topic-copy.mjs 的 flowTitle）→ 收尾。
           ⚠⚠ 第三種節奏（2026-08-19，兒牙用的）：**groups** ——
             把現場分成兩組，**每一組後面各接一句回應**（一組 cases ＋ 一個 reply）。
             適合「這一科其實有兩種很不一樣的人」的時候：
             兒牙是「沒喊痛但怪怪的」與「已經很痛又不肯配合」。
             ⚠ 用 groups 就不要再寫 lead —— 兩種都想收的那一句話會寫成
               「苦的香的我們都有賣」（使用者的原話），那是攤販不是診所。
             ⚠⚠ 這一段註解裡**不要出現反引號** —— 它在模板字串裡面
               （CLAUDE.md 第八節那個坑，hero-line3 那一輪踩過）。
           ⚠⚠ **lead 與 stance 是兩種節奏，一科只挑一種**（2026-08-19）：
             ・stance 在後 ＝ 先讓他對號入座，再一句話回完（牙周）。
             ・lead 在前 ＝ 先把最重要的那句話講掉，再舉例（兒牙：家長最想聽的
               是「這不是孩子的體質」，那句話擺後面就太晚了）。
             **不要兩個都給** —— 那會變成同一件事講兩次，而且七頁長得一模一樣
             就是使用者說的「看起來像複製貼上」。
           ⚠⚠ **整塊要收在手機的一屏之內**（2026-08-18 使用者第二輪）：
             「這樣子的內容我希望在這個版面上能都放進去，而且要讓他覺得下面還有
               東西往下滑 —— 著陸頁的文案不能超過這個版面。」
             所以每一步一行、三種處境也各一行。改文案之後要重量一次，
             量法與基準寫在 COPY.md 第九之十節。
           ⚠ 文字在 tools/topic-copy.mjs，**不要改這裡**。 -->
      <div class="tp-intro">
        <h1>${t.h1}</h1>
        <p class="tp-count">${countLine(cnt.a, cnt.d)}</p>
${t.lead ? `        <p class="tp-lead">${todo(t.lead)}</p>\n` : ""}\
${(t.groups || [{ cases: t.cases, reply: t.stance }])
  .map(
    (g) =>
      g.cases.map((x) => `        <p class="tp-case">${todo(x)}</p>`).join("\n") +
      (g.reply ? `\n        <p class="tp-reply">${todo(g.reply)}</p>` : "")
  )
  .join("\n")}

        <div class="tp-first">
          <p class="tp-first-h">${t.flowTitle}</p>
${t.flow.map(([k, v]) => `          <p class="tp-step"><b>${k}</b>${todo(v)}</p>`).join("\n")}
          <p class="tp-close">${todo(t.close)}</p>
        </div>
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

  /* 2.5 <body> 加 data-topic。用途有二：
     ① 讓「拿掉 HERO 之後要讓開固定頁首」那條規則只作用在著陸頁 ——
        **首頁的 HERO 是刻意鑽到頁首底下的**，同一條規則套上去會把它推下來。
     ② 定案搬進 index.html 的樣式表時，選擇器不必再改一次。 */
  /* ⚠⚠ **這裡不能用 `h.replace("<body>", …)`** —— 和 CLAUDE.md 第八節那個
     `</body>` 的坑是同一個，只是開頭標籤版：index.html 的 CSS 註解裡就寫著
     「見 <body> 裡的註解」（`.hero-poem .g` 那一段），字面上先出現，
     String.replace 只換第一個，於是屬性被塞進註解裡、真正的 <body> 原封不動。
     **症狀是完全不報錯**：規則解析得好好的，只是永遠選不到東西。
     真正的 <body> 是**整行只有它**，所以用行首錨點的正規式。 */
  const bodyRe = /^<body>$/m;
  if (!bodyRe.test(h)) throw new Error("找不到行首的 <body>，index.html 的結構可能改過了");
  h = h.replace(bodyRe, `<body data-topic="${spec}" data-spec="${spec}">`);

  /* 3. 首頁那個 sr-only 的 h1 拿掉 —— 這一頁的 h1 是科別名（在介紹那一塊裡） */
  h = h.replace(/\s*<h1 class="sr-only">[^<]*<\/h1>/, "");

  /* 4. chips：把「目前這一頁」從首頁的「全部」移到這一科。
     -----------------------------------------------------------------------
     ⚠⚠ **2026-08-21 上線之後這一步的工作變了。** 上線前 index.html 的 chips
       還是 <button>，這一步負責把它們換成 <a> 並補 href；上線那天首頁自己
       也換成連結了（六件事的第 ⑥ 件），所以快照下來就已經是
       `<a href="/topics/…">`，**href 不必再補**。
       剩下唯一要做的是**把 aria-current="page" 搬過來** ——
       快照帶著的是首頁那一顆（「全部」），照抄的話七頁都會宣稱自己是首頁。
     ⚠⚠ **只能動 <ul class="chips"> 裡面那一排。** 門診表底下還有一排長得
       幾乎一樣的科別標記（.hours-filter），那是那張表自己的篩選器 ——
       第一版沒有限定範圍，8 顆全部被改掉了。 */
  const cs = h.indexOf('<ul class="chips">');
  const ce = h.indexOf("</ul>", cs);
  if (cs === -1 || ce === -1) throw new Error("找不到 chips 那一排");
  let chipsHtml = h.slice(cs, ce);
  if (/<button[^>]*data-spec=/.test(chipsHtml))
    throw new Error("chips 還是 <button> —— index.html 應該在 2026-08-21 就換成 <a> 了");
  /* 先把快照帶來的 aria-current 一律拿掉，再只掛在這一科身上。
     ⚠ 連結上**不要**寫 aria-pressed —— 那是給 role="button" 用的，
       放在 <a> 上是無效的 ARIA。連結的「目前這一頁」就是 aria-current。 */
  chipsHtml = chipsHtml.replace(/\s*aria-current="page"/g, "");
  chipsHtml = chipsHtml.replace(
    new RegExp(`(<a\\b[^>]*\\bdata-spec="${spec}")`),
    '$1 aria-current="page"'
  );
  if (!chipsHtml.includes('aria-current="page"'))
    throw new Error(`chips 那一排找不到 data-spec="${spec}"，index.html 的科別可能改過了`);
  h = h.slice(0, cs) + chipsHtml + h.slice(ce);

  /* 5. 科別介紹插在標記那一排底下（.filter-note 之前） */
  /* 先算這一科實際留下幾篇、幾位（下面第 6、7 步才真的刪，所以這裡先數一次
     整份 index.html 裡屬於這一科的，數法和那兩步的判斷完全一致）。 */
  const cnt = {
    a: (h.match(/<a class="card"[^>]*data-spec="[a-z]+"/g) || [])
         .filter((m) => m.includes(`data-spec="${spec}"`)).length,
    d: (h.match(/\n\s*<article class="doc"[\s\S]*?<\/article>/g) || [])
         .filter((m) => new RegExp(`<article class="doc" data-spec="${spec}"`).test(m)
                     || new RegExp(`class="sk" data-spec="${spec}"`).test(m)).length,
  };

  /* 順序：chips → .filter-note → 開場那一整塊。
     ⚠ `.filter-note` 一定要留著：搜尋時的結果摘要（「牙周」：n 篇、m 位）
       是寫進那個元素的，拿掉的話搜尋框打字就沒有任何回饋了。 */
  const NOTE = '      <p class="filter-note" hidden></p>';
  h = h.replace(NOTE,
    NOTE + '\n' +
    introBlock(spec, t, cnt));

  /* 5.2 搜尋框搬到「主題與科別」那一列、靠右（2026-08-18 使用者：
     「搜尋欄佔了版面很大空間，看起來可以移到主題與科別的高度，然後靠右一點」）。
     手機上它原本自己佔一整列（≤720 的 `.topic-tools { display: block }`），
     連內距大約 60px —— 而那一列的右邊本來就是空的。
     ⚠ `.sec-head` 是「主題與科別／醫師介紹／診所資訊」三節共用的，
       樣式一定要限定 `#topics .sec-head`，不然另外兩節的標題也會被改成兩欄。
     ⚠ 手機的 `font-size: 16px` 不能動 —— 低於 16 的話 iOS Safari 一聚焦
       就會把整頁放大（站上那段註解寫著這件事）。 */
  const SEARCH_BLOCK = `        <div class="topic-search">
          <label class="sr-only" for="q">搜尋文章與醫師</label>
          <input id="q" type="search" placeholder="搜尋文章與醫師" autocomplete="off" spellcheck="false">
        </div>\n`;
  if (h.includes(SEARCH_BLOCK)) {
    h = h.replace(SEARCH_BLOCK, "");
    h = h.replace("        <h2>主題與科別</h2>\n",
      "        <h2>主題與科別</h2>\n" + SEARCH_BLOCK);
  } else {
    throw new Error("找不到搜尋框那一段，index.html 的結構可能改過了");
  }

  /* 5.5 免責聲明放在頁面內容的最後（診所資訊之前），不要卡在開場的答案前面 ——
     文章頁本來就是這樣排的（.note 是 .post-body 的最後一個元素）。
     2026-08-18 使用者說「字太多、篇幅太長」之後搬的：它是必要的但不是他要看的，
     擺在開場裡等於在他問的問題前面先擋一段免責。 */
  h = h.replace('  <section id="clinic">',
    '  <p class="tp-note">本頁為一般口腔衛教資訊，不能取代臨床診斷。實際狀況需經檢查後由醫師評估。</p>\n\n  <section id="clinic">');

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

  /* 7.5 **把首頁按下那一科時的「亮起來」靜態套上去**（2026-08-21 使用者：
     「這個預覽頁沒有像之前首頁篩選那樣把醫師專長的效果套上去，這個也要做」）。
     -----------------------------------------------------------------------
     首頁那三件是 JS 在按下 chip 時掛的 class（index.html 那支篩選 IIFE）：
       ・`.doc-role`（專科藥丸）→ 不是這一科就加 `tag-off`（退成白底字套色）
       ・`.sk`（專長標記）→ 命中這一科就加 `tag-on`（淡色填滿）
       ・`.card-tag`（文章卡的主題標籤）→ 是這一科就加 `tag-on`（套色填滿）
     ⚠⚠ **著陸頁上那支 JS 不會跑到這一段** —— 它是「按下 chip」才觸發的，
       而這一頁的 chips 已經換成連結、沒有人按。所以要在**產生時就寫進 HTML**，
       這也和第一節第 1 條的精神一致（爬蟲與無 JS 都要看得到）。
     ⚠ 規則和站上那支**逐條對齊**，不是另外發明一套：
       篩選留下來的醫師有兩種（專科就是這一科／專長命中這一科），
       前者藥丸不動、後者藥丸要 tag-off —— 正是「專科藥丸 ≠ 那一科就退一階」。
     ⚠ 這一步要放在第 6、7 步**之後**：那兩步已經把別科的卡與醫師刪掉了，
       這裡處理的都是留下來的，不必再判斷一次要不要顯示。 */
  h = h.replace(/\n\s*<article class="doc"[\s\S]*?<\/article>/g, (m) => {
    const own = new RegExp(`<article class="doc" data-spec="${spec}"`).test(m);
    let out = m;
    /* 專科藥丸：這一位的專科不是本頁這一科 → tag-off */
    if (!own) out = out.replace('<span class="doc-role">', '<span class="doc-role tag-off">');
    /* 專長標記：命中本頁這一科的那幾顆 → tag-on */
    out = out.replace(
      new RegExp(`<span class="sk" data-spec="${spec}">`, "g"),
      `<span class="sk tag-on" data-spec="${spec}">`
    );
    return out;
  });
  /* 文章卡：這一步的當下留下來的每一張都是本頁這一科，所以一律 tag-on */
  h = h.replace(/<span class="card-tag">/g, '<span class="card-tag tag-on">');

  /* 8.5 樣式：站上所有 chips 的規則都寫 `.chips button`，換成連結之後會整組掉光
     （第一版就是這樣，標記變成一排純文字）。用 :is(button,a) 一次涵蓋兩種，
     ⚠ 而且**權重不變** —— :is() 取參數裡最高的那一個，button 與 a 都是型別選擇器。
     「目前這一頁」那一條再單獨改成同時吃 aria-pressed（按鈕版）與
     aria-current（連結版），這樣正式站不管走哪一種都不必再改一次 CSS。 */
  h = h.split(".chips button").join(".chips :is(button,a)");
  h = h.split('.chips :is(button,a)[aria-pressed="true"]')
       .join('.chips :is(button[aria-pressed="true"],a[aria-current="page"])');

  /* 8. 篩選 JS：選擇器放寬（否則搜尋框會一起失效），並且不要在連結上掛 click */
  /* ⚠ 2026-08-21 上線之後，篩選 JS 的那兩處**已經直接改在 index.html 裡**
     （選擇器放寬成 `.chips [data-spec]`、chips 的 click 迴圈改成掛在空陣列上），
     所以這裡原本那兩條 String.replace 變成空操作，已經刪掉 ——
     留著空操作正是 aria-current 那個坑的成因（看起來有做，其實沒有）。
     改回按鈕的話 index.html 那兩處要一起改。 */

  /* 9. 瀏覽次數：counter.js **要留著**。
     -----------------------------------------------------------------------
     ⚠⚠ 這一步 2026-08-21 反過來了。還是提案頁的時候它是被拿掉的
       （CLAUDE.md 第八節：提案頁不拿掉的話，每開一次首頁的計數就多一次）。
       但這七頁現在是**正式站的頁**，文章卡上那個數字是站上的一部分 ——
       拿掉的話七頁的卡片全都印一條「—」（2026-08-21 使用者回報）。
     ⚠ 安全的理由是 **HERO 拿掉時 data-views-self 跟著消失了**：
       counter.js 只有看到 data-views-self 才會 POST +1，這一頁只剩
       data-views（唯讀），所以顯示得出數字、又不會灌任何一篇的計數。
       下面那條 assert 就是在守這件事 —— 哪天著陸頁又長回窄帶，它會擋下來。 */
  if (/data-views-self/.test(h)) {
    throw new Error(
      `topics/${spec}/ 裡出現了 data-views-self —— 著陸頁掛上 counter.js 之後，` +
      `那會讓每開一次這一頁就替某一篇 +1。要嘛把它拿掉，要嘛這一頁別載 counter.js。`
    );
  }
  if (!/<script src="\.\.\/\.\.\/assets\/counter\.js" defer><\/script>/.test(h)) {
    throw new Error(`topics/${spec}/ 沒有 counter.js —— 文章卡的瀏覽次數會印成一條「—」。`);
  }

  /* 10. <head>：這一頁自己的 title／description／canonical／JSON-LD。
     -----------------------------------------------------------------------
     ⚠⚠ 快照下來的 <head> 裡那一整段 SEO:START~SEO:END 是 **build.mjs 為首頁產的**
       （首頁的 canonical、og:url、WebSite/WebPage/Dentist 的 @graph…）。
       原封不動留著的話，七頁會一起對外宣告自己是首頁 —— 整段換掉。
     ⚠ 這一步刻意**不走 build.mjs 的 SEO 區塊**：那一支是為首頁與文章寫的，
       著陸頁的節點組成不一樣（MedicalWebPage ＋ 指回 #dentist），
       塞進去反而要在 build.mjs 裡多一條分支。 */
  const canonical = `${SITE}/topics/${spec}/`;
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${t.h1} — 芳仁牙醫診所（雲林斗六）</title>`);
  h = h.replace(/<link rel="canonical"[^>]*>\n?/, "");
  h = h.replace(/<meta name="description"[^>]*>\n?/, "");

  /* ⚠⚠ 手寫的那一組 og:* 也要拿掉（2026-08-22 修）。
     index.html 的 <head> 裡有一組**手寫**的 og:type／og:title／og:description／
     og:url，位置在 SEO:START 那一段的**前面** —— 而 Facebook 與 LINE 的爬蟲
     遇到重複的 og 屬性一律取**第一個**，所以在這一步之前，七頁分享出去全部
     顯示的是首頁的標題與描述，og:url 還寫著 https://fangren.net/，
     和同一頁正確的 canonical（/topics/<spec>/）互相矛盾 ——
     等於對 LINE、FB 說「這一頁其實是首頁」。
     ⚠ 這一步一定要排在下面那條 SEO 區塊的替換**之前**：替換之後
       seoBlock 自己也會產這四個屬性，那時就分不出誰是誰了。
     ⚠⚠ **og:image* 2026-08-22 起也要剝掉** —— 那一天 seoBlock 開始產自己的
       og:image（各科自己的分享圖，沒有的退回夜景）。不剝的話同一頁會有兩組，
       爬蟲取第一個 ＝ 永遠顯示夜景，各科的圖等於白做。
     ⚠ og:site_name 仍然留著 —— seoBlock 沒有產它，而它七頁都一樣。
     ⚠ 出現次數不是 1 就 throw：index.html 的 og 區日後改過（多一個、
       或搬進 SEO 區塊裡）這一步就會失準，寧可讓產生器出聲。 */
  for (const prop of ["og:type", "og:title", "og:description", "og:url",
                      "og:image", "og:image:width", "og:image:height", "og:image:alt"]) {
    const re = new RegExp(`<meta property="${prop}"[^>]*>\n?`, "g");
    const hits = (h.match(re) || []).length;
    if (hits !== 1) {
      throw new Error(`<head> 裡 ${prop} 出現 ${hits} 次（預期 1）—— index.html 的 og 區改過了，步驟 10 要跟著改`);
    }
    h = h.replace(re, "");
  }
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, seoBlock(spec, t, canonical, cnt));
  h = h.replace("<head>", "<head>\n" + headNote(spec, t));

  /* 11. ⚠ 樣式**不再注入** —— 2026-08-21 上線時整段搬進 index.html 的樣式表了
     （tools/topic-preview-style.html 已刪除）。這一頁是 index.html 的快照，
     所以自動就帶著那一段。 */

  const dir = path.join(ROOT, "topics", spec);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), h, "utf8");

  const text = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
                .replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s/g, "");
  if (t.ask && t.ask.length) {
    console.log(`  ⚠ 這一科還有 ${t.ask.length} 件要先問過診所才寫得下去：`);
    t.ask.forEach((q) => console.log(`     ・${q}`));
  }
  console.log(`topics/${spec}/  文章 ${(h.match(/class="card"/g) || []).length} 篇・` +
              `醫師 ${(h.match(/class="doc"/g) || []).length} 位・可見字約 ${text.length}`);
}
