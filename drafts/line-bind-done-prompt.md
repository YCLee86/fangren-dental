# 綁定完成圖卡的頭圖：〈創造亞當〉的診間版

2026-09-03。使用者看過六案的提案頁（`/preview/line-bind-done/`）之後說：

> 這裡也可以來一張圖卡。我想到米開朗基羅的創造亞當，有一張可愛的版本參考。
> 我覺得可以是病患或民眾坐在診療椅上，背景夢幻一點，然後穿著刷手服加白袍的
> 醫療人員伸出手要跟診療椅上的人做出連結手勢。你們做提示詞，我放到 Gemini 上生成。
> 插圖的風格就跟現在網站上文章一樣，手繪、有動感、生命感。

**第一版（`drafts/bind-done-v1-rejected.jpg`）被退回**，第二版的提示詞在第四節。
第一版那份逐字留在最後的「附」（第 19 條：改圖要從上一份改，不要從零重寫）。

---

## 一、⚠⚠⚠ 第一版被退回：三句抱怨是**同一個成因**

使用者的原話：

> 我是覺得這個感覺有點奇怪，少了神話中的那個寓意。而且我傳的 Q 版不但有寓意還有
> 可愛的趣味。**在診間出現這個動作會讓人懷疑醫病關係不單純。**

三句話，一個成因：**我上一輪刻意把「上帝在上、亞當在下」抹平成兩人等高**
（理由寫在當時的第三節：品牌是「一起想辦法」「不搶戲」）。那個決定同時做掉兩件事：

| 抹平之後 | 為什麼 |
| --- | --- |
| **寓意沒了** | 那張名畫的梗**就是**它的不對稱：神那一側是一群人、乘著紅斗篷飄在空中、主動；亞當在地上、被動、手是垂的。**對稱之後就只是兩個人在對指**，沒有人在給、也沒有人在接 —— 梗的載體被我拆掉了 |
| **長出親密感** | 剩下的畫面是「兩個成年人，單獨在密室裡，同高、側面對坐、互相看、中間發光」—— 那是**戀愛場面的視覺語法**。在診間就變成他說的「醫病關係不單純」 |
| **不好笑** | Q 版好笑是因為它**照抄了那個不對稱**，只把神換成「懷裡塞了一堆娃娃的媽媽」。趣味來自**那一團**，不是來自手勢 |

> ⚠⚠⚠ **通則（借名畫的梗都適用，值得記住）：名畫的梗來自它的構圖關係，
> 而那個關係常常就是不對等。為了品牌把不對等抹平，等於把梗拆了；
> 而且「兩個人、對稱、發光」幾乎一定會滑進親密的讀法。
> 要調的是「誰站在強的那一側」，不是「把兩側拉平」。**

### 所以第二版怎麼解（三個動作，都是從 Q 版學的）

1. **診所那一側改成一群人**（五六個擠成一團）—— 一對一才會有親密感，**一群人就是喜劇**。
   而且那正是原作「神＋一群天使」的位置，寓意跟著回來。
2. **紅斗篷換成一件鼓起來的大白袍**，整團人包在裡面、微微浮在半空。
   那是全畫最好認的形狀 —— **觀眾第一眼就把它讀成「在玩那張名畫」**，
   所以不會讀成兩個人之間的事。
3. **給的方向留著**：病患的手像亞當一樣**鬆垮垮**地伸著（他不必做什麼，
   正好對上這一則訊息「提醒交給這裡」），診所那隻手是**有意志**地伸過去。
   兩邊都看手、**不對看**。

⚠ **診所變成「神」那一側會不會太自大？** 靠喜劇解掉：那一團是**擠到快掉出來**的同事
（有人舉牙刷當火把、有人只露出頭頂、有人半個身體掛在別人肩上），
讀起來是「這間診所人很多、很熱鬧」，不是「診所是神」。**不搶戲靠的是好笑，不是縮小。**

⚠ **火花改成一顆會發光的小牙齒** —— 原作遞出去的是「生命」，這裡遞出去的是
診所真正給得出的那件小事。它同時是寓意也是診所的東西，比一撮抽象的線好讀。

## 二、規格（沒有變）

| | |
| --- | --- |
| 用在哪 | Ⓑ 圖卡那一案的 Flex `hero`（`/preview/line-bind-done/?v=b`） |
| 成品尺寸 | **1040×520（2:1）**，和招呼圖卡的頭圖同一個規格 |
| 生成尺寸 | ⚠ **請 Gemini 出 16:9**（2:1 不在它的選項裡），之後上下各裁約 6% |
| 圖上有字嗎 | **沒有。** 卡片上的字是 Flex 的真文字 —— 整張圖不可以有任何文字 |
| accent | 一般牙科那一支綠，由**鼠尾草綠的刷手服**與背景那片淡薄荷承接。⚠ 提示詞裡不要寫 HEX（第十之二節：色值和形容詞打架時模型跟形容詞） |

## 三、⚠ 風格換了一條路，這是要知道的取捨

使用者這一輪給的三張參考（國泰產險兩張、Gransta 一張）是**平面線條風**：
細而均勻的深線、完全平塗不上陰影、白圓臉配兩顆小圓點眼、背景物件只用細灰線不填色、
背後幾個大淡色圓形、旁邊飄小圖示。**第二版的提示詞就是照這一路寫的。**

⚠⚠ **代價：它和站上十一張文章 HERO、七張分享圖那一套「色鉛筆＋顆粒」不是同一個風格。**
這張圖會出現在 LINE 上、和招呼圖卡（真實街景照）排在一起，所以它不會和站上並排比對 ——
但那個帳號從此有兩種畫風。**要不要維持站上那一套，是你的一句話**：
要的話我把 `STYLE` 與 `COLOUR` 兩段換成站上的寫法，構圖與那一團人完全不動。

### 參考圖要附哪幾張（**分兩組，一組只講一件事**）

| 組 | 檔案 | 只提供這一件 | 要跟 Gemini 說的話 |
| --- | --- | --- | --- |
| **A・畫風** | `drafts/bind-done-ref-flat-1.jpg`、`drafts/bind-done-ref-flat-2.jpg` | 線的粗細、平塗、極簡的臉、誇張的動作、飄在旁邊的小圖示 | 「**線條、上色與人物畫法照這兩張**，題材不要參考」 |
| **B・構圖** | `drafts/bind-done-ref-adam-gesture.jpg` | **只有「一邊一個人躺著、一邊一團人飄著、中間兩指快要碰到」那個關係** | 「**只參考構圖與那個手勢**，水墨筆觸、娃娃造型、顏色一律不要」 |

⚠⚠ **使用者給的第三張（Gransta 那張多格海報）沒有裁成參考圖**：它是**放射狀拼版**，
每一格的角度都不一樣，整張轉 0／90／180／270 都會有人是躺著的 —— 餵進去等於教模型
畫歪掉的身體；而且格子裡還有 MENU／OK!／COFFEE 的字。
**它的優點改成寫進提示詞的文字**（白圓臉＋小圓點眼＋一條小嘴、背景物件只用細灰線
不上色、平塗淡彩）。原檔留在 `drafts/bind-done-src-flat-3.jpg`。

⚠ 三張原檔都是滿滿的中文／日文，`drafts/bind-done-refs2-crop.mjs` 已經把介面、標題、
按鈕與招牌全裁掉 —— **截圖裡的字會被模型抄進畫面**（ILLUSTRATION.md 第七節第 4 條的反面）。

## 四、提示詞・第二版（逐字複製給 Gemini）

```
Cute flat-colour illustration, 16:9 landscape. A warm, funny parody of Michelangelo's
"The Creation of Adam", set in a dental clinic.

READ THIS FIRST — STYLE. This is the most important section; keep it fully in force no
matter how long the rest of this brief is. Clean FLAT illustration in the style of a modern
Taiwanese or Japanese brand illustration. Every outline is a THIN, EVEN-WEIGHT dark
grey-brown line — never pure black, never thick, never varying in weight. All colour is
FLAT: no shading, no gradients, no texture, no highlights anywhere. Faces and hands are
left plain paper white with no shading at all. The characters are CUTE and simple: a simple
round white face, two small round dot eyes, one tiny curved line for a smile, a small oval
pink cheek on each side, and no nose (or a single tiny dot); hair is one flat shape drawn
with two or three loose loops. Bodies are simplified, arms and legs are simple rounded
tubes, and hands are simple soft mitten shapes with the fingers clearly separated. Poses
are exaggerated and full of movement. Behind everything, three or four LARGE PALE FLAT
CIRCLES (pale mint, cream, soft butter yellow) as decoration, plus small floating
decorative marks: four-pointed sparkles and tiny short motion arcs. Cheerful, friendly,
humorous — never slick, never corporate, never serious.

THE JOKE — Anyone who knows the painting must recognise it at a glance: a figure lying back
and reaching out on the left, an airborne crowd wrapped in a billowing cloak on the right,
and the famous gap between two index fingers in the middle. It is affectionate and silly,
not grand and not religious.

COMPOSITION — THE TWO SIDES ARE DELIBERATELY UNEQUAL, exactly as in the painting. On the
LEFT, ONE single figure, low and earthbound, lying back, relaxed and passive, filling the
lower left. On the RIGHT, a WHOLE CROWD of clinic staff bundled together, FLOATING a little
above the floor, clearly higher than him, tilted forward towards him, active and
purposeful. The two index fingers almost meet at the centre of the frame, a little above
the middle — but the two BODIES stay far apart, with a clear open area of plain pale
background between them, about two head-widths wide. Never symmetrical, never mirrored, and
never the same height.

LEFT — THE PATIENT (the Adam of this picture) — An East Asian man in his late thirties in
his own everyday clothes: a dusty rose crew-neck jumper and warm grey trousers, no hospital
gown and no paper bib. He lies back in a dental chair that is reclined about thirty degrees,
propped up on his far elbow exactly like Adam in the painting: shoulders back, chest open,
his near knee raised and relaxed. HIS REACHING ARM IS LIMP AND HEAVY like Adam's — the
elbow resting on his raised knee, the wrist dropped, the fingers loose, the index finger
only lazily extended. He is not straining and not sitting up. He has just woken up: eyes
half open, a small dopey smile, mouth slightly open. One slipper dangles off his foot,
about to fall. He looks at the approaching hand, never at us.

RIGHT — THE CLINIC CROWD (the crowd that takes God's place) — FIVE OR SIX clinic staff
crammed into ONE BUNDLE, all East Asian, mixed ages and both sexes, all in pale sage-green
scrubs, piled onto and around each other exactly the way the angels are piled around God:
heads at different heights, shoulders overlapping, arms sticking out at odd angles. At the
front of the bundle is the dentist — a woman of about forty with a short bob, wearing an
open white coat over her scrubs — leaning right out of the bundle with her arm stretched
towards the patient. Around and behind her, all clearly visible: one holds a big toothbrush
up in the air like a torch; one holds up a small round hand mirror; one hugs a rinse cup
with both arms; one is squeezed in at the back so only the top of the head and two eyes
show; one has slipped half out of the bundle and hangs onto a colleague's shoulder with
both hands, feet in the air. They are enjoying themselves — this must be FUNNY and WARM, a
happy crowd of colleagues, never grand, never solemn, never divine. They look at the
patient or at each other, in several different directions, never at us.

THE BILLOWING WHITE COAT — The whole crowd is wrapped in ONE ENORMOUS BILLOWING WHITE
DOCTOR'S COAT which takes the exact place of the red cloak in the painting: it swells out
behind and around them in one big soft rounded shape, and its hem flies out to the right in
two or three long waving folds. It is unmistakably a doctor's white coat — a collar,
lapels, one big patch pocket, and a fabric belt fluttering loose. Behind it, ONE flat pale
mint oval, a little larger than the coat, as a simple background shape — flat colour only,
no glow, no rays, no ring, no halo.

THE TWO HANDS — The dentist's arm reaches out with intent: arm straight, wrist firm, index
finger pointing precisely at his. The patient's hand stays limp. THE FINGERTIPS DO NOT
TOUCH: leave a small clear gap between them, about the width of one finger. Draw both hands
simply and correctly — five fingers on each hand, no fused, extra or missing fingers.

THE LITTLE TOOTH BETWEEN THEM — In the gap between the two fingertips floats a TINY CUTE
TOOTH: a small simple cartoon tooth shape, plain white with the same thin outline, with no
face on it, about the size of the man's thumb. Four or five SHORT STRAIGHT sparkle lines
radiate from it and three or four small four-pointed stars sit around it. It reads as one
small good thing being handed over. KEEP IT SMALL — the whole marking is no bigger than the
man's head. It must not look like lightning, an explosion, a lens flare or a starburst.

BACKGROUND — The clinic behind them is drawn ONLY as THIN PALE GREY OUTLINES WITH NO FILL,
so it sits quietly behind the characters: a low counter, a cabinet, a shelf holding a
transparent tooth model, a potted plant, and the articulated arm of the overhead treatment
lamp coming in from the top right with its round head switched off. The floor is suggested
with one thin line. The ground of the whole picture is plain pale cream paper. The dental
chair is the one piece of furniture drawn in full flat colour — muted slate blue, with a
padded headrest, a padded back, an armrest and a slim base — so that the room reads
immediately as a dental clinic.

COLOUR — Flat, cheerful and restrained. Pale cream paper as the ground. PALE SAGE GREEN is
the accent colour of the picture: all the scrubs, and the pale mint oval behind the coat.
The white coat and the faces are white. The patient wears dusty rose and warm grey, clearly
a different colour family from the staff, so the two sides read apart at a glance. The
chair is muted slate blue. Background circles in pale mint, cream and soft butter yellow.
Small pink cheeks on every face. No dark or heavy areas, no black fills, no neon, never
greyscale.

CROP SAFETY — This image will be cropped to a 2:1 letterbox by cutting an equal strip from
the top and from the bottom, about 6% of the height each. Everything that matters — both
fingertips and the little tooth between them, the patient's face, the dentist's face, the
whole bundle of staff and the chair's headrest — must sit comfortably inside the central
horizontal band, well away from the top and bottom edges. Put nothing essential in the top
sixth or the bottom sixth of the frame.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions, labels or watermarks, in any language. The white coat and its pocket
carry no embroidery, no name badge and no writing; the scrubs are blank; the rinse cup, the
mirror handle and the toothbrush are blank; every bottle, tube and box is blank; there is no
poster or screen with writing on it; the chair carries no branding. Wherever writing would
normally appear, leave the surface plain.

AVOID — photorealism; the Renaissance fresco or oil-painting look; ink-wash or sumi-e brush
style; coloured-pencil or crayon texture; shading, gradients, hatching or paper texture
inside the flat colours; thick or uneven black outlines; chubby naked babies; NUDITY of any
kind — everybody is fully dressed; a god figure, angels, wings, haloes, rays of golden
light, clouds or sky — nothing religious except the pose itself; A ONE-TO-ONE SCENE — the
right-hand side must be a CROWD, never a single person alone with the patient; the two
sides being the same height, symmetrical or mirrored; ANY ROMANTIC OR INTIMATE MOOD — the
patient and the dentist must NOT look into each other's eyes, must not blush at each other,
and there is no soft romantic glow between them; anything inside the patient's mouth; any
instrument near his face; a syringe, a drill or a probe; blood, wounds, pain or fear; face
masks covering faces; anybody looking at the viewer; hands with the wrong number of fingers.
```

## 五、可以加、但沒有預設加的一句

**手機**（原本第一版就有這個選項，仍然成立）：這一則訊息講的是「以後提醒會發到這裡」，
所以病患手邊放一支手機會讓圖和訊息對得起來。想加就接在 `LEFT — THE PATIENT` 段最後：

```
A mobile phone lies on the armrest beside his limp hand, seen from the side, its screen
blank and dark with nothing on it at all.
```

⚠ 兩個代價：① 空白螢幕是這個站踩過的地方，模型很愛在上面長出亂碼英文（第七節第 4 條）；
② 那一團人已經很熱鬧，再多一個道具會更擠。**手勢加那顆小牙齒已經把意思講完了。**

## 六、驗收（生成之後逐條看，任何一條沒過就重生成，不要後製）

**先看這三條，第一版就是死在這裡：**

1. **右邊是一群人（五個以上），不是一個人。** 只有一個人 ＝ 回到第一版那個問題。
2. **兩側明顯不對等**：右邊那一團**比病患高、而且在飄**；病患躺著、手是鬆的。
3. **兩人沒有對看**（都看手），中間沒有柔焦的浪漫光暈。

其餘：

4. **一眼認得出是那張名畫**（躺著的人 ＋ 飄著的一團 ＋ 中間那個指尖的空隙）。
5. **好笑**：那一團裡至少有兩個明顯的笑點（舉牙刷當火把／只露出頭頂／掛在別人肩上）。
6. **兩根食指沒有碰到**，間距約一個指節；中間那顆小牙齒不大於一個頭。
7. **整張沒有任何文字**（白袍口袋、名牌、杯子、鏡柄、瓶罐、椅子都要清）。
8. **沒有宗教語彙**：翅膀、光環的環、雲、天空、放射狀金光、上帝。
9. **沒有裸體、沒有娃娃**（Q 版那個是娃娃，我們不是）。
10. **線是細而均勻的深灰褐**，平塗、沒有陰影與顆粒（這一版刻意不是站上那套色鉛筆）。
11. **診療椅一眼看得出是診療椅**；背景其餘只有細灰線、沒有填色。
12. **手指數量正確**；病患嘴裡沒有東西、臉旁邊沒有器械。
13. **中央那條 2:1 的帶子裡**裝得下兩張臉、兩隻手、那一團人與椅子的頭靠。

## 七、生成之後給我，我接下來要做的

1. 裁成 **1040×520**（2:1，上下對稱裁）→ `preview/line-bind-done/hero-bind.jpg`。
2. 接進提案頁 Ⓑ 那一案的卡片頭圖，面板重量一次高度與佔一屏
   （加 2:1 頭圖之後那一案大約從 350px 長到 480px ＝ 390×844 上約 57%）。
3. 定案之後：這一份存下定稿提示詞、圖進 `assets/line/`（⚠ 那個資料夾還不存在，
   `tools/dist.mjs` 也還沒有它，見 CLAUDE.md 第十一之七節第 3 項）、
   Flex 的 `hero.url` 指過去。

---

## 附、第一版的提示詞（**被退回**，逐字保留）

成品是 `drafts/bind-done-v1-rejected.jpg`。被退回的理由與診斷在第一節 ——
**核心錯誤是「兩人等高」那一段**（下面 `COMPOSITION` 段那句
`THE TWO FIGURES ARE EQUALS…`）。留著這一份是因為第 19 條：
改圖要從上一份改、只換出問題的那一段，不要從零重寫。

```
Editorial illustration, 16:9 landscape.

READ THIS FIRST — STYLE. This is the most important section; keep it fully in force no
matter how long the rest of this brief is. Contemporary printed-magazine editorial
illustration, entirely hand-drawn. Linework in warm dark brown or soft charcoal, NEVER
pure black: thin, hand-drawn, the weight varying along each stroke, strokes tapering and
sometimes breaking or running dry at the end. Colour applied like soft coloured pencil and
light marker, in flat fills with two or three tones per hue; colour edges a little loose,
not always meeting the line. A fine even paper grain over the whole image. Plenty of pale
paper left showing through. Simplified illustrative people with minimal features. The
picture is warm, ordinary and alive — there is movement in it.

SUBJECT — A dental clinic. Two people reach out towards each other and their index
fingertips almost touch: on the left, a patient half-reclining in a dental chair; on the
right, a clinician leaning in towards him. This is the small moment when two people agree
to look after something together. Warm and everyday — never solemn, never ceremonial.

COMPOSITION — A wide horizontal composition. The patient occupies the left third, the
clinician the right third, and the gap between their fingertips sits near the exact centre
of the frame, a little above the horizontal middle. THE TWO FIGURES ARE EQUALS: their heads
are at the SAME height, their shoulders are at the same height, and neither of them is
above, over or looming over the other. The clinician leans in from the side with her knees
slightly bent and her torso inclined towards him — she is NOT standing tall over him and
NOT reaching down at him. Both figures are seen from the side, from the eye level of a
seated person. Nobody looks at the viewer.

THE TWO HANDS — This is the focal point; draw it clearly and simply. The patient's near
arm reaches out to the right, elbow slightly bent, wrist relaxed, index finger extended in
a soft unhurried point — the hand is relaxed, never stiff, never pleading, never grabbing.
The clinician's near arm reaches out to the left in the same way, her index finger extended
towards his. THE FINGERTIPS DO NOT TOUCH: leave a small clear gap between them, about the
width of one finger. Both index fingers are at exactly the same height. Draw both hands
carefully: five fingers on each hand, natural knuckles, no fused, extra or missing fingers,
hands correctly proportioned to the arms.

THE PATIENT — An East Asian man in his late thirties, ordinary build, short neat hair. He
half-reclines in the dental chair, which is tilted back about thirty degrees; he is propped
up on his far elbow so his upper body is raised and turned towards the clinician, his near
leg relaxed and slightly bent along the chair. He wears his own everyday clothes — a soft
crew-neck jumper and trousers — NOT a hospital gown and NOT a paper bib. His expression is
calm and quietly hopeful, mouth closed in a small easy smile, his eyes on her hand. He is
comfortable and NOT being treated: his mouth is closed, nothing is in his mouth, and no
instrument is anywhere near his face.

THE CLINICIAN — An East Asian woman of about forty with a short neat bob, no face mask.
She wears an open WHITE COAT over PALE SAGE GREEN SCRUBS. Her free hand rests lightly on
the top of the chair's headrest. Her expression is warm, attentive and matter-of-fact,
mouth closed in a small smile, her eyes on his hand.

THE CHAIR AND THE ROOM — The dental chair is the one object that must be unmistakable:
draw it properly, with a padded headrest, a padded back, an armrest and a slim base,
upholstered in muted slate blue. The articulated arm of the overhead operating lamp swings
in from the upper right, its round head turned away and switched OFF. Everything else in
the room dissolves into soft light: far behind them, very pale and low in contrast,
suggest a low counter with a transparent tooth model standing on it, a wordless framed
picture on the wall, and one potted plant. Keep every instrument far away, small and vague
— no tray of instruments in the foreground, no close-up of any tool, no syringe, no drill,
no probe.

THE DREAMY BACKGROUND AND THE LIGHT — ONE single warm light source, high and behind the
two hands, so the centre of the picture is its brightest part and the room falls away
softly towards the edges. Behind the clinician, a large soft ROUNDED ARC of pale sage-green
light, like the bloom of a lamp, holds her — it is LIGHT AND AIR, a soft-edged wash, never
a hard-edged disc, never a ring, and it casts no rays. The air itself is hazy: pale mint
and pale butter yellow drift through the room in very soft washes and the far corners fade
almost to bare paper. This is the ONLY place in the picture where a gradient is allowed,
and it is there to describe light, not to decorate.

THE SPARK BETWEEN THE FINGERTIPS — In the gap between the two index fingers, draw FIVE OR
SIX SHORT WHITE HAND-DRAWN ARCS, all curving the same way, evenly spaced, fanning outwards
from the gap, each no longer than half the width of a hand, solid where it begins and
thinning to dry chalky flecks at its far end; scatter three or four tiny dots among them.
This is a small quiet crackle of life between two people and it must STAY SMALL — the whole
marking is no taller than one head. It must NOT be one long continuous ribbon, must NOT
loop or close on itself, must NOT cross itself, must NOT wander across the picture, must
NOT grow thicker as it travels outward, and must NOT resemble lightning, electricity, a
lens flare, a starburst, smoke, steam, or a spirit leaving a body.

MOVEMENT — The picture should feel alive. A few short arcs in the same direction beside the
hem and sleeve of her white coat show that she has just leaned in, and one or two beside
the plant's leaves show moving air. Same rule as above: always a small group of short
strokes, never one long line.

PEOPLE — Simplified illustrative people: minimal features (small dot or short-line eyes, a
simple line mouth, a small nose), natural realistic head-to-body proportions, believable
ages, East Asian faces. Not photorealistic. Not faceless. No oversized heads, no noodle
limbs. Nobody looks at the viewer. Both people are drawn with equal care and equal presence.

CLOTHING, RENDERING — Clothes are NEVER flat single-tone shapes. Model every garment with
two or three tones of its own colour: soft coloured-pencil shading in the folds, along the
sleeves, under the collar, at the hem and wherever the fabric gathers, so the cloth has
weight and drape. Draw the real details — the coat's collar, lapel and pocket edge, the
V-neck of the scrubs, the ribbing at his cuffs. The white coat hangs and creases quite
differently from his soft jumper.

COLOUR — Light, muted and gentle, but genuinely coloured — never washed out to near-white,
never greyscale. Ground: pale cream and off-white paper. The clinician's scrubs are a dusty
sage green, and that green is the accent colour of the whole picture, echoed in the arc of
light behind her and in the plant. The patient wears a muted clay or dusty rose jumper with
warm grey trousers, clearly a different colour family from hers so the two of them read
apart at a glance. The chair is muted slate blue. Supporting notes: soft powder blue, pale
butter yellow, warm grey. Desaturated throughout — nothing heavy, no overall orange or
amber cast, no neon.

CROP SAFETY — This image will be cropped to a 2:1 letterbox by cutting an equal strip from
the top and from the bottom, about 6% of the height each. Everything that matters — both
faces, both reaching arms, both hands, the gap between the fingertips and the chair's
headrest — must sit comfortably inside the central horizontal band, well away from the top
and bottom edges. Put nothing essential in the top sixth or the bottom sixth of the frame.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions, labels or watermarks, in any language. The white coat and its pocket
carry no embroidery, no name badge and no writing; the scrubs are blank; the framed picture
on the wall is a simple wordless image; every bottle, tube, box and package is blank; any
screen or monitor is blank and dark; the chair carries no branding. Wherever writing would
normally appear, leave the surface plain.

AVOID — greyscale; photorealism; the Renaissance fresco look; any religious reading of the
gesture — no robes, no drapery, no clouds, no sky, no wings, no angels, no cherubs, no
bearded god figure, no halo ring, no golden light shafts, nobody floating in the air; and
NO NUDITY of any kind — both people are fully and ordinarily dressed; ink-wash or sumi-e
brush style; babies or chubby infant figures; the clinician standing tall over a lying-down
patient; a patient lying flat with an open mouth; anything inside the patient's mouth;
instruments in the foreground; a syringe, a drill or a probe; blood, wounds, pain or fear;
a surgical mask covering a face; faceless or noodle-limbed figures; thick uniform black
outlines; chrome or iridescent gradients; decorative gradients inside the flat colour
areas; flat untextured single-tone clothing; anybody looking at the viewer; hands with the
wrong number of fingers.
```
