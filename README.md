# 芳仁牙醫診所 部落格

雲林縣斗六市，在地經營超過四十年。純靜態網站，沒有任何前端框架與建置依賴（只需要 Node 執行一支腳本）。

| 環境 | 網址 |
| --- | --- |
| 正式站 | **https://fangren.net**（Cloudflare Worker） |
| 舊站（過渡期保留） | https://yclee86.github.io/fangren-dental/ |
| 原始碼 | https://github.com/YCLee86/fangren-dental |

`www.fangren.net` 已綁定，301 轉到主網域。
舊的 GitHub Pages 網址仍會跟著 push 一起更新，之後要處理轉址。

> 用 Claude Code 編修這個網站？架構守則與工作流程在 [CLAUDE.md](CLAUDE.md)，
> 配色規範在 [PALETTE.md](PALETTE.md)（含診所官方色票與實測數據，動顏色前先看）。
> 電腦版、手機版（claude.ai/code）讀到的都是這個 repo，所以兩邊看到的是同一份。

---

## 換一台電腦開工

有一鍵設定腳本，會檢查並安裝 Node / Git / GitHub CLI、登入 GitHub、下載專案、
設定 git 身分，最後驗證能不能正常建置。

**Windows**（PowerShell）：

```powershell
irm https://raw.githubusercontent.com/YCLee86/fangren-dental/main/tools/setup.ps1 -OutFile "$env:TEMP\setup.ps1"; & "$env:TEMP\setup.ps1"
```

若出現「因為這個系統上已停用指令碼執行」，先跑這行再重試（只影響目前這個視窗，
關掉就恢復，不需要系統管理員權限）：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

**macOS**：

```bash
curl -fsSL https://raw.githubusercontent.com/YCLee86/fangren-dental/main/tools/setup.sh -o /tmp/setup.sh && bash /tmp/setup.sh
```

預設裝到 `C:\MyProjects`（Mac 是 `~/Projects`）。要換位置就加參數：
`.\setup.ps1 -Path D:\Work` 或 `bash setup.sh ~/Work`。

腳本不會刪任何東西，專案已存在時改成 `git pull --rebase`，重複執行安全。

### 或者手動四步

```bash
git clone https://github.com/YCLee86/fangren-dental.git
cd fangren-dental
git config user.name "你的GitHub帳號" && git config user.email "你的信箱"
node tools/build.mjs --check
```

需要 **Node ≥ 20**、git、`gh auth login`。**不必 `npm install`**（這個專案沒有任何依賴），
也**不必裝 wrangler 或申請 Cloudflare token** — push 到 `main` 就會自動部署。

第二個人只要是這個 repo 的 collaborator（Write 權限）即可，完全不需要 Cloudflare 帳號。

> repo 層級的 git 身分一定要設，全域沒設，不設會 commit 失敗。兩人各自填各自的帳號。

設定完成後打開 Claude Code Desktop，工作資料夾選 `fangren-dental` 這層，
它會自動讀 [CLAUDE.md](CLAUDE.md)。

---

## 目錄結構

```
index.html                 首頁。文章卡片是「真的寫在 HTML 裡」的靜態內容
404.html
site.json                  網站正式網址（給 sitemap 用）
d1-schema.sql              計數器的 D1 資料庫建置指令，執行一次即可
wrangler.toml              Cloudflare Worker、靜態資產與 D1 綁定設定
src/
  worker.js                計數器 API（Worker，與網站同網域）
  allowed-slugs.js         允許計數的頁面白名單
assets/
  style.css                全站樣式
  counter.js               瀏覽計數器
  hero-clinic.jpg          首頁主視覺：診所建築外觀（自有照片，另有 -800 版供 srcset）
  clinic-room-*.jpg        診療室照片（自有照片，另有 -600 版供 srcset）
  hero-*.svg               各篇文章的插圖（自製）
posts/
  <slug>/index.html        一篇文章一個資料夾，網址就是 /posts/<slug>/
tools/
  build.mjs                產生首頁卡片、更新日期、排序、sitemap
  dist.mjs                 把要上線的檔案組進 _site/
  serve.mjs                本機預覽用的極簡靜態伺服器
  build-manifest.json      記錄每篇文章的內容雜湊，用來判斷有沒有被改過
```

## 本機預覽

```bash
node tools/serve.mjs
```

開 http://localhost:8791。計數器在本機沒有 Worker 可跑，會自動隱藏，其餘完全正常。

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
| `author` | 必填，但**不會顯示在頁面上**（署名已於 2026-08-02 移除），僅作為中繼資料 |
| `published` | 發布日期，`YYYY-MM-DD` |
| `updated` | **不用自己改**，由 build 腳本維護 |
| `hero` / `heroAlt` | `assets/` 底下的圖檔名與替代文字 |

## 修改既有文章

改完內文之後跑一次 `node tools/build.mjs` 就好。腳本會比對內容雜湊，發現這篇被改過，就把「最後更新」換成今天，同時更新文章頁上顯示的日期、首頁卡片的日期，並把它重新排到最前面。沒被改到的文章日期不會動，連續執行多次也不會重複跳日期。

只想看結果、不想寫檔：`node tools/build.mjs --check`

---

## 瀏覽計數器（Cloudflare D1）

計數存在 Cloudflare D1 資料庫 `fangren-dental-views`，透過 Worker 讀寫，前端不直接碰資料庫，也沒有任何金鑰要放在頁面上。

```
src/worker.js               API：GET 查詢、POST 加一（另含 www 轉址）
src/allowed-slugs.js        允許的代碼清單（由 build 自動產生，勿手改）
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
- API 只接受 `src/allowed-slugs.js` 裡的代碼，這份清單依實際文章自動產生，外部無法塞入不存在的頁面。首頁本身的代碼是 `home`。
- 在舊站或本機預覽時沒有 Worker 可跑，此時計數器**自動隱藏**，網站其他部分完全正常。

### 常用指令

需要先 `npx wrangler login`（日常編修用不到）。

```bash
npx wrangler d1 execute fangren-dental-views --remote --command "SELECT * FROM page_views ORDER BY views DESC"
```

本機連遠端資料庫預覽整站（含 API）：

```bash
npm run build && npx wrangler dev --remote
```

---

## 建置指令

| 指令 | 作用 |
| --- | --- |
| `npm run build` | 產生首頁卡片與 sitemap，並把要上線的檔案組進 `_site/` |
| `npm run check` | 只顯示排序結果，不寫任何檔案 |
| `npm run deploy` | build 之後直接用 wrangler 手動部署 |

`_site/` 只包含 `index.html`、`404.html`、`assets/`、`posts/`、`sitemap.xml`、`robots.txt`，不會把 `tools/`、`site.json`、README 放上線。

## 自動部署（已生效）

**push 到 `main` 就會上線**，幾分鐘內生效。不必手動跑 `wrangler deploy`，
也不必在任何一台開發電腦上放 Cloudflare token。

Cloudflare 後台的 Worker `fangren-dental` 已接上這個 GitHub repo，build command 為
`npm run build`。靜態檔案目錄、D1 綁定、自訂網域全都寫在 `wrangler.toml` 裡，
**這個檔案存在時後台改不動這些欄位**，所以不需要進後台設定。

`npm run deploy` 是手動部署的後路，需要先 `npx wrangler login`。平常用不到。

### 兩人協作

兩人共用同一個 repo（第二人加為 Write 權限的 collaborator），各自在自己電腦編修，
push 到 `main` 就部署。

**開工前的同步已經自動化**：`.claude/settings.json` 設了 SessionStart hook，
每次在 Claude Code 開啟這個專案時會自動跑 `node tools/sync.mjs`
（等同 `git pull --rebase --autostash`），並把拉到什麼顯示出來。
這個設定跟著 git 走，兩台電腦都生效，不必各自設定。

要手動同步就跑：

```bash
node tools/sync.mjs
```

`index.html` 與 `tools/build-manifest.json` 是 build 產物，兩邊同時改必然衝突，
所以「改完 → build → 立刻 push」，不要累積本機 commit。

### 不想碰終端機的話

直接用中文跟 Claude Code 說就行，它知道要做什麼（對照表寫在 [CLAUDE.md](CLAUDE.md)）：

| 你說 | 它會做 |
| --- | --- |
| 上線 / 發布 | build → commit → push，幾分鐘後 fangren.net 更新 |
| 同步 / 拉最新的 | `node tools/sync.mjs` |
| 預覽 / 我要看看 | 開本機伺服器給你看 |

### 沒有 GitHub Actions

`.gitignore` 直接排除了 `.github/`，repo 內沒有任何 workflow。
（開發機的 gh token 也沒有 `workflow` scope，推不上去。）部署完全靠上面的 Git 連線。

---

## 診所資訊

- 地址：雲林縣斗六市永樂街 70 號
- 電話：05-533-9369（頁面上是 `tel:` 連結，手機可直接撥號）
- 看診時間：週一至週五 08:45–12:00 / 13:45–16:45 / 17:45–20:30，週六日休診

已無 `【請填入…】` 佔位符。作者署名與「醫療審閱」欄位已於 2026-08-02 全站移除。

> 註：修改頁首、頁尾這類全站共用區塊**不會**動到文章的「最後更新」日期——`tools/build.mjs` 的內容雜湊只看 `post-meta` 與 `<main>` 之內的內容。
>
> 反過來說，**一次改動所有文章 `<main>` 裡的共用結構會讓每篇日期一起跳成當天**。
> 遇到時要手動把 `tools/build-manifest.json` 的日期改回原本的更新日，再跑一次 build。

---

## 圖片授權

首頁主視覺（診所建築外觀）與診療室照片皆為芳仁牙醫診所自有，未經同意請勿轉載。
原始檔為專業攝影大圖，已壓縮為網頁尺寸：主視覺 1600px / 800px，診療室 1200px / 600px，
透過 `srcset` 依螢幕寬度與像素密度自動挑選。

文章插圖與網站圖示為本站自製。

> 若日後改用第三方的 CC BY 授權照片，需在全站頁尾標示照片名稱、攝影者、授權條款連結與是否修改。
