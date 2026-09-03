/* 手繪感的對話框：一條有機、微微不規則的封閉曲線 ＋ 一條指出去的尾巴。
 * 給 generate.mjs 用，回傳一個 SVG path 的 d 字串。
 *
 * 為什麼自己畫不用現成的圖形：使用者要的是參考圖（YEBISU GARDEN CINEMA）那種
 * **手繪線條**的感覺 —— 一條粗細一致、轉角圓潤、但輪廓不是幾何完美的線。
 * 而且診所自己的標誌本來就是圓潤的有機形狀，對話框走同一套語彙才不會外來。
 *
 * ⚠ 不要畫得太抖：參考圖那些人形是**很肯定的一筆**，不是顫抖的線。
 *   所以擾動只用兩個低頻正弦（週期 3 圈與 5 圈），振幅是半徑的百分之幾。
 */

/* 決定性的擾動（同樣的 seed 一定畫出同一條線，出圖才可重現） */
const wobble = (t, seed, amp) =>
  amp * (Math.sin(t * 3 + seed) * 0.6 + Math.sin(t * 5 + seed * 2.3) * 0.4);

/* 圓角矩形上的一點（t: 0~1 沿著周長） */
function roundRectPoint(t, w, h, r) {
  const sw = w - 2 * r, sh = h - 2 * r;                 /* 直邊長度 */
  const arc = (Math.PI / 2) * r;                         /* 一個圓角的弧長 */
  const per = 2 * sw + 2 * sh + 4 * arc;
  let d = t * per;
  const seg = (len) => { if (d <= len) return true; d -= len; return false; };
  if (seg(sw)) return [r + d, 0];                                        /* 上邊 */
  if (seg(arc)) { const a = d / r; return [w - r + r * Math.sin(a), r - r * Math.cos(a)]; }
  if (seg(sh)) return [w, r + d];                                        /* 右邊 */
  if (seg(arc)) { const a = d / r; return [w - r + r * Math.cos(a), h - r + r * Math.sin(a)]; }
  if (seg(sw)) return [w - r - d, h];                                    /* 下邊 */
  if (seg(arc)) { const a = d / r; return [r - r * Math.sin(a), h - r + r * Math.cos(a)]; }
  if (seg(sh)) return [0, h - r - d];                                    /* 左邊 */
  const a = d / r; return [r - r * Math.cos(a), r - r * Math.sin(a)];
}

/* Catmull-Rom → 三次貝茲。corner 為 true 的點不平滑（尾巴的尖端要是尖的）。 */
function spline(pts, closed = true) {
  const n = pts.length;
  const at = (i) => pts[(i % n + n) % n];
  let d = `M ${at(0).x.toFixed(1)} ${at(0).y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    /* 端點是角就把控制點收回自己身上 —— 那一段就會是直線、轉角是尖的 */
    const k1 = p1.corner || p2.corner ? 0 : 1 / 6;
    const k2 = p2.corner || p1.corner ? 0 : 1 / 6;
    const c1x = p1.x + (p2.x - p0.x) * k1, c1y = p1.y + (p2.y - p0.y) * k1;
    const c2x = p2.x - (p3.x - p1.x) * k2, c2y = p2.y - (p3.y - p1.y) * k2;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)}` +
         ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + " Z";
}

/**
 * @param {object} o
 *   x,y,w,h  對話框本體的外框
 *   r        圓角
 *   amp      手繪擾動的振幅（px）。0 ＝ 完全幾何
 *   seed     擾動的種子
 *   tail     {at, spread, len, angle} —— at: 尾巴長在周長的哪裡（0~1）、
 *            spread: 根部寬度（周長比例）、len: 從根部中點伸出去多長（px）、
 *            angle: 伸出去的方向（度，0 ＝ 往右、90 ＝ 往下）
 *            ⚠ 2026-09-03 從絕對座標 tipX/tipY 改成「長度＋角度」——
 *              使用者說「延伸角形拉好長好怪」，而長度用絕對座標根本看不出來
 *              （第一版量出來是 148px，眼睛看才知道太長）。
 *   steps    取樣點數
 */
export function speechBubble(o) {
  const { x, y, w, h, r, amp = 0, seed = 1, tail, steps = 64 } = o;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    /* 尾巴那一段跳過，等一下用三個點接上去 */
    if (tail && t > tail.at - tail.spread / 2 && t < tail.at + tail.spread / 2) continue;
    const [px, py] = roundRectPoint(t, w, h, r);
    /* 沿著「從中心往外」的方向推一點點 */
    const cx = w / 2, cy = h / 2;
    let dx = px - cx, dy = py - cy;
    const len = Math.hypot(dx, dy) || 1;
    const k = wobble(t * Math.PI * 2, seed, amp);
    pts.push({ x: x + px + dx / len * k, y: y + py + dy / len * k, t });
  }
  if (tail) {
    /* 找出尾巴要插在哪兩點之間 */
    const idx = pts.findIndex((p) => p.t > tail.at);
    const b1 = roundRectPoint(tail.at - tail.spread / 2, w, h, r);
    const b2 = roundRectPoint(tail.at + tail.spread / 2, w, h, r);
    const mid = roundRectPoint(tail.at, w, h, r);
    const rad = (tail.angle ?? 120) * Math.PI / 180;
    const tipX = x + mid[0] + Math.cos(rad) * tail.len;
    const tipY = y + mid[1] + Math.sin(rad) * tail.len;
    const seg = [
      { x: x + b1[0], y: y + b1[1] },
      { x: tipX, y: tipY, corner: true },
      { x: x + b2[0], y: y + b2[1] },
    ];
    if (idx < 0) pts.push(...seg); else pts.splice(idx, 0, ...seg);
  }
  return spline(pts);
}
