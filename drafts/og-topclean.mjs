/* 把分享圖「頂 17% 安靜區」裡多出來的東西抹掉，改用牆自己的顏色往上外插。
 *   node drafts/og-topclean.mjs <原檔> <輸出> [--strip 0.17] [--feather 0.03] [--cols 0.39,0.47]
 *
 * ⚠⚠ **預設會重畫整條，那通常是錯的** —— 用 --cols 只挑「伸進去的是背景物件」那幾欄。
 *   顯微根管 v3 踩過：整條重畫把**放大圈的上緣一起抹平了**，變成一條切齊的橫線。
 *   要先找出是哪幾欄伸進來（og-measure-card.mjs 會告訴你有多少比例，
 *   要精確位置就逐欄數「偏離牆色中位 > 15 階」的列數）。
 *
 * ⚠⚠ 為什麼要有這一支（2026-08-24，顯微根管連三版都踩到）：
 *   出圖模型**不會照「頂端 17% 留白」那條指令**——牙周那張是頭髮與燈臂，
 *   顯微根管 v1/v2/v3 是顯微鏡的臂（12.6~14.6% 的像素不是牆）。
 *   那一條伸進去的東西會從玻璃帶後面透出來，在 212px 的訊息卡上就是
 *   一道劃過科別名的髒污（drafts/endo-v3-thumb212.jpg 看得到）。
 *
 * 和牙周那次「把整張往下推」的差別：
 *   ・往下推會**犧牲畫面底部**（那次剛好只有水管與水窪，可以接受）。
 *   ・這一支**不動構圖**，只把頂 17% 重畫成牆 —— 因為那一整條本來就被帶子蓋住，
 *     看不見的東西不必留。**只有在「伸進去的是背景物件」時才可以用**：
 *     如果伸進去的是臉、手、招牌這種有意義的東西，要回頭改構圖，不是抹掉。
 *
 * 做法：每一欄各自從帶子下緣取兩段牆色，算出那一欄的垂直漸層，往上外插；
 *   最後 feather 那幾列和原圖交叉淡入，接縫才不會變成一條線（同 CLAUDE.md
 *   第九節第 10 條：值連續還不夠，斜率也要連續）。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const args = process.argv.slice(2);
const [src, out] = args.filter((a) => !a.startsWith("--"));
const num = (flag, dflt) => { const i = args.indexOf(flag); return i >= 0 ? Number(args[i + 1]) : dflt; };
const STRIP = num("--strip", 0.17), FEATHER = num("--feather", 0.03);
const colsIdx = args.indexOf("--cols");
const COLS = colsIdx >= 0 ? args[colsIdx + 1].split(",").map(Number) : null;   // [x0, x1]，比例
if (COLS && (COLS.length !== 2 || !(COLS[0] < COLS[1]))) { console.error("--cols 要寫成 x0,x1（比例，x0 < x1）"); process.exit(1); }
if (!src || !out) { console.error("用法：node drafts/og-topclean.mjs <原檔> <輸出> [--strip 0.17] [--feather 0.03]"); process.exit(1); }

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const r = await pg.evaluate(async ({ uri, STRIP, FEATHER, COLS }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const im = g.getImageData(0, 0, W, H), d = im.data;
  const S = Math.round(H * STRIP), F = Math.round(H * FEATHER);
  const K = Math.max(3, Math.round(H * 0.012));          // 每一段取幾列
  const y0 = S + 2, y1 = S + 2 + Math.round(H * 0.06);   // 兩段取樣的起點
  const med = (x, ya) => {                                // 那一欄、那一段的中位色
    const ch = [[], [], []];
    for (let y = ya; y < ya + K; y++) for (let k = 0; k < 3; k++) ch[k].push(d[(y * W + x) * 4 + k]);
    return ch.map((a) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)]);
  };
  let changed = 0;
  const xa = COLS ? Math.round(COLS[0] * W) : 0, xb = COLS ? Math.round(COLS[1] * W) : W;
  const FX = COLS ? Math.max(2, Math.round(W * 0.004)) : 0;    // 左右兩側也要淡入，不然會有直線
  /* ⚠⚠ 逐欄各自外插會長出**直條紋**（v3 踩過）：每一欄的取樣各自帶著雜訊，
     往上外插一百多列就把雜訊放大成一條一條。所以取樣要先橫向平滑，
     斜率也改用整段的平均值 —— 那一條被帶子蓋住，本來就不需要逐欄的細節。 */
  const R = Math.max(3, Math.round(W * 0.012));
  const rawA = [], rawB = [];
  for (let x = 0; x < W; x++) { rawA.push(med(x, y0)); rawB.push(med(x, y1)); }
  const smooth = (arr) => arr.map((_, x) => {
    const s0 = [0, 0, 0]; let n = 0;
    for (let i = Math.max(0, x - R); i <= Math.min(W - 1, x + R); i++) { for (let k = 0; k < 3; k++) s0[k] += arr[i][k]; n++; }
    return s0.map((v) => v / n);
  });
  const A = smooth(rawA), B = smooth(rawB);
  const gslope = [0, 1, 2].map((k) => {
    let sum = 0; for (let x = xa; x < xb; x++) sum += (A[x][k] - B[x][k]) / (y1 - y0);
    const v = sum / Math.max(1, xb - xa);
    return Math.max(-6 / S, Math.min(6 / S, v));            // 整條的落差夾在 ±6 階以內
  });
  for (let x = xa; x < xb; x++) {
    const fx = FX ? Math.min(1, Math.min(x - xa, xb - 1 - x) / FX) : 1;
    const a = A[x];
    const slope = gslope;
    for (let y = 0; y < S; y++) {
      const i = (y * W + x) * 4;
      const synth = [0, 1, 2].map((k) => Math.max(0, Math.min(255, Math.round(a[k] + slope[k] * (y0 - y)))));
      // 帶子下緣那幾列和原圖交叉淡入
      const t = y > S - F ? (y - (S - F)) / F : 0;
      for (let k = 0; k < 3; k++) {
        const w = (1 - t) * fx;
        const v = Math.round(synth[k] * w + d[i + k] * (1 - w));
        if (Math.abs(v - d[i + k]) > 6) changed++;
        d[i + k] = v;
      }
    }
  }
  g.putImageData(im, 0, 0);
  return { W, H, S, xa, xb, changedPct: +(100 * changed / (3 * S * Math.max(1, xb - xa))).toFixed(2),
           b64: c.toDataURL("image/jpeg", 0.95).split(",")[1] };
}, { uri, STRIP, FEATHER, COLS });
await browser.close();
fs.writeFileSync(out, Buffer.from(r.b64, "base64"));
console.log(`✓ ${out}  ${r.W}×${r.H}　重畫了頂 ${r.S}px（${(STRIP * 100).toFixed(0)}%）的第 ${r.xa}~${r.xb} 欄，其中 ${r.changedPct}% 的通道真的有變`);
console.log(`  ⚠ 這一條會被玻璃帶蓋住，所以看不出來；但**只有背景物件可以這樣抹掉**，臉或手要回頭改構圖。`);
