#!/usr/bin/env node
/* 守門：自動回應的定稿文字 ↔ 規格頁，逐項比對。
 *   node drafts/channels/check-auto-reply.mjs
 *
 * ⚠⚠ 這一則和另外三則不一樣：**成品不是 Flex JSON，是一段純文字**
 *   （2026-09-05 定案留在後台，字留在診所自己手上 —— 見 README 第 25-11 節）。
 *   所以這一支比對的是 drafts/channels/auto-reply.txt ↔ /preview/line-auto-reply/。
 *
 * 同 check-welcome.mjs 那條道理：**規格頁一旦和成品對不上，
 * 上面做的每一個判斷都是假的**，而診所是照那一頁上那一塊去打字的。
 *
 * 比對八件：
 *   ① 定稿全文逐字 —— .txt ↔ 規格頁「要貼進後台的字」↔ 聊天室裡真的送出的那一則
 *      （三邊都要一樣：那一塊要是自己手寫一份，哪天就會開始說謊）
 *   ② 每一行不超過 14 個全形字寬（半形算 0.5）—— 手動斷行的唯一依據
 *   ③ 改約那一段和已定稿的「綁定完成」逐字相同（那正是這一則的定案條件）
 *   ④ 電話是畫面用的那一份 05-5339369（CLAUDE.md 第六節：括號版已作廢）
 *   ⑤ 紅線：不可以出現「有問題隨時問」那一類的承諾（第十一之三節）；emoji 0 個
 *   ⑥ 定案之後規格頁上不可以還有切換條（第十一之五節）；複製鈕要在
 *   ⑦ 泡泡的上限要真的給得到 268（給不到的話折行與孤字判斷全部偏鬆）
 *   ⑧ 孤字 0、水平溢出 0、JS 錯誤 0
 *
 * ⚠ 頁面是 JS 產生的，要真的用瀏覽器跑一次再讀，不能用正規式掃 HTML。
 * ⚠ 一律 headless_shell（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const PAGE = path.join(ROOT, "preview", "line-auto-reply", "index.html");
const TXT = path.join(HERE, "auto-reply.txt");
const BIND = path.join(HERE, "bind-done-card.json");

const want = fs.readFileSync(TXT, "utf8").replace(/\n$/, "");
const bad = [];
const ok = (cond, msg) => { if (!cond) bad.push(msg); };

/* ── 頁面那一側 ─────────────────────────────────────────────── */
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
/* ⚠ 390 是這條線一路在用的工作寬度；泡泡上限那一項在這裡就要過得了 268。 */
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await page.goto("file://" + PAGE);
await page.waitForSelector("#spec");
await page.waitForTimeout(200);

const got = await page.evaluate(() => {
  /* 聊天室裡診所送出的那些泡泡（第一輪就夠 —— 之後每一輪都是同一份） */
  const bubs = [...document.querySelectorAll(".pv-chat .pv-msg:not(.me) .pv-bub:not(.img)")];
  return {
    spec: document.getElementById("spec").textContent,
    /* ⚠ 用 textContent 不是 innerText —— innerText 會照「畫出來的樣子」
       把折行也算成換行，那樣比對到的是版面不是內容。 */
    chat: bubs.length ? bubs[0].textContent : null,
    nBub: bubs.length,
    bar: !!document.querySelector(".pv-bar"),
    copy: !!document.getElementById("copy"),
    panel: document.getElementById("panel").innerText,
    body: document.body.textContent,
  };
});
await browser.close();
ok(errs.length === 0, "規格頁有 JS 錯誤：" + errs.join(" / "));

/* ── ① 三邊逐字 ─────────────────────────────────────────── */
const show = (s) => (s == null ? "（量不到）" : JSON.stringify(s).slice(0, 90));
ok(got.spec === want,
  "「要貼進後台的字」和 auto-reply.txt 對不上：\n      頁面 " + show(got.spec) + "\n      檔案 " + show(want));
ok(got.chat === want,
  "聊天室裡送出的那一則和 auto-reply.txt 對不上：\n      頁面 " + show(got.chat) + "\n      檔案 " + show(want));
ok(got.nBub === 1,
  `定案是**一個對話框**，頁面上量到 ${got.nBub} 個 —— 走純文字就不該再切成好幾則`);

/* ── ② 逐行寬度 ─────────────────────────────────────────── */
const wide = (s) => [...s].reduce((n, c) => n + (c.codePointAt(0) < 0x100 ? 0.5 : 1), 0);
want.split("\n").forEach((l, i) => {
  ok(wide(l) <= 14,
    `第 ${i + 1} 行寬 ${wide(l)} 個全形字（上限 14，超過就會在病人手機上被再折一次）：${l}`);
});

/* ── ③ 改約那一段要和「綁定完成」逐字相同 ──────────────────── */
const bindTexts = [];
(function walk(n) {
  if (Array.isArray(n)) return n.forEach(walk);
  if (n && typeof n === "object") {
    if (n.type === "text")
      bindTexts.push(n.text != null ? n.text : (n.contents || []).map((c) => c.text || "").join(""));
    Object.values(n).forEach(walk);
  }
})(JSON.parse(fs.readFileSync(BIND, "utf8")));
const block = bindTexts.find((t) => t.includes("約診更改或取消"));
ok(block, "綁定完成那一張裡找不到改約那一段 —— 兩則的來源對不上了");
if (block) {
  /* 綁定完成那一段是「沒有專人」＋改約四行連著寫；自動回應中間空一行，
     所以比對的是**改約那四行**本身，不是整段。 */
  const four = block.split("\n").filter((l) => !l.includes("沒有專人")).join("\n");
  ok(want.includes(four),
    "改約那一段和已定稿的「綁定完成」不一樣了 —— 同一件事兩則要用同一組字：\n"
    + "      綁定完成 " + JSON.stringify(four) + "\n      自動回應 " + show(want));
  ok(want.includes("這裡沒有專人即時回覆訊息。"), "少了「這裡沒有專人即時回覆訊息。」那一句");
}

/* ── ④ 電話 ─────────────────────────────────────────────── */
ok(want.includes("05-5339369"), "電話不是畫面用的那一份 05-5339369");
for (const oldTel of ["(05)5339-369", "05-533-9369", "055339369"])
  ok(!want.includes(oldTel), `出現作廢的電話寫法「${oldTel}」（CLAUDE.md 第六節）`);

/* ── ⑤ 紅線 ─────────────────────────────────────────────── */
const RED = ["隨時問", "有問題問", "問到", "即時回覆您", "馬上回", "專人回覆", "找得到人", "隨時聯絡"];
for (const w of RED)
  ok(!want.includes(w), `定稿裡出現「${w}」—— 這個帳號沒有專人即時回覆訊息（第十一之三節）`);
const EMOJI = /[☀-➿⬀-⯿]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g;
const em = want.match(EMOJI) || [];
ok(em.length === 0, `定稿裡有 ${em.length} 個 emoji（${em.join("")}）—— 站上全站 0 個`);

/* ── ⑥ 切換條與複製鈕 ──────────────────────────────────── */
ok(!got.bar, "規格頁上還有切換條 —— 定案之後要拿掉（第十一之五節）");
ok(got.copy, "「要貼進後台的字」那一塊少了複製鈕");

/* ── ⑦⑧ 面板現場報的那幾個數字 ─────────────────────────── */
ok(/268＝LINE 的真值/.test(got.panel),
  "390 上泡泡給不到 268px —— 折行與孤字判斷會全部偏鬆（" +
  (got.panel.match(/上限[^・]*/) || [""])[0] + "）");
const orp = (got.panel.match(/孤字 (\d+)/) || [])[1];
ok(orp === "0", `孤字 ${orp} 處 —— 手動斷行要重看`);
const ovf = (got.panel.match(/水平溢出 (-?\d+)/) || [])[1];
ok(ovf === "0", `水平溢出 ${ovf}px`);

if (bad.length) {
  console.error("✗ 對不上 " + bad.length + " 項：\n  ・" + bad.join("\n  ・"));
  process.exit(1);
}
console.log("✅ 定稿文字與規格頁逐字相同（13 行 × 三邊、逐行寬度、"
  + "改約那一段＝綁定完成、電話、紅線、切換條已拿掉、泡泡 268、孤字 0、溢出 0）");
