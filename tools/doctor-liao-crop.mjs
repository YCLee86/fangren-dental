#!/usr/bin/env node
/* ==========================================================================
   廖立揚醫師・四張候選 × 四個頭圍的裁切器（提案期間用）
       drafts/doctor-photo/src/liao-liyang-<a|b|c|d>.png
         →  preview/doctor-liao/img/liao-<a|b|c|d>-<70|74|77|81>-400.jpg
   --------------------------------------------------------------------------
   這一支是 tools/doctor-photo-crop.mjs 的**提案期分身**：同樣的量法、
   同樣的比例、同樣的 400／0.82，只是輸出到提案頁自己的資料夾，不去碰 assets/。
   使用者挑定一格之後，把那一格的框抄進 doctor-photo-crop.mjs 的 FACES
   （slug 用 liao-liyang），再跑那一支出正式檔 —— 這一支連同
   tools/doctor-liao-preview.mjs 與 preview/doctor-liao/ 一起刪掉。

   ⚠ 進版控是刻意的（同 map-pin 那一輪）：提案期間 main 可能被另一台推東西、
     提案頁的快照要重抓，放在暫存區會掉。

   ── 2026-09-23 第二輪：**尺從「框幾 px」改成「頭高佔圓的比例」** ────────
   第一輪四張全部太小，使用者：「698好像還有點小　再大一點」。
   回頭量才知道問題不在數字而在**量錯了**：把四張和站上那三顆圓一起
   套格線讀出來的頭高佔比是

       李柄輝 690 → 81%　李侑津 590 → 81%　王俊偉 660 → 77%
       Ⓐ 698 → 70%　Ⓑ 717 → 69%　Ⓒ 717 → 70%　Ⓓ 755 → 73%

   —— 四張都比站上那三顆小一級，而第一輪記的 marks 也偏掉了
   （Ⓐ 的臉中線量成 505，實際約 495，臉因此偏左 2~3%）。

   ⚠⚠ **所以尺的單位改成「頭高佔圓的比例」，不是框的 px。**
       框的 px 沒辦法跨醫師比（四個人的原檔尺寸與取景都不一樣，
       王俊偉的 660 和廖立揚的 698 不是同一把尺上的兩格）；
       頭高佔比可以，而且 77%／81% 這兩格直接**等於站上那三位**。
       日後再加第十位，也照這個量法對，不要再回去比 px。

   ⚠ marks 是在**已經裁出來的 400px 成品**上套格線讀、再換算回原檔座標的
     （直接量原檔的頭頂與下巴容易差一截）。要重量就照這個做。

   ── 不變的部分 ──────────────────────────────────────────────────────────
   框的位置仍照 /history/doctor-photo.html 定下的兩個錨：
       眼睛在框高的 44.2%　臉中線在框寬的 49.3%
   變的只有框的大小。

   ⚠ Ⓐ 和另外三張不是同一組出圖：Ⓐ 是 1024×1536、畫法最接近照片，
     Ⓑ Ⓒ Ⓓ 是 1122×1402（和王俊偉那張同一批）。

   跑法：
       node tools/doctor-liao-crop.mjs           # 四張 × 四格 ＝ 16 張
       node tools/doctor-liao-crop.mjs b         # 只出 Ⓑ 那四格
       node tools/doctor-liao-crop.mjs --check   # 只比對，不寫檔
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-liao", "img");

/* 兩個錨（框的位置），同 tools/doctor-photo-crop.mjs */
const EYE_Y = 0.442;   /* 眼睛落在框高的幾分之幾 */
const MID_X = 0.493;   /* 臉中線落在框寬的幾分之幾 */

/* 尺：頭高佔圓的比例。70 ≈ 第一輪的現況，77／81 直接對齊站上那三位。 */
export const RATIOS = [
  { k: 70, note: "第一輪那一格（最鬆）" },
  { k: 74, note: "介於現況與王俊偉之間" },
  { k: 77, note: "和王俊偉一樣" },
  { k: 81, note: "和李柄輝、李侑津一樣（最滿）" },
];

/* marks 全部是原檔座標：髮頂／眼睛／下巴／臉中線。
   hair 與 chin 決定頭高，eyes 與 midX 決定框往哪擺。 */
export const FACES = {
  a: { src: [1024, 1536], marks: { hair: 143, eyes: 380, chin: 631, midX: 495 },
       note: "露齒笑，畫法最接近照片（和另外三張不同組）" },
  b: { src: [1122, 1402], marks: { hair: 110, eyes: 346, chin: 604, midX: 546 },
       note: "微笑不露齒" },
  c: { src: [1122, 1402], marks: { hair: 110, eyes: 346, chin: 612, midX: 546 },
       note: "露齒笑" },
  d: { src: [1122, 1402], marks: { hair:  99, eyes: 378, chin: 650, midX: 538 },
       note: "抿嘴笑，頭略大" },
};

const WIDTH   = 400;
const QUALITY = 0.82;   /* 同 tools/doctor-photo-crop.mjs */

/* 框＝頭高 ÷ 目標比例，位置由兩個錨回推。回 [x, y, s, s]。 */
export function box(marks, ratio) {
  const head = marks.chin - marks.hair;
  const s = Math.round(head / (ratio / 100));
  return [Math.round(marks.midX - MID_X * s), Math.round(marks.eyes - EYE_Y * s), s, s];
}

/* ⚠⚠ 底下是「直接跑這支」才要做的事，整段包在 main 守門裡面 ——
   tools/doctor-liao-preview.mjs 會 import 上面的 FACES／RATIOS／box()
   （框只算一次、兩支不會各記一份），**沒有守門的話光是 import 就會開瀏覽器**。 */
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
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
    const b64 = fs.readFileSync(file).toString("base64");
    console.log(`  ${k.toUpperCase()}　${face.note}`);
    for (const r of RATIOS) {
      const [x, y, w, h] = box(face.marks, r.k);
      const url = await page.evaluate(async (a) => {
        const img = new Image();
        img.src = "data:image/png;base64," + a.b64;
        await img.decode();
        /* 守門一：原圖尺寸要和 FACES 記的一樣（換了檔卻沒改 marks 的話，
           裁出來只是「臉歪了」，不會報錯）。 */
        if (img.naturalWidth !== a.sw || img.naturalHeight !== a.sh) {
          return "ERR:原圖是 " + img.naturalWidth + "×" + img.naturalHeight + "，FACES 記的是 " + a.sw + "×" + a.sh;
        }
        /* 守門二：裁切框不能超出原圖 —— drawImage 不報錯，只會補透明，
           存成 JPEG 就是一條黑邊。⚠ 尺往「頭更大」那一端走時框會縮，
           不會超出；往「頭更小」那一端走才會，所以這道要留著。 */
        if (a.x < 0 || a.y < 0 || a.x + a.w > img.naturalWidth || a.y + a.h > img.naturalHeight) {
          return "ERR:裁切框超出原圖";
        }
        const c = document.createElement("canvas");
        c.width = a.W; c.height = a.W;
        const g = c.getContext("2d");
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
        g.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, a.W, a.W);
        return c.toDataURL("image/jpeg", a.q);
      }, { b64, sw: face.src[0], sh: face.src[1], x, y, w, h, W: WIDTH, q: QUALITY });

      if (url.startsWith("ERR:")) { console.error(`  × ${k}/${r.k}：${url.slice(4)}`); process.exitCode = 1; continue; }
      const buf = Buffer.from(url.split(",")[1], "base64");
      const out = path.join(OUT, `liao-${k}-${r.k}-${WIDTH}.jpg`);
      const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
      const hash = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 12);
      const tag  = `${r.k}%　框 ${x},${y},${w},${h}`;

      if (old && old.equals(buf)) { console.log(`    ＝ ${tag}（沒變）`); same++; continue; }
      if (check) { console.log(`    ≠ ${tag}　${old ? hash(old) : "（還沒有）"} → ${hash(buf)}`); diff++; continue; }
      fs.writeFileSync(out, buf);
      console.log(`    ✓ ${tag}　${(buf.length / 1024).toFixed(1)}KB　${r.note}`);
      wrote++;
    }
  }
  await browser.close();

  if (check) console.log(`(--check 模式，未寫入)　相同 ${same}、有差 ${diff}`);
  else console.log(`廖立揚：寫了 ${wrote} 張、${same} 張沒變`);
  if (!check && wrote) console.log("⚠ 接著要跑：node tools/doctor-liao-preview.mjs");
}
