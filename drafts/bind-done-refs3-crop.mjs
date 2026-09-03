/* 臉的參考圖：從站上兩張已上線的 HERO 裁出人臉（2026-09-03 第三輪）
 *   node drafts/bind-done-refs3-crop.mjs
 *   → drafts/bind-done-ref-face-1.jpg  〈孩子第一次看牙〉的爸爸／小孩／媽媽（三種年紀）
 *   → drafts/bind-done-ref-face-2.jpg  〈定期檢查〉櫃檯那一組（鼠尾草綠刷手服的人員＋長輩＋小孩）
 *
 * ⚠⚠ 為什麼要這兩張：第二版的臉是**照國泰那兩張參考圖畫的** —— 白紙底、兩顆點眼、
 *   沒有鼻子。使用者：「人臉風格有點蒼白，之前診所網站的人物我覺得很不錯。」
 *   站上的臉有**膚色、眉毛、鼻子、有表情的嘴**，線是暖深棕且粗細有變化。
 * ⚠ 裁完放大兩倍（同 drafts/surg-refs-crop.mjs 那一輪）—— 生成模型要看得清五官。
 * ⚠ 這兩張只提供「臉與膚色怎麼畫」，構圖與畫風的其餘部分不從這裡拿。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
/* 座標在各自的 2000px 原檔上量（800px 版的座標 × 2.5） */
const JOBS = [
  { src: "assets/hero-kids-photo-2000.jpg",    out: "drafts/bind-done-ref-face-1.jpg",
    box: [700, 250, 750, 560] },
  { src: "assets/hero-checkup-photo-2000.jpg", out: "drafts/bind-done-ref-face-2.jpg",
    box: [850, 430, 720, 470] },
];
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const j of JOBS) {
  const uri = `data:image/jpeg;base64,${fs.readFileSync(j.src).toString("base64")}`;
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
  console.log(j.out, j.box.join(","), (fs.statSync(j.out).size / 1024).toFixed(0) + "KB");
}
await browser.close();
