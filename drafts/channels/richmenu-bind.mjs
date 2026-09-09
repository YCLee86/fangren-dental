/* 圖文選單（rich menu）：把綁定完成那張插圖擺進聊天室最底下那條選單
 *   node drafts/channels/richmenu-bind.mjs
 *   → preview/line-richmenu/richmenu-<id>.jpg   ⭐ 這才是要上傳到 LINE 的檔（2500 寬）
 *   → preview/line-richmenu/shot-<id>.png       規格頁上看的（2× 顯示尺寸，只縮不畫）
 *   → preview/line-richmenu/mock-<id>.png       在聊天室裡長什麼樣（1125 裝置 px）
 *
 * 起點：2026-09-09 使用者拿了另一家診所（同一個廠商）的截圖 ——
 *   「我們之前做過的綁定插圖　把他合在這個頁面的下方　取代這個　點此 sign in 圖片看看
 *     或是　在 line 商家帳號裡，這個下方的圖片尺寸可以變動嗎？
 *     我把我們做好的圖片合進去被裁剪成很奇怪」
 *
 * ⚠⚠⚠ 「被裁得很奇怪」是量得出來的，不是感覺：
 *   截圖 1125×2436（iPhone，DPR 3），那條選單量到 **y 1818~2195 ＝ 1125×378**，
 *   1125÷378 ＝ **2.976** —— 那是 LINE 的**小型版型 2500×843（2.966:1）**。
 *   而這張插圖是 1376×768 ＝ **1.792:1**。把 1.79 塞進 2.97 要切掉 **40% 的高度**，
 *   切掉的正好是上面那排頭和下面的腳。**所以不是裁法沒調好，是比例差太多。**
 *
 * ⚠⚠ 尺寸可不可以變動，要看是誰在設（規格頁上寫著出處）：
 *   ・後台（LINE Official Account Manager）只有兩種版型，比例是寫死的：
 *       大型 2500×1686 ／ 1200×810 ／ 800×540   ＝ 1.483:1
 *       小型 2500×843  ／ 1200×405 ／ 800×270   ＝ 2.966:1
 *   ・廠商用 Messaging API 送的話可以自訂，但仍有硬條件：
 *       寬 800~2500、高 ≥250、**寬÷高 ≥ 1.45**、檔案 ≤1MB、JPEG 或 PNG
 *     （這張插圖 1.792 剛好過得了 1.45，所以「整張不裁」只有這條路做得到）
 *
 * ⚠⚠⚠ 判準是「在手機上多大」不是「圖檔多大」（同 og-topic-card 那一輪：
 *   在成品的尺寸上量，不要在素材的尺寸上量）——
 *   選單一律畫成螢幕寬，所以 2500 的圖在 375 CSS px 的手機上是 **×0.15**：
 *   小型 ＝ 375×126、大型 ＝ 375×253。原圖裡一個人頭 85px 高，
 *   縮到小型的圖欄裡只剩 14 CSS px —— 面板每一格都會把這個數字印出來。
 *
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文會落到 WenQuanYi Zen Hei（同 post-hours.mjs、
 *   post-map.mjs 那幾張已經上線的貼文圖），所以字面寬度和使用者手機上會有幾 % 的差。
 */
import fs from "node:fs";
import path from "node:path";

const SRC   = "drafts/bind-done-v4-src.jpg";
const BAR   = "drafts/line-richmenu-chatbar.png";   /* 截圖切下來的那條選單列（1125×240） */
const OUT   = "preview/line-richmenu";

/* ── 顏色：一個都沒有新增 ────────────────────────────────────────── */
const CREAM = "#fcf4e4";   /* 插圖自己的底色（量出來的，出現 21.7%）—— 接縫才會不見 */
const INK   = "#2a2c27";   /* --ink */
const SOFT  = "#5c5f57";   /* --ink-soft */
const GREEN = "#3f654a";   /* 一般牙科的套色 ＝ 品牌真值 */

/* ── 聊天室那一側量出來的（1125×2436 的截圖）────────────────────── */
const PHONE_W  = 1125;     /* 375 CSS px × DPR 3 */
const GAP_H    = 38;       /* 選單上面那段聊天室底色 */
const CHAT_BG  = "#1a1a1a";
const BAR_H    = 240;

/* ── LINE 的兩種版型 ─────────────────────────────────────────────── */
const SIZES = {
  compact: { w: 2500, h: 843,  name: "小型", alt: "1200×405／800×270" },
  large:   { w: 2500, h: 1686, name: "大型", alt: "1200×810／800×540" },
  /* ⚠ 這一個後台選不到 —— 只有廠商用 Messaging API 送才做得到。
   *   2500÷1396 ＝ 1.791 ＝ 插圖自己的比例，所以整張圖一個像素都不必裁。 */
  custom:  { w: 2500, h: 1396, name: "自訂", alt: "＝插圖原比例 1.79:1" },
};

/* 原圖裡量過的一個人頭（患者），用來報「在手機上會變多大」 */
const HEAD = { w: 86, h: 82 };

/* ── 文案 ─────────────────────────────────────────────────────────
 * ⚠ 這一組是我們擬的，不是使用者寫的 —— 這條線前面每一則的字最後都換成他的版本。
 * ⚠ 用詞跟著已定稿的綁定完成卡走（那張寫「約診查詢」「看診前48小時…提醒」），
 *   不要另外發明一組講法。
 * ⚠ 斷行一律自己指定（第十一之二節）。 */
const COPY = {
  pill: "點一下",
  head: "綁定手機",
  sub:  ["看診提醒與約診查詢", "綁定後都在這裡"],
  band: "看診提醒與約診查詢都在這裡",
};

/* ── 四格 ─────────────────────────────────────────────────────────
 * crop 給的是「原圖上要露出來的那一塊」；不給就用 cover 置中。 */
const CASES = [
  { id: "x", size: "compact", kind: "full",
    label: "Ⓧ 現況", note: "整張圖直接塞進小型版型（＝使用者遇到的那一種）" },
  { id: "a", size: "compact", kind: "split", textw: 1080,
    label: "Ⓐ 小型・圖 ＋ 字欄", note: "右邊放圖（左右各裁 3%），左邊留一欄字" },
  { id: "b", size: "large", kind: "band", bandh: 330,
    label: "Ⓑ 大型・圖 ＋ 字帶", note: "整張圖幾乎不裁，底下一條深綠的字帶" },
  { id: "c", size: "custom", kind: "full",
    label: "Ⓒ 自訂・整張圖", note: "2500×1396 ＝ 插圖原比例，一個像素都不裁（只有廠商走 API 做得到）" },
];

/* ── 版面（畫在 2500 的畫布上，所以每個數字都要乘 0.15 才是手機上的 px）── */
const PAD_L = 130, PAD_R = 70;
const FS = { pill: 78, head: 190, sub: 92, bandHead: 126, bandSub: 80 };

const css = (imgURI) => `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif;
  -webkit-font-smoothing:antialiased}
.rm{position:relative;overflow:hidden;background:${CREAM};color:${INK}}
.pic{background-image:url("${imgURI}");background-repeat:no-repeat}
/* 字欄 */
.col{position:absolute;left:0;top:0;bottom:0;display:flex;flex-direction:column;
  justify-content:center;align-items:flex-start;padding:0 ${PAD_R}px 0 ${PAD_L}px}
.pill{background:${GREEN};color:#fff;border-radius:999px;font-size:${FS.pill}px;
  font-weight:700;letter-spacing:.10em;padding:14px 34px 16px;line-height:1.2;
  text-indent:.10em}
.head{font-size:${FS.head}px;font-weight:900;letter-spacing:.06em;line-height:1.28;
  margin-top:26px;text-indent:.06em;white-space:nowrap}
.sub{font-size:${FS.sub}px;font-weight:500;color:${SOFT};letter-spacing:.03em;
  line-height:1.55;margin-top:20px;white-space:pre;text-indent:.03em}
/* 大型版的字帶 */
.band{position:absolute;left:0;right:0;bottom:0;background:${GREEN};color:#fff;
  display:flex;align-items:center;justify-content:center;gap:32px}
.band .bh{font-size:${FS.bandHead}px;font-weight:900;letter-spacing:.08em;
  white-space:nowrap;text-indent:.08em}
.band .bs{font-size:${FS.bandSub}px;font-weight:400;letter-spacing:.03em;opacity:.92;
  white-space:nowrap;text-indent:.03em}
.band .dot{width:9px;height:9px;border-radius:50%;background:#fff;opacity:.55}
`;

/* 一格的 markup ＋ 那一格圖的背景幾何（cover／指定 crop 都算成 background-size/position） */
function block(c) {
  const S = SIZES[c.size];
  const slot = c.kind === "split" ? { w: S.w - c.textw, h: S.h }
             : c.kind === "band"  ? { w: S.w, h: S.h - c.bandh }
             :                      { w: S.w, h: S.h };
  const SRCW = 1376, SRCH = 768;
  let s, ox, oy;                       /* 縮放倍率 ＋ 圖左上角在 slot 裡的位置 */
  if (c.crop) {
    s = Math.max(slot.w / c.crop.w, slot.h / c.crop.h);
    ox = -c.crop.x * s + (slot.w - c.crop.w * s) / 2;
    oy = -c.crop.y * s + (slot.h - c.crop.h * s) / 2;
  } else {
    s = Math.max(slot.w / SRCW, slot.h / SRCH);
    ox = (slot.w - SRCW * s) / 2;
    oy = (slot.h - SRCH * s) / 2;
  }
  const pic = `position:absolute;` +
    (c.kind === "split" ? `right:0;top:0;` : `left:0;top:0;`) +
    `width:${slot.w}px;height:${slot.h}px;` +
    `background-size:${(SRCW * s).toFixed(2)}px ${(SRCH * s).toFixed(2)}px;` +
    `background-position:${ox.toFixed(2)}px ${oy.toFixed(2)}px;`;

  let inner = `<div class="pic" style="${pic}"></div>`;
  if (c.kind === "split")
    inner += `<div class="col" style="width:${c.textw}px">
        <div class="pill">${COPY.pill}</div>
        <div class="head">${COPY.head}</div>
        <div class="sub">${COPY.sub.join("\n")}</div>
      </div>`;
  if (c.kind === "band")
    inner += `<div class="band" style="height:${c.bandh}px">
        <span class="bh">${COPY.pill}　${COPY.head}</span>
        <span class="dot"></span>
        <span class="bs">${COPY.band}</span>
      </div>`;
  return { html: `<div class="rm" id="rm-${c.id}" style="width:${S.w}px;height:${S.h}px">${inner}</div>`,
           slot, s };
}

/* ─────────────────────────────────────────────────────────────────── */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chromePath = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const imgURI = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
const barURI = `data:image/png;base64,${fs.readFileSync(BAR).toString("base64")}`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: fs.existsSync(chromePath) ? chromePath : undefined });
const pg = await browser.newPage({ viewport: { width: 2560, height: 2000 }, deviceScaleFactor: 1 });

const blocks = CASES.map(block);
await pg.setContent(`<!doctype html><meta charset="utf-8"><style>${css(imgURI)}</style>` +
  `<body style="padding:0">${blocks.map((b) => b.html).join("")}</body>`);
await pg.evaluate(() => document.fonts.ready);

const rows = [];
for (let i = 0; i < CASES.length; i++) {
  const c = CASES[i], S = SIZES[c.size], b = blocks[i];
  const el = pg.locator(`#rm-${c.id}`);

  /* 出圖之前先量那個元素 —— 出圖之後拿檔頭回來對（守門跟著這一張的形狀走） */
  const box = await el.boundingBox();
  if (Math.round(box.width) !== S.w || Math.round(box.height) !== S.h)
    throw new Error(`${c.id}：元素量到 ${box.width}×${box.height}，宣告的是 ${S.w}×${S.h}`);

  const png = await el.screenshot({ type: "png" });
  /* 真的要上傳的那一份出 JPEG：LINE 的上限是 1MB，這種滿版插畫 PNG 會超過 */
  const real = path.join(OUT, `richmenu-${c.id}.jpg`);
  const shot = path.join(OUT, `shot-${c.id}.png`);
  const mock = path.join(OUT, `mock-${c.id}.png`);

  const dispW = 375, dispH = Math.round((S.h * dispW) / S.w);       /* 手機上的 CSS px */
  const r = await pg.evaluate(async ({ b64, W, H, q, shotW, barURI, PHONE_W, GAP_H, BAR_H, CHAT_BG }) => {
    const load = async (u) => { const im = new Image(); im.src = u; await im.decode(); return im; };
    const src = await load(`data:image/png;base64,${b64}`);

    /* ① 上傳用的那一份 */
    const c1 = document.createElement("canvas"); c1.width = W; c1.height = H;
    c1.getContext("2d").drawImage(src, 0, 0);
    const jpg = c1.toDataURL("image/jpeg", q).split(",")[1];

    /* ② 規格頁上看的（2× 顯示尺寸，只縮不畫） */
    const c2 = document.createElement("canvas");
    c2.width = shotW; c2.height = Math.round((H * shotW) / W);
    const g2 = c2.getContext("2d"); g2.imageSmoothingQuality = "high";
    g2.drawImage(src, 0, 0, c2.width, c2.height);

    /* ③ 在聊天室裡長什麼樣（裝置 px：1125 寬） */
    const menuH = Math.round((H * PHONE_W) / W);
    const bar = await load(barURI);
    const c3 = document.createElement("canvas");
    c3.width = PHONE_W; c3.height = GAP_H + menuH + BAR_H;
    const g3 = c3.getContext("2d");
    g3.fillStyle = CHAT_BG; g3.fillRect(0, 0, c3.width, c3.height);
    g3.imageSmoothingQuality = "high";
    g3.drawImage(src, 0, GAP_H, PHONE_W, menuH);
    g3.drawImage(bar, 0, GAP_H + menuH);

    /* 量：圖欄裡真的露出原圖的哪一塊、字有沒有被再折 */
    const el = document.getElementById("rm-" + location.hash);   /* 用不到，量在外面做 */
    return { jpg, shot: c2.toDataURL("image/png").split(",")[1],
             mock: c3.toDataURL("image/png").split(",")[1], menuH };
  }, { b64: png.toString("base64"), W: S.w, H: S.h, q: 0.92, shotW: dispW * 2,
       barURI, PHONE_W, GAP_H, BAR_H, CHAT_BG });

  fs.writeFileSync(real, Buffer.from(r.jpg, "base64"));
  fs.writeFileSync(shot, Buffer.from(r.shot, "base64"));
  fs.writeFileSync(mock, Buffer.from(r.mock, "base64"));

  /* ── 量測 ─────────────────────────────────────────────── */
  const m = await pg.evaluate((id) => {
    const rm = document.getElementById("rm-" + id);
    const R = rm.getBoundingClientRect();
    const one = (sel) => {
      const e = rm.querySelector(sel); if (!e) return null;
      const b = e.getBoundingClientRect();
      const rects = [...e.getClientRects()];
      /* 畫出幾行 ＝ 把 Range 逐字分組（照 top）*/
      const rg = document.createRange(); const tops = new Set();
      const walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      let n; while ((n = walk.nextNode())) for (let i = 0; i < n.length; i++) {
        rg.setStart(n, i); rg.setEnd(n, i + 1);
        const rr = rg.getBoundingClientRect(); if (rr.width) tops.add(Math.round(rr.top));
      }
      return { w: b.width, h: b.height, left: b.left - R.left, right: b.right - R.left,
               fs: parseFloat(getComputedStyle(e).fontSize), lines: tops.size };
    };
    const pic = rm.querySelector(".pic").getBoundingClientRect();
    return { pill: one(".pill"), head: one(".head"), sub: one(".sub"),
             bh: one(".bh"), bs: one(".bs"),
             picLeft: pic.left - R.left, picW: pic.width, picH: pic.height,
             scrollW: rm.scrollWidth, clientW: rm.clientWidth };
  }, c.id);

  const k = dispW / S.w;                                   /* 2500 → 375 */
  const headCss = HEAD.h * b.s * k;                        /* 一個人頭在手機上多高 */
  /* 圖欄裡真的露出原圖的多少 —— Ⓧ「硬塞」壞在這一格，不是壞在人頭多大 */
  const visW = Math.min(1376, b.slot.w / b.s), visH = Math.min(768, b.slot.h / b.s);
  const seen = (visW * visH) / (1376 * 768) * 100;
  const bytes = fs.statSync(real).size;
  rows.push({ c, S, m, b, dispW, dispH, k, headCss, seen, bytes, menuH: r.menuH });

  /* ── 守門 ──────────────────────────────────────────────── */
  if (S.w / S.h < 1.45) throw new Error(`${c.id}：比例 ${(S.w / S.h).toFixed(3)} < LINE 的下限 1.45`);
  if (bytes > 1024 * 1024) throw new Error(`${c.id}：${(bytes / 1024).toFixed(0)}KB 超過 LINE 的 1MB`);
  if (m.scrollW > m.clientW) throw new Error(`${c.id}：水平溢出 ${m.scrollW - m.clientW}px`);
  if (c.kind === "split") {
    if (m.head.lines !== 1) throw new Error(`${c.id}：主標被折成 ${m.head.lines} 行`);
    if (m.sub.lines !== COPY.sub.length)
      throw new Error(`${c.id}：副標自己斷 ${COPY.sub.length} 行、畫出 ${m.sub.lines} 行（被再折了）`);
    for (const [nm, e] of [["主標", m.head], ["副標", m.sub], ["藥丸", m.pill]])
      if (e.right > c.textw - PAD_R + 1)
        throw new Error(`${c.id}：${nm}右緣 ${e.right.toFixed(0)} 超出字欄可用的 ${c.textw - PAD_R}`);
    if (m.head.fs * k < 14)
      throw new Error(`${c.id}：主標在手機上只有 ${(m.head.fs * k).toFixed(1)}px（下限 14）`);
    if (m.sub.fs * k < 11)
      throw new Error(`${c.id}：副標在手機上只有 ${(m.sub.fs * k).toFixed(1)}px（下限 11）`);
  }
  if (c.kind === "band") {
    for (const [nm, e] of [["字帶主標", m.bh], ["字帶副標", m.bs]])
      if (e.lines !== 1) throw new Error(`${c.id}：${nm}被折成 ${e.lines} 行`);
    if (m.bh.fs * k < 14) throw new Error(`${c.id}：字帶主標只有 ${(m.bh.fs * k).toFixed(1)}px`);
  }
}
await browser.close();

/* ── 面板 ─────────────────────────────────────────────────────────── */
const px = (e, k) => (e ? (e.fs * k).toFixed(1) : "—");
const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - [...String(s)].reduce((a, ch) => a + (ch.charCodeAt(0) > 255 ? 2 : 1), 0)));
console.log("");
console.log("　　　　　　　　　　版型　　圖檔　　　　手機上　　　圖欄　　　　看得到　一個人頭　主標　副標　檔案");
for (const r of rows) {
  const { c, S, m, k } = r;
  const picCss = `${(m.picW * k).toFixed(0)}×${(m.picH * k).toFixed(0)}`;
  console.log(
    pad(c.label, 22) + pad(SIZES[c.size].name, 6) + pad(`${S.w}×${S.h}`, 12) +
    pad(`${r.dispW}×${r.dispH}`, 11) + pad(picCss, 11) + pad(`${r.seen.toFixed(0)}%`, 8) +
    pad(`${r.headCss.toFixed(1)}px`, 10) +
    pad(px(m.head ?? m.bh, k), 6) + pad(px(m.sub ?? m.bs, k), 6) +
    `${(r.bytes / 1024).toFixed(0)}KB`);
}
console.log("");
console.log(`原圖 1376×768 ＝ 1.792:1　　小型版型 2500×843 ＝ 2.966:1　　大型 2500×1686 ＝ 1.483:1`);
console.log(`LINE 的硬條件：寬 800~2500、高 ≥250、寬÷高 ≥1.45、≤1MB、JPEG 或 PNG`);
console.log(`手機上選單一律畫成螢幕寬 —— 這裡按 375 CSS px 算（截圖那台是 1125÷3）`);
console.log("");

/* ⚠ 面板上的每一個數字都會被規格頁抄一次 —— 抄過去就會有第二個真相，
 *   所以寫成一份 JSON 讓守門去對（check-richmenu.mjs）。這一份在 drafts/，不上線。 */
fs.writeFileSync("drafts/line-richmenu-numbers.json", JSON.stringify({
  _說明: "node drafts/channels/richmenu-bind.mjs 產生；規格頁上的數字由 check-richmenu.mjs 拿它比對",
  原圖: { w: 1376, h: 768, 比例: +(1376 / 768).toFixed(3) },
  截圖: { w: 1125, h: 2436, 選單: { y0: 1818, y1: 2195, w: 1125, h: 378, 比例: +(1125 / 378).toFixed(3) } },
  硬條件: { 寬: [800, 2500], 高下限: 250, 比例下限: 1.45, 檔案上限KB: 1024 },
  格: rows.map((r) => ({
    id: r.c.id, 標籤: r.c.label, 版型: SIZES[r.c.size].name,
    圖檔: `${r.S.w}×${r.S.h}`, 比例: +(r.S.w / r.S.h).toFixed(3),
    手機上: `${r.dispW}×${r.dispH}`,
    圖欄: `${Math.round(r.m.picW * r.k)}×${Math.round(r.m.picH * r.k)}`,
    看得到: +r.seen.toFixed(0), 一個人頭: +r.headCss.toFixed(1),
    主標: r.m.head ? +(r.m.head.fs * r.k).toFixed(1) : (r.m.bh ? +(r.m.bh.fs * r.k).toFixed(1) : null),
    副標: r.m.sub ? +(r.m.sub.fs * r.k).toFixed(1) : (r.m.bs ? +(r.m.bs.fs * r.k).toFixed(1) : null),
    檔案KB: Math.round(r.bytes / 1024),
    mock: { w: PHONE_W, h: GAP_H + r.menuH + BAR_H },
  })),
}, null, 1) + "\n");
console.log("數字寫進 drafts/line-richmenu-numbers.json");
console.log("");
