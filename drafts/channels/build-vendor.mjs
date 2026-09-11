#!/usr/bin/env node
// 廠商對接的那一頁 → preview/line-vendor/index.html
//
// ⚠⚠ 這一頁「不放任何一則訊息的文字」—— 七則的字各有出處（六份 Flex JSON ＋
//    auto-reply.txt）且各自有守門，抄進來就是第八個真相。這裡只放三種東西：
//    現在有哪幾則在跑（事實）／對方說了什麼、那句話真不真（判斷）／還沒有答案的（清單）。
//
// ⚠ 資料的唯一出處是 vendor-log.json，這一支只做排版。改內容改 JSON 再重跑。
// ⚠ 零 JS（守門連 script 標籤都擋）。
//
// 跑完驗：node drafts/channels/check-vendor.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-vendor");

const D = JSON.parse(readFileSync(join(HERE, "vendor-log.json"), "utf8"));

const esc = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* 一段字裡的「⚠」與「⛔」開頭那一句標成警示色，其餘照原樣 */
const mark = (t) =>
  esc(t).replace(/(⚠+|⛔|⭐)/g, '<b class="m">$1</b>');

const CSS = `
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;
  --green:#2c5238;--brick:#89202d;--blue:#2a4677}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:780px;margin:0 auto;padding:26px 14px 72px}
h1{font-size:1.34rem;line-height:1.5;margin:0 0 .3em}
.lede{color:var(--soft);font-size:.94rem;margin:0 0 1.4em}
.h2{font-size:1.06rem;margin:2.6em 0 .5em;padding-top:1.1em;border-top:1px solid var(--rule)}
.h2 .t{display:block;font-size:.8rem;font-weight:400;color:var(--soft);margin-top:.25em}
h3{font-size:.9rem;color:var(--soft);font-weight:600;margin:1.6em 0 .4em}
.m{color:var(--brick);font-weight:600}
.note,.warn{font-size:.9rem;background:var(--card);border-radius:9px;padding:.75em .9em;margin:.7em 0}
.warn{background:#eee5e6}
.now{background:var(--card);border-radius:11px;padding:14px 15px;margin:0 0 .6em;font-size:.95rem}
.now ol{margin:.4em 0 0;padding-left:1.25em}
.now li{margin:.45em 0}
/* 表格一定要給 min-width —— 只寫 100% 的話外層那條 overflow-x 永遠用不到，
   手機上會被壓成一格三四個字 */
.scroll{overflow-x:auto}
table{width:100%;min-width:660px;border-collapse:collapse;font-size:.86rem;margin:.4em 0}
th,td{text-align:left;vertical-align:top;padding:.5em .45em;border-bottom:1px solid var(--rule)}
th{font-size:.78rem;color:var(--soft);font-weight:600;white-space:nowrap}
td.n{white-space:nowrap;color:var(--soft)}
td .s{color:var(--soft);font-size:.9em;display:block;margin-top:.2em}
.tag{display:inline-block;font-size:.74rem;padding:.1em .5em;border-radius:6px;
  border:1px solid var(--rule);white-space:nowrap}
.tag.ok{color:var(--green);border-color:#9db3a3}
.tag.warn{color:#7a5a18;border-color:#d0bc90}
.tag.bad{color:var(--brick);border-color:#c79aa0}
.rd{background:var(--card);border-radius:11px;padding:13px 15px;margin:.7em 0;font-size:.92rem}
.rd .d{font-size:.8rem;color:var(--soft);margin:0 0 .4em}
.rd p{margin:.45em 0}
.rd .q{color:var(--soft)}
.ev{border-top:1px solid var(--rule);padding:.9em 0 .2em;font-size:.92rem}
.ev .hd{font-weight:600}
.ev .hd .w{font-size:.76rem;color:var(--soft);font-weight:400;margin-left:.5em}
.ev p{margin:.35em 0}
.ask{list-style:none;margin:.3em 0 0;padding:0}
.ask li{padding:.7em 0;border-bottom:1px solid var(--rule);font-size:.93rem}
.ask .q{font-weight:600}
.ask .y{display:block;color:var(--soft);font-size:.87rem;margin-top:.25em}
.hot{color:var(--brick)}
.grp{margin:2em 0 0}
.grp .t{font-size:.95rem;font-weight:600;margin:0 0 .1em}
.grp .c{font-size:.8rem;color:var(--soft)}
.foot{margin:3em 0 0;padding-top:1.1em;border-top:1px solid var(--rule);
  font-size:.84rem;color:var(--soft);line-height:1.85}
a{color:#214d48}
`.trim();

/* ── ① 現在有哪幾則在跑 ─────────────────────────────────────── */
const assets = `
<table>
<thead><tr><th></th><th>訊息</th><th>什麼時候送</th><th>誰送</th><th>公版</th><th>改一個字要找誰</th></tr></thead>
<tbody>
${D.資產.列.map((r) => `<tr>
<td class="n">${esc(r.n)}</td>
<td>${esc(r.名)}<span class="s">${esc(r.狀態)}${r.備註 ? "・" + mark(r.備註) : ""}</span></td>
<td>${esc(r.時機)}</td><td>${esc(r.誰送)}</td><td>${esc(r.公版)}</td><td>${esc(r.改字)}</td>
</tr>`).join("\n")}
</tbody></table>`.trim();

/* ── ② 三封往返 ─────────────────────────────────────────────── */
const rounds = D.往返.map((r) => `<div class="rd">
<p class="d">${esc(r.日)}　${esc(r.誰)}</p>
<p class="q">他說：${mark(r.他說)}</p>
<p>我們：${mark(r.我們)}</p>
<p>${mark(r.判斷)}</p>
</div>`).join("\n");

/* ── ③ 逐句判真假 ───────────────────────────────────────────── */
const lines = `
<table>
<thead><tr><th>他說的</th><th>判斷</th><th>實際上是什麼</th></tr></thead>
<tbody>
${D.逐句.列.map((r) => `<tr>
<td>${esc(r.句)}</td>
<td><span class="tag ${esc(r.級)}">${esc(r.判)}</span></td>
<td>${mark(r.實)}</td>
</tr>`).join("\n")}
</tbody></table>`.trim();

/* ── ④ 別家帳號那幾張 ───────────────────────────────────────── */
const ev = D.證據.列.map((r) => `<div class="ev">
<p class="hd">${esc(r.家)}<span class="w">${esc(r.力)}</span></p>
<p>${mark(r.看到)}</p>
<p>${mark(r.證明)}</p>
</div>`).join("\n");

/* ── ⑤ 還沒有答案的，照「誰能答」分組 ───────────────────────── */
const groupKeys = ["廠商", "後台", "診所", "素材"];
const groups = groupKeys.map((k) => {
  const g = D.待答[k];
  const hot = g.列.filter((x) => x.急).length;
  return `<div class="grp">
<p class="t">${esc(g.標)}</p>
<p class="c">${g.列.length} 題${hot ? "・其中 " + hot + " 題最急" : ""}</p>
<ul class="ask">
${g.列.map((x) => `<li><span class="q${x.急 ? " hot" : ""}">${x.急 ? "⭐ " : ""}${mark(x.問)}</span>${
    x.為 ? `<span class="y">${mark(x.為)}</span>` : ""
  }</li>`).join("\n")}
</ul></div>`;
}).join("\n");

const total = groupKeys.reduce((n, k) => n + D.待答[k].列.length, 0);
const hotAll = groupKeys.reduce((n, k) => n + D.待答[k].列.filter((x) => x.急).length, 0);

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 廠商對接　現況與待答</title>
<style>
${CSS}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 廠商對接　現況與待答</h1>
<p class="lede">更新於 ${esc(D.更新日)}　這一頁不放任何一則訊息的文字，只放三件事：<br>
現在有哪幾則在跑、對方說了什麼而那句話真不真、還沒有答案的是什麼。</p>

<div class="now">
<b>現在卡在哪</b>
<ol>
<li><b>一件正在出錯</b>：約診紀錄查詢那張卡的日期被截斷，改一個設定就好。</li>
<li><b>一件不要送</b>：評價邀約 —— 那兩顆按鈕連到哪裡沒有答案之前先擱著。</li>
<li><b>一件五分鐘能做完</b>：對品御那個帳號打一句「早安」，看它回不回。</li>
</ol>
</div>

<h2 class="h2">① 這個帳號現在會自動送出哪幾則<span class="t">誰送、是不是公版、改一個字要找誰</span></h2>
<div class="scroll">${assets}</div>
<div class="warn">${mark(D.資產.缺口)}</div>

<h2 class="h2">② 和廠商的三封往返</h2>
${rounds}

<h2 class="h2">③ 對方講的每一句，真不真<span class="t">「做不到」一律先改寫成「誰做不到」</span></h2>
<div class="scroll">${lines}</div>

<h2 class="h2">④ 別家帳號那幾張的證據力<span class="t">拿出去之前先問：它證明的是哪一句話</span></h2>
${ev}
<div class="warn">${mark(D.證據.通則)}</div>

<h2 class="h2">⑤ 還沒有答案的 ${total} 題<span class="t">照「誰能答」分開　其中 ${hotAll} 題最急</span></h2>
${groups}

<p class="foot">
這一頁由 <code>node drafts/channels/build-vendor.mjs</code> 產生，資料在
<code>drafts/channels/vendor-log.json</code>。<br>
七則訊息的文字、圖檔與規格在另一頁：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);
console.log(`✓ preview/line-vendor/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  在跑的訊息 ${D.資產.列.length} 則・逐句判斷 ${D.逐句.列.length} 句・別家 ${D.證據.列.length} 家`);
console.log(`  待答 ${total} 題（廠商 ${D.待答.廠商.列.length}／後台 ${D.待答.後台.列.length}／診所 ${D.待答.診所.列.length}／素材 ${D.待答.素材.列.length}）・最急 ${hotAll} 題`);
