# 分享圖提示詞：一般牙科・定期檢查（`og-topic-general`）

**狀態：第一版提案，還沒生成、還沒給使用者看過圖。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第六節（曝光原則）。文案脈絡見 COPY.md 第九之十四節。

---

## 這一張要講的事

使用者 2026-08-22 指定的概念（他拿一張自己生成的巷弄立面圖當參考）：
**「診所跟診所的人跟整棟房子，在巷弄裡跟場景融在一起」** ——
正好對上那一頁的兩行：［老屋新生］永樂街的五十年老屋、［在地］四十多年不少人陪著走到現在。

## ⚠ 概念留著，構圖整個收（他自己也講了「畫那麼大張圖不行」）

參考圖是四個開間的完整立面 ＋ 二十幾個人。縮到 250px 會落在第十一節那張實測表的
**「人太多、沒有視覺中心」**那一列（〈刷牙〉〈定期檢查〉〈牙齦流血〉三張就是這樣死的）。
逐條的收法：

| 參考圖 | 這一版 | 依據 |
| --- | --- | --- |
| 四個開間的整排立面 | **一個開間**：診所的門口 ＋ 半扇窗，佔畫面高度約 85% | 硬規格 3（主體 ≥ 55%） |
| 二十幾個人、一樣大 | **三個人**，視覺中心是門口那兩位，第三位小而淡 | 硬規格 4 |
| 招牌、電表、海報、盆栽、四台機車 | 全部拿掉，只留門、窗、雨庇那條、兩三階牆面 | 硬規格 5 |
| 分格感的並排場面 | 一個場景、一個焦點 | 硬規格 2、6 |
| —— | **左下角 46%×40% 留成空的路面**（色牌要疊在那裡） | 硬規格 8 |

⚠ **參考圖裡那幾條白色長線留著**（第十之六節：氛圍線可以長，只要不是從人身上長出來的）。
⚠ **招牌一定要空白** —— 立面上最容易長出亂碼字的就是那塊（第七節第 4 條）。

## 顏色的來源（不是挑的，是量的）

刷手服與頭髮直接用〈半年一次的洗牙〉那張 HERO 的實測值（第十之三節那張表的「一般牙科」欄），
所以這張分享圖和那一科的文章插畫是同一家人：

    刷手服 主色 #bfd7b7 ／ 陰影 #99b899
    頭髮   主色 #374840 ／ 暗 #283930 ／ 亮 #404f47

科別點綴色 `#3f654a`（PALETTE.md 一般牙科的**套色**那一階）只當一條帶子用，不整張罩。

## 色牌（後製疊上去，不畫進圖裡）

左下角：`#3f654a` 的牌子，兩行 —— 「一般牙科・定期檢查」（大）／標誌＋「芳仁牙醫診所」（小）。
⚠ 九個字是七科裡最長的，版面要先用它試（第十一節）。

## 管線

原檔（≥1200 寬）放 `drafts/og-topic-general-src.png`，再跑
`node tools/hero-resize.mjs`（同一條 Chromium 路徑）產出 `assets/og-topic-general.jpg`，
畫布 **1200×628**，不是文章 HERO 的 2000×1116。

---

## 提示詞（逐字，可直接複製）

```
Editorial illustration for a small social-media preview card, 1200 x 628 landscape
(1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Everything in it must still be readable at that size. ONE
single scene, ONE focal point, big simple shapes, very few objects. Do NOT divide the
image into panels. No speech bubbles, no thought bubbles, no circular close-ups or
insets, no small icons, no arrows, no diagrams. If something would become a speck of
noise at thumbnail size, leave it out.

THE SCENE — A quiet old residential lane in a small town in central Taiwan, late
afternoon. We look straight at the ground-floor frontage of a fifty-year-old two-storey
townhouse that has been renovated and is now a small neighbourhood dental clinic. We see
only ONE BAY of that frontage — its doorway and one window — not a long row of shops.

THE BUILDING IS THE MAIN SUBJECT and it fills the picture: the frontage occupies the
RIGHT-HAND 60% of the width and about 85% of the height, its wall running up past the
top edge of the image so we see the underside of a shallow canopy and the bottom of one
upper-storey window, cropped by the frame. The wall is washed pale grey plaster with one
panel of muted terracotta brick beside the door; both surfaces are old but well kept,
with visible repair patches and soft weathering. Only three or four large elements exist
on the whole frontage: a WIDE WOODEN DOUBLE DOOR standing open, one window with a simple
frame, a slim canopy with a single narrow deep-green painted band along its edge, and a
BLANK signboard above the door. Nothing else on the wall — no posters, no meter boxes,
no cables, no plants in pots, no bicycles, no scooters, no bins, no menu boards.

THE FOCAL POINT is the OPEN DOORWAY. Warm light spills out of it onto the pavement,
making it the brightest and warmest area in the picture, and every person in the image is
turned towards it. The doorway sits at roughly the horizontal centre-right of the image.

THE PEOPLE — exactly THREE people, all East Asian (Taiwanese), all in the right half of
the image, drawn simply and calmly:
  • A DENTIST in pale sage-green scrubs stands just outside the open door, one hand
    resting on the door frame, body angled towards the street, head turned slightly down
    towards the woman walking up. Relaxed, quietly friendly, mouth in a soft closed
    smile. She is the tallest figure and stands within the doorway's warm light.
  • An OLDER WOMAN in her sixties walks towards the door from the left, seen from
    three-quarters behind and to one side, carrying a cloth shopping bag in the hand
    furthest from the viewer. Her shoulders are relaxed; she is arriving, not hurrying.
    She overlaps the edge of the warm light so the two of them plainly belong to the same
    moment.
  • A NEIGHBOUR further to the right, near the frame edge, small and lightly drawn: an
    older man pausing with a hand raised in a brief greeting towards the doorway. Fewer
    lines, paler colour, clearly secondary.
Nobody is a patient in a chair, nobody wears a mask, nobody holds any dental instrument,
nobody looks at the viewer, and nobody is placed in the lower-left area of the picture.
The three figures read as neighbours and the clinic's own people sharing one ordinary
street, not as staff posing for a photograph.

KEEP THE LOWER LEFT EMPTY — the rectangle covering the LEFT 46% of the width and the
BOTTOM 40% of the height must stay quiet and almost empty: plain pavement and road
surface in two or three soft tones, with no face, no hand, no figure, no object, no
strong detail and no hard edge crossing it. A long soft shadow may fall across it. The
rest of the left side is the continuing plain plaster wall of the same house and a strip
of the lane, kept simple.

ATMOSPHERE LINES — two or three LONG, soft, white hand-drawn arcs sweep across the upper
part of the sky and above the canopy, chalk-like, thinning to dry flecks at their ends,
suggesting a light breeze along the lane. They never touch or emerge from any person's
mouth, nose, hands or body; they never loop, close or cross each other.

LIGHT — Soft late-afternoon daylight, cool and neutral on the plaster wall and the road.
The ONE warm light in the picture is the glow coming out of the open doorway, pooling on
the pavement just outside it. This is a bright, clean, airy image: NOT a sunset, no
orange sky, no long orange shadows, no golden-hour haze over everything, no night scene,
no dramatic contrast.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue
and no smooth decorative gradients. A fine even paper grain over the whole image.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat
tone with no modelling. A face carries only six things — its outline, eyes, eyebrows,
nose, mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes,
no nose-to-mouth lines, no blush. Eyes are simple dots or short lines.

COLOUR — Clear and lively, never dull: most colour blocks sit around HSL saturation 30-50
and lightness 70-85, and roughly half of the picture carries real colour rather than bare
paper. At least five distinct colours must be readable at thumbnail size, each assigned
to its own thing: pale grey-green plaster wall; muted terracotta brick panel; warm honey
wood door; a deep muted green (#3f654a) only as the single narrow band along the canopy
edge; the dentist's scrubs in pale sage (#bfd7b7 with #99b899 in the folds); the older
woman in muted dusty rose with warm grey trousers; the neighbour in soft powder blue; a
cool grey-blue road. Hair is very dark and warm-toned (#374840, shading to #283930, with
#404f47 highlights) — never flat pure black, never brown or auburn. Clothes are never
flat single-tone shapes: two or three tones each, with folds, collar, cuffs and hem drawn.
Colour throughout — never greyscale. Do not wash the whole picture into a single hue and
do not let the green take over the image.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGNBOARD ABOVE THE DOOR IS
COMPLETELY BLANK — a plain empty panel with no lettering, no symbol, no house number and
no clinic mark of any kind. The door glass, the window, the canopy, the shopping bag and
all clothing are blank as well. Where writing would normally appear, leave the surface
plain and empty.

AVOID — panels, split screens or a second scene; speech or thought bubbles; magnified
circular insets; arrows, icons or diagram lines; a long row of shopfronts; a crowded
street; more than three people; scooters, bicycles, parked cars, potted plants, bins,
utility boxes, hanging cables, banners or awnings other than the one plain canopy;
anything in the lower-left quarter of the image; teeth, tooth models, dental chairs,
instruments, X-rays or clinical equipment of any kind; masks; anyone looking at the
viewer; greyscale; photorealism; thick uniform black outlines; chrome or iridescent
gradients; faceless figures, oversized heads or noodle limbs; blood, pain or fear;
sunset or night lighting; a dull, muddy or washed-out picture.
```

---

## 生成之後要驗的四件（美編交付）

1. **縮到 250px 寬**看一眼：認不認得出「一間開著門的老房子診所」。認不出就是不合格。
2. **左下 46%×40%** 是不是真的空的（色牌要疊在那裡）。
3. 主體高度 ≥ 55%（門口那一帶量得出來）。
4. 四邊有沒有烘進去的白框（第七節第 6 條，`tools/hero-resize.mjs` 會擋）。
