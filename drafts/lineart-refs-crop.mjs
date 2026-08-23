// 把使用者那五張線稿參考截圖裁掉 app 介面，只留插畫本身。
//   node drafts/lineart-refs-crop.mjs
// ⚠ 座標是在 1125×2436 的原始截圖上量的。
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();

const UP = "/root/.claude/uploads/e31222e7-ada9-55df-89ea-af00aef1de2f";
const JOBS = [
  { src: "d46c613a-image.png", out: "lineart-ref-1-walking.png",  box: [211, 316, 916, 1571] },
  { src: "6380a30e-image.png", out: "lineart-ref-2-engwe.png",    box: [0, 310, 1125, 1421] },
  { src: "7b624539-image.png", out: "lineart-ref-3-talking.png",  box: [0, 314, 1125, 1421] },
  { src: "433c02d6-image.png", out: "lineart-ref-4-laptop.png",   box: [0, 307, 1125, 1427] },
  { src: "e1aee647-image.png", out: "lineart-ref-5-bubbles.png",  box: [0, 314, 1125, 1043] },
];

for (const j of JOBS) {
  const uri = `data:image/png;base64,${fs.readFileSync(`${UP}/${j.src}`).toString("base64")}`;
  const b64 = await pg.evaluate(async ({ uri, box }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const [x0, y0, x1, y1] = box;
    const c = document.createElement("canvas"); c.width = x1 - x0; c.height = y1 - y0;
    c.getContext("2d").drawImage(img, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0);
    return c.toDataURL("image/png").split(",")[1];
  }, { uri, box: j.box });
  fs.writeFileSync(`drafts/${j.out}`, Buffer.from(b64, "base64"));
  console.log(j.out, `${j.box[2] - j.box[0]}×${j.box[3] - j.box[1]}`);
}
await browser.close();
