# SEO／GEO 100 分評分表（2026-09 版）

這一份是評分的依據。報告在 [REPORT.md](REPORT.md)，逐頁的實際分數由
[`score.mjs`](score.mjs) 量出來（`node tools/dist.mjs && node drafts/seo-geo-audit/score.mjs`）。

---

## 〇、先說清楚這張表是照什麼定的

2026 年做這張表，**不能再把 SEO 和 GEO 當成兩件事來配分**。三個當下的事實決定了權重：

1. **Google 2026-05-15 出了第一份官方的生成式 AI 指南**
   （〈Optimizing your website for generative AI features on Google Search〉），
   裡面最關鍵的一句是：**「沒有額外的要求，也不需要特別的優化」** ——
   AI Overviews 與 AI Mode 跑的是**同一個索引、同一套排序與品質系統**。
   換句話說：**GEO 沒有獨立的技術層**，它是「把 SEO 做對」之後，
   再加上「內容好不好被整段抓走引用」。
2. **但是「被引用」和「被排名」不是同一件事。** AI Mode 的引用網址只有約
   **14%** 與 AI Overviews 重疊 —— 排得好不等於被引用。RAG 是**段落級**檢索，
   決定被不被引用的是**那一段**能不能自己站得住，不是整頁。
3. **llms.txt 這條路是空的。** Google 公開說不支援、也沒有計畫支援；
   Ahrefs 掃 13.7 萬個網域，**97% 的 llms.txt 在 2026-05 整個月零次請求**。
   所以它在這張表裡**只佔 1 分**，而且是掛在「有沒有明確的 AI 爬蟲政策」底下，
   不是獨立項目。**不要為了它去改架構。**

因此配分是：**技術 20 ＋ 內容/E-E-A-T 22 ＋ 結構與可擷取性 20 ＋ 結構化資料 18
＋ 在地 12 ＋ 效能 8**。GEO 專屬的東西集中在 C 那一組（20 分），
其餘 80 分仍然是「SEO 做對」——這正是 2026 年的實況。

> ⚠ 這張表是**給這一站用的**：一間在地牙醫診所的衛教部落格，YMYL，
> 單一語言、單一地點。拿去評電商或多國站會失準（沒有 Product、沒有 hreflang、
> 沒有分頁與面向式導覽這些項目）。

---

## 一、A　技術基礎與可檢索性（20 分）

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| A1 | robots meta 指令 | 4 | 每一頁都有 `index, follow` ＋ **`max-snippet:-1`** ＋ `max-image-preview:large`。⚠ `max-snippet` 與 `nosnippet` **同時作用在 AI Overviews 與 AI Mode 上** —— 限制它等於同時退出 AI 回答與一般摘要 |
| A2 | canonical 與網址正規化 | 3 | 絕對路徑、自我指涉、每頁唯一；www 與 http 都收斂到同一個 |
| A3 | sitemap | 3 | 涵蓋全部可索引頁、**`lastmod` 誠實**（內容沒動就不要動它）、不列 noindex 的頁 |
| A4 | 架構與無 JS 依賴 | 4 | 列表與內文是靜態 HTML；一頁一個獨立網址；關掉 JS 內容還在 |
| A5 | **AI 爬蟲政策** | 3 | robots.txt 對「訓練型」與「檢索型」爬蟲有**明確而且分開**的立場。2026 的共識是**擋訓練、放檢索**：放 `OAI-SearchBot`／`ChatGPT-User`／`Claude-SearchBot`／`Claude-User`／`PerplexityBot`，訓練型（`GPTBot`／`ClaudeBot`／`Google-Extended`）自己決定。**擋錯檢索型 ＝ 從那個 AI 的回答裡整個消失。**（llms.txt 至多在這裡加 1 分，見第〇節） |
| A6 | 404／轉址／HTTPS | 3 | 404 回真的 404 ＋ noindex；全站 HTTPS；沒有轉址鏈 |

## 二、B　內容品質與 E-E-A-T（22 分）　← YMYL 加權

牙醫站是 Google 明列的 YMYL，這一組的標準比一般網站高。

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| B1 | 原創、非商品化內容 | 5 | Google 那份指南從頭到尾只講這一件：**unique, non-commodity**。自己的臨床經驗、自己的照片、別處抄不到的判斷 |
| B2 | 醫療免責與範圍聲明 | 3 | 每一篇都寫明「衛教資訊不能取代臨床診斷」 |
| B3 | 作者／審閱／機構身分 | 4 | 誰寫的、誰負責、憑什麼。名醫師、部定專科、可查證的資格；理想是**一位醫師一頁** |
| B4 | **外部權威引用** | 4 | 內文引到 PubMed／學會指引／健保署／衛福部並附連結。這是 2026 被引用率差距最大的單一變因之一，也是 YMYL 的信任證據 |
| B5 | 新鮮度與更新機制 | 3 | `dateModified` 誠實、看得見的更新時間、有機制而不是靠人記得 |
| B6 | 內容深度 | 3 | 一個主題問到底，沒有薄頁、沒有為了湊頁數而生的頁 |

## 三、C　頁面結構與 AI 可擷取性（20 分）　← GEO 的本體

RAG 檢索的是**段落**不是文件。這一組全部在問同一件事：
**把任何一段單獨抓出來，它還說得通嗎？**

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| C1 | H1 唯一・階層正確 | 3 | 一頁一個 h1，**而且排在第一個 h2 前面**；h1 → h2 → h3 不跳階 |
| C2 | 標題帶實體 | 4 | h2／h3 講得出具體的病名、術式、器材。「那條關鍵的分界線」抓出來沒人知道在講什麼；「牙齦炎與牙周炎的分界」抓出來就是一段答案 |
| C3 | answer-first 段長 | 4 | 每個 h2 底下**第一段就直接回答**，長度落在 40～120 字（中文）。太短沒有脈絡，太長會被截斷 |
| C4 | Q&A／重點整理 | 3 | 有一塊「問句 → 直答」的結構（`<dl>` 最好）。⚠ **不要加 `FAQPage` 標記** —— Google 2026-05-07 起已停止顯示，8 月連 API 資料都移除了 |
| C5 | 表格與清單 | 3 | 會比較的東西用 `<table>`、有順序的用 `<ol>`。2025 年一份一萬筆 AI 引用的分析：**有表格的頁被引用 4.2 倍** |
| C6 | 語意 HTML | 3 | `main`／`article`／`figure`／`dl`／`aria-label`；段落自足，不靠上一段的代名詞 |

## 四、D　結構化資料與實體（18 分）

2026 唯一比去年更重要的技術項目：LLM 對結構化資料的依賴**高於**傳統搜尋。

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| D1 | LocalBusiness／Dentist | 5 | NAP、`geo`、`openingHoursSpecification`、`sameAs`、`areaServed`、`logo`、`knowsAbout` 齊全且與畫面一致 |
| D2 | 頁面／文章 schema | 4 | `BlogPosting`（含 `datePublished`／`dateModified`／`about`／`image` 含長寬）、`WebPage`／`MedicalWebPage`、`WebSite`，用 `@id` 串成一張圖不重抄 |
| D3 | BreadcrumbList | 3 | 層級**指到真的存在的那一頁**，而且與畫面上看得到的麵包屑一致 |
| D4 | Person／Physician | 3 | 醫師節點有 `medicalSpecialty`、`hasCredential`（含 `recognizedBy`）、`worksFor`；理想是有 `url` 指向自己的頁 |
| D5 | **不加會扣分的標記** | 3 | 沒有 `FAQPage`（已停用）、沒有 `HowTo`（2023 下架）、**沒有自評的 `Review`／`AggregateRating`**（明文禁止，會拖累整站）。也不宣告做不到的 `SearchAction`、不宣告沒人做的 `lastReviewed` |

## 五、E　在地 SEO（12 分）

2026 在地排名訊號大致是：商家檔案 32%、網站頁面 19%、評論 16%、連結 15%、行為 8%。
**網站只佔其中一段** —— 這一組評的是「網站這一側有沒有把該做的做完」。

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| E1 | NAP 全站一致 | 3 | 名稱、地址、電話在畫面、`<data value>`、JSON-LD、`tel:` 四處同源；**而且與站外（商家檔案、LINE、門口）一致** |
| E2 | 地名與服務區域 | 3 | 標題／描述／內文與 `areaServed` 講得出在哪、服務誰。⚠ 不是每頁塞地名 |
| E3 | 商家檔案一致性 | 3 | `sameAs` 指到商家檔案；營業時間、科別、屬性與網站對得上 |
| E4 | 在地實證內容 | 3 | 停車、交通、地圖、周邊 —— 只有真的在那裡的人寫得出來的東西 |

## 六、F　體驗與效能（8 分）

門檻沒變（LCP < 2.5s、INP < 200ms、CLS < 0.1），仍是排名訊號，但**是同分時的決勝局**，
不是主力。所以只給 8 分。

| 代號 | 項目 | 配分 | 滿分的樣子 |
| --- | --- | --- | --- |
| F1 | LCP 相關 | 3 | 首屏圖有 `fetchpriority="high"`（或 `preload`）、WebP、responsive `srcset` |
| F2 | CLS 防護 | 2 | 每張圖有 `width`／`height`；不載外部字型或有 `font-display` |
| F3 | 頁面重量 | 3 | 上線版 HTML ≤ 60KB 滿分、≤100KB 2 分、≤200KB 1 分、其上 0 分 |

---

## 七、分數怎麼讀

| 分數 | 意思 |
| --- | --- |
| 90–100 | 同業裡的天花板，剩下的是內容與外部訊號的長期工 |
| 75–89 | **底子乾淨，扣分集中在少數幾條可修的項目** |
| 60–74 | 有結構性問題（薄頁、重複、架構斷點），要動到產生器 |
| < 60 | 技術面有硬傷，先修技術再談內容 |

## 八、這張表刻意**不評**的東西

- **排名與流量。** 容器連不到 Search Console，而且 Google 的索引本來就落後好幾天到幾週
  （CLAUDE.md 第七節）。這張表評的是「站上這一側做對了沒有」。
- **外部連結與評論。** 那是站外的事，佔在地訊號的 31%，但不是網站能改的。
- **內容的醫療正確性。** 要醫師看，不是腳本能量的。

## 九、來源

- Google Search Central，〈Optimizing your website for generative AI features on Google Search〉（2026-05-15）與 AI features／robots meta tag 文件
- Google Search Central Blog，〈A new resource for optimizing for generative AI〉（2026-05）
- Ahrefs 的 llms.txt 伺服器日誌研究（13.7 萬網域，2026-05）
- Cloudflare 網路的 robots.txt 調查（2026-09）：擋訓練、放檢索已成主流
- 2025 年一萬筆 AI 引用分析（表格頁被引用 4.2 倍）、2026 段落檢索與 chunking 的實務整理
- Google 對 FAQPage（2026-05-07 停止顯示）、HowTo（2023-09 下架）、self-serving Review 的政策
