#!/usr/bin/env node
/* 〈隱形矯正〉那張圖的動態 → 可以直接貼到臉書的 MP4
 * ==========================================================================
 *   node drafts/card-video/card-video.mjs            兩個尺寸都出
 *   node drafts/card-video/card-video.mjs --only sq  只出方的
 *   node drafts/card-video/card-video.mjs --keep     保留逐格的 PNG（除錯用）
 *
 * 成品（**刻意不放在網站上**，同 drafts/door-notice —— 這是要貼到臉書的檔案）：
 *   drafts/card-video/out/aligner-1080x1080.mp4   方形，圖 ＋ 診所識別
 *   drafts/card-video/out/aligner-1080x602.mp4    16:9，原圖一個像素都沒加沒裁
 *
 * ⚠⚠⚠ **動畫的規格不在這一支裡。** 這一支把文章頁 posts/aligner-simulation/index.html
 *   <head> 那段 style#hero-fx-css **整段照抄**，連 .post-hero 的選擇器前綴都保留，
 *   所以頁面上那個 <figure> 也照抄 —— 規格只有一份，和 tools/card-motion.mjs 同一條紀律。
 *   在這裡另外調速度或幅度，兩邊遲早會不一樣。
 *
 * ⚠ 唯一一處**刻意和站上不同**：警告標示的週期 2 秒 → **1.7 秒**。
 *   理由是循環：驚嘆號 3.4 秒、警告標示 2 秒，兩者要對齊得剪到 **34 秒**
 *   （3.4 與 2 的最小公倍數），臉書上沒有人會看 34 秒。改成 1.7 秒之後
 *   剛好 2 個週期 ＝ 驚嘆號的 1 個週期 ＝ **3.4 秒完美無縫**。
 *   ⚠ 這個值**只屬於影片**，不要拿回去改站上那一份（那是使用者逐項挑過的）。
 *
 * ⚠⚠ 逐格是**凍出來的不是錄出來的**：整頁的動畫全部 pause，再逐格把
 *   `animation.currentTime` 設成那一格的時間。螢幕錄影會受排程與掉格影響，
 *   出來的循環對不齊（差幾毫秒，接點就會抖一下）。
 *   ⚠ 驚嘆號各自有 0.28 秒的錯開，而 Web Animations 的 currentTime **本來就含延遲**
 *     （進度 ＝ currentTime − delay），所以五顆設同一個值就自動錯開，不要自己減。
 *
 * ⚠ 字用的是 tools/fonts/ 那兩份**子集化過的** Noto Sans TC，只有
 *   tools/fonts/glyphs.txt 裡那些字（容器裡沒有中文字型，不嵌的話會掉到文泉驛正黑，
 *   和站上不是同一套）。所以圖上**只能寫那張表裡有的字** ——
 *   「隱形矯正」的「隱」「形」不在裡面，文章標題也不完整，
 *   這就是成品上寫的是「齒顎矯正」而不是文章標題的原因。要加字得先補 glyphs.txt
 *   再重跑 pyftsubset（見 tools/og-plate.mjs 檔頭）。
 *
 * ⚠ H.264 的 yuv420p 要求長寬都是偶數；16:9 那一版因此是 1080×602
 *   （原圖 2000×1114 ＝ 1.7953，1080 ÷ 1.7953 ＝ 601.6 → 602，差 0.07% 看不出來）。
 * ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(HERE, "out");
const TMP = path.join(HERE, ".frames");

const args = process.argv.slice(2);
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const KEEP = args.includes("--keep");

/* ---- 循環 ---------------------------------------------------------------
   3.4 秒 × 30 fps ＝ 102 格。**最後一格不畫**（t = 3.4 和 t = 0 是同一張，
   兩張都放進去的話播到接點會停一格）。 */
const FPS = 30;
const LOOP = 3.4;
const FRAMES = Math.round(LOOP * FPS);          // 102
const ERR_PERIOD = 1.7;                          // ⚠ 影片專用，見檔頭

/* ---- 版面（方形那一版）---------------------------------------------------
   底色、圓角、陰影、文字色一律從 assets/style.css 拿，不另外挑。
   ⚠ 版面刻意留白 —— 16:9 的圖塞進正方形，不是裁掉兩邊就是留白，
     而這張圖左邊有工程師、右邊有兩位同仁，裁掉兩邊等於把畫面的意思拿掉。 */
const SQ = {
  size: 1080,
  pad: 48,                 // 圖的左右留白
  markH: 62,
  gapMark: 22,
  nameFS: 46,
  gapName: 12,
  locFS: 25,
  gapTop: 58,              // 文字塊 → 圖
  gapBot: 54,              // 圖 → 標記
  tagFS: 27,
};

const TOKENS = {
  paper: "#e2e5e6",
  card: "#f4f4f5",
  ink: "#2a2c27",
  inkSoft: "#5c5f57",
  radius: 12,
  shadow: "0 1px 2px rgba(42,44,39,.07), 0 4px 10px rgba(42,44,39,.09)",
  brand: "#3f654a",        // 品牌真值（PALETTE 第一節）
  ortho: "#31637f",        // [data-spec="ortho"] --accent-deep，對紙 5.15
};

/* ---- 讀站上那三份原料 ---------------------------------------------------- */
const POST = path.join(ROOT, "posts", "aligner-simulation", "index.html");
const postHtml = fs.readFileSync(POST, "utf8");

const fxCss = (() => {
  const m = /<style id="hero-fx-css">([\s\S]*?)<\/style>/.exec(postHtml);
  if (!m) throw new Error("posts/aligner-simulation/index.html 的 <head> 裡找不到 style#hero-fx-css");
  return m[1];
})();

const heroFigure = (() => {
  const m = /<figure class="post-hero">[\s\S]*?<\/figure>/.exec(postHtml);
  if (!m) throw new Error("找不到 figure.post-hero");
  /* ⚠ 相對路徑往上兩層 → 換成容器裡的絕對檔案路徑（這一頁是用 file:// 開的）。
     ⚠ 同時把 sizes 換掉：站上那一串是給版面用的，這裡的圖是固定寬度，
       不換的話瀏覽器會照 100vw 去挑，挑到 800 那一張（1080 寬會糊）。 */
  return m[0]
    .replace(/\.\.\/\.\.\/assets\//g, `${path.join(ROOT, "assets")}/`)
    .replace(/sizes="[^"]*"/g, 'sizes="1080px"');
})();

/* ⚠ 驗一下真的換乾淨了 —— 漏一條的話那一張圖靜靜地不顯示（畫面只少一塊，不報錯）。 */
if (/\.\.\//.test(heroFigure)) throw new Error("heroFigure 還有沒換掉的相對路徑");
if (!/sizes="1080px"/.test(heroFigure)) throw new Error("sizes 沒有換成固定寬度");

const markSvg = fs.readFileSync(path.join(ROOT, "brand", "shapes", "mark.svg"), "utf8")
  .replace(/\swidth="[^"]*"/, "").replace(/\sheight="[^"]*"/, "");

const fontFace = (weight) => {
  const f = path.join(ROOT, "tools", "fonts", `NotoSansTC-${weight}-subset.woff2`);
  return `@font-face{font-family:"NotoTC";font-weight:${weight};font-display:block;` +
    `src:url(data:font/woff2;base64,${fs.readFileSync(f).toString("base64")}) format("woff2");}`;
};

/* ⚠ 圖上的每一個字都要在子集裡，不然那一個字會掉到系統字（文泉驛）而且不報錯。 */
const GLYPHS = new Set([...fs.readFileSync(path.join(ROOT, "tools", "fonts", "glyphs.txt"), "utf8")]);
const TEXT = { name: "芳仁牙醫診所", loc: "雲林・斗六", tag: "齒顎矯正" };
for (const [k, s] of Object.entries(TEXT)) {
  const miss = [...s].filter((c) => !GLYPHS.has(c));
  if (miss.length) throw new Error(`「${s}」(${k}) 有字不在 tools/fonts/glyphs.txt 裡：${miss.join("")}`);
}

/* ---- Chromium ------------------------------------------------------------ */
const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;   // ⚠ headless_shell 排在前面（DECISIONS.md 第九節第 18 條）
})();

const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) throw new Error("找不到 Playwright");

const FFMPEG = (() => {
  const c = [
    "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2",
    "/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg",
  ];
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 ffmpeg");
  return hit;
})();

/* ---- 頁面 ---------------------------------------------------------------- */
function html(kind) {
  const sq = kind === "sq";
  const W = 1080;
  const imgW = sq ? SQ.size - SQ.pad * 2 : W;
  const imgH = Math.round(imgW * 1114 / 2000);
  const H = sq ? SQ.size : (imgH % 2 ? imgH + 1 : imgH);

  /* 16:9 那一版是「原圖一個像素都沒加」，所以連圓角與陰影都不要 ——
     那兩樣是站上卡片的裝飾，貼到臉書上會變成圖裡畫著一個假的圓角。 */
  const plain = !sq;

  return `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8">
<style>
${fontFace(500)}
${fontFace(700)}
:root{ --radius:${plain ? 0 : TOKENS.radius}px;
  --shadow:${plain ? "none" : TOKENS.shadow};
  --paper:${TOKENS.paper}; --card:${TOKENS.card}; --ink:${TOKENS.ink}; --ink-soft:${TOKENS.inkSoft}; }
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${sq ? TOKENS.paper : "#000"}}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-family:"NotoTC",sans-serif;color:var(--ink)}

/* 站上那一段，一個字都沒有改（選擇器的 .post-hero 前綴也留著，所以下面照抄 figure）。 */
${fxCss}

/* ⚠ 影片專用的一處覆寫：見檔頭。寫在 fxCss **後面**才蓋得過。 */
.post-hero .hero-fx-err-in{ animation-duration:${ERR_PERIOD}s; }

/* ⚠ 全部凍住，逐格再用 currentTime 指定 —— 不凍的話截圖的時機是賭的。 */
*,*::before,*::after{ animation-play-state:paused !important; }

.post-hero{ width:${imgW}px; margin:0; }
.post-hero img{ display:block; width:100%; height:auto; }
${plain ? `.post-hero .hero-fx-wrap{ border-radius:0; box-shadow:none; }` : ``}

.id{ display:flex; flex-direction:column; align-items:center; }
.mark{ display:block; height:${SQ.markH}px; color:${TOKENS.brand}; }
.mark svg{ height:100%; width:auto; display:block; }
.name{ font-weight:700; font-size:${SQ.nameFS}px; line-height:1; letter-spacing:.02em;
  margin-top:${SQ.gapMark}px; }
.loc{ font-weight:500; font-size:${SQ.locFS}px; line-height:1; letter-spacing:.08em;
  color:var(--ink-soft); margin-top:${SQ.gapName}px; }
/* 標記照站上文章卡那一顆的做法：科別色的字 ＋ 同色淡底（PALETTE 六之二十二） */
.tag{ margin-top:${SQ.gapBot}px; font-weight:700; font-size:${SQ.tagFS}px; line-height:1;
  letter-spacing:.06em; color:${TOKENS.ortho};
  background:${TOKENS.ortho}22; border-radius:999px; padding:.52em 1.15em; }
.gapTop{ height:${SQ.gapTop}px }
</style></head><body>
${sq ? `<div class="id"><span class="mark">${markSvg}</span>
  <span class="name">${TEXT.name}</span><span class="loc">${TEXT.loc}</span></div>
<div class="gapTop"></div>` : ``}
${heroFigure}
${sq ? `<span class="tag">${TEXT.tag}</span>` : ``}
</body></html>`;
}

/* ---- 出一支 -------------------------------------------------------------- */
async function render(kind) {
  const sq = kind === "sq";
  const W = 1080;
  const imgW = sq ? SQ.size - SQ.pad * 2 : W;
  const imgH = Math.round(imgW * 1114 / 2000);
  const H = sq ? SQ.size : (imgH % 2 ? imgH + 1 : imgH);
  const name = `aligner-${W}x${H}`;

  const dir = path.join(TMP, kind);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  /* ⚠ 一定要寫成真的檔案再 goto，**不可以用 setContent** —— setContent 的文件網址是
     about:blank，那個來源載不到 file:// 的圖（症狀是兩張圖都 naturalWidth 0，
     截出來一片空白而且瀏覽器不會報錯）。 */
  const pageFile = path.join(dir, "page.html");
  fs.writeFileSync(pageFile, html(kind));
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(`file://${pageFile}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  /* 圖真的載進來了嗎 —— 沒載到的話截出來是一片空白，而且不報錯。 */
  const imgs = await page.evaluate(() =>
    [...document.images].map((i) => ({ w: i.naturalWidth, src: i.currentSrc.split("/").pop() })));
  if (imgs.length !== 2) throw new Error(`預期兩張圖（主圖 ＋ 疊層），實際 ${imgs.length}`);
  for (const i of imgs) if (i.w < 1080) throw new Error(`挑到的圖太小：${i.src} (${i.w}px)`);
  if (imgs[0].src !== imgs[1].src) throw new Error(`兩份圖不同檔：${imgs[0].src} / ${imgs[1].src}`);

  /* 動畫有沒有真的掛上去 —— 五顆驚嘆號 ＋ 一個警告標示 ＝ 6 */
  const nAnim = await page.evaluate(() => {
    document.getAnimations().forEach((a) => a.pause());
    return document.getAnimations().length;
  });
  if (nAnim !== 6) throw new Error(`預期 6 個動畫（5 驚嘆號 ＋ 1 警告標示），實際 ${nAnim}`);

  for (let f = 0; f < FRAMES; f++) {
    const t = (f / FPS) * 1000;
    /* ⚠ currentTime 本來就含 delay（進度 ＝ currentTime − delay），
       所以五顆設同一個值就自動錯開 0.28 秒，不要自己減。 */
    await page.evaluate((ms) => { document.getAnimations().forEach((a) => { a.currentTime = ms; }); }, t);
    await page.screenshot({ path: path.join(dir, `f${String(f).padStart(4, "0")}.png`) });
  }

  /* ---- 守門：接點真的看不出來嗎 ------------------------------------------
     算得出來不算數（第九節第 5 條：要量畫出來的東西）。再畫一格 t = 3.4 秒，
     它就是播完一輪之後接回去的那一格，**必須和第 0 格逐位元組相同**。
     ⚠ 這一道是這支腳本裡最強的一道：週期只要有一個不是 3.4 的因數，
       它就會抓到，而畫面上只會看到「每 3.4 秒抖一下」那種很難指認的毛病。 */
  await page.evaluate((ms) => { document.getAnimations().forEach((a) => { a.currentTime = ms; }); }, LOOP * 1000);
  const seam = await page.screenshot();
  const first = fs.readFileSync(path.join(dir, "f0000.png"));
  if (!seam.equals(first)) throw new Error(`接點對不上：t=${LOOP}s 那一格和第 0 格不同（週期沒有整除）`);

  /* ⚠ 反過來也要驗：每一格都一樣的話上面那一道也會過，而那是一支靜止的影片。 */
  const mid = fs.readFileSync(path.join(dir, `f${String(Math.round(FRAMES / 4)).padStart(4, "0")}.png`));
  if (mid.equals(first)) throw new Error("第 0 格和四分之一處完全相同 —— 動畫沒有真的在動");

  await page.close();

  fs.mkdirSync(OUT, { recursive: true });
  const mp4 = path.join(OUT, `${name}.mp4`);
  execFileSync(FFMPEG, [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS), "-i", path.join(dir, "f%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "18",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
    "-movflags", "+faststart", "-r", String(FPS),
    mp4,
  ]);
  if (!KEEP) fs.rmSync(dir, { recursive: true, force: true });

  const kb = (fs.statSync(mp4).size / 1024).toFixed(0);
  console.log(`  ${path.relative(ROOT, mp4)}  ${W}×${H}・${FRAMES} 格・${LOOP} 秒・${kb} KB`);
  return mp4;
}

const browser = await chromium.launch({ executablePath: chromePath });
console.log(`〈隱形矯正〉的動態 → MP4（${FPS}fps、${LOOP} 秒無縫循環）`);
const made = [];
for (const kind of ["sq", "wide"]) {
  if (ONLY && ONLY !== kind) continue;
  made.push(await render(kind));
}
await browser.close();
if (!KEEP) fs.rmSync(TMP, { recursive: true, force: true });
console.log("完成。");
