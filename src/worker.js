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

/* 走到這裡代表沒有對應的檔案，補上自己的 404 頁。
   ⚠⚠ **404 一定要 no-store**（2026-08-25 踩過，追了七八輪）——
   Cloudflare 會把 404 也快取起來，而這一站的網址是**會長出來的**
   （新文章、新的著陸頁、剛加的 /version.txt）。在檔案還沒上線之前
   有人先打開過那個網址，那個 404 就被存住了，之後檔案明明已經上線，
   使用者拿到的還是 404，連無痕視窗都一樣（無痕跳過的是自己手機的快取，
   跳不過邊緣的）。 */
async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new URL("/404.html", request.url));
  return new Response(page.body, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
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

    if (url.pathname.startsWith(PREVIEW_PREFIX)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status === 404) return notFound(request, env);
      const draft = new Response(page.body, page);
      draft.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      draft.headers.set("Cache-Control", "no-store");
      return draft;
    }

    /* -----------------------------------------------------------------------
       /version.txt —— 這一次建置的真值，絕對不可以被快取（2026-08-25）
       -----------------------------------------------------------------------
       它存在的唯一理由是回答「線上現在跑的是哪一版」。被快取住的話它會說謊，
       而且是在最需要它說實話的時候說謊 —— 這正是它上線那天發生的事：
       網址在建置完成之前就被打開，拿到 404，那個 404 被邊緣快取住，
       之後怎麼重新整理（含無痕）都還是 404。 */
    if (url.pathname === "/version.txt") {
      const stamp = await env.ASSETS.fetch(request);
      const fresh = new Response(stamp.body, stamp);
      fresh.headers.set("Cache-Control", "no-store");
      fresh.headers.set("Content-Type", "text/plain; charset=utf-8");
      return fresh;
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404) return notFound(request, env);

    /* -----------------------------------------------------------------------
       HTML 一律「每次都回來問一下」（2026-08-25）
       -----------------------------------------------------------------------
       這一站的 HTML 沒有內容雜湊在檔名上（網址就是 /topics/prosth/），
       所以只要有任何一層把舊的 HTML 存起來，改版就會「有時候看得到、
       重新整理又不見」——2026-08-25 花了七八輪在追這件事，成因就在這裡。
       圖片、樣式表、JS 不動（它們改動的頻率低很多，而且改了通常連 HTML
       一起改）。no-cache 不是「不要快取」，是「可以存，但每次都要回來
       驗一下有沒有變」——沒變的話回 304，幾乎不花流量。 */
    const type = asset.headers.get("Content-Type") || "";
    if (type.includes("text/html")) {
      const page = new Response(asset.body, asset);
      page.headers.set("Cache-Control", "no-cache");
      return page;
    }
    return asset;
  },
};
