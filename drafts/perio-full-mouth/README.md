# 〈牙周病為什麼要全口治療〉—— 草稿（2026-09-23 開）

來源是使用者貼進來的兩份：一份衛教初稿（「牙周病治療，為什麼要從全口開始？」）、
一份文獻整理（局部型盛行率、局部重度的成因、輕中度不處理的進展、治療後殘留囊袋）。
這一份把兩份合成**站上的衛教文章**：`/posts/perio-full-mouth/`（牙周照護 `perio`）。

預覽頁：`/preview/perio-full-mouth/`（noindex，定案上線後刪掉）

| 檔案 | 是什麼 |
| --- | --- |
| `preview-gen.mjs` | 產生預覽頁。骨架抓 `posts/perio-laser/index.html`（同一科）。**改內文改這一支再重跑** |
| `SOURCES.md` | 查核表：每一個數字的出處、判定，以及刻意沒寫進文章的那些 |

```bash
node drafts/perio-full-mouth/preview-gen.mjs
```

## 和站上既有三篇牙周文章怎麼分工

| 篇 | 講什麼 | 這一篇怎麼處理 |
| --- | --- | --- |
| 〈八成人有牙周病〉perio-prevalence | 普遍、分四層、中間不痛、進展機制 | 不重講分層與機制，**連過去** |
| 〈牙周病治療〉perio-laser | 清創、水雷射、再生手術的內容 | 不重講療程細節，**連過去** |
| 〈牙齦流血不是火氣大〉gum-bleeding | 早期訊號 | 不重講 |
| **這一篇** | **只有一顆在痛，為什麼要全口** | 局部型、那一顆為什麼特別重、其他顆放著會怎樣、殘留囊袋 |

## 還沒做的

| | |
| --- | --- |
| HERO 插畫 | ✅ 2026-09-25 定稿，見 hero-prompt.md 最後一節 |
| 上架日 | `PUBDATE` 是佔位符；`--publish` 分支刻意會擋下來（HERO 沒有就不能上線） |
| 診所事實 | 分幾次、多久做完、急性處理的內容 —— **沒寫**，見 SOURCES.md 🏥 那幾列 |
| 外部連結 | 兩個 PubMed 搜尋連結，容器連不出去、沒有真的點開過 |

---

## ✅ 2026-09-25 定案上線 —— `/posts/perio-full-mouth/`（站上第二十篇・牙周照護）

`preview/perio-full-mouth/` 已刪（含白平衡 C 的三張暫存圖），推導在 `/history/perio-full-mouth.html`。
**這個資料夾留著，因為它仍然是這一篇的唯一來源。**

```bash
node drafts/perio-full-mouth/preview-gen.mjs --publish   # → posts/perio-full-mouth/index.html
node tools/webp.mjs                                      # 換過 HERO 才要跑
node tools/build.mjs
```

⚠⚠ **不要手改 `posts/perio-full-mouth/index.html`**，內文與 `post-meta` 改 `preview-gen.mjs` 再重跑。

HERO：定稿 `hero-v6-final.jpg` → 裁掉底部 1px 白邊 `hero-src.jpg` → 白平衡 C（紙色 R−B 6）`hero-src-wb-6.jpg`
→ `node tools/hero-resize.mjs drafts/perio-full-mouth/hero-src-wb-6.jpg perio-full-mouth-photo`。
