/* ==========================================================================
   來源紀錄 —— 前端這一側（2026-09-25）
   --------------------------------------------------------------------------
   起因（使用者）：「有辦法記錄使用者是從那邊進入網站的嗎」。
   資料那一側在 src/source.js，報告在 /admin/search/ 的第三個分頁。

   ── 做的三件事 ──────────────────────────────────────────────────────────
   ① **只在「從站外進來的那一下」送一筆。** referrer 是 fangren.net 自己
      （站內換頁）、或這一次是重新整理／上一頁下一頁，都不送——
      ⚠ 重新整理時 document.referrer 會沿用第一次進來的那個值，
        不擋的話按一次重新整理就多算一個從 Google 來的人。
   ② **送的只有三個字串**：進站的第一頁、網址上 ?from= 的值、referrer 的**網域**。
      整段 referrer 網址不送（裡面可能帶著他搜的字）。歸類由 Worker 做。
   ③ **把網址列上的 ?from= 擦掉**（history.replaceState，不重新載入）。
      使用者 2026-09-25 的顧慮：標記露在畫面上會怪。而且不擦的話，
      有人複製網址轉傳給朋友，朋友點進來也會被算成「從 LINE 來的」。
      ⚠ 只擦 from 一個，其他參數（例如首頁的 ?q=）與 #錨點原樣留著。
      ⚠ 這一步在「找不到是哪一頁」時也照做——提案頁的快照不記，但網址一樣要乾淨。

   ── 不記什麼 ────────────────────────────────────────────────────────────
   不記 IP、不記 User-Agent、不發 cookie、沒有流水號（同 click-log.js）。
   所以報告上看得出「這個月有幾個人從 LINE 進來」，看不出「那個人後來按了什麼」。

   API 的位置從這支腳本自己的網址推，理由同 click-log.js 的第 ③ 條（舊站還活著）。
   ========================================================================== */
(function () {
  var me = document.currentScript;
  var api = me && me.src
    ? me.src.replace(/[?#].*$/, '').replace(/\/assets\/source-log\.js$/, '/api/source')
    : '/api/source';

  /* ---- ③ 先擦網址列上的標記 ---- */
  var from = '';
  try {
    var params = new URLSearchParams(location.search);
    if (params.has('from')) {
      from = (params.get('from') || '').slice(0, 20);
      params.delete('from');
      var qs = params.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  } catch (e) {}

  if (api.indexOf('/api/source') < 0) return;      /* 檔名被改過就不要亂送 */

  /* 進站的第一頁。取法抄 click-log.js：七科頁看 <body data-topic>，
     首頁與文章頁看計數器的掛勾。取不到（提案頁的快照）就不記。 */
  var page = (function () {
    var t = document.body.getAttribute('data-topic');
    if (t) return 'topic:' + t;
    var el = document.querySelector('[data-views-self]');
    var s = el && el.getAttribute('data-views-self');
    if (!s) return null;
    return s === 'home' ? 'home' : 'post:' + s;
  })();
  if (!page) return;

  /* ---- ① 重新整理、上一頁下一頁不算 ---- */
  var type = 'navigate';
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type) type = nav.type;
    else if (performance.navigation) type = ['navigate', 'reload', 'back_forward'][performance.navigation.type] || 'navigate';
  } catch (e) {}
  if (type === 'reload' || type === 'back_forward') return;

  /* ---- 站內換頁不算 ---- */
  var host = '';
  try { host = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
  if (host && host === location.hostname) return;

  var body = JSON.stringify({ page: page, from: from, host: host });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(api, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
      return;
    }
  } catch (e) {}
  try {
    fetch(api, { method: 'POST', body: body, keepalive: true }).catch(function () {});
  } catch (e) {}
})();
