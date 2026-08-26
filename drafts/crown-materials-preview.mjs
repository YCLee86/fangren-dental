/* 〈假牙材質怎麼選〉的草稿預覽頁產生器。
   drafts/crown-materials/index.html → preview/crown-materials/index.html

   用途只有一個：讓使用者在手機上把整篇讀完。**不是設計提案**，
   所以沒有切換條、沒有候選案（同 ortho-article／bioceramic-article 那兩次）。

   改完草稿就重跑一次：node drafts/crown-materials-preview.mjs

   ⚠ 這一種預覽頁的來源是 posts/<slug>/ 不是 index.html，所以 CLAUDE.md
     第八節那四個坑只踩得到兩個半，另外多一個 index.html 的複本不會遇到的：
     ① 相對路徑：../../ 剛好對（兩層都是），但 ../missing-tooth/ 這種**同層**
        連結會指到 preview/ 底下去 —— 一律改成絕對路徑。
     ② 計數器：data-views-self 留著的話，每開一次預覽頁正式站那一篇就多算一次。
        這一篇還沒上線、slug 也不在 allowed-slugs 裡，但規矩照做 —— 整塊拿掉。
     ③ 切換條那一條用不到；preview/ 進 _site 那一條本來就已經就位。
     ④ **多出來的那一個**：canonical 指向一個還不存在的正式網址，等於對外宣告
        一個不存在的頁面。整段換成 noindex。 */

import fs from "node:fs";

const src = "drafts/crown-materials/index.html";
const out = "preview/crown-materials/index.html";
let h = fs.readFileSync(src, "utf8");

/* ④ canonical → noindex（提案頁三道 noindex 的第一道，另外兩道在 Worker 與 robots.txt） */
const before = h;
h = h.replace(/<link rel="canonical" href="[^"]*">/,
  '<meta name="robots" content="noindex, nofollow, noarchive">');
if (h === before) throw new Error("canonical 沒有被換掉 —— 草稿的 <head> 是不是改過了？");

/* ① 同層連結 → 絕對路徑（../../ 那些不用動，preview/<name>/ 和 posts/<slug>/ 一樣深） */
h = h.replace(/href="\.\.\/([a-z0-9-]+)\//g, 'href="/posts/$1/');

/* ② 計數器：整塊拿掉（連前面的空白與換行） */
h = h.replace(/\n\s*<span class="views" data-views-self[\s\S]*?次瀏覽\n\s*<\/span>/, "");
if (/data-views-self/.test(h)) throw new Error("data-views-self 還在");

/* 這一頁是草稿預覽，講一句就好 —— 不然 HERO 那一格空著會看起來像壞掉 */
h = h.replace('<div class="post-body wrap-text">',
  '<div class="post-body wrap-text">\n    <p class="note">（這是還沒上線的草稿預覽。文章開頭的 HERO 插畫是另外一輪，還沒畫。）</p>');

fs.mkdirSync("preview/crown-materials", { recursive: true });
fs.writeFileSync(out, h, "utf8");

console.log(`${out}  ${h.length} bytes`);
for (const [name, ok] of [
  ["noindex 在",            /content="noindex, nofollow, noarchive"/.test(h)],
  ["canonical 不在",        !/rel="canonical"/.test(h)],
  ["計數器不在",            !/data-views-self/.test(h)],
  ["同層連結是絕對路徑",    !/href="\.\.\/[a-z0-9-]+\//.test(h)],
  ["樣式表還指得到",        /href="\.\.\/\.\.\/assets\/style\.css"/.test(h)],
]) console.log(` ${ok ? "✓" : "✗"} ${name}`);
