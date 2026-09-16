/* 櫃檯小立牌的人物插圖：原檔 → 卡片上那一條（2026-09-16）
 *
 * v1 的原檔是 16:9、四周留著大片白（那一版的提示詞刻意要求上下各留 11%），
 * 而卡片上那一條窄得多 —— **整張 16:9 放進去一定爆框**。
 * 這一支只做一件事：**裁到墨的框**，四邊各留一點點白。
 *
 * ⚠⚠ 「那一條」＝ QR 底下到帶子 ＋ 一個帶子高（插圖沉進帶子後面），
 *   兩個數字都從 stand-card.mjs 現算 —— 這裡一個都不寫死。
 *   裁完的比例要 ≤ 卡寬 ÷ 那一條，比它寬就換成寬度在卡、人物比那一條給得起的還小。
 * ⚠⚠⚠ **下緣可以碰到邊，那從 v2 起是規格**（人的下半身要被畫面下緣切掉、藏在帶子後面）；
 *   左右與上緣碰到邊仍然是「原檔本來就被切掉了」，要回去重生成。
 *
 *   node drafts/channels/stand-illus-crop.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "/opt/node22/lib/node_modules/playwright/index.js";
import { S, CARD, 那一條mm, 印的案, 倍格, 裁法 } from "./stand-card.mjs";
const { chromium } = pkg;

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
/* ⚠ 原檔的路徑只有一個出處（stand-card.json 的 插圖.原檔）—— 換一版改那一份就好，
   這一支和守門都跟著走，不會留下一個指著舊檔的名字。 */
const SRC = path.join(R, S.插圖.原檔);
const OUT = path.join(R, "preview/line-stand/illus.jpg");
const CHECK = process.argv.includes("--check");

/* 卡片上那一塊（和 stand-card.mjs 的 CARD.寬mm ／ 餘裕mm 對得起來，
   數字在那一支現算，這裡只記它算出來的結果當守門的上限） */
/* ⚠⚠⚠ 2026-09-16 稍晚：那一條標誌帶搬到抬頭底下當分隔線，所以插圖**不再沉進任何東西後面** ——
   「那一條」＝ QR 底下到**卡片下緣**，人的下半身由卡片自己的下緣切掉。
   ⚠ 它在 stand-card.mjs 現算（`那一條mm`），這裡一個數字都不寫死 ——
   上面任何一個間距一動，這裡就要跟著變，寫死的話它會靜靜地說謊。 */
const 卡寬mm = CARD.寬mm;
const 那一塊mm = 那一條mm(印的案.find((c) => c.id === "e"));
const 上限比 = 卡寬mm / 那一塊mm;
const 邊白 = 8;                            // 裁完四邊各留幾 px 的白
const 門檻 = 12;                           // 離純白多遠才算墨

const 頭 = fs.readFileSync(SRC);
const b64 = 頭.toString("base64");

const br = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
});
const p = await br.newPage();
const r = await p.evaluate(async ({ src, 門檻, 邊白, 上限比 }) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  let L = W, Rr = -1, T = H, B = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (Math.max(255 - d[i], 255 - d[i + 1], 255 - d[i + 2]) > 門檻) {
      if (x < L) L = x; if (x > Rr) Rr = x; if (y < T) T = y; if (y > B) B = y;
    }
  }
  const x0 = Math.max(0, L - 邊白), x1 = Math.min(W - 1, Rr + 邊白);
  const cw = x1 - x0 + 1;
  /* ⚠⚠⚠ 高度一律**湊到正好是那一條的比例**，兩個方向各有各的做法，而且不可以對調：
     ・裁到墨之後**比那一條寬**（矮）→ 從**頭頂上那塊白**把高度借回來（白落在最上緣，看不出來）。
     ・裁到墨之後**比那一條瘦**（高）→ 從**下緣裁掉**一截 —— 那裡是身體，而「下半身被畫面
       下緣切掉」從 v2 起就是規格，切高一點只是切在大腿還是髖部的差別。
     ⚠⚠ **上緣永遠不准裁**（那是頭），下緣永遠不准補白（那會在卡片最下面留一條白）。 */
  const 需高 = Math.round(cw / 上限比);
  const y0墨 = Math.max(0, T - 邊白);
  const 可用 = H - y0墨;
  let y0, y1;
  if (需高 <= 可用) { y0 = y0墨; y1 = y0 + 需高 - 1; }
  else { y1 = H - 1; y0 = Math.max(0, y1 - 需高 + 1); }
  const ch = y1 - y0 + 1;
  const o = document.createElement("canvas"); o.width = cw; o.height = ch;
  const og = o.getContext("2d");
  og.fillStyle = "#ffffff"; og.fillRect(0, 0, cw, ch);
  og.drawImage(img, x0, y0, cw, ch, 0, 0, cw, ch);
  return {
    W, H, L, R: Rr, T, B, x0, y0, cw, ch, 補: y0墨 - y0, 裁: Math.max(0, B - y1),
    jpg: o.toDataURL("image/jpeg", 0.92).split(",")[1],
  };
}, { src: `data:image/jpeg;base64,${b64}`, 門檻, 邊白, 上限比 });
await br.close();

const 比 = r.cw / r.ch;
const 畫出來寬 = +(比 * 那一塊mm).toFixed(1);

/* ── 守門 ───────────────────────────────────────────────────────── */
const bad = [];
/* ⚠⚠⚠ **只有上緣不准碰到邊，那從 v2 起是規格**：下半身要被畫面下緣切掉（藏在帶子後面）、
   兩側的人要被左右緣切掉（「擠進來」就是這樣畫的）——所以三邊出血是刻意的，
   只有**上緣碰到邊**才是「原檔本來就被切掉了」（頭被切掉，裁一裁救不回來）。
   ⚠ 上緣同時是這一支唯一的調節閥（下面那一段從那裡把白補回來），碰到邊就沒有閥可以調。 */
if (r.T < 2)
  bad.push(`墨碰到原檔的上緣（y 從 ${r.T}）—— 頭被切掉了，要回去重生成；上緣也是唯一可以補白的那一側`);
if (r.L < 2 || r.R > r.W - 3)
  console.log(`（兩側出血：墨 x ${r.L}..${r.R} / ${r.W} —— v2 是刻意的，v1 不是）`);
/* ⚠⚠⚠ JSON 的 `插圖.墨框` 是這一支量出來的，記在那裡只為了讓提案頁算得出「Ⓜ 那把尺
   每一格裁不裁得動」。**這一道是它不會變成第二個真相的唯一保證** ——
   換一版圖忘了更新那一欄，這裡就會擋下來（不擋的話頁面上會印一組對不起來的數字，
   而且每一道版面守門都會過）。 */
{
  const 記 = S.插圖.墨框 ?? {};
  const 量 = { L: r.L, R: r.R, T: r.T, B: r.B };
  for (const k of ["L", "R", "T", "B"])
    if (記[k] !== 量[k]) bad.push(`stand-card.json 的 插圖.墨框.${k} 記的是 ${記[k]}，量出來是 ${量[k]} —— 那一欄要跟著這一版的圖更新`);
}
if (Math.abs(比 - 上限比) > 0.005)
  bad.push(`裁完比例 ${比.toFixed(3)} 對不上那一條的 ${上限比.toFixed(3)} —— 左右或上下會留白`);
/* ⚠ 下緣裁掉的是身體，可是裁過頭就會切到手、切到胸口。上限拿墨的高度當基準。 */
if (r.裁 > (r.B - r.T + 1) * 0.2)
  bad.push(`下緣裁掉 ${r.裁} 列 ＝ 墨的 ${(r.裁 / (r.B - r.T + 1) * 100).toFixed(0)}%，超過 20% —— 那一版畫得太高，回去讓人畫矮一點`);
if (r.ch < 900 / 2)
  bad.push(`裁完只有 ${r.ch}px 高 —— 印 ${那一塊mm} mm 至少要 ${Math.ceil(那一塊mm / 25.4 * 300)}px（300 dpi）`);
if (r.ch * 25.4 / 那一塊mm < 300)
  bad.push(`解析度只有 ${(r.ch * 25.4 / 那一塊mm).toFixed(0)} dpi，低於 300`);

console.log(`原檔 ${r.W}×${r.H}（比例 ${(r.W / r.H).toFixed(3)}）`);
console.log(`墨的框 x ${r.L}..${r.R}  y ${r.T}..${r.B}`);
console.log(`裁成 ${r.cw}×${r.ch}（比例 ${比.toFixed(3)}）` +
  (r.補 ? `　⚠ 上緣把 ${r.補}px 的白補回來了（裁到墨是 ${(r.cw / (r.ch - r.補)).toFixed(3)}，比那一條寬）` : "") +
  (r.裁 ? `　⚠ 下緣裁掉 ${r.裁}px 的身體（裁到墨是 ${(r.cw / (r.B - r.y0 + 1)).toFixed(3)}，比那一條瘦）` : ""));
console.log(`放進卡片那一條（${卡寬mm} × ${那一塊mm} mm ＝ QR 底下到卡片下緣）：畫出來 ${畫出來寬} × ${那一塊mm} mm，左右各餘 ${((卡寬mm - 畫出來寬) / 2).toFixed(1)} mm`);
console.log(`印出來 ${(r.ch * 25.4 / 那一塊mm).toFixed(0)} dpi`);
/* ── Ⓜ 分隔線那把尺：每一格的插圖會裁成什麼樣（2026-09-16）───────────
 * 分隔線長高多少，「那一條」就矮多少（卡片是固定長寬比）—— 所以換一格，這張圖就要重裁。
 * ⚠⚠⚠ **那把尺的盡頭不在版面上、在這張圖上**：下緣裁超過墨的 20% 這一支就會擋，
 *   而擋不擋得住只有這裡算得出來（墨的框是這一支量的）。所以逐格印在這裡，不是在 stand-card.mjs。 */
{
  console.log("Ⓜ 分隔線那把尺　每一格的插圖會裁成：");
  for (const k of 倍格()) {
    const c = k.裁;   /* ⚠ 裁法只有一份（stand-card.mjs），這裡不要再算一次 */
    console.log(`   ${k.標籤}　${String(k.顆).padStart(2)} 顆　那一條 ${k.那一條} mm（比例 ${(卡寬mm / k.那一條).toFixed(3)}）` +
      `→ 裁成 ${c.cw}×${c.ch}・下緣裁 ${c.裁} 列 ＝ 墨的 ${(c.裁比 * 100).toFixed(0)}%` +
      `${c.補 ? `・上緣補白 ${c.補}` : ""}・${c.dpi.toFixed(0)} dpi　${c.過 ? "✓" : "✗ 這一支會擋下來"}` +
      `${k.現在 ? "　← 現在" : ""}`);
  }
}
console.log(`（對照：整張 16:9 直接放，照寬度縮會高 ${(卡寬mm / (r.W / r.H)).toFixed(1)} mm ＝ 爆框 ${(卡寬mm / (r.W / r.H) - 那一塊mm).toFixed(1)} mm）`);

if (bad.length) { bad.forEach((b) => console.error("✗ " + b)); process.exit(1); }

const buf = Buffer.from(r.jpg, "base64");
if (CHECK) {
  const 舊 = fs.existsSync(OUT) ? fs.readFileSync(OUT) : null;
  console.log(舊 && 舊.equals(buf) ? "✓ --check：和現有的檔一樣" : "✗ --check：和現有的檔不一樣（或還沒產過）");
  process.exit(舊 && 舊.equals(buf) ? 0 : 1);
}
fs.writeFileSync(OUT, buf);
console.log(`✓ 寫出 ${path.relative(R, OUT)}（${(buf.length / 1024).toFixed(0)} KB）`);
