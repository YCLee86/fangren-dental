/* 主頁三格拼起來的那一顆浮水印 —— 「要多大」那把尺
 *   node drafts/channels/post-triptych.mjs
 *
 * ⚠⚠⚠ 這一把尺**跨三支產生器**：三張圖的浮水印是同一顆圓的三塊，
 *   換直徑就要三張一起重跑，不然拼起來會是三段對不上的弧。
 *   所以直徑用環境變數傳（`WM_DIA`），這一支負責一次跑完三支、把拼起來的樣子拍下來。
 *
 * 產出（每一個直徑四張，都放 `preview/line-post-docs/`）：
 *   `tri-<直徑>-3up.png`　　　三格排在一起（823×823）
 *   `tri-<直徑>-{hours,docs,map}.png`　三張各自獨立（1080×1080）
 * ⚠⚠ 2026-09-09 使用者：「三個大小的版本都要作成獨立的和排在一起的給我看」——
 *   **兩種都要**：排在一起才看得出那顆圓接不接得起來，獨立看才知道單張上
 *   那一塊弧讀起來像什麼（貼文是一則一則被看到的，不是永遠三格一起看）。
 *   ⚠ 原本那張把三個直徑疊成一長條的 `tri-sizes.png` 因此拿掉了 —— 那三段
 *     就是現在的三張 `-3up`，留著等於同一件事有兩份。
 * ⚠ 跑完會**再用預設值跑一次**，所以 repo 裡留下的三張成品永遠是定案那一組。
 * ⚠ post-docs.mjs 清檔時刻意跳過 `tri-*.png`（見那一支的註解）。
 * ⚠⚠ 這 12 張是**尺**不是成品 —— 使用者挑定直徑之後要連同規格頁那一節一起清掉
 *   （同 line-post-map 那一輪從 45 張收成 8 張），數字留在 README 第 36-17 節。
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
const RULE = "#cdd0d2";

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

/* ⚠ 上一版那張疊成一長條的 tri-sizes.png 已經拿掉，留著會變成孤兒圖 */
{
  const stale = path.join(OUT, "tri-sizes.png");
  if (fs.existsSync(stale)) fs.rmSync(stale);
}

const shots = [];
for (const dia of DIAS) {
  for (const [, script] of TILES) run(script, dia);
  /* 三張各自獨立的 —— 直接複製那一輪的成品，**不要在這裡重畫一次**
     （重畫就是第二個真相，同這一支抬頭那段註解） */
  for (const [k, , rel] of TILES)
    fs.copyFileSync(path.join(ROOT, ...rel), path.join(OUT, `tri-${dia}-${k}.png`));
  const uri = Object.fromEntries(TILES.map(([k, , rel]) => [k, b64(path.join(ROOT, ...rel))]));
  const pg = await browser.newPage({ viewport: { width: MOCK.w, height: MOCK.h } });
  await pg.setContent(tripleHtml(uri, RULE));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await pg.screenshot({ path: path.join(OUT, `tri-${dia}-3up.png`) });
  shots.push({ dia, g: Object.fromEntries(TILES.map(([k]) => [k, wmFor(k, { dia })])) });
  await pg.close();
  console.log(`  ${dia}　跑完三張 ＋ 排在一起那一張`);
}
await browser.close();

/* ⚠⚠ 一定要用預設值再跑一次 —— 不然 repo 裡留下的是這把尺最後一格，
   而規格頁與 CLAUDE.md 說的是定案那一格，兩邊分家而且沒有人會發現。 */
for (const [, script] of TILES) run(script, DEFAULT);

console.log(`\n── 浮水印要多大（三格合起來的座標系，大格寬 ${TRI.BIG_W}）──`);
for (const s of shots)
  console.log(`  直徑 ${String(s.dia).padStart(3)}　＝ 大格寬的 ${(s.dia / TRI.BIG_W * 100).toFixed(0)}%`
    + `　門診表原圖畫 ${s.g.hours.w.toFixed(1)}px　小格原圖各畫 ${s.g.docs.w.toFixed(1)}px`
    + `　（比 ${(s.g.docs.w / s.g.hours.w).toFixed(3)} ＝ 兩格的顯示比例差）`);
console.log(`  ⚠⚠ 同一個 px 在三格上不一樣大：大格 ${(TRI.BIG_W / TRI.CANVAS).toFixed(4)}、`
  + `小格 ${(TRI.SLOT / TRI.CANVAS).toFixed(4)} —— 差 ${(TRI.BIG_W / TRI.SLOT).toFixed(3)} 倍。`);

/* ⚠⚠⚠ 獨立看和貼上去看不是同一件事，而且只有門診表那一張會差 ——
   大格是 cover 裁切、只看得到中間那一段（那件事 2026-09-09 由使用者的後台截圖確定），
   兩個小格是方進方，獨立看到的就是貼上去看到的。
   ⚠ 這一段是「第 28 條 ④」那種**讀起來對不對**的量測，不是壞掉檢查 —— 每次都要印。 */
{
  const s = TRI.BIG_W / TRI.CANVAS;
  const y0 = (TRI.CANVAS - TRI.BIG_H / s) / 2, y1 = TRI.CANVAS - y0;
  console.log(`\n── 門診表那一張：獨立看 vs 貼上去（大格看得到 y ${y0.toFixed(1)}~${y1.toFixed(1)}）──`);
  for (const c of shots) {
    const w = c.g.hours, bot = w.top + w.h;
    const alone = (Math.min(TRI.CANVAS, bot) - Math.max(0, w.top)) / w.h;
    const tile  = (Math.min(y1, bot) - Math.max(y0, w.top)) / w.h;
    console.log(`  直徑 ${String(c.dia).padStart(3)}　獨立看得到圓的 ${(alone * 100).toFixed(0)}%`
      + `　貼上去只看得到 ${(tile * 100).toFixed(0)}%`
      + `　→ 牙洞在最下面，${bot <= y1 ? "貼上去也看得到" : "**貼上去看不到**"}`);
  }
}
console.log(`\n  出圖　每個直徑四張：tri-<直徑>-3up.png ＋ -hours／-docs／-map.png`
  + `（${DIAS.join("／")}，共 ${DIAS.length * 4} 張）`);
console.log(`  ✓ 已用預設 ${DEFAULT} 再跑一次，三張成品是定案那一組`);
