/* ==========================================================================
   點擊紀錄 —— 前端這一側（2026-09-20）
   --------------------------------------------------------------------------
   起因（使用者）：「能記錄網站上的按鈕或超連結點擊次數嗎」→「我覺得都要記」。
   資料那一側在 src/click.js，報告在 /admin/search/ 的第二個分頁。

   ── 四件刻意的設計 ──────────────────────────────────────────────────────
   ① **站上的標記一個字都沒有改。** 一般的做法是在每一顆上加 data-click="…"，
      但這一站有十六篇文章頁，而那些連結（科別標記、上下篇）在 <main> 裡面——
      動到 <main> 就會動到內容雜湊，十六篇的「最後更新」會一起跳成當天，
      而那一行 2026-09-20 起**讀者看得到**（CLAUDE.md 第五節那個陷阱）。
      為了記點擊而讓十六篇印出一個假的更新日，划不來。
      所以代碼一律從**既有的 class 與 href** 推出來，見下面那張 RULES。
      ⚠ 代價：版面改了 class，這裡要跟著改，不然那一顆就靜靜地不再被記。
        守門是 tools/click-test.mjs——它會真的在瀏覽器裡把每一顆按一次。
   ② **用 sendBeacon 不用 fetch。** 最值錢的那幾顆（打電話、開導航、文章卡）
      按下去頁面就離開了，fetch 常常還沒送出就被中止。
      ⚠ beacon 送出去的 Content-Type 是 text/plain，Worker 那邊因此
        不能用 request.json()（同 assets/search-log.js）。
   ③ **API 的位置從這支腳本自己的網址推**，不寫死 '/api/click'：
      舊站 yclee86.github.io/fangren-dental/ 還活著，根目錄絕對路徑在那邊
      會打到 github.com 的根目錄去（同 head-search.js 那條註解）。
      這支在 assets/ 底下，把 '/assets/click-log.js' 換成 '/api/click' 就對了，
      首頁、文章頁、著陸頁三種深度都不必各算一次。
   ④ **一次點擊送一筆，不累積。** 累積的話「按下去就離開」那幾顆會整批不見，
      而那正是最該記的幾顆。

   ── 不記什麼 ────────────────────────────────────────────────────────────
   不記 IP、不記 User-Agent、不發 cookie、不產生任何能串起同一個人的識別碼。
   送出去的就是「哪一顆、在哪一頁」兩個字串，其餘（時間）由 Worker 補。
   ⚠ 連「這次瀏覽的流水號」都沒有，所以這一份報告上看不出「同一個人先看了什麼
     再打電話」——理由在 src/search.js 的檔頭。
   ⚠ 2026-09-26 起「先看了什麼再打電話」改由**訪客軌跡**那一條另外記
     （assets/path-log.js，另一個資料庫），它接這一支丟出來的 fangren:click 事件。
     這一支本身沒有變：送出去的仍然只有兩個字串。
   ========================================================================== */
(function () {
  var me = document.currentScript;
  var api = me && me.src
    ? me.src.replace(/[?#].*$/, '').replace(/\/assets\/click-log\.js$/, '/api/click')
    : '/api/click';
  if (api.indexOf('/api/click') < 0) return;      /* 檔名被改過就不要亂送 */

  /* 從哪一頁按的。七科著陸頁的 <body> 有 data-topic；文章頁與首頁靠
     計數器那個掛勾（data-views-self ＝ 'home' 或該篇的 slug）。
     ⚠ 兩者都取不到就整支不掛（例如提案頁的快照），寧可不記也不要記錯。 */
  var scope = (function () {
    var t = document.body.getAttribute('data-topic');
    if (t) return 'topic:' + t;
    var el = document.querySelector('[data-views-self]');
    var s = el && el.getAttribute('data-views-self');
    if (!s) return null;
    return s === 'home' ? 'home' : 'post:' + s;
  })();
  if (!scope) return;

  /* 連結網址的最後一段 ＝ 文章的 slug。
     '../crown-materials/'、'posts/bass-brushing/'、'../../posts/x/' 都對得到。 */
  function slug(el) {
    var h = el.getAttribute('href') || '';
    var p = h.split('#')[0].split('?')[0].replace(/\/+$/, '');
    var parts = p.split('/');
    return parts[parts.length - 1] || '';
  }
  /* 錨點連結的目的地：'#topics' → 'topics'、'../../#clinic' → 'clinic'。 */
  function hash(el) {
    var h = el.getAttribute('href') || '';
    var i = h.indexOf('#');
    return i < 0 ? '' : h.slice(i + 1);
  }
  function lot(el) {
    var g = el.closest ? el.closest('[data-lot]') : null;
    return g ? g.getAttribute('data-lot') : '';
  }

  /* --------------------------------------------------------------------
     規則表 —— 由上往下比，**第一條對上的就算**，所以順序有意義：
     窄的（.nav-q）一定要排在寬的（.site-nav a）前面，不然放大鏡會被
     記成「頁首選單」。

     ⚠ 這張表和 src/click.js 的白名單是一組的：這裡多一種代碼，
       那邊的 FLAT／normCode 要一起加，不然送出去會被當成偽造的丟掉。
     -------------------------------------------------------------------- */
  var RULES = [
    /* ---- 離站：使用者真的採取行動的那三件 ---- */
    ['a[href^="tel:"]',                 'tel'],
    ['a[href*="line.me"]',              'line'],
    ['.rl-link',    function (el) { return 'park:' + lot(el); }],   /* 停車場的名字 */
    ['.lot[data-lot]', function (el) { return 'lot:' + el.getAttribute('data-lot'); }],
    ['.cm-link',                        'map:pin'],                 /* 地圖上的診所 */
    ['a[href*="google.com/maps"]',      'map:clinic'],              /* 地址那一行 */
    ['.doc-fb[data-doc]', function (el) { return 'fb:' + el.getAttribute('data-doc'); }], /* 醫師卡上的臉書粉專 */

    /* ---- 頁首與頁尾 ---- */
    ['.skip-link',                      'skip'],
    ['.brand',                          'brand'],
    ['.nav-q',                          'search-open'],
    ['.hs-x',                           'search-close'],
    ['.site-nav a', function (el) { return 'nav:' + hash(el); }],
    ['.foot-nav a', function (el) { return 'foot:' + hash(el); }],

    /* ---- 主題與科別、門診表、地圖 ---- */
    ['.chips a[data-spec]',          function (el) { return 'chip:' + el.getAttribute('data-spec'); }],
    ['.hours-filter button[data-spec]', function (el) { return 'hours:' + el.getAttribute('data-spec'); }],
    ['.bay-chip',                       'bays'],
    ['.tp-count a', function (el) { return 'count:' + hash(el); }],

    /* ---- 文章 ---- */
    ['a.card',           function (el) { return 'card:' + slug(el); }],
    ['.rel-card a',      function (el) { return 'rel:'  + slug(el); }],
    ['.post-tag',        function (el) { return 'tag:'  + el.getAttribute('data-spec'); }],
    /* 「這一科的醫師」（2026-09-25）：頂端那一句、右下角那一顆、那一塊裡的每一位 */
    ['.pd-peek',                        'doc-peek'],
    ['.pd-btt',                         'doc-btn'],
    ['.pd-go',   function (el) { return 'doc:' + hash(el).replace(/^doc-/, ''); }],
    /* 醫師卡「專長」的小框（2026-09-26）：打開記是哪一位醫師、點標題記是哪一篇。
       ⚠ .sk-go 是 assets/doctor-skills.js 開頁時加上的，那一支沒跑的話這一條就不會命中 */
    ['.sk-pop-a', function (el) { return 'sk-post:' + slug(el); }],
    ['.sk-go', function (el) {
      var d = el.closest('.doc');
      return 'sk:' + (d && d.id ? d.id.replace(/^doc-/, '') : '');
    }],
    ['.post-nav a', function (el) {
      var t = el.textContent || '';
      if (t.indexOf('上一篇') >= 0) return 'prev:' + slug(el);
      if (t.indexOf('下一篇') >= 0) return 'next:' + slug(el);
      return 'back-list';                      /* 第一篇與最後一篇的那一顆 */
    }],

    /* ---- 其他 ---- */
    ['.hero-cue',                       'hero-cue'],
    ['.btt',                            'btt'],
    /* ⚠⚠ 夜間開關記的是**切過去之後**的那一邊，而這一支跑在**捕獲階段**
       （見底下那一段），也就是 theme.js 還沒翻面的時候——所以這裡要自己算
       「等一下會變成哪一邊」，不能直接讀 data-theme（那樣每一筆都差一拍，
       而且畫面上完全看不出來）。翻面的規則抄自 assets/theme.js：非 dark 即 light。 */
    ['.theme-toggle', function () {
      return 'theme:' + (document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }],
  ];

  function codeOf(target) {
    if (!target || !target.closest) return null;
    for (var i = 0; i < RULES.length; i++) {
      var el = target.closest(RULES[i][0]);
      if (!el) continue;
      var v = RULES[i][1];
      var code = typeof v === 'function' ? v(el) : v;
      /* 推不出值（例如 slug 是空的）就不要送半個代碼上去 */
      return code && code.slice(-1) !== ':' ? code : null;
    }
    return null;
  }

  /* 每一次瀏覽最多送幾筆，以及同一顆在 600 毫秒內只算一次。
     擋的是連點與長按重送——不是為了省流量，是為了不讓一次手滑變成排名第一。
     ⚠ 這不是去重：同一顆按三次（中間隔一段時間）就是三筆，
       「次數」本來就是這一份報告要回答的東西。 */
  var MAX = 80, sent = 0, lastCode = '', lastAt = 0;

  function log(target) {
    var code = codeOf(target);
    if (!code || sent >= MAX) return;
    var now = Date.now();
    if (code === lastCode && now - lastAt < 600) return;
    lastCode = code; lastAt = now; sent++;
    /* 訪客軌跡（assets/path-log.js）接這一個事件，把同一個代碼記成這次來訪的一步。
       ⚠ 這一份自己送出去的仍然只有「哪一顆、在哪一頁」，沒有代碼。 */
    try { window.dispatchEvent(new CustomEvent('fangren:click', { detail: code })); } catch (e) {}

    var body = JSON.stringify({ code: code, scope: scope });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(api, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        return;
      }
    } catch (e) {}
    try {
      fetch(api, { method: 'POST', body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  /* ⚠⚠ 事件代理掛在 document 的**捕獲階段**（第三個參數 true），不是冒泡。
     冒泡寫過一版，地圖上那三種（診所、停車場的名字、停車場那一塊）一筆都沒記到，
     而且站上完全正常——**因為它們的 handler 自己呼叫了 stopPropagation**
     （index.html 那一段註解寫著理由：不擋住的話點名字會先把牌子收起來）。
     冒泡到不了 document，這一支就永遠看不到那幾顆。捕獲階段在目標之前跑，
     誰都擋不掉。⚠ 代價是**讀到的狀態是「按之前」**，夜間開關那一條因此要自己
     算翻面之後的值（見上面 RULES 裡那一則）。
     ⚠ auxclick 也要掛：電腦上「中鍵開新分頁」不會觸發 click，
       只算 click 的話，習慣開新分頁的人等於沒被記到。 */
  document.addEventListener('click', function (e) { log(e.target); }, true);
  document.addEventListener('auxclick', function (e) { if (e.button === 1) log(e.target); }, true);
})();
