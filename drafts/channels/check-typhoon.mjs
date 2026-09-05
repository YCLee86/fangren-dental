#!/usr/bin/env node
/* 守門：颱風／臨時休診那一則的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-typhoon.mjs
 *
 * 同 check-welcome／check-bind-done／check-remind／check-cancel／check-review／
 * check-booked 那條道理：**規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 *
 * 這一支比對九件：
 *   ① 三段文字逐字（JSON ↔ 規格頁那一塊「要貼進去的字」）
 *   ② 同一份字**畫在卡片上**也要逐字（把示範值填進去之後）
 *   ③ 四個可填欄位：JSON 一定要是 {{…}}、〔…〕在頁面上要正好四處、
 *      而且 {{date}} 出現兩次（那是這一則最容易漏掉的一格）
 *   ④ 字級（LINE Flex 的固定 px 表：sm ＝ 14px）
 *   ⑤ 顏色（卡底 #F4F4F5、內文 #5C5F57）
 *   ⑥ 三段之間的 margin（JSON 8px ↔ 頁面 CSS 的 margin-top）
 *   ⑦ 頭圖：檔案在不在、真實長寬比對不對得上 aspectRatio、≤1024、
 *      **而且聊天室那張照片和卡片的頭圖是同一個檔**
 *   ⑧ 紅線（沒有專人即時回覆）與 emoji
 *   ⑨ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠⚠ **不比對「有沒有短標題」** —— 定案這一份刻意沒有短標題（三大段、第一段
 *   一百多個字），卡片因此整份當內文排。那是已知的取捨，不是缺陷。
 * ⚠⚠ **口氣那幾個詞（民眾／切勿／敬請見諒／另行公告）不在紅線表裡** ——
 *   紅線是「寫了就是說謊」，口氣是「我覺得可以更好」，而使用者已經決定用自己的字。
 * ⚠⚠ 頭圖是 **JPEG 不是 PNG**，所以尺寸要自己掃 SOF 標記（不能照抄別支的 PNG 讀法）。
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-typhoon");
const PAGE = path.join(DIR, "index.html");
const JSONF = path.join(HERE, "typhoon-card.json");

const doc = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const P = doc.body.contents;

/* JPEG 的尺寸：掃 SOF0~SOF15（跳過 SOF4／SOF8／SOF12，那三個不是影格標頭）。 */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error("不是 JPEG：" + file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("找不到 SOF：" + file);
}

/* ── 示範值：從規格頁的原始碼讀回來 ────────────────────────────
   ⚠ 那個 DEMO 表在 IIFE 裡面，外面抓不到，所以直接掃原始碼 ——
     這同時也是一道檢查：示範值改了、這裡就會跟著對不上。 */
const src = fs.readFileSync(PAGE, "utf8");
const DEMO = {};
{
  const blk = src.match(/var DEMO = \{([\s\S]*?)\};/);
  if (!blk) bad.push("規格頁裡找不到 DEMO 那張示範值表");
  else for (const m of blk[1].matchAll(/"(〔[^〕]+〕)":\s*"([^"]*)"/g)) DEMO[m[1]] = m[2];
}
/* JSON 的 {{…}} ↔ 規格頁的〔…〕，一一對應。 */
const SLOT = { "{{typhoon}}": "〔颱風名〕", "{{date}}": "〔日期〕", "{{weekday}}": "〔星期〕" };
const toBracket = (s) => Object.entries(SLOT).reduce((a, [k, v]) => a.split(k).join(v), s);
const toDemo = (s) => Object.entries(DEMO).reduce((a, [k, v]) => a.split(k).join(v), toBracket(s));

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
await page.waitForSelector('.pv-sec[data-blk="card"] .fx p');
if (errs.length) bad.push("規格頁有 JS 錯誤：" + errs.join(" / "));

const got = await page.evaluate(() => {
  const C = '.pv-sec[data-blk="card"] .fx';
  const card = document.querySelector(C);
  const ps = [...document.querySelectorAll(C + " p")];
  const hero = document.querySelector(C + " img.hero");
  const photo = document.querySelector('.pv-sec[data-blk="img"] .pv-bub.img img');
  const spec = document.getElementById("pv-spec");
  const cs = (e) => getComputedStyle(e);
  return {
    paras: ps.map((p) => p.textContent),
    size: ps.map((p) => parseFloat(cs(p).fontSize)),
    color: ps.map((p) => cs(p).color),
    mtop: ps.map((p) => parseFloat(cs(p).marginTop)),
    cardBg: cs(card).backgroundColor,
    cardW: +card.getBoundingClientRect().width.toFixed(1),
    heroSrc: hero ? hero.getAttribute("src").split("/").pop() : null,
    heroW: hero ? +hero.getBoundingClientRect().width.toFixed(1) : null,
    photoSrc: photo ? photo.getAttribute("src").split("/").pop() : null,
    spec: spec ? spec.textContent : null,
    bar: !!document.querySelector(".pv-bar"),
    all: document.body.textContent,
  };
});
await browser.close();

/* ── ① 三段文字逐字（JSON ↔「要貼進去的字」那一塊） ───────── */
ok(got.spec != null, "規格頁上找不到「要貼進去的字」那一塊（#pv-spec）");
if (got.spec != null) {
  const want = P.map((t) => toBracket(t.text)).join("\n\n");
  ok(want === got.spec,
    "「要貼進去的字」和 JSON 對不上：\n    JSON：" + JSON.stringify(want.slice(0, 90)) +
    "…\n    頁面：" + JSON.stringify(got.spec.slice(0, 90)) + "…");
}

/* ── ② 畫在卡片上的那一份也要逐字（填進示範值之後） ────────── */
ok(got.paras.length === P.length,
  `卡片上有 ${got.paras.length} 段、JSON 有 ${P.length} 段`);
P.forEach((t, i) => {
  if (got.paras[i] == null) return;
  ok(toDemo(t.text) === got.paras[i],
    `卡片第 ${i + 1} 段對不上：\n    JSON（填示範值）「${toDemo(t.text).slice(0, 60)}…」\n    頁面「${got.paras[i].slice(0, 60)}…」`);
});

/* ── ③ 四個可填欄位 ─────────────────────────────────────── */
const jt = P.map((t) => t.text).join("");
const slots = jt.match(/\{\{\w+\}\}/g) || [];
ok(slots.length === 4,
  `JSON 裡的可填欄位有 ${slots.length} 個，應該是 4（颱風名、日期 ×2、星期）`);
ok(slots.filter((s) => s === "{{date}}").length === 2,
  "{{date}} 應該出現兩次（宣布停課那一句、請已預約那一句）—— 這是最容易漏掉的一格");
for (const s of slots)
  ok(SLOT[s], `JSON 裡有一個不認識的欄位 ${s} —— 對照表 SLOT 要一起加`);
ok(!/\{\{/.test(got.all),
  "規格頁上直接印出了 {{…}} —— 那幾格要寫成看得懂的〔…〕或示範值");
ok((got.spec.match(/〔[^〕]+〕/g) || []).length === 4,
  "「要貼進去的字」裡的〔…〕不是四處 —— 面板數的就是它（每次颱風要重打幾個地方）");

/* ── ④ 字級 ─────────────────────────────────────────────── */
P.forEach((t, i) => {
  if (got.size[i] == null) return;
  ok(PX[t.size] === got.size[i],
    `第 ${i + 1} 段的字級對不上：JSON ${t.size}＝${PX[t.size]}px、頁面 ${got.size[i]}px`);
});

/* ── ⑤ 顏色 ─────────────────────────────────────────────── */
const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3)
  .map((x) => (+x).toString(16).padStart(2, "0")).join("").toUpperCase();
ok(doc.body.backgroundColor.toUpperCase() === hex(got.cardBg),
  `卡片底色對不上：JSON ${doc.body.backgroundColor}、頁面 ${hex(got.cardBg)}`);
P.forEach((t, i) => {
  if (got.color[i] == null) return;
  ok(t.color.toUpperCase() === hex(got.color[i]),
    `第 ${i + 1} 段的字色對不上：JSON ${t.color}、頁面 ${hex(got.color[i])}`);
});

/* ── ⑥ 三段之間的距離 ───────────────────────────────────── */
P.forEach((t, i) => {
  if (got.mtop[i] == null) return;
  ok(Math.abs(parseFloat(t.margin) - got.mtop[i]) < 0.6,
    `第 ${i + 1} 段的上外距對不上：JSON ${t.margin}、頁面 ${got.mtop[i]}px`);
});

/* ── ⑦ 頭圖 ─────────────────────────────────────────────── */
{
  const name = doc.hero.url.split("/").pop();
  const file = path.join(DIR, name);
  ok(fs.existsSync(file), `頭圖找不到本機檔案：${file}`);
  if (fs.existsSync(file)) {
    const { w, h } = jpegSize(file);
    const real = w / h, want = parseFloat(doc.hero.aspectRatio);
    ok(Math.abs(real - want) < 0.01,
      `頭圖的 aspectRatio 對不上真圖：寫 ${doc.hero.aspectRatio}、實際 ${real.toFixed(3)}:1`
      + "（⚠ 寫錯不報錯也不變形，只會靜靜地縮小、四周留白）");
    ok(w <= 1024 && h <= 1024, `頭圖超過 LINE 的 1024×1024（${w}×${h}）`);
  }
  ok(got.heroSrc === name,
    `卡片頭圖引用的不是 JSON 那一張（JSON ${name}／頁面 ${got.heroSrc}）`);
  /* ⚠⚠ 聊天室那張照片（「文字＋圖」那條退路貼的）和卡片頭圖**是同一個檔** ——
     兩條路共用一張圖正是「圖不會白畫」那句話的依據，分岔了那句話就不成立。 */
  ok(got.photoSrc === name,
    `聊天室那張照片和卡片頭圖不是同一個檔（${got.photoSrc} vs ${name}）`
    + " —— 三條路共用同一張圖，分岔了「圖不會白畫」就不成立");
  ok(doc.hero.size === "full" && Math.abs(got.heroW - got.cardW) < 0.6,
    `頭圖不是滿版（JSON size ${doc.hero.size}、頁面 ${got.heroW} vs 卡片 ${got.cardW}）`);
}

/* ── ⑧ 紅線與 emoji ─────────────────────────────────────── */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "馬上回", "找得到人", "有專人", "線上客服"];
const scan = jt.replace(/沒有專人/g, "＿").replace(/無專人/g, "＿");
for (const w of LIE)
  ok(scan.indexOf(w) < 0,
    `卡片上出現「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節），颱風天更沒有`);
/* ⚠ 要先把 `_說明` 剝掉 —— 註解裡本來就寫滿了 ⚠，而 ⚠ 落在 emoji 那個字碼區間裡。 */
const EMOJI = /[☀-➿⬀-⯿]|[\ud83c-\ud83e][\udc00-\udfff]/g;
const strip = (o) => Array.isArray(o) ? o.map(strip)
  : (o && typeof o === "object")
    ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")).map(([k, v]) => [k, strip(v)]))
    : o;
const jsonTxt = JSON.stringify(strip(doc));
ok(!(jsonTxt.match(EMOJI) || []).length, "Flex JSON 裡有 emoji —— 站上全站 0 個");

/* ── ⑨ 定案了就不可以還有切換條 ─────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");

/* ── 報告 ───────────────────────────────────────────────── */
if (bad.length) {
  console.error("✗ 颱風／臨時休診：JSON 和規格頁對不上 " + bad.length + " 項\n");
  bad.forEach((b, i) => console.error(`  ${i + 1}. ${b}`));
  process.exit(1);
}
console.log("✓ 颱風／臨時休診：Flex JSON 和規格頁逐項相同");
console.log(`  三段文字逐字（JSON ↔ 要貼進去的字 ↔ 畫在卡片上）`);
console.log(`  可填欄位 4 處（颱風名、日期 ×2、星期）・字級 sm 14px ×3`);
console.log(`  卡底 ${doc.body.backgroundColor}・內文 ${P[0].color}・段距 ${P[0].margin}`);
console.log(`  頭圖 ${doc.hero.url.split("/").pop()}（${doc.hero.aspectRatio}）—— 卡片與聊天室同一個檔`);
console.log(`  紅線 0 處・emoji 0 個・切換條已拿掉`);
