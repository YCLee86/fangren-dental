// 〈根管鈣化〉HERO：把大圈那兩條引線畫上去（外切線，用算的）
//
// 用法：node drafts/pulp-calcification/leader-lines.mjs <輸入> <輸出.png>
//
// ⚠ 為什麼用程式畫：這兩條線是編修模型唯一治不好的東西（連壞三輪 —— 接到膿包、
//   移動時舊的沒刪、多長一條）。直線與外切線剛好是程式最會畫的，公式現成
//   （同 cave-ref.mjs 的 leaderTo）：d ＝ 點到圓心的距離、γ ＝ acos(r/d)、
//   φ ＝ 圓心看向那一點的角度，兩個切點 ＝ 圓心 ＋ r·(cos(φ±γ), sin(φ±γ))。
//
// ⚠⚠ 座標**不可以目測讀格子**（第一次就這樣差了十幾像素）。
//   大圈是用 rim 掃描抓三個框上的點再解圓方程算出來的；
//   終點與人物位置是用 grid.mjs 疊座標格在 1:1 下讀的。改圖就要重量一次。
//
// ⚠⚠⚠ 下面那條幾何上必定穿過畫面中間那兩個人（終點在根管、起點在圈的下緣，
//   他們正好站在中間）。所以**讓它從他們背後過去**：落在人身上的那一段不畫。
//   判斷不是寫死 x 範圍，是看底下那一格的顏色 —— 粉紅牙齦就畫，其他就跳過。

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IN = process.argv[2], OUT = process.argv[3];
if (!IN || !OUT) { console.error('用法：node leader-lines.mjs <輸入> <輸出.png>'); process.exit(1); }

/* ── 這一張（1678×937）量到的幾何 ─────────────────────────── */
const C = { x: 426, y: 462, r: 356 };   // 大圈：圓心與外緣半徑（解圓方程得來）
const P = { x: 1095, y: 684 };          // 終點：左邊那條根管的上段
const TOOTH_X = 995;                    // 牙齒左緣：過了這裡一律要畫（那邊是米白不是粉紅）
const GUM_FROM = 600;                   // 這之前都是牙齦，不必檢查

const dx = P.x - C.x, dy = P.y - C.y, d = Math.hypot(dx, dy);
if (d <= C.r) throw new Error('那一點落在圓裡面，畫不出外切線');
const phi = Math.atan2(dy, dx), gamma = Math.acos(C.r / d);
const T = [phi + gamma, phi - gamma].map((a) => ({
  x: C.x + C.r * Math.cos(a), y: C.y + C.r * Math.sin(a),
}));

const pwDir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const cands = [];
if (existsSync(pwDir)) for (const dd of readdirSync(pwDir)) {
  cands.push(join(pwDir, dd, 'chrome-linux', 'headless_shell'), join(pwDir, dd, 'chrome-linux', 'chrome'));
}
const chrome = cands.find((p) => existsSync(p));
const { chromium } = (await import('/opt/node22/lib/node_modules/playwright/index.js')).default;
const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();

const mime = IN.endsWith('.png') ? 'png' : 'jpeg';
const uri = `data:image/${mime};base64,` + readFileSync(IN).toString('base64');

const b64 = await pg.evaluate(async ({ src, T, P, TOOTH_X, GUM_FROM }) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const cv = new OffscreenCanvas(W, H), cx = cv.getContext('2d');
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0, 0, W, H).data;
  const pink = (x, y) => { const i = ((y | 0) * W + (x | 0)) * 4; return d[i] - d[i + 1] > 16; };

  cx.strokeStyle = 'rgba(56,41,31,0.93)';
  cx.lineWidth = 2.1; cx.lineCap = 'butt'; cx.lineJoin = 'round';

  /* ⚠ 只有**下面那一條**要躲人 —— 上面那條從鄰牙與牙齦上方過去，沒有人擋，
        套同一條規則的話它會在白色的鄰牙上被整段跳掉（第一次就是這樣）。 */
  const lower = T[0].y > T[1].y ? T[0] : T[1];
  for (const t of T) {
    const hide = (t === lower);
    const vx = P.x - t.x, vy = P.y - t.y, L = Math.hypot(vx, vy);
    const ux = vx / L, uy = vy / L;
    let run = null;
    for (let s = 0; s <= L; s += 0.5) {
      const px = t.x + ux * s, py = t.y + uy * s;
      const ok = !hide || px > TOOTH_X || px < GUM_FROM || pink(px, py);
      if (ok) { if (!run) run = [px, py]; }
      else if (run) { cx.beginPath(); cx.moveTo(run[0], run[1]); cx.lineTo(px, py); cx.stroke(); run = null; }
    }
    if (run) { cx.beginPath(); cx.moveTo(run[0], run[1]); cx.lineTo(P.x, P.y); cx.stroke(); }
  }

  const blob = await cv.convertToBlob({ type: 'image/png' });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ''; for (const v of buf) s += String.fromCharCode(v);
  return btoa(s);
}, { src: uri, T, P, TOOTH_X, GUM_FROM });

await browser.close();
writeFileSync(OUT, Buffer.from(b64, 'base64'));
console.log(`切點 ${T.map((t) => `(${t.x.toFixed(0)}, ${t.y.toFixed(0)})`).join(' 與 ')} → 終點 (${P.x}, ${P.y})　寫好了：${OUT}`);
