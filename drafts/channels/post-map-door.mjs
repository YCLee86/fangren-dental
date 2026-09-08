/* LINE 商家貼文用的「位置與周邊停車」圖 —— **門口那張告示的版本**
 *   node drafts/channels/post-map-door.mjs   → preview/line-post-map/door-*.png
 *
 * 2026-09-08 使用者：「之前做過一版印出來的停車建議（因為有警察開單）用那個版本製作
 *   有 P1 P2 P3 和 QR code 的那個」＝ drafts/door-notice/（2026-08-23 定案的 A4 告示）。
 *
 * ⚠⚠⚠ 那張告示是**貼在門口給站在門口的人看的**，這一則是**貼在 LINE 主頁給還沒出門的人看的**。
 *   換了媒介就有三件「原本對、現在不對」的事（CLAUDE.md 第九節第 28 條 ⑤）：
 *   ① **「現在位置」四個字** —— 看貼文的人不在那裡，那四個字會被讀成「你現在的位置」。
 *      → 建議換成「芳仁牙醫」（＝站上那張地圖綠塊裡本來的四個字）。門口那一版留成 Ⓑ。
 *   ② **三顆 QR** —— 看的人**正拿著那支手機**，掃不了自己螢幕上的碼。
 *      → 照做（他指名要這一版），但把每一顆在小格上有幾 px、一格幾 px 量出來寫在頁上；
 *        LINE 上真正接得住這件事的是**「詳情」欄裡三條可以點的網址**，那一份也一起產。
 *   ③ **「鄰近停車場可參考如下圖」** —— 那句話要求地圖在文字**底下**。
 *      這一版的版面因此鎖定「四點在上、地圖在中」，**不要把地圖搬到旁邊或上面**。
 *
 * ⚠⚠ 反過來，門口那張有一件在方形畫布上**比站上那張好**：它把地圖轉了 90 度
 *   （正對診所／西在上），所以地圖是**橫的（1.24）**而不是站上那張的直的（0.903）。
 *   方形畫布吃橫的圖吃得下 —— 這就是這一版在版面上贏的地方（見 Ⓔ 那一格的代價）。
 *
 * ⚠⚠⚠ 一樣不重畫也不重抄：**跑 drafts/door-notice/gen.mjs 產出那張告示本人**，
 *   在瀏覽器裡把它的地圖、四點提醒、三張 QR 卡讀回來，再排進 1080 的方畫布。
 *   旋轉、街名重排、路線圓點、指北針、QR 的碼**一個字都不在這支腳本裡**。
 *
 * ⚠ 一律 headless_shell（第九節第 18 條）。容器裡沒有 Noto Sans TC，中文落到 WenQuanYi Zen Hei。
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-map");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const HOURS = path.join(ROOT, "preview", "line-post-hours", "fangren-hours-1080.png");

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";
const BRICK = (fs.readFileSync(path.join(ROOT, "drafts", "door-notice", "style.css"), "utf8")
  .match(/--brick:\s*(#[0-9A-Fa-f]{6})/) || [])[1];
if (!BRICK) throw new Error("door-notice/style.css 裡讀不到 --brick");

/* 地址與電話：一樣從 index.html 頁尾讀回來 */
const ADDR = (SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/) || [])[1].replace(/&nbsp;/g, " ");
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!ADDR || !PHONE) throw new Error("index.html 裡讀不到地址或電話");

/* 對比度（浮水印那一段要用；PALETTE.md 的算法，不新增顏色） */
const hex2rgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (v) => "#" + v.map(x => Math.round(x).toString(16).padStart(2, "0")).join("");
const lum = (h) => { const [r, g, b] = hex2rgb(h).map(v => { v /= 255;
  return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + .05) / (y + .05); };

/* ---------- 畫布 ---------- */
const W = 1080, H = 1080;
const BIG_W = 823, BIG_H = 409, SMALL = 410;
const BAND = Math.round(W * (BIG_H / BIG_W));
const PAD = 40;
/* ⚠⚠ 2026-09-08：上下留白與段距**變成一把尺**（使用者：「指北針變小　地圖的部分
   就有餘裕大一點　調整一下」）。
   ⚠⚠⚠ 但要先講清楚一件事：**指北針能給的已經給完了**（地圖 754 → 758）——
     它畫在地圖那張圖的 viewBox 裡，收小只讓那張圖瘦一點點。
     真正卡住地圖的是**高度**：地圖是「填滿剩下的高度」，左右反而還空著 121px。
     所以地圖要大，只能從**這一頁自己的留白**拿（第 28 條 ③：為了守一條限制而削別的
     東西時，要把取捨攤開讓他選）。
   ⚠ 指北針那條帶子**不可以拿來抵**：門口那張的規則是「指北針不可以壓在路上」
     （使用者 2026-08-23 指定），所以那條帶子是它的家，不是浪費。 */
/* ⚠⚠⚠ 2026-09-08 使用者挑了 **Ⓜ3**（「選 M3」）—— 所以那一組值寫回這裡當預設，
   每一張 door-*.png 都跟著吃到（CLAUDE.md 那一列：「挑定之後要把那一組值寫回
   MARGIN0／GAP0」）。原本的 44／18 變成尺上的 Ⓜ1，仍然產得出來當對照。
   ⚠ **左右的內距 PAD 沒有跟著收**（一直是 40）：收它一點地圖都換不到（高度在卡），
     只會讓上面那兩句變長。所以「上下比左右緊」是刻意的。 */
const GAP0 = 11, MARGIN0 = 26;

/* ---------- 浮水印（2026-09-08 使用者：「試試看這個壓像門診表的浮水印看看，
   可能要更淡一點」）----------
   做法沿用看診時間那一張（post-hours.mjs）：**一顆大的、淡的、從邊緣切出去的圓 logo**，
   顏色是墨 ＋ 很低的 opacity，**不新增任何顏色**、也不多一個檔案（形狀從 brand/shapes 讀）。
   ⚠⚠⚠ 但有一件和那一張**不一樣、照抄就會壞**：這一張的地圖是一張**不透明的 PNG**
     （截圖帶著畫布底色，角落那道守門就在驗這件事），它蓋掉畫布中央 840×660。
     浮水印若照門診表擺在**所有東西後面**，會被那個長方形**切掉一大塊** ——
     圓形突然沿著地圖的邊消失，看起來就是壞的。
     所以這裡是**壓在最上面**（z-index 2），濃度極低。
     那兩種做法在淡的那一端讀起來一樣（亮處都是一層灰、暗處都看不出來），
     差別只在「會不會被地圖切掉」。
   ⚠ 濃度是一把尺（第 28 條 ①）：門診表那一張是 .05，他說「可能要更淡一點」，
     所以預設先給 .03，另外三格擺出來讓他比。 */
const WMSH = "r3c1";                 /* ＝ 門診表那一張用的同一顆圓 logo（單洞版） */
/* ⚠ 大小與位置**逐字照門診表那一張**（660／−60／470，都是 1080 上的值）——
   使用者說的是「像門診表的浮水印」，兩張圖並排在主頁三格裡，
   位置與份量不一樣就會讀成兩件事。**只有濃度是這一輪要挑的。** */
const WMW = 660, WMR = -60, WMT = 470, WMA0 = .03;

/* 浮水印的形狀：從 brand/shapes 讀，不抄第二份（同這一支其餘每一項資料）。
   ⚠ 那幾份 SVG 是單一路徑、currentColor、牙洞用 fill-rule 挖穿的，
     所以只要把 width/height 拿掉、掛一個 class，顏色與濃度就交給 CSS。 */
const WMARK = fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${WMSH}.svg`), "utf8")
  .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
  .replace(/<svg/, '<svg class="wm"');

/* PNG 的真實尺寸（IHDR） */
const pngSize = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

/* ---------- 先把門口那張告示產出來（永遠是最新的） ---------- */
execFileSync("node", ["drafts/door-notice/gen.mjs"], { cwd: ROOT, stdio: "pipe" });
const DOOR = path.join(ROOT, "drafts", "door-notice", "preview.html");
if (!fs.existsSync(DOOR)) throw new Error("drafts/door-notice/gen.mjs 沒有產出 preview.html");

/* ---------- 出圖 ---------- */
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

/* ========== 第一步：門口那張告示上，把要用的東西讀回來 ========== */
const doorPage = await browser.newPage({ viewport: { width: 1400, height: 1200 } });

/* 四點提醒、三張停車場卡（含 QR 的 SVG）—— 一個字都不重打 */
await doorPage.goto("file://" + DOOR + "?size=l&orient=w&qr=on");
await doorPage.waitForTimeout(1400);
const D = await doorPage.evaluate(() => ({
  points: [...document.querySelectorAll(".nt-points li")].map(li => li.innerHTML.trim()),
  lots: [...document.querySelectorAll(".nt-lot")].map(el => ({
    qr: el.querySelector(".nt-code svg").outerHTML,
    tag: el.querySelector(".nt-nm .no").textContent.trim(),
    name: el.querySelector(".nt-nm").textContent.replace(
      el.querySelector(".nt-nm .no").textContent, "").trim(),
    dist: el.querySelector(".nt-du").textContent.trim(),
  })),
}));
if (D.points.length !== 4) throw new Error(`四點提醒讀到 ${D.points.length} 條`);
if (D.lots.length !== 3) throw new Error(`停車場卡讀到 ${D.lots.length} 張`);
/* ⚠⚠⚠ 2026-09-08 使用者：「選 C 但前兩行 紅線 開單的文句拿掉」。
 *   那兩句（劃設紅線／直接開單）是**門口那張紙**才成立的理由：站在門口的人車已經停了，
 *   要擋的是「就停一下」；看貼文的人還沒出門，同一句話讀起來變成
 *   「這間診所門口會被開單」＝ 警告不是幫忙（第九節第 28 條 ⑤ 換媒介那一條）。
 * ⚠⚠ 但**不可以用索引硬切** —— body.html 哪天多一句或換順序，就會靜靜地砍錯句子而且不報錯。
 *   砍掉的一定要真的是紅線／開單那兩句、留下來的一定不是，對不上就 throw。 */
const strip = (t) => t.replace(/<[^>]+>/g, "");
const dropPts = (n) => {
  if (!n) return D.points;
  const cut = D.points.slice(0, n), keep = D.points.slice(n);
  const fine = (t) => /紅線|開單/.test(t);
  if (!cut.every(fine)) throw new Error(
    `要拿掉的那 ${n} 句裡有不是「紅線／開單」的：${cut.map(strip).join("／")}`);
  if (keep.some(fine)) throw new Error(
    `留下來的句子裡還有「紅線／開單」：${keep.map(strip).join("／")}`);
  if (!keep.length) throw new Error("四點提醒被砍光了");
  return keep;
};

/* QR 的格數從它自己的 viewBox 讀（-4 -4 n+8 n+8），不另外算一份 */
const QRN = D.lots.map(l => {
  const m = l.qr.match(/viewBox="-4 -4 (\d+) \d+"/);
  if (!m) throw new Error("QR 的 viewBox 讀不出格數");
  return +m[1] - 8;
});
/* 三條要放進「詳情」的網址：從 index.html 那三個 .rl-link 讀回來（唯一的出處），
   ⚠ 用**門口那張的 P 順序**排（P1 壹車房／P2 合廷／P3 永樂站，使用者自己排的，
     刻意不是照距離）—— 所以拿名字的前兩個字去對，對不到就 throw。 */
const LINKS = [...SRC.matchAll(
  /<a class="rl-link" href="([^"]+)"[\s\S]{0,600}?<text class="rl-nm"[^>]*>([^<]+)<\/text>/g)]
  .map(m => ({ url: m[1], name: m[2].trim() }));
if (LINKS.length !== 3) throw new Error(`index.html 讀到 ${LINKS.length} 條停車場連結`);
const URLS = D.lots.map(l => {
  const hit = LINKS.find(x => x.name.startsWith(l.name.slice(0, 2)));
  if (!hit) throw new Error(`${l.name} 在 index.html 上對不到連結`);
  return hit.url;
});

/* 地圖：讓告示**自己的版面**把地圖撐大，我們只調整那張紙有多寬。
 * ⚠⚠⚠ 踩過一次而且很難查：直接去改 `.sh-map` 的寬高（A4 橫那一組）之後，
 *   地圖畫出來會**少一條街**（「永安路」那一行整個不見），而元素的尺寸、
 *   長寬比、viewBox、裁切框**每一個數字都是對的** —— 只有把圖打開看才看得到。
 *   告示的版面是它自己那支 fit() ＋ 容器查詢單位（cqw）算出來的，
 *   從中間插手就會踩到它沒有預期的狀態。**改那張紙的寬度、讓它自己算**就沒事。
 * ⚠ 用 A4 **直**式那一組（size=p）：提醒在上、地圖在中、QR 在下，
 *   和我們要排的方畫布順序一樣，地圖拿得到的空間也最大。
 * ⚠ 紙寬 → 地圖寬大約是 0.838 倍，兩輪就收斂到 ±1px；最後**用量到的真值**，
 *   不用「我打算給它多大」。 */
const SHEET_K = 0.838;
const setSheet = async (sw, you) => doorPage.evaluate(({ sw, you, CARD }) => {
  const bar = document.getElementById("pvBar"); if (bar) bar.style.display = "none";
  if (you === "clinic") {
    const t = document.querySelector(".map-svg text.you");
    if (!t) throw new Error("找不到綠塊裡那兩行字");
    const sp = t.querySelectorAll("tspan");
    sp[0].textContent = "芳仁"; sp[1].textContent = "牙醫";
  }
  /* 截圖會連元素框後面那一塊底色一起帶走 —— 先設成畫布的底色 */
  document.querySelector(".sheet").style.background = CARD;
  /* ⚠ 地圖以外的東西先藏起來：截圖是「在那個元素的框裡切一刀」，
     壓在框裡的東西也會被拍進去（下面還會再驗一次真的沒有）。 */
  document.querySelectorAll(".nt-lots, .nt-side, .nt-points").forEach(el => {
    el.style.visibility = "hidden";
  });
  const sheet = document.querySelector(".sheet");
  sheet.style.width = sw + "px";
  sheet.style.aspectRatio = "auto";
  sheet.style.height = Math.round(sw * 1.6) + "px";
  window.dispatchEvent(new Event("resize"));
  const r = document.querySelector(".sh-map svg.map-svg").getBoundingClientRect();
  return r.width;
}, { sw, you, CARD });

/* ⚠⚠ 2026-09-08 使用者：「指北針的標示和北可以小一點」。
   門口那張紙上那一組是 `ns=b`（針長 36）—— 那是**站在門口、離半公尺**挑的；
   這張圖要在小格 410px 上看，同一組就顯得吵。門口那張**一個字都沒動**，
   只有這裡帶 `?ns=` 換一格。⚠ 指北針畫在地圖那張 SVG 的 viewBox 裡面，
   所以換大小**不會動到地圖的框**（每一張圖的版面逐格不變）。 */
const shotMap = async (targetW, { orient = "w", you = "clinic", ns = "c" } = {}) => {
  await doorPage.goto("file://" + DOOR + `?size=p&orient=${orient}&qr=on&ns=${ns}`);
  await doorPage.waitForTimeout(1400);
  let sw = Math.round(targetW / SHEET_K), got = 0;
  for (let i = 0; i < 4; i++) {
    got = await setSheet(sw, you);
    if (Math.abs(got - targetW) <= 1) break;
    sw = Math.round(sw * targetW / got);
  }
  await doorPage.waitForTimeout(300);
  /* 拍之前先量：這一刀切下去，框裡除了地圖還有沒有別的東西
     （通則：守門要跟著這一張圖的形狀走，不要跨頁照抄 —— 見 cancel-png 那一輪） */
  const clash = await doorPage.evaluate(() => {
    const svg = document.querySelector(".sh-map svg.map-svg");
    const r = svg.getBoundingClientRect();
    return [...document.body.querySelectorAll("*")].filter(el => {
      if (el === svg || svg.contains(el) || el.contains(svg)) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      if (!el.childNodes.length || [...el.childNodes].every(n => n.nodeType === 1)) return false;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return false;
      return !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom);
    }).map(el => el.className && el.className.baseVal !== undefined
      ? el.className.baseVal : String(el.className || el.tagName)).slice(0, 5);
  });
  if (clash.length) throw new Error(`截圖的框裡壓著地圖以外的東西：${clash.join("、")}`);
  const buf = await doorPage.locator(".sh-map svg.map-svg").screenshot();
  const meta = await doorPage.evaluate(() => {
    const svg = document.querySelector(".sh-map svg.map-svg");
    const r = svg.getBoundingClientRect();
    const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
    const you = document.querySelector(".map-svg text.you");
    /* ⚠⚠ 六條主街的字**每一條都要畫得出來** —— 上面那個坑的症狀就是
       其中一條的外框變成 0×0（元素還在、字沒了），而尺寸守門一個都抓不到。 */
    const labs = [...svg.querySelectorAll("text.lbl")].map(t => {
      const q = t.getBoundingClientRect();
      return { s: t.textContent.replace(/\s+/g, ""), w: +q.width.toFixed(1), h: +q.height.toFixed(1) };
    });
    /* 指北針：整組畫出來多高、「北」多大（都換算成畫布 px） */
    const nswG = svg.querySelector(".nsw"), nswT = svg.querySelector(".nsw text");
    const kk = r.width / vb[2];
    const nsw = nswG ? { h: +(nswG.getBBox().height * kk).toFixed(1),
                         fs: +(parseFloat(getComputedStyle(nswT).fontSize) * kk).toFixed(1) } : null;
    return { w: r.width, h: r.height, vb, k: kk, labs, nsw,
             you: you && you.style.display !== "none" ? [...you.querySelectorAll("tspan")]
               .map(t => t.textContent).join("") : null,
             type: Object.fromEntries([["街名", ".map-svg .lbl"], ["巷名", ".map-svg .lbl-xs"],
               ["綠塊", ".map-svg text.you"], ["P 代號", ".map-svg .pk"]]
               .map(([nm, sel]) => {
                 const el = document.querySelector(sel);
                 return [nm, el ? parseFloat(getComputedStyle(el).fontSize) * (r.width / vb[2]) : 0];
               })) };
  });
  if (meta.labs.length !== 6) throw new Error(`地圖上的主街讀到 ${meta.labs.length} 條，應該是 6`);
  const gone = meta.labs.filter(l => !(l.w > 0 && l.h > 0)).map(l => l.s || "(空的)");
  if (gone.length) throw new Error(`地圖上有 ${gone.length} 條街名沒有畫出來：${gone.join("、")}`
    + "（尺寸與長寬比都會是對的，只有把圖打開看才看得到）");
  return { buf, meta };
};

/* ========== 第二步：1080 的方畫布 ========== */
let MAPW = 0, MAPH = 0, MAPURI = "";
const css = (fs2, qrpx, lotk = 1, wrapn = 0, GAP = GAP0, wma = WMA0) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       position:relative;overflow:hidden}
.band{padding:0 ${PAD}px;position:relative;z-index:1}
/* 浮水印：從右下角切出去（.sheet 有 overflow:hidden，切掉的不會真的畫出來）。
   ⚠⚠ 壓在**最上面**不是最下面 —— 見上面 WMSH 那一段：地圖是不透明的 PNG，
   擺在後面會被那個長方形切掉一塊。濃度低到亮處只是一層灰、暗處看不出來。 */
svg.wm{position:absolute;width:${WMW}px;height:auto;right:${WMR}px;top:${WMT}px;
       color:${INK};opacity:${wma};z-index:2;pointer-events:none}
/* ⚠ 標題只在「拿掉前兩句」那一版才有意義：那兩句一走，整張圖第一眼看到的
   就變成「周邊路段有畫設之路邊停車格」＝ 沒有人知道這是誰家的。
   給成一格尺讓使用者挑，不要自己加上去（第九節第 28 條 ①）。 */
.tt{font-size:${Math.round(fs2 * 1.5)}px;font-weight:700;letter-spacing:.02em;
    padding-bottom:${Math.round(fs2 * .58)}px}
/* 四點提醒：字與紅字**逐字沿用門口那張**（使用者 2026-08-23 一句一句定的），
   只有字級跟著這個媒介重挑（小格 410px 上要讀得出來）。 */
.pts{list-style:none;display:grid;gap:${Math.round(fs2 * .34)}px;padding:0 0 ${GAP}px}
.pts li{position:relative;padding-left:${Math.round(fs2 * .82)}px;
        font-size:${fs2}px;line-height:1.62;letter-spacing:.01em}
.pts li::before{content:"";position:absolute;left:0;top:.66em;
  width:${Math.round(fs2 * .28)}px;height:${Math.round(fs2 * .28)}px;border-radius:50%;
  background:${SOFT}}
.pts b{color:${BRICK};font-weight:700;white-space:nowrap}
.rule{height:1px;background:${RULE}}
.map{padding:${GAP}px 0;display:flex;justify-content:center}
.map img{display:block}
/* 三張停車場卡：排法沿用門口那張（一場一顆碼，橫著排開、拉開距離） */
/* ⚠ 一個 fr ＝ minmax(auto,1fr)，最小值是 min-content —— 名字是 nowrap，
   一格撐破會把**整條推出畫布**（同站上 .info-card 那條 min-width:0）。
   ⚠⚠ 這是模板字串，CSS 註解裡不可以出現反引號（第八節那一條）。 */
.lots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${Math.round(fs2 * .9)}px;
      padding-top:${GAP}px}
.lot{text-align:center}
/* ⚠⚠⚠ QR 上面不可以壓任何東西，浮水印也不行 —— 那顆碼在 823px 上每格只有 3.72px，
   已經在解碼器的邊緣，再蓋一層 3% 的墨就可能整顆掃不出來（而且**畫面上看不出來**，
   同門口那張 README 那一條：QR 不能用眼睛驗收）。所以這一塊自己拉到浮水印前面。 */
.lot .qr{display:flex;justify-content:center;position:relative;z-index:3}
.lot .qr svg{width:${qrpx}px;height:${qrpx}px;display:block}
.lot .nm{margin-top:${Math.round(fs2 * .38)}px;font-size:${Math.round(fs2 * .86 * lotk)}px;
         font-weight:700;letter-spacing:.02em;
         /* ⚠ flex-wrap 也要跟著 wrapn 開關 —— 只開它、white-space 還是 nowrap 的話，
            名字會被當成一個不能斷的 flex 項目丟到第二行，Ⓐ 就不是他看過的那一張了。
            ⚠⚠ 而且折行那一種要**把號碼牌獨立成一列**：讓它跟著文字流的話，
            三格會各自折在不同的地方（一格牌子在字旁邊、一格在字上面）——
            那是「順序／位置沒有人決定過」的一種（第九節第 28 條 ⑤）。 */
         white-space:${wrapn ? "normal" : "nowrap"};
         ${wrapn ? "flex-direction:column;gap:" + Math.round(fs2 * .22) + "px;"
                 : "flex-wrap:nowrap;"}
         display:flex;align-items:center;justify-content:center;gap:${Math.round(fs2 * .3)}px}
/* ⚠⚠⚠ 2026-09-08 使用者：「Ⓒ ×1.30 壹車房 斷行 中華路停車場 斷行 190公尺 分成三行」。
   折行那一種**不可以交給瀏覽器自己折** —— 只有 P1 的名字放不下（10 個字），
   瀏覽器會折在「停車／場」，一個字被丟到下一行。名字裡本來就有一個全形破折號
   （壹車房－中華路停車場），那才是它自己的斷點：拆成兩個 .ln、各自一列。
   ⚠ 破折號留在第一列的行尾，**沒有拿掉任何一個字**（它是門口那張紙上的原文）。
   ⚠ 每一個 .ln 自己 nowrap，而且下面有一道守門在數它有沒有被再折（第 23 節那條）。 */
.lot .nm .ln{white-space:nowrap}
.lot .no{background:#365685;color:${CARD};border-radius:${Math.round(fs2 * .28)}px;
         padding:.28em .62em;font-size:.86em;font-weight:700;
         font-family:Arial,Helvetica,sans-serif;letter-spacing:.02em}
.lot .du{margin-top:${Math.round(fs2 * .22)}px;font-size:${Math.round(fs2 * .74 * lotk)}px;color:${SOFT}}
`;

/* 折行那一種：名字照它自己的全形破折號拆成幾列（破折號留在行尾，一個字都沒少） */
/* ⚠ 一行那一種也包成一個 .ln（畫出來一模一樣：nowrap 的 flex 項目，匿名或具名都同一個盒）
     —— 這樣「名字畫成幾列」才量得到。直接量 .nm 是假的：裡面還有那顆號碼牌，
     字級不同、rect 的 top 就不同，會被數成 2~3 列（第一版就是這樣報 3/3/3）。
   ⚠⚠ 2026-09-08 使用者：「Ⓒ ×1.30 壹車房後破折號拿掉」——折行那一種**斷點就是分行**，
     破折號的工作已經由換行做掉了，留在行尾反而像沒收完。
     ⚠ 只有**畫在圖上**的那一份拿掉；`door-detail.txt`（貼進「詳情」欄的字）與門口那張紙
     **一個字都沒動** —— 那兩份是一行，破折號在那裡仍然是唯一的分隔。 */
const nmHtml = (name, wrapn) => (wrapn ? name.split("\uFF0D") : [name])
  .map((s) => `<span class="ln">${s}</span>`).join("");

const sheet = (fs2, qr, drop = 0, title = "", wrapn = 0) => `<div class="sheet"><div class="band">
  ${title ? `<div class="tt">${title}</div>` : ""}
  <ul class="pts">${dropPts(drop).map(p => `<li>${p}</li>`).join("")}</ul>
  <div class="rule"></div>
  <div class="map"><img src="${MAPURI}" width="${MAPW}" height="${MAPH}" alt=""></div>
  <div class="rule"></div>
  <div class="lots">${D.lots.map((l, i) => `<div class="lot">${
    qr ? `<div class="qr">${l.qr}</div>` : ""
  }<div class="nm"><span class="no">${l.tag}</span>${nmHtml(l.name, wrapn)}</div>
    <div class="du">${l.dist}</div></div>`).join("")}</div>
</div>${WMARK}</div>`;

const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.startsWith("door-") && f.endsWith(".png")))
  fs.rmSync(path.join(OUT, f));

const made = [];
const build = async (tag, { fs2 = 30, qr = true, qrpx = 200, orient = "w", you = "clinic",
                            drop = 0, title = "", lotk = 1, wrapn = 0, ns = "c",
                            margin = MARGIN0, gap = GAP0, wma = WMA0 } = {}) => {
  /* 先量「地圖以外的東西有多高」，再把地圖撐到剩下的空間 */
  MAPW = 400; MAPH = 320; MAPURI = "";
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(fs2, qrpx, lotk, wrapn, gap, wma)}</style>`
    + sheet(fs2, qr, drop, title, wrapn));
  const other = await page.evaluate(() => {
    const b = document.querySelector(".band").getBoundingClientRect();
    const m = document.querySelector(".map").getBoundingClientRect();
    return b.height - m.height;
  });
  const probe = await shotMap(600, { orient, you, ns });
  const ar = probe.meta.vb[2] / probe.meta.vb[3];
  const roomH = Math.floor(H - 2 * margin - other - 2 * gap);
  MAPW = Math.floor(Math.min(roomH * ar, W - 2 * PAD));
  /* ⚠ 收斂會落在 ±1px，取整之後可能比算出來的空間多 1~2px、整塊就頂到留白 ——
     所以目標往下讓 3px（看不出來，但守門過得去）。 */
  const { buf, meta } = await shotMap(MAPW - 3, { orient, you, ns });
  const sz = pngSize(buf);
  MAPW = sz.w; MAPH = sz.h;
  MAPURI = "data:image/png;base64," + buf.toString("base64");
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(fs2, qrpx, lotk, wrapn, gap, wma)}</style>`
    + sheet(fs2, qr, drop, title, wrapn));
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));

  /* ---------- 守門 ---------- */
  const m = await page.evaluate(({ CARD, wrapn }) => {
    const band = document.querySelector(".band").getBoundingClientRect();
    const img = document.querySelector(".map img").getBoundingClientRect();
    /* ⚠ 浮水印是**刻意**切出去的（.sheet 有 overflow:hidden，切掉的部分不會真的
       畫出來），所以它與它的路徑要從這道溢出檢查裡排除，不然每一張都會被擋下來。 */
    const over = [...document.querySelectorAll(".sheet *")]
      .filter(el => !el.closest("svg.wm"))
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.width && (r.right > 1080.5 || r.left < -.5);
      }).length;
    const wmr = (() => { const el = document.querySelector("svg.wm");
      if (!el) return null; const r = el.getBoundingClientRect();
      return { w: +r.width.toFixed(0), h: +r.height.toFixed(0),
               out: +(r.right - 1080).toFixed(0) }; })();
    /* 四點提醒有沒有被折行、以及每一條佔幾行（折行不報錯，只是靜靜地變高） */
    const rng = document.createRange();
    const lines = [...document.querySelectorAll(".pts li")].map(li => {
      rng.selectNodeContents(li);
      const rs = [...rng.getClientRects()];
      const tops = new Set(rs.map(r => Math.round(r.top / 4)));
      return tops.size;
    });
    /* ⚠⚠ 三張卡的名字有沒有被擠出去。
       **不可以用 `nm.scrollWidth > lot.clientWidth`** —— `.nm` 是 flex 容器、
       寬度本來就等於 `.lot`，那個式子永遠是 0，**這道守門從來沒有生效過**
       （溢出真的發生時是外面那道 `over` 抓到的）。要量的是**裡面那幾塊的總寬**。 */
    /* ⚠⚠⚠ 量「這一格的東西本來要多寬」踩過兩種都是假的：
       ① `nm.scrollWidth > lot.clientWidth` —— `.nm` 是 flex 容器、寬度本來就等於
          `.lot`，那個式子**永遠是 0，這道守門從來沒有生效過**；
       ② 把 `.nm` 複製出去量 —— 裡面的字是 flex 的匿名項目，仍然被壓縮，
          量出來非單調（26px 和 28px 回同一個數字）。
       ✅ 唯一準的：**把整條的欄位暫時切成 `max-content` 再量 `.lot` 自己**，量完還原。 */
    const lots = [...document.querySelectorAll(".lot")];
    const grid = document.querySelector(".lots");
    const cell = lots[0].getBoundingClientRect().width;
    const keep = grid.style.gridTemplateColumns;
    grid.style.gridTemplateColumns = "repeat(3, max-content)";
    const nat = lots.map(el => el.getBoundingClientRect().width);
    grid.style.gridTemplateColumns = keep;
    /* ⚠ 判準**不是「有沒有超過自己那一格」** —— 一格 1fr 是 333，而三個名字長短
       不一，短的那一格用不完、長的可以借旁邊那條溝（27px）。真正會壞的是
       **三格的自然寬加兩條溝超過整條** ＝ 名字開始互相碰到、或整條被推出畫布。 */
    const gapx = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const need = nat.reduce((a, b) => a + b, 0) + 2 * gapx;
    const bandW = document.querySelector(".band").clientWidth
      - parseFloat(getComputedStyle(document.querySelector(".band")).paddingLeft) * 2;
    /* ⚠ 名字可以折行的時候這一道不適用（max-content 量出來的是「不折行要多寬」，
       而它本來就會折）—— 那一種靠外面那道 over 就夠了。 */
    const wide = !wrapn && need > bandW + .5 ? 1 : 0;
    /* ⚠ 不是壞掉檢查，是「讀起來對不對」：最長那一張名字離撐破還剩幾 px，
       以及那兩行的字級 —— 使用者說「有點小」，判準是它在小格 410px 上多大。 */
    const room = bandW - need;
    const lotfs = [parseFloat(getComputedStyle(lots[0].querySelector(".nm")).fontSize),
                   parseFloat(getComputedStyle(lots[0].querySelector(".du")).fontSize)];
    /* ⚠⚠ 自己指定的斷行有沒有被「再折」（第 23 節那一條：凡是自己斷行的東西，
       都要有一個有沒有被再折的量測）。折行那一種的每一個 .ln 只准佔一列。 */
    const refold = [...document.querySelectorAll(".lot .nm .ln")].filter(el => {
      rng.selectNodeContents(el);
      return new Set([...rng.getClientRects()].map(r => Math.round(r.top / 4))).size > 1;
    }).length;
    /* ⚠⚠ 畫在圖上的名字 ＝ 資料把破折號拿掉（折行那一種）。
       這一道是為了擋「哪天資料換了名字、拆法卻沒跟上」——症狀會是行尾多一個
       破折號或整個名字擠成一行，兩種都不報錯。 */
    const nmText = [...document.querySelectorAll(".lot .nm")].map(el =>
      [...el.querySelectorAll(".ln")].map(sp => sp.textContent).join(""));
    /* 名字實際畫成幾列（折行那一種：P1 應該是 2、另外兩張 1） */
    const nmLines = [...document.querySelectorAll(".lot .nm")].map(el =>
      [...el.querySelectorAll(".ln")].reduce((n, sp) => {
        rng.selectNodeContents(sp);
        return n + new Set([...rng.getClientRects()].map(r => Math.round(r.top / 4))).size;
      }, 0));
    /* 地圖 PNG 的角落要等於畫布底色 */
    const im = document.querySelector(".map img");
    const cv = document.createElement("canvas");
    cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const cx = cv.getContext("2d"); cx.drawImage(im, 0, 0);
    const px = cx.getImageData(1, 1, 1, 1).data;
    return { band: { y: band.y, h: band.height }, img: { w: img.width, h: img.height },
             over, lines, wide, room, lotfs, refold, nmLines, nmText, wmr,
             lotsH: grid.getBoundingClientRect().height,
             corner: "#" + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, "0")).join("") };
  }, { CARD, wrapn });

  if (m.over) throw new Error(`${tag}：有 ${m.over} 個元素溢出`);
  if (m.refold) throw new Error(`${tag}：自己斷行的名字有 ${m.refold} 段被再折`);
  {
    const want = D.lots.map(l => wrapn ? l.name.split("\uFF0D").join("") : l.name);
    const bad = m.nmText.map((t, i) => t === want[i] ? null : `${t} ≠ ${want[i]}`).filter(Boolean);
    if (bad.length) throw new Error(`${tag}：畫在圖上的名字對不上（${bad.join("／")}）`);
  }
  if (m.wide) throw new Error(`${tag}：那一排的三個名字加起來比整條寬 `
    + `${(-m.room).toFixed(0)}px —— 會互相碰到（要嘛字收小，要嘛讓名字折行 wrapn）`);
  if (m.corner.toLowerCase() !== CARD) throw new Error(
    `${tag}：地圖 PNG 的角落是 ${m.corner}，畫布是 ${CARD}（截圖帶到了別的底色）`);
  if (m.band.y < margin - .5 || m.band.y + m.band.h > H - margin + .5)
    throw new Error(`${tag}：內容 ${m.band.y.toFixed(0)}~${(m.band.y + m.band.h).toFixed(0)}，`
      + `超出留白 ${margin}`);
  /* ⚠⚠ 不是壞掉檢查，是「讀起來對不對」：這張圖是給**小格**的（整張縮到 410px），
     四點提醒是那個尺寸下唯一讀得出來的整段文字，小於 10px 就等於沒寫。 */
  const onSlot = fs2 * SMALL / W;
  if (onSlot < 10) throw new Error(`${tag}：四點提醒在小格上只有 ${onSlot.toFixed(1)}px，讀不出來`);
  /* ⚠⚠ 「讀起來對不對」第二條（2026-09-08 使用者：「下排停車場的名稱和距離
     步行時間字級有點小」）：那兩行在小格 410px 上各有幾 px。**只印不 throw** ——
     現況那一格本來就沒過 10px，把它擋掉等於不能拿現況當對照。 */
  const onLot = m.lotfs.map(v => v * SMALL / W);
  /* ⚠⚠⚠ 「現在位置」那四個字：貼文的人不在那裡。是他指定要門口那一版才放行。 */
  if (meta.you === "現在位置" && tag !== "b")
    throw new Error(`${tag}：綠塊寫著「現在位置」，但看貼文的人不在那裡`);

  await page.screenshot({ path: path.join(OUT, `door-${tag}.png`) });
  m.onLot = onLot;
  if (!m.wmr) throw new Error(`${tag}：浮水印沒有畫出來`);
  made.push({ tag, m, meta, fs2, qr, qrpx, orient, you, ar, drop, title, lotk, wrapn, ns, margin, gap,
              wma, pts: dropPts(drop).length });
  return made[made.length - 1];
};

/* ⚠⚠⚠ 浮水印壓在最上面，所以落在它上面的字，**前景與背景兩邊都會被染一層墨**
   （擺在後面的話只有背景會）。兩邊各自合成之後重算一次對比度：字仍然要 4.5。
   ⚠ 這一道是**壞掉檢查**（會擋），和下面那個「讀起來對不對」的面板不同級。 */
const wmOver = (c, a) => rgb2hex(hex2rgb(c).map((v, i) => v * (1 - a) + hex2rgb(INK)[i] * a));
const wmCheck = (a) => {
  const pairs = [["墨字", INK, CARD], ["柔墨", SOFT, CARD], ["紅字", BRICK, CARD],
                 ["號碼牌", CARD, "#365685"]];
  const bad = pairs.map(([n, fg, bg]) => [n, ratio(wmOver(fg, a), wmOver(bg, a))])
    .filter(([, r]) => r < 4.5);
  if (bad.length) throw new Error(`壓在浮水印（${a}）上過不了：`
    + bad.map(([n, r]) => `${n} ${r.toFixed(2)}`).join("、"));
};

/* ⚠ 2026-09-08 使用者選的是 **Ⓒ ＝ 不放 QR ＋ 前兩句拿掉**（door-c）。
   同日再一句：「**下排停車場的名稱和距離　步行時間字級有點小**」——
   量出來他是對的：那兩行在小格 410px 上只有 **9.9 / 8.4px**，
   而這一線的判準一直是「小格上小於 10px ＝ 等於沒寫」。
   ⚠⚠ 但它有一個代價，所以是一把尺不是一個值（第九節第 28 條 ①）：
   **字一大，那一排就變高，高度是從地圖借的**。
   ⚠⚠ 而且中間有一道硬牆：三個名字是 nowrap，×1.22 就開始互相碰到 ——
   要再大只能讓**名字折行**（`wrapn`），那又會讓那一排再高一截。 */
const DROP = 2;                                       /* 拿掉「紅線」「開單」那兩句 */
const CASES = [
  ["c",     { qr: false, drop: DROP }],               /* Ⓐ 現況（他挑的那一張，字最小） */
  ["c110",  { qr: false, drop: DROP, lotk: 1.10 }],   /* Ⓑ 大一階，仍然一行（×1.15 就碰到了，這是不折行的上限） */
  ["c130",  { qr: false, drop: DROP, lotk: 1.30, wrapn: 1 }],  /* Ⓒ 建議：距離第一次過 10px */
  /* 指北針的大小（第 28 條 ①：他的眼睛才是裁判 → 給一把尺，不要送一個我估的值）。
     ⚠ 上面每一張都已經是 ns=c（小一格），這兩張只是把另外兩格擺出來比。 */
  ["c130-nsb", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, ns: "b" }],  /* 門口那張的大小 */
  ["c130-nsd", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, ns: "d" }],  /* 再小一格 */
  /* 地圖要多大 ＝ 上下留白與段距要收多少（見上面 MARGIN0 那一段：地圖是高度在卡）。
     ⚠ 四格都吃 Ⓒ ×1.30 那一組字級，只有留白不一樣 —— 一次只動一件。 */
  ["c130-m1", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, margin: 44, gap: 18 }],
  ["c130-m2", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, margin: 34, gap: 14 }],
  ["c130-m4", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, margin: 18, gap: 8 }],
  /* 浮水印要多淡（2026-09-08 使用者：「可能要更淡一點」）。
     ⚠ 四格只有濃度不一樣 —— 上面每一張都已經是預設的 .03（Ⓦ3）。 */
  ["c130-w1", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, wma: .05 }],  /* ＝ 門診表那一張 */
  ["c130-w2", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, wma: .04 }],
  ["c130-w4", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, wma: .02 }],
  ["c130-w0", { qr: false, drop: DROP, lotk: 1.30, wrapn: 1, wma: 0 }],    /* 不放（對照） */
  ["c145",  { qr: false, drop: DROP, lotk: 1.45, wrapn: 1 }],  /* Ⓓ */
  ["c160",  { qr: false, drop: DROP, lotk: 1.60, wrapn: 1 }],  /* Ⓔ 最大 */
  ["c-title", { qr: false, drop: DROP, title: "芳仁牙醫　周邊停車" }], /* 標題那一格 */
  ["c-qr",  { drop: DROP }],                          /* 前兩句拿掉、QR 留著（對照） */
  ["a",     {}],                                      /* 全套，綠塊寫「芳仁牙醫」 */
  ["b",     { you: "door" }],                         /* 逐字照門口那張（綠塊寫「現在位置」） */
  ["noqr",  { qr: false }],                           /* 不放 QR，地圖放大 */
  ["qr140", { qrpx: 140 }],                           /* QR 收小，地圖放大 */
  ["north", { orient: "n" }],                         /* 北在上（地圖變回直的，看代價） */
];
for (const a of [...new Set([WMA0, ...CASES.map(([, o]) => o.wma).filter(v => v !== undefined)])])
  wmCheck(a);
for (const [tag, opt] of CASES) await build(tag, opt);

/* ========== 主頁三格 ＋ 410px 實際大小 ========== */
const b64 = (f) => "data:image/png;base64," + fs.readFileSync(path.join(OUT, f)).toString("base64");
if (!fs.existsSync(HOURS)) throw new Error("找不到看診時間那張圖，先跑 node drafts/channels/post-hours.mjs");
const cell = (uri, w, h) => `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">`
  + (uri ? `<img src="${uri}" style="width:100%;height:100%;object-fit:cover;display:block">` : "")
  + `</div>`;
const p2 = await browser.newPage({ viewport: { width: BIG_W, height: BIG_H + 4 + SMALL } });
await p2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
  <div style="width:${BIG_W}px;background:#fff;display:flex;flex-direction:column;gap:4px">
    ${cell("data:image/png;base64," + fs.readFileSync(HOURS).toString("base64"), BIG_W, BIG_H)}
    <div style="display:flex;gap:3px">${cell(b64("door-c130.png"), SMALL, SMALL)}${cell(null, SMALL, SMALL)}</div>
  </div>`);
await p2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p2.screenshot({ path: path.join(OUT, "door-profile-3up.png") });

const p3 = await browser.newPage({ viewport: { width: SMALL * 3 + 24, height: SMALL + 12 } });
await p3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + ["door-c.png", "door-c130.png", "door-c160.png"]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p3.screenshot({ path: path.join(OUT, "door-slot-410.png") });

/* 留白那把尺也要在成品的尺寸上並排看一次（第 28 條 ④） */
const p4 = await browser.newPage({ viewport: { width: SMALL * 4 + 30, height: SMALL + 12 } });
await p4.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + ["door-c130-m1.png", "door-c130-m2.png", "door-c130.png", "door-c130-m4.png"]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p4.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p4.screenshot({ path: path.join(OUT, "door-slot-410-margin.png") });

/* 浮水印那把尺也要在成品的尺寸上並排看一次（第 28 條 ④）——
   ⚠ 濃度這種東西**一定要在會被看到的尺寸上比**，1080 原圖上看起來明顯的，
     縮到 410px 常常就沒了。 */
const p5 = await browser.newPage({ viewport: { width: SMALL * 4 + 30, height: SMALL + 12 } });
await p5.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + ["door-c130-w1.png", "door-c130-w2.png", "door-c130.png", "door-c130-w4.png"]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p5.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p5.screenshot({ path: path.join(OUT, "door-slot-410-wm.png") });
await browser.close();

/* ========== ⚠⚠⚠ QR 不能用眼睛驗收：真的拿解碼器掃一次 ==========
 * 門口那張告示的 README 就寫著這一條（格式資訊反過來的話畫面一模一樣但掃不出來）。
 * 這裡多驗一件那張紙不必驗的事：**縮到主頁那三格的大小之後還掃不掃得動**。
 * ⚠ opencv 不是這個專案的相依套件（這一站零依賴）——裝不到就寫「未驗」並大聲印出來，
 *   **絕對不要靜靜地當成掃得動**。要驗：pip install opencv-python-headless
 */
const scanPy = `
import sys, cv2
f = sys.argv[1]
img = cv2.imread(f)
out = []
for w in [int(x) for x in sys.argv[2:]]:
    im = img if w == img.shape[1] else cv2.resize(img, (w, w), interpolation=cv2.INTER_AREA)
    ok, dec, pts, _ = cv2.QRCodeDetector().detectAndDecodeMulti(im)
    got = sorted(set(s for s in (dec if ok else []) if s))
    out.append({"w": w, "n": len(got), "urls": got})
import json; print(json.dumps(out, ensure_ascii=False))
`;
const scan = (file, widths) => {
  try {
    const r = execFileSync("python3", ["-c", scanPy, path.join(OUT, file), ...widths.map(String)],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return JSON.parse(r);
  } catch (e) { return null; }
};
const QRJSON = { modules: QRN[0] + 8, urls: URLS, cases: [] };
for (const x of made.filter(m => m.qr)) {
  const res = scan(`door-${x.tag}.png`, [W, BIG_W, SMALL]);
  QRJSON.cases.push({ tag: x.tag, qrpx: x.qrpx,
    slots: [W, BIG_W, SMALL].map((w, i) => ({
      w, px: +(x.qrpx * w / W).toFixed(1),
      per: +(x.qrpx * w / W / (QRN[0] + 8)).toFixed(2),
      scan: res ? `${res[i].n}/3` : "未驗" })) });
}
fs.writeFileSync(path.join(OUT, "door-qr.json"), JSON.stringify(QRJSON, null, 2) + "\n");
console.log(`\n── ⚠⚠⚠ 三顆 QR：真的拿解碼器掃過（不是用眼睛看）──`);
console.log(`  每一顆 ${QRJSON.modules}×${QRJSON.modules} 格（含四格靜區）`);
for (const c of QRJSON.cases) {
  console.log(`  door-${c.tag}　QR ${c.qrpx}px：` + c.slots.map(s =>
    `${s.w === W ? "原圖" : s.w === BIG_W ? "大格" : "小格"} ${s.px}px／每格 ${s.per}px → 掃到 ${s.scan}`)
    .join("　"));
}
if (QRJSON.cases.some(c => c.slots.some(s => s.scan === "未驗")))
  console.log(`  ⚠⚠ 有幾格是「未驗」—— 這台機器上沒有 opencv。`
    + `要真的驗：pip install opencv-python-headless 再跑一次。`);
console.log(`  ⚠⚠⚠ 就算掃得動也還有一件：**看貼文的人正拿著那支手機，掃不了自己螢幕上的碼。**`);
console.log(`     LINE 上接得住這件事的是「詳情」欄裡那三條**可以點**的網址（下面那一段已經產好）。`);

/* ========== 「詳情」那一欄 ========== */
/* ⚠⚠⚠ 這一段是 QR 在 LINE 上真正的替代品：**三條可以點的網址**。
   看貼文的人拿著那支手機，掃不了自己螢幕上的碼，但點得下去。 */
/* ⚠⚠ 圖上拿掉的那兩句，這裡也一起拿掉 —— 圖說兩句、詳情說四句，
   就是同一則貼文有兩個版本的事實。**門口那張告示本人一個字都沒有動。** */
const detail = dropPts(DROP).map(strip).join("\n") + "\n"
  + D.lots.map((l, i) => `${l.tag} ${l.name}　${l.dist}\n${URLS[i]}`).join("\n") + "\n"
  + ADDR + `　` + PHONE;
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);
fs.writeFileSync(path.join(OUT, "door-detail.txt"), detail + "\n");

/* ========== 印一張「讀起來對不對」 ========== */
const A = made.find(x => x.tag === "c");
const shrink = SMALL / W, bigShrink = BIG_W / W;
console.log(`\n── 地圖（門口那張告示的算繪，1:1 截下來）──`);
console.log(`  轉 90 度（正對診所）之後 viewBox ${A.meta.vb[2]}×${A.meta.vb[3]}`
  + `　長寬比 ${A.ar.toFixed(3)}（**橫的** —— 站上那張是 0.903 直的）`);
console.log(`  畫在成品上 ${A.m.img.w}×${A.m.img.h}　比例尺 ${A.meta.k.toFixed(3)}`
  + `　左右各留 ${((W - 2 * PAD - A.m.img.w) / 2).toFixed(0)}px`);
console.log(`  綠塊裡那四個字：${A.meta.you}`);
console.log(`\n── 讀起來對不對（定案那一張 door-c：不放 QR、前兩句拿掉）──`);
console.log(`  留白　　整塊 ${A.m.band.h.toFixed(0)}／1080 ＝ 佔 ${(A.m.band.h / H * 100).toFixed(0)}%，`
  + `上下各留 ${A.m.band.y.toFixed(0)}px`);
console.log(`  四點提醒　每一條佔 ${A.m.lines.join("／")} 行　字級 ${A.fs2}px → 小格 `
  + `${(A.fs2 * shrink).toFixed(1)}px　大格 ${(A.fs2 * bigShrink).toFixed(1)}px`);
console.log(`  地圖上的字（畫布 px → 小格 px）：`
  + Object.entries(A.meta.type).map(([k, v]) => `${k} ${v.toFixed(0)}→${(v * shrink).toFixed(1)}`).join("　"));
{
  const cut = (H - BAND) / 2;
  const inBand = A.m.band.y >= cut && A.m.band.y + A.m.band.h <= H - cut;
  console.log(`  大格　　只看得到中間 ${BAND} 列（上下各切 ${cut}px），這一張的內容是 `
    + `${A.m.band.y.toFixed(0)}~${(A.m.band.y + A.m.band.h).toFixed(0)}　`
    + (inBand ? "收得進去" : "⚠ 上下都會被切掉 —— 這一張是給小格的"));
}
console.log(`\n── 下排那兩行的字（畫布 px → 小格 410px）──`);
for (const x of made.filter(x => x.qr === false && x.drop && !x.title))
  console.log(`  door-${x.tag}\t×${x.lotk.toFixed(2)}${x.wrapn ? " 折行" : "　一行"}`
    + `\t名 ${x.m.lotfs[0]}→${x.m.onLot[0].toFixed(1)}${x.m.onLot[0] >= 10 ? " ✓" : " ⚠"}`
    + `\t距 ${x.m.lotfs[1]}→${x.m.onLot[1].toFixed(1)}${x.m.onLot[1] >= 10 ? " ✓" : " ⚠"}`
    + `\t名字 ${x.m.nmLines.join("/")} 列`
    + `\t那一排高 ${x.m.lotsH.toFixed(0)}\t地圖 ${x.m.img.w}×${x.m.img.h}\t三格加溝還餘 ${x.m.room.toFixed(0)}px`);
/* ⚠ 不是壞掉檢查，是「讀起來對不對」：指北針在小格 410px 上多大
   （第 28 條 ④：每加一種版面關係，就把它壞掉時會不對的那個數字印出來）。 */
console.log(`\n── 指北針（畫布 px → 小格 410px）──`);
for (const x of made.filter(x => x.tag === "c130" || x.tag.startsWith("c130-ns")))
  console.log(`  door-${x.tag}\t?ns=${x.ns}\t整組高 ${x.meta.nsw.h}→${(x.meta.nsw.h * shrink).toFixed(1)}`
    + `\t「北」${x.meta.nsw.fs}→${(x.meta.nsw.fs * shrink).toFixed(1)}`
    + `\t地圖 ${x.m.img.w}×${x.m.img.h}`);

/* ⚠ 不是壞掉檢查，是「讀起來對不對」：留白收多少換到多大的地圖 */
console.log(`\n── 地圖要多大（上下留白／段距 → 地圖）──`);
{
  const base = made.find(x => x.tag === "c130-m1").m.img.w;
  for (const x of made.filter(x => x.tag === "c130" || x.tag.startsWith("c130-m")))
    console.log(`  door-${x.tag}\t留白 ${x.margin}　段距 ${x.gap}`
      + `\t地圖 ${x.m.img.w}×${x.m.img.h}（比 Ⓜ1 ${(x.m.img.w / base * 100 - 100).toFixed(1)}%）`
      + `\t整塊 ${x.m.band.h.toFixed(0)}／1080　上下各留 ${x.m.band.y.toFixed(0)}px`
      + `\t小格留白 ${(x.m.band.y * SMALL / W).toFixed(1)}px`
      + `${x.tag === "c130" ? "\t← 定案（Ⓜ3，已寫回預設）" : ""}`);
}

/* ⚠ 不是壞掉檢查，是「讀起來對不對」：浮水印多濃、壓在它上面的字還剩多少對比 */
console.log(`\n── 浮水印（${WMSH}・${WMW}px・從右下角切出去）──`);
{
  const A0 = made.find(x => x.tag === "c130");
  console.log(`  畫出來 ${A0.m.wmr.w}×${A0.m.wmr.h}　右邊切掉 ${A0.m.wmr.out}px`
    + `　→ 小格 410px 上 ${(A0.m.wmr.w * SMALL / W).toFixed(0)}px`);
  for (const x of made.filter(x => x.tag === "c130" || x.tag.startsWith("c130-w")))
    console.log(`  door-${x.tag}\t墨 ${(x.wma * 100).toFixed(1)}%`
      + `\t底色 ${CARD} → ${wmOver(CARD, x.wma)}`
      + `\t壓在上面：墨字 ${ratio(wmOver(INK, x.wma), wmOver(CARD, x.wma)).toFixed(2)}`
      + `／柔墨 ${ratio(wmOver(SOFT, x.wma), wmOver(CARD, x.wma)).toFixed(2)}（門檻 4.5）`
      + `${x.tag === "c130" ? "\t← 現在的預設（建議）" : ""}`);
}

console.log(`\n── 出圖 ──`);
for (const x of made)
  console.log(`  door-${x.tag}.png　地圖 ${x.m.img.w}×${x.m.img.h}（長寬比 ${x.ar.toFixed(3)}）`
    + `　提醒 ${x.pts} 條${x.title ? "＋標題" : ""}`
    + `　內容高 ${x.m.band.h.toFixed(0)}${x.qr ? `　QR ${x.qrpx}px` : "　沒有 QR"}`
    + `${x.you === "door" ? "　綠塊寫「現在位置」" : ""}${x.orient !== "w" ? `　${x.orient} 在上` : ""}`);
console.log(`  door-profile-3up.png　door-slot-410.png　door-slot-410-margin.png　door-slot-410-wm.png`);
console.log(`\n── 「詳情」欄要貼的字 ──\n` + detail.split("\n").map(l => "  " + l).join("\n"));
