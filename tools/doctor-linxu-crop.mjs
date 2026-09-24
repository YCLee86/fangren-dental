#!/usr/bin/env node
/* ==========================================================================
   林晏妤、許馨文兩位醫師・形象照的裁切器（提案期間用）
       drafts/doctor-photo/src/<lin-yanyu|xu-xinwen>.png
         →  preview/doctor-linxu/img/<lin|xu>-<a|b|c|d>-400.jpg
   --------------------------------------------------------------------------
   tools/doctor-photo-crop.mjs 的**提案期分身**（照 git show 482014fd:tools/doctor-yang-crop.mjs 改）：
   同樣的 400／0.82，只輸出到提案頁自己的資料夾。定案後把挑中那一格的框抄進
   doctor-photo-crop.mjs 的 FACES，這一支連同 doctor-linxu-preview.mjs 與
   preview/doctor-linxu/ 一起刪掉。

   2026-09-24 使用者給兩張：「黃襯衫是林晏妤醫師 紫襯衫是許馨文醫師 合上網站醫師圖卡」。
   尺的單位照廖立揚那一輪定下的：**頭高（髮頂到下巴）佔框高的比例**。

   許馨文（1086x1448）：髮頂 185／眼睛 490／下巴 775／臉中線 570（套格線量）
     位置照李柄輝的比例（眼睛在框高 44.2%、臉中線在框寬 49.3%），
     四格 71／74／77／81% —— 對應站上 陳芷鈴／楊小瑩／王俊偉／李柄輝。

   林晏妤（1051x1497）：帽頂 155／眼睛 580／下巴 960／臉中線 548
     ⚠⚠ 她戴著手術帽，**帽子很高**：眼睛落在頭高的 53%（別人約 52% 但頭髮服貼），
       照「眼睛 44.2%」定位的話，框一小於 1000 帽頂就被切掉。
       而且照片取景比較近 —— **整張寬 1051 當框就已經是最鬆的了**。
       所以她這一組改成「帽頂留白 4%」定上緣、臉中線照 49.3% 但不超出原圖。
       ⚠ 1051 那一格臉中線只能落在 52.1%（右偏約 2px／76px）—— 原圖的邊界，不是算錯。
       對照：1051 那一格「眼睛到下巴」佔框 36.2%，和許馨文 74% 那一格的 35.8% 幾乎一樣，
       也就是**臉的大小兩位對得上**，差的只是那頂帽子。

   跑法：node tools/doctor-linxu-crop.mjs [--check]
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "preview", "doctor-linxu", "img");

const XU  = { file: "xu-xinwen.png", src: [1086, 1448], hair: 185, eyes: 490, chin: 775, midX: 570 };
const LIN = { file: "lin-yanyu.png", src: [1051, 1497], hair: 155, eyes: 580, chin: 960, midX: 548 };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
/* 許馨文：照比例 r（頭高佔框高）算框，位置照李柄輝。 */
const xuBox = (r) => { const S = Math.round((XU.chin - XU.hair) / r);
  return [Math.round(XU.midX - 0.493 * S), Math.round(XU.eyes - 0.442 * S), S, S]; };
/* 林晏妤：框 S，上緣＝帽頂留白 4%，左右照臉中線 49.3% 但夾在原圖裡。 */
const linBox = (S) => [clamp(Math.round(LIN.midX - 0.493 * S), 0, LIN.src[0] - S),
  Math.round(LIN.hair - 0.04 * S), S, S];

export const JOBS = {
  "xu-a":  { p: XU,  sq: xuBox(0.71) },
  "xu-b":  { p: XU,  sq: xuBox(0.74) },
  "xu-c":  { p: XU,  sq: xuBox(0.77) },
  "xu-d":  { p: XU,  sq: xuBox(0.81) },
  "lin-a": { p: LIN, sq: linBox(1051) },
  "lin-b": { p: LIN, sq: linBox(1020) },
  "lin-c": { p: LIN, sq: linBox(990) },
  "lin-d": { p: LIN, sq: linBox(960) },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes("--check");
  const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
  let chromium = null;
  for (const p of pwPaths) { try { const m = await import(p); chromium = (m.default ?? m).chromium; if (chromium) break; } catch {} }
  if (!chromium) { console.error("× 找不到 playwright"); process.exit(1); }
  const exe = process.env.CHROME_PATH || ["/opt/pw-browsers/chromium", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  fs.mkdirSync(OUT, { recursive: true });
  for (const [k, j] of Object.entries(JOBS)) {
    const [x, y, w, h] = j.sq;
    const url = await page.evaluate(async (a) => {
      const img = new Image(); img.src = "data:image/png;base64," + a.b64; await img.decode();
      /* 守門一：原圖尺寸對得上。守門二：框不超出原圖（超出會補成黑邊，不會報錯）。 */
      if (img.naturalWidth !== a.sw || img.naturalHeight !== a.sh) return "ERR:原圖是 " + img.naturalWidth + "×" + img.naturalHeight;
      if (a.x < 0 || a.y < 0 || a.x + a.w > img.naturalWidth || a.y + a.h > img.naturalHeight) return "ERR:裁切框超出原圖";
      const c = document.createElement("canvas"); c.width = a.W; c.height = a.W;
      const g = c.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, a.W, a.W);
      return c.toDataURL("image/jpeg", a.q);
    }, { b64: fs.readFileSync(path.join(SRC, j.p.file)).toString("base64"), sw: j.p.src[0], sh: j.p.src[1], x, y, w, h, W: 400, q: 0.82 });
    if (url.startsWith("ERR:")) { console.error(`× ${k}：${url.slice(4)}　框 ${j.sq}`); process.exitCode = 1; continue; }
    const buf = Buffer.from(url.split(",")[1], "base64");
    const out = path.join(OUT, `${k}-400.jpg`);
    const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
    const top = ((j.p.hair - y) / w * 100).toFixed(1), hr = ((j.p.chin - j.p.hair) / w * 100).toFixed(0),
          eye = ((j.p.eyes - y) / w * 100).toFixed(1), mid = ((j.p.midX - x) / w * 100).toFixed(1);
    const info = `框 ${j.sq.join(",")}　頭頂留白 ${top}%　頭高 ${hr}%　眼睛 ${eye}%　臉中線 ${mid}%`;
    if (old && old.equals(buf)) { console.log(`  ＝ ${k}　${info}`); continue; }
    if (check) { console.log(`  ≠ ${k}　${info}`); continue; }
    fs.writeFileSync(out, buf); console.log(`  ✓ ${k}　${(buf.length / 1024).toFixed(1)}KB　${info}`);
  }
  await browser.close();
}
