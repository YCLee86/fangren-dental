#!/usr/bin/env node
/* 守門：看診前 48 小時提醒的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-remind.mjs
 *
 * 同 check-welcome.mjs／check-bind-done.mjs 那條道理：
 * **規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 * 這一支比對七件：
 *   ① 每一段文字逐字（含開場那個加粗的姓名變數）
 *   ② 字級（LINE Flex 的固定 px 表）
 *   ③ 顏色（主鈕的綠、兩顆線框鈕的深階、須知那塊的紙色）
 *   ④ 三顆按鈕：logo 的檔案在不在、真實長寬比對不對得上 aspectRatio、寬度
 *   ⑤ 頭圖：檔案在不在、真實長寬比、**不超過 LINE 的 1024×1024**
 *   ⑥ 「那一句離按鈕」定案的比例：上 17 / 下 5（量的是墨到墨，不是 margin）
 *   ⑦ 紅線：不可以出現「有問題隨時問」那一類的承諾；emoji 0 個
 *   ⑧ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠⚠ JSON 的 margin **不會**和 CSS 逐字相同（規格頁量墨到墨、行高 1.7 藏了
 *   4.8px 的半行距），所以這一支**不比對 margin 的數字**，比對的是
 *   「畫出來的上下比例」——那才是使用者挑的那一格。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-remind");
const PAGE = path.join(DIR, "index.html");
const JSONF = path.join(HERE, "reminder-card.json");

const card = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const kids = card.body.contents;
const flat = (t) => (t.text != null ? t.text : t.contents.map((c) => c.text).join(""));

/* PNG 的 IHDR ＋ JPEG 的 SOF：不裝任何套件就讀得到真實尺寸 */
function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("讀不出尺寸：" + file);
}
/* JSON 裡的圖都指向 https://fangren.net/assets/line/<檔名>；本機的那一份
   ⚠ 有兩個落點：這一頁自己產的在 preview/line-remind/，
     招呼卡產的 mark-white.png 在 preview/line-welcome/（刻意不複製第二份）。 */
function localOf(url) {
  const name = url.split("/").pop();
  for (const d of [DIR, path.join(ROOT, "preview", "line-welcome")]) {
    const p = path.join(d, name);
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
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + PAGE);
await page.waitForSelector(".pv-new .dt");
if (errs.length) bad.push("規格頁有 JS 錯誤：" + errs.join(" / "));

const got = await page.evaluate(() => {
  const q = (s) => document.querySelector(".pv-new " + s);
  const txt = (s) => { const e = q(s); return e ? e.textContent : null; };
  const fs_ = (s) => { const e = q(s); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const bg = (s) => { const e = q(s); return e ? getComputedStyle(e).backgroundColor : null; };
  const col = (s) => { const e = q(s); return e ? getComputedStyle(e).color : null; };
  const wid = (s) => { const e = q(s); return e ? +e.getBoundingClientRect().width.toFixed(1) : null; };
  const src = (s) => { const e = q(s); return e ? e.getAttribute("src").split("/").pop() : null; };
  /* 墨到墨：一句話上下各離多遠 */
  const inkGap = (above, line, below) => {
    const a = q(above), el = q(line), b = q(below);
    if (!a || !el || !b) return null;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), r = document.createRange();
    let t, top = 1e9, bot = -1e9;
    while ((t = w.nextNode()))
      for (let i = 0; i < t.length; i++) {
        r.setStart(t, i); r.setEnd(t, i + 1);
        const c = r.getBoundingClientRect();
        if (c.height) { top = Math.min(top, c.top); bot = Math.max(bot, c.bottom); }
      }
    return { above: +(top - a.getBoundingClientRect().bottom).toFixed(1),
             below: +(b.getBoundingClientRect().top - bot).toFixed(1) };
  };
  return {
    hi: txt(".hi"), hiBold: (q(".hi b") || {}).textContent || null,
    lead: txt(".lead"), dt: txt(".dt"), know: txt(".box.know"),
    cta: txt(".cta"), btn: (q(".btn span") || {}).textContent || null,
    nob: (q(".nob span") || {}).textContent || null,
    telnote: txt(".telnote"), tel: (q(".tel span") || {}).textContent || null,
    size: { hi: fs_(".hi"), lead: fs_(".lead"), dt: fs_(".dt"), know: fs_(".box.know"),
            cta: fs_(".cta"), btn: fs_(".btn span"), nob: fs_(".nob span"),
            telnote: fs_(".telnote"), tel: fs_(".tel span") },
    color: { btnBg: bg(".btn"), btnFg: col(".btn span"), nobFg: col(".nob span"),
             telFg: col(".tel span"), knowBg: bg(".box.know") },
    img: { hero: src(".hero"), btn: src(".btn img"), nogo: src(".nob img"), tel: src(".tel img"),
           chev: src(".btn .chev") },
    w: { btn: wid(".btn img"), nogo: wid(".nob img"), tel: wid(".tel img"), chev: wid(".btn .chev") },
    gapCta: inkGap(".box.know", ".cta", ".btn"),
    gapTel: inkGap(".nob", ".telnote", ".tel"),
    bar: !!document.querySelector(".pv-bar"),
    body: document.querySelector(".pv-new").textContent
  };
});
await browser.close();

/* ── ① 文字逐字 ──────────────────────────────────────────── */
const pair = [
  [kids[1].text, got.lead, "提醒那一句"],
  [kids[3].contents[0].text, got.know, "就診須知"],
  [kids[4].text, got.cta, "叫他點的那一句"],
  [kids[5].contents[1].text, got.btn, "主鈕的字"],
  [kids[6].contents[1].text, got.nob, "取消鈕的字"],
  [kids[7].text, got.telnote, "電話那一句"],
  [kids[8].contents[1].text, got.tel, "電話號碼"],
];
for (const [a, b, nm] of pair)
  ok(a === b, `${nm}對不上：\n    JSON「${a}」\n    頁面「${b}」`);
/* ⚠⚠ 姓名與日期是**系統填的欄位**，所以 JSON 寫 {{patient}}／{{date}}、
   規格頁寫看得懂的示範值（〔病人姓名〕、7月6日…）—— 這兩處**本來就不會逐字相同**。
   要比對的是「固定的那一段一樣」＋「兩邊都是變數的位置」，不是字面。 */
ok(kids[0].contents[0].text === "哈囉　" && got.hi.startsWith("哈囉　"),
  `開場固定的那一段對不上：JSON「${kids[0].contents[0].text}」、頁面「${got.hi.slice(0, 4)}」`);
ok(kids[0].contents[1].weight === "bold" && got.hiBold,
  "開場那個姓名要加粗（JSON 用 span weight:bold，頁面用 <b>）——"
  + "一個帳號收得到好幾個家人的提醒，「這一次是誰」要一眼看到");
ok(/^\{\{\w+\}\}$/.test(kids[0].contents[1].text),
  `JSON 的姓名要寫成系統欄位（現在是「${kids[0].contents[1].text}」），不要寫死`);
ok(/^\{\{\w+\}\}$/.test(kids[2].text),
  `JSON 的日期要寫成系統欄位（現在是「${kids[2].text}」），不要寫死`);
ok(!/\{\{/.test(got.hi + got.dt),
  "規格頁上不要直接印 {{…}} —— 那是給廠商看的欄位名，頁面要給看得懂的示範值");

/* ── ② 字級 ─────────────────────────────────────────────── */
const sz = [
  [kids[0].size, got.size.hi, "開場"], [kids[1].size, got.size.lead, "提醒那一句"],
  [kids[2].size, got.size.dt, "日期"], [kids[3].contents[0].size, got.size.know, "就診須知"],
  [kids[4].size, got.size.cta, "叫他點的那一句"],
  [kids[5].contents[1].size, got.size.btn, "主鈕"],
  [kids[6].contents[1].size, got.size.nob, "取消鈕"],
  [kids[7].size, got.size.telnote, "電話那一句"],
  [kids[8].contents[1].size, got.size.tel, "電話號碼"],
];
for (const [k, px, nm] of sz)
  ok(PX[k] === px, `${nm}的字級對不上：JSON ${k}＝${PX[k]}px、頁面 ${px}px`
    + "（⚠ Flex 的字級是固定 px，規格頁一定要用同一張表畫）");

/* ── ③ 顏色 ─────────────────────────────────────────────── */
const rgb = (h) => { const n = parseInt(h.slice(1), 16);
  return `rgb(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255})`; };
ok(got.color.btnBg === rgb(kids[5].backgroundColor), `主鈕的底色對不上（JSON ${kids[5].backgroundColor}、頁面 ${got.color.btnBg}）`);
ok(got.color.btnFg === rgb(kids[5].contents[1].color), "主鈕的字色對不上");
ok(got.color.nobFg === rgb(kids[6].contents[1].color), "取消鈕的字色對不上");
ok(got.color.telFg === rgb(kids[8].contents[1].color), "電話鈕的字色對不上");
ok(got.color.knowBg === rgb(kids[3].backgroundColor), "就診須知那塊的底色對不上");

/* ── ④⑤ 圖檔：在不在、長寬比、寬度、上限 ─────────────────── */
const imgs = [
  [card.hero, got.img.hero, null, "頭圖"],
  [kids[5].contents[0], got.img.btn, got.w.btn, "主鈕的標誌"],
  [kids[5].contents[2], got.img.chev, got.w.chev, "主鈕的角形"],
  [kids[6].contents[0], got.img.nogo, got.w.nogo, "取消鈕的標誌"],
  [kids[8].contents[0], got.img.tel, got.w.tel, "電話鈕的話筒"],
];
for (const [node, onPage, wOnPage, nm] of imgs) {
  const name = node.url.split("/").pop();
  ok(name === onPage, `${nm}：JSON 指 ${name}、頁面用 ${onPage}`);
  const local = localOf(node.url);
  ok(local, `${nm} 的檔案不在（${name}）`);
  if (!local) continue;
  const { w, h } = imgSize(local);
  ok(w <= 1024 && h <= 1024, `${nm} ${w}×${h} 超過 LINE 對 Flex 的 image 上限 1024×1024`);
  const want = parseFloat(node.aspectRatio);
  ok(Math.abs(w / h - want) < 0.01,
    `${nm} 的 aspectRatio 對不上：JSON 寫 ${node.aspectRatio}、檔案是 ${(w / h).toFixed(4)}`
    + "（⚠ 寫錯不報錯也不變形，aspectMode:fit 只會讓圖靜靜地縮小、四周留白）");
  if (wOnPage != null)
    ok(Math.abs(parseFloat(node.size) - wOnPage) <= 0.5,
      `${nm} 的寬度對不上：JSON ${node.size}、頁面 ${wOnPage}px`);
}

/* ── ⑥ 那一句離按鈕：定案的上 17 / 下 5 ────────────────────── */
for (const [g, nm] of [[got.gapCta, "叫他點的那一句"], [got.gapTel, "電話那一句"]]) {
  ok(g, `${nm}：量不到上下的墨距`);
  if (!g) continue;
  ok(Math.abs(g.above - 17) <= 0.6, `${nm}上面的空隙是 ${g.above}，定案是 17.0（不要縮，它是兩段的分界）`);
  ok(Math.abs(g.below - 5) <= 0.6, `${nm}下面的空隙是 ${g.below}，定案是 5.0（使用者 2026-09-04 挑的那一格）`);
}
ok(Math.abs(got.gapCta.below - got.gapTel.below) < 0.2 &&
   Math.abs(got.gapCta.above - got.gapTel.above) < 0.2,
  "兩組「一句話 ＋ 一顆按鈕」的間隔不一致 —— 讀者會以為那是兩種不同的關係");

/* ── ⑦ 紅線 ─────────────────────────────────────────────── */
const RED = ["隨時問", "有問題問", "問到", "即時回", "馬上回", "專人回覆", "找得到人", "隨時聯絡"];
const all = kids.map(flat).join("") + got.body;
for (const w of RED)
  ok(!all.includes(w), `出現「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節）`);
const EMOJI = /[☀-➿⬀-⯿]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g;
const em = (kids.map(flat).join("").match(EMOJI) || []);
ok(em.length === 0, `Flex 的文字裡有 ${em.length} 個 emoji（${em.join("")}）—— 站上全站 0 個`);

/* ── ⑧ 定案之後不留切換條 ──────────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");

if (bad.length) {
  console.error("✗ 對不上 " + bad.length + " 項：\n  ・" + bad.join("\n  ・"));
  process.exit(1);
}
console.log("✅ JSON 與規格頁逐項相同（9 段文字＋姓名加粗、字級、顏色、"
  + "5 張圖的檔案／上限／長寬比／寬度、兩組 17.0-5.0 的墨距、紅線、切換條已拿掉）");
