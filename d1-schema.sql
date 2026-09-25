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

-- =============================================================================
-- 搜尋紀錄（2026-09-20）
-- -----------------------------------------------------------------------------
-- ⚠ 這三張表**不必手動執行**：src/search.js 會在第一次用到的時候自己建
--    （CREATE TABLE IF NOT EXISTS，每個 isolate 只跑一次）。
--    寫在這裡是為了讓人一眼看得到資料長什麼樣，兩邊的定義必須一致。
--
-- 存的只有「字串、從哪一區搜的、搜到幾筆、什麼時候」。
-- **沒有 IP、沒有 User-Agent、沒有 cookie、沒有任何能串起同一個人的識別碼**——
-- 這是牙醫診所的站，訪客會打進去的字本身就可能涉及健康狀況。
-- 要加這類欄位之前先想清楚個資法那條線，不要順手加。
--
-- at 是 Worker 寫進來的 ISO 8601（UTC、帶 Z），不是 SQLite 的 datetime('now')：
-- ISO 字串照字典序排就是照時間排，而且丟進 JS 的 new Date() 不會被當成本地時間。
-- =============================================================================

CREATE TABLE IF NOT EXISTS search_log (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  q     TEXT    NOT NULL,              -- 正規化後的查詢字串（NFKC、空白收斂、小寫、最多 40 字）
  scope TEXT    NOT NULL DEFAULT 'home',  -- 'home' 或 'topic:<spec>'
  hits  INTEGER NOT NULL DEFAULT 0,    -- 當下畫面上搜到幾筆（0 ＝ 搜不到）
  at    TEXT    NOT NULL               -- 例：2026-09-20T07:15:03Z
);

CREATE INDEX IF NOT EXISTS idx_search_at ON search_log (at);
CREATE INDEX IF NOT EXISTS idx_search_q  ON search_log (q);

-- 每日收件上限，擋的是有人拿這個端點灌資料表（見 src/search.js 的 DAY_CAP）。
CREATE TABLE IF NOT EXISTS search_quota (
  day TEXT    PRIMARY KEY,
  n   INTEGER NOT NULL DEFAULT 0
);

-- =============================================================================
-- 點擊紀錄（2026-09-20）
-- -----------------------------------------------------------------------------
-- ⚠ 同上，**不必手動執行**：src/click.js 會在第一次用到的時候自己建。
--    寫在這裡是為了讓人一眼看得到資料長什麼樣，兩邊的定義必須一致。
--
-- 存的只有「按了哪一顆、在哪一頁、什麼時候」。
-- **沒有 IP、沒有 User-Agent、沒有 cookie，連「這次瀏覽的流水號」都沒有**——
-- 有流水號就能把同一個人的動作串成軌跡（看了植牙那篇 → 打電話），
-- 那和一張點擊次數表是兩種東西。要加之前先想清楚個資法那條線。
--
-- code  是白名單裡的代碼（src/click.js 的 FLAT 與 normCode，例如 tel、map:pin、
--       card:<slug>、chip:<spec>、theme:dark）。外面塞得進來的假代碼會被丟掉。
-- scope 是「從哪一頁按的」：home／topic:<spec>／post:<slug>。
-- =============================================================================

CREATE TABLE IF NOT EXISTS click_log (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  code  TEXT    NOT NULL,              -- 按了哪一顆（白名單代碼）
  scope TEXT    NOT NULL,              -- 從哪一頁按的
  at    TEXT    NOT NULL               -- 例：2026-09-20T07:15:03Z
);

CREATE INDEX IF NOT EXISTS idx_click_at   ON click_log (at);
CREATE INDEX IF NOT EXISTS idx_click_code ON click_log (code);

-- 每日收件上限（src/click.js 的 DAY_CAP）。同 search_quota，擋的是灌資料表。
CREATE TABLE IF NOT EXISTS click_quota (
  day TEXT    PRIMARY KEY,
  n   INTEGER NOT NULL DEFAULT 0
);

-- =============================================================================
-- 來源紀錄（2026-09-25）
-- -----------------------------------------------------------------------------
-- ⚠ 同上，**不必手動執行**：src/source.js 會在第一次用到的時候自己建。
--
-- 只在「從站外進來的那一下」記一筆，站內換頁不記。
-- **沒有 IP、沒有 User-Agent、沒有 cookie、沒有流水號**（同上兩張的紅線）。
--
-- src   歸好類的來源：google／line／facebook／gbp／direct／other…（src/source.js 的 BUCKETS 與 TAGS）
-- via   怎麼認出來的：tag（網址上的 ?from=）／ref（瀏覽器帶的 referrer）／none
-- host  referrer 的**網域**，只有 via=ref 才有。⚠ 整段網址不存（裡面可能帶著搜尋的字）
-- page  進站的第一頁：home／topic:<spec>／post:<slug>
-- =============================================================================

CREATE TABLE IF NOT EXISTS source_log (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  src  TEXT    NOT NULL,               -- 來源（歸好類的）
  via  TEXT    NOT NULL,               -- tag／ref／none
  host TEXT,                           -- referrer 的網域（只有 via=ref）
  page TEXT    NOT NULL,               -- 進站的第一頁
  at   TEXT    NOT NULL                -- 例：2026-09-25T07:15:03Z
);

CREATE INDEX IF NOT EXISTS idx_source_at  ON source_log (at);
CREATE INDEX IF NOT EXISTS idx_source_src ON source_log (src);

-- 每日收件上限（src/source.js 的 DAY_CAP）。
CREATE TABLE IF NOT EXISTS source_quota (
  day TEXT    PRIMARY KEY,
  n   INTEGER NOT NULL DEFAULT 0
);
