# 〈植牙能用多久〉—— ✅ 2026-09-21 定案上線

成品：`/posts/implant-lifespan/`（缺牙重建 `prosth`，站上第十七篇）
推導與逐輪紀錄：`/history/implant-lifespan.html`
提案頁與產生器已刪（CLAUDE.md 第八節規則 3）——
整頁還原：`git show f64b2a25:preview/implant-lifespan/index.html`

這個資料夾留下來的是**日後還用得到的東西**：

| 檔案 | 是什麼 |
| --- | --- |
| `SOURCES.md` | 文中每一個數字的出處（查過的頁面，不是憑印象）。**要改任何數字前先看這一份** |
| `hero-prompt.md` | HERO 的設計判斷、版面尺寸、出圖檢查表 |
| `hero-prompt.txt` | **定稿的提示詞**（第三輪）。⚠ 第七節第 19 條：定稿不留在 repo，下一輪就會被從零重寫 |
| `hero-prompt-v1.txt`／`-v2.txt` | 第一、二輪（出過圖） |
| `hero-prompt-a-three-panels.txt` | 最早那個三格的梗，沒有出圖就被換掉了 |

HERO 的成品在 `assets/hero-implant-lifespan-photo-{800,1600,2000}.jpg`（＋同名 `.webp`）。
換圖要跑 `node tools/hero-resize.mjs <原檔> implant-lifespan-photo` 再跑 `node tools/webp.mjs`。

⚠ **還沒做的兩件**（都不影響上線）：
Google Search Console 的「要求建立索引」（上線幾天再送）；
文中四個 doi.org／pubmed 連結**容器連不出去、沒有真的點開過**，請在手機上各點一次。
