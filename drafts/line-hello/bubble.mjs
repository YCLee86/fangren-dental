/* 對話框的形狀。2026-09-03 整支重寫。
 *
 * ⚠⚠⚠ 前一版走錯方向了。使用者最早給 YEBISU GARDEN CINEMA 當參考時說「手繪的感覺」，
 *   我把它讀成「輪廓要抖」，於是加了正弦擾動、把圓角放大到 118 —— 結果變成一隻變形蟲，
 *   使用者：「現在的對話框變得好怪喔」。
 *   他接著給的四張參考（Tully's 問卷卡／JR Suica 海報／かまわぬ 手拭巾傳單／無印良品海報）
 *   說的是同一件事：**框都是乾淨的幾何形**（圓角矩形、膠囊、角狀多邊形），
 *   配一支**短短的三角形尾巴**，而且**底是實的**、不是半透明的玻璃。
 *   YEBISU 那張的「手繪」指的是**線的質感**（均勻、肯定的一筆），不是輪廓不規則。
 *
 * ⚠ 通則：參考圖要看「它像什麼」，不要只抓一個形容詞去發揮。
 *
 * 三種形狀（都各有一支乾淨的三角尾巴）：
 *   round    圓角矩形 —— Tully's／Suica 那種
 *   stadium  膠囊（圓角 ＝ 高的一半）—— 無印良品那種
 *   poly     角狀多邊形 —— かまわぬ 那種（直邊、有稜角）
 */

const f = (n) => n.toFixed(1);

/**
 * @param {object} o
 *   shape        "round" | "stadium" | "poly"
 *   x,y,w,h      外框
 *   r            圓角（round 用；stadium 自動取 h/2）
 *   sides        poly 的邊數
 *   jitter       poly 每個頂點的半徑變化（0~1），決定性、不是亂數
 *   seed         jitter 的種子
 *   tail         {cx, wid, dx, dy} —— 尾巴根部的中心 x（絕對）、根部寬、
 *                尖端相對根部中心的位移。⚠ 三個點都是尖角，不做平滑。
 */
export function bubble(o) {
  const { shape = "round", x, y, w, h, tail } = o;
  if (shape === "poly") return polyPath(o);
  const r = shape === "stadium" ? h / 2 : Math.min(o.r ?? 40, w / 2, h / 2);
  const t = tail;
  /* 尾巴落在下緣，從右往左走的時候先遇到右邊那個根部 */
  const b2 = t ? t.cx + t.wid / 2 : null;      /* 右根 */
  const b1 = t ? t.cx - t.wid / 2 : null;      /* 左根 */
  if (t && (b1 < x + r || b2 > x + w - r))
    throw new Error(`尾巴的根部 ${f(b1)}~${f(b2)} 超出下緣的直線段 ${f(x + r)}~${f(x + w - r)}`);
  let d = `M ${f(x + r)} ${f(y)}`;
  d += ` H ${f(x + w - r)} A ${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}`;
  d += ` V ${f(y + h - r)} A ${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}`;
  if (t) {
    d += ` H ${f(b2)} L ${f(t.cx + t.dx)} ${f(y + h + t.dy)} L ${f(b1)} ${f(y + h)}`;
  }
  d += ` H ${f(x + r)} A ${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}`;
  d += ` V ${f(y + r)} A ${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)} Z`;
  return d;
}

/* 角狀多邊形：橢圓上取點，每個點的半徑用兩個低頻正弦推一點點（決定性），直線相連。
   ⚠ 直邊、有稜角才是かまわぬ 那張的味道 —— 不要再去平滑它。
   ⚠⚠ 尾巴要**接進輪廓裡**，不能另外畫一個三角形疊上去 ——
      疊上去的話，填色看起來沒事，但一描邊就會在框身上多一條線。 */
function polyPath(o) {
  const { x, y, w, h, sides = 9, jitter = .07, seed = 2, tail } = o;
  const cx = x + w / 2, cy = y + h / 2, rx = w / 2, ry = h / 2;
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const k = 1 + jitter * (Math.sin(i * 2.1 + seed) * .6 + Math.sin(i * 3.7 + seed * 1.9) * .4);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  if (tail) {
    /* 找最靠下的那條邊（兩個端點的 y 平均最大），把尾巴插進去 */
    let best = 0, bestY = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      const my = (pts[i][1] + pts[j][1]) / 2;
      if (my > bestY) { bestY = my; best = i; }
    }
    const a = pts[best], b = pts[(best + 1) % pts.length];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (tail.wid > len * .8)
      throw new Error(`尾巴根部 ${tail.wid} 比那條邊 ${len.toFixed(0)} 還寬`);
    const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
    const p1 = [mid[0] - ux * tail.wid / 2, mid[1] - uy * tail.wid / 2];
    const p2 = [mid[0] + ux * tail.wid / 2, mid[1] + uy * tail.wid / 2];
    const tip = [mid[0] + tail.dx, mid[1] + tail.dy];
    pts.splice(best + 1, 0, p1, tip, p2);
  }
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${f(pts[i][0])} ${f(pts[i][1])}`;
  return d + " Z";
}
