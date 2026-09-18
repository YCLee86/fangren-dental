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
const src = "preview/line-stand/illus.jpg";
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const out = await pg.evaluate(async (uri) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  // 正規化裁框：針葉樹那位到恐龍那位
  const x0 = Math.round(W * 0.375), x1 = Math.round(W * 0.715);
  const y0 = Math.round(H * 0.16),  y1 = H;
  const c = document.createElement("canvas"); c.width = x1 - x0; c.height = y1 - y0;
  c.getContext("2d").drawImage(img, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  return { data: c.toDataURL("image/jpeg", 0.92), W, H, w: c.width, h: c.height };
}, uri);
await browser.close();
fs.writeFileSync("drafts/kids-sedation/ref-scrub-prints.jpg",
  Buffer.from(out.data.split(",")[1], "base64"));
console.log(`原圖 ${out.W}×${out.H} → 裁出 ${out.w}×${out.h}：drafts/kids-sedation/ref-scrub-prints.jpg`);
