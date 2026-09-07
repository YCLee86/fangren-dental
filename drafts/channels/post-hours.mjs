/* LINE 貼文用的「看診時間」圖 → preview/line-post-hours/*.png
 *   node drafts/channels/post-hours.mjs
 *
 * 使用者 2026-09-07：「可是網站上的門診表是有切換效果的，LINE 商家的貼文要怎麼做」
 *
 * ⚠⚠⚠ 這一題真正的判斷：**站上那個切換是為了解決「手機螢幕放不下」，不是為了好玩。**
 *   375px 寬的一格塞不進四個科別名，所以才要點一顆標記、一次只看一科。
 *   貼文的畫布是 1080px —— **放得下**，所以正確的做法不是模擬切換，
 *   是把切換本來要藏的東西**直接攤開**（Ⓐ／Ⓑ），滑動版（Ⓒ）只是備案。
 *   同 og-topic-card 那一輪：**換一個容器就要重新設計，不要照搬。**
 *
 * ⚠⚠⚠ **排班資料只有一個出處：index.html 那張 .hours-grid 的 data-in。**
 *   在這支腳本裡再抄一份，哪天診所改排班，貼文的圖就會開始說謊而且沒有人會發現。
 *   科別的名字、時段、休診說明也全部從 index.html 讀回來 —— 同 tools/schema.mjs
 *   讀營業時間的做法（第十節第 1 條「資料不重抄」）。
 *
 * ⚠ 顏色一個都沒有新增：七科的套色與深階、--paper／--card／--rule／--ink／--ink-soft
 *   全部是 PALETTE.md 既有的值。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條：完整版 chrome 畫出來會比
 *   --window-size 少 87px，而且不報錯）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文會落到 WenQuanYi Zen Hei ——
 *   這條線每一張圖都是這樣（bind-done-png 等等也是），**字級與折行要以真機為準**。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-hours");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const PAPER = "#e2e5e6", CARD = "#f4f4f5", RULE = "#cdd0d2";
const INK = "#2a2c27", SOFT = "#5c5f57";
const FILL = { general:"#3f654a", perio:"#317d78", endo:"#ae4f4d", kids:"#c28229",
               ortho:"#4478b5", prosth:"#465885", surg:"#8e6299" };
const DEEP = { general:"#2c5238", perio:"#2a6d69", endo:"#89202d", kids:"#9e6301",
               ortho:"#31637f", prosth:"#2a4677", surg:"#784e84" };

/* ⚠ 短名只給 Ⓐ 的格子用（144px 欄寬塞不下「植牙・假牙重建」六個字）。
   其餘每一處一律用 index.html 上的全名。**這是版面被迫的縮寫，要使用者點頭。** */
/* ⚠ 只有「格子裡寫字」那一版被寬度逼著縮。**只用圖案那一版不必縮** ——
   圖例裡是全名，所以 2026-09-07 開著的那個「要不要縮寫」的問題自己消失了。 */
/* ⚠⚠ 2026-09-07 使用者：「植牙改成假牙　植牙假牙重建　改成　假牙重建」。
   這一條**只換這張圖與這一頁上的顯示名** —— `index.html`／`topics/`／
   `tools/topic-copy.mjs` 上的「植牙・假牙重建」一個字都沒有動。
   **全站要不要跟著改名是另一件事，要先問使用者。** */
const DISP   = { "植牙・假牙重建": "假牙重建" };   /* 格子與圖例裡的全名 */
const SHORT2 = { "植牙・假牙重建": "假牙" };       /* 色碼表那一欄的兩個字 */
const disp = n => DISP[n] || n;
const two  = n => SHORT2[n] || n.slice(0, 2);

/* ⚠⚠⚠ Ⓖ3「每科一顆記號」用的是 brand/shapes 那九顆（同一個標誌的九種變體）。
   挑法避開 r1c3×r2c3 —— 在 22px 下那一對只差 5.6%。
   **但量出來的結論是這條路不成立**：九顆畫成 22px（＝格子裡記號的大小），
   兩兩不同的像素比例**最不像的一對也只有 20.9%、中位 16.7%**
   （對照浮水印那一輪在 150px 下是最不像 52.0%、中位 26.6%）。
   ⚠ 通則（已在 CLAUDE.md）：**在成品的尺寸上量，不要在素材的尺寸上量。** */
/* ⚠⚠⚠ 2026-09-07 使用者：「顯微的那個 logo 看起來哭哭，換別的。」
   他是對的，而且成因看得出來：**九顆裡只有 r1c1 與 r2c1 是雙洞**，
   而 r2c1 的兩個洞在**頂端**、形狀又扁又寬 —— 縮到 30px 就是兩隻眼睛
   加一張抿著的嘴。r1c1 的兩個洞在**底部**（讀起來像牙根），沒有這個問題。
   → 顯微根管換成 **r3c1**（圓形、單洞）。單洞的形狀不會被讀成臉。
   ⚠ 沒有選 r1c3：它和口腔外科的 r2c3 在小尺寸下只差 5.6%，是九顆裡最像的一對。 */
const SHAPE = { general:"r1c1", perio:"r1c2", ortho:"r3c3", endo:"r3c1",
                prosth:"r2c2", surg:"r2c3", kids:"r3c2" };
/* ⚠ 九顆全部讀進來（不是只讀用到的七顆）—— 這樣才換得動：`SHAPE` 只是
   「哪一科用哪一顆」的對照表，臨時改一個字就能出一張換過形狀的圖。 */
const ALLSH = ["r1c1","r1c2","r1c3","r2c1","r2c2","r2c3","r3c1","r3c2","r3c3"];
const MK = Object.fromEntries(ALLSH.map(sh => [sh,
  fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
    .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
    .replace(/<svg/, '<svg class="mk"')]));
const mark22 = new Proxy({}, { get: (_, id) => MK[SHAPE[id]] });

/* 各形狀的長寬比：**從 viewBox 讀，不寫死**。
   ⚠⚠⚠ 2026-09-07 使用者：「齒顎矯正的 logo 細細的不太明顯，有其他可以換嗎。」
   量出來他是對的，而且比想像中嚴重 —— 九顆放進同一個 30px 方框，墨面積是：
     r3c1 顯微 734　r3c2 兒牙 712　r1c1 一般 699　r2c2 假牙 558
     r1c2 牙周 357　r2c1（沒用到）349　r1c3（沒用到）228　r2c3 口外 227
     **r3c3 矯正 174 ＝ 一般牙科的 25%，九顆裡最輕的那一顆。**
   ⚠⚠⚠ 但「換一顆」解不掉：九顆裡有**三顆**是長寬比 3.08 的細長家族
     （r1c3／r2c3／r3c3），而七科要用掉九顆裡的七顆 —— 扣掉被退回的 r2c1，
     那三顆**一顆都躲不掉**。換給誰只是把細的那一顆換一個科別（口外現在就是 227）。
   → 所以這一輪給的是**等重**那條路（同浮水印那一輪 22-13 的做法）：
     按墨面積算出每一顆自己的寬度，細長的放大、方的不動。 */
const AR = Object.fromEntries(ALLSH.map(sh => {
  const vb = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
    .match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!vb) throw new Error(`shape-${sh}.svg 讀不到 viewBox`);
  return [sh, +vb[1] / +vb[2]];
}));
const ASPECT = new Proxy({}, { get: (_, id) => AR[SHAPE[id]] });
/* 墨面積開瀏覽器現量（九顆都量），量到之前是 null ＝ 不加權 */
let INK9 = null;
const INKA = new Proxy({}, { get: (_, id) => INK9 && INK9[SHAPE[id]] });
const wScale = (id, wgt) => !wgt || !INK9 ? 1
  : Math.pow(INKA.general / INKA[id], wgt === "half" ? .25 : .5);
/* ⚠⚠⚠ 2026-09-07 使用者：「感覺間距要拉開一點，因為有矯正的診，
   logo 看起來和其他沒有矯正的時段沒對齊。」
   **拉開間距和對齊是兩件事**（同第九節第 17 條那條淡出）：
   ・**間距** ＝ 一列裡兩顆之間留多少（`--icgx`，三格 11／16／22）。
   ・**對齊** ＝ 等重之後每一顆的寬度不一樣（矯正 42、牙周 36、其餘 30），
     一列置中之後**起點跟著那一列有誰而跑**，所以同一欄不同列對不齊。
     → 治法是**每一顆給一樣寬的格子**（slot ＝ 最寬那一顆），
       圖案在自己的格子裡置中；一列有幾顆，位置就落在同一組刻度上。
   ⚠ 拉開間距**不會**治好對齊，等寬格**不會**讓它變鬆 —— 兩條尺各自要給。 */
const icSize = (id, base, wgt, slot = 0) => {
  if (!wgt) return "";
  const w = base * wScale(id, wgt), h = w / ASPECT[id];
  return slot
    ? `width:${slot.toFixed(1)}px;height:${base}px;`
      + `--mw:${w.toFixed(1)}px;--mh:${h.toFixed(1)}px;`
    : `width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;`;
};
/* 等寬格要多寬 ＝ 最寬的那一顆（現在是矯正）。base 一改自己跟著算 */
const slotOf = (base, wgt) => wgt
  ? Math.max(...Object.keys(SHAPE).map(id => base * wScale(id, wgt))) : 0;

/* ---------- 從 index.html 讀回來（唯一的出處） ---------- */
function parse() {
  const card = SRC.slice(SRC.indexOf('<div class="info-card" data-hue="taupe">'));
  const tbl  = card.slice(card.indexOf('<table class="hours-grid">'), card.indexOf("</table>"));

  const specs = [...card.matchAll(/data-spec="([a-z]+)"[^>]*>([^<]+)</g)]
    .map(m => ({ id: m[1], name: m[2].trim() })).filter(s => s.id !== "all");
  const allLabel = (card.match(/data-spec="all"[^>]*>([^<]+)</) || [])[1].trim();

  const days = [...tbl.matchAll(/<th scope="col">([^<]+)<\/th>/g)].map(m => m[1]);
  const rows = [...tbl.matchAll(
    /<th scope="row"><b>([^<]+)<\/b>([^<]+)<\/th>([\s\S]*?)<\/tr>/g)]
    .map(m => ({
      part: m[1], time: m[2].trim(),
      cells: [...m[3].matchAll(/data-in="([^"]*)"/g)].map(c => c[1].split(/\s+/).filter(Boolean))
    }));
  const note = (card.match(/class="info-note">([^<]+)</) || [])[1].trim();

  /* 守門：讀回來的東西要對得上，對不上就不要出圖 */
  if (specs.length !== 7) throw new Error(`科別讀到 ${specs.length} 個，應該是 7`);
  if (days.length !== 5)  throw new Error(`日子讀到 ${days.length} 欄，應該是 5`);
  if (rows.length !== 3)  throw new Error(`時段讀到 ${rows.length} 列，應該是 3`);
  for (const r of rows) if (r.cells.length !== 5) throw new Error(`${r.part} 只有 ${r.cells.length} 格`);
  const known = new Set(specs.map(s => s.id));
  for (const r of rows) for (const c of r.cells) for (const s of c)
    if (!known.has(s)) throw new Error(`data-in 出現不認識的科別：${s}`);
  return { specs, allLabel, days, rows, note };
}
const D = parse();


/* ---------- 版面 ------------------------------------------------------
 * ⚠⚠⚠ 2026-09-07 使用者看過五案：「覺得不夠乾淨　簡潔」。
 *   拆開來是三件，三件各自要治（同第九節第 17 條那條淡出）：
 *   ① **同一件事寫了兩次** —— 舊版「看診時間」出現在大標題和卡片右上角，
 *      「請來電確認」和「診所電話」也在講同一件事。
 *   ② **層次太多** —— 大標題／副標／卡片框／卡片內的品牌條／頁尾註 ＝ 五層。
 *   ③ **顏色太花** —— Ⓐ 一格四個彩色的名字，整張圖同時出現七種顏色。
 *      ⚠⚠ 這一件推翻我上一輪的判斷只講對一半：**站上那個切換不只解決
 *      「一格放不進四個名字」，也解決「七色同時出現太花」** —— 它一次只上一科的色。
 *
 * 所以這一版：**一張圖只有三塊**（識別／表／電話），沒有卡片框、沒有副標、
 *   沒有大標題，文字一律墨與柔墨，科別的顏色收成一顆小點。
 * ⚠ 而且整塊內容**收進中間那條安全帶**（y 271~809）——
 *   上下留紙色的空白，同時解決「乾淨」與「大格會裁掉識別」兩件事。
 *   留白本身就是乾淨，不是浪費。
 *
 * ⚠⚠ 「乾淨簡潔」也淘汰了舊的 Ⓑ（要來回對照圖例）與 Ⓒ（要滑八張），
 *   所以這一版只剩兩案：**格子** 與 **一科一行**。
 */
const W = 1080, H = 1080;
const BAND = Math.round(W * (409 / 823));        /* 大格看得到的列數 ＝ 537 */
const TOP = (H - BAND) / 2, BOT = H - TOP;
/* ⚠⚠ 2026-09-07 使用者：「左上的大 logo 拿掉　直接寫芳仁牙醫開診時段。」
   所以這張圖上**一顆大標誌都沒有** —— 品牌靠格子裡那些科別記號
   （都是 brand/shapes 的形狀）與標題那幾個字。不要因為「圖上沒有 logo」自己加回去。
   ⚠ 「看診時間」也一起換成**開診時段**（＝站上門診表那排標記第一顆用的字）。 */
const TITLE = "芳仁牙醫開診時段";
/* ⚠⚠ 2026-09-07 第三輪使用者：「這張照片可以一個大 logo 的淡色浮水印，
   像之前 line 約診查詢的頁面那樣，顏色就用淡墨色。」
   ＝ 約診卡那一輪（README 22-13）的做法：**一顆大的、淡的、從邊緣切出去**。
   ⚠ 這裡用**站上頁首那一條**（mark.svg），不是九顆科別記號裡的任何一顆 ——
   那九顆在格子裡各自有身分，拿其中一顆放大會讓人以為那一科比較重要。
   ⚠ 顏色是墨 ＋ 很低的 opacity，**不新增任何顏色**。 */
const WMSH = "r3c1";   /* 2026-09-07 使用者：「浮水印改用圓的 logo」→「用另外一顆圓 logo」
                         ＝ 圓的那兩顆裡的**單洞版**（格子裡顯微根管在用的那一顆）。
                         ⚠ 兩顆的長寬比都是 1.00，所以下面那四個數字一個都不必動。 */
const WMARK = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${WMSH}.svg`), "utf8")
  .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
  .replace(/<svg/, '<svg class="wm"');
/* 頁尾那顆話筒。素材出處：Lucide "phone"，ISC 授權，https://lucide.dev ——
   這一行註解就是署名，改圖或搬檔的時候不要刪。
   ⚠ 幾何直接從 index.html 頁首那顆讀回來，不抄第二份（同這一支其餘每一項資料）。 */
const TELICO = (SRC.match(/<span class="ico"><svg viewBox="0 0 24 24"[^>]*>(<path d="M21\.5[^"]+"\/>)<\/svg><\/span>/) || [])[1];
if (!TELICO) throw new Error("index.html 裡找不到話筒那條路徑（.c-tel 的 Lucide phone）");
/* ⚠⚠ 2026-09-07 第二輪使用者：「電話移到國定假日那段文字下一行，電話 logo 改實心、
   套墨色，電話號碼也套墨色，字級大小和國定假日那段文字一樣。」
   所以頁尾現在是**兩行、都靠左、都 23px**：上行柔墨（那句話）、下行墨（話筒＋號碼）。 */
const ICOPX = 21;   /* ＝ 站上那顆 11.33px 配 12.48px 的字，同比例放到 23px 的號碼旁 */
const TELSVG = `<svg viewBox="0 0 24 24" aria-hidden="true">${TELICO}</svg>`;
/* 這兩個是出圖前在瀏覽器裡現量的（見下面 telAlign），不寫死 */
let TELDY = 0, ICODY = 0;
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!PHONE) throw new Error("index.html 裡找不到電話（畫面上的寫法是 05-5339369）");

/* 浮水印的四個數字（大小／往右切出去／離上緣／濃度）。
   ⚠⚠ 第一版擺在右下角、切掉一半以上 —— 在 1080 見方上讀起來就是一團灰，
   看不出是標誌。約診卡那一輪之所以那樣做，是因為那張卡只有 207px 寬；
   這裡要的是「一個大 logo」，所以**只從右邊切掉一點點、其餘完整露出來**，
   並且壓在表的後面（同約診卡：浮水印在字的後面，不是躲在空白處）。 */
const WMW = 660, WMR = -60, WMT = 470, WMA = .05;
/* 版心的左右內距（裝置 px，放大時自己換算）與整體放大倍率 */
const PAD = 44, LAB = 158;
let S = 1;
/* 標題底下要多墊多少（版心的單位）——見下面 fitScale 那一段，量出來才填 */
let EX = 0;
const css = () => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       position:relative;overflow:hidden}
/* 浮水印：從右下角切出去，壓在所有東西後面 */
svg.wm{position:absolute;width:${WMW}px;height:auto;right:${WMR}px;top:${WMT}px;
       color:${INK};opacity:${WMA};z-index:0}
.band{position:relative;z-index:1}
/* ⚠⚠⚠ 2026-09-07 使用者：「整個表的邊界抓的太小，周圍還有很多空間，把邊界縮小，
   好處是文字、圖案可以放大，這樣辨識度比較好。」
   ・**左右**是免費的：內距 74 → 44px，版心 932 → 992（表跟著變寬）。
   ・**上下不是** —— 空的那兩塊正是「主頁大格只看得到中間 537 列」留的餘裕
     （見上面 BAND 那一段）。整體放大 ＝ 內容變高 ＝ 大格會從上下切掉東西。
   所以放大做成一把尺，每一格都算出「大格會切掉什麼」讓他挑。
   ⚠⚠ 放大是用 CSS 的 zoom 做的：版心寫成 1080 除以 S、再乘回來，
   **裡面每一個 px 都跟著長**（字級、圖案、內距、圓角一次到位），不必一個一個改。
   ⚠ zoom 會一併縮放 getBoundingClientRect，所以量出來的仍然是裝置 px，
   下面每一道守門都不必改寫。
   ⚠⚠⚠ 這一段註解本來寫了幾個反引號（想標出變數名），整支腳本就在這裡語法錯誤 ——
   **這一整塊是 JS 的模板字串，CSS 註解裡不可以出現反引號**（第九節第 8 條的近親，
   這條線上已經是第四次踩到）。要標變數名就用中文引號。 */
.band{padding:0 ${(PAD / S).toFixed(2)}px;width:${(W / S).toFixed(2)}px;zoom:${S}}
.band.s18{--ics:18px}
.band.s20{--ics:20px}
.band.s22{--ics:22px}
.band.s26{--ics:26px}
.band.s30{--ics:30px}
.band.s16{--ics:16px}
.band.s14{--ics:14px}
.id{padding-bottom:${(12 + EX).toFixed(2)}px}
.id b{font-size:31px;font-weight:700;letter-spacing:.05em}
.rule{height:1px;background:${RULE}}
/* ⚠⚠⚠ 2026-09-07 使用者：「最下面的電話和國定假日那段文字對齊。」
   基線對齊（原本那樣）**不等於看起來對齊** —— 兩邊字級不一樣（23 vs 31），
   而中文的字面中線在基線上方約 0.345em、阿拉伯數字是 capHeight 的一半，
   兩者離基線的距離差了好幾 px，而眼睛讀的是**字面中線**不是基線（第九節第 9 條）。
   所以 --tel-dy 是量出來的：把號碼整組往下推到「兩邊的字面中線同一條」。
   ⚠ 那個值不寫死，每次出圖現量（字級一改自己跟著對）。
   ⚠⚠ .no 刻意**不是** flex 容器 —— 裡面第一個是 svg，flex 容器的基線會取第一個
      項目的下緣，整條 .tel 的 baseline 對齊會壞掉。話筒用 inline-block 走文字流。 */
.tel{padding-top:10px;font-size:23px;color:${SOFT};letter-spacing:.02em;line-height:1.5}
.tel .no{color:${INK};white-space:nowrap}
/* 實心：fill 吃 currentColor、不描邊（站上那顆是空心的，這裡刻意不一樣） */
.tel .no svg{width:${ICOPX}px;height:${ICOPX}px;display:inline-block;
             margin-right:9px;transform:translateY(var(--ico-dy,0px));
             fill:currentColor;stroke:none}

/* 格子 */
table{width:100%;border-collapse:collapse;table-layout:fixed}
/* ⚠ 時段那一欄量到 148.7（版心的單位），原本給 176 ＝ 白白吃掉 27。
   收到 158 之後那 27 全部讓給五天的欄，也就是「放大」那把尺的天花板往上抬。 */
col.lab{width:${LAB}px}
thead th{font-size:27px;font-weight:400;color:${SOFT};padding:8px 0 6px;letter-spacing:.1em}
/* ⚠⚠ 2026-09-07 第三輪使用者：「早午晚的間隔可以再拉開一點，
   禮拜三的診看起來特別緊密。」——禮拜三是唯一兩節都排成 2＋2 的一欄，
   所以列與列之間本來就最擠。上下內距 8 → 13px（列距 16 → 26）。
   ⚠⚠ 這 42px 是**從別的地方挪來的**，不是憑空多出來：安全帶只剩 9px 餘裕，
   所以標題下 18→14、表頭 11/7→8/6、圖例上 26→20、頁尾上 16→12
   各收一點（合計 19px）。**改任何一個數字之前先看還剩多少餘裕。** */
tbody td{text-align:center;vertical-align:middle;padding:var(--rowpad,13px) 4px}
/* 2026-09-07 使用者：「早午晚跟時間不用斷行　空間還很夠用。」
   ⚠ 那一欄 176px，收起來之後量到約 129px —— 出圖時有一道守門在確認它沒有被折行。 */
tbody th{text-align:left;padding:var(--rowpad,13px) 8px var(--rowpad,13px) 0;
         font-weight:400;line-height:1.2;white-space:nowrap}
tbody th b{font-size:26px;font-weight:400;letter-spacing:.1em;margin-right:7px}
tbody th i{font-style:normal;font-size:19px;color:${SOFT}}
tbody tr + tr th, tbody tr + tr td{border-top:1px solid ${RULE}}
.nm{font-size:23px;line-height:1.34;letter-spacing:.02em}
.mk-row{display:flex;align-items:center;justify-content:center;gap:7px}
svg.mk{width:100%;height:100%;display:block}
.ic > svg.mk{width:var(--mw, 100%);height:var(--mh, 100%)}
/* 只有圖案那一版：格子裡的圖案 30px 一列排開；圖例的 26px */
.ic{width:var(--ics, 30px);height:var(--ics, 30px);flex:none;display:flex;align-items:center;justify-content:center}
.mk-row .ic, .mk-row svg.mk{width:22px;height:22px}
/* ⚠ 2026-09-07 使用者：「每診裡面的 logo 現在靠得有點近，有點擠。」
   橫向 6 → 11px、行距 6 → 9px。格子寬約 151px，兩顆 30px ＋ 11 ＝ 71，還很寬鬆。 */
.ic-row{display:flex;flex-direction:column;align-items:center;gap:var(--icgy, 9px)}
.ic-line{display:flex;align-items:center;justify-content:center;gap:var(--icgx, 11px)}
/* 2026-09-07 使用者：「現在 logo 擠成一個橫條」——四個排成一列讀起來像一條，
   看不出是四個各自獨立的東西。兩個對照版本：
   col  一格裡全部直排（一節一欄）
   w2   一行兩個、滿了斷行（四個 ＝ 2×2）
   ⚠⚠ 直排有一個量得出來的代價：晚那一列有四個，直排就是四倍高，
      整塊會超出安全帶 —— 所以圖案得縮小，而圖案一小就回到「分不出來」那個問題。
      w2 只長兩倍高，圖案可以維持原來的大小。 */
.ic-row.col{gap:5px}


/* ⚠⚠⚠ 2026-09-07 第二輪使用者：「各科別 logo 和文字說明那邊，每個科別再拉開一點，
   上下兩行對齊（現在是分別置中）。」
   ・原本是兩條各自 justify-content:center 的 flex —— **兩行各自置中，所以欄對不上**。
   ・改成一個四欄的 grid（整塊置中、欄自己對齊），第二行的三個自然落在前三欄底下。
   ・⚠ 七個科別名剛好都是四個字，所以四欄同寬；圖案再套上**和格子裡同一組等寬格**
     （slotOf），文字的起點才會跟著對齊 —— 只對齊外框、圖案寬度不一樣的話，
     字還是會各自參差。
   ・間距 26 → 40px。 */
.lg{padding-top:16px;display:grid;grid-template-columns:repeat(4,max-content);
    column-gap:40px;row-gap:8px;width:max-content;margin-inline:auto}
.lg-i{display:flex;align-items:center;gap:9px;font-size:23px;color:${INK};letter-spacing:.02em}
.ic.sm{width:24px;height:24px}

/* 一科一行 */
.rows{padding-top:6px}
.row{display:flex;align-items:center;gap:16px;padding:12px 0}
.row + .row{border-top:1px solid ${RULE}}
.sp{flex:none;width:250px;font-size:25px;letter-spacing:.03em;
    display:flex;align-items:center;gap:13px}
.sp i{width:14px;height:14px;border-radius:50%;flex:none}
.g{font-size:25px;letter-spacing:.1em;white-space:nowrap;margin-right:26px}
.g b{font-weight:400;color:${SOFT};margin-right:8px;letter-spacing:.02em}
`;

const shell = (inner, cls = "", gap = null) => `<div class="sheet">${WMARK}<div class="band ${cls}"${
  gap ? ` style="--icgx:${gap[0]}px;--icgy:${gap[1]}px"` : ""}>
  <div class="id"><b>${TITLE}</b></div>
  <div class="rule"></div>
  ${inner}
  <div class="rule"></div>
  <div class="tel" style="--ico-dy:${ICODY.toFixed(2)}px"><div>${
    D.note.replace(/。$/, "")}</div><div class="no">${TELSVG}${PHONE}</div></div>
</div></div>`;

/* Ⓖ 格子：日子當欄、早午晚當列，格子裡直接寫科別。
 * 2026-09-07 使用者：「G 文字的比較好，但有需要這麼多顏色嗎…或是每個科別各自用一個 logo」
 * 三個方案：
 *   ink   全部同一個墨（＝他講的那一個）
 *   rank  **一般牙科退一階（建議）** —— ⚠⚠⚠ 它在 15 節裡佔 12 節，
 *         是「這一節有沒有開診」的背景，不是「這一節有什麼特別的」的資訊。
 *         和其他六科畫成一樣重，等於讓最不需要找的東西佔掉最多視覺重量
 *         （25 個名字裡有 12 個是它）。退一階之後，五科特別門診自己跳出來。
 *   mark  每科一顆記號（＝他的第二個提議，量測見上面 SHAPE 那一段）
 */
const grid = (mode, ics, k = 1, flat = false, pal = null, wgt = null, gap = null, slot = false) => shell(`<table><colgroup><col class="lab"><col span="5"></colgroup>
  <thead><tr><td></td>${D.days.map(d => `<th>${d}</th>`).join("")}</tr></thead>
  <tbody>${D.rows.map(r => `<tr>
    <th><b>${r.part}</b><i>${r.time}</i></th>${r.cells.map(c => `<td>${
      mode.startsWith("i") ? `<div class="ic-row">${lines(c, mode).map(g =>
          `<div class="ic-line">${g.map(id =>
            `<span class="ic" style="${icSize(id, ics || 30, wgt, slot ? slotOf(ics || 30, wgt) : 0)}color:${tone(id, k, flat, pal)}">${mark22[id]}</span>`
          ).join("")}</div>`).join("")}</div>`
      : c.map(id => { const sp = D.specs.find(x => x.id === id);
          const nm = disp(sp.name);
          const col = mode === "rank" && id === "general" ? SOFT : INK;
          return mode === "mark"
            ? `<div class="nm mk-row" style="color:${col}"><span class="ic">${mark22[id]}</span>${nm}</div>`
            : `<div class="nm" style="color:${col}">${nm}</div>`;
        }).join("")}</td>`).join("")}</tr>`).join("")}</tbody></table>`
  + (mode.startsWith("i") ? legend(k, flat, pal, wgt) : ""), ics ? `s${ics}` : "", gap);

/* ⚠⚠⚠ 一格裡的圖案怎麼分行（2026-09-07 使用者：「一個診有三個科別的，
 *   第一行一個科第二行兩個科，這樣才不會頭重腳輕」）。
 *   flex 的自動換行是「填滿一行再換」，三個一定排成 2＋1（上重下輕）——
 *   **`wrap-reverse` 治不了**：它把行的上下對調，第一行會變成第三科，
 *   科別的順序就亂了。所以改成**自己分組**，順序原封不動：
 *     1 → [1]　2 → [2]　**3 → [1, 2]**　4 → [2, 2]
 *   規則：奇數且大於一時，第一行只放一個。 */
const lines = (c, mode) =>
  mode === "icol" ? c.map(x => [x])                    /* 直排：一行一個 */
  : mode === "i2x2" ? (c.length % 2 === 1 && c.length > 1
      ? [[c[0]], ...chunk(c.slice(1), 2)] : chunk(c, 2))
  : [c];                                               /* 橫排一列 */
const chunk = (a, n) => a.length ? [a.slice(0, n), ...chunk(a.slice(n), n)] : [];

/* 圖例：logo 套色 ＋ 科別名用墨（使用者 2026-09-07 指定）。
 * ⚠⚠ 格子裡只剩圖案的話，第一次看的人**一定要對照這一排** ——
 *   所以它不是裝飾，是那張表讀不讀得懂的前提，不可以為了省高度砍掉。
 * ⚠ 排成 4 ＋ 3 兩行（七個一行放不下），刻意不讓它自己 wrap ——
 *   自己 wrap 會斷成 6＋1（招呼卡那一輪的圖例踩過）。 */
const legend = (k = 1, flat = false, pal = null, wgt = null) => `<div class="lg">${
  D.specs.map(sp =>
    `<span class="lg-i"><span class="ic sm" style="${
      icSize(sp.id, 24, wgt, wgt ? slotOf(24, wgt) : 0)}color:${tone(sp.id, k, flat, pal)}">${
      mark22[sp.id]}</span>${disp(sp.name)}</span>`).join("")}</div>`;

/* Ⓛ 一科一行：照「早／午／晚」各列出哪幾天 */
const byPart = (id) => D.rows.map(r => ({
  part: r.part,
  days: r.cells.map((c, ci) => c.includes(id) ? D.days[ci] : null).filter(Boolean)
})).filter(g => g.days.length);

const list = () => shell(`<div class="rows">${D.specs.map(sp => `<div class="row">
    <div class="sp"><i style="background:${FILL[sp.id]}"></i>${disp(sp.name)}</div>
    <div>${byPart(sp.id).map(g => `<span class="g"><b>${g.part}</b>${g.days.join("")}</span>`).join("")}</div>
  </div>`).join("")}</div>`);

/* ---------- 「詳情」那一欄要貼的字 ----------
 * 一個一覽項目 ＝ 一張方形照片 ＋ 一段「詳情」。所以圖不必把每一件事都扛下來。
 * ⚠ 這段字也從同一份資料長出來（時段、休診說明、電話都不重打）。
 * ⚠⚠ **不要補回「週六、週日休診。」** —— 那句 2026-08-13 由使用者拿掉了，
 *   理由是表只列一到五就看得出來；這裡的表一樣只列一到五。
 * ⚠⚠ 紅線：這個帳號沒有專人即時回覆，不可以出現「有問題隨時問」那一類的話。
 */
const detail = `一週的門診時段，以及每一節有哪些科別。\n`
  + D.rows.map(r => `${r.part} ${r.time}`).join("　") + `\n`
  + D.note.replace(/。$/, "") + `　${PHONE}`;
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);

/* ---------- 彩度 ----------------------------------------------------
 * 2026-09-07 使用者：「這裡 logo 色覺得很吵雜熱鬧…似乎可以降一點彩度。」
 * ⚠⚠ 做法是 sRGB → Lab，**只乘 a／b、L 原封不動** —— 所以對比度一格都不掉
 *   （實測七色對底 100% 是 4.51、35% 是 4.53，只有彩度在動）。
 * ⚠⚠⚠ 但降彩度是有代價的：七色會互相靠近。實測最近的一對 ——
 *   100% 18.6　80% 16.1　65% 14.4　50% 10.9　35% 7.6。
 *   站上既有、已經被接受的最緊那一格是 ΔE 13.3～13.6，
 *   所以 **65% 是安全的下界**，50% 已經比全站最近的深階對（10.5）還近。
 * ⚠⚠⚠ 另有一條更省的路：**一般牙科轉中性**。它在 25 個圖案裡佔 12 個（48%），
 *   而且是「這一節有沒有開診」的背景不是資訊 —— 轉成柔墨，整張圖立刻只剩
 *   13 顆彩色。這是「只削弱不需要被看到的那一半」，全體降彩度則是把該被
 *   看到的五科也一起削弱。順帶：現在最近的一對正好就是「一般牙科×牙周」，
 *   轉中性之後那一對消失，六色最近的一對從 18.6 變成 20.1。
 */
const hex2rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const rgb2hex = r => "#" + r.map(v => Math.max(0,Math.min(255,Math.round(v)))
  .toString(16).padStart(2,"0")).join("");
const lz = c => { c/=255; return c<=.04045 ? c/12.92 : Math.pow((c+.055)/1.055,2.4); };
const unlz = c => 255*(c<=.0031308 ? 12.92*c : 1.055*Math.pow(c,1/2.4)-.055);
const MX=[[.4124,.3576,.1805],[.2126,.7152,.0722],[.0193,.1192,.9505]];
const MI=[[3.2406,-1.5372,-.4986],[-.9689,1.8758,.0415],[.0557,-.2040,1.0570]];
const WP=[.95047,1,1.08883];
const ff=t=>t>Math.pow(6/29,3)?Math.cbrt(t):t/(3*Math.pow(6/29,2))+4/29;
const fi=t=>t>6/29?t*t*t:3*Math.pow(6/29,2)*(t-4/29);
const toLab = h => { const [r,g,b]=hex2rgb(h).map(lz);
  const X=MX[0][0]*r+MX[0][1]*g+MX[0][2]*b, Y=MX[1][0]*r+MX[1][1]*g+MX[1][2]*b,
        Z=MX[2][0]*r+MX[2][1]*g+MX[2][2]*b;
  const fx=ff(X/WP[0]), fy=ff(Y/WP[1]), fz=ff(Z/WP[2]);
  return [116*fy-16, 500*(fx-fy), 200*(fy-fz)]; };
const unLab = ([L,a,b2]) => { const fy=(L+16)/116, fx=fy+a/500, fz=fy-b2/200;
  const X=WP[0]*fi(fx), Y=WP[1]*fi(fy), Z=WP[2]*fi(fz);
  return rgb2hex([MI[0][0]*X+MI[0][1]*Y+MI[0][2]*Z, MI[1][0]*X+MI[1][1]*Y+MI[1][2]*Z,
                  MI[2][0]*X+MI[2][1]*Y+MI[2][2]*Z].map(unlz)); };
const desat = (h, k) => { const [L,a,b] = toLab(h); return unLab([L, a*k, b*k]); };
const dE = (x,y) => { const A=toLab(x), B=toLab(y); return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]); };

/* ---------- 設計師給的官方色票 -----------------------------------------
 * 2026-09-07 使用者：「找出本來設計師給的標準色，套用他給的標準色看看。」
 * 出處 PALETTE.md 第一節（**不是新的取值，是原本就在的那兩份**）：
 *   `104_logo.pptx` 九顆（完整版）／`Logo顏色.pptx` 八顆。
 *
 * ⚠⚠⚠ **九顆扣掉兩顆太淺的（稻草灰 2.17、米色 1.46，過不了裝飾圖形的 3:1），
 *   正好剩七顆 —— 正好七科。** 八顆那一份扣掉灰綠也一樣是七顆。
 * ⚠⚠ 而且它本來就比站上沉：**彩度中位 31.8 → 20.3（低 36%）** ——
 *   使用者上一輪說的「吵雜熱鬧」，換這一套等於免費解掉一半。
 *
 * 配對照**色相最近**排（不是憑感覺挑）：
 *   顯微根管→磚紅 Δh 2°　牙周→深綠松 3°　矯正→藍灰 5°　口外→灰紫 8°
 *   兒牙→焦糖褐 11°　一般→苔綠 18°（而且苔綠就是 Logo 色）
 * ⚠⚠⚠ **植牙是唯一配不上的，而且成因是結構性的**：設計師的色票裡
 *   **只有一支藍**（藍灰），而站上有兩科是藍（矯正 h249、植牙 h281）。
 *   藍灰給了更近的矯正，植牙只剩 Deep Taupe（h 33，差 108°）。
 *   **這不是配錯，是那份色票沒有第二支藍** —— 要嘛接受褐色，要嘛那一科留用站上的值。
 */
const BRAND = {
  /* 104_logo.pptx（九顆的完整版） */
  b104: { general:"#5A6E4F", perio:"#0B4B46", endo:"#944449", kids:"#9E7253",
          ortho:"#315568", prosth:"#805751", surg:"#5E5A61" },
  /* ⚠⚠⚠ 2026-09-07 使用者自己挑的一組（從上面幾案裡各取幾顆）：
     一般＝設計師 104 的苔綠、顯微＝設計師 104 的磚紅、齒顎＝站上的深階，
     其餘四科＝彩度 65% 那一案。**這是他指定的值，不要拿別的案去「訂正」。**
     ⚠ 他寫的「一般 #5A6E4」只有五碼，六碼的讀法是 104 那一案的 **#5A6E4F**。 */
  mix:  { general:"#5A6E4F", perio:"#436A67", endo:"#944449", kids:"#926833",
          ortho:"#31637F", prosth:"#394666", surg:"#6F5477" },
  /* Logo顏色.pptx（八顆，站上現行色值的出處） */
  b8:   { general:"#5D6D55", perio:"#214D48", endo:"#AF4C52", kids:"#9B735E",
          ortho:"#3C596B", prosth:"#7D5A58", surg:"#5F5D66" }
};

/* 每一科畫出來的顏色：pal ＝ 用哪一套；k ＝ 彩度倍率，flat ＝ 一般牙科要不要轉中性 */
const tone = (id, k, flat, pal) => flat && id === "general" ? SOFT
  : pal ? BRAND[pal][id] : desat(DEEP[id], k);

/* ---------- 對比度：字是要讀的 ---------- */
const lin = c => { c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); };
const lum = h => { const n = parseInt(h.slice(1),16);
  return .2126*lin(n>>16&255) + .7152*lin(n>>8&255) + .0722*lin(n&255); };
const ratio = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const contrast = [["墨對底", ratio(INK, CARD)], ["柔墨對底", ratio(SOFT, CARD)],
  ...D.specs.map(s => [`${s.name} 深階對底`, ratio(DEEP[s.id], CARD)])];
const bad = contrast.filter(([, r]) => r < 4.5);
if (bad.length) throw new Error("過不了 AA：" + bad.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("、"));
/* ⚠⚠⚠ 圖案用**深階**不是套色，那是量出來的：**兒童牙科的套色 #c28229 對卡色
   只有 2.93**，過不了裝飾性圖形的 3:1（同 iPad 那顆「往下滑」指標的門檻）。
   而深階七科全部 ≥4.51。
   ⚠ 這**不牴觸** PALETTE 那條「深階給白底上的字、套色給填實的塊」——
   那條講的是**首頁 chip 那種一整塊的填色**（面積大）。這裡是 30px 的小圖形
   站在淺底上，處境和白底上的字一樣，需要的是同一階。
   ⚠ 使用者說的「圖案要套色」是口語的「上那一科的顏色」，不是 PALETTE 的專有名詞。 */
const icon = D.specs.map(s2 => [`${s2.name} 深階對底`, ratio(DEEP[s2.id], CARD)]);
for (const [pal, tbl] of Object.entries(BRAND))
  for (const [id, c] of Object.entries(tbl))
    icon.push([`${pal}／${D.specs.find(s2 => s2.id === id).name}`, ratio(c, CARD)]);
const iconBad = icon.filter(([, r]) => r < 3);
/* ⚠⚠⚠ 浮水印壓在表的後面，所以那一塊的底色不是卡色，是「卡色疊上 ${WMA} 的墨」。
   落在浮水印上的字與圖案要用**那個底**重算一次：字仍然要 4.5、圖案仍然要 3。
   ⚠ 圖案會從 4.50 掉到 4 出頭 —— 那是**裝飾性圖形的門檻 3:1**，不是 AA 文字門檻
   （同 iPad 那顆「往下滑」指標）。要它們維持 4.5 就得把浮水印調到幾乎看不見。 */
const WMBG = rgb2hex(hex2rgb(CARD).map((v, i) => v * (1 - WMA) + hex2rgb(INK)[i] * WMA));
const wmText = [["墨", ratio(INK, WMBG)], ["柔墨", ratio(SOFT, WMBG)]];
const wmIcon = D.specs.map(s2 => [disp(s2.name), ratio(DEEP[s2.id], WMBG)]);
const wmBad = [...wmText.filter(([, r]) => r < 4.5), ...wmIcon.filter(([, r]) => r < 3)];
if (wmBad.length) throw new Error("壓在浮水印上過不了："
  + wmBad.map(([n, r]) => `${n} ${r.toFixed(2)}`).join("、"));
if (iconBad.length) throw new Error("圖案對底不到 3:1："
  + iconBad.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("、"));

/* ---------- 出圖 ---------- */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;      /* ⚠ 一律 headless_shell（第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith(".png"))) fs.rmSync(path.join(OUT, f));

const made = [];
/* ⚠⚠⚠ 直排撞到一面硬牆，而且是量出來的：
 *   「晚」那一節有四科，直排就是四倍高。從 30px 一路試下來 ——
 *   30→663　26→623　22→588　20→572　18→556　16→540（安全帶只有 537）。
 *   要收得進去圖案得縮到 **13px**，而 22px 已經是「形狀分不出來」的門檻
 *   （九顆兩兩最不像的一對只差 20.9%）—— 13px 等於只剩顏色在作用，形狀白給。
 * ⚠⚠ 所以直排真正的取捨不是「圖案多大」，是
 *   **「直排」與「主頁大格看得到品牌與電話」二選一**。
 *   這一版讓直排維持 26px（讀得清楚），代價由下面那張主頁模擬呈現。
 */
/* ⚠⚠ 墨面積現量、不寫死：把每一顆畫進 canvas 數暗像素（4 倍取樣再除回去）。
   同浮水印那一輪 22-13 —— 長寬比不同的形狀同寬就不同重。 */
INK9 = await page.evaluate(async (list) => {
  const out = {}, S = 120;
  for (const [id, svg, ar] of list) {
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      svg.replace(/<svg/, `<svg width="${200}" height="${200 / ar}"`));
    await img.decode();
    const cv = document.createElement("canvas"); cv.width = cv.height = S;
    const cx = cv.getContext("2d");
    cx.fillStyle = "#fff"; cx.fillRect(0, 0, S, S);
    const w = ar >= 1 ? S : S * ar, h = ar >= 1 ? S / ar : S;
    cx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
    const d = cx.getImageData(0, 0, S, S).data;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4) ink += (255 - (d[i] + d[i+1] + d[i+2]) / 3) / 255;
    out[id] = ink / (S / 30) ** 2;
  }
  return out;
}, ALLSH.map(sh => [sh,
  /* ⚠ MK 那條 /g 的正規式只吃掉了 width（第一次比對就把 <svg 用掉了），
     height 還留著 —— 注進 width/height 會變成重複屬性、整個 SVG 解不開
     （症狀是 canvas 丟 EncodingError）。這裡再剝一次。 */
  MK[sh].replace(/\s(width|height)="[\d.]+"/g, ""), AR[sh]]));
if (Object.values(INK9).some(v => !(v > 50)))
  throw new Error("墨面積量出來不對：" + JSON.stringify(INK9));
console.log("\n── 每一顆在 30px 方框裡的墨面積（等重要放多大）──");
for (const id of Object.keys(SHAPE).sort((a, b) => INKA[b] - INKA[a]))
  console.log(`  ${SHAPE[id]}  ${disp(D.specs.find(s2 => s2.id === id).name).padEnd(6, "　")}`
    + `${INKA[id].toFixed(0).padStart(4)} px　${(INKA[id] / INKA.general * 100).toFixed(0).padStart(3)}%`
    + `　等重要 ${(30 * wScale(id, "even")).toFixed(0)}px（半 ${(30 * wScale(id, "half")).toFixed(0)}px）`);

/* ⚠⚠⚠ 頁尾兩塊字的「字面中線」現量一次（第九節第 9 條）。
 *   ・號碼往下推多少 ＝ 號碼的字面中線離基線多高 − 那句話的
 *   ・話筒往下推多少 ＝ 它自己的盒心（inline-block 的下緣坐在基線上 → 盒心在基線上方
 *     ICOPX/2）− 號碼的字面中線
 * ⚠ 要在 400px 上量再等比例縮 —— Blink 回來的 actualBoundingBox 以 1/64 em 為階，
 *   直接在 23／31px 上量會被進位吃掉（同 spec-tag-fit 那一輪）。 */
const telAlign = await page.evaluate(({ font, phone, ico, fsTel }) => {
  const cx = document.createElement("canvas").getContext("2d");
  const S = 400;
  const mid = (txt) => { cx.font = `${S}px ${font}`; const m = cx.measureText(txt);
    return (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 / S; };
  const p = mid(phone) * fsTel;
  return { telMid: p, icoDy: ico / 2 - p };
}, { font: '"Noto Sans TC","WenQuanYi Zen Hei",sans-serif',
     phone: PHONE, ico: ICOPX, fsTel: 23 });
ICODY = telAlign.icoDy;
console.log(`\n── 頁尾：話筒對號碼的字面中線 ──`);
console.log(`  號碼 23px 的字面中線離基線 ${telAlign.telMid.toFixed(2)}px`
  + `　話筒盒心 ${(ICOPX / 2).toFixed(2)}px　→ 話筒往下 ${ICODY.toFixed(2)}px`);

const measure = async (mode, px) => {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css()}</style>${grid(mode, px)}`);
  const b = await page.locator(".band").boundingBox();
  return { px, h: b.height, over: Math.max(0, Math.round(b.height - BAND)) };
};
const COL = 26, W2 = 30;
/* 圖案之間要多鬆（橫向 / 行距）。第一格 ＝ 2026-09-07 之前的值 */
/* 三格間距 ＋ 要不要等寬格。第一格 ＝ 2026-09-07 之前的值（不等寬、11px） */
const ALTP = [["alt-r2c1", "r2c1"], ["alt-r1c3", "r1c3"]];
/* 整體放大：Ⓢ1 ＝ 現況（收得進安全帶），其餘三格用掉上下的空白 */
/* ⚠⚠⚠ 這把尺有一個算得出來的天花板，而且不是垂直方向 ——
   整張圖固定 1080 寬，一格最多要放兩顆等寬格（2×42.5 ＋ 間距 11 ＝ 96），
   加上時段那一欄 158，總共 638；版心可用寬 ＝ (1080 − 2×44) / S ＝ 992 / S。
   所以 **S ≤ 992 / (158 + 5×104) ≈ 1.42**（每格留 8 的餘裕）——
   再大就會撞到格子的牆，不是撞到安全帶。 */
/* ⚠⚠⚠ 放大不是隨便挑一個倍率 —— 主頁大格看得到的是**正中央那 537 列**，
   上下切掉的量一樣多，所以「切得乾不乾淨」是算得出來的：
   ・讓**中間那一塊**（日子的表頭 ＋ 表 ＋ 圖例）正好等於 537 列
     → S ＝ 537 ÷ 中間那一塊在 1× 時的高度。
   ・再讓**上面那一塊（標題）和下面那一塊（頁尾）一樣高**（標題底下多墊 EX ＝ 頁尾高 − 標題高），
     兩邊的切口就會**正好落在那兩條分隔線上** —— 大格看到的是完整的表，
     沒有半截的字。
   ⚠ 天花板不是安全帶，是**格子的牆**：一格最多放兩顆等寬格，
     S ≤ (1080 − 2×44) ÷ (158 + 5×(2×42.5 + 11 + 8))。算出來超過就夾住。 */
let SCALES = [];
const GAPS = [["mix-half", 11, 9, false], ["mix-half-a11", 11, 9, true],
              ["mix-half-a16", 16, 12, true], ["mix-half-a22", 22, 15, true]];
/* ---------- 放大倍率：量一次 1× 的三塊高度，再解出來 ---------- */
{
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css()}</style>${
    grid("i2x2", W2, 1, false, "mix", "half", [11, 9], true)}`);
  const m = await page.evaluate(() => {
    const q = (s2) => document.querySelector(s2).getBoundingClientRect().height;
    return { all: q(".band"), top: q(".id"), bot: q(".tel") };
  });
  const mid = m.all - m.top - m.bot;
  const want = BAND / mid;
  const smax = (W - 2 * PAD) / (LAB + 5 * (2 * slotOf(30, "half") + 11 + 8));
  const fit = Math.min(want, smax);
  SCALES = [["fit", +fit.toFixed(3), +(m.bot - m.top).toFixed(2)]];
  console.log(`\n── 放大倍率（算出來的，不是挑的）──`);
  console.log(`  1× 的三塊：標題 ${m.top.toFixed(1)}　中間 ${mid.toFixed(1)}　頁尾 ${m.bot.toFixed(1)}`);
  console.log(`  中間那塊要填滿安全帶 ${BAND} → S ${want.toFixed(3)}`
    + `　格子的牆 → S ≤ ${smax.toFixed(3)}　→ 取 ${fit.toFixed(3)}`);
  console.log(`  標題底下多墊 ${(m.bot - m.top).toFixed(1)}（＝頁尾高 − 標題高），`
    + `兩邊的切口才會落在分隔線上`);
}
const mCol = await measure("icol", COL), mW2 = await measure("i2x2", W2);
console.log(`\n── 三種排法（安全帶 ${BAND} 列）──`);
console.log(`  橫排一列 30px　高 ${(await measure("icon", 30)).h.toFixed(0)}　收得進`);
console.log(`  一行兩個 ${W2}px　高 ${mW2.h.toFixed(0)}　${mW2.over ? "超出 " + mW2.over : "收得進"}`);
console.log(`  直排 ${COL}px　　高 ${mCol.h.toFixed(0)}　${mCol.over ? "⚠ 超出 " + mCol.over
  + "（主頁大格會切掉品牌與電話）" : "收得進"}`);
if (mW2.over) throw new Error(`一行兩個 ${W2}px 收不進安全帶，超出 ${mW2.over}`);

/* 排法一律用建議的「一行兩個」，這一輪只比顏色 */
for (const [tag, html, sc, ex] of [["icol", grid("icol", COL)], ["i2x2", grid("i2x2", W2)],
                           ["c65",  grid("i2x2", W2, .65)],
                           ["cflat", grid("i2x2", W2, 1, true)],
                           ["cboth", grid("i2x2", W2, .65, true)],
                           ["b104",  grid("i2x2", W2, 1, false, "b104")],
                           ["b8",    grid("i2x2", W2, 1, false, "b8")],
                           /* 使用者挑的混合色 ＋ 圖案份量三格（現況／半／等重） */
                           ["mix",      grid("i2x2", W2, 1, false, "mix")],
                           ["mix-even", grid("i2x2", W2, 1, false, "mix", "even")],
                           /* ⚠⚠ 2026-09-07 使用者選了「半」，並說「間距要拉開一點，
                              因為有矯正的診，logo 看起來和其他沒有矯正的時段沒對齊」。
                              等重之後每一顆的寬度不一樣（矯正 42、牙周 36、其餘 30），
                              一列置中之後**同一欄不同列的圖案就落在不同的 x 上** ——
                              間距拉開治的是「讀不讀得出是幾顆」，對齊要另外處理（見下面 GAPS）。 */
                           ...GAPS.map(([tag, gx, gy, slot]) =>
                             [tag, grid("i2x2", W2, 1, false, "mix", "half", [gx, gy], slot)]),
                           /* ⚠⚠⚠ 2026-09-07 第二輪使用者：「午診的假牙 logo 底部被切到了。」
                              量過**沒有被裁**（見下面那道守門與規格頁上的數字）——
                              r2c2 的下緣本來就是往上凹的，而它是七顆裡最矮的一顆
                              （墨 31×23，別人 30×30），所以讀起來像被切掉。
                              真的要治只能換形狀，而九顆裡沒用到的只剩兩顆，兩顆各有前科：
                              r2c1 ＝ 上一輪被退回的那顆「哭哭」、r1c3 ＝ 和口外只差 5.6%。
                              兩張都出出來讓他自己看。 */
                           /* ⚠⚠⚠ 2026-09-07 第五輪：整體放大那把尺。
                              同一份版面、同一組參數，只有 zoom 不一樣 —— 每一格
                              的代價（主頁大格會從上下切掉多少）印在下面的表裡。 */
                           ...SCALES.map(([tag, sc, ex]) =>
                             [tag, grid("i2x2", W2, 1, false, "mix", "half", [11, 9], true), sc, ex]),
                           ...ALTP.map(([tag, sh]) => {
                             const old = SHAPE.prosth; SHAPE.prosth = sh;
                             const html = grid("i2x2", W2, 1, false, "mix", "half", [11, 9], true);
                             SHAPE.prosth = old; return [tag, html];
                           }),
                          ]) {
  S = sc || 1; EX = ex || 0;
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css()}</style>${html}`);
  /* ⚠⚠ 這一版存在的理由就是「乾淨 ＋ 大格看得到全部」，所以那件事要用量的。
     整塊內容一定要落在安全帶裡（大格只看得到 y ${TOP}~${BOT}）。 */
  const b = await page.locator(".band").boundingBox();
  if (b.y < TOP - .5 || b.y + b.height > BOT + .5) {
    /* ⚠ icol 是刻意超出的那一案（它存在的意義就是讓人看見這個代價），其餘一律擋下來 */
    if (tag !== "icol" && !(sc > 1))
      throw new Error(`${tag} 的內容是 ${b.y.toFixed(1)}~${(b.y + b.height).toFixed(1)}，`
        + `超出大格看得到的 ${TOP}~${BOT}`);
  }
  /* ⚠ 等重那兩案會把細長的那幾顆放大，一列的總寬不可以超過格子 */
  const wide = await page.evaluate(() => [...document.querySelectorAll(".ic-line")]
    .filter(el => el.getBoundingClientRect().width
      > el.closest("td").getBoundingClientRect().width - 8).length);
  if (wide) throw new Error(`${tag} 有 ${wide} 列圖案撐破格子`);
  /* ⚠ 早午晚與時間收成一行之後，那一欄不可以被折 —— 折了不報錯，只是靜靜地變兩行
     （而「空間夠不夠」正是使用者這一項的前提）。兩件一起驗：沒有橫向溢位，
     而且 <b> 與 <i> 落在同一條線上。 */
  const lab = await page.evaluate(() => {
    const ths = [...document.querySelectorAll("tbody th")];
    const bad = ths.filter(th => th.scrollWidth > th.clientWidth + .5
      /* ⚠ 不可以比 top —— 26px 與 19px 兩個行內盒同一條基線、top 本來就不一樣。
         同一行的判準是「時間在早午晚的右邊」，折行的話它會掉到下一行的行首。 */
      || th.querySelector("i").getBoundingClientRect().left
         < th.querySelector("b").getBoundingClientRect().right - .5).length;
    const w = Math.max(...ths.map(th => {
      const b = th.querySelector("b").getBoundingClientRect();
      const i = th.querySelector("i").getBoundingClientRect();
      return i.right - b.left;
    }));
    return { bad, w };
  });
  if (lab.bad) throw new Error(`${tag} 有 ${lab.bad} 個時段標籤被折行`);
  /* ⚠ 「圖案被切到」這件事要量：每一顆畫出來的盒都要塞得進它自己的格子。
     （`.ic` 沒有 overflow:hidden，所以就算超出也不會真的被裁 —— 這道守門是
      為了把「看起來像被切」和「真的被切」分開，下次再有人回報就有數字可以答。） */
  const clip = await page.evaluate(() => [...document.querySelectorAll(".ic")].map(el => {
    const g = el.querySelector("svg").getBoundingClientRect(), b = el.getBoundingClientRect();
    return g.width > b.width + .5 || g.height > b.height + .5;
  }).filter(Boolean).length);
  if (clip) throw new Error(`${tag} 有 ${clip} 顆圖案比它自己的格子大`);
  /* ⚠ 浮水印是**刻意**切出去的（`.sheet` 有 overflow:hidden，切掉的部分不會真的畫出來），
     所以它與它的路徑要從這道溢出檢查裡排除，不然每一張都會被擋下來。 */
  const over = await page.evaluate(() => [...document.querySelectorAll(".sheet *")]
    .filter(el => !el.closest("svg.wm"))
    .filter(el => { const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5); }).length);
  if (over) throw new Error(`${tag} 有 ${over} 個元素溢出`);
  /* 頁尾對齊驗收：兩塊字的**字面中線**要落在同一條線上（用 Range 量墨，不量盒） */
  const tel = await page.evaluate(() => {
    const el = document.querySelector(".tel");
    const rng = document.createRange();
    rng.selectNodeContents(el.firstElementChild);
    const a = rng.getBoundingClientRect();
    const no = el.querySelector(".no");
    rng.selectNodeContents(no.lastChild);          /* 只選號碼那段文字 */
    const b2 = rng.getBoundingClientRect();
    const ic = no.querySelector("svg").getBoundingClientRect();
    /* 兩行要靠同一條左緣（＝「移到下一行」之後的對齊） */
    return { note: a.left, num: b2.top + b2.height / 2,
             ico: ic.top + ic.height / 2, left: no.getBoundingClientRect().left };
  });
  /* 對不齊就不要出圖（--tel-dy 是算出來的，字型或字級一改它要自己跟上） */
  if (Math.abs(tel.note - tel.left) > .5 || Math.abs(tel.num - tel.ico) > 1)
    throw new Error(`${tag} 的頁尾沒對齊：兩行左緣 ${tel.note.toFixed(1)} / ${tel.left.toFixed(1)}`
      + `　號碼中線 ${tel.num.toFixed(1)}　話筒中線 ${tel.ico.toFixed(1)}`);
  await page.screenshot({ path: path.join(OUT, `post-hours-${tag}.png`) });
  made.push([tag, b, lab.w, tel]);
}

S = 1; EX = 0;

/* ---------- 主頁那三格（裁切模擬） ---------- */
const PW = 823;
const cell = (f, w, h) =>
  `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">
     <img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}"
          style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
const page2 = await browser.newPage({ viewport: { width: PW, height: 409 + 4 + 410 } });
/* ⚠ 大格與兩個小格一律放**定案那一張**（a11）——這一格是「主頁看起來長怎樣」，
   不是版本比較；col 那一版留著只是為了讓人看見直排的代價。 */
for (const [tag, big] of [["w2", "post-hours-fit.png"], ["col", "post-hours-icol.png"]]) {
  await page2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
    <div style="width:${PW}px;background:#fff;display:flex;flex-direction:column;gap:4px">
      ${cell(big, PW, 409)}
      <div style="display:flex;gap:3px">${cell("post-hours-fit.png", 410, 410)}${cell("post-hours-fit.png", 410, 410)}</div>
    </div>`);
  await page2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await page2.screenshot({ path: path.join(OUT, `profile-3up-${tag}.png`) });
}
/* ⚠⚠⚠ 放大那把尺的**代價**要看得見：同一個大格（823×409）在四種倍率下
   分別看得到什麼。⚠ 這裡擺的是**真的產出檔裁出來的**，不是用 CSS 再畫一次。 */
/* ⚠ 高度要跟著格數算，不要寫死 —— 尺從四格收成兩格之後，寫死的高度會留下
   一大塊空白（而且長寬比對得上實檔，守門抓不到，只有把圖打開看才看得出來）。 */
const NCUT = 1 + SCALES.length;
const page3 = await browser.newPage({ viewport: { width: PW, height: 409 * NCUT + 6 * (NCUT - 1) } });
await page3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;flex-direction:column;gap:6px}</style>`
  + ["post-hours-mix-half-a11.png", ...SCALES.map(([t]) => `post-hours-${t}.png`)]
    .map(f => cell(f, PW, 409)).join(""));
await page3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await page3.screenshot({ path: path.join(OUT, "bigslot-scales.png") });

await browser.close();

fs.writeFileSync(path.join(OUT, "detail.txt"), detail + "\n");

/* ⚠⚠ 六案 × 七科的色碼寫成檔案，**規格頁那張表讀它、不手抄** ——
   手抄一份就是第二個真相，而顏色改一次它就開始說謊（守門會逐格比對）。 */
const CASES = [["O", "現況（站上深階）", 1, false, null], ["C", "全部彩度 65%", .65, false, null],
  ["N", "一般牙科轉中性", 1, true, null], ["B", "轉中性 ＋ 65%", .65, true, null],
  ["P", "設計師九顆 104_logo", 1, false, "b104"], ["Q", "設計師八顆 Logo顏色", 1, false, "b8"],
  ["U", "使用者挑的混合", 1, false, "mix"]];
fs.writeFileSync(path.join(OUT, "colors.json"), JSON.stringify({
  specs: D.specs.map(s2 => disp(s2.name)),
  short: D.specs.map(s2 => two(s2.name)),
  cases: CASES.map(([tag, nm, k, flat, pal]) => ({ tag, name: nm,
    colors: D.specs.map(s2 => tone(s2.id, k, flat, pal).toUpperCase()) }))
}, null, 2) + "\n");
console.log("\n── 六案的色碼（preview/line-post-hours/colors.json）──");
console.log("      " + D.specs.map(s2 => two(s2.name)).join("　　"));
for (const [tag, nm, k, flat, pal] of CASES)
  console.log(`  ${tag}　` + D.specs.map(s2 => tone(s2.id, k, flat, pal).toUpperCase()).join(" ")
    + `　${nm}`);
console.log("\n── 出圖 ──");
for (const [t, b] of made)
  console.log(`  post-hours-${t}.png　內容 ${b.y.toFixed(0)}~${(b.y + b.height).toFixed(0)}`
    + `（安全帶 ${TOP}~${BOT}，餘 ${(b.y - TOP).toFixed(0)}）`);
console.log(`\n── 放大那把尺（整張圖固定 1080 見方，所以放大的代價在「主頁大格切掉什麼」）──`);
for (const [t, sc] of [["mix-half-a11", 1], ...SCALES.map(([a, b2]) => [a, b2])]) {
  const b = made.find(m => m[0] === t)[1];
  const cut = Math.max(0, (b.height - BAND) / 2);
  console.log(`  ${(sc).toFixed(2)}×　內容高 ${b.height.toFixed(0)}　`
    + (cut ? `大格上下各切掉 ${cut.toFixed(0)}px` : "大格看得到全部"));
}
const m0 = made.find(m => m[0] === "mix-half-a11");
console.log(`\n── 定案那張的兩件版面 ──`);
console.log(`  時段標籤一行寬 ${m0[2].toFixed(1)}px（欄寬 176，沒有折行）`);
{ /* 假牙重建那一顆到底有沒有被切：畫出來多大 vs 形狀本身的長寬比 */
  const w = 30 * wScale("prosth", "half");
  console.log(`  假牙重建 r2c2：畫出來 ${w.toFixed(1)}×${(w / AR.r2c2).toFixed(1)}px`
    + `（格子 ${slotOf(30, "half").toFixed(1)}×30，塞得進去）`
    + `　長寬比 ${AR.r2c2.toFixed(3)} 是形狀本身的`);
}
console.log(`  浮水印 ${WMW}px・墨 ${(WMA * 100).toFixed(1)}%　底色 ${CARD} → ${WMBG}`
  + `　壓在上面的字 ${Math.min(...wmText.map(c => c[1])).toFixed(2)}`
  + `　圖案 ${Math.min(...wmIcon.map(c => c[1])).toFixed(2)}（門檻 4.5 / 3）`);
console.log(`  頁尾兩行左緣 ${m0[3].note.toFixed(1)} / ${m0[3].left.toFixed(1)}`
  + `　話筒對號碼的字面中線差 ${Math.abs(m0[3].num - m0[3].ico).toFixed(2)}px`);
console.log(`  profile-3up.png`);
console.log(`\n文字 ${contrast.length} 項全部過 AA（最低 ${
  Math.min(...contrast.map(c => c[1])).toFixed(2)}）`);
console.log(`圖案 ${icon.length} 項全部過 3:1（最低 ${
  Math.min(...icon.map(c => c[1])).toFixed(2)}　${
  icon.reduce((a,b)=>a[1]<b[1]?a:b)[0]}）`);
console.log("\n── 顏色三案：七顆圖案兩兩最近的一對 ──");
for (const [nm, k, flat, pal] of [["現況（100%）", 1, false], ["彩度 65%", .65, false],
                             ["一般牙科轉中性", 1, true], ["兩個都做", .65, true],
                             ["設計師 104（九顆）", 1, false, "b104"],
                             ["設計師 八顆", 1, false, "b8"],
                             ["使用者挑的混合", 1, false, "mix"]]) {
  const cs = D.specs.map(s2 => tone(s2.id, k, flat, pal));
  let mn = 1e9, pr = "";
  for (let i=0;i<cs.length;i++) for (let j=i+1;j<cs.length;j++) {
    const d = dE(cs[i], cs[j]);
    if (d < mn) { mn = d; pr = `${disp(D.specs[i].name)}×${disp(D.specs[j].name)}`; }
  }
  const lo = Math.min(...cs.map(c2 => ratio(c2, CARD)));
  console.log(`  ${nm.padEnd(16,"　")}ΔE ${mn.toFixed(1).padStart(5)}　${pr.padEnd(18,"　")}`
    + `對底最低 ${lo.toFixed(2)}　彩度中位 ${
      cs.map(c2 => { const [,a,b] = toLab(c2); return Math.hypot(a,b); })
        .sort((x,y)=>x-y)[3].toFixed(1)}`);
}
console.log("\n── 「詳情」欄要貼的字 ──\n" + detail.split("\n").map(l => "  " + l).join("\n"));
