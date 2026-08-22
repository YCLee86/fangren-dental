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
const STYLE = styleIdx >= 0 ? args[styleIdx + 1] : "glass";
/* glass＝頂部玻璃帶（預設，七科的著陸頁用這個）
   plain＝**不放帶子**，標示直接壓在照片左上角（首頁那張夜景用這個，2026-08-22 使用者指定）
   solid＝最早那塊實心牌，已被退回，留著只是退路 */
if (!["glass", "solid", "plain"].includes(STYLE)) { console.error("--style 只能是 glass / plain / solid"); process.exit(1); }
const tintIdx = args.indexOf("--tint");
const TINT = tintIdx >= 0 ? Number(args[tintIdx + 1]) : 0.70;  // 玻璃的濃度（實測值，見檔頭）
const inkIdx = args.indexOf("--ink");
const INK = inkIdx >= 0 ? Number(args[inkIdx + 1]) : 0.18;     // 玻璃底下墊的那層墨（撐對比用）
const locIdx = args.indexOf("--loc");
const LOC = locIdx >= 0 ? args[locIdx + 1] : "none";  // none／city（雲林斗六）／full（雲林斗六・永樂街）
const LOC_TEXT = { none: "", city: "雲林斗六", full: "雲林斗六・永樂街" }[LOC];
if (LOC_TEXT === undefined) { console.error("--loc 只能是 none / city / full"); process.exit(1); }
const lpIdx = args.indexOf("--locpos");
/* right＝跟著診所名並排（＝首頁**電腦版**的 .brand-text）
   left ＝跟著科別名並排
   stack＝**手機版首頁**那種上下兩行（見下面 .stack 那一段的註解） */
const LOCPOS = lpIdx >= 0 ? args[lpIdx + 1] : "right";
if (!["right", "left", "stack"].includes(LOCPOS)) { console.error("--locpos 只能是 right / left / stack"); process.exit(1); }
/* --stats：把首頁窄帶那三格（1983年 中華路開業／9位 醫師駐診／5個 部定專科）
   加在圖片下緣。2026-08-22 使用者指定，只給首頁那張用。
   ⚠ 三格的字、字級、字重、字距、內距、分隔線**全部是在 1200 寬的視窗上打開
     index.html 量回來的**，不是照記憶寫的（首頁在 ≥1041 那一段根字級是 18px，
     和這張圖同寬，所以量到的 px 可以直接用，不必換算）。 */
/* --nomark：--style plain 時整個不畫左上那組標示（只留下緣的三格）。 */
/* --statspos over|below
   over ＝ 三格壓在照片下緣（第一版）
   below＝**照片縮短，三格放進照片底下另外一條深色帶**（2026-08-22 使用者指定：
          「你們看電腦版、手機版、iPad 可以發現，我為了不要壓到門面，
            甚至在圖片下另外加深色橫帶」）。
   ⚠⚠ 這正是站上 iPad 直放與手機版在做的事（CLAUDE.md 第六之十八節、
     PALETTE.md 第六之十九節）：`.hero` 直向 flex、照片 flex:1、**窄帶脫離照片接在下面**。
     壓在上面那一版怎麼裁都會蓋到亮著的騎樓 —— 因為那塊亮區在原檔裡就幾乎貼著底邊。 */
const spIdx = args.indexOf("--statspos");
const STATSPOS = spIdx >= 0 ? args[spIdx + 1] : "over";
if (!["over", "below"].includes(STATSPOS)) { console.error("--statspos 只能是 over 或 below"); process.exit(1); }
const NOMARK = args.includes("--nomark");
const STATS = args.includes("--stats");
/* --statscale：三格整組放大幾倍（1 ＝ 和站上 1200 寬時逐項相同）。
   ⚠ 1 倍在訊息卡（實測 212px 寬）上，數字只有 21.24 × 212/1200 ＝ **3.8px**，
     標籤 2.2px —— 那是紋理不是字。放大是為了那個尺寸，不是為了原尺寸好看。 */
const ssIdx = args.indexOf("--statscale");
const SS = ssIdx >= 0 ? Number(args[ssIdx + 1]) : 1;
if (!(SS > 0)) { console.error("--statscale 要是正數"); process.exit(1); }
const STATS_CELLS = [
  { n: "1983", u: "年", s: "中華路開業" },
  { n: "9",    u: "位", s: "醫師駐診" },
  { n: "5",    u: "個", s: "部定專科" },
];
const STATS_TEXT = STATS_CELLS.map((c) => c.n + c.u + c.s).join("");
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
/* --label 覆寫左邊那行字（空字串 ＝ 整個不放）。
   ⚠ 給**首頁**的分享卡用的 —— 首頁不是科別，掛「一般牙科・定期檢查」是錯的。
   科別的卡一律不要帶這個旗標，讓它自己去 topic-copy.mjs 拿。 */
const labIdx = args.indexOf("--label");
const label = labIdx >= 0 ? args[labIdx + 1] : TOPICS[spec]?.label;
if (label === undefined) throw new Error(`topic-copy.mjs 裡沒有 ${spec}`);

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
/* 窄帶那三格的數字，站上用的是襯線（.stats b 的字族是
   "Noto Serif TC","Source Han Serif TC","Times New Roman",Times,serif）——
   使用者的 iPhone 上實際命中的是 **Times New Roman**。容器裡沒有它，
   用 **Liberation Serif**（和 Times New Roman 度量相容、字形極接近）當替身，
   只子集 0~9 十個字，1.2KB。授權在 tools/fonts/LiberationSerif-LICENSE.txt。 */
const serifFace = () => {
  const f = path.join(ROOT, "tools", "fonts", "LiberationSerif-700-digits.woff2");
  if (!fs.existsSync(f)) throw new Error(`找不到 ${path.relative(ROOT, f)}`);
  return `@font-face{font-family:"NumSerif";font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync(f).toString("base64")}) format("woff2");}`;
};

/* ⚠⚠ **子集缺字會靜靜地換一種字體，不會報錯**（2026-08-22 踩到，而且已經上線了）：
   `font-family:"NotoTC"` 沒有後備，缺字時瀏覽器就去撿系統字 —— 這個容器裡是
   文泉驛。症狀是「芳仁牙醫診所」是思源黑體、緊接著的「雲林斗六・永樂街」
   卻是另一種字，同一行兩種字體，而三道檢查（透明度、顏色、版面）全部過。
   所以這裡逐字比對一次，缺了就 throw ——
   要加字就把字補進 tools/fonts/glyphs.txt 再重跑 pyftsubset。 */
const GLYPHS = new Set(fs.readFileSync(path.join(ROOT, "tools", "fonts", "glyphs.txt"), "utf8").trim());
const assertGlyphs = (text, where) => {
  const miss = [...new Set(text)].filter((c) => !/\s/.test(c) && !GLYPHS.has(c));
  if (miss.length) {
    console.error(`× 字型子集缺字：${miss.join(" ")}（出現在${where}）`);
    console.error("  補進 tools/fonts/glyphs.txt 再重跑 pyftsubset，不要放著讓它掉到系統字。");
    process.exit(1);
  }
};

assertGlyphs(String(label) + "芳仁牙醫診所" + LOC_TEXT + (STATS ? STATS_TEXT : ""), "圖上的字");

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
/* 下緣那三格：漸層攤在最後 170px 上（三格本身高 ≈ 42，離下緣 38，
   剩下的留給漸層從透明長到 .88 —— 太短會看得出一條邊，同第九節第 10 條）。 */
const SBAND_H = 170;   // ⚠ over 模式的漸層高度，會跟著 --statscale 長，見 plainHtml
/* below 模式：帶高 ＝ 三格的塊高 ＋ 上下留白。塊高 ＝ 數字行(21.24×1.15) ＋ 間距 5 ＋ 標籤 12.6，
   整組乘 --statscale；留白取 26px（和 BAND_PAD 38 比稍緊，因為這條帶子本身就是留白）。 */
const BAND_BOT = "#2d3037";   // ＝ 站上的 --band-bot，接住紙色那一頭的明度

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
/* ⚠ 地名的排法**逐項照首頁 .brand-text 量來的**（2026-08-22 使用者：
   「BC 的位置很刻意，首頁上的擺放看起來就不刻意、很講究」）：
   ・同一條 baseline 並排，不是上下兩行
   ・中間一條 1px 細豎線（rgba(紙,.28)），上下各內縮 .1em
   ・地名字級 ＝ 主名的 73.6%（首頁 .78rem ÷ 1.06rem）
   ・地名透明度 .65／主名 .95（首頁是白，這裡換成紙色） */
.pair{display:flex;align-items:baseline;gap:${(0.37).toFixed(2)}em}
.loc{position:relative;font-family:"NotoTC";font-weight:500;line-height:1.3;
  letter-spacing:.04em;white-space:nowrap;opacity:.65;color:${PAPER};
  padding-left:.37em;text-shadow:0 1px 2px rgba(20,24,20,.28)}
.loc::before{content:"";position:absolute;left:0;top:.1em;bottom:.1em;
  border-left:1px solid rgba(${pr},${pg_},${pb},.28)}
.left .loc{font-size:${(G_NAME_FS * 0.736).toFixed(1)}px}
.right .loc{font-size:${(G_CLINIC_FS * 0.736).toFixed(1)}px}
.name{font-family:"NotoTC";font-weight:700;font-size:${G_NAME_FS}px;line-height:1;
  color:${PAPER};letter-spacing:.03em;white-space:nowrap;
  text-shadow:0 1px 2px rgba(20,24,20,.28)}
.right{display:flex;align-items:center;gap:10px}
.right .pair{align-items:baseline}
.right svg{height:${G_LOGO_H}px;width:${(G_LOGO_H * 2.02918).toFixed(2)}px;display:block;
  filter:drop-shadow(0 1px 2px rgba(20,24,20,.28))}
.clinic{font-family:"NotoTC";font-weight:500;font-size:${G_CLINIC_FS}px;line-height:1;
  color:${PAPER};letter-spacing:.06em;white-space:nowrap;
  text-shadow:0 1px 2px rgba(20,24,20,.28)}
/* ⚠ --locpos stack ＝ **手機版首頁**那一種排法，四件事都是照 index.html
   max-width: 720px 那一段逐條抄的（2026-08-22）。
   ⚠ 這一段是模板字串裡的 CSS 註解，**不能出現反引號**（CLAUDE.md 第九節）：
   ・上下兩行（.brand-text 改成 display:block，b 與 small **都要**改成 block ——
     只改外層的話兩個行內元素仍然排在同一行，那是站上踩過的坑）
   ・**細豎線與左內距一起拿掉**（small::before 設成 display:none）——
     豎線是「並排」才需要的分隔，疊成兩行還留著就變成一條沒有意義的線
   ・**兩行都要 text-align-last: justify**，區塊寬 ＝ 較寬的那一行，
     窄的那一行把字距拉開填滿 → 左右緣切齊。⚠ 兩行都要寫：
     地名 8 個字、診所名 6 個字，比值 0.774 > 6/8，**較寬的是地名那一行**，
     只寫地名等於沒事做、反而是診所名那行短一截（站上 2026-08-14 修過同一件事）
   ・字級比值 ＝ 手機版的 2.95vw ÷ 3.81072vw ＝ **0.774**（電腦版是 .736，不一樣）
   ⚠ white-space: nowrap 留著不影響 justify（站上實測仍是一行）。 */
/* ⚠⚠ 下面每一個係數都是**在 390×844 上打開 index.html 量回來的**
   （2026-08-22 使用者拿他手機的截圖對照：「跟我手機上看到的很不一樣」）。
   第一版是照著記憶中的規則寫的，四項全錯，而且錯的都是**比例**：

     量到的（未捲動，主名 14.8618px）        第一版      現在
     標誌寬 ÷ 主名字級      2.156            1.759      2.156
     標誌與字的間距 ÷ 主名  0.807            0.333      0.807
     主名的字重            700               500        700
     主名的字距            .01em             .06em      .01em
     地名的字重            400               500        500（只有 500/700 兩個子集）
     行高                  兩行都 1.3、緊貼    1 ＋ 4.8px margin   兩行都 1.3、緊貼

   ⚠ 標誌小了 18%、間距只有一半 —— 那兩項是「看起來不一樣」的主因，
     不是字級（字級比值 0.774 第一版就是對的）。
   ⚠ 主名的字距從 .06 改回 .01em 不是美感，是**讓 justify 回到首頁那個狀態**：
     .01em 時主名 181.8 比地名 193 窄，被撐開的是主名、每格 0.073em
     （首頁量到 0.076em）；.06em 時兩行剛好一樣寬，justify 等於沒作用。
   ⚠ 地名站上是 400，這裡只有 500 —— 子集只做了 500/700 兩個字重，
     而且 250px 的卡片上細一階反而更難讀，刻意不補。
   ⚠ 站上宣告的是 "Noto Sans TC" 但**沒有載任何 webfont**，所以使用者的 iPhone
     其實是 PingFang。這一支用 Noto Sans TC（宣告的第一順位），字形本來就會有差。 */
.stack{display:inline-block;width:max-content}
.stack .clinic,.stack .loc{display:block;text-align:justify;text-align-last:justify}
.stack .clinic{font-weight:700;letter-spacing:.01em;line-height:1.3}
/* ⚠⚠ 窄的那一行被撐開太多的時候就不要 justify（下面那段量測會自己掛上這個 class）——
   首頁上兩行的自然寬只差 6%（地名 8 個字比診所名 6 個字**還寬一點**，
   被拉開的是診所名、每格只多 0.076em，看不出來）；
   換成「雲林斗六」四個字就反過來，每格要多 1.35em ＝ 首頁的十八倍，
   讀起來是「雲　林　斗　六」四個孤字。 */
body.nojustify .stack .loc{text-align-last:right}
body.nojustify-clinic .stack .clinic{text-align-last:right}
.stack .loc{position:static;padding-left:0;font-size:${(G_CLINIC_FS * 0.774).toFixed(2)}px;
  line-height:1.3;letter-spacing:.04em;margin-top:0}
.stack .loc::before{display:none}
/* 標誌與間距整組跟著主名的字級長（係數同上表）。 */
.right.stacked{gap:${(G_CLINIC_FS * 0.807).toFixed(1)}px}
.right.stacked svg{height:${(G_CLINIC_FS * 2.156 / 2.02918).toFixed(2)}px;
  width:${(G_CLINIC_FS * 2.156).toFixed(2)}px}
</style>
<img class="bg" src="${imgUri}">
<div class="band">
  <span class="left pair">
    <span class="name">${label}</span>
    ${LOC_TEXT && LOCPOS === "left" ? `<span class="loc">${LOC_TEXT}</span>` : ""}
  </span>
  <span class="right${LOCPOS === "stack" && LOC_TEXT ? " stacked" : ""}">
    <svg viewBox="0 0 44.2873 21.8244" aria-hidden="true" style="color:${PAPER}">${logoInner}</svg>
    <span class="${LOCPOS === "stack" && LOC_TEXT ? "stack" : "pair"}">
      <span class="clinic">芳仁牙醫診所</span>
      ${LOC_TEXT && (LOCPOS === "right" || LOCPOS === "stack") ? `<span class="loc">${LOC_TEXT}</span>` : ""}
    </span>
  </span>
</div>`;

/* --style plain：沒有帶子，標示直接壓在照片左上角（2026-08-22 使用者指定：
   「不要有顏色的帶子；圖片現在右上有 logo ＋ 診所名稱 ＋ 雲林斗六・永樂街，移到左上」）。
   ⚠ 版面（標誌大小、間距、字重、字距、兩行的 justify）**和 glass 那一版逐項相同** ——
     差的只有「有沒有那條帶子」與「擺左上還是右上」，不要順手改成另一組比例。
   ⚠⚠ 沒有帶子墊底，字就直接壓在照片上，**陰影要用站上 HERO 那首詩的同一組**
     （COPY.md 第一節：兩層、陰影色用 #191614 不用純黑）。這裡字級是詩的約 1.9 倍，
     所以兩層都按同一個倍率放大：0 1px 2px → 0 2px 4px、0 0 4px → 0 0 8px。
     **不要自己另外調一組** —— 那首詩壓的就是這張照片，已經驗過了。 */
const plainHtmlOf = (SEAM, PH, BH) => `<!doctype html><meta charset="utf-8"><style>
${fontFace(700)}${fontFace(500)}${STATS ? serifFace() : ""}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden}
/* ⚠ below 模式照片變矮，cover 會裁掉一部分 —— **裁天空，不要裁路面**，
   這就是站上這張照片一直在用的規則（index.html：object-position: 50% 100%，
   「下緣貼齊、要切切天空」）。裁到路面的話下面那條帶子就接不到地了。 */
img.bg{width:${W}px;height:${STATSPOS === "below" ? PH : H}px;display:block;
  object-fit:cover;object-position:50% 100%}
.mark{position:absolute;left:${BAND_PAD}px;top:${BAND_PAD}px;display:flex;align-items:center}
/* ---- below：照片底下另外一條深色帶（＝站上 iPad／手機版的做法）--------------
   ⚠⚠ **接縫在窄帶那一側解決，照片不准動**（PALETTE.md 第六之十九節，
     2026-08-12 那一輪被使用者退過一次才學到的）。所以帶子的起點色不是隨便挑的，
     是**現場量照片最後一列的中位數**（取中位不取平均：路燈與門口的燈幾顆亮點
     就能把平均拉高 4 個 L*）。
   ⚠ 漸層的形狀是 **S(t^1.6)**，S(x)=3x²−2x³ —— 和站上手機版窄帶逐字相同的曲線：
     頭尾斜率都是 0（接縫那一側自動是平的，不會長出馬赫帶），
     而 1.6 次方讓「還算黑」的範圍撐到帶子的一半以上。
     用同一條式子從量到的接縫色算到 --band-bot #2d3037。 */
.sbelow{position:absolute;left:0;right:0;bottom:0;height:${BH}px;
  display:flex;align-items:center;justify-content:center;
  background-image:linear-gradient(180deg,${SEAM});}
.pair{display:flex;align-items:baseline;gap:0.37em}
.loc{position:relative;font-family:"NotoTC";font-weight:500;line-height:1.3;
  letter-spacing:.04em;white-space:nowrap;opacity:.72;color:${PAPER};padding-left:.37em}
.loc::before{content:"";position:absolute;left:0;top:.1em;bottom:.1em;
  border-left:1px solid rgba(${pr},${pg_},${pb},.28)}
.right{display:flex;align-items:center;gap:${(G_CLINIC_FS * 0.807).toFixed(1)}px}
.right svg{height:${(G_CLINIC_FS * 2.156 / 2.02918).toFixed(2)}px;
  width:${(G_CLINIC_FS * 2.156).toFixed(2)}px;display:block;
  filter:drop-shadow(0 2px 4px rgba(25,22,20,.5)) drop-shadow(0 0 8px rgba(25,22,20,.28))}
.clinic,.loc{text-shadow:0 2px 4px rgba(25,22,20,.5), 0 0 8px rgba(25,22,20,.28)}
.clinic{font-family:"NotoTC";font-weight:700;font-size:${G_CLINIC_FS}px;line-height:1.3;
  color:${PAPER};letter-spacing:.01em;white-space:nowrap}
.stack{display:inline-block;width:max-content}
.stack .clinic,.stack .loc{display:block;text-align:justify;text-align-last:justify}
.stack .loc{position:static;padding-left:0;font-size:${(G_CLINIC_FS * 0.774).toFixed(2)}px;
  line-height:1.3;letter-spacing:.04em;margin-top:0}
.stack .loc::before{display:none}
body.nojustify .stack .loc{text-align-last:right}
body.nojustify-clinic .stack .clinic{text-align-last:right}
/* ---- 下緣那三格（--stats）------------------------------------------------
   每一個值都是在 1200 寬的視窗上打開 index.html 量回來的（≥1041 那一段
   根字級 18px，和這張圖同寬，所以量到的 px 直接用）：
     .stats b       21.24px／700／字距 −.01em／行高 1.15／白 .95／**襯線**
     .stats b small 12.6px／400／字距 0／左邊 .15em／**黑體**
     .stats span    12.6px／400／字距 .18px／白 .65
     .stats li      左右內距各 72px（＝ 4rem）
     分隔線         1px、色 rgb(100,99,97)、上下貫穿整格
   ⚠ **數字是襯線、單位「年／位／個」是黑體** —— 站上 2026-08-08 定的，
     襯線只留給數字，兩層才分得開。照抄，不要圖方便全用黑體。
   ⚠ 底下那層柏油漸層是 .band::after 的同一組色停（rgba(34,30,28,0) →
     rgba(22,20,19,.88)），只是攤在這一條上。**顏色一個都沒有新挑。** */
.sband{position:absolute;left:0;right:0;bottom:0;height:${Math.round(SBAND_H * (1 + (SS - 1) * 0.6))}px;
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:${BAND_PAD}px;
  background-image:linear-gradient(180deg,
    rgba(34,30,28,0) 0%, rgba(34,30,28,.048) 14%, rgba(34,30,28,.167) 28%,
    rgba(31,27,25,.325) 42%, rgba(25,22,21,.502) 56%, rgba(22,20,19,.686) 70%,
    rgba(22,20,19,.810) 84%, rgba(22,20,19,.88) 100%)}
.stats{display:flex;list-style:none}
/* ⚠ 內距**不跟著字級等比例長**：72px 是站上 1200 寬時的留白，
     字放大 1.8 倍時內距也乘 1.8 會把三格推到畫面邊緣（實測會溢出）。
     取平方根當折衷，並在下面加一道量測擋住溢出。 */
.stats li{position:relative;padding-inline:${(72 * Math.sqrt(SS)).toFixed(1)}px;text-align:center}
.stats li + li::before{content:"";position:absolute;left:0;top:0;bottom:0;
  border-left:1px solid rgb(100,99,97)}
.stats b{display:block;font-family:"NumSerif","NotoTC",serif;font-weight:700;
  font-size:${(21.24 * SS).toFixed(2)}px;line-height:1.15;letter-spacing:-.01em;
  color:rgba(255,255,255,.95);font-variant-numeric:tabular-nums}
.stats b small{font-family:"NotoTC";font-weight:500;font-size:${(12.6 * SS).toFixed(2)}px;
  letter-spacing:0;margin-left:.15em}
.stats span{display:block;font-family:"NotoTC";font-weight:500;font-size:${(12.6 * SS).toFixed(2)}px;
  line-height:1;letter-spacing:${(0.18 * SS).toFixed(2)}px;color:rgba(255,255,255,.65);margin-top:${(5 * SS).toFixed(1)}px}
</style>
<img class="bg" src="${imgUri}">
${NOMARK ? "" : `<div class="mark">
  <span class="right">
    <svg viewBox="0 0 44.2873 21.8244" aria-hidden="true" style="color:${PAPER}">${logoInner}</svg>
    <span class="${LOCPOS === "stack" && LOC_TEXT ? "stack" : "pair"}">
      <span class="clinic">芳仁牙醫診所</span>
      ${LOC_TEXT ? `<span class="loc">${LOC_TEXT}</span>` : ""}
    </span>
  </span>
</div>`}
${STATS ? `<div class="${STATSPOS === "below" ? "sbelow" : "sband"}"><ul class="stats">${STATS_CELLS.map((c) =>
  `<li><b>${c.n}<small>${c.u}</small></b><span>${c.s}</span></li>`).join("")}</ul></div>` : ""}`;

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
/* below 模式：先把照片畫進 1200×PH 量最後一列的中位色，再組頁面。
   ⚠ 要量的是**畫進去之後**那一列，不是原檔的最後一列 —— 中間隔著一次 cover 縮放。 */
let PH = H, BH = 0, SEAM_STOPS = "";
if (STATS && STATSPOS === "below") {
  const blk = (21.24 * 1.15 + 5 + 12.6) * SS;
  BH = Math.round(blk + 52);
  PH = H - BH;
  const seam = await pg.evaluate(async ({ uri, W, PH }) => {
    const im = new Image(); im.src = uri; await im.decode();
    const c = document.createElement("canvas"); c.width = W; c.height = PH;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.imageSmoothingQuality = "high";
    /* 和頁面上 object-fit: cover 同一個裁法 */
    const s = Math.max(W / im.naturalWidth, PH / im.naturalHeight);
    const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    g.drawImage(im, (W - dw) / 2, (PH - dh) / 2, dw, dh);
    const d = g.getImageData(0, PH - 1, W, 1).data;
    const ch = [[], [], []];
    for (let i = 0; i < d.length; i += 4) { ch[0].push(d[i]); ch[1].push(d[i + 1]); ch[2].push(d[i + 2]); }
    return ch.map((a) => { a.sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; });
  }, { uri: imgUri, W, PH });
  const bot = [1, 3, 5].map((i) => parseInt(BAND_BOT.slice(i, i + 2), 16));
  const S = (x) => 3 * x * x - 2 * x * x * x;
  const stops = [];
  for (let i = 0; i <= 10; i++) {
    const p = i / 10, k = S(Math.pow(p, 1.6));
    const c = seam.map((v, j) => Math.round(v + k * (bot[j] - v)));
    stops.push(`rgb(${c.join(",")}) ${(p * 100).toFixed(0)}%`);
  }
  SEAM_STOPS = stops.join(", ");
  console.log(`接縫色（照片最後一列的中位數）rgb(${seam.join(",")}) → ${BAND_BOT}　帶高 ${BH}px・照片 ${PH}px`);
}
const plainHtml = plainHtmlOf(SEAM_STOPS, PH, BH);
await pg.setContent(STYLE === "glass" ? glassHtml : STYLE === "plain" ? plainHtml : html, { waitUntil: "load" });
await pg.evaluate(() => document.fonts.ready);
await pg.evaluate(() => Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {}))));

/* --locpos stack：量兩行的**自然寬**，算出 justify 會在每一格塞多少。
   ⚠ 量法是把那一行複製到畫面外、關掉 justify、寬度設成 max-content ——
     直接讀 scrollWidth 沒有用，那一行已經被撐滿了，讀回來的就是容器寬。
   門檻 0.15em ＝ 首頁那 0.076em 的兩倍，留一點餘裕但擋得住四個字的情形。 */
if ((STYLE === "glass" || (STYLE === "plain" && !NOMARK)) && LOCPOS === "stack" && LOC_TEXT) {
  const m = await pg.evaluate(() => {
    /* ⚠ 複本一定要掛在**原本那個父層底下**（2026-08-22 踩過）：
       掛到 document.body 上，`.stack .loc` 這種後代選擇器就不再命中，
       字級掉回 body 的 16px —— 量到的寬度是錯的（地名量成 139 而不是 193），
       算出來的撐開量因此偏大，門檻永遠過不了。 */
    const nat = (el) => {
      const c = el.cloneNode(true);
      c.style.cssText += ";position:absolute;left:-9999px;top:0;display:inline-block;width:max-content;text-align-last:auto;text-align:left";
      el.parentNode.appendChild(c);
      const w = c.getBoundingClientRect().width;
      c.remove();
      return w;
    };
    const one = (sel) => {
      const el = document.querySelector(sel);
      return { w: nat(el), gaps: el.textContent.trim().length - 1, fs: parseFloat(getComputedStyle(el).fontSize) };
    };
    return { clinic: one(".stack .clinic"), loc: one(".stack .loc") };
  });
  /* 被撐開的是**窄的那一行**，所以兩個方向都要看（首頁上被撐的其實是診所名）。 */
  const narrow = m.clinic.w < m.loc.w ? "clinic" : "loc";
  const extra = Math.abs(m.clinic.w - m.loc.w) / m[narrow].gaps / m[narrow].fs;
  console.log(`兩行自然寬：診所名 ${m.clinic.w.toFixed(1)} ・地名 ${m.loc.w.toFixed(1)}` +
              `　→ ${narrow === "loc" ? "地名" : "診所名"}每格要撐 ${extra.toFixed(3)}em（首頁是 0.076em）`);
  if (extra > 0.15) {
    await pg.evaluate((n) => document.body.classList.add(n === "loc" ? "nojustify" : "nojustify-clinic"), narrow);
    console.log("  ⚠ 超過 0.15em，那一行不 justify，改成靠右切齊（不然會變成一排孤字）");
  }
}

/* --stats：三格不能溢出畫面（字放大時最先出事的就是這裡）。 */
if (STATS) {
  const sb = await pg.evaluate(() => {
    const u = document.querySelector('.stats').getBoundingClientRect();
    const li = [...document.querySelectorAll('.stats li + li')].map((e) =>
      getComputedStyle(e, '::before').borderLeftWidth);
    return { w: u.width, left: u.left, right: u.right, rules: li };
  });
  console.log(`三格 ${sb.w.toFixed(0)}px（左 ${sb.left.toFixed(0)}・右 ${(W - sb.right).toFixed(0)}）　分隔線 ${sb.rules.join(' / ')}`);
  if (sb.left < BAND_PAD || W - sb.right < BAND_PAD) {
    console.error(`× 三格離畫面邊緣不到 ${BAND_PAD}px —— --statscale 調太大了。`);
    process.exit(1);
  }
  if (sb.rules.some((r) => parseFloat(r) < 0.5)) {
    console.error('× 三格之間的分隔線沒有畫出來。');
    process.exit(1);
  }
}

/* 驗一件：牌子有沒有壓到臉或手 —— 構圖時左下角就留成安靜區，
   這裡量牌子佔畫面多大，超過一半就是版面出事了。 */
const sel = STYLE === "glass" ? ".band" : STYLE === "plain" ? (NOMARK ? (STATSPOS === "below" ? ".sbelow" : ".sband") : ".mark") : ".plate";
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
console.log(`標示 ${box.w.toFixed(0)}×${box.h.toFixed(0)}（佔畫面寬 ${(100 * box.w / W).toFixed(1)}%・高 ${(100 * box.h / H).toFixed(1)}%）`);
console.log(`✓ ${path.relative(ROOT, out)}  ${W}×${H}  ${(fs.statSync(out).size / 1024).toFixed(1)}KB`);
