/* 貼文・位置與停車圖的規格頁守門 → node drafts/channels/check-post-map.mjs
 *
 * 擋的是「畫面看起來正常、數字卻不對」那一類（這條線每一支守門都是為了這個）：
 *  ① 頁上每一張圖 repo 裡都有，且 width/height 屬性 ＝ PNG 檔頭的真實尺寸
 *  ② ⚠⚠ 捲軸裡的圖要自己寫 inline width（line-spec 踩過：.pv-scroll img{width:auto}
 *     會蓋掉 width 屬性、讓圖退回原始像素尺寸，而每一道既有的守門都會過）
 *  ③ 「詳情」那一段和 detail.txt 逐字相同（不要有第二個真相）
 *  ④ ⚠⚠⚠ 「詳情」裡的地址、電話、三個停車場的名字與距離，
 *     要和 **index.html** 逐字相同 —— 那是這張圖唯一的出處，
 *     地圖改了而這裡沒跟上的話，圖與字會各說各話
 *  ⑤ 產出的圖沒有孤兒（產了卻沒擺上去 ＝ 有人改了頁面忘了圖）
 *  ⑥ 三道 noindex、零 JS、沒有根目錄絕對路徑（舊站 yclee86.github.io 會壞）
 *  ⑦ 紅線：這個帳號沒有專人即時回覆（第十一之三節）
 *  ⑧ 八個寬度水平溢出 0、圖都載得到、死錨 0
 *
 * ⚠ 紅線與逐字比對一律**只掃「真的要貼出去的那一段」**（detail.txt），不掃整頁 ——
 *   這條線每一份檔案都把說明寫在資料旁邊，掃整頁一定會撞到自己的說明
 *   （check-cancel 掃 emoji 撞到 _說明 的 ⚠，同一件事）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR  = path.join(ROOT, "preview", "line-post-map");
const PAGE = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

/* PNG 的真實尺寸（IHDR，第 16~24 個位元組） */
const pngSize = (f) => {
  const b = fs.readFileSync(f);
  if (b.toString("ascii", 1, 4) !== "PNG") throw new Error(`${f} 不是 PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

/* ---- ① 圖都在，而且尺寸對得上 ---- */
const imgs = [...PAGE.matchAll(/<img\s+src="([^"]+)"\s+width="(\d+)"\s+height="(\d+)"([^>]*)>/g)]
  .map(m => ({ src: m[1], w: +m[2], h: +m[3], rest: m[4] }));
ok(imgs.length === 10, `頁上有 ${imgs.length} 張圖，應該是 10`);
const used = new Set();
for (const im of imgs) {
  const f = path.join(DIR, im.src);
  if (!fs.existsSync(f)) { bad.push(`圖不存在：${im.src}`); continue; }
  used.add(im.src);
  const s = pngSize(f);
  ok(s.w === im.w && s.h === im.h,
    `${im.src} 屬性寫 ${im.w}×${im.h}，實檔是 ${s.w}×${s.h}`);
  ok(/alt="[^"]+"/.test(im.rest), `${im.src} 沒有 alt`);
  /* 成品一律 1080 見方；模擬圖不在此限 */
  if (im.src.startsWith("post-map-"))
    ok(s.w === 1080 && s.h === 1080, `${im.src} 不是 1080×1080（是 ${s.w}×${s.h}）`);
}

/* ---- ② 捲軸裡的圖（現在沒有捲軸，這一道留著，日後加了就會生效） ---- */
const scroll = PAGE.includes('class="pv-scroll"')
  ? PAGE.slice(PAGE.indexOf('<div class="pv-scroll">'),
               PAGE.indexOf("</div>", PAGE.indexOf('<div class="pv-scroll">'))) : "";
for (const tag of [...scroll.matchAll(/<img\s+src="([^"]+)"[^>]*>/g)].map(m => m[0]))
  ok(/style="width:\d+px"/.test(tag),
    `捲軸裡有一張沒寫 inline width（會退回原始像素尺寸）：${tag.slice(0, 60)}`);
ok(!/\.pv-scroll\s+img\s*\{[^}]*width:\s*auto/.test(PAGE),
  "樣式表出現 .pv-scroll img{width:auto} —— 那會讓捲軸裡的圖畫成 1080px");

/* ---- ③ 「詳情」那一段和 detail.txt 逐字相同 ---- */
const detail = fs.readFileSync(path.join(DIR, "detail.txt"), "utf8").trimEnd();
const onPage = (PAGE.match(/<div class="pv-txt">([\s\S]*?)<\/div>/) || [])[1];
ok(onPage !== undefined, "頁上找不到「詳情」那一塊");
if (onPage !== undefined)
  ok(onPage.trim() === detail,
    `「詳情」和 detail.txt 對不上：\n    頁面 ${JSON.stringify(onPage.trim())}\n    檔案 ${JSON.stringify(detail)}`);

/* ---- ④ 「詳情」裡的每一個事實都要在 index.html 上找得到 ---- */
const ADDR = (SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/) || [])[1];
ok(ADDR, "index.html 裡讀不到頁尾那一行地址");
if (ADDR) ok(detail.includes(ADDR.replace(/&nbsp;/g, " ")),
  `「詳情」裡的地址和 index.html 對不上（站上是 ${ADDR.replace(/&nbsp;/g, " ")}）`);
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
ok(PHONE && detail.includes(PHONE), `「詳情」裡的電話和 index.html 對不上（站上是 ${PHONE}）`);
const lots = [...SRC.matchAll(
  /<text class="rl-nm"[^>]*>([^<]+)<\/text>[\s\S]{0,400}?<text class="rl-d"[^>]*>([^<]+)<\/text>/g)]
  .map(m => [m[1].trim(), m[2].trim()]);
ok(lots.length === 3, `index.html 的地圖上讀到 ${lots.length} 個停車場，應該是 3`);
for (const [nm, d] of lots)
  ok(detail.includes(`${nm} ${d}`),
    `「詳情」裡少了或寫錯了：${nm} ${d}（那是 index.html 地圖上的字）`);

/* ---- ⑤ 產出的圖沒有孤兒 ---- */
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".png")))
  ok(used.has(f), `圖產了卻沒有擺上頁面：${f}`);

/* ---- ⑥ noindex／零 JS／相對路徑 ---- */
ok(/name="robots" content="noindex, nofollow, noarchive"/.test(PAGE), "少了 noindex");
ok(!/<script/i.test(PAGE), "這一頁刻意零 JS，不要放 script");
ok(!/(?:src|href)="\/(?!\/)/.test(PAGE), "出現根目錄絕對路徑（舊站 yclee86.github.io 會壞）");

/* ---- ⑦ 紅線 ---- */
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  ok(!re.test(detail), `「詳情」踩到紅線（這個帳號沒有專人即時回覆）：${re}`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 靜態檢查通過（圖 ${imgs.length} 張、詳情逐字相同、三個停車場對得上 index.html）`);

/* ---- ⑧ 量：八個寬度水平溢出 0、圖都載得到、死錨 0 ---- */
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
const page = await browser.newPage();
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.goto("file://" + path.join(DIR, "index.html"), { waitUntil: "load" });
  /* ⚠ 畫面外的是 lazy，不先催它們，「有圖載不到」是量測的誤報不是頁面壞 */
  await page.evaluate(async () => {
    for (const i of document.images) i.loading = "eager";
    await Promise.all([...document.images].map(i =>
      i.complete && i.naturalWidth ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  const r = await page.evaluate((vw) => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
    dead: [...document.querySelectorAll('a[href^="#"]')]
      .filter(a => !document.querySelector(a.getAttribute("href"))).map(a => a.getAttribute("href")),
    /* ⚠ 量的是「畫出來多寬」（rect），不是 width 屬性 */
    wide: [...document.images].filter(i => i.getBoundingClientRect().width > vw)
      .map(i => `${i.src.split("/").pop()} ${i.getBoundingClientRect().width.toFixed(0)}px`)
  }), w);
  ok(r.over <= 0, `${w}px 水平溢出 ${r.over}px`);
  ok(!r.broken.length, `${w}px 有 ${r.broken.length} 張圖載不到`);
  ok(!r.dead.length, `${w}px 死錨：${r.dead}`);
  ok(!r.wide.length, `${w}px 有圖畫得比一屏還寬：${r.wide}`);
}
await browser.close();
ok(!errs.length, `JS 錯誤 ${errs.length} 個`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 八個寬度：水平溢出 0、圖全部載得到、死錨 0、JS 錯誤 0`);
