/* 綁定完成圖卡的頭圖：Gemini 出的 16:9 原檔 → 1040×520（2:1）
 *   node drafts/bind-done-hero-crop.mjs
 *   drafts/bind-done-v4-src.jpg  →  preview/line-bind-done/hero-bind.jpg
 *
 * ⚠ 為什麼要裁：LINE Flex 的 hero 這一站統一用 2:1（同招呼圖卡），而 Gemini 只出 16:9。
 * ⚠⚠ 上下對稱各裁 40 列（5.2%），不是隨便挑的 —— 掃過原檔的墨才定的：
 *     深墨（線）從第 55 列才開始（那是那一團人最高的一顆頭，x≈1075），
 *     所以上面裁 40 還留 15 列餘裕；被裁掉的只有背後那片淡薄荷圓的頂端。
 *     底下第 728 列以下只剩診療椅底座那兩條細線（x≈295~424）與地板線之外的空白，
 *     **地板線在第 715 列左右，裁 40 不會碰到它**。
 * ⚠⚠ 出 **1024×512** 不是招呼圖卡那張的 1040×520：LINE 對 Flex 的 `image` 元件
 *     明文寫著「最大 1024×1024 px」，1040 已經超過。兩張看起來完全一樣（差 1.5%），
 *     但這一張是在規格內的。**招呼圖卡那張 1040×520 要回去重切**（見 channels/README 第十九節）。
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 * ⚠ 出圖後有三道守門：長寬比、四邊有沒有烘進白框、墨有沒有被裁到。
 */
import fs from "node:fs";
const SRC = "drafts/bind-done-v4-src.jpg";
const OUT = "preview/line-bind-done/hero-bind.jpg";
const CUT_T = 40, CUT_B = 40, W_OUT = 1024, H_OUT = 512;

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const r = await pg.evaluate(async ({ uri, CUT_T, CUT_B, W_OUT, H_OUT }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const sy = CUT_T, sh = H - CUT_T - CUT_B;
  const c = document.createElement("canvas"); c.width = W_OUT; c.height = H_OUT;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, sy, W, sh, 0, 0, W_OUT, H_OUT);
  /* 守門用的量測就在同一張 canvas 上做 */
  const d = g.getImageData(0, 0, W_OUT, H_OUT).data;
  const dark = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2] < 170;
  let firstDark = -1, lastDark = -1;
  for (let y = 0; y < H_OUT; y++) {
    let n = 0;
    for (let x = 0; x < W_OUT; x++) if (dark((y * W_OUT + x) * 4)) n++;
    if (n > 0) { if (firstDark < 0) firstDark = y; lastDark = y; }
  }
  /* 四邊各一列的中位亮度 —— 烘進白框的話邊會比紙底亮很多 */
  const rowMed = (y) => {
    const a = [];
    for (let x = 0; x < W_OUT; x++) { const i = (y * W_OUT + x) * 4; a.push(0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]); }
    a.sort((p, q) => p - q); return a[a.length >> 1];
  };
  /* 紙底 ＝ 整張最常見的那個顏色（不是拿中線比 —— 中線穿過人物，一定比較暗） */
  const cnt = {};
  for (let i = 0; i < d.length; i += 4) {
    const k = (d[i] >> 3) + "," + (d[i + 1] >> 3) + "," + (d[i + 2] >> 3);
    cnt[k] = (cnt[k] || 0) + 1;
  }
  const bg = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0].split(",").map((v) => (+v << 3) + 4);
  const bgL = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
  return { W, H, sh, firstDark, lastDark, top: rowMed(0), bot: rowMed(H_OUT - 1), bgL,
    b64: c.toDataURL("image/jpeg", 0.9).split(",")[1] };
}, { uri, CUT_T, CUT_B, W_OUT, H_OUT });
await browser.close();

if (r.H - CUT_T - CUT_B !== Math.round((r.W * H_OUT) / W_OUT))
  throw new Error(`裁完的長寬比對不上 ${W_OUT}:${H_OUT} —— 裁 ${CUT_T}/${CUT_B} 得到 ${r.W}×${r.sh}`);
if (r.firstDark < 4) throw new Error(`上緣裁到墨了（第 ${r.firstDark} 列就有線）`);
for (const [nm, v] of [["上", r.top], ["下", r.bot]])
  if (Math.abs(v - r.bgL) > 8)
    throw new Error(`${nm}緣像是烘進去的白框（那一列中位亮度 ${v.toFixed(1)}，紙底是 ${r.bgL.toFixed(1)}）`);

fs.writeFileSync(OUT, Buffer.from(r.b64, "base64"));
console.log(`${OUT}  ${W_OUT}×${H_OUT}  ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
console.log(`原檔 ${r.W}×${r.H} → 裁上下各 ${CUT_T}/${CUT_B} → ${r.W}×${r.sh}（＝2:1）`);
console.log(`墨的上下界 ${r.firstDark}~${r.lastDark}／${H_OUT}　邊緣亮度 上 ${r.top.toFixed(1)}・下 ${r.bot.toFixed(1)}（紙底 ${r.bgL.toFixed(1)}）`);
