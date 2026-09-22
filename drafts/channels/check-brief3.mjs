#!/usr/bin/env node
// 守門：9/21 那一版「給廠商的回覆」（preview/line-brief-0921/）
//
//  ① 重跑 build-brief3.mjs、逐位比對
//  ② noindex 三個關鍵字　③ 零 JS　④ 紅線（「隨時問」那一類）
//  ⑤ 不准出現 undefined，也不准留著沒換掉的 {{…}}
//     （這一頁不印 Flex JSON，所以連那五個要廠商填的值都不該出現）
//  ⑥ 不可以出現完整的手機號碼（repo 是公開的）
//  ⑦ 圖：找得到、width/height ＝ 實檔、有 alt；資料夾裡只准有 index.html ＋ 9/21 那三個檔
//  ⑧ ⚠⚠ **編號沒有重編**：這一輪是 3-7 ~ 3-12（3-9 底下再拆 3-9-1 ~ 3-9-4）；
//     摘要表每一列的錨點都要指得到頁內真的存在的 id
//  ⑨ 翔評 9/21 那三句逐字，而且是**引號裡的原文**（不可以順手改標點）
//  ⑩ ⚠⚠⚠ 對比度不可以寫死：頁面上每一個「x.xx」都要和現算的對得起來
//  ⑪ 四個值與它們的色碼出自 PILLVAL；乙那一條的四個字色都要過 4.5
//  ⑫ 量到的數字要自洽：卡片 ≈ micro、帶子滿版（墨 ＋ 左右留白 ＝ 卡片寬）
//  ⑬ 站內連結指得到（9/18 那一頁的 #s4、line-spec）
//  ⑯ ⚠⚠ 資深 PM 的形狀（TEAM.md 第一節那四條）：摘要表在最前面；每一個項目都是
//     問題／事件／解決方案三格，一格都不准少（沒答案就寫「待○○回覆」，不留白）
//  ⑮ ⚠⚠⚠ 3-11 的「刪除」與「取消」是**兩個不一樣的詞**，不可以被順手統一掉
//     （統一掉那一節就什麼都沒說了 —— 整件事就是在問這兩顆是不是同一顆按鈕）
//  ⑭ ⚠⚠ 不可以替診所答應任何事：頁面上不准出現「診所接受」這一類的話
//     （日期那一項到底收不收，是使用者要決定的，不是這一頁）
// ⚠ 版面（水平溢出）另外用瀏覽器量過：320／375／390／430／768／1024 六個寬度都是 0。
import fs from "node:fs";
import { esc } from "./build-vendor.mjs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-brief-0921");
const PAGE = path.join(DIR, "index.html");
const bad = [];
const ok = (m) => console.log("  ✓ " + m);
const has = (p) => bad.some((x) => x.startsWith(p));

/* ① */
const before = fs.readFileSync(PAGE);
execFileSync("node", [path.join(HERE, "build-brief3.mjs")], { stdio: "pipe" });
if (!before.equals(fs.readFileSync(PAGE))) bad.push("① 重跑之後頁面變了");
if (!has("①")) ok("① 重跑 build-brief3.mjs 逐位相同");
const html = fs.readFileSync(PAGE, "utf8");
const 本文 = html.replace(/<style>[\s\S]*?<\/style>/g, "");
/* 3-13 那兩份 Flex JSON 本來就帶著 {{…}}（要交給翔評填的值），⑤ 掃之前剝掉。 */
const 無JSON = 本文.replace(/<pre class="json">[\s\S]*?<\/pre>/g, "");

/* ② ③ ④ */
for (const w of ["noindex", "nofollow", "noarchive"]) if (!html.includes(w)) bad.push(`② 少了 ${w}`);
if (!has("②")) ok("② noindex");
if (/<script/i.test(html) || /\son[a-z]+="/i.test(html)) bad.push("③ 這一頁不該有 JS");
else ok("③ 零 JS");
const red = ["隨時問", "隨時詢問", "即時回覆您", "有問題歡迎私訊", "小編"].filter((w) => html.includes(w));
if (red.length) bad.push(`④ 紅線：${red.join("、")}`); else ok("④ 紅線 0");

/* ⑤ ⑥ */
if (本文.includes("undefined")) bad.push("⑤ 出現 undefined");
const left = [...new Set(無JSON.match(/\{\{[^}]*\}\}/g) || [])];
if (left.length) bad.push(`⑤ 還留著沒換掉的記號：${left.join("、")}`);
if (!has("⑤")) ok("⑤ 沒有 undefined，也沒有沒換掉的記號");
if (/09\d{8}/.test(html)) bad.push("⑥ 出現完整的手機號碼"); else ok("⑥ 沒有完整的手機號碼");

/* ⑦ */
const sizeOf = (f) => {
  const b = fs.readFileSync(f);
  if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  for (let i = 2; i < b.length - 9;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};
const 自家 = ["reply-0921-query.jpg", "shot-0921-cancel.jpg", "shot-0921-wait.jpg", "ref-0922-doctor.jpg"];
let imgs = 0;
for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) {
  const src = (tag.match(/src="([^"]+)"/) || [])[1];
  const w = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
  const h = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
  if (!/alt="[^"]+"/.test(tag)) bad.push(`⑦ ${src} 沒有 alt`);
  if (!src || !(src.startsWith("../") || 自家.includes(src))) { bad.push(`⑦ ${src} 不是自家的也不是隔壁的`); continue; }
  const f = path.resolve(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`⑦ 找不到圖：${src}`); continue; }
  const s = sizeOf(f);
  if (!s || s[0] !== w || s[1] !== h) bad.push(`⑦ ${src} 宣告 ${w}×${h}，實檔 ${s}`);
  imgs++;
}
for (const f of fs.readdirSync(DIR))
  if (f !== "index.html" && !(自家.includes(f) && html.includes(f))) bad.push(`⑦ 資料夾裡多了 ${f}`);
for (const f of 自家) if (!html.includes(f)) bad.push(`⑦ ${f} 沒有被用到`);
if (!has("⑦")) ok(`⑦ 圖 ${imgs} 張，尺寸與 alt 都對，資料夾裡沒有多餘的檔`);

/* ⑧ 編號：節號在、不重編，而且摘要表每一列都連得到。
   ⚠ 號碼**不可以交給 CSS 的 counter 畫**（9/21 之前那一版就是，li 的 value 對 counter
   沒有作用，外層漏設 counter-reset 就靜靜地印成 1-7）—— 現在全部是寫死的字。 */
const 節號 = ["3-7", "3-8", "3-9", "3-9-1", "3-9-2", "3-9-3", "3-9-4", "3-10", "3-11", "3-12", "3-13"];
for (const n of 節號) if (!本文.includes(`${n}　`)) bad.push(`⑧ 找不到節號 ${n}`);
for (const n of ["3-1　", "3-2　", "3-3　", "3-4　", "3-5　", "3-6　"])
  if (本文.includes(n)) bad.push(`⑧ 這一頁不該自己開 ${n.trim()} 那一節（它在 9/18 那一頁）`);
/* 共用的 CSS 裡本來就有 .now 那一族的 counter 規則（別頁在用），所以掃樣式表沒有意義 ——
   要驗的是**這一頁有沒有用到它**：節號一律是寫死的字，頁上不可以出現那一塊。 */
if (/class="now"/.test(本文)) bad.push("⑧ 又把號碼交給 CSS 的 counter 畫了（.now 那一塊）");
for (const [, href] of html.matchAll(/href="#([^"]+)"/g))
  if (!html.includes(`id="${href}"`)) bad.push(`⑧ 摘要表連到 #${href}，頁內沒有這個 id`);
if (!has("⑧")) ok(`⑧ 節號 ${節號.length} 個都在（3-7 ~ 3-13），頁內連結都指得到`);

/* ⑨ 翔評 9/21 那三句逐字 */
const B = JSON.parse(fs.readFileSync(path.join(HERE, "brief3.json"), "utf8"));
const escH = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
for (const q of B.三之七.翔評) if (!html.includes(escH(q))) bad.push(`⑨ 對不上原文：${q}`);
for (const [, 句] of B.三之十.兩次) if (!html.includes(escH(句))) bad.push(`⑨ 對不上原文：${句}`);
if (!has("⑨")) ok("⑨ 翔評 9/21 那三句 ＋ 9/10 那一句，逐字");

/* ⑩ ⑪ 對比度現算，和頁面上印的每一個數字比對 */
const { PILLVAL, WCARD } = await import("./build-vendor.mjs");
const 亮 = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const CR = (a, z) => { const [x, y] = [亮(a), 亮(z)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const 藍 = PILLVAL.find((v) => v.名 === "已排定").色;
const 乙色 = (v) => (v.名 === "未回覆" ? "#9e6301" : v.色);
const 該有 = new Set([CR("#ffffff", 藍), ...PILLVAL.map((v) => CR(v.色, 藍)),
  ...PILLVAL.map((v) => CR(乙色(v), WCARD)), CR(PILLVAL.find((v) => v.名 === "未回覆").色, WCARD)]
  .map((x) => x.toFixed(2)));
for (const [, n] of 本文.matchAll(/(?<![\d.])(\d\.\d\d)(?![\d])/g))
  if (!該有.has(n) && n !== "4.50") bad.push(`⑩ 頁面上的 ${n} 和現算的對不起來`);
if (!has("⑩")) ok(`⑩ 頁面上的對比度都是現算的（${[...該有].sort().join("、")}）`);
for (const v of PILLVAL) {
  if (!本文.includes(v.名)) bad.push(`⑪ 四個值裡少了「${v.名}」`);
  if (CR(乙色(v), WCARD) < 4.5) bad.push(`⑪ 乙那一條「${v.名}」只有 ${CR(乙色(v), WCARD).toFixed(2)}`);
}
if (CR("#ffffff", 藍) < 4.5) bad.push("⑪ 甲那一條的白字沒有過 4.5");
if (!has("⑪")) ok("⑪ 四個值出自 PILLVAL；甲與乙兩條路的每一個字色都過 4.5");

/* ⑫ 量到的數字要自洽 */
const M = B.量;
const 比例尺 = M.標籤進位 / 13;
const px = (n) => n / 比例尺;
const 卡寬 = px(M.卡[0][1] - M.卡[0][0] + 1);
const { BUB } = await import("./build-vendor.mjs");
if (Math.abs(卡寬 - BUB.car) > BUB.car * 0.05) bad.push(`⑫ 卡片量到 ${卡寬.toFixed(1)}，規格 ${BUB.car}`);
const 墨 = px(M.帶墨[1] - M.帶墨[0] + 1);
const 左 = px(M.帶墨[0] - M.卡[0][0]), 右 = px(M.卡[0][1] - M.帶墨[1]);
if (Math.abs(左 - 右) > 1) bad.push(`⑫ 帶子左右不對稱 ${左.toFixed(1)}／${右.toFixed(1)}`);
if (Math.abs(墨 + 左 + 右 - 卡寬) > 1.5) bad.push("⑫ 帶子沒有滿版");
if (!本文.includes(卡寬.toFixed(1))) bad.push(`⑫ 頁面上沒有印出量到的卡片寬 ${卡寬.toFixed(1)}`);
if (!has("⑫")) ok(`⑫ 卡片 ${卡寬.toFixed(1)}px ≈ ${BUB.階} ${BUB.car}px；帶子滿版（${墨.toFixed(1)} ＋ ${(左 + 右).toFixed(1)}）`);

/* ⑬ */
for (const u of ["/preview/line-brief-0918/", "/preview/line-spec/"]) {
  if (!html.includes(u)) { bad.push(`⑬ 少了連到 ${u} 的連結`); continue; }
  if (!fs.existsSync(path.join(ROOT, u.replace(/^\/|\/$/g, ""), "index.html"))) bad.push(`⑬ ${u} 不存在`);
}
if (!fs.readFileSync(path.join(ROOT, "preview", "line-brief-0918", "index.html"), "utf8").includes('id="s4"'))
  bad.push("⑬ 9/18 那一頁沒有 #s4 這個錨點");
if (!has("⑬")) ok("⑬ 站內連結都指得到");

/* ⑭ ⚠⚠ 不可以替診所答應任何事 —— 日期那一項收不收是使用者要決定的 */
const 越權 = ["診所接受現況", "診所已經接受", "我們接受現況", "就照現況", "診所同意"]
  .filter((w) => 本文.includes(w));
if (越權.length) bad.push(`⑭ 頁面替診所答應了：${越權.join("、")}`);
else ok("⑭ 沒有替診所答應任何事（日期那一項留給使用者決定）");

/* ⑮ */
{
  const 節 = 本文.split("3-11　")[1]?.split("3-12　")[0] || "";
  if (!節) bad.push("⑮ 切不出 3-11 那一節");
  else {
    const 刪 = (節.match(/刪除/g) || []).length, 取 = (節.match(/取消/g) || []).length;
    if (刪 < 3) bad.push(`⑮ 3-11 只出現 ${刪} 次「刪除」—— 它被統一成「取消」了`);
    if (取 < 3) bad.push(`⑮ 3-11 只出現 ${取} 次「取消」—— 它被統一成「刪除」了`);
    if (!節.includes("兩顆不同的按鈕")) bad.push("⑮ 3-11 沒有把「兩顆不同的按鈕」那一句講出來");
  }
}
if (!has("⑮")) ok("⑮ 3-11 的「刪除」與「取消」兩個詞都還在，沒有被統一掉");

/* ⑯ */
{
  const items = [...html.matchAll(/<div class="item">([\s\S]*?)\n<\/div>/g)].map((m) => m[1]);
  if (items.length < 7) bad.push(`⑯ 只找到 ${items.length} 個三格項目，該有 7 個（3-9 的四項 ＋ 3-10 ＋ 3-11 ＋ 3-13）`);
  for (const [k, it] of items.entries()) {
    const lbl = [...it.matchAll(/<p class="lbl">([^<]+)<\/p>/g)].map((m) => m[1]);
    if (lbl.join("／") !== "問題／事件／解決方案")
      bad.push(`⑯ 第 ${k + 1} 個項目的三格是「${lbl.join("／") || "（空）"}」`);
    for (const c of it.split('<div class="cell">').slice(1))
      if (!/<(p class="txt"|ul class="spec"|div class="tabw")/.test(c)) bad.push(`⑯ 第 ${k + 1} 個項目有一格是空的`);
  }
  const 摘 = html.indexOf('class="tab sum"'), 首節 = html.indexOf('id="s3-7"');
  if (摘 < 0 || 首節 < 0 || 摘 > 首節) bad.push("⑯ 摘要表不在最前面");
  if ((html.match(/<tr>/g) || []).length < B.摘要.length) bad.push("⑯ 摘要表的列數不對");
}
if (!has("⑯")) ok("⑯ 摘要表在最前面；七個項目各有問題／事件／解決方案三格，沒有一格是空的");

/* ⑰ 3-13 預約醫師（2026-09-22）：兩份 Flex 是從定稿插一列出來的，其餘一個字都不能動；
   那一列在日期後面、帶子前面；頁面上兩張模擬卡都畫了那一列，JSON 也照原字印在頁上。 */
{
  const 醫 = JSON.parse(fs.readFileSync(path.join(HERE, "single-card-doctor.json"), "utf8"));
  const 定 = JSON.parse(fs.readFileSync(path.join(HERE, "single-card-band.json"), "utf8"));
  const 驗 = (名, b新, b舊, 日值) => {
    const 上 = b新.body.contents[0].contents;
    const i = 上.findIndex((c) => c.type === "text" && c.text === 日值);
    const row = 上[i + 1];
    if (i < 0 || !row || row.type !== "text" || i + 1 !== 上.length - 1) { bad.push(`⑰ ${名}：日期後面不是醫師那一行`); return; }
    /* 2026-09-22 使用者：不要「預約醫師」標籤，只要「李柄輝醫師」 */
    if (row.text !== "{{doctor}}醫師") bad.push(`⑰ ${名}：那一行是「${row.text}」，該是 {{doctor}}醫師`);
    if (b新.body.contents[1].type !== "image") bad.push(`⑰ ${名}：醫師那一列後面不是帶子`);
    const 拿掉 = JSON.parse(JSON.stringify(b新));
    拿掉.body.contents[0].contents.splice(i + 1, 1);
    if (JSON.stringify(拿掉) !== JSON.stringify(b舊)) bad.push(`⑰ ${名}：除了那一列，還有別的地方和定稿不一樣`);
    if (!html.includes(esc(JSON.stringify(名 === "約診紀錄查詢" ? 醫.約診紀錄查詢 : b新, null, 2))))
      bad.push(`⑰ ${名}：頁面上印的 JSON 和 single-card-doctor.json 對不上`);
  };
  驗("預約成功通知", 醫.預約成功通知, 定.預約成功通知, "{{date}}");
  驗("約診紀錄查詢", 醫.約診紀錄查詢.contents[0], 定.約診紀錄查詢.contents[0], "{{date_two_lines}}");
  const 卡數 = (本文.split("3-13　")[1]?.split('id="sdone"')[0] || "").split('class="dr"').length - 1;
  if (卡數 !== 2) bad.push(`⑰ 3-13 的模擬卡上有 ${卡數} 行醫師姓名，該有 2 行`);
  /* ⚠ 不掃整頁：事件那一格與截圖的 alt 本來就寫著翔評後台的「預約醫師」 */
  const 卡上 = [...本文.matchAll(/<p class="dr"[^>]*>([^<]*)<\/p>/g)].map((m) => m[1]);
  if (卡上.some((x) => x !== "李柄輝醫師")) bad.push(`⑰ 模擬卡上那一行是「${卡上.join("／")}」`);
  if (JSON.stringify(醫).includes("預約醫師")) bad.push("⑰ Flex 裡還有「預約醫師」這個標籤（使用者說不要）");
}
if (!has("⑰")) ok("⑰ 3-13 兩份 Flex 只在日期後面多一行「{{doctor}}醫師」，其餘和定稿逐字相同；兩張模擬卡都畫了");

if (bad.length) { console.error("\n✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log("\n✓ 全部通過");
