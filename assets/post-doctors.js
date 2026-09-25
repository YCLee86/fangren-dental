/* ==========================================================================
   文章頁「這一科的醫師」的兩個入口（2026-09-25 上線）
   --------------------------------------------------------------------------
   ・頂端那一行底下的「N 位醫師 ›」（a.pd-peek，href="#pd"）
   ・右下角那一顆「醫師 ﹀」（button.pd-btt）—— 照首頁「回到最上面」的 .btt：
     捲過**半個螢幕**才出現；這裡多一條：**醫師那一塊進到畫面就收起來**
     （已經看到了，再指一次就是多餘的）。
   兩個點下去都平滑捲到那一塊；「減少動態效果」開著就直接跳。

   HTML 由 tools/build.mjs 寫進每一篇，樣式在 assets/style.css 那一段。
   ⚠ 沒有 JS 的時候：那一句仍然是一般的錨點連結（跳得過去）；
     右下角那一顆一直是 visibility: hidden（它的全部價值就是這段捲動，同 .btt）。
   ⚠ 「進到畫面了沒」用 visualViewport.height 不是 innerHeight ——
     iOS 的 innerHeight 是工具列收起後的大視窗高，會高估（同 .btt）。
   ========================================================================== */
(function () {
  var pd = document.getElementById('pd');
  if (!pd) return;
  var btn = pd.querySelector('.pd-btt');
  var tick = false, litT = 0;

  function vh() { return (window.visualViewport && visualViewport.height) || innerHeight; }

  function paint() {
    if (!btn) return;
    var past = window.pageYOffset > vh() * 0.5;
    var reached = pd.getBoundingClientRect().top < vh();
    btn.classList.toggle('is-on', past && !reached);
  }

  function go(ev) {
    if (ev) ev.preventDefault();
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* scrollIntoView 會照 html 的 scroll-padding-top 留出頁首的高度 */
    pd.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  }

  addEventListener('scroll', function () {
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { tick = false; paint(); });
  }, { passive: true });
  addEventListener('resize', paint);
  paint();

  if (btn) btn.addEventListener('click', function (ev) {
    btn.classList.add('is-lit');
    clearTimeout(litT);
    litT = setTimeout(function () { btn.classList.remove('is-lit'); }, 700);
    go(ev);
  });
  var peek = document.querySelector('.pd-peek');
  if (peek) peek.addEventListener('click', go);
})();
