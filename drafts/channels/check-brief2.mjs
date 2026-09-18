#!/usr/bin/env node
// 守門：9/18 那一版「待調整項目與規格」（preview/line-brief-0918/）
//
//  ① 重跑 build-brief2.mjs、逐位比對（頁面與那一份要交出去的 Flex JSON 都比）
//  ② noindex 三個關鍵字　③ 零 JS　④ 紅線（「隨時問」那一類）
//  ⑤ 不准出現 undefined；沒換掉的 {{…}} 只准是那五個要廠商填的值
//  ⑥ 不可以出現完整的手機號碼（repo 是公開的）
//  ⑦ 圖：找得到、width/height ＝ 實檔、有 alt；資料夾裡只准有 index.html ＋ 9/18 那五個檔
//  ⑧ 抬頭與未定案逐字（3 的子出自 brief2.json、4 的子出自 brief.json）
//  ⑨ ⚠⚠ **編號沒有重編**：未定案那一塊是 3 和 4，不是 1 和 2；4-4-1 指得到
//  ⑩ 節的順序：s3（3-1~3-6）→ s4 → s4-4-1 → s5；**不可以再有 #s1／#s2**（搬到已完成了）
//  ⑪ ⚠⚠⚠ 帶子換掉了浮水印：這一頁不准再出現九顆那一套（-ink12 的網址、那張九顆的表、
//     標著溢出量的虛線框）；兩張帶子要在 assets/line/ 而且和 preview/line-single-card/
//     那一份**逐位相同**；顆數 18／13；卡上那兩個 <img> 指的就是它們
//  ⑫ 影片：檔案在、是 H.264 不是 HEVC（Chrome 播不了 HEVC）、有 poster、尺寸 ＝ 實檔
//  ⑬ 翔評 9/18 的回覆逐字（三個做法、三段紅字、品御那一句）
//  ⑭ 已完成那一節真的含 1 與 2；站內連結指得到
//  ⑮ 這一頁不印「怎麼走到定稿」
// ⚠ 版面（水平溢出）另外用瀏覽器量過。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-brief-0918");
const PAGE = path.join(DIR, "index.html");
const FLEXF = path.join(HERE, "single-card-band.json");
const bad = [];
const ok = (m) => console.log("  ✓ " + m);
const has = (p) => bad.some((x) => x.startsWith(p));
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ① */
const b4 = fs.readFileSync(PAGE), j4 = fs.readFileSync(FLEXF);
execFileSync("node", [path.join(HERE, "build-brief2.mjs")], { stdio: "pipe" });
if (!b4.equals(fs.readFileSync(PAGE))) bad.push("① 重跑之後頁面變了");
if (!j4.equals(fs.readFileSync(FLEXF))) bad.push("① 重跑之後 single-card-band.json 變了");
if (!has("①")) ok("① 重跑 build-brief2.mjs 逐位相同（頁面 ＋ 要交出去的 Flex）");
const html = fs.readFileSync(PAGE, "utf8");
const 本文 = html.replace(/<style>[\s\S]*?<\/style>/g, "");

/* ② ③ ④ */
for (const w of ["noindex", "nofollow", "noarchive"]) if (!html.includes(w)) bad.push(`② 少了 ${w}`);
if (!has("②")) ok("② noindex");
if (/<script/i.test(html) || /\son[a-z]+="/i.test(html)) bad.push("③ 這一頁不該有 JS");
else ok("③ 零 JS");
const red = ["隨時問", "隨時詢問", "即時回覆您", "有問題歡迎私訊", "小編"].filter((w) => html.includes(w));
if (red.length) bad.push(`④ 紅線：${red.join("、")}`); else ok("④ 紅線 0");

/* ⑤ ⑥ —— {{…}} 只准是要廠商填的那五個（它們印在 3-6 的 Flex JSON 裡） */
if (本文.includes("undefined")) bad.push("⑤ 出現 undefined");
const 可填 = ["{{patient}}", "{{date}}", "{{date_two_lines}}", "{{status}}", "{{status_color}}"];
const left = [...new Set((本文.match(/\{\{[^}]*\}\}/g) || []))].filter((x) => !可填.includes(x));
if (left.length) bad.push(`⑤ 還留著沒換掉的記號：${left.join("、")}`);
if (!has("⑤")) ok("⑤ 沒有 undefined；{{…}} 只剩要廠商填的那幾個");
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
const 自家 = ["demo-band.mp4", "demo-band.jpg", "reply-0918-chat.jpg", "reply-0918-bind.jpg", "reply-0918-pinyu.jpg"];
let imgs = 0;
for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) {
  const src = (tag.match(/src="([^"]+)"/) || [])[1];
  const w = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
  const h = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
  if (!/alt="[^"]+"/.test(tag)) bad.push(`⑦ ${src} 沒有 alt`);
  if (!src || !(src.startsWith("../") || 自家.includes(src))) { bad.push(`⑦ ${src} 不是引用隔壁資料夾`); continue; }
  const f = path.resolve(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`⑦ 找不到圖：${src}`); continue; }
  const s = sizeOf(f);
  if (!s || s[0] !== w || s[1] !== h) bad.push(`⑦ ${src} 宣告 ${w}×${h}，實檔 ${s}`);
  imgs++;
}
for (const f of fs.readdirSync(DIR)) {
  if (f === "index.html" || (自家.includes(f) && html.includes(f))) continue;
  bad.push(`⑦ 資料夾裡多了 ${f}`);
}
for (const f of 自家) if (!fs.existsSync(path.join(DIR, f))) bad.push(`⑦ 少了 ${f}`);
if (!has("⑦")) ok(`⑦ ${imgs} 張圖都對，資料夾裡只有 index.html ＋ 9/18 那 ${自家.length} 個檔`);

/* ⑧ 逐字 */
const B1 = JSON.parse(fs.readFileSync(path.join(HERE, "brief.json"), "utf8"));
const B = JSON.parse(fs.readFileSync(path.join(HERE, "brief2.json"), "utf8"));
const 稱謂 = (t) => String(t).split(/(「[^」]*」)/).map((seg, i) =>
  i % 2 ? seg : seg.replace(/你們/g, "翔評").replace(/我們/g, "診所")).join("");
const 印 = (t) => 稱謂(t).split(/\*\*|`/).map((x) => esc(x).trim()).filter((x) => x.length >= 2)
  .every((x) => html.includes(x));
if (/(^|」)[^「]*(你們|我們)/.test(本文.replace(/<[^>]+>/g, "").replace(/「[^」]*」/g, "")))
  bad.push("⑧ 頁面上還有「你們」或「我們」沒換成翔評／診所");
const 件4 = B1.未定案.find((x) => x.標 === "綁定成功的自動回覆設定");
let n8 = 0;
for (const t of [B.抬頭, ...B.s3.子, ...件4.子, ...B.完成.map((x) => x.說), B.s5.說]) {
  n8++;
  if (!印(t)) bad.push(`⑧ 這一句沒有逐字印出來：${String(t).slice(0, 22)}…`);
}
if (B.s3.子.length !== 6 || 件4.子.length !== 4) bad.push("⑧ 3 不是 6 條、4 不是 4 條");
if (!has("⑧")) ok(`⑧ ${n8} 句逐字印出來`);

/* ⑨ 編號沒有重編 —— 4-4-1 這個標號只有在 4 還是 4 的時候才指得到東西 */
/* ⚠⚠⚠ 那一塊的號碼是 CSS 的 counter 畫的 —— 只驗 <li value> 會放行一個畫出來
   仍然是 1、2 的頁面（踩過）。兩件都要：counter 從 2 起跳、value 也寫著。 */
if (!/\.now>ol\{counter-reset:n 2\}/.test(html)) bad.push("⑨ 少了 counter-reset:n 2 —— 畫出來會從 1 開始");
if (!/\.now ol\.sub>li::before\{content:counter\(n\) "-" counter\(m\)/.test(html)) bad.push("⑨ 子項的號碼不是跟著 counter(n) 走");
if (!/<li value="3">/.test(html)) bad.push("⑨ 未定案那一塊沒有從 3 開始（編號被重編了）");
if (!/<h2 class="h2" id="s3">3　/.test(html)) bad.push("⑨ 第 3 節的標題不是「3　…」");
if (!/<h2 class="h2" id="s4">4　/.test(html)) bad.push("⑨ 第 4 節的標題不是「4　…」");
/* ⚠ 翔評回覆那一塊在抬頭的清單裡是第 5 條，CSS counter 因此把它畫成 4-5；
   標題原本寫 4-4-1，同一塊東西兩個名字（使用者接著就用 4-6 指下一條）。
   定案：標題改 4-5、舊的錨點 s4-4-1 留著，兩個都要指得到。 */
for (const a of ["s4-4-1", "s4-5", "s4-6"])
  if (!html.includes(`id="${a}"`)) bad.push(`⑨ 找不到 #${a}`);
if (!/id="s4-5"[^>]*>4-5　/.test(html)) bad.push("⑨ 翔評回覆那一節的標題不是「4-5　…」");
if (!/id="s4-6"[^>]*>4-6　/.test(html)) bad.push("⑨ 新的那一節的標題不是「4-6　…」");
if (/4-4-1　/.test(本文.replace(/上一版寫的 4-4-1[^<]*/g, "")))
  bad.push("⑨ 還有地方把那一塊叫成 4-4-1（同一塊東西只能有一個名字）");
for (let i = 1; i <= 4; i++) if (!html.includes(`id="s4-${i}"`)) bad.push(`⑨ 找不到 4-${i}`);
if (!has("⑨")) ok("⑨ 編號沒有重編（3 還是 3、4 還是 4、4-1~4-4 ＋ 4-4-1 都在）");

/* ⑩ 順序與錨點 */
const ids = ["s3", "s3-1", "s3-2", "s3-3", "s3-4", "s3-5", "s3-6", "s4", "s4-4-1", "s4-5", "s4-6", "s5"];
let last = -1;
for (const id of ids) {
  const i = html.indexOf(`id="${id}"`);
  if (i < 0) bad.push(`⑩ 找不到 #${id}`);
  else if (i < last) bad.push(`⑩ #${id} 的順序不對`);
  else last = i;
}
for (const x of ['id="s1"', 'id="s2"']) if (html.includes(x)) bad.push(`⑩ ${x} 還在 —— 那兩件已經搬到已完成了`);
for (const m of html.matchAll(/href="#([^"]+)"/g))
  if (!html.includes(`id="${m[1]}"`)) bad.push(`⑩ 錨點 #${m[1]} 指不到`);
if (!has("⑩")) ok("⑩ 3-1~3-6 → 4 → 4-4-1 → 5 照順序，沒有 s1／s2，錨點都指得到");

/* ⑪ 帶子換掉浮水印 */
const FLEX = JSON.parse(fs.readFileSync(FLEXF, "utf8"));
const 帶 = { mega: "band-18-set.png", car: "band-13-set.png" };
const 顆 = { mega: 18, car: 13 };
for (const [k, f] of Object.entries(帶)) {
  const src = path.join(ROOT, "preview", "line-single-card", f);
  const dst = path.join(ROOT, "assets", "line", f);
  if (!fs.existsSync(src)) { bad.push(`⑪ preview/line-single-card/${f} 不在`); continue; }
  if (!fs.existsSync(dst)) { bad.push(`⑪ assets/line/${f} 不在 —— 跑 publish-assets.mjs`); continue; }
  if (!fs.readFileSync(src).equals(fs.readFileSync(dst)))
    bad.push(`⑪ assets/line/${f} 和 preview/line-single-card/ 那一份對不上`);
  const s = sizeOf(dst);
  if (s[0] > 1024 || s[1] > 1024) bad.push(`⑪ ${f} ${s.join("×")} 超過 LINE 的 1024×1024`);
  const j = k === "mega" ? FLEX.預約成功通知.body : FLEX.約診紀錄查詢.contents[0].body;
  const im = j.contents.find((c) => c.type === "image");
  if (!im) { bad.push(`⑪ ${k} 那一則的 Flex 裡沒有帶子`); continue; }
  if (!im.url.endsWith("/" + f)) bad.push(`⑪ ${k} 那一則引用的不是 ${f}：${im.url}`);
  if (im.size !== "full") bad.push(`⑪ ${k} 的帶子不是 size: full`);
  if (im.position === "absolute") bad.push(`⑪ ${k} 的帶子還在疊（position: absolute）`);
  if (im.aspectRatio !== `${s[0]}:${s[1]}`) bad.push(`⑪ ${k} 的 aspectRatio ${im.aspectRatio} 對不上實檔 ${s.join(":")}`);
  if (j.paddingAll !== "0px") bad.push(`⑪ ${k} 的 body 不是 paddingAll 0px —— 帶子會滿不到卡片的邊`);
  if (j.contents.length !== 3 || j.contents[0].type !== "box" || j.contents[2].type !== "box")
    bad.push(`⑪ ${k} 不是「兩塊 box 夾一條帶子」`);
  if (!html.includes(`src="../line-single-card/${f}"`) && !html.includes(`src="${f}"`))
    bad.push(`⑪ 頁面上的卡沒有畫 ${f}`);
}
/* 這一頁不可以再出現九顆那一套 */
if (/-ink12\.png/.test(本文)) bad.push("⑪ 頁面上還有 -ink12.png（九顆浮水印那一版的網址）");
if (/class="dgwm"|class="gm"|class="gs"/.test(html)) bad.push("⑪ 頁面上還有九顆浮水印那幾張表");
if (/watermark_size|watermark_ratio/.test(本文)) bad.push("⑪ 頁面上還有浮水印要填的那幾個值");
for (const s of [FLEX.預約成功通知, FLEX.約診紀錄查詢])
  if (JSON.stringify(s).includes("wm-")) bad.push("⑪ 要交出去的 Flex 裡還有浮水印");
/* ⚠⚠ 「現在這樣」那張卡的說明寫著「浮水印疊在文字後面」—— 那張卡就一定要真的畫著它。
   少畫的話那一句話是假的，而版面、尺寸、溢出每一道都會過（踩過）。 */
{
  const s31 = html.slice(html.indexOf('id="s3-1"'), html.indexOf('id="s3-2"'));
  const n = (s31.match(/<svg class="wm"/g) || []).length;
  if (n !== 1) bad.push(`⑪ 3-1 的「現在這樣」那張卡上有 ${n} 顆浮水印，該是 1 顆`);
  if ((html.match(/<svg class="wm"/g) || []).length !== 1)
    bad.push("⑪ 整頁不該有第二顆浮水印（只有 3-1 那張現況卡有）");
}
if (!has("⑪")) ok(`⑪ 兩張帶子（${顆.mega}／${顆.car} 顆）已上線、size: full、不疊；現況那張卡真的畫著浮水印；九顆那一套整組不在了`);

/* ⑫ 影片 */
{
  const v = path.join(DIR, "demo-band.mp4");
  const buf = fs.readFileSync(v);
  const head = buf.subarray(0, 4096).toString("latin1");
  if (!head.includes("avc1")) bad.push("⑫ 影片不是 H.264（avc1）—— HEVC 在 Chrome 上播不了");
  if (head.includes("hvc1") || head.includes("hev1")) bad.push("⑫ 影片還是 HEVC");
  if (buf.indexOf(Buffer.from("moov")) > buf.indexOf(Buffer.from("mdat")))
    bad.push("⑫ 影片沒有 faststart（moov 排在 mdat 後面）");
  const tag = (html.match(/<video[^>]*>/) || [])[0] || "";
  for (const a of ["controls", "playsinline", 'preload="none"', 'poster="demo-band.jpg"'])
    if (!tag.includes(a)) bad.push(`⑫ <video> 少了 ${a}`);
  const p = sizeOf(path.join(DIR, "demo-band.jpg"));
  const w = Number((tag.match(/width="(\d+)"/) || [])[1]), h = Number((tag.match(/height="(\d+)"/) || [])[1]);
  if (w !== p[0] || h !== p[1]) bad.push(`⑫ <video> 宣告 ${w}×${h}，封面是 ${p.join("×")}`);
  if (buf.length > 2 * 1024 * 1024) bad.push(`⑫ 影片 ${(buf.length / 1024 / 1024).toFixed(1)}MB 太大（/preview/* 是 no-store，每次都會重抓）`);
  if (!has("⑫")) ok(`⑫ 影片 H.264・faststart・${(buf.length / 1024).toFixed(0)}KB・封面 ${p.join("×")}`);
}

/* ⑬ 翔評 9/18 的回覆逐字 */
{
  const R = B.s4.四之四之一;
  let n = 0;
  for (const t of [R.品御, ...R.選項, ...R.紅字]) {
    n++;
    if (!html.includes(esc(t).replace(/^「|」$/g, "").slice(0, 24))) bad.push(`⑬ 回覆這一句沒有印出來：${t.slice(0, 18)}…`);
  }
  if (R.選項.length !== 3 || R.紅字.length !== 3) bad.push("⑬ 三個做法或三段紅字少了");
  if (R.圖說.length !== 3) bad.push("⑬ 回覆的附圖不是三張");
  if (!has("⑬")) ok(`⑬ 翔評的回覆 ${n} 句逐字印出來 ＋ 三張附圖`);
}

/* ⑭ 已完成含 1 與 2；站內連結 */
{
  const s5 = html.slice(html.indexOf('id="s5"'));
  for (const x of B.完成) if (!s5.includes(esc(x.標))) bad.push(`⑭ 已完成那一節裡沒有「${x.標}」`);
  if (!/id="s5-1"[\s\S]*id="s5-2"/.test(s5)) bad.push("⑭ 已完成那兩件的順序不對");
  /* ⚠⚠ 兩套編號都要印：抬頭那一塊的 1／2，以及那十二則裡的圈號（① 是招呼圖卡，
     不是這兩件其中之一 —— 只印一套會讓讀的人對到別則去）。 */
  const D2 = JSON.parse(fs.readFileSync(path.join(HERE, "vendor-log.json"), "utf8"));
  for (const [i, x] of B.完成.entries()) {
    const r = D2.訊息.列.find((y) => y.未定案 === x.標);
    if (!r) { bad.push(`⑭ vendor-log 裡沒有一則宣告屬於「${x.標}」`); continue; }
    if (!s5.includes(`id="s5-${i + 1}">${x.n}　`)) bad.push(`⑭ 第 ${i + 1} 件沒有印抬頭那一塊的號碼 ${x.n}`);
    if (!s5.includes(`在那十二則裡是 ${r.n}`)) bad.push(`⑭ 第 ${i + 1} 件沒有印它在十二則裡的圈號 ${r.n}`);
  }
  for (const m of html.matchAll(/href="(\/preview\/[^"#]+)/g))
    if (!fs.existsSync(path.join(ROOT, m[1], "index.html"))) bad.push(`⑭ 連不到 ${m[1]}`);
  if (!has("⑭")) ok("⑭ 已完成那一節含 1 與 2，站內連結都指得到");
}

/* ⑰ 4-6：兩條實作路徑、四條查證各自帶出處、還沒查到的兩件都要在 */
{
  const S6 = B.s4.四之六, 出處 = B.s4.出處;
  const s46 = html.slice(html.indexOf('id="s4-6"'), html.indexOf('id="s4-ref"'));
  if (!s46) bad.push("⑰ 找不到 4-6 那一節");
  if (S6.作法.length !== 2) bad.push("⑰ 實作不是兩條（帳號連結機制／自己的綁定頁面）");
  for (const [k] of S6.作法) if (!印(k)) bad.push(`⑰ 這一條實作沒有印出來：${k}`);
  if (S6.查證.length < 3) bad.push("⑰ 查證少於三條");
  for (const [k, , 源] of S6.查證) {
    if (!印(k)) bad.push(`⑰ 這一條查證沒有印出來：${k}`);
    /* ⚠⚠ 每一條查證都要帶得出出處 —— 不帶出處的「查證過」和沒查過看起來一模一樣 */
    if (!出處[源]) { bad.push(`⑰ s4.出處 裡沒有「${源}」`); continue; }
    if (!s46.includes(esc(出處[源]))) bad.push(`⑰ 4-6 上找不到「${源}」的網址`);
  }
  for (const u of Object.values(出處))
    if (!/^https:\/\/(developers\.line\.biz|tw\.linebiz\.com)\//.test(u))
      bad.push(`⑰ 出處不是 LINE 官方的網址：${u}`);
  /* ⚠⚠⚠ 查證過的和還沒查到的一定要分開印 —— 混在一起就是拿推論當事實 */
  if (!S6.待確認 || S6.待確認.length < 2) bad.push("⑰ 「還沒查到、要請翔評確認」不是兩件");
  for (const t of S6.待確認) if (!印(t)) bad.push(`⑰ 待確認這一句沒有印出來：${String(t).slice(0, 18)}…`);
  if (!印(S6.註)) bad.push("⑰ 少了「以翔評實測為準」那一句");
  if (!has("⑰")) ok(`⑰ 4-6：兩條實作・${S6.查證.length} 條查證各自帶 LINE 官方出處・${S6.待確認.length} 件還要確認`);
}

/* ⑮ 不印過程 */
const 過程 = ["落選", "提案中", "三種比過", "走到這裡", "還沒決定"].filter((w) => 本文.includes(w));
if (過程.length) bad.push(`⑮ 印了過程的字眼：${過程.join("、")}`); else ok("⑮ 沒有印過程");

/* ⑯ ⚠⚠⚠ 樣式表裡不可以有跑到註解外面的字 —— 踩過：註解的結束記號被插在說明的
   上一行，那一行中文於是變成 CSS，把**緊接在它後面的那一條規則一起吃掉**。
   症狀是那一條規則靜靜地失效（未定案那一塊的號碼照樣從 1 開始），而頁面每一個
   地方都正常、每一道守門都會過。做法：剝掉註解，再看深度 0 的選擇器裡有沒有
   中文全形標點 —— 那是「一段說明跑出來了」最可靠的指紋。 */
{
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
  if (!css) bad.push("⑯ 讀不到樣式表");
  const 淨 = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let d = 0, seg = "";
  const 髒 = [];
  for (const ch of 淨) {
    if (ch === "{") { if (d === 0 && /[，。；、（）「」⚠—]/.test(seg)) 髒.push(seg.trim().slice(0, 26)); seg = ""; d++; }
    else if (ch === "}") { d--; if (d === 0) seg = ""; }
    else if (d === 0) seg += ch;
  }
  if (/[，。；、「」⚠]/.test(seg)) 髒.push(seg.trim().slice(0, 26));
  if (d !== 0) bad.push(`⑯ 樣式表的大括號沒有配對（差 ${d}）`);
  if (髒.length) bad.push(`⑯ 樣式表裡有跑到註解外面的字：${髒.join(" ／ ")}`);
  /* 那一條被吃掉的時候，剝完註解它就不在深度 0 的規則裡了 */
  if (!/\}\s*\.now>ol\{counter-reset:n 2\}/.test(淨))
    bad.push("⑯ counter-reset:n 2 前面不是一條規則的結尾 —— 它可能被上一段字吃掉了");
  if (!has("⑯")) ok("⑯ 樣式表沒有跑到註解外面的字，counter-reset:n 2 真的是一條規則");
}

if (bad.length) { console.error("\n✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log("\n✓ preview/line-brief-0918/ 十七道全過");
