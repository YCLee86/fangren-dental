#!/usr/bin/env node
// 守門：約診卡的定案規格與現況對照（preview/line-card-spec/）
//
// 擋十三件：
//  ① 重跑 build-card-spec.mjs、逐位比對（有人手改了頁面，或改了 JSON 卻忘了重跑）
//  ② ⚠⚠ 頁面上不可以出現「七則訊息的文字」—— 那些字的出處是各自的 Flex JSON 與
//     auto-reply.txt。例外只有卡片上真的畫出來的那幾行（foreignObject 與 .cb），
//     那幾行是產生器從 booked-card.json 讀出來的，由 ⑬ 逐字比對
//  ③ noindex 三個關鍵字都在　　④ 零 JS　　⑤ 紅線（「隨時問」那一類）
//  ⑥ 內部連結指得到真的檔案
//  ⑦ 八個寬度水平溢出 0、JS 錯 0
//  ⑧ 頁上每一張圖都找得到、width/height 對得上實檔；⚠ 圖一律引用隔壁資料夾那一份，
//     這個資料夾裡只准有 index.html（複製一份就是同一張圖的第二個副本）
//  ⑨ 只敘述事實：不出現判語，也不留警示記號
//  ⑩ 不准出現 undefined，也不准留沒換掉的 {{…}}
//  ⑪ ⚠⚠⚠ 這一頁只有「定案」與「現況對照」—— 十二則的狀態表、綁定完成那兩個方向、
//     還沒有答案的題目、抬頭那塊未定案，一件都不可以印回來（2026-09-14 使用者：
//     「給廠商看的只要最後定稿和現況對照就好」）。接回去不會讓任何一道版面守門翻臉
//  ⑫ 頁面上不可以出現完整的手機號碼（repo 是公開的）
//  ⑬ 定案要齊：浮水印那幾條、約診狀態那幾條、九顆的表九列、兩則各九張卡與各自的
//     對照，而且卡上那幾行逐字 ＝ booked-card.json
//  ⚠ 「見第 N 節」那個號碼兩頁不一樣 —— 資料裡寫 {{節:關鍵字}}、產生器現算，
//    所以 ⑩ 同時擋「有人把號碼寫死回去」（寫死不會壞，只是指到別節去了）
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-card-spec");
const PAGE = path.join(DIR, "index.html");
const bad = [];
const ok = (m) => console.log("  ✓ " + m);

/* ① 重跑逐位比對 ------------------------------------------------------ */
const before = fs.readFileSync(PAGE);
execFileSync("node", [path.join(HERE, "build-card-spec.mjs")], { stdio: "pipe" });
const after = fs.readFileSync(PAGE);
if (!before.equals(after)) bad.push("① 重跑之後內容變了 ＝ 有人手改了頁面，或改了 JSON 沒重跑");
else ok("① 重跑 build-card-spec.mjs 逐位相同");
const html = after.toString("utf8");
const 本文 = html.replace(/<style>[\s\S]*?<\/style>/g, "");

/* ② 不可以抄任何一則訊息的文字 ---------------------------------------- */
const sources = ["welcome-card.json", "bind-done-card.json", "reminder-card.json",
  "review-card.json", "cancel-card.json", "booked-card.json", "typhoon-card.json"];
let scanned = 0;
const texts = [];
for (const f of sources) {
  const p = path.join(HERE, f);
  if (!fs.existsSync(p)) continue;
  scanned++;
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") for (const [k, v] of Object.entries(n)) {
      if (k.startsWith("_")) continue;
      if (k === "text" && typeof v === "string") texts.push(v); else walk(v);
    }
  };
  walk(JSON.parse(fs.readFileSync(p, "utf8")));
}
const auto = path.join(HERE, "auto-reply.txt");
if (fs.existsSync(auto)) { scanned++; texts.push(...fs.readFileSync(auto, "utf8").split("\n")); }
const probes = [...new Set(texts.flatMap((t) => t.split(/\n/)))]
  .map((t) => t.replace(/\{\{\w+\}\}/g, "").trim())
  .filter((t) => t.length >= 10)
  /* 整行就是一條網址的不算 —— 這一頁本來就要印圖檔的網址（它是規格的一部分） */
  .filter((t) => !/^https?:\/\/\S+$/.test(t));
const fo = html.match(/<foreignObject [\s\S]*?<\/foreignObject>/g) || [];
const cb = html.match(/<div class="[^"]*stcard cb">[\s\S]*?<p class="r">/g) || [];
if (!fo.length) bad.push("② 頁面上一個 foreignObject 都沒有 ＝ 那幾張卡沒有畫字，這個例外不該存在");
if (!cb.length) bad.push("② 頁面上一張 .cb 卡都沒有 ＝ 第 3-2 節沒有畫出來，這個例外不該存在");
const 掃 = html.replace(/<foreignObject [\s\S]*?<\/foreignObject>/g, "")
  .replace(/<div class="[^"]*stcard cb">[\s\S]*?<p class="r">/g, "");
const leaked = probes.filter((t) => 掃.includes(t));
if (!scanned) bad.push("② 一份訊息 JSON 都沒讀到 ＝ 這一道等於沒跑");
else if (leaked.length) bad.push(`② 頁面上抄了訊息的文字（${leaked.length} 句）：${leaked[0].slice(0, 24)}…`);
else ok(`② 沒有抄任何一則訊息的文字（${scanned} 份來源、${probes.length} 句掃過）`);

/* ③ noindex / ④ 零 JS / ⑤ 紅線 ---------------------------------------- */
for (const w of ["noindex", "nofollow", "noarchive"])
  if (!html.includes(w)) bad.push(`③ <meta robots> 少了 ${w}`);
if (!bad.some((b) => b.startsWith("③"))) ok("③ noindex 三個關鍵字都在");
if (/<script/i.test(html) || /\son[a-z]+="/i.test(html)) bad.push("④ 這一頁不該有任何 JS");
else ok("④ 零 JS");
const RED = ["隨時問", "隨時詢問", "即時回覆您", "都會回覆", "有問題歡迎私訊", "小編"];
const red = RED.filter((w) => html.includes(w));
if (red.length) bad.push(`⑤ 紅線：${red.join("、")}`);
else ok("⑤ 紅線 0");

/* ⑥ 內部連結 ---------------------------------------------------------- */
let links = 0;
for (const m of html.matchAll(/href="(\/preview\/[^"#]+)"/g)) {
  links++;
  if (!fs.existsSync(path.join(ROOT, m[1], "index.html"))) bad.push(`⑥ 連不到：${m[1]}`);
}
if (!bad.some((b) => b.startsWith("⑥"))) ok(`⑥ ${links} 條站內連結都指得到`);

/* ⑨ 只敘述事實 / ⑩ undefined 與沒換掉的記號 ---------------------------- */
const JUDGE = ["真不真", "說謊", "指控", "有反例", "只有一半對", "講太寬", "證據力"];
const j = JUDGE.filter((w) => 本文.includes(w));
if (j.length) bad.push(`⑨ 出現判語：${j.join("、")}`);
if (/class="tag/.test(本文)) bad.push("⑨ 還留著警示色的標籤");
if (本文.includes("⚠")) bad.push("⑨ 頁面上出現警示記號 —— 這一頁是給廠商看的");
if (!bad.some((b) => b.startsWith("⑨"))) ok("⑨ 只敘述事實（0 個判語、0 個警示記號）");
if (本文.includes("undefined")) bad.push("⑩ 頁面上出現 undefined ＝ 欄位名打錯了");
if (/\{\{/.test(本文)) bad.push("⑩ 頁面上還留著沒換掉的 {{…}} 記號");
const RAW = fs.readFileSync(path.join(HERE, "vendor-log.json"), "utf8");
const LOG = JSON.parse(RAW);
/* ⚠⚠⚠ 同一段字印在兩頁上，而兩頁的節號不一樣 —— 寫死的那個數字不會壞、不報錯、
   畫面完全正常，它只是指到別節去了。而且**光看數字抓不到**（這一頁也有第 3 節、
   第 4 節），所以這一道守的是資料那一側：一個寫死的「第 N 節」都不准有。 */
if (!RAW.includes("{{節:"))
  bad.push("⑩ vendor-log.json 裡一個 {{節:關鍵字}} 都沒有 ＝ 這一道等於沒跑");
const 寫死 = [...new Set(RAW.match(/第 \d+ 節/g) || [])];
if (寫死.length) bad.push(`⑩ vendor-log.json 裡的節號被寫死了（${寫死.join("、")}）—— 要寫成 {{節:關鍵字}}`);
if (!bad.some((b) => b.startsWith("⑩"))) ok("⑩ 沒有 undefined、沒有沒換掉的記號，節號仍然是現算的");

/* ⑪ 這一頁只有定案與現況對照 ------------------------------------------ */
const 不該有 = [
  ['class="msg', "十二則的狀態表"],
  ['class="dir', "綁定完成那兩個方向"],
  ['class="grp', "還沒有答案的題目"],
  ["這個帳號會自動送出", "十二則那一節的小標"],
  ["還沒有答案的", "待答那一節的小標"],
];
const 混進來 = 不該有.filter(([s]) => 本文.includes(s));
if (混進來.length) bad.push(`⑪ 這一頁印回了只該留在 line-vendor 的東西：${混進來.map((x) => x[1]).join("、")}`);
else ok(`⑪ 只有定案與現況對照（${不該有.length} 種都沒有印回來）`);

/* ⑫ 完整的手機號碼 ---------------------------------------------------- */
if (/09\d{8}/.test(html.replace(/09x{8}/gi, ""))) bad.push("⑫ 頁面上出現完整的手機號碼");
else ok("⑫ 沒有完整的手機號碼");

/* ⑬ 定案要齊 ---------------------------------------------------------- */
const esc2 = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const 有印 = (t) => String(t).split(/\*\*|`|\{\{[^}]*\}\}/)
  .map((x) => esc2(x).trim()).filter((x) => x.length >= 8).every((x) => html.includes(x));
{
  const 定 = LOG.浮水印.定案.條, SET = LOG.狀態色.定案;
  定.forEach((t, i) => { if (!有印(t)) bad.push(`⑬ 浮水印定案第 ${i + 1} 條沒有印出來`); });
  SET.條.forEach(([k, t]) => {
    if (!html.includes(esc2(k))) bad.push(`⑬ 約診狀態定案「${k}」那一列沒有印出來`);
    if (!有印(t)) bad.push(`⑬ 約診狀態定案「${k}」的內容沒有印出來`);
  });
  const 列 = (html.match(/<tbody>([\s\S]*?)<\/tbody>/) || ["", ""])[1].match(/<tr>/g) || [];
  if (列.length !== 9) bad.push(`⑬ 九顆那張表有 ${列.length} 列，不是九列`);
  const i9 = html.indexOf(`<div class="onnine">`);
  const 單張九 = i9 < 0 ? "" : html.slice(i9, html.indexOf("\n</div>", i9));
  const n單 = (單張九.match(/<figure/g) || []).length;
  const n輪 = (html.match(/<div class="carcard stcard cb">/g) || []).length;
  const 該有輪 = LOG.浮水印.對照.輪播.格.length + 9;
  if (n輪 !== 該有輪) bad.push(`⑬ 輪播那幾張卡有 ${n輪} 張，應該是 ${該有輪} 張`);
  const n對 = (html.match(/<div class="cmpwrap">/g) || []).length;
  /* cmpwrap 一個形狀一塊（裡面才是「我們要的／廠商送來的」那兩格） */
  const 該有對 = LOG.浮水印.對照.組.length;
  const 標s = [...LOG.浮水印.對照.組.flatMap((r) => r.格), ...LOG.浮水印.對照.輪播.格].map((g) => g.標);
  const n格 = 標s.filter((t) => html.includes("<figcaption><b>" + t + "</b>")).length;
  const 該有格 = LOG.浮水印.對照.組.reduce((a, r) => a + r.格.length, 0) + LOG.浮水印.對照.輪播.格.length;
  if (n對 !== 該有對) bad.push(`⑬ 單張那幾塊對照有 ${n對} 塊，應該是 ${該有對} 塊`);
  if (n格 !== 該有格) bad.push(`⑬ 對照一共 ${n格} 格，應該是 ${該有格} 格`);
  const n九 = (html.match(/<svg class="wm"/g) || []).length;
  if (n九 < 9) bad.push(`⑬ 畫在卡片上的浮水印只有 ${n九} 顆`);
  /* 卡上那幾行逐字 ＝ booked-card.json（② 那個例外的另一半） */
  const B = JSON.parse(fs.readFileSync(path.join(HERE, "booked-card.json"), "utf8"));
  const 行 = [];
  const walk2 = (n) => {
    if (Array.isArray(n)) return n.forEach(walk2);
    if (n && typeof n === "object") {
      if (n.type === "text" && typeof n.text === "string") 行.push(n.text);
      for (const [k, v] of Object.entries(n)) if (!k.startsWith("_")) walk2(v);
    }
  };
  walk2(B);
  const 固 = 行.map((t) => t.replace(/\{\{[^}]*\}\}/g, "").trim()).filter((t) => t.length >= 3);
  const 漏 = 固.filter((t) => !html.includes(esc2(t)));
  if (固.length && 漏.length === 固.length) bad.push("⑬ 卡片上一行 booked-card.json 的字都沒有畫出來");
  if (!bad.some((b) => b.startsWith("⑬")))
    ok(`⑬ 定案齊（浮水印 ${定.length} 條・約診狀態 ${SET.條.length} 條・表 9 列・`
      + `對照 ${n格} 格・九顆上卡 ${n單}＋${n輪 - LOG.浮水印.對照.輪播.格.length} 張）`);
}

/* ⑧ 圖 ---------------------------------------------------------------- */
const sizeOf = (f) => {
  const b2 = fs.readFileSync(f);
  if (b2[0] === 0x89 && b2[1] === 0x50) return { w: b2.readUInt32BE(16), h: b2.readUInt32BE(20) };
  for (let i = 2; i < b2.length - 9;) {
    if (b2[i] !== 0xff) { i++; continue; }
    const m2 = b2[i + 1];
    if (m2 >= 0xc0 && m2 <= 0xcf && m2 !== 0xc4 && m2 !== 0xc8 && m2 !== 0xcc)
      return { w: b2.readUInt16BE(i + 7), h: b2.readUInt16BE(i + 5) };
    i += 2 + b2.readUInt16BE(i + 2);
  }
  throw new Error(`${f} 讀不出尺寸`);
};
let imgs = 0;
for (const m of html.matchAll(/<img\s[^>]*>/g)) {
  const tag = m[0];
  const src = (tag.match(/src="([^"]+)"/) || [])[1];
  const w = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
  const h = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
  if (!src) { bad.push("⑧ 有一張 img 沒有 src"); continue; }
  if (!/alt="[^"]+"/.test(tag)) bad.push(`⑧ ${src} 沒有 alt`);
  if (!src.startsWith("../")) bad.push(`⑧ ${src} 不是引用隔壁資料夾那一份`);
  const f = path.resolve(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`⑧ 找不到圖：${src}`); continue; }
  const s2 = sizeOf(f);
  if (s2.w !== w || s2.h !== h) bad.push(`⑧ ${src} 宣告 ${w}×${h}，實檔是 ${s2.w}×${s2.h}`);
  imgs++;
}
for (const f of fs.readdirSync(DIR))
  if (f !== "index.html") bad.push(`⑧ 這個資料夾裡只准有 index.html，多了：${f}`);
if (!bad.some((b) => b.startsWith("⑧"))) ok(`⑧ ${imgs} 張圖都找得到、尺寸對得上，資料夾裡只有 index.html`);

/* ⑦ 版面 -------------------------------------------------------------- */
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
const errs = [];
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto("file://" + PAGE, { waitUntil: "load" });
  /* ⚠ 畫面外的 lazy 圖永遠不會開始載 —— 量之前一定要先把 loading 拿掉 */
  await page.evaluate(() => {
    document.querySelectorAll("img[loading]").forEach((i) => i.removeAttribute("loading"));
  });
  const over = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 0) bad.push(`⑦ ${w}px 水平溢出 ${over}px`);
  await page.close();
}
await browser.close();
if (errs.length) bad.push(`⑦ JS 錯 ${errs.length}：${errs[0]}`);
if (!bad.some((b) => b.startsWith("⑦"))) ok("⑦ 八個寬度水平溢出 0、JS 錯 0");

if (bad.length) { console.error("\n✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log("\n✓ preview/line-card-spec/ 十三道全過");
