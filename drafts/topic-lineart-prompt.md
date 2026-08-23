# 著陸頁的線稿底圖・提示詞（`lineart-general`）

**狀態：第二版待出圖（2026-08-22）。** 這是**改用生成**的路線 ——
前面兩輪走的是「從既有插畫抽線稿」，使用者看過之後：
**「我覺得這不是我要的，跟我找的範例還是差很多。你們做成圖片提示詞好了。」**

## 第一版（`drafts/lineart-general-v1.jpg`）的結果：**風格過了，內容錯了**

使用者：**「風格對了，不過細節跑掉了。右邊女生的髮型和表情、左邊男生的姿勢，
現在變成彼此互看，而且男生這個對前方招手很像選舉看板，
跟原圖輕鬆親切的和別人打招呼不一樣。」**

風格這一側**每一格都過**（`node drafts/lineart-measure.mjs drafts/lineart-general-v1.jpg`）：

| | v1 | 門檻 |
| --- | --- | --- |
| 線佔畫面 | 6.4% | 4~6%（略高） |
| 筆畫寬中位 | 6.8‰ | 4~6‰（略粗） |
| **粗細一致（p90 ÷ 中位）** | **1.43** | < 2.5 ✅ |
| 實心填色 | 0 塊（最高填滿率 .13） | 0 ✅ |
| 四角 | 0／0／0／0 | 沒有墨 ✅ |

⚠⚠ **四件錯的裡面有三件是我自己的提示詞寫出來的**，不是模型亂畫 ——
下一版的修法就是把這三句改掉：

| 使用者說的 | 我原本寫的那一句 | 為什麼會變那樣 |
| --- | --- | --- |
| 「彼此互看」 | `turned slightly towards the dentist, mid-conversation` | 我叫她轉向他。原圖裡**兩個人都看著畫面外的左邊，誰都沒有看誰** |
| 「很像選舉看板」 | `one hand raised in a relaxed, everyday wave` | 「relaxed」是形容詞，擋不住**正面、對稱、五指張開的平掌**。要寫**幾何**：手只抬到肩膀高、手肘收在身側、掌心斜的、手指鬆 |
| 「髮型」 | `Hair is drawn as an OUTLINE ONLY` | 只講了畫法，**沒講是什麼髮型**。原圖是**紮起來的低馬尾**，v1 給了一頭放下來的鮑伯 |
| 「表情」 | （沒寫） | 原圖她**嘴巴是張開的，正在講話**；v1 是閉著嘴微笑 |

⚠ 通則：**動作、髮型、視線方向這種「形狀」，用文字形容一定會漂**
（ILLUSTRATION.md 第十之一節）。第二版一律**附參考圖**：
`drafts/lineart-pose-ref.png`（原圖那兩個人的乾淨裁切，774×990，**含腿**，
腿留著是因為「走著」這件事是靠步伐讀出來的）。

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

## 要附哪幾張圖（七張，三組，每一組講的事不一樣）

⚠⚠ **三組的說明一定要分開寫**。第一版沒有附姿勢參考圖，
結果姿勢、視線、髮型、表情四件全跑掉了。

| # | 檔案 | 這一張要它提供什麼 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1 | `drafts/lineart-ref-1-walking.png` | **畫法** | 只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）。**不要參考題材、人物、道具。** |
| 2 | `drafts/lineart-ref-2-engwe.png` | 同上 | 同上 |
| 3 | `drafts/lineart-ref-3-talking.png` | 同上 | 同上 |
| 4 | `drafts/lineart-ref-4-laptop.png` | 同上 | 同上 |
| 5 | `drafts/lineart-ref-5-bubbles.png` | 同上 | 同上 |
| 6 | **`drafts/lineart-pose-ref.png`** | **姿勢・視線・髮型・表情** | **姿勢、視線方向、髮型、表情、手的高度與角度，完全照這張。**但畫法照 1~5，而且**畫到腰就好，不要畫腿**。 |
| 7 | `assets/og-topic-general.jpg` | **長相・服裝・年齡層** | 人物長相、服裝、年齡層照這張，但**畫法完全不同** —— 那張是上色插畫。 |

五張參考圖是使用者傳的手機截圖，已經裁掉 app 介面存進 `drafts/`
（`node drafts/lineart-refs-crop.mjs` 可以重跑，座標在腳本裡）。

⚠⚠ **第 3、4、5 張有實心黑的頭髮，我們這一張不要。**
量出來它們的「粗細一致」是 13.6／9.3／19.3（第 1 張只有 1.2）——
超出來的全是那幾團填色，不是筆畫真的忽粗忽細。
**我們這張是要當頁面的底、還要降透明度**，一團實心色塊會變成一塊礙眼的綠斑，
所以提示詞裡「頭髮也不准填色」那一句要留著。
**畫法上最接近我們要的是第 1 張**（線佔 3.05%、粗細一致 1.2、完全沒有填色）。

## 提示詞（逐字，可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair and clothing.

WHO — two staff of a small Taiwanese neighbourhood dental clinic, WALKING FORWARD side by
side, seen from the WAIST UP. Follow the attached photo-reference for pose, gaze, hair and
expression EXACTLY; only the drawing style comes from the line-art references.

  - LEFT — a male dentist, mid-thirties, short dark hair, in an OPEN white coat worn over a
    V-neck scrub top. He is mid-stride: his body is in THREE-QUARTER view, one shoulder
    forward, NOT square to the viewer. His near arm is raised in a small, casual wave to
    someone OFF-FRAME beyond the LEFT EDGE of the picture:
      * the elbow stays bent and close to his side;
      * the hand rises only to about the height of his own chin, NOT above his head;
      * the palm is turned outward at an ANGLE, seen partly edge-on, not flat to the viewer;
      * the fingers are relaxed and slightly curved, close together, NOT a stiff spread fan.
    His other hand rests near his coat pocket. He is looking in the direction he is waving —
    forward and off to the LEFT — with a small open-mouthed smile.

  - RIGHT — a female dental assistant, mid-thirties, in a plain short-sleeved V-neck scrub
    top. Her hair is TIED BACK IN A LOW PONYTAIL that falls over one shoulder, with a
    side-parted fringe — it is NOT loose, NOT a bob, NOT shoulder-length hanging hair. She
    holds a lidded iced-drink cup in one hand at chest height. Her MOUTH IS OPEN, a small
    oval — she is in the middle of saying something. She is also facing FORWARD AND TO THE
    LEFT, walking alongside him.

⚠ CRITICAL — THE TWO PEOPLE DO NOT LOOK AT EACH OTHER. Both faces point the same way:
forward and off-frame to the LEFT. Neither turns towards the other, and neither looks at
the viewer. This is two colleagues walking past and greeting someone they know, caught in
passing — NOT a portrait, NOT a posed pair, NOT a conversation between the two of them.

⚠ CRITICAL — NOT A CAMPAIGN-POSTER WAVE. Do not draw a frontal, symmetrical figure with a
straight arm and an open flat palm held up beside the head. That is a politician's salute
and it is wrong. The wave is small, low, angled and off-hand.

FACES — extremely simple: eyes are small solid dots or short curved strokes, the nose is
one tiny stroke or omitted. No eyebrow detail, no eyelashes, no blush, no wrinkles.
The man's mouth is a short open curve (smiling, talking); the woman's mouth is a small
open oval (mid-speech). Hair is drawn as an OUTLINE ONLY with a few interior strokes for
the parting and the ponytail — it must not be filled in.

COMPOSITION — the two figures together occupy the middle of the square and about 70% of
its height, overlapping slightly as walking companions do (he is a little ahead of her).
Generous empty margin on all four sides. They are cropped at the waist by a clean
horizontal edge at the bottom of their bodies — no legs, no belt line detail.
Optionally, two or three short arc strokes beside the raised hand to suggest the movement,
as in the photo-reference. Nothing else.

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

### 風格這一側 —— 跑腳本

    node drafts/lineart-measure.mjs drafts/lineart-general-v2.jpg

| | 門檻 | 怎麼量 |
| --- | --- | --- |
| 線佔畫面 | **4~6%** | 底色與純黑之間 35% 處當門檻，數暗像素比例 |
| 筆畫寬中位 | **畫面寬的 4~6‰** | 每個墨像素取「橫向連續長」與「縱向連續長」**較小的那個**，再取中位 |
| 粗細一致 | 90 百分位 ÷ 中位 **< 2.5** | 同上（v1 是 1.43） |
| 明顯的灰階 | **越少越好** | 亮度直方圖裡佔比 > 0.05% 的階數（JPEG 的抗鋸齒會佔掉二三十階，正常） |
| 有沒有實心填色 | **0 塊** | ⚠ **不能只看面積** —— 一整個人的輪廓也是一大塊連通區域，但它是空心的。要看**填滿自己外接矩形多少**，> 0.5 才算填色（v1 最高 0.13） |
| 背景乾淨 | 四角各 10% 的方塊裡**沒有墨** | 直接取那四塊算 |

⚠ 筆畫寬**不能只掃橫向** —— 一條水平的線在橫向會量成「整條線那麼長」。
取橫縱較小值才是真正的筆畫寬。

### 內容這一側 —— 逐條看圖（v1 就是這四條全錯）

1. **兩個人的臉朝同一個方向（畫面外的左邊），誰都沒有看誰。**
2. **男生的手只抬到下巴高、手肘收在身側、掌心是斜的、手指鬆。**
   正面對稱的平掌 ＝ 選舉看板 ＝ 重生。
3. **女生的頭髮是紮起來的低馬尾**（不是放下來的鮑伯）。
4. **女生的嘴巴是張開的**（正在講話），不是閉著微笑。

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
