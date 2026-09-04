#!/usr/bin/env node
/* 守門：「綁定完成」的 Flex JSON ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-bind-done.mjs
 *
 * 和 check-welcome.mjs 同一條道理：**規格頁一旦和 JSON 對不上，
 * 上面做的每一個判斷都是假的**。這一支比對六件：
 *   ① 六段文字逐字（含 span 的加粗）
 *   ② 字級（LINE Flex 的固定 px 表）
 *   ③ 顏色
 *   ④ 兩塊淡底：合成後的實色要等於頁面上那個 rgba 疊在卡色上的結果
 *   ⑤ 頭圖：檔案在不在、真實長寬比對不對得上 aspectRatio
 *   ⑥ 紅線：不可以出現「有問題隨時問」那一類的承諾
 *
 * ⚠ 頁面是 JS 產生的，所以要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-bind-done", "index.html");
const JSONF = path.join(HERE, "bind-done-card.json");

const card = JSON.parse(fs.readFileSync(JSONF, "utf8"));
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

/* LINE Flex 的固定字級表（第十一之二節） */
const PX = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };
/* Flex 的 margin 關鍵字 */
const MG = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const mgPx = (m) => (m == null ? 0 : m in MG ? MG[m] : parseFloat(m));

const kids = card.body.contents;
const flat = (t) => t.text != null ? t.text : t.contents.map((c) => c.text).join("");

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
await page.waitForSelector(".pv-hc .t");
if (errs.length) bad.push("規格頁有 JS 錯誤：" + errs.join(" / "));

const got = await page.evaluate(() => {
  const g = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      text: el.textContent,
      bold: [...el.querySelectorAll("b")].map((b) => b.textContent),
      size: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
      color: cs.color,
      bg: cs.backgroundColor,
      mt: parseFloat(cs.marginTop),
      radius: parseFloat(cs.borderTopLeftRadius),
    };
  };
  const ds = [...document.querySelectorAll(".pv-hc .d:not([class*=' w-'])")];
  const hero = document.getElementById("pv-hero");
  return {
    t: g(".pv-hc .t"),
    d1: (() => { const e = ds[0]; return e ? g(".pv-hc .b .d") : null; })(),
    d2: ds[1] ? { text: ds[1].textContent, size: parseFloat(getComputedStyle(ds[1]).fontSize),
                  color: getComputedStyle(ds[1]).color, mt: parseFloat(getComputedStyle(ds[1]).marginTop) } : null,
    warn: g(".pv-hc .d.w-box"),
    say: g(".pv-hc .say"),
    fine: g(".pv-hc .fine"),
    cardBg: getComputedStyle(document.querySelector(".pv-hc")).backgroundColor,
    heroSrc: hero ? hero.getAttribute("src") : null,
    bar: !!document.querySelector(".pv-bar"),
    /* 退路那一版（純文字），只掃紅線用 */
    alt: (document.querySelector("#pv-slot2 .pv-bub") || {}).textContent || "",
  };
});
await browser.close();

/* ── ① 六段文字逐字 ─────────────────────────────────────────── */
/* ⚠ 只切頭尾的空白，中間**逐字比對** —— 把空白全洗掉的話，
   「看診前48小時」和「看診前 48 小時」會被判成一樣，而那正是 19-17 定的事。 */
const norm = (s) => s.replace(/\r/g, "").replace(/^\s+|\s+$/g, "");
const pairs = [
  ["標題", flat(kids[0]), got.t && got.t.text],
  ["第一段", flat(kids[1]), got.d1 && got.d1.text],
  ["第二段", flat(kids[2]), got.d2 && got.d2.text],
  ["警示方塊", flat(kids[3].contents[0]), got.warn && got.warn.text],
  ["改約方塊", flat(kids[4].contents[0]), got.say && got.say.text],
  ["附註", flat(kids[5]), got.fine && got.fine.text],
];
for (const [n, a, b] of pairs) ok(b != null && norm(a) === norm(b),
  `${n}對不上：\n    JSON  ${JSON.stringify(a)}\n    規格頁 ${JSON.stringify(b)}`);

/* 加粗的那幾個字（Flex 是 span.weight bold，頁面是 <b>） */
const jsonBold = (kids[1].contents || []).filter((c) => c.weight === "bold").map((c) => c.text);
ok(JSON.stringify(jsonBold) === JSON.stringify(got.d1 ? got.d1.bold : []),
  `加粗的字對不上：JSON ${JSON.stringify(jsonBold)} vs 規格頁 ${JSON.stringify(got.d1 && got.d1.bold)}`);
ok(jsonBold.length === 1 && jsonBold[0] === "約診查詢",
  "選單名應該只有「約診查詢」一段加粗（19-18：用加粗取代全形的「」）");

/* ── ② 字級 ─────────────────────────────────────────────────── */
const sizes = [["標題", kids[0].size, got.t], ["第一段", kids[1].size, got.d1],
  ["第二段", kids[2].size, got.d2], ["警示方塊", kids[3].contents[0].size, got.warn],
  ["改約方塊", kids[4].contents[0].size, got.say], ["附註", kids[5].size, got.fine]];
for (const [n, k, el] of sizes) ok(el && PX[k] === el.size,
  `${n}的字級對不上：JSON ${k}（${PX[k]}px） vs 規格頁 ${el && el.size}px`);

/* ── ③ 顏色 ─────────────────────────────────────────────────── */
const rgb = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
};
const cols = [["標題", kids[0].color, got.t], ["第一段", kids[1].color, got.d1],
  ["第二段", kids[2].color, got.d2], ["警示方塊", kids[3].contents[0].color, got.warn],
  ["改約方塊", kids[4].contents[0].color, got.say], ["附註", kids[5].color, got.fine]];
for (const [n, k, el] of cols) ok(el && rgb(k) === el.color,
  `${n}的顏色對不上：JSON ${k}（${rgb(k)}） vs 規格頁 ${el && el.color}`);

/* ── ④ 兩塊淡底：JSON 寫的是合成後的實色 ─────────────────────── */
const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
const over = (el, cardRGB) => {
  const p = parse(el.bg);
  const a = p.length > 3 ? p[3] : 1;
  return p.slice(0, 3).map((v, i) => Math.round(v * a + cardRGB[i] * (1 - a)));
};
const cardRGB = parse(got.cardBg).slice(0, 3);
for (const [n, box, el] of [["警示方塊", kids[3], got.warn], ["改約方塊", kids[4], got.say]]) {
  const want = [1, 3, 5].map((i) => parseInt(box.backgroundColor.slice(i, i + 2), 16));
  const have = over(el, cardRGB);
  ok(want.every((v, i) => Math.abs(v - have[i]) <= 1),
    `${n}的底色對不上：JSON ${box.backgroundColor} vs 規格頁合成後 ` +
    `#${have.map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("")}`);
  ok(parseFloat(box.cornerRadius) === el.radius,
    `${n}的圓角對不上：JSON ${box.cornerRadius} vs 規格頁 ${el.radius}px`);
  ok(mgPx(box.margin) === el.mt,
    `${n}的上外距對不上：JSON ${box.margin}（${mgPx(box.margin)}px） vs 規格頁 ${el.mt}px`);
}

/* ── ⑤ 頭圖 ─────────────────────────────────────────────────── */
ok(got.heroSrc, "規格頁上沒有頭圖（定案是「有頭圖」）");
if (got.heroSrc) {
  const p = path.join(path.dirname(PAGE), got.heroSrc);
  ok(fs.existsSync(p), `頭圖不存在：${got.heroSrc}`);
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    /* JPEG 檔頭掃 SOF 拿長寬（這站沒有 npm 依賴） */
    let i = 2, w = 0, h = 0;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break;
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    ok(w > 0 && h > 0, "讀不出頭圖的尺寸");
    ok(w <= 1024 && h <= 1024, `頭圖 ${w}×${h} 超過 Flex 的 1024×1024 上限`);
    const [aw, ah] = card.hero.aspectRatio.split(":").map(Number);
    ok(Math.abs(w / h - aw / ah) < 0.01,
      `頭圖的長寬比 ${(w / h).toFixed(3)}（${w}×${h}）對不上 aspectRatio ${card.hero.aspectRatio}`);
  }
  ok(/hero-bind\.jpg$/.test(card.hero.url),
    `JSON 的頭圖網址不是 hero-bind.jpg：${card.hero.url}`);
}

/* ── ⑥ 紅線（第十一之三節）───────────────────────────────────── */
const LIES = ["隨時問", "問到", "即時回", "找得到人", "有問題就問", "馬上回", "專人回覆"];
const all = pairs.map(([, a]) => a).join("") + got.alt;
/* 「沒有專人即時回覆」是誠實的敘述，掃描前要先剝掉，不然會誤報 */
const scan = all.replace(/沒有專人即時回覆/g, "").replace(/無專人/g, "");
for (const w of LIES) ok(!scan.includes(w),
  `出現了「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節）`);

/* ── ⑦ 定案的三件不該再變 ───────────────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");
ok(got.alt.includes("「約診查詢」"),
  "退路那一版應該仍用全形的「」（純文字沒有粗體可用）");

if (bad.length) {
  console.error("❌ 對不上 " + bad.length + " 項：\n" + bad.map((b) => "  ・" + b).join("\n"));
  process.exit(1);
}
console.log("✅ JSON 與規格頁逐項相同（6 段文字＋加粗、字級、顏色、" +
  "兩塊淡底的合成色／圓角／上外距、頭圖的檔案・上限・長寬比、紅線、切換條已拿掉）");
