/* ==========================================================================
   訪客軌跡 —— 前端這一側（2026-09-26）
   --------------------------------------------------------------------------
   起因與定了的七件：DECISIONS.md「訪客軌跡」那一列。資料那一側在 src/paths.js，
   報告在 /admin/search/ 的「訪客軌跡」。

   ── 做的事 ──────────────────────────────────────────────────────────────
   ① **分頁代碼**：第一次開頁隨機產生 12 碼，存在 sessionStorage（不是 cookie）。
      關掉分頁就沒了；**30 分鐘沒動作就換一組**（算一次新的來訪）。
      ⚠ sessionStorage 被擋掉（部分無痕模式）就整支不作用——沒有代碼串不起來，
        送了也只是一堆斷掉的單步。
   ② **每開一頁送一步**（k:'v'）。重新整理不送（不是新的一步）；上一頁／下一頁要送，
      帶 b:1——那是真的走回去了。從 bfcache 還原（pageshow persisted）的也算。
   ③ **每按一顆送一步**（k:'c'）。代碼不在這裡推，**跟 assets/click-log.js 要**：
      它每記一筆就丟一個 fangren:click 事件，這裡接起來加上代碼再送。
      同一張 RULES、同一套去連點——兩份報告的「撥電話」才會是同一件事。
   ④ **這次來訪的第一步**帶來源：網址上的 ?from= 與 referrer 的網域（同 source-log.js）。
      ⚠ ?from= 會被 source-log.js 開頁就擦掉，所以這裡讀的是
        performance 的 navigation 那一筆的網址（瀏覽器載入時的原始網址，replaceState 改不到它）。
      閒置之後在站內接著逛的（referrer 是自己）帶 i:1，報告上算成「閒置後接著逛」，
      不要算成「沒帶來源」。

   ⑤ **每一頁讀到哪裡**（2026-09-26 加的，使用者：「可以記錄使用者在一個頁面裡滑到哪裡嗎」）：
      離開那一頁（切走、關掉、換頁）時送一筆 k:'r'：讀到第幾節（<main> 裡看得到的 <h2>
      出現在畫面下緣 85% 以內就算到了）、共幾節、滑到幾成（以 10% 為一格，到底就是 100）、
      畫面真的在前面的秒數。r ＝ 它屬於這次來訪的第幾步（那一頁的 view）。
      ⚠ 同一頁切走又回來會再送一筆（數字只會變大），報告取最大的那一筆。
      ⚠ 不是步——n 不加一，不進路徑。手機直接關掉瀏覽器時可能來不及送，那一頁就沒有這一筆。
   ⑥ **沒動作就停表**（2026-09-26，使用者：「如果這個使用者頁面都沒關閉會有問題嗎」）：
      秒數只算「畫面在前面，而且 90 秒內有過動作」的時間——滑、點、打字、滑鼠移動、
      切回這個分頁都算動作。電腦開著頁面人走開，最多只會多算 90 秒，不會算成兩小時。
      ⚠ 90 秒是「一個畫面的字讀得完」的寬度；改它要一起改報告頁的說明。

   ── 不記什麼 ────────────────────────────────────────────────────────────
   不記 IP、不記 User-Agent、不發 cookie。代碼只活在這個分頁裡，
   **認不出同一個人隔天又來**——那是刻意的界線，不要改成 localStorage。
   API 的位置從這支腳本自己的網址推，理由同 click-log.js 的第 ③ 條（舊站還活著）。
   ========================================================================== */
(function () {
  var me = document.currentScript;
  var api = me && me.src
    ? me.src.replace(/[?#].*$/, '').replace(/\/assets\/path-log\.js$/, '/api/path')
    : '/api/path';
  if (api.indexOf('/api/path') < 0) return;

  /* 在哪一頁。取法抄 click-log.js；取不到（提案頁的快照）就整支不掛。 */
  var scope = (function () {
    var t = document.body.getAttribute('data-topic');
    if (t) return 'topic:' + t;
    var el = document.querySelector('[data-views-self]');
    var s = el && el.getAttribute('data-views-self');
    if (!s) return null;
    return s === 'home' ? 'home' : 'post:' + s;
  })();
  if (!scope) return;

  var KEY = 'fangren:path', IDLE = 30 * 60 * 1000, MAX = 120, sent = 0;
  try { sessionStorage.setItem(KEY + ':t', '1'); sessionStorage.removeItem(KEY + ':t'); }
  catch (e) { return; }

  function load() {
    try {
      var s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (s && /^[a-z0-9]{12}$/.test(s.sid) && typeof s.n === 'number' && typeof s.t === 'number') { s.vn = s.vn || 0; return s; }
    } catch (e) {}
    return null;
  }
  function save(s) { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var lastVn = 0, R = null;       /* 最近一次 view 是第幾步（重新整理之後讀到哪裡要掛回它） */
  function newSid() {
    var a = 'abcdefghijklmnopqrstuvwxyz0123456789', out = '';
    var buf = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < 12; i++) out += a[buf[i] % 36];
    return out;
  }
  /* 拿目前這次來訪；閒置過久或還沒有 → 開一組新的（fresh ＝ 這是新來訪的第一步）。 */
  function visit() {
    var s = load(), now = Date.now();
    if (!s || now - s.t > IDLE) return { sid: newSid(), n: 0, t: now, fresh: true };
    s.fresh = false;
    return s;
  }
  function beacon(obj) {
    var body = JSON.stringify(obj);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(api, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        return;
      }
    } catch (e) {}
    try { fetch(api, { method: 'POST', body: body, keepalive: true }).catch(function () {}); } catch (e) {}
  }
  function step(obj, s) {
    if (sent >= MAX) return;
    s = s || visit();
    s.n++; s.t = Date.now(); sent++;
    if (obj.k === 'v') { lastVn = s.n; startRead(s.sid, s.n); }
    else if (s.vn) lastVn = s.vn;
    save({ sid: s.sid, n: s.n, t: s.t, vn: lastVn });
    obj.sid = s.sid; obj.n = s.n;
    beacon(obj);
  }

  /* ---- ② 開頁 ---- */
  function view(back) {
    var s = visit();
    var o = { k: 'v', s: scope };
    if (back) o.b = 1;
    if (s.fresh) {
      var from = '', host = '';
      try {
        var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        from = (new URL(nav && nav.name ? nav.name : location.href).searchParams.get('from') || '').slice(0, 20);
      } catch (e) {}
      try { host = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
      if (host && host === location.hostname) o.i = 1;
      else { if (from) o.f = from; if (host) o.h = host; }
    }
    step(o, s);
  }

  var type = 'navigate';
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type) type = nav.type;
    else if (performance.navigation) type = ['navigate', 'reload', 'back_forward'][performance.navigation.type] || 'navigate';
  } catch (e) {}
  /* 重新整理不是新的一步——除非已經閒置過久（那就是一次新的來訪）。 */
  var cur = load();
  if (type !== 'reload' || !cur || Date.now() - cur.t > IDLE) view(type === 'back_forward');
  else {
    save({ sid: cur.sid, n: cur.n, t: Date.now(), vn: cur.vn || 0 });
    lastVn = cur.vn || 0;
    if (cur.vn) startRead(cur.sid, cur.vn);
  }

  /* ---- ⑤ 讀到哪裡 ---- */
  function startRead(sid, ref) {
    flushRead();
    lastAct = Date.now();
    R = { sid: sid, ref: ref, d: 0, x: 0, y: 0, secs: 0, since: document.visibilityState === 'visible' ? Date.now() : 0,
          last: '', sent: 0 };
    measure();
  }
  function heads() {
    var all = document.querySelectorAll('main h2'), out = [];
    for (var i = 0; i < all.length && out.length < 60; i++) if (all[i].getClientRects().length) out.push(all[i]);
    return out;
  }
  function measure() {
    if (!R) return;
    var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var bottom = (window.pageYOffset || document.documentElement.scrollTop || 0) + window.innerHeight;
    var d = bottom >= h - 2 ? 100 : Math.max(0, Math.min(100, Math.floor(bottom / h * 10) * 10));
    if (d > R.d) R.d = d;
    var hs = heads();
    R.y = hs.length;
    for (var i = R.x; i < hs.length; i++) {
      if (hs[i].getBoundingClientRect().top < window.innerHeight * 0.85) R.x = i + 1; else break;
    }
  }
  /* ⑥ 把「上一次結算到現在」這一段算進去：只算到最後一次動作之後 READ_IDLE 為止。 */
  var READ_IDLE = window.fangrenPathIdleMs > 0 ? window.fangrenPathIdleMs : 90 * 1000;   /* 前者只給 tools/path-test.mjs 用 */
  var lastAct = Date.now();
  function acc() {
    if (!R || !R.since) return;
    var now = Date.now(), end = Math.min(now, lastAct + READ_IDLE);
    if (end > R.since) R.secs += (end - R.since) / 1000;
    R.since = document.visibilityState === 'visible' ? now : 0;
  }
  function act() { acc(); lastAct = Date.now(); if (R && !R.since && document.visibilityState === 'visible') R.since = lastAct; }
  var lastMove = 0;
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (t) {
    window.addEventListener(t, act, { passive: true, capture: true });
  });
  window.addEventListener('mousemove', function () {
    var now = Date.now();
    if (now - lastMove > 1000) { lastMove = now; act(); }          /* 滑鼠一動就是幾十次，一秒算一次就好 */
  }, { passive: true });
  function flushRead() {
    if (!R || R.sent >= 30) return;
    measure();
    acc();
    var t = Math.min(7200, Math.round(R.secs));
    var key = R.d + '|' + R.x + '|' + R.y + '|' + Math.floor(t / 5);
    if (key === R.last) return;
    R.last = key; R.sent++;
    beacon({ k: 'r', sid: R.sid, r: R.ref, s: scope, d: R.d, x: R.x, y: R.y, t: t });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    (window.requestAnimationFrame || setTimeout)(function () { ticking = false; act(); measure(); });
  }, { passive: true });
  window.addEventListener('load', measure);
  document.addEventListener('visibilitychange', function () {
    if (!R) return;
    if (document.visibilityState === 'hidden') {
      acc(); R.since = 0;
      flushRead();
    } else { lastAct = Date.now(); R.since = lastAct; }             /* 切回來本身就是一個動作 */
  });
  window.addEventListener('pagehide', flushRead);

  /* 從 bfcache 還原：腳本不會重跑，要自己補這一步。 */
  window.addEventListener('pageshow', function (e) { if (e.persisted) view(true); });

  /* ---- ③ 按一顆 ---- */
  window.addEventListener('fangren:click', function (e) {
    var code = e && e.detail;
    if (typeof code !== 'string' || !code) return;
    /* 在這一頁停了 30 分鐘以上才按：那是一次新的來訪，先補一步「在這一頁」
       （閒置後接著逛），不然新的那一串會從一顆按鈕開始、少了它是在哪一頁按的。 */
    var s = visit();
    if (s.fresh) step({ k: 'v', s: scope, i: 1 }, s);
    step({ k: 'c', s: scope, c: code }, s);
  });
})();
