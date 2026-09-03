/* 提案頁的圖檔守門 —— 每次重跑 generate.mjs 之後跑一次。
 *   node drafts/line-hello/check.mjs
 *
 * ⚠⚠ 這支存在的理由（2026-09-03 踩過兩次）：
 *   出圖的檔名一改（形狀 × 字體 → 缺口 × 字體），舊的 hero-*.jpg 就被覆蓋或刪掉，
 *   而**引用它的地方不會報錯，只會顯示一個破圖** —— preview/line-reply/ 指著
 *   ../line-hello/hero-round-mplus.jpg 就這樣壞了兩輪沒人發現。
 *   兩個方向都要驗：① 引用得到的檔案在不在 ② 產出的檔案有沒有人引用。
 */
import fs from "node:fs";
import path from "node:path";

const PAGES = ["preview/line-hello/index.html", "preview/line-reply/index.html",
               "preview/line-welcome/index.html"];
const DIR = "preview/line-hello";
/* 刻意留著、不必有人引用的：定案的裁切原圖（沒有字的那一張，是頭圖的底） */
const KEEP = new Set(["crop-c3b.jpg"]);

const refs = new Set();
const bad = [];

for (const pg of PAGES) {
  const html = fs.readFileSync(pg, "utf8");
  const dir = path.dirname(pg);
  const add = (rel, where) => {
    const f = path.normalize(path.join(dir, rel));
    refs.add(f);
    if (!fs.existsSync(f)) bad.push(`${pg} → ${where} 指到 ${rel}，檔案不存在`);
  };
  for (const m of html.matchAll(/src=["']([^"']+\.(?:jpg|png|webp))["']/g)) add(m[1], "src");
  /* 圖是 JS 用 r.id + ".jpg" 組出來的，正規式抓不到，要從資料本身還原。
     ⚠ 兩種形狀都要認：提案期間是一整排（var R = [...]），定案之後收成一筆
       （var r = {...}）。只認前者的話，定案那一版會把成品當成孤兒檔報出來。 */
  const many = html.match(/var R = (\[.*?\]);\n/s);
  if (many) for (const r of JSON.parse(many[1])) add(r.id + ".jpg", "切換條資料");
  const one = html.match(/var r = (\{.*?\});\n/s);
  if (one) add(JSON.parse(one[1]).id + ".jpg", "定案的那一筆");
}

const orphan = fs.readdirSync(DIR)
  .filter((f) => /\.(jpg|png|webp)$/.test(f) && !KEEP.has(f))
  .map((f) => path.normalize(path.join(DIR, f)))
  .filter((f) => !refs.has(f));

if (bad.length) { console.error("❌ " + bad.join("\n❌ ")); process.exit(1); }
if (orphan.length) { console.error("❌ 沒有人引用的產出檔（改檔名之後忘了刪？）：\n   " + orphan.join("\n   ")); process.exit(1); }
console.log(`✅ ${PAGES.length} 頁引用的 ${refs.size} 張圖全部存在，${DIR} 底下沒有孤兒檔`);
