import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const pg = await b.newPage();
const uri = `data:image/png;base64,${fs.readFileSync(process.argv[2]).toString("base64")}`;
const boxes = { "白袍醫師": [0.47,0.24,0.60,0.97], "牽腳踏車的老先生": [0.65,0.24,0.79,0.97], "拿菜的老太太": [0.79,0.26,0.92,0.97], "門口的小孩": [0.18,0.45,0.28,0.95] };
console.log(JSON.stringify(await pg.evaluate(async ({uri, boxes}) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const d = g.getImageData(0,0,W,H).data;
  const lum = (x,y) => { const i=(y*W+x)*4; return 0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2]; };
  const out = { W, H };
  for (const [k,[x0,y0,x1,y1]] of Object.entries(boxes)) {
    let minY=1e9,maxY=-1;
    for (let y=Math.round(y0*H); y<Math.round(y1*H); y++) for (let x=Math.round(x0*W); x<Math.round(x1*W); x++)
      if (lum(x,y) < 120) { if (y<minY) minY=y; if (y>maxY) maxY=y; }
    const hh = maxY-minY;
    out[k] = { 全身高佔畫面: +(100*hh/H).toFixed(1), 在250px卡上全身: +(250*hh/W).toFixed(1), 估頭高250px卡: +(250*hh/W/6.5).toFixed(1) };
  }
  return out;
}, {uri, boxes}), null, 1));
await b.close();
