/* =============================================================================
   芳仁牙醫診所部落格 — Cloudflare Worker
   -----------------------------------------------------------------------------
   wrangler.toml 開了 run_worker_first，所以每個請求都會先進到這裡——
   這是 www 轉址唯一的做法（詳見 wrangler.toml 的說明）。
   靜態檔案本身仍由 Cloudflare 的資產伺服器送出，這裡只是轉交。

   路由：
     www.* 開頭的主機名稱                        → 301 轉到主網域
     /preview/*                               → 靜態檔＋noindex／no-store（見下方 PREVIEW_PREFIX）
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
   /preview/* — 未上線的改版提案頁
   -----------------------------------------------------------------------------
   2026-08-06：原本這裡有一道 HTTP Basic 密碼閘，使用者要求拿掉。
   理由與現況：

   - 那道鎖本來就只擋得住 fangren.net 這一側。這個 repo 是**公開的**，
     同一份 HTML 在 GitHub 上任何人都讀得到。
   - 密碼放在 Cloudflare Secret（PREVIEW_PASSWORD），而那個 secret 從來沒設過，
     所以閘門一直在回 503——等於預覽頁在正式網域上根本打不開，
     連自己用手機看都看不到。
   - 使用者的判斷是「沒有網址別人也看不到」，並要求改成不鎖。

   所以現在只留兩件事：**noindex** 讓搜尋引擎不要收錄
   （頁面自己也有 <meta name="robots">，robots.txt 也 Disallow: /preview/），
   以及 **no-store**，手機才不會拿到快取住的舊版提案。

   ⚠ 這代表 /preview/ 底下的東西等同對外公開，只是沒有連結指過去。
   **真的不能外流的東西不要放這裡。**
   ============================================================================= */

const PREVIEW_PREFIX = "/preview/";

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

    /* www 一律轉到主網域，同一份內容才不會有兩個網址 */
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/api/views") {
      if (request.method === "GET") return getViews(url, env);
      if (request.method === "POST") return postViews(request, env);
      return json({ error: "method not allowed" }, 405);
    }

    if (url.pathname.startsWith(PREVIEW_PREFIX)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status === 404) return notFound(request, env);
      // 不收錄、不快取：提案頁改得很勤，手機不能拿到舊的那一版
      const preview = new Response(page.body, page);
      preview.headers.set("Cache-Control", "no-store");
      preview.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return preview;
    }

    const asset = await env.ASSETS.fetch(request);
    return asset.status === 404 ? notFound(request, env) : asset;
  },
};
