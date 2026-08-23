# 口腔外科約診規則 —— 輸出 PDF 的腳本（暫存，不進 _site）

提案頁：`preview/surg-appointment/`
（`?ver=slip|post`、`?bg=paper|white`、`?ink=spec|mono`、`?qr=on|off`）

```bash
node drafts/surg-appt/pdf.cjs      # 輸出三份 PDF（約診單／公告／黑白）
```

## ⚠ 字型：容器裡沒有 Noto Sans TC

這個容器只有 WQY 正黑，直接產 PDF 會**用它渲染**，和診所電腦（微軟正黑）
或 Mac（PingFang）印出來的**折行位置不一樣** —— 而這一頁的鬆緊是按 mm 量的。
要用站上第一順位的字型渲染，先抓字型再產：

```bash
mkdir -p ~/.fonts
curl -sS -o ~/.fonts/NotoSansTC-Regular.ttf "$(curl -sS -A 'Mozilla/5.0' \
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400' | grep -o 'https://[^)]*')"
fc-cache -f
```

（字型**不進版控** —— repo 的規矩是零依賴，`tools/fonts/` 那兩份是 og 卡專用的子集。）

## 版面的鬆緊只有一個旋鈕

`preview/surg-appointment/index.html` 裡的 `--u`：所有字級與間距都寫成
`calc(k * var(--u))`。實測（Noto Sans TC、A4 直）：

| 版本 | `--u` | 內文字級 | 內容與頁尾之間 |
| --- | --- | --- | --- |
| 公告 | `1.06cqw` | 4.53mm（12.8pt） | 12.0mm |
| 約診單 | `0.85cqw` | 3.63mm（10.3pt） | 9.1mm |

⚠ 公告版 `1.10` 只剩 1.8mm、約診單 `0.88` 只剩 1.6mm —— **換一套字型多折一行就會撞上頁尾**，
所以兩版都刻意留了約一行半。要調鬆緊改那一個數字，**不要逐條改字級**。

## QR 要真的掃過，不能用眼睛驗

QR 是 `tools/qr.mjs` 產的（等級 M，靜區四邊各 4 格做在 viewBox 裡），
網址逐字取自 `clinic.json` 的 `sameAs`：`https://line.me/R/ti/p/@445rpiiv`。
**不要改成 `@fafa070`**（CLAUDE.md 第十節）。驗收：

```bash
pip install opencv-python-headless      # 只給驗證用，不是專案依賴
python3 -c "import cv2;print(cv2.QRCodeDetector().detectAndDecodeMulti(cv2.imread('sheet-slip.png'))[1])"
```

2026-08-23 驗過：彩色版與黑白版在 192dpi 的擷圖上都解得出正確網址。
