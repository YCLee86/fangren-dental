/* 對話框的形狀。2026-09-03 第四版。
 *
 * ⚠⚠ 走過的三條錯路，留著避免有人重走：
 *   ① 把 YEBISU 那張的「手繪感」讀成「輪廓要不規則」→ 加高頻正弦擾動 → 變成變形蟲。
 *   ② 四張參考看完改成乾淨的幾何形，方向對了，但四種都給了選項，
 *      其實使用者要的是很具體的一種。
 *   ③ 第三版做成**圓角矩形**，缺口按周長比例開在上緣 —— 使用者：
 *      「那個缺口和照片上的位置不一樣，這樣意思也差很多。照片上的缺口留在
 *        和延伸角形的銜接處，這樣才有手畫的感覺。另外目前的對話框太工整，也太方正。」
 *   ④ 第四版把缺口移到尾巴的銜接處（位置對了），使用者看過之後決定
 *      **整個不要缺口**：「還是不要缺口好了」。所以 `openPath()` 已經拿掉，
 *      描邊和填色現在都吃 `closedPath()`。要走回去看 git（第五版之前的 bubble.mjs）。
 *
 * 把 Tully's 那張的對話框放大之後，看得出來的是三件事：
 *   ・**整條輪廓沒有一段是直的**，也沒有「直線轉圓角」那個轉折 —— 它是一個橢圓形的塊，
 *     上下緣都是緩緩的弧。圓角矩形不管圓角開多大，都還是「四段直線＋四個圓角」。
 *   ・**左右不對稱**，上緣微微下沉、下緣微微外鼓 —— 但幅度很小，一眼看不出哪裡歪。
 *   ・**缺口就在尾巴的根部**：下緣那條線走到尾巴前面就停了，隔一小段才是尾巴。
 *     缺口開在別的地方（例如上緣正中央）讀起來是「印壞了」，開在尾巴旁邊才是
 *     「畫完最後一筆把筆提起來」。
 *
 * 所以這一版：
 *   ・形狀改成**超橢圓**（squircle）—— 指數 2 是橢圓、4 已經很方，取 2.6：
 *     比橢圓飽滿（塞得下字），但整條線沒有一段是直的、也沒有轉折點。
 *   ・加**兩個很低頻的擾動**（2 次與 3 次諧波，振幅 ±2.7% 以內）。
 *     ⚠ 低頻是重點：錯路①那次用的是高頻，高頻就是變形蟲。
 *   ⚠ 描邊與填色一定要從**同一份幾何**算出來。
 */

const f = (n) => n.toFixed(1);

/* 低頻擾動：[諧波次數, 振幅, 相位]。⚠ 次數只能是 2 或 3，再高就是變形蟲。 */
export const WOBBLE = [[2, .017, 1.15], [3, .010, -0.4]];

/**
 * 超橢圓 ＋ 尾巴的密集取樣點。
 *
 * ⚠⚠ 尾巴的參數 2026-09-03 改過（第六版）。舊寫法是 `{ cx, wid, dx, dy }`：
 *   根部用**絕對 x** 指定（所以只能接在下緣），尖端用**位移**指定。使用者：
 *   「那個延伸角形指向感覺是對著右邊的車頭，把它改成對著一樓飾邊的位置。」
 *   —— 用位移那個寫法要「指著某個東西」只能自己試角度，而且框一改大就又跑掉。
 *   新寫法直接寫**它要指著誰**：
 *     { t, wid, len, aim }
 *       t   接在輪廓的哪裡，單位是 π：0.5 ＝ 正下方、1.0 ＝ 正左方，之間就是左下
 *       wid 根部沿著輪廓的弧長（px）
 *       len 尖端離根部多遠（px）
 *       aim 尖端朝著畫面上的哪一點 —— **方向由它算出來，不是自己填角度**
 *   這樣框放大、形狀微調，尾巴都還是指著同一個東西。
 *
 * @returns {{pts:number[][], tailI:number, per:number, tip:number[], aimAng:number}}
 *   pts[tailI] ＝ 前根、[tailI+1] ＝ 尖端、[tailI+2] ＝ 後根
 */
export function outline(o) {
  const { x, y, w, h, n: nExp = 2.6, wobble = WOBBLE, tail, steps = 720 } = o;
  if (nExp < 2 || nExp > 4) throw new Error(`超橢圓指數 ${nExp} 不合理（2 ＝ 橢圓，4 已經很方）`);
  for (const [k, amp] of wobble) {
    if (k > 3) throw new Error(`擾動的諧波次數 ${k} 太高 —— 高頻會變成變形蟲，只能用 2 或 3`);
    if (Math.abs(amp) > .035) throw new Error(`擾動振幅 ${amp} 太大`);
  }
  const a = w / 2, b = h / 2, cx = x + a, cy = y + b;
  const rho = (t) => 1 + wobble.reduce((s, [k, amp, ph]) => s + amp * Math.cos(k * t + ph), 0);
  const at = (t) => {
    const c = Math.cos(t), s = Math.sin(t), p = 2 / nExp, r = rho(t);
    return [cx + r * a * Math.sign(c) * Math.abs(c) ** p,
            cy + r * b * Math.sign(s) * Math.abs(s) ** p];
  };

  /* 先取一圈**沒有尾巴**的點（從正上方 t = −π/2 起，沿 t 遞增：上 → 右 → 下 → 左） */
  const t0 = -Math.PI / 2;
  const base = [];
  for (let i = 0; i < steps; i++) base.push(at(t0 + i / steps * 2 * Math.PI));

  let pts = base, tailI = -1, tip = null, aimAng = 0;
  if (tail) {
    const { t: tPi, wid, len, aim } = tail;
    if (tPi <= .5 || tPi >= 1.25) throw new Error(`尾巴接在 ${tPi}π，不在左下那一段（.5 ~ 1.25）`);
    /* 接點的索引：取樣是從 −π/2 起跑的，換算要把那個起點算回去 */
    const i0 = Math.round(((tPi * Math.PI - t0) / (2 * Math.PI)) * steps) % steps;
    const P = base[i0];

    /* 根部：從接點沿著輪廓往兩邊各走 wid/2 的**弧長**。
       ⚠ 不能用索引差 —— 等角度取樣不是等弧長的，圓弧那一段密、平的那一段疏。 */
    const walk = (dir) => {
      let acc = 0, i = i0;
      while (acc < wid / 2) {
        const j = (i + dir + steps) % steps;
        acc += Math.hypot(base[j][0] - base[i][0], base[j][1] - base[i][1]);
        i = j;
      }
      return i;
    };
    const iA = walk(-1), iB = walk(1);        /* iA 在前（靠下緣）、iB 在後（靠左緣） */
    if (iA >= iB) throw new Error("尾巴的根部跨過了取樣的起點，換一個 t");

    /* 尖端：方向由 aim 算，長度是 len */
    const d = [aim[0] - P[0], aim[1] - P[1]];
    const L = Math.hypot(d[0], d[1]);
    if (L < len * 1.5) throw new Error(`尾巴要指的那一點離根部只有 ${f(L)}px，比尾巴自己還短`);
    aimAng = Math.atan2(d[1], d[0]);
    tip = [P[0] + len * d[0] / L, P[1] + len * d[1] / L];

    /* ⚠ 尖端要朝**外面**：和「框心指向接點」那個方向夾角不能太大，
       不然尾巴會貼著框邊躺平，甚至戳回框裡面去。 */
    const nrm = Math.atan2(P[1] - cy, P[0] - cx);
    const off = Math.abs(((aimAng - nrm + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (off > Math.PI * 55 / 180)
      throw new Error(`尾巴和外法線夾了 ${(off * 180 / Math.PI).toFixed(0)}°，太貼著框邊`);

    pts = base.slice(0, iA + 1);
    tailI = pts.length - 1;
    pts.push(tip, ...base.slice(iB));
  }

  /* ⚠ 守門一：尾巴的前後兩點都要在**下半圈**（y > 中線）。
     只驗參數範圍是不夠的 —— 那驗不出「插錯位置」（第三版踩過，尾巴被插到上緣）。 */
  if (tail) {
    const before = pts[(tailI - 1 + pts.length) % pts.length];
    const after = pts[(tailI + 3) % pts.length];
    if (before[1] < cy || after[1] < cy)
      throw new Error(`尾巴沒有接在下半圈（前 y=${f(before[1])}、後 y=${f(after[1])}、中線 ${f(cy)}）`);
  }
  /* ⚠ 守門二：相鄰兩點不可以跳太遠 —— 跳很遠就是路徑接錯了。
     ⚠ 尾巴自己那兩段本來就長，所以門檻要放它進來。 */
  const jump = tail ? Math.max(60, tail.len + tail.wid) : 40;
  for (let k = 1; k < pts.length; k++) {
    const dd = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
    if (dd > jump) throw new Error(`輪廓在第 ${k} 點跳了 ${dd.toFixed(0)}px —— 路徑接錯了`);
  }

  let per = 0;
  for (let k = 0; k < pts.length; k++) {
    const q = pts[(k + 1) % pts.length];
    per += Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]);
  }
  return { pts, tailI, per, tip, aimAng };
}

/** 封閉路徑（給填色與 clip-path 用） */
export function closedPath({ pts }) {
  return "M " + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L ") + " Z";
}
