/* ==========================================================================
   瀏覽計數器（Supabase REST，無外部函式庫）
   --------------------------------------------------------------------------
   標記方式：
     <span class="views" data-views-self="post-slug">   ← 本頁計數，會 +1
     <span class="views" data-views="post-slug">        ← 只顯示，不加總
   兩者都會被填入最新數字，所以首頁卡片的數字＝文章頁的數字。

   每個瀏覽器分頁（sessionStorage）對同一篇文章只加一次，避免重新整理灌水。
   Supabase 未設定或連線失敗時，計數器整個隱藏，不會顯示壞掉的 UI。
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
  var BASE = (cfg.url || "").replace(/\/+$/, "");
  var KEY = cfg.anonKey || "";

  var selfEls = Array.prototype.slice.call(document.querySelectorAll("[data-views-self]"));
  var showEls = Array.prototype.slice.call(document.querySelectorAll("[data-views]"));
  var allEls = selfEls.concat(showEls);
  if (!allEls.length) return;

  function setState(state) {
    allEls.forEach(function (el) { el.setAttribute("data-state", state); });
  }

  if (!BASE || !KEY) { setState("error"); return; }   // 未設定 → 隱藏
  setState("loading");

  var headers = { apikey: KEY, Authorization: "Bearer " + KEY };

  function slugOf(el) { return el.getAttribute("data-views-self") || el.getAttribute("data-views"); }

  var slugs = [];
  allEls.forEach(function (el) {
    var s = slugOf(el);
    if (s && slugs.indexOf(s) === -1) slugs.push(s);
  });

  function render(map) {
    allEls.forEach(function (el) {
      var n = map[slugOf(el)];
      var out = el.querySelector(".views-n");
      if (!out) return;
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

    return fetch(BASE + "/rest/v1/rpc/increment_view", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body: JSON.stringify({ page_slug: slug })
    }).then(function (r) {
      if (!r.ok) throw new Error("rpc " + r.status);
      try { sessionStorage.setItem(mark, "1"); } catch (e) { /* ignore */ }
    });
  }

  /* 一次抓回本頁需要的所有計數 */
  function fetchAll() {
    var list = slugs.map(function (s) { return '"' + s.replace(/"/g, '') + '"'; }).join(",");
    var url = BASE + "/rest/v1/page_views?select=slug,views&slug=in.(" + encodeURIComponent(list) + ")";
    return fetch(url, { headers: headers }).then(function (r) {
      if (!r.ok) throw new Error("select " + r.status);
      return r.json();
    }).then(function (rows) {
      var map = {};
      slugs.forEach(function (s) { map[s] = 0; });
      (rows || []).forEach(function (row) { map[row.slug] = row.views; });
      render(map);
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
