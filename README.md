# 芳仁牙醫診所 部落格

雲林縣斗六市，在地經營超過四十年。純靜態網站，沒有任何前端框架與建置依賴（只需要 Node 執行一支腳本）。

| 環境 | 網址 |
| --- | --- |
| 正式站（GitHub Pages） | https://yclee86.github.io/fangren-dental/ |
| Cloudflare Pages | 尚未建立，見下方「Cloudflare 待辦」 |
| 原始碼 | https://github.com/YCLee86/fangren-dental |

> **Cloudflare 待辦**：原本的直接上傳專案已刪除，但 Cloudflare 會保留已刪除專案的
> `pages.dev` 子網域一段時間，目前 `fangren-dental` 這個名字還拿不回來（表單會自動
> 配成 `fangren-dental-bpt.pages.dev`）。等名字釋出後再依下方「自動部署」建立 Git 專案。
> GitHub App（Cloudflare Workers and Pages）已授權，僅限這個 repo，屆時不必再授權一次。
>
> 在那之前計數器不會運作——Pages Function 只跑在 Cloudflare，GitHub Pages 上會自動隱藏。

---

## 目錄結構

```
index.html                 首頁。文章卡片是「真的寫在 HTML 裡」的靜態內容
404.html
site.json                  網站正式網址（給 sitemap 用）
supabase-setup.sql         計數器的資料庫建置指令，執行一次即可
assets/
  style.css                全站樣式
  supabase-config.js       ← Supabase 的 URL 與 anon key 填在這裡
  counter.js               瀏覽計數器
  hero-dental.jpg          首頁主視覺（CC BY 4.0，出處見頁尾）
  hero-*.svg               各篇文章的插圖（自製）
posts/
  <slug>/index.html        一篇文章一個資料夾，網址就是 /posts/<slug>/
tools/
  build.mjs                產生首頁卡片、更新日期、排序、sitemap
  build-manifest.json      記錄每篇文章的內容雜湊，用來判斷有沒有被改過
```

---

## 新增一篇文章

1. 複製任一個現有資料夾，例如 `posts/regular-checkup/` → `posts/新代碼/`。
2. 打開裡面的 `index.html`，改三個地方：
   - `<head>` 裡的 `<title>`、`description` 等。
   - **`<script type="application/json" id="post-meta">` 區塊**（這是首頁卡片的資料來源）。
   - `<body>` 內的標題、日期、內文，以及 `data-views-self="你的代碼"`。
3. 執行：

```bash
node tools/build.mjs
```

4. `git add -A && git commit && git push`。

`post-meta` 各欄位：

| 欄位 | 說明 |
| --- | --- |
| `slug` | 必須與資料夾名稱完全相同，也是計數器的代碼 |
| `title` / `excerpt` / `tag` | 顯示在首頁卡片上 |
| `author` | 文章作者，會同時出現在卡片與文章頁 |
| `published` | 發布日期，`YYYY-MM-DD` |
| `updated` | **不用自己改**，由 build 腳本維護 |
| `hero` / `heroAlt` | `assets/` 底下的圖檔名與替代文字 |

## 修改既有文章

改完內文之後跑一次 `node tools/build.mjs` 就好。腳本會比對內容雜湊，發現這篇被改過，就把「最後更新」換成今天，同時更新文章頁上顯示的日期、首頁卡片的日期，並把它重新排到最前面。沒被改到的文章日期不會動，連續執行多次也不會重複跳日期。

只想看結果、不想寫檔：`node tools/build.mjs --check`

---

## 瀏覽計數器（Cloudflare D1）

計數存在 Cloudflare D1 資料庫 `fangren-dental-views`，透過 Pages Function 讀寫，前端不直接碰資料庫，也沒有任何金鑰要放在頁面上。

```
functions/api/views.js      API：GET 查詢、POST 加一
functions/allowed-slugs.js  允許的代碼清單（由 build 自動產生，勿手改）
assets/counter.js           前端
d1-schema.sql               資料表定義
wrangler.toml               D1 綁定（env.DB）
```

| 端點 | 用途 |
| --- | --- |
| `GET /api/views?slugs=home,bass-brushing` | 回傳 `{ "counts": { "home": 12, ... } }` |
| `POST /api/views` body `{"slug":"home"}` | 該頁 +1，回傳新的數字 |

規則：

- 每個瀏覽器分頁對同一篇文章只加一次（`sessionStorage`），重新整理不會灌水。
- API 只接受 `functions/allowed-slugs.js` 裡的代碼，這份清單依實際文章自動產生，外部無法塞入不存在的頁面。首頁本身的代碼是 `home`。
- 在 GitHub Pages 或本機直接開檔案時沒有 Function 可跑，此時計數器**自動隱藏**，網站其他部分完全正常。

### 常用指令

```bash
wrangler d1 execute fangren-dental-views --remote --command "SELECT * FROM page_views ORDER BY views DESC"
```

本機連遠端資料庫預覽整站（含 API）：

```bash
npm run build && wrangler pages dev _site --d1 DB=fangren-dental-views --remote
```

---

## 建置指令

| 指令 | 作用 |
| --- | --- |
| `npm run build` | 產生首頁卡片與 sitemap，並把要上線的檔案組進 `_site/` |
| `npm run check` | 只顯示排序結果，不寫任何檔案 |
| `npm run deploy` | build 之後直接用 wrangler 手動部署 |

`_site/` 只包含 `index.html`、`404.html`、`assets/`、`posts/`、`sitemap.xml`、`robots.txt`，不會把 `tools/`、`site.json`、README 放上線。

## 自動部署（Cloudflare Pages ← GitHub）

Workers &amp; Pages → Create → Pages → **Connect to Git** → 選 `YCLee86/fangren-dental`，設定如下：

| 欄位 | 值 |
| --- | --- |
| Project name | `fangren-dental`（要與 `wrangler.toml` 的 `name` 一致，改名時兩邊都要改） |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | 不用填，`wrangler.toml` 已指定 `_site` |

D1 綁定也寫在 `wrangler.toml` 裡，後台不需要另外設。

建立完成後：

1. 把 `site.json` 的 `url` 與 `index.html` 裡 JSON-LD 的 `url` 改回 Cloudflare 網址。
2. 跑 `npm run build`，commit + push。

之後只要 push 到 `main`，Cloudflare 會自己拉程式碼、跑 build、上線。推到其他分支則會產生預覽網址。

### GitHub Pages（備援）

`.github/workflows/deploy.yml` 會同時部署到 GitHub Pages 與 Cloudflare Pages。
要用它需要先讓 gh token 具備 workflow 權限：

```bash
gh auth refresh -h github.com -s workflow
```

Cloudflare 那段另需在 repo 的 **Settings → Secrets and variables → Actions** 加 `CLOUDFLARE_API_TOKEN` 與 `CLOUDFLARE_ACCOUNT_ID`；沒設定時該 job 會跳過並留下警告。若已改用上面的 Git 連線方式，這個 workflow 其實不是必要的。

---

## 診所資訊

- 地址：雲林縣斗六市永樂街 70 號
- 電話：05-533-9369（頁面上是 `tel:` 連結，手機可直接撥號）

### 還沒補的

網站上以 `【請填入…】` 標示的橘色欄位仍是佔位符：

- **看診時間**（`index.html` 的診所資訊區塊）。補上之後，順便把 `index.html` `<head>` 裡那段 JSON-LD 加上 `openingHoursSpecification`，本地搜尋結果會更完整。
- **各篇文章的「醫療審閱：醫師姓名」**（五篇文章都有）。

> 註：修改頁首、頁尾這類全站共用區塊**不會**動到文章的「最後更新」日期——`tools/build.mjs` 的內容雜湊只看 `post-meta` 與 `<main>` 之內的內容。

---

## 圖片授權

首頁主視覺照片為 [A dental chair in a dentist clinic in North Carolina, United States](https://commons.wikimedia.org/wiki/File:A_dental_chair_in_a_dentist_clinic_in_North_Carolina,_United_States.jpg)，攝影 Harrison Keely，取自 Wikimedia Commons，依 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 授權使用；本站僅等比例縮放為 1280 像素寬，未另作修改。出處標示於全站頁尾。

文章插圖與網站圖示為本站自製。
