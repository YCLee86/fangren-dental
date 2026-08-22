import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const OUT = "/tmp/claude-0/-home-user-fangren-dental/e31222e7-ada9-55df-89ea-af00aef1de2f/scratchpad/";
const SRC = "/root/.claude/uploads/e31222e7-ada9-55df-89ea-af00aef1de2f/a1614253-image.jpg";

// 參考圖 1640x924。四個候選裁切（都收成 1.91:1），模擬分享卡的取景
const CROPS = {
  "A-花店那組":       [0, 470, 620, 325],
  "B-門口那組":       [640, 470, 620, 325],
  "C-老夫婦與學生":   [1010, 470, 620, 325],
  "D-含二樓窗的大景": [456, 180, 1184, 620],
  "E-半寬(兩組)":     [560, 400, 900, 471],
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;
const res = await pg.evaluate(async ({ uri, crops }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const out = {};
  for (const [name, [x, y, w, h]] of Object.entries(crops)) {
    const mk = (W) => {
      const c = document.createElement("canvas");
      c.width = W; c.height = Math.round(W * h / w);
      const g = c.getContext("2d");
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
      return c.toDataURL("image/png");
    };
    out[name] = { small: mk(250), big: mk(1200), src: [x, y, w, h] };
  }
  return out;
}, { uri, crops: CROPS });
await browser.close();

for (const [name, o] of Object.entries(res)) {
  for (const [k, key] of [["250", "small"], ["1200", "big"]]) {
    const b = Buffer.from(o[key].split(",")[1], "base64");
    fs.writeFileSync(`${OUT}crop-${name}-${k}.png`, b);
  }
  console.log(name, "裁切自", o.src.join(","));
}
