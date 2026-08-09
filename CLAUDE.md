# 芳仁牙醫診所部落格 — 給 Claude Code 的專案守則

雲林縣斗六市的牙醫診所部落格。純靜態網站，**零 npm 依賴**，只用 Node 跑幾支腳本。
正式站 https://fangren.net（Cloudflare Worker + 靜態資產）。

這份檔案是給 AI 助理看的。人類用的說明在 [README.md](README.md)。

> **要動到任何顏色之前，先讀 [PALETTE.md](PALETTE.md)。**
> 那份是配色的唯一依據，每個色值都是從診所自己的照片量出來的（含官方色票、
> 材質實測、對比度實測、版面規則）。**不要另外憑感覺挑色，也不要繞過裡面的
> 對比度限制**（例如 `#A1A398` 量出來撐不住文字，就不要拿它當文字）。
>
> **要寫或改任何對外的品牌文字之前，先讀 [COPY.md](COPY.md)。**
> 那份是文案的唯一依據：HERO 那首詩的寫作規則、品牌定位、**不能寫成什麼**（有紅線），
> 以及正在進行中的收尾候選。使用者對這些句子已經來回修過好幾輪，
> **不要憑感覺重寫，也不要從舊對話裡抄。**
>
> 跑在 **手機／雲端 session（claude.ai/code）** 時：容器看不到使用者電腦上的照片資料夾，
> 也不能執行 `tools/palette-measure.ps1`。這**不影響**配色工作 —— 需要的數字全都已經
> 量好寫在 PALETTE.md 裡了。不要因為讀不到照片就退回目測配色。

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

**這件事已經自動化了** —— `.claude/settings.json` 的 SessionStart hook 會在每次開啟專案時
自動執行 `node tools/sync.mjs`（等同 `git pull --rebase --autostash`），並把結果顯示給使用者。
所以正常情況下不必再手動 pull。

但如果一個 session 開很久，中途仍要自己補一次：

```bash
node tools/sync.mjs
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

### 使用者的口語指令

使用者不熟悉終端機，會用中文交代。看到這些說法就直接執行對應動作，不要只是把指令貼給他：

| 使用者說 | 你要做的事 |
| --- | --- |
| 「上線」「發布」「推上去」 | `node tools/build.mjs` → `git add -A` → commit（訊息自己擬）→ `git push` |
| **「定案幫我上線」「定案幫我放上去」** | **把目前這條工作分支合併進 `main` 並推上去**，見下面那一段 |
| 「同步」「更新」「拉最新的」 | `node tools/sync.mjs` |
| 「預覽」「我要看看」 | `node tools/serve.mjs`，告訴他開 http://localhost:8791 |
| 「網站好了嗎」 | 確認已 push，提醒 Cloudflare 需要幾分鐘，網址是 https://fangren.net |

上線前若發現遠端有新 commit，先同步再 build、再推。

#### 「定案幫我上線」＝ 合併到 `main`（2026-08-09 起）

雲端 session 的工作都在 `claude/...` 分支上，**Cloudflare 只建置 `main`**，
所以推到分支等於還沒上線。使用者說這句話的時候，他要的是**真的出現在 fangren.net 上**：

```bash
git fetch origin main
git log --oneline HEAD..origin/main      # main 有沒有被另一台推過東西
git checkout main && git merge --ff-only <工作分支>   # 快轉不了就先 rebase 分支
node tools/build.mjs
git push -u origin main
```

推完告訴他 Cloudflare 要幾分鐘，網址是 https://fangren.net。

**動手前先掃一遍要合併的東西，把還沒定案的擋下來。** 分支上常常同時躺著
「已定案並套進版型的」和「還在提案中的」；`PALETTE.md`／`COPY.md` 裡標著
**提案中**、**未定**、**三案待選** 的段落是文件，跟著上去沒關係，
但**不要把還沒定案的顏色或文案套進 `index.html`／`assets/style.css`／`posts/` 再合併**。
不確定就先問他是哪一件定案了。

`preview/` 底下的提案頁**跟著上去是正常的**（本檔第八節：那本來就是給他在手機上看的，
`robots.txt` 與各頁的 `noindex` 已經擋掉搜尋引擎）。

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
PALETTE.md              配色規範。動任何顏色之前先讀這份
COPY.md                 文案規範。動任何品牌文字之前先讀這份
404.html
favicon.ico             根目錄的點陣圖示，**只給 Google 的圖示爬蟲**。
                        由 tools/favicon-ico.mjs 從 assets/favicon.svg 算出來，已進版控。
                        ⚠ 刻意不在任何 <head> 宣告 —— 見 PALETTE.md 第六之七節
site.json               網站正式網址（給 sitemap 用）
wrangler.toml           Worker、靜態資產、自訂網域、D1 綁定
d1-schema.sql           計數器資料表定義，執行一次即可
src/
  worker.js             計數器 API ＋ www 轉址 ＋ /preview/* 密碼閘
  allowed-slugs.js      白名單，由 build 產生，勿手改
assets/
  style.css             全站樣式
  counter.js            前端計數器
posts/<slug>/index.html 一篇文章一個資料夾
preview/<name>/index.html  未上線的改版提案頁，要密碼才看得到（見第八節）
tools/
  build.mjs             產生首頁卡片、更新日期、排序、sitemap、allowed-slugs
  dist.mjs              把上線檔案組進 _site/
  serve.mjs             本機預覽伺服器
  sync.mjs              同步遠端（SessionStart hook 自動呼叫）
  setup.ps1 / setup.sh  新電腦一鍵環境設定
  palette-measure.ps1   從照片實測取色（k-means ＋ 局部裁切），配色改動的依據來源
  favicon-ico.mjs       從 assets/favicon.svg 產生根目錄的 favicon.ico。
                        只有改過 favicon 的顏色或幾何時才要跑，npm run build 不會呼叫它
  build-manifest.json   內容雜湊紀錄，build 自動維護，勿手改
.claude/
  settings.json         SessionStart hook：開啟專案時自動同步（隨 git 走，兩台都生效）
  launch.json           本機預覽伺服器的啟動設定
```

> `tools/setup.ps1` **必須存成 UTF-8 with BOM**。Windows PowerShell 5.1 沒有 BOM 就會
> 用 ANSI 讀檔，裡面的中文全變亂碼、腳本直接解析失敗。編輯這支檔案後要確認 BOM 還在。
>
> `tools/palette-measure.ps1` 走另一條路避開同一個坑：**整支刻意只用 ASCII**，
> 中文一律放在它讀進來的 manifest（用 `-Encoding UTF8` 讀）。改它的時候不要加中文字面值。

`_site/`、`.wrangler/`、`node_modules/` 都在 `.gitignore` 裡，是產物，不要 commit。

### 自動產生、不要手動編輯的檔案

- `index.html` 的 `<!-- POSTS:START -->` ~ `<!-- POSTS:END -->` 之間
- `src/allowed-slugs.js`
- `tools/build-manifest.json`
- `sitemap.xml`（首頁那一筆的 `lastmod` 和文章一樣是**比對首頁自己的內容雜湊**得來的，
  不是抄最新文章的日期 —— 只改首頁、沒發新文章時它也要動，否則等於在跟 Google 說「別來了」）
- `robots.txt`（**每次 build 整個重寫**，要加規則請改 `tools/build.mjs` 的產生字串）
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
- `tools/hero-new.css` 與 `tools/hero-preview.mjs` 是還沒套用的 HERO 改版實驗，不是死碼。
  2026-08-05 一併進版控，讓另一台電腦與手機 session 也拿得到。
- **Google 搜尋結果會落後好幾天到幾週，那不是網站壞了。** 使用者 2026-08-09 回報
  搜尋結果的標題、描述、小圖「都不對」—— 三樣逐字比對過，全是站上改版之前的舊快照
  （標題與描述是 08-09 才改的，圖示是 08-08 才換的）。**先去 git log 對一次時間再說**，
  不要因為看起來不對就動 `index.html`。要催快一點只有一條路：Google Search Console
  的「網址審查 → 要求建立索引」，那個後台只有使用者能開。

---

## 八、未上線的預覽頁 `preview/`

給客戶／自己在手機上看改版提案用的。`preview/<name>/index.html` 一個提案一個資料夾，
每份都是**自給自足的靜態快照**：樣式整份內嵌在自己的 `<head>` 裡，
刻意不引用 `assets/style.css`，改預覽時才不會不小心動到正式站。
`build.mjs` 完全不會碰這個資料夾（它只讀根目錄的 `index.html` 與 `posts/`），
所以裡面的文章卡片是靜止的，不會跟著新文章更新。

目前有：

- `preview/home-v2/` — 首頁改版提案，2026-08-03 從 Claude Artifact 匯出。
- `preview/canvas/` — **配色主案**（2026-08-04）。暗夜 HERO × 淺色內文，中間以 3px 木色線
  分界；內文底色三選一。頁內有官方色票、花藝比例與對比度的完整數據，數值同 [PALETTE.md](PALETTE.md)。
- `preview/night-calibrated/` — 全暗版（2026-08-04），內文區也是暗的。留著對照用。
- `preview/hero-ppt-*/` — **手機版 HERO 提案（2026-08-05）**，依使用者的 `簡報20260804.pptx` 做的，
  只做 390px。命名分四組：`a`/`b`/`c`/`c1`/`c3` 是版型，`r1`–`r3` 是右緣裁切，
  `t1`–`t3` 是詩的透明度，`s1`/`s1a`/`s1b`/`s2`/`s3` 是文字陰影。
  **`hero-ppt-s1a` 是使用者定案的那一版**，其餘留著互相比較，各頁底部有交叉連結。
  詩的文字內容與尚未定案的收尾在 [COPY.md](COPY.md)。
- `preview/home-mobile/` — **完整手機首頁**（2026-08-06）：定案的 HERO C72 ＋ 1983／9／6 暗夜窄帶
  ＋ 正式站現有資料補完的一整頁。HERO、窄帶、字級、墨色 `#2a2c27` 都已定版，**不要動**。
  `preview/home-mobile-rule/` 是窄帶分隔線三案。
- `preview/home-mobile-g1` `-g2` `-n1` `-n2` `-n3` — **內文底色提案（2026-08-06）**，
  都是 `home-mobile` 的複本，只換 `--paper` / `--card` / `--rule`。
  `g1` 灰紫、`g2` 灰綠（兩案仍有木線）；`n1`/`n2`/`n3` 是中性灰三案且**木線已拿掉**。
  **`n3` 藍灰調 `#e2e5e6` 是使用者選定的那一版。** 詳細數據見 [PALETTE.md](PALETTE.md) 第四節 C。

  > **`preview/home-mobile-n3/` 已經是這個專案目前最完整的一頁**（2026-08-07 更新），
  > 遠遠超過它原本「只換底色」的定位。現在它還包含：捲動時的固定頁首、
  > 醫師介紹與診所資訊的科別色、跨三節共用的科別標記、點主題與科別可篩選文章與醫師、
  > 換過的頁首標誌。**要接手這個專案就從這一頁開始看。**
  > 規則寫在 [PALETTE.md](PALETTE.md) 第六之二節。

- `preview/home-desktop/` — **電腦版首頁提案（2026-08-07）**。把定案的手機版 N3 套到寬螢幕：
  三欄卡片、單列窄帶、橫排頁首。顏色一個都沒有新調，元件規則也不動，只有版面從一欄變多欄。
  **HERO 還在調，尚未定案** —— 見下面幾頁。
- `preview/home-desktop-hero/` `-align/` `-banner/` `-fullscreen/` — HERO 裁切的探索過程，
  每頁都有切換條（網址可帶參數）。依序是：裁切方式四案 → 對齊三案 → 橫幅滿版 → 整屏兩案。
  **都已經被下一頁取代，留著看推論過程。**
- `preview/home-desktop-band/` — **電腦版目前的最新一頁（2026-08-07）**。整屏照片
  （`100svh`、`object-position: 50% 100%` 下緣貼齊）＋ **壓在下緣的窄帶**。
  右下角兩組切換條：底色七案 × 三格間距三案，網址可帶
  `?band=glasstar|glasstar2|blue|tar|ink|glass1|glass2|glass3&gap=now|wide|full`。
  **已定：間距用「拉開」、底色用毛玻璃＋柏油漸層。**
  還沒定：柏油漸層要「標準」還是「深」。細節全部寫在 [PALETTE.md](PALETTE.md) 第六之三節。
- `preview/logo-banner/` — **標誌定稿的前後對照（2026-08-07）**。頁首標誌牙洞 1.3 倍、上移 0.50。
- `preview/logo-favicon/` — **favicon 的顏色，已定案（2026-08-08）**。
  淺色 `#4f6361`、深色 `#4f8065`（那一頁的第 2 案），頁上留著五個候選與推導。
- `preview/logo-favicon-shift/` — 紀錄：favicon 牙洞往上移的四個位置，定案是上移 1.05。
- `preview/logo-favicon-plate/` — **Safari 在圖示後面墊白底的四個亮度候選（2026-08-08）**。
  一個候選一頁（`c1`～`c4`），因為 Safari 是按「圖示網址」分開判斷的。**還沒定案**，
  等使用者在 iPhone 上逐頁看完回報第一顆沒有白底的編號。

  > **`assets/favicon.svg` 已經換成標誌本體了**（2026-08-08），
  > 一個檔同時管淺色與深色分頁列，靠 SVG 裡的 `prefers-color-scheme`。
  > 規則與數據在 [PALETTE.md](PALETTE.md) 第六之七節。
  >
  > **引用它的時候一定要帶 `?v=<版本>`**（現在是 `?v=20260808b`）。
  > Safari 的 favicon 快取是按圖示網址存的，網址沒變就永遠給舊圖 ——
  > 使用者在手機上就是這樣一直看到 2026-08-02 那顆舊牙。改圖之後要把全站的
  > `?v=` 一起換掉，指令與原因寫在 PALETTE.md 第六之七節。
  >
  > **SVG 裡兩個顏色的順序是刻意反過來的**：深色版 `#4f8065` 當預設，
  > 淺色版 `#4f6361` 才放進 `@media (prefers-color-scheme: light)`。
  > **Safari 不看 favicon 裡的深色模式**，只吃沒有條件的那一行；讓它拿到暗的那顆，
  > 對深色分頁列只有 2.67:1，Safari 就會自動墊一塊白底「幫」你。**不要改回來。**

- `preview/hero-portrait/` — **直立（旋轉）螢幕的 HERO，已定案（2026-08-09）**。
  使用者把 1920×1080 轉成直的，詩變成一撮小字。**定案「照片不整屏」`62svh` ＋
  字級改讀 `svh`，已套進 `index.html`**（一段 `@media (min-width: 721px) and
  (max-aspect-ratio: 2/3)`，電腦版與手機版逐項比對過、一個值都沒動）。
  這一頁是定案後的紀錄，切換條已刪。當時比過的五案、落選直排問出來的「左側天空柱」
  地形、以及為什麼 `object-position: 50% 100%` 在直立比例下失效，
  全部在 [PALETTE.md](PALETTE.md) 第六之十三節。
- `preview/spec-*/` — **七個科別色的推導過程（2026-08-09 一整天）**，一輪一頁：
  `spec-surg-violet/`（外科紫，定案）、`spec-prosth-blue/`（贋復 3×3，已被後面兩輪取代）、
  `spec-endo-red/` `-raw/` `-all/`（顯微根管紅，`-all` 是定案頁，十一案×兩條切換條）、
  `logo-green-compare/`（一般牙科綠，十三案，定案）、`spec-ortho-bright/`（矯正提亮，**未定案**）、
  **`spec-ortho-palette/`（矯正換色系：品牌剩的米色＋稻草灰，加資料庫三個，八案）**、
  **`spec-perio-teal/`（⚠ 最新一頁：牙周換青綠、矯正接手牙周的藍。兩科對調已定，
  只剩牙周的青綠要幾階，三案 Ⓣ1／Ⓣ2／Ⓣ3）**、
  `spec-prosth-bluer/`（贋復藍紫，定案 Ⓑ）、
  **`spec-perio-split/`（牙周獨立＋贋復字階，三排切換條，定案 Ⓧ·Ⓡ·Ⓓ2）**。
  每一頁都有完整元件舞台與文章頁模擬。數據全部同步在 [PALETTE.md](PALETTE.md) 第六之九～十四節。

### 沒有鎖（2026-08-06 起）

原本 `src/worker.js` 對 `/preview/*` 要求 HTTP Basic 認證，**已依使用者要求移除**。
不要「順手加回去」。當時的判斷：

- 那道鎖只擋得住 `fangren.net` 這一側，repo 是 **public**，同一份 HTML 在 GitHub 上
  任何人都讀得到，擋了也沒有實質保護。
- 密碼要放在 Cloudflare Secret `PREVIEW_PASSWORD`，而那個 secret 從來沒設過，
  Worker 就一直回 503 —— 結果是使用者自己用手機也打不開提案頁。
  要設它得進 Cloudflare 後台，這件事只有使用者能做。
- 使用者的結論是「沒有網址別人也看不到」，選擇不鎖。

現在 `/preview/*` 只多兩個 header：`X-Robots-Tag: noindex, nofollow, noarchive`
與 `Cache-Control: no-store`（提案頁改得勤，手機不能拿到快取的舊版）。

### 所以 `preview/` 等同對外公開

`/preview/` 底下的東西任何人拿到網址就看得到，只是沒有連結指過去、也不會被搜尋到。
搜尋引擎那一層有三道：頁面自己的 `<meta name="robots" content="noindex, nofollow, noarchive">`
（**新增預覽頁一定要帶**）、Worker 的 `X-Robots-Tag`、以及 `robots.txt` 的
`Disallow: /preview/`（寫在 `build.mjs` 裡）。

**真的不能外流的東西不要放這裡。**

舊的 GitHub Pages 站（`yclee86.github.io/fangren-dental/preview/...`）也送得出這些頁，
但那邊是子路徑，預覽頁裡的 `/assets/...` 絕對路徑會 404 **圖片全破**，
所以要看提案一律用 `https://fangren.net/preview/<name>/`。

### 本機預覽

`node tools/serve.mjs` **不會**要求密碼（跟計數器一樣，本機沒有 Worker），
直接開 http://localhost:8791/preview/home-v2/ 就看得到。這是預期行為。

---

## 九、接續中的工作 —— 換電腦或手機時先讀這一節（2026-08-07）

### 東西不在 `main` 上

目前所有進行中的工作都在分支 **`claude/specialty-copy-scheme-lookup-u1ngx7`**。
新開的 session 預設在 `main`，看不到這些檔案。接續時第一件事：

```bash
git fetch origin claude/specialty-copy-scheme-lookup-u1ngx7
git checkout claude/specialty-copy-scheme-lookup-u1ngx7
git pull
```

**正式站 `fangren.net` 也還沒有這些頁**（Cloudflare 只建置 `main`）。
要在手機上看，用 `node tools/serve.mjs` 開本機，或請使用者提供 artifact 連結。

### 已經定案的（不要再問、不要重做）

| 項目 | 定案 | 依據寫在哪 |
| --- | --- | --- |
| 首頁區塊改名 | 「治療項目」→ **主題與科別** | [COPY.md](COPY.md) 第六節（含六輪否決清單） |
| 「最新文章」小節標題 | **拿掉**，只留 `aria-label` | 同上 |
| 窄帶瀏覽數 | 加在 1983／9／6 **上面**，單位「次瀏覽」，捲進畫面才往上數 1.4 秒 | 本檔第八節 |
| 那個動畫看不看 `prefers-reduced-motion` | **不看**（2026-08-08）。iOS 的「減少動態效果」很多人開著，看它就等於數字永遠不動；那個設定針對的是位移／視差／縮放，原地長大的數字不屬於那類。頁面其他三處 CSS 仍然照看 | — |
| 瀏覽數的字 | **黑體**（和「次瀏覽」同字同級同色），襯線版落選 | `preview/home-mobile-n3-views-serif/` |
| 文章卡計數器 | 「日期 ・ 數字 次瀏覽」，**不做動畫**。眼睛圖示與日期前的「更新」都已拿掉 | — |
| 電腦版 HERO 裁切 | **整屏 `100svh` ＋ `object-position: 50% 100%`**（下緣貼齊、要切切天空） | [PALETTE.md](PALETTE.md) 第六之三節 |
| 電腦版窄帶位置 | **壓在整屏下緣**，不是接在照片下面 | 同上 |
| 直立（旋轉）螢幕 | **照片不整屏 `62svh`**，字級改讀 `svh`。關在 `@media (min-width: 721px) and (max-aspect-ratio: 2/3)` 裡，**電腦版與手機版不受影響**（iPad 直放 0.75 刻意排除）。直排落選 | [PALETTE.md](PALETTE.md) 第六之十三節 |
| 窄帶三格間距 | **拉開**（左右各 4rem） | 同上 |
| 兒牙的科別色 | **1a `#c28229`**（十一輪；字與框用 `#9e6301`）。兩個提案頁都已套上、切換條已刪 | [PALETTE.md](PALETTE.md) 第六之二節 |
| chip 的兩態 | 未選＝白底＋深階字與框，選取＝套色填滿。**兒牙不例外** | 同上 |
| 窄帶底色 | **毛玻璃輕 ＋ 柏油漸層「標準」**（「深」落選：底端收成實色，等於把毛玻璃還回去） | [PALETTE.md](PALETTE.md) 第六之三節 |
| 窄帶第一格文案 | 1983年 **中華路開業**（原本是「開業至今」） | — |
| 文章卡陰影 | 靜止就有，hover 加重；**位移／模糊／alpha 三個量一起放大**，縮圖同時 `scale(1.05)` | [PALETTE.md](PALETTE.md) 第六之四節 |
| 手機版的卡片 | **只有靜止陰影，沒有 hover**（沒有游標，`:hover` 會黏住） | 同上 |
| 兩頁誰是準 | **電腦版是準**。手機版先做、推廣成電腦版，電腦版定案後再回推手機版 | — |
| 主選單 | **兩頁都三項**（全部文章／醫師介紹／診所資訊）。「主題與科別」不放進去 | [PALETTE.md](PALETTE.md) 第六之五節 |
| 主題與科別 | 標記最前面一顆「全部」，後面接搜尋框（同時篩文章與醫師） | — |
| 「全部」的灰 | **線框 `#4c4948`／填色 `#5f5d5c`**，兩階都錨在頁首玻璃的 `#393736` 往上提亮度 | [PALETTE.md](PALETTE.md) 第六之五節 |
| 頁首「全部文章」 | 跳到 **`#topics`**（主題與科別），不是 `#articles` —— 篩選工具在那裡 | — |
| 文章頁的重點色 | **跟著該篇的科別走**，寫在 `<body data-spec="…">`。字階要用對紙的那一階，不能從首頁搬 | [PALETTE.md](PALETTE.md) 第六之六節 |
| 贋復假牙的藍 | **填色 `#335b8b`、白底的字 `#182f4b`**（Ⓑ·Ⓓ2，2026-08-09 當日第三版）。彩度要跟著亮度按色域比例走，固定住會變灰、和矯正撞在一起；**字階刻意探到 L\* 18.9，是為了讓牙周的深階活下來** | [PALETTE.md](PALETTE.md) 第六之十、十三、十四節 |
| **齒顎矯正**的藍 | **套色 `#4478b5`、白底的字 `#244369`**（2026-08-10 從牙周整組接手）。從使用者給的 `#3496F2` 收到「白底黑底等效」那條線上。**白字只有 4.57:1，是全站最緊的一格，不能再亮**。它同時解掉「矯正不夠亮」：L\* 36.3 → 49.5，**提亮那一輪（第六之十二節）整組作廢** | [PALETTE.md](PALETTE.md) 第六之十四、十六節 |
| **牙周治療**的青綠 | **套色 `#317d78`、白底的字 `#2a6d69`**（Ⓣ1，2026-08-10）。色相來自診療椅／深綠松那一支（h 186~190），**牙周等於回到診療椅**。填色頂在白字剛好過 AA 的高度。⚠ 字階對全站連結色深綠松只有 ΔE 13.6，是全站第二緊的一格 | [PALETTE.md](PALETTE.md) 第六之十六節 |
| 色票藍灰 `#3C596B` | **釋出**（矯正原本用它）。和 `--moss`／`--taupe`／`--tile` 一樣留在變數表裡，不再有科別指向它 | 同上 |
| 顯微根管的紅 | **套色 `#ae4f4d`、白底的字 `#89202d`**（⑪·⑥，2026-08-09）。深階是開幕紅花籃的實測原值。**苔綠＝Logo 色被釋出，科別色裡不再有 Logo 色 —— 這是已知的取捨，不要提議改回去** | [PALETTE.md](PALETTE.md) 第六之十一節 |
| 一般牙科・創辦醫師的綠 | **套色 `#3f654a`、字 `#2c5238`**（⑪·Ⓑ，2026-08-09）。色相＝花藝實測「枝葉亮處」的色相；兩階只差亮度 7.9。`--chair` 釋出但留著。**牙周已於同日拆出去自己一色**，不要再把它併回這一條 | [PALETTE.md](PALETTE.md) 第六之十一節第七小節 |
| 兒牙填色上的白字 | **維持白字**（3.22:1，低於 AA）。2026-08-08 把備案做成實際樣子看過才決定的，**不要再提** | [PALETTE.md](PALETTE.md) 第六之二節 |

### 還沒決定的

1. **要不要把定案套進 `preview/home-desktop/`**，並刪掉中間過程的幾頁
   （`home-desktop-hero/` `-align/` `-banner/` `-fullscreen/`）。
   `home-desktop-band/` 自己的切換條已經全部刪掉了。
2. COPY.md 第六節列的兩件：chips 按下的狀態要不要降一階、故事類內容之後怎麼進「主題與科別」。
3. HERO 收尾詩的三案 A／B／C（[COPY.md](COPY.md) 第四節），從 2026-08-05 就擱著。
4. ~~齒顎矯正的藍要不要提亮~~ —— **2026-08-10 結案上線，見上面定案表。**
   走的不是提亮那條路：使用者從 `preview/spec-ortho-palette/` 的八案挑中青綠、**改給牙周**，
   **牙周原本的藍整組給矯正**，矯正因此從 L\* 36.3 跳到 49.5（比提亮三案最激進的 Ⓒ 還亮）。
   > **`preview/spec-ortho-bright/` 的三案與 [PALETTE.md](PALETTE.md) 第六之十二節整組作廢**，
   > 留著看推論就好，**不要再拿去實作**。第六之十五節（米色／稻草灰那八案）同理。
5. **[PALETTE.md](PALETTE.md) 第六之八節（科別的意象）要重寫**（2026-08-09 起，08-10 更嚴重）。
   顯微根管離開苔綠之後綠色段只剩一般牙科 151；**2026-08-10 牙周落在 h 190（青綠）、
   矯正搬到 h 273**，所以冷色端是牙周 190／矯正 273／贋復 273／外科 320。
   > **兩條意象已經不成立**：矯正原本綁「候診沙發」（那塊布是 `#4e718b`），
   > 牙周原本綁的是拆出來的那顆藍。反過來**牙周現在回到診療椅那一支（h 190）**，
   > 這一段其實可以寫得比原來更順。整節還沒動。
6. **手機版 HERO 的詩要怎麼排**（2026-08-09 起）。起因是使用者的朋友說
   「左上角 logo 的字跟 cover image 的字大小差不多，看起來會比較 noisy，可以增加 spacing」。
   實測成立，**而且手機比電腦嚴重**：375×812 上詩的上緣比頁首那一塊的下緣還高 2.9px，
   兩塊字是疊著的；1440×900 上也只有 63px。
   > **電腦版已結案並上線**（2026-08-09，commit `09b6f9d`）：提案 Ⓒ 鬆 ——
   > 距離 4vh→9vh（空隙 63→108px）、字距 .2em→.32em、行高 1.95→2.45、
   > 首行後間隔 .5em→.9em、max-width 34em→40em。三案的比較留在
   > `preview/head-hero-space/`（`?sp=a|b|c|c2`）。**字級一個都沒動。**
   >
   > **手機版還沒定。** 使用者說 Ⓐ／Ⓑ／Ⓒ 三案在手機上「都不好，壓到房子了」，
   > 並給了四點：①第一行再往下降 ②降了會壓到房子，所以收兩段文字之間的間距、
   > 甚至字距 ③第二行比照 ④第三行拆成兩行。
   > 新提案頁 **`preview/hero-mobile-skyline/`**（`?m=m1|m2|m3`，`&sky=1` 疊出天空邊界），
   > 完整推導在那一頁 `<head>` 最後的註解。要接手就從那一頁看，不要重新目測。
   >
   > **那一頁量出來的三件事，接手前先知道：**
   > 1. 照片的可用天空是一個**楔形**（逐列掃描 JPG 得到的實測表就寫在那一頁）：
   >    390 寬時右界從 y52px 的 291px 一路收到 y140px 的 182px，y216px 以下只剩 64px。
   >    詩是「左上角固定、往右往下長」，方向正好相反 —— 這才是一往下推就撞房子的原因。
   > 2. **使用者的第 4 點瞄錯行了**：拆第三行**一點高度都換不到**（拆或不拆，
   >    能降到的最低點完全一樣）。卡住整首詩的是**第一行**（16 格，最長，
   >    而屋簷正好從它右上方壓下來）。拆第一行才換得到。
   > 3. 手機的幾何原本**不是等比例的**：`--pad` 撞在 1.25rem 下限（各寬度都是 20px）、
   >    字級 clamp 的下限 10px 在 320 寬會贏過 3.06vw。兩者都會讓同一組 vw 參數
   >    「390 上剛好閃過、375／320 上就壓到」。那一頁把左緣改成 5.13vw、
   >    字級下限降到 9.5px，整組才等比例。**最壞情況是 375（不是 320，也不是 390）**：
   >    376 以上字級撞到 11.5px 上限、相對變小反而安全。
7. **⚠ 全站最近的一對是 ΔE 13.3（填色）／10.5（深階）**，都低於原本的最小值 16.1；
   兩顆同色相 h 273，只差亮度。**不是待決事項，是要記住的約束** ——
   日後動到其中任何一顆，都要先把這一對重算過。見 [PALETTE.md](PALETTE.md) 第六之十四節。
   > **原本是「牙周 × 贋復」。牙周換青綠之後那組藍整組給了矯正，所以現在是
   > 「矯正 × 贋復」** —— 數字一模一樣，只是主角換人（第六之十六節）。
8. ~~牙周的青綠要幾階~~ —— **2026-08-10 定案 Ⓣ1 並上線**（兩階 `#317d78`／`#2a6d69`）。
   > **留下來的約束**：牙周的字階對全站連結色深綠松 `#214D48` 只有 ΔE 13.6，
   > 是全站第二緊的一格（最緊的是矯正×贋復 13.3／10.5）。**要動深綠松、牙周或矯正，
   > 得把這幾顆一起算。** 三案的完整數字在 `preview/spec-perio-teal/` 與第六之十六節。
9. **這個站的綠現在有三支**（2026-08-10 起）：一般牙科 h 151、牙周青綠 h 190、
   深綠松（連結色與診所資訊）h 186。後兩支同色相，只靠亮度分開。
   **診所資訊那顆要不要跟著重看，是還沒問過的一題。**
（兒牙白字那一件已經結案了，見上面的定案表。口腔外科的紫已定案 `#8e6299`／`#784e84`，
見 PALETTE.md 第六之九節與 `preview/spec-surg-violet/`；贋復假牙的藍已定案
`#335b8b`／`#182f4b`，見第六之十、十三、十四節與 `preview/spec-perio-split/`；
顯微根管的紅已定案 `#ae4f4d`／`#89202d`，見第六之十一節與 `preview/spec-endo-red-all/`；
**`#4478b5`／`#244369` 原本是牙周的，2026-08-10 起改屬齒顎矯正，牙周換成青綠
`#317d78`／`#2a6d69`**，見第六之十四、十六節與 `preview/spec-perio-split/`、
`preview/spec-perio-teal/`。）

### 把提案頁搬進正式站時，要一起帶的東西（2026-08-08 補，踩過）

提案頁是**自給自足的靜態快照**，正式站需要、但快照裡刻意沒有的東西，搬版型的時候
會整個掉在原地。2026-08-07 用電腦版提案頁換掉 `index.html`（commit `2c0f7aa`）時就漏了兩樣：

1. **`<script src="assets/counter.js" defer>` 整支沒帶過去。**
   結果首頁六張卡的瀏覽數永遠是「—」，窄帶那個數字則停在提案頁的**示範值 8642**
   （真值當時是 190）。文章頁一直都有掛，所以只有首頁壞。
2. **`data-views-self="home"` 被寫成 `data-views="home"`。**
   `-self` 才會 POST +1，沒有它首頁的計數就永遠不會長。

所以：**窄帶的 `data-count` 是提案頁專用的示範值，正式站絕對不要留著**，
真值只能來自 D1。`index.html` 的 `.band-views` 現在改成「真實數字回來 ∧ 捲進畫面」
兩個條件都到齊才跑動畫，並靠 `.is-on` 決定現身，在那之前是 `visibility: hidden` ——
不會先閃一個 0。API 掛掉或沒有 JS 就一直隱形，文章卡那邊則連前面的「・」一起收掉。

### 這一輪學到、很容易再踩的坑

1. **`backdrop-filter` 只作用在元素自己的框裡**，框的邊緣本身就是一條可見的線，
   跟顏色無關，調 alpha 消不掉。要用 `mask-image` 讓**模糊本身**淡入／淡出。
2. **CSS 自訂屬性的預設值那一行要排在覆寫它的規則前面。**
   `[data-spec]` 和 `[data-spec="kids"]` 權重相同，
   `[data-spec] { --accent-deep: var(--accent) }` 若排在後面，
   會把兒牙特別指定的深階字蓋回去 —— 顏色看起來「沒吃到」就是這個原因。
3. **在暗底上疊一個同樣暗的顏色，看不出任何變化。** 柏油漸層第一版整條用 `#221e1c`
   （L\* 12）疊在 L\* 6~15 的路面上，使用者說「看不出漸層」就是這個原因。
   要有變化就得換到更深的實測值（照片最底那一列 `#161413`，L\* 6.6）。
4. **iOS 沒有內建任何中文襯線字，`serif` 會整包退回黑體 —— 連數字一起。**
   這一頁是 `<html lang="zh-Hant-TW">`，WebKit 解 generic `serif` 是**照語言**去找的，
   找不到中文襯線就退回系統中文字（PingFang），而 PingFang 有拉丁字，
   所以 1983／9／6 也跟著變黑體。電腦上看不出來（有思源宋體／Times）。
   解法是把一個**確定存在於 iOS 的拉丁襯線字**排在 generic 前面：
   `"Noto Serif TC", "Source Han Serif TC", "Times New Roman", Times, serif`。
   字體比對是逐字做的 —— 數字命中 Times，中文在 Times 裡找不到就繼續往後掉到
   `serif`，跟以前一模一樣，**所以中文一個字都不會變**。
5. **rAF 與 IntersectionObserver 在 `document.hidden` 的分頁裡完全不會被呼叫**，
   連 IO 的第一次回呼都不送。窄帶數字原本「IO 說看得到才開跑」，
   在那種情境下會永遠停在 0。現在改成自己 `getBoundingClientRect()` 判斷，
   並在動畫外面加一條 `setTimeout` 保險絲，時間到了直接寫最終值。
6. **iOS Safari 的 `window.innerHeight` 不是眼睛看得到的高度** —— 它是工具列收起後的
   大視窗高度，比當下可見範圍高出整條網址列（100vh 在 iOS 爆框是同一個原因）。
   拿它判斷「捲進畫面了沒」會**提早**成立，動畫在使用者還沒捲到之前就跑完，
   等他捲到時數字早就停在最終值 —— 症狀是「iPhone／iPad 上完全不會動」。
   要用 `visualViewport.height`（iOS 9.3 以後都有），退回 `innerHeight`。
7. **不要在頁面還在載入的那一刻開跑動畫。** 手機上那一刻主執行緒在解 HERO 那張大圖，
   rAF 拿不到幾個影格，1.4 秒的動畫被壓成一兩下跳動，等於沒有動畫。
   窄帶數字現在多等一個條件：`load` 之後再 300ms（上限 3 秒，圖再慢也要讓數字出現）。

### 提案頁的切換條

`home-desktop-*` 幾頁都有切換條，網址可帶參數直接開到某一案
（`?band=`、`?gap=`、`?hero=`、`?align=`、`?fill=`）。
**參數的正規式要寫 `[a-z0-9]+`**，寫成 `[a-z]+` 會吃不到 `glass1` 這種帶數字的值，
比對失敗後悄悄退回預設，等於參數沒作用 —— 已經踩過一次。

切換條全部是提案用的，**定案後連同 `data-*` 屬性一起刪掉**，不要留到正式站。
