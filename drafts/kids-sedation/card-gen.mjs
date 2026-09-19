// 產生首頁卡專用的 16:9 圖 → assets/card-kids-sedation.jpg
//   node drafts/kids-sedation/card-gen.mjs
//
// 為什麼要這一張（2026-09-18 定案）：文章 HERO 是 4:3 的四格圖，而首頁卡的縮圖是
// aspect-ratio 16/9 ＋ object-fit cover，會**置中裁掉上下各 12.3%** ——
// 四格圖的內容一路頂到四個邊，裁下去會把上排的頭頂與下排的腳切斷（使用者當場指出來）。
// 所以卡片改用**單獨一格**：使用者選了「電話諮詢」那一格（右上）。
//
// ⚠ 這一張刻意只有 1000×563，也刻意**不叫 -1600.jpg**：
//   一格在原檔裡就只有 1000 寬，放大到 1600／2000 是假的解析度。
//   檔名不符合 `-1600.jpg` 的時候，tools/build.mjs 的 heroSrcset／webpSrcset 會回空字串，
//   呼叫端自動退回「只有 src 的單張寫法」——那正是我們要的（見那一支第 69~103 行）。
//   卡片在畫面上是 360~392 CSS px，1000 寬仍有 2.5 倍以上的密度。
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const exe = ["/opt/pw-browsers/chromium/chrome-linux/chrome",
             "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
             "/usr/bin/chromium"].find(p => fs.existsSync(p));
const b = await chromium.launch({ executablePath: exe });
const pg = await b.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync("drafts/kids-sedation/hero-final.jpg").toString("base64")}`;
const out = await pg.evaluate(async (uri) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const pw = Math.round(W / 2), ph = Math.round(H / 2);   // 一格 1000×746
  const keep = Math.round(pw * 9 / 16);                    // 563
  const sx = pw, sy = 45;                                  // 右上那一格，往下 45px 開始裁
  const c = document.createElement("canvas"); c.width = pw; c.height = keep;
  c.getContext("2d").drawImage(img, sx, sy, pw, keep, 0, 0, pw, keep);
  return { data: c.toDataURL("image/jpeg", 0.88), pw, keep, sy };
}, uri);
await b.close();
fs.writeFileSync("assets/card-kids-sedation.jpg", Buffer.from(out.data.split(",")[1], "base64"));
const kb = Math.round(fs.statSync("assets/card-kids-sedation.jpg").size / 1024);
console.log(`寫好了：assets/card-kids-sedation.jpg　${out.pw}×${out.keep}　${kb} KB（右上那一格，往下 ${out.sy}px 起裁）`);
