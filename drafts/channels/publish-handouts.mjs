/* 衛教懶人包的二十張圖 → assets/handout-*.jpg（＝ health-carousel-d.json 寫的那些網址）
 *   node drafts/channels/publish-handouts.mjs            算 ＋ 寫檔（含改 JSON 的 aspectRatio）
 *   node drafts/channels/publish-handouts.mjs --check    只驗，不寫任何檔
 *
 * ⚠⚠ **清單的唯一出處是 `health-carousel-d.json` 自己**（同 publish-assets.mjs）——
 *   不要在這裡再手寫一份十張的名單。
 *
 * 這一支補掉 2026-09-07 查出來的三件（三件都不報錯，只有拿數字量才看得到）：
 *
 *   ① **十張頭圖全部超過 LINE 的 1024**（1124／1200／1060／1058／1056 寬）——
 *      Flex 的 image 上限是 1024×1024（CLAUDE.md 第十一之二節），送上去會出事。
 *      → 等比例縮到 1024 寬，並把**實際的 W×H 寫回 JSON 的 aspectRatio**
 *        （不要留著舊的 1124:588 —— 那會變成第二個真相）。
 *   ② **三張「看大圖」的副檔名對不上**：JSON 寫 `handout-{calculus,denture,implant}.jpg`，
 *      而實檔是 `.png`。→ 轉成 JPEG，網址不動（要求廠商改字串是最貴的一條路）。
 *   ③ **`handout-aligner.jpg` 是 5538×8000、2.6MB** —— 那是印刷級的原稿，
 *      而它只是一個「在瀏覽器裡打開」的連結；行動網路上這一張就佔全部的三分之一。
 *      → 只有超過 2000 寬的才縮，縮到 1600（仍然比同組那九張的 1125 大）。
 *
 * ⚠ 「看大圖」是 uri action、在瀏覽器裡開，**沒有 1024 的限制**，所以只有頭圖要縮。
 * ⚠ `assets/` 在 `tools/dist.mjs` 的 ALWAYS 裡，放進去就會跟著上線，不必改 dist.mjs。
 * ⚠ 產圖一律用 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRCDIR = path.join(ROOT, "drafts", "line-oa", "handouts");
const DEST = path.join(ROOT, "assets");
const JSONF = path.join(ROOT, "drafts", "line-oa", "health-carousel-d.json");
const CHECK = process.argv.includes("--check");

const HERO_MAX = 1024;   /* LINE Flex 的 image 上限 */
const BIG_MAX = 2000;    /* 「看大圖」超過這個寬度才縮 */
const BIG_TO = 1600;

const png = (b) => [b.readUInt32BE(16), b.readUInt32BE(20)];
const jpeg = (b) => {
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};
const dims = (f) => { const b = fs.readFileSync(f); return f.endsWith(".png") ? png(b) : jpeg(b); };

/* ---- ① 名單從 JSON 收 ------------------------------------------------- */
let doc = fs.readFileSync(JSONF, "utf8");
const names = [...new Set([...doc.matchAll(/https:\/\/fangren\.net\/assets\/(handout-[^"]+)"/g)]
  .map((m) => m[1]))].sort();
if (!names.length) { console.error("× health-carousel-d.json 裡一個 handout-* 都沒有"); process.exit(1); }

/* ---- ② 每一個都要在 handouts/ 找得到（副檔名可以不同）------------------- */
const jobs = [], bad = [];
for (const name of names) {
  const stem = name.replace(/\.(jpg|png)$/, "");
  const hit = ["jpg", "png"].map((e) => path.join(SRCDIR, stem + "." + e)).find(fs.existsSync);
  if (!hit) { bad.push(`handouts/ 底下找不到 ${stem}.jpg 也沒有 .png（JSON 引用著 ${name}）`); continue; }
  const src = dims(hit);
  if (!src) { bad.push(`${path.basename(hit)} 讀不出尺寸`); continue; }
  const hero = /-hero\.(jpg|png)$/.test(name);
  const cap = hero ? HERO_MAX : (src[0] > BIG_MAX ? BIG_TO : src[0]);
  const W = Math.min(src[0], cap), H = Math.round(src[1] * W / src[0]);
  jobs.push({ name, hit, src, W, H, hero, convert: path.extname(hit) !== path.extname(name) });
}
if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

/* ---- ③ 出圖（一次 Chromium，逐張畫進 canvas 再吐 JPEG）------------------ */
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browser = await chromium.launch({ executablePath: fs.existsSync(shell) ? shell : undefined });
const pg = await browser.newPage();

const rows = [];
for (const j of jobs) {
  const b = fs.readFileSync(j.hit);
  const mime = j.hit.endsWith(".png") ? "image/png" : "image/jpeg";
  const uri = `data:${mime};base64,${b.toString("base64")}`;
  const r = await pg.evaluate(async ({ uri, W, H }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, W, H);
    /* 守門的地標：縮完之後不可以是一片空白（畫失敗、或來源本身是空的）。
       這幾張是資訊圖，底是白的、字是深的 —— 取「和白底差 30 階以上」的比例。 */
    const d = g.getImageData(0, 0, W, H).data;
    let ink = 0;
    for (let i = 0; i < d.length; i += 4)
      if (255 - d[i] > 30 || 255 - d[i + 1] > 30 || 255 - d[i + 2] > 30) ink++;
    return { ink: ink / (W * H), jpeg: c.toDataURL("image/jpeg", 0.9),
      nat: [img.naturalWidth, img.naturalHeight] };
  }, { uri, W: j.W, H: j.H });

  if (r.nat[0] !== j.src[0] || r.nat[1] !== j.src[1])
    bad.push(`${j.name}：檔頭讀到 ${j.src.join("×")}、瀏覽器解出 ${r.nat.join("×")}`);
  if (r.ink < 0.02) bad.push(`${j.name}：縮完幾乎是空白的（墨只有 ${(r.ink * 100).toFixed(1)}%）`);
  if (j.hero && (j.W > HERO_MAX || j.H > HERO_MAX))
    bad.push(`${j.name}：${j.W}×${j.H} 仍然超過 LINE 的 ${HERO_MAX}`);
  const buf = Buffer.from(r.jpeg.split(",")[1], "base64");
  rows.push({ ...j, kb: buf.length / 1024, srcKb: b.length / 1024, ink: r.ink, buf });
}
await browser.close();
if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

/* ---- ④ 頭圖的 aspectRatio 要等於成品的真實尺寸 -------------------------- */
let touched = 0;
for (const r of rows.filter((x) => x.hero)) {
  const re = new RegExp(`("url":\\s*"https://fangren\\.net/assets/${r.name.replace(/\./g, "\\.")}"[\\s\\S]{0,200}?"aspectRatio":\\s*")([^"]+)(")`);
  const m = doc.match(re);
  if (!m) { bad.push(`${r.name}：JSON 裡找不到它的 aspectRatio`); continue; }
  const want = `${r.W}:${r.H}`;
  if (m[2] !== want) { doc = doc.replace(re, `$1${want}$3`); touched++; }
}
if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

/* ---- ⑤ 寫檔 ------------------------------------------------------------ */
const w = (s, n) => String(s).padEnd(n);
console.log(`衛教懶人包　${rows.length} 個檔（${rows.filter((r) => r.hero).length} 張頭圖 ＋ ${rows.filter((r) => !r.hero).length} 張看大圖）`);
for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  const chg = r.src[0] !== r.W ? `${r.src.join("×")} → ${r.W}×${r.H}` : `${r.W}×${r.H}`;
  console.log("  " + w(r.name, 28) + w(chg, 22) + w(r.srcKb.toFixed(0) + " → " + r.kb.toFixed(0) + "KB", 18)
    + (r.convert ? " ⚠ 從 " + path.extname(r.hit).slice(1).toUpperCase() + " 轉過來" : ""));
  if (!CHECK) fs.writeFileSync(path.join(DEST, r.name), r.buf);
}
console.log(`合計 ${(rows.reduce((a, r) => a + r.kb, 0) / 1024).toFixed(2)}MB`
  + `（原檔 ${(rows.reduce((a, r) => a + r.srcKb, 0) / 1024).toFixed(2)}MB）`);
if (touched) {
  if (!CHECK) fs.writeFileSync(JSONF, doc);
  console.log(`${CHECK ? "⚠ 要改" : "✓ 已更新"} health-carousel-d.json 的 aspectRatio ${touched} 處`);
}
console.log(CHECK ? "（--check：一個檔都沒有寫）" : "✓ 已寫進 assets/");
