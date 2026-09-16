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
 * ⑥之五 ⚠⚠⚠ 「字級照另一案」要在**資料裡宣告**：規則本身不可以被改掉，
 *    被照的那一案要存在、不可以接龍，釘上去之後最長那一行還要收得進版心，
 *    而且頁上要同時印出「規則會算幾 mm」—— 只印釘上去那個值的話，看不出是往上還是往下釘
 * ⑥之四 底下那條帶子 ＝ 診所自己的九顆 logo：順序照 JSON、形狀讀 brand/shapes、
 *    寬度讀 wm-sizes.json，而且**垂直置中**（等墨不等高）；相鄰的限制也要守
 * ⑦ noindex、零 JS（這一頁要拿給人看，沒有理由需要跑腳本）
 * ⑧ 八個寬度水平溢出 0，而且卡片真的畫成 CSS 變數那個寬度
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { S, lines, rows, fsOf, hdOf, cw, qn, cn, HDLS, LIH, LIGAP, LIW, LOGO, BAND, WM,
  切抬頭, 留白比, LIGAPOF, BDGAP, PGAP, 餘裕mm, 抬頭到主文mm, 行距mm } from "./stand-card.mjs";

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
/* ⚠⚠⚠ 2026-09-16 稍晚起，抬頭那一行**畫出來不含 LINE 左右那兩個半形空白**
   （它們變成標誌自己的左右留白）—— 所以這一道比的是「切過的那一份」，
   而 JSON 裡他寫的那一行仍然要原封不動（⑥之二 在盯）。
   ⚠ 切法用產生器那一支 `切抬頭`，不要在這裡再寫一條 —— 兩邊分家就等於沒在比。 */
const 印出來 = (c, l) => (l === c.抬頭 ? 切抬頭(l).join("LINE") : l);
[S.現況, ...S.案].forEach((c, i) => {
  for (const l of lines(c))
    ok((CARDS[i] ?? "").includes(印出來(c, l)), `第 ${i + 1} 張卡上找不到這一行：${印出來(c, l)}`);
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
/* ⚠⚠⚠ 2026-09-16 拿掉 Ⓐ~Ⓓ 之後，**沒有任何一案是不印數字的了** ——
   那幾案正好是「不印數字」那條路唯一的現場。這一道因此翻面而不是放水：
   一案都不乾淨的時候，**頁面上非得講得出那條路不可**（建議不印 ＋ 那兩種講法差在哪），
   不然那條規矩就只剩一句寫在資料裡、沒有人看得到的話。
   ⚠ 它和紅線那一道的「至少要有一案乾淨」是同一個精神，差別是紅線那一側 Ⓕ 還守得住。 */
if (無數字 === 0) {
  ok(/建議不印/.test(H) && H.includes("48 小時") && H.includes("看診前2天"),
    "每一案都印了時間的數字，而頁面上也不再講得出「建議不印」與那兩種講法差在哪 —— 那條規矩等於沒有了");
}
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
  /* ⚠ 兩把尺上那幾張也是真的卡，所以也各有一條帶子 —— 數的時候要算進來 */
  /* ⚠ 尺上那幾張也是真的卡，所以也各有一條帶子 —— 數的時候要算進來。
     ⚠⚠ 不可以照尺的格數算：抬頭到主文那把已經收成一張表、不再畫卡了（踩過）。 */
  const 尺數 = (H.match(/class="card sc"/g) ?? []).length;
  ok(bands.length === S.案.length + 尺數 + B.色案.length,
    `頁上畫出 ${bands.length} 條帶子（應該是 ${S.案.length} 張卡 ＋ ${尺數} 格尺 ＋ ${B.色案.length} 格顏色）`);
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

/* ── ⑥之五 字級的例外要在資料裡宣告，而且看得出是往哪一邊釘 ─────────
   ⚠⚠⚠ 2026-09-16 使用者：「用 E 但字級照 F」。做法是**替那一案宣告一個例外**，
   不是把規則改掉 —— 規則一改，四案比的就不再是文字本身（字少的自動變大）。
   ⚠ 釘上去之後最長那一行可能就放不下了，而卡片是 overflow:hidden：
     畫面上只會少掉最後幾個字，而每一道尺寸守門都會過（所以產生器直接 throw）。 */
{
  ok(/自然fs/.test(GEN) && /c\.字級\?\.照/.test(GEN),
    "產生器不再認得資料裡宣告的字級例外 —— 那一案會靜靜地退回規則算出來的字級");
  ok(/會被切掉，先斷行/.test(GEN), "釘上去之後放不下的那一道 throw 不見了");
  let 釘 = 0;
  for (const c of S.案) {
    if (!c.字級) continue;
    ok(c.字級.照, c.標籤 + " 的字級欄位沒有寫「照哪一案」");
    if (!c.字級.照) continue;
    釘++;
    const t = S.案.find((x) => x.id === c.字級.照);
    ok(t, c.標籤 + " 的字級要照 " + c.字級.照 + "，可是沒有那一案");
    if (!t) continue;
    ok(!t.字級?.照, c.標籤 + " 照的那一案自己也在照別人 —— 字級不要接龍");
    const f = fsOf(c);
    ok(f.最長 * f.fs <= S.卡片.版心 + 1e-9,
      c.標籤 + " 釘在那個字級之後，最長那一行佔 " + (f.最長 * f.fs * 100).toFixed(1) + "% 卡寬 —— 會被切掉");
    ok(Math.abs(f.fs - fsOf(t).fs) < 1e-9, c.標籤 + " 的字級沒有真的等於 " + t.標籤);
    /* ⚠ 兩個數字都要印在頁上：只印釘上去那個值，看不出這一釘是往上還是往下 */
    const r0 = rows.find((x) => x.id === c.id);
    /* ⚠⚠⚠ 不可以拿「頁上有沒有 5.88 這個數字」去找 —— 別案的字高剛好也是 5.88，
       掃整頁一定命中（第一次就是這樣放行的）。要找的是那一格印出來的**整句**。 */
    ok(H.includes("釘在 " + r0.照 + "・規則會算 " + r0.自然mm),
      c.標籤 + " 那一格沒有印出「釘在誰・規則會算幾 mm」—— 只印釘上去那個值，看不出是往上還是往下釘");
    ok(H.includes(r0.字高mm + " mm"), c.標籤 + " 釘出來的字級沒有印在頁上");
  }
  ok(釘 <= S.案.length - 1, "每一案都在照別人 —— 那條規則等於沒有了");
  /* ⚠⚠⚠ 這兩件是使用者 2026-09-16 的決定（「用 E 但字級照 F」、「約診前」→「看診前」）——
     拿掉字級那個釘、或把那一行改回「約診前」，畫面照樣正常、每一道尺寸守門都會過。 */
  const E = S.案.find((x) => x.id === "e");
  ok(E?.字級?.照 === "f", "Ⓔ 的字級不再釘在 Ⓕ 上 —— 那是使用者指定的");
  ok(E?.主文.includes("看診前2天自動提醒！"), "Ⓔ 少了使用者指定的那一行「看診前2天自動提醒！」");
  for (const c of S.案) ok(!lines(c).join("").includes("約診前"), c.標籤 + " 還寫著「約診前」—— 2026-09-16 已經改成「看診前」");
}

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

/* ── ⑥之六 兩把間距的尺（2026-09-16 稍晚）─────────────────────────
 * 使用者三句：「這兩行中間有很大的間隔　縮小一點　要預留空間給下面畫診所人物插圖」、
 * 「line logo 和前後文字間距也有點大」、「標誌左右的留白我看不出差別　感覺 Ⓘ4 都還不夠」。
 * ⚠⚠ 抬頭到主文那把上午定案（Ⓗ4）、收成一張表，**同一天稍晚又打開了**
 *   （使用者：「這段間距再調一下　除了每段之間縮減一點　感覺離最上段還有不少空間」）——
 *   表上多了三格，**而且比預設緊的那幾格重新畫成真的卡片**；同一句話另外開了第二把尺（Ⓙ 每段之間）。
 * ⚠⚠⚠ **那兩把不是獨立的**：抬頭到主文那一段的中間那一截就是段距，
 *   所以段距一收，抬頭那一段也收一點、但行距收得更多 —— **比值反而變大**。
 *   這裡因此兩把一起驗，而且驗的是「畫出來的 mm」不是屬性。 */
{
  /* ⚠⚠⚠ 切法只能有一份 —— mark() 與抬頭的字級算式要吃同一個函式，
     分家的話抬頭會算出一個放得下、畫出去卻溢出卡片的字級（overflow:hidden，只少最後一個字）。 */
  ok(/export const 切抬頭 =/.test(GEN), "產生器沒有 切抬頭 —— 那兩個半形空白的切法不見了");
  ok(/切抬頭\(t\)\.map\(esc\)\.join\(LIIMG\)/.test(GEN),
    "mark() 不再用 切抬頭 畫抬頭 —— 切法和字級算式會分家");
  ok(!/\(0\.5 \+ HDLS \+ LIGAP\)/.test(GEN),
    "還留著舊的留白算式（半形空白 ＋ 字距）—— 那個值現在是 留白比 給的，兩份會分家");
  ok(typeof S.標誌.留白比 === "number" && !("留白em" in S.標誌),
    "標誌的留白還是 留白em —— 單位要換成「標誌自己高度的幾成」（LINE 規範的單位，換字級也不必重挑）");

  /* ⚠⚠⚠ --bd-gap 一定要是一個**長度**：寫成純數字（0.02）的話 margin-top 整條無效 ＝ 0，
     而畫面完全正常、每一道尺寸守門都會過。踩過一次。
     ⚠ 這一道要**指名 :root 那一塊** —— 別處的 inline style 裡也寫著同一串字（第十一次「掃整頁等於沒掃」）。 */
  {
    const root = (H.match(/:root\{[\s\S]*?\}/) ?? [""])[0];
    ok(/--bd-gap:calc\(var\(--cw\) \* [\d.]+\)/.test(root),
      ":root 的 --bd-gap 不是一個長度（寫成純數字的話 margin-top 整條無效 ＝ 0，而畫面完全正常）");
  }
  ok(/\.card \.bd\{margin-top:var\(--bd-gap\)/.test(H), "抬頭到主文那一段沒有吃 --bd-gap");
  ok(/\.li\{[^}]*margin:0 var\(--li-gap\)/.test(H), "標誌的左右留白沒有吃 --li-gap");

  const 尺H = S.卡片.抬頭到主文案, 尺I = S.標誌.留白案;
  const e = S.案.find((c) => c.id === "e");
  ok(尺H.length >= 3 && 尺I.length >= 3, "尺不到三格 —— 間距這種東西並排才比得出來");
  ok(尺H.some((k) => k.值 === 0.08), "抬頭到主文那把尺上沒有現況那一格（比不出改了多少）");
  ok(尺I.some((k) => Math.abs(k.比 - 0.353) < 1e-9), "標誌留白那把尺上沒有現況那一格");
  ok(尺H.some((k) => k.值 === BDGAP), "預設的抬頭到主文 " + BDGAP + " 不在那張表上 —— 他挑的那一格和畫出來的會分家");
  ok(尺I.some((k) => k.比 === 留白比), "預設的標誌留白 " + 留白比 + " 不在尺上");

  /* ⚠⚠⚠ 地板 2026-09-16 稍晚從 1.4 倍鬆到 **1.0 倍** —— 使用者要的比 1.4 緊
     （「感覺離最上段還有不少空間」，而定案的 Ⓗ4 算出來正是 1.6 倍）。
     ⚠ 1.4 是我們自己加的一道比理由更嚴的線；**真正的地板寫在那一行註解裡**：
       收到比主文行距還小，抬頭就會被讀成主文的第一行 ＝ 1.0 倍。
     ⚠⚠ 鬆掉的那 0.4 倍沒有消失 —— 那張表上每一格都印著它是行距的幾倍。
     ⚠⚠⚠ **誠實的一半：照現在的幾何，這一道有很大的餘裕、這把尺上沒有一格碰得到它** ——
       抬頭比主文大 1.52 倍，所以連「完全不留」那一格算出來都還有 1.16 倍
       （式子：(g ＋ .25×抬頭字級比 ＋ .25) ÷ (g ＋ .5)，抬頭只要比主文大就恆大於 1）。
       它會亮的時機是**抬頭縮到和主文差不多大**，或行高從 1.5 改掉 —— 兩件都是這一道在守的。 */
  ok(抬頭到主文mm(e, BDGAP) >= 行距mm(e),
    "預設那一格算出來只有行距的 " + (抬頭到主文mm(e, BDGAP) / 行距mm(e)).toFixed(2) + " 倍 —— 抬頭會被讀成主文的第一行");

  /* ── 第二把尺（Ⓙ 每段之間）──────────────────────────────────── */
  const 尺J = S.卡片.段距案;
  ok(typeof S.卡片.段距 === "number" && S.卡片.段距 === PGAP, "資料裡沒有「段距」，或它和產生器用的那個值分家了");
  ok(Array.isArray(尺J) && 尺J.length >= 3, "每段之間那把尺不到三格 —— 間距這種東西並排才比得出來");
  ok(尺J.some((k) => k.值 === 0.28), "每段之間那把尺上沒有現況那一格（比不出改了多少）");
  ok(尺J.some((k) => k.值 === PGAP), "預設的段距 " + PGAP + " 不在那張表上 —— 他挑的那一格和畫出來的會分家");
  ok(Array.isArray(S.卡片.段距_說明) && S.卡片.段距_說明.length > 3, "段距那把尺沒有寫下它為什麼存在");
  /* ⚠⚠⚠ --p-gap 一定要是一個**長度**（同 --bd-gap 那一道）：寫成純數字的話 margin 整條無效 ＝ 0，
     而畫面完全正常。⚠ 一樣要指名 :root 那一塊。 */
  {
    const root = (H.match(/:root\{[\s\S]*?\}/) ?? [""])[0];
    ok(/--p-gap:[\d.]+em/.test(root), ":root 的 --p-gap 不是一個長度（純數字的話 margin 整條無效 ＝ 0，而畫面完全正常）");
  }
  ok(/\.card \.bd p\{margin:var\(--p-gap\)/.test(H), "主文段與段之間沒有吃 --p-gap —— 那把尺按了不會有任何反應");
  /* ⚠⚠ 兩把尺互相牽動，所以**兩張表都要印「抬頭到主文」與「幾倍」** ——
     只印自己那一欄的話，收段距會讓抬頭那一段變遠這件事在頁面上看不出來。 */
  for (const k of 尺J) {
    const 行 = 行距mm(e, k.值), 抬 = 抬頭到主文mm(e, BDGAP, k.值);
    ok(H.includes("<td>" + 行 + " mm</td>"), "段距那張表上「" + k.標籤 + "」沒有印出主文行距 " + 行 + " mm");
    ok(H.includes("<td>" + 抬 + " mm</td>"), "段距那張表上「" + k.標籤 + "」沒有印出抬頭到主文 " + 抬 + " mm");
  }
  /* ⚠ 比預設緊的那幾格要畫成真的卡片（算的不是列的 —— 插一格不必回來改這裡） */
  const 該畫 = 尺H.filter((k) => k.值 <= BDGAP).length + 尺J.length;
  ok((H.match(/class="card sc"/g) ?? []).length === 該畫,
    "尺上畫出來的卡片不是 " + 該畫 + " 張 —— 間距並排才比得出來，收成一張表就等於沒有尺");

  /* ⚠⚠⚠ 2026-09-16 使用者：「感覺 Ⓘ4 都還不夠」—— 他要的比我們手上記的規範還緊。
     做法同 紅線 那一輪：**做出來給他看、但跨線的那幾格要在資料裡宣告、而且那句話要印在頁上**，
     而且**至少要有一格是不跨線的**（不然一張「大家都有例外」的表會把這一道靜靜地關掉）。
     ⚠ 我們自己**不跨過去**：預設那一格一定要在線上或線內。 */
  const 規範 = 0.25;
  /* ⚠⚠⚠ 2026-09-16 定案 Ⓘ4 ＝ 12%，**跨過那條線了**（使用者：「選這個」）。
   *   所以這一道翻面：預設**可以**低於規範，但只准在三件同時成立的時候 ——
   *   ① 那一格在資料裡宣告了例外 ② 那句話印在頁上 ③ **頁面上仍然講得出那條線在哪**。
   * ⚠⚠ 第 ③ 件是這一道真正在守的東西：尺收掉之後，最容易一起消失的就是那個地板。 */
  const 預設格 = 尺I.find((k) => k.比 === 留白比);
  ok(預設格, "預設的標誌留白不在尺上，連它有沒有跨線都判斷不了");
  if (預設格 && 留白比 < 規範 - 1e-9) {
    ok(!!預設格.例外, "預設的標誌留白 " + (留白比 * 100).toFixed(1) +
      "% 低於規範的 " + (規範 * 100).toFixed(0) + "%，卻沒有在資料裡宣告例外 —— 跨線要是一個決定，不是一個值");
    ok(!!S.標誌.留白比_定案, "標誌留白跨過規範那條線，卻沒有寫下那是誰在什麼時候挑的");
    /* ⚠⚠ 要找的是那一欄的抬頭，不是頁面上任何一個 25% —— 別處順便提到也會命中，
       那樣這一道就等於沒開（這條線第十二次「掃整頁等於沒掃」）。 */
    ok(H.includes("對規範（" + (規範 * 100).toFixed(0) + "%）"),
      "那張表上沒有「對規範（" + (規範 * 100).toFixed(0) + "%）」那一欄 —— 尺收掉了，地板不可以跟著消失");
  }
  ok(尺I.some((k) => k.比 >= 規範 - 1e-9), "標誌留白的尺上沒有任何一格守得住規範 —— 那就沒有基準了");
  for (const k of 尺I) {
    if (k.比 >= 規範 - 1e-9) { ok(!k.例外, k.標籤 + " 沒有跨線，卻宣告了例外"); continue; }
    ok(!!k.例外, k.標籤 + " 低於規範的 25%，卻沒有在資料裡宣告例外");
    ok(H.includes(k.例外), k.標籤 + " 的例外沒有印在頁上 —— 跨線這件事不可以只寫在資料裡");
  }

  /* 每一格的數字都要印在頁上（整句找，不是找那個數字 —— 同一個值在別處也會出現） */
  for (const k of 尺H) {
    const 抬 = 抬頭到主文mm(e, k.值), 行 = 行距mm(e);
    ok(H.includes("<td>" + 抬 + " mm</td>"), "那張表上「" + k.標籤 + "」沒有印出抬頭到主文 " + 抬 + " mm");
    /* ⚠ 那一格現在帶著 class（低於 1.0 倍要亮紅），所以不可以再用 "<td>…</td>" 去對 */
    ok(new RegExp('<td class="[^"]*">' + (抬 / 行).toFixed(1) + " 倍").test(H),
      "那張表上「" + k.標籤 + "」沒有印出它是行距的幾倍");
    ok(H.includes("<td>" + 餘裕mm(e, k.值) + " mm</td>"),
      "那張表上「" + k.標籤 + "」沒有印出空出來多少 —— 那正是他要那一塊的理由");
  }
  for (const k of 尺I) {
    const hd = hdOf(e, k.比);
    ok(H.includes("<b>" + (k.比 * 100).toFixed(1) + "%</b> 個標誌高"), "尺上「" + k.標籤 + "」那一格沒有印出留白幾成");
    ok(H.includes("＝ <b>" + (hd.留白em * hd.fs * S.卡片.寬mm).toFixed(2) + " mm</b>"),
      "尺上「" + k.標籤 + "」那一格沒有印出留白幾 mm");
  }

  /* ⚠⚠ 2026-09-16 定案，那條對照帶收掉了 —— 那幾列與基準線都不可以再留在頁上
     （留著的話那把尺看起來還開著，而它已經有答案了）。 */
  ok(!/class="hdcmp"|class="hdrow"/.test(H), "那條對照帶還在頁上 —— 尺已經定案（Ⓘ4），收掉");
  /* ⚠⚠⚠ 但它量出來的每一格都要留在那張表上（同 50-22：尺可以收，數字不可以跟著消失）——
     上面那個逐格 includes 已經在守數字，這裡守的是「那一欄真的把線畫在哪裡講出來了」。 */
  ok(H.includes("對規範"), "收成表之後沒有「對規範」那一欄 —— 哪一格跨線就看不出來了");
  ok(H.includes("・定案"), "那張表上沒有任何一格標著定案");
  /* ⚠⚠ 跨線這件事每次出圖都要印一次（第九節第 28 條 ④：壞掉檢查擋不住「靜靜地跨過去」）——
     面板與頁上那一句都要講，不然日後有人改了留白比，這裡一個數字都不會變。 */
  ok(/低於規範的/.test(GEN), "面板沒有在跨線的時候講一句 —— 那會變成一個沒有人會發現的決定");
  ok((H.match(/<span class="bad">⚠ /g) ?? []).length >= 尺I.filter((k) => k.例外).length,
    "跨線那幾格在表上沒有標紅");
}


/* ── ⑥之七 拿掉的那四案 ───────────────────────────────────────────
 * ⚠⚠⚠ 2026-09-16 使用者：「提案頁其他可以先刪掉了」。**拿掉的是畫面，不是理由** ——
 *   哪幾案走了、什麼時候走的、去哪裡取回來，三件都要留在資料裡而且印在頁上。
 * ⚠⚠ 而且 Ⓕ 不可以跟著走：Ⓔ 的字級釘在它身上（⑥之五 已經在守），
 *   它又是紅線那一道唯一乾淨的一案（③ 在守）。這裡守的是「紀錄還在」。 */
{
  const D = S.刪案;
  ok(D && Array.isArray(D.走了) && D.走了.length >= 1, "四案拿掉了，卻沒有留下「拿掉了哪幾案」");
  for (const t of D.走了) ok(H.includes(t), "拿掉的「" + t + "」沒有印在頁上 —— 走掉的案名要留得住");
  ok(D.取回 && /^git show [0-9a-f]{7,}:/.test(D.取回) && H.includes(D.取回),
    "沒有印出「要回頭比從哪裡取」的那一行指令");
  ok(!S.案.some((c) => D.走了.includes(c.標籤)), "拿掉的案還在案裡");
  /* ⚠ 案數是現算的，不可以寫死「四案」—— 拿掉之後那個詞會靜靜地說謊 */
  ok(/const 案數詞 = /.test(GEN) && !/>四案</.test(H),
    "頁面上還寫著「四案」（現在是 " + S.案.length + " 案）—— 那個數字要現算");
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
    const logo = [...document.querySelectorAll(".card:not(.sc) .li")].map((e) => e.naturalWidth);
    const cards = [...document.querySelectorAll(".card:not(.sc)")].map((e) => {
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
/* ── ⑧之二 兩把尺挑定的值，量出來的要和算出來的一樣 ─────────────────
 * ⚠⚠⚠ 整疊（疊高）是算的，這一段是唯一會告訴我算錯的東西 ——
 *   而「省下來的高度有沒有真的落到下面」正是使用者要那一塊的理由。
 * ⚠⚠ 量的是**預設值**（Ⓗ4 ＋ Ⓙ1 ＋ Ⓘ4）：抬頭到主文的框距、
 *   標誌左右的留白、QR 底下到帶子還剩多少 —— 三件都在「案」那幾張卡上。 */
{
  await pg.setViewportSize({ width: 1440, height: 900 });
  await pg.goto("file://" + F);
  const 卡 = await pg.evaluate(() => {
    const rg = document.createRange();
    /* ⚠ 量墨不要量整段文字節點 —— 兩邊都不再有空白，但日後有人加回去這裡要還是對的 */
    const ink = (n) => { const d = n.data; let a = 0, z = d.length;
      while (a < z && /\s/.test(d[a])) a++; while (z > a && /\s/.test(d[z - 1])) z--;
      rg.setStart(n, a); rg.setEnd(n, z); return rg.getBoundingClientRect(); };
    const 留白 = (host) => {
      const img = host.querySelector("img.li");
      if (!img) return { 左: null, 右: null };
      const ir = img.getBoundingClientRect();
      const tn = [...host.childNodes].filter((n) => n.nodeType === 3 && n.data.trim());
      if (tn.length !== 2) return { 左: null, 右: null };
      return { 左: (ir.left - ink(tn[0]).right) / ir.height, 右: (ink(tn[1]).left - ir.right) / ir.height };
    };
    const 卡 = [...document.querySelectorAll(".one:not(.sc) .card:not(.now)")].map((c) => {
      const cw = c.getBoundingClientRect().width, mm = (v) => v / cw * 98;
      const hd = c.querySelector(".hd"), hr = hd.getBoundingClientRect();
      const ps = [...c.querySelectorAll(".bd p")].map((x) => x.getBoundingClientRect());
      const qr = c.querySelector(".qr").getBoundingClientRect();
      const cue = [...c.querySelectorAll(".cue")].map((x) => x.getBoundingClientRect());
      const band = c.querySelector(".band").getBoundingClientRect();
      /* ⚠ 最底下那一塊不一定是最後一個 .cue —— 有的案只有 QR 上面那一行，
         拿它當底會把整顆 QR 一起算進餘裕裡（踩過）。取「底邊最低」的那一個。 */
      const 底 = [qr, ...cue].reduce((a, b) => (b.bottom > a.bottom ? b : a));
      return { 框mm: mm(ps[0].top - hr.bottom), 餘mm: mm(band.top - 底.bottom), ...留白(hd) };
    });
    return 卡;
  });

  /* ⚠⚠⚠ 對照帶 2026-09-16 收掉了（Ⓘ4 定案），所以這一段只剩「案」那幾張卡 ——
     **而它們吃的正是預設值**，也就是真的會印出去的那一組。
     ⚠ 尺在的時候那幾列都掛著 inline 覆寫，預設值反而是唯一沒有人量過的東西（踩過）。 */
  /* 案那幾張吃的是預設值 —— 這一段驗的就是真的會印出去的那一組 */
  for (const [i, c] of S.案.entries()) {
    const r = 卡[i];
    ok(!!r, "量不到 " + c.標籤 + " 那一張卡");
    if (!r) continue;
    const 該 = (BDGAP + PGAP * fsOf(c).fs) * 98;
    ok(Math.abs(r.框mm - 該) < 0.3,
      c.標籤 + " 抬頭到主文量到 " + r.框mm.toFixed(2) + " mm，預設值算出來是 " + 該.toFixed(2));
    ok(Math.abs(r.餘mm - 餘裕mm(c)) < 0.4,
      c.標籤 + " QR 底下到帶子量到 " + r.餘mm.toFixed(1) + " mm，算出來是 " + 餘裕mm(c) + " —— 疊高() 算錯了");
    ok(r.左 != null && Math.abs(r.左 - 留白比) < 0.01 && Math.abs(r.右 - 留白比) < 0.01,
      c.標籤 + " 標誌左右量到 " + (r.左 * 100).toFixed(1) + "%／" + (r.右 * 100).toFixed(1) +
      "%，預設是 " + (留白比 * 100).toFixed(1) + "%");
  }
  /* ⚠ 那兩個半形空白不可以再被畫出來（它們現在是標誌的左右留白） */
  const txt = await pg.evaluate(() => [...document.querySelectorAll(".card:not(.now) .hd")]
    .map((e) => e.textContent).join("|"));
  ok(!/\s/.test(txt), "抬頭那一行還畫著空白（" + txt + "）—— 那兩個半形空白要由留白比接手");
}

await browser.close();

console.log(shots.join("\n"));
console.log("");
if (bad.length) { console.error("✗ " + bad.length + " 件\n" + bad.map((x) => "  ・" + x).join("\n")); process.exit(1); }
console.log(`✓ 全綠（${rows.length} 張卡、現況掃出 ${nowRed.length} 個紅線詞、${乾淨} 案乾淨、標誌 ${LOGO.寬}×${LOGO.高}、帶子九顆）`);
