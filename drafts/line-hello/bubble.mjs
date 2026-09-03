/* 對話框的形狀。2026-09-03 第三版。
 *
 * ⚠⚠ 走過的兩條錯路，留著避免有人重走：
 *   ① 把 YEBISU 那張的「手繪感」讀成「輪廓要不規則」→ 加正弦擾動 → 變成變形蟲。
 *   ② 四張參考（Tully's／Suica／かまわぬ／無印良品）看完改成乾淨的幾何形，方向對了，
 *      但四種都給了選項，其實使用者要的是很具體的一種。
 *
 * 使用者 2026-09-03 定案：
 *   「介於圓角矩形和膠囊之間的形狀，風格要像這張照片下方的手繪對話框，
 *     一筆劃最後帶一個小缺口，比較有人畫的感覺。」
 *
 * 所以這一版只有一種形狀，重點在**畫法**：
 *   ・圓角介於兩者之間（圓角矩形 44、膠囊 ＝ 高的一半；這裡取 92）
 *   ・描邊是**開放路徑**，收尾留一個小缺口 —— 一筆劃沒有完全接回起點
 *   ・填色仍然是**封閉**的（不然玻璃會漏出去）
 *   ⚠ 兩者一定要從**同一份幾何**算出來，不然缺口的位置會對不上。
 */

const f = (n) => n.toFixed(1);

/* 圓角矩形（含尾巴）的密集取樣點。取樣夠密的話，折線和真正的弧看不出差別，
   而且**可以沿著周長切開**——那是留缺口與接尾巴都需要的。 */
export function outline(o) {
  const { x, y, w, h, r: r0 = 92, tail, steps = 420 } = o;
  const r = Math.min(r0, w / 2, h / 2);
  const sw = w - 2 * r, sh = h - 2 * r, arc = (Math.PI / 2) * r;
  const per = 2 * sw + 2 * sh + 4 * arc;

  const at = (d) => {                       /* 沿周長 d（0~per）取一點 */
    let k = ((d % per) + per) % per;
    const seg = (len) => { if (k <= len) return true; k -= len; return false; };
    if (seg(sw)) return [x + r + k, y];                                   /* 上 → */
    if (seg(arc)) { const a = k / r; return [x + w - r + r * Math.sin(a), y + r - r * Math.cos(a)]; }
    if (seg(sh)) return [x + w, y + r + k];                               /* 右 ↓ */
    if (seg(arc)) { const a = k / r; return [x + w - r + r * Math.cos(a), y + h - r + r * Math.sin(a)]; }
    if (seg(sw)) return [x + w - r - k, y + h];                           /* 下 ← */
    if (seg(arc)) { const a = k / r; return [x + r - r * Math.sin(a), y + h - r + r * Math.cos(a)]; }
    if (seg(sh)) return [x, y + h - r - k];                               /* 左 ↑ */
    const a = k / r; return [x + r - r * Math.cos(a), y + r - r * Math.sin(a)];
  };

  /* 尾巴：在下緣挖掉一段，換成三個尖角點 */
  let tailAt = null, tailPts = null;
  if (tail) {
    const bottomStart = sw + arc + sh + arc;                 /* 下緣起點（右端）的周長位置 */
    /* ⚠⚠ tail.cx 是**絕對座標**，換算周長位置時一定要先減掉 x 變成相對座標。
       2026-09-03 踩過：漏了這個 −x，尾巴被插到**上緣**去，畫面上是一條斜線穿過整個框，
       連玻璃的裁切也跟著歪。而且原本的守門只驗根部的 x 範圍、驗不出這件事。 */
    const cxL = tail.cx - x;
    const from = bottomStart + (w - r - (cxL + tail.wid / 2));   /* 右根 */
    const to   = bottomStart + (w - r - (cxL - tail.wid / 2));   /* 左根 */
    if (tail.cx - tail.wid / 2 < x + r || tail.cx + tail.wid / 2 > x + w - r)
      throw new Error(`尾巴根部 ${f(tail.cx - tail.wid / 2)}~${f(tail.cx + tail.wid / 2)} ` +
        `超出下緣的直線段 ${f(x + r)}~${f(x + w - r)}`);
    tailAt = [from, to];
    tailPts = [
      [tail.cx + tail.wid / 2, y + h],
      [tail.cx + tail.dx, y + h + tail.dy],
      [tail.cx - tail.wid / 2, y + h],
    ];
  }

  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const d = i / steps * per;
    if (tailAt && d > tailAt[0] && d < tailAt[1]) {
      if (!pts.tailDone) { pts.push(...tailPts); pts.tailDone = true; }
      continue;
    }
    pts.push(at(d));
  }
  /* ⚠ 驗尾巴真的接在下緣：三個尾巴點的前後兩點，y 都要貼著下緣。
     只驗根部的 x 範圍是不夠的 —— 那驗不出「插錯位置」。 */
  if (tail) {
    const i = pts.findIndex((p) => Math.abs(p[0] - tailPts[1][0]) < .5 && Math.abs(p[1] - tailPts[1][1]) < .5);
    if (i < 1 || i > pts.length - 2) throw new Error("尾巴的尖端不在點列裡");
    const before = pts[i - 2], after = pts[i + 2];
    const bottomY = y + h;
    if (Math.abs(before[1] - bottomY) > 2 || Math.abs(after[1] - bottomY) > 2)
      throw new Error(`尾巴沒有接在下緣（前 y=${before[1].toFixed(0)}、後 y=${after[1].toFixed(0)}、下緣 ${bottomY}）`);
    /* 相鄰兩點不可以跳太遠 —— 跳很遠就是路徑接錯了 */
    for (let k = 1; k < pts.length; k++) {
      const dd = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
      if (dd > Math.max(80, tail.wid + 40))
        throw new Error(`輪廓在第 ${k} 點跳了 ${dd.toFixed(0)}px —— 路徑接錯了`);
    }
  }
  return pts;
}

/** 封閉路徑（給填色與 clip-path 用） */
export function closedPath(pts) {
  return "M " + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L ") + " Z";
}

/**
 * 開放路徑（給描邊用）——**收尾留一個小缺口**，就是「一筆劃沒有接回起點」。
 * @param gapFrac 缺口佔整條輪廓的比例（0~0.2）
 * @param startFrac 這一筆從輪廓的哪裡起筆（0~1）
 * ⚠ 缺口要開在**沒有東西**的那一段（不要開在尾巴上，也不要開在字旁邊）。
 */
export function openPath(pts, gapFrac = .045, startFrac = .06) {
  if (gapFrac <= 0 || gapFrac > .2) throw new Error(`缺口 ${gapFrac} 不合理（0~0.2）`);
  const n = pts.length;
  const keep = Math.round(n * (1 - gapFrac));
  const s = Math.round(n * startFrac);
  const out = [];
  for (let i = 0; i < keep; i++) out.push(pts[(s + i) % n]);
  return "M " + out.map(([a, b]) => `${f(a)} ${f(b)}`).join(" L ");
}
