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
 * ⑥之八 ⚠⚠⚠ 這一頁 2026-09-16 收成**一張卡**（使用者：「保留 E 就好　F 拿掉」＋
 *    「以上還有其他下面的都不需要了」）—— 收掉的那幾節接回去畫面完全正常，所以逐項擋；
 *    而**資料一筆都沒有刪**，上面每一段照舊在驗它們，數字改由面板接手
 * ⑦ noindex、零 JS（這一頁要拿給人看，沒有理由需要跑腳本）
 * ⑧ 三個寬度水平溢出 0，而且卡片真的畫成 CSS 變數那個寬度
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { S, lines, rows, fsOf, hdOf, cw, qn, cn, HDLS, LIH, LIGAP, LIW, LOGO, BAND, WM, 帶, 底色, 墨色, CARD,
  切抬頭, 留白比, LIGAPOF, BDGAP, PGAP, 餘裕mm, 抬頭到主文mm, 行距mm,
  QRSRC, QRFILE, QRPLATE, QRVAR, 印的案, 不印的 } from "./stand-card.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DIR = join(ROOT, "preview", "line-stand");
const F = join(DIR, "index.html");
const bad = [];
const ok = (c, m) => { if (!c) bad.push(m); };

/* ── ① 逐位比對 ───────────────────────────────────────────────── */
{
  const { execFileSync } = await import("node:child_process");
  /* ⚠⚠ 產生器 --check 丟出來的訊息要**原句印出來** —— 不接的話 execFileSync 會把整包
     stdout/stderr 當成位元組陣列吐在畫面上，而那正是它最該說人話的時候（踩過）。 */
  try {
    execFileSync(process.execPath, [join(HERE, "stand-card.mjs"), "--check"], { stdio: "pipe" });
  } catch (e) {
    const m = String(e.stderr ?? "").match(/^\s*(?:Error|throw new Error\()?.*$/m);
    const 句 = (String(e.stderr ?? "").match(/Error: (.*)/) ?? [, m?.[0] ?? "產生器 --check 沒有過"])[1];
    console.error("✗ 1 件\n  ・" + 句);
    process.exit(1);
  }
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
/* ⚠⚠⚠ 2026-09-16 使用者：「保留 E 就好　F 拿掉」＋「以上還有其他下面的都不需要了」——
   現況那一張與 Ⓕ 都不畫了，所以數的是**印的案**，不是 S.案.length。
   ⚠ 兩者都還在資料裡（現況是紅線的正向對照、Ⓕ 是 Ⓔ 字級釘住的那一案），底下各自有一道在守。 */
const CARDS = [...H.matchAll(/<div class="card(?: now)?">[\s\S]*?<\/div>\n<\/div>/g)].map((m) => strip(m[0]));
const NCARD = 印的案.length;
ok(CARDS.length === NCARD, `頁上抓到 ${CARDS.length} 張卡的標記（要印的是 ${NCARD} 張）`);
/* ⚠⚠⚠ 2026-09-16 稍晚起，抬頭那一行**畫出來不含 LINE 左右那兩個半形空白**
   （它們變成標誌自己的左右留白）—— 所以這一道比的是「切過的那一份」，
   而 JSON 裡他寫的那一行仍然要原封不動（⑥之二 在盯）。
   ⚠ 切法用產生器那一支 `切抬頭`，不要在這裡再寫一條 —— 兩邊分家就等於沒在比。 */
const 印出來 = (c, l) => (l === c.抬頭 ? 切抬頭(l).join("LINE") : l);
印的案.forEach((c, i) => {
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
/* ⚠⚠⚠ 2026-09-16 使用者自己把「再也不怕忘記看診時間，」那一行從 Ⓔ 拿掉了 ——
   所以這一道翻面：**那一句不可以再出現在任何一張印出來的卡上**。
   ⚠ 掃描表仍然真的在掃，證據是上面那一行（現況在資料裡、掃出 ${nowRed.length} 個詞）——
     它不必印在頁上就守得住 —— 那一道（現況掃出幾個詞）是資料層的。 */
for (const c of 印的案)
  ok(!lines(c).join("").includes("再也不怕忘記"), c.標籤 + " 又寫回「再也不怕忘記看診時間」—— 那一行是使用者 2026-09-16 拿掉的");
/* ⚠⚠ 「乾淨的那一案」現在**不印在頁上**（Ⓕ）—— 那沒有把這一道關掉，但它要看得見：
   不印的那幾案要在資料裡記下為什麼不印，而且頁面上要講得出它們還在。 */
for (const c of 不印的) {
  ok(Array.isArray(c._不印) && c._不印.length, c.標籤 + " 標了「不印」卻沒有寫為什麼 —— 拿掉的是畫面，不是理由");
  ok(H.includes(c.標籤), c.標籤 + " 不印在頁上，而頁面上也沒有講它還在 —— 那就真的不見了");
}

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

/* ⚠⚠⚠ 2026-09-16 現況那一張**從頁面上收掉了**（使用者：「以上……都不需要了」），
   所以這一道從「畫出來對不對」翻成「資料與算式還在不在」：
   它仍然是紅線掃描唯一的正向對照，而且抬頭的字級規則仍然要特判它（不換標誌）。
   ⚠ 頁面上不可以再出現那一張（接回去不會讓任何一道版面守門翻臉）。 */
{
  ok(!/<div class="card now"/.test(H), "現況那一張又畫回頁面上了 —— 2026-09-16 已經收掉");
  ok(S.現況 && S.現況.主文?.length, "現況那一筆從資料裡不見了 —— 它是紅線掃描的正向對照");
  ok(/c === S\.現況 \? \[t\] :/.test(GEN), "抬頭的字級規則不再特判現況 —— 現況那一張不換標誌，算式也不可以把它算進去");
  ok(hdOf(S.現況).標誌 === 0, "抬頭的字級規則把現況也當成有標誌");
  /* 回去的路要留著：card() 那一支仍然畫得出「現況」那一態 */
  ok(/<div class="qr ph">/.test(GEN), "card() 不再畫得出現況那一態（灰色佔位方塊）—— 那是回去的路");
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

/* ── ⑥之四 底下那條帶子：診所自己的 logo ─────────────────────────
   ⚠⚠⚠ 2026-09-16 使用者五件：四邊與中間的間隔要一致／小一點／多放一兩個／
   底色用一般牙科主題色／標誌白色、牙洞就是那塊底色。前兩件是尺（Ⓚ 顆數、Ⓛ 間距），
   後三件是決定 —— 每一件改回去畫面都還是很正常，所以每一件都要有一道。 */
{
  const B = S.帶子;
  ok(B.順序案.length >= 2, "顆數那把尺只剩一格 —— 那就不是尺了");
  ok(B.順序案.some((k) => k.顆 === B.顆數), `順序案裡沒有定案那一格（${B.顆數} 顆）`);
  ok(B.間距案.some((k) => k.值 === B.間距), `間距案裡沒有定案那一格（${B.間距}）`);
  /* ⚠⚠⚠ 三個順序案**每一個**都要守住那三條限制 —— 只驗定案那一格的話，
     另外兩格排錯了照樣畫在頁面上，而且畫面完全正常。 */
  for (const 案 of B.順序案) {
    ok(案.序.length === 案.顆, `${案.標籤} 寫著 ${案.顆} 顆、序裡有 ${案.序.length} 個`);
    for (const k of 案.序) {
      ok(!!WM[k], `wm-sizes.json 裡沒有 ${k}`);
      ok(existsSync(join(ROOT, "brand", "shapes", `shape-${k}.svg`)), `brand/shapes 裡沒有 shape-${k}.svg`);
    }
    /* 重複的那幾顆要挑「站上真的在用的那兩顆」—— 那是一個設計項，不是隨手多拿一個 */
    const 多 = 案.序.filter((k, i) => 案.序.indexOf(k) !== i);
    for (const k of 多) ok(B.重複.includes(k), `${案.標籤} 重複了 ${k}，而它不在「重複」那張清單裡`);
    ok(new Set(案.序).size === 案.序.length - 多.length, `${案.標籤} 有一顆重複了三次`);
    for (let i = 1; i < 案.序.length; i++) {
      const a = WM[案.序[i - 1]], c = WM[案.序[i]];
      ok(案.序[i - 1] !== 案.序[i], `${案.標籤} 第 ${i}、${i + 1} 顆是同一個形狀（${案.序[i]}）`);
      ok(!(a.ratio > 2.5 && c.ratio > 2.5), `${案.標籤} 第 ${i}、${i + 1} 顆都是最長的那一種（${案.序[i - 1]}／${案.序[i]}）`);
      ok(a.color !== c.color, `${案.標籤} 第 ${i}、${i + 1} 顆同一個顏色（${案.序[i - 1]}／${案.序[i]}）`);
    }
  }
  /* 等墨不等高 → 每一顆要垂直置中（上下都留一個間距，中間那一段再置中） */
  for (const o of BAND.it)
    ok(Math.abs(o.y - (BAND.gap + (BAND.高 - o.h) / 2)) < 0.01, `帶子上的 ${o.k} 沒有垂直置中`);
  ok(BAND.高 / Math.min(...BAND.it.map((x) => x.h)) > 1.5,
    "那幾顆的高度差不到 1.5 倍 —— 那幾個寬度不再是按墨的面積正規化的，垂直置中那條理由要重寫");
  /* ⚠⚠⚠ 四邊與中間那五個間隔要**一模一樣**（使用者 2026-09-16）——
     改動前兩邊那個是「版心對滿版」剩下的頁面內距（7.8 mm）、中間那個是 SVG 裡算出來的
     （2.1 mm），差 3.7 倍。現在它們出自同一個算式，這一道是那件事的證明。 */
  ok(Math.abs(BAND.it[0].x - BAND.gap) < 0.01, "帶子左邊那個間隔和中間不一樣");
  const 尾 = BAND.it[BAND.it.length - 1];
  ok(Math.abs(BAND.總寬 - (尾.x + 尾.w) - BAND.gap) < 0.01, "帶子右邊那個間隔和中間不一樣");
  ok(Math.abs(BAND.總高 - BAND.高 - 2 * BAND.gap) < 0.01, "帶子上下那個間隔和中間不一樣");
  for (let i = 1; i < BAND.it.length; i++)
    ok(Math.abs(BAND.it[i].x - (BAND.it[i - 1].x + BAND.it[i - 1].w) - BAND.gap) < 0.01,
      `帶子上第 ${i}、${i + 1} 顆之間的間隔和別處不一樣`);
  /* ⚠⚠ 內距烘在 viewBox 裡，所以 CSS 不可以再補一層 —— 補了兩邊就又和中間不一致了，
     而且畫面完全正常。同理那一條一定要滿版（--cw），不是版心。 */
  ok(/\.card \.band\.logos\{background:transparent;padding:0;display:block\}/.test(GEN),
    ".band.logos 又長出 padding 或底色了 —— 底色與四邊的留白都在 SVG 裡");
  ok(/\.card \.band\.logos \.bnd\{width:var\(--cw\)/.test(GEN),
    "那一條不是滿版 —— 底色要頂到卡片兩邊，而且兩邊的間隔要由 SVG 給");
  /* 形狀與寬度都要是讀回來的，不可以抄第二份；底色也讀 wm-sizes.json */
  ok(/brand", "shapes"/.test(GEN), "產生器沒有從 brand/shapes 讀形狀");
  ok(/wm-sizes\.json/.test(GEN), "產生器沒有從 wm-sizes.json 讀寬度");
  ok(!/\bd="M [\d.]+ /.test(GEN), "產生器裡出現了寫死的路徑資料 —— 形狀只有 brand/shapes 一份出處");
  ok(/export const 底色 = WM\.r1c1\.color;/.test(GEN),
    "底色沒有讀 wm-sizes.json 的 r1c1 —— 一般牙科那支綠不要在這裡再抄一份色碼");
  ok(底色.toLowerCase() === "#3f654a", `底色算出來是 ${底色}，不是一般牙科那支綠`);
  /* 白壓在那塊綠上（裝飾性圖形，但順手量一次） */
  const lum = (h) => { const c = [1, 3, 5].map((i) => { const v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  ok(1.05 / (lum(底色) + 0.05) >= 4.5, "白壓在帶子底色上低於 4.5");
  /* 頁上每一條的形狀數、底色、墨色 */
  const bands = [...H.matchAll(/<svg class="bnd"[\s\S]*?<\/svg><\/svg>/g)];
  /* ⚠ 尺上那幾張也是真的卡，所以也各有一條帶子 —— 數的時候要算進來。
     ⚠⚠ 不可以照尺的格數算：兩把間距的尺都已經收成表、不再畫卡了（踩過），
        而且它們還會再被打開（Ⓗ 那把就打開過一次）—— 所以這個數字一律從頁面上數。
     ⚠⚠⚠ 2026-09-16 那條單獨的示範帶（.bandonly）也跟著整節收掉了，所以只剩卡片上那幾條。 */
  const 尺數 = (H.match(/class="card sc"/g) ?? []).length;
  ok(bands.length === 印的案.length + 尺數,
    `頁上畫出 ${bands.length} 條帶子（應該是 ${印的案.length} 張卡 ＋ ${尺數} 格尺）`);
  ok(!/class="bandonly"/.test(H), "那條單獨的示範帶又回來了 —— 帶子整節 2026-09-16 收掉了");
  for (const m of bands) {
    /* ⚠⚠⚠ 牙洞是 fill-rule evenodd 挖穿的，底下那塊綠自己會透出來 ——
       所以整條只准有兩種 fill：那塊底色的 rect，以及形狀自己的 currentColor。
       另外畫一塊綠色的洞上去畫出來一模一樣，但形狀一改就會對不準，**而且不報錯**。 */
    const fills = [...m[0].matchAll(/fill="([^"]+)"/g)].map((x) => x[1].toLowerCase());
    ok(fills.every((f) => f === 底色.toLowerCase() || f === "currentcolor"),
      `有一條帶子多出別的 fill（${[...new Set(fills)].join("／")}）—— 牙洞不要另外填色`);
    ok(fills.filter((f) => f === 底色.toLowerCase()).length === 1, "有一條帶子的底色不是一塊 rect");
    ok(/fill-rule="evenodd"/.test(m[0]), "有一條帶子的形狀掉了 fill-rule evenodd —— 牙洞會被填滿");
    ok(!/color:(?!#ffffff)/.test(m[0]), "有一條帶子的標誌不是白的");
  }
  for (const m of bands)
    ok((m[0].match(/<svg x="/g) ?? []).length === BAND.顆數,
      `卡上那一條不是 ${BAND.顆數} 顆`);
  /* ⚠⚠⚠ 2026-09-16 那兩張表跟著整節從**頁面上**收掉了（使用者：「以上……都不需要了」），
     所以這一道再翻一次面：每一格量出來的數字改由**面板**印，而且落選那幾格一格都不可以刪。
     ⚠ 同 50-22：尺可以收、表也可以收，它量出來的數字不可以跟著消失。 */
  for (const [案, , , ] of [[B.順序案], [B.間距案]])
    for (const k of 案) ok(!k.標籤.includes("定案"), `${k.標籤} 的標籤裡自己寫著「定案」`);
  ok(!/<table/.test(H), "頁面上又出現表格了 —— 四把尺與字級那幾張表 2026-09-16 都收掉了");
  /* ⚠⚠⚠ 2026-09-16 定案 Ⓚ3 ＋ Ⓛ2，兩把尺的帶子條**收掉了**，所以這一道翻面 ——
     而上面那兩張表逐格比對的每一個數字都還在（同 50-22、71-13、71-14：
     尺可以收，它量出來的數字不可以跟著消失）。
     ⚠ 定案那兩格仍然要在案裡（上面那一圈就是拿它們算「・定案」的），
       所以這裡另外守「那兩案一格都沒有被刪掉」。 */
  ok(!/class="bandrow"/.test(H), "兩把尺的帶子條又畫回來了 —— Ⓚ3／Ⓛ2 已定案，那兩把尺收成表了");
  ok(/Ⓚ 顆數 \$\{S\.帶子\.順序案/.test(GEN) && /Ⓛ 間距 \$\{S\.帶子\.間距案/.test(GEN),
    "面板沒有逐格印那兩把尺 —— 表收掉之後，那是它們量出來的數字唯一的去處");
  ok(!/bandrow/.test(GEN), "產生器裡還留著 bandrow");
  ok(B.順序案.some((k) => k.顆 === B.顆數) && B.間距案.some((k) => k.值 === B.間距),
    "定案那一格不在案裡 —— 尺收掉之後，定案值要留在表上才看得出它是從哪一格挑的");
  ok(B.順序案.length >= 2 && B.間距案.length >= 2,
    "落選那幾格被從資料裡刪掉了 —— 拿掉的是畫面不是理由");
  ok(String(B.顆數_定案 ?? "").includes("Ⓚ3") && String(B.間距_定案 ?? "").includes("Ⓛ2"),
    "兩把尺的定案那一句沒有寫下來");
  ok(B.色案_落選.join("").includes("前提換掉了"),
    "那三格沒有底色的顏色案，落選的理由不見了 —— 它們不是被比下去的，是前提換掉了");
}

/* 每次出圖都要印抬頭那一行（換抬頭、動字距或標誌，這裡要有一個數字跟著變） */
ok(/抬頭「\$\{c\.抬頭\}」/.test(GEN), "面板沒有印抬頭那一行");
ok(/帶子 \$\{BAND\.顆數\} 顆/.test(GEN), "面板沒有印帶子那幾顆");
ok(/四邊與中間都是/.test(GEN), "面板沒有印那五個間隔 —— 那正是這一輪要治的東西（第 28 條 ④）");
ok(/Ⓚ 顆數/.test(GEN) && /Ⓛ 間距/.test(GEN), "面板沒有印那兩把尺");

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
    /* ⚠ 兩個數字都要印在頁上：只印釘上去那個值，看不出這一釘是往上還是往下。
       ⚠⚠⚠ 2026-09-16 那張表收掉了，所以這兩個數字改由**那一案自己的註**印 ——
         而註是一張卡一張卡的，所以這一道要在**那一案的那一塊**裡找，不是掃整頁
         （別案的字高剛好也可能一樣，掃整頁等於沒掃，第一次就是這樣放行的）。 */
    const r0 = rows.find((x) => x.id === c.id);
    const i0 = 印的案.findIndex((x) => x.id === c.id);
    ok(i0 >= 0, c.標籤 + " 不印在頁上，可是它宣告了字級例外 —— 那個例外就沒有人看得到了");
    const 註 = i0 < 0 ? "" : (H.split('<p class="lb">')[i0 + 1] ?? "");
    ok(註.includes(r0.字高mm + " mm"), c.標籤 + " 的註裡沒有印出釘出來的字級 " + r0.字高mm + " mm");
    ok(註.includes(r0.自然mm + " mm"), c.標籤 + " 的註裡沒有印出「規則本來會算幾 mm」—— 看不出這一釘是往上還是往下");
    ok(/釘/.test(註) && 註.includes(t.標籤.slice(0, 1)), c.標籤 + " 的註裡沒有講它釘在哪一案上");
  }
  ok(釘 <= S.案.length - 1, "每一案都在照別人 —— 那條規則等於沒有了");
  /* ⚠⚠⚠ 這兩件是使用者 2026-09-16 的決定（「用 E 但字級照 F」、「約診前」→「看診前」）——
     拿掉字級那個釘、或把那一行改回「約診前」，畫面照樣正常、每一道尺寸守門都會過。 */
  const E = S.案.find((x) => x.id === "e");
  ok(E?.字級?.照 === "f", "Ⓔ 的字級不再釘在 Ⓕ 上 —— 那是使用者指定的");
  ok(E?.主文.includes("看診前2天自動提醒！"), "Ⓔ 少了使用者指定的那一行「看診前2天自動提醒！」");
  /* ⚠⚠⚠ 2026-09-16 使用者：「再也不怕忘記看診時間，　這段拿掉」——
     加回去畫面照樣正常（那一行放得下），每一道尺寸守門都會過，只有讀字才看得出來。 */
  ok(E?.主文.length === 3 && !E.主文.some((t) => t.includes("再也不怕")),
    "Ⓔ 又變回四行、或那一句被寫回去了 —— 使用者 2026-09-16 指定拿掉「再也不怕忘記看診時間，」");
  /* ⚠⚠ 被釘住的那一案可以不印在頁上（Ⓕ 2026-09-16 起就是），但它一定要還在資料裡 ——
     直接從「案」裡搬走的話產生器會 throw，這一道是那件事的第二層網。 */
  ok(S.案.some((x) => x.id === E?.字級?.照), "Ⓔ 釘住的那一案從資料裡不見了");
  /* ⚠⚠⚠ 2026-09-16 使用者：「保留 E 就好　F 拿掉」—— 這一頁只印 Ⓔ。
     把 Ⓕ 畫回去畫面完全正常、每一道版面守門都會過（它本來就是一張排得好好的卡），
     所以要直接守那個決定。⚠ 它和上面那一道是一對：Ⓕ 不印，但不可以從資料裡消失。 */
  ok(印的案.length === 1 && 印的案[0].id === "e",
    "這一頁印出了 " + 印的案.map((c) => c.標籤).join("、") + " —— 2026-09-16 使用者指定只留 Ⓔ");
  ok(S.案.find((x) => x.id === "f")?.不印 === true, "Ⓕ 又被畫回這一頁上了 —— 使用者 2026-09-16 指定拿掉");
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

/* ── ⑥之五 卡上那顆 QR（2026-09-16）─────────────────────────────
 * 使用者：「其他對話做好的 lineQRcode 放進來」。
 * ⚠⚠⚠ 這一頁**只搬不畫**：那顆碼是 2026-09-15 在另一條對話定案的成品，
 *   產生器把 `drafts/channels/qr/fangren-line-qr.svg` 原封不動複製過來。
 *   在這裡重畫一份就是第二個真相 —— 改了 qr-brand.mjs 這一頁不會跟著變，
 *   而且**畫面完全正常**，只有拿解碼器掃才知道掃不掃得出來。
 * ⚠⚠ 現況那一張刻意維持灰色佔位方塊：它是照片的逐字對照，
 *   把新設計的碼畫上去就不是對照了。 */
{
  const q = join(DIR, QRFILE);
  ok(existsSync(q), `${QRFILE} 不見了 —— 跑一次產生器把它搬過來`);
  if (existsSync(q))
    ok(readFileSync(q).equals(readFileSync(QRSRC)),
      `${QRFILE} 和 drafts/channels/qr/ 那一份對不起來 —— 改要改 qr-brand.mjs 再重跑`);
  /* 案那幾張擺真的碼（現況那一張 2026-09-16 收掉了，那一態留在 card() 裡當回去的路） */
  const 卡 = [...H.matchAll(/<div class="card[^"]*">[\s\S]*?\n<\/div>/g)].map((m) => m[0]);
  ok(卡.length === 印的案.length, `抓不到卡（頁上 ${卡.length} 張，要印的是 ${印的案.length} 張）`);
  for (const c of 卡) ok(new RegExp(`<img class="qr" src="${QRFILE}"`).test(c),
    "有一張案卡沒有擺真的那顆碼");
  for (const c of 卡) ok(!/class="qr ph"/.test(c), "有一張案卡還擺著灰色佔位方塊");
  /* ⚠ 產生器裡不可以自己再畫一份（同一顆碼有兩份，改一份另一份不會動） */
  ok(!/viewBox="0 0 45 45"/.test(GEN), "產生器裡自己畫了一份 QR —— 這一頁只准搬 drafts/channels/qr/ 那一份");
  /* ⚠⚠ 印出來太小就掃不到（那一輪訂的下限 1.5 cm），所以尺寸每次出圖都要印 */
  ok(/碼本身 \$\{/.test(GEN), "面板沒有印那顆碼畫出來多大（第 28 條 ④）");
  /* ⚠⚠⚠ 底板那把尺（2026-09-16「周圍那圈淡綠色的邊」）：三格都要是**真的碼**
   *   —— 用 CSS 或 <path> 模擬一顆「很像的」看起來完全正常，只有解碼器分得出來。
   * ⚠ 定案那一格畫的就是 QRFILE 本人，落選那兩格要和 qr-brand.mjs 現算的逐位相同。
   * ⚠⚠ 靜區一格都不可以收（收顏色不影響掃描，收格數會）。 */
  /* ⚠⚠⚠ 2026-09-16 使用者「N2」定案，那把尺跟著整節從頁面上收掉 —— 這一道因此翻面：
     落選那兩格**不再產檔**（產了就是孤兒，白名單那一道會亮），而它們量出來的東西
     （三格各自的長相、三格都掃得出來）改由**面板**逐格印。
     ⚠ 三格一格都不可以從資料裡刪掉：那是「為什麼不選另外兩種」唯一寫下來的地方。 */
  ok(QRPLATE.length >= 3, `底板那把尺只剩 ${QRPLATE.length} 格`);
  ok(QRPLATE.filter((a) => a.定案).length === 1, "底板那把尺沒有剛好一格是定案的");
  ok(QRPLATE.find((a) => a.定案).檔 === QRFILE, "定案那一格擺的不是卡上那顆碼本人");
  for (const a of QRPLATE) {
    ok(!/定案/.test(a.標籤), `${a.標籤}：標籤自己不可以寫「定案」（那個記號是算出來的）`);
    ok(a.註 && a.註.length > 8, `${a.標籤} 沒有寫它長什麼樣 —— 尺收掉之後那是它唯一的紀錄`);
  }
  for (const [f2] of QRVAR())
    ok(!existsSync(join(DIR, f2)), `${f2} 還躺在資料夾裡 —— 底板那把尺收掉了，落選那兩格不再產檔`);
  ok(!/class="qrcmp"/.test(H), "底板那把尺的三格又畫回頁面上了 —— 2026-09-16 已經收掉");
  ok(/for \(const a of QRPLATE\)\n\s*console\.log/.test(GEN),
    "面板沒有逐格印底板那把尺 —— 尺收掉之後，那是三格量出來的東西唯一的去處");
  {
    const vb = +(readFileSync(QRSRC, "utf8").match(/viewBox="0 0 (\d+(?:\.\d+)?) /) ?? [])[1];
    ok(vb > 0, "讀不到那顆 QR 的 viewBox");
    const 碼mm = CARD.寬mm * CARD.QR佔卡寬 * (vb - 8) / vb;   /* 8 ＝ 靜區四格 × 2 */
    ok(碼mm >= 15, `那顆碼印出來只有 ${碼mm.toFixed(1)} mm，低於 15 mm 的下限`);
  }
}

/* ── ⑦ noindex／零 JS ─────────────────────────────────────────── */
ok(/name="robots" content="noindex/.test(H), "少了 noindex");
ok(!/<script/i.test(H), "這一頁不可以有 <script>");
/* ⚠⚠ 2026-09-16 起多一個官方標誌檔，所以這一道從「只准有 index.html」放寬成
   **一張寫死的清單** —— 放寬成「大概可以」等於把它關掉（同 check-bind-prompt 那一輪）。 */
{
  const 准 = ["index.html", S.標誌.檔, QRFILE, S.插圖.檔].sort();
  const 有 = readdirSync(DIR).sort();
  ok(有.join() === 准.join(), `這個資料夾裡只准有 ${准.join("、")}（現在有 ${有.join("、")}）`);
}

/* ── ⑦之二 人物插圖（2026-09-16）───────────────────────────────
 * 使用者：「圖片畫好了　但這樣好像很難跟這個立牌結合欸?」——
 * 量出來是**框不合不是圖不合**：原檔 16:9、上面留著 17.5% 的白，
 * 而卡片上那一塊是 98 × 43.8 mm ＝ 比例 2.237，整張放進去爆框 10.9 mm。
 * 裁到墨的框（2.091）就比那一塊瘦，變成**高度在卡**、畫出來 91.6 × 43.8。
 * ⚠⚠ 這幾道擋的都是「改回去畫面完全正常、每一道尺寸守門都會過」的：
 *   換成 cover（左右兩個人各被切掉一截）、拿掉 flex:1（圖把卡片撐開或縮成一條）、
 *   以及**直接引用原檔**（比例一換就爆框，而 <img> 會靜靜地照 contain 縮小）。 */
{
  const [w, h] = S.插圖.裁成, [ow, oh] = S.插圖.原尺寸;
  const 塊 = 餘裕mm(印的案.find((c) => c.id === "e"));
  const 卡 = [...H.matchAll(/<div class="card[^"]*">[\s\S]*?\n<\/div>/g)].map((m) => m[0]);
  ok(existsSync(join(DIR, S.插圖.檔)), `插圖 ${S.插圖.檔} 不在 —— 先跑 node drafts/channels/stand-illus-crop.mjs`);
  ok(existsSync(join(ROOT, S.插圖.原檔)), `原檔 ${S.插圖.原檔} 不在版控裡 —— 換一版就沒有回去的路了`);
  /* 真的去讀那個檔的長寬，不是信 JSON 寫的
     ⚠ 檔不在就跳過這一段 —— 上面那一道已經說過人話了，再讓 readFileSync 丟一個
       ENOENT 出來，守門失敗的樣子會比不檢查還難懂（同第 ① 道那條）。 */
  if (existsSync(join(DIR, S.插圖.檔))) {
    const b = readFileSync(join(DIR, S.插圖.檔));
    let i = 2, W = 0, Hh = 0;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { Hh = b.readUInt16BE(i + 5); W = b.readUInt16BE(i + 7); break; }
      i += 2 + b.readUInt16BE(i + 2);
    }
    ok(W === w && Hh === h, `${S.插圖.檔} 實際是 ${W}×${Hh}，資料寫的是 ${w}×${h}`);
  }
  ok(w / h <= CARD.寬mm / 塊 + 1e-9,
    `插圖比例 ${(w / h).toFixed(3)} 比那一塊（${(CARD.寬mm / 塊).toFixed(3)}）還寬 —— 那就變成寬度在卡、人物比這一塊給得起的還小`);
  /* 裁掉的是上下那兩條白，所以裁完一定比原檔**寬**（比例變大） */
  ok(w / h > ow / oh + 1e-9,
    "插圖沒有裁過（比例還是原檔的）—— 整張 16:9 放進那一塊會爆框 10.9 mm");
  ok(h * 25.4 / 塊 >= 300, `插圖印出來只有 ${(h * 25.4 / 塊).toFixed(0)} dpi`);
  ok(/\.card \.illus\{flex:1 1 auto;min-height:0;width:100%;object-fit:contain/.test(GEN),
    "插圖那一條 CSS 被動過 —— flex:1 ／ min-height:0 ／ object-fit:contain 三個少一個都會出事");
  ok(!/\.illus\{[^}]*object-fit:cover/.test(GEN), "插圖改成 cover 了 —— 左右兩個人會各被切掉一截，而畫面看起來很正常");
  for (const c of 卡)
    ok(new RegExp(`<img class="illus" src="${S.插圖.檔}" width="${w}" height="${h}"`).test(c),
      "案卡上少了插圖，或它的 width／height 和實檔對不起來");
  for (const c of 卡)
    ok(/<img class="illus"[^>]*alt="[^"]{8,}"/.test(c), "插圖少了 alt");
  /* ⚠⚠ 現況那一張 2026-09-16 起不畫在頁上了，所以掃頁面等於沒掃 —— 要守的是
     **產生器裡那個閘門**（`now ? "" : …`）：拿掉它不會讓任何一道版面守門翻臉，
     但那條回去的路一走回來，照片的逐字對照上就會多一張我們自己的插圖。 */
  ok(/\$\{now \? "" : `<img class="illus"/.test(GEN),
    "card() 少了「現況那一張不畫插圖」那個閘門 —— 它是照片的逐字對照");
}

/* ── ⑥之六 兩把間距的尺（2026-09-16 稍晚）─────────────────────────
 * 使用者三句：「這兩行中間有很大的間隔　縮小一點　要預留空間給下面畫診所人物插圖」、
 * 「line logo 和前後文字間距也有點大」、「標誌左右的留白我看不出差別　感覺 Ⓘ4 都還不夠」。
 * ⚠⚠ 抬頭到主文那把上午定案（Ⓗ4）、收成一張表，**同一天稍晚又打開了**
 *   （使用者：「這段間距再調一下　除了每段之間縮減一點　感覺離最上段還有不少空間」）——
 *   表上多了三格、重新畫成卡片，同一句話另外開了第二把尺（Ⓙ 每段之間）；
 *   **同一天兩把都定案了（Ⓗ7 ＋ Ⓙ4），卡片再次收掉、只留兩張表**。
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
  /* ⚠⚠⚠ 2026-09-16 那兩張表也從頁面上收掉了 —— 所以「兩把互相牽動」這件事改由面板講，
     而面板那兩行是逐格印的（Ⓗ 每一格的抬頭到主文、Ⓙ 每一格的行距）。
     ⚠ 那一句「兩把互相牽動」非印不可：不印的話，收段距會讓抬頭那一段變遠這件事就沒有人看得到。 */
  ok(/Ⓗ 抬頭到主文 \$\{CARD\.抬頭到主文案/.test(GEN), "面板沒有逐格印 Ⓗ 那把尺");
  ok(/Ⓙ 每段之間　 \$\{CARD\.段距案/.test(GEN), "面板沒有逐格印 Ⓙ 那把尺");
  ok(/兩把互相牽動/.test(GEN), "面板沒有講「兩把互相牽動」—— 那是這兩把尺唯一會互相說明的地方");
  /* ⚠⚠⚠ 2026-09-16 稍晚兩把都定案了（Ⓗ7 ＋ Ⓙ4），**卡片從頁面上拿掉、只留表** ——
     同 50-22 與 71-13：尺可以收，它量出來的數字不可以跟著消失
     （所以上面那兩圈迴圈一格都沒有放過，兩張表逐格比對）。 */
  ok((H.match(/class="card sc"/g) ?? []).length === 0,
    "尺上還畫著卡片 —— 兩把間距的尺已經定案收掉了，只留表");
  /* ⚠⚠ 「・定案」是算出來的（值 === 預設），不是寫在標籤裡的 ——
     兩邊都寫的話印出來會是「完全不留（定案）・定案」，而每一道版面守門都會過。 */
  /* ⚠⚠⚠ 2026-09-16 那兩張表也從頁面上收掉了，所以「・定案 是算出來的」那一半沒有地方驗了 ——
     剩下的這一半仍然要守：**標籤自己不可以寫「定案」**（哪天表又打開，就會印出兩個記號）。 */
  for (const [尺] of [[尺H], [尺J]])
    for (const k of 尺)
      ok(!k.標籤.includes("定案"), k.標籤 + " 的標籤自己寫著「定案」—— 那個記號由產生器現算，寫死的話換一格就會有兩個");

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
    /* ⚠⚠⚠ 2026-09-16 連那張表也收掉了，所以「那條線在哪」改由面板講 ——
       第 ③ 件（頁面上仍然講得出那條線）因此變成「面板仍然講得出那條線」，而不是消失。 */
    ok(/低於規範的 \$\{\(規範留白 \* 100\)/.test(GEN),
      "面板沒有在跨線時印出規範那個百分比 —— 表收掉了，地板不可以跟著消失");
    ok(/Ⓘ 左右留白 \$\{S\.標誌\.留白案/.test(GEN), "面板沒有逐格印 Ⓘ 那把尺");
  }
  ok(尺I.some((k) => k.比 >= 規範 - 1e-9), "標誌留白的尺上沒有任何一格守得住規範 —— 那就沒有基準了");
  for (const k of 尺I) {
    if (k.比 >= 規範 - 1e-9) { ok(!k.例外, k.標籤 + " 沒有跨線，卻宣告了例外"); continue; }
    ok(!!k.例外, k.標籤 + " 低於規範的 25%，卻沒有在資料裡宣告例外");
  }

  /* ⚠⚠⚠ 三張表 2026-09-16 都從頁面上收掉了，所以「每一格的數字」改由面板逐格印 ——
     這裡驗的是**產生器真的在逐格算**（那三行印的是 map 出來的，不是寫死的一串字）。
     ⚠ 上面三道 `Ⓗ`／`Ⓙ`／`Ⓘ` 的正規式指名了那三個案的陣列，所以少一格、或改成寫死的
       文字，這裡就會亮 —— 同 50-22：尺可以收，它量出來的數字不可以跟著消失。 */
  ok(尺H.every((k) => typeof 抬頭到主文mm(e, k.值) === "number" || 抬頭到主文mm(e, k.值)),
    "Ⓗ 那把尺上有一格算不出抬頭到主文");
  ok(尺I.every((k) => hdOf(e, k.比).留白em >= 0), "Ⓘ 那把尺上有一格算不出留白");

  /* ⚠⚠ 2026-09-16 定案，那條對照帶收掉了 —— 那幾列與基準線都不可以再留在頁上
     （留著的話那把尺看起來還開著，而它已經有答案了）。 */
  ok(!/class="hdcmp"|class="hdrow"/.test(H), "那條對照帶還在頁上 —— 尺已經定案（Ⓘ4），收掉");
  /* ⚠⚠⚠ 2026-09-16 整張表也收掉了（使用者：「以上……都不需要了」）——
     所以底下那兩道從「頁面上」改成「面板上」（上面已經各有一道），
     而這裡守的是**表真的不在頁上了**（接回去不會讓任何一道版面守門翻臉）。 */
  ok(!/對規範（/.test(H), "留白那張表又回到頁上了 —— 2026-09-16 已經收掉");
  /* ⚠⚠⚠ 但它量出來的每一格都要留在那張表上（同 50-22：尺可以收，數字不可以跟著消失）——
     上面那個逐格 includes 已經在守數字，這裡守的是「那一欄真的把線畫在哪裡講出來了」。 */

  /* ⚠⚠ 跨線這件事每次出圖都要印一次（第九節第 28 條 ④：壞掉檢查擋不住「靜靜地跨過去」）——
     面板與頁上那一句都要講，不然日後有人改了留白比，這裡一個數字都不會變。 */
  ok(/低於規範的/.test(GEN), "面板沒有在跨線的時候講一句 —— 那會變成一個沒有人會發現的決定");

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
  /* ⚠⚠⚠ 2026-09-16 使用者：「以上還有其他下面的都不需要了　不要放在提案頁裏」——
     這一頁收成一張卡。**收掉的每一節都要留名字**，不然日後沒有人知道這一頁曾經回答過什麼。 */
  ok(Array.isArray(D.節) && D.節.length >= 5, "這一頁收掉了好幾節，卻沒有留下「收掉了哪幾節」");
  for (const t of D.節 ?? []) ok(H.includes(t), "收掉的「" + t + "」沒有印在頁上 —— 走掉的東西要留得住");
  ok(D.說明.join("").includes("面板"),
    "沒有寫下那幾張表量出來的數字去了哪裡 —— 尺可以收，數字不可以跟著消失");
  /* ⚠ 案數是現算的，不可以寫死「四案」—— 拿掉之後那個詞會靜靜地說謊 */
  ok(/const 案數詞 = /.test(GEN) && !/>四案</.test(H),
    "頁面上還寫著「四案」（現在是 " + S.案.length + " 案）—— 那個數字要現算");
}

/* ── ⑥之八 這一頁收成一張卡（2026-09-16）─────────────────────────
 * 使用者：「保留 E 就好　F 拿掉」＋「以上還有其他下面的都不需要了　不要放在提案頁裏」。
 * ⚠⚠⚠ 收掉的那幾節**接回去畫面完全正常、每一道版面守門都會過** —— 所以要逐項擋。
 * ⚠ 擋的是「印在這一頁上」，不是「存在」：資料一筆都沒有刪，守門照舊在驗（上面每一段都是）。 */
{
  for (const [名, 記] of [["拆解那六件", /class="it"/], ["待答那幾題", /class="ask"/],
                          ["四把尺與字級那幾張表", /<table/], ["現況那一張", /class="card now"/],
                          ["底板那把尺的三格", /class="qrcmp"/], ["那條單獨的示範帶", /class="bandonly"/]])
    ok(!記.test(H), 名 + "又回到頁面上了 —— 2026-09-16 使用者指定收掉");
  /* 那幾節的樣式也要跟著收 —— 留著死 CSS，下一個人會以為那幾節還在 */
  for (const sel of [".it{", "ol.ask{", "table{", ".qrcmp{", ".bandonly{"])
    ok(!GEN.includes(sel), "產生器裡還留著 " + sel + " 那一段樣式（那一節已經收掉了）");
  /* ⚠⚠ 收乾淨之後，這一頁上唯一還在說話的就是那一張卡與它的註 —— 那一塊非在不可 */
  ok(/<div class="note">/.test(H), "那一案的註也不見了 —— 紅線的例外、字級的釘、建議不印那幾句全靠它");
}

/* ── ⑧ 版面：三個寬度 ─────────────────────────────────────────── */
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
/* ⚠ 寬度從八個收到三個（2026-09-16）：430／393／390／375／360／834／1440 量出來
   **逐格完全一樣**（卡片都是 300×446.9 —— 它有 `max-width` 上限，超過就不再變），
   只有 320 是另一種（281.6×419.5）。留下的三個 ＝ 上限那一段、上限的邊界、最窄那一台。
   ⚠⚠ 卡片寬度的算式一改（現在是 min(300px, 86vw)）就要把中間那幾格加回來。 */
for (const w of [430, 350, 320]) {
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
  ok(m.logo.length === 印的案.length && m.logo.every((x) => x === LOGO.寬),
    `${w} 寬的標誌載不到或不是那個檔（量到 ${m.logo.join("、")}）`);
  const r = m.cards[0];
  ok(Math.abs(m.pad - r.w * 0.06) < 0.5, `${w} 寬的卡片內距量到 ${m.pad}px，應該是卡片寬的 6% ＝ ${(r.w * 0.06).toFixed(2)}px`);
  ok(Math.abs(r.h / r.w - S.卡片.比例) < 0.02, `${w} 寬的卡片比例 ${(r.h / r.w).toFixed(3)}，應該是 ${S.卡片.比例}`);
  shots.push(`${w}：卡片 ${r.w}×${r.h}・溢出 0`);
}
/* ── ⑧之二 兩把尺挑定的值，量出來的要和算出來的一樣 ─────────────────
 * ⚠⚠⚠ 整疊（疊高）是算的，這一段是唯一會告訴我算錯的東西 ——
 *   而「省下來的高度有沒有真的落到下面」正是使用者要那一塊的理由。
 * ⚠⚠ 量的是**預設值**（Ⓗ7 ＋ Ⓙ4 ＋ Ⓘ4）：抬頭到主文的框距、
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
  for (const [i, c] of 印的案.entries()) {
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
console.log(`✓ 全綠（頁上 ${印的案.length} 張卡、資料裡 ${rows.length} 筆、現況掃出 ${nowRed.length} 個紅線詞、${乾淨} 案乾淨、標誌 ${LOGO.寬}×${LOGO.高}、帶子 ${BAND.顆數} 顆）`);
