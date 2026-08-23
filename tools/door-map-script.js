/* ==========================================================================
   門口那張停車參考圖：轉向 ＋ 海報化（提案用，定案時整段刪掉）
   --------------------------------------------------------------------------
   ⚠ 核心那一招：**父層轉、子層各自轉回來**。
     父：g#geo 整組 rotate(θ, 280, 310)（街廓、路、停車場色塊、路線、綠塊）
     子：要保持直立的東西各自 rotate(−θ, 自己的錨點)
         —— 父轉 ∘ 子反轉 ＝ 在錨點附近只剩位移，字與標記跟著搬到轉過去的
            位置、但不會歪。
   ⚠⚠ 直立的東西**位置要用「螢幕上的樣子」算，不能用 map 座標直接擺**：
      字是直立的，所以「基線比字面中心低 0.345em」這個偏差永遠往螢幕下方，
      拿 map 座標擺就會在轉向之後跑到路的側邊去（使用者：「道路名稱要在道路
      的中間」）。做法是：先定「字面中心要落在哪個 map 點」，再在直立的座標系
      裡用 dy 把基線補回去。
   ========================================================================== */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var body = document.body, fig = document.querySelector('.map-fig');
  if (!fig) return;
  var svg = fig.querySelector('.map-svg'), geo = svg.querySelector('#geo');
  var CX = 280, CY = 310;                      /* viewBox 的中心 */
  var ANG = { n: 0, e: -90, w: 90, s: 180 };   /* 哪一邊朝上 → 整張圖轉幾度 */
  var INK = 0.345;                             /* 中文字面中心在基線上方幾個 em */

  /* 六條主街。給的是**字面中心要落在哪裡**＝路面那條帶的正中央：
     文化路 21~59、大同路 403~441、中華路 541~587、
     平和街 94~124、永樂街 324~354、永安路 455~487。 */
  var STREETS = [
    { cx: 200, cy: 40,  s: '文化路', dir: 'ew' },
    { cx: 200, cy: 422, s: '大同路', dir: 'ew' },
    { cx: 200, cy: 564, s: '中華路', dir: 'ew' },
    { cx: 109, cy: 326, s: '平和街', dir: 'ns' },
    { cx: 339, cy: 326, s: '永樂街', dir: 'ns' },
    { cx: 471, cy: 326, s: '永安路', dir: 'ns' }
  ];
  /* 停車場的代號與色塊中心（使用者指定：P1 壹車房、P2 合廷、P3 永樂站）。 */
  var LOTS = [
    { lot: 'a', tag: 'P3', cx: 235,   cy: 188 },
    { lot: 'b', tag: 'P2', cx: 421.5, cy: 235 },
    { lot: 'c', tag: 'P1', cx: 378,   cy: 507.5 }
  ];
  /* ⚠ 三條路線本來都走 x=344 那一條線（永樂街的中線），三組圓點整段疊在一起
     （使用者：「永樂站和合廷到診所的圓點擠在一起」）。改成三條各走各的：
     336 / 344 / 352（永樂街寬 324~354，三條都在路面裡，間距 8 ＞ 圓點直徑 7），
     終點也錯開成綠塊東側的三個高度，看起來就是三條路各自到門口。 */
  var ROUTES = {
    a: 'M235 165L336 165L336 252L330 252',
    b: 'M410 188L344 188L344 264L330 264',
    c: 'M354 507L352 507L352 276L330 276'
  };
  /* 診所那塊綠色 footprint 的四角 —— 圖釘與「現在位置」都照它轉過去的樣子擺 */
  var PLOT = { x0: 228, y0: 236, x1: 324, y1: 287 };

  var lbl = svg.querySelectorAll('.lbl');
  /* 街名搬到 geo 的最後面 ＝ 畫在點狀路線與色塊之上（配上面那圈描邊才讀得到）。 */
  Array.prototype.forEach.call(lbl, function (t) { geo.appendChild(t); });

  function add(tag, attrs, parent, text) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    (parent || svg).appendChild(el);
    return el;
  }

  /* 「現在位置」：**寫在綠塊裡面**（使用者指定）。兩行兩個字 —— 那塊 footprint
     轉過來只有 51 個單位寬，橫排四個字（68）塞不下。 */
  var you = add('text', { class: 'you', 'text-anchor': 'middle', 'font-size': 17 }, geo);
  var youL1 = add('tspan', {}, you, '現在');
  var youL2 = add('tspan', { dy: 20 }, you, '位置');

  /* 指北針：畫在右上角，**跟著轉**（它要指出北方轉到哪裡去了），
     只有「北」那個字反轉回來保持直立。 */
  var nsw = add('g', { class: 'nsw' }, svg);
  var nswArrow = add('g', {}, nsw);
  add('path', { d: 'M0 -24L7.5 -5H-7.5Z' }, nswArrow);
  /* ⚠ 「北」離箭頭原本 30 個單位，使用者說太遠 —— 收到 12。 */
  var nswTxt = add('text', { x: 0, y: 12, 'text-anchor': 'middle' }, nsw, '北');

  /* ---- 幾何小工具 -------------------------------------------------------- */
  function rot(x, y, th) {
    var r = th * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return { x: CX + (x - CX) * c - (y - CY) * s, y: CY + (x - CX) * s + (y - CY) * c };
  }
  function unrot(x, y, th) { return rot(x, y, -th); }

  /* ---- 排字：單行 ↔ 直排，位置用「字面中心」給 --------------------------- */
  function typeset(t, str, cx, cy, stacked, dyLine, fs) {
    while (t.firstChild) t.removeChild(t.firstChild);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('x', cx);
    t.setAttribute('y', cy);
    var base = INK * fs;                        /* 基線比字面中心低這麼多（直立座標系） */
    if (!stacked) {
      var s0 = document.createElementNS(NS, 'tspan');
      s0.setAttribute('x', cx); s0.setAttribute('dy', base.toFixed(2));
      s0.textContent = str; t.appendChild(s0);
      return;
    }
    var n = str.length, first = base - dyLine * (n - 1) / 2;
    for (var i = 0; i < n; i++) {
      var sp = document.createElementNS(NS, 'tspan');
      sp.setAttribute('x', cx);
      sp.setAttribute('dy', (i === 0 ? first : dyLine).toFixed(2));
      sp.textContent = str.charAt(i);
      t.appendChild(sp);
    }
  }
  function upright(el, th, ax, ay, keep) {
    var base = keep || '';
    if (!th) { if (base) el.setAttribute('transform', base); else el.removeAttribute('transform'); return; }
    el.setAttribute('transform', 'rotate(' + (-th) + ' ' + ax + ' ' + ay + ')' + (base ? ' ' + base : ''));
  }

  var clipRect = svg.querySelector('#clip-round rect');

  function paint() {
    var th = ANG[body.dataset.orient] || 0;
    geo.setAttribute('transform', th ? 'rotate(' + th + ' ' + CX + ' ' + CY + ')' : '');
    /* ⚠⚠ 轉 90 度之後圖變成橫的（620×560），viewBox 與圓角裁切框都要跟著換，
       不然四個角會被切掉（第一版永安路整條不見）。 */
    /* ⚠⚠ viewBox 要照**轉過去之後**的內容重算 —— 沿用 0 0 560 620 的話，
       轉 90 度之後四個角會被切掉（第一版永安路整條不見）；而且整張圖有一半是
       空的街廓，海報上等於浪費紙。做法：把「有內容的範圍」（平和街~永安路、
       文化路~中華路：94~487 × 21~587）四個角轉過去，取外框再各留 8 個單位。 */
    var C = [[94, 21], [487, 21], [487, 587], [94, 587]].map(function (p) { return rot(p[0], p[1], th); });
    var vx0 = Math.min.apply(null, C.map(function (p) { return p.x; })) - 8;
    var vx1 = Math.max.apply(null, C.map(function (p) { return p.x; })) + 8;
    var vy0 = Math.min.apply(null, C.map(function (p) { return p.y; })) - 8;
    var vy1 = Math.max.apply(null, C.map(function (p) { return p.y; })) + 8;
    svg.setAttribute('viewBox', [vx0, vy0, vx1 - vx0, vy1 - vy0].map(function (v) { return v.toFixed(1); }).join(' '));
    if (clipRect) {
      clipRect.setAttribute('x', vx0.toFixed(1));
      clipRect.setAttribute('y', vy0.toFixed(1));
      clipRect.setAttribute('width', (vx1 - vx0).toFixed(1));
      clipRect.setAttribute('height', (vy1 - vy0).toFixed(1));
    }
    var side = Math.abs(th) === 90;

    /* 街名：走向轉了就換排法（|θ|=90 時東西向變成上下向） */
    var flip = side;
    STREETS.forEach(function (st, i) {
      var t = lbl[i]; if (!t) return;
      var fs = parseFloat(getComputedStyle(t).fontSize) || 22;
      typeset(t, st.s, st.cx, st.cy, st.dir === 'ew' ? flip : !flip, fs * 1.18, fs);
      upright(t, th, st.cx, st.cy);
    });

    /* 停車場：色塊正中央寫 P1／P2／P3 */
    LOTS.forEach(function (L) {
      var g = svg.querySelector('.lot[data-lot="' + L.lot + '"]');
      var t = g && g.querySelector('.pk');
      if (!t) return;
      /* ⚠ 「P3」比原本的「P」寬一倍，最小那塊（永樂站 58×34）會被擠到邊或凸出去
         —— 使用者回報的正是這件事。做法：先照色塊的短邊給一個上限，
         再量實際的字寬，超過就再縮。 */
      var box = g.getBBox();
      var fs = Math.min(28, (Math.min(box.width, box.height) - 8) * 0.62);
      t.style.fontSize = fs.toFixed(1) + 'px';
      typeset(t, L.tag, L.cx, L.cy, false, 0, fs);
      var w = t.getBBox().width, room = Math.max(10, Math.min(box.width, box.height) - 10);
      if (w > room) {
        fs = fs * room / w;
        t.style.fontSize = fs.toFixed(1) + 'px';
        typeset(t, L.tag, L.cx, L.cy, false, 0, fs);
      }
      upright(t, th, L.cx, L.cy);
    });

    /* 診所：綠塊跟著轉（那是建築物），圖釘與「現在位置」照**轉過去的矩形**擺。
       ⚠ 兩個位置都先在螢幕座標算好，再反轉回 map 座標當錨點 —— 這樣四個方向
         都會落在綠塊裡面。 */
    var c1 = rot(PLOT.x0, PLOT.y0, th), c2 = rot(PLOT.x1, PLOT.y0, th),
        c3 = rot(PLOT.x1, PLOT.y1, th), c4 = rot(PLOT.x0, PLOT.y1, th);
    var sx0 = Math.min(c1.x, c2.x, c3.x, c4.x), sx1 = Math.max(c1.x, c2.x, c3.x, c4.x);
    var sy0 = Math.min(c1.y, c2.y, c3.y, c4.y), sy1 = Math.max(c1.y, c2.y, c3.y, c4.y);
    var midX = (sx0 + sx1) / 2, H = sy1 - sy0;
    /* 圖釘的尖端：綠塊高度的 40%（原本落在 69%，使用者：「圖釘應該要往上移一點」）
       文字的字面中心：72% —— 兩行字（約 37 高）整個在綠塊裡。 */
    var pinP = unrot(midX, sy0 + H * 0.40, th);
    var youP = unrot(midX, sy0 + H * 0.72, th);
    var pin = svg.querySelector('.cm-pin');
    if (pin) upright(pin, th, pinP.x, pinP.y, 'translate(' + pinP.x.toFixed(2) + ' ' + pinP.y.toFixed(2) + ')');
    var fsY = parseFloat(getComputedStyle(you).fontSize) || 17, gap = 20;
    you.setAttribute('x', youP.x.toFixed(2));
    you.setAttribute('y', youP.y.toFixed(2));
    youL1.setAttribute('x', youP.x.toFixed(2));
    youL1.setAttribute('dy', (INK * fsY - gap / 2).toFixed(2));
    youL2.setAttribute('x', youP.x.toFixed(2));
    youL2.setAttribute('dy', gap);
    upright(you, th, youP.x, youP.y);

    /* 指北針：整組跟著轉，字反轉回來 */
    nsw.setAttribute('transform', 'translate(' + (vx1 - 42).toFixed(1) + ' ' + (vy0 + 46).toFixed(1) + ')' +
      (th ? ' rotate(' + th + ')' : ''));
    upright(nswTxt, th, 0, 12);

    fit();
    measure(th, sx1 - sx0, H);
  }

  /* 地圖在版面裡「盡量大又不溢出」：照 viewBox 的比例和容器的盒子現算。
     ⚠ 不要交給 CSS —— viewBox 會隨轉向重算、紙張又有直橫兩種，
       只寫 max-height 的話 A4 橫會被裁成一條（踩過）。 */
  function fit() {
    var host = fig.parentElement, vb = svg.getAttribute('viewBox').split(' ').map(Number);
    var cs = getComputedStyle(host);
    var w = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h = host.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (!(w > 0 && h > 0)) return;
    var k = Math.min(w / vb[2], h / vb[3]);
    svg.style.width = (vb[2] * k).toFixed(1) + 'px';
    svg.style.height = (vb[3] * k).toFixed(1) + 'px';
  }

  /* ---- 海報化：三條路線各走各的、三個停車場全部亮著、對話框不畫 ---------- */
  function rebuildDots(lot, d) {
    var path = svg.querySelector('.route[data-lot="' + lot + '"]');
    var g = svg.querySelector('.dots[data-lot="' + lot + '"]');
    if (!path || !g) return;
    path.setAttribute('d', d);
    var nums = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number), P = [];
    for (var i = 0; i + 1 < nums.length; i += 2) P.push({ x: nums[i], y: nums[i + 1] });
    while (g.firstChild) g.removeChild(g.firstChild);
    var pts = [P[0]];
    for (var s = 1; s < P.length; s++) {
      var a = P[s - 1], b = P[s];
      var len = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.round(len / 14));
      for (var k = 1; k <= n; k++) pts.push({ x: a.x + (b.x - a.x) * k / n, y: a.y + (b.y - a.y) * k / n });
    }
    pts.forEach(function (pt) {
      add('circle', { cx: pt.x.toFixed(2), cy: pt.y.toFixed(2), r: 3.5 }, g);
    });
  }

  function poster() {
    svg.classList.remove('dim');
    svg.querySelectorAll('.lbl, .lbl-s, .lbl-xs, .ent').forEach(function (l) { l.classList.remove('hide'); });
    svg.querySelectorAll('.dots').forEach(function (d) { d.classList.add('on'); });
    svg.querySelectorAll('.rlab').forEach(function (r) { r.style.display = 'none'; });
    /* 巷名海報上不畫 —— 一轉向就會壓到停車場與路線。 */
    svg.querySelectorAll('.lbl-xs').forEach(function (t) { t.style.display = 'none'; });
    /* 綠塊裡原本那四個字與底線不畫，改成「現在位置」。 */
    ['.cm-nm', '.cm-ul'].forEach(function (sel) {
      var el = svg.querySelector(sel); if (el) el.style.display = 'none';
    });
    svg.querySelectorAll('.ent').forEach(function (e) { e.style.visibility = 'visible'; });
    var blue = body.dataset.lotcolor !== 'grey';
    svg.querySelectorAll('.lot').forEach(function (g) { g.classList.toggle('on', blue); });
    you.style.display = body.dataset.you === 'off' ? 'none' : '';
    Object.keys(ROUTES).forEach(function (k) { rebuildDots(k, ROUTES[k]); });
  }

  function measure(th, w, h) {
    var p = document.getElementById('pvPanel');
    var vb = svg.getAttribute('viewBox').split(' ').map(Number);
    var r = svg.getBoundingClientRect(), k = r.width / vb[2];
    var names = { w: '西（正對診所）', e: '東（站門口往外看）', n: '北', s: '南' };
    var sheet = document.querySelector('.sheet').getBoundingClientRect();
    var yb = you.getBBox(), pl = { w: w, h: h };
    p.innerHTML =
      '朝上：<b>' + names[body.dataset.orient] + '</b>（轉 ' + th + '°）　' +
      '紙張 ' + (body.dataset.size === 'l' ? 'A4 橫' : 'A4 直') +
      '　地圖 1 單位 ＝ ' + k.toFixed(3) + 'px<br>' +
      '綠塊轉過來是 <b>' + pl.w.toFixed(0) + '×' + pl.h.toFixed(0) + '</b> 個單位，' +
      '「現在位置」佔 ' + yb.width.toFixed(0) + '×' + yb.height.toFixed(0) +
      (yb.width < pl.w - 4 && yb.height < pl.h - 4 ? '　<b>整塊在綠色裡</b>' : '　<span style="color:#89202d">超出綠塊</span>') + '<br>' +
      '街名字級 ' + (22 * k).toFixed(1) + 'px、清單那三行 ' + (0.042 * sheet.width).toFixed(1) + 'px';
  }

  document.querySelectorAll('.pv-bar button[data-k]').forEach(function (b) {
    b.addEventListener('click', function () {
      body.dataset[b.dataset.k] = b.dataset.v;
      document.querySelectorAll('.pv-bar button[data-k]').forEach(function (x) {
        x.setAttribute('aria-pressed', String(body.dataset[x.dataset.k] === x.dataset.v));
      });
      poster(); paint();
    });
  });
  ['orient', 'size', 'lotcolor', 'you'].forEach(function (k) {
    var m = new RegExp('[?&]' + (k === 'lotcolor' ? 'lot' : k) + '=([a-z0-9]+)').exec(location.search);
    if (m) body.dataset[k] = m[1];
  });
  document.querySelectorAll('.pv-bar button[data-k]').forEach(function (x) {
    x.setAttribute('aria-pressed', String(body.dataset[x.dataset.k] === x.dataset.v));
  });

  function go() { poster(); paint(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  addEventListener('load', function () { setTimeout(go, 60); });
  addEventListener('resize', go);
  go();
})();
