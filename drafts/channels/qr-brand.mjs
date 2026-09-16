/* ==========================================================================
   診所的兩顆 QR code（LINE 官方帳號 ＋ 診所網站）
   ⚠ 成品不在站上，是要給廠商／印刷用的向量檔。跑法：

       node drafts/channels/qr-brand.mjs          # 寫進 drafts/channels/qr/
       node drafts/channels/qr-brand.mjs --check  # 只比對、不寫檔
       node drafts/channels/check-qr.mjs          # 守門（含真的掃一次）

   起點是使用者拿特斯拉的 QR 來問：「要怎麼做才能像那樣，有自己的 logo
   和比較特殊的點狀」。走了十八輪，下面每一個數字都是他在對照圖上挑的。

   ── 定案（2026-09-15）────────────────────────────────────────────────
   ・37×37（版本 5）、ECC H、靜區 4 格
   ・花紋 ＝ 標誌上那顆牙洞的形狀，0.90 格；深 #3f654a、淺 #ffffff
   ・底板 #c9d4cc（品牌綠 28%）—— 深點、淺點、底色三層，同特斯拉那一張
   ・三顆定位點圓角 0.25 格
   ・LINE 那顆：診所標誌（嘴，牙洞填白）＋ LINE 的對話框（白底、字與框線套色）
   ・網站那顆：診所標誌 ＋ 右下角一個滑鼠游標（同樣白底、套色框線、同一個粗細）
   ・兩顆碼上「嘴」的實際大小一樣（0.4697 × 邊長）—— 它們會並排擺

   ── ⚠⚠⚠ 六個不知道就會踩的 ─────────────────────────────────────────
   ① **定位點的圓角是有上限的**：0／0.25 格掃 10/10，0.5 開始掉，1.0 以上
      幾乎掃不到 —— 那三顆是掃描器找碼的依據，1:1:3:1:1 那個比例一圓就跑掉。
      **不要為了好看再調大。**
   ② **標誌的遮罩要用「外輪廓填實」的版本**：牙洞是 fill-rule evenodd 挖的，
      直接拿完整路徑當遮罩，牙洞在遮罩上也是洞，花紋會從牙洞裡透出來。
   ③ **mark.svg 外面包著 `translate(…) scale(1 -1)`** —— 只抄 `<path d>`
      會上下顛倒又跑位，**而且不報錯**。整段 `<g>` 一起帶。
   ④ **同一份文件放兩顆碼時 id 會撞名**：第二顆會去吃第一顆的 defs／mask，
      畫面看起來完全正常，只有放大逐格比才看得出來。每顆碼自己一個流水號。
   ⑤ **合成圖形（嘴＋對話框）的 viewBox 原點是負的** —— 擺位時不把它扣掉，
      整組會被推開，症狀是使用者說「重心往上偏」，而每一道守門都會過。
   ⑥ **`liteCells` 是真的把一個位元畫反了**，不是換顏色而已。改幾格都要
      重新掃過（見下面那一段）。

   ── ⚠⚠ 驗收 ───────────────────────────────────────────────────────
   QR 最惡劣的失敗是「看起來完全正常但掃不出來」，**不要用眼睛驗收**。
   check-qr.mjs 會真的解一次；容器裡沒有解碼器的話它會大聲說沒驗到，
   不會安靜放行。臨時裝（只給驗證用、不是專案依賴）：
       pip install zxing-cpp opencv-python-headless
   2026-09-15 的驗收：兩顆碼 × 六種大小 × 五種劣化（模糊、雜訊、旋轉）
   ＝ **各 30/30**；整張碼「讀起來和資料不一樣」的格子 83／1222 ＝ 6.8%，
   而 ECC H 的上限約 30%。
   ========================================================================== */
import { qrMatrix } from '../../tools/qr.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const OUT  = join(HERE, 'qr');

/* ---- 網址 -------------------------------------------------------------- */
/* ⚠ LINE 那條是廠商後台產的短網址。**它會不會變還沒問到** ——
   會變的話診所就不能自己印，每次換都要重印。那一題在待答清單上。 */
export const URL_LINE = 'https://q.1talk.co/HQPRd';
export const URL_WEB  = 'https://fangren.net';

/* ---- 顏色（全部來自 PALETTE.md，一個都沒有新增）------------------------ */
export const INK   = '#3f654a';   // 一般牙科的套色 ＝ 標誌的品牌真值
export const LITE  = '#ffffff';
export const PLATE = '#c9d4cc';   // 品牌綠 28% 混進白
/* 底板鋪多大（2026-09-16 使用者：「QRcode 周圍有淡綠色的邊可以拿掉嗎」）——
   那圈邊 ＝ **靜區**被連同碼面一起上了色。定案 'code'：底板只鋪在碼面上、靜區留白。
   ⚠ 靜區一格都沒有收（收顏色不影響掃描，收格數會）。 */
export const PLATE_MODE = 'code';
/* ⚠ 28% 不是憑感覺挑的：特斯拉那一張量出來「底板 ÷ 淺色點」是 1.52，
   這一支在 8~36% 之間掃過都讀得到，1.52 落在 28%。 */

/* ---- 幾何（每一格都是使用者在對照圖上挑的）----------------------------- */
const CFG = { minVer: 5, ecl: 'H', Q: 4, dot: 0.90, finderR: 0.25, halo: 0 };
export const BUBBLE = { size: 0.45, x: 0.87, y: -0.47, stroke: 0.045 };  // 對話框：多大、擺哪、框線多粗
const COMPOSITE_W = 0.62;   // 合成圖形佔碼面幾成（不含框線那一版的基準）
const COMPOSITE_DX = 0.06;  // 整組往右 2.22 格（0.06 × 37）
/* ⚠⚠ 尾巴的尖端正好頂在這一格深色的牙上，兩塊連成一片、尾巴讀起來不像尾巴。
   改畫成淺色就分開了。**這一格是量出來的不是挑的** —— 泡泡那圈框線是一個
   連通塊，把每一格的中心點丟進去看落在不在同一塊裡，落在的就是黏著的那幾格；
   其中最下面那一格（＝尾巴尖）就是它。動到大小、位置或框線粗細都要重新量。 */
const TAIL_CELL = [[17, 27]];

/* 網站那顆的滑鼠游標：h ＝ 高度佔標誌寬幾成，tipx／tipy ＝ 尖端擺在標誌座標的哪裡
   （同樣以標誌寬為單位）。
   ⚠ **不要旋轉** —— 游標永遠是這個角度，轉了就不像游標。
   ⚠⚠ 尖端 x 0.80 是量出來的不是挑的：牙洞橫跨標誌寬的 0.675~0.755，
      所以留了 0.78 格的空隙。**牙洞是這顆標誌唯一的識別特徵**，碰到就不是它了。 */
export const CURSOR = { h: 0.40, tipx: 0.80, tipy: 0.40 };
/* ⚠⚠ 為什麼要往下：LINE 那顆的對話框往**上**長、這顆的游標往**下**長，
   所以「合成圖形置中」的時候，兩顆碼上的嘴差了 15.4 個百分點（LINE 59.3%、
   這顆 43.9%）。完全對齊要往下 0.1877，使用者挑的是 0.09；
   往右 0.02 也是他挑的（嘴心因此落在 50.3% / 51.3%）。 */
export const WEB_DX = 0.02;   // 往右 0.74 格
export const WEB_DY = 0.09;   // 往下 3.33 格

/* ---- 標誌 -------------------------------------------------------------- */
const markSrc = readFileSync(join(ROOT, 'brand', 'shapes', 'mark.svg'), 'utf8');
export const VB = markSrc.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const GROUP = markSrc.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
const D_ALL = markSrc.match(/ d="([^"]+)"/)[1];
const SUBS  = D_ALL.split(/(?=M )/).map(x => x.trim()).filter(Boolean);
const GTAG  = GROUP.match(/<g[^>]*>/)[0];

/* 牙洞填白：外形照舊（evenodd 挖穿），再把洞那一條子路徑單獨填白疊上去。
   ⚠ 一定要放進原本那個 <g> 裡面（見檔頭第 ③ 條）。 */
export const MARK_WHITE_HOLE =
  `${GTAG}<path d="${D_ALL}" fill="currentColor" fill-rule="evenodd"/>`
  + `<path d="${SUBS[1]}" fill="${LITE}"/></g>`;
/* 遮罩用的「填實」版本（見檔頭第 ② 條） */
export const MARK_SOLID = GROUP
  .replace(/ d="([^"]+)"/, ` d="${SUBS[0]}"`)
  .replace(/\s*fill-rule="[^"]*"/g, '');

/* 花紋 ＝ 那顆牙洞。⚠ 要把原檔那個 scale(1 -1) 一起烘進去 */
const hn = SUBS[1].match(/-?\d+\.?\d*/g).map(Number);
const hx = hn.filter((_, i) => i % 2 === 0), hy = hn.filter((_, i) => i % 2 === 1);
const TOOTH = {
  d: SUBS[1],
  cx: (Math.min(...hx) + Math.max(...hx)) / 2, cy: (Math.min(...hy) + Math.max(...hy)) / 2,
  w: Math.max(...hx) - Math.min(...hx), h: Math.max(...hy) - Math.min(...hy),
};
/* 牙洞在標誌上橫跨哪一段（以標誌寬為單位）。⚠ 要把 <g> 那個 translate 算進去 ——
   不算的話得到的是原檔座標，看起來還很合理（第 ③ 條的近親）。
   游標不可以碰到這一段，守門在盯。 */
const GTX = +(GTAG.match(/translate\(\s*(-?[\d.]+)/)?.[1] ?? 0);
export const HOLE_X = [(Math.min(...hx) + GTX) / VB[2], (Math.max(...hx) + GTX) / VB[2]];

/* ---- 嘴 ＋ 對話框 ------------------------------------------------------ */
const B = JSON.parse(readFileSync(join(HERE, 'line-bubble.json'), 'utf8'));
function speakLine() {
  const MW = VB[2], MH = VB[3];
  const bw = MW * BUBBLE.size, bh = bw * B.h / B.w;
  const bx = MW * BUBBLE.x, by = MW * BUBBLE.y;
  const s = bw / B.w, sw = MH * BUBBLE.stroke;
  const T = `translate(${bx.toFixed(3)} ${by.toFixed(3)}) scale(${s.toFixed(5)})`;
  const line = ` stroke="${INK}" stroke-width="${(sw / s).toFixed(2)}" stroke-linejoin="round"`;
  return {
    vb: [Math.min(0, bx - sw / 2), Math.min(0, by - sw / 2),
         Math.max(MW, bx + bw + sw / 2) - Math.min(0, bx - sw / 2),
         Math.max(MH, by + bh + sw / 2) - Math.min(0, by - sw / 2)],
    inner: MARK_WHITE_HOLE
      + `<g transform="${T}"><path d="${B.bubble}" fill="${LITE}"${line}/>`
      + `<path d="${B.letters}" fill="${INK}"/></g>`,
    solid: MARK_SOLID
      + `<g transform="${T}"><path d="${B.bubble}" fill="currentColor"`
      + ` stroke="currentColor" stroke-width="${(sw / s).toFixed(2)}" stroke-linejoin="round"/></g>`,
    /* 沒有框線時的框寬 —— 兩顆碼要對齊「嘴」的大小，基準取它 */
    vb0w: Math.max(MW, bx + bw) - Math.min(0, bx),
  };
}

/* ---- 嘴 ＋ 滑鼠游標 ---------------------------------------------------- */
/* 標準的箭頭游標（尖端在自己的左上角 0,0）。寬 14.2 / 高 22。 */
export const ARROW = 'M0 0L0 19.2L4.9 14.7L8.2 22L11.3 20.6L8 13.5L14.2 13.5Z';
const AW = 14.2, AH = 22;
function pointer() {
  const MW = VB[2], MH = VB[3];
  const sw = MH * BUBBLE.stroke;            // ＝ 對話框那條框線，兩顆碼才像同一組
  const ah = MW * CURSOR.h, aw = ah * AW / AH, s = ah / AH;
  const tx = MW * CURSOR.tipx, ty = MW * CURSOR.tipy;
  const T = `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)})`;
  const line = ` stroke-width="${(sw / s).toFixed(2)}" stroke-linejoin="round"`;
  const x0 = Math.min(0, tx - sw / 2), y0 = Math.min(0, ty - sw / 2);
  return {
    vb: [x0, y0, Math.max(MW, tx + aw + sw / 2) - x0, Math.max(MH, ty + ah + sw / 2) - y0],
    inner: MARK_WHITE_HOLE
      + `<g transform="${T}"><path d="${ARROW}" fill="${LITE}" stroke="${INK}"${line}/></g>`,
    solid: MARK_SOLID
      + `<g transform="${T}"><path d="${ARROW}" fill="currentColor" stroke="currentColor"${line}/></g>`,
  };
}

/* ---- 畫一顆碼 ---------------------------------------------------------- */
let uid = 0;
/* plate ＝ 底板畫多大（2026-09-16 使用者：「QRcode 周圍有淡綠色的邊可以拿掉嗎」）：
     'full' 連靜區一起上色（2026-09-15 定案的樣子）／'code' 只有碼面、靜區留白／
     'none' 整張不上色。
   ⚠⚠ 底板不是裝飾：**淺色的那些牙是白的**，底板一拿掉它們就看不見了，
     花紋只剩深色那一半（仍然掃得出來，但那是另一種長相，不是「只是少一圈邊」）。 */
export function qr({ url, logo, logoSolid, logoVB, logoW, logoDX = 0, logoDY = 0, liteCells = [], plate = 'full' }) {
  const { n, g } = qrMatrix(url, CFG.ecl, -1, CFG.minVer);
  const Q = CFG.Q, N = n + Q * 2, U = `q${++uid}`;   // ⚠ 每顆碼自己的 id（檔頭第 ④ 條）
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const k = CFG.dot / Math.max(TOOTH.w, TOOTH.h);
  const defs = `<defs><g id="t${U}" transform="scale(${k.toFixed(6)}) scale(1 -1) `
    + `translate(${(-TOOTH.cx).toFixed(4)} ${(-TOOTH.cy).toFixed(4)})"><path d="${TOOTH.d}"/></g></defs>`;
  const cell = (r, c, fill) => `<use href="#t${U}" x="${(c + Q + .5).toFixed(2)}" `
    + `y="${(r + Q + .5).toFixed(2)}"${fill ? ` fill="${fill}"` : ''}/>`;

  const LC = new Set(liteCells.map(([r, c]) => `${r},${c}`));
  let light = '', dark = '', flipped = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (isFinder(r, c)) continue;
    if (!g[r][c]) { light += cell(r, c, LITE); continue; }
    if (LC.has(`${r},${c}`)) { light += cell(r, c, LITE); flipped++; continue; }
    dark += cell(r, c, null);
  }
  /* ⚠ liteCells 指到淺格等於什麼都沒做，而且完全不報錯 —— 擋一次 */
  if (flipped !== LC.size) throw new Error(`liteCells 有指到本來就是淺色的格子（${flipped}/${LC.size}）`);

  const fin = (R, C) => { const x = C + Q, y = R + Q, r = CFG.finderR; return ''
    + `<rect x="${x}" y="${y}" width="7" height="7" rx="${r}"/>`
    + `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="${Math.max(0, r - .6)}" fill="${LITE}"/>`
    + `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${Math.max(0, r - 1.2)}" fill="${INK}"/>`; };
  dark += fin(0, 0) + fin(0, n - 7) + fin(n - 7, 0);

  /* ⚠⚠ logoVB 的原點不一定是 (0,0)（檔頭第 ⑤ 條） */
  const vx = logoVB[0] ?? 0, vy = logoVB[1] ?? 0;
  const w = n * logoW, h = w / (logoVB[2] / logoVB[3]), s = w / logoVB[2];
  /* 位移以「幾格」為單位（logoDX 0.06 ＝ 往右 2.22 格） */
  const lx = Q + (n - w) / 2 - s * vx + n * logoDX;
  const ly = Q + (n - h) / 2 - s * vy + n * logoDY;
  const T = `translate(${lx.toFixed(3)} ${ly.toFixed(3)}) scale(${s.toFixed(5)})`;
  /* 只把標誌真正蓋到的地方挖掉（貼合輪廓，不是一個方框）——
     用 stroke 把輪廓往外撐就等於沿著形狀擴張 */
  const mask = `<mask id="m${U}" maskUnits="userSpaceOnUse" x="0" y="0" width="${N}" height="${N}">`
    + `<rect width="${N}" height="${N}" fill="#fff"/>`
    + `<g transform="${T}" fill="#000" color="#000" stroke="#000" `
    + `stroke-width="${(CFG.halo * 2 / s).toFixed(4)}" stroke-linejoin="round">${logoSolid}</g></mask>`;

  return { n, N, mouth: +(logoW * VB[2] / logoVB[2]).toFixed(4),
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N} ${N}">${defs}${mask}`
      + (plate === 'none' ? ''
         : plate === 'code' ? `<rect x="${Q}" y="${Q}" width="${n}" height="${n}" fill="${PLATE}"/>`
         : `<rect width="${N}" height="${N}" fill="${PLATE}"/>`)
      + `<g mask="url(#m${U})"><g>${light}</g><g fill="${INK}">${dark}</g></g>`
      + `<g transform="${T}" fill="${INK}" color="${INK}">${logo}</g></svg>` };
}

/* ---- 兩顆成品 ---------------------------------------------------------- */
export function build({ plate = PLATE_MODE } = {}) {
  if (!['full', 'code', 'none'].includes(plate)) throw new Error('plate 只有 full／code／none：' + plate);
  const S = speakLine();
  /* ⚠⚠ 框線會把合成圖形的 viewBox 撐大，所以「佔碼面幾成」要跟著放大才能
     讓嘴維持同一個實際大小 —— 方向很容易寫反（寫反的話嘴會小 1.7%，
     而每一道守門都會過，只有把兩顆碼並排量才看得出來）。 */
  const wLine = +(COMPOSITE_W * S.vb[2] / S.vb0w).toFixed(4);
  const line = qr({ url: URL_LINE, logo: S.inner, logoSolid: S.solid, logoVB: S.vb,
                    logoW: wLine, logoDX: COMPOSITE_DX, liteCells: TAIL_CELL, plate });
  /* 游標那一版同理（它自己的 viewBox 也被框線撐大過），所以式子和上面一模一樣 */
  const P = pointer();
  const web  = qr({ url: URL_WEB, logo: P.inner, logoSolid: P.solid, logoVB: P.vb,
                    logoW: +(COMPOSITE_W * P.vb[2] / S.vb0w).toFixed(4),
                    logoDX: WEB_DX, logoDY: WEB_DY, plate });
  if (line.mouth !== web.mouth) throw new Error(`兩顆碼上的嘴不一樣大：${line.mouth} vs ${web.mouth}`);
  return { line, web };
}

/* 給印刷／廠商的是 SVG（向量，印多大、投多大都不會糊）。
   ⚠⚠ PNG 存 4000px 是因為使用者要**放到大螢幕上**（2026-09-15）——
   4K 螢幕整屏高 2160，4000 這一張就算滿版擺仍然是縮小不是放大。
   一格 96px，花紋的邊緣一個像素都沒有損失。
   ⚠ 真的要投影還是優先給 SVG，PNG 只是「貼進投影片就能用」的那一份。 */
export const PNG_PX = 4000;
async function png(svg, out) {
  const { default: pkg } = await import('/opt/node22/lib/node_modules/playwright/index.js');
  const b = await pkg.chromium.launch({
    executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
  const p = await b.newPage({ viewport: { width: PNG_PX, height: PNG_PX } });
  await p.setContent('<body style="margin:0"><img width="' + PNG_PX + '" height="' + PNG_PX
    + '" src="data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64') + '">');
  await p.screenshot({ path: out });
  await b.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { line, web } = build();
  const files = { 'fangren-line-qr.svg': line.svg, 'fangren-web-qr.svg': web.svg };
  const check = process.argv.includes('--check');
  let bad = 0;
  mkdirSync(OUT, { recursive: true });
  for (const [f, s] of Object.entries(files)) {
    const p = join(OUT, f);
    if (check) {
      let old = ''; try { old = readFileSync(p, 'utf8'); } catch {}
      if (old !== s) { console.log('✗ 和檔案裡的不一樣：' + f); bad++; }
    } else writeFileSync(p, s);
  }
  console.log(`${line.n}×${line.n} 格・嘴 ${line.mouth} × 邊長`
    + `・LINE 往右 ${(COMPOSITE_DX * line.n).toFixed(2)} 格`
    + `・網站往右 ${(WEB_DX * line.n).toFixed(2)} 格、往下 ${(WEB_DY * line.n).toFixed(2)} 格`
    + `・PNG ${PNG_PX}px`);
  if (check) { console.log(bad ? `✗ ${bad} 個檔案對不上` : '✓ 兩個檔案都對得上'); process.exit(bad ? 1 : 0); }
  for (const [f, s] of Object.entries(files))
    await png(s, join(OUT, f.replace(/\.svg$/, '.png')));
  console.log('✓ 寫好了 → drafts/channels/qr/（SVG 給印刷、PNG 給手機看）');
  console.log('⚠ 接著跑 node drafts/channels/check-qr.mjs（會真的掃一次）');
}
