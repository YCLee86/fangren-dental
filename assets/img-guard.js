/* 圖片的「順手保護」（2026-09-20，使用者指定）
   ---------------------------------------------------------------------------
   擋三件事：桌機的右鍵另存、拖曳到桌面、以及不吃 CSS 那條的瀏覽器的長按存圖。
   手機長按主要是靠 CSS 的 -webkit-touch-callout: none，這裡只是補位。

   ⚠⚠⚠ 這**擋不住有心的人，而且原理上做不到**。瀏覽器要把圖畫出來，就一定得先
   把檔案下載到使用者的電腦：開發者工具的 Network 分頁、把 JavaScript 關掉、
   或者直接截圖，每一條都繞得過任何前端手段。
   **真正有效的是另外三件**（都不在這支裡）：
   ・站上不放原檔 —— drafts 那個資料夾進不了 _site，外面拿得到的上限就是縮過的那幾張
     （最大的是文章 HERO 的 2000px，醫師頭像只有 400px）
   ・要再強就得加浮水印，那會動到畫面，還沒做也沒問過
   ・別站直接嵌我們的圖是 Cloudflare 後台的 Hotlink Protection 在管，不是這裡

   ⚠ **只擋 <img>，不擋整頁。** 整頁封右鍵會連「在新分頁開啟連結」「複製這段字」
     一起擋掉，那是在懲罰正常訪客，而且擋不到多出來的東西
     （想存圖的人本來就不靠右鍵）。
   ⚠ 站上的線稿底圖是 CSS 的 background-image、地圖是 inline SVG，
     兩者本來就沒有「另存圖片」這個選單項，不必也不能在這裡處理。
   ⚠ 用事件代理掛在 document 上，不逐張綁 —— 首頁有 21 張圖，
     而且文章卡是 build 產生的，逐張綁會漏掉之後新增的。
*/
(function () {
  function onImage(e) {
    var t = e.target;
    if (t && t.tagName === 'IMG') e.preventDefault();
  }
  document.addEventListener('contextmenu', onImage);
  document.addEventListener('dragstart', onImage);
})();
