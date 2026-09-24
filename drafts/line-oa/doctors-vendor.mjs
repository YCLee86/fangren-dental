/* LINE「醫師介紹」→ 給廠商的提案頁 preview/line-doctors-vendor/（2026-09-24）
 *
 * 使用者：「把這個舊版現況和新版做成給廠商的提案頁 規格 圖片 都放上去讓廠商 download。
 *   不要寫太多解釋、解讀文字，描述簡短賅要」
 *
 * ⚠ 頁面、規格表、下載檔全部從 doctors-message.json 與 preview/line-doctors/ 的截圖產生，
 *   不手寫第二份。醫師或照片一換，照順序重跑：
 *     node drafts/line-oa/doctors-carousel.mjs
 *     node drafts/line-oa/doctors-shots.mjs
 *     node drafts/line-oa/doctors-vendor.mjs
 * ⚠ zip 是自己寫的（store 不壓縮，零依賴），檔名一律 ASCII —— 中文檔名在部分解壓工具會變亂碼。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SRC = path.join(ROOT, "preview/line-doctors");
const OUT = path.join(ROOT, "preview/line-doctors-vendor");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "photos"), { recursive: true });
fs.mkdirSync(path.join(OUT, "preview"), { recursive: true });

const msgText = fs.readFileSync(path.join(HERE, "doctors-message.json"), "utf8");
const msg = JSON.parse(msgText);
const bubbles = msg.contents.contents;
const sizes = [...new Set(bubbles.map((b) => b.size))];
if (sizes.length !== 1 || sizes[0] !== "kilo") throw new Error(`bubble 尺寸應全為 kilo（9/24 定案），現在是 ${sizes}`);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* 從每一張 bubble 讀回：姓名、標籤、標籤色、照片網址 */
const find = (n, pred, acc = []) => {
  if (pred(n)) acc.push(n);
  for (const c of n.contents || []) find(c, pred, acc);
  return acc;
};
const docs = bubbles.map((b, i) => {
  const texts = find(b.body, (n) => n.type === "text");
  const img = find(b.body, (n) => n.type === "image")[0];
  const pill = find(b.body, (n) => n.type === "box" && n.backgroundColor && n.backgroundColor !== b.body.backgroundColor)[0];
  const name = texts.find((t) => t.weight === "bold").text;
  const role = pill.contents[0].text;
  let photo = null;
  if (img) {
    const rel = new URL(img.url).pathname.replace(/^\//, "");
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) throw new Error(`${name} 的照片不存在：${rel}`);
    photo = `photos/${String(i + 1).padStart(2, "0")}-${path.basename(rel)}`;
    fs.copyFileSync(file, path.join(OUT, photo));
  }
  const shot = `preview/doc-${i + 1}.png`;
  fs.copyFileSync(path.join(SRC, `doc-${i + 1}.png`), path.join(OUT, shot));
  return { n: i + 1, name, role, color: pill.backgroundColor, photo, url: img?.url ?? null, shot };
});
for (const f of ["now-1.png", "now-2.png"]) fs.copyFileSync(path.join(SRC, f), path.join(OUT, "preview", f));
fs.writeFileSync(path.join(OUT, "doctors-message.json"), msgText);

/* 卡片實際寬高從截圖的 PNG 檔頭讀（DPR 3） */
const png = fs.readFileSync(path.join(OUT, docs[0].shot));
const cardW = png.readUInt32BE(16) / 3, cardH = png.readUInt32BE(20) / 3;

/* ── zip（store） ── */
function zip(entries) {
  const locals = [], centrals = [];
  let off = 0;
  for (const [name, data] of entries) {
    const nb = Buffer.from(name), crc = zlib.crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6); lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x5921, 12); // 2024-09-01，固定值：重跑內容沒變 zip 就逐位元組相同
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(nb.length, 26); lh.writeUInt16LE(0, 28);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(0, 10); ch.writeUInt16LE(0, 12); ch.writeUInt16LE(0x5921, 14);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(nb.length, 28); ch.writeUInt32LE(off, 42);
    locals.push(lh, nb, data); centrals.push(ch, nb);
    off += 30 + nb.length + data.length;
  }
  const cd = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, end]);
}
const ZIP = "fangren-line-doctors.zip";
const files = ["doctors-message.json",
  ...docs.filter((d) => d.photo).map((d) => d.photo),
  ...docs.map((d) => d.shot), "preview/now-1.png", "preview/now-2.png"];
fs.writeFileSync(path.join(OUT, ZIP), zip(files.map((f) => [`fangren-line-doctors/${f}`, fs.readFileSync(path.join(OUT, f))])));
const kb = (f) => Math.round(fs.statSync(path.join(OUT, f)).size / 1024);
const jsonKb = (Buffer.byteLength(JSON.stringify(msg.contents)) / 1024).toFixed(1);

/* ── 頁面 ── */
const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 醫師介紹　改版規格</title>
<!-- 由 drafts/line-oa/doctors-vendor.mjs 產生，不要手改。 -->
<style>
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;--brand:#3f654a}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.7 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;-webkit-text-size-adjust:100%}
.wrap{max-width:760px;margin:0 auto;padding:26px 16px 72px}
h1{font-size:1.3rem;line-height:1.5;margin:0 0 .2em}
.lede{color:var(--soft);font-size:.9rem;margin:0}
h2{font-size:1.04rem;margin:2em 0 .6em;padding-top:1em;border-top:1px solid var(--rule)}
.vs{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}
.vs figure{margin:0}
.vs img{width:100%;height:auto;display:block;border-radius:10px}
/* 新版縮到和現況截圖同一比例尺：截圖寬 ＝ 手機 390px，卡片 ${cardW}px */
.vs .new img{width:${(cardW / 390 * 100).toFixed(1)}%}
td.nm{white-space:nowrap}
.vs figcaption,.cap{font-size:.8rem;color:var(--soft);margin-top:.35em}
.chat{background:#1c1c1e;border-radius:12px;padding:14px 0 10px}
.strip{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 16px 6px}
.strip img{flex:0 0 ${cardW}px;width:${cardW}px;height:auto;border-radius:12px;scroll-snap-align:center;display:block}
table{width:100%;border-collapse:collapse;background:var(--card);border-radius:10px;overflow:hidden;font-size:.86rem}
th,td{padding:.5em .65em;text-align:left;vertical-align:top;border-bottom:1px solid var(--rule)}
tr:last-child>*{border-bottom:0}
th{font-weight:500;color:var(--soft);white-space:nowrap}
code{font-size:.82rem}
.sw{display:inline-block;width:.9em;height:.9em;border-radius:3px;vertical-align:-.1em;margin-right:.3em}
.dl{display:block;background:var(--brand);color:#fff;text-decoration:none;text-align:center;
  font-weight:600;border-radius:9px;padding:.75em;margin:0 0 .8em}
ul.files{list-style:none;margin:0;padding:0;background:var(--card);border-radius:10px;font-size:.88rem}
ul.files li{padding:.5em .7em;border-bottom:1px solid var(--rule);display:flex;justify-content:space-between;gap:.6em}
ul.files li:last-child{border-bottom:0}
ul.files a{color:var(--brand);word-break:break-all}
ul.files span{color:var(--soft);white-space:nowrap}
</style>
</head>
<body>
<div class="wrap">
<h1>LINE「醫師介紹」改版規格</h1>
<p class="lede">圖文選單「醫師介紹」回覆的 Flex Carousel。大插畫改成醫師本人小頭像。</p>

<h2>1　現況 → 新版</h2>
<div class="vs">
  <figure><img src="preview/now-1.png" alt="現況"><figcaption>現況</figcaption></figure>
  <figure class="new"><img src="${docs[0].shot}" alt="新版"><figcaption>新版（kilo，同比例）</figcaption></figure>
</div>

<h2>2　新版九張</h2>
<div class="chat"><div class="strip">
${docs.map((d) => `  <img src="${d.shot}" alt="${esc(d.name)}">`).join("\n")}
</div></div>
<p class="cap">模擬圖，依 JSON 繪製。左右滑。</p>

<h2>3　規格</h2>
<table>
<tr><th>觸發</th><td>圖文選單「醫師介紹」</td></tr>
<tr><th>訊息</th><td>Flex Message・carousel・bubble ${bubbles.length} 張</td></tr>
<tr><th>bubble</th><td><code>size: "kilo"</code>（實機測試定案）</td></tr>
<tr><th>altText</th><td>${esc(msg.altText)}</td></tr>
<tr><th>頭像</th><td>76×76px 圓形（box <code>cornerRadius: 38px</code>）・JPEG 400×400</td></tr>
<tr><th>字級</th><td>姓名 <code>lg</code> 粗・標籤 <code>xs</code>・欄位名 <code>xs</code>・內文 <code>sm</code></td></tr>
<tr><th>顏色</th><td>底 <code>#F4F4F5</code>・字 <code>#2A2C27</code>・欄位名 <code>#5C5F57</code>・分隔線 <code>#CDD0D2</code>・標籤底＝科別色、白字</td></tr>
<tr><th>JSON</th><td>${jsonKb} KB（上限 50 KB）・可直接送出</td></tr>
<tr><th>照片網址</th><td>已寫在 JSON 內（fangren.net），保留 <code>?v=</code></td></tr>
</table>

<h2>4　九位醫師</h2>
<table>
<tr><th>#</th><th>醫師</th><th>標籤</th><th>照片</th></tr>
${docs.map((d) => `<tr><td>${d.n}</td><td class="nm">${esc(d.name)}</td><td><span class="sw" style="background:${d.color}"></span>${esc(d.role)}<br><code>${d.color}</code></td><td>${d.photo ? `<a href="${d.photo}" download>${path.basename(d.photo)}</a>` : "無（純文字）"}</td></tr>`).join("\n")}
</table>

<h2>5　下載</h2>
<a class="dl" href="${ZIP}" download>全部下載（zip，${kb(ZIP)} KB）</a>
<ul class="files">
<li><a href="doctors-message.json" download>doctors-message.json</a><span>Flex Message・${kb("doctors-message.json")} KB</span></li>
${docs.filter((d) => d.photo).map((d) => `<li><a href="${d.photo}" download>${d.photo}</a><span>${esc(d.name)}・${kb(d.photo)} KB</span></li>`).join("\n")}
${docs.map((d) => `<li><a href="${d.shot}" download>${d.shot}</a><span>新版 ${d.n}・${kb(d.shot)} KB</span></li>`).join("\n")}
<li><a href="preview/now-1.png" download>preview/now-1.png</a><span>現況・${kb("preview/now-1.png")} KB</span></li>
<li><a href="preview/now-2.png" download>preview/now-2.png</a><span>現況・${kb("preview/now-2.png")} KB</span></li>
</ul>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log(`preview/line-doctors-vendor/　${files.length} 檔 ＋ ${ZIP}（${kb(ZIP)} KB）　卡片 ${cardW}×${cardH}`);
