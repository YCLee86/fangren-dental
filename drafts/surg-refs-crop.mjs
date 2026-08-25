/* 從〈拔智齒之後〉那張 HERO 裁出兩張參考圖（2026-08-25，第八輪）
 *   node drafts/surg-refs-crop.mjs
 *   → drafts/surg-doctor-ref.jpg   短髮女醫師（口腔外科那一位的長相與髮型）
 *   → drafts/surg-patient-ref.jpg  二十幾歲的年輕男病人（赭黃上衣）
 * 使用者指定：「口腔外科是女醫師，官網上有口腔外科的短髮醫師圖片，可能要拿來用」，
 * 以及「病人年紀太大了，來拔智齒的通常是二十幾歲的年輕人」。
 * ⚠ 座標是在 2000×1116 的原檔上量的；裁完放大兩倍，讓生成模型看得清五官。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const SRC = "assets/hero-wisdom-photo-2000.jpg";
const JOBS = [
  { out: "drafts/surg-doctor-ref.jpg",  box: [150, 400, 330, 700] },
  { out: "drafts/surg-patient-ref.jpg", box: [480, 380, 380, 720] },
];
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
for (const j of JOBS) {
  const b64 = await pg.evaluate(async ({ uri, box }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x, y, w, h] = box, S = 2;
    const c = document.createElement("canvas"); c.width = w * S; c.height = h * S;
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(img, x, y, w, h, 0, 0, w * S, h * S);
    return c.toDataURL("image/jpeg", 0.92).split(",")[1];
  }, { uri, box: j.box });
  fs.writeFileSync(j.out, Buffer.from(b64, "base64"));
  console.log(j.out, j.box.join(","), fs.statSync(j.out).size, "bytes");
}
await browser.close();
