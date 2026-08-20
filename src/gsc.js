/* =============================================================================
   Google Search Console — 服務帳戶登入與 sitemap 提交
   -----------------------------------------------------------------------------
   這一份 **同時給 Cloudflare Worker 與 Node 20 用**：
     ・Worker  → src/worker.js 的 scheduled()（每小時檢查 sitemap 有沒有變）
     ・Node    → tools/gsc-submit.mjs（手動提交、看狀態、查單一網址）
   所以裡面只准用兩邊都有的東西：fetch、crypto.subtle、TextEncoder、atob/btoa。
   **不要引入任何 npm 套件**（這個 repo 零依賴），也不要用 node: 開頭的模組。

   為什麼需要這個 —— Google 在 2023-06 把 sitemap 的 ping 端點
   （google.com/ping?sitemap=…）整個關掉了，那條路現在回 404。
   剩下唯一能程式化通知 Google 的方法就是 Search Console API 的
   sitemaps.submit，而它要求以「這個資源的擁有者」身分帶 OAuth token 呼叫。
   服務帳戶是唯一不會過期、不必有人按同意鈕的身分，所以走這條。

   設定步驟寫在 README.md「Search Console 自動提交」那一節。
   ============================================================================= */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://searchconsole.googleapis.com";

/* sitemaps.submit 要寫入權限，所以是 webmasters 而不是 webmasters.readonly。 */
export const SCOPE = "https://www.googleapis.com/auth/webmasters";

/* ---------- base64 ---------- */

/* btoa 只吃 latin1，所以先把 bytes 一個一個轉成字元，不要直接丟字串進去。
   分段是因為 String.fromCharCode(...arr) 在金鑰那種長度會爆呼叫堆疊。 */
function b64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

const b64url = (bytes) => b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const b64urlText = (str) => b64url(new TextEncoder().encode(str));

/* ---------- 服務帳戶金鑰 ---------- */

/* 傳進來的是 Google Cloud 下載的那份 JSON（字串或已解析的物件都收）。
   Worker 那邊來自 secret，Node 那邊來自檔案或環境變數。 */
export function parseServiceAccount(source) {
  const key = typeof source === "string" ? JSON.parse(source) : source;
  if (!key || typeof key !== "object") throw new Error("服務帳戶金鑰不是物件");
  if (key.type !== "service_account") {
    throw new Error(`這不是服務帳戶金鑰（type = ${key.type || "未指定"}）`);
  }
  if (!key.client_email || !key.private_key) {
    throw new Error("服務帳戶金鑰缺少 client_email 或 private_key");
  }
  return key;
}

/* PEM → PKCS#8 的原始 bytes。
   ⚠ 從環境變數傳進來的金鑰，換行常常是兩個字元的「反斜線 n」而不是真的換行，
      所以先還原一次；已經是真換行的不受影響。 */
function pkcs8(pem) {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----[A-Z ]+-----/g, "")
    .replace(/\s+/g, "");
  const raw = atob(body);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/* ---------- 取 access token ---------- */

/* 自己簽一份 JWT 再跟 Google 換 token（服務帳戶的標準流程）。
   token 有效一小時，這裡不快取 —— Worker 一小時才醒一次，快取沒有意義。 */
export async function accessToken(key, scope = SCOPE) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlText(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64urlText(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: TOKEN_URL,
      iat: now,
      /* 提早 30 秒到期，避免和 Google 那邊的時鐘差幾秒就被打回票 */
      exp: now + 3570,
    })
  );

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8(key.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(`${header}.${claim}`)
    )
  );

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${b64url(sig)}`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `取 access token 失敗（${res.status}）：${data.error_description || data.error || "無內容"}`
    );
  }
  return data.access_token;
}

/* ---------- Search Console API ---------- */

async function call(token, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  /* 提交成功時 Google 回 204 沒有 body，硬解 JSON 會炸掉 */
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = (data.error && data.error.message) || text || "無內容";
    throw new Error(`${init.method || "GET"} ${path} 失敗（${res.status}）：${msg}`);
  }
  return data;
}

/* 這個服務帳戶被授權看得到哪些資源 */
export const listSites = (token) => call(token, "/webmasters/v3/sites");

/* 把 https://fangren.net 對應到 Search Console 裡的資源代碼。
   ⚠ 同一個網域可能同時有兩種資源：
        網域資源      sc-domain:fangren.net       ← 涵蓋 www 與 http，優先選它
        網址前置字元  https://fangren.net/
   所以不要寫死，問過 Google 再決定；找不到就是服務帳戶還沒被加進使用者名單。 */
export async function resolveSite(token, siteUrl) {
  const host = new URL(siteUrl).hostname.replace(/^www\./, "");
  const { siteEntry = [] } = await listSites(token);
  const usable = siteEntry.filter((s) => s.permissionLevel !== "siteUnverifiedUser");

  const domain = usable.find((s) => s.siteUrl === `sc-domain:${host}`);
  if (domain) return domain.siteUrl;

  const prefix = usable.find((s) => {
    if (!s.siteUrl.startsWith("http")) return false;
    return new URL(s.siteUrl).hostname.replace(/^www\./, "") === host;
  });
  if (prefix) return prefix.siteUrl;

  throw new Error(
    `這個服務帳戶在 Search Console 裡看不到 ${host}。` +
      `目前看得到的是：${siteEntry.map((s) => s.siteUrl).join("、") || "（一個都沒有）"}。` +
      `請到 Search Console → 設定 → 使用者和權限，把服務帳戶的 email 加進去。`
  );
}

const feed = (site, sitemapUrl) =>
  `/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

/* 提交（其實是「重新提交」）。成功回 204，沒有內容。
   這個動作是冪等的，同一個網址提交幾次都不會重複建立。 */
export const submitSitemap = (token, site, sitemapUrl) =>
  call(token, feed(site, sitemapUrl), { method: "PUT" });

/* Google 這一側看到的狀態：上次下載時間、幾個網址、有沒有錯誤 */
export const getSitemap = (token, site, sitemapUrl) => call(token, feed(site, sitemapUrl));

/* 單一網址的索引狀態（URL Inspection API，唯讀，每天 2000 次額度） */
export const inspectUrl = (token, site, pageUrl) =>
  call(token, "/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: pageUrl, siteUrl: site }),
  });

/* ---------- 小工具 ---------- */

export async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
