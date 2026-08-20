/* =============================================================================
   芳仁牙醫診所部落格 — Cloudflare Worker
   -----------------------------------------------------------------------------
   wrangler.toml 開了 run_worker_first，所以每個請求都會先進到這裡——
   這是 www 轉址唯一的做法（詳見 wrangler.toml 的說明）。
   靜態檔案本身仍由 Cloudflare 的資產伺服器送出，這裡只是轉交。

   路由：
     www.* 開頭的主機名稱                        → 301 轉到主網域（並升成 https）
     /history/*                               → 靜態檔＋noindex（見下方 HISTORY_PREFIX）
     GET  /api/views?slugs=home,bass-brushing → { "counts": { "home": 12, ... } }
     POST /api/views   body: { "slug": "home" } → { "slug": "home", "views": 13 }
     其他                                        → 靜態檔，沒有就給 404 頁

   另有一個排程（wrangler.toml 的 [triggers]，每小時一次）：sitemap 變了就
   通知 Google Search Console。見下方 syncSitemap()。

   只接受 src/allowed-slugs.js 裡列出的代碼，那份清單由 tools/build.mjs
   依實際文章自動產生，所以外部無法灌入不存在的頁面、把資料表塞爆。
   ============================================================================= */

import { ALLOWED } from "./allowed-slugs.js";
import {
  accessToken,
  parseServiceAccount,
  resolveSite,
  sha256,
  submitSitemap,
} from "./gsc.js";

const allowed = new Set(ALLOWED);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

async function getViews(url, env) {
  const wanted = (url.searchParams.get("slugs") || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => allowed.has(s));

  if (!wanted.length) return json({ counts: {} });

  // 先把要查的代碼都預設為 0，資料庫還沒有那一列時才不會是 undefined
  const counts = Object.fromEntries(wanted.map((s) => [s, 0]));

  const placeholders = wanted.map(() => "?").join(",");
  const { results } = await env.DB.prepare(
    `SELECT slug, views FROM page_views WHERE slug IN (${placeholders})`
  )
    .bind(...wanted)
    .all();

  for (const row of results || []) counts[row.slug] = row.views;

  return json({ counts });
}

async function postViews(request, env) {
  let slug;
  try {
    ({ slug } = await request.json());
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  if (!allowed.has(slug)) return json({ error: "unknown slug" }, 400);

  const row = await env.DB.prepare(
    `INSERT INTO page_views (slug, views, updated_at)
     VALUES (?, 1, datetime('now'))
     ON CONFLICT (slug) DO UPDATE
       SET views = views + 1, updated_at = datetime('now')
     RETURNING views`
  )
    .bind(slug)
    .first();

  return json({ slug, views: row ? row.views : 0 });
}

/* =============================================================================
   /history/* — 改版紀錄（原本的提案頁 /preview/*）
   -----------------------------------------------------------------------------
   2026-08-12：使用者要求「範例定稿上線後，範例頁面刪除，只留下歷史文本」。
   所以 /preview/ 整個拿掉了，改成 /history/ 底下一頁一個純文字存檔
   （推導、量測、落選案的數字）。提案頁本身的完整 HTML 留在 git 歷史裡，
   commit 5390136 之前都還原得回來。

   這裡只做一件事：**noindex**。搜尋引擎不必收錄這些內部紀錄
   （頁面自己也有 <meta name="robots">，robots.txt 也 Disallow: /history/）。
   ⚠ 沒有鎖 —— 拿到網址的人看得到，和以前的 /preview/ 一樣。
      **真的不能外流的東西不要放這裡。**

   ⚠ no-store 不再需要：提案頁改得很勤才怕拿到快取，紀錄是寫完就不動的。
   ============================================================================= */

/* /preview/* — 進行中的提案頁（2026-08-12 重新啟用）
   -----------------------------------------------------------------------------
   上面那一段說「/preview/ 整個拿掉了」，指的是**定案之後那一頁要刪掉**，
   不是這條路徑不再使用 —— CLAUDE.md 第八節的規則是：
   提案期間放 preview/<name>/，定案上線後刪頁、推導文字搬進 history/。
   所以兩條路徑同時存在，做的事也一樣：**只加 noindex**。

   ⚠ 提案頁改得很勤，這一條要 no-store —— 不然使用者在手機上重新整理
      拿到的還是上一版，會以為改沒生效。history/ 是寫完就不動的，不必。 */
const PREVIEW_PREFIX = "/preview/";

const HISTORY_PREFIX = "/history/";

/* 走到這裡代表沒有對應的檔案，補上自己的 404 頁 */
async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new URL("/404.html", request.url));
  return new Response(page.body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/* =============================================================================
   排程：sitemap 變了就重新提交給 Google Search Console
   -----------------------------------------------------------------------------
   為什麼要這一段 —— sitemap.xml 本來就會在每次 build 時重新產生（tools/build.mjs），
   但**產生**不等於**Google 知道**。Google 在 2023-06 關掉了 sitemap 的 ping 端點，
   現在唯一的程式化通知方式是 Search Console API 的 sitemaps.submit。

   為什麼放在 Worker 而不是建置流程 —— 這個 repo 沒有 GitHub Actions
   （gh token 沒有 workflow scope，.gitignore 也排除了 .github/），
   Cloudflare 的建置流程這一側我們碰不到。Worker 本來就跟著每次 push 部署，
   加一個 cron 是唯一不需要新基礎設施的做法。

   ⚠ 每小時只是「檢查」，不是「每小時提交一次」——
      sitemap 的內容雜湊沒變就直接跳過，一個 API 都不會打。
      所以實際提交次數 ≈ 發文次數，不會吃掉 Search Console 的額度。

   ⚠ 沒有設定 GSC_SERVICE_ACCOUNT 這個 secret 時整段直接跳過，不當成錯誤。
      設定步驟見 README.md「Search Console 自動提交」那一節。

   ⚠ 這一段**絕對不能影響 fetch()**。wrangler.toml 開了 run_worker_first，
      Worker 掛掉會連帶整站掛掉，所以 scheduled() 裡每一步都包在 try 裡，
      而且這裡不做任何 top-level 的事。
   ============================================================================= */

/* 正式網址。site.json 是給建置腳本讀的，Worker 讀不到那個檔，所以寫在這裡。
   換網域時兩邊都要改。 */
const SITE_ORIGIN = "https://fangren.net";

/* 提交狀態存這裡：上次提交的 sitemap 雜湊、時間、結果。
   要查就跑：
     wrangler d1 execute fangren-dental-views --remote --command "SELECT * FROM gsc_state" */
const STATE_TABLE = `CREATE TABLE IF NOT EXISTS gsc_state (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;

async function readState(env, key) {
  const row = await env.DB.prepare("SELECT value FROM gsc_state WHERE key = ?").bind(key).first();
  return row ? row.value : null;
}

const writeState = (env, key, value) =>
  env.DB.prepare(
    `INSERT INTO gsc_state (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  )
    .bind(key, value)
    .run();

async function syncSitemap(env) {
  if (!env.GSC_SERVICE_ACCOUNT) return "略過：沒有設定 GSC_SERVICE_ACCOUNT";

  /* 表格自己建，這樣忘了套 d1-schema.sql 也不會整段失效 */
  await env.DB.prepare(STATE_TABLE).run();

  /* 讀的是已經部署出去的那一份，不是 repo 裡的 —— 我們要確認的是
     「Google 現在去抓會拿到什麼」，所以要問資產伺服器。 */
  const res = await env.ASSETS.fetch(new URL("/sitemap.xml", SITE_ORIGIN));
  if (!res.ok) throw new Error(`讀不到 /sitemap.xml（${res.status}）`);
  const hash = await sha256(await res.text());

  if ((await readState(env, "sitemap_hash")) === hash) return "略過：sitemap 沒有變動";

  const token = await accessToken(parseServiceAccount(env.GSC_SERVICE_ACCOUNT));
  const site = await resolveSite(token, SITE_ORIGIN);
  await submitSitemap(token, site, `${SITE_ORIGIN}/sitemap.xml`);

  /* 雜湊最後才寫。中途任何一步失敗都不會寫進去，下一個整點會自己再試一次。 */
  await writeState(env, "sitemap_hash", hash);
  await writeState(env, "last_site", site);
  return `已提交 ${SITE_ORIGIN}/sitemap.xml 到 ${site}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* www 一律轉到主網域，同一份內容才不會有兩個網址。
       協定也要一起升上去——只切掉 www. 的話，http://www.fangren.net/
       會轉到 http://fangren.net/ 而停在非加密版，Google 得再繞一手才走到
       canonical 指的 https。2026-08-10 從 Search Console 的
       「頁面會重新導向」追出來的（那一筆就是 http://www.fangren.net/）。
       非 www 的 http 不歸這裡管，那要靠 Cloudflare 的 Always Use HTTPS。 */
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/api/views") {
      if (request.method === "GET") return getViews(url, env);
      if (request.method === "POST") return postViews(request, env);
      return json({ error: "method not allowed" }, 405);
    }

    if (url.pathname.startsWith(HISTORY_PREFIX)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status === 404) return notFound(request, env);
      const archive = new Response(page.body, page);
      archive.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return archive;
    }

    if (url.pathname.startsWith(PREVIEW_PREFIX)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status === 404) return notFound(request, env);
      const draft = new Response(page.body, page);
      draft.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      draft.headers.set("Cache-Control", "no-store");
      return draft;
    }

    const asset = await env.ASSETS.fetch(request);
    return asset.status === 404 ? notFound(request, env) : asset;
  },

  /* Cloudflare 依 wrangler.toml 的 cron 呼叫這裡。
     失敗只記在 D1 與 log 裡，不往外丟 —— 排程失敗不該影響任何一個訪客。 */
  async scheduled(event, env, ctx) {
    try {
      console.log("[gsc]", await syncSitemap(env));
    } catch (err) {
      console.error("[gsc] 失敗：", err.message);
      try {
        await writeState(env, "last_error", `${new Date().toISOString()} ${err.message}`);
      } catch {
        /* D1 也壞掉的話就只剩 log，不要再往上丟 */
      }
    }
  },
};
