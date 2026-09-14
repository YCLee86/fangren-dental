/* 夜間模式的開關（由 tools/night-mode.mjs 產生，請勿手動編輯）。
   開頁時的主題由各頁 <head> 裡那段內嵌腳本決定；這一支只負責：
   ・按下滑桿 → 翻面並記在 localStorage 'fangren:theme'
   ・沒有記過的人，系統切換深淺色時跟著變
   ・另一個分頁改了，這一頁跟著變
   ・aria-checked 與 theme-color 跟上 */
(function () {
  var r = document.documentElement, KEY = 'fangren:theme';
  var mq = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
  var meta = document.querySelector('meta[name="theme-color"]'), dayColor = meta && meta.content;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) {
    r.dataset.theme = t;
    var on = t === 'dark';
    Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (b) { b.setAttribute('aria-checked', on); });
    if (meta) meta.content = on ? '#17191d' : dayColor;
  }
  apply(r.dataset.theme === 'dark' ? 'dark' : 'light');
  Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (b) {
    b.addEventListener('click', function () {
      var t = r.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, t); } catch (e) {}
      apply(t);
    });
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) {
    var s = saved(); if (s !== 'light' && s !== 'dark') apply(e.matches ? 'dark' : 'light');
  });
  addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    apply(e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : (mq && mq.matches ? 'dark' : 'light'));
  });
})();
