#!/usr/bin/env node
/* 守門：取消／改期那一段對話的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-cancel.mjs
 *
 * 同 check-welcome.mjs／check-bind-done.mjs／check-remind.mjs 那條道理：
 * **規格頁一旦和 JSON 對不上，上面做的每一個判斷都是假的。**
 * 這一支比對八件：
 *   ① 三則的每一段文字逐字（確認那一句、兩顆按鈕、按了取消、按了不取消）
 *   ② 字級（LINE Flex 的固定 px 表：lg 19／md 16）
 *   ③ 顏色（主鈕的綠、線框鈕的深階、卡片底色）
 *   ④ 兩顆 logo：檔案在不在、真實長寬比對不對得上 aspectRatio、寬度
 *   ⑤ 兩顆按鈕的**順序**（使用者指定：第一顆就是「是喔 要取消」）
 *   ⑥ 按了不取消那一則要有姓名與日期，而且**和確認卡是同一組**
 *   ⑦ 紅線：新版那三段不可以出現「有問題隨時問」那一類的承諾，emoji 0 個
 *      ⚠⚠ 只掃**新版**（第 ①②③ 節）—— 第 ④ 節是現況的真截圖，
 *        它自己就有 😭😭 與 ❤️，那是證據不是我們寫的。
 *   ⑧ 定案之後規格頁上不可以還有切換條（第十一之五節）
 *
 * ⚠⚠ 姓名與日期兩處**刻意不逐字比對**（JSON 寫 {{patient}}／{{date}}、
 *   規格頁寫看得懂的示範值）—— 改成檢查「兩邊都是變數的位置 ＋
 *   規格頁上不准直接印 {{…}}」（check-remind 那一輪踩過，照字面比會誤報）。
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-cancel");
const PAGE = path.join(DIR, "index.html");
const JSONF = path.join(HERE, "cancel-card.json");

const doc = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
const CF = doc["cancel-confirm"].body.contents;
const DONE = doc["cancel-done"].body.contents;
const KEEP = doc["cancel-keep"].body.contents;

function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  throw new Error("只支援 PNG：" + file);
}
/* JSON 裡的圖都指向 https://fangren.net/assets/line/<檔名>；本機那一份有兩個落點
   —— 這兩顆 logo 是別的輪次產的，**刻意不複製第二份**到這個資料夾。 */
function localOf(url) {
  const name = url.split("/").pop();
  for (const d of ["line-cancel", "line-remind", "line-welcome"]) {
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
await page.waitForSelector("#pv-chat1 .js-card .q");
if (errs.length) bad.push("規格頁有 JS 錯誤：" + errs.join(" / "));

const got = await page.evaluate(() => {
  const one = (s) => document.querySelector(s);
  const txt = (s) => { const e = one(s); return e ? e.textContent : null; };
  const fsz = (s) => { const e = one(s); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const bg  = (s) => { const e = one(s); return e ? getComputedStyle(e).backgroundColor : null; };
  const col = (s) => { const e = one(s); return e ? getComputedStyle(e).color : null; };
  const wid = (s) => { const e = one(s); return e ? +e.getBoundingClientRect().width.toFixed(1) : null; };
  const src = (s) => { const e = one(s); return e ? e.getAttribute("src").split("/").pop() : null; };
  const C = "#pv-chat1 .js-card ";      /* 確認卡 */
  const D = "#pv-chat1 .js-res ";       /* 按了取消 */
  const K = "#pv-chat2 .js-res ";       /* 按了不取消 */
  /* 兩顆按鈕在 DOM 裡的先後 ＝ 畫面上的先後 */
  const order = [...document.querySelectorAll(C + ".btn, " + C + ".nob")]
    .map((e) => e.className);
  return {
    q: txt(C + ".q"), nm: txt(C + ".nm"), dt: txt(C + ".dt"),
    go: txt(C + ".btn span"), stay: txt(C + ".nob span"),
    done: txt(D + ".lead"),
    keep: txt(K + ".lead"), keepNm: txt(K + ".nm"), keepDt: txt(K + ".dt"),
    size: { q: fsz(C + ".q"), nm: fsz(C + ".nm"), dt: fsz(C + ".dt"),
            go: fsz(C + ".btn span"), stay: fsz(C + ".nob span"),
            done: fsz(D + ".lead"), keep: fsz(K + ".lead"),
            keepNm: fsz(K + ".nm"), keepDt: fsz(K + ".dt") },
    color: { card: bg("#pv-chat1 .js-card"), goBg: bg(C + ".btn"), goFg: col(C + ".btn span"),
             stayFg: col(C + ".nob span") },
    img: { go: src(C + ".btn img"), stay: src(C + ".nob img") },
    w: { go: wid(C + ".btn img"), stay: wid(C + ".nob img") },
    order,
    bar: !!document.querySelector(".pv-bar"),
    /* 新版那三段（現況那兩段刻意排除 —— 它自己就有 emoji，那是證據） */
    fresh: ["pv-chat1", "pv-chat2", "pv-chat3"]
      .map((id) => (document.getElementById(id) || {}).textContent || "").join(" "),
    all: document.body.textContent
  };
});
await browser.close();

/* ── ① 文字逐字 ──────────────────────────────────────────── */
const pair = [
  [CF[0].text, got.q, "確認那一句"],
  [CF[3].contents[1].text, got.go, "綠底那顆的字"],
  [CF[4].contents[1].text, got.stay, "白底那顆的字"],
  [DONE[0].text, got.done, "按了取消那一則"],
  [KEEP[0].text, got.keep, "按了不取消那一則"],
];
for (const [a, b, name] of pair)
  ok(a === b, `${name}對不上：\n    JSON「${a}」\n    頁面「${b}」`);

/* ⚠⚠ 姓名與日期是系統填的欄位：JSON 一定要是變數、頁面一定不能印出 {{…}} */
for (const [t, name] of [[CF[1].text, "確認卡的姓名"], [CF[2].text, "確認卡的日期"],
                         [KEEP[1].text, "保留那一則的姓名"], [KEEP[2].text, "保留那一則的日期"]])
  ok(/^\{\{\w+\}\}$/.test(t), `${name}在 JSON 裡不是變數（現在是「${t}」）—— 那是系統填的`);
ok(!/\{\{/.test(got.all), "規格頁上直接印出了 {{…}} —— 要換成看得懂的示範值");
ok(got.nm && got.dt, "確認卡上少了姓名或日期 —— 那正是它擋得住誤按的原因");

/* ── ⑥ 保留那一則要和確認卡是同一組 ─────────────────────── */
ok(got.keepNm === got.nm && got.keepDt === got.dt,
  `保留那一則的姓名／日期和確認卡對不上（${got.keepNm}／${got.keepDt} vs ${got.nm}／${got.dt}）`
  + " —— 他核對的是同一組東西，兩張卡長一樣才對得起來");

/* ── ② 字級 ─────────────────────────────────────────────── */
const sz = [
  [CF[0].size, got.size.q, "確認那一句"],
  [CF[1].size, got.size.nm, "確認卡的姓名"],
  [CF[2].size, got.size.dt, "確認卡的日期"],
  [CF[3].contents[1].size, got.size.go, "綠底那顆的字"],
  [CF[4].contents[1].size, got.size.stay, "白底那顆的字"],
  [DONE[0].size, got.size.done, "按了取消那一則"],
  [KEEP[0].size, got.size.keep, "按了不取消那一則"],
  [KEEP[1].size, got.size.keepNm, "保留那一則的姓名"],
  [KEEP[2].size, got.size.keepDt, "保留那一則的日期"],
];
for (const [k, px, name] of sz)
  ok(PX[k] === px, `${name}的字級對不上：JSON ${k}＝${PX[k]}px、頁面 ${px}px`);

/* ── ③ 顏色 ─────────────────────────────────────────────── */
const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3)
  .map((x) => (+x).toString(16).padStart(2, "0")).join("").toUpperCase();
const cl = [
  [doc["cancel-confirm"].body.backgroundColor, got.color.card, "卡片底色"],
  [CF[3].backgroundColor, got.color.goBg, "綠底那顆的底"],
  [CF[3].contents[1].color, got.color.goFg, "綠底那顆的字"],
  [CF[4].contents[1].color, got.color.stayFg, "白底那顆的字"],
];
for (const [a, b, name] of cl)
  ok(a.toUpperCase() === hex(b), `${name}對不上：JSON ${a}、頁面 ${hex(b)}`);

/* ── ④ 兩顆 logo ───────────────────────────────────────── */
for (const [node, shown, w, name] of [
  [CF[3].contents[0], got.img.go, got.w.go, "綠底那顆的 logo"],
  [CF[4].contents[0], got.img.stay, got.w.stay, "白底那顆的 logo"],
]) {
  const file = localOf(node.url);
  ok(file, `${name} 找不到本機檔案：${node.url}`);
  if (!file) continue;
  ok(path.basename(file) === shown,
    `${name}和規格頁引用的不是同一個檔（JSON ${path.basename(file)}／頁面 ${shown}）`);
  const { w: iw, h: ih } = imgSize(file);
  const real = iw / ih, want = parseFloat(node.aspectRatio);
  ok(Math.abs(real - want) < 0.01,
    `${name}的 aspectRatio 對不上真圖：寫 ${node.aspectRatio}、實際 ${real.toFixed(3)}:1`
    + "（⚠ 寫錯不報錯也不變形，只會靜靜地縮小、四周留白）");
  ok(Math.abs(parseFloat(node.size) - w) < 0.6,
    `${name}的寬度對不上：JSON ${node.size}、頁面 ${w}px`);
  ok(iw <= 1024 && ih <= 1024, `${name}超過 LINE 的 1024×1024（${iw}×${ih}）`);
}
/* ⚠⚠ 檔名裡的顏色不等於形狀（2026-09-05 踩過）：白底那顆一定要是**頁首那一條**
   （2.029），不是招呼卡「介紹芳仁給朋友」用的 shape-r2c3（3.081）。 */
ok(got.img.stay === "mark-head-green.png",
  `白底那顆的 logo 是「${got.img.stay}」—— 使用者指定用「現在主要的那個」`
  + "＝ mark-head-green.png（站上頁首那一條 2.029）。⚠ mark-green.png 是另一顆形狀。");
ok(got.img.go === "mark-nogo-white.png",
  `綠底那顆的 logo 是「${got.img.go}」—— 它的語意是「不會來」，要用翻過來的 nogo。`);

/* ── ⑤ 順序 ─────────────────────────────────────────────── */
ok(/btn/.test(got.order[0] || ""),
  "第一顆按鈕不是「是喔 要取消」—— 那是使用者指定的排法（?o=safe 只是對照）");

/* ── ⑦ 紅線 ─────────────────────────────────────────────── */
const LIE = ["隨時問", "都可以問", "問到", "有人回", "馬上回", "找得到人", "有專人"];
const scan = got.fresh.replace(/沒有專人/g, "＿").replace(/無專人/g, "＿");
for (const w of LIE)
  ok(scan.indexOf(w) < 0,
    `新版那三則裡出現「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節）`);
const EMOJI = /[☀-➿⬀-⯿]|[\ud83c-\ud83e][\udc00-\udfff]/g;
const emo = got.fresh.match(EMOJI) || [];
ok(emo.length === 0, `新版那三則裡有 ${emo.length} 個 emoji（${emo.join(" ")}）—— 站上全站 0 個`);
/* JSON 那一側也掃一次（頁面沒印到的字，JSON 裡也不可以有）。
   ⚠ 要先把 `_說明` 剝掉 —— 註解裡本來就寫滿了 ⚠，而 ⚠ 落在 emoji 那個字碼區間裡。 */
const strip = (o) => Array.isArray(o) ? o.map(strip)
  : (o && typeof o === "object")
    ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")).map(([k, v]) => [k, strip(v)]))
    : o;
const jsonTxt = JSON.stringify(strip([doc["cancel-confirm"], doc["cancel-done"], doc["cancel-keep"]]));
ok(!(jsonTxt.match(EMOJI) || []).length, "Flex JSON 裡有 emoji");

/* ── ⑧ 定案了就不可以還有切換條 ─────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");

/* ── 報告 ───────────────────────────────────────────────── */
if (bad.length) {
  console.error("✗ 取消那一段：JSON 和規格頁對不上 " + bad.length + " 項\n");
  bad.forEach((b, i) => console.error("  " + (i + 1) + ". " + b));
  process.exit(1);
}
console.log("✓ 取消那一段：JSON ↔ 規格頁逐項相同");
console.log("  文字 5 段逐字、姓名與日期 4 處都是變數、保留那一則和確認卡同一組");
console.log("  字級 9 處（lg 19／md 16）、顏色 4 處、兩顆 logo 的檔案・長寬比・寬度");
console.log("  順序（取消在左，使用者指定）、紅線 0 項、emoji 0 個、切換條已拿掉");
