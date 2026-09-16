/* 櫃檯小立牌・插圖的參考圖：從使用者 2026-09-16 傳來的兩張印花照片裁出來。
 *   node drafts/stand-card-refs-crop.mjs
 *
 * ⚠ 一張參考圖只准提供一件事（TEAM.md 第一節第 10 號：不標用途會被整張抄走）——
 *   這兩張只給「圖案本身長什麼樣」，**顏色與疏密都不要抄**：
 *   照片上的底色是商品的顏色（要換成站上的主題色），而圖案的密度是布料的密度
 *   （畫在 22 mm 寬的人身上會糊成雜點，見 og-topic-kids-prompt.md 第二節那張量測表）。
 * ⚠ 來源是使用者的手機截圖，不在版控裡 —— **裁好的成品已經進版控**，
 *   來源不在時自動略過，不要當成壞掉。
 * ⚠ 一律裁掉深灰色的舖棉那一半與牆面：參考圖上有別的東西，模型會一起畫進去。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const UP = "/root/.claude/uploads/09c36636-8bda-59aa-aaff-2f7763c38265";
const JOBS = [
  { src: `${UP}/a249ca0e-image.png`, out: "drafts/stand-print-tree-ref.jpg",
    box: [80, 1370, 900, 760], scale: 0.9, name: "印花①・針葉樹與圓樹叢（只看圖案）" },
  { src: `${UP}/0637fdfd-image.png`, out: "drafts/stand-print-dino-ref.jpg",
    box: [90, 560, 900, 760], scale: 0.9, name: "印花②・恐龍（只看圖案）" },
];

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const j of JOBS) {
  if (!fs.existsSync(j.src)) { console.log("略過（來源不在）", j.out); continue; }
  const mime = j.src.endsWith(".png") ? "image/png" : "image/jpeg";
  const uri = `data:${mime};base64,${fs.readFileSync(j.src).toString("base64")}`;
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
