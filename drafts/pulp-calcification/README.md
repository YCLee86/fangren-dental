# 〈根管鈣化〉—— 草稿（2026-09-21 開）

來源是使用者貼進來的一份**給醫師看的**整理稿（七節：名詞界定、機制、好發齒位、
亞洲族群盛行率、處理不當的後果、處理方式、建議引用文獻）。
這一份把它改寫成**站上的衛教文章**：`/posts/pulp-calcification/`（顯微根管 `endo`，站上第十八篇）。

預覽頁：`/preview/pulp-calcification/`（noindex，草稿定案上線後刪掉）

| 檔案 | 是什麼 |
| --- | --- |
| `preview-gen.mjs` | 產生預覽頁。骨架抓 `posts/bioceramic/index.html`（同一科）。**改內文改這一支再重跑**，不要手改 `preview/` 底下那一頁 |
| `SOURCES.md` | 文中每一個數字的出處，以及**刻意沒有寫進文章的那些**與理由。⚠ 改任何數字前先看這一份 |

```bash
node drafts/pulp-calcification/preview-gen.mjs
```

## 這一版做了什麼

> ### ⚠⚠ 第二輪（2026-09-21）：**整篇的對象換了**
>
> 使用者退回第一版：「這篇文章要說的並不是好好的牙齒鈣化要怎麼辦，
> 而是**這顆牙齒很有可能要根管治療（或是已經確定要根管治療）但根管鈣化了，該怎麼辦**。」
>
> 第一版的重心是「要不要打開」（無症狀鈣化的觀察等待）—— 那是**另一種讀者**。
> 第二版：
>
> ・那一整節壓縮成**開頭的一個 callout**，作用改成「界定這一篇不是在講誰」
>   （沒有症狀、根尖乾淨的話追蹤就好；變黃的門牙代表神經還活著）。
> ・主軸換成 **「『需要根管治療』和『鈣化』是同一個原因的兩個結果」** ——
>   讀者真正問的是「為什麼偏偏是我這一顆」。
> ・補上第一版**完全沒寫**的那一節：**打不通的時候還有哪些路**
>   （導引式開髓／根尖手術／意向性再植／拔除後重建，一張表四列，各有適用時機）。
> ・「處理不當的後果」從一串併發症改成**「遇到了怎麼辦」的表**，每一列都有下一步。
> ・台灣與全球的盛行率降級：只留「為什麼偏偏是我這一顆」用得到的那幾個
>   （補過的牙 2.1／4.7 倍、83.3%、第一大臼齒 50.0%），
>   全球統合值與「各國數字為什麼差三倍」整段拿掉。
>
> 第一版的整頁：`git show 53f70522:preview/pulp-calcification/index.html`

兩版共同的：

- **改寫成站上的文體**（COPY.md 第十節）：第二人稱、具體場景、有立場的短句；
  去掉市井口吻。講到「為什麼要多做這一步」時**受益者一律寫出來**（第十之三節）——
  例如停損點那一條：停下來保住的是「你這顆牙剩下的齒質」。
- **原稿九成以上的數字砍掉**：器械品項、材料濃度、AAE 難度分級、跨國盛行率表、
  C 形根管的東亞盛行率、糖尿病與心血管的爭議證據 —— 逐項的理由在 `SOURCES.md`。
- 照原稿自己的結論明講 **「這些風險大多來自打開它的過程，不是鈣化本身」**。
- 補「重點整理」（五問）與免責段落。

## 還沒做的

| | |
| --- | --- |
| **HERO 插畫** | 還沒畫。預覽頁上是一塊虛線佔位。畫之前先讀 ILLUSTRATION.md；出圖後跑 `node tools/hero-resize.mjs <原檔> pulp-calcification-photo` 再跑 `node tools/webp.mjs` |
| **上線日期** | `post-meta` 的 `published` 是佔位符，定案那天填 |
| **`about` 的 Wikidata** | 根管鈣化、髓石**查不到對應項目，留白**（CLAUDE.md 第十節第 3 項允許）。⚠ 不要猜 Q 編號 |
| **兩個外部連結** | 容器連不出去（`curl` 403、`WebFetch` 被 egress proxy 擋），**沒有真的點開過**。請在手機上各點一次 |
| **要不要問診所** | 文中「芳仁的顯微根管門診由受過牙髓病專科訓練的醫師看診，根尖手術也在同一個門診處理」沿用 `/topics/endo/` 上已經寫過的事實（陳芷鈴醫師專長列了根尖手術）。**導引式開髓刻意沒有寫成診所有提供**，只寫它存在、需要額外設備、不是每一間診所都有。**意向性再植同樣沒有寫成診所有做**。診所若真的有做，這兩處可以改寫 |\n| **費用** | 文中只寫「費用與次數會在治療計畫確定的時候一併說明」（沿用 `posts/bioceramic` 的寫法）。**沒有寫任何金額，也沒有寫健保給不給付** —— 那是 CLAUDE.md 第一段列的「還沒問到診所的事」之一 |

## 定案那天要做的事

1. `git mv` 預覽頁的內容搬成 `posts/pulp-calcification/index.html`
   （照 CLAUDE.md 第五節：改 `<head>`、`post-meta`、`data-views-self="pulp-calcification"`，
   把 noindex 與 `.pv-*` 那些東西拿掉，補回 HERO 與計數器那一塊）
2. `node tools/build.mjs`（首頁卡、sitemap、allowed-slugs、延伸閱讀、JSON-LD 會自己跟上）
3. 刪掉 `preview/pulp-calcification/` 與 `preview-gen.mjs`，推導文字搬進 `history/`

---

## ✅ 2026-09-22 定案上線 —— `/posts/pulp-calcification/`（站上第十九篇）

`preview/pulp-calcification/` 已刪。**這個資料夾留著，因為它仍然是這一篇的唯一來源。**

```bash
node drafts/pulp-calcification/preview-gen.mjs --publish   # → posts/pulp-calcification/index.html
node tools/webp.mjs                                        # 換過 HERO 才要跑
node tools/topics.mjs                                      # index.html 動過就要跑
node tools/build.mjs
```

⚠⚠ **不要手改 `posts/pulp-calcification/index.html`** —— 內文與 `post-meta` 改
`preview-gen.mjs`，改完重跑上面那串。那一支同時是守門：比喻的「路／走／方向」上限 3 次、
上架日不可以是佔位符、正式站不可以有 noindex、計數器要接對這一篇、
SEO／RELATED 的標記要留著給 build 填。

### HERO 是怎麼來的（前後二十一輪）

`hero-prompt.md` 一輪一節記著。成品 `hero-v17-lines.png` → `assets/hero-pulp-calcification-photo-*.jpg`。

⚠ **最後那兩條引線是程式畫的，不是模型畫的**（`leader-lines.mjs`）——
模型連壞三輪（接到膿包、移動時舊的沒刪、多長一條），而外切線有公式。
換圖要重跑那一支，**而且要重量一次座標**（圓心、半徑、終點都寫在它的檔頭）。

### 還沒補的

- `about` 裡「根管鈣化」與「髓石」查不到 Wikidata 對應項目，`sameAs` 刻意留白。
  ⚠ 這件事只能在**有網路的電腦**上做，雲端 session 連不到 wikidata.org，猜 Q 編號
  等於把文章綁到另一個疾病上（CLAUDE.md 第十節第 3 條）。
- 圖裡有兩個人站在放大鏡框外面（提示詞寫的是全部在框內）。使用者看過之後選了這一張，
  `heroAlt` 也照實描述。要收掉得整張重出。
