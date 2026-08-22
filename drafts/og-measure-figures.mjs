import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const f = process.argv[2];
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
const r = await pg.evaluate(async (uri) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const at = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const lum = (x, y) => { const [r0, g0, b0] = at(x, y); return 0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0; };
  const sat = (x, y) => { const [r0, g0, b0] = at(x, y).map(v => v / 255); const mx = Math.max(r0, g0, b0), mn = Math.min(r0, g0, b0), l = (mx + mn) / 2; return mx === mn ? 0 : 100 * (mx - mn) / (1 - Math.abs(2 * l - 1)); };

  let pale = 0, all = 0, edges = 0, tot = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    all++; const l = lum(x, y);
    if (sat(x, y) < 12 && l > 80 * 2.55) pale++;
  }
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const gx = Math.abs(lum(x + 1, y) - lum(x - 1, y)), gy = Math.abs(lum(x, y + 1) - lum(x, y - 1));
    tot++; if (gx + gy > 12) edges++;
  }

  // ink bbox inside a normalised box: pixel counts as "ink" if dark OR clearly coloured
  const figure = (b) => {
    const [x0, y0, x1, y1] = b;
    let minY = 1e9, maxY = -1, minX = 1e9, maxX = -1, dark = [];
    for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y++)
      for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x++) {
        const l = lum(x, y), s = sat(x, y);
        dark.push(l);
        if (l < 130) { if (y < minY) minY = y; if (y > maxY) maxY = y; if (x < minX) minX = x; if (x > maxX) maxX = x; }
      }
    dark.sort((a, b2) => a - b2);
    return {
      高px: maxY - minY, 高佔畫面: +(100 * (maxY - minY) / H).toFixed(1),
      寬px: maxX - minX,
      在250px卡上高: +(250 * (maxY - minY) / W).toFixed(1),
      最暗5百分位: +dark[Math.floor(dark.length * 0.05)].toFixed(1),
    };
  };
  const boxes = {
    "婦人": [0.44, 0.44, 0.55, 0.95],
    "醫師": [0.565, 0.40, 0.675, 0.90],
    "助理": [0.69, 0.41, 0.775, 0.88],
    "窗口鄰居": [0.32, 0.36, 0.47, 0.62],
    "門口整組(三人+門)": [0.44, 0.13, 0.80, 0.95],
  };
  const out = { W, H, palePct: +(100 * pale / all).toFixed(1), edgePct: +(100 * edges / tot).toFixed(1), 人物: {} };
  for (const [k, b] of Object.entries(boxes)) out.人物[k] = figure(b);
  return out;
}, uri);
console.log(JSON.stringify(r, null, 1));
await browser.close();
