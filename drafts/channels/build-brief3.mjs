#!/usr/bin/env node
/* 給廠商的「9/21 回覆」→ preview/line-brief-0921/
 *
 * 2026-09-21 使用者：「針對連結資料廠商給的回覆如照片／預約成功通知已完成呈現並上線／
 *   約診記錄查詢除了廠商回覆和最近一次設計好的版本有落差外／另外約診狀態 廠商這次回覆
 *   和之前不一樣　廠商之前說診所端取消患者在手機上查詢就不會跳出約診　但這次卻說
 *   診所端取消　患者手機上還查得到且顯示已取消／整理好回覆頁面」
 *
 * ⚠⚠⚠ **編號一個都不換**（同 9/14 與 9/18 那兩版）：這一輪接在 3-6 後面 ＝ 3-7 ~ 3-11。
 *   「3」與「4」仍然是 9/14 那兩件 —— 那是雙方共用的詞，重編會讓兩邊的信對不起來。
 *
 * ⚠⚠ 一個字都不重打：
 *   ・3-3／3-4／3-5 的規格、四個值與什麼時候　→ brief.json（9/14 那一版）。
 *   ・四個值的色碼、卡上那幾行、兩則的寬度、內距　→ build-vendor.mjs。
 *   ・帶子幾顆、兩張 PNG 的幾何　→ single-card.mjs。
 *
 * ⚠⚠⚠ **對比度與 CSS px 一律現算**：色碼哪天改了，這一頁要跟著動，
 *   不可以靜靜地印著一個過期的數字。截圖上量到的位置寫在 brief3.json 的「量」，
 *   單位是**截圖的像素**；比例尺自己也是量出來的（見底下那一段）。
 *
 * ⚠ 圖只有三個，都是 9/21 這一輪新拿到的（整張回覆 ＋ 兩張裁出來的卡）；
 *   帶子與定稿的卡一律引用隔壁資料夾那一份。零 JS。
 *
 * 跑完驗：node drafts/channels/check-brief3.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS, esc, b, DATE, 設節表,
  MEGA, BUB, WCARD, CARD, PILLVAL,
} from "./build-vendor.mjs";
import { 定顆, 帶by, 卡, 輪播行, 帶高, 顆高, 基註, 套註, 藥丸 } from "./single-card.mjs";

/* 這一頁不用「見第 N 節」那種記號 —— 一被用到就 throw。 */
設節表({});

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-brief-0921");
const B1 = JSON.parse(readFileSync(join(HERE, "brief.json"), "utf8"));   /* 9/14 那一版的文字 */
const B = JSON.parse(readFileSync(join(HERE, "brief3.json"), "utf8"));   /* 這一輪新寫的 */
const 前綴 = "../line-single-card/";
const 帶檔 = { mega: "band-18-set.png", car: "band-13-set.png" };

/* ── 對比度：現算，不要寫死 ─────────────────────────────────── */
const 相對亮度 = (h) => {
  const m = /^#([0-9a-f]{6})$/i.exec(h);
  if (!m) throw new Error(`不是六位的色碼：${h}`);
  const c = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const 對比 = (a, z) => {
  const [x, y] = [相對亮度(a), 相對亮度(z)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const 比 = (a, z) => 對比(a, z).toFixed(2);

/* ── 比例尺：截圖上的 1px 等於手機上幾個 CSS px ──────────────────
   ⚠⚠ 不可以用「假設卡片是 micro」倒推 —— 那正是底下要下的結論之一，會變成循環論證。
   拿「約診狀態」那四個字量：它們是 `xs`，而中日韓的字**一個字的進位就等於字級**，
   所以進位除以 xs 的 px 就是比例尺。量到的另外兩個進位（日期與姓名）拿來當交叉驗證。 */
const LINE字級 = { xs: 13, sm: 14, md: 16, lg: 19 };
const M = B.量;
const 比例尺 = M.標籤進位 / LINE字級.xs;
const CSSpx = (px) => px / 比例尺;
for (const [名, 進位, 該] of [["日期", M.日期進位, LINE字級.lg], ["姓名", M.姓名進位, LINE字級.md]]) {
  const 量 = 進位 / 比例尺;
  if (Math.abs(量 - 該) / 該 > 0.05)
    throw new Error(`${名}那一行量到 ${量.toFixed(1)}px，規格是 ${該}px —— 比例尺或規格有一個不對`);
}
const 卡寬截圖 = M.卡[0][1] - M.卡[0][0] + 1;
if (卡寬截圖 !== M.卡[1][1] - M.卡[1][0] + 1) throw new Error("兩張卡在截圖上不一樣寬");
const 卡寬 = CSSpx(卡寬截圖);
if (Math.abs(卡寬 - BUB.car) / BUB.car > 0.05)
  throw new Error(`卡片量到 ${卡寬.toFixed(1)}px，規格 ${BUB.階} 是 ${BUB.car}px —— 差太多，不要說它換好了`);

/* ── 帶子：量到的和「照規格畫」算出來的要對得上 ─────────────────── */
const 帶 = 帶by[帶檔.car];
if (!帶) throw new Error(`single-card.mjs 沒有產 ${帶檔.car}`);
if (帶.B.顆數 !== 定顆.car) throw new Error(`${帶檔.car} 是 ${帶.B.顆數} 顆，該是 ${定顆.car} 顆`);
if (M.帶顆數 !== 定顆.car) throw new Error(`截圖上掃到 ${M.帶顆數} 顆，帶子是 ${定顆.car} 顆`);
const 帶墨寬 = CSSpx(M.帶墨[1] - M.帶墨[0] + 1);
const 帶留白 = CSSpx(M.帶墨[0] - M.卡[0][0]);
const 帶墨高 = CSSpx(M.帶墨高);
const 帶右留白 = CSSpx(M.卡[0][1] - M.帶墨[1]);
/* ⚠⚠ 「帶子是滿版的」這一句要用數字證明，不要用看的：
   左右兩端的留白一樣（＝圖檔自己的留白沒有被切掉），而且**墨寬 ＋ 兩邊的留白 ＝ 卡片寬**
   —— 這兩件同時成立，那張圖才真的是畫在卡片的整個寬度上（size: full ＋ paddingAll 0）。 */
if (Math.abs(帶留白 - 帶右留白) > 1) throw new Error(`帶子左右不對稱（${帶留白.toFixed(1)}／${帶右留白.toFixed(1)}）—— 它被裁過`);
if (Math.abs(帶墨寬 + 帶留白 + 帶右留白 - 卡寬) > 1.5)
  throw new Error(`帶子沒有滿版：墨 ${帶墨寬.toFixed(1)} ＋ 留白 ${(帶留白 + 帶右留白).toFixed(1)} ≠ 卡片 ${卡寬.toFixed(1)}`);
if (帶墨高 > 帶高(帶, 卡寬)) throw new Error(`帶子的墨 ${帶墨高.toFixed(1)}px，比整張圖 ${帶高(帶, 卡寬).toFixed(1)}px 還高`);

/* ── 那一列量到的幾個距離 ───────────────────────────────────── */
const 丸距 = CSSpx(M.丸[0] - M.標籤[1] - 1);
const 丸右 = CSSpx(M.卡[1][1] - M.丸[1]);
/* ⚠ 這兩個量到的是**字的墨**離卡片邊多遠，不是 padding 本身（字身自己還有側邊留白，
   而且日期是 19px、標籤是 13px，兩者的側邊留白不一樣大）。所以頁面上只印**兩塊的差**，
   不要拿其中一個去和規格的 14px 比 —— 那會多算一個字身的留白進去。 */
const 下字緣 = CSSpx(M.標籤[0] - M.卡[1][0]);
const 上字緣 = CSSpx(M.日期墨[0] - M.卡[1][0]);
const 內距差 = 上字緣 - 下字緣;

/* ── 三之九那兩條路要用到的顏色：從 PILLVAL 現拿，不在這裡重打 ──────── */
const by名 = (n) => {
  const v = PILLVAL.find((x) => x.名 === n);
  if (!v) throw new Error(`PILLVAL 裡沒有「${n}」—— 四個值改名了`);
  return v;
};
const 已排定 = by名("已排定"), 琥珀 = by名("未回覆").色;
const 丸底色 = 已排定.色;
/* 統一套的那顆藍是從截圖取樣的，和「已排定」不是同一個來源 —— 差太多就不要說它們是同一色。 */
const 差 = (a, z) => [0, 2, 4].reduce((s, i) =>
  s + Math.abs(parseInt(a.slice(1 + i, 3 + i), 16) - parseInt(z.slice(1 + i, 3 + i), 16)), 0);
if (差(M.藥丸底色, 丸底色) > 6)
  throw new Error(`截圖取樣 ${M.藥丸底色} 和「已排定」${丸底色} 差太多，不要說它們是同一色`);
/* 「未回覆」在白底上的字階：PALETTE.md 第二節第十一輪那一排的深階字（兒牙 1a）。 */
const 琥珀字階 = "#9e6301";
if (對比(琥珀, "#ffffff") >= 4.5) throw new Error("琥珀在白底上已經過了 4.5，乙那一條不必換色了");
if (對比(琥珀字階, "#ffffff") < 4.5) throw new Error("換上去的字階在白底上也沒有過 4.5");
const 乙字 = (v) => (v.名 === "未回覆" ? 琥珀字階 : v.色);
for (const v of PILLVAL)
  if (對比(乙字(v), WCARD) < 4.5) throw new Error(`乙那一條：「${v.名}」${乙字(v)} 在卡片底上只有 ${比(乙字(v), WCARD)}`);
if (對比("#ffffff", 丸底色) < 4.5) throw new Error("甲那一條：白字在那顆藍上沒有過 4.5");

/* ── brief3.json 裡的 {{…}} ─────────────────────────────────── */
const V = {
  顆數: String(定顆.car), 單張顆數: String(定顆.mega), 階: BUB.階,
  卡寬: 卡寬.toFixed(1), 規格卡寬: String(BUB.car), 規格內距: String(CARD.pad),
  帶留白: 帶留白.toFixed(1), 帶高: 帶高(帶, 卡寬).toFixed(1), 帶比: `${帶.w}:${帶.h}`,
  丸距: 丸距.toFixed(1), 丸右: 丸右.toFixed(1), 內距差: 內距差.toFixed(1),
  現日期: DATE.廠商, 定日期: DATE.例,
  丸底: M.藥丸底色, 丸底色: 丸底色, 已排定色: 已排定.色,
  紅對藍: 比(by名("已取消").色, 丸底色), 綠對藍: 比(by名("已確認").色, 丸底色),
  琥珀對藍: 比(琥珀, 丸底色), 白對藍: 比("#ffffff", 丸底色),
  琥珀: 琥珀, 琥珀對白: 比(琥珀, WCARD), 琥珀字階: 琥珀字階, 琥珀字階對白: 比(琥珀字階, WCARD),
};
const fill = (t) => String(t).replace(/\{\{([^}]+)\}\}/g, (_, k) => {
  if (!(k in V)) throw new Error(`brief3.json 用到不存在的值 {{${k}}}`);
  return V[k];
});
const bb = (t) => b(fill(t));
const list = (rows) => `<ul class="spec">${rows.map((t) => `<li>${bb(t)}</li>`).join("\n")}</ul>`;
const h3 = (id, t, sub = "") => `<h3 class="h3" id="${id}">${esc(t)}${sub ? `<span class="t">${esc(sub)}</span>` : ""}</h3>`;

/* ── 圖：現場讀檔頭，不寫死 ─────────────────────────────────── */
const sizeOf = (rel) => {
  const f = join(OUT, rel);
  if (!existsSync(f)) throw new Error(`找不到圖：${rel}`);
  const x = readFileSync(f);
  if (x[0] === 0x89 && x[1] === 0x50) return [x.readUInt32BE(16), x.readUInt32BE(20)];
  for (let i = 2; i < x.length - 9;) {
    if (x[i] !== 0xff) { i++; continue; }
    const m = x[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return [x.readUInt16BE(i + 7), x.readUInt16BE(i + 5)];
    i += 2 + x.readUInt16BE(i + 2);
  }
  throw new Error(`${rel} 讀不出尺寸`);
};
const img = (rel, alt) => {
  const [w, h] = sizeOf(rel);
  return `<img src="${rel}" width="${w}" height="${h}" loading="lazy" alt="${esc(alt)}">`;
};
if (sizeOf(B.量.截圖)[0] !== B.量.截圖寬)
  throw new Error(`截圖實際是 ${sizeOf(B.量.截圖)[0]}px 寬，「量」那一段寫的是 ${B.量.截圖寬}`);

/* ── 卡片：定稿的畫法（畫在量到的那個寬度上，才和截圖比得起來） ───────── */
const 卡格 = (html, 說) => `<figure class="swrap">${html}<figcaption>${說}</figcaption></figure>`;
const 查詢卡 = (丸) => 卡(BUB.car, 輪播行, { 帶檔: 帶檔.car, 丸, 折: true, 前綴 });
/* 乙那一條：把藥丸的底拿掉、字換成套色 —— 用換的，不要另外抄一份卡片的畫法。
   換不到就 throw（藥丸的畫法哪天改了，這裡要當場停下來，不要靜靜地畫出一顆有底的）。 */
const 去底 = (html, v) => {
  const 找 = `<span class="pill" style="background:${v.色}">`;
  if (!html.includes(找)) throw new Error(`卡上找不到「${v.名}」那顆藥丸 —— 藥丸的畫法改了`);
  return html.replace(找, `<span class="pill bare" style="color:${乙字(v)}">`);
};
const 丸樣 = (v, 色) => `<span class="pill" style="background:${色}">${esc(v.名)}</span>`;
const 字樣 = (v) => `<span class="pill bare" style="color:${乙字(v)}">${esc(v.名)}</span>`;

const CSS3 = `
/* 號碼是 CSS 的 counter 畫的，**兩層都要自己設起點**：外層從 2 起跳（第一個
   counter-increment 把它加成 3）、子層從 6 起跳（加成 3-7）。
   li 的 value 屬性對 counter 一點作用都沒有 —— 只寫 value 的話 HTML 看起來對，
   畫出來仍然是 1、2 與 1-7（這一輪又踩了一次，外層漏設）。
   這一段在樣板字串裡面，所以註解裡不可以出現反引號。 */
.now>ol{counter-reset:n 2}
.now ol.sub{counter-reset:m 6}
.h3 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.2em}
.shot{margin:.9em 0 0}
.shot img{display:block;width:100%;max-width:520px;height:auto;border-radius:10px;background:var(--card)}
.shot figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.4em;max-width:520px}
.sbs{display:flex;flex-wrap:wrap;gap:18px 16px;margin:1em 0 0;align-items:flex-start}
.sbs figure{margin:0}
/* 裁出來的那兩張卡是 327px 寬的實檔 —— 不收的話 320 那一格整頁會橫著捲（踩過）。 */
.sbs figure>img{display:block;width:210px;max-width:100%;height:auto;border-radius:10px}
.sbs figcaption{font-size:.78rem;color:var(--soft);line-height:1.6;margin-top:.35em;max-width:230px}
.sbs figcaption b{color:var(--ink)}
.swrap{margin:0}
.sgl{overflow:hidden;box-sizing:content-box}
.sgl.car .cb p{white-space:pre-line}
.sgl .bnd{display:block;width:100%;height:auto}
.sgl .cb.bot>:first-child{margin-top:0}
.swrap figcaption{font-size:.78rem;color:var(--soft);line-height:1.6;margin-top:.35em;max-width:230px}
.stcard .pill.bare{background:none;padding-left:0;padding-right:0}
.quo{margin:.6em 0 0;padding:.05em 0 .05em .9em;border-left:3px solid var(--rule)}
.quo p{font-size:.9rem;line-height:1.85;margin:.45em 0 0}
.quo p:first-child{margin-top:0}
.fin{background:#eef1ee;border:1px solid var(--rule);border-radius:10px;padding:.7em .9em;margin:.9em 0 0}
.fin .k{font-size:.82rem;font-weight:600;color:var(--soft);margin:0 0 .3em}
.way{background:var(--card);border-radius:11px;padding:13px 15px;margin:.9em 0 0}
.way .t{font-size:.95rem;font-weight:600;margin:0 0 .2em}
.tab td .pill{display:inline-block;border-radius:8.5px;line-height:1;
  padding:.42em .63em .38em;color:#fff;font-weight:700;font-size:${CARD.籤}px}
.tab td .pill.bare{background:none;padding-left:0;padding-right:0}
.gap{font-size:.9rem;margin:.35em 0 0}
.gap .s{display:block;color:var(--soft);font-size:.85rem;margin-top:.25em}
`;

const 對上 = B.三之八.對上.map((t) => `<li>${bb(t)}</li>`).join("\n");
const 還差 = B.三之八.還差.map(([k, v, s]) => `<div class="row"><p class="k">${bb(k)}</p>
<p class="gap">${bb(v)}${s ? `<span class="s">${bb(s)}</span>` : ""}</p></div>`).join("\n");

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 9/21 的回覆與規格</title>
<style>
${CSS}${CSS3}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 官方帳號　9/21 的回覆與規格</h1>
<p class="lede">芳仁牙醫診所　更新於 ${esc(B.更新日)}<br>
${bb(B.抬頭)}<br>
卡片的模擬圖一律畫成病人手機上的寬度（輪播 ${BUB.階} 約 ${BUB.car}px）。</p>

<div class="now">
<b>這一頁</b>
<ol>
<li value="3"><p class="t">約診通知與紀錄查詢版面</p>
<ol class="sub">
<li value="7"><a href="#s3-7">9/21 收到的</a></li>
<li><a href="#s3-8">對上了什麼、還差什麼</a></li>
<li><a href="#s3-9">底色只有一個的話，那四個值怎麼分</a></li>
<li><a href="#s3-10">約診狀態：兩次的回覆不一樣</a></li>
<li><a href="#s3-11">診所這一側看到的：在樂衍上刪除，那一筆就不會顯示</a></li>
<li><a href="#s3-12">請翔評回覆的五題</a></li>
</ol></li>
<li value="4"><p class="t">綁定成功的自動回覆設定</p>
<p class="d">還沒有新的回覆，內容在 <a href="/preview/line-brief-0918/#s4">9/18 那一頁</a>。</p></li>
</ol>
</div>

<h2 class="h2" id="s3">3　約診通知與紀錄查詢版面<span class="t">9/21 的回覆</span></h2>

${h3("s3-7", B.三之七.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.三之七.導)}</p>
<div class="quo">${B.三之七.翔評.map((t) => `<p>${b(t)}</p>`).join("\n")}</div>
<figure class="shot">${img(B.量.截圖, "翔評 9/21 送來的約診紀錄查詢")}
<figcaption>${bb(B.三之七.圖說)}</figcaption></figure>

${h3("s3-8", B.三之八.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.三之八.導)}</p>
<div class="sbs">
<figure>${img("shot-0921-cancel.jpg", "翔評 9/21 的約診紀錄查詢，取消的那一張")}
<figcaption><b>翔評 9/21</b>　取消的那一張（紅字是翔評標的）</figcaption></figure>
${卡格(查詢卡(by名("已取消")), `<b>定稿</b>　3-3 ＋ 3-4 ＋ 3-5 那一版（值收成「已取消」、日期的順序調過、藥丸貼著標籤）`)}
</div>
<h4 class="h4">對上的</h4>
<ul class="spec">
${對上}
</ul>
<p class="note">${bb(B.三之八.對上註)}</p>
<h4 class="h4">還差的</h4>
<div class="rows">
${還差}
</div>

${h3("s3-9", B.三之九.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.三之九.導)}</p>
<div class="sbs">
<figure>${img("shot-0921-wait.jpg", "翔評 9/21 的約診紀錄查詢，尚未回覆的那一張")}
<figcaption>${bb(B.三之九.圖說)}</figcaption></figure>
</div>
${list(B.三之九.事實)}
<p class="note">${bb(B.三之九.路導)}</p>
<div class="way"><p class="t">${bb(B.三之九.甲.標)}</p>${list(B.三之九.甲.點)}</div>
<div class="way"><p class="t">${bb(B.三之九.乙.標)}</p>${list(B.三之九.乙.點)}</div>
<div class="tabw"><table class="tab tabv"><thead><tr>${B.三之九.表頭.map((t) => `<th>${esc(t)}</th>`).join("")}</tr></thead><tbody>
${B1.s3.三之四.值.map(([名, 時]) => {
  const v = by名(名);
  return `<tr><td>${esc(名)}</td><td>${esc(時)}</td>
<td>${丸樣(v, 丸底色)}<br><code>${丸底色}</code> ＋ 白字 ${比("#ffffff", 丸底色)}</td>
<td>${字樣(v)}<br><code>${乙字(v)}</code>　${比(乙字(v), WCARD)}</td></tr>`;
}).join("\n")}
</tbody></table></div>
<div class="sbs">
${卡格(查詢卡({ 名: "已取消", 色: 丸底色 }), `<b>甲</b>　底統一 <code>${丸底色}</code>、白字`)}
${卡格(去底(查詢卡(by名("已取消")), by名("已取消")), `<b>乙</b>　沒有底、字用 <code>${by名("已取消").色}</code>`)}
</div>
<p class="note">${bb(B.三之九.尾)}</p>

${h3("s3-10", B.三之十.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.三之十.導)}</p>
<div class="rows">
${B.三之十.兩次.map(([誰, 句, 讀]) => `<div class="row"><p class="k">${esc(誰)}</p>
<div class="quo"><p>${b(句)}</p></div>
<p class="gap">${bb(讀)}</p></div>`).join("\n")}
</div>
<div class="fin"><p class="k">為什麼要先確認這一件 —— 底下三件都跟著它走</p>
<ul class="spec">${B.三之十.跟著.map((t) => `<li>${bb(t)}</li>`).join("\n")}</ul></div>

<p class="note">${bb(B.三之十.接)}</p>

${h3("s3-11", B.三之十一.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.三之十一.導)}</p>
${list(B.三之十一.事實)}
<div class="fin"><p class="k">請翔評確認的</p>
<p style="font-size:.9rem;margin:0">${bb(B.三之十一.問)}</p></div>
<p class="note">${bb(B.三之十一.接)}</p>

${h3("s3-12", B.三之十二.標)}
<ol class="ask">
${B.三之十二.題.map(([q, y]) => `<li>${bb(q)}<span class="y">${bb(y)}</span></li>`).join("\n")}
</ol>

<h2 class="h2" id="s5">已完成<span class="t">這一輪</span></h2>
${h3("s5-1", B.完成.標)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.完成.說)}</p>
<div class="sbs">
${卡格(卡(BUB.mega, MEGA, { 帶檔: 帶檔.mega, 前綴 }),
  `<b>${esc(B.完成.圖說)}</b>　${定顆.mega} 顆・帶子 ${帶高(帶by[帶檔.mega], BUB.mega).toFixed(1)}px 高`
  + `（最高那一顆 ${顆高(帶by[帶檔.mega], BUB.mega).toFixed(1)}px）<br>${esc(基註(帶by[帶檔.mega].B))}<br>${esc(套註(帶by[帶檔.mega].B))}`)}
</div>

<p class="foot">
${bb(B.尾)}<br>
上一版（9/18）：<a href="/preview/line-brief-0918/">/preview/line-brief-0918/</a><br>
七則訊息的文字、圖檔網址與 Flex JSON：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

/* 同 9/14 與 9/18 那兩版：整頁一次換稱謂。「」裡是別人自己寫的原文，不可以動。 */
const 稱謂 = (t) => t.split(/(「[^」]*」)/).map((seg, i) =>
  i % 2 ? seg : seg.replace(/你們/g, "翔評").replace(/我們/g, "診所")).join("");
const out = 稱謂(html);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), out);
console.log(`✓ preview/line-brief-0921/index.html　${(out.length / 1024).toFixed(1)}KB`);
console.log(`  比例尺　截圖 1px ＝ 手機 ${(1 / 比例尺).toFixed(3)} CSS px（從「約診狀態」那四個 xs 的字量的）`);
console.log(`  卡片　量到 ${卡寬.toFixed(1)}px，規格 ${BUB.階} ${BUB.car}px`);
console.log(`  帶子　量到 ${M.帶顆數} 顆・墨 ${帶墨寬.toFixed(1)}px 寬・左右留白 ${帶留白.toFixed(1)}／${帶右留白.toFixed(1)}px・墨高 ${帶墨高.toFixed(1)}px`);
console.log(`  那一列　標籤到藥丸 ${丸距.toFixed(1)}px・藥丸右緣到卡片邊 ${丸右.toFixed(1)}px・兩塊的字緣差 ${內距差.toFixed(1)}px`);
console.log(`  對比　紅字對統一藍底 ${V.紅對藍}／白字對它 ${V.白對藍}`);
