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
const GUM = '#f0c0c4';   // 牙齦

/* ── 右邊：一顆下顎大臼齒 ────────────────────────────────────
   ⚠⚠⚠ 第五版重畫（使用者：「牙齒的形狀變得很奇怪」）。
   前四版把牙體畫成直筒、底下一個怪缺口 —— 那不是牙齒，是個桶子，模型照抄就抄出桶子。
   這一版：**咬合面是被壓扁的橢圓**（從斜上方看本來就會縮短，第一版讀得出來的就是這個）、
   **牙冠兩側鼓出來、到牙頸收腰**、**兩支牙根分開再收成圓鈍的根尖**。 */
const TX = 1118, TOP = 214, R = 168, RY = 50;   // 中線／咬合面橢圓的中心與半徑
const CEJ = 486, APEX = 812;                    // 牙頸線／根尖

/* ⚠⚠⚠ 第十版重畫咬合面（使用者：「牙齒的形狀回覆到正常咬合面　現在是扁平的」）。
   前一版把咬合面畫成「一個壓扁的橢圓蓋在平平的牙冠頂上」—— 那是俯視圖的畫法，
   貼到這個「稍微從上面看」的角度上，出圖就變成一顆平頭的牙齒。
   正常的下顎大臼齒從這個角度看是**兩排牙尖**：
   ・近的那排（頰側）在畫面下方，是一條**起伏的稜線**，不是直線；
   ・遠的那排（舌側）在畫面上方，就是**牙冠的輪廓頂端**，所以輪廓本身要有兩個峰；
   ・兩排之間凹下去就是**中央溝**，那個洞就開在溝上。
   兩排在近心／遠心兩側收攏到同一點（邊緣脊），所以咬合面是個梭形不是橢圓。 */
const CTOP = TOP + 30;                    // 兩排牙尖在左右兩端收攏的高度（邊緣脊）
const cuspsFar = `
  C ${TX+R*0.90} ${TOP-16} ${TX+R*0.72} ${TOP-48} ${TX+R*0.50} ${TOP-48}
  C ${TX+R*0.30} ${TOP-48} ${TX+R*0.18} ${TOP-26} ${TX} ${TOP-26}
  C ${TX-R*0.18} ${TOP-26} ${TX-R*0.30} ${TOP-48} ${TX-R*0.50} ${TOP-48}
  C ${TX-R*0.72} ${TOP-48} ${TX-R*0.90} ${TOP-16} ${TX-R} ${CTOP}`;
const cuspsNear = `
  C ${TX-R*0.88} ${TOP+22} ${TX-R*0.70} ${TOP+12} ${TX-R*0.48} ${TOP+12}
  C ${TX-R*0.26} ${TOP+12} ${TX-R*0.16} ${TOP+40} ${TX} ${TOP+40}
  C ${TX+R*0.16} ${TOP+40} ${TX+R*0.26} ${TOP+12} ${TX+R*0.48} ${TOP+12}
  C ${TX+R*0.70} ${TOP+12} ${TX+R*0.88} ${TOP+22} ${TX+R} ${CTOP}`;

const tooth = `
  M ${TX-R} ${CTOP}
  C ${TX-R-16} ${TOP+116} ${TX-158} ${CEJ-62} ${TX-130} ${CEJ}
  C ${TX-122} ${CEJ+106} ${TX-106} ${CEJ+224} ${TX-86} ${APEX-22}
  C ${TX-78} ${APEX+10} ${TX-52} ${APEX+10} ${TX-46} ${APEX-22}
  C ${TX-34} ${CEJ+226} ${TX-25} ${CEJ+128} ${TX-21} ${CEJ+68}
  C ${TX-13} ${CEJ+42} ${TX+13} ${CEJ+42} ${TX+21} ${CEJ+68}
  C ${TX+25} ${CEJ+128} ${TX+34} ${CEJ+226} ${TX+46} ${APEX-22}
  C ${TX+52} ${APEX+10} ${TX+78} ${APEX+10} ${TX+86} ${APEX-22}
  C ${TX+106} ${CEJ+224} ${TX+122} ${CEJ+106} ${TX+130} ${CEJ}
  C ${TX+158} ${CEJ-62} ${TX+R+16} ${TOP+116} ${TX+R} ${CTOP}
  ${cuspsFar} Z`;
/* 咬合面 ＝ 遠排牙尖與近排牙尖之間那一塊，兩端收攏成梭形。
   ⚠⚠⚠ 定義要在 neighbour 之前 —— 鄰牙也要用同一塊。第十四版踩過：
   主角那顆改成有牙尖之後，**鄰牙還留著舊的那個壓扁橢圓蓋子**，
   出圖回來三顆牙裡兩顆是「杯口被削平的杯子」。
   ⚠ 通則：**改了一個形狀，要去找它所有的複本。** */
const table = `
  <path d="M ${TX-R} ${CTOP} ${cuspsNear.replace(/\s+/g,' ')}
           ${cuspsFar.replace(/\s+/g,' ')} Z" fill="${ENAM}" stroke="none"/>
  <path d="M ${TX-R} ${CTOP} ${cuspsNear.replace(/\s+/g,' ')}"
        fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`;
const body = `<path d="${tooth}" fill="${SIDE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;

/* ⚠⚠ 鄰牙（第六版加，使用者：「這顆牙齒特別高　和周圍的牙齒應該一樣高度」）——
   同一排牙齒本來就一樣高。前五版的參考圖只有一顆牙，模型就把主角那顆畫得比鄰牙高一大截。
   **左右各一顆、同樣大小、咬合面同高**，被畫面邊緣裁掉。 */
const neighbour = (dx) => `<g transform="translate(${dx},0)" opacity=".85">
  <path d="${tooth}" fill="${SIDE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  ${table}
</g>`;
const neighbours = neighbour(-396) + neighbour(396);
/* ⚠ 牙齦畫在鄰牙**後面那一層的前面**：鄰牙只露牙冠（正常的畫法），
   主角那顆畫在牙齦前面，牙根與虛線的髓腔才看得到（透視的只有它一顆）。 */
const gum = `<rect x="0" y="${CEJ+10}" width="${W}" height="${H-CEJ-10}" fill="${GUM}"/>`;

const fissure = `
  <path d="M ${TX-R*0.78} ${TOP+16} C ${TX-R*0.44} ${TOP-10} ${TX-R*0.18} ${TOP-2} ${TX} ${TOP-2}
           C ${TX+R*0.18} ${TOP-2} ${TX+R*0.44} ${TOP-10} ${TX+R*0.78} ${TOP+16}"
        fill="none" stroke="${GROOVE}" stroke-width="4.6" stroke-linecap="round"/>
  <path d="M ${TX+2} ${TOP-2} L ${TX+2} ${TOP-22}"
        fill="none" stroke="${GROOVE}" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M ${TX+2} ${TOP-2} L ${TX+2} ${TOP+30}"
        fill="none" stroke="${GROOVE}" stroke-width="3.6" stroke-linecap="round"/>`;

/* ⚠⚠ 那個洞：寬度 ＝ 牙冠寬 (2R) 的 1/28。就是要這麼小。 */
const PITX = TX - R*0.34, PITY = TOP - 3, PITW = (2*R)/28;
const pit = `<ellipse cx="${PITX}" cy="${PITY}" rx="${(PITW/2).toFixed(1)}" ry="${(PITW/2*0.70).toFixed(1)}" fill="${DARK}"/>`;

/* ── ⚠⚠⚠ 牙髓腔與根管：**一整條連起來、順著牙根走的形狀** ──────────
   第四版使用者說「不自然」，第十一版他給了一張標準的牙齒剖面圖並且指出三件：
   ① **根管要順著牙根的形狀走**，是流線的，不是兩條插進去的直線；
   ② **鈣化的根管比那張圖還細**；
   ③ **髓腔比那張圖更窄更扁**。
   所以這一版的畫法是：髓腔 ＝ 兩個髓角 ＋ 中間凹下去的頂 ＋ **往上拱的底**，
   兩個根管口從那個拱的兩端各自往下，**沿著牙根的中線彎過去**，一路收到根尖前變成一個點。
   ⚠ 全程只有一條封閉的輪廓，髓腔和根管之間沒有斷口。 */
const CH_T = TOP + 134;      // 髓角的高度（兩個尖）
const CH_R = TOP + 160;      // 兩個髓角之間凹下去的那一點 —— ⚠ 只凹一點點，
                             //   凹太深的話中間被夾扁，整個形狀會讀成「上下兩塊」而不是一個腔
const CH_B = CEJ - 52;       // 髓腔底（拱的兩端）
const CH_W = 50;             // 髓腔最寬處的半寬 —— ⚠ 比參考圖窄
const ORI  = 36;             // 根管口離中線多遠
const AP   = 66;             // 根管末端離中線多遠（＝牙根的中線）
const APY  = APEX - 46;      // 根管末端的高度
const pulp = `
  M ${TX-CH_W} ${CH_T}
  C ${TX-CH_W+8} ${CH_R-26} ${TX-22} ${CH_R} ${TX} ${CH_R}
  C ${TX+22} ${CH_R} ${TX+CH_W-8} ${CH_R-26} ${TX+CH_W} ${CH_T}
  C ${TX+CH_W+4} ${CH_T+60} ${TX+CH_W-2} ${CH_B-32} ${TX+ORI+14} ${CH_B}
  C ${TX+52} ${CEJ+72} ${TX+63} ${CEJ+192} ${TX+AP+1} ${APY}
  C ${TX+AP} ${APY+10} ${TX+AP-1} ${APY+10} ${TX+AP-2} ${APY}
  C ${TX+57} ${CEJ+192} ${TX+45} ${CEJ+74} ${TX+ORI-6} ${CH_B+2}
  C ${TX+16} ${CH_B-10} ${TX-16} ${CH_B-10} ${TX-ORI+6} ${CH_B+2}
  C ${TX-45} ${CEJ+74} ${TX-57} ${CEJ+192} ${TX-AP+2} ${APY}
  C ${TX-AP+1} ${APY+10} ${TX-AP} ${APY+10} ${TX-AP-1} ${APY}
  C ${TX-63} ${CEJ+192} ${TX-52} ${CEJ+72} ${TX-ORI-14} ${CH_B}
  C ${TX-CH_W+2} ${CH_B-32} ${TX-CH_W-4} ${CH_T+60} ${TX-CH_W} ${CH_T} Z`;
const ghost = `<path d="${pulp}" fill="none" stroke="${DASH}" stroke-width="3"
   stroke-dasharray="11 9" stroke-linecap="round" opacity=".92"/>`;

/* ── 左邊：放大鏡的圓框，裡面是那個洞被放大之後的洞口 ──────── */
/* ⚠ 第二版放大（使用者：放大鏡的視野和裡面的人物有點小）
   ⚠⚠ 第十二版再放大一次（使用者：「人物超出放大圈圈了　放大圈圈可能要再[大]一點」）——
   340 → 368，而且**人從四個減成三個**（使用者：「醫療人員少一個」）。
   兩件事是同一件：圈裡塞不下就會溢出來，治法是「圈更大 ＋ 人更少」兩邊一起。 */
const CX = 402, CY = 448, CR = 368;
/* ⚠ 圈裡的人 ＝ 這張表 ＋ 擠通道那一位。改人數只改這張表，最後那道守門會數。
   ⚠⚠ 第十三版回到四個（使用者：「上次 6 個人太多超出圈圈　應該 4 個人就好 ——
   醫師和要擠進洞穴的人還有旁邊兩個一般民眾（太太＋老先生）保留」）。
   第十二版減到三個是我自己多減的：他說的「少一個」是**從模型畫出來的六個**算，
   不是從提示詞寫的四個算。⚠ 通則：**使用者說「少一個」的時候，
   要先確認他在數的是哪一份** —— 畫面上的那一份，還是規格上的那一份。 */
const FOLK = [[-168,1.0],[100,0.94],[190,0.86]];
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
    <!-- ⚠⚠⚠ 三個人 ＝ 擠通道那一位（下面那個深色的）＋ 這裡兩塊。
         ⚠⚠⚠ 第十二版抓到的真正成因：前一版提示詞寫「四個人」，
         參考圖卻畫了**擠通道那一位 ＋ 四塊 ＝ 五個人** —— 文字和圖打架，
         模型照圖數，於是畫出五、六個，圈裡塞不下就整排溢到鏡框外面。
         **人數這種事，參考圖上要數得出來，而且要和提示詞對得起來**（最後有守門在數）。
         最高那位 ＝ 圓圈直徑的三分之一，三個人橫向約佔圈寬的**五成**，
         每個人離鏡框都留著一大段空白。
         ⚠ 這裡是**灰色的塊**，只給位置與大小 —— 提示詞要明講「畫成有臉有手、
         穿彩色衣服的人，不是剪影」（A 類紅線第 2 條）。 -->
    <!-- ⚠ 正在擠進那條窄通道的那一位（使用者指定）：身體比別人窄、貼著通道口 -->
    <g transform="translate(${CX-4},${CY+40}) rotate(-8)">
      <rect x="-13" y="-150" width="26" height="150" rx="13" fill="#a49b8d"/>
      <circle cx="0" cy="-164" r="16" fill="#a49b8d"/>
    </g>
    ${FOLK.map(([dx,k]) => {
        const h = CR*2/3*k, w = h*0.30, by = CY+190;
        return `<rect x="${CX+dx-w/2}" y="${by-h}" width="${w}" height="${h}" rx="${w*0.45}"
                 fill="#b9b1a4"/><circle cx="${CX+dx}" cy="${by-h-w*0.34}" r="${w*0.40}" fill="#b9b1a4"/>`;
      }).join('')}
  </g>
  <circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${INK}" stroke-width="9"/>`;

/* ⚠⚠⚠ 引線：起點是「根管上的一點」，不是咬合面那個洞（第三版起）。
   這一篇講的是**根管**鈣化 —— 放大鏡要放大的是管子裡面，不是牙齒表面。

   ⚠⚠ 第六版（使用者：「下面那條應該要像上面做成放大鏡框的外切線」）：
   **兩條都是從那一點畫到圓的外切線**，不是隨便從鏡框上挑兩個點。
   外切線有公式，用算的不要用目測：
     d ＝ 點到圓心的距離、γ ＝ acos(r/d)、φ ＝ 圓心看向那一點的角度
     兩個切點 ＝ 圓心 ＋ r·(cos(φ±γ), sin(φ±γ))
   這樣兩條線會自然地包住整個圓，看起來才像「這個圓在看那一點」。 */
/* ⚠⚠⚠ 第十二版把這一點往上搬（使用者：「人物那邊放大鏡的下緣切線連到膿包了
   應該拉到和上緣切線在根管裡差不多的位置」）。
   成因：這一點原本在 CEJ+186，離根尖的膿包只有 150px，大圈的**下緣**切線掃下來
   終點就落在膿包旁邊 —— 模型於是把它接到膿包上，變成「大圈在放大膿包」。
   ⚠⚠ 第十三版再往上搬一次（CEJ+120 → CEJ+90）：第十二版還是不夠，出圖回來
   四條線互相接錯（小圈的上緣切線沒接到膿包、大圈的下緣切線糊掉、還多長一條）。
   現在兩個目標差 246px，大圈的下緣切線在膿包上方 240px 處就停了。
   ⚠ 通則：**兩組引線的終點要離得夠遠**，不然模型會把它們併成一組；
   這種錯在參考圖上看起來只是「有點近」，出圖才會變成接錯。 */
const ZX = TX - 51, ZY = CEJ + 90;           // 放大的那一點：左邊那條根管的上段
const leaderTo = (cx, cy, r, px, py) => {
  const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy);
  if (d <= r) throw new Error('那一點落在圓裡面，畫不出外切線');
  const phi = Math.atan2(dy, dx), gamma = Math.acos(r / d);
  return [phi + gamma, phi - gamma].map((a) =>
    `<line x1="${(cx + r*Math.cos(a)).toFixed(1)}" y1="${(cy + r*Math.sin(a)).toFixed(1)}"
       x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${LINE}" stroke-width="3"/>`).join('');
};
const leader = leaderTo(CX, CY, CR, ZX, ZY);

/* ── ⚠⚠ 第二個圈：根尖的囊腫（第七版加，第九版搬到右邊並放大） ──────────
   ⚠⚠⚠ 第九版：使用者「細菌的放大圈圈現在是往左拉，但左邊沒什麼空間，改成往右拉
   可以大一點」。左邊整個被大圈佔滿了，小圈擠在兩者之間，所以：
   ・**圈搬到牙齒右下方的牙齦上**，那一片本來就是空的。
   ・直徑從大圈的 0.38 放大到 **0.45**（仍然明顯小於大圈 —— 主角還是找入口那一件）。
   ⚠⚠ 第九版一度把囊腫也搬到右根尖（為了讓引線不必橫過牙根），**使用者退回**：
   「細菌的膿包維持在左邊的根尖」。所以囊腫回到左根尖，兩條引線從左根尖往右拉，
   **上面那條會經過右邊那支牙根** —— 處理方式是**把引線畫在牙齒底下那一層**
   （SVG 的順序：leader 在 body 之前），線碰到牙根就被蓋住、從另一邊再出來，
   這是製圖上正常的畫法，比把圈硬塞到沒有空間的地方好。
   ⚠ 下面那條刻意從**根尖下方**過去（圈的位置壓低就是為了這個）。 */
/* ⚠⚠ 第十五版（使用者：「膿包這次沒有對到根尖　而且膿包不應該是一個正圓」）：
   ・中心往下挪，**上緣包住根尖**、不是掛在旁邊。
   ・形狀改成**歪的、不規則的一團**（真的病灶本來就不是正圓），不再用 <circle>。 */
const YX = TX - 64, YY = APEX - 22;                 // 囊腫：**左**根尖外面（使用者指定）
const YR = 62;                                      // 大致的半徑（引線的外切線用這個算）
const SX = 1410, SY = 706, SR = 152;                // 第二個圈：右下、壓低、放大過
/* ⚠ 歪的、不對稱的一團，**上緣往上包住根尖**（根尖是插進它裡面的，不是掛在它上面）。
   ⚠ 不可以是正圓，也不可以是規規矩矩的橢圓 —— 真的病灶本來就是歪的。 */
const cyst = `<path d="
  M ${YX-30} ${YY-54}
  C ${YX-64} ${YY-42} ${YX-74} ${YY-6} ${YX-58} ${YY+24}
  C ${YX-42} ${YY+52} ${YX-2} ${YY+60} ${YX+28} ${YY+46}
  C ${YX+62} ${YY+30} ${YX+72} ${YY-2} ${YX+52} ${YY-26}
  C ${YX+44} ${YY-36} ${YX+34} ${YY-30} ${YX+22} ${YY-40}
  C ${YX+10} ${YY-50} ${YX-8} ${YY-58} ${YX-30} ${YY-54} Z"
  fill="#e9dcc4" stroke="${DASH}" stroke-width="3" stroke-linejoin="round"/>`;
const leader2 = leaderTo(SX, SY, SR, YX, YY);

/* ⚠⚠⚠ 第十四版把細菌改回**沒有臉、沒有四肢的灰塊**（使用者：「圖片變的很簡化」）。
   第九版我為了交代「牠們有手有腳有表情」，在這張結構圖上把細菌畫成小角色 ——
   結果出圖回來的細菌**逐項照抄這張圖**：灰的、圓的、一圈短刺、兩點眼睛、沒有手腳，
   和第三張參考圖（站上舊圖那批有手有腳、深色、張嘴大叫的）完全無關。
   ⚠⚠⚠ 成因：**這張圖是結構圖，它一旦畫了「長相」，就會蓋過真正負責長相的那張參考圖。**
   （ILLUSTRATION.md 第十二節：一組參考圖只准提供一件事 —— 這張的那一件是「版面」。）
   所以細菌和人一樣，只給**位置、大小、數量**，長相一律回提示詞與第三張參考圖拿。 */
const bug = (dx, dy, s, lean) => {
  const x = SX + dx, y = SY + dy;
  return `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s*1.22}"
            transform="rotate(${lean} ${x} ${y})" fill="#9a9081"/>`;
};
const bugs = `
  <clipPath id="c2"><circle cx="${SX}" cy="${SY}" r="${SR-5}"/></clipPath>
  <g clip-path="url(#c2)">
    <rect x="${SX-SR}" y="${SY-SR}" width="${SR*2}" height="${SR*2}" fill="#efe3cb"/>
    <!-- 髒亂：地上的水窪、牆上的潑濺、飛出去的碎屑 -->
    <ellipse cx="${SX-44}" cy="${SY+132}" rx="86" ry="20" fill="#a8a795" opacity=".8"/>
    <ellipse cx="${SX+92}" cy="${SY+142}" rx="52" ry="14" fill="#a8a795" opacity=".7"/>
    <path d="M ${SX-150} ${SY-98} q 32 -28 66 -8 q -18 30 -66 8 Z" fill="#a8a795" opacity=".75"/>
    <path d="M ${SX+104} ${SY-92} q 28 -22 56 -6 q -16 26 -56 6 Z" fill="#a8a795" opacity=".75"/>
    ${[[-132,24],[-112,-10],[30,-122],[66,-102],[138,68],[-46,122],[118,-18],[-90,84]]
      .map(([dx,dy]) => `<circle cx="${SX+dx}" cy="${SY+dy}" r="5" fill="#8c8672"/>`).join('')}
    ${[[-96,-46,20,-14],[-20,-86,16,9],[62,-52,18,-7],[-72,42,17,12],[14,16,21,-5],[96,36,16,8],[-16,104,15,-10],[84,106,14,6]]
      .map(([dx,dy,s,lean]) => bug(dx,dy,s,lean)).join('')}
  </g>
  <circle cx="${SX}" cy="${SY}" r="${SR}" fill="none" stroke="${INK}" stroke-width="8"/>`;

/* ⚠⚠ 根管上那幾個「很小很小的人（甚至只有點）」（使用者指定）——
   它是整張圖的比例尺：看到管子裡有幾顆小點，才知道圈裡那群人正在**管子裡**。
   ⚠ 一顆點的直徑約 5px，在 1600 寬的圖上幾乎看不見 —— 就是要這麼小。 */
/* ⚠ 三顆，和圈裡三個人一樣多（第十二版：人數從四改成三，這裡忘了改就又是文圖打架）。 */
const DOTS = [[-6,-30],[-4,-10],[-3,10],[-1,30]];
const dots = `<g fill="${DASH}">` +
  DOTS.map(([dx,dy],i) =>
    `<circle cx="${(ZX+dx).toFixed(1)}" cy="${(ZY+dy).toFixed(1)}" r="${3.3-i*0.2}"/>`).join('') +
  `</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  ${neighbours}
  ${gum}
  ${leader}${leader2}
  ${cyst}${body}${ghost}${table}${fissure}${pit}${dots}
  ${bugs}
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

/* ⚠⚠⚠ 守門：圈裡的人數要和提示詞裡的人數一樣（第十二版踩過，文字四個、圖五個）。 */
{
  const want = 4;
  const got = FOLK.length + 1;          // ＋1 ＝ 擠通道那一位
  if (got !== want) throw new Error(`圈裡畫了 ${got} 個人，提示詞寫的是 ${want} 個`);
  if (DOTS.length !== want) throw new Error(`根管上畫了 ${DOTS.length} 顆點，人卻有 ${want} 個`);
  const promptFile = resolve(here, 'hero-prompt.txt');
  if (existsSync(promptFile)) {
    const t = (await import('node:fs')).readFileSync(promptFile, 'utf8');
    if (!/EXACTLY FOUR PEOPLE/.test(t) || /EXACTLY THREE PEOPLE/.test(t)) {
      throw new Error('提示詞裡的人數和參考圖的四個對不起來');
    }
  }
}
console.log('寫好了：drafts/pulp-calcification/cave-ref.png　洞寬 ' + PITW.toFixed(1) + 'px ＝ 牙冠寬的 1/28');
