/* 給廠商的交付頁 → preview/line-handover/index.html
 *   node drafts/channels/build-handover.mjs
 *
 * 起點是廠商 2026-09-07 的回覆：「大部分內容可以協助修改，會需要您提供完整內容及圖片置入」，
 * 後面列了八項要的東西。這一頁就是那八項的答案。
 *
 * ⚠⚠⚠ **一個字都不重打。** 每一則的文字是從它自己那份 Flex JSON（或 auto-reply.txt）
 *   抽出來的，圖檔清單也是從同一份 JSON 的 `"url"` 收的 —— 這條線的鐵律
 *   （`line-spec` 那一頁的第一條）：七則的字各有出處且各自有守門，再抄一份就是第八個真相。
 *   所以**要改文案就去改那份 JSON 再重跑這一支**，不要改這一頁。
 *
 * ⚠ 這一頁和 `/preview/line-spec/` 是兩件事，不要合併：
 *     line-spec     ＝ 模擬圖的總覽（使用者 2026-09-07 指定「只留模擬圖」）
 *     line-handover ＝ 交付包（圖檔的網址、可複製的文字、還沒有答案的問題）
 *   兩頁互相連著。
 *
 * ⚠ 刻意零 JS（同 line-spec）—— 交給廠商的東西沒有理由需要跑腳本。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "preview", "line-handover");
const OA = path.join(ROOT, "drafts", "line-oa");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

/* ---------- 把一顆 bubble 攤成「讀得下去的一段文字」---------------------- */
function lines(node, out = []) {
  if (!node || typeof node !== "object") return out;
  const t = node.type;
  if (t === "text") {
    const s = node.contents?.length
      ? node.contents.map((c) => c.text ?? "").join("")
      : (node.text ?? "");
    for (const l of String(s).split("\n")) out.push(l === "" ? "" : l);
  } else if (t === "separator") {
    out.push("────────");
  } else if (t === "image") {
    out.push(`〔圖〕${node.url.split("/").pop()}`);
  } else if (t === "button") {
    out.push(`〔鈕〕${node.action?.label ?? ""}`);
    return out;
  }
  /* 可點的 box（Flex 的 button 放不進圖示，這條線用 box + action 代替） */
  if (t === "box" && node.action?.label) {
    const inner = [];
    for (const c of node.contents || []) lines(c, inner);
    out.push(`〔鈕〕${inner.filter((x) => x && !x.startsWith("〔圖〕")).join("") || node.action.label}`);
    return out;
  }
  /* ⚠⚠ baseline 的 box 在 LINE 上畫出來是**同一行** —— 「電話　05-5339369」、
     「・半年到了，想約洗牙」都是。不合起來的話，複製出去會變成兩行，
     廠商照著排就多一行（2026-09-07）。第一顆是「・」的接起來就好，其餘用全形空格隔開。 */
  if (t === "box" && node.layout === "baseline") {
    const inner = [];
    for (const c of node.contents || []) lines(c, inner);
    const parts = inner.filter((x) => x !== "");
    if (parts.length) out.push(parts[0] === "・" ? parts.join("") : parts.join("　"));
    return out;
  }
  for (const k of ["header", "hero", "body", "footer"]) if (node[k]) lines(node[k], out);
  for (const c of node.contents || []) lines(c, out);
  return out;
}
const copy = (b) => lines(b).join("\n").replace(/\n{3,}/g, "\n\n").trim();

/* ---------- 一份 JSON 引用到的圖 ---------------------------------------- */
function imgs(file) {
  const txt = fs.readFileSync(file, "utf8");
  return [...new Set([...txt.matchAll(/"url":\s*"(https:\/\/fangren\.net\/[^"]+)"/g)].map((m) => m[1]))]
    .filter((u) => !u.includes("{{"));
}
const dimOf = (url) => {
  const p = path.join(ROOT, url.replace("https://fangren.net/", ""));
  if (!fs.existsSync(p)) return null;
  const b = fs.readFileSync(p);
  if (p.endsWith(".png")) return [b.readUInt32BE(16), b.readUInt32BE(20), b.length];
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5), b.length];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};

/* ---------- 每一項 ------------------------------------------------------ */
const ch = (f) => path.join(HERE, f);
const oa = (f) => path.join(OA, f);

const ITEMS = [
  { n: "①", title: "招呼圖卡", ask: "請提供圖檔",
    spec: "line-welcome", json: ch("welcome-card.json"),
    blocks: [["加為好友時自動送出的那一則", copy(load(ch("welcome-card.json")))]] },

  { n: "②", title: "自動回應", ask: "（請提供完整內容）",
    spec: "line-auto-reply", json: null,
    note: "這一則是<b>純文字，不是圖卡</b> —— 貼進後台「自動回應訊息」的「一律回應」即可，診所自己就設得完，不必經過廠商。",
    blocks: [["病人在聊天室打任何字，回這一則",
      fs.readFileSync(ch("auto-reply.txt"), "utf8").trim()]] },

  { n: "④", title: "約診提醒", ask: "請提供圖檔",
    spec: "line-remind", json: ch("reminder-card.json"),
    blocks: [["看診前 48 小時送出", copy(load(ch("reminder-card.json")))]] },

  { n: "⑥", title: "取消／改期那一段對話", ask: "（請提供完整內容）",
    spec: "line-cancel", json: ch("cancel-card.json"),
    blocks: (() => { const j = load(ch("cancel-card.json"));
      return [["① 按了「預約改期」→ 先問一次", copy(j["cancel-confirm"])],
              ["② 按了「是喔　要取消」", copy(j["cancel-done"])],
              ["③ 按了「按錯惹～我會去～」", copy(j["cancel-keep"])]]; })() },

  { n: "⑦", title: "評價邀約", ask: "（請提供完整內容）",
    spec: "line-review", json: ch("review-card.json"),
    warn: "⚠ 這一則<b>先不要送</b>：兩顆按鈕連到哪裡還沒有答案，在那之前它有可能落入 Google 禁止的「只向滿意的人索取公開評論」。細節見下面「還需要答案的事」第 1 項。",
    blocks: [["看診後送出", copy(load(ch("review-card.json")))]] },

  { n: "⑨", title: "診所資訊", ask: "請提供圖檔、網站連結",
    spec: null, json: oa("clinic-info-flex.json"),
    note: '網站連結：<a href="https://fangren.net/">https://fangren.net/</a>（按鈕「到網站看看」）。'
      + ' 地圖與電話那兩顆不是網頁連結：一顆開 Google 地圖搜尋、一顆是 <code>tel:+88655339369</code>。',
    blocks: [["圖文選單「診所資訊」那一格點下去", copy(load(oa("clinic-info-flex.json")))]] },
];

/* ⑩ 七科 —— 表格比逐則文字好讀 */
const topics = load(oa("topics-carousel.json"));
const tBubbles = topics.contents?.contents ?? topics.contents;

/* ⑪ 衛教 */
const health = load(oa("health-carousel-d.json"));
const hRows = health.contents.map((b) => {
  const btns = [];
  const scan = (n) => { if (!n || typeof n !== "object") return;
    if (n.action?.label) btns.push([n.action.label, n.action.uri]);
    for (const k of ["header", "hero", "body", "footer"]) if (n[k]) scan(n[k]);
    for (const c of n.contents || []) scan(c); };
  scan(b);
  const txt = lines(b).filter((x) => x && x !== "▌" && !x.startsWith("〔"));
  const named = (l) => btns.find((x) => x[0] === l)?.[1];
  /* ⚠ 第 11 格是收尾、不是懶人包 —— 它沒有「看大圖／讀文章」，有自己的一顆按鈕。
     照抄前十格的欄位會印出「—／沒有」，讀起來像漏掉了。 */
  const other = btns.filter((x) => !["看大圖", "讀文章"].includes(x[0]) && x[1] && !x[1].endsWith(".jpg"))[0];
  return { hero: b.hero?.url, title: txt[0] ?? "", desc: txt[1] ?? "",
    big: named("看大圖"), post: named("讀文章"), other };
});

/* ---------- 版面 -------------------------------------------------------- */
const imgList = (urls) => urls.length ? `<ul class="pv-files">` + urls.map((u) => {
  const d = dimOf(u), n = u.split("/").pop();
  return `<li><a href="${esc(u)}">${esc(n)}</a>`
    + (d ? `<span class="d">${d[0]}×${d[1]}　${(d[2] / 1024).toFixed(0)}KB</span>`
         : `<span class="d n">⚠ 這個網址現在是空的</span>`) + `</li>`;
}).join("") + `</ul>` : "";

const sections = ITEMS.map((it) => {
  const urls = it.json ? imgs(it.json) : [];
  return `
  <h2 class="pv-h2" id="m${it.n}">${it.n} ${esc(it.title)}
    <span class="t">廠商要的：${esc(it.ask)}</span></h2>
  ${it.warn ? `<p class="pv-warn">${it.warn}</p>` : ""}
  ${it.note ? `<p class="pv-note">${it.note}</p>` : ""}
  ${urls.length ? `<h3>圖檔（點下去就是線上那一張）</h3>${imgList(urls)}` : ""}
  <h3>文字</h3>
  ${it.blocks.map(([label, body]) =>
    `<p class="pv-lbl">${esc(label)}</p><pre class="pv-copy">${esc(body)}</pre>`).join("")}
  ${it.spec ? `<p class="pv-more"><a href="../${it.spec}/">看這一則的模擬圖與完整規格 →</a></p>` : ""}`;
}).join("\n");

const topicRows = tBubbles.map((b, i) => {
  const label = b.footer?.contents?.[0]?.action?.label ?? "";
  const uri = b.footer?.contents?.[0]?.action?.uri ?? "";
  return `<tr><td>${i + 1}</td><td><b>${esc(label)}</b></td>
    <td><a href="${esc(b.hero.url)}">${esc(b.hero.url.split("/").pop())}</a></td>
    <td><a href="${esc(uri)}">${esc(uri.replace("https://fangren.net", ""))}</a></td></tr>`;
}).join("");

const healthRows = hRows.map((r, i) => `<tr>
  <td>${i + 1}</td>
  <td><b>${esc(r.title)}</b><br><span class="s">${esc(r.desc)}</span></td>
  <td><a href="${esc(r.hero)}">${esc(r.hero.split("/").pop())}</a></td>
  <td>${r.big ? `<a href="${esc(r.big)}">${esc(r.big.split("/").pop())}</a>` : "—"}</td>
  <td>${r.post ? `<a href="${esc(r.post)}">${esc(r.post.replace("https://fangren.net", ""))}</a>`
      : r.other ? `<span class="s">〔鈕〕${esc(r.other[0])}</span><br><a href="${esc(r.other[1])}">${esc(r.other[1].replace("https://fangren.net", ""))}</a>`
      : `<span class="n">站上還沒有</span>`}</td>
</tr>`).join("");

/* ⚠⚠ ⑩⑪ 兩組本來只有表格，表格裡放不下卡片裡的每一行字 ——
   廠商 2026-09-07 回報「還要一個一個打」。所以每一格都補一塊可以整段複製的原文，
   內容和其他各則一樣是**從那份 JSON 現抽的**，這一頁上沒有第二份文案。 */
const copyBlocks = (rows) => rows.map(([label, body]) =>
  `<p class="pv-lbl">${esc(label)}</p><pre class="pv-copy">${esc(body)}</pre>`).join("");

const topicCopy = copyBlocks(tBubbles.map((b, i) =>
  [`${i + 1}　${b.footer?.contents?.[0]?.action?.label ?? ""}`, copy(b)]));

const healthCopy = copyBlocks(health.contents.map((b, i) =>
  [`${i + 1}　${hRows[i].title}`, copy(b)]));

const svgs = fs.existsSync(path.join(ROOT, "assets", "line-src"))
  ? fs.readdirSync(path.join(ROOT, "assets", "line-src")).filter((n) => n.endsWith(".svg")).sort() : [];
const SVG_NOTE = {
  "mark.svg": "站上頁首那一條標誌（長寬比 2.029）—— 綁定鈕、「按錯惹～我會去～」用它",
  "shape-r2c3.svg": "細長那一顆（長寬比 3.081）—— 「介紹芳仁給朋友」、「掰掰不去囉」、「是喔　要取消」用它",
  "pin.svg": "地圖圖釘 —— 診所資訊卡「Google 地圖」",
  "phone.svg": "話筒 —— 診所資訊卡「打給診所」、提醒卡「致電診所」",
};

/* ⚠⚠⚠ 這一段的前四行一行都不能少 —— 2026-09-07 漏了 `charset` 那一行，
   使用者在 iPhone 上開起來**整頁中文都是亂碼**（ASCII 的檔名與電話好好的，
   那是「編碼沒宣告、瀏覽器自己猜」最典型的樣子）。
   ⚠⚠ **Playwright 那一輪完全沒抓到**：用 `file://` 載入時 Chromium 會自己
   嗅出 UTF-8，八個寬度全綠。**編碼這種事只能對原始碼做靜態斷言，不能靠算繪驗。**
   （同一族：`version.txt` 在 Safari 上是亂碼，第九節第 23 條。） */
const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 官方帳號　交付包</title>
<style>
  :root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;
    --green:#2c5238;--brick:#89202d}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);
    font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
    -webkit-text-size-adjust:100%}
  .wrap{max-width:760px;margin:0 auto;padding:26px 14px 72px}
  h1{font-size:1.34rem;line-height:1.5;margin:0 0 .3em}
  .lede{color:var(--soft);font-size:.94rem;margin:0 0 1.6em}
  .pv-h2{font-size:1.06rem;margin:2.4em 0 .5em;padding-top:1.1em;border-top:1px solid var(--rule)}
  .pv-h2 .t{display:block;font-size:.8rem;font-weight:400;color:var(--soft);margin-top:.25em}
  h3{font-size:.86rem;color:var(--soft);font-weight:600;letter-spacing:.04em;
    margin:1.5em 0 .4em;text-transform:none}
  a{color:#214d48}
  code{font-size:.9em;background:var(--card);padding:.1em .35em;border-radius:4px}
  .pv-note,.pv-warn{font-size:.9rem;background:var(--card);border-radius:9px;
    padding:.75em .9em;margin:.6em 0}
  .pv-warn{background:#eee5e6}
  .pv-lbl{font-size:.83rem;color:var(--soft);margin:1em 0 .3em}
  .pv-copy{background:var(--card);border:1px solid var(--rule);border-radius:9px;
    padding:14px 15px;margin:0 0 .4em;white-space:pre-wrap;word-break:break-word;
    /* ⚠ 寫成 font 的簡寫再接 inherit 是無效的（family 不能寫 inherit），
       <pre> 就退回等寬字 —— 中文看不出來，但 LINE、日期、檔名會突然變等寬。 */
    font-size:15px;line-height:1.85;font-family:inherit}
  .pv-files{list-style:none;margin:.3em 0;padding:0;font-size:.92rem}
  .pv-files li{padding:.28em 0;border-bottom:1px dotted var(--rule);
    display:flex;gap:.2em .6em;justify-content:space-between;align-items:baseline;flex-wrap:wrap}
  /* ⚠ 這裡**不可以寫 white-space:nowrap** —— 圖示原檔那幾行的說明很長，
     一 nowrap 就在手機上撐出 150~260px 的水平捲動（2026-09-07 量到）。 */
  .pv-files .d{color:var(--soft);font-size:.82rem;min-width:0}
  .pv-files a{word-break:break-all}
  .n{color:var(--brick)}
  .pv-more{font-size:.88rem;margin:.9em 0 0}
  /* ⚠ 一定要給 min-width —— 只寫 width:100% 的話，外層的 overflow-x 永遠用不到，
     表格會被壓成每一格三四個字（2026-09-07 在 390 上量到檔名折成四行）。 */
  table{width:100%;min-width:600px;border-collapse:collapse;font-size:.88rem;margin:.4em 0}
  th,td{text-align:left;vertical-align:top;padding:.5em .45em;border-bottom:1px solid var(--rule)}
  th{font-size:.8rem;color:var(--soft);font-weight:600;white-space:nowrap}
  td .s{color:var(--soft);font-size:.88em}
  .scroll{overflow-x:auto}
  ol.q{padding-left:1.3em}
  ol.q li{margin:.7em 0}
</style>
</head>
<body>
<div class="wrap">
<h1>芳仁牙醫診所　LINE 官方帳號　交付包</h1>
<p class="lede">照廠商 2026-09-07 那封信的順序，一項一項把<b>圖檔</b>與<b>文字</b>放在這裡。
  圖檔的連結點下去就是線上那一張（可直接下載或填進 Flex JSON 的 <code>url</code>）；
  文字可以整段複製。<br>
  每一則的<b>模擬圖</b>在另一頁：<a href="../line-spec/">全部訊息的模擬圖 →</a></p>

${sections}

  <h2 class="pv-h2" id="m⑩">⑩ 主題與科別
    <span class="t">廠商問：只需要一般牙科、齒顎矯正兩項嗎？</span></h2>
  <p class="pv-warn"><b>不是兩項，是七項。</b>那一格是<b>橫著滑的輪播</b>，七科各一張。
    模擬圖在前一頁上是一整條、要左右滑才看得完 —— 只看畫面左邊會剛好看到第 1 張（一般牙科）
    與第 5 張（齒顎矯正），我們已經把那張圖改成一列排開，右邊被切一半的那一格就是「還有更多」。</p>
  <p class="pv-note">七科的圖<b>都已經在線上</b>，尺寸一致（1200×630），檔名見下表。
    LOGO 圖檔：<b>已經印在每一張圖右上角</b>，不必另外疊；要單獨的向量原檔見下面那一節。</p>
  <div class="scroll"><table>
    <tr><th>#</th><th>科別（按鈕上的字）</th><th>圖檔</th><th>按鈕連到</th></tr>
    ${topicRows}
  </table></div>
  <h3>文字（七科各一段，可以整段複製）</h3>
  <p class="pv-note">〔圖〕是那一格的頭圖、〔鈕〕是按鈕上的字，
    <code>────────</code> 是一條分隔線。中間那四行前面的「・」就是卡片上真的會印出來的點。</p>
  ${topicCopy}
  <p class="pv-more"><a href="../line-spec/#m10">看七科的模擬圖 →</a></p>

  <h2 class="pv-h2" id="m⑪">⑪ 衛教懶人包
    <span class="t">廠商要的：圖檔、每一頁標題＆內文、「看大圖」「讀文章」對應的圖片及連結</span></h2>
  <p class="pv-note">十張 ＋ 最後一格收尾到官網，也是<b>橫著滑的輪播</b>。
    每一格：頭圖（1024×536，卡片上顯示的那一張）＋ 標題 ＋ 一句內文 ＋ 兩顆按鈕。
    <b>「看大圖」開的是完整的那一張直式長圖</b>（在瀏覽器裡開，不受 LINE 的尺寸限制）。</p>
  <div class="scroll"><table>
    <tr><th>#</th><th>標題＆內文</th><th>頭圖</th><th>看大圖</th><th>讀文章</th></tr>
    ${healthRows}
  </table></div>
  <p class="pv-note">最後一格（第 11 格）是收尾：圖 <a href="https://fangren.net/assets/og-home.jpg">og-home.jpg</a>、
    按鈕「到網站看看」→ <a href="https://fangren.net/#topics">https://fangren.net/#topics</a>。<br>
    ⚠ <b>美白</b>與<b>拍片輻射</b>兩張沒有「讀文章」—— 站上還沒有對應的文章，那兩格只有一顆按鈕。</p>
  <h3>文字（十一格各一段，可以整段複製）</h3>
  ${healthCopy}
  <p class="pv-more"><a href="../line-spec/#m11">看十一格的模擬圖 →</a></p>

  <h2 class="pv-h2" id="icons">✱ 按鈕上那幾顆圖示的原檔
    <span class="t">廠商要的：按鈕中的診所 icon 原圖檔</span></h2>
  <p class="pv-note">下面是<b>向量原檔（SVG）</b>，<code>fill="currentColor"</code> ——
    顏色與尺寸都可以自己改。前面各則裡列的 <code>.png</code> 是已經烘好顏色、給 Flex 直接用的成品
    （<b>Flex 的 image 不吃 SVG</b>，所以送進 LINE 的一定是 PNG）。</p>
  <ul class="pv-files">${svgs.map((n) =>
    `<li><a href="https://fangren.net/assets/line-src/${n}">${n}</a><span class="d">${esc(SVG_NOTE[n] ?? "")}</span></li>`).join("")}</ul>

  <h2 class="pv-h2" id="ask">還需要答案的事</h2>
  <ol class="q">
    <li><b>評價邀約那兩顆按鈕連到哪裡？</b>（現在送的那一版）
      如果「願意推薦」通向公開評論、「不願意」通向私下表單，那是 Google 明文禁止的
      <b>review gating</b>。<b>答案出來之前 ⑦ 先不要送。</b></li>
    <li><b>Google 的「寫評論」深連結需要 Place ID</b> —— 診所手上只有分享短網址，
      要先取得才填得了 ⑦ 那顆按鈕的網址。</li>
    <li><b>綁定完成那一則的觸發字串</b>目前還含著電話號碼，要換成廠商系統產的網址。</li>
    <li><b>病人手機上卡片的實際寬度</b>：全線的排版是按 <b>268px</b> 做的，
      而那是從診所端後台的截圖推導出來的。<b>一張病人手機的截圖</b>就能收掉這一題。</li>
    <li><b>衛教懶人包的授權已經沒問題了</b> —— 2026-09-07 診所重新匯出十張，
      署名一律是<b>芳仁牙醫診所</b>（原本印的是「侑津製圖」）。
      ⚠ 新的匯出檔是 <b>720×1040</b>（舊的 1125 寬），所以頭圖只有 720×376、
      比 LINE 用得到的 804 裝置像素少 84px —— 看得出一點點軟、不會糊。
      要更銳利只能請診所給大一點的匯出檔，<b>不要放大補</b>。</li>
  </ol>
</div>
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`preview/line-handover/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  項目 ${ITEMS.length} ＋ 七科 ＋ 衛教 ${hRows.length} 格 ＋ 圖示原檔 ${svgs.length} 個`);
