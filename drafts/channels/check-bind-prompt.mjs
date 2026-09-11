#!/usr/bin/env node
/* 守門：「還沒綁定就按約診查詢」那張提案頁。
 *   node drafts/channels/check-bind-prompt.mjs
 *
 * ⚠ 這一則**還沒定案**，所以還沒有 Flex JSON —— 這一支比對的是
 *   「頁面說的」和「別處已經定案的事實」對不對得上，以及量得出來的那幾件：
 *     ① 頁面跑得起來、noindex 在、零 JS 錯誤
 *     ② 引用的四個檔案都找得到，而且**沒有複製第二份進這個資料夾**
 *     ③ 頭圖就是綁定完成那一張（同一個檔）、2:1、≤1024
 *     ④ 按鈕的字逐字 ＝ welcome-card.json 那一顆（同一個動作要長一樣）
 *     ⑤ 電話是現行寫法 05-5339369（作廢的 (05)5339-369 不可以出現）
 *     ⑥ 紅線：沒有專人即時回覆的承諾（三案 × 三格全部掃）
 *     ⑦ 標題逐字 ＝ 使用者指定的那一句，一行放得下就要是一行，而且**置中**
 *        卡上不可以出現「48小時／2天」（那兩種講法還沒統一，不要生出第三種）
 *     ⑧ 八個寬度：水平溢出 0、卡片畫出來就是 268px
 *     ⑩ **預設那一張只准有標題與按鈕**（2026-09-10 使用者指定「其他文字拿掉」）——
 *        加一段字回去不會讓任何一道尺寸守門翻臉，只有讀字才看得出來；
 *        切換條也不可以長回來（三把尺都定了）
 *     ⑨ 綁定完成那張 PNG 的 width/height 屬性要對得上實檔的比例，
 *        而且**畫出來真的是那個大小**（屬性寫對 ≠ 畫出來是那個大小）
 *
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const DIR = path.join(ROOT, "preview", "line-bind-prompt");
const PAGE = path.join(DIR, "index.html");

const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

/* 使用者 2026-09-10 指定的標題，逐字。⚠ 全形空格 U+3000。 */
const TITLE = "30秒快速綁定　啟用完整服務";
/* 2026-09-10 定的那一張：頭圖用他那張、標題底下不寫字、電話不放、空格 11px。
   ⚠ 要和 index.html 的 `var state` 一致 —— 那一頁不帶參數時就是這一格。 */
const DEFAULT = { c: "c", h: "on", t: "off", g: "11" };
/* ⑪ 標題中間那個空格那把尺（2026-09-10「空格小一點」）。
   ⚠⚠ **Flex 沒有字距** —— 能改這個空隙的只有那個空格自己的 size，
      所以頁面上也只准用 font-size 改（用 letter-spacing 的話畫面很像、
      但那是一條 LINE 上做不到的路，等於在假的東西上做決定）。 */
const GAPS = ["16", "13", "11", "9"];

/* ── ② 這個資料夾裡只能有 index.html ──────────────────────────
 * 引用的圖都在別人的資料夾，複製一份就是多一個會漂掉的真相。 */
const files = fs.readdirSync(DIR).sort();
ok(files.length === 1 && files[0] === "index.html",
  `這個資料夾裡多了東西：${files.join("、")} —— 圖一律引用別人那一份，不要複製`);

const html = fs.readFileSync(PAGE, "utf8");
ok(/name="robots" content="noindex/.test(html), "少了 noindex（第八節：提案頁三道 noindex）");
/* ⑩ 切換條 2026-09-10 拿掉了（三把尺都定了）。長回來畫面照樣正常、尺寸守門也都會過。 */
ok(!/pv-bar/.test(html), "切換條長回來了 —— 三把尺都定了，要回頭比是用網址參數");

/* 引用的四個檔案 */
const REFS = {
  hero: "preview/line-bind-done/hero-bind.jpg",
  mark: "preview/line-welcome/mark-white.png",
  tel: "preview/line-remind/mark-tel.png",
  shot: "preview/line-bind-done/shot-bind-done.png",
};
for (const [k, rel] of Object.entries(REFS))
  ok(fs.existsSync(path.join(ROOT, rel)), `引用的檔案不在：${rel}（${k}）`);

/* ── ③ 頭圖：2:1、≤1024（Flex 的 image 上限） ─────────────────── */
{
  const buf = fs.readFileSync(path.join(ROOT, REFS.hero));
  let i = 2, w = 0, h = 0;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  ok(w === 1024 && h === 512, `頭圖不是 1024×512，量到 ${w}×${h}`);
}
/* 綁定完成那張 PNG 的真實尺寸（⑨ 要用） */
const shotBuf = fs.readFileSync(path.join(ROOT, REFS.shot));
const SHOT = { w: shotBuf.readUInt32BE(16), h: shotBuf.readUInt32BE(20) };

/* ── ④ 按鈕的字要和招呼圖卡那一顆逐字相同 ────────────────────── */
const welcome = JSON.parse(fs.readFileSync(path.join(HERE, "welcome-card.json"), "utf8"));
const findBtn = (node) => {
  if (!node || typeof node !== "object") return null;
  if (node.action && node.action.type === "uri" && /綁定/.test(node.action.label || ""))
    return node.action.label;
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) for (const c of v) { const r = findBtn(c); if (r) return r; }
    else if (v && typeof v === "object") { const r = findBtn(v); if (r) return r; }
  }
  return null;
};
const WELCOME_BTN = findBtn(welcome);
ok(WELCOME_BTN === "點這裡綁定",
  `招呼圖卡那顆綁定按鈕的字變了（讀到「${WELCOME_BTN}」）—— 這一頁是照它抄的，兩邊要一起改`);

/* ── 頁面那一側 ──────────────────────────────────────────────── */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });

const WIDTHS = [430, 414, 393, 390, 375, 360, 320, 744];
const CASES = ["a", "b", "c"], TELS = ["off", "note", "btn"], HEROS = ["on", "off"];
const seen = [];

for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 860 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  for (const c of CASES) for (const t of TELS) for (const h of HEROS) {
    await page.goto(`file://${PAGE}?c=${c}&h=${h}&t=${t}`);
    await page.waitForSelector("#pv-chat1 .fx");
    /* ⚠ 等圖真的載完再量 —— 但條件只能問「結束了沒」，不可以順便問「對不對」：
       載不到的圖是 complete:true、naturalWidth:0，把「成功」寫進等待條件
       就會等成永遠（第三十七節那條）。 */
    await page.evaluate(() => Promise.all([...document.images].map((i) =>
      i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    const got = await page.evaluate(() => {
      const card = document.querySelector("#pv-chat1 .fx");
      const shot = document.querySelector("#pv-chat2 .pv-shot");
      const doc = document.documentElement;
      const missing = [...document.images]
        .filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src"));
      return {
        text: card.textContent,
        title: card.querySelector("h4").textContent,
        titleLines: (() => {
          /* 標題畫成幾行、最寬那一行多寬 —— 量墨（Range 逐字、照 top 分組），
             不要問盒子（h4 是 block，rect 回的是整欄寬 240）。
             ⚠⚠ 要走 TreeWalker 不可以只看 firstChild ——
                標題現在拆成三段（文字／空格的 span／文字）。
             ⚠⚠ 空白一律跳掉：中間那個空格有**自己的字級**，它的 top 和旁邊的字
                不一樣，不跳掉的話照 top 分組會多數出一行，而畫面上一行都沒折。 */
          const h = card.querySelector("h4"), r = document.createRange(), tops = {};
          const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = w.nextNode())) for (let i = 0; i < n.length; i++) {
            if (/\s/.test(n.data[i])) continue;
            r.setStart(n, i); r.setEnd(n, i + 1);
            const b = r.getBoundingClientRect();
            if (!b.width && !b.height) continue;
            const k = Math.round(b.top);
            tops[k] = tops[k] || { l: Infinity, r: -Infinity };
            tops[k].l = Math.min(tops[k].l, b.left);
            tops[k].r = Math.max(tops[k].r, b.right);
          }
          const ws = Object.values(tops).map((v) => v.r - v.l);
          /* 置中不置中：量墨，不要問 text-align ——
             那個屬性寫著 center、被別條規則蓋掉時畫面照樣是靠左的。 */
          const box = card.querySelector(".b").getBoundingClientRect();
          const gaps = Object.values(tops).map((v) =>
            Math.abs((v.l - box.left) - (box.right - v.r)));
          return { rows: ws.length, wide: Math.max(...ws), off: Math.max(...gaps) };
        })(),
        /* ⑪ 標題中間那個空格：宣告的字級、以及**畫出來真的多寬**。
           ⚠ 屬性寫對 ≠ 畫出來是那個大小（同綁定完成那張 PNG 那一道）。 */
        gap: (() => {
          const sp = card.querySelector("h4 .sp");
          if (!sp) return null;
          const r = document.createRange();
          r.selectNodeContents(sp);
          return {
            css: parseFloat(getComputedStyle(sp).fontSize),
            ink: r.getBoundingClientRect().width,
            /* letter-spacing 在 LINE 上不存在，頁面上也不准拿它來縮這個空格 */
            ls: getComputedStyle(sp).letterSpacing,
          };
        })(),
        /* ⚠ 每一格都要自己判斷有沒有那個 span —— 直接 getComputedStyle(null)
           會**丟例外**，守門就變成一句看不懂的 TypeError（負向測時踩到）。 */
        strip: [...document.querySelectorAll("#pv-gaps .row")].map((x) => {
          const sp = x.querySelector(".sp");
          return {
            g: x.getAttribute("data-gap"),
            css: sp ? parseFloat(getComputedStyle(sp).fontSize) : null,
            lab: x.querySelector(".lab").textContent,
          };
        }),
        cardW: card.getBoundingClientRect().width,
        btns: [...card.querySelectorAll(".btn > span")].map((s) => s.textContent),
        shotRect: shot ? shot.getBoundingClientRect().width : 0,
        shotAttr: shot ? [+shot.getAttribute("width"), +shot.getAttribute("height")] : null,
        overflow: doc.scrollWidth - doc.clientWidth,
        panelNo: document.querySelectorAll("#pv-panel1 .no").length,
        missing,
      };
    });
    seen.push({ w, c, t, h, ...got });
    if (errs.length) { bad.push(`${w}px ${c}/${h}/${t} 有 JS 錯誤：${errs.join(" / ")}`); errs.length = 0; }
    ok(!got.missing.length, `${w}px：這幾張圖載不到 ${got.missing.join("、")}`);
    ok(got.overflow <= 0, `${w}px ${c}/${h}/${t}：水平溢出 ${got.overflow}px`);
    /* ⚠ 卡片一定要畫成 268 —— 畫不到的話這一頁做的折行判斷全部偏鬆。
       ⚠⚠ 320 是已知放不下的那一格（面板會自己標紅），不列為失敗。 */
    if (w >= 360) ok(Math.abs(got.cardW - 268) < 0.6,
      `${w}px：卡片畫成 ${got.cardW.toFixed(1)}px，不是 268`);
    /* ⑨ 屬性對得上實檔，而且畫出來真的是那個大小 */
    if (got.shotAttr) {
      const [aw, ah] = got.shotAttr;
      ok(Math.abs(aw / ah - SHOT.w / SHOT.h) < 0.01,
        `綁定完成那張的 width/height 屬性 ${aw}×${ah} 對不上實檔 ${SHOT.w}×${SHOT.h}`);
      ok(Math.abs(got.shotRect - aw) < 0.6,
        `綁定完成那張畫出來 ${got.shotRect.toFixed(1)}px，宣告的是 ${aw}px`);
    }
    /* ⑥⑦ 卡片上的字（只掃我們這一張，現況那一張引用了廠商的字） */
    const scan = got.text.replace(/沒有專人看訊息/g, "");
    for (const [re, why] of [
      [/隨時問|馬上回|即時回|盡快回覆|專人回覆|線上客服/, "承諾了這個帳號做不到的事（沒有專人即時回覆）"],
      [/48\s*小時|看診前\s*2\s*天/, "出現了提醒的天數／時數 —— 那兩種講法還沒統一，這一則刻意不帶那個數字"],
      [/\(05\)|05-533-9369/, "用了作廢的電話寫法（2026-08-27 起全站是 05-5339369）"],
    ]) ok(!re.test(scan), `${c}/${h}/${t}：${why}`);
    /* ⚠⚠ 標題是**使用者 2026-09-10 指定的逐字**，三案共用 ——
       改回舊寫法畫面照樣正常、每一道尺寸守門都會過，只有讀字才看得出來。
       ⚠ 那個「30 秒」是廠商那張卡上的數字、我們沒有量過，所以**不是紅線是「還沒驗過」**，
       面板照實印；這裡守的是「不要被誰順手改掉」。 */
    ok(got.title === TITLE,
      `${c}/${h}/${t}：標題是「${got.title}」，指定的是「${TITLE}」`);
    /* 標題放不放得下：卡片 268 − 內距 14×2 ＝ 240px 可用。
       ⚠ 一行放得下就不可以變成兩行（兩行的第二行只有六個字，讀起來是被擠下去的）。 */
    if (w >= 360) {
      ok(got.titleLines.wide <= 240,
        `${c}/${h}/${t}：標題最寬那一行 ${got.titleLines.wide.toFixed(1)}px，超過可用的 240`);
      ok(got.titleLines.rows === 1,
        `${c}/${h}/${t}：標題畫成 ${got.titleLines.rows} 行（量到最寬 ${got.titleLines.wide.toFixed(1)}px，一行放得下就該是一行）`);
      /* ⚠ 標題置中（2026-09-10 使用者指定）——靠回左邊畫面照樣正常、
         每一道尺寸守門也都會過，只有量左右留白才看得出來。 */
      ok(got.titleLines.off <= 1,
        `${c}/${h}/${t}：標題沒有置中（左右留白差 ${got.titleLines.off.toFixed(1)}px）`);
    }
    /* ⑪ 那個空格：預設就是他挑的那一格，而且**畫出來真的是那個大小**。
       ⚠ 只用 font-size 改 —— letter-spacing 在 Flex 上不存在，
         拿它來縮的話畫面很像、卻是一條 LINE 上做不到的路。 */
    ok(got.gap, `${c}/${h}/${t}：標題裡找不到那個空格的 span（拆不出來就沒有東西可以調）`);
    if (got.gap) {
      ok(Math.abs(got.gap.css - +DEFAULT.g) < 0.6,
        `${c}/${h}/${t}：空格畫成 ${got.gap.css}px，預設應該是 ${DEFAULT.g}px`);
      /* 墨寬 ＝ 字級 ＋ 它自己那一份 letter-spacing（.01em），容差 1px */
      ok(Math.abs(got.gap.ink - +DEFAULT.g) <= 1,
        `${c}/${h}/${t}：空格宣告 ${DEFAULT.g}px、畫出來 ${got.gap.ink.toFixed(1)}px`);
      ok(got.gap.ls === "normal" || Math.abs(parseFloat(got.gap.ls)) < 0.5,
        `${c}/${h}/${t}：空格被 letter-spacing ${got.gap.ls} 動過 —— Flex 沒有字距，只能改它的 size`);
    }
    /* 那把尺真的在頁上（四格、每一格的空格真的是那個大小） */
    ok(got.strip.length === GAPS.length,
      `${c}/${h}/${t}：空格那把尺有 ${got.strip.length} 格，應該是 ${GAPS.length}`);
    for (const row of got.strip)
      ok(GAPS.includes(row.g) && row.css != null && Math.abs(row.css - +row.g) < 0.6,
        `空格那把尺的「${row.g}px」那一格畫成 ${row.css == null ? "（找不到那個 span）" : row.css + "px"}`);
    ok(got.strip.every((r) => /px/.test(r.lab)),
      `空格那把尺有一格的標籤是空的 —— 那幾個數字是 measure() 現場填的`);
    ok(got.text.includes("05-5339369") || t === "off",
      `${c}/${h}/${t}：電話那把尺不是「不放」，卡上卻找不到 05-5339369`);
    ok(got.btns[0] === WELCOME_BTN,
      `${c}/${h}/${t}：綁定按鈕寫「${got.btns[0]}」，招呼圖卡那一顆是「${WELCOME_BTN}」`);
    ok((t === "btn") === (got.btns.length === 2),
      `${c}/${h}/${t}：按鈕數量對不上（${got.btns.length} 顆）`);
    /* ⚠⚠⚠ ⑩ 預設那一張（c=c／t=off ＝ 不帶參數時的樣子）卡上只准有標題與按鈕。
       使用者 2026-09-10：「標題和按鈕保存　其他文字拿掉」——
       補一段字回去不會讓卡片溢出、不會有孤字、每一道尺寸守門都會過。 */
    if (c === DEFAULT.c && t === DEFAULT.t) {
      const want = TITLE + WELCOME_BTN;
      ok(got.text.replace(/\s+/g, "") === want.replace(/\s+/g, ""),
        `${w}px 預設那一張卡上多了字：「${got.text.replace(/\s+/g, "")}」，只准有「${want.replace(/\s+/g, "")}」`);
    }
  }
  await page.close();
}

/* ── ⑪ 那把尺的四格各自跑一次 ────────────────────────────────────
 * ⚠ 不併進上面那個迴圈（18 組 × 4 ＝ 72 組 × 8 個寬度太慢），
 *   而且要驗的東西只有標題那一行：兩個最窄的寬度就夠。
 * ⚠⚠ 每一格都要「一行放得下、而且真的畫成一行」——
 *   空格縮小只會讓標題更短，但**縮小本身也可能把某一格變成兩行**（不會，
 *   不過這一道是免費的，日後標題的字改了它就開始有用）。 */
const gaps = [];
for (const w of [390, 360]) {
  const page = await browser.newPage({ viewport: { width: w, height: 860 } });
  for (const g of GAPS) {
    await page.goto(`file://${PAGE}?g=${g}`);
    await page.waitForSelector("#pv-chat1 .fx");
    const got = await page.evaluate(() => {
      const card = document.querySelector("#pv-chat1 .fx");
      const h = card.querySelector("h4"), r = document.createRange(), tops = {};
      const wk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = wk.nextNode())) for (let i = 0; i < n.length; i++) {
        if (/\s/.test(n.data[i])) continue;
        r.setStart(n, i); r.setEnd(n, i + 1);
        const b = r.getBoundingClientRect();
        if (!b.width && !b.height) continue;
        const k = Math.round(b.top);
        tops[k] = tops[k] || { l: Infinity, r: -Infinity };
        tops[k].l = Math.min(tops[k].l, b.left);
        tops[k].r = Math.max(tops[k].r, b.right);
      }
      const ws = Object.values(tops).map((v) => v.r - v.l);
      const sp = h.querySelector(".sp");
      let css = null, ink = null;
      if (sp) {
        const rr = document.createRange(); rr.selectNodeContents(sp);
        css = parseFloat(getComputedStyle(sp).fontSize);
        ink = rr.getBoundingClientRect().width;
      }
      const doc = document.documentElement;
      return {
        title: h.textContent,
        rows: ws.length, wide: Math.max(...ws),
        css, ink,
        overflow: doc.scrollWidth - doc.clientWidth,
      };
    });
    gaps.push({ w, g, ...got });
    /* ⚠⚠ 拆 span 不可以動到那句話 —— textContent 要逐字不變 */
    ok(got.title === TITLE, `?g=${g}：標題變成「${got.title}」（拆 span 把字改掉了）`);
    ok(got.css != null, `?g=${g}：標題裡找不到那個空格的 span`);
    if (got.css != null) {
      ok(Math.abs(got.css - +g) < 0.6, `?g=${g}：空格畫成 ${got.css}px`);
      ok(Math.abs(got.ink - +g) <= 1, `?g=${g}：空格畫出來 ${got.ink.toFixed(1)}px`);
    }
    ok(got.rows === 1, `${w}px ?g=${g}：標題畫成 ${got.rows} 行`);
    ok(got.wide <= 240, `${w}px ?g=${g}：標題 ${got.wide.toFixed(1)}px，超過可用的 240`);
    ok(got.overflow <= 0, `${w}px ?g=${g}：水平溢出 ${got.overflow}px`);
  }
  await page.close();
}
await browser.close();

/* ── 面板真的有在報（不是印一行空的） ────────────────────────── */
ok(seen.length === WIDTHS.length * 18, `量到的組合數不對：${seen.length}`);
/* 那一頁的預設真的是這一格嗎（改了 state 卻忘了改這裡，上面那道就白守了） */
ok(new RegExp(`var state = \\{ c: "${DEFAULT.c}", h: "${DEFAULT.h}", t: "${DEFAULT.t}", g: "${DEFAULT.g}" \\}`).test(html),
  `index.html 的預設不是 ${DEFAULT.c}/${DEFAULT.h}/${DEFAULT.t}/空格 ${DEFAULT.g} —— 「只有標題與按鈕」那一道守的就不是預設那一張了`);
/* ⚠⚠ 標題的空格只准用 font-size 改。頁面上若出現負的字距，畫面會很像
   （站上那首詩就是這樣縮的），但**那是 LINE 上做不到的路** ——
   等於在一個做不出來的樣子上做決定。 */
/* ⚠⚠⚠ 掃之前要先把註解剝掉 —— 這條線每一份檔案都把「為什麼不可以」寫在自己裡面，
   直接掃整頁一定會撞到自己的說明（第一次跑就被自己的註解擋下來了）。 */
const noComments = html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");
ok(!/letter-spacing:\s*-/.test(noComments),
  "頁面上用了負的字距 —— Flex 沒有字距，這個空隙只能靠那個空格自己的 size");

if (bad.length) {
  console.error("❌ 擋下 " + bad.length + " 項：\n" +
    [...new Set(bad)].map((b) => "  ・" + b).join("\n"));
  process.exit(1);
}
const t390 = seen.find((s) => s.w === 390);
console.log("✅ " + seen.length + " 組（8 個寬度 × 3 案 × 2 頭圖 × 3 電話）＋ 空格那把尺 " +
  gaps.length + " 組全部通過：\n" +
  "   資料夾只有 index.html（四個圖都引用別人那一份）、頭圖 1024×512、" +
  "按鈕逐字 ＝ 招呼圖卡那一顆、\n   標題逐字 ＝「" + TITLE + "」（畫成 " +
  t390.titleLines.rows + " 行、最寬 " + t390.titleLines.wide.toFixed(1) +
  "px／可用 240、置中偏 " + t390.titleLines.off.toFixed(1) + "px）、\n" +
  "   標題中間那個空格 " + DEFAULT.g + "px（" +
  gaps.filter((g) => g.w === 390)
    .map((g) => g.g + "→" + g.wide.toFixed(0)).join("／") +
  "px，四格都是一行、都收在 240 以內）、\n" +
  "   預設那一張只有標題與按鈕、切換條沒有長回來、\n" +
  "   電話是現行寫法、紅線 0、沒有 48 小時也沒有 2 天、卡片畫成 268、水平溢出 0\n" +
  "   ⚠ 標題那個「30 秒」是廠商那張卡上的數字，我們沒有量過 —— 面板照實印著，" +
  "診所自己綁一次計時就能收掉");
