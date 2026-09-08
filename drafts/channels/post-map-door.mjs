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

/* ---------- 畫布 ---------- */
const W = 1080, H = 1080;
const BIG_W = 823, BIG_H = 409, SMALL = 410;
const BAND = Math.round(W * (BIG_H / BIG_W));
const PAD = 40, GAP = 18, MARGIN = 44;

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

const shotMap = async (targetW, { orient = "w", you = "clinic" } = {}) => {
  await doorPage.goto("file://" + DOOR + `?size=p&orient=${orient}&qr=on`);
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
    return { w: r.width, h: r.height, vb, k: r.width / vb[2], labs,
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
const css = (fs2, qrpx) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       position:relative;overflow:hidden}
.band{padding:0 ${PAD}px}
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
.lots{display:grid;grid-template-columns:repeat(3,1fr);gap:${Math.round(fs2 * .9)}px;
      padding-top:${GAP}px}
.lot{text-align:center}
.lot .qr{display:flex;justify-content:center}
.lot .qr svg{width:${qrpx}px;height:${qrpx}px;display:block}
.lot .nm{margin-top:${Math.round(fs2 * .38)}px;font-size:${Math.round(fs2 * .86)}px;
         font-weight:700;letter-spacing:.02em;white-space:nowrap;
         display:flex;align-items:center;justify-content:center;gap:${Math.round(fs2 * .3)}px}
.lot .no{background:#365685;color:${CARD};border-radius:${Math.round(fs2 * .28)}px;
         padding:.28em .62em;font-size:.86em;font-weight:700;
         font-family:Arial,Helvetica,sans-serif;letter-spacing:.02em}
.lot .du{margin-top:${Math.round(fs2 * .22)}px;font-size:${Math.round(fs2 * .74)}px;color:${SOFT}}
`;

const sheet = (fs2, qr) => `<div class="sheet"><div class="band">
  <ul class="pts">${D.points.map(p => `<li>${p}</li>`).join("")}</ul>
  <div class="rule"></div>
  <div class="map"><img src="${MAPURI}" width="${MAPW}" height="${MAPH}" alt=""></div>
  <div class="rule"></div>
  <div class="lots">${D.lots.map((l, i) => `<div class="lot">${
    qr ? `<div class="qr">${l.qr}</div>` : ""
  }<div class="nm"><span class="no">${l.tag}</span>${l.name}</div>
    <div class="du">${l.dist}</div></div>`).join("")}</div>
</div></div>`;

const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.startsWith("door-") && f.endsWith(".png")))
  fs.rmSync(path.join(OUT, f));

const made = [];
const build = async (tag, { fs2 = 30, qr = true, qrpx = 200, orient = "w", you = "clinic" } = {}) => {
  /* 先量「地圖以外的東西有多高」，再把地圖撐到剩下的空間 */
  MAPW = 400; MAPH = 320; MAPURI = "";
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(fs2, qrpx)}</style>`
    + sheet(fs2, qr));
  const other = await page.evaluate(() => {
    const b = document.querySelector(".band").getBoundingClientRect();
    const m = document.querySelector(".map").getBoundingClientRect();
    return b.height - m.height;
  });
  const probe = await shotMap(600, { orient, you });
  const ar = probe.meta.vb[2] / probe.meta.vb[3];
  const roomH = Math.floor(H - 2 * MARGIN - other - 2 * GAP);
  MAPW = Math.floor(Math.min(roomH * ar, W - 2 * PAD));
  /* ⚠ 收斂會落在 ±1px，取整之後可能比算出來的空間多 1~2px、整塊就頂到留白 ——
     所以目標往下讓 3px（看不出來，但守門過得去）。 */
  const { buf, meta } = await shotMap(MAPW - 3, { orient, you });
  const sz = pngSize(buf);
  MAPW = sz.w; MAPH = sz.h;
  MAPURI = "data:image/png;base64," + buf.toString("base64");
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(fs2, qrpx)}</style>`
    + sheet(fs2, qr));
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));

  /* ---------- 守門 ---------- */
  const m = await page.evaluate(({ CARD }) => {
    const band = document.querySelector(".band").getBoundingClientRect();
    const img = document.querySelector(".map img").getBoundingClientRect();
    const over = [...document.querySelectorAll(".sheet *")].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5);
    }).length;
    /* 四點提醒有沒有被折行、以及每一條佔幾行（折行不報錯，只是靜靜地變高） */
    const rng = document.createRange();
    const lines = [...document.querySelectorAll(".pts li")].map(li => {
      rng.selectNodeContents(li);
      const rs = [...rng.getClientRects()];
      const tops = new Set(rs.map(r => Math.round(r.top / 4)));
      return tops.size;
    });
    /* 三張卡的名字有沒有被擠出去（nowrap，撐破就會溢出自己的格） */
    const wide = [...document.querySelectorAll(".lot")].filter(el =>
      el.querySelector(".nm").scrollWidth > el.clientWidth + .5).length;
    /* 地圖 PNG 的角落要等於畫布底色 */
    const im = document.querySelector(".map img");
    const cv = document.createElement("canvas");
    cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const cx = cv.getContext("2d"); cx.drawImage(im, 0, 0);
    const px = cx.getImageData(1, 1, 1, 1).data;
    return { band: { y: band.y, h: band.height }, img: { w: img.width, h: img.height },
             over, lines, wide,
             corner: "#" + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, "0")).join("") };
  }, { CARD });

  if (m.over) throw new Error(`${tag}：有 ${m.over} 個元素溢出`);
  if (m.wide) throw new Error(`${tag}：有 ${m.wide} 張停車場卡的名字撐破格子`);
  if (m.corner.toLowerCase() !== CARD) throw new Error(
    `${tag}：地圖 PNG 的角落是 ${m.corner}，畫布是 ${CARD}（截圖帶到了別的底色）`);
  if (m.band.y < MARGIN - .5 || m.band.y + m.band.h > H - MARGIN + .5)
    throw new Error(`${tag}：內容 ${m.band.y.toFixed(0)}~${(m.band.y + m.band.h).toFixed(0)}，`
      + `超出留白 ${MARGIN}`);
  /* ⚠⚠ 不是壞掉檢查，是「讀起來對不對」：這張圖是給**小格**的（整張縮到 410px），
     四點提醒是那個尺寸下唯一讀得出來的整段文字，小於 10px 就等於沒寫。 */
  const onSlot = fs2 * SMALL / W;
  if (onSlot < 10) throw new Error(`${tag}：四點提醒在小格上只有 ${onSlot.toFixed(1)}px，讀不出來`);
  /* ⚠⚠⚠ 「現在位置」那四個字：貼文的人不在那裡。是他指定要門口那一版才放行。 */
  if (meta.you === "現在位置" && tag !== "b")
    throw new Error(`${tag}：綠塊寫著「現在位置」，但看貼文的人不在那裡`);

  await page.screenshot({ path: path.join(OUT, `door-${tag}.png`) });
  made.push({ tag, m, meta, fs2, qr, qrpx, orient, you, ar });
  return made[made.length - 1];
};

const CASES = [
  ["a",   {}],                                        /* 建議：全套，綠塊寫「芳仁牙醫」 */
  ["b",   { you: "door" }],                           /* 逐字照門口那張（綠塊寫「現在位置」） */
  ["noqr", { qr: false }],                            /* 不放 QR，地圖放大 */
  ["qr140", { qrpx: 140 }],                           /* QR 收小，地圖放大 */
  ["north", { orient: "n" }],                         /* 北在上（地圖變回直的，看代價） */
];
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
    <div style="display:flex;gap:3px">${cell(b64("door-a.png"), SMALL, SMALL)}${cell(null, SMALL, SMALL)}</div>
  </div>`);
await p2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p2.screenshot({ path: path.join(OUT, "door-profile-3up.png") });

const p3 = await browser.newPage({ viewport: { width: SMALL * 3 + 24, height: SMALL + 12 } });
await p3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + ["door-a.png", "door-noqr.png", "door-qr140.png"]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p3.screenshot({ path: path.join(OUT, "door-slot-410.png") });
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
const strip = (s) => s.replace(/<[^>]+>/g, "");
const detail = D.points.map(strip).join("\n") + "\n"
  + D.lots.map((l, i) => `${l.tag} ${l.name}　${l.dist}\n${URLS[i]}`).join("\n") + "\n"
  + ADDR + `　` + PHONE;
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);
fs.writeFileSync(path.join(OUT, "door-detail.txt"), detail + "\n");

/* ========== 印一張「讀起來對不對」 ========== */
const A = made.find(x => x.tag === "a");
const shrink = SMALL / W, bigShrink = BIG_W / W;
console.log(`\n── 地圖（門口那張告示的算繪，1:1 截下來）──`);
console.log(`  轉 90 度（正對診所）之後 viewBox ${A.meta.vb[2]}×${A.meta.vb[3]}`
  + `　長寬比 ${A.ar.toFixed(3)}（**橫的** —— 站上那張是 0.903 直的）`);
console.log(`  畫在成品上 ${A.m.img.w}×${A.m.img.h}　比例尺 ${A.meta.k.toFixed(3)}`
  + `　左右各留 ${((W - 2 * PAD - A.m.img.w) / 2).toFixed(0)}px`);
console.log(`  綠塊裡那四個字：${A.meta.you}`);
console.log(`\n── 讀起來對不對（建議那一張 Ⓐ）──`);
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
console.log(`\n── 出圖 ──`);
for (const x of made)
  console.log(`  door-${x.tag}.png　地圖 ${x.m.img.w}×${x.m.img.h}（長寬比 ${x.ar.toFixed(3)}）`
    + `　內容高 ${x.m.band.h.toFixed(0)}${x.qr ? `　QR ${x.qrpx}px` : "　沒有 QR"}`
    + `${x.you === "door" ? "　綠塊寫「現在位置」" : ""}${x.orient !== "w" ? `　${x.orient} 在上` : ""}`);
console.log(`  door-profile-3up.png　door-slot-410.png`);
console.log(`\n── 「詳情」欄要貼的字 ──\n` + detail.split("\n").map(l => "  " + l).join("\n"));
