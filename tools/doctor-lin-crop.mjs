#!/usr/bin/env node
/* ==========================================================================
   林晏妤醫師・形象照的裁切器（提案期間用）
       drafts/doctor-photo/src/lin-yanyu-2.png
         →  preview/doctor-lin/img/lin-<a|b|c|d>-400.jpg
   --------------------------------------------------------------------------
   tools/doctor-photo-crop.mjs 的**提案期分身**（照 git show 482014fd:tools/doctor-yang-crop.mjs 改）。
   定案後把挑中那一格的框抄進 doctor-photo-crop.mjs 的 FACES（slug 用 lin-yanyu，
   新原檔蓋掉 src/lin-yanyu.png），這一支連同 doctor-lin-preview.mjs 與
   preview/doctor-lin/ 一起刪掉。

   2026-09-24 第二輪：第一張（框 1051）上線同日，使用者「林晏妤換這張 做預覽給我看」。
   新照片 1051x1497，取景和第一張幾乎一樣（背景換成冷灰的診間）：
     帽頂 150／眼睛 580／下巴 965／臉中線 548（套格線量）
   做法同第一張（見 doctor-photo-crop.mjs 那一段）：帽子高、取景近，
   **整張寬 1051 就是最鬆的一格**；上緣用「帽頂留白 4%」定、臉中線 49.3% 但夾在原圖裡。
     Ⓐ 1051（預設，和第一張同框）Ⓑ 1020 Ⓒ 990 Ⓓ 960

   跑法：node tools/doctor-lin-crop.mjs [a|b|c|d] [--check]
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-lin", "img");

/* marks 是在原圖上量到的四個點（hair 記的是帽頂），sq 是算出來的框。 */
const MARKS = { hair: 150, eyes: 580, chin: 965, midX: 548 };
const SRCWH = [1051, 1497];
const box = (S) => [Math.max(0, Math.min(SRCWH[0] - S, Math.round(MARKS.midX - 0.493 * S))),
  Math.round(MARKS.hair - 0.04 * S), S, S];
const FACES = { a: { src: SRCWH, sq: box(1051) }, b: { src: SRCWH, sq: box(1020) },
                c: { src: SRCWH, sq: box(990) },  d: { src: SRCWH, sq: box(960) } };
export const INFO = Object.fromEntries(Object.entries(FACES).map(([k, f]) => { const [x, y, w] = f.sq;
  return [k, "框 " + f.sq.join(",") + "　帽頂留白 " + ((MARKS.hair - y) / w * 100).toFixed(1) + "%、頭高 " +
    ((MARKS.chin - MARKS.hair) / w * 100).toFixed(0) + "%、眼睛 " + ((MARKS.eyes - y) / w * 100).toFixed(1) +
    "%、臉中線 " + ((MARKS.midX - x) / w * 100).toFixed(1) + "%"]; }));
if (import.meta.url !== `file://${process.argv[1]}`) { /* 被產生器匯入時只給 INFO */ }
else {
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
  const file = path.join(SRC, "lin-yanyu-2.png");
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
  const out = path.join(OUT, `lin-${k}-${WIDTH}.jpg`);
  const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
  const hash = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 12);

  if (old && old.equals(buf)) { console.log(`  ＝ ${path.relative(ROOT, out)}（沒變）`); same++; continue; }
  if (check) { console.log(`  ≠ ${path.relative(ROOT, out)}　${old ? hash(old) : "（還沒有）"} → ${hash(buf)}`); diff++; continue; }
  fs.writeFileSync(out, buf);
  console.log(`  ✓ ${path.relative(ROOT, out)}  ${WIDTH}×${WIDTH}  ${(buf.length / 1024).toFixed(1)}KB　${INFO[k]}`);
  wrote++;
}
await browser.close();

if (check) console.log(`(--check 模式，未寫入)　相同 ${same}、有差 ${diff}`);
else console.log(`林晏妤各格：寫了 ${wrote} 個、${same} 個沒變`);
if (!check && wrote) console.log("⚠ 接著要跑：node tools/doctor-lin-preview.mjs");
}
