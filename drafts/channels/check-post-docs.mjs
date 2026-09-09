/* 貼文・第三格（主題與科別・醫師）的規格頁守門
 *   node drafts/channels/check-post-docs.mjs
 *
 * 擋的是「畫面看起來正常、數字卻不對」那一類（這條線每一支守門都是為了這個）：
 *  ① 頁上每一張圖 repo 裡都有，且 width/height 屬性 ＝ PNG 檔頭的真實尺寸、都有 alt
 *  ② 「詳情」那一段和 detail.txt 逐字相同（不要有第二個真相）
 *  ③ ⚠⚠ 頁上那張「四案差在哪」的表，四案的名字要和產生器的 CASES 對得上
 *  ④ 產出的圖沒有孤兒（產了卻沒擺上去 ＝ 有人改了頁面忘了圖）
 *  ⑤ 三道 noindex、零 JS、沒有根目錄絕對路徑（舊站 yclee86.github.io 會壞）
 *  ⑥ 紅線：這個帳號沒有專人即時回覆（第十一之三節）
 *  ⑦ ⚠⚠ 頁上寫的科別名與醫師姓名，逐字 ＝ index.html
 *     （這一頁是拿給使用者挑的，寫錯一個字他挑的就是另一件事）
 *  ⑧ 八個寬度水平溢出 0、圖都載得到、死錨 0
 *
 * ⚠ 紅線與姓名掃描一律**只掃該掃的那一段**，不掃整頁 —— 這條線每一份檔案都把
 *   說明寫在資料裡面，掃整頁一定會撞到自己的說明（check-post-hours 第一版誤報兩條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR  = path.join(ROOT, "preview", "line-post-docs");
const PAGE = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const GEN  = fs.readFileSync(path.join(ROOT, "drafts", "channels", "post-docs.mjs"), "utf8");
/* ⚠⚠ 掃「有沒有寫死資料」之前一定要先把註解剝掉 —— 這條線每一支腳本都把
   推導寫在註解裡，那裡面本來就會提到醫師的名字（例：解釋專長為什麼照自己的
   data-spec 分群時舉了一位醫師當例子）。不剝的話這一道每次都誤報。 */
const GENCODE = GEN.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

const pngSize = (f) => {
  const b = fs.readFileSync(f);
  if (b.toString("ascii", 1, 4) !== "PNG") throw new Error(`${f} 不是 PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

/* ---- ① 圖都在，尺寸對得上，都有 alt ---- */
const imgs = [...PAGE.matchAll(/<img\s+src="([^"]+)"\s+width="(\d+)"\s+height="(\d+)"([^>]*)>/g)]
  .map(m => ({ src: m[1], w: +m[2], h: +m[3], rest: m[4] }));
ok(imgs.length === 4, `頁上有 ${imgs.length} 張圖，應該是 4`);
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
/* ⚠ 每一案的 1080 圖都要擺上去 —— 少一張，那一案就等於沒有被提案。
   ⚠⚠ 2026-09-09 定稿 Ⓕ3，這一頁收成三張：定稿本人／小格 410px／主頁三格。
   ⚠⚠⚠ **要貼的檔案叫 `fangren-docs-1080.png`**（同看診時間與地圖那兩張的命名），
   其餘兩張只是模擬圖 —— 名字寫錯的話使用者會貼到模擬圖上去。 */
for (const f of ["fangren-docs-1080.png", "slot-410.png", "profile-3up.png", "tri-sizes.png"])
  ok(used.has(f), `少了這一張：${f}`);
/* ⚠⚠⚠ 2026-09-09：浮水印跨三格拼成一顆，位置與大小只有一個出處 ——
   這一支不可以自己寫死，不然三張接不成一顆而且**畫面上看起來很正常**。 */
ok(/from "\.\/wm-triptych\.mjs"/.test(GENCODE) && /wmFor\("docs"\)/.test(GENCODE),
  "產生器沒有從 wm-triptych.mjs 拿浮水印的位置（三格會接不起來）");
ok(!/right:\$\{|bottom:\$\{/.test(GENCODE.match(/svg\.wm\{[^}]*\}/)?.[0] ?? ""),
  "浮水印又自己寫死位置了 —— 位置只能來自 wm-triptych.mjs");

/* ---- ② 「詳情」逐字 ---- */
const detail = fs.readFileSync(path.join(DIR, "detail.txt"), "utf8").trimEnd();
const onPage = (PAGE.match(/<div class="pv-txt">([\s\S]*?)<\/div>/) || [])[1];
ok(onPage !== undefined, "頁上找不到「詳情」那一塊");
if (onPage !== undefined)
  ok(onPage.trim() === detail,
    `「詳情」和 detail.txt 對不上：\n    頁面 ${JSON.stringify(onPage.trim())}\n    檔案 ${JSON.stringify(detail)}`);

/* ---- ③ 四格的名字要和產生器的 CASES 對得上 ----
   ⚠ 頁上那些標題是手寫的，產生器改了案名而頁面沒跟上，使用者挑的就是別的東西。 */
const cases = [...GEN.matchAll(/\[(K0|[\d.]+),\s*(MPAD0|null|[\d.]+),\s*(true|false),\s*"([^"]+)"\]/g)]
  .map(m => ({ rec: m[3] === "true", label: m[4] }));
ok(cases.length === 1, `產生器的 CASES 讀到 ${cases.length} 格，定稿之後應該是 1`);
ok(cases.every(c => c.rec), "CASES 那一格沒有標成定稿");
/* ⚠⚠ 定稿的兩個值要真的寫回常數（不然「這一頁畫的」和「他挑的」會分家） */
ok(/const K0 = 1\.15, MPAD0 = 13\.5;/.test(GENCODE),
  "定稿那兩個值沒有寫回常數（K0 1.15／MPAD0 13.5）");
for (const c of cases) {
  /* 圈號（含 Ⓔ2 那個尾數）後面那幾個字，去掉括號裡的補充，要出現在頁面上 */
  const key = c.label.replace(/^[Ⓐ-Ⓩ]\d?\s*/, "").replace(/（[^）]*）/g, "").trim();
  ok(PAGE.includes(key), `產生器的「${c.label}」在規格頁上找不到（頁面沒跟上改名？）`);
}
/* ⚠⚠⚠ 2026-09-09 使用者指定拿掉標題、上下兩條線、那兩個數字與網址 ——
   這一道擋的是「有人順手加回去」：畫面上多一行字不會讓任何一道尺寸守門翻臉。
   ⚠ 只掃產生器畫出來的那幾個 class，不掃註解（推導本來就會提到它們）。 */
/* ⚠⚠ 2026-09-09 使用者：「治療項目不要套色」「醫師名字等級都一樣　不要分色」——
   兩件都是「加回去不會讓任何一道尺寸守門翻臉」的那一種，所以各擋一道。 */
ok(!/style="color:\$\{TONE\[sp\.id\]\}"/.test(GENCODE),
  "專長小塊又套回科別色了 —— 使用者指定「不要套色，維持淡色，框起來」");
ok(!/\.xd\{/.test(GENCODE) && !/"xd"/.test(GENCODE),
  "醫師名字又分深淺了 —— 使用者指定「等級都一樣，不要分色」");
for (const cls of ["hd", "rule", "ft"])
  ok(!new RegExp(`class="${cls}"`).test(GENCODE),
    `產生器又把 .${cls} 畫回去了 —— 標題／分隔線／頁尾是使用者指定拿掉的`);
ok(!/fangren\.net/.test(GENCODE.replace(/const detail[\s\S]*?;\n/, "")),
  "產生器又把網址畫進圖裡了 —— 網址只留在「詳情」那一欄");

/* ---- ④ 孤兒圖 ---- */
/* ⚠ 「擺上去」包含**只在說明裡寫出檔名**的那幾張（三案的主頁三格模擬）——
   它們是給人自己去開的，不是漏掉。 */
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".png")))
  ok(used.has(f) || PAGE.includes(f), `圖產了卻沒有擺上頁面、說明裡也沒提到：${f}`);

/* ---- ⑤ noindex／零 JS／相對路徑 ---- */
ok(/name="robots" content="noindex, nofollow, noarchive"/.test(PAGE), "少了 noindex");
ok(!/<script/i.test(PAGE), "這一頁刻意零 JS，不要放 script");
ok(!/(?:src|href)="\/(?!\/)/.test(PAGE), "出現根目錄絕對路徑（舊站 yclee86.github.io 會壞）");

/* ---- ⑥ 紅線（只掃「詳情」那一段） ---- */
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  ok(!re.test(detail), `「詳情」踩到紅線（這個帳號沒有專人即時回覆）：${re}`);

/* ---- ⑦ 科別名與醫師姓名逐字 ＝ index.html ----
   ⚠⚠ 這一頁與那四張圖上的每一個名字都是從 index.html 讀出來的，
   規格頁的說明文字卻是手寫的 —— 兩邊對不上時，使用者是照說明在挑。 */
const chips = SRC.slice(SRC.indexOf('<ul class="chips">'));
const specs = [...chips.slice(0, chips.indexOf("</ul>")).matchAll(/data-spec="([a-z]+)"\s*>([^<]+)</g)]
  .map(m => ({ id: m[1], name: m[2].trim() })).filter(s => s.id !== "all");
ok(specs.length === 7, `index.html 讀到 ${specs.length} 科`);
const a0 = SRC.indexOf('<div class="docs">'), a1 = SRC.indexOf('data-for="doctors"');
const names = [...SRC.slice(a0, a1).replace(/<!--[\s\S]*?-->/g, "")
  .matchAll(/<h3>([^<]*)</g)].map(m => m[1]);
ok(names.length === 9, `index.html 讀到 ${names.length} 位醫師，應該是 9`);
/* 頁上那段「詳情」列了七科，逐字比對（顯示名沿用門診表那張的縮寫） */
const DISP = { "植牙・假牙重建": "假牙重建" };
for (const s of specs) {
  const n = DISP[s.name] || s.name;
  ok(detail.includes(`${n}　https://fangren.net/topics/${s.id}/`),
    `「詳情」少了或寫錯這一科：${n} → /topics/${s.id}/`);
}
/* ⚠⚠⚠ 頁上那張「每一列印誰」的表要逐格對得上**站上篩選的規則**
   （index.html 那支 specHit()：本科 **或** 專長命中）——
   那張表是手寫的，寫錯一個名字，使用者是照它在挑。
   ⚠ 順序：本科的排前面，兩群內部照站上卡序（＝產生器那一段的排法）。 */
{
  const docFull = SRC.slice(a0, a1).split("<article").slice(1).map(a => {
    const s = a.replace(/<!--[\s\S]*?-->/g, "");
    return {
      spec: (s.match(/data-spec="([a-z]+)"/) || [])[1],
      name: (s.match(/<h3>([^<]*)</) || [])[1],
      sk: [...((s.match(/class="skills">([\s\S]*?)<\/dd>/) || [])[1] || "")
        .matchAll(/<span class="sk" data-spec="([a-z]+)">/g)].map(m => m[1]),
    };
  });
  const rows = [...PAGE.matchAll(/<tr><td>([^<]+)<\/td><td>([^<]+)<\/td><td[^>]*>([^<]+)<\/td><\/tr>/g)]
    .map(m => ({ spec: m[1].trim(), home: m[2].trim(), cross: m[3].trim() }));
  ok(rows.length === 7, `頁上那張「每一列印誰」讀到 ${rows.length} 列，應該是 7`);
  const join = xs => xs.length ? xs.join("　") : "—";
  for (const s of specs) {
    const n = DISP[s.name] || s.name;
    const row = rows.find(r => r.spec === n);
    if (!row) { bad.push(`「每一列印誰」少了 ${n} 這一列`); continue; }
    const home  = docFull.filter(d => d.spec === s.id).map(d => d.name);
    const cross = docFull.filter(d => d.spec !== s.id && d.sk.includes(s.id)).map(d => d.name);
    ok(row.home === join(home),
      `${n} 那一列的「本科醫師」對不上：頁面「${row.home}」、index.html「${join(home)}」`);
    ok(row.cross === join(cross),
      `${n} 那一列的「跨科」對不上：頁面「${row.cross}」、index.html「${join(cross)}」`);
  }
  /* ⚠ 產生器那一段也要真的照這條規則寫 —— 頁面對了、圖卻是舊的分法，這一道才擋得住 */
  ok(/d\.spec === sp\.id \|\| d\.sk\.some\(s => s\.spec === sp\.id\)/.test(GENCODE),
    "產生器沒有照站上 specHit() 的規則挑醫師（本科 或 專長命中）");
}

/* 產生器不可以把科別名或姓名寫死（那就是第二個真相） */
for (const n of names)
  ok(!GENCODE.includes(n), `產生器裡寫死了醫師姓名「${n}」—— 資料只能從 index.html 讀`);
for (const s of specs)
  ok(!new RegExp(`"${s.name}"`).test(GENCODE.replace(/DISP\s*=\s*\{[^}]*\}/, "")),
    `產生器裡寫死了科別名「${s.name}」—— 資料只能從 index.html 讀`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 靜態檢查通過（圖 ${imgs.length} 張、定稿那一格寫回常數了、`
  + `標題與網址真的沒畫回去、詳情逐字、七科九位對得上 index.html）`);

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
  /* ⚠ 第一張以外都是 loading="lazy"，畫面外的還沒載 —— 不先催它們，
     「有幾張圖載不到」是量測的誤報不是頁面壞。 */
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
    /* ⚠ 量的是「畫出來多寬」（rect），不是 width 屬性 */
    wide: [...document.images].filter(i => i.getBoundingClientRect().width > 430)
      .map(i => `${i.src.split("/").pop()} ${i.getBoundingClientRect().width.toFixed(0)}px`)
  }));
  ok(r.over <= 0, `${w}px 水平溢出 ${r.over}px`);
  ok(!r.broken.length, `${w}px 有 ${r.broken.length} 張圖載不到`);
  ok(!r.dead.length, `${w}px 死錨：${r.dead}`);
  ok(!r.wide.length, `${w}px 有圖畫得比一屏還寬：${r.wide}`);
}
await browser.close();
ok(!errs.length, `JS 錯誤 ${errs.length} 個`);

if (bad.length) { console.error("✗ " + bad.length + " 項：\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`✓ 八個寬度：水平溢出 0、圖全部載得到、死錨 0、JS 錯誤 0`);
