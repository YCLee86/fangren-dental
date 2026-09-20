# 〈植牙能用多久〉—— 文章草稿（還沒上線）

- 預覽頁：`/preview/implant-lifespan/`（noindex，只給使用者在手機上讀）
- 產生器：`node drafts/implant-lifespan/preview-gen.mjs`
  （骨架抓 `posts/missing-tooth/index.html`，**內文就寫在那一支裡面**，改文字改它再重跑）
- 出處：`SOURCES.md`（每個數字都對得上一篇查過的文獻，改數字前先看）

來源是使用者 2026-09-20 貼進來的一份整理稿，這一版做的事：
把它改寫成這個站的文體（COPY.md 第十節：語氣親近、用詞精確），
把「📄 文獻」那種清單換成內文裡的連結（同〈八成人有牙周病〉〈隱形矯正〉的做法），
補上「重點整理」與免責那一段，並逐條查證數字（三處和原稿不一樣，見 SOURCES.md）。

## 定案那天要做的事

1. `git mv` 內文進 `posts/implant-lifespan/index.html`（草稿在 `drafts/` 是刻意的，
   放 `posts/` 會被 `tools/build.mjs` 掃到、直接出現在首頁）。
2. `post-meta` 補三個欄位：`published`（上線日）、`hero`、`heroAlt`。
3. HERO 插畫還沒畫 —— 先讀 ILLUSTRATION.md，圖是開場那一幕（兩位患者那一段）。
   畫好之後 `tools/hero-resize.mjs` → `tools/webp.mjs`。
4. `about` 的 `sameAs`：「人工植牙」已經有（Q68892328，抄自〈缺牙之後〉）；
   「植體周圍炎」「磨牙症」還沒查 —— **要在有網路的電腦上查 Wikidata**
   （雲端 session 連不到，Q 編號猜錯會把文章綁到別的病上）。
5. 文末導覽的「上一篇」改成當時真正的上一篇。
6. 跑 `node tools/build.mjs`，然後把 `preview/implant-lifespan/` 與這個資料夾的
   產生器刪掉（`SOURCES.md` 留著）。
