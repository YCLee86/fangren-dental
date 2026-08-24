# 線稿底圖提示詞：兒童牙科（`lineart-kids`）

**狀態：⏳ 等出圖（2026-08-24）。** 規格與管線見
[`topic-lineart-prompt.md`](topic-lineart-prompt.md)（模板）、ILLUSTRATION.md 第十二節、
CLAUDE.md 定案表「著陸頁的線稿底圖」那三列（一般牙科／牙周／顯微根管各一組值，**不要互抄**）。

## 使用者給的概念（2026-08-24，逐字）

> 「線稿圖就選醫師和治療椅的小孩　治療椅不需要整個畫進來」

兩件因此定下來：**① 只畫那兩個人**（分享圖裡的護理師、媽媽、妹妹都不畫）、
**② 診療椅只留一角**（他坐在什麼上面看得出來就好）。

## 要附的圖（七張，三組，說明分開寫）

| # | 檔案 | 只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）；不要參考題材、人物、道具。⚠ 第 3、4、5 張的頭髮是實心黑的，**那個不要**。」 |
| 6 | `drafts/lineart-kids-pose-ref.jpg` | **姿勢・視線・髮型・表情・手的高度與角度** | 「姿勢、視線、表情完全照這張；**但房間、盆栽、牆上的雲和星星、診療燈、整張診療椅都不要畫**，畫法照 1~5。」 |
| 7 | `assets/og-topic-kids.jpg` | **長相・服裝・年齡層** | 「人物長相、服裝、年齡層照這張，但畫法完全不同 —— 那張是上色插畫。」 |

姿勢參考是從已上線的分享圖裁的：`x395 y175 470×440 → ×3 → 1410×1320`
（`node -e` 一次性裁的，同 `drafts/og-topic-kids-refs-crop.mjs` 的做法）。

## 提示詞（第一版，逐字，可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE - EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND - no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair, clothing and the
pattern on the clothing.

WHO - a dentist and a small boy in a Taiwanese neighbourhood dental clinic, at exactly the
same eye level. Follow the attached photo-reference for pose, gaze, hair and expression
EXACTLY; only the drawing style comes from the line-art references.

  - LEFT - a female dentist, mid-thirties, DOWN ON ONE KNEE, her body in three-quarter view
    facing RIGHT towards the boy. Her back is straight and she leans in only slightly. She
    wears a TIE-BACK SURGICAL CAP that covers all of her hair, gathered into a small knot
    with two short ties at the BACK of her head; no loose hair shows except a small wisp at
    the nape. Over a V-neck scrub top and scrub trousers she wears an OPEN, UNBUTTONED WHITE
    COAT. HER CAP AND HER CLOTHES CARRY A FEW SIMPLE CHILDLIKE DOODLES DRAWN AS OUTLINES
    ONLY - a small bear's head, a chick, a cloud, a star - about four on the cap and five or
    six spread over the top and trousers, each roughly a quarter of the width of the cap,
    with plenty of empty cloth between them. The doodles are never filled in.
    She holds A SMALL ROUND HAND MIRROR upright in her near hand at her own chest height,
    its face turned towards the boy; her other hand rests easily on her raised knee. HER
    EYES ARE ON THE BOY and she has a small closed smile.

  - RIGHT - a boy of about five, SITTING, his body in three-quarter view facing LEFT towards
    her. Short dark hair drawn as an OUTLINE with two or three interior strokes for the
    parting - never filled in. A plain round-neck t-shirt and plain shorts, NO pattern on
    them. He leans forward a little; his near arm reaches out and HIS INDEX FINGER POINTS AT
    THE MIRROR at about his own chest height, elbow bent and kept close to his body; his
    other hand rests beside him. His legs hang down freely, knees slightly apart, feet in
    simple trainers. HIS MOUTH IS WIDE OPEN IN A LAUGH - a large oval - and his eyes are two
    short upward-curving strokes, the way eyes look when someone is laughing.

⚠ CRITICAL - THEIR TWO HEADS ARE AT THE SAME HEIGHT. The top of her cap and the top of his
hair sit on the same horizontal line. She has come down to his level; that is the whole
point of the picture. She is NOT standing, NOT bending over him from above, and NOT
crouching over him.

⚠ CRITICAL - BOTH OF THEM LOOK AT THE LITTLE MIRROR HELD BETWEEN THEM. Neither of them
looks at the viewer, and neither looks off into the distance.

⚠ CRITICAL - DO NOT DRAW THE WHOLE DENTAL CHAIR. The only object besides the two people and
the mirror is A MINIMAL SUGGESTION OF THE SEAT the boy sits on: the front edge of the seat
cushion and one armrest, cut off cleanly by the RIGHT EDGE of the picture. No backrest, no
headrest, no chair base, no foot pedal, no instrument arm, no tubes, no operating lamp.

⚠ CRITICAL - NOTHING GOES NEAR THE BOY'S MOUTH. No instrument, no hand, no tool of any kind
is held up to his face.

FACES - extremely simple: her eyes are small solid dots, his are short upward curves; the
nose is one tiny stroke on each. No eyebrow detail, no eyelashes, no blush, no wrinkles, no
teeth drawn inside his open mouth.

COMPOSITION - the two figures together occupy the middle of the square and about 70% of its
height, with the dentist on the left and the boy on the right, a small gap between them
where the mirror is. Generous empty margin on all four sides. They are cropped by a CLEAN
HORIZONTAL EDGE at the bottom, just below her kneeling knee and below his hanging feet.

BACKGROUND - completely empty. No room, no wall, no window, no floor, no floor line, no
plants, no wall stickers, no clouds, no stars on the wall, no clinic sign, no speech
bubbles, no icons, no arrows, no motion lines, no text, no logo, no sparkles, no frame or
border.

COLOUR - the drawing is in ONE colour only: #c28229, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration with
a lot of white space.
```

## 出圖之後（管線，三步）

1. `node drafts/lineart-measure.mjs <圖檔>` —— 線佔 4~6%、筆畫 4~6‰、粗細一致 < 2.5、
   實心填色 0 塊、四角乾淨。⚠ **內容也要逐條看**：兩個頭一樣高、都看著鏡子、
   椅子只剩一角、嘴巴旁邊沒有東西。
2. `node tools/topic-lineart.mjs kids --art drafts/lineart-kids-v1.jpg --crop x,y,w,h`
   （⚠ 生成的線稿幾乎一定會多一條地面線，裁掉；座標現場量。
   ⚠ 需不需要 `--flip` 現場判斷：圖擺在介紹區**右下角**，人物要朝**版心裡面（左）** ——
   這一版醫師本來就面向右、小孩面向左，**朝向要看定稿那張再決定**。）
3. `index.html` 那三條選擇器加 `[data-topic="kids"]` → `node tools/topics.mjs && node tools/build.mjs`。

### 這一科的臨界濃度（**現算的，不要抄別科**）

| | 一般牙科 `#3f654a` | 牙周 `#317d78` | 顯微根管 `#ae4f4d` | **兒牙 `#c28229`** |
| --- | --- | --- | --- | --- |
| 柔墨 `--ink-soft` 掉到 4.5 的濃度 | .101 | .116 | .107 | **.152** |

**兒牙是四科裡最寬鬆的**（套色最淺）。深墨 `--ink` 那一側到 .97 才掉到 4.5，等於不受限。
⚠ 但**「會不會壓到柔墨」是寬度決定的**（顯微根管那一輪：直的圖在 ≥721 根本沒壓到柔墨，
濃度因此純粹是美感）——**提案時現場量一次哪幾行壓在圖上**，不要照抄別科的分段與濃度。
