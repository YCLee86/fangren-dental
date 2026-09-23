#!/usr/bin/env node
/* ==========================================================================
   陳芷鈴醫師・形象照的裁切器（提案期間用）
       drafts/doctor-photo/src/chen-zhiling.png
         →  preview/doctor-chen/img/chen-<a|b|c|d>-400.jpg
   --------------------------------------------------------------------------
   tools/doctor-photo-crop.mjs 的**提案期分身**（同 doctor-liao-crop.mjs）：
   同樣的量法、同樣的比例、同樣的 400／0.82，只輸出到提案頁自己的資料夾。
   使用者挑定哪一格之後，把那一格的框抄進 doctor-photo-crop.mjs 的 FACES
   （slug 用 chen-zhiling），再跑那一支出正式檔 —— 這一支連同
   tools/doctor-chen-preview.mjs 與 preview/doctor-chen/ 一起刪掉。

   只有一張照片，所以要挑的是**框的大小**（頭在圓裡多滿）：
     原圖 1122x1402，量到 髮頂 140／眼睛 371／下巴 578／臉中線 528
     照李柄輝的比例（眼睛在框高 44.2%、臉中線在框寬 49.3%）定位置。
     大小照謝耀慶那一輪留下的話：**起點直接從頭頂留白 ~5% 給**
     （王俊偉、謝耀慶兩輪都是往「更滿」改，照 63% 算出來的框一定偏鬆），
     所以 Ⓒ 590 是預設，兩側各給一格以上。

   跑法：
       node tools/doctor-chen-crop.mjs           # 全出
       node tools/doctor-chen-crop.mjs b         # 只出一格
       node tools/doctor-chen-crop.mjs --check   # 只比對，不寫檔
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-chen", "img");

/* marks 是在原圖上量到的四個點（髮頂／眼睛／下巴／臉中線），
   sq 是照上面那組比例算出來的框。留著 marks 是為了日後要重算時不必重量。 */
const MARKS = { hair: 140, eyes: 371, chin: 578, midX: 528 };
const box = (S) => [Math.round(MARKS.midX - 0.493 * S), Math.round(MARKS.eyes - 0.442 * S), S, S];
const FACES = {
  a: { src: [1122, 1402], sq: box(640), note: "框 640，頭頂留白 8.1%、頭高 68%" },
  b: { src: [1122, 1402], sq: box(615), note: "框 615，頭頂留白 6.7%、頭高 71%" },
  c: { src: [1122, 1402], sq: box(590), note: "框 590，頭頂留白 5.1%、頭高 74%" },
  d: { src: [1122, 1402], sq: box(565), note: "框 565，頭頂留白 3.4%、頭高 78%" },
};

const WIDTH   = 400;
const QUALITY = 0.82;   /* 同 tools/doctor-photo-crop.mjs */

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
if (!chromium) { console.error("× 找不到 playwright"); process.exit(1); }

const exe = process.env.CHROME_PATH
  || ["/opt/pw-browsers/chromium", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage();

fs.mkdirSync(OUT, { recursive: true });
let wrote = 0, same = 0, diff = 0;
for (const [k, face] of jobs) {
  const file = path.join(SRC, "chen-zhiling.png");
  if (!fs.existsSync(file)) {
    console.error(`× 找不到 ${path.relative(ROOT, file)}`); process.exitCode = 1; continue;
  }
  const [x, y, w, h] = face.sq;
  const url = await page.evaluate(async (a) => {
    const img = new Image();
    img.src = "data:image/png;base64," + a.b64;
    await img.decode();
    /* 守門一：原圖尺寸要和 FACES 記的一樣（換了檔卻沒改框的話，
       裁出來只是「臉歪了」，不會報錯）。 */
    if (img.naturalWidth !== a.sw || img.naturalHeight !== a.sh) {
      return "ERR:原圖是 " + img.naturalWidth + "×" + img.naturalHeight + "，FACES 記的是 " + a.sw + "×" + a.sh;
    }
    /* 守門二：裁切框不能超出原圖 —— drawImage 不報錯，只會補透明，
       存成 JPEG 就是一條黑邊。 */
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

  if (url.startsWith("ERR:")) { console.error(`× ${k}：${url.slice(4)}`); process.exitCode = 1; continue; }
  const buf = Buffer.from(url.split(",")[1], "base64");
  const out = path.join(OUT, `chen-${k}-${WIDTH}.jpg`);
  const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
  const hash = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 12);

  if (old && old.equals(buf)) { console.log(`  ＝ ${path.relative(ROOT, out)}（沒變）`); same++; continue; }
  if (check) { console.log(`  ≠ ${path.relative(ROOT, out)}　${old ? hash(old) : "（還沒有）"} → ${hash(buf)}`); diff++; continue; }
  fs.writeFileSync(out, buf);
  console.log(`  ✓ ${path.relative(ROOT, out)}  ${WIDTH}×${WIDTH}  ${(buf.length / 1024).toFixed(1)}KB　${face.note}`);
  wrote++;
}
await browser.close();

if (check) console.log(`(--check 模式，未寫入)　相同 ${same}、有差 ${diff}`);
else console.log(`陳芷鈴各格：寫了 ${wrote} 個、${same} 個沒變`);
if (!check && wrote) console.log("⚠ 接著要跑：node tools/doctor-chen-preview.mjs");
