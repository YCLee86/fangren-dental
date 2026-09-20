/* 「那三句回應」提案頁的產生器（2026-09-20，SEO／GEO 體檢 C4）。
   來源是 topics/{general,endo,prosth}/index.html 的快照，產出三頁：
     preview/topic-stance/          一般牙科・定期檢查
     preview/topic-stance-endo/     顯微根管
     preview/topic-stance-prosth/   植牙・假牙重建

   ⚠ 快照，不要手改那三頁 —— 改完重跑這一支。
   ⚠ main 若被另一台推了東西，也要重跑（快照會過期）。

   要判斷的是什麼：
     C4（Q&A／重點整理）現在 2.5/3，缺的 0.5 全在這三頁 —— 它們的三個處境是
     <ul class="tp-cases">（評分器只給 1 分），另外四科是 <dl>（三個 dt 共用
     一個 dd，3 分）。差別在**有沒有那一句回應**：這三科只有 lead、沒有 stance，
     沒有回應句就寫不出合法的 dl（只有 dt 沒有 dd）。
   ⚠⚠ 所以這一輪要決定的不是標記，是文案 —— 而且會推翻 2026-08-19 那條
     「lead 與 stance 是兩種節奏，一科只挑一種，不要兩個都給」。
     顯微根管與植牙那兩頁還標著「不要再重寫這一頁，要改先問使用者」。

   ⚠⚠ 第二件要一起看的事：**一屏**（COPY.md 第九之十一節）。
     實測加一句回應，兩行的版本整塊 +60px、一行的 +32px 上下。三頁現在的
     下緣（390x700）是 663／660／663，所以兩行的版本會掉出一屏 19~23px。
     兒牙早就是這樣（390 超 27、375 超 65），而且那是使用者知情後選的
     （COPY.md 第九之十三節第 6 條：「不要管版面的限制」）—— 所以這一項
     不是否決，是**要他知道代價之後自己挑**。切換條底下的面板現場量。

   照 CLAUDE.md 第八節，著陸頁的複本要處理的事：
     1. SEO 區塊整段換成 noindex（原本的 canonical／JSON-LD 指向正式網址）
     2. 相對路徑不必動 —— preview/<name>/ 和 topics/<spec>/ 同樣是第二層
     3. 計數器不必動 —— 著陸頁只有 data-views，沒有 -self（不會灌計數）
     4. 切換條插在最後一個 </body> 前面（用 lastIndexOf，註解裡也有那幾個字）
     5. class 一律 pv- 前綴（站上短名字幾乎一定會撞）
     6. 那三科的標記改指到對應的提案頁，不然按下去會跳回正式站 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* 候選。⚠ 文案的規矩在 COPY.md 第九之八節（回應那一句要同時答完三個人、
   最好收成一組對仗、決定權留給他）與第九之十七節那張十一條的檢查表。
   ⚠ 一行 ≤ 22 字（390 寬量到的），超過就折成兩行、整塊掉出一屏 ——
   所以 Ⓐ Ⓑ 是一行的，Ⓒ 是兩行、三個人都答到的完整版。 */
const SPECS = [
  {
    key: "general", param: "g", out: "topic-stance", label: "一般牙科",
    /* 三個處境：想不起上次／不痛就沒去／爸媽在外地（＝子女在查）。
       ⚠ 這一科的中段標題是「在芳仁，我們是這樣想的」，2026-08-19 定案時
         刻意把「診所的看法」留到那一塊 —— 所以回應那一句要停在
         「現在就可以看」這一層，不要先把中段的話講掉。 */
    cands: [
      { k: "a", name: "Ⓐ 不痛時",
        html: '不痛的時候，<strong>最看得出剛開始的問題</strong>。' },
      { k: "b", name: "Ⓑ 幫家人",
        /* ⚠ 受詞不能省（COPY.md 第九之十七節 F 條：「活動的」聽起來沒有人知道
           在講什麼）—— 所以是「自己看牙」不是「自己看」。 */
        html: '自己看牙、幫家人找，<strong>都從一次檢查開始</strong>。' },
      { k: "c", name: "Ⓒ 兩行版",
        html: '這三種都很常見。<strong>不痛不代表沒事</strong> —— 自己來、幫家人問，先看過再決定。' },
    ],
  },
  {
    key: "endo", param: "e", out: "topic-stance-endo", label: "顯微根管",
    /* 三個處境：蛀得深被說要抽神經／抽過又腫／怕白做。
       ⚠ 這一頁的 lead 已經是整頁要被記住的那一句（顯微鏡下看清楚，牙齒就多
         一次機會），所以回應那一句**不要再講一次「先看清楚」** —— 那正是
         2026-08-19 那條決定的理由（同一件事講兩次，兩句都不會被記住）。
       ⚠ 不可以承諾留得住（機會不是結果）、整頁不要出現任何「比較快」。 */
    cands: [
      { k: "a", name: "Ⓐ 看不出",
        html: '能不能留，<strong>不是一眼看得出來的</strong>。' },
      { k: "b", name: "Ⓑ 救不回",
        html: '<strong>救得回的要看得到，救不回的要講清楚</strong>。' },
      { k: "c", name: "Ⓒ 兩行版",
        html: '第一次做、做過又發作，<strong>怕的都是白做一次</strong> —— 原因找得到，才談得上留。' },
    ],
  },
  {
    key: "prosth", param: "p", out: "topic-stance-prosth", label: "植牙假牙",
    /* 四個處境：只能用另一邊咬／補過的缺的鬆的不只一顆／怕一大筆錢／說法都不一樣。
       ⚠ lead 的後半是他自己的問句（可是從哪裡開始？），中段標題直接回答它 ——
         回應那一句若也回答「從哪裡開始」就會和中段撞，所以停在「範圍」這一層。
       ⚠ 檢查表 D：不要讓每個人都覺得自己很嚴重（「才知道要弄多大」被否決過）。
       ⚠ 檢查表 J：同一屏不要把「補過的、缺的、鬆的」再列一次。
       ⚠ 不寫金額、不列方案名（那是中段與〈缺牙之後〉那篇的事）。 */
    cands: [
      { k: "a", name: "Ⓐ 每一顆",
        html: '<strong>不是每一顆都要動，也不是只動那一顆</strong>。' },
      { k: "b", name: "Ⓑ 不只一種",
        html: '問題不只一顆，<strong>答案也不只一種</strong>。' },
      { k: "c", name: "Ⓒ 兩行版",
        html: '<strong>問題不只一顆，答案也不只一種</strong> —— 整口看過，才分得出哪些要動。' },
    ],
  },
];

const KEYS = ["now", "a", "b", "c"];

/* 三個處境那一塊：dl 的寫法要和 tools/topics.mjs 逐字相同
   （三個 dt 共用一個 dd），不然提案頁上量到的東西不等於上線後的東西。 */
const dlBlock = (cases, reply) =>
  '        <dl class="tp-cases">\n' +
  cases.map((x) => `          <dt class="tp-case">${x}</dt>`).join("\n") +
  `\n          <dd class="tp-reply">${reply}</dd>\n        </dl>`;
const ulBlock = (cases) =>
  '        <ul class="tp-cases">\n' +
  cases.map((x) => `          <li class="tp-case">${x}</li>`).join("\n") +
  "\n        </ul>";

const STYLE = `
<style id="pv-style">
/* 切換條 —— class 一律 pv- 前綴。站上有 .foot（頁尾）、.card、.chips 這些短名字，
   不加前綴幾乎一定會撞（2026-08-16 hero-motion 那一輪踩過）。 */
.pv-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: var(--card); border-top: 1px solid var(--rule);
  box-shadow: 0 -2px 14px rgba(0,0,0,.14);
  padding: .5rem var(--pad) calc(.5rem + env(safe-area-inset-bottom));
  font-size: .82rem; color: var(--ink);
}
.pv-row { display: flex; gap: .35rem; }
.pv-row + .pv-row { margin-top: .35rem; }
.pv-btn {
  flex: 1 1 0; min-width: 0;
  font: inherit; font-size: .78rem; line-height: 1.3; padding: .4rem .2rem;
  border: 1px solid var(--rule); border-radius: .5rem;
  background: transparent; color: var(--ink); cursor: pointer;
  text-align: center; text-decoration: none;
}
/* 選中那一格用 ink/paper 反白 —— 夜間模式的 accent-deep 是亮階，白字壓不住 */
.pv-btn[aria-pressed="true"], .pv-btn[aria-current="page"] {
  background: var(--ink); color: var(--paper); border-color: var(--ink);
}
.pv-nav .pv-btn { font-size: .74rem; }
.pv-panel { margin: .4rem 0 0; font-size: .74rem; color: var(--ink-soft); line-height: 1.55; }
.pv-panel b { color: var(--ink); font-weight: 600; }
.pv-hint { margin: .3rem 0 0; font-size: .7rem; color: var(--ink-soft); line-height: 1.5; }
/* 收起來只剩右下角一顆小鈕 —— 這一頁要判斷的正好是最上面那一塊，
   切換條攤開時在 390 上吃掉約兩成（2026-08-16 type-scale-ipad-2 那一輪的做法）。 */
[data-pvfold="1"] .pv-row, [data-pvfold="1"] .pv-panel, [data-pvfold="1"] .pv-hint { display: none; }
.pv-fold {
  position: absolute; right: var(--pad); top: -1.9rem;
  font: inherit; font-size: .72rem; padding: .2rem .55rem;
  border: 1px solid var(--rule); border-radius: .5rem;
  background: var(--card); color: var(--ink-soft); cursor: pointer;
}
/* 量四個候選各自的高度用的那一份影子 —— 不可以拿畫面上那一塊直接換來換去，
   使用者會看到它跳。寬度跟著本尊，量到的行數才是真的。 */
.pv-ghost { position: absolute; left: -10000px; top: 0; visibility: hidden; pointer-events: none; }
/* 頁尾要墊高，不然切換條會蓋住最後一行 */
body { padding-bottom: 12rem; }
</style>`;

const NOINDEX = '<meta name="robots" content="noindex, nofollow, noarchive">';

for (const spec of SPECS) {
  const src = path.join(ROOT, "topics", spec.key, "index.html");
  let html = fs.readFileSync(src, "utf8");

  /* ---------- 1. SEO 區塊 → noindex ---------- */
  const iS = html.indexOf("<!-- SEO:START");
  const iE = html.indexOf("<!-- SEO:END -->");
  if (iS < 0 || iE < 0) throw new Error(`${spec.key}：找不到 SEO 區塊`);
  html = html.slice(0, iS) + NOINDEX + "\n" + html.slice(iE + "<!-- SEO:END -->".length);

  /* ---------- 2. 抓出三個處境，換成預設的候選 ---------- */
  const m = html.match(/<ul class="tp-cases">[\s\S]*?<\/ul>/);
  if (!m) throw new Error(`${spec.key}：找不到 ul.tp-cases（這一科已經有回應句了？）`);
  const cases = [...m[0].matchAll(/<li class="tp-case">([\s\S]*?)<\/li>/g)].map((x) => x[1]);
  if (cases.length < 3) throw new Error(`${spec.key}：只讀到 ${cases.length} 個處境`);
  html = html.replace(m[0], dlBlock(cases, spec.cands[0].html));

  /* ---------- 3. 那三科的標記改指到提案頁 ---------- */
  for (const s of SPECS) {
    html = html.replace(new RegExp(`href="/topics/${s.key}/"`, "g"), `href="/preview/${s.out}/"`);
  }

  /* ---------- 4. 樣式放進 head（放在 body 尾端的話，開頁那 180ms 會整條閃出來） ---------- */
  html = html.replace("</head>", STYLE + "\n</head>");

  /* ---------- 5. 切換條 ＋ 量測面板 ---------- */
  const DATA = JSON.stringify({
    spec: spec.key, param: spec.param, cases,
    cands: spec.cands.map((c) => ({ k: c.k, name: c.name, html: c.html })),
    nav: SPECS.map((s) => ({ param: s.param, out: s.out, label: s.label, self: s.key === spec.key })),
  });

  const BAR = `
<div class="pv-bar" role="group" aria-label="候選切換">
  <button class="pv-fold" type="button" id="pv-fold" aria-expanded="true">收起</button>
  <div class="pv-row" id="pv-cands"></div>
  <div class="pv-row pv-nav" id="pv-nav"></div>
  <p class="pv-panel" id="pv-panel">量測中…</p>
  <p class="pv-hint">這一頁在問：三個處境底下要不要多一句回應。</p>
</div>
<script id="pv-data" type="application/json">${DATA}</script>
<script>
(function () {
  var D = JSON.parse(document.getElementById("pv-data").textContent);
  var root = document.documentElement;
  var panel = document.getElementById("pv-panel");
  var KEYS = ["now", "a", "b", "c"];

  /* 網址參數：三科各一個（g/e/p），按科別那一排換頁時要一起帶走，
     不然換一頁就掉回預設。⚠ 正規式一定要寫 [a-z0-9]+（寫 [a-z]+ 會吃不到
     glass1 這種值，CLAUDE.md 第八節）。 */
  function readParam(p) {
    var m = new RegExp("[?&]" + p + "=([a-z0-9]+)").exec(location.search);
    return m && KEYS.indexOf(m[1]) >= 0 ? m[1] : "a";
  }
  var state = {};
  D.nav.forEach(function (n) { state[n.param] = readParam(n.param); });

  function block(k) {
    var dts = D.cases.map(function (c) { return '<dt class="tp-case">' + c + "</dt>"; }).join("");
    if (k === "now") {
      return ["ul", D.cases.map(function (c) { return '<li class="tp-case">' + c + "</li>"; }).join("")];
    }
    var cand = D.cands.filter(function (c) { return c.k === k; })[0];
    return ["dl", dts + '<dd class="tp-reply">' + cand.html + "</dd>"];
  }
  /* ⚠ 整個元素要換掉（ul 或 dl），不能只換裡面 ——
     站上那條 .tp-intro dl.tp-cases:last-of-type dd.tp-reply 比的是元素型別，
     留一個藏起來的 dl 在旁邊，下緣會差 6.7px，量到的就不是上線後的數字。 */
  function paint(k) {
    var cur = document.querySelector(".tp-intro .tp-cases");
    var b = block(k);
    var el = document.createElement(b[0]);
    el.className = "tp-cases";
    el.innerHTML = b[1];
    cur.parentNode.replaceChild(el, cur);
  }

  /* 影子：量四個候選各自會讓介紹區長到哪裡。
     ⚠ 不可以拿畫面上那一塊換來換去量，使用者會看到它跳。 */
  var ghost = null, ghostIn = null;
  function heights() {
    var intro = document.querySelector(".tp-intro");
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.className = "pv-ghost";
      document.body.appendChild(ghost);
    }
    ghost.style.width = intro.getBoundingClientRect().width + "px";
    ghost.innerHTML = "";
    ghostIn = intro.cloneNode(true);
    ghost.appendChild(ghostIn);
    var out = {};
    KEYS.forEach(function (k) {
      var cur = ghostIn.querySelector(".tp-cases");
      var b = block(k);
      var el = document.createElement(b[0]);
      el.className = "tp-cases";
      el.innerHTML = b[1];
      cur.parentNode.replaceChild(el, cur);
      var dd = ghostIn.querySelector("dd.tp-reply");
      out[k] = {
        h: ghostIn.getBoundingClientRect().height,
        lines: dd ? Math.round(dd.getBoundingClientRect().height /
                 parseFloat(getComputedStyle(dd).lineHeight)) : 0,
      };
    });
    return out;
  }

  function chars(h) {
    var d = document.createElement("div");
    d.innerHTML = h;
    return (d.textContent || "").replace(/\\s/g, "").length;
  }

  /* ⚠ 面板不可以只量一次：字型、圖與站上那支「開頁先亮一塊」的腳本
     都比它慢（2026-09-15 night-map-park 那一輪，使用者手機上的面板
     一直停在「量測中」）。所以 load、字型就緒、切換、轉向都再量一次。 */
  function measure() {
    var intro = document.querySelector(".tp-intro");
    var cards = document.querySelector(".cards");
    if (!intro) return;
    var k = state[D.param];
    var H = heights();
    var bottom = intro.getBoundingClientRect().bottom + scrollY;
    var vh = window.innerHeight;
    var over = bottom - vh;
    var cur = H[k], now = H.now;
    var parts = [];
    var cand = k === "now" ? null : D.cands.filter(function (c) { return c.k === k; })[0];
    var line1 = cand
      ? cand.name.slice(0, 1) + " <b>" + chars(cand.html) + " 字・" + cur.lines + " 行</b>　" +
        "下緣 <b>" + Math.round(bottom) + "px</b>（比現況 +" + Math.round(cur.h - now.h) + "）"
      : "現況（沒有那一句）　下緣 <b>" + Math.round(bottom) + "px</b>";
    parts.push(line1);
    var l2 = "這支手機 <b>" + vh + "px</b>：" +
             (over <= 0 ? "<b>✅ 收得進一屏</b>" : "<b>⚠ 超出 " + Math.round(over) + "px</b>");
    if (cards) {
      var top = cards.getBoundingClientRect().top + scrollY;
      /* 「下一區露出一角」是第二個判準（COPY.md 第九之十一節）。
         ⚠ 現況本來就露不出來的視窗，要講出來 —— 不然看起來像是這一句害的。 */
      var nowTop = top - (cur.h - now.h);
      l2 += "　文章卡 <b>" + Math.round(top) + "</b>" +
            (top < vh ? "（露出一角）" : nowTop < vh ? "（<b>⚠ 被擠出去</b>）" : "（現況也看不到）");
    }
    parts.push(l2);
    if (root.scrollWidth > window.innerWidth + 1) parts.push("<b>⚠ 破框</b>");
    panel.innerHTML = parts.join("<br>");
  }

  function href(n) {
    var q = D.nav.map(function (x) { return x.param + "=" + state[x.param]; }).join("&");
    return "/preview/" + n.out + "/?" + q;
  }
  function syncNav() {
    [].slice.call(document.querySelectorAll("#pv-nav .pv-btn")).forEach(function (a, i) {
      a.href = href(D.nav[i]);
    });
  }
  function apply(k, push) {
    state[D.param] = k;
    paint(k);
    [].slice.call(document.querySelectorAll("#pv-cands .pv-btn")).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.k === k));
    });
    syncNav();
    if (push) {
      var q = new URLSearchParams(location.search);
      q.set(D.param, k);
      history.replaceState(null, "", location.pathname + "?" + q + location.hash);
    }
    measure();
    requestAnimationFrame(measure);
  }

  var rowC = document.getElementById("pv-cands");
  rowC.innerHTML = '<button class="pv-btn" type="button" data-k="now">現況</button>' +
    D.cands.map(function (c) {
      return '<button class="pv-btn" type="button" data-k="' + c.k + '">' + c.name + "</button>";
    }).join("");
  [].slice.call(rowC.querySelectorAll(".pv-btn")).forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.k, true); });
  });

  document.getElementById("pv-nav").innerHTML = D.nav.map(function (n) {
    return '<a class="pv-btn" href="#"' + (n.self ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
  }).join("");

  var fold = document.getElementById("pv-fold");
  fold.addEventListener("click", function () {
    var on = root.getAttribute("data-pvfold") === "1";
    root.setAttribute("data-pvfold", on ? "0" : "1");
    fold.setAttribute("aria-expanded", String(on));
    fold.textContent = on ? "收起" : "切換條";
  });

  apply(state[D.param], false);
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  /* 保險絲：站上那幾支「開頁量一次」的腳本在 4G 上比面板慢 */
  var n = 0, t = setInterval(function () { measure(); if (++n > 10) clearInterval(t); }, 400);
})();
</script>
`;
  /* ⚠ 這一站的註解裡就寫著 body 的結束標籤，String.replace 會換到註解裡那一個 */
  const iB = html.lastIndexOf("</body>");
  if (iB < 0) throw new Error(`${spec.key}：找不到 body 結尾`);
  html = html.slice(0, iB) + BAR + html.slice(iB);

  /* ---------- 6. 守門 ---------- */
  /* ⚠ 掃整頁等於沒掃（DECISIONS.md 那張坑表第 4 條）：切換條那支腳本裡面
     也寫著同樣那幾個字串，要先切出「三個處境那一塊」再數。 */
  const introAt = html.indexOf('<div class="tp-intro">');
  const introEnd = html.indexOf('<div class="tp-first">', introAt);
  if (introAt < 0 || introEnd < 0) throw new Error(`${spec.key}：切不出介紹那一塊`);
  const intro = html.slice(introAt, introEnd);
  const script = BAR.slice(BAR.indexOf("<script>") + 8, BAR.lastIndexOf("</scr" + "ipt>"));
  const guards = [
    ["沒有 noindex", !html.includes("noindex")],
    ["還留著指向正式網址的 canonical", /rel="canonical"/.test(html)],
    ["還留著 JSON-LD（指向還沒上線的東西）", /application\/ld\+json/.test(html)],
    ["還留著 data-views-self（會灌計數）", /data-views-self/.test(html)],
    ["切換條掉到 head 裡了", html.indexOf('class="pv-bar"') < html.indexOf("</head>")],
    ["這三科的標記還指向正式站", new RegExp(`href="/topics/(${SPECS.map((s) => s.key).join("|")})/"`).test(html)],
    ["另外四科的標記被動到了", !/href="\/topics\/perio\/"/.test(html)],
    ["預設那一句沒有進版面裡", !intro.includes(spec.cands[0].html)],
    ["介紹那一塊的 dd.tp-reply 不只一個（:last-of-type 會量錯）",
      (intro.match(/dd class="tp-reply"/g) || []).length !== 1],
    ["介紹那一塊還是 ul（沒換成 dl）", !/<dl class="tp-cases">/.test(intro)],
    ["處境的數目對不上", (intro.match(/dt class="tp-case"/g) || []).length !== cases.length],
    ["面板的腳本編不過", (() => { try { new Function(script); return false; } catch { return true; } })()],
  ];
  const bad = guards.filter((g) => g[1]).map((g) => g[0]);
  if (bad.length) throw new Error(`${spec.key} 守門沒過：\n  - ` + bad.join("\n  - "));

  const dir = path.join(ROOT, "preview", spec.out);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(`✓ preview/${spec.out}/index.html　${(html.length / 1024).toFixed(0)} KB　(${spec.label})`);
}
