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

   只接受 src/allowed-slugs.js 裡列出的代碼，那份清單由 tools/build.mjs
   依實際文章自動產生，所以外部無法灌入不存在的頁面、把資料表塞爆。
   ============================================================================= */

import { ALLOWED } from "./allowed-slugs.js";

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

const HISTORY_PREFIX = "/history/";

/* 走到這裡代表沒有對應的檔案，補上自己的 404 頁 */
async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new URL("/404.html", request.url));
  return new Response(page.body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
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

    const asset = await env.ASSETS.fetch(request);
    return asset.status === 404 ? notFound(request, env) : asset;
  },
};
