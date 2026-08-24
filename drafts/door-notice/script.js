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
    /* ⚠ 永樂街的字原本在 y 326（街的正中間），正好壓在那條點狀路線上
       （使用者：「永樂街的文字擋在路線圓點上，移到右邊去」）。路線在 y 165~507，
       所以往北挪到 118 —— 那一段是文化路到 P3 岔路之間，一顆點都沒有。
       ⚠ 「右邊」是**轉過去之後**的右邊：轉 90° 時螢幕 x ＝ −map y，
         所以 y 變小就是往右。 */
    { cx: 339, cy: 118, s: '永樂街', dir: 'ns' },
    { cx: 471, cy: 326, s: '永安路', dir: 'ns' }
  ];
  /* 巷名。⚠ 給的一樣是「字面中心要落在哪裡」：19 巷那條帶是 y 219~236，中心 227.5。 */
  var LANES = [
    { cx: 176, cy: 227.5, s: '平和街19巷', dir: 'ew' },
    { cx: 402, cy: 188,   s: '永安路14巷', dir: 'ew', off: true }
  ];
  var lblXs = svg.querySelectorAll('.lbl-xs');
  /* 停車場的代號與色塊中心（使用者指定：P1 壹車房、P2 合廷、P3 永樂站）。 */
  var LOTS = [
    { lot: 'a', tag: 'P3', cx: 235,   cy: 188 },
    { lot: 'b', tag: 'P2', cx: 421.5, cy: 235 },
    { lot: 'c', tag: 'P1', cx: 378,   cy: 507.5 }
  ];
  /* 路線。⚠⚠ 第二輪把三條拆成三條並行（336／344／352），使用者回報「更混亂了，
     原來那個比較好，只是圓點有點重複」。所以第三輪**回到同一條中線**，改成
     把三條路線的**線段聯集**只畫一次：永樂街上那一段從最北的入口一路畫到最南，
     三個岔口各自一小段，交會處靠「離已經放好的點太近就不放」把重複的圓點濾掉。 */
  var ROUTE_SEGS = [
    [[344, 165], [344, 507]],   /* 永樂街上的共同路段：一次畫完 */
    [[344, 261], [330, 261]],   /* 轉進診所門口 */
    [[235, 165], [344, 165]],   /* P3 斗六永樂站 → 永樂街 */
    [[410, 188], [344, 188]],   /* P2 合廷 → 永樂街 */
    [[354, 507], [344, 507]]    /* P1 壹車房 → 永樂街 */
  ];
  var DOT_GAP = 14, DOT_MIN = 9;   /* 間距／兩點之間至少要離多遠（濾掉交會處的重複） */
  /* 圖釘的幾何（index.html 那顆定案的值）：頭的半徑與圓心離尖端多遠。
     ⚠ 用它算「頭要整顆浮在綠塊外面」的位置 —— 尖端放在綠塊上緣往下 (d − R)
       的地方，頭的下緣就正好貼著上緣。 */
  var PIN = { R: 24.48, d: 37.94 };

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

  /* 指北針（2026-08-21 使用者給了參考圖）：**細長的三角形，右半實心、左半空心**，
     字在上面、而且是「北」不是 N。
     ⚠⚠ 走過兩次極端，兩次都被退回：
       第一版 1:2（寬 28 高 56）——「太大了 而且比例不對 也不夠精緻」
       第二版 1:4（寬 10 高 40）——「圖案本身太細長 好奇怪 我給你的圖不是這樣」
     所以**寬高比改成一條尺**（NS_W 那四格，針長固定 38、只換半寬），
     讓使用者自己指一格，不要再由我猜。網址 ?ns=a|b|c|d。
     ⚠ 「太大」與「太細」是兩件事，一次只動一件 —— 混在一起改的那一輪
       直接從一個極端跳到另一個極端。 */
  /* ⚠⚠ 第四輪把比例定下來了（使用者：「胖還勉強可以 但太長」→ 針長 29、
     半寬 7.3 ＝ **1:2.0**）。第五輪他說「指北針和北可以再大一點」，所以那條尺
     從「只量針長」改成**整組的大小**：半寬、字級、字距全部按 29 那一組
     等比例算出來 —— **比例因此鎖死在 1:2.0**，不會又跑回「太長」或「太胖」。
     ⚠ 針長一改缺口也跟著按比例縮，不然底下那兩隻腳會變成兩根刺。 */
  var LANE_FS = 12.5;                                /* 巷名字級（站上是 16） */
  var NS_H = { a: 42, b: 36, c: 31, d: 26 };         /* 整組大小（＝針長），比例固定 */
  /* 胖瘦是**另一條尺**（?nw=a|b|c|d），值是「半寬 ÷ 針長」＝ 1÷(2×比例)。
     ⚠ 大小與胖瘦刻意分成兩條尺 —— 早期把兩件混在一起改，一次就從
       「太大」跳到「太細」。字級與字距只跟著**大小**走，不跟胖瘦。 */
  var NS_W_R = { a: 1 / 2.6, b: 1 / 3.0, c: 0.2889, d: 0.25 };  /* 比例 1:1.3／1.5／1.73／2.0 */
  /* 「北」的字級是**針長的倍數**（跟著大小走，不跟胖瘦）。
     0.4138 ＝ 一開始那組 12/29；使用者兩次說「北再大一點」，加到 0.52
     （36 的針長 → 18.7px，比街名 16 略大一點點，遠一點也讀得到）。 */
  var NS_R = { fs: 0.52, gap: 15 / 29 };
  var NSW = { w: 7.3, fs: 12, gap: 15 };             /* 由 nsGeom() 現算 */
  var nswA = 0, nswB = 0, nswN = 0;                   /* 尖端 y／底邊 y／缺口頂點 y，paint() 現算 */
  function nsGeom() {
    var h = NS_H[body.dataset.ns] || NS_H.b;
    nswA = -h * 0.75; nswB = h * 0.25; nswN = nswB - h * 0.22;
    NSW.w = h * (NS_W_R[body.dataset.nw] || NS_W_R.c);
    NSW.fs = h * NS_R.fs; NSW.gap = h * NS_R.gap;
    if (nswTxt) {
      nswTxt.setAttribute('font-size', NSW.fs.toFixed(2));
      nswTxt.setAttribute('dy', (INK * NSW.fs).toFixed(2));
    }
  }
  var nswTxt = null;
  nsGeom();
  var nswTy = nswA;                                   /* 字的錨點：**和尖端同一個水平** */
  var nsw = add('g', { class: 'nsw' }, svg);
  var nswArrow = add('g', {}, nsw);
  var nswSolid = add('path', { class: 'nsw-solid' }, nswArrow);
  /* ⚠⚠ 空心那半**不能用一般的描邊**（使用者：「針尖好像不是很乾淨的角形結束，
     還稍微往下拉長了一絲絲」）。原因：描邊是**跨在路徑上**的，往外長半個線寬，
     所以空心那半的外緣比實心那半寬 0.55 個單位，兩半在尖端接不起來；
     而且尖端的夾角很銳，miter 會從那一點再戳出一根長刺（那一絲絲就是它）。
     改用**內描邊**：線寬開兩倍、再用同一條路徑當 clip 把外側那一半切掉 ——
     外緣因此和實心那半逐點相同，尖端收成乾淨的一點。
     ⚠ linejoin 改回 round 也沒用，那只是把刺磨圓，外緣還是寬 0.55。 */
  var nswClipId = 'nsw-clip';
  var nswClip = add('clipPath', { id: nswClipId },
    svg.querySelector('defs') || add('defs', {}, svg));
  var nswClipPath = add('path', {}, nswClip);
  var nswHollow = add('path', { class: 'nsw-hollow', 'clip-path': 'url(#' + nswClipId + ')' }, nswArrow);
  /* ⚠ 「北」要和尖端**同一個水平**（使用者指定），所以錨點就放在尖端那條線上、
     再沿著針的方向往外推 NSW.gap。⚠⚠ 中文的字面中心在基線上方 0.345em，
     光把錨點對齊還是會看起來偏高 —— dy 那一項就是把它壓回來（同街名那一套）。 */
  nswTxt = add('text', { x: 0, y: nswTy, 'text-anchor': 'middle',
    'font-size': NSW.fs.toFixed(2), dy: (INK * NSW.fs).toFixed(2) }, nsw, '北');

  /* ---- 幾何小工具 -------------------------------------------------------- */
  function rot(x, y, th) {
    var r = th * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return { x: CX + (x - CX) * c - (y - CY) * s, y: CY + (x - CX) * s + (y - CY) * c };
  }
  function unrot(x, y, th) { return rot(x, y, -th); }
  /* 繞原點轉（指北針那一組是相對自己的原點量的，不繞地圖中心） */
  function orot(x, y, th) {
    var r = th * Math.PI / 180, c = Math.cos(r), s2 = Math.sin(r);
    return { x: x * c - y * s2, y: x * s2 + y * c };
  }

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
    /* ⚠⚠ 直排是一個字一行，但**數字與拉丁字母要黏成一個單位** ——
       「平和街19巷」拆成六行的話 1 和 9 會被斷開（使用者回報）。
       所以先切成「詞」：連續的 0-9／A-Z／a-z 算一個，其餘一個字一個。 */
    var U = str.match(/[0-9A-Za-z]+|[\s\S]/g) || [];
    var n = U.length, first = base - dyLine * (n - 1) / 2;
    for (var i = 0; i < n; i++) {
      var sp = document.createElementNS(NS, 'tspan');
      sp.setAttribute('x', cx);
      sp.setAttribute('dy', (i === 0 ? first : dyLine).toFixed(2));
      sp.textContent = U[i];
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
    var mx0 = Math.min.apply(null, C.map(function (p) { return p.x; })) - 8;
    var mx1 = Math.max.apply(null, C.map(function (p) { return p.x; })) + 8;
    var my0 = Math.min.apply(null, C.map(function (p) { return p.y; })) - 8;
    var my1 = Math.max.apply(null, C.map(function (p) { return p.y; })) + 8;
    /* m* ＝ 街廓自己的外框（裁切框吃這一組）；v* ＝ 整張圖的外框，
       底下指北針那一段會把 vy0 再往上開一條帶子出去。 */
    var vx0 = mx0, vx1 = mx1, vy0 = my0, vy1 = my1;
    svg.setAttribute('viewBox', [vx0, vy0, vx1 - vx0, vy1 - vy0].map(function (v) { return v.toFixed(1); }).join(' '));
    if (clipRect) {
      clipRect.setAttribute('x', mx0.toFixed(1));
      clipRect.setAttribute('y', my0.toFixed(1));
      clipRect.setAttribute('width', (mx1 - mx0).toFixed(1));
      clipRect.setAttribute('height', (my1 - my0).toFixed(1));
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

    /* 巷名：只留「平和街19巷」（2026-08-21 使用者指定要標）。
       ⚠ 它是診所那一格的北緣，看的人靠它確認自己在哪一格。
       永安路14巷沒有留 —— 那一條和三個停車場、路線都無關，標了只是雜訊。 */
    LANES.forEach(function (st, i) {
      var t = lblXs[i]; if (!t || st.off) return;
      /* ⚠ 巷名比街名小兩階（使用者：「整個巷名的字級再小一點」）——
         它是輔助資訊，和街名一樣大會搶戲。站上是 16，海報上收成 12.5。 */
      var fs = LANE_FS;
      t.style.fontSize = fs + 'px';
      typeset(t, st.s, st.cx, st.cy, st.dir === 'ew' ? flip : !flip, fs * 1.18, fs);
      upright(t, th, st.cx, st.cy);
    });

    /* 停車場：色塊正中央寫 P1／P2／P3 */
    LOTS.forEach(function (L) {
      var g = svg.querySelector('.lot[data-lot="' + L.lot + '"]');
      var t = g && g.querySelector('.pk');
      if (!t) return;
      /* ⚠ 色塊轉過去之後長寬會對調，所以要拿**轉過去的螢幕矩形**來量 ——
         字是直立的，寬度要看螢幕的寬、高度看螢幕的高。
         ⚠ 「P3」那一塊只有 58×34，第二輪照短邊給字級、又留著站上那圈
         1.6 的描邊，看起來又粗又快擠出去（使用者回報）。
         ⚠⚠ 第三輪把描邊整個關掉 ＋ 字重 400，使用者：「改過之後太細了，
         把字變小一點 稍微加粗」—— 現在是**字級照短邊的 40%**（原本 46%、
         上限 26 → 23），加粗那半格回到描邊：**0.8**（站上是 1.6，這裡取一半）。
         ⚠ 加粗只能靠描邊，Arial 只有 Regular／Bold 兩支，400 與 700 中間
         沒有東西 —— 那正是上一輪一放手就掉到「太細」的原因。 */
      var b = g.getBBox();
      var C = [[b.x, b.y], [b.x + b.width, b.y], [b.x + b.width, b.y + b.height], [b.x, b.y + b.height]]
        .map(function (p) { return rot(p[0], p[1], th); });
      var bw = Math.max.apply(null, C.map(function (p) { return p.x; })) - Math.min.apply(null, C.map(function (p) { return p.x; }));
      var bh = Math.max.apply(null, C.map(function (p) { return p.y; })) - Math.min.apply(null, C.map(function (p) { return p.y; }));
      var fs = Math.min(23, Math.min(bw, bh) * 0.40);
      t.style.fontSize = fs.toFixed(1) + 'px';
      typeset(t, L.tag, L.cx, L.cy, false, 0, fs);
      var w = t.getBBox().width, room = bw - 12;
      if (w > room) {
        fs = fs * room / w;
        t.style.fontSize = fs.toFixed(1) + 'px';
        typeset(t, L.tag, L.cx, L.cy, false, 0, fs);
      }
      upright(t, th, L.cx, L.cy);
      L.fs = fs; L.bw = bw; L.bh = bh; L.w = t.getBBox().width;
    });

    /* 診所：綠塊跟著轉（那是建築物），圖釘與「現在位置」照**轉過去的矩形**擺。
       ⚠ 兩個位置都先在螢幕座標算好，再反轉回 map 座標當錨點 —— 這樣四個方向
         都會落在綠塊裡面。 */
    var c1 = rot(PLOT.x0, PLOT.y0, th), c2 = rot(PLOT.x1, PLOT.y0, th),
        c3 = rot(PLOT.x1, PLOT.y1, th), c4 = rot(PLOT.x0, PLOT.y1, th);
    var sx0 = Math.min(c1.x, c2.x, c3.x, c4.x), sx1 = Math.max(c1.x, c2.x, c3.x, c4.x);
    var sy0 = Math.min(c1.y, c2.y, c3.y, c4.y), sy1 = Math.max(c1.y, c2.y, c3.y, c4.y);
    var midX = (sx0 + sx1) / 2, H = sy1 - sy0;
    /* ⚠⚠ 圖釘的尖端放在綠塊上緣**往下 (d − R) ＝ 13.5 個單位**的地方 ——
       這樣頭的下緣正好貼著綠塊上緣、整顆圓浮在綠色外面。
       第二輪放在高度的 40%（96 高 → 38），圓還埋在綠塊裡，使用者：
       「那個圓形還在框框裡面，人家看不太出來」。
       文字的字面中心跟著往上到 55%（原本 72%，貼著下緣）。 */
    var pinP = unrot(midX, sy0 + (PIN.d - PIN.R), th);
    var youP = unrot(midX, sy0 + H * 0.55, th);
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

    /* 指北針：整組跟著轉（它要指出北方轉到哪去了），只有「北」那個字反轉回來。
       ⚠⚠ **它不可以壓在路上**（使用者指定）—— 所以不是塞進地圖的角落，
         而是**在地圖上面另外開一條帶子**：viewBox 的上緣往外推，
         指北針站在那條帶子裡，靠右對齊街廓的右緣。
       ⚠⚠ 擺的位置要照「轉過去之後」的外框算，不能寫死一個角落的座標 ——
         轉 90 度時箭頭的尖端會從上面跑到右邊，「北」那個字跟著跑出畫布外。 */
    nsGeom();
    var nsWw = NSW.w;
    nswSolid.setAttribute('d', 'M0 ' + nswA + 'L' + nsWw + ' ' + nswB + 'L0 ' + nswN + 'Z');
    var dH = 'M0 ' + nswA + 'L0 ' + nswN + 'L' + (-nsWw) + ' ' + nswB + 'Z';
    nswHollow.setAttribute('d', dH);
    nswClipPath.setAttribute('d', dH);
    /* 字沿著針的方向往外推：轉之前是「尖端再往上 gap」，轉了就跟著走。 */
    var nsTip = orot(0, nswA, th), nsTx = orot(0, nswA - NSW.gap, th);
    var nsA = [[0, nswA], [nsWw, nswB], [0, nswN], [-nsWw, nswB]]
      .map(function (q) { return orot(q[0], q[1], th); });
    var nx0 = Math.min.apply(null, nsA.map(function (q) { return q.x; }));
    var nx1 = Math.max.apply(null, nsA.map(function (q) { return q.x; }));
    var ny0 = Math.min.apply(null, nsA.map(function (q) { return q.y; }));
    var ny1 = Math.max.apply(null, nsA.map(function (q) { return q.y; }));
    nx0 = Math.min(nx0, nsTx.x - NSW.fs / 2 - 1); nx1 = Math.max(nx1, nsTx.x + NSW.fs / 2 + 1);
    ny0 = Math.min(ny0, nsTx.y - NSW.fs / 2 - 1); ny1 = Math.max(ny1, nsTx.y + NSW.fs / 2 + 1);
    /* ⚠ 第五輪使用者：「位置可以往左上移一點」—— 往左 20、往上 14
       （原本右緣貼齊街廓、下緣只離街廓 4）。 */
    var nsTop = my0 - 18;                             /* 帶子的下緣：離街廓 18 個單位 */
    var nsx = mx1 - nx1 - 20, nsy = nsTop - ny1;
    nsw.setAttribute('transform', 'translate(' + nsx.toFixed(1) + ' ' + nsy.toFixed(1) + ')' +
      (th ? ' rotate(' + th + ')' : ''));
    nswTxt.setAttribute('x', 0); nswTxt.setAttribute('y', nswA - NSW.gap);
    upright(nswTxt, th, 0, nswA - NSW.gap);
    /* viewBox 的上緣往外開到帶子上面（留 6）。⚠ 裁切框不跟著開 ——
       那是地圖自己的圓角，開上去會多一塊空白的圓角。 */
    vy0 = Math.min(vy0, nsy + ny0 - 6);
    svg.setAttribute('viewBox', [vx0, vy0, vx1 - vx0, vy1 - vy0]
      .map(function (v) { return v.toFixed(1); }).join(' '));

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
  function rebuildDots() {
    var keep = [], a = svg.querySelector('.dots[data-lot="a"]');
    ['a', 'b', 'c'].forEach(function (k) {
      var g = svg.querySelector('.dots[data-lot="' + k + '"]');
      if (g) while (g.firstChild) g.removeChild(g.firstChild);
      var r = svg.querySelector('.route[data-lot="' + k + '"]');
      if (r) r.setAttribute('d', 'M0 0');            /* 路線本身不畫，只是幾何來源 */
    });
    ROUTE_SEGS.forEach(function (seg) {
      var p0 = seg[0], p1 = seg[1];
      var len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      var n = Math.max(1, Math.round(len / DOT_GAP));
      for (var i = 0; i <= n; i++) {
        var x = p0[0] + (p1[0] - p0[0]) * i / n, y = p0[1] + (p1[1] - p0[1]) * i / n;
        /* ⚠ 交會處會有兩段各放一顆，靠這一條濾掉 —— 這就是使用者說的
           「圓點有點重複」。 */
        var tooClose = keep.some(function (q) { return Math.hypot(q[0] - x, q[1] - y) < DOT_MIN; });
        if (!tooClose) keep.push([x, y]);
      }
    });
    keep.forEach(function (q) {
      add('circle', { cx: q[0].toFixed(2), cy: q[1].toFixed(2), r: 3.5 }, a);
    });
  }

  function poster() {
    svg.classList.remove('dim');
    svg.querySelectorAll('.lbl, .lbl-s, .lbl-xs, .ent').forEach(function (l) { l.classList.remove('hide'); });
    svg.querySelectorAll('.dots').forEach(function (d) { d.classList.add('on'); });
    svg.querySelectorAll('.rlab').forEach(function (r) { r.style.display = 'none'; });
    /* 巷名只留「平和街19巷」（見上面 LANES 那一段）。 */
    Array.prototype.forEach.call(lblXs, function (t, i) {
      t.style.display = (LANES[i] && LANES[i].off) ? 'none' : '';
    });
    /* ⚠ P3（斗六永樂站）不畫入口箭頭 —— 使用者指定；那一場從巷子進去只有一條路，
       站上那段註解本來就寫著「一看就知道，不需要標示」。 */
    svg.querySelectorAll('.ent').forEach(function (e) { e.style.visibility = 'visible'; });
    var entA = svg.querySelector('.lot[data-lot="a"] .ent');
    if (entA) entA.style.visibility = 'hidden';
    /* 綠塊裡原本那四個字與底線不畫，改成「現在位置」。 */
    ['.cm-nm', '.cm-ul'].forEach(function (sel) {
      var el = svg.querySelector(sel); if (el) el.style.display = 'none';
    });
    var blue = body.dataset.lotcolor !== 'grey';
    svg.querySelectorAll('.lot').forEach(function (g) { g.classList.toggle('on', blue); });
    you.style.display = body.dataset.you === 'off' ? 'none' : '';
    rebuildDots();
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
      '街名字級 ' + (22 * k).toFixed(1) + 'px　停車場代號：' +
      LOTS.map(function (L) {
        return L.tag + ' ' + (L.fs || 0).toFixed(1) + 'px（色塊 ' + (L.bw || 0).toFixed(0) + '×' +
               (L.bh || 0).toFixed(0) + '，字寬 ' + (L.w || 0).toFixed(0) + '，兩邊各留 ' +
               (((L.bw || 0) - (L.w || 0)) / 2).toFixed(0) + '）';
      }).join('、');
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
  ['orient', 'size', 'lotcolor', 'you', 'ns', 'nw', 'qr'].forEach(function (k) {
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
