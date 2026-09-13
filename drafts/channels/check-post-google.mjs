/* Google 商家貼文那三張的守門
 *   node drafts/channels/check-post-google.mjs
 *
 * 這一支要擋的，都是「版面完全正常、每一個尺寸都對、只有把圖打開看（或用 git）
 * 才看得出來」的那幾種壞法：
 *   ② 內容被推動了一點點　③ 補的位置算錯、把內容擠進邊條裡
 *   ④ 浮水印忘了換成一張一顆（三格版拼不起來，但單張看起來很正常）
 *   ⑤ 跑完沒有還原，repo 裡的 LINE 成品停在一張一顆的版本
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { wmFor, FB, fbWidth } from "./wm-triptych.mjs";
import { decode, at, inkBox } from "./png-read.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR  = path.join(ROOT, "preview", "google-post");
const GEN  = path.join(ROOT, "drafts", "channels", "post-google.mjs");
const page = fs.readFileSync(path.join(DIR, "index.html"), "utf8");

const bad = [];
const ok = (c, m) => { if (!c) bad.push(m); };

const PAD = 54, CANVAS = 1080, OUTW = 1188;
const BG = [244, 244, 245];
/* ⚠⚠ 第四欄是**貼文的說明文字**，2026-09-13 起是 Google 專用的、和 LINE 那三則不一樣
   （住在 google-post/ 自己的資料夾裡）—— 看 LINE 的人已經加了好友，看這裡的人可能沒
   聽過這間診所，而且這幾則會被搜尋收錄。第五欄是圖，圖仍然和 LINE 那三張同一個出處。 */
const TILES = [
  ["hours", "line-post-hours", "fangren-hours-1080.png", "detail-hours.txt", "門診表"],
  ["docs",  "line-post-docs",  "fangren-docs-1080.png",  "detail-docs.txt", "科別與醫師"],
  ["map",   "line-post-map",   "fangren-map-1080.png",   "detail-map.txt", "位置與周邊停車"],
];
const gFile = k => path.join(DIR, `fangren-google-${k}-1188.png`);
const size = f => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), n: b.length }; };

/* 那一層淡墨的重心。⚠ 不要比對某一個色階的精確值 —— 4% 與 5% 合成出來只差一階，
   而 Chromium 的進位在不同版面上不一定一樣；用一段區間兩種濃度都收得進來。 */
function wmCentroid(file) {
  const d = decode(fs.readFileSync(file));
  let n = 0, sx = 0, sy = 0;
  for (let y = 0; y < d.h; y++) for (let x = 0; x < d.w; x++) {
    const [r, g, b] = at(d, x, y);
    if (r >= 232 && r <= 242 && Math.abs(r - g) <= 1 && b >= r && b - r <= 2) { n++; sx += x; sy += y; }
  }
  return n ? { n, x: sx / n, y: sy / n } : { n: 0, x: NaN, y: NaN };
}
/* 那一顆被畫布裁掉之後，看得到的那一塊的中心（dx ＝ 補邊往右推多少） */
const wmCenter = (gm, W, H, dx = 0) => {
  const x0 = Math.max(0, gm.left + dx), x1 = Math.min(W, gm.left + dx + gm.w);
  const y0 = Math.max(0, gm.top), y1 = Math.min(H, gm.top + gm.h);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
};

/* ---------- ① 三張成品 ---------- */
for (const [k, , , , nm] of TILES) {
  if (!fs.existsSync(gFile(k))) { bad.push(`${nm}：成品不在（跑 node drafts/channels/post-google.mjs）`); continue; }
  const d = size(gFile(k));
  ok(d.w === OUTW && d.h === CANVAS, `${nm} 是 ${d.w}×${d.h}，不是 ${OUTW}×${CANVAS}`);
  /* Google 商家的圖片上限是二手資料，抓一個寬鬆的天花板就好 —— 這三張是 100~200KB */
  ok(d.n < 4 * 1024 * 1024, `${nm} 的檔案 ${(d.n / 1048576).toFixed(1)}MB，太大了`);
}

/* ---------- ② 中央那 1080 的內容，和 LINE 那一張逐格相同 ---------- */
/* ⚠⚠ 「內容一個像素不動」是這一輪唯一的承諾。**不逐位元組比**是因為兩張的
   浮水印本來就不一樣（LINE 是三格版、這裡是一張一顆），所以比的是**內容的外框**：
   門檻 18 階跨過了 4~5% 的浮水印，量到的就只有內容。 */
for (const [k, dir, file, , nm] of TILES) {
  if (!fs.existsSync(gFile(k))) continue;
  const a = inkBox(decode(fs.readFileSync(path.join(ROOT, "preview", dir, file))), BG);
  const b = inkBox(decode(fs.readFileSync(gFile(k))), BG, { x: PAD, w: CANVAS });
  ok(a.top === b.top && a.bot === b.bot && a.left + PAD === b.left && a.right + PAD === b.right,
    `${nm} 的內容被動到了：LINE 那張是 上${a.top} 下${a.bot} 左${a.left} 右${a.right}，`
    + `這一張是 上${b.top} 下${b.bot} 左${b.left - PAD} 右${b.right - PAD}`);
}

/* ---------- ③ 補出來的兩條邊條裡不可以有內容 ---------- */
for (const [k, , , , nm] of TILES) {
  if (!fs.existsSync(gFile(k))) continue;
  const d = decode(fs.readFileSync(gFile(k)));
  for (const [side, x] of [["左", 0], ["右", OUTW - PAD]]) {
    const b = inkBox(d, BG, { x, w: PAD });
    ok(b.n === 0, `${nm} ${side}邊那一條補出來的裡面有 ${b.n} 個內容像素（補的位置算錯了）`);
  }
}

/* ---------- ④ 浮水印對得上「一張一顆」的幾何（第一層）---------- */
/* ⚠⚠ 重心只能當第一層 —— 它擋得住「浮水印畫到完全不同的地方」，
   **擋不住地圖那一格**：那兩組幾何只差 94px，而那張圖中間是一塊不透明的地圖、
   量得到的淡墨只有壓在背景上的那一半，重心因此偏得比兩組幾何的差距還多。
   （第一版只有這一道，負向測試放行了兩種壞法。）決定性的是底下第 ⑥ 道。 */
for (const [k, , , , nm] of TILES) {
  if (!fs.existsSync(gFile(k))) continue;
  const c = wmCentroid(gFile(k));
  const solo = wmCenter(wmFor(k, { mode: "fb-solo" }), OUTW, CANVAS, PAD);
  ok(c.n > 20000, `${nm} 幾乎量不到浮水印（只有 ${c.n} 個像素）`);
  if (c.n > 20000)
    ok(Math.abs(c.x - solo.x) <= 120 && Math.abs(c.y - solo.y) <= 120,
      `${nm} 的浮水印重心 (${c.x.toFixed(0)}, ${c.y.toFixed(0)}) 對不上「一張一顆」`
      + ` 算出來的 (${solo.x.toFixed(0)}, ${solo.y.toFixed(0)})`);
}

/* ---------- ⑤ LINE 那三張要還原成三格版（第一層）---------- */
for (const [k, dir, file, , nm] of TILES) {
  const f = path.join(ROOT, "preview", dir, file);
  if (!fs.existsSync(f)) { bad.push(`${nm}：LINE 那張不在`); continue; }
  const c = wmCentroid(f), want = wmCenter(wmFor(k, { mode: undefined }), CANVAS, CANVAS);
  ok(c.n > 20000, `LINE 版 ${nm} 幾乎量不到浮水印（只有 ${c.n} 個像素）`);
  if (c.n > 20000)
    ok(Math.abs(c.x - want.x) <= 120 && Math.abs(c.y - want.y) <= 120,
      `LINE 版 ${nm} 的浮水印重心 (${c.x.toFixed(0)}, ${c.y.toFixed(0)}) 不是三格版`
      + `（應該在 ${want.x.toFixed(0)}, ${want.y.toFixed(0)}）`);
}

/* ---------- ⑥ 決定性的一道：中央那 1080 vs LINE 那一張 ---------- */
/* ⚠⚠⚠ 兩張的**內容一模一樣、只有浮水印不一樣**，所以逐像素比一次就同時答完兩件事：
     ・**一定要有差** → 浮水印真的換成「一張一顆」了，而且 LINE 那三張真的還原了
       （兩者只要有一邊沒做，這一格就會逐像素相同）
     ・**差的每一個像素都要 ≤14 階** → 那一層淡墨只有 4~5% 的墨（實測最大 12 階），
       內容只要被推動一個像素，邊緣就會跳出上百階
   ⚠ 這一道**沒有門檻要調**，也不必猜容差 —— 第 ④⑤ 道那種「重心 ±120px」
     正是負向測試放行的那一種。 */
const MAXTINT = 14;
for (const [k, dir, file, , nm] of TILES) {
  const lf = path.join(ROOT, "preview", dir, file);
  if (!fs.existsSync(gFile(k)) || !fs.existsSync(lf)) continue;
  const a = decode(fs.readFileSync(gFile(k))), b = decode(fs.readFileSync(lf));
  let n = 0, mx = 0, wx = -1, wy = -1;
  for (let y = 0; y < CANVAS; y++) for (let x = 0; x < CANVAS; x++) {
    const p = at(a, x + PAD, y), q = at(b, x, y);
    const s = Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2]));
    if (s) { n++; if (s > mx) { mx = s; wx = x; wy = y; } }
  }
  ok(n > CANVAS * CANVAS / 100,
    `${nm}：中央那 1080 和 LINE 那一張只差 ${n} 個像素 —— 浮水印沒有換成「一張一顆」，`
    + "或是 LINE 那一張沒有還原成三格版（跑一次 node drafts/channels/post-google.mjs）");
  ok(mx <= MAXTINT,
    `${nm}：中央那 1080 和 LINE 那一張差到 ${mx} 階（在 ${wx}, ${wy}）—— `
    + `那不是浮水印（只有 4~5% 的墨、最多 12 階），是內容被動到了`);
}

/* ---------- ⑥ 產生器裡那幾個「是決定不是預設」的值 ---------- */
const gen = fs.readFileSync(GEN, "utf8");
ok(/const PAD = 54;/.test(gen), "補邊的寬度不是 54（那是 Ⓟ2 定案的值，改它就等於改掉涵蓋區間）");
ok(/const GFRAME = \{ W: 981, H: 933, DPR: 3 \};/.test(gen),
  "輪播框那三個數字被改掉了 —— 那是從使用者的截圖逐像素量出來的事實");
/* ⚠⚠ 還原要跑兩輪：post-docs.mjs 那張三格模擬圖是把另外兩張從硬碟讀回來拼的，
   只跑一輪的話輪到它的時候 map 還停在上一版，那張圖就拼著一張別版的存下來
   （尺寸、孤兒檔、溢出每一道守門都會過，只有 git 看得出來）。 */
ok(/for \(let i = 0; i < 2; i\+\+\) for \(const t of TILES\) run\(t\.gen, \{\}\);/.test(gen),
  "還原沒有跑兩輪 —— 那張三格模擬圖會停在別版的浮水印上");
ok(/finally/.test(gen), "還原沒有寫在 finally 裡 —— 中途爆掉的話 LINE 那三張會留在別版");
/* fb-solo 那一組是 2026-09-08 使用者挑定的，不是這一輪新挑的 */
ok(FB.hours.shape === "r3c1" && FB.hours.opacity === .05 && FB.hours.cutX === 60,
  "fb-solo 的門診表那顆不是 2026-09-08 挑定的那一組（r3c1・5%・切 60×50）");
ok(FB.docs.shape === "r1c2" && FB.docs.opacity === .04 && FB.docs.cutX === 440,
  "fb-solo 的科別醫師那顆不是 2026-09-08 挑定的那一組（r1c2・4%・切 440）");
ok(fbWidth("r3c1") === 660, "等重換算的基準跑掉了（r3c1 應該畫 660）");

/* ---------- ⑦ 頁上三段文字逐字 ＝ 那一則自己的 .txt ---------- */
/* ⚠ 這三段和 LINE 那三則是同一個出處，頁面上是印出來的、不是另存一份。 */
const pres = [...page.matchAll(/<pre>([\s\S]*?)<\/pre>/g)].map(m =>
  m[1].replace(/&lt;/g, "<").replace(/&amp;/g, "&"));
ok(pres.length === 3, `頁上應該有三段文字，找到 ${pres.length} 段`);
TILES.forEach(([, , , txt, nm], i) => {
  const want = fs.readFileSync(path.join(DIR, txt), "utf8").replace(/\s+$/, "");
  ok(pres[i] === want, `${nm} 那一段文字和 ${txt} 不一樣（要從那一份讀回來，不要重打）`);
});

/* ⚠⚠ 三件是這一則和 LINE／臉書那三份**刻意不一樣**的地方，加回去不會讓任何一道版面守門翻臉：
   ① 每一則都要寫出診所名（LINE 那三則從頭到尾沒有出現「芳仁」「斗六」或「牙醫」，
      在這裡那是白丟的 —— 這幾則會被搜尋收錄）
   ② 說明欄裡不放網址（Google 那一欄的網址**點不下去**，連結交給那顆按鈕）
   ③ 不放電話號碼（號碼就在貼文正上方的商家資訊裡，而且說明欄放號碼有被退件的說法） */
TILES.forEach(([, , , , nm], i) => {
  const t = pres[i] || "";
  ok(/芳仁牙醫診所/.test(t), `${nm} 的文字沒有寫出診所名字 —— 這幾則會被搜尋收錄，讀的人可能沒聽過這間診所`);
  ok(/斗六/.test(t), `${nm} 的文字沒有出現「斗六」`);
  ok(!/https?:\/\//.test(t), `${nm} 的文字裡有網址 —— Google 的說明欄點不下去，連結要交給那顆按鈕`);
  ok(!/\b05-?5339369\b/.test(t), `${nm} 的文字裡有電話號碼 —— 號碼在貼文正上方的商家資訊裡，這裡刻意不寫`);
  ok(!/#[\u4e00-\u9fff]/.test(t), `${nm} 的文字裡有 hashtag —— 那是臉書那一份才有的事`);
});

/* ⚠⚠ 裡面有幾句是別處已經定案的字，一個字都不可以重打 */
const rd = (...q) => fs.readFileSync(path.join(ROOT, ...q), "utf8");
const srcIndex = rd("index.html"), srcDoor = rd("drafts", "door-notice", "body.html");
const srcLine = rd("preview", "line-post-map", "door-detail.txt");
[["hours", "國定假日與各科特別門診請來電確認。", srcIndex, "index.html"],
 ["hours", "08:45–11:30", srcIndex, "index.html 的門診表"],
 ["hours", "13:45–16:30", srcIndex, "index.html 的門診表"],
 ["hours", "17:45–20:00", srcIndex, "index.html 的門診表"],
 ["map", "停車計價方式依各業者現場標示為準。", srcDoor, "門口那張告示"],
 ["map", "路邊停車格", srcDoor, "門口那張告示"],
 ["map", "P1 壹車房－中華路停車場　190 公尺・步行 3 分鐘", srcLine, "LINE 那一則的詳情"],
 ["map", "P2 合廷停車場　140 公尺・步行 2 分鐘", srcLine, "LINE 那一則的詳情"],
 ["map", "P3 斗六永樂站停車場　50 公尺・步行 1 分鐘", srcLine, "LINE 那一則的詳情"],
 ["map", "雲林縣斗六市永樂街 70 號", srcLine, "LINE 那一則的詳情"],
].forEach(([k, frag, src, where]) => {
  const i = TILES.findIndex(t => t[0] === k);
  ok((pres[i] || "").includes(frag), `${TILES[i][4]} 的文字裡找不到「${frag}」`);
  ok(src.includes(frag), `「${frag}」和 ${where} 對不上 —— 那幾個字不可以重打`);
});

/* ⚠ 那顆按鈕：一則只掛得了一顆、一個網址，頁面上要寫出是哪一個 */
["https://fangren.net/", "https://fangren.net/#topics", "https://fangren.net/#clinic"]
  .forEach(u => ok(page.includes(u), `頁上少了按鈕的網址 ${u}`));

/* ---------- ⑧ 頁上每一張圖、孤兒檔 ---------- */
const imgs = [...page.matchAll(/<img src="([^"]+)" width="(\d+)" height="(\d+)"/g)];
ok(imgs.length >= 9, `頁上只有 ${imgs.length} 張圖，太少了`);
const used = new Set();
for (const [, src, w, h] of imgs) {
  const f = path.join(DIR, src);
  if (!fs.existsSync(f)) { bad.push(`頁上引用的 ${src} 不在`); continue; }
  used.add(src);
  const d = size(f);
  /* ⚠ 圖是縮下來擺的，所以比的是長寬比不是尺寸 —— 比錯的話一張被壓扁的照樣會過 */
  const want = Math.round(d.h * (+w) / d.w);
  ok(Math.abs(want - +h) <= 1, `${src} 的 height=${h} 對不上長寬比（應該是 ${want}）`);
  ok(/alt="[^"]+"/.test(page.slice(page.indexOf(src))), `${src} 沒有 alt`);
}
for (const f of fs.readdirSync(DIR)) {
  /* ⚠ 那三份說明文字不是圖，它們是頁面**印出來**的（⑦ 在逐字比對），不算孤兒檔 */
  if (f === "index.html" || /^detail-.*\.txt$/.test(f)) continue;
  ok(used.has(f), `${f} 沒有被頁面引用（孤兒檔）`);
}

/* ---------- ⑨ noindex、零 JS、紅線 ---------- */
ok(/<meta name="robots" content="noindex, nofollow, noarchive">/.test(page), "少了 noindex");
ok(!/<script/.test(page), "這一頁不該有 JS");
/* ⚠⚠ 這個帳號沒有專人回覆訊息，而 Google 商家檔案有「問答」區 ——
   第十一之三節那條紅線在這裡也成立。現在一句都沒有踩到，這一道是擋日後有人多寫一句。
   ⚠ 掃的是那三段文字不是整頁：頁面上解釋「為什麼不可以寫」的句子本身會含著禁語
     （這條線已經撞過好幾次）。 */
const RED = [/隨時(問|詢問|聯絡)/, /有問題.{0,6}(問|留言|私訊)/,
             /(留言|私訊).{0,4}(問我們|詢問|告訴我們)/,
             /二十四小時/, /24\s*小時.{0,4}(回|客服)/, /即時回(覆|應)/, /小編/];
pres.forEach((s, i) => { for (const re of RED) ok(!re.test(s), `${TILES[i][4]} 的文字踩到紅線：${re}`); });

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
  /* ⚠ 畫面外的 lazy 圖永遠不會開始載，「等它載完」的 Promise 會永遠不 resolve ——
     先催成 eager，而且只等「結束」不等「成功」。 */
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
console.log("✓ Google 商家貼文那三張：內容逐格沒動、補邊只有底色與浮水印、"
  + "浮水印是一張一顆、LINE 那三張已還原、文字逐字、八個寬度溢出 0");
