/* 圖文選單那一頁的守門
 *   node drafts/channels/check-richmenu.mjs
 *
 * 擋的是這一輪真正會出錯的六種：
 *  ① 規格頁上的數字和產生器算出來的對不上（頁上那張表整格逐字比對 numbers.json）
 *  ② <img> 的 width/height 和實檔對不上（模擬圖 ＝ 整支手機 1125×2436）（⚠ 屬性寫對不等於畫出來是那個大小，
 *     所以底下第 ⑥ 道還會量 rect —— CLAUDE.md 第十一之一節那個 width:auto 的坑）
 *  ③ 要上傳的 richmenu-*.jpg 違反 LINE 的硬條件（尺寸／比例 ≥1.45／≤1MB）
 *  ④ 有孤兒檔（產生器改過名字，舊的還躺在 preview/ 裡跟著上線）
 *  ⑤ noindex 掉了、或混進 <script>（這一頁是給人看的規格頁，沒有理由跑腳本）
 *  ⑥ 八個寬度有水平溢出、圖載不到、或畫出來的寬度不是宣告的那個
 *  ⑦ 紅線：這個帳號沒有專人即時回覆訊息（第十一之三節）
 */
import fs from "node:fs";
import path from "node:path";

const DIR  = "preview/line-richmenu";
const PAGE = path.join(DIR, "index.html");
const NUMS = "drafts/line-richmenu-numbers.json";
const bad = [];

if (!fs.existsSync(NUMS))
  throw new Error(`${NUMS} 不在 —— 先跑 node drafts/channels/richmenu-bind.mjs`);
const N = JSON.parse(fs.readFileSync(NUMS, "utf8"));
const html = fs.readFileSync(PAGE, "utf8");

/* ── 讀圖檔的尺寸（容器裡沒有 PIL，自己掃檔頭）───────────────────── */
function dims(p) {
  const b = fs.readFileSync(p);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), t: "png" };
  if (b[0] === 0xff && b[1] === 0xd8) {                       /* JPEG：掃 SOF */
    let i = 2;
    while (i < b.length - 8) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7), t: "jpeg" };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  throw new Error(`${p} 認不出是 PNG 還是 JPEG`);
}

/* ── ① 頁上那張表逐格對 numbers.json ─────────────────────────────── */
const tb = html.slice(html.lastIndexOf("<tbody>"), html.lastIndexOf("</tbody>"));
const rows = [...tb.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
  .map((m) => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)]
    .map((c) => c[1].replace(/<[^>]+>/g, "").trim()));
if (rows.length !== N.格.length)
  bad.push(`那張表有 ${rows.length} 列，產生器出了 ${N.格.length} 格`);
else N.格.forEach((g, i) => {
  /* ⚠ 第一格逐字對「標籤」—— 尺上有 Ⓐ1／Ⓐ2／Ⓐ3，只比圈號的話三列會互相通過 */
  const want = [g.標籤, g.版型, g.圖檔, g.手機上,
    `${g.看得到}%`, `${g.一個人頭}px`,
    g.主標 == null ? "沒有" : `${g.主標}px`,
    g.副標 == null ? "沒有" : `${g.副標}px`,
    g.帶子 == null ? "—" : `${g.帶子}px`,
    `${g.檔案KB}KB`];
  const got = rows[i];
  if (got.length !== want.length)
    bad.push(`表第 ${i + 1} 列有 ${got.length} 格，應該是 ${want.length} 格`);
  want.forEach((w, j) => {
    if ((got[j] ?? "") !== w)
      bad.push(`表第 ${i + 1} 列第 ${j + 1} 格：頁上「${got[j]}」，產生器算的是「${w}」`);
  });
});

/* ── ① 之二：內文裡那幾個非抄不可的數字 ──────────────────────────── */
const S = N.截圖, O = N.原圖, H = N.硬條件;
for (const t of [
  `${S.w}×${S.h}`, `y ${S.選單.y0} ~ ${S.選單.y1}`, `${S.選單.w}×${S.選單.h}`,
  `${S.選單.w} ÷ ${S.選單.h} ＝ ${S.選單.比例}`,
  `${O.w}×${O.h} ＝ ${O.比例}:1`,
  `<b>${H.寬[0]} ~ ${H.寬[1]}</b>`, `<b>${H.高下限} 以上</b>`, `≥ ${H.比例下限}`,
])
  if (!html.includes(t)) bad.push(`內文少了這個數字：${t}`);

/* ── ②③④ 檔案 ───────────────────────────────────────────────────── */
const used = new Set(["index.html"]);
for (const g of N.格) {
  /* 要上傳的那一份 */
  const jp = path.join(DIR, `richmenu-${g.id}.jpg`);
  used.add(path.basename(jp));
  if (!fs.existsSync(jp)) { bad.push(`${jp} 不在`); continue; }
  const d = dims(jp), [w, h] = g.圖檔.split("×").map(Number);
  if (d.w !== w || d.h !== h) bad.push(`${jp} 是 ${d.w}×${d.h}，宣告的是 ${g.圖檔}`);
  if (d.t !== "jpeg" && d.t !== "png") bad.push(`${jp} 型別 ${d.t}，LINE 只吃 JPEG／PNG`);
  const r = d.w / d.h;
  if (r < H.比例下限) bad.push(`${jp} 比例 ${r.toFixed(3)} < LINE 的下限 ${H.比例下限}`);
  if (d.w < H.寬[0] || d.w > H.寬[1]) bad.push(`${jp} 寬 ${d.w} 不在 ${H.寬.join("~")}`);
  if (d.h < H.高下限) bad.push(`${jp} 高 ${d.h} < ${H.高下限}`);
  const kb = fs.statSync(jp).size / 1024;
  if (kb > H.檔案上限KB) bad.push(`${jp} ${kb.toFixed(0)}KB 超過 LINE 的 ${H.檔案上限KB}KB`);
  if (Math.round(kb) !== g.檔案KB) bad.push(`${jp} 實檔 ${Math.round(kb)}KB，numbers 記的是 ${g.檔案KB}KB`);

  /* 規格頁擺的那一份（1125 寬 ＝ 螢幕寬的三倍）——每一格都要有 */
  const sp = path.join(DIR, `strip-${g.id}.jpg`);
  used.add(path.basename(sp));
  if (!fs.existsSync(sp)) bad.push(`${sp} 不在`);
  else {
    const ds = dims(sp);
    if (ds.w !== g.strip.w || ds.h !== g.strip.h)
      bad.push(`${sp} 是 ${ds.w}×${ds.h}，產生器算的是 ${g.strip.w}×${g.strip.h}`);
  }
  /* ⚠ 整支手機那張只有三格有（現況 ＋ 兩族各一張建議）——寫死成每一格都有會誤報孤兒檔 */
  if (g.chat) used.add(`chat-${g.id}.jpg`);
}
/* 頁上每一張圖：檔案要在、width/height 要等於實檔、alt 要有 */
for (const m of html.matchAll(/<img\s([^>]*)>/g)) {
  const a = (k) => (m[1].match(new RegExp(`${k}="([^"]*)"`)) || [])[1];
  const src = a("src"), w = +a("width"), h = +a("height");
  if (!src) { bad.push("有一張 <img> 沒有 src"); continue; }
  used.add(src);
  const p = path.join(DIR, src);
  if (!fs.existsSync(p)) { bad.push(`頁上引用的 ${src} 不在`); continue; }
  const d = dims(p);
  if (d.w !== w || d.h !== h) bad.push(`${src} 實檔 ${d.w}×${d.h}，屬性寫 ${w}×${h}`);
  if (!a("alt")) bad.push(`${src} 沒有 alt`);
  const gc = N.格.find((g) => src === `chat-${g.id}.jpg`);
  if (gc && (d.w !== gc.chat.w || d.h !== gc.chat.h))
    bad.push(`${src} 實檔 ${d.w}×${d.h}，產生器算的是 ${gc.chat.w}×${gc.chat.h}`);
  const gs = N.格.find((g) => src === `strip-${g.id}.jpg`);
  if (gs && (d.w !== gs.strip.w || d.h !== gs.strip.h))
    bad.push(`${src} 實檔 ${d.w}×${d.h}，產生器算的是 ${gs.strip.w}×${gs.strip.h}`);
}
for (const f of fs.readdirSync(DIR)) if (!used.has(f)) bad.push(`孤兒檔：${DIR}/${f}`);

/* ── ⑤ noindex／零 JS ────────────────────────────────────────────── */
if (!/<meta name="robots" content="noindex, nofollow, noarchive">/.test(html))
  bad.push("noindex 那一行不見了");
if (/<script/i.test(html)) bad.push("這一頁不該有 <script>");

/* ── ⑦ 紅線（第十一之三節）───────────────────────────────────────── */
const body = html.slice(html.indexOf("<body"));
for (const w of ["隨時問", "隨時詢問", "即時回覆您", "有問題歡迎私訊", "專人為您", "馬上回覆"])
  if (body.includes(w)) bad.push(`紅線：頁面上出現「${w}」—— 這個帳號沒有專人即時回覆`);

/* ── ⑥ 算繪 ──────────────────────────────────────────────────────── */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chromePath = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const br = await chromium.launch({ executablePath: fs.existsSync(chromePath) ? chromePath : undefined });
for (const W of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  const pg = await br.newPage({ viewport: { width: W, height: 900 } });
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e)));
  await pg.goto("file://" + path.resolve(PAGE));
  /* ⚠⚠ 畫面外的圖是 loading="lazy"，**永遠不會開始載** —— 直接等 `complete`
     會掛住不動、不報錯也不結束（踩過）。要先整批催成 eager，再等。
     ⚠ 兩步分開寫：先跑完整個 for 迴圈，再建那些 Promise（同 check-post-map.mjs）。
     ⚠⚠⚠ **等的條件只能看 `complete`，不可以加 `&& naturalWidth`** —— 一張載不到的圖
     `error` 燒完之後就是 `complete: true、naturalWidth: 0`，加了那一項會替它掛一個
     **永遠不會再有事件的 Promise**，整支守門就停在這裡不動、不報錯也不結束。
     症狀是「少一個圖檔的時候守門跑不完」，而那正是它最該報話的時候（踩過）。
     壞掉的圖底下那一段 `broken` 本來就在報，不必也不可以拿它當等待條件。
     ⚠ 再加一道 4 秒的保險絲：任何等待都不可以沒有盡頭。 */
  await pg.evaluate(async () => {
    for (const i of document.images) i.loading = "eager";
    await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => {
      i.onload = i.onerror = r; setTimeout(r, 4000);
    })));
  });
  const r = await pg.evaluate(() => ({
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")),
    /* 畫出來多寬 —— 屬性寫對不等於畫出來是那個大小 */
    shots: [...document.images].map((i) => ({ src: i.getAttribute("src"),
      w: +i.getBoundingClientRect().width.toFixed(1) })),
  }));
  if (r.over > 0) bad.push(`${W} 寬水平溢出 ${r.over}px`);
  if (r.broken.length) bad.push(`${W} 寬載不到：${r.broken.join("、")}`);
  if (errs.length) bad.push(`${W} 寬 JS 錯：${errs[0]}`);
  /* 模擬圖要畫成 375（＝手機上真正的大小），螢幕更窄時才跟著縮 */
  const want = Math.min(375, W - 28);
  for (const s of r.shots)
    if (Math.abs(s.w - want) > 1)
      bad.push(`${W} 寬：${s.src} 畫出來 ${s.w}px，應該是 ${want}px`);
  await pg.close();
}
await br.close();

if (bad.length) { console.error("✗ " + bad.length + " 件\n" + bad.map((b) => "  ・" + b).join("\n")); process.exit(1); }
console.log(`✓ 圖文選單那一頁：${N.格.length} 格、${used.size - 1} 個檔、八個寬度都過`);
