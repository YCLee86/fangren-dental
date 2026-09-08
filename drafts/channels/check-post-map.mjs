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
import { execFileSync } from "node:child_process";
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
ok(imgs.length === 41, `頁上有 ${imgs.length} 張圖，應該是 41`);
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
  if (/^(post-map-|door-(c|c110|c130|c130-nsb|c130-nsd|c130-m1|c130-m2|c130-m4|c130-w0|c130-w1|c130-w2|c130-w4|c130-wbr|c130-l1|c130-l2|c130-l3|c130-l4|c145|c160|c-title|c-qr|a|b|noqr|qr140|north)\.png)/.test(im.src))
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

/* ---- ③ 兩塊「詳情」各自和它的 .txt 逐字相同 ----
   第一塊 ＝ 門口那張告示的版本（door-detail.txt），第二塊 ＝ 站上那張地圖的版本（detail.txt）。 */
const txts = [...PAGE.matchAll(/<div class="pv-txt">([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
ok(txts.length === 2, `頁上有 ${txts.length} 塊「詳情」，應該是 2`);
const doorDetail = fs.readFileSync(path.join(DIR, "door-detail.txt"), "utf8").trimEnd();
const detail = fs.readFileSync(path.join(DIR, "detail.txt"), "utf8").trimEnd();
for (const [i, want, nm] of [[0, doorDetail, "door-detail.txt"], [1, detail, "detail.txt"]])
  if (txts[i] !== undefined) ok(txts[i] === want,
    `第 ${i + 1} 塊「詳情」和 ${nm} 對不上：\n    頁面 ${JSON.stringify(txts[i])}\n    檔案 ${JSON.stringify(want)}`);

/* ---- ④ 「詳情」裡的每一個事實都要在原始出處上找得到 ---- */
const ADDR = (SRC.match(/<span class="txt">(雲林縣[^<]+)<\/span>/) || [])[1];
ok(ADDR, "index.html 裡讀不到頁尾那一行地址");
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
for (const [d, nm] of [[doorDetail, "door-detail.txt"], [detail, "detail.txt"]]) {
  if (ADDR) ok(d.includes(ADDR.replace(/&nbsp;/g, " ")), `${nm} 裡的地址和 index.html 對不上`);
  ok(PHONE && d.includes(PHONE), `${nm} 裡的電話和 index.html 對不上（站上是 ${PHONE}）`);
}
/* 站上那一版：三個停車場的名字與距離逐字 ＝ index.html 地圖上的字 */
const lots = [...SRC.matchAll(
  /<text class="rl-nm"[^>]*>([^<]+)<\/text>[\s\S]{0,400}?<text class="rl-d"[^>]*>([^<]+)<\/text>/g)]
  .map(m => [m[1].trim(), m[2].trim()]);
ok(lots.length === 3, `index.html 的地圖上讀到 ${lots.length} 個停車場，應該是 3`);
for (const [nm, d] of lots)
  ok(detail.includes(`${nm} ${d}`), `detail.txt 裡少了或寫錯了：${nm} ${d}`);
/* ⚠⚠ 門口那一版：提醒逐字 ＝ drafts/door-notice/body.html（使用者 2026-08-23
   一句一句定的），三條網址逐字 ＝ index.html 那三個 .rl-link。
   兩邊都不可以在這一頁上被改掉 —— 改了就是第二個真相。
   ⚠⚠⚠ 2026-09-08 使用者指定拿掉前兩句（紅線／開單），所以這裡要驗三件：
     ① 門口那張本人仍然是四句（**沒有被我們改到**）
     ② 拿掉的那兩句真的含著「紅線」「開單」、留下來的兩句真的沒有
     ③ 頁上「拿掉的是這兩句」那一塊逐字 ＝ 被拿掉的那兩句 */
const BODY = fs.readFileSync(path.join(ROOT, "drafts", "door-notice", "body.html"), "utf8");
const pts = [...BODY.matchAll(/<li>([\s\S]*?)<\/li>/g)]
  .map(m => m[1].replace(/<[^>]+>/g, "").trim());
ok(pts.length === 4, `門口那張告示讀到 ${pts.length} 條提醒，應該是 4（那張紙本身不該被動到）`);
const CUT = pts.slice(0, 2), KEEP = pts.slice(2);
const fine = (t) => /紅線|開單/.test(t);
ok(CUT.every(fine), `要拿掉的那兩句裡有不是「紅線／開單」的：${CUT.join("／")}`);
ok(KEEP.every(t => !fine(t)), `留下來的句子裡還有「紅線／開單」：${KEEP.join("／")}`);
for (const t of KEEP) ok(doorDetail.includes(t), `door-detail.txt 少了門口那張的一句：${t}`);
for (const t of CUT) ok(!doorDetail.includes(t),
  `door-detail.txt 裡還留著已經從圖上拿掉的那一句（圖與字會各說各話）：${t}`);
const cut = (PAGE.match(/<div class="pv-cut">([\s\S]*?)<\/div>/) || [])[1];
ok(cut !== undefined, "頁上找不到「拿掉的是這兩句」那一塊");
if (cut !== undefined) ok(cut.trim() === CUT.join("\n"),
  `「拿掉的是這兩句」和 body.html 對不上：\n    頁面 ${JSON.stringify(cut.trim())}`
  + `\n    檔案 ${JSON.stringify(CUT.join("\n"))}`);
const hrefs = [...SRC.matchAll(/<a class="rl-link" href="([^"]+)"/g)].map(m => m[1]);
ok(hrefs.length === 3, `index.html 讀到 ${hrefs.length} 條停車場連結`);
for (const u of hrefs) ok(doorDetail.includes(u), `door-detail.txt 少了一條網址：${u}`);
/* 門口那一版的號碼牌順序（P1 190m／P2 140m／P3 50m，刻意不是照距離） */
const order = [...doorDetail.matchAll(/^(P\d) .*?(\d+) 公尺/gm)].map(m => [m[1], +m[2]]);
ok(order.length === 3 && order.map(o => o[0]).join("") === "P1P2P3",
  `door-detail.txt 的號碼牌順序不是 P1 P2 P3：${order.map(o => o[0]).join("")}`);
ok(order.length === 3 && order[0][1] > order[2][1],
  "門口那張的順序刻意不是照距離排（P1 最遠、P3 最近），detail 裡被重排了");

/* ---- ④b QR 那張表要對得上 door-qr.json（產生器寫的，不要手抄） ---- */
const QJ = JSON.parse(fs.readFileSync(path.join(DIR, "door-qr.json"), "utf8"));
const SLOT = { "原圖": 1080, "大格": 823, "小格": 410 };
const TAG = { "200px": "a", "140px": "qr140" };
const rows = [...PAGE.matchAll(
  /<tr><td>(200px|140px)・(原圖|大格|小格) \d+<\/td><td>([\d.]+)px<\/td><td>([\d.]+)px<\/td><td[^>]*>(\d\/3)<\/td><\/tr>/g)];
ok(rows.length === 6, `QR 那張表有 ${rows.length} 列，應該是 6`);
for (const [, t, slot, px, per, got] of rows) {
  const c = QJ.cases.find(x => x.tag === TAG[t]);
  const sl = c && c.slots.find(x => x.w === SLOT[slot]);
  if (!sl) { bad.push(`QR 表上有一列在 door-qr.json 裡找不到：${t} ${slot}`); continue; }
  ok(+px === sl.px && +per === sl.per && got === sl.scan,
    `QR 表 ${t}${slot} 對不上 door-qr.json：頁面 ${px}／${per}／${got}　檔案 ${sl.px}／${sl.per}／${sl.scan}`);
}
ok(!QJ.cases.some(c => c.slots.some(s => s.scan === "未驗")),
  "door-qr.json 裡有「未驗」—— 那台機器上沒有 opencv，QR 沒有被真的掃過。"
  + "要驗：pip install opencv-python-headless 再跑一次 post-map-door.mjs");
/* ⚠⚠⚠ QR 不能用眼睛驗收（門口那張告示的 README 就寫著）——這裡真的再掃一次，
   拿頁面上宣稱的數字去對。掃不到 opencv 就**大聲印出來**，不要靜靜地放行。 */
let scanned = "（這台機器沒有 opencv，沒有重掃）";
try {
  const py = `
import sys, json, cv2
img = cv2.imread(sys.argv[1]); out = []
for w in [int(x) for x in sys.argv[2:]]:
    im = img if w == img.shape[1] else cv2.resize(img, (w, w), interpolation=cv2.INTER_AREA)
    ok, dec, pts, _ = cv2.QRCodeDetector().detectAndDecodeMulti(im)
    out.append(len(sorted(set(s for s in (dec if ok else []) if s))))
print(json.dumps(out))`;
  const hits = [];
  for (const c of QJ.cases.filter(c => ["a", "qr140"].includes(c.tag))) {
    const r = JSON.parse(execFileSync("python3",
      ["-c", py, path.join(DIR, `door-${c.tag}.png`), ...c.slots.map(s => String(s.w))],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
    c.slots.forEach((s, i) => {
      ok(`${r[i]}/3` === s.scan,
        `door-${c.tag} 縮到 ${s.w} 重掃是 ${r[i]}/3，頁上寫的是 ${s.scan}`);
      hits.push(`${c.tag}@${s.w} ${r[i]}/3`);
    });
  }
  scanned = "（重掃：" + hits.join("、") + "）";
} catch (e) { /* 沒有 opencv：下面那一行會把它印出來 */ }

/* ---- ⑤ 產出的圖沒有孤兒 ---- */
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".png")))
  ok(used.has(f), `圖產了卻沒有擺上頁面：${f}`);

/* ---- ⑥ noindex／零 JS／相對路徑 ---- */
ok(/name="robots" content="noindex, nofollow, noarchive"/.test(PAGE), "少了 noindex");
ok(!/<script/i.test(PAGE), "這一頁刻意零 JS，不要放 script");
ok(!/(?:src|href)="\/(?!\/)/.test(PAGE), "出現根目錄絕對路徑（舊站 yclee86.github.io 會壞）");

/* ---- ⑦ 紅線 ---- */
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  for (const [d, nm] of [[doorDetail, "door-detail.txt"], [detail, "detail.txt"]])
    ok(!re.test(d), `${nm} 踩到紅線（這個帳號沒有專人即時回覆）：${re}`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 靜態檢查通過（圖 ${imgs.length} 張、兩塊詳情逐字相同、留下的兩句與拿掉的兩句都對得上門口那張、三條網址對得上 index.html）`);
console.log(`  QR ${scanned}`);

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
