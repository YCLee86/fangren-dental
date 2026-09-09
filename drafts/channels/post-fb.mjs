/* 同一組貼文圖搬到 **Facebook** 上
 *   node drafts/channels/post-fb.mjs
 *
 * 起點是 2026-09-09 使用者：「這三個圖片似乎也很適合放在臉書上　看一下臉書的圖片尺寸
 *   你們討論要調整成什麼樣子　做好給我看」。
 *
 * ⚠⚠⚠ 查過之後的結論是「**尺寸、版面、文字都不用改，只有浮水印要改**」——
 *   所以這一支不是另做一套圖，是**用同樣那三支產生器、只把浮水印切成臉書版**
 *   （`WM_MODE=fb`，見 wm-triptych.mjs）。三張圖的內容一個像素都沒有另外畫，
 *   不然就會長出第二個真相：哪天門診表改了排班，臉書那一份還停在舊的。
 *
 * ── 為什麼只有浮水印要改（第九節第 28 條 ⑤）──
 *   那顆標誌是**騎在 LINE 主頁三格的十字縫上**的，三格同時出現才拼得成一顆圓。
 *   臉書是一則一則被看到的（而且中間隔著別人的貼文、隔著好幾天），
 *   每一張上只剩一塊往畫布外流出去的弧 —— 讀起來是一團淡灰，不是標誌。
 *   ⚠ 「拼成一顆」在 LINE 上是設計，在臉書上是壞掉，而**圖檔完全沒變**，
 *     變的是它被看到的方式。
 *
 * ── 為什麼尺寸不用改 ──
 *   臉書動態的方形貼文原生就是 1080×1080（1:1），我們這三張正好是。
 *   ⚠ 常看到的 1200×630 是**連結預覽卡**的規格，不是照片貼文的，不要拿來套。
 *   ⚠ 4:5（1080×1350）在手機上佔更多畫面，但這三張的內容都是方的，
 *     拉成 4:5 只會在上下多出兩條空白 —— 換版型換不到東西。
 *
 * ── 為什麼版面不用改（而且反而變好）──
 *   用使用者那張後台截圖量到的三格（iPhone 1125 寬）換算「佔螢幕多寬」：
 *     LINE 大格 1023/1125 ＝ 90.9%　　LINE 小格 508/1125 ＝ 45.2%
 *     臉書動態的照片 ＝ **滿版 100%**
 *   所以搬到臉書上：門診表那張**一樣大**，另外兩張**變成兩倍大**。
 *   ⚠⚠ 而且門診表那張在 LINE 大格是 cover 裁切、只看得到中間 537 列
 *     （標題「芳仁牙醫開診時段」與最底下那行電話**在 LINE 上根本看不到**），
 *     臉書整張 1080 都看得到 —— 那兩樣是免費拿回來的。
 *
 * ── 產出 ──
 *   `fangren-fb-<格>-1080.png`　　要上傳的那三張（浮水印整顆進到畫布裡）
 *   `fb-<格>-d<直徑>.png`　　　　 「整顆進來之後要多大」那把尺的另外兩格
 *   `feed-<格>.png`　　　　　　　 在臉書動態上長什麼樣（375 CSS px 的手機，3×）
 *   `detail-<格>.txt`　　　　　　 貼文的文字（**從那一則自己的 .txt 讀回來，不重打**）
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TRI, wmFor } from "./wm-triptych.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT  = path.join(ROOT, "preview", "fb-post");
fs.mkdirSync(OUT, { recursive: true });

const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";

/* ⚠ 「整顆進來之後要多大」是他的眼睛才判斷得了的，所以給一把尺（第 28 條 ①）。
   ⚠ 656 不是新猜的值 —— 那正是三格版那一顆畫在**門診表**上的大小，
     ＝ 他這幾天一直在看的那一顆，只是不再被畫布切掉。 */
const DIAS = [560, 656, 760];
const REC = 656;

const TILES = [
  { k: "hours", gen: "post-hours.mjs",
    img: ["preview", "line-post-hours", "fangren-hours-1080.png"],
    txt: ["preview", "line-post-hours", "detail.txt"],
    name: "門診表", spec: "/preview/line-post-hours/", corner: "下方" },
  { k: "docs", gen: "post-docs.mjs",
    img: ["preview", "line-post-docs", "fangren-docs-1080.png"],
    txt: ["preview", "line-post-docs", "detail.txt"],
    name: "科別與醫師", spec: "/preview/line-post-docs/", corner: "右上" },
  { k: "map", gen: "post-map-door.mjs",
    img: ["preview", "line-post-map", "fangren-map-1080.png"],
    txt: ["preview", "line-post-map", "door-detail.txt"],
    name: "位置與周邊停車", spec: "/preview/line-post-map/", corner: "左上" },
];

const run = (script, env) => execFileSync("node", [path.join(HERE, script)],
  { cwd: ROOT, env: { ...process.env, ...env }, stdio: "pipe" });

const finalOf = (k) => `fangren-fb-${k}-1080.png`;
const fileOf = (k, dia) => dia === REC ? finalOf(k) : `fb-${k}-d${dia}.png`;

/* ---------- 第一步：三張圖 × 三個直徑 ---------- */
for (const dia of DIAS) {
  for (const t of TILES) {
    run(t.gen, { WM_MODE: "fb", WM_SOLO_DIA: String(dia) });
    fs.copyFileSync(path.join(ROOT, ...t.img), path.join(OUT, fileOf(t.k, dia)));
  }
  console.log(`  直徑 ${dia}　三張跑完`);
}
/* ⚠⚠ 一定要用預設（三格版）再跑一次 —— 不然 repo 裡那三張 LINE 的成品會停在
   臉書版的浮水印上，而且看起來很正常、沒有人會發現（同 post-triptych.mjs）。 */
for (const t of TILES) run(t.gen, {});
console.log("  ✓ 已還原：LINE 那三張是三格拼一顆的版本");

/* ---------- 第二步：文字（讀回來，不重打） ---------- */
/* ⚠⚠⚠ 臉書**有留言區**，所以第十一之三節那條紅線在這裡回來了 ——
   LINE 主頁那個模組沒有留言區（README 第三十四節確認過），
   臉書有，而這個帳號一樣沒有專人回覆。**不可以寫「有問題留言問我們」。**
   ⚠ 三則現在一句都沒有踩到，這一道是擋「日後有人為了臉書多寫一句」。 */
const RED = [/隨時(問|詢問|聯絡)/, /有問題.{0,6}(問|留言|私訊)/, /(留言|私訊).{0,4}(問我們|詢問|告訴我們)/,
             /二十四小時/, /24\s*小時.{0,4}(回|客服)/, /即時回(覆|應)/, /小編/];
const texts = {};
for (const t of TILES) {
  const s = fs.readFileSync(path.join(ROOT, ...t.txt), "utf8").replace(/\s+$/, "");
  for (const re of RED) if (re.test(s)) throw new Error(`${t.name} 的文字踩到紅線：${re}`);
  texts[t.k] = s;
  fs.writeFileSync(path.join(OUT, `detail-${t.k}.txt`), s + "\n");
}

/* ---------- 第三步：在臉書動態上長什麼樣 ---------- */
/* ⚠ 手機是 375 CSS px（iPhone 那一台，＝使用者那張後台截圖的 1125 ÷ 3），
   照片在動態裡是**滿版**，所以 1080 的圖畫出來就是 375 CSS px 寬。
   ⚠⚠ 這一張是模擬**臉書自己的介面**，不是我們的版面 —— 字級、頭像大小、
   折疊那一行都照臉書手機版的樣子做，不要套站上的尺寸。 */
const COL = 375;
const b64 = (f, mime = "image/png") =>
  `data:${mime};base64,` + fs.readFileSync(f).toString("base64");
const AVATAR = b64(path.join(ROOT, "assets", "icon-192.png"));

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const feedHtml = (t, uri, body = texts[t.k]) => `<!doctype html><meta charset="utf-8">
<style>
*{box-sizing:border-box;margin:0}
body{width:${COL}px;background:#fff;color:#050505;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif;-webkit-font-smoothing:antialiased}
.hd{display:flex;align-items:center;gap:8px;padding:12px 12px 8px}
.hd img{width:40px;height:40px;border-radius:50%;display:block}
.hd .nm{font-size:15px;font-weight:600;line-height:1.2}
.hd .mt{font-size:13px;color:#65676b;line-height:1.3;margin-top:2px}
.hd .dots{margin-left:auto;color:#65676b;font-size:18px;letter-spacing:2px}
/* 折疊：臉書手機版大約三行之後收成「查看更多」。
   ⚠ 用寫死的 max-height 不用 -webkit-line-clamp —— 那個屬性配 white-space:pre-wrap
   量出來會多一行（clientHeight 不等於 clamp 的行數），而這一頁要印的正是行數。 */
.tx{padding:0 12px;font-size:15px;line-height:20px;white-space:pre-wrap;
    max-height:60px;overflow:hidden}
.more{padding:0 12px 10px;font-size:15px;color:#65676b}
.ph img{width:${COL}px;height:${COL}px;display:block}
.bar{display:flex;border-top:1px solid #ced0d4;margin-top:6px}
.bar div{flex:1;text-align:center;padding:8px 0;font-size:14px;color:#65676b;font-weight:600}
</style>
<div class="hd"><img src="${AVATAR}" alt="">
  <div><div class="nm">芳仁牙醫診所</div><div class="mt">剛剛 · 公開</div></div>
  <div class="dots">···</div></div>
<div class="tx" id="tx">${esc(body)}</div>
<div class="more">查看更多</div>
<div class="ph"><img src="${uri}" alt=""></div>
<div class="bar"><div>讚</div><div>留言</div><div>分享</div></div>`;

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

/* ⚠⚠⚠ 一件只有在臉書上才看得出來的（第 28 條 ⑤）：**地圖那則的前兩句，
   圖上已經印著一模一樣的兩句。** LINE 那邊「詳情」是收起來的、要按一下才展開，
   所以重複看不出來；臉書的文字**就貼在圖的正上方**，同兩句連著出現兩次。
   ⚠ 沒有自己改掉那一則的文字（它和 LINE 那一份是同一個出處），
     只多做一張「前兩句拿掉」的模擬讓使用者比 —— 要不要換是他的決定。 */
const ALT = { map: texts.map.split("\n").slice(2).join("\n") };
for (const [k, s] of Object.entries(ALT))
  fs.writeFileSync(path.join(OUT, `detail-${k}-alt.txt`), s + "\n");

const fold = {};
for (const t of TILES) {
  const pg = await browser.newPage({
    viewport: { width: COL, height: 800 }, deviceScaleFactor: 3 });
  await pg.setContent(feedHtml(t, b64(path.join(OUT, finalOf(t.k)))));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  /* 折疊線之上實際露出幾行、幾個字 —— 臉書會截掉的那一刀在哪裡 */
  fold[t.k] = await pg.evaluate(() => {
    const el = document.getElementById("tx");
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    return { lines: Math.round(el.clientHeight / lh),
             all: Math.round(el.scrollHeight / lh) };
  });
  const box = await pg.locator("body").boundingBox();
  await pg.setViewportSize({ width: COL, height: Math.ceil(box.height) });
  await pg.screenshot({ path: path.join(OUT, `feed-${t.k}.png`) });
  await pg.close();

  if (ALT[t.k]) {
    const p2 = await browser.newPage({
      viewport: { width: COL, height: 800 }, deviceScaleFactor: 3 });
    await p2.setContent(feedHtml(t, b64(path.join(OUT, finalOf(t.k))), ALT[t.k]));
    await p2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
    const bb = await p2.locator("body").boundingBox();
    await p2.setViewportSize({ width: COL, height: Math.ceil(bb.height) });
    await p2.screenshot({ path: path.join(OUT, `feed-${t.k}-alt.png`) });
    await p2.close();
  }
}
await browser.close();

/* ---------- 第四步：規格頁 ---------- */
const png = f => { const b = fs.readFileSync(path.join(OUT, f));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) }; };

const shot = (f, wCss, cap) => { const d = png(f);
  return `<figure class="pv-shot"><img src="${f}" width="${wCss}" height="${Math.round(d.h * wCss / d.w)}"`
    + ` alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`; };

const rows = TILES.map(t => {
  const g = wmFor(t.k, { mode: "fb", dia: REC });
  return `<tr><td>${t.name}</td><td><code>${finalOf(t.k)}</code></td>`
    + `<td>${png(finalOf(t.k)).w}×${png(finalOf(t.k)).h}・${png(finalOf(t.k)).kb}KB</td>`
    + `<td>${t.corner}</td><td><a href="${t.spec}">完整規格</a></td></tr>`;
}).join("\n");

const cases = TILES.map(t => `
<h3 class="pv-h3">${t.name}</h3>
<div class="pv-row">
${DIAS.map(d => shot(fileOf(t.k, d), 240,
  `直徑 ${d}${d === REC ? "（建議）" : ""}`)).join("\n")}
</div>`).join("\n");

const feeds = TILES.map(t => shot(`feed-${t.k}.png`, 300,
  `${t.name}　折疊線之上露出 ${fold[t.k].lines}／${fold[t.k].all} 行`)).join("\n");

const html = `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>臉書貼文｜芳仁牙醫診所</title>
<style>
*{box-sizing:border-box;margin:0}
body{background:#e2e5e6;color:${INK};font-size:15px;line-height:1.75;
     font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
     padding:24px 14px 64px}
.pv-wrap{max-width:760px;margin:0 auto}
h1{font-size:1.5rem;line-height:1.5;letter-spacing:.02em}
.pv-lead{color:${SOFT};margin-top:8px}
.pv-h2{font-size:1.15rem;margin:36px 0 10px;padding-top:16px;border-top:1px solid ${RULE};
       letter-spacing:.02em}
.pv-h2 .t{font-size:.8rem;color:${SOFT};font-weight:400;margin-left:.6em;letter-spacing:0}
.pv-h3{font-size:1rem;margin:22px 0 8px;color:${SOFT};letter-spacing:.02em}
.pv-cap{color:${SOFT};font-size:.9rem;line-height:1.85;margin-bottom:12px}
.pv-row{display:flex;flex-wrap:wrap;gap:14px}
.pv-shot{background:${CARD};border:1px solid ${RULE};border-radius:12px;padding:10px;margin:0}
.pv-shot img{display:block;border-radius:6px;max-width:100%;height:auto}
.pv-shot figcaption{font-size:.8rem;color:${SOFT};margin-top:8px;line-height:1.6}
table{border-collapse:collapse;width:100%;min-width:520px;background:${CARD};
      font-size:.88rem;border:1px solid ${RULE};border-radius:8px}
th,td{border-bottom:1px solid ${RULE};padding:8px 10px;text-align:left;vertical-align:top}
th{color:${SOFT};font-weight:600;white-space:nowrap}
.pv-scroll{overflow-x:auto}
code{font-size:.86em;background:#e8e9ea;padding:1px 5px;border-radius:4px}
/* ⚠ 那幾條 maps.app.goo.gl 的網址是一整串沒有空白的字，pre-wrap 斷不了它 ——
   320 寬上會整條凸出去（水平溢出 19px）。 */
pre{background:${CARD};border:1px solid ${RULE};border-radius:8px;padding:12px 14px;
    white-space:pre-wrap;overflow-wrap:anywhere;font-size:.9rem;line-height:1.85;
    font-family:"Noto Sans TC","PingFang TC",sans-serif}
a{color:#214d48}
ul{padding-left:1.3em}li{margin:.35em 0}
b{font-weight:700}
</style></head><body><div class="pv-wrap">

<h1>這三張圖貼到臉書上</h1>
<p class="pv-lead">2026-09-09。<b>尺寸、版面、文字都不用改，只有浮水印要改。</b>
下面是為什麼，以及要上傳的那三張。</p>

<h2 class="pv-h2">要改的那一件<span class="t">浮水印</span></h2>
<p class="pv-cap">
那顆標誌是<b>騎在 LINE 主頁三格中間那個十字縫上</b>的 ——
三格同時出現才拼得成一顆圓。<br>
臉書是<b>一則一則被看到的</b>，中間隔著別人的貼文、隔著好幾天，
所以每一張上只剩<b>一塊往畫布外流出去的弧</b>，讀起來是一團淡灰、不是標誌。<br>
⚠ 圖檔一個像素都沒變，變的是它被看到的方式。<br>
改法：<b>每一張各自一顆完整的標誌，貼在它原本那一角、整顆進到畫布裡。</b>
形狀（那顆圓的 <code>r3c1</code>）、濃度（4%）、角落（門診表下方／科別醫師右上／地圖左上）
全部沿用你挑定的那一組，只改「完整」這一件。</p>

<h2 class="pv-h2">不用改的三件<span class="t">查過的數字</span></h2>
<p class="pv-cap">
<b>尺寸</b>　臉書動態的方形照片貼文原生就是 1080×1080（1:1），這三張正好是。
⚠ 常看到的 1200×630 是<b>連結預覽卡</b>的規格，不是照片貼文的；
4:5（1080×1350）在手機上佔更多畫面，但這三張的內容是方的，
拉成 4:5 只會在上下多兩條空白。<br>
<b>版面</b>　拿你那張後台截圖量到的三格換算「佔螢幕多寬」：
LINE 大格 <b>90.9%</b>、小格 <b>45.2%</b>，而臉書的照片是<b>滿版 100%</b> ——
所以門診表那張<b>一樣大</b>，另外兩張<b>變成兩倍大</b>。<br>
<b>文字</b>　三則都已經第一行講完那件事，臉書折疊線之上就讀得完；
一句紅線也沒有踩到（產生器每次都掃）。</p>
<p class="pv-cap">
⚠⚠ 順帶一件是免費撿到的：門診表那張在 LINE 大格是 cover 裁切、只看得到中間 537 列，
<b>標題「芳仁牙醫開診時段」與最下面那行電話在 LINE 上根本看不到</b>；
臉書整張 1080 都看得到，那兩樣自己回來了。</p>

<h2 class="pv-h2">要上傳的那三張<span class="t">1080×1080・PNG</span></h2>
<div class="pv-scroll"><table>
<tr><th>貼文</th><th>檔案</th><th>尺寸</th><th>標誌在哪一角</th><th></th></tr>
${rows}
</table></div>

<h2 class="pv-h2">在臉書動態上長什麼樣<span class="t">375px 的手機</span></h2>
<p class="pv-cap">照片在動態裡是滿版，所以 1080 的圖畫出來就是螢幕那麼寬。
文字大約三行之後收成「查看更多」。</p>
<div class="pv-row">${feeds}</div>

<h2 class="pv-h2">那顆標誌整顆進來之後要多大<span class="t">三格，建議 ${REC}</span></h2>
<p class="pv-cap">${REC} 不是新猜的值 —— 那正是三格版那一顆<b>畫在門診表那張上的大小</b>，
也就是你這幾天一直在看的那一顆，只是不再被畫布切掉。
另外兩格一格小一點、一格大一點。</p>
${cases}

<h2 class="pv-h2">貼的時候三件事</h2>
<ul>
<li><b>三張分開貼，不要一次貼三張。</b>臉書會把多張照片自動排成格狀、
<b>每一張再各自裁一次</b>，而且不同裝置排法不一樣 —— 那正好是我們花了好幾輪
在治的那件事。一次一則，就是滿版的完整一張。</li>
<li><b>門診表那則釘選在最上面。</b>臉書的貼文有日期，半年後它看起來像舊消息；
LINE 主頁那個模組沒有時間戳，所以這件事只有臉書要處理。</li>
<li><b>臉書有留言區。</b><span data-red>這個帳號沒有專人即時回覆，所以文字裡
不可以寫「有問題留言問我們」那一類的話</span>（現在一句都沒有，是要記著別加）。</li>
</ul>

<h2 class="pv-h2">貼文的文字<span class="t">整段複製</span></h2>
<p class="pv-cap">⚠ 這三段和 LINE 那三則<b>逐字相同</b>，是從那一則自己的檔案讀回來的、
沒有重打。要改文字就回那一頁改，這裡會跟著換。</p>
${TILES.map(t => `<h3 class="pv-h3">${t.name}</h3><pre>${esc(texts[t.k])}</pre>`).join("\n")}

<h2 class="pv-h2">一件只有臉書才看得出來的<span class="t">地圖那則</span></h2>
<p class="pv-cap">
那一則的<b>前兩句，圖上已經印著一模一樣的兩句</b>。
LINE 那邊「詳情」是收起來的、要按一下才展開，所以看不出重複；
臉書的文字<b>就貼在圖的正上方</b>，同兩句連著出現兩次。<br>
⚠ 沒有自己改掉 —— 那一則的文字和 LINE 那一份是同一個出處，改了兩邊就分家。
下面是兩種擺法，<b>要不要換是你的決定</b>。</p>
<div class="pv-row">
${shot("feed-map.png", 260, "現在這樣（照 LINE 那一份）")}
${shot("feed-map-alt.png", 260, "前兩句拿掉（圖上已經寫了）")}
</div>

<h2 class="pv-h2">還沒問到的</h2>
<ul>
<li><b>兩張小的上面沒有寫診所名字。</b>科別與醫師那張的標題是你 09-09 指定拿掉的
（理由是「上面那格門診表已經寫著芳仁牙醫」）—— 在臉書上三則是分開的，那個理由不成立。
不過臉書每一則貼文<b>上面本來就有粉專的名字與頭像</b>，所以只有在圖被單獨存下來、
轉傳出去的時候才看得出差別。<b>要不要把標題加回臉書版，是你的決定，沒有自己動。</b></li>
<li>臉書的圖片規格是查來的（Meta 自己的說明頁這個容器連不出去），
數字和我們用得到的那幾項都一致，但<b>是二手的</b>。</li>
</ul>

</div></body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), html);

/* ---------- 面板 ---------- */
console.log(`\n── 臉書上顯示多寬（同一支手機，1125 裝置 px）──`);
console.log(`  LINE 大格 1023/1125 ＝ 90.9%　LINE 小格 508/1125 ＝ 45.2%　臉書照片 ＝ 滿版 100%`);
console.log(`  → 門診表一樣大（而且從看得到 537 列變成 1080 列 ＝ 多 101%）、兩張小的大一倍`);

console.log(`\n── 浮水印：三格版 vs 臉書版 ──`);
for (const t of TILES) {
  const a = wmFor(t.k, { mode: "tri" }), b = wmFor(t.k, { mode: "fb", dia: REC });
  const inside = (x, y, w, h) => {
    const l = Math.max(0, x), r = Math.min(TRI.CANVAS, x + w);
    const u = Math.max(0, y), d = Math.min(TRI.CANVAS, y + h);
    return Math.max(0, r - l) * Math.max(0, d - u) / (w * h);
  };
  console.log(`  ${t.name.padEnd(7, "　")}　三格版 ${String(a.w).padStart(6)}px・進到畫布裡的 `
    + `${(inside(a.left, a.top, a.w, a.h) * 100).toFixed(0)}%`
    + `　→　臉書版 ${b.w}px・${(inside(b.left, b.top, b.w, b.h) * 100).toFixed(0)}%（${t.corner}）`);
}

console.log(`\n── 折疊線（臉書手機版大約三行）──`);
for (const t of TILES)
  console.log(`  ${t.name.padEnd(7, "　")}　露出 ${fold[t.k].lines}／${fold[t.k].all} 行`
    + `　第一行「${texts[t.k].split("\n")[0]}」`);

console.log(`\n── 要上傳的那三張 ──`);
for (const t of TILES) { const d = png(finalOf(t.k));
  console.log(`  ${t.name.padEnd(7, "　")}　${finalOf(t.k)}　${d.w}×${d.h}・${d.kb}KB`
    + `（臉書上限 8MB）`); }
console.log(`\n  尺　直徑 ${DIAS.join("／")}（建議 ${REC}）　共 ${DIAS.length * TILES.length} 張`);
console.log(`  紅線 0 處　⚠ 臉書有留言區，第十一之三節那條在這裡回來了`);
console.log(`\n  規格頁　/preview/fb-post/`);
