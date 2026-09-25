# 中秋節・診所門口烤肉：提示詞（現行是第五版，見第八節）

使用者 2026-09-25 的原話（逐字）：

> 寫提示詞
> 大意是中秋節診所人員、幾個街坊鄰居、患者像朋友一樣 招呼 在街邊烤肉 不完全是蹲在路邊，
> 也有像當代露營講究的設備 有人在玩煙火 也有人把柚子皮撥開 反戴在頭上 呈現中秋節歡樂
> 輕鬆的氣氛 用照片這個背景 天空有一點雲 滿月 插畫風格也是網站上現在一致的風格

背景照片是 `drafts/mid-autumn/refs/1-street-photo.jpg`（原間攝影工作室拍的傍晚側面街景，
畫面左邊三分之二是建築、街道往右後方延伸）。出圖用 Gemini。

---

## 摘要

| # | 項目 | 定成什麼 | 為什麼 |
| --- | --- | --- | --- |
| 1 | 比例 | **橫的 4:3** | ⚠ 用途還沒講（LINE 貼文、臉書，還是別處）。照片本身接近方形，4:3 兩邊都裁得出來。要 1:1 或 2:1 請說 |
| 2 | 構圖 | **完全照那張照片的機位** | 建築角在左、街道往右後方收、天空在右上 —— 月亮擺在那塊天空裡 |
| 3 | 人是主角 | **是**（喜悅場面，ILLUSTRATION.md 第三節的例外） | 十個人，佔畫面下半；建築仍然要認得出來 |
| 4 | 煙火 | **仙女棒為主**（小孩與一個大人），不畫天上的大煙火 | 天上的大煙火會搶月亮，而且會變成第二個主光 |
| 5 | 柚子帽 | **兩個人戴**（一個小孩、一個大人），另有人在桌上剝柚子 | 形狀要寫死，見第六節第 2 條 |
| 6 | 光 | 月光（冷）＋ **一組暖光**（烤爐、露營燈、診所窗盒與玻璃、仙女棒） | 見第五節第 1 條，這一條偏離了規格表的「只有一個光源」 |
| 7 | 零文字 | 招牌、浮水印、月餅盒、飲料、冰桶全部空白 | 照片上**有三處字**（招牌兩處＋浮水印），要點名 |

---

## 一、參考圖（餵圖時用途要分開講）

| | 檔案 | 參考什麼 | **不要**參考 |
| --- | --- | --- | --- |
| ① | `drafts/mid-autumn/refs/1-street-photo.jpg`（使用者給的照片） | **機位、取景、建築的比例與構造、街道往哪裡收** | 照片的寫實感、招牌上的字、下緣那個浮水印、停著的車、交通錐 |
| ② | `drafts/mid-autumn/refs/2-building-style.jpg`（＝ drafts/og-topic-general-src.jpg） | **這棟樓畫成插畫時的樣子**：線、顏色、窗盒的畫法、紙的顆粒 | 白天的光、藍天、那幾條白色弧線、那七個人 |
| ③ | `drafts/mid-autumn/refs/3-happy-group.jpg` | **一群人很開心時的臉與身體**（全站唯一一張「人是主角」的） | 室內、構圖、診療椅 |
| ④ | `drafts/mid-autumn/refs/4-line-grain.jpg` | 手繪線的實度、紙的顆粒 | 構圖、候診間 |

⚠⚠ ② 一定要用 `-src.jpg`，**不可以用 `assets/og-topic-general.jpg`** —— 那一張上緣有印著中文字的綠帶子，餵進去會被學走。
⚠⚠ ② 那張晴天圖上有**白色的風線**，颱風那一輪兩度被模型照抄回來（颱風那一份第六節第 12 條）。
所以「不要抄那些白線」寫在**叫它照抄那張圖的那一段裡**，不是只寫在 `AVOID`。

---

## 二、~~第二版的提示詞~~ ⚠ 已被第六節（第三版）取代；第二版出的圖是 `v2-result.jpg`

```
Editorial illustration, landscape 4:3. One single continuous scene, no panels, no insets, no
borders.

STYLE - THIS IS THE MOST IMPORTANT PARAGRAPH. It must look exactly like the hand-drawn editorial
illustrations provided (the drawing of this same building by day, the family in the dental
chair, the waiting room). Thin hand-drawn linework in warm dark brown or soft charcoal, the
weight varying, strokes tapering and sometimes breaking - not a thick even outline and not a
ruled vector line. Colour laid on like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue; gradients
only where they describe light. A fine even coloured-pencil paper grain over EVERY surface of
the picture, including the night sky. People are simplified but naturally proportioned, with
believable ages: each face is one flat skin tone with only its outline, eyes as small dots or
short curved lines, two short eyebrows, a tiny nose mark, a small mouth and an ear - no
wrinkles, no cheek lines, no realistic shading. Clothes are drawn with two or three tones each,
with folds, cuffs, collars and hems visible. Not photo-realistic, not 3D, not anime, not a
children's cartoon.

THE STORY IN ONE SENTENCE: it is the night of the Mid-Autumn Festival in a small Taiwanese town,
the full moon is up, and outside the dental clinic in the provided photograph the clinic's staff,
a few neighbours and some of their patients are having a relaxed street barbecue together, like
old friends - grilling, chatting, eating pomelo, and the children are waving sparklers. The mood
is warm, easy and happy: a neighbourhood party, not a staged group photo.

1. THE PLACE AND THE VIEWPOINT ARE COPIED FROM THE PROVIDED PHOTOGRAPH. Same low camera, same
   framing, same proportions. Redraw it in the illustration style; do not re-invent it:
     • The building fills the LEFT two-thirds of the picture. Its front corner is near the left
       edge; its long side wall runs away from us towards the RIGHT, getting smaller, and the
       quiet narrow street runs beside it into the distance towards a vanishing point just
       right of centre.
     • The side wall is smooth warm-grey concrete with a slightly rough hand-plastered texture.
       Set into it are deep projecting window boxes of dark rusty-brown metal, their insides
       glowing warm amber, staggered across three floors exactly as in the photograph. Thin
       horizontal concrete ledges run across the wall. A timber roof structure with a pitched
       dark roof sits on top.
     • At the lower left, the ground floor is set back into a covered walkway with tall dark
       brown metal-clad columns and a floor-to-ceiling glass front; warm light spills out of the
       glass onto the walkway floor.
     • A row of small round grey concrete pots with green leafy plants stands along the foot of
       the side wall.
     • Further down the street on the right, the neighbouring buildings with small lit windows,
       a few overhead wires, and at the far right edge the dark eaves of an old house, cropped.
     • The street tonight has NO CARS parked on it and no traffic cone - it has been given over
       to the party.
   Use the illustration of this building by day ONLY for how to draw it - its linework, its
   colours and its paper grain. Do NOT copy its daylight, its blue sky or the long white curving
   wind lines drawn across its sky: there is no wind line of any kind in this picture.

2. THE SKY AND THE MOON. The sky fills the upper RIGHT part of the picture, above the street and
   to the right of the building's roof. It is a deep dusky indigo-blue night sky - clearly dark,
   never black, never flat, with the fine paper grain showing through it.
     • THE FULL MOON sits high in that patch of sky, in the upper right quarter of the picture,
       well clear of the roofline and of the picture edge. It is perfectly round and completely
       full, a pale warm cream, about as wide as one of the window boxes on the near wall, with
       one soft pale halo around it. No face, no rabbit, no craters drawn as a pattern.
     • A FEW THIN CLOUDS drift in long soft horizontal wisps across the sky, two or three of them,
       their edges lit silver-white by the moon. One passes just below the moon; NONE of them
       covers it. The sky is mostly clear.

3. THE PARTY - WHO IS WHERE. About ten people, all East Asian (Taiwanese), spread across the
   lower half of the picture along the pavement at the foot of the side wall and out into the
   quiet street, in three loose groups with space between them. The nearest people are large:
   the head of the nearest standing adult reaches roughly the first-floor ledge of the building.
   Nobody looks at the camera.
   GROUP A - THE MODERN CAMPING CORNER, LOWER LEFT, just in front of the covered walkway:
     • A low slatted wooden folding camp table and three or four canvas folding camp chairs in
       olive, sand and dark green, a hanging camping lantern with a warm glow on a slim black
       stand, a hard-sided cooler box standing open and full of ice with drinks in it (see section
       5), and a neat compact charcoal barbecue grill on legs - the
       kind of good-looking, carefully chosen outdoor gear people bring to a glamping weekend.
     • A dental nurse in her late twenties, in pale sage-green scrubs with a dusty-rose cardigan
       over them, stands at this grill turning skewers with long tongs, laughing at something.
     • An older neighbour, a grandmother in her seventies from the old house next door, in a
       terracotta-patterned blouse, sits in a camp chair peeling a big pomelo on her lap,
       pulling the thick rind apart in large curved pieces. On the table: a plate of pomelo
       segments, a plate of round mooncakes, and beside her a hand-shaken tea (see section 5).
   GROUP B - THE CLASSIC STREET BARBECUE, CENTRE, on the pavement against the side wall among
   the concrete pots:
     • A simple low rectangular metal charcoal grill set directly on two bricks on the ground,
       the traditional Taiwanese way. Two people crouch or sit on small low plastic stools beside
       it: a dentist in his forties in a navy polo shirt, brushing sauce onto skewers with a
       small brush, and a middle-aged neighbour in a white vest and faded blue shorts with flip-
       flops, fanning the coals with a round woven fan in one hand, an aluminium can of soft drink in the
       other. Skewers of meat, sausages, corn, green
       peppers and slices of toast on the grill.
     • A patient's father in his late thirties, in a mustard-yellow T-shirt, stands beside them
       holding a paper plate in one hand and a glass bottle of soda in the other, WEARING A POMELO-PEEL HAT (see section 4), grinning while the
       dentist hands him a skewer.
   GROUP C - THE SPARKLERS, RIGHT FOREGROUND, out on the empty street where it is safely away
   from both grills:
     • Two children, a boy of about six in a pale sky-blue T-shirt WEARING A POMELO-PEEL HAT, and
       a girl of about nine in a coral dress, each holding one lit sparkler out at arm's length,
       drawing loops of light in the air, delighted.
     • The clinic's receptionist, a woman in her thirties in a cream blouse and dark green
       trousers, crouches beside them holding a sparkler of her own and lighting the boy's
       from it.
     • The children's mother, in a soft lilac top, stands just behind them filming them on her
       phone, the phone screen facing away from us, a bottle of water in her other hand.

4. THE POMELO-PEEL HAT - DRAW IT EXACTLY LIKE THIS. After the fruit is eaten, half of the thick
   empty rind of a big pomelo is turned upside down and worn on the head like a small round
   helmet. It is a smooth dome, pale yellow-green on the outside, sitting snugly on top of the
   head and coming down to just above the eyebrows and the tops of the ears, with a thick band of
   pale cream-white pith showing along its cut lower rim. It is empty, hollow and light. It is
   NOT a whole fruit balanced on the head, NOT a bowl held in the hands, NOT a green cap with a
   brim, NOT a leafy crown. Exactly two people wear one: the father in the mustard T-shirt and
   the six-year-old boy.

5. THE DRINKS - A REAL TAIWANESE STREET-PARTY MIX, HELD IN PEOPLE'S HANDS. Draw four kinds and
   make each one recognisable by its shape:
     • HAND-SHAKEN TEA: a tall clear plastic cup with a flat sealed film lid and a fat straw
       pushed through it, the drink visible through the cup - one is golden-brown milk tea with
       dark tapioca pearls at the bottom, one is pale amber-green tea with ice. One stands on the
       camp table beside the grandmother; the nurse has one on the edge of the table next to her
       grill, half drunk.
     • GLASS BOTTLE SODA: a classic thick glass soda bottle, green-tinted or clear, with a short
       neck - the father in the mustard T-shirt holds one.
     • ALUMINIUM CANS: plain soft-drink cans in solid colours (red, green, silver) - the
       neighbour in the white vest holds one, and a few more stand in the ice of the open cooler.
     • WATER: a clear plastic bottle of water with no label - the mother holds one, and one or two
       more stand on the camp table.
   Every cup, bottle and can is PLAIN: any label is just a band of flat colour with nothing
   written on it, no logo, no brand, no character. These are soft drinks, tea and water only.
   The children and the receptionist are holding sparklers, not drinks.

6. THE SPARKLERS AND THE SMOKE.
     • Each sparkler is a thin wire with a small bright white-gold burst of tiny sparks at its tip
       and a short looping trail of light behind it in the air. Three sparklers in all, all in
       Group C. Nothing else explodes: no fireworks in the sky, no rockets, no firecrackers.
     • Smoke from the two grills is drawn as a small group of three or four short, soft,
       separate curling strokes rising and drifting towards the RIGHT, each no taller than a
       person's head. Never one long continuous ribbon of smoke, never a loop, never a big cloud
       that hides anyone.

7. THE FACES - HAPPY AND EASY. Real smiles and laughter: eyes curved into happy crescents,
   mouths open in laughter or in a broad smile, cheeks lifted. People are turned towards each
   other, talking, handing food across, leaning in. Everyone is kind to everyone - nobody is
   being laughed at, nobody is pointing at anyone, nobody is drunk, nobody is posing for a photo,
   nobody looks at the camera.

8. THE LIGHT - IT IS NIGHT, AND THE PICTURE MUST BE CLEARLY DARKER THAN THE DAYTIME ILLUSTRATION.
   Two kinds of light only:
     • COOL MOONLIGHT over everything: the concrete wall is a mid cool blue-grey, NOT pale, NOT
       cream, NOT white; the street is a deep blue-grey; the sky is deep indigo.
     • ONE FAMILY OF WARM LIGHT from the party: the glow of the two grills, the camping lantern,
       the amber insides of the window boxes, the glass of the covered walkway, and the sparkler
       tips. Each is a small pool of warm orange-gold that falls off quickly into the blue: it
       lights the faces, hands and clothes of the people nearest to it, warm on the side facing
       the light and blue on the side facing away.
   From brightest to darkest: the moon and the sparkler tips; then the grill glow, the lantern
   and the lit glass; then the faces lit by them; then the window boxes; then the concrete wall
   and the clouds; then the sky; darkest of all, the street in the distance.

9. COLOUR. Night blues and warm orange-gold light, with the clothes as the colour accents: sage
   green, dusty rose, terracotta, navy, mustard yellow, pale sky blue, coral, cream, dark green,
   lilac - every person in a different colour from their neighbours. The pomelo hats and the
   pomelo on the table are a fresh pale yellow-green. At least eight distinct colours must be
   readable. Not monochrome, not sepia, not all-orange, not all-blue, not washed out to pale.

10. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters, logos,
   brand marks, captions, signatures or watermarks, in any language. The real building has
   Chinese lettering on its column and above its entrance, and the provided photograph has a
   photographer's watermark along its bottom edge: IGNORE ALL OF THEM and leave those surfaces
   plain. The mooncakes are plain round cakes with no stamped characters. The cooler box, the
   camp chairs, the grills, the tea cups and their sealed lids, the soda bottles, the cans,
   the water bottles, the phone, the lantern and every piece of clothing
   are plain, with no logo and no writing.

AVOID: any letters, words, Chinese characters, logos or watermarks anywhere, including the
photographer's watermark and the lettering on the clinic copied from the photograph; stamped
characters on the mooncakes; any brand, logo or writing on a cup, cup lid, bottle or can;
beer, beer bottles, wine or anyone drunk; a cup of tea drawn as a paper cup or a mug; parked cars, a traffic
cone; fireworks, rockets or bursts in the sky; long white curving wind lines or chalk ribbons in
the sky; one long ribbon of smoke; a pomelo hat drawn as a whole fruit, a bowl, a brimmed cap or
a crown; more than two people wearing pomelo hats; a sparkler near a grill or near anyone's face;
the moon cropped, covered by cloud, drawn with a face or a rabbit, or drawn huge like a poster;
a cloudless empty sky or a sky full of heavy clouds; daylight, a blue daytime sky, sunset
orange; a pale, cream or brightly lit wall; a washed-out high-key picture; a black sky; dental
instruments, dental chairs, teeth, X-rays; anyone crying, drunk, mocking, pointing or looking at
the camera; a posed row of people facing the viewer; tiny distant figures in an empty street;
anyone drawn pale, faint, translucent or in outline only; a re-invented or re-proportioned
building; the building mirrored to the other side of the picture; photo-realism; 3D rendering;
anime; thick uniform black outlines; greyscale.
```

---

## 三、這一份裡已經先擋掉的坑（都是這一站踩過的）

1. **風格段放最前面、而且寫具體**（ILLUSTRATION.md 第七節第 18 條）——
   這一張要交代的事很多，最容易被擠掉的就是風格。
2. **柚子帽的形狀寫死**（第十之一節：形狀不要只靠形容詞）。
   模型對「柚子戴頭上」沒有先驗，很可能畫成一整顆柚子頂在頭上或一頂綠帽子。
   ⚠ 第一版若還是畫錯，**下一輪改餵一張柚子帽的參考照**，不要再加形容詞。
3. **煙只能是一小群短線**（第七節第 17 條：一條長曲線會被讀成靈魂出竅）。
4. **晴天那張的白色風線寫在「照抄那張圖」那一段裡**（颱風那一份第六節第 12 條）。
5. **夜晚要明講「比白天那張暗、牆不可以是白的」**（第七節第 18 條：high-key 會把夜晚洗白）。
6. **每個人的衣服顏色逐一指派**（第七節第 18 條：只給色票，一家人會穿成同一色）。
7. **方向用畫面的左／右寫死**（颱風那一份第六節第 5 條）：建築在左、街往右收、月亮在右上、煙往右飄。
8. **沒有人看鏡頭、沒有人在笑別人**（第三節的例外段、第七節第 14 條）。
9. **仙女棒離烤爐、離臉都遠** —— 一張診所發的圖，畫面上不能有會被讀成危險的東西。
   同理**不畫啤酒**。
10. **飲料（第二版，使用者 2026-09-25 指定）**：手搖飲、玻璃瓶汽水、鋁罐飲料、水，
   **逐項指派給誰拿**（同第 6 條衣服顏色的道理：只列清單，模型會堆在桌上或全部變同一種）。
   ⚠ 鋁罐最容易被畫成啤酒、也最容易長出商標 —— 所以寫「純色、無字、軟性飲料」，
   `AVOID` 補啤酒。手搖飲靠**形狀**認：透明杯、封膜、粗吸管、看得到珍珠。

---

## 四、生成之後逐條看

| | 門檻 |
| --- | --- |
| 建築 | 和照片並排：角在左、側牆往右收、窗盒錯落三層、左下是騎樓與玻璃 |
| 零文字 | 放大柱子、騎樓上緣、下緣（浮水印的位置）、月餅、冰桶 |
| 柚子帽 | 兩個人、是空心的半顆皮倒扣在頭上 |
| 月亮 | 正圓、全滿、沒被雲遮、在右上 |
| 是夜晚 | 牆是中間偏冷的灰，不是米白；天空是深藍不是黑 |
| 人 | 三組、沒有人看鏡頭、臉是插畫的簡化臉，不寫實 |
| 煙與仙女棒 | 煙是短線不是長帶；天上沒有煙火 |
| 飲料 | 手搖飲（封膜＋粗吸管）、玻璃瓶汽水、鋁罐、礦泉水四種都在，**上面沒有字**，沒有啤酒 |

---

## 五、還沒定的

1. ⚠ **這一張的光偏離了規格表**：ILLUSTRATION.md 第三節寫「整張只有一個光源，暖色」。
   這一張是「冷的月光 ＋ 一組暖光」，因為照片本身就是這樣（窗盒亮著），
   而且中秋少了月亮就不成立。我把幾處暖光寫成**同一組**（都是小範圍、迅速暗掉），
   畫出來若覺得太亂，第一個要減的是**診所玻璃那一片**。
2. **用在哪裡**還沒講 —— 決定了比例，也決定了要不要在縮圖尺寸下驗收。
   ⚠ LINE 那條線有一個相關的判斷（`drafts/channels/README.md` 第 34-3 節）：
   主頁「最新貼文」只有三格，**放一則中秋快樂等於少一格在回答真問題**。
   要貼那裡的話，建議節後撤掉。

---

## 六、第三版（2026-09-25）：**只加人** —— ✅ 過了，出圖是 `v3-result.jpg`；現行是第七節

使用者看第二版出的圖（`drafts/mid-autumn/v2-result.jpg`）：

> 效果很不錯 但人太少了再多一點 晚間散步的 路過打招呼 騎車帶食材帶飲料來參加 牽著狗散步

**做法：拿第二版那張圖當底圖改，不要從零再生一次。** 那一張的建築、月亮、光、三組人都對了，
重生一次等於讓那些重新擲骰子（ILLUSTRATION.md 第七節第 19 條、颱風那一份第五之二節）。

**餵圖：只餵 `v2-result.jpg` 一張**（所以提示詞裡提到「照片」「白天那張」的句子都改成指這一張）（它已經帶著風格了；再餵參考照，模型容易回頭照抄照片的構圖）。

加的人都放在**畫面中段那一截空著的街上**（B 組與 C 組之間、往消失點的方向），不蓋到原本的人：

| | 誰 | 在做什麼 |
| --- | --- | --- |
| 1 | 騎機車來的年輕人 | 剛停在路邊、熄火關燈，掛勾上一袋食材（肉串、玉米、青蔥）、踏板上一包冰塊，手上提一袋四杯手搖飲；白背心鄰居招手、一位派對上的人走過去接 |
| 2 | 散步的老夫妻 | 挽著手走在路中間，先生舉手打招呼、太太笑著喊話 —— **路過，不加入** |
| 3 | 遛狗的阿姨 | 金黃色蓬毛中型狗、紅牽繩，狗停下來搖尾巴、鼻子朝烤爐，她一邊拉一邊和戴柚子帽的爸爸聊天 |
| 4 | 街尾另一戶 | 自己在門口也烤，一個小烤爐、三四個人，有人朝這邊揮手 |

⚠ 第二版 `AVOID` 裡的 `tiny distant figures in an empty street` 會擋到第 4 項（街尾那戶本來就小），
這一版改成 `an empty middle stretch of street`（颱風那一份第六節第 8 條：自己上一版的 `AVOID` 會反咬）。
⚠ 機車要**熄火關燈** —— 大燈一開就是畫面裡第二個很亮的光，會搶月亮與仙女棒。

⚠ 我另外看到一件，**這一版沒有改**（一次只改一件）：兩頂柚子帽畫得像**黃色毛帽**，
看不出是柚子皮。要修的話，下一輪單獨改那一段（補「帽緣要露出一圈白色的厚皮」），或餵一張柚子帽的照片。

```
Editorial illustration, landscape 4:3. One single continuous scene, no panels, no insets, no
borders.

STYLE - THIS IS THE MOST IMPORTANT PARAGRAPH. It must look exactly like the hand-drawn editorial
illustration provided. Thin hand-drawn linework in warm dark brown or soft charcoal, the
weight varying, strokes tapering and sometimes breaking - not a thick even outline and not a
ruled vector line. Colour laid on like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue; gradients
only where they describe light. A fine even coloured-pencil paper grain over EVERY surface of
the picture, including the night sky. People are simplified but naturally proportioned, with
believable ages: each face is one flat skin tone with only its outline, eyes as small dots or
short curved lines, two short eyebrows, a tiny nose mark, a small mouth and an ear - no
wrinkles, no cheek lines, no realistic shading. Clothes are drawn with two or three tones each,
with folds, cuffs, collars and hems visible. Not photo-realistic, not 3D, not anime, not a
children's cartoon.

THE PROVIDED PICTURE OF THIS PARTY AT NIGHT IS AN EARLIER ATTEMPT, AND IT IS ALREADY RIGHT. Keep
its framing, its building, its sky and moon, its light, its colours, its drawing style, and ALL
TEN OF ITS PEOPLE - their places, sizes, poses, clothes, drinks, grills and camping gear -
exactly as they are. Do not move, redraw, restyle or remove anyone. THE ONLY CHANGE THIS ROUND:
MORE PEOPLE. The street should feel busier and more sociable, with neighbours passing by and
friends arriving - see GROUP D in section 3. Everything new is added into the empty parts of the
street and pavement; nothing that is already there is covered up.

THE STORY IN ONE SENTENCE: it is the night of the Mid-Autumn Festival in a small Taiwanese town,
the full moon is up, and outside the dental clinic in the provided picture the clinic's staff,
a few neighbours and some of their patients are having a relaxed street barbecue together, like
old friends - grilling, chatting, eating pomelo, and the children are waving sparklers. The mood
is warm, easy and happy: a neighbourhood party, not a staged group photo.

1. THE PLACE AND THE VIEWPOINT ARE COPIED FROM THE PROVIDED PICTURE. Same low camera, same
   framing, same proportions. Redraw it in the illustration style; do not re-invent it:
     • The building fills the LEFT two-thirds of the picture. Its front corner is near the left
       edge; its long side wall runs away from us towards the RIGHT, getting smaller, and the
       quiet narrow street runs beside it into the distance towards a vanishing point just
       right of centre.
     • The side wall is smooth warm-grey concrete with a slightly rough hand-plastered texture.
       Set into it are deep projecting window boxes of dark rusty-brown metal, their insides
       glowing warm amber, staggered across three floors exactly as in the provided picture. Thin
       horizontal concrete ledges run across the wall. A timber roof structure with a pitched
       dark roof sits on top.
     • At the lower left, the ground floor is set back into a covered walkway with tall dark
       brown metal-clad columns and a floor-to-ceiling glass front; warm light spills out of the
       glass onto the walkway floor.
     • A row of small round grey concrete pots with green leafy plants stands along the foot of
       the side wall.
     • Further down the street on the right, the neighbouring buildings with small lit windows,
       a few overhead wires, and at the far right edge the dark eaves of an old house, cropped.
     • The street tonight has NO CARS parked on it and no traffic cone - it has been given over
       to the party.
   There is no wind line of any kind in this picture - no long white curving lines in the sky.

2. THE SKY AND THE MOON. The sky fills the upper RIGHT part of the picture, above the street and
   to the right of the building's roof. It is a deep dusky indigo-blue night sky - clearly dark,
   never black, never flat, with the fine paper grain showing through it.
     • THE FULL MOON sits high in that patch of sky, in the upper right quarter of the picture,
       well clear of the roofline and of the picture edge. It is perfectly round and completely
       full, a pale warm cream, about as wide as one of the window boxes on the near wall, with
       one soft pale halo around it. No face, no rabbit, no craters drawn as a pattern.
     • A FEW THIN CLOUDS drift in long soft horizontal wisps across the sky, two or three of them,
       their edges lit silver-white by the moon. One passes just below the moon; NONE of them
       covers it. The sky is mostly clear.

3. THE PARTY - WHO IS WHERE. About twenty people in all - the ten already in the earlier attempt
   plus the newcomers in GROUP D - all East Asian (Taiwanese), spread across the
   lower half of the picture along the pavement at the foot of the side wall and out into the
   quiet street, in three loose groups with space between them. The nearest people are large:
   the head of the nearest standing adult reaches roughly the first-floor ledge of the building.
   Nobody looks at the camera.
   GROUP A - THE MODERN CAMPING CORNER, LOWER LEFT, just in front of the covered walkway:
     • A low slatted wooden folding camp table and three or four canvas folding camp chairs in
       olive, sand and dark green, a hanging camping lantern with a warm glow on a slim black
       stand, a hard-sided cooler box standing open and full of ice with drinks in it (see section
       5), and a neat compact charcoal barbecue grill on legs - the
       kind of good-looking, carefully chosen outdoor gear people bring to a glamping weekend.
     • A dental nurse in her late twenties, in pale sage-green scrubs with a dusty-rose cardigan
       over them, stands at this grill turning skewers with long tongs, laughing at something.
     • An older neighbour, a grandmother in her seventies from the old house next door, in a
       terracotta-patterned blouse, sits in a camp chair peeling a big pomelo on her lap,
       pulling the thick rind apart in large curved pieces. On the table: a plate of pomelo
       segments, a plate of round mooncakes, and beside her a hand-shaken tea (see section 5).
   GROUP B - THE CLASSIC STREET BARBECUE, CENTRE, on the pavement against the side wall among
   the concrete pots:
     • A simple low rectangular metal charcoal grill set directly on two bricks on the ground,
       the traditional Taiwanese way. Two people crouch or sit on small low plastic stools beside
       it: a dentist in his forties in a navy polo shirt, brushing sauce onto skewers with a
       small brush, and a middle-aged neighbour in a white vest and faded blue shorts with flip-
       flops, fanning the coals with a round woven fan in one hand, an aluminium can of soft drink in the
       other. Skewers of meat, sausages, corn, green
       peppers and slices of toast on the grill.
     • A patient's father in his late thirties, in a mustard-yellow T-shirt, stands beside them
       holding a paper plate in one hand and a glass bottle of soda in the other, WEARING A POMELO-PEEL HAT (see section 4), grinning while the
       dentist hands him a skewer.
   GROUP C - THE SPARKLERS, RIGHT FOREGROUND, out on the empty street where it is safely away
   from both grills:
     • Two children, a boy of about six in a pale sky-blue T-shirt WEARING A POMELO-PEEL HAT, and
       a girl of about nine in a coral dress, each holding one lit sparkler out at arm's length,
       drawing loops of light in the air, delighted.
     • The clinic's receptionist, a woman in her thirties in a cream blouse and dark green
       trousers, crouches beside them holding a sparkler of her own and lighting the boy's
       from it.
     • The children's mother, in a soft lilac top, stands just behind them filming them on her
       phone, the phone screen facing away from us, a bottle of water in her other hand.
   GROUP D - NEW THIS ROUND: PASSERS-BY AND LATE ARRIVALS, placed in the EMPTY STRETCH OF STREET in
   the middle distance, between Group B and Group C and further back down the street towards the
   vanishing point. They are a little smaller than the front groups because they are further away,
   but drawn with exactly the same line weight, the same solidity of colour and the same simple
   happy faces - clearly readable people, not faint or tiny specks:
     • A FRIEND ARRIVING BY SCOOTER: a young man in his twenties in a khaki jacket has just pulled
       up at the kerb on an ordinary Taiwanese step-through scooter, the engine off and the
       headlight off, one foot on the ground, his plain open-face helmet pushed back. Hanging from
       the hook between his knees is a bulging bag of food for the grill - a tray of skewers,
       corn cobs, a bunch of green onions - and on the footboard sits a big clear bag of ice. In
       his raised hand he holds out a clear plastic drink carrier with four hand-shaken teas. A
       newly arrived woman in a teal top is walking over from the party, one arm raised in
       welcome, to take the bag of food from him.
     • AN OLDER COUPLE ON THEIR EVENING WALK: a grey-haired man in a short-sleeved checked shirt
       and his wife in a soft plum cardigan, strolling slowly down the middle of the street arm in
       arm. He lifts his free hand to wave hello to the grill group; she laughs and calls out
       something. They are passing by, not joining in - just greeting old neighbours.
     • A WOMAN WALKING HER DOG: a woman in her fifties in a pale olive T-shirt and cropped
       trousers walks a medium-sized fluffy honey-coloured dog on a red lead along the edge of the
       street, in front of Group B. The dog has stopped, tail wagging, nose raised hopefully
       towards the grill; she is laughing and giving the lead a gentle tug while chatting with the
       father in the mustard T-shirt.
     • FURTHER DOWN THE STREET, near the vanishing point: another household is having its own
       small barbecue in front of its house - one small glowing grill and three or four people
       around it, one of them waving back up the street. This is small because it is far away,
       but it is clearly people, lit warm by their grill.

4. THE POMELO-PEEL HAT - DRAW IT EXACTLY LIKE THIS. After the fruit is eaten, half of the thick
   empty rind of a big pomelo is turned upside down and worn on the head like a small round
   helmet. It is a smooth dome, pale yellow-green on the outside, sitting snugly on top of the
   head and coming down to just above the eyebrows and the tops of the ears, with a thick band of
   pale cream-white pith showing along its cut lower rim. It is empty, hollow and light. It is
   NOT a whole fruit balanced on the head, NOT a bowl held in the hands, NOT a green cap with a
   brim, NOT a leafy crown. Exactly two people wear one: the father in the mustard T-shirt and
   the six-year-old boy.

5. THE DRINKS - A REAL TAIWANESE STREET-PARTY MIX, HELD IN PEOPLE'S HANDS. Draw four kinds and
   make each one recognisable by its shape:
     • HAND-SHAKEN TEA: a tall clear plastic cup with a flat sealed film lid and a fat straw
       pushed through it, the drink visible through the cup - one is golden-brown milk tea with
       dark tapioca pearls at the bottom, one is pale amber-green tea with ice. One stands on the
       camp table beside the grandmother; the nurse has one on the edge of the table next to her
       grill, half drunk.
     • GLASS BOTTLE SODA: a classic thick glass soda bottle, green-tinted or clear, with a short
       neck - the father in the mustard T-shirt holds one.
     • ALUMINIUM CANS: plain soft-drink cans in solid colours (red, green, silver) - the
       neighbour in the white vest holds one, and a few more stand in the ice of the open cooler.
     • WATER: a clear plastic bottle of water with no label - the mother holds one, and one or two
       more stand on the camp table.
   Every cup, bottle and can is PLAIN: any label is just a band of flat colour with nothing
   written on it, no logo, no brand, no character. These are soft drinks, tea and water only.
   The children and the receptionist are holding sparklers, not drinks.

6. THE SPARKLERS AND THE SMOKE.
     • Each sparkler is a thin wire with a small bright white-gold burst of tiny sparks at its tip
       and a short looping trail of light behind it in the air. Three sparklers in all, all in
       Group C. Nothing else explodes: no fireworks in the sky, no rockets, no firecrackers.
     • Smoke from the two grills is drawn as a small group of three or four short, soft,
       separate curling strokes rising and drifting towards the RIGHT, each no taller than a
       person's head. Never one long continuous ribbon of smoke, never a loop, never a big cloud
       that hides anyone.

7. THE FACES - HAPPY AND EASY. Real smiles and laughter: eyes curved into happy crescents,
   mouths open in laughter or in a broad smile, cheeks lifted. People are turned towards each
   other, talking, handing food across, leaning in. Everyone is kind to everyone - nobody is
   being laughed at, nobody is pointing at anyone, nobody is drunk, nobody is posing for a photo,
   nobody looks at the camera.

8. THE LIGHT - IT IS NIGHT, AND THE PICTURE MUST BE CLEARLY DARKER THAN THE DAYTIME ILLUSTRATION.
   Two kinds of light only:
     • COOL MOONLIGHT over everything: the concrete wall is a mid cool blue-grey, NOT pale, NOT
       cream, NOT white; the street is a deep blue-grey; the sky is deep indigo.
     • ONE FAMILY OF WARM LIGHT from the party: the glow of the two grills, the camping lantern,
       the amber insides of the window boxes, the glass of the covered walkway, and the sparkler
       tips. Each is a small pool of warm orange-gold that falls off quickly into the blue: it
       lights the faces, hands and clothes of the people nearest to it, warm on the side facing
       the light and blue on the side facing away.
   From brightest to darkest: the moon and the sparkler tips; then the grill glow, the lantern
   and the lit glass; then the faces lit by them; then the window boxes; then the concrete wall
   and the clouds; then the sky; darkest of all, the street in the distance.

9. COLOUR. Night blues and warm orange-gold light, with the clothes as the colour accents: sage
   green, dusty rose, terracotta, navy, mustard yellow, pale sky blue, coral, cream, dark green,
   lilac - every person in a different colour from their neighbours. The pomelo hats and the
   pomelo on the table are a fresh pale yellow-green. At least eight distinct colours must be
   readable. Not monochrome, not sepia, not all-orange, not all-blue, not washed out to pale.

10. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters, logos,
   brand marks, captions, signatures or watermarks, in any language. The real building has
   Chinese lettering on its column and above its entrance, and the provided photograph has a
   photographer's watermark along its bottom edge: IGNORE ALL OF THEM and leave those surfaces
   plain. The mooncakes are plain round cakes with no stamped characters. The cooler box, the
   camp chairs, the grills, the tea cups and their sealed lids, the soda bottles, the cans,
   the water bottles, the phone, the lantern, the scooter, its helmet, its
   number plate (blank), the bag of ice, the food bag, the dog's lead and every piece of clothing
   are plain, with no logo and no writing.

AVOID: any letters, words, Chinese characters, logos or watermarks anywhere, including the
photographer's watermark and the lettering on the clinic copied from the photograph; stamped
characters on the mooncakes; any brand, logo or writing on a cup, cup lid, bottle or can;
beer, beer bottles, wine or anyone drunk; a cup of tea drawn as a paper cup or a mug; parked cars, a traffic
cone; fireworks, rockets or bursts in the sky; long white curving wind lines or chalk ribbons in
the sky; one long ribbon of smoke; a pomelo hat drawn as a whole fruit, a bowl, a brimmed cap or
a crown; more than two people wearing pomelo hats; moving, redrawing, restyling or removing any of the
ten people from the earlier attempt; a newcomer standing in front of and hiding one of the
original people; a scooter with its headlight on or moving fast; a helmet with a logo; a dog on
the table or eating from the grill; a big crowd or a street festival with stalls; a sparkler near a grill or near anyone's face;
the moon cropped, covered by cloud, drawn with a face or a rabbit, or drawn huge like a poster;
a cloudless empty sky or a sky full of heavy clouds; daylight, a blue daytime sky, sunset
orange; a pale, cream or brightly lit wall; a washed-out high-key picture; a black sky; dental
instruments, dental chairs, teeth, X-rays; anyone crying, drunk, mocking, pointing or looking at
the camera; a posed row of people facing the viewer; an empty middle stretch of street;
anyone drawn pale, faint, translucent or in outline only; a re-invented or re-proportioned
building; the building mirrored to the other side of the picture; photo-realism; 3D rendering;
anime; thick uniform black outlines; greyscale.
```

---

## 七、第四版（2026-09-25）：**只修柚子帽** —— 形狀對了但太大，出圖是 `v4-result.jpg`；現行是第八節

使用者看第三版出的圖（`drafts/mid-autumn/v3-result.jpg`）：「不錯不錯 柚子帽修一下」，
附了一張 IG 限動（asarisoba 畫的兩隻鳥戴柚子帽）當形狀參考。

**第三版那兩頂畫成了光滑的黃色毛帽。** 真正的柚子帽是**果皮從頂上劃成幾瓣、果肉拿掉、整張皮倒扣**，
所以認得出來靠兩件：**四五片圓鼓的瓣**（瓣與瓣之間有裂縫）＋ **每一片下緣往外翻、露出一圈白色的厚皮**。
第一版只寫了「光滑的圓頂 ＋ 下緣一圈白」，**「光滑的圓頂」正是毛帽的形狀** —— 這一版改用參考圖給形狀
（ILLUSTRATION.md 第十之一節：形狀不要用文字描述，用參考圖）。

**餵圖兩張：**

| | 檔案 | 用途 |
| --- | --- | --- |
| 1 | `drafts/mid-autumn/v3-result.jpg`（第三版的圖） | 底圖，除了兩頂帽子**全部不動** |
| 2 | `drafts/mid-autumn/refs/5-pomelo-hat-shape.jpg` | **只參考帽子的形狀** |

⚠ 2 是從截圖裁出來的（`node drafts/mid-autumn/hat-ref-crop.mjs`），**「中秋節快樂!!」與署名 @asarisoba 已經裁掉** ——
留著會被抄進畫面。那是別人的作品，只給模型看形狀，不上線。
⚠ 提示詞明講**不要學它的鳥、平塗卡通風、粗黑線、米色底** —— 一張參考圖只准提供一件事。

```
Editorial illustration, landscape 4:3. One single continuous scene, no panels, no insets, no
borders.

STYLE - THIS IS THE MOST IMPORTANT PARAGRAPH. It must look exactly like the hand-drawn editorial
illustration provided. Thin hand-drawn linework in warm dark brown or soft charcoal, the
weight varying, strokes tapering and sometimes breaking - not a thick even outline and not a
ruled vector line. Colour laid on like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue; gradients
only where they describe light. A fine even coloured-pencil paper grain over EVERY surface of
the picture, including the night sky. People are simplified but naturally proportioned, with
believable ages: each face is one flat skin tone with only its outline, eyes as small dots or
short curved lines, two short eyebrows, a tiny nose mark, a small mouth and an ear - no
wrinkles, no cheek lines, no realistic shading. Clothes are drawn with two or three tones each,
with folds, cuffs, collars and hems visible. Not photo-realistic, not 3D, not anime, not a
children's cartoon.

TWO PICTURES ARE PROVIDED, AND THEY DO DIFFERENT JOBS:
  • THE BIG PICTURE OF THIS PARTY AT NIGHT IS AN EARLIER ATTEMPT, AND IT IS ALREADY RIGHT. Keep its
    framing, its building, its sky and moon, its light, its colours, its drawing style, and EVERY
    ONE OF ITS PEOPLE, THE DOG, THE SCOOTER AND ALL THE PROPS - their places, sizes, poses,
    clothes and drinks - exactly as they are. Do not move, redraw, restyle, add or remove anyone.
  • THE SMALL DRAWING OF TWO BIRDS IS ONLY A SHAPE GUIDE FOR THE POMELO-PEEL HAT. Copy nothing else
    from it: not the birds, not its flat cartoon style, not its thick black outlines, not its
    beige background.
THE ONLY CHANGE THIS ROUND: THE TWO POMELO-PEEL HATS ARE REDRAWN - see section 4.

THE STORY IN ONE SENTENCE: it is the night of the Mid-Autumn Festival in a small Taiwanese town,
the full moon is up, and outside the dental clinic in the provided picture the clinic's staff,
a few neighbours and some of their patients are having a relaxed street barbecue together, like
old friends - grilling, chatting, eating pomelo, and the children are waving sparklers. The mood
is warm, easy and happy: a neighbourhood party, not a staged group photo.

1. THE PLACE AND THE VIEWPOINT ARE COPIED FROM THE PROVIDED PICTURE. Same low camera, same
   framing, same proportions. Redraw it in the illustration style; do not re-invent it:
     • The building fills the LEFT two-thirds of the picture. Its front corner is near the left
       edge; its long side wall runs away from us towards the RIGHT, getting smaller, and the
       quiet narrow street runs beside it into the distance towards a vanishing point just
       right of centre.
     • The side wall is smooth warm-grey concrete with a slightly rough hand-plastered texture.
       Set into it are deep projecting window boxes of dark rusty-brown metal, their insides
       glowing warm amber, staggered across three floors exactly as in the provided picture. Thin
       horizontal concrete ledges run across the wall. A timber roof structure with a pitched
       dark roof sits on top.
     • At the lower left, the ground floor is set back into a covered walkway with tall dark
       brown metal-clad columns and a floor-to-ceiling glass front; warm light spills out of the
       glass onto the walkway floor.
     • A row of small round grey concrete pots with green leafy plants stands along the foot of
       the side wall.
     • Further down the street on the right, the neighbouring buildings with small lit windows,
       a few overhead wires, and at the far right edge the dark eaves of an old house, cropped.
     • The street tonight has NO CARS parked on it and no traffic cone - it has been given over
       to the party.
   There is no wind line of any kind in this picture - no long white curving lines in the sky.

2. THE SKY AND THE MOON. The sky fills the upper RIGHT part of the picture, above the street and
   to the right of the building's roof. It is a deep dusky indigo-blue night sky - clearly dark,
   never black, never flat, with the fine paper grain showing through it.
     • THE FULL MOON sits high in that patch of sky, in the upper right quarter of the picture,
       well clear of the roofline and of the picture edge. It is perfectly round and completely
       full, a pale warm cream, about as wide as one of the window boxes on the near wall, with
       one soft pale halo around it. No face, no rabbit, no craters drawn as a pattern.
     • A FEW THIN CLOUDS drift in long soft horizontal wisps across the sky, two or three of them,
       their edges lit silver-white by the moon. One passes just below the moon; NONE of them
       covers it. The sky is mostly clear.

3. THE PARTY - WHO IS WHERE. About twenty people in all - the ten already in the earlier attempt
   plus the newcomers in GROUP D - all East Asian (Taiwanese), spread across the
   lower half of the picture along the pavement at the foot of the side wall and out into the
   quiet street, in three loose groups with space between them. The nearest people are large:
   the head of the nearest standing adult reaches roughly the first-floor ledge of the building.
   Nobody looks at the camera.
   GROUP A - THE MODERN CAMPING CORNER, LOWER LEFT, just in front of the covered walkway:
     • A low slatted wooden folding camp table and three or four canvas folding camp chairs in
       olive, sand and dark green, a hanging camping lantern with a warm glow on a slim black
       stand, a hard-sided cooler box standing open and full of ice with drinks in it (see section
       5), and a neat compact charcoal barbecue grill on legs - the
       kind of good-looking, carefully chosen outdoor gear people bring to a glamping weekend.
     • A dental nurse in her late twenties, in pale sage-green scrubs with a dusty-rose cardigan
       over them, stands at this grill turning skewers with long tongs, laughing at something.
     • An older neighbour, a grandmother in her seventies from the old house next door, in a
       terracotta-patterned blouse, sits in a camp chair peeling a big pomelo on her lap,
       pulling the thick rind apart in large curved pieces. On the table: a plate of pomelo
       segments, a plate of round mooncakes, and beside her a hand-shaken tea (see section 5).
   GROUP B - THE CLASSIC STREET BARBECUE, CENTRE, on the pavement against the side wall among
   the concrete pots:
     • A simple low rectangular metal charcoal grill set directly on two bricks on the ground,
       the traditional Taiwanese way. Two people crouch or sit on small low plastic stools beside
       it: a dentist in his forties in a navy polo shirt, brushing sauce onto skewers with a
       small brush, and a middle-aged neighbour in a white vest and faded blue shorts with flip-
       flops, fanning the coals with a round woven fan in one hand, an aluminium can of soft drink in the
       other. Skewers of meat, sausages, corn, green
       peppers and slices of toast on the grill.
     • A patient's father in his late thirties, in a mustard-yellow T-shirt, stands beside them
       holding a paper plate in one hand and a glass bottle of soda in the other, WEARING A POMELO-PEEL HAT (see section 4), grinning while the
       dentist hands him a skewer.
   GROUP C - THE SPARKLERS, RIGHT FOREGROUND, out on the empty street where it is safely away
   from both grills:
     • Two children, a boy of about six in a pale sky-blue T-shirt WEARING A POMELO-PEEL HAT, and
       a girl of about nine in a coral dress, each holding one lit sparkler out at arm's length,
       drawing loops of light in the air, delighted.
     • The clinic's receptionist, a woman in her thirties in a cream blouse and dark green
       trousers, crouches beside them holding a sparkler of her own and lighting the boy's
       from it.
     • The children's mother, in a soft lilac top, stands just behind them filming them on her
       phone, the phone screen facing away from us, a bottle of water in her other hand.
   GROUP D - PASSERS-BY AND LATE ARRIVALS (already in the earlier attempt - keep them as they are), placed in the EMPTY STRETCH OF STREET in
   the middle distance, between Group B and Group C and further back down the street towards the
   vanishing point. They are a little smaller than the front groups because they are further away,
   but drawn with exactly the same line weight, the same solidity of colour and the same simple
   happy faces - clearly readable people, not faint or tiny specks:
     • A FRIEND ARRIVING BY SCOOTER: a young man in his twenties in a khaki jacket has just pulled
       up at the kerb on an ordinary Taiwanese step-through scooter, the engine off and the
       headlight off, one foot on the ground, his plain open-face helmet pushed back. Hanging from
       the hook between his knees is a bulging bag of food for the grill - a tray of skewers,
       corn cobs, a bunch of green onions - and on the footboard sits a big clear bag of ice. In
       his raised hand he holds out a clear plastic drink carrier with four hand-shaken teas. A
       newly arrived woman in a teal top is walking over from the party, one arm raised in
       welcome, to take the bag of food from him.
     • AN OLDER COUPLE ON THEIR EVENING WALK: a grey-haired man in a short-sleeved checked shirt
       and his wife in a soft plum cardigan, strolling slowly down the middle of the street arm in
       arm. He lifts his free hand to wave hello to the grill group; she laughs and calls out
       something. They are passing by, not joining in - just greeting old neighbours.
     • A WOMAN WALKING HER DOG: a woman in her fifties in a pale olive T-shirt and cropped
       trousers walks a medium-sized fluffy honey-coloured dog on a red lead along the edge of the
       street, in front of Group B. The dog has stopped, tail wagging, nose raised hopefully
       towards the grill; she is laughing and giving the lead a gentle tug while chatting with the
       father in the mustard T-shirt.
     • FURTHER DOWN THE STREET, near the vanishing point: another household is having its own
       small barbecue in front of its house - one small glowing grill and three or four people
       around it, one of them waving back up the street. This is small because it is far away,
       but it is clearly people, lit warm by their grill.

4. THE POMELO-PEEL HAT - THE ONLY THING BEING REDRAWN THIS ROUND. In the earlier attempt the two
   hats look like smooth yellow knitted beanies; that is wrong. Redraw ONLY those two hats, using
   the small drawing of two birds wearing pomelo peel as the guide to the SHAPE (not to the style,
   not to the birds). This is how it is really made: the pomelo's thick rind is scored from the
   top into wedges, the fruit is lifted out, and the whole rind - still one piece, joined at the
   stem end - is turned upside down and put on the head. So it reads like this:
     • FOUR OR FIVE BIG ROUNDED LOBES OF PEEL, like the petals of a fat open flower turned upside
       down, all joined together at the crown of the head and hanging down around it on every
       side. Between the lobes there are clear dark splits where they part.
     • Each lobe is thick and curved, its outside a fresh bright yellow-green with a slightly
       dimpled skin, and its lower tip curls slightly OUTWARDS, so that along the bottom edge of
       every lobe a thick band of creamy WHITE PITH shows. That green-over-white edge is what makes
       it read as pomelo peel and not as a hat.
     • The lobes come down to about the eyebrows at the front and over the tops of the ears; the
       face is fully visible under them. The peel is empty and light, sitting loosely, a little
       lopsided.
   Exactly two people wear one, the same two as before: the father in the mustard T-shirt and the
   six-year-old boy. Their faces, poses and everything else about them stay exactly as they are.
   It is NOT a smooth dome, NOT a knitted beanie, NOT a cap with a brim, NOT a whole fruit, NOT a
   bowl, NOT a leafy crown or a wreath, NOT a bird.

5. THE DRINKS - A REAL TAIWANESE STREET-PARTY MIX, HELD IN PEOPLE'S HANDS. Draw four kinds and
   make each one recognisable by its shape:
     • HAND-SHAKEN TEA: a tall clear plastic cup with a flat sealed film lid and a fat straw
       pushed through it, the drink visible through the cup - one is golden-brown milk tea with
       dark tapioca pearls at the bottom, one is pale amber-green tea with ice. One stands on the
       camp table beside the grandmother; the nurse has one on the edge of the table next to her
       grill, half drunk.
     • GLASS BOTTLE SODA: a classic thick glass soda bottle, green-tinted or clear, with a short
       neck - the father in the mustard T-shirt holds one.
     • ALUMINIUM CANS: plain soft-drink cans in solid colours (red, green, silver) - the
       neighbour in the white vest holds one, and a few more stand in the ice of the open cooler.
     • WATER: a clear plastic bottle of water with no label - the mother holds one, and one or two
       more stand on the camp table.
   Every cup, bottle and can is PLAIN: any label is just a band of flat colour with nothing
   written on it, no logo, no brand, no character. These are soft drinks, tea and water only.
   The children and the receptionist are holding sparklers, not drinks.

6. THE SPARKLERS AND THE SMOKE.
     • Each sparkler is a thin wire with a small bright white-gold burst of tiny sparks at its tip
       and a short looping trail of light behind it in the air. Three sparklers in all, all in
       Group C. Nothing else explodes: no fireworks in the sky, no rockets, no firecrackers.
     • Smoke from the two grills is drawn as a small group of three or four short, soft,
       separate curling strokes rising and drifting towards the RIGHT, each no taller than a
       person's head. Never one long continuous ribbon of smoke, never a loop, never a big cloud
       that hides anyone.

7. THE FACES - HAPPY AND EASY. Real smiles and laughter: eyes curved into happy crescents,
   mouths open in laughter or in a broad smile, cheeks lifted. People are turned towards each
   other, talking, handing food across, leaning in. Everyone is kind to everyone - nobody is
   being laughed at, nobody is pointing at anyone, nobody is drunk, nobody is posing for a photo,
   nobody looks at the camera.

8. THE LIGHT - IT IS NIGHT, AND THE PICTURE MUST BE CLEARLY DARKER THAN THE DAYTIME ILLUSTRATION.
   Two kinds of light only:
     • COOL MOONLIGHT over everything: the concrete wall is a mid cool blue-grey, NOT pale, NOT
       cream, NOT white; the street is a deep blue-grey; the sky is deep indigo.
     • ONE FAMILY OF WARM LIGHT from the party: the glow of the two grills, the camping lantern,
       the amber insides of the window boxes, the glass of the covered walkway, and the sparkler
       tips. Each is a small pool of warm orange-gold that falls off quickly into the blue: it
       lights the faces, hands and clothes of the people nearest to it, warm on the side facing
       the light and blue on the side facing away.
   From brightest to darkest: the moon and the sparkler tips; then the grill glow, the lantern
   and the lit glass; then the faces lit by them; then the window boxes; then the concrete wall
   and the clouds; then the sky; darkest of all, the street in the distance.

9. COLOUR. Night blues and warm orange-gold light, with the clothes as the colour accents: sage
   green, dusty rose, terracotta, navy, mustard yellow, pale sky blue, coral, cream, dark green,
   lilac - every person in a different colour from their neighbours. The pomelo hats and the
   pomelo on the table are a fresh pale yellow-green. At least eight distinct colours must be
   readable. Not monochrome, not sepia, not all-orange, not all-blue, not washed out to pale.

10. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters, logos,
   brand marks, captions, signatures or watermarks, in any language. The real building has
   Chinese lettering on its column and above its entrance, and the provided photograph has a
   photographer's watermark along its bottom edge: IGNORE ALL OF THEM and leave those surfaces
   plain. The mooncakes are plain round cakes with no stamped characters. The cooler box, the
   camp chairs, the grills, the tea cups and their sealed lids, the soda bottles, the cans,
   the water bottles, the phone, the lantern, the scooter, its helmet, its
   number plate (blank), the bag of ice, the food bag, the dog's lead and every piece of clothing
   are plain, with no logo and no writing.

AVOID: any letters, words, Chinese characters, logos or watermarks anywhere, including the
photographer's watermark and the lettering on the clinic copied from the photograph; stamped
characters on the mooncakes; any brand, logo or writing on a cup, cup lid, bottle or can;
beer, beer bottles, wine or anyone drunk; a cup of tea drawn as a paper cup or a mug; parked cars, a traffic
cone; fireworks, rockets or bursts in the sky; long white curving wind lines or chalk ribbons in
the sky; one long ribbon of smoke; a pomelo hat drawn as a whole fruit, a bowl, a brimmed cap or
a crown; a smooth yellow dome; a knitted beanie; a hat with no white pith showing at its edge;
more than two people wearing pomelo hats; birds anywhere in the picture; the cartoon style or
thick black outlines of the bird drawing; moving, redrawing, restyling, adding or removing any
person, the dog or the scooter; a scooter with its headlight on or moving fast; a helmet with a logo; a dog on
the table or eating from the grill; a big crowd or a street festival with stalls; a sparkler near a grill or near anyone's face;
the moon cropped, covered by cloud, drawn with a face or a rabbit, or drawn huge like a poster;
a cloudless empty sky or a sky full of heavy clouds; daylight, a blue daytime sky, sunset
orange; a pale, cream or brightly lit wall; a washed-out high-key picture; a black sky; dental
instruments, dental chairs, teeth, X-rays; anyone crying, drunk, mocking, pointing or looking at
the camera; a posed row of people facing the viewer; an empty middle stretch of street;
anyone drawn pale, faint, translucent or in outline only; a re-invented or re-proportioned
building; the building mirrored to the other side of the picture; photo-realism; 3D rendering;
anime; thick uniform black outlines; greyscale.
```

---

## 八、⭐ 第五版（2026-09-25）：**老夫妻搬出門、柚子帽縮小** —— 現行版本

使用者看第四版出的圖（`drafts/mid-autumn/v4-result.jpg`）：

> 門裡的兩位老夫婦要移出來 讓他們從左邊的路口走來向烤肉的人們打招呼
> 另外柚子皮帽太大了 不合理

1. **老夫妻**：第三版就被放進診所玻璃門裡（第七節最後提過，當時沒改）。這一版寫死
   **畫面最左邊、從建築轉角那邊沿人行道走進來、在柱子外面不在騎樓裡、在露營燈架旁邊**，
   並明講**玻璃門裡要空著**（只寫「移出來」，模型可能會留一對在門裡、外面再畫一對）。
   大小寫成**和阿嬤、護理師一樣大** —— 他們和前景一樣近，不然會被畫成遠處的小人。
   順手讓阿嬤轉頭回應，打招呼才有對象。
2. **柚子帽**：形狀對了（分瓣、白皮），**只有尺寸錯**：瓣往上豎、往外張，比頭還大。
   用「柚子本來就和頭差不多大」當理由，給可以量的錨點：**整張皮不大於頭、頂上最多一指寬、
   不超出頭的兩側、瓣全部往下貼著頭**。
   ⚠ 第四版的 `「lower tip curls OUTWARDS」` 大概就是瓣往外張的成因 —— 這一版改成「只有最尖端微翹」。

**餵圖只要一張：`v4-result.jpg`**。柚子帽形狀的參考圖（鳥）這一輪**不要**再餵 —— 形狀已經對了，
再餵反而多一個被抄的風險；提示詞裡跟鳥有關的句子也一併拿掉。

```
Editorial illustration, landscape 4:3. One single continuous scene, no panels, no insets, no
borders.

STYLE - THIS IS THE MOST IMPORTANT PARAGRAPH. It must look exactly like the hand-drawn editorial
illustration provided. Thin hand-drawn linework in warm dark brown or soft charcoal, the
weight varying, strokes tapering and sometimes breaking - not a thick even outline and not a
ruled vector line. Colour laid on like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue; gradients
only where they describe light. A fine even coloured-pencil paper grain over EVERY surface of
the picture, including the night sky. People are simplified but naturally proportioned, with
believable ages: each face is one flat skin tone with only its outline, eyes as small dots or
short curved lines, two short eyebrows, a tiny nose mark, a small mouth and an ear - no
wrinkles, no cheek lines, no realistic shading. Clothes are drawn with two or three tones each,
with folds, cuffs, collars and hems visible. Not photo-realistic, not 3D, not anime, not a
children's cartoon.

THE PROVIDED PICTURE OF THIS PARTY AT NIGHT IS AN EARLIER ATTEMPT, AND ALMOST ALL OF IT IS RIGHT.
Keep its framing, its building, its sky and moon, its light, its colours, its drawing style, and
every one of its people, the dog, the scooter and all the props - their places, sizes, poses,
clothes and drinks - exactly as they are. THERE ARE ONLY TWO CHANGES THIS ROUND:
  • THE OLDER COUPLE STANDING INSIDE THE LIT GLASS DOORWAY OF THE CLINIC ARE MOVED OUT OF IT. They
    now come walking in from the LEFT EDGE of the picture along the pavement - see GROUP D in
    section 3. The glass doorway is left EMPTY: just the warm lit interior, nobody in it.
  • THE TWO POMELO-PEEL HATS ARE MADE MUCH SMALLER - see section 4. Their shape (lobes of green
    peel with white pith at the edges) is already right; only their size is wrong.
Nothing else moves and nothing else is redrawn.

THE STORY IN ONE SENTENCE: it is the night of the Mid-Autumn Festival in a small Taiwanese town,
the full moon is up, and outside the dental clinic in the provided picture the clinic's staff,
a few neighbours and some of their patients are having a relaxed street barbecue together, like
old friends - grilling, chatting, eating pomelo, and the children are waving sparklers. The mood
is warm, easy and happy: a neighbourhood party, not a staged group photo.

1. THE PLACE AND THE VIEWPOINT ARE COPIED FROM THE PROVIDED PICTURE. Same low camera, same
   framing, same proportions. Redraw it in the illustration style; do not re-invent it:
     • The building fills the LEFT two-thirds of the picture. Its front corner is near the left
       edge; its long side wall runs away from us towards the RIGHT, getting smaller, and the
       quiet narrow street runs beside it into the distance towards a vanishing point just
       right of centre.
     • The side wall is smooth warm-grey concrete with a slightly rough hand-plastered texture.
       Set into it are deep projecting window boxes of dark rusty-brown metal, their insides
       glowing warm amber, staggered across three floors exactly as in the provided picture. Thin
       horizontal concrete ledges run across the wall. A timber roof structure with a pitched
       dark roof sits on top.
     • At the lower left, the ground floor is set back into a covered walkway with tall dark
       brown metal-clad columns and a floor-to-ceiling glass front; warm light spills out of the
       glass onto the walkway floor.
     • A row of small round grey concrete pots with green leafy plants stands along the foot of
       the side wall.
     • Further down the street on the right, the neighbouring buildings with small lit windows,
       a few overhead wires, and at the far right edge the dark eaves of an old house, cropped.
     • The street tonight has NO CARS parked on it and no traffic cone - it has been given over
       to the party.
   There is no wind line of any kind in this picture - no long white curving lines in the sky.

2. THE SKY AND THE MOON. The sky fills the upper RIGHT part of the picture, above the street and
   to the right of the building's roof. It is a deep dusky indigo-blue night sky - clearly dark,
   never black, never flat, with the fine paper grain showing through it.
     • THE FULL MOON sits high in that patch of sky, in the upper right quarter of the picture,
       well clear of the roofline and of the picture edge. It is perfectly round and completely
       full, a pale warm cream, about as wide as one of the window boxes on the near wall, with
       one soft pale halo around it. No face, no rabbit, no craters drawn as a pattern.
     • A FEW THIN CLOUDS drift in long soft horizontal wisps across the sky, two or three of them,
       their edges lit silver-white by the moon. One passes just below the moon; NONE of them
       covers it. The sky is mostly clear.

3. THE PARTY - WHO IS WHERE. About twenty people in all - the ten already in the earlier attempt
   plus the newcomers in GROUP D - all East Asian (Taiwanese), spread across the
   lower half of the picture along the pavement at the foot of the side wall and out into the
   quiet street, in three loose groups with space between them. The nearest people are large:
   the head of the nearest standing adult reaches roughly the first-floor ledge of the building.
   Nobody looks at the camera.
   GROUP A - THE MODERN CAMPING CORNER, LOWER LEFT, just in front of the covered walkway:
     • A low slatted wooden folding camp table and three or four canvas folding camp chairs in
       olive, sand and dark green, a hanging camping lantern with a warm glow on a slim black
       stand, a hard-sided cooler box standing open and full of ice with drinks in it (see section
       5), and a neat compact charcoal barbecue grill on legs - the
       kind of good-looking, carefully chosen outdoor gear people bring to a glamping weekend.
     • A dental nurse in her late twenties, in pale sage-green scrubs with a dusty-rose cardigan
       over them, stands at this grill turning skewers with long tongs, laughing at something.
     • An older neighbour, a grandmother in her seventies from the old house next door, in a
       terracotta-patterned blouse, sits in a camp chair peeling a big pomelo on her lap,
       pulling the thick rind apart in large curved pieces. On the table: a plate of pomelo
       segments, a plate of round mooncakes, and beside her a hand-shaken tea (see section 5).
   GROUP B - THE CLASSIC STREET BARBECUE, CENTRE, on the pavement against the side wall among
   the concrete pots:
     • A simple low rectangular metal charcoal grill set directly on two bricks on the ground,
       the traditional Taiwanese way. Two people crouch or sit on small low plastic stools beside
       it: a dentist in his forties in a navy polo shirt, brushing sauce onto skewers with a
       small brush, and a middle-aged neighbour in a white vest and faded blue shorts with flip-
       flops, fanning the coals with a round woven fan in one hand, an aluminium can of soft drink in the
       other. Skewers of meat, sausages, corn, green
       peppers and slices of toast on the grill.
     • A patient's father in his late thirties, in a mustard-yellow T-shirt, stands beside them
       holding a paper plate in one hand and a glass bottle of soda in the other, WEARING A POMELO-PEEL HAT (see section 4), grinning while the
       dentist hands him a skewer.
   GROUP C - THE SPARKLERS, RIGHT FOREGROUND, out on the empty street where it is safely away
   from both grills:
     • Two children, a boy of about six in a pale sky-blue T-shirt WEARING A POMELO-PEEL HAT, and
       a girl of about nine in a coral dress, each holding one lit sparkler out at arm's length,
       drawing loops of light in the air, delighted.
     • The clinic's receptionist, a woman in her thirties in a cream blouse and dark green
       trousers, crouches beside them holding a sparkler of her own and lighting the boy's
       from it.
     • The children's mother, in a soft lilac top, stands just behind them filming them on her
       phone, the phone screen facing away from us, a bottle of water in her other hand.
   GROUP D - PASSERS-BY AND LATE ARRIVALS (already in the earlier attempt - keep them as they are), placed in the EMPTY STRETCH OF STREET in
   the middle distance, between Group B and Group C and further back down the street towards the
   vanishing point. They are a little smaller than the front groups because they are further away,
   but drawn with exactly the same line weight, the same solidity of colour and the same simple
   happy faces - clearly readable people, not faint or tiny specks:
     • A FRIEND ARRIVING BY SCOOTER: a young man in his twenties in a khaki jacket has just pulled
       up at the kerb on an ordinary Taiwanese step-through scooter, the engine off and the
       headlight off, one foot on the ground, his plain open-face helmet pushed back. Hanging from
       the hook between his knees is a bulging bag of food for the grill - a tray of skewers,
       corn cobs, a bunch of green onions - and on the footboard sits a big clear bag of ice. In
       his raised hand he holds out a clear plastic drink carrier with four hand-shaken teas. A
       newly arrived woman in a teal top is walking over from the party, one arm raised in
       welcome, to take the bag of food from him.
     • AN OLDER COUPLE ON THEIR EVENING WALK - MOVED THIS ROUND: the same grey-haired man in a
       short-sleeved checked shirt and his wife in a soft plum cardigan who were standing inside
       the clinic's glass doorway. They are NOT inside the clinic any more. They have just come
       round the corner of the building at the far LEFT EDGE of the picture, walking arm in arm
       along the pavement from the left towards the right, IN FRONT OF THE COLUMNS AND OUTSIDE
       the covered walkway, at the left-hand end of the camping corner, beside the lantern
       stand. They are the same size as the grandmother and the nurse, because they are just as
       close to us. He lifts his free hand high to wave hello to the people at the grills; she
       laughs and calls out to them. The grandmother in the camp chair has turned her head
       towards them and is smiling back. They are passing by on their evening walk, not joining
       in - just greeting old neighbours.
     • A WOMAN WALKING HER DOG: a woman in her fifties in a pale olive T-shirt and cropped
       trousers walks a medium-sized fluffy honey-coloured dog on a red lead along the edge of the
       street, in front of Group B. The dog has stopped, tail wagging, nose raised hopefully
       towards the grill; she is laughing and giving the lead a gentle tug while chatting with the
       father in the mustard T-shirt.
     • FURTHER DOWN THE STREET, near the vanishing point: another household is having its own
       small barbecue in front of its house - one small glowing grill and three or four people
       around it, one of them waving back up the street. This is small because it is far away,
       but it is clearly people, lit warm by their grill.

4. THE POMELO-PEEL HAT - MAKE IT MUCH SMALLER. In the earlier attempt the shape is right but the
   two hats are far too big: they rise high above the heads and the lobes stand up and flare out
   like a giant flower, bigger than the head itself. That is impossible - a pomelo is only about
   the size of a person's head, so its empty rind fits the head like a snug cap. Redraw ONLY the
   two hats, keeping their colours and their lobes, at this size:
     • THE WHOLE PEEL IS NO BIGGER THAN THE WEARER'S OWN HEAD. It hugs the skull like a swimming
       cap: it adds only a thin layer on top, never more than a finger's width above the top of
       the head, and it never sticks out past the sides of the head.
     • The four or five lobes of peel all HANG DOWNWARDS, lying close against the head, joined at
       the crown - none of them stands up, points upwards or flares outwards. Only their very
       tips curl out a little at the bottom edge, just enough to show a thin band of creamy WHITE
       PITH under the fresh yellow-green skin.
     • The lobes reach down to about the eyebrows at the front and just over the tops of the
       ears; the face is fully visible.
   The six-year-old boy's peel is proportionally just as snug on his smaller head. Exactly two
   people wear one, the same two as before: the father in the mustard T-shirt and the boy. Their
   faces, poses and everything else about them stay exactly as they are. It is NOT a smooth dome,
   NOT a knitted beanie, NOT a cap with a brim, NOT a whole fruit, NOT a bowl, NOT a leafy crown.

5. THE DRINKS - A REAL TAIWANESE STREET-PARTY MIX, HELD IN PEOPLE'S HANDS. Draw four kinds and
   make each one recognisable by its shape:
     • HAND-SHAKEN TEA: a tall clear plastic cup with a flat sealed film lid and a fat straw
       pushed through it, the drink visible through the cup - one is golden-brown milk tea with
       dark tapioca pearls at the bottom, one is pale amber-green tea with ice. One stands on the
       camp table beside the grandmother; the nurse has one on the edge of the table next to her
       grill, half drunk.
     • GLASS BOTTLE SODA: a classic thick glass soda bottle, green-tinted or clear, with a short
       neck - the father in the mustard T-shirt holds one.
     • ALUMINIUM CANS: plain soft-drink cans in solid colours (red, green, silver) - the
       neighbour in the white vest holds one, and a few more stand in the ice of the open cooler.
     • WATER: a clear plastic bottle of water with no label - the mother holds one, and one or two
       more stand on the camp table.
   Every cup, bottle and can is PLAIN: any label is just a band of flat colour with nothing
   written on it, no logo, no brand, no character. These are soft drinks, tea and water only.
   The children and the receptionist are holding sparklers, not drinks.

6. THE SPARKLERS AND THE SMOKE.
     • Each sparkler is a thin wire with a small bright white-gold burst of tiny sparks at its tip
       and a short looping trail of light behind it in the air. Three sparklers in all, all in
       Group C. Nothing else explodes: no fireworks in the sky, no rockets, no firecrackers.
     • Smoke from the two grills is drawn as a small group of three or four short, soft,
       separate curling strokes rising and drifting towards the RIGHT, each no taller than a
       person's head. Never one long continuous ribbon of smoke, never a loop, never a big cloud
       that hides anyone.

7. THE FACES - HAPPY AND EASY. Real smiles and laughter: eyes curved into happy crescents,
   mouths open in laughter or in a broad smile, cheeks lifted. People are turned towards each
   other, talking, handing food across, leaning in. Everyone is kind to everyone - nobody is
   being laughed at, nobody is pointing at anyone, nobody is drunk, nobody is posing for a photo,
   nobody looks at the camera.

8. THE LIGHT - IT IS NIGHT, AND THE PICTURE MUST BE CLEARLY DARKER THAN THE DAYTIME ILLUSTRATION.
   Two kinds of light only:
     • COOL MOONLIGHT over everything: the concrete wall is a mid cool blue-grey, NOT pale, NOT
       cream, NOT white; the street is a deep blue-grey; the sky is deep indigo.
     • ONE FAMILY OF WARM LIGHT from the party: the glow of the two grills, the camping lantern,
       the amber insides of the window boxes, the glass of the covered walkway, and the sparkler
       tips. Each is a small pool of warm orange-gold that falls off quickly into the blue: it
       lights the faces, hands and clothes of the people nearest to it, warm on the side facing
       the light and blue on the side facing away.
   From brightest to darkest: the moon and the sparkler tips; then the grill glow, the lantern
   and the lit glass; then the faces lit by them; then the window boxes; then the concrete wall
   and the clouds; then the sky; darkest of all, the street in the distance.

9. COLOUR. Night blues and warm orange-gold light, with the clothes as the colour accents: sage
   green, dusty rose, terracotta, navy, mustard yellow, pale sky blue, coral, cream, dark green,
   lilac - every person in a different colour from their neighbours. The pomelo hats and the
   pomelo on the table are a fresh pale yellow-green. At least eight distinct colours must be
   readable. Not monochrome, not sepia, not all-orange, not all-blue, not washed out to pale.

10. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters, logos,
   brand marks, captions, signatures or watermarks, in any language. The real building has
   Chinese lettering on its column and above its entrance, and the provided photograph has a
   photographer's watermark along its bottom edge: IGNORE ALL OF THEM and leave those surfaces
   plain. The mooncakes are plain round cakes with no stamped characters. The cooler box, the
   camp chairs, the grills, the tea cups and their sealed lids, the soda bottles, the cans,
   the water bottles, the phone, the lantern, the scooter, its helmet, its
   number plate (blank), the bag of ice, the food bag, the dog's lead and every piece of clothing
   are plain, with no logo and no writing.

AVOID: any letters, words, Chinese characters, logos or watermarks anywhere, including the
photographer's watermark and the lettering on the clinic copied from the photograph; stamped
characters on the mooncakes; any brand, logo or writing on a cup, cup lid, bottle or can;
beer, beer bottles, wine or anyone drunk; a cup of tea drawn as a paper cup or a mug; parked cars, a traffic
cone; fireworks, rockets or bursts in the sky; long white curving wind lines or chalk ribbons in
the sky; one long ribbon of smoke; a pomelo hat drawn as a whole fruit, a bowl, a brimmed cap or
a crown; a smooth yellow dome; a knitted beanie; a hat with no white pith showing at its edge;
A POMELO HAT BIGGER THAN THE HEAD; lobes standing up or flaring out like a flower; a hat taller
than the face; more than two people wearing pomelo hats; ANYONE STANDING INSIDE THE CLINIC'S GLASS
DOORWAY; the older couple inside the clinic or under the covered walkway; moving, redrawing,
restyling, adding or removing any other person, the dog or the scooter; a scooter with its headlight on or moving fast; a helmet with a logo; a dog on
the table or eating from the grill; a big crowd or a street festival with stalls; a sparkler near a grill or near anyone's face;
the moon cropped, covered by cloud, drawn with a face or a rabbit, or drawn huge like a poster;
a cloudless empty sky or a sky full of heavy clouds; daylight, a blue daytime sky, sunset
orange; a pale, cream or brightly lit wall; a washed-out high-key picture; a black sky; dental
instruments, dental chairs, teeth, X-rays; anyone crying, drunk, mocking, pointing or looking at
the camera; a posed row of people facing the viewer; an empty middle stretch of street;
anyone drawn pale, faint, translucent or in outline only; a re-invented or re-proportioned
building; the building mirrored to the other side of the picture; photo-realism; 3D rendering;
anime; thick uniform black outlines; greyscale.
```
