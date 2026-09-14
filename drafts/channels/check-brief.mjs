#!/usr/bin/env node
// 守門：給廠商的「待調整項目與規格」（preview/line-brief/）
//
//  ① 重跑 build-brief.mjs、逐位比對（有人手改了頁面，或改了資料卻忘了重跑）
//  ② noindex 三個關鍵字　③ 零 JS　④ 紅線（「隨時問」那一類）
//  ⑤ 不准出現 undefined，也不准留沒換掉的 {{…}}（{{bind_url}} 是給廠商填的，唯一的例外）
//  ⑥ 頁面上不可以出現完整的手機號碼（repo 是公開的）
//  ⑦ 圖：都找得到、width/height ＝ 實檔、有 alt、一律引用隔壁資料夾；這個資料夾只准有 index.html
//  ⑧ 抬頭「未定案」逐字 ＝ brief.json（使用者逐字寫的）
//  ⑨ 節的順序照使用者指定：s1 → s2 → s3（3-1~3-6）→ s4 → s5
//  ⑩ ⚠⚠ 3-2 單張的九顆是各自的原色、3-3 輪播的九顆是淡墨；
//     booked-card.json 輪播網址是 -ink12.png、十八張浮水印都已經在 assets/line/
//  ⑪ 站內連結指得到真的檔案
//  ⑫ 這一頁不印「怎麼走到定稿」—— 落選的色票與過程的字眼不准出現
// ⚠ 版面（水平溢出）這台 Windows 沒有 playwright，改由瀏覽器實際量過再推。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-brief");
const PAGE = path.join(DIR, "index.html");
const bad = [];
const ok = (m) => console.log("  ✓ " + m);
const has = (p) => bad.some((x) => x.startsWith(p));

/* ① */
const before = fs.readFileSync(PAGE);
execFileSync("node", [path.join(HERE, "build-brief.mjs")], { stdio: "pipe" });
const after = fs.readFileSync(PAGE);
if (!before.equals(after)) bad.push("① 重跑之後內容變了");
else ok("① 重跑 build-brief.mjs 逐位相同");
const html = after.toString("utf8");
const 本文 = html.replace(/<style>[\s\S]*?<\/style>/g, "");

/* ② ③ ④ */
for (const w of ["noindex", "nofollow", "noarchive"]) if (!html.includes(w)) bad.push(`② 少了 ${w}`);
if (!has("②")) ok("② noindex");
if (/<script/i.test(html) || /\son[a-z]+="/i.test(html)) bad.push("③ 這一頁不該有 JS");
else ok("③ 零 JS");
const red = ["隨時問", "隨時詢問", "即時回覆您", "有問題歡迎私訊", "小編"].filter((w) => html.includes(w));
if (red.length) bad.push(`④ 紅線：${red.join("、")}`); else ok("④ 紅線 0");

/* ⑤ ⑥ */
if (本文.includes("undefined")) bad.push("⑤ 出現 undefined");
const left = (本文.match(/\{\{[^}]*\}\}/g) || []).filter((x) => x !== "{{bind_url}}");
if (left.length) bad.push(`⑤ 還留著沒換掉的記號：${[...new Set(left)].join("、")}`);
if (!has("⑤")) ok("⑤ 沒有 undefined、沒有沒換掉的記號");
if (/09\d{8}/.test(html.replace(/09x{8}/gi, ""))) bad.push("⑥ 出現完整的手機號碼");
else ok("⑥ 沒有完整的手機號碼");

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
let imgs = 0;
for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) {
  const src = (tag.match(/src="([^"]+)"/) || [])[1];
  const w = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
  const h = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
  if (!/alt="[^"]+"/.test(tag)) bad.push(`⑦ ${src} 沒有 alt`);
  /* 例外：其他商家帳號的截圖（ref-*.jpg）只有這一頁用，放在自己的資料夾裡 */
  if (!src || !(src.startsWith("../") || /^ref-[a-z-]+\.jpg$/.test(src))) { bad.push(`⑦ ${src} 不是引用隔壁資料夾`); continue; }
  const f = path.resolve(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`⑦ 找不到圖：${src}`); continue; }
  const s = sizeOf(f);
  if (!s || s[0] !== w || s[1] !== h) bad.push(`⑦ ${src} 宣告 ${w}×${h}，實檔 ${s}`);
  imgs++;
}
for (const f of fs.readdirSync(DIR)) {
  if (f === "index.html") continue;
  if (/^ref-[a-z-]+\.jpg$/.test(f) && html.includes(`src="${f}"`)) continue;
  bad.push(`⑦ 資料夾裡多了 ${f}（不是這一頁引用的 ref-*.jpg）`);
}
if (!has("⑦")) ok(`⑦ ${imgs} 張圖都對，資料夾裡只有 index.html`);

/* ⑧ 未定案逐字 */
const B = JSON.parse(fs.readFileSync(path.join(HERE, "brief.json"), "utf8"));
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* 頁面上「你們／我們」一律換成「翔評／診所」（「」裡的原文除外），比對前照樣換一次 */
const 稱謂 = (t) => String(t).split(/(「[^」]*」)/).map((seg, i) =>
  i % 2 ? seg : seg.replace(/你們/g, "翔評").replace(/我們/g, "診所")).join("");
if (/(^|」)[^「]*(你們|我們)/.test(本文.replace(/<[^>]+>/g, "").replace(/「[^」]*」/g, "")))
  bad.push("⑧ 頁面上還有「你們」或「我們」沒換成翔評／診所");
const 印 = (t) => 稱謂(t).split(/\*\*|`/).map((x) => esc(x).trim()).filter((x) => x.length >= 2)
  .every((x) => html.includes(x));
let n8 = 0;
for (const x of B.未定案) {
  for (const t of [x.標, x.說, ...(x.子 || [])].filter(Boolean)) {
    n8++;
    if (!印(t)) bad.push(`⑧ 未定案這一句沒有逐字印出來：${String(t).slice(0, 20)}…`);
  }
}
if (B.未定案.length !== 4 || B.未定案[2].子.length !== 6 || B.未定案[3].子.length !== 4)
  bad.push("⑧ 未定案不是 4 件（第 3 件 6 條、第 4 件 4 條）");
if (!has("⑧")) ok(`⑧ 未定案 ${n8} 句逐字印出來`);

/* ⑨ 節的順序 */
const ids = ["s1", "s2", "s3", "s3-1", "s3-2", "s3-3", "s3-4", "s3-5", "s3-6", "s4", "s5"];
let last = -1;
for (const id of ids) {
  const i = html.indexOf(`id="${id}"`);
  if (i < 0) bad.push(`⑨ 找不到 #${id}`);
  else if (i < last) bad.push(`⑨ #${id} 的順序不對`);
  else last = i;
}
for (const m of html.matchAll(/href="#([^"]+)"/g))
  if (!html.includes(`id="${m[1]}"`)) bad.push(`⑨ 錨點 #${m[1]} 指不到`);
if (!has("⑨")) ok("⑨ 五節與 3-1~3-6 照順序，頁內錨點都指得到");

/* ⑩ 顏色與網址 */
const sec = (a, z) => html.slice(html.indexOf(`id="${a}"`), html.indexOf(`id="${z}"`));
const fills = (s) => [...s.matchAll(/<svg class="wm"[\s\S]*?fill="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toLowerCase());
/* 3-3 只數九顆那一格（.gm）—— 上面那兩張「尺寸與位置的示意」也畫著淡墨浮水印 */
const s33 = sec("s3-3", "s3-4");
const s32 = sec("s3-2", "s3-3");
const f32 = fills(s32.slice(s32.indexOf('<div class="gs">'))), f33 = fills(s33.slice(s33.indexOf('<div class="gm">')));
if (!s32.includes('class="dgwm"')) bad.push("⑩ 3-2 少了尺寸與位置的示意");
if (!s33.includes('class="dgwm"')) bad.push("⑩ 3-3 少了尺寸與位置的示意（標了溢出量的虛線框）");
const INK = "#5c5f57";
if (f32.length !== 9 || new Set(f32).size < 6 || f32.includes(INK)) bad.push(`⑩ 3-2 應該是九顆各自的原色：${f32.join(" ")}`);
if (f33.length !== 9 || f33.some((c) => c !== INK)) bad.push(`⑩ 3-3 應該是九顆淡墨：${f33.join(" ")}`);
if ((sec("s3-2", "s3-3").match(/-ink12\.png/g) || []).length) bad.push("⑩ 3-2 的表裡出現淡墨的網址");
/* 只數表格裡那一欄（說明文字裡也寫著 wm-<形狀>-ink12.png，一起數會多一條） */
if ((sec("s3-3", "s3-4").match(/class="url">[^<]*-ink12\.png</g) || []).length !== 9) bad.push("⑩ 3-3 的表不是九條 -ink12.png");
const BK = JSON.parse(fs.readFileSync(path.join(HERE, "booked-card.json"), "utf8"));
if (!/-ink12\.png$/.test(BK.約診紀錄查詢.contents[0].body.contents.find((c) => c.type === "image").url))
  bad.push("⑩ booked-card.json 輪播那一則的浮水印網址不是 -ink12.png");
for (const [n, r] of Object.entries(BK._浮水印))
  for (const u of [r.url, r.url_carousel])
    if (!u || !fs.existsSync(path.join(ROOT, "assets", "line", u.split("/").pop()))) bad.push(`⑩ ${n} 的 ${u} 不在 assets/line/`);
if (!has("⑩")) ok("⑩ 3-2 原色九顆・3-3 淡墨九顆・十八張浮水印都在 assets/line/");

/* ⑪ 站內連結 */
for (const m of html.matchAll(/href="(\/preview\/[^"#]+)/g))
  if (!fs.existsSync(path.join(ROOT, m[1], "index.html"))) bad.push(`⑪ 連不到 ${m[1]}`);
if (!has("⑪")) ok("⑪ 站內連結都指得到");

/* ⑫ 不印過程 */
const 過程 = ["Ⓑ 門診表", "落選", "提案中", "三種比過", "走到這裡"].filter((w) => 本文.includes(w));
if (過程.length) bad.push(`⑫ 印了過程的字眼：${過程.join("、")}`); else ok("⑫ 沒有印過程");

if (bad.length) { console.error("\n✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log("\n✓ preview/line-brief/ 十二道全過");
