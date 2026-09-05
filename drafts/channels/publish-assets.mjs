/* 把 Flex JSON 引用到的圖，從各自的 preview/ 資料夾複製到 assets/line/
 *   node drafts/channels/publish-assets.mjs            檢查 ＋ 複製
 *   node drafts/channels/publish-assets.mjs --check    只檢查、不寫檔
 *
 * ⚠⚠ **清單的唯一出處是那七份 JSON 自己**（`"url": "https://fangren.net/assets/line/…"`）——
 *   不要在這裡再手寫一份，那會變成第二個真相，而它一定會過期。
 *   `booked-card.json` 裡那個 `wm-{{watermark}}-12.png` 是**樣板不是檔名**（廠商填的），
 *   所以跳過它 —— 九顆具體的檔名同一份 JSON 的對照表裡本來就列著。
 *
 * ⚠ `assets/` 在 `tools/dist.mjs` 的 ALWAYS 裡（整個資料夾遞迴複製），
 *   所以放進 `assets/line/` 就會跟著上線，不必改 dist.mjs。
 * ⚠⚠ 圖必須**線上打得開**，廠商才驗得了那幾份 JSON ——
 *   放在 `preview/` 底下雖然也上線，但網址和 JSON 寫的不一樣。
 *
 * 三道守門：① JSON 引用的每一個檔都要找得到　② 尺寸不可以超過 LINE 的 1024×1024
 *          ③ `assets/line/` 裡不可以有沒有人引用的孤兒檔
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DEST = path.join(ROOT, "assets", "line");
const CHECK = process.argv.includes("--check");
const BASE = "https://fangren.net/assets/line/";

/* 每一個檔案實際住在哪（各自那一則的 preview 資料夾） */
const HOMES = ["line-welcome", "line-remind", "line-booked", "line-bind-done",
  "line-review", "line-typhoon", "line-cancel"].map((d) => path.join(ROOT, "preview", d));

const png = (b) => [b.readUInt32BE(16), b.readUInt32BE(20)];
const jpeg = (b) => {                      /* 掃 SOF 標記，不能照抄 PNG 的讀法 */
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

/* ---- ① 從七份 JSON 收出被引用的檔名 ---------------------------------- */
const want = new Map();                    /* 檔名 → 哪幾份 JSON 在用 */
for (const f of fs.readdirSync(HERE).filter((n) => n.endsWith(".json"))) {
  const txt = fs.readFileSync(path.join(HERE, f), "utf8");
  for (const m of txt.matchAll(/"url":\s*"([^"]+)"/g)) {
    const url = m[1];
    if (!url.startsWith(BASE)) continue;
    const name = url.slice(BASE.length);
    if (name.includes("{{")) continue;     /* 樣板，不是檔名 */
    if (!want.has(name)) want.set(name, []);
    if (!want.get(name).includes(f)) want.get(name).push(f);
  }
}

const bad = [], rows = [];
for (const [name, users] of [...want].sort()) {
  const home = HOMES.find((d) => fs.existsSync(path.join(d, name)));
  if (!home) { bad.push(`找不到 ${name}（${users.join("／")} 引用著）`); continue; }
  const src = path.join(home, name);
  const b = fs.readFileSync(src);
  const size = name.endsWith(".png") ? png(b) : jpeg(b);
  if (!size) { bad.push(`${name} 讀不出尺寸`); continue; }
  if (size[0] > 1024 || size[1] > 1024)
    bad.push(`${name} ${size.join("×")} —— 超過 LINE 的 1024×1024`);
  rows.push({ name, src: path.relative(ROOT, src), size, kb: b.length / 1024, users });
}

/* ---- ③ 孤兒檔 --------------------------------------------------------- */
if (fs.existsSync(DEST))
  for (const n of fs.readdirSync(DEST))
    if (!want.has(n)) bad.push(`assets/line/${n} 沒有任何一份 JSON 引用 —— 孤兒檔`);

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }

if (!CHECK) {
  fs.mkdirSync(DEST, { recursive: true });
  for (const r of rows) fs.copyFileSync(path.join(ROOT, r.src), path.join(DEST, r.name));
}

let total = 0;
for (const r of rows) {
  total += r.kb;
  console.log(`${r.name.padEnd(24)} ${r.size.join("×").padEnd(10)} ${r.kb.toFixed(0).padStart(4)}KB  `
    + `← ${r.src}`);
}
console.log(`\n${rows.length} 個檔、共 ${(total / 1024).toFixed(2)}MB`
  + `　→ ${CHECK ? "（--check，沒有寫檔）" : "assets/line/"}`);
