/* 按鈕上那幾顆圖示的**向量原檔** → assets/line-src/*.svg
 *   node drafts/channels/icon-svg.mjs            寫檔
 *   node drafts/channels/icon-svg.mjs --check    只比對，不寫檔
 *
 * ⚠⚠ 廠商 2026-09-07：「按鈕中的診所 icon 也麻煩提供原圖檔」——
 *   我們給過去的一直是**烘好顏色的 PNG**（`assets/line/mark-*.png`、
 *   `assets/line-{pin,phone,logo}.png`），那是「成品」不是「原檔」：
 *   換顏色、換尺寸都得回來找我們。這一支出的是同一組幾何的 SVG，
 *   `fill="currentColor"`，設計師拿去自己上色、自己縮。
 *
 * ⚠⚠ **幾何一律從既有的來源讀回來，這裡不抄第二份**（同 logo-png.mjs／mark-png.mjs）：
 *     mark        ← brand/shapes/mark.svg        站上頁首那一條（長寬比 2.029）
 *     shape-r2c3  ← brand/shapes/shape-r2c3.svg  細長那一顆（長寬比 3.081）
 *     pin / phone ← index.html 頁尾那兩個 <svg>（Font Awesome 實心釘與話筒）
 *   ⚠ `mark` 與 `shape-r2c3` 那兩份**整份原樣複製**，不要只抄 `<path d>` 重組 ——
 *     外層那個 `transform`（含 `scale(1 -1)`）掉了，畫出來會上下顛倒
 *     （CLAUDE.md 第四節那條「量描邊版不可以只抄 path d」的近親）。
 *
 * ⚠ 牙洞是靠 `fill-rule: evenodd` 挖穿的 —— 轉檔或重畫時弄丟那一條，
 *   洞會被填實而且**不會報錯**（2026-09-03 踩過）。守門在數「被墨包住的透明像素」。
 * ⚠ `assets/` 在 `tools/dist.mjs` 的 ALWAYS 裡，放進去就會上線。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEST = path.join(ROOT, "assets", "line-src");
const CHECK = process.argv.includes("--check");
const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const home = strip(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));

/* ---- 從 index.html 抓一個 <svg> 的所有 <path d> ------------------------- */
function grab(viewBox, label) {
  const re = new RegExp(`<svg[^>]*viewBox="${viewBox.replace(/[.\s]/g, (c) => c === "." ? "\\." : "\\s")}"[^>]*>[\\s\\S]*?<\\/svg>`);
  const m = home.match(re);
  if (!m) throw new Error(`index.html 裡找不到 viewBox="${viewBox}" 的 <svg>（${label}）`);
  const ds = [...m[0].matchAll(/\sd="([^"]+)"/g)].map((x) => x[1]);
  if (!ds.length) throw new Error(`viewBox="${viewBox}" 的 <svg> 裡沒有 <path d=…>（${label}）`);
  return ds;
}

const hdr = (vb, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}">`;

const JOBS = [];

/* ① ② 品牌標誌那兩顆：整份原樣複製（外層 transform 一定要跟著走）------------ */
for (const [name, note] of [
  ["mark", "芳仁牙醫診所・標誌（站上頁首那一條）"],
  ["shape-r2c3", "芳仁牙醫診所・標誌（細長那一顆）"],
]) {
  const src = path.join(ROOT, "brand", "shapes", name + ".svg");
  let svg = fs.readFileSync(src, "utf8");
  if (!/fill-rule="evenodd"|fill-rule:\s*evenodd/.test(svg))
    throw new Error(`${name}.svg 裡沒有 fill-rule evenodd —— 牙洞會被填實`);
  /* currentColor 才好讓設計師自己上色；原檔本來就是 currentColor，這裡只做確認 */
  if (!/currentColor/.test(svg)) svg = svg.replace(/fill="[^"]*"/, 'fill="currentColor"');
  JOBS.push({ out: name + ".svg", svg, from: `brand/shapes/${name}.svg`, note });
}

/* ③ ④ 頁尾那兩顆圖示 ----------------------------------------------------- */
for (const [vb, out, label, note] of [
  ["0 0 384 512", "pin.svg", "地圖圖釘", "診所資訊卡「Google 地圖」那顆按鈕"],
  ["0 0 512 512", "phone.svg", "話筒", "診所資訊卡「打給診所」＋提醒卡「致電診所」"],
]) {
  const ds = grab(vb, label);
  JOBS.push({
    out,
    svg: hdr(vb, label) + "\n" + ds.map((d) => `  <path fill="currentColor" d="${d}"/>`).join("\n") + "\n</svg>\n",
    from: `index.html（viewBox="${vb}"）`, note,
  });
}

/* ---- 守門：畫出來要對（尤其牙洞有沒有挖穿）----------------------------- */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(shell) ? shell : undefined });
const pg = await browser.newPage();

const bad = [], rows = [];
for (const j of JOBS) {
  const r = await pg.evaluate(async (svg) => {
    const uri = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    const img = new Image(); img.src = uri; await img.decode();
    const W = 400, H = Math.max(1, Math.round(400 * img.naturalHeight / img.naturalWidth));
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = "#000"; g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    let ink = 0, holes = 0;
    const on = (x, y) => d[(y * W + x) * 4 + 3] > 128;
    for (let y = 0; y < H; y++) {
      let seen = false, run = 0;
      for (let x = 0; x < W; x++) {
        if (on(x, y)) { ink++; if (run && seen) holes += run; run = 0; seen = true; }
        else if (seen) run++;
      }
    }
    return { W, H, ink: ink / (W * H), holes };
  }, j.svg);
  if (r.ink < 0.05) bad.push(`${j.out}：畫出來幾乎是空的（墨 ${(r.ink * 100).toFixed(1)}%）`);
  /* ⚠ 長寬比要從 viewBox 自己算 —— `img.naturalWidth` 對 SVG 會**進位到整數**
     （mark 的 44.304×21.834 回來是 44×22 ＝ 2.000，真值是 2.029）。 */
  const vb = (j.svg.match(/viewBox="([\d.\s-]+)"/) || [])[1].trim().split(/\s+/).map(Number);
  rows.push({ ...j, ...r, ratio: vb[2] / vb[3] });
}
await browser.close();

/* 只有標誌那兩顆有牙洞 */
for (const r of rows.filter((x) => /^(mark|shape-)/.test(x.out)))
  if (r.holes < 30) bad.push(`${r.out}：數不到牙洞（被墨包住的透明像素只有 ${r.holes}）—— fill-rule 掉了`);
if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

if (!CHECK) fs.mkdirSync(DEST, { recursive: true });
for (const r of rows) {
  const p = path.join(DEST, r.out);
  const same = fs.existsSync(p) && fs.readFileSync(p, "utf8") === r.svg;
  if (!CHECK && !same) fs.writeFileSync(p, r.svg);
  console.log(`  ${r.out.padEnd(16)}長寬比 ${r.ratio.toFixed(3).padEnd(8)}墨 ${(r.ink * 100).toFixed(1).padStart(5)}%`
    + `${/^(mark|shape-)/.test(r.out) ? "　牙洞 " + r.holes : "        "}　← ${r.from}`);
}
console.log(CHECK ? "（--check：一個檔都沒有寫）" : `✓ ${rows.length} 個向量原檔已寫進 assets/line-src/`);
