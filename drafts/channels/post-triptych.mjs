/* 主頁三格拼起來的那一顆浮水印 —— 「要多大」那把尺
 *   node drafts/channels/post-triptych.mjs
 *
 * ⚠⚠⚠ 這一把尺**跨三支產生器**：三張圖的浮水印是同一顆圓的三塊，
 *   換直徑就要三張一起重跑，不然拼起來會是三段對不上的弧。
 *   所以直徑用環境變數傳（`WM_DIA`），這一支負責一次跑完三支、把拼起來的樣子拍下來。
 *
 * 產出 `preview/line-post-docs/tri-sizes.png`（幾格由下面 DIAS 決定，由上到下排）。
 * ⚠ 跑完會**再用預設值跑一次**，所以 repo 裡留下的三張成品永遠是定案那一組。
 * ⚠ post-docs.mjs 清檔時刻意跳過 `tri-*.png`（見那一支的註解）。
 *
 * ⚠⚠ 為什麼不用 CSS 在模擬圖上「再畫一次浮水印」就好：那會變成第二個真相 ——
 *   哪天 wm-triptych 的算式改了，這一頁還會畫出舊的、而且看起來很正常
 *   （同 og-topic-card 那一輪：提案頁要擺真的產出檔）。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TRI, MOCK, tripleHtml, wmFor } from "./wm-triptych.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-docs");
const RULE = "#cdd0d2", INK = "#2a2c27", CARD = "#f4f4f5";

/* ⚠ 三格的尺 —— 單位是「三格合起來」那個座標系（大格寬 823），
   所以 500 ＝ 圓的直徑佔大格寬的 60.8%。 */
const DIAS = [380, 500, 620];
const DEFAULT = TRI.DIA;

const TILES = [
  ["hours", "post-hours.mjs",    ["preview", "line-post-hours", "fangren-hours-1080.png"]],
  ["docs",  "post-docs.mjs",     ["preview", "line-post-docs",  "fangren-docs-1080.png"]],
  ["map",   "post-map-door.mjs", ["preview", "line-post-map",   "fangren-map-1080.png"]],
];

const run = (script, dia) => execFileSync("node", [path.join(HERE, script)],
  { cwd: ROOT, env: { ...process.env, WM_DIA: String(dia) }, stdio: "pipe" });

const b64 = f => "data:image/png;base64," + fs.readFileSync(f).toString("base64");

const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });

const shots = [];
for (const dia of DIAS) {
  for (const [, script] of TILES) run(script, dia);
  const uri = Object.fromEntries(TILES.map(([k, , rel]) => [k, b64(path.join(ROOT, ...rel))]));
  const pg = await browser.newPage({ viewport: { width: MOCK.w, height: MOCK.h } });
  await pg.setContent(tripleHtml(uri, RULE));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  shots.push({ dia, png: (await pg.screenshot()).toString("base64"),
               g: Object.fromEntries(TILES.map(([k]) => [k, wmFor(k, { dia })])) });
  await pg.close();
  console.log(`  ${dia}　跑完三張`);
}

/* 由上到下排成一張，每一格上面一條說明 */
const LAB = 46;
const page = await browser.newPage({
  viewport: { width: MOCK.w, height: (MOCK.h + LAB) * shots.length } });
await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}
  body{width:${MOCK.w}px;background:#fff;font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
  .lab{height:${LAB}px;display:flex;align-items:center;padding:0 10px;gap:10px;
       background:${CARD};color:${INK};font-size:19px;letter-spacing:.02em}
  .lab b{font-weight:700}
  .lab span{color:#5c5f57;font-size:17px}</style>`
  + shots.map(s => `<div class="lab"><b>直徑 ${s.dia}</b>`
      + `<span>＝ 大格寬的 ${(s.dia / TRI.BIG_W * 100).toFixed(0)}%`
      + `　門診表畫 ${s.g.hours.w}px・兩個小格各畫 ${s.g.docs.w}px</span></div>`
      + `<img src="data:image/png;base64,${s.png}" width="${MOCK.w}" height="${MOCK.h}">`).join(""));
await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await page.screenshot({ path: path.join(OUT, "tri-sizes.png") });
await browser.close();

/* ⚠⚠ 一定要用預設值再跑一次 —— 不然 repo 裡留下的是這把尺最後一格，
   而規格頁與 CLAUDE.md 說的是定案那一格，兩邊分家而且沒有人會發現。 */
for (const [, script] of TILES) run(script, DEFAULT);

console.log(`\n── 浮水印要多大（三格合起來的座標系，大格寬 ${TRI.BIG_W}）──`);
for (const s of shots)
  console.log(`  直徑 ${String(s.dia).padStart(3)}　＝ 大格寬的 ${(s.dia / TRI.BIG_W * 100).toFixed(0)}%`
    + `　門診表原圖畫 ${s.g.hours.w}px　小格原圖各畫 ${s.g.docs.w}px`
    + `　（比 ${(s.g.docs.w / s.g.hours.w).toFixed(3)} ＝ 兩格的顯示比例差）`);
console.log(`  ⚠⚠ 同一個 px 在三格上不一樣大：大格 ${(TRI.BIG_W / TRI.CANVAS).toFixed(4)}、`
  + `小格 ${(TRI.SLOT / TRI.CANVAS).toFixed(4)} —— 差 ${(TRI.BIG_W / TRI.SLOT).toFixed(3)} 倍。`);
console.log(`  出圖　tri-sizes.png（由上到下 ${DIAS.join("／")}）`);
console.log(`  ✓ 已用預設 ${DEFAULT} 再跑一次，三張成品是定案那一組`);
