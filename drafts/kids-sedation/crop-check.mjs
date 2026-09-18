// 首頁卡的縮圖是 16:9 ＋ object-fit: cover，4:3 的圖會被置中裁掉上下。
// 這一支做三件：① 量首頁卡縮圖在手機與桌機的實際尺寸
//               ② 把 HERO 依同一個裁法裁出來（crop-16x9.jpg）
//               ③ 在原圖上把「會被切掉的兩條」標出來（crop-guide.jpg）
//   node drafts/kids-sedation/crop-check.mjs      （要先開 node tools/serve.mjs）
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const exe = ["/opt/pw-browsers/chromium/chrome-linux/chrome",
             "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
             "/usr/bin/chromium"].find(p => fs.existsSync(p));
const b = await chromium.launch({ executablePath: exe });

/* ① 首頁卡縮圖的實際尺寸 */
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  await pg.goto("http://localhost:8791/", { waitUntil: "networkidle" });
  const r = await pg.evaluate(() => {
    const im = document.querySelector(".card img");
    if (!im) return null;
    const b = im.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height),
             fit: getComputedStyle(im).objectFit, ar: getComputedStyle(im).aspectRatio };
  });
  console.log(`首頁卡縮圖 @${w}px → ${r ? `${r.w}×${r.h}　object-fit: ${r.fit}　aspect-ratio: ${r.ar}` : "找不到 .card img"}`);
  await pg.close();
}

/* ②③ 裁圖與標示 */
const src = "drafts/kids-sedation/hero-final.jpg";
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const pg = await b.newPage();
const out = await pg.evaluate(async (uri) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const keep = Math.round(W * 9 / 16);          // 16:9 之下留得住的高度
  const cut = Math.round((H - keep) / 2);       // 上下各切掉多少

  // ② 裁出來的樣子
  const c1 = document.createElement("canvas"); c1.width = W; c1.height = keep;
  c1.getContext("2d").drawImage(img, 0, cut, W, keep, 0, 0, W, keep);

  // ③ 在原圖上標出被切掉的兩條
  const c2 = document.createElement("canvas"); c2.width = W; c2.height = H;
  const g = c2.getContext("2d");
  g.drawImage(img, 0, 0);
  g.fillStyle = "rgba(190, 60, 60, 0.42)";
  g.fillRect(0, 0, W, cut);
  g.fillRect(0, H - cut, W, cut);
  g.strokeStyle = "rgba(150, 30, 30, 0.95)"; g.lineWidth = 5; g.setLineDash([22, 14]);
  g.beginPath(); g.moveTo(0, cut); g.lineTo(W, cut);
  g.moveTo(0, H - cut); g.lineTo(W, H - cut); g.stroke();

  // ④ 真實卡片尺寸（手機 360×203、桌機 392×220），看的是「這麼小還讀不讀得懂」
  const real = {};
  for (const [name, w] of [["card-360", 360], ["card-392", 392]]) {
    const h = Math.round(w * 9 / 16);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const gg = c.getContext("2d"); gg.imageSmoothingQuality = "high";
    gg.drawImage(img, 0, cut, W, keep, 0, 0, w, h);
    real[name] = c.toDataURL("image/jpeg", 0.92);
  }
  return { keep, cut, pct: +(cut / H * 100).toFixed(1), W, H, real,
           crop: c1.toDataURL("image/jpeg", 0.9), guide: c2.toDataURL("image/jpeg", 0.9) };
}, uri);
await b.close();

const wr = (name, dataUrl) =>
  fs.writeFileSync(`drafts/kids-sedation/${name}`, Buffer.from(dataUrl.split(",")[1], "base64"));
wr("crop-16x9.jpg", out.crop);
wr("crop-guide.jpg", out.guide);
for (const [k, v] of Object.entries(out.real)) wr(`crop-${k}.jpg`, v);
console.log(`原圖 ${out.W}×${out.H} → 16:9 留下 ${out.W}×${out.keep}，上下各切掉 ${out.cut}px（${out.pct}%）`);
console.log("寫好了：crop-16x9.jpg（裁出來的樣子）／crop-guide.jpg（紅色是被切掉的）／crop-card-360.jpg 與 crop-card-392.jpg（真實卡片尺寸）");
