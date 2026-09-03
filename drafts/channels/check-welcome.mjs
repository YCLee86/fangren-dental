/* 招呼圖卡的守門：**Flex 的 JSON 與提案頁畫的，要逐項相同**。
 *   node drafts/channels/check-welcome.mjs
 *
 * ⚠⚠ 這支存在的理由（2026-09-03 踩過）：提案頁的字級寫成 rem 的比例
 *   （.72rem＝11.5px 之類），而 **LINE Flex 的 size 是固定 px**
 *   （xxs 11／xs 13／sm 14／md 16／lg 19／xl 22）——
 *   每一行都畫得比 LINE 實際的小 1~2.7px。使用者一眼看出「灰底裡的字好小」。
 *   **提案頁一旦和真實算繪對不上，上面做的每一個判斷都是假的。**
 *   所以文字內容、字級、按鈕的標籤與順序，兩邊都要對得起來。
 */
import fs from "node:fs";

const SIZE = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const j = JSON.parse(fs.readFileSync("drafts/channels/welcome-card.json", "utf8"));
const html = fs.readFileSync("preview/line-welcome/index.html", "utf8");

/* JSON 的第 n 段文字 ↔ 提案頁的哪個元素。
   ⚠ 文字現在 body 與 footer 都有（兩個動作各配一句話），所以要把兩個盒子接起來看。 */
const MAP = ["#hi", "#menu", "#s1", "#s2"];
const flat = [...j.body.contents, ...j.footer.contents];
const texts = flat.filter((c) => c.type === "text");
/* ⚠ 按鈕現在是「掛了 action 的 box」，不是 type:"button"（Flex 的 button 不支援圖示）。
   兩種都認，免得日後改回去時這支靜靜地什麼都沒驗到。 */
const buttons = flat.filter((c) => c.type === "button" || (c.type === "box" && c.action));
const bad = [];

if (texts.length !== MAP.length)
  bad.push(`JSON 有 ${texts.length} 段文字，提案頁對到 ${MAP.length} 個 —— 有一邊改了沒跟上`);

texts.forEach((t, i) => {
  const sel = MAP[i];
  if (!sel) return;
  const px = SIZE[t.size];
  if (!px) { bad.push(`第 ${i + 1} 段的 size「${t.size}」不在 Flex 的表裡`); return; }
  /* 提案頁那個元素吃的是 class 的規則，所以從 id 反查它掛的 class 再找 font-size */
  const cls = { "#hi": ".hc .hi", "#menu": ".hc .menu", "#s1": ".hc .say", "#s2": ".hc .say" }[sel];
  const m = html.match(new RegExp(cls.replace(/[.\s]/g, (s) => "\\" + s) + "\\{[^}]*font-size:(\\d+)px"));
  if (!m) bad.push(`提案頁找不到 ${cls} 的 font-size（是不是寫成 rem 了？）`);
  else if (+m[1] !== px) bad.push(`${cls}：提案頁畫 ${m[1]}px，但 Flex 的 ${t.size} 是 ${px}px`);
  /* 文字本身也要在提案頁上找得到。
     ⚠ JSON 裡的換行是 "\n"，提案頁是 \n 或 <br> —— 兩邊都正規化成同一個東西再比，
       但**不要連內容一起抹平**：第一版把 <br> 直接刪掉，結果 JSON 那邊多一個「・」
       也照樣過關（那是真的不一致，換行的位置不同）。 */
  const norm = (v) => v.replace(/<br>/g, "\n").replace(/\\n/g, "\n").replace(/[ \t\r]/g, "");
  if (!norm(html).includes(norm(t.text)))
    bad.push(`提案頁上找不到這段文字：「${t.text.replace(/\n/g, " ／ ")}」`);
});

/* 按鈕：順序、標籤、長度 */
const labels = buttons.map((b) => b.action.label);
const inHtml = [...html.matchAll(/id="b\d"><img src="[^"]+" alt=""><span>([^<]+)</g)].map((m) => m[1]);
if (labels.join("|") !== inHtml.join("|"))
  bad.push(`按鈕對不上：JSON「${labels.join("、")}」vs 提案頁「${inHtml.join("、")}」`);
/* ⚠ LINE 的按鈕標籤是單行、放不下就截掉。卡片 268 − 內距 28 − 按鈕內距 24 ＝ 216px，
   16px 的中文一個字 16px，所以上限約 13 個字；留餘裕抓 8 個字。 */
for (const l of labels)
  if (l.length > 8) bad.push(`按鈕標籤「${l}」有 ${l.length} 個字，塞不進按鈕（會被截掉）`);

/* ⚠ 兩顆按鈕的 logo：一定要**兩個不同的檔**（白／綠）。透明底的暗綠疊在綠底上
   會看不見 —— 兩顆指到同一張就是這個錯，而且畫面上只會「有一顆看不太到」。 */
const marks = buttons.map((b) => (b.contents || []).filter((c) => c.type === "image").map((c) => c.url)[0]);
if (marks.some((m) => !m)) bad.push("有按鈕沒有 logo");
else if (new Set(marks).size !== marks.length) bad.push(`兩顆按鈕指到同一張 logo：${marks[0]}`);
for (const m of marks)
  if (m && !fs.existsSync("preview/line-welcome/" + m.split("/").pop()))
    bad.push(`提案頁底下沒有這張 logo：${m.split("/").pop()}（跑 node drafts/channels/mark-png.mjs）`);

/* 還沒拿到的網址要看得出來是佔位符，不要哪天被當成真的推上去 */
for (const b of buttons)
  if (!/^https?:/.test(b.action.uri) && !/【.*】/.test(b.action.uri))
    bad.push(`按鈕「${b.action.label}」的 uri 既不是網址也不是佔位符：${b.action.uri}`);

/* ⚠⚠ 事實查核：這個帳號沒有專人即時回覆訊息，所以卡片上不可以出現「有人可以問」
   那一類的承諾。掃到就擋下來。 */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "即時回", "馬上回", "找得到人", "有專人"];
for (const t of texts) for (const w of LIE)
  if (t.text.includes(w)) bad.push(`「${t.text}」出現「${w}」—— 這個帳號沒有專人即時回覆，那是說謊`);

console.log(bad.length
  ? "❌\n  " + bad.join("\n  ")
  : `✅ JSON 與提案頁逐項相同（${texts.length} 段文字、字級、${labels.length} 顆按鈕的標籤與 logo、` +
    `沒有「有人可以問」那一類的承諾）`);
process.exit(bad.length ? 1 : 0);
