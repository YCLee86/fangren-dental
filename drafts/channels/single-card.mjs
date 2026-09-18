#!/usr/bin/env node
/* 約診卡・單一版型（帶子壓在下緣）→ preview/line-single-card/
 *
 *   node drafts/channels/single-card.mjs            產生那一頁與帶子的 PNG
 *   node drafts/channels/single-card.mjs --check     只比對，不寫檔
 *
 * 2026-09-18 使用者：「我們之前和廠商提需求的約診完成通知與約診查詢頁面的版型，
 *   我想另外做一個單一版型。不要之前用的 logo 浮水印效果，改用 line 立牌上的
 *   帶子 logo，壓在頁面的下緣。」
 *
 * 2026-09-18 稍晚他改了位置與顆數：「把帶子移到約診時間下方　和異動請在2天前這段區隔／
 *   輪播那張和約診狀態區隔／約診成功通知　保留18顆和27顆　另外作一版22顆／
 *   輪播那張18顆　另外做一版　9顆　13顆」。
 * ⚠⚠⚠ 位置換了，卡片的**結構**就跟著換：帶子不再是「排在文字那一塊後面」，
 *   而是把內容拆成**兩塊 box**（上：姓名＋日期／下：那兩行小字或約診狀態），夾在中間。
 *   Flex 那一側也是這樣寫 —— body `paddingAll: 0` → box A（`paddingAll: 14`）→
 *   帶子 `image`／`size: full` → box B（`paddingAll: 14`）。**帶子仍然不必疊**。
 * ⚠⚠ 切在哪裡不是挑的：**切在日期那一行後面**（兩則都是第 2 行），底下在驗那一行
 *   真的是日期 —— 那幾行是從 booked-card.json 讀回來的，順序哪天換了要當場停下來。
 *
 * ⚠⚠⚠ 這一頁不新寫任何東西：
 *   ・卡上那幾行、字級、內距、兩則的卡片寬、現況那顆浮水印 —— 全部 import
 *     build-vendor.mjs（它的出處又是 booked-card.json ＋ wm-sizes.json ＋ vendor-log.json）。
 *   ・帶子的幾何 —— import stand-card.mjs 的 帶()／bandSvg()（形狀讀 brand/shapes/、
 *     寬度讀 wm-sizes.json、順序與套色位置讀 stand-card.json）。
 *   兩邊都不抄第二份：抄了就是兩個真相，而且兩邊各自都很正常。
 *
 * ⚠⚠ 帶子在頁面上擺的是**真的 PNG**（1024 寬，＝上線要交出去的那一張），不是 inline SVG：
 *   要判斷的正是「縮到 10 px 高之後還讀不讀得出是標誌」，而向量在螢幕上會比實際清楚
 *   （同 og-topic-card 那一輪：提案頁要擺真的產出檔）。
 * ⚠ Flex 的 image 不吃 SVG，所以上線本來就要 PNG —— 這幾張就是那幾張。
 *
 * 2026-09-18 再一輪：「兩則同一個殼　整段拿掉／約診成功那張　保留 18/22/27顆　並挑選
 *   7顆做主題套色／約診查詢保留 13/18顆　再做一版16顆　並挑選7顆做主題套色」。
 * 2026-09-18 定案：「預約成功　18顆　預約成功不要顯示約診狀態／約診記錄查詢　13顆」——
 *   兩把顆數的尺收掉（落選那幾格的數字留在面板上），單張那一則拿掉約診狀態那一列。
 * ⚠⚠ 顆數兩則不一樣，所以**帶子是兩張圖不是一張**（上線要 18 顆與 13 顆各一張）。
 * ⚠⚠ 顆數要嘛是某一份順序的整數倍、要嘛自己有一份順序：那三條相鄰的限制
 *   （同形狀不相鄰、三顆最長的不相鄰、同色不相鄰）**在接縫上也要成立**，
 *   整數倍等於把同一段接回它自己（band/README.md）。所以這一頁每一格都寫著它的基數：
 *   **18／27 ＝ 基 9、22 ＝ 基 11（立牌那一份 × 2）、13 與 16 ＝ 自己一份**
 *   （stand-card.json 的 Ⓚ4／Ⓚ5，**不可以就地截一段**）。
 * ⚠⚠⚠ 13 與 16 的「重複」和立牌那條不一樣，那不是漏改：立牌是分隔線、只多放一兩顆，
 *   所以重複哪兩顆是設計項（白名單）；這兩條是「九顆一循環接不完的長度」，硬守白名單
 *   會讓那兩顆各出現三到四次（16 顆裡一半是同兩顆）＝ 一個花紋。改成
 *   **九顆各一次 ＋ 最窄的那幾顆各多一次**（寬度出處 wm-sizes.json）。
 * ⚠⚠⚠ 套色那七顆（七科各一顆）**每一格一組位置**，在 stand-card.json 的 著色.位置案：
 *   27 顆那一組是立牌 2026-09-17 定案的（他挑的、逐位元組比對）；其餘四格是**算出來的**，
 *   產生器因此驗它真的是那一格**做得到的最好**（先散得開、再不規律）。
 * ⚠⚠ 13 顆那一格是幾何做不到不是沒挑好：7 顆散進 13 格，六個間隔只能全部是 2
 *   （每隔一顆一顆）—— 要不規律就一定有兩顆挨在一起。頁面上那一句是算出來的。
 * ⚠⚠⚠ 七顆套色的位置是挑過的（間隔 ≥3 顆、相鄰間隔相同的最多一對），
 *   **只有 27 顆那一份有** —— 9 與 18 顆一律淡墨，那不是漏上色。
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import {
  CSS, esc, b, MEGA, MICRO, linesHtml, BUB, CARD, PILLVAL, WCARD,
  wmSvg, 輪, OFF, WM_A, INK, WM, DATE,
} from "./build-vendor.mjs";
import { 帶, bandSvg, 墨色, S, 套色算, 套色最佳, WM as WMS } from "./stand-card.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-single-card");
const CHECK = process.argv.includes("--check");
const 基 = S.帶子.顆數;                 /* 9 —— 顆數只給它的整數倍 */
const 定 = S.帶子.顆數 * S.帶子.倍;     /* 27 —— 立牌上定案那一條，也是唯一有套色的那一份 */

/* ── 帶子：三種上色，同一份幾何 ──────────────────────────────── */
/* 那一格套色的七顆在哪裡：27 顆 ＝ 立牌定案那一組（他挑的），其餘四格在 著色.位置案。 */
const 位置of = (n) => (n === 定
  ? S.帶子.著色.位置
  : (S.帶子.著色.位置案.find((x) => x.顆 === n) || {}).位置);
const 條 = (n, 模, 底 = 基) => {
  const B = 帶(n, S.帶子.間距, 底);
  const 序 = B.it.map((l) => l.k);
  if (模 === "ink") B.it.forEach((l) => { l.套色 = false; });
  else if (模 === "spec") B.it.forEach((l) => { l.套色 = true; });
  else if (模 === "set") {
    const p = 位置of(n);
    if (!p) throw new Error(`著色.位置案 裡沒有 ${n} 顆那一格 —— 套色的位置要有人決定過`);
    const q = 套色算(序, p);
    /* ⚠⚠⚠ 27 顆那一組不驗「最好」：它是立牌 2026-09-17 定案的那一組，**他挑的**，
       而且那一條每次跑都拿 band/fangren-band-27.svg 逐位元組比對。
       其餘四格是算出來的，所以要驗它真的是那一格**做得到的最好**（先散得開、再不規律）。 */
    if (n !== 定) {
      const b = 套色最佳(序);
      const 分 = (x) => x.相鄰相同 + x.隔一相同;
      if (q.最小 !== b.最小 || 分(q) !== 分(b))
        throw new Error(`${n} 顆那一組套色位置不是做得到的最好`
          + `（現在 最小間隔 ${q.最小}／規律 ${分(q)}，做得到 ${b.最小}／${分(b)}：${b.位.join("、")}）`);
    }
    const 套 = new Set(p);
    B.it.forEach((l, i) => { l.套色 = 套.has(i); });
    B.套 = q;
  } else throw new Error("不認得的上色方式：" + 模);
  return B;
};
/* ⚠⚠ 27 顆那一條要和 drafts/channels/band/fangren-band-27.svg **逐位元組相同** ——
   那一份是立牌那一輪存下來的定案檔（band-logo.mjs 產的，只是把 class 拔掉）。
   這一頁是「拿它來用」不是「再畫一條」：對不上就表示其中一邊漂掉了。 */
const 對定案 = (svg) => {
  const f = readFileSync(join(HERE, "band", "fangren-band-27.svg"), "utf8");
  const 存 = f.slice(f.indexOf("<svg")).trim();
  const 我 = svg.replace(/^<svg class="[^"]*"/, "<svg");
  if (存 !== 我) throw new Error("27 顆那一條和 band/fangren-band-27.svg 對不上");
};

/* ── PNG：1024 寬（Flex 的 image 上限），透明底 ──────────────── */
const PW = 1024;
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of readdirSync(base)) {
    const p = join(base, d, "chrome-linux", "headless_shell");
    if (existsSync(p)) return p;   /* 一律 headless_shell（CLAUDE.md 第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();

/* 自己解 PNG（8 bit、非交錯 —— Chromium 的擷圖就是這一種）。
   守門要看的是「真的畫出東西了沒」與「有幾種顏色」：一張全透明的帶子在頁面上
   就是一條看不見的細縫，尺寸、長寬比、檔案大小每一項都會過。 */
const 解PNG = (buf) => {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const [深, 型, , , 交] = [24, 25, 26, 27, 28].map((i) => buf[i]);
  if (深 !== 8 || 交 !== 0 || (型 !== 6 && 型 !== 2)) throw new Error(`PNG 不是 8 bit 非交錯 RGB(A)：深 ${深} 型 ${型} 交 ${交}`);
  const ch = 型 === 6 ? 4 : 3;
  let z = [], i = 33;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i), tag = buf.toString("ascii", i + 4, i + 8);
    if (tag === "IDAT") z.push(buf.subarray(i + 8, i + 8 + len));
    i += len + 12;
  }
  const raw = inflateSync(Buffer.concat(z));
  const bpl = w * ch, px = Buffer.alloc(h * bpl);
  const pa = (a, b2, c) => { const p = a + b2 - c, da = Math.abs(p - a), db = Math.abs(p - b2), dc = Math.abs(p - c); return da <= db && da <= dc ? a : db <= dc ? b2 : c; };
  for (let y = 0; y < h; y++) {
    const f = raw[y * (bpl + 1)], row = raw.subarray(y * (bpl + 1) + 1, y * (bpl + 1) + 1 + bpl);
    for (let x = 0; x < bpl; x++) {
      const A = x >= ch ? px[y * bpl + x - ch] : 0, B2 = y ? px[(y - 1) * bpl + x] : 0;
      const C = x >= ch && y ? px[(y - 1) * bpl + x - ch] : 0;
      const v = row[x];
      px[y * bpl + x] = f === 0 ? v : f === 1 ? v + A : f === 2 ? v + B2
        : f === 3 ? v + ((A + B2) >> 1) : v + pa(A, B2, C);
    }
  }
  return { w, h, ch, px };
};
/* ⚠⚠ 只數「有幾種顏色」是假的守門：抗鋸齒本來就會生出幾十種。要數的是
   **那幾支色各自出現了幾個像素** —— 那才分得出某一顆有沒有真的畫上去。
   ⚠⚠⚠ 門檻要看 alpha > 8 不是 alpha > 250：PNG 存的是**非預乘**的 alpha，
     半透明的邊緣像素 RGB 仍然是原色；而縮到這個尺寸，最小的那一顆（19.8px）
     **一個實心像素都沒有**，整顆都是抗鋸齒的邊（第一版就是這樣誤報的）。 */
const 墨量 = (im) => {
  const 數 = new Map();
  let ink = 0;
  for (let i = 0; i < im.px.length; i += im.ch) {
    if ((im.ch === 4 ? im.px[i + 3] : 255) <= 8) continue;
    ink++;
    const k = `${im.px[i]},${im.px[i + 1]},${im.px[i + 2]}`;
    數.set(k, (數.get(k) || 0) + 1);
  }
  return { 佔: ink / (im.w * im.h), 數 };
};
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");

const tmp = mkdtempSync(join(tmpdir(), "band-"));
const 出圖 = (檔, B, 模) => {
  const PH = Math.round(PW * B.總高 / B.總寬);
  const pg = join(tmp, 檔.replace(/\.png$/, ".html")), png = join(tmp, 檔);
  /* ⚠⚠⚠ 選擇器一定要寫 `svg.bnd`，不可以寫 `svg` —— 那一條會連**巢狀的**那 27 個
     `<svg>` 一起吃到（Chromium 吃 SVG2 的 width/height 幾何屬性，CSS 贏過 markup），
     每一顆因此被撐成整條那麼寬、內容置中之後跑到框外，最右邊那一顆直接被裁掉不見。
     症狀：尺寸、長寬比、墨量每一項都正常，**只有那一顆的顏色一個像素都沒有**。 */
  writeFileSync(pg, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}`
    + `svg.bnd{display:block;width:${PW}px;height:${PH}px}</style>${bandSvg(B, "bnd", 墨色)}`, "utf8");
  execFileSync(chrome, ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--force-color-profile=srgb", "--default-background-color=00000000",
    `--screenshot=${png}`, `--window-size=${PW},${PH}`, "file://" + pg], { stdio: "pipe" });
  const buf = readFileSync(png);
  if (buf.readUInt32BE(16) !== PW || buf.readUInt32BE(20) !== PH)
    throw new Error(`${檔}：出圖 ${buf.readUInt32BE(16)}×${buf.readUInt32BE(20)}，該是 ${PW}×${PH}`);
  const q = 墨量(解PNG(buf));
  if (q.佔 < 0.02) throw new Error(`${檔}：墨只佔 ${(q.佔 * 100).toFixed(2)}% —— 幾乎是空的`);
  const 要 = [...new Set(B.it.map((l) => (l.套色 ? l.色 : 墨色)))];
  const 缺 = 要.filter((h) => (q.數.get(rgb(h)) || 0) < 20);
  if (缺.length) throw new Error(`${檔}：這幾支顏色一個實心像素都沒畫到 ${缺.join("、")}`);
  return { 檔, buf, w: PW, h: PH, 佔: q.佔, 色數: 要.length };
};

/* ⚠⚠⚠ 2026-09-18 定案：**預約成功 18 顆、約診紀錄查詢 13 顆**（使用者挑的），
   兩把顆數的尺因此收掉 —— **尺可以收，它量出來的數字不可以跟著消失**（同 50-22、71-13），
   所以落選那幾格（16／22／27）留在 `量案` 裡，每次跑仍然逐格印在面板上。
   ⚠ 資料那一側（順序案、著色.位置案）一格都沒有刪。 */
const 定顆 = { mega: 基 * 2, car: 13 };
const 量案 = [
  { n: 13, 底: 13 }, { n: 16, 底: 16 }, { n: 基 * 2 }, { n: 22, 底: 11 }, { n: 定 },
].map((a) => ({ ...a, B: 條(a.n, "set", a.底) }));
const 帶案 = [
  { 檔: "band-18-set.png", n: 定顆.mega, 模: "set", 標: "七顆套科別色", 註: "現在這樣 —— 七科各一顆" },
  { 檔: "band-18-ink.png", n: 定顆.mega, 模: "ink", 標: "整條淡墨", 註: `全部 ${墨色}` },
  { 檔: "band-18-spec.png", n: 定顆.mega, 模: "spec", 標: "每一顆自己的科別色", 註: "九顆一循環，同色仍然不相鄰" },
  { 檔: "band-13-set.png", n: 定顆.car, 模: "set", 底: 13 },
].map((a) => ({ ...a, B: 條(a.n, a.模, a.底), ...出圖(a.檔, 條(a.n, a.模, a.底), a.模) }));
/* ⚠ 27 顆那一條這一輪沒有人在用了，但這一道守門要留著：它證明我們的 `帶()`
   仍然畫得出立牌那一條定案（逐位元組），和頁面上擺不擺它是兩件事。 */
對定案(bandSvg(條(定, "set"), "bnd", 墨色));
const 帶by = Object.fromEntries(帶案.map((a) => [a.檔, a]));
const 帶高 = (a, w) => w * a.B.總高 / a.B.總寬;
const 顆高 = (a, w) => 帶高(a, w) * a.B.高 / a.B.總高;

/* ── 卡片 ────────────────────────────────────────────────────
   .stcard／.cb／.r／.pill 全部吃 build-vendor 那一份 CSS（同一組規則、同樣的
   字級與行距），這裡只多兩條：帶子滿版貼在下緣、外框收邊。 */
const 藥丸 = (v) => `<p class="r"><span class="lb">約診狀態</span>`
  + `<span class="pill" style="background:${v.色}">${esc(v.名)}</span></p>`;
/* ⚠⚠⚠ 輪播那張卡只有 ${BUB.car}px，日期放不下一行 —— 交給瀏覽器折，它會折在
   「星期／五」中間（實測），那正是 2026-09-13 使用者退回過的樣子。booked-card.json
   已經定案：**輪播那一格的值自己帶一個換行**，所以這一頁也照那樣畫。
   斷點不另外定一個，是從那一行日期本人切出來的，切完要接得回去（底下在驗）。 */
const 輪播行 = (() => {
  const i = DATE.例.indexOf(" 星期");
  if (i < 0 || DATE.例.indexOf(" 星期") !== DATE.例.lastIndexOf(" 星期"))
    throw new Error("日期那一行切不出「星期」前面那個空白：" + DATE.例);
  const 上 = DATE.例.slice(0, i), 下 = DATE.例.slice(i + 1);
  if (`${上} ${下}` !== DATE.例) throw new Error("切出來的兩段接不回原本那一行");
  return MICRO.map((r) => (/2026/.test(r.html) ? { ...r, html: esc(`${上}\n${下}`) } : r));
})();
/* ⚠⚠⚠ 帶子夾在**日期那一行後面** —— 兩則都切在第 2 行：
     單張　姓名／日期　│帶子│　異動請在2天前…／看診前2天…
     輪播　姓名／日期　│帶子│　約診狀態
   所以上下是兩塊各自有內距的 box，帶子滿版夾在中間（Flex 那一側也是兩塊 box）。
   ⚠ 「切在第 2 行」不是挑的：底下這一行在驗那一行真的是日期 —— 那幾行是從
     booked-card.json 讀回來的，順序哪天換了要當場停下來，不要靜靜地切在別的地方。 */
const 切 = 2;
const 驗切 = (行) => {
  if (行.length < 切 || !/2026/.test(行[切 - 1].html))
    throw new Error(`第 ${切} 行不是日期那一行（卡上讀到 ${行.length} 行）—— 帶子會夾在別的地方`);
  return 行;
};
const 卡 = (w, 行, { 帶檔, 丸, 印, 折 } = {}) => {
  const 上 = 帶檔 ? 驗切(行).slice(0, 切) : 行;
  const 下 = 帶檔 ? 行.slice(切) : [];
  const 丸h = 丸 ? "\n" + 藥丸(丸) : "";
  const 帶h = 帶檔 ? `\n<img class="bnd" src="${帶檔}" width="${帶by[帶檔].w}" height="${帶by[帶檔].h}" alt="芳仁牙醫診所的標誌排成的一條帶子">` : "";
  const 下h = 帶檔 && (下.length || 丸) ? `\n<div class="cb bot">\n${linesHtml(下)}${丸h}\n</div>` : "";
  return `<div class="stcard sgl${折 ? " car" : ""}" style="width:${w}px">
<div class="cb">
${linesHtml(上)}${帶檔 ? "" : 丸h}
</div>${帶h}${下h}${印 ? "\n" + 印 : ""}
</div>`;
};
const 格 = (卡html, 說) => `<figure class="swrap">${卡html}<figcaption>${說}</figcaption></figure>`;
const 說帶 = (檔, w) => `帶子 ${帶高(帶by[檔], w).toFixed(1)}px・最高那一顆 ${顆高(帶by[檔], w).toFixed(1)}px`;
/* 那一格是拿哪一份順序排出來的 —— **現算，不要在標籤裡寫死一個基數**：
   接得起來的顆數是「某一份順序的整數倍」或「它自己有一份」，而順序案哪天多一份、
   或某一份改了重複哪幾顆，這一行要跟著動。 */
/* 套色那七顆排成什麼樣子 —— 位置與間隔現算。
   ⚠ 「只排得出這一種」不要寫死：六個間隔全部一樣 ＝ 那一格被幾何鎖死了（13 顆就是），
     而那件事會跟著顆數變，寫死的話換一格它就開始說謊。 */
const 套註 = (B) => {
  if (!B.套) return "";
  const g = B.套.間隔;
  const 鎖 = g.every((x) => x === g[0]);
  return `套色 ${B.套.位.length} 顆・間隔 ${g.join("、")}`
    + (鎖 ? `（${B.套.位.length} 顆散進 ${B.顆數} 格只排得出這一種）` : "");
};
const 基註 = (B) => {
  const o = S.帶子.順序案.find((x) => x.顆 === B.基);
  if (!o) throw new Error(`順序案裡沒有基數 ${B.基} 那一份`);
  const 次 = new Map();
  for (const k of o.序) 次.set(k, (次.get(k) || 0) + 1);
  /* ⚠ 兩種用途的「重複」是兩回事，所以這一句也要分開寫：
     立牌那幾份是「多放挑定的那一兩顆」，約診卡那兩份是「九顆各一次再平均加幾顆」。 */
  if (o.用途 === "約診卡") {
    const 多 = [...次].filter(([, n]) => n > 1).map(([k]) => k)
      .sort((a, b) => WMS[a].w - WMS[b].w || (a < b ? -1 : 1));
    return `${B.基} 顆自己一份順序・九顆各一次 ＋ 最窄的 ${多.length} 顆各多一次（${多.join("／")}）`;
  }
  const 多 = [...次].filter(([, n]) => n > 1).map(([k, n]) => `${k} ${n} 次`);
  const 頭 = B.基 === B.顆數
    ? `${B.基} 顆自己一份順序`
    : `${B.基} 顆那一份 × ${B.顆數 / B.基}`;
  return 多.length ? `${頭}・${多.join("、")}` : 頭;
};

const 現況卡 = 卡(BUB.mega, MEGA, { 印: wmSvg(輪, OFF, false) });
const CSS2 = `
.sgrid{display:flex;flex-wrap:wrap;gap:20px 12px;margin:1em 0 0;align-items:flex-start}
.swrap{margin:0;max-width:${BUB.mega + 2}px}
.sgl{overflow:hidden;box-sizing:content-box}
.sgl.car .cb p{white-space:pre-line}
.swrap .was{color:var(--soft);font-weight:400}
.sgl .bnd{display:block;width:100%;height:auto}
/* 下面那一塊自己有內距，所以它的第一個東西不要再帶上外距 —— 那個上外距
   （小字那一行的 14px、約診狀態那一列的 ${CARD.距}px）本來是用來和上面那一段隔開的，
   而現在隔開它們的是帶子。⚠ 第二個以後的東西照舊（單張那一則底下還有一行）。 */
.sgl .cb.bot>:first-child{margin-top:0}
.swrap figcaption{font-size:.76rem;color:var(--soft);line-height:1.6;margin-top:.35em}
.swrap figcaption b{color:var(--ink)}
.h3{font-size:.98rem;margin:2em 0 .2em}
`;

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　約診卡　單一版型</title>
<style>
${CSS}${CSS2}
</style>
</head>
<body>
<div class="wrap">

<h1>約診卡　單一版型（帶子壓在下緣）</h1>
<p class="lede">芳仁牙醫診所　2026-09-18<br>
預約成功通知與約診紀錄查詢<b>共用同一張卡</b>；浮水印拿掉，改用立牌上那條標誌帶，<b>滿版夾在約診時間底下</b>
—— 單張那一則隔開底下那兩行小字，輪播那一則隔開約診狀態。<br>
現在送出去的那一版（浮水印）在另一頁：<a href="/preview/line-card-spec/">/preview/line-card-spec/</a></p>

<h2 class="h2">1　換掉浮水印<span class="t">同一張卡，其餘一個字都沒動</span></h2>
<div class="sgrid">
${格(現況卡, `<b>現在這樣</b>　浮水印疊在右下角、往外溢出 ${OFF.right}／${OFF.bottom}px`)}
${格(卡(BUB.mega, MEGA, { 帶檔: "band-18-set.png" }), `<b>這一版</b>　帶子夾在日期與那兩行小字之間・${說帶("band-18-set.png", BUB.mega)}`)}
</div>

<h2 class="h2">2　預約成功通知<span class="t">單張 <code>mega</code>・${BUB.mega}px</span></h2>
<p class="note"><b>${定顆.mega} 顆</b>，七顆套科別色（七科各一顆）。
<b>約診狀態那一列不放</b> —— 這一則是「約好了」的通知，狀態是查詢那一則在回答的事。</p>
<div class="sgrid">
${格(卡(BUB.mega, MEGA, { 帶檔: "band-18-set.png" }),
  `<b>${定顆.mega} 顆</b>　${說帶("band-18-set.png", BUB.mega)}<br>${esc(基註(帶by["band-18-set.png"].B))}<br>${esc(套註(帶by["band-18-set.png"].B))}`)}
</div>

<h2 class="h2">3　約診紀錄查詢<span class="t">輪播 <code>${BUB.階}</code>・${BUB.car}px</span></h2>
<p class="note"><b>${定顆.car} 顆</b>，同樣七顆套科別色。帶子夾在日期與約診狀態之間 ——
<b>這一則有那一列</b>（值照 <a href="/preview/line-vendor/">/preview/line-vendor/</a> 第 4 節定案的四種）。</p>
<div class="sgrid">
${格(卡(BUB.car, 輪播行, { 帶檔: "band-13-set.png", 丸: PILLVAL[1], 折: true }),
  `<b>${定顆.car} 顆</b>　${說帶("band-13-set.png", BUB.car)}<br>${esc(基註(帶by["band-13-set.png"].B))}<br>${esc(套註(帶by["band-13-set.png"].B))}`)}
</div>

<h2 class="h2">4　帶子的顏色<span class="t">顆數定了，這一節挑上色的方式</span></h2>
<p class="note">拿定案那一條（${定顆.mega} 顆）比三種上色法 —— 顆數、位置、間距一個數字都沒動，只換顏色。</p>
<div class="sgrid">
${帶案.filter((a) => a.n === 定顆.mega)
  .map((a) => 格(卡(BUB.mega, MEGA, { 帶檔: a.檔 }), `<b>${esc(a.標)}</b>　${esc(a.註)}`)).join("\n")}
</div>

<h2 class="h2">5　換掉浮水印之後</h2>
<div class="rows">
<div class="row"><p class="k">要廠商填的值</p><p class="v">九顆各一組（兩欄寬度、長寬比、網址）→ <b>一張圖、<code>size: full</code>，一個數字都不必填</b></p></div>
<div class="row"><p class="k"><code>position: absolute</code></p><p class="v">浮水印非疊不可（<b>那一項到今天還沒有實機驗過</b>）→ 內容拆成<b>兩塊 box</b>、帶子夾在中間，<b>不必疊</b></p></div>
<div class="row"><p class="k">圖檔</p><p class="v">${WM.length * 2} 張（九顆 × 兩種濃度）→ <b>2 張</b>（兩則的顆數不一樣：${定顆.mega} 顆與 ${定顆.car} 顆各一張）</p></div>
<div class="row"><p class="k">換來的</p><p class="v">顏色不再跟著那一筆約診換（浮水印是 <code>(月＋日)%9</code>）—— 帶子固定一條，兩則、每一筆都一樣</p></div>
<div class="row"><p class="k">Flex 怎麼寫</p><p class="v">body <code>paddingAll: 0</code> → box A（<code>paddingAll: ${CARD.pad}px</code>，姓名＋日期）→ <code>image</code>／<code>size: full</code> → box B（同內距，那兩行小字或約診狀態）</p></div>
<div class="row"><p class="k">顆數</p><p class="v">預約成功 <b>${定顆.mega} 顆</b>、約診紀錄查詢 <b>${定顆.car} 顆</b>（2026-09-18 定案）—— 兩則的帶子因此是<b>兩張不同的圖</b>，不是同一張</p></div>
<div class="row"><p class="k">約診狀態</p><p class="v"><b>預約成功那一則不要那一列</b>、約診紀錄查詢照舊（2026-09-18 定案）</p></div>
<div class="row"><p class="k">還沒決定</p><p class="v">帶子的上色方式（第 4 節那三種）</p></div>
</div>

<p class="foot">
這一頁是靜態的，內容有更新會直接改在同一個網址上。<br>
定案那一版的規格：<a href="/preview/line-card-spec/">/preview/line-card-spec/</a>　七則訊息：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

/* ── 寫檔／比對 ─────────────────────────────────────────────── */
const 差 = [];
const 落 = (檔, buf) => {
  const p = join(OUT, 檔);
  const 舊 = existsSync(p) ? readFileSync(p) : null;
  if (!舊 || !舊.equals(buf)) 差.push(檔);
  if (!CHECK) writeFileSync(p, buf);
};
if (!CHECK) mkdirSync(OUT, { recursive: true });
落("index.html", Buffer.from(html, "utf8"));
for (const a of 帶案) 落(a.檔, a.buf);
rmSync(tmp, { recursive: true, force: true });

if (CHECK) {
  if (差.length) { console.error("✗ 對不上：" + 差.join("、")); process.exit(1); }
  console.log("✓ preview/line-single-card/ 逐位相同（index.html ＋ " + 帶案.length + " 張帶子）");
} else {
  console.log(`✓ preview/line-single-card/index.html　${(html.length / 1024).toFixed(1)}KB`);
  for (const a of 帶案)
    console.log(`  ${a.檔}　${a.w}×${a.h}・${a.B.顆數} 顆・${a.色數} 色・墨佔 ${(a.佔 * 100).toFixed(1)}%`
      + `　→ 單張 ${帶高(a, BUB.mega).toFixed(1)}px（最高那一顆 ${顆高(a, BUB.mega).toFixed(1)}）`
      + `・輪播 ${帶高(a, BUB.car).toFixed(1)}px（最高那一顆 ${顆高(a, BUB.car).toFixed(1)}）`);
  /* ⚠⚠ 兩把顆數的尺 2026-09-18 收掉了（預約成功 18／約診紀錄查詢 13），
     **落選那幾格量出來的東西要留在這裡** —— 同 50-22、71-13：尺可以收，數字不可以跟著消失。 */
  console.log(`  顆數（尺已收，定案 單張 ${定顆.mega}／輪播 ${定顆.car}）`);
  for (const a of 量案)
    console.log(`    ${String(a.B.顆數).padStart(2)} 顆　${基註(a.B)}`
      + `　→ 單張 ${帶高(a, BUB.mega).toFixed(1)}px（最高那一顆 ${顆高(a, BUB.mega).toFixed(1)}）`
      + `・輪播 ${帶高(a, BUB.car).toFixed(1)}px（最高那一顆 ${顆高(a, BUB.car).toFixed(1)}）`
      + `　${套註(a.B)}${a.B.顆數 === 定顆.mega ? "　← 預約成功" : ""}${a.B.顆數 === 定顆.car ? "　← 約診紀錄查詢" : ""}`);
  console.log(`  卡片 單張 ${BUB.mega}px（沒有約診狀態那一列）／輪播 ${BUB.car}px（${BUB.階}，有那一列）・內距 ${CARD.pad}px・底 ${WCARD}`);
  console.log(`  現況那顆浮水印：${輪.n}・淡墨 ${INK} ${(WM_A * 100).toFixed(0)}%・溢出 ${OFF.right}／${OFF.bottom}px`);
}
