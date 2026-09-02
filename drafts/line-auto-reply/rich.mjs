#!/usr/bin/env node
/* LINE「圖文訊息」的候選圖 → preview/line-reply/rich-{2,4}.png（各 1040×1040）
 *
 *   node drafts/line-auto-reply/rich.mjs
 *
 * 這是 LINE 官方帳號後台「圖文訊息」要上傳的那張圖：整張是一張圖，
 * 由後台的版型把它切成幾個「可以點」的區塊，每一塊各自掛一個動作
 * （撥電話 / 開網址 / 開地圖）。**所以字是烘在圖裡的，不是文字訊息。**
 *
 * 兩個候選：
 *   rich-2.png  上下兩格：上＝照片＋診所名（點了開網站）／下＝撥打電話
 *   rich-4.png  四格：照片｜撥打電話｜看診時間｜診所位置
 *
 * ⚠ 版型名稱與可用的格數要在後台確認過再定案（我沒有那個後台）。
 *
 * 照著站上既有的規矩做的四件：
 * ① Chromium 一律挑 headless_shell（CLAUDE.md 第九節第 18 條：完整版 chrome
 *    畫出來會少 87px，而且 PNG 仍輸出完整尺寸、不報錯）。
 * ② 帶子的 alpha 用 smoothstep 不用線性（第 10 條：線性漸層的起點是一條可見的線）。
 * ③ 字型是真的 Noto Sans TC —— 容器裡只有文泉驛，所以從 Google Fonts 取回
 *    需要的分段再子集化，存在 fonts/ 底下（做法同 tools/og-plate.mjs）。
 * ④ 看診時間與電話從站上的 index.html 讀回來，不在這裡抄第二份
 *    （CLAUDE.md 第十節第 1 條：資料不重抄）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUTDIR = path.join(ROOT, "preview", "line-reply");
fs.mkdirSync(OUTDIR, { recursive: true });

/* ---- 從 index.html 讀回事實（不抄第二份） ------------------------------- */
const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const HOURS = [...home.matchAll(/<th scope="row"><b>(.)<\/b>([0-9:–]+)<\/th>/g)]
  .map((m) => ({ k: m[1], t: m[2] }));
if (HOURS.length !== 3) throw new Error(`門診表讀到 ${HOURS.length} 列，應該是 3 列`);
const DAYS = [...home.matchAll(/<th scope="col">(.)<\/th>/g)].map((m) => m[1]);
if (DAYS.length !== 5) throw new Error(`開診日讀到 ${DAYS.length} 天，應該是 5 天`);
const TEL = (home.match(/<data class="num" value="([^"]+)"/) || [])[1];
if (!TEL) throw new Error("讀不到頁尾的電話");
const ADDR = "永樂街 70 號";

/* ---- 字型（子集過的 Noto Sans TC 分段） --------------------------------- */
const FDIR = path.join(HERE, "fonts");
const faces = JSON.parse(fs.readFileSync(path.join(FDIR, "chunks.json"), "utf8"))
  .map((f) => {
    const b64 = fs.readFileSync(path.join(FDIR, f.name)).toString("base64");
    return `@font-face{font-family:"NotoTC";font-style:normal;font-weight:${f.w};` +
           `src:url(data:font/woff2;base64,${b64}) format("woff2");unicode-range:${f.ur}}`;
  }).join("\n");

/* ---- 顏色：一律回 PALETTE.md 拿，這裡不自己挑 --------------------------- */
const C = {
  paper: "#e2e5e6", card: "#f4f4f5", rule: "#cdd0d2",
  ink: "#2a2c27", inkSoft: "#5c5f57",
  green: "#3f654a",      /* 一般牙科的套色 */
  deep:  "#2c5238",      /* 白底上的字階 */
  band:  "27,30,34",
  bandSolid: "#1b1e22",   /* 帶子的實色，接在照片下面 */
};

/* 帶子的 alpha：smoothstep，頭尾斜率 0（CLAUDE.md 第九節第 10 條） */
const smooth = (from, to, stops = 10) => {
  const out = [];
  for (let i = 0; i <= stops; i++) {
    const t = i / stops, a = t * t * (3 - 2 * t);
    out.push(`rgba(${C.band},${(a).toFixed(3)}) ${(from + (to - from) * t).toFixed(1)}%`);
  }
  return out.join(",");
};

/* 照片：cover 裁切算式（框 bw×bh、原圖 2000×1323、裁寬 cw、水平中心 cx、下緣貼底） */
const IMG_W = 2000, IMG_H = 1323;
const photoCss = (bw, bh, cw, cx) => {
  const s = bw / cw, w = IMG_W * s, h = IMG_H * s;
  let left = -(cx - cw / 2) * s;
  left = Math.min(0, Math.max(bw - w, left));
  return `background-image:url(data:image/jpeg;base64,${PHOTO});` +
         `background-size:${w.toFixed(1)}px ${h.toFixed(1)}px;` +
         `background-position:${left.toFixed(1)}px ${(bh - h).toFixed(1)}px;`;
};
const PHOTO = fs.readFileSync(path.join(ROOT, "assets", "hero-clinic-night-2000.jpg")).toString("base64");

/* ---- 圖示：站上頁尾那兩顆實心圖示，路徑直接抄過來（不引外部檔） --------- */
const ICON = {
  tel: `<svg viewBox="0 0 512 512"><path fill="${C.green}" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>`,
  pin: `<svg viewBox="0 0 384 512"><path fill="${C.green}" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`,
  clock: `<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="216" fill="none" stroke="${C.green}" stroke-width="48"/><path d="M256 128v136l88 56" fill="none" stroke="${C.green}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  /* 科別與醫師：一個人 */
  people: `<svg viewBox="0 0 512 512"><circle cx="256" cy="150" r="94" fill="${C.green}"/><path d="M256 276c-92 0-166 62-166 139 0 12 10 21 22 21h288c12 0 22-9 22-21 0-77-74-139-166-139z" fill="${C.green}"/></svg>`,
  /* 衛教文章：一張紙上幾行字 */
  doc: `<svg viewBox="0 0 512 512"><rect x="86" y="46" width="340" height="420" rx="34" fill="none" stroke="${C.green}" stroke-width="42"/><path d="M164 172h184M164 256h184M164 340h116" fill="none" stroke="${C.green}" stroke-width="42" stroke-linecap="round"/></svg>`,
};

const base = `<!doctype html><meta charset="utf-8"><style>
${faces}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1040px;height:1040px;background:${C.rule}}
.sheet{width:1040px;height:1040px;display:grid;gap:6px;background:${C.rule};overflow:hidden}
.cell{background:${C.card};display:flex;flex-direction:column;align-items:center;
  justify-content:center;position:relative;overflow:hidden;
  font-family:"NotoTC","Noto Sans TC",sans-serif;color:${C.ink};text-align:center}
.photo{background-repeat:no-repeat;justify-content:flex-end}
/* ⚠ 帶子脫離照片、接在下面（og-home 2026-08-22 定案的做法）——
   壓在照片上的話，名字就落在亮著的騎樓與清水模牆上，對比一路在變。
   上緣仍然要淡進來，不然會切出一條線。 */
.veil{position:absolute;left:0;right:0;bottom:0;pointer-events:none}
.name{position:relative;width:100%;color:${C.paper};background:${C.bandSolid};
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.name b{font-weight:700;letter-spacing:.10em;text-indent:.10em}
.name span{font-weight:500;opacity:.86;letter-spacing:.06em;text-indent:.06em}
.ic{display:block}
.lab{color:${C.inkSoft};font-weight:500}
.big{color:${C.deep};font-weight:700;letter-spacing:.01em}
.row{display:flex;align-items:baseline;justify-content:center;gap:.42em;
  color:${C.ink};font-weight:500;white-space:nowrap}
.row i{font-style:normal;color:${C.green};font-weight:700}
</style>`;

/* ---- 候選一：上下兩格 --------------------------------------------------- */
/* ⚠ 兩格版切成上下各半 —— LINE 的圖文訊息版型是**固定的格子**，
   自己挑一個 60/40 的分法，可點的範圍就會和畫面上的分界對不起來。 */
const TOP_H = 517, BOT_H = 517;
const two = `${base}
<div class="sheet" style="grid-template-rows:${TOP_H}px ${BOT_H}px">
  <div class="cell photo" style="${photoCss(1040, TOP_H, 1480, 1120)}">
    <div class="veil" style="height:88px;bottom:140px;background:linear-gradient(to bottom,${smooth(0, 100)})"></div>
    <div class="name" style="height:140px;gap:9px">
      <b style="font-size:52px">芳仁牙醫診所</b>
      <span style="font-size:32px">雲林斗六・永樂街</span>
    </div>
  </div>
  <div class="cell" style="gap:14px">
    <div style="display:flex;align-items:center;gap:26px">
      <span class="ic" style="width:64px;height:64px">${ICON.tel}</span>
      <span class="big" style="font-size:96px;line-height:1">${TEL}</span>
    </div>
    <div class="lab" style="font-size:40px">改約診・取消・約諮詢，請直接來電</div>
  </div>
</div>`;

/* ---- 候選二：四格 ------------------------------------------------------- */
const four = `${base}
<div class="sheet" style="grid-template-rows:517px 517px;grid-template-columns:517px 517px">
  <div class="cell photo" style="${photoCss(517, 517, 900, 1120)}">
    <div class="veil" style="height:74px;bottom:126px;background:linear-gradient(to bottom,${smooth(0, 100)})"></div>
    <div class="name" style="height:126px;gap:6px">
      <b style="font-size:44px">芳仁牙醫診所</b>
      <span style="font-size:30px;letter-spacing:.14em;text-indent:.14em">診所網站</span>
    </div>
  </div>
  <div class="cell" style="gap:16px">
    <span class="ic" style="width:66px;height:66px">${ICON.tel}</span>
    <div class="lab" style="font-size:38px">撥打電話</div>
    <div class="big" style="font-size:62px">${TEL}</div>
  </div>
  <div class="cell" style="gap:14px">
    <span class="ic" style="width:56px;height:56px">${ICON.clock}</span>
    <div class="lab" style="font-size:40px">看診時間</div>
    ${HOURS.map((h) => `<div class="row" style="font-size:46px"><i>${h.k}</i>${h.t}</div>`).join("\n    ")}
    <div class="lab" style="font-size:34px;margin-top:4px">週${DAYS[0]}至週${DAYS[4]}</div>
  </div>
  <div class="cell" style="gap:16px">
    <span class="ic" style="width:58px;height:66px">${ICON.pin}</span>
    <div class="lab" style="font-size:38px">診所位置</div>
    <div class="big" style="font-size:52px">${ADDR}</div>
  </div>
</div>`;

/* ---- 候選三：四格・功能版 ---------------------------------------------
   使用者 2026-09-02 講的功能：約診提醒／簡單診所介紹／科別內容／衛教訊息／
   更詳細的在官網。⚠ 約診提醒是**推播**、沒有可以點的去處，所以它留在文字裡，
   不放進格子 —— 格子裡的每一格都要答得出「點下去會怎樣」。 */
const fourB = `${base}
<div class="sheet" style="grid-template-rows:517px 517px;grid-template-columns:517px 517px">
  <div class="cell photo" style="${photoCss(517, 517, 900, 1120)}">
    <div class="veil" style="height:74px;bottom:126px;background:linear-gradient(to bottom,${smooth(0, 100)})"></div>
    <div class="name" style="height:126px;gap:6px">
      <b style="font-size:44px">芳仁牙醫診所</b>
      <span style="font-size:30px;letter-spacing:.14em;text-indent:.14em">診所介紹</span>
    </div>
  </div>
  <div class="cell" style="gap:16px">
    <span class="ic" style="width:66px;height:66px">${ICON.tel}</span>
    <div class="lab" style="font-size:38px">撥打電話</div>
    <div class="big" style="font-size:62px">${TEL}</div>
  </div>
  <div class="cell" style="gap:18px">
    <span class="ic" style="width:64px;height:64px">${ICON.people}</span>
    <div class="big" style="font-size:52px">科別與醫師</div>
    <div class="lab" style="font-size:34px">七個科別在做什麼</div>
  </div>
  <div class="cell" style="gap:18px">
    <span class="ic" style="width:58px;height:64px">${ICON.doc}</span>
    <div class="big" style="font-size:52px">牙齒衛教</div>
    <div class="lab" style="font-size:34px">診所寫的文章</div>
  </div>
</div>`;

/* ---- 出圖 --------------------------------------------------------------- */
const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
  for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
/* ⚠⚠ 出圖之前先確認每一個字都在子集裡 —— 缺字時瀏覽器會靜靜地掉到系統字
   （這台只有文泉驛），畫面看起來「就是另一套字」但不會有任何錯誤訊息。
   2026-09-02 踩過：「牙齒衛教」四個字有三個不在子集裡。做法同 tools/og-plate.mjs。 */
const GLYPHS = new Set(fs.readFileSync(path.join(FDIR, "glyphs.txt"), "utf8").replace(/\s/g, ""));
const visibleText = (html) => html.replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]*>/g, "").replace(/\s/g, "");
for (const [name, html] of [["rich-2", two], ["rich-4", four], ["rich-4b", fourB]]) {
  const miss = [...new Set([...visibleText(html)].filter((c) => !GLYPHS.has(c)))];
  if (miss.length) {
    console.error(`${name} 有 ${miss.length} 個字不在子集裡：${miss.join("")}`);
    console.error("  補進 drafts/line-auto-reply/fonts/glyphs.txt 再跑一次 fonts/fetch.mjs。");
    process.exit(1);
  }
}

const browser = await chromium.launch({ executablePath: chromePath });
const page = await browser.newPage({ viewport: { width: 1040, height: 1040 }, deviceScaleFactor: 1 });

for (const [name, html] of [["rich-2", two], ["rich-4", four], ["rich-4b", fourB]]) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(OUTDIR, `${name}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1040, height: 1040 } });
  /* 驗一次尺寸（第 18 條：被平切時 PNG 仍會輸出完整尺寸，所以要真的讀檔頭） */
  const b = fs.readFileSync(out);
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  if (w !== 1040 || h !== 1040) throw new Error(`${name} 是 ${w}×${h}，應該是 1040×1040`);
  console.log(`${name}.png  ${w}×${h}  ${(b.length / 1024).toFixed(0)}KB`);
}
await browser.close();
console.log(`門診時間讀自 index.html：${HOURS.map((h) => h.k + h.t).join("　")}　週${DAYS[0]}至週${DAYS[4]}`);
console.log(`電話讀自 index.html：${TEL}`);
