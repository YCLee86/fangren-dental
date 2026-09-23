#!/usr/bin/env node
/* ==========================================================================
   廖立揚醫師・四張候選的裁切器（提案期間用）
       drafts/doctor-photo/src/liao-liyang-<a|b|c|d>.png
         →  preview/doctor-liao/img/liao-<a|b|c|d>-400.jpg
   --------------------------------------------------------------------------
   這一支是 tools/doctor-photo-crop.mjs 的**提案期分身**：同樣的量法、
   同樣的比例、同樣的 400／0.82，只是輸出到提案頁自己的資料夾，
   不去碰 assets/。使用者挑定哪一張之後，把那一張的框抄進
   doctor-photo-crop.mjs 的 FACES（slug 用 liao-liyang），
   再跑那一支出正式檔 —— 這一支連同 tools/doctor-liao-preview.mjs
   與 preview/doctor-liao/ 一起刪掉。

   ⚠ 進版控是刻意的（同 map-pin 那一輪）：提案期間 main 可能被另一台推東西、
     提案頁的快照要重抓，放在暫存區會掉。

   ⚠⚠ 四張的框**不是各裁各的**，是照 doctor-photo-crop.mjs 檔頭那組比例算的：
       眼睛在框高的 44.2%、臉中線在框寬的 49.3%、頭高佔框高 63%，
       而且**框的大小照「頭寬」算不照「頭高」算**。算完四顆圓和站上那三顆
       （李柄輝、李侑津、王俊偉）並排比過 —— **四張的頭圍都對得上**，
       所以這一輪使用者要挑的是**表情與畫法**，不是幾何。

   ⚠ Ⓐ 和另外三張不是同一組出圖：Ⓐ 是 1024×1536、畫法最接近照片，
     Ⓑ Ⓒ Ⓓ 是 1122×1402（和王俊偉那張同一批）。

   跑法：
       node tools/doctor-liao-crop.mjs           # 四張全出
       node tools/doctor-liao-crop.mjs b         # 只出一張
       node tools/doctor-liao-crop.mjs --check   # 只比對，不寫檔
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-liao", "img");

/* marks 是在原圖上量到的四個點（髮頂／眼睛／下巴／臉中線），
   sq 是照上面那組比例算出來的框。留著 marks 是為了日後要重算時不必重量。 */
const FACES = {
  a: { src: [1024, 1536], marks: { hair: 140, eyes: 395, chin: 610, midX: 505 },
       sq: [161, 87, 698, 698], note: "露齒笑，畫法最接近照片（和另外三張不同組）" },
  b: { src: [1122, 1402], marks: { hair: 100, eyes: 355, chin: 560, midX: 540 },
       sq: [187, 38, 717, 717], note: "微笑不露齒" },
  c: { src: [1122, 1402], marks: { hair:  95, eyes: 355, chin: 560, midX: 540 },
       sq: [187, 38, 717, 717], note: "露齒笑" },
  d: { src: [1122, 1402], marks: { hair:  90, eyes: 380, chin: 600, midX: 525 },
       sq: [153, 46, 755, 755], note: "抿嘴笑，頭略大" },
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
  const file = path.join(SRC, `liao-liyang-${k}.png`);
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
  const out = path.join(OUT, `liao-${k}-${WIDTH}.jpg`);
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
else console.log(`廖立揚四張候選：寫了 ${wrote} 個、${same} 個沒變`);
if (!check && wrote) console.log("⚠ 接著要跑：node tools/doctor-liao-preview.mjs");
