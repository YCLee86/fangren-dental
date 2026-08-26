/* ==========================================================================
   頁首的搜尋入口（2026-08-26 定案上線，提案頁 preview/head-search/）
   --------------------------------------------------------------------------
   起因（使用者，附首頁截圖）：
     「在右上那三個選單右邊再增加一個搜尋的欄位，因為這樣子搜尋我還要拉回去
       主題科別標籤下面有點麻煩……那個搜尋就保留，只是讓那三個往左移一點，
       然後有一個放大鏡的圖案，點下去可以變成搜尋頁面。」
   要解的是「搜尋框只有一個、而且在頁面中間」—— 捲到第七張卡才想搜尋，
   就得先往回捲。頁首是 fixed 的、一直都在，入口放這裡就永遠伸手可及。

   ── 定案的六格（兩輪，每一格都是使用者在提案頁上挑的）────────────────────
     展開方式　　整條（品牌也讓開，輸入框佔滿頁首那一列）
     放大鏡　　　只有圖示，沒有玻璃框
     打了字　　　立刻捲到主題與科別
     診所資訊　　一起搜
     搜不到　　　給三個出口（位置與周邊停車／看診時間／撥打電話）
     結果那一句　改成看得見、可以點的三顆
   落選案與每一輪的數字在 /history/head-search.html。

   ── 三件不要改掉的 ──────────────────────────────────────────────────────
   ① **放大鏡是 <a href="#topics"> 不是 <button>。** 沒有這一支的時候它退回
      「跳到主題與科別」＝ 使用者原本手動在做的事；有這一支才 preventDefault
      改成就地展開。方向和 HERO 那條動畫一樣：**JS 只會讓它變好。**
      ⚠ 它會被頁首那支 scrollspy 抓到，所以那一行選擇器寫的是
        `.site-nav a:not(.nav-q)[href^="#"]` —— 不排除的話它會被當成第四個
        小節，燈會滑到放大鏡上。
   ② **站上那支篩選的 IIFE 一行都沒有改。** 這一支只是把字寫進 #q 再送一個
      input 事件，然後在它後面（後掛的後跑）接手改寫那一句話。
      兩個入口 ＝ 同一個搜尋，「主題與科別」底下那個搜尋框留著。
   ③ **沒有做同義詞對照表**（地址→永樂街、電話→05、掛號→…）。
      這一站的原則是「篩得到什麼 ＝ 畫面上寫什麼」（index.html 那支 IIFE 的
      註解，2026-08-11 定的）。同義詞表會長出一份和畫面對不起來的第二真相，
      表要人維護、猜錯了沒有人會發現。**搜不到就給出口，不猜他打了什麼。**

   ── 哪一頁做什麼 ────────────────────────────────────────────────────────
     首頁　　　　就地篩選（#q 在、body 沒有 data-topic）
     著陸頁　　　送回首頁 /?q=…#topics —— 那七頁上只有該科的內容，就地篩的話
                 搜「植牙」在牙周那一頁會是 0 筆，而站上明明有。
                 ⚠ 那七頁自己那個 .topic-search 不受影響，它做的是
                   「在這一科裡找」，和頁首這顆（全站）是兩件事。
     文章頁　　　同上（那邊根本沒有可以篩的清單）
   ⚠ 文章頁一定要**有**這顆：2026-08-15 定案「首頁切到文章頁，頁首不要變」，
     少一顆圖示比差 0.14px 嚴重得多。
   ========================================================================== */
(function () {
  var root  = document.documentElement;
  var btn   = document.querySelector('.nav-q');
  var box   = document.querySelector('.head-search');
  if (!btn || !box) return;

  var input = box.querySelector('.hs-in');
  var nOut  = box.querySelector('.hs-n');
  var xBtn  = box.querySelector('.hs-x');
  var nav   = document.querySelector('.site-nav');
  var shell = btn.closest('.shell, .wrap');
  var q     = document.getElementById('q');
  var note  = document.querySelector('.filter-note');
  var qx    = document.querySelector('.qx');

  /* 就地篩選只在首頁。著陸頁有 #q 但也有 data-topic，走「送回首頁」那一條。 */
  var local = !!q && !document.body.dataset.topic;
  /* 送回首頁時要往上幾層：文章頁與著陸頁都深兩層，首頁自己是 './'。
     ⚠ 不要寫成根目錄絕對路徑 '/' —— 舊站 yclee86.github.io 還活著，那邊會壞。 */
  var home  = local ? './' : '../../';

  var open = false, scrolled = false;

  /* ---- 診所資訊那兩張卡（只有首頁有）------------------------------------
     做法和站上那支的 indexOf() 一樣：**讀的就是畫面上的字**，不另外維護
     一份關鍵字，所以「篩得到什麼」和「畫面上寫什麼」不可能對不起來。 */
  var infoIdx = Array.prototype.map.call(
    document.querySelectorAll('#clinic .info-card'),
    function (el, i) {
      if (!el.id) el.id = 'clinic-card-' + i;
      var h = el.querySelector('h3');
      /* ⚠ 門診表那張卡裡有一排科別標記（.hours-filter），那是**控制項不是內容** ——
         不剔掉的話「矯正」「兒童牙科」這種查詢每一次都會多命中一次看診時間，
         而看的人要的是文章與醫師，不是門診表。 */
      var clone = el.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll('.hours-filter'), function (x) { x.remove(); });
      return { id: el.id, name: h ? h.textContent.trim() : '診所資訊',
               text: (clone.textContent || '').replace(/\s+/g, '').toLowerCase() };
    });

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function counts() {
    var a = 0, d = 0, i;
    var cards = document.querySelectorAll('.cards .card');
    var docs  = document.querySelectorAll('.docs .doc');
    for (i = 0; i < cards.length; i++) if (!cards[i].classList.contains('is-filtered-out')) a++;
    for (i = 0; i < docs.length;  i++) if (!docs[i].classList.contains('is-filtered-out')) d++;
    return { a: a, d: d };
  }
  function infoHits(s) {
    if (!s) return [];
    return infoIdx.filter(function (r) { return r.text.indexOf(s) >= 0; });
  }
  function chip(n, label, href) {
    /* ⚠ 0 的那一顆也要印出「0」 —— 只寫「篇文章」讀起來像標題不像答案。 */
    if (!n) return '<span><b>0</b> ' + label + '</span>';
    return '<a href="' + href + '"><b>' + n + '</b> ' + label + '</a>';
  }

  /* 三顆結果標記。0 的那一顆退成柔墨線框、不能點 —— 「這裡沒有」也是答案。
     這一塊取代原本那句 13px 的灰字：使用者實測「醫師」其實有 9 位，
     可是第一位醫師在畫面下緣外 105px，那句話又太輕，讀起來就是「沒有結果」。 */
  function renderChips(raw, c, hits) {
    var row = chip(c.a, '篇文章', '#articles') + chip(c.d, '位醫師', '#doctors');
    row += hits.length
      ? '<a href="#' + hits[0].id + '">' + esc(hits[0].name) +
        (hits.length > 1 ? ' 等 ' + hits.length + ' 項' : '') + '</a>'
      : '<span>診所資訊</span>';
    qx.innerHTML = '<p class="qx-lead">搜尋「<b>' + esc(raw) + '</b>」</p>' +
                   '<div class="qx-row">' + row + '</div>';
    qx.hidden = false;
  }

  /* 搜不到的出口。**不猜他打了什麼** —— 「地址」「電話」在這一站是圖示不是
     文字、門診表寫的是「一二三四五」不是「週一」、「預約」全站沒有這兩個字，
     這一類**擴大索引也搜不到**。所以直接給這個站上最常被找的三件事。
     ⚠ 前兩顆的名字是從那兩張卡的 <h3> 讀回來的（畫面上寫什麼就是什麼）。 */
  function renderExits(raw) {
    var row = infoIdx.map(function (r) {
      return '<a href="#' + r.id + '">' + esc(r.name) + '</a>';
    }).join('');
    row += '<a href="tel:+88655339369">撥打 (05)5339-369</a>';
    qx.innerHTML = '<p class="qx-lead">站上搜不到「<b>' + esc(raw) +
      '</b>」。你可能要找的是：</p><div class="qx-row">' + row + '</div>';
    qx.hidden = false;
  }

  /* 站上那支寫好那句話之後才輪到這裡（後掛的後跑），所以拿到的一定是它算完
     的畫面（.is-filtered-out 都已經套好）。 */
  function render() {
    if (!local || !note || !qx) return;
    var raw = q.value.trim();
    var s   = q.value.replace(/\s+/g, '').toLowerCase();
    if (!raw) { qx.hidden = true; qx.innerHTML = ''; return; }

    var c = counts(), hits = infoHits(s);
    if (c.a + c.d + hits.length === 0) { note.hidden = true; renderExits(raw); }
    else { note.hidden = true; renderChips(raw, c, hits); }

    /* 頁首那個筆數也要把診所資訊算進去 —— 不然「停車」會印「0 篇・0 位」，
       可是底下明明找到了一項。
       ⚠⚠ 要排到下一個任務再寫：底下 push() 是**先**在 #q 上送 input
         （於是這裡同步跑完）**再**寫 .hs-n，直接寫會被它蓋掉。 */
    var kA = c.a, kD = c.d, kI = hits.length;
    setTimeout(function () {
      if (nOut && nOut.textContent) {
        nOut.textContent = kA + ' 篇・' + kD + ' 位' + (kI ? '・' + kI + ' 項' : '');
      }
    }, 0);
  }

  /* ---- 搜尋列的開合 ------------------------------------------------------ */
  function place() {
    /* 「整條」那一格：輸入框佔滿頁首那一列，所以左緣就是版心內緣。
       這裡留一個掛勾，日後若要改回「就地」只要把 --hs-left 算成品牌的右緣。 */
    if (shell) root.style.setProperty('--hs-left', '0px');
  }

  function push() {
    if (!local) return;
    q.value = input.value;
    q.dispatchEvent(new Event('input', { bubbles: true }));
    var c = counts();
    nOut.textContent = input.value.trim() ? (c.a + ' 篇・' + c.d + ' 位') : '';
  }

  function toTopics() {
    var sec = document.getElementById('topics');
    if (sec) sec.scrollIntoView();
  }

  function setOpen(v) {
    /* ⚠ 先把位置量好再現身，不然會先畫一幀位置還沒算的框。 */
    if (v) place();
    open = v;
    root.setAttribute('data-qopen', v ? '1' : '0');
    btn.setAttribute('aria-expanded', String(v));
    if (v) {
      box.removeAttribute('inert');
      /* 開的時候先把站上那個搜尋框現在的字接過來 —— 兩個入口是同一個搜尋，
         打開卻看到空白（或上一次的字）都是說謊。 */
      if (local) input.value = q.value;
      input.focus();
      push();
    } else {
      box.setAttribute('inert', '');
      scrolled = false;
    }
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();          /* 有 JS 就不要真的跳走，那是沒有 JS 時的退路 */
    setOpen(!open);
  });
  xBtn.addEventListener('click', function () { setOpen(false); btn.focus(); });

  input.addEventListener('input', function () {
    if (!local) return;
    push();
    if (input.value.trim() && !scrolled) { scrolled = true; toTopics(); }
  });

  box.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (local) { toTopics(); input.blur(); return; }
    /* 首頁以外：頁首這顆是**全站搜尋**，把字帶回首頁。 */
    location.href = home + (v ? '?q=' + encodeURIComponent(v) : '') + '#topics';
  });

  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); }
  });
  /* 點到頁首以外的地方就收起來（捲到結果去看不算）。 */
  addEventListener('pointerdown', function (e) {
    if (!open) return;
    if (box.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });

  if (local) {
    /* 站上那個搜尋框改了字，頁首這一個要跟上（同一個搜尋，兩個入口）。 */
    q.addEventListener('input', function () {
      if (document.activeElement !== input) input.value = q.value;
      render();
    });

    /* 從文章頁或著陸頁帶回來的 /?q=…#topics。
       ⚠ **不要順手 focus 輸入框** —— 一進站就彈出鍵盤，而他要看的是結果。
       ⚠ 捲動交給網址列上那個 #topics（index.html 那支開頁就捲好的腳本）。 */
    try {
      var qs = new URLSearchParams(location.search).get('q');
      if (qs) {
        q.value = qs;
        q.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (err) {}
  }

  place();
  addEventListener('resize', function () { if (open) place(); });
  setOpen(false);
})();
