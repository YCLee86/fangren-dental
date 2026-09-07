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

/* ⚠⚠⚠ Ⓖ3「每科一顆記號」用的是 brand/shapes 那九顆（同一個標誌的九種變體）。
   挑法避開 r1c3×r2c3 —— 在 22px 下那一對只差 5.6%。
   **但量出來的結論是這條路不成立**：九顆畫成 22px（＝格子裡記號的大小），
   兩兩不同的像素比例**最不像的一對也只有 20.9%、中位 16.7%**
   （對照浮水印那一輪在 150px 下是最不像 52.0%、中位 26.6%）。
   ⚠ 通則（已在 CLAUDE.md）：**在成品的尺寸上量，不要在素材的尺寸上量。** */
const SHAPE = { general:"r1c1", perio:"r1c2", ortho:"r3c3", endo:"r2c1",
                prosth:"r2c2", surg:"r2c3", kids:"r3c2" };
const mark22 = Object.fromEntries(Object.entries(SHAPE).map(([id, sh]) => [id,
  fs.readFileSync(path.join(ROOT, "brand", "shapes", `shape-${sh}.svg`), "utf8")
    .replace(/<svg([^>]*?)(width|height)="[\d.]+"/g, "<svg$1")
    .replace(/<svg/, '<svg class="mk"')]));

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


/* ---------- 版面 ------------------------------------------------------
 * ⚠⚠⚠ 2026-09-07 使用者看過五案：「覺得不夠乾淨　簡潔」。
 *   拆開來是三件，三件各自要治（同第九節第 17 條那條淡出）：
 *   ① **同一件事寫了兩次** —— 舊版「看診時間」出現在大標題和卡片右上角，
 *      「請來電確認」和「診所電話」也在講同一件事。
 *   ② **層次太多** —— 大標題／副標／卡片框／卡片內的品牌條／頁尾註 ＝ 五層。
 *   ③ **顏色太花** —— Ⓐ 一格四個彩色的名字，整張圖同時出現七種顏色。
 *      ⚠⚠ 這一件推翻我上一輪的判斷只講對一半：**站上那個切換不只解決
 *      「一格放不進四個名字」，也解決「七色同時出現太花」** —— 它一次只上一科的色。
 *
 * 所以這一版：**一張圖只有三塊**（識別／表／電話），沒有卡片框、沒有副標、
 *   沒有大標題，文字一律墨與柔墨，科別的顏色收成一顆小點。
 * ⚠ 而且整塊內容**收進中間那條安全帶**（y 271~809）——
 *   上下留紙色的空白，同時解決「乾淨」與「大格會裁掉識別」兩件事。
 *   留白本身就是乾淨，不是浪費。
 *
 * ⚠⚠ 「乾淨簡潔」也淘汰了舊的 Ⓑ（要來回對照圖例）與 Ⓒ（要滑八張），
 *   所以這一版只剩兩案：**格子** 與 **一科一行**。
 */
const W = 1080, H = 1080;
const BAND = Math.round(W * (409 / 823));        /* 大格看得到的列數 ＝ 537 */
const TOP = (H - BAND) / 2, BOT = H - TOP;
const MARK = fs.readFileSync(path.join(ROOT, "brand", "shapes", "mark.svg"), "utf8")
  .replace(/<svg([^>]*)>/, '<svg$1 style="width:82px;height:auto;display:block">');
const PHONE = (SRC.match(/05-\d{7}/) || [])[0];
if (!PHONE) throw new Error("index.html 裡找不到電話（畫面上的寫法是 05-5339369）");

const CSS = `
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px}
body{background:${CARD};color:${INK};-webkit-font-smoothing:antialiased;
     font-family:"Noto Sans TC","WenQuanYi Zen Hei",sans-serif}
.sheet{width:${W}px;height:${H}px;display:flex;flex-direction:column;justify-content:center}
.band{padding:0 74px}
.id{display:flex;align-items:center;gap:16px;padding-bottom:18px}
.id svg{color:${DEEP.general}}
.id b{font-size:31px;font-weight:700;letter-spacing:.05em}
.id em{font-style:normal;font-size:31px;color:${SOFT};margin-left:auto;letter-spacing:.14em}
.rule{height:1px;background:${RULE}}
.tel{display:flex;align-items:baseline;gap:16px;padding-top:18px;
     font-size:23px;color:${SOFT};letter-spacing:.02em}
.tel b{font-size:31px;font-weight:400;color:${DEEP.general};margin-left:auto;letter-spacing:.03em}

/* 格子 */
table{width:100%;border-collapse:collapse;table-layout:fixed}
col.lab{width:176px}
thead th{font-size:27px;font-weight:400;color:${SOFT};padding:11px 0 7px;letter-spacing:.1em}
tbody td{text-align:center;vertical-align:middle;padding:8px 4px}
tbody th{text-align:left;padding:8px 8px 8px 0;font-weight:400;line-height:1.2}
tbody th b{display:block;font-size:26px;font-weight:400;letter-spacing:.1em}
tbody th i{font-style:normal;font-size:19px;color:${SOFT}}
tbody tr + tr th, tbody tr + tr td{border-top:1px solid ${RULE}}
.nm{font-size:23px;line-height:1.34;letter-spacing:.02em}
.mk-row{display:flex;align-items:center;justify-content:center;gap:7px}
svg.mk{width:22px;height:22px;flex:none;object-fit:contain}

/* 一科一行 */
.rows{padding-top:6px}
.row{display:flex;align-items:center;gap:16px;padding:12px 0}
.row + .row{border-top:1px solid ${RULE}}
.sp{flex:none;width:250px;font-size:25px;letter-spacing:.03em;
    display:flex;align-items:center;gap:13px}
.sp i{width:14px;height:14px;border-radius:50%;flex:none}
.g{font-size:25px;letter-spacing:.1em;white-space:nowrap;margin-right:26px}
.g b{font-weight:400;color:${SOFT};margin-right:8px;letter-spacing:.02em}
`;

const shell = (inner) => `<div class="sheet"><div class="band">
  <div class="id">${MARK}<b>芳仁牙醫診所</b><em>看診時間</em></div>
  <div class="rule"></div>
  ${inner}
  <div class="rule"></div>
  <div class="tel">${D.note.replace(/。$/, "")}<b>${PHONE}</b></div>
</div></div>`;

/* Ⓖ 格子：日子當欄、早午晚當列，格子裡直接寫科別。
 * 2026-09-07 使用者：「G 文字的比較好，但有需要這麼多顏色嗎…或是每個科別各自用一個 logo」
 * 三個方案：
 *   ink   全部同一個墨（＝他講的那一個）
 *   rank  **一般牙科退一階（建議）** —— ⚠⚠⚠ 它在 15 節裡佔 12 節，
 *         是「這一節有沒有開診」的背景，不是「這一節有什麼特別的」的資訊。
 *         和其他六科畫成一樣重，等於讓最不需要找的東西佔掉最多視覺重量
 *         （25 個名字裡有 12 個是它）。退一階之後，五科特別門診自己跳出來。
 *   mark  每科一顆記號（＝他的第二個提議，量測見上面 SHAPE 那一段）
 */
const grid = (mode) => shell(`<table><colgroup><col class="lab"><col span="5"></colgroup>
  <thead><tr><td></td>${D.days.map(d => `<th>${d}</th>`).join("")}</tr></thead>
  <tbody>${D.rows.map(r => `<tr>
    <th><b>${r.part}</b><i>${r.time}</i></th>${r.cells.map(c => `<td>${
      c.map(id => { const sp = D.specs.find(x => x.id === id);
        const nm = SHORT[sp.name] || sp.name;
        const col = mode === "rank" && id === "general" ? SOFT : INK;
        return mode === "mark"
          ? `<div class="nm mk-row" style="color:${col}">${mark22[id]}${nm}</div>`
          : `<div class="nm" style="color:${col}">${nm}</div>`;
      }).join("")}</td>`).join("")}</tr>`).join("")}</tbody></table>`);

/* Ⓛ 一科一行：照「早／午／晚」各列出哪幾天 */
const byPart = (id) => D.rows.map(r => ({
  part: r.part,
  days: r.cells.map((c, ci) => c.includes(id) ? D.days[ci] : null).filter(Boolean)
})).filter(g => g.days.length);

const list = () => shell(`<div class="rows">${D.specs.map(sp => `<div class="row">
    <div class="sp"><i style="background:${FILL[sp.id]}"></i>${sp.name}</div>
    <div>${byPart(sp.id).map(g => `<span class="g"><b>${g.part}</b>${g.days.join("")}</span>`).join("")}</div>
  </div>`).join("")}</div>`);

/* ---------- 「詳情」那一欄要貼的字 ----------
 * 一個一覽項目 ＝ 一張方形照片 ＋ 一段「詳情」。所以圖不必把每一件事都扛下來。
 * ⚠ 這段字也從同一份資料長出來（時段、休診說明、電話都不重打）。
 * ⚠⚠ **不要補回「週六、週日休診。」** —— 那句 2026-08-13 由使用者拿掉了，
 *   理由是表只列一到五就看得出來；這裡的表一樣只列一到五。
 * ⚠⚠ 紅線：這個帳號沒有專人即時回覆，不可以出現「有問題隨時問」那一類的話。
 */
const detail = `一週的門診時段，以及每一節有哪些科別。\n`
  + D.rows.map(r => `${r.part} ${r.time}`).join("　") + `\n`
  + D.note.replace(/。$/, "") + `　${PHONE}`;
for (const re of [/隨時(問|詢問|聯絡)/, /都可以問/, /即時回/, /小編/, /馬上回/])
  if (re.test(detail)) throw new Error(`「詳情」踩到紅線：${re}`);

/* ---------- 對比度：字是要讀的 ---------- */
const lin = c => { c /= 255; return c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4); };
const lum = h => { const n = parseInt(h.slice(1),16);
  return .2126*lin(n>>16&255) + .7152*lin(n>>8&255) + .0722*lin(n&255); };
const ratio = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const contrast = [["墨對底", ratio(INK, CARD)], ["柔墨對底", ratio(SOFT, CARD)],
  ...D.specs.map(s => [`${s.name} 深階對底`, ratio(DEEP[s.id], CARD)])];
const bad = contrast.filter(([, r]) => r < 4.5);
if (bad.length) throw new Error("過不了 AA：" + bad.map(([n,r]) => `${n} ${r.toFixed(2)}`).join("、"));

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
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith(".png"))) fs.rmSync(path.join(OUT, f));

const made = [];
for (const [tag, html] of [["ink", grid("ink")], ["rank", grid("rank")],
                           ["mark", grid("mark")], ["list", list()]]) {
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${CSS}</style>${html}`);
  /* ⚠⚠ 這一版存在的理由就是「乾淨 ＋ 大格看得到全部」，所以那件事要用量的。
     整塊內容一定要落在安全帶裡（大格只看得到 y ${TOP}~${BOT}）。 */
  const b = await page.locator(".band").boundingBox();
  if (b.y < TOP - .5 || b.y + b.height > BOT + .5)
    throw new Error(`${tag} 的內容是 ${b.y.toFixed(1)}~${(b.y + b.height).toFixed(1)}，`
      + `超出大格看得到的 ${TOP}~${BOT}`);
  const over = await page.evaluate(() => [...document.querySelectorAll(".sheet *")]
    .filter(el => { const r = el.getBoundingClientRect();
      return r.width && (r.right > 1080.5 || r.left < -.5); }).length);
  if (over) throw new Error(`${tag} 有 ${over} 個元素溢出`);
  await page.screenshot({ path: path.join(OUT, `post-hours-${tag}.png`) });
  made.push([tag, b]);
}

/* ---------- 主頁那三格（裁切模擬） ---------- */
const PW = 823;
const cell = (f, w, h) =>
  `<div style="width:${w}px;height:${h}px;overflow:hidden;background:${RULE}">
     <img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}"
          style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
const page2 = await browser.newPage({ viewport: { width: PW, height: 409 + 4 + 410 } });
await page2.setContent(`<!doctype html><meta charset="utf-8"><style>*{margin:0}</style>
  <div style="width:${PW}px;background:#fff;display:flex;flex-direction:column;gap:4px">
    ${cell("post-hours-rank.png", PW, 409)}
    <div style="display:flex;gap:3px">${cell("post-hours-ink.png", 410, 410)}${cell("post-hours-list.png", 410, 410)}</div>
  </div>`);
await page2.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
await page2.screenshot({ path: path.join(OUT, "profile-3up.png") });
await browser.close();

fs.writeFileSync(path.join(OUT, "detail.txt"), detail + "\n");
console.log("\n── 出圖 ──");
for (const [t, b] of made)
  console.log(`  post-hours-${t}.png　內容 ${b.y.toFixed(0)}~${(b.y + b.height).toFixed(0)}`
    + `（安全帶 ${TOP}~${BOT}，餘 ${(b.y - TOP).toFixed(0)}）`);
console.log(`  profile-3up.png`);
console.log(`\n對比度 ${contrast.length} 項全部過 AA（最低 ${
  Math.min(...contrast.map(c => c[1])).toFixed(2)}）`);
console.log("\n── 「詳情」欄要貼的字 ──\n" + detail.split("\n").map(l => "  " + l).join("\n"));
