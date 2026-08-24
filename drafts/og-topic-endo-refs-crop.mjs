/* 顯微根管分享圖的參考圖：從站上既有的兩張圖裁出來。
 *   node drafts/og-topic-endo-refs-crop.mjs
 *
 * ⚠ 一張參考圖只准提供一件事（ILLUSTRATION.md 第十二節二）——
 *   所以顯微鏡與臉分成兩張裁，不要用同一張兼差。
 * ⚠ 顯微鏡那張的來源是**文章 HERO**（〈根管治療的生物陶瓷〉右格），
 *   那台顯微鏡是站上唯一畫過的一台，形狀直接給圖不要用文字描述
 *   （ILLUSTRATION.md 第十之一節）。
 * ⚠ 臉那張的來源是**已上線的分享卡**（一般牙科），不是文章 HERO ——
 *   分享卡的臉是為 250px 畫的（更簡、更大），文章 HERO 的臉細節較多。
 * ⚠ 倍率是算出來的：兩張成品都要能讓模型看清楚線的實度，
 *   短邊放大到 600px 以上就夠了。存 JPEG 0.92（來源本身就是 JPEG）。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const JOBS = [
  { src: "assets/hero-bioceramic-photo-2000.jpg", out: "drafts/endo-scope-ref.jpg",
    box: [1345, 578, 262, 182], scale: 3.8, name: "牙科顯微鏡・形狀與它怎麼被使用" },
  { src: "assets/og-topic-general.jpg",           out: "drafts/endo-face-ref.jpg",
    box: [508, 268, 128, 306], scale: 4.6, name: "女醫師・分享卡尺寸下的臉與畫法" },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const j of JOBS) {
  const uri = `data:image/jpeg;base64,${fs.readFileSync(j.src).toString("base64")}`;
  const b64 = await pg.evaluate(async ({ uri, box, s }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box;
    const c = document.createElement("canvas");
    c.width = Math.round(w * s); c.height = Math.round(h * s);
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  }, { uri, box: j.box, s: j.scale });
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, `${Math.round(j.box[2] * j.scale)}×${Math.round(j.box[3] * j.scale)}  ${j.name}`);
}
await browser.close();
