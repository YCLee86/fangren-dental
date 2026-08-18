/* =============================================================================
   assets/logo.png — 給 Google 的 Organization logo（結構化資料用）
   -----------------------------------------------------------------------------
       node tools/logo-png.mjs           算一次，寫檔
       node tools/logo-png.mjs --check   只比對，不寫檔；不一致就回傳非零

   這一張**不是畫面上的圖**，站上任何一頁都不會顯示它。它只出現在首頁 JSON-LD
   的 Dentist 節點裡（clinic.json 的 `logo` → tools/schema.mjs 產生 ImageObject），
   用途是告訴 Google「這家診所的官方標誌長這樣」。

   ⚠ 和站上另外三顆圖示是四件不同的事，不要合併，也不要互相「統一」：

     assets/favicon.svg     分頁列。透明底、兩色、牙洞放大 1.6 倍（對抗 16px 抗鋸齒）
     favicon.ico            Google 的圖示爬蟲（搜尋結果標題旁那顆）。由 favicon-ico.mjs 算
     assets/icon-192.png    iOS／Android 主畫面。**不透明白底**、牙洞另一個比例、
                            而且顏色是被 iOS 玻璃效果補償過的 #205533
     assets/logo.png        ← 這一支。**透明底**、品牌真值 #3f654a、頁首那顆的牙洞比例

   -----------------------------------------------------------------------------
   三個決定（2026-08-19，使用者從 Ⓐ／Ⓑ 兩案挑了 Ⓐ）

   1. **顏色用品牌真值 #3f654a，不套 iOS 玻璃補償。**
      app-icons.mjs 會把綠先調暗成 #205533，疊上 iOS 26 的玻璃效果之後才還原成
      #3f654a。Google 不套那層效果，補償過的值送過去就是實打實偏暗的綠。
      ⚠ 所以**不能直接拿 assets/icon-192.png 來當 logo** —— 那張圖的顏色是為了
        iOS 調校過的成品，不是通用標誌檔。（一度就是這樣提議的，被自己量出來擋下。）

   2. **底是透明的。** 主畫面那顆非要不透明底不可（iOS 會把帶 alpha 的
      apple-touch-icon 壓在純黑上），這裡沒有那個限制。
      ⚠ 但**透明不等於在深色底上好看** —— 標誌是暗綠，底一暗就快看不見了。
        這是使用者看過四種底色的對照表之後接受的已知取捨，不是漏掉。
        日後真的要解，是「另做一個深色底專用的亮色版」，那要先回 PALETTE.md
        決定用哪一階綠，不是把這一張改一改。

   3. **牙洞用「站上頁首那一條」的比例（Ⓐ），不是 icon.svg 的（Ⓑ）。**
      真貝茲極值量出來，兩者外框形狀完全相同（長寬比 2.02926 vs 2.02918），
      但牙洞佔外框寬 0.102514 vs 0.093080 —— icon.svg 那顆**小 9.2%**。
      取頁首那一條的理由和第 1 點同一條：icon.svg 的洞是為了扛 iOS 產生捷徑時
      約 4~5px 的柔化而調過的，那是裝置補償，不該帶進通用標誌檔；
      而頁首那一條正是訪客在網站上看到的那顆。
      ⚠⚠ assets/icon.svg 的註解寫「牙洞放大 1.18 倍」，**方向和實測相反**
        （量到的是 ×0.908）。那筆落差還沒查清楚，不影響這一支，但別拿那句話
        當依據去改任何東西 —— 見 CLAUDE.md 第九節。

   -----------------------------------------------------------------------------
   幾何：路徑直接從 index.html 頁首那個 <svg> 讀，不在這裡抄第二份

   理由同 clinic.json 的規則：畫面上已經有的東西不重抄，抄第二份的下場一定是
   哪天兩邊不一樣然後沒有人發現。頁首那條路徑的座標不是從 0 起算的
   （x 從 232.87、y 從 333.83），所以下面要先把它搬回原點再縮放。
   ⚠ 少了那道位移，路徑會整條落在 viewBox 外面 —— Chromium **不會報錯**，
     產出一張完全透明的空圖。（踩過。）

   版面：畫布 1200×600，標誌縮到 1000 寬（＝ 1000×492.81），左右各留 100px、
   上下各留 53.6px。2:1 的畫布是為了讓 2.029:1 的標誌四周都有一點餘裕。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "assets", "logo.png");
const CHECK_ONLY = process.argv.includes("--check");

const BRAND = "#3f654a";            // 一般牙科的「套色」＝ 品牌真值
const W = 1200, H = 600;            // 畫布
const MARKW = 1000;                 // 標誌寬
const RATIO = 2.02918;              // 標誌的長寬比（原始外框 68.6097 × 33.8115 pt）

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

/* ---------- 從 index.html 頁首取出標誌路徑 ---------- */
function headerPath() {
  const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
  const svg = home.match(/<svg[^>]*viewBox="0 0 44\.2873 21\.8244"[^>]*>[\s\S]*?<\/svg>/);
  if (!svg) throw new Error("index.html 裡找不到頁首那個標誌 <svg>（viewBox 0 0 44.2873 21.8244）");
  const d = svg[0].match(/\sd="([^"]+)"/);
  if (!d) throw new Error("頁首的標誌 <svg> 裡找不到 <path d=…>");
  return d[1];
}

/* ---------- 路徑的真實外框（三次貝茲的極值，不是控制點的框） ----------
   控制點通常落在曲線外面，拿控制點當框會高估，這一站的牙洞尤其明顯
   （控制點框 0.1025 vs 真極值 0.1025 差不多，但外框那條差很多）。 */
function trueBBox(d) {
  const toks = d.match(/[MCZ]|-?\d+\.?\d*/g);
  let xs = [], ys = [], pt = null, i = 0;
  const ext = (p0, p1, p2, p3, k) => {
    const a = -p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k];
    const b = 2 * (p0[k] - 2 * p1[k] + p2[k]);
    const c = -p0[k] + p1[k];
    const ts = [0, 1];
    if (Math.abs(a) < 1e-12) { if (Math.abs(b) > 1e-12) ts.push(-c / b); }
    else {
      const D = b * b - 4 * a * c;
      if (D >= 0) { const r = Math.sqrt(D); ts.push((-b + r) / (2 * a), (-b - r) / (2 * a)); }
    }
    return ts.filter((t) => t >= 0 && t <= 1).map((t) => {
      const m = 1 - t;
      return m ** 3 * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t ** 3 * p3[k];
    });
  };
  while (i < toks.length) {
    const t = toks[i];
    if (t === "M") { pt = [+toks[i + 1], +toks[i + 2]]; xs.push(pt[0]); ys.push(pt[1]); i += 3; }
    else if (t === "C") {
      const p1 = [+toks[i + 1], +toks[i + 2]], p2 = [+toks[i + 3], +toks[i + 4]], p3 = [+toks[i + 5], +toks[i + 6]];
      xs.push(...ext(pt, p1, p2, p3, 0)); ys.push(...ext(pt, p1, p2, p3, 1));
      pt = p3; i += 7;
    } else i += 1;
  }
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

/* ---------- 找 Chromium ----------
   ⚠⚠ **headless_shell 一定要排在完整版 chrome 前面。**
   雲端容器裡那支完整版 chrome，實際畫出來的高度比 --window-size 少 87px
   （視窗外框），而 PNG 仍然輸出完整尺寸 —— 底部那一截靜靜地變成空白，
   **不會有任何錯誤訊息**。2026-08-19 踩過：標誌下緣被平切 33px，
   透明度、顏色、牙洞三項檢查全過，是使用者看圖才發現的。
   下面 inspect() 的「長寬比」與「下緣要收窄」兩道檢查就是為了擋這一種。
   （app-icons.mjs 的候選清單也是這個順序，不要改。） */
const chromeCandidates = () => {
  const out = [];
  if (process.env.CHROME_PATH) out.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) out.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) {
      out.push(path.join(pw, d, "chrome-linux", "chrome"));
      out.push(path.join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      out.push(path.join(pw, d, "chrome-win", "chrome.exe"));
    }
  }
  out.push("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");
  return out;
};

/* ---------- 解 PNG（8-bit、非交錯；容器裡沒有 PIL 也沒有 ImageMagick） ---------- */
function decode(buf) {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const depth = buf.readUInt8(24), colour = buf.readUInt8(25);
  if (depth !== 8) throw new Error(`只認得 8-bit，實際 ${depth}`);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colour];
  if (!ch) throw new Error(`不認得的色彩型態 ${colour}`);
  const parts = [];
  for (let off = 8; off + 8 <= buf.length;) {
    const len = buf.readUInt32BE(off);
    if (buf.toString("ascii", off + 4, off + 8) === "IDAT") parts.push(buf.subarray(off + 8, off + 8 + len));
    off += len + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(parts));
  const stride = w * ch, px = Buffer.alloc(h * stride);
  let o = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[o++];
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let v = raw[o + x];
      if (f === 1) v += a; else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
    o += stride;
  }
  return { w, h, ch, colour, px };
}

/* ---------- 保險絲 ----------
   四道，每一道都對應一種「Chromium 不報錯、圖卻是壞的」的情況：
     ① 型態要是 RGBA（6）        —— 底沒透明的話會是 2
     ② 不透明像素只准有品牌色     —— 混到別的顏色代表補償或填色被改壞
     ③ 長寬比要對                —— 上下被截、或縮放算錯
     ④ 下緣要收窄                —— 被平切的話最後一列會突然很寬（③ 抓不到的邊界情況）
*/
function inspect(buf) {
  const { w, h, ch, colour, px } = decode(buf);
  if (colour !== 6) throw new Error(`底應該是透明的（RGBA／型態 6），實際型態 ${colour}`);

  const rows = [], cols = new Set();
  const opaque = new Map();
  let nAlpha0 = 0;
  for (let y = 0; y < h; y++) {
    let n = 0;
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * ch, a = px[o + 3];
      if (a === 0) { nAlpha0++; continue; }
      n++; cols.add(x);
      if (a === 255) {
        const k = `#${px[o].toString(16).padStart(2, "0")}${px[o + 1].toString(16).padStart(2, "0")}${px[o + 2].toString(16).padStart(2, "0")}`;
        opaque.set(k, (opaque.get(k) || 0) + 1);
      }
    }
    rows.push(n);
  }
  const ys = rows.map((n, y) => (n ? y : -1)).filter((y) => y >= 0);
  if (!ys.length) throw new Error("整張圖是空的 —— 路徑多半落在 viewBox 外面（頁首那條要先搬回原點）");

  const mh = ys[ys.length - 1] - ys[0] + 1;
  const xs = [...cols].sort((a, b) => a - b);
  const mw = xs[xs.length - 1] - xs[0] + 1;

  const kinds = [...opaque.entries()].sort((a, b) => b[1] - a[1]);
  if (kinds[0][0] !== BRAND) throw new Error(`不透明像素最多的顏色是 ${kinds[0][0]}，應該是 ${BRAND}`);
  const purity = kinds[0][1] / [...opaque.values()].reduce((a, b) => a + b, 0);
  if (purity < 0.999) throw new Error(`不透明像素混到別的顏色（${BRAND} 只佔 ${(purity * 100).toFixed(1)}%）`);

  const ratio = mw / mh;
  if (Math.abs(ratio - RATIO) > 0.02) {
    throw new Error(`標誌長寬比 ${ratio.toFixed(4)} 對不上 ${RATIO} —— 多半是上下被截（見檔頭 headless_shell 那段）`);
  }
  const tail = ys.slice(-4).map((y) => rows[y]);
  if (!(tail[tail.length - 1] < tail[0] * 0.5)) {
    throw new Error(`下緣沒有收窄（最後四列 ${tail.join("→")}）—— 形狀被平切了`);
  }
  return { w, h, mw, mh, ratio, tail, transparent: nAlpha0 / (w * h) };
}

/* ---------- 算 ---------- */
const chrome = chromeCandidates().find((p) => p && fs.existsSync(p));
if (!chrome) throw new Error("找不到 Chromium —— 設 CHROME_PATH 指到一支，或裝 playwright 的瀏覽器");

const d = headerPath();
const bb = trueBBox(d);
const s = MARKW / bb.w;
const mh = bb.h * s;
const tx = (W - MARKW) / 2, ty = (H - mh) / 2;

const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="芳仁牙醫診所">
  <g transform="translate(${tx} ${ty}) scale(${s}) translate(${-bb.x} ${-bb.y})">
    <path fill="${BRAND}" fill-rule="evenodd" d="${d}"/>
  </g>
</svg>`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "logo-"));
const page = path.join(dir, "p.html");
const png = path.join(dir, "logo.png");
fs.writeFileSync(page,
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0}` +
  `svg{display:block;width:${W}px;height:${H}px}</style>${svg}`, "utf8");

const isShell = path.basename(chrome).startsWith("headless_shell");
execFileSync(chrome, [
  ...(isShell ? [] : ["--headless"]),
  "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
  "--default-background-color=00000000",        // 透明底
  `--screenshot=${png}`, `--window-size=${W},${H}`,
  `--user-data-dir=${path.join(dir, "profile")}`, `file://${page}`,
], { stdio: ["ignore", "ignore", "pipe"] });

if (!fs.existsSync(png)) throw new Error("Chromium 沒有產出 PNG");
const buf = fs.readFileSync(png);
const info = inspect(buf);

console.log(`  來源：index.html 頁首的標誌路徑（外框 ${bb.w.toFixed(4)} × ${bb.h.toFixed(4)}）`);
console.log(`  畫布 ${info.w}×${info.h}・標誌 ${info.mw}×${info.mh}・長寬比 ${info.ratio.toFixed(5)}`);
console.log(`  透明 ${(info.transparent * 100).toFixed(1)}%・下緣收窄 ${info.tail.join("→")}・顏色 ${BRAND}`);

const same = fs.existsSync(DEST) && fs.readFileSync(DEST).equals(buf);
if (CHECK_ONLY) {
  console.log(same ? "assets/logo.png 是最新的" : "⚠ assets/logo.png 和重算的結果不一樣");
  process.exit(same ? 0 : 1);
}
if (same) { console.log("assets/logo.png 是最新的"); }
else { fs.writeFileSync(DEST, buf); console.log(`已寫入 assets/logo.png（${(buf.length / 1024).toFixed(1)}KB）`); }
