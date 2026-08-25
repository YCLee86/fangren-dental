/* 口外分享卡：四格帶子濃淡的 LINE 訊息模擬（2026-08-25）
 *   node drafts/surg-band-mock.mjs            → drafts/surg-band-mock-{1..4}.png
 * ⚠ 用的是真的產出檔 drafts/surg-band-<n>.jpg，不是 CSS 疊的。
 * ⚠ 卡片寬 212 CSS px、LINE 只顯示中央 89.7%（drafts/line-mock.mjs 那一輪實測的值）。
 * ⚠ 這台容器只有文泉驛 —— 這幾張看圖與版面，不要看字體。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const TITLE = "口腔外科 — 芳仁牙醫診所";
const DESC  = "口腔外科｜難拔的，有人專門在拔 —— 智齒、殘根、長不出來的都是。智齒腫過一次，消了就沒再管。牙齒只剩牙根，拔起來很麻煩。";
const LABEL = { 1: "Ⓐ 淡　套色 #8e6299　紙色字 3.79", 2: "Ⓑ 中　新色 #83588f　紙色字 4.42",
                3: "Ⓒ 濃　深階 #784e84　紙色字 5.15", 4: "Ⓓ 最濃　新色 #603e6a　紙色字 6.84" };
const CARD = 212, KEEP = 0.897, H = Math.round(CARD * 628 / (1200 * KEEP));

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage({ viewport: { width: 700, height: 640 }, deviceScaleFactor: 2 });

for (const n of [1, 2, 3, 4]) {
  const b64 = fs.readFileSync(path.join(ROOT, `drafts/surg-band-${n}.jpg`)).toString("base64");
  const bubble = (s) => `<div class="stage" style="width:${Math.round((CARD + 46) * s)}px;height:${Math.round((H + 92) * s)}px">
    <div class="wrap" style="--s:${s}"><div class="bubble">
      <div class="shot"><img src="data:image/jpeg;base64,${b64}"></div>
      <div class="txt"><div class="t">${TITLE}</div><div class="d">${DESC}</div></div>
    </div><div class="time">14:32</div></div></div>`;
  await pg.setContent(`<!doctype html><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#e7ecf1;font-family:"WenQuanYi Zen Hei","Noto Sans TC",sans-serif;padding:20px 24px 24px;width:700px}
    h1{font-size:14px;color:#38424c;margin-bottom:4px}
    p.n{font-size:11px;color:#66707a;margin-bottom:16px;line-height:1.7}
    h2{font-size:11px;color:#66707a;font-weight:400;margin:0 0 6px}
    .stage{position:relative;overflow:hidden}
    .wrap{position:absolute;top:0;left:0;display:flex;align-items:flex-end;gap:6px;transform:scale(var(--s));transform-origin:top left}
    .bubble{width:${CARD}px;background:#6de67b;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.10)}
    .shot{width:${CARD}px;height:${H}px;overflow:hidden;position:relative}
    .shot img{position:absolute;top:0;left:${-((1 - KEEP) / 2) * (CARD / KEEP)}px;width:${CARD / KEEP}px;height:${H}px;display:block}
    .txt{padding:7px 9px 9px}
    .t{font-size:11.5px;font-weight:700;color:#14181c;line-height:1.35}
    .d{font-size:10.5px;color:#33422f;line-height:1.5;margin-top:3px;
       display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .time{font-size:9px;color:#8b96a1;padding-bottom:3px}
    .sep{height:18px}
  </style>
  <h1>${LABEL[n]}</h1>
  <p class="n">卡片寬 ${CARD} CSS px・LINE 只顯示原圖中央 ${(KEEP * 100).toFixed(1)}%（左右各裁 ${(((1 - KEEP) / 2) * 100).toFixed(1)}%）。字體是容器的文泉驛，看圖與版面就好。</p>
  <h2>真實尺寸</h2>${bubble(1)}<div class="sep"></div><h2>放大 2.6 倍</h2>${bubble(2.6)}`);
  await pg.evaluate(() => document.fonts.ready);
  const out = `drafts/surg-band-mock-${n}.png`;
  fs.writeFileSync(path.join(ROOT, out), await pg.screenshot({ fullPage: true }));
  console.log("✓", out);
}
await browser.close();
