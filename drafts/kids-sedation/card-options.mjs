// 首頁卡那張如果「不跟 HERO 共用」，可以從現有這張圖裁一格出來。
// 這一支把四格各自裁成 16:9、縮到真實卡片尺寸（360×203）讓使用者挑。
//   node drafts/kids-sedation/card-options.mjs
// ⚠ 每一格是 1000×746（2×2），裁成 16:9 之後是 1000×563，所以格內也會上下各少 12.3%。
//   裁窗因此不是置中，而是逐格指定，讓臉留在裡面。
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const exe = ["/opt/pw-browsers/chromium/chrome-linux/chrome",
             "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
             "/usr/bin/chromium"].find(p => fs.existsSync(p));
const b = await chromium.launch({ executablePath: exe });
const uri = `data:image/jpeg;base64,${fs.readFileSync("drafts/kids-sedation/hero-final.jpg").toString("base64")}`;
const pg = await b.newPage();

// 逐格的裁窗。top 是「從這一格的上緣往下多少比例開始裁」（0 ＝ 貼齊上緣）
const PANELS = [
  { key: "1-建議",  col: 0, row: 0, top: 0.00 },
  { key: "2-電話",  col: 1, row: 0, top: 0.06 },
  { key: "3-治療",  col: 0, row: 1, top: 0.14 },
  { key: "4-術後",  col: 1, row: 1, top: 0.10 },
];

const out = await pg.evaluate(async ({ uri, PANELS }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const pw = Math.round(W / 2), ph = Math.round(H / 2);   // 一格的大小
  const keep = Math.round(pw * 9 / 16);                    // 格內 16:9 留得住的高度
  const res = {};
  for (const p of PANELS) {
    const sx = p.col * pw;
    const sy = p.row * ph + Math.round((ph - keep) * Math.min(1, Math.max(0, p.top / ((ph - keep) / ph))));
    const c = document.createElement("canvas"); c.width = 360; c.height = 203;
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(img, sx, sy, pw, keep, 0, 0, 360, 203);
    res[p.key] = c.toDataURL("image/jpeg", 0.92);
  }
  return { res, pw, ph, keep };
}, { uri, PANELS });
await b.close();

for (const [k, v] of Object.entries(out.res))
  fs.writeFileSync(`drafts/kids-sedation/card-${k}.jpg`, Buffer.from(v.split(",")[1], "base64"));
console.log(`一格 ${out.pw}×${out.ph} → 格內 16:9 留 ${out.pw}×${out.keep}，縮到卡片的 360×203`);
console.log("寫好了：" + Object.keys(out.res).map(k => `card-${k}.jpg`).join("、"));
