#!/usr/bin/env node
/* 給廠商的「待調整項目與規格」9/18 那一版 → preview/line-brief-0918/
 *
 * 2026-09-18 使用者：「1 尚未綁定按約診查詢、2 看診前 48 小時提醒已處理完，把這兩項
 *   歸到最下方的已完成項目／3 約診查詢原本的 9 個 logo 方案換成帶狀 logo，資料規格在
 *   /preview/line-single-card/，把完成的頁面抽取出來附上規格說明，附檔影片也放上去當示意／
 *   4 廠商僅針對品御牙醫的設定回覆，把他的回覆新增在 4-4-1 翔評回覆／
 *   整理成新的頁面給我看，原本的頁面不要動。」
 *
 * ⚠⚠⚠ **編號 1~4 一個都不換**（同 ①~⑫ 那一組）：那是雙方共用的詞，而且 4-4-1 這個
 *   標號只有在「4 還是 4、4-4 還是 4-4」的時候才指得到東西。所以 1 與 2 搬到已完成
 *   之後仍然叫 1 和 2，未定案那一塊剩下的是 3 和 4，不重新編成 1 和 2。
 *
 * ⚠⚠ 一個字都不重打：
 *   ・4-1~4-4、3-4（約診狀態）、3-5（日期）與 §4 其餘每一塊 —— 讀 brief.json（9/14 那一版）。
 *   ・卡上那幾行、字級、兩則的寬度、內距、底色、四個藥丸 —— build-vendor.mjs（出處又是
 *     booked-card.json ＋ vendor-log.json ＋ line-booked 那一頁）。
 *   ・帶子幾顆、套色在哪幾格、兩張 PNG 多大 —— single-card.mjs（出處又是 stand-card.json
 *     ＋ brand/shapes/ ＋ wm-sizes.json）。⚠ 那一支的出圖與寫檔關在「直接執行」底下，
 *     import 它不會重跑 Chromium、也不會改到 /preview/line-single-card/。
 *   ・已完成那六則 —— vendor-log.json 的「組 = done」。
 * ⚠ 圖一律引用隔壁資料夾那一份；這個資料夾裡只有 index.html ＋ 9/18 新拿到的那幾個檔
 *   （影片、它的封面、翔評 9/18 的三張回覆）。零 JS。
 *
 * ⚠⚠ 這一支同時寫出 drafts/channels/single-card-band.json（要交給廠商的那兩份 Flex）——
 *   那一份是**產生的、不要手改**：卡上的字從 booked-card.json 來，帶子的網址與顆數從
 *   single-card.mjs 來。publish-assets.mjs 掃 drafts/channels/*.json 收圖，所以那兩張
 *   帶子會跟著被複製到 assets/line/ 並上線。
 *
 * 跑完驗：node drafts/channels/check-brief2.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS, esc, b, D, DATE, 設節表,
  WM, cardLines, linesHtml, MEGA, MICRO, BUB, WCARD, CARD, PILLVAL, wmSvg, 輪, OFF,
} from "./build-vendor.mjs";
import { 定顆, 帶by, 卡, 輪播行, 帶高, 顆高, 基註, 套註, 藥丸 } from "./single-card.mjs";

/* 這一頁不用「見第 N 節」那種記號 —— 一被用到就 throw，不要靜靜地印出別頁的節號。 */
設節表({});

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-brief-0918");
const B1 = JSON.parse(readFileSync(join(HERE, "brief.json"), "utf8"));   /* 9/14 那一版的文字 */
const B = JSON.parse(readFileSync(join(HERE, "brief2.json"), "utf8"));   /* 這一輪新寫的 */
const ASSET = "https://fangren.net/assets/line/";
const 帶檔 = { mega: "band-18-set.png", car: "band-13-set.png" };
const 前綴 = "../line-single-card/";   /* 圖一律引用隔壁資料夾那一份，不複製第二份 */

/* ── 9/14 那一版的四件：照「標」找，不照位置 ─────────────────────────── */
const 件 = (標) => {
  const x = B1.未定案.find((r) => r.標 === 標);
  if (!x) throw new Error(`brief.json 的未定案裡找不到「${標}」—— 那四件的標題改了`);
  return x;
};
const 件3 = 件("約診通知與紀錄查詢版面"), 件4 = 件("綁定成功的自動回覆設定");
const 件1 = 件("尚未綁定按約診查詢"), 件2 = 件("看診前 48 小時提醒");
if (B.完成.length !== 2) throw new Error("brief2.json 的「完成」不是兩件");
/* 搬到已完成那兩件，標題要和 9/14 那一版逐字相同 —— 不然讀的人對不回上一版。 */
for (const [i, x] of [件1, 件2].entries())
  if (B.完成[i].標 !== x.標) throw new Error(`第 ${i + 1} 件的標題和 brief.json 對不上：${B.完成[i].標} ≠ ${x.標}`);

/* ── 圖：現場讀檔頭，不寫死 ─────────────────────────────────── */
const sizeOf = (rel) => {
  const f = join(OUT, rel);
  if (!existsSync(f)) throw new Error(`找不到圖：${rel}`);
  const x = readFileSync(f);
  if (x[0] === 0x89 && x[1] === 0x50) return [x.readUInt32BE(16), x.readUInt32BE(20)];
  for (let i = 2; i < x.length - 9;) {
    if (x[i] !== 0xff) { i++; continue; }
    const m = x[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return [x.readUInt16BE(i + 7), x.readUInt16BE(i + 5)];
    i += 2 + x.readUInt16BE(i + 2);
  }
  throw new Error(`${rel} 讀不出尺寸`);
};
const img = (rel, alt, scale = 1, lazy = true) => {
  const [w, h] = sizeOf(rel);
  return `<img src="${rel}" width="${w}" height="${h}"${
    scale !== 1 ? ` style="width:${Math.round(w / scale)}px"` : ""}${
    lazy ? ' loading="lazy"' : ""} alt="${esc(alt)}">`;
};

/* ── brief2.json 裡的 {{…}}：在這裡現算 ─────────────────────────── */
const V = {
  單張卡寬: String(BUB.mega), 輪播卡寬: String(BUB.car), 內距: String(CARD.pad),
  底色: WCARD.toUpperCase(), 階: BUB.階, 日期: DATE.例,
  單張顆數: String(定顆.mega), 輪播顆數: String(定顆.car),
  浮水印張數: String(WM.length * 2),
};
const fill = (t) => String(t).replace(/\{\{([^}:]+)(?::([^}]+))?\}\}/g, (_, k, a) => {
  if (k === "圖") {
    if (!existsSync(join(ROOT, "assets", "line", a))) throw new Error(`assets/line/${a} 不在`);
    return ASSET + a;
  }
  if (!(k in V)) throw new Error(`brief2.json 用到不存在的值 {{${k}}}`);
  return V[k];
});
const bb = (t) => b(fill(t));
const list = (rows) => `<ul class="spec">${rows.map((t) => `<li>${bb(t)}</li>`).join("\n")}</ul>`;
const h3 = (id, t, sub = "") => `<h3 class="h3" id="${id}">${t}${sub ? `<span class="t">${sub}</span>` : ""}</h3>`;

/* ── 兩張帶子：這一頁只是「拿來用」，尺寸從 single-card.mjs 那一份讀 ───── */
for (const k of ["mega", "car"]) {
  const a = 帶by[帶檔[k]];
  if (!a) throw new Error(`single-card.mjs 沒有產 ${帶檔[k]}`);
  const 該 = k === "mega" ? 定顆.mega : 定顆.car;
  if (a.B.顆數 !== 該) throw new Error(`${帶檔[k]} 是 ${a.B.顆數} 顆，該是 ${該} 顆`);
  if (a.w > 1024 || a.h > 1024) throw new Error(`${帶檔[k]} ${a.w}×${a.h} 超過 LINE 的 1024×1024`);
  /* 這兩張要真的上線，廠商才引用得到 —— 而且要和 preview/line-single-card/ 那一份逐位相同 */
  const p = join(ROOT, "assets", "line", 帶檔[k]);
  if (!existsSync(p)) throw new Error(`assets/line/${帶檔[k]} 還沒放上去 —— 跑 node drafts/channels/publish-assets.mjs`);
  if (!readFileSync(p).equals(a.buf)) throw new Error(`assets/line/${帶檔[k]} 和 preview/line-single-card/ 那一份對不上 —— 重跑 publish-assets.mjs`);
}
const 帶說 = (k) => {
  const a = 帶by[帶檔[k]], w = k === "mega" ? BUB.mega : BUB.car;
  return `${a.B.顆數} 顆・圖檔 ${a.w}×${a.h}px・畫在卡上 ${帶高(a, w).toFixed(1)}px 高`
    + `（最高那一顆 ${顆高(a, w).toFixed(1)}px）`;
};

/* ── 要交出去的那兩份 Flex：從 booked-card.json 的那幾行現組，不重打 ──── */
const 文字節點 = (key) => {
  const BK = JSON.parse(readFileSync(join(HERE, "booked-card.json"), "utf8"));
  const bubble = key === "約診紀錄查詢" ? BK[key].contents[0] : BK[key];
  const box = bubble.body.contents.find((c) => c.type === "box");
  const rows = box.contents.filter((c) => c.type === "text").map((t) => JSON.parse(JSON.stringify(t)));
  if (!rows.length) throw new Error(`booked-card.json 的「${key}」裡一行字都沒有`);
  return rows;
};
/* ⚠⚠ 切在**日期那一行後面**（兩則都是第 2 行）—— 和 single-card.mjs 同一個切法；
   底下在驗那一行真的是日期，那幾行的順序哪天換了要當場停下來。 */
const 切 = 2;
const 拆 = (rows) => {
  const d = rows[切 - 1];
  if (!d || d.text !== "{{date}}") throw new Error(`第 ${切} 行不是日期那一行 —— 帶子會夾在別的地方`);
  return [rows.slice(0, 切), rows.slice(切)];
};
const 帶節點 = (k) => ({
  type: "image", url: ASSET + 帶檔[k], size: "full", aspectMode: "fit",
  aspectRatio: `${帶by[帶檔[k]].w}:${帶by[帶檔[k]].h}`,
});
const 塊 = (rows) => ({
  type: "box", layout: "vertical", paddingAll: `${CARD.pad}px`,
  contents: rows.map((r, i) => (i === 0 ? (({ margin, ...rest }) => rest)(r) : r)),
});
const 狀態列 = {
  type: "box", layout: "horizontal", alignItems: "baseline",
  contents: [
    { type: "text", text: "約診狀態", size: "xs", color: "#5C5F57", flex: 0 },
    { type: "box", type2: undefined, layout: "vertical", flex: 0, backgroundColor: "{{status_color}}",
      cornerRadius: "8.5px", paddingTop: "5px", paddingBottom: "5px",
      paddingStart: "8px", paddingEnd: "8px", margin: "9px",
      contents: [{ type: "text", text: "{{status}}", size: "xs", weight: "bold", color: "#FFFFFF" }] },
    { type: "filler" },
  ],
};
delete 狀態列.contents[1].type2;
const 單張JSON = (() => {
  const [上, 下] = 拆(文字節點("預約成功通知"));
  return { type: "bubble", size: "mega",
    body: { type: "box", layout: "vertical", paddingAll: "0px", backgroundColor: WCARD.toUpperCase(),
      contents: [塊(上), 帶節點("mega"), 塊(下)] } };
})();
const 輪播JSON = (() => {
  const [上, 下] = 拆(文字節點("約診紀錄查詢"));
  if (下.length) throw new Error("約診紀錄查詢那一則的日期後面還有字 —— 底下那一塊該只有約診狀態");
  const 日 = 上[切 - 1];
  日.text = "{{date_two_lines}}";
  return { type: "carousel", contents: [{ type: "bubble", size: BUB.階,
    body: { type: "box", layout: "vertical", paddingAll: "0px", backgroundColor: WCARD.toUpperCase(),
      contents: [塊(上), 帶節點("car"), { ...塊([]), contents: [狀態列] }] } }] };
})();
const FLEX = {
  _說明: "約診卡・單一版型（帶子壓在約診時間底下）要交給廠商的那兩份 Flex。"
    + "⚠⚠ 這一份是 build-brief2.mjs **產生的，不要手改** —— 卡上的字出自 booked-card.json、"
    + "帶子的顆數與網址出自 single-card.mjs（再上去是 stand-card.json 與 wm-sizes.json）。"
    + "⚠ 它取代 booked-card.json 那兩則的**版面**（九顆浮水印那一版）；文字一個字都沒有換。"
    + "要填的值：{{patient}} 病人姓名／{{date}} 日期（單張一行）／{{date_two_lines}} 日期"
    + "（輪播，中間帶一個換行）／{{status}} 約診狀態的四個值之一／{{status_color}} 那個值的底色。",
  預約成功通知: 單張JSON,
  約診紀錄查詢: 輪播JSON,
};

/* ── 已完成 ──────────────────────────────────────────────────── */
/* ⚠⚠ 抬頭那一塊的 1~4 和那十二則的 ①~⑫ 是**兩套編號**（① 是招呼圖卡，不是
   「尚未綁定按約診查詢」）—— 兩套都是雙方共用的詞，所以兩個都印，而且圈號
   要從 vendor-log 那一列**現找**，不要在這裡手寫一個。 */
const 訊息號 = (標) => {
  const r = D.訊息.列.find((x) => x.未定案 === 標);
  if (!r) throw new Error(`vendor-log 裡沒有一則宣告自己屬於「${標}」`);
  return r.n;
};
const SPEC_ANCHOR = { "①": "m1", "②": "m2", "⑨": "m6", "⑩": "m7", "⑪": "m8", "⑫": "m9" };
const specPage = readFileSync(join(ROOT, "preview", "line-spec", "index.html"), "utf8");
const DONE = D.訊息.列.filter((r) => r.組 === "done");
for (const r of DONE) {
  const a = SPEC_ANCHOR[r.n];
  if (!a || !specPage.includes(`id="${a}"`)) throw new Error(`${r.n} 在 line-spec 上找不到錨點`);
}

/* ── 頁面 ────────────────────────────────────────────────────── */
const 卡格 = (html, 說) => `<figure class="swrap">${html}<figcaption>${說}</figcaption></figure>`;
const CSS2 = `
/* ⚠⚠⚠ 未定案那一塊剩下 3 和 4，**編號不重編**（4-4-1 這個標號只有在 4 還是 4 的時候
   才指得到東西）。那一塊的號碼是 CSS 的 counter 畫的，而 li 的 value 屬性對 counter
   一點作用都沒有 —— 只寫 value 的話 HTML 看起來對，畫出來仍然是 1、2（踩過）。
   所以要從 2 起跳，讓第一個 counter-increment 把它加成 3；value 一起寫著，
   是給不吃 CSS 的地方（複製貼上、朗讀）用的。
   ⚠ 這一段寫在樣板字串裡面，所以註解裡不可以出現反引號（這一站第八次）。 */
.now>ol{counter-reset:n 2}
.h3 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.2em}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:16px 14px;margin:.9em 0 0}
.pair figure{margin:0}
.pair img{display:block;max-width:100%;height:auto;border-radius:10px}
.pair figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.4em}
.pair .k{font-size:.88rem;font-weight:600;color:var(--ink);margin:0 0 .35em}
.sgrid{display:flex;flex-wrap:wrap;gap:20px 16px;margin:1em 0 0;align-items:flex-start}
.swrap{margin:0}
.sgl{overflow:hidden;box-sizing:content-box}
.sgl.car .cb p{white-space:pre-line}
.sgl .bnd{display:block;width:100%;height:auto}
.sgl .cb.bot>:first-child{margin-top:0}
.swrap figcaption{font-size:.76rem;color:var(--soft);line-height:1.6;margin-top:.35em;max-width:300px}
.swrap figcaption b{color:var(--ink)}
.vid{margin:1em 0 0;display:flex;flex-wrap:wrap;gap:12px 20px;align-items:flex-start}
.vid video{width:250px;max-width:100%;height:auto;border-radius:12px;background:#111;display:block}
.vid figcaption{font-size:.82rem;color:var(--soft);line-height:1.7;max-width:360px}
pre.json{background:#fff;border:1px solid var(--rule);border-radius:9px;padding:10px 12px;
  font-size:.76rem;line-height:1.55;overflow-x:auto;margin:.9em 0 0}
.refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px 14px;margin:.9em 0 0}
.refs figure{margin:0}
.refs img{display:block;width:100%;max-width:320px;height:auto;border-radius:10px}
.refs .k{font-size:.88rem;font-weight:600;margin:0 0 .35em}
.refs figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.4em;max-width:320px}
.done{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:9px;margin:.8em 0 0}
.done .msg{align-items:flex-start}
.quo{margin:.6em 0 0;padding:.05em 0 .05em .9em;border-left:3px solid var(--rule)}
.quo p{font-size:.9rem;line-height:1.85;margin:.45em 0 0}
.quo p:first-child{margin-top:0}
.fin{background:#eef1ee;border:1px solid var(--rule);border-radius:10px;padding:.7em .9em;margin:.9em 0 0}
.fin .k{font-size:.82rem;font-weight:600;color:var(--soft);margin:0 0 .3em}
`;

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 待調整項目與規格（9/18）</title>
<style>
${CSS}${CSS2}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 官方帳號　待調整項目與規格</h1>
<p class="lede">芳仁牙醫診所　更新於 ${esc(B.更新日)}<br>
${bb(B.抬頭)}<br>
卡片的模擬圖一律畫成病人手機上的寬度（單張約 ${BUB.mega}px、輪播 ${BUB.階} 約 ${BUB.car}px）。</p>

<div class="now">
<b>未定案</b>
<ol>
<li value="3"><p class="t"><a href="#s3">${esc(件3.標)}</a></p>
<ol class="sub">${B.s3.子.map((t, k) => `<li><a href="#s3-${k + 1}">${b(t)}</a></li>`).join("\n")}</ol></li>
<li><p class="t"><a href="#s4">${esc(件4.標)}</a></p>
<ol class="sub">${件4.子.map((t, k) => `<li><a href="#s4-${k + 1}">${b(t)}</a></li>`).join("\n")}
<li><a href="#s4-4-1">${esc(B.s4.四之四之一.標.replace(/^4-4-1　/, ""))}</a></li></ol></li>
<li><p class="t"><a href="#s5">已完成項目</a>（含 1 與 2）</p></li>
</ol>
</div>

<h2 class="h2" id="s3">3　約診通知與紀錄查詢版面<span class="t">九顆浮水印改成一條帶狀 logo</span></h2>
<p class="note">${bb(B.s3.導言)}</p>

${h3("s3-1", "3-1　改用帶狀 logo", "為什麼換、換掉之後要填什麼")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之一.說)}</p>
<div class="quo">${B.s3.三之一.翔評.map((t) => `<p>${b(t)}</p>`).join("\n")}</div>
<p class="note">${bb(B.s3.三之一.回答)}</p>
<div class="sgrid">
${卡格(卡(BUB.mega, MEGA, { 印: wmSvg(輪, OFF, false) }), `<b>現在這樣</b>　浮水印疊在文字後面、每一筆約診換一顆（這一張是 ${輪.n}）`)}
${卡格(卡(BUB.mega, MEGA, { 帶檔: 帶檔.mega, 前綴: 前綴 }), `<b>這一版</b>　帶子夾在日期與那兩行小字之間・${esc(帶說("mega"))}`)}
</div>
<div class="rows">
${B.s3.三之一.換掉.map(([k, v]) => `<div class="row"><p class="k">${bb(k)}</p><p class="v">${bb(v)}</p></div>`).join("\n")}
</div>
<h4 class="h4">實機畫面（示意）</h4>
<figure class="vid">
<video src="demo-band.mp4" poster="demo-band.jpg" width="${sizeOf("demo-band.jpg")[0]}" height="${sizeOf("demo-band.jpg")[1]}"
 controls loop muted playsinline preload="none"></video>
<figcaption>${bb(B.s3.三之一.影片)}</figcaption>
</figure>

${h3("s3-2", "3-2　預約成功通知・定稿", `單張 <code>mega</code>・${BUB.mega}px`)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之二.說)}</p>
${list(B.s3.三之二.規格)}
<div class="sgrid">
${卡格(卡(BUB.mega, MEGA, { 帶檔: 帶檔.mega, 前綴: 前綴 }),
  `<b>定稿</b>　${esc(帶說("mega"))}<br>${esc(基註(帶by[帶檔.mega].B))}<br>${esc(套註(帶by[帶檔.mega].B))}`)}
</div>

${h3("s3-3", "3-3　約診紀錄查詢・定稿", `輪播 <code>${BUB.階}</code>・${BUB.car}px`)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之三.說)}</p>
${list(B.s3.三之三.規格)}
<div class="sgrid">
${PILLVAL.map((v) => 卡格(卡(BUB.car, 輪播行, { 帶檔: 帶檔.car, 丸: v, 折: true, 前綴: 前綴 }),
  `<b>${esc(v.名)}</b>　<code>${v.色}</code>`)).join("\n")}
</div>
<p class="note">${esc(帶說("car"))}。${esc(基註(帶by[帶檔.car].B))}；${esc(套註(帶by[帶檔.car].B))}。</p>

${h3("s3-4", "3-4　約診狀態", "四個值的畫法、色碼與對齊")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B1.s3.三之四.說)}</p>
<div class="tabw"><table class="tab tabv"><thead><tr><th>值</th><th>什麼時候</th><th>藥丸底色</th></tr></thead><tbody>
${B1.s3.三之四.值.map(([名, 時], i) => `<tr><td>${esc(名)}</td><td>${esc(時)}</td>
<td><span class="chip" style="background:${PILLVAL[i].色}"></span><code>${PILLVAL[i].色}</code></td></tr>`).join("\n")}
</tbody></table></div>
${list(B1.s3.三之四.規格)}
<p class="note">${bb(B1.s3.三之四.先問)}</p>

${h3("s3-5", "3-5　日期的順序", "")}
<div class="tabw"><table class="tab tabv"><tbody>
<tr><td>翔評現在</td><td><code>${esc(DATE.廠商)}</code></td></tr>
<tr><td>請改成</td><td><code>${esc(DATE.例)}</code></td></tr>
</tbody></table></div>
${list(B1.s3.三之五.規格)}

${h3("s3-6", "3-6　帶子的圖檔與 Flex JSON", "兩張圖已經上線，直接引用網址")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之六.說)}</p>
<div class="tabw"><table class="tab"><thead><tr><th>用在哪一則</th><th>顆數</th><th>圖檔</th><th>網址</th><th>畫在卡上</th></tr></thead><tbody>
${["mega", "car"].map((k) => {
  const a = 帶by[帶檔[k]], w = k === "mega" ? BUB.mega : BUB.car;
  return `<tr><td>${k === "mega" ? "預約成功通知（單張）" : "約診紀錄查詢（輪播）"}</td>
<td>${a.B.顆數} 顆</td><td>${a.w}×${a.h}px・PNG・透明底</td>
<td><code class="url">${esc(ASSET + 帶檔[k])}</code></td>
<td>${帶高(a, w).toFixed(1)}px 高（卡片 ${w}px）</td></tr>`;
}).join("\n")}
</tbody></table></div>
${list(B.s3.三之六.規格)}
<details><summary>展開　預約成功通知（單張 mega）的 Flex JSON</summary>
<pre class="json">${esc(JSON.stringify(單張JSON, null, 2))}</pre></details>
<details><summary>展開　約診紀錄查詢（輪播 ${BUB.階}）的 Flex JSON</summary>
<pre class="json">${esc(JSON.stringify(輪播JSON, null, 2))}</pre></details>

<h2 class="h2" id="s4">4　綁定成功的自動回覆設定<span class="t">現況、其他帳號的做法、綁定完成卡的規格、翔評 9/18 的回覆</span></h2>
<ol class="sub4">${件4.子.map((t, k) => `<li id="s4-${k + 1}">${b(t)}</li>`).join("\n")}</ol>
<div class="pair">
<figure><p class="k">現況：診所的帳號，綁定那一刻</p>${img("../line-vendor/bind-live-0912.jpg", "綁定完成那一刻病人那一側的畫面")}
<figcaption>${bb(B1.s4.看到)}門號已遮。</figcaption></figure>
<figure><p class="k">想接在那一句後面送的：綁定完成卡</p>${img("../line-bind-done/shot-bind-done.png", "綁定完成卡", 3)}
<figcaption>已定稿（Flex JSON 在 /preview/line-spec/ 的 ③）。</figcaption></figure>
</div>

${h3("s4-4-1", esc(B.s4.四之四之一.標), "9/18 收到")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s4.四之四之一.導)}</p>
<div class="quo"><p>${b(B.s4.四之四之一.品御)}</p></div>
<p class="note">${bb(B.s4.四之四之一.選項導)}</p>
<div class="quo">${B.s4.四之四之一.選項.map((t) => `<p>－${esc(t)}</p>`).join("\n")}</div>
<p class="note">${bb(B.s4.四之四之一.紅字導)}</p>
<div class="quo">${B.s4.四之四之一.紅字.map((t) => `<p>${esc(t)}</p>`).join("\n")}</div>
<div class="refs">
${B.s4.四之四之一.圖說.map(([f, cap]) => `<figure>${img(f, cap)}<figcaption>${esc(cap)}</figcaption></figure>`).join("\n")}
</div>
<div class="fin"><p class="k">${bb(B.s4.四之四之一.讀出來導)}</p>
<ul class="spec">${B.s4.四之四之一.讀出來.map((t) => `<li>${bb(t)}</li>`).join("\n")}</ul></div>

<h3 class="h3" id="s4-ref">其他商家帳號：綁定那一刻送的是另一則<span class="t">對應 4-3。手機號碼與姓名已遮</span></h3>
<div class="refs">
${B1.s4.其他帳號.map(([f, k, cap]) => `<figure><p class="k">${esc(k)}</p>${img("../line-brief/ref-" + f + ".jpg", k)}
<figcaption>${bb(cap)}</figcaption></figure>`).join("\n")}
</div>
<h3 class="h3" id="s4-pinyu">新竹品御牙醫：綁定成功那一句之後沒有跳出通用回覆<span class="t">對應 4-4</span></h3>
<div class="refs">
<figure><p class="k">${esc(B1.s4.品御[1])}</p>${img("../line-brief/ref-" + B1.s4.品御[0] + ".jpg", B1.s4.品御[1])}
<figcaption>${bb(B1.s4.品御[2])}</figcaption></figure>
</div>

<h2 class="h2" id="s5">5　已完成項目<span class="t">9/18 這一輪 ${B.完成.length} 件 ＋ 先前 ${DONE.length} 則</span></h2>
<p class="note">${bb(B.s5.說)}</p>
${B.完成.map((x, i) => `
${h3("s5-" + (i + 1), `${x.n}　${esc(x.標)}`, `9/18 已完成・在那十二則裡是 ${訊息號(x.標)}`)}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(x.說)}</p>
<div class="pair">
${x.圖.map((f, k) => `<figure><p class="k">${esc(x.圖說[k])}</p>${img(f, x.圖說[k], 3)}</figure>`).join("\n")}
</div>`).join("\n")}
<h3 class="h3">先前已完成的 ${DONE.length} 則</h3>
<div class="done">
${DONE.map((r) => `<div class="msg"><span class="ims">${img("../line-vendor/t-" + [].concat(r.圖)[0] + ".jpg", r.名 + "的模擬圖")}</span>
<div class="x"><p class="nm"><a href="/preview/line-spec/#${SPEC_ANCHOR[r.n]}">${esc(r.n)}　${esc(r.名)}</a></p>
<p class="mt">${esc(r.時機)}／${esc(r.誰送)}送</p></div></div>`).join("\n")}
</div>

<p class="foot">
這一頁是靜態的，內容有更新會直接改在同一個網址上。<br>
七則訊息的文字、圖檔網址與 Flex JSON：<a href="/preview/line-spec/">/preview/line-spec/</a>
</p>

</div>
</body>
</html>
`;

/* 同 9/14 那一版：整頁一次換稱謂。⚠ 「」裡是別人自己寫的原文，不可以動。 */
const 稱謂 = (t) => t.split(/(「[^」]*」)/).map((seg, i) =>
  i % 2 ? seg : seg.replace(/你們/g, "翔評").replace(/我們/g, "診所")).join("");
const out = 稱謂(html);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), out);
writeFileSync(join(HERE, "single-card-band.json"), JSON.stringify(FLEX, null, 1) + "\n");
console.log(`✓ preview/line-brief-0918/index.html　${(out.length / 1024).toFixed(1)}KB`);
console.log(`✓ drafts/channels/single-card-band.json（要交出去的那兩份 Flex，產生的）`);
console.log(`  未定案 2 件（3 與 4，編號沒有重編）・已完成 ${B.完成.length} ＋ ${DONE.length} 則`);
console.log(`  帶子　單張 ${帶說("mega")}`);
console.log(`  　　　輪播 ${帶說("car")}`);
