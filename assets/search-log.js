/* ==========================================================================
   搜尋紀錄 —— 前端這一側（2026-09-20）
   --------------------------------------------------------------------------
   起因（使用者）：「我的網站上有放搜尋條　可以記錄使用者的輸入紀錄嗎?」
   資料那一側在 src/search.js，報告在 /admin/search/。

   ── 三件刻意的設計 ──────────────────────────────────────────────────────
   ① **不是每按一個鍵就送一筆。** 站上那支篩選器是逐鍵即時篩的，照著送的話
      「植」「植牙」「植牙費」會變成三筆，而排名要的是**他最後找的那個字**。
      所以只在「這次搜尋結束了」的時候送：按 Enter／輸入框失焦／
      切走或關掉分頁／停手 8 秒。同一次瀏覽同一個字串只送一次。
      ⚠ 「切走或關掉分頁」那一刻用 fetch 常常來不及送出（頁面要卸載了），
        所以優先用 navigator.sendBeacon —— 它就是為了這件事存在的。
        ⚠ beacon 送出去的 Content-Type 是 text/plain，Worker 那邊因此
          不能用 request.json()，要自己讀 text 再 parse。
   ② **「搜到幾筆」要把診所資訊那兩張卡算進去。** 算法整個照抄
      assets/head-search.js 的 infoIdx／infoHits —— 不然「停車」會被記成
      「搜不到」，可是畫面上明明找到了一項，報告就會叫人去寫一篇根本不缺的文章。
   ③ **站上任何一支既有的腳本一行都沒有改。** 這一支只讀 #q 和畫面上
      已經套好的 .is-filtered-out，掛在最後（defer），前面那幾支算完才輪到它。

   ── 不記什麼 ────────────────────────────────────────────────────────────
   不記 IP、不記 User-Agent、不發 cookie、不產生任何能串起同一個人的識別碼。
   理由寫在 src/search.js 的檔頭。**要加之前先想清楚個資法那條線。**
   ========================================================================== */
(function () {
  var q = document.getElementById('q');
  if (!q) return;

  /* 來源。首頁（含從文章頁帶回來的 ?q=）＝ home；七科著陸頁 ＝ topic:<spec>。
     ⚠ 判斷方式和 head-search.js 同一條：body 上有沒有 data-topic。 */
  var spec  = document.body.dataset.topic;
  var scope = spec ? 'topic:' + spec : 'home';

  /* ⚠ 不要寫成根目錄絕對路徑 '/api/search' —— 舊站 yclee86.github.io 還活著，
     那邊會打到 github.com 的根目錄去（同 head-search.js 裡那條註解）。 */
  var api = (spec ? '../../' : './') + 'api/search';

  /* 診所資訊那兩張卡的可搜尋文字（算法同 head-search.js）。
     ⚠ 門診表那張卡裡的 .hours-filter 是控制項不是內容，要剔掉，
       不然「矯正」「兒童牙科」每一次都會多命中一次看診時間。 */
  var infoIdx = Array.prototype.map.call(
    document.querySelectorAll('#clinic .info-card'),
    function (el) {
      var clone = el.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll('.hours-filter'), function (x) { x.remove(); });
      return (clone.textContent || '').replace(/\s+/g, '').toLowerCase();
    });

  function hits() {
    var n = 0, i;
    var cards = document.querySelectorAll('.cards .card');
    var docs  = document.querySelectorAll('.docs .doc');
    for (i = 0; i < cards.length; i++) if (!cards[i].classList.contains('is-filtered-out')) n++;
    for (i = 0; i < docs.length;  i++) if (!docs[i].classList.contains('is-filtered-out')) n++;
    var s = q.value.replace(/\s+/g, '').toLowerCase();
    if (s) for (i = 0; i < infoIdx.length; i++) if (infoIdx[i].indexOf(s) >= 0) n++;
    return n;
  }

  var sent = {};      /* 這一次瀏覽已經送過的字串，同一個不送第二次 */

  function send() {
    var raw = q.value.replace(/\s+/g, ' ').trim();
    if (!raw || raw.length > 40) return;
    var key = raw.toLowerCase();
    if (sent[key]) return;
    sent[key] = 1;

    var body = JSON.stringify({ q: raw, scope: scope, hits: hits() });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(api, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        return;
      }
    } catch (e) {}
    /* 沒有 sendBeacon 的退路。keepalive 讓它在頁面卸載時還有機會送完。 */
    try {
      fetch(api, { method: 'POST', body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  /* 停手 8 秒也算一次搜尋結束 —— 有人打完字就一直看著結果不動，
     那一次如果不記，資料會偏向「會按 Enter 的人」。 */
  var idle = null;
  q.addEventListener('input', function () {
    clearTimeout(idle);
    idle = setTimeout(send, 8000);
  });

  q.addEventListener('blur', send);
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

  /* 切到別的分頁、鎖螢幕、點走一張卡 —— 都在這裡收尾。
     ⚠ 兩個事件都要掛：iOS Safari 的 pagehide 比 visibilitychange 可靠，
       桌機反過來。送兩次沒關係，上面那個 sent 擋得住。 */
  addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') send();
  });
  addEventListener('pagehide', send);
})();
