/* 臉書版那三張貼文圖的守門
 *   node drafts/channels/check-post-fb.mjs
 *
 * 擋的是這一輪特有的幾種「畫面正常、數字也對，只有把圖打開看才看得出來」：
 *   ⑦ 產生器把「跑完用預設值再跑一次」那一步刪掉 —— repo 裡那三張 LINE 的成品
 *      會停在臉書版的浮水印上，**三格拼起來就接不成一顆圓，而且看起來很正常**。
 *   ⑨ 因此不是只驗產生器的原始碼，是**真的去讀那四張 PNG 的角落像素**：
 *      臉書版的角落應該是乾淨的卡片色（整顆標誌都在畫布裡），
 *      LINE 版的同一個角落應該是被浮水印染過的（那一顆是切出去的）。
 *   ③ 三段文字一個字都不重打 —— 逐字對那一則自己的 .txt。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

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
const lum = (f, x, y) => { const d = decode(fs.readFileSync(f)); return d.px[(y * d.w + x) * d.ch]; };
const size = f => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), n: b.length }; };

/* ---------- ① 頁上每一張圖 ---------- */
const imgs = [...page.matchAll(/<img src="([^"]+)" width="(\d+)" height="(\d+)"/g)];
ok(imgs.length >= 12, `頁上只有 ${imgs.length} 張圖，太少了`);
const used = new Set();
for (const [, src, w, h] of imgs) {
  const f = path.join(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`頁上引用的 ${src} 不在`); continue; }
  used.add(src);
  const d = size(f);
  /* ⚠ 這一頁的圖是**縮下來擺的**（不是照實際像素），所以比對的是長寬比不是尺寸 ——
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
for (const [k, rel] of Object.entries(SRC)) {
  const want = fs.readFileSync(path.join(ROOT, ...rel), "utf8").trim();
  ok(pres.some(p => p === want), `${k} 那一段的文字和 ${rel.join("/")} 不一樣 —— 有人重打了`);
  const mine = fs.readFileSync(path.join(DIR, `detail-${k}.txt`), "utf8").trim();
  ok(mine === want, `detail-${k}.txt 和 ${rel.join("/")} 不一樣`);
}

/* ---------- ④ 要上傳的那三張 ---------- */
for (const k of ["hours", "docs", "map"]) {
  const f = path.join(DIR, `fangren-fb-${k}-1080.png`);
  ok(fs.existsSync(f), `少了 fangren-fb-${k}-1080.png`);
  if (!fs.existsSync(f)) continue;
  const d = size(f);
  ok(d.w === 1080 && d.h === 1080, `fangren-fb-${k}-1080.png 是 ${d.w}×${d.h}，應該是 1080 見方`);
  ok(d.n <= 8 * 1024 * 1024, `fangren-fb-${k}-1080.png ${(d.n / 1048576).toFixed(1)}MB 超過臉書的 8MB`);
}

/* ---------- ⑤ 紅線 ---------- */
/* ⚠⚠ 臉書**有留言區**（LINE 主頁那個模組沒有），而這個帳號沒有專人回覆 ——
   第十一之三節那條在這裡回來了。 */
/* ⚠⚠ 這條線每一份檔案都把「為什麼不可以寫」寫在資料旁邊，所以掃字一定會撞到自己的
   說明（check-spec、check-cancel、check-review 都踩過同一件）。
   說明那一段用 data-red 標起來，掃之前先剝掉 —— 而**剝掉的那一段本身要驗它還在**，
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

/* ---------- ⑧ 那把尺挑定的直徑 ---------- */
const tri = fs.readFileSync(path.join(ROOT, "drafts", "channels", "wm-triptych.mjs"), "utf8");
ok(/DIA: \+\(process\.env\.WM_SOLO_DIA \|\| 656\)/.test(tri),
  "wm-triptych.mjs 的臉書版直徑不是 656");
ok(/DIA: \+\(process\.env\.WM_DIA \|\| 500\)/.test(tri),
  "wm-triptych.mjs 的三格版直徑不是 500 —— 2026-09-09 定案那一格");

/* ---------- ⑨ 角落像素：臉書版整顆在畫布裡、LINE 版仍然是切出去的那一顆 ---------- */
/* ⚠⚠⚠ 這一道是這一支最重要的：⑦ 只讀原始碼，⑨ 讀的是真的畫出來的東西。
   科別醫師的標誌在右上、地圖的在左上 —— 臉書版**貼著邊但不越界**，
   所以那個角落是乾淨的卡片色（244）；三格版是切出去的，同一個角落被染成 235。 */
const CARD = 244, TINT = 240;
const CORNERS = [
  ["docs", 1075, 4, "右上"],
  ["map", 4, 4, "左上"],
];
for (const [k, x, y, nm] of CORNERS) {
  const fb = lum(path.join(DIR, `fangren-fb-${k}-1080.png`), x, y);
  ok(fb >= CARD - 1, `臉書版 ${k} 的${nm}角量到 ${fb}，應該是乾淨的卡片色 ——`
    + " 標誌切出畫布了（臉書版整顆都要在裡面）");
  const dir = k === "docs" ? "line-post-docs" : "line-post-map";
  const line = lum(path.join(ROOT, "preview", dir, `fangren-${k}-1080.png`), x, y);
  ok(line <= TINT, `LINE 那張 ${k} 的${nm}角量到 ${line}，沒有被浮水印染到 ——`
    + " repo 裡留下的是臉書版的浮水印，三格拼不成一顆圓（跑一次 post-fb.mjs 會自己還原）");
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
     —— 先催成 eager（同 check-richmenu 那一輪）。 */
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
  + "角落像素證明兩個版本沒有互相蓋掉、紅線 0、零 JS");
console.log("✓ 八個寬度：水平溢出 0、圖全部載得到、死錨 0");
