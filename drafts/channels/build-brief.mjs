#!/usr/bin/env node
// 給廠商的「待調整項目與規格」→ preview/line-brief/
//
// 2026-09-14 使用者：「把這幾天的 line 頁面設計與定稿整理起來，並與廠商回傳的頁面
// 對照，針對需調整的部分詳列清楚、規格、做法。最前面先把未定案的項目寫出來……
// 先前的提案頁保留太多調整版本，這樣給廠商看太亂。PM 請好好整理」
//
// 順序是使用者指定的：抬頭「未定案」→ 1 尚未綁定按約診查詢 → 2 看診前 48 小時提醒
// → 3 約診通知與紀錄查詢版面（3-1~3-6）→ 4 綁定成功的自動回覆設定 → 5 已完成項目。
//
// ⚠⚠⚠ 這一頁只放「定稿」與「廠商現在那一版」，每一件怎麼走到定稿的過程都不印 ——
//   那些留在 /preview/line-booked/、/preview/line-vendor/ 與各自的 README 裡。
// ⚠⚠ 數字一律不重打：卡寬、浮水印寬度、色碼、網址從 booked-card.json／wm-sizes.json／
//   line-booked 那一頁現算（經由 build-vendor.mjs 的 export）；按鈕從 welcome-card.json
//   照抄；標題從 line-bind-prompt 那一頁讀。文字出處是 brief.json。
// ⚠⚠ 3-2（單張）的浮水印是**各自的原色**、3-3（輪播）是**淡墨** —— 2026-09-14 使用者
//   逐條寫的那一份就是這樣分的；booked-card.json 的輪播網址同一天改成 -ink12.png。
// ⚠ 圖一律引用隔壁資料夾那一份，這個資料夾裡只有 index.html。零 JS。
//
// 跑完驗：node drafts/channels/check-brief.mjs
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS, esc, b, D, DATE, WM, INK, WM_A, compare, carCompare, 設節表,
  OFF, wmWidth, cardLines, linesHtml, MEGA, MICRO, BUB, WCARD, byName, PILLVAL,
} from "./build-vendor.mjs";

/* 這一頁不用「見第 N 節」那種記號 —— 一被用到就 throw，不要靜靜地印出別頁的節號。 */
設節表({});

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "preview", "line-brief");
const B = JSON.parse(readFileSync(join(HERE, "brief.json"), "utf8"));
const BOOKED = JSON.parse(readFileSync(join(HERE, "booked-card.json"), "utf8"));
const ASSET = "https://fangren.net/assets/line/";

/* ── 圖的尺寸：現場讀檔頭，不寫死 ─────────────────────────────── */
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
/* scale：那幾張模擬圖是 3× 拍的，畫成它在手機上的 CSS 寬度 */
const img = (rel, alt, scale = 1, lazy = true) => {
  const [w, h] = sizeOf(rel);
  return `<img src="${rel}" width="${w}" height="${h}"${
    scale !== 1 ? ` style="width:${Math.round(w / scale)}px"` : ""}${
    lazy ? ' loading="lazy"' : ""} alt="${esc(alt)}">`;
};

/* ── brief.json 裡的 {{…}}：在這裡現算 ──────────────────────────── */
const V = {
  單張卡寬: String(BUB.mega), 輪播卡寬: String(BUB.car), 內距: String(BUB.pad),
  底色: WCARD.toUpperCase(), 右溢: String(OFF.right), 下溢: String(OFF.bottom),
  順序: WM.map((s) => s.n).join(" "), 日期: DATE.例,
};
const fill = (t) => String(t).replace(/\{\{([^}:]+)(?::([^}]+))?\}\}/g, (_, k, a) => {
  if (k === "圖") {
    if (!existsSync(join(ROOT, "assets", "line", a))) throw new Error(`assets/line/${a} 不在`);
    return ASSET + a;
  }
  if (k === "標題") return TITLE;
  if (!(k in V)) throw new Error(`brief.json 用到不存在的值 {{${k}}}`);
  return V[k];
});
const bb = (t) => b(fill(t));
const list = (rows) => `<ul class="spec">${rows.map((t) => `<li>${bb(t)}</li>`).join("\n")}</ul>`;

/* ── 1 尚未綁定按約診查詢：標題讀 line-bind-prompt、按鈕照抄 welcome-card ─ */
const TITLE = (() => {
  const p = readFileSync(join(ROOT, "preview", "line-bind-prompt", "index.html"), "utf8");
  const m = p.match(/var TITLE = "([^"]+)";/);
  if (!m || !m[1].includes("　")) throw new Error("line-bind-prompt 那一頁上讀不到標題（或標題裡沒有全形空格）");
  if (!/g: "11"/.test(p)) throw new Error("line-bind-prompt 那一頁的空格預設不是 11（xxs）了");
  return m[1];
})();
const BIND_BTN = (() => {
  const w = JSON.parse(readFileSync(join(HERE, "welcome-card.json"), "utf8"));
  let hit = null;
  const walk = (n) => {
    if (hit) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      if (n.type === "box" && n.action && n.action.label === "點這裡綁定") { hit = n; return; }
      for (const [k, v] of Object.entries(n)) if (!k.startsWith("_")) walk(v);
    }
  };
  walk(w);
  if (!hit) throw new Error("welcome-card.json 裡找不到「點這裡綁定」那一顆按鈕");
  const c = JSON.parse(JSON.stringify(hit));
  c.action.uri = "{{bind_url}}";
  return c;
})();
const [t1, t2] = TITLE.split("　");
const BIND_JSON = {
  type: "bubble", size: "mega",
  hero: { type: "image", url: ASSET + "hero-bind.jpg", size: "full", aspectRatio: "2:1", aspectMode: "cover" },
  body: {
    type: "box", layout: "vertical", paddingAll: "14px", backgroundColor: "#F4F4F5",
    contents: [
      { type: "text", size: "md", weight: "bold", color: "#2A2C27", align: "center", wrap: true,
        contents: [{ type: "span", text: t1 }, { type: "span", text: "　", size: "xxs" }, { type: "span", text: t2 }] },
      BIND_BTN,
    ],
  },
};

/* ── 卡片：畫成兩則在病人手機上的寬度 ──────────────────────────── */
const WEEK = "日一二三四五六";
const fmt = (dt) => {
  const p = (n) => String(n).padStart(2, "0");
  return { ymd: `${dt.getUTCFullYear()}/${p(dt.getUTCMonth() + 1)}/${p(dt.getUTCDate())}`,
           wd: `星期${WEEK[dt.getUTCDay()]}`, m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
};
/* 每一顆找一個照規則會算到它的看診日（2026-09-14 起、只取週一到週五）——
   卡上的形狀是從日期算出來的，不是塞進去的。 */
const 例日 = (() => {
  const out = new Array(WM.length).fill(null);
  for (let t = Date.UTC(2026, 8, 14); out.includes(null); t += 864e5) {
    const f = fmt(new Date(t));
    const dow = new Date(t).getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const i = (f.m + f.d) % WM.length;
    if (!out[i]) out[i] = f;
  }
  return out;
})();
const 時間 = DATE.例.split(" ").pop();
const withDate = (rows, html) => {
  const key = esc(DATE.例);
  if (!rows.some((r) => r.html.includes(key))) throw new Error("卡上那幾行裡找不到日期那一格");
  return rows.map((r) => ({ ...r, html: r.html.split(key).join(html) }));
};
const wmSvg = (s2, isCar, col) => {
  const w = wmWidth(s2, isCar);
  return `<svg class="wm" width="${w}" height="${(w / s2.ratio).toFixed(2)}"
  viewBox="0 0 ${s2.vw} ${s2.vh}" preserveAspectRatio="none" aria-hidden="true"
  style="right:${-OFF.right}px;bottom:${-OFF.bottom}px"><g transform="${s2.gt}"><path
  fill="${col}" fill-opacity="${WM_A}" fill-rule="evenodd" d="${s2.d}"/></g></svg>`;
};
const single = (s2, f, cap) => `<figure class="cw" style="max-width:${BUB.mega}px">
<div class="stcard cb">
${linesHtml(withDate(MEGA, esc(`${f.ymd} ${f.wd} ${時間}`)))}
${wmSvg(s2, false, s2.色)}
</div>
<figcaption>${cap}</figcaption>
</figure>`;
const micro = (s2, f, v, cap) => `<figure class="cw" style="max-width:${BUB.car}px">
<div class="stcard cb">
${linesHtml(withDate(MICRO, `${esc(f.ymd)}<br>${esc(`${f.wd} ${時間}`)}`))}
<p class="r"><span class="lb">約診狀態</span><span class="pill" style="background:${v.色}">${esc(v.名)}</span></p>
${wmSvg(s2, true, INK)}
</div>
<figcaption>${cap}</figcaption>
</figure>`;

/* ── 3-2／3-3 那兩張表：從 booked-card.json 的 _浮水印 讀，寬度再對一次 ── */
const TAB = WM.map((s2, i) => {
  const r = BOOKED._浮水印[s2.n];
  if (!r) throw new Error(`booked-card.json 的 _浮水印 裡沒有 ${s2.n}`);
  const 單 = parseInt(r.watermark_size_single, 10), 輪 = parseInt(r.watermark_size_carousel, 10);
  if (單 !== wmWidth(s2, false) || 輪 !== wmWidth(s2, true))
    throw new Error(`${s2.n} 的寬度和定案那兩張表對不上`);
  if (!/-12\.png$/.test(r.url) || /ink/.test(r.url)) throw new Error(`${s2.n} 單張網址應該是原色 -12.png：${r.url}`);
  if (!/-ink12\.png$/.test(r.url_carousel || "")) throw new Error(`${s2.n} 輪播網址應該是 -ink12.png：${r.url_carousel}`);
  for (const u of [r.url, r.url_carousel])
    if (!existsSync(join(ROOT, "assets", "line", u.slice(ASSET.length)))) throw new Error(`${u} 還沒放進 assets/line/`);
  return { s: s2, i, 單, 輪, 比: r.watermark_ratio, url: r.url, urlc: r.url_carousel };
});
{
  const q = BOOKED.約診紀錄查詢.contents[0].body.contents.find((c) => c.type === "image");
  const one = BOOKED.預約成功通知.body.contents.find((c) => c.type === "image");
  if (!/-ink12\.png$/.test(q.url)) throw new Error("booked-card.json 輪播那一則的浮水印網址不是 -ink12.png");
  if (/ink/.test(one.url)) throw new Error("booked-card.json 單張那一則的浮水印網址不應該是淡墨");
  if (BOOKED.約診紀錄查詢.contents[0].size !== "micro") throw new Error("booked-card.json 輪播不是 micro");
}
const u = (x) => `<code class="url">${esc(x)}</code>`;
const tab32 = `<div class="tabw"><table class="tab"><thead><tr>
<th>#</th><th>形狀</th><th>色碼</th><th><code>aspectRatio</code></th><th>單張 <code>size</code></th><th>單張網址 <code>url</code></th>
</tr></thead><tbody>
${TAB.map((r) => `<tr><td>${r.i}</td><td><b>${r.s.n}</b></td>
<td><span class="chip" style="background:${r.s.色}"></span><code>${r.s.色}</code></td>
<td><code>${esc(r.比)}</code></td><td><b>${r.單}</b>px${r.單 === r.s.w ? "" : ` <span class="was">（原 ${r.s.w}）</span>`}</td>
<td>${u(r.url)}</td></tr>`).join("\n")}
</tbody></table></div>`;
/* 2026-09-14 使用者：「約診記錄查詢的 micro 卡上 logo 的尺寸和位置設定要列一下，不然廠商會自己猜」——
   寬、換算後的高、溢出量、露在卡片裡的寬高全部現算印出來。 */
const tab33 = `<div class="tabw"><table class="tab"><thead><tr>
<th>#</th><th>形狀</th><th>色碼</th><th><code>aspectRatio</code></th><th>寬 <code>size</code></th><th>高</th>
<th>位置（對卡片右下角）</th><th>露在卡內</th><th>輪播網址 <code>url</code></th>
</tr></thead><tbody>
${TAB.map((r) => {
  const h = r.輪 / r.s.ratio;
  return `<tr><td>${r.i}</td><td><b>${r.s.n}</b></td>
<td><span class="chip" style="background:${INK}"></span><code>${INK}</code></td>
<td><code>${esc(r.比)}</code></td><td><b>${r.輪}</b>px${r.輪 === r.s.w ? "" : ` <span class="was">（原 ${r.s.w}）</span>`}</td>
<td>${h.toFixed(1)}px</td><td>右 +${OFF.right}px／下 +${OFF.bottom}px</td>
<td>${r.輪 - OFF.right} × ${(h - OFF.bottom).toFixed(1)}px</td>
<td>${u(r.urlc)}</td></tr>`;
}).join("\n")}
</tbody></table></div>`;
/* 標了尺寸的示意：外框（虛線）＝整顆圖的框，卡片把跑出去的那一截切掉 */
const diagram = (s2) => {
  const w = wmWidth(s2, true), h = w / s2.ratio;
  return `<figure class="dg">
<div class="dgbox" style="width:${BUB.car}px">
<div class="stcard cb">
${linesHtml(withDate(MICRO, `${esc("2026/09/11")}<br>${esc(`星期五 ${時間}`)}`))}
<p class="r"><span class="lb">約診狀態</span><span class="pill" style="background:${PILLVAL[0].色}">${esc(PILLVAL[0].名)}</span></p>
${wmSvg(s2, true, INK)}
</div>
<span class="dgwm" style="width:${w}px;height:${h.toFixed(1)}px;right:${-OFF.right}px;bottom:${-OFF.bottom}px"></span>
<span class="dgr" style="bottom:${(h / 2 - OFF.bottom).toFixed(1)}px">→ ${OFF.right}px</span>
<span class="dgb">↓ ${OFF.bottom}px</span>
</div>
<figcaption><b>${s2.n}</b>　寬 ${w}px × 高 ${h.toFixed(1)}px・虛線是整顆圖的框</figcaption>
</figure>`;
};

/* ── 3-4 四個值：名字與順序要和 vendor-log 的定案同一份 ───────────────── */
const S4 = B.s3.三之四;
if (S4.值.map((x) => x[0]).join() !== PILLVAL.map((x) => x.名).join())
  throw new Error("brief.json 的四個值和 vendor-log.json 的藥丸那一份對不上");
const 示範 = (() => {
  const m = DATE.例.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  const s2 = WM[(Number(m[2]) + Number(m[3])) % WM.length];
  return { s2, f: { ymd: `${m[1]}/${m[2]}/${m[3]}`, wd: DATE.例.split(" ")[1] } };
})();

/* ── 5 已完成 ────────────────────────────────────────────────── */
const SPEC_ANCHOR = { "①": "m1", "②": "m2", "⑨": "m6", "⑩": "m7", "⑪": "m8", "⑫": "m9" };
const specPage = readFileSync(join(ROOT, "preview", "line-spec", "index.html"), "utf8");
const DONE = D.訊息.列.filter((r) => r.組 === "done");
for (const r of DONE) {
  const a = SPEC_ANCHOR[r.n];
  if (!a || !specPage.includes(`id="${a}"`)) throw new Error(`${r.n} 在 line-spec 上找不到錨點`);
}

const 改 = D.改版;
const h3 = (id, t, sub = "") => `<h3 class="h3" id="${id}">${t}${sub ? `<span class="t">${sub}</span>` : ""}</h3>`;

const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>芳仁牙醫診所　LINE 待調整項目與規格</title>
<style>
${CSS}
.h3 .t{display:block;font-size:.79rem;font-weight:400;color:var(--soft);margin-top:.2em}
.now a{color:inherit;text-decoration-color:var(--rule);text-underline-offset:3px}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));gap:16px 14px;margin:.9em 0 0}
.pair figure{margin:0}
.pair img{display:block;max-width:100%;height:auto;border-radius:10px}
.pair figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.4em}
.pair .k{font-size:.88rem;font-weight:600;color:var(--ink);margin:0 0 .35em}
.gs{display:grid;grid-template-columns:repeat(auto-fill,minmax(${BUB.mega}px,1fr));gap:16px 12px;margin:1em 0 0}
.gm{display:grid;grid-template-columns:repeat(auto-fill,minmax(${BUB.car}px,1fr));gap:16px 12px;margin:1em 0 0}
.cw{margin:0}
/* 2026-09-14 使用者：「約診狀態的藥丸和文字應該是不透明的，排列順序要壓在淡墨 logo 浮水印上」——
   浮水印是 absolute、排在文字後面，會畫在字與藥丸上面（藥丸看起來被刷淡）。字那幾行拉到上層。 */
.cw .stcard>p{position:relative;z-index:1}
.cw .stcard .wm{z-index:0}
.cw figcaption{font-size:.74rem;color:var(--soft);line-height:1.6;margin-top:.25em}
pre.json{background:#fff;border:1px solid var(--rule);border-radius:9px;padding:10px 12px;
  font-size:.76rem;line-height:1.55;overflow-x:auto;margin:.9em 0 0}
code.url{font-size:.78em;white-space:nowrap}
.tabv td:first-child{white-space:nowrap;font-weight:600}
.dgs{display:flex;flex-wrap:wrap;gap:18px 56px;margin:.9em 0 0}
.dg{margin:0}
.dgbox{position:relative;margin:0 44px 30px 0}
.dgwm{position:absolute;border:1.5px dashed #b0453f;pointer-events:none;z-index:2}
.dgr{position:absolute;right:-44px;font-size:.72rem;color:#b0453f;white-space:nowrap}
.dgb{position:absolute;right:0;bottom:-30px;font-size:.72rem;color:#b0453f;white-space:nowrap}
.dg figcaption{font-size:.76rem;color:var(--soft);line-height:1.6}
.refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px 14px;margin:.9em 0 0}
.refs figure{margin:0}
.refs img{display:block;width:100%;max-width:300px;height:auto;border-radius:10px}
.refs .k{font-size:.88rem;font-weight:600;margin:0 0 .35em}
.refs figcaption{font-size:.8rem;color:var(--soft);line-height:1.65;margin-top:.4em;max-width:300px}
.done{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:9px;margin:.8em 0 0}
.done .msg{align-items:flex-start}
</style>
</head>
<body>
<div class="wrap">

<h1>LINE 官方帳號　待調整項目與規格</h1>
<p class="lede">芳仁牙醫診所　更新於 ${esc(B.更新日)}<br>
先列未定案的四件，再逐項附上<b>你們現在那一版</b>與<b>我們的定稿</b>、規格與做法；最後是已經完成、不必再調整的項目。<br>
卡片的模擬圖一律畫成病人手機上的寬度（單張約 ${BUB.mega}px、輪播 micro 約 ${BUB.car}px）。</p>

<div class="now">
<b>未定案</b>
<ol>
${B.未定案.map((x, i) => `<li>
<p class="t"><a href="#s${i + 1}">${esc(x.標)}</a></p>
${x.子 ? `<ol class="sub">${x.子.map((t, k) => `<li><a href="#s${i + 1}-${k + 1}">${b(t)}</a></li>`).join("\n")}</ol>`
      : `<p class="d">${b(x.說)}</p>`}
</li>`).join("\n")}
<li><p class="t"><a href="#s5">已完成項目</a></p></li>
</ol>
</div>

<h2 class="h2" id="s1">1　尚未綁定按約診查詢<span class="t">請抽換現有的公版藍色圖卡</span></h2>
<p class="note">${bb(B.s1.要做)}</p>
<div class="pair">
<figure><p class="k">現在（公版）</p>${img("../line-bind-prompt/shot-bind-prompt-old.png", "現在跳出來的公版藍色圖卡", 3, false)}
<figcaption>照你們現在那張重畫的結構（吉祥物沒有畫）。</figcaption></figure>
<figure><p class="k">換成這一張</p>${img("../line-bind-prompt/shot-bind-prompt.png", "要換上的綁定圖卡", 3, false)}
<figcaption>卡片寬 268px 時的樣子。</figcaption></figure>
</div>
<h3 class="h3">規格</h3>
${list(B.s1.規格)}
<h3 class="h3">Flex JSON<span class="t"><code>{{bind_url}}</code> 請填你們系統的綁定網址</span></h3>
<details><summary>展開這一張卡的 Flex JSON</summary>
<pre class="json">${esc(JSON.stringify(BIND_JSON, null, 2))}</pre></details>

<h2 class="h2" id="s2">2　看診前 48 小時提醒<span class="t">原圖有 bug，請抽換新圖</span></h2>
<p class="note">${bb(B.s2.要做)}</p>
<div class="pair">
<figure><p class="k">新頭圖（1024×512）</p>${img("../line-remind/hero-remind.jpg", "修正後的提醒卡頭圖")}
<figcaption>${esc(ASSET)}hero-remind.jpg</figcaption></figure>
<figure><p class="k">放進提醒卡的樣子</p>${img("../line-remind/shot-remind.png", "換上新頭圖的提醒卡", 3)}</figure>
</div>
<h3 class="h3">做法</h3>
${list(B.s2.規格)}

<h2 class="h2" id="s3">3　約診通知與紀錄查詢版面<span class="t">預約成功通知（單張）與約診紀錄查詢（輪播）</span></h2>
<p class="note">${bb(B.s3.導言)}</p>

${h3("s3-1", "3-1　浮水印的大小與位置", "你們 " + 改.日 + " 那一版，對照定稿")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之一.說)}</p>
<div class="vs">
${改.圖.map((g) => `<figure>${img("../line-vendor/" + g.檔, g.標)}
<p class="t">你們送來的：${esc(g.標)}</p>
<figcaption>${b(g.說)}</figcaption></figure>`).join("\n")}
</div>
<h4 class="h4">同一張卡、同一顆浮水印：我們要的 vs 你們送來的</h4>
${compare}
<h4 class="h4">輪播上的同一顆</h4>
${carCompare}
<h4 class="h4">位置與大小的規格</h4>
${list(B.s3.三之一.位置)}
<p class="note">九顆畫在兩則卡片上的樣子：預約成功通知見 <a href="#s3-2">3-2</a>、約診紀錄查詢見 <a href="#s3-3">3-3</a>；挑哪一顆的規則見 <a href="#s3-6">3-6</a>。</p>

${h3("s3-2", "3-2　預約成功通知・定稿", "九顆浮水印的顏色與色碼")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之二.說)}</p>
${list(B.s3.三之二.規格)}
${tab32}
<h4 class="h4">九顆各自畫在卡片上（日期是照 3-6 規則會算到那一顆的看診日）</h4>
<div class="gs">
${WM.map((s2, i) => single(s2, 例日[i],
  `<b>#${i} ${s2.n}</b>　<code>${s2.色}</code>・${wmWidth(s2, false)}px`)).join("\n")}
</div>

${h3("s3-3", "3-3　約診紀錄查詢・定稿", "卡片 micro、浮水印淡墨素色")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(B.s3.三之三.說)}</p>
${list(B.s3.三之三.規格)}
${tab33}
<h4 class="h4">尺寸與位置的示意（卡片 micro 約 ${BUB.car}px 寬）</h4>
<div class="dgs">${diagram(byName.r1c2)}${diagram(byName.r3c3)}</div>
<h4 class="h4">九顆各自畫在 micro 卡上（約診狀態輪流掛四個值，只是示範）</h4>
<div class="gm">
${WM.map((s2, i) => micro(s2, 例日[i], PILLVAL[i % PILLVAL.length],
  `<b>#${i} ${s2.n}</b>・${wmWidth(s2, true)}px`)).join("\n")}
</div>

${h3("s3-4", "3-4　約診狀態", "四個值的畫法、色碼與對齊")}
<p style="font-size:.9rem;margin:.3em 0 0">${bb(S4.說)}</p>
<div class="tabw"><table class="tab tabv"><thead><tr><th>值</th><th>什麼時候</th><th>藥丸底色</th></tr></thead><tbody>
${S4.值.map(([名, 時], i) => `<tr><td>${esc(名)}</td><td>${esc(時)}</td>
<td><span class="chip" style="background:${PILLVAL[i].色}"></span><code>${PILLVAL[i].色}</code></td></tr>`).join("\n")}
</tbody></table></div>
${list(S4.規格)}
<div class="gm">
${PILLVAL.map((v) => micro(示範.s2, 示範.f, v, `<b>${esc(v.名)}</b>　<code>${v.色}</code>`)).join("\n")}
</div>
<p class="note">${bb(S4.先問)}</p>

${h3("s3-5", "3-5　日期的順序", "")}
<div class="tabw"><table class="tab tabv"><tbody>
<tr><td>你們現在</td><td><code>${esc(DATE.廠商)}</code></td></tr>
<tr><td>請改成</td><td><code>${esc(DATE.例)}</code></td></tr>
</tbody></table></div>
${list(B.s3.三之五.規格)}

${h3("s3-6", "3-6　九顆浮水印怎麼輪", "")}
${list(B.s3.三之六.規格)}
<p style="font-size:.86rem;color:var(--soft);margin:.8em 0 0">${bb(B.s3.三之六.例說)}</p>
<div class="tabw"><table class="tab"><thead><tr><th>看診日</th><th>(月＋日) % 9</th><th>形狀</th><th>單張色碼</th></tr></thead><tbody>
${WM.map((s2, i) => `<tr><td>${esc(例日[i].ymd)} ${esc(例日[i].wd)}</td><td>(${例日[i].m}＋${例日[i].d}) % 9 ＝ ${i}</td>
<td><b>${s2.n}</b></td><td><span class="chip" style="background:${s2.色}"></span><code>${s2.色}</code></td></tr>`).join("\n")}
</tbody></table></div>

<h2 class="h2" id="s4">4　綁定成功的自動回覆設定<span class="t">現況、我們想要的做法、想請教的兩題</span></h2>
<ol class="sub4">${B.未定案[3].子.map((t, k) => `<li id="s4-${k + 1}">${b(t)}</li>`).join("\n")}</ol>
<div class="pair">
<figure><p class="k">現況：我們的帳號，綁定那一刻</p>${img("../line-vendor/bind-live-0912.jpg", "綁定完成那一刻病人那一側的畫面")}
<figcaption>${bb(B.s4.看到)}門號已遮。</figcaption></figure>
<figure><p class="k">想接在那一句後面送的：綁定完成卡</p>${img("../line-bind-done/shot-bind-done.png", "綁定完成卡", 3)}
<figcaption>已定稿（Flex JSON 在 /preview/line-spec/ 的 ③）。</figcaption></figure>
</div>
<h3 class="h3" id="s4-ref">其他商家帳號：綁定那一刻送的是另一則<span class="t">對應 4-3。手機號碼與姓名已遮</span></h3>
<div class="refs">
${B.s4.其他帳號.map(([f, k, cap]) => `<figure><p class="k">${esc(k)}</p>${img("ref-" + f + ".jpg", k)}
<figcaption>${bb(cap)}</figcaption></figure>`).join("\n")}
</div>
<h3 class="h3" id="s4-pinyu">新竹品御牙醫：綁定成功那一句之後沒有跳出通用回覆<span class="t">對應 4-4</span></h3>
<div class="refs">
<figure><p class="k">${esc(B.s4.品御[1])}</p>${img("ref-" + B.s4.品御[0] + ".jpg", B.s4.品御[1])}
<figcaption>${bb(B.s4.品御[2])}</figcaption></figure>
</div>
<h3 class="h3">想要的做法</h3>
${list(B.s4.想要的)}
<h3 class="h3">想請教</h3>
${list(B.s4.請教)}
<p class="note">${bb(B.s4.回覆)}</p>

<h2 class="h2" id="s5">5　已完成項目<span class="t">${DONE.length} 則，不需要再調整</span></h2>
<p class="note">${bb(B.s5.說)}</p>
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

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);
console.log(`✓ preview/line-brief/index.html　${(html.length / 1024).toFixed(1)}KB`);
console.log(`  卡寬：單張 ${BUB.mega}px・輪播 micro ${BUB.car}px・溢出 ${OFF.right}／${OFF.bottom}px`);
console.log(`  九顆例日：${例日.map((f, i) => `${WM[i].n}=${f.m}/${f.d}`).join(" ")}`);
console.log(`  已完成 ${DONE.length} 則`);
