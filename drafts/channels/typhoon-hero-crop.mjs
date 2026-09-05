/* 颱風／臨時休診那一則的頭圖：使用者定稿的原檔（16:9）→ 1024×512（2:1）
 *   node drafts/channels/typhoon-hero-crop.mjs
 *   drafts/typhoon-hero-src.jpg  →  preview/line-typhoon/hero-typhoon.jpg
 *
 * ⚠⚠ **這一張圖兩條路共用**（第 25-14 節）：聊天室裡「貼一張照片 ＋ 他自己打字」
 *   那一格，和 Flex 圖卡的頭圖，都是這張 2:1。1040×1040 是「圖文訊息」才有的規格，
 *   而那條路已經排除掉了（字烘在圖裡 ＝ 每次颱風重畫一張）。
 *
 * ⚠⚠⚠ **守門不可以照抄 remind／review 那兩支** —— 那兩支的地標都是「深墨」
 *   （<120 或 <70 的線稿），而**這一張整張都是暗的**：實測 768 列裡
 *   每一列都有 >40 個 <70 的像素，`深墨離上緣幾列` 這種量測在這裡回的是 0/767，
 *   完全沒有資訊。**通則（第三次記）：地標要挑「這一張圖才有、而且一定存在」的東西。**
 *   這一張挑的是**黃雨衣** —— 提示詞明文寫著它是全圖最亮的一塊，也正是縮圖上
 *   眼睛第一個找到的東西；實測它（含黃雨鞋）落在原檔第 431~678 列。
 *
 * ⚠ 裁法 **上 40 / 下 40**：16:9 收成 2:1 要拿掉 80 列，而這一張**兩端都有餘裕**，
 *   所以不必偏心 ——
 *   ・上面 40 列全是暴風天空與雨（最上面的實體是左邊那棵樹的樹冠，約第 150 列）。
 *   ・下面 40 列全是積水與倒影（最低的鞋子在第 700 列上下，黃雨鞋收在第 678 列）。
 *   ⚠ 從上面裁會讓二樓那幾扇窗的上緣跑出畫面 —— 那是對的，原檔右半本來就有
 *     好幾扇窗是貼著上緣被切掉的。
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
const SRC = "drafts/typhoon-hero-src.jpg";
const OUT = "preview/line-typhoon/hero-typhoon.jpg";
const CUT_T = 40, CUT_B = 40, W_OUT = 1024, H_OUT = 512;
const Y_MARGIN = 12;     /* 黃雨衣上下至少要離邊這麼多列（成品座標） */

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const r = await pg.evaluate(async ({ uri, CUT_T, CUT_B, W_OUT, H_OUT }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const sh = H - CUT_T - CUT_B;
  const c = document.createElement("canvas"); c.width = W_OUT; c.height = H_OUT;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, CUT_T, W, sh, 0, 0, W_OUT, H_OUT);

  const d = g.getImageData(0, 0, W_OUT, H_OUT).data;
  const lum = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  /* 黃雨衣（含黃雨鞋）：亮而且黃 —— 這一張唯一穩定的地標 */
  let yTop = -1, yBot = -1, yPix = 0;
  for (let y = 0; y < H_OUT; y++) {
    let n = 0;
    for (let x = 0; x < W_OUT; x++) {
      const i = (y * W_OUT + x) * 4, R = d[i], G = d[i + 1], B = d[i + 2];
      if (R > 170 && G > 130 && B < 110 && R - B > 80 && G - B > 50) n++;
    }
    yPix += n;
    if (n >= 3) { if (yTop < 0) yTop = y; yBot = y; }
  }
  /* 一條邊「又均勻又亮」＝ 烘進去的白框。這一張四邊都是暗的暴風天空與積水，
     所以用絕對亮度判斷就夠，不必像 bind-done 那樣拿紙底當基準。 */
  const stat = (pts) => {
    const a = pts.map(lum).sort((p, q) => p - q);
    return { spread: a[Math.floor(a.length * .95)] - a[Math.floor(a.length * .05)], med: a[a.length >> 1] };
  };
  const row = (y) => stat([...Array(W_OUT)].map((_, x) => (y * W_OUT + x) * 4));
  const col = (x) => stat([...Array(H_OUT)].map((_, y) => (y * W_OUT + x) * 4));
  const edges = { top: row(0), bottom: row(H_OUT - 1), left: col(0), right: col(W_OUT - 1) };
  return { W, H, yTop, yBot, yPix, edges, jpeg: c.toDataURL("image/jpeg", 0.9) };
}, { uri, CUT_T, CUT_B, W_OUT, H_OUT });
await browser.close();

const bad = [];
if (r.W / r.H < 1.7 || r.W / r.H > 1.8) bad.push(`原檔不是 16:9（${r.W}×${r.H}）`);
if (Math.abs(W_OUT / H_OUT - 2) > 0.01) bad.push("成品不是 2:1");
if (W_OUT > 1024 || H_OUT > 1024) bad.push("超過 LINE 的 1024×1024");
if (r.yPix < 1500) bad.push(`找不到黃雨衣（只有 ${r.yPix} 個黃像素）—— 換圖了就要重新定地標`);
else {
  if (r.yTop < Y_MARGIN) bad.push(`黃雨衣離上緣只有 ${r.yTop} 列（要 ≥ ${Y_MARGIN}）`);
  if (H_OUT - 1 - r.yBot < Y_MARGIN) bad.push(`黃雨鞋離下緣只有 ${H_OUT - 1 - r.yBot} 列（要 ≥ ${Y_MARGIN}）`);
}
for (const [k, e] of Object.entries(r.edges))
  if (e.spread < 6 && e.med > 200) bad.push(`${k} 那一邊是烘進去的白框（起伏 ${e.spread.toFixed(1)}、中位 ${e.med.toFixed(0)}）`);
if (bad.length) { console.error("✗ " + bad.join("\n✗ ")); process.exit(1); }

fs.writeFileSync(OUT, Buffer.from(r.jpeg.split(",")[1], "base64"));
console.log(`✓ ${OUT}  ${W_OUT}×${H_OUT}  ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
console.log(`  原檔 ${r.W}×${r.H}，裁 上 ${CUT_T} / 下 ${CUT_B}`);
console.log(`  黃雨衣 第 ${r.yTop}~${r.yBot} 列（離上緣 ${r.yTop}、離下緣 ${H_OUT - 1 - r.yBot}），${r.yPix} 個黃像素`);
console.log(`  四邊起伏 ` + Object.entries(r.edges).map(([k, e]) => `${k} ${e.spread.toFixed(0)}/${e.med.toFixed(0)}`).join("  "));
