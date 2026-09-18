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
 * ⚠⚠ 顆數只給 9 的整數倍：那三條相鄰的限制（同形狀不相鄰、三顆最長的不相鄰、
 *   同色不相鄰）**在接縫上也要成立**，整數倍等於把同一段接回它自己（band/README.md）。
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
import { 帶, bandSvg, 墨色, S } from "./stand-card.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-single-card");
const CHECK = process.argv.includes("--check");
const 基 = S.帶子.顆數;                 /* 9 —— 顆數只給它的整數倍 */
const 定 = S.帶子.顆數 * S.帶子.倍;     /* 27 —— 立牌上定案那一條，也是唯一有套色的那一份 */

/* ── 帶子：三種上色，同一份幾何 ──────────────────────────────── */
const 條 = (n, 模) => {
  const B = 帶(n, S.帶子.間距, 基);
  if (模 === "set" && n !== 定) throw new Error(`套色那七顆只有 ${定} 顆那一份有（要的是 ${n} 顆）`);
  if (模 === "ink") B.it.forEach((l) => { l.套色 = false; });
  if (模 === "spec") B.it.forEach((l) => { l.套色 = true; });
  else if (模 !== "set" && 模 !== "ink") throw new Error("不認得的上色方式：" + 模);
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

const 帶案 = [
  { 檔: "band-27-set.png", n: 定, 模: "set", 標: "七顆套科別色", 註: "立牌上定案那一條，原封不動" },
  { 檔: "band-27-ink.png", n: 定, 模: "ink", 標: "整條淡墨", 註: `全部 ${墨色}` },
  { 檔: "band-27-spec.png", n: 定, 模: "spec", 標: "每一顆自己的科別色", 註: "九顆一循環，同色仍然不相鄰" },
  { 檔: "band-18-ink.png", n: 基 * 2, 模: "ink", 標: "18 顆", 註: "" },
  { 檔: "band-9-ink.png", n: 基, 模: "ink", 標: "9 顆", 註: "接得起來的最小一段" },
].map((a) => ({ ...a, B: 條(a.n, a.模), ...出圖(a.檔, 條(a.n, a.模), a.模) }));
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
const 卡 = (w, 行, { 帶檔, 丸, 印, 折 } = {}) => `<div class="stcard sgl${折 ? " car" : ""}" style="width:${w}px">
<div class="cb">
${linesHtml(行)}${丸 ? "\n" + 藥丸(丸) : ""}
</div>${印 ? "\n" + 印 : ""}${帶檔 ? `\n<img class="bnd" src="${帶檔}" width="${帶by[帶檔].w}" height="${帶by[帶檔].h}" alt="芳仁牙醫診所的標誌排成的一條帶子">` : ""}
</div>`;
const 格 = (卡html, 說) => `<figure class="swrap">${卡html}<figcaption>${說}</figcaption></figure>`;
const 說帶 = (檔, w) => `帶子 ${帶高(帶by[檔], w).toFixed(1)}px・最高那一顆 ${顆高(帶by[檔], w).toFixed(1)}px`;

const 現況卡 = 卡(BUB.mega, MEGA, { 印: wmSvg(輪, OFF, false) });
const CSS2 = `
.sgrid{display:flex;flex-wrap:wrap;gap:20px 12px;margin:1em 0 0;align-items:flex-start}
.swrap{margin:0;max-width:${BUB.mega + 2}px}
.sgl{overflow:hidden;box-sizing:content-box}
.sgl.car .cb p{white-space:pre-line}
.swrap .was{color:var(--soft);font-weight:400}
.sgl .bnd{display:block;width:100%;height:auto}
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
預約成功通知與約診紀錄查詢<b>共用同一張卡</b>；浮水印拿掉，改用立牌上那條標誌帶，<b>滿版壓在卡片下緣</b>。<br>
現在送出去的那一版（浮水印）在另一頁：<a href="/preview/line-card-spec/">/preview/line-card-spec/</a></p>

<h2 class="h2">1　換掉浮水印<span class="t">同一張卡，其餘一個字都沒動</span></h2>
<div class="sgrid">
${格(現況卡, `<b>現在這樣</b>　浮水印疊在右下角、往外溢出 ${OFF.right}／${OFF.bottom}px`)}
${格(卡(BUB.mega, MEGA, { 帶檔: "band-27-set.png" }), `<b>這一版</b>　${說帶("band-27-set.png", BUB.mega)}`)}
</div>

<h2 class="h2">2　兩則同一個殼<span class="t">姓名・日期・約診狀態・帶子</span></h2>
<p class="note">單張那一則底下多兩行小字 —— 那兩句在輪播上會一筆重複一次。</p>
<div class="sgrid">
${格(卡(BUB.mega, MEGA, { 帶檔: "band-27-set.png", 丸: PILLVAL[0] }),
  `<b>預約成功通知</b>　單張 <code>mega</code>・${BUB.mega}px`)}
${格(卡(BUB.car, 輪播行, { 帶檔: "band-27-set.png", 丸: PILLVAL[1], 折: true }),
  `<b>約診紀錄查詢</b>　輪播 <code>${BUB.階}</code>・${BUB.car}px`)}
</div>

<h2 class="h2">3　帶子多少顆<span class="t">滿版，所以顆數 ＝ 帶子多高</span></h2>
<p class="note">只給 ${基} 的整數倍 —— 那三條相鄰的限制在接縫上也要成立。這一排都是淡墨（一把尺只動一件事）。</p>
<div class="sgrid">
${[["band-9-ink.png", "9 顆"], ["band-18-ink.png", "18 顆"], ["band-27-ink.png", "27 顆"]]
  .map(([f, 標]) => 格(卡(BUB.mega, MEGA, { 帶檔: f }), `<b>${標}</b>　${說帶(f, BUB.mega)}`)).join("\n")}
</div>

<h2 class="h2">4　帶子的顏色</h2>
<p class="note">七顆套色的位置是挑過的（間隔 ≥3 顆、相鄰間隔相同的最多一對），<b>只有 27 顆那一份有</b>；9 與 18 顆一律淡墨。</p>
<div class="sgrid">
${帶案.filter((a) => a.n === 定)
  .map((a) => 格(卡(BUB.mega, MEGA, { 帶檔: a.檔 }), `<b>${esc(a.標)}</b>　${esc(a.註)}`)).join("\n")}
</div>

<h2 class="h2">5　輪播那一張要不要少幾顆<span class="t">卡片窄 ${BUB.mega - BUB.car}px，同一條帶子跟著細下去</span></h2>
<div class="sgrid">
${[["band-27-set.png", "和單張同一條"], ["band-18-ink.png", "少一輪"]]
  .map(([f, 標]) => 格(卡(BUB.car, 輪播行, { 帶檔: f, 丸: PILLVAL[1], 折: true }),
    `<b>${標}</b>　${說帶(f, BUB.car)}　<span class="was">單張上是 ${帶高(帶by[f], BUB.mega).toFixed(1)}px</span>`)).join("\n")}
</div>

<h2 class="h2">6　換掉浮水印之後</h2>
<div class="rows">
<div class="row"><p class="k">要廠商填的值</p><p class="v">九顆各一組（兩欄寬度、長寬比、網址）→ <b>一張圖、<code>size: full</code>，一個數字都不必填</b></p></div>
<div class="row"><p class="k"><code>position: absolute</code></p><p class="v">浮水印非疊不可（<b>那一項到今天還沒有實機驗過</b>）→ 帶子排在文字那一塊後面就好，<b>不必疊</b></p></div>
<div class="row"><p class="k">圖檔</p><p class="v">${WM.length * 2} 張（九顆 × 兩種濃度）→ <b>1 張</b></p></div>
<div class="row"><p class="k">換來的</p><p class="v">顏色不再跟著那一筆約診換（浮水印是 <code>(月＋日)%9</code>）—— 帶子固定一條，兩則、每一筆都一樣</p></div>
<div class="row"><p class="k">還沒決定</p><p class="v">帶子多少顆、哪一種顏色、輪播要不要少一輪；<b>約診狀態那一列在單張上也會出現</b>（值是「${esc(PILLVAL[0].名)}」）</p></div>
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
  console.log(`  卡片 單張 ${BUB.mega}px／輪播 ${BUB.car}px（${BUB.階}）・內距 ${CARD.pad}px・底 ${WCARD}`);
  console.log(`  現況那顆浮水印：${輪.n}・淡墨 ${INK} ${(WM_A * 100).toFixed(0)}%・溢出 ${OFF.right}／${OFF.bottom}px`);
}
