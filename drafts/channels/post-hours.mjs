/* LINE 貼文用的「看診時間」圖 → preview/line-post-hours/*.png
 *   node drafts/channels/post-hours.mjs
 *
 * 使用者 2026-09-07：「可是網站上的門診表是有切換效果的，LINE 商家的貼文要怎麼做」
 *
 * ⚠⚠⚠ 這一題真正的判斷：**站上那個切換是為了解決「手機螢幕放不下」，不是為了好玩。**
 *   375px 寬的一格塞不進四個科別名，所以才要點一顆標記、一次只看一科。
 *   貼文的畫布是 1080px —— **放得下**，所以正確的做法不是模擬切換，
 *   是把切換本來要藏的東西**直接攤開**（Ⓐ／Ⓑ），滑動版（Ⓒ）只是備案。
 *   同 og-topic-card 那一輪：**換一個容器就要重新設計，不要照搬。**
 *
 * ⚠⚠⚠ **排班資料只有一個出處：index.html 那張 .hours-grid 的 data-in。**
 *   在這支腳本裡再抄一份，哪天診所改排班，貼文的圖就會開始說謊而且沒有人會發現。
 *   科別的名字、時段、休診說明也全部從 index.html 讀回來 —— 同 tools/schema.mjs
 *   讀營業時間的做法（第十節第 1 條「資料不重抄」）。
 *
 * ⚠ 顏色一個都沒有新增：七科的套色與深階、--paper／--card／--rule／--ink／--ink-soft
 *   全部是 PALETTE.md 既有的值。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條：完整版 chrome 畫出來會比
 *   --window-size 少 87px，而且不報錯）。
 * ⚠ 容器裡沒有 Noto Sans TC，中文會落到 WenQuanYi Zen Hei ——
 *   這條線每一張圖都是這樣（bind-done-png 等等也是），**字級與折行要以真機為準**。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT  = path.join(ROOT, "preview", "line-post-hours");
const SRC  = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- 顏色（PALETTE.md，一個都沒有新增） ---------- */
const PAPER = "#e2e5e6", CARD = "#f4f4f5", RULE = "#cdd0d2";
const INK = "#2a2c27", SOFT = "#5c5f57";
const FILL = { general:"#3f654a", perio:"#317d78", endo:"#ae4f4d", kids:"#c28229",
               ortho:"#4478b5", prosth:"#465885", surg:"#8e6299" };
const DEEP = { general:"#2c5238", perio:"#2a6d69", endo:"#89202d", kids:"#9e6301",
               ortho:"#31637f", prosth:"#2a4677", surg:"#784e84" };

/* ⚠ 短名只給 Ⓐ 的格子用（144px 欄寬塞不下「植牙・假牙重建」六個字）。
   其餘每一處一律用 index.html 上的全名。**這是版面被迫的縮寫，要使用者點頭。** */
const SHORT = { "植牙・假牙重建": "植牙假牙" };

/* ---------- 從 index.html 讀回來（唯一的出處） ---------- */
function parse() {
  const card = SRC.slice(SRC.indexOf('<div class="info-card" data-hue="taupe">'));
  const tbl  = card.slice(card.indexOf('<table class="hours-grid">'), card.indexOf("</table>"));

  const specs = [...card.matchAll(/data-spec="([a-z]+)"[^>]*>([^<]+)</g)]
    .map(m => ({ id: m[1], name: m[2].trim() })).filter(s => s.id !== "all");
  const allLabel = (card.match(/data-spec="all"[^>]*>([^<]+)</) || [])[1].trim();

  const days = [...tbl.matchAll(/<th scope="col">([^<]+)<\/th>/g)].map(m => m[1]);
  const rows = [...tbl.matchAll(
    /<th scope="row"><b>([^<]+)<\/b>([^<]+)<\/th>([\s\S]*?)<\/tr>/g)]
    .map(m => ({
      part: m[1], time: m[2].trim(),
      cells: [...m[3].matchAll(/data-in="([^"]*)"/g)].map(c => c[1].split(/\s+/).filter(Boolean))
    }));
  const note = (card.match(/class="info-note">([^<]+)</) || [])[1].trim();

  /* 守門：讀回來的東西要對得上，對不上就不要出圖 */
  if (specs.length !== 7) throw new Error(`科別讀到 ${specs.length} 個，應該是 7`);
  if (days.length !== 5)  throw new Error(`日子讀到 ${days.length} 欄，應該是 5`);
  if (rows.length !== 3)  throw new Error(`時段讀到 ${rows.length} 列，應該是 3`);
  for (const r of rows) if (r.cells.length !== 5) throw new Error(`${r.part} 只有 ${r.cells.length} 格`);
  const known = new Set(specs.map(s => s.id));
  for (const r of rows) for (const c of r.cells) for (const s of c)
    if (!known.has(s)) throw new Error(`data-in 出現不認識的科別：${s}`);
  return { specs, allLabel, days, rows, note };
}
const D = parse();

/* 每一科在哪幾節（Ⓒ 與統計用） */
const slotsOf = (id) => {
  const out = [];
  D.rows.forEach((r, ri) => r.cells.forEach((c, ci) => { if (c.includes(id)) out.push([ri, ci]); }));
  return out;
};

/* ---------- 對比度：字是要讀的，過不了 AA 就不要出圖 ---------- */
const lin = c => { c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); };
const lum = h => { const n = parseInt(h.slice(1),16);
  return .2126*lin(n>>16&255) + .7152*lin(n>>8&255) + .0722*lin(n&255); };
const ratio = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };

const contrast = [];
for (const s of D.specs) {
  contrast.push([`${s.name} 深階字對卡色`, ratio(DEEP[s.id], CARD)]);
  contrast.push([`${s.name} 填色上的白字`, ratio("#ffffff", FILL[s.id])]);
}
contrast.push(["墨對卡色", ratio(INK, CARD)], ["柔墨對卡色", ratio(SOFT, CARD)]);

console.log("── 從 index.html 讀回來 ──");
console.log(`  科別 ${D.specs.length}：${D.specs.map(s=>s.name).join("／")}`);
console.log(`  日子 ${D.days.join("")}　時段 ${D.rows.map(r=>r.part+r.time).join("　")}`);
for (const s of D.specs) {
  const sl = slotsOf(s.id);
  console.log(`  ${s.name.padEnd(8,"　")} ${String(sl.length).padStart(2)} 節　`
    + sl.map(([ri,ci]) => D.days[ci] + D.rows[ri].part).join("・"));
}
console.log(`  說明：${D.note}`);

/* ---------- 版面 ---------- */
const W = 1080, H = 1080;
const MARK = fs.readFileSync(path.join(ROOT, "brand", "shapes", "mark.svg"), "utf8")
  .replace(/<svg([^>]*)>/, '<svg$1 style="width:104px;height:auto;display:block">');
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!PHONE) throw new Error("index.html 裡找不到電話（畫面上的寫法是 05-5339369）");

const CSS = `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${PAPER};font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif;
     color:${INK};-webkit-font-smoothing:antialiased}
.sheet{width:${W}px;height:${H}px;padding:56px 52px 48px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:16px;margin-bottom:26px}
.brand svg{color:${DEEP.general}}
.brand b{font-size:30px;font-weight:700;letter-spacing:.04em}
h1{font-size:56px;font-weight:700;letter-spacing:.06em;line-height:1.1}
.sub{font-size:25px;color:${SOFT};margin-top:12px;letter-spacing:.03em}
.card{background:${CARD};border:1px solid ${RULE};border-radius:16px;
      margin-top:26px;padding:8px 20px 14px;flex:1;display:flex;flex-direction:column}
table{width:100%;border-collapse:collapse;table-layout:fixed;flex:1}
col.lab{width:188px}
thead th{font-size:30px;font-weight:700;padding:14px 0 12px;color:${INK}}
tbody td{border-top:1px solid ${RULE};text-align:center;vertical-align:middle;padding:12px 4px}
tbody th{border-top:1px solid ${RULE};text-align:left;padding:12px 10px 12px 4px;
         font-weight:400;line-height:1.15}
tbody th b{display:block;font-size:30px;font-weight:700}
tbody th i{font-style:normal;font-size:21px;color:${SOFT};letter-spacing:.01em}
.foot{display:flex;align-items:flex-end;justify-content:space-between;margin-top:24px;gap:18px}
.foot .note{font-size:23px;color:${SOFT};line-height:1.5}
.foot .tel{font-size:23px;color:${SOFT};text-align:right;white-space:nowrap;line-height:1.5}
.foot .tel b{display:block;font-size:36px;color:${DEEP.general};letter-spacing:.02em}
/* Ⓐ 格子裡直接寫科別 */
.nm{font-size:26px;font-weight:700;line-height:1.42;letter-spacing:.02em}
/* Ⓑ 色點 ＋ 圖例 */
.dots{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;align-items:center}
.dot{width:26px;height:26px;border-radius:50%}
.leg{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:12px;justify-content:center}
.leg + .leg{margin-top:10px}
.leg span{display:flex;align-items:center;gap:9px;font-size:23px;color:${INK}}
.leg i{width:20px;height:20px;border-radius:50%;display:block}
/* Ⓒ 一科一張 */
.big{width:38px;height:38px;border-radius:50%;margin:0 auto}
.sm{width:15px;height:15px;border-radius:50%;background:${RULE};margin:0 auto}
.when{display:inline-block;border-radius:12px;padding:12px 24px;font-size:32px;
      font-weight:700;color:#fff;letter-spacing:.04em;margin-top:18px}
`;

const brandBar = `<div class="brand">${MARK}<b>芳仁牙醫診所</b></div>`;
const foot = (extra) => `<div class="foot">
  <div class="note">${extra || D.note}</div>
  <div class="tel">診所電話<b>${PHONE}</b></div></div>`;
const head = (rowSpan) => `<thead><tr><td></td>${
  D.days.map(d => `<th scope="col">${d}</th>`).join("")}</tr></thead>`;
const rowHead = (r) => `<th><b>${r.part}</b><i>${r.time}</i></th>`;

/* Ⓐ 攤開・寫字 */
const caseA = () => `<div class="sheet">${brandBar}
  <h1>看診時間</h1><div class="sub">一週的門診，以及每一節有哪些科別</div>
  <div class="card"><table><colgroup><col class="lab"><col span="5"></colgroup>${head()}
  <tbody>${D.rows.map(r => `<tr>${rowHead(r)}${r.cells.map(c => `<td>${
    c.map(id => { const s = D.specs.find(x => x.id === id);
      return `<div class="nm" style="color:${DEEP[id]}">${SHORT[s.name] || s.name}</div>`; }).join("")
  }</td>`).join("")}</tr>`).join("")}</tbody></table></div>${foot()}</div>`;

/* Ⓑ 攤開・色點 ＋ 圖例 */
const caseB = () => `<div class="sheet">${brandBar}
  <h1>看診時間</h1><div class="sub">一週的門診，以及每一節有哪些科別</div>
  <div class="card"><table><colgroup><col class="lab"><col span="5"></colgroup>${head()}
  <tbody>${D.rows.map(r => `<tr>${rowHead(r)}${r.cells.map(c => `<td><div class="dots">${
    c.map(id => `<i class="dot" style="background:${FILL[id]}"></i>`).join("")
  }</div></td>`).join("")}</tr>`).join("")}</tbody></table>
  ${[D.specs.slice(0, 4), D.specs.slice(4)].map(g => `<div class="leg">${g.map(s =>
    `<span><i style="background:${FILL[s.id]}"></i>${s.name}</span>`).join("")}</div>`).join("")}
  </div>${foot()}</div>`;

/* Ⓒ 一科一張（＝ 把站上那個切換做成滑動） */
const caseC = (spec) => {
  const sl = spec ? slotsOf(spec.id) : [];
  const days = [...new Set(sl.map(([, ci]) => D.days[ci]))];
  const parts = [...new Set(sl.map(([ri]) => D.rows[ri].part))];
  /* 「週三　早・午・晚」這種一句話的摘要：只有在那一科集中在同一天（或同一節）才寫得出來 */
  const line = !spec ? ""
    : days.length === 1 ? `週${days[0]}　${parts.join("・")}`
    : parts.length === 1 ? `週${days.join("・")}　${parts[0]}`
    : sl.map(([ri, ci]) => `${D.days[ci]}${D.rows[ri].part}`).join("・");
  const on = spec ? FILL[spec.id] : DEEP.general;
  return `<div class="sheet">${brandBar}
  <h1>${spec ? spec.name : D.allLabel}</h1>
  <div class="sub">${spec ? "這一科的門診時段" : "一週的門診時段"}</div>
  <div class="card"><table><colgroup><col class="lab"><col span="5"></colgroup>${head()}
  <tbody>${D.rows.map((r, ri) => `<tr>${rowHead(r)}${r.cells.map((c, ci) =>
    `<td>${!spec ? `<div class="big" style="background:${DEEP.general}"></div>`
      : c.includes(spec.id) ? `<div class="big" style="background:${on}"></div>`
      : `<div class="sm"></div>`}</td>`).join("")}</tr>`).join("")}</tbody></table>
  ${spec ? `<div style="text-align:center"><span class="when" style="background:${on}">${line}</span></div>` : ""}
  </div>${foot()}</div>`;
};


/* ---------- Ⓐ2：把「認得出是誰、在講什麼」收進安全帶 ------------------
 * 上面那個模擬量出來：大格只看得到中間 537 列（y 271~809），品牌條、標題、
 * 電話三樣全在被切掉的那兩截裡 —— 大格因此讀起來像一張沒有出處的表。
 * ⚠⚠ **唯一同時滿足兩格的解，是把識別放進中間那條帶子裡**：
 *   大格 ＝ 正好看到那條帶子；小格 ＝ 整張都看得到（帶子也在裡面）。
 *   （把圖直接做成 2:1 不行 —— 小格會改成左右各切 25%，中間三欄以外全沒了。）
 * 做法：品牌條與電話**搬進卡片裡面**，卡片本身壓在 y 250~830；
 *   外面上緣留大標題（大格看不到沒關係，帶子裡已經寫了一次）。
 */
const CSS3 = `
.rows{padding:2px 22px 0}
.row{display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid ${RULE}}
.row:last-child{border-bottom:0}
.sp{flex:none;width:264px;font-size:25px;font-weight:700;letter-spacing:.02em;
    display:flex;align-items:center;gap:11px}
.sp i{width:17px;height:17px;border-radius:50%;flex:none}
.gs{display:flex;gap:22px;flex-wrap:wrap}
.g{font-size:25px;color:${INK};letter-spacing:.06em;white-space:nowrap}
.g b{font-weight:700;color:${SOFT};margin-right:9px;letter-spacing:0}
`;

const CSS2X = CSS + `
.sheet.safe{padding:0}
.sheet.safe .top{height:272px;padding:56px 52px 0}
.sheet.safe h1{font-size:52px}
.sheet.safe .top{flex:none}
.sheet.safe .card{margin:0 52px;padding:0;flex:none}
.sheet.safe .cbar{display:flex;align-items:center;gap:14px;padding:16px 22px 14px;
                  border-bottom:1px solid ${RULE}}
.sheet.safe .cbar svg{width:74px;color:${DEEP.general}}
.sheet.safe .cbar b{font-size:24px;letter-spacing:.03em}
.sheet.safe .cbar em{font-style:normal;font-size:24px;color:${SOFT};margin-left:auto;
                     letter-spacing:.03em}
.sheet.safe table{padding:0 20px}
.sheet.safe thead th{font-size:26px;padding:8px 0 6px}
.sheet.safe tbody td{padding:5px 4px}
.sheet.safe tbody th{padding:5px 10px 5px 4px}
.sheet.safe tbody th b{font-size:25px}
.sheet.safe tbody th i{font-size:18px}
.sheet.safe .nm{font-size:22px;line-height:1.34}
.sheet.safe .ctel{display:flex;align-items:baseline;justify-content:center;gap:14px;
                  border-top:1px solid ${RULE};padding:12px 0 14px;margin:0 20px}
.sheet.safe .ctel span{font-size:21px;color:${SOFT}}
.sheet.safe .ctel b{font-size:33px;color:${DEEP.general};letter-spacing:.02em}
.sheet.safe .bot{padding:0 52px;flex:1;display:flex;align-items:center;
                 font-size:23px;color:${SOFT}}
`;
const CSS2 = CSS2X + CSS3 + `
`;
const caseA2 = () => `<div class="sheet safe">
  <div class="top"><h1>看診時間</h1><div class="sub">一週的門診，以及每一節有哪些科別</div></div>
  <div class="card">
    <div class="cbar">${MARK}<b>芳仁牙醫診所</b><em>看診時間</em></div>
    <table><colgroup><col class="lab"><col span="5"></colgroup>${head()}
    <tbody>${D.rows.map(r => `<tr>${rowHead(r)}${r.cells.map(c => `<td>${
      c.map(id => { const sp = D.specs.find(x => x.id === id);
        return `<div class="nm" style="color:${DEEP[id]}">${SHORT[sp.name] || sp.name}</div>`; }).join("")
    }</td>`).join("")}</tr>`).join("")}</tbody></table>
    <div class="ctel"><span>診所電話</span><b>${PHONE}</b></div>
  </div>
  <div class="bot">${D.note}</div></div>`;


/* ---------- Ⓓ：一科一行（照「早／午／晚」分組） ----------------------
 * 2026-09-07 使用者傳來「最新貼文 → 新增項目」的表單：一個項目 ＝ 一張
 * **方形**的照片 ＋ 一段「詳情」文字，而且說明寫著「以及**您設定的照片**」——
 * ⚠⚠⚠ **所以這個區塊不必先發 VOOM 貼文，可以直接傳圖**（上一輪的前提要修正）。
 *
 * ⚠⚠ 有了「詳情」那段字之後，圖就不必把每一件事都扛下來 —— 於是可以問一個
 *   更好的問題：**病人真正要查的是「我這一科什麼時候可以來」，不是「週三下午有誰」。**
 *   格子表回答的是後者（那是診所排班的視角），Ⓓ 回答的是前者。
 *   ＝ COPY.md 第九節那條：他不是想認識這個科別，是帶著一個具體的問題來的。
 *
 * ⚠ 排法是「早／午／晚 各列出哪幾天」，不是逐節列出：
 *   實測七科用這個排法**每一科都收得進一行**，而且顯微根管會變成
 *   「早 三　午 三　晚 三」——**全在週三**這件事自己跳出來，不必寫成一句話。
 */
const byPart = (id) => D.rows.map((r, ri) => ({
  part: r.part,
  days: r.cells.map((c, ci) => c.includes(id) ? D.days[ci] : null).filter(Boolean)
})).filter(g => g.days.length);

const caseD = () => `<div class="sheet safe">
  <div class="top"><h1>哪一科　什麼時候</h1><div class="sub">一週的門診，一科一行</div></div>
  <div class="card">
    <div class="cbar">${MARK}<b>芳仁牙醫診所</b><em>看診時間</em></div>
    <div class="rows">${D.specs.map(sp => `<div class="row">
      <div class="sp" style="color:${DEEP[sp.id]}">
        <i style="background:${FILL[sp.id]}"></i>${sp.name}</div>
      <div class="gs">${byPart(sp.id).map(g =>
        `<span class="g"><b>${g.part}</b>${g.days.join("")}</span>`).join("")}</div>
    </div>`).join("")}</div>
    <div class="ctel"><span>診所電話</span><b>${PHONE}</b></div>
  </div>
  <div class="bot">${D.note}</div></div>`;


/* 大格照 cover 裁之後，1080 的圖看得到的原圖列數 */
const PW = 823, PH = 409 + 4 + 410;
const band2 = () => Math.round(W * (409 / PW));

/* ---------- 出圖 ---------- */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;      /* ⚠ 一律 headless_shell（第九節第 18 條） */
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: W, height: H } });
fs.mkdirSync(OUT, { recursive: true });

const shots = [["a", caseA()], ["a2", caseA2()], ["d", caseD()], ["b", caseB()], ["c-all", caseC(null)],
  ...D.specs.map(s => [`c-${s.id}`, caseC(s)])];
const made = [];
for (const [tag, html] of shots) {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${CSS2}</style>${html}`);
  const box = await page.locator(".sheet").boundingBox();
  if (Math.round(box.width) !== W || Math.round(box.height) !== H)
    throw new Error(`${tag} 版面是 ${box.width}×${box.height}，不是 ${W}×${H}`);
  /* 守門：內容有沒有溢出那張紙（格子塞太多科別的話會從卡片底下擠出去） */
  const over = await page.evaluate(() => {
    const s = document.querySelector(".sheet").getBoundingClientRect();
    return [...document.querySelectorAll(".sheet *")].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width && (r.bottom > s.bottom + .5 || r.right > s.right + .5 || r.left < s.left - .5);
    }).map(el => el.className || el.tagName);
  });
  if (over.length) throw new Error(`${tag} 有 ${over.length} 個元素溢出：${over.slice(0,4)}`);
  if (tag === "a2" || tag === "d") {
    /* ⚠ 這一案存在的理由就是「大格看得到卡片」，所以那件事要用量的，不要用看的 */
    const top = (W - band2()) / 2, bot = W - top;
    const c = await page.locator(".sheet.safe .card").boundingBox();
    if (c.y < top - .5 || c.y + c.height > bot + .5)
      throw new Error(`${tag} 的卡片是 ${c.y.toFixed(1)}~${(c.y + c.height).toFixed(1)}，`
        + `超出大格看得到的 ${top.toFixed(1)}~${bot.toFixed(1)}`);
  }
  const file = path.join(OUT, `post-hours-${tag}.png`);
  await page.screenshot({ path: file });
  made.push([tag, fs.statSync(file).size]);
}
await browser.close();

/* ⚠ 兒童牙科填色上的白字 3.22 是 2026-08-08 使用者看過實際樣子之後定的取捨
   （CLAUDE.md 定案表：「維持白字…不要再提」），不列為失敗。 */
const KNOWN = new Set(["兒童牙科 填色上的白字"]);
const bad = contrast.filter(([n, r]) => r < 4.5 && !KNOWN.has(n));
const tradeoff = contrast.filter(([n, r]) => r < 4.5 && KNOWN.has(n));
console.log("\n── 出圖 ──");
for (const [t, n] of made) console.log(`  post-hours-${t}.png　${(n/1024).toFixed(0)} KB`);
console.log(`\n對比度 ${contrast.length} 項，過不了 AA 的 ${bad.length} 項`
  + (bad.length ? "：\n  " + bad.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("\n  ") : ""));
for (const [n, r] of tradeoff) console.log(`  （已知取捨　${n} ${r.toFixed(2)}）`);
if (bad.length) throw new Error("有字過不了 AA，不出圖");


/* ---------- 「詳情」那一欄要貼的字 ------------------------------------
 * 表單上一個項目 ＝ 一張照片 ＋ 一段「詳情」。所以圖不必把每一件事都扛下來。
 * ⚠ 這段字也從同一份資料長出來（時段、休診說明、電話都不重打）。
 * ⚠⚠ **不要補回「週六、週日休診。」** —— 那句 2026-08-13 由使用者拿掉了，
 *   理由是表只列一到五就看得出來；這裡的表一樣只列一到五，同一個理由成立。
 * ⚠⚠ 紅線：這個帳號沒有專人即時回覆，所以不可以出現「有問題隨時問」那一類的話
 *   （第十一之三節）。下面那道掃描就是擋這個。
 */
const detail =
  `一週的門診時段，以及每一節有哪些科別。\n`
  + D.rows.map(r => `${r.part} ${r.time}`).join("　") + `\n`
  + D.note.replace(/。$/, "") + `　${PHONE}`;

const RED = [/隨時(問|詢問|聯絡)/, /都可以問/, /問到/, /即時回/, /小編/, /專人/, /馬上回/];
for (const re of RED) if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);
fs.writeFileSync(path.join(OUT, "detail.txt"), detail + "\n");
console.log("\n── 「詳情」欄要貼的字（preview/line-post-hours/detail.txt）──");
console.log(detail.split("\n").map(l => "  " + l).join("\n"));

/* ---------- 主頁那三格長什麼樣（裁切模擬） --------------------------
 * ⚠⚠⚠ 這是 2026-08-23「分享卡會被訊息 app 左右裁掉」那條教訓在這裡的變形。
 *   從使用者 2026-09-07 的截圖量：整塊寬 823、**大格 823×409 ＝ 2.01:1**、
 *   底下兩格各 410×410 ＝ **1:1**。所以一張 1:1 的圖擺進大格，
 *   照 cover 裁的話**上下各被切掉 25%** —— 標題與電話都在那兩截裡。
 * ⚠ LINE 到底是 cover 裁還是留白，我們**沒有驗過**（後台按一下「預覽」就知道）。
 *   這張圖畫的是「照 cover 裁」那一種，也就是最壞的情況。
 */
const cell = (f, w, h) =>
  `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">
     <img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}"
          style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
const profile = (big, s1, s2) => `<div style="width:${PW}px;height:${PH}px;background:#fff;
    display:flex;flex-direction:column;gap:4px">
  ${cell(big, PW, 409)}
  <div style="display:flex;gap:3px">${cell(s1, 410, 410)}${cell(s2, 410, 410)}</div></div>`;

const browser2 = await chromium.launch({ executablePath: chrome });
const page2 = await browser2.newPage({ viewport: { width: PW, height: PH } });
for (const [tag, big] of [["a", "post-hours-a.png"], ["a2", "post-hours-a2.png"], ["d", "post-hours-d.png"]]) {
  await page2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}</style>`
    + profile(big, "post-hours-c-endo.png", "post-hours-c-kids.png"));
  await page2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await page2.screenshot({ path: path.join(OUT, `profile-3up-${tag}.png`) });
}
fs.rmSync(path.join(OUT, "profile-3up.png"), { force: true });

/* 大格實際看得到的那一條：1080 的圖裁成 2.01:1 ＝ 只剩中間 537 列（上下各切 271） */
const band = band2();
console.log(`\n── 主頁三格 ──`);
console.log(`  大格 ${PW}×409（2.01:1）：1080 的圖只看得到中間 ${band} 列，上下各切掉 ${(W - band) / 2}`);
console.log(`  小格 410×410（1:1）：1080 的圖整張都看得到`);
await browser2.close();
