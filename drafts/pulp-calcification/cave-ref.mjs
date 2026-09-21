// 〈根管鈣化〉HERO 的參考圖（第二版的梗：洞穴探險）
//
// 用法：node drafts/pulp-calcification/cave-ref.mjs
// 產出：drafts/pulp-calcification/cave-ref.png（1600×900）
//
// ⚠⚠ 這張圖只提供**三件事**，不提供畫法（ILLUSTRATION.md 第十二節：參考圖要分組，
//   每一組只准提供一件事 —— 這裡是同一族的三件：角度、比例、版面）：
//   ① **牙齒的角度**：從斜上方看的下顎大臼齒，看得到咬合面也看得到一點側面。
//   ② ⚠⚠⚠ **那個凹洞有多小**。使用者原話是「很細很小的凹洞洞穴」——
//      模型的本能會把它畫大（因為圈裡要塞得下人），所以這張圖把它釘死：
//      **洞的寬度約等於牙冠寬度的 1/28**，在 1600 寬的畫面上只有二十幾像素。
//      「小」是這個梗的全部力量 —— 洞一大，「找不到入口」這件事就不成立了。
//   ③ **版面**：放大鏡的圓框在左、牙齒在右，兩條細線把圈連到那個洞。
//
// ⚠ 圈裡**故意不畫人**。人的規格寫在提示詞裡（第十七節：一行一人、兩隻手都交代掉），
//   參考圖畫了人，模型會連姿勢一起抄，反而綁死。圈裡只畫洞口被放大之後的樣子。
//
// ⚠ 一個字都沒有（守門在最後擋）—— 第十一節踩過三種「字漏進圖裡」的形式。
// ⚠ 這是**結構圖不是插畫**：平塗、均勻線、白底。提示詞要明講「抄形狀與比例，不要抄畫法」。

import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const W = 1600, H = 900;

const INK = '#4a3c33', ENAM = '#ffffff', SIDE = '#f3ece0', GROOVE = '#b9a98e';
const DARK = '#6b5b49', GLOW = '#f6e2c4', RIM = '#e6d9c2', LINE = '#c9c2b6';
const DASH = '#8c7b62';   // 虛線（髓腔、根管、根管上那四顆小點）

/* ── 右邊：一顆下顎大臼齒 ────────────────────────────────────
   ⚠⚠⚠ 第五版重畫（使用者：「牙齒的形狀變得很奇怪」）。
   前四版把牙體畫成直筒、底下一個怪缺口 —— 那不是牙齒，是個桶子，模型照抄就抄出桶子。
   這一版：**咬合面是被壓扁的橢圓**（從斜上方看本來就會縮短，第一版讀得出來的就是這個）、
   **牙冠兩側鼓出來、到牙頸收腰**、**兩支牙根分開再收成圓鈍的根尖**。 */
const TX = 1118, TOP = 214, R = 168, RY = 50;   // 中線／咬合面橢圓的中心與半徑
const CEJ = 486, APEX = 812;                    // 牙頸線／根尖

const tooth = `
  M ${TX-R} ${TOP}
  C ${TX-R-16} ${TOP+116} ${TX-158} ${CEJ-62} ${TX-130} ${CEJ}
  C ${TX-122} ${CEJ+106} ${TX-106} ${CEJ+224} ${TX-86} ${APEX-22}
  C ${TX-78} ${APEX+10} ${TX-52} ${APEX+10} ${TX-46} ${APEX-22}
  C ${TX-34} ${CEJ+226} ${TX-25} ${CEJ+128} ${TX-21} ${CEJ+68}
  C ${TX-13} ${CEJ+42} ${TX+13} ${CEJ+42} ${TX+21} ${CEJ+68}
  C ${TX+25} ${CEJ+128} ${TX+34} ${CEJ+226} ${TX+46} ${APEX-22}
  C ${TX+52} ${APEX+10} ${TX+78} ${APEX+10} ${TX+86} ${APEX-22}
  C ${TX+106} ${CEJ+224} ${TX+122} ${CEJ+106} ${TX+130} ${CEJ}
  C ${TX+158} ${CEJ-62} ${TX+R+16} ${TOP+116} ${TX+R} ${TOP} Z`;
const body = `<path d="${tooth}" fill="${SIDE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;

/* 咬合面：壓扁的橢圓 ＋ 四個淺淺的牙尖 ＋ 中央的溝 */
const table = `
  <ellipse cx="${TX}" cy="${TOP}" rx="${R}" ry="${RY}" fill="${ENAM}" stroke="${INK}" stroke-width="4.4"/>` +
  [[-0.50,-0.40],[0.44,-0.36],[0.48,0.34],[-0.46,0.30]].map(([a,b]) =>
    `<ellipse cx="${TX+R*a}" cy="${TOP+RY*b}" rx="${R*0.30}" ry="${RY*0.46}" fill="${SIDE}" opacity=".8"/>`).join('');
const fissure = `
  <path d="M ${TX-R*0.62} ${TOP-2} C ${TX-R*0.24} ${TOP-12} ${TX+R*0.16} ${TOP-10} ${TX+R*0.60} ${TOP-2}"
        fill="none" stroke="${GROOVE}" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M ${TX-R*0.04} ${TOP-RY*0.56} C ${TX-R*0.02} ${TOP-14} ${TX} ${TOP-8} ${TX+R*0.01} ${TOP-3}"
        fill="none" stroke="${GROOVE}" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M ${TX+R*0.03} ${TOP+2} C ${TX+R*0.05} ${TOP+14} ${TX+R*0.07} ${TOP+RY*0.52} ${TX+R*0.08} ${TOP+RY*0.66}"
        fill="none" stroke="${GROOVE}" stroke-width="4.2" stroke-linecap="round"/>`;

/* ⚠⚠ 那個洞：寬度 ＝ 牙冠寬 (2R) 的 1/28。就是要這麼小。 */
const PITX = TX - 2, PITY = TOP - 4, PITW = (2*R)/28;
const pit = `<ellipse cx="${PITX}" cy="${PITY}" rx="${(PITW/2).toFixed(1)}" ry="${(PITW/2*0.70).toFixed(1)}" fill="${DARK}"/>`;

/* ── ⚠⚠⚠ 牙髓腔與根管：**一整條連起來的形狀** ──────────────────
   使用者：「牙髓腔和根管的虛線不自然」。前四版是「一個浮著的橢圓 ＋ 兩條沒接上的線」。
   真的牙髓是**一個連續的腔**：上面幾個淺牙尖角、中間扁扁的腔室、
   底下收成兩條細管一路到根尖。
   ⚠ 腔室刻意**又小又扁**（被鈣化壓小的樣子）；兩條管子**全長一樣細**，不可以上粗下細。 */
const CH_T = TOP + 108, CH_B = CEJ - 18, CH_W = 38;
const pulp = `
  M ${TX-CH_W} ${CH_T+24}
  C ${TX-CH_W} ${CH_T-2} ${TX-20} ${CH_T-10} ${TX-13} ${CH_T+8}
  C ${TX-3} ${CH_T-12} ${TX+9} ${CH_T-12} ${TX+17} ${CH_T+8}
  C ${TX+25} ${CH_T-6} ${TX+CH_W} ${CH_T} ${TX+CH_W} ${CH_T+26}
  L ${TX+20} ${CH_B}
  C ${TX+29} ${CEJ+104} ${TX+50} ${CEJ+228} ${TX+62} ${APEX-46}
  L ${TX+55} ${APEX-46}
  C ${TX+43} ${CEJ+230} ${TX+23} ${CEJ+110} ${TX+13} ${CH_B+8}
  C ${TX+7} ${CH_B+17} ${TX-7} ${CH_B+17} ${TX-13} ${CH_B+8}
  C ${TX-23} ${CEJ+110} ${TX-43} ${CEJ+230} ${TX-55} ${APEX-46}
  L ${TX-62} ${APEX-46}
  C ${TX-50} ${CEJ+228} ${TX-29} ${CEJ+104} ${TX-20} ${CH_B} Z`;
const ghost = `<path d="${pulp}" fill="none" stroke="${DASH}" stroke-width="3"
   stroke-dasharray="11 9" stroke-linecap="round" opacity=".92"/>`;

/* ── 左邊：放大鏡的圓框，裡面是那個洞被放大之後的洞口 ──────── */
const CX = 402, CY = 448, CR = 340;   // ⚠ 第二版放大（使用者：放大鏡的視野和裡面的人物有點小）
const cave = `
  <clipPath id="c"><circle cx="${CX}" cy="${CY}" r="${CR-6}"/></clipPath>
  <g clip-path="url(#c)">
    <rect x="${CX-CR}" y="${CY-CR}" width="${CR*2}" height="${CR*2}" fill="${SIDE}"/>
    <rect x="${CX-CR}" y="${CY-CR}" width="${CR*2}" height="${CR*2}" fill="${SIDE}"/>
    <!-- 管壁：左右兩片往中間收，上面一片天花板，下面是地面 -->
    <path d="M ${CX-CR} ${CY-CR} L ${CX-CR} ${CY+CR} L ${CX-118} ${CY+128}
             C ${CX-150} ${CY-40} ${CX-142} ${CY-150} ${CX-CR} ${CY-CR} Z" fill="${RIM}"/>
    <path d="M ${CX+CR} ${CY-CR} L ${CX+CR} ${CY+CR} L ${CX+118} ${CY+128}
             C ${CX+150} ${CY-40} ${CX+142} ${CY-150} ${CX+CR} ${CY-CR} Z" fill="${RIM}"/>
    <path d="M ${CX-CR} ${CY-CR} L ${CX+CR} ${CY-CR} L ${CX+112} ${CY-138}
             C ${CX+40} ${CY-176} ${CX-40} ${CY-176} ${CX-112} ${CY-138} Z" fill="${RIM}"/>
    <path d="M ${CX-CR} ${CY+CR} L ${CX+CR} ${CY+CR} L ${CX+CR} ${CY+150}
             C ${CX+90} ${CY+120} ${CX-90} ${CY+120} ${CX-CR} ${CY+150} Z" fill="${GLOW}" opacity=".5"/>
    <!-- 前方那條還沒找到的窄通道：細細的、暗一階，不是黑洞 -->
    <path d="M ${CX-21} ${CY+150} C ${CX-29} ${CY-44} ${CX-12} ${CY-140} ${CX} ${CY-146}
             C ${CX+12} ${CY-140} ${CX+29} ${CY-44} ${CX+21} ${CY+150}
             C ${CX+10} ${CY+164} ${CX-10} ${CY+164} ${CX-21} ${CY+150} Z" fill="${DARK}" opacity=".88"/>
    <!-- ⚠⚠ 四個人：這一版把「位置與大小」畫進參考圖，因為上一輪壞的就是構圖
         （人整組跑到鏡框外面）。最高那位 ＝ 圓圈直徑的三分之一，
         四個人橫向約佔圈寬的六成，每個人離鏡框都留著一大段空白。
         ⚠ 這裡是**灰色的塊**，只給位置與大小 —— 提示詞要明講「畫成有臉有手、
         穿彩色衣服的人，不是剪影」（A 類紅線第 2 條）。 -->
    ${[[-168,0.86],[-100,1.0],[96,0.94],[162,0.88]].map(([dx,k]) => {
        const h = CR*2/3*k, w = h*0.30, by = CY+190;
        return `<rect x="${CX+dx-w/2}" y="${by-h}" width="${w}" height="${h}" rx="${w*0.45}"
                 fill="#b9b1a4"/><circle cx="${CX+dx}" cy="${by-h-w*0.34}" r="${w*0.40}" fill="#b9b1a4"/>`;
      }).join('')}
  </g>
  <circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${INK}" stroke-width="9"/>`;

/* ⚠⚠⚠ 第三版最重要的改動（使用者指定）：
   **引線的起點是「根管上的一點」，不是咬合面那個洞。**
   這一篇講的是**根管**鈣化 —— 放大鏡要放大的是管子裡面，
   不是牙齒表面。接錯的話，圈裡那一群人就變成在牙齒表面的坑裡，
   和文章沒有關係。⚠ 不是箭頭（箭頭是第十一節擋掉的東西）。 */

/* ⚠⚠⚠ 第三版最重要的改動（使用者指定）：
   **引線的起點是「根管上的一點」，不是咬合面那個洞。**
   這一篇講的是**根管**鈣化 —— 放大鏡要放大的是管子裡面，
   不是牙齒表面。接錯的話，圈裡那一群人就變成在牙齒表面的坑裡，
   和文章沒有關係。⚠ 不是箭頭（箭頭是第十一節擋掉的東西）。 */
const ZX = TX - 46, ZY = CEJ + 186;          // 放大的那一點：左邊那條根管的中段
const leader = `
  <line x1="${CX+CR*0.62}" y1="${CY-CR*0.72}" x2="${ZX-14}" y2="${ZY-24}" stroke="${LINE}" stroke-width="3"/>
  <line x1="${CX+CR*0.92}" y1="${CY+CR*0.30}" x2="${ZX-12}" y2="${ZY+24}" stroke="${LINE}" stroke-width="3"/>`;

/* ⚠⚠ 根管上那幾個「很小很小的人（甚至只有點）」（使用者指定）——
   它是整張圖的比例尺：看到管子裡有幾顆小點，才知道圈裡那群人正在**管子裡**。
   ⚠ 一顆點的直徑約 5px，在 1600 寬的圖上幾乎看不見 —— 就是要這麼小。 */
const dots = `<g fill="${DASH}">` +
  [[-2,-30],[0,-10],[2,10],[-1,30]].map(([dx,dy],i) =>
    `<circle cx="${(ZX+dx).toFixed(1)}" cy="${(ZY+dy).toFixed(1)}" r="${3.3-i*0.18}"/>`).join('') +
  `</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  ${leader}
  ${body}${ghost}${table}${fissure}${pit}${dots}
  ${cave}
</svg>`;

const pwDir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const cands = [];
if (existsSync(pwDir)) for (const d of readdirSync(pwDir)) {
  cands.push(join(pwDir, d, 'chrome-linux', 'headless_shell'), join(pwDir, d, 'chrome-linux', 'chrome'));
}
cands.push('/usr/bin/chromium');
const chrome = cands.find((p) => existsSync(p));
let chromium = null;
for (const p of ['/opt/node22/lib/node_modules/playwright/index.js', 'playwright']) {
  try { ({ chromium } = (await import(p)).default ?? (await import(p))); if (chromium) break; } catch {}
}
if (!chromium || !chrome) { console.error('× 找不到 Playwright／Chromium'); process.exit(1); }
const browser = await chromium.launch({ executablePath: chrome });
const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await pg.setContent(`<body style="margin:0">${svg}</body>`);
await pg.screenshot({ path: resolve(here, 'cave-ref.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

if (/[A-Za-z0-9]/.test(svg.replace(/<[^>]*>/g, ''))) throw new Error('圖上長出了字');
console.log('寫好了：drafts/pulp-calcification/cave-ref.png　洞寬 ' + PITW.toFixed(1) + 'px ＝ 牙冠寬的 1/28');
