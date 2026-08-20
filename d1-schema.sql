-- =============================================================================
-- 芳仁牙醫診所部落格 — 瀏覽計數器資料表（Cloudflare D1）
-- 套用方式：
--   wrangler d1 execute fangren-dental-views --remote --file=d1-schema.sql
-- 這份指令可以重複執行，不會覆蓋既有資料。
-- =============================================================================

CREATE TABLE IF NOT EXISTS page_views (
  slug       TEXT    PRIMARY KEY,
  views      INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- 首頁本身也算一筆，先建好避免第一次讀取時是空的
INSERT INTO page_views (slug, views) VALUES ('home', 0)
  ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Search Console 自動提交的狀態（src/worker.js 的 syncSitemap）
-- 目前會用到三個 key：
--   sitemap_hash  上次成功提交的那一份 sitemap.xml 的 SHA-256
--   last_site     上次提交到哪個 Search Console 資源（sc-domain:… 或網址前置）
--   last_error    上次失敗的時間與訊息（成功時不會清掉，當作歷史紀錄看）
--
-- Worker 自己也會 CREATE TABLE IF NOT EXISTS，所以忘了跑這一段也不會壞，
-- 列在這裡是為了讓資料表的定義有一個看得到的出處。
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS gsc_state (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
