/* 評價邀約的頭圖：使用者選定的原檔（16:9）→ 1024×512（2:1）
 *   node drafts/channels/review-hero-crop.mjs
 *   drafts/review-hero-src.jpg  →  preview/line-review/hero-review.jpg
 *
 * ⚠ 為什麼要裁：LINE Flex 的 hero 這一站統一用 2:1（同招呼圖卡、綁定完成、提醒卡），
 *   而出圖的模型只出 16:9。1376×768 要收成 2:1 就得拿掉 80 列。
 * ⚠⚠ **上 64 / 下 16，幾乎全部從上面拿** —— 掃過原檔才定的，兩個理由：
 *   ① **上面 190 列幾乎是空的**（只有彩旗與兩盞燈，最高的那塊牌子從第 195 列才開始），
 *      而提示詞本來就寫著「彩旗與燈被上緣切掉」——收掉那一截正好是要的。
 *   ② **下面不能多拿**：舞台前緣那條橫線在第 720~730 列（逐列密度 2645／3016 的那兩帶），
 *      裁 40 會正好切在它身上、下緣留一條半截的深線；而 688~700 列是醫事人員的鞋子。
 *      裁 16（到第 752 列）兩樣都完整。
 * ⚠⚠ 守門和 remind／bind-done 那兩支**都不一樣，不要照抄**（通則：守門要跟著這一張圖
 *   的形狀走）。這一張**第 0 列就有濃墨**（左右兩盞燈與彩旗），所以 remind 那條
 *   「深墨要離上緣 ≥12 列」在這裡會一直誤報。
 *   ⚠ 試過兩條走不通的，記下來免得再走：**膚色偵測**（暖米色的背板 R−B ＝ 20、
 *   臉是 65，本來分得開，但**彩旗是米黃三角形、和膚色同一區**，上緣那一帶整片誤報）；
 *   **「牌子是比背板白的白」**（牌子其實也是米白，R−B < 12 一列都命中不到）。
 *   改成兩條真的量得到的：**下緣用那條橫貫全寬的舞台線當地標**（第 730 列，
 *   run ＝ 1376），**上緣看成品最上面 40 列有沒有長橫線**（＝被切一半的牌子或頭；
 *   彩旗與燈的最長橫向連續只有 22）。
 * ⚠⚠⚠ **這張圖上有英文字**：左下角阿公面前那塊空白牌子被模型寫上 `STILL BLANK`
 *   （提示詞裡 `STILL COMPLETELY BLANK` 被抄上去了），原檔 x 85~229・y 495~536。
 *   裁切**不會**動到它（只裁上下）。要拿掉只能重生成 —— 見
 *   `drafts/line-review-hero-prompt.md` 第九節。
 * ⚠ 產圖一律用 headless_shell，不要用完整版 chrome（CLAUDE.md 第九節第 18 條）。
 */
import fs from "node:fs";
const SRC = "drafts/review-hero-src.jpg";
const OUT = "preview/line-review/hero-review.jpg";
const CUT_T = 64, CUT_B = 16, W_OUT = 1024, H_OUT = 512;
const STAGE_KEEP = 10;       /* 舞台那條橫線底下至少要留幾列 */
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

  /* 先在原檔上找那條橫貫全寬的舞台線（run ≥ 0.9W）—— 下緣的地標 */
  const full = document.createElement("canvas"); full.width = W; full.height = H;
  const fg = full.getContext("2d"); fg.drawImage(img, 0, 0);
  const fd = fg.getImageData(0, 0, W, H).data;
  const flum = (i) => 0.299 * fd[i] + 0.587 * fd[i + 1] + 0.114 * fd[i + 2];
  let stage = -1;
  for (let y = H - 1; y >= 0; y--) {
    let run = 0, best = 0;
    for (let x = 0; x < W; x++) { if (flum((y * W + x) * 4) < 120) { run++; if (run > best) best = run; } else run = 0; }
    if (best >= W * 0.9) { stage = y; break; }
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
    W, H, sh, stage, topRun,
    edges: { 上: row(0), 下: row(H_OUT - 1), 左: col(0), 右: col(W_OUT - 1) },
    bgL: 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2],
    b64: c.toDataURL("image/jpeg", 0.9).split(",")[1],
  };
}, { uri, CUT_T, CUT_B, W_OUT, H_OUT });
await browser.close();

/* ① 長寬比：裁完一定要正好是 W_OUT:H_OUT，不然縮放會把人拉長 */
if (r.W * H_OUT !== r.sh * W_OUT)
  throw new Error(`裁完的長寬比對不上 ${W_OUT}:${H_OUT} —— 裁 ${CUT_T}/${CUT_B} 得到 ${r.W}×${r.sh}`);
/* ② 下緣：舞台那條橫線要留在畫面裡，而且底下還要有幾列 */
if (r.stage < 0) throw new Error(`找不到舞台那條橫貫全寬的線 —— 換圖了就要重定地標`);
if (r.H - CUT_B - r.stage < STAGE_KEEP)
  throw new Error(`下面裁太多：舞台線在第 ${r.stage} 列，裁到第 ${r.H - CUT_B} 列只剩 ${r.H - CUT_B - r.stage} 列（要 ≥ ${STAGE_KEEP}）`);
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
console.log(`舞台線第 ${r.stage} 列，底下留 ${r.H - CUT_B - r.stage} 列　／　成品前 ${TOP_BAND} 列最長橫線 ${r.topRun}px（上限 ${TOP_RUN_MAX}）`);
console.log(`四邊 ` + Object.entries(r.edges).map(([n, e]) => `${n} ${e.lo.toFixed(0)}~${e.hi.toFixed(0)}`).join("　") + `　紙底 ${r.bgL.toFixed(1)}`);
