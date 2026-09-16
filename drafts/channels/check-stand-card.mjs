#!/usr/bin/env node
/* 櫃檯小立牌那一頁的守門：node drafts/channels/check-stand-card.mjs
 *
 * ① 重跑產生器、逐位比對（有人手改了頁面，或改了 JSON 卻沒有重跑，這一道就會亮）
 * ② 四案與現況的每一行**逐字**印在頁上（改了 JSON 卻沒重跑，①已經擋了；
 *    這一道擋的是「產生器漏印了某一行」—— 少一行不會讓任何一道版面守門翻臉）
 * ③ ⚠⚠⚠ 紅線掃描要**真的會亮**：現況那一張是正向對照，一定要掃出東西；
 *    四案一定是 0。只驗「四案是 0」的話，一個永遠匹配不到的掃描表也會過。
 * ④ 四案都不可以印時間的數字（48 小時／2 天那兩種講法還沒統一，而印刷品改不了）
 * ⑤ 四案都不可以出現廠商的品牌（AlleyPin／1talk）
 * ⑥ 資料裡不准寫死「第 N 題」—— 要用 {{題:關鍵字}} 讓產生器現算
 * ⑦ noindex、零 JS（這一頁要拿給人看，沒有理由需要跑腳本）
 * ⑧ 八個寬度水平溢出 0，而且卡片真的畫成 CSS 變數那個寬度
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { S, lines, rows, fsOf, cw, qn, cn } from "./stand-card.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DIR = join(ROOT, "preview", "line-stand");
const F = join(DIR, "index.html");
const bad = [];
const ok = (c, m) => { if (!c) bad.push(m); };

/* ── ① 逐位比對 ───────────────────────────────────────────────── */
{
  const { execFileSync } = await import("node:child_process");
  execFileSync(process.execPath, [join(HERE, "stand-card.mjs"), "--check"], { stdio: "pipe" });
}
const H = readFileSync(F, "utf8");

/* ── ② 每一行逐字都要印出來 ───────────────────────────────────── */
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
for (const c of [S.現況, ...S.案])
  for (const l of lines(c))
    ok(H.includes(esc(l)), `頁上找不到這一行：${l}`);

/* ── ③ 紅線掃描真的會亮 ───────────────────────────────────────── */
const nowRed = rows.find((r) => r.id === "now").紅線;
ok(nowRed.length >= 4, `現況那一張只掃出 ${nowRed.length} 個紅線詞 —— 掃描表壞了（它是正向對照）`);
for (const r of rows.filter((x) => x.id !== "now"))
  ok(r.紅線.length === 0, `${r.標籤} 踩到紅線：${r.紅線.map((x) => x.字).join("、")}`);
/* 掃的是卡片上的字不是整頁 —— 這一頁自己就在解釋那幾個禁語 */
ok(H.includes("再也不怕忘記看診時間"), "頁上應該看得到現況那一句（它是拆解第 2 條的證據）");

/* ── ④⑤ 四案不可以印時間的數字，也不可以帶廠商的品牌 ─────────── */
for (const c of S.案) {
  const t = lines(c).join("");
  ok(!/\d+\s*(小時|天)/.test(t), `${c.標籤} 印了時間的數字（兩種講法還沒統一，而印刷品改不了）`);
  ok(!/AlleyPin|1talk|醫病好關係/i.test(t), `${c.標籤} 帶著廠商的品牌`);
  ok(c.抬頭.includes("芳仁"), `${c.標籤} 的抬頭不是診所名`);
}

/* ── ⑥ 不准寫死「第 N 題」 ────────────────────────────────────── */
{
  /* ⚠ 只掃「會印到頁面上的那幾塊」——`_說明` 那種註解是寫給改檔的人看的，
     記號在那裡不會被展開，寫死反而比較清楚。 */
  const 印的 = JSON.stringify({ 拆解: S.拆解, 案: S.案, 待答: S.待答, 現況: S.現況, QR: S.QR });
  ok(!/第\s*\d+\s*(題|條)/.test(印的), "資料裡寫死了「第 N 題／條」—— 要用 {{題:…}}／{{條:…}} 讓產生器現算");
  ok(印的.includes("{{題:") && 印的.includes("{{條:"), "{{題:…}}／{{條:…}} 那兩個記號不見了");
  ok(qn("帶子") === 5 && cn("順序") === 1, `記號算出 ${qn("帶子")}／${cn("順序")}，和那兩組對不起來`);
  /* 產生器自己也不可以寫死（它那一處要呼叫 qn()） */
  const gen = readFileSync(join(HERE, "stand-card.mjs"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  ok(!/第\s*\d+\s*(題|條)/.test(gen), "產生器裡寫死了「第 N 題／條」");
}

/* ── ⑦ noindex／零 JS ─────────────────────────────────────────── */
ok(/name="robots" content="noindex/.test(H), "少了 noindex");
ok(!/<script/i.test(H), "這一頁不可以有 <script>");
ok(readdirSync(DIR).join() === "index.html", `這個資料夾裡只准有 index.html（現在有 ${readdirSync(DIR).join("、")}）`);

/* ── ⑧ 版面：八個寬度 ─────────────────────────────────────────── */
const chrome = (() => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of readdirSync(base)) {
    const p = join(base, d, "chrome-linux", "headless_shell");
    if (existsSync(p)) return p;
  }
  throw new Error("找不到 headless_shell");
})();
const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage();
const shots = [];
for (const w of [430, 393, 390, 375, 360, 320, 834, 1440]) {
  await pg.setViewportSize({ width: w, height: 900 });
  await pg.goto("file://" + F);
  const m = await pg.evaluate(() => {
    const cards = [...document.querySelectorAll(".card")].map((e) => {
      const r = e.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    });
    /* 卡片上的每一行都不可以被裁掉（nowrap ＋ 卡片 overflow:hidden） */
    const over = [...document.querySelectorAll(".card .bd p, .card .cue")]
      .filter((e) => e.scrollWidth - e.clientWidth > 1).length;
    /* ⚠⚠ 卡片的內距要跟著卡片走，不可以是百分比 —— 百分比的參照是父層那一欄，
       手機上和卡片不一樣寬，同一張 300px 的卡在 430 與 390 上會有不同的內距，
       而畫面看起來完全正常（踩過：24.1 vs 21.7）。 */
    const c0 = document.querySelector(".card");
    return {
      doc: document.documentElement.scrollWidth, win: window.innerWidth,
      pad: +parseFloat(getComputedStyle(c0).paddingLeft).toFixed(2),
      cards, over,
    };
  });
  ok(m.doc <= m.win + 1, `${w} 寬有 ${m.doc - m.win}px 水平溢出`);
  ok(m.cards.length === 5, `${w} 寬只畫出 ${m.cards.length} 張卡（應該是 5）`);
  ok(m.over === 0, `${w} 寬有 ${m.over} 行被裁掉`);
  const r = m.cards[0];
  ok(Math.abs(m.pad - r.w * 0.06) < 0.5, `${w} 寬的卡片內距量到 ${m.pad}px，應該是卡片寬的 6% ＝ ${(r.w * 0.06).toFixed(2)}px`);
  ok(Math.abs(r.h / r.w - S.卡片.比例) < 0.02, `${w} 寬的卡片比例 ${(r.h / r.w).toFixed(3)}，應該是 ${S.卡片.比例}`);
  shots.push(`${w}：卡片 ${r.w}×${r.h}・溢出 0`);
}
await browser.close();

console.log(shots.join("\n"));
console.log("");
if (bad.length) { console.error("✗ " + bad.length + " 件\n" + bad.map((x) => "  ・" + x).join("\n")); process.exit(1); }
console.log(`✓ 全綠（${rows.length} 張卡、現況掃出 ${nowRed.length} 個紅線詞、四案 0）`);
