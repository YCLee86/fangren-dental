/* 夜間模式（2026-09-15 定案上線）。
 *   node tools/night-mode.mjs          寫入 index.html／assets/style.css／posts/*／assets/lineart-*-night.png
 *   node tools/night-mode.mjs --check  只比對，有差就 exit 1
 *
 * ⚠ 跑完一定要接著跑 `node tools/topics.mjs`（七科著陸頁是 index.html 的快照）再 `node tools/build.mjs`。
 * ⚠ 文章頁的開關在 <main> 裡，第一次寫入會動到內容雜湊 —— 那不是內容更新，照 CLAUDE.md 第五節把日期還原。
 *
 * 推導在 /history/night-mode.html（提案頁 preview/night-mode/ 十一輪）。定案的每一格：
 *   ・配色 Ⓑ 窄帶藍灰：底 #17191d、卡 #282b31（HERO 底下那條窄帶的漸層）；分隔線與次要文字
 *     「同色相、亮度對齊 PALETTE.md 第四節 A 暗夜那兩階」算出來；主文字 ＝ 白天的紙色 #e2e5e6。
 *   ・七科字階與色票裡被當成字用的幾支：同色相同彩度、只提亮度到對底與卡都 4.5（現算，不要手填）。
 *   ・沒選到的藥丸 ＝ 套色混 20% 進卡色，字按那塊底重算到 4.5。
 *   ・地圖 Ⓜ1 路比街廓亮（路 ＝ 卡色 +16 L*）；白字釘回 #f4f4f5、停車場熄滅態釘回 #7a7d77、點到仍是 #365685。
 *   ・門診圓點維持次要文字色；沒這科的那一顆 ＝ 次要文字混 35% 進卡色。
 *   ・著陸頁的浮水印換成**實心**（線圍起來的地方填 #e2e5e6、線挖空），濃度 .09。
 *     使用者：「人臉變黑色的，這跟大家的辨認習慣很不一樣」—— 線稿夜間是負片，提亮線條治不到。
 *   ・開關：iOS 那種滑桿、沒有字，太陽／月亮畫在圓鈕上；軌道白天琥珀 #c28229、夜間路牌藍 #365685。
 *     白天是白鈕＋琥珀的太陽；**夜間 2026-09-15 第二輪改成反過來**：圓鈕深藍 #012c53、
 *     月亮淡藍 #9cb7ed 而且**填實**（不是線稿）。推導在 /history/night-toggle.html。
 *     首頁與七科在「主題與科別」那一行最右邊（七科接在搜尋框右邊），文章頁在頂端那一行最右邊。
 *   ・預設跟著系統的 prefers-color-scheme（手機電腦同一條）；按過就記在 localStorage 'fangren:theme'。
 *   ・頁首放不下開關（390 寬時診所名和選單疊 8px），不要搬回頁首。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHECK = process.argv.includes("--check");
const KEY = "fangren:theme";
const WM_OPACITY = 0.09;
let dirty = 0;
const put = (rel, next) => {
  const f = path.join(ROOT, rel), prev = fs.existsSync(f) ? fs.readFileSync(f) : null;
  const buf = Buffer.isBuffer(next) ? next : Buffer.from(next);
  if (prev && prev.equals(buf)) return;
  dirty++;
  if (CHECK) { console.log("× 會改動：" + rel); return; }
  fs.writeFileSync(f, buf); console.log("✓ " + rel);
};

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

/* ---------- 夜間配色 ---------- */
const P = { paper: "#17191d", card: "#282b31", ink: "#e2e5e6" };
{
  const [, Cb, Hb] = toLch(P.card);
  P.rule = fromLch(toLch(P.card)[0] + (toLch("#38342f")[0] - toLch("#211e1b")[0]), Cb, Hb);
  const [, Cp, Hp] = toLch("#e2e5e6");
  P.soft = fromLch(toLch("#aaa49e")[0], Cp, Hp);
}
const FILL = { all: "#5f5d5c", general: "#3f654a", prosth: "#465885", perio: "#317d78", ortho: "#4478b5", endo: "#ae4f4d", surg: "#8e6299", kids: "#c28229" };
/* 白天的字階：index.html（首頁與著陸頁）對卡算、assets/style.css（文章頁）對紙算，兒牙那一階兩邊不一樣 */
const DEEP_HOME = { all: "#4c4948", general: "#2c5238", prosth: "#2a4677", perio: "#2a6d69", ortho: "#31637f", endo: "#89202d", surg: "#784e84", kids: "#9e6301" };
const DEEP_POST = { ...DEEP_HOME, kids: "#915800" };
const SWATCH = { teal: "#214D48", taupe: "#7D5A58", blue: "#3C596B", moss: "#5D6D55", brick: "#AF4C52" };
const LIFT = Object.fromEntries(Object.entries(SWATCH).map(([n, c]) => [n, liftTo(c, [P.paper, P.card], 4.5)]));
const [Lc, Cc, Hc] = toLch(P.card);
const MAP_ROAD = fromLch(Lc + 16, Cc, Hc);
/* ⚠ 夜間的 --map-park **只剩路線的點與牌子在用**，不再是「點到的那一塊」（見下面那三條）。 */
const MAP_PARK = liftTo("#365685", [P.card, mix("#365685", P.card, 0.1)], 4.5);
/* ---- 停車場那三塊（2026-09-15 第二輪，三格都是使用者在提案頁上挑的） ----
 * 起因是他的手機截圖：「停車場的藍在夜間變得不太清楚……入口的指標就幾乎看不到了」，
 * 接著第二輪：「沒點到的停車場感覺可以暗一點」。
 * ⚠⚠⚠ 成因是同一個，而且是第九節第 28 條 ② 那一種：第一輪把白天那兩支
 *   （路牌藍 #365685、停車場灰 #7a7d77）**原封不動釘回來**，可是它們周圍的東西
 *   全部換過了 —— 白天的路面比街廓**暗**、夜間比街廓**亮 16 L 星**（Ⓜ1 是他挑的），
 *   白天的卡是 L 星 96、夜間的街廓是 17.5。同一支顏色因此換了個意思：
 *     ・入口指標壓在路面上，4.79 → **1.11**（1.00 就是完全看不見）。
 *     ・點到的方塊對街廓 6.76 → 1.91，而且從「比沒點到暗 3.6」變成「暗 15.8」——
 *       深底上暗就是退後，**點下去那一塊反而沉下去**，語意翻面。
 *     ・沒點到的那三塊變成整張圖上最亮的一群大塊（對街廓 3.40），
 *       **比診所自己那塊綠（2.14）還跳** —— 一張「診所在哪」的地圖份量排錯了。
 * ⚠⚠ 三個值必須各自算，不能共用一支：方塊的底是街廓、箭頭的底是路面，
 *   夜間那兩塊差 16 L 星。要箭頭對路面過 3:1 得走到 L 星 64.5，
 *   而白色的 P 壓在那個亮度上只剩 2.49 —— **白 P 就是方塊那一把尺的天花板**。
 * ⚠ 錨點只有三個，全部有出處，改任何一個這三支都會自己跟著動：
 *   白天那支停車場灰 #7a7d77（點到的亮度）／診所那塊綠 #3f654a（沒點到的份量）／路面（箭頭）。
 * ⚠ 落選：點到 對街廓 3:1（白 P 只剩 4.30）、= --map-park（白 P 2.71）；
 *   沒點到 暗一階 2.74、再暗一階 1.74（**對路面 1.01，貼著路的那一邊就沒有邊界了** ——
 *   路面是 L 星 33.5，塊走到那附近是死區）。 */
const LOT_DAY = "#7a7d77";                                  /* 白天那支：柔墨混 80% */
const [Ld, Cd, Hd] = toLch(LOT_DAY);
const [, Cp, Hp] = toLch("#365685");
/* 點到：釘在白天那支灰的亮度上（白天兩態幾乎同亮，只差 3.6 L 星 ＝ 換色相）。
   ⚠ 釘的是**白天那一支**不是夜間的沒點到 —— 不然沒點到一暗，這一顆會跟著掉下去。 */
const LOT_ON = fromLch(Ld, Cp, Hp);
/* 入口指標：它的底是路面，3:1 是裝飾性圖形的門檻（同 iPad 那顆指標那一輪）。 */
const LOT_ENT = liftTo("#365685", [MAP_ROAD], 3);
/* 沒點到：往下暗到和診所那塊綠同一個份量 —— 停車場不該比診所自己還跳。
   ⚠ 順帶修好另一格：白色的 P 壓在上面本來只有 3.80，暗下去變 6.08。 */
const darkTo = (hex, bg, target) => {
  const [L0, C, H] = toLch(hex);
  for (let L = L0; L >= 0; L -= 0.1) { const c = fromLch(L, C, H); if (cr(c, bg) <= target) return c; }
  throw new Error("暗不到 " + target + "：" + hex);
};
const LOT_OFF = darkTo(LOT_DAY, P.card, cr("#3f654a", P.card));
const DOT_FAINT = mix(P.soft, P.card, 0.35);
const FOOT_LINK = liftTo("#3f654a", [P.paper, P.card], 4.5);
const specRules = (deep) => Object.keys(FILL).map((s) => {
  const d = liftTo(deep[s], [P.paper, P.card], 4.5);
  const pill = liftTo(deep[s], [mix(FILL[s], P.card, 0.2)], 4.5);
  const sk = liftTo(deep[s], [mix(FILL[s], P.card, 0.12)], 4.5);
  return `html[data-theme="dark"] [data-spec="${s}"] { --accent-deep: ${d}; --pill-ink: ${pill}; --sk-ink: ${sk}; }`;
}).join("\n");

/* ---------- 樣式 ---------- */
const COMMON = `
html[data-theme="dark"] {
  color-scheme: dark;
  --paper: ${P.paper}; --card: ${P.card}; --note: ${P.card}; --rule: ${P.rule}; --ink: ${P.ink}; --ink-soft: ${P.soft};
  ${Object.entries(LIFT).map(([n, c]) => `--${n}: ${c};`).join(" ")}
}
html[data-theme="dark"] body { background: var(--paper); color: var(--ink); }
html[data-theme="dark"] .btt { background-color: color-mix(in srgb, var(--card) 80%, transparent);
  color: color-mix(in srgb, var(--ink-soft) 82%, transparent); }
html[data-theme="dark"] :is(.foot-addr, .foot-tel) a { color: ${FOOT_LINK}; }

/* 開關：滑桿、沒有字，太陽／月亮畫在圓鈕上。比例照 iOS 的 51×31、圓鈕 27、內縮 2 → 50×30、圓鈕 26、圖示 16。
   ⚠ 圓鈕的位置與圖示看的是 html[data-theme]，不是 aria-checked —— 夜間打開頁面時，
     <head> 裡那段腳本已經定好 data-theme，而 theme.js 是 defer 的；看 aria-checked 會先閃一下白天的位置。
   圖示：Lucide "moon"／"sun"，ISC 授權，https://lucide.dev */
.theme-toggle { appearance: none; border: 0; background: none; padding: 0; font: inherit; cursor: pointer; flex: none;
  display: inline-flex; align-items: center; min-height: 34px; -webkit-tap-highlight-color: transparent; position: relative; }
.theme-toggle::after { content: ""; position: absolute; inset: -7px -4px; }
.tt-track { position: relative; width: 50px; height: 30px; border-radius: 15px; flex: none;
  background: #c28229; transition: background-color .22s ease; }
.tt-knob { position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center; background: #fff; color: #c28229;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .28);
  transition: transform .22s ease, color .22s ease, background-color .22s ease; }
.tt-knob svg { grid-area: 1 / 1; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round; transition: opacity .18s ease, transform .22s ease; }
/* ⚠ 月亮是**填實**的、太陽仍然是線稿（2026-09-15 第二輪定案）——
     實心的墨佔圓鈕 15.6%、線稿只有 10.5%，圓鈕變深之後要靠這五成把份量補回來。
   ⚠⚠ 填實那一條**一定要寫成 svg.tt-moon**（兩個 class ＋ 一個型別）——
     只寫 .tt-moon 的話權重輸給上面那條「.tt-knob svg 的 fill: none」，月亮會靜靜地
     退回線稿：背景色、字色、位移每一個數字都還是對的，畫面也完全正常，
     **只有量 computed 的 fill 才看得出來**（定案當天踩過一次）。 */
.tt-moon { opacity: 0; transform: rotate(-60deg) scale(.6); }
.tt-knob svg.tt-moon { fill: currentColor; stroke: none; }
html[data-theme="dark"] .tt-track { background: #365685; }
/* ⚠⚠ 夜間的圓鈕是**深藍配淡藍的月亮**（Ⓖ2，2026-09-15 第二輪，使用者：
     「月亮那塊圓的地方很亮……如果反過來　圓形是深藍色　月亮　淡藍色」）。
   ⚠ 兩支都是路牌藍 #365685 的同色相同彩度、只動亮度，沒有新增顏色。
   ⚠⚠ 已知取捨：圓鈕對軌道只有 1.90，低於 3:1 —— 那是**幾何決定的不是偏好**
     （軌道 L* 36.2、往下的地板是 0，最多只到 1.9:1），圓的邊界因此比白鈕那一版弱，
     由實心月亮（對圓鈕 7.00、對紙底 8.72）接手。**不要拿對比度來訂正它。**
   ⚠ 白天那一態一個值都沒有動。 */
html[data-theme="dark"] .tt-knob { transform: translateX(20px); background: #012c53; color: #9cb7ed; }
html[data-theme="dark"] .tt-sun { opacity: 0; transform: rotate(60deg) scale(.6); }
html[data-theme="dark"] .tt-moon { opacity: 1; transform: none; }
.theme-toggle:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 17px; }
@media (prefers-reduced-motion: reduce) { .tt-track, .tt-knob, .tt-knob svg { transition: none; } }
`;
const OFF = `:is(.chips :is(button:not([aria-pressed="true"]), a:not([aria-current="page"])), .hours-filter button:not([aria-pressed="true"]), .card-tag:not(.tag-on), .doc-role.tag-off)`;
const HOME_CSS = `/* NIGHT:START — 由 tools/night-mode.mjs 產生，請勿手動編輯 */
${COMMON}
html[data-theme="dark"] {
  --map-bg: ${P.card}; --map-road: ${MAP_ROAD}; --map-ink: ${P.ink}; --map-park: ${MAP_PARK}; --dot-faint: ${DOT_FAINT};
}
${specRules(DEEP_HOME)}
html[data-theme="dark"] ${OFF} {
  background: color-mix(in srgb, var(--accent) 20%, var(--card));
  border-color: color-mix(in srgb, var(--accent) 20%, var(--card));
  color: var(--pill-ink);
}
html[data-theme="dark"] .sk.tag-on { color: var(--sk-ink); }
html[data-theme="dark"] .map-svg :is(.pk, .pk-nm, .cm-nm, .cm-disc) { fill: #f4f4f5; }
html[data-theme="dark"] .map-svg .lot .pk { stroke: #f4f4f5; }
html[data-theme="dark"] .map-svg .cm-ul { stroke: #f4f4f5; }
html[data-theme="dark"] .lot :is(rect, path) { fill: ${LOT_OFF}; }
html[data-theme="dark"] .lot.on :is(rect, path) { fill: ${LOT_ON}; }
html[data-theme="dark"] .lot.on .ent { fill: ${LOT_ENT}; }
html[data-theme="dark"] .map-svg .cm-sh use { fill: #000; opacity: .07; }
html[data-theme="dark"] .hours-grid .d.faint { background: var(--dot-faint); }
html[data-theme="dark"] .hours-grid .d.hit { background: var(--accent-deep); }
/* 著陸頁的實心浮水印（圖檔由本支產生；url 在著陸頁由 tools/topics.mjs 換成 ../../assets/）
   ⚠ background-image 刻意寫兩次：後面那個 image-set 讓吃得到 WebP 的瀏覽器少載 20~30%，
     前面那個只有 PNG 的是退路 —— 不支援 image-set 的（Safari 16 以下）會把整行丟掉。
     .webp 由 node tools/webp.mjs 產生，換過線稿要跟著重跑。 */
${Object.keys(FILL).filter((s) => s !== "all").map((s) =>
  `html[data-theme="dark"] [data-topic="${s}"] .tp-intro::before { background-image: url("assets/lineart-${s}-night.png"); background-image: image-set(url("assets/lineart-${s}-night.webp") type("image/webp"), url("assets/lineart-${s}-night.png") type("image/png")); opacity: ${WM_OPACITY}; }`).join("\n")}
/* 開關在「主題與科別」那一行的最右邊（著陸頁接在搜尋框右邊） */
#topics .sec-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
[data-topic] #topics .sec-head .topic-search { margin-left: auto; }
/* NIGHT:END */`;
const POST_CSS = `/* NIGHT:START — 由 tools/night-mode.mjs 產生，請勿手動編輯 */
${COMMON}
${specRules(DEEP_POST)}
html[data-theme="dark"] .table-scroll th { background: ${P.rule}; }
html[data-theme="dark"] .btn-ghost:hover { color: var(--accent-deep); border-color: var(--accent-deep); }
/* 開關在文章頂端那一行（首頁 › 科別 › 日期 › 瀏覽數）的最右邊 */
.crumbs .theme-toggle { margin-left: auto; min-height: 0; }
/* NIGHT:END */`;

/* ---------- <head> 裡那一段（開頁那一刻就決定 data-theme，不然會先閃一張白天的） ---------- */
const early = (prefix) => `<!-- NIGHT:START — 由 tools/night-mode.mjs 產生，請勿手動編輯 -->
<script>(function(){var r=document.documentElement,s=null;try{s=localStorage.getItem('${KEY}')}catch(e){}
if(s!=='light'&&s!=='dark')s=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
r.dataset.theme=s;})();</script>
<script src="${prefix}assets/theme.js" defer></script>
<!-- NIGHT:END -->`;
const ICON = `<svg class="tt-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg><svg class="tt-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const BUTTON = `<button class="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="夜間模式"><span class="tt-track" aria-hidden="true"><span class="tt-knob">${ICON}</span></span></button>`;

const THEME_JS = `/* 夜間模式的開關（由 tools/night-mode.mjs 產生，請勿手動編輯）。
   開頁時的主題由各頁 <head> 裡那段內嵌腳本決定；這一支只負責：
   ・按下滑桿 → 翻面並記在 localStorage '${KEY}'
   ・沒有記過的人，系統切換深淺色時跟著變
   ・另一個分頁改了，這一頁跟著變
   ・aria-checked 與 theme-color 跟上 */
(function () {
  var r = document.documentElement, KEY = '${KEY}';
  var mq = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
  var meta = document.querySelector('meta[name="theme-color"]'), dayColor = meta && meta.content;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) {
    r.dataset.theme = t;
    var on = t === 'dark';
    Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (b) { b.setAttribute('aria-checked', on); });
    if (meta) meta.content = on ? '${P.paper}' : dayColor;
  }
  apply(r.dataset.theme === 'dark' ? 'dark' : 'light');
  Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (b) {
    b.addEventListener('click', function () {
      var t = r.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, t); } catch (e) {}
      apply(t);
    });
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) {
    var s = saved(); if (s !== 'light' && s !== 'dark') apply(e.matches ? 'dark' : 'light');
  });
  addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    apply(e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : (mq && mq.matches ? 'dark' : 'light'));
  });
})();
`;

/* ---------- 寫入 ---------- */
function injectHead(h, prefix, file) {
  if (/<!-- NIGHT:START[\s\S]*?<!-- NIGHT:END -->/.test(h)) return h.replace(/<!-- NIGHT:START[\s\S]*?<!-- NIGHT:END -->/, early(prefix));
  const re = /(<meta name="viewport"[^>]*>\n)/;
  if (!re.test(h)) throw new Error("× 找不到 viewport：" + file);
  return h.replace(re, `$1${early(prefix)}\n`);
}
function injectCss(css, block, file, where) {
  const re = /\/\* NIGHT:START[\s\S]*?\/\* NIGHT:END \*\//;
  if (re.test(css)) return css.replace(re, block);
  return where(css, block, file);
}

/* 首頁 */
{
  let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  h = injectHead(h, "", "index.html");
  h = injectCss(h, HOME_CSS, "index.html", (c, b) => {
    const bodyAt = c.search(/\n<body[\s>]/), end = c.lastIndexOf("</head>", bodyAt);
    return c.slice(0, end) + `<style>\n${b}\n</style>\n` + c.slice(end);
  });
  /* ⚠ tools/topics.mjs 用「        <h2>主題與科別</h2>\\n」這一整行去插搜尋框，開關要放在那一行**之後**，
       著陸頁的順序才會是 標題 → 搜尋框 → 開關。 */
  const head = "        <h2>主題與科別</h2>\n";
  if (!h.includes(head)) throw new Error("× index.html 找不到主題與科別的標題列");
  h = h.replace(/\n\s*<button class="theme-toggle"[^\n]*<\/button>/g, "");
  h = h.replace(head, head + "        " + BUTTON + "\n");
  put("index.html", h);
}
/* 文章頁 */
for (const d of fs.readdirSync(path.join(ROOT, "posts"))) {
  const rel = `posts/${d}/index.html`, file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let h = fs.readFileSync(file, "utf8");
  h = injectHead(h, "../../", rel);
  h = h.replace(/\n\s*<button class="theme-toggle"[^\n]*<\/button>/g, "");
  const re = /(<p class="crumbs">[\s\S]*?)(\n\s*<\/p>)/;
  if (!re.test(h)) throw new Error("× 找不到文章頂端那一行：" + rel);
  h = h.replace(re, `$1\n        ${BUTTON}$2`);
  put(rel, h);
}
/* 樣式表 */
{
  const css = fs.readFileSync(path.join(ROOT, "assets/style.css"), "utf8");
  put("assets/style.css", injectCss(css, POST_CSS, "assets/style.css", (c, b) => c.replace(/\s*$/, "\n\n") + b + "\n"));
}
put("assets/theme.js", THEME_JS);

/* ---------- 實心浮水印 ---------- */
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
function encodePng(w, hgt, px) {
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, "ascii"), d]); const c = Buffer.alloc(4); c.writeUInt32BE(zlib.crc32(td) >>> 0); return Buffer.concat([len, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(hgt, 4); ih[8] = 8; ih[9] = 6;
  const raw = Buffer.alloc(hgt * (w * 4 + 1)); for (let y = 0; y < hgt; y++) px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
/* 線圍起來的區域：
   ⚠ 只從**上緣**往內灌「圖外面」—— 人物在下緣與左右緣是被裁掉的，從那幾邊灌會灌進身體裡。
   ⚠ 顯微根管的吊臂、矯正的看片螢幕碰到上緣，把左下那一大片背景隔開，這兩科加灌左緣
     （不加的話整片背景被填滿，量到 79～81%）。其餘五科人物被左緣裁掉，加了反而挖空。
   ⚠ 線有斷口，灌之前先把線加粗 GAP 當牆，灌完再把外面往回長 GAP（不然剪影會胖一圈）。
   ⚠ 驗收要把圖打開看，數字看不出來：七科填到的比例是 28～54%。 */
const GAP = 4, SEED_LEFT = new Set(["endo", "ortho"]);
function dilate(mask, w, hgt, r) {
  const tmp = new Uint8Array(mask.length), out = new Uint8Array(mask.length);
  for (let y = 0; y < hgt; y++) { let run = -1e9; for (let x = 0; x < w; x++) { if (mask[y * w + x]) run = x; if (x - run <= r) tmp[y * w + x] = 1; } run = 1e9; for (let x = w - 1; x >= 0; x--) { if (mask[y * w + x]) run = x; if (run - x <= r) tmp[y * w + x] = 1; } }
  for (let x = 0; x < w; x++) { let run = -1e9; for (let y = 0; y < hgt; y++) { if (tmp[y * w + x]) run = y; if (y - run <= r) out[y * w + x] = 1; } run = 1e9; for (let y = hgt - 1; y >= 0; y--) { if (tmp[y * w + x]) run = y; if (run - y <= r) out[y * w + x] = 1; } }
  return out;
}
for (const spec of Object.keys(FILL).filter((s) => s !== "all")) {
  const { w, h: hgt, px } = readPng(path.join(ROOT, "assets", `lineart-${spec}.png`));
  const n = w * hgt, line = new Uint8Array(n);
  for (let i = 0; i < n; i++) line[i] = px[i * 4 + 3] > 60 ? 1 : 0;
  const wall = dilate(line, w, hgt, GAP), outside = new Uint8Array(n), q = new Int32Array(n);
  let qh = 0, qt = 0;
  for (let x = 0; x < w; x++) if (!wall[x]) { outside[x] = 1; q[qt++] = x; }
  if (SEED_LEFT.has(spec)) for (let y = 0; y < hgt; y++) { const i = y * w; if (!wall[i] && !outside[i]) { outside[i] = 1; q[qt++] = i; } }
  while (qh < qt) { const i = q[qh++], x = i % w, y = (i / w) | 0;
    for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < hgt - 1 ? i + w : -1])
      if (j >= 0 && !outside[j] && !wall[j]) { outside[j] = 1; q[qt++] = j; } }
  const grown = dilate(outside, w, hgt, GAP);
  const [fr, fg, fb] = hex2rgb(P.ink).map((v) => Math.round(v * 255));
  const o = Buffer.alloc(n * 4); let filled = 0;
  for (let i = 0; i < n; i++) {
    if (grown[i] && !wall[i] || outside[i]) continue;
    const la = px[i * 4 + 3]; if (la > 200) continue;
    o[i * 4] = fr; o[i * 4 + 1] = fg; o[i * 4 + 2] = fb; o[i * 4 + 3] = 255 - la; filled++;
  }
  const pct = filled / n * 100;
  if (pct < 15 || pct > 65) throw new Error(`× 實心浮水印 ${spec} 填了 ${pct.toFixed(1)}%，多半是背景被灌進去或人物被挖空 —— 打開圖檢查`);
  put(`assets/lineart-${spec}-night.png`, encodePng(w, hgt, o));
}

if (CHECK && dirty) { console.log(`× ${dirty} 個檔案和產生器不一致`); process.exit(1); }
console.log(CHECK ? "✓ 全部一致" : `✓ 夜間模式寫入完成（${dirty} 個檔案有改動）。接著跑 node tools/topics.mjs 與 node tools/build.mjs`);
