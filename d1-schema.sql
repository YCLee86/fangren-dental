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
