/* ==========================================================================
   門口那張停車參考圖：轉向 ＋ 海報化（提案用，定案時整段刪掉）
   --------------------------------------------------------------------------
   ⚠ 核心那一招：**父層轉、子層各自轉回來**。
     父：g#geo 整組 rotate(θ, 280, 310)　（街廓、路、停車場色塊、路線、綠塊）
     子：要保持直立的東西各自 rotate(−θ, 自己的錨點)
         —— 父轉 ∘ 子反轉 ＝ 在錨點附近只剩位移，所以字與標記跟著搬到轉過去的
            位置、但不會歪。
   ⚠ 主要街名還要**換一種排法**：路的走向轉了 90 度，直排／橫排要跟著換，
     不然字會沿著路豎著讀。六條主街的中心點與字串寫在下面 STREETS。
   ⚠ 這一頁是靜態海報，所以：三塊停車場全部亮著、對話框整組不畫（改成
     ①②③ 的號碼牌，名稱與距離交給圖底下那張清單），街名不淡出。
   ========================================================================== */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var body = document.body, fig = document.querySelector('.map-fig');
  if (!fig) return;
  var svg = fig.querySelector('.map-svg'), geo = svg.querySelector('#geo');
  var CX = 280, CY = 310;                      /* viewBox 的中心 */
  var ANG = { n: 0, e: -90, w: 90, s: 180 };   /* 哪一邊朝上 → 整張圖轉幾度 */

  /* 六條主街：中心點（＝原本中間那一列的基線）、字串、走向 */
  var STREETS = [
    { cx: 200, cy: 49,  s: '文化路', dir: 'ew' },
    { cx: 200, cy: 431, s: '大同路', dir: 'ew' },
    { cx: 200, cy: 569, s: '中華路', dir: 'ew' },
    { cx: 109, cy: 334, s: '平和街', dir: 'ns' },
    { cx: 339, cy: 334, s: '永樂街', dir: 'ns' },
    { cx: 471, cy: 334, s: '永安路', dir: 'ns' }
  ];
  var LANES = [
    { cx: 176, cy: 232, s: '平和街19巷', dir: 'ew' },
    { cx: 402, cy: 192, s: '永安路14巷', dir: 'ew' }
  ];
  /* 三個停車場的號碼牌：貼在各自色塊的一個角上 */
  var BADGES = [
    { n: '1', x: 206, y: 171 },
    { n: '2', x: 388, y: 197 },
    { n: '3', x: 354, y: 474 }
  ];

  var lbl = svg.querySelectorAll('.lbl');
  var lblXs = svg.querySelectorAll('.lbl-xs');

  /* ---- 一次性：加上「您在這裡」、指北針、號碼牌 ------------------------- */
  function add(tag, attrs, parent, text) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    (parent || svg).appendChild(el);
    return el;
  }
  /* 「您在這裡」：一塊直立的小綠牌，掛在診所綠塊的旁邊。
     ⚠ 要放進 #geo（跟著整張圖轉到對的位置），再各自反轉回來保持直立。
     ⚠ 綠塊裡原本那四個字（.cm-nm）在海報上不畫 —— 整張圖一轉，那塊
       footprint 就變成 51 寬 × 96 高，橫排的「芳仁牙醫」（84 個單位）塞不進去。
       名字在海報抬頭已經有了，圖上只要「您在這裡」。 */
  var you = add('g', { class: 'you' }, geo);
  add('rect', { x: 232, y: 292, width: 88, height: 26, rx: 7, fill: '#3f654a' }, you);
  add('text', { x: 276, y: 310.5, 'text-anchor': 'middle', fill: '#f4f4f5',
                'font-size': 17, 'font-weight': 700, 'letter-spacing': '.06em' }, you, '您在這裡');
  var badges = BADGES.map(function (b) {
    var g = add('g', { class: 'bdg' }, geo);
    add('circle', { cx: b.x, cy: b.y, r: 14, fill: '#365685' }, g);
    add('text', { x: b.x, y: b.y + 6.2, 'text-anchor': 'middle', fill: '#f4f4f5',
                  'font-size': 18, 'font-weight': 700, 'font-family': 'Arial, Helvetica, sans-serif' }, g, b.n);
    g.dataset.x = b.x; g.dataset.y = b.y;
    return g;
  });
  /* 指北針：畫在右上角，**跟著轉**（它要指出北方轉到哪裡去了），
     只有「北」那個字反轉回來保持直立。 */
  var nsw = add('g', { class: 'nsw' }, svg);
  var nswArrow = add('g', {}, nsw);
  add('path', { d: 'M0 -26L7.5 -6H-7.5Z' }, nswArrow);
  add('path', { d: 'M0 -6V14', stroke: 'currentColor', 'stroke-width': 0 }, nswArrow);
  var nswTxt = add('text', { x: 0, y: 30, 'text-anchor': 'middle' }, nsw, '北');
  nsw.setAttribute('transform', 'translate(505 70)');

  /* ---- 排字：單行 ↔ 直排 ------------------------------------------------ */
  function typeset(t, str, cx, cy, stacked, dy) {
    while (t.firstChild) t.removeChild(t.firstChild);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('x', cx);
    if (!stacked) { t.setAttribute('y', cy); t.textContent = str; return; }
    var n = str.length, y0 = cy - dy * (n - 1) / 2;
    t.setAttribute('y', y0);
    for (var i = 0; i < n; i++) {
      var s = document.createElementNS(NS, 'tspan');
      s.setAttribute('x', cx);
      if (i) s.setAttribute('dy', dy);
      s.textContent = str.charAt(i);
      t.appendChild(s);
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
    /* ⚠⚠ 轉 90 度之後圖變成「橫的」（620 寬 × 560 高），viewBox 與圓角裁切框
       都要跟著換一組，不然四個角會被切掉（第一版就是這樣，永安路整條不見）。
       轉完的內容佔 x −30~590、y 30~590（繞 (280,310) 轉的結果）。 */
    var side = Math.abs(th) === 90;
    svg.setAttribute('viewBox', side ? '-30 30 620 560' : '0 0 560 620');
    if (clipRect) {
      clipRect.setAttribute('x', side ? -30 : 0);
      clipRect.setAttribute('y', side ? 30 : 0);
      clipRect.setAttribute('width', side ? 620 : 560);
      clipRect.setAttribute('height', side ? 560 : 620);
    }

    /* 街名：走向轉了就換排法（|θ|=90 的時候東西向變成上下向） */
    var flip = Math.abs(th) === 90;
    STREETS.forEach(function (st, i) {
      var t = lbl[i]; if (!t) return;
      var vertical = st.dir === 'ew' ? flip : !flip;
      typeset(t, st.s, st.cx, st.cy, vertical, 26);
      upright(t, th, st.cx, st.cy);
    });
    /* ⚠ LANES 留著沒有用到 —— 巷名在海報上是關掉的（見 poster()）。
       日後要放回來就把 poster() 那一行拿掉、這裡照 STREETS 那樣排一次。 */

    /* 停車場的 P、號碼牌、「您在這裡」：直立 */
    svg.querySelectorAll('.pk').forEach(function (t) {
      upright(t, th, +t.getAttribute('x'), +t.getAttribute('y'));
    });
    badges.forEach(function (g) { upright(g, th, +g.dataset.x, +g.dataset.y); });
    upright(you, th, 276, 305);

    /* 診所：綠塊跟著轉（那是建築物的footprint），字、底線、圖釘直立 */
    var nm = svg.querySelector('.cm-nm'), ul = svg.querySelector('.cm-ul'), pin = svg.querySelector('.cm-pin');
    if (nm) upright(nm, th, 276, 268.5);
    if (ul) upright(ul, th, 276, 268.5);
    if (pin) upright(pin, th, 294, 245, 'translate(294 245)');

    /* 指北針：整組跟著轉，字反轉回來 */
    nsw.setAttribute('transform', 'translate(505 70)' + (th ? ' rotate(' + th + ')' : ''));
    upright(nswTxt, th, 0, 30);

    measure(th);
  }

  /* ---- 海報化：三個停車場全部亮著、對話框不畫 ---------------------------- */
  function poster() {
    svg.classList.remove('dim');
    svg.querySelectorAll('.lbl, .lbl-s, .lbl-xs, .ent').forEach(function (l) { l.classList.remove('hide'); });
    svg.querySelectorAll('.dots').forEach(function (d) { d.classList.add('on'); });
    svg.querySelectorAll('.rlab').forEach(function (r) { r.style.display = 'none'; });
    /* 巷名（平和街19巷／永安路14巷）海報上不畫 —— 一轉向就會壓到停車場與路線，
       而且門口這張圖只要「哪一條路、哪一個停車場」。 */
    svg.querySelectorAll('.lbl-xs').forEach(function (t) { t.style.display = 'none'; });
    /* 綠塊裡那四個字與底線不畫，改由旁邊那塊「您在這裡」講（見上面）。 */
    ['.cm-nm', '.cm-ul'].forEach(function (sel) {
      var el = svg.querySelector(sel); if (el) el.style.display = 'none';
    });
    svg.querySelectorAll('.ent').forEach(function (e) { e.style.visibility = 'visible'; });
    var blue = body.dataset.lotcolor !== 'grey';
    svg.querySelectorAll('.lot').forEach(function (g) { g.classList.toggle('on', blue); });
    you.style.display = body.dataset.you === 'off' ? 'none' : '';
  }

  function measure(th) {
    var p = document.getElementById('pvPanel');
    var r = svg.getBoundingClientRect(), k = r.width / 560;
    var names = { w: '西（正對診所）', e: '東（站門口往外看）', n: '北', s: '南' };
    var sheet = document.querySelector('.sheet').getBoundingClientRect();
    p.innerHTML =
      '朝上的方向：<b>' + names[body.dataset.orient] + '</b>（整張圖轉 ' + th + '°）<br>' +
      '紙張 ' + (body.dataset.size === 'l' ? 'A4 橫' : 'A4 直') +
      '　螢幕上 ' + sheet.width.toFixed(0) + '×' + sheet.height.toFixed(0) + 'px' +
      '　地圖 1 個單位 ＝ ' + k.toFixed(3) + 'px<br>' +
      '街名字級 ' + (22 * k).toFixed(1) + 'px、清單那三行 ' + (0.042 * sheet.width).toFixed(1) + 'px' +
      '（A4 實寬 210mm 時 ≈ ' + (0.042 * 210).toFixed(1) + 'mm 高的字）';
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
  document.querySelectorAll('.pv-bar button[data-k]').forEach(function (x) {
    x.setAttribute('aria-pressed', String(body.dataset[x.dataset.k] === x.dataset.v));
  });

  /* 網址參數 */
  ['orient', 'size', 'lotcolor', 'you'].forEach(function (k) {
    var m = new RegExp('[?&]' + (k === 'lotcolor' ? 'lot' : k) + '=([a-z0-9]+)').exec(location.search);
    if (m) body.dataset[k] = m[1];
  });

  function go() { poster(); paint(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  addEventListener('load', function () { setTimeout(go, 60); });
  go();
})();
