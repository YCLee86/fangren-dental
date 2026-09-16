#!/usr/bin/env node
/* 櫃檯那張小立牌的文字改版 → preview/line-stand/
 *   node drafts/channels/stand-card.mjs      （--check 只比對不寫檔）
 *
 * 2026-09-16 使用者：「這個是廠商先前提供的小告示版。要替換成新的版面，文字和 QRcode
 *   的位置大致沒什麼問題，風格和圖案預計換成診所網站和先前一致風格的人物。
 *   先處理文字部分。」
 *
 * ⚠⚠ 文字的唯一出處是 stand-card.json —— 這一支只做排版，一個字都不在這裡打。
 *   要改字改那一份再重跑；守門 check-stand-card.mjs 會重跑一次逐位比對。
 *
 * ⚠⚠⚠ 字級不是手挑的，是一條規則算出來的：
 *       主文字高 ＝ min(卡寬的 6%, 版心 84% ÷ 最長那一行的全形當量字數)
 *   —— 也就是「讓最長那一行剛好撐滿版心，但不超過 6%」。
 *   這樣四案比的才是**文字本身**（字少的自動變大），不是我替每一案挑的字級。
 *   ⚠ 這條規則拿現況驗過：現況最長那一行 21 個字 → 算出 4.0% 卡寬，
 *     和照片上量到的 4.0% 相同。
 *
 * ⚠⚠⚠ 抬頭那一行也是一條規則算的（2026-09-16 使用者指定抬頭寫「芳仁牙醫有 LINE 囉」、
 *   LINE 用綠泡泡框起來）：
 *       抬頭字高 ＝ min(卡寬的 8.5%, 版心 84% ÷ (全形當量 ＋ 字距 ＋ 泡泡的左右內距))
 *   —— 泡泡會把那一行撐寬，不把它算進去的話，抬頭會**靜靜地溢出卡片**（卡片 overflow:hidden，
 *   畫面上只是最後一個字不見了，而每一道尺寸守門都會過）。所以那兩項要出現在算式裡，
 *   而且**要和 CSS 那兩個值對得起來**（`--hd-ls`、`--li-pad`，兩邊只有一份出處）。
 *   ⚠ 抬頭是 `nowrap` —— 放不下要被守門擋下來，不可以靜靜地折成兩行。
 *   ⚠⚠ 那顆綠泡泡是**用 CSS 畫的示意**，不是 LINE 官方的標誌檔；印之前要照
 *   LINE 的標誌使用規範換成正式的（那是待答的一題，頁面上寫著）。
 *   ⚠ 現況那一張的「LINE」**刻意不套泡泡** —— 那一張是照片上逐字抄的，加工就不是對照了。
 *
 * ⚠ 這一頁**零 JS**。字寬不在這裡量、用全形當量算 —— 這個容器沒有 Noto Sans TC，
 *   量出來的字寬會比實際寬約一成（CLAUDE.md 第五十九節），拿來判斷「放不放得下」是假的。
 *
 * ⚠ 那四張卡是用 CSS 排的，**不是完稿**：這一輪只處理文字，插圖與版面下一輪。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-stand");
const CHECK = process.argv.includes("--check");
export const S = JSON.parse(readFileSync(join(HERE, "stand-card.json"), "utf8"));

/* ── 全形當量字數：半形算 0.5（「LINE」＝ 2 個全形的寬度） ─────────── */
export const cw = (s) => [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1 : 0.5), 0);

/* ── 那一張卡上所有會被印出來的字（紅線掃描與字級規則都吃這一份） ──── */
export const lines = (c) => [c.抬頭, c.副標, ...c.主文, c.QR上, c.QR下, c.帶子 ?? ""].filter(Boolean);

const CARD = S.卡片;
const MAXFS = 0.06;                                  /* 主文字高的上限（佔卡寬） */
export const fsOf = (c) => {
  const w = Math.max(...c.主文.map(cw));
  return { 最長: w, fs: Math.min(MAXFS, CARD.版心 / w) };
};

/* ── 抬頭：同一條規則，但要把字距與那顆綠泡泡的左右內距一起算進去 ──── */
export const HDLS = 0.04;        /* 抬頭的 letter-spacing（em）—— CSS 那一行吃同一個值 */
export const LIPAD = 0.26;       /* 綠泡泡左右各留多少（em）—— 同上 */
const HDMAX = 0.085;             /* 抬頭字高的上限（佔卡寬） */
export const hdOf = (c) => {
  const t = String(c.抬頭);
  const pill = c === S.現況 ? 0 : (t.match(/LINE/g) ?? []).length;   /* 現況不套泡泡 */
  const w = cw(t) + HDLS * [...t].length + LIPAD * 2 * pill;
  return { 寬: +w.toFixed(3), fs: Math.min(HDMAX, CARD.版心 / w), 泡泡: pill };
};

/* ── 紅線：只掃卡片上的字 ───────────────────────────────────────── */
export const redOf = (c) => {
  const t = lines(c).join("\n");
  return S.紅線.詞.filter((r) => t.includes(r.字));
};

/* ── 面板的數字（算的，不是量的） ───────────────────────────────── */
export const rows = [{ 標籤: "現況（廠商那一版）", ...S.現況, id: "now" }, ...S.案].map((c) => {
  const { 最長, fs } = fsOf(c);
  return {
    id: c.id, 標籤: c.標籤, 行數: c.主文.length, 最長,
    字高mm: +(CARD.寬mm * fs).toFixed(2),
    佔卡寬: +(最長 * fs * 100).toFixed(1),
    紅線: redOf(c),
  };
});

/* ── HTML ───────────────────────────────────────────────────────── */
/* ⚠⚠ 「第 N 題」不可以寫死 —— 待答那一組增刪一題，寫死的那個數字就會靜靜地指到別題去。
 *   資料裡寫 {{題:關鍵字}}，這裡現算；找不到或找到不只一題就 throw。 */
export const qn = (kw) => {
  const hit = S.待答.map((d, i) => [d, i]).filter(([d]) => d.標.includes(kw));
  if (hit.length !== 1) throw new Error("{{題:" + kw + "}} 在待答裡找到 " + hit.length + " 題");
  return hit[0][1] + 1;
};
export const cn = (kw) => {
  const hit = S.拆解.map((d, i) => [d, i]).filter(([d]) => d.標.includes(kw));
  if (hit.length !== 1) throw new Error("{{條:" + kw + "}} 在拆解裡找到 " + hit.length + " 條");
  return hit[0][1] + 1;
};
const fill = (t) => String(t)
  .replace(/\{\{題:([^}]+)\}\}/g, (_, k) => String(qn(k)))
  .replace(/\{\{條:([^}]+)\}\}/g, (_, k) => String(cn(k)));
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
/* **粗體** 與 `等寬`；資料裡不放 HTML */
const b = (s) => esc(fill(s)).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
/* ⚠ 這幾份 JSON 裡的文字是「一行一行折好的原始碼」，不是一行一段 ——
 *   空字串才是分段。所以要把連著的幾行接成同一段（照 CJK 的規矩直接相接、不補空白），
 *   一行一個 <p> 的話讀起來會變成一串短句。
 *   ⚠ 一段的第一行以 > 開頭 ＝ 整段是引文。 */
const para = (a) => {
  const src = Array.isArray(a) ? a : [a];
  const out = []; let cur = [];
  const flush = () => {
    if (!cur.length) return;
    const q = /^\s*>/.test(cur[0]);
    const t = cur.map((x) => x.replace(/^\s*>\s?/, "")).join("");
    out.push(q ? `<p class="q">${b(t)}</p>` : `<p>${b(t)}</p>`);
    cur = [];
  };
  for (const l of src) {
    const t = String(l);
    if (!t.trim()) { flush(); continue; }
    if (cur.length && /^\s*>/.test(t) !== /^\s*>/.test(cur[0])) flush();
    cur.push(t);
  }
  flush();
  return out.join("\n");
};

/* ⚠⚠ 資料裡不放 HTML（那條規矩沒有變）—— 泡泡是這裡套上去的，套的是 esc 過的字。 */
const pill = (t) => esc(t).replace(/LINE/g, '<span class="li">LINE</span>');

const card = (c, now = false) => {
  const { fs } = fsOf(c);
  const hd = hdOf(c);
  const f = (k) => `calc(var(--cw) * ${k})`;
  return `<div class="card${now ? " now" : ""}">
  <div class="hd" style="font-size:${f(hd.fs.toFixed(4))}">${now ? esc(c.抬頭) : pill(c.抬頭)}</div>
  ${c.副標 ? `<div class="sub" style="font-size:${f(0.05)}">${esc(c.副標)}</div>` : ""}
  <div class="bd" style="font-size:${f(fs.toFixed(4))}">${c.主文.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
  ${c.QR上 ? `<div class="cue" style="font-size:${f(0.038)}">${esc(c.QR上)}</div>` : ""}
  <div class="qr"><span>QR</span></div>
  ${c.QR下 ? `<div class="cue lo" style="font-size:${f(0.036)}">${esc(c.QR下)}</div>` : ""}
  <div class="band${c.帶子 ? "" : " empty"}" style="font-size:${f(0.04)}">${esc(c.帶子 ?? "")}</div>
</div>`;
};

const 拆解 = S.拆解.map((d, i) =>
  `<div class="it"><p class="t"><span class="n">${i + 1}</span>${b(d.標)}</p>${para(d.文)}</div>`).join("\n");

const 案 = S.案.map((c) => `<div class="one">
<p class="lb">${esc(c.標籤)}</p>
${card(c)}
<div class="note">${para(c.註)}</div>
</div>`).join("\n");

const tbl = `<table><thead><tr><th>　</th><th>主文行數</th><th>最長一行</th>
<th>字可以多大</th><th>那一行佔卡寬</th><th>紅線</th></tr></thead><tbody>${
  rows.map((r) => `<tr${r.id === "now" ? ' class="nowr"' : ""}><th>${esc(r.標籤)}</th>
<td>${r.行數}</td><td>${r.最長} 字</td><td>${r.字高mm} mm</td><td>${r.佔卡寬}%</td>
<td class="${r.紅線.length ? "bad" : "ok"}">${r.紅線.length ? r.紅線.map((x) => esc(x.字)).join("、") : "0"}</td></tr>`).join("\n")
}</tbody></table>`;

const 待答 = S.待答.map((d, i) =>
  `<li><b>${b(d.標)}</b><br>${b(d.文)}</li>`).join("\n");

const HTML = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>櫃檯的小立牌　文字改版（四案）</title>
<style>
:root{--paper:#e2e5e6;--card:#f4f4f5;--ink:#2a2c27;--soft:#5c5f57;--rule:#c9ccc9;
  --brick:#8c3b32;--green:#3f654a;--cw:300px;--hd-ls:${HDLS}em;--li-pad:${LIPAD}em}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font:16px/1.75 "Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:760px;margin:0 auto;padding:26px 14px 72px}
h1{font-size:1.3rem;line-height:1.5;margin:0 0 .3em}
.lede{color:var(--soft);font-size:.92rem;margin:0 0 1.4em}
.h2{font-size:1.04rem;margin:2.3em 0 .6em;padding-top:1em;border-top:1px solid var(--rule)}
.h2 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.25em}
p{margin:.5em 0}
.box{background:var(--card);border-radius:11px;padding:13px 15px;font-size:.93rem}
.box p:first-child{margin-top:0}.box p:last-child{margin-bottom:0}
.q{border-left:3px solid var(--rule);padding-left:.8em;color:var(--soft);font-size:.9rem}
code{font-size:.86em;background:#dfe3e4;border-radius:4px;padding:.05em .35em}

/* ── 那張卡（CSS 排的，不是完稿） ─────────────────────────────── */
.cards{display:flex;flex-wrap:wrap;gap:22px;margin:.6em 0 0}
.one{flex:1 1 var(--cw);max-width:var(--cw)}
.lb{font-weight:600;font-size:.95rem;margin:0 0 .45em}
.card{--pad:calc(var(--cw) * .06);width:var(--cw);aspect-ratio:${CARD.寬mm} / ${Math.round(CARD.寬mm * CARD.比例)};
  background:#fff;border-radius:7px;box-shadow:0 1px 3px rgba(0,0,0,.14);
  padding:var(--pad) var(--pad) 0;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  color:#333;line-height:1.5;overflow:hidden}
.card .hd{font-weight:700;letter-spacing:var(--hd-ls);white-space:nowrap}
/* ⚠ 那顆綠泡泡是示意，不是 LINE 官方的標誌檔（\#06C755 是 LINE 的品牌綠）。
   左右內距與上面那個字距，抬頭的字級規則算過一模一樣的值 —— 改這裡要一起改那邊。 */
.card .li{display:inline-block;background:#06C755;color:#fff;
  border-radius:.26em;padding:0 var(--li-pad);
  letter-spacing:.02em;line-height:1.3;vertical-align:-.06em}
.card .sub{margin-top:.25em;color:#444}
.card .bd{margin-top:calc(var(--cw) * .08);width:100%}
.card .bd p{margin:.28em 0;white-space:nowrap}
.card .cue{margin-top:calc(var(--cw) * .07);color:#555}
.card .cue.lo{margin-top:calc(var(--cw) * .03)}
.card .qr{width:calc(var(--cw) * ${CARD.QR佔卡寬});aspect-ratio:1;margin-top:calc(var(--cw) * .04);
  background:repeating-linear-gradient(45deg,#dcdcdc 0 6px,#ececec 6px 12px);
  border-radius:3px;display:flex;align-items:center;justify-content:center}
.card .qr span{font-size:.72rem;color:#8a8a8a;letter-spacing:.1em}
.card .band{margin:auto calc(var(--pad) * -1) 0;width:var(--cw);padding:calc(var(--cw) * .026) 0;
  background:#3c4657;color:#fff;letter-spacing:.03em}
.card .band.empty{background:transparent;border-top:1px dashed #d5d5d5;color:transparent}
.card.now .bd p{white-space:normal}
.note{font-size:.86rem;color:var(--soft);margin:.6em 0 0}
.note p{margin:.35em 0}

/* ── 拆解 ─────────────────────────────────────────────────────── */
.it{background:var(--card);border-radius:11px;padding:12px 15px;margin:.7em 0;font-size:.93rem}
.it .t{font-weight:600;margin:0 0 .3em}
.it .n{display:inline-block;min-width:1.5em;color:var(--brick);font-weight:700}
.it p{margin:.35em 0}

table{border-collapse:collapse;width:100%;font-size:.86rem;margin:.6em 0 0;
  background:var(--card);border-radius:10px;overflow:hidden}
th,td{padding:.5em .6em;text-align:center;border-bottom:1px solid var(--rule)}
thead th{font-weight:600;font-size:.8rem;color:var(--soft)}
tbody th{text-align:left;font-weight:600}
tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}
.nowr th,.nowr td{color:var(--soft)}
.bad{color:var(--brick);font-weight:700}
.ok{color:var(--green)}
ol.ask{padding-left:1.4em;font-size:.93rem}
ol.ask li{margin:.7em 0}
.foot{margin-top:2.6em;padding-top:1em;border-top:1px solid var(--rule);
  font-size:.82rem;color:var(--soft)}
@media (max-width:719px){:root{--cw:min(300px,88vw)}.one{max-width:none}}
</style>
</head>
<body>
<div class="wrap">

<h1>櫃檯的小立牌　文字改版</h1>
<p class="lede">這一輪<b>只處理文字</b>（插圖與版面下一輪）。底下那四張卡是用網頁排的，
<b>不是完稿</b> —— 字級是用一條規則自動算的，四案比的是文字本身。</p>

<p class="h2">現況那一張<span class="t">照片上逐字抄的，一個字都沒有改寫</span></p>
<div class="cards"><div class="one">${card(S.現況, true)}</div>
<div class="one"><div class="box">
${para(CARD._量法)}
</div></div></div>

<p class="h2">那個 QR 掃出來是什麼<span class="t">拿解碼器掃過，不是用眼睛看的</span></p>
<div class="box"><p><code>${esc(S.QR.內容)}</code></p>${para(S.QR.說明)}</div>

<p class="h2">為什麼要改<span class="t">六件，每一件都有出處</span></p>
${拆解}

<p class="h2">四案<span class="t">形狀不一樣，不只是換字</span></p>
<p class="lede">抬頭四案相同：<b>${pill(S.案[0].抬頭)}</b>（使用者 2026-09-16 指定的逐字）。
⚠ 那顆綠色泡泡是<b>用網頁畫的示意</b>，不是 LINE 官方的標誌檔 ——
印之前要照 LINE 的標誌使用規範換成正式的（見底下第 ${qn("泡泡")} 題）。</p>
<div class="cards">${案}</div>

<p class="h2">字可以多大<span class="t">字少的自動變大 —— 這是四案真正的差別之一</span></p>
<div class="box"><p>主文字高 ＝ <b>min(卡寬的 6%，版心 84% ÷ 最長那一行的字數)</b>，
也就是「讓最長那一行剛好撐滿版心，但不超過 6%」。四案用同一條規則，所以底下這張表比的是
<b>文字本身</b>，不是我替每一案挑的字級。</p>
<p>⚠ <b>版心那個 84% 就是從現況那一行量來的</b>（最長那一行 22 個全形字、佔卡片寬度 84%），
所以現況那一列是這條規則的<b>定義</b>、不是驗證。四案之間的比較仍然成立 —— 它們吃同一條規則。</p>
<p>⚠ <b>抬頭另算一條</b>：min(卡寬的 8.5%，版心 84% ÷ (全形當量 ＋ 字距 ＋ 泡泡的左右內距))。
那顆泡泡會把那一行撐寬 ${(LIPAD * 2 * 100).toFixed(0)}% 個字，不算進去的話抬頭會靜靜地溢出卡片
（卡片是 <code>overflow:hidden</code>，畫面上只會少掉最後一個字）。
四案的抬頭都是 <b>${(hdOf(S.案[0]).fs * CARD.寬mm).toFixed(2)} mm</b>。</p>
<p>⚠ 字高是照卡片寬 ${CARD.寬mm} mm 換算的（那個數字還要用尺量一次，見底下第 ${qn("尺寸")} 題）。
櫃檯是站著看的，一般建議內文不要小於 3.5 mm。</p></div>
${tbl}
<div class="note">${para(S.紅線._說明)}</div>

<p class="h2">還沒有答案的</p>
<ol class="ask">
${待答}
</ol>

<p class="foot">文字的唯一出處是 <code>drafts/channels/stand-card.json</code>；
這一頁由 <code>node drafts/channels/stand-card.mjs</code> 產生、
<code>node drafts/channels/check-stand-card.mjs</code> 守門。<b>不要手改這一頁。</b></p>

</div>
</body>
</html>
`;

if (import.meta.url === `file://${process.argv[1]}`) {
  const f = join(OUT, "index.html");
  if (CHECK) {
    if (!existsSync(f)) throw new Error("preview/line-stand/index.html 還沒產生");
    if (readFileSync(f, "utf8") !== HTML) throw new Error("preview/line-stand/index.html 和產生器對不起來 —— 有人手改了頁面，或改了 JSON 卻沒有重跑");
    console.log("✓ 逐位相同");
  } else {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(f, HTML);
    console.log("寫出 preview/line-stand/index.html");
  }
  const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - cw(String(s)) * 2));
  console.log("");
  console.log(pad("", 26) + pad("行數", 8) + pad("最長一行", 12) + pad("字高", 10) + pad("佔卡寬", 10) + "紅線");
  for (const r of rows)
    console.log(pad(r.標籤, 26) + pad(r.行數, 8) + pad(r.最長 + " 字", 12) +
      pad(r.字高mm + " mm", 10) + pad(r.佔卡寬 + "%", 10) +
      (r.紅線.length ? r.紅線.map((x) => x.字).join("、") : "0"));
  console.log("");
  for (const c of [S.現況, ...S.案].filter((x, i, a) => a.findIndex((y) => y.抬頭 === x.抬頭) === i)) {
    const h = hdOf(c);
    console.log(`抬頭「${c.抬頭}」${(h.fs * CARD.寬mm).toFixed(2)} mm・佔卡寬 ${(h.寬 * h.fs * 100).toFixed(1)}%` +
      (h.泡泡 ? `（含綠泡泡的左右內距 ${(LIPAD * 2).toFixed(2)} 個字）` : "（沒有泡泡）"));
  }
  console.log("");
  console.log(`卡片 ${CARD.寬mm} mm 寬・比例 ${CARD.比例}（${Math.round(CARD.寬mm * CARD.比例)} mm 高）—— 從照片量的，還要用尺量一次`);
  console.log(`QR ＝ ${S.QR.內容}（兩張照片各自解過一次）`);
  console.log("");
}
