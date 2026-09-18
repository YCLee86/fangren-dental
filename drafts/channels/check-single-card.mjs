#!/usr/bin/env node
/* /preview/line-single-card/ 的守門
 *
 *   node drafts/channels/check-single-card.mjs
 *
 * ⚠ 最強的一道是第 ① 道：重跑一次產生器、逐位比對 —— 對不上就表示有人手改了那一頁，
 *   或改了出處（booked-card.json／vendor-log.json／stand-card.json／wm-sizes.json）卻沒重跑。
 * ⚠⚠ 量的是**畫出來的東西**不是屬性：卡片真的畫成 268／162、帶子真的**夾在日期底下
 *   而且底下還有東西**（2026-09-18 從「貼著卡片下緣」換過來的）、輪播那張卡的日期
 *   真的折成兩列而且「星期五」沒被拆開。
 * ⚠ 位置那一道要量「日期的下緣 ≤ 帶子的上緣、帶子的下緣 ≤ 底下那一塊的上緣」，
 *   不要只看 DOM 順序 —— 順序對、畫出來卻疊在一起的話，那一道會放行。
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DIR = join(ROOT, "preview", "line-single-card");
const bad = [];
const ok = (t) => console.log("  ✓ " + t);
const no = (t) => { bad.push(t); console.log("  ✗ " + t); };

/* ① 重跑逐位比對 */
try {
  execFileSync("node", [join(HERE, "single-card.mjs"), "--check"], { stdio: "pipe" });
  ok("① 重跑產生器，那一頁與每一張帶子逐位相同");
} catch (e) {
  const 句 = String(e.stderr || e).split("\n").map((x) => x.trim())
    .filter((x) => x && !/^at /.test(x) && !/^Node\.js /.test(x) && !/^\^+$/.test(x));
  no("① 重跑對不上（或產生器自己擋下來了）：" + (句.find((x) => /^(✗|Error)/.test(x)) || 句[0] || ""));
}

const html = readFileSync(join(DIR, "index.html"), "utf8");
const 文 = html.replace(/<[^>]+>/g, "");

/* ② 卡上那幾行的字要來自 booked-card.json ＋ vendor-log.json，不是手打的 */
{
  const B = JSON.parse(readFileSync(join(HERE, "booked-card.json"), "utf8"));
  const V = JSON.parse(readFileSync(join(HERE, "vendor-log.json"), "utf8"));
  const 行 = [];
  const 走 = (n) => {
    if (Array.isArray(n)) return n.forEach(走);
    if (n && typeof n === "object") {
      if (n.type === "text") 行.push((n.contents || [{ text: n.text }]).map((x) => x.text).join(""));
      for (const [k, v] of Object.entries(n)) if (k[0] !== "_") 走(v);
    }
  };
  走([B.預約成功通知, B.約診紀錄查詢]);
  const 填 = (t) => t.replace(/\{\{patient\}\}/g, V.日期.姓名).replace(/\{\{date\}\}/g, V.日期.例);
  const 缺 = [...new Set(行)].map(填).filter((t) => !文.includes(t.replace(/　/g, "　")));
  /* 日期那一行在輪播上是自己斷行的，所以整串不會原樣出現 —— 那兩段各自要在 */
  const 缺2 = 缺.filter((t) => !(t === V.日期.例 && 文.includes(t.split(" 星期")[0]) && 文.includes("星期" + t.split(" 星期")[1])));
  if (缺2.length) no("② 卡上少了這幾行（或字被改過）：" + 缺2.join(" ／ "));
  else ok(`② 卡上那 ${new Set(行).size} 行逐字 ＝ booked-card.json（姓名與日期填 vendor-log.json）`);
}

/* ③ 27 顆那一條 ＝ 立牌那一輪存下來的定案檔 */
{
  const f = readFileSync(join(HERE, "band", "fangren-band-27.svg"), "utf8");
  const n = (f.match(/<svg x="/g) || []).length;
  if (n !== 27) no(`③ band/fangren-band-27.svg 裡有 ${n} 顆，該是 27`);
  else ok("③ 定案那一條在（27 顆）—— 產生器每次跑都拿它逐位比對過");
}

/* ④ 圖檔：只准有這幾個，尺寸對得上檔頭，而且都 ≤1024（Flex 的上限） */
{
  const 該 = ["index.html", "band-27-set.png", "band-27-ink.png", "band-27-spec.png",
    "band-22-set.png", "band-18-set.png", "band-16-set.png", "band-13-set.png"];
  const 有 = readdirSync(DIR).sort();
  const 多 = 有.filter((f) => !該.includes(f)), 少 = 該.filter((f) => !有.includes(f));
  if (多.length || 少.length) no(`④ 資料夾對不上（多 ${多.join("、") || "—"}／少 ${少.join("、") || "—"}）`);
  else {
    let 壞 = [];
    for (const f of 該.filter((x) => x.endsWith(".png"))) {
      const b = readFileSync(join(DIR, f));
      const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
      const m = html.match(new RegExp(`src="${f}" width="(\\d+)" height="(\\d+)"`));
      if (!m) 壞.push(`${f} 頁面上沒有引用`);
      else if (Number(m[1]) !== w || Number(m[2]) !== h) 壞.push(`${f} 宣告 ${m[1]}×${m[2]}、實檔 ${w}×${h}`);
      if (w > 1024 || h > 1024) 壞.push(`${f} ${w}×${h} 超過 LINE 的 1024`);
    }
    if (壞.length) no("④ " + 壞.join("；"));
    else ok(`④ ${該.length - 1} 張帶子都在、宣告的尺寸 ＝ 實檔、都在 1024 之內`);
  }
}

/* ⑤ 這一頁不准有 script、要有 noindex、不准印出 undefined */
{
  const 壞 = [];
  if (/<script/i.test(html)) 壞.push("有 <script>（這一頁是靜態的）");
  if (!/noindex/.test(html)) 壞.push("沒有 noindex");
  if (/undefined/.test(文)) 壞.push("頁面上印出了 undefined");
  if (壞.length) no("⑤ " + 壞.join("；")); else ok("⑤ 零 JS・noindex・沒有 undefined");
}

/* ⑤之二 小節的號碼要照文件順序由小到大 —— 2026-09-18 踩過：拿掉一節之後把剩下的
   重新編號，可是**區塊沒有跟著搬**，印出來是 1、2、4、3、5。版面完全正常，
   每一道守門都會過，只有把頁面從頭讀一次才看得出來。 */
{
  const n = [...html.matchAll(/<h2 class="h2">(\d+)　/g)].map((m) => Number(m[1]));
  const 亂 = n.some((x, i) => i && x <= n[i - 1]);
  if (!n.length) no("⑤之二 一個小節都找不到");
  else if (亂) no("⑤之二 小節的號碼沒有照順序：" + n.join("、"));
  else ok(`⑤之二 ${n.length} 個小節照順序（${n.join("、")}）`);
}

/* ⑥ 紅線：這個帳號沒有專人即時回覆（第十一之三節） */
{
  const 紅 = ["隨時問", "即時回", "馬上回", "線上客服", "有問必答", "為您服務"];
  const 中 = 紅.filter((w) => 文.includes(w));
  if (中.length) no("⑥ 踩到紅線：" + 中.join("、")); else ok("⑥ 紅線 0");
}

/* ⑦ 量畫出來的東西 */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of readdirSync(base)) {
    const p = join(base, d, "chrome-linux", "headless_shell");
    if (existsSync(p)) return p;
  }
  return null;
})();
if (!chrome) no("⑦ 找不到 headless_shell，版面一項都沒有量到");
else {
  const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
  const { chromium } = mod.default ?? mod;
  const br = await chromium.launch({ executablePath: chrome });
  const 壞 = [];
  let 卡數 = 0;
  for (const w of [430, 390, 320]) {
    const pg = await br.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    pg.on("pageerror", (e) => errs.push(String(e)));
    await pg.goto("file://" + join(DIR, "index.html"));
    await pg.waitForLoadState("networkidle");
    const m = await pg.evaluate(() => {
      const 列 = (p) => {
        const t = p.firstChild, r = {};
        for (let i = 0; i < (t.textContent || "").length; i++) {
          const rg = document.createRange(); rg.setStart(t, i); rg.setEnd(t, i + 1);
          const b = rg.getBoundingClientRect();
          if (!b.width && !b.height) continue;
          (r[Math.round(b.top)] = r[Math.round(b.top)] || []).push(t.textContent[i]);
        }
        return Object.values(r).map((a) => a.join("").trim()).filter(Boolean);
      };
      const cards = [...document.querySelectorAll(".stcard")].map((c) => {
        const cb = c.querySelector(".cb").getBoundingClientRect();
        const box = c.getBoundingClientRect();
        const im = c.querySelector("img.bnd");
        const d = [...c.querySelectorAll(".cb p")].find((p) => /2026/.test(p.textContent));
        const 首 = c.querySelector(".cb.bot") && c.querySelector(".cb.bot").firstElementChild;
        const ib = im && im.getBoundingClientRect();
        return {
          w: +(cb.width).toFixed(2),
          帶: im ? +ib.height.toFixed(2) : null,
          帶寬: im ? +ib.width.toFixed(2) : null,
          /* 日期的下緣到帶子的上緣（要 ≥0 ＝ 日期真的在帶子上面） */
          日帶: im && d ? +(ib.top - d.getBoundingClientRect().bottom).toFixed(2) : null,
          /* 帶子的下緣到底下那一塊第一個東西的上緣（要 ≥0 ＝ 那一塊真的在帶子下面） */
          帶下: im && 首 ? +(首.getBoundingClientRect().top - ib.bottom).toFixed(2) : null,
          下有: !!首,
          下文: 首 ? 首.textContent.trim().slice(0, 6) : null,
          底: im ? +(box.bottom - ib.bottom).toFixed(2) : null,
          日: d ? 列(d) : null,
        };
      });
      return { cards, 溢: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    if (m.溢 > 0) 壞.push(`${w} 寬有 ${m.溢}px 水平捲動`);
    if (errs.length) 壞.push(`${w} 寬有 JS 錯誤`);
    卡數 = m.cards.length;
    for (const [i, c] of m.cards.entries()) {
      if (![268, 162].includes(Math.round(c.w))) 壞.push(`${w} 寬：第 ${i + 1} 張卡畫出來 ${c.w}px（該是 268 或 162）`);
      if (c.帶 == null) continue;
      if (Math.abs(c.帶寬 - c.w) > 0.5) 壞.push(`${w} 寬：第 ${i + 1} 張的帶子 ${c.帶寬}px、卡片 ${c.w}px —— 沒有滿版`);
      if (!c.下有) 壞.push(`${w} 寬：第 ${i + 1} 張的帶子底下什麼都沒有 —— 它該夾在中間，不是壓在下緣`);
      else {
        if (c.日帶 == null || c.日帶 < -0.5) 壞.push(`${w} 寬：第 ${i + 1} 張的日期沒有在帶子上面（差 ${c.日帶}px）`);
        if (c.帶下 < -0.5) 壞.push(`${w} 寬：第 ${i + 1} 張「${c.下文}」沒有在帶子下面（差 ${c.帶下}px）`);
        if (c.底 < 1.5) 壞.push(`${w} 寬：第 ${i + 1} 張的帶子還貼在卡片下緣（離 ${c.底}px）`);
      }
      if (Math.round(c.w) === 162) {
        if (!c.日 || c.日.length !== 2) 壞.push(`${w} 寬：輪播那張卡的日期畫成 ${c.日 ? c.日.length : 0} 列（該是 2）`);
        else if (!c.日[1].startsWith("星期")) 壞.push(`${w} 寬：輪播那張卡的星期幾被拆開了（${c.日.join(" ／ ")}）`);
      }
    }
    await pg.close();
  }
  await br.close();
  /* ⚠ 同一件事會在三個寬度 × 十二張卡上重複幾十次 —— 印前四條就夠，後面只報還有幾條 */
  if (壞.length) no("⑦ " + 壞.slice(0, 4).join("；") + (壞.length > 4 ? `　…還有 ${壞.length - 4} 條` : ""));
  else ok(`⑦ 三個寬度 × ${卡數} 張卡：卡寬 268／162、帶子滿版夾在日期底下（底下還有東西）、輪播的日期兩列且星期幾沒被拆、水平溢出 0`);
}

console.log("");
if (bad.length) { console.log(`✗ ${bad.length} 項沒過`); process.exit(1); }
console.log("全部通過。");
