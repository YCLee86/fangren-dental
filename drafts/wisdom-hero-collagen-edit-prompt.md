# 〈拔智齒之後〉HERO：第三格膠原蛋白「微笑 ＋ 往外擴散」改圖提示詞
（2026-08-21，第二輪 —— 第一輪的成品是 `drafts/wisdom-hero-v2-collagen.jpeg`）

改的是已上線的 `assets/hero-wisdom-photo-{800,1600,2000}.jpg`。
**局部改圖，不是重生成**：把原圖附上去，只動思考泡泡第三格那塊淡藍膠原蛋白。

使用者要的兩件：① 膠原蛋白加一張「交給我吧」的放心微笑
② 周邊加同色系但更淡的藍白色箭頭往外擴散，讀起來是它正在釋放東西舒緩傷口。

---

## 第一輪錯在哪（使用者的三句話，逐條量過都成立）

> 「箭頭的風格跟插畫不太一樣，太粗太硬太直」「不要往上的箭頭，往左右往下就可以」
> 「膠原蛋白那個臉看起來好大，五官描繪都很大，跟牙齒差很多」

把兩張圖換算到同一個尺度（原圖 2000 寬；成品是 1374 寬，×1.456 回來）：

| | 旁邊那顆牙（原圖，基準） | 第一輪的膠原蛋白 | 差 |
| --- | --- | --- | --- |
| 眼睛 | 實心圓點，寬 **5px** | 閉眼的弧，寬 **17.5px** | **3.5 倍** |
| 嘴 | 笑弧寬 **16px** | 笑弧寬 **35px** | **2.2 倍** |
| 眉毛 | 沒有 | **多長出兩道** | — |

箭頭那一側三件：**實心的塊狀箭頭**（等寬的柱身＋大三角頭，是簡報美工的語彙，
不是這張圖那種手繪細線）、**八支而且有三支往上**（越過縫線、跑出牙齦到白底上）、
**每一支都是直的**。

⚠ **第一輪的提示詞我自己也寫錯了兩個數字**：眼睛寫「方塊寬的 8%」、笑弧寫 28%，
量出來牙齒那顆是 **5.7%／18.4%**。下面已經改掉，而且不再只靠百分比 ——
**改成「和旁邊那顆牙的臉一樣大」這種畫面內的錨點**，那比百分比可靠。

## 量出來的座標與色值（2000×1116 原圖，Chromium canvas 取眾數）

| | |
| --- | --- |
| 膠原蛋白方塊 | x 1286–1373、y 180–261（寬 87、高 81） |
| 方塊填色／內緣深一階 | `#c9e2e9`／`#b2cdda` |
| 周圍牙齦粉 | `#fcd0c7` |
| 線稿的暖褐 | `#4c231c` |
| 那顆牙的臉 | 眼睛 Ø5、眼距 37、笑弧 16×7、線寬 1.5（牙寬 98） |
| 換算到方塊上 | 眼睛 Ø ≈ 塊寬 **5.7%**、眼距 ≈ **42%**、笑弧 ≈ **18%** |
| 箭頭色 | 填 `#e1f0f4`、線 `#bcdde6`（＝方塊色相 H193 往淡推一階） |

## 參考圖：`drafts/collagen-arrows-ref.png`

ILLUSTRATION.md 第十之一節那條 —— **形狀不要用文字描述，用參考圖**。
第一輪箭頭與臉都是純文字描述，兩件都跑掉了，所以這一輪附一張結構圖：
兩張臉一樣大、五支細箭頭的粗細／弧度／開口 V 頭／方向全部畫死。

⚠ **它是示意圖不是風格範本**，提示詞裡已經寫明只取「臉多小」與「箭頭長什麼樣」，
不要抄它的平塗、它那顆簡化的牙、它的構圖。

---

## 主提示詞（英文，連同**原圖**與**參考圖**一起貼給改圖模型）

```
EDIT THIS IMAGE. ONE LOCAL EDIT ONLY — EVERYTHING ELSE MUST STAY PIXEL-IDENTICAL.

The FIRST attached image is a finished hand-drawn editorial illustration. Do NOT redraw,
restyle, recolour, recompose, crop or re-render any other part of it. Keep the existing
linework, the paper grain, every colour, every character, the room, the street panel on the
right, the framing and the 16:9 proportions exactly as they are.

The SECOND attached image is a flat schematic reference. It is NOT a style reference. Take
from it only two things: (a) how small the face on the blue block is — the same size as the
face on the tooth next to it; (b) the shape, thinness, curve, taper and direction of the
five arrows. Do NOT copy its flat colours, its simplified tooth, its plain gum or its
composition.

WHERE — Everything below happens inside the THIRD (rightmost) compartment of the big
rounded thought bubble that runs along the top of the picture: the compartment holding one
clean white tooth with a small face, a pink gum ridge with three small dark X stitches
along its top edge, and a light blue rounded square set into the gum to the RIGHT of that
tooth. That light blue rounded square is a collagen plug. Nothing outside this compartment
changes — the first compartment (crowded teeth) and the second compartment (dark red
socket and the toothbrush with the red X) stay exactly as they are.

CHANGE 1 — GIVE THE COLLAGEN PLUG A SMALL REASSURING FACE, THE SAME SIZE AS THE TOOTH'S
The white tooth in this same compartment already has a face. Copy that face onto the blue
block at THE SAME ABSOLUTE SIZE — if you laid the two faces side by side they would be
indistinguishable in scale and in stroke weight. The block is about as wide as the tooth,
so the face must look small on it, with plenty of empty blue all around it.
- TWO EYES, each a small SOLID ROUND DOT filled warm dark brown, about 6% of the block's
  width across — tiny, the smallest marks in the compartment — set about 42% of the
  block's width apart, a little above the block's middle.
- ONE MOUTH: a single thin upward-curving arc below and between the eyes, about 18% of the
  block's width, hairline weight, the same stroke as the tooth's smile.
- Two very faint round blush patches, one outside each eye, no bigger than the tooth's.
- The expression is calm, warm and reassuring — "I've got this, leave it to me."

THE FACE MUST NOT BE:
- closed crescent eyes, curved smiling-line eyes, ^ ^ eyes, arc eyes or winking eyes —
  the eyes are ROUND SOLID DOTS, nothing else;
- given eyebrows, a nose, a tongue, teeth, an open mouth or a wide grin;
- bigger, bolder or more detailed than the tooth's face — no feature on the block may be
  larger than the matching feature on the tooth;
- placed low, wide or spread out across the block.

CRITICAL — THE PLUG MUST STAY A BLOCK
Keep the collagen plug exactly the shape, size, position and colour it already is: a
rounded square with four flat sides, its own slightly deeper blue inner rim, its top edge
tucked under the stitched gum. Adding the face must NOT turn it into a tooth: no crown, no
cusps, no roots, no tooth silhouette, no rounding it into a blob, no arms, no legs. Do not
move it, do not enlarge it, do not change its blue.

CHANGE 2 — FIVE THIN HAND-DRAWN ARROWS SPREADING OUT SIDEWAYS AND DOWNWARDS
Add small pale blue-white arrows around the plug so it reads as quietly releasing
something soothing into the wound.
- EXACTLY FIVE arrows, and only in these five directions: LEFT, DOWN-LEFT, DOWN,
  DOWN-RIGHT, RIGHT. NOTHING ABOVE THE BLOCK — no upward arrows, no diagonally-upward
  arrows, nothing near or over the three X stitches.
- Each arrow is ONE THIN HAND-DRAWN PEN STROKE with a small OPEN V head at its outer end,
  exactly like the arrows in the second attached image: the stroke is thickest where it
  leaves the block and tapers to a fine point; the V head is two short open strokes, not a
  filled triangle.
- Each stroke CURVES GENTLY — a soft hand-drawn bow, never a ruler-straight line; the
  weight varies a little along it, the way every other line in this picture does.
- Length about one third of the block's width. They start a small gap away from the block.
- Colour: fill #e1f0f4, line #bcdde6 — lighter than the plug's own blue.
- They lie over the pink gum, clear of the tooth, clear of the stitches, inside the bubble.

AVOID — every item here has already been drawn wrong:
- NEVER a solid filled block arrow, a slab arrow, a clip-art or infographic arrow, a
  uniform-width shaft or a big filled triangular arrowhead;
- never a thick, hard-edged, ruler-straight arrow — these must look drawn by the same hand
  that drew the tooth;
- never an arrow above the block, over the stitches, or leaving the pink gum;
- never more than five arrows;
- never join the arrows into a ring, halo, circle, arc or any closed loop;
- never let an arrow grow thicker, longer or bolder as it travels outward;
- no long ribbons, no meandering S-curves, no swirls, no spirals, no motion streaks;
- no sparkles, stars, glow, bloom, radiance, soft aura or gradient haze;
- no dotted trails, no particle dots, no bubbles, no droplets;
- NO TEXT ANYWHERE: no words, letters, numbers, labels, captions, symbols, watermark;
- do not turn the plug into a tooth, a pill, a marshmallow, a sponge with visible holes, a
  battery, a plaster or a cushion;
- no new characters and no new faces anywhere except this one block;
- do not touch the people, the dental room, the street panel, the lighting, the colours or
  the paper texture anywhere else in the image.
```

## 短版（給只吃簡短指令的改圖模型）

```
Keep everything in this illustration identical except the light blue rounded square (the
collagen plug) in the third compartment of the top thought bubble. Use the second image as
a shape reference only, not a style reference.
1) Give that square the SAME face as the white tooth beside it, at the same size: two tiny
solid round dark-brown dot eyes and one thin upward-curving smile, plus two faint blush
patches. The face must be small — no feature larger than the tooth's, no crescent or closed
eyes, no eyebrows, no nose, no open mouth. It stays a rounded square with four flat sides:
no crown, no roots, do not turn it into a tooth, do not move or resize it.
2) Around it draw EXACTLY FIVE thin hand-drawn arrows, pointing LEFT, DOWN-LEFT, DOWN,
DOWN-RIGHT and RIGHT only — none pointing up, none over the stitches. Each is one gently
curved pen stroke that tapers from thick at the block to a fine point, ending in a small
open V head, about a third of the block's width, in pale blue-white (#e1f0f4 with a #bcdde6
line). No solid block arrows, no straight ruler lines, no ring or halo, no sparkles, no
glow, no dots, no text. Do not change anything else in the picture.
```

---

## 圖回來之後要做的三件

1. 原檔存進 `drafts/`（照 ILLUSTRATION.md 第十之八節）。
2. `node tools/hero-resize.mjs <原檔> wisdom-photo`
   → `assets/hero-wisdom-photo-{2000,1600,800}.jpg` 三張一起換掉。
   出圖前它會自己擋白框與長寬比，不過就拒絕寫檔。
3. **不必改 `post-meta`、`<main>` 一個字都不動** —— 內容雜湊不涵蓋圖檔內容，
   所以那一篇的「最後更新」不會跳（第七節第 17 條那次換 `hero-arch` 就是這樣）。
   ⚠ 但檔名如果變了就會動到雜湊，所以**沿用同一組檔名**。

⚠ **第一輪的成品只有 1374×768**（模型把整張重畫了一遍，不是只補那一塊），
放到 2000 要放大 1.46 倍。平塗的插畫撐得住（同 `bioceramic` 那次），
但**能要到更大的原檔就要**。

定案之後要補進 ILLUSTRATION.md 第八節：第 7 條的「沒有臉」由使用者於 2026-08-21 解除，
限度是「臉可以有，但要和旁邊那顆牙的臉一樣大，圓角方塊的幾何一項都不准鬆」。
