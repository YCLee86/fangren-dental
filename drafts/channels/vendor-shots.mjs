/* 廠商對接那一頁要用的縮圖 → preview/line-vendor/t-<key>.jpg
 *   node drafts/channels/vendor-shots.mjs        （--check 只驗不寫）
 *
 * 使用者 2026-09-11：「文字太多了　精簡一點　也要附圖對照文字看」。
 * 所以那一頁的「現在有哪幾則在跑」從一張橫捲的表改成**一格一則、左邊擺那一則
 * 自己的模擬圖** —— 圖就是它的名字，文字因此可以只留兩行。
 *
 * ⚠⚠ **只搬不畫**（同 oa-shots.mjs）：圖本身是各則規格頁自己拍的產出檔，
 *   這一支只做「等比例縮小 ＋ 裁成正方」。要換圖去改那一則自己的出圖腳本。
 *
 * ⚠ 為什麼要縮：十張原檔合計約 3.3MB，而 Worker 對 `/preview/*` 設 `no-store`
 *   （CLAUDE.md 第九節第 23 條）—— 每次開頁都重載一次。縮成 210px 見方的 JPEG
 *   之後十張合計約 90KB。
 *
 * ⚠ 裁的是**上緣那一塊正方**（`cover` ＋ 對齊上緣）：這幾張都是直的卡片，
 *   上緣正好是頭圖與開場那一行 ＝ 最認得出來的那一段。
 *   `shot-query` 是橫的（輪播），裁到的是最左邊那一張卡，一樣成立。
 *
 * ⚠⚠ **有兩張不是我們自己拍的，是廠商送來的畫面**（`vbooked`／`vquery`）——
 *   ⑥⑦ 那兩則現在要「我們的定稿」與「廠商那一版」並排對照（使用者 2026-09-12），
 *   所以來源是 `preview/line-vendor/` 底下那幾張截圖本人。
 *   ⚠ 它們是 **JPEG 而且是橫的**，所以這一支的來源讀檔要分副檔名，
 *   裁出來的是**左邊那一塊正方**（橫的圖，短邊是高）。
 *   ⚠ 那幾張的病人姓名在**做那張圖的時候**就遮掉了（這個 repo 是公開的），
 *   這一支只縮不改，不要在這裡補遮罩。
 *
 * ⚠ 出 **JPEG** 不是 PNG：同樣是 210px 見方，PNG 合計 489KB、JPEG 只有約 90KB
 *   （這幾張裡有照片，PNG 對照片本來就不划算），而縮圖看不出畫質差別。
 *
 * ⚠ 兩道守門：① 出來的一定要是正方（縮放算錯會靜靜地變形）
 *              ② 不可以整片同一個顏色（裁到空白處 ＝ 那一格等於沒有圖，
 *                 而尺寸守門照樣會過）
 * ⚠ 產圖一律用 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(ROOT, "preview", "line-vendor");
const CHECK = process.argv.includes("--check");

const SIDE = 210;            /* 出圖邊長（頁面上畫 70px，＝ DPR 3） */

/* key ＝ 那一則在頁面上的代號；src ＝ 它自己那一頁拍的產出檔 */
export const SHOTS = [
  { key: "welcome", src: "line-welcome/shot-welcome.png" },
  { key: "auto",    src: "line-auto-reply/shot-auto-reply.png" },
  { key: "binddone",src: "line-bind-done/shot-bind-done.png" },
  { key: "bindprompt",     src: "line-bind-prompt/shot-bind-prompt.png" },
  { key: "bindprompt-old", src: "line-bind-prompt/shot-bind-prompt-old.png" },
  { key: "booked",  src: "line-booked/shot-booked.png" },
  { key: "query",   src: "line-booked/shot-query.png" },
  { key: "remind",  src: "line-remind/shot-remind.png" },
  { key: "cancel",  src: "line-cancel/shot-cancel.png" },
  { key: "review",  src: "line-review/shot-review.png" },
  { key: "typhoon", src: "line-typhoon/shot-typhoon.png" },
  { key: "oa",      src: "line-spec/shot-oa-clinic.png" },
  /* 廠商送來的畫面（JPEG、橫的），給 ⑥⑦ 兩則做對照 */
  { key: "vbooked", src: "line-vendor/vendor-booked-a-0910.jpg" },
  { key: "vquery",  src: "line-vendor/vendor-query-0910.jpg" },
];

if (import.meta.url === `file://${process.argv[1]}`) {
  const png = (f) => {
    const b = fs.readFileSync(f);
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length, buf: b };
  };
  /* JPEG 的尺寸要掃 SOF 標記，不能像 PNG 那樣讀固定位移 */
  const jpg = (f) => {
    const b = fs.readFileSync(f);
    for (let i = 2; i < b.length - 9; ) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), bytes: b.length, buf: b };
      i += 2 + b.readUInt16BE(i + 2);
    }
    throw new Error(`${f} 讀不出 JPEG 尺寸`);
  };

  /* 來源可能是 PNG（我們自己拍的）也可能是 JPEG（廠商送來的畫面） */
  const read = (f) => {
    const jpeg = /\.jpe?g$/i.test(f);
    const r = jpeg ? jpg(f) : png(f);
    return { ...r, mime: jpeg ? "image/jpeg" : "image/png" };
  };

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

  const bad = [], rows = [];
  for (const j of SHOTS) {
    const srcPath = path.join(ROOT, "preview", j.src);
    if (!fs.existsSync(srcPath)) { bad.push(`找不到來源 ${j.src}`); continue; }
    const s = read(srcPath);

    const r = await pg.evaluate(async ({ uri, side }) => {
      const img = new Image(); img.src = uri; await img.decode();
      const n = Math.min(img.naturalWidth, img.naturalHeight);   /* cover：取短邊 */
      const c = document.createElement("canvas"); c.width = side; c.height = side;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(img, 0, 0, n, n, 0, 0, side, side);            /* 從左上角切 */
      const d = g.getImageData(0, 0, side, side).data;
      let mn = 255, mx = 0;
      for (let i = 0; i < d.length; i += 4) {
        const v = (d[i] + d[i + 1] + d[i + 2]) / 3;
        if (v < mn) mn = v; if (v > mx) mx = v;
      }
      return { spread: mx - mn, png: c.toDataURL("image/jpeg", 0.84) };
    }, { uri: `data:${s.mime};base64,${s.buf.toString("base64")}`, side: SIDE });

    if (r.spread < 30) bad.push(`${j.key}：裁出來幾乎是同一個顏色（明暗只差 ${r.spread.toFixed(0)} 階）`);

    const buf = Buffer.from(r.png.split(",")[1], "base64");
    const outPath = path.join(OUT_DIR, `t-${j.key}.jpg`);
    if (CHECK) {
      if (!fs.existsSync(outPath)) bad.push(`t-${j.key}.jpg：還沒產出來`);
      else {
        const o = jpg(outPath);
        if (o.w !== SIDE || o.h !== SIDE) bad.push(`t-${j.key}.jpg：站上那份是 ${o.w}×${o.h}，應該是 ${SIDE}×${SIDE}`);
      }
    } else {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(outPath, buf);
    }
    rows.push(`  t-${j.key}.jpg`.padEnd(20) + `${SIDE}×${SIDE}  ${(buf.length / 1024).toFixed(0).padStart(3)}KB` +
      `　（原檔 ${s.w}×${s.h}　${(s.bytes / 1024).toFixed(0)}KB）`);
  }
  await browser.close();

  if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
  console.log(rows.join("\n"));
  console.log(CHECK ? `✓ ${rows.length} 張都在，尺寸對得上` : "✓ 已寫進 preview/line-vendor/");
}
