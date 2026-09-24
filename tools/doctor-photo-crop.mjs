#!/usr/bin/env node
/* ==========================================================================
   醫師形象照的裁切器
       drafts/doctor-photo/src/<slug>.png  →  assets/doctor-<slug>-400.jpg
   --------------------------------------------------------------------------
   2026-09-19 定案上線（推導在 /history/doctor-photo.html）。
   站上的醫師卡用的是**圓頭像**：顯示 76px、正方形、border-radius 50%。
   400 是這樣來的：76 × DPR 3（使用者的 iPhone）＝ 228，取 400 留餘裕，
   一張 26~28KB，不值得為它做 srcset。

   ⚠⚠ **裁切框是逐張手量的，而且不能各裁各的** —— 九張要看起來像同一組。
     做法是先在原圖上量四個點（髮頂／眼睛／下巴／臉中線），再換算成
     李柄輝那張的比例（他是第一張，所以他就是基準）：

         眼睛在框高的 44.2%　臉中線在框寬的 49.3%　頭高佔框高 63%

     ⚠ **框的大小要照「頭寬」算，不要照「頭高」算。** 每個人的頭寬高比
       不一樣 —— 李侑津的臉窄，照頭高算出來是 651、照頭寬算是 591，
       用 651 的話他在圓裡會明顯比李柄輝小一號。算完再把兩三個候選
       和已經定案的那幾顆圓**並排**看一次（625 與 640 的臉都偏左，
       數字看起來很合理，並排才看得出來）。

   新增一位醫師要做的三件事：
     ① 原檔放 drafts/doctor-photo/src/<slug>.png（不會進 _site）
     ② 量四個點、照上面的比例算出框，加進底下的 FACES
     ③ node tools/doctor-photo-crop.mjs <slug>
        → 接著在 index.html 那張卡補 data-face 與 <picture>（見該處註解）
        → node tools/webp.mjs && node tools/topics.mjs && node tools/build.mjs

   跑法：
       node tools/doctor-photo-crop.mjs            # 全部重出
       node tools/doctor-photo-crop.mjs li-youjin  # 只出一位
       node tools/doctor-photo-crop.mjs --check    # 只比對，不寫檔
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC  = path.join(ROOT, "drafts", "doctor-photo", "src");
const OUT  = path.join(ROOT, "assets");

/* 四個量到的點只是推導的紀錄，程式用的是算完的 sq。
   留著是因為日後要換基準、或要重算某一張時，沒有它就得重量一次。 */
const FACES = {
  "li-binghui": { name: "李柄輝", src: [1145, 1374],
    marks: { hair: 175, eyes: 400, chin: 610, midX: 545 },
    sq: [205, 95, 690, 690] },
  "li-youjin":  { name: "李侑津", src: [1086, 1448],
    marks: { hair: 290, eyes: 520, chin: 700, midX: 540 },
    sq: [244, 255, 590, 590] },
  /* ⚠ 這一張把「照頭寬算」的極限講清楚了：他髮量高又蓬，目測的頭寬（350）
     算出 627，並排一看**頭比另外兩張滿一圈**，而且頭頂只剩 3.5% 的留白
     （李柄輝 11.6%、李侑津 5.9%）。627→660→690→724→760 五個圓排在一起，
     **所以那條規則的真正意思是「算出來的是起點，並排看才是判準」**，
     頭髮蓬鬆的人目測頭寬一定會低估。
     ⚠ 我先收成 724（頭頂留白 9.0%），**使用者改成 660**（留白 5.6%、頭比較滿，
       和李侑津的 5.9% 幾乎一樣）—— 第 28 條那條再一次：
       **定案定的是他螢幕上那一格，不是我算出來的那一格。** */
  "wang-junwei": { name: "王俊偉", src: [1122, 1402],
    marks: { hair: 145, eyes: 400, chin: 600, midX: 555 },
    sq: [230, 108, 660, 660] },
  /* 2026-09-23 提案頁 preview/doctor-xie/ 兩輪定案。第一輪照比例算給
     760／800／840（800 和王俊偉並排最接近），使用者：「感覺臉可以比760再大一點」；
     第二輪 740／720／700／680 **挑了 720**（頭頂留白 4.6%，比李侑津的 5.9% 再滿一點）。
     位置仍照李柄輝的比例：眼睛在框高 44.2%、臉中線在框寬 49.3%。 */
  "xie-yaoqing": { name: "謝耀慶", src: [1024, 1536],
    marks: { hair: 135, eyes: 420, chin: 685, midX: 580 },
    sq: [225, 102, 720, 720] },
  /* 2026-09-23 提案頁 preview/doctor-chen/ 一輪定案。照謝耀慶那一輪的結論，
     起點直接從頭頂留白 ~5% 給：640／615／590（預設）／565，
     **使用者挑了 615**（頭頂留白 6.7%、頭高 71%）—— 比預設鬆一格，
     這一次是往「不要那麼滿」走，和王俊偉、謝耀慶兩輪的方向相反 ——
     **所以「從 5% 起算」只是起點，不是新的標準**，下一位照樣給一把尺。
     位置仍照李柄輝的比例：眼睛在框高 44.2%、臉中線在框寬 49.3%。 */
  "chen-zhiling": { name: "陳芷鈴", src: [1122, 1402],
    marks: { hair: 140, eyes: 371, chin: 578, midX: 528 },
    sq: [225, 99, 615, 615] },
  /* 2026-09-23 提案頁 preview/doctor-yang/ 一輪定案。照陳芷鈴那一輪給一把尺：
     880／845／810（預設）／775，**使用者挑了 845**（頭頂留白 6.6%、頭高 67%）——
     和陳芷鈴挑的 6.7% 幾乎同一格，又一次比預設鬆一格。
     ⚠ 她是鮑伯頭、髮量厚，眼睛到髮頂（317）比陳芷鈴（231）長得多，
       所以同樣的頭頂留白，頭高比例會比別人低，框也比別人大很多 —— 不是算錯。
     ⚠⚠ **同日第二輪換了照片**：第一張上線後使用者「髮型太圓了，合成網站上圓形
       感覺雙重圓」，重新生成一張（原檔直接蓋掉 src/yang-xiaoying.png，
       第一張在 git show 8184b2b5:drafts/doctor-photo/src/yang-xiaoying.png）。
       新照片給 870／845（預設）／820／795，**使用者挑了 795**（頭頂留白 4.2%、
       頭高 74%）—— 這一次往「滿」走，和第一輪相反。
       ⚠ 圓形頭像裡，**髮型本身是圓的會和圓框疊成兩圈**；挑照片時先看髮型輪廓。
     位置仍照李柄輝的比例：眼睛在框高 44.2%、臉中線在框寬 49.3%。 */
  "yang-xiaoying": { name: "楊小瑩", src: [1086, 1448],
    marks: { hair: 70, eyes: 388, chin: 655, midX: 520 },
    sq: [128, 37, 795, 795] },
  /* 2026-09-23 提案頁 preview/doctor-liao/ 三輪定案。
     ⚠⚠ **這一輪換掉了尺的單位，下一位照這個給。** 第一輪四張照「頭寬」算，
       給出去的是框的 px（698／717／717／755），使用者：「698好像還有點小　再大一點」。
       回頭把四張和站上那三顆圓一起套格線量才知道整組小一級 ——
       李柄輝 81%、李侑津 81%、王俊偉 77%，而四張是 70／69／70／73%。
       （站上七位現在是 李柄輝 81／李侑津 81／謝耀慶 ~79／王俊偉 77／
         廖立揚 74／陳芷鈴 71／楊小瑩 67% —— 新的一位就照這一排給尺。）
       **框的 px 跨不了醫師**（每個人的原檔尺寸與取景都不一樣，王俊偉的 660
       和廖立揚的 698 不在同一把尺上），所以第二輪把尺換成
       **「頭高（髮頂到下巴）佔框高的比例」** —— 那個數字跨得了人，
       77%／81% 兩格還能直接標成「和王俊偉一樣」「和李柄輝一樣」。
       第三輪使用者**挑了 74%**（比站上那三位鬆一點，「留74%」）。
     ⚠ marks 是在**已經裁出來的 400px 成品**上套格線讀、再換算回原檔座標的
       —— 直接目測原檔的頭頂與下巴會差一截（第一輪的臉中線就量偏了 10px，
       臉因此偏左 2~3%）。下一位建議照這個做法量。
     位置仍照李柄輝的比例：眼睛在框高 44.2%、臉中線在框寬 49.3%。 */
  /* 2026-09-24 提案頁 preview/doctor-linxu/ 一輪定案（使用者：「Ok 上線」＝ 兩格預設）。
     尺照廖立揚那一輪：頭高佔框高。
     許馨文：71／74（預設）／77／81%，**上線 74%**（頭頂留白 5.9%，和楊小瑩同一格）。
       位置照李柄輝的比例：眼睛在框高 44.2%、臉中線在框寬 49.3%。 */
  "xu-xinwen": { name: "許馨文", src: [1086, 1448],
    marks: { hair: 185, eyes: 490, chin: 775, midX: 570 },
    sq: [177, 138, 797, 797] },
  /* 林晏妤：⚠⚠ 戴手術帽、帽子很高、照片取景近 —— **整張寬 1051 就是最鬆的一格**。
     照「眼睛 44.2%」定位的話框一小於 1000 帽頂就被切掉，所以這一張改用
     「帽頂留白 4%」定上緣、左右照臉中線 49.3% 但夾在原圖裡。
     1051（預設）／1020／990／960 ＝ 77／79／81／84%，**上線 1051（77%）**。
     ⚠ 這一格臉中線只能落在 52.1%（右偏約 2px／76px）—— 原圖的邊界，不是算錯。
     「眼睛到下巴」佔框 36.2%，和許馨文的 35.8% 幾乎一樣：臉的大小對得上，差的是帽子。
     hair 這裡記的是**帽頂**。 */
  "lin-yanyu": { name: "林晏妤", src: [1051, 1497],
    marks: { hair: 155, eyes: 580, chin: 960, midX: 548 },
    sq: [0, 113, 1051, 1051] },
  /* ⚠⚠ 廖立揚 2026-09-23 上線，**當天由使用者要求移除**（「廖立揚醫師照片移除」）。
     整段刻意留著但註解掉 —— 量到的四個點與定案的框是三輪換來的，刪掉就要重來。
     要放回來：把底下那三行解除註解 → node tools/doctor-photo-crop.mjs liao-liyang
     → node tools/webp.mjs → index.html 那張卡補 data-face 與 picture
     → node tools/topics.mjs && node tools/build.mjs。
     原檔（四張候選）仍在 drafts/doctor-photo/src/liao-liyang*.png。
  "liao-liyang": { name: "廖立揚", src: [1122, 1402],
    marks: { hair: 110, eyes: 346, chin: 604, midX: 546 },
    sq: [217, 51, 668, 668] },
  */
};

const WIDTH   = 400;
const QUALITY = 0.82;   /* 同 tools/hero-resize.mjs、tools/webp.mjs */

const args  = process.argv.slice(2);
const check = args.includes("--check");
const only  = args.find((a) => !a.startsWith("--"));
const jobs  = Object.entries(FACES).filter(([k]) => !only || k === only);
if (!jobs.length) { console.error(`× FACES 裡沒有 ${only}`); process.exit(1); }

const pwPaths = [process.env.PLAYWRIGHT_MODULE,
  "/opt/node22/lib/node_modules/playwright/index.js", "playwright"].filter(Boolean);
let chromium = null;
for (const p of pwPaths) {
  try { const m = await import(p); chromium = (m.default ?? m).chromium; if (chromium) break; } catch {}
}
if (!chromium) { console.error("× 找不到 playwright（或 tools/chrome-cdp.mjs）"); process.exit(1); }

const exe = process.env.CHROME_PATH
  || ["/opt/pw-browsers/chromium", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage();

let wrote = 0, same = 0, diff = 0;
for (const [slug, face] of jobs) {
  const file = path.join(SRC, `${slug}.png`);
  if (!fs.existsSync(file)) {
    console.error(`× 找不到 ${path.relative(ROOT, file)}`); process.exitCode = 1; continue;
  }
  const [x, y, w, h] = face.sq;
  const url = await page.evaluate(async (a) => {
    const img = new Image();
    img.src = "data:image/png;base64," + a.b64;
    await img.decode();
    /* 守門一：原圖尺寸要和 FACES 記的一樣（換了檔卻沒改框的話，
       裁出來的位置會整個跑掉，而且畫面上只是「臉歪了」不會報錯）。 */
    if (img.naturalWidth !== a.sw || img.naturalHeight !== a.sh) {
      return "ERR:原圖是 " + img.naturalWidth + "×" + img.naturalHeight + "，FACES 記的是 " + a.sw + "×" + a.sh;
    }
    /* 守門二：裁切框不能超出原圖 —— drawImage 不會報錯，
       只會在邊緣補出透明，存成 JPEG 就是一條黑邊。 */
    if (a.x < 0 || a.y < 0 || a.x + a.w > img.naturalWidth || a.y + a.h > img.naturalHeight) {
      return "ERR:裁切框超出原圖";
    }
    const c = document.createElement("canvas");
    c.width = a.W; c.height = a.W;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(img, a.x, a.y, a.w, a.h, 0, 0, a.W, a.W);
    return c.toDataURL("image/jpeg", a.q);
  }, { b64: fs.readFileSync(file).toString("base64"), sw: face.src[0], sh: face.src[1],
       x, y, w, h, W: WIDTH, q: QUALITY });

  if (url.startsWith("ERR:")) { console.error(`× ${face.name}：${url.slice(4)}`); process.exitCode = 1; continue; }
  const buf = Buffer.from(url.split(",")[1], "base64");
  const out = path.join(OUT, `doctor-${slug}-${WIDTH}.jpg`);
  const old = fs.existsSync(out) ? fs.readFileSync(out) : null;
  const hash = (b) => crypto.createHash("sha256").update(b).digest("hex").slice(0, 12);

  if (old && old.equals(buf)) { console.log(`  ＝ ${path.relative(ROOT, out)}（沒變）`); same++; continue; }
  if (check) { console.log(`  ≠ ${path.relative(ROOT, out)}　${old ? hash(old) : "（還沒有）"} → ${hash(buf)}`); diff++; continue; }
  fs.writeFileSync(out, buf);
  console.log(`  ✓ ${path.relative(ROOT, out)}  ${WIDTH}×${WIDTH}  ${(buf.length / 1024).toFixed(1)}KB`);
  wrote++;
}
await browser.close();

if (check) console.log(`(--check 模式，未寫入)　相同 ${same}、有差 ${diff}`);
else console.log(`${jobs.map(([, f]) => f.name).join("、")}：寫了 ${wrote} 個、${same} 個沒變`);
if (!check && wrote) console.log("⚠ 接著要跑：node tools/webp.mjs && node tools/topics.mjs && node tools/build.mjs");
