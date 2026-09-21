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

- **改寫成站上的文體**（COPY.md 第十節）：第二人稱、具體場景、有立場的短句；
  去掉市井口吻。講到「為什麼要多做這一步」時**受益者一律寫出來**（第十之三節）。
- **原稿九成以上的數字砍掉**：器械品項、材料濃度、AAE 難度分級、跨國盛行率表、
  C 形根管的東亞盛行率、糖尿病與心血管的爭議證據 —— 逐項的理由在 `SOURCES.md`。
- **重心搬到「要不要打開」那一節**。原稿的 5-0 就是這樣安排的，但它被埋在第五節；
  站上這一版把它做成一張四列的表，放在整篇的中段，前面用兩節鋪陳
  （外傷後鈣化代表神經還活著、台灣的數字不是治療的比例）。
- **「處理不當的後果」改寫成「難在哪」**，而且照原稿自己的結論明講
  **「這些風險大多來自打開它的過程，不是鈣化本身」** —— 寫全了會變成在嚇人、
  也像在指責別的醫師。
- 補「重點整理」（五問）與免責段落。

## 還沒做的

| | |
| --- | --- |
| **HERO 插畫** | 還沒畫。預覽頁上是一塊虛線佔位。畫之前先讀 ILLUSTRATION.md；出圖後跑 `node tools/hero-resize.mjs <原檔> pulp-calcification-photo` 再跑 `node tools/webp.mjs` |
| **上線日期** | `post-meta` 的 `published` 是佔位符，定案那天填 |
| **`about` 的 Wikidata** | 根管鈣化、髓石**查不到對應項目，留白**（CLAUDE.md 第十節第 3 項允許）。⚠ 不要猜 Q 編號 |
| **八個外部連結** | 容器連不出去（`curl` 403、`WebFetch` 被 egress proxy 擋），**沒有真的點開過**。請在手機上各點一次 |
| **要不要問診所** | 文中「芳仁的顯微根管門診由受過牙髓病專科訓練的醫師看診」沿用 `/topics/endo/` 上已經寫過的事實。**導引式根管治療（3D 導板／即時導航）刻意沒有寫成診所有提供**，只寫它存在、需要額外設備、不是每一間診所都有 —— 診所若真的有做，這一段可以改寫 |

## 定案那天要做的事

1. `git mv` 預覽頁的內容搬成 `posts/pulp-calcification/index.html`
   （照 CLAUDE.md 第五節：改 `<head>`、`post-meta`、`data-views-self="pulp-calcification"`，
   把 noindex 與 `.pv-*` 那些東西拿掉，補回 HERO 與計數器那一塊）
2. `node tools/build.mjs`（首頁卡、sitemap、allowed-slugs、延伸閱讀、JSON-LD 會自己跟上）
3. 刪掉 `preview/pulp-calcification/` 與 `preview-gen.mjs`，推導文字搬進 `history/`
