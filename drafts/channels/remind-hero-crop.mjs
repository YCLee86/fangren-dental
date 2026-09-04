/* 提醒卡的頭圖：使用者選定的原檔（16:9）→ 1024×512（2:1）
 *   node drafts/channels/remind-hero-crop.mjs
 *   drafts/remind-hero-src.jpg  →  preview/line-remind/hero-remind.jpg
 *
 * ⚠ 為什麼要裁：LINE Flex 的 hero 這一站統一用 2:1（同招呼圖卡、綁定完成），
 *   而出圖的模型只出 16:9。1376×768 要收成 2:1 就得拿掉 80 列。
 * ⚠⚠ **上 16 / 下 64，不是對稱的 40/40** —— 掃過原檔的墨才定的，兩個理由：
 *   ① **上面幾乎沒有餘裕**：深墨（人物的線稿）從第 43 列就開始（左上那位先生的頭髮），
 *      裁 40 會只剩 3 列、頭幾乎貼著上緣。裁 16 之後留 27 列（＝成品的 4.0%），
 *      和原檔的 5.7% 同一個量級。
 *   ② **下面每一列都是墨，但那是身體與手不是臉**：最低的下巴在第 660 列上下，
 *      裁 64（到第 704 列）碰不到任何一張臉，只收掉前排小孩的衣服與手掌下緣 ——
 *      而那一截在原檔裡本來就已經被切過了。**收緊反而讓臉在 268px 上大一點。**
 * ⚠ 四個候選（0/80、16/64、28/52、40/40）縮到真實的 268px 並排比過，
 *   只有 40/40 看得出頭髮被切；其餘三個在那個尺寸下幾乎分不出來，
 *   所以判準回到「餘裕」與「臉的大小」這兩個量得出來的東西。
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 * ⚠⚠ 守門和 bind-done 那支**不一樣**：那張圖四邊都是紙底，所以拿「邊緣中位亮度 vs 紙底」
 *   就抓得到烘進去的白框；這一張四邊全是墨，那道會一直誤報。改成三道：
 *   ①長寬比 ②深墨離上緣夠遠（臉沒被切） ③邊緣不是一條「又均勻又亮」的線（白框）。
 */
import fs from "node:fs";
const SRC = "drafts/remind-hero-src.jpg";
const OUT = "preview/line-remind/hero-remind.jpg";
const CUT_T = 16, CUT_B = 64, W_OUT = 1024, H_OUT = 512;
const TOP_MIN = 12;          /* 深墨至少要離上緣這麼多列（成品座標） */

const mod = await import("/opt/node22/lib/node_modules/playwright/index.js");
const { chromium } = mod.default ?? mod;
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const uri = `data:image/jpeg;base64,${fs.readFileSync(SRC).toString("base64")}`;

const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined });
const pg = await browser.newPage();
const r = await pg.evaluate(async ({ uri, CUT_T, CUT_B, W_OUT, H_OUT }) => {
  const img = new Image(); img.src = uri; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const sh = H - CUT_T - CUT_B;
  const c = document.createElement("canvas"); c.width = W_OUT; c.height = H_OUT;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, CUT_T, W, sh, 0, 0, W_OUT, H_OUT);

  const d = g.getImageData(0, 0, W_OUT, H_OUT).data;
  const lum = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  /* 深墨 ＝ 線稿的主線（<120）。淡的框線、窗框、動線都在 120 以上，不算。 */
  let deepTop = -1, deepBot = -1;
  for (let y = 0; y < H_OUT; y++) {
    let n = 0;
    for (let x = 0; x < W_OUT; x++) if (lum((y * W_OUT + x) * 4) < 120) n++;
    if (n >= 8) { if (deepTop < 0) deepTop = y; deepBot = y; }
  }
  /* 一條邊的統計：均勻程度與亮度 —— 兩個都極端才是烘進去的白框 */
  const edge = (pts) => {
    const a = pts.map(lum).sort((p, q) => p - q);
    return { lo: a[Math.floor(a.length * 0.05)], hi: a[Math.floor(a.length * 0.95)], med: a[a.length >> 1] };
  };
  const row = (y) => edge([...Array(W_OUT)].map((_, x) => (y * W_OUT + x) * 4));
  const col = (x) => edge([...Array(H_OUT)].map((_, y) => (y * W_OUT + x) * 4));
  const cnt = {};
  for (let i = 0; i < d.length; i += 4) {
    const k = (d[i] >> 3) + "," + (d[i + 1] >> 3) + "," + (d[i + 2] >> 3);
    cnt[k] = (cnt[k] || 0) + 1;
  }
  const bg = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0].split(",").map((v) => (+v << 3) + 4);
  return {
    W, H, sh, deepTop, deepBot,
    edges: { 上: row(0), 下: row(H_OUT - 1), 左: col(0), 右: col(W_OUT - 1) },
    bgL: 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2],
    b64: c.toDataURL("image/jpeg", 0.9).split(",")[1],
  };
}, { uri, CUT_T, CUT_B, W_OUT, H_OUT });
await browser.close();

/* ① 長寬比：裁完一定要正好是 W_OUT:H_OUT，不然縮放會把人拉長 */
if (r.W * H_OUT !== r.sh * W_OUT)
  throw new Error(`裁完的長寬比對不上 ${W_OUT}:${H_OUT} —— 裁 ${CUT_T}/${CUT_B} 得到 ${r.W}×${r.sh}`);
/* ② 臉有沒有被切：深墨離上緣要夠遠 */
if (r.deepTop < TOP_MIN)
  throw new Error(`上緣太緊：深墨從第 ${r.deepTop} 列就開始（要 ≥ ${TOP_MIN}），頭會貼著邊`);
/* ③ 烘進去的白框：那一條邊「又均勻又亮」才算（這張圖四邊都是墨，單看亮度會誤報） */
for (const [nm, e] of Object.entries(r.edges))
  if (e.hi - e.lo < 6 && e.med > r.bgL - 3)
    throw new Error(`${nm}緣像是烘進去的白框（幾乎均勻：${e.lo.toFixed(0)}~${e.hi.toFixed(0)}，紙底 ${r.bgL.toFixed(1)}）`);
/* ④ LINE 對 Flex 的 image 明文寫著最大 1024×1024 */
if (W_OUT > 1024 || H_OUT > 1024) throw new Error(`超過 LINE 的 1024×1024 上限`);

fs.writeFileSync(OUT, Buffer.from(r.b64, "base64"));
console.log(`${OUT}  ${W_OUT}×${H_OUT}  ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
console.log(`原檔 ${r.W}×${r.H} → 裁上 ${CUT_T} / 下 ${CUT_B} → ${r.W}×${r.sh}（＝2:1）`);
console.log(`深墨 ${r.deepTop}~${r.deepBot} / ${H_OUT}　上緣餘裕 ${r.deepTop} 列（${(r.deepTop / H_OUT * 100).toFixed(1)}%）`);
console.log(`四邊 ` + Object.entries(r.edges).map(([n, e]) => `${n} ${e.lo.toFixed(0)}~${e.hi.toFixed(0)}`).join("　") + `　紙底 ${r.bgL.toFixed(1)}`);
