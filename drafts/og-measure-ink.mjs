import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();

const jobs = [
  { f: "/root/.claude/uploads/e31222e7-ada9-55df-89ea-af00aef1de2f/a1614253-image.jpg", name: "參考圖",
    people: {} },
  { f: "/root/.claude/uploads/e31222e7-ada9-55df-89ea-af00aef1de2f/6dc36abb-image.jpg", name: "生成圖",
    people: { "婦人(中景)": [0.50, 0.44, 0.60, 0.92], "醫師(門口)": [0.66, 0.36, 0.76, 0.84], "鄰居(右緣)": [0.885, 0.42, 0.98, 0.96] } },
];

for (const j of jobs) {
  const uri = `data:image/jpeg;base64,${fs.readFileSync(j.f).toString("base64")}`;
  const r = await pg.evaluate(async ({ uri, people }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data;
    const lum = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; };
    // edge density: |dx|+|dy| > 12
    let edges = 0, tot = 0;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const gx = Math.abs(lum(x + 1, y) - lum(x - 1, y)), gy = Math.abs(lum(x, y + 1) - lum(x, y - 1));
      tot++; if (gx + gy > 12) edges++;
    }
    // per-person ink strength: darkest 5% of pixels in the box
    const boxInk = (b) => {
      const [x0, y0, x1, y1] = b; const vals = [];
      for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y++)
        for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x++) vals.push(lum(x, y));
      vals.sort((a, b2) => a - b2);
      const p5 = vals[Math.floor(vals.length * 0.05)], med = vals[Math.floor(vals.length * 0.5)];
      return { 最暗5百分位: +p5.toFixed(1), 中位數: +med.toFixed(1) };
    };
    const out = { W, H, edgePct: +(100 * edges / tot).toFixed(1), people: {} };
    for (const [k, b] of Object.entries(people)) out.people[k] = boxInk(b);
    return out;
  }, { uri, people: j.people });
  console.log(j.name, JSON.stringify(r));
}
await browser.close();
