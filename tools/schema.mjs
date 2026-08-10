/* =============================================================================
   芳仁牙醫診所 — 結構化資料（JSON-LD）產生器
   -----------------------------------------------------------------------------
   由 tools/build.mjs 呼叫，不單獨執行。

   設計原則，動這支之前先讀：

   1. **不重抄頁面上已經有的資料。**
      看診時間、醫師名冊、服務項目全部是從 index.html 讀回來的，不是另外維護一份。
      Google 明文要求結構化資料要和使用者看得到的內容一致；抄第二份的下場一定是
      兩邊哪天不一樣，而且沒有人會發現。頁面上沒有的（座標、sameAs、郵遞區號、
      國碼電話）才放在 clinic.json。

   2. **不確定的欄位就不要輸出。** 座標沒填就整個略過 geo，logo 沒有就略過 logo。
      錯的結構化資料比沒有更糟 —— 它會讓整站的結構化資料一起被降低信任。

   3. **不做已經沒有回報的類型。**
      · FAQPage —— Google 2026-05-07 起停止顯示 FAQ 複合式搜尋結果，
        6 月移除 Search Console 報表、8 月移除 API 資料。加了不會有任何效果。
      · HowTo —— 2023-09 就下架了。〈貝氏刷牙法〉那篇是典型的 how-to，還是不要加。
      · Review／AggregateRating —— 在自己網站上標自己的星等是 Google 明文禁止的
        （self-serving review），會拖累整站。
      這三件事以後有人想「補齊」的時候，回來看這一段。

   4. **WebSite 不宣告 SearchAction。** 首頁那個搜尋框是純前端的即時篩選，
      沒有 ?q= 這種會回結果頁的網址。宣告一個不存在的搜尋端點等於說謊。

   5. **輸出的內容不能每次跑都不一樣**，否則 build 的內容雜湊會一直變，
      文章與首頁的 lastmod 就會天天跳。所以這裡沒有任何 Date.now()。
   ============================================================================= */

/* ---------- 小工具 ---------- */

const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const stripTags = (s) => s.replace(/<[^>]+>/g, "");
const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
   .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&rsaquo;/g, "›");
const clean = (s) => decode(stripTags(s)).replace(/\s+/g, " ").trim();

/* <dd> 裡面用 <br> 分行，拆成陣列 */
const lines = (s) =>
  s.split(/<br\s*\/?>/i).map(clean).filter(Boolean);

const DAYS = {
  "一": "Monday", "二": "Tuesday", "三": "Wednesday", "四": "Thursday",
  "五": "Friday", "六": "Saturday", "日": "Sunday",
};
const DAY_ORDER = ["一", "二", "三", "四", "五", "六", "日"];

/* 「週一至週五」→ 五天；「週六、週日」→ 兩天 */
function parseDays(text) {
  const t = text.replace(/週|禮拜|星期/g, "");
  const range = t.match(/^([一二三四五六日])[至到~-]([一二三四五六日])$/);
  if (range) {
    const a = DAY_ORDER.indexOf(range[1]);
    const b = DAY_ORDER.indexOf(range[2]);
    if (a === -1 || b === -1 || b < a) return null;
    return DAY_ORDER.slice(a, b + 1).map((d) => DAYS[d]);
  }
  const list = t.split(/[、,，]/).map((s) => s.trim()).filter(Boolean);
  if (list.length && list.every((d) => DAYS[d])) return list.map((d) => DAYS[d]);
  return null;
}

/* =============================================================================
   從 index.html 讀回頁面上已經有的事實
   ============================================================================= */

/* ---- 看診時間 ----
   來源是 #clinic 那張「看診時間」資訊卡：

     <h3>看診時間</h3>
     <p><b>週一至週五</b><br>上午 08:45–11:30<br>…</p>
     <p class="info-note">週六、週日休診。…</p>

   時間的破折號是全形連接號 U+2013（–），不是半形減號，所以下面的正規式兩種都收。
   休診日要**明確宣告**（opens 與 closes 都是 00:00）—— 只列營業日的話，
   Google 分不出「週六日休診」和「忘了填」。 */
export function parseHours(indexHtml, warn = console.warn) {
  const card = indexHtml.match(
    /<div class="info-card"[^>]*>\s*<h3>\s*看診時間\s*<\/h3>([\s\S]*?)<\/div>/i
  );
  if (!card) {
    warn("  ⚠ index.html 找不到「看診時間」資訊卡，JSON-LD 會少掉營業時間");
    return [];
  }
  const body = stripComments(card[1]);

  const dayText = (body.match(/<b>([^<]+)<\/b>/) || [])[1];
  const open = dayText && parseDays(clean(dayText));
  if (!open) {
    warn(`  ⚠ 看不懂看診日的寫法「${dayText || ""}」，JSON-LD 會少掉營業時間`);
    return [];
  }

  const slots = [...clean(body).matchAll(/(\d{1,2}:\d{2})\s*[–—~-]\s*(\d{1,2}:\d{2})/g)]
    .map((m) => [m[1].padStart(5, "0"), m[2].padStart(5, "0")]);
  if (!slots.length) {
    warn("  ⚠ 看診時間卡裡讀不到任何時段，JSON-LD 會少掉營業時間");
    return [];
  }

  const spec = slots.map(([opens, closes]) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: open,
    opens,
    closes,
  }));

  /* 休診日。句子長這樣：「週六、週日休診。國定假日門診時間請來電確認。」 */
  const closedText = (clean(body).match(/((?:週[一二三四五六日][、，,]?)+)休診/) || [])[1];
  const closed = closedText && parseDays(closedText);
  if (closed && closed.length) {
    spec.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: closed,
      opens: "00:00",
      closes: "00:00",
    });
  } else {
    warn("  ⚠ 看診時間卡裡讀不到休診日，Google 會以為那幾天只是沒填");
  }
  return spec;
}

/* ---- 主題與科別（#topics 的 chips）----
   同一組字也是文章 articleSection 的來源，所以順便回傳 code → 名稱的對照。 */
export function parseTopics(indexHtml, warn = console.warn) {
  const block = indexHtml.match(/<ul class="chips">([\s\S]*?)<\/ul>/i);
  if (!block) {
    warn("  ⚠ index.html 找不到 chips，JSON-LD 會少掉服務項目");
    return {};
  }
  const out = {};
  for (const m of stripComments(block[1]).matchAll(/data-spec="([^"]+)"[^>]*>([^<]+)</g)) {
    if (m[1] === "all") continue;          // 「全部」不是一個科別，是「不篩選」
    out[m[1]] = clean(m[2]);
  }
  return out;
}

/* ---- 醫師（#doctors 的每一張 .doc）----

   ⚠ 這裡有一條**不能違反**的規則，來自 COPY.md 第八之一節：
     **部定專科 ≠ 訓練經歷。**
     「衛生福利部○○專科」才是部定專科，「成大醫院牙髓病專科訓練」不是。
     頁面上的藥丸已經刻意分開寫了（陳芷鈴是「顯微根管」不是「顯微根管專科醫師」），
     所以只有**開頭是「衛生福利部」而且結尾是「專科」或「專科醫師」**的那幾行
     才會升成 hasCredential，其餘一律只留在 description 裡。
     欄位名稱叫 credential 不代表可以拿來灌水，那會變成不實聲明。

     ⚠ 兩個條件缺一不可，第一版只看開頭就出過事：
       李侑津醫師的資歷裡有「**衛生福利部雙和醫院**」—— 那是他任職過的醫院，
       只看開頭會把它認成部定專科，等於在結構化資料裡幫他掛一個他沒有的認證。
       他實際上沒有部定專科（另一行是臺北榮民總醫院），正確結果就是空的。 */
const BOARD_CERT = /^衛生福利部.*專科(醫師)?$/;
export function parseDoctors(indexHtml, warn = console.warn) {
  const out = [];
  const re = /<article class="doc"[^>]*data-spec="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g;

  for (const m of indexHtml.matchAll(re)) {
    const spec = m[1];
    const body = stripComments(m[2]);

    const head = body.match(/<h3>([^<]*)<span class="doc-role">([^<]*)<\/span><\/h3>/);
    if (!head) {
      warn("  ⚠ 有一張醫師卡讀不出姓名與職稱，已略過");
      continue;
    }

    const fields = {};
    for (const f of body.matchAll(/<dt>([^<]*)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)) {
      fields[clean(f[1])] = f[2];
    }

    const skills = (fields["專長"] ? clean(fields["專長"]).split(/[、,，]/) : [])
      .map((s) => s.trim()).filter(Boolean);
    const career = fields["資歷"] ? lines(fields["資歷"]) : [];
    const edu = fields["學歷"] ? lines(fields["學歷"]) : [];

    /* 「衛生福利部○○專科」→ 真的部定專科。其餘不算。
       被擋下來的那幾行要出聲，人才有機會確認是不是漏了一個真的專科。 */
    const boardCerts = career.filter((c) => BOARD_CERT.test(c));
    for (const c of career) {
      if (/^衛生福利部/.test(c) && !BOARD_CERT.test(c)) {
        console.log(`  ・「${c}」不是部定專科（結尾不是「專科」），只會留在 description`);
      }
    }

    out.push({
      spec,
      name: clean(head[1]),
      role: clean(head[2]),
      skills,
      career,
      boardCerts,
      schools: edu.map((line) => schoolOf(line, warn)).filter(Boolean),
    });
  }

  if (!out.length) warn("  ⚠ index.html 讀不到任何醫師，JSON-LD 會少掉醫師實體");
  return out;
}

/* 「中山醫學大學牙醫學博士」→「中山醫學大學」
   「臺北醫學大學學士、碩士」→「臺北醫學大學」
   把學位的字尾切掉，剩下的才是學校（alumniOf 要的是機構，不是學位）。
   切不掉就回 null 並出聲 —— 寧可少一個欄位，也不要送出「臺北醫學大學學士」
   這種根本不是機構名稱的東西。 */
function schoolOf(line, warn) {
  const s = line.replace(/(牙醫學)?(學士|碩士|博士)(\s*[、,，]\s*(學士|碩士|博士))*\s*$/, "").trim();
  if (!s || s === line) {
    warn(`  ⚠ 學歷「${line}」看不出學校名稱，這一筆不會進 alumniOf`);
    return null;
  }
  return s;
}

/* =============================================================================
   首頁的 @graph
   -----------------------------------------------------------------------------
   每個節點都有 @id，其他節點才引用得到 —— 這就是「實體圖譜」的意思。
   文章頁的 author／publisher 直接指向 #dentist，不再各自複製一份診所資料。
   ============================================================================= */

export function homeGraph({ site, clinic, facts, title, description, updatedToken }) {
  const id = (frag) => `${site}/#${frag}`;
  const abs = (p) => (/^https?:/.test(p) ? p : `${site}/${p.replace(/^\//, "")}`);

  const doctorId = (i) => id(`doctor-${i + 1}`);

  const dentist = {
    "@type": "Dentist",
    "@id": id("dentist"),
    name: clinic.name,
    url: `${site}/`,
    telephone: clinic.telephone,
    address: { "@type": "PostalAddress", ...clinic.address },
    medicalSpecialty: "Dentistry",
    inLanguage: "zh-Hant-TW",
  };

  if (clinic.alternateName) dentist.alternateName = clinic.alternateName;
  if (clinic.images?.length) dentist.image = clinic.images.map(abs);
  if (clinic.logo) dentist.logo = { "@type": "ImageObject", "@id": id("logo"), url: abs(clinic.logo) };
  if (clinic.hasMap) dentist.hasMap = clinic.hasMap;
  if (clinic.sameAs?.length) dentist.sameAs = clinic.sameAs;
  if (clinic.areaServed?.length) dentist.areaServed = clinic.areaServed;
  if (clinic.priceRange) dentist.priceRange = clinic.priceRange;
  if (clinic.currenciesAccepted) dentist.currenciesAccepted = clinic.currenciesAccepted;
  if (clinic.foundingDate) dentist.foundingDate = clinic.foundingDate;

  // 座標沒填就整個不輸出，不要送出 null（見 clinic.json 的說明）
  const { latitude, longitude } = clinic.geo || {};
  if (typeof latitude === "number" && typeof longitude === "number") {
    dentist.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }

  if (facts.hours.length) dentist.openingHoursSpecification = facts.hours;

  const topics = Object.values(facts.topics);
  if (topics.length) {
    dentist.knowsAbout = topics;
    /* availableService 的定義域不含 Dentist，用 Organization 的 hasOfferCatalog 才合法。 */
    dentist.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "診療項目",
      itemListElement: topics.map((t) => ({
        "@type": "Offer",
        itemOffered: { "@type": "MedicalProcedure", name: t },
      })),
    };
  }

  const founderIdx = facts.doctors.findIndex((d) => /創辦/.test(d.role));
  if (founderIdx !== -1) dentist.founder = { "@id": doctorId(founderIdx) };
  if (facts.doctors.length) {
    dentist.employee = facts.doctors.map((_, i) => ({ "@id": doctorId(i) }));
  }

  /* 醫師。@type 同時掛 Person 與 Physician —— schema.org 的 Physician 是
     「醫療機構」那一支（不是 Person），單掛它的話 jobTitle／alumniOf／worksFor
     這些 Person 的屬性都不合法。兩個一起掛是通行做法。 */
  const doctors = facts.doctors.map((d, i) => {
    const node = {
      "@type": ["Person", "Physician"],
      "@id": doctorId(i),
      name: d.name,
      jobTitle: d.role,
      medicalSpecialty: "Dentistry",
      worksFor: { "@id": id("dentist") },
      /* 執業地點就是診所本身。Physician 需要 address 才算完整的醫療實體。 */
      address: { "@type": "PostalAddress", ...clinic.address },
    };
    const knows = [facts.topics[d.spec], ...d.skills].filter(Boolean);
    if (knows.length) node.knowsAbout = [...new Set(knows)];
    if (d.career.length) node.description = d.career.join("、");
    if (d.schools.length) {
      node.alumniOf = [...new Set(d.schools)].map((s) => ({
        "@type": "EducationalOrganization", name: s,
      }));
    }
    if (d.boardCerts.length) {
      node.hasCredential = d.boardCerts.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "部定專科醫師",
        name: c,
        recognizedBy: { "@type": "GovernmentOrganization", name: "衛生福利部" },
      }));
    }
    return node;
  });

  const website = {
    "@type": "WebSite",
    "@id": id("website"),
    url: `${site}/`,
    name: clinic.name,
    inLanguage: "zh-Hant-TW",
    publisher: { "@id": id("dentist") },
  };

  const webpage = {
    "@type": ["WebPage", "CollectionPage"],
    "@id": id("webpage"),
    url: `${site}/`,
    name: title,
    description,
    isPartOf: { "@id": id("website") },
    about: { "@id": id("dentist") },
    inLanguage: "zh-Hant-TW",
    dateModified: updatedToken,
  };
  if (clinic.images?.length) {
    webpage.primaryImageOfPage = { "@type": "ImageObject", url: abs(clinic.images[0]) };
  }

  return { "@context": "https://schema.org", "@graph": [dentist, ...doctors, website, webpage] };
}

/* =============================================================================
   文章頁的 @graph
   ============================================================================= */

/* 文章頁上也要有一份診所節點 —— 只寫 { "@id": ".../#dentist" } 是不夠的。

   **Google 的解析器是逐頁看的，不會跑去首頁把那個 @id 解出來。**
   所以 author／publisher 若只有一個跨頁的參照，它會判定成「author 缺少 name」，
   Article 的複合式搜尋結果資格直接不成立。同一個 @id 在兩頁各出現一次不是重複，
   那正是 @id 的用途：兩頁講的是同一個實體。

   但這裡是**精簡版**，不是把首頁那一份整包搬過來：
   營業時間、診療項目、九位醫師都留在首頁。理由是 2026 年 Google 收緊了資格判定 ——
   複合式搜尋結果只看「描述這一頁主要內容」的結構化資料，
   文章頁的主要內容是那篇文章，把診所的營業時間掛上去屬於離題的補充資料。 */
function publisherNode(site, clinic) {
  const abs = (p) => (/^https?:/.test(p) ? p : `${site}/${p.replace(/^\//, "")}`);
  const node = {
    "@type": "Dentist",
    "@id": `${site}/#dentist`,
    name: clinic.name,
    url: `${site}/`,
    telephone: clinic.telephone,
    address: { "@type": "PostalAddress", ...clinic.address },
  };
  if (clinic.alternateName) node.alternateName = clinic.alternateName;
  if (clinic.images?.length) node.image = abs(clinic.images[0]);
  if (clinic.logo) node.logo = { "@type": "ImageObject", "@id": `${site}/#logo`, url: abs(clinic.logo) };
  if (clinic.sameAs?.length) node.sameAs = clinic.sameAs;
  return node;
}

export function postGraph({ site, clinic, meta, image, topics, warn = console.warn }) {
  const url = `${site}/posts/${meta.slug}/`;
  const homeId = (frag) => `${site}/#${frag}`;

  if (meta.title.length > 110) {
    warn(`  ⚠ ${meta.slug} 的標題超過 110 字，Google 會截斷 headline`);
  }

  const article = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.published,
    dateModified: meta.updated,
    inLanguage: "zh-Hant-TW",
    articleSection: meta.tag,
    keywords: [meta.tag, ...(topics ? [topics] : [])].filter(Boolean),
    isAccessibleForFree: true,
    /* author 指向診所本身，不是某個人。
       2026-08-02 使用者要求全站移除作者署名與「醫療審閱」欄位（CLAUDE.md 第六節），
       這裡是機器讀的欄位、畫面上不會多出任何一行字，指向診所實體和頁尾的落款一致。
       ⚠ 不要因為想要 E-E-A-T 就把署名加回頁面上，那件事已經定案了。 */
    author: { "@id": homeId("dentist") },
    publisher: { "@id": homeId("dentist") },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": `${url}#webpage` },
  };

  if (image) {
    article.image = { "@type": "ImageObject", url: image.url, width: image.width, height: image.height };
  }

  /* post-meta 可以選填 about，用來把文章綁到一個具名的醫療實體上：
       "about": [{ "type": "MedicalCondition", "name": "牙周病" }]
     沒填就整個略過 —— 這種東西猜錯比沒有更糟。 */
  if (Array.isArray(meta.about) && meta.about.length) {
    article.about = meta.about.map((a) => ({
      "@type": a.type || "Thing",
      name: a.name,
      ...(a.sameAs ? { sameAs: a.sameAs } : {}),
    }));
  }

  const webpage = {
    /* 刻意用 WebPage 而不是 MedicalWebPage。
       MedicalWebPage 的重點欄位是 lastReviewed（最後醫療審閱日）與 reviewedBy，
       而「醫療審閱」這一欄 2026-08-02 已經全站移除、且明確要求不要加回去。
       宣告一個沒有人做的審閱等於造假，所以用一般的 WebPage。 */
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.excerpt,
    isPartOf: { "@id": homeId("website") },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    inLanguage: "zh-Hant-TW",
    datePublished: meta.published,
    dateModified: meta.updated,
  };
  if (image) webpage.primaryImageOfPage = { "@type": "ImageObject", url: image.url };

  /* 麵包屑。畫面上那一列（首頁 › 科別 › 標題）本來就在，這裡只是讓機器也讀得到。
     第二層指向 #topics，和頁首「全部文章」的目的地一致 —— 篩選工具在那裡。 */
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: meta.tag, item: `${site}/#topics` },
      { "@type": "ListItem", position: 3, name: meta.title },
    ],
  };

  /* WebSite 也一樣要在這一頁出現，webpage.isPartOf 才解得開。 */
  const website = {
    "@type": "WebSite",
    "@id": homeId("website"),
    url: `${site}/`,
    name: clinic.name,
    inLanguage: "zh-Hant-TW",
    publisher: { "@id": homeId("dentist") },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [article, webpage, breadcrumb, publisherNode(site, clinic), website],
  };
}
