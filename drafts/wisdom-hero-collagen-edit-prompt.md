# 〈拔智齒之後〉HERO：第三格膠原蛋白「微笑 ＋ 往外擴散」改圖提示詞（2026-08-21）

改的是已上線的 `assets/hero-wisdom-photo-{800,1600,2000}.jpg`。
**這是局部改圖，不是重生成**：把 `assets/hero-wisdom-photo-2000.jpg` 附上去，
提示詞只動思考泡泡第三格那塊淡藍膠原蛋白，其餘一個像素都不要動。

使用者要的兩件：① 膠原蛋白加一張「交給我吧」的放心微笑
② 周邊加同色系但更淡的藍白色箭頭往外擴散，讀起來是它正在釋放東西舒緩傷口。

## 量出來的座標與色值（2000×1116 那張，Chromium canvas 取眾數）

| | |
| --- | --- |
| 膠原蛋白方塊 | x 1286–1373、y 180–261（寬 87、高 81），中心 (1330, 220) |
| 方塊填色 | `#c9e2e9` |
| 方塊內緣那圈深一階的藍 | `#b2cdda` |
| 周圍牙齦粉 | `#fcd0c7` |
| 泡泡底白 | `#fefefe` |
| 旁邊那顆牙的臉（比例基準） | 眼睛直徑 ≈ 方塊寬的 8%、兩眼間距 ≈ 44%、笑弧寬 ≈ 28% |

箭頭色是把方塊填色的色相（H 193）留著、往淡的方向推一階：
填 **`#e1f0f4`**、邊 **`#bcdde6`**（＝「同色系但比較淡的藍白色」）。

## ⚠ 兩個一定會踩的坑（提示詞裡各有一段在擋）

1. **「沒有臉」原本是防它變成牙齒的那道鎖**（ILLUSTRATION.md 第八節第 7 條：
   示意物會被周圍同化，那塊藍棉在滿是牙齒的環境裡被畫成牙齒形狀，所以當初寫死
   「圓角方塊、四邊平、沒有牙冠、沒有牙根、**沒有臉**」）。
   這一輪由使用者指定解除「沒有臉」，**其餘幾何條件要原封不動留著並加重**，
   否則加了臉它就會整塊變成一顆擬人牙。
2. **箭頭是「從東西身上出來的」，適用短線那條規則**（第七節第 17 條、第十之六節）：
   一群同向短弧、起點最實、往外變淡、**不繞成閉合的圈、不越走越粗**。
   繞成一圈光暈會被讀成方塊的輪廓，不是擴散。

## 主提示詞（英文，連同原圖一起貼給改圖模型）

```
EDIT THIS IMAGE. ONE LOCAL EDIT ONLY — EVERYTHING ELSE MUST STAY PIXEL-IDENTICAL.

This is a finished hand-drawn editorial illustration. Do NOT redraw, restyle, recolour,
recompose, crop or re-render any other part of it. Keep the existing linework, the paper
grain, every colour, every character, the room, the street panel on the right, the framing
and the 16:9 proportions exactly as they are.

WHERE — Everything below happens inside the THIRD (rightmost) compartment of the big
rounded thought bubble that runs along the top of the picture: the compartment holding one
clean white tooth with a small face, a pink gum ridge with three small dark X stitches
along its top edge, and a light blue rounded square set into the gum to the RIGHT of that
tooth. That light blue rounded square is a collagen plug. Nothing outside this compartment
changes — the first compartment (crowded teeth) and the second compartment (dark red
socket and the toothbrush with the red X) stay exactly as they are.

CHANGE 1 — GIVE THE COLLAGEN PLUG A SMALL REASSURING FACE
Draw a face on the front of the light blue rounded square, in exactly the same drawing
language as the face already on the white tooth beside it:
- two small solid oval dot eyes, equal size, sitting a little above the middle of the
  block; each eye about 8% of the block's width across, the two eyes about 44% of the
  block's width apart; same warm dark brown as the tooth's eyes, never pure black;
- below and between them one single thin upward-curving smile, a simple open arc about
  28% of the block's width, the same stroke weight as the tooth's smile, its ends lifting
  very slightly;
- one soft round blush patch outside each eye, very light, a touch pinker than the block;
- the expression is calm, warm and reassuring — "I've got this, leave it to me" — a
  settled, gentle smile, NOT a wide grin, NOT surprised, NOT winking, NOT closed crescent
  eyes, NOT a tongue, no eyebrows, no nose.
The face is small and quiet: it must read at thumbnail size as a friendly little block,
not as a cartoon mascot.

CRITICAL — THE PLUG MUST STAY A BLOCK
Keep the collagen plug exactly the shape, size, position and colour it already is: a
rounded square with four flat sides, its own slightly deeper blue inner rim, its top edge
tucked under the stitched gum. Adding the face must NOT turn it into a tooth: no crown, no
cusps, no roots, no tooth silhouette, no rounding it into a blob, no arms, no legs. Do not
move it, do not enlarge it, do not change its blue.

CHANGE 2 — PALE BLUE-WHITE ARROWS SPREADING OUTWARD
Add small pale blue-white arrows around the plug, all pointing away from it, so the block
reads as quietly releasing something soothing into the wound.
- SIX to EIGHT arrows, spaced evenly around the LEFT, LOWER-LEFT, BOTTOM, LOWER-RIGHT and
  RIGHT of the block, each pointing straight outward from the block's centre, radiating.
- Each arrow is ONE short, slightly curved, hand-drawn shaft with a small open V head at
  its outer end; length about one third of the block's width; the same slightly uneven
  hand-drawn line quality as the rest of the picture.
- Fill #e1f0f4 with a marginally deeper #bcdde6 edge, so they stay readable where they lie
  over the pink gum. They are lighter than the plug's own fill.
- Each arrow is at its most solid where it starts, nearest the block, and thins and fades
  as it travels outward.
- They lie over the pink gum only. They stay clear of the three X stitches, clear of the
  tooth and its face, and inside the bubble compartment.

AVOID — every item here has been drawn wrong before:
- never join the arrows into a ring, halo, circle, arc or any closed loop around the block;
- never let an arrow grow thicker, longer or bolder as it travels outward;
- no long ribbons, no meandering S-curves, no swirls, no spirals, no motion streaks;
- no sparkles, stars, glow, bloom, radiance, soft aura or gradient haze;
- no dotted trails, no particle dots, no bubbles, no droplets;
- not one single big arrow, and no arrows pointing inward;
- no arrow crossing the stitches, the tooth, the compartment divider line or the bubble
  outline;
- NO TEXT ANYWHERE: no words, no letters, no numbers, no labels, no captions, no symbols,
  no watermark, no signature;
- do not turn the plug into a tooth, a pill, a marshmallow, a sponge with visible holes, a
  battery, a plaster or a cushion;
- no new characters and no new faces anywhere except this one block;
- do not touch the people, the dental room, the street panel, the lighting, the colours or
  the paper texture anywhere else in the image.
```

## 短版（給只吃簡短指令的改圖模型）

```
Keep everything in this illustration identical except the light blue rounded square (the
collagen plug) in the third compartment of the top thought bubble.
1) Give that square a small calm reassuring smiling face — two warm dark-brown dot eyes and
one thin upward-curving smile, plus two very light blush patches — drawn exactly like the
face on the white tooth beside it. It must stay a rounded square with four flat sides: no
crown, no roots, do not turn it into a tooth, do not move or resize it.
2) Around that square add 6-8 short hand-drawn pale blue-white arrows (#e1f0f4 with a
#bcdde6 edge, lighter than the plug itself), evenly spaced around its left, bottom and
right, each pointing outward, each about a third of the block's width, strongest where it
starts and fading as it goes out — it should read as the plug releasing something soothing
into the wound. No ring or halo around it, no arrow growing thicker outward, no sparkles,
no glow, no dots, no text. Do not change anything else in the picture.
```

## 圖回來之後要做的三件

1. 原檔存進 `drafts/`（照 ILLUSTRATION.md 第十之八節）。
2. `node tools/hero-resize.mjs <原檔> wisdom-photo`
   → `assets/hero-wisdom-photo-{2000,1600,800}.jpg` 三張一起換掉。
   出圖前它會自己擋白框與長寬比，不過就拒絕寫檔。
3. **不必改 `post-meta`、`<main>` 一個字都不動** —— 內容雜湊不涵蓋圖檔內容，
   所以那一篇的「最後更新」不會跳（第七節第 17 條那次換 `hero-arch` 就是這樣）。
   ⚠ 但檔名如果變了就會動到雜湊，所以**沿用同一組檔名**。

定案之後要補進 ILLUSTRATION.md 第八節：第 7 條的「沒有臉」由使用者於 2026-08-21 解除，
限度是「臉可以有，圓角方塊的幾何一項都不准鬆」。
