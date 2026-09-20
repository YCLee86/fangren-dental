# 接 Google Search Console API（2026-09-20）

讓 Claude 在容器裡直接讀 GSC 的資料 —— 搜尋字詞、索引狀態、sitemap。
工具是 `tools/gsc.mjs`（零依賴，用 Node 內建的 `node:crypto` 自己簽 JWT）。

> ## ⚠⚠ 先講做不到的那一件
>
> **「要求建立索引」API 沒有。** GSC API 整組沒有這個方法，
> URL 檢查（`urlInspection`）是**唯讀**的，只能查不能催。
>
> 另一支 Indexing API 看起來像可以（`urlNotifications:publish`），但 Google
> 明文限定**只吃 JobPosting 與 BroadcastEvent** 兩種結構化資料，牙醫部落格送
> 進去不會生效 —— 而且**這條限制在 API 的 schema 裡看不出來**，只寫在文件裡，
> 所以日後看到那個方法名不要以為能用。
>
> 要催索引仍然只有一條路：**使用者自己開 GSC 後台 →「網址審查」→
> 「要求建立索引」**。CLAUDE.md 第七節那句話沒有被這一支取代。

## 為什麼是「服務帳戶」不是一般的 OAuth 登入

兩條路都能通，選前者的理由：

| | 服務帳戶（採用） | OAuth 重新整理權杖 |
| --- | --- | --- |
| 要不要開瀏覽器登入 | **不用** | 要，每次重弄都要 |
| 會不會過期 | 不會 | ⚠ 應用程式停在「測試中」狀態時**7 天就失效** |
| 容器裡能不能用 | 能 | 能，但權杖要一直重發 |

（「讓 Claude 用容器裡的瀏覽器登入你的 Google 帳號」那條是死的：無頭瀏覽器
會被 Google 擋，而且要你的密碼與兩步驟驗證 —— 那個不該給、也不會要。）

## 一次性設定（全部在網頁後台點，不用開終端機）

### 甲、Google Cloud Console — 拿一把金鑰

1. 開 <https://console.cloud.google.com/>，左上角選一個專案，沒有就**建立專案**（名字隨意，例如 `fangren-gsc`）
2. 左側「**API 和服務**」→「**程式庫**」→ 搜尋 `Search Console API` → 點進去 →「**啟用**」
3. 左側「**IAM 與管理**」→「**服務帳戶**」→「**建立服務帳戶**」
   - 名稱填 `claude-gsc`（隨意）
   - ⚠ 中間那一步「**授予這個服務帳戶專案存取權**」**整個跳過不要選** ——
     這裡的角色是管 Google Cloud 資源的，和 Search Console 的權限是兩回事，
     選了只是多給一份用不到的權限
   - 「**完成**」
4. 點進剛建好的服務帳戶 →「**金鑰**」分頁 →「**新增金鑰**」→「**建立新的金鑰**」
   → 選 **JSON** →「**建立**」→ 瀏覽器會下載一個 `.json` 檔

> ⚠ 同一個後台還會下載到另一種叫「**OAuth 用戶端**」的 JSON，長得很像但**不對**。
> 要的那一份裡面有 `"type": "service_account"` 和 `"private_key"`。
> 拿錯的話 `tools/gsc.mjs` 會直接講，不會給你看不懂的加密錯誤。

### 乙、Search Console — 把那個帳戶加進去

⚠ **這一步最常被漏掉。** 有金鑰不等於有權限 —— 金鑰只證明「你是這個服務帳戶」，
不代表它看得到這個網站。

1. 用金鑰檔裡的 `client_email`（長得像 `claude-gsc@專案名.iam.gserviceaccount.com`）
2. 開 <https://search.google.com/search-console> → 左下「**設定**」→
   「**使用者和權限**」→「**新增使用者**」
3. 貼上那個信箱，權限選「**完整**」→「新增」

> 為什麼建議「完整」而不是「受限」：搜尋成效報表兩種都讀得到，但**網址檢查
> 需要完整**。看起來給很大，實際上不會 —— `tools/gsc.mjs` 拿的 OAuth 範圍
> 寫死是 `webmasters.readonly`（**唯讀**），就算 GSC 那邊給了完整權限，
> 這把金鑰也改不了任何東西。真正的限制在範圍不在權限等級。
>
> 如果你想更保守，選「受限」也行 —— 搜尋成效照樣讀得到，只是 `inspect`
> 那個子指令可能會回 403。

### 丙、把金鑰交給 Claude

- **雲端 session（claude.ai/code）**：直接把 JSON 的內容貼進對話。
  Claude 會寫進容器的暫存區，**session 結束就沒了**，下次要重貼。
- **自己的電腦**：把檔案放到 `~/.config/fangren-gsc-key.json`
  （Windows 是 `C:\Users\你\.config\fangren-gsc-key.json`），放一次就好。

> ## ⚠⚠ 金鑰絕對不要進版控
>
> **這個 repo 是 public 的**，金鑰 commit 進去等於公開，而且 git 歷史清不掉。
> `.gitignore` 已經擋了 `.gsc-key.json` / `*.gsc-key.json` / `gsc-key*.json`，
> 但不要只靠它 —— push 前用 `git diff --cached --name-only` 看一眼。
>
> **萬一外流**：Google Cloud Console → 服務帳戶 →「金鑰」→ 刪掉那一把，
> 立刻失效。再建一把新的就好，不影響其他東西。

## 怎麼用

```bash
node tools/gsc.mjs selftest      # 不需要金鑰，驗簽章那一段（10 項）
node tools/gsc.mjs sites         # 拿到金鑰後先跑這個
node tools/gsc.mjs query                          # 搜尋字詞（28 天、前 50）
node tools/gsc.mjs query --by page                # 改看哪一頁
node tools/gsc.mjs query --by query,page --rows 100 --days 90
node tools/gsc.mjs inspect /posts/bass-brushing/  # 這一頁 Google 收了沒
node tools/gsc.mjs sitemaps
```

共用參數：`--site <資源>`、`--json`（吐原始 JSON 給別的腳本接）。

## 三個會卡住的地方

| 症狀 | 成因 |
| --- | --- |
| **401** | 金鑰本身有問題（被刪、被停用，或容器時鐘偏掉） |
| **403** | 金鑰沒問題，但**乙那一步沒做**，或資源名稱打錯 |
| **429** | 超過配額。網址檢查每個資源每天 2000 次、每分鐘 600 次 |

**資源名稱有兩種，不要猜**：

```
sc-domain:fangren.net      網域資源（涵蓋 www、http、所有子網域）
https://fangren.net/       網址前置字元　⚠ 結尾那條斜線是有意義的
```

猜錯會回 403，看起來像沒權限其實是打錯。所以 `tools/gsc.mjs` **不猜** ——
先跑 `sites` 把真的有的列出來再挑。

## ⚠ 報表有 2~3 天的時差

Search Console 的資料落後大約兩三天，最近兩天常常是空的或偏低。
所以 `query` 預設的區間是「**結束於 3 天前**、往前 28 天」，不是「到今天」
（要改用 `--lag`）。看到最近幾天掉下來，**先確認是不是這個**，不要當成排名掉了。

## 和站內搜尋紀錄的關係

2026-09-20 同一天做好的 `/admin/search/` 記的是**站內**搜尋（進來之後找什麼），
這一支讀的是**站外**（Google 上怎麼找到我們）。兩邊是互補的：

- 站外有曝光、站內沒人搜 → 那個詞把人帶進來了，但站上內容接不住
- 站內一直搜、站外沒曝光 → 有需求但 Google 還沒把我們排上去，可以寫一篇
