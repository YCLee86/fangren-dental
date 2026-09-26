/* 中秋節・臉書 Reel（9:16，1080×1920，30fps，約 20 秒，無聲）
   ---------------------------------------------------------------------------
   node drafts/mid-autumn/reel.mjs            → drafts/mid-autumn/reel.mp4 ＋ reel-sheet.jpg（關鍵影格）＋ reel-cover.jpg（封面）
   node drafts/mid-autumn/reel.mjs --sheet    → 只出關鍵影格，不出影片（調鏡頭時用）

   素材只有兩樣，都是已經定稿的：
   ・畫面：final.jpg（1200×896 的定稿插畫）。一個畫面都沒有另外畫。
   ・字：fb-post.md「✅ 文字定稿」那一段，使用者自己寫的，**逐字照抄，一個字都不改**
     （標點也不動 ——「自己、和重要的。」那個頓號是他的）。

   為什麼是一鏡到底不是字卡輪播：只有一張圖，切成幾張卡等於把同一張圖裁幾次；
   鏡頭沿著那條街走（門口 → 烤肉那一群 → 抬頭看月亮 → 退回整張），
   四句字各自落在它在講的那個地方：「今天，是月亮值班」那一句出現時，畫面上正是月亮。

   ⚠ 沒有配樂，刻意的：商業粉專用外面的音樂可能被靜音或擋下，
     音樂請在臉書 App 上傳時從內建曲庫挑（二手資料，Meta 的說明頁這個容器連不到）。
     影片仍然帶一條無聲的 AAC 音軌 —— 有些手機相簿遇到「沒有音軌的 MP4」會怪怪的。

   ⚠ 字放在畫面上半部：Reels 的底部約 1/3 會被說明文字與按鈕蓋住、右側是按讚那一排、
     最上面約 200px 是介面。所以字一律落在 y 300~560，左右各留 90px。

   環境（都不是 repo 的依賴，這支是 drafts/ 裡的一次性工具，不進 _site、npm run build 不會叫它）：
   ・Playwright 的 Chromium（雲端 session 內建）
   ・FFMPEG：要有 libx264 的 ffmpeg。Playwright 附的那一顆只有 VP8，出不了手機相簿吃的 MP4。
     雲端 session 裡：pip download imageio-ffmpeg --no-deps，解開 wheel 拿裡面那顆靜態執行檔。
   ・FONT_DIR：@fontsource/noto-sans-tc 解開後的 package/（npm pack 拿得到）。
     站上用的就是 Noto Sans TC；容器裡只有文泉驛，拿它出圖字形會和網站對不上。 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SHEET_ONLY = process.argv.includes("--sheet");
const FFMPEG = process.env.FFMPEG || "/tmp/claude-0/ffmpeg";
const FONT_DIR = process.env.FONT_DIR || "/tmp/claude-0/font/package";

const W = 1080, H = 1920, FPS = 30, DUR = 20;

/* 使用者的定稿（fb-post.md），逐字。守門在下面：每一句都要在那份檔裡找得到。 */
const LINES = [
  { t0: 0.6, t1: 4.6, text: "一年到頭都在忙，連假難得。" },
  { t0: 5.0, t1: 8.8, text: "好好睡，好好吃，好好過；" },
  { t0: 9.4, t1: 12.8, text: "今天，是月亮值班，" },
  { t0: 13.4, t1: 16.4, text: "把時間留給自己、和重要的。" },
];
const CLOSE = { t0: 16.9, text: "中秋佳節平安" };

/* 守門 ①：字一定要是定稿那一段裡的原句 —— 切出「✅ 文字定稿」那一段再比，不掃整份
   （整份裡有六輪的候選，掃整份等於沒掃）。 */
{
  const md = fs.readFileSync(path.join(HERE, "fb-post.md"), "utf8");
  const i = md.indexOf("## ✅ 文字定稿");
  const block = md.slice(i, md.indexOf("```", md.indexOf("```", i) + 3));
  if (i < 0) throw new Error("× fb-post.md 裡找不到「✅ 文字定稿」那一段");
  for (const s of [...LINES.map((l) => l.text), CLOSE.text]) {
    if (!block.includes(s)) throw new Error(`× 「${s}」不在定稿裡 —— 字要逐字照抄使用者的定稿`);
  }
}

/* 鏡頭：影像座標（1200×896）上的取景中心與取景高度。取景高度 = 896 就是「上下滿版」。
   mode "fit" ＝ 整張圖縮進畫面（寬 1080），上下露出模糊的底。 */
const CAM = [
  { t: 0.0, cx: 262, cy: 520, h: 740 },   // 診所門口：揮手的老夫妻、剝柚子的阿嬤
  { t: 4.6, cx: 470, cy: 448, h: 896 },
  { t: 8.6, cx: 770, cy: 448, h: 896 },   // 烤肉那一群：柚子帽、狗、仙女棒
  { t: 12.4, cx: 930, cy: 300, h: 600 },  // 抬頭：月亮
  { t: 16.0, fit: true },                  // 退回整張
  { t: DUR, fit: true },
];

const SRC = fs.readFileSync(path.join(HERE, "final.jpg")).toString("base64");
const MARK = fs.readFileSync(path.join(ROOT, "brand/shapes/mark.svg"), "utf8")
  .replace(/currentColor/g, "#f4f4f5");

const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) {
  try { const m = await import(p); ({ chromium } = m.default ?? m); if (chromium) break; } catch {}
}
if (!chromium) throw new Error("× 找不到 Playwright");
if (!fs.existsSync(path.join(FONT_DIR, "500.css"))) throw new Error(`× 找不到字型 ${FONT_DIR}/500.css（見檔頭）`);
if (!SHEET_ONLY && !fs.existsSync(FFMPEG)) throw new Error(`× 找不到 ffmpeg ${FFMPEG}（見檔頭）`);

const pageDir = fs.mkdtempSync("/tmp/claude-0/reel-");
fs.writeFileSync(path.join(pageDir, "index.html"), `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="file://${FONT_DIR}/500.css">
<link rel="stylesheet" href="file://${FONT_DIR}/700.css">
<body style="margin:0;background:#000"><canvas id="c" width="${W}" height="${H}"></canvas>`);

const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`file://${pageDir}/index.html`);

await page.evaluate(async ({ SRC, MARK, W, H, CAM, LINES, CLOSE, DUR }) => {
  const all = LINES.map((l) => l.text).join("") + CLOSE.text + "芳仁牙醫診所";
  await document.fonts.load(`500 60px "Noto Sans TC"`, all);
  await document.fonts.load(`700 60px "Noto Sans TC"`, all);
  if (!document.fonts.check(`500 60px "Noto Sans TC"`, all)) throw new Error("字型沒有載入");

  const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const img = await load("data:image/jpeg;base64," + SRC);
  const mark = await load("data:image/svg+xml;charset=utf-8," + encodeURIComponent(MARK));
  const IW = img.naturalWidth, IH = img.naturalHeight;

  const c = document.getElementById("c"), g = c.getContext("2d");
  g.imageSmoothingQuality = "high";

  /* 模糊的底只畫一次（每一格重畫 blur 太慢） */
  const bg = document.createElement("canvas"); bg.width = W; bg.height = H;
  { const b = bg.getContext("2d"); const s = H / IH;
    b.filter = "blur(28px) brightness(.42) saturate(1.1)";
    b.drawImage(img, (W - IW * s) / 2, 0, IW * s, IH * s); }

  const ease = (x) => 0.5 - Math.cos(Math.PI * x) / 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* 取景 → 「縮放倍率 s ＋ 影像的哪一點落在畫面的哪一點」。fit 模式整張圖寬 1080、放在畫面偏下 */
  /* 收尾那一格同時是**封面**：臉書的格狀縮圖會把 9:16 裁成正中央的方形（y 420~1500），
     所以標題、標誌與整張圖都要落在那一段裡 —— 圖放 y 694~1500、標題 510、標誌 612。 */
  const FIT = { s: W / IW, px: IW / 2, py: IH / 2, fy: 1097 };
  /* 滿版的時候，圖的下緣停在 STAGE（不是畫面底）：Reels 最下面那一段會被說明與按鈕蓋住，
     而這張圖的人全都在下緣那 1/3 —— 貼到畫面底的話人正好被蓋掉。STAGE 以下接一段暗色。 */
  const STAGE = 1560;
  const pose = (k) => k.fit ? FIT : { s: STAGE / k.h, px: k.cx, py: k.cy, fy: STAGE / 2 };
  const camAt = (t) => {
    let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1].t) i++;
    const a = CAM[i], b = CAM[i + 1], u = ease(clamp((t - a.t) / (b.t - a.t), 0, 1));
    const A = pose(a), B = pose(b);
    const s = Math.exp(Math.log(A.s) + (Math.log(B.s) - Math.log(A.s)) * u);
    let px = A.px + (B.px - A.px) * u, py = A.py + (B.py - A.py) * u;
    const fy = A.fy + (B.fy - A.fy) * u;
    /* 只要還是滿版，就不准露出圖外面 */
    const hw = W / 2 / s;
    if (hw * 2 <= IW) px = clamp(px, hw, IW - hw);
    const top = fy / s, bot = (STAGE - fy) / s;
    if (top + bot <= IH + 0.5) py = clamp(py, top, IH - bot);
    return { s, px, py, fy };
  };
  const alphaIn = (t, t0, t1, f = 0.45) => clamp(Math.min((t - t0) / f, (t1 - t) / f), 0, 1);

  const text = (s, y, size, a, weight = 500) => {
    if (a <= 0) return;
    g.save(); g.globalAlpha = a;
    g.font = `${weight} ${size}px "Noto Sans TC"`; g.textAlign = "center"; g.textBaseline = "middle";
    g.letterSpacing = `${size * 0.08}px`;
    g.shadowColor = "rgba(6,10,24,.75)"; g.shadowBlur = 18; g.shadowOffsetY = 2;
    g.fillStyle = "#f4f4f5";
    g.fillText(s, W / 2 + size * 0.04, y + (1 - a) * 10);
    g.restore();
  };

  window.frame = (t) => {
    const { s, px, py, fy } = camAt(t);
    g.drawImage(bg, 0, 0);
    const dx = W / 2 - px * s, dy = fy - py * s;
    g.drawImage(img, dx, dy, IW * s, IH * s);
    /* 圖的下緣淡進底色，不要一條硬邊 */
    const edge = dy + IH * s;
    if (edge < H) {
      const eg = g.createLinearGradient(0, edge - 220, 0, edge + 2);
      eg.addColorStop(0, "rgba(9,11,20,0)"); eg.addColorStop(1, "rgba(9,11,20,.92)");
      g.fillStyle = eg; g.fillRect(0, edge - 220, W, 222);
      g.fillStyle = "rgba(9,11,20,.55)"; g.fillRect(0, edge, W, H - edge);
    }

    /* 上緣的夜色漸層：字壓在診所那面淺灰牆上時撐得住 */
    const gr = g.createLinearGradient(0, 0, 0, 820);
    gr.addColorStop(0, "rgba(10,14,32,.72)"); gr.addColorStop(0.55, "rgba(10,14,32,.38)"); gr.addColorStop(1, "rgba(10,14,32,0)");
    g.fillStyle = gr; g.fillRect(0, 0, W, 820);

    for (const l of LINES) text(l.text, 430, 62, alphaIn(t, l.t0, l.t1));

    /* 收尾：中秋佳節平安 ＋ 標誌與診所名 */
    const a = clamp((t - CLOSE.t0) / 0.6, 0, 1);
    if (a > 0) {
      text(CLOSE.text, 510, 76, a, 700);
      g.save(); g.globalAlpha = clamp((t - CLOSE.t0 - 0.5) / 0.6, 0, 1);
      const mw = 88, mh = mw * 21.834 / 44.304, label = "芳仁牙醫診所";
      g.font = `500 40px "Noto Sans TC"`; g.letterSpacing = "4px";
      const tw = g.measureText(label).width, gap = 18, x0 = (W - mw - gap - tw) / 2, y = 612;
      g.shadowColor = "rgba(6,10,24,.7)"; g.shadowBlur = 14;
      g.drawImage(mark, x0, y - mh / 2, mw, mh);
      g.fillStyle = "#f4f4f5"; g.textBaseline = "middle"; g.textAlign = "left";
      g.fillText(label, x0 + mw + gap, y + 1);
      g.restore();
    }
    /* 頭尾各淡入淡出一點 */
    const fade = clamp(Math.min(t / 0.4, (DUR - t) / 0.5), 0, 1);
    if (fade < 1) { g.fillStyle = `rgba(0,0,0,${1 - fade})`; g.fillRect(0, 0, W, H); }
    return c.toDataURL("image/jpeg", 0.94);
  };
}, { SRC, MARK, W, H, CAM, LINES, CLOSE, DUR });

/* 關鍵影格：一張 5 格的總覽，給人在手機上一眼看完鏡頭走到哪裡 */
{
  const keys = [2.6, 6.9, 11.1, 14.9, 19.0];
  const shots = [];
  for (const t of keys) shots.push(await page.evaluate((t) => window.frame(t), t));
  const sheet = await page.evaluate(async (shots) => {
    const w = 360, h = 640, pad = 16;
    const c = document.createElement("canvas"); c.width = shots.length * (w + pad) + pad; c.height = h + pad * 2;
    const g = c.getContext("2d"); g.fillStyle = "#17191d"; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < shots.length; i++) {
      const im = await new Promise((ok) => { const x = new Image(); x.onload = () => ok(x); x.src = shots[i]; });
      g.drawImage(im, pad + i * (w + pad), pad, w, h);
    }
    return c.toDataURL("image/jpeg", 0.88);
  }, shots);
  fs.writeFileSync(path.join(HERE, "reel-sheet.jpg"), Buffer.from(sheet.split(",")[1], "base64"));
  console.log("✓ drafts/mid-autumn/reel-sheet.jpg");
  /* 封面：影片最後那一格，單獨存一張，上傳時「從相簿選封面」用 */
  const cover = await page.evaluate((t) => window.frame(t), 19.2);
  fs.writeFileSync(path.join(HERE, "reel-cover.jpg"), Buffer.from(cover.split(",")[1], "base64"));
  console.log("✓ drafts/mid-autumn/reel-cover.jpg");
}

if (!SHEET_ONLY) {
  const out = path.join(HERE, "reel.mp4");
  const ff = spawn(FFMPEG, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-map", "0:v", "-map", "1:a", "-shortest",
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "slow",
    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((ok, no) => ff.on("close", (code) => code === 0 ? ok() : no(new Error("ffmpeg " + code))));
  const N = DUR * FPS;
  for (let i = 0; i < N; i++) {
    const url = await page.evaluate((t) => window.frame(t), i / FPS);
    if (!ff.stdin.write(Buffer.from(url.split(",")[1], "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stdout.write(`\r影格 ${i}/${N}`);
  }
  ff.stdin.end(); await done;
  console.log(`\r✓ drafts/mid-autumn/reel.mp4（${(fs.statSync(out).size / 1e6).toFixed(1)} MB）`);
}
await browser.close();
fs.rmSync(pageDir, { recursive: true, force: true });
