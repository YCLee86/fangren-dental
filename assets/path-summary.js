/* ==========================================================================
   訪客軌跡 —— 把原始逐筆歸納成一天的摘要（2026-09-26）
   --------------------------------------------------------------------------
   只有 /admin/search/ 載它（站上任何一頁都不載）。為什麼在瀏覽器裡算而不在 Worker：
   見 src/paths.js 的④（免費方案一次請求只有 10 ms CPU）。
   tools/path-test.mjs 用 node 的 vm 直接跑這一支，所以**只能用 ES5 ＋ 不碰 DOM**。

   ── 一次來訪的「路徑」怎麼寫 ──────────────────────────────────────────────
   只收兩種步：**看了哪一頁**（首頁／某一科／某一篇）與**離站動作**（打電話、開導航、
   停車場導航、加 LINE、醫師臉書）。站內的按鈕（回到最上面、放大鏡、夜間開關…）
   不進路徑——它們在同一頁裡，放進去只會把同一條路拆成幾百種寫法。
   連續兩步是同一頁的收成一步。超過 MAXP 步的後面接「…」。

   ── 訪客類型（五種，由上往下比，第一條對上的就算）───────────────────────────
     act1     直接行動：只看了一頁就打電話／開導航
     compare  比較型：  看了兩頁以上（或看過醫師）才採取行動
     ret      回診型：  從首頁進來、沒看文章、看了門診表／地址／停車，沒有行動就走
     info     資訊型：  只看了一篇文章或一科就走
     browse   瀏覽型：  其他（看了幾頁、沒有行動）
   ⚠ 規則改了要把 V 加一（src/paths.js 的 V 一起改），舊的那幾天才會重算。

   ── 讀到哪裡（V 2，2026-09-26）─────────────────────────────────────────────
   每一頁（sid ＋ ref）可能有好幾筆，取最大值。按頁面分開記：看了幾次、平均滑到幾成、
   讀完幾次（滑到九成以上，或讀到最後一節）、每一節有幾次讀到、停留秒數分成幾格，
   以及「讀完的那幾次，那一次來訪最後有沒有行動」。
   ========================================================================== */
(function (root) {
  var V = 2, MAXP = 6, TOP_PATHS = 300, TOP_TRANS = 1500;
  /* 停留秒數的格子（上界）。最後一格是「10 分鐘以上」。 */
  var SECS = [10, 30, 60, 120, 300, 600];
  function secBin(t) { for (var i = 0; i < SECS.length; i++) if (t < SECS[i]) return String(i); return String(SECS.length); }
  var OUT = /^(tel$|line$|map:|park:|fb:)/;

  function act(code) {
    if (code === 'tel') return '!tel';
    if (code === 'line') return '!line';
    if (/^map:/.test(code)) return '!map';
    if (/^park:/.test(code)) return '!park';
    if (/^fb:/.test(code)) return '!fb';
    return null;
  }
  var DOCTOR = /^(nav:doctors|foot:doctors|count:doctors|doc:|doc-peek$|doc-btn$|sk:|sk-post:)/;
  var VISIT = /^(hours:|nav:clinic|foot:clinic|lot:|bays$|map:|park:)/;

  function bump(m, k, by) { m[k] = (m[k] || 0) + (by || 1); }

  /* 一次來訪（已經照 n 排好）→ 它的特徵 */
  function one(ev) {
    var tokens = [], views = 0, pages = {}, acts = {}, converted = false;
    var sawDoc = false, sawVisit = false, sawPost = false, entry = null, src = null;
    for (var i = 0; i < ev.length; i++) {
      var e = ev[i];
      if (e.n === 1 && e.src) src = e.src;
      if (e.kind === 'view') {
        views++;
        pages[e.scope] = 1;
        if (!entry) entry = e.scope;
        if (/^post:/.test(e.scope)) sawPost = true;
        if (tokens[tokens.length - 1] !== e.scope) tokens.push(e.scope);
      } else if (e.kind === 'click' && e.code) {
        if (DOCTOR.test(e.code)) sawDoc = true;
        if (VISIT.test(e.code)) sawVisit = true;
        var a = act(e.code);
        if (a) {
          converted = true;
          acts[a] = 1;
          if (tokens[tokens.length - 1] !== a) tokens.push(a);
        }
      }
    }
    if (!entry) return null;                     /* 沒有任何一頁（第一步掉了）→ 不算 */
    var exit = null;
    for (var j = tokens.length - 1; j >= 0; j--) if (tokens[j].charAt(0) !== '!') { exit = tokens[j]; break; }
    var nPages = 0; for (var p in pages) nPages++;
    var type = converted ? (views <= 1 && !sawDoc ? 'act1' : 'compare')
             : (entry === 'home' && !sawPost && sawVisit) ? 'ret'
             : (views <= 1 && entry !== 'home') ? 'info'
             : 'browse';
    return { tokens: tokens, views: views, pages: nPages, acts: acts, converted: converted,
             entry: entry, exit: exit, src: src || 'unknown', type: type };
  }

  function steps(v) { return v <= 1 ? '1' : v === 2 ? '2' : v === 3 ? '3' : v <= 5 ? '4-5' : '6+'; }

  function blank() {
    return { v: V, sessions: 0, converted: 0, views: 0, types: {}, typesConv: {}, paths: {},
             entries: {}, entriesConv: {}, exits: {}, trans: {}, src: {}, srcConv: {}, acts: {}, steps: {}, read: {} };
  }
  /* 讀到哪裡：reads 是 path_read 的原始逐筆；只收 conv 裡有的那幾次來訪（同一天的）。 */
  function addReads(s, reads, conv) {
    var best = {};
    for (var i = 0; i < (reads || []).length; i++) {
      var r = reads[i];
      if (!(r.sid in conv)) continue;
      var k = r.sid + '#' + r.ref, b = best[k];
      if (!b) best[k] = { sid: r.sid, scope: r.scope, depth: r.depth, sec: r.sec, total: r.total, secs: r.secs };
      else {
        if (r.depth > b.depth) b.depth = r.depth;
        if (r.sec > b.sec) b.sec = r.sec;
        if (r.total > b.total) b.total = r.total;
        if (r.secs > b.secs) b.secs = r.secs;
      }
    }
    for (var key in best) {
      var x = best[key];
      var g = s.read[x.scope] || (s.read[x.scope] = { n: 0, depth: 0, done: 0, doneConv: 0, reach: {}, totals: {}, secs: {}, depths: {} });
      var done = x.depth >= 90 || (x.total > 0 && x.sec >= x.total);
      g.n++; g.depth += x.depth;
      if (done) { g.done++; if (conv[x.sid]) g.doneConv++; }
      for (var j = 1; j <= x.sec; j++) bump(g.reach, String(j));
      bump(g.totals, String(x.total));
      bump(g.secs, secBin(x.secs));
      bump(g.depths, String(x.depth));
    }
  }

  /* 很多次來訪 → 一份摘要（全部是可以相加的次數，合併幾天就是逐格相加） */
  function summarize(sessions, reads) {
    var s = blank(), conv = {};
    for (var i = 0; i < sessions.length; i++) {
      var f = one(sessions[i]);
      if (!f) continue;
      conv[sessions[i][0].sid] = f.converted;
      s.sessions++; s.views += f.views;
      if (f.converted) s.converted++;
      bump(s.types, f.type);
      if (f.converted) bump(s.typesConv, f.type);
      var path = f.tokens.slice(0, MAXP).join('>') + (f.tokens.length > MAXP ? '>…' : '');
      bump(s.paths, path);
      bump(s.entries, f.entry);
      if (f.converted) bump(s.entriesConv, f.entry);
      bump(s.exits, f.exit || f.entry);
      bump(s.src, f.src);
      if (f.converted) bump(s.srcConv, f.src);
      for (var a in f.acts) bump(s.acts, a);
      bump(s.steps, steps(f.views));
      for (var t = 0; t < f.tokens.length; t++) {
        bump(s.trans, f.tokens[t] + '\t' + (t + 1 < f.tokens.length ? f.tokens[t + 1] : '!out'));
      }
    }
    s.paths = top(s.paths, TOP_PATHS);
    s.trans = top(s.trans, TOP_TRANS);
    addReads(s, reads, conv);
    return s;
  }

  /* 只留前 N 名，其餘併成一格「其他」（'~'）——一天的摘要不要長成一整本。 */
  function top(m, n) {
    var keys = Object.keys(m);
    if (keys.length <= n) return m;
    keys.sort(function (a, b) { return m[b] - m[a]; });
    var out = {}, rest = 0;
    for (var i = 0; i < keys.length; i++) { if (i < n) out[keys[i]] = m[keys[i]]; else rest += m[keys[i]]; }
    if (rest) out['~'] = (out['~'] || 0) + rest;
    return out;
  }

  /* 原始逐筆（不必排好）→ 一次一次的來訪。only：只收「第一步落在這段時間裡」的那幾次，
     跨午夜的來訪算在它開始的那一天；第一步掉了（沒有 n = 1）的整次不算。 */
  function group(rows, fromIso, toIso) {
    var by = {}, order = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!by[r.sid]) { by[r.sid] = []; order.push(r.sid); }
      by[r.sid].push(r);
    }
    var out = [];
    for (var j = 0; j < order.length; j++) {
      var ev = by[order[j]].sort(function (a, b) { return a.n - b.n; });
      var first = ev[0];
      if (first.n !== 1) continue;
      if (fromIso && (first.at < fromIso || first.at >= toIso)) continue;
      out.push(ev);
    }
    return out;
  }

  function merge(list) {
    var s = blank();
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (!d) continue;
      s.sessions += d.sessions || 0; s.converted += d.converted || 0; s.views += d.views || 0;
      for (var k in s) {
        if (k === 'read' || typeof s[k] !== 'object' || !d[k]) continue;
        for (var x in d[k]) bump(s[k], x, d[k][x]);
      }
      /* 讀到哪裡多一層（頁面 → 那幾格），逐格相加 */
      for (var sc in (d.read || {})) {
        var a = d.read[sc], g = s.read[sc] || (s.read[sc] = { n: 0, depth: 0, done: 0, doneConv: 0, reach: {}, totals: {}, secs: {}, depths: {} });
        g.n += a.n || 0; g.depth += a.depth || 0; g.done += a.done || 0; g.doneConv += a.doneConv || 0;
        ['reach', 'totals', 'secs', 'depths'].forEach(function (f) { for (var y in (a[f] || {})) bump(g[f], y, a[f][y]); });
      }
    }
    return s;
  }

  root.fangrenPathSummary = { V: V, OUT: OUT, SECS: SECS, one: one, summarize: summarize, group: group, merge: merge };
})(typeof window !== 'undefined' ? window : this);
