#!/usr/bin/env node
/* 守門：預約成功通知 ＋ 約診紀錄查詢的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-booked.mjs
 *
 * 同 check-welcome.mjs／check-bind-done.mjs／check-remind.mjs 那條道理：
 * **規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 * 這一支比對八件：
 *   ① 兩則的每一段文字逐字（含加粗的姓名）
 *   ② 字級（LINE Flex 的固定 px 表 —— 定案 日期 lg 19／姓名 md 16／小字 xs 13）
 *   ③ 顏色（卡 #FFFFFF ＝ 規格頁的 --wcard・墨 #2A2C27・柔墨 #5C5F57，一顆都沒新增）
 *   ④ 浮水印：九顆的寬度與長寬比要**逐筆等於 wm-sizes.json**（唯一出處）
 *   ⑤ 浮水印：九顆 × 三個濃度的 PNG 都在，而且不超過 LINE 的 1024×1024
 *      ＋ **淡墨色那一版**（`wm-<形狀>-ink12.png`，九張，第 ②之二 節的 Ⓒ 在用）
 *   ⑥ 浮水印的顏色：JSON 的對照表要等於 wm-sizes.json 算出來的那一組
 *   ⑦ 紅線：不可以出現「有問題隨時問」那一類的承諾；emoji 0 個
 *   ⑧ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠⚠ 而且那一頁的浮水印是 fetch("wm-sizes.json") 讀回來的，`file://` 拿不到
 *   —— 這一支自己起一個 HTTP 伺服器再開（同 booked-png.mjs）。
 * ⚠ 一律 headless_shell（DECISIONS.md 第九節第 18 條）。
 * ⚠⚠ **姓名與日期兩處刻意不逐字比對**：JSON 寫 {{patient}}／{{date}}，
 *   規格頁寫看得懂的示範值（〔病人姓名〕／8月25日 (二) 10:15）。
 *   所以這兩處檢查的是「兩邊都是變數的位置」＋「規格頁上不准直接印 {{…}}」。
 *   （check-remind 那一支第一版照字面比，兩處都誤報。）
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-booked");
const JSONF = path.join(HERE, "booked-card.json");
const SIZESF = path.join(DIR, "wm-sizes.json");
const PAGE = path.join(DIR, "index.html");

const card = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const sizes = JSON.parse(fs.readFileSync(SIZESF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };

/* 這兩則的卡片底色（2026-09-14 使用者指定從 #F4F4F5 換成純白）。
   ⚠⚠ 出處只有一個：規格頁 :root 的 --wcard —— 這裡**讀回來**不要抄一份，
     抄了之後改一邊，JSON 與畫面會靜靜地分家（而每一道尺寸守門都會過）。 */
const WCARD = ((fs.readFileSync(PAGE, "utf8")
  .match(/--wcard:\s*(#[0-9a-fA-F]{6})/) || [])[1] || "").toUpperCase();
ok(/^#[0-9A-F]{6}$/.test(WCARD), "規格頁的 :root 裡找不到 --wcard —— 卡片底色沒有出處了");
ok(WCARD === "#FFFFFF",
  `卡片底色該是純白（2026-09-14 定案），規格頁寫的是 ${WCARD || "（找不到）"}`);
const ORDER = ["r1c1", "r1c2", "r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r3c2", "r3c3"];
const flat = (t) => (t.text != null ? t.text : t.contents.map((c) => c.text).join(""));

function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  throw new Error("只支援 PNG：" + file);
}

/* ---- ① 兩則的殼：內容 box（relative）＋ 浮水印（absolute）------------ */
const BOOKED = card["預約成功通知"];
const QUERY = card["約診紀錄查詢"].contents[0];
for (const [name, b] of [["預約成功", BOOKED], ["查詢輪播", QUERY]]) {
  const kids = b.body.contents;
  ok(kids.length === 2, `${name}：body 應該只有兩個子元件（內容 ＋ 浮水印），現在 ${kids.length}`);
  /* ⚠⚠⚠ 這一條是這一支最要緊的：Flex **不准一個 box 的第一個子元件是 absolute**。
     內容排前面、浮水印排後面 —— 順序寫反的話 LINE 直接不畫，而且錯誤訊息很難讀。 */
  ok(kids[0].position !== "absolute",
    `${name}：第一個子元件不可以是 position: absolute（Flex 的硬限制）`);
  ok(kids[0].position === "relative",
    `${name}：內容那個 box 要 position: relative，浮水印才會被壓在它下面`);
  ok(kids[1].position === "absolute", `${name}：浮水印要 position: absolute`);
  ok(b.body.backgroundColor === WCARD,
    `${name}：卡色要 ${WCARD}（規格頁的 --wcard），現在 ${b.body.backgroundColor}`);
  ok(b.body.paddingAll === "14px", `${name}：內距要 14px（和另外三則同一套）`);
}

/* ---- ② 文字逐字 ＋ 字級 ＋ 顏色 -------------------------------------- */
const bk = BOOKED.body.contents[0].contents;
const qk = QUERY.body.contents[0].contents;
ok(bk.length === 4, `預約成功：應該是 4 段（開場／日期／小字 ×2），現在 ${bk.length}`);
ok(qk.length === 2, `查詢輪播：應該是 2 段（姓名／日期），現在 ${qk.length}`);

/* 開場那一段：加粗的姓名變數 ＋「　約好囉」（使用者自己寫的，逐字） */
ok(bk[0].contents && bk[0].contents[0].weight === "bold",
  "預約成功：開場那個姓名沒有加粗");
ok(bk[0].contents[0].text === "{{patient}}", "預約成功：姓名要是 {{patient}} 變數");
ok(bk[0].contents[1].text === "　約好囉",
  `預約成功：開場的第二段該是「　約好囉」，現在「${bk[0].contents[1].text}」`);
ok(PX[bk[0].size] === 16, `預約成功：開場字級該是 md 16，現在 ${bk[0].size}`);

const FINE = ["異動請在2天前(不含假日)與診所聯繫", "看診前2天會再提醒一次，記得回覆喔～"];
FINE.forEach((t, i) => {
  ok(bk[2 + i].text === t, `預約成功：第 ${i + 1} 條小字對不上 —— 「${bk[2 + i].text}」`);
  ok(PX[bk[2 + i].size] === 13, `預約成功：第 ${i + 1} 條小字該是 xs 13`);
  ok(bk[2 + i].color === "#5C5F57", `預約成功：第 ${i + 1} 條小字該是柔墨`);
  /* ⚠ 括號是**半形**（使用者 2026-09-05 指定，全形一組多吃約 19px）。 */
  ok(!/[（）]/.test(t), `預約成功：第 ${i + 1} 條裡有全形括號，定案是半形`);
});

/* 日期：兩則都是 lg 19、粗體、墨，而且**一定要 wrap**（那是這一輪唯一在修的 bug） */
for (const [name, d] of [["預約成功", bk[1]], ["查詢輪播", qk[1]]]) {
  ok(d.text === "{{date}}", `${name}：日期要是 {{date}} 變數`);
  ok(PX[d.size] === 19, `${name}：日期字級該是 lg 19，現在 ${d.size}`);
  ok(d.weight === "bold", `${name}：日期要粗體`);
  ok(d.color === "#2A2C27", `${name}：日期要用墨 #2A2C27`);
  /* ⚠⚠⚠ 這一條就是這兩則現在正在出錯的那件事：廠商那一版設了 maxLines: 1，
     日期在輪播的寬度上被**截斷**（截圖上真的截了）。wrap 才不會有字消失。 */
  ok(d.wrap === true, `${name}：日期一定要 wrap: true —— 現在線上是 maxLines: 1，字會被截掉`);
  ok(d.maxLines == null, `${name}：日期不可以有 maxLines`);
}
ok(qk[0].text === "{{patient}}", "查詢輪播：姓名要是 {{patient}} 變數");
ok(PX[qk[0].size] === 16, `查詢輪播：姓名字級該是 md 16，現在 ${qk[0].size}`);
ok(qk[0].color === "#5C5F57", "查詢輪播：姓名要用柔墨（它是標籤不是主角）");

/* ---- ③ 沒有按鈕、沒有彩色方塊（這兩則是收據）------------------------ */
const dump = JSON.stringify([BOOKED, QUERY]);
ok(!/"action"/.test(dump), "這兩則上不該有任何按鈕（沒有「現在請你做」的動作）");
ok((dump.match(/"backgroundColor": ?"(#[0-9A-Fa-f]{6})"/g) || [])
     .every((s) => s.toUpperCase().includes(WCARD)),
  "這兩則上不該有淡底彩色方塊 —— 那是給警示與行動用的（底色只准是卡片色）");

/* ---- ④⑤⑥ 浮水印：對照表 ↔ wm-sizes.json ↔ 真的 PNG ------------------ */
/* ---- 兩則各自的浮水印寬度（＝規格頁那兩張定案的表，這裡現算一次去對）----
   ⚠ 倍率的出處只有一個：規格頁的 SPREAD1／WIDEK2。守門把它們**從頁面讀回來**，
     不要在這裡抄一份 —— 抄了之後改一邊，兩邊會靜靜地分家。 */
const SPREAD1 = readTable("SPREAD1"), WIDEK2 = readTable("WIDEK2");
function readTable(name) {
  const m = fs.readFileSync(PAGE, "utf8").match(
    new RegExp("var " + name + " = \\{([^}]*)\\};"));
  if (!m) { bad.push(`規格頁上找不到 ${name} 那張定案的表`); return {}; }
  const o = {};
  for (const [, k, v] of m[1].matchAll(/(\w+):\s*(\.?[\d.]+)/g)) o[k] = parseFloat(v);
  return o;
}
const GM = Math.exp(ORDER.reduce((a, n) => a + Math.log(sizes[n].w), 0) / ORDER.length);
function wantW(n, isQuery) {
  const w = sizes[n].w;
  if (isQuery) return Math.round(w * (WIDEK2[n] || 1));
  return SPREAD1[n] ? Math.round(w * Math.pow(GM / w, SPREAD1[n])) : w;
}

const table = card["_浮水印"];
ok(Object.keys(table).length === 9, `浮水印對照表該有九筆，現在 ${Object.keys(table).length}`);
ok(JSON.stringify(Object.keys(table)) === JSON.stringify(ORDER),
  "浮水印對照表的順序要照 r1c1…r3c3 —— (月＋日)%9 就是對到這個順序");
for (const n of ORDER) {
  const t = table[n], z = sizes[n];
  if (!t || !z) { bad.push(`浮水印 ${n} 少了一邊`); continue; }
  /* ⚠⚠⚠ 2026-09-14 起**兩則各一欄**（使用者逐顆挑的）：單張 r3c2→131／r3c3→186，
     輪播 r1c3→141／r2c3→141／r3c3→142，其餘維持 wm-sizes.json 的原寬。
     ⚠ 這裡**現算一次**去對，不在守門裡再抄一份數字 —— 抄一份就是第三個真相。 */
  ok(t.watermark_size_single === wantW(n, false) + "px",
    `浮水印 ${n} 的單張寬度 ${t.watermark_size_single} 對不上算出來的 ${wantW(n, false)}px`);
  ok(t.watermark_size_carousel === wantW(n, true) + "px",
    `浮水印 ${n} 的輪播寬度 ${t.watermark_size_carousel} 對不上算出來的 ${wantW(n, true)}px`);
  ok(!("watermark_size" in t),
    `浮水印 ${n} 還留著舊的 watermark_size —— 兩則的寬度不一樣，那一欄已經拆成兩欄`);
  ok(t.watermark_ratio === z.ratio + ":1",
    `浮水印 ${n} 的長寬比 ${t.watermark_ratio} 對不上 wm-sizes.json 的 ${z.ratio}`);
  ok(t["色"].toLowerCase() === z.color.toLowerCase(),
    `浮水印 ${n} 的顏色 ${t["色"]} 對不上 wm-sizes.json 的 ${z.color}`);
  /* 九顆 × 三個濃度都要在，而且不超過 LINE 的 1024×1024 */
  for (const k of ["08", "12", "18", "ink12"]) {
    const f = path.join(DIR, `wm-${n}-${k}.png`);
    if (!fs.existsSync(f)) { bad.push(`少了 ${path.basename(f)}（跑 booked-mark.mjs）`); continue; }
    const s = imgSize(f);
    ok(s.w <= 1024 && s.h <= 1024, `${path.basename(f)} 是 ${s.w}×${s.h}，超過 LINE 的 1024`);
    /* ⚠ 長寬比要對得上 —— 寫錯 aspectRatio 在 LINE 上**不報錯也不變形**，
       只會靜靜地縮小、四周留白（第十一之二節）。 */
    if (k === "12")
      ok(Math.abs(s.w / s.h - z.ratio) < 0.02,
        `${path.basename(f)} 真實長寬比 ${(s.w / s.h).toFixed(3)} 對不上 ${z.ratio}`);
  }
}
/* ⚠⚠⚠ 第 ②之二 節那張卡是**第三個輪播**（#pv-slot7），
   而這一頁的輪播寬度寫在**用 id 列出來**的三條選擇器裡 ——
   新 slot 沒加進去的話它會退回 `width:100%`、畫成 218.6px，
   **畫面完全正常**，而在一張 218.6 的卡上判斷「放不放得下」全是假的
   （2026-09-12 的 pv-slot5/6 已經踩過一次，見 README 第 50-18 節）。 */
{
  const html = fs.readFileSync(PAGE, "utf8");
  const LINES = [[".car", "overflow-x:auto;scrollbar-width"],
                 [".car .row", "gap:8.7px"],
                 [".car .pv-hc", "flex:none;width:var(--carw"]];
  for (const [sel, body] of LINES) {
    const line = html.split("\n").find((l) => l.startsWith("#pv-slot") && l.includes(body));
    if (!line) { bad.push(`找不到「${sel}」那一條輪播寬度的規則`); continue; }
    for (const id of ["#pv-slot9"])
      ok(line.includes(id + sel),
        `${sel} 那一條少了 ${id} —— 那一張輪播會退回 width:100%、畫成 218.6px`);
  }
  /* ⚠⚠ 對齊 2026-09-12 定案「基線」（使用者從三種裡挑的），所以那一列一定要是
     `align-items: baseline`，而落選那兩種的樣式與對照帶都已經收掉。
     ⚠ 改成 flex-end 的話畫面只差 1px、**每一道尺寸守門都會過**，只有讀這條規則才看得出來。 */
  ok(/\.pv-nw \.st\{[^}]*align-items:baseline/.test(html),
    "那一列不是基線對齊 —— 2026-09-12 定案是基線");

  /* ⚠⚠ 卡片底色 2026-09-14 換成純白：三個地方要一起吃 --wcard，不然這一頁上
     「卡片長什麼樣」和「面板算出來的數字」會用兩個不同的底，而畫面完全正常。 */
  ok(/\.pv-nw\{background:var\(--wcard\)\}/.test(html),
    "那兩張卡沒有吃 --wcard —— 底色會退回站上的卡片色 #f4f4f5");
  ok(/\.pv-wm figure\{background:var\(--wcard\)/.test(html),
    "九顆的對照格沒有吃 --wcard —— 那一格會拿和卡片不一樣的底去展示濃度");
  ok(/var WCARD = \(getComputedStyle\(document\.documentElement\)/.test(html),
    "面板沒有從 --wcard 讀底色 —— 寫死的底會讓對比與 L* 從換色那一刻起說謊");
  /* ⚠ 掃的是「拿來算」的那兩處，不是整頁 —— 頁面上講「先前寫的是 #F4F4F5」
     是說明不是規格（這條線第九次撞到「掃字會掃到自己的說明」）。 */
  ok(!/_cr\([^)]*#[fF]4[fF]4[fF]5/.test(html) && !/0xf4, 0xf4, 0xf5/.test(html),
    "面板還拿寫死的 #f4f4f5 在算對比或 L* —— 底色只准從 --wcard 讀");
  for (const c of [".st.bot", ".st.botbox", "pv-stcmp", 'class="st bot', 'class="st botbox'])
    ok(!html.includes(c), `落選那兩種的對齊（${c}）又跑回頁面上 —— 定案只留基線那一種`);
  ok(/h \+= '<p class="st">'/.test(html),
    "那一列的 class 被動過了 —— 定案只有基線那一種，不該再有變體");
  /* ⚠⚠ 落選那兩種的數字不可以跟著畫面一起消失 —— 面板要繼續印，
     不然日後沒有人知道「只加靠下對齊」為什麼不夠。 */
  for (const n of ["5.52px", "4.52px", "0.52px"])
    ok(html.includes(n), `面板少印了對齊那三個逐像素量到的數字（${n}）`);
  /* ⚠ 頁面上只剩一張卡，而它一定要是「藥丸 ＋ 淡墨浮水印」那一版
     （2026-09-12 使用者挑定）—— 少了這兩行，畫出來是彩色浮水印配套色的字。 */
  ok(/stat = "pill"; wmink = true;/.test(html),
    "那一張卡不是「藥丸 ＋ 淡墨浮水印」—— 使用者挑定的是那一版");
  ok(!/stat = "txt";/.test(html),
    "頁面上又畫了「字套色」那一版 —— 使用者 2026-09-12 指定只留藥丸那一種");
  ok(/wm-'\s*\+\s*sn\s*\+\s*'-'\s*\+\s*\(wmink \?/.test(html),
    "卡片沒有在吃 wmink —— Ⓒ 會畫成和 Ⓑ 一模一樣的彩色浮水印");
  ok(/\.pill\{[^}]*line-height:1;[^}]*padding:\.42em \.63em \.38em/.test(html),
    "藥丸的行高與上下內距被改掉了 —— 塊會離開「約診狀態」那幾個字的字面中線（低 1.40px）");

  /* ---- 日期那一行：2026-09-13 定案「指定斷行」-------------------------
     ⚠⚠⚠ 使用者在手機上看到輪播的日期折在「星期／四」中間（一個字被丟到下一行），
       兩種擺出來之後挑了「指定斷行」。落選那一版（不斷行）**不再畫成一張卡**，
       但它的數字要留在面板上（第九節第 28 條 ④）。 */
  ok(html.includes('dtm = "brk";'), "第 ②之二 節沒有在畫「指定斷行」那一版");
  ok(!/dtm = "one";/.test(html),
    "「不斷行」那一版又被畫回頁面上 —— 2026-09-13 使用者挑的是指定斷行");
  ok(/id="pv-chat9"/.test(html) && /queryChat\("pv-slot9"\)/.test(html) && /id="pv-panel9"/.test(html),
    "定案那一張的手機框、slot 或面板不見了");
  ok(/\.pv-nw \.dt\.one\{white-space:nowrap\}/.test(html),
    "落選那一版的樣式被刪了 —— 它還要拿來量「降到哪一階才收得下」");
  /* ⚠⚠ 落選那一版的字級只能是 Flex 的固定階，而且要小到真的收得下（量出來是 sm 14）。 */
  const one = html.match(/var ONE_FS = (\d+);/);
  ok(one && [11, 13, 14, 16, 19, 22, 27].includes(+one[1]),
    "ONE_FS 不是 Flex 的固定階（xxs 11／xs 13／sm 14／md 16／lg 19／xl 22／xxl 27）");
  ok(one && +one[1] <= 14,
    `ONE_FS = ${one && one[1]} 在 179px 的那一行放不下（md 16 量到 182px）`);
  /* ⚠⚠⚠ 斷點要從 fmt() 現場切，**不可以另打一份日期**：
     DATE 那一份換了寫法時，寫死的那一份會靜靜地變成第二個真相。 */
  ok(/function dtBrk\(a\) \{\s*var s = fmt\(a\)/.test(html),
    "dtBrk 沒有從 fmt() 切 —— 日期不可以在第二個地方再打一份");
  ok(/throw new Error\("日期裡找不到「 星期」/.test(html),
    "dtBrk 切不到斷點時沒有 throw —— 它會靜靜地退回一行，看起來像定案那一版沒有生效");
  /* ⚠ 面板要留著：落選那一版的數字、以及「單張那一則不受影響」那一句。 */
  for (const n of ["落選那一版（不斷行）", "定案・指定斷行", "單張那一則"])
    ok(html.includes(n), `面板少了「${n}」那一行量測`);

  /* ---- 兩把新的尺（2026-09-13，使用者：「logo 可以再往左移」）----------
     ⚠⚠ 浮水印的預設位置**一定要是往右溢出 18px** —— 那是 2026-09-13 定案的樣子，
       而 shot-booked.png／shot-query.png 與廠商那一頁的規格圖都是照它出的；
       改掉預設值那幾張圖會跟著變，而每一道尺寸守門都會過。 */
  ok(/\n      wmr = -18[,;]/.test(html),   /* ⚠ 2026-09-14 之後它後面還接著 WIDE3，所以逗號也算 */
    "浮水印的預設位置不是往右溢出 18px —— 那是定案的值，尺上的格子不可以寫回預設");
  ok(/right:var\(--wmr,-18px\)/.test(html),
    "浮水印的 right 沒有吃 --wmr（或退回值不是 -18px）—— 尺會按了沒反應");
  ok(/--wmr:' \+ wmr \+ 'px/.test(html), "卡片沒有把 wmr 寫進 style —— 那把尺不會生效");
  /* ---- 那兩把尺 2026-09-14 收掉了，留下來的是它們量出來的那一件事 ------
     ⚠⚠⚠ 「浮水印往左移多少」從來沒挑，而且和「往右溢出 18px」那個定案互相矛盾；
       「卡片可不可以窄一點」micro 已經定案。**尺收掉了，數字不可以跟著消失。**
     ⚠ 留下來的是：卡片換成 micro 之後，第 ② 節那張（**自由折行** ＝ 09-13 給廠商
       的那一版）折在「星期／四」中間 —— 那正是 09-13 使用者退回過的樣子。 */
  ok(/id="pv-panel-dtwarn"/.test(html), "少了第 ② 節那張日期的量測面板 #pv-panel-dtwarn");
  ok(/var s2 = document\.querySelector\("#pv-slot2 \.pv-hc \.dt"\);/.test(html),
    "那一段沒有去量第 ② 節那張卡本人 —— 上面那幾張吃的是指定斷行，量不到它");
  /* ⚠ 判準是「星期X 那三個字要整段落在同一行」，不可以只數行數 ——
     折成兩行是對的，折在「星期／四」中間才是壞的，兩者行數一模一樣。 */
  ok(/var s2tok = "星期" \+ APPTS\[0\]\.w;/.test(html)
     && /!s2ln\.some\(function \(L\) \{ return L\.s\.indexOf\(s2tok\) >= 0; \}\)/.test(html),
    "那一段沒有現場量「星期幾有沒有被折斷」—— 只數行數分不出來");
  ok(html.includes("治得住的只有<b>指定斷行</b>"),
    "那一段沒有寫出唯一治得住的做法（指定斷行）");
  /* ⚠⚠⚠ 「量到的」和「我們要的」是兩件事，要分開存（2026-09-14）：
     MEAS_STEP/MEAS_W 是 padding 校正對出來的**廠商現在跑的那一階**（deca／207px，
     它同時是比例尺的錨），WANT_STEP 是**使用者定案要換過去的那一階**（micro）。
     兩個混成一個變數的話，換一階就等於換掉比例尺，整把尺一起縮水
     ——同 post-map 那個 WMREF 的坑。 */
  const measStep = html.match(/var MEAS_STEP = "([a-z]+)";/);
  const wantStep = html.match(/var WANT_STEP = "([a-z]+)";/);
  ok(measStep && measStep[1] === "deca",
    `頁面上寫的「廠商現在跑的」是 ${measStep && measStep[1]} —— padding 校正對出來的是 deca`);
  ok(wantStep && wantStep[1] === "micro",
    `頁面上寫的「我們要的」是 ${wantStep && wantStep[1]} —— 2026-09-14 使用者定案是 micro`);
  ok(/var MEAS_W = 207;/.test(html), "比例尺的錨（MEAS_W = 207）不見了或被改過");
  const carSize = card["約診紀錄查詢"].contents[0].size;
  ok(carSize === (wantStep && wantStep[1]),
    `booked-card.json 的輪播 bubble 是 ${carSize}、頁面要的是 ${wantStep && wantStep[1]} —— 兩份要指同一階`);
  ok(card["預約成功通知"].size === "mega", "單張那一則不是 mega");
  /* ⚠⚠ 卡片寬度一律吃變數（--carw 給那三條用 id 列出來的規則、--cw 給尺），
     退回值也要是 micro 算出來的那個數字，不然 CSS 沒載到時會畫成 deca。 */
  ok(/--carw,162px/.test(html) && /width:var\(--cw,162px\)/.test(html),
    "卡片寬度的退回值不是 micro 算出來的 162px");
  ok(/setProperty\("--carw", CAR_W \+ "px"\)/.test(html),
    "render() 沒有把 --carw 設成 CAR_W —— 輪播會停在 CSS 的退回值");
  ok(/var CAR_W = Math\.round\(bubblePx\(stepOf\(WANT_STEP\)\)\);/.test(html),
    "CAR_W 沒有從 WANT_STEP 算出來 —— 卡片寬度不可以是寫死的 px");

  /* ⚠⚠⚠ 九顆各畫一次（2026-09-14 使用者要的）—— 而且**形狀是規則算出來的**，
     不是在那裡把 sn 塞進去；塞進去的話規則哪天壞了這一頁還是很正常。 */
  ok(/function rotaStats\(year\)/.test(html) && /var RT = rotaStats\(ROTA_YEAR\);/.test(html),
    "九顆的分布統計（rotaStats）不見了 —— 那幾個數字不可以寫死");
  ok(/id="pv-nine"/.test(html) && /id="pv-panel-nine"/.test(html) && /id="pv-panel-rota"/.test(html),
    "九顆那一節或它的兩塊面板不見了");
  ok(/nwCard\(a, true, k, SHAPES\.length\)/.test(html),
    "九張卡不是用 nwCard 照真的日期畫的");
  ok(/im\.getAttribute\("data-shape"\) !== SHAPES\[k\]/.test(html),
    "九張卡沒有逐張比對「畫出來的形狀 ＝ 規則算出來的那一顆」");
  /* ⚠ 規則本身要寫在頁面上（使用者 2026-09-14 指定「使用邏輯要寫一下」），
     而且兩則共用那一句不可以掉 —— 掉了廠商會以為要各寫一條。 */
  for (const t of ["(月 ＋ 日) % 9", "不是按星期幾", "預約成功那一則和查詢清單裡那一張是同一顆"])
    ok(html.includes(t), `頁面上那句「${t}」不見了 —— 九顆怎麼輪的規則要寫清楚`);
  /* ---- 九顆各畫一次・單張（預約成功通知，2026-09-14 使用者要的）--------
     ⚠⚠ 這一排和上面那一排**不是同一種卡**：268px、彩色浮水印、沒有藥丸、
       日期不指定斷行 —— 所以畫之前要換三個共用變數、畫完要換回去。
       換回去那一步掉了的話，底下 ②之三／②之四／②之五 會整批畫成
       「彩色浮水印 ＋ 沒有約診狀態 ＋ 不斷行」，**而畫面上一切正常**。 */
  ok(/id="pv-nine1"/.test(html) && /id="pv-panel-nine1"/.test(html),
    "單張那一排（預約成功通知的九顆）或它的面板不見了");
  ok(/var MEGA_W = 268;/.test(html),
    "MEGA_W 不見了或不是 268 —— 這一排要和第 ① 節那一張逐格一樣寬");
  ok(/dtm = "free"; wmink = false; stat = "";\s*\n\s*document\.getElementById\("pv-nine1"\)/.test(html),
    "單張那一排畫之前沒有把三個共用變數換成這一則定案的樣子（彩色浮水印、沒有藥丸、不斷行）");
  /* ⚠ 2026-09-14：①之二 那把尺插在這兩段中間了（它也吃「單張那一則」那一組變數），
     所以換回去的那一行現在排在 `spreadT = 0; fillSpreadPanel();` 後面。
     兩件一起守：那把尺畫完要還原成 0，而且三個共用變數要在它之後換回輪播那一組。 */
  ok(/getElementById\("pv-panel-nine1"\)[\s\S]{0,3000}dtm = "brk"; wmink = true; stat = "pill";/
      .test(html),
    "單張那一排畫完沒有把三個共用變數換回輪播那一組 —— 底下那一段量測會畫錯而且不報錯");
  ok(/'<div style="--cw:' \+ MEGA_W \+ 'px">[\s\S]{0,200}nwCard\(a, false, k, SHAPES\.length\)/.test(html),
    "單張那一排不是用 nwCard(…, false) 畫成 MEGA_W 寬 —— 那就不是「真的那張卡」了");
  ok(/var pairBad = SHAPES\.filter/.test(html)
     && /q\.getAttribute\("data-shape"\) !== m\.getAttribute\("data-shape"\)/.test(html),
    "兩排沒有逐格比對形狀 —— 「兩則同一顆」是那條規則最有價值的性質，要用量的");
  /* ⚠ 左緣有沒有被切到是這一排存在的理由（268 上九顆都收得下，micro 上那三顆收不下）——
     只印「看得到多少」的話，看不出兩張卡差在哪。 */
  ok(/var cutL = nine1Rows\.filter/.test(html) && /r\.left < -0\.5/.test(html),
    "單張那一排的面板沒有現場量「左緣有沒有被切掉」");
  /* ⚠⚠ 這一排的浮水印是**彩色**的，那是刻意的（淡墨是 ②之二 為了藥丸才換的）——
     改成淡墨不會讓任何一道尺寸守門翻臉，所以頁面上那句理由要在。 */
  ok(html.includes("這一則的浮水印是彩色的，不是淡墨 —— 那不是漏改成一致"),
    "頁面上那句「這一則的浮水印是彩色的不是淡墨」不見了 —— 改成一致不會被任何尺寸守門擋下來");

  /* ⚠⚠⚠ 三個共用的狀態畫完一定要還原，而且要排在**兩把尺後面**
     —— `render()` 會被呼叫不只一次（開頁、wm-sizes.json 回來、每次 resize），
     不還原的話**第二次進來時 ①② 那兩段會跟著畫成藥丸＋淡墨浮水印＋指定斷行**，
     連 shot-booked.png／shot-query.png 都會跟著變，**而畫面上一切正常**
     （2026-09-13 踩到，是出圖的位元組變了才發現）。
     ⚠ 不可以只用 includes 找 `dtm = "free"` —— 宣告變數那一行本身就寫著它。 */
  ok(/getElementById\("pv-panel-dtwarn"\)[\s\S]{0,3000}dtm = "free";\s*\n\s*wmink = false;\s*\n\s*stat = "";/
      .test(html),
    "畫完沒有把 dtm／wmink／stat 還原（或還原排在那一段量測前面）—— 第二次 render 會把 ①② 一起畫成第 ②之二 節那一版");

  /* ---- 浮水印要畫多寬：兩則各一張定案的表（2026-09-14 使用者逐顆挑的）----
     ⚠⚠⚠ 兩則的倍率**不一樣**，所以 nwCard 一定要把 isQuery 帶進去；
       只看形狀的話同一顆在兩則上會畫成同一個寬度，**而畫面完全正常**。 */
  ok(/var SPREAD1 = \{ r3c2: \.70, r3c3: \.35 \};/.test(html),
    "①之二 定案那張表（單張：r3c2 .70／r3c3 .35）不見了或值被改過");
  ok(/var WIDEK2 = \{ r1c3: \.75, r2c3: \.75, r3c3: \.66 \};/.test(html),
    "②之五 定案那張表（輪播：r1c3 .75／r2c3 .75／r3c3 .66）不見了或值被改過");
  ok(/function wmK\(sn, isQuery\)/.test(html)
     && /Math\.pow\(g \/ SIZES\[sn\]\.w, t\)/.test(html),
    "wmK() 或那條幾何平均的內插不見了 —— 單張那兩顆不可以寫死成兩個 px");
  ok(/function gmW\(\)/.test(html) && /s \+= Math\.log\(SIZES\[SHAPES\[i\]\]\.w\)/.test(html),
    "幾何平均不是從 wm-sizes.json 現算的 —— 寫死一個數字的話換過形狀就會靜靜地算錯");
  ok(/var ww = Math\.round\(sz\.w \* wmK\(sn, isQuery\)\);/.test(html),
    "nwCard 沒有把 isQuery 帶進 wmK —— 兩則會畫成同一個寬度而且不報錯");
  ok(/function wmW\(sn, isQuery\)/.test(html),
    "wmW() 不見了 —— 面板與規格表的 px 要現算，不可以另外打一份");
  /* ⚠⚠ 尺收掉了，但它們量出來的兩個量不可以跟著消失：
     **佔掉卡片多寬**（使用者講的那件事）與**多少墨**（收窄要付的代價）。
     ⚠ 要找**印出來的那一段**，不要用 includes 掃整份 —— 這一頁把「為什麼」寫在
       自己的註解裡，掃整份會掃到說明本身（這條線第八次撞到同一件事）。 */
  ok(/id=['"]pv-ninewide['"]/.test(html) && /id=['"]pv-nine1wide['"]/.test(html),
    "兩排那幾顆「被縮過的」現在有多重 —— 那兩塊量測不見了");
  ok(/\+ "，佔卡寬 <b>"/.test(html) && /\+ "，看得到的墨 "/.test(html),
    "面板少了「佔卡寬」或「看得到的墨」—— 那兩個量要一起看");
  ok(/function inkOn\(im, cb\)/.test(html) && /getImageData\(0, 0, nw, nh\)/.test(html),
    "墨不是現場讀像素量出來的 —— 用公式推一個數字出來，那一欄就只是在重複倍率");
  ok(/function inkRows\(hostSel, only, isQuery\)/.test(html)
     && /fillInkNotes\(\);/.test(html)
     && /if \(!im\.complete\) im\.addEventListener\("load", fillInkNotes/.test(html),
    "圖載完之後沒有重填那兩塊量測 —— 會一直印「—」");
  /* ⚠⚠⚠ 三顆**不再共用同一個倍率**（0.75／0.75／0.66），所以 2026-09-04 那條
     「彼此等墨」在輪播那一則不再成立 —— 那是挑定的取捨，頁面上要寫出來，
     不然日後有人會把它「訂正」回同一個數字。 */
  ok(html.includes("不再共用同一個倍率"),
    "頁面上沒有寫「三顆不再共用同一個倍率，所以彼此不再等墨」—— 那是挑定的取捨");
  ok(/WIDE3 = \["r1c3", "r2c3", "r3c3"\];/.test(html),
    "WIDE3 那份名單不見了");
  /* ⚠⚠ 名單不可以和資料分家：WIDE3 就是 wm-sizes.json 裡長寬比 > 2.5 的那幾顆。 */
  ok(/SIZES\[n\]\.ratio > 2\.5/.test(html) || /ratio > 2\.5/.test(html),
    "沒有任何一處把 WIDE3 對回 wm-sizes.json 的長寬比");

  /* ---- 第 ③ 節：給廠商工程師的規格（2026-09-14 使用者要的）------------
     ⚠⚠⚠ 整張表要**算出來**，不可以在頁面上再打一份 px —— 打了之後倍率一改，
       交出去的規格會靜靜地開始說謊。 */
  ok(/id="pv-spec"/.test(html) && /function wmSpec\(\)/.test(html) && /\n    wmSpec\(\);/.test(html),
    "第 ③ 節那份規格（#pv-spec／wmSpec()／render 裡呼叫它）不見了");
  /* ⚠ 要指名**那一段**：wmW() 在別的面板裡也出現，掃整份的話把這裡改成 z.w 照樣會過。 */
  ok(/var rows = ALL9\.map\(function \(n\) \{[\s\S]{0,300}wmW\(n, false\)[\s\S]{0,80}wmW\(n, true\)/
      .test(html),
    "規格表那幾格不是用 wmW() 現算的 —— 寫死的數字會跟頁面分家");
  for (const t of ["一、挑哪一顆", "二、九顆：色碼、長寬比、兩則各要畫多寬",
                   "三、擺在對話框裡的哪裡", "四、卡片本身"])
    ok(html.includes(t), `規格少了「${t}」那一段`);
  /* ⚠ 四件缺一不可：規則、色碼、位置（含 Flex 不吃負值那一句）、bubble 的階。 */
  for (const t of ["形狀 ＝ 順序[(月 ＋ 日) % 9]",
                   "不吃負值",
                   "同一條輪播必須整組一起換",
                   "aspectMode",
                   "一定要 <code>wrap: true</code>、不要 <code>maxLines</code>"])
    ok(html.includes(t), `規格少了「${t}」那一句 —— 少了它廠商會照舊做`);
  ok(html.includes("第一個子元件不可以是 absolute"),
    "規格少了「一個 box 的第一個子元件不可以是 absolute」—— 照寫會整張畫不出來");

  /* ⚠⚠⚠ 開頁那段 fetch 的 catch 不可以把 render() 的例外一起吞掉
     （2026-09-13 踩過：畫面停在「讀不到 wm-sizes.json」、不報錯）。 */
  ok(/\.catch\(function \(\) \{ return null; \}\)\s*\n\s*\.then\(function \(j\) \{/.test(html),
    "wm-sizes.json 那段的 catch 又包住 render() 了 —— render 丟例外會被吞掉，畫面停在退回值那一版");
}


/* 樣板本身要用變數，不要不小心寫死某一顆 */
const wmEl = BOOKED.body.contents[1];
ok(/\{\{watermark\}\}/.test(wmEl.url), "浮水印的網址要用 {{watermark}} 變數（哪一顆由系統算）");
ok(/-12\.png$/.test(wmEl.url), "浮水印定案用濃度 12");
ok(wmEl.size === "{{watermark_size_single}}" && wmEl.aspectRatio === "{{watermark_ratio}}",
  "單張那一則的浮水印 size 要吃 {{watermark_size_single}}（兩則的寬度不一樣）");
{
  const q = QUERY.body.contents[1];
  ok(q && q.size === "{{watermark_size_carousel}}" && q.aspectRatio === "{{watermark_ratio}}",
    "輪播那一則的浮水印 size 要吃 {{watermark_size_carousel}}（兩則的寬度不一樣）");
  ok(!/\{\{watermark_size\}\}/.test(JSON.stringify(card)),
    "JSON 裡還留著舊的 {{watermark_size}} —— 那個佔位符已經拆成兩個");
}

/* ---- ⑦ 紅線 --------------------------------------------------------- */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "馬上回", "找得到人", "有專人"];
const words = [flat(bk[0]), ...FINE, "{{date}}", "{{patient}}"].join("")
  .replace(/沒有專人/g, "＿");
LIE.forEach((w) => ok(words.indexOf(w) < 0, `卡上出現「${w}」—— 這個帳號沒有專人即時回覆`));
ok(!/[☀-➿]|[\ud83c-\ud83e][\udc00-\udfff]/.test(words), "卡上有 emoji");

/* ---- ⑧ 規格頁：切換條要拿掉、兩則都畫得出來、浮水印九顆都讀得到 ------ */
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (f.endsWith("/")) f = path.join(f, "index.html");
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = "http://127.0.0.1:" + server.address().port + "/preview/line-booked/";

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForFunction(() =>
  document.querySelectorAll("#pv-wmref figure").length === 9, { timeout: 8000 })
  .catch(() => bad.push("規格頁畫不出九顆浮水印的對照表（wm-sizes.json 讀不到？）"));
const got = await page.evaluate(() => {
  const T = (el) => (el ? (el.innerText || "").replace(/\s+/g, " ").trim() : null);
  return {
    bar: !!document.querySelector(".pv-bar"),
    booked: T(document.querySelector("#pv-slot .pv-hc")),
    q1: T(document.querySelector("#pv-slot2 .pv-hc")),
    cw: +document.querySelector("#pv-slot .pv-hc").getBoundingClientRect().width.toFixed(1),
    qw: +document.querySelector("#pv-slot2 .pv-hc").getBoundingClientRect().width.toFixed(1),
    shapes: [...document.querySelectorAll("#pv-slot2 .wm")].map((e) => e.dataset.shape),
    bkShape: (document.querySelector("#pv-slot .wm") || {}).dataset?.shape,
    dtFs: getComputedStyle(document.querySelector("#pv-slot .dt")).fontSize,
    whoFs: getComputedStyle(document.querySelector("#pv-slot2 .who")).fontSize,
    tmpl: document.body.innerText.indexOf("{{") >= 0,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});
await browser.close();
server.close();

ok(errs.length === 0, "規格頁有 JS 錯誤：" + errs.join(" / "));
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");
ok(!got.tmpl, "規格頁上直接印出了 {{…}} —— 那是給廠商的變數，頁面上要寫看得懂的示範值");
ok(got.cw === 268, `預約成功那張卡量到 ${got.cw}px，該是 268`);
/* ✅ 2026-09-14 使用者定案：輪播改用 micro（162px）—— 廠商現在跑的是 deca（207）。 */
ok(got.qw === 162, `輪播那張卡量到 ${got.qw}px，該是 162（micro）`);
ok(got.overflow === 0, `規格頁有 ${got.overflow}px 水平捲動`);
ok(got.dtFs === "19px", `規格頁的日期是 ${got.dtFs}，定案是 19px`);
ok(got.whoFs === "16px", `規格頁的姓名是 ${got.whoFs}，定案是 16px`);
FINE.forEach((t, i) =>
  ok(got.booked && got.booked.indexOf(t) >= 0, `規格頁上找不到第 ${i + 1} 條小字`));
ok(got.booked && got.booked.indexOf("約好囉") >= 0, "規格頁上找不到「約好囉」");
/* ⚠⚠ 這一條是「按日期算」那條規則的實證：同一筆約診（8/25）在兩則上要是同一顆。
   隨機或按位置的話這裡就會不一樣 —— 規則壞掉的時候只有這一項看得出來。 */
ok(got.bkShape && got.bkShape === got.shapes[1],
  `同一筆約診在兩則上的浮水印不一樣（預約成功 ${got.bkShape}、查詢 ${got.shapes[1]}）`);
ok(new Set(got.shapes).size === got.shapes.length,
  `輪播四張裡有重複的浮水印：${got.shapes.join("、")}`);

if (bad.length) {
  console.error("✗ " + bad.length + " 項對不上：");
  bad.forEach((b) => console.error("  ・" + b));
  process.exit(1);
}
console.log("✓ 預約成功 ＋ 約診紀錄查詢：JSON ↔ 規格頁 ↔ wm-sizes.json ↔ 36 張 PNG 全部對得上");
console.log("  卡片 268 / 162px（micro）　日期 lg 19　姓名 md 16　小字 xs 13　浮水印九顆・濃度 12");
