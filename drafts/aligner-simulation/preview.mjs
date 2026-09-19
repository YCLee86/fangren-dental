/* 把這一篇的草稿（drafts/aligner-simulation/index.html）轉成給使用者在手機上讀的
   預覽頁 preview/aligner-article/index.html。

   草稿是唯一的真本，這支只做三件機械的事 —— 所以改文章一律改草稿，改完重跑這一支，
   兩邊不會走鐘（CLAUDE.md 第八節：長期開著的預覽頁最容易發生的就是兩份內容不一樣）。

     ① 站內連結：草稿在 drafts/<slug>/，隔壁就是別篇文章，所以寫的是 ../orthodontics/；
        搬到 preview/aligner-article/ 之後那個相對路徑會指到 preview/ 底下去。
        一律換成絕對路徑 /posts/<slug>/。
        ⚠ ../../assets／../../#topics 不動 —— 兩個資料夾一樣深，那些路徑本來就對。
     ② 計數器：把整塊 .views 拿掉。這一篇還沒上線，slug 不在 allowed-slugs 裡，
        留著只會印一排「—」；而 data-views-self 是會 POST +1 的那一個，更不能留。
     ③ noindex：草稿的 <head> 本來就已經是 noindex（它取代了 build 產生的 SEO 區塊），
        這裡只驗一次有沒有被改掉。

   用法：node drafts/aligner-simulation/preview.mjs
        node drafts/aligner-simulation/preview.mjs --check   只比對不寫檔 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "drafts/aligner-simulation/index.html");
const OUT = path.join(ROOT, "preview/aligner-article/index.html");
const check = process.argv.includes("--check");

let html = fs.readFileSync(SRC, "utf8");

/* ① 站內連結 —— 只吃 ../<slug>/ 這一種，../../ 那一層不會被命中（[a-z] 擋掉了點） */
html = html.replace(/href="\.\.\/([a-z][a-z0-9-]*)\//g, 'href="/posts/$1/');

/* ② 計數器整塊拿掉 */
html = html.replace(/\n\s*<span class="views"[\s\S]*?次瀏覽\n\s*<\/span>/, "");

/* 四道守門。掃的是切出來的那一塊，不是整頁 —— 整頁掃會撞到上面那幾行註解自己
   （CLAUDE.md 第九節最常踩的五條，第 4 條）。 */
const head = html.slice(0, html.indexOf("</head>"));
const body = html.slice(html.indexOf("<main id=\"main\">"), html.indexOf("</main>"));
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

if (!/<meta name="robots" content="noindex, nofollow, noarchive">/.test(head))
  die("<head> 裡沒有 noindex —— 提案頁一定要有（CLAUDE.md 第八節第 2 條）");
/* ⚠ 這一條要找的是「<!--」加上 SEO:START 的那個真標記，不是 SEO:START 五個字 ——
   草稿的 <head> 裡那段說明文字自己就寫著 SEO:START，只掃字會掃到自己 */
if (head.includes("<!-" + "- SEO:START"))
  die("<head> 裡還有 build 產生的 SEO 區塊，那一段指向一個還沒上線的網址");
if (/data-views-self/.test(html))
  die("計數器的 data-views-self 還在，每開一次預覽就會灌一次數");
if (/href="\.\.\/[a-z]/.test(body))
  die("內文還有 ../<slug>/ 的相對連結，在 preview/ 底下會指錯地方");

const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;
if (prev === html) { console.log("= 預覽頁已經是最新的"); process.exit(0); }
if (check) { console.log(`≠ 預覽頁和草稿不同步（${prev === null ? "還沒產生" : "內容有差"}），跑一次不帶 --check 的就會更新`); process.exit(0); }

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ preview/aligner-article/index.html（${html.length} 字元）`);
