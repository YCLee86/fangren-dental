/* 夜間模式的提案頁產生器（2026-09-15 開）。
 *   node tools/night-mode-preview.mjs
 *   → preview/night-mode/index.html              首頁
 *     preview/night-mode/posts/<slug>/index.html  十三篇文章
 *     preview/night-mode/topics/<spec>/index.html 七科著陸頁
 *
 * 起點：使用者給了 https://snowmed-taiwan.com/ ，「看他有設定白天／夜間模式，
 * 然後做一個診所網站夜間模式的提案頁給我看」。那一站的做法（2026-09-15 實際量的）：
 *   ・預設深色，<head> 裡一小段腳本讀 localStorage 'snowmed:theme'，不看系統的深色設定。
 *   ・開關在頁首最右邊，整站配色是一組 CSS 變數，[data-theme] 整組換掉。
 *
 * 六輪之後已經挑定的（每一格的推導在 git log 與 CLAUDE.md 第八節那一條）：
 *   ・配色 Ⓑ 窄帶藍灰：HERO 底下那條窄帶的漸層（照片的夜空 × 柏油）。分隔線與次要文字兩階
 *     沒有現成值，是「同色相、亮度對齊 PALETTE.md 第四節 A 暗夜那兩階」算出來的。
 *   ・七科的字階在深底上**同色相同彩度、只提亮度**到 4.5:1（PALETTE.md 第六之七節 favicon 深色版那條做法）。
 *   ・沒選到的藥丸 ＝ 套色混 20% 進卡色的淡色塊，字按那塊底重算到 4.5。
 *   ・地圖 Ⓜ1 路比街廓亮；白字釘回 #f4f4f5、停車場熄滅態釘回 #7a7d77。
 *   ・門診圓點次要文字色；沒這科的那一顆 ＝ 次要文字混 35% 進卡色。
 *   ・開關：iOS 那種滑桿、沒有字，太陽／月亮畫在圓鈕上，Ⓑ 軌道是天色（白天 #c28229、夜間 #365685、白鈕）。
 *     首頁與七科放在「主題與科別」那一行最右邊，文章頁放在頂端那一行（首頁 › 科別 › 日期 › 瀏覽數）最右邊。
 *   ・預設跟著系統的 prefers-color-scheme（手機電腦同一條），**按過就記在 localStorage 'fangren:theme'**，
 *     下次打開、換到別頁都照那一種（2026-09-15 第八輪，使用者：「讓網站記住每個人按過的選擇」）。
 *
 * ⚠ 提案頁的規矩（CLAUDE.md 第八節）照做：SEO 區塊換成 noindex、data-views-self 降成 data-views
 *   （不灌計數、還印得出真數字）、切換條插在最後一個 </body> 前面、class 一律 pv 前綴。
 * ⚠⚠ 這一份是**整站的鏡像**（首頁／posts／topics 保持原本的相對位置），所以頁面之間的相對連結
 *   不必改、點來點去都停在提案頁裡；要改的只有兩種：資產一律改成根目錄的 /assets/，
 *   以及寫成根目錄的站內連結（著陸頁的 /topics/…、「全部」那顆 /#topics）改指到 /preview/night-mode/。
 *   ⚠ 頁首放大鏡在文章頁按 Enter 會送回**正式站**首頁（assets/head-search.js 寫死 /?q=），提案頁不處理。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "preview/night-mode");
const BASE = "/preview/night-mode/";
const KEY = "fangren:theme";

/* ---------- 色彩計算（sRGB ↔ CIE L*C*h，D65） ---------- */
const hex2rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const lum = (x) => { const [r, g, b] = hex2rgb(x).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
const W = [0.95047, 1, 1.08883];
function toLch(x) {
  const [r, g, b] = hex2rgb(x).map(lin);
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / W[0], Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / W[2];
  const L = 116 * f(Y) - 16, A = 500 * (f(X) - f(Y)), B = 200 * (f(Y) - f(Z));
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}
function fromLch(L, C, H) {
  for (let c = C; c >= 0; c -= 0.25) {
    const A = c * Math.cos(H), B = c * Math.sin(H), fy = (L + 16) / 116;
    const X = W[0] * fi(fy + A / 500), Y = fi(fy), Z = W[2] * fi(fy - B / 200);
    const rgb = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z].map(unlin);
    if (rgb.every((v) => v >= -0.001 && v <= 1.001))
      return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
  }
  throw new Error("色域外");
}
function liftTo(hex, bgs, target) {
  const [, C, H] = toLch(hex);
  for (let L = toLch(hex)[0]; L <= 98; L += 0.25) {
    const c = fromLch(L, C, H);
    if (bgs.every((b) => cr(c, b) >= target)) return c;
  }
  throw new Error("推不到 " + hex);
}
const mix = (a, b, p) => "#" + hex2rgb(a).map((v, i) => Math.round((v * p + hex2rgb(b)[i] * (1 - p)) * 255).toString(16).padStart(2, "0")).join("");

/* ---------- 夜間配色（Ⓑ 窄帶藍灰） ---------- */
const A_CARD = "#211e1b", A_RULE = "#38342f", A_SOFT = "#aaa49e";   /* PALETTE.md 第四節 A，只拿來對齊亮度 */
const P = { paper: "#17191d", card: "#282b31", ink: "#e2e5e6" };
{
  const [, Cb, Hb] = toLch(P.card);
  P.rule = fromLch(toLch(P.card)[0] + (toLch(A_RULE)[0] - toLch(A_CARD)[0]), Cb, Hb);
  const [, Cp, Hp] = toLch("#e2e5e6");
  P.soft = fromLch(toLch(A_SOFT)[0], Cp, Hp);
}
const FILL = { all: "#5f5d5c", general: "#3f654a", prosth: "#465885", perio: "#317d78", ortho: "#4478b5", endo: "#ae4f4d", surg: "#8e6299", kids: "#c28229" };
/* 白天的字階：首頁與著陸頁（index.html）對卡算、文章頁（assets/style.css）對紙算，兒牙那一階兩邊不一樣 */
const DEEP_HOME = { all: "#4c4948", general: "#2c5238", prosth: "#2a4677", perio: "#2a6d69", ortho: "#31637f", endo: "#89202d", surg: "#784e84", kids: "#9e6301" };
const DEEP_POST = { ...DEEP_HOME, kids: "#915800" };
const SWATCH = { teal: "#214D48", taupe: "#7D5A58", blue: "#3C596B", moss: "#5D6D55", brick: "#AF4C52" };
const LIFT = Object.fromEntries(Object.entries(SWATCH).map(([n, c]) => [n, liftTo(c, [P.paper, P.card], 4.5)]));
const specVars = (deep) => Object.keys(FILL).map((s) => {
  const d = liftTo(deep[s], [P.paper, P.card], 4.5);
  const pillBg = mix(FILL[s], P.card, 0.2);
  return { s, d, pill: liftTo(deep[s], [pillBg], 4.5), pillBg, sk: liftTo(deep[s], [mix(FILL[s], P.card, 0.12)], 4.5) };
});
const SPEC_HOME = specVars(DEEP_HOME), SPEC_POST = specVars(DEEP_POST);
const [Lc, Cc, Hc] = toLch(P.card);
const MAP = { bg: P.card, road: fromLch(Lc + 16, Cc, Hc), ink: P.ink, park: liftTo("#365685", [P.card, mix("#365685", P.card, 0.1)], 4.5) };
const DOT_FAINT = mix(P.soft, P.card, 0.35);
const SW = { d: { track: "#c28229", knob: "#ffffff", icon: "#c28229" }, n: { track: "#365685", knob: "#ffffff", icon: "#365685" } };

/* ---------- 2026-09-15 第九輪：著陸頁的線稿浮水印 ----------
   使用者：「浮水印我想不到要怎麼辦」。圖檔本身是用該科的**套色**畫的線（tools/topic-lineart.mjs），
   濃度是白天逐科逐斷點挑的（.10～.48）；壓在深底上就是一團暗暗的污漬。三案，**濃度一律沿用白天那一格**：
     Ⓦ1 線條提亮：filter: brightness(k)，k 取到線色對底剛好 4.5（＝同色相只提亮度，和字階同一條做法）
     Ⓦ2 月光灰：grayscale(1) ＋ brightness 到次要文字的亮度，再乘 .6 的濃度
     Ⓦ3 夜間不放 */
const scaleHex = (hex, k) => "#" + hex2rgb(hex).map((v) => Math.round(Math.min(1, v * k) * 255).toString(16).padStart(2, "0")).join("");
const WM = {};
for (const s of ["general", "perio", "endo", "kids", "ortho", "prosth", "surg"]) {
  let k1 = 1; while (cr(scaleHex(FILL[s], k1), P.paper) < 4.5 && k1 < 8) k1 += 0.05;
  const [r, g, b] = hex2rgb(FILL[s]); const grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const softGrey = hex2rgb(P.soft)[1];
  const k2 = softGrey / grey;
  const g2 = Math.round(Math.min(1, grey * k2) * 255).toString(16).padStart(2, "0");
  WM[s] = { k1: +k1.toFixed(2), c1: scaleHex(FILL[s], k1), k2: +k2.toFixed(2), c2: "#" + g2 + g2 + g2 };
}
/* ---------- 2026-09-15 第十輪：實心的浮水印 ----------
   使用者：「浮水印的問題不只是線條顏色不夠亮，而是人臉變黑色的 —— 這跟大家的辨認習慣很不一樣，
   感覺要換成實心的圖而不是線圖」。他是對的：線稿只有線，臉的內部是透明的，
   白天透出來的是紙色（亮），夜間透出來的是深底 ＝ 一張「負片」。提亮線條治不到這件事。
   → 把線圍起來的區域填滿、線本身挖空，夜間變成「亮的臉、暗的線」＝ 白天那張圖的明暗關係。
   ・Ⓢ1 實心・月光白（填夜間主文字 #e2e5e6）／Ⓢ2 實心・套色（填 Ⓦ1 那一階提亮過的套色）
   ・濃度：夜間一律用「次要文字壓在實心上仍有 4.5」算出來的上限（實心的面積比線大很多，白天那一格的濃度不能沿用）。 */
const WMOP = { o165: 0.165, o12: 0.12, o09: 0.09, o06: 0.06 };
const S_FILL = { s1: () => P.ink, s2: (s) => WM[s].c1 };
for (const s of Object.keys(WM)) {
  for (const k of ["s1", "s2"]) {
    const fillC = S_FILL[k](s);
    let a = 0; while (a < 0.6 && cr(P.soft, mix(fillC, P.paper, a + 0.005)) >= 4.5) a += 0.005;
    WM[s][k] = { fill: fillC, cap: +a.toFixed(3) };
  }
}
const WM_CSS = Object.entries(WM).map(([s, v]) =>
  `html[data-theme="dark"][data-wm="w1"] [data-topic="${s}"] .tp-intro::before { filter: brightness(${v.k1}); }
html[data-theme="dark"][data-wm="s1"] [data-topic="${s}"] .tp-intro::before { background-image: url("${BASE}lineart/${s}-s1.png"); opacity: var(--wm-op, ${v.s1.cap}); }
html[data-theme="dark"][data-wm="s2"] [data-topic="${s}"] .tp-intro::before { background-image: url("${BASE}lineart/${s}-s2.png"); opacity: ${v.s2.cap}; }`).join("\n") +
  `\nhtml[data-theme="dark"][data-wm="w3"] [data-topic] .tp-intro::before { display: none; }` +
  /* 2026-09-15 第十一輪：使用者選 Ⓢ1 月光白，「好像可以再深一點，讓這個底圖再不明顯一點，做幾版讓我挑」
     → 濃度一條尺（.165 是上一版的上限，往下三格）。 */
  Object.entries(WMOP).map(([k, v]) => `\nhtml[data-wmop="${k}"] { --wm-op: ${v}; }`).join("");

/* ---- PNG 讀寫（零依賴：zlib 解 IDAT、逐列反濾波；寫出時每列 filter 0） ---- */
import zlib from "node:zlib";
function readPng(file) {
  const b = fs.readFileSync(file);
  const w = b.readUInt32BE(16), hgt = b.readUInt32BE(20);
  if (b[24] !== 8 || b[25] !== 6 || b[28] !== 0) throw new Error("× 只吃 8-bit RGBA 非交錯：" + file);
  const idat = []; for (let o = 8; o < b.length;) { const len = b.readUInt32BE(o), t = b.toString("ascii", o + 4, o + 8); if (t === "IDAT") idat.push(b.subarray(o + 8, o + 8 + len)); o += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)), bpp = 4, stride = w * bpp, px = Buffer.alloc(hgt * stride);
  for (let y = 0; y < hgt; y++) {
    const ft = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[dst + x - bpp] : 0, up = y ? px[dst - stride + x] : 0, c = x >= bpp && y ? px[dst - stride + x - bpp] : 0;
      let v = raw[src + x];
      if (ft === 1) v += a; else if (ft === 2) v += up; else if (ft === 3) v += (a + up) >> 1;
      else if (ft === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      px[dst + x] = v & 255;
    }
  }
  return { w, h: hgt, px };
}
function writePng(file, w, hgt, px) {
  const crc = (buf) => zlib.crc32(buf);
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, "ascii"), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td) >>> 0); return Buffer.concat([len, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(hgt, 4); ih[8] = 8; ih[9] = 6;
  const raw = Buffer.alloc(hgt * (w * 4 + 1)); for (let y = 0; y < hgt; y++) px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
}
/* 線圍起來的區域：
   ⚠ 只從**上緣**往內灌「圖外面」—— 人物在下緣與左右緣是被裁掉的，從那幾邊灌會直接灌進身體裡。
   ⚠ 線有斷口（生成的線稿幾乎一定有），灌之前先把線加粗 GAP 當牆，灌完再把外面往回長 GAP，
     不然整個剪影會比輪廓胖一圈。 */
const GAP = 4;
const SEED_LEFT = new Set(["endo", "ortho"]);
function dilate(mask, w, hgt, r) {
  const tmp = new Uint8Array(mask.length), out = new Uint8Array(mask.length);
  for (let y = 0; y < hgt; y++) { let run = -1e9; for (let x = 0; x < w; x++) { if (mask[y * w + x]) run = x; if (x - run <= r) tmp[y * w + x] = 1; } run = 1e9; for (let x = w - 1; x >= 0; x--) { if (mask[y * w + x]) run = x; if (run - x <= r) tmp[y * w + x] = 1; } }
  for (let x = 0; x < w; x++) { let run = -1e9; for (let y = 0; y < hgt; y++) { if (tmp[y * w + x]) run = y; if (y - run <= r) out[y * w + x] = 1; } run = 1e9; for (let y = hgt - 1; y >= 0; y--) { if (tmp[y * w + x]) run = y; if (run - y <= r) out[y * w + x] = 1; } }
  return out;
}
function solidLineart(spec) {
  const { w, h: hgt, px } = readPng(path.join(ROOT, "assets", `lineart-${spec}.png`));
  const n = w * hgt, line = new Uint8Array(n);
  for (let i = 0; i < n; i++) line[i] = px[i * 4 + 3] > 60 ? 1 : 0;
  const wall = dilate(line, w, hgt, GAP), outside = new Uint8Array(n), q = new Int32Array(n);
  let qh = 0, qt = 0;
  for (let x = 0; x < w; x++) if (!wall[x]) { outside[x] = 1; q[qt++] = x; }
  /* ⚠ 顯微根管的吊臂、矯正的看片螢幕都碰到上緣，把左下那一大片背景和上緣隔開 ——
     只從上緣灌的話整片背景會被當成「圖裡面」填滿（第一版量到填了 79～81%）。
     這兩科加灌左緣；其餘五科人物有被左緣裁掉（兒牙的椅子、牙周的細菌），加了反而會挖空。 */
  if (SEED_LEFT.has(spec)) for (let y = 0; y < hgt; y++) { const i = y * w; if (!wall[i] && !outside[i]) { outside[i] = 1; q[qt++] = i; } }
  while (qh < qt) { const i = q[qh++], x = i % w, y = (i / w) | 0;
    for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < hgt - 1 ? i + w : -1])
      if (j >= 0 && !outside[j] && !wall[j]) { outside[j] = 1; q[qt++] = j; } }
  const grown = dilate(outside, w, hgt, GAP);
  let filled = 0;
  for (const k of ["s1", "s2"]) {
    const [fr, fg, fb] = hex2rgb(WM[spec][k].fill).map((v) => Math.round(v * 255));
    const o = Buffer.alloc(n * 4); filled = 0;
    for (let i = 0; i < n; i++) {
      if (grown[i] && !wall[i] || outside[i]) continue;                /* 圖外面 */
      const la = px[i * 4 + 3]; if (la > 200) continue;                /* 線本身挖空 */
      o[i * 4] = fr; o[i * 4 + 1] = fg; o[i * 4 + 2] = fb; o[i * 4 + 3] = 255 - la;   /* 線的半透明邊緣跟著挖一半 */
      filled++;
    }
    writePng(path.join(OUT, "lineart", `${spec}-${k}.png`), w, hgt, o);
  }
  return +(filled / n * 100).toFixed(1);
}
/* ⚠ 清空提案頁資料夾要在產實心圖之前，而且要在切換條的 JSON 組出來之前算好 area（面板要印） */
fs.rmSync(OUT, { recursive: true, force: true });
for (const s of Object.keys(WM)) { WM[s].area = solidLineart(s); console.log(`  實心浮水印 ${s}：填了 ${WM[s].area}% 的像素，濃度上限 Ⓢ1 ${WM[s].s1.cap}／Ⓢ2 ${WM[s].s2.cap}`); }

const NUM = {
  pal: P,
  ink: [cr(P.ink, P.paper), cr(P.ink, P.card)].map((v) => v.toFixed(2)),
  soft: [cr(P.soft, P.paper), cr(P.soft, P.card)].map((v) => v.toFixed(2)),
  spec: SPEC_HOME.map((v) => [v.s, v.d, cr(v.d, P.card).toFixed(2), v.pill, cr(v.pill, v.pillBg).toFixed(2)]),
  map: { roadBg: cr(MAP.road, MAP.bg).toFixed(2), inkRoad: cr(MAP.ink, MAP.road).toFixed(2) },
  dot: { soft: cr(P.soft, P.card).toFixed(2), faint: cr(DOT_FAINT, P.card).toFixed(2) },
  sw: { d: cr(SW.d.knob, SW.d.track).toFixed(2), n: cr(SW.n.knob, SW.n.track).toFixed(2),
        dPage: cr(SW.d.track, "#e2e5e6").toFixed(2), nPage: cr(SW.n.track, P.paper).toFixed(2) },
};

/* ---------- 樣式（三種頁面共用一份；某一頁沒有的選擇器本來就不會命中） ---------- */
const specCss = (list, scope) => list.map((v) =>
  `html[data-theme="dark"] ${scope}[data-spec="${v.s}"] { --accent-deep: ${v.d}; --pill-ink: ${v.pill}; --sk-ink: ${v.sk}; }`).join("\n");
const OFF = `:is(.chips :is(button:not([aria-pressed="true"]), a:not([aria-current="page"])), .hours-filter button:not([aria-pressed="true"]), .card-tag:not(.tag-on), .doc-role.tag-off)`;
const CSS = `
<style id="pv-night">
/* ===== 夜間模式提案（產生器 tools/night-mode-preview.mjs，不要手改） ===== */
html[data-theme="dark"] {
  color-scheme: dark;
  --paper: ${P.paper}; --card: ${P.card}; --note: ${P.card}; --rule: ${P.rule}; --ink: ${P.ink}; --ink-soft: ${P.soft};
  ${Object.entries(LIFT).map(([n, c]) => `--${n}: ${c};`).join(" ")}
  --map-bg: ${MAP.bg}; --map-road: ${MAP.road}; --map-ink: ${MAP.ink}; --map-park: ${MAP.park}; --dot-faint: ${DOT_FAINT};
}
${specCss(SPEC_HOME, "body:not([data-post]) ")}
/* ⚠⚠ 著陸頁的 data-spec 掛在 <body> 自己身上（<body data-topic="perio" data-spec="perio">），
   只寫後代選擇器的話 body 本身吃不到，.tp-* 那些套色字會停在白天的深階（2026-09-15 第九輪，使用者：「7 科頁面的套色文字看不清楚」） */
${specCss(SPEC_HOME, "body:not([data-post])")}
${WM_CSS}
${specCss(SPEC_POST, "body[data-post] ")}
${specCss(SPEC_POST, "body[data-post]")}
html[data-theme="dark"] body { background: var(--paper); color: var(--ink); }

/* 沒選到的藥丸 ＝ 套色混 20% 進卡色，字按那塊底重算 */
html[data-theme="dark"] ${OFF} {
  background: color-mix(in srgb, var(--accent) 20%, var(--card));
  border-color: color-mix(in srgb, var(--accent) 20%, var(--card));
  color: var(--pill-ink);
}
html[data-theme="dark"] .sk.tag-on { color: var(--sk-ink); }

/* 地圖：白字釘回白天的卡色；停車場熄滅態釘回 #7a7d77，點到的底維持路牌藍原值；圖釘影子改黑 */
html[data-theme="dark"] .map-svg :is(.pk, .pk-nm, .cm-nm, .cm-disc) { fill: #f4f4f5; }
html[data-theme="dark"] .map-svg .lot .pk { stroke: #f4f4f5; }
html[data-theme="dark"] .map-svg .cm-ul { stroke: #f4f4f5; }
html[data-theme="dark"] .lot rect, html[data-theme="dark"] .lot path { fill: #7a7d77; }
html[data-theme="dark"] .lot.on rect, html[data-theme="dark"] .lot.on path { fill: #365685; }
html[data-theme="dark"] .map-svg .cm-sh use { fill: #000; opacity: .07; }

/* 門診表的圓點 */
html[data-theme="dark"] .hours-grid .d.faint { background: var(--dot-faint); }
html[data-theme="dark"] .hours-grid .d.hit { background: var(--accent-deep); }

/* 寫死白天值的零件 */
html[data-theme="dark"] .btt { background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: color-mix(in srgb, var(--ink-soft) 82%, transparent); }
html[data-theme="dark"] :is(.foot-addr, .foot-tel) a { color: ${liftTo("#3f654a", [P.paper, P.card], 4.5)}; }
html[data-theme="dark"] .table-scroll th { background: ${P.rule}; }
html[data-theme="dark"] .btn-ghost:hover { color: var(--accent-deep); border-color: var(--accent-deep); }

/* ---- 開關：滑桿、無字、太陽月亮畫在圓鈕上（Ⓑ 軌道是天色） ----
   比例照 iOS 的 51×31、圓鈕 27、內縮 2 → 50×30、圓鈕 26、圖示 16。 */
#topics .sec-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
[data-topic] #topics .sec-head .topic-search { margin-left: auto; }
.crumbs .pv-th { margin-left: auto; }
.pv-th { appearance: none; border: 0; background: none; padding: 0; font: inherit; cursor: pointer; flex: none;
  display: inline-flex; align-items: center; min-height: 34px; -webkit-tap-highlight-color: transparent; position: relative; }
.crumbs .pv-th { min-height: 0; }
.pv-th::after { content: ""; position: absolute; inset: -7px -4px; }
.pv-tg { position: relative; width: 50px; height: 30px; border-radius: 15px; flex: none;
  background: ${SW.d.track}; transition: background-color .22s ease; }
.pv-kn { position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center; background: ${SW.d.knob}; color: ${SW.d.icon};
  box-shadow: 0 1px 3px rgba(0, 0, 0, .28); transition: transform .22s ease, color .22s ease; }
.pv-kn svg { grid-area: 1 / 1; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round; transition: opacity .18s ease, transform .22s ease; }
.pv-kn .pv-moon { opacity: 0; transform: rotate(-60deg) scale(.6); }
.pv-th[aria-checked="true"] .pv-tg { background: ${SW.n.track}; }
.pv-th[aria-checked="true"] .pv-kn { transform: translateX(20px); color: ${SW.n.icon}; }
.pv-th[aria-checked="true"] .pv-sun { opacity: 0; transform: rotate(60deg) scale(.6); }
.pv-th[aria-checked="true"] .pv-moon { opacity: 1; transform: none; }
.pv-th:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 17px; }
@media (prefers-reduced-motion: reduce) { .pv-tg, .pv-kn, .pv-kn svg { transition: none; } }
</style>`;

/* 開頁那一刻就決定 data-theme（<head> 最前面，不然會先閃一張白天的）。
   ⚠ localStorage 可能被擋（無痕、封鎖網站資料），讀寫一律包 try —— 讀不到就跟著系統。 */
const EARLY = `<script>(function(){var r=document.documentElement,s=null;
try{s=localStorage.getItem('${KEY}')}catch(e){}
if(s!=='light'&&s!=='dark')s='auto';
var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
r.dataset.thsrc=s;r.dataset.theme=s==='auto'?(mq&&mq.matches?'dark':'light'):s;
var w=null;try{w=localStorage.getItem('fangren-pv:wm')}catch(e){}if(!/^(s1|w3)$/.test(w||''))w='s1';r.dataset.wm=w;
var o=null;try{o=localStorage.getItem('fangren-pv:wmop')}catch(e){}if(!/^o(165|12|09|06)$/.test(o||''))o='o165';r.dataset.wmop=o;})();</script>`;

/* 圖示：Lucide "moon"／"sun"，ISC 授權，https://lucide.dev */
const ICON = `<svg class="pv-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><svg class="pv-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const BUTTON = `<button class="pv-th" type="button" role="switch" aria-checked="false" aria-label="夜間模式"><span class="pv-tg" aria-hidden="true"><span class="pv-kn">${ICON}</span></span></button>`;

/* ---------- 切換條（三種頁面共用） ---------- */
const SPECNAME = { all: "全部", general: "一般", prosth: "植牙", perio: "牙周", ortho: "矯正", endo: "根管", surg: "口外", kids: "兒牙" };
const BAR = `
<style>
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(20,20,22,.94);
  color: #eee; font: 13px/1.45 system-ui, -apple-system, "PingFang TC", "Noto Sans TC", sans-serif;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); backdrop-filter: blur(6px); }
.pv-bar .pv-r { display: flex; gap: 6px; align-items: center; overflow-x: auto; white-space: nowrap; }
.pv-bar .pv-r + .pv-r { margin-top: 5px; }
.pv-bar .pv-r[hidden] { display: none; }
.pv-bar .pv-l { color: #aaa; min-width: 2.6em; }
.pv-bar button { appearance: none; border: 1px solid #555; background: #2a2a2c; color: #eee;
  border-radius: 7px; padding: 5px 10px; font: inherit; cursor: pointer; }
.pv-bar button[aria-pressed="true"] { background: #e2e5e6; color: #111; border-color: #e2e5e6; }
.pv-bar .pv-x { margin-left: auto; }
.pv-panel { margin-top: 6px; color: #bbb; font-size: 12px; white-space: normal; max-height: 30vh; overflow: auto; }
.pv-panel[hidden] { display: none; }
.pv-panel table { border-collapse: collapse; margin-top: 4px; }
.pv-panel td { padding: 1px 8px 1px 0; }
.pv-sw { display: inline-block; width: .9em; height: .9em; border-radius: 3px; vertical-align: -1px; border: 1px solid #666; }
.pv-mini { position: fixed; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 9999;
  appearance: none; border: 0; border-radius: 8px; background: rgba(20,20,22,.9); color: #eee; padding: 8px 12px; font: 13px system-ui, sans-serif; }
.pv-mini[hidden], .pv-bar[hidden] { display: none; }
</style>
<div class="pv-bar" id="pv-bar">
  <div class="pv-r"><span class="pv-l">模式</span>
    <button data-mode="auto">跟著系統</button><button data-mode="light">白天</button><button data-mode="dark">夜間</button>
    <button class="pv-x" id="pv-more">數字</button><button id="pv-hide">收起</button></div>
  <div class="pv-r" id="pv-wmrow" hidden><span class="pv-l">浮水印</span>
    <button data-wmop="o165">.165（上一版）</button><button data-wmop="o12">.12</button><button data-wmop="o09">.09</button><button data-wmop="o06">.06</button><button data-wm="w3">不放</button></div>
  <div class="pv-r"><span class="pv-l">狀態</span><span style="color:#aaa" id="pv-sys"></span></div>
  <div class="pv-panel" id="pv-panel" hidden></div>
</div>
<button class="pv-mini" id="pv-mini" hidden>切換條</button>
<script>
(function(){
  var r=document.documentElement, KEY='${KEY}', NUM=${JSON.stringify(NUM)}, SN=${JSON.stringify(SPECNAME)}, WM=${JSON.stringify(WM)};
  var topic=document.body.dataset.topic, wmrow=document.getElementById('pv-wmrow');
  if(topic&&WM[topic]) wmrow.hidden=false;
  function h2r(x){return [1,3,5].map(function(i){return parseInt(x.slice(i,i+2),16)/255;});}
  function lu(x){return h2r(x).map(function(c){return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);}).reduce(function(a,c,i){return a+c*[.2126,.7152,.0722][i];},0);}
  function crr(a,b){var x=lu(a),y=lu(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function mixh(a,b,p){var A=h2r(a),B=h2r(b);return '#'+A.map(function(v,i){return ('0'+Math.round((v*p+B[i]*(1-p))*255).toString(16)).slice(-2);}).join('');}
  function wmHtml(){
    if(!topic||!WM[topic]||r.dataset.theme!=='dark') return '';
    var v=WM[topic], w=r.dataset.wm, pe=getComputedStyle(document.querySelector('.tp-intro'),'::before'), op=parseFloat(pe.opacity)||0;
    if(w==='w3') return '<br>浮水印：夜間不放。';
    var solid=w==='s1'||w==='s2', line=solid?v[w].fill:v.c1, a=op, bg=mixh(line,NUM.pal.paper,a);
    return '<br>浮水印 '+(w==='s1'?'Ⓢ1 實心・月光白':w==='s2'?'Ⓢ2 實心・套色':'Ⓦ1 線條提亮（亮度 ×'+v.k1+'）')+'：'+(solid?'填色 '+line+'（佔圖 '+v.area+'%）　濃度 '+op+'（次要文字剛好 4.5 的上限是 '+v[w].cap+'，所有寬度同一個值）':'線色 '+line+'　這個寬度的濃度 '+op)+
      '<br>　字壓在線上最壞：主文字 '+crr(NUM.pal.ink,bg).toFixed(2)+'　次要文字 '+crr(NUM.pal.soft,bg).toFixed(2)+'　科別字階 '+crr((NUM.spec.filter(function(x){return x[0]===topic;})[0]||[])[1]||NUM.pal.ink,bg).toFixed(2);
  }
  var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
  function sysDark(){ return !!(mq&&mq.matches); }
  function store(v){ try{ if(v==='auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY,v); }catch(e){} }
  function setSrc(s){ r.dataset.thsrc=s; r.dataset.theme = s==='auto' ? (sysDark()?'dark':'light') : s; }
  function sync(){
    var dark=r.dataset.theme==='dark';
    document.querySelectorAll('.pv-th').forEach(function(b){ b.setAttribute('aria-checked', dark); });
    document.querySelectorAll('.pv-bar [data-mode]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.mode===r.dataset.thsrc); });
    document.querySelectorAll('.pv-bar [data-wm]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.wm===r.dataset.wm); });
    document.querySelectorAll('.pv-bar [data-wmop]').forEach(function(b){ b.setAttribute('aria-pressed', r.dataset.wm==='s1'&&b.dataset.wmop===r.dataset.wmop); });
    var saved=null; try{ saved=localStorage.getItem(KEY); }catch(e){ saved='（這個瀏覽器不讓網站記東西）'; }
    document.getElementById('pv-sys').textContent='這台裝置是'+(sysDark()?'深色':'淺色')+'　·　記住的選擇：'+(saved==='dark'?'夜間':saved==='light'?'白天':saved?saved:'沒有（跟著系統）');
    var m=document.querySelector('meta[name="theme-color"]'); if(m){ if(!m.dataset.day) m.dataset.day=m.content; m.content = dark ? NUM.pal.paper : m.dataset.day; }
    panel();
  }
  function panel(){
    var q=document.getElementById('pv-panel'); if(q.hidden) return;
    var p=NUM.pal, sw=function(c){return '<span class="pv-sw" style="background:'+c+'"></span> '+c;};
    var rows=NUM.spec.map(function(v){return '<tr><td>'+SN[v[0]]+'</td><td>字 '+sw(v[1])+' 對卡 '+v[2]+'</td><td>藥丸字 '+sw(v[3])+' 對淡色塊 '+v[4]+'</td></tr>';}).join('');
    var t=document.querySelector('.pv-th'), msg='';
    if(t){ var row=t.closest('.sec-head,.crumbs'), ref=row&&row.querySelector('h2,a'), a=ref&&ref.getBoundingClientRect(), b=t.getBoundingClientRect();
      msg='開關 '+b.width.toFixed(0)+'×'+b.height.toFixed(0)+'，離右緣 '+(innerWidth-b.right).toFixed(1)+'px　'+(a&&Math.abs((b.top+b.height/2)-(a.top+a.height/2))>14?'<b style="color:#f88">⚠ 被擠到下一行</b>':'✓ 和那一行同一列'); }
    var over=document.documentElement.scrollWidth>innerWidth+1;
    q.innerHTML='夜間 Ⓑ 窄帶藍灰：底 '+sw(p.paper)+'　卡 '+sw(p.card)+'　線 '+sw(p.rule)+
      '<br>主文字 '+sw(p.ink)+' 對底 '+NUM.ink[0]+'／對卡 '+NUM.ink[1]+'　次要 '+sw(p.soft)+' 對底 '+NUM.soft[0]+'／對卡 '+NUM.soft[1]+
      '<table>'+rows+'</table>地圖：路對街廓 '+NUM.map.roadBg+'　街名對路 '+NUM.map.inkRoad+'　圓點對卡 '+NUM.dot.soft+'（沒這科 '+NUM.dot.faint+'）'+
      '<br>滑桿：白鈕對軌道 白天 '+NUM.sw.d+'／夜間 '+NUM.sw.n+'　軌道對頁面 白天 '+NUM.sw.dPage+'／夜間 '+NUM.sw.nPage+
      wmHtml()+'<br>'+msg+'<br>水平捲動：'+(over?'<b style="color:#f88">有（'+(document.documentElement.scrollWidth-innerWidth)+'px）</b>':'沒有');
  }
  /* 頁面上的滑桿：按一下就翻面，並記住 */
  document.querySelectorAll('.pv-th').forEach(function(b){ b.addEventListener('click',function(){
    var v=r.dataset.theme==='dark'?'light':'dark'; setSrc(v); store(v); sync(); }); });
  /* 切換條：「跟著系統」＝ 清掉記住的選擇 */
  document.querySelectorAll('.pv-bar [data-mode]').forEach(function(b){ b.addEventListener('click',function(){
    setSrc(b.dataset.mode); store(b.dataset.mode); sync(); }); });
  document.querySelectorAll('.pv-bar [data-wm]').forEach(function(b){ b.addEventListener('click',function(){
    r.dataset.wm=b.dataset.wm; try{localStorage.setItem('fangren-pv:wm',b.dataset.wm);}catch(e){}
    if(r.dataset.theme!=='dark'){ setSrc('dark'); store('dark'); } sync(); }); });
  document.querySelectorAll('.pv-bar [data-wmop]').forEach(function(b){ b.addEventListener('click',function(){
    r.dataset.wm='s1'; r.dataset.wmop=b.dataset.wmop;
    try{localStorage.setItem('fangren-pv:wm','s1');localStorage.setItem('fangren-pv:wmop',b.dataset.wmop);}catch(e){}
    if(r.dataset.theme!=='dark'){ setSrc('dark'); store('dark'); } sync(); }); });
  if(mq&&mq.addEventListener) mq.addEventListener('change',function(){ if(r.dataset.thsrc==='auto'){ setSrc('auto'); sync(); } });
  /* 另一個分頁改了，這一頁跟著變 */
  addEventListener('storage',function(e){ if(e.key===KEY){ setSrc(e.newValue==='light'||e.newValue==='dark'?e.newValue:'auto'); sync(); } });
  document.getElementById('pv-more').onclick=function(){ var q=document.getElementById('pv-panel'); q.hidden=!q.hidden; panel(); };
  document.getElementById('pv-hide').onclick=function(){ document.getElementById('pv-bar').hidden=true; document.getElementById('pv-mini').hidden=false; };
  document.getElementById('pv-mini').onclick=function(){ document.getElementById('pv-bar').hidden=false; this.hidden=true; };
  addEventListener('resize', panel); sync();
})();
</script>
`;

/* ---------- 每一頁要做的事 ---------- */
function build(src, kind) {
  let h = fs.readFileSync(src, "utf8");
  const must = (re, what) => { if (!re.test(h)) throw new Error(`× ${path.relative(ROOT, src)} 找不到：${what}`); };

  /* 1. SEO 區塊換成 noindex（著陸頁與文章頁也各有一段）、計數器降級、標題 */
  h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, "");
  h = h.replace(/<meta name="robots"[^>]*>/g, "");
  h = h.replace(/<head>/, '<head>\n<meta name="robots" content="noindex, nofollow, noarchive">');
  h = h.replace(/data-views-self=/g, "data-views=");
  if (/data-views-self/.test(h)) throw new Error("× data-views-self 沒剝乾淨");
  h = h.replace(/<title>([^<]*)<\/title>/, "<title>（夜間模式提案）$1</title>");

  /* 2. 路徑：資產一律根目錄；寫成根目錄的站內連結改指到提案頁 */
  h = h.replace(/(["'(\s,])(?:\.\.\/)*(assets\/)/g, "$1/$2");
  h = h.replace(/(["'])(?:\.\.\/)*(site\.webmanifest)/g, "$1/$2");
  h = h.replace(/href="\/(?!\/|assets\/|site\.webmanifest|api\/)/g, `href="${BASE}`);

  /* 3. 開關 */
  if (kind === "home") {
    const re = /(<section id="topics">\s*<div class="shell">\s*<div class="sec-head">\s*<h2>主題與科別<\/h2>)/;
    must(re, "主題與科別的標題列"); h = h.replace(re, `$1\n        ${BUTTON}`);
  } else if (kind === "topic") {
    const re = /(<section id="topics">\s*<div class="shell">\s*<div class="sec-head">\s*<h2>主題與科別<\/h2>\s*<div class="topic-search">[\s\S]*?<\/div>)/;
    must(re, "著陸頁的搜尋框"); h = h.replace(re, `$1\n        ${BUTTON}`);
  } else {
    const re = /(<p class="crumbs">[\s\S]*?)(\n\s*<\/p>)/;
    must(re, "文章頁頂端那一行"); h = h.replace(re, `$1\n        ${BUTTON}$2`);
    /* 文章頁的科別字階和首頁不一樣（兒牙），用 body[data-post] 分開 */
    h = h.replace(/<body([\s>])/, "<body data-post$1");
  }

  /* 4. <head>：最前面決定主題，最後面放樣式 */
  h = h.replace(/<head>/, "<head>\n" + EARLY);
  const bodyAt = h.search(/\n<body[\s>]/);
  if (bodyAt < 0) throw new Error("× 找不到 <body>");
  const headEnd = h.lastIndexOf("</head>", bodyAt);
  h = h.slice(0, headEnd) + CSS + "\n" + h.slice(headEnd);

  /* 5. 切換條（最後一個 </body> 前面） */
  const bi = h.lastIndexOf("</body>");
  h = h.slice(0, bi) + BAR + h.slice(bi);
  if ((h.match(/class="pv-th"/g) || []).length !== 1) throw new Error("× 開關數量不對：" + src);
  return h;
}

const write = (rel, html) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
write("index.html", build(path.join(ROOT, "index.html"), "home"));
let n = 1;
for (const d of fs.readdirSync(path.join(ROOT, "posts"))) {
  const f = path.join(ROOT, "posts", d, "index.html");
  if (fs.existsSync(f)) { write(`posts/${d}/index.html`, build(f, "post")); n++; }
}
for (const d of fs.readdirSync(path.join(ROOT, "topics"))) {
  const f = path.join(ROOT, "topics", d, "index.html");
  if (fs.existsSync(f)) { write(`topics/${d}/index.html`, build(f, "topic")); n++; }
}
console.log(`✓ preview/night-mode/ 共 ${n} 頁`);
