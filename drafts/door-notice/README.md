# 門口停車告示 —— 輸出 PDF 的腳本（暫存，不進 _site）

提案頁：`preview/clinic-map-door/`（A4 直、`?orient=w`）

```bash
node tools/door-map-preview.mjs      # 先重新產生提案頁
node drafts/door-notice/pdf2.cjs     # 輸出兩份 PDF（原色底／白底）
```

⚠⚠ **版面的高度是 JS 現算的**（`tools/door-map-script.js` 的 `fit()`），
而 `page.pdf()` 會用 A4 的版面重排一次 —— 只呼叫 `emulateMedia('print')` 的話，
`fit()` 用的還是螢幕那個視窗的盒子，地圖會比紙高、被 `.sh-map` 的
`overflow: hidden` 切掉下緣。做法是：

1. 視窗先調成 **A4 在 96dpi 的像素大小（794×1123）**
2. 再切 `print` 媒體
3. 發一次 `resize` 讓 `fit()` 用正確的盒子重算
4. 然後才 `pdf({ preferCSSPageSize: true })`

⚠ **驗收不能只看檔案有沒有產出來**：用 pymupdf 把 PDF 轉成 300dpi 的點陣，
再用 opencv 的 `detectAndDecodeMulti` 把三顆 QR 真的掃一次。
（兩個套件都是**驗證用**，不是專案依賴：`pip install pymupdf opencv-python-headless`）
