/* 對話框的形狀。2026-09-03 第四版。
 *
 * ⚠⚠ 走過的三條錯路，留著避免有人重走：
 *   ① 把 YEBISU 那張的「手繪感」讀成「輪廓要不規則」→ 加高頻正弦擾動 → 變成變形蟲。
 *   ② 四張參考看完改成乾淨的幾何形，方向對了，但四種都給了選項，
 *      其實使用者要的是很具體的一種。
 *   ③ 第三版做成**圓角矩形**，缺口按周長比例開在上緣 —— 使用者：
 *      「那個缺口和照片上的位置不一樣，這樣意思也差很多。照片上的缺口留在
 *        和延伸角形的銜接處，這樣才有手畫的感覺。另外目前的對話框太工整，也太方正。」
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
 *   ・缺口**錨在尾巴的根部**，不再用周長比例定位。
 *   ⚠ 填色仍然是**封閉**的（不然玻璃會從缺口漏出去），
 *     而且描邊與填色一定要從**同一份幾何**算出來。
 */

const f = (n) => n.toFixed(1);

/* 低頻擾動：[諧波次數, 振幅, 相位]。⚠ 次數只能是 2 或 3，再高就是變形蟲。 */
export const WOBBLE = [[2, .017, 1.15], [3, .010, -0.4]];

/**
 * 超橢圓 ＋ 尾巴的密集取樣點。
 * @returns {{pts:number[][], tailI:number, per:number}}
 *   tailI ＝ 尾巴第一個點（右根）在點列裡的索引，缺口就錨在它前面。
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

  /* 尾巴的兩個根部：在**下半圈**找 x 等於 cx±wid/2 的那兩個角度。
     t 從 0 走到 π 時 x 單調遞減（右 → 左），所以二分法找得到唯一解。 */
  let tRoots = null, tailPts = null;
  if (tail) {
    const solve = (targetX) => {
      let lo = .02, hi = Math.PI - .02;
      if (at(lo)[0] < targetX || at(hi)[0] > targetX)
        throw new Error(`尾巴的根部 x=${f(targetX)} 落在下半圈的 ` +
          `${f(at(hi)[0])}~${f(at(lo)[0])} 之外`);
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (at(m)[0] > targetX) lo = m; else hi = m; }
      return (lo + hi) / 2;
    };
    const tR = solve(tail.cx + tail.wid / 2);   /* 右根，t 比較小 */
    const tL = solve(tail.cx - tail.wid / 2);   /* 左根 */
    const tC = solve(tail.cx);
    if (!(tR < tC && tC < tL)) throw new Error("尾巴的兩個根部順序不對");
    tRoots = [tR, tL];
    tailPts = [at(tR), [tail.cx + tail.dx, at(tC)[1] + tail.dy], at(tL)];
  }

  /* 從正上方（t = −π/2）起，沿著 t 遞增取樣：上 → 右 → 下（尾巴）→ 左 → 回到上 */
  const t0 = -Math.PI / 2;
  const pts = []; let tailI = -1;
  for (let i = 0; i < steps; i++) {
    const t = t0 + i / steps * 2 * Math.PI;
    const tn = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);   /* 正規化到 0~2π 才比得了 */
    if (tRoots && tn > tRoots[0] && tn < tRoots[1]) {
      if (tailI < 0) { tailI = pts.length; pts.push(...tailPts); }
      continue;
    }
    pts.push(at(t));
  }
  if (tail && tailI < 0) throw new Error("尾巴沒有被插進點列 —— 取樣太疏或角度算錯");

  /* ⚠ 守門一：尾巴的前後兩點都要在**下半圈**（y > 中線）。
     只驗根部的 x 範圍是不夠的 —— 那驗不出「插錯位置」（第三版踩過，尾巴被插到上緣）。 */
  if (tail) {
    const before = pts[(tailI - 2 + pts.length) % pts.length];
    const after = pts[(tailI + 4) % pts.length];
    if (before[1] < cy || after[1] < cy)
      throw new Error(`尾巴沒有接在下半圈（前 y=${f(before[1])}、後 y=${f(after[1])}、中線 ${f(cy)}）`);
  }
  /* ⚠ 守門二：相鄰兩點不可以跳太遠 —— 跳很遠就是路徑接錯了。
     ⚠ 尾巴自己那兩段本來就長，所以門檻要放它進來。 */
  const jump = tail ? Math.max(80, Math.hypot(tail.dx, tail.dy) + tail.wid) : 40;
  for (let k = 1; k < pts.length; k++) {
    const dd = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
    if (dd > jump) throw new Error(`輪廓在第 ${k} 點跳了 ${dd.toFixed(0)}px —— 路徑接錯了`);
  }

  let per = 0;
  for (let k = 0; k < pts.length; k++) {
    const q = pts[(k + 1) % pts.length];
    per += Math.hypot(q[0] - pts[k][0], q[1] - pts[k][1]);
  }
  return { pts, tailI, per };
}

/** 封閉路徑（給填色與 clip-path 用） */
export function closedPath({ pts }) {
  return "M " + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L ") + " Z";
}

/**
 * 開放路徑（給描邊用）——**從尾巴的右根起筆**，繞一整圈回來，在快接回尾巴之前停住。
 * 所以缺口一定落在**尾巴的根部旁邊**，就是 Tully's 那張的畫法。
 * @param gapFrac 缺口佔整條輪廓的比例（0~0.2）
 * ⚠ 不要再加「起筆位置」這個參數 —— 缺口的位置是由尾巴決定的，不是自由參數。
 *   第三版可以自由指定，結果就開到上緣正中央去了。
 */
export function openPath({ pts, tailI }, gapFrac = .045) {
  if (gapFrac <= 0 || gapFrac > .2) throw new Error(`缺口 ${gapFrac} 不合理（0~0.2）`);
  if (tailI < 0) throw new Error("沒有尾巴就沒有地方錨缺口");
  const n = pts.length;
  const keep = Math.round(n * (1 - gapFrac));
  const out = [];
  for (let i = 0; i < keep; i++) out.push(pts[(tailI + i) % n]);
  return "M " + out.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L ");
}
