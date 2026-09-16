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
 * ⚠⚠ 底下那條帶子 2026-09-16 換成**診所自己的 logo**（使用者指定）：
 *   形狀讀 brand/shapes/，寬度讀 preview/line-booked/wm-sizes.json（按墨的面積正規化，
 *   所以每一顆一樣重）。**等墨不等高**，所以每一格的框固定成最高的那一顆、形狀垂直置中。
 *   ⚠ 排的順序寫在 JSON 裡 —— 印出來的東西不能真的隨機。
 *   ⚠⚠⚠ 同一天稍晚五件（使用者）：**四邊與中間的間隔要一致／logo 小一點／多放一兩個／
 *   底色用一般牙科主題色／logo 白色、牙洞就是那塊底色**。前兩件變成兩把尺（Ⓚ 顆數、
 *   Ⓛ 間距），後三件是決定。整條**由一張 SVG 畫完**（底色是裡面一塊 rect，四邊的留白
 *   烘在 viewBox 裡）—— 那五個間隔因此出自同一個算式，不可能不一致。
 *   ⚠⚠ **牙洞不要另外填色**：單一路徑 ＋ fill-rule evenodd，填白之後洞自己透出底下那塊綠。
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
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build as buildQR, PLATE_MODE } from "./qr-brand.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-stand");
const CHECK = process.argv.includes("--check");
export const S = JSON.parse(readFileSync(join(HERE, "stand-card.json"), "utf8"));

/* ── 全形當量字數：半形算 0.5（「LINE」＝ 2 個全形的寬度） ─────────── */
export const cw = (s) => [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1 : 0.5), 0);

/* ── 那一張卡上所有會被印出來的字（紅線掃描與字級規則都吃這一份） ──── */
export const lines = (c) => [c.抬頭, c.副標, ...c.主文, c.QR上, c.QR下, c.帶子 ?? ""].filter(Boolean);

export const CARD = S.卡片;
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

/* ⚠⚠⚠ 卡上那顆 QR 是 2026-09-15 在另一條對話定案的成品（推導在 README 第七十四節），
 *   這一支**只搬不畫**：從 drafts/channels/qr/ 原封不動複製過來
 *   —— `drafts/` 進不了 `_site`，所以非複製一份不可；守門逐位元組比對兩份。
 *   要改那顆碼就改 `qr-brand.mjs` 再重跑，不要改 preview 底下那一份。
 * ⚠⚠ 它和照片上那一顆**編碼的是同一個字串**（廠商的短網址），所以這是換長相不是換流程。 */
export const QRSRC = join(ROOT, "drafts", "channels", "qr", "fangren-line-qr.svg");
export const QRFILE = "qr-line.svg";

/* ⚠⚠⚠ 底板那把尺（2026-09-16「QRcode 周圍有淡綠色的邊可以拿掉嗎」）——
 *   定案那一格畫的就是 `qr-line.svg` 本人（＝ drafts/channels/qr/ 那一份），
 *   落選那兩格另外產成檔案。**三格都是真的碼，沒有一格是用 CSS 畫的** ——
 *   用 CSS 模擬出來的「很像的碼」看起來完全正常，只有拿解碼器掃才知道掃不掃得出來。 */
export const QRPLATE = S.QR.底板.案.map((a) => ({
  ...a, 定案: a.碼 === S.QR.底板.預設,
  檔: a.碼 === S.QR.底板.預設 ? QRFILE : `qr-plate-${a.碼}.svg`,
}));
if (S.QR.底板.預設 !== PLATE_MODE)
  throw new Error(`stand-card.json 的底板預設（${S.QR.底板.預設}）和 qr-brand.mjs 的 PLATE_MODE（${PLATE_MODE}）對不起來`);
export const QRVAR = () => QRPLATE.filter((a) => !a.定案)
  .map((a) => [a.檔, buildQR({ plate: a.碼 }).line.svg]);

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
/* 主文段與段之間（`.bd p` 的上下外距，em）—— 2026-09-16 開的第二把尺。
 * ⚠⚠ 它同時是「抬頭到主文」那一段的第二截（第一行段落自己的上外距），
 *   所以收這一把，抬頭那一段也會跟著收一點點 —— 兩把尺不是獨立的。 */
export const PGAP = CARD.段距;
/* ── QR 上面那一行（2026-09-16）─────────────────────────────────
 * 使用者：「QRcode 上面加一串字 @fafa070（line 商家帳號 ID）」。
 * ⚠⚠⚠ **它不是免費的，而且吃的正好是他同一句話裡要變大的那一塊** ——
 *   卡片是固定長寬比，多一行就從「QR 底下到帶子」那一塊扣，所以這裡**不用**
 *   .cue 那個通用的 .07 間距（那樣要 12.4 mm），另外給兩個窄的。
 * ⚠⚠ **上面要比下面寬**（接近律）：那一行是「這顆碼叫什麼」，要讀成 QR 的名字
 *   而不是主文的第四行 —— 2026-09-16 使用者「上下間隔有點大　縮小一點」，
 *   從 .035／.018 收到 **.024／.012**（2.35／1.18 mm），**2:1 沒有動**。
 * ⚠ 三個都是具名常數：CSS 與 疊高() 吃同一份，分家的話面板會算出一個
 *   和畫面對不上的餘裕，而版面看起來完全正常。 */
export const ID上 = 0.024, ID下 = 0.012, ID字級 = 0.038;
/* ── 分隔線（2026-09-16 那一條搬家）───────────────────────────────
 * 使用者：「插圖已經很豐富了　下面的 logo 帶反而太吵雜　把 logo 縮小改成淡墨色
 *   移到『芳仁牙醫有 LINE 囉』　當作是分隔線的概念　因為要很小　logo 的數量應該會是
 *   現在的三到四倍」。所以那一條**不在卡片最下面了**：它變成抬頭底下的一條分隔線，
 *   底色拿掉、標誌改成淡墨、顆數變成基數的整數倍。
 * ⚠⚠ 它一走，卡片最下面那 9.4 mm 就還給插圖 —— 插圖因此**不再沉進帶子後面**，
 *   人的下半身改由**卡片自己的下緣**切掉（那本來就是規格）。
 * ⚠ 上下這兩個間距是分隔線自己的，和 Ⓗ（抬頭到主文）是兩件事；
 *   Ⓗ7 那句「抬頭到主文 3.9 mm」因此不再描述這個版面（第九節第 28 條 ②），
 *   面板現在印的是加了分隔線之後的實際距離。 */
export const 分上 = 0.016, 分下 = 0.016;
/* ⚠ 那一條仍然是**滿版**，高 ＝ 卡寬 × 總高÷總寬；四邊的留白烘在 SVG 的 viewBox 裡，
   `.sep` 自己沒有 padding。 */
export const 帶高 = () => BAND.總高 / BAND.總寬;
export const 疊高 = (c, M = BDGAP, g = PGAP) => {
  const { fs } = fsOf(c), hd = hdOf(c), n = c.主文.length;
  const bd = M + g * fs + n * 1.5 * fs + (n - 1) * g * fs + g * fs;
  return 0.06 + 1.5 * hd.fs + 分上 + 帶高() + 分下 + bd
    + (c.QR上 ? ID上 + 1.5 * ID字級 + ID下 : 0.04) + CARD.QR佔卡寬
    + (c.QR下 ? 0.03 + 1.5 * 0.036 : 0);
};
/* 插圖那一條有多高 —— **只有一個出處**：裁圖那一支（stand-illus-crop.mjs）import 它。
 * ⚠⚠ 2026-09-16 那條帶子搬到抬頭底下之後，這一條**不再含一個帶子高** ——
 *   插圖的下緣就是卡片的下緣，沒有東西蓋在它上面了。 */
export const 那一條mm = (c, M = BDGAP, g = PGAP) => 餘裕mm(c, M, g);
/* QR 底下那一行到卡片下緣還剩多少 —— 人物插圖要畫在這裡 */
export const 餘裕mm = (c, M = BDGAP, g = PGAP) => +((CARD.比例 - 疊高(c, M, g)) * CARD.寬mm).toFixed(1);
/* 抬頭的字面框下緣 → 第一行主文的字面框上緣（行高 1.5，所以上下各半行距 .25em）
   ⚠⚠ 2026-09-16 起中間多了一條分隔線，所以這個量含 分上 ＋ 帶高 ＋ 分下。 */
export const 抬頭到主文mm = (c, M = BDGAP, g = PGAP) => {
  const { fs } = fsOf(c), hd = hdOf(c);
  return +((分上 + 帶高() + 分下 + M + g * fs + 0.25 * hd.fs + 0.25 * fs) * CARD.寬mm).toFixed(1);
};
/* 主文行與行之間的同一個量（合併後的 .28em ＋ 上下各半行距） */
export const 行距mm = (c, g = PGAP) => +((g + 0.5) * fsOf(c).fs * CARD.寬mm).toFixed(1);

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
/* ⚠⚠⚠ 2026-09-16 定案：整條**由一張 SVG 畫完** —— 底色是 SVG 裡的一塊 `rect`，
 *   標誌排在它上面，**四邊與顆與顆之間吃同一個 `間距`**（＝最高那一顆的幾成）。
 *   改動前兩邊那個間隔是「版心對滿版」剩下的頁面內距（7.8 mm）、中間那個是 SVG 裡
 *   算出來的（2.1 mm），差 3.7 倍 —— **那兩個間隔本來就不是同一個東西給的**，
 *   所以「調成一致」不是挑一個數字，是讓它們出自同一個算式。
 * ⚠⚠ **標誌填白、牙洞不要另外填** —— 單一路徑 ＋ `fill-rule: evenodd`，洞是挖穿的，
 *   底下那塊綠自己會透出來。另外畫一塊綠色的洞上去畫出來一模一樣，但形狀一改就會
 *   對不準，**而且不報錯**。
 * ⚠⚠⚠ 2026-09-16：**底色那塊 rect 拿掉了** —— 那一條搬去當分隔線，標誌改成淡墨
 *   直接畫在白紙上。所以整條只剩一種 fill（形狀自己的 currentColor），
 *   而「牙洞挖穿透出底色」變成「透出白紙」，evenodd 一樣非有不可。 */
export const 墨色 = S.帶子.墨;
/* ⚠⚠⚠ 2026-09-16：顆數變成**基數的整數倍**（使用者：「三到四倍」）。
 *   只給整數倍，是因為那三條相鄰的限制**在接縫上也要成立** —— 整數倍等於把同一段
 *   接回它自己，接縫那一對（最後一顆與第一顆）驗一次就代表每一個接縫；
 *   非整數倍要另外寫一份順序進 JSON，不可以就地截一段（截口沒有人驗過）。 */
export const 序of = (n) => {
  const k = S.帶子.順序案.find((x) => x.顆 === n);
  if (k) return k.序;
  /* 挑一份「顆數整除得了 n」的順序接起來（基數優先） */
  const 基 = [S.帶子.顆數, ...S.帶子.順序案.map((x) => x.顆)]
    .find((m) => n % m === 0 && S.帶子.順序案.some((x) => x.顆 === m));
  if (!基) throw new Error("順序案裡沒有 " + n + " 顆那一格，也沒有任何一格整除得了它");
  const b = S.帶子.順序案.find((x) => x.顆 === 基);
  return Array.from({ length: n / 基 }, () => b.序).flat();
};
export const 帶 = (n = S.帶子.顆數 * S.帶子.倍, k = S.帶子.間距) => {
  const it = 序of(n).map((key) => {
    const m = WM[key];
    if (!m) throw new Error("wm-sizes.json 裡沒有 " + key);
    return { k: key, w: m.w, h: m.w / m.ratio, 色: m.color, spec: m.spec };
  });
  const H = Math.max(...it.map((x) => x.h));
  const gap = H * k;
  let x = gap;
  for (const l of it) { l.x = x; l.y = gap + (H - l.h) / 2; x += l.w + gap; }
  return { it, 高: H, gap, 顆數: n, 間距: k, 總寬: x, 總高: H + 2 * gap };
};
export const BAND = 帶();
/* ── 牙洞在這個尺寸還看不看得到（2026-09-16）─────────────────────
 * 那一條縮成分隔線之後，每一顆只有 1~2 mm 寬 —— 洞跟著縮。這裡**現場量**每一顆的
 * 洞（路徑的最後一個子路徑）佔外框多寬，換算成印出來幾 mm，讓面板印出來。
 * ⚠⚠ 不是裝飾性的數字：平版印刷守得住的細節大約 0.2~0.3 mm，低於它那一排就會
 *   讀成「一條有節奏的線」而不是十一個標誌 —— 那正是分隔線要的，但要知道它會發生。 */
const 子路徑 = (d) => d.trim().split(/(?=M)/).map((x) => x.trim()).filter(Boolean);
const 框 = (seg) => {
  const n = (seg.match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
  let x0 = Infinity, x1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) { if (n[i] < x0) x0 = n[i]; if (n[i] > x1) x1 = n[i]; }
  return x1 - x0;
};
export const 洞比 = (k) => {
  const src = readFileSync(join(ROOT, "brand", "shapes", `shape-${k}.svg`), "utf8");
  const d = (src.match(/ d="([^"]+)"/) || [])[1];
  if (!d) throw new Error(k + " 抽不到 d");
  const ps = 子路徑(d);
  if (ps.length < 2) throw new Error(k + " 只有一個子路徑 —— 牙洞不見了");
  return 框(ps[ps.length - 1]) / 框(ps[0]);
};
export const 最小洞 = Math.min(...BAND.it.map((l) => 洞比(l.k) * l.w / BAND.總寬 * CARD.寬mm));
/* 相對亮度（只給面板算對比用） */
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const bandSvg = (B = BAND) => {
  const { it, 總寬, 總高 } = B;
  return `<svg class="bnd" viewBox="0 0 ${總寬.toFixed(1)} ${總高.toFixed(1)}" role="img" aria-label="芳仁牙醫診所的標誌排成的一條分隔線">` +
    it.map((o) => {
      const { vb, inner } = SHAPE(o.k);
      return `<svg x="${o.x.toFixed(1)}" y="${o.y.toFixed(1)}" width="${o.w}" height="${o.h.toFixed(1)}" viewBox="${vb}" style="color:${墨色}">${inner}</svg>`;
    }).join("") + "</svg>";
};

/* ⚠ 兩把尺（抬頭到主文、標誌左右留白）可以逐張覆寫 —— 尺上那幾格就是這樣畫的。
   ⚠⚠ 覆寫留白**一定要連字級一起重算**（hdOf 吃同一個比例），不然那一行的寬度會算錯。 */
/* 人物插圖（2026-09-16 定案 v3）—— `node drafts/channels/stand-illus-crop.mjs` 從
 * `插圖.原檔`（現在是 `drafts/stand-card-illus-v3-src.jpg`）裁出來的。
 * ⚠⚠⚠ **裁的是墨的框，不是整張原檔** —— 原檔上面留著一條白（提示詞要的），
 *   整張放進來照寬度縮會爆框；裁到墨之後 v3 是 2000×945 ＝ 比例 2.116，
 *   正好貼著那一塊（98 × 46.3 mm ＝ 2.117），畫出來 **98.0 × 46.3 mm、左右各餘 0.0**。
 * ⚠⚠ 所以它是**高度在卡**：`object-fit: contain` ＋ `flex:1`，那一塊有多高就畫多高，
 *   而那一塊是 `疊高()` 剩下來的 —— 上面的間距一動，這張圖就跟著變大或變小。
 * ⚠⚠⚠ **尺寸讀 `插圖.裁成`，不要在這裡再寫一份** —— 換一版圖只改 JSON 那一處，
 *   寫死的話 `<img>` 宣告的長寬會和實檔對不上（守門在擋）。
 * ⚠ 現況那一張不畫（它是照片的逐字對照）。 */
const ILLUS = S.插圖.檔;
const [ILLUSW, ILLUSH] = S.插圖.裁成;

const card = (c, now = false, o = {}) => {
  const { fs } = fsOf(c);
  const hd = hdOf(c, o.留白 ?? 留白比);
  const f = (k) => `calc(var(--cw) * ${k})`;
  const st = [o.間距 != null ? `--bd-gap:${f(o.間距)}` : "",
    o.段距 != null ? `--p-gap:${o.段距}em` : "",
    o.留白 != null ? `--li-gap:${LIGAPOF(o.留白)}em` : ""].filter(Boolean).join(";");
  return `<div class="card${now ? " now" : ""}${o.尺 ? " sc" : ""}"${st ? ` style="${st}"` : ""}>
  <div class="hd" style="font-size:${f(hd.fs.toFixed(4))}">${now ? esc(c.抬頭) : mark(c.抬頭)}</div>
  ${c.副標 ? `<div class="sub" style="font-size:${f(0.05)}">${esc(c.副標)}</div>` : ""}
  ${now ? "" : `<div class="sep">${bandSvg()}</div>`}
  <div class="bd" style="font-size:${f(fs.toFixed(4))}">${c.主文.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  ${c.QR上 ? `<div class="cue id" style="font-size:${f(ID字級)}">${esc(c.QR上)}</div>` : ""}
  ${now
    ? `<div class="qr ph"><span>QR</span></div>`
    : `<img class="qr" src="${QRFILE}" width="45" height="45" alt="芳仁牙醫診所 LINE 官方帳號的 QR code">`}
  ${c.QR下 ? `<div class="cue lo" style="font-size:${f(0.036)}">${esc(c.QR下)}</div>` : ""}
  ${now ? "" : `<img class="illus" src="${ILLUS}" width="${ILLUSW}" height="${ILLUSH}" alt="一群芳仁牙醫的醫事人員擠在一起，有人揮手、有人指著上方喊、有人舉著手機">`}
  ${now ? `<div class="band" style="font-size:${f(0.04)}">${esc(c.帶子 ?? "")}</div>` : ""}
</div>`;
};

/* ⚠ 兩把間距的尺畫在 **Ⓔ 那一張**（他挑定的那一案）上。
 * ⚠ 面板的數字每一格現算，不是寫上去的：換字、換字級、換卡片尺寸都會跟著動。 */
const 尺卡 = S.案.find((c) => c.id === "e");
/* ⚠⚠ 案數現算，不可以寫死「四案」—— 2026-09-16 拿掉四案之後，寫死的那個詞會靜靜地說謊
 *   （同第五十三、五十四節那條：一個「第 N 個」或「共 N 件」的數字，要嘛不寫，要嘛現算）。 */
/* ⚠⚠ 數的是**畫出來的那幾張**（2026-09-16 起 Ⓕ 留在資料裡但不畫）—— 拿 S.案.length 去數的話，
 *   頁面上會寫著一個看不到的數字。 */
export const 印的案 = S.案.filter((c) => !c.不印);
export const 不印的 = S.案.filter((c) => c.不印);
if (!印的案.length) throw new Error("每一案都標了「不印」—— 這一頁就沒有東西了");
const 案數詞 = "零一兩三四五六七八九"[印的案.length] ?? String(印的案.length);
/* ⚠⚠⚠ 兩把間距的尺 2026-09-16 稍晚定案（Ⓗ7 ＋ Ⓙ4），**卡片從頁面上拿掉、只留表**
 *   —— 同 50-22 與 71-13：尺可以收，它量出來的數字不可以跟著消失。
 * ⚠ 「・定案」是**算出來的**（`值 === 預設`），不要寫進標籤裡
 *   （兩邊都寫的話印出來會是「完全不留（定案）・定案」）。
 * ⚠⚠ 每一格的數字都現算，而且**兩把尺會互相牽動**：段距一改，Ⓗ 那張表整欄會跟著動。 */



/* ⚠⚠⚠ 2026-09-16 使用者：「以上還有其他下面的都不需要了　不要放在提案頁裏」——
 *   四把尺（Ⓗ 抬頭到主文／Ⓙ 每段之間／Ⓘ 標誌留白／Ⓚ Ⓛ 帶子）的表、拆解那六件、
 *   現況那一張、待答那幾題，全部從**頁面上**拿掉了。
 * ⚠⚠ **它們量出來的數字沒有跟著消失** —— 改由底下那塊面板接手，每跑一次產生器就印一次
 *   （尺可以收，數字不可以；同 50-22、71-13、71-14）。資料一筆都沒有刪，守門照舊在驗。
 * ⚠⚠⚠ 定案的留白**低於我們手上記的 25%**，所以那條線非印不可 —— 面板在跨線時會講一句。 */
const 規範留白 = 0.25;

/* ⚠⚠ 拿掉的那幾案要留一筆紀錄 —— 不見的時候要說人話，不要在一百行外丟 TypeError */
if (!S.刪案?.走了?.length || !S.刪案.取回 || !S.刪案.說明?.length || !S.刪案.節?.length) {
  throw new Error("資料裡的「刪案」缺了一半（走了哪幾案／收掉了哪幾節／去哪裡取回來／為什麼）—— 拿掉的是畫面，不是理由");
}


/* ⚠⚠⚠ 2026-09-16 使用者：「保留 E 就好　F 拿掉」——**拿掉的是畫面，不是那一案**。
 *   Ⓕ 在資料裡標了 `不印`，所以它不畫出來，但它仍然存在：Ⓔ 的字級釘在它身上、
 *   它是紅線那一道唯一乾淨的一案、也是那一條紅線唯一寫下來的最小改法。
 *   ⚠ 直接從「案」裡搬走的話，產生器會在 fsOf() 那一行 throw（那正是它該 throw 的時候）。 */
const 案 = 印的案.map((c) => `<div class="one">
<p class="lb">${esc(c.標籤)}</p>
${card(c)}
<div class="note">${para(c.註)}</div>
<div class="note">${para(S.插圖.說明)}</div>
</div>`).join("\n");



const HTML = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>櫃檯的小立牌　文字改版</title>
<style>
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;
  --brick:#8c3b32;--green:#3f654a;--cw:300px;--hd-ls:${HDLS}em;--li-h:${LIH}em;--li-gap:${LIGAP}em;--bd-gap:calc(var(--cw) * ${BDGAP});--p-gap:${PGAP}em}
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
   ⚠⚠ 左右的留白吃 --li-gap，它是「標誌自己高度的幾成」（2026-09-16 定案 12%）——
   不是抬頭裡那兩個半形空白給的（那個寫法跟著字型跑，已經換掉）。 */
.li{display:inline-block;height:var(--li-h);width:auto;
  margin:0 var(--li-gap);vertical-align:-.19em}
.card .sub{margin-top:.25em;color:#444}
/* ⚠⚠ 抬頭到主文那一段有**兩段**：這個上外距，加上第一行段落自己的 .28em ——
   .bd 是 flex 項目，兩段不會合併。要收間距兩段都要算進去。 */
.card .bd{margin-top:var(--bd-gap);width:100%}
.card .bd p{margin:var(--p-gap) 0;white-space:nowrap}
.card .cue{margin-top:calc(var(--cw) * .07);color:#555}
.card .cue.lo{margin-top:calc(var(--cw) * .03)}
/* QR 上面那一行（帳號 ID）：上面比下面寬，它才會讀成「這顆碼叫什麼」而不是主文的第四行。
   ⚠⚠ 底下那一條是**相鄰兄弟**選擇器 —— 它蓋掉 .qr 自己的 .04，所以多這一行實際只花
   .035 + 1.5×.038 + .018 − .04 ＝ 卡寬的 7.0%（面板每次印）。 */
.card .cue.id{margin-top:calc(var(--cw) * ${ID上})}
.card .cue.id + .qr{margin-top:calc(var(--cw) * ${ID下})}
/* ⚠⚠ QR 一律 calc(--cw * k) 不可以用百分比（參照會變成父層那一欄）。
   ⚠⚠⚠ 案那幾張擺的是**真的那顆碼**（drafts/channels/qr/ 複製過來的，一個像素都沒有重畫）；
   現況那一張刻意維持灰色佔位方塊 —— 它是照片的逐字對照，畫上新設計的碼就不是對照了。 */
.card .qr{width:calc(var(--cw) * ${CARD.QR佔卡寬});aspect-ratio:1;margin-top:calc(var(--cw) * .04);
  height:auto;display:block;border-radius:3px}
.card .qr.ph{background:repeating-linear-gradient(45deg,#dcdcdc 0 6px,#ececec 6px 12px);
  display:flex;align-items:center;justify-content:center}
.card .qr.ph span{font-size:.72rem;color:#8a8a8a;letter-spacing:.1em}
/* 人物插圖：**QR 底下到帶子剩多少就畫多高**（flex:1 ＋ min-height:0），
   所以它不會把卡片撐開，也不會動到帶子的位置（帶子的 margin-top:auto 因此歸零）。
   ⚠⚠ 一定要 object-fit:contain —— cover 會把左右兩個人各切掉一截，
   而且**畫面看起來很正常**。
   ⚠⚠⚠ **一定要滿版（負的左右外距，同帶子那一條）** —— 寫 width:100% 的話它只有
   內距框那麼寬（98 − 2×pad ＝ 86.2 mm），而裁圖那一支與面板從第一版起都拿 98 在算：
   症狀是兩側各留一條白（人被邊緣切掉就讀成畫錯，不是出血）、圖變成寬度在卡、
   上面空一截、一顆頭小 12% —— **每一道尺寸守門都會過**。 */
.card .illus{flex:1 1 auto;min-height:0;width:var(--cw);object-fit:contain;object-position:bottom center;
  margin:0 calc(var(--pad) * -1);display:block}
.card .band{margin:auto calc(var(--pad) * -1) 0;width:var(--cw);padding:calc(var(--cw) * .026) 0;
  background:#3c4657;color:#fff;letter-spacing:.03em}
.card .band.empty{background:transparent;border-top:1px dashed #d5d5d5;color:transparent}
/* 抬頭底下那條分隔線：滿版、沒有字、沒有底色。⚠⚠ 四邊的留白**在 SVG 的 viewBox 裡** ——
   這裡不可以補 padding，補了兩邊就又和中間不一致了（那五個間隔要出自同一個算式）。
   ⚠ 上下這兩個外距是分隔線自己的，和 Ⓗ（抬頭到主文）是兩件事。 */
.card .sep{width:var(--cw);margin:calc(var(--cw) * ${分上}) calc(var(--pad) * -1) calc(var(--cw) * ${分下});
  padding:0;display:block}
.card .sep .bnd{width:var(--cw);height:auto;display:block}
.card.now .bd p{white-space:normal}
.note{font-size:.86rem;color:var(--soft);margin:.6em 0 0}
.note p{margin:.35em 0}

/* ⚠⚠ 2026-09-16 收成一張卡之後，拆解那幾塊、四張表、待答那一列與底板那把尺的三格
   都不在頁上了，所以它們的樣式也一起收掉（留著死 CSS 會讓下一個人以為那幾節還在）。
   ⚠ 色票那兩個變數（brick／green）留著：那是這一站的顏色，不是這幾節的東西。 */
.foot{margin-top:2.6em;padding-top:1em;border-top:1px solid var(--rule);
  font-size:.82rem;color:var(--soft)}
@media (max-width:719px){:root{--cw:min(300px,88vw)}.one{max-width:none}}
</style>
</head>
<body>
<div class="wrap">

<h1>櫃檯的小立牌　文字改版</h1>
<p class="lede">底下那${案數詞}張卡是用網頁排的，<b>不是完稿</b> —— 這一輪只處理文字，插圖與版面下一輪。</p>

<div class="cards">${案}</div>
<div class="note">${para(S.刪案.說明)}
<p>拿掉的案：${S.刪案.走了.map(esc).join("、")}（${esc(S.刪案.時間)}）；
${不印的.map((c) => esc(c.標籤)).join("、")} 只是<b>不畫出來</b>，資料與守門都還在。
同一天從這一頁上收掉的幾節：${S.刪案.節.map(esc).join("、")}。
要回頭比：<code>${esc(S.刪案.取回)}</code></p></div>

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
    const q = join(OUT, QRFILE);
    if (!existsSync(q)) throw new Error("preview/line-stand/" + QRFILE + " 不見了 —— 跑一次產生器把它搬過來");
    if (!readFileSync(q).equals(readFileSync(QRSRC))) throw new Error(QRFILE + " 和 drafts/channels/qr/ 那一份對不起來 —— 改要改 qr-brand.mjs 再重跑，不要改 preview 底下那一份");
    /* ⚠⚠ 底板那把尺 2026-09-16 定案（Ⓝ2）並從頁面上收掉，所以落選那兩格**不再產檔** ——
       它們量出來的東西（三格各自的長相、三格都掃得出來）改由面板印。 */
    for (const [f2] of QRVAR()) {
      if (existsSync(join(OUT, f2)))
        throw new Error("preview/line-stand/" + f2 + " 還在 —— 底板那把尺已經收掉了，落選那兩格不再產檔");
    }
    console.log("✓ 逐位相同（含那顆 QR）");
  } else {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(f, HTML);
    writeFileSync(join(OUT, QRFILE), readFileSync(QRSRC));
    /* 尺收掉了 —— 落選那兩格若還躺在資料夾裡，跟著清掉（守門那張白名單也不再放行它們） */
    for (const [f2] of QRVAR()) if (existsSync(join(OUT, f2))) rmSync(join(OUT, f2));
    console.log("寫出 preview/line-stand/index.html ＋ " + QRFILE);
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
      (h.標誌 ? `（含 ${h.標誌} 顆標誌，一顆 ${LIW} 個字 ＝ ${(LIH * h.fs * CARD.寬mm).toFixed(1)} mm 高、左右各留 ${(留白比 * 100).toFixed(0)}%${留白比 < 規範留白 ? `　⚠ 低於規範的 ${(規範留白 * 100).toFixed(0)}%（使用者挑的）` : ""}）` : `（沒有標誌）`));
  }
  console.log("");
  {
    const 行 = 行距mm(尺卡), 抬 = 抬頭到主文mm(尺卡);
    console.log(`間距（畫在 ${尺卡.標籤} 上）　抬頭到主文 ${抬} mm・主文行距 ${行} mm ＝ ${(抬 / 行).toFixed(2)} 倍` +
      `　QR 底下到卡片下緣還剩 ${那一條mm(尺卡)} mm`);
    console.log(`     Ⓗ 抬頭到主文 ${CARD.抬頭到主文案.map((k) => `${(k.值 * 100).toFixed(1)}%→${抬頭到主文mm(尺卡, k.值)}`).join("　")}（mm，現在 ${(BDGAP * 100).toFixed(1)}%）`);
    console.log(`     Ⓙ 每段之間　 ${CARD.段距案.map((k) => `${k.值}em→${行距mm(尺卡, k.值)}`).join("　")}（mm，現在 ${PGAP}em）`);
    console.log(`     ⚠ 兩把互相牽動：段距一收，抬頭那一段也收一點、但行距收更多 —— 比值反而變大`);
  }
  console.log("");
  console.log(`標誌 ${S.標誌.檔} ${LOGO.寬}×${LOGO.高}（長寬比 ${LOGO.比}）—— 官方授權檔，只等比例縮放`);
  /* ⚠⚠⚠ 留白那把尺（Ⓘ）2026-09-16 連同表一起從頁面上收掉 —— 五格量出來的東西改在這裡印。
     ⚠ 定案那一格**低於我們手上記的規範**，那條線非印不可（第九節第 28 條 ④：
       壞掉檢查擋不住「靜靜地跨過去」）。 */
  console.log(`     Ⓘ 左右留白 ${S.標誌.留白案.map((k) => { const h = hdOf(尺卡, k.比);
    return `${(k.比 * 100).toFixed(1)}%→${(h.留白em * h.fs * CARD.寬mm).toFixed(2)}${k.比 < 規範留白 ? "⚠" : ""}`;
  }).join("　")}（mm，現在 ${(留白比 * 100).toFixed(1)}%${留白比 < 規範留白 ? `　⚠ 低於規範的 ${(規範留白 * 100).toFixed(0)}%，那是使用者挑的` : ""}）`);
  {
    const s2 = CARD.寬mm / BAND.總寬;
    console.log(`分隔線 ${BAND.顆數} 顆（基數 ${S.帶子.顆數} × ${S.帶子.倍}）（間距 ${BAND.間距}）`);
    console.log(`     合計 ${BAND.總寬.toFixed(0)}×${BAND.總高.toFixed(0)} 單位・最高的那一顆 ${BAND.高.toFixed(0)}（最矮 ${Math.min(...BAND.it.map((x) => x.h)).toFixed(0)}，差 ${(BAND.高 / Math.min(...BAND.it.map((x) => x.h))).toFixed(2)} 倍 —— 所以要垂直置中）`);
    console.log(`     在 ${CARD.寬mm} mm 的卡上　帶子高 ${(BAND.總高 * s2).toFixed(1)} mm・一顆最高 ${(BAND.高 * s2).toFixed(2)} mm・四邊與中間都是 ${(BAND.gap * s2).toFixed(2)} mm`);
    console.log(`     沒有底色・標誌 ${墨色}（淡墨，牙洞挖穿透出白紙）・壓在白紙上 ${(1.05 / (lum(墨色) + 0.05)).toFixed(2)}`);
    console.log(`     ⚠ 牙洞在這個尺寸 ${(最小洞 * 1000).toFixed(0)} µm ＝ ${最小洞.toFixed(2)} mm —— 平版印刷大約守得住 0.2~0.3 mm，所以那一排讀起來是一條線不是十一個標誌`);
    console.log(`     Ⓜ 倍數 ${S.帶子.倍案.map((k) => { const b = 帶(S.帶子.顆數 * k); const s3 = CARD.寬mm / b.總寬;
      return `${k}倍(${S.帶子.顆數 * k}顆)→高 ${(b.總高 * s3).toFixed(2)}・一顆最寬 ${(Math.max(...b.it.map((x) => x.w)) * s3).toFixed(2)}`; }).join("　")}（mm，現在 ${S.帶子.倍} 倍）`);
    console.log(`     Ⓚ 基數 ${S.帶子.順序案.map((k) => { const b = 帶(k.顆 * S.帶子.倍); return `${k.顆}→${(b.高 * CARD.寬mm / b.總寬).toFixed(2)}`; }).join("　")}（一顆最高 mm，現在基數 ${S.帶子.顆數} 顆 × ${S.帶子.倍}）`);
    console.log(`     分隔線 上 ${(分上 * CARD.寬mm).toFixed(2)} ／ 下 ${(分下 * CARD.寬mm).toFixed(2)} mm・抬頭到主文因此變成 ${抬頭到主文mm(尺卡)} mm`);
    console.log(`     Ⓛ 間距 ${S.帶子.間距案.map((k) => { const b = 帶(undefined, k.值); return `${k.值}→${(b.高 * CARD.寬mm / b.總寬).toFixed(2)}`; }).join("　")}（一顆最高 mm，現在 ${BAND.間距}）`);
  }
  console.log("");
  {
    /* 人物插圖：那一塊剩多少 → 這張圖畫出來多大。⚠ 兩個數字都現算，
       上面的間距一動、或換一張比例不同的圖，這裡就要跟著變。 */
    const [w, h] = S.插圖.裁成, [ow, oh] = S.插圖.原尺寸;
    /* ⚠⚠⚠ 2026-09-16 稍晚：那一條帶子搬到抬頭底下當分隔線，所以插圖**不再沉進任何東西後面** ——
       它畫出來的那一條就是「QR 底下到卡片下緣」，人的下半身由卡片自己的下緣切掉。 */
    const 條 = 那一條mm(尺卡);
    console.log(`人物插圖 ${S.插圖.檔}　原檔 ${ow}×${oh}（比例 ${(ow/oh).toFixed(3)}）→ 裁到墨的框 ${w}×${h}（比例 ${(w/h).toFixed(3)}）`);
    console.log(`     那一條 ${CARD.寬mm} × ${條} mm（QR 底下到卡片下緣，沒有東西蓋在它上面）＝ 比例 ${(CARD.寬mm/條).toFixed(3)}`);
    console.log(`     → ${w/h < CARD.寬mm/條 ? "⚠ 高度在卡（圖比那一條瘦，左右會留白）" : "寬度在卡"}，畫出來 ${(w/h*條).toFixed(1)} × ${條} mm・左右各餘 ${((CARD.寬mm - w/h*條)/2).toFixed(1)} mm・${(h*25.4/條).toFixed(0)} dpi`);
    console.log(`     ⚠ 整張原檔直接放（不裁）：照寬度縮會高 ${(CARD.寬mm/(ow/oh)).toFixed(1)} mm ＝ 爆框 ${(CARD.寬mm/(ow/oh)-條).toFixed(1)} mm`);
    console.log(`     ⚠⚠ 下一版要畫成 ${(CARD.寬mm/條).toFixed(2)}:1（裁到墨之後），這一版是 ${(w/h).toFixed(3)} —— 對不上就會左右留白`);
  }
  console.log(`卡片 ${CARD.寬mm} mm 寬・比例 ${CARD.比例}（${Math.round(CARD.寬mm * CARD.比例)} mm 高）—— 2026-09-16 拿尺貼著現況那張量過 ≈ 97×146，差 1%`);
  console.log(`QR ＝ ${S.QR.內容}（兩張照片各自解過一次；卡上那顆新的碼編的是同一個字串）`);
  /* ⚠ 第九節第 28 條 ③：那一行 ID 吃掉的正是使用者同一句話裡要變大的那一塊，要印出來。 */
  {
    const 有 = 印的案.filter((c) => c.QR上), 花 = (ID上 + 1.5 * ID字級 + ID下 - 0.04) * CARD.寬mm;
    console.log(`     QR 上面那一行 ${有.length ? 有.map((c) => c.QR上).join("／") : "（沒有印）"}` +
      `　字 ${(ID字級 * CARD.寬mm).toFixed(1)} mm・上 ${(ID上 * CARD.寬mm).toFixed(1)}／下 ${(ID下 * CARD.寬mm).toFixed(1)} mm` +
      `　花掉插圖那一條 ${花.toFixed(1)} mm（用通用的 .cue 間距要 ${((0.07 + 1.5 * 0.038) * CARD.寬mm).toFixed(1)}）`);
    console.log(`     ⚠⚠ 那一行印的是帳號 ID，而這顆碼編的是 ${S.QR.內容} —— 兩個去的地方不一樣（掃完會發生什麼還沒有人驗過）`);
  }
  /* ⚠ 第九節第 28 條 ④：換了一顆真的碼上去，它畫出來多大每次都要印 —— 印出來太小就掃不到。 */
  {
    const box = CARD.寬mm * CARD.QR佔卡寬;
    const vb = +(readFileSync(QRSRC, "utf8").match(/viewBox="0 0 (\d+(?:\.\d+)?) /) ?? [])[1];
    if (!vb) throw new Error("讀不到那顆 QR 的 viewBox");
    const Q = 4;   /* 靜區四格（qr-brand.mjs 的 CFG.Q）*/
    console.log(`     底板 ${S.QR.底板.預設}（${QRPLATE.find((a) => a.定案).標籤}）、落選 ${QRPLATE.filter((a) => !a.定案).map((a) => a.碼).join("／")}　` +
      `案那幾張擺的是 ${QRFILE}（逐位元組 ＝ drafts/channels/qr/ 那一份，只搬不畫）` +
      `　框 ${(CARD.QR佔卡寬 * 100).toFixed(0)}% 卡寬 ＝ ${box.toFixed(1)} mm、` +
      `碼本身 ${(box * (vb - Q * 2) / vb).toFixed(1)} mm（下限 15）` +
      `　現況那一張仍然是灰色佔位方塊（它是照片的對照）`);
    /* ⚠⚠ 底板那把尺 2026-09-16 定案（Ⓝ2）並收掉了 —— 三格各自的長相留在這裡
       （尺可以收，它量出來的數字不可以跟著消失）。三格都在印刷尺寸上拿 zxing 掃過。 */
    for (const a of QRPLATE)
      console.log(`     ${a.標籤}${a.定案 ? "・定案" : ""}　${a.註}`);
  }
  console.log("");
}
