# 綁定完成圖卡的頭圖：〈創造亞當〉的診間版

2026-09-03。使用者看過六案的提案頁（`/preview/line-bind-done/`）之後說：

> 這裡也可以來一張圖卡。我想到米開朗基羅的創造亞當，有一張可愛的版本參考。
> 我覺得可以是病患或民眾坐在診療椅上，背景夢幻一點，然後穿著刷手服加白袍的
> 醫療人員伸出手要跟診療椅上的人做出連結手勢。你們做提示詞，我放到 Gemini 上生成。
> 插圖的風格就跟現在網站上文章一樣，手繪、有動感、生命感。

出圖用 Gemini（使用者自己跑）。**這一份就是要餵進去的提示詞**，逐字可複製。
定案之後照 ILLUSTRATION.md 第七節第 19 條把定稿版存回這一份。

---

## 一、規格（先確認，這幾個數字會決定構圖）

| | |
| --- | --- |
| 用在哪 | Ⓑ 圖卡那一案的 Flex `hero`（`/preview/line-bind-done/?v=b`） |
| 成品尺寸 | **1040×520（2:1）** —— 和招呼圖卡的頭圖同一個規格 |
| 生成尺寸 | ⚠ **請 Gemini 出 16:9**（2:1 不在它的選項裡），之後上下各裁掉約 6% |
| 圖上有字嗎 | **沒有。** 卡片上的字是 Flex 的真文字，不是烘進圖裡的 —— 所以這張圖不必留安靜區，但**整張不可以有任何文字** |
| accent | 一般牙科那一支綠（套色 `#3f654a`／深階 `#2c5238`）。畫面上由**鼠尾草綠的刷手服**與背景那道光承接 —— 和站上七科的畫法一致，不必寫 HEX |

⚠ **不要在提示詞裡寫 HEX 色碼。** ILLUSTRATION.md 第十之二節：色值和形容詞打架時模型
跟形容詞，寫死色碼只會讓整張偏色（第七節第 8 條踩過，整張變棕）。

## 二、要附哪幾張參考圖（**分三組，一組只講一件事**）

ILLUSTRATION.md 第十二節之二：參考圖混在一起餵，模型會把每一張的每一件事都拿一點。

| 組 | 檔案 | 只提供這一件 | 要跟 Gemini 說的話 |
| --- | --- | --- | --- |
| **A・風格** | `assets/hero-crown-photo-1600.jpg`、`assets/og-topic-general.jpg` | 線、上色、質感、人物簡化程度、**白袍＋鼠尾草綠刷手服**、診療椅與燈臂長什麼樣 | 「風格、線條、上色與人物畫法**完全照這兩張**」 |
| **B・手勢** | `drafts/bind-done-ref-adam-gesture.jpg` | **只有「兩隻手伸出來、指尖快要碰到」那個構圖** | 「**只參考兩隻手的姿勢與距離**，畫風、人物、顏色、水墨筆觸一律不要參考」 |
| **C・臉** | `drafts/surg-doctor-ref.jpg`（短髮女醫師） | 醫療人員的長相與髮型 | 「醫療人員的臉與髮型照這張」 |

⚠⚠ **B 那一張是別人的水墨作品**，我們拿的是米開朗基羅那個手勢（本身是公共領域），
**不是那位作者的畫風與娃娃造型**。提示詞的 `AVOID` 段已經把 `ink-wash or sumi-e brush
style`、`babies or chubby infant figures` 兩項擋掉了。⚠ 那張原檔是手機截圖，
`drafts/bind-done-refs-crop.mjs` 已經把新浪的介面、中文搜尋列、Lens 按鈕與浮水印裁掉
—— **截圖裡的中文字會被模型抄進畫面**（第七節第 4 條的反面），不要直接餵原截圖。

## 三、⚠⚠ 一個我改掉的地方，先看一眼再決定

**原作是「上帝在上、亞當在下」——我把它改成兩人等高。**

米開朗基羅那張的力量來自不對等：神主動、居高、被天使托著；亞當被動、躺在地上、
手是垂的。照抄到診間就變成「醫師從上面把生命遞給病患」。可是這間診所的品牌
一直站在反方向：HERO 的收尾句是「**到巷口的芳仁　一起想辦法**」，
而分享圖那一輪使用者親口說品牌核心之一是「**不搶戲、和諧**」。

所以提示詞裡寫死了三件：**兩人的頭同高、肩同高、兩根食指同高**，醫師是**屈膝側身
靠過來**（不是站直了往下伸手）。⚠ **這一項不是漏看，是判斷** —— 你要原作那種
「醫師在上」的張力的話，把 `COMPOSITION` 段那句 `THE TWO FIGURES ARE EQUALS…` 換成
下面這一句就好：

```
The clinician stands upright and leans over him from slightly above, her shoulder line
clearly higher than his, her reaching hand coming down towards his — she is the one giving
and he is the one receiving.
```

## 四、提示詞（逐字複製給 Gemini）

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

## 五、可以加、但我沒有預設加的一句

**手機**。這一則訊息講的是「綁定完成、以後提醒會發到這裡」，所以病患手邊放一支手機
會讓圖和訊息對得起來。想加就把這一句接在 `THE PATIENT` 段的最後：

```
A mobile phone lies on the armrest beside his hand, seen from the side, its screen blank
and dark with nothing on it at all.
```

⚠ **兩個代價，先知道再決定**：① 空白螢幕是這個站踩過的地方 —— 模型很愛在螢幕上長出
亂碼英文（第七節第 4 條），`CRITICAL` 段已經點名螢幕，但仍然要逐張檢查；
② 畫面上會多一個要看的東西，和指尖那撮短線搶注意力。**手勢本身已經把意思講完了**，
所以預設不放。

## 六、驗收（生成之後逐條看，任何一條沒過就重生成，不要後製）

1. **兩根食指沒有碰到**，間距約一個指節；**兩指尖等高**（高度差不超過圖高的 3%）。
2. **兩人的頭同高**（除非你選了第三節那個「醫師在上」的版本）。
3. **整張沒有任何文字** —— 白袍口袋、名牌、牆上的畫、瓶罐、螢幕、椅子上的商標都要清。
4. **沒有宗教語彙**：雲、天空、光環的環、長袍、翅膀、天使、放射狀金光、有人在飄。
5. **沒有裸體**，兩個人都穿正常衣服。
6. **手指數量正確**，沒有融合或多出來的手指。
7. **指尖之間是一群短線**（五六條、同向、不閉合、不交叉、不長過半個手掌），
   整撮不高於一個頭 —— 一條長曲線會被讀成靈魂出竅（第七節第 17 條）。
8. **病患嘴巴是閉的**，嘴裡沒有東西，臉旁邊沒有器械。
9. **兩人不同色系**（醫師鼠尾草綠、病患赭土或暗玫瑰），衣服不是單一平色、有兩三階與皺褶。
10. **線不是純黑**，整張有細顆粒質感，四角有紙白透出來。
11. **中央那條 2:1 的帶子裡**裝得下兩張臉、兩隻手與椅子的頭靠 —— 上下各裁 6% 不會切到。
12. **診療椅一眼看得出是診療椅**（頭靠＋燈臂）；器械都在遠處、很淡。

## 七、生成之後給我，我接下來要做的

1. 裁成 **1040×520**（2:1，上下對稱裁）並存成 `preview/line-bind-done/hero-bind.jpg`。
2. 接進提案頁 Ⓑ 那一案的卡片頭圖，面板會跟著重量一次高度與佔一屏的百分比
   （加了 2:1 的頭圖，那一案會從 350px 長到大約 480px ＝ 390×844 上約 57%）。
3. 定案之後：這一份存下定稿提示詞、圖進 `assets/line/`（⚠ 那個資料夾還不存在，
   `tools/dist.mjs` 也還沒有它，見 CLAUDE.md 第十一之七節第 3 項）、
   Flex 的 `hero.url` 指過去。
