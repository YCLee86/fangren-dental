#!/usr/bin/env node
/* 產生 preview/og-home/ —— 首頁分享卡的提案頁（裁切 × 帶子 × 描述文字）
 *
 *   node tools/og-home-preview.mjs
 *
 * 起因（2026-08-22）：使用者把 fangren.net 分享到 LINE 的截圖丟過來 ——
 * 「分享首頁時的圖片……除了圖片，顯示的文字內容也不是現在上面的文字。」
 *
 * ⚠⚠ **先查清楚再說：那張卡不是舊的也不是快取**，逐字就是 index.html
 *   現在宣告的 og:title／og:description／og:image。問題在標籤本身。
 *
 * ⚠⚠ **一個我一開始搞錯、量了才知道的事：LINE 沒有裁圖。**
 *   從使用者的截圖直接量（1125×2436，DPR 3）：卡片的圖佔 x 422~1056、
 *   y 594~1019 ＝ **635×426 ＝ 1.491:1**，和原檔 1600×1058（1.512:1）一樣 ——
 *   **它照原比例顯示，沒有裁**。所以「LINE 自己裁、我們控制不了」是錯的說法，
 *   真正的差別是：**1.51:1 的圖會長出一張又高又暗的卡**，
 *   1.91:1 才是訊息卡那種寬扁的樣子。
 *   ⚠ 卡片實際寬度是 635 ÷ 3 ＝ **約 212 CSS px**，比一般說的 250 還小。
 *     這一頁的模擬因此用 212，不用 250。
 *
 * 量出來的（三張都縮到 250 寬再逐像素算，比例不同但每像素的統計可比）：
 *
 *     現況 hero-clinic-night 1600×1058   平均 L* 21.3  幾乎全黑 48.0%  邊緣密度 16.9%
 *     Ｅ 自己裁 1200×628                 平均 L* 25.7  幾乎全黑 40.3%  邊緣密度 28.2%
 *     著陸頁那張（對照組）                平均 L* 54.2  幾乎全黑  3.0%  邊緣密度 33.7%
 *
 * ⚠ ILLUSTRATION.md 第十一節記著：邊緣密度 **19.3%** 是那張被使用者說
 *   「像鬼屋欸」的失敗版，參考圖是 41.1%。**首頁這張 16.9%，比那張失敗版還低。**
 *
 * ⚠ 站上 HERO 那條「下緣貼齊、要切切天空」**救不了它**（試過）：
 *   全黑從 38.1% 變 42.4%，因為下緣是暗的路面。有效的是**往內裁、把招牌框到中間**。
 *
 * 文字這一側：`og:description` 現在是「雲林斗六・永樂街｜巷口牙醫｜1983年創立」。
 * ⚠ **不是錯的** —— `<head>` 的註解記著順序是刻意的（「1983年創立」接在
 *   「巷口牙醫」後面而不是「永樂街」後面，免得讀成「1983 年在永樂街創立」）。
 *   但「創立」「巷口牙醫」這兩個詞**站上一個字都沒有**，站上寫的是
 *   「1983年 中華路開業」與詩的第四句「到巷口的芳仁　一起想辦法」。
 * ⚠⚠ 候選一律**只從站上已經有的字組**，不新寫句子（COPY.md 第三節那條紅線
 *   與整份文案規範都在使用者手上，這裡只負責把選項擺出來）。
 *
 * ⚠ 定案時要做的：把選中的那一組寫進 index.html 的 og:*（那幾行是**手寫的**，
 *   不在 SEO:START 區塊裡，build 不會動它），刪掉 preview/og-home/，
 *   推導搬進 history/og-home.html。這一支是一次性的，一併刪掉。
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "preview", "og-home");
const SRC = path.join(ROOT, "assets", "hero-clinic-night-2000.jpg");
const NOW = path.join(ROOT, "assets", "hero-clinic-night.jpg");
if (!fs.existsSync(SRC)) throw new Error(`找不到原檔 ${path.relative(ROOT, SRC)}`);

/* 亮處重心量出來是 (1054, 767)。**亮著的騎樓在原檔 y 860~1220**（20×20 逐格掃，
   格平均亮度 >110），也就是說它幾乎貼到照片底邊（1323），底下只剩 103px 的路面。

   ⚠⚠ **2026-08-22：三格「壓在照片上」那條路走不通，整個換掉了。**
   使用者先回報「三格剛好壓在騎樓入口上」，建議「把裁切改到寬和現況之間」——
   量過之後拉寬**反而更糟**（框下緣固定時，騎樓下緣到框下緣在原檔裡是定值，
   框愈寬比例尺愈小、那段距離在畫面上就愈短）：

       1500 寬・底 1250  比例尺 .800  騎樓 y 316~604  壓過三格 90px
       1500 寬・底 1323  .800         y 258~546       壓過 32px
       1700 寬・底 1323  .706         y 301~556       壓過 41px
       2000 寬・底 1323  .600         y 350~566       壓過 52px

   把框往下移到照片底邊最多只能把 90 收到 32，**怎麼裁都還是壓到門面**。
   使用者因此點出正解：「你們看電腦版、手機版、iPad 可以發現，我為了不要壓到門面，
   甚至在圖片下另外加深色橫帶。」—— 站上 iPad 直放與手機版就是這樣做的
   （CLAUDE.md 第六之十八節：`.hero` 直向 flex、照片 flex:1、**窄帶脫離照片接在下面**）。
   現在 `--statspos below` 照抄那個做法：照片縮短、三格放進自己的帶子，
   **門面一個像素都沒有被蓋到**。
   ⚠ 照片變矮之後 cover 要**裁天空不裁路面**（`object-position: 50% 100%`），
     那是站上這張照片一直在用的規則；裁到路面的話帶子就接不到地。
   ⚠ 帶子的起點色是**現場量照片最後一列的中位數**（取中位不取平均：路燈與門口的燈
     幾顆亮點就能把平均拉高 4 個 L*），再用 S(t^1.6) 走到 --band-bot #2d3037 ——
     和站上手機版窄帶逐字相同的曲線。接縫因此是平的，不會長出馬赫帶。 */
const CROPS = {
  wide:  { name: "寬", w: 1500, cx: 1120, bottom: 1323,
           note: "整棟樓 ＋ 亮著的騎樓 ＋ 招牌，左邊留得住街屋與停在路邊的車。" },
  mid:   { name: "中", w: 1700, cx: 1100, bottom: 1323,
           note: "往「現況」方向退一階，街屋與路口進來得更多，建築相對小一點。" },
  full:  { name: "全寬", w: 2000, cx: 1000, bottom: 1323,
           note: "整張照片的寬度，建築縮得最小、街景最多。" },
};
/* 2026-08-22 使用者定了三件：不要有顏色的帶子、標示從右上移到左上、
   描述文字拿掉「雲林斗六・永樂街」（那組字現在在圖上了）。
   ⚠ 綠色的帶子那一案**已經被退掉了，不要再放回這一頁當候選**。 */
const MARKS = {
  none: { name: "不放", style: null,
          note: "只換裁切。識別仍然只靠照片裡那塊招牌 —— 212px 下它只有幾個像素寬。" },
  tl:   { name: "左上", style: "plain",
          note: "標誌 ＋ 芳仁牙醫診所 ＋ 雲林斗六・永樂街，直接壓在照片左上角，沒有帶子。" },
};
/* 下緣那三格（＝首頁窄帶的 1983年 中華路開業／9位 醫師駐診／5個 部定專科）。
   ⚠ 字、字重、字距、分隔線、內距**全部是在 1200 寬的視窗上打開 index.html 量的**
     （首頁 ≥1041 那一段根字級 18px，和這張圖同寬，量到的 px 可以直接用）。
     1× 產出來的三格寬 603px，站上量到 603.375px —— 對得上。
   ⚠ 倍率是為了**訊息卡那個尺寸**存在的，不是為了原尺寸好看：
     1× 的數字在 212px 的卡上只有 3.8px，那是紋理不是字。 */
const STATSCALE = {
  off: { name: "不放", ss: null, note: "下緣什麼都不加，照片佔滿整張。" },
  s1:  { name: "照站上", ss: 1,
         note: "和首頁 1200 寬時逐項相同（三格 603px）。帶高 89px。⚠ 卡上數字只有 3.8px，讀不出來。" },
  s14: { name: "1.4×", ss: 1.4, note: "帶高 111px、照片 517px。卡上數字 5.2px。" },
  s18: { name: "1.8×", ss: 1.8, note: "帶高 128px、照片 500px。卡上數字 6.8px。" },
};
/* 描述文字 2026-08-22 定了：**只留詩的收尾句**。
   ⚠ 「雲林斗六・永樂街」拿掉不是因為不重要，是因為**它現在印在圖上**了 ——
     卡片上同一組字出現兩次是浪費那兩行。 */
const DESC = "到巷口的芳仁　一起想辦法";
const DESC_FROM = "逐字取自 HERO 第四句（站上已上線）。原本的「雲林斗六・永樂街」移到圖上，不再重複。";

const chromePath = (() => {
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const c = [];
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "headless_shell"));
    for (const d of fs.readdirSync(pw)) c.push(path.join(pw, d, "chrome-linux", "chrome"));
  }
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("找不到 Chromium");
  return hit;   // ⚠ headless_shell 排在前面（CLAUDE.md 第九節第 18 條）
})();

const pwPaths = [process.env.PLAYWRIGHT_MODULE, "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) { try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {} }
if (!chromium) throw new Error("找不到 Playwright");

/* ⚠ 先把舊的圖清掉再產。這一頁的候選會被退掉（綠色的帶子那一案就是），
   不清的話被退掉的圖還留在資料夾裡，下面那段量測會把它們一起量進 STATS，
   面板上看不出來、但檔案跟著推上線 —— 而且 /preview/* 是 no-store，白白多載。 */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.copyFileSync(NOW, path.join(OUT, "img-now.jpg"));

const browser = await chromium.launch({ executablePath: chromePath });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

for (const [k, c] of Object.entries(CROPS)) {
  const data = await pg.evaluate(async ({ uri, w, cx, bottom }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight, h = w / (1200 / 628);
    const sx = Math.max(0, Math.min(W - w, cx - w / 2));
    const sy = Math.max(0, Math.min(H - h, bottom - h));
    const cv = document.createElement("canvas"); cv.width = 1200; cv.height = 628;
    const g = cv.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, sx, sy, w, h, 0, 0, 1200, 628);
    return cv.toDataURL("image/jpeg", 0.86);
  }, { uri, w: c.w, cx: c.cx, bottom: c.bottom });
  const f = path.join(OUT, `img-${k}-none.jpg`);
  fs.writeFileSync(f, Buffer.from(data.split(",")[1], "base64"));
  console.log(`裁切 ${c.name} → ${path.relative(ROOT, f)}  ${(fs.statSync(f).size / 1024).toFixed(0)}KB`);
}
await browser.close();

/* 標示沿用 tools/og-plate.mjs（＝著陸頁那七張用的同一支）的 --style plain：
   沒有帶子，標誌與名字直接壓在照片左上角；--stats 加下緣那三格。
   ⚠ 一定要帶 --label ""，不帶的話會掛「一般牙科・定期檢查」——**首頁不是科別**。 */
for (const ck of Object.keys(CROPS)) {
  for (const [mk, mk2] of Object.entries(MARKS)) {
    for (const [sk, sk2] of Object.entries(STATSCALE)) {
      if (!mk2.style && !sk2.ss) continue;          // 兩個都不放 ＝ 就是 -none 那張
      const rel = `preview/og-home/img-${ck}-${mk}-${sk}.jpg`;
      const a = [path.join(ROOT, "tools", "og-plate.mjs"), "general",
        "--from", `preview/og-home/img-${ck}-none.jpg`, "--style", "plain",
        "--label", "", "--out", rel];
      if (mk2.style) a.push("--loc", "full", "--locpos", "stack");
      else a.push("--nomark", "--loc", "none");
      if (sk2.ss) a.push("--stats", "--statscale", String(sk2.ss), "--statspos", "below");
      execFileSync(process.execPath, a, { cwd: ROOT, encoding: "utf8" });
    }
  }
}
console.log(`圖 ${fs.readdirSync(OUT).filter((n) => n.endsWith(".jpg")).length} 張`);

/* 標示壓在照片上（沒有帶子墊底）的對比度 —— 量的是**標示底下那塊照片**，
   所以讀的是**同一格但沒有標示**的那一張（標示框 left 38・top 38・280×69）。
   ⚠⚠ 它要按 (裁切 × 三格倍率) 各量一次，不能只按裁切量：
     below 模式下三格愈大、照片愈矮，`object-position: 50% 100%` 就從天空那一頭
     裁掉愈多 —— **左上角那塊照片會換成另一段天空**，對比度跟著變。
     第一版只按裁切量了一次，切到別的倍率時面板印的是別格的數字。
   ⚠ 這是保守值：字自己還帶著兩層陰影（站上 HERO 那首詩的同一組）。 */
const MARKC = {};
{
  const br = await chromium.launch({ executablePath: chromePath });
  const p2 = await br.newPage();
  for (const ck of Object.keys(CROPS)) {
    for (const sk of Object.keys(STATSCALE)) {
      const f = STATSCALE[sk].ss ? `img-${ck}-none-${sk}.jpg` : `img-${ck}-none.jpg`;
      const u = `data:image/jpeg;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}`;
      MARKC[ck + "-" + sk] = await p2.evaluate(async (u) => {
        const im = new Image(); im.src = u; await im.decode();
        const c = document.createElement("canvas"); c.width = 1200; c.height = 628;
        const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
        const d = g.getImageData(38, 38, 280, 69).data;
        const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const L = [];
        for (let i = 0; i < d.length; i += 4) L.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
        L.sort((a, b) => a - b);
        const P = 0.2126 * lin(0xe2) + 0.7152 * lin(0xe5) + 0.0722 * lin(0xe6);
        const r = (l) => (P + 0.05) / (l + 0.05);
        return { mid: r(L[Math.floor(L.length * 0.5)]), hi: r(L[Math.floor(L.length * 0.9)]) };
      }, u);
    }
    const m = MARKC[ck + "-s18"];
    console.log(`  ${CROPS[ck].name}（三格 1.8×）標示底下：中位 ${m.mid.toFixed(2)}　最亮處 ${m.hi.toFixed(2)}`);
  }
  await br.close();
}

/* ---- 每一張圖的數字在**產生的時候**就量好，寫死進頁面 --------------------
   ⚠⚠ 第一版是讓頁面自己用 canvas 現場量，`file://` 下直接 SecurityError
   （本機開檔時圖片算跨來源，canvas 被污染、getImageData 丟例外），
   面板整排印「—」而且**不報錯**。線上 https 雖然會過，但沒有理由讓一個
   會在某些情況下靜靜失敗的東西留在頁面上 —— 這些數字是固定的，先量好就好。 */
const b2 = await chromium.launch({ executablePath: chromePath });
const mp = await b2.newPage();
const STATS = {};
for (const f of fs.readdirSync(OUT).filter((n) => n.endsWith(".jpg"))) {
  const u = `data:image/jpeg;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}`;
  STATS[f] = await mp.evaluate(async (u) => {
    const im = new Image(); im.src = u; await im.decode();
    const W = im.naturalWidth, H = im.naturalHeight, sw = 250, sh = Math.round(250 * H / W);
    const c = document.createElement("canvas"); c.width = sw; c.height = sh;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.imageSmoothingQuality = "high"; g.drawImage(im, 0, 0, sw, sh);
    const d = g.getImageData(0, 0, sw, sh).data;
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    let sum = 0, dark = 0, n = 0, e = 0, t = 0;
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      const L = y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
      sum += L; if (L < 20) dark++; n++;
    }
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw - 1; x++) {
      const a = (y * sw + x) * 4, b = a + 4;
      const la = d[a] * .299 + d[a + 1] * .587 + d[a + 2] * .114;
      const lb = d[b] * .299 + d[b + 1] * .587 + d[b + 2] * .114;
      if (Math.abs(la - lb) > 8) e++; t++;
    }
    return { W, H, mean: sum / n, dark: 100 * dark / n, edge: 100 * e / t };
  }, u);
  const s = STATS[f];
  console.log(`  ${f.padEnd(20)} ${s.W}×${s.H}（${(s.W / s.H).toFixed(3)}:1）` +
    ` L* ${s.mean.toFixed(1)}　全黑 ${s.dark.toFixed(1)}%　邊緣 ${s.edge.toFixed(1)}%`);
}
await b2.close();

const seg = (row, map, cur) => Object.entries(map).map(([k, v]) =>
  `<button type="button" data-row="${row}" data-k="${k}" aria-pressed="${k === cur}">${v.name}</button>`).join("");

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>首頁分享卡・裁切與描述文字｜提案</title>
<!--
  ============================================================================
  分享 fangren.net 時對方看到的那張卡
  ============================================================================
  起因：使用者把 LINE 的截圖丟過來 ——「分享首頁時的圖片……除了圖片，
  顯示的文字內容也不是現在上面的文字。」

  ⚠⚠ **先查清楚：那張卡不是舊的也不是快取**，逐字就是 index.html 現在宣告的
  og:title／og:description／og:image。問題在標籤本身，不在 LINE。

  ⚠⚠ **一個我一開始搞錯、量了才知道的事：LINE 沒有裁圖。**
  從使用者的截圖直接量（1125×2436，DPR 3）：卡片的圖佔 x 422~1056、y 594~1019
  ＝ **635×426 ＝ 1.491:1**，和原檔 1600×1058（1.512:1）一樣 —— 照原比例顯示。
  所以「LINE 自己裁、我們控制不了」是錯的說法。真正的差別是
  **1.51:1 的圖會長出一張又高又暗的卡**，1.91:1 才是訊息卡那種寬扁的樣子。
  ⚠ 卡片實際寬度 635 ÷ 3 ＝ **約 212 CSS px**（比一般說的 250 還小），
    這一頁的模擬用 212。

  ── 圖：量出來的 ────────────────────────────────────────────
      現況 hero-clinic-night 1600×1058   平均 L* 21.3  幾乎全黑 48.0%  邊緣密度 16.9%
      Ｅ 自己裁 1200×628                 平均 L* 25.7  幾乎全黑 40.3%  邊緣密度 28.2%
      著陸頁那張（對照組）                平均 L* 54.2  幾乎全黑  3.0%  邊緣密度 33.7%
  ⚠ ILLUSTRATION.md 第十一節記著：邊緣密度 **19.3%** 是那張被使用者說「像鬼屋欸」
    的失敗版，參考圖是 41.1%。**首頁這張 16.9%，比那張失敗版還低。**
  ⚠ 站上 HERO 那條「下緣貼齊、要切切天空」**救不了它**（試過）：全黑從 38.1%
    變 42.4%，因為下緣是暗的路面。有效的是**往內裁、把招牌框到中間**。
  ⚠ 亮處重心量出來是 (1054, 767)，最亮的一段是 y 662~1058（亮著的騎樓與招牌），
    招牌在 (≈1150, ≈1080)。兩個裁法都是對著那裡框的。

  ── 文字：不是錯的，但不是站上現在的話 ──────────────────────
      卡片上寫的        站上實際的字
      巷口牙醫          詩的第四句「到巷口的芳仁　一起想辦法」
      1983年創立        窄帶「1983年 中華路開業」
  「創立」「巷口牙醫」這兩個詞**站上一個字都沒有**。事實沒錯，
  而且 index.html 的註解記著順序是刻意的（「1983年創立」接在「巷口牙醫」後面
  而不是「永樂街」後面，免得讀成「1983 年在永樂街創立」）——**那道防護有效**，
  使用者的截圖也正好斷在那個位置。問題是它整句是名錄式的三段並列，
  而站上現在的聲音是那四句詩。
  ⚠⚠ **這一頁的候選一律只從站上已經有的字組，不新寫句子。**
    每一個候選底下都標著每一段出自哪裡。COPY.md 第三節那條紅線
    （不可以寫成「來這邊給你問到飽」）四個候選都沒有碰到。

  ── 帶子 ───────────────────────────────────────────────
  沿用 tools/og-plate.mjs（＝著陸頁那七張用的同一支），顏色取 general 的深階
  #2c5238（品牌綠，也是主畫面圖示那一顆）。⚠ 一定要帶 --label，
  不帶的話左邊會掛「一般牙科・定期檢查」——**首頁不是科別**。

  ⚠ 定案時：把選中的那一組寫進 index.html 的 og:*（那幾行是**手寫的**，
  不在 SEO:START 區塊裡，build 不會動它），刪掉這一頁，文字搬進 history/og-home.html。

  完整的檔案：git show <commit>:preview/og-home/index.html
  ============================================================================
-->
<style>
:root{
  --paper:#e2e5e6; --card:#f4f4f5; --rule:#cdd0d2; --note:#f9f9fa;
  --ink:#2a2c27; --ink-soft:#5c5f57; --accent:#3f654a; --accent-deep:#2c5238;
  --bar-h:132px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{background:var(--paper);color:var(--ink);
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei","Hiragino Sans TC",
    system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  line-height:1.7;letter-spacing:.01em;padding:22px 14px calc(var(--bar-h) + 22px)}
.pv-wrap{max-width:640px;margin:0 auto}
h1{font-size:1.18rem;line-height:1.45;letter-spacing:.02em;margin-bottom:.35em}
.pv-lede{font-size:.88rem;color:var(--ink-soft);margin-bottom:1.4em}
h2{font-size:.94rem;letter-spacing:.04em;margin:1.8em 0 .6em;
  padding-left:.6em;border-left:3px solid var(--accent)}
/* ---- 訊息卡：寬度 212px ＝ 從使用者的截圖量到的真實值（635 裝置 px ÷ DPR 3）。
       ⚠ 圖的高度**跟著那張圖自己的比例**走，不要統一鎖成 1.91 ——
         「現況那張會長出一張又高又暗的卡」正是這一輪要看的東西。 */
.pv-phone{background:#8fa9bd;border-radius:16px;padding:14px 12px;
  display:flex;gap:9px;align-items:flex-start}
.pv-av{width:30px;height:30px;border-radius:50%;background:#cfd8dc;flex:none}
.pv-card{width:212px;flex:none;background:#fff;border-radius:11px;overflow:hidden;
  box-shadow:0 1px 3px rgba(0,0,0,.18)}
.pv-thumb{width:212px;background:#dfe3e5;line-height:0}
.pv-thumb img{width:212px;height:auto;display:block}
.pv-meta{padding:7px 9px 8px}
.pv-t{font-size:12px;line-height:1.35;font-weight:700;color:#16191b}
.pv-d{font-size:10.8px;line-height:1.4;color:#5d6467;margin-top:3px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pv-u{font-size:10.4px;color:#8a9093;margin-top:5px}
.pv-full{border-radius:10px;overflow:hidden;box-shadow:0 1px 5px rgba(20,24,20,.16);
  background:#dfe3e5;line-height:0}
.pv-full img{width:100%;display:block}
.pv-panel{background:var(--note);border:1px solid var(--rule);border-radius:10px;
  padding:14px 15px;font-size:.83rem;line-height:1.75}
.pv-panel dl{display:grid;grid-template-columns:max-content 1fr;gap:.15em .8em}
.pv-panel dt{color:var(--ink-soft);white-space:nowrap}
.pv-panel dd{font-variant-numeric:tabular-nums}
.pv-verdict{margin-top:.7em;padding-top:.7em;border-top:1px solid var(--rule)}
.pv-bad{color:#89202d;font-weight:700}.pv-ok{color:var(--accent-deep);font-weight:700}
.pv-note{font-size:.8rem;color:var(--ink-soft);margin-top:.6em}
.pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:9;
  background:rgba(244,244,245,.93);backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  border-top:1px solid var(--rule);padding:7px 12px calc(7px + env(safe-area-inset-bottom));
  box-shadow:0 -2px 12px rgba(20,24,20,.08)}
.pv-row{display:flex;align-items:center;gap:8px}
.pv-row + .pv-row{margin-top:5px}
.pv-lab{font-size:.72rem;color:var(--ink-soft);flex:none;width:2.6em;letter-spacing:.04em}
.pv-seg{display:flex;gap:5px;flex:1;min-width:0}
.pv-seg button{flex:1;min-width:0;min-height:32px;border:1px solid var(--rule);
  background:var(--card);color:var(--ink);border-radius:8px;font:inherit;font-size:.76rem;
  letter-spacing:.01em;cursor:pointer;white-space:nowrap;overflow:hidden;
  text-overflow:ellipsis;padding:0 .25em}
.pv-seg button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);
  color:var(--card);font-weight:500}
.pv-seg button[disabled]{opacity:.4;cursor:not-allowed}
.pv-hint{font-size:.7rem;color:var(--ink-soft);margin-top:4px;line-height:1.45;
  overflow:hidden;text-overflow:ellipsis;display:-webkit-box;
  -webkit-line-clamp:2;-webkit-box-orient:vertical}
@media (max-width:400px){ .pv-lab{width:2.3em;font-size:.68rem} }
</style>
</head>
<body>
<div class="pv-wrap">
  <h1>分享 fangren.net 時，對方看到的那張卡</h1>
  <p class="pv-lede">底下三排切換。卡片寬度 <b>212px</b> 是從你那張 LINE 截圖量到的真實值
    （635 裝置 px ÷ DPR 3）。⚠ 圖的高度跟著那張圖自己的比例走 ——
    <b>LINE 沒有裁圖</b>，所以現況那張 1.51:1 會長成一張又高又暗的卡。</p>

  <h2>訊息卡・真實 212px</h2>
  <div class="pv-phone">
    <span class="pv-av"></span>
    <div class="pv-card">
      <div class="pv-thumb"><img id="pv-img-s" src="img-now.jpg" alt=""></div>
      <div class="pv-meta">
        <div class="pv-t">芳仁牙醫診所</div>
        <div class="pv-d">${DESC}</div>
        <div class="pv-u">fangren.net</div>
      </div>
    </div>
  </div>

  <h2>原尺寸</h2>
  <div class="pv-full"><img id="pv-img-l" src="img-now.jpg" alt=""></div>

  <h2>現場量測</h2>
  <div class="pv-panel">
    <dl>
      <dt>圖的比例</dt><dd id="m-ratio">—</dd>
      <dt>平均亮度</dt><dd id="m-l">—</dd>
      <dt>幾乎全黑的像素</dt><dd id="m-dark">—</dd>
      <dt>邊緣密度（細節）</dt><dd id="m-edge">—</dd>
      <dt>標示壓在照片上</dt><dd id="m-mark">—</dd>
    </dl>
    <div class="pv-verdict" id="m-verdict">—</div>
    <p class="pv-note" id="m-note">—</p>
    <p class="pv-note" id="m-from">—</p>
  </div>
  <p class="pv-note">「邊緣密度」＝ 縮到小圖之後還有多少相鄰像素亮度差得出來，也就是
    <b>還看得見多少細節</b>。ILLUSTRATION.md 第十一節記著：<b>19.3%</b> 是那張被你說
    「像鬼屋欸」的失敗版，你給的參考圖是 41.1%。<br>
    描述那兩行：訊息 app 的氣泡只露兩行（實測約 27 個全形字），
    現在的「到巷口的芳仁　一起想辦法」是 12 個字，一行就放得下。</p>
</div>

<div class="pv-bar">
  <div class="pv-row"><span class="pv-lab">裁切</span>
    <span class="pv-seg" id="seg-c">
      <button type="button" data-row="c" data-k="now" aria-pressed="true">現況</button>
      ${seg("c", CROPS, "")}</span></div>
  <div class="pv-row"><span class="pv-lab">標示</span>
    <span class="pv-seg" id="seg-b">${seg("b", MARKS, "none")}</span></div>
  <div class="pv-row"><span class="pv-lab">三格</span>
    <span class="pv-seg" id="seg-s">${seg("s", STATSCALE, "off")}</span></div>
  <p class="pv-hint" id="pv-hint"></p>
</div>

<script>
/* ⚠ 網址參數的正規式要寫 [a-z0-9]+（CLAUDE.md 第八節）—— 寫 [a-z]+ 會吃不到
   帶數字的值，比對失敗後悄悄退回預設，等於參數沒作用。 */
var CROPS = ${JSON.stringify(CROPS)};
var MARKS = ${JSON.stringify(MARKS)};
var MARKC = ${JSON.stringify(MARKC)};
var STATSCALE = ${JSON.stringify(STATSCALE)};
var STATS = ${JSON.stringify(STATS)};   /* 產生時就量好的，見產生器裡那段註解 */
var cur = { c: "now", b: "none", s: "off" };
(function () {
  var q = location.search, m;
  m = q.match(/[?&]crop=([a-z0-9]+)/);  if (m && (m[1] === "now" || CROPS[m[1]])) cur.c = m[1];
  m = q.match(/[?&]mark=([a-z0-9]+)/);  if (m && MARKS[m[1]]) cur.b = m[1];
  m = q.match(/[?&]stats=([a-z0-9]+)/); if (m && STATSCALE[m[1]]) cur.s = m[1];
})();

var imgS = document.getElementById("pv-img-s"), imgL = document.getElementById("pv-img-l");
function file() {
  if (cur.c === "now") return "img-now.jpg";
  /* 標示與三格都不放 ＝ 就是那張只換裁切的底圖，沒有另外產一份。 */
  if (cur.b === "none" && cur.s === "off") return "img-" + cur.c + "-none.jpg";
  return "img-" + cur.c + "-" + cur.b + "-" + cur.s + ".jpg";
}

function apply(push) {
  /* 現況那張是 1.51:1，標示是為 1.91 的卡做的 —— 把標示那排關掉。 */
  var isNow = cur.c === "now";
  document.querySelectorAll("#seg-b button, #seg-s button").forEach(function (b) { b.disabled = isNow; });
  var f = file();
  imgS.src = f; imgL.src = f;
  ["c","b","s"].forEach(function (r) {
    document.querySelectorAll("#seg-" + r + " button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.k === cur[r])); });
  });
  var bnote = isNow ? "現況那張比例 1.51:1，標示與三格都是為 1.91 的卡做的。"
                    : MARKS[cur.b].note + "　" + STATSCALE[cur.s].note;
  var cnote = isNow ? "原檔 1600×1058 直接送出去，LINE 照原比例顯示。"
                    : CROPS[cur.c].note;
  document.getElementById("m-note").textContent = cnote + "　" + bnote;
  document.getElementById("m-from").textContent = "描述文字：" + ${JSON.stringify(DESC_FROM)};
  var mc = (!isNow && cur.b === "tl") ? MARKC[cur.c + "-" + cur.s] : null;
  document.getElementById("m-mark").textContent = mc
    ? "中位 " + mc.mid.toFixed(2) + "　最亮處 " + mc.hi.toFixed(2) +
      (mc.hi >= 4.5 ? "　✓" : "　⚠ 最亮處低於 4.5（字自己還有兩層陰影，這是保守值）")
    : "—";
  document.getElementById("pv-hint").textContent =
    (isNow ? "現況" : CROPS[cur.c].name + "・標示" + MARKS[cur.b].name + "・三格" + STATSCALE[cur.s].name) + "　" + cnote;

  var s = STATS[f];
  document.getElementById("m-ratio").textContent =
    s.W + "×" + s.H + "（" + (s.W/s.H).toFixed(3) + ":1）" +
    ((s.W/s.H) > 1.85 ? "　寬扁的卡" : "　⚠ 又高又暗的卡");
  document.getElementById("m-l").textContent = "L* " + s.mean.toFixed(1);
  document.getElementById("m-dark").textContent = s.dark.toFixed(1) + "%";
  document.getElementById("m-edge").textContent = s.edge.toFixed(1) + "%";
  /* 判斷直接寫出來，不要只印數字。 */
  var v = document.getElementById("m-verdict");
  if (s.edge < 19.3) v.innerHTML = '<span class="pv-bad">邊緣密度 ' + s.edge.toFixed(1) +
    '% ，比那張被你說「像鬼屋欸」的失敗版（19.3%）還低</span>';
  else if (s.edge < 30) v.innerHTML = '邊緣密度 ' + s.edge.toFixed(1) +
    '%　比失敗版（19.3%）好，但還沒到你給的參考圖（41.1%）—— 它是夜景，這是天花板';
  else v.innerHTML = '<span class="pv-ok">邊緣密度 ' + s.edge.toFixed(1) + '%</span>　夜景能到的上緣';
  if (push) history.replaceState(null, "", "?crop=" + cur.c + "&mark=" + cur.b + "&stats=" + cur.s);
}

document.querySelector(".pv-bar").addEventListener("click", function (e) {
  var b = e.target.closest("button[data-row]"); if (!b || b.disabled) return;
  cur[b.dataset.row] = b.dataset.k; apply(true);
});
apply(false);

/* 其餘的圖在背景預抓（/preview/* 是 no-store，不預抓每次切換都要等下載）。 */
addEventListener("load", function () {
  setTimeout(function () {
    var all = ["img-now.jpg"];
    Object.keys(CROPS).forEach(function (c) {
      all.push("img-" + c + "-none.jpg");
      Object.keys(MARKS).forEach(function (b) { Object.keys(STATSCALE).forEach(function (st) {
        if (b === "none" && st === "off") return;
        all.push("img-" + c + "-" + b + "-" + st + ".jpg"); }); });
    });
    all.forEach(function (f) { if (f !== file()) { var i = new Image(); i.src = f; } });
  }, 400);
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`✓ preview/og-home/index.html`);
console.log(`  線上：https://fangren.net/preview/og-home/`);
