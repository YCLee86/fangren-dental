#!/usr/bin/env node
/* 把科別色牌疊到分享圖上 → assets/og-topic-<spec>.jpg
 *
 *   node tools/og-plate.mjs <spec> [--from <原檔>]
 *   例：node tools/og-plate.mjs general
 *       node tools/og-plate.mjs general --from drafts/og-topic-general-src.jpg
 *
 * 為什麼要有牌子（ILLUSTRATION.md 第十一節）：分享卡在訊息 app 裡只有 250px，
 * **標誌單獨出現認不出是誰**，所以一定是「標誌 ＋ 芳仁牙醫診所」六個字一起。
 * ⚠ 使用者 2026-08-22 指定要把科別名與標誌壓進圖裡
 *   （他問過「卡片上的標題能不能不要出現」—— 不行，三家 app 都會顯示，
 *     拿掉 og:title 只會退回 <title> 或網址）。
 *
 * ⚠⚠ **實心色牌被退回**（同日）：「忽略了很重要的要素 —— 不搶戲、和諧，
 *   這也是診所品牌的核心概念之一」。改成**頂部的玻璃帶**（預設 --style glass），
 *   做法照站上頁首那條玻璃：模糊 ＋ 低透明度的套色 ＋ 一條細邊。
 * ⚠⚠ **玻璃要用深階不是套色，而且要墊一層墨** —— 這是量出來的：
 *   紙色字壓在玻璃上的對比度（站上門檻 4.5）
 *     套色 .34            → 中位 3.12 ・最亮處 1.74   ✗ 白字幾乎看不見
 *     套色 .72 ＋墨 .16   → 中位 4.93 ・最亮處 3.78   ✗
 *     深階 .70 ＋墨 .18   → 中位 5.90 ・最亮處 4.40   ← 定案（使用者選「中」）
 *     深階 .76 ＋墨 .16   → 中位 6.13 ・最亮處 4.79
 *   ⚠ 「最亮處」是天空從玻璃後面透上來的那一段，是最難讀的地方，要單獨量。
 *   量法：只取兩段文字**中間**那塊沒有字的玻璃（x 48%~62%），
 *   否則會把紙色的字本身算進背景裡。
 *
 * 三件這一支自己解掉的事：
 * ① **字型**：容器裡只有文泉驛，站上是思源黑體／Noto Sans TC。
 *    做法是把 Noto Sans TC 只留這七科會用到的 34 個字，
 *    子集化成 `tools/fonts/NotoSansTC-{500,700}-subset.woff2`（各 ~6.8KB，OFL，已進版控）。
 *    ⚠ 放在 tools/ 不是 assets/ —— 它只在產圖時用，不需要上線（dist 不會複製 tools/）。
 * ② **標誌**：直接讀 index.html 頁首那條原始向量，不重畫也不抄第二份
 *    （同 tools/logo-png.mjs 的做法）。牌子是深綠底，所以標誌畫成紙色。
 * ③ **科別色**：從 PALETTE.md 各科的**套色**那一階取（填實的塊用套色，
 *    白底的字才用深階）。
 *
 * ⚠⚠ **順序固定是兩步，而且每次都要從頭跑**：
 *      node tools/og-resize.mjs drafts/og-topic-<spec>-src.jpg <spec>   ← 乾淨的底圖
 *      node tools/og-plate.mjs <spec>                                   ← 疊牌子
 *   這一支**讀寫同一個檔**，所以只跑第二步兩次會把牌子疊兩層 ——
 *   要重做就從第一步再來一次（原檔一律留在 drafts/）。
 *   `--from` 只是應急（直接吃原檔），底圖會用 object-fit: cover 裁到 1.91:1。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200, H = 628;

/* 科別的套色（PALETTE.md）。⚠ 不是深階 —— 深階是給白底上的字用的。 */
const ACCENT = {
  general: "#3f654a",   // 一般牙科・定期檢查
  perio:   "#317d78",   // 牙周治療
  kids:    "#c28229",   // 兒童牙科
  endo:    "#ae4f4d",   // 顯微根管
  prosth:  "#335b8b",   // 植牙・假牙重建
  surg:    "#8e6299",   // 口腔外科
  ortho:   "#4478b5",   // 齒顎矯正
};
const DEEP = {
  general: "#2c5238", perio: "#2a6d69", kids: "#9e6301", endo: "#89202d",
  prosth: "#182f4b", surg: "#784e84", ortho: "#244369",
};
const PAPER = "#e2e5e6";   // --paper：牌子上的字與標誌

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/* ⚠⚠ 只抓 <path d=…> 是不夠的（2026-08-22 踩過，第一版標誌整個沒畫出來）：
   頁首那個標誌的 path 包在 <g transform="translate(-232.8729 -333.8286)"> 裡面，
   把 d 單獨搬出來就等於把圖形丟到 viewBox 外面 —— 畫布上什麼都沒有，而且不報錯。
   ⚠ path 本身寫的是 fill="currentColor" ＋ fill-rule="evenodd"，
   所以**整段內容原封不動搬**、顏色用 svg 的 color 控制就好，不要自己補 fill。 */
function headerLogoInner() {
  const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
  const svg = home.match(/<svg[^>]*viewBox="0 0 44\.2873 21\.8244"[^>]*>([\s\S]*?)<\/svg>/);
  if (!svg) throw new Error("index.html 裡找不到頁首那個標誌 <svg>（viewBox 0 0 44.2873 21.8244）");
  const inner = svg[1];
  if (!/<path[^>]*\sd="/.test(inner)) throw new Error("頁首的標誌 <svg> 裡找不到 <path d=…>");
  return inner;
}

const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome");
  return out;
};

const args = process.argv.slice(2);
const spec = args[0];
const fromIdx = args.indexOf("--from");
const fromArg = fromIdx >= 0 ? args[fromIdx + 1] : null;
const styleIdx = args.indexOf("--style");
const STYLE = styleIdx >= 0 ? args[styleIdx + 1] : "glass";  // glass＝頂部玻璃帶（預設）／solid＝實心牌
if (!["glass", "solid"].includes(STYLE)) { console.error("--style 只能是 glass 或 solid"); process.exit(1); }
const tintIdx = args.indexOf("--tint");
const TINT = tintIdx >= 0 ? Number(args[tintIdx + 1]) : 0.70;  // 玻璃的濃度（實測值，見檔頭）
const inkIdx = args.indexOf("--ink");
const INK = inkIdx >= 0 ? Number(args[inkIdx + 1]) : 0.18;     // 玻璃底下墊的那層墨（撐對比用）
const shadeIdx = args.indexOf("--shade");
const SHADE = shadeIdx >= 0 ? args[shadeIdx + 1] : "deep";     // deep＝深階（預設，對比撐得住）／accent＝套色
const posIdx = args.indexOf("--pos");
const POS = posIdx >= 0 ? args[posIdx + 1] : "bl";   // bl＝左下（預設）／tl＝左上
if (!["bl", "tl"].includes(POS)) { console.error("--pos 只能是 bl 或 tl"); process.exit(1); }
if (!spec || !ACCENT[spec]) {
  console.error("用法：node tools/og-plate.mjs <spec> [--from <原檔>]");
  console.error("spec：" + Object.keys(ACCENT).join(" / "));
  process.exit(1);
}

const { TOPICS } = await import("./topic-copy.mjs");
const label = TOPICS[spec]?.label;
if (!label) throw new Error(`topic-copy.mjs 裡沒有 ${spec}`);

const base = fromArg ? path.resolve(ROOT, fromArg) : path.join(ROOT, "assets", `og-topic-${spec}.jpg`);
if (!fs.existsSync(base)) {
  console.error(`× 找不到底圖 ${path.relative(ROOT, base)}`);
  console.error("  先跑 node tools/og-resize.mjs <原檔> " + spec);
  process.exit(1);
}

const fontFace = (weight) => {
  const f = path.join(ROOT, "tools", "fonts", `NotoSansTC-${weight}-subset.woff2`);
  if (!fs.existsSync(f)) throw new Error(`找不到字型子集 ${path.relative(ROOT, f)}`);
  return `@font-face{font-family:"NotoTC";font-weight:${weight};src:url(data:font/woff2;base64,${fs.readFileSync(f).toString("base64")}) format("woff2");}`;
};

const imgUri = `data:image/jpeg;base64,${fs.readFileSync(base).toString("base64")}`;
const accent = ACCENT[spec];
const logoInner = headerLogoInner();

/* 版面：牌子貼在左下角，那一塊在構圖時就留成安靜區（騎樓地面與機車）。
   ⚠ 字級是照 250px 的卡片回推的：科別名 56px → 卡片上 11.7px，
     診所名 34px → 7.1px（次要那一行，和標誌一起讀）。 */
const PAD = 34;            // 牌子離畫面左緣／下緣
const PLATE_PAD_X = 30;    // 牌內左右內距
const PLATE_PAD_Y = 24;
const NAME_FS = 56;        // 科別名
const CLINIC_FS = 34;      // 芳仁牙醫診所
const LOGO_H = 30;         // 標誌高（原始比例 2.02918:1）
const GAP = 14;            // 兩行之間
const LOGO_GAP = 10;       // 標誌與六個字之間

/* 玻璃帶的幾何（1200×628 上）。⚠ 字級照 250px 的卡片回推：
   科別名 46px → 卡片上 9.6px、診所名 30px → 6.3px（和標誌一起讀）。 */
const BAND_H = 104;
const BAND_PAD = 38;
const G_NAME_FS = 46;
const G_CLINIC_FS = 30;
const G_LOGO_H = 26;

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const [ar, ag, ab] = hex2rgb(SHADE === "deep" ? DEEP[spec] : accent);
const [pr, pg_, pb] = hex2rgb(PAPER);

const glassHtml = `<!doctype html><meta charset="utf-8"><style>
${fontFace(700)}${fontFace(500)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden}
img.bg{width:${W}px;height:${H}px;display:block;object-fit:cover}
/* 頁首那條玻璃的做法（PALETTE.md 第六之三節）：模糊 ＋ 低透明度的套色 ＋ 一條細邊。
   ⚠ 底下再墊一層很淡的深色漸層，只為了讓紙色的字撐得住對比 —— 不是裝飾。 */
.band{position:absolute;left:0;right:0;top:0;height:${BAND_H}px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 ${BAND_PAD}px;
  background:
    linear-gradient(180deg, rgba(42,44,39,${(INK + 0.06).toFixed(3)}) 0%,
                            rgba(42,44,39,${INK.toFixed(3)}) 55%,
                            rgba(42,44,39,${Math.max(0, INK - 0.06).toFixed(3)}) 100%),
    linear-gradient(180deg, rgba(${ar},${ag},${ab},${(TINT + 0.05).toFixed(3)}) 0%,
                            rgba(${ar},${ag},${ab},${TINT.toFixed(3)}) 62%,
                            rgba(${ar},${ag},${ab},${(TINT - 0.05).toFixed(3)}) 100%);
  backdrop-filter:blur(18px) saturate(1.12);
  -webkit-backdrop-filter:blur(18px) saturate(1.12);
  border-bottom:1px solid rgba(${pr},${pg_},${pb},.30)}
.name{font-family:"NotoTC";font-weight:700;font-size:${G_NAME_FS}px;line-height:1;
  color:${PAPER};letter-spacing:.03em;white-space:nowrap;
  text-shadow:0 1px 2px rgba(20,24,20,.28)}
.right{display:flex;align-items:center;gap:10px}
.right svg{height:${G_LOGO_H}px;width:${(G_LOGO_H * 2.02918).toFixed(2)}px;display:block;
  filter:drop-shadow(0 1px 2px rgba(20,24,20,.28))}
.clinic{font-family:"NotoTC";font-weight:500;font-size:${G_CLINIC_FS}px;line-height:1;
  color:${PAPER};letter-spacing:.06em;white-space:nowrap;
  text-shadow:0 1px 2px rgba(20,24,20,.28)}
</style>
<img class="bg" src="${imgUri}">
<div class="band">
  <span class="name">${label}</span>
  <span class="right">
    <svg viewBox="0 0 44.2873 21.8244" aria-hidden="true" style="color:${PAPER}">${logoInner}</svg>
    <span class="clinic">芳仁牙醫診所</span>
  </span>
</div>`;

const html = `<!doctype html><meta charset="utf-8"><style>
${fontFace(700)}${fontFace(500)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden}
img.bg{width:${W}px;height:${H}px;display:block;object-fit:cover}
.plate{position:absolute;left:${PAD}px;${POS === "tl" ? `top:${PAD}px` : `bottom:${PAD}px`};background:${accent};
  border-radius:12px;padding:${PLATE_PAD_Y}px ${PLATE_PAD_X}px;
  box-shadow:0 2px 10px rgba(20,24,20,.18);display:inline-block}
.name{font-family:"NotoTC";font-weight:700;font-size:${NAME_FS}px;line-height:1.06;
  color:${PAPER};letter-spacing:.02em;white-space:nowrap}
.row{display:flex;align-items:center;gap:${LOGO_GAP}px;margin-top:${GAP}px}
.row svg{height:${LOGO_H}px;width:${(LOGO_H * 2.02918).toFixed(2)}px;display:block}
.clinic{font-family:"NotoTC";font-weight:500;font-size:${CLINIC_FS}px;line-height:1;
  color:${PAPER};letter-spacing:.06em;white-space:nowrap;opacity:.95}
</style>
<img class="bg" src="${imgUri}">
<div class="plate">
  <div class="name">${label}</div>
  <div class="row">
    <svg viewBox="0 0 44.2873 21.8244" aria-hidden="true" style="color:${PAPER}">${logoInner}</svg>
    <span class="clinic">芳仁牙醫診所</span>
  </div>
</div>`;

const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) { console.error("× 找不到 Playwright"); process.exit(1); }
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chrome) { console.error("× 找不到 Chromium"); process.exit(1); }

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await pg.setContent(STYLE === "glass" ? glassHtml : html, { waitUntil: "load" });
await pg.evaluate(() => document.fonts.ready);
await pg.evaluate(() => Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {}))));

/* 驗一件：牌子有沒有壓到臉或手 —— 構圖時左下角就留成安靜區，
   這裡量牌子佔畫面多大，超過一半就是版面出事了。 */
const sel = STYLE === "glass" ? ".band" : ".plate";
const box = await pg.evaluate((sel) => {
  const r = document.querySelector(sel).getBoundingClientRect();
  return { w: r.width, h: r.height, left: r.left, top: r.top };
}, sel);
if (STYLE === "solid" && (box.w > W * 0.62 || box.h > H * 0.38)) {
  console.error(`× 牌子太大（${box.w.toFixed(0)}×${box.h.toFixed(0)}，畫面 ${W}×${H}）——`);
  console.error("  科別名太長或字級調過頭，會蓋到人。");
  process.exit(1);
}

const buf = await pg.screenshot({ type: "jpeg", quality: 88 });
await browser.close();

const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? path.resolve(ROOT, args[outIdx + 1]) : path.join(ROOT, "assets", `og-topic-${spec}.jpg`);
fs.writeFileSync(out, buf);
console.log(`牌子 ${box.w.toFixed(0)}×${box.h.toFixed(0)}（佔畫面寬 ${(100 * box.w / W).toFixed(1)}%・高 ${(100 * box.h / H).toFixed(1)}%）`);
console.log(`✓ ${path.relative(ROOT, out)}  ${W}×${H}  ${(fs.statSync(out).size / 1024).toFixed(1)}KB`);
