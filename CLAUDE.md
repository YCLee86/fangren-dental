# 芳仁牙醫診所部落格 — 給 Claude Code 的專案守則

雲林縣斗六市的牙醫診所部落格。純靜態網站，**零 npm 依賴**，只用 Node 跑幾支腳本。
正式站 https://fangren.net（Cloudflare Worker + 靜態資產）。

這份檔案是給 AI 助理看的。人類用的說明在 [README.md](README.md)。

---

## 一、不可更動的架構決策

以下是使用者明確要求過的，**不要「順手改善」掉**：

1. **首頁文章列表必須是靜態 HTML。**
   卡片由 `tools/build.mjs` 寫進 `index.html` 的 `<!-- POSTS:START -->` / `<!-- POSTS:END -->`
   區塊。**絕對不要**改成前端 JavaScript 讀 `posts.json` 再動態產生 — 這是刻意的決定，
   為了 SEO 與無 JS 環境。
2. **每篇文章是獨立網址** `/posts/<slug>/`，同一個網域底下，不是 hash route、不是查詢字串。
3. **「最後更新日期」由腳本維護，不要手改。** `tools/build.mjs` 用內容雜湊比對，
   發現文章被改過才把日期換成當天，並依此重新排序（最新在前）。
   `post-meta` 裡的 `updated` 欄位人工改了也會被蓋掉。
4. **部署是 Cloudflare Worker，不是 Pages。** `wrangler.toml` 用 `main = "src/worker.js"`
   ＋ `[assets] directory = "_site"`。不要改成 `pages_build_output_dir`，那是 Pages 專用的，
   會讓建置失敗於 "Missing entry-point"。
5. **文章 HERO 圖寬度不得超過內文欄寬**，且必須等比例縮放。
6. **手機版排版不可破框**（無水平捲動）。改完 CSS 要用 375px 寬檢查。
7. **HERO 圖若使用第三方素材需符合 CC BY**，並在 footer 標示出處。目前照片皆為診所自有。

---

## 二、工作流程（每次動手前後都要做）

### 開工前一定要先同步

這個 repo **有兩個人同時在推 commit**，兩台電腦各自跑 Claude Code。動手前：

```bash
git fetch && git pull --rebase
```

已經發生過 push 被擋、要 rebase 的情況。另外：**未追蹤的本機檔案若和遠端新增的同名檔撞到
會擋住 checkout — 先把本機檔移走再 rebase，不要直接刪掉使用者的檔案。**

### 改完之後

```bash
node tools/build.mjs      # 一定要跑，否則首頁卡片與 sitemap 不會更新
git add -A && git commit -m "..." && git push
```

push 到 `main` 之後 Cloudflare 會自動建置部署，幾分鐘內上線。
**不需要**手動跑 `wrangler deploy`，也不需要 Cloudflare token。

因為 `index.html` 和 `tools/build-manifest.json` 是 build 產物，兩人同時改必然衝突 —
所以「改完 → build → 立刻 push」，不要累積一堆本機 commit。

### 本機預覽

```bash
node tools/serve.mjs      # 預設 http://localhost:8791
```

計數器 API 在本機沒有 Worker 可跑，會**自動隱藏**，網站其他部分完全正常，這是預期行為。

---

## 三、環境需求

- **Node ≥ 20**（`package.json` 的 `engines` 有寫）。不必 `npm install`，沒有任何依賴。
- **git 身分要在 repo 層級設**。全域沒設，不設會 commit 失敗：

  ```bash
  git config user.name "YCLee86" && git config user.email "eugenelee0806@gmail.com"
  ```

- `gh auth login` 即可推送。**這台/那台機器的 gh token 沒有 `workflow` scope**，
  推不了 `.github/workflows/`；`.gitignore` 也直接排除了 `.github/`，所以 repo 內沒有 workflow，
  不要嘗試新增。
- wrangler 只有直接手動部署或操作 D1 時才需要，日常編修用不到。

---

## 四、目錄與檔案

```
index.html              首頁。POSTS 區塊由 build 產生，其餘手寫
404.html
site.json               網站正式網址（給 sitemap 用）
wrangler.toml           Worker、靜態資產、自訂網域、D1 綁定
d1-schema.sql           計數器資料表定義，執行一次即可
src/
  worker.js             計數器 API ＋ www 轉址
  allowed-slugs.js      白名單，由 build 產生，勿手改
assets/
  style.css             全站樣式
  counter.js            前端計數器
posts/<slug>/index.html 一篇文章一個資料夾
tools/
  build.mjs             產生首頁卡片、更新日期、排序、sitemap、allowed-slugs
  dist.mjs              把上線檔案組進 _site/
  serve.mjs             本機預覽伺服器
  setup.ps1 / setup.sh  新電腦一鍵環境設定
  build-manifest.json   內容雜湊紀錄，build 自動維護，勿手改
```

> `tools/setup.ps1` **必須存成 UTF-8 with BOM**。Windows PowerShell 5.1 沒有 BOM 就會
> 用 ANSI 讀檔，裡面的中文全變亂碼、腳本直接解析失敗。編輯這支檔案後要確認 BOM 還在。

`_site/`、`.wrangler/`、`node_modules/` 都在 `.gitignore` 裡，是產物，不要 commit。

### 自動產生、不要手動編輯的檔案

- `index.html` 的 `<!-- POSTS:START -->` ~ `<!-- POSTS:END -->` 之間
- `src/allowed-slugs.js`
- `tools/build-manifest.json`
- `sitemap.xml`
- 各文章 `post-meta` 的 `updated` 欄位

---

## 五、新增或修改文章

新增：複製任一個 `posts/<slug>/` 資料夾，改 `<head>`、`post-meta` JSON 區塊、
`<body>` 內文與 `data-views-self="新代碼"`，然後跑 build。
`slug` 必須與資料夾名稱完全相同。

修改：改完內文跑 `node tools/build.mjs` 就好，日期與排序自動處理。
`node tools/build.mjs --check` 可以只看結果不寫檔。

> 改頁首、頁尾這類全站共用區塊**不會**讓所有文章的日期一起跳成當天 —
> 內容雜湊只涵蓋 `post-meta` 與 `<main>` 之內。這是刻意設計，不要改掉。

### 陷阱：跨全部文章的 `<main>` 內修改

雜湊涵蓋 `<main>`，所以如果一次改動所有文章 `<main>` 裡的共用結構（例如 2026-08-02
移除全站作者署名），`build.mjs` 會把每一篇都判定成「內容更新」，五篇舊文的日期一起跳成當天，
排序也跟著亂掉。

處理方式：build 之後**手動把 `tools/build-manifest.json` 裡那些文章的日期改回原本的更新日**，
再跑一次 build 讓頁面與卡片跟著還原。不要放著不管。

---

## 六、診所資料

地址、電話、看診時間都已填妥，`<head>` 的 JSON-LD 也有 `openingHoursSpecification`。
目前**沒有**任何 `【請填入…】` 佔位符。

- 地址：雲林縣斗六市永樂街 70 號
- 電話：05-533-9369

作者署名與「醫療審閱」欄位已於 2026-08-02 全站移除，**不要自作主張加回去**。
但 `post-meta` 的 `author` 欄位仍是 `build.mjs` 的**必填欄位**（只是不再顯示在頁面上），
新增文章時還是要寫。

---

## 七、已知狀況

- **舊站 https://yclee86.github.io/fangren-dental/ 還活著**，GitHub Pages 直接讀 main 分支
  根目錄，會跟著 push 一起更新。過渡期先留著，之後要處理轉址。
- `run_worker_first = true` 是為了 www 轉址而開的（該選項只吃路徑樣式、不吃主機名稱）。
  代價是 Worker 掛掉會影響整站，不再只有計數器。若要拿回這點，改用 Cloudflare 後台
  Rules → Redirect Rules 做轉址，再拿掉那行與 `worker.js` 裡的轉址。
- `tools/hero-new.css` 是還沒套用的 HERO 改版實驗（未進版控），不是死碼。
