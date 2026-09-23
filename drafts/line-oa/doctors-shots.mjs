/* 醫師介紹那組卡 → 規格頁 preview/line-doctors/ 用的逐張截圖（2026-09-23）
 *
 * ⚠ 圖是從 doctors-carousel.json 畫的（import flex-preview.mjs 的 bubbleHtml），不另外寫 CSS。
 * ⚠ 九張放在同一列一起畫，再逐張截 —— carousel 在 LINE 上會齊高，
 *   各畫各的話短卡會比實際矮（flex-preview.mjs 那段註解）。
 *
 * 用法：node drafts/line-oa/doctors-carousel.mjs && node drafts/line-oa/doctors-shots.mjs
 * 另外把現況截圖縮成 now-*.png：node drafts/line-oa/doctors-shots.mjs --now <png>…
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bubbleHtml } from "./flex-preview.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "preview/line-doctors");
fs.mkdirSync(OUT, { recursive: true });

const pw = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default;
const exe = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (!fs.existsSync(exe)) throw new Error("找不到 headless_shell");
const browser = await pw.chromium.launch({ executablePath: exe });
const page = await browser.newPage({ deviceScaleFactor: 3 });

const nowArgs = process.argv.slice(process.argv.indexOf("--now") + 1);
if (process.argv.includes("--now")) {
  /* 使用者給的 LINE 截圖（924 寬）→ 390 寬，規格頁只拿來對照 */
  for (const [i, f] of nowArgs.entries()) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("file://" + path.resolve(f));
    await page.addStyleTag({ content: "html,body{margin:0}img{width:390px;height:auto;display:block}" });
    await page.locator("img").screenshot({ path: path.join(OUT, `now-${i + 1}.png`), scale: "css" });
  }
} else {
  const doc = JSON.parse(fs.readFileSync(path.join(HERE, "doctors-carousel.json"), "utf8"));
  const html = `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;background:#1c1c1e;font-family:"Noto Sans TC",system-ui,sans-serif}
    .row{display:inline-flex;gap:8px;padding:4px;align-items:stretch}
    .bub{display:flex}</style>
    <div class="row">${doc.contents.map((b) => `<div class="bub">${bubbleHtml(b)}</div>`).join("")}</div>`;
  const tmp = path.join(HERE, ".doctors-shots.html");
  fs.writeFileSync(tmp, html);
  await page.setViewportSize({ width: 3200, height: 900 });
  await page.goto("file://" + tmp);
  await page.waitForLoadState("networkidle");
  /* 照片沒載到就停（flex-preview.mjs 那條：破圖會靜靜地烘進 PNG） */
  const broken = await page.$$eval("img", (a) => a.filter((i) => !i.naturalWidth).length);
  if (broken) throw new Error(`${broken} 張照片沒有載到`);
  const els = await page.locator(".bub > div").all();
  for (const [i, el] of els.entries()) await el.screenshot({ path: path.join(OUT, `doc-${i + 1}.png`) });
  fs.unlinkSync(tmp);
  const h = (await els[0].boundingBox()).height;
  console.log(`preview/line-doctors/doc-1…${els.length}.png　300×${Math.round(h)} CSS px（DPR 3，九張齊高）`);
}
await browser.close();
