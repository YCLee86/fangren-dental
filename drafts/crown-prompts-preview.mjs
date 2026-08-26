/* 提示詞的一鍵複製頁 —— drafts/prompts/*.txt → preview/crown-prompts/index.html
 *
 * 使用者 2026-08-26：「之後提示詞不用完整顯示給我 只要給我一鍵複製就好
 * 畢竟我也很難慢慢滑檢查提示詞」。所以提示詞不再貼進對話，改成放在這一頁上，
 * 每一份一顆大按鈕。手機上按一下就進剪貼簿。
 *
 * 加一份新提示詞 = 在 drafts/prompts/ 放一個 .txt（開頭兩行 #TITLE / #NOTE，
 * 然後一行 --- 分隔），再跑一次 node drafts/crown-prompts-preview.mjs。
 *
 * ⚠ 這一頁走 CLAUDE.md 第八節那套提案頁的規矩：自己的 noindex meta（Worker 的
 *   X-Robots-Tag 與 robots.txt 的 Disallow 本來就已經涵蓋 /preview/）。
 * ⚠ 出圖的縮圖從 drafts/ 複製進 preview/ —— drafts/ 進不了 _site，
 *   放著不動的話線上會是破圖。 */

import fs from "node:fs";
import path from "node:path";
import pkg from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pkg;

const OUT = "preview/crown-prompts";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* 每一份提示詞可以掛一張已經出過的圖（檔案在 drafts/，會被縮小複製進 preview/） */
const SHOTS = {
  "01-palm": "hero-crown-try1-palm.jpg",
  "02-same-hands": "hero-crown-try2-hands.jpg",
  "03-monument": "hero-crown-try3-monument.jpg",
  "04-street-houses": "hero-crown-try4-street.jpg",
  "05-under-construction": "hero-crown-try5-building.jpg",
  "06-stone-column": "hero-crown-try6-stone.jpg",
  "07-pans": "hero-crown-try7-pans.jpg",
  "09-consult-tiles": "hero-crown-try8-consult.jpg",
};

const items = fs.readdirSync("drafts/prompts").filter((f) => f.endsWith(".txt")).sort()
  .map((f) => {
    const raw = fs.readFileSync(path.join("drafts/prompts", f), "utf8");
    const i = raw.indexOf("\n---\n");
    if (i < 0) throw new Error(`${f} 少了 --- 分隔線`);
    const head = raw.slice(0, i).split("\n");
    const get = (k) => (head.find((l) => l.startsWith(`#${k}:`)) || "").slice(k.length + 2).trim();
    return { id: f.replace(/\.txt$/, ""), title: get("TITLE"), note: get("NOTE"),
             body: raw.slice(i + 5).replace(/\s+$/, "") };
  });

fs.mkdirSync(OUT, { recursive: true });

/* 縮圖：Chromium canvas，長邊 560、JPEG 0.78 —— preview/ 是 no-store，每次都要重載 */
const b = await chromium.launch();
const page = await b.newPage();
for (const [id, file] of Object.entries(SHOTS)) {
  const src = path.join("drafts", file);
  if (!fs.existsSync(src)) continue;
  const dataUrl = "data:image/jpeg;base64," + fs.readFileSync(src).toString("base64");
  const out = await page.evaluate(async (u) => {
    const im = new Image(); im.src = u; await im.decode();
    const W = 560, H = Math.round(im.height * W / im.width);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"); g.imageSmoothingQuality = "high";
    g.drawImage(im, 0, 0, W, H);
    return c.toDataURL("image/jpeg", 0.78);
  }, dataUrl);
  fs.writeFileSync(path.join(OUT, id + ".jpg"), Buffer.from(out.split(",")[1], "base64"));
}
await b.close();

const cards = items.map((it, n) => `
  <section class="pv-card">
    <h2>${esc(it.title)}</h2>
    ${it.note ? `<p class="pv-note">${esc(it.note)}</p>` : ""}
    ${fs.existsSync(path.join(OUT, it.id + ".jpg"))
      ? `<img class="pv-shot" src="${it.id}.jpg" alt="這一份提示詞出過的圖" loading="lazy">` : ""}
    <button class="pv-copy" type="button" data-i="${n}">複製提示詞</button>
    <details>
      <summary>看全文（${it.body.split("\n").length} 行）</summary>
      <textarea id="pv-t${n}" readonly rows="14" spellcheck="false">${esc(it.body)}</textarea>
    </details>
  </section>`).join("\n");

fs.writeFileSync(path.join(OUT, "index.html"), `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>〈一體成型的假牙好在哪〉HERO 提示詞</title>
<style>
  :root { --paper:#e2e5e6; --card:#f4f4f5; --ink:#2a2c27; --soft:#5c5f57;
          --rule:#c9ccc9; --accent:#335b8b; }
  * { box-sizing: border-box; }
  body { margin:0; padding:1.25rem .875rem 3rem; background:var(--paper); color:var(--ink);
         font:16px/1.7 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif; }
  h1 { font-size:1.25rem; line-height:1.5; margin:0 0 .25rem; }
  .pv-lead { color:var(--soft); font-size:.9rem; margin:0 0 1.5rem; }
  .pv-card { background:var(--card); border:1px solid var(--rule); border-radius:12px;
             padding:1rem .9rem; margin-bottom:1.1rem; }
  .pv-card h2 { font-size:1.05rem; margin:0 0 .35rem; }
  .pv-note { color:var(--soft); font-size:.86rem; margin:0 0 .8rem; }
  .pv-shot { display:block; width:100%; height:auto; border-radius:8px;
             border:1px solid var(--rule); margin:0 0 .9rem; }
  .pv-copy { display:block; width:100%; min-height:52px; border:0; border-radius:10px;
             background:var(--accent); color:#fff; font:600 1rem/1 inherit;
             letter-spacing:.04em; cursor:pointer; -webkit-tap-highlight-color:transparent; }
  .pv-copy.is-done { background:#2c5238; }
  details { margin-top:.75rem; }
  summary { color:var(--soft); font-size:.85rem; cursor:pointer; }
  textarea { width:100%; margin-top:.5rem; padding:.6rem; border:1px solid var(--rule);
             border-radius:8px; background:#fff; color:var(--soft);
             font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace; resize:vertical; }
  footer { color:var(--soft); font-size:.8rem; margin-top:1.5rem; }
</style>
</head>
<body>
<h1>〈一體成型的假牙好在哪〉HERO 提示詞</h1>
<p class="pv-lead">按一下就複製，貼進 Gemini 就可以出圖。全文預設收起來。</p>
${cards}
<footer>提示詞的原始檔在 <code>drafts/prompts/</code>，改完跑一次<br><code>node drafts/crown-prompts-preview.mjs</code> 這一頁就會更新。</footer>
<script>
document.querySelectorAll(".pv-copy").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var ta = document.getElementById("pv-t" + btn.dataset.i);
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "已複製 ✓"; btn.classList.add("is-done");
      setTimeout(function () { btn.textContent = old; btn.classList.remove("is-done"); }, 1600);
    };
    /* navigator.clipboard 要 https ＋ 使用者手勢，兩個條件這裡都成立；
       退路是老方法（iOS 舊版 Safari 仍然吃這一套）。 */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      ta.closest("details").open = true;
      ta.focus(); ta.setSelectionRange(0, ta.value.length);
      try { document.execCommand("copy"); done(); }
      catch (e) { btn.textContent = "複製失敗，請長按下面的文字自己複製"; }
    }
  });
});
</script>
</body>
</html>
`);
console.log(`${OUT}/index.html  ${items.length} 份提示詞`);
for (const it of items) console.log("  •", it.title, `(${it.body.split("\n").length} 行)`);
