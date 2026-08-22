import fs from "node:fs";
const { chromium } = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default ?? (await import("/opt/node22/lib/node_modules/playwright/index.js"));
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const files = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
for (const f of files) {
  const uri = `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
  const r = await pg.evaluate(async (uri) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data;
    const hsl = (r, gg, b) => {
      r /= 255; gg /= 255; b /= 255;
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), l = (mx + mn) / 2;
      const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
      return [s * 100, l * 100];
    };
    let n = 0, sS = 0, sL = 0, chroma = 0, pale = 0, all = 0;
    for (let i = 0; i < d.length; i += 4) {
      const [s, l] = hsl(d[i], d[i + 1], d[i + 2]);
      all++;
      if (s > 25) chroma++;
      if (s < 12 && l > 80) pale++;
      if (l < 12 || l > 96) continue;
      n++; sS += s; sL += l;
    }
    // luminance map helper for region contrast
    const lum = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; };
    const boxStats = (x0, y0, x1, y1) => {
      let mn = 255, mx = 0, s = 0, k = 0;
      for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y++)
        for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x++) { const v = lum(x, y); mn = Math.min(mn, v); mx = Math.max(mx, v); s += v; k++; }
      return { min: +mn.toFixed(1), max: +mx.toFixed(1), mean: +(s / k).toFixed(1), range: +(mx - mn).toFixed(1) };
    };
    return {
      W, H,
      meanS: +(sS / n).toFixed(1), meanL: +(sL / n).toFixed(1),
      chromaPct: +(100 * chroma / all).toFixed(1),
      palePct: +(100 * pale / all).toFixed(1),
      boxes: {
        lowerLeft: boxStats(0, 0.6, 0.46, 1),
        rightEdge: boxStats(0.86, 0.4, 1.0, 0.95),
        centre: boxStats(0.45, 0.3, 0.75, 0.9),
      },
    };
  }, uri);
  console.log(f.split("/").pop(), JSON.stringify(r, null, 1));
}
await browser.close();
