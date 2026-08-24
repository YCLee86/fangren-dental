/* 模擬 LINE 訊息裡的預覽卡（真實尺寸 ＋ 放大三倍）
 *   node drafts/line-mock.mjs <spec> [--out drafts/<spec>-line-mock.png]
 *   例：node drafts/line-mock.mjs endo
 *
 * ⚠⚠ **文字一律從自己產出的頁面讀回來**（og:title／og:description）——
 *   不要照 topic-copy.mjs 自己拼（ILLUSTRATION.md 第十一節那一輪的教訓：
 *   自己拼會拼出一個訊息 app 上根本不會出現的東西，等於在假的東西上做決定）。
 * ⚠⚠ **卡片實測只有 212 CSS px 寬**（不是一般說的 250），而且
 *   **LINE 只顯示原圖寬度的 89.7%**（左右各裁 5.2%）——兩件都照實模擬，
 *   否則會把「其實會被裁掉的字」看成沒問題。
 * ⚠ 這一台只有文泉驛，手機上是系統字（PingFang／Noto Sans CJK）——
 *   **這張圖是拿來看圖與版面的，不要拿它判斷字體。**
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const args = process.argv.slice(2);
const spec = args[0];
const outIdx = args.indexOf("--out");
const OUT = outIdx >= 0 ? args[outIdx + 1] : `drafts/${spec}-line-mock.png`;
if (!spec) { console.error("用法：node drafts/line-mock.mjs <spec>"); process.exit(1); }

const page = fs.readFileSync(path.join(ROOT, "topics", spec, "index.html"), "utf8");
const meta = (p) => {
  const m = page.match(new RegExp(`<meta property="${p}" content="([^"]*)"`));
  if (!m) throw new Error(`${spec} 那一頁找不到 ${p}`);
  return m[1];
};
const title = meta("og:title"), desc = meta("og:description"), imgUrl = meta("og:image");
const file = "assets/" + imgUrl.split("/assets/")[1];
if (!fs.existsSync(path.join(ROOT, file))) throw new Error(`找不到 ${file}`);
const b64 = fs.readFileSync(path.join(ROOT, file)).toString("base64");

const CARD_W = 212;        // 訊息卡實測寬度（CSS px）
const KEEP = 0.897;        // LINE 只顯示原圖寬度的這麼多，對稱裁
const IMG_H = Math.round(CARD_W * 628 / (1200 * KEEP));

const bubble = (scale) => `
<div class="stage" style="width:${Math.round((CARD_W + 46) * scale)}px;height:${Math.round((IMG_H + 92) * scale)}px">
  <div class="wrap" style="--s:${scale}">
    <div class="bubble">
      <div class="shot"><img src="data:image/jpeg;base64,${b64}"></div>
      <div class="txt">
        <div class="t">${title}</div>
        <div class="d">${desc}</div>
      </div>
    </div>
    <div class="time">14:32</div>
  </div>
</div>`;

const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#e7ecf1;font-family:"WenQuanYi Zen Hei","Noto Sans TC",sans-serif;
  padding:24px 26px 28px;width:760px}
h1{font-size:14px;color:#38424c;font-weight:700;margin-bottom:6px}
p.note{font-size:11.5px;line-height:1.75;color:#66707a;margin-bottom:20px}
p.note b{color:#38424c}
h2{font-size:11.5px;color:#66707a;font-weight:400;margin:0 0 8px}
.stage{position:relative;overflow:hidden}
.wrap{position:absolute;top:0;left:0;display:flex;align-items:flex-end;gap:6px;
  transform:scale(var(--s));transform-origin:top left}
.bubble{width:${CARD_W}px;background:#6de67b;border-radius:16px;overflow:hidden;
  box-shadow:0 1px 2px rgba(0,0,0,.10)}
.shot{width:${CARD_W}px;height:${IMG_H}px;overflow:hidden;position:relative}
/* LINE 對稱裁掉左右各 (1-KEEP)/2 —— 框只露中間那一段 */
.shot img{position:absolute;top:0;left:${-((1 - KEEP) / 2) * (CARD_W / KEEP)}px;
  width:${CARD_W / KEEP}px;height:${IMG_H}px;display:block}
.txt{padding:7px 9px 9px}
.t{font-size:11.5px;font-weight:700;color:#14181c;line-height:1.35}
.d{font-size:10.5px;color:#33422f;line-height:1.5;margin-top:3px}
.time{font-size:9px;color:#8b96a1;padding-bottom:3px;white-space:nowrap}
.sep{height:22px}
</style>
<h1>LINE 訊息預覽 —— 分享 https://fangren.net/topics/${spec}/ 時對方看到的樣子</h1>
<p class="note">
  <b>卡片寬 ${CARD_W} CSS px</b>（手機截圖實測值，不是一般說的 250），
  圖已照 LINE 的裁法<b>只留中央 ${(KEEP * 100).toFixed(1)}%</b>（左右各裁 ${(((1 - KEEP) / 2) * 100).toFixed(1)}%）。<br>
  標題與描述是從 <b>topics/${spec}/index.html</b> 的 og:title／og:description 讀回來的，不是另外拼的。<br>
  ⚠ 字體是這台容器的文泉驛，你手機上會是系統字 —— <b>這張圖看圖與版面，不要看字體</b>。
</p>
<h2>① 真實尺寸（${CARD_W}px 寬）</h2>
${bubble(1)}
<div class="sep"></div>
<h2>② 同一張放大 2.6 倍（看細節）</h2>
${bubble(2.6)}`;

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage({ viewport: { width: 760, height: 700 }, deviceScaleFactor: 2 });
await pg.setContent(html);
await pg.evaluate(() => document.fonts.ready);
const buf = await pg.screenshot({ fullPage: true });
fs.writeFileSync(OUT, buf);
await browser.close();
console.log(`✓ ${OUT}`);
console.log(`  標題「${title}」`);
console.log(`  描述「${desc}」`);
console.log(`  圖 ${file}　卡片 ${CARD_W}×${IMG_H}（LINE 裁法：只留中央 ${(KEEP * 100).toFixed(1)}%）`);
