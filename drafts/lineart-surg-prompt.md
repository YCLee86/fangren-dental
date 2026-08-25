# 口腔外科的線稿底圖（`lineart-surg`）—— 提示詞與交接

2026-08-25 開。**分享圖已定案上線**（`assets/og-topic-surg.jpg`，十六輪，
推導在 `og-topic-surg-prompt.md`），所以順序上輪到線稿了
（規矩：**分享圖在前、線稿在後**，因為線稿要從分享圖裁姿勢／長相參考）。

使用者指定的內容：

> 「著陸頁的線稿另外畫，是**插圖中的女醫師（鮑伯頭戴醫師帽）**，
> 　**一手叉腰、一手把比較小台的潛盾扛在肩膀上**，覺得**自信輕鬆露齒燦爛笑**。」

## 這一輪特別要注意的三件

1. ⚠⚠ **這一張沒有現成的姿勢參考。** 前四科的姿勢都是從該科分享圖裁一段
   （模板第 6 張），但「叉腰 ＋ 扛機器」是**新的動作**，分享圖裡沒有。
   → 附的那張 `drafts/surg-lineart-pose-ref.jpg` 只提供**長相／髮型／帽子／服裝／機器造型**，
   **姿勢必須用幾何寫死**（角度、高度、朝向），這正是模板裡那張「文字描述動作一定會漂」的表
   在講的事，所以下面 WHO 那一段寫得比前四科都長。
2. ⚠⚠ **「露齒燦爛笑」是使用者指定的例外。** 這一站的五官規格是「眼睛小圓點、
   嘴一條短線」（ILLUSTRATION.md 第十二節、模板 FACES 那一段），分享圖那一側甚至明文
   `never a wide toothy grin`。這一張**破例**：嘴是張開的大弧，**用兩三筆短線暗示牙齒**，
   仍然是線稿（不填色、不畫牙齦、不畫每一顆牙）。**是使用者要的，不要退回去。**
3. **她要面向畫面左邊**（＝朝著版面裡的文字）。底圖擺在介紹區右下角，
   人物朝右等於背對整頁的字（牙周那一輪就是為了這件事才 `--flip`）。
   這一張直接畫成朝左，**出圖後就不必翻**。

## 這一科的臨界濃度（現算，不要抄別科）

柔墨 `#5c5f57` 壓在「紙色 ＋ 套色 `#8e6299` 按濃度混合」的底上，剛好掉到 4.5 的濃度：

| 科 | 一般 | 牙周 | 根管 | 兒牙 | 矯正 | 植牙 | **口外** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 柔墨 4.5 的臨界濃度 | .101 | .116 | .107 | .152 | .120 | .097 | **.118** |

（同一支算式把前六科的紀錄值一個不差地重算出來，所以 .118 可以直接用。）
深墨 `#2a2c27` 的臨界是 **.718** —— 只壓到深墨的位置（`.tp-reply`／`.tp-close`）就寬鬆得多。

## 要附的圖（三組，說明分開寫）

| # | 檔案 | 這一張只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）；不要參考題材、人物、道具。」 |
| 6 | `drafts/surg-lineart-pose-ref.jpg` | **長相・髮型・帽子・服裝・機器造型** | 「人物的臉、鮑伯頭與紫色綁帶手術帽、白袍與刷手服、以及那台潛盾機的造型照這張；**姿勢完全不要照它**（那張是雙手推機器），畫法照 1~5。」 |
| 7 | `assets/og-topic-surg.jpg` | **年齡層與整體氣質** | 「年齡層與氣質照這張，但畫法完全不同 —— 那張是上色插畫。」 |

## 提示詞（2026-08-25 第一版，可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair, cap and clothing.

WHO — one woman oral surgeon from a small Taiwanese neighbourhood dental clinic, seen from
the waist up, standing still and relaxed, carrying a small tunnelling machine on one
shoulder. Her face, hair, cap, clothes and the machine's design come from the attached
colour illustration; the drawing style comes only from the line-art references; and the
POSE below is new — follow the geometry exactly, it is not in any reference.

  - She is turned in THREE-QUARTER VIEW towards the LEFT of the picture: her shoulders are
    at an angle, not square to the viewer, and her face points forward and slightly to the
    LEFT. She is NOT looking at the viewer.
  - HER LEFT ARM (the far one, on the right of the picture) IS RAISED TO HER SHOULDER: the
    upper arm hangs close to her body, the forearm rises so the hand sits just above the
    shoulder, and the fingers curl over the top of the machine's cylinder to steady it. The
    wrist is relaxed.
  - THE MACHINE RESTS ACROSS THAT SHOULDER like a rolled-up mat: its cylinder lies at about
    a 25 degree angle, rising from her shoulder backwards and upwards, so the round cutter
    disc sits BEHIND HER HEAD at about the height of her ear and slightly higher than her
    cap. The cutter disc faces backwards, away from her face and away from the viewer, and
    is seen at an angle as an ellipse. Nothing rests on her head.
  - HER RIGHT ARM (the near one, on the left of the picture) IS ON HER HIP: the hand sits on
    the waist with the fingers forward and the thumb behind, and the elbow points clearly
    OUT AND BACK so the arm makes an open triangle with her body.
  - Her weight is on one leg so the hips tilt very slightly. The posture is easy and
    confident: shoulders down and level, chin level, back straight but not stiff. She is
    NOT straining, NOT leaning under a weight, NOT flexing, NOT posing like a strongman or a
    superhero.

THE MACHINE — a SMALL, light hand-held tunnelling machine, clearly a scaled-down version of
the one in the attached colour illustration: a short smooth cylinder about as long as her
forearm and about as wide as her head, with two or three clean straight seam lines and a
row of small round bolt heads along each seam, a slim grip underneath, and at its far end a
round cutter disc whose face carries a ring of small circles and a few straight spokes. It
is drawn in OUTLINE ONLY, no filled areas, no glow, no motion lines, no dust, no hose, no
cable. It is a friendly piece of engineering equipment, never a weapon.

FACES — extremely simple: the eyes are two short upward curves, as in a warm smile; the
nose is one tiny stroke. No eyebrow detail, no eyelashes, no blush, no wrinkles.
THE MOUTH IS THE EXCEPTION IN THIS DRAWING AND MUST BE DRAWN AS DESCRIBED: she is smiling
broadly with her mouth open — a wide, generous curved shape with TWO OR THREE SHORT STROKES
INSIDE IT to suggest the upper teeth. Nothing is filled in: no black mouth, no shaded
tongue, no gum line, no individually drawn teeth. It should read as a bright, delighted,
open smile in pure line.

HAIR AND CAP — she has a SHORT BOB that ends at the jaw with a soft fringe, and she wears a
soft tie-back surgical cap pushed back on her head so the fringe and the ends of the bob
show clearly in front of it and below it, with two short ties at the back. Hair and cap are
drawn as OUTLINES ONLY with a few interior strokes for the parting and the fabric folds —
neither is filled in.

CLOTHES — an OPEN white coat worn over a V-neck scrub top, with a chest pocket on the coat.
Outline only, with a few clean folds; no texture, no patterning, no filled areas.

COMPOSITION — the figure and the machine together occupy the middle of the square and about
70% of its height, with generous empty margin on all four sides. She is cropped at the
waist by a clean horizontal edge at the bottom — no legs, no belt detail. Nothing crosses
the outer margin.

BACKGROUND — completely empty. No tunnel, no soil, no room, no floor, no wall, no ground
line, no furniture, no plants, no speech bubbles, no icons, no arrows, no text, no logo, no
sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #8e6299, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

---

## 第二版：要畫到腳（2026-08-25）

使用者：「**蠻好的誒，不過少了下半身。**」

### v1 的量測（門檻只差一項）

| | v1 | 門檻 |
| --- | --- | --- |
| 線佔畫面 | **6.99%** | 4~6%（略高） |
| 筆畫寬中位 | 6px＝5.9‰ | 4~6‰ ✓ |
| 粗細一致 | 1.17 | < 2.5 ✓ |
| 實心填色 | 0 塊 | 0 ✓ |
| 四角乾淨 | 四角都 0 | ✓ |

⚠ **線佔 6.99% 偏高的成因就是「只有上半身」** —— 人物把畫面塞滿了。
畫到腳之後同樣的線會分散到更大的面積，這一項應該會自己落回 4~6%。

### 這一版改的（其餘逐字不動）

- **畫全身**：從頭到鞋子，不要在腰部裁掉。模板那句
  「cropped at the waist … no legs」是給前四科的，**這一科由使用者指定破例**
  （植牙那一輪也破過同一條）。
- **站姿寫成幾何**：重心在一腳、那一側的髖略高、另一腳膝蓋放鬆微屈、腳尖略朝外；
  刷手服長褲、素面球鞋。
- **不要地面線、不要影子** —— v1 底下那一條橫線要拿掉（不然還要靠 `--crop` 裁）。
- 人物在畫面裡佔約 **85% 高**（上半身版是 70%）。

## 交件前要跑的

    node drafts/lineart-measure.mjs drafts/lineart-surg-v1.jpg

| | 門檻 |
| --- | --- |
| 線佔畫面 | 4~6%（未裁的整張） |
| 筆畫寬中位 | 畫面寬的 4~6‰（橫縱取較小值） |
| 粗細一致 | p90 ÷ 中位 < 2.5 |
| 實心填色 | **0 塊**（看填滿外接矩形多少，> 0.5 才算） |
| 四角乾淨 | 各 10% 的方塊裡沒有墨 |

⚠ 內容這一側要逐條看圖：**朝向（左）／叉腰的手肘有沒有打開／機器在肩上而不是頭上／
刀盤朝後／嘴巴是不是張開帶兩三筆牙**。

## 出圖之後

    node tools/topic-lineart.mjs surg --art drafts/lineart-surg-v1.jpg --crop x,y,w,h

（⚠ 生成的線稿幾乎一定會多畫一條地面線，`--crop` 要把它裁掉；
這一張朝左，**不必 `--flip`**。）
然後把 `[data-topic="surg"]` 加進 `index.html` 那三條選擇器的清單，
再開提案頁 `node tools/lineart-preview.mjs surg` 讓使用者挑大小與濃度
（**七科七組值，不要互抄**；這一科的柔墨臨界是 **.118**）。
