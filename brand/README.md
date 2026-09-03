# 診所標誌的原始檔（Illustrator）

使用者 2026-09-03 上傳的**診所標誌 Illustrator 原件**，放進版控是為了
**任何一個 Claude Code session（電腦、手機、雲端）都拿得到**。

| 檔案 | 是什麼 |
| --- | --- |
| `fangren-logo-2024-12-05.ai` | **原件，逐位元組沒有動過**。Adobe Illustrator 29.1 (Macintosh)，PDF-1.6 相容，A3 橫式三個工作區域，2024-12-05 存檔 |
| `artboard-1-wordmark.svg` / `.png` | 工作區域 1：中文標準字（單線風格）「芳仁牙醫」與「芳仁牙醫診所」 |
| `artboard-2-latin.svg` / `.png` | 工作區域 2：英文標準字 `FANG REN DENTAL CLINIC`（粗、細兩款） |
| `artboard-3-lockups.svg` / `.png` | 工作區域 3：**三組組合標**（九宮格牙齒／直式中英＋標誌／實心牙齒＋英中） |

**要看它長什麼樣就開那三張 `.png`** —— 用 Read 工具直接看得到，不必裝任何東西。

## 為什麼旁邊要放 SVG 和 PNG

容器裡**沒有 Illustrator，也沒有 poppler／mutool／ghostscript／PIL**（都確認過），
所以 `.ai` 進了 repo 之後沒有任何人打得開它。`.ai` 存的是原件，
SVG／PNG 存的是「不必裝東西就能用、也看得到」的那一份。

要重新產生（改過 `.ai` 之後）：

```bash
node tools/ai-extract.mjs brand/fangren-logo-2024-12-05.ai brand
```

那支是零依賴的：自己把 PDF 內容流用 zlib 解開、把 PDF 的路徑算符翻成 SVG，
再用 Chromium 出 PNG。做法與限制寫在它的檔頭。

## ⚠ 這裡的東西**不是**上線用的資產

站上實際在用的仍然是原本那三個檔，**不要改成從這裡引用**：

| 用途 | 檔案 |
| --- | --- |
| 頁首那顆標誌 | `index.html` 裡的 `.brand-mark` 路徑（原廠向量，等比例 0.6454888747） |
| 主畫面圖示的來源 | `assets/icon.svg` → `assets/icon-*.png` |
| 給 Google 的 Organization logo | `assets/logo.png`（由 `tools/logo-png.mjs` 從頁首那條路徑算出來） |

⚠ **這裡的 SVG 一律是黑的**（原件整份是 CMYK 的 `0 0 0 1` ＝ 純黑 K），
`fill`／`stroke` 都寫成 `currentColor`，套色的時候自己給 `color`。
**黑不是品牌色** —— 品牌真值是 `#3f654a`，一律回 [PALETTE.md](../PALETTE.md) 拿。

⚠ `brand/` **不在 `tools/dist.mjs` 的 `ALWAYS`／`OPTIONAL` 裡，所以進不了 `_site/`**，
不會被部署到 fangren.net（1.2MB 的 `.ai` 沒有理由送上線）。
`tools/build.mjs` 也掃不到它（只掃 `posts/*/`）。

## 量出來的三件事（2026-09-03，用真貝茲極值量的）

1. **工作區域 3 中間與右邊那兩組組合標裡的牙齒外框，長寬比就是 `2.02918`** ——
   和 `assets/icon.svg`（2.02918）、`index.html` 頁首那條路徑（2.02926）、
   `tools/logo-png.mjs` 的 `RATIO` 完全對得上。
   **這份 `.ai` 確實就是站上那顆標誌的原廠來源。**

2. **牙洞寬 ÷ 外框寬 ＝ `0.078894`。** 三個檔一起排：

   | | 牙洞寬 ÷ 外框寬 | 相對於原件 |
   | --- | --- | --- |
   | `brand/…ai`（原件） | 0.078894 | ×1.000 |
   | `assets/icon.svg` | 0.093080 | **×1.1799** |
   | `index.html` 頁首 | 0.102514 | ×1.2995 |

3. 所以 **CLAUDE.md 第九節第 19 條那個「還沒查清楚」的疑問，答案是它自己猜的那一個**：
   `icon.svg` 註解寫的「牙洞放大 1.18 倍」**是相對於 AI 原始檔**（實測 ×1.1799），
   不是相對於頁首那顆；頁首那顆本來就又比原件大一階（×1.2995）。
   **兩個檔各自都是對的，沒有東西要改。**

## 相關

- 標誌的幾何、顏色與圖示規則：[PALETTE.md](../PALETTE.md) 第六之二十節
- 插畫語彙（和標誌是兩件事）：[ILLUSTRATION.md](../ILLUSTRATION.md)
