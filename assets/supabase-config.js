/* ==========================================================================
   Supabase 連線設定
   --------------------------------------------------------------------------
   把 Supabase 專案的 Project URL 與 anon public key 填進來即可啟用瀏覽計數。
   這兩個值本來就是要公開在瀏覽器端的，安全性由資料庫的 RLS policy 負責
   （見 supabase-setup.sql）。

   兩個值都留白時，計數器會自動隱藏，網站其他功能完全不受影響。
   ========================================================================== */
window.SUPABASE_CONFIG = {
  url: "",       // 例如 "https://abcdefghijklm.supabase.co"
  anonKey: ""    // 例如 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
};
