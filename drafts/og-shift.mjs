/* 把分享圖的內容整體往下移，上方補同色背景、下方裁掉 —— 為了讓上緣那條玻璃帶
   不要壓到人的頭（2026-08-25 植牙那一張：端菜的年輕人整顆頭被帶子切掉）。
     node drafts/og-shift.mjs <原檔> <spec> --shift <px，成品尺度>
   ⚠ 填充色取**原圖最上面一列的中位色**，不是猜的 —— 頂端本來就是純色背景，
     取中位就接得起來，看不出接縫。
   ⚠ 只能往下移，代價是**底部被裁掉同樣的高度**（1.91:1 是硬規格，不能改）。
   ⚠ 出圖後要重跑 tools/og-plate.mjs 疊帶子。                                   */
import fs from "node:fs";
import path from "node:path";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const [src, spec] = process.argv.slice(2);
const si = process.argv.indexOf("--shift");
const SHIFT = si >= 0 ? Number(process.argv[si + 1]) : 70;
const W = 1200, H = 628;
const out = `assets/og-topic-${spec}.jpg`;

const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const b64 = await pg.evaluate(async ({ uri, W, H, SHIFT }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const iw = img.naturalWidth, ih = img.naturalHeight;
  /* 先量原圖最上面三列的中位色 */
  const m = document.createElement("canvas"); m.width = iw; m.height = 3;
  const mg = m.getContext("2d", { willReadFrequently: true });
  mg.drawImage(img, 0, 0, iw, 3, 0, 0, iw, 3);
  const d = mg.getImageData(0, 0, iw, 3).data;
  const R = [], G = [], B = [];
  for (let i = 0; i < d.length; i += 4) { R.push(d[i]); G.push(d[i+1]); B.push(d[i+2]); }
  const med = a => { a.sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
  const fill = `rgb(${med(R)},${med(G)},${med(B)})`;

  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.fillStyle = fill; g.fillRect(0, 0, W, H);
  const scale = W / iw;                       // 寬對齊，等比
  g.drawImage(img, 0, SHIFT, W, ih * scale);  // 往下移，底部超出的自然被裁
  return { data: c.toDataURL("image/jpeg", 0.82).split(",")[1], fill, drawnH: Math.round(ih * scale) };
}, { uri, W, H, SHIFT });
fs.writeFileSync(out, Buffer.from(b64.data, "base64"));
console.log(`✓ ${out}  ${W}×${H}　下移 ${SHIFT}px・上方補 ${b64.fill}・底部裁掉 ${b64.drawnH + SHIFT - H}px`);
await browser.close();
