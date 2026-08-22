# 分享圖提示詞：一般牙科・定期檢查（`og-topic-general`）

**狀態：第三版提案（還沒生成）。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十四節。

## 這一張要講的事

使用者 2026-08-22 指定的概念（他拿一張自己生成的巷弄立面圖當參考）：
**「診所跟診所的人跟整棟房子，在巷弄裡跟場景融在一起」** ——
對上那一頁的兩行：［老屋新生］永樂街的五十年老屋、［在地］四十多年不少人陪著走到現在。

---

## 三版的量測紀錄（每一版都用同一支腳本）

腳本：`drafts/og-measure.mjs`、`og-measure-ink.mjs`（Chromium canvas 讀像素，
方法同 ILLUSTRATION.md 第十之四節）。

| | 使用者的參考圖 | 第一版 | 第二版 | 門檻 |
| --- | --- | --- | --- | --- |
| 無彩空白（S<12 且 L>80） | 1.4% | 19.6% ❌ | **0.9%** ✅ | < 5% |
| 邊緣密度 | 41.1% | 19.3% ❌ | 25.0% ❌ | ≥ 30% |
| 每個人的線相差（最暗 5 百分位） | — | 99.5 階 ❌ | **10.8 階** ✅ | < 20 階 |
| 左半 vs 右半密度 | — | — | 11.5% vs 35.7% ❌ | 左半 ≥ 20% |
| 主要人物高佔畫面 | — | — | 47.3% ❌ | ≥ 75% |
| 250px 卡上，人的頭有多高 | — | — | 約 9~10px ❌ | ≥ 20px |

### 第一版錯在哪（三條通則，已入 ILLUSTRATION.md 第十一之一節）

使用者：「像鬼屋欸」「旁邊還有淡淡的人影像鬼魂」。三個成因全部逐字出自我寫的提示詞：

1. ⚠⚠ **次要角色絕不可以靠「畫淡」** ← `small and lightly drawn … paler colour`。
   次要只能靠**小、位置、被前景遮住**。
2. ⚠⚠ **「老」是結構老，不是表面爛** ← `visible repair patches and soft weathering`。
3. ⚠⚠ **「背景簡單」不等於「畫面空」** ← 為了守硬規格 5，把一整面淺灰牆放進左半。

### 第二版錯在哪（使用者 2026-08-22）

> 「氛圍好很多了……**留白太多**……人物的動作、病人來的那個樣子**太小了**，
> 　放在訊息縮圖上還要放大會模糊，還是要**再聚焦一點**。」

⚠⚠ **關鍵是：這不是「把人畫大一點」，是「把鏡頭推進去」。**
第二版的人其實已經佔了畫面高的 47%，但**整組門口只佔畫面寬的 36%**，
左邊 44% 是一片密度只有右邊三分之一的牆與路。縮到 250px 之後臉只剩 9 個像素 ——
**原檔就沒有那麼多像素在臉上，放大當然糊。**
所以第三版把那片空牆**裁掉**，人從頭到膝入鏡，頭放大到畫面高的六分之一。

---

## 第三版相對第二版改了什麼

1. **鏡頭推近一大步**：屋簷、二樓、左邊那片牆全部裁出畫面外，門口那一組**填滿畫面**。
2. **人從頭到膝入鏡**，身高約畫面高的 85%，**頭 ≈ 畫面高的 1/6**
   （250px 卡上約 22px，第二版是 9.6px，**放大 2.3 倍**）。
3. **二樓窗口那位鄰居拿掉** —— 這個鏡頭放不下，強留只會又變成小人。剩三個人。
4. **左下那塊安靜區改成「婦人的背影＋掃過的地面」**（硬規格 8 本來就允許
   「大面積的衣服」），不再是空牆。⚠ 色牌會疊在她的背與地面上，
   **合成之後要用 250px 再看一次**。
5. **老屋、乾淨、同一種線、暖光門口、無字**這幾條**逐字保留**（第二版驗證過的東西不要動 ——
   ILLUSTRATION.md 第七節第 19 條：改圖只換出問題的那一段）。

> ⚠ 生成時**把第二版那張圖一起附上當風格參考**，並註明：
> 「**保留這張的畫風、乾淨程度、配色與光線**，只把鏡頭推近、人物放大。」

## 提示詞（逐字，可直接複製）

```
Editorial illustration for a small social-media preview card, 1200 x 628 landscape
(1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Everything in it must still be readable at that size, so the
picture is CLOSE UP and TIGHTLY FRAMED: three people meeting at a doorway, drawn LARGE.
ONE single scene, ONE focal point. Do NOT divide the image into panels. No speech
bubbles, no insets, no icons, no arrows, no diagrams.

THE MOMENT — An older woman arrives at her neighbourhood dental clinic and is met at the
open door by the dentist, who is greeting her and welcoming her in. A second clinic
member stands a step inside the lit doorway. It is an ordinary, friendly afternoon on a
quiet lane in a small town in central Taiwan.

FRAMING — CLOSE. We stand only a few steps away. The OPEN WOODEN DOUBLE DOOR and its
brick surround fill the RIGHT-HAND 60% of the picture and run from the top edge to the
bottom edge; the canopy, the upper storey and the rest of the street are OUTSIDE the
frame. On the left edge we see only a narrow slice of the building — one clean plaster
wall, one large potted plant and the swept pavement. There is NO wide empty wall, NO
distant view, NO sky.

THE PEOPLE — exactly THREE, all East Asian (Taiwanese), drawn BIG:
  • The OLDER WOMAN, in her sixties, arriving. She stands in the LEFT-CENTRE of the
    picture, seen from three-quarters BEHIND, so we read her back, her shoulder and the
    side of her cheek but not her full face. A cloth shopping bag hangs from the hand
    furthest from us. She is stepping towards the door, her near shoulder turned into it.
  • The DENTIST in pale sage-green scrubs stands in the doorway facing her, body open and
    turned towards her, one hand on the door edge and the other extended in a small
    welcoming gesture towards the woman, palm up, at about waist height. She is looking
    at the woman, smiling with her mouth closed. She stands in the warm light of the
    doorway.
  • A CLINIC ASSISTANT in the same pale sage-green, one step further inside the doorway,
    half hidden behind the other door leaf, also turned towards the woman. Smaller only
    because she is further away.
SIZE — the woman and the dentist are drawn from the HEAD DOWN TO JUST BELOW THE KNEE,
cropped by the bottom edge of the picture. Standing, each of them fills about 85% of the
picture height, and EACH HEAD IS ABOUT ONE SIXTH OF THE PICTURE HEIGHT — big enough for
the face to read clearly in a small thumbnail. The two of them, plus the space of the
doorway between them, take up at least two thirds of the width of the picture.
EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR. A figure further away is made secondary ONLY by being smaller or
partly overlapped — NEVER by pale, thin, faint, washed-out, semi-transparent or
outline-only drawing. No figure may look like a ghost, a reflection or an unfinished
sketch.
Nobody wears a mask, nobody holds any dental instrument, nobody looks at the viewer.

THE BUILDING — old but IMMACULATELY KEPT: recently renovated, freshly painted, swept and
cared for. Old means the SHAPE is old — a low terraced townhouse with wide wooden doors
and neat terracotta brickwork framing them. Old must NEVER mean shabby: absolutely no
peeling paint, no flaking or patched plaster, no cracks, no water stains, no mould, no
rust, no litter, no gloom. Nothing may look derelict, abandoned or haunted. Above the
door, cropped by the top edge, there is a BLANK signboard. The brickwork is crisp and in
good order; the plaster is smooth and evenly painted warm cream.

WHAT ELSE IS IN THE PICTURE — very little, and all of it large: ONE healthy potted plant
at the left, ONE low wooden stool beside the door, and the warm pool of light on the
pavement. Nothing else — no posters, no meter boxes, no hanging cables, no bins, no
banners, no signage, no bicycles, no cars, no crowd.

KEEP THE LOWER LEFT QUIET — the rectangle covering the LEFT 46% of the width and the
BOTTOM 40% of the height must stay calm and uncluttered: it holds only the older woman's
back and coat as one large soft area of colour, and the swept pavement beside her. No
face, no hands, no small objects, no busy detail and no hard edges in that rectangle.
Quiet does NOT mean empty or colourless — the coat and the ground both carry warm colour
and gentle shading.

FILL THE FRAME — the picture must NOT look empty. Every part of it carries something
large: the two big figures, the open door and its warm interior light, the brick
surround, the plant, the pavement. No large flat blank field anywhere; no single area of
one flat colour may take up more than about a tenth of the picture.

ATMOSPHERE LINES — two or three LONG soft white hand-drawn arcs drift across the upper
corner of the picture only, chalk-like, thinning to dry flecks at their ends. They never
touch or emerge from any person's mouth, nose, hands or body, and never loop or cross.

LIGHT — Clean, bright mid-afternoon daylight, gentle and even, with soft shadows. The ONE
warm light in the picture is the glow coming out of the open doorway, falling on the
dentist and pooling on the pavement between the two women. NOT a sunset, no orange sky,
no long orange shadows, no night scene, no dramatic contrast, no gloom.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue,
no smooth decorative gradients. A fine even paper grain over the whole image.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat tone
with no modelling. A face carries only six things — its outline, eyes, eyebrows, nose,
mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes, no
nose-to-mouth lines, no blush. Eyes are simple dots or short lines. Because the faces are
large here, keep them SIMPLE — do not add extra detail just because there is room.

COLOUR — Clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture
carries real colour rather than bare paper. At least six distinct colours must be
readable at thumbnail size, each assigned to its own thing: warm cream plaster; muted
terracotta brick; warm honey wood doors and stool; the dentist's and the assistant's
scrubs in pale sage (#bfd7b7 with #99b899 in the folds); the older woman in muted dusty
rose with warm grey trousers; deep green foliage in the pot; a warm grey pavement; the
warm amber glow inside the doorway. Hair is very dark and warm-toned (#374840, shading to
#283930, with #404f47 highlights) — never flat pure black, never brown or auburn. Clothes
are never flat single-tone shapes: two or three tones each, with folds, collar, cuffs and
hem drawn. Colour throughout — never greyscale, never a chilly blue-grey cast, and no
large area left as bare neutral pale.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGNBOARD ABOVE THE DOOR IS
COMPLETELY BLANK — a plain empty panel with no lettering, no symbol, no house number and
no clinic mark of any kind. The door glass, the shopping bag and all clothing are blank
as well. Where writing would normally appear, leave the surface plain and empty.

AVOID — a wide or distant view; small figures; empty walls, empty pavement or empty sky
taking up a large part of the picture; a faded, pale, translucent, ghostly or
outline-only figure; any person drawn with lighter or thinner lines than the others;
peeling or flaking paint, patched or cracked plaster, water stains, damp, mould, rust,
cobwebs, litter, weeds; a derelict, abandoned, eerie or melancholy atmosphere; a thin or
washed-out picture; panels or split screens; speech bubbles; magnified circular insets;
arrows, icons or diagram lines; a crowded street; more than three people; anything busy
in the lower-left quarter of the image; teeth, tooth models, dental chairs, instruments,
X-rays or clinical equipment of any kind; masks; anyone looking at the viewer; greyscale;
photorealism; thick uniform black outlines; chrome or iridescent gradients; faceless
figures, oversized heads or noodle limbs; blood, pain or fear; sunset or night lighting.
```

---

## 色牌（後製疊上去，不畫進圖裡）

左下角：`#3f654a` 的牌子，兩行 —— 「一般牙科・定期檢查」（大）／標誌＋「芳仁牙醫診所」（小）。
⚠ 九個字是七科裡最長的，版面要先用它試（第十一節）。
⚠ 第三版的左下角是婦人的背影，**色牌合成之後一定要用 250px 再看一次**。

## 管線

原檔（≥1200 寬）放 `drafts/og-topic-general-src.png`，用 `tools/hero-resize.mjs` 的
同一條 Chromium 路徑產出 `assets/og-topic-general.jpg`，畫布 **1200×628**
（不是文章 HERO 的 2000×1116）；`tools/topics.mjs` 的 `seoBlock` 補上
`og:image`／`:width`／`:height`／`:alt`，同時**刪掉 `index.html` 手寫的那組 `og:image*`**
（重複的 og 屬性爬蟲取第一個，不刪的話七頁還是顯示首頁那張夜景）。

## 交件前要過的門檻（插畫師自己跑，不過就不拿出來）

| | 門檻 | 第二版 |
| --- | --- | --- |
| 無彩空白 | < 5% | 0.9% ✅ |
| 邊緣密度 | ≥ 30% | 25.0% ❌ |
| 每個人的線相差 | < 20 階 | 10.8 ✅ |
| 左半密度 | ≥ 20% | 11.5% ❌ |
| 主要人物高佔畫面 | ≥ 75% | 47.3% ❌ |
| 250px 卡上頭的高度 | ≥ 20px | 9.6px ❌ |

另外還要看：四邊有沒有烘進去的白框（ILLUSTRATION.md 第七節第 6 條，
`tools/hero-resize.mjs` 會自動擋）、色牌疊上去之後左下角讀不讀得下去。
