# 著陸頁的線稿底圖・提示詞與交接（`lineart-<spec>`）

**狀態（2026-08-23）：一般牙科已上線，其餘六科待做。**
這一份現在是**可以重複使用的模板**，不是那一輪的紀錄 ——
一般牙科整輪的推導在 **`/history/topic-lineart.html`**，通則在
**ILLUSTRATION.md 第十二節**，定案的規格在 **CLAUDE.md 定案表「著陸頁的線稿底圖」那一列**。

| | |
| --- | --- |
| 已完成 | `general`（`assets/lineart-general.png` 832×788，2026-08-23 上線）、`perio`（`assets/lineart-perio.png` 1024×755，2026-08-24 上線，[`drafts/lineart-perio-prompt.md`](lineart-perio-prompt.md)） |
| 進行中 | `endo` 顯微根管 —— **分享圖已上線，線稿的提示詞與參考圖已備妥**：[`drafts/lineart-endo-prompt.md`](lineart-endo-prompt.md)，等出圖 |
| 待做 | `kids` 兒牙／`prosth` 植牙・假牙重建／`surg` 口腔外科／`ortho` 齒顎矯正 |
| 產生器 | `tools/topic-lineart.mjs`（永久） |
| 門檻量測 | `drafts/lineart-measure.mjs` |
| 風格參考圖 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png`（已裁掉 app 介面，進版控） |

---

## ⚠⚠ 開工前先確認順序：**分享圖在前，線稿在後**

每一科其實有**兩張不同的圖**，不要搞混：

| | 分享圖 | 線稿底圖 |
| --- | --- | --- |
| 檔案 | `assets/og-topic-<spec>.jpg` 1200×628 | `assets/lineart-<spec>.png` |
| 風格 | 彩色插畫 | 單色線稿、透明底 |
| 出現在哪 | **只在訊息卡上**（`og:image`，頁面上看不到） | **只在頁面上**（介紹區右下角的底） |
| 規格 | ILLUSTRATION.md 第十一節 | ILLUSTRATION.md 第十二節（＋這一份） |

**⚠⚠ 2026-08-24 的現況**：分享圖有 `general`／`perio`／`endo` 三張，線稿有
`general`／`perio` 兩張；**兒牙／植牙／口外／矯正四科兩張都沒有**
（`og:image` 退回 `assets/og-home.jpg`）。
**先做分享圖，再做線稿** —— 理由是下面那個「姿勢參考圖」：
一般牙科那一輪是從**已經畫好的分享圖**裡裁一段當姿勢參考的
（`drafts/lineart-pose-ref.png`），有它才一次就中；沒有它就得用文字描述動作，
而**文字描述動作一定會漂**（下面那張表就是證據）。

---

## 風格規格 —— 從使用者那五張參考圖量出來的（**這一段每一科都一樣，不要改**）

| | ENGWE | AI峰哥・對話 | 要求 |
| --- | --- | --- | --- |
| 線佔畫面 | 4.0% | 6.2% | **4~6%** |
| 筆畫寬（中位） | 畫面寬的 **5.3‰** | **4.4‰** | **4~6‰**（1200 寬 → 5~7px） |
| 底色 | rgb(248,248,248) | rgb(248,248,248) | **接近純白** |

**換句話說**：一張 1200px 寬的圖，筆畫是 **5~7px 的均勻線**，整張只有 4~6% 的面積有墨。

### 五張參考圖共同的特徵（使用者自己指出的那一條擺第一）

1. ⚠⚠ **線沒有濃淡。** 每一條線同一個顏色、同一個粗細，沒有壓感、沒有素描感。
2. **只有輪廓，沒有材質。** 沒有排線、沒有網點、沒有陰影、沒有漸層。
3. **沒有投影。** 人物底下不畫影子。
4. **留白很大方。**
5. **五官極簡。** 眼睛是小圓點或短弧，嘴是一條短線，鼻子一小筆或不畫。
6. **背景幾乎沒有。** 頂多一兩件必要的道具。

⚠⚠ **參考圖裡的第 3、4、5 張有實心黑的頭髮，我們這張不要。**
量出來它們的「粗細一致」是 13.6／9.3／19.3，純線稿那張只有 1.2 —— 超出來的全是那幾團填色。
底圖要**降透明度**壓在頁面上，一團實心色塊會變成一塊礙眼的色斑。
**畫法上最接近我們要的是第 1 張**（走路看手機那個男生）。

---

## ⚠⚠ 為什麼不能「從既有插畫抽線稿」（記著，不要再試）

前面兩輪走過這條路，兩版都被退回，而且**成因是方法本身，不是參數沒調好**：

| | 抽線稿 | 參考圖 |
| --- | --- | --- |
| 筆畫怎麼來的 | 從**有陰影、有材質**的插畫上「撿邊」 | 一開始就是**畫出來的**均勻筆畫 |
| 粗細 | 跟著原圖明暗走，同一條線忽粗忽細 | 從頭到尾同一個寬度 |
| 雜訊 | 牆面材質、衣服皺褶、頭髮都會變成線 | 只有輪廓 |

第二版已經做到「平塗 ＋ 放大四倍 ＋ 侵蝕收細」，濃度統一了，
但**粗細的不規則與材質雜訊留在原檔裡，不是後製拿得掉的**。

⚠ 通則：**要一個「畫出來的」風格，就得畫，不能從別的畫上撿。**
抽線的程式碼留在 `tools/topic-lineart.mjs` 的 `--region` 分支，是紀錄，不是還在用。

---

## 要附哪幾張圖（七張，三組，**每一組的說明一定要分開寫**）

⚠⚠ 一般牙科第一版**只附了畫法與長相兩組、沒附姿勢**，
結果姿勢、視線、髮型、表情四件全跑掉，而且**其中三件是提示詞自己寫出來的**：

| 錯的 | 原本寫的那一句 | 為什麼會變那樣 |
| --- | --- | --- |
| 兩人彼此互看 | `turned slightly towards the dentist` | 我叫她轉向他 |
| 「很像選舉看板」 | `a relaxed, everyday wave` | **形容詞擋不住正面對稱的平掌**。要寫**幾何**：手抬到下巴高、手肘收在身側、掌心斜的、手指鬆 |
| 髮型不對 | `Hair is drawn as an OUTLINE ONLY` | 只講了畫法，**沒講是什麼髮型** |
| 表情不對 | （沒寫） | 沒講「嘴巴張開正在講話」 |

| # | 檔案 | 這一張只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「**只參考線條畫法**（均勻粗細、無濃淡、無陰影、無材質、大量留白）；**不要參考題材、人物、道具**。」 |
| 6 | 那一科的**姿勢參考**（從該科分享圖裁一段，做法見下） | **姿勢・視線・髮型・表情** | 「**姿勢、視線方向、髮型、表情、手的高度與角度，完全照這張**；但畫法照 1~5，而且**畫到腰就好，不要畫腿**。」 |
| 7 | `assets/og-topic-<spec>.jpg` | **長相・服裝・年齡層** | 「人物長相、服裝、年齡層照這張，但**畫法完全不同** —— 那張是上色插畫。」 |

**姿勢參考怎麼做**：在該科的分享圖原檔上挑一段（人物 ＋ **含腿**，
腿留著是因為「走著／站著」這件事是靠下半身讀出來的），放大三倍存成 PNG。
一般牙科那次是 `x958 y336 258×330 → ×3 → 774×990`。

---

## 提示詞（模板；**只有 WHO 與 COMPOSITION 要換，其餘逐字照用**）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair and clothing.

WHO — ⚠ 這一段每一科要重寫。照抄一般牙科那一版的寫法（見下面那個範例），
規則有三條：
  ・先寫一句「Follow the attached photo-reference for pose, gaze, hair and expression
    EXACTLY; only the drawing style comes from the line-art references.」
  ・動作寫成**幾何**（角度、高度、朝向），不要寫形容詞。
  ・髮型、表情、視線方向**逐項寫出來**，不要以為參考圖會自己傳達。

⚠ 兩條 CRITICAL 每一科都要留（改成該科的情境）：
  ・視線方向：說清楚兩個人是不是看同一個方向、有沒有看鏡頭。
  ・把最容易畫錯的那個姿勢**明講不要**（一般牙科那次是「NOT A CAMPAIGN-POSTER WAVE」）。

FACES — extremely simple: eyes are small solid dots or short curved strokes, the nose is
one tiny stroke or omitted. No eyebrow detail, no eyelashes, no blush, no wrinkles.
⚠ 嘴巴的形狀要寫（張開講話／閉著微笑），不要留空。
Hair is drawn as an OUTLINE ONLY with a few interior strokes for the parting — it must
not be filled in. ⚠ 髮型本身要寫（低馬尾／短髮／…）。

COMPOSITION — the figures together occupy the middle of the square and about 70% of its
height. Generous empty margin on all four sides. They are cropped at the waist by a clean
horizontal edge at the bottom of their bodies — no legs, no belt line detail.

BACKGROUND — completely empty. No room, no doorway, no window, no wall, no floor, no
furniture, no plants, no street, no clinic sign, no speech bubbles, no icons, no arrows,
no text, no logo, no decorative sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: <該科的套色 hex>, on a near-white background,
hex #f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

### 各科的套色（PALETTE.md，和 `tools/topic-lineart.mjs` 的 `ACCENT` 同一組）

`general #3f654a`　`perio #317d78`　`kids #c28229`　`endo #ae4f4d`
`prosth #335b8b`　`surg #8e6299`　`ortho #4478b5`

⚠ 提示詞裡雖然指定了 hex，模型不保證給得準，所以 `topic-lineart.mjs` **一律重新上色**。
⚠ **給了 hex 就不要在旁邊再寫色名**（ILLUSTRATION.md 第十之二節）。

### WHO 那一段的範例（一般牙科定案的那一版，照這個結構寫）

```
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
the viewer.

⚠ CRITICAL — NOT A CAMPAIGN-POSTER WAVE. Do not draw a frontal, symmetrical figure with a
straight arm and an open flat palm held up beside the head. That is a politician's salute
and it is wrong. The wave is small, low, angled and off-hand.
```

### 這一科要畫什麼？

⚠⚠ **畫的是「病患的處境」或「這間診所的人平常的樣子」，不是牙齒解剖圖、不是器械示意圖。**
題材要對上那一科著陸頁**開場那一幕**：文案在 `tools/topic-copy.mjs`，
七科的節奏對照表在 **COPY.md 第九之十五節**。
⚠ 人物設定要接得上站上既有的插畫（ILLUSTRATION.md 第三節）：**白袍的醫師 ＋ 綠色刷手服的助理**，
台灣人，日常、不擺拍。

---

## 交件前要過的門檻

    node drafts/lineart-measure.mjs <圖檔>

| | 門檻 | ⚠ |
| --- | --- | --- |
| 線佔畫面 | **4~6%**（未裁的整張） | 裁掉四周空白之後會佔到兩倍以上，那不是變糟 |
| 筆畫寬中位 | 畫面寬的 **4~6‰** | **不能只掃橫向** —— 一條水平線在橫向會量成整條線那麼長。要取橫縱**較小值** |
| 粗細一致 | p90 ÷ 中位 **< 2.5** | 一般牙科定案那張是 1.43 |
| 有沒有實心填色 | **0 塊** | **不能只看面積** —— 一整個人的輪廓也是一大塊連通區域，但它是空心的。要看**填滿自己外接矩形多少**（> 0.5 才算） |
| 明顯的灰階 | 越少越好 | JPEG 的抗鋸齒會佔掉二三十階，正常 |
| 背景乾淨 | 四角各 10% 的方塊裡**沒有墨** | |

⚠ **內容這一側要逐條看圖**，門檻過了不代表對（一般牙科第一版就是門檻全過、內容四件全錯）：
視線方向、動作的角度與高度、髮型、表情。

---

## 出圖之後怎麼接（管線）

**1. 轉成透明底、上該科的套色，順便裁掉地面線與空白**

```
node tools/topic-lineart.mjs <spec> --art drafts/lineart-<spec>-v1.jpg \
  --crop x,y,w,h
```

⚠⚠ **生成的線稿幾乎一定會多畫一條「地面線」**，還會留一大圈空白。
那條橫線擺到頁面上會變成一條莫名其妙的橫槓。裁完圖檔就等於內容本身，
頁面那一側只要管大小與位置。裁切座標自己量（一般牙科那次是 `97,123,832,788`）。

⚠ `--art` 只做一件事：**把底色變透明、把線統一成該科的套色**，
不做局部平均、不做侵蝕 —— 來源已經是平的，再處理只會把它弄壞。
⚠ **不要餵透明底的 PNG 進來**（有一道守門會擋）。

**2. 把該科加進 `index.html` 那三條選擇器**

`index.html` 搜尋 `3-0 介紹區右下角的線稿底圖`，把 `[data-topic="<spec>"]` 加進去：

```css
[data-topic="general"] .tp-intro,
[data-topic="perio"]   .tp-intro { position: relative; }
```

⚠⚠ **不要改成 `[data-topic]` 一網打盡** —— 沒有圖的科目會畫出一個空的偽元素。

⚠⚠ **大小與濃度不要憑感覺挑，但也不要互抄** —— 已經有兩組值，是使用者各自逐格挑的：

| | 一般牙科 | 牙周 |
| --- | --- | --- |
| 分段 | `@media (min-width: 834px)` | **721px**（他是在 iPad mini 直放 744 上定的） |
| 大小 | `min(76%, 360px)` | 手機 `min(81.25%, 390px)`／≥721 `min(100%, 480px)` |
| 濃度 | `.10`／`.48` | `.115`／`.15` |

⚠ **臨界濃度跟著該科的套色走**（愈淺愈寬鬆）：一般牙科 `#3f654a` 是 **.101**、
牙周 `#317d78` 是 **.115** —— 卡住的是柔墨 `--ink-soft` 的次要文字，不是主文。
新的一科**先量一次臨界濃度再給值**。理由與量法寫在 `index.html` 那段註解、
`/history/topic-lineart.html` 與 `/history/topic-lineart-perio.html` 裡。
⚠ **大小是免費的、濃度不是**：圖變大不改變對比度（最壞底色只看濃度），
所以「想更明顯」先走大小那一條。
⚠ `aspect-ratio` 要換成那一科圖檔自己的長寬。

**3. 重跑產生器與 build**

```
node tools/topics.mjs && node tools/build.mjs
```

⚠⚠ `tools/topics.mjs` 會把 CSS 裡的 `url("assets/…")` 換成 `../../assets/` ——
**不要改用根目錄絕對路徑 `/assets/…`**，舊站 `yclee86.github.io` 還活著，那邊會壞。

**4. 驗收（一定要做）**

・九個寬度（1440／1280／1200／1041／834／430／390／375／320）
　**介紹區高度和加圖之前逐格相同**、無水平捲動。
・其餘沒有圖的科目與首頁**沒有畫出那個偽元素**。
