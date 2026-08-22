# 著陸頁的線稿底圖・提示詞（`lineart-general`）

**狀態：待出圖（2026-08-22 立）。** 這是**改用生成**的第一版 ——
前面兩輪走的是「從既有插畫抽線稿」，使用者看過之後：
**「我覺得這不是我要的，跟我找的範例還是差很多。你們做成圖片提示詞好了。」**

用途：一般牙科著陸頁 `/topics/general/` 介紹區塊右邊那塊空白的**底圖**。
規格與位置的推導在 `/history/topic-lineart.html`（定案後），
版面量測見 `tools/lineart-preview.mjs` 的檔頭。

---

## ⚠⚠ 為什麼「抽線稿」這條路必須放棄（記著，不要再試）

我做了兩版，兩版都不對，而且**成因是方法本身，不是參數沒調好**：

| | 抽線稿 | 使用者的參考圖 |
| --- | --- | --- |
| 筆畫怎麼來的 | 從**有陰影、有材質**的插畫上「撿邊」 | 一開始就是**畫出來的**均勻筆畫 |
| 粗細 | 跟著原圖的明暗走，同一條線會忽粗忽細 | 從頭到尾同一個寬度 |
| 雜訊 | 牆面材質、衣服皺褶、頭髮都會變成線 | 只有輪廓，沒有材質 |
| 曲線 | 二值化後帶鋸齒（原檔是 JPEG） | 平滑 |

第二版已經做到「平塗 ＋ 放大四倍 ＋ 侵蝕收細」，線的**濃度**確實統一了，
但**粗細的不規則與材質雜訊留在原檔裡，不是後製拿得掉的**。
⚠ 通則：**要一個「畫出來的」風格，就得畫，不能從別的畫上撿。**
（同 ILLUSTRATION.md 第十之一節那條的反面：形狀要用參考圖，
但**風格不能靠後製湊**。）

---

## 這一張要講的事

使用者原本指定的那一段（從既有插畫上挑的）：
**「右邊兩個醫事人員輕鬆自然和其他人打招呼的樣子，應該節錄他們的半身就好」**。
現在改成生成，主題不變 —— 對上那一頁在講的事（COPY.md 第九之十四節）：
**這一頁回答的是「為什麼是這一間」**，所以畫的是**這間診所的人平常的樣子**，
不是療程、不是器械、不是牙齒。

⚠ 人物設定要接得上站上既有的插畫（ILLUSTRATION.md 第三節）：
**白袍的醫師 ＋ 綠色刷手服的助理**，台灣人，日常、不擺拍。

---

## 風格規格 —— 從使用者那五張參考圖**量出來的**

量法：Chromium canvas 讀像素（同 ILLUSTRATION.md 第十之四節）。
腳本在暫存區，數字如下（取插畫區、不含 app 介面）：

| | ENGWE | AI峰哥・對話 | 定案要求 |
| --- | --- | --- | --- |
| 線佔畫面 | 4.0% | 6.2% | **4~6%** |
| 筆畫寬（中位） | 畫面寬的 **5.3‰** | **4.4‰** | **4~6‰**（1200 寬 → 5~7px） |
| 底色 | rgb(248,248,248) | rgb(248,248,248) | **接近純白** |

**換句話說**：一張 1200px 寬的圖，筆畫是 **5~7px 的均勻線**，整張**只有 4~6% 的面積有墨**。
⚠ 這兩個數字是交件門檻，出圖後要量（腳本照 `drafts/og-measure-ink.mjs` 改）。

### 五張參考圖共同的特徵（使用者自己指出的那一條擺第一）

1. ⚠⚠ **線沒有濃淡。** 每一條線都是同一個顏色、同一個粗細，
   沒有粗細變化、沒有壓感、沒有素描感。
2. **只有輪廓，沒有材質。** 沒有排線、沒有網點、沒有陰影、沒有漸層。
3. **沒有投影。** 人物底下不畫影子。
4. **留白很大方。** 人物之間、人物與邊界之間都留得很空。
5. **五官極簡。** 眼睛是小圓點或短弧，嘴是一條短線，鼻子一小筆或不畫。
6. **背景幾乎沒有。** 頂多一兩件必要的道具，沒有房間、沒有街景。

---

## 提示詞（逐字，可直接複製）

> ⚠ **一定要把使用者那五張參考圖一起附上**，並註明：
> 「**只參考這幾張的線條畫法**（均勻粗細、無濃淡、無陰影、無材質、大量留白）；
> 　**不要參考它們的題材、人物、道具**。」
> ⚠ 另外附 `assets/og-topic-general.jpg`（或 `drafts/og-topic-general-src.jpg`），註明：
> 「**人物長相、服裝、年齡層照這張**，但**畫法完全不同** —— 那張是上色插畫，
> 　這一張要的是上面那五張的線稿畫法。」

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair and clothing.

WHO — two clinic staff of a small Taiwanese neighbourhood dental clinic, standing side by
side, seen from the WAIST UP:
  - LEFT: a dentist in an open white coat over a plain V-neck top, one hand raised in a
    relaxed, everyday wave — a greeting to someone passing by, not a posed salute.
  - RIGHT: a dental assistant in plain short-sleeved scrubs, holding a drink cup in one
    hand, turned slightly towards the dentist, mid-conversation, smiling.
Both are ordinary Taiwanese adults in their thirties, relaxed and natural, mid-motion.
They are talking to someone OFF-FRAME to the left; neither looks at the viewer.

FACES — extremely simple: eyes are small solid dots or short curved strokes, the mouth is
one short line, the nose is one tiny stroke or omitted. No eyebrows detail, no eyelashes,
no blush, no wrinkles. Hair is drawn as an OUTLINE ONLY with a few interior strokes for
the parting — it must not be filled in.

COMPOSITION — the two figures together occupy the middle of the square and about 70% of
its height. Generous empty margin on all four sides. They are cropped at the waist by a
clean horizontal edge at the bottom of their bodies — no legs, no belt line detail.

BACKGROUND — completely empty. No room, no doorway, no window, no wall, no floor, no
furniture, no plants, no street, no clinic sign, no speech bubbles, no icons, no arrows,
no text, no logo, no decorative sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: a dark desaturated green, hex #3f654a, on a
near-white background, hex #f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

### ⚠ 兩個給模型的擋門（照 ILLUSTRATION.md 第十之二節的教訓寫）

- **給了 hex 就不要在旁邊再寫色名** —— 上面只寫 `#3f654a`，沒有寫 "forest green"。
- **「簡單」不等於「空」的反面也要擋**：這裡是真的要空背景，所以
  背景那一段是**逐項列出不要什麼**，不是只寫 "simple background"
  （第十一之一節第 3 條：「背景簡單」不等於「畫面空」—— 那一次是反過來吃虧，
  這一次是刻意要空，所以要寫死）。

---

## 交件前要過的門檻（出圖後自己量，不過就重生）

| | 門檻 | 怎麼量 |
| --- | --- | --- |
| 線佔畫面 | **4~6%** | 亮度 < 128 的像素比例 |
| 筆畫寬中位 | **畫面寬的 4~6‰** | 每一列連續暗像素的長度取中位 |
| 粗細一致 | 90 百分位 ÷ 中位 **< 2.5** | 同上（參考圖是 2.0~3.6，含交叉處） |
| 明顯的灰階 | **越少越好** | 亮度直方圖裡佔比 > 0.05% 的階數 |
| 有沒有實心填色 | **0 塊** | 連通的暗區域面積 > 畫面 0.5% 就是填色 |
| 背景乾淨 | 四角各 10% 的方塊裡**沒有墨** | 直接取那四塊算 |

---

## 出圖之後怎麼接（管線）

生成的是**近白底、深綠線**的 PNG／JPEG。上到頁面之前要轉成**透明底**的 PNG：

    node tools/topic-lineart.mjs general --art drafts/lineart-general-src.png

⚠ `--art` 是**給「本來就是線稿」的圖用的**，和原本那條「從插畫抽線」的路徑不同：
它只做一件事 —— **把底色變透明、把線統一成該科的套色**，不做局部平均、不做侵蝕。
因為來源已經是平的，**再處理只會把它弄壞**。

⚠ 顏色仍然回 PALETTE.md 拿（`general` 是套色 `#3f654a`）。
提示詞裡雖然已經指定了同一個 hex，但模型不保證給得準，所以**一律重新上色**。

⚠ 濃淡（頁面上的 opacity）**不在圖裡做** —— 那是使用者要自己選的那一格
（提案頁的「濃度」那條尺）。
