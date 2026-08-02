/* ==========================================================================
   瀏覽計數器（Cloudflare Pages Function + D1）
   --------------------------------------------------------------------------
   標記方式：
     <span class="views" data-views-self="post-slug">   ← 本頁計數，會 +1
     <span class="views" data-views="post-slug">        ← 只顯示，不加總
   兩者都會被填入最新數字，所以首頁卡片的數字＝文章頁的數字。

   每個瀏覽器分頁（sessionStorage）對同一篇文章只加一次，避免重新整理灌水。
   API 不存在時（例如在 GitHub Pages 或本機用 file:// 開啟）計數器整個隱藏，
   不會顯示壞掉的 UI，網站其他部分完全正常。
   ========================================================================== */
(function () {
  "use strict";

  var API = "/api/views";

  var selfEls = Array.prototype.slice.call(document.querySelectorAll("[data-views-self]"));
  var showEls = Array.prototype.slice.call(document.querySelectorAll("[data-views]"));
  var allEls = selfEls.concat(showEls);
  if (!allEls.length) return;

  function setState(state) {
    allEls.forEach(function (el) { el.setAttribute("data-state", state); });
  }
  setState("loading");

  function slugOf(el) { return el.getAttribute("data-views-self") || el.getAttribute("data-views"); }

  var slugs = [];
  allEls.forEach(function (el) {
    var s = slugOf(el);
    if (s && slugs.indexOf(s) === -1) slugs.push(s);
  });

  function render(counts) {
    allEls.forEach(function (el) {
      var out = el.querySelector(".views-n");
      if (!out) return;
      var n = counts[slugOf(el)];
      out.textContent = (typeof n === "number" ? n : 0).toLocaleString("zh-TW");
    });
    setState("ready");
  }

  /* 本頁 +1（每個分頁 session 只做一次） */
  function bump() {
    var el = selfEls[0];
    if (!el) return Promise.resolve();
    var slug = slugOf(el);
    if (!slug) return Promise.resolve();

    var mark = "fangren:viewed:" + slug;
    try { if (sessionStorage.getItem(mark)) return Promise.resolve(); } catch (e) { /* 無痕模式 */ }

    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug })
    }).then(function (r) {
      if (!r.ok) throw new Error("POST " + r.status);
      try { sessionStorage.setItem(mark, "1"); } catch (e) { /* ignore */ }
    });
  }

  /* 一次抓回本頁需要的所有計數 */
  function fetchAll() {
    return fetch(API + "?slugs=" + encodeURIComponent(slugs.join(","))).then(function (r) {
      if (!r.ok) throw new Error("GET " + r.status);
      return r.json();
    }).then(function (data) {
      render((data && data.counts) || {});
    });
  }

  bump()
    .catch(function () { /* 加總失敗仍要顯示現有數字 */ })
    .then(fetchAll)
    .catch(function (err) {
      if (window.console) console.warn("[counter] 停用：", err && err.message);
      setState("error");
    });
})();
