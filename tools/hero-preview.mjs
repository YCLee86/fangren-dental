#!/usr/bin/env node
/* =============================================================================
   產生 HERO 改版的預覽檔（單一自足 HTML，圖片以 data URI 內嵌）
   用法： node tools/hero-preview.mjs [圖片路徑]
   預設使用 assets/hero-dental.jpg 當替身。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgArg = process.argv[2] || path.join(ROOT, "assets", "hero-dental.jpg");
const imgPath = path.resolve(imgArg);

if (!fs.existsSync(imgPath)) {
  console.error(`找不到圖片：${imgPath}`);
  process.exit(1);
}

const ext = path.extname(imgPath).toLowerCase();
const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
const dataUri = `data:${mime};base64,${fs.readFileSync(imgPath).toString("base64")}`;
const isStandIn = path.basename(imgPath) === "hero-dental.jpg";

const css = fs.readFileSync(path.join(ROOT, "assets", "style.css"), "utf8");
const heroCss = fs.readFileSync(path.join(ROOT, "tools", "hero-new.css"), "utf8");

/* 卡片插圖也內嵌，預覽檔才不依賴任何外部檔案 */
const svg = (name) =>
  "data:image/svg+xml;base64," +
  fs.readFileSync(path.join(ROOT, "assets", name)).toString("base64");

const html = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HERO 改版預覽 — 芳仁牙醫診所</title>
<style>
${css}
${heroCss}
/* 預覽專用提示條 */
.preview-note{background:#fdf3e2;border-bottom:1px solid #e8d5ae;color:#8a5a12;
  font-size:.82rem;line-height:1.7;padding:.7rem 1rem;text-align:center}
.preview-note b{color:#6b4409}
</style>
</head>
<body>
${isStandIn ? `<div class="preview-note"><b>版型預覽</b>：這張是暫代圖（原本的 CC BY 照片）。換成診所實拍後，構圖裁切與明暗會不一樣。</div>` : ""}

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="#">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 8c-12 0-20 7-20 19 0 11 3 21 7 30 2 6 4 11 8 11s4-7 5-11c.7-3 5.3-3 6 0 1 4 1 11 5 11s6-5 8-11c4-9 7-19 7-30 0-12-8-19-20-19z" fill="#12656a"/></svg>
      </span>
      <span>芳仁牙醫診所<small>雲林斗六・在地四十年</small></span>
    </a>
    <nav class="site-nav" aria-label="主選單">
      <a href="#articles">全部文章</a>
      <a href="#clinic">診所資訊</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero">
    <div class="hero-cover">
      <img src="${dataUri}" alt="芳仁牙醫診所外觀">
    </div>
    <div class="hero-inner">
      <div class="wrap">
        <p class="hero-eyebrow">雲林縣斗六市・自 1980 年代起</p>
        <h1>看了四十年的牙，<br>想把該說的都寫下來</h1>
        <p class="hero-lede">在診間裡三分鐘講不完的事，我們一篇一篇寫在這裡。</p>
      </div>
    </div>
  </section>

  <div class="stats-bar">
    <div class="wrap">
      <ul class="hero-stats">
        <li><b>40+</b><span>年在地服務</span></li>
        <li><b>5</b><span>篇衛教文章</span></li>
        <li><b>1,284</b><span>本站累計瀏覽</span></li>
      </ul>
    </div>
  </div>

  <section class="section wrap">
    <div class="section-head">
      <h2>最新文章</h2>
      <p>依最後更新時間排序，最新的在前</p>
    </div>
    <div class="card-grid">
      <a class="card" href="#">
        <div class="card-thumb"><img src="${svg('hero-checkup.svg')}" alt=""></div>
        <div class="card-body">
          <span class="card-tag">定期檢查</span>
          <h3>半年一次的洗牙：健保給付的那一次，到底在做什麼</h3>
          <p>洗牙不會把牙齒洗薄，也不是美白。它清的是自己刷不掉的牙結石。</p>
          <div class="card-meta"><span>芳仁牙醫診所 編輯室</span><span class="dot">・</span><span>更新 2026/07/08</span></div>
        </div>
      </a>
      <a class="card" href="#">
        <div class="card-thumb"><img src="${svg('hero-implant.svg')}" alt=""></div>
        <div class="card-body">
          <span class="card-tag">缺牙重建</span>
          <h3>缺牙之後：活動假牙、牙橋與植牙怎麼選</h3>
          <p>缺一顆牙不只是缺一顆牙。旁邊的牙會倒、對面的牙會長長、齒槽骨會流失。</p>
          <div class="card-meta"><span>芳仁牙醫診所 編輯室</span><span class="dot">・</span><span>更新 2026/06/02</span></div>
        </div>
      </a>
      <a class="card" href="#">
        <div class="card-thumb"><img src="${svg('hero-kids.svg')}" alt=""></div>
        <div class="card-body">
          <span class="card-tag">兒童牙科</span>
          <h3>孩子第一次看牙：時機、氟化物與窩溝封填</h3>
          <p>「乳牙反正會換掉」是最常見也最昂貴的誤解。</p>
          <div class="card-meta"><span>芳仁牙醫診所 編輯室</span><span class="dot">・</span><span>更新 2026/05/06</span></div>
        </div>
      </a>
    </div>
  </section>
</main>
</body>
</html>
`;

const out = path.join(ROOT, "hero-preview.html");
fs.writeFileSync(out, html, "utf8");
console.log(`預覽已產生：${out}`);
console.log(`使用圖片：${imgPath}（${(fs.statSync(imgPath).size / 1024).toFixed(0)} KB）${isStandIn ? " ← 替身" : ""}`);
