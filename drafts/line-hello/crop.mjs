#!/usr/bin/env node
/* 頭圖的裁切候選 → preview/line-hello/crop-<id>.jpg（各 1040×520）
 *   node drafts/line-hello/crop.mjs
 *
 * 使用者 2026-09-03：「診所建築左邊還有點空間可以裁掉，照片下緣的道路也可裁掉一些。」
 *
 * ⚠⚠ 左邊和下面**不能各自調**：成品必須是 2:1（Flex 頭圖的比例），
 *   所以左邊裁掉多少，高度就得跟著裁掉一半 —— 兩件事是綁在一起的。
 *   高度那一刀要從上下分配：全部從下面切會吃到騎樓（建築底部在 y 88%）。
 *
 * 原檔 8000×3982。格線量出來的位置（百分比）：
 *   屋簷左緣 13.5%　外牆左緣 16%　外牆右緣 46%
 *   建築底部 88%　人行道／路緣 90.5%　黃線 97%
 *   ⚠ 左邊裁超過 13.5% 就會開始切到屋簷。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "preview", "line-hello");
const SRC = path.join(ROOT, "assets", "hero-clinic-day-2080.jpg");
const IW = 8000, IH = 3982;                 /* 原檔尺寸（縮圖等比，用原檔座標算比較好讀） */
const W = 1040, H = 520;
const b64 = fs.readFileSync(SRC).toString("base64");

/* 照片上的地標（百分比，從格線圖讀的） */
const MARK = { roofL: 13.5, wallL: 16, wallR: 46, baseY: 88, kerbY: 90.5, roofY: 13.5 };

/* 每一案：左邊裁掉 L%，下緣留到 bottom%；高度由 2:1 決定，剩下的從上面切 */
const CASES = [
  { id: "a", label: "Ⓐ 幾乎不裁（現況）", L: 0.5,  bottom: 100 },
  { id: "b", label: "Ⓑ 左 5%・路留大半",  L: 5,    bottom: 97 },
  { id: "c", label: "Ⓒ 左 9%・路留一條",  L: 9,    bottom: 94 },
  { id: "d", label: "Ⓓ 左 13%・貼到屋簷", L: 13,   bottom: 92.5 },
  { id: "e", label: "Ⓔ 左 9%・路切到底",  L: 9,    bottom: 90.5 },
];

const rows = [];
for (const c of CASES) {
  const x0 = IW * c.L / 100;
  const w = IW - x0;
  const h = w / 2;
  let y1 = IH * c.bottom / 100;
  let y0 = y1 - h;
  let note = "";
  if (y0 < 0) { y0 = 0; y1 = h; note = "⚠ 上面不夠切，下緣自動往下讓"; }
  if (y1 > IH) { y1 = IH; y0 = IH - h; note = "⚠ 下面不夠切"; }
  rows.push({ ...c, x0, y0, x1: IW, y1, w, h, note,
    /* 檢查會不會切到東西 */
    cutRoofX: c.L > MARK.roofL,
    skyAboveRoof: ((MARK.roofY / 100 * IH - y0) / h * 100),
    keepsBase: y1 >= MARK.baseY / 100 * IH,
    roadStrip: ((y1 - MARK.kerbY / 100 * IH) / h * 100),
  });
}

const chromePath = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chromePath });
const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

console.log("案　　落點（原檔 8000×3982 座標）　　　　屋簷上方天空　路面那條　備註");
for (const r of rows) {
  const sc = W / r.w;                       /* 把裁切框縮到 1040 寬 */
  const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
.w{position:relative;width:${W}px;height:${H}px;overflow:hidden}
img{position:absolute;left:${(-r.x0 * sc).toFixed(2)}px;top:${(-r.y0 * sc).toFixed(2)}px;
  width:${(IW * sc).toFixed(2)}px;height:${(IH * sc).toFixed(2)}px}
</style><div class="w"><img src="data:image/jpeg;base64,${b64}"></div>`;
  await p.setContent(html, { waitUntil: "load" });
  const file = path.join(OUT, `crop-${r.id}.jpg`);
  await p.screenshot({ path: file, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: W, height: H } });
  const kb = fs.statSync(file).size / 1024;
  r.kb = Math.round(kb);
  if (r.cutRoofX) throw new Error(`${r.label} 左邊裁到 ${r.L}%，超過屋簷左緣 ${MARK.roofL}% —— 會切到屋簷`);
  if (!r.keepsBase) throw new Error(`${r.label} 下緣只到 ${r.bottom}%，切掉了騎樓（建築底部在 ${MARK.baseY}%）`);
  console.log(`${r.label.padEnd(18)} x${String(Math.round(r.x0)).padStart(4)}~${IW} y${String(Math.round(r.y0)).padStart(4)}~${String(Math.round(r.y1)).padStart(4)}` +
    `　${r.skyAboveRoof.toFixed(1)}%　${r.roadStrip.toFixed(1)}%　${r.kb}KB ${r.note}`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "crops.json"), JSON.stringify(rows, null, 2));
console.log(`\n出圖 ${rows.length} 張 → preview/line-hello/crop-*.jpg`);
