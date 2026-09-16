#!/usr/bin/env node
/* 「看診前 48 小時提醒」那一則 —— 印成 A4 的櫃檯用紙
 *
 *   node drafts/channels/remind-a4.mjs
 *     → drafts/channels/remind-a4.html         （自給自足的一頁，直接用瀏覽器開、Ctrl+P）
 *     → drafts/channels/芳仁-約診提醒-A4.pdf    （要印的就是這一份）
 *     → drafts/channels/remind-a4.png          （看一眼用的）
 *
 *   可帶：--date="9月18日 (五) 09:00"　--pad=12（紙的上下留白 mm）
 *         --hero（把頭圖放回來）　--name=〔病人姓名〕（把姓名那一格放回來）
 *
 * 起點是使用者 2026-09-16 的照片：櫃檯現在印著**廠商那一版**的 A4（護貝在資料袋裡），
 * 約診時拿給病人看，告訴他看診前會收到這一則、要回覆。他：「我們已經做好新的，
 * 把新的做成這個A4版面，我要印出來。」
 *
 * ⚠⚠⚠ **這一張不重畫卡片** —— 它是把 `/preview/line-remind/` 那一頁上**定稿的那張卡
 *   整個抓下來**（markup ＋ 那一頁的樣式表），只做四件事：換掉示範日期、把圖檔內嵌、
 *   放大、擺進一張 A4。同 og-topic-card 那一輪的規矩：**要擺真的產出檔，不要用 CSS
 *   再畫一次**（重畫一份的話，哪天那一頁改了，這張紙就開始說謊）。
 *   所以**那一頁改了就要重跑這一支**。
 *
 * ⚠⚠ 成品住在 `drafts/`（同門口那張停車告示）：`tools/dist.mjs` 的 ALWAYS／OPTIONAL
 *   都沒有 drafts，所以它進不了 `_site`、fangren.net 上找不到。產出的三個檔**不進版控**。
 *
 * ⚠⚠ 換媒介要逐項問的（CLAUDE.md 第九節第 28 條 ⑤）：
 *   ① **紙上的按鈕按不下去** —— 三顆都還在，因為這張紙的用途正是「你手機上會看到這個」；
 *      按鈕是那則訊息的一部分，拿掉反而看不懂。
 *   ② **姓名與日期是系統填的** —— 日期紙上印示範值（同廠商那一版印著 2025/01/11），
 *      **姓名那一格 2026-09-16 使用者指定連同括號一起拿掉**，開場只剩「哈囉」：
 *      紙上印一個永遠不會是他的名字，比不印還怪（`--name=〔病人姓名〕` 放得回來）。
 *   ③ **電話在紙上撥不了**，但號碼讀得出來，不必改。
 *   ④ **沒有加抬頭、沒有加任何一句我們自己的話** —— 廠商那一版也沒有（它就是一張截圖），
 *      而這條線每一則的字都是使用者自己寫的。要加一句，等他開口。
 *   ⑥ **診所的頭像 2026-09-16 補上**（使用者：「要把左邊那個診所 logo 貼上去，
 *      這樣才像 line 裡的樣子」）——⚠⚠ 它**在卡片上面不是左邊**：
 *      從他的手機截圖逐像素量，Flex 的 mega 卡吃滿整條可用寬度，LINE 因此把頭像
 *      擺到卡片**上方**（頭像 30px、底緣離卡片上緣 6px、左緣比卡片左緣再左 3px）。
 *      **不是「左邊那一欄」** —— 規格頁那個聊天室模擬畫的是文字泡泡那一種（頭像在旁邊），
 *      這張紙上的是圖卡，兩者不一樣。
 *   ⑤ **頭圖 2026-09-16 使用者指定拿掉** —— 卡片矮 134px，同一張 A4 因此放得下更大的
 *      倍率（1.78 → 2.31、字大三成）。⚠ **代價是這張紙上一個「芳仁」都沒有了**
 *      （廠商那一版有一條寫著診所名的綠帶子），他看過數字之後仍然選它。
 *      `--hero` 放得回來。
 *
 * ⚠ 紙上的卡多了一圈很淡的框線：卡片色 #F4F4F5 壓在白紙上幾乎看不出邊，
 *   螢幕上那一圈陰影印不出來。那是**印刷需要**，不是版面改動。
 *
 * ⚠⚠ 字型：這台容器只有文泉驛，印出來會和站上差很多 —— 所以產生器會去 Google Fonts
 *   取一份**只含這張紙用得到的那幾個字**的 Noto Sans TC（400／700），內嵌進 HTML。
 *   取不到就退回系統字型堆疊（Windows 上是微軟正黑體），並印一行提醒。
 *
 * ⚠ 一律 headless_shell（第九節第 18 條：完整版 chrome 畫出來會比視窗少 87px，而且不報錯）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(ROOT, "preview", "line-remind", "index.html");
const OUT_HTML = path.join(HERE, "remind-a4.html");
const OUT_PDF = path.join(HERE, "芳仁-約診提醒-A4.pdf");
const OUT_PNG = path.join(HERE, "remind-a4.png");
const CARD_W = 268;                    /* LINE 上圖卡的實寬，整條線共用的那個數字 */
/* ---- 頭像（LINE 聊天室裡那顆圓形的診所大頭）--------------------------
   量自使用者 2026-09-16 的手機截圖（1125×2436 ＝ 375 CSS px 的 3×）：
     圓 x 24~113、y 836~928 → **30×30 CSS px**
     卡片上緣 y 945、左緣 x 33 → 頭像**底緣離卡片上緣 5.7px、左緣比卡片左 3px**
     圓裡那顆白色標誌寬 x 34~102 ＝ 22.7px ＝ 圓的 **75.6%**
   ⚠ 圓的顏色**沒有從截圖取**（iPhone 的截圖有色彩描述檔，量到的 rgb(61,95,82)
     和站上任何一支都對不起來）—— 用站上一般牙科的套色 `#3f654a`，
     那也正是 `assets/icon.svg`／`assets/logo.png` 用的那一支。不新增顏色。
   ⚠⚠ 形狀不抄第二份：直接讀 `brand/shapes/mark.svg`（單一路徑、牙洞是
     `fill-rule: evenodd` 挖穿的，所以填白之後洞會透出底下的綠 ＝ 截圖上的樣子）。 */
const AV = 30;        /* 頭像直徑 */
const AV_GAP = 6;     /* 頭像底緣到卡片上緣 */
const AV_DX = -3;     /* 頭像左緣相對卡片左緣 */
const AV_MARK = 0.756;/* 白色標誌佔圓的寬度比 */
const AV_BG = "#3f654a"; /* ＝ 一般牙科的套色，站上 icon.svg／logo.png 用的同一支 */
const A4 = { w: 210, h: 297 };    /* mm */
const MM = 96 / 25.4;             /* 1mm 在 96dpi 底下的 CSS px */

const arg = (k, d) => {
  const hit = process.argv.find((a) => a.startsWith("--" + k + "="));
  return hit ? hit.slice(k.length + 3) : d;
};
const PAD = Number(arg("pad", "12"));   /* 紙的上下留白（mm）—— 卡片撐滿剩下的高度 */
/* ⚠ 2026-09-16 定案：不放頭圖、不印姓名那一格（挑定的值寫回預設，見檔頭 ②⑤）。
   `--hero`／`--name=…` 是回去的路，不是預設。 */
const NOHERO = !process.argv.includes("--hero");

/* ---- 示範日期 ----------------------------------------------------------
   卡上那一句寫的是「提醒2天後有約要看牙齒喔」，所以示範日期就取**兩天後**，
   落在週六日再往後推到週一（診所六日休診）——這樣紙上那兩行不會互相矛盾。
   ⚠ 格式照 reminder-card.json 的要求：**拿掉年份、月日中文、括號半形**。       */
function sampleDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  const wk = "日一二三四五六"[d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 (${wk}) 09:00`;
}
const DATE = arg("date", sampleDate());
const NAME = arg("name", "");

/* ---- 1. 從規格頁把那張卡整個抓下來 ------------------------------------- */
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

const page = await browser.newPage({ viewport: { width: 430, height: 1200 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + SRC);
await page.waitForFunction(() => !!document.querySelector(".pv-hc.pv-new"));
if (errs.length) throw new Error("規格頁有 JS 錯誤：" + errs.join(" / "));

const picked = await page.evaluate(({ date, name }) => {
  const card = document.querySelector(".pv-hc.pv-new");
  const dt = card.querySelector(".dt");
  const hiB = card.querySelector(".hi b");
  const before = { dt: dt.textContent, name: hiB.textContent };
  dt.textContent = date;
  if (name) hiB.textContent = name;
  else {
    /* 姓名整格拿掉時，前面那個全形空格也要拿掉 —— 不然「哈囉」後面掛著一個空格 */
    const hi = hiB.parentNode;
    hiB.remove();
    hi.innerHTML = hi.innerHTML.replace(/[\s\u3000]+$/, "");
  }
  const css = [...document.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  return { html: card.outerHTML, css, before, text: card.innerText };
}, { date: DATE, name: NAME });
await page.close();

/* ---- 2. 守門：卡上每一段字都要在 reminder-card.json 裡找得到 -------------
   規格頁與那份 JSON 本來就有 check-remind.mjs 在逐字對，這裡再對一次，
   擋的是「有人改了規格頁、卻沒有回頭改要交給廠商的那一份」。               */
const flex = JSON.parse(fs.readFileSync(path.join(HERE, "reminder-card.json"), "utf8"));
const want = [];
(function walk(n) {
  if (Array.isArray(n)) return n.forEach(walk);
  if (!n || typeof n !== "object") return;
  if (n.type === "text" || n.type === "span") {
    if (typeof n.text === "string") want.push(n.text);
  }
  if (n.contents) walk(n.contents);
  if (n.body) walk(n.body);
})(flex.body);
const flat = picked.text.replace(/\s+/g, "");
for (const t of want) {
  if (/\{\{.*\}\}/.test(t)) continue;              /* 姓名與日期是系統填的 */
  const s = t.replace(/\s+/g, "");
  if (!flat.includes(s)) throw new Error("卡上少了 JSON 裡的這一段字：" + t);
}
if (!picked.html.includes(DATE)) throw new Error("示範日期沒有換進去");
if (NAME && !picked.html.includes(NAME)) throw new Error("示範姓名沒有換進去");
if (!NAME && /<b>/.test(picked.html)) throw new Error("姓名那一格沒有拿掉");
if (!NAME && !/哈囉</.test(picked.html)) throw new Error("開場那一行的全形空格沒有收掉");

/* ⚠ 不放頭圖：只有這一張紙上拿掉，**規格頁與要給廠商的 JSON 一個字都沒動**。
   卡片矮了 134px，所以同一張 A4 放得下更大的倍率 —— 換到的是字大三成，
   付出的是「這張紙上再也沒有診所的名字或臉」（廠商那一版有一條寫著診所名的綠帶子）。 */
if (NOHERO) {
  const before = cardHtmlLen(picked.html);
  picked.html = picked.html.replace(/<img class="hero"[^>]*>/, "");
  if (cardHtmlLen(picked.html) >= before) throw new Error("頭圖沒有拿掉");
}
function cardHtmlLen(h) { return (h.match(/<img/g) || []).length; }

/* ---- 3. 圖檔內嵌成 data URI（這一頁要能單獨帶去別台電腦印）-------------- */
const dir = path.dirname(SRC);
let cardHtml = picked.html.replace(/src="([^"]+)"/g, (m, src) => {
  if (/^data:/.test(src)) return m;
  const f = path.resolve(dir, src);
  if (!fs.existsSync(f)) throw new Error("卡上引用的圖不在：" + src);
  const mime = f.endsWith(".png") ? "image/png" : "image/jpeg";
  return `src="data:${mime};base64,${fs.readFileSync(f).toString("base64")}"`;
});

/* ---- 3.5 頭像：綠圓 ＋ 白色標誌（形狀讀 brand/shapes/mark.svg）------------
   ⚠⚠ **不要另外存一個 PNG**：那顆標誌的幾何只有 brand/shapes/ 那一份，
     而且牙洞是 `fill-rule: evenodd` 挖穿的 —— 填白之後洞會透出底下的綠，
     那正是截圖上的樣子。存成圖檔就等於把它凍在某一個版本上。
   ⚠ **不可以只抄 <path d>**：那條路徑有兩段（外框 ＋ 牙洞），少抄一段畫出來是一顆
     實心的牙、而且每一個數字看起來都還很合理（brand/README.md 記過同一件事）。 */
const markSvg = fs.readFileSync(path.join(ROOT, "brand", "shapes", "mark.svg"), "utf8");
const markVB = (markSvg.match(/viewBox="([^"]+)"/) || [])[1];
const markInner = (markSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/) || [])[1];
if (!markVB || !markInner) throw new Error("讀不懂 brand/shapes/mark.svg");
if ((markInner.match(/<path/g) || []).length !== 1) throw new Error("mark.svg 不是單一路徑");
if (!/fill-rule="evenodd"/.test(markInner)) throw new Error("mark.svg 沒有 evenodd（牙洞會被填滿）");
if ((markInner.match(/\bM /g) || []).length < 2) throw new Error("那條路徑只有一段 —— 牙洞不見了");
const markRatio = Number(markVB.split(/\s+/)[2]) / Number(markVB.split(/\s+/)[3]);
const markW = AV * AV_MARK;
const markH = markW / markRatio;
const avatarSvg = `<svg class="a4-av" width="${AV}" height="${AV}" viewBox="0 0 ${AV} ${AV}"
 style="color:#fff" role="img" aria-label="芳仁牙醫診所">
<circle cx="${AV / 2}" cy="${AV / 2}" r="${AV / 2}" fill="${AV_BG}"/>
<svg x="${((AV - markW) / 2).toFixed(2)}" y="${((AV - markH) / 2).toFixed(2)}"
 width="${markW.toFixed(2)}" height="${markH.toFixed(2)}" viewBox="${markVB}">${markInner}</svg>
</svg>`;

/* ---- 4. 字型：只取這張紙用得到的那幾個字 -------------------------------- */
async function subsetFont() {
  const chars = [...new Set(picked.text.replace(/\s/g, "") + DATE + NAME)].join("");
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    + "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  const url = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&text="
    + encodeURIComponent(chars);
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  const out = [];
  for (const blk of css.split("@font-face").slice(1)) {
    const w = (blk.match(/font-weight:\s*(\d+)/) || [])[1] || "400";
    const u = (blk.match(/url\((https:[^)]+)\)/) || [])[1];
    if (!u) continue;
    const buf = Buffer.from(await (await fetch(u, { headers: { "User-Agent": UA } })).arrayBuffer());
    out.push(`@font-face{font-family:"Noto Sans TC";font-style:normal;font-weight:${w};`
      + `src:url(data:font/woff2;base64,${buf.toString("base64")}) format("woff2")}`);
  }
  if (!out.length) throw new Error("那份 CSS 裡沒有 woff2");
  return out.join("\n");
}
let fontCss = "";
try {
  fontCss = await subsetFont();
  console.log("字型：內嵌 Noto Sans TC（只含這張紙的 %d 個字，%s KB）",
    new Set(picked.text.replace(/\s/g, "")).size,
    (Buffer.byteLength(fontCss) / 1024).toFixed(0));
} catch (e) {
  console.log("⚠ 取不到 Noto Sans TC（%s）—— 這一份會用系統字型排，"
    + "Windows 上是微軟正黑體，和站上略有出入。", e.message);
}

/* ---- 5. 組出那一張 A4 --------------------------------------------------- */
function sheet(k) {
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<title>芳仁牙醫診所・約診提醒（A4）</title>
<!--
  櫃檯用的 A4：印出來拿給病人看「看診前會收到這一則」。
  由 node drafts/channels/remind-a4.mjs 產生，卡片整個抓自 /preview/line-remind/ 那一頁。
  這個檔不要手改 —— 要改內容改那一頁（或 reminder-card.json）再重跑。
-->
<style>
${fontCss}
${picked.css}
/* ---- 這一張紙自己的規則（排在規格頁那一份後面，靠順序決勝）-------------- */
html,body{background:#fff;padding:0;margin:0}
@page{size:A4 portrait;margin:0}
.sheet{width:${A4.w}mm;height:${A4.h}mm;margin:0 auto;background:#fff;
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.holder{width:${CARD_W}px;transform:scale(${k});transform-origin:center center}
/* 頭像：LINE 把圖卡的頭像擺在卡片**上面**（不是左邊）—— 見檔頭 ⑥ */
.a4-av{display:block;margin:0 0 ${AV_GAP}px ${AV_DX}px}
/* 卡片色壓在白紙上幾乎看不出邊，螢幕上那圈陰影又印不出來 —— 補一條很淡的框線 */
.holder .pv-hc{box-shadow:none;border:1px solid var(--rule)}
@media screen{body{background:#e9edf1;padding:16px 0}
  .sheet{box-shadow:0 2px 14px rgba(0,0,0,.18)}}
</style>
</head>
<body>
<div class="sheet"><div class="holder">${avatarSvg}${cardHtml}</div></div>
</body>
</html>`;
}

/* 第一趟：先用 1 倍量出卡片原生多高，再算放大倍率。
   ⚠ 倍率算完寫死進 CSS（這一頁因此**零 JS**）—— 交給瀏覽器現算的話，
     列印時的重排會讓它和我們量到的不是同一件事（門口那張 A4 踩過）。 */
fs.writeFileSync(OUT_HTML, sheet(1));
const p1 = await browser.newPage({ viewport: { width: Math.round(A4.w * MM), height: Math.round(A4.h * MM) } });
const e1 = [];
p1.on("pageerror", (e) => e1.push(String(e)));
await p1.goto("file://" + OUT_HTML);
await p1.evaluate(() => document.fonts.ready);
await p1.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
const nat = await p1.evaluate(() => {
  const r = document.querySelector(".holder").getBoundingClientRect();
  const c = document.querySelector(".pv-hc").getBoundingClientRect();
  const a = document.querySelector(".a4-av").getBoundingClientRect();
  return { w: r.width, h: r.height, ch: c.height,
    av: a.width, gap: c.top - a.bottom, dx: a.left - c.left };
});
await p1.close();
if (e1.length) throw new Error("A4 那一頁有 JS 錯誤：" + e1.join(" / "));

/* 定稿那張卡量到的是 268×585.9（規格頁）。差太多就是有人動過版面或字，要先看一眼。 */
const REF_H = NOHERO ? 585.9 - 134 : 585.9;
const off = Math.abs(nat.ch - REF_H) / REF_H;
console.log("卡片原生 %s×%s（定稿那張%s 268×%s，差 %s%%）",
  CARD_W.toFixed(1), nat.ch.toFixed(1), NOHERO ? "扣掉頭圖" : "", REF_H.toFixed(1),
  (off * 100).toFixed(1));
console.log("頭像 %spx・底緣離卡片上緣 %spx・左緣比卡片左 %spx（截圖量到 %s／%s／%s）",
  nat.av.toFixed(1), nat.gap.toFixed(1), (-nat.dx).toFixed(1), AV, AV_GAP, -AV_DX);
if (Math.abs(nat.av - AV) > 0.5 || Math.abs(nat.gap - AV_GAP) > 0.5
  || Math.abs(nat.dx - AV_DX) > 0.5) throw new Error("頭像的位置或大小和量到的對不上");
if (nat.gap < 0) throw new Error("頭像壓在卡片上了");
if (off > 0.08) throw new Error("卡片高度和定稿那張差太多，先去看一眼規格頁");

const availH = (A4.h - PAD * 2) * MM;
const availW = (A4.w - PAD * 2) * MM;
const k = Math.min(availH / nat.h, availW / nat.w);

/* 第二趟：寫死倍率，量一次真的擺上去之後四邊各剩多少，再出 PDF 與 PNG。 */
fs.writeFileSync(OUT_HTML, sheet(k));
const p2 = await browser.newPage({ viewport: { width: Math.round(A4.w * MM), height: Math.round(A4.h * MM) } });
const e2 = [];
p2.on("pageerror", (e) => e2.push(String(e)));
await p2.goto("file://" + OUT_HTML);
await p2.evaluate(() => document.fonts.ready);
await p2.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
const box = await p2.evaluate(() => {
  const s = document.querySelector(".sheet").getBoundingClientRect();
  const c = document.querySelector(".holder").getBoundingClientRect();
  const k2 = document.querySelector(".pv-hc").getBoundingClientRect();
  return { sw: s.width, sh: s.height, l: c.left - s.left, t: c.top - s.top,
    r: s.right - c.right, b: s.bottom - c.bottom, w: k2.width, h: k2.height };
});
if (e2.length) throw new Error("A4 那一頁有 JS 錯誤：" + e2.join(" / "));
const mm = (px) => px / MM;
console.log("紙上：卡片 %smm×%smm　留白 上%s 下%s 左%s 右%s（mm）",
  mm(box.w).toFixed(1), mm(box.h).toFixed(1), mm(box.t).toFixed(1),
  mm(box.b).toFixed(1), mm(box.l).toFixed(1), mm(box.r).toFixed(1));
if (Math.min(box.t, box.b, box.l, box.r) < PAD * MM - 2)
  throw new Error("卡片超出留白，紙上會被切到");

await p2.screenshot({ path: OUT_PNG, clip: { x: 0, y: 0, width: box.sw, height: box.sh }, scale: "css" });
await p2.pdf({ path: OUT_PDF, printBackground: true, preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await p2.close();
await browser.close();

/* ⚠ PDF 一定要只有一頁 —— 多一頁就是版面溢出了（PDF 的頁數在 trailer 的 /Count） */
const pdf = fs.readFileSync(OUT_PDF).toString("latin1");
const pages = Math.max(...[...pdf.matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]), 0);
if (pages !== 1) throw new Error("PDF 不是一頁，是 " + pages + " 頁");

console.log("放大 %s 倍　頭圖：%s　姓名那一格：%s　示範日期：%s",
  k.toFixed(3), NOHERO ? "不放" : "放", NAME || "不印", DATE);
console.log("好了：\n  %s\n  %s\n  %s",
  path.relative(ROOT, OUT_PDF), path.relative(ROOT, OUT_PNG), path.relative(ROOT, OUT_HTML));
