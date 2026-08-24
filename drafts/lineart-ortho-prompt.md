# 線稿底圖提示詞：齒顎矯正（`lineart-ortho`）

**狀態：⏳ 提示詞寫好，還沒生圖（2026-08-24）。**
規格見 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十二節與 `drafts/topic-lineart-prompt.md`（模板）。
順序：**分享圖在前、線稿在後** —— 分享圖已於 2026-08-24 上線
（`assets/og-topic-ortho.jpg`），姿勢參考就是從它裁出來的。

## 這一科要畫什麼（使用者 2026-08-24 指定）

> 「給我矯正著陸頁用的線稿　感覺可以是**醫師的動作和他正前方的大螢幕**」

所以這一張**只有兩個東西**：醫師（畫到腰）＋ 他正前方那面大螢幕。
⚠ **小螢幕、光弧、病人、助理全部不畫** —— 線稿是壓在文字底下的底圖
（濃度 .1~.3），元素一多就變雜訊。

## 要附的七張圖（三組，說明分開寫）

| # | 檔案 | 附圖時要寫的話 |
| --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | 「**只參考線條畫法**（均勻粗細、無濃淡、無陰影、無材質、大量留白）；**不要參考題材、人物、道具**。」 |
| 6 | `drafts/lineart-ref-ortho-pose.png` | 「**姿勢、視線方向、髮型、兩隻手的高度與角度、螢幕的位置與傾斜，完全照這張**；但畫法照 1~5，畫到腰就好。⚠⚠ **表情不要照這張** —— 那張是他在對病人講話（嘴巴張開），線稿裡沒有病人，表情照提示詞寫的「專注但放鬆的淺笑」。⚠ **右下角那隻手是別人的，不要畫**；⚠ 左邊和下面那幾張小螢幕、還有那些光弧**都不要畫**。」 |
| 7 | `assets/og-topic-ortho.jpg` | 「人物長相、服裝、年齡層照這張，但**畫法完全不同** —— 那張是上色插畫。」 |

姿勢參考的做法：從 `assets/og-topic-ortho.jpg` 裁 `x200 y108 600×520` → ×2 → 1200×1040。

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

WHO — Follow the attached photo-reference for pose, gaze, hair and expression EXACTLY;
only the drawing style comes from the line-art references.
ONE PERSON ONLY: a Taiwanese man in his late thirties, a dentist, standing and turned
three-quarters towards the RIGHT, where a large screen floats in front of him. He is drawn
from the waist up.
HIS HAIR is short, side-parted, with a little volume at the front and short sideburns —
drawn as an OUTLINE ONLY with two or three interior strokes for the parting, never filled in.
HIS EXPRESSION IS ABSORBED BUT AT EASE — he is enjoying this piece of work. THE MOUTH IS
ONE SHORT LINE CURVING GENTLY UPWARDS AT BOTH ENDS: a small, closed, relaxed smile. It is
NOT open, he is NOT speaking, and it is NOT a wide grin or a straight flat line. HIS EYES
LOOK DOWN AND FORWARD AT HIS OWN POINTING FINGERTIP on the screen, drawn as two short
strokes that curve softly, not as hard round dots. HIS HEAD TILTS A LITTLE TOWARDS THE
SCREEN and HIS SHOULDERS ARE LOW AND RELAXED, never squared or hunched.
HIS ARMS, EXACTLY:
  • THE FAR ARM (his left, higher in the picture) is raised to SHOULDER HEIGHT, the elbow
    bent and kept close to his body, the forearm angled up and forward, THE HAND OPEN WITH
    THE PALM TURNED TOWARDS THE SCREEN and the fingers slightly spread and relaxed, the
    fingertips just touching the upper-left edge of the screen.
  • THE NEAR ARM (his right, lower) is raised to CHEST HEIGHT, the elbow bent, THE INDEX
    FINGER EXTENDED and its tip touching one tooth near the left edge of the screen; the
    other fingers are curled in loosely.
HE WEARS an open long white doctor's coat with a collar and two front panels, over a
V-neck scrub top; one simple line at each wrist marks the cuff of a glove. Draw the coat
and the scrub top as outlines only.
CRITICAL — HE IS NOT WAVING AND HE IS NOT GREETING ANYONE: the open hand is turned towards
the screen, seen at an angle, never a flat symmetrical palm facing the viewer.
CRITICAL — HE DOES NOT LOOK AT THE VIEWER, and no other person appears anywhere in the
drawing: no patient, no assistant, no second pair of hands.

FACES — extremely simple: eyes are small solid dots or short curved strokes, the nose is
one tiny stroke or omitted. No eyebrow detail, no eyelashes, no blush, no wrinkles. The
mouth is one short gently upward-curving line — a small closed smile, as described above.

THE SCREEN — a single large rounded rectangle floating in the air in front of him, on the
RIGHT of the picture, TILTED very slightly so its left edge is nearer to us. Its frame is
one clean outline of the same weight as everything else. INSIDE IT, drawn in the same
uniform line and nothing else:
  • A DENTAL ARCH SEEN FROM ABOVE — a horseshoe of TWELVE simple teeth, each an outlined
    rounded shape, evenly spaced apart from each other.
  • THREE of those teeth are PLAINLY OUT OF LINE: one rotated sideways, one tipped over,
    one pushed inwards out of the horseshoe.
  • TWO CURVED ARROWS, each about as long as two teeth are wide, showing which way two of
    the crooked teeth must travel.
NOTHING ELSE ON THE SCREEN: no small screens, no second panel, no glow, no light streaks,
no sparkles, no dots, no measurement marks, no text, no numbers.

COMPOSITION — the man and the screen together occupy the middle of the square and about
70% of its height, the man on the LEFT and the screen on the RIGHT, slightly overlapping
where his fingers touch it. Generous empty margin on all four sides. He is cropped at the
waist by a clean horizontal edge — no legs, no belt line detail.

BACKGROUND — completely empty. No room, no doorway, no window, no wall, no floor, no
furniture, no plants, no clinic sign, no speech bubbles, no icons, no arrows outside the
screen, no text, no logo, no decorative sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #4478b5, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

## 交件門檻（`node drafts/lineart-measure.mjs <圖>`）

線佔比 5~8%／筆畫粗細一致（p90÷中位）< 2.0／實心填色 0 塊。

## 出圖之後（管線）

    node tools/topic-lineart.mjs ortho --art drafts/lineart-ortho-v1.jpg --crop x,y,w,h

⚠ 生成的線稿幾乎一定會多畫一條地面線、四周留一大圈空白 → 用 `--crop` 裁掉。
⚠ **這一科的大小與濃度要現算，不要抄前三科**（一般牙科 .10/.48 分段 834、
牙周 .115/.15 分段 721、顯微根管 .107/.30 分段 721）。
臨界濃度跟著套色走：矯正 `#4478b5` 比前三支都淺，所以**臨界值會比它們寬鬆**，
但仍要用柔墨 `#5c5f57` 壓在混色上算 4.5 的那一格。
⚠ 朝向：這張圖的醫師**面向右**，而底圖放在介紹區**右下角** —— 面向右等於朝版心外，
**大概會需要 `--flip`**（同牙周那次）；`--crop` 的座標一律在原圖上量（先裁再翻）。
