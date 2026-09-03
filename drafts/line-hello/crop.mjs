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
 * ⚠⚠ 2026-09-03 稍晚：使用者選了 Ⓒ，但要上緣的天空再少一點。
 *   上面每裁掉 T，寬度就得收窄 2T —— 而左邊已經頂在屋簷（13.5%），
 *   所以那個寬度只能從**右邊**收。Ⓒ1~Ⓒ3 就是這條路的三階。
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
const SRC = path.join(HERE, "source-2080.jpg");
const IW = 8000, IH = 3982;                 /* 原檔尺寸（縮圖等比，用原檔座標算比較好讀） */
const W = 1040, H = 520;
const b64 = fs.readFileSync(SRC).toString("base64");

/* 照片上的地標（百分比，從格線圖讀的） */
const MARK = { roofL: 13.5, wallL: 16, wallR: 46, baseY: 88, kerbY: 90.5, roofY: 13.5 };

/* 每一案：左邊裁到 L%、右邊留到 R%、下緣留到 bottom%；
   高度由 2:1 決定，上緣＝下緣往上推一個高度。
   ⚠⚠ 三個方向連動：上面想多裁一點，寬度就得收窄「兩倍」——
   而左邊已經頂在屋簷（13.5%），所以那個寬度只能從右邊收。 */
const CASES = [
  { id: "a",  label: "Ⓐ 幾乎不裁（現況）",   L: 0.5, R: 100,  bottom: 100 },
  { id: "b",  label: "Ⓑ 左 5%・路留大半",    L: 5,   R: 100,  bottom: 97 },
  { id: "c",  label: "Ⓒ 左 9%・路留一條",    L: 9,   R: 100,  bottom: 94 },
  { id: "d",  label: "Ⓓ 左 13%・貼到屋簷",   L: 13,  R: 100,  bottom: 92.5 },
  /* 使用者 2026-09-03 選了 Ⓒ，但覺得上緣的天空可以再少一點。
     天空少一點 ＝ 右邊要跟著收窄兩倍。四階： */
  { id: "c1", label: "Ⓒ1 天空少一點",        L: 9,   R: 97.5, bottom: 94 },
  { id: "c2", label: "Ⓒ2 天空再少",          L: 9,   R: 95,   bottom: 94 },
  { id: "c3", label: "Ⓒ3 天空最少",          L: 9,   R: 92.5, bottom: 94 },
];

const rows = [];
for (const c of CASES) {
  const x0 = IW * c.L / 100;
  const x1 = IW * c.R / 100;
  const w = x1 - x0;
  const h = w / 2;
  let y1 = IH * c.bottom / 100;
  let y0 = y1 - h;
  let note = "";
  if (y0 < 0) { y0 = 0; y1 = h; note = "⚠ 上面不夠切，下緣自動往下讓"; }
  if (y1 > IH) { y1 = IH; y0 = IH - h; note = "⚠ 下面不夠切"; }
  rows.push({ ...c, x0, y0, x1, y1, w, h, note,
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

console.log("案　　落點（原檔 8000×3982 座標）　　　　屋簷上方　路面　放得下字的乾淨天空　備註");
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

  /* ⚠ 順帶量「這個裁法還剩多少乾淨天空可以放字」——
     裁得愈緊，右邊那棟灰樓愈靠近，能放字的天空就愈少。
     判準同 generate.mjs：深階綠 #2c5238 是中間調，算的是「對比 ≥4.5 的像素比例」，
     範圍取診所右牆以右（x≥46%）的上半部（y≤50%）。 */
  const clean = await p.evaluate(({ x0p, y1p }) => {
    const img = document.querySelector("img");
    const cv = document.createElement("canvas");
    cv.width = 1040; cv.height = 520;
    const cx = cv.getContext("2d");
    const st = getComputedStyle(img);
    cx.drawImage(img, parseFloat(st.left), parseFloat(st.top),
      parseFloat(st.width), parseFloat(st.height));
    const X0 = Math.round(1040 * x0p), Y1 = Math.round(520 * y1p);
    const d = cx.getImageData(X0, 0, 1040 - X0, Y1).data;
    const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
    const Y = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
    const Yt = Y(0x2c, 0x52, 0x38);
    let ok = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const y = Y(d[i], d[i + 1], d[i + 2]);
      const c = (Math.max(Yt, y) + .05) / (Math.min(Yt, y) + .05);
      n++; if (c >= 4.5) ok++;
    }
    return ok / n * 100;
  }, { x0p: 0.46, y1p: 0.50 });
  r.cleanSky = +clean.toFixed(1);
  if (r.skyAboveRoof < 3)
    throw new Error(`${r.label} 屋簷上方只剩 ${r.skyAboveRoof.toFixed(1)}% 的天空 —— 屋簷會貼在畫面上緣`);
  if (r.cutRoofX) throw new Error(`${r.label} 左邊裁到 ${r.L}%，超過屋簷左緣 ${MARK.roofL}% —— 會切到屋簷`);
  if (!r.keepsBase) throw new Error(`${r.label} 下緣只到 ${r.bottom}%，切掉了騎樓（建築底部在 ${MARK.baseY}%）`);
  console.log(`${r.label.padEnd(18)} x${String(Math.round(r.x0)).padStart(4)}~${String(Math.round(r.x1)).padStart(4)} y${String(Math.round(r.y0)).padStart(4)}~${String(Math.round(r.y1)).padStart(4)}` +
    `　${r.skyAboveRoof.toFixed(1)}%　${r.roadStrip.toFixed(1)}%　${String(r.cleanSky).padStart(5)}%　${r.kb}KB ${r.note}`);
}
await browser.close();
fs.writeFileSync(path.join(HERE, "crops.json"), JSON.stringify(rows, null, 2));
console.log(`\n出圖 ${rows.length} 張 → preview/line-hello/crop-*.jpg`);
