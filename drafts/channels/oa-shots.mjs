/* 把 drafts/line-oa/ 那三組卡的模擬圖搬進 preview/line-spec/（整合頁要引用）
 *   node drafts/channels/oa-shots.mjs        （--check 只驗不寫）
 *
 * ⚠⚠ **drafts/ 進不了 `_site`**（CLAUDE.md 第四節），所以整合頁引用不到
 *   `drafts/line-oa/preview-*.png`。這一支就是那一段路：**只搬，不重畫。**
 *   圖本身仍然由 `drafts/line-oa/flex-preview.mjs` 從那幾份 Flex JSON 產生 ——
 *   同 og-topic-card 那一輪的規矩：**提案頁要擺真的產出檔，不要用 CSS 再做一次**。
 *
 * ⚠ 搬的時候**等比例縮到「它自己的 CSS px 再乘 268/300」**：七科那張原檔 2.6MB，
 *   而 Worker 對 `/preview/*` 設 `no-store`（第九節第 23 條），每次開頁都要重載。
 *   縮完仍然是「一格一格看得清楚」的尺寸，因為整合頁本來就是**照 CSS px 原尺寸
 *   擺進一條 overflow-x 的捲軸裡**，不是縮圖。
 *   ⚠ 診所資訊那張是 DPR 3 的單張卡，縮成三分之一才會等於它的 CSS px。
 *
 * ⚠ 兩道守門：① 長寬比不可以跑掉（等比例縮小不該動）
 *              ② 縮完不可以整片空白（拿墨的比例當地標 —— 這幾張的底是黑的，
 *                 所以「墨」＝ 不是黑底的那些像素）
 * ⚠ 產圖一律用 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const CHECK = process.argv.includes("--check");
const OUT_DIR = path.join(ROOT, "preview", "line-spec");

/* 來源 → 成品，以及它是用 DPR 幾畫的（flex-preview 對 carousel 用 2、單張用 3）
   ⚠ 行政那兩張（預約協議／掛號與文件費用）2026-09-07 使用者指定拿掉，
     所以這裡沒有 admin —— `drafts/line-oa/admin-carousel-d.json` 與它的預覽都留著沒刪。 */
const JOBS = [
  { src: "preview-topics-carousel.png",   out: "shot-oa-topics.png",  dpr: 2 },
  { src: "preview-health-carousel-d.png", out: "shot-oa-health.png",  dpr: 2 },
  { src: "preview-clinic-info-flex.png",  out: "shot-oa-clinic.png",  dpr: 3 },
];

/* ⚠⚠ 再乘一次 268/300：`flex-preview.mjs` 的 mega bubble 畫的是 **300px**，
   而整合頁上其餘十三張都是病人手機上量到的 **268px**。不縮的話這三張的卡片
   比隔壁大 12%，在手機上讀起來就是「這幾張特別大」。 */
const CARD = 268 / 300;

const png = (f) => {
  const b = fs.readFileSync(f);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length, buf: b };
};

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (!fs.existsSync(chrome)) throw new Error("找不到 headless_shell —— 不要退回完整版 chrome（第九節第 18 條）");
const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();

const bad = [];
const rows = [];
for (const j of JOBS) {
  const srcPath = path.join(ROOT, "drafts", "line-oa", j.src);
  if (!fs.existsSync(srcPath)) { bad.push(`找不到來源 ${j.src} —— 先跑 drafts/line-oa/flex-preview.mjs`); continue; }
  const s = png(srcPath);
  const W = Math.round(s.w / j.dpr * CARD), H = Math.round(s.h / j.dpr * CARD);

  const r = await pg.evaluate(async ({ uri, W, H }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, W, H);
    /* 地標：這幾張的底是黑的，所以「有內容」＝ 不是黑底的像素佔多少 */
    const d = g.getImageData(0, 0, W, H).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 90) n++;
    return { ink: n / (W * H), png: c.toDataURL("image/png") };
  }, { uri: `data:image/png;base64,${s.buf.toString("base64")}`, W, H });

  if (Math.abs(s.w / s.h - W / H) > 0.01) bad.push(`${j.out}：長寬比跑掉了`);
  /* ⚠ 2026-09-07 從 1600 放寬到 4000：那兩條輪播改成「一列排開」了（flex-preview --row）。
     格狀版在手機上只看得到最左邊那一欄，廠商因此以為七科只有兩科；一列排開之後
     右邊被切一半的那一格就是「還有更多」的提示。上限只用來擋離譜的值。 */
  if (W > 4000) bad.push(`${j.out}：${W}px 太寬了 —— 整合頁上那一條捲軸會變成一整片`);
  if (r.ink < 0.10) bad.push(`${j.out}：縮完幾乎是空的（非黑底只有 ${(r.ink * 100).toFixed(1)}%）`);

  const buf = Buffer.from(r.png.split(",")[1], "base64");
  const outPath = path.join(OUT_DIR, j.out);
  if (CHECK) {
    if (!fs.existsSync(outPath)) bad.push(`${j.out}：還沒產出來`);
    else {
      const o = png(outPath);
      if (o.w !== W || o.h !== H) bad.push(`${j.out}：站上那份是 ${o.w}×${o.h}，應該是 ${W}×${H}`);
    }
  } else {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(outPath, buf);
  }
  rows.push(`  ${j.out.padEnd(20)} ${String(W).padStart(4)}×${String(H).padEnd(4)}  ${(buf.length / 1024).toFixed(0).padStart(4)}KB` +
    `　（原檔 ${s.w}×${s.h}　${(s.bytes / 1024).toFixed(0)}KB）`);
}
await browser.close();

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
console.log(rows.join("\n"));
console.log(CHECK ? `✓ ${rows.length} 張都在，尺寸對得上` : "✓ 已寫進 preview/line-spec/");
