/* 颱風頭圖的「雨的方向」參考圖 —— 給 Gemini 當方向錨點用。
   成品 preview/line-typhoon/rain-direction-ref.png（1024×512）。

   ⚠ 為什麼要有這張：那個方向在提示詞裡寫死兩次都沒用（第一版、第二版出圖
     都是「/」＝右上往左下）。這一站的通則本來就寫著「形狀不要用文字描述，
     用參考圖」（ILLUSTRATION.md 第十之一節）—— 方向也是形狀。
   ⚠ 這張圖刻意做成「一看就是圖表不是插畫」：平底色 ＋ 只有雨的線條、
     沒有任何物件、沒有文字、沒有箭頭（箭頭會被畫進成品裡）。
   ⚠ 出在 preview/ 不是 drafts/ —— drafts 進不了 _site，使用者在手機上拿不到。
*/
import { existsSync, readdirSync, mkdirSync } from "node:fs";
/* ⚠ playwright 是 CommonJS，具名匯入會失敗（CLAUDE.md 第九節第 11 條）。 */
import pkg from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pkg;

function browserPath() {
  const base = "/opt/pw-browsers";
  for (const d of readdirSync(base).filter(x => x.startsWith("chromium_headless_shell"))) {
    const p = `${base}/${d}/chrome-linux/headless_shell`;
    if (existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
}

const W = 1024, H = 512, DEG = 40;          // 離垂直 40 度
const rad = DEG * Math.PI / 180;
const dx = Math.sin(rad), dy = Math.cos(rad); // dx>0、dy>0 ＝ 往右下（畫面座標 y 往下）

/* 雨：左上 → 右下。起點鋪滿整張（含左上方框外），才不會右下角沒有雨。 */
let lines = "";
let n = 0;
for (let i = -40; i < 130; i++) {
  const band = Math.floor(i / 7) % 3;        // 疏密分帶：一群一群，不是均勻鋪滿
  for (let j = 0; j < 9; j++) {
    if ((i + j) % 3 === band) continue;
    const x0 = i * 16 - 240 + ((j * 37) % 23);
    const y0 = j * 62 - 90 + ((i * 29) % 41);
    const len = 44 + ((i * 13 + j * 7) % 52);
    const a = (0.42 + ((i * 7 + j * 11) % 30) / 100).toFixed(2);
    const w = 2 + ((i + j) % 2);
    lines += `<line x1="${x0}" y1="${y0}" x2="${(x0 + dx * len).toFixed(1)}" y2="${(y0 + dy * len).toFixed(1)}" stroke="#eef3f4" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
    n++;
  }
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="${W}" height="${H}" fill="#4e5a5c"/>${lines}</svg>`;

const dir = "preview/line-typhoon";
mkdirSync(dir, { recursive: true });
const out = `${dir}/rain-direction-ref.png`;

const b = await chromium.launch({ executablePath: browserPath() });
const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0">${svg}</body>`);
await page.locator("svg").screenshot({ path: out });
await b.close();

/* 守門：① 尺寸 ② 真的有畫線（不是一片底色）③ 方向真的是「\」 */
const { readFileSync } = await import("node:fs");
const buf = readFileSync(out);
const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
if (w !== W || h !== H) throw new Error(`尺寸不對 ${w}×${h}`);
if (n < 800) throw new Error(`線太少（${n}）`);
if (dx <= 0 || dy <= 0) throw new Error("方向算錯了：要往右下");
console.log(`✅ ${out}　${w}×${h}　${n} 條線　離垂直 ${DEG}°　左上 → 右下`);
