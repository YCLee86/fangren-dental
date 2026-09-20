# SEO／GEO 體檢（2026-09-20）

使用者交辦：「根據最新的 SEO/GEO 規則更新了解，設定 100 分評分表，檢查網站和頁面，出報告。」

| 檔案 | 是什麼 |
| --- | --- |
| [REPORT.md](REPORT.md) | **報告本體**。總分 76/100、逐頁分數、要修的事（照影響排序）、不要做的事、要使用者決定的六件 |
| [RUBRIC.md](RUBRIC.md) | 100 分評分表的定義與依據。為什麼這樣配分、每一項滿分長什麼樣 |
| [score.mjs](score.mjs) | 逐頁計分器（零依賴）。量的是 `_site/`，不是 repo 根目錄 |
| score.json／score.txt | 上一次跑出來的結果 |

重跑：

```bash
node tools/dist.mjs && node drafts/seo-geo-audit/score.mjs
```

⚠ **一定要先 `dist.mjs`** —— 直接量根目錄的 HTML 會把註解算進字數與重量，這一站差 37%。

⚠ 這一份放在 `drafts/` 是刻意的：它是內部文件，**不進 `_site`、不會上線**
（同 `drafts/door-notice/` 的做法）。使用者要在手機上讀的話，
另外開一頁 `preview/seo-audit/` 給他，不要直接把 markdown 推上站。

⚠ 報告裡**沒有任何一項自己動手改了**。P1／P2 每一項都寫明要改哪一支產生器的哪一段，
其中 P1-1 會動到 15 篇的內容雜湊、P1-2 會動到著陸頁版型（照第八節該先開提案頁），
所以都等使用者決定。
