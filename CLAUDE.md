# 芳仁牙醫診所部落格 — 給 Claude Code 的專案守則

雲林縣斗六市的牙醫診所部落格。純靜態網站，**零 npm 依賴**，只用 Node 跑幾支腳本。
正式站 https://fangren.net（Cloudflare Worker + 靜態資產）。

這份檔案是給 AI 助理看的。人類用的說明在 [README.md](README.md)。

> ## 2026-08-22：使用者編了一個團隊
>
> PM、作家、事實查核師、工程師、資深美編／美感總監、資深使用者介面總監、
> 資深品牌顧問、資深網站設計與功能總監，**2026-09-11 再加第十二個：資深廠商與系統
> 對接經理**（別人的系統、別人的合約、別人說的「做不到」—— 它和前十一個最大的不同是
> **判斷的來源不在我們手上**，所以核心技能是「怎麼問」與「怎麼驗」；成因與交付見 TEAM.md
> 第 12 節，第一份交付物是 `/preview/line-vendor/`），**2026-08-22 那兩個：第九個資深插畫師
> （視覺敘事）** —— 圖裡面的事（梗、構圖、逐輪修圖）歸他，美編改管「圖擺進版面之後」；
> **第十個資深 AI Agent 應用專家** —— 把意圖翻成模型聽得懂的提示詞、管參考圖怎麼餵
> （出圖用 Gemini）。**誰負責什麼、要交什麼、什麼時候出場、
> PM 怎麼回報，全部寫在 [TEAM.md](TEAM.md)** —— 開工前先讀那一份。
>
> 它只管**分工與流程**；技術、顏色、文案、插畫的判斷仍然分別回
> 本檔與 PALETTE.md／COPY.md／ILLUSTRATION.md 拿；
> **已經定案的東西回 [DECISIONS.md](DECISIONS.md) 查、LINE 那條線回 [LINE.md](LINE.md)。**
> **使用者只跟 PM 講話**：所有人做完回報 PM，PM 檢查完才彙整成一份給他。

> ## 2026-09-02 起：多了一條平行的線 —— **LINE 官方帳號**
>
> 診所的 LINE 官方帳號（招呼圖卡、自動回應、圖文選單、提醒卡、圖文訊息）。
> **成品不在 fangren.net 上**，是要貼進 LINE 後台的訊息、圖與 Flex JSON；
> 網站只放**規格頁**（`preview/line-*/`）給使用者在手機上看、之後整包給廠商看。
>
> **要做 LINE 的任何一頁，先讀 [LINE.md](LINE.md)**（2026-09-18 從本檔第十一節搬出去），
> 再讀 **[`drafts/channels/README.md`](drafts/channels/README.md)**（那條線的總檔案）。
> 那裡有三件不知道就會做錯的事：**Flex 的字級是固定 px 不是比例**、
> **`button` 不支援圖示**、**這個帳號沒有專人即時回覆（所以不能寫「隨時問」）**。

> ## 2026-08-21：SEO／GEO 這一輪**全部上線了**
>
> 三件技術面的成品（文章的「重點整理」、卡片改顯示上架日期、上線版剝掉註解）
> 2026-08-18 上線；**七科的著陸頁 2026-08-21 上線**，網址是 `/topics/<spec>/`，
> 首頁「主題與科別」那排標記已經從 `<button>` 換成 `<a>`。
>
> **這一輪沒有待辦了。** 要改著陸頁的文案就改 `tools/topic-copy.mjs` 再跑
> `node tools/topics.mjs`（見 [DECISIONS.md](DECISIONS.md) 九之〇節），
> 動手前先讀 **[COPY.md](COPY.md) 第九節**，尤其**第九之十七節那張十一條的檢查表**。
>
> 還沒做的只剩兩件，兩件都要先問使用者：**每一頁要不要配一張自己的圖**
> （分享圖沿用首頁那張診所夜景，七頁共用一張；見 [DECISIONS.md](DECISIONS.md) 第九節第 19 項）、
> 以及各科 `ask` 裡那些**還沒問到診所的事實**（療程次數、回診間隔、自費結構）。

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
> **要畫或改任何插圖之前，先讀 [ILLUSTRATION.md](ILLUSTRATION.md)。**（2026-08-15 新增）
> 那份是插畫的唯一依據：使用者看過十二個作品集之後歸納出來的線／面／質感／人物／
> 構圖規格，以及**畫出來就不要**的紅線。**顏色不在那份裡** —— 色值一律回 PALETTE.md 拿。
> ✅ **2026-08-16：六篇文章的 HERO 全部換成點陣插畫並上線**
> （`assets/hero-*-photo-{800,1600,2000}.jpg`），推導在 `/history/hero-photos.html`。
> 原本那六張 `assets/hero-*.svg` 每一項都不符合那份指引，現在**還留在 repo 裡
> 但已經沒有人引用** —— 要不要清掉（連同 `hero-*-1600.png` 與 `tools/og-images.mjs`）
> 還沒問過使用者。**不要自己動手刪。**
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
   發現文章被改過才把 `updated` 換成當天。
   `post-meta` 裡的 `updated` 欄位人工改了也會被蓋掉。
   > **⚠ 2026-08-18 起，`updated` 不再出現在畫面上，也不再決定排序。**
   > 那天七篇同時補「重點整理」，七張卡的日期一起變成當天，使用者：
   > 「文章卡片上的日期應該是上架時間，而不是最後更新時間。」定案：
   > **首頁卡、延伸閱讀卡一律顯示 `published`，首頁也依 `published` 排序**
   > （同一天上架時才用 `updated` 當第二順位）。文章頁 crumbs 那個 `<time>`
   > 本來就是手寫的上架日期，沒有動到。
   >
   > **⚠ 日期與排序必須用同一個欄位，不要只改其中一個** —— 卡片印上架日、
   > 卻依最後更新排的話，改一篇兩年前的舊文，它會跳到第一張、卡片上卻寫著
   > 兩年前的日期，讀起來就是壞掉。
   >
   > **⚠ `updated` 沒有被廢掉**，它仍然是三個**機器讀**的欄位的唯一來源：
   > `sitemap.xml` 的 `lastmod`、JSON-LD 的 `dateModified`、頁尾那句
   > 「網站最後更新」。**那三處不要改成 `published`** —— 它們的語意本來就是
   > 「這一頁最後改於何時」。
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
⛔ **絕對不要**手動跑 `wrangler deploy` 或 `npm run deploy`，也不需要 Cloudflare token。
那支指令送的是**本機的工作目錄**、繞過 `main` 也繞過建置，會把別台剛合併上去的東西整個蓋掉 ——
2026-08-25 就是這樣讓正式站抖了一整晚（見第二節那個 2026-08-20／25 的警告）。

> ## ⚠⚠ 2026-08-20：**推工作分支也會上線**（原本以為只建置 `main`）
>
> ### ❌ 2026-08-25：**推翻了 —— 不是分支建置，是有人手動 `wrangler deploy`**
>
> 使用者連著七八輪回報「植牙的線稿有時候看得到、重新整理又不見」。
> repo、`origin/main`、`npm run build` 的產物、`_site` 逐視窗的實際渲染、
> 六科逐科比對 —— **每一關都是對的**；換一個沒人開過的網址（`?t=…`）也一樣，
> 所以快取也排除了。最後請他打開 Cloudflare 後台的 **Deployments**，
> 那一頁的 Version History 最上面兩筆是：
>
> ```
> d3b6243f  口外分享圖第十三輪：…   [clau…]  by YCLee86   3m ago   ← 100% 生效中
> f934eaa5  口外分享圖第十二輪：…   [clau…]  by YCLee86  16m ago
> ```
>
> 第一眼判成「分支建置也上線」，**錯了**。使用者接著打開 Settings → Build：
> **生產分支是 `main`、`Builds for non-production branches` 根本沒有勾**。
> 再回頭追那個 commit：
>
> ```
> 33fc0d9 口外分享圖第十三輪…
>   → 只存在於 origin/claude/oral-surgery-landing-page-design-gxzvah
>   → 不在 main 上（git merge-base --is-ancestor 驗過）
> ```
>
> **真正的成因：另一台電腦的 session 自己跑了 `wrangler deploy`。**
> 那支指令把**當下的工作目錄**直接送上正式站，繞過 `main` 也繞過 Cloudflare 的
> 建置；而且它會把本機的分支名與 commit 訊息寫進部署紀錄 —— 後台顯示的
> `clau…` ＋「口外分享圖第十三輪」就是這樣來的，看起來才會像是分支被建置了。
>
> ## ⛔ 因此定一條紅線：**永遠不要跑 `wrangler deploy` 或 `npm run deploy`**
>
> 上線的唯一路徑是**把東西推進 `main`**，Cloudflare 會自己建置。
> `wrangler deploy` 的三個後果，這一輪三個都發生了：
> ・**它送的是本機工作目錄，不是 `main`** —— 別台剛合併上去的東西會整個消失。
> ・**它繞過建置** —— `tools/build.mjs`／`tools/dist.mjs` 有沒有跑過沒人知道。
> ・**兩台輪流部署會互相覆蓋**，畫面變成「一下有一下沒有」，而且**每一關都查不出問題**
>   （repo、`main`、建置產物、實際渲染全部正確），只有 Cloudflare 後台看得出來。
>
> wrangler 只有**操作 D1**（計數器資料表）時才會用到。要確認線上跑的是哪一版，
> 開 `https://fangren.net/version.txt`。
>
> ⚠ 這一輪還學到：**「線上看不到」要先分三層查**——① repo／`main` 對不對、
> ② 建置產物（`_site`）對不對、③ **線上跑的是哪一版**。第三層以前沒有辦法查，
> 現在有了：`https://fangren.net/version.txt`（見第九節第 23 條）。
> **兩個網址要用同一組隨機碼連著開**（頁面 ＋ version.txt），才是同一時刻的事實。
>
> 使用者在手機上看到 fangren.net 的**首頁**出現一篇還沒寫完的文章卡片、HERO 是破圖：
> 「這邊還沒寫好誒怎麼被推上線的趕快拿下來」。
> 查過的地方全部正常 —— `origin/main` 沒有那個 `posts/` 資料夾、`index.html` 裡沒有那張卡、
> `allowed-slugs` 也沒有那個 slug；推上 `main` 的只有 `preview/` 一個檔
> （每次都用 `git diff --stat origin/main HEAD` 確認過）。
> **所以那張卡只可能來自工作分支的建置。** 容器連不出去（`curl` 回 000），
> 無法直接驗證線上內容；Cloudflare 後台的建置設定只有使用者打得開。
>
> **在確認之前，一律照這個做：**
>
> - **沒定案的文章草稿放 `drafts/`，不要放 `posts/`。**
>   `tools/dist.mjs` 的 `ALWAYS`／`OPTIONAL` 都沒有 `drafts`，所以它進不了 `_site`；
>   `build.mjs` 也掃不到（只掃 `posts/*/`），首頁卡、sitemap、allowed-slugs、
>   延伸閱讀全都不會冒出來。定案那天再 `git mv` 回 `posts/<slug>/index.html`。
> - **推分支之前先確認建置產物**：
>   `git diff origin/main -- . ':!drafts' ':!preview'` 應該是空的。
> - 提案頁不受影響（`preview/` 本來就有三道 noindex，而且是刻意要讓使用者看的）。

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

#### ⚠⚠ 給使用者網址的兩條規矩（2026-09-04，他當面講的）

> 「為什麼每次網址後面都要一串中文註記　這樣我還要刪掉　直接分開不可以嗎」

1. **網址自己獨立一行，後面不要接任何中文。**
   他是在手機上「長按整行複製」的，網址後面黏著「（提案頁，兩案）」這種註記，
   他每次都要自己刪掉。要說明就寫在**上一行或下一行**，網址那一行只有網址。
   也不要用 `<…>` 或反引號把它包起來 —— 那些符號會一起被複製走。
2. ⚠⚠ **給網址之前先確認那一頁真的在 `main` 上。**
   `preview/` 的頁面推到工作分支等於沒上線（Cloudflare 只建置 `main`），
   而**那個 404 會被邊緣快取存住**（第九節第 23 條）——他按過幾次之後，
   就算檔案上線了他拿到的還是 404。
   ⚠ 已經踩過一次（2026-09-04，`/preview/line-booked/` 連著三輪給了他一個
   從來沒上線過的網址）。做法：

   ```bash
   git ls-tree origin/main preview/          # 那一頁在不在 main 上
   git push origin <工作分支>:main            # 不在就先推
   ```

   推完**等建置跑完**再給網址（開 https://fangren.net/version.txt 對 commit 編號），
   而且**第一次給要帶一串沒人開過的隨機碼**（`?t=…`）繞開已經被存住的 404。

#### 「定案幫我上線」＝ 合併到 `main`（2026-08-09 起）

雲端 session 的工作都在 `claude/...` 分支上，**Cloudflare 只建置 `main`**，
所以推到分支等於還沒上線。使用者說這句話的時候，他要的是**真的出現在 fangren.net 上**：

```bash
git fetch origin main
git log --oneline HEAD..origin/main      # main 有沒有被另一台推過東西
node tools/build.mjs && git add -A && git commit -m "..."
git push origin <工作分支>                # 先把分支自己推上去
git merge-base --is-ancestor origin/main HEAD && \
  git push origin <工作分支>:main         # 遠端直接快轉，不必 checkout main
```

> ⚠ **不要 `git checkout main && git merge --ff-only`**（2026-08-11 踩到）。
> 雲端 session 的容器裡那個**本機 `main` 常常是別的東西** —— 實際遇到的是
> 689f1f0，對 `origin/main` 「ahead 50, behind 50」，和工作分支**沒有共同祖先**，
> merge 直接回 `refusing to merge unrelated histories`。
> 那條舊線並沒有不見（掛在 `origin/claude/footer-icons-cutoff-9nk1wa` 上），
> 所以**也不要順手把本機 main reset 掉**。
> 上面那條 `<分支>:main` 的推法完全不碰本機 `main`，而且 `--is-ancestor` 先擋一次，
> 快轉不了就會停下來（那時才需要先 rebase 分支）。

推完告訴他 Cloudflare 要幾分鐘，網址是 https://fangren.net。

**動手前先掃一遍要合併的東西，把還沒定案的擋下來。** 分支上常常同時躺著
「已定案並套進版型的」和「還在提案中的」；`PALETTE.md`／`COPY.md` 裡標著
**提案中**、**未定**、**三案待選** 的段落是文件，跟著上去沒關係，
但**不要把還沒定案的顏色或文案套進 `index.html`／`assets/style.css`／`posts/` 再合併**。
不確定就先問他是哪一件定案了。

`preview/` 底下還在進行中的提案頁、以及 `history/` 的改版紀錄**跟著上去是正常的**
（本檔第八節：提案本來就是給他在手機上看的，`robots.txt` 與各頁的 `noindex`
已經擋掉搜尋引擎）。

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
index.html              首頁。POSTS 與 SEO 兩個區塊由 build 產生，其餘手寫
PALETTE.md              配色規範。動任何顏色之前先讀這份
COPY.md                 文案規範。動任何品牌文字之前先讀這份
ILLUSTRATION.md         插畫規範。畫或改任何插圖之前先讀這份（顏色不在裡面，回 PALETTE.md 拿）
TEAM.md                 團隊分工與流程。誰負責、要交什麼、PM 怎麼回報。內部文件，不進 _site/
DECISIONS.md            **已經定案的事與踩過的坑**（2026-09-18 從本檔第九節搬出來）。
                        動任何已定案的東西之前先查那張表；寫產生器、提案頁、量測腳本
                        之前先讀那 32 條。節號與條號沒有變，別處的指路仍然對得上
LINE.md                 **LINE 官方帳號那條線**（2026-09-18 從本檔第十一節搬出來）。
                        成品不在站上，做網站那一側完全用不到它。
                        商家貼文、臉書相簿、櫃檯立牌也在裡面。小節編號沒有變
clinic.json             診所這個「實體」的資料（sameAs、座標、郵遞區號…）。
                        **只放頁面上沒有的東西** —— 看診時間、醫師、科別一律回頭讀 index.html
404.html
favicon.ico             根目錄的點陣圖示，**只給 Google 的圖示爬蟲**。
                        由 tools/favicon-ico.mjs 從 assets/favicon.svg 算出來，已進版控。
                        ⚠ 刻意不在任何 <head> 宣告 —— 見 PALETTE.md 第六之七節
site.webmanifest        Android「加到主螢幕」讀的那一份（圖示、名稱）。
                        display 是 "browser" 不是 "standalone"，刻意的 ——
                        見 PALETTE.md 第六之二十節
site.json               網站正式網址（給 sitemap 用）
wrangler.toml           Worker、靜態資產、自訂網域、D1 綁定
d1-schema.sql           計數器資料表定義，執行一次即可
src/
  worker.js             計數器 API ＋ www 轉址 ＋ /history/* 的 noindex
  allowed-slugs.js      白名單，由 build 產生，勿手改
assets/
  style.css             全站樣式
  counter.js            前端計數器
  head-search.js        頁首那顆放大鏡的行為（2026-08-26）。首頁就地篩選，
                        文章頁與著陸頁按 Enter 送回 /?q=…#topics。
                        ⚠ 三份標記共用它（index.html／posts/*／topics/*），
                        改它要三邊一起驗。定案的六格見第九節那張表
  icon.svg              主畫面圖示的**來源檔**（不透明底、一色、牙洞原始比例）。
                        ⚠ 和 favicon.svg 是兩件事，不要合併 —— 見 PALETTE.md 第六之二十節
  icon-*.png            由 tools/app-icons.mjs 從 icon.svg 算出來，已進版控，勿手改
  logo.png              給 Google 的 Organization logo（透明底、品牌真值 #3f654a）。
                        由 tools/logo-png.mjs 算出來，已進版控，勿手改。
                        ⚠ 站上任何一頁都不會顯示它，只出現在 JSON-LD 裡
brand/                  **診所標誌的原件與形狀**（2026-09-03 使用者上傳）。
  shapes/               ⭐ **平常要用的是這裡**：十二個只有形狀的 SVG，單一路徑、
                        currentColor、**牙洞是真的挖穿的**（fill-rule evenodd）。
                        mark.svg ＝ 站上頁首那顆（對 .brand-mark 殘差 0.009%）。
                        整張總覽開 brand/shapes.png
                        ⚠⚠ **十二個檔，但只有九個是獨立的形狀**（2026-09-05 逐一量過）：
                        mark ＝ shape-r1c2 **逐位元組相同**、tooth-solid 對 shape-r2c2
                        **逐像素只差 0.8%**；mark-outline 是**描邊版**（墨只佔 17.0%，
                        那九個是 59.6~83.2%），真的不一樣但**份量不同級**。
                        要挑「一組看得出彼此不同」的形狀就用九宮格那九個 —— 見 brand/README.md
                        ⚠ 量描邊版**不可以只抄 <path d> 重組**（stroke 屬性與第二條路徑會掉，
                        畫出來是一顆實心的、數字看起來還很合理），整份 SVG 直接當圖畫
  fangren-logo-2024-12-05.ai   Illustrator 原件，A3 三個工作區域
  fangren-logo-104.pptx        ＝ PALETTE.md 第一節那個 104_logo.pptx，
                        裡面有設計師的官方匯出，**含 .ai 沒有的反白版**
  artboard-*.svg/.png   從 .ai 重畫的整張圖（含顏色）
  pptx-*.svg/.png       從 pptx 搬出來的官方匯出
                        ⚠ 容器裡沒有 Illustrator 也沒有 poppler／PIL，**要看它長什麼樣
                        就開那些 .png**（Read 工具直接看得到）。
                        ⚠ 不在 dist.mjs 的清單裡 → 進不了 _site，不會上線。
                        **不是上線資產** —— 站上仍然用 index.html 頁首那條路徑與
                        assets/icon.svg，不要改成從這裡引用。細節見 brand/README.md
posts/<slug>/index.html 一篇文章一個資料夾
topics/<spec>/index.html 科別著陸頁（七科，2026-08-21 上線）。**由 tools/topics.mjs
                        產生的 index.html 快照，不要手改** —— 文案改 tools/topic-copy.mjs、
                        版型改 tools/topics.mjs，改完重跑產生器。已進版控
history/<name>.html     改版紀錄（原提案頁的推導文字，定案後只留這個。見第八節）
history/index.html      改版紀錄的目錄
preview/<name>/index.html  進行中的提案頁；定案上線後刪掉、文字搬進 history/
                        ⚠ **`preview/line-*/` 是例外**：那幾頁的成品在 LINE 不在站上，
                        定案之後只拿掉切換條、頁面留著當規格頁。見第十一之五節
drafts/                 **還沒定案的草稿**（文章、提示詞、參考圖）。不會進 _site，
                        build.mjs 也掃不到 —— 見第二節那個 2026-08-20 的警告。
                        定案那天用 git mv 搬進 posts/<slug>/index.html
  doctor-photo/src/     **醫師形象照的原檔**（2026-09-19 起）。裁切器是
                        tools/doctor-photo-crop.mjs，成品在 assets/doctor-*.jpg
  door-notice/          **門口的停車告示**（2026-08-23）**＋ 周邊路邊停車格的現地清查**（2026-09-15）。
                        ⚠⚠ `map-bays.mjs` 把停車格寫進 `index.html` 的 `BAYS:START` 區塊
                        （座標出處 `parking-map.mjs`、號碼出處 `parking-survey.json`，
                        清查改了要重跑，接著跑 `topics.mjs` 與 `build.mjs`）。
                        ⚠ 成品是要印出來貼在
                        門口的 A4，**刻意不放在網站上**（使用者指定），所以住在
                        drafts/。兩行指令重做，推導與定案的值都在它的 README.md
  channels/             **LINE 官方帳號**（2026-09-02 起）。README.md 是那條線的總檔案，
                        另有招呼圖卡與提醒卡的 Flex JSON、守門與產生器。**見第十一節**
  line-hello/           招呼圖卡的頭圖（房子在說「芳仁　哩厚！」）。同上
  line-auto-reply/      自動回應的文字 ＋ 圖文訊息的圖。同上
  line-oa/              **圖文選單那幾格點下去回的卡**（診所資訊／主題與科別七科／衛教懶人包十二張）。
                        2026-09-07 從 origin/claude/line-merchant-message-input-p1w3r0 取過來 ——
                        ⚠ 那條分支和 main **沒有共同祖先**，只能取檔案不能 merge。
                        ⚠ 定案的是**案 D**（`health-carousel-d.json`），`-e` 那幾份是舊的。
                        產圖 `flex-preview.mjs`，搬上規格頁 `drafts/channels/oa-shots.mjs`
tools/
  build.mjs             產生首頁卡片、更新日期、排序、sitemap、allowed-slugs、結構化資料
  schema.mjs            JSON-LD 產生器（被 build.mjs 匯入，不單獨執行）。
                        看診時間／醫師／科別都是從 index.html 讀回來的，不另外維護一份
  og-images.mjs         把文章 HERO 的 SVG 轉成 assets/hero-*-1600.png（分享圖）。
                        ⚠ 2026-08-16 六篇改吃點陣之後**這支已經沒有用途**：og:image 直接
                        指向 -1600.jpg。留著只是退路，要不要刪還沒問過使用者
  dist.mjs              把上線檔案組進 _site/
  topics.mjs            產生 topics/<spec>/index.html（七科的著陸頁）。原名
                        topic-preview.mjs，2026-08-21 上線時改名。跑它會把每一科
                        還沒問到診所的事（ask）印出來提醒
  topic-lineart.mjs     著陸頁底圖的線稿上色器 → assets/lineart-<spec>.png。
                        `--art <線稿檔> --crop x,y,w,h`（生成的線稿幾乎一定會多畫
                        一條地面線，要裁掉）。⚠ `--region` 那條是「從插畫抽線」的舊路，
                        已經被使用者退回，留著只是紀錄，不要再用
  topic-copy.mjs        七科的文案（被 topics.mjs 匯入）。**要改文字只改這一份**，
                        每一科：lead 或 stance 或 groups／cases／flowTitle／flow／close／ask
  serve.mjs             本機預覽伺服器
  night-mode.mjs        夜間模式（2026-09-15）。寫 index.html／assets/style.css／posts/* 的 NIGHT 區塊、
                        assets/theme.js、assets/lineart-<spec>-night.png。**跑完接著跑 webp.mjs、topics.mjs 與 build.mjs**；
                        --check 只比對。動到白天的科別色或換線稿都要重跑
  sync.mjs              同步遠端（SessionStart hook 自動呼叫）
  setup.ps1 / setup.sh  新電腦一鍵環境設定
  palette-measure.ps1   從照片實測取色（k-means ＋ 局部裁切），配色改動的依據來源
  favicon-ico.mjs       從 assets/favicon.svg 產生根目錄的 favicon.ico。
                        只有改過 favicon 的顏色或幾何時才要跑，npm run build 不會呼叫它
  app-icons.mjs         從 assets/icon.svg 產生 assets/icon-*.png（主畫面圖示）。
                        同上，只有改過 icon.svg 才要跑；--check 只比對不寫檔
  hero-resize.mjs       文章 HERO 的原檔 → assets/hero-<name>-{2000,1600,800}.jpg
                        （Chromium canvas、JPEG 0.82）。出圖前擋兩件：四邊有沒有烘進去的
                        白框、長寬比在不在 RATIOS 那張允許清單裡（**16:9 與 4:3**，
                        2026-09-05 起 —— 前十一張都是 16:9，〈三個月一次的洗牙與塗氟〉
                        那張是 4:3）。⚠ 對話裡貼的圖落在
                        /root/.claude/uploads/<session-id>/，不在 /tmp；
                        **落不進去的時候去逐字稿的 base64 撈**，見第九節第 26 條
  webp.mjs              站上圖片的 WebP 版本 → assets/<原檔名>.webp（Chromium canvas）。
                        **照片**（JPEG，品質 0.82）→ 頁面用 <picture> ＋ <source type="image/webp">，
                        <img> 那一行仍是 JPEG；**七科的線稿**（PNG，無損與 0.82 取檔案小的）
                        → CSS 用 image-set()，前一行只有 PNG 的宣告留著當退路。
                        清單不是寫死的：掃 index.html／assets/style.css／posts/*/ 的
                        src／srcset 與 CSS 的 url() ——
                        ⚠ 所以 og:image 與 JSON-LD 的圖掃不到，**那是刻意的**（爬蟲一律吃 JPEG）。
                        只有換過圖才要跑，npm run build 不會呼叫它；--check 只比對不寫檔。
                        ⚠ 換過線稿要跑它，而且要在 night-mode.mjs 之後（夜間那七張也要轉）。
                        ⚠ AVIF 產不出來而且不會報錯，見 DECISIONS.md 那張坑表第 29 條
  logo-png.mjs          從 index.html 頁首的標誌路徑產生 assets/logo.png
                        （給 Google 的 Organization logo，**站上不顯示**）。
                        只有改過頁首那條路徑或要換顏色時才要跑；--check 只比對
  brand-extract.mjs     從 .ai／.pptx 抽出形狀、向量與預覽圖 → brand/。
                        零依賴：自己用 zlib 解 PDF 內容流與 zip、把 PDF 的路徑算符
                        翻成 SVG，再用 Chromium 出 PNG。只有換過原檔才要跑。
                        ⚠ 只支援外框化的路徑，**沒有支援活字與影像**。
                        ⚠⚠ **顏色一定要抽，不可以一律當成黑的** —— 牙洞是白色填色，
                        畫成黑的就消失在牙齒裡，而且**不會報錯**（2026-09-03 踩過）。
                        CMYK→RGB 是查表（來源是 pptx 裡 Illustrator 自己的匯出），
                        **不是算的**；表裡沒有的顏色會 throw。四道守門見它的檔頭
  doctor-photo-crop.mjs 醫師形象照 → assets/doctor-<slug>-400.jpg（圓頭像，顯示 76px）。
                        2026-09-19 上線，目前九位裡兩位有照片。
                        ⚠⚠ 裁切框逐張手量、**不能各裁各的** —— 九張要像同一組。
                        量髮頂／眼睛／下巴／臉中線，換算成第一張（李柄輝）的比例，
                        而且**框的大小照「頭寬」算不要照「頭高」算**。四道守門與
                        「再加一位要做什麼」寫在它的檔頭，推導在 /history/doctor-photo.html。
                        ⚠ 原檔在 drafts/doctor-photo/src/，不進 _site。
                        ⚠ 只有換圖才要跑，npm run build 不會呼叫它；--check 只比對
  qr.mjs                QR code 產生器（純 JS、零依賴、吐 SVG 的 path，向量）。
                        ⚠ 驗收不能用眼睛 —— 格式資訊反過來的話畫面一模一樣但掃不出來。
                        驗證方式寫在它的檔頭（臨時裝 segno ＋ opencv 真的掃一次）
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
- **每一頁 `<head>` 裡 `<!-- SEO:START -->` ~ `<!-- SEO:END -->` 之間**
  （結構化資料、robots、og:image、article:* 等機器讀的 meta，見第十節）
- **文章頁 `<!-- RELATED:START -->` ~ `<!-- RELATED:END -->` 之間**（底部的「延伸閱讀」三張卡）。
  ⚠ 這一段**在 `</main>` 外面**，是刻意的：`<main>` 在內容雜湊涵蓋範圍內，
  卡片放進去的話，每發一篇新文章就會讓所有舊文的「最後更新」跳成今天。
  它同時會避開該篇「上一篇／下一篇」已經指到的兩篇，不然同一個畫面會連兩次同一篇
- **`topics/<spec>/index.html` 七頁整份**（`index.html` 的快照，由 `tools/topics.mjs` 產生）。
  ⚠ 它們**不是** build 產物 —— `node tools/build.mjs` 不會重跑產生器，所以
  **改完 `index.html` 之後要自己跑一次 `node tools/topics.mjs`**，否則七頁會停在舊版
- **`index.html` 的 `<!-- BAYS:START -->` ~ `<!-- BAYS:END -->` 之間**（地圖上那 24 格
  路邊停車格，由 `drafts/door-notice/map-bays.mjs` 從現地清查產生）。
  ⚠ 它**不是** build 產物 —— `node tools/build.mjs` 不會重跑它
- `src/allowed-slugs.js`
- `tools/build-manifest.json`
- `assets/icon-*.png`（四張主畫面圖示，由 `tools/app-icons.mjs` 從 `assets/icon.svg` 算出來。
  要改就改 `icon.svg` 再重跑，`npm run build` 不會呼叫它）
- `assets/*.webp`（58 張 ＝ 44 張照片 ＋ 14 張線稿，由 `tools/webp.mjs` 從同名的 `.jpg`／`.png`
  轉出來。同上，`npm run build` 不會呼叫它 —— 換過圖就跑一次 `node tools/webp.mjs`，
  `--check` 可以先看差在哪。⚠ 換線稿的順序是 `night-mode.mjs` → `webp.mjs` → `topics.mjs` → `build.mjs`）
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

`post-meta` 多一個**選填**欄位 `about`（2026-08-10 起），把文章綁到具名的醫療實體上：

```json
"about": [{ "type": "MedicalCondition", "name": "牙周病" },
          { "type": "MedicalProcedure", "name": "牙周翻瓣手術" }]
```

實體要從**那一篇自己的 `<h2>` 與內文**挑，不要憑印象填。沒填就整個略過。
⚠ **改到 `post-meta` 就會動到內容雜湊**，那一篇的日期會跳成今天。
只是補後設資料（內文一個字沒改）的話，照第五節那個陷阱的程序把日期改回去。

底部的「延伸閱讀」三張卡不必管，build 會自己產生並排除上下篇。

### 陷阱：跨全部文章的 `<main>` 內修改

雜湊涵蓋 `<main>`，所以如果一次改動所有文章 `<main>` 裡的共用結構（例如 2026-08-02
移除全站作者署名），`build.mjs` 會把每一篇都判定成「內容更新」，舊文的 `updated`
一起跳成當天。

處理方式：build 之後**手動把 `tools/build-manifest.json` 裡那些文章的日期改回原本的更新日**，
再跑一次 build 讓頁面與卡片跟著還原。不要放著不管。

> **⚠ 2026-08-18 起這個陷阱輕很多，但沒有消失。** 那天起卡片顯示與排序都改吃
> `published`（見第一節第 3 條），所以**畫面上看不出差別了** —— 首頁卡的日期
> 與順序完全不受影響。會被誤傷的剩下三個機器讀的地方：`sitemap.xml` 的
> `lastmod`、JSON-LD 的 `dateModified`、頁尾那句「網站最後更新」。
>
> 判準因此變成 **「這次改動對讀者來說算不算內容變了」**：
> ・**算**（補「重點整理」這種真的加了東西）→ **讓它跳，不要還原。**
>   那是誠實的 `dateModified`，還能催 Google 回來重新檢索。
> ・**不算**（換 hero 圖檔名、補 `about` 後設資料、改 `sizes` 這種版型連動）
>   → 照上面的程序還原。2026-08-16 換 HERO 與 2026-08-17 改手機內距都是這一種。

---

## 六、診所資料

地址、電話、看診時間都已填妥，`<head>` 的 JSON-LD 也有 `openingHoursSpecification`。
目前**沒有**任何 `【請填入…】` 佔位符。

- 地址：雲林縣斗六市永樂街 70 號
- 電話：**畫面上一律寫 `05-5339369`**（2026-08-27 使用者定案，全站統一）。
  `<data value>` 也是同一份 `05-5339369` —— **括號整個拿掉了**。
  機器讀的另外兩份**沒有動**：JSON-LD 的 `+886-5-533-9369`（國際格式，
  國碼 +886、區碼的前導 0 拿掉）、`tel:+88655339369`（純數字）。
  ⚠⚠ **`(05)5339-369` 與 `05-533-9369` 已經作廢**（那是 2026-08-10 那一版），
  日後在舊文件或舊提案頁看到它們，**不要拿去「訂正」現行的寫法**。
  詳見 [PALETTE.md](PALETTE.md) 第六之十七節那個「第四版」。

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

## 八、改版紀錄 `history/` —— 提案頁定案後就刪掉（2026-08-12 起）

**這一節 2026-08-12 整個換掉了。** 原本這裡是 79 個提案頁（`preview/<name>/`）的清單，
使用者當天決定：**範例頁只放 fangren.net、定案上線之後就把頁面刪掉，只留下歷史文本**。
那 79 頁的推導、量測與落選案的數字搬進了 `history/`，一頁一個純文字存檔。

> **`preview/` 這條路徑本身沒有廢掉**（2026-08-12 當天稍晚就又用上了）。
> 上面那句「整個資料夾已經不存在」指的是**當下清空了**，規則是
> 「提案期間放 `preview/`，定案上線後刪頁、文字搬進 `history/`」——
> 所以那個資料夾本來就會時有時無。**目前是空的**（`hero-band-seam` 已於
> 2026-08-12 定案上線並刪除，文字在 `/history/hero-band-seam.html`）。
> 管線三處都還在（`tools/dist.mjs` 的 `OPTIONAL`、`robots.txt` 的
> `Disallow: /preview/`、Worker 的 `X-Robots-Tag` ＋ `no-store`），
> 下次新開提案頁直接建資料夾就好。
>
> **2026-08-13 更新：又空了一次。** `clinic-schedule`（門診表）已定案上線並刪除，
> 文字在 `/history/clinic-schedule.html`。那一頁是**自己寫的獨立頁**、不是
> `index.html` 的複本，所以上面那四個陷阱一個都沒踩到 —— 下次做小元件的提案頁
> 可以照這個做法，比複製整份 `index.html` 省事很多。
>
> **2026-08-14 再更新：`clinic-simple-map/`（診所簡易地圖）與它的整頁預覽
> `clinic-map-page/` 已定案上線並刪除**，文字在 `/history/clinic-simple-map.html`。
> 那一輪順帶示範了兩件事：**元件的提案頁（有切換條）與「整頁預覽」可以並存**——
> 前者比細節、後者看它擺進真實版面長什麼樣；整頁預覽是 `index.html` 的**快照**，
> 由一支一次性腳本產生（定案時連同腳本一起刪掉），所以絕對不要手改那一頁。
> 產生快照要做的六件事寫在該頁抬頭的註解裡，`/history/clinic-simple-map.html`
> 也留了一份。
>
> **2026-08-13 再更新：`preview/` 現在剩一頁 `post-cta/`（文章頁，提案中）。**
> 同一天 `cta-mobile`（首頁的品牌設計盤點）定案上線並刪除，
> 文字在 `/history/cta-mobile.html`。那一頁是 `index.html` 的完整複本，
> 上面那四個陷阱**全部照做**、沒有再踩到。它多示範了一件事：
> **項目多的時候，切換條可以做成「一項一顆開關」＋「多段的尺」**
> （高度、字級、距離、深淺這種要比數值的，做成分段按鈕比做成開關有用），
> 面板底下再掛現場量測。定案時只把選上的那幾項併回正式站，
> **沒選上的七項一個都不要順手帶進去**。
>
> **2026-08-15 再更新（當天第二次）：`card-type-mobile/`（手機的字級與地圖）
> 七輪定案上線並刪除**，文字在 `/history/card-type-mobile.html`。
> 那一輪示範了兩件事：**切換條可以同時掛五條尺**（文章卡字級／三塊內文／
> 點的大小／地圖裁多少／牌子的字），使用者一次把五格都選完；以及
> **「不會影響另一個版型」要用 fullPage 逐像素比對證明**，而且要先跑一次
> 「同一份程式碼、兩次截圖」當雜訊基準（這一站的 HERO 有浮動的指標與
> 數字動畫，721 那一格的雜訊比真正的差異還大）。
>
> **2026-08-15 更新：`preview/` 現在剩兩頁** —— `post-cta/`（文章頁）、
> `type-scale-ipad/`（字級）。同一天 `back-to-top/`（回到最上面的按鈕）三輪定案
> 上線並刪除，文字在 `/history/back-to-top.html`。
> 那一頁的切換條是**即時套用不重新載入**：那一輪沒有任何值會影響站上那三支
> 「開頁量一次」的 JS（`--sk-padT`／`--role-padT`／`--lamp-pad`），
> 所以不必像 `type-scale-ipad` 那樣按一下就重整。**要先確認這件事再決定哪一種**。
> 它還示範了一件事：**尺可以「一段一段拆」而不是給幾個完整的預設案** ——
> 「淡灰色的玻璃」拆成色／濃／模糊／框線四支，使用者三輪就走到他要的那一格。
>
> **2026-08-16 更新：`hero-motion-mobile/`（手機版 HERO 的動態）當天開、當天定案、
> 當天刪掉**，文字在 `/history/hero-motion-mobile.html`，產生器
> `tools/hero-motion-preview.mjs` 一併刪掉（一次性的）。那一頁多示範三件事：
> ・**提案頁的 class 一律加 `pv` 前綴** —— 第一版用了 `.foot`，和站上的頁尾撞名
>   （站上的 `.foot` 帶著卡片底色與 `padding-block: 2.4rem`），整條切換條被染成
>   白色的一大塊、按鈕的字還直排。它是 `index.html` 的完整複本，站上有的 class
>   全部都在，短名字幾乎一定會撞。
> ・**切換條在手機上不能吃掉半個畫面** —— 第一版把五個預設 ＋ 三條尺 ＋ 一排開關
>   全部攤開，量到一屏的 28%，而這一頁要判斷的正是「照片動得夠不夠」。
>   改成預設只留三案那一排 ＋ 一行提示 ＋ 底下那條（19%），尺收進「細調」。
> ・**提案的東西如果「會動」，切換條要預設不跟「減少動態效果」** —— 否則使用者
>   在自己的手機上什麼都看不到（他就是開著的），整個提案頁失去意義。
>
> **2026-08-15 再更新：`preview/` 當時有四頁** —— `post-cta/`（文章頁）、
> `illustration-style/`（插畫風格）、`hero-photos-cards/` 與
> `hero-photos-bass-brushing/`（文章 HERO 換點陣插畫）。
> ⚠ 最後那兩頁是**會長期開著的**：使用者 2026-08-15 指定
> 「所有的文章都做好再一次換」，所以圖一張一張進來、六篇湊齊才一起上線。
> 它們由 `tools/hero-photo-preview.mjs` 產生（**快照，不要手改**），
> 收到新圖時在那支的 `READY` 加一筆再跑一次就好。
> 這一輪也多示範一件事：**提案頁的產生器如果會反覆用到，就放進 `tools/`**
> （`clinic-simple-map` 那次的一次性腳本是用完即丟，這一次不是）。
>
> **2026-08-16 收尾：那一組長到七頁**（首頁複本 ＋ 六篇文章頁），
> 六篇湊齊當天定案上線、七頁與產生器 `tools/hero-photo-preview.mjs` 一起刪掉，
> 文字在 `/history/hero-photos.html`。**`preview/` 現在剩兩頁**：
> `post-cta/`、`illustration-style/`。
>
> **2026-08-16 再收一頁：`post-cta/`（文章頁的盤點，七項）收掉了。**
> ⚠ **那一頁不是定案上線，是使用者喊停的** ——「這個工作可以先關掉了，目前沒有要繼續，
> 之後要的話再另外呼叫紀錄就好」，所以**七項一項都沒有套進正式站**。
> 推導在 `/history/post-cta.html`，整頁在 `git show 5cb6c1e:preview/post-cta/index.html`。
> **`preview/` 現在只剩 `illustration-style/` 一頁。**
> ⚠ 這是第一次有提案頁「不是定案、是收掉」—— `history/` 的條目因此要寫清楚是哪一種，
> 不然日後看起來會像那七項已經上線了。
>
> **2026-08-16 再一頁：`hero-line3/`（HERO 詩的第三行與四句的字距）當天開、當天定案、
> 當天刪掉**，文字在 `/history/hero-line3.html`，產生器在暫存區（一次性、沒進版控）。
> 那一頁示範三件事：
> ・**文案的提案頁也要有量測面板** —— 這一輪真正難的不是選字，是「第三行變長之後
>   會不會折行、會不會壓到照片亮的地方」。面板現場量三行的實寬、兩個斷點各自的寬
>   與比值、以及各行字面帶底下照片最亮處的白字對比度。
> ・**量一行的寬度不能用 `el.getClientRects()`**（第一版踩到）：詩的每一行是
>   `display:block`，回來的是整個區塊 ＝ 版心寬（第一行和第二行因此量出一模一樣）；
>   行內元素則是**每一段**一個 rect，第三行有五段，數 rect 會誤判成「折五行」。
>   要用 `Range` 選起整行再**照 top 分組**。
> ・**產生器是模板字串，CSS 註解裡不能出現反引號** —— 寫了一個選擇器名字加反引號
>   就把樣板提早關掉，整支腳本語法錯誤。（近親見本檔第九節第 8 條：註解裡不能出現
>   結束標籤或註解的結束記號。）
>
> ⚠ 同一時間 `preview/` 底下還有另一台開的 `card-width-desktop/`（版心與卡片寬度），
> 那不是這一輪的東西，**不要順手收掉**。
> —— **2026-08-16 稍晚它自己定案上線並刪掉了**（使用者當天在另一台直接指定
> 「比對調整成蔡依橙 2.0 的版面大小」＝ 那一頁十二格裡逐字比照的那一格），
> 文字在 `/history/card-width-desktop.html`。**`preview/` 現在又只剩
> `illustration-style/` 一頁。**
>
> **2026-08-16 又開一頁、隔天收掉：`card-width-mobile/`（手機版的卡片寬度）**，
> 08-17 定案上線並刪除，文字在 `/history/card-width-mobile.html`，
> 產生器在暫存區（一次性、沒進版控）。**`preview/` 現在還是只剩 `illustration-style/`。**
> ——**2026-08-17 又開一頁、當天收掉：`tag-fade/`（橫捲那排標記的邊緣淡出）**，
> 當天定案上線並刪除，文字在 `/history/tag-fade.html`，產生器 `gen-preview.mjs`
> 在暫存區（一次性、沒進版控）。**`preview/` 現在又只剩 `illustration-style/`。**
> 三條尺：長度 16／12／10／8、曲線 S／直線、起步 跟著捲動／立刻整段，
> 另有一顆「對照現況」一鍵切回站上當時跑的那一組（16 ＋ 直線 ＋ 立刻）
> ＋ 現場量測面板。使用者三條全選在提案的預設那一格。
> 那一輪多示範三件事：
> ・**切換條的「量測面板」可以直接下判斷，不要只印數字** —— 這一輪真正的
>   判準是「斜坡會不會碰到第一個字」，面板因此現場算出「字在 11.8px」
>   再回答「沒碰到字／⚠ 蓋到 4.2」。使用者不必自己減。
>   ⚠ 第一顆捲出畫面之後那個判斷就沒有意義了（字從斜坡底下經過本來就是
>     這個效果該有的樣子），面板要改印「第一顆已捲出畫面」，不要硬算。
> ・**提案期間可以「只把提案頁推上 `main`」，修正本身留在分支上** ——
>   提案頁是從**已經修好的** `index.html` 抓的快照，而 `main` 上的
>   `index.html` 還是舊的，所以「對照現況」按下去才真的等於正式站。
>   定案時要做的只有兩件：分支併進 `main`、把那一頁刪掉。
> ・⚠⚠ **中途 `main` 被另一台推了東西（地圖的點擊高亮），分支 rebase 之後
>   提案頁那份快照要跟著重抓** —— 不重抓的話，使用者在提案頁上點地圖
>   會看到和正式站不一樣的行為。長期開著的提案頁尤其要記得這一條。
> `card-width-mobile` 那一頁多示範兩件事：
> ・**參考站量不到的時候，提案頁就是量尺** —— 雲端 session 的網路政策擋掉了
>   `blog.ichentsai.tw`，沒辦法像電腦版那一輪做出「兩站逐項比對」的表。
>   做法改成：把能動的那條尺切成四格、面板現場顯示卡片寬與留白，
>   讓使用者在自己手機上和參考站並排比。**不要用目測的截圖比例去改正式站。**
> ・**尺的下界要先量過再給** —— 第一版的四格是 20／16／12／8，8 那一格
>   量出來破框（頁首把版面撐成 397px），所以改成 20／16／14／12 才給使用者。
>   給出去的每一格都要是「選了就能上線」的。
> 那一輪示範了**「長期開著的提案頁」**這個新型態：一般的提案頁是一兩天的事，
> 這一組開了兩天、每收到一張圖就重跑一次產生器，中途正式站一個字都沒動。
> ⚠ 也留下一個教訓：**提案頁上量到的數字要在正式站再量一次**。
> 那七頁是 `index.html`／文章頁的快照，看起來一模一樣，但上線時才發現
> 文件裡寫的 `sizes` 在 721~1159 那一段高估 30%（欄寬上限是 `--content` 44rem，
> 圖不會跟著視窗長）—— 提案頁只看得出「圖對不對」，看不出「挑了哪一張檔」。
>
> **2026-08-16 更新：`type-scale-ipad-2/`（iPad 逐區塊的字級）當天開、當天定案、
> 當天刪掉**，文字在 `/history/type-scale-ipad-2.html`，產生器
> `tools/ipad-type-preview.mjs` 一併刪掉（那支是一次性的，和
> `hero-photo-preview.mjs` 會反覆用到不同）。那一頁多示範三件事：
> ・**四條尺可以「一條主尺 ＋ 三條區塊」並存** —— 主尺改 `html { font-size }`
>   整組跟著長，區塊的尺寫成 rem 疊在上面，面板顯示現場量到的 px，
>   使用者不必自己乘。他最後選的正是「主尺那條不要動」。
> ・**每條尺放一格「Ⓑ 手機同尺」當錨點** —— 這一站手機與 iPad 的欄寬其實差不多
>   （744 上兩欄，一欄約 330px），拿已經定案的手機值當基準比憑空給階有用。
> ・**切換條的「收起」要縮成右下角一顆小鈕，不是變矮的一條** —— iPad 的 HERO 是
>   「照片＋窄帶正好一屏」，整條的切換條會把窄帶整個蓋掉。
>
> **2026-08-19：`ortho-article/`（〈牙齒矯正〉那一篇的文章預覽）當天開、當天定案、
> 當天刪掉**，文字在 `/history/ortho-article.html`，成品是 `/posts/orthodontics/`
> （齒顎矯正，站上第九篇）。⚠ 它和 `perio-laser` 那次一樣是
> **文章草稿的預覽，不是設計提案** —— 沒有切換條、沒有候選案，
> 用途只是「讓使用者在手機上讀完整篇」。這一種多示範兩件事：
> ・**複本的來源是 `posts/<slug>/` 不是 `index.html`，所以第八節那四個坑只踩得到兩個半**：
>   相對路徑那一條**照樣要處理**（`../../` 剛好對，但 `../wisdom-tooth/` 這種同層連結
>   會指到 `preview/` 底下去，一律改成絕對路徑）、計數器那一條**照樣要拿掉**
>   （`data-views-self` 留著的話，每開一次預覽頁正式站那一篇就多算一次）；
>   切換條那一條用不到，`preview/` 進 `_site/` 那一條本來就已經就位。
>   **多出來一條 `index.html` 的複本不會遇到的**：`<head>` 那段 `SEO:START` 是 build
>   照 `post-meta` 產的，裡面的 JSON-LD、`canonical` 與 `og:*` 全部指向那個
>   **還沒上線的正式網址** —— 整段要換成 noindex，不然等於對外宣告一個不存在的頁面。
> ・**提案期間「只把提案頁推上 `main`」那條可以連資產一起推**：這一輪 `main` 上先後
>   只有 `preview/ortho-article/` 與三張 HERO 圖，`posts/orthodontics/` 一直留在分支上，
>   所以定案之前首頁的文章列表都還是八張卡。

> **2026-08-20：`bioceramic-article`（〈根管治療的生物陶瓷〉的文章預覽）定案上線並刪除**，
> 文字在 `/history/bioceramic-article.html`，成品是 `/posts/bioceramic/`
> （顯微根管，站上第十篇 —— **那一科原本零篇文章**）。
> 和 `ortho-article`、`perio-laser` 同一種：**文章草稿的預覽，不是設計提案**。
> 這一輪多出三件值得記的：
> ・⚠⚠ **中途分支的建置跑到正式站的首頁上了**（見第二節那個警告）。
>   處理方式是草稿改放 `drafts/`，定案才搬回 `posts/` —— 下一篇照這個做。
> ・**插畫十二輪，最後靠兩張參考圖收尾**：標誌與根管的形狀各自用文字描述失敗三到四輪，
>   改成給圖之後一次就中。通則寫在 ILLUSTRATION.md 第十之一節：
>   **形狀不要用文字描述，用參考圖。**
> ・**縮圖固定成 `tools/hero-resize.mjs`**，不再每次臨時寫。
>
> **2026-08-21：七科的著陸頁 `preview/topic-*/` 七頁一起定案上線並刪除**，
> 文字在 `/history/topic-pages.html`，成品是 `/topics/<spec>/`。
> ⚠ 那一組是**至今唯一一次「提案頁本身就是成品」** —— 定案不是把某幾項搬回
> `index.html`，是把整組快照從 `preview/` 搬到 `topics/`、拿掉 noindex、補上
> canonical 與 JSON-LD（六件事見第九之〇節）。產生器
> `tools/topic-preview.mjs` 因此**沒有跟著刪掉，改名成 `tools/topics.mjs`
> 留在版控裡**（它現在是正式站那七頁的來源，不是一次性腳本）。
> 樣式 `tools/topic-preview-style.html` 整段搬進 `index.html` 之後刪掉。
>
> **`preview/` 現在只剩 `illustration-style/` 一頁。**
>
> **2026-08-21 又開又收一頁：`clinic-map-pin/`（診所在地圖上改用圖釘標示）**，
> 當天開、十輪定案上線、當天刪掉，文字在 `/history/clinic-map-pin.html`，
> 產生器 `tools/map-pin-preview.mjs` 一併刪掉（一次性，但**有進版控** ——
> 那一輪 `main` 中途被另一台推了三次，快照要跟著重抓，放在暫存區會掉）。
> 那一頁多示範三件事：
> ・**提案頁可以「現況與新案兩組同時放在圖上」**，用 `opacity` 切、給一顆
>   「對照現況」。⚠ 不能用 `display:none` —— 站上那支 `sizeLabels()` 靠
>   `getBBox()` 量牌子，量到 0 的話切回現況時對話框會塌成一條線。
> ・**新加的東西不要蹭既有的 class**：新案的連結一開始想掛 `rl-link`，
>   但 `sizeLabels()` 會對每一個 `.rl-link` 找 `.rl-nm/.rl-pin/.rl-ul`，
>   混進去會在 `nm.getBBox()` 那一行整支掛掉、連停車場那三塊都不會畫。
>   自己一套 `cm-` 前綴就沒事。
> ・⚠⚠ **拿提案頁和正式站逐像素比對時，切換條是 fixed 的** ——
>   Playwright 的元素截圖照樣拍得到它，不先 `display:none` 藏起來，
>   會量到 22% 的像素有差，那全是切換條不是版面。
>
> **2026-08-22 又開又收一頁：`og-topic-card/`（科別分享卡的玻璃濃度與地名排法）**，
> 當天開、當天定案上線、當天刪掉，文字在 `/history/og-topic-card.html`，
> 產生器 `tools/og-card-preview.mjs` 一併刪掉（一次性）。
> 成品是 `assets/og-topic-general.jpg`，**產圖的 `tools/og-plate.mjs` 留在版控裡**
> （其餘六科的圖到齊時還要用它，不是一次性腳本）。那一頁多示範三件事：
> ・⚠⚠ **提案頁要擺「真的產出檔」，不要用 CSS 把成品再做一次。**
>   這一輪的成品是 JPEG，切換條底下擺的就是十二張真的 JPEG。理由有兩個：
>   ① CSS 重寫一份，哪天產生器改了這一頁就開始說謊；
>   ② 要判斷的是 **250px 下讀不讀得懂**，而真實的訊息卡是把 1200 的 JPEG
>   縮下來的**點陣圖** —— 用 CSS 縮放的向量文字會比實際清楚，等於在騙自己。
>   ⚠ 代價是十二張 ≈ 1.7MB，而 Worker 對 `/preview/*` 設 `no-store`：
>   先畫目前選的那一張，其餘十一張等 `load` 之後在背景預抓，切換才不會等下載。
> ・**模擬別人的介面時，文字要從自己產出的檔案讀回來。** 卡片上的標題與描述
>   是從 `topics/<spec>/index.html` 的 `og:*` 抓的，不照 `topic-copy.mjs` 自己拼 ——
>   自己拼會拼出一個訊息 app 上根本不會出現的東西，等於在假的東西上做決定。
> ・⚠⚠ **說「照首頁那樣做」的時候，要去把首頁量一次。** 這一輪最貴的一課：
>   「像手機版首頁的排法」第一版四項全錯，而且錯的**都是比例不是字級**
>   （標誌小 18%、間距只有一半、主名沒加粗、字距 .06 vs .01em），
>   是使用者拿他手機的截圖對照才發現的。在 390×844 上打開 `index.html`
>   讀一次 computed style 就全部對上了。
>
> **2026-08-22 再開又收一頁：`og-home/`（分享首頁時對方看到的那張卡）**，
> 當天開、當天定案上線、當天刪掉，文字在 `/history/og-home.html`，
> 產生器 `tools/og-home-preview.mjs` 一併刪掉（一次性）。
> 成品是 `assets/og-home.jpg`，**產圖的 `tools/og-home.mjs` 留在版控裡**
> （換照片或換那三格的數字要重跑）。那一頁多示範四件事：
> ・⚠⚠ **使用者說「顯示的不是現在的文字」時，先確認那是不是快取。**
>   這一次不是 —— 卡片逐字就是 `index.html` 當時宣告的 og:*，問題在標籤本身。
>   **先去讀自己產出的檔，不要先怪對方的 app。**
> ・⚠⚠ ~~**LINE 不裁圖。**~~ —— **2026-08-23 推翻了，見下面那一列「分享卡會被左右裁掉」。**
>   當時從截圖量（635×426 ＝ 1.491:1，和原檔 1.512:1 一樣）就下了「照原比例顯示」的結論，
>   **可是那張剛好是 1.51:1、剛好等於 LINE 卡片槽的比例**，所以沒被裁 ——
>   我把「這一張沒被裁」誤讀成「它不裁圖」。1.91:1 的圖左右各會被切掉 10.7%。
>   ⚠ **一個樣本推不出通則** —— 要說「它不裁」，至少要拿一張比例不同的圖再驗一次。
>   同一輪量到的另一件仍然成立：卡片實際只有 **212 CSS px** 寬（不是一般說的 250），
>   判斷字級大小要用這個數字。
> ・⚠⚠ **使用者提的解法方向不對時，要用數字說，不要照做。** 他建議
>   「把裁切改到寬和現況之間」，但量出來**拉寬反而更糟**：框下緣固定時，
>   「騎樓下緣到框下緣」在原檔裡是定值，框愈寬比例尺愈小、那段距離在畫面上就愈短
>   （90 → 32 → 41 → 52px）。**照做只會多繞一輪。**
> ・⚠⚠ **真正的解法他自己知道，而且站上早就有了**：「我為了不要壓到門面，
>   甚至在圖片下另外加深色橫帶」—— 站上 iPad 直放與手機版就是
>   「窄帶脫離照片接在下面」（第六之十八節）。**遇到版面問題先問「站上有沒有解過」。**
>   ⚠ 照抄時第一版把照片縮短（比例 1.91 → 2.4），屋頂被切掉、被退回；
>   改成**照片維持 1.91 的裁法、帶子疊在下緣蓋掉路面**才對。
>
> ⚠ 同一時間 `preview/` 底下還有另一台開的 `clinic-map-door/`，
> 那不是這一輪的東西，**不要順手收掉**。
>
> **2026-08-22 開、08-23 定案上線並刪除：`topic-lineart/`（著陸頁的線稿底圖）**，
> 文字在 `/history/topic-lineart.html`，產生器 `tools/lineart-preview.mjs`
> 一併刪掉（一次性）。那一頁多示範三件事：
> ・**量測面板要先算「有沒有字壓到」再下判斷** —— 這一輪真正的判準不是對比度
>   本身（那只是濃度的函數），是**這個寬度有多少字落在圖上**。0% 就直接說
>   「濃度不影響可讀性」，不要死板地印一個過不了的數字。
> ・**一條尺看起來會影響某件事，先算算看它到底影不影響** —— 使用者要的是
>   「不同大小 ＋ 在濃淡上做調整」，但**大小根本不改變對比度**，改變的是受影響的面積。
>   把這件事講清楚，比給他四組互相牽動的數字有用。
> ・**提案頁若有一格只在大螢幕出現，一定要嵌一個縮小的電腦版預覽** ——
>   使用者只用手機看（2026-08-22 已經踩過一次「好像沒有欸」）。
>
> **`preview/` 現在只剩 `illustration-style/` 一頁。**
>
> **2026-08-26 又開又收一頁：`head-search/`（頁首那三個選單右邊的放大鏡）**，
> 當天開、當天兩輪定案上線、當天刪掉，文字在 `/history/head-search.html`，
> 產生器 `tools/head-search-preview.mjs` 一併刪掉（一次性，但**有進版控** ——
> 那一輪 `main` 中途被另一台推了兩次，快照要跟著重抓，放在暫存區會掉）。
> 那一頁多示範三件事：
> ・**一頁可以跑兩輪不同的尺**：第一輪三條（展開方式／圖示長相／打字之後）定案之後
>   **收成寫死的值、從切換條上拿掉**，第二輪三條新的（搜尋範圍／搜不到怎麼辦／結果那一句）
>   接上去。切換條不會愈長愈長，已定案的也不會被重開。
> ・⚠⚠ **使用者問「這樣搜不到怎麼辦」的時候，先跑一批真實查詢再回答。**
>   十四個查詢實測之後，那一句話拆成三件完全不同的事（範圍太窄／站上根本沒印那個字／
>   有結果但在畫面外 105px），三件各自要治。憑感覺回答只會做出一個同義詞表。
> ・**提案頁的樣式要放進 `<head>`，不能塞在 `</body>` 前面** —— 快照裡的元素在樣式表
>   之前就被解析出來，關著的東西會在開頁那 180ms 整條閃出來（第一版就是這樣）。
>
> ⚠ 同一時間 `preview/` 底下還有另一台開的 `crown-materials/`，
> 那不是這一輪的東西，**不要順手收掉**。
>
> **2026-08-27 又開又收一頁：`card-more-button/`（文章卡的「繼續讀」）**，
> 當天開、當天五輪定案上線、當天刪掉，文字在 `/history/card-more-button.html`，
> 產生器 `tools/card-more-preview.mjs` 一併刪掉（一次性）。
> 那一頁多示範四件事：
> ・**使用者從別的地方帶一段 CSS 過來時，先逐條對站上的名字與變數**——
>   那一段用的 `.foot`／`.date`／`var(--c)`／`#fff` 四個名字，
>   站上要嘛不存在、要嘛是別的東西（`.foot` 就是頁尾）。**照字面貼上去會壞。**
> ・**切換條可以一路長到九條尺**（三條主尺 ＋ 細調），每一輪把新問題接成新的一條，
>   已定案的不重開。⚠ 其中「放不下」那一條**只在 721~1040 看得到**——
>   那個問題只存在於兩欄那一段，手機上多一行會讓切換條超過 24%。
> ・**面板要掃全部十一張卡、報最緊的那一科與最擠的那一張**，只量第一張會漏掉
>   真正會出事的那一張（對比度跟著科別色走、擠不擠跟著標題折幾行走）。
> ・⚠⚠ **本機驗收要先把瀏覽數補成真實值**：本機沒有 Worker，`.views` 被藏起來，
>   那一列比正式站短，而且拿它當折行判斷的基準會全部誤判。
>
> **⚠⚠ 2026-08-23：`clinic-map-door/`（門口的停車告示）不是定案上線，也不是收掉，
> 是「做完了但刻意不放在網站上」** —— 使用者：「這個專案內容不需要放在診所網站上，
> 都刪除，但 Claude 以後要做還找得到就好。」這是**第三種結局**，前兩種是
> 「定案上線」與「喊停」，`history/` 的條目寫法對它都不適用（`history/` 本身也在站上）。
> 做法：提案頁 `preview/clinic-map-door/` 刪掉，四個產生器從 `tools/` 搬進
> **`drafts/door-notice/`**（drafts 進不了 `_site`、build 也掃不到），
> 推導與定案的值寫在那個資料夾的 `README.md` 裡，**`history/` 不開條目**。
> 成品是貼在診所門口的 A4 告示（紅線提醒 ＋ 簡易地圖 ＋ 三顆掃了直接導航的 QR），
> 兩行指令就能重做，見該 README。
> ⚠ QR 的產生器 `tools/qr.mjs` **留在 `tools/`**：它是零依賴的通用工具，
> 站上日後要用得到，和這一輪的告示是兩件事。
>
> **2026-08-31 又開又收一頁：`chip-carry/`（標籤換頁不要跳）**，當天開、當天定案上線、
> 當天刪掉，文字在 `/history/chip-carry.html`，產生器 `tools/chip-carry-preview.mjs`
> 一併刪掉（一次性，**有進版控** —— 八頁快照，放暫存區會掉）。
> 那一組多示範三件事：
> ・⚠⚠ **要判斷「換頁那一下」，提案頁就不能只有一頁** —— 這一輪是**八份真的文件、
>   真的導覽**（首頁 ＋ 七科快照，標籤的連結指向提案頁自己）。用一頁 ＋ JS 模擬換頁
>   是做不得的，同 `og-topic-card` 那一輪：提案頁要擺真的產出檔。
> ・⚠⚠ **提案頁的計數器可以「降級」不必「拿掉」** —— 規矩本來是剝掉 `counter.js`
>   （不然每開一次首頁就多算一次），但那樣文章卡會印一排「—」，還要另外寫一個示範值，
>   而示範值正是 2026-08-07 被搬回正式站的那一個。改成只把 `data-views-self` 降成
>   `data-views`：只有 `-self` 會 POST +1，所以「不灌計數」與「印得出真數字」同時成立，
>   而且**沒有任何假數字可以被搬回去**。
> ・**切換條的模式要跟著網址走**（`?carry=0|1`，每一顆標籤的 href 都帶著）——
>   這一輪按下去就換頁，模式放在記憶體裡的話一換頁就掉了。
>
> **✅ 2026-09-15 當天開、當天十二輪定案上線：`night-mode/`（夜間模式）**，提案頁與提案期的產生器已刪，
> 文字在 `/history/night-mode.html`，**正式站的產生器是 `tools/night-mode.mjs`（留在版控裡）**，
> 顏色依據在 PALETTE.md 第六之二十三節。以下是提案期間的紀錄：
> 原本的產生器
> `tools/night-mode-preview.mjs`（**快照，不要手改頁面**，改完重跑）。起點是使用者給的
> snowmed-taiwan.com。六輪已挑定：**Ⓑ 窄帶藍灰**（底 `#17191d`、卡 `#282b31`）／
> **沒選到的藥丸＝套色 20% 淡色塊**（字按那塊底重算到 4.5）／**地圖 Ⓜ1 路比較亮**
> （白字釘回 `#f4f4f5`；**停車場那三塊當天稍晚整組重算了，見定案表「夜間地圖的停車場」那一列**）／**門診圓點次要文字色**／
> **開關放「主題與科別」那一行最右邊、預設跟著系統的 prefers-color-scheme**（電腦也一樣，
> 不另設預設）／**開關是 iOS 滑桿、無字，太陽月亮畫在圓鈕上，Ⓑ 軌道是天色**
> （白天琥珀 `#c28229`、夜間路牌藍 `#365685`、白鈕）。
> ⚠ 七科字階在深底上**同色相只提亮度到 4.5**，產生器現算，不要手填。
> ⚠ 頁首放不下開關（390 寬時診所名和選單疊 8px），不要再搬回頁首。
> ✅ 2026-09-15 第八輪：提案頁擴成**整站鏡像**（首頁＋十三篇文章＋七科，`/preview/night-mode/posts/<slug>/`、
> `/topics/<spec>/`），文章頁開關放在頂端那一行（首頁 › 科別 › 日期 › 瀏覽數）最右邊；
> 選擇記在 **localStorage `fangren:theme`**（`light`／`dark`，沒有 ＝ 跟著系統），換頁、重整、另一個分頁都跟著。
> ⚠ 320 寬的文章頁，開關會掉到那一行的第二列（仍靠右）。
> ⚠ 還**沒有**併進正式站：定案時要把那段樣式與兩支腳本搬進 `index.html`／`assets/style.css`／`posts/*`，
> 再跑 `node tools/topics.mjs` 讓七科跟上。
>
> **✅ 2026-09-15 開、09-16 定案上線並刪除：`map-bays/`（「鄰近停車格」那顆標籤）**，
> 文字在 `/history/map-bays.html`，產生器 `drafts/door-notice/map-bays-preview.mjs`
> 一併刪掉（一次性）——**但格子的座標與寫進 `index.html` 的那一支留著**
> （`drafts/door-notice/map-bays.mjs`，清查改了要重跑，接著跑 `topics.mjs` 與 `build.mjs`）。
> 那一頁多示範四件：
> ・⚠⚠⚠ **使用者說「定案」的時候，定的是他螢幕上那一格，不是產生器裡的預設值** ——
>   收尺（把尺上挑定的值寫回預設）之前要先跟他手上那張截圖逐格對一次。
>   這一輪我把「定案」收成當下的程式預設（空心＋實線），他補傳截圖才更正成**實心＋最細密**。
> ・⚠⚠⚠ **用 `String.replace` 往產生器裡插一段程式，錨點要連縮排一起寫死** ——
>   錨點寫「兩個空白 ＋ `chips.forEach(...)`」，先命中了**縮排四格、在 `paint()` 裡面
>   的那一個**，整塊就靜靜地被塞進 `paint()`：底下的函式讀不到那些變數、
>   而且每按一次就多掛一組 `MutationObserver`。產生器因此要有一道守門
>   （那支 inline script 要 `new Function()` 編得過 ＋ 幾支函式只准在最外層各宣告一次）。
> ・⚠⚠ **提案頁要「和站上逐位元組相同」的時候，元素截圖不能拍會溢出的那一層** ——
>   手機的地圖是 `slice`、`svg` 溢出 `.map-win`，拍 `svg` 會把框外的頁面一起拍進去
>   （量到一整條差異，其實地圖一個像素都沒動）。要拍的是**看得到的那一塊**
>   `.map-win`；電腦版 `.map-win` 是 `display:contents`（沒有盒子），那邊才拍 `svg`。
> ・⚠⚠ **一個東西沒有被改到，不等於它在比較裡會相同** —— 兩份文件的同一個元素
>   落在不同的小數位置上，逐位元組比對量到的全是次像素抗鋸齒。
>   這一輪的解法是讓兩邊的 `.map-fig` 落在同一個文件位置（`?p=bot`），不是去修圖。
>
> **✅ 2026-09-15 稍晚又開又收一頁：`night-map-park/`（夜間地圖的停車場藍與入口指標）**，
> 當天開、當天兩輪定案上線、當天刪掉，文字在 `/history/night-map-park.html`，
> 產生器 `tools/night-map-preview.mjs` 一併刪掉（一次性，**有進版控** —— 三個值要寫回
> `tools/night-mode.mjs`，快照要對得上）。定案的三個值與成因見定案表那一列。
> 那一頁多示範三件事：
> ・⚠⚠⚠ **一輪定案之後，那一輪寫下的理由可能被下一輪弄成假的**（第九節第 28 條 ②）——
>   第一輪「點到的塊」選的理由是「和沒點到同亮、只換色相」，第二輪把沒點到調暗之後
>   那句話就不成立了。**值沒有錯，要改的是它的理由**（改口成「釘在 L\* 52」），
>   而且那個錨要釘在**白天那一支**上，不能釘在會被下一把尺移動的東西上。
> ・**已定案的尺收成寫死的值、從切換條上拿掉，新的尺接上去**（同 `head-search` 那一輪），
>   網址參數仍然吃得到（`?e=` `?l=`）—— 切換條因此從 20.7% 收到 17.0%。
> ・⚠⚠ **提案頁的量測面板也會壞，而且畫面完全正常**：面板只在 `load` ＋300ms 量一次，
>   而站上那支「開頁先亮壹車房」在手機 4G 上比它慢 —— 使用者手機上的面板一直停在
>   「點一下地圖上的三塊停車場」。**凡是要等站上某個 class 上身才量得到的面板，
>   都要量到為止（加保險絲）＋ `MutationObserver` 監看，不要只量一次。**
>   ⚠ 另外面板**不可以讀自訂屬性去算對比**：`getPropertyValue('--map-road')` 回的是原字
>   （一串 16 進位），拿去配對數字會撿到色碼裡的位數（第一版量出 NaN 與 7.12）。
>   要讀**畫出來的那個元素**的 computed `fill`。

### 規則（要新開一個提案的時候照這個做）

1. **提案頁只放在 fangren.net。** 不要再用 claude.ai 的 artifact 給使用者看 ——
   那種網址拿到的人就看得到，而且不在版控裡、事後也難清。
2. 提案期間放 `preview/<name>/index.html`（沒有的話自己建這個資料夾），
   **一定要帶 `<meta name="robots" content="noindex, nofollow, noarchive">`**。
   切換條的網址參數正規式要寫 `[a-z0-9]+`，寫 `[a-z]+` 會吃不到 `glass1` 這種值。
   > **⚠ 提案頁是 `index.html` 的完整複本的話，有四件事一定要一起做**
   > （2026-08-12 `hero-band-seam` 那一頁踩過前三件）：
   > ・**相對路徑往上兩層**（`assets/` → `../../assets/`）。
   >   **不要用 `<base href="/">` 代替** —— 那會讓 `#topics` 這種錨點跳回首頁。
   > ・**把 `assets/counter.js` 與 `data-views-self` 拿掉**，窄帶的數字寫死並手動加
   >   `.is-on`（正式站是真值回來才加，不加就一直 `visibility: hidden`）。
   >   不拿掉的話**每開一次提案頁，首頁的計數就多一次**。
   >   ⚠ 那個假數字**絕對不要跟著版型搬回正式站** —— 2026-08-07 踩過（示範值 8642
   >   把真實的 190 蓋掉還不會動）。
   > ・**切換條要插在最後一個 `</body>` 前面。** 這一站的註解裡就寫著
   >   `</body>` 這幾個字（`.nav-lamp` 那一段），用 `String.replace('</body>', …)`
   >   會換到**註解裡那一個**，切換條落在 `<head>` 的樣式表中間、整段不會執行。
   >   症狀是「按鈕不見了、`data-seam` 是 undefined」。用 `lastIndexOf`。
   > ・**`preview/` 要進得了 `_site/`**：`tools/dist.mjs` 的 `OPTIONAL` 已經列了它，
   >   `robots.txt` 的 `Disallow: /preview/` 寫在 `tools/build.mjs` 裡，
   >   Worker 對 `/preview/*` 加 `X-Robots-Tag` ＋ `Cache-Control: no-store`
   >   （提案頁改得勤，不設 no-store 使用者重新整理會拿到舊的）。三處都已經就位。
3. **定案上線之後，把那一頁刪掉**，同時把它 `<head>` 裡的推導文字搬進
   `history/<name>.html`。切換條、`data-*` 屬性一起消失，不要留到正式站。
4. `history/` 是**寫完就不動的純文字存檔**：目錄在 `history/index.html`，
   一個條目一頁。三道 noindex 都在（頁面自己的 meta、Worker 的 `X-Robots-Tag`、
   `robots.txt` 的 `Disallow: /history/`，後者寫在 `build.mjs` 裡）。
5. **完整的提案頁留在 git**，不必另外備份：

   ```bash
   git show 5390136:preview/<name>/index.html > /tmp/<name>.html
   ```

   `5390136` 是 `preview/` 還在的最後一個 commit。每一頁的 `history/` 存檔上面
   都寫著這行指令。

### ⚠ 2026-08-19：新的提案頁上線後在正式站 404（狀況記錄）

`preview/topic-general/` 推進 `main` 之後 42 分鐘，`https://fangren.net/preview/topic-general/`
仍然回站內的 404 頁。**查過的地方都正常**，所以問題只可能在 Cloudflare 那一次建置：

- 檔案在 repo 也在 `main`（`git ls-tree origin/main preview/` 看得到）
- 本機 `node tools/build.mjs && node tools/dist.mjs` 跑完，`_site/preview/` 底下
  六個資料夾都在（含 `topic-general`），179 個檔案
- `tools/dist.mjs` 的 `OPTIONAL` 有 `preview`
- `src/worker.js` 對 `/preview/*` **沒有任何白名單**，只是把 ASSETS 的 404 轉成 404 頁

**判斷是哪一種的最快方法**：開另一頁已經上線的提案頁，看它是不是最新的文字 ——
如果連舊頁的最新修改都沒上去，就是**整條建置卡住**，不是單一檔案的問題。
雲端 session 連不出去（`curl` 回 000），Cloudflare 後台的部署紀錄只有使用者打得開。

### 網址

| | |
| --- | --- |
| 改版紀錄・目錄 | <https://fangren.net/history/> |
| 改版紀錄・單篇 | `https://fangren.net/history/<name>.html` |
| **進行中的提案** | `https://fangren.net/preview/<name>/` |
| 本機 | `node tools/serve.mjs` → <http://localhost:8791/history/>、`/preview/<name>/` |

`/preview/` 沒有目錄頁（`history/` 才有）—— 提案頁是一次一兩頁、直接把網址給使用者。

沒有鎖，也沒有任何連結指過去 —— 拿到網址的人看得到，`/history/` 與 `/preview/` 都一樣。
**真的不能外流的東西不要放這裡。**

> 為什麼沒有鎖（2026-08-06 的判斷，仍然有效）：那道 HTTP Basic 只擋得住
> `fangren.net` 這一側，repo 是 **public**，同一份 HTML 在 GitHub 上任何人都讀得到；
> 而且密碼要放在 Cloudflare Secret `PREVIEW_PASSWORD`，那個 secret 從來沒設過，
> Worker 一直在回 503 —— 結果是使用者自己用手機也打不開。**不要順手加回去。**

### 搬遷那一次做了什麼（2026-08-12）

- 79 頁全部抽出「只有那一頁才有」的註解（HTML 與 CSS 兩種都抽），
  **和 `index.html` 重複的那些不抄第二份** —— 後期的提案頁多半是 `index.html`
  的完整複本，不去重的話會把正式站的註解整份複製 79 次。
- 每個條目同時附上 `CLAUDE.md`／`PALETTE.md`／`COPY.md` 裡提到那一頁的段落。
- 共 79 頁 ＋ 目錄，約 1.1 MB 純文字（原本 `preview/` 是 6.1 MB）。
- **代價：畫面沒有了。** 早期那幾頁（`home-v2`、`canvas`、`hero-ppt-*`）的價值有一半
  是「看起來長什麼樣」，文字存檔留不住。要看就照上面那行 `git show` 還原。

### 結案時還開著、一起收掉的幾件

使用者 2026-08-12 說「其他專案已經定稿上線也結束」，所以下面這些**不再是待辦**，
留在這裡只是為了不要無聲消失。日後真的要做，先問使用者。

- ~~文章頁的選單沒有那三個玻璃框~~ —— **另一台在 2026-08-12 補上線了**
  （commit `77b1d7a`，只搬「靜止的框」那一態，外擴量改用 CSS 的 `min()` 算、
  沒有掛 JS；延伸閱讀那三張卡的 `.rel-tag` 也照抄首頁的 `.card-tag`）。
  文章頁仍然**沒有「亮起來」那一套** —— 那三項是跨頁連結，沒有任何一節可以偵測，
  不是漏做。
- `logo-favicon-plate` 的四個亮度候選（Safari 在圖示後面墊白底）沒有等到回報。
- HERO 收尾詩的三案 A／B／C（[COPY.md](COPY.md) 第四節）從 2026-08-05 就擱著。
- [COPY.md](COPY.md) 第六節的兩件：chips 按下的狀態要不要降一階、
  故事類內容怎麼進「主題與科別」。
- [PALETTE.md](PALETTE.md) 第六之八節（科別的意象）該重寫 —— 牙周換青綠、
  矯正搬到 h 273 之後，裡面兩條意象已經不成立。
- 「診所資訊」那顆深綠松要不要跟著牙周重看（全站的綠現在有三支）。

## 九、已經定案的事與踩過的坑 —— **搬到 [DECISIONS.md](DECISIONS.md) 了**

2026-09-18 搬出去的（原本 12.2 萬字元，每一輪都整份載入）。
**內容一個字都沒改，節號與條號原封不動** —— 別處寫著「第九節第 15 條」
「第九之〇節」的指路仍然對得上，只是要去那一份找。

> ⚠⚠⚠ **那不是歷史檔案，是規則。** 裡面每一條都是「已經踩過一次」
> 或「使用者已經決定過」的事。**動任何已經定案的東西之前先去查那張表** ——
> 顏色、字級、版型、間距、地圖、夜間模式、分享圖、線稿、頁首、搜尋、
> 文章卡、停車格，每一項都有一列寫著當初為什麼這樣定、落選了什麼、
> **哪幾個數字是使用者知情的取捨而不是 bug**。
>
> 不查就會做三件事之一：把他定案的東西改回去、重走一條已經被否決的路、
> 或是拿對比度去「訂正」一個他看過數字之後才選的值。

| 你要做的事 | 去 DECISIONS.md 讀哪一段 |
| --- | --- |
| 動任何已定案的東西 | **「已經定案的（不要再問、不要重做）」那張表** |
| 寫產生器、提案頁、量測腳本 | **「這一輪學到、很容易再踩的坑」32 條** |
| 新開提案頁／把提案頁搬進正式站 | 「把提案頁搬進正式站時要一起帶的東西」＋「提案頁的切換條」 |
| 七科著陸頁、SEO／GEO | 九之〇 |
| 還沒決定、還沒問到的事 | 「還沒決定的」 |

### 最常踩的五條（其餘 27 條在 DECISIONS.md）

留在這裡是因為**每一次寫腳本或改樣式都可能踩到**，而且五條的症狀都一樣：
**不報錯、畫面完全正常，只有拿數字量才看得出來。**

1. **CSS 註解裡不能出現樣式表的結束標籤，也不能出現註解的結束記號**
   （星號＋斜線）。HTML 解析器是純字串比對，寫下去樣式表就在那一行被切斷，
   後面整段失效。`<script>` 同理。這一站的註解寫得很長，特別容易踩。
   ⚠ 這一站常要寫 `L*`（CIE 明度），後面接斜線就中 —— 單位改寫成「每像素」。
2. **產生器是模板字串時，CSS 註解裡不能有反引號**（已經踩過七次）。
   症狀是幾十行外報 `SyntaxError` 或 `ReferenceError`。
   同一族：字串裡的 `\n` 要寫 `\\n`。
3. **`String.replace('</body>', …)` 會換到註解裡那一個** —— 這一站的註解裡
   就寫著那幾個字。用 `lastIndexOf`。往產生器裡插程式碼時，
   **錨點要連縮排一起寫死**（不然會插進某個函式裡面）。
4. **掃字的守門「掃整頁等於沒掃」**（已經踩到第十六次）。
   這一站每一份檔案都把「為什麼」寫在自己裡面，所以掃禁語一定會撞到自己的說明；
   而且一張表上同一個值往往出現不只一次。**要切出那一塊、或找那句話裡獨一無二的一段。**
5. **量測要量「畫出來的東西」不要量屬性**：`<img>` 的 `width` 屬性只是預設值，
   任何一條 CSS 的 `width` 都贏過它；`align-items` 對的是盒子、眼睛讀的是墨；
   flex／grid 裡量不到「本來要多寬」（要先切 `max-content` 再量）。

⚠ 還有一條不在上面但同樣重要：**版面的事不要一次只給一個值 —— 給一把尺**
（三到四格讓使用者挑），而且**改完要回頭問「這一改讓哪一句話變成假的」**。
完整的第 28 條（五個小條）在 DECISIONS.md。

---

## 十、結構化資料與實體（2026-08-10）

整站的 JSON-LD 由 `tools/build.mjs` ＋ `tools/schema.mjs` 產生，寫進每一頁
`<head>` 的 `<!-- SEO:START -->` ~ `<!-- SEO:END -->` 之間。**手改會在下次 build 被蓋掉。**

首頁是一份 `@graph`：`Dentist`（`#dentist`）＋九位醫師（`Person` ＋ `Physician`）
＋ `WebSite` ＋ `WebPage`。六篇文章各一份：`BlogPosting` ＋ `WebPage` ＋
`BreadcrumbList` ＋ 一份**精簡的**診所節點 ＋ `WebSite`。

### 不要違反的規則

1. **資料不重抄。** 看診時間讀 `#clinic` 那張資訊卡、醫師名冊讀 `#doctors`、
   科別讀 `#topics` 的 chips。要改看診時間就去改那張卡，JSON-LD 會自己跟上。
   `clinic.json` 只放**頁面上沒有**的東西（sameAs、座標、郵遞區號、國碼電話）。
2. **文章的 `author` 指向診所，不是某個人。** 2026-08-02 定案的「全站移除作者署名
   與醫療審閱」仍然有效 —— 這是機器讀的欄位，畫面上不會多出任何一行字。
   **不要為了 E-E-A-T 把署名或「醫療審閱」加回頁面上。**
   同理，文章頁刻意用 `WebPage` 而不是 `MedicalWebPage`（後者的重點欄位是
   `lastReviewed`，宣告一個沒有人做的審閱等於造假）。
3. **部定專科 ≠ 訓練經歷**，`hasCredential` 只收「衛生福利部…專科／專科醫師」。
   第一版只比對開頭，把李侑津醫師的「**衛生福利部雙和醫院**」（那是他任職的醫院）
   認成專科認證，等於幫他掛一個沒有的資格。規則同 COPY.md 第八之一節。
4. **分享圖不能用 SVG。** Facebook 與 LINE 的爬蟲不吃 SVG，`og:image` 指到 `.svg`
   等於沒設。
   > ✅ **2026-08-16 起這件事自己解決了**：六篇的 HERO 改成點陣插畫，
   > `og:image` 直接指向那張 `-1600.jpg`（爬蟲不吃的是 SVG，JPEG 從來沒問題），
   > 不必再轉一份 PNG。`tools/og-images.mjs` 因此**沒有用途了**，留著只是退路。
   > ⚠ `og:image:width/height` **不是寫死的 1600×900** —— 這批是 1600×**893**，
   > 由 `build.mjs` 的 `jpegSize()` 掃 JPEG 檔頭算出來（這站沒有 npm 依賴，
   > 不能用 sharp）。日後換圖比例不同也會自己對。
   > ⚠ `hero` 還是 `.svg` 的話 build 仍然走舊路（找 `-1600.png`），沒有拿掉。
5. **首頁 `WebPage.dateModified` 用佔位符**，等 `homeHash` 算完才換成真日期。
   先填日期會變成「換了日期 → 雜湊變了 → 下次又換成今天」的循環，
   首頁的 lastmod 從此天天跳。
6. **`sitemap.xml` 帶圖片擴充**（`xmlns:image`），列的是那一頁上真的有的圖：
   首頁三張診所實景、文章各自的 HERO。只寫 `<image:loc>` ——
   `image:caption`／`title`／`license` 這幾個 Google 2022 年就停用了。
7. `WebSite` **不宣告 `SearchAction`** —— 首頁那個搜尋框是純前端篩選，
   沒有會回結果頁的網址，宣告一個不存在的端點等於說謊。

### 這三種標記不要加（加了沒有回報，或會扣分）

| 類型 | 為什麼 |
| --- | --- |
| `FAQPage` | Google **2026-05-07** 起停止顯示 FAQ 複合式搜尋結果，6 月移除 Search Console 報表、8 月移除 API 資料 |
| `HowTo` | 2023-09 就下架了。〈貝氏刷牙法〉是典型的 how-to，還是不要加 |
| `Review`／`AggregateRating` | 在自己網站上標自己的星等是明文禁止的（self-serving review），會拖累整站 |

### 還沒補上的（都需要使用者提供，不要自己猜）

1. ~~座標~~ —— **2026-08-10 已填**：`23.7101740, 120.5468936`（使用者在 Google 地圖上
   長按診所位置取得）。`clinic.json` 的 `geo`，只出現在首頁的 `Dentist` 節點上。
2. ~~點陣 logo~~ —— **2026-08-19 補上並上線**：`assets/logo.png`（透明底 PNG、
   1200×600、品牌真值 `#3f654a`），由 `tools/logo-png.mjs` 從 **index.html 頁首那條
   標誌路徑**算出來（路徑不抄第二份）。`clinic.json` 的 `logo` 已填。
   > ⚠ **不能拿 `assets/icon-192.png` 代替** —— 那張的綠是被 iOS 玻璃效果補償過的
   > `#205533`（Google 不套那層效果，送過去就是偏暗的錯誤綠），底也是不透明白。
   > ⚠ **牙洞取「頁首那一條」的比例（0.102514），不是 `icon.svg` 的（0.093080）** ——
   > 使用者從兩案挑了前者。理由同上：`icon.svg` 的洞是為了扛 iOS 柔化調過的，
   > 那是裝置補償，不該帶進通用標誌檔。
   > ⚠ **已知取捨**：標誌是暗綠，**深色底上會偏弱**。使用者看過四種底色的對照表
   > 之後接受了。要解是另做一個深色底專用的亮色版（得先回 PALETTE.md 挑階），
   > 不是把這一張改一改。**不要自己動手加白底。**
3. **文章 `about` 的 `sameAs`** —— 六篇的 `about` 已於 2026-08-10 填好
   （`post-meta` 的 `about` 欄位，實體全部是從各篇自己的 `<h2>` 與內文挑的），
   但**沒有填 Wikidata 的 `sameAs`**：雲端 session 連不到 wikidata.org，
   而 Q 編號猜錯等於把文章綁到另一個疾病上。
   要補的格式是 `{ "type": …, "name": …, "sameAs": "https://www.wikidata.org/wiki/Q…" }`，
   在有網路的電腦上做。沒填 `about` 的文章會整個略過這個欄位。
4. **`sameAs` 的完整網址** —— Google 地圖與 FB 放的是分享短網址（會轉址，Google 跟得上，
   但完整網址更穩）。LINE 那條 2026-08-10 已由使用者提供並確認：
   `https://line.me/R/ti/p/@445rpiiv`（系統 ID）。
   ⚠ **不要改成 `@fafa070`** —— 那是同一個帳號的基本 ID，我曾據此推出
   `https://page.line.me/fafa070` 放進去，那是推的、沒驗證過，已經換掉。

### ⚠ 資料不一致仍然存在，而且網站這一側是使用者指定的（2026-08-13）

**現在有三組數字**（2026-08-10 從使用者的手機截圖看到 LINE 那兩組，
2026-08-13 又多了門口那面磁鐵門診表）：

| | **網站 `#clinic`（現行）** | 門口的磁鐵板 ＝ LINE「門診時間」 | LINE「營業時間」 |
| --- | --- | --- | --- |
| 上午 | **08:45–11:30** | 08:45–12:00 | 08:35–12:05 |
| 下午 | **13:45–16:30** | 13:45–16:40 | — |
| 晚上 | **17:45–20:00** | 17:45–20:30 | — |

⚠⚠ **網站這一組是使用者明確指定的，不要「訂正」。** 2026-08-13 換版型時
我一度依板子把三個數字改成 12:00／16:40／20:30，**使用者當天就要求改回原本那組**。
所以這不是漏改、不是舊資料 —— 日後看到板子或 LINE 和網站不一樣，
**先問使用者，不要自己動**。

**還沒處理的兩件（只有使用者能做）：**

1. **Google 商家檔案**上的那一組是哪一個，沒有確認過。
2. **LINE 上那兩組**（門診時間、營業時間）要不要收斂成一組。

> ⚠ 另外一件也還沒確認：**板子上週六早診有兩顆磁鐵**（一般牙科＋齒顎矯正），
> 但使用者指示「六日拿掉」，所以表格只排週一到週五、網站維持「週六、週日休診」。
> 板子上那兩顆因此沒有出現在網站上。日後若確認週六早上有診，要補回週六那一欄
> （只有早診那一格有點）並改 `.info-note` 那一句 —— JSON-LD 會自己跟上。

順帶一筆：電話的顯示寫法 **2026-08-27 由使用者改成 `05-5339369`**（前一版是
2026-08-10 的 `(05)5339-369`，已作廢）。全站（首頁窄帶與頁尾、七科著陸頁、
十一篇文章頁尾、404、`assets/head-search.js` 的出口）都已經改好，
`<data value>` 一起收成同一份；JSON-LD 仍是 `+886-5-533-9369`。
數字一個都沒變，`tel:+88655339369` 也沒動。推導與實測數字在
[PALETTE.md](PALETTE.md) 第六之十七節。

---

## 十一、診所的 **LINE 官方帳號** —— **搬到 [LINE.md](LINE.md) 了**

2026-09-18 搬出去的（原本 26 萬字元、佔整份 CLAUDE.md 的 60.6%，每一輪都整份載入）。
**內容一個字都沒改，小節編號原封不動** —— `drafts/channels/README.md` 裡
「第十一之三節」「第十一之七節」那些指路仍然對得上，只是要去 LINE.md 找。

那是一條**和網站平行的線**：成品不在 fangren.net 上，是要貼進 LINE 官方帳號
後台的訊息、圖與 Flex JSON（網站只放規格頁 `preview/line-*/` 給使用者在手機上看、
之後整包給廠商看）。**做網站那一側的工作完全用不到它。**

### ⚠⚠⚠ 要做 LINE 的任何一頁，先讀 [LINE.md](LINE.md)

那裡有三件不知道就會做錯的事：**Flex 的字級是固定 px 不是比例**、
**`button` 不支援圖示**、**這個帳號沒有專人即時回覆（所以不能寫「隨時問」）**。
讀完再讀 **[`drafts/channels/README.md`](drafts/channels/README.md)**（那條線的總檔案）。

⚠ 同一條線上還有三種成品也在 LINE.md 裡：**商家貼文那三張圖**
（主頁「最新貼文」三格）、**臉書粉專的相簿**、**櫃檯的小立牌與 A4 提醒單**。
