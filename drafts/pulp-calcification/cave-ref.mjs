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

/* ── 右邊：一顆下顎大臼齒，從斜上方看 ──────────────────────
   咬合面是一個帶四個牙尖的圓角四邊形；底下露出一點頰側面與兩支牙根的頭。 */
const TX = 1105, TY = 430, R = 300;           // 牙冠中心與半徑
const occl = `
  M ${TX-R} ${TY-40}
  C ${TX-R-14} ${TY-150} ${TX-R*0.62} ${TY-R*0.82} ${TX-R*0.2} ${TY-R*0.80}
  C ${TX+R*0.24} ${TY-R*0.78} ${TX+R*0.66} ${TY-R*0.56} ${TX+R*0.94} ${TY-R*0.14}
  C ${TX+R+16} ${TY+R*0.16} ${TX+R*0.84} ${TY+R*0.5} ${TX+R*0.4} ${TY+R*0.60}
  C ${TX-R*0.06} ${TY+R*0.70} ${TX-R*0.62} ${TY+R*0.56} ${TX-R*0.88} ${TY+R*0.26}
  C ${TX-R*0.99} ${TY+R*0.12} ${TX-R} ${TY+20} ${TX-R} ${TY-40} Z`;

// 四個牙尖（淺淺的圓角隆起）＋ 中央的溝
const cusps = [[-0.52,-0.40],[0.42,-0.34],[0.46,0.24],[-0.46,0.18]]
  .map(([a,b]) => `<ellipse cx="${TX+R*a}" cy="${TY+R*b}" rx="${R*0.30}" ry="${R*0.24}"
      fill="${SIDE}" opacity=".85"/>`).join('');
const fissure = `
  <path d="M ${TX-R*0.60} ${TY-R*0.06} C ${TX-R*0.24} ${TY-R*0.16} ${TX+R*0.10} ${TY-R*0.02} ${TX+R*0.56} ${TY-R*0.06}"
        fill="none" stroke="${GROOVE}" stroke-width="7" stroke-linecap="round"/>
  <path d="M ${TX-R*0.10} ${TY-R*0.58} C ${TX-R*0.06} ${TY-R*0.30} ${TX-R*0.02} ${TY-R*0.14} ${TX} ${TY-R*0.055}"
        fill="none" stroke="${GROOVE}" stroke-width="6" stroke-linecap="round"/>
  <path d="M ${TX+R*0.04} ${TY-R*0.04} C ${TX+R*0.06} ${TY+R*0.20} ${TX+R*0.10} ${TY+R*0.36} ${TX+R*0.14} ${TY+R*0.48}"
        fill="none" stroke="${GROOVE}" stroke-width="6" stroke-linecap="round"/>`;

/* ⚠⚠ 那個洞：寬度 ＝ 牙冠寬 (2R=600) 的 1/28 ≈ 21px。就是要這麼小。 */
const PITX = TX - R*0.02, PITY = TY - R*0.05, PITW = (2*R)/28;
const pit = `<ellipse cx="${PITX}" cy="${PITY}" rx="${(PITW/2).toFixed(1)}" ry="${(PITW/2*0.72).toFixed(1)}"
   fill="${DARK}"/>`;

// 頰側面 ＋ 兩支牙根（⚠ 第一版沒畫牙根，整顆讀起來像個桶子）
const body = `
  <path d="M ${TX-R} ${TY-40} C ${TX-R-6} ${TY+120} ${TX-R*0.86} ${TY+238} ${TX-R*0.70} ${TY+286}
           C ${TX-R*0.60} ${TY+400} ${TX-R*0.50} ${TY+486} ${TX-R*0.40} ${TY+500}
           C ${TX-R*0.30} ${TY+512} ${TX-R*0.20} ${TY+448} ${TX-R*0.14} ${TY+330}
           C ${TX-R*0.10} ${TY+296} ${TX+R*0.10} ${TY+296} ${TX+R*0.14} ${TY+330}
           C ${TX+R*0.22} ${TY+452} ${TX+R*0.34} ${TY+516} ${TX+R*0.44} ${TY+502}
           C ${TX+R*0.56} ${TY+486} ${TX+R*0.66} ${TY+392} ${TX+R*0.74} ${TY+282}
           C ${TX+R*0.86} ${TY+140} ${TX+R*0.94} ${TY+40} ${TX+R*0.94} ${TY-R*0.14}
           C ${TX+R*0.84} ${TY+R*0.5} ${TX-R*0.06} ${TY+R*0.70} ${TX-R*0.88} ${TY+R*0.26}
           C ${TX-R*0.99} ${TY+R*0.12} ${TX-R} ${TY+20} ${TX-R} ${TY-40} Z"
        fill="${SIDE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;


/* ── ⚠⚠ 第二版加的：虛線畫出鈣化的牙髓腔與狹窄根管（使用者指定） ──────
   三件刻意的：
   ・**腔室畫得又小又扁** —— 鈣化過的髓腔本來就被壓低，畫大就不叫鈣化。
   ・**兩條根管是「一條線」不是「一個管」** —— 細到只剩一條虛線，
     而且**全長一樣細**（文章第五版已經拿掉「只有上半段會鈣化」那句）。
   ・**從那個小凹洞有一小段虛線接下來** —— 那是「入口在這裡」的意思。 */
const DASH = '#8c7b62';
const ghost = `
  <g fill="none" stroke="${DASH}" stroke-width="3" stroke-dasharray="11 9" stroke-linecap="round" opacity=".92">
    <path d="M ${PITX} ${PITY+8} L ${TX+R*0.01} ${TY+R*0.66}"/>
    <path d="M ${TX-R*0.30} ${TY+R*0.80}
             C ${TX-R*0.32} ${TY+R*0.70} ${TX-R*0.16} ${TY+R*0.66} ${TX} ${TY+R*0.66}
             C ${TX+R*0.16} ${TY+R*0.66} ${TX+R*0.32} ${TY+R*0.70} ${TX+R*0.30} ${TY+R*0.80}
             C ${TX+R*0.24} ${TY+R*0.92} ${TX-R*0.24} ${TY+R*0.92} ${TX-R*0.30} ${TY+R*0.80} Z"/>
    <path d="M ${TX-R*0.17} ${TY+R*0.90} C ${TX-R*0.26} ${TY+330} ${TX-R*0.36} ${TY+430} ${TX-R*0.38} ${TY+498}"/>
    <path d="M ${TX+R*0.17} ${TY+R*0.90} C ${TX+R*0.26} ${TY+330} ${TX+R*0.38} ${TY+430} ${TX+R*0.42} ${TY+500}"/>
  </g>`;

/* ── 左邊：放大鏡的圓框，裡面是那個洞被放大之後的洞口 ──────── */
const CX = 402, CY = 448, CR = 340;   // ⚠ 第二版放大（使用者：放大鏡的視野和裡面的人物有點小）
const cave = `
  <clipPath id="c"><circle cx="${CX}" cy="${CY}" r="${CR-6}"/></clipPath>
  <g clip-path="url(#c)">
    <rect x="${CX-CR}" y="${CY-CR}" width="${CR*2}" height="${CR*2}" fill="${SIDE}"/>
    <path d="M ${CX-CR} ${CY+186} C ${CX-150} ${CY+140} ${CX+150} ${CY+140} ${CX+CR} ${CY+186}
             L ${CX+CR} ${CY+CR} L ${CX-CR} ${CY+CR} Z" fill="${RIM}"/>
    <path d="M ${CX-196} ${CY+170} C ${CX-178} ${CY-224} ${CX+178} ${CY-224} ${CX+196} ${CY+170}
             C ${CX+100} ${CY+214} ${CX-100} ${CY+214} ${CX-196} ${CY+170} Z" fill="${DARK}"/>
    <path d="M ${CX-130} ${CY+152} C ${CX-116} ${CY-160} ${CX+116} ${CY-160} ${CX+130} ${CY+152}
             C ${CX+66} ${CY+184} ${CX-66} ${CY+184} ${CX-130} ${CY+152} Z" fill="${GLOW}" opacity=".55"/>
  </g>
  <circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${INK}" stroke-width="9"/>`;

// 兩條細線，把圈連到那個洞（⚠ 不是箭頭 —— 箭頭是第十一節擋掉的東西）
const leader = `
  <line x1="${CX+CR*0.74}" y1="${CY-CR*0.68}" x2="${PITX-14}" y2="${PITY-10}" stroke="${LINE}" stroke-width="3"/>
  <line x1="${CX+CR*0.96}" y1="${CY+CR*0.26}" x2="${PITX-12}" y2="${PITY+12}" stroke="${LINE}" stroke-width="3"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  ${leader}
  ${body}
  <path d="${occl}" fill="${ENAM}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${cusps}${fissure}${ghost}${pit}
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
