/* 把出圖模型烘在上緣的白框「填成牆色」（不是外插）。
 *   node drafts/og-topfill.mjs <原檔> <輸出> --rows 118 [--color 235,234,228]
 *
 * ⚠⚠ 和 drafts/og-topclean.mjs 的分工（2026-08-24 矯正那張踩到）：
 *   ・og-topclean 是**逐欄往上外插**——只有「那一欄下面就是牆」才成立。
 *     矯正這張的中央幾欄下面是深藍螢幕，外插等於把螢幕的深藍拉到頂端，
 *     量出來「安靜區被佔 38%」。
 *   ・這一支是**整條填成同一個牆色**，適用於「上緣本來就是一條均勻的白框」。
 * ⚠ 填色的接縫要落在帶子底下才看不見：帶子高 = 成品高的 17%，
 *   換算回原圖 = 原圖高 × 0.17 ÷ (成品高 ÷ 原圖高)。填的列數不要超過它。
 */
import fs from "node:fs";
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const args = process.argv.slice(2);
const [src, out] = args.filter((a) => !a.startsWith("--") && !/^\d/.test(a) === true || (!a.startsWith("--") && !a.includes(",")));
const num = (f, d) => { const i = args.indexOf(f); return i >= 0 ? Number(args[i + 1]) : d; };
const colIdx = args.indexOf("--color");
const COLOR = colIdx >= 0 ? args[colIdx + 1].split(",").map(Number) : [235, 234, 228];
const ROWS = num("--rows", 0);
if (!src || !out || !ROWS) { console.error("用法：node drafts/og-topfill.mjs <原檔> <輸出> --rows N [--color r,g,b]"); process.exit(1); }
const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const uri = `data:image/jpeg;base64,${fs.readFileSync(src).toString("base64")}`;
const dataUrl = await pg.evaluate(async ({ uri, ROWS, COLOR }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0);
  g.fillStyle = `rgb(${COLOR[0]},${COLOR[1]},${COLOR[2]})`;
  g.fillRect(0, 0, W, ROWS);
  return c.toDataURL("image/jpeg", 0.95);
}, { uri, ROWS, COLOR });
await browser.close();
fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(`✓ ${out}　頂 ${ROWS} 列填成 rgb(${COLOR.join(",")})`);
