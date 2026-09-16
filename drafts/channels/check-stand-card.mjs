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
 * ⑥之二 抬頭逐字 ＝ 使用者指定的那一行、副標收掉了、現況不可以被換成標誌，
 *    而且標誌的高度與字距在 CSS 與算式裡只有一份出處
 * ⑥之三 那顆標誌是**官方授權的檔**：只等比例縮放，CSS 不可以給它上色、裁切、加框或濾鏡
 * ⑥之四 底下那條帶子 ＝ 診所自己的九顆 logo：順序照 JSON、形狀讀 brand/shapes、
 *    寬度讀 wm-sizes.json，而且**垂直置中**（等墨不等高）；相鄰的限制也要守
 * ⑦ noindex、零 JS（這一頁要拿給人看，沒有理由需要跑腳本）
 * ⑧ 八個寬度水平溢出 0，而且卡片真的畫成 CSS 變數那個寬度
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { S, lines, rows, fsOf, hdOf, cw, qn, cn, HDLS, LIH, LIGAP, LIW, LOGO, BAND, WM } from "./stand-card.mjs";

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
/* ⚠⚠ 不可以直接拿原字串去 includes —— 抬頭裡的 LINE 被換成一張圖了，
   整條字串不會再原樣出現在 HTML 裡。所以先把標籤剝掉、把實體還原再比對。 */
/* ⚠⚠ <img> 要先還原成它的 alt —— 抬頭裡的 LINE 現在是一張官方標誌圖，
   整條標籤剝掉的話那一行就少了四個字母，這一道會對著一個不存在的問題亮。
   順帶它也守住了 alt（alt 打錯，這一道就會亮）。 */
const strip = (t) => t.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g, "$1").replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
/* ⚠⚠⚠ 而且要**一張卡一張卡地看**，不可以拿整頁去比 —— 頁面上的說明文字裡
   也寫著抬頭那一行（它是展示品），拿整頁比的話這一道會替卡片背書、永遠通過。 */
/* ⚠ 開頭要寫死整個 class 的值 —— 只比對開頭的話，外面那個 <div class="cards"> 也會被算進來 */
const CARDS = [...H.matchAll(/<div class="card(?: now)?">[\s\S]*?<\/div>\n<\/div>/g)].map((m) => strip(m[0]));
const NCARD = 1 + S.案.length;
ok(CARDS.length === NCARD, `頁上抓到 ${CARDS.length} 張卡的標記（資料裡是 ${NCARD} 張）`);
[S.現況, ...S.案].forEach((c, i) => {
  for (const l of lines(c))
    ok((CARDS[i] ?? "").includes(l), `第 ${i + 1} 張卡上找不到這一行：${l}`);
});

/* ── ③ 紅線掃描真的會亮 ───────────────────────────────────────── */
const nowRed = rows.find((r) => r.id === "now").紅線;
ok(nowRed.length >= 4, `現況那一張只掃出 ${nowRed.length} 個紅線詞 —— 掃描表壞了（它是正向對照）`);
/* ⚠⚠⚠ 2026-09-16 起不再是「每一案都 0」—— Ⓔ 是使用者逐字寫的，照寫不改，所以它會亮。
   規矩換成：**亮紅的案一定要在資料裡寫明為什麼照寫，而那句話一定要印在頁上**。
   ⚠ 而且**至少要有一案是乾淨的**，不然這一道等於被一張「大家都有例外」的表關掉。 */
let 乾淨 = 0;
for (const r of rows.filter((x) => x.id !== "now")) {
  const c = S.案.find((x) => x.id === r.id);
  if (!r.紅線.length) { 乾淨++; continue; }
  ok(c.例外?.紅線, `${r.標籤} 踩到紅線（${r.紅線.map((x) => x.字).join("、")}）卻沒有在資料裡寫明為什麼照寫`);
  if (c.例外?.紅線) ok(H.includes("逐字寫的"), `${r.標籤} 的例外沒有印在頁上`);
}
ok(乾淨 >= 1, "每一案都掛著紅線的例外 —— 這一道等於沒有在守");
/* 掃的是卡片上的字不是整頁 —— 這一頁自己就在解釋那幾個禁語 */
ok(H.includes("再也不怕忘記看診時間"), "頁上應該看得到現況那一句（它是拆解第 2 條的證據）");

/* ── ④⑤ 四案不可以印時間的數字，也不可以帶廠商的品牌 ─────────── */
let 無數字 = 0;
for (const c of S.案) {
  const t = lines(c).join("");
  /* ⚠⚠ 同上：印了數字的案要寫明（Ⓔ 那個「2天」是使用者寫的），而且至少要有一案沒印。 */
  if (/\d+\s*(小時|天)/.test(t)) ok(c.例外?.數字, `${c.標籤} 印了時間的數字卻沒有在資料裡寫明為什麼（兩種講法還沒統一，而印刷品改不了）`);
  else 無數字++;
  ok(!/AlleyPin|1talk|醫病好關係/i.test(t), `${c.標籤} 帶著廠商的品牌`);
  ok(c.抬頭.includes("芳仁"), `${c.標籤} 的抬頭不是診所名`);
  /* ⚠⚠⚠ 抬頭是使用者 2026-09-16 逐字指定的（含那兩個半形空白）——
     改回舊寫法畫面照樣正常、每一道尺寸守門都會過，只有讀字才看得出來。 */
  ok(c.抬頭 === "芳仁牙醫有 LINE 囉", `${c.標籤} 的抬頭不是使用者指定的那一行`);
  ok(!c.副標, `${c.標籤} 還留著副標「${c.副標}」—— 抬頭那一輪已經收成一行`);
}
ok(無數字 >= 1, "每一案都印了時間的數字 —— 那條規矩等於沒有了");
const GEN = readFileSync(join(HERE, "stand-card.mjs"), "utf8");

/* ⚠⚠ 現況那一張的 LINE **不可以**換成標誌（它是照片上逐字抄的對照，加工就不是對照了） */
{
  const 現況段 = H.slice(H.indexOf('<div class="card now"'), H.indexOf('<div class="card now"') + 900);
  ok(!/class="li"/.test(現況段), "現況那一張的 LINE 被換成標誌了 —— 那一張是對照，不可以加工");
  ok(/c === S\.現況 \? \[t\] :/.test(GEN), "抬頭的字級規則不再特判現況 —— 現況那一張不換標誌，算式也不可以把它算進去");
  ok(hdOf(S.現況).標誌 === 0, "抬頭的字級規則把現況也當成有標誌");
}

/* ── ⑥之二 標誌的高度與抬頭的字距，算式與 CSS 只能有一份出處 ───────
   兩邊分家的話抬頭會算出一個放得下、實際畫出去溢出的字級（卡片 overflow:hidden，
   畫面上只少掉最後一個字，每一道尺寸守門都會過）。 */
ok(H.includes(`--hd-ls:${HDLS}em`), `CSS 的 --hd-ls 和算式的 ${HDLS} 對不起來`);
ok(H.includes(`--li-h:${LIH}em`), `CSS 的 --li-h 和算式的 ${LIH} 對不起來`);
ok(H.includes(`--li-gap:${LIGAP}em`), `CSS 的 --li-gap 和算式的 ${LIGAP} 對不起來`);
ok(/letter-spacing:var\(--hd-ls\)/.test(H), "抬頭的字距沒有吃 --hd-ls（有人寫死了一個值）");
ok(/height:var\(--li-h\)/.test(H), "標誌的高度沒有吃 --li-h");
ok(/margin:0 var\(--li-gap\)/.test(H), "標誌的左右留白沒有吃 --li-gap");
ok(/\.card \.hd\{[^}]*white-space:nowrap/.test(H), "抬頭不是 nowrap —— 放不下會靜靜地折成兩行，而不是被守門擋下來");

/* ── ⑥之三 那顆標誌是官方授權的檔，只准等比例縮放 ─────────────────
   ⚠⚠⚠ 別人的商標：重上色、裁一角、加圓角或濾鏡，畫面上看起來都「還好」，
   而每一道尺寸守門都會過 —— 所以要直接讀那一段 CSS。 */
{
  const p = join(DIR, S.標誌.檔);
  ok(existsSync(p), `找不到標誌檔 ${S.標誌.檔}`);
  /* ⚠ 那一條規則不可以只作用在卡片裡 —— 頁面上的說明也擺了一顆標誌，
     選擇器寫 .card .li 的話它會用原始像素畫出來（1001px）、整頁多 600px 水平捲動。 */
  const li = (H.match(/\n\.li\{[^}]*\}/) ?? [""])[0];
  ok(li, "找不到 .li 那一段 CSS");
  for (const 禁 of ["filter", "border", "background", "clip-path", "mask", "opacity", "mix-blend"])
    ok(!li.includes(禁), `標誌那一段 CSS 出現 ${禁} —— 官方授權的商標只准等比例縮放`);
  ok(li.includes("width:auto"), "標誌沒有 width:auto —— 給了寬又給了高就會變形");
  /* 頁上那個 <img> 的 width/height 屬性要等於檔案本身（讓瀏覽器算對長寬比） */
  ok(H.includes(`width="${LOGO.寬}" height="${LOGO.高}"`), `標誌的 width/height 屬性和實檔 ${LOGO.寬}×${LOGO.高} 對不起來`);
  ok(/<img class="li" src="[^"]+" alt="LINE"/.test(H), '標誌的 alt 不是 "LINE"');
  /* 長寬比一定要現場讀檔頭，不可以寫死一個數字 */
  ok(/readUInt32BE\(16\)/.test(GEN), "產生器沒有從 PNG 的檔頭讀長寬比（寫死的話換一個檔，抬頭會靜靜地溢出）");
}

/* ── ⑥之四 底下那條帶子：九顆 logo ───────────────────────────────── */
{
  const B = S.帶子;
  ok(B.順序.length === 9 && new Set(B.順序).size === 9, `帶子那一排不是九顆不重複的（現在 ${B.順序.length} 顆）`);
  for (const k of B.順序) {
    ok(!!WM[k], `wm-sizes.json 裡沒有 ${k}`);
    ok(existsSync(join(ROOT, "brand", "shapes", `shape-${k}.svg`)), `brand/shapes 裡沒有 shape-${k}.svg`);
  }
  /* ⚠⚠⚠ 「隨機」是一個定下來的順序，而它有兩條限制（見 JSON 的說明）——
     排錯了畫面完全正常，只是那一條讀起來結成一團或同一個顏色連著兩顆。 */
  for (let i = 1; i < B.順序.length; i++) {
    const a = WM[B.順序[i - 1]], c = WM[B.順序[i]];
    ok(!(a.ratio > 2.5 && c.ratio > 2.5), `帶子上第 ${i}、${i + 1} 顆都是最長的那一種（${B.順序[i - 1]}／${B.順序[i]}）`);
    ok(a.color !== c.color, `帶子上第 ${i}、${i + 1} 顆同一個顏色（${B.順序[i - 1]}／${B.順序[i]}）`);
  }
  /* 等墨不等高 → 每一顆要垂直置中（y ＝ (最高 − 自己) / 2） */
  for (const o of BAND.it)
    ok(Math.abs(o.y - (BAND.高 - o.h) / 2) < 0.01, `帶子上的 ${o.k} 沒有垂直置中`);
  ok(BAND.高 / Math.min(...BAND.it.map((x) => x.h)) > 1.5,
    "九顆的高度差不到 1.5 倍 —— 那幾個寬度不再是按墨的面積正規化的，垂直置中那條理由要重寫");
  /* 形狀與寬度都要是讀回來的，不可以抄第二份 */
  ok(/brand", "shapes"/.test(GEN), "產生器沒有從 brand/shapes 讀形狀");
  ok(/wm-sizes\.json/.test(GEN), "產生器沒有從 wm-sizes.json 讀寬度");
  ok(!/\bd="M [\d.]+ /.test(GEN), "產生器裡出現了寫死的路徑資料 —— 形狀只有 brand/shapes 一份出處");
  /* 三格顏色都要畫出來，而且每一格都是九顆 */
  const bands = [...H.matchAll(/<svg class="bnd"[\s\S]*?<\/svg><\/svg>/g)];
  ok(bands.length === S.案.length + B.色案.length,
    `頁上畫出 ${bands.length} 條帶子（應該是 ${S.案.length} 張卡 ＋ ${B.色案.length} 格顏色）`);
  for (const m of bands)
    ok((m[0].match(/<svg x="/g) ?? []).length === 9, "有一條帶子不是九顆");
  /* ⓐ 那一格要真的九個顏色，ⓑⓒ 要真的只有一個 */
  const spec = bands[bands.length - B.色案.length][0];
  ok(new Set([...spec.matchAll(/color:(#[0-9a-f]{6})/gi)].map((x) => x[1].toLowerCase())).size >= 7,
    "「各自的科別色」那一格畫出來的顏色不到七種");
}

/* 每次出圖都要印抬頭那一行（換抬頭、動字距或標誌，這裡要有一個數字跟著變） */
ok(/抬頭「\$\{c\.抬頭\}」/.test(GEN), "面板沒有印抬頭那一行");
ok(/帶子 九顆/.test(GEN), "面板沒有印帶子那九顆");

/* ── ⑥ 不准寫死「第 N 題」 ────────────────────────────────────── */
{
  /* ⚠ 只掃「會印到頁面上的那幾塊」——`_說明` 那種註解是寫給改檔的人看的，
     記號在那裡不會被展開，寫死反而比較清楚。 */
  const 印的 = JSON.stringify({ 拆解: S.拆解, 案: S.案, 待答: S.待答, 現況: S.現況, QR: S.QR });
  ok(!/第\s*\d+\s*(題|條)/.test(印的), "資料裡寫死了「第 N 題／條」—— 要用 {{題:…}}／{{條:…}} 讓產生器現算");
  ok(印的.includes("{{題:") && 印的.includes("{{條:"), "{{題:…}}／{{條:…}} 那兩個記號不見了");
  ok(qn("帶子") === 6 && cn("順序") === 1, `記號算出 ${qn("帶子")}／${cn("順序")}，和那兩組對不起來`);
  /* 產生器自己也不可以寫死（它那一處要呼叫 qn()） */
  const gen = readFileSync(join(HERE, "stand-card.mjs"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  ok(!/第\s*\d+\s*(題|條)/.test(gen), "產生器裡寫死了「第 N 題／條」");
}

/* ── ⑦ noindex／零 JS ─────────────────────────────────────────── */
ok(/name="robots" content="noindex/.test(H), "少了 noindex");
ok(!/<script/i.test(H), "這一頁不可以有 <script>");
/* ⚠⚠ 2026-09-16 起多一個官方標誌檔，所以這一道從「只准有 index.html」放寬成
   **一張寫死的清單** —— 放寬成「大概可以」等於把它關掉（同 check-bind-prompt 那一輪）。 */
{
  const 准 = ["index.html", S.標誌.檔].sort();
  const 有 = readdirSync(DIR).sort();
  ok(有.join() === 准.join(), `這個資料夾裡只准有 ${准.join("、")}（現在有 ${有.join("、")}）`);
}

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
    /* ⚠ 標誌要真的載得到 —— 載不到的話 naturalWidth 是 0，而抬頭那一行看起來只是少了一顆圖 */
    const logo = [...document.querySelectorAll(".card .li")].map((e) => e.naturalWidth);
    const cards = [...document.querySelectorAll(".card")].map((e) => {
      const r = e.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    });
    /* 卡片上的每一行都不可以被裁掉（nowrap ＋ 卡片 overflow:hidden）——
       ⚠ 抬頭也在裡面：那顆標誌會把它撐寬，而溢出的樣子只是最後一個字不見 */
    const over = [...document.querySelectorAll(".card .hd, .card .bd p, .card .cue")]
      .filter((e) => e.scrollWidth - e.clientWidth > 1).length;
    /* ⚠⚠ 卡片的內距要跟著卡片走，不可以是百分比 —— 百分比的參照是父層那一欄，
       手機上和卡片不一樣寬，同一張 300px 的卡在 430 與 390 上會有不同的內距，
       而畫面看起來完全正常（踩過：24.1 vs 21.7）。 */
    const c0 = document.querySelector(".card");
    return {
      doc: document.documentElement.scrollWidth, win: window.innerWidth,
      pad: +parseFloat(getComputedStyle(c0).paddingLeft).toFixed(2),
      cards, over, logo,
    };
  });
  ok(m.doc <= m.win + 1, `${w} 寬有 ${m.doc - m.win}px 水平溢出`);
  ok(m.cards.length === NCARD, `${w} 寬只畫出 ${m.cards.length} 張卡（應該是 ${NCARD}）`);
  ok(m.over === 0, `${w} 寬有 ${m.over} 行被裁掉`);
  ok(m.logo.length === S.案.length && m.logo.every((x) => x === LOGO.寬),
    `${w} 寬的標誌載不到或不是那個檔（量到 ${m.logo.join("、")}）`);
  const r = m.cards[0];
  ok(Math.abs(m.pad - r.w * 0.06) < 0.5, `${w} 寬的卡片內距量到 ${m.pad}px，應該是卡片寬的 6% ＝ ${(r.w * 0.06).toFixed(2)}px`);
  ok(Math.abs(r.h / r.w - S.卡片.比例) < 0.02, `${w} 寬的卡片比例 ${(r.h / r.w).toFixed(3)}，應該是 ${S.卡片.比例}`);
  shots.push(`${w}：卡片 ${r.w}×${r.h}・溢出 0`);
}
await browser.close();

console.log(shots.join("\n"));
console.log("");
if (bad.length) { console.error("✗ " + bad.length + " 件\n" + bad.map((x) => "  ・" + x).join("\n")); process.exit(1); }
console.log(`✓ 全綠（${rows.length} 張卡、現況掃出 ${nowRed.length} 個紅線詞、${乾淨} 案乾淨、標誌 ${LOGO.寬}×${LOGO.高}、帶子九顆）`);
