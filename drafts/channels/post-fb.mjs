/* 同一組貼文圖搬到 **Facebook**
 *   node drafts/channels/post-fb.mjs
 *
 * 2026-09-09 使用者第二輪：「**因為臉書沒有像 line 那樣的版面　我比較傾向用之前的版本
 *   單一張看順眼就好**　但你們還是把這兩張和地圖弄成臉書適合的尺寸
 *   **地圖也挑一個不一樣的浮水印**壓上去　預覽給我看」。
 *
 * ⚠⚠⚠ 所以臉書版**不是**三格拼一顆，是**回到三格版之前那一組「一張一顆」的浮水印**
 *   —— 那一組每一個值都是他 2026-09-08 自己在那兩頁上挑定的，這裡一個都沒有改：
 *     門診表　　r3c1・660px・壓右下（right −60 / top 470）・5%・壓在表的後面
 *     科別醫師　r1c2・952px・壓左上・左邊切 440・4%・壓在最上面
 *   **只有地圖那一張是新決定**（他指定要不一樣的），做成一把尺。
 *
 * ⚠⚠ 三張圖的內容**一個像素都沒有另外畫** —— 用的是同樣那三支產生器，
 *   只把浮水印切成臉書版（`WM_MODE=fb`，見 wm-triptych.mjs 的 `FB`）。
 *   另做一套就會長出第二個真相：哪天改了排班，臉書那一份還停在舊的。
 *
 * ⚠ 跑完會**用預設值（三格版）再跑一次**，把 LINE 那三張還原回去 ——
 *   少了那一步，repo 裡的 LINE 成品會停在臉書版的浮水印上，三張接不成一顆圓
 *   **而且每一張看起來都很正常**（守門第 ⑨ 道就是為這件事讀角落像素的）。
 *
 * ── 臉書適合的尺寸（查過的，二手：Meta 自己的說明頁這個容器連不出去）──
 *   臉書動態的**方形照片貼文原生就是 1080×1080（1:1）**，這三張正好是。
 *   ⚠ 常看到的 **1200×630 是「連結預覽卡」的規格**，不是照片貼文的，不要拿來套。
 *   ⚠ **4:5（1080×1350）** 在手機上佔更多畫面，但這三張的內容是方的，
 *     拉成 4:5 只會在上下多兩條空白 —— 換版型換不到東西。
 *   ⚠ 檔案上限 8MB，這三張是 100~200KB。
 *
 * ── 產出（都放 `preview/fb-post/`）──
 *   `fangren-fb-<格>-1080.png`　要上傳的那三張
 *   `fb-map-<形狀>.png`　　　　 地圖浮水印那把尺的其餘幾格
 *   `feed-<格>.png`　　　　　　 在臉書動態上長什麼樣（375 CSS px 的手機，3×）
 *   `detail-<格>.txt`　　　　　 貼文的文字（**從那一則自己的 .txt 讀回來，不重打**）
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FB, fbWidth, wmFor, shapeRatio } from "./wm-triptych.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT  = path.join(ROOT, "preview", "fb-post");
fs.mkdirSync(OUT, { recursive: true });

const CARD = "#f4f4f5", RULE = "#cdd0d2", INK = "#2a2c27", SOFT = "#5c5f57";

/* ⚠ 地圖那一顆的形狀是尺（第九節第 28 條 ①）。
   ⚠⚠ **r3c1 與 r1c2 不在名單裡** —— 那兩顆已經是門診表與科別醫師的，
     他要的正是「不一樣」。
   ⚠ 每一格旁邊那個比例是**長寬比**：門診表 1.00、科別醫師 2.03，
     所以真正和兩張都分得出來的只有 r2c2（1.33）與 r2c3（3.08）那兩族。 */
const MAPWM = ["r2c2", "r1c1", "r3c2", "r2c1", "r2c3"];
const REC = FB.map.shape;   /* 建議的那一格（＝ WM_FB_MAP 的預設） */

const TILES = [
  { k: "hours", gen: "post-hours.mjs",
    img: ["preview", "line-post-hours", "fangren-hours-1080.png"],
    txt: ["preview", "line-post-hours", "detail.txt"],
    name: "門診表", spec: "/preview/line-post-hours/" },
  { k: "docs", gen: "post-docs.mjs",
    img: ["preview", "line-post-docs", "fangren-docs-1080.png"],
    txt: ["preview", "line-post-docs", "detail.txt"],
    name: "科別與醫師", spec: "/preview/line-post-docs/" },
  { k: "map", gen: "post-map-door.mjs",
    img: ["preview", "line-post-map", "fangren-map-1080.png"],
    txt: ["preview", "line-post-map", "door-detail.txt"],
    name: "位置與周邊停車", spec: "/preview/line-post-map/" },
];
const byKey = Object.fromEntries(TILES.map(t => [t.k, t]));

const run = (script, env) => execFileSync("node", [path.join(HERE, script)],
  { cwd: ROOT, env: { ...process.env, ...env }, stdio: "pipe" });

const finalOf = (k) => `fangren-fb-${k}-1080.png`;
const mapFileOf = (sh) => sh === REC ? finalOf("map") : `fb-map-${sh}.png`;

/* ---------- 第一步：門診表與科別醫師（各一張，值都是他挑定的） ---------- */
for (const k of ["hours", "docs"]) {
  const t = byKey[k];
  run(t.gen, { WM_MODE: "fb" });
  fs.copyFileSync(path.join(ROOT, ...t.img), path.join(OUT, finalOf(k)));
}
/* ---------- 第二步：地圖 × 五顆候選 ---------- */
for (const sh of MAPWM) {
  run(byKey.map.gen, { WM_MODE: "fb", WM_FB_MAP: sh });
  fs.copyFileSync(path.join(ROOT, ...byKey.map.img), path.join(OUT, mapFileOf(sh)));
}
/* ⚠⚠ 一定要用預設（三格版）再跑一次 */
for (const t of TILES) run(t.gen, {});
console.log("  ✓ 已還原：LINE 那三張是三格拼一顆的版本");

/* ---------- 第三步：文字（讀回來，不重打） ---------- */
/* ⚠⚠⚠ 臉書**有留言區**，所以第十一之三節那條紅線在這裡回來了 ——
   LINE 主頁那個模組沒有留言區（README 第三十四節確認過），臉書有，
   而這個帳號一樣沒有專人回覆。**不可以寫「有問題留言問我們」。**
   ⚠ 三則現在一句都沒有踩到，這一道是擋「日後有人為了臉書多寫一句」。 */
const RED = [/隨時(問|詢問|聯絡)/, /有問題.{0,6}(問|留言|私訊)/, /(留言|私訊).{0,4}(問我們|詢問|告訴我們)/,
             /二十四小時/, /24\s*小時.{0,4}(回|客服)/, /即時回(覆|應)/, /小編/];
/* ---------- 關鍵字標籤（hashtag）：一把三格的尺，預設不加 ----------
   2026-09-09 使用者：「每張相片的文字說明是不是也能 tag 關鍵字？你們想一下」。

   ⚠⚠⚠ **三件先講清楚，因為它們決定這把尺怎麼給：**

   ① **hashtag 在臉書多半是「出口」不是「入口」。** 點下去會離開這個粉專、
      進到那個標籤的公開動態（滿滿別人的貼文）。唯一不會把人送走的，是**只有
      我們在用的那一個**（`#芳仁牙醫診所`）—— 那個標籤頁基本上就是這個粉專的貼文。
      **所以「加幾個」不是重點，「哪一個把人送去哪裡」才是。**

   ② **紅線在這裡最容易踩，而且是這一整條線既有的那一條**（第三十四節 ⑫
      「促銷優惠抽獎 ＝ 紅線」同一族）：`#推薦`／`#最好`／`#第一`／`#無痛`／
      `#免費` 這一類**評價性或招徠性**的字，醫療機構不要碰。
      底下的 `TAG_RED` 在掃，踩到就 throw。
      ⚠ `#斗六牙醫` 這種**地區＋科別**的是事實描述、不是評價，所以三格裡有它；
        但那仍然是「看起來在做行銷」的一步，**要不要走是診所的決定**。

   ③ **這一段只作用在臉書。** LINE 主頁那個模組的「詳情」欄沒有 hashtag 這回事，
      而三則的文字是**從 LINE 那三份 detail.txt 讀回來的**（不重打）——
      所以標籤一律**用 append 的**、接在最後面，那三份原始檔一個字都不會動。
      **不要為了加標籤去改它們**，那會讓兩條線分家。
      ⚠ 上一句本來想寫成帶萬用字元的路徑，那兩個字元會把這整段註解提早關掉
      （第九節第 8 條，這條線第三次踩）—— 路徑不要那樣寫進區塊註解。

   ⚠ 排版三條：**接在最後、前面空一行**（前三行是折疊線之上，標籤佔在那裡是浪費）、
     **一則最多三個**、**標籤裡不能有空白或全形符號**（那些符號會把標籤截斷，
     而且遇到空白就結束 ——「#芳仁 牙醫」會變成只有「#芳仁」）。

   切法：`FB_TAGS=none|brand|topic`（預設 none ＝ 他還沒挑）。 */
const TAG_RED = /推薦|最好|最佳|第一|唯一|保證|無痛|免費|優惠|便宜|權威|名醫|首選/;
const TAGS = {
  none:  { hours: [], docs: [], map: [] },
  brand: { hours: ["芳仁牙醫診所"], docs: ["芳仁牙醫診所"], map: ["芳仁牙醫診所"] },
  topic: { hours: ["芳仁牙醫診所", "斗六牙醫", "門診時間"],
           docs:  ["芳仁牙醫診所", "斗六牙醫", "牙科專科"],
           map:   ["芳仁牙醫診所", "斗六牙醫", "周邊停車"] },
};
const TAGSET = process.env.FB_TAGS || "none";
if (!TAGS[TAGSET]) throw new Error(`FB_TAGS 只認 ${Object.keys(TAGS).join("／")}`);
const tagLine = (k, set = TAGSET) => {
  const list = TAGS[set][k] || [];
  if (list.length > 3) throw new Error(`${k} 的標籤超過三個`);
  for (const g of list) {
    if (TAG_RED.test(g)) throw new Error(`標籤「#${g}」踩到紅線（評價性／招徠性的字）`);
    if (/[\s・－—、，。･]/.test(g)) throw new Error(`標籤「#${g}」裡有空白或符號，臉書會把它截斷`);
  }
  return list.length ? "\n\n" + list.map(g => "#" + g).join(" ") : "";
};

const texts = {};
for (const t of TILES) {
  const s = fs.readFileSync(path.join(ROOT, ...t.txt), "utf8").replace(/\s+$/, "");
  for (const re of RED) if (re.test(s)) throw new Error(`${t.name} 的文字踩到紅線：${re}`);
  texts[t.k] = s + tagLine(t.k);
  fs.writeFileSync(path.join(OUT, `detail-${t.k}.txt`), texts[t.k] + "\n");
}
/* ⚠⚠⚠ 一件只有在臉書上才看得出來的（第 28 條 ⑤）：**地圖那則的前兩句，
   圖上已經印著一模一樣的兩句。** LINE 那邊「詳情」是收起來的、要按一下才展開，
   所以重複看不出來；臉書的文字**就貼在圖的正上方**，同兩句連著出現兩次。
   ⚠ 沒有自己改掉那一則的文字（它和 LINE 那一份是同一個出處），
     只多做一張「前兩句拿掉」的模擬讓使用者比。 */
const ALT = { map: texts.map.split("\n").slice(2).join("\n") };
for (const [k, s] of Object.entries(ALT))
  fs.writeFileSync(path.join(OUT, `detail-${k}-alt.txt`), s + "\n");

/* ---------- 第四步：在臉書動態上長什麼樣 ---------- */
/* ⚠ 手機是 375 CSS px（＝使用者那張後台截圖的 1125 ÷ 3），照片在動態裡是**滿版**，
   所以 1080 的圖畫出來就是 375 CSS px 寬。
   ⚠⚠ 這一張模擬的是**臉書自己的介面**，不是我們的版面 —— 字級、頭像、折疊那一行
   都照臉書手機版的樣子做，不要套站上的尺寸。 */
const COL = 375;
const b64 = (f, mime = "image/png") =>
  `data:${mime};base64,` + fs.readFileSync(f).toString("base64");
const AVATAR = b64(path.join(ROOT, "assets", "icon-192.png"));

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const feedHtml = (uri, body) => `<!doctype html><meta charset="utf-8">
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
   量出來會多一行，而這一頁要印的正是行數。 */
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

const fold = {};
const shoot = async (out, uri, body) => {
  const pg = await browser.newPage({
    viewport: { width: COL, height: 800 }, deviceScaleFactor: 3 });
  await pg.setContent(feedHtml(uri, body));
  await pg.waitForFunction(() => [...document.images].every(i => i.complete));
  const r = await pg.evaluate(() => {
    const el = document.getElementById("tx");
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    return { lines: Math.round(el.clientHeight / lh), all: Math.round(el.scrollHeight / lh) };
  });
  const box = await pg.locator("body").boundingBox();
  await pg.setViewportSize({ width: COL, height: Math.ceil(box.height) });
  await pg.screenshot({ path: path.join(OUT, out) });
  await pg.close();
  return r;
};
for (const t of TILES) {
  fold[t.k] = await shoot(`feed-${t.k}.png`, b64(path.join(OUT, finalOf(t.k))), texts[t.k]);
  if (ALT[t.k]) await shoot(`feed-${t.k}-alt.png`, b64(path.join(OUT, finalOf(t.k))), ALT[t.k]);
}
await browser.close();

/* ---------- 第五步：規格頁 ---------- */
const png = f => { const b = fs.readFileSync(path.join(OUT, f));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) }; };
/* ⚠ caption 裡可以帶 <br>／<b>，但 alt 是屬性 —— 標記要先剝掉，
   不然 `<br>` 會把 alt="" 提早關掉、整段 HTML 從那裡歪掉。 */
const shot = (f, wCss, cap) => { const d = png(f);
  const alt = cap.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return `<figure class="pv-shot"><img src="${f}" width="${wCss}" height="${Math.round(d.h * wCss / d.w)}"`
    + ` alt="${alt}" loading="lazy"><figcaption>${cap}</figcaption></figure>`; };

const g = Object.fromEntries(TILES.map(t => [t.k, wmFor(t.k, { mode: "fb" })]));
const wmRow = (t) => { const w = g[t.k];
  return `<tr><td>${t.name}</td><td><code>${finalOf(t.k)}</code></td>`
    + `<td>${png(finalOf(t.k)).w}×${png(finalOf(t.k)).h}・${png(finalOf(t.k)).kb}KB</td>`
    + `<td><code>${w.shape}</code>　${w.w}×${Math.round(w.h)}<br>`
    + `${w.pos === "br" ? "壓右下" : "壓左上"}・看得到 ${w.seen}px`
    + `${w.flipX && w.flipY ? "・轉 180°" : w.flipX ? "・左右鏡射" : w.flipY ? "・上下鏡射" : ""}`
    + `・墨 ${(w.opacity * 100).toFixed(0)}%</td>`
    + `<td><a href="${t.spec}">完整規格</a></td></tr>`; };

/* ⚠ 每一格都現場算「牙洞落在畫布哪裡」—— 換形狀的時候洞會跟著跑，
   有的候選就算鏡射過也還是被切掉，那要當著他的面標出來。 */
const mapCases = MAPWM.map(sh => { const w = fbWidth(sh);
  const m = wmFor("map", { mode: "fb", shape: sh });
  const C = 1080, inside = m.hole.x >= 8 && m.hole.x <= C - 8 && m.hole.y >= 8 && m.hole.y <= C - 8;
  return shot(mapFileOf(sh), 330,
    `${sh}　${w}×${Math.round(w / shapeRatio(sh))}　長寬比 ${shapeRatio(sh).toFixed(2)}`
    + (sh === REC ? "（建議）" : "")
    + `<br>牙洞 ${inside ? `在畫布 (${m.hole.x}, ${m.hole.y})` : "⚠ 被切掉了"}`); }).join("\n");

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
table{border-collapse:collapse;width:100%;min-width:560px;background:${CARD};
      font-size:.88rem;border:1px solid ${RULE};border-radius:8px}
th,td{border-bottom:1px solid ${RULE};padding:8px 10px;text-align:left;vertical-align:top}
th{color:${SOFT};font-weight:600;white-space:nowrap}
.pv-scroll{overflow-x:auto}
code{font-size:.86em;background:#e8e9ea;padding:1px 5px;border-radius:4px}
/* ⚠ 那幾條 maps.app.goo.gl 的網址是一整串沒有空白的字，pre-wrap 斷不了它 */
pre{background:${CARD};border:1px solid ${RULE};border-radius:8px;padding:12px 14px;
    white-space:pre-wrap;overflow-wrap:anywhere;font-size:.9rem;line-height:1.85;
    font-family:"Noto Sans TC","PingFang TC",sans-serif}
a{color:#214d48}
ul,ol{padding-left:1.3em}li{margin:.35em 0}
b{font-weight:700}
</style></head><body><div class="pv-wrap">

<h1>這三張圖貼到臉書上</h1>
<p class="pv-lead">2026-09-09。臉書一則一則看，所以浮水印<b>回到三格版之前那一組
「一張一顆」</b>；地圖那一顆換成和另外兩張不一樣的。
尺寸不用改 —— 1080×1080 就是臉書方形貼文的原生尺寸。</p>

<h2 class="pv-h2">要上傳的那三張<span class="t">1080×1080・PNG</span></h2>
<div class="pv-scroll"><table>
<tr><th>貼文</th><th>檔案</th><th>尺寸</th><th>浮水印</th><th></th></tr>
${TILES.map(wmRow).join("\n")}
</table></div>
<p class="pv-cap">
⚠ 門診表與科別醫師那兩顆<b>一個值都沒有改</b>，就是你 09-08 在那兩頁上挑定的那一組
（形狀、大小、切掉多少、濃度、壓哪一角）。<br>
⚠ 地圖原本和科別醫師共用同一顆，理由是「兩個小格並排，浮水印不一樣會讀成兩件事」——
<b>那個理由在臉書上不成立</b>（兩則分開貼），所以換了一顆。<br>
⚠⚠ 改放相簿之後，那個理由<b>回來了一半</b>（相簿的格狀縮圖裡它們又並排了）——
沒有改，見底下〈放進相簿〉那一節最後一段。</p>
<div class="pv-row">
${TILES.map(t => shot(finalOf(t.k), 330, t.name)).join("\n")}
</div>

<h2 class="pv-h2">牙洞這件事<span class="t">兩張各自的答案</span></h2>
<p class="pv-cap">
牙洞是這顆標誌<b>唯一的識別特徵</b> —— 沒有它，剩下的就只是一團圓角形狀。
所以預設會讓它露出來，<b>但那不是硬條件</b>。<br>
⚠ <b>地圖</b>：那一顆的牙洞本來在左上（形狀寬的 17.5%），而這一張切掉的正是左邊那一截，
洞剛好被切走。<b>左右鏡射</b>之後洞落在畫布 (${g.map.hole.x}, ${g.map.hole.y}) ＝ 右上。<br>
⚠ <b>科別醫師</b>：從壓左上搬到右下，<b>不轉</b>。
它的洞在形狀的右下角，原樣搬過去之後看得到的是形狀的左上那一塊，洞落在畫布外面
(${g.docs.hole.x}, ${g.docs.hole.y})。轉 180° 洞會回來，
但那樣<b>整顆標誌是倒過來的</b> —— 一顆倒的標誌比一個看不到的洞更明顯，所以不轉。</p>

<h2 class="pv-h2">地圖那一顆要換成哪一個<span class="t">五格，建議 ${REC}</span></h2>
<p class="pv-cap">
寬度<b>不是同一個數字</b>：九顆的長寬比 1.00~3.08、墨佔外框 59.6~83.2%，
同寬的話細長那幾顆會輕很多，所以一律<b>按墨的面積正規化</b>（基準是門診表那顆畫 660）。<br>
切掉多少也不是另一把尺：一律切到<b>看得到 512px</b> 為止 ＝ 科別醫師那一張切 440 之後
剩下的寬度，這樣換形狀時份量不會跟著跳。<br>
⚠ 門診表是 <code>r3c1</code>（長寬比 1.00）、科別醫師是 <code>r1c2</code>（2.03），
所以<b>和兩張都分得出來的只有 ${REC}（1.33）與 r2c3（3.08）那兩族</b>；
r1c1 與 r3c2 是圓的、r2c1 是長條，各自會和其中一張撞。</p>
<div class="pv-row">${mapCases}</div>

<h2 class="pv-h2">在臉書動態上長什麼樣<span class="t">375px 的手機</span></h2>
<p class="pv-cap">照片在動態裡是滿版，所以 1080 的圖畫出來就是螢幕那麼寬。
文字大約三行之後收成「查看更多」。</p>
<div class="pv-row">
${TILES.map(t => shot(`feed-${t.k}.png`, 300,
  `${t.name}　折疊線之上露出 ${fold[t.k].lines}／${fold[t.k].all} 行`)).join("\n")}
</div>

<h2 class="pv-h2">尺寸查過了，不用改<span class="t">1080×1080</span></h2>
<p class="pv-cap">
臉書動態的<b>方形照片貼文原生就是 1080×1080（1:1）</b>，這三張正好是。<br>
⚠ 常看到的 <b>1200×630 是「連結預覽卡」</b>的規格，不是照片貼文的，不要拿來套。<br>
⚠ <b>4:5（1080×1350）</b>在手機上佔更多畫面，但這三張的內容是方的，
拉成 4:5 只會在上下多兩條空白 —— 換版型換不到東西。<br>
⚠ 檔案上限 8MB，這三張是 ${TILES.map(t => png(finalOf(t.k)).kb).join("／")}KB。<br>
⚠ 這幾個數字是查來的<b>二手資料</b>（Meta 自己的說明頁這個容器連不出去）。</p>
<p class="pv-cap">
順帶一件是免費撿到的：門診表那張在 LINE 大格是裁切的，只看得到中間 537 列，
<b>標題「芳仁牙醫開診時段」與最下面那行電話在 LINE 上根本看不到</b>；
臉書整張 1080 都看得到，那兩樣自己回來了。</p>

<h2 class="pv-h2">放進相簿<span class="t">2026-09-09 定的</span></h2>
<p class="pv-cap">
⚠⚠⚠ <b>這一段推翻了上一版寫的「三張分開貼、不要一次貼三張」。</b>
那句話只顧著「會不會被裁」，而<b>裁切只影響動態上的縮圖</b> ——
點進去看到的一直是完整的原圖。使用者說「有沒有被裁剪好像還好」，他是對的。<br>
⚠⚠ 而相簿換到的東西，正好是這三張圖存在的理由：<b>LINE 主頁那三格是永久櫥窗、
臉書的動態是流水</b>，粉專上唯一能長期站著、隨時翻得到的地方就是相簿。
沒有相簿的話，這三張兩個月後就沉到動態底下了。</p>
<p class="pv-cap">
⚠⚠ 還有一件是<b>非用相簿不可</b>的：一次選三張貼成一則，
<b>整組只有一段共用的文字</b>；而我們這三張的說明<b>各不相同</b>。
相簿裡<b>每一張各自有自己的說明欄</b>，三段字才貼得下去。</p>
<h3 class="pv-h3">怎麼建</h3>
<ol>
<li>粉專 → <b>相片</b> → <b>相簿</b> → <b>建立相簿</b></li>
<li>相簿名稱建議<b>「診所資訊」</b>（不要用月份或年份 —— 這三張要放很久）</li>
<li>三張一起上傳，<b>順序：門診表 → 科別與醫師 → 位置與周邊停車</b></li>
<li>每一張各自貼上它自己那段說明（下面那三段，整段複製）</li>
<li>發布</li>
</ol>
<p class="pv-cap">
⚠ 已經單獨貼出去的照片<b>事後也搬得進相簿</b>（開那張照片 → 編輯 → 選相簿），
所以先貼再收也行。<br>
⚠ 這幾步是查來的<b>二手資料</b>（Meta 的說明頁這個容器連不出去），
介面用詞可能和你看到的差一兩個字。</p>
<h3 class="pv-h3">相簿之外還要做的兩件</h3>
<ul>
<li><b>門診表那一張，另外單獨再貼一則、釘選在最上面。</b>
建相簿會在動態上出現<b>一則格狀的多圖貼文</b>，釘它等於釘一組縮圖；
而真正天天有人要看的是門診表，那一則單獨貼才是滿版的完整一張。
臉書的貼文有日期、半年後看起來像舊消息，釘選就是在治這件事
（LINE 主頁那個模組沒有時間戳，所以只有臉書要處理）。</li>
<li><b>臉書有留言區。</b><span data-red>這個帳號沒有專人即時回覆，所以文字裡
不可以寫「有問題留言問我們」那一類的話</span>（現在一句都沒有，是要記著別加）。</li>
</ul>
<p class="pv-cap">
⚠ 順帶一件<b>被這一改弄成半真半假</b>的：地圖那顆浮水印當初可以和科別醫師不一樣，
理由是「臉書上兩則是分開貼的，不會並排」——<b>相簿的格狀縮圖裡它們又並排了</b>。
沒有改，因為<b>那顆是你挑的</b>，而且浮水印只有 4% 的墨、縮到相簿縮圖幾乎看不見。</p>

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

<h2 class="pv-h2">關鍵字標籤<span class="t">2026-09-09 問的，還沒挑</span></h2>
<p class="pv-cap">
你問「每張相片的文字說明是不是也能 tag 關鍵字」——<b>可以，臉書的說明欄支援中文
hashtag</b>（LINE 主頁那個模組的「詳情」欄沒有這回事，所以這是<b>臉書專屬</b>的）。
但先講三件會影響怎麼挑的事。</p>
<p class="pv-cap">
⚠⚠⚠ <b>① hashtag 在臉書多半是「出口」不是「入口」。</b>
點下去會離開這個粉專、進到那個標籤的公開動態，滿滿是別人的貼文。
臉書的觸及主要來自演算法與分享，<b>標籤搜尋的量很小</b>（不像 Instagram）。<br>
唯一不會把人送走的，是<b>只有我們在用的那一個</b>（<code>#芳仁牙醫診所</code>）——
那個標籤頁基本上就是這個粉專自己的貼文，點下去等於「看這家的其他則」。<br>
⚠ 這幾句是二手資料（Meta 的說明頁這個容器連不出去）。</p>
<p class="pv-cap">
⚠⚠⚠ <b>② 紅線在這裡最容易踩，而且是這條線既有的那一條。</b>
<code>#推薦</code> <code>#最好</code> <code>#第一</code> <code>#無痛</code>
<code>#免費</code> 這一類<b>評價性或招徠性</b>的字，醫療機構不要碰 ——
和商家貼文那張表上「⑫ 促銷優惠抽獎 ＝ 紅線」是同一族。產生器有一道在掃，踩到就停。<br>
⚠ <code>#斗六牙醫</code> 這種<b>地區＋科別</b>的是事實描述、不是評價，所以下面第三案有它；
但它仍然是「看起來在做行銷」的一步，<b>要不要走是你的決定</b>。</p>
<p class="pv-cap">
⚠⚠ <b>③ 標籤一律接在最後，LINE 那三份原始檔一個字都不會動。</b>
三則的文字是從那一頁自己的 <code>detail.txt</code> 讀回來的；
為了加標籤去改那三份，兩條線就分家了。<br>
⚠ 排版三條：<b>接在最後、前面空一行</b>（前三行是折疊線之上，標籤佔在那裡是浪費）、
<b>一則最多三個</b>、<b>標籤裡不能有空白或全形符號</b>
（那些符號會截斷，遇到空白也結束 ——「#芳仁 牙醫」會變成只有「#芳仁」）。</p>
<h3 class="pv-h3">三案（產生器：<code>FB_TAGS=none|brand|topic</code>，現在是 <b>${TAGSET}</b>）</h3>
<div class="pv-scroll"><table><tbody>
<tr><th>Ⓐ 不加</th><td>現在這樣。<b>不會有人被送走</b>，也不會少任何觸及
（臉書的觸及不靠標籤）。</td></tr>
<tr><th>Ⓑ 只加品牌<br><b>建議</b></th><td><code>#芳仁牙醫診所</code> 一個，三則都一樣。<br>
唯一一個<b>點下去是回到我們自己</b>的標籤；成本近乎零，而且看起來像有在經營的粉專。</td></tr>
<tr><th>Ⓒ 品牌＋主題</th><td>三則各三個（見下）。<b>觸及不會因此變多多少</b>，
換到的是「這則在講什麼」一眼看得出來；代價是多兩個會把人送走的標籤。</td></tr>
</tbody></table></div>
<div class="pv-scroll"><table><thead><tr><th></th><th>Ⓑ 只加品牌</th><th>Ⓒ 品牌＋主題</th></tr></thead><tbody>
${TILES.map(t => `<tr><th>${t.name}</th>`
  + `<td>${TAGS.brand[t.k].map(g => "#" + g).join(" ")}</td>`
  + `<td>${TAGS.topic[t.k].map(g => "#" + g).join(" ")}</td></tr>`).join("\n")}
</tbody></table></div>

<h2 class="pv-h2">順手查到的一件<span class="t">和標籤是兩回事</span></h2>
<p class="pv-cap">
⚠⚠⚠ 盤關鍵字的時候發現：<b>門診表那一則的說明，從頭到尾沒有出現「芳仁」「斗六」
或「牙醫」</b>（自己看下面那段字）。<br>
在 LINE 上那不要緊 —— 那段「詳情」是<b>收在診所自己的主頁裡</b>的，
誰都知道在看誰家。<b>臉書不一樣</b>：每一則貼文都是獨立的東西，會被分享、被截圖、
被單獨看到，而<b>那一則正是要釘選的那一則</b>。<br>
⚠ 這件事<b>用正文補比加標籤有用得多</b>（分享出去、被截圖時那幾個字都還在，
標籤不一定）。<b>但那三份文字是 LINE 與臉書共用的，改它是你的決定 ——
沒有自己動</b>。最小的改法是第一行寫成
「<b>芳仁牙醫（斗六・永樂街）一週的門診時段，以及每一節有哪些科別。</b>」<br>
⚠ 另外兩則本來就有：地圖那則寫著雲林縣斗六市永樂街、科別那則帶著 fangren.net。</p>

<h2 class="pv-h2">貼文的文字<span class="t">整段複製</span></h2>
<p class="pv-cap">⚠ 這三段的<b>本文</b>和 LINE 那三則<b>逐字相同</b>，是從那一則自己的檔案
讀回來的、沒有重打。要改文字就回那一頁改，這裡會跟著換。<br>
⚠ 最後那一行標籤（如果有）是<b>只加在臉書這一份</b>的。</p>
${TILES.map(t => `<h3 class="pv-h3">${t.name}</h3><pre>${esc(texts[t.k])}</pre>`).join("\n")}

<h2 class="pv-h2">還沒問到的</h2>
<ul>
<li><b>兩張小的上面沒有寫診所名字。</b>科別與醫師那張的標題是你 09-09 指定拿掉的
（理由是「上面那格門診表已經寫著芳仁牙醫」）—— 在臉書上三則是分開的，那個理由不成立。
不過臉書每一則貼文<b>上面本來就有粉專的名字與頭像</b>，所以只有在圖被單獨存下來、
轉傳出去的時候才看得出差別。<b>要不要把標題加回臉書版，是你的決定，沒有自己動。</b></li>
<li><b>門診表那張上下各留 152px 的空白</b>是為了 LINE 大格的裁切留的
（那一格只看得到中間 537 列）。臉書整張都看得到，所以那兩塊現在是純留白 ——
留著也乾淨，要把內容放大用滿也做得到，<b>還沒問你</b>。</li>
</ul>

</div></body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), html);

/* ---------- 面板 ---------- */
console.log(`\n── 浮水印：三格版 vs 臉書版（一張一顆）──`);
for (const t of TILES) {
  const a = wmFor(t.k, { mode: "tri" }), b = g[t.k];
  console.log(`  ${t.name.padEnd(7, "　")}　三格版 ${String(a.shape)} ${String(a.w).padStart(6)}px`
    + `　→　臉書版 ${b.shape} ${b.w}×${Math.round(b.h)}`
    + `・${b.pos === "br" ? "壓右下" : "壓左上"}`
    + `${b.flipX && b.flipY ? "轉 180°" : b.flipX ? "左右鏡射" : b.flipY ? "上下鏡射" : ""}`
    + `・墨 ${(b.opacity * 100).toFixed(0)}%　看得到 ${b.seen}px`
    + `　牙洞 (${b.hole.x}, ${b.hole.y})${b.holeMode === "cut" ? "＝在畫布外（他選的不轉）" : ""}`);
}

console.log(`\n── 地圖那一顆的尺（等重基準：${FB.REF} 畫 ${FB.REFW}）──`);
for (const sh of MAPWM) {
  const w = fbWidth(sh), h = w / shapeRatio(sh);
  console.log(`  ${sh}　${String(w).padStart(4)}×${String(Math.round(h)).padStart(4)}`
    + `　長寬比 ${shapeRatio(sh).toFixed(2)}　切掉 ${w - FB.map.seen}　看得到 ${FB.map.seen}px`
    + (sh === REC ? "　← 建議" : "")
    + (Math.abs(shapeRatio(sh) - 1) < .05 ? "　⚠ 和門診表同比例" : "")
    + (Math.abs(shapeRatio(sh) - 2.03) < .05 ? "　⚠ 和科別醫師同比例" : ""));
}

/* ⚠ 第 28 條 ④：挑定之後這幾行仍然要印，不然換了標籤這裡不會有數字動 */
console.log(`\n── 關鍵字標籤（FB_TAGS=${TAGSET}）──`);
for (const t of TILES) {
  const g = TAGS[TAGSET][t.k];
  console.log(`  ${t.name.padEnd(8, "　")}${g.length ? g.map(x => "#" + x).join(" ")
    + `　（${g.length} 個・都在折疊線之下）` : "不加"}`);
}

console.log(`\n── 折疊線（臉書手機版大約三行）──`);
for (const t of TILES)
  console.log(`  ${t.name.padEnd(7, "　")}　露出 ${fold[t.k].lines}／${fold[t.k].all} 行`
    + `　第一行「${texts[t.k].split("\n")[0]}」`);

console.log(`\n── 要上傳的那三張（臉書方形貼文原生 1080×1080，上限 8MB）──`);
for (const t of TILES) { const d = png(finalOf(t.k));
  console.log(`  ${t.name.padEnd(7, "　")}　${finalOf(t.k)}　${d.w}×${d.h}・${d.kb}KB`); }
console.log(`\n  紅線 0 處　⚠ 臉書有留言區，第十一之三節那條在這裡回來了`);
console.log(`  規格頁　/preview/fb-post/`);
