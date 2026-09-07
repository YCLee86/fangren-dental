/* 貼文・看診時間圖的規格頁守門 → node drafts/channels/check-post-hours.mjs
 *
 * 擋的是「畫面看起來正常、數字卻不對」那一類（這條線每一支守門都是為了這個）：
 *  ① 頁上每一張圖 repo 裡都有，且 width/height 屬性 ＝ PNG 檔頭的真實尺寸
 *  ② ⚠⚠⚠ 捲軸裡每一張都要自己寫 inline 的 width:NNNpx，
 *     而且樣式表不准出現 .pv-scroll img{width:auto} —— 2026-09-07 在 line-spec 踩過：
 *     width:auto 會蓋掉 img 的 width 屬性、讓圖退回原始像素尺寸（這裡是 1080px），
 *     **水平溢出仍然是 0、每一道既有的守門都會過**，只有把 rect 印出來才看得到。
 *  ③ 「詳情」那一段和 detail.txt 逐字相同（不要有第二個真相）
 *  ④ 產出的圖沒有孤兒（產了卻沒擺上去 ＝ 有人改了頁面忘了圖）
 *  ⑤ 三道 noindex、零 JS、沒有根目錄絕對路徑（舊站 yclee86.github.io 會壞）
 *  ⑥ 紅線：這個帳號沒有專人即時回覆（第十一之三節）
 *  ⑦ 八個寬度水平溢出 0、圖都載得到、死錨 0
 *
 * ⚠ 紅線掃描要**掃到說明區之前為止** —— 這條線每一份檔案都把說明寫在資料裡面，
 *   掃字一定會撞到自己的說明（check-cancel 掃 emoji 撞到 _說明 的 ⚠，同一件事）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR  = path.join(ROOT, "preview", "line-post-hours");
const PAGE = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
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
ok(imgs.length === 22, `頁上有 ${imgs.length} 張圖，應該是 22`);
const used = new Set();
for (const im of imgs) {
  const f = path.join(DIR, im.src);
  if (!fs.existsSync(f)) { bad.push(`圖不存在：${im.src}`); continue; }
  used.add(im.src);
  const s = pngSize(f);
  ok(s.w === im.w && s.h === im.h,
    `${im.src} 屬性寫 ${im.w}×${im.h}，實檔是 ${s.w}×${s.h}`);
  ok(/alt="[^"]+"/.test(im.rest), `${im.src} 沒有 alt`);
}

/* ---- ② 捲軸裡的圖 ----
   2026-09-07「乾淨簡潔」那一輪把八張版拿掉了，所以現在沒有捲軸。
   ⚠ 這一道**留著**：日後只要有人再加一條 pv-scroll，它就會生效。
   ⚠⚠⚠ 那條教訓是 line-spec 踩到的：`.pv-scroll img{width:auto}` 會蓋掉 img 的
   width 屬性、讓圖退回原始像素尺寸（這裡是 1080px），而**水平溢出仍然是 0、
   每一道既有的守門都會過** —— 只有把 rect 印出來才看得到。 */
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

/* ---- ③b 色碼表和 colors.json 逐格相同 ----
   ⚠ 頁面上那六案 × 七科的色碼是給使用者挑的，**手抄一份就是第二個真相**，
   顏色改一次它就開始說謊。這一道逐格比對。 */
const pal = JSON.parse(fs.readFileSync(path.join(DIR, "colors.json"), "utf8"));
const blocks = [...PAGE.matchAll(/<div class="pv-pal"><b>([A-Z])[^<]*<\/b>([\s\S]*?)<\/div><\/div>/g)];
ok(blocks.length === pal.cases.length,
  `頁上有 ${blocks.length} 個色碼區塊，colors.json 有 ${pal.cases.length} 案`);
for (const [, tag, body] of blocks) {
  const c = pal.cases.find(x => x.tag === tag);
  if (!c) { bad.push(`頁上多了一案 ${tag}`); continue; }
  /* ⚠ 2026-09-07 使用者把「植牙」改成「假牙」—— 標籤也要有唯一的出處，
     不然改名只改了一半而且沒有人會發現。colors.json 的 short 就是那一份。 */
  const lab = [...body.matchAll(/<\/i>([^ ]+) #/g)].map(m => m[1]);
  ok(lab.join(" ") === pal.short.join(" "),
    `${tag} 的科別標籤對不上 colors.json 的 short：\n    頁面 ${lab.join(" ")}\n    檔案 ${pal.short.join(" ")}`);
  const got = [...body.matchAll(/#[0-9A-F]{6}/g)].map(m => m[0]);
  const want = c.colors.flatMap(x => [x, x]);   /* 每一格出現兩次：色塊的 background ＋ 印出來的字 */
  ok(JSON.stringify(got) === JSON.stringify(want),
    `${tag} 的色碼對不上 colors.json：\n    頁面 ${got.join(" ")}\n    檔案 ${want.join(" ")}`);
}

/* ---- ④ 產出的圖沒有孤兒 ---- */
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".png")))
  ok(used.has(f), `圖產了卻沒有擺上頁面：${f}`);

/* ---- ⑤ noindex／零 JS／相對路徑 ---- */
ok(/name="robots" content="noindex, nofollow, noarchive"/.test(PAGE), "少了 noindex");
ok(!/<script/i.test(PAGE), "這一頁刻意零 JS，不要放 script");
ok(!/(?:src|href)="\/(?!\/)/.test(PAGE), "出現根目錄絕對路徑（舊站 yclee86.github.io 會壞）");

/* ---- ⑥ 紅線 ----
   ⚠⚠⚠ **只掃「真的要貼出去的那一段」，不掃整頁** —— 這一頁的說明本來就要
   寫出禁語是哪幾個字（「不可以寫『有問題隨時問』那一類的話」），
   掃整頁一定會撞到自己的說明。第一版就是這樣誤報兩條。
   同 check-review 那條「不可以印出變數名的規則只掃卡片不掃整頁」。 */
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  ok(!re.test(detail), `「詳情」踩到紅線（這個帳號沒有專人即時回覆）：${re}`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 靜態檢查通過（圖 ${imgs.length} 張、詳情逐字相同）`);

/* ---- ⑦ 量：八個寬度水平溢出 0、圖都載得到、死錨 0 ---- */
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
const live = [];
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.goto("file://" + path.join(DIR, "index.html"), { waitUntil: "load" });
  /* ⚠ 第一張以外都是 loading="lazy"，畫面外的還沒載 —— 不先催它們，
     「有 14 張圖載不到」是量測的誤報不是頁面壞。改成 eager 再等它們載完。 */
  await page.evaluate(async () => {
    for (const i of document.images) i.loading = "eager";
    await Promise.all([...document.images].map(i =>
      i.complete && i.naturalWidth ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  const r = await page.evaluate(() => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
    dead: [...document.querySelectorAll('a[href^="#"]')]
      .filter(a => !document.querySelector(a.getAttribute("href"))).map(a => a.getAttribute("href")),
    /* ⚠ 量的是「畫出來多寬」（rect），不是 width 屬性 —— 那條教訓的重點就在這 */
    wide: [...document.images].filter(i => i.getBoundingClientRect().width > 430)
      .map(i => `${i.src.split("/").pop()} ${i.getBoundingClientRect().width.toFixed(0)}px`)
  }));
  live.push([w, r]);
  ok(r.over <= 0, `${w}px 水平溢出 ${r.over}px`);
  ok(!r.broken.length, `${w}px 有 ${r.broken.length} 張圖載不到`);
  ok(!r.dead.length, `${w}px 死錨：${r.dead}`);
  ok(!r.wide.length, `${w}px 有圖畫得比一屏還寬：${r.wide}`);
}
await browser.close();
ok(!errs.length, `JS 錯誤 ${errs.length} 個`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 八個寬度：水平溢出 0、圖全部載得到、死錨 0、JS 錯誤 0`);
