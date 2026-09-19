#!/usr/bin/env node
/* ==========================================================================
   醫師形象圖的裁切器 —— drafts/doctor-photo/src/<name>.png
                        → preview/doctor-photo/img/<name>-{sq,wide,tall}-<w>.jpg
   --------------------------------------------------------------------------
   起因：2026-09-19 使用者給了李柄輝醫師的形象圖照（1145×1374，5:6），
   問「可以怎麼跟現有的醫師圖卡結合」。提案頁要在同一張卡上比三種放法
   （圓頭像／卡片頂圖／創辦醫師橫幅），三種要的裁切不一樣，所以裁一次出三份。

   ⚠ 這一支**不是** tools/hero-resize.mjs 的替代品。那一支管的是文章 HERO
     （16:9 與 4:3 的橫幅、要擋烘進去的白框），這裡的來源是直式人像、
     而且三個輸出的比例各自不同，兩邊的守門完全不一樣。

   ⚠ 裁切框是**逐張手量的**，寫在底下的 FACES 裡。換一位醫師就在那裡加一筆，
     不要想用人臉偵測自動算 —— 這一站沒有 npm 依賴，而且九張手量一次就好。

   跑法：
       node tools/doctor-photo-crop.mjs            # 全部重出
       node tools/doctor-photo-crop.mjs li-binghui # 只出一位
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-photo", "img");

/* ── 每一位的裁切框（來源圖的像素座標）──────────────────────────────────
   sq   ＝ 圓頭像。正方形，髮頂上面要留一點，圓形切掉四角之後才不會頂到。
   wide ＝ 卡片頂圖。3:2，頭肩＋一點診間。
   tall ＝ 橫幅用的直式。5:6，這一張原圖剛好就是 5:6，整張不裁。
   ⚠ sq 與 wide 的中心要對得上（同一張臉在三個版本裡不能偏來偏去）。 */
/* ⚠⚠ 兩張要看起來像**同一組**，裁切框不能各裁各的 —— 先在原圖上量
     髮頂／眼睛／下巴／臉中線，再換算成同一組比例（拿李柄輝那張當基準）：
       眼睛在框高的 44.2%、臉中線在框寬的 49.3%、頭高佔框高 63%
     李柄輝 1145×1374：髮頂 175、眼睛 400、下巴 610、臉中線 545
     李侑津 1086×1448：髮頂 290、眼睛 520、下巴 700、臉中線 540
     ⚠ 兩人的頭「寬高比」不一樣（李侑津的臉窄），照頭高算出來的框
       （651）會讓他的臉在圓裡看起來比較小、照頭寬算（591）才對得上。
       590 是三個候選圓在一起比出來的 —— 625 與 640 的臉都偏左。 */
const FACES = {
  "li-binghui": {
    name: "李柄輝",
    sq:   [205,  95,  690,  690],
    wide: [  0,  90, 1145,  763],
    tall: [  0,   0, 1145, 1374],
  },
  "li-youjin": {
    name: "李侑津",
    sq:   [244, 255,  590,  590],
    wide: [  0, 210, 1086,  724],
    tall: [  0, 125, 1086, 1303],
  },
};

/* 每一種要出的寬度（1x 與 2x）。卡片在電腦版 389、手機 343，所以 400/800 夠用；
   圓頭像 2026-09-19 從 200 改成 400：那一輪使用者選了 76px，他手機的 DPR 是 3，
   需要 228 —— 面板當場就印出紅字「200 不夠」。階往上加到 88 之後需要 264，
   一張 400 全部蓋得住（30KB，不值得為它做 srcset）。 */
const WIDTHS = { sq: [400], wide: [400, 800], tall: [400, 800] };
const QUALITY = 0.82;   /* 和 tools/hero-resize.mjs、tools/webp.mjs 同一個值 */

const only = process.argv[2];
const jobs = Object.entries(FACES).filter(([k]) => !only || k === only);
if (!jobs.length) { console.error(`× FACES 裡沒有 ${only}`); process.exit(1); }

const pwPaths = [process.env.PLAYWRIGHT_MODULE,
  "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) {
  try { const m = await import(p); chromium = (m.default ?? m).chromium; if (chromium) break; } catch {}
}
if (!chromium) { console.error("× 找不到 playwright（或 tools/chrome-cdp.mjs）"); process.exit(1); }

const exe = process.env.CHROME_PATH
  || ["/opt/pw-browsers/chromium", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage();

fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const [slug, face] of jobs) {
  const file = path.join(SRC, `${slug}.png`);
  if (!fs.existsSync(file)) { console.error(`× 找不到 ${path.relative(ROOT, file)}`); process.exitCode = 1; continue; }
  const b64 = fs.readFileSync(file).toString("base64");

  for (const kind of ["sq", "wide", "tall"]) {
    const [x, y, w, h] = face[kind];
    for (const W of WIDTHS[kind]) {
      const H = Math.round(W * h / w);
      const url = await page.evaluate(async (a) => {
        const img = new Image();
        img.src = "data:image/png;base64," + a.b64;
        await img.decode();
        /* ⚠ 守門：裁切框不能超出原圖，超出的話 drawImage 不會報錯，
           只會在邊緣補出透明（存成 JPEG 就是一條黑邊）。 */
        if (a.x < 0 || a.y < 0 || a.x + a.w > img.naturalWidth || a.y + a.h > img.naturalHeight) {
          return "ERR:裁切框超出原圖 " + img.naturalWidth + "×" + img.naturalHeight;
        }
        const c = document.createElement("canvas");
        c.width = a.W; c.height = a.H;
        const g = c.getContext("2d");
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
        g.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, a.W, a.H);
        return c.toDataURL("image/jpeg", a.q);
      }, { b64, x, y, w, h, W, H, q: QUALITY });
      if (url.startsWith("ERR:")) { console.error(`× ${slug} ${kind}：${url.slice(4)}`); process.exitCode = 1; continue; }
      const out = path.join(OUT, `${slug}-${kind}-${W}.jpg`);
      fs.writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
      console.log(`  ${path.relative(ROOT, out)}  ${W}×${H}  ${(fs.statSync(out).size / 1024).toFixed(1)}KB`);
      n++;
    }
  }
}
await browser.close();
console.log(`${jobs.map(([, f]) => f.name).join("、")}：共 ${n} 個檔`);
