# 分享圖提示詞：一般牙科・定期檢查（`og-topic-general`）

**狀態：第二版。第一版生出來被使用者退回（「像鬼屋」「旁邊還有淡淡的人影像鬼魂」）。**

## ⚠⚠ 第一版錯在哪（2026-08-22，量出來的）

使用者的參考圖 vs 第一版生成圖，同一支腳本（Chromium canvas 讀像素）：

| | 參考圖 | 第一版 |
| --- | --- | --- |
| 近乎無彩的空白（S<12 且 L>80）佔畫面 | **1.4%** | **19.6%** |
| 邊緣密度（線與細節） | **41.1%** | **19.3%** |
| 整體明度 L（去掉線稿與紙白） | 57.6 | 78.4 |
| 那個鄰居的線有多實（框內最暗 5 百分位） | — | **145.7**（同圖婦人 46.2／醫師 46.4） |

**三個成因，全部逐字出自我寫的提示詞：**

1. **鬼魂** ← `small and lightly drawn … Fewer lines, paler colour, clearly secondary`。
   「次要」我寫成了「淡」。⚠⚠ **通則：次要靠大小、位置、遮擋來做，絕對不要靠降低線的實度。**
   一張圖裡所有人必須用同一種線、同一個實度，否則模型會畫成半透明。
2. **鬼屋** ← `old but well kept, with visible repair patches and soft weathering`。
   使用者的「老屋新生」是**結構老、表面乾淨**（他的參考圖裡牆面平整、紅磚整齊），
   我卻把「老」翻成了斑駁、修補痕、風化。⚠⚠ **「老屋」在這個站永遠不等於「斑駁」。**
3. **空** ← 我為了守 250px 的「背景最多兩個色塊」，把一整面淺灰牆放進畫面左半，
   結果五分之一畫面是無彩空白，密度掉到參考圖的一半。
   ⚠ **硬規格 5「背景簡單」不等於「畫面空」** —— 簡單要靠**元素少但大**，
   不是靠留出大片什麼都沒有的牆。左下那塊安靜區要是**路面**（有暖色、有影子），
   不要是一面空牆。

第一版原文若要回看：`git show <這個檔的上一個 commit>:drafts/og-topic-general-prompt.md`。

---

**（以下為第二版）**
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
| 二十幾個人、一樣大 | **四個人**（門口三位 ＋ 二樓窗口揮手那位），視覺中心是亮著的門口；**四個人的線一樣實** | 硬規格 4 ＋ 第一版的鬼魂教訓 |
| 招牌、電表、海報、盆栽、四台機車 | 只留**剛好三樣**（兩盆植物、一台靠牆機車、一張矮凳），招牌空白 | 硬規格 5（刻意放寬，理由見下） |
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

## 第二版相對第一版改了什麼（對照上面那三個成因）

1. **鄰居不再是「淡的」** —— 整張圖所有人同一種線、同一個實度，AVOID 直接點名
   半透明／鬼影／只有輪廓。右緣那個站著揮手的鄰居**整個拿掉**（他就是鬼魂那一位），
   換成**二樓窗口探出來揮手的鄰居** —— 那是使用者參考圖裡的元素，位置高、不搶門口。
2. **老屋改成乾淨的** —— 牆面平整、重新粉刷過、紅磚整齊、騎樓掃過；
   「老」只留在**結構與比例**（連棟街屋、雨庇、木門、二樓鐵窗），
   AVOID 逐項擋掉剝落、水漬、裂縫、補丁、鏽、荒廢感。
3. **密度補回來** —— 右三分之二做滿（門口、磚柱、雨庇、二樓窗、四個人、三樣道具），
   ⚠ **刻意放寬硬規格 5 的「不畫道具」**：允許**剛好三樣**（兩盆植物、一台靠牆的機車、
   門邊一張矮凳），理由是第一版量到密度只有參考圖的一半、19.6% 是空白。
   **三樣是上限，寫死在提示詞裡**，超過就會回到「人多沒有視覺中心」那個死法。
4. **左下那塊安靜區改成路面不是空牆**（有暖灰、有一道長影），
   並要求無彩空白面積壓到 5% 以下、淺灰牆不得超過畫面六分之一。
5. **叫模型吃參考圖** —— 生成時把使用者那張巷弄圖一起附上，
   註明只參考**乾淨程度、密度與氛圍**，不是構圖（第十之一節：形狀給圖不給字）。

## 提示詞（逐字，可直接複製）

> ⚠ 生成時**把使用者那張巷弄立面的參考圖一起附上**，並在對話裡註明：
> 「參考這張的**乾淨程度、線的實度、生活密度與氛圍**，不要參考它的構圖與人數。」

```
Editorial illustration for a small social-media preview card, 1200 x 628 landscape
(1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Everything in it must still be readable at that size. ONE
single scene, ONE focal point, big simple shapes. Do NOT divide the image into panels.
No speech bubbles, no thought bubbles, no circular close-ups or insets, no small icons,
no arrows, no diagrams.

THE MOOD, ABOVE EVERYTHING — a warm, tidy, cared-for neighbourhood at a friendly moment.
This building is OLD BUT IMMACULATELY KEPT: recently renovated, freshly painted, swept
and looked after by people who are proud of it. Old means the SHAPE is old — a low
terraced townhouse, a deep canopy, wooden doors, a metal window grille upstairs. Old must
NEVER mean shabby: absolutely no peeling paint, no flaking or patched plaster, no cracks,
no water stains, no mould, no rust, no boarded windows, no litter, no weeds, no gloom.
Nothing in this picture may look derelict, abandoned, haunted or sad.

THE SCENE — A quiet residential lane in a small town in central Taiwan, mid-afternoon. We
look at the ground-floor frontage of a fifty-year-old two-storey terraced townhouse that
has been renovated and is now a small neighbourhood dental clinic, with the family's home
above it. We see ONE BAY of that frontage — its doorway, one ground-floor window and one
upper-storey window — not a long row of shops.

THE BUILDING IS THE MAIN SUBJECT and it fills the picture: the frontage occupies the
RIGHT-HAND 62% of the width and the FULL height of the image, and its deep canopy runs
right across the top edge, so the upper-left corner is the underside of that canopy and
the top of the wall rather than empty sky. The wall is smooth, evenly painted warm cream
plaster, clean and unbroken, with one panel of neat terracotta brickwork framing the
door; every brick is crisp and in good order. On the frontage there are: a WIDE WOODEN
DOUBLE DOOR standing open, one ground-floor window with a simple frame and a clean plain
curtain, a slim canopy with a single narrow deep-green painted band along its edge, one
upper-storey window standing open with a simple metal grille, and a BLANK signboard above
the door.

EXACTLY THREE OBJECTS stand along the frontage, and nothing else: TWO healthy potted
plants flanking the doorway, ONE scooter parked neatly against the wall at the right-hand
edge of the picture, and ONE low wooden stool beside the door. No posters, no meter
boxes, no hanging cables, no bins, no banners, no menu boards, no bicycles, no cars.

THE FOCAL POINT is the OPEN DOORWAY. Warm light spills out of it onto the pavement,
making it the brightest and warmest area in the picture. The doorway sits at roughly the
horizontal centre-right of the image.

THE PEOPLE — exactly FOUR people, all East Asian (Taiwanese), calm and ordinary:
  • A DENTIST in pale sage-green scrubs stands just outside the open door, one hand
    resting on the door frame, body angled towards the street, head turned slightly down
    towards the woman walking up. Relaxed, quietly friendly, mouth in a soft closed
    smile. She stands within the doorway's warm light and is the largest figure.
  • An OLDER WOMAN in her sixties walks towards the door from the left, seen from
    three-quarters behind and to one side, carrying a cloth shopping bag in the hand
    furthest from the viewer. Her shoulders are relaxed; she is arriving, not hurrying.
    She overlaps the edge of the warm light so the two of them plainly share one moment.
  • A CLINIC ASSISTANT in the same pale sage-green, standing a step inside the lit
    doorway, half framed by the door, turned towards the older woman.
  • A NEIGHBOUR leaning out of the OPEN UPPER-STOREY WINDOW, both forearms on the sill,
    one hand raised in a small friendly wave towards the doorway below.
EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR AS EVERY OTHER PERSON AND AS THE BUILDING. Figures further away
are made secondary ONLY by being smaller and partly overlapped — NEVER by pale, thin,
faint, washed-out, semi-transparent or outline-only drawing. No figure may look like a
ghost, a reflection, a watermark or an unfinished sketch.
Nobody is a patient in a chair, nobody wears a mask, nobody holds any dental instrument,
nobody looks at the viewer, and nobody stands in the lower-left area of the picture. They
read as neighbours and the clinic's own people sharing one ordinary street, not as staff
posing for a photograph.

KEEP THE LOWER LEFT QUIET — the rectangle covering the LEFT 46% of the width and the
BOTTOM 40% of the height is the swept road and pavement of the lane: a calm warm grey
surface in two or three tones, crossed by one long soft shadow, with no face, no hand, no
figure, no object and no hard edge in it. Quiet does NOT mean empty or colourless: this
area still carries warm colour and a visible surface, and the wall above it is the same
clean cream plaster, never a large flat blank field.

FILL THE FRAME — the picture must NOT look empty. Apart from that quiet lower-left
rectangle, every part of the image carries something: the canopy and its shadow across
the top, the brick and plaster of the frontage, the two windows, the plants, the scooter,
the stool, the four people, the warm pool of light on the pavement. No large area of bare
flat pale grey or bare white anywhere; the plain plaster wall must not take up more than
about one sixth of the picture.

ATMOSPHERE LINES — two or three LONG, soft, white hand-drawn arcs sweep across the upper
part of the picture, above and along the canopy, chalk-like, thinning to dry flecks at
their ends, suggesting a light breeze along the lane. They never touch or emerge from any
person's mouth, nose, hands or body; they never loop, close or cross each other.

LIGHT — Clean, bright mid-afternoon daylight, gentle and even, with soft shadows. The ONE
warm light in the picture is the glow coming out of the open doorway, pooling on the
pavement just outside it. NOT a sunset, no orange sky, no long orange shadows, no
golden-hour haze over everything, no night scene, no dramatic contrast, no gloom.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue
and no smooth decorative gradients. A fine even paper grain over the whole image.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat
tone with no modelling. A face carries only six things — its outline, eyes, eyebrows,
nose, mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes,
no nose-to-mouth lines, no blush. Eyes are simple dots or short lines.

COLOUR — Clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture
carries real colour rather than bare paper. At least six distinct colours must be
readable at thumbnail size, each assigned to its own thing: warm cream plaster wall;
muted terracotta brick; warm honey wood door and stool; a deep muted green (#3f654a) only
as the single narrow band along the canopy edge; the dentist's and the assistant's scrubs
in pale sage (#bfd7b7 with #99b899 in the folds); the older woman in muted dusty rose
with warm grey trousers; the neighbour at the window in soft powder blue; deep green
foliage in the two pots; a warm grey lane. Hair is very dark and warm-toned (#374840,
shading to #283930, with #404f47 highlights) — never flat pure black, never brown or
auburn. Clothes are never flat single-tone shapes: two or three tones each, with folds,
collar, cuffs and hem drawn. Colour throughout — never greyscale, never a chilly blue-grey
cast over the whole picture, and no large area left as bare neutral pale. Do not wash the
picture into a single hue and do not let the green take over.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGNBOARD ABOVE THE DOOR IS
COMPLETELY BLANK — a plain empty panel with no lettering, no symbol, no house number and
no clinic mark of any kind. The door glass, the window, the canopy, the shopping bag and
all clothing are blank as well. Where writing would normally appear, leave the surface
plain and empty.

AVOID — a faded, pale, translucent, ghostly, outline-only or half-finished figure; any
person drawn with lighter or thinner lines than the others; peeling or flaking paint,
patched or cracked plaster, water stains, damp, mould, rust, cobwebs, boarded or broken
windows, litter, weeds; a derelict, abandoned, haunted, eerie or melancholy atmosphere;
large empty areas of flat pale grey or white; a thin, faint or washed-out picture; panels,
split screens or a second scene; speech or thought bubbles; magnified circular insets;
arrows, icons or diagram lines; a long row of shopfronts; a crowded street; more than four
people; more than the three named objects along the frontage; bins, utility boxes, hanging
cables, banners; anything in the lower-left quarter of the image; teeth, tooth models,
dental chairs, instruments, X-rays or clinical equipment of any kind; masks; anyone
looking at the viewer; greyscale; photorealism; thick uniform black outlines; chrome or
iridescent gradients; faceless figures, oversized heads or noodle limbs; blood, pain or
fear; sunset or night lighting.
```

---

## 生成之後要驗的六件（美編交付，前三件是量的不是看的）

量法：`scratchpad/measure.mjs`／`measure2.mjs` 那一支（Chromium canvas 讀像素，
同 ILLUSTRATION.md 第十之四節）。**第一版就是靠這三個數字才講得清楚哪裡錯。**

1. **無彩空白**（S<12 且 L>80）**< 5%**。第一版 19.6%、參考圖 1.4%。
2. **邊緣密度 ≥ 30%**。第一版 19.3%、參考圖 41.1%。
3. **每個人的線一樣實**：各框最暗 5 百分位彼此**相差 < 20 階**。
   第一版婦人 46.2／醫師 46.4／鄰居 **145.7** ← 那一位就是鬼魂。
4. **縮到 250px 寬**看一眼：認不認得出「一間開著門、有人在門口的診所」。
5. **左下 46%×40%** 沒有臉、手、道具、硬邊（色牌要疊在那裡）。
6. 四邊有沒有烘進去的白框（第七節第 6 條，`tools/hero-resize.mjs` 會擋）。
