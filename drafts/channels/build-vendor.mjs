#!/usr/bin/env node
// 廠商對接的那一頁 → preview/line-vendor/index.html
//
// ⚠⚠ 這一頁「不放任何一則訊息的文字」—— 七則的字各有出處（六份 Flex JSON ＋
//    auto-reply.txt）且各自有守門，抄進來就是第八個真相。這裡只放：現在有哪幾則
//    在跑、廠商改了什麼、對方回覆涵蓋到哪裡、還沒有答案的是什麼。
//
// ⚠ 資料的唯一出處是 vendor-log.json，這一支只做排版。改內容改 JSON 再重跑。
// ⚠ 零 JS（守門連 script 標籤都擋）。
//
// ⚠⚠ 2026-09-11 使用者：「文字太多了　精簡一點　也要附圖對照文字看　不要有
//    太情緒或是指控誰說謊　只要基於事實　客觀的敘述就好」。三件因此改掉：
//    ① 每一則旁邊擺它自己那一頁拍的縮圖（node drafts/channels/vendor-shots.mjs）
//    ② 九顆浮水印**內嵌成 SVG**（幾何從 brand/shapes/ 讀、寬度從 wm-sizes.json 讀，
//       不抄第二份；內嵌所以不必多幾個圖檔，也不會有 JS）
//    ③ 「真／假」那一組判語整組拿掉，改成「這句話說明的是什麼／還沒回答的是什麼」
//
// ⚠⚠⚠ 2026-09-13 使用者：「現在頁面有太多說明　與內部說明的敘述　要整理成給廠商
//    看的頁面　我們已經定案　了解的文字說明都不需要」。所以這一頁的讀者從「我們
//    自己」換成「廠商」，六節：① 在跑的十二則 ② 09-10 的改版 ③ 浮水印 ④ 約診狀態
//    的定案 ⑤ 綁定完成的兩個方向 ⑥ 要請對方回答的題目。
//    ⚠⚠ 拿掉的是「怎麼推出來的」與「我們自己要做的」，**不是把資料刪掉** ——
//    往返、回覆逐句、別家帳號、綁定.現象、狀態色走到這裡的過程、待答的後台／診所／
//    素材三組**都還在 vendor-log.json 裡**，只是不再印出來（這條線一貫的做法：
//    落選理由與推導不要跟著畫面一起消失）。要印回來就把那幾段排版接回去。
//    ⚠ 節號改成 1~6 的半形數字 —— 圈號 ①~⑫ 留給那十二則訊息，那組編號是雙方
//      共用的詞（廠商兩封回信都照它在講），一個都不換。
//
// ⚠⚠⚠ 2026-09-13 稍晚：抬頭那一塊從「現在等你們的四件」換成「未定案」四件，
//    其中兩件各帶子項（3-1~3-5、4-1~4-4），順序是使用者指定的。跟著三件：
//    ① 第 3 節多一排「九顆各自畫在卡片上該有的樣子」—— 使用者：「9 個 logo 的效果
//       都要放上去，給廠商看到，目前只有針對廠商放的兩個做比對」。
//    ② 浮水印的顏色定案成**淡墨素色**（柔墨 #5c5f57、12%），所以九宮格底下那一排
//       與那九張卡都畫成淡墨；**上面那一排仍然是原色** —— 那一份色是第 4 節那四個
//       值在用的（定案.條.色票 指著它），拿掉的話那一句就沒有出處了。
//    ③ 「浮水印換的規則」「日期格式」「年份 2020」「評價邀約的按鈕」四題從待答收掉
//       （前兩題改成我們自己寫死交過去，後兩題使用者說不必再深入），
//       題目與收掉的理由留在 vendor-log.json 的「待答.已決」裡。
//    ⚠ 待答那一組因此改成**編號**（<li value>）—— 頁面上原本只有 ★／・，
//      而別處寫著「第 6 節的第 N 題」，沒有號碼的話那句話指不到任何東西。
//
// 跑完驗：node drafts/channels/check-vendor.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-vendor");

const D = JSON.parse(readFileSync(join(HERE, "vendor-log.json"), "utf8"));
/* 引用別頁那兩張規格圖時，尺寸**現場讀 PNG 檔頭**，不寫死 ——
   2026-09-13 日期收成一行之後那兩張圖自己矮了（卡片跟著內容縮），
   寫死的那個高度當場就開始說謊（守門 ⑧ 抓得到，但那時圖已經畫歪了）。 */
const pngWH = (rel) => {
  const b = readFileSync(join(OUT, rel));
  if (b.toString("latin1", 1, 4) !== "PNG") throw new Error(`${rel} 不是 PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

/* ── 「第 6 節的第 N 題」那個號碼不要寫死 ──────────────────────────────
   待答那一組收掉或補一題，整組的號碼就會位移，而寫死的那個數字**畫面上完全
   正常**、只是指到別題去了。所以資料裡寫的是 {{題:關鍵字}}，號碼在這裡現算；
   找不到或找到不只一題就 throw。 */
/* ⚠⚠ 同一件事的第二種：「六件對上、四件還沒對上」這一類**數字**也不要寫死。
   2026-09-13 收掉兩件之後，第 1 節 ⑥ 那張卡的註還寫著「四件還沒對上」——
   兩個數字都對不上了，而畫面完全正常。資料裡寫 {{改版:欄位}}，長度在這裡現算。 */
(() => {
  const 列 = D.待答.廠商.列;
  const 號 = (key) => {
    const hit = 列.map((x, i) => [x, i + 1]).filter(([x]) => x.問.includes(key));
    if (hit.length !== 1) throw new Error(`{{題:${key}}} 在待答裡找到 ${hit.length} 題，要剛好一題`);
    return hit[0][1];
  };
  const 數 = (key) => {
    const a = D.改版?.[key];
    if (!Array.isArray(a)) throw new Error(`{{改版:${key}}} 對不到一組陣列`);
    return a.length;
  };
  const fix = (v) => v
    .replace(/\{\{題:([^}]+)\}\}/g, (_, k) => 號(k))
    .replace(/\{\{改版:([^}]+)\}\}/g, (_, k) => 數(k));
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach((v, i) => {
      if (typeof v === "string") n[i] = fix(v); else walk(v);
    });
    if (n && typeof n === "object") for (const [k, v] of Object.entries(n)) {
      if (typeof v === "string") n[k] = fix(v); else walk(v);
    }
  };
  walk(D);
})();

/* ── 「見第 N 節」那個號碼不要寫死 ─────────────────────────────────
   ⚠⚠⚠ 同一段文字現在會印在兩頁上（這一頁與 build-card-spec.mjs 那一頁），
   而兩頁的節號不一樣。寫死的那個數字不會壞、不報錯、畫面完全正常 ——
   它只是指到別節去了（＝ 第 50-22、51-2、54 節那條通則的第三次現場）。
   所以資料裡寫 {{節:關鍵字}}，號碼在 esc()／b() 現算；找不到就 throw。
   ⚠ 換頁要先呼叫 設節表()，而且只有「呼叫之後才組出來的字串」會吃到新的一份 ——
   所以在模組載入時就組好的區塊（revised／settled）都改成函式。 */
let 節表 = { 訊息: "第 1 節", 改版: "第 2 節", 浮水印: "第 3 節", 約診狀態: "第 4 節", 綁定: "第 5 節", 待答: "第 6 節" };
const 設節表 = (m) => { 節表 = m; };
const 節 = (t) => String(t).replace(/\{\{節:([^}]+)\}\}/g, (_, k) => {
  if (!節表[k]) throw new Error(`{{節:${k}}} 在這一頁沒有對應的節 —— 那一段字要嘛改寫、要嘛補進節表`);
  return 節表[k];
});

const esc = (t) =>
  節(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* **…** 加粗。⚠ 警示色那一條 2026-09-11 拿掉了 —— 這一頁現在只敘述事實，
   不靠顏色喊。 */
const b = (t) => esc(t)
  .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
  .replace(/`([^`]+)`/g, "<code>$1</code>");

/* ── 科別的中文名：從 index.html 的標記那一排讀回來，不另外維護一份 ───── */
const SPEC_NAME = (() => {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");
  const m = {};
  /* ⚠ 一定要連 href 一起比對 —— 只寫 data-spec 的話，樣式表那一段的 CSS 註解
     （「它和 [data-spec="kids"] 權重相同…」）會先命中，名字就變成註解裡的一段話，
     **而且不報錯**（2026-09-11 踩過，畫出來是「裡的時間，和這顆」）。 */
  for (const x of html.matchAll(
    /<a href="\/topics\/([a-z]+)\/"\s+data-spec="\1"\s*>([^<]{2,20})<\/a>/g))
    m[x[1]] = x[2].trim();
  if (Object.keys(m).length !== 7) throw new Error(`index.html 讀到 ${Object.keys(m).length} 科，應該是七科`);
  return m;
})();

/* ── 九顆浮水印：形狀讀 brand/shapes/，寬度與顏色讀 wm-sizes.json ───────── */
/* ⚠ 濃度不可以在這裡寫死：唯一的出處是 booked-card.json 引用的檔名（wm-<形狀>-12.png），
   那批 PNG 的 alpha 就是烘在檔案裡的（booked-mark.mjs 的 ALPHAS）。換成 -08 這裡要跟著淡。 */
const WM_A = (() => {
  const j = readFileSync(join(ROOT, "drafts", "channels", "booked-card.json"), "utf8");
  const hit = [...j.matchAll(/wm-[^"]*-(\d{2})\.png/g)].map((m) => m[1]);
  const uniq = [...new Set(hit)];
  if (uniq.length !== 1) throw new Error(`booked-card.json 的浮水印濃度不只一種：${uniq}`);
  return Number(uniq[0]) / 100;
})();

/* ── 浮水印在兩則上各要畫多寬（2026-09-14 定案）─────────────────────────
   ⚠⚠⚠ 九顆的寬度是按墨的面積正規化的（等重、但不等寬 104~215px），而兩則的
     卡片寬差 106px —— 同一顆在兩則上要畫不同的寬。兩張倍率表的**唯一出處是
     preview/line-booked/index.html**（SPREAD1／WIDEK2），這裡讀回來、不抄第二份：
     抄一份之後改一邊，交出去的兩份規格會靜靜地分家。 */
const WM_TABLES = (() => {
  const page = readFileSync(
    join(ROOT, "preview", "line-booked", "index.html"), "utf8");
  const one = (name) => {
    const m = page.match(new RegExp("var " + name + " = \\{([^}]*)\\};"));
    if (!m) throw new Error(`line-booked 那一頁上找不到 ${name} 那張定案的表`);
    const o = {};
    for (const [, k, v] of m[1].matchAll(/(\w+):\s*(\.?[\d.]+)/g)) o[k] = parseFloat(v);
    if (!Object.keys(o).length) throw new Error(`${name} 讀出來是空的`);
    return o;
  };
  return { single: one("SPREAD1"), car: one("WIDEK2") };
})();

/* ── 這兩則的卡片底色（2026-09-14 從 #f4f4f5 換成純白）─────────────────
   ⚠⚠ 出處一樣只有一個：line-booked 那一頁 :root 的 --wcard。這一頁把同樣那兩張
     卡畫了兩次（第 3 節那九張、第 4 節那四張），底色抄一份的話同一張卡在兩頁上
     會是兩個顏色，而版面完全正常。 */
const WCARD = (() => {
  const m = readFileSync(join(ROOT, "preview", "line-booked", "index.html"), "utf8")
    .match(/--wcard:\s*(#[0-9a-fA-F]{6})/);
  if (!m) throw new Error("line-booked 那一頁上找不到 --wcard —— 卡片底色沒有出處了");
  return m[1];
})();

const WM = (() => {
  const sizes = JSON.parse(
    readFileSync(join(ROOT, "preview", "line-booked", "wm-sizes.json"), "utf8"));
  const names = Object.keys(sizes).sort();
  if (names.length !== 9) throw new Error(`wm-sizes.json 應該是九顆，讀到 ${names.length}`);
  const widest = Math.max(...names.map((n) => sizes[n].w));
  return names.map((n) => {
    const f = join(ROOT, "brand", "shapes", `shape-${n}.svg`);
    if (!existsSync(f)) throw new Error(`找不到 ${f}`);
    const svg = readFileSync(f, "utf8");
    /* ⚠ brand/shapes/*.svg ＝ 一條路徑 ＋ 一個帶 scale(1 -1) 的外層 transform。
       只抄 <path d> 會畫出一張全透明、而且不報錯的圖（booked-mark.mjs 檔頭）。 */
    const d = (svg.match(/\sd="([^"]+)"/) || [])[1];
    const gt = (svg.match(/<g\s+transform="([^"]+)"/) || [])[1];
    const vb = (svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
    if (!d || !gt || vb.length !== 2) throw new Error(`shape-${n}.svg 讀不出 path／transform／viewBox`);
    const s = sizes[n];
    const 科 = SPEC_NAME[s.spec];
    if (!科) throw new Error(`${n} 的科別 ${s.spec} 在 index.html 上找不到名字`);
    /* ⚠⚠ 九顆的寬度不一樣是刻意的（按墨的面積正規化，看起來才一樣重）——
       所以這裡給的是**相對寬度的百分比**，縮到任何螢幕上比例都不變。 */
    return { n, d, gt, vw: vb[0], vh: vb[1], pct: (s.w / widest * 100).toFixed(1),
             色: s.color, 科, w: s.w, ratio: s.ratio };
  });
})();

/* ⚠⚠ 九顆的相對高度從 0.28 到 0.50 都有（寬度是按墨的面積正規化的，不是等高）——
   直接排下去，同一列的虛線會落在不同高度（第九節第 28 條 ① 那一種「同一欄不同列對不齊」）。
   所以每一格的框固定成「最高的那一顆」的長寬比、形狀垂直置中。 */
/* ── 卡片上那兩行：〔病人姓名〕與日期 ──────────────────────────
   2026-09-13 使用者：「把約診狀態和 9 個 logo 依照廠商的日期格式都做一次」。
   日期的寫法只有一個出處（vendor-log.json 的「日期」），第 3 節那幾張 SVG 卡
   與第 4 節那四張 HTML 卡吃的是同一組數字 —— 分成兩份的話，同一頁上會畫出
   兩種字級的同一張卡，而版面完全正常。 */
const DATE = D.日期;
/* 2026-09-13（第三輪）：日期定案 `2026/09/11 星期五 11:50`。使用者：「日期格式錯了
   是 2026/09/11 星期五 11:50。」—— 這推翻了同一天稍早那一版（`09/11 (五) 11:50`）：
   年份不要拿掉、星期幾要寫全，時間仍然接在最後、不要自己斷行。
   ⚠⚠ **四樣東西一個都沒有換，換的只有順序**：廠商 09-10 送來的是
   `2026/09/11 11:50 星期五`，我們要的是把星期幾移到日期後面、時間放最後 ——
   **同樣那些字元、同樣的寬度**，所以對他們是一個順序的要求，不是換格式。
   ⚠ 放不放得下（19px 粗體，LINE 上量到的）：
     單張卡（mega）可用 240px，這一行約 225px  → 一行放得下
     輪播卡（micro）可用 177px，這一行約 225px → 放不下，會折成兩行
   輪播折成兩行是**對的**：那一格要保持 `wrap: true`、不要 `maxLines`，
   折到第二行也不會掉字；而折點落在時間前面，星期幾仍然跟著它的日期。
   ⚠⚠ 這台容器沒有 Noto Sans TC，拉丁數字會退到比較寬的字型（同一行量到 250px、
   比 LINE 寬一成），所以 `.cb` 的字型堆疊多插一個拉丁字型當校正（見那一段的註解）——
   不校正的話，這一頁畫出來的卡會在 LINE 上放得下的地方折行。
   兩種寫法都留在資料裡：「廠商」是他們 09-10 送來的、「例」是我們要的。 */
if (!/^\d{4}\/\d{2}\/\d{2} 星期[一二三四五六日] \d{2}:\d{2}$/.test(DATE.例 || ""))
  throw new Error(`日期的例子不是「年/月/日 星期X 時間」那一行寫法：${JSON.stringify(DATE.例)}`);
if (/\n/.test(DATE.例)) throw new Error("日期的例子裡有換行 —— 時間接在最後，不要自己斷行");
if (!/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} 星期[一二三四五六日]$/.test(DATE.廠商 || ""))
  throw new Error(`日期的「廠商」那一欄不是他們 09-10 那一版的寫法：${JSON.stringify(DATE.廠商)}`);
if (DATE.例 === DATE.廠商) throw new Error("日期的「例」和「廠商」一樣，那就沒有東西要調了");
if (!DATE.姓名) throw new Error("vendor-log.json 的「日期」沒有寫姓名要印什麼");
/* 字級與間距照 Flex：paddingAll 14、狀態那一列 xs 13。行高是我們畫的模型。 */
const CARD = { pad: 14, 距: 10, 籤: 13, lh: 1.35 };
/* Flex 的字級是固定 px、不是比例 —— 這張階梯沒有 12、15、18、20。 */
const FSIZE = { xxs: 11, xs: 13, sm: 14, md: 16, lg: 19, xl: 22, xxl: 27 };

/* ── 卡上那幾行從那份 Flex JSON 讀回來 ────────────────────────────
   2026-09-13 使用者：「預約成功通知　對話框裡文字下有一個很大的空白　看起來會覺得
   是文字寫好，再另外塞 logo 浮水印，但空間不夠所以往下拉對話框。這樣不對；
   我們一開始是把 logo 當浮水印，這樣就不會有很大的空白。」
   成因是這一頁只畫了兩行，而那張卡是照真正的四行量出來的 —— 底下那一塊
   空白是「少畫的兩行」，不是卡片被撐開。
   ⚠⚠ 2026-09-13 稍晚（日期收成一行那一輪）卡高從 149 改成 121：那四行少了一行，
   卡片自己就要跟著矮下來 —— 框的高度是內容撐出來的，維持 149 等於又留一塊
   空白在底下（＝他一開始講的那一句）。守門（⑰）現場量內容高，對不上就擋。所以這裡把四行**從 booked-card.json 讀出來**
   （那一份才是出處，這一頁不另外打一份字）。
   ⚠ 這是這一頁唯一一處會印出訊息文字的地方，所以第 ② 道守門掃之前會先把
     foreignObject 剝掉，另由第 ⑰ 道逐字比對它和 JSON 一不一樣。 */
const BOOKED = JSON.parse(readFileSync(join(HERE, "booked-card.json"), "utf8"));
const 填 = (t) => t.replace(/\{\{patient\}\}/g, DATE.姓名).replace(/\{\{date\}\}/g, DATE.例);
const cardLines = (key) => {
  const bubble = key === "約診紀錄查詢" ? BOOKED[key].contents[0] : BOOKED[key];
  const box = bubble.body.contents.find((c) => c.type === "box");
  if (!box) throw new Error(`booked-card.json 的「${key}」裡找不到內容那一塊 box`);
  const rows = box.contents.filter((c) => c.type === "text");
  if (!rows.length) throw new Error(`booked-card.json 的「${key}」裡一行字都沒有`);
  return rows.map((t) => ({
    size: FSIZE[t.size] || FSIZE.md,
    color: t.color || "#2A2C27",
    weight: t.weight === "bold" ? 700 : 400,
    margin: t.margin ? parseFloat(t.margin) : 0,
    /* ⚠ 日期那一行**不要** white-space: pre／nowrap：時間接在最後、不自己斷行，
       但放不下的時候要讓它折（輪播那張 207px 的卡本來就放不下）。寫 pre 的話
       畫不下也不會折，會靜靜地溢出到卡片外面；而守門（⑰）量的正是它畫出來
       幾行、以及折的時候星期幾有沒有被拆開。 */
    /* span 那一行：粗的那一段（姓名）要跟著粗 */
    html: (t.contents || [{ text: t.text, weight: t.weight }])
      .map((sp) => (sp.weight === "bold" && !t.weight
        ? `<b>${esc(填(sp.text))}</b>` : esc(填(sp.text)))).join(""),
  }));
};
const linesHtml = (rows) => rows.map((r, i) => `<p style="font-size:${r.size}px;`
  + `color:${r.color};font-weight:${r.weight};`
  + `margin:${i === 0 ? 0 : r.margin}px 0 0">${r.html}</p>`).join("");
const SC = D.狀態色;

/* 哪一顆浮水印：`(約診月份 + 約診日) % 9`（＝要請廠商照著填的那條規則）。
   同一筆約診不管是哪一種狀態都是同一顆，所以下面那四張卡共用它。 */
const 輪 = (() => {
  const m = DATE.例.match(/^\d{4}\/(\d{2})\/(\d{2})/);
  const i2 = (Number(m[1]) + Number(m[2])) % WM.length;
  return WM[i2];
})();

/* 這一顆在**哪一則**上要畫幾 px。單張往九顆的幾何平均收窄（指數內插），
   輪播是那三顆 3.08:1 的各乘一個倍率。⚠ 兩則不一樣，所以一定要帶 isCar。 */
const WM_GM = Math.exp(WM.reduce((a, s2) => a + Math.log(s2.w), 0) / WM.length);
const wmWidth = (s2, isCar) => {
  if (isCar) return Math.round(s2.w * (WM_TABLES.car[s2.n] || 1));
  const t = WM_TABLES.single[s2.n];
  return t ? Math.round(s2.w * Math.pow(WM_GM / s2.w, t)) : s2.w;
};

const WM_BOX = (1 / Math.max(...WM.map((s) => s.pct / 100 / s.ratio))).toFixed(4);

/* ── 兩則的 bubble 各要畫多寬（2026-09-14 從 line-booked 合併過來）──────
   ⚠⚠ 一樣不抄第二份：MEGA_W／CAR_W／CPAD 的唯一出處是 preview/line-booked/index.html。
     那一頁的 CAR_W 是**算出來的**（micro × 這台的比例尺），所以這裡照它的算式再算一次，
     不是把 162 抄過來 —— 抄過來的話，哪天那一階換了，這一頁會靜靜地留在舊數字上。
   ⚠ MEGA_W 在那一頁是刻意寫死 268（bubblePx("mega") 回 267，差 0.5%），這裡照讀。 */
const BUB = (() => {
  const p = readFileSync(join(ROOT, "preview", "line-booked", "index.html"), "utf8");
  const num = (name) => {
    const m = p.match(new RegExp("var " + name + " = (\\d+)"));
    if (!m) throw new Error(`line-booked 那一頁上找不到 ${name}`);
    return Number(m[1]);
  };
  const str = (name) => {
    const m = p.match(new RegExp("var " + name + " = \"([a-z]+)\""));
    if (!m) throw new Error(`line-booked 那一頁上找不到 ${name}`);
    return m[1];
  };
  const steps = Object.fromEntries([...p.matchAll(/\{ k: "([a-z]+)", b: (\d+) \}/g)]
    .map((m) => [m[1], Number(m[2])]));
  const [BLK, CPAD, MEAS_W] = ["BLK", "CPAD", "MEAS_W"].map(num);
  const [meas, want] = ["MEAS_STEP", "WANT_STEP"].map(str);
  if (!steps[meas] || !steps[want]) throw new Error("line-booked 的 bubble 階梯讀不出來");
  const k = (MEAS_W - CPAD * 2) / (BLK * steps[meas]);
  const car = Math.round(BLK * steps[want] * k + CPAD * 2);
  const mega = num("MEGA_W");
  if (car >= mega) throw new Error(`輪播算出 ${car}px、單張 ${mega}px —— 輪播不可能比單張寬`);
  return { mega, car, pad: CPAD, 現況: MEAS_W, 階: want };
})();
if (BUB.pad !== CARD.pad)
  throw new Error(`paddingAll 兩邊不一樣：line-booked ${BUB.pad}、這一頁 ${CARD.pad}`);
if (BUB.現況 !== SC.卡.w)
  throw new Error(`廠商現在跑的卡寬兩邊不一樣：line-booked ${BUB.現況}、vendor-log ${SC.卡.w}`);

const CSS = `
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:760px;margin:0 auto;padding:26px 14px 72px}
h1{font-size:1.3rem;line-height:1.5;margin:0 0 .3em}
.lede{color:var(--soft);font-size:.92rem;margin:0 0 1.5em}
.h2{font-size:1.04rem;margin:2.4em 0 .6em;padding-top:1em;border-top:1px solid var(--rule)}
.h2 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.25em}
/* 未定案：四件，其中兩件帶子項。號碼用 CSS 的計數器做成 1 與 3-1，
   所以 ol 的縮排自己接管（list-style 關掉）。 */
.now{background:var(--card);border-radius:11px;padding:14px 16px;margin:0;font-size:.93rem}
.now>b{font-size:1rem}
.now ol{list-style:none;margin:.45em 0 0;padding:0}
.now>ol{counter-reset:n}
.now>ol>li{counter-increment:n;position:relative;padding-left:2em;margin:.85em 0 0}
.now>ol>li::before{content:counter(n);position:absolute;left:0;top:0;font-weight:700}
.now .t{font-weight:600;margin:0}
.now .d{margin:.2em 0 0}
.now ol.sub{counter-reset:m;margin:.3em 0 0}
.now ol.sub>li{counter-increment:m;position:relative;padding-left:2.6em;margin:.45em 0 0}
.now ol.sub>li::before{content:counter(n) "-" counter(m);position:absolute;left:0;top:0;
  color:var(--soft)}
.note{font-size:.88rem;color:var(--soft);background:var(--card);border-radius:9px;
  padding:.7em .85em;margin:.9em 0 0}

/* ── 一則一格：左邊是那一則自己的縮圖 ─────────────────────────── */
.mg{font-size:.93rem;font-weight:600;margin:1.15em 0 .15em}
.mg:first-of-type{margin-top:.5em}
.mg .n{font-weight:400;font-size:.79rem;color:var(--soft);margin-left:.5em}
.msgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));
  gap:9px;margin:.2em 0 0}
.msg{display:flex;gap:10px;background:var(--card);border-radius:10px;padding:9px 10px}
.msg .ims{display:flex;flex-direction:column;gap:4px;flex:0 0 64px}
.msg img{width:64px;height:64px;border-radius:6px;object-fit:cover;
  background:var(--paper)}
.msg .ph{width:64px;height:64px;flex:0 0 64px;border-radius:6px;background:var(--paper)}
.msg .x{min-width:0}
.msg .nm{font-size:.9rem;font-weight:600;line-height:1.45}
.msg .mt{font-size:.79rem;color:var(--soft);line-height:1.55;margin-top:.15em}
.msg .un{display:inline-block;font-weight:400;font-size:.72rem;color:var(--soft);
  border:1px solid var(--rule);border-radius:6px;padding:.1em .42em;margin-left:.45em;
  vertical-align:.08em;white-space:nowrap}

/* ── 改版：左邊規格圖、右邊逐項 ───────────────────────────────── */
.fig{margin:.9em 0 0}
.fig img{display:block;max-width:100%;height:auto;border-radius:8px;background:var(--card)}
.fig figcaption{font-size:.8rem;color:var(--soft);margin-top:.4em}
.scroll{overflow-x:auto}
.scroll img{max-width:none}
.two{display:grid;gap:14px;margin:.9em 0 0}
@media(min-width:620px){.two{grid-template-columns:268px 1fr;align-items:start}}
ul.tick{list-style:none;margin:.2em 0 0;padding:0;font-size:.92rem}
ul.tick li{padding:.28em 0 .28em 1.15em;position:relative}
ul.tick li::before{content:"・";position:absolute;left:0;color:var(--soft)}
.rows{margin:.2em 0 0}
.row{border-top:1px solid var(--rule);padding:.8em 0}
.row .k{font-weight:600;font-size:.93rem}
.row .v{font-size:.9rem;margin-top:.25em}
.row .v i{font-style:normal;color:var(--soft);margin-right:.35em}

/* ── 廠商送來的畫面 ────────────────────────────────────────── */
.vs{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:14px 12px;margin:.5em 0 0}
.vs figure{margin:0}
.vs img{display:block;width:100%;height:auto;border-radius:8px;background:var(--card)}
.vs .t{font-size:.88rem;font-weight:600;margin:.45em 0 0}
.vs figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.15em}

/* ── 九宮格 ────────────────────────────────────────────────── */
.nine{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 10px;
  margin:.9em 0 0;background:var(--card);border-radius:11px;padding:15px 14px}
.nine figure{margin:0;text-align:center}
.nine svg{display:block;margin:0 auto;height:auto}
.nine .sw{display:flex;align-items:center;justify-content:center;
  aspect-ratio:${WM_BOX} / 1}
.nine .wm{margin-top:8px;border-top:1px dashed var(--rule)}
.nine figcaption{font-size:.72rem;color:var(--soft);line-height:1.5;margin-top:.45em}

/* ── 大小與位置的對照 ──────────────────────────────────────── */
.cmpwrap{margin:1.2em 0 0}
.cmpt{font-size:.9rem;font-weight:600;margin:0 0 .35em}
.cmprow{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));gap:14px 10px}
.cmp{margin:0}
.cmp svg{display:block;width:100%;max-width:268px;height:auto}
.cmp figcaption{font-size:.76rem;color:var(--soft);line-height:1.6;margin-top:.2em;max-width:268px}
/* 九顆各自畫在卡片上 —— 和上面那三格同一個框、同一個比例尺，才比得出來 */
.onnine{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));gap:14px 10px;
  margin:.9em 0 0}

/* ── 綁定完成的兩個方向 ────────────────────────────────────── */
.dir{background:var(--card);border-radius:11px;padding:13px 15px;margin:.9em 0 0}
.dir .t{font-size:.95rem;font-weight:600;margin:0 0 .45em}
.dir p{font-size:.89rem;margin:.5em 0 0}
.dir i{font-style:normal;color:var(--soft);margin-right:.4em}

/* ── 待答 ──────────────────────────────────────────────────── */
.grp{margin:1.6em 0 0}
.grp .t{font-size:.93rem;font-weight:600;margin:0 0 .1em}
.grp .c{font-size:.79rem;color:var(--soft);margin:0}
/* 編號要跨「★ 那幾題」與「其餘」連續，所以每一題自己帶 value ——
   別處寫著「第 6 節的第 N 題」，指的就是這個號碼。
   （這一段在樣板字串裡 ＝ 會被印進頁面，所以不要用那個三角形的警示記號 ——
   守門第 ⑨ 道掃的就是它，連這一句說明自己都會被掃到。） */
ol.ask{margin:.35em 0 0;padding:0 0 0 2.5em}
ol.ask li{padding:.55em 0;border-bottom:1px solid var(--rule);font-size:.91rem}
ol.ask li::marker{color:var(--soft);font-size:.85em}
ol.ask .y{display:block;color:var(--soft);font-size:.85rem;margin-top:.2em}
ol.ask .s{color:var(--soft);margin-right:.35em}
details{margin:.3em 0 0}
summary{font-size:.87rem;color:var(--soft);cursor:pointer;padding:.5em 0;
  border-bottom:1px solid var(--rule)}
summary::marker{color:var(--rule)}
/* ── 約診狀態那四個值的顏色：兩套色票各畫一次 ─────────────────
   卡片畫成輪播上真正的寬度（207px ＝ 268 × .772），
   欄位要吃得下手機的寬度，所以是 auto-fit 不是寫死兩欄。 */
.pal{display:grid;grid-template-columns:repeat(auto-fit,minmax(236px,1fr));
  gap:16px;margin:1em 0 0}
.pal .h{font-size:.93rem;font-weight:600;margin:0 0 .1em}
.pal .src{font-size:.79rem;color:var(--soft);line-height:1.65;margin:0 0 .55em}
.stgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(${SC.卡.w}px,1fr));
  gap:16px 12px;margin:1em 0 0}
.stwrap{margin:0;max-width:${SC.卡.w}px}
.stcard{position:relative;overflow:hidden;background:${WCARD};
  border:1px solid var(--rule);border-radius:9px}
/* 卡上那幾行 —— 第 3 節那幾張 SVG 卡（foreignObject）與第 4 節那四張 HTML 卡
   吃的是同一組規則，所以兩處的字級、行距與折行一定一樣。
   字級、顏色、粗細、上外距都是從 booked-card.json 讀回來寫在 style 上的，
   這裡只放 padding 與行高 —— 寫進 CSS 就變成第二份規格。
   字型堆疊比整頁多一個拉丁字型（Arial）當校正：手機與電腦上前面三個中文字型
   會先命中、含拉丁字，所以那一側一個像素都不會變；而產圖用的這台容器沒有那三個
   字型，拉丁數字會退到比整頁寬一成的字型，日期那一行就會在 LINE 上放得下的地方
   折行 —— 出圖與量到的折點因此都會對不上實機。中日韓的字仍然照原本的堆疊走。
   （這一段在樣板字串裡面，所以會被原字印進 HTML：不要寫警示記號，第 ⑨ 道在掃。） */
.cb{padding:${CARD.pad}px;
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",Arial,system-ui,sans-serif}
.cb p{line-height:${CARD.lh};margin:0}
.cb b{font-weight:700}
.stcard .r{display:flex;gap:9px;align-items:baseline;font-size:${CARD.籤}px;
  line-height:1;margin:${CARD.距}px 0 0}
.stcard .lb{color:var(--soft);flex:0 0 auto}
.stcard .wm{position:absolute;display:block;height:auto;pointer-events:none}
.stwrap figcaption{font-size:.76rem;color:var(--soft);line-height:1.6;margin-top:.25em}
.stlist{list-style:none;margin:.6em 0 0;padding:0;
  font-size:.79rem;color:var(--soft);line-height:1.75}
.stlist b{font-weight:600;color:var(--ink)}
.pal .h .pick{font-weight:400;font-size:.79rem;color:var(--soft);margin-left:.4em}
/* 藥丸：底是那一科的套色、字是白的，形狀照站上那一族（圓角 8.5px）。
   行高與上下內距要和 preview/line-booked/ 定案那一份**逐字相同** ——
   塊要包住「字面框」不是「行框」（同 /history/spec-tag-fit.html 那一輪），
   寫回 line-height:1.6 ＋ 上下對稱的話，這一頁會畫出一顆低 1.40px 的藥丸，
   和定案那一頁對不起來，而且畫面看起來完全正常。 */
.stcard .pill{display:inline-block;border-radius:8.5px;line-height:1;
  padding:.42em .63em .38em;color:#fff;font-weight:700}
/* ③ 那幾條規格：一條一行，不用項目符號 —— 廠商是照著填的，不是在讀文章 */
.spec{list-style:none;margin:.5em 0 0;padding:0;font-size:.9rem;line-height:1.8}
.spec>li{margin:.5em 0 0;padding-left:1.1em;position:relative}
.spec>li::before{content:"・";position:absolute;left:0;color:var(--soft)}
.h3{font-size:.98rem;margin:2em 0 .2em}
.h4{font-size:.92rem;margin:1.6em 0 .2em;color:var(--soft)}
/* 那張表在窄螢幕上一定會比版心寬 —— 自己一條捲軸，不要讓整頁橫著捲 */
.tabw{overflow-x:auto;margin:.9em 0 0;-webkit-overflow-scrolling:touch}
.tab{border-collapse:collapse;font-size:.82rem;min-width:460px}
.tab th,.tab td{border:1px solid var(--rule);padding:5px 8px;text-align:left;
  white-space:nowrap;line-height:1.5}
.tab thead th{background:var(--card);font-weight:600;font-size:.78rem}
.tab .chip{display:inline-block;width:.72em;height:.72em;border-radius:2px;
  margin-right:.4em;vertical-align:-.02em;border:1px solid rgba(0,0,0,.12)}
.tab .was,.stwrap .was{color:var(--soft);font-weight:400}
.foot{margin:2.8em 0 0;padding-top:1.1em;border-top:1px solid var(--rule);
  font-size:.83rem;color:var(--soft);line-height:1.85}
a{color:#214d48}
code{font-size:.92em}
`.trim();

/* ── ① 現在會自動送出哪幾則 ────────────────────────────────── */
/* ⚠ `圖` 可以是一個字串，也可以是一組（2026-09-12：⑤ 要同時看得到公版藍色卡
   與我們新做的那一張）。兩張時**直向疊**，不要並排 —— 那一欄只有 64px 寬，
   並排會把右邊的字擠到剩 80 幾 px（格子最窄只有 232px）。 */
/* ⚠⚠ 2026-09-12 使用者：「12 則照順序看有點混亂　先區分成　已完成　待調整
   （或是有落差）」—— 所以這一節分兩組排，**但 ①~⑫ 那組編號一個都不換**：
   廠商兩封回信都照那組編號在講，那是雙方共用的詞。組別由資料自己宣告
   （每一列的 `組`），不要從「狀態」那串字去猜。 */
const GROUPS = [
  { k: "done", 標: "已完成" },
  { k: "open", 標: "待調整（或是有落差）" },
];
{
  const bad = D.訊息.列.filter((r) => !GROUPS.some((g) => g.k === r.組));
  if (bad.length)
    throw new Error("這幾列沒有宣告組別（done／open）：" + bad.map((r) => r.n).join("、"));
}
/* ⚠⚠⚠ 2026-09-13 使用者：「後面待調整的細部內容部分　依照剛剛的文字排序　重新整理」
   —— 抬頭那一塊換成「未定案」四件之後，這一組還照圈號 ③④⑤⑥⑦⑧ 在排，
   和上面那四件對不起來。**排序照那四件走，圈號一個都不換**（同 09-12 分兩組那一輪：
   ①~⑫ 是雙方共用的詞）。⚠ 對照由資料自己宣告（每一列的 `未定案` 寫那一件的標題），
   不要在這裡寫一份對照表 —— 抬頭那四件改了名字，這裡會 throw 而不是靜靜地排錯。 */
const 未定案序 = new Map(D.現在.列.map((x, i) => [x.標, i + 1]));
{
  for (const r of D.訊息.列) {
    if (r.組 !== "open") {
      if (r.未定案) throw new Error(`${r.n} 在「已完成」那一組，不可以宣告未定案`);
      continue;
    }
    if (!r.未定案) throw new Error(`${r.n} 沒有宣告它屬於未定案的哪一件`);
    if (!未定案序.has(r.未定案))
      throw new Error(`${r.n} 宣告的「${r.未定案}」不在抬頭那四件裡`);
  }
}
let seen = 0;
const msgs = GROUPS.map((g) => {
  const rows = D.訊息.列
    .filter((r) => r.組 === g.k)
    .map((r, i) => [r, i])
    .sort((a, b) =>
      (未定案序.get(a[0].未定案) || 0) - (未定案序.get(b[0].未定案) || 0) || a[1] - b[1])
    .map(([r]) => r);
  const cards = rows.map((r) => {
    const ims = [].concat(r.圖 || []).filter(Boolean);
    const lazy = seen++ > 3;
    return `<div class="msg">${
    ims.length
      ? `<span class="ims">${ims.map((x, k) => `<img src="t-${esc(x)}.jpg" width="210" height="210" ${
          lazy ? 'loading="lazy" ' : ""}alt="${esc(r.名)}的模擬圖${ims.length > 1 ? `（${k + 1}）` : ""}">`).join("")}</span>`
      : `<span class="ph"></span>`
  }<div class="x">
<p class="nm">${esc(r.n)}　${esc(r.名)}${
  r.未定案 ? `<span class="un">未定案 ${未定案序.get(r.未定案)}</span>` : ""}</p>
<p class="mt">${esc(r.時機)}／${esc(r.誰送)}送・${esc(r.狀態)}<br>${b(r.註)}</p>
</div></div>`;
  }).join("\n");
  return `<p class="mg">${esc(g.標)}<span class="n">${rows.length} 則</span></p>
<div class="msgs">
${cards}
</div>`;
}).join("\n");

/* ── ② 09-10 改版 ─────────────────────────────────────────── */
const 改 = D.改版;
const revisedHtml = (P = "") => `
<div class="two">
<figure class="fig">
<img src="../line-booked/shot-booked.png" width="${pngWH("../line-booked/shot-booked.png")[0]}"
  height="${pngWH("../line-booked/shot-booked.png")[1]}" loading="lazy"
  alt="我們送過去的預約成功通知規格圖">
<figcaption>我們送過去的規格圖（預約成功通知）</figcaption>
</figure>
<div>
<p style="font-size:.93rem;margin:0"><b>對上的六件</b></p>
<ul class="tick">${改.對上.map((t) => `<li>${b(t)}</li>`).join("")}</ul>
</div>
</div>

<p style="font-size:.93rem;margin:1.4em 0 0"><b>廠商送來的畫面</b></p>
<p style="font-size:.88rem;color:var(--soft);margin:.25em 0 0">${b(改.圖說)}</p>
<div class="vs">
${改.圖.map((g) => `<figure>
<a href="${esc(P + g.檔)}"><img src="${esc(P + g.檔)}" width="${g.w}" height="${g.h}" loading="lazy"
  alt="${esc(g.標)}"></a>
<p class="t">${esc(g.標)}</p>
<figcaption>${b(g.說)}</figcaption>
</figure>`).join("\n")}
</div>

<div class="rows" style="margin-top:1.4em">
<p style="font-size:.93rem;margin:0 0 .2em"><b>還開著的 ${改.未對上.length} 件</b></p>
${改.未對上.map((x) => `<div class="row"><p class="k">${b(x.事)}</p><p class="v">${b(x.說明)}</p></div>`).join("\n")}
</div>

<div class="rows" style="margin-top:1.4em">
<p style="font-size:.93rem;margin:0 0 .2em"><b>看過之後收掉的 ${改.收掉.length} 件</b></p>
${改.收掉.map((x) => `<div class="row"><p class="k">${b(x.事)}</p><p class="v">${b(x.說明)}</p></div>`).join("\n")}
</div>

<figure class="fig">
<div class="scroll"><img src="../line-booked/shot-query.png" width="${pngWH("../line-booked/shot-query.png")[0]}"
  height="${pngWH("../line-booked/shot-query.png")[1]}"
  style="width:${pngWH("../line-booked/shot-query.png")[0] / 3}px" loading="lazy"
  alt="我們送過去的約診紀錄查詢規格圖（輪播）"></div>
<figcaption>我們送過去的規格圖（約診紀錄查詢，輪播．這一條可以左右滑）。日期會被截斷的是這一種
micro 卡，不是單張的 mega 卡。</figcaption>
</figure>`.trim();
const revised = revisedHtml();

/* ── ③ 浮水印九顆 ─────────────────────────────────────────── */
/* ⚠⚠ 兩張是同一份幾何、同一個相對寬度，差的只有濃度：
   上面是原色（看得出形狀與是哪一科），下面是它在卡片上真正的樣子。
   ⚠ 九宮格的底本來就是 --card ＝ 卡片色，所以下面那一張不必再墊一層底。 */
const swatch = (s, a, col) =>
  `<svg viewBox="0 0 ${s.vw} ${s.vh}" width="${s.vw}" height="${s.vh}" style="width:${s.pct}%"
  role="img" aria-label="${a === 1 ? "原色" : "浮水印濃度"} ${esc(s.科)} ${s.n}"><g transform="${s.gt}"><path
  fill="${col || s.色}"${a === 1 ? "" : ` fill-opacity="${a}"`} fill-rule="evenodd" d="${s.d}"/></g></svg>`;

/* 2026-09-13 定案：浮水印的顏色換成淡墨素色。色碼的唯一出處是 vendor-log.json，
   這裡不寫死 —— 換一顆顏色，九宮格底下那一排與那九張卡會一起跟著換。 */
const INK = D.浮水印.顏色.值;

const nine = `<div class="nine">
${WM.map((s) => `<figure>
<span class="sw">${swatch(s, 1)}</span>
<span class="sw wm">${swatch(s, WM_A, INK)}</span>
<figcaption>${esc(s.科)}<br>${esc(s.n)}・原寬 ${s.w}px</figcaption>
</figure>`).join("\n")}
</div>`;

/* ── ③之二 大小與位置的對照 ───────────────────────────────────
   同一張卡畫兩次（我們要的／廠商送來的），形狀與顏色完全一樣，差的只有大小與位置。
   ⚠ 形狀仍然是從 brand/shapes/ 讀回來的那一份，不抄第二份。
   ⚠⚠ 2026-09-13 使用者：「模擬圖放了兩個版面　但我要的應該只是其中一個」——
   他挑的是**溢出 18／10px** 那一種，所以「我們的 JSON（貼齊卡內）」那一格整個
   拿掉了（42-7 記著的那個「我們自己送過去的兩份互相矛盾」到此收掉）。
   ⚠ 那兩個數字的唯一出處仍然是資料，這裡不寫死。 */
/* 兩張卡的內容：單張的預約成功通知（四行）與輪播上的約診紀錄查詢（兩行）。 */
const MEGA = cardLines("預約成功通知");
const MICRO = cardLines("約診紀錄查詢");
if (MEGA.length !== 4) throw new Error(`預約成功通知讀出來是 ${MEGA.length} 行，不是四行`);
if (MICRO.length !== 2) throw new Error(`約診紀錄查詢讀出來是 ${MICRO.length} 行，不是兩行`);
const byName = Object.fromEntries(WM.map((s2) => [s2.n, s2]));
const cmp = D.浮水印.對照;
const cardBox = cmp.卡;
let plateN = 0;
const plate = (shape, g, col) => {
  const s2 = byName[shape];
  if (!s2) throw new Error(`對照表用到不存在的形狀 ${shape}`);
  const h = g.size / s2.ratio;
  const x = cardBox.w - g.size + g.right;
  const y = cardBox.h - h + g.bottom;
  /* ⚠ id 用流水號，不要從 標／size／right 拼 —— 兩張畫一樣大、標又一樣長的時候
     會撞在一起，而撞到的那一張會去吃別人的 clipPath（畫面上看起來很正常）。 */
  const id = `clip-${++plateN}`;
  const 色 = col || s2.色;
  /* 卡片自己會把跑出去的那一塊切掉 —— 所以一定要 clipPath，不然畫出來
     和廠商實際看到的不一樣（那正是這一節在比的東西） */
  /* 卡片右下留一塊空白，跑出卡片的那一截才畫得下（三格用同一個框，才比得出來） */
  const PR = 26, PB = 18, PL = 6, PT = 6;
  /* 卡上那兩行：〔病人姓名〕與日期。日期的寫法照廠商 09-10 那一版，
     唯一出處是 vendor-log.json 的「日期」——這裡不寫死。
     ⚠⚠ 用 foreignObject 讓瀏覽器自己排，不用 <text> ＋ 自己估字寬 ——
        估出來的寬度會跟著字型跑（這台容器裡沒有 Noto Sans TC，同一行量到的
        寬度差 6.6%），估錯的那一天字會靜靜地畫到卡片外面而且不報錯。
        底下第 4 節那四張 HTML 卡吃的是同一組 .cb 規則，兩處一定長一樣。
     ⚠⚠ 四行是從 booked-card.json 讀出來的真正內容，不是這裡打的 ——
        只畫兩行的話，這張照四行量出來的卡底下會空一大塊，讀起來像「排完字
        之後另外塞一顆 logo、把對話框往下撐開」，而浮水印本來就該墊在字底下。
     ⚠ 浮水印畫在文字**上面**，和那份 Flex 的 contents 順序一樣
       （image 排在文字那一塊後面），這樣才看得出它會不會蓋到字。 */
  const 文 = `<foreignObject x="0" y="0" width="${cardBox.w}" height="${cardBox.h}"`
    + `><div xmlns="http://www.w3.org/1999/xhtml" class="cb">${linesHtml(MEGA)}</div>`
    + `</foreignObject>`;
  return `<figure class="cmp">
<svg viewBox="${-PL} ${-PT} ${cardBox.w + PL + PR} ${cardBox.h + PT + PB}"
  width="${cardBox.w + PL + PR}" height="${cardBox.h + PT + PB}"
  role="img" aria-label="${esc(g.標)}：浮水印 ${g.size}px，往右 ${g.right}、往下 ${g.bottom}">
<defs><clipPath id="${id}"><rect x="0" y="0" width="${cardBox.w}" height="${cardBox.h}" rx="9"/></clipPath></defs>
<rect x="0" y="0" width="${cardBox.w}" height="${cardBox.h}" rx="9" fill="${WCARD}"/>
${文}
<g clip-path="url(#${id})" opacity="${WM_A}">
<svg x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${g.size}" height="${h.toFixed(2)}"
  viewBox="0 0 ${s2.vw} ${s2.vh}" preserveAspectRatio="none"><g transform="${s2.gt}"><path
  fill="${色}" fill-rule="evenodd" d="${s2.d}"/></g></svg>
</g>
<rect x=".5" y=".5" width="${cardBox.w - 1}" height="${cardBox.h - 1}" rx="9"
  fill="none" stroke="#c9ccc9"/>
<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${g.size}" height="${h.toFixed(2)}"
  fill="none" stroke="${色}" stroke-width="1" stroke-dasharray="3 2" opacity=".55"/>
</svg>
<figcaption><b>${esc(g.標)}</b>　${g.size}px・卡寬的 ${(g.size / cardBox.w * 100).toFixed(1)}%<br>${b(g.註)}</figcaption>
</figure>`;
};
const compare = cmp.組.map((row) => `<div class="cmpwrap">
<p class="cmpt">${esc(row.名)}</p>
<div class="cmprow">${row.格.map((g) => plate(row.形, g)).join("\n")}</div>
</div>`).join("\n");

/* ── ③之三 九顆各自畫在卡片上該有的樣子 ───────────────────────
   2026-09-13 使用者：「9 個 logo 的效果都要放上去，給廠商看到，目前只有針對廠商
   放的兩個做比對，另外七個也要先做好顯示上去」。同一個框、同一個比例尺、
   同一支 plate()，差的只有寬度（每一顆自己的）與顏色（定案的淡墨）。 */
/* ⚠⚠ 這九顆要和上面那一節「我們要的」同一種擺法（2026-09-13 定案：往右下溢出）——
   兩處不一樣的話，同一頁上會同時出現兩種浮水印的位置，而版面完全正常。
   所以偏移量從對照表那一格讀回來，不要在這裡另外寫一組數字。 */
const OFF = (() => {
  const gs = cmp.組.map((r) => r.格.find((g) => g.標 === "我們要的"));
  if (gs.some((g) => !g)) throw new Error("對照表裡找不到「我們要的」那一格");
  const [r, bm] = [gs[0].right, gs[0].bottom];
  if (gs.some((g) => g.right !== r || g.bottom !== bm))
    throw new Error("「我們要的」那幾格的偏移量彼此不一樣：" + JSON.stringify(gs.map((g) => [g.right, g.bottom])));
  return { right: r, bottom: bm };
})();
/* ── {{值:…}} ─────────────────────────────────────────────────────────
   ⚠⚠ 規格那一節裡的每一個數字（順序、兩則的卡片寬、內距、底色、溢出量、濃度）
     **都不要打進資料** —— 打進去就是第二份，改一邊會靜靜地分家。資料裡寫
     {{值:名字}}，在這裡現算。⚠ 這一道要排在 OFF 之後：溢出量是從對照表讀回來的。
   ⚠ 頭上那一道 walk 跑得太早（那時 WM／BUB 都還沒算出來），所以分成兩道。 */
(() => {
  const V = {
    順序: WM.map((x) => x.n).join(" "),
    濃度: String(Math.round(WM_A * 100)),
    單張卡寬: String(BUB.mega),
    輪播卡寬: String(BUB.car),
    現況卡寬: String(BUB.現況),
    卡寬差: String(BUB.mega - BUB.car),
    窄多少: String(BUB.現況 - BUB.car),
    內距: String(BUB.pad),
    底色: WCARD.toUpperCase(),
    右溢: String(OFF.right),
    下溢: String(OFF.bottom),
  };
  const fix = (v) => v.replace(/\{\{值:([^}]+)\}\}/g, (_, k) => {
    if (!(k in V)) throw new Error(`{{值:${k}}} 沒有這個值`);
    return V[k];
  });
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach((v, i) => {
      if (typeof v === "string") n[i] = fix(v); else walk(v);
    });
    if (n && typeof n === "object") for (const [k, v] of Object.entries(n)) {
      if (typeof v === "string") n[k] = fix(v); else walk(v);
    }
  };
  walk(D);
})();

const onCard = `<div class="onnine">
${WM.map((s) => plate(s.n, {
  標: s.科, size: wmWidth(s, false), right: OFF.right, bottom: OFF.bottom,
  註: `${s.n}・往右下溢出 ${OFF.right}／${OFF.bottom}px，右下那一塊被卡片切掉`
    + (wmWidth(s, false) === s.w ? "" : `（單張這一欄：${s.w} → ${wmWidth(s, false)}px）`),
}, INK)).join("\n")}
</div>`;

/* ── ③之一 九顆要填什麼：一張算出來的表 ───────────────────────
   2026-09-14 從 preview/line-booked/ 合併過來（使用者：「把 line-booked 提案頁裡的
   資料合併回 line-vendor」）。
   ⚠⚠⚠ 這張表**不是在這裡算的，是從 booked-card.json 的 _浮水印 讀出來的** ——
     那一份才是要交出去的東西，頁面上印一份自己算的話，交出去的 JSON 和廠商
     照著看的表有一天會分家，而兩邊各自都很正常。
   ⚠ 但也不是照單全收：每一列都拿 wmWidth()（那兩張定案的倍率表）與 wm-sizes.json
     的顏色、長寬比對一次，對不上就 throw —— 那一份 JSON 是手維護的。 */
const WMTAB = (() => {
  const t = BOOKED._浮水印;
  if (!t) throw new Error("booked-card.json 裡沒有 _浮水印 那張表");
  const names = Object.keys(t);
  if (names.length !== WM.length)
    throw new Error(`booked-card.json 的 _浮水印 有 ${names.length} 顆，wm-sizes.json 是 ${WM.length} 顆`);
  return WM.map((s2) => {
    const r = t[s2.n];
    if (!r) throw new Error(`booked-card.json 的 _浮水印 裡沒有 ${s2.n}`);
    const px = (v, 欄) => {
      const m = String(v).match(/^(\d+)px$/);
      if (!m) throw new Error(`${s2.n} 的 ${欄} 不是 NNNpx：${v}`);
      return Number(m[1]);
    };
    const 單 = px(r.watermark_size_single, "watermark_size_single");
    const 輪 = px(r.watermark_size_carousel, "watermark_size_carousel");
    if (單 !== wmWidth(s2, false))
      throw new Error(`${s2.n} 單張那一欄 booked-card.json 寫 ${單}px，定案那張表算出來是 ${wmWidth(s2, false)}px`);
    if (輪 !== wmWidth(s2, true))
      throw new Error(`${s2.n} 輪播那一欄 booked-card.json 寫 ${輪}px，定案那張表算出來是 ${wmWidth(s2, true)}px`);
    if ((r.色 || "").toLowerCase() !== s2.色.toLowerCase())
      throw new Error(`${s2.n} 的色碼兩邊不一樣：booked-card.json ${r.色}、wm-sizes.json ${s2.色}`);
    const 比 = String(r.watermark_ratio || "");
    if (!/^[\d.]+:1$/.test(比)) throw new Error(`${s2.n} 的 aspectRatio 不是 X:1：${比}`);
    if (Math.abs(parseFloat(比) - s2.ratio) > 0.005)
      throw new Error(`${s2.n} 的 aspectRatio ${比} 對不上 wm-sizes.json 的 ${s2.ratio}`);
    if (!String(r.url || "").includes(`wm-${s2.n}-`))
      throw new Error(`${s2.n} 的 url 對不上：${r.url}`);
    return { s: s2, 單, 輪, 比, url: r.url };
  });
})();
const wmTable = `<div class="tabw"><table class="tab"><thead><tr>
<th>形狀</th><th>色碼</th><th>科別（色的出處）</th><th><code>aspectRatio</code></th>
<th>單張<br><code>mega</code></th><th>輪播<br><code>micro</code></th>
</tr></thead><tbody>
${WMTAB.map((r) => `<tr><td><b>${esc(r.s.n)}</b></td>
<td><span class="chip" style="background:${r.s.色}"></span><code>${esc(r.s.色)}</code></td>
<td>${esc(r.s.科)}</td><td><code>${esc(r.比)}</code></td>
<td><b>${r.單}</b>px${r.單 === r.s.w ? "" : ` <span class="was">（原 ${r.s.w}）</span>`}</td>
<td><b>${r.輪}</b>px${r.輪 === r.s.w ? "" : ` <span class="was">（原 ${r.s.w}）</span>`}</td></tr>`).join("\n")}
</tbody></table></div>`;

/* ── ④ 約診狀態那四個值的顏色 ─────────────────────────────────
   2026-09-12 使用者：現況那張卡上表示會到的那個值本來就是綠字，所以新版那四個
   值也要套色、加粗，並且用兩套色票各做一次給他看。
   對比度**在這裡現算**，不寫進資料 —— 寫死的話哪天換一顆顏色，數字不會跟著動。 */
/* ── ④之〇 定案（2026-09-12 一格一格挑完的）────────────────────
   放在整節最前面：底下那幾格是走到這裡的過程，這一段才是要拿給廠商的那一份。
   ⚠ 這個註解在樣板字串外面 —— 寫在裡面會被原字印進 HTML（第 ⑨ 道守門擋得到）。 */
const SET = SC.定案, PILLVAL = SC.藥丸.值;
/* ⚠⚠ 四張卡各掛一個值 —— 一張卡上看不出四種的相對份量（同 line-booked 第 ②之二 節）。
   卡片畫成輪播上真正的寬度，兩行內容與日期的寫法照廠商 09-10 那一版，
   浮水印是定案那一種（淡墨、往右下溢出，偏移量和第 3 節那九張同一個出處）。
   ⚠ 日期在這個寬度上會折成兩行 —— 那正是「那一格不要限制行數」的樣子，不是破圖。 */
const wmSvg = (s2, off, isCar = true, w0) => {
  const w = w0 || wmWidth(s2, isCar);
  return `<svg class="wm" width="${w}" height="${(w / s2.ratio).toFixed(2)}"
  viewBox="0 0 ${s2.vw} ${s2.vh}" preserveAspectRatio="none" aria-hidden="true"
  style="right:${-off.right}px;bottom:${-off.bottom}px"><g transform="${s2.gt}"><path
  fill="${INK}" fill-opacity="${WM_A}" fill-rule="evenodd" d="${s2.d}"/></g></svg>`;
};
/* ── ③之三 輪播那一則（約診紀錄查詢）──────────────────────────
   九顆各畫一次 ＋ 你們送來的那一張的大小對照。
   ⚠⚠ 卡片畫成 SC.卡.w（＝你們現在跑的那一階）不是規格的 micro —— 這樣它和
     第 4 節那四張、和你們送來的截圖才比得起來；換階那一件寫在規格那一節裡。
   ⚠ 用的是第 4 節那一套 .stcard／.cb 規則（多一個 class 而已），所以兩節的
     字級、行距與折行一定一樣；守門（⑰）是靠 class 分辨兩節的卡的。 */
const carCard = (s2, w0, 說) => `<figure class="stwrap">
<div class="carcard stcard cb">
${linesHtml(MICRO)}
${wmSvg(s2, OFF, true, w0)}
</div>
<figcaption>${說}</figcaption>
</figure>`;
const carNine = `<div class="stgrid">
${WM.map((s2) => carCard(s2, null,
  `<b>${esc(s2.科)}</b>　${esc(s2.n)}・${wmWidth(s2, true)}px`
  + `・卡寬的 ${(wmWidth(s2, true) / SC.卡.w * 100).toFixed(1)}%`
  + (wmWidth(s2, true) === s2.w ? "" : `<br><span class="was">輪播那一欄：${s2.w} → ${wmWidth(s2, true)}px</span>`))).join("\n")}
</div>`;
const CARCMP = (() => {
  const c = D.浮水印.對照.輪播;
  if (!c || !Array.isArray(c.格) || c.格.length !== 2)
    throw new Error("vendor-log.json 的浮水印.對照.輪播 要有兩格");
  const s2 = byName[c.形];
  if (!s2) throw new Error(`輪播那一節用到不存在的形狀 ${c.形}`);
  const mine = c.格.find((g) => g.標 === "我們要的");
  if (!mine) throw new Error("輪播那一節找不到「我們要的」那一格");
  if (mine.size !== wmWidth(s2, true))
    throw new Error(`輪播對照的「我們要的」寫 ${mine.size}px，定案那張表算出來是 ${wmWidth(s2, true)}px`);
  return c;
})();
const carCompare = `<div class="stgrid">
${CARCMP.格.map((g) => carCard(byName[CARCMP.形], g.size,
  `<b>${esc(g.標)}</b>　${g.size}px・卡寬的 ${(g.size / SC.卡.w * 100).toFixed(1)}%<br>${b(g.註)}`)).join("\n")}
</div>`;

const settledHtml = () => `<div class="stgrid">
${PILLVAL.map((v) => `<figure class="stwrap">
<div class="stcard cb">
${linesHtml(MICRO)}
<p class="r"><span class="lb">約診狀態</span><span class="pill"
  style="background:${v.色}">${esc(v.名)}</span></p>
${wmSvg(輪, OFF)}
</div>
<figcaption>${esc(v.名)}　${esc(v.科)}　<code>${v.色}</code></figcaption>
</figure>`).join("\n")}
</div>
<p class="note">${b(SC.卡.說)}這四張的浮水印是這一筆日期算出來的那一顆（<code>${輪.n}</code>）。</p>
<div class="rows" style="margin-top:1.2em">
${SET.條.map(([k, t]) => `<div class="row"><p class="k">${esc(k)}</p><p class="v">${b(t)}</p></div>`).join("\n")}
<div class="row"><p class="k">先問的是哪一題</p><p class="v">${b(SET.前提)}</p></div>
<div class="row"><p class="k">還要一支測試訊息</p><p class="v">${b(SET.要一支測試訊息)}</p></div>
</div>`;
const settled = settledHtml();

/* ── 5 綁定完成的兩個方向 ─────────────────────────────────────
   使用者 2026-09-11 指定整理的一節。圖是廠商自己的回覆（他指定要附），
   ⚠ 別家診所的畫面仍然不進 repo、不上頁面 —— 那是另一件事。
   ⚠⚠ 2026-09-13：這一節只留「現在長什麼樣 ＋ 兩個方向 ＋ 一起解」。
      我們自己怎麼讀那張畫面（說明的是／還沒說明的／順帶）與別家帳號那三種現象
      都留在 vendor-log.json 裡、不再印出來。 */
const bind = (() => {
  const B = D.綁定;
  const dir = (x) => `<div class="dir">
<p class="t">${esc(x.標)}</p>
<p><i>要的是</i>${b(x.要的)}</p>
<p><i>對方說</i>${b(x.對方)}</p>
<p><i>現在知道的</i>${b(x.現在知道的)}</p>
<p><i>還沒有答案的</i>${b(x.還沒有答案的)}</p>
<p><i>別家的畫面</i>${b(x.別家)}</p>
</div>`;
  /* 2026-09-12：先擺「我們自己現在長什麼樣」—— 兩個方向都是為了這一張畫面。
     ⚠ 門號在出圖時就遮掉了（repo 是公開的），不是靠 CSS 蓋。 */
  const now = B.現況 ? `<div class="two">
<figure class="fig">
<a href="${esc(B.現況.圖.檔)}"><img src="${esc(B.現況.圖.檔)}" width="${B.現況.圖.w}" height="${B.現況.圖.h}"
  alt="綁定完成那一刻，病人那一側看到的畫面"></a>
<figcaption>${b(B.現況.圖.說)}</figcaption>
</figure>
<div class="dir">
<p class="t">${esc(B.現況.標)}</p>
<p><i>看到</i>${b(B.現況.看到)}</p>
</div>
</div>

<h3 style="font-size:.95rem;margin:1.8em 0 .2em">廠商的回覆，與兩個處理方向</h3>` : "";
  return `${now}<div class="two">
<figure class="fig">
<a href="${esc(B.圖.檔)}"><img src="${esc(B.圖.檔)}" width="${B.圖.w}" height="${B.圖.h}"
  loading="lazy" alt="廠商 2026-09-10 的回覆"></a>
<figcaption>${b(B.圖.說)}</figcaption>
</figure>
<div>
${B.方向.map(dir).join("\n")}
</div>
</div>

<p class="note">${b(B.一起解)}</p>`;
})();

/* ── ⑧ 待答 ───────────────────────────────────────────────── */
/* ⚠⚠ 2026-09-13 起只印「只有廠商能答」那一組 —— 後台／診所／素材那三組是
   我們自己要去做的事，資料留在 vendor-log.json 裡。 */
const groupKeys = ["廠商"];
/* ⚠ value 要帶著它在整組裡的號碼 —— ★ 那幾題被抽到前面，不帶的話 <ol> 會從 1
   重新數，而別處寫著「第 6 節的第 N 題」。 */
const item = (x, n) => `<li value="${n}">${x.急 ? `<span class="s">★</span>` : ""}${b(x.問)}${
  x.為 ? `<span class="y">${b(x.為)}</span>` : ""}</li>`;
/* ★ 的永遠攤開，其餘收進 <details> —— 整頁一眼看得完，清單一項都沒有少。
   ⚠ 用 details 不用 JS（守門連 script 標籤都擋）。 */
const groups = groupKeys.map((k) => {
  const g = D.待答[k];
  const numbered = g.列.map((x, i) => [x, i + 1]);
  const hot = numbered.filter(([x]) => x.急);
  const rest = numbered.filter(([x]) => !x.急);
  return `<div class="grp">
<p class="t">${esc(g.標)}</p>
<p class="c">${g.列.length} 題${hot.length ? "・其中 " + hot.length + " 題最先要（★）" : ""}</p>
${hot.length ? `<ol class="ask">\n${hot.map(([x, n]) => item(x, n)).join("\n")}\n</ol>` : ""}
${rest.length ? `<details><summary>其餘 ${rest.length} 題</summary>
<ol class="ask">
${rest.map(([x, n]) => item(x, n)).join("\n")}
</ol></details>` : ""}
</div>`;
}).join("\n");

const total = groupKeys.reduce((n, k) => n + D.待答[k].列.length, 0);
const hotAll = groupKeys.reduce((n, k) => n + D.待答[k].列.filter((x) => x.急).length, 0);

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 訊息　現況與請求</title>
<style>
${CSS}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 訊息　現況與請求</h1>
<p class="lede">芳仁牙醫診所　更新於 ${esc(D.更新日)}<br>
六節：在跑的十二則、${esc(改.日)} 的改版逐項、浮水印、約診狀態那一列、綁定完成、還沒有答案的題目。<br>
七則訊息的文字、圖檔網址與 Flex 規格在另一頁：<a href="/preview/line-spec/">/preview/line-spec/</a></p>

<div class="now">
<b>${esc(D.現在.標)}</b>
<ol>
${D.現在.列.map((x) => `<li>
<p class="t">${esc(x.標)}</p>
${x.子 ? `<ol class="sub">${x.子.map((t) => `<li>${b(t)}</li>`).join("\n")}</ol>`
        : `<p class="d">${b(x.說)}${x.連 ? ` <a href="${esc(x.連)}">${esc(x.連)}</a>` : ""}</p>`}
</li>`).join("\n")}
</ol>
</div>

<h2 class="h2">1　這個帳號會自動送出哪幾則<span class="t">${D.訊息.列.length} 則．圖是我們那一則的模擬圖</span></h2>
${msgs}
<p class="note">${b(D.訊息.缺口)}</p>

<h2 class="h2">2　${esc(改.日)} 的改版<span class="t">${esc(改._說明)}</span></h2>
${revised}

<h2 class="h2">3　浮水印那九顆<span class="t">挑哪一顆、每一顆要填什麼、兩則各要畫多寬</span></h2>

<h3 class="h3">③之一　挑哪一顆</h3>
<ul class="spec">${D.浮水印.規格.挑哪一顆.map((t) => `<li>${b(t)}</li>`).join("\n")}</ul>

<h3 class="h3">③之二　每一顆要填什麼</h3>
<ul class="spec">${D.浮水印.規格.欄位.map((t) => `<li>${b(t)}</li>`).join("\n")}</ul>
${wmTable}
<p class="note">${b(D.浮水印.規格.表說)}</p>

<h3 class="h3">③之三　卡片本身</h3>
<ul class="spec">${D.浮水印.規格.卡片.map((t) => `<li>${b(t)}</li>`).join("\n")}</ul>

<div class="now" style="margin:1.6em 0 1.4em"><b>位置與大小・定案</b>
<ol>${D.浮水印.定案.條.map((t) => `<li><p class="d">${b(t)}</p></li>`).join("\n")}</ol></div>
<p class="note">${b(D.浮水印.顏色.說)}<br>
每一格<b>上面是原色</b>（看得出形狀與是哪一科），<b>虛線底下是它壓在卡片上真正的樣子</b>
（淡墨 <code>${esc(INK)}</code>，濃度 ${(WM_A * 100).toFixed(0)}%）。
兩張是同一份幾何、同一個相對寬度 —— <b>九顆的寬度不一樣是刻意的</b>（按墨的面積正規化，看起來才一樣重）。</p>
${nine}
<div class="rows">
<div class="row"><p class="k">現況</p><p class="v">${b(D.浮水印.現況)}</p></div>
<div class="row"><p class="k">大小與位置</p><p class="v">${b(D.浮水印.大小與位置)}</p></div>
</div>

<h3 class="h3">③之四　預約成功通知（單張 <code>mega</code>）</h3>
<h4 class="h4">同一張卡畫${cmp.組[0].格.length}次</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${esc(cmp._說明)}</p>
${compare}
<p class="note">${b(cmp.量)}</p>

<h4 class="h4">九顆各自畫在卡片上該有的樣子</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(D.浮水印.九顆上卡)}</p>
${onCard}

<h3 class="h3">③之五　約診紀錄查詢（輪播 <code>micro</code>）</h3>
<p class="note">${b(D.浮水印.規格.輪播模擬圖畫多寬)}</p>

<h4 class="h4">九顆各自畫在卡片上該有的樣子</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(D.浮水印.九顆上卡輪播)}</p>
${carNine}

<h4 class="h4">同一張卡畫${CARCMP.格.length}次</h4>
<p style="font-size:.88rem;color:var(--soft);margin:0">${b(CARCMP._說明)}</p>
${carCompare}

<div class="rows" style="margin-top:1.4em">
<div class="row"><p class="k">要換的規則</p><p class="v">${b(D.浮水印.要確認)}</p></div>
<div class="row"><p class="k">請照這樣填</p><p class="v">${b(D.浮水印.接下來問什麼)}</p></div>
</div>

<h2 class="h2">4　約診狀態那一列<span class="t">2026-09-12 定案・卡片畫成輪播上真正的 ${SC.卡.w}px 寬</span></h2>
<p class="note">${b(SET._說明)}</p>
${settled}

<h2 class="h2">5　綁定完成<span class="t">現在長什麼樣，以及兩個處理方向</span></h2>
${bind}

<h2 class="h2">6　還沒有答案的 ${total} 題<span class="t">★ 是最先要的 ${hotAll} 題</span></h2>
${groups}

<p class="foot">
這一頁是靜態的，內容有更新會直接改在同一個網址上。<br>
七則訊息的文字、圖檔網址與 Flex 規格：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

/* ⚠⚠ 這一支同時是 build-card-spec.mjs 的模組（那一頁只留定案與現況對照，
   卡片、浮水印、那張表的畫法全部從這裡 import，不抄第二份）。所以寫檔要關在
   「直接執行」底下 —— 不關的話，產另一頁時會順手把這一頁也重寫一次。 */
const 直接執行 = process.argv[1] === fileURLToPath(import.meta.url);
if (直接執行) {
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);
console.log(`✓ preview/line-vendor/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  在跑的訊息 ${D.訊息.列.length} 則・改版對上 ${改.對上.length}／還沒對上 ${改.未對上.length}`);
console.log(`  浮水印 ${WM.length} 顆（淡墨 ${INK}，九顆都畫在卡片上）・定案 ${SET.條.length} 條`);
console.log(`  未定案 ${D.現在.列.length} 件（子項 ${D.現在.列.reduce((n, x) => n + (x.子 ? x.子.length : 0), 0)} 條）・改版還開著 ${改.未對上.length} 件／收掉 ${改.收掉.length} 件`);
console.log(`  印出來的是廠商那一組 ${total} 題（最先要 ${hotAll} 題）；後台 ${D.待答.後台.列.length}／診所 ${D.待答.診所.列.length}／素材 ${D.待答.素材.列.length} 題留在 JSON 裡沒有印`);
}

/* build-card-spec.mjs 用得到的那幾塊（定案規格與現況對照）。 */
export {
  CSS, esc, b, pngWH, D, DATE, SC, SET, WM, INK, WM_A, cmp, cardBox, CARCMP,
  revisedHtml, wmTable, nine, compare, onCard, carNine, carCompare, settledHtml, settled,
  設節表,
  /* build-brief.mjs（待調整項目總整理）另外用到的：卡片的字、兩則的寬度、浮水印的幾何 */
  OFF, wmWidth, cardLines, linesHtml, MEGA, MICRO, BUB, WCARD, WMTAB, byName, PILLVAL, CARD, FSIZE,
  /* single-card.mjs（單一版型那一頁）另外用到的：現況那張卡的浮水印怎麼畫、這一筆算到哪一顆 */
  wmSvg, 輪,
};
