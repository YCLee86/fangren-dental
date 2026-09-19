#!/usr/bin/env node
/* ==========================================================================
   醫師形象照的裁切器
       drafts/doctor-photo/src/<slug>.png  →  assets/doctor-<slug>-400.jpg
   --------------------------------------------------------------------------
   2026-09-19 定案上線（推導在 /history/doctor-photo.html）。
   站上的醫師卡用的是**圓頭像**：顯示 76px、正方形、border-radius 50%。
   400 是這樣來的：76 × DPR 3（使用者的 iPhone）＝ 228，取 400 留餘裕，
   一張 26~28KB，不值得為它做 srcset。

   ⚠⚠ **裁切框是逐張手量的，而且不能各裁各的** —— 九張要看起來像同一組。
     做法是先在原圖上量四個點（髮頂／眼睛／下巴／臉中線），再換算成
     李柄輝那張的比例（他是第一張，所以他就是基準）：

         眼睛在框高的 44.2%　臉中線在框寬的 49.3%　頭高佔框高 63%

     ⚠ **框的大小要照「頭寬」算，不要照「頭高」算。** 每個人的頭寬高比
       不一樣 —— 李侑津的臉窄，照頭高算出來是 651、照頭寬算是 591，
       用 651 的話他在圓裡會明顯比李柄輝小一號。算完再把兩三個候選
       和已經定案的那幾顆圓**並排**看一次（625 與 640 的臉都偏左，
       數字看起來很合理，並排才看得出來）。

   新增一位醫師要做的三件事：
     ① 原檔放 drafts/doctor-photo/src/<slug>.png（不會進 _site）
     ② 量四個點、照上面的比例算出框，加進底下的 FACES
     ③ node tools/doctor-photo-crop.mjs <slug>
        → 接著在 index.html 那張卡補 data-face 與 <picture>（見該處註解）
        → node tools/webp.mjs && node tools/topics.mjs && node tools/build.mjs

   跑法：
       node tools/doctor-photo-crop.mjs            # 全部重出
       node tools/doctor-photo-crop.mjs li-youjin  # 只出一位
       node tools/doctor-photo-crop.mjs --check    # 只比對，不寫檔
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "assets");

/* 四個量到的點只是推導的紀錄，程式用的是算完的 sq。
   留著是因為日後要換基準、或要重算某一張時，沒有它就得重量一次。 */
const FACES = {
  "li-binghui": { name: "李柄輝", src: [1145, 1374],
    marks: { hair: 175, eyes: 400, chin: 610, midX: 545 },
    sq: [205, 95, 690, 690] },
  "li-youjin":  { name: "李侑津", src: [1086, 1448],
    marks: { hair: 290, eyes: 520, chin: 700, midX: 540 },
    sq: [244, 255, 590, 590] },
  /* ⚠ 這一張把「照頭寬算」的極限講清楚了：他髮量高又蓬，目測的頭寬（350）
     算出 627，並排一看**頭比另外兩張滿一圈**，而且頭頂只剩 3.5% 的留白
     （李柄輝 11.6%、李侑津 5.9%）。627→660→690→724→760 五個圓排在一起，
     724 才對得上。**所以那條規則的真正意思是「算出來的是起點，並排看才是判準」**，
     頭髮蓬鬆的人目測頭寬一定會低估。724 的頭頂留白 9.0%，落在前兩張中間。 */
  "wang-junwei": { name: "王俊偉", src: [1122, 1402],
    marks: { hair: 145, eyes: 400, chin: 600, midX: 555 },
    sq: [198, 80, 724, 724] },
};

const WIDTH   = 400;
const QUALITY = 0.82;   /* 同 tools/hero-resize.mjs、tools/webp.mjs */

const args  = process.argv.slice(2);
const check = args.includes("--check");
const only  = args.find((a) => !a.startsWith("--"));
const jobs  = Object.entries(FACES).filter(([k]) => !only || k === only);
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

let wrote = 0, same = 0, diff = 0;
for (const [slug, face] of jobs) {
  const file = path.join(SRC, `${slug}.png`);
  if (!fs.existsSync(file)) {
    console.error(`× 找不到 ${path.relative(ROOT, file)}`); process.exitCode = 1; continue;
  }
  const [x, y, w, h] = face.sq;
  const url = await page.evaluate(async (a) => {
    const img = new Image();
    img.src = "data:image/png;base64," + a.b64;
    await img.decode();
    /* 守門一：原圖尺寸要和 FACES 記的一樣（換了檔卻沒改框的話，
       裁出來的位置會整個跑掉，而且畫面上只是「臉歪了」不會報錯）。 */
    if (img.naturalWidth !== a.sw || img.naturalHeight !== a.sh) {
      return "ERR:原圖是 " + img.naturalWidth + "×" + img.naturalHeight + "，FACES 記的是 " + a.sw + "×" + a.sh;
    }
    /* 守門二：裁切框不能超出原圖 —— drawImage 不會報錯，
       只會在邊緣補出透明，存成 JPEG 就是一條黑邊。 */
    if (a.x < 0 || a.y < 0 || a.x + a.w > img.naturalWidth || a.y + a.h > img.naturalHeight) {
      return "ERR:裁切框超出原圖";
    }
    const c = document.createElement("canvas");
    c.width = a.W; c.height = a.W;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, a.W, a.W);
    return c.toDataURL("image/jpeg", a.q);
  }, { b64: fs.readFileSync(file).toString("base64"), sw: face.src[0], sh: face.src[1],
       x, y, w, h, W: WIDTH, q: QUALITY });

  if (url.startsWith("ERR:")) { console.error(`× ${face.name}：${url.slice(4)}`); process.exitCode = 1; continue; }
  const buf = Buffer.from(url.split(",")[1], "base64");
  const out = path.join(OUT, `doctor-${slug}-${WIDTH}.jpg`);
  const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
  const hash = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 12);

  if (old && old.equals(buf)) { console.log(`  ＝ ${path.relative(ROOT, out)}（沒變）`); same++; continue; }
  if (check) { console.log(`  ≠ ${path.relative(ROOT, out)}　${old ? hash(old) : "（還沒有）"} → ${hash(buf)}`); diff++; continue; }
  fs.writeFileSync(out, buf);
  console.log(`  ✓ ${path.relative(ROOT, out)}  ${WIDTH}×${WIDTH}  ${(buf.length / 1024).toFixed(1)}KB`);
  wrote++;
}
await browser.close();

if (check) console.log(`(--check 模式，未寫入)　相同 ${same}、有差 ${diff}`);
else console.log(`${jobs.map(([, f]) => f.name).join("、")}：寫了 ${wrote} 個、${same} 個沒變`);
if (!check && wrote) console.log("⚠ 接著要跑：node tools/webp.mjs && node tools/topics.mjs && node tools/build.mjs");
