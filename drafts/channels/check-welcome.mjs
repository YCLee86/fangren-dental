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

/* JSON 的第 n 段文字 ↔ 提案頁的哪個選擇器 */
const MAP = [".hc .hi", ".hc .lead", ".hc .lb", ".hc .list", ".hc .say"];
const texts = j.body.contents.filter((c) => c.type === "text");
const bad = [];

if (texts.length !== MAP.length)
  bad.push(`JSON 有 ${texts.length} 段文字，提案頁對到 ${MAP.length} 個 —— 有一邊改了沒跟上`);

texts.forEach((t, i) => {
  const sel = MAP[i];
  if (!sel) return;
  const px = SIZE[t.size];
  if (!px) { bad.push(`第 ${i + 1} 段的 size「${t.size}」不在 Flex 的表裡`); return; }
  const m = html.match(new RegExp(sel.replace(/[.\s]/g, (s) => "\\" + s) + "\\{[^}]*font-size:(\\d+)px"));
  if (!m) bad.push(`提案頁找不到 ${sel} 的 font-size（是不是寫成 rem 了？）`);
  else if (+m[1] !== px) bad.push(`${sel}：提案頁畫 ${m[1]}px，但 Flex 的 ${t.size} 是 ${px}px`);
  /* 文字本身也要在提案頁上找得到。
     ⚠ JSON 裡的換行是 "\n"，提案頁是 <br> —— 兩邊都正規化掉再比，
       但**不要連內容一起抹平**：第一版把 <br> 直接刪掉，結果 JSON 那邊多了一個
       「・」也照樣過關（那是真的不一致，換行的位置不同）。 */
  const norm = (v) => v.replace(/<br>/g, "\n").replace(/[ \t\r]/g, "");
  const plain = norm(t.text);
  const htmlPlain = norm(html);
  if (!htmlPlain.includes(plain)) bad.push(`提案頁上找不到這段文字：「${t.text}」`);
});

/* 按鈕：順序、標籤、長度 */
const labels = j.footer.contents.map((b) => b.action.label);
const inHtml = [...html.matchAll(/class="btn [^"]*" id="b\d">([^<]+)</g)].map((m) => m[1]);
if (labels.join("|") !== inHtml.join("|"))
  bad.push(`按鈕對不上：JSON「${labels.join("、")}」vs 提案頁「${inHtml.join("、")}」`);
/* ⚠ LINE 的按鈕標籤是單行、放不下就截掉。卡片 268 − 內距 28 − 按鈕內距 24 ＝ 216px，
   16px 的中文一個字 16px，所以上限約 13 個字；留餘裕抓 8 個字。 */
for (const l of labels)
  if (l.length > 8) bad.push(`按鈕標籤「${l}」有 ${l.length} 個字，塞不進按鈕（會被截掉）`);

/* 還沒拿到的網址要看得出來是佔位符，不要哪天被當成真的推上去 */
for (const b of j.footer.contents)
  if (/^https?:/.test(b.action.uri) === false && !/【.*】/.test(b.action.uri))
    bad.push(`按鈕「${b.action.label}」的 uri 既不是網址也不是佔位符：${b.action.uri}`);

console.log(bad.length
  ? "❌\n  " + bad.join("\n  ")
  : `✅ JSON 與提案頁逐項相同（${texts.length} 段文字、字級、${labels.length} 顆按鈕的標籤與順序）`);
process.exit(bad.length ? 1 : 0);
