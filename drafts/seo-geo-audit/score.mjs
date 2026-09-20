/* =============================================================================
   SEO／GEO 100 分評分表　逐頁計分器　2026-09-20
   -----------------------------------------------------------------------------
   用法：node tools/dist.mjs && node drafts/seo-geo-audit/score.mjs
   讀的是 _site/（上線版，已去註解），不是 repo 根目錄的原始碼 ——
   爬蟲看到的是前者，註解會讓字數與重量都量不準。

   評分表的依據寫在同一個資料夾的 RUBRIC.md，報告在 REPORT.md。
   ⚠ 這一支只量「量得出來的」。需要人判斷的（內容原創性、醫療正確性、
     Google 商家檔案一致性）在報告裡人工評，不在這裡。
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";

const SITE = path.join(process.cwd(), "_site");
if (!fs.existsSync(SITE)) { console.error("找不到 _site/，先跑 node tools/dist.mjs"); process.exit(1); }

/* 牙科實體詞表。C2「標題帶不帶實體」用它當代理指標 ——
   標題裡有具體的病名／術式／器材，被 LLM 當成一段可回答的段落的機會才高。
   ⚠ 詞表寫在這裡不是拿來塞關鍵字的，是拿來「量標題有沒有講具體的東西」。 */
const ENTITY = ["牙","齒","蛀","窩溝","氟","刷","牙菌斑","牙結石","洗牙","牙周","牙齦","齒槽骨","根管","牙髓","陶瓷","鋯","假牙","牙冠","牙橋","植牙","矯正","隱形","維持器","擴張","拔","智齒","傷口","麻醉","鎮靜","舒眠","健保","自費","X光","塗氟","填","檢查","回診","發炎","感染","咬","臼齒","乳牙","恆牙"];

const pages = [{ url: "/", file: path.join(SITE, "index.html"), kind: "home" }];
for (const t of fs.readdirSync(path.join(SITE, "topics")).sort())
  pages.push({ url: `/topics/${t}/`, file: path.join(SITE, "topics", t, "index.html"), kind: "topic" });
for (const p of fs.readdirSync(path.join(SITE, "posts")).sort()) {
  const f = path.join(SITE, "posts", p, "index.html");
  if (fs.existsSync(f)) pages.push({ url: `/posts/${p}/`, file: f, kind: "post" });
}

const cjk = (s) => (s.match(/[一-鿿]/g) || []).length;
const detag = (s) => s.replace(/<[^>]+>/g, "");

/* 頁面級項目與配分（站台級項目在報告裡另外算，不進這張表）。 */
const ITEMS = [
  ["A1", "robots meta 正確", 4],
  ["A2", "canonical 自我指涉且絕對", 3],
  ["B2", "醫療免責聲明", 3],
  ["B4", "外部權威引用", 4],
  ["B6", "內容深度", 3],
  ["C1", "H1 唯一・階層正確", 3],
  ["C2", "標題帶實體", 4],
  ["C3", "answer-first 段長", 4],
  ["C4", "Q&A／重點整理", 3],
  ["C5", "表格與清單", 3],
  ["C6", "語意 HTML", 3],
  ["D2", "頁面 schema", 4],
  ["D3", "BreadcrumbList 指向", 3],
  ["E2", "地名與服務區域", 3],
  ["F1", "LCP 提示", 3],
  ["F2", "CLS 防護", 2],
  ["F3", "頁面重量", 3],
];
/* 適用範圍 —— 不適用的項目不計分，也不進分母。
   ⚠ 第一版沒有這一層，結果首頁因為「沒有醫療免責聲明」「沒有重點整理」被扣分，
     那兩件在首頁本來就不該有。量錯東西比不量還糟（CLAUDE.md 第九節第 5 條）。 */
const NA = {
  home:  ["B2", "B4", "C2", "C3", "C4"],
  topic: ["B2", "C2"],
  post:  [],
};
const applies = (kind, key) => !NA[kind].includes(key);
const fullFor = (kind) => ITEMS.filter(([k]) => applies(kind, k)).reduce((a, i) => a + i[2], 0);

const rows = [];
for (const pg of pages) {
  const html = fs.readFileSync(pg.file, "utf8");
  const kb = Buffer.byteLength(html) / 1024;
  const mainM = html.match(/<main[\s\S]*?<\/main>/i);
  const body = mainM ? mainM[0] : html;
  const text = body.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
                   .replace(/<svg[\s\S]*?<\/svg>/gi, "").replace(/<[^>]+>/g, " ");
  const chars = cjk(text);
  const s = {};

  /* A1 —— 四個指令都要在。max-snippet:-1 是 AI Overviews／AI Mode 能引用多少的上限，
     少了它等於自己把可被摘錄的長度砍掉（Google 2026 的 robots meta 文件明說這條
     同時作用在 AI 功能上）。 */
  const rb = (html.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] || "";
  s.A1 = (/index/.test(rb) ? 1 : 0) + (/follow/.test(rb) ? 1 : 0)
       + (/max-snippet:-1/.test(rb) ? 1 : 0) + (/max-image-preview:large/.test(rb) ? 1 : 0);

  /* A2 */
  const can = (html.match(/<link rel="canonical" href="([^"]*)"/i) || [])[1] || "";
  s.A2 = can === `https://fangren.net${pg.url}` ? 3 : can.startsWith("https://") ? 2 : 0;

  /* B2 */
  s.B2 = /class="note"/.test(body) ? 3 : 0;

  /* B4 —— 只算真的權威來源（政府、法規、學會、期刊、PubMed／DOI），不算自家與地圖連結。
     ⚠ 2026-09-20 補上台灣這一側實際會用到的：法規資料庫、牙醫師公會全聯會、
       牙周病醫學會、兒童牙科醫學會、麻醉醫學會、AAPD，以及 doi.org。
     ⚠⚠ 同日改成**用網址去重，不是用網域** —— 原本算「不重複的主機」，
       所以兩條都指向健保署的不同公告只算一個來源。RUBRIC.md 第二節寫的是
       「引到…並附連結」，兩份不同的公告本來就是兩個來源。量錯的是評分器。 */
  const AUTH = /pubmed|ncbi\.nlm|nih\.gov|who\.int|cdc\.gov|ada\.org|aapd\.org|nhi\.gov\.tw|mohw\.gov\.tw|law\.moj\.gov\.tw|cda\.org\.tw|taop\.org\.tw|tapd\.org\.tw|anesth\.org\.tw|doi\.org|\.edu|ajodo|jada|cochrane|sciencedirect|springer|wiley|nature\.com/i;
  const ext = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1])
    .filter((u) => !u.includes("fangren.net"));
  const auth = new Set(ext.filter((u) => AUTH.test(u)));
  s.B4 = Math.min(4, auth.size * 2);

  /* B6 —— 文章 1200 字為及格線、2000 字滿分；著陸頁看「不與首頁重複的字」 */
  if (pg.kind === "post") s.B6 = chars >= 2000 ? 3 : chars >= 1200 ? 2 : chars >= 700 ? 1 : 0;
  else s.B6 = chars >= 2000 ? 3 : chars >= 1000 ? 2 : 1;

  /* C1 */
  const h1 = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h2 = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => detag(m[1]).trim());
  const h3 = [...body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => detag(m[1]).trim());
  /* ⚠ 第三分不是「有沒有 h2」，是**順序**：h1 要排在第一個 h2 前面。
     著陸頁就是踩這個 —— 它是 index.html 的快照，首頁那個「主題與科別」的 h2
     排在著陸頁自己的 h1 前面，大綱變成 h2 → h1 → h3。 */
  const iH1 = body.search(/<h1[\s>]/i), iH2 = body.search(/<h2[\s>]/i);
  s.C1 = (h1.length === 1 ? 2 : 0) + (h1.length === 1 && (iH2 < 0 || iH1 < iH2) ? 1 : 0);

  /* C2 —— 標題裡有沒有具體的牙科實體 */
  const heads = [...h2, ...h3].filter((t) => t && !/重點整理|延伸閱讀/.test(t));
  const withEnt = heads.filter((t) => ENTITY.some((e) => t.includes(e))).length;
  const ratio = heads.length ? withEnt / heads.length : 0;
  s.C2 = Math.round(4 * Math.min(1, ratio / 0.85)); /* 85% 視為滿分，其餘線性 */
  s._entRatio = ratio;

  /* C3 —— 每個 h2 底下第一段的字數，落在 40–120 才容易被整段擷取引用 */
  const firsts = body.split(/<h2[^>]*>/).slice(1).map((p) => {
    const m = p.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    return m ? detag(m[1]).replace(/\s+/g, "").length : 0;
  }).filter((n) => n > 0);
  const good = firsts.filter((n) => n >= 40 && n <= 120).length;
  const gr = firsts.length ? good / firsts.length : 0;
  s.C3 = firsts.length < 2 ? null : gr >= 0.75 ? 4 : gr >= 0.6 ? 3 : gr >= 0.4 ? 2 : 1;
  s._ansRatio = gr;

  /* C4 */
  /* 2026-09-20：著陸頁也有問答區塊了（dl.tp-cases，三個 dt 共用一個 dd）。
     ⚠ ul.tp-cases 是「一串處境」不是問答，只給 1 分 —— 它是個抓得出來的區塊，
       但沒有「問句 → 直答」那一層。 */
  s.C4 = /<dl class="(keypoints|tp-cases)"/.test(body) ? 3
       : /<ul class="tp-cases"/.test(body) ? 1
       : /重點整理/.test(body) ? 2 : 0;

  /* C5 */
  const tbl = (body.match(/<table/g) || []).length;
  const lst = (body.match(/<ul|<ol/g) || []).length;
  s.C5 = (tbl >= 1 ? 2 : 0) + (lst >= 1 ? 1 : 0);

  /* C6 */
  s.C6 = (/<main/.test(html) ? 1 : 0) + (/<article|<figure/.test(body) ? 1 : 0)
       + (/aria-label=/.test(html) ? 1 : 0);

  /* D2 */
  let types = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const walk = (n) => { if (Array.isArray(n)) n.forEach(walk);
        else if (n && typeof n === "object") { if (n["@type"]) types.push(...[].concat(n["@type"])); Object.values(n).forEach(walk); } };
      walk(JSON.parse(m[1]));
    } catch { types.push("PARSE_ERROR"); }
  }
  types = [...new Set(types)];
  const want = pg.kind === "post" ? ["BlogPosting", "WebPage", "BreadcrumbList", "Dentist"]
             : pg.kind === "topic" ? ["MedicalWebPage", "BreadcrumbList", "WebSite", "Dentist"]
             : ["Dentist", "WebSite", "WebPage", "Physician"];
  s.D2 = types.includes("PARSE_ERROR") ? 0 : Math.round(4 * want.filter((w) => types.includes(w)).length / want.length);

  /* D3 —— 麵包屑第 2 層要指到真的存在的那一頁（科別著陸頁），
     指到首頁錨點等於告訴爬蟲「這一篇的上一層是首頁」，七個著陸頁就白開了。 */
  const bc = /"BreadcrumbList"/.test(html);
  const toTopic = /"item":\s*"https:\/\/fangren\.net\/topics\//.test(html);
  const toAnchor = /"item":\s*"https:\/\/fangren\.net\/#topics"/.test(html);
  /* ⚠ 著陸頁的第 2 層就是它自己（最後一層不帶 item，那是對的），
     不要拿「有沒有指到 /topics/」去扣它的分 —— 那是量錯東西。 */
  s.D3 = pg.kind === "home" ? 3 : !bc ? 0
       : pg.kind === "topic" ? 3 : toTopic ? 3 : toAnchor ? 1 : 2;

  /* E2 */
  const head = html.slice(0, html.indexOf("</head>"));
  const PLACE = /斗六|雲林|永樂街/;
  /* ⚠ 不要求每一篇文章的標題都塞「斗六」—— 那是關鍵字填塞，也違反 COPY.md。
     文章看的是「整頁讀得到診所在哪」（頁尾的地址與電話爬蟲一樣讀得到）。 */
  const wholeText = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
  if (pg.kind === "post") {
    s.E2 = (PLACE.test(wholeText) ? 2 : 0)
         + (/"addressLocality"/.test(html) && /"areaServed"/.test(html) ? 1 : 0);
  } else {
    s.E2 = (PLACE.test((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "") ? 1 : 0)
         + (PLACE.test((head.match(/name="description" content="([^"]*)"/) || [])[1] || "") ? 1 : 0)
         + (PLACE.test(wholeText) ? 1 : 0);
  }

  /* F1 —— 首屏那張圖有沒有給瀏覽器優先權 */
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const heroImg = imgs.find((i) => !/loading="lazy"/.test(i)) || "";
  /* ⚠ 2026-09-20 修正：RUBRIC.md 第六節寫的是「fetchpriority **或** preload」，
     這裡原本卻當成兩項各給一分 —— 量錯的是評分器不是網站。
     三個要件是：① 首屏那張圖有拿到優先權（兩種寫法任一）② WebP ③ responsive srcset。
     ⚠ 著陸頁的 LCP 不是 <img> 是 .tp-intro（線稿是 CSS 背景圖），
       所以它只能走 preload 那條，fetchpriority 對它沒有意義。 */
  const gotPriority =
    (heroImg && /fetchpriority="high"/.test(heroImg)) ||
    /rel=['"]?preload['"]?[\s\S]{0,120}?as=['"]?image/.test(html) ||
    /l\.rel\s*=\s*'preload'[\s\S]{0,80}?l\.as\s*=\s*'image'/.test(html);
  s.F1 = (gotPriority ? 1 : 0)
       + (/<picture|image-set\(/.test(html) ? 1 : 0)
       + (/srcset=/.test(html) ? 1 : 0);

  /* F2 */
  const noDim = imgs.filter((i) => !(/\bwidth=/.test(i) && /\bheight=/.test(i))).length;
  s.F2 = (noDim === 0 ? 1 : 0) + (!/@font-face|fonts\.googleapis/.test(html) ? 1 : 0);

  /* F3 —— 上線版 HTML 的重量。60KB 以下滿分，200KB 以上 0 分。 */
  s.F3 = kb <= 60 ? 3 : kb <= 100 ? 2 : kb <= 200 ? 1 : 0;

  for (const [k] of ITEMS) if (!applies(pg.kind, k)) s[k] = null;
  const full = ITEMS.filter(([k]) => s[k] !== null).reduce((a, i) => a + i[2], 0);
  const got = ITEMS.reduce((a, [k]) => a + (s[k] ?? 0), 0);
  rows.push({ ...pg, kb, chars, s, got, full, pct: (got * 100) / full, types: types.join("|"), auth: [...auth] });
}

/* ---------- 輸出 ---------- */
const pad = (x, n) => String(x).padEnd(n);
const num = (x, n) => String(x).padStart(n);
console.log(`頁面級滿分：文章 ${fullFor("post")}、著陸頁 ${fullFor("topic")}、首頁 ${fullFor("home")} 分（不適用的項目不進分母），換算成 100 分制\n`);
const cell = (v) => (v === null ? " ·" : num(v, 2));
console.log(pad("頁面", 30), ITEMS.map((i) => i[0]).join(" "), " 得分 滿分 百分");
console.log("-".repeat(30 + ITEMS.length * 3 + 18));
for (const r of rows)
  console.log(pad(r.url, 30), ITEMS.map(([k]) => cell(r.s[k])).join("  "),
              num(r.got, 4), num(r.full, 4), num(r.pct.toFixed(0), 5));
const avg = (f, rs = rows) => rs.reduce((a, r) => a + f(r), 0) / rs.length;
const avgItem = (k) => { const rs = rows.filter((r) => r.s[k] !== null); return rs.length ? avg((r) => r.s[k], rs) : 0; };
console.log("-".repeat(30 + ITEMS.length * 3 + 18));
console.log(pad("平均", 30), ITEMS.map(([k]) => num(avgItem(k).toFixed(1), 2)).join(" "),
            " ".repeat(9), num(avg((r) => r.pct).toFixed(0), 5));
for (const kind of ["home", "topic", "post"])
  console.log(pad(`  ${kind} 平均`, 30), num(avg((r) => r.pct, rows.filter((r) => r.kind === kind)).toFixed(0), ITEMS.length * 3 + 14));

console.log("\n=== 逐項平均（滿分／實得） ===");
for (const [k, label, max] of ITEMS) {
  const a = avgItem(k);
  const bar = "█".repeat(Math.round((a / max) * 20)).padEnd(20, "·");
  console.log(`${k} ${pad(label, 22)} ${bar} ${a.toFixed(2)} / ${max}`);
}
console.log("\n=== 需要注意的頁面 ===");
for (const r of rows) {
  const bad = ITEMS.filter(([k, , max]) => r.s[k] !== null && r.s[k] < max * 0.5).map(([k, l]) => `${k} ${l}`);
  if (bad.length) console.log(pad(r.url, 30), bad.join("、"));
}
fs.writeFileSync(path.join(process.cwd(), "drafts/seo-geo-audit/score.json"),
  JSON.stringify({ generated: new Date().toISOString(), full: { post: fullFor("post"), topic: fullFor("topic"), home: fullFor("home") }, items: ITEMS, rows }, null, 1));
console.log("\n→ drafts/seo-geo-audit/score.json");
