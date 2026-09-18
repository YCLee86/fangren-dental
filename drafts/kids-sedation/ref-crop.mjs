// 從櫃檯立牌那張插圖裁出「中間兩位印花刷手服」當這一篇 HERO 的參考圖
//   node drafts/kids-sedation/ref-crop.mjs
// 為什麼要裁：整張餵進去會連「一整排人的橫幅構圖」一起被抄走
//（TEAM.md 第 10 號：不標用途的參考圖會被整張抄）。這一張只要「布」。
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const src = process.argv[2] ?? "preview/line-stand/illus.jpg";
const dest = process.argv[3] ?? "drafts/kids-sedation/ref-scrub-prints.jpg";
// 裁框也可以從命令列給：node ref-crop.mjs <來源> <輸出> x0 y0 x1 y1（正規化）
const B = process.argv.slice(4).map(Number);
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const out = await pg.evaluate(async ({ uri, B }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  // 正規化裁框：針葉樹那位到恐龍那位
  const b = B.length === 4 ? B : [0.375, 0.16, 0.715, 1];
  const x0 = Math.round(W * b[0]), x1 = Math.round(W * b[2]);
  const y0 = Math.round(H * b[1]), y1 = Math.round(H * b[3]);
  const c = document.createElement("canvas"); c.width = x1 - x0; c.height = y1 - y0;
  c.getContext("2d").drawImage(img, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  return { data: c.toDataURL("image/jpeg", 0.92), W, H, w: c.width, h: c.height };
}, { uri, B });
await browser.close();
fs.writeFileSync(dest,
  Buffer.from(out.data.split(",")[1], "base64"));
console.log(`原圖 ${out.W}×${out.H} → 裁出 ${out.w}×${out.h}：${dest}`);
