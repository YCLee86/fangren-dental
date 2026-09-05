#!/usr/bin/env node
/* 守門：看診後的評價邀約，Flex JSON ↔ 規格頁逐項比對。
 *   node drafts/channels/check-review.mjs
 *
 * 同 check-welcome／bind-done／remind／cancel 那條道理：
 * **規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 * 這一支比對八件：
 *   ① 五段文字逐字（開場第二行／關心那一段／上面那一段＋標籤／下面那一段＋標籤）
 *   ② 字級（LINE Flex 的固定 px 表：md 16／sm 14）
 *   ③ 顏色（主鈕的綠、線框鈕的深階、兩段主文的墨、卡片底色）
 *   ④ 頭圖與兩顆 logo ＋ 角形：檔案在不在、真長寬比對不對得上 aspectRatio、寬度、≤1024
 *   ⑤ 兩顆按鈕的順序（公開那一顆在上，＝使用者寫的排法）
 *   ⑥ 〔病人姓名〕在 JSON 裡一定要是變數、規格頁上一定不能印出 {{…}}
 *   ⑦ 紅線：沒有專人那一類的承諾 0 處、emoji 0 個、
 *      ⚠⚠⚠ **不可以拿好處換評價**（折價／抽獎／送洗牙 —— Google 明文禁止，
 *        醫療機構在台灣還多一層招徠的疑慮）
 *   ⑧ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠⚠ **這一支不會擋掉那個法遵問題**（兩塊合起來 ＝「願意的人去公開、不開心的人來私下」）——
 *   那是使用者逐字寫的、刻意照寫的東西，規格頁的面板有一列在標紅。
 *   守門的工作是「JSON 和頁面說的是同一件事」，不是替他改字。
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-review", "index.html");
const JSONF = path.join(HERE, "review-card.json");

const doc = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const C = doc.body.contents;
const [HI, HI2, LEAD, ASK1, BTN, ASK2, NOB] = C;

function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  /* 頭圖是 JPEG —— 掃檔頭（同 tools/build.mjs 的 jpegSize()，這一站沒有 npm 依賴） */
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("讀不出尺寸：" + file);
}
/* JSON 裡的圖都指向 https://fangren.net/assets/line/<檔名>；本機那幾張散在三個
   資料夾 —— 角形與翻過來的標誌是提醒卡那一輪產的，**刻意不複製第二份**過來。 */
function localOf(url) {
  const name = url.split("/").pop();
  for (const d of ["line-review", "line-remind", "line-welcome"]) {
    const p = path.join(ROOT, "preview", d, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/* ── 頁面那一側 ─────────────────────────────────────────────── */
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
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + PAGE);
await page.waitForSelector(".pv-new .ask");
if (errs.length) bad.push("規格頁有 JS 錯誤：" + errs.join(" / "));

const got = await page.evaluate(() => {
  const one = (s) => document.querySelector(".pv-new " + s);
  const txt = (s) => { const e = one(s); return e ? e.textContent : null; };
  const fsz = (s) => { const e = one(s); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const bg  = (s) => { const e = one(s); return e ? getComputedStyle(e).backgroundColor : null; };
  const col = (s) => { const e = one(s); return e ? getComputedStyle(e).color : null; };
  const wid = (s) => { const e = one(s); return e ? +e.getBoundingClientRect().width.toFixed(1) : null; };
  const src = (s) => { const e = one(s); return e ? e.getAttribute("src").split("/").pop() : null; };
  return {
    hi: txt(".hi"), lead: txt(".lead"), ask1: txt(".ask"), ask2: txt(".ask2"),
    lab1: txt(".btn span"), lab2: txt(".nob span"),
    size: { hi: fsz(".hi"), lead: fsz(".lead"), ask1: fsz(".ask"), ask2: fsz(".ask2"),
            lab1: fsz(".btn span"), lab2: fsz(".nob span") },
    color: { card: bg(""), btnBg: bg(".btn"), btnFg: col(".btn span"),
             nobFg: col(".nob span"), ask1: col(".ask"), ask2: col(".ask2") },
    img: { hero: src(".hero"), btn: src(".btn img"), chev: src(".btn .chev"), nob: src(".nob img") },
    w: { btn: wid(".btn img"), chev: wid(".btn .chev"), nob: wid(".nob img") },
    /* 兩顆按鈕在 DOM 裡的先後 ＝ 畫面上的先後 */
    order: [...document.querySelectorAll(".pv-new .btn, .pv-new .nob")].map((e) => e.className),
    bar: !!document.querySelector(".pv-bar"),
    card: document.querySelector(".pv-new").textContent,
    all: document.body.textContent
  };
});
await browser.close();

/* ── ① 文字逐字 ──────────────────────────────────────────── */
/* ⚠ 開場那一行在 JSON 裡是 spans（「哈囉　」＋ 加粗的變數），在頁面上是一個
     `.hi`（兩行、pre-line）—— 所以拆開比：第一行只比得了開頭，第二行逐字。 */
const hiLines = (got.hi || "").split("\n");
ok(hiLines[0].startsWith(HI.contents[0].text),
  `開場第一行對不上：JSON「${HI.contents[0].text}…」、頁面「${hiLines[0]}」`);
ok(/[〔【].+[〕】]/.test(hiLines[0]),
  "規格頁的開場沒有把姓名寫成佔位符 —— 那是系統填的欄位");
const pair = [
  [HI2.text, hiLines[1], "開場第二行"],
  [LEAD.text, got.lead, "關心那一段"],
  [ASK1.text, got.ask1, "上面那一段"],
  [BTN.contents[1].text, got.lab1, "綠底那顆的字"],
  [ASK2.text, got.ask2, "下面那一段"],
  [NOB.contents[1].text, got.lab2, "線框那顆的字"],
];
for (const [a, b, name] of pair)
  ok(a === b, `${name}對不上：\n    JSON「${a}」\n    頁面「${b}」`);
/* 兩顆按鈕的 label 和它自己的 action.label 也要一致（那一句會變成病人說出去的話） */
for (const [node, name] of [[BTN, "綠底"], [NOB, "線框"]])
  ok(node.action.label === node.contents[1].text,
    `${name}那顆的 action.label 和按鈕上的字不一樣（${node.action.label} vs ${node.contents[1].text}）`);

/* ── ⑥ 姓名是變數 ───────────────────────────────────────── */
ok(/^\{\{\w+\}\}$/.test(HI.contents[1].text),
  `JSON 裡的姓名不是變數（現在是「${HI.contents[1].text}」）—— 那是系統填的`);
ok(HI.contents[1].weight === "bold",
  "姓名沒有加粗 —— 一個帳號收得到好幾個家人的訊息，「這一次是誰」要一眼看到");
/* ⚠ 只掃**卡片**不掃整頁 —— 規格頁的說明文字本來就要寫出欄位叫什麼名字
   （「JSON 裡寫 {{patient}}」），掃整頁會把那一句當成錯。 */
ok(!/\{\{/.test(got.card), "卡片上直接印出了 {{…}} —— 要換成看得懂的示範值");

/* ── ② 字級 ─────────────────────────────────────────────── */
const sz = [
  [HI.size, got.size.hi, "開場"],
  [LEAD.size, got.size.lead, "關心那一段"],
  [ASK1.size, got.size.ask1, "上面那一段"],
  [BTN.contents[1].size, got.size.lab1, "綠底那顆的字"],
  [ASK2.size, got.size.ask2, "下面那一段"],
  [NOB.contents[1].size, got.size.lab2, "線框那顆的字"],
];
for (const [k, px, name] of sz)
  ok(PX[k] === px, `${name}的字級對不上：JSON ${k}＝${PX[k]}px、頁面 ${px}px`);
ok(HI2.size === HI.size, "開場那兩行在 JSON 裡字級不一樣 —— 它們是同一句話拆成兩行");

/* ── ③ 顏色 ─────────────────────────────────────────────── */
const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3)
  .map((x) => (+x).toString(16).padStart(2, "0")).join("").toUpperCase();
const cl = [
  [doc.body.backgroundColor, got.color.card, "卡片底色"],
  [BTN.backgroundColor, got.color.btnBg, "綠底那顆的底"],
  [BTN.contents[1].color, got.color.btnFg, "綠底那顆的字"],
  [NOB.contents[1].color, got.color.nobFg, "線框那顆的字"],
  [ASK1.color, got.color.ask1, "上面那一段"],
  [ASK2.color, got.color.ask2, "下面那一段"],
];
for (const [a, b, name] of cl)
  ok(a.toUpperCase() === hex(b), `${name}對不上：JSON ${a}、頁面 ${hex(b)}`);
/* ⚠ 線框那顆的框線與它的字是**同一支深階**（套色給填實的塊、深階給白底上的字，
   PALETTE.md 第六之十一節）—— 兩者不一致就是有人只改了一半。 */
ok(NOB.borderColor.toUpperCase() === NOB.contents[1].color.toUpperCase(),
  `線框那顆的框線（${NOB.borderColor}）和它的字（${NOB.contents[1].color}）不是同一支色`);

/* ── ④ 頭圖與三張小圖 ───────────────────────────────────── */
const pics = [
  [doc.hero, got.img.hero, null, "頭圖"],
  [BTN.contents[0], got.img.btn, got.w.btn, "綠底那顆的 logo"],
  [BTN.contents[2], got.img.chev, got.w.chev, "角形"],
  [NOB.contents[0], got.img.nob, got.w.nob, "線框那顆的 logo"],
];
for (const [node, shown, w, name] of pics) {
  const file = localOf(node.url);
  ok(file, `${name} 找不到本機檔案：${node.url}`);
  if (!file) continue;
  ok(path.basename(file) === shown,
    `${name}和規格頁引用的不是同一個檔（JSON ${path.basename(file)}／頁面 ${shown}）`);
  const { w: iw, h: ih } = imgSize(file);
  if (node.aspectRatio) {
    const real = iw / ih;
    const want = node.aspectRatio.split(":").map(Number).reduce((a, b) => a / b);
    ok(Math.abs(real - want) < 0.01,
      `${name}的 aspectRatio 對不上真圖：寫 ${node.aspectRatio}、實際 ${real.toFixed(3)}:1`
      + "（⚠ 寫錯不報錯也不變形，只會靜靜地縮小、四周留白）");
  }
  if (w !== null)
    ok(Math.abs(parseFloat(node.size) - w) < 0.6,
      `${name}的寬度對不上：JSON ${node.size}、頁面 ${w}px`);
  ok(iw <= 1024 && ih <= 1024, `${name}超過 LINE 的 1024×1024（${iw}×${ih}）`);
}
/* ⚠⚠ 檔名裡的顏色不等於形狀（取消卡那一輪踩過）：線框那顆要的是**翻過來的**
   shape-r2c3（mark-nogo.png），不是招呼卡那顆沒翻的 mark-green.png。 */
ok(got.img.nob === "mark-nogo.png",
  `線框那顆的 logo 是「${got.img.nob}」—— 使用者 2026-09-05 指定「要反過來」`
  + "＝ mark-nogo.png（同一顆形狀上下翻，翻轉烘在 PNG 裡）。");

/* ── ⑤ 順序 ─────────────────────────────────────────────── */
ok(/btn/.test(got.order[0] || ""),
  "第一顆按鈕不是公開那一顆 —— 那是使用者寫的排法（一句話 ＋ 一顆按鈕，兩塊）");

/* ── ⑦ 紅線 ─────────────────────────────────────────────── */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "馬上回", "找得到人", "有專人"];
const scan = got.card.replace(/沒有專人/g, "＿").replace(/無專人/g, "＿");
for (const w of LIE)
  ok(scan.indexOf(w) < 0,
    `卡上出現「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節）`);
const EMOJI = /[☀-➿⬀-⯿]|[\ud83c-\ud83e][\udc00-\udfff]/g;
const emo = got.card.match(EMOJI) || [];
ok(emo.length === 0, `卡上有 ${emo.length} 個 emoji（${emo.join(" ")}）—— 站上全站 0 個`);
/* ⚠⚠⚠ 這一則獨有的一條：不可以拿好處換評價。 */
const BAIT = ["抽獎", "折價", "優惠", "贈品", "好禮", "送你", "回饋金", "洗牙一次"];
/* ⚠ 要先把 `_說明` 剝掉 —— 註解裡本來就寫滿了 ⚠，而 ⚠ 落在 emoji 那個字碼區間裡。 */
const strip = (o) => Array.isArray(o) ? o.map(strip)
  : (o && typeof o === "object")
    ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")).map(([k, v]) => [k, strip(v)]))
    : o;
const jsonTxt = JSON.stringify(strip(doc));
for (const w of BAIT) {
  ok(got.card.indexOf(w) < 0, `卡上出現「${w}」—— 不可以拿好處換評價（Google 明文禁止）`);
  ok(jsonTxt.indexOf(w) < 0, `Flex JSON 裡出現「${w}」—— 不可以拿好處換評價`);
}
ok(!(jsonTxt.match(EMOJI) || []).length, "Flex JSON 裡有 emoji");

/* ── ⑧ 定案了就不可以還有切換條 ─────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");

/* ── 報告 ───────────────────────────────────────────────── */
if (bad.length) {
  console.error("✗ 評價邀約：JSON 和規格頁對不上 " + bad.length + " 項\n");
  bad.forEach((b, i) => console.error("  " + (i + 1) + ". " + b));
  process.exit(1);
}
console.log("✓ 評價邀約：JSON ↔ 規格頁逐項相同");
console.log("  文字 6 段逐字（含兩顆按鈕的 action.label）、姓名是變數且加粗");
console.log("  字級 6 處（md 16／sm 14）、顏色 6 處");
console.log("  頭圖與三張小圖的檔案・長寬比・寬度・≤1024、線框那顆是翻過來的 nogo");
console.log("  順序（公開那一顆在上）、紅線 0 項、emoji 0 個、拿好處換評價 0 處、切換條已拿掉");
