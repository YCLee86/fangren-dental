#!/usr/bin/env node
/* =============================================================================
   提案頁：**標籤換頁不要跳**（2026-08-31）　→ /preview/chip-carry/
   -----------------------------------------------------------------------------
   使用者：「點選標籤的時候會進到著陸頁，但標籤不一定在點進去之前的位置，
   因為是不同的網頁 —— 有辦法做成點下去之後標籤還在點之前的那個位置嗎？」

   這一輪要判斷的是**換頁那一下**，所以提案頁不能是一頁 —— 一定要是**真的
   八份文件、真的導覽**（首頁 ＋ 七科），不然「跳不跳」根本演不出來。
   同 CLAUDE.md 第八節那條：提案頁要擺真的產出檔，不要用 CSS 把成品再做一次。

   八頁都是**快照**（index.html 與 topics/<spec>/index.html 各複製一份），
   所以 index.html 一改就要重跑這一支；main 若被另一台推過也要重抓。

   一條切換條、兩格：
     ・現況　　　　＝ 停用「接回原位」，行為完全等於正式站（只跑 bring()）
     ・新案・接回原位 ＝ 這一輪要看的東西
   模式跟著網址走（?carry=0|1），所以**按下去換頁之後模式不會掉**。
   底下那兩行是現場量測：上一次按的那一顆按下去時在哪裡、現在在哪裡、差幾 px。

   ⚠ 複製 index.html 當提案頁的四個坑（CLAUDE.md 第八節），這一支各自的處理：
     ① 相對路徑：首頁那份深兩層、著陸頁那份深三層，href/src/srcset/CSS 的
        url() 四種都要換（url() 那一條是 2026-08-23 線稿那一輪補的）。
     ② 計數器：**不是把 counter.js 拿掉**，而是只把 data-views-self 降成
        data-views —— counter.js 只有看到 -self 才會 POST +1，降級之後
        「不會灌計數」與「卡片上印得出真實數字」兩件事同時成立。
        這比寫一個示範值好：2026-08-07 就是示範值 8642 跟著版型搬回正式站的。
     ③ 切換條要插在**最後一個** </body> 前面（用 lastIndexOf）：這一站的註解
        裡就寫著那幾個字，String.replace 會換到註解裡那一個。
     ④ preview/ 進得了 _site（dist.mjs 的 OPTIONAL）、robots.txt 擋著、
        Worker 對 /preview/* 加 X-Robots-Tag ＋ no-store —— 三處都已經就位。
   ⚠ 另外三件：切換條的 class 一律 pv- 前綴（2026-08-16 那次 .foot 撞到頁尾）、
     樣式放 <head>（2026-08-26：塞在頁尾的話關著的東西會在開頁那 180ms 閃出來）、
     整份 JSON-LD 與 canonical 拿掉（不要對外宣告一個 /preview/ 底下的診所實體）。

   用法： node tools/chip-carry-preview.mjs
   定案上線之後：把 preview/chip-carry/ 刪掉，這一支也刪掉。
   ============================================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SPECS = ["general", "perio", "endo", "kids", "ortho", "prosth", "surg"];
const BASE = "/preview/chip-carry";
const OUT = path.join(ROOT, "preview", "chip-carry");

/* ---------- 切換條的樣式（插進 <head>）---------- */
const STYLE = `
<style>
/* 提案頁的切換條 —— 定案時連同整個資料夾一起刪掉。class 一律 pv- 前綴。 */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
  background: var(--card); border-top: 1px solid var(--rule);
  padding: .55rem max(.8rem, env(safe-area-inset-left)) calc(.55rem + env(safe-area-inset-bottom));
  font-size: .8rem; line-height: 1.5; color: var(--ink);
  box-shadow: 0 -6px 18px rgba(0,0,0,.10);
}
.pv-row { display: flex; gap: .4rem; margin-bottom: .35rem; }
.pv-b {
  flex: 1 1 0; min-height: 34px; padding: .3rem .5rem;
  font: inherit; font-size: .82rem; color: var(--ink);
  background: var(--card); border: 1px solid currentColor; border-radius: 8px;
  cursor: pointer;
}
/* ⚠ 切換條刻意用中性的墨色，不吃該科的 --accent：它是提案期間的工具，
   不該看起來像網站的一部分（而且兒牙那一顆填色配白字只有 3.22）。 */
.pv-b[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--paper); }
.pv-m { margin: 0; font-size: .78rem; }
.pv-dim { color: var(--ink-soft); }
.pv-num { font-variant-numeric: tabular-nums; }
/* 「回到最上面」那顆讓開切換條 */
.btt { bottom: calc(20px + var(--pv-h, 96px)) !important; }
</style>`;

/* ---------- 切換條本身（插在最後一個 body 結束標籤前面）---------- */
const BAR = `
<div class="pv-bar" id="pv-bar">
  <div class="pv-row">
    <button type="button" class="pv-b" data-mode="0">現況</button>
    <button type="button" class="pv-b" data-mode="1">新案・接回原位</button>
  </div>
  <p class="pv-m" id="pv-m1">把上面那一排標籤左右滑到一半，再點一顆。</p>
  <p class="pv-m pv-dim pv-num" id="pv-m2"></p>
</div>
<script>
(function () {
  var row = document.querySelector('#topics .chips');
  var bar = document.getElementById('pv-bar');
  if (!row || !bar) return;
  var on = window.__PV_CARRY !== false;
  var KEY = 'fangren:chips-x', PVK = 'pv:chip-carry:last';

  /* 每一顆標籤的網址都帶著目前的模式，換頁之後模式才不會掉 */
  [].forEach.call(row.querySelectorAll('a[data-spec]'), function (a) {
    var u = new URL(a.getAttribute('href'), location.href);
    u.searchParams.set('carry', on ? '1' : '0');
    a.setAttribute('href', u.pathname + u.search + u.hash);
  });

  /* 按下去那一刻，把「這一顆現在在哪裡」記起來給下一頁的面板用。
     ⚠ 這是提案頁自己的紀錄，和正式站那支用的不是同一個 key。 */
  row.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[data-spec]') : null;
    if (!a) return;
    var r = a.getBoundingClientRect(), rr = row.getBoundingClientRect();
    try {
      sessionStorage.setItem(PVK, JSON.stringify({
        n: (a.textContent || '').trim(), s: a.getAttribute('data-spec'),
        x: +(r.left - rr.left).toFixed(1), on: on
      }));
    } catch (e) {}
  });

  /* 上一頁按下去的那一筆（讀出來就丟：重新整理進來的不算） */
  var last = null;
  try {
    var raw = sessionStorage.getItem(PVK);
    if (raw) { sessionStorage.removeItem(PVK); last = JSON.parse(raw); }
  } catch (e) {}

  var m1 = document.getElementById('pv-m1'), m2 = document.getElementById('pv-m2');
  function xOf(spec) {
    var a = row.querySelector('[data-spec="' + spec + '"]');
    if (!a) return null;
    var r = a.getBoundingClientRect(), rr = row.getBoundingClientRect();
    return +(r.left - rr.left).toFixed(1);
  }
  function paint() {
    var max = Math.round(row.scrollWidth - row.clientWidth);
    m2.textContent = (max <= 1 ? '這個寬度八顆排得下，那一排不會捲'
                               : '這一排捲到 ' + Math.round(row.scrollLeft) + ' / 可捲 ' + max + 'px')
                   + '　・　模式：' + (on ? '新案' : '現況');
    if (!last) return;
    var now = xOf(last.s);
    if (now === null) return;
    var d = +(now - last.x).toFixed(1);
    m1.textContent = last.n + '　按下去 x=' + last.x + ' → 現在 x=' + now
                   + '　差 ' + (d > 0 ? '+' : '') + d + 'px'
                   + (Math.abs(d) < 1 ? '（沒有跳）' : '');
  }
  paint();
  row.addEventListener('scroll', paint, { passive: true });
  addEventListener('load', function () { setTimeout(paint, 250); });
  addEventListener('resize', paint);
  function h() { document.documentElement.style.setProperty('--pv-h', bar.offsetHeight + 'px'); }
  h(); addEventListener('load', h); addEventListener('resize', h);

  [].forEach.call(bar.querySelectorAll('.pv-b'), function (b) {
    b.setAttribute('aria-pressed', String((b.getAttribute('data-mode') === '1') === on));
    b.addEventListener('click', function () {
      /* 換模式的時候把兩份紀錄都清掉 —— 不然重新整理也會「接回原位」，
         那是假的（真正的行為只在「按了標籤換頁」時才發生）。 */
      try { sessionStorage.removeItem(KEY); sessionStorage.removeItem(PVK); } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.set('carry', b.getAttribute('data-mode'));
      location.href = u.pathname + u.search + u.hash;
    });
  });
})();
</` + `script>`;

/* ---------- 一頁一頁做 ---------- */
function build(spec) {
  const home = spec === null;
  const srcPath = home ? path.join(ROOT, "index.html")
                       : path.join(ROOT, "topics", spec, "index.html");
  let h = fs.readFileSync(srcPath, "utf8");

  /* 1. 相對路徑：首頁那份原本在根目錄（深 2 層），著陸頁那份原本在
        topics/<spec>/（已經是 ../../，再深一層變 ../../../）。 */
  if (home) {
    h = h.replace(/(\s(?:href|src)=")(assets\/|posts\/|site\.webmanifest)/g, "$1../../$2");
    h = h.replace(/srcset="([^"]*)"/g, (m, v) =>
      `srcset="${v.replace(/(^|,\s*)assets\//g, "$1../../assets/")}"`);
    h = h.replace(/url\((["']?)assets\//g, "url($1../../assets/");
  } else {
    h = h.replace(/(\s(?:href|src)=")\.\.\/\.\.\//g, "$1../../../");
    h = h.replace(/srcset="([^"]*)"/g, (m, v) =>
      `srcset="${v.replace(/(^|,\s*)\.\.\/\.\.\//g, "$1../../../")}"`);
    h = h.replace(/url\((["']?)\.\.\/\.\.\//g, "url($1../../../");
  }

  /* 2. 搜尋引擎：三道 noindex 的第一道（另外兩道在 Worker 與 robots.txt）。
        順便把 canonical 與整份 JSON-LD 拿掉 —— 那些指向的是正式站的網址，
        留著等於在 /preview/ 底下宣告一個不存在的頁面與診所實體。 */
  const robots = '<meta name="robots" content="noindex, nofollow, noarchive">';
  if (!/<meta name="robots"[^>]*>/.test(h)) throw new Error("找不到 robots meta");
  h = h.replace(/<meta name="robots"[^>]*>/, robots);
  h = h.replace(/<link rel="canonical"[^>]*>\n?/g, "");
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, "");

  /* 3. 計數器：只把 -self 降級，counter.js 留著（見檔頭第 ② 條） */
  h = h.replace(/data-views-self="/g, 'data-views="');
  if (/data-views-self/.test(h)) throw new Error("還有 data-views-self 沒降級");

  /* 4. chips 的網址改指提案頁自己這八頁。
        ⚠ 只動 <ul class="chips"> 裡面那一排 —— 門診表底下還有一排長得
          幾乎一樣的科別標記（那是純按鈕、沒有 href，但範圍還是要限死）。 */
  const cs = h.indexOf('<ul class="chips">');
  const ce = h.indexOf("</ul>", cs);
  if (cs === -1 || ce === -1) throw new Error("找不到 chips 那一排");
  let chips = h.slice(cs, ce);
  chips = chips.replace('href="/#topics"', `href="${BASE}/#topics"`);
  for (const s of SPECS) chips = chips.replace(`href="/topics/${s}/"`, `href="${BASE}/${s}/"`);
  if (/href="\/topics\//.test(chips) || /href="\/#topics"/.test(chips))
    throw new Error("chips 還有網址沒改到提案頁上");
  h = h.slice(0, cs) + chips + h.slice(ce);

  /* 5. 模式旗標要在**解析到那一排之前**就決定好 —— 正式站那支腳本就在那一排
        的正下方，晚一步就來不及了。 */
  h = h.replace("<head>", "<head>\n<script>window.__PV_CARRY = !/[?&]carry=0/.test(location.search);\x3c/script>");

  /* 6. 把正式站那支「接回原位」關掉的開關接上去（現況那一格要用） */
  const READ = "var raw = sessionStorage.getItem(KEY);";
  if ((h.match(new RegExp(READ.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1)
    throw new Error("找不到（或不只一處）正式站那支讀 sessionStorage 的那一行 —— index.html 改過了");
  h = h.replace(READ, "var raw = window.__PV_CARRY === false ? null : sessionStorage.getItem(KEY);");

  /* 7. 樣式進 <head>、切換條插在最後一個 body 結束標籤前面（見檔頭第 ③ 條） */
  h = h.replace("</head>", STYLE + "\n</head>");
  const tail = "</bo" + "dy>";
  const at = h.lastIndexOf(tail);
  if (at === -1) throw new Error("找不到 body 的結束標籤");
  h = h.slice(0, at) + BAR + "\n" + h.slice(at);

  const dir = home ? OUT : path.join(OUT, spec);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), h, "utf8");
  console.log(`  ${home ? "index" : spec}/  ${(h.length / 1024).toFixed(0)}KB`);
}

fs.rmSync(OUT, { recursive: true, force: true });
console.log("提案頁：標籤換頁不要跳");
build(null);
for (const s of SPECS) build(s);
console.log(`完成 → https://fangren.net${BASE}/`);
