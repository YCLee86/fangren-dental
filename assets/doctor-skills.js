/* ==========================================================================
   醫師卡「專長」的小框（2026-09-26 上線，推導在 /history/doctor-posts.html）
   --------------------------------------------------------------------------
   專長那一句裡有文章的詞，後面緊接一個 hidden 的 .sk-pop（由 tools/build.mjs 寫，
   對照表在 tools/skill-posts.mjs）。這一支把那個詞變成一顆按鈕：
     ・點詞 → 詞底下浮出小框，列出講那件事的文章，點標題進文章
     ・再點一次那個詞／點框外任何地方／按 Esc → 收起來；一次只開一個
   ⚠ 沒有 JS 的時候什麼都不變：那個詞仍是原本那句話裡的純文字（虛線底線也是
     由這一支加上的 .sk-go 才長出來，不會給一個按了沒反應的樣子）。
   ⚠ 首頁與七科著陸頁共用這一支（著陸頁是 index.html 的快照），
     改完 index.html 要重跑 node tools/topics.mjs。
   ⚠ 點擊紀錄由 assets/click-log.js 記：開框 sk:<醫師代號>、點標題 sk-post:<文章>。
   ========================================================================== */
(function () {
  var pops = document.querySelectorAll('.docs .sk-pop');
  if (!pops.length) return;

  Array.prototype.forEach.call(pops, function (p) {
    var w = p.previousElementSibling;
    if (!w || !w.classList.contains('sk')) return;
    w.classList.add('sk-go');
    w.setAttribute('role', 'button');
    w.setAttribute('tabindex', '0');
    w.setAttribute('aria-expanded', 'false');
  });

  var open = null;
  function close() {
    if (!open) return;
    open.w.setAttribute('aria-expanded', 'false');
    open.p.hidden = true;
    open = null;
  }
  /* 框的左緣對齊那個詞的左緣，超出卡片右緣就往左推；上緣貼在詞底下 6px。
     詞折成兩行的話對齊最後那一段（框接在字的正下方）。 */
  function place(w, p) {
    var card = w.closest('.doc'), cr = card.getBoundingClientRect();
    var rs = w.getClientRects(), r = rs[rs.length - 1] || w.getBoundingClientRect();
    p.style.left = '0px'; p.style.top = '0px';
    var pad = 12, left = Math.min(r.left - cr.left, cr.width - p.offsetWidth - pad);
    p.style.left = Math.max(pad, left) + 'px';
    p.style.top = (r.bottom - cr.top + 6) + 'px';
  }
  function toggle(w) {
    var p = w.nextElementSibling, same = open && open.w === w;
    close();
    if (same || !p || !p.classList.contains('sk-pop')) return;
    p.hidden = false;
    place(w, p);
    w.setAttribute('aria-expanded', 'true');
    open = { w: w, p: p };
  }

  document.addEventListener('click', function (e) {
    var w = e.target.closest ? e.target.closest('.sk-go') : null;
    if (w) { toggle(w); return; }
    if (open && !e.target.closest('.sk-pop')) close();
  });
  document.addEventListener('keydown', function (e) {
    var w = e.target.closest ? e.target.closest('.sk-go') : null;
    if (w && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(w); return; }
    if (e.key === 'Escape' && open) { var o = open.w; close(); o.focus(); }
  });
  addEventListener('resize', close);
})();
