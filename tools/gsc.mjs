/* ==========================================================================
   Google Search Console API 客戶端（純 Node、零依賴）

   ⚠ 為什麼自己寫：這個 repo 的規矩是**沒有任何 npm 依賴**（CLAUDE.md 第三節），
     而官方的 googleapis 套件會拖進上百個相依。實際上需要的只有三件事：
     ① 用服務帳戶的私鑰簽一份 JWT ② 拿它換 access token ③ 帶著 token 打 REST。
     三件 node:crypto ＋ fetch 都做得到。

   ── 這一支能做什麼、不能做什麼（2026-09-20 從 API 的 discovery 文件逐項查過）──
   ✅ 搜尋成效報表（searchanalytics.query）：字詞、曝光、點擊、排名、哪一頁
   ✅ 索引狀態檢查（urlInspection.index.inspect）：Google 收了沒、最後爬是哪天、
      它認定的 canonical 是哪一個
   ✅ sitemap 的收錄數與錯誤（sitemaps.list）
   ❌ **「要求建立索引」做不到** —— GSC API 整組沒有這個方法。
      urlInspection 是**唯讀**的，只能查不能催。
      ⚠ 另一支 Indexing API（indexing.googleapis.com/urlNotifications:publish）
      看起來像可以，但 Google 明文限定**只吃 JobPosting 與 BroadcastEvent**
      兩種結構化資料 —— 牙醫部落格送進去不會生效，而且**這條限制在 API 的
      schema 裡看不出來**（只寫在文件裡），所以不要看到方法名就以為能用。
      要催索引仍然只有一條路：使用者自己開 GSC 後台「網址審查 → 要求建立索引」
      （CLAUDE.md 第七節那句話**沒有被這一支取代**）。

   ── ⚠⚠ 金鑰：絕對不要進版控 ──────────────────────────────────────────
   **這個 repo 是 public 的。** 服務帳戶金鑰是純文字 JSON，commit 進去等於公開，
   而且 git 歷史清不掉。`.gitignore` 已經擋了 `.gsc-key.json`，但**不要靠它** ——
   push 之前用 `git diff --cached --name-only` 看一眼。
   金鑰被外流時要做的事：Google Cloud Console → 服務帳戶 → 金鑰 → 刪掉那一把。

   金鑰的找法（依序，找到第一個就用）：
     1. 環境變數 GSC_KEY_FILE ＝ 金鑰檔的路徑
     2. 環境變數 GSC_KEY      ＝ 金鑰的 JSON 內容本身（雲端 session 用這個最省事）
     3. <repo>/.gsc-key.json                     （已被 .gitignore 擋掉）
     4. ~/.config/fangren-gsc-key.json           （在 repo 外面，自己的電腦用這個）

   ── ⚠ 最容易卡住的一關：服務帳戶「有金鑰」不等於「有權限」───────────────
     金鑰只證明「你是這個服務帳戶」，不代表它看得到這個網站。
     還要去 **Search Console 後台 → 設定 → 使用者和權限 → 新增使用者**，
     把金鑰裡那個 client_email（長得像 xxx@yyy.iam.gserviceaccount.com）
     加成使用者（權限選「完整」或「受限」都可以，讀報表用「受限」就夠）。
     **沒加的症狀是 403 不是 401** —— 401 ＝ 金鑰本身有問題，
     403 ＝ 金鑰沒問題但這個帳戶沒被授權。兩者要分開查，這一支會直接講。

   ── ⚠ 資源名稱有兩種，不要猜 ────────────────────────────────────────
     GSC 的「資源」分兩型，字串長得完全不一樣：
       網域資源     sc-domain:fangren.net      （涵蓋 www、http、所有子網域）
       網址前置字元 https://fangren.net/       （⚠ 結尾那條斜線是有意義的）
     猜錯會回 403（看起來像沒權限，其實是打錯資源）。
     所以這一支**不猜** —— 先跑 sites.list 把真的有的列出來再挑，
     使用者也可以用 --site 指定。

   ── ⚠ 報表有時差 ──────────────────────────────────────────────────
     Search Console 的資料落後大約 2~3 天，最近兩天常常是空的或偏低。
     所以預設的區間是「結束於 3 天前、往前 28 天」，不是「到今天」。
     看到最近幾天掉下來，先確認是不是這個，不要當成排名掉了。

   ── 用法 ────────────────────────────────────────────────────────────
     node tools/gsc.mjs selftest          # 不需要金鑰，驗簽章那一段是對的
     node tools/gsc.mjs sites             # 這個帳戶看得到哪些資源（先跑這個）
     node tools/gsc.mjs query             # 搜尋字詞（預設 28 天、前 50 名）
     node tools/gsc.mjs query --by page   # 改看哪一頁來的流量
     node tools/gsc.mjs query --by query,page --rows 100 --days 90
     node tools/gsc.mjs inspect /posts/bass-brushing/
     node tools/gsc.mjs sitemaps
   共用參數：--site <資源> --json（吐原始 JSON，給別的腳本接）
   ========================================================================== */

import { createSign, generateKeyPairSync, createVerify } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = JSON.parse(readFileSync(join(ROOT, 'site.json'), 'utf8')).url;

/* 讀報表只需要唯讀。要 sitemaps.submit 才需要可寫的那一個 ——
   權限一律給最小的，所以這裡寫死唯讀。 */
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const WM = 'https://www.googleapis.com/webmasters/v3';
const SC = 'https://searchconsole.googleapis.com/v1';

/* ---- 小工具 ------------------------------------------------------------ */
const b64url = buf => Buffer.from(buf).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const die = (msg) => { console.error('\n✖ ' + msg + '\n'); process.exit(1); };

/* 日期用 UTC 算。⚠ 不要用 toLocaleDateString —— 容器的時區和使用者的不一樣，
   會差一天，而報表的日期是 Google 那邊的日曆日。 */
const ymd = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d; };

/* ---- 金鑰 -------------------------------------------------------------- */
function loadKey() {
  const tried = [];
  let raw = null, from = '';

  if (process.env.GSC_KEY_FILE) {
    tried.push('GSC_KEY_FILE=' + process.env.GSC_KEY_FILE);
    if (existsSync(process.env.GSC_KEY_FILE)) {
      raw = readFileSync(process.env.GSC_KEY_FILE, 'utf8'); from = process.env.GSC_KEY_FILE;
    }
  }
  if (!raw && process.env.GSC_KEY) { raw = process.env.GSC_KEY; from = '環境變數 GSC_KEY'; }
  if (!raw) {
    for (const p of [join(ROOT, '.gsc-key.json'), join(homedir(), '.config', 'fangren-gsc-key.json')]) {
      tried.push(p);
      if (existsSync(p)) { raw = readFileSync(p, 'utf8'); from = p; break; }
    }
  }
  if (!raw) {
    die('找不到服務帳戶金鑰。找過這幾個地方：\n    ' + tried.join('\n    ') +
        '\n\n  拿到金鑰之後，最省事的放法（雲端 session）：\n' +
        '    export GSC_KEY="$(cat 你的金鑰.json)"\n' +
        '  自己的電腦則放到 ~/.config/fangren-gsc-key.json（在 repo 外面，不會被 commit）。');
  }

  let k;
  try { k = JSON.parse(raw); }
  catch { die('金鑰不是合法的 JSON（來源：' + from + '）。要的是 Google Cloud 下載的那一份，不是貼一段文字。'); }

  /* 四道守門 —— 拿錯檔案是最常見的開頭，而且錯誤訊息會很難懂。
     ⚠ 特別要擋「OAuth 用戶端」那一份（installed/web），它長得也像 JSON、
       也是從同一個後台下載的，但**沒有 private_key**，拿來簽會在
       createSign 那一行才炸，訊息是看不懂的 OpenSSL 錯誤。 */
  if (k.installed || k.web) {
    die('這是「OAuth 用戶端」的檔案，不是「服務帳戶」金鑰。\n' +
        '  兩個都在 Google Cloud Console 下載得到，但要的是後者 ——\n' +
        '  服務帳戶那一份裡面有 "type": "service_account" 與 "private_key"。');
  }
  if (k.type !== 'service_account') die('金鑰的 type 是 "' + k.type + '"，要的是 "service_account"。');
  if (!k.private_key || !k.client_email) die('金鑰裡缺 private_key 或 client_email，檔案可能不完整。');
  if (!/BEGIN PRIVATE KEY/.test(k.private_key)) die('private_key 的格式不對（少了 PEM 的開頭）。');

  return { ...k, _from: from };
}

/* ---- 簽 JWT → 換 access token ----------------------------------------- */
function signJWT(key, { scope = SCOPE, aud = TOKEN_URL, now = Math.floor(Date.now() / 1000) } = {}) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  /* exp 最多只能是 1 小時後，Google 會擋更長的。 */
  const claim = b64url(JSON.stringify({
    iss: key.client_email, scope, aud, iat: now, exp: now + 3600,
  }));
  const body = header + '.' + claim;
  const sig = b64url(createSign('RSA-SHA256').update(body).sign(key.private_key));
  return body + '.' + sig;
}

let _token = null;
async function token(key) {
  if (_token && _token.exp > Date.now() / 1000 + 60) return _token.value;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signJWT(key),
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    /* invalid_grant 幾乎一定是這三件之一，直接講，不要讓人去猜。 */
    const hint = j.error === 'invalid_grant'
      ? '\n  這個錯誤通常是：① 容器的時鐘偏掉了（JWT 的 iat/exp 對不上）' +
        '\n                  ② 金鑰已經在 Google Cloud 後台被刪掉或停用' +
        '\n                  ③ 服務帳戶整個被刪了'
      : j.error === 'invalid_client'
        ? '\n  服務帳戶不存在，或金鑰不屬於這個帳戶。'
        : '';
    die('拿不到 access token（HTTP ' + res.status + '）：' +
        (j.error_description || j.error || JSON.stringify(j)) + hint);
  }
  _token = { value: j.access_token, exp: Math.floor(Date.now() / 1000) + (j.expires_in || 3600) };
  return _token.value;
}

/* ---- 打 API ------------------------------------------------------------ */
async function api(key, url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      authorization: 'Bearer ' + await token(key),
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let j = null; try { j = JSON.parse(text); } catch { /* 有些錯誤回的是 HTML */ }

  if (!res.ok) {
    const msg = j?.error?.message || text.slice(0, 300);
    if (res.status === 403) {
      die('403 —— 金鑰是好的，但這個服務帳戶沒有這個資源的權限。\n' +
          '  Google 說：' + msg + '\n\n' +
          '  最可能的兩件（依機率）：\n' +
          '    ① 還沒把它加進 Search Console。去後台 → 設定 → 使用者和權限 →\n' +
          '       新增使用者，填：' + key.client_email + '\n' +
          '    ② 資源名稱打錯。先跑 `node tools/gsc.mjs sites` 看真正的名字，\n' +
          '       網域資源是 sc-domain:fangren.net，前置字元是 https://fangren.net/（有尾斜線）。');
    }
    if (res.status === 429) die('429 —— 超過配額。URL 檢查每個資源每天 2000 次、每分鐘 600 次。等一下再試。');
    die('HTTP ' + res.status + '：' + msg);
  }
  return j ?? {};
}

/* ---- 挑資源 ------------------------------------------------------------ */
async function pickSite(key, want) {
  const list = (await api(key, WM + '/sites')).siteEntry || [];
  if (!list.length) {
    die('這個服務帳戶在 Search Console 裡看不到任何資源。\n' +
        '  去後台 → 設定 → 使用者和權限 → 新增使用者，填：' + key.client_email);
  }
  if (want) {
    const hit = list.find(s => s.siteUrl === want);
    if (!hit) {
      die('指定的資源 "' + want + '" 不在清單裡。看得到的是：\n    ' +
          list.map(s => s.siteUrl).join('\n    '));
    }
    return hit.siteUrl;
  }
  /* 沒指定就照這個順序挑：本站的網域資源 → 本站的前置字元 → 只有一個就用它。
     ⚠ 不要「挑第一個」—— 這個帳戶可能同時管別的網站。 */
  const host = new URL(SITE).host;
  const pref = [
    'sc-domain:' + host,
    SITE.replace(/\/*$/, '/'),
  ];
  for (const p of pref) { const hit = list.find(s => s.siteUrl === p); if (hit) return hit.siteUrl; }
  if (list.length === 1) return list[0].siteUrl;
  die('看得到好幾個資源，但沒有一個對得上 ' + SITE + '。用 --site 指定：\n    ' +
      list.map(s => s.siteUrl).join('\n    '));
}

/* ---- 輸出 -------------------------------------------------------------- */
/* ⚠ 中文字在終端機佔兩格，用 .length 對齊會歪掉 —— 要算顯示寬度。 */
const width = s => [...String(s)].reduce((n, c) =>
  n + (/[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(c) ? 2 : 1), 0);
const pad = (s, w, right = false) => {
  const gap = Math.max(0, w - width(s));
  return right ? ' '.repeat(gap) + s : s + ' '.repeat(gap);
};
function table(head, rows, rightCols = []) {
  if (!rows.length) { console.log('  （沒有資料）'); return; }
  const w = head.map((h, i) => Math.max(width(h), ...rows.map(r => width(r[i] ?? ''))));
  const line = (cells) => '  ' + cells.map((c, i) => pad(c ?? '', w[i], rightCols.includes(i))).join('  ').trimEnd();
  console.log(line(head));
  console.log('  ' + w.map(n => '─'.repeat(n)).join('  '));
  rows.forEach(r => console.log(line(r.map(String))));
}

/* ---- 各個子指令 -------------------------------------------------------- */
const CMD = {
  async sites(key, args) {
    const list = (await api(key, WM + '/sites')).siteEntry || [];
    if (args.json) return console.log(JSON.stringify(list, null, 2));
    console.log('\n這個服務帳戶（' + key.client_email + '）看得到的資源：\n');
    table(['資源', '權限'], list.map(s => [s.siteUrl, s.permissionLevel]));
    console.log('');
  },

  async query(key, args) {
    const site = await pickSite(key, args.site);
    const days = Number(args.days || 28);
    /* 結束於 3 天前 —— 報表有時差，見檔頭。 */
    const lag = Number(args.lag ?? 3);
    const endDate = args.end || ymd(daysAgo(lag));
    const startDate = args.start || ymd(daysAgo(lag + days - 1));
    const dimensions = String(args.by || 'query').split(',').map(s => s.trim()).filter(Boolean);

    const body = {
      startDate, endDate, dimensions,
      rowLimit: Number(args.rows || 50),
      dataState: 'final',
    };
    const out = await api(key, WM + '/sites/' + encodeURIComponent(site) + '/searchAnalytics/query',
      { method: 'POST', body });
    if (args.json) return console.log(JSON.stringify(out, null, 2));

    const rows = out.rows || [];
    console.log('\n' + site + '　' + startDate + ' ~ ' + endDate + '（' + days + ' 天）');
    console.log('維度：' + dimensions.join(' × ') + '　共 ' + rows.length + ' 列\n');
    if (rows.length) {
      const tot = rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
      console.log('  合計　點擊 ' + tot.c + '　曝光 ' + tot.i +
        '　點閱率 ' + (tot.i ? (tot.c / tot.i * 100).toFixed(1) : '0.0') + '%\n');
    }
    table(
      [...dimensions, '點擊', '曝光', '點閱率', '平均排名'],
      rows.map(r => [
        ...r.keys,
        r.clicks, r.impressions,
        (r.ctr * 100).toFixed(1) + '%',
        r.position.toFixed(1),
      ]),
      dimensions.map((_, i) => [i + 1, i + 2, i + 3, i + 4]).flat().filter(n => n >= dimensions.length),
    );
    console.log('');
  },

  async inspect(key, args) {
    const site = await pickSite(key, args.site);
    if (!args._.length) die('要給網址。例：node tools/gsc.mjs inspect /posts/bass-brushing/');
    console.log('');
    for (const raw of args._) {
      /* 給相對路徑就補成完整網址，省得每次打一長串。 */
      const url = /^https?:/.test(raw) ? raw : SITE.replace(/\/$/, '') + (raw.startsWith('/') ? raw : '/' + raw);
      const out = await api(key, SC + '/urlInspection/index:inspect',
        { method: 'POST', body: { inspectionUrl: url, siteUrl: site, languageCode: 'zh-TW' } });
      if (args.json) { console.log(JSON.stringify(out, null, 2)); continue; }

      const r = out.inspectionResult || {};
      const i = r.indexStatusResult || {};
      console.log('  ' + url);
      console.log('    收錄狀態　' + (i.coverageState || '（不明）'));
      console.log('    判定　　　' + (i.verdict || '—') + '　　robots：' + (i.robotsTxtState || '—'));
      console.log('    最後檢索　' + (i.lastCrawlTime ? i.lastCrawlTime.slice(0, 10) : '（還沒爬過）'));
      console.log('    它認定的 canonical　' + (i.googleCanonical || '—'));
      console.log('    我們宣告的 canonical　' + (i.userCanonical || '—'));
      if (i.googleCanonical && i.userCanonical && i.googleCanonical !== i.userCanonical) {
        console.log('    ⚠ 兩個 canonical 不一樣 —— Google 把這一頁併到別頁去了');
      }
      if (r.mobileUsabilityResult?.verdict) console.log('    手機好用度　' + r.mobileUsabilityResult.verdict);
      const rich = r.richResultsResult;
      if (rich) {
        console.log('    結構化資料　' + rich.verdict +
          (rich.detectedItems?.length ? '（' + rich.detectedItems.map(d => d.richResultType).join('、') + '）' : ''));
      }
      console.log('    後台連結　' + (r.inspectionResultLink || '—'));
      console.log('');
    }
  },

  async sitemaps(key, args) {
    const site = await pickSite(key, args.site);
    const list = (await api(key, WM + '/sites/' + encodeURIComponent(site) + '/sitemaps')).sitemap || [];
    if (args.json) return console.log(JSON.stringify(list, null, 2));
    console.log('\n' + site + ' 的 sitemap：\n');
    table(['檔案', '最後下載', '收錄數', '錯誤', '警告'], list.map(s => [
      s.path,
      s.lastDownloaded ? s.lastDownloaded.slice(0, 10) : '（還沒抓過）',
      (s.contents || []).reduce((a, c) => a + Number(c.submitted || 0), 0) || '—',
      s.errors || 0, s.warnings || 0,
    ]), [2, 3, 4]);
    console.log('');
  },

  /* 不需要金鑰 —— 只驗「簽章那一段的數學是對的」。
     ⚠ 這證明不了 Google 會接受，只證明我們沒有把 JWT 組壞。
       真的能不能連要等真金鑰，那一步是 `sites`。 */
  async selftest() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
    const fake = { client_email: 'selftest@example.iam.gserviceaccount.com', private_key: pem };
    const now = 1_700_000_000;
    const jwt = signJWT(fake, { now });
    const [h, c, s] = jwt.split('.');

    const ok = [];
    const un = t => Buffer.from(t.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const H = JSON.parse(un(h)), C = JSON.parse(un(c));

    ok.push(['三段式結構', jwt.split('.').length === 3]);
    ok.push(['header 是 RS256', H.alg === 'RS256' && H.typ === 'JWT']);
    ok.push(['iss ＝ client_email', C.iss === fake.client_email]);
    ok.push(['aud ＝ token 端點', C.aud === TOKEN_URL]);
    ok.push(['scope 是唯讀的那一個', C.scope === SCOPE]);
    ok.push(['exp ＝ iat + 3600（不超過上限）', C.exp - C.iat === 3600]);
    ok.push(['base64url 沒有留下 + / =', !/[+/=]/.test(jwt)]);
    ok.push(['簽章驗得過', createVerify('RSA-SHA256').update(h + '.' + c)
      .verify(publicKey, Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64'))]);
    /* 改一個位元組就該驗不過 —— 確認上面那一條不是恆真。 */
    ok.push(['竄改後驗不過（反證）', !createVerify('RSA-SHA256').update(h + '.' + c + 'x')
      .verify(publicKey, Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64'))]);
    ok.push(['中文對齊：寬度算得對', width('牙周病') === 6 && width('abc') === 3]);

    console.log('\n簽章自我測試（不需要金鑰）\n');
    ok.forEach(([n, p]) => console.log('  ' + (p ? '✓' : '✖') + ' ' + n));
    const bad = ok.filter(([, p]) => !p).length;
    console.log('\n  ' + (ok.length - bad) + '/' + ok.length + (bad ? '　✖ 有失敗' : '　全部通過') + '\n');
    if (bad) process.exit(1);
  },
};

/* ---- 參數 -------------------------------------------------------------- */
function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const k = t.slice(2);
      if (k === 'json') a.json = true;
      else a[k] = argv[++i];
    } else a._.push(t);
  }
  return a;
}

const [, , cmd, ...rest] = process.argv;
if (!cmd || !CMD[cmd]) {
  console.log(`
Google Search Console（芳仁）

  node tools/gsc.mjs selftest            不需要金鑰，驗簽章那一段
  node tools/gsc.mjs sites               這個帳戶看得到哪些資源（先跑這個）
  node tools/gsc.mjs query               搜尋字詞（28 天、前 50）
  node tools/gsc.mjs query --by page     改看哪一頁
  node tools/gsc.mjs query --by query,page --rows 100 --days 90
  node tools/gsc.mjs inspect /posts/bass-brushing/     這一頁 Google 收了沒
  node tools/gsc.mjs sitemaps            sitemap 的收錄數與錯誤

  共用：--site <資源>  --json
  ⚠ 「要求建立索引」API 做不到，只能在 GSC 後台手動按（見本檔檔頭）。
`);
  process.exit(cmd ? 1 : 0);
}
const args = parseArgs(rest);
const key = cmd === 'selftest' ? null : loadKey();
if (key && !args.json) console.error('（金鑰來源：' + key._from + '）');
await CMD[cmd](key, args);
