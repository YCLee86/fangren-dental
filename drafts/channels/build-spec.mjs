/* 給廠商的那一頁 → preview/line-spec/index.html
 *   node drafts/channels/build-spec.mjs
 *
 * 起點是廠商 2026-09-07 的回覆：「大部分內容可以協助修改，會需要您提供完整內容及圖片置入」，
 * 後面列了八項要的東西。這一頁就是那八項的答案。
 *
 * ⚠⚠ 2026-09-07 稍晚：**模擬圖總覽與交付包合併成這一頁**（使用者：「可以把模擬圖跟
 *   交付包結合成一份嗎」）。所以現在一則就是一段：模擬圖 → 圖檔 → 可複製的文字。
 *
 * ⚠⚠⚠ **一個字都不重打。** 每一則的文字是從它自己那份 Flex JSON（或 auto-reply.txt）
 *   抽出來的，圖檔清單也是從同一份 JSON 的 `"url"` 收的 —— 這條線的鐵律
 *   （`line-spec` 那一頁的第一條）：七則的字各有出處且各自有守門，再抄一份就是第八個真相。
 *   所以**要改文案就去改那份 JSON 再重跑這一支**，不要改這一頁。
 *
 * ⚠⚠ 模擬圖擺的是**那幾頁自己拍的真產出檔**（各自 preview 資料夾裡的 shot PNG），
 *   不是用 CSS 再畫一次 —— 所以**那幾頁改了就要重跑各自的出圖腳本**，
 *   不然這一頁的圖會開始說謊。尺寸是現場讀 PNG 檔頭算的，不寫死。
 *
 * ⚠ 使用者 2026-09-07 對這一頁的兩句話要一起讀：
 *   「廠商對接窗口也是專業的 line 設計工程師，只要保留模擬圖的部分就好，
 *     目前大量的文字解說都不用」→ 所以**沒有**總表、沒有「什麼時候送給誰」的事實列、
 *     沒有 Flex 的硬條件、沒有 24 題。留下來的每一句都是**現在就會出事**的那幾件。
 *   「可以把模擬圖跟交付包結合成一份嗎」→ 但廠商真的要的東西（圖檔、文字）要在同一頁。
 *
 * ⚠ 刻意零 JS —— 交給廠商的東西沒有理由需要跑腳本。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
/* ⚠⚠ 2026-09-07：交付包與模擬圖總覽**合併成一頁**（使用者：「可以把模擬圖跟交付包
   結合成一份嗎」）。留下來的網址是 preview 底下的 line-spec —— 廠商兩封回信都照
   ①~⑪ 這組編號在講，那組編號是他在 line-spec 上看到的，**不要換掉他認得的那個網址**。
   line-handover 那一頁留著指路（我今天才給過他那個網址，直接刪會 404）。
   ⚠ 這段註解裡不要寫「兩個星號＋斜線」那種路徑寫法 —— 中間的斜線會把區塊註解
   提早關掉，而症狀是十幾行外的某一行報 ReferenceError（第九節第 8 條，又踩了一次）。 */
const OUT = path.join(ROOT, "preview", "line-spec");
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
  { n: "①", title: "招呼圖卡", when: "加入好友的當下", ask: "請提供圖檔",
    spec: "line-welcome", json: ch("welcome-card.json"),
    blocks: [["加為好友時自動送出的那一則", copy(load(ch("welcome-card.json")))]] },

  { n: "②", title: "自動回應", when: "病人在聊天室打任何一句字", ask: "（請提供完整內容）",
    spec: "line-auto-reply", json: null,
    note: "這一則是<b>純文字，不是圖卡</b> —— 貼進後台「自動回應訊息」的「一律回應」即可，診所自己就設得完，不必經過廠商。",
    blocks: [["病人在聊天室打任何字，回這一則",
      fs.readFileSync(ch("auto-reply.txt"), "utf8").trim()]] },

  { n: "③", title: "綁定完成", when: "病人綁定成功之後", askLabel: "廠商回覆：", ask: "綁定完成訊息為公版，故無法調整",
    spec: "line-bind-done", json: ch("bind-done-card.json"),
    note: "<b>那句公版我們不用改，也不必取代它。</b>「✅ 09XXXXXX 綁定成功！」是病人端送出的訊息；"
      + "我們要換的是<b>它後面那一則回覆</b> —— 現在回的是我們設在後台「自動回應」的通用文字"
      + "（那一段是給「病人在聊天室打任何字」用的），希望改成下面這張<b>綁定完成專屬的圖卡</b>，"
      + "或是<b>在公版那句後面再多送一則</b>。細節與三個要確認的問題見下面「還需要答案的事」第 1 項。",
    blocks: [["綁定完成之後送出", copy(load(ch("bind-done-card.json")))]] },

  { n: "④", title: "約診提醒", when: "看診前 48 小時", ask: "請提供圖檔",
    spec: "line-remind", json: ch("reminder-card.json"),
    blocks: [["看診前 48 小時送出", copy(load(ch("reminder-card.json")))]] },

  { n: "⑤", title: "預約成功 ＋ 約診紀錄查詢", when: "同一張卡的兩個狀態", askLabel: "廠商回覆：",
    ask: "背景只能全白或其他顏色，無法放圖示；請確認維持白底或提供色碼",
    spec: "line-booked", json: ch("booked-card.json"),
    warn: "⚠ <b>這一則有一件現在正在出錯的，比改版型優先</b>：約診紀錄查詢那張卡的日期設了"
      + " <code>maxLines: 1</code>，在輪播的窄卡上<b>真的被截斷</b>（截圖上是「2026/08/20 15:45 星…」）。"
      + "請改成 <code>wrap: true</code>、<b>不要限制行數</b> —— 放得下一行、放不下折兩行，"
      + "這樣不管卡片多寬都不會有字消失。",
    note: "<b>背景色：<code>#F4F4F5</code></b>（診所網站的卡片色）—— 不必另外設定，"
      + "<b>我們給的每一份 JSON 裡本來就寫著它</b>，七則統一，照 JSON 走就好。<br>"
      + "至於右下角那顆淡標誌：<b>我們要的不是背景圖</b>（Flex 的 box 確實沒有背景圖這個欄位，這一點沒有問題），"
      + "是一個<b>疊在卡片上的圖片元件</b>（<code>image</code> ＋ <code>position: absolute</code>，"
      + "靠 <code>offsetEnd</code>／<code>offsetBottom</code> 貼右下角，淡度已經烘在 PNG 裡）。"
      + "要確認的只有一句：<b>這樣疊得上去嗎（文字會在圖上面嗎）？</b>"
      + "疊不上去的退路是<b>把那顆淡標誌排在日期右邊、不重疊</b>，就不必用 absolute。",
    blocks: (() => { const j = load(ch("booked-card.json"));
      return [["① 預約成立的當下自動送出（單張）", copy(j["預約成功通知"])],
              ["② 點圖文選單「約診查詢」（輪播，一個約診一張，最多 12 張）",
               copy(j["約診紀錄查詢"].contents[0])]]; })() },

  { n: "⑥", title: "取消／改期那一段對話", when: "病人按了圖文選單的「預約改期」", ask: "（請提供完整內容）",
    spec: "line-cancel", json: ch("cancel-card.json"),
    blocks: (() => { const j = load(ch("cancel-card.json"));
      return [["① 按了「預約改期」→ 先問一次", copy(j["cancel-confirm"])],
              ["② 按了「是喔　要取消」", copy(j["cancel-done"])],
              ["③ 按了「按錯惹～我會去～」", copy(j["cancel-keep"])]]; })() },

  { n: "⑦", title: "評價邀約", when: "看診後", ask: "（請提供完整內容）",
    spec: "line-review", json: ch("review-card.json"),
    blocks: [["看診後送出", copy(load(ch("review-card.json")))]] },

  { n: "⑧", title: "颱風／臨時休診", when: "縣府宣布之後，發給那天有約的人",
    ask: "（請提供完整內容）",
    spec: "line-typhoon", json: ch("typhoon-card.json"),
    note: "文字是<b>診所每次自己打的</b>，所以四個〔…〕要做成可以填的欄位"
      + "（<code>{{typhoon}}</code>／<code>{{date}}</code>兩處／<code>{{weekday}}</code>）——"
      + "填完由系統發給那天有約的人，就不必一個一個貼。",
    blocks: [["颱風停診時送出", copy(load(ch("typhoon-card.json")))]] },

  { n: "⑨", title: "診所資訊", when: "圖文選單第一格", group: "圖文選單點下去回的卡", ask: "請提供圖檔、網站連結",
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

/* ---------- 模擬圖 ------------------------------------------------------
   ⚠⚠ 擺的是**那幾頁自己拍的真產出檔**，不是用 CSS 再畫一次（CLAUDE.md 第十一之五節）。
   ⚠⚠⚠ 尺寸**不寫死，現場讀 PNG 檔頭再除以它的倍率** —— 那八則自己拍的是 3×、
   `shot-oa-*` 是 1×。寫死的話，哪一頁重跑過 *-png.mjs 這裡就開始說謊，
   而症狀是「圖畫得比宣告的大／小」，版面不會破、水平溢出也還是 0（2026-09-07 踩過）。
   ⚠ `<img>` 的 width 屬性只是預設值，**任何一條 CSS 的 width 都贏過它** ——
   所以捲軸裡那幾張還要各自寫 inline 的 `width:NNNpx`。 */
/* ⚠ 錨點用阿拉伯數字：#m1~#m11 是 line-spec 原本的，不要因為標題是圈號就換掉。 */
const no = (n) => "①②③④⑤⑥⑦⑧⑨⑩⑪".indexOf(n) + 1;
const scaleOf = (src) => src.startsWith("shot-oa-") ? 1 : 3;
function pngDim(src) {
  const f = path.join(OUT, src);
  if (!fs.existsSync(f)) throw new Error(`模擬圖不存在：${src}\n  找過 ${f}`);
  const b = fs.readFileSync(f);
  const k = scaleOf(src);
  return [Math.round(b.readUInt32BE(16) / k), Math.round(b.readUInt32BE(20) / k)];
}
const SHOTS = {
  "①": [[{ src: "../line-welcome/shot-welcome.png", eager: true,
    alt: "招呼圖卡：頭圖是診所實景加一個對話框寫著「芳仁　哩厚！」，底下兩顆按鈕",
    cap: "↑ 病人手機上的真實大小（卡片 268px 寬）。以下每一張都是同一個尺度。" }]],
  "②": [[{ src: "../line-auto-reply/shot-auto-reply.png", cls: "narrow",
    alt: "自動回應：一則純文字泡泡",
    cap: "↑ <b>純文字，不是圖卡</b>　這一則留在 LINE 官方帳號後台，診所自己設。" }]],
  "③": [[{ src: "../line-bind-done/shot-bind-done.png",
    alt: "綁定完成的圖卡：頭圖、確認文字，以及一塊淡藍底的改約說明",
    cap: "↑ Flex bubble：頭圖 ＋ 兩塊淡底的方塊。" }]],
  "④": [[{ src: "../line-remind/shot-remind.png",
    alt: "約診提醒的圖卡：候診間揮手的頭圖、姓名與日期，以及三顆按鈕",
    cap: "↑ 三顆按鈕都是<b>可點的 box</b>不是 button（button 放不進 logo）。" }]],
  "⑤": [[{ src: "../line-booked/shot-booked.png", alt: "預約成功通知（單張）",
      cap: "↑ 預約成功（約診成立的當下，單張）。" },
    { src: "../line-booked/shot-query.png", scroll: true,
      alt: "約診紀錄查詢的輪播，三張卡並排",
      cap: "↑ 約診紀錄查詢（<b>輪播</b>，一個約診一張，可以左右滑）。" }],
    [{ src: "../line-booked/shot-wm.png", cls: "plain", scroll: true,
      alt: "九顆浮水印的形狀與顏色對照表",
      cap: "↑ 每一張卡右下角那顆<b>浮水印</b>的九個形狀與顏色。" }]],
  "⑥": [[{ src: "../line-cancel/shot-cancel.png",
      alt: "取消確認卡：姓名、約診時間與兩顆按鈕", cap: "↑ 確認卡（防誤按）。" },
    { src: "../line-cancel/shot-cancel-go.png",
      alt: "按了「是喔 要取消」之後回的那一則", cap: "↑ 按了「是喔　要取消」。" },
    { src: "../line-cancel/shot-cancel-no.png",
      alt: "按了「按錯惹～我會去～」之後回的那一則", cap: "↑ 按了「按錯惹～我會去～」。" }],
    [{ src: "../line-cancel/shot-cancel-chat.png", scroll: true,
      alt: "取消那一段對話在 LINE 聊天室裡的樣子", cap: "↑ 整段對話在聊天室裡的樣子。" }]],
  "⑦": [[{ src: "../line-review/shot-review.png",
    alt: "評價邀約的圖卡：評審席的頭圖，兩塊各配一顆按鈕",
    cap: "↑ 版面是這樣。" }]],
  "⑧": [[{ src: "../line-typhoon/shot-typhoon.png",
    alt: "颱風停診的圖卡：鐵門降下的診所頭圖與停診說明",
    cap: "↑ 圖卡版（要你們從系統送才有）。" }]],
  "⑨": [[{ src: "shot-oa-clinic.png", cls: "plain", scroll: true,
    alt: "診所資訊卡：診所夜景頭圖、電話地址門診時間，以及三顆按鈕",
    cap: "↑ 電話、地址、門診時間 ＋ 三顆按鈕（Google 地圖／打給診所／到網站看看）。"
      + "頭圖直接用站上那張分享圖，<b>1983 年、9 位醫師、6 個部定專科</b>已經印在圖上。" }]],
  "⑩": [[{ src: "shot-oa-topics.png", cls: "plain", scroll: true,
    alt: "七科的介紹圖卡一列排開：一般牙科、牙周治療、顯微根管、兒童牙科、齒顎矯正、植牙假牙重建、口腔外科",
    cap: "↑ <b>七科各一格</b>（不是兩格），在 LINE 上是<b>橫著滑的輪播</b>，這裡照同一個順序一列排開。"
      + "⚠ <b>要左右滑才看得完</b>，每一格左上角標著 1／7 ~ 7／7。" }]],
  "⑪": [[{ src: "shot-oa-health.png", cls: "plain", scroll: true,
    alt: "衛教懶人包的十二格圖卡一列排開",
    cap: "↑ 診所自己的紙本懶人包，一張一格；兩顆按鈕：「看大圖」開原圖、「讀文章」到站上那一篇。"
      + "⚠ <b>要左右滑才看得完</b>，共十二格 ＝ LINE 的上限。" }]],
};
const shotImg = (o) => { const [w, h] = pngDim(o.src);
  const tag = `<img src="${o.src}"${o.cls ? ` class="${o.cls}"` : ""} width="${w}" height="${h}"`
    + (o.scroll ? ` style="width:${w}px"` : "") + (o.eager ? "" : ` loading="lazy"`)
    + ` alt="${esc(o.alt)}">`;
  return (o.scroll ? `<div class="pv-scroll">${tag}</div>` : tag)
    + `<p class="pv-cap">${o.cap}</p>`; };
const shotsOf = (n) => (SHOTS[n] ?? []).map((g) =>
  `<div class="pv-shot">${g.map(shotImg).join("")}</div>`).join("");

const sections = ITEMS.map((it) => {
  const urls = it.json ? imgs(it.json) : [];
  return `
  ${it.group ? `<p class="pv-group"><b>以下三張是圖文選單點下去回的卡</b>，不是自動推播。
    現在線上那幾格回的是廠商的預設值，這三張是要拿去換掉它的。</p>` : ""}
  <h2 class="pv-h2" id="m${no(it.n)}">${it.n} ${esc(it.title)}
    <span class="t">${esc(it.when)}${it.spec ? `　—　<a href="../${it.spec}/">完整規格 →</a>` : ""}</span>
    <span class="t2">${it.askLabel ?? "廠商要的："}${esc(it.ask)}</span></h2>
  ${it.warn ? `<p class="pv-warn">${it.warn}</p>` : ""}
  ${it.note ? `<p class="pv-note">${it.note}</p>` : ""}
  <h3>模擬圖</h3>
  ${shotsOf(it.n)}
  ${urls.length ? `<h3>圖檔（點下去就是線上那一張）</h3>${imgList(urls)}` : ""}
  <h3>文字</h3>
  ${it.blocks.map(([label, body]) =>
    `<p class="pv-lbl">${esc(label)}</p><pre class="pv-copy">${esc(body)}</pre>`).join("")}`;
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
      : `<span class="n">沒有這顆鈕</span>`}</td>
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
  .pv-h2 .t2{display:block;font-size:.78rem;font-weight:400;color:var(--soft);margin-top:.15em}
  .pv-group{font-size:.9rem;color:var(--soft);margin:2.6em 0 0;
    border-top:1px solid var(--rule);padding-top:1.1em;line-height:1.8}
  .pv-group b{color:var(--ink)}
  /* ---- 模擬圖：擺真的產出檔，不要用 CSS 再畫一次 ---------------------- */
  .pv-shot{margin:.5em 0 0;background:#e9edf1;border:1px solid var(--rule);
    border-radius:10px;padding:12px;display:flex;flex-direction:column;
    align-items:flex-start;gap:10px}
  .pv-shot img{display:block;width:268px;height:auto;max-width:100%;
    border-radius:9px;box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .pv-shot img.narrow{width:204px}
  .pv-shot img.plain{box-shadow:none;border-radius:0}
  /* ⚠⚠⚠ 捲軸裡每一張都要自己寫 inline 的 width:NNNpx（產生器會寫），
     這裡**絕對不可以寫 width:auto** —— 那會蓋掉 <img> 的 width 屬性、
     讓圖退回「原始像素尺寸」，3× 拍的那幾張因此畫成三倍大。
     症狀是「手機上有幾張特別巨大」，而版面沒破、水平溢出仍然是 0（2026-09-07 踩過）。 */
  .pv-scroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
  .pv-scroll img{max-width:none}
  .pv-cap{font-size:.8rem;color:var(--soft);line-height:1.7;margin:0}
  .pv-cap b{color:var(--ink)}
  .pv-cap .n{color:var(--brick);font-weight:700}
  /* ---- 目錄 ---------------------------------------------------------- */
  .pv-toc{margin:1.2em 0 0;font-size:.88rem;line-height:1.9}
  .pv-toc a{display:block;color:var(--ink);text-decoration:none;
    border-bottom:1px solid var(--rule);padding:4px 0}
  .pv-toc a:last-child{border-bottom:0}
  .pv-toc a .n{color:var(--soft);font-size:.9em}
  .pv-toc .sep{font-size:.9em;color:var(--soft);padding:9px 0 2px;
    border-bottom:1px solid var(--rule)}
</style>
</head>
<body>
<div class="wrap">
<h1>芳仁牙醫診所　LINE 官方帳號</h1>
<p class="lede">這個帳號上該有哪幾則訊息與哪幾張卡：一項一項附上<b>模擬圖</b>、
  <b>圖檔的線上網址</b>與<b>可以整段複製的文字</b>。<br>
  圖檔連結點下去就是線上那一張（可直接下載，或填進 Flex JSON 的 <code>url</code>）。
  每一則的 Flex JSON、量測與逐句的理由，在標題底下那個<b>完整規格</b>連結裡。</p>

<div class="pv-toc">
  <div class="sep">自動送出的訊息</div>
  <a href="#m1">① 招呼圖卡　<span class="n">加入好友</span></a>
  <a href="#m2">② 自動回應　<span class="n">病人打字</span></a>
  <a href="#m3">③ 綁定完成　<span class="n">綁定成功之後</span></a>
  <a href="#m4">④ 約診提醒　<span class="n">看診前 48 小時</span></a>
  <a href="#m5">⑤ 預約成功 ＋ 約診紀錄查詢</a>
  <a href="#m6">⑥ 取消／改期那一段對話</a>
  <a href="#m7">⑦ 評價邀約　<span class="n">看診後</span></a>
  <a href="#m8">⑧ 颱風／臨時休診</a>
  <div class="sep">圖文選單點下去回的卡</div>
  <a href="#m9">⑨ 診所資訊</a>
  <a href="#m10">⑩ 主題與科別　<span class="n">七科輪播</span></a>
  <a href="#m11">⑪ 衛教懶人包　<span class="n">十二張</span></a>
  <div class="sep">最後</div>
  <a href="#icons">✱ 按鈕上那幾顆圖示的原檔</a>
  <a href="#ask">✱ 還需要答案的事</a>
</div>

${sections}

  <h2 class="pv-h2" id="m10">⑩ 主題與科別
    <span class="t">圖文選單「診療項目」那一格　七科輪播</span>
    <span class="t2">廠商問：只需要一般牙科、齒顎矯正兩項嗎？</span></h2>
  <h3>模擬圖</h3>
  ${shotsOf("⑩")}
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

  <h2 class="pv-h2" id="m11">⑪ 衛教懶人包
    <span class="t">圖文選單「衛教資訊」那一格　十二張</span>
    <span class="t2">廠商要的：圖檔、每一頁標題＆內文、「看大圖」「讀文章」對應的圖片及連結</span></h2>
  <h3>模擬圖</h3>
  ${shotsOf("⑪")}
  <p class="pv-note"><b>十二張</b>，也是<b>橫著滑的輪播</b> —— 十二格正好是 LINE 的上限，再加就送不出去。
    每一格：頭圖（<b>1024×536</b> ＝ LINE 對 Flex 圖檔的上限，卡片上顯示的那一張）＋ 標題 ＋ 一句內文 ＋ 兩顆按鈕。
    <b>「看大圖」開的是完整的那一張直式長圖</b>（在瀏覽器裡開，不受 LINE 的尺寸限制）。</p>
  <div class="scroll"><table>
    <tr><th>#</th><th>標題＆內文</th><th>頭圖</th><th>看大圖</th><th>讀文章</th></tr>
    ${healthRows}
  </table></div>
  <p class="pv-note">⚠ 有<b>四張沒有「讀文章」</b>，那四格只有一顆按鈕：<b>美白</b>與<b>拍片輻射</b>是站上還沒有對應的文章，
    <b>植牙</b>與<b>活動假牙</b>是診所指定先不放。<br>
    ⚠ <b>智齒</b>與<b>手術照護</b>連到同一篇 —— 站上目前只有一篇涵蓋那兩件事，不是填錯。<br>
    ⚠ 這一條<b>沒有</b>收尾到官網那一格（原本有）：十二格已經滿了，而官網的入口在
    ⑨ 診所資訊那張卡的第三顆按鈕「到網站看看　fangren.net」。</p>
  <h3>文字（十二格各一段，可以整段複製）</h3>
  ${healthCopy}

  <h2 class="pv-h2" id="icons">✱ 按鈕上那幾顆圖示的原檔
    <span class="t">廠商要的：按鈕中的診所 icon 原圖檔</span></h2>
  <p class="pv-note">下面是<b>向量原檔（SVG）</b>，<code>fill="currentColor"</code> ——
    顏色與尺寸都可以自己改。前面各則裡列的 <code>.png</code> 是已經烘好顏色、給 Flex 直接用的成品
    （<b>Flex 的 image 不吃 SVG</b>，所以送進 LINE 的一定是 PNG）。</p>
  <ul class="pv-files">${svgs.map((n) =>
    `<li><a href="https://fangren.net/assets/line-src/${n}">${n}</a><span class="d">${esc(SVG_NOTE[n] ?? "")}</span></li>`).join("")}</ul>

  <h2 class="pv-h2" id="ask">還需要答案的事</h2>
  <ol class="q">
    <li><b>綁定完成那一則，現在是誰在回？</b>（後台的「自動回應訊息」，還是你們系統？）<br>
      我們想改成：<b>綁定成功的當下由你們系統送 ③ 那張圖卡</b>，或在公版那句後面再多送一則 ——
      <b>公版那句不用動。</b><br>
      ⚠ 跟著要確認的一件：<b>後台的「自動回應訊息」如果同時開著，病人會不會兩則一起收到</b>
      （圖卡 ＋ ② 那段通用文字）？如果會，是不是要把後台的自動回應關掉、② 那一則也改由你們系統回？<br>
      ⚠ 一件背景，免得繞路：後台的關鍵字回應是<b>完全一致</b>比對，而那句話含著每個人不同的
      電話號碼 —— <b>後台永遠抓不到它</b>，所以這一則只能由你們系統處理。</li>
    <li><b>⑤ 那兩張卡右下角的淡標誌，用 <code>position: absolute</code> 疊得上去嗎？</b>
      （要的是文字在圖上面。）疊不上去就改成<b>排在日期右邊、不重疊</b> ——
      兩種我們都可以，只要先知道是哪一種；圖檔九顆都已經在線上了。</li>
    <li><b>病人手機上卡片的實際寬度</b>：全線的排版是按 <b>268px</b> 做的，
      而那是從診所端後台的截圖推導出來的。<b>一張病人手機的截圖</b>就能收掉這一題。</li>
    <li><b>衛教懶人包的授權已經沒問題了</b> —— 2026-09-07 診所重新匯出十二張，
      署名一律是<b>芳仁牙醫診所</b>（原本印的是「侑津製圖」）。
      ⚠ 中間一度只匯出 720×1040（頭圖 720，比實際用得到的 804 裝置像素還少）——
      同一天診所把 PowerPoint 的匯出解析度調高、十二張全部重匯，現在原檔是
      <b>1384×2000</b>，頭圖 <b>1024×536</b> ＝ LINE 的上限，是<b>縮下來</b>不是不夠。</li>
  </ol>
</div>
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`${path.relative(ROOT, OUT)}/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  項目 ${ITEMS.length} ＋ 七科 ＋ 衛教 ${hRows.length} 格 ＋ 圖示原檔 ${svgs.length} 個`);
