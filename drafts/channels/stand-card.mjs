#!/usr/bin/env node
/* 櫃檯那張小立牌的文字改版 → preview/line-stand/
 *   node drafts/channels/stand-card.mjs      （--check 只比對不寫檔）
 *
 * 2026-09-16 使用者：「這個是廠商先前提供的小告示版。要替換成新的版面，文字和 QRcode
 *   的位置大致沒什麼問題，風格和圖案預計換成診所網站和先前一致風格的人物。
 *   先處理文字部分。」
 *
 * ⚠⚠ 文字的唯一出處是 stand-card.json —— 這一支只做排版，一個字都不在這裡打。
 *   要改字改那一份再重跑；守門 check-stand-card.mjs 會重跑一次逐位比對。
 *
 * ⚠⚠⚠ 字級不是手挑的，是一條規則算出來的：
 *       主文字高 ＝ min(卡寬的 6%, 版心 84% ÷ 最長那一行的全形當量字數)
 *   —— 也就是「讓最長那一行剛好撐滿版心，但不超過 6%」。
 *   這樣四案比的才是**文字本身**（字少的自動變大），不是我替每一案挑的字級。
 *   ⚠ 這條規則拿現況驗過：現況最長那一行 21 個字 → 算出 4.0% 卡寬，
 *     和照片上量到的 4.0% 相同。
 *
 * ⚠⚠⚠ 抬頭那一行也是一條規則算的（2026-09-16 使用者指定抬頭寫「芳仁牙醫有 LINE 囉」、
 *   LINE 用官方的標誌換掉）：
 *       抬頭字高 ＝ min(卡寬的 8.5%, 版心 84% ÷ (全形當量 ＋ 字距 ＋ 標誌佔幾個字))
 *   —— 標誌會把那一行撐寬，不把它算進去的話，抬頭會**靜靜地溢出卡片**（卡片 overflow:hidden，
 *   畫面上只是最後一個字不見了，而每一道尺寸守門都會過）。所以那兩項要出現在算式裡，
 *   而且**要和 CSS 那兩個值對得起來**（`--hd-ls`、`--li-h`，兩邊只有一份出處）。
 *   ⚠ 抬頭是 `nowrap` —— 放不下要被守門擋下來，不可以靜靜地折成兩行。
 *   ⚠⚠ 2026-09-16 稍晚那顆泡泡換成**官方授權的標誌檔**（使用者提供）。它是一張 1:1 的圖，
 *   所以它對那一行的貢獻從「LINE 四個字 ＋ 泡泡的左右內距 ＝ 2.52 個字」變成
 *   「高度 × 長寬比 ＝ 1.10 個字」——**長寬比從 PNG 的檔頭讀，不手填**。
 *   ⚠⚠⚠ 那是別人的商標：只等比例縮放，不重上色、不裁、不變形。
 *   ⚠⚠⚠ 標誌左右的留白 2026-09-16 稍晚變成一把尺（使用者：「line logo 和前後文字間距
 *   也有點大」）：原本是他抬頭裡那兩個半形空白給的（量出來 35.3% 個標誌高），
 *   **但半形空白實際多寬跟著字型跑** —— 這張卡要交給美編照規格排，規格不可以是那種東西。
 *   所以畫出來的抬頭**把 LINE 左右那一個半形空白切掉**，改由 `留白比`（標誌自己高度的幾成）給；
 *   切法與字級算式吃同一個函式（`切抬頭`），分家的話抬頭會算出一個放得下、畫出去卻溢出的字級。
 *   ⚠ **JSON 裡他寫的抬頭一個字都沒有動**（守門兩邊都在盯）。
 *   ⚠ 地板是 25%（我們手上記的 LINE 規範）—— 選了就要印得出去的才放進尺裡；那條規範是二手的。
 *   ⚠ 現況那一張的「LINE」**刻意不換成標誌** —— 那一張是照片上逐字抄的，加工就不是對照了。
 *
 * ⚠⚠ 底下那條帶子 2026-09-16 換成**診所自己的九顆 logo**（使用者指定）：
 *   形狀讀 brand/shapes/，寬度讀 preview/line-booked/wm-sizes.json（按墨的面積正規化，
 *   所以九顆一樣重）。**等墨不等高**，所以每一格的框固定成最高的那一顆、形狀垂直置中。
 *   ⚠ 排的順序寫在 JSON 裡 —— 印出來的東西不能真的隨機。
 *
 * ⚠⚠⚠ 抬頭到主文那一段的間距 2026-09-16 稍晚也變成一把尺（使用者：「這兩行中間有很大的
 *   間隔，縮小一點，要預留空間給下面畫診所人物插圖」）。量出來他是對的：改動前那一段是
 *   12.8 mm、主文行距只有 4.3 mm，差三倍。**那個間距有兩段各自獨立**：`.bd` 自己的上外距
 *   加上第一行段落的 .28em —— `.bd` 是 flex 項目，兩段不會合併。
 *   ⚠⚠ **省下來的高度真的會落到下面**：卡片是固定長寬比、帶子靠 margin-top:auto 釘在最下面，
 *   所以上面收多少，QR 底下到帶子之間就多多少（那正是要畫人物插圖的那一塊）。
 *   整疊由 `疊高()` 算出來，**守門會拿瀏覽器量一次去對**。
 *   ⚠ 地板不是 0：收到比主文行距還小，抬頭就會被讀成主文的第一行。
 *
 * ⚠ 這一頁**零 JS**。字寬不在這裡量、用全形當量算 —— 這個容器沒有 Noto Sans TC，
 *   量出來的字寬會比實際寬約一成（CLAUDE.md 第五十九節），拿來判斷「放不放得下」是假的。
 *
 * ⚠ 那四張卡是用 CSS 排的，**不是完稿**：這一輪只處理文字，插圖與版面下一輪。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-stand");
const CHECK = process.argv.includes("--check");
export const S = JSON.parse(readFileSync(join(HERE, "stand-card.json"), "utf8"));

/* ── 全形當量字數：半形算 0.5（「LINE」＝ 2 個全形的寬度） ─────────── */
export const cw = (s) => [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1 : 0.5), 0);

/* ── 那一張卡上所有會被印出來的字（紅線掃描與字級規則都吃這一份） ──── */
export const lines = (c) => [c.抬頭, c.副標, ...c.主文, c.QR上, c.QR下, c.帶子 ?? ""].filter(Boolean);

const CARD = S.卡片;
const MAXFS = 0.06;                                  /* 主文字高的上限（佔卡寬） */
const 自然fs = (c) => Math.min(MAXFS, CARD.版心 / Math.max(...c.主文.map(cw)));

/* ⚠⚠⚠ 一案可以在資料裡宣告「字級照另一案」（2026-09-16 使用者：「用 E 但字級照 F」）——
 *   **規則本身一個字都沒有改**：自然那一格照算、面板照印，所以看得出這一釘是往上還是往下。
 *   ⚠ 釘上去之後最長那一行可能就放不下了，而卡片是 overflow:hidden ——
 *     畫面上只會少掉最後幾個字，每一道尺寸守門都會過。所以這裡直接 throw。 */
export const fsOf = (c) => {
  const w = Math.max(...c.主文.map(cw));
  const 自然 = 自然fs(c);
  if (!c.字級?.照) return { 最長: w, fs: 自然, 自然, 照: "" };
  const t = S.案.find((x) => x.id === c.字級.照);
  if (!t) throw new Error(c.標籤 + " 的字級要照 " + c.字級.照 + "，可是沒有那一案");
  if (t.字級?.照) throw new Error(c.標籤 + " 照的那一案自己也在照別人 —— 字級不要接龍");
  const fs = 自然fs(t);
  if (w * fs > CARD.版心 + 1e-9)
    throw new Error(c.標籤 + " 釘在 " + t.標籤 + " 的字級之後，最長那一行佔 " +
      (w * fs * 100).toFixed(1) + "% 卡寬（版心 " + (CARD.版心 * 100) + "）—— 會被切掉，先斷行");
  return { 最長: w, fs, 自然, 照: t.標籤 };
};

/* ── 抬頭：同一條規則，但要把字距與那顆綠泡泡的左右內距一起算進去 ──── */
export const HDLS = 0.04;        /* 抬頭的 letter-spacing（em）—— CSS 那一行吃同一個值 */
export const LIH = S.標誌.高em;  /* 標誌的高度（em）—— 同上 */
/* ⚠⚠⚠ 標誌左右的留白（2026-09-16 使用者：「line logo 和前後文字間距也有點大」）——
 *   **單位是「標誌自己的高度」不是 em**：LINE 的規範就是這樣講的，而且換一個標誌檔、
 *   換一個字級都不必重挑。這裡再乘 LIH 換成抬頭的 em。
 * ⚠⚠ 他寫的抬頭裡 LINE 前後各有一個半形空白，**畫出來的時候那兩個空白拿掉**、改由這個值給 ——
 *   半形空白實際多寬跟著字型跑（這台 0.348 em），而這張卡最後要交給美編照規格排，
 *   規格不可以是一個會跟著字型跑的東西。JSON 裡他寫的那一行一個字都沒有動。 */
export const 留白比 = S.標誌.留白比;
export const LIGAPOF = (比 = 留白比) => +(比 * LIH).toFixed(4);
export const LIGAP = LIGAPOF();  /* 標誌左右各補多少（抬頭的 em） */
const HDMAX = 0.085;             /* 抬頭字高的上限（佔卡寬） */

/* ⚠⚠⚠ 標誌的長寬比**從 PNG 的檔頭讀**，不手填 —— 手填的話哪天換一個檔，
 *   抬頭會算出一個「放得下」的字級、實際畫出去溢出卡片（overflow:hidden，
 *   畫面上只少掉最後一個字，每一道尺寸守門都會過）。 */
export const LOGO = (() => {
  const p = join(OUT, S.標誌.檔);
  if (!existsSync(p)) throw new Error("找不到官方標誌檔 " + p);
  const b = readFileSync(p);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error(S.標誌.檔 + " 不是 PNG");
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  return { 寬: w, 高: h, 比: +(w / h).toFixed(4) };
})();
export const LIW = +(LIH * LOGO.比 + LIGAP * 2).toFixed(4);   /* 標誌佔抬頭幾個全形字 */

/* ⚠⚠ 切的時候連 LINE 左右那**一個**半形空白一起切掉 —— 它們現在是標誌的左右留白。
 *   算字級與畫出來吃的是同一條切法，分家的話抬頭會算出一個放得下、畫出去卻溢出的字級。 */
export const 切抬頭 = (t) => String(t).split(/ ?LINE ?/);
export const hdOf = (c, 比 = 留白比) => {
  const t = String(c.抬頭);
  /* 現況那一張逐字照抄、不換標誌，所以不切 */
  const seg = c === S.現況 ? [t] : 切抬頭(t);
  const n = seg.length - 1;
  const txt = seg.join("");
  const liw = LIH * LOGO.比 + LIGAPOF(比) * 2;
  const w = cw(txt) + HDLS * [...txt].length + liw * n;
  return { 寬: +w.toFixed(3), fs: Math.min(HDMAX, CARD.版心 / w), 標誌: n, 留白em: LIGAPOF(比) };
};

/* ── 紅線：只掃卡片上的字 ───────────────────────────────────────── */
export const redOf = (c) => {
  const t = lines(c).join("\n");
  return S.紅線.詞.filter((r) => t.includes(r.字));
};

/* ── 兩把間距的尺（2026-09-16）───────────────────────────────────
 * ⚠⚠ 卡片是固定長寬比、底下那條帶子靠 margin-top:auto 釘在最下面，所以
 *   上面收多少，QR 底下到帶子之間就多多少 —— 那正好是要畫人物插圖的那一塊。
 *   這裡把整疊算出來，守門會拿瀏覽器量一次去對（算錯的話那一道會亮）。 */
export const BDGAP = CARD.抬頭到主文;
const 帶高 = () => CARD.版心 * BAND.高 / BAND.總寬;
export const 疊高 = (c, M = BDGAP) => {
  const { fs } = fsOf(c), hd = hdOf(c), n = c.主文.length;
  const bd = M + 0.28 * fs + n * 1.5 * fs + (n - 1) * 0.28 * fs + 0.28 * fs;
  return 0.06 + 1.5 * hd.fs + bd
    + (c.QR上 ? 0.07 + 1.5 * 0.038 : 0) + 0.04 + CARD.QR佔卡寬
    + (c.QR下 ? 0.03 + 1.5 * 0.036 : 0) + 0.035 + 帶高() + 0.04;
};
/* QR 底下那一行到帶子之間還剩多少 —— 人物插圖要畫在這裡 */
export const 餘裕mm = (c, M = BDGAP) => +((CARD.比例 - 疊高(c, M)) * CARD.寬mm).toFixed(1);
/* 抬頭的字面框下緣 → 第一行主文的字面框上緣（行高 1.5，所以上下各半行距 .25em） */
export const 抬頭到主文mm = (c, M = BDGAP) => {
  const { fs } = fsOf(c), hd = hdOf(c);
  return +((M + 0.28 * fs + 0.25 * hd.fs + 0.25 * fs) * CARD.寬mm).toFixed(1);
};
/* 主文行與行之間的同一個量（合併後的 .28em ＋ 上下各半行距） */
export const 行距mm = (c) => +((0.28 + 0.5) * fsOf(c).fs * CARD.寬mm).toFixed(1);

/* ── 面板的數字（算的，不是量的） ───────────────────────────────── */
export const rows = [{ 標籤: "現況（廠商那一版）", ...S.現況, id: "now" }, ...S.案].map((c) => {
  const { 最長, fs, 自然, 照 } = fsOf(c);
  return {
    id: c.id, 標籤: c.標籤, 行數: c.主文.length, 最長, 照,
    字高mm: +(CARD.寬mm * fs).toFixed(2),
    自然mm: +(CARD.寬mm * 自然).toFixed(2),
    佔卡寬: +(最長 * fs * 100).toFixed(1),
    紅線: redOf(c),
  };
});

/* ── HTML ───────────────────────────────────────────────────────── */
/* ⚠⚠ 「第 N 題」不可以寫死 —— 待答那一組增刪一題，寫死的那個數字就會靜靜地指到別題去。
 *   資料裡寫 {{題:關鍵字}}，這裡現算；找不到或找到不只一題就 throw。 */
export const qn = (kw) => {
  const hit = S.待答.map((d, i) => [d, i]).filter(([d]) => d.標.includes(kw));
  if (hit.length !== 1) throw new Error("{{題:" + kw + "}} 在待答裡找到 " + hit.length + " 題");
  return hit[0][1] + 1;
};
export const caseOf = (id) => {
  const hit = S.案.find((x) => x.id === id);
  if (!hit) throw new Error("{{字級mm:" + id + "}} 找不到那一案");
  return hit;
};
export const cn = (kw) => {
  const hit = S.拆解.map((d, i) => [d, i]).filter(([d]) => d.標.includes(kw));
  if (hit.length !== 1) throw new Error("{{條:" + kw + "}} 在拆解裡找到 " + hit.length + " 條");
  return hit[0][1] + 1;
};
const fill = (t) => String(t)
  .replace(/\{\{題:([^}]+)\}\}/g, (_, k) => String(qn(k)))
  .replace(/\{\{條:([^}]+)\}\}/g, (_, k) => String(cn(k)))
  /* ⚠ 標誌畫出來多高、左右留白佔它自己的幾成 —— 現算，不寫死：
     換一個檔或動 高em，資料裡那一句要跟著變 */
  .replace(/\{\{標誌高mm\}\}/g, () => (LIH * hdOf(S.案[0]).fs * CARD.寬mm).toFixed(1))
  .replace(/\{\{標誌留白\}\}/g, () => (留白比 * 100).toFixed(0))
  /* ⚠ 字級也不要寫死：「照 Ⓕ」那一格算出來幾 mm、規則本來會算幾 mm，兩個都現算 */
  .replace(/\{\{字級mm:([a-z]+)\}\}/g, (_, k) => (CARD.寬mm * fsOf(caseOf(k)).fs).toFixed(2))
  .replace(/\{\{自然mm:([a-z]+)\}\}/g, (_, k) => (CARD.寬mm * fsOf(caseOf(k)).自然).toFixed(2));
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
/* **粗體** 與 `等寬`；資料裡不放 HTML */
const b = (s) => esc(fill(s)).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
/* ⚠ 這幾份 JSON 裡的文字是「一行一行折好的原始碼」，不是一行一段 ——
 *   空字串才是分段。所以要把連著的幾行接成同一段（照 CJK 的規矩直接相接、不補空白），
 *   一行一個 <p> 的話讀起來會變成一串短句。
 *   ⚠ 一段的第一行以 > 開頭 ＝ 整段是引文。 */
const para = (a) => {
  const src = Array.isArray(a) ? a : [a];
  const out = []; let cur = [];
  const flush = () => {
    if (!cur.length) return;
    const q = /^\s*>/.test(cur[0]);
    const t = cur.map((x) => x.replace(/^\s*>\s?/, "")).join("");
    out.push(q ? `<p class="q">${b(t)}</p>` : `<p>${b(t)}</p>`);
    cur = [];
  };
  for (const l of src) {
    const t = String(l);
    if (!t.trim()) { flush(); continue; }
    if (cur.length && /^\s*>/.test(t) !== /^\s*>/.test(cur[0])) flush();
    cur.push(t);
  }
  flush();
  return out.join("\n");
};

/* ⚠⚠ 資料裡不放 HTML（那條規矩沒有變）—— 標誌是這裡套上去的，套的是 esc 過的字。
 *   ⚠ alt 一定要寫 "LINE"：守門逐行比對卡片上的字時，會把 <img> 還原成它的 alt。 */
const LIIMG = `<img class="li" src="${S.標誌.檔}" alt="LINE" width="${LOGO.寬}" height="${LOGO.高}">`;
const mark = (t) => 切抬頭(t).map(esc).join(LIIMG);

/* ── 底下那條帶子：診所自己的九顆 logo ─────────────────────────────
 * ⚠⚠ 形狀讀 brand/shapes/，寬度讀 preview/line-booked/wm-sizes.json —— 兩份都是既有的
 *   出處，一個路徑資料都不抄第二份。
 * ⚠⚠ 那九個寬度是按**墨的面積**正規化的，所以九顆一樣重、但**不一樣高**（61~107，差 1.75 倍）。
 *   排成一條的時候每一格的框固定成最高的那一顆、形狀垂直置中，不然就是一排高高低低。
 * ⚠ 用「SVG 裡面再放 SVG」排，不是 flex —— 每一顆各自的 viewBox 原封不動帶著走，
 *   位置是算出來的、不會有排版的捨入誤差。 */
export const WM = JSON.parse(readFileSync(join(ROOT, "preview", "line-booked", "wm-sizes.json"), "utf8"));
const SHAPE = (k) => {
  const src = readFileSync(join(ROOT, "brand", "shapes", `shape-${k}.svg`), "utf8");
  const vb = src.match(/viewBox="([^"]+)"/);
  if (!vb) throw new Error(k + " 沒有 viewBox");
  const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  if (!inner.includes("<path")) throw new Error(k + " 抽不到形狀");
  return { vb: vb[1], inner };
};
export const BAND = (() => {
  const B = S.帶子;
  const ks = B.順序;
  const it = ks.map((k) => {
    const m = WM[k];
    if (!m) throw new Error("wm-sizes.json 裡沒有 " + k);
    return { k, w: m.w, h: m.w / m.ratio, 色: m.color, spec: m.spec };
  });
  const H = Math.max(...it.map((x) => x.h));
  const gap = H * B.間距;
  let x = 0;
  for (const o of it) { o.x = x; o.y = (H - o.h) / 2; x += o.w + gap; }
  return { it, H, 總寬: x - gap, 高: H };
})();
const bandSvg = (色) => {
  const { it, H, 總寬 } = BAND;
  return `<svg class="bnd" viewBox="0 0 ${總寬.toFixed(1)} ${H.toFixed(1)}" role="img" aria-label="芳仁牙醫診所的九個標誌">` +
    it.map((o) => {
      const { vb, inner } = SHAPE(o.k);
      const c = 色 === "spec" ? o.色 : 色;
      return `<svg x="${o.x.toFixed(1)}" y="${o.y.toFixed(1)}" width="${o.w}" height="${o.h.toFixed(1)}" viewBox="${vb}" style="color:${c}">${inner}</svg>`;
    }).join("") + "</svg>";
};

/* ⚠ 兩把尺（抬頭到主文、標誌左右留白）可以逐張覆寫 —— 尺上那幾格就是這樣畫的。
   ⚠⚠ 覆寫留白**一定要連字級一起重算**（hdOf 吃同一個比例），不然那一行的寬度會算錯。 */
const card = (c, now = false, 色 = null, o = {}) => {
  const { fs } = fsOf(c);
  const hd = hdOf(c, o.留白 ?? 留白比);
  const f = (k) => `calc(var(--cw) * ${k})`;
  const st = [o.間距 != null ? `--bd-gap:${f(o.間距)}` : "",
    o.留白 != null ? `--li-gap:${LIGAPOF(o.留白)}em` : ""].filter(Boolean).join(";");
  return `<div class="card${now ? " now" : ""}${o.尺 ? " sc" : ""}"${st ? ` style="${st}"` : ""}>
  <div class="hd" style="font-size:${f(hd.fs.toFixed(4))}">${now ? esc(c.抬頭) : mark(c.抬頭)}</div>
  ${c.副標 ? `<div class="sub" style="font-size:${f(0.05)}">${esc(c.副標)}</div>` : ""}
  <div class="bd" style="font-size:${f(fs.toFixed(4))}">${c.主文.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  ${c.QR上 ? `<div class="cue" style="font-size:${f(0.038)}">${esc(c.QR上)}</div>` : ""}
  <div class="qr"><span>QR</span></div>
  ${c.QR下 ? `<div class="cue lo" style="font-size:${f(0.036)}">${esc(c.QR下)}</div>` : ""}
  ${now
    ? `<div class="band" style="font-size:${f(0.04)}">${esc(c.帶子 ?? "")}</div>`
    : `<div class="band logos">${bandSvg(色 ?? S.帶子.色)}</div>`}
</div>`;
};

/* ⚠⚠ 兩把尺都畫在 **Ⓔ 那一張**（他挑定的那一案）上，而且每一格都是真的卡片 ——
 *   間距這種東西並排才比得出來，一格一格單看是分不出 1~2 mm 的。
 * ⚠ 面板的數字每一格現算，不是寫上去的：換字、換字級、換卡片尺寸都會跟著動。 */
const 尺卡 = S.案.find((c) => c.id === "e");
const 尺間距 = CARD.抬頭到主文案.map((k) => {
  const 抬 = 抬頭到主文mm(尺卡, k.值), 行 = 行距mm(尺卡), 餘 = 餘裕mm(尺卡, k.值);
  return `<div class="one sc">
<p class="lb">Ⓗ${k.id === "now" ? "1" : k.id[1]} ${esc(k.標籤)}${k.值 === BDGAP ? "" : ""}</p>
${card(尺卡, false, null, { 間距: k.值, 尺: true })}
<div class="note"><p>抬頭到主文 <b>${抬} mm</b>（字面框到字面框）＝ 主文行距 ${行} mm 的
<b>${(抬 / 行).toFixed(1)} 倍</b>。</p>
<p>QR 底下到帶子之間空出 <b>${餘} mm</b>（插圖畫在這裡）。</p></div>
</div>`;
}).join("\n");
const 尺留白 = S.標誌.留白案.map((k) => {
  const hd = hdOf(尺卡, k.比);
  return `<div class="one sc">
<p class="lb">Ⓘ${k.id === "now" ? "1" : k.id[1]} ${esc(k.標籤)}</p>
${card(尺卡, false, null, { 留白: k.比, 尺: true })}
<div class="note"><p>左右各留 <b>${(k.比 * 100).toFixed(1)}%</b> 個標誌高
＝ <b>${(hd.留白em * hd.fs * CARD.寬mm).toFixed(2)} mm</b>。</p>
<p>抬頭那一行佔卡寬 <b>${(hd.寬 * hd.fs * 100).toFixed(1)}%</b>（版心 ${CARD.版心 * 100}）。</p></div>
</div>`;
}).join("\n");

const 拆解 = S.拆解.map((d, i) =>
  `<div class="it"><p class="t"><span class="n">${i + 1}</span>${b(d.標)}</p>${para(d.文)}</div>`).join("\n");

const 案 = S.案.map((c) => `<div class="one">
<p class="lb">${esc(c.標籤)}</p>
${card(c)}
<div class="note">${para(c.註)}</div>
</div>`).join("\n");

const tbl = `<table><thead><tr><th>　</th><th>主文行數</th><th>最長一行</th>
<th>字可以多大</th><th>那一行佔卡寬</th><th>紅線</th></tr></thead><tbody>${
  rows.map((r) => `<tr${r.id === "now" ? ' class="nowr"' : ""}><th>${esc(r.標籤)}</th>
<td>${r.行數}</td><td>${r.最長} 字</td><td>${r.字高mm} mm${
  r.照 ? `<br><small>釘在 ${esc(r.照)}・規則會算 ${r.自然mm}</small>` : ""}</td><td>${r.佔卡寬}%</td>
<td class="${r.紅線.length ? "bad" : "ok"}">${r.紅線.length ? r.紅線.map((x) => esc(x.字)).join("、") : "0"}</td></tr>`).join("\n")
}</tbody></table>`;

const 待答 = S.待答.map((d, i) =>
  `<li><b>${b(d.標)}</b><br>${b(d.文)}</li>`).join("\n");

const HTML = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>櫃檯的小立牌　文字改版（四案）</title>
<style>
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;
  --brick:#8c3b32;--green:#3f654a;--cw:300px;--hd-ls:${HDLS}em;--li-h:${LIH}em;--li-gap:${LIGAP}em;--bd-gap:calc(var(--cw) * ${BDGAP})}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:760px;margin:0 auto;padding:26px 14px 72px}
h1{font-size:1.3rem;line-height:1.5;margin:0 0 .3em}
.lede{color:var(--soft);font-size:.92rem;margin:0 0 1.4em}
.h2{font-size:1.04rem;margin:2.3em 0 .6em;padding-top:1em;border-top:1px solid var(--rule)}
.h2 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.25em}
p{margin:.5em 0}
.box{background:var(--card);border-radius:11px;padding:13px 15px;font-size:.93rem}
.box p:first-child{margin-top:0}.box p:last-child{margin-bottom:0}
.q{border-left:3px solid var(--rule);padding-left:.8em;color:var(--soft);font-size:.9rem}
code{font-size:.86em;background:#dfe3e4;border-radius:4px;padding:.05em .35em}

/* ── 那張卡（CSS 排的，不是完稿） ─────────────────────────────── */
.cards{display:flex;flex-wrap:wrap;gap:22px;margin:.6em 0 0}
.one{flex:1 1 var(--cw);max-width:var(--cw)}
/* ⚠ 尺上那幾張要**並排**才比得出 1~2 mm 的差 —— 四格一排的寬度是算出來的：
   (版心 760 − 左右內距 28 − 三條溝 22) ÷ 4 ＝ 166.5，取 166。手機上兩張一排，仍然是並排的。 */
.one.sc{--cw:166px}
.lb{font-weight:600;font-size:.95rem;margin:0 0 .45em}
.card{--pad:calc(var(--cw) * .06);width:var(--cw);aspect-ratio:${CARD.寬mm} / ${Math.round(CARD.寬mm * CARD.比例)};
  background:#fff;border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,.14);
  padding:var(--pad) var(--pad) 0;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  color:#333;line-height:1.5;overflow:hidden}
.card .hd{font-weight:700;letter-spacing:var(--hd-ls);white-space:nowrap}
/* ⚠⚠⚠ 官方授權的標誌檔（使用者 2026-09-16 提供）。**一個像素都不要改** ——
   這裡只有等比例縮放，沒有 filter、沒有 border、沒有 border-radius、沒有背景。
   高度與左右留白，抬頭的字級規則算過一模一樣的值 —— 改這裡要一起改那邊。
   ⚠ 標誌左右的空白是抬頭那兩個半形空白給的，所以 --li-gap 是 0。 */
.li{display:inline-block;height:var(--li-h);width:auto;
  margin:0 var(--li-gap);vertical-align:-.19em}
.card .sub{margin-top:.25em;color:#444}
/* ⚠⚠ 抬頭到主文那一段有**兩段**：這個上外距，加上第一行段落自己的 .28em ——
   .bd 是 flex 項目，兩段不會合併。要收間距兩段都要算進去。 */
.card .bd{margin-top:var(--bd-gap);width:100%}
.card .bd p{margin:.28em 0;white-space:nowrap}
.card .cue{margin-top:calc(var(--cw) * .07);color:#555}
.card .cue.lo{margin-top:calc(var(--cw) * .03)}
.card .qr{width:calc(var(--cw) * ${CARD.QR佔卡寬});aspect-ratio:1;margin-top:calc(var(--cw) * .04);
  background:repeating-linear-gradient(45deg,#dcdcdc 0 6px,#ececec 6px 12px);
  border-radius:3px;display:flex;align-items:center;justify-content:center}
.card .qr span{font-size:.72rem;color:#8a8a8a;letter-spacing:.1em}
.card .band{margin:auto calc(var(--pad) * -1) 0;width:var(--cw);padding:calc(var(--cw) * .026) 0;
  background:#3c4657;color:#fff;letter-spacing:.03em}
.card .band.empty{background:transparent;border-top:1px dashed #d5d5d5;color:transparent}
/* 九顆 logo 那一條：沒有底色、沒有字，寬度就是版心 */
.card .band.logos{background:transparent;padding:calc(var(--cw) * .035) 0 calc(var(--cw) * .04);
  display:flex;justify-content:center}
.card .band.logos .bnd{width:calc(var(--cw) * ${CARD.版心});height:auto;display:block}
.card.now .bd p{white-space:normal}
.bandonly{background:#fff;border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,.14);
  padding:calc(var(--cw) * .05) calc(var(--cw) * .08);display:flex;justify-content:center}
.bandonly .bnd{width:100%;height:auto;display:block}
.note{font-size:.86rem;color:var(--soft);margin:.6em 0 0}
.note p{margin:.35em 0}

/* ── 拆解 ─────────────────────────────────────────────────────── */
.it{background:var(--card);border-radius:11px;padding:12px 15px;margin:.7em 0;font-size:.93rem}
.it .t{font-weight:600;margin:0 0 .3em}
.it .n{display:inline-block;min-width:1.5em;color:var(--brick);font-weight:700}
.it p{margin:.35em 0}

table{border-collapse:collapse;width:100%;font-size:.86rem;margin:.6em 0 0;
  background:var(--card);border-radius:10px;overflow:hidden}
th,td{padding:.5em .6em;text-align:center;border-bottom:1px solid var(--rule)}
thead th{font-weight:600;font-size:.8rem;color:var(--soft)}
tbody th{text-align:left;font-weight:600}
tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}
.nowr th,.nowr td{color:var(--soft)}
.bad{color:var(--brick);font-weight:700}
.ok{color:var(--green)}
ol.ask{padding-left:1.4em;font-size:.93rem}
ol.ask li{margin:.7em 0}
.foot{margin-top:2.6em;padding-top:1em;border-top:1px solid var(--rule);
  font-size:.82rem;color:var(--soft)}
@media (max-width:719px){:root{--cw:min(300px,88vw)}.one{max-width:none}}
</style>
</head>
<body>
<div class="wrap">

<h1>櫃檯的小立牌　文字改版</h1>
<p class="lede">這一輪<b>只處理文字</b>（插圖與版面下一輪）。底下那四張卡是用網頁排的，
<b>不是完稿</b> —— 字級是用一條規則自動算的，四案比的是文字本身。</p>

<p class="h2">現況那一張<span class="t">照片上逐字抄的，一個字都沒有改寫</span></p>
<div class="cards"><div class="one">${card(S.現況, true)}</div>
<div class="one"><div class="box">
${para(CARD._量法)}
</div></div></div>

<p class="h2">抬頭那顆 LINE 標誌<span class="t">官方授權的檔案，不是我們畫的</span></p>
<div class="box">${para(S.標誌._說明)}
<p>⚠ 現在畫出來：<code>${esc(S.標誌.檔)}</code> ${LOGO.寬}×${LOGO.高}（長寬比 ${LOGO.比}），
高 ${LIH} em ＝ 卡片上 <b>${(LIH * hdOf(S.案[0]).fs * CARD.寬mm).toFixed(1)} mm</b>，
左右各留 <b>${(留白比 * 100).toFixed(0)}%</b> 個標誌高。</p></div>

<p class="h2">那個 QR 掃出來是什麼<span class="t">拿解碼器掃過，不是用眼睛看的</span></p>
<div class="box"><p><code>${esc(S.QR.內容)}</code></p>${para(S.QR.說明)}</div>

<p class="h2">為什麼要改<span class="t">六件，每一件都有出處</span></p>
${拆解}

<p class="h2">四案<span class="t">形狀不一樣，不只是換字</span></p>
<p class="lede">抬頭每一案都一樣：<b>${mark(S.案[0].抬頭)}</b>（使用者 2026-09-16 指定的逐字，
那顆標誌是他提供的<b>官方授權檔</b>）。<b>Ⓔ 是他自己寫的三行</b>，一個字都沒有改 ——
所以底下那張表上它會亮紅，那不是壞掉（見那一案的註）。</p>
<div class="cards">${案}</div>

<p class="h2">抬頭到主文的間距<span class="t">收上面，空間留給下面的插圖</span></p>
<div class="box">${para(CARD.抬頭到主文_說明)}</div>
<div class="cards">${尺間距}</div>

<p class="h2">標誌左右的留白<span class="t">他寫的那兩個半形空白，換成一個算得出來的規格</span></p>
<div class="box">${para(S.標誌.留白_說明)}</div>
<div class="cards">${尺留白}</div>

<p class="h2">底下那條帶子<span class="t">換成診所自己的九顆 logo</span></p>
<div class="box">${para(S.帶子._說明)}
<p>⚠ 現在畫出來：九顆合計 <b>${BAND.總寬.toFixed(0)}</b> 個單位寬、最高的那一顆 <b>${BAND.高.toFixed(0)}</b>，
所以那一條在 ${CARD.寬mm} mm 的卡上高 <b>${(CARD.寬mm * CARD.版心 * BAND.高 / BAND.總寬).toFixed(1)} mm</b>。</p></div>
<div class="cards">${S.帶子.色案.map((k) => `<div class="one">
<p class="lb">${esc(k.標籤)}</p>
<div class="bandonly">${bandSvg(k.id === "spec" ? "spec" : k.色)}</div>
<div class="note">${para(k.說明)}</div>
</div>`).join("\n")}</div>

<p class="h2">字可以多大<span class="t">字少的自動變大 —— 這是四案真正的差別之一</span></p>
<div class="box"><p>主文字高 ＝ <b>min(卡寬的 6%，版心 84% ÷ 最長那一行的字數)</b>，
也就是「讓最長那一行剛好撐滿版心，但不超過 6%」。四案用同一條規則，所以底下這張表比的是
<b>文字本身</b>，不是我替每一案挑的字級。</p>
<p>⚠⚠ <b>一案可以宣告「字級照另一案」</b>（Ⓔ 就是釘在 Ⓕ 上的）——
規則本身一個字都沒有改：那一列同時印著<b>規則會算幾 mm</b>，所以看得出這一釘是往上還是往下。
⚠ 釘上去之後最長那一行放不下的話產生器會 throw ——
卡片是 <code>overflow:hidden</code>，不擋的話畫面上只會少掉最後幾個字，而每一道尺寸守門都會過。</p>
<p>⚠ <b>版心那個 84% 就是從現況那一行量來的</b>（最長那一行 22 個全形字、佔卡片寬度 84%），
所以現況那一列是這條規則的<b>定義</b>、不是驗證。四案之間的比較仍然成立 —— 它們吃同一條規則。</p>
<p>⚠ <b>抬頭另算一條</b>：min(卡寬的 8.5%，版心 84% ÷ (全形當量 ＋ 字距 ＋ 標誌佔幾個字))。
那顆標誌會把那一行撐寬 <b>${LIW}</b> 個字（＝它的高度 ${LIH} em × 長寬比 ${LOGO.比}，
<b>長寬比是從 PNG 的檔頭讀回來的</b>），不算進去的話抬頭會靜靜地溢出卡片
（卡片是 <code>overflow:hidden</code>，畫面上只會少掉最後一個字）。
每一案的抬頭都是 <b>${(hdOf(S.案[0]).fs * CARD.寬mm).toFixed(2)} mm</b>，
那顆標誌因此印出來高 <b>${(LIH * hdOf(S.案[0]).fs * CARD.寬mm).toFixed(1)} mm</b>。</p>
<p>⚠ 字高是照卡片寬 ${CARD.寬mm} mm 換算的（那個數字還要用尺量一次，見底下第 ${qn("尺寸")} 題）。
櫃檯是站著看的，一般建議內文不要小於 3.5 mm。</p></div>
${tbl}
<div class="note">${para(S.紅線._說明)}</div>

<p class="h2">還沒有答案的</p>
<ol class="ask">
${待答}
</ol>

<p class="foot">文字的唯一出處是 <code>drafts/channels/stand-card.json</code>；
這一頁由 <code>node drafts/channels/stand-card.mjs</code> 產生、
<code>node drafts/channels/check-stand-card.mjs</code> 守門。<b>不要手改這一頁。</b></p>

</div>
</body>
</html>
`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const f = join(OUT, "index.html");
  if (CHECK) {
    if (!existsSync(f)) throw new Error("preview/line-stand/index.html 還沒產生");
    if (readFileSync(f, "utf8") !== HTML) throw new Error("preview/line-stand/index.html 和產生器對不起來 —— 有人手改了頁面，或改了 JSON 卻沒有重跑");
    console.log("✓ 逐位相同");
  } else {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(f, HTML);
    console.log("寫出 preview/line-stand/index.html");
  }
  const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - cw(String(s)) * 2));
  console.log("");
  console.log(pad("", 26) + pad("行數", 8) + pad("最長一行", 12) + pad("字高", 10) + pad("佔卡寬", 10) + "紅線");
  for (const r of rows)
    console.log(pad(r.標籤, 26) + pad(r.行數, 8) + pad(r.最長 + " 字", 12) +
      pad(r.字高mm + " mm", 10) + pad(r.佔卡寬 + "%", 10) +
      (r.紅線.length ? r.紅線.map((x) => x.字).join("、") : "0") +
      (r.照 ? "　（釘在 " + r.照 + "，規則會算 " + r.自然mm + " mm）" : ""));
  console.log("");
  for (const c of [S.現況, ...S.案].filter((x, i, a) => a.findIndex((y) => y.抬頭 === x.抬頭) === i)) {
    const h = hdOf(c);
    console.log(`抬頭「${c.抬頭}」${(h.fs * CARD.寬mm).toFixed(2)} mm・佔卡寬 ${(h.寬 * h.fs * 100).toFixed(1)}%` +
      (h.標誌 ? `（含 ${h.標誌} 顆標誌，一顆 ${LIW} 個字 ＝ ${(LIH * h.fs * CARD.寬mm).toFixed(1)} mm 高、左右各留 ${(留白比 * 100).toFixed(0)}%）` : `（沒有標誌）`));
  }
  console.log("");
  console.log(`標誌 ${S.標誌.檔} ${LOGO.寬}×${LOGO.高}（長寬比 ${LOGO.比}）—— 官方授權檔，只等比例縮放`);
  console.log(`帶子 九顆 ${S.帶子.順序.join(" ")}`);
  console.log(`     合計 ${BAND.總寬.toFixed(0)} 單位寬・最高 ${BAND.高.toFixed(0)}（最矮 ${Math.min(...BAND.it.map((x) => x.h)).toFixed(0)}，差 ${(BAND.高 / Math.min(...BAND.it.map((x) => x.h))).toFixed(2)} 倍 —— 所以要垂直置中）`);
  console.log(`     在 ${CARD.寬mm} mm 的卡上高 ${(CARD.寬mm * CARD.版心 * BAND.高 / BAND.總寬).toFixed(1)} mm・顏色還沒挑（${S.帶子.色案.map((k) => k.標籤).join("／")}）`);
  console.log("");
  console.log(`卡片 ${CARD.寬mm} mm 寬・比例 ${CARD.比例}（${Math.round(CARD.寬mm * CARD.比例)} mm 高）—— 從照片量的，還要用尺量一次`);
  console.log(`QR ＝ ${S.QR.內容}（兩張照片各自解過一次）`);
  console.log("");
}
