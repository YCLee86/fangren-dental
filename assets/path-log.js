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
      if (s && /^[a-z0-9]{12}$/.test(s.sid) && typeof s.n === 'number' && typeof s.t === 'number') return s;
    } catch (e) {}
    return null;
  }
  function save(s) { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
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
    save({ sid: s.sid, n: s.n, t: s.t });
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
  else save({ sid: cur.sid, n: cur.n, t: Date.now() });

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
