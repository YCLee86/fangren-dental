/* 交付頁的守門 —— node drafts/channels/check-handover.mjs
 *
 * ⚠⚠ 這一頁是**產生出來的**（`build-handover.mjs` 從各則的 JSON 抽字），
 *   所以最強的一道守門就是「重跑一次，看產出的東西一不一樣」——
 *   不一樣就代表有人手改了那一頁，或是改了 JSON 卻忘了重跑。
 *   （逐句比對文字那種寫法在這裡是多餘的：字本來就只有一份出處。）
 *
 * 其餘四道：
 *   ② 頁上列的每一個 fangren.net 圖檔，repo 裡都要真的有那個檔
 *   ③ 每一條指到 preview 底下其他規格頁的連結，都要有對應的資料夾
 *     ⚠ 這一行本來寫成 `../line-` 加星號加斜線 —— 那兩個字元連在一起會把這整段註解
 *       提早關掉，底下全部變成程式碼（CLAUDE.md 第九節第 8 條，不報錯的那一種）
 *   ④ 紅線（這個帳號沒有專人即時回覆，不可以出現「隨時問」那一類的承諾）
 *   ⑤ 不准出現 <script>（交給廠商的東西沒有理由要跑腳本）
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-handover", "index.html");
const bad = [];

if (!fs.existsSync(PAGE)) { console.error("× 還沒有 preview/line-handover/index.html"); process.exit(1); }
const before = fs.readFileSync(PAGE, "utf8");

/* ---- ① 重跑一次，比對 -------------------------------------------------- */
execFileSync(process.execPath, [path.join(HERE, "build-handover.mjs")], { cwd: ROOT, stdio: "ignore" });
const after = fs.readFileSync(PAGE, "utf8");
if (before !== after)
  bad.push("這一頁和「從 JSON 重新產生」的結果不一樣 —— 有人手改了它，"
    + "或是改了某一則的 JSON 卻沒有重跑 build-handover.mjs（已經幫你重新產生了一份）");

/* ---- ② 圖檔真的在 ------------------------------------------------------ */
const urls = [...new Set([...after.matchAll(/href="(https:\/\/fangren\.net\/assets\/[^"]+)"/g)].map((m) => m[1]))];
for (const u of urls) {
  const p = path.join(ROOT, u.replace("https://fangren.net/", ""));
  if (!fs.existsSync(p)) bad.push(`頁上連著 ${u}，但 repo 裡沒有那個檔`);
}
if (urls.length < 20) bad.push(`只列到 ${urls.length} 個圖檔，太少了 —— 抽取大概壞了`);

/* ---- ③ 內部連結 -------------------------------------------------------- */
for (const m of after.matchAll(/href="\.\.\/([a-z0-9-]+)\//g))
  if (!fs.existsSync(path.join(ROOT, "preview", m[1], "index.html")))
    bad.push(`連到 ../${m[1]}/ 但那一頁不存在`);

/* ---- ④ 紅線 ------------------------------------------------------------ */
/* ⚠ 掃到「還需要答案的事」為止 —— 這條線每一份檔案都把說明寫在資料裡面，
   掃字一定會撞到自己的說明（check-spec 那一輪的教訓）。 */
const body = after.slice(0, after.indexOf('id="ask"') + 1 || after.length);
for (const w of ["隨時問", "隨時詢問", "即時回覆您", "馬上回覆", "都會回覆", "有問題都可以問"])
  if (body.includes(w)) bad.push(`出現「${w}」—— 這個帳號沒有專人即時回覆`);

/* ---- ⑤ 零 JS ----------------------------------------------------------- */
if (/<script/i.test(after)) bad.push("出現 <script> —— 這一頁刻意零 JS");

/* ---- ⑥ 衛教那二十張圖要真的上線 ---------------------------------------- */
try {
  execFileSync(process.execPath, [path.join(HERE, "publish-handouts.mjs"), "--check"],
    { cwd: ROOT, stdio: "pipe" });
} catch (e) {
  bad.push("publish-handouts.mjs --check 沒過：\n    " + String(e.stdout || e.message).trim().replace(/\n/g, "\n    "));
}

if (bad.length) { console.error("× " + bad.join("\n× ")); process.exit(1); }
console.log(`✓ preview/line-handover/　和 JSON 重新產生的結果逐位相同、圖檔 ${urls.length} 個都在、`
  + `內部連結都通、紅線 0、零 JS、衛教二十張都上線了`);
