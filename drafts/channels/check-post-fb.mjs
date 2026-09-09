/* 臉書版那三張貼文圖的守門
 *   node drafts/channels/check-post-fb.mjs
 *
 * 擋的是這一輪特有的幾種「畫面正常、數字也對，只有把圖打開看才看得出來」：
 *   ⑦ 產生器把「跑完用預設值再跑一次」那一步刪掉 —— repo 裡那三張 LINE 的成品
 *      會停在臉書版的浮水印上，**三格拼起來就接不成一顆圓，而且看起來很正常**。
 *   ⑨ 因此不是只讀原始碼，是**真的去解那六張 PNG**：
 *      ⓐ 同一格的 LINE 版與臉書版**不可以逐位元組相同**（相同 ＝ 還原那一步沒有跑）
 *      ⓑ 那一層淡墨的**重心**要落在該版本的幾何算出來的位置（±100px）
 *   ③ 三段文字一個字都不重打 —— 逐字對那一則自己的 .txt。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { wmFor, TRI, FB, fbWidth, shapeRatio } from "./wm-triptych.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR  = path.join(ROOT, "preview", "fb-post");
const GEN  = path.join(ROOT, "drafts", "channels", "post-fb.mjs");
const page = fs.readFileSync(path.join(DIR, "index.html"), "utf8");

const bad = [];
const ok = (c, m) => { if (!c) bad.push(m); };

/* ---------- PNG（8-bit、非交錯；容器裡沒有 PIL） ---------- */
function decode(buf) {
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[buf.readUInt8(25)];
  if (buf.readUInt8(24) !== 8 || !ch) throw new Error("只認得 8-bit 的 PNG");
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
  return { w, h, ch, px };
}
/* 那一層淡墨的重心。⚠ **不要比對某一個色階的精確值** —— 4% 與 5% 合成出來的
   RGB 只差一階，而 Chromium 的進位在不同版面上不一定一樣。改成「比卡色暗一點點、
   而且三個通道還維持卡色那個中性關係」的一段區間，兩種濃度都收得進來。 */
function wmCentroid(file) {
  const d = decode(fs.readFileSync(file));
  let n = 0, sx = 0, sy = 0;
  for (let y = 0; y < d.h; y++) for (let x = 0; x < d.w; x++) {
    const i = (y * d.w + x) * d.ch, r = d.px[i], g = d.px[i + 1], b = d.px[i + 2];
    if (r >= 232 && r <= 242 && Math.abs(r - g) <= 1 && b >= r && b - r <= 2) { n++; sx += x; sy += y; }
  }
  return n ? { n, x: sx / n, y: sy / n } : { n: 0, x: NaN, y: NaN };
}
/* 幾何上那一顆被畫布裁掉之後的中心 —— 拿它去對量到的重心 */
/* 一小塊圓盤裡有多少比例是那一層淡墨 —— 拿來驗「牙洞真的是挖穿的」。
   洞的位置本身是幾何算的，這一道是去 PNG 上確認它真的畫成一個洞
   （洞裡沒有墨、旁邊那一塊形狀有）。 */
function tintAt(d, cx, cy, rr) {
  let n = 0, t = 0;
  for (let y = Math.round(cy - rr); y <= cy + rr; y++)
    for (let x = Math.round(cx - rr); x <= cx + rr; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > rr * rr) continue;
      if (x < 0 || y < 0 || x >= d.w || y >= d.h) continue;
      n++;
      const i = (y * d.w + x) * d.ch, r = d.px[i], g = d.px[i + 1], b = d.px[i + 2];
      if (r >= 232 && r <= 242 && Math.abs(r - g) <= 1 && b >= r && b - r <= 2) t++;
    }
  return n ? t / n : NaN;
}
function wmCenter(gm) {
  const C = TRI.CANVAS;
  const x0 = Math.max(0, gm.left), x1 = Math.min(C, gm.left + gm.w);
  const y0 = Math.max(0, gm.top),  y1 = Math.min(C, gm.top + gm.h);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
}
const size = f => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), n: b.length }; };

const TILES = [
  ["hours", "line-post-hours", "fangren-hours-1080.png"],
  ["docs",  "line-post-docs",  "fangren-docs-1080.png"],
  ["map",   "line-post-map",   "fangren-map-1080.png"],
];
const fbFile = k => path.join(DIR, `fangren-fb-${k}-1080.png`);

/* ---------- ① 頁上每一張圖 ---------- */
const imgs = [...page.matchAll(/<img src="([^"]+)" width="(\d+)" height="(\d+)"/g)];
ok(imgs.length >= 13, `頁上只有 ${imgs.length} 張圖，太少了`);
const used = new Set();
for (const [, src, w, h] of imgs) {
  const f = path.join(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`頁上引用的 ${src} 不在`); continue; }
  used.add(src);
  const d = size(f);
  /* ⚠ 這一頁的圖是**縮下來擺的**，所以比對的是長寬比不是尺寸 ——
     比錯的話一張被壓扁的圖照樣會過。 */
  const want = Math.round(d.h * (+w) / d.w);
  ok(Math.abs(want - +h) <= 1, `${src} 的 height=${h} 對不上長寬比（應該是 ${want}）`);
  ok(/alt="[^"]+"/.test(page.slice(page.indexOf(src))), `${src} 沒有 alt`);
}

/* ---------- ② 沒有孤兒檔 ---------- */
for (const f of fs.readdirSync(DIR)) {
  if (f === "index.html" || f.endsWith(".txt")) continue;
  ok(used.has(f), `${f} 沒有被頁面引用（孤兒檔）`);
}

/* ---------- ③ 三段文字逐字 ＝ 那一則自己的 .txt ---------- */
const SRC = {
  hours: ["preview", "line-post-hours", "detail.txt"],
  docs:  ["preview", "line-post-docs", "detail.txt"],
  map:   ["preview", "line-post-map", "door-detail.txt"],
};
const pres = [...page.matchAll(/<pre>([\s\S]*?)<\/pre>/g)].map(m =>
  m[1].replace(/&lt;/g, "<").replace(/&amp;/g, "&").trim());
/* ⚠⚠ 2026-09-09 起最後面可以接一行 hashtag（只加在臉書這一份）——
   所以比對的是**本文**，標籤那一行另外驗。
   ⚠ 分法：最後一行**整行每一段都以 # 開頭**才算標籤，其餘一律算本文 ——
   這樣「本文最後一行剛好有個 #」不會被誤吃掉。 */
const TAG_RED = /推薦|最好|最佳|第一|唯一|保證|無痛|免費|優惠|便宜|權威|名醫|首選/;
const splitTags = (s0) => {
  const s = s0.trim();               /* ⚠ 先 trim —— 檔案結尾那個換行會讓最後一行是空的 */
  const lines = s.split("\n");
  const last = lines[lines.length - 1].trim();
  if (!last || !last.split(/\s+/).every(w => /^#\S+$/.test(w))) return { body: s.trim(), tags: [] };
  return { body: lines.slice(0, -1).join("\n").trim(), tags: last.split(/\s+/).map(w => w.slice(1)) };
};
for (const [k, rel] of Object.entries(SRC)) {
  const want = fs.readFileSync(path.join(ROOT, ...rel), "utf8").trim();
  ok(pres.some(p => splitTags(p).body === want),
    `${k} 那一段的文字和 ${rel.join("/")} 不一樣 —— 有人重打了`);
  const mine = splitTags(fs.readFileSync(path.join(DIR, `detail-${k}.txt`), "utf8"));
  ok(mine.body === want, `detail-${k}.txt 的本文和 ${rel.join("/")} 不一樣`);
  /* 標籤那一行（沒有就跳過 ＝ Ⓐ 不加） */
  if (!mine.tags.length) continue;
  ok(mine.tags.length <= 3, `detail-${k}.txt 的標籤有 ${mine.tags.length} 個，上限 3`);
  ok(mine.tags[0] === "芳仁牙醫診所",
    `detail-${k}.txt 的第一個標籤是「#${mine.tags[0]}」——` +
    `品牌那一個是唯一不會把人送走的，它一定要在`);
  for (const g of mine.tags) {
    ok(!TAG_RED.test(g), `標籤「#${g}」踩到紅線（評價性／招徠性的字）`);
    ok(!/[・－—、，。･]/.test(g), `標籤「#${g}」裡有符號，臉書會把它截斷`);
  }
}
/* ⚠ 產生器裡那道紅線掃描不可以被拿掉（拿掉之後畫面照樣正常） */
{
  const src = fs.readFileSync(GEN, "utf8");
  ok(/const TAG_RED\s*=/.test(src) && /FB_TAGS/.test(src),
    "post-fb.mjs 少了 TAG_RED 或 FB_TAGS —— 標籤那道守門被拿掉了");
}

/* ---------- ④ 要上傳的那三張 ---------- */
for (const [k] of TILES) {
  const f = fbFile(k);
  ok(fs.existsSync(f), `少了 fangren-fb-${k}-1080.png`);
  if (!fs.existsSync(f)) continue;
  const d = size(f);
  ok(d.w === 1080 && d.h === 1080, `fangren-fb-${k}-1080.png 是 ${d.w}×${d.h}，應該是 1080 見方`);
  ok(d.n <= 8 * 1024 * 1024, `fangren-fb-${k}-1080.png ${(d.n / 1048576).toFixed(1)}MB 超過臉書的 8MB`);
}

/* ---------- ⑤ 紅線 ---------- */
/* ⚠⚠ 臉書**有留言區**（LINE 主頁那個模組沒有），而這個帳號沒有專人回覆 ——
   第十一之三節那條在這裡回來了。
   ⚠ 這條線每一份檔案都把「為什麼不可以寫」寫在資料旁邊，所以掃字一定會撞到自己的
   說明（check-spec、check-cancel、check-review 都踩過同一件）。說明那一段用
   data-red 標起來、掃之前先剝掉，而**剝掉的那一段本身要驗它還在**，
   不然把標記亂加一通就等於把守門關掉。 */
const red = [...page.matchAll(/<span data-red>[\s\S]*?<\/span>/g)];
ok(red.length === 1, `data-red 那一段應該剛好一段，實際 ${red.length} 段`);
ok(red.length === 1 && /不可以寫/.test(red[0][0]), "data-red 標在不是紅線說明的地方");
const body = page.replace(/[\s\S]*?<h1>/, "").replace(/<span data-red>[\s\S]*?<\/span>/g, "");
for (const re of [/隨時(問|詢問|聯絡)/, /有問題.{0,6}(問|留言|私訊)/,
                  /(留言|私訊).{0,4}(問我們|詢問|告訴我們)/, /即時回(覆|應)/, /小編/])
  ok(!re.test(body), `頁面踩到紅線：${re}`);

/* ---------- ⑥ noindex ／ 零 JS ---------- */
ok(/name="robots" content="noindex/.test(page), "少了 noindex");
ok(!/<script/.test(page), "這一頁不該有 <script>");

/* ---------- ⑦ 產生器：浮水印只有一個出處、而且真的會還原 ---------- */
const gen = fs.readFileSync(GEN, "utf8");
ok(/from "\.\/wm-triptych\.mjs"/.test(gen),
  "post-fb.mjs 沒有 import wm-triptych.mjs —— 浮水印不可以在這裡自己算一份");
ok(/for \(const t of TILES\) run\(t\.gen, \{\}\);/.test(gen),
  "post-fb.mjs 少了「跑完用預設值再跑一次」那一步 —— repo 裡的 LINE 成品會停在臉書版的浮水印上");

/* ---------- ⑧ 臉書版那一組值 ＝ 他 2026-09-08 挑定的那一組 ---------- */
/* ⚠ 門診表與科別醫師那兩顆一個值都不可以改（那是他挑的）；地圖那一顆是尺，
   只驗「不可以和另外兩顆一樣」—— 他要的正是「不一樣」。 */
ok(FB.hours.shape === "r3c1" && FB.hours.opacity === .05
   && FB.hours.cutX === 60 && FB.hours.cutY === 50,
  "門診表那顆浮水印不是 2026-09-08 挑定的那一組（r3c1・5%・切 60×50）");
/* ⚠ 科別醫師 2026-09-09 從壓左上搬到右下，**切掉的量沒有變**（仍然是他挑的 440）——
   換的只有壓哪一角，以及跟著搬過去非做不可的那個 180°。 */
ok(FB.docs.shape === "r1c2" && FB.docs.opacity === .04 && FB.docs.cutX === 440,
  "科別醫師那顆浮水印不是 2026-09-08 挑定的那一組（r1c2・4%・切 440）");
ok(FB.docs.pos === "br", "科別醫師那顆應該壓右下（2026-09-09 使用者指定）");
ok(FB.map.pos === "tl", "地圖那顆應該壓左上");
ok(FB.map.shape !== FB.hours.shape && FB.map.shape !== FB.docs.shape,
  `地圖那顆是 ${FB.map.shape}，和另外兩張撞了 —— 使用者指定要「不一樣的」`);
ok(fbWidth("r3c1") === 660, "等重換算的基準跑掉了（r3c1 應該畫 660）");
/* ⚠⚠⚠ 牙洞一定要看得到（2026-09-09 使用者：「logo 原本的牙洞在左上　這裡看不到了」）。
   牙洞是這顆標誌唯一的識別特徵，切掉之後剩下的只是一團圓角形狀 ——
   而**切掉牙洞不會讓任何一道尺寸守門翻臉**，圖看起來仍然很正常。
   ⚠ 這裡驗兩件：① 幾何算出來的洞心要落在畫布裡（離邊 ≥8px）
   ② 那個位置在 PNG 上**沒有被淡墨染到**、而它旁邊的形狀有 ＝ 洞真的是挖穿的。 */
for (const [k] of TILES) {
  const gm = wmFor(k, { mode: "fb" });
  const C = TRI.CANVAS, M = 8;
  ok(Number.isFinite(gm.hole.x) && Number.isFinite(gm.hole.y),
    `${k}：wm-triptych.mjs 的 HOLE 表裡沒有 ${gm.shape} 的牙洞位置`);
  /* ⚠ 只有宣告 `hole: "show"` 的那幾格才要求看得到 —— 科別醫師那一張是
     `cut`，因為使用者 2026-09-09 說「不要轉　牙洞不要出來沒關係」。 */
  if (gm.holeMode === "show")
    ok(gm.hole.x >= M && gm.hole.x <= C - M && gm.hole.y >= M && gm.hole.y <= C - M,
      `${k} 的牙洞落在畫布外面 (${gm.hole.x}, ${gm.hole.y}) —— 被切掉了`);
}
/* ⚠⚠ 科別醫師那一張**不可以再轉回去**（2026-09-09 使用者指定不轉）——
   轉回去畫面照樣正常、每一道尺寸守門都會過，只有把圖打開看才看得出標誌是倒的。 */
{
  const g = wmFor("docs", { mode: "fb" });
  ok(!g.flipX && !g.flipY, "科別醫師那顆浮水印又被轉了 —— 使用者指定不轉");
  ok(FB.docs.hole === "cut", "FB.docs 少了 hole: \"cut\" —— 牙洞那道守門會誤擋這一張");
}
/* ⚠ 三張成品的長寬比一定要對得上那顆形狀的 viewBox（不可以被壓扁） */
for (const [k] of TILES) {
  const g = wmFor(k, { mode: "fb" });
  ok(Math.abs(g.w / g.h - shapeRatio(g.shape)) < .01,
    `${k} 的浮水印被壓扁了：${g.w}×${g.h}`);
}

/* ---------- ⑨ 讀真的畫出來的像素 ---------- */
/* ⚠⚠⚠ ⓐ 是這一支最強的一道：同一格的兩張**逐位元組相同**就代表
   「跑完用預設值再跑一次」那一步沒有真的還原（⑦ 只讀得到原始碼寫著它）。 */
for (const [k, dir, file] of TILES) {
  const lineF = path.join(ROOT, "preview", dir, file), fbF = fbFile(k);
  if (!fs.existsSync(lineF) || !fs.existsSync(fbF)) continue;
  ok(!fs.readFileSync(lineF).equals(fs.readFileSync(fbF)),
    `${k}：LINE 那張和臉書那張逐位元組相同 —— 還原那一步沒有跑`
    + "（跑一次 node drafts/channels/post-fb.mjs 會自己還原）");
  /* ⓑ 淡墨那一層的重心，要落在各自的幾何算出來的位置。
     ⚠ 容差 100px：那幾顆形狀都不填滿自己的外框（牙洞、圓角），
       重心本來就不會剛好在框的正中央。 */
  for (const [f, gm, nm] of [[fbF, wmFor(k, { mode: "fb" }), "臉書版"],
                             [lineF, wmFor(k, { mode: "tri" }), "LINE 版"]]) {
    const c = wmCentroid(f), want = wmCenter(gm);
    ok(c.n > 20000, `${nm} ${k} 幾乎量不到浮水印（只有 ${c.n} 個像素）`);
    if (c.n > 20000)
      ok(Math.abs(c.x - want.x) <= 100 && Math.abs(c.y - want.y) <= 100,
        `${nm} ${k} 的浮水印重心 (${c.x.toFixed(0)}, ${c.y.toFixed(0)})`
        + ` 對不上幾何算出來的 (${want.x.toFixed(0)}, ${want.y.toFixed(0)})`);
  }
  /* ⓒ 牙洞在 PNG 上真的是一個洞：洞心那一小塊沒有淡墨，
     而從洞心往形狀中心走 13% 的地方有。⚠ 兩件都要 —— 只驗「洞心沒有墨」的話，
     整顆浮水印沒畫出來也會通過。 */
  const gm = wmFor(k, { mode: "fb" });
  /* ⚠ 宣告 `cut` 的那一格、或洞已經在畫布外面的，這裡不量 —— 量了會回一堆 NaN，
     把真正的那一句訊息淹掉。 */
  if (gm.holeMode !== "show") continue;
  if (gm.hole.x < 0 || gm.hole.x >= TRI.CANVAS
   || gm.hole.y < 0 || gm.hole.y >= TRI.CANVAS) continue;
  const d = decode(fs.readFileSync(fbF));
  const cx = gm.left + gm.w / 2, cy = gm.top + gm.h / 2;
  const dx = cx - gm.hole.x, dy = cy - gm.hole.y, L = Math.hypot(dx, dy) || 1;
  const rx = gm.hole.x + dx / L * gm.w * .13, ry = gm.hole.y + dy / L * gm.w * .13;
  const inHole = tintAt(d, gm.hole.x, gm.hole.y, 6), inInk = tintAt(d, rx, ry, 6);
  ok(inInk > .6, `${k}：牙洞旁邊那一塊量不到浮水印（只有 ${(inInk * 100).toFixed(0)}%）`
    + " —— 浮水印可能根本沒畫出來，或洞的位置算錯了");
  ok(inHole < .2, `${k}：牙洞的位置被墨填滿了（${(inHole * 100).toFixed(0)}%）`
    + " —— 翻轉大概只翻了外框、洞落到形狀外面去了");
}

/* ---------- ⑩ 八個寬度：水平溢出 0、圖都載得到、死錨 0 ---------- */
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
const pg = await browser.newPage();
const errs = [];
pg.on("pageerror", e => errs.push(String(e)));
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  await pg.setViewportSize({ width: w, height: 800 });
  await pg.goto("file://" + path.join(DIR, "index.html"), { waitUntil: "load" });
  /* ⚠ 畫面外的 lazy 圖永遠不會開始載，「等它載完」的 Promise 會永遠不 resolve
     —— 先催成 eager，而且只等「結束」不等「成功」（同 check-richmenu 那一輪）。 */
  await pg.evaluate(async () => {
    for (const i of document.images) i.loading = "eager";
    await Promise.all([...document.images].map(i =>
      i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  const r = await pg.evaluate(() => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
    dead: [...document.querySelectorAll('a[href^="#"]')]
      .filter(a => !document.querySelector(a.getAttribute("href"))).map(a => a.getAttribute("href")),
  }));
  ok(r.over <= 0, `${w}px 水平溢出 ${r.over}px`);
  ok(!r.broken.length, `${w}px 有 ${r.broken.length} 張圖載不到`);
  ok(!r.dead.length, `${w}px 死錨：${r.dead}`);
}
await browser.close();
ok(!errs.length, `JS 錯誤 ${errs.length} 個`);

if (bad.length) { console.error("✗ " + bad.join("\n✗ ")); process.exit(1); }
console.log(`✓ 臉書版三張貼文圖：${imgs.length} 張圖、三段文字逐字對得上、`
  + "門診表與科別醫師那兩顆浮水印 ＝ 他挑定的那一組、地圖那顆和兩張都不一樣");
console.log("✓ 像素：兩個版本沒有互相蓋掉，六張的浮水印重心都對得上各自的幾何");
console.log("✓ 八個寬度：水平溢出 0、圖全部載得到、死錨 0、紅線 0、零 JS");
