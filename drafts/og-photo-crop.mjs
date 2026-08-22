import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const U = "/root/.claude/uploads/e31222e7-ada9-55df-89ea-af00aef1de2f/";
const jobs = [
  // [檔名, 標籤, x0,y0,x1,y1（都用比例）]
  [U+"90aa0820-image.jpg", "正面-騎樓帶", 0.17, 0.655, 0.845, 0.966],
  [U+"90aa0820-image.jpg", "正面-含二樓窗", 0.17, 0.50, 0.845, 0.96],
  [U+"dfb37cdd-image.jpg", "側面-通道與盆栽", 0.05, 0.60, 0.98, 1.0],
  [U+"dfb37cdd-image.jpg", "側面-洗石子基座帶", 0.28, 0.72, 1.0, 1.0],
];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const pg = await b.newPage();
for (const [f, label, x0, y0, x1, y1] of jobs) {
  const uri = `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
  const out = await pg.evaluate(async ({ uri, box }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    let [x0, y0, x1, y1] = box;
    let sx = x0 * W, sy = y0 * H, sw = (x1 - x0) * W, sh = (y1 - y0) * H;
    // 收成 1.91:1（只往內裁，不變形）
    const target = 1200 / 628;
    if (sw / sh > target) { const nw = sh * target; sx += (sw - nw) / 2; sw = nw; }
    else { const nh = sw / target; sy += (sh - nh) / 2; sh = nh; }
    const mk = (W2) => { const c = document.createElement("canvas"); c.width = W2; c.height = Math.round(W2 / target);
      const g = c.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height); return c.toDataURL("image/png"); };
    return { small: mk(250), big: mk(1200), src: [Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh)] };
  }, { uri, box: [x0, y0, x1, y1] });
  fs.writeFileSync(`photo-${label}-250.png`, Buffer.from(out.small.split(",")[1], "base64"));
  fs.writeFileSync(`photo-${label}-1200.png`, Buffer.from(out.big.split(",")[1], "base64"));
  console.log(label, "→", out.src.join(","));
}
await b.close();
