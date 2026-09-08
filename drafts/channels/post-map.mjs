/* LINE 商家貼文用的「位置與周邊停車」圖 → preview/line-post-map/*.png
 *   node drafts/channels/post-map.mjs
 *
 * ＝ README 第 34-3 節那張評分表的 ③（69 分），34-4 建議擺在**主頁三格的小格左**。
 *
 * ⚠⚠⚠ 這一張和看診時間那一張最大的差別是**它要在哪裡被看到**：
 *   看診時間那張是給**大格**（823×409，1080 見方 cover 之後只看得到中間 537 列）；
 *   這一張是給**小格**（410×410，方的 → 整張都看得到，但**整張縮到 410px**）。
 *   所以那張圖的難題是「安全帶」，這一張的難題是「410px 上還讀得出什麼」——
 *   同 og-topic-card 那一輪：**在成品的尺寸上量，不要在素材的尺寸上量。**
 *
 * ⚠⚠⚠ 地圖不重畫、不重抄：**直接開 index.html，用站上那張 SVG 自己的算繪**
 *   （它的牌子、點狀路線、被壓到的街名全部是站上那支 JS 現算的），
 *   再把那個元素截下來 1:1 貼進 1080 的畫布。座標、顏色、字級、圖釘的影子
 *   一個字都不在這支腳本裡 —— 站上改地圖，這張圖就跟著改。
 *   ⚠ 截圖是**在最終尺寸上** 1:1 截的（把 SVG 的 width 設成成品上的寬度、
 *     deviceScaleFactor 1），所以沒有重新取樣、字是實際畫上去的那一份。
 *
 * ⚠⚠ 站上一次只亮一塊停車場（那是**手機一格放不下三塊牌子**的解），
 *   貼文的畫布放得下 —— 所以三塊全亮，同看診時間那張「把切換要藏的東西攤開」。
 *   唯一的代價：那三塊牌子從來沒有同時出現過，永樂站與合廷會疊到 24 個單位。
 *   治法見下面 SHIFT_A。
 *
 * ⚠ 顏色一個都沒有新增：地圖自己帶著站上的每一顆色，畫布只用
 *   --card／--rule／--ink／--ink-soft。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文落到 WenQuanYi Zen Hei —— 這條線每一張圖都是這樣。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-map");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const HOURS = path.join(ROOT, "preview", "line-post-hours", "fangren-hours-1080.png");
/* PNG 的真實尺寸（IHDR）—— img 的 width/height 一定要寫真值，
   寫成「我打算給它多大」的話，哪天截圖的尺寸差一格就會靜靜地縮放。 */
const pngSize = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";

/* ---------- 從 index.html 讀回來（唯一的出處） ---------- */
/* 地址：頁尾那一行（畫面上的寫法，含兩個 nbsp） */
const ADDR = (() => {
  const m = SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/);
  if (!m) throw new Error("index.html 裡找不到頁尾那一行地址");
  return m[1].replace(/&nbsp;/g, " ");
})();
/* 電話：畫面上的寫法（2026-08-27 全站統一成 05-5339369） */
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!PHONE) throw new Error("index.html 裡找不到電話");
/* 兩顆圖示：**站上頁尾那一對**（實心的釘子與話筒，Font Awesome Free 6，
   圖示部分授權 CC BY 4.0，https://fontawesome.com/license/free ——
   這一行註解就是署名，改圖或搬檔的時候不要刪）。
   ⚠ 幾何與比例都從 index.html 讀回來，不抄第二份：
     釘子 384×512（寬 ＝ 高 × .75）、話筒 512×512（方的）。 */
const ico = (cls, vb) => {
  const re = new RegExp(`<p class="${cls}"[\\s\\S]*?<svg viewBox="0 0 ${vb}"[^>]*>(<path[^>]*\\/>)<\\/svg>`);
  const m = SRC.match(re);
  if (!m) throw new Error(`index.html 裡找不到 .${cls} 那顆圖示`);
  return m[1];
};
const PIN = ico("foot-addr", "384 512"), TEL = ico("foot-tel", "512 512");
/* 圖示對文字的比例也從站上讀（.foot-addr 那三行的 rem 值），不要自己挑：
     文字 .95rem　釘子 .73×.97rem　話筒 .78×.78rem */
const remOf = (sel, prop) => {
  const m = SRC.match(new RegExp(`${sel}\\s*\\{[^}]*${prop}:\\s*([\\d.]+)rem`));
  if (!m) throw new Error(`index.html 裡讀不到 ${sel} 的 ${prop}`);
  return +m[1];
};
const FOOT_FS = remOf("\\.foot-addr", "font-size");
const PIN_H = remOf("\\.foot-addr \\.ico svg", "height") / FOOT_FS;
const TEL_H = remOf("\\.foot-tel  \\.ico svg", "height") / FOOT_FS;

/* ---------- 畫布 ---------- */
const W = 1080, H = 1080;
/* 主頁三格：大格 823×409、小格 410×410（README 33-2 量的那一組） */
const BIG_W = 823, BIG_H = 409, SMALL = 410;
const BAND = Math.round(W * (BIG_H / BIG_W));   /* 大格看得到的列數 ＝ 537 */
const PAD = 40;                                  /* 版心左右內距 */
const GAP = 20;                                  /* 分隔線到地圖 */
const MARGIN = 44;                               /* 整塊內容離上下緣至少多少 */

const TITLES = {
  t1: "芳仁牙醫在這裡",
  t2: "芳仁牙醫位置與停車",
  t3: "怎麼走・哪裡停車",
};

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

/* ================= 第一步：把站上那張地圖截下來 ================= */
/* ⚠⚠ 開的是 index.html 本人，不是複本 —— 牌子的盒、尾巴、點狀路線、
   被壓到的街名全部由站上那支 JS 現算。我們只做三件事：
   ① 把 SVG 的寬度設成成品上的寬度（1:1，不重新取樣）
   ② 三塊停車場全部亮起來（站上一次只亮一塊）
   ③ 永樂站那塊牌子往左挪，不要疊到合廷 */
const mapPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await mapPage.goto("file://" + path.join(ROOT, "index.html"));
await mapPage.waitForTimeout(1200);

/* 停車場的名字與距離、以及地圖的長寬比，都從那張圖上讀回來 */
const MAPD = await mapPage.evaluate(() => {
  const svg = document.querySelector(".map-svg");
  const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  return {
    vw: vb[2], vh: vb[3],
    lots: [...document.querySelectorAll(".rlab")].map(g => ({
      lot: g.dataset.lot,
      name: g.querySelector(".rl-nm").textContent.trim(),
      dist: g.querySelector(".rl-d").textContent.trim(),
    })),
  };
});
if (MAPD.lots.length !== 3) throw new Error(`停車場讀到 ${MAPD.lots.length} 處，應該是 3`);
const AR = MAPD.vw / MAPD.vh;

/* 「周邊三處停車場・步行 1~3 分鐘」那一句：從距離字串現算，不重打 */
const MINS = MAPD.lots.map(l => {
  const m = l.dist.match(/(\d+)\s*分鐘/);
  if (!m) throw new Error(`讀不出步行時間：${l.dist}`);
  return +m[1];
});
const CN = ["零", "一", "兩", "三", "四", "五", "六", "七", "八", "九"];
const PARK_LINE = `周邊${CN[MAPD.lots.length]}處停車場・走路 ${Math.min(...MINS)}~${Math.max(...MINS)} 分鐘`;

/* 三塊全亮之後量一次：兩兩有沒有疊到、要往左挪多少 */
const shotMap = async (mapw, all, shiftA) => {
  const meta = await mapPage.evaluate(({ mapw, all, shiftA, CARD }) => {
    const fig = document.querySelector(".map-fig");
    const svg = fig.querySelector(".map-svg");
    /* 地圖四角是圓的（clip-path rx=18），截圖會連元素框後面那一塊底色一起帶走 ——
       所以先把卡片底色設成畫布的底色，接縫才不會有一圈。 */
    fig.closest(".info-card").style.background = CARD;
    svg.style.width = mapw + "px";
    svg.style.maxWidth = "none";
    svg.style.aspectRatio = "auto";
    const lots = ["a", "b", "c"];
    const on = all ? lots : ["c"];       /* 站上開頁只亮壹車房（DEFAULT_LOT = c） */
    svg.classList.toggle("dim", true);
    fig.querySelectorAll(".lot").forEach(g => g.classList.toggle("on", on.includes(g.dataset.lot)));
    fig.querySelectorAll(".dots,.rlab").forEach(el => el.classList.toggle("on", on.includes(el.dataset.lot)));
    /* ⚠ 永樂站那塊往左挪：整個 g 一起 translate，牌子與尾巴一起走，
       所以尾巴仍然指在它自己那條路線的起點上（那條路線就是從 235 出發的）。 */
    const A = fig.querySelector('.rlab[data-lot="a"]');
    if (shiftA) A.setAttribute("transform", `translate(${shiftA} 0)`);
    else A.removeAttribute("transform");
    /* 被亮起來的路線或牌子壓到的街名整個藏起來 —— 這是站上 hideCovered() 的規則，
       只是站上一次只算一塊，這裡三塊一起算。 */
    const boxes = [];
    fig.querySelectorAll(".dots,.rlab").forEach(el => {
      if (el.classList.contains("on")) boxes.push(el.getBoundingClientRect());
    });
    fig.querySelectorAll(".lbl,.lbl-s,.lbl-xs,.ent").forEach(l => {
      const b = l.getBoundingClientRect();
      l.classList.toggle("hide", boxes.some(o =>
        !(b.right < o.left - 2 || b.left > o.right + 2 || b.bottom < o.top - 2 || b.top > o.bottom + 2)));
    });
    /* 量：牌子兩兩的間隙（負的就是疊到了）、每一塊有沒有被地圖的框切到 */
    const R = svg.getBoundingClientRect();
    const labs = [...fig.querySelectorAll(".rlab")].filter(g => g.classList.contains("on"))
      .map(g => ({ lot: g.dataset.lot, r: g.getBoundingClientRect() }));
    const cm = fig.querySelector(".cmark").getBoundingClientRect();
    const pairs = [];
    for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) {
      const a = labs[i].r, b = labs[j].r;
      const dx = Math.max(b.left - a.right, a.left - b.right);
      const dy = Math.max(b.top - a.bottom, a.top - b.bottom);
      pairs.push([labs[i].lot + "×" + labs[j].lot, +Math.max(dx, dy).toFixed(1)]);
    }
    for (const l of labs) {
      const dx = Math.max(cm.left - l.r.right, l.r.left - cm.right);
      const dy = Math.max(cm.top - l.r.bottom, l.r.top - cm.bottom);
      pairs.push(["診所×" + l.lot, +Math.max(dx, dy).toFixed(1)]);
    }
    const outside = labs.filter(l =>
      l.r.left < R.left - .5 || l.r.right > R.right + .5 ||
      l.r.top < R.top - .5 || l.r.bottom > R.bottom + .5).map(l => l.lot);
    /* 「多大的字畫在圖上」—— 410px 的可讀性表要用 */
    const fs = (sel) => +getComputedStyle(fig.querySelector(sel)).fontSize.replace("px", "");
    return {
      w: R.width, h: R.height, pairs, outside,
      type: { 路名: fs(".map-svg .lbl"), 巷名: fs(".map-svg .lbl-xs"),
              診所: fs(".map-svg .cm-nm"), 停車場: fs(".map-svg .rlab .rl-nm"),
              距離: fs(".map-svg .rlab .rl-d") },
    };
  }, { mapw, all, shiftA, CARD });
  const buf = await mapPage.locator(".map-svg").screenshot();
  return { meta, buf };
};

/* ⚠⚠⚠ 挪多少不是挑的，是解出來的 —— 兩個條件同時要滿足：
   ① **兩塊牌子之間至少空出 2 × padX**（padX ＝ 牌子自己的左右內距，
      從 index.html 那支 sizeLabels 讀回來）。少於這個數，兩塊會被讀成一塊。
   ② **尾巴要留在它自己那塊 P 上** —— 站上尾巴指的是路線中段（一次只亮一塊，
      不會撞到別人）；三塊全亮之後，尾巴指在自己那塊停車場上才分得出誰是誰。
   兩個都算得出來，算完再驗一次。 */
const PADX = (() => {
  const m = SRC.match(/padX = (\d+), padY = \d+/);
  if (!m) throw new Error("index.html 的 sizeLabels 裡讀不到牌子的內距 padX");
  return +m[1];
})();
const SHIFT_A = await mapPage.evaluate(({ padX }) => {
  const fig = document.querySelector(".map-fig");
  const bb = (s2) => fig.querySelector(s2).getBBox();
  const A = bb('.rlab[data-lot="a"]'), B = bb('.rlab[data-lot="b"]');
  const P = bb('.lot[data-lot="a"] rect');
  const tx = +fig.querySelector('.rlab[data-lot="a"]').dataset.tx;
  const dx0 = B.x - (A.x + A.width);              /* 現在的水平間隙（負的＝疊到） */
  const shift = Math.min(0, Math.round(dx0 - 2 * padX));
  return { shift, gap: +(dx0 - shift).toFixed(1), dx0: +dx0.toFixed(1),
           tail: tx + shift, pin: [P.x, P.x + P.width] };
}, { padX: PADX });
if (SHIFT_A.tail < SHIFT_A.pin[0] || SHIFT_A.tail > SHIFT_A.pin[1])
  throw new Error(`永樂站那塊牌子要往左挪 ${SHIFT_A.shift}，尾巴會落到 ${SHIFT_A.tail}，`
    + `已經不在它自己那塊 P（${SHIFT_A.pin[0]}~${SHIFT_A.pin[1]}）上了`);

/* ================= 第二步：1080 的畫布 ================= */
let MAPW = 0, MAPH = 0, MAPURI = "";
const css = (ts, fs) => `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center;
       position:relative;overflow:hidden}
.band{padding:0 ${PAD}px}
.id{padding-bottom:14px}
.id b{font-size:${ts}px;font-weight:700;letter-spacing:.05em}
.rule{height:1px;background:${RULE}}
.map{padding:${GAP}px 0;display:flex;justify-content:center}
.map img{display:block}
.tel{padding-top:14px;font-size:${fs}px;color:${INK};letter-spacing:.02em;line-height:1.55}
.tel .ln{white-space:nowrap}
.tel .park{color:${SOFT}}
/* 圖示：實心、吃 currentColor，和號碼完全同色（同看診時間那張的頁尾）。
   overflow:visible 是站上就有的一條 —— Font Awesome 這兩顆的輪廓剛好和自己的
   viewBox 四邊相切，不寫的話最外緣那一列會被削平（index.html 那段長註解）。 */
.tel .ic{display:inline-block;width:${(fs * 1.02).toFixed(1)}px;text-align:center}
.tel .ic svg{display:inline-block;overflow:visible;fill:currentColor;stroke:none}
`;

const sheet = (title, fs, park) => `<div class="sheet"><div class="band">
  ${title ? `<div class="id"><b>${title}</b></div>\n  <div class="rule"></div>` : ""}
  <div class="map"><img src="${MAPURI}" width="${MAPW}" height="${MAPH}" alt=""></div>
  <div class="rule"></div>
  <div class="tel">
    <div class="ln"><span class="ic"><svg viewBox="0 0 384 512" style="width:${
      (fs * PIN_H * .75).toFixed(1)}px;height:${(fs * PIN_H).toFixed(1)}px;transform:translateY(var(--dy-pin))">${
      PIN}</svg></span>${ADDR}</div>
    ${park ? `<div class="ln park"><span class="ic"></span>${PARK_LINE}</div>` : ""}
    <div class="ln"><span class="ic"><svg viewBox="0 0 512 512" style="width:${
      (fs * TEL_H).toFixed(1)}px;height:${(fs * TEL_H).toFixed(1)}px;transform:translateY(var(--dy-tel))">${
      TEL}</svg></span>${PHONE}</div>
  </div>
</div></div>`;

const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith(".png"))) fs.rmSync(path.join(OUT, f));

/* 圖示對號碼的字面中線要往下推多少 —— 現量，不寫死（第九節第 9 條）。
   ⚠ 要在 400px 上量再等比例縮：Blink 回來的 actualBoundingBox 以 1/64 em 為階。 */
const midOf = async (txt, fsz) => page.evaluate(({ txt, fsz }) => {
  const cx = document.createElement("canvas").getContext("2d");
  const S = 400;
  cx.font = `${S}px "Noto Sans TC","WenQuanYi Zen Hei",sans-serif`;
  const m = cx.measureText(txt);
  return (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 / S * fsz;
}, { txt, fsz });

/* 一次出一張：先量出「地圖以外的東西有多高」，再把地圖撐到剩下的空間 */
const build = async (tag, { title = TITLES.t1, ts = 46, fs2 = 32, all = true, park = true } = {}) => {
  /* 第一輪：地圖先給一個高度，量出其餘每一塊 */
  const dyPin = await midOf(PHONE, fs2), dyTel = dyPin;
  const setVars = (h) => `<style>:root{--dy-pin:${(fs2 * PIN_H / 2 - h).toFixed(2)}px;`
    + `--dy-tel:${(fs2 * TEL_H / 2 - h).toFixed(2)}px}</style>`;
  MAPW = 400; MAPH = Math.round(400 / AR); MAPURI = "";
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(ts, fs2)}</style>`
    + setVars(dyPin) + sheet(title, fs2, park));
  const other = await page.evaluate(() => {
    const b = document.querySelector(".band").getBoundingClientRect();
    const m = document.querySelector(".map").getBoundingClientRect();
    return b.height - m.height;
  });
  /* 地圖能有多高 ＝ 畫布 − 上下留白 − 其餘每一塊；寬度跟著長寬比走，
     若寬度撞到版心就改由寬度決定（這張圖是**高度**在卡，見規格頁那張表） */
  const roomH = Math.floor(H - 2 * MARGIN - other - 2 * GAP);
  const roomW = W - 2 * PAD;
  /* ⚠ 先取整再乘，不然算回來的高度會多那 1px、整塊就頂到留白 */
  MAPW = Math.floor(Math.min(roomH * AR, roomW));
  const { meta, buf } = await shotMap(MAPW, all, all ? SHIFT_A.shift : 0);
  const sz = pngSize(buf);
  MAPW = sz.w; MAPH = sz.h;          /* ⚠ 寫真值，不寫「我打算給它多大」 */
  MAPURI = "data:image/png;base64," + buf.toString("base64");
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css(ts, fs2)}</style>`
    + setVars(dyPin) + sheet(title, fs2, park));
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));

  /* ---------- 守門 ---------- */
  const m = await page.evaluate(({ CARD }) => {
    const q = (s) => document.querySelector(s);
    const band = q(".band").getBoundingClientRect();
    const img = q(".map img").getBoundingClientRect();
    const lns = [...document.querySelectorAll(".tel .ln")];
    const rng = document.createRange();
    const inkMid = (el) => { rng.selectNodeContents(el); const r = rng.getBoundingClientRect();
      return r.top + r.height / 2; };
    /* 兩顆圖示各自對它那一行的字面中線 */
    const dy = lns.filter(l => l.querySelector("svg")).map(l => {
      const s = l.querySelector("svg").getBoundingClientRect();
      const t = document.createRange();
      t.setStart(l, l.childNodes.length - 1); t.setEnd(l, l.childNodes.length);
      const r = t.getBoundingClientRect();
      return +Math.abs((s.top + s.height / 2) - (r.top + r.height / 2)).toFixed(2);
    });
    /* 三行的左緣要齊 */
    const left = lns.map(l => +l.getBoundingClientRect().left.toFixed(1));
    /* 溢出 */
    const over = [...document.querySelectorAll(".sheet *")].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5);
    }).length;
    /* 地圖四角接縫：那張 PNG 的角落像素要等於畫布底色 */
    const cv = document.createElement("canvas");
    const im = q(".map img");
    cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const cx = cv.getContext("2d");
    cx.drawImage(im, 0, 0);
    const px = cx.getImageData(1, 1, 1, 1).data;
    const hex = "#" + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, "0")).join("");
    return { band: { y: band.y, h: band.height }, img: { w: img.width, h: img.height },
             dy, left, over, corner: hex, lineH: lns.map(l => +l.getBoundingClientRect().height.toFixed(1)) };
  }, { CARD });

  if (meta.outside.length) throw new Error(`${tag}：牌子被地圖的框切到（${meta.outside}）`);
  const hit = meta.pairs.filter(([, d]) => d < 4);
  if (hit.length) throw new Error(`${tag}：牌子疊在一起了 —— `
    + hit.map(([n, d]) => `${n} ${d}px`).join("、"));
  if (m.over) throw new Error(`${tag}：有 ${m.over} 個元素溢出`);
  if (m.corner.toLowerCase() !== CARD) throw new Error(
    `${tag}：地圖 PNG 的角落是 ${m.corner}，畫布是 ${CARD}（截圖帶到了別的底色）`);
  if (Math.max(...m.dy) > 1) throw new Error(`${tag}：圖示沒對上字面中線，偏 ${Math.max(...m.dy)}px`);
  if (new Set(m.left).size !== 1) throw new Error(`${tag}：頁尾幾行的左緣不齊 ${m.left}`);
  if (new Set(m.lineH).size !== 1) throw new Error(`${tag}：頁尾幾行的行高不一樣 ${m.lineH}`);
  if (m.band.y < MARGIN - .5 || m.band.y + m.band.h > H - MARGIN + .5)
    throw new Error(`${tag}：內容 ${m.band.y.toFixed(0)}~${(m.band.y + m.band.h).toFixed(0)}，`
      + `超出留白 ${MARGIN}`);
  /* ⚠⚠⚠ 這一條不是壞掉檢查，是「讀起來對不對」（CLAUDE.md 第九節第 28 條 ④）：
     這張圖是給**小格**的，整張會縮到 410px —— 標題與頁尾是那個尺寸下
     **唯一讀得出來的兩樣東西**，小於 10px 就等於這張圖什麼都沒說。
     ⚠ 地圖上的字**不在這一條裡**：它在 410px 一定小於 10px，那是知情的取捨
       （見規格頁那一段），不是漏做。 */
  const onSlot = [...(title ? [["標題", ts]] : []), ["頁尾", fs2]]
    .map(([nm, px]) => [nm, px * SMALL / W]).filter(([, px]) => px < 10);
  if (onSlot.length) throw new Error(`${tag}：`
    + onSlot.map(([nm, px]) => `${nm}在小格上只有 ${px.toFixed(1)}px`).join("、")
    + `（小格 ${SMALL}px 上讀不出來）`);

  await page.screenshot({ path: path.join(OUT, `post-map-${tag}.png`) });
  return { tag, m, meta, ts, fs2, title, all, park };
};

const CASES = [
  ["a",  {}],                                   /* 建議 */
  ["b",  { park: false }],                      /* 頁尾不放停車那一句 */
  ["c",  { all: false }],                       /* 只亮壹車房（＝站上開頁的樣子） */
  ["big", { ts: 54, fs2: 38 }],                 /* 字級大一階 */
  ["sml", { ts: 40, fs2: 28 }],                 /* 字級小一階（＝看診時間那張的比例） */
  ["t2", { title: TITLES.t2 }],
  ["t3", { title: TITLES.t3 }],
  ["notitle", { title: "" }],                   /* 沒有標題，地圖放到最大 */
];
const made = [];
for (const [tag, opt] of CASES) made.push(await build(tag, opt));

/* ================= 主頁三格 ＋ 410px 實際大小 ================= */
const REC = "post-map-a.png";
const b64 = (f) => "data:image/png;base64,"
  + fs.readFileSync(path.join(OUT, f)).toString("base64");
const HOURS_URI = fs.existsSync(HOURS)
  ? "data:image/png;base64," + fs.readFileSync(HOURS).toString("base64") : null;
if (!HOURS_URI) throw new Error("找不到看診時間那張圖，先跑 node drafts/channels/post-hours.mjs");
const cell = (uri, w, h) => `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">`
  + (uri ? `<img src="${uri}" style="width:100%;height:100%;object-fit:cover;display:block">` : "")
  + `</div>`;

const p2 = await browser.newPage({ viewport: { width: BIG_W, height: BIG_H + 4 + SMALL } });
await p2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
  <div style="width:${BIG_W}px;background:#fff;display:flex;flex-direction:column;gap:4px">
    ${cell(HOURS_URI, BIG_W, BIG_H)}
    <div style="display:flex;gap:3px">${cell(b64(REC), SMALL, SMALL)}${cell(null, SMALL, SMALL)}</div>
  </div>`);
await p2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p2.screenshot({ path: path.join(OUT, "profile-3up.png") });

/* 410px 的實際大小：三張並排（建議／字大一階／只亮一塊） */
const p3 = await browser.newPage({ viewport: { width: SMALL * 3 + 24, height: SMALL + 12 } });
await p3.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}
  body{background:${RULE};display:flex;gap:6px;padding:6px}</style>`
  + ["post-map-a.png", "post-map-big.png", "post-map-sml.png"]
    .map(f => `<img src="${b64(f)}" width="${SMALL}" height="${SMALL}" style="display:block">`).join(""));
await p3.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await p3.screenshot({ path: path.join(OUT, "slot-410.png") });

await browser.close();

/* ================= 「詳情」那一欄要貼的字 ================= */
const detail = `診所在永樂街與平和街19巷的那一角，門面朝永樂街。\n`
  + ADDR + `　` + PHONE + `\n`
  + MAPD.lots.map(l => `${l.name} ${l.dist}`).join("\n");
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);
fs.writeFileSync(path.join(OUT, "detail.txt"), detail + "\n");

/* ================= 印一張「讀起來對不對」 ================= */
const A = made.find(x => x.tag === "a");
const shrink = SMALL / W;                      /* 小格：整張縮到 410 */
const bigShrink = BIG_W / W;                   /* 大格：只縮 0.762，但上下要切 */
console.log(`\n── 地圖（站上那張 SVG，1:1 截下來）──`);
console.log(`  viewBox ${MAPD.vw}×${MAPD.vh}（長寬比 ${AR.toFixed(3)}）　`
  + `畫在成品上 ${A.m.img.w}×${A.m.img.h}　比例尺 ${(A.m.img.w / MAPD.vw).toFixed(3)}`);
console.log(`  永樂站那塊牌子往左挪 ${SHIFT_A.shift} 個單位　`
  + `（原本疊 ${(-SHIFT_A.dx0).toFixed(1)}，挪完空出 ${SHIFT_A.gap} ＝ 2×padX ${2 * PADX}；`
  + `尾巴落在 ${SHIFT_A.tail}，在它自己那塊 P 的 ${SHIFT_A.pin[0]}~${SHIFT_A.pin[1]} 之內）`);
console.log(`  三塊全亮之後兩兩的間隙：` + A.meta.pairs.map(([n, d]) => `${n} ${d}`).join("　"));
console.log(`  ⚠⚠ 地圖是**直的**（${AR.toFixed(3)}），畫布是方的 —— 左右那兩塊留白是結構性的：`);
console.log(`     把四周的空白裁掉**反而更瘦**（空白多的是左右不是上下），`
  + `要它滿版就得上下切掉 ${Math.round((MAPD.vh - MAPD.vw / ((W - 2 * PAD) / (A.m.img.h))) / 2)} 個單位以上，`
  + `永樂站與壹車房兩塊牌子都會不見。`);
console.log(`\n── 讀起來對不對（建議那一張 Ⓐ）──`);
console.log(`  留白　　整塊 ${A.m.band.h.toFixed(0)}／1080 ＝ 佔 ${(A.m.band.h / H * 100).toFixed(0)}%，`
  + `上下各留 ${A.m.band.y.toFixed(0)}px；地圖左右各留 ${((W - 2 * PAD - A.m.img.w) / 2).toFixed(0)}px`);
console.log(`  頁尾　　${A.m.left.length} 行同一條左緣 ${A.m.left[0]}　`
  + `圖示對字面中線最多偏 ${Math.max(...A.m.dy)}px`);
console.log(`\n── ⚠⚠ 在小格（410×410）上，每一種字實際有多大 ──`);
const rows = [["標題", A.ts], ["地址與電話", A.fs2], ["停車那一句", A.fs2],
  ...Object.entries(A.meta.type).map(([k, v]) => [k, v * (A.m.img.w / MAPD.vw)])];
for (const [nm, px] of rows) {
  const on = px * shrink;
  console.log(`  ${nm.padEnd(6, "　")}${px.toFixed(1).padStart(6)}px → 小格 ${on.toFixed(1).padStart(5)}px`
    + `　大格 ${(px * bigShrink).toFixed(1).padStart(5)}px${on < 10 ? "　⚠ 小格上讀不出來" : ""}`);
}
console.log(`  ⚠⚠ 這張圖是給**小格**的（34-4：大格＝看診時間）。地圖上的字在 410px 上`
  + `一律小於 10px —— 那是**故意的**：小格上地圖是一張圖，字由標題與頁尾扛。`);
console.log(`\n── 大格（823×409）會切掉什麼 ──`);
{
  const cut = (H - BAND) / 2;
  const inBand = A.m.band.y >= cut && A.m.band.y + A.m.band.h <= H - cut;
  console.log(`  大格只看得到中間 ${BAND} 列（上下各切 ${cut}px）——`
    + `這一張的內容是 ${A.m.band.y.toFixed(0)}~${(A.m.band.y + A.m.band.h).toFixed(0)}，`
    + (inBand ? "收得進去" : "⚠ 標題與頁尾會被切掉，所以它不適合放大格"));
}
console.log(`\n── 出圖 ──`);
for (const x of made)
  console.log(`  post-map-${x.tag}.png　標題 ${x.ts}／頁尾 ${x.fs2}　`
    + `地圖 ${x.m.img.w}×${x.m.img.h}　內容高 ${x.m.band.h.toFixed(0)}`
    + `${x.all ? "" : "　只亮壹車房"}${x.park ? "" : "　沒有停車那一句"}`);
console.log(`  profile-3up.png　slot-410.png`);
console.log(`\n── 「詳情」欄要貼的字 ──\n` + detail.split("\n").map(l => "  " + l).join("\n"));
