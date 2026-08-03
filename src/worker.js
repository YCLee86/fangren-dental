/* =============================================================================
   芳仁牙醫診所部落格 — Cloudflare Worker
   -----------------------------------------------------------------------------
   wrangler.toml 開了 run_worker_first，所以每個請求都會先進到這裡——
   這是 www 轉址唯一的做法（詳見 wrangler.toml 的說明）。
   靜態檔案本身仍由 Cloudflare 的資產伺服器送出，這裡只是轉交。

   路由：
     www.* 開頭的主機名稱                        → 301 轉到主網域
     /preview/*                               → 要求密碼（見下方 PREVIEW_PREFIX）
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
   /preview/* — 未上線的改版提案頁，用 HTTP Basic 認證擋住
   -----------------------------------------------------------------------------
   密碼放在 Cloudflare 的 Secret（PREVIEW_PASSWORD），不進版控——這個 repo 是
   公開的，寫在程式碼裡等於沒鎖。帳號預設 preview，可用 PREVIEW_USER 覆寫。

   沒設密碼時一律擋下（回 503），不是放行。設定漏掉的代價只是自己看不到，
   放行的代價是整頁對外公開。

   注意：這只擋得住 fangren.net 這一側。同一份檔案在公開 repo 裡看得到，
   舊的 GitHub Pages 站（yclee86.github.io/fangren-dental/）也還吃得到，
   那邊沒有 Worker、擋不了——所以預覽頁本身也帶了 noindex。
   ============================================================================= */

const PREVIEW_PREFIX = "/preview/";

const askForPassword = () =>
  new Response("這一頁需要密碼。\n", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="fangren preview", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

/* 比較兩個字串但不洩漏「差在第幾個字」——先各自雜湊成固定長度再逐位元組比，
   長度也就一起藏住了。 */
async function sameSecret(a, b) {
  const digest = async (s) =>
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))
    );
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

async function guardPreview(request, env) {
  const expected = env.PREVIEW_PASSWORD;
  if (!expected) {
    return new Response(
      "預覽頁尚未設定密碼（Cloudflare Secret：PREVIEW_PASSWORD）。\n",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } }
    );
  }

  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return askForPassword();

  let decoded;
  try {
    // atob 給的是位元組，要自己轉成 UTF-8 才不會弄壞非 ASCII 密碼
    decoded = new TextDecoder().decode(
      Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
    );
  } catch {
    return askForPassword();
  }

  // 帳號不能含冒號，密碼可以，所以切第一個冒號就好
  const sep = decoded.indexOf(":");
  if (sep === -1) return askForPassword();

  const [okUser, okPass] = await Promise.all([
    sameSecret(decoded.slice(0, sep), env.PREVIEW_USER || "preview"),
    sameSecret(decoded.slice(sep + 1), expected),
  ]);
  if (!okUser || !okPass) return askForPassword();

  return null;   // null＝通過，交回去繼續走靜態檔
}

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
      const blocked = await guardPreview(request, env);
      if (blocked) return blocked;

      const page = await env.ASSETS.fetch(request);
      if (page.status === 404) return notFound(request, env);
      // 過了密碼才拿得到的東西，不要留在瀏覽器或中間的快取裡
      const guarded = new Response(page.body, page);
      guarded.headers.set("Cache-Control", "no-store");
      guarded.headers.set("X-Robots-Tag", "noindex, nofollow");
      return guarded;
    }

    const asset = await env.ASSETS.fetch(request);
    return asset.status === 404 ? notFound(request, env) : asset;
  },
};
