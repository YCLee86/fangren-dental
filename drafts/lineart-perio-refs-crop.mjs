/* 牙周線稿的姿勢參考圖：從**分享圖的原檔**裁兩塊出來，放大 1.5 倍。
 *   node drafts/lineart-perio-refs-crop.mjs
 *
 * ⚠ 原檔是 drafts/og-topic-perio-src.jpg（2848×1504），不是 assets/ 底下那張
 *   已經疊過玻璃帶的成品 —— 帶子會被當成畫面的一部分抄進去。
 * ⚠ 倍率 1.5 是算出來的，不是挑的：一般牙科那次是 1422 寬的原檔 ×3
 *   ＝ 成品座標的 3.55 倍；這一張原檔 2848 寬 ＝ 成品的 2.373 倍，×1.5 剛好也是 3.56。
 * ⚠ 存成 JPEG 0.92 不是 PNG —— 同樣的裁切 PNG 是 4.3MB，而它只是拿去餵模型的
 *   參考圖，來源本身也是 JPEG。
 * ⚠ 姿勢參考**一定要含腿**（ILLUSTRATION.md 第十二節二）——「站穩了在頂著後座力」
 *   這件事是靠下半身讀出來的。第一版裁到 x=548 把後腳切掉了，往左讓到 405。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const SRC = "drafts/og-topic-perio-src.jpg";
const SCALE = 1.5;
const JOBS = [
  /* 醫師：頭頂上方留一點 → 兩腳都在裡面；水管的 S 彎也帶到 */
  { out: "drafts/lineart-perio-pose-ref.jpg",  box: [405, 226, 964, 1262], name: "醫師・頂著後座力的站姿（含腿）" },
  /* 細菌：空中翻滾那一隻 ＋ 擠成一團往右跑的那一群 */
  { out: "drafts/lineart-perio-germs-ref.jpg", box: [2214, 274, 634, 845], name: "細菌・被沖得往右逃" },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
for (const j of JOBS) {
  const b64 = await pg.evaluate(async ({ uri, box, SCALE }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box;
    const c = document.createElement("canvas");
    c.width = Math.round(w * SCALE); c.height = Math.round(h * SCALE);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  }, { uri, box: j.box, SCALE });
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, `${Math.round(j.box[2] * SCALE)}×${Math.round(j.box[3] * SCALE)}  ${j.name}`);
}
await browser.close();
