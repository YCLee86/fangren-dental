#!/usr/bin/env node
/* 從科別插畫裡抽一段人物出來，做成**只有線條**的綠色 PNG → assets/lineart-<spec>.png
 *
 *   node tools/topic-lineart.mjs <spec> [--region A|B] [--out <檔>]      ← 從插畫抽線（舊路）
 *   node tools/topic-lineart.mjs <spec> --art <線稿檔> [--out <檔>]      ← 接生成的線稿（現行）
 *
 * ⚠⚠ **2026-08-22：抽線那條路使用者退回了**（「這不是我要的，跟我找的範例還是差很多，
 *   你們做成圖片提示詞好了」）。成因是方法本身不是參數：從**有陰影、有材質**的插畫上
 *   撿邊，筆畫的粗細跟著原圖明暗走、材質與皺褶也會變成線 —— 後製拿不掉。
 *   **要一個「畫出來的」風格就得畫。** 提示詞在 drafts/topic-lineart-prompt.md。
 *   抽線的程式碼留著（--region 那條），是為了記住那條路長什麼樣，不是還在用。
 *
 * 2026-08-22 使用者提的：著陸頁上沒有那張分享圖，但「把圖片放進來會壓縮到版面，
 * 我不要那樣。我想到把圖片的某個部分做成頁面的底，但只要保留線條，
 * 而且是做成一般牙科的主題綠」。他還指定了取哪一段：
 * 「畫面中間的女醫事人員和老先生對話的部分，或是右邊兩個醫事人員輕鬆自然
 *   和其他人打招呼的樣子，應該節錄他們的半身就好」。
 *
 * ⚠⚠ **線稿不是「把暗的地方留下來」。** 用絕對亮度去砍，頭髮、深色褲子、
 *   門框整塊都會變成色塊 —— 那不是線稿，是剪影。這一支用的是
 *   **「比周圍暗多少」**（局部平均 − 自己）：大片暗區裡的局部平均也是暗的，
 *   差值自然小，所以只有**筆畫**留得下來。
 *
 * ⚠⚠ **線一律平塗，alpha 只有 0 或 1**（2026-08-22 使用者看過五張參考圖之後指定：
 *   「注意到這些風格的類似相同特色 —— 他們的線條沒有分濃度，我要的是這樣。
 *     把線條再單純一點，主題色的濃淡效果我來選」）。
 *   第一版用軟漸變（alpha 跟著「暗多少」連續變化），做出來是**鉛筆素描**不是線稿。
 *   ⚠ 濃淡由**頁面那一側的 opacity** 統一控制，不要回到圖裡做。
 *
 * ⚠⚠ **要先放大再取線，取完再侵蝕收細。** 原圖那一段只有 228px 寬、筆畫本身
 *   就佔 2~3px，直接取線的話線寬佔畫面 1/76，而參考圖大約是 1/300 —— 太粗。
 *   做法：裁切放大 4 倍（局部平均的半徑與取樣間隔跟著乘）→ 二值化 → 侵蝕 3 次。
 *   **輸出留在放大後的解析度**，擺到頁面上（約 300px 寬）筆畫才會細。
 *   ⚠ 侵蝕 5 次以上淡的線會先斷掉（男醫師的五官會不見），3 是實測的上限。
 *
 * ⚠ **不做四邊淡出** —— 淡出本身就是一種濃淡變化，和「線不分濃度」互相矛盾。
 *   參考圖也都是規規矩矩的長方形，內容自己收在裡面。
 *
 * ⚠ 顏色取 PALETTE.md 各科的**套色**那一階 —— 這是「填在頁面上的圖形」不是
 *   白底上的字，用深階會太重。實際濃度由頁面那一側的 opacity 控制。
 *
 * ⚠⚠ **原檔是 drafts/og-topic-<spec>-src.jpg**（1422×752），不是 assets/ 底下
 *   那張已經疊過帶子的成品 —— 疊過的那張上緣有玻璃帶，抽出來會多一條橫線。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* 各科的套色（PALETTE.md）。和 tools/og-plate.mjs 的 ACCENT 是同一組值。 */
const ACCENT = {
  general: "#3f654a", perio: "#317d78", kids: "#c28229", endo: "#ae4f4d",
  prosth: "#335b8b", surg: "#8e6299", ortho: "#4478b5",
};

/* 半身的裁切（在 1422×752 的原檔上量的）。
   量法：頭頂往上留一點、腰際切齊 —— Ａ 的腰際卡在腳踏車手把（y≈505），
   Ｂ 的腰際在助理拿飲料的手附近（y≈540）。 */
const REGIONS = {
  general: {
    A: { x: 612, y: 330, w: 312, h: 196, name: "中間・女醫師與老先生在門口說話" },
    B: { x: 972, y: 348, w: 228, h: 196, name: "右邊・兩位醫事人員打招呼" },
  },
};

/* 線稿的參數（都是實測出來的，見上面檔頭）：
   SCALE 放大倍率／R 局部平均的半徑（在放大後的解析度上）／
   T 二值化門檻（愈高，愈細的紋理線愈早消失）／ERODE 侵蝕幾次（收細）／
   MIN_INK 清雜點：連通區域小於這個大小就丟掉。 */
const SCALE = 4, R_MEAN = 7, T = 22, ERODE = 3;

const args = process.argv.slice(2);
const spec = args[0];
if (!spec || !ACCENT[spec]) {
  console.error("用法：node tools/topic-lineart.mjs <spec> [--region A|B]");
  console.error("spec：" + Object.keys(ACCENT).join(" / "));
  process.exit(1);
}
const artIdx = args.indexOf("--art");
const ART = artIdx >= 0 ? path.resolve(ROOT, args[artIdx + 1]) : null;
/* --crop x,y,w,h：先在原圖上裁一塊再處理（只有 --art 那條路吃它）。
   ⚠ 生成的線稿常常會多畫一條「地面線」，還會留一大圈空白 ——
     那條橫線擺到頁面上會變成一條莫名其妙的橫槓，空白則讓定位很難算。
     裁掉之後圖檔就等於內容本身，頁面那一側只要管大小與位置。 */
const cIdx = args.indexOf("--crop");
const CROP = cIdx >= 0 ? args[cIdx + 1].split(",").map(Number) : null;
if (CROP && (CROP.length !== 4 || CROP.some((n) => !Number.isFinite(n)))) {
  console.error("× --crop 要四個數字：x,y,w,h"); process.exit(1);
}
const rIdx = args.indexOf("--region");
const rk = rIdx >= 0 ? args[rIdx + 1] : "B";
const R = ART ? null : REGIONS[spec]?.[rk];
if (!ART && !R) { console.error(`× ${spec} 沒有區塊 ${rk}（有的：${Object.keys(REGIONS[spec] || {}).join(" / ") || "無"}）`); process.exit(1); }

const SRC = ART || path.join(ROOT, "drafts", `og-topic-${spec}-src.jpg`);
if (!fs.existsSync(SRC)) { console.error(`× 找不到原檔 ${path.relative(ROOT, SRC)}`); process.exit(1); }
const oIdx = args.indexOf("--out");
const OUT = oIdx >= 0 ? path.resolve(ROOT, args[oIdx + 1]) : path.join(ROOT, "assets", `lineart-${spec}.png`);

const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;   // ⚠ headless_shell 排在前面（CLAUDE.md 第九節第 18 條）
})();
const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) throw new Error("找不到 Playwright");

const rgb = [1, 3, 5].map((i) => parseInt(ACCENT[spec].slice(i, i + 2), 16));
const browser = await chromium.launch({ executablePath: chromePath });
const pg = await browser.newPage();
const mime = /\.png$/i.test(SRC) ? "image/png" : "image/jpeg";
const uri = `data:${mime};base64,${fs.readFileSync(SRC).toString("base64")}`;

/* ---- --art：來源**本來就是線稿**（模型生成的，近白底、單色線）------------
   只做一件事：把底色變透明、把線統一成該科的套色。
   ⚠⚠ **不要再做局部平均或侵蝕** —— 那些是為了「從有陰影的插畫上撿邊」而存在的，
     來源已經是平的，再處理只會把它弄壞（線會斷、邊會啃掉一圈）。
   ⚠ alpha 直接由亮度反推：白 → 全透明、線 → 不透明。
     只在最靠近門檻的一小段留過渡，讓邊緣不要有鋸齒 —— 那是抗鋸齒，不是濃淡。 */
const artRes = ART ? await pg.evaluate(async ({ uri, rgb, CROP }) => {
  const im = new Image(); im.src = uri; await im.decode();
  if (CROP && (CROP[0] + CROP[2] > im.naturalWidth || CROP[1] + CROP[3] > im.naturalHeight)) {
    return { err: `--crop 超出原檔（原檔 ${im.naturalWidth}×${im.naturalHeight}）` };
  }
  const W = CROP ? CROP[2] : im.naturalWidth, H = CROP ? CROP[3] : im.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (CROP) g.drawImage(im, CROP[0], CROP[1], W, H, 0, 0, W, H);
  else g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  /* ⚠ 來源必須是**不透明**的（模型生成的就是）。餵透明底的 PNG 進來的話，
     透明處讀出來是黑的，底色會量成 0、整張變成全透明 —— 而且不報錯。 */
  let clear = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 250) clear++;
  if (clear / (W * H) > 0.02) return { err: "這張有透明區（" + (100 * clear / (W * H)).toFixed(1) + "%）——--art 要的是模型生成的**不透明**線稿（近白底、深色線）" };
  /* 先量底色（出現最多的亮度），門檻取「底色往下」 */
  const hist = new Array(256).fill(0);
  for (let i = 0; i < d.length; i += 4) hist[Math.round(d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114)]++;
  let bg = 0; for (let v = 0; v < 256; v++) if (hist[v] > hist[bg]) bg = v;
  const hi = bg * 0.90, lo = bg * 0.62;
  const out = g.createImageData(W, H); let ink = 0, mid = 0;
  for (let i = 0, k = 0; i < d.length; i += 4, k += 4) {
    const L = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
    let a = (hi - L) / (hi - lo);
    a = Math.max(0, Math.min(1, a));
    if (a > 0.5) ink++;
    if (a > 0.1 && a < 0.9) mid++;
    out.data[k] = rgb[0]; out.data[k + 1] = rgb[1]; out.data[k + 2] = rgb[2];
    out.data[k + 3] = Math.round(a * 255);
  }
  g.putImageData(out, 0, 0);
  return { data: c.toDataURL("image/png"), ink: ink / (W * H), mid: mid / (W * H), bg, W, H };
}, { uri, rgb, CROP }) : null;

const res = artRes || await pg.evaluate(async ({ uri, R, rgb, SCALE, R_MEAN, T, ERODE }) => {
  const im = new Image(); im.src = uri; await im.decode();
  if (R.x + R.w > im.naturalWidth || R.y + R.h > im.naturalHeight) {
    return { err: `區塊超出原檔（原檔 ${im.naturalWidth}×${im.naturalHeight}）` };
  }
  const W = R.w * SCALE, H = R.h * SCALE;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.drawImage(im, R.x, R.y, R.w, R.h, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H).data;
  const L = new Float32Array(W * H);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) L[j] = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
  /* 局部平均。⚠ 半徑與取樣間隔都要跟著放大倍率走，否則放大之後等於在看更細的尺度。 */
  const r = R_MEAN * SCALE, step = SCALE;
  const mean = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0, n = 0;
    for (let dy = -r; dy <= r; dy += step) for (let dx = -r; dx <= r; dx += step) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
      s += L[yy * W + xx]; n++;
    }
    mean[y * W + x] = s / n;
  }
  /* 二值化 —— alpha 只有 0 或 1 */
  let on = new Uint8Array(W * H);
  for (let j = 0; j < L.length; j++) on[j] = (mean[j] - L[j]) > T ? 1 : 0;
  /* 侵蝕收細（4 鄰域） */
  for (let it = 0; it < ERODE; it++) {
    const nx = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const j = y * W + x; if (!on[j]) continue;
      const u = y > 0 ? on[j - W] : 0, dn = y < H - 1 ? on[j + W] : 0;
      const l = x > 0 ? on[j - 1] : 0, rr = x < W - 1 ? on[j + 1] : 0;
      nx[j] = (u && dn && l && rr) ? 1 : 0;
    }
    on = nx;
  }
  /* 清雜點：連通區域太小的丟掉（門檻跟著面積的倍率走） */
  const lab = new Int32Array(W * H).fill(-1), size = [], st = new Int32Array(W * H);
  let nl = 0;
  for (let j = 0; j < on.length; j++) {
    if (!on[j] || lab[j] >= 0) continue;
    let sp = 0; st[sp++] = j; lab[j] = nl; let cnt = 0;
    while (sp) {
      const q = st[--sp]; cnt++; const qx = q % W, qy = (q / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const yy = qy + dy, xx = qx + dx;
        if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
        const k = yy * W + xx; if (on[k] && lab[k] < 0) { lab[k] = nl; st[sp++] = k; }
      }
    }
    size.push(cnt); nl++;
  }
  const MIN_INK = 14 * SCALE * SCALE / 3;
  const out = g.createImageData(W, H); let ink = 0;
  for (let j = 0, k = 0; j < on.length; j++, k += 4) {
    const a = (on[j] && size[lab[j]] >= MIN_INK) ? 255 : 0;
    if (a) ink++;
    out.data[k] = rgb[0]; out.data[k + 1] = rgb[1]; out.data[k + 2] = rgb[2]; out.data[k + 3] = a;
  }
  g.putImageData(out, 0, 0);
  return { data: c.toDataURL("image/png"), ink: ink / (W * H), W, H };
}, { uri, R, rgb, SCALE, R_MEAN, T, ERODE });
await browser.close();

if (res.err) { console.error("× " + res.err); process.exit(1); }
/* ⚠ 一道守門：線太少就是參數壞了（或裁到了空白的牆），寧可讓它出聲。 */
if (res.ink < 0.02) {
  console.error(`× 抽出來的線只佔 ${(res.ink * 100).toFixed(1)}%，太少了 —— 參數或裁切不對。`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, Buffer.from(res.data.split(",")[1], "base64"));
if (ART) {
  /* ⚠ 交件門檻（drafts/topic-lineart-prompt.md）：線佔 4~6%。
     過渡帶（半透明的像素）太多就表示來源不是平的線稿 —— 那多半是拿錯圖。 */
  console.log(`線稿 ${path.relative(ROOT, SRC)}　底色亮度 ${res.bg}　線佔 ${(res.ink * 100).toFixed(1)}%　過渡帶 ${(res.mid * 100).toFixed(2)}%`);
  /* ⚠ 這個門檻是對「整張未裁的圖」說的 —— 裁掉四周的空白之後，同樣的線會佔到
     兩倍以上，那不是變糟。所以有 --crop 時不比。 */
  if (!CROP && res.ink > 0.12) console.log("  ⚠ 線佔超過 12% —— 參考圖量到的是 4~6%，這張可能有填色或陰影。");
  if (res.mid > 0.06) console.log("  ⚠ 過渡帶偏多 —— 來源可能不是平塗的線稿（有濃淡或模糊）。");
} else {
  console.log(`${rk} ${R.name}　原檔 x${R.x} y${R.y} ${R.w}×${R.h} → 輸出 ${res.W}×${res.H}（放大 ${SCALE}×）　線佔 ${(res.ink * 100).toFixed(1)}%`);
}
console.log(`✓ ${path.relative(ROOT, OUT)}  ${res.W}×${res.H}  ${(fs.statSync(OUT).size / 1024).toFixed(1)}KB`);
