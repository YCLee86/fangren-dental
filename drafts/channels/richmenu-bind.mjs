/* 圖文選單（rich menu）：把綁定完成那張插圖擺進聊天室最底下那條選單
 *   node drafts/channels/richmenu-bind.mjs
 *   → preview/line-richmenu/richmenu-<id>.jpg   ⭐ 這才是要上傳到 LINE 的檔（2500 寬）
 *   → preview/line-richmenu/chat-<id>.jpg       在 LINE 裡長什麼樣（整支手機，1125×2436）
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
const WELC  = "preview/line-welcome/shot-welcome.png";  /* 招呼圖卡（已定案的產出檔，804×1470 ＝ 268×490 CSS） */
const ICON  = "assets/icon-192.png";
const OUT   = "preview/line-richmenu";

/* ── 顏色：一個都沒有新增 ────────────────────────────────────────── */
const CREAM = "#fcf4e4";   /* 插圖自己的底色（量出來的，出現 21.7%）—— 接縫才會不見 */
const INK   = "#2a2c27";   /* --ink */
const SOFT  = "#5c5f57";   /* --ink-soft */
const GREEN = "#3f654a";   /* 一般牙科的套色 ＝ 品牌真值 */

/* ── 「在 LINE 裡長什麼樣」那張整支手機 ──────────────────────────
 * ⚠⚠ 尺寸照使用者那張截圖：1125×2436（iPhone，DPR 3）＝ 375×812 CSS px。
 * ⚠⚠ 但**一個像素都沒有用他的截圖** —— 聊天室、選單列、狀態列全部自己畫，
 *   配色沿用這條線其他規格頁那一組（--li-bg 那幾支），repo 是公開的。
 * ⚠ 聊天室是**貼著底部長的**（`justify-content: flex-end`）：大型版型把選單
 *   撐到 253px 時，招呼圖卡自然被上緣切掉一截 —— 那正是真的聊天室的樣子。 */
const PHONE_W  = 375, PHONE_H = 812;   /* CSS px；出圖 deviceScaleFactor 3 */
const DSF      = 3;
const HEAD_H   = 44;       /* LINE 的聊天室抬頭 */
const BAR_H    = 80;       /* 選單底下那條（鍵盤圖示 ＋ 選單列的名字 ＋ home 指示） */
const BAR_LABEL = "手機註冊";   /* ⚠ 那一行字是廠商在後台設的，我們還不知道改不改得動 */
const LI = { bg: "#e9edf1", head: "#ffffff", ink: "#14181c", meta: "#8b96a1", line: "#e3e6ea" };

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
  /* ⚠ 2026-09-09 使用者定案：「綁定手機」→「手機綁定」。
   *   ⚠⚠ 選單列那一行是廠商設的「手機註冊」——**同一條選單上兩個詞**
   *   （註冊 vs 綁定），而這條線其餘每一則（綁定完成卡…）一律用「綁定」。
   *   那一行改不改得動已經在頁面的問題清單裡。 */
  head: "手機綁定",
  sub:  ["看診提醒與約診查詢", "綁定後都在這裡"],
  /* ⚠⚠ 字帶那一句仍然留著「點一下」，那不是漏改成一致 ——
   *   使用者拿掉的是**藥丸**（一顆看起來像按鈕的東西，會讓人以為只有那裡可以按，
   *   「雖然圖片也可以點」）。字帶裡它只是一行字的開頭、不會長出一個假的按鈕，
   *   而大型版的圖佔滿整條、更需要一句話說這是可以按的。 */
  bandHead: "點一下　綁定手機",
  band: "看診提醒與約診查詢都在這裡",
};

/* ── 四格 ─────────────────────────────────────────────────────────
 * crop 給的是「原圖上要露出來的那一塊」；不給就用 cover 置中。 */
/* ── 定案（2026-09-09，使用者：「那就用 A2-3　不過綁定手機　改成　手機綁定
 *   　做好　給我預覽　其他的不用再顯示出來」）───────────────────────────
 *
 * ＝ 原本那把尺上的 **Ⓐ2-3**：小型版型 ＋ 字欄 990 ＋ 主標 165／副標 82。
 *   圖欄 1510（手機上 227px）、插圖 **100% 一個像素都不裁**、字到圖 14.6px。
 *
 * ⚠⚠ **其餘十二格全部拿掉了，推導留在 README 第 37-4-3 ~ 37-4-6 與 git**：
 *   字級三格（Ⓐ1／Ⓐ2／Ⓐ3）、圖欄四格（Ⓐ3-2~4／Ⓐ2-2）、
 *   大型的帶子三格（Ⓑ1~3）、自訂（Ⓒ）、硬塞（Ⓧ）——
 *   要回頭比就 `git show 7420f27 -- drafts/channels/richmenu-bind.mjs`，不要重畫。
 *   `kind: "band"`／`"full"` 那兩條路的程式碼**留著沒刪**（大型與自訂的退路）。
 *
 * ⚠⚠⚠ **面板不可以跟著收**（第九節第 28 條 ④）：格子只剩一個，但
 *   「看得到多少／裁哪邊／一個人頭多高／字到圖多遠」每次出圖仍然要印 ——
 *   不然哪天有人動到字級或字欄，這裡不會有任何一個數字變。 */
const CASES = [
  { id: "final", size: "compact", kind: "split", textw: 990, head: 165, sub: 82,
    label: "定案", note: "小型 2500×843、圖欄 227px、插圖 100% 看得到" },
];

/* ── 版面（畫在 2500 的畫布上，所以每個數字都要乘 0.15 才是手機上的 px）── */
const PAD_L = 130, PAD_R = 70;
/* ⚠ 字級收進每一格自己身上（CASES 的 head／sub／bandHead／bandSub），
 *   這裡只留那一格沒寫時的預設值。**藥丸整組拿掉了。** */
const FS = { head: 190, sub: 92, bandHead: 126, bandSub: 80 };
const fsOf = (c, k) => c[k] ?? FS[k];

const css = (imgURI) => `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif;
  -webkit-font-smoothing:antialiased}
.rm{position:relative;overflow:hidden;background:${CREAM};color:${INK}}
.pic{background-image:url("${imgURI}");background-repeat:no-repeat}
/* 字欄 */
.col{position:absolute;left:0;top:0;bottom:0;display:flex;flex-direction:column;
  justify-content:center;align-items:flex-start;padding:0 ${PAD_R}px 0 ${PAD_L}px}
.head{font-weight:900;letter-spacing:.06em;line-height:1.28;
  text-indent:.06em;white-space:nowrap}
.sub{font-weight:500;color:${SOFT};letter-spacing:.03em;
  line-height:1.55;white-space:pre;text-indent:.03em}
/* 大型版的字帶 */
.band{position:absolute;left:0;right:0;bottom:0;background:${GREEN};color:#fff;
  display:flex;align-items:center;justify-content:center;gap:32px}
.band .bh{font-weight:900;letter-spacing:.08em;
  white-space:nowrap;text-indent:.08em}
.band .bs{font-weight:400;letter-spacing:.03em;opacity:.92;
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
  if (c.kind === "split") {
    /* ⚠ 副標的上外距跟著自己的字級走（.24em），字一小間距也要跟著收，
     *   不然三格看起來會是「字變小、空隙沒變」＝ 只動了一半。 */
    const fh = fsOf(c, "head"), fsb = fsOf(c, "sub");
    inner += `<div class="col" style="width:${c.textw}px">
        <div class="head" style="font-size:${fh}px">${COPY.head}</div>
        <div class="sub" style="font-size:${fsb}px;margin-top:${Math.round(fsb * 0.24)}px">${COPY.sub.join("\n")}</div>
      </div>`;
  }
  if (c.kind === "band")
    inner += `<div class="band" style="height:${c.bandh}px;gap:${Math.round(fsOf(c, "bandHead") * 0.25)}px">
        <span class="bh" style="font-size:${fsOf(c, "bandHead")}px">${COPY.bandHead}</span>
        <span class="dot"></span>
        <span class="bs" style="font-size:${fsOf(c, "bandSub")}px">${COPY.band}</span>
      </div>`;
  return { html: `<div class="rm" id="rm-${c.id}" style="width:${S.w}px;height:${S.h}px">${inner}</div>`,
           slot, s };
}

/* ─────────────────────────────────────────────────────────────────── */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chromePath = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const imgURI = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

fs.mkdirSync(OUT, { recursive: true });
/* ⚠ 先清掉上一次的產物 —— 收格子的時候舊候選會變成孤兒檔 */
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".jpg")) fs.unlinkSync(path.join(OUT, f));
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
  const dispW = 375, dispH = Math.round((S.h * dispW) / S.w);       /* 手機上的 CSS px */
  const r = await pg.evaluate(async ({ b64, W, H, DW, DH, q }) => {
    const load = async (u) => { const im = new Image(); im.src = u; await im.decode(); return im; };
    const src = await load(`data:image/png;base64,${b64}`);

    /* 上傳用的那一份 */
    const c1 = document.createElement("canvas"); c1.width = W; c1.height = H;
    c1.getContext("2d").drawImage(src, 0, 0);
    const jpg = c1.toDataURL("image/jpeg", q).split(",")[1];

    /* 規格頁擺的那一份：1125 寬 ＝ 手機上 375 CSS px 的 3 倍。
     * ⚠ 2500 那一份一張 260~430KB，七格嵌進同一頁就是 2.6MB，
     *   而 Worker 對 /preview/* 設 no-store（每次都要重新下載）。 */
    const c2 = document.createElement("canvas"); c2.width = DW; c2.height = DH;
    const g = c2.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(src, 0, 0, DW, DH);
    const strip = c2.toDataURL("image/jpeg", 0.88).split(",")[1];

    return { jpg, strip };
  }, { b64: png.toString("base64"), W: S.w, H: S.h,
       DW: dispW * 3, DH: Math.round((S.h * dispW * 3) / S.w), q: 0.92 });

  fs.writeFileSync(real, Buffer.from(r.jpg, "base64"));
  fs.writeFileSync(path.join(OUT, `strip-${c.id}.jpg`), Buffer.from(r.strip, "base64"));

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
    return { head: one(".head"), sub: one(".sub"),
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
  /* ⚠ 「字和圖中間還有多少」＝ 圖欄左緣 − 最寬那一行的右緣。
   *   使用者看到的「餘裕」就是這一格，面板不印它就只能用眼睛猜。 */
  const inkR = c.kind === "split" ? Math.max(m.head.right, m.sub.right) : null;
  const gapCss = inkR == null ? null : (m.picLeft - inkR) * k;
  /* 裁哪一邊：圖欄比插圖寬就是切上下（頭與腳），反之切左右 */
  const cropSide = b.slot.w / b.slot.h > 1376 / 768 ? "上下" : "左右";
  rows.push({ c, S, m, b, dispW, dispH, k, headCss, seen, bytes, gapCss, cropSide });

  /* ── 守門 ──────────────────────────────────────────────── */
  if (S.w / S.h < 1.45) throw new Error(`${c.id}：比例 ${(S.w / S.h).toFixed(3)} < LINE 的下限 1.45`);
  if (bytes > 1024 * 1024) throw new Error(`${c.id}：${(bytes / 1024).toFixed(0)}KB 超過 LINE 的 1MB`);
  if (m.scrollW > m.clientW) throw new Error(`${c.id}：水平溢出 ${m.scrollW - m.clientW}px`);
  if (c.kind === "split") {
    if (m.head.lines !== 1) throw new Error(`${c.id}：主標被折成 ${m.head.lines} 行`);
    if (m.sub.lines !== COPY.sub.length)
      throw new Error(`${c.id}：副標自己斷 ${COPY.sub.length} 行、畫出 ${m.sub.lines} 行（被再折了）`);
    for (const [nm, e] of [["主標", m.head], ["副標", m.sub]])
      if (e.right > c.textw - PAD_R + 1)
        throw new Error(`${c.id}：${nm}右緣 ${e.right.toFixed(0)} 超出字欄可用的 ${c.textw - PAD_R}`);
    if (m.head.fs * k < 14)
      throw new Error(`${c.id}：主標在手機上只有 ${(m.head.fs * k).toFixed(1)}px（下限 14）`);
    /* ⚠ 下限 10px 是「讀不讀得到」那一條線（同商家貼文那兩張的判準），
     *   不是「好不好看」—— 哪一格好看是使用者在尺上挑的（第九節第 28 條 ④）。 */
    if (m.sub.fs * k < 10)
      throw new Error(`${c.id}：副標在手機上只有 ${(m.sub.fs * k).toFixed(1)}px（下限 10）`);
  }
  if (c.kind === "band") {
    for (const [nm, e] of [["字帶主標", m.bh], ["字帶副標", m.bs]])
      if (e.lines !== 1) throw new Error(`${c.id}：${nm}被折成 ${e.lines} 行`);
    if (m.bh.fs * k < 14) throw new Error(`${c.id}：字帶主標只有 ${(m.bh.fs * k).toFixed(1)}px（下限 14）`);
    if (m.bs.fs * k < 10) throw new Error(`${c.id}：字帶副標只有 ${(m.bs.fs * k).toFixed(1)}px（下限 10）`);
  }
}
/* ── 「在 LINE 裡長什麼樣」：整支手機 ────────────────────────────────
 * ⚠⚠ 另開一個 deviceScaleFactor 3 的頁 —— 上面那一頁是 1，才出得了剛好 2500px 的圖檔。
 * ⚠ 聊天室裡擺的是**已經定案的招呼圖卡那張產出檔**，不是用 CSS 再畫一次
 *   （第十一之五節：提案頁要擺真的產出檔）——它正好就是加好友當下看到的第一則。
 * ⚠⚠ **只做三張，不是每一格都做**：一張 1125×2436 的 JPEG 約 300KB，
 *   七格都做等於在一頁 no-store 的頁面上多 2MB。這張圖回答的是「**它在整個畫面裡
 *   佔多少**」——那是**版型**的事（小型／大型），字級那把尺看不出差別。
 *   所以現況一張 ＋ 每一族的建議各一張。 */
const MOCK = ["final"];
const MOCKS = CASES.filter((c) => MOCK.includes(c.id));
const b64 = (f) => fs.readFileSync(f).toString("base64");
const welcURI = `data:image/png;base64,${b64(WELC)}`;
const iconURI = `data:image/png;base64,${b64(ICON)}`;

const pg3 = await browser.newPage({ viewport: { width: 420, height: PHONE_H + 40 }, deviceScaleFactor: DSF });
await pg3.setContent(`<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif;
  -webkit-font-smoothing:antialiased}
.ph{position:relative;width:${PHONE_W}px;height:${PHONE_H}px;overflow:hidden;
  background:${LI.bg};display:flex;flex-direction:column}
.hd{height:${HEAD_H}px;flex:none;background:${LI.head};display:flex;align-items:center;
  gap:9px;padding:0 12px;border-bottom:1px solid ${LI.line}}
.hd img{width:26px;height:26px;border-radius:50%;display:block}
.hd .b{font-size:15px;font-weight:700;color:${LI.ink};letter-spacing:.01em}
.hd .x{margin-left:auto;color:${LI.meta};font-size:16px;letter-spacing:.14em}
/* ⚠ 聊天室貼著底部長：選單一高，上面的訊息自然被切掉一截 ＝ 真的聊天室的樣子 */
.ct{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;
  align-items:flex-start;gap:10px;padding:12px 8px 14px}
.day{align-self:center;background:rgba(0,0,0,.16);color:#fff;font-size:11px;
  padding:2px 11px;border-radius:11px;flex:none}
.msg{display:flex;gap:7px;align-items:flex-end;flex:none;max-width:100%}
.av{width:30px;height:30px;border-radius:50%;flex:none;display:block;
  border:1px solid ${LI.line}}
.card{width:268px;border-radius:12px;overflow:hidden;line-height:0;flex:none;
  box-shadow:0 1px 2px rgba(0,0,0,.10)}
.card img{display:block;width:100%;height:auto}
.rm{flex:none;width:100%;line-height:0}
.rm img{display:block;width:100%;height:auto}
/* 選單底下那一條：鍵盤圖示 ＋ 選單列的名字 ＋ home 指示 */
.bar{flex:none;height:${BAR_H}px;background:#ffffff;border-top:1px solid ${LI.line};
  display:flex;align-items:center;padding:0 14px;position:relative}
/* 鍵盤圖示：一個框 ＋ 三顆點（空框讀起來像破圖） */
.kb{width:26px;height:20px;border:1.5px solid ${LI.meta};border-radius:5px;flex:none;
  display:flex;align-items:center;justify-content:center;gap:3px}
.kb b{width:3px;height:3px;border-radius:1px;background:${LI.meta};display:block}
.lb{position:absolute;left:0;right:0;text-align:center;font-size:15px;color:${LI.ink};
  letter-spacing:.02em;pointer-events:none}
.lb u{text-decoration:underline;text-underline-offset:3px}
.lb i{font-style:normal;font-size:10px;color:${LI.meta};margin-left:5px;vertical-align:2px}
.home{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);
  width:134px;height:5px;border-radius:3px;background:#c8ced4}
</style><body>${MOCKS.map((c) => `
<div class="ph" id="ph-${c.id}">
  <div class="hd"><img src="${iconURI}" alt=""><span class="b">芳仁牙醫診所</span><span class="x">···</span></div>
  <div class="ct">
    <span class="day">今天</span>
    <div class="msg"><img class="av" src="${iconURI}" alt="">
      <span class="card"><img src="${welcURI}" alt=""></span></div>
  </div>
  <div class="rm"><img src="data:image/jpeg;base64,${b64(path.join(OUT, `richmenu-${c.id}.jpg`))}" alt=""></div>
  <div class="bar"><span class="kb"><b></b><b></b><b></b></span>
    <span class="lb"><u>${BAR_LABEL}</u><i>▼</i></span><span class="home"></span></div>
</div>`).join("")}</body>`);
await pg3.evaluate(() => document.fonts.ready);

for (const c of MOCKS) {
  const el = pg3.locator(`#ph-${c.id}`);
  const box = await el.boundingBox();
  if (Math.round(box.width) !== PHONE_W || Math.round(box.height) !== PHONE_H)
    throw new Error(`${c.id} 的手機量到 ${box.width}×${box.height}，應該是 ${PHONE_W}×${PHONE_H}`);
  /* 選單真的畫成螢幕寬、而且高度 ＝ 圖檔比例算出來的那個數字 */
  const rm = await pg3.evaluate((id) => {
    const r = document.querySelector(`#ph-${id} .rm img`).getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  }, c.id);
  const want = Math.round((SIZES[c.size].h * PHONE_W) / SIZES[c.size].w);
  if (Math.abs(rm.w - PHONE_W) > 0.5 || Math.abs(rm.h - want) > 1)
    throw new Error(`${c.id} 的選單畫成 ${rm.w}×${rm.h}，應該是 ${PHONE_W}×${want}`);
  /* ⚠ 出 JPEG 不是 PNG：四張 1125×2436 的 PNG 合計 4MB，
   *   而 Worker 對 /preview/* 設 no-store（每次都要重新下載）。 */
  await el.screenshot({ path: path.join(OUT, `chat-${c.id}.jpg`), type: "jpeg", quality: 88 });
  const d = rows.find((r) => r.c.id === c.id); if (d) d.chat = rm;
}

await browser.close();

/* ── 面板 ─────────────────────────────────────────────────────────── */
const px = (e, k) => (e ? (e.fs * k).toFixed(1) : "—");
const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - [...String(s)].reduce((a, ch) => a + (ch.charCodeAt(0) > 255 ? 2 : 1), 0)));
console.log("");
console.log("　　　　　　　　　版型　　圖檔　　　　手機上　　　圖欄　　　　看得到　裁哪邊　一個人頭　字→圖　主標　副標　帶子　　檔案");
for (const r of rows) {
  const { c, S, m, k } = r;
  const picCss = `${(m.picW * k).toFixed(0)}×${(m.picH * k).toFixed(0)}`;
  console.log(
    pad(c.label, 20) + pad(SIZES[c.size].name, 6) + pad(`${S.w}×${S.h}`, 12) +
    pad(`${r.dispW}×${r.dispH}`, 11) + pad(picCss, 11) + pad(`${r.seen.toFixed(0)}%`, 8) +
    pad(r.cropSide, 8) + pad(`${r.headCss.toFixed(1)}px`, 10) +
    pad(r.gapCss == null ? "—" : `${r.gapCss.toFixed(1)}px`, 8) +
    pad(px(m.head ?? m.bh, k), 6) + pad(px(m.sub ?? m.bs, k), 6) +
    pad(c.bandh ? `${(c.bandh * k).toFixed(1)}px` : "—", 8) +
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
    看得到: +r.seen.toFixed(0), 裁哪邊: r.cropSide, 一個人頭: +r.headCss.toFixed(1),
    字到圖: r.gapCss == null ? null : +r.gapCss.toFixed(1),
    字欄: r.c.textw ?? null,
    主標: r.m.head ? +(r.m.head.fs * r.k).toFixed(1) : (r.m.bh ? +(r.m.bh.fs * r.k).toFixed(1) : null),
    副標: r.m.sub ? +(r.m.sub.fs * r.k).toFixed(1) : (r.m.bs ? +(r.m.bs.fs * r.k).toFixed(1) : null),
    帶子: r.c.bandh ? +(r.c.bandh * r.k).toFixed(1) : null,
    檔案KB: Math.round(r.bytes / 1024),
    檔名: { 上傳: "fangren-richmenu-2500.jpg", 選單: "shot-richmenu.jpg", 手機: "shot-richmenu-chat.jpg" },
    strip: { w: r.dispW * 3, h: Math.round((r.S.h * r.dispW * 3) / r.S.w) },
    chat: MOCK.includes(r.c.id) ? { w: PHONE_W * DSF, h: PHONE_H * DSF } : null,
  })),
}, null, 1) + "\n");
/* ⚠⚠ 改名放在最後一步（產生器內部仍然叫 final）——
 *   **要上傳到 LINE 的是 fangren-richmenu-2500.jpg**，另外兩張只是模擬圖。
 *   ⚠ 上面那一行清檔會一起清掉它們，所以重跑不會留下上一次的。 */
const FINAL = {
  "richmenu-final.jpg": "fangren-richmenu-2500.jpg",
  "strip-final.jpg":    "shot-richmenu.jpg",
  "chat-final.jpg":     "shot-richmenu-chat.jpg",
};
for (const [from, to] of Object.entries(FINAL)) {
  const a = path.join(OUT, from);
  if (!fs.existsSync(a)) throw new Error(`要改名的 ${from} 不在`);
  fs.renameSync(a, path.join(OUT, to));
}
console.log("要上傳到 LINE 的是　" + path.join(OUT, FINAL["richmenu-final.jpg"]));
console.log("");
console.log("數字寫進 drafts/line-richmenu-numbers.json");
console.log("");
