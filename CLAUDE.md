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
| 「同步」「更新」「拉最新的」 | `node tools/sync.mjs` |
| 「預覽」「我要看看」 | `node tools/serve.mjs`，告訴他開 http://localhost:8791 |
| 「網站好了嗎」 | 確認已 push，提醒 Cloudflare 需要幾分鐘，網址是 https://fangren.net |

上線前若發現遠端有新 commit，先同步再 build、再推。

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
- `sitemap.xml`
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
  > 醫師介紹與診所資訊的科別色、跨三節共用的科別標記、點治療項目可篩選文章與醫師、
  > 換過的頁首標誌。**要接手這個專案就從這一頁開始看。**
  > 規則寫在 [PALETTE.md](PALETTE.md) 第六之二節。

- `preview/logo-banner/` — **標誌定稿的前後對照（2026-08-07）**。頁首標誌牙洞 1.3 倍、上移 0.50。
- `preview/logo-favicon/` — **favicon 的顏色，還在進行中**。淺色已定 `#4f6361`，深色還在挑；
  頁上是最後一輪的五個候選（色相 147°、彩度 24%，只差亮度）。
  下一步要問使用者選哪一個，選完才動 `assets/favicon.svg`。
- `preview/logo-favicon-wordmark/` — 同樣那五個候選，**配上「芳仁牙醫診所」六個字**（2026-08-07）：
  深色分頁列、深底頁首（圖標用色／字用白）、圖與字同色三種情境各排一次。
  多出來的一個限制：圖與字同色時只有 `#609c7b`（4.79）過得了文字的 4.5 門檻。
- `preview/logo-favicon-pair/` — **一鍵切換的成對比較**（2026-08-07）：定案的淺色 `#4f6361`
  與五個深色候選綁成五組，上方的「淺色／深色／自動來回」把整頁一起翻，看每一格跳多遠。
  深色模式下 `--mark` 只能寫在 `.row` 上（`--cand` 定義在 `.row`，寫在 `html` 層
  `var(--cand)` 在計算當下就解析失敗，整個變無效值）。
- `preview/logo-favicon-ab/` — **左右並排、一鍵換候選**（2026-08-07）。左半永遠是定案的
  `#4f6361`，右半用 1–5 在五個深色之間換（鍵盤左右鍵也可以），
  眼睛不用移開就能比。**這是目前最快看出差別的一頁。**
  裡面的五個已經換成**細分版**（依使用者要求保留原本的 1、2 當頭尾，中間依明度平均插三個：
  `#49785e` `#4b7a60` `#4c7c62` `#4d7e63` `#4f8065`，只差 0.7% 明度）。
  原本跨距大的那五個仍在 `logo-favicon`／`-wordmark`／`-pair` 三頁。
- `preview/logo-favicon-2way/` — **淺色五案 × 深色三案，兩邊都能換**（2026-08-07）。
  使用者覺得淺色偏深，所以往亮處做了四階：`#4f6361`（現況）`#526664` `#556967` `#586c6a` `#5b6f6d`。
  **提亮的方法是鎖住 Lab 色相角（189.7°）與彩度（C\*=8.10）只抬 L\***，
  不能只推 HSL 明度（會愈提愈灰，見 PALETTE 第六節）。
  **上限是使用者定的：第五案 L\*=45.22，比最深的深色案 `#49785e`（46.52）低一步**，
  淺色永遠比深色暗。深色維持上一輪的 1、2、3。15 種組合的 ΔE 都在頁上。

> **提案頁的互動請用純 CSS，不要用 JavaScript。**
> 在手機／雲端 session 裡把 HTML 直接傳給使用者看時，內嵌 `<script>` 會被預覽器擋掉 ——
> 使用者按了完全沒反應（2026-08-07 踩過，`logo-favicon-ab` 與 `logo-favicon-pair` 都重寫過一次）。
> 做法：radio ＋ `#id:checked ~ 兄弟` 選擇器換自訂屬性；整頁換色票用
> `html:is(:has(#id:checked))`；連「自動來回」都可以用 `@keyframes` 直接改自訂屬性做出來。
> 用 `:has()` 寫後代選擇器時**一定要包在 `:is()` 裡** —— 逗號分隔的
> `html:has(A), html:has(B) .x{...}` 第一段會套到 `html` 自己身上，
> 若那條規則是 `display:none` 整頁會直接空白。
> （正式站經由 `fangren.net` 開，JS 正常，這條限制只針對直接傳檔案看的提案頁。）
- `preview/logo-favicon-shift/` — 紀錄：favicon 牙洞往上移的四個位置，定案是上移 1.05。

  > **`assets/favicon.svg` 目前還是舊的那顆手繪牙，故意沒有換。**
  > 它被正式站首頁引用，顏色沒定案之前換上去等於動到正式站。

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
