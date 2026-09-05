/* 評價邀約的頭圖：使用者選定的原檔（16:9）→ 1024×512（2:1）
 *   node drafts/channels/review-hero-crop.mjs
 *   drafts/review-hero-src.jpg  →  preview/line-review/hero-review.jpg
 *
 * ⚠ 為什麼要裁：LINE Flex 的 hero 這一站統一用 2:1（同招呼圖卡、綁定完成、提醒卡），
 *   而出圖的模型只出 16:9。1376×768 要收成 2:1 就得拿掉 80 列。
 * ⚠⚠ **上 60 / 下 20（2026-09-05 換成第五版的圖之後重定的）** —— 掃過原檔才定的：
 *   ① **下面只有 20 列是真的空的**（第 746 列還有一根桌腳的墨，747 起才乾淨），
 *      再往上裁就會**切到鞋子**（第 736 列還有八處鞋與桌腳的墨）。所以下面只能拿 20。
 *   ② **剩下的 60 列從上面拿**：那 60 列裡只有兩盞燈與彩旗最上面那一截
 *      （逐列的墨約 60 點，而下面同樣寬度是 250 點 —— **上面空得多**）。
 *      提示詞本來就寫著「彩旗與燈被上緣切掉」，收掉那一截正好是要的；
 *      最高那塊牌子的上緣在第 ~125 列，裁完落在成品的 9.4%（目標 ≤12%）。
 * ⚠⚠⚠ **地標換過一次：第四版那張有一條橫貫全寬的舞台線，第五版這張沒有。**
 *   照抄舊守門的結果是「找不到舞台那條橫貫全寬的線」直接 throw。
 *   **通則（第二次記）：守門要跟著這一張圖的形狀走** —— 換圖就要重掃一次、重定地標，
 *   而地標要挑「不管畫成什麼樣都一定存在」的東西。這一版下緣改成
 *   **「原檔最後一列有墨的位置」**（不管那是鞋子、桌腳還是舞台線都成立）。
 * ⚠⚠ 守門和 remind／bind-done 那兩支**都不一樣，不要照抄**。這一張**第 0 列就有濃墨**
 *   （左右兩盞燈與彩旗），所以 remind 那條「深墨要離上緣 ≥12 列」在這裡會一直誤報。
 *   ⚠ 試過兩條走不通的，記下來免得再走：**膚色偵測**（暖米色的背板 R−B ＝ 20、
 *   臉是 65，本來分得開，但**彩旗是米黃三角形、和膚色同一區**，上緣那一帶整片誤報）；
 *   **「牌子是比背板白的白」**（牌子其實也是米白，R−B < 12 一列都命中不到）。
 *   上緣改成看**成品最上面 40 列有沒有長橫線**（＝被切一半的牌子、頭或白板的框；
 *   彩旗與燈的最長橫向連續只有幾十）。
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
const SRC = "drafts/review-hero-src.jpg";
const OUT = "preview/line-review/hero-review.jpg";
const CUT_T = 60, CUT_B = 20, W_OUT = 1024, H_OUT = 512;
const INK_TH = 150;          /* 「這一列有墨」的門檻 */
const TOP_BAND = 40;         /* 成品最上面這幾列不可以有長橫線 */
const TOP_RUN_MAX = 200;     /* 長橫線的門檻（彩旗與燈實測只有 22） */

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

  /* 先在原檔上找「最後一列有墨的位置」—— 下緣的地標（不挑那是鞋子還是舞台線） */
  const full = document.createElement("canvas"); full.width = W; full.height = H;
  const fg = full.getContext("2d"); fg.drawImage(img, 0, 0);
  const fd = fg.getImageData(0, 0, W, H).data;
  const flum = (i) => 0.299 * fd[i] + 0.587 * fd[i + 1] + 0.114 * fd[i + 2];
  let lastInk = -1;
  for (let y = H - 1; y >= 0; y--) {
    let n = 0;
    for (let x = 0; x < W; x++) if (flum((y * W + x) * 4) < 150) n++;
    if (n >= 4) { lastInk = y; break; }
  }

  /* 再裁出成品 */
  const c = document.createElement("canvas"); c.width = W_OUT; c.height = H_OUT;
  const g = c.getContext("2d");
  g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, CUT_T, W, sh, 0, 0, W_OUT, H_OUT);
  const d = g.getImageData(0, 0, W_OUT, H_OUT).data;
  const lum = (i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

  /* 一條邊的統計：又均勻又亮才算烘進去的白框 */
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
  /* 成品最上面幾列的最長橫向連續 —— 有長橫線就是切到牌子或頭了 */
  let topRun = 0;
  for (let y = 0; y < 40; y++) {
    let run = 0;
    for (let x = 0; x < W_OUT; x++) { if (lum((y * W_OUT + x) * 4) < 120) { run++; if (run > topRun) topRun = run; } else run = 0; }
  }

  return {
    W, H, sh, lastInk, topRun,
    edges: { 上: row(0), 下: row(H_OUT - 1), 左: col(0), 右: col(W_OUT - 1) },
    bgL: 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2],
    b64: c.toDataURL("image/jpeg", 0.9).split(",")[1],
  };
}, { uri, CUT_T, CUT_B, W_OUT, H_OUT });
await browser.close();

/* ① 長寬比：裁完一定要正好是 W_OUT:H_OUT，不然縮放會把人拉長 */
if (r.W * H_OUT !== r.sh * W_OUT)
  throw new Error(`裁完的長寬比對不上 ${W_OUT}:${H_OUT} —— 裁 ${CUT_T}/${CUT_B} 得到 ${r.W}×${r.sh}`);
/* ② 下緣：一點墨都不可以裁到（最後一列有墨的位置要留在畫面裡） */
if (r.lastInk < 0) throw new Error(`整張圖掃不到墨 —— 原檔壞了`);
if (r.lastInk >= r.H - CUT_B)
  throw new Error(`下面裁太多：最後一列有墨的是第 ${r.lastInk} 列，卻裁到第 ${r.H - CUT_B} 列 —— 切到鞋子或桌腳了`);
/* ③ 上緣：成品最上面那幾列不可以有長橫線（＝被切一半的牌子或頭） */
if (r.topRun > TOP_RUN_MAX)
  throw new Error(`上面裁太多：成品前 ${TOP_BAND} 列有 ${r.topRun}px 的長橫線（上限 ${TOP_RUN_MAX}）—— 切到牌子或頭了`);
/* ④ 烘進去的白框：那一條邊「又均勻又亮」才算 */
for (const [nm, e] of Object.entries(r.edges))
  if (e.hi - e.lo < 6 && e.med > r.bgL - 3)
    throw new Error(`${nm}緣像是烘進去的白框（幾乎均勻：${e.lo.toFixed(0)}~${e.hi.toFixed(0)}，紙底 ${r.bgL.toFixed(1)}）`);
/* ⑤ LINE 對 Flex 的 image 明文寫著最大 1024×1024 */
if (W_OUT > 1024 || H_OUT > 1024) throw new Error(`超過 LINE 的 1024×1024 上限`);

fs.writeFileSync(OUT, Buffer.from(r.b64, "base64"));
console.log(`${OUT}  ${W_OUT}×${H_OUT}  ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
console.log(`原檔 ${r.W}×${r.H} → 裁上 ${CUT_T} / 下 ${CUT_B} → ${r.W}×${r.sh}（＝2:1）`);
console.log(`最後一列墨在第 ${r.lastInk} 列，裁到第 ${r.H - CUT_B} 列（餘 ${r.H - CUT_B - 1 - r.lastInk} 列空白）　／　成品前 ${TOP_BAND} 列最長橫線 ${r.topRun}px（上限 ${TOP_RUN_MAX}）`);
console.log(`四邊 ` + Object.entries(r.edges).map(([n, e]) => `${n} ${e.lo.toFixed(0)}~${e.hi.toFixed(0)}`).join("　") + `　紙底 ${r.bgL.toFixed(1)}`);
