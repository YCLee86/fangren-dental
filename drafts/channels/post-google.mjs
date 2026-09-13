/* 同一組貼文圖貼到 **Google 商家檔案的「最新動態」**
 *   node drafts/channels/post-google.mjs
 *
 * ⚠⚠⚠ 2026-09-13 起點：使用者把三張貼上去、按了預覽，回報
 *   「**看起來地圖那張有點被裁到　其他兩張好像還好**」。
 *
 * ── 量出來的（不是目測）──
 *   三張截圖（iPhone 1125×2436）裡那個輪播框都是 **981×933 裝置 px ＝ 1.0515:1**，
 *   而我們的圖是 1080 見方，所以它照寬度放大、**上下各裁掉 26.4 個原圖像素**。
 *   三張圖的內容離上下邊各有多遠（逐像素量的）：
 *     門診表　159 / 164　→ 裁完還剩 132 / 138　　　很寬鬆
 *     科別醫師 63 /  57　→ 還剩 37 / 31　　　　　　還好
 *     位置停車  36 /  33　→ **只剩 9.6 / 6.6**　　　⚠
 *   ＝ **一個像素的墨都沒有被裁掉**，地圖那張是「貼邊」不是「缺角」——
 *   他看到的是留白被吃光。而那 26.4 幾乎正好等於那張圖自己的頁面內距
 *   （2026-09-08 他挑的 Ⓜ3 ＝ 26px），所以只有那一張看得出來。
 *
 * ── 定案：Ⓟ2　左右各補 54px → 1188×1080（1.10:1），**內容一個像素不動** ──
 *   使用者 2026-09-13：「一次做好三張 Google 專用版 補邊 Ⓟ2 ＋ 浮水印換一張一顆），
 *   內容一個像素不動」。
 *   讓圖比框**寬**，上下就完全不會被裁：
 *     框 1.0515 → 左右各裁掉 26.2px 的**純補邊**，上下 0
 *     框 1.00（正方形的畫面）→ 左右各裁 54 ＝ 正好把補的那一塊吃掉，回到原本的留白
 *   所以 **1.00 ~ 1.10 這整個區間都碰不到內容**。
 *   ⚠ 代價：內容在框裡畫出來小 4.9%，左右各露一條 24 裝置 px 的底色。
 *   ⚠ 落選 Ⓟ1（補到剛好 1136×1080）：在這支手機上完全不裁、內容一樣大，
 *     但框只要再扁一點就又開始裁上下，**零餘裕**。
 *
 * ⚠⚠⚠ **補的那一條不可以是純色 —— 這是量出來才知道的。**
 *   三張的浮水印（一張一顆那一版）都是**從某一邊切出去**的：門診表與科別醫師
 *   往右下、地圖往左上。所以原圖的邊上就有浮水印的墨，補一條純底色上去，
 *   會在**原本 1080 的邊界留下一條約 8 階的直線**（4% 的墨壓在卡色上就是 8 階）。
 *   → 補邊那一層要**把同一顆浮水印畫下去、讓它接著長出去**，再把原圖疊在上面：
 *     中央那 1080 一個像素都沒動，兩條邊條上浮水印自然地接著長完。
 *   ⚠ 這件事在 1080 見方上看不出來（浮水印就切在畫布邊上，本來就是一條線），
 *     只有補了邊才會變成「圖中間有一條線」。
 *
 * ── 浮水印：一張一顆（`WM_MODE=fb-solo`）──
 *   Google 這邊是一則一則（或輪播一張一張）被看到的，**三格拼一顆的那顆圓接不起來**，
 *   每張上只剩一塊往畫布外流出去的弧 —— 同 2026-09-09 臉書那一輪一開始的判斷。
 *   ⚠ 這一組的值**一個都不是新挑的**，全部是 2026-09-08 使用者自己在那兩頁上挑定的
 *     （形狀、大小、切掉多少、濃度、壓哪一角），見 wm-triptych.mjs 的 FB。
 *
 * ⚠ 跑完會**用預設值（三格版）再跑一次**，把 LINE 那三張還原回去 ——
 *   少了那一步，repo 裡的 LINE 成品會停在一張一顆的浮水印上，三張接不成一顆圓
 *   **而且每一張看起來都很正常**。
 *
 * ── 產出（都放 preview/google-post/）──
 *   fangren-google-<格>-1188.png　要上傳的那三張
 *   crop-<格>-now.png / -pad.png 　那個輪播框裡實際長什麼樣（真的裁出來的，981×933）
 *   index.html　　　　　　　　　　 規格頁
 *   ⚠ **貼文的文字不另存一份** —— 那三段和 LINE 那三則是同一個出處，
 *     複製一份就是第二個真相；規格頁現場讀出來印在上面。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { wmFor, wmDesc } from "./wm-triptych.mjs";
import { decode, at, inkBox } from "./png-read.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT  = path.join(ROOT, "preview", "google-post");
fs.mkdirSync(OUT, { recursive: true });

const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";
const BG = [244, 244, 245];          /* ＝ CARD，三支產生器的畫布底色都是它 */

/* 補多少（每一邊）。⚠ 這個 54 是 Ⓟ2 定案的值，不是隨手挑的：
   1080 ＋ 2×54 ＝ 1188 ＝ 1080 × 1.10，而 1.10 正好讓「框是正方形」那一端
   也剛好把補的那一塊吃完。改它就等於改掉那個涵蓋區間。 */
const PAD = 54;
const CANVAS = 1080;
const OUTW = CANVAS + PAD * 2;

/* Google 商家「最新動態」那個輪播框 —— 2026-09-13 從使用者三張截圖逐像素量的
   （iPhone 1125×2436、一則三張）：卡片內的圖框 981×933 裝置 px。
   ⚠ 三張量到的上下界完全一樣（579–1511）、左右都是 981 寬，所以不是某一張的巧合。
   ⚠⚠ 這是**「一則三張」的輪播框** —— 一則一張的卡不見得同一個比例，
     改成分開發要再按一次預覽確認。這件事規格頁上寫著。 */
const GFRAME = { W: 981, H: 933, DPR: 3 };
const FCSS = { w: GFRAME.W / GFRAME.DPR, h: GFRAME.H / GFRAME.DPR };

/* cover 會從原圖的每一邊切掉多少（回傳的是**原圖像素**，每一邊） */
const cover = (iw, ih, fw, fh) => {
  const s = Math.max(fw / iw, fh / ih);
  return { s, cutX: (iw - fw / s) / 2, cutY: (ih - fh / s) / 2 };
};

const TILES = [
  { k: "hours", gen: "post-hours.mjs",
    img: ["preview", "line-post-hours", "fangren-hours-1080.png"],
    txt: ["preview", "line-post-hours", "detail.txt"],
    name: "門診表", spec: "/preview/line-post-hours/" },
  { k: "docs", gen: "post-docs.mjs",
    img: ["preview", "line-post-docs", "fangren-docs-1080.png"],
    txt: ["preview", "line-post-docs", "detail.txt"],
    name: "科別與醫師", spec: "/preview/line-post-docs/" },
  { k: "map", gen: "post-map-door.mjs",
    img: ["preview", "line-post-map", "fangren-map-1080.png"],
    txt: ["preview", "line-post-map", "door-detail.txt"],
    name: "位置與周邊停車", spec: "/preview/line-post-map/" },
];

const run = (script, env) => execFileSync("node", [path.join(HERE, script)],
  { cwd: ROOT, env: { ...process.env, ...env }, stdio: "pipe" });

const finalOf = (k) => `fangren-google-${k}-1188.png`;

/* ---------- 第一步：三張都用「一張一顆」的浮水印跑一次，讀進記憶體 ---------- */
/* ⚠ 讀進記憶體、**不落地成第三份檔案** —— 落地的話那三個檔會變成孤兒，
   而且日後一定有人分不出哪一份是哪一版的浮水印。 */
const core = {};
try {
  for (const t of TILES) {
    run(t.gen, { WM_MODE: "fb-solo" });
    core[t.k] = fs.readFileSync(path.join(ROOT, ...t.img));
  }
} finally {
  /* ⚠⚠ 一定要還原，而且要寫在 finally 裡 —— 中間任何一步爆掉的話，
     repo 裡的 LINE 成品就會停在一張一顆的浮水印上、三張接不成一顆圓。
     ⚠⚠⚠ **還原要跑兩輪，不是一輪。** post-docs.mjs 那張三格模擬圖
     （line-post-docs/profile-3up.png）是**把另外兩張從硬碟讀回來**拼的，
     而還原是照 hours → docs → map 的順序跑的 —— 輪到 docs 的那一刻，
     map 還停在上一版的浮水印上，於是那張模擬圖就拼著一張別版的圖存了下來。
     ⚠ 症狀：尺寸、長寬比、孤兒檔、水平溢出**每一道守門都會過**，
       只有 git 看得出那個檔被動過（而且差的只有 9 階的淡墨，肉眼幾乎看不出來）。
     **通則：一支產生器會讀別支的產出檔時，「跑一輪」不等於「全部都對」——
     要跑到不再有變化為止。** 這裡三支互相只讀一層，所以兩輪就夠。 */
  for (let i = 0; i < 2; i++) for (const t of TILES) run(t.gen, {});
}
console.log("  ✓ 已還原：LINE 那三張是三格拼一顆的版本");

/* ---------- 第二步：量原圖的內容外框（拿來算「裁完還剩多少留白」）---------- */
const box = {};
for (const t of TILES) box[t.k] = inkBox(decode(core[t.k]), BG);

/* ---------- 第三步：補邊 ---------- */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });

const b64 = (buf) => "data:image/png;base64," + buf.toString("base64");

const WM = Object.fromEntries(TILES.map(t => [t.k, wmFor(t.k, { mode: "fb-solo" })]));

/* 那一顆形狀，畫在補過的畫布上（往右移 PAD，其餘一個值都不動） */
const wmSvg = (k) => {
  const w = WM[k];
  const svg = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${w.shape}.svg`), "utf8")
    .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
    .replace(/<svg/, '<svg class="wm"');
  const tf = (w.flipX || w.flipY)
    ? `;transform:scale(${w.flipX ? -1 : 1},${w.flipY ? -1 : 1})` : "";
  const css = `width:${w.w}px;height:${w.h}px;left:${(w.left + PAD).toFixed(1)}px;`
            + `top:${w.top}px${tf}`;
  return { svg, css };
};

const padHtml = (k, uri) => {
  const { svg, css } = wmSvg(k);
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
html,body{width:${OUTW}px;height:${CANVAS}px}
body{background:${CARD};position:relative;overflow:hidden}
/* 浮水印畫在補過的畫布上，讓它從原圖的邊接著長出去 —— 見檔頭那一段。
   顏色、濃度、大小、切哪一邊一個值都沒改，只有 left 加了補邊的寬度。 */
svg.wm{position:absolute;${css};color:${INK};opacity:${WM[k].opacity};z-index:0}
/* 原圖疊在上面：中央那 1080 因此一個像素都不會動 */
img.core{position:absolute;left:${PAD}px;top:0;width:${CANVAS}px;height:${CANVAS}px;
         display:block;z-index:1}
</style>${svg}<img class="core" src="${uri}" alt="">`;
};

for (const t of TILES) {
  const pg = await browser.newPage({
    viewport: { width: OUTW, height: CANVAS }, deviceScaleFactor: 1 });
  await pg.setContent(padHtml(t.k, b64(core[t.k])));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete));
  await pg.screenshot({ path: path.join(OUT, finalOf(t.k)) });
  await pg.close();
}

/* ⚠⚠⚠ 守門：**中央那 1080×1080 要和原圖逐像素相同**。
   「內容一個像素不動」是這一輪唯一的承諾，而它壞掉的樣子是
   「顏色差一階、版面完全正常」—— 只有逐像素比才看得出來。 */
for (const t of TILES) {
  const a = decode(core[t.k]), b = decode(fs.readFileSync(path.join(OUT, finalOf(t.k))));
  if (b.w !== OUTW || b.h !== CANVAS) throw new Error(`${t.name} 補完是 ${b.w}×${b.h}，不是 ${OUTW}×${CANVAS}`);
  let worst = 0, n = 0;
  for (let y = 0; y < CANVAS; y++) for (let x = 0; x < CANVAS; x++) {
    const p = at(a, x, y), q = at(b, x + PAD, y);
    const d = Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2]));
    if (d) { n++; if (d > worst) worst = d; }
  }
  if (worst > 0) throw new Error(`${t.name} 中央那 1080 被動到了：${n} 個像素有差，最大 ${worst} 階`);
}
console.log("  ✓ 中央那 1080×1080 逐像素等於原圖（三張都是 0 個像素有差）");

/* ⚠ 再一道：補出來的兩條邊條裡**不可以有內容的墨**（只准有底色與淡浮水印）。
   這一道擋的是「補的位置算錯、把內容推出去一截」——那也是版面完全正常的壞法。 */
for (const t of TILES) {
  const d = decode(fs.readFileSync(path.join(OUT, finalOf(t.k))));
  for (const [nm, x] of [["左", 0], ["右", OUTW - PAD]]) {
    const b = inkBox(d, BG, { x, w: PAD });
    if (b.n > 0) throw new Error(`${t.name} ${nm}邊那一條補出來的裡面有 ${b.n} 個內容像素`);
  }
}
console.log("  ✓ 補出來的兩條邊條裡只有底色與浮水印，沒有內容");

/* ---------- 第四步：那個輪播框裡實際長什麼樣（真的裁出來）---------- */
/* ⚠ 擺真的產出檔、真的用 object-fit: cover 裁一次，不要用 CSS 把結果「畫」出來 ——
   要判斷的正是「會不會被裁到」，自己畫一份等於在自己編的東西上做決定。 */
const frameHtml = (uri) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0}body{width:${FCSS.w}px;height:${FCSS.h}px;overflow:hidden;background:${CARD}}
img{width:100%;height:100%;object-fit:cover;display:block}
</style><img src="${uri}" alt="">`;

const shotFrame = async (file, uri) => {
  const pg = await browser.newPage({
    viewport: { width: Math.round(FCSS.w), height: Math.round(FCSS.h) },
    deviceScaleFactor: GFRAME.DPR });
  await pg.setContent(frameHtml(uri));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete));
  await pg.screenshot({ path: path.join(OUT, file) });
  await pg.close();
};
for (const t of TILES) {
  await shotFrame(`crop-${t.k}-now.png`, b64(core[t.k]));
  await shotFrame(`crop-${t.k}-pad.png`, b64(fs.readFileSync(path.join(OUT, finalOf(t.k)))));
}
await browser.close();

/* ---------- 第五步：文字（讀回來，不重打、不另存）---------- */
/* ⚠⚠⚠ 這個帳號沒有專人回覆訊息（第十一之三節），而 Google 商家檔案有「問答」區 ——
   所以那條紅線在這裡也成立。三則現在一句都沒有踩到，這一道是擋「日後有人多寫一句」。 */
const RED = [/隨時(問|詢問|聯絡)/, /有問題.{0,6}(問|留言|私訊)/,
             /(留言|私訊).{0,4}(問我們|詢問|告訴我們)/,
             /二十四小時/, /24\s*小時.{0,4}(回|客服)/, /即時回(覆|應)/, /小編/];
const texts = {};
for (const t of TILES) {
  const s = fs.readFileSync(path.join(ROOT, ...t.txt), "utf8").replace(/\s+$/, "");
  for (const re of RED) if (re.test(s)) throw new Error(`${t.name} 的文字踩到紅線：${re}`);
  texts[t.k] = s;
}

/* ---------- 第六步：規格頁 ---------- */
const png = f => { const b = fs.readFileSync(path.join(OUT, f));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) }; };
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const shot = (f, wCss, cap) => { const d = png(f);
  const alt = cap.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return `<figure class="pv-shot"><img src="${f}" width="${wCss}" height="${Math.round(d.h * wCss / d.w)}"`
    + ` alt="${alt}" loading="lazy"><figcaption>${cap}</figcaption></figure>`; };

const CNOW = cover(CANVAS, CANVAS, GFRAME.W, GFRAME.H);
const CPAD = cover(OUTW, CANVAS, GFRAME.W, GFRAME.H);
const f1 = (v) => v.toFixed(1);

const marginRow = (t) => { const b = box[t.k];
  const left = b.padTop - CNOW.cutY, right = b.padBot - CNOW.cutY;
  const warn = Math.min(left, right) < 20;
  return `<tr><td>${t.name}</td><td>${b.padTop} / ${b.padBot}</td>`
    + `<td>${f1(CNOW.cutY)} / ${f1(CNOW.cutY)}</td>`
    + `<td${warn ? ' class="w"' : ""}><b>${f1(left)} / ${f1(right)}</b>${warn ? "　⚠" : ""}</td>`
    + `<td>${b.padTop} / ${b.padBot}　（上下不裁）</td></tr>`; };

const fileRow = (t) => { const d = png(finalOf(t.k)), w = WM[t.k];
  return `<tr><td>${t.name}</td><td><code>${finalOf(t.k)}</code></td>`
    + `<td>${d.w}×${d.h}・${d.kb}KB</td>`
    + `<td>${w.shape}・${w.w}px・${(w.opacity * 100).toFixed(0)}%<br>`
    + `${{ br: "壓右下", tl: "壓左上" }[w.pos]}、看得到 ${w.seen}px</td>`
    + `<td><a href="${t.spec}">完整規格</a></td></tr>`; };

const html = `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Google 商家貼文｜芳仁牙醫診所</title>
<style>
*{box-sizing:border-box;margin:0}
body{background:#e2e5e6;color:${INK};font-size:15px;line-height:1.75;
     font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
     padding:24px 14px 64px}
.pv-wrap{max-width:760px;margin:0 auto}
h1{font-size:1.5rem;line-height:1.5;letter-spacing:.02em}
.pv-lead{color:${SOFT};margin-top:8px}
.pv-h2{font-size:1.15rem;margin:36px 0 10px;padding-top:16px;border-top:1px solid ${RULE};
       letter-spacing:.02em}
.pv-h2 .t{font-size:.8rem;color:${SOFT};font-weight:400;margin-left:.6em;letter-spacing:0}
.pv-h3{font-size:1rem;margin:22px 0 8px;color:${SOFT};letter-spacing:.02em}
.pv-cap{color:${SOFT};font-size:.9rem;line-height:1.85;margin-bottom:12px}
.pv-row{display:flex;flex-wrap:wrap;gap:14px}
.pv-shot{background:${CARD};border:1px solid ${RULE};border-radius:12px;padding:10px;margin:0}
.pv-shot img{display:block;border-radius:6px;max-width:100%;height:auto}
.pv-shot figcaption{font-size:.8rem;color:${SOFT};margin-top:8px;line-height:1.6}
table{border-collapse:collapse;width:100%;min-width:520px;background:${CARD};
      font-size:.88rem;border:1px solid ${RULE};border-radius:8px}
th,td{border-bottom:1px solid ${RULE};padding:8px 10px;text-align:left;vertical-align:top}
th{color:${SOFT};font-weight:600;white-space:nowrap}
td.w{color:#89202d}
.pv-scroll{overflow-x:auto}
code{font-size:.86em;background:#e8e9ea;padding:1px 5px;border-radius:4px}
pre{background:${CARD};border:1px solid ${RULE};border-radius:8px;padding:12px 14px;
    white-space:pre-wrap;overflow-wrap:anywhere;font-size:.9rem;line-height:1.85;
    font-family:"Noto Sans TC","PingFang TC",sans-serif}
a{color:#214d48}
ul,ol{padding-left:1.3em}li{margin:.35em 0}
b{font-weight:700}
</style></head><body><div class="pv-wrap">

<h1>這三張圖貼到 Google 商家的「最新動態」</h1>
<p class="pv-lead">2026-09-13。內容<b>一個像素都沒有動</b> ——
只做了兩件事：<b>左右各補 54px</b>（上下就不會被裁），
以及<b>浮水印換回「一張一顆」</b>那一版。</p>

<h2 class="pv-h2">先講量出來的<span class="t">你說「地圖那張有點被裁到」</span></h2>
<p class="pv-cap">
三張截圖裡那個輪播框都是 <b>${GFRAME.W}×${GFRAME.H} 裝置 px（${(GFRAME.W / GFRAME.H).toFixed(4)}:1）</b>，
而我們的圖是 1080 見方 —— 它照寬度放大，所以<b>上下各裁掉 ${f1(CNOW.cutY)} 個原圖像素</b>。<br>
⚠ 三張量到的上下界完全一樣（579–1511），所以那不是某一張的巧合。</p>
<div class="pv-scroll"><table>
<tr><th>貼文</th><th>內容離上/下邊</th><th>現況被裁掉</th><th>現況裁完還剩</th><th>補邊之後</th></tr>
${TILES.map(marginRow).join("\n")}
</table></div>
<p class="pv-cap">
⭐ <b>一個像素的墨都沒有被裁掉</b> —— 地圖那張是「貼邊」不是「缺角」，
你看到的是<b>留白被吃光</b>。<br>
⚠⚠ 而且那 ${f1(CNOW.cutY)} 幾乎正好等於地圖那張自己的頁面內距
（你 09-08 挑的 Ⓜ3 ＝ 26px）—— 那是巧合，但它說明為什麼<b>只有那一張看得出來</b>。</p>

<h2 class="pv-h2">做法：左右各補 ${PAD}px<span class="t">Ⓟ2</span></h2>
<p class="pv-cap">
要它不裁上下，只要讓圖比框<b>寬</b>就好。1080 ＋ 2×${PAD} ＝ <b>${OUTW}×${CANVAS}</b>（1.10:1）：</p>
<div class="pv-scroll"><table>
<tr><th>畫面的框</th><th>會裁掉</th><th>內容有沒有被碰到</th></tr>
<tr><td>${(GFRAME.W / GFRAME.H).toFixed(4)}:1（這支手機量到的）</td>
    <td>左右各 ${f1(CPAD.cutX)}px，上下 0</td><td>沒有 —— 裁掉的全是補出來的那一條</td></tr>
<tr><td>1.00:1（正方形的畫面）</td><td>左右各 ${PAD}px，上下 0</td>
    <td>沒有 —— 正好把補的那一塊吃完，回到原本的留白</td></tr>
</table></div>
<p class="pv-cap">
所以 <b>1.00 ~ 1.10 這整個區間都碰不到內容</b>。<br>
⚠ 代價：內容在框裡畫出來<b>小 4.9%</b>，左右各露一條 24 裝置 px 的底色。<br>
⚠ 落選 <b>Ⓟ1</b>（補到剛好 1136×1080）：在這支手機上完全不裁、內容一樣大，
但框只要再扁一點就又開始裁上下 —— <b>零餘裕</b>。</p>

<h2 class="pv-h2">輪播框裡實際長什麼樣<span class="t">真的裁出來的，${GFRAME.W}×${GFRAME.H}</span></h2>
<p class="pv-cap">左邊是現況（1080 見方），右邊是補邊之後。
⚠ 這六張是<b>真的用 cover 裁一次</b>出來的，不是用 CSS 把結果畫一遍。</p>
${TILES.map(t => `<h3 class="pv-h3">${t.name}</h3><div class="pv-row">`
  + shot(`crop-${t.k}-now.png`, 300, "現況（1080 見方）")
  + shot(`crop-${t.k}-pad.png`, 300, `補邊之後（${OUTW}×${CANVAS}）`)
  + `</div>`).join("\n")}

<h2 class="pv-h2">浮水印換回「一張一顆」<span class="t">fb-solo</span></h2>
<p class="pv-cap">
Google 這邊是<b>一張一張被看到的</b>（輪播要左右滑、分開發更是三則），
所以三格拼一顆的那顆圓<b>接不起來</b>，每張上只剩一塊往畫布外流出去的弧。<br>
⚠ 這一組的值<b>一個都不是新挑的</b>，全部是你 09-08 在那兩頁上挑定的
（形狀、大小、切掉多少、濃度、壓哪一角）。</p>
<p class="pv-cap">
⚠⚠⚠ <b>補的那一條不可以是純色 —— 這件事是量出來才知道的。</b>
三張的浮水印都是<b>從某一邊切出去</b>的（門診表與科別醫師往右下、地圖往左上），
所以原圖的邊上本來就有浮水印的墨。補一條純底色上去，
會在<b>原本 1080 的邊界留下一條約 8 階的直線</b>。<br>
→ 補邊那一層<b>把同一顆浮水印畫下去、讓它接著長出去</b>，再把原圖疊在上面：
中央那 1080 一個像素都沒動，兩條邊條上浮水印自然地接完。<br>
⚠ 這在 1080 見方上看不出來（浮水印就切在畫布邊上，本來就是一條線），
<b>只有補了邊才會變成「圖中間有一條線」</b>。</p>

<h2 class="pv-h2">要上傳的那三張<span class="t">${OUTW}×${CANVAS}・PNG</span></h2>
<div class="pv-scroll"><table>
<tr><th>貼文</th><th>檔案</th><th>尺寸</th><th>浮水印</th><th></th></tr>
${TILES.map(fileRow).join("\n")}
</table></div>
<div class="pv-row">
${TILES.map(t => shot(finalOf(t.k), 330, t.name)).join("\n")}
</div>
<p class="pv-cap">
⚠ LINE 與臉書那幾張<b>完全不受影響</b> —— 這一支跑完會用預設值再跑一次，
把 LINE 那三張還原成三格拼一顆的版本。</p>

<h2 class="pv-h2">貼文的文字<span class="t">整段複製</span></h2>
<p class="pv-cap">
這三段和 LINE 那三則<b>逐字相同</b>，是從那一則自己的檔案讀回來的、沒有重打。
要改文字就回那一頁改，這裡會跟著換。<br>
⚠ Google 的說明欄上限 1500 字，三段都塞得下；<b>預覽只露前面一兩行</b>，
所以第一行要放重點（和 LINE 的「詳情」同一條規矩）。<br>
⚠ Google 這邊<b>不放 hashtag</b>（那是臉書那一份才有的事）。</p>
${TILES.map(t => `<h3 class="pv-h3">${t.name}</h3><pre>${esc(texts[t.k])}</pre>`).join("\n")}

<h2 class="pv-h2">還沒收掉的</h2>
<ul>
<li>⚠⚠ 上面那個 ${GFRAME.W}×${GFRAME.H} 是<b>「一則三張」的輪播框</b>量到的。
<b>一則一張的卡不見得同一個比例</b> —— 改成分開發的話，發之前再按一次「預覽」確認。</li>
<li>⚠ 桌機搜尋、Google 地圖 app 上的框也不一定一樣。補了邊之後 1.00~1.10 都安全，
但如果哪個畫面是 4:3 那種很扁的框，地圖那張還是會被切 ——
那時只有一條路：把那張圖的上下留白從 26 拉回 44 以上（＝退回 Ⓜ1，地圖從 848 縮到約 770）。
<b>那是你 09-08 才在四格裡挑定的取捨，沒有自己動。</b></li>
<li>Google 商家貼文的圖片規格（建議尺寸、檔案上限）是<b>二手資料</b> ——
這個容器連不出去，沒辦法查 Google 自己的說明頁。這三張 100~350KB，
在任何一個常見的上限底下都很安全。</li>
<li>⚠ 商家名稱現在是「芳仁牙醫診所｜植牙推薦｜顯微根管｜…」。Google 的規定是
商家名稱要和實體招牌一致，額外的關鍵字有被檢舉、被系統改回、嚴重時影響檔案的風險。
<b>這件沒有動任何東西，由你們判斷。</b></li>
<li>三張要<b>分開發三則</b>還是<b>一則三張</b>還沒定 —— 分開發的話文字可以各寫各的、
動作按鈕也可以各掛各的（門診表撥電話／地圖路線／科別網站）。
⚠ 順序要<b>倒過來發</b>（位置停車 → 科別醫師 → 門診表），門診表才會排在第一張。</li>
</ul>

</div></body></html>`;

fs.writeFileSync(path.join(OUT, "index.html"), html);

/* ---------- 面板 ---------- */
/* ⚠ 這幾個數字每次出圖都要印 —— 哪天動到留白、浮水印或補邊的寬度，
   這裡會有一個數字跟著變，而版面完全不會壞（第九節第 28 條 ④）。 */
console.log(`\n── Google 商家貼文 ──`);
console.log(`  輪播框　${GFRAME.W}×${GFRAME.H} 裝置 px ＝ ${(GFRAME.W / GFRAME.H).toFixed(4)}:1`
  + `（${FCSS.w.toFixed(1)}×${FCSS.h.toFixed(1)} CSS px）`);
console.log(`  補邊　　每邊 ${PAD}px → ${OUTW}×${CANVAS}（${(OUTW / CANVAS).toFixed(3)}:1）`);
console.log(`  現況　　上下各裁 ${f1(CNOW.cutY)}　左右 ${f1(CNOW.cutX)}`);
console.log(`  補邊後　上下各裁 ${f1(CPAD.cutY)}　左右 ${f1(CPAD.cutX)}（全是補出來的那一條，`
  + `還剩 ${f1(PAD - CPAD.cutX)}px 沒被裁到）`);
console.log(`  內容在框裡畫出來　現況 ×${CNOW.s.toFixed(4)}　補邊後 ×${CPAD.s.toFixed(4)}`
  + `　＝ 小 ${((1 - CPAD.s / CNOW.s) * 100).toFixed(1)}%`);
for (const t of TILES) {
  const b = box[t.k], d = png(finalOf(t.k)), w = WM[t.k];
  console.log(`\n  ${t.name}`);
  console.log(`    內容　上留白 ${b.padTop}　下留白 ${b.padBot}　`
    + `→ 現況裁完剩 ${f1(b.padTop - CNOW.cutY)} / ${f1(b.padBot - CNOW.cutY)}`
    + `${Math.min(b.padTop, b.padBot) - CNOW.cutY < 20 ? "　⚠ 貼邊" : ""}`);
  console.log(`    補邊後　上下不裁，留白維持 ${b.padTop} / ${b.padBot}`);
  console.log(`    浮水印　${wmDesc(w)}`);
  console.log(`    成品　${d.w}×${d.h}・${d.kb}KB`);
}
console.log(`\n  ✓ 規格頁 /preview/google-post/`);
