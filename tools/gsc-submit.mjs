#!/usr/bin/env node
/* =============================================================================
   Google Search Console — 手動提交 sitemap／看狀態／查索引
   -----------------------------------------------------------------------------
   平常不必跑這一支：Worker 每小時會自己檢查，sitemap 變了就提交
   （src/worker.js 的 syncSitemap，設定見 README.md）。
   這一支是給三種情況用的：

     node tools/gsc-submit.mjs              提交 sitemap，然後印 Google 那一側的狀態
     node tools/gsc-submit.mjs --status     只看狀態，不提交
     node tools/gsc-submit.mjs --inspect    逐一查 sitemap 裡每個網址收錄了沒
     node tools/gsc-submit.mjs --inspect <網址>   只查一個

   金鑰從這三個地方找（由上往下）：
     --key <路徑>
     GSC_SERVICE_ACCOUNT       整份 JSON 直接放在環境變數裡
     GOOGLE_APPLICATION_CREDENTIALS   指向 JSON 檔的路徑

   ⚠ 服務帳戶的 JSON 金鑰**不要 commit 進 repo**（這個 repo 是 public 的）。
      .gitignore 已經擋掉 *.json 的常見金鑰檔名，但最保險是放在 repo 外面。
   ============================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  accessToken,
  getSitemap,
  inspectUrl,
  parseServiceAccount,
  resolveSite,
  submitSitemap,
} from "../src/gsc.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const valueOf = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
};

const die = (msg) => {
  console.error(`× ${msg}`);
  process.exit(1);
};

/* ---------- 網址 ---------- */

let siteUrl;
try {
  siteUrl = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8")).url;
} catch (err) {
  die(`讀不到 site.json（${err.message}）`);
}
if (!siteUrl) die("site.json 沒有填 url");
const sitemapUrl = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;

/* ---------- 金鑰 ---------- */

function loadKey() {
  const file = valueOf("--key") || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (file) {
    if (!fs.existsSync(file)) die(`找不到金鑰檔：${file}`);
    return parseServiceAccount(fs.readFileSync(file, "utf8"));
  }
  if (process.env.GSC_SERVICE_ACCOUNT) return parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT);
  die(
    "找不到服務帳戶金鑰。用 --key <路徑>，或設定 GSC_SERVICE_ACCOUNT／" +
      "GOOGLE_APPLICATION_CREDENTIALS。設定步驟見 README.md「Search Console 自動提交」。"
  );
}

/* ---------- 從 sitemap 取網址 ---------- */

function sitemapEntries() {
  const file = path.join(ROOT, "sitemap.xml");
  if (!fs.existsSync(file)) die("找不到 sitemap.xml，先跑 node tools/build.mjs");
  return [...fs.readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    /* image:loc 也是 <loc>，但它在 <image:image> 裡面，用副檔名濾掉 */
    .filter((u) => !/\.(jpe?g|png|svg|webp)$/i.test(u));
}

/* ---------- 主流程 ---------- */

const key = loadKey();
let token;
try {
  token = await accessToken(key);
} catch (err) {
  die(err.message);
}

let site;
try {
  site = await resolveSite(token, siteUrl);
} catch (err) {
  die(err.message);
}
console.log(`資源：${site}`);
console.log(`帳號：${key.client_email}\n`);

if (flag("--inspect")) {
  const one = valueOf("--inspect");
  const urls = one ? [one] : sitemapEntries();
  console.log(`查索引狀態，共 ${urls.length} 筆（URL Inspection API，每天 2000 次額度）：\n`);
  let indexed = 0;
  for (const u of urls) {
    try {
      const r = await inspectUrl(token, site, u);
      const idx = (r.inspectionResult && r.inspectionResult.indexStatusResult) || {};
      const verdict = { PASS: "✅ 已收錄", FAIL: "❌ 未收錄", NEUTRAL: "◽ 中性" }[idx.verdict] ||
        idx.verdict || "？";
      if (idx.verdict === "PASS") indexed++;
      console.log(`  ${verdict}  ${u}`);
      console.log(
        `        覆蓋狀態：${idx.coverageState || "—"}` +
          (idx.lastCrawlTime ? `　最後檢索：${idx.lastCrawlTime.slice(0, 10)}` : "　尚未檢索")
      );
    } catch (err) {
      console.log(`  ⚠ 查詢失敗  ${u}\n        ${err.message}`);
    }
  }
  console.log(`\n合計：${indexed} / ${urls.length} 已收錄。`);
  process.exit(0);
}

if (!flag("--status")) {
  try {
    await submitSitemap(token, site, sitemapUrl);
    console.log(`✅ 已提交 ${sitemapUrl}`);
  } catch (err) {
    die(err.message);
  }
}

/* Google 那一側的狀態。剛提交完 lastDownloaded 還會是上一次的時間，
   isPending 才是「排隊中」的意思——這不是錯誤。 */
try {
  const s = await getSitemap(token, site, sitemapUrl);
  const web = (s.contents || []).find((c) => c.type === "web") || {};
  console.log("\nGoogle 這一側看到的：");
  console.log(`  上次提交：${(s.lastSubmitted || "—").slice(0, 19).replace("T", " ")}`);
  console.log(`  上次下載：${(s.lastDownloaded || "—").slice(0, 19).replace("T", " ")}`);
  console.log(`  排隊中　：${s.isPending ? "是" : "否"}`);
  console.log(`  已收到的網址數：${web.submitted || 0}`);
  console.log(`  警告 ${s.warnings || 0} 個、錯誤 ${s.errors || 0} 個`);
} catch (err) {
  console.error(`\n⚠ 讀狀態失敗：${err.message}`);
  console.error("  剛提交的 sitemap 有時要幾分鐘才查得到，稍後再跑一次 --status。");
}
