/* 夜間模式的提案頁產生器（2026-09-15 開）。
 *   node tools/night-mode-preview.mjs  → preview/night-mode/index.html
 *
 * 起點：使用者給了 https://snowmed-taiwan.com/ ，「看他有設定白天／夜間模式，
 * 然後做一個診所網站夜間模式的提案頁給我看」。那一站的做法（2026-09-15 實際量的）：
 *   ・預設深色（底 #08243c 深藍、字 #dbeaf6），<head> 裡一小段腳本讀 localStorage
 *     'snowmed:theme'，是 'light' 才在 <html> 掛 data-theme="light"。
 *   ・**不看手機的深色設定**（沒有 prefers-color-scheme），只認手動那一顆。
 *   ・開關在頁首最右邊：一格有框的鈕，圖示＋字（手機直排、電腦橫排），
 *     字寫的是「按下去會變成什麼」（深色時寫「白天模式」配太陽）。
 *   ・整站配色是一組 CSS 變數，[data-theme="light"] 整組換掉。
 *
 * 這一站照同一個骨架做，但顏色**一個都不另外挑**：
 *   ・Ⓐ 暗夜：PALETTE.md 第四節 A 那組（從照片量出來的，站上 HERO 已經在用）。
 *   ・Ⓑ 窄帶藍灰：HERO 底下那條窄帶的漸層（同一組照片的夜空 × 柏油），
 *     ⚠ 分隔線與次要文字那兩階沒有現成的值，是「同色相、亮度對齊 Ⓐ 那兩階」算出來的。
 *   ・七科的字階（--accent-deep）在深底上會沉下去，一律「同色相同彩度、只提亮度」
 *     到 4.5:1 ＝ PALETTE.md 第六之七節 favicon 深色版那條做法，產生器現算。
 *
 * ⚠ 提案頁的規矩（CLAUDE.md 第八節）照做：相對路徑往上兩層、SEO 區塊換成 noindex、
 *   data-views-self 降成 data-views（不灌計數、還印得出真數字）、
 *   切換條插在最後一個 </body> 前面、class 一律 pv 前綴。
 * ⚠ 只做首頁。文章頁與著陸頁吃 assets/style.css，定案之後才要做那一份。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const must = (re, what) => { if (!re.test(h)) throw new Error("× 找不到：" + what); };

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
/* 同色相同彩度，把 L* 往上推到對 bg 剛好 ≥ target */
function liftTo(hex, bgs, target) {
  const [, C, H] = toLch(hex);
  for (let L = toLch(hex)[0]; L <= 98; L += 0.25) {
    const c = fromLch(L, C, H);
    if (bgs.every((b) => cr(c, b) >= target)) return c;
  }
  throw new Error("推不到 " + hex);
}

/* ---------- 兩組夜間配色 ---------- */
const PAL = {
  a: { name: "暗夜", paper: "#191614", card: "#211e1b", rule: "#38342f", ink: "#e3e1e0", soft: "#aaa49e" },
  b: { name: "窄帶藍灰", paper: "#17191d", card: "#282b31" },
};
{ // Ⓑ 缺的三階：色相取窄帶那一支，亮度對齊 Ⓐ（分隔線、次要文字），主文字取白天的紙色（H=203）
  const [, Cb, Hb] = toLch("#282b31");
  const dRule = toLch(PAL.a.rule)[0] - toLch(PAL.a.card)[0];
  PAL.b.rule = fromLch(toLch(PAL.b.card)[0] + dRule, Cb, Hb);
  PAL.b.ink = "#e2e5e6";
  const [, Cp, Hp] = toLch("#e2e5e6");
  PAL.b.soft = fromLch(toLch(PAL.a.soft)[0], Cp, Hp);
}
const SPEC = { all: "#4c4948", general: "#2c5238", prosth: "#2a4677", perio: "#2a6d69", ortho: "#31637f", endo: "#89202d", surg: "#784e84", kids: "#9e6301" };
const FILL = { all: "#5f5d5c", general: "#3f654a", prosth: "#465885", perio: "#317d78", ortho: "#4478b5", endo: "#ae4f4d", surg: "#8e6299", kids: "#c28229" };
const DEEP = {};
/* 官方色票裡被當成「字」用的那幾支（連結的深綠松、門診表標題的灰褐…），深底上一樣要提亮 */
const SWATCH = { teal: "#214D48", taupe: "#7D5A58", blue: "#3C596B", moss: "#5D6D55", brick: "#AF4C52" };
const LIFT = {};
for (const k in PAL) {
  DEEP[k] = {};
  for (const s in SPEC) DEEP[k][s] = liftTo(SPEC[s], [PAL[k].paper, PAL[k].card], 4.5);
  LIFT[k] = Object.fromEntries(Object.entries(SWATCH).map(([n, c]) => [n, liftTo(c, [PAL[k].paper, PAL[k].card], 4.5)]));
}
/* color-mix(in srgb, a p%, b)：sRGB 分量（未線性化）直接內插，和瀏覽器算法一樣 */
const mix = (a, b, p) => "#" + hex2rgb(a).map((v, i) => Math.round((v * p + hex2rgb(b)[i] * (1 - p)) * 255).toString(16).padStart(2, "0")).join("");

/* ---------- 2026-09-15 第二輪：藥丸、地圖、門診圓點 ----------
   使用者：「窄帶藍灰比較好　但藥丸標籤底色沒套色時的效果很不好　地圖整個辨識度慘不忍睹
   門診時段的圓點也很不清楚」。
   ・藥丸：沒選到的那一態白天是「卡色底＋深階字與框」，搬到深底上只剩一圈細線。
     改成把套色混進卡色的淡色塊（兩個濃度），字再按那塊底重算到 4.5。
   ・地圖：白天是「亮的街廓、暗一階的路、柔墨街名」，直接換變數之後街廓與路幾乎一樣深（面板印著上一版的比值），
     而白字（P、芳仁牙醫、停車場名）寫的是 var(--card) —— 夜間 card 是深的，字就沉下去了。
   ・圓點：沒這科的那一顆吃 --rule，夜間幾乎和卡色一樣；有這科的吃 --accent，
     植牙、矯正那幾支深的填色在深底上也看不清。 */
const PILL_P = { t20: 0.2, t32: 0.32 };
const PILL = {}, SK = {}, MAP = {};
for (const k in PAL) {
  const p = PAL[k];
  PILL[k] = {}; SK[k] = {};
  for (const s in SPEC) {
    PILL[k][s] = {};
    for (const [lv, pp] of Object.entries(PILL_P)) {
      const bg = mix(FILL[s], p.card, pp);
      const ink = liftTo(SPEC[s], [bg], 4.5);
      PILL[k][s][lv] = { bg, ink, cr: cr(ink, bg).toFixed(2), vsFill: cr(bg, FILL[s]).toFixed(2) };
    }
    SK[k][s] = liftTo(SPEC[s], [mix(FILL[s], p.card, 0.12)], 4.5);
  }
  const [Lc, Cc, Hc] = toLch(p.card);
  const park = liftTo("#365685", [p.card, mix("#365685", p.card, 0.1)], 4.5);
  MAP[k] = {
    /* Ⓜ1 路比街廓亮（和白天反過來）：街廓＝卡色，路往上提 16 L*，街名用主文字 */
    m1: { bg: p.card, road: fromLch(Lc + 16, Cc, Hc), ink: p.ink },
    /* Ⓜ2 路比街廓暗（和白天同方向）：路＝底色，街廓比卡色再亮 8 L*，街名用次要文字 */
    m2: { bg: fromLch(Lc + 8, Cc, Hc), road: p.paper, ink: p.soft },
    park,
  };
  for (const m of ["m1", "m2"]) {
    const o = MAP[k][m];
    o.nums = { roadBg: cr(o.road, o.bg).toFixed(2), inkRoad: cr(o.ink, o.road).toFixed(2), inkBg: cr(o.ink, o.bg).toFixed(2),
      lotRoad: cr("#7a7d77", o.road).toFixed(2), markRoad: cr("#3f654a", o.road).toFixed(2) };
  }
  /* 圓點：沒這科那一顆 ＝ 次要文字混 35% 進卡色（和白天 --rule 對卡的份量同一級） */
  MAP[k].dotFaint = mix(p.soft, p.card, 0.35);
  MAP[k].dotNums = { soft: cr(p.soft, p.card).toFixed(2), ink: cr(p.ink, p.card).toFixed(2), faint: cr(MAP[k].dotFaint, p.card).toFixed(2),
    dayFaint: cr("#cdd0d2", "#f4f4f5").toFixed(2), dayRoad: cr("#cdd0d2", "#f4f4f5").toFixed(2), prevRoad: cr(p.rule, p.card).toFixed(2) };
}

/* ---------- 2026-09-15 第六輪：滑桿的顏色三案 ----------
   使用者：「滑桿的淡灰色和一般牙科綠要怎麼套用（感覺就不是用一般牙科綠了，而是比較能讓 icon 亮的感覺）」。
   顏色一個都不另外挑：
     暖（太陽）  #c28229 兒童牙科的套色（全站唯一的琥珀）
     夜（月亮）  #365685 地圖上停車場的路牌藍／#17191d 窄帶頂端／#e2e5e6 夜間的主文字（月光）
     素         白天是柔墨混 35% 進卡色，夜間是 Ⓑ 的分隔線 #3f4248
   ⚠ 白天時滑桿站在紙色 #e2e5e6 上、夜間站在 Ⓑ 的底 #17191d 上（主題與科別那一節沒有卡片底）。 */
const DAY_PAPER = "#e2e5e6", NIGHT_PAPER = PAL.b.paper;
const SW = {
  a: { name: "Ⓐ 燈在鈕上", d: { track: mix("#5c5f57", "#f4f4f5", 0.35), knob: "#ffffff", icon: "#c28229" },
                           n: { track: PAL.b.rule, knob: "#e2e5e6", icon: "#365685" } },
  b: { name: "Ⓑ 軌道是天色", d: { track: "#c28229", knob: "#ffffff", icon: "#c28229" },
                           n: { track: "#365685", knob: "#ffffff", icon: "#365685" } },
  c: { name: "Ⓒ 鈕本身是燈", d: { track: mix("#5c5f57", "#f4f4f5", 0.35), knob: "#c28229", icon: "#ffffff" },
                           n: { track: PAL.b.rule, knob: "#365685", icon: "#e2e5e6" } },  /* 軌道用 #17191d 的話對頁面底是 1.00 ＝ 整條不見 */
};
for (const v of Object.values(SW)) {
  v.nums = {
    d: { icon: cr(v.d.icon, v.d.knob).toFixed(2), knob: cr(v.d.knob, v.d.track).toFixed(2), track: cr(v.d.track, DAY_PAPER).toFixed(2) },
    n: { icon: cr(v.n.icon, v.n.knob).toFixed(2), knob: cr(v.n.knob, v.n.track).toFixed(2), track: cr(v.n.track, NIGHT_PAPER).toFixed(2) },
  };
}

const NUM = {};
for (const k in PAL) {
  const p = PAL[k];
  NUM[k] = {
    ink: [cr(p.ink, p.paper), cr(p.ink, p.card)].map((v) => v.toFixed(2)),
    soft: [cr(p.soft, p.paper), cr(p.soft, p.card)].map((v) => v.toFixed(2)),
    lift: toLch(p.card)[0] - toLch(p.paper)[0],
    spec: Object.fromEntries(Object.keys(SPEC).map((s) => [s, [DEEP[k][s], cr(DEEP[k][s], p.card).toFixed(2), cr("#ffffff", FILL[s]).toFixed(2)]])),
  };
}

/* ---------- 1. 快照的四件事 ---------- */
must(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, "SEO 區塊");
h = h.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, '<meta name="robots" content="noindex, nofollow, noarchive">');
h = h.replace(/(["'(\s,])((?:assets|posts|topics|history)\/|site\.webmanifest)/g, "$1../../$2");
h = h.replace(/href="\.\/"/g, 'href="../../"');
h = h.replace(/data-views-self=/g, "data-views=");
if (/data-views-self/.test(h)) throw new Error("× data-views-self 沒剝乾淨");
h = h.replace(/<title>[^<]*<\/title>/, "<title>夜間模式（提案）｜芳仁牙醫診所</title>");

/* ---------- 2. 開關：放在「主題與科別」那一行的最右邊（2026-09-15 第四輪，使用者指定） ----------
   上一輪試過頁首（手機上放不下，390 寬時診所名和選單疊 8px）與頁尾。
   ⚠ 只有圖示與字，**寫的是按下去會變成什麼**（白天時寫「夜間模式」＋月亮），同 snowmed 那一站。 */
/* 圖示：Lucide "moon"／"sun"，ISC 授權，https://lucide.dev */
const ICON = `<svg class="pv-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><svg class="pv-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const topicsHead = /(<section id="topics">\s*<div class="shell">\s*<div class="sec-head">\s*<h2>主題與科別<\/h2>)/;
must(topicsHead, "主題與科別的標題列");
/* 2026-09-15 第五輪：使用者給了 iPhone「設定」裡飛航模式那一列的截圖 ——「開關要做成像圖片這樣，飛航模式的滑桿切換」。
   所以不再是「寫著按下去會變成什麼」的鈕，改成**狀態開關**：字固定寫「夜間模式」，滑桿亮著 ＝ 現在是夜間。
   ⚠ role="switch" ＋ aria-checked，螢幕閱讀器才念得出「開／關」。 */
/* 2026-09-15 第六輪：「現在按鈕是用文字，我覺得前幾版有小 icon 比較好，就不需要文字了，
   icon 可以和滑桿結合：往左切後出現白天的 icon，往右切出現夜間的 icon」。
   → 字拿掉（只留 aria-label），太陽／月亮畫在**圓鈕上**，跟著圓鈕滑過去。 */
h = h.replace(topicsHead, `$1\n        <button class="pv-th" type="button" role="switch" aria-checked="false" aria-label="夜間模式"><span class="pv-tg" aria-hidden="true"><span class="pv-kn">${ICON}</span></span></button>`);

/* ---------- 3. 夜間的樣式（放在 <head>，不能塞在頁尾 —— 第一幀就要對） ---------- */
const palCss = Object.entries(PAL).map(([k, p]) => `
html[data-theme="dark"][data-pal="${k}"] {
  --paper: ${p.paper}; --card: ${p.card}; --note: ${p.card}; --rule: ${p.rule};
  --ink: ${p.ink}; --ink-soft: ${p.soft};
  ${Object.entries(LIFT[k]).map(([n, c]) => `--${n}: ${c};`).join(" ")}
}
html[data-theme="dark"][data-pal="${k}"][data-map="m1"] { --map-bg: ${MAP[k].m1.bg}; --map-road: ${MAP[k].m1.road}; --map-ink: ${MAP[k].m1.ink}; }
html[data-theme="dark"][data-pal="${k}"][data-map="m2"] { --map-bg: ${MAP[k].m2.bg}; --map-road: ${MAP[k].m2.road}; --map-ink: ${MAP[k].m2.ink}; }
html[data-theme="dark"][data-pal="${k}"] { --map-park: ${MAP[k].park}; --dot-faint: ${MAP[k].dotFaint}; }
${Object.keys(SPEC).map((s) => `html[data-theme="dark"][data-pal="${k}"] [data-spec="${s}"] { --accent-deep: ${DEEP[k][s]}; --pill-ink-t20: ${PILL[k][s].t20.ink}; --pill-ink-t32: ${PILL[k][s].t32.ink}; --sk-ink: ${SK[k][s]}; }`).join("\n")}`).join("\n");

/* 沒選到的那一態。⚠ 選到的（aria-pressed／aria-current／tag-on）與實心的專科藥丸要用 :not 排掉，
   不然這幾條權重比較高，會把選到的那一態也蓋成淡色塊。 */
const OFF = `:is(.chips :is(button:not([aria-pressed="true"]), a:not([aria-current="page"])), .hours-filter button:not([aria-pressed="true"]), .card-tag:not(.tag-on), .doc-role.tag-off)`;
const pillCss = Object.entries(PILL_P).map(([lv, pp]) => `
html[data-theme="dark"][data-pill="${lv}"] ${OFF} {
  background: color-mix(in srgb, var(--accent) ${pp * 100}%, var(--card));
  border-color: color-mix(in srgb, var(--accent) ${pp * 100}%, var(--card));
  color: var(--pill-ink-${lv});
}`).join("");

const CSS = `
<style id="pv-night">
/* ===== 夜間模式提案（產生器 tools/night-mode-preview.mjs，不要手改） ===== */
html[data-theme="dark"] { color-scheme: dark; }
${palCss}
html[data-theme="dark"] body { background: var(--paper); color: var(--ink); }
${pillCss}
/* 醫師卡亮起來的專長（12% 淡色塊）：字按那塊底重算 */
html[data-theme="dark"] .sk.tag-on { color: var(--sk-ink); }

/* 地圖：白字那幾樣原本寫 var(--card)，夜間要釘回白天的卡色（它們站在綠塊與灰塊上，不是站在卡上） */
html[data-theme="dark"] .map-svg :is(.pk, .pk-nm, .cm-nm) { fill: #f4f4f5; }
html[data-theme="dark"] .map-svg .lot .pk { stroke: #f4f4f5; }
html[data-theme="dark"] .map-svg .cm-disc { fill: #f4f4f5; }
html[data-theme="dark"] .map-svg .cm-ul { stroke: #f4f4f5; }
/* 停車場熄滅那一態釘回白天的值（柔墨混 80% 卡色 ＝ #7a7d77，白 P 4.18）；點到那一態的底維持路牌藍原值（白 P 7.43），
   只有牌子上的字、圖釘、點狀路線改吃提亮過的 --map-park */
html[data-theme="dark"] .lot rect, html[data-theme="dark"] .lot path { fill: #7a7d77; }
html[data-theme="dark"] .lot.on rect, html[data-theme="dark"] .lot.on path { fill: #365685; }
/* 圖釘的影子原本吃 --ink（夜間是亮的），改成黑 */
html[data-theme="dark"] .map-svg .cm-sh use { fill: #000; opacity: .07; }

/* 門診表的圓點 */
html[data-theme="dark"][data-dot="ink"] .hours-grid .d { background: var(--ink); }
html[data-theme="dark"] .hours-grid .d.faint { background: var(--dot-faint); }
html[data-theme="dark"] .hours-grid .d.hit { background: var(--accent-deep); }

/* 「回到最上面」那一顆寫死的是白天的卡色與柔墨，換成同一個比例的夜間值 */
html[data-theme="dark"] .btt { background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: color-mix(in srgb, var(--ink-soft) 82%, transparent); }
${Object.keys(PAL).map((k) => `html[data-theme="dark"][data-pal="${k}"] :is(.foot-addr, .foot-tel) a { color: ${DEEP[k].general}; }`).join("\n")}

/* 開關本身：主題與科別那一行的最右邊。塊高 34px ＝ 底下那排科別標記，圓角 12px ＝ 門診表那排 */
#topics .sec-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
/* 滑桿：比例照 iOS 的 51×31、圓鈕 27、內縮 2（量自使用者的截圖）。圓鈕上要放圖示，
   所以高度從 28 放到 30（還在 34px 的標記列塊高以內）→ 50×30、圓鈕 26、圖示 16。
   顏色三案（data-sw），每一格的值與對比由產生器現算、寫在面板上。 */
.pv-th { appearance: none; border: 0; background: none; padding: 0; font: inherit; cursor: pointer; flex: none;
  display: inline-flex; align-items: center; min-height: 34px;
  -webkit-tap-highlight-color: transparent; position: relative; }
/* 觸控下限 44px 靠 ::after 撐，版面維持 34px */
.pv-th::after { content: ""; position: absolute; inset: -7px -4px; }
.pv-tg { position: relative; width: 50px; height: 30px; border-radius: 15px; flex: none;
  background: var(--sw-track-d); transition: background-color .22s ease; }
.pv-kn { position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center; background: var(--sw-knob-d); color: var(--sw-icon-d);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .28); transition: transform .22s ease, background-color .22s ease, color .22s ease; }
.pv-kn svg { grid-area: 1 / 1; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round; transition: opacity .18s ease, transform .22s ease; }
.pv-kn .pv-moon { opacity: 0; transform: rotate(-60deg) scale(.6); }
.pv-th[aria-checked="true"] .pv-tg { background: var(--sw-track-n); }
.pv-th[aria-checked="true"] .pv-kn { transform: translateX(20px); background: var(--sw-knob-n); color: var(--sw-icon-n); }
.pv-th[aria-checked="true"] .pv-sun { opacity: 0; transform: rotate(60deg) scale(.6); }
.pv-th[aria-checked="true"] .pv-moon { opacity: 1; transform: none; }
/* Ⓒ 月亮那一格要實心（滿月的亮面），太陽保持線條 */
html[data-sw="c"] .pv-kn .pv-moon { fill: currentColor; }
.pv-th:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 17px; }
@media (prefers-reduced-motion: reduce) { .pv-tg, .pv-kn, .pv-kn svg { transition: none; } }
${Object.entries(SW).map(([k, v]) => `html[data-sw="${k}"] .pv-th { --sw-track-d: ${v.d.track}; --sw-knob-d: ${v.d.knob}; --sw-icon-d: ${v.d.icon}; --sw-track-n: ${v.n.track}; --sw-knob-n: ${v.n.knob}; --sw-icon-n: ${v.n.icon}; }`).join("\n")}
</style>`;
const bodyAt = h.search(/\n<body>\n/);
if (bodyAt < 0) throw new Error("× 找不到 <body>");
const headEnd = h.lastIndexOf("</head>", bodyAt);
h = h.slice(0, headEnd) + CSS + "\n" + h.slice(headEnd);

/* 開頁那一刻就決定 data-theme（放 <head> 最前面，不然會先閃一張白天的） */
const EARLY = `<script>(function(){var u=new URLSearchParams(location.search),r=document.documentElement;
/* 預設跟著系統的深色設定（2026-09-15 第四輪，使用者：「預設跟著手機」）。
   電腦也一樣：Windows／macOS 都有深色設定，瀏覽器用同一個 prefers-color-scheme 回報，所以不必分裝置。
   ⚠ 提案頁用網址參數 th=auto|light|dark 記住選擇；正式站會改成 localStorage。 */
var src=u.get('th');if(!/^(auto|dark|light)$/.test(src||''))src='auto';
var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
var th=src==='auto'?(mq&&mq.matches?'dark':'light'):src;
r.dataset.thsrc=src;
var p=u.get('pal');if(!/^[ab]$/.test(p||''))p='b';
var pl=u.get('pill');if(!/^(line|t20|t32)$/.test(pl||''))pl='t20';var mp=u.get('map');if(!/^m[12]$/.test(mp||''))mp='m1';
var dt=u.get('dot');if(!/^(soft|ink)$/.test(dt||''))dt='soft';
var sw=u.get('sw');if(!/^[abc]$/.test(sw||''))sw='b';r.dataset.sw=sw;
r.dataset.theme=th;r.dataset.pal=p;r.dataset.pill=pl;r.dataset.map=mp;r.dataset.dot=dt;})();</script>`;
h = h.replace(/<head>/, "<head>\n" + EARLY);

/* ---------- 4. 切換條 ---------- */
const SPECNAME = { all: "全部", general: "一般", prosth: "植牙", perio: "牙周", ortho: "矯正", endo: "根管", surg: "口外", kids: "兒牙" };
const BAR = `
<style>
.pv-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(20,20,22,.94);
  color: #eee; font: 13px/1.45 system-ui, -apple-system, "PingFang TC", "Noto Sans TC", sans-serif;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom)); backdrop-filter: blur(6px); }
.pv-bar .pv-r { display: flex; gap: 6px; align-items: center; overflow-x: auto; white-space: nowrap; }
.pv-bar .pv-r + .pv-r { margin-top: 5px; }
.pv-bar .pv-l { color: #aaa; min-width: 3.2em; }
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
    <button data-k="mode" data-v="auto">跟著手機</button><button data-k="mode" data-v="light">白天</button><button data-k="mode" data-v="dark">夜間</button>
    <button class="pv-x" id="pv-more">數字</button><button id="pv-hide">收起</button></div>
  <!-- 2026-09-15 第三輪：使用者挑定「Ⓑ 藍灰／藥丸淡色塊／Ⓜ1 路比較亮／圓點次要文字色」，
       那四把尺收成預設值、從切換條上拿掉（網址參數 pal／pill／map／dot 仍然吃得到）。 -->
  <div class="pv-r"><span class="pv-l">已選</span><span style="color:#aaa">Ⓑ 藍灰・藥丸淡色塊・Ⓜ1 路比較亮・圓點次要文字色・滑桿 Ⓑ 軌道是天色</span></div>
  <div class="pv-r"><span class="pv-l">系統</span><span style="color:#aaa" id="pv-sys"></span></div>
  <div class="pv-panel" id="pv-panel" hidden></div>
</div>
<button class="pv-mini" id="pv-mini" hidden>切換條</button>
<script>
(function(){
  var r=document.documentElement, NUM=${JSON.stringify(NUM)}, PAL=${JSON.stringify(PAL)}, SN=${JSON.stringify(SPECNAME)},
      PILL=${JSON.stringify(PILL)}, MAP=${JSON.stringify(MAP)};
  var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
  function cur(k){ return k==='mode' ? r.dataset.thsrc : r.dataset[k]; }
  function setSrc(s){ r.dataset.thsrc=s; r.dataset.theme = s==='auto' ? (mq&&mq.matches?'dark':'light') : s; }
  if(mq&&mq.addEventListener) mq.addEventListener('change',function(){ if(r.dataset.thsrc==='auto'){ setSrc('auto'); sync(); } });
  function sync(){
    document.querySelectorAll('.pv-bar [data-k]').forEach(function(b){ b.setAttribute('aria-pressed', cur(b.dataset.k)===b.dataset.v); });
    var dark=r.dataset.theme==='dark';
    document.querySelectorAll('.pv-th').forEach(function(b){ b.setAttribute('aria-checked', dark); });
    var m=document.querySelector('meta[name="theme-color"]'); if(m) m.content = dark ? PAL[r.dataset.pal].paper : '#12656a';
    document.getElementById('pv-sys').textContent = '這台裝置現在是'+(mq&&mq.matches?'深色':'淺色')+'　·　目前顯示'+(dark?'夜間':'白天')+(r.dataset.thsrc==='auto'?'（跟著系統）':'（手動選的）');
    var u=new URL(location.href); u.searchParams.set('th',r.dataset.thsrc); u.searchParams.delete('pos');
    ['pal','pill','map','dot'].forEach(function(k){ u.searchParams.delete(k); }); u.searchParams.set('sw', r.dataset.sw);
    history.replaceState(null,'',u); panel();
  }
  function pillHtml(k){
    var lv=r.dataset.pill; if(lv==='line') return '<br>藥丸：線框（上一版），字對卡見上表。';
    var rows=Object.keys(PILL[k]).map(function(s){var v=PILL[k][s][lv];return '<tr><td>'+SN[s]+'</td><td><span class="pv-sw" style="background:'+v.bg+'"></span> 底 '+v.bg+'</td><td>字 '+v.ink+' 對底 '+v.cr+'</td><td>和選到的填色差 '+v.vsFill+'</td></tr>';}).join('');
    return '<br>藥丸（沒選到那一態，套色混 '+(lv==='t20'?'20':'32')+'% 進卡色，字按那塊底重算到 4.5）：<table>'+rows+'</table>';
  }
  function mapHtml(k){
    var m=MAP[k][r.dataset.map].nums, d=MAP[k].dotNums;
    return '地圖 '+(r.dataset.map==='m1'?'Ⓜ1 路比較亮':'Ⓜ2 路比較暗')+'：路對街廓 '+m.roadBg+'（白天 '+d.dayRoad+'、上一版 '+d.prevRoad+'）　街名對路 '+m.inkRoad+'／對街廓 '+m.inkBg+
      '　灰色停車場對路 '+m.lotRoad+'　綠色診所對路 '+m.markRoad+'　白字 P 4.18／路牌藍上 7.43（沒動）'+
      '<br>門診圓點對卡：'+(r.dataset.dot==='ink'?'主文字色 '+d.ink:'次要文字色 '+d.soft)+'　沒這科的那一顆 '+d.faint+'（白天 '+d.dayFaint+'）　有這科的那一顆吃科別字階（對卡 4.5 以上）';
  }
  var SW=${JSON.stringify(SW)};
  function swHtml(){
    var s=SW[r.dataset.sw], row=function(t,c,n){return t+'：軌道 <span class="pv-sw" style="background:'+c.track+'"></span> '+c.track+'　圓鈕 <span class="pv-sw" style="background:'+c.knob+'"></span> '+c.knob+'　圖示 <span class="pv-sw" style="background:'+c.icon+'"></span> '+c.icon+
      '<br>　圖示對圓鈕 '+n.icon+'　圓鈕對軌道 '+n.knob+'　軌道對頁面底 '+n.track+'（非文字圖形的門檻是 3）';};
    return '<br>滑桿 '+s.name+'<br>'+row('白天（太陽）',s.d,s.nums.d)+'<br>'+row('夜間（月亮）',s.n,s.nums.n);
  }
  function panel(){
    var k=r.dataset.pal, p=PAL[k], n=NUM[k];
    var sw=function(c){return '<span class="pv-sw" style="background:'+c+'"></span> '+c;};
    var rows=Object.keys(n.spec).map(function(s){var v=n.spec[s];return '<tr><td>'+SN[s]+'</td><td>'+sw(v[0])+'</td><td>字對卡 '+v[1]+'</td><td>填色白字 '+v[2]+'</td></tr>';}).join('');
    var over=document.documentElement.scrollWidth>innerWidth+1;
    var hh=document.querySelector('#topics .sec-head h2').getBoundingClientRect(), tb=document.querySelector('.pv-th').getBoundingClientRect();
    var head='<br>開關（這個寬度 '+innerWidth+'px）：標題右緣到開關還剩 '+(tb.left-hh.right).toFixed(1)+'px、開關 '+tb.width.toFixed(1)+'×'+tb.height.toFixed(1)+'　'+(Math.abs(tb.top-hh.top)>20?'<b style="color:#f88">⚠ 被擠到下一行</b>':'✓ 和標題同一行');
    document.getElementById('pv-panel').innerHTML =
      'Ⓐ／Ⓑ 目前看的是 <b>'+(k==='a'?'Ⓐ 暗夜':'Ⓑ 窄帶藍灰')+'</b>：底 '+sw(p.paper)+'　卡 '+sw(p.card)+'（亮 '+n.lift.toFixed(1)+' L*）　線 '+sw(p.rule)+
      '<br>主文字 '+sw(p.ink)+' 對底 '+n.ink[0]+'／對卡 '+n.ink[1]+'　次要 '+sw(p.soft)+' 對底 '+n.soft[0]+'／對卡 '+n.soft[1]+
      '<br>科別的字階（同色相、只提亮度到對卡 4.5；填色那一階沒動）：<table>'+rows+'</table>'+
      pillHtml(k)+mapHtml(k)+swHtml()+
      head.slice(4)+'<br>水平捲動：'+(over?'<b style="color:#f88">有（'+(document.documentElement.scrollWidth-innerWidth)+'px）</b>':'沒有');
  }
  document.querySelectorAll('.pv-bar [data-k]').forEach(function(b){ b.addEventListener('click',function(){
    var k=b.dataset.k, v=b.dataset.v;
    if(k==='mode') setSrc(v); else r.dataset[k]=v;
    sync(); }); });
  document.querySelectorAll('.pv-th').forEach(function(b){ b.addEventListener('click',function(){ setSrc(r.dataset.theme==='dark'?'light':'dark'); sync(); }); });
  document.getElementById('pv-more').onclick=function(){ var q=document.getElementById('pv-panel'); q.hidden=!q.hidden; };
  document.getElementById('pv-hide').onclick=function(){ document.getElementById('pv-bar').hidden=true; document.getElementById('pv-mini').hidden=false; };
  document.getElementById('pv-mini').onclick=function(){ document.getElementById('pv-bar').hidden=false; this.hidden=true; };
  addEventListener('resize', panel); sync();
})();
</script>
`;
const bi = h.lastIndexOf("</body>");
h = h.slice(0, bi) + BAR + h.slice(bi);

fs.mkdirSync(path.join(ROOT, "preview/night-mode"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "preview/night-mode/index.html"), h);
console.log("✓ preview/night-mode/index.html");
for (const k in NUM) console.log(k, PAL[k], "ink", NUM[k].ink, "soft", NUM[k].soft, "lift", NUM[k].lift.toFixed(1), Object.entries(NUM[k].spec).map(([s, v]) => s + " " + v.join("/")).join("  "));
