# 颱風／臨時休診那一則的頭圖：**同一條街，鐵門拉下來**

使用者 2026-09-05 指定（逐字）：

> 畫個圖片 做提示詞 之前畫過一般牙科著陸頁的圖片 圖片背景是診所建築和街道 沿用那個背景
> 但天氣是刮風下大雨 陰陰暗暗的 診所大門鐵門降下來 路上只有幾個行人 因為風雨很大
> 走路很困難 有穿著雨衣 也有撐雨傘 但傘快要變形很難前進的樣子 插畫風格維持網站上風格
> 但因為刮風下雨 表情會變得比較困難艱辛的樣子

用在 `/preview/line-typhoon/`（颱風／臨時休診那一則）。

---

## 一、⚠⚠⚠ 先講一件會直接撞到的：**那份定稿的提示詞明文禁止鐵捲門**

一般牙科那張的定稿提示詞（`drafts/og-topic-general-prompt.md` 第十二版）裡有兩句：

> `There is no shutter, no roller door, no garage.`
> `AVOID — … a rolled shutter, roller door or garage opening; …`

**那兩句是為了擋掉模型自己把騎樓畫成車庫**（前四版一直發生），
不是「這棟樓沒有鐵捲門」。實景照 `drafts/og-facade-ref.png` 看得很清楚：
**玻璃上緣、橫樑底下那一條深色的箱體就是鐵捲門的收納箱**，
所以**鐵門是在玻璃那一個平面降下來的，三根柱子與整條騎樓仍然在鐵門前面**。

⚠ **照抄舊提示詞會自相矛盾**（正文要鐵門、AVOID 禁鐵門，而 AVOID 通常贏）。
下面那一份已經：正文寫死鐵門怎麼降、AVOID 那一條**整條刪掉**、
改成擋「把騎樓畫成車庫」與「鐵門畫到柱子外面」。

---

## 二、這張圖和這條線上另外兩張頭圖不一樣的三件事

| | |
| --- | --- |
| ① | **全線唯一「診所是暗的」那一張。** 一般牙科那張的視覺落點是玻璃後面那盞暖燈，這一張沒有燈可以亮 —— 落點改成**鐵門那一大塊深色**，配一件亮黃色雨衣站在它前面 |
| ② | **它一年只出現幾次，而且出現的時候大家心情本來就不好。** 所以要的是「外面真的很難走」，不是災難片 —— 沒有閃電、沒有東西飛、沒有人跌倒、水不過腳踝 |
| ③ | **它是唯一會被讀成「這間店倒了」的一張。**「陰暗 ＋ 關著的老房子」正是使用者當年說「像鬼屋欸」的組合（第十一之一節），所以「保養得很好、只是今天關門」要寫死 |

---

## 三、規格

| | |
| --- | --- |
| 成品尺寸 | **1024×512（2:1）** —— LINE 對 Flex 的 `image` 上限是 1024×1024，不要出 1040 |
| 生成尺寸 | ⚠ 請 Gemini 出 **16:9**（2:1 不在它的選項裡），之後上下裁掉 80 列 |
| **一張圖兩條路共用** | ⚠⚠ **2026-09-05 起這一則的兩條路是同一個尺寸**：貼進聊天室的圖不必是方的（方的是「圖文訊息」那條路才有的規格），所以 **Flex 頭圖與聊天室那張是同一張 2:1**。提案頁的兩個佔位框已經一起改成 2:1 —— **圖先畫、路線後定都不會白畫** |
| 在哪個尺寸判斷 | **268px 寬**（卡片上是 268×134）。三件事要在那個尺寸讀得出來：鐵門拉下來／在下大雨／有人走得很辛苦 |
| 圖上有字嗎 | **沒有。** 整張零文字 |
| 光 | **白天**（下午），不是夜晚也不是黃昏。**全站唯一沒有暖光源的一張**，暖度靠水泥與那件黃雨衣撐 |

---

## 四、參考圖清單（餵圖時**用途要分開講**）

| | 檔案 | 參考什麼 | **不要**參考 |
| --- | --- | --- | --- |
| ① | `drafts/og-topic-general-src.jpg` | **建築、取景、畫風、線的實度、路面的顏色** —— 建築就照這張 | 天氣、光、那七個人、他們的動作與表情、白色氣流線的數量 |
| ② | `drafts/og-facade-ref.png` | **鐵捲門的箱體在玻璃上緣那一條**、柱子的位置、開間的比例 | 照片感、車子、隔壁的店 |
| ③ | `preview/line-remind/hero-remind.jpg` | 手繪線的實度、紙的顆粒（同一條線上的頭圖，風格要一致） | 構圖、候診間、揮手 |
| ④ | **第一版出的那張圖**（2026-09-05，在使用者手上） | **構圖、建築、鐵門、三個人的位置與動作** —— 那一半已經對了 | **天氣、光、天空、雨、白色的風線、那棵沒被吹動的樹** |

⚠⚠ **①一定要用 `-src.jpg`，不可以用 `assets/og-topic-general.jpg`** ——
那一張上緣有一條綠色的帶子、上面印著中文字（那是後製疊的），**餵進去會被學走**。
⚠ ② 那張照片上有三處字（招牌、英文店名、隔壁那家），要多講一句
「參考圖裡出現的任何文字一律不要學，成品不能有字」。

---

## 五、~~提示詞・第一版~~ ⚠ **已被退回，現行的是第五之二節**

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATION. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth pale warm-grey concrete carrying one complete row of
       tall narrow vertical windows set in dark metal boxes that project out from the wall,
       arranged in pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.

2. THE CHANGE - THE SHUTTER IS DOWN. This is the single most important thing in the picture.
   Where the two bays of full-height glass were, there is now a metal roller shutter, closed all
   the way to the ground, filling both bays completely. Draw it as one large, simple, dark
   shape: a warm dark grey-brown metal skin ruled with fine even horizontal ribs, with one
   slightly paler band across it where the flat daylight catches it, and a narrow dark slot at
   the bottom where it meets the ground. The shutter hangs in the same plane as the glass did,
   BEHIND the three columns, so all three columns and the whole covered walkway stand in front
   of it and are not covered by it. No glass and no waiting room can be seen anywhere; there is
   no light of any kind coming from inside the clinic.
     • THE SHUTTER IS THE VISUAL CENTRE - the largest, simplest and darkest shape in the
       picture, sitting across the middle of the frame.
     • It is clean and in good order, freshly painted metal.

3. THE WEATHER. A typhoon in the middle of the afternoon. It is still daylight, but flat, low
   and dim, and the sky does the work:
     • The sky is a deep bruised blue-grey with a green cast, low and heavy, torn into long
       streaks that all run the same way; it is darker at the top of the picture and a little
       paler just above the roofline. It is never flat, never white, never pale, never empty.
     • THE WIND BLOWS ACROSS THE PICTURE FROM THE LEFT EDGE TOWARDS THE RIGHT EDGE, and every
       single thing that can move leans the same way: the rain, the hair, the hems, the plants,
       the leaves, the water running off the canopy.
     • THE RAIN IS DRAWN AS MANY SHORT PARALLEL HAND-DRAWN STROKES, all about the same short
       length, all leaning the same way, gathered into loose bands with clear air between the
       bands - dense in front of the dark shutter, sparser against the sky. It is never one long
       continuous ribbon, never a curve that loops back on itself, never a spiral or a swirl,
       never radiating speed lines.
     • Along the ground, a scatter of short upward splash ticks where the rain hits, and small
       splash crowns around the walkers' feet.
     • Water pours off the front edge of the canopy in a broken curtain and runs along the kerb.
     • THREE OR FOUR LONG PALE SWEEPING LINES cross the upper part of the picture, above the
       people, in the same style as the provided illustration - soft chalk quality, tapering to
       dry flecks, all running the same way. They are in the open air only and never touch or
       emerge from any person's body.
     • The road is a wet paved asphalt street, a neutral mid grey slightly cooler than the
       buildings, darkened by water, with a thin sheet of water on it holding pale broken
       reflections of the sky. The raised pavement and the floor of the covered walkway stay
       their pale warm grey concrete and stay dry, so the dry warm walkway and the wet cool road
       read as two different surfaces with a clear kerb between them.

4. THE THREE PEOPLE. Only three, all East Asian, spread across the picture in a single
   horizontal band on the same ground line, with clear space between them, all walking TOWARDS
   THE LEFT, straight into the wind, all leaning the same way. They are the nearest things in
   the picture and they are big: the head of the nearest adult reaches about the height of the
   dark sign beam above the shutter, and their feet come close to the bottom edge of the frame.
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side. Her body is tipped
       forward from the ankles, her front knee bent, her chin tucked down. One hand grips the
       front edge of the hood at her forehead, palm outward, holding it against the wind; the
       other arm hugs a shopping bag flat against her chest. The back of the poncho is blown out
       behind her to the right like a sail, her trouser legs are dark and soaked to the knee.
       SHE IS THE BRIGHTEST THING IN THE PICTURE and she is standing against the dark shutter -
       that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS HALF BLOWN INSIDE OUT. Draw the umbrella very clearly: the far side of
       the canopy has flipped upward into a lopsided bowl with two or three ribs bent the wrong
       way and the fabric stretched taut, while the near side still points down - a lopsided,
       broken-looking shape, like a flower turning itself inside out. It is a deep teal. He
       holds the handle with BOTH HANDS, arms straight, elbows locked, his weight back on his
       heels and his knees bent, pulling against it; his head is turned away from the wind and
       ducked down behind his shoulder. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat over his clothes, holding a small CORAL umbrella low and tilted in
       front of him like a shield, taking short careful steps with one hand out for balance.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. Distance is shown by size and by overlapping and by nothing else - no
   figure is pale, faint, translucent, greyed out or drawn in outline only. Nobody looks at the
   camera.

5. THEIR FACES SHOW EFFORT, NOT DISTRESS. Read this carefully, because it is easy to get wrong:
   eyes narrowed to short lines against the rain, eyebrows drawn together and pushed down,
   mouth a small closed line or slightly open with effort, chin tucked, cheeks a little flushed
   from the wind. They are working hard and they are fine. NOBODY IS CRYING: no tears, no
   screwed-up crying face, no down-turned open wailing mouth, and no hand rubbing or covering
   the eyes - a hand may grip a hood at the forehead, palm outward, but it must never cover the
   eyes. Nobody is frightened, nobody is shouting, nobody is in pain, nobody is falling over.

6. NOBODY IS IN DANGER AND NOTHING IS BROKEN. Draw the weather, not a catastrophe: no
   lightning, no thunderbolt, no flying debris, no loose sheet metal, no fallen sign, no broken
   or uprooted tree, no snapped branches near anyone, no emergency vehicle, no flood. The water
   on the ground is a thin sheet with shallow puddles, never above the ankle. The plants in the
   pots and the white cylindrical planters are still standing, bent hard by the wind but not
   knocked over, and one or two small leaves tumble along the ground.

7. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
   shutter, tidy pots. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted,
   boarded up, cobwebbed, sagging or derelict. Nothing sinister, nothing haunted, nothing
   sad-looking about the building itself. It reads as a well-kept clinic that has shut its
   shutter because of the weather.

8. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
   logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
   empty surface with nothing written on it, even though the real building carries lettering
   there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
   taped, stuck or hung on it. The shopping bag, the raincoats and the umbrellas are all plain.
   Any writing that appears in the reference pictures must be ignored and must not be copied.

9. STYLE - the same hand-drawn editorial illustration as the provided pictures. Thin hand-drawn
   linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
   breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
   coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
   fills with two or three tones per hue, no gradients except to describe light. A fine even
   paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
   eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines.

10. COLOUR - dark and stormy but never grey and never colourless. At least six distinct colours
    must be readable at thumbnail size: the bright yellow poncho, the deep teal umbrella, the
    coral umbrella, the dark navy and dark green raincoats, the deep green foliage, the warm
    pale grey concrete of the walkway, the dark chocolate-brown columns, the cool wet grey road
    and the bruised blue-green sky. The warmth of the picture is carried by the concrete, the
    walkway and the yellow poncho; keep them warm even though the light is dim. This is not a
    monochrome picture, not a sepia picture and not a blue-only picture.

AVOID: any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; a
re-invented or re-proportioned shopfront; the shutter drawn across the front of the columns or
across the outer edge of the covered walkway instead of behind the columns in the plane of the
glass; the covered walkway turned into a garage or a car port; any glass, waiting room, lamp,
lit window or warm light visible anywhere in the clinic; night, darkness, sunset, an orange sky,
lit street lamps, headlights; lightning, a thunderbolt, flying debris, a fallen or broken tree,
deep flood water, an overturned scooter, an emergency vehicle; anyone falling, injured,
frightened, shouting or crying; tears, a screwed-up crying face, a hand rubbing or covering the
eyes; one long continuous rain ribbon, a looping or spiralling line, a swirl, speed lines,
starbursts; a completely inverted umbrella stripped to bare ribs; an empty street with nobody in
it; small distant figures in a wide empty scene; any figure drawn pale, faint, translucent,
ghostly or in outline only; peeling paint, cracks, stains, mould, rust, boards over the front,
cobwebs, a derelict or haunted building; a flat white, pale or empty sky; greyscale, sepia or a
single-colour picture; thick uniform black outlines; photo-realism; 3D rendering; dental
instruments, chairs, X-rays or teeth.
```

---

## 五之一、⚠ 第一版的四件（2026-09-05，使用者：「這個效果有 5、6 成了」）

> 「畫面中有一幾段弧形的白色線條應該是風吹的意象 但這個弧線和平常晴天的微風依樣
> 看起來很怪不夠強烈／第二個 雨滴的方向 和行人與雨衣 雨傘 抵擋的方向剛好相反／
> 第三路樹明明很纖細 但看起來很平靜沒有被吹動的樣子／第四 診所建築看起來很明亮
> 不像颱風天」

**構圖、建築、鐵門、三個人的位置與動作都對了**（那一半不要再讓模型重畫）。
四件都是**風、雨、光**這三樣全域的東西，四件的成因如下：

1. ⚠⚠⚠ **白弧線 ＝ 我叫它照抄晴天那一組。** 第一版的提示詞逐字寫著
   `THREE OR FOUR LONG PALE SWEEPING LINES … in the same style as the provided illustration -
   soft chalk quality, tapering to dry flecks` —— 那是一般牙科那張**微風**的畫法，
   模型照做了。**通則：氛圍線是跟著天氣走的，不是跟著站上的風格走** ——
   沿用風格參考圖時，要逐項問「這一項在新的天氣底下還成立嗎」。
   颱風的風要畫成**一群短而直、硬邊、和雨同角度的陣風線**（同第三節那條
   「一條 ＝ 物體，一群 ＝ 流動」，只是這一次要的是更多、更短、更硬）。

2. ⚠⚠⚠ **雨的方向反了，成因是我用了「相對指代」。**
   第一版對風寫死了絕對方向（`FROM THE LEFT EDGE TOWARDS THE RIGHT EDGE`），
   可是對雨只寫 `all leaning the same way` —— **「和某某同方向」是相對指代，模型會自己
   重新擲一次骰子**。結果：人往左頂、雨往左下落，兩邊互相矛盾。
   ⚠ 這是 ILLUSTRATION.md 第十一節口外那一輪第 2 條（**凡是有方向的東西，一律用畫面的
   左／右／上／下講**）的**下一層**：
   **通則：方向要「每一項各自寫死一次」，不可以寫「和另一項同方向」。**
   ⚠ 修的時候**要跟著人走**（人畫對了）→ 風從**左**來 → **每一道雨從左上落到右下**。

3. **路樹平靜，成因是它從來沒有被交代過。** 第一版的樹只出現在「建築」那一段的
   `with a small street tree beside it`（那是**照抄一般牙科那張的建築描述**），
   「風把它怎麼樣」一個字都沒寫。**通則：凡是要它動的東西，就要自己一段、
   自己一句動詞** —— 靠全域那句「every thing that can move leans the same way」帶不動它。

4. ⚠⚠ **建築太亮，成因是我只寫了天空暗、沒寫**「**其他每一個面都要跟著暗**」。
   第一版的 `COLOUR` 段還留著 `warm pale grey concrete`（＝晴天那張的牆色），
   於是模型畫出「暗天空 ＋ 亮牆」，讀起來就是陰天不是颱風天。
   ⚠ **修法不是把整張調暗**（會掉進灰階那條紅線），是**訂一把明度的梯子**、
   用畫面裡的東西當尺（同口外那一輪第 3 條：**百分比講不動，和畫面裡另一個東西比講得動**）：
   **黃雨衣最亮 → 路面上的天空倒影 → 水泥牆（明顯比雨衣暗）→ 天空 → 騎樓與鐵門最暗。**

⚠ 順帶一件他沒提、但和他原本的交代對不上的：**傘還沒有「快要變形」** ——
第一版畫出來只是斜著撐，第二版把「哪幾根骨架翻上去、布繃成什麼形狀」寫得更死。

---

## 五之二、~~第二版的提示詞~~ ⚠ **風雨的強度過了、方向仍然錯，現行的是第五之四節**

⚠⚠ **參考圖多一張，而且用途要分開講**：把**第一版出的那張圖**一起餵進去，
說明是「**構圖、建築、鐵門、三個人的位置與動作照這一張**，
**天氣、光、風、雨、樹全部不要照它**」——
那一半已經對了，不要讓模型再重擲一次骰子（同第十三版那條
「當某一塊已經對了，就不要再讓它重畫那一塊」）。
其餘三張參考圖照第四節。

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

ONE OF THE PROVIDED PICTURES IS AN EARLIER ATTEMPT AT THIS EXACT SCENE. Copy its framing, its
building, its closed shutter and the position, size and posture of its three people - that half
is already right. Do NOT copy its weather, its light, its sky, its rain, its white wind lines or
its calm untouched tree: every one of those is being corrected below.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.

2. THE SHUTTER IS DOWN. Where the two bays of full-height glass were, there is now a metal
   roller shutter, closed all the way to the ground, filling both bays completely. Draw it as
   one large, simple, dark shape: a warm dark grey-brown metal skin ruled with fine even
   horizontal ribs and a narrow dark slot at the bottom where it meets the ground. The shutter
   hangs in the same plane as the glass did, BEHIND the three columns, so all three columns and
   the whole covered walkway stand in front of it and are not covered by it. No glass and no
   waiting room can be seen anywhere; there is no light of any kind coming from inside the
   clinic. It is clean and in good order, freshly painted metal, and it sits in deep shade.

3. THE LIGHT - THIS IS WHAT MAKES IT A TYPHOON, AND IT MATTERS MORE THAN ANYTHING ELSE HERE.
   There is no sun anywhere. The whole street lies in flat, heavy shade under a black-green sky,
   and EVERY surface is two steps darker and one step cooler than the same surface is in the
   reference pictures. Ignore the weather, the light and the sky of the reference pictures
   completely - they are a bright blue day and this is not.
   Keep this ladder strictly, from lightest to darkest:
     • lightest of all, the woman's yellow rain poncho. NOTHING ELSE IN THE PICTURE IS AS LIGHT
       AS SHE IS;
     • then the broken reflections of the sky lying on the wet road;
     • then the concrete wall of the building - a MID WARM GREY, clearly and obviously darker
       than the poncho. It is NOT a pale cream wall and it is NOT brightly lit;
     • then the sky, darker still, and darkest of all at the top edge of the picture;
     • darkest of all, the covered walkway, which is in deep shade, and the closed shutter
       inside it.
   Dark wet streaks run down the concrete from the canopy and from under the window boxes, and
   the bottom of the wall is soaked a darker tone where the rain splashes back off the ground.
   There are NO cast sun shadows anywhere. A pale haze of falling rain hangs between us and the
   far part of the building, so the right-hand side elevation is softer and lower in contrast
   than the near part.

4. THE WIND AND THE RAIN - ONE DIRECTION ONLY, AND IT IS THIS ONE. THE WIND COMES FROM THE LEFT
   EDGE OF THE PICTURE AND BLOWS TOWARDS THE RIGHT EDGE. Every single element is written out
   below in picture coordinates so that nothing is left to interpretation. Nothing in the
   picture may disagree with any of it:
     • EVERY RAIN STROKE RUNS FROM UPPER LEFT DOWN TO LOWER RIGHT, leaning about 40 degrees away
       from vertical. The top end of each stroke is nearer the LEFT edge of the picture and the
       bottom end of it is nearer the RIGHT edge. NOT ONE STROKE LEANS THE OTHER WAY.
     • The three people are walking towards the LEFT, straight into the wind, so their bodies
       lean towards the LEFT while everything loose on them - hoods, hems, hair, the back of the
       poncho, the older man's coat - streams out behind them towards the RIGHT.
     • Every leaf, every branch, every plant, every splash and every piece of spray points to
       the RIGHT.
   THE RAIN IS HEAVY. Draw far more strokes than a shower would have, gathered into dense
   slanting bands with clearer air between the bands, the bands themselves lying at the same
   angle; pale strokes where they cross the dark shutter and the dark walkway, darker strokes
   where they cross the sky. Some strokes are long and some are short, but they are all straight
   and all at the same angle.
   THE WIND IS DRAWN AS HARD STRAIGHT GUSTS, NOT AS GENTLE CURVES. Soft wavy chalk ribbons
   drifting across the sky read as a pleasant breeze on a fine day and are completely wrong for
   this picture. Instead:
     • tight parallel groups of SHORT, STRAIGHT, HARD-EDGED pale streaks, five or six streaks to
       a group, at exactly the same angle as the rain, scattered LOW across the picture - across
       the road, past the people's legs, along the front of the shutter - with only two or three
       groups up in the sky;
     • where the wind strikes the dark corner column it breaks: a fan of short streaks spraying
       off that corner towards the right;
     • sheets of fine spray skimming horizontally off the surface of the wet road and off the
       tops of the puddles, all travelling to the right;
     • the puddles are not smooth: their surfaces are ruffled into small parallel ripples all
       running the same way.
   No long single sweeping ribbon, no S-curve, no wavy line, no loop, no spiral, no line that
   curls back on itself, and nothing that touches or comes out of a person's body.

5. THE STREET TREE AND THE PLANTS ARE BEING TAKEN APART BY THE WIND. The small tree at the left
   edge is thin, so after the people it must be the most obviously wind-blown thing in the
   frame. A calm, upright, round-crowned tree would kill the whole picture:
     • its trunk is bowed over towards the RIGHT in a clear curve;
     • EVERY branch and every twig is swept the same way, all bent to the right; none of them
       hang down and none of them point left;
     • the foliage is no longer a round ball - it is stretched into a long ragged streak
       trailing off to the right, thin and torn, with a gap of open sky on the LEFT-hand side of
       the tree where the wind has pushed the leaves away;
     • a handful of leaves have been torn off and are flying to the right, several of them well
       clear of the tree.
   The potted plants against the wall and the shrubs in the white cylindrical planters are bent
   hard to the right in the same way, their leaves flattened and streaming, one pot's foliage
   almost horizontal. Everything green in this picture is leaning to the right; nothing stands
   upright.

6. THE THREE PEOPLE. Only three, all East Asian, spread across the picture in a single
   horizontal band on the same ground line, with clear space between them, all walking TOWARDS
   THE LEFT, straight into the wind, all leaning the same way. They are the nearest things in
   the picture and they are big: the head of the nearest adult reaches about the height of the
   dark sign beam above the shutter, and their feet come close to the bottom edge of the frame.
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side. Her body is tipped
       forward from the ankles, her front knee bent, her chin tucked down. One hand grips the
       front edge of the hood at her forehead, palm outward, holding it against the wind; the
       other arm hugs a shopping bag flat against her chest. The back of the poncho is blown out
       behind her to the RIGHT like a sail, her trouser legs are dark and soaked to the knee.
       SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands against the dark shutter - that
       contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. Draw the umbrella very
       clearly and make the damage obvious: the whole canopy has been pushed up and back towards
       the RIGHT, three of its ribs on the right-hand side have already flipped upward and folded
       the wrong way so that part of the canopy is now a deep lopsided bowl opening at the sky,
       the fabric between those ribs is stretched drum-tight and pulling into hard straight
       creases, while only the left-hand side of the canopy still points down. It is a deep teal.
       He holds the handle with BOTH HANDS, arms straight, elbows locked, his weight back on his
       heels and his knees bent, hauling against it; his head is turned away from the wind and
       ducked down behind his shoulder. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat over his clothes, holding a small CORAL umbrella low and tilted in
       front of him like a shield, taking short careful steps with one hand out for balance.
       His coat is blown out behind him to the right.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. Distance is shown by size and by overlapping and by nothing else - no
   figure is pale, faint, translucent, greyed out or drawn in outline only. Nobody looks at the
   camera.

7. THEIR FACES SHOW EFFORT, NOT DISTRESS. Read this carefully, because it is easy to get wrong:
   eyes narrowed to short lines against the rain, eyebrows drawn together and pushed down,
   mouth a small closed line or slightly open with effort, chin tucked, cheeks a little flushed
   from the wind. They are working hard and they are fine. NOBODY IS CRYING: no tears, no
   screwed-up crying face, no down-turned open wailing mouth, and no hand rubbing or covering
   the eyes - a hand may grip a hood at the forehead, palm outward, but it must never cover the
   eyes. Nobody is frightened, nobody is shouting, nobody is in pain, nobody is falling over,
   and nobody is angry or scowling.

8. NOBODY IS IN DANGER AND NOTHING IS BROKEN. Draw the weather, not a catastrophe: no lightning,
   no thunderbolt, no flying debris, no loose sheet metal, no fallen sign, no uprooted or snapped
   tree, no broken branches near anyone, no emergency vehicle, no flood. The water on the ground
   is a thin sheet with shallow puddles, never above the ankle. The tree is bent right over but
   still standing and still whole; the pots and the white cylindrical planters are still upright.

9. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
   shutter, tidy pots. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted,
   boarded up, cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not
   because it is dirty. Nothing sinister, nothing haunted, nothing sad-looking about the
   building itself. It reads as a well-kept clinic that has shut its shutter because of the
   weather.

10. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The shopping bag, the raincoats and the umbrellas are all plain.
    Any writing that appears in the reference pictures must be ignored and must not be copied.

11. STYLE - the same hand-drawn editorial illustration as the provided pictures. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

12. COLOUR - dark and stormy, but never grey and never colourless. The whole picture sits in a
    lower and cooler key than the reference: a black-green sky, mid warm grey concrete, near
    black-brown columns and shutter, cool slate grey wet road. Against that, all the colour is
    carried by a few small saturated things: the bright yellow poncho, the deep teal umbrella,
    the coral umbrella, the dark navy and dark green raincoats, and the deep green of the tree
    and the potted plants. At least six distinct colours must still be readable at thumbnail
    size, and the yellow poncho must be the one the eye finds first. This is not a monochrome
    picture, not a sepia picture and not a blue-only picture, and there is no cyan, no turquoise
    and no patch of blue or bright sky anywhere.

AVOID: any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE LEANING FROM UPPER RIGHT DOWN TO LOWER LEFT; rain and people braced against opposite
directions; anything at all blown towards the left; gentle wavy, curving or S-shaped white
ribbons drifting across the sky; long soft chalk air lines of the kind used on a fine day; a
calm, upright, untouched street tree; a round undisturbed tree crown; branches hanging straight
down; light drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful
building; a wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or
turquoise sky; sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned
shopfront; the shutter drawn in front of the columns or across the outer edge of the covered
walkway instead of behind the columns in the plane of the glass; the covered walkway turned into
a garage or a car port; any glass, waiting room, lamp, lit window or warm light visible anywhere
in the clinic; night, sunset, an orange sky, lit street lamps, headlights; lightning, a
thunderbolt, flying debris, a fallen, snapped or uprooted tree, deep flood water, an overturned
scooter, an emergency vehicle; anyone falling, injured, frightened, shouting, scowling or
crying; tears, a screwed-up crying face, a hand rubbing or covering the eyes; an umbrella
stripped to bare ribs with no fabric; an intact, undamaged, ordinary umbrella; an empty street
with nobody in it; small distant figures in a wide empty scene; any figure drawn pale, faint,
translucent, ghostly or in outline only; peeling paint, cracks, stains, mould, rust, boards over
the front, cobwebs, a derelict or haunted building; greyscale, sepia or a single-colour picture;
thick uniform black outlines; photo-realism; 3D rendering; dental instruments, chairs, X-rays or
teeth.
```

---

## 五之三、⚠⚠⚠ 第二版：風雨夠強了，但**雨的方向連續兩版都往左下** —— 這一輪改成順著它

使用者：「感覺夠激烈了 但雨的方向還是錯的／診所門口的盆栽 看起來很平靜
一個被吹歪 一個盆栽被吹倒破掉 裡面的土灑出來」

**光與風的強度過了**（第五之一節那四件裡的第一、四件結案），剩下兩件。

### ① 方向：不要再叫它改雨，改人

第一版與第二版**都把雨畫成從右上落到左下**，而第二版的提示詞已經寫死
「每一道雨從**左上**落到**右下**、一道反的都沒有」—— 寫得再死也沒有用。
逐項看第二版那張圖：

| | 畫出來的 | 它在說風從哪邊來 |
| --- | --- | --- |
| 雨 | 右上 → 左下 | **從右邊來** |
| 路樹（樹冠、飛葉） | 全部往**左**倒 | **從右邊來** |
| 三個人（往左走、身體往左傾） | 頂著左邊 | **從左邊來** ← 只有這一項不合 |

**三件裡有兩件已經一致了，不合的是人。** 所以第三版**整個掉頭**：
**風從畫面右邊吹向左邊**，雨與樹**一個字都不改**，**把三個人轉過來面向右邊**。

⚠⚠⚠ **通則：同一件事寫死兩次還是失敗，就去看模型「自己想畫成什麼」，
順著它、改另一半。** 模型對「雨往左下落」顯然有很強的先驗（兩版都一樣），
而這一張圖裡「人往哪走」是**完全自由**的（構圖上左右都成立）——
**改自由度高的那一半，不要一直撞先驗。**

⚠ 判斷有沒有對的方法只有一句話：**人往哪邊傾，雨就一定往另一邊落**
（人是頂著風、雨是順著風）。第一版與第二版都是**兩者同一邊**。

### ② 盆栽：一個歪、一個倒了破掉、土灑出來

第二版的兩個盆栽站得直挺挺的 —— 那是**我自己在第二版的 `AVOID` 裡寫的**
（`the pots and the white cylindrical planters are still upright`）。
當時寫它是為了擋「災難片」，**但一個被吹破的盆栽不是災難，是天氣**。
第三版把那一條拿掉，改成寫死「一個歪、一個倒了破掉、濕土灑成一片」。

⚠⚠ **但它和第 9 段那條「診所保養得很好」會打架，所以要寫清楚時態**：
破片是**乾淨的新斷面**、土是**深色濕的**、植株**還是綠的還活著** ——
那是**現在正在發生的事**，不是長年沒人管。
少了這一句，模型會把「破掉的盆栽」畫成堆了很久的垃圾，
整張圖就掉進第十一之一節那個「像鬼屋」裡。

---

## 五之四、~~第三版的提示詞~~ ⚠⚠ **方向選錯邊，作廢** —— 現行的是第五之六節

⚠⚠ **參考圖照第四節那三張，再加第二版出的那張圖**，說明要分開講：
「**建築、鐵門、光、天空、雨的方向與角度、路樹、三個人的位置與大小照這一張**；
**只有兩件要改：三個人轉過來面向右邊、門口一個盆栽倒了破掉**。」

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

ONE OF THE PROVIDED PICTURES IS AN EARLIER ATTEMPT AT THIS EXACT SCENE AND MOST OF IT IS ALREADY
RIGHT. Copy its framing, its building, its closed shutter, its dark stormy light, its sky, its
rain, its wind streaks, its wet road and its wind-blown street tree exactly as they are. Copy
the position and the size of its three people. THERE ARE ONLY TWO CHANGES, both described below:
the three people are turned around to face the other way, and one of the pots by the clinic door
has been blown over and broken.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.

2. THE SHUTTER IS DOWN. Where the two bays of full-height glass were, there is now a metal
   roller shutter, closed all the way to the ground, filling both bays completely. Draw it as
   one large, simple, dark shape: a warm dark grey-brown metal skin ruled with fine even
   horizontal ribs and a narrow dark slot at the bottom where it meets the ground. The shutter
   hangs in the same plane as the glass did, BEHIND the three columns, so all three columns and
   the whole covered walkway stand in front of it and are not covered by it. No glass and no
   waiting room can be seen anywhere; there is no light of any kind coming from inside the
   clinic. It is clean and in good order, freshly painted metal, and it sits in deep shade.

3. THE LIGHT. Keep the light of the provided earlier attempt exactly: a typhoon in the middle of
   the afternoon, still daylight but flat, low and dim, no sun anywhere, a deep bruised
   blue-grey sky with a green cast, dark wet streaks running down the concrete, no cast sun
   shadows. Keep this ladder from lightest to darkest: the woman's yellow rain poncho is the
   lightest thing in the picture and nothing else comes near it; then the broken reflections of
   the sky on the wet road; then the mid warm grey concrete wall; then the sky; and darkest of
   all the covered walkway in deep shade and the closed shutter inside it.

4. THE WIND AND THE RAIN - ONE DIRECTION ONLY, AND IT IS THIS ONE: THE WIND COMES FROM THE RIGHT
   EDGE OF THE PICTURE AND BLOWS TOWARDS THE LEFT EDGE. In the provided earlier attempt the rain
   and the tree are already correct and only the three people are wrong. Keep the rain and the
   tree; turn the people around:
     • EVERY RAIN STROKE RUNS FROM UPPER RIGHT DOWN TO LOWER LEFT, leaning about 40 degrees away
       from vertical - the top end of each stroke nearer the RIGHT edge of the picture, the
       bottom end nearer the LEFT edge, exactly as in the earlier attempt. Not one stroke leans
       the other way.
     • The street tree, every branch, every leaf, every plant, every splash, every piece of
       spray and every spilled thing is blown towards the LEFT.
     • THE THREE PEOPLE ARE WALKING TOWARDS THE RIGHT, straight into the wind. Their bodies tilt
       towards the RIGHT, into it, and everything loose on them - hoods, hems, hair, the back of
       the poncho, the older man's coat - streams out behind them towards the LEFT.
     • USE THIS AS A CHECK BEFORE YOU FINISH: the rain travels towards the LEFT and the people
       lean towards the RIGHT. THE PEOPLE AND THE RAIN MUST NEVER LEAN THE SAME WAY. A person
       leans into the wind; rain travels with it.
   Keep the rain heavy and keep the wind streaks of the earlier attempt: many short parallel
   hand-drawn rain strokes gathered into dense slanting bands, short splash ticks along the
   ground, water pouring off the front edge of the canopy, tight parallel groups of short,
   straight, hard-edged pale gust streaks low across the picture at the same angle as the rain,
   sheets of fine spray skimming off the wet road, and puddles ruffled into small parallel
   ripples. No long single sweeping ribbon, no S-curve, no wavy line, no loop, no spiral, and
   nothing that touches or comes out of a person's body.

5. THE STREET TREE IS ALREADY RIGHT - KEEP IT. Trunk bowed over towards the LEFT, every branch
   and twig swept the same way, the foliage stretched into a long ragged streak trailing off to
   the left with a gap of open sky on the right-hand side of the tree, and several leaves torn
   off and flying to the left.

6. THE POTS BY THE CLINIC DOOR ARE NOT CALM - THIS IS THE SECOND CHANGE. In the earlier attempt
   they stand neatly upright, which is wrong for this weather:
     • ONE POT IS TIPPED OVER AT AN ANGLE but still standing, leaning hard away from the wind,
       its plant bent almost horizontal and streaming towards the LEFT.
     • THE OTHER POT HAS BEEN BLOWN RIGHT OVER AND HAS BROKEN. It lies on its side on the
       covered walkway, cracked into two or three large clean pieces with a piece of the rim
       broken away, and the DARK WET SOIL HAS SPILLED OUT OF IT in a fan across the paving,
       trailing towards the LEFT with the wind. The plant lies on its side in the spilled soil
       with its root ball showing, still green and still alive.
     • IT HAS JUST HAPPENED, IN THIS STORM. The broken edges are clean and freshly broken, the
       soil is a rich dark brown and obviously wet, and the plant is healthy. This is not
       rubbish, not litter, not an old dirty pot and not neglect. Everything else outside the
       clinic stays tidy.

7. THE THREE PEOPLE. Only three, all East Asian, spread across the picture in a single
   horizontal band on the same ground line, with clear space between them, all walking TOWARDS
   THE RIGHT, straight into the wind, all leaning the same way. Keep them the same size and in
   the same places as the earlier attempt: they are the nearest things in the picture and they
   are big, the head of the nearest adult reaching about the height of the dark sign beam above
   the shutter and their feet coming close to the bottom edge of the frame.
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side, FACING RIGHT. Her body is
       tipped forward from the ankles towards the right, her front knee bent, her chin tucked
       down. One hand grips the front edge of the hood at her forehead, palm outward, holding it
       against the wind; the other arm hugs a shopping bag flat against her chest. The back of
       the poncho is blown out behind her to the LEFT like a sail, her trouser legs are dark and
       soaked to the knee. SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands against the
       dark shutter - that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket,
       FACING RIGHT, whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. He holds
       it out in front of him towards the right, into the wind. The whole canopy has been pushed
       up and back towards the LEFT, three of its ribs on the left-hand side have already
       flipped upward and folded the wrong way so that part of the canopy is now a deep lopsided
       bowl opening at the sky, the fabric between those ribs is stretched drum-tight into hard
       straight creases, and only the right-hand side of the canopy still points down. It is a
       deep teal. He holds the handle with BOTH HANDS, arms straight, elbows locked, his weight
       back on his heels and his knees bent, hauling against it; his head is turned away from
       the wind and ducked down behind his shoulder. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat over his clothes, FACING RIGHT, holding a small CORAL umbrella low
       and tilted in front of him like a shield, taking short careful steps with one hand out
       for balance. His coat is blown out behind him to the LEFT.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. Distance is shown by size and by overlapping and by nothing else - no
   figure is pale, faint, translucent, greyed out or drawn in outline only. Nobody looks at the
   camera.

8. THEIR FACES SHOW EFFORT, NOT DISTRESS. Read this carefully, because it is easy to get wrong:
   eyes narrowed to short lines against the rain, eyebrows drawn together and pushed down,
   mouth a small closed line or slightly open with effort, chin tucked, cheeks a little flushed
   from the wind. They are working hard and they are fine. NOBODY IS CRYING: no tears, no
   screwed-up crying face, no down-turned open wailing mouth, and no hand rubbing or covering
   the eyes - a hand may grip a hood at the forehead, palm outward, but it must never cover the
   eyes. Nobody is frightened, nobody is shouting, nobody is in pain, nobody is falling over,
   and nobody is angry or scowling.

9. NOBODY IS IN DANGER, AND THE ONLY BROKEN THING IN THE PICTURE IS THAT ONE POT. Draw the
   weather, not a catastrophe: no lightning, no thunderbolt, no flying debris, no loose sheet
   metal, no fallen sign, no uprooted or snapped tree, no broken branches near anyone, no
   emergency vehicle, no flood, no broken glass and nothing broken on the building itself. The
   water on the ground is a thin sheet with shallow puddles, never above the ankle. The tree is
   bent right over but still standing and still whole.

10. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
    shutter. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted, boarded up,
    cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not because it is
    dirty, and the broken pot is something the wind is doing right now, not a sign of neglect.
    Nothing sinister, nothing haunted, nothing sad-looking about the building itself.

11. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The shopping bag, the raincoats and the umbrellas are all plain.
    Any writing that appears in the reference pictures must be ignored and must not be copied.

12. STYLE - the same hand-drawn editorial illustration as the provided pictures. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

13. COLOUR - dark and stormy, but never grey and never colourless. Keep the key of the earlier
    attempt: a black-green sky, mid warm grey concrete, near black-brown columns and shutter,
    cool slate grey wet road. All the colour is carried by a few small saturated things: the
    bright yellow poncho, the deep teal umbrella, the coral umbrella, the dark navy and dark
    green raincoats, the deep green of the tree and the plants, and now also the RICH DARK BROWN
    of the spilled wet soil. At least six distinct colours must still be readable at thumbnail
    size, and the yellow poncho must be the one the eye finds first. This is not a monochrome
    picture, not a sepia picture and not a blue-only picture, and there is no cyan, no turquoise
    and no patch of blue or bright sky anywhere.

AVOID: any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE LEANING FROM UPPER LEFT DOWN TO LOWER RIGHT; THE PEOPLE AND THE RAIN LEANING THE SAME WAY;
any of the three people walking towards the left, facing left, or leaning towards the left;
anything loose on a person streaming towards the right; neat upright undisturbed pots by the
door; a swept, tidy, undamaged doorway; litter, rubbish, weeds, an old dirty cracked pot or
general mess; dry soil; gentle wavy, curving or S-shaped white ribbons drifting across the sky;
long soft chalk air lines of the kind used on a fine day; a calm, upright, untouched street tree;
light drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful
building; a wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or
turquoise sky; sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned
shopfront; the shutter drawn in front of the columns or across the outer edge of the covered
walkway instead of behind the columns in the plane of the glass; the covered walkway turned into
a garage or a car port; any glass, waiting room, lamp, lit window or warm light visible anywhere
in the clinic; night, sunset, an orange sky, lit street lamps, headlights; lightning, a
thunderbolt, flying debris, a fallen, snapped or uprooted tree, deep flood water, an overturned
scooter, an emergency vehicle; anyone falling, injured, frightened, shouting, scowling or crying;
tears, a screwed-up crying face, a hand rubbing or covering the eyes; an umbrella stripped to
bare ribs with no fabric; an intact, undamaged, ordinary umbrella; an empty street with nobody in
it; small distant figures in a wide empty scene; any figure drawn pale, faint, translucent,
ghostly or in outline only; peeling paint, cracks, stains, mould, rust, boards over the front,
cobwebs, a derelict or haunted building; greyscale, sepia or a single-colour picture; thick
uniform black outlines; photo-realism; 3D rendering; dental instruments, chairs, X-rays or teeth.
```

---

## 五之五、⚠⚠⚠ 第三版的方向是我自己選錯邊的（2026-09-05）

使用者：「不對欸　應該是雨的方向錯了　雨應該要從左上往右下才對　風是從左往右吹」

**第五之三節那個「整個掉頭」是錯的。** 我看到「雨與樹都在說風從右邊來、只有人不合」，
就自己挑了「順著模型、把人轉過來」——**但風往哪邊吹是使用者的意圖，不是可以由我選的自由度**。

⚠⚠⚠ **通則的修正**：第五之三節那條「順著模型的先驗、改另一半」**只有在兩半都自由時才成立**。
**先問「這一半真的是自由的嗎」** —— 這一次不是，而我沒問就選了。

**照他的方向重新盤一次 v2 那張圖，錯的只有兩樣，而且都是背景**：

| | v2 畫出來的 | 對不對（風從左往右） |
| --- | --- | --- |
| 三個人（往左走、身體往左傾、雨衣往右鼓） | 頂著左邊來的風 | ✅ **完全正確，不要動** |
| 雨 | 右上 → 左下（`/`） | ❌ 要換成 `\` |
| 路樹 | 往左倒 | ❌ 要往右倒 |

**所以第四版要改的只有雨和樹**，人、建築、鐵門、光一個字都不動。

### 這一次多給一張「方向參考圖」

那個方向在提示詞裡**寫死兩次都沒用**（正文寫了、`AVOID` 也寫了），所以改用這一站
自己的做法：**形狀不要用文字描述，用參考圖**（ILLUSTRATION.md 第十之一節）——
**方向也是形狀**。

    node drafts/channels/typhoon-rain-ref.mjs
    → preview/line-typhoon/rain-direction-ref.png（1024×512）
    → https://fangren.net/preview/line-typhoon/rain-direction-ref.png

⚠ 那張圖刻意做成**一看就是圖表不是插畫**：平底色 ＋ 只有雨的線條、
**沒有任何物件、沒有文字、沒有箭頭**（箭頭一定會被畫進成品裡）。
餵的時候要明講：**只參考那些線的角度與方向，不要參考它的顏色、不要把它當背景**。

### 還有一個不用圖也講得清楚的錨點：反斜線

**「左上 → 右下」＝ 反斜線 `\`；「右上 → 左下」＝ 斜線 `/`。**
這兩個字元沒有第二種讀法，比「離垂直 40 度」「和風同方向」都硬。
第四版的正文與 `AVOID` 各寫一次。

---

## 五之六、~~第四版的提示詞~~ ⚠⚠ **雨還是反的、而且鐵門的位置錯了** —— 現行的是第五之八節

⚠⚠ **參考圖五張**：第四節那三張、**第二版出的那張圖**、**再加那張雨的方向參考圖**，
用途分開講：
「**建築、鐵門、光、天空、三個人的位置動作與朝向照第二版那張**；
**雨的角度與方向照那張只有線條的參考圖**（只看角度，不要看顏色、不要當背景）；
**要改的只有兩件：雨的方向、還有那棵樹要往右倒**。」

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

TWO OF THE PROVIDED PICTURES ARE INSTRUCTIONS, NOT SCENES TO COPY WHOLE:
  • ONE IS AN EARLIER ATTEMPT AT THIS EXACT SCENE AND MOST OF IT IS ALREADY RIGHT. Copy its
    framing, its building, its closed shutter, its dark stormy light, its sky, its wet road,
    and the position, size, posture and facing of its three people, exactly as they are.
  • THE OTHER IS A PLAIN DIAGRAM OF THE RAIN: a flat grey rectangle covered in pale diagonal
    streaks and nothing else. COPY THE ANGLE AND DIRECTION OF THOSE STREAKS EXACTLY. Do not
    copy its colour, do not use it as a background, do not draw a grey panel anywhere.
  THERE ARE ONLY TWO CHANGES from the earlier attempt, both described below: the rain now falls
  the other way, and the street tree is bent the other way. Everything else stays as it is.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.

2. THE SHUTTER IS DOWN. Where the two bays of full-height glass were, there is now a metal
   roller shutter, closed all the way to the ground, filling both bays completely. Draw it as
   one large, simple, dark shape: a warm dark grey-brown metal skin ruled with fine even
   horizontal ribs and a narrow dark slot at the bottom where it meets the ground. The shutter
   hangs in the same plane as the glass did, BEHIND the three columns, so all three columns and
   the whole covered walkway stand in front of it and are not covered by it. No glass and no
   waiting room can be seen anywhere; there is no light of any kind coming from inside the
   clinic. It is clean and in good order, freshly painted metal, and it sits in deep shade.

3. THE LIGHT. Keep the light of the earlier attempt exactly: a typhoon in the middle of the
   afternoon, still daylight but flat, low and dim, no sun anywhere, a deep bruised blue-grey
   sky with a green cast, dark wet streaks running down the concrete, no cast sun shadows. Keep
   this ladder from lightest to darkest: the woman's yellow rain poncho is the lightest thing in
   the picture and nothing else comes near it; then the broken reflections of the sky on the wet
   road; then the mid warm grey concrete wall; then the sky; and darkest of all the covered
   walkway in deep shade and the closed shutter inside it.

4. THE DIRECTION OF THE WIND AND THE RAIN - THIS IS THE FIRST OF THE TWO CHANGES AND IT IS THE
   MOST IMPORTANT LINE IN THESE INSTRUCTIONS. THE WIND BLOWS FROM THE LEFT EDGE OF THE PICTURE
   TOWARDS THE RIGHT EDGE.
     • EVERY RAIN STROKE IS SHAPED LIKE A BACKSLASH CHARACTER: it starts high and near the LEFT
       and ends low and near the RIGHT. Top end towards the top-left corner, bottom end towards
       the bottom-right corner, leaning about 40 degrees away from vertical. This is exactly the
       angle drawn in the provided rain diagram - match it stroke for stroke.
     • NOT ONE STROKE IS SHAPED LIKE A FORWARD SLASH. No stroke starts near the top-right and
       ends near the bottom-left. In the earlier attempt they were all drawn the wrong way round;
       every single one of them is now mirrored.
     • The three people walk towards the LEFT, straight into the wind, exactly as in the earlier
       attempt: bodies tipped towards the LEFT, and everything loose on them - hoods, hems, hair,
       the back of the poncho, the older man's coat - streaming out behind them towards the
       RIGHT. Do not change them.
     • Every leaf, every branch, every plant, every splash, every piece of spray and every
       spilled thing is blown towards the RIGHT.
   Keep the rain heavy and keep the wind streaks of the earlier attempt, only mirrored: many
   short parallel hand-drawn rain strokes gathered into dense slanting bands, short splash ticks
   along the ground, water pouring off the front edge of the canopy, tight parallel groups of
   short, straight, hard-edged pale gust streaks low across the picture at the same angle as the
   rain, sheets of fine spray skimming off the wet road towards the right, and puddles ruffled
   into small parallel ripples. No long single sweeping ribbon, no S-curve, no wavy line, no
   loop, no spiral, and nothing that touches or comes out of a person's body.

5. THE STREET TREE IS BENT THE OTHER WAY - THIS IS THE SECOND CHANGE. In the earlier attempt the
   small tree at the left edge leans towards the left, which is backwards for this wind. Mirror
   it: the trunk is bowed over towards the RIGHT in a clear curve, every branch and twig is
   swept towards the RIGHT, and the foliage is stretched into a long ragged streak trailing off
   to the RIGHT, thin and torn, with a gap of open sky on the LEFT-hand side of the tree where
   the wind has pushed the leaves away. Several leaves have been torn off and are flying towards
   the RIGHT. After the people, this tree is the most obviously wind-blown thing in the frame.

6. THE POTS BY THE CLINIC DOOR ARE NOT CALM. In the earlier attempt they stand neatly upright,
   which is wrong for this weather:
     • ONE POT IS TIPPED OVER AT AN ANGLE but still standing, leaning hard, its plant bent almost
       horizontal and streaming towards the RIGHT.
     • THE OTHER POT HAS BEEN BLOWN RIGHT OVER AND HAS BROKEN. It lies on its side on the covered
       walkway, cracked into two or three large clean pieces with a piece of the rim broken away,
       and the DARK WET SOIL HAS SPILLED OUT OF IT in a fan across the paving, trailing towards
       the RIGHT with the wind. The plant lies on its side in the spilled soil with its root ball
       showing, still green and still alive.
     • IT HAS JUST HAPPENED, IN THIS STORM. The broken edges are clean and freshly broken, the
       soil is a rich dark brown and obviously wet, and the plant is healthy. This is not
       rubbish, not litter, not an old dirty pot and not neglect. Everything else outside the
       clinic stays tidy.

7. THE THREE PEOPLE - KEEP THEM EXACTLY AS THEY ARE IN THE EARLIER ATTEMPT. Same three, same
   places, same sizes, same postures, all still walking towards the LEFT into the wind. They are
   the nearest things in the picture and they are big, the head of the nearest adult reaching
   about the height of the dark sign beam above the shutter:
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side, facing left, tipped
       forward from the ankles, one hand gripping the front edge of the hood at her forehead,
       the other arm hugging a bag against her chest, the back of the poncho blown out behind
       her to the RIGHT like a sail. SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands
       against the dark shutter - that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. He holds it out ahead of
       him towards the left, into the wind, with BOTH HANDS, arms straight, elbows locked, his
       weight back on his heels. The canopy has been pushed up and back towards the RIGHT, three
       of its ribs on the right-hand side have already flipped upward and folded the wrong way
       so that part of the canopy is a deep lopsided bowl opening at the sky, the fabric between
       those ribs stretched drum-tight into hard straight creases, and only the left-hand side
       of the canopy still points down. It is a deep teal. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat, facing left, holding a small CORAL umbrella low and tilted in front
       of him like a shield, taking short careful steps, his coat blown out behind him to the
       RIGHT.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. No figure is pale, faint, translucent, greyed out or drawn in outline
   only. Nobody looks at the camera.

8. THEIR FACES SHOW EFFORT, NOT DISTRESS. Eyes narrowed to short lines against the rain,
   eyebrows drawn together and pushed down, mouth a small closed line or slightly open with
   effort, chin tucked, cheeks a little flushed from the wind. They are working hard and they are
   fine. NOBODY IS CRYING: no tears, no screwed-up crying face, no down-turned open wailing
   mouth, and no hand rubbing or covering the eyes - a hand may grip a hood at the forehead, palm
   outward, but it must never cover the eyes. Nobody is frightened, nobody is shouting, nobody is
   in pain, nobody is falling over, and nobody is angry or scowling.

9. NOBODY IS IN DANGER, AND THE ONLY BROKEN THING IN THE PICTURE IS THAT ONE POT. Draw the
   weather, not a catastrophe: no lightning, no thunderbolt, no flying debris, no loose sheet
   metal, no fallen sign, no uprooted or snapped tree, no broken branches near anyone, no
   emergency vehicle, no flood, no broken glass and nothing broken on the building itself. The
   water on the ground is a thin sheet with shallow puddles, never above the ankle. The tree is
   bent right over but still standing and still whole.

10. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
    shutter. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted, boarded up,
    cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not because it is
    dirty, and the broken pot is something the wind is doing right now, not a sign of neglect.
    Nothing sinister, nothing haunted, nothing sad-looking about the building itself.

11. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The bag, the raincoats and the umbrellas are all plain. Any
    writing that appears in the reference pictures must be ignored and must not be copied.

12. STYLE - the same hand-drawn editorial illustration as the earlier attempt. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

13. COLOUR - dark and stormy, but never grey and never colourless. Keep the key of the earlier
    attempt: a black-green sky, mid warm grey concrete, near black-brown columns and shutter,
    cool slate grey wet road. All the colour is carried by a few small saturated things: the
    bright yellow poncho, the deep teal umbrella, the coral umbrella, the dark navy and dark
    green raincoats, the deep green of the tree and the plants, and the RICH DARK BROWN of the
    spilled wet soil. At least six distinct colours must still be readable at thumbnail size, and
    the yellow poncho must be the one the eye finds first. This is not a monochrome picture, not
    a sepia picture and not a blue-only picture, and there is no cyan, no turquoise and no patch
    of blue or bright sky anywhere.

AVOID: any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE SHAPED LIKE A FORWARD SLASH; any rain stroke that starts near the top-right of the picture
and ends near the bottom-left; rain falling towards the left; a tree bent towards the left;
branches or leaves blown towards the left; anything loose on a person streaming towards the left;
turning the people round to face right; a flat grey rectangle, panel or block of diagonal stripes
copied from the rain diagram; neat upright undisturbed pots by the door; a swept, tidy, undamaged
doorway; litter, rubbish, weeds, an old dirty cracked pot or general mess; dry soil; gentle wavy,
curving or S-shaped white ribbons drifting across the sky; long soft chalk air lines of the kind
used on a fine day; a calm, upright, untouched street tree; a round undisturbed tree crown; light
drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful building; a
wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or turquoise sky;
sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned shopfront; the shutter
drawn in front of the columns or across the outer edge of the covered walkway instead of behind
the columns in the plane of the glass; the covered walkway turned into a garage or a car port;
any glass, waiting room, lamp, lit window or warm light visible anywhere in the clinic; night,
sunset, an orange sky, lit street lamps, headlights; lightning, a thunderbolt, flying debris, a
fallen, snapped or uprooted tree, deep flood water, an overturned scooter, an emergency vehicle;
anyone falling, injured, frightened, shouting, scowling or crying; tears, a screwed-up crying
face, a hand rubbing or covering the eyes; an umbrella stripped to bare ribs with no fabric; an
intact, undamaged, ordinary umbrella; an empty street with nobody in it; small distant figures in
a wide empty scene; any figure drawn pale, faint, translucent, ghostly or in outline only;
peeling paint, cracks, stains, mould, rust, boards over the front, cobwebs, a derelict or haunted
building; greyscale, sepia or a single-colour picture; thick uniform black outlines;
photo-realism; 3D rendering; dental instruments, chairs, X-rays or teeth.
```

⚠ **如果第四版的雨還是反的**，就不要再改提示詞了 —— 改用**編輯**：只上傳第二版那張圖，
說「把畫面上每一道雨的斜線左右鏡射，其餘一個像素都不要動」。一次只改一件（第八節那條）。

---

---

## 五之七、⚠⚠⚠ 第四版：雨連四版都反，而且**鐵門的位置錯了**（2026-09-05）

使用者：「還是錯的　**而且鐵門的位置錯了**」

### ① 鐵門 —— 這一件比雨嚴重，而且是新的

**騎樓不見了。** 那張圖把鐵門畫在**建築最前面那個平面**上：捲門直接落到人行道，
三根柱子被壓平貼在捲門上、中間沒有空氣也沒有影子，**而且轉角柱右邊的側牆上也長出了捲門**。

⚠ 回去看原始照片（`drafts/og-topic-general-src.jpg`）就一目了然：
**一樓的玻璃是退進去的**，玻璃前面依序還有 **一道低階 → 一條淺色的騎樓地板 → 三根深咖啡色的柱子**，
柱子上方是騎樓的天花。鐵門是**在玻璃那個平面**降下來的，所以：

・**騎樓那個「房間」必須還看得到**（地板一條、低階一道、天花一片、柱子和捲門之間有空氣與陰影）。
・捲門的下緣落在**騎樓地板**上，不是落在街上。
・**側牆沒有捲門** —— 轉角柱右邊那面是平整的清水模，底下站著白色圓盆。

⚠⚠ 第四版的提示詞第 2 段其實寫著「hangs BEHIND the three columns」，
**但整段的主語一直是那塊金屬，騎樓本身一個名詞都沒有** ——
沒有地板、沒有階、沒有天花、沒有「中間有空氣」。
**通則：要模型畫出「A 在 B 後面」，就得把 B 和 A 之間那個空間當成一個東西寫出來**
（地板、階、天花、影子），只寫「在後面」它會理解成「貼著」。

### ② 雨 —— 第四次反過來，所以換一種綁法

正文寫死過、`AVOID` 寫死過、**連只有線條的方向參考圖都給了**，出圖照樣是 `/`。
到這裡可以確定：**「畫面的左上到右下」這個絕對座標，模型接不住。**

⚠⚠⚠ **但有一樣東西它四版都沒畫錯：三個人面向哪一邊。**
所以第五版把方向**綁在人身上**，整段不再從畫面座標講起：

> **雨是打在她臉上的。** 它從她的臉與身體正面那一側過來，打在她的胸口、小腿、帽兜的前緣；
> **她的背是被遮住的那一側，沒有任何東西吹到她背上。**

同一段再補兩個也是「形狀」的錨點：
・**傘**：他把傘頂向左邊的風，風就把傘面**往右邊**折回他頭上 —— 翻掉的是**右半邊**那幾根骨。
・**樹**：樹是被推的，不會像人一樣頂著風 —— 所以它倒的方向 ＝ **她背過去的那一邊**。

**通則：絕對方向講不動的時候，把方向掛在模型畫得最穩的那個東西上。**
這一站以前的版本是「形狀不要用文字描述，用參考圖」（第十之一節）與
「方向也是形狀，用參考圖」（第五之五節），這一條是第三層：
**參考圖也接不住時，就把它變成「相對於畫面裡某個一定會畫對的東西」的關係。**

### ⚠ 第五版還是反的話，走這一條（不要再改提示詞了）

**利用模型自己的偏好，把整張圖鏡射過來畫**：
① 把第四版那張圖**左右翻**（我這邊翻，傳給他）→ 那張裡建築的轉角在左邊、人朝右、雨是 `/`；
② 叫模型照那張畫（它畫 `/` 的雨從來沒有失手）；
③ **出來的圖再翻回來** —— 建築回到轉角在右、人回到朝左、而雨變成 `\`。
⚠ 這一招成立的唯一條件是**畫面上一個字都沒有**（這張正好是零文字），
文字會跟著鏡射。⚠ 代價是要多兩次翻圖，所以擺在最後才用。

---

## 五之八、~~第五版的提示詞~~ ⚠ **鐵門與雨都對了，但白弧線又跑回來** —— 現行的是第五之十節

⚠⚠ **參考圖照舊五張**：第四節那三張、**第四版出的那張圖**、**雨的方向參考圖**。
用途分開講：「**構圖、建築、光、天空、三個人的位置動作與朝向照第四版那張**；
**雨的角度照那張只有線條的參考圖**；要改的只有兩件 ——
**鐵門要退回騎樓裡面**、**雨要打在她的臉上（不是背上）**。」

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

TWO OF THE PROVIDED PICTURES ARE INSTRUCTIONS, NOT SCENES TO COPY WHOLE:
  • ONE IS AN EARLIER ATTEMPT AT THIS EXACT SCENE AND MOST OF IT IS ALREADY RIGHT. Copy its
    framing, its building, its closed shutter, its dark stormy light, its sky, its wet road,
    and the position, size, posture and facing of its three people, exactly as they are.
  • THE OTHER IS A PLAIN DIAGRAM OF THE RAIN: a flat grey rectangle covered in pale diagonal
    streaks and nothing else. COPY THE ANGLE AND DIRECTION OF THOSE STREAKS EXACTLY. Do not
    copy its colour, do not use it as a background, do not draw a grey panel anywhere.
  THERE ARE ONLY TWO CHANGES from the earlier attempt, both described below: the rain now falls
  the other way, and the street tree is bent the other way. Everything else stays as it is.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.

2. THE SHUTTER IS DOWN, AND IT HANGS DEEP INSIDE THE COVERED WALKWAY - THIS IS THE PART THE LAST
   ATTEMPT GOT WRONG. In the reference photograph the ground floor is recessed: the shopfront glass
   stands about one and a half metres BACK from the front edge of the building, and the three
   columns, the low step and the tiled walkway floor are all IN FRONT of it, out in the open air.
   The shutter comes down in the plane of that glass and nowhere else.
     • You must still be able to see the walkway itself: a strip of pale tiled floor running left
       to right in front of the shutter, a low step down from it to the wet street, the soffit
       (ceiling) of the walkway overhead, and the three columns standing clear of the shutter with
       air and shadow between them and it. The walkway is a room you could stand in, and it is the
       darkest part of the picture.
     • The shutter is one large, simple, dark shape filling the two bays BEHIND the columns: a warm
       dark grey-brown metal skin ruled with fine even horizontal ribs, with a narrow dark slot at
       the bottom where it meets the walkway floor - not the street.
     • THE SHUTTER IS NOT DRAWN ACROSS THE FRONT OF THE BUILDING. It does not touch the outer edge
       of the canopy, it does not pass in front of any column, it does not come down onto the
       pavement, and the columns are not flattened against it like stickers.
     • THE SIDE ELEVATION HAS NO SHUTTER. To the right of the corner column the long side wall of
       the building recedes away from us: it is plain smooth concrete with the white cylindrical
       planters along its base. No ribbed metal, no second shutter, no opening of any kind on that
       wall.
     • The shutter is clean and in good order, freshly painted metal, sitting in deep shade, and no
       light of any kind comes from inside the clinic.


3. THE LIGHT. Keep the light of the earlier attempt exactly: a typhoon in the middle of the
   afternoon, still daylight but flat, low and dim, no sun anywhere, a deep bruised blue-grey
   sky with a green cast, dark wet streaks running down the concrete, no cast sun shadows. Keep
   this ladder from lightest to darkest: the woman's yellow rain poncho is the lightest thing in
   the picture and nothing else comes near it; then the broken reflections of the sky on the wet
   road; then the mid warm grey concrete wall; then the sky; and darkest of all the covered
   walkway in deep shade and the closed shutter inside it.

4. THE DIRECTION OF THE RAIN - FOUR ATTEMPTS HAVE NOW DRAWN THIS BACKWARDS, SO READ IT OFF THE
   PEOPLE, NOT OFF THE FRAME. The three people are facing the LEFT edge of the picture and leaning
   forward into the weather, and they are drawn correctly - do not move them. The wind is the thing
   they are leaning into, so IT COMES FROM THE LEFT EDGE AND BLOWS TOWARDS THE RIGHT EDGE, and
   everything else in the picture obeys that:
     • THE RAIN IS DRIVEN INTO THE WOMAN'S FACE. It arrives on the side her face and the front of
       her body point towards; the rain is striking her chest, her shins and the front of her hood.
       Her back and the back of her poncho are the sheltered side. Nothing is blowing onto her back.
     • Every rain stroke therefore has the shape of a BACKSLASH CHARACTER: the top end of each
       stroke is nearer the LEFT edge and the bottom end is nearer the RIGHT edge, leaning about 40
       degrees away from vertical. If you extended one stroke it would enter at the top-left corner
       of the picture and leave at the bottom-right corner. This is the angle drawn in the provided
       rain diagram - match it stroke for stroke.
     • NOT ONE STROKE IS SHAPED LIKE A FORWARD SLASH, and no stroke runs from the top-right down to
       the bottom-left. In the previous attempt every stroke was drawn the wrong way round; all of
       them are now mirrored.
     • THE UMBRELLA CONFIRMS IT. The man pushes his umbrella out ahead of him towards the LEFT, into
       the wind, and the wind is folding the canopy back over his head towards the RIGHT: the ribs
       that have already flipped the wrong way are the ones on the RIGHT-hand side of the canopy,
       and the fabric is being pushed away from the left edge, never towards it.
     • Everything loose streams to the RIGHT: hoods, hems, hair, the back of the poncho, the older
       man's coat, every leaf, every splash, every piece of spray and the spilled soil.
   Keep the rain heavy and keep the hard wind streaks of the previous attempt, only mirrored: many
   short parallel hand-drawn rain strokes gathered into dense slanting bands, short splash ticks
   along the ground, water pouring off the front edge of the canopy, tight parallel groups of short,
   straight, hard-edged pale gust streaks low across the picture at the same angle as the rain,
   sheets of fine spray skimming off the wet road towards the right, and puddles ruffled into small
   parallel ripples. No long single sweeping ribbon, no S-curve, no wavy line, no loop, no spiral,
   and nothing that touches or comes out of a person's body.


5. THE STREET TREE IS BENT AWAY FROM THE PEOPLE'S FACES. In the previous attempt the small tree at
   the left edge leans towards the left, which is backwards: it is leaning into the wind like a
   person, which a tree cannot do. A tree is pushed, so it bends the way the wind is going, which
   is the way the woman's back is turned. Mirror it: the trunk is bowed over towards the RIGHT in a clear curve, every branch and twig is
   swept towards the RIGHT, and the foliage is stretched into a long ragged streak trailing off
   to the RIGHT, thin and torn, with a gap of open sky on the LEFT-hand side of the tree where
   the wind has pushed the leaves away. Several leaves have been torn off and are flying towards
   the RIGHT. After the people, this tree is the most obviously wind-blown thing in the frame.

6. THE POTS BY THE CLINIC DOOR ARE NOT CALM. In the earlier attempt they stand neatly upright,
   which is wrong for this weather:
     • ONE POT IS TIPPED OVER AT AN ANGLE but still standing, leaning hard, its plant bent almost
       horizontal and streaming towards the RIGHT.
     • THE OTHER POT HAS BEEN BLOWN RIGHT OVER AND HAS BROKEN. It lies on its side on the covered
       walkway, cracked into two or three large clean pieces with a piece of the rim broken away,
       and the DARK WET SOIL HAS SPILLED OUT OF IT in a fan across the walkway floor, trailing
       towards the RIGHT with the wind - the same way the woman's poncho is streaming, never
       towards the side she is facing. The plant lies on its side in the spilled soil with its root ball
       showing, still green and still alive.
     • IT HAS JUST HAPPENED, IN THIS STORM. The broken edges are clean and freshly broken, the
       soil is a rich dark brown and obviously wet, and the plant is healthy. This is not
       rubbish, not litter, not an old dirty pot and not neglect. Everything else outside the
       clinic stays tidy.

7. THE THREE PEOPLE - KEEP THEM EXACTLY AS THEY ARE IN THE EARLIER ATTEMPT. Same three, same
   places, same sizes, same postures, all still walking towards the LEFT into the wind. They are
   the nearest things in the picture and they are big, the head of the nearest adult reaching
   about the height of the dark sign beam above the shutter:
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side, facing left, tipped
       forward from the ankles, one hand gripping the front edge of the hood at her forehead,
       the other arm hugging a bag against her chest, the back of the poncho blown out behind
       her to the RIGHT like a sail. SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands
       against the dark shutter - that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. He holds it out ahead of
       him towards the left, into the wind, with BOTH HANDS, arms straight, elbows locked, his
       weight back on his heels. The canopy has been pushed up and back towards the RIGHT, three
       of its ribs on the right-hand side have already flipped upward and folded the wrong way
       so that part of the canopy is a deep lopsided bowl opening at the sky, the fabric between
       those ribs stretched drum-tight into hard straight creases, and only the left-hand side
       of the canopy still points down. It is a deep teal. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat, facing left, holding a small CORAL umbrella low and tilted in front
       of him like a shield, taking short careful steps, his coat blown out behind him to the
       RIGHT.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. No figure is pale, faint, translucent, greyed out or drawn in outline
   only. Nobody looks at the camera.

8. THEIR FACES SHOW EFFORT, NOT DISTRESS. Eyes narrowed to short lines against the rain,
   eyebrows drawn together and pushed down, mouth a small closed line or slightly open with
   effort, chin tucked, cheeks a little flushed from the wind. They are working hard and they are
   fine. NOBODY IS CRYING: no tears, no screwed-up crying face, no down-turned open wailing
   mouth, and no hand rubbing or covering the eyes - a hand may grip a hood at the forehead, palm
   outward, but it must never cover the eyes. Nobody is frightened, nobody is shouting, nobody is
   in pain, nobody is falling over, and nobody is angry or scowling.

9. NOBODY IS IN DANGER, AND THE ONLY BROKEN THING IN THE PICTURE IS THAT ONE POT. Draw the
   weather, not a catastrophe: no lightning, no thunderbolt, no flying debris, no loose sheet
   metal, no fallen sign, no uprooted or snapped tree, no broken branches near anyone, no
   emergency vehicle, no flood, no broken glass and nothing broken on the building itself. The
   water on the ground is a thin sheet with shallow puddles, never above the ankle. The tree is
   bent right over but still standing and still whole.

10. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
    shutter. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted, boarded up,
    cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not because it is
    dirty, and the broken pot is something the wind is doing right now, not a sign of neglect.
    Nothing sinister, nothing haunted, nothing sad-looking about the building itself.

11. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The bag, the raincoats and the umbrellas are all plain. Any
    writing that appears in the reference pictures must be ignored and must not be copied.

12. STYLE - the same hand-drawn editorial illustration as the earlier attempt. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

13. COLOUR - dark and stormy, but never grey and never colourless. Keep the key of the earlier
    attempt: a black-green sky, mid warm grey concrete, near black-brown columns and shutter,
    cool slate grey wet road. All the colour is carried by a few small saturated things: the
    bright yellow poncho, the deep teal umbrella, the coral umbrella, the dark navy and dark
    green raincoats, the deep green of the tree and the plants, and the RICH DARK BROWN of the
    spilled wet soil. At least six distinct colours must still be readable at thumbnail size, and
    the yellow poncho must be the one the eye finds first. This is not a monochrome picture, not
    a sepia picture and not a blue-only picture, and there is no cyan, no turquoise and no patch
    of blue or bright sky anywhere.

AVOID: the shutter drawn across the front of the building instead of deep inside the covered
walkway; a shutter that touches the outer edge of the canopy or comes down onto the pavement;
columns flattened against the shutter with no air, floor or shadow between them; a missing covered
walkway; ribbed metal or a second shutter anywhere on the side wall to the right of the corner
column; rain blowing onto the backs of the people instead of into their faces; an umbrella folding
back towards the left; any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE SHAPED LIKE A FORWARD SLASH; any rain stroke that starts near the top-right of the picture
and ends near the bottom-left; rain falling towards the left; a tree bent towards the left;
branches or leaves blown towards the left; anything loose on a person streaming towards the left;
turning the people round to face right; a flat grey rectangle, panel or block of diagonal stripes
copied from the rain diagram; neat upright undisturbed pots by the door; a swept, tidy, undamaged
doorway; litter, rubbish, weeds, an old dirty cracked pot or general mess; dry soil; gentle wavy,
curving or S-shaped white ribbons drifting across the sky; long soft chalk air lines of the kind
used on a fine day; a calm, upright, untouched street tree; a round undisturbed tree crown; light
drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful building; a
wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or turquoise sky;
sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned shopfront; the shutter
drawn in front of the columns or across the outer edge of the covered walkway instead of behind
the columns in the plane of the glass; the covered walkway turned into a garage or a car port;
any glass, waiting room, lamp, lit window or warm light visible anywhere in the clinic; night,
sunset, an orange sky, lit street lamps, headlights; lightning, a thunderbolt, flying debris, a
fallen, snapped or uprooted tree, deep flood water, an overturned scooter, an emergency vehicle;
anyone falling, injured, frightened, shouting, scowling or crying; tears, a screwed-up crying
face, a hand rubbing or covering the eyes; an umbrella stripped to bare ribs with no fabric; an
intact, undamaged, ordinary umbrella; an empty street with nobody in it; small distant figures in
a wide empty scene; any figure drawn pale, faint, translucent, ghostly or in outline only;
peeling paint, cracks, stains, mould, rust, boards over the front, cobwebs, a derelict or haunted
building; greyscale, sepia or a single-colour picture; thick uniform black outlines;
photo-realism; 3D rendering; dental instruments, chairs, X-rays or teeth.```

---

---

## 五之九、✅ 第五版：鐵門與雨都對了 —— **但那組白弧線第二次跑回來**（2026-09-05）

使用者：「這個對了　但**微風徐徐的白色弧線又跑出來了**　要改成颱風猛烈吹送的感覺」

**這一輪要改的只有一件事**，其餘（建築、騎樓、鐵門的平面、光、雨的方向、樹、盆栽、三個人）
**全部正確，一個字都不要動** —— 第六版因此把每一段的口氣從「要改成…」換成
「**上一版已經對了，這一段只是讓你核對**」，不然它會把已經對的東西再翻一次。

### ⚠⚠⚠ 為什麼禁令失效：**它在 `AVOID` 裡，而肇因在正文第 1 段**

第五版**兩處都寫了**：第 4 段尾巴「no long single sweeping ribbon, no S-curve, no wavy line」、
`AVOID` 裡「gentle wavy, curving or S-shaped white ribbons drifting across the sky;
long soft chalk air lines of the kind used on a fine day」——**兩條都輸了。**

成因是：**那幾條白弧線畫在參考圖上，而第 1 段的標題就是
「THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS」。**
一般牙科那張晴天圖上，白弧線是橫過整棟建築畫的 —— 叫它「照著那張畫建築」，
它就連那些線一起抄過來了，而禁令躺在兩百行外的 `AVOID` 清單裡。

⚠⚠⚠ **通則：一條「不要照抄那張參考圖的某個元素」的禁令，要寫在
「叫它照抄那張圖」的那一段裡面，不能只寫在 `AVOID`。**
`AVOID` 是最後一道網，不是放置條件的地方 —— **距離會決定哪一條贏**
（同第十四節那條「正文的權重比 AVOID 高」，這一次是同一件事的空間版）。
第六版因此在第 1 段的最後直接補一條：
「這張圖上有幾條長長的白色弧線，那是**它那一天的微風**，不是建築的一部分，不要抄。」

### 這一輪第二件：**風的線條要自己一節，而且要給幾何**

第五版把它塞在第 4 段（雨）的最後一句，是個從屬子句 ——
同第十五節第 3 條那個路樹：**凡是要它畫出來的東西，就要自己一段、自己一句動詞。**
第六版給了它獨立的第 5 節，並且把「颱風的風」寫成**可以量的形狀**：

・**一陣風是一「群」不是一「條」** —— 六到十五道短直線密密並排，好幾群。
・**每一道不超過畫面寬度的十分之一**（這是可以現場量的驗收條件）。
・**和雨同角度**（一樣是反斜線），風和雨是同一件天氣。
・**貼著東西走，不要浮在空中** —— 貼著積水掃、從雨遮前緣被扯下來、繞過轉角柱、
  穿過樹冠、從雨衣與傘上被拉走；**屋頂線以上的天空幾乎只有雨**。
・**「風」主要靠它做的事來讀**（葉子被扯掉、水霧被掀起、樹被拉長、傘被折）——
  **一道線如果沒有在解釋畫面裡已經發生的動作，就不要畫。**

---

## 五之十、~~第六版的提示詞~~ ✅ **過了** —— 現行的是第五之十二節（加水的細節）

⚠⚠ **參考圖照舊五張**，但這一次的說法要換：
「**第五版那張圖除了風的線條以外全部正確**，建築、騎樓、鐵門、光、天空、雨的角度、
樹、破掉的盆栽、三個人**原封不動照抄**；**唯一要改的是那幾條長長的白色弧線**。」
⚠ 一般牙科那張晴天圖仍然要餵（建築的來源），**但要明講它上面的白弧線不要抄**。

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

TWO OF THE PROVIDED PICTURES ARE INSTRUCTIONS, NOT SCENES TO COPY WHOLE:
  • ONE IS AN EARLIER ATTEMPT AT THIS EXACT SCENE AND EVERYTHING IN IT IS NOW CORRECT EXCEPT ONE
    THING. Copy its framing, its building, its covered walkway, its closed shutter, its dark
    stormy light, its sky, its wet road, THE ANGLE AND DIRECTION OF ITS RAIN, its bent tree, its
    broken pot and the position, size, posture and facing of its three people, exactly as they
    are. Do not mirror anything. Do not improve anything.
  • THE OTHER IS A PLAIN DIAGRAM OF THE RAIN: a flat grey rectangle covered in pale diagonal
    streaks and nothing else. The rain in the earlier attempt already matches it; use it only to
    confirm the angle. Do not copy its colour, do not use it as a background, do not draw a grey
    panel anywhere.
  THERE IS ONLY ONE CHANGE IN THIS ROUND, AND IT IS THE WIND LINES - see section 5. The earlier
  attempt drew the wind as long soft white curving ribbons floating across the picture, which is
  how a fine-day breeze is drawn. Those are the only thing being replaced. Everything else stays
  exactly as it is.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.
     • ⚠ THE FINE-DAY ILLUSTRATION OF THIS BUILDING HAS SEVERAL LONG, SOFT, WHITE CURVED CHALK
       LINES FLOATING ACROSS IT. Those lines are that picture's gentle fair-weather breeze. THEY
       ARE NOT PART OF THE BUILDING AND THEY MUST NOT BE COPIED. Copy the walls, the columns, the
       windows, the canopy and the planters from it; leave every one of those white curves behind.

2. THE SHUTTER IS DOWN, AND IT HANGS DEEP INSIDE THE COVERED WALKWAY. The previous attempt drew
   this correctly - keep it exactly as it is, and use the following only to check it. In the
   reference photograph the ground floor is recessed: the shopfront glass
   stands about one and a half metres BACK from the front edge of the building, and the three
   columns, the low step and the tiled walkway floor are all IN FRONT of it, out in the open air.
   The shutter comes down in the plane of that glass and nowhere else.
     • You must still be able to see the walkway itself: a strip of pale tiled floor running left
       to right in front of the shutter, a low step down from it to the wet street, the soffit
       (ceiling) of the walkway overhead, and the three columns standing clear of the shutter with
       air and shadow between them and it. The walkway is a room you could stand in, and it is the
       darkest part of the picture.
     • The shutter is one large, simple, dark shape filling the two bays BEHIND the columns: a warm
       dark grey-brown metal skin ruled with fine even horizontal ribs, with a narrow dark slot at
       the bottom where it meets the walkway floor - not the street.
     • THE SHUTTER IS NOT DRAWN ACROSS THE FRONT OF THE BUILDING. It does not touch the outer edge
       of the canopy, it does not pass in front of any column, it does not come down onto the
       pavement, and the columns are not flattened against it like stickers.
     • THE SIDE ELEVATION HAS NO SHUTTER. To the right of the corner column the long side wall of
       the building recedes away from us: it is plain smooth concrete with the white cylindrical
       planters along its base. No ribbed metal, no second shutter, no opening of any kind on that
       wall.
     • The shutter is clean and in good order, freshly painted metal, sitting in deep shade, and no
       light of any kind comes from inside the clinic.


3. THE LIGHT. Keep the light of the earlier attempt exactly: a typhoon in the middle of the
   afternoon, still daylight but flat, low and dim, no sun anywhere, a deep bruised blue-grey
   sky with a green cast, dark wet streaks running down the concrete, no cast sun shadows. Keep
   this ladder from lightest to darkest: the woman's yellow rain poncho is the lightest thing in
   the picture and nothing else comes near it; then the broken reflections of the sky on the wet
   road; then the mid warm grey concrete wall; then the sky; and darkest of all the covered
   walkway in deep shade and the closed shutter inside it.

4. THE DIRECTION OF THE RAIN IS NOW CORRECT IN THE EARLIER ATTEMPT - COPY IT EXACTLY AND DO NOT
   MIRROR IT. This paragraph is only here so you can check it. The three people face the LEFT edge
   and lean forward into the weather; the wind is the thing they are leaning into, so IT COMES FROM
   THE LEFT EDGE AND BLOWS TOWARDS THE RIGHT EDGE, and everything in the picture obeys that:
     • THE RAIN IS DRIVEN INTO THE WOMAN'S FACE. It arrives on the side her face and the front of
       her body point towards; the rain is striking her chest, her shins and the front of her hood.
       Her back and the back of her poncho are the sheltered side. Nothing is blowing onto her back.
     • Every rain stroke therefore has the shape of a BACKSLASH CHARACTER: the top end of each
       stroke is nearer the LEFT edge and the bottom end is nearer the RIGHT edge, leaning about 40
       degrees away from vertical. If you extended one stroke it would enter at the top-left corner
       of the picture and leave at the bottom-right corner. This is the angle drawn in the provided
       rain diagram - match it stroke for stroke.
     • NOT ONE STROKE IS SHAPED LIKE A FORWARD SLASH, and no stroke runs from the top-right down to
       the bottom-left.
     • THE UMBRELLA CONFIRMS IT. The man pushes his umbrella out ahead of him towards the LEFT, into
       the wind, and the wind is folding the canopy back over his head towards the RIGHT: the ribs
       that have already flipped the wrong way are the ones on the RIGHT-hand side of the canopy,
       and the fabric is being pushed away from the left edge, never towards it.
     • Everything loose streams to the RIGHT: hoods, hems, hair, the back of the poncho, the older
       man's coat, every leaf, every splash, every piece of spray and the spilled soil.
   Keep the rain of the previous attempt exactly: many short parallel hand-drawn rain strokes
   gathered into dense slanting bands, short splash ticks along the ground, water pouring off the
   front edge of the canopy, and puddles ruffled into small parallel ripples.


5. HOW THE WIND ITSELF IS DRAWN - THIS IS THE ONLY THING BEING CHANGED IN THIS ROUND. The
   previous attempt drew the wind as four or five LONG, SOFT, WHITE, GENTLY CURVING RIBBONS
   sweeping right across the picture and floating clear of everything. That is how a light breeze
   on a fine day is drawn, and it makes this typhoon look calm. Delete every one of them and draw
   the wind like this instead:
     • A GUST IS A GROUP, NEVER A LINE. Wind is shown as tight clusters of MANY short, straight,
       hard-edged pale streaks packed close together and all parallel, like a burst of speed lines.
       Six to fifteen streaks per cluster, and several clusters.
     • EVERY WIND STREAK IS SHORT AND STRAIGHT. No single streak is longer than about one tenth of
       the width of the picture. It is a straight dash with tapered ends, not a curve, not a
       ribbon, not an S, not a loop, not a spiral, and it never bends around anything.
     • EVERY WIND STREAK LIES AT THE SAME ANGLE AS THE RAIN, shaped like a backslash: high end
       nearer the left edge, low end nearer the right edge. The wind and the rain are the same
       weather and they run parallel.
     • THE WIND CLUSTERS HUG THINGS; THEY DO NOT FLOAT IN THE MIDDLE OF THE SKY. Put them where
       air is being forced past something: skimming low across the flooded road as torn sheets of
       spray, ripping off the front edge of the canopy with the water, whipping round the corner
       column of the building, tearing through the crown of the street tree, and streaming off the
       woman's poncho and the man's umbrella. The empty sky above the roofline stays almost bare -
       just rain.
     • THE WIND IS ALSO SHOWN BY WHAT IT IS DOING, and that matters more than the streaks: torn
       leaves flying, spray lifting off the puddles, the tree stretched out sideways, the umbrella
       folding, clothing snapping out flat. If a streak is not explaining a movement that is
       already happening in the picture, do not draw it.
     • The streaks are pale and thin and they sit UNDER the people and the building, never across
       a face, and nothing touches or comes out of a person's body.

6. THE STREET TREE IS ALREADY CORRECT IN THE EARLIER ATTEMPT - KEEP IT. A tree is pushed, so it
   bends the way the wind is going, which is the way the woman's back is turned: the trunk is
   bowed over towards the RIGHT in a clear curve, every branch and twig is
   swept towards the RIGHT, and the foliage is stretched into a long ragged streak trailing off
   to the RIGHT, thin and torn, with a gap of open sky on the LEFT-hand side of the tree where
   the wind has pushed the leaves away. Several leaves have been torn off and are flying towards
   the RIGHT. After the people, this tree is the most obviously wind-blown thing in the frame.

7. THE POTS BY THE CLINIC DOOR ARE ALREADY CORRECT IN THE EARLIER ATTEMPT - KEEP THEM AS DRAWN,
   including the soil. This paragraph is only here so you can check them:
     • ONE POT IS TIPPED OVER AT AN ANGLE but still standing, leaning hard, its plant bent almost
       horizontal and streaming towards the RIGHT.
     • THE OTHER POT HAS BEEN BLOWN RIGHT OVER AND HAS BROKEN. It lies on its side on the covered
       walkway, cracked into two or three large clean pieces with a piece of the rim broken away,
       and the DARK WET SOIL HAS SPILLED OUT OF IT in a fan across the walkway floor, trailing
       towards the RIGHT with the wind - the same way the woman's poncho is streaming, never
       towards the side she is facing. The plant lies on its side in the spilled soil with its root ball
       showing, still green and still alive.
     • IT HAS JUST HAPPENED, IN THIS STORM. The broken edges are clean and freshly broken, the
       soil is a rich dark brown and obviously wet, and the plant is healthy. This is not
       rubbish, not litter, not an old dirty pot and not neglect. Everything else outside the
       clinic stays tidy.

8. THE THREE PEOPLE - KEEP THEM EXACTLY AS THEY ARE IN THE EARLIER ATTEMPT. Same three, same
   places, same sizes, same postures, all still walking towards the LEFT into the wind. They are
   the nearest things in the picture and they are big, the head of the nearest adult reaching
   about the height of the dark sign beam above the shutter:
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side, facing left, tipped
       forward from the ankles, one hand gripping the front edge of the hood at her forehead,
       the other arm hugging a bag against her chest, the back of the poncho blown out behind
       her to the RIGHT like a sail. SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands
       against the dark shutter - that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. He holds it out ahead of
       him towards the left, into the wind, with BOTH HANDS, arms straight, elbows locked, his
       weight back on his heels. The canopy has been pushed up and back towards the RIGHT, three
       of its ribs on the right-hand side have already flipped upward and folded the wrong way
       so that part of the canopy is a deep lopsided bowl opening at the sky, the fabric between
       those ribs stretched drum-tight into hard straight creases, and only the left-hand side
       of the canopy still points down. It is a deep teal. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat, facing left, holding a small CORAL umbrella low and tilted in front
       of him like a shield, taking short careful steps, his coat blown out behind him to the
       RIGHT.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. No figure is pale, faint, translucent, greyed out or drawn in outline
   only. Nobody looks at the camera.

9. THEIR FACES SHOW EFFORT, NOT DISTRESS. Eyes narrowed to short lines against the rain,
   eyebrows drawn together and pushed down, mouth a small closed line or slightly open with
   effort, chin tucked, cheeks a little flushed from the wind. They are working hard and they are
   fine. NOBODY IS CRYING: no tears, no screwed-up crying face, no down-turned open wailing
   mouth, and no hand rubbing or covering the eyes - a hand may grip a hood at the forehead, palm
   outward, but it must never cover the eyes. Nobody is frightened, nobody is shouting, nobody is
   in pain, nobody is falling over, and nobody is angry or scowling.

10. NOBODY IS IN DANGER, AND THE ONLY BROKEN THING IN THE PICTURE IS THAT ONE POT. Draw the
   weather, not a catastrophe: no lightning, no thunderbolt, no flying debris, no loose sheet
   metal, no fallen sign, no uprooted or snapped tree, no broken branches near anyone, no
   emergency vehicle, no flood, no broken glass and nothing broken on the building itself. The
   water on the ground is a thin sheet with shallow puddles, never above the ankle. The tree is
   bent right over but still standing and still whole.

11. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
    shutter. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted, boarded up,
    cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not because it is
    dirty, and the broken pot is something the wind is doing right now, not a sign of neglect.
    Nothing sinister, nothing haunted, nothing sad-looking about the building itself.

12. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The bag, the raincoats and the umbrellas are all plain. Any
    writing that appears in the reference pictures must be ignored and must not be copied.

13. STYLE - the same hand-drawn editorial illustration as the earlier attempt. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

14. COLOUR - dark and stormy, but never grey and never colourless. Keep the key of the earlier
    attempt: a black-green sky, mid warm grey concrete, near black-brown columns and shutter,
    cool slate grey wet road. All the colour is carried by a few small saturated things: the
    bright yellow poncho, the deep teal umbrella, the coral umbrella, the dark navy and dark
    green raincoats, the deep green of the tree and the plants, and the RICH DARK BROWN of the
    spilled wet soil. At least six distinct colours must still be readable at thumbnail size, and
    the yellow poncho must be the one the eye finds first. This is not a monochrome picture, not
    a sepia picture and not a blue-only picture, and there is no cyan, no turquoise and no patch
    of blue or bright sky anywhere.

AVOID: the shutter drawn across the front of the building instead of deep inside the covered
walkway; a shutter that touches the outer edge of the canopy or comes down onto the pavement;
columns flattened against the shutter with no air, floor or shadow between them; a missing covered
walkway; ribbed metal or a second shutter anywhere on the side wall to the right of the corner
column; rain blowing onto the backs of the people instead of into their faces; an umbrella folding
back towards the left; any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE SHAPED LIKE A FORWARD SLASH; any rain stroke that starts near the top-right of the picture
and ends near the bottom-left; rain falling towards the left; a tree bent towards the left;
branches or leaves blown towards the left; anything loose on a person streaming towards the left;
turning the people round to face right; a flat grey rectangle, panel or block of diagonal stripes
copied from the rain diagram; neat upright undisturbed pots by the door; a swept, tidy, undamaged
doorway; litter, rubbish, weeds, an old dirty cracked pot or general mess; dry soil; ANY LONG, SOFT, CURVING OR
S-SHAPED WHITE RIBBON SWEEPING ACROSS THE PICTURE; any single white line longer than a tenth of
the picture's width; white air lines floating free in the middle of the empty sky; the gentle chalk
breeze lines copied from the fine-day illustration of this building; a wind streak that curves,
bends round an object or crosses a face; a calm, upright, untouched street tree; a round undisturbed tree crown; light
drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful building; a
wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or turquoise sky;
sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned shopfront; the shutter
drawn in front of the columns or across the outer edge of the covered walkway instead of behind
the columns in the plane of the glass; the covered walkway turned into a garage or a car port;
any glass, waiting room, lamp, lit window or warm light visible anywhere in the clinic; night,
sunset, an orange sky, lit street lamps, headlights; lightning, a thunderbolt, flying debris, a
fallen, snapped or uprooted tree, deep flood water, an overturned scooter, an emergency vehicle;
anyone falling, injured, frightened, shouting, scowling or crying; tears, a screwed-up crying
face, a hand rubbing or covering the eyes; an umbrella stripped to bare ribs with no fabric; an
intact, undamaged, ordinary umbrella; an empty street with nobody in it; small distant figures in
a wide empty scene; any figure drawn pale, faint, translucent, ghostly or in outline only;
peeling paint, cracks, stains, mould, rust, boards over the front, cobwebs, a derelict or haunted
building; greyscale, sepia or a single-colour picture; thick uniform black outlines;
photo-realism; 3D rendering; dental instruments, chairs, X-rays or teeth.```

---

---

## 五之十一、✅ 第六版過了 —— 這一輪只加「水」（2026-09-05）

使用者：「蠻好的　增加一點**窗框　屋簷　積水　滴水**的樣子」

**這是第一輪「純粹加東西」的修改** —— 前六版每一輪都在治一個錯，這一輪畫面上
沒有任何東西是錯的。做法因此整個不同：

⚠⚠⚠ **每一段的口氣都要再檢查一次。** 第六版的第 5 段寫著
「**風的線條是這一輪唯一要改的**，把那四五條白弧線全部刪掉」——
那句話在第七版就變成「把已經畫對的風再重畫一次」的指令。
抬頭那一塊同理（「唯一要改的是風的線條」）。**兩處都改成
「上一版已經對了，這一段只是讓你核對」，並把「這一輪唯一要加的」明確指向新的第 6 段。**
（＝第六節第 13 條那條，這一輪是它的第二次現場。）

### 加什麼（新的第 6 節，其餘一個字都沒動）

・**窗框**：每一個突出的深色窗盒，上緣與下緣各一條細亮的水線，**盒子底下一道
  往下走、略略散開的深色濕痕**，下唇掛幾滴。
・**屋簷**：雨遮前緣與左邊那棟老房子的瓦口，掛一排**分開的**水滴（不是水簾、
  不是瀑布），而且**風很大，每一滴落下時都被吹斜、和雨同角度**。轉角那裡一條比較粗的水線。
・**滴水要有「落點」才讀得出來**：水滴打到的地方畫**同心的小圈**（幾個互相疊著）
  ＋ 幾個往上彈的小濺點。**沒有那些圈，掛在屋簷上的短線只是裝飾。**
・**積水**：街上是一層流動的薄水；**騎樓外緣那道低階旁邊聚成比較深、比較靜的一灘**，
  倒映出鐵門與柱子的破碎豎影 ＋ 一抹黃雨衣；水面被風吹成同角度的細波紋。
・**騎樓地板要留乾**（只有外緣一條濕）—— 那條乾的地帶正好在說「騎樓是退進去的、
  有遮蔽的空間」，順便再幫第 2 段那個平面關係補一次證據。

### ⚠⚠⚠ 這一輪特有的風險：**加濕痕很容易變成「這棟樓很髒」**

這一站有前科（2026-08-22「像鬼屋欸」，第十一之一節），而**牆上往下流的深色痕跡
正是「年久失修」最典型的畫法** —— 鏽、青苔、水漬、髒污全部長成那個樣子。
所以第 6 段最後兩條是專門擋這件事的：
**「這些水是乾淨的雨水，深色只是濕，乾了還是同一個乾淨的灰」**，
`AVOID` 也補了鏽色／橘／綠／黑的流痕、青苔、髒污、舊水漬。

⚠ 另外補一條**縮圖的**：這些濕痕與水滴是**細而安靜的質感**，
不可以讓牆變成條紋、不可以搶過那件黃雨衣。

---

## 五之十二、⭐ 第七版的提示詞（逐字，可直接複製）

⚠⚠ **參考圖照舊五張**，說法換成：
「**第六版那張圖全部正確，一個像素都不要改** —— 建築、鐵門、騎樓、光、天空、
雨、風的線條、樹、盆栽、三個人原封不動；**這一輪只在上面加一層東西：
建築正在滴水、流水、積水**（第 6 段）。」

```
Editorial illustration, landscape 16:9 (it will be cropped to 2:1 afterwards), for a small
message card. It will be seen at about 268 pixels wide, so everything must read at thumbnail
size: one single continuous scene, few large shapes, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: it is a wet, wild afternoon in a
typhoon. The dental clinic in the provided illustration has pulled its metal roller shutter all
the way down and is closed, and three people are struggling past it along the street, leaning
into the wind and the rain. The clinic itself is spotless and beautifully kept - it is shut
because of the weather, not abandoned. The mood is rough weather and ordinary human effort:
never a disaster, never danger, never gloom for its own sake.

TWO OF THE PROVIDED PICTURES ARE INSTRUCTIONS, NOT SCENES TO COPY WHOLE:
  • ONE IS AN EARLIER ATTEMPT AT THIS EXACT SCENE AND EVERYTHING IN IT IS NOW CORRECT EXCEPT ONE
    THING. Copy its framing, its building, its covered walkway, its closed shutter, its dark
    stormy light, its sky, its wet road, THE ANGLE AND DIRECTION OF ITS RAIN, its bent tree, its
    broken pot and the position, size, posture and facing of its three people, exactly as they
    are. Do not mirror anything. Do not improve anything.
  • THE OTHER IS A PLAIN DIAGRAM OF THE RAIN: a flat grey rectangle covered in pale diagonal
    streaks and nothing else. The rain in the earlier attempt already matches it; use it only to
    confirm the angle. Do not copy its colour, do not use it as a background, do not draw a grey
    panel anywhere.
  EVERYTHING IN THE EARLIER ATTEMPT IS NOW CORRECT, INCLUDING ITS WIND STREAKS. Keep its framing,
  its building, its shutter, its covered walkway, its light, its sky, its rain angle and direction,
  its wind streaks, its bent tree, its broken pot and the position, posture and facing of its three
  people EXACTLY as they are. Do not mirror anything, do not re-compose anything, do not re-draw
  anything. THIS ROUND ONLY ADDS ONE LAYER ON TOP OF IT: the water the storm is putting on the
  building itself - see section 6. Nothing already in the picture is being replaced.

1. THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS. Same viewpoint, same framing, same
   proportions, same drawing. Do not re-invent it, do not simplify it, do not re-proportion it
   to make room for anything:
     • The ground floor is set back under the upper storeys, forming a covered walkway carried
       by three square columns clad in dark chocolate-brown metal, making two equal bays
       between them. The columns are slim; the canopy above them is a thin horizontal band,
       never a heavy block. The covered walkway is open and you could still walk under it.
     • A slim dark steel beam runs across above the bays carrying a plain empty sign panel.
     • Above the beam, a band of smooth concrete carrying one complete row of tall narrow
       vertical windows set in dark metal boxes that project out from the wall, arranged in
       pairs, uncropped.
     • At the right, the last column is the corner of the building; from there a short stretch
       of the long side elevation recedes to the right, with two white cylindrical planters and
       small green shrubs along its base.
     • At the left edge, the low tiled roof and pale wall of the old neighbouring house, cropped
       by the frame, with a small street tree beside it.
     • ⚠ THE FINE-DAY ILLUSTRATION OF THIS BUILDING HAS SEVERAL LONG, SOFT, WHITE CURVED CHALK
       LINES FLOATING ACROSS IT. Those lines are that picture's gentle fair-weather breeze. THEY
       ARE NOT PART OF THE BUILDING AND THEY MUST NOT BE COPIED. Copy the walls, the columns, the
       windows, the canopy and the planters from it; leave every one of those white curves behind.

2. THE SHUTTER IS DOWN, AND IT HANGS DEEP INSIDE THE COVERED WALKWAY. The previous attempt drew
   this correctly - keep it exactly as it is, and use the following only to check it. In the
   reference photograph the ground floor is recessed: the shopfront glass
   stands about one and a half metres BACK from the front edge of the building, and the three
   columns, the low step and the tiled walkway floor are all IN FRONT of it, out in the open air.
   The shutter comes down in the plane of that glass and nowhere else.
     • You must still be able to see the walkway itself: a strip of pale tiled floor running left
       to right in front of the shutter, a low step down from it to the wet street, the soffit
       (ceiling) of the walkway overhead, and the three columns standing clear of the shutter with
       air and shadow between them and it. The walkway is a room you could stand in, and it is the
       darkest part of the picture.
     • The shutter is one large, simple, dark shape filling the two bays BEHIND the columns: a warm
       dark grey-brown metal skin ruled with fine even horizontal ribs, with a narrow dark slot at
       the bottom where it meets the walkway floor - not the street.
     • THE SHUTTER IS NOT DRAWN ACROSS THE FRONT OF THE BUILDING. It does not touch the outer edge
       of the canopy, it does not pass in front of any column, it does not come down onto the
       pavement, and the columns are not flattened against it like stickers.
     • THE SIDE ELEVATION HAS NO SHUTTER. To the right of the corner column the long side wall of
       the building recedes away from us: it is plain smooth concrete with the white cylindrical
       planters along its base. No ribbed metal, no second shutter, no opening of any kind on that
       wall.
     • The shutter is clean and in good order, freshly painted metal, sitting in deep shade, and no
       light of any kind comes from inside the clinic.


3. THE LIGHT. Keep the light of the earlier attempt exactly: a typhoon in the middle of the
   afternoon, still daylight but flat, low and dim, no sun anywhere, a deep bruised blue-grey
   sky with a green cast, dark wet streaks running down the concrete, no cast sun shadows. Keep
   this ladder from lightest to darkest: the woman's yellow rain poncho is the lightest thing in
   the picture and nothing else comes near it; then the broken reflections of the sky on the wet
   road; then the mid warm grey concrete wall; then the sky; and darkest of all the covered
   walkway in deep shade and the closed shutter inside it.

4. THE DIRECTION OF THE RAIN IS NOW CORRECT IN THE EARLIER ATTEMPT - COPY IT EXACTLY AND DO NOT
   MIRROR IT. This paragraph is only here so you can check it. The three people face the LEFT edge
   and lean forward into the weather; the wind is the thing they are leaning into, so IT COMES FROM
   THE LEFT EDGE AND BLOWS TOWARDS THE RIGHT EDGE, and everything in the picture obeys that:
     • THE RAIN IS DRIVEN INTO THE WOMAN'S FACE. It arrives on the side her face and the front of
       her body point towards; the rain is striking her chest, her shins and the front of her hood.
       Her back and the back of her poncho are the sheltered side. Nothing is blowing onto her back.
     • Every rain stroke therefore has the shape of a BACKSLASH CHARACTER: the top end of each
       stroke is nearer the LEFT edge and the bottom end is nearer the RIGHT edge, leaning about 40
       degrees away from vertical. If you extended one stroke it would enter at the top-left corner
       of the picture and leave at the bottom-right corner. This is the angle drawn in the provided
       rain diagram - match it stroke for stroke.
     • NOT ONE STROKE IS SHAPED LIKE A FORWARD SLASH, and no stroke runs from the top-right down to
       the bottom-left.
     • THE UMBRELLA CONFIRMS IT. The man pushes his umbrella out ahead of him towards the LEFT, into
       the wind, and the wind is folding the canopy back over his head towards the RIGHT: the ribs
       that have already flipped the wrong way are the ones on the RIGHT-hand side of the canopy,
       and the fabric is being pushed away from the left edge, never towards it.
     • Everything loose streams to the RIGHT: hoods, hems, hair, the back of the poncho, the older
       man's coat, every leaf, every splash, every piece of spray and the spilled soil.
   Keep the rain of the previous attempt exactly: many short parallel hand-drawn rain strokes
   gathered into dense slanting bands, short splash ticks along the ground, water pouring off the
   front edge of the canopy, and puddles ruffled into small parallel ripples.


5. THE WIND STREAKS ARE ALREADY CORRECT IN THE EARLIER ATTEMPT - KEEP THEM EXACTLY AS THEY ARE.
   This paragraph is only here so you can check them, and so that you do not drift back to the long
   soft white curving ribbons of a fine day:
     • A GUST IS A GROUP, NEVER A LINE. Wind is shown as tight clusters of MANY short, straight,
       hard-edged pale streaks packed close together and all parallel, like a burst of speed lines.
       Six to fifteen streaks per cluster, and several clusters.
     • EVERY WIND STREAK IS SHORT AND STRAIGHT. No single streak is longer than about one tenth of
       the width of the picture. It is a straight dash with tapered ends, not a curve, not a
       ribbon, not an S, not a loop, not a spiral, and it never bends around anything.
     • EVERY WIND STREAK LIES AT THE SAME ANGLE AS THE RAIN, shaped like a backslash: high end
       nearer the left edge, low end nearer the right edge. The wind and the rain are the same
       weather and they run parallel.
     • THE WIND CLUSTERS HUG THINGS; THEY DO NOT FLOAT IN THE MIDDLE OF THE SKY. Put them where
       air is being forced past something: skimming low across the flooded road as torn sheets of
       spray, ripping off the front edge of the canopy with the water, whipping round the corner
       column of the building, tearing through the crown of the street tree, and streaming off the
       woman's poncho and the man's umbrella. The empty sky above the roofline stays almost bare -
       just rain.
     • THE WIND IS ALSO SHOWN BY WHAT IT IS DOING, and that matters more than the streaks: torn
       leaves flying, spray lifting off the puddles, the tree stretched out sideways, the umbrella
       folding, clothing snapping out flat. If a streak is not explaining a movement that is
       already happening in the picture, do not draw it.
     • The streaks are pale and thin and they sit UNDER the people and the building, never across
       a face, and nothing touches or comes out of a person's body.

6. THE WATER THE STORM IS PUTTING ON THE BUILDING - THIS IS THE ONLY THING BEING ADDED IN THIS
   ROUND. At the moment the rain is falling but the building is not shedding any of it. Add these,
   and add nothing else:
     • THE WINDOW BOXES ON THE UPPER STOREY ARE RUNNING WITH WATER. Each tall narrow window sits in
       a dark metal box that projects from the wall. Put a thin bright highlight along the top edge
       and along the bottom lip of each box where water is sheeting over it, and let a narrow band
       of darker, wet concrete run straight down the wall below each box, spreading a little as it
       falls. A few separate drops hang along the underside of each lip.
     • THE EAVES AND THE CANOPY DRIP, THEY DO NOT POUR. Along the front edge of the thin canopy over
       the covered walkway, and along the tile ends of the low roof of the old house at the left,
       hang a row of SEPARATE drips - short tapered strokes, spaced apart, never a continuous
       curtain and never a waterfall. The wind is strong, so every falling drip is pulled sideways
       and leans at the same angle as the rain. At the corner of the building one thicker thread of
       water runs off the roofline.
     • WHERE THE DRIPS LAND, THE WATER ANSWERS. Small bright concentric rings on the wet paving and
       in the puddles directly beneath the canopy edge and beneath the eaves, a few of them
       overlapping, with tiny upward ticks of splash at the same spots. Those rings are what tell
       the eye that it is dripping.
     • THE STANDING WATER IS DEEPER AND CALMER AT THE KERB. The street is a shallow moving sheet;
       along the low step at the edge of the covered walkway it gathers into a longer, quieter pool
       that mirrors the dark shutter and the columns as broken vertical smears, with one broken
       smear of the woman's yellow. Its surface is ruffled into small parallel ripples at the same
       angle as the wind, and the older man's shoes break it into rings.
     • THE COVERED WALKWAY FLOOR STAYS MOSTLY DRY - only a wet band along its outer edge, where the
       rain blows in and the canopy drips. That dry strip is what shows the walkway is a sheltered
       space set back behind the columns.
     • ALL OF THIS WATER IS CLEAN RAINWATER ON A WELL-KEPT BUILDING. The dark streaks are simply wet
       concrete and they would dry to the same clean grey. They are NOT rust runs, NOT green or
       black mould, NOT dirt trails, NOT old stains and NOT peeling render. Nothing here is
       decaying; the building is just soaked.
     • AT THUMBNAIL SIZE THIS MUST STILL READ AS ONE CALM SURFACE. The drips and the wet streaks are
       a fine, quiet texture. They must not turn the wall into stripes, must not out-shout the
       bright yellow poncho, and must not fill the picture with clutter.

7. THE STREET TREE IS ALREADY CORRECT IN THE EARLIER ATTEMPT - KEEP IT. A tree is pushed, so it
   bends the way the wind is going, which is the way the woman's back is turned: the trunk is
   bowed over towards the RIGHT in a clear curve, every branch and twig is
   swept towards the RIGHT, and the foliage is stretched into a long ragged streak trailing off
   to the RIGHT, thin and torn, with a gap of open sky on the LEFT-hand side of the tree where
   the wind has pushed the leaves away. Several leaves have been torn off and are flying towards
   the RIGHT. After the people, this tree is the most obviously wind-blown thing in the frame.

8. THE POTS BY THE CLINIC DOOR ARE ALREADY CORRECT IN THE EARLIER ATTEMPT - KEEP THEM AS DRAWN,
   including the soil. This paragraph is only here so you can check them:
     • ONE POT IS TIPPED OVER AT AN ANGLE but still standing, leaning hard, its plant bent almost
       horizontal and streaming towards the RIGHT.
     • THE OTHER POT HAS BEEN BLOWN RIGHT OVER AND HAS BROKEN. It lies on its side on the covered
       walkway, cracked into two or three large clean pieces with a piece of the rim broken away,
       and the DARK WET SOIL HAS SPILLED OUT OF IT in a fan across the walkway floor, trailing
       towards the RIGHT with the wind - the same way the woman's poncho is streaming, never
       towards the side she is facing. The plant lies on its side in the spilled soil with its root ball
       showing, still green and still alive.
     • IT HAS JUST HAPPENED, IN THIS STORM. The broken edges are clean and freshly broken, the
       soil is a rich dark brown and obviously wet, and the plant is healthy. This is not
       rubbish, not litter, not an old dirty pot and not neglect. Everything else outside the
       clinic stays tidy.

9. THE THREE PEOPLE - KEEP THEM EXACTLY AS THEY ARE IN THE EARLIER ATTEMPT. Same three, same
   places, same sizes, same postures, all still walking towards the LEFT into the wind. They are
   the nearest things in the picture and they are big, the head of the nearest adult reaching
   about the height of the dark sign beam above the shutter:
     • NEAREST, LEFT OF CENTRE, in front of the shutter - a woman in her forties in a BRIGHT
       YELLOW rain poncho with the hood up, seen almost from the side, facing left, tipped
       forward from the ankles, one hand gripping the front edge of the hood at her forehead,
       the other arm hugging a bag against her chest, the back of the poncho blown out behind
       her to the RIGHT like a sail. SHE IS THE BRIGHTEST THING IN THE PICTURE and she stands
       against the dark shutter - that contrast is what the eye lands on at thumbnail size.
     • CENTRE-RIGHT, near the corner column - a man in his thirties in a dark navy rain jacket
       whose UMBRELLA IS ON THE POINT OF TURNING COMPLETELY INSIDE OUT. He holds it out ahead of
       him towards the left, into the wind, with BOTH HANDS, arms straight, elbows locked, his
       weight back on his heels. The canopy has been pushed up and back towards the RIGHT, three
       of its ribs on the right-hand side have already flipped upward and folded the wrong way
       so that part of the canopy is a deep lopsided bowl opening at the sky, the fabric between
       those ribs stretched drum-tight into hard straight creases, and only the left-hand side
       of the canopy still points down. It is a deep teal. He has stopped moving forward.
     • FURTHEST, AT THE RIGHT, smaller and partly cropped by the right edge - an older man in a
       dark green raincoat, facing left, holding a small CORAL umbrella low and tilted in front
       of him like a shield, taking short careful steps, his coat blown out behind him to the
       RIGHT.
   EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME
   SOLIDITY OF COLOUR. No figure is pale, faint, translucent, greyed out or drawn in outline
   only. Nobody looks at the camera.

10. THEIR FACES SHOW EFFORT, NOT DISTRESS. Eyes narrowed to short lines against the rain,
   eyebrows drawn together and pushed down, mouth a small closed line or slightly open with
   effort, chin tucked, cheeks a little flushed from the wind. They are working hard and they are
   fine. NOBODY IS CRYING: no tears, no screwed-up crying face, no down-turned open wailing
   mouth, and no hand rubbing or covering the eyes - a hand may grip a hood at the forehead, palm
   outward, but it must never cover the eyes. Nobody is frightened, nobody is shouting, nobody is
   in pain, nobody is falling over, and nobody is angry or scowling.

11. NOBODY IS IN DANGER, AND THE ONLY BROKEN THING IN THE PICTURE IS THAT ONE POT. Draw the
   weather, not a catastrophe: no lightning, no thunderbolt, no flying debris, no loose sheet
   metal, no fallen sign, no uprooted or snapped tree, no broken branches near anyone, no
   emergency vehicle, no flood, no broken glass and nothing broken on the building itself. The
   water on the ground is a thin sheet with shallow puddles, never above the ankle. The tree is
   bent right over but still standing and still whole.

12. THE CLINIC IS IMMACULATELY KEPT AND SIMPLY CLOSED FOR THE DAY. Clean surfaces, a clean
    shutter. Nothing peeling, flaking, cracked, patched, stained, mouldy, rusted, boarded up,
    cobwebbed, sagging or derelict - the wall is DARK because the sky is dark, not because it is
    dirty, and the broken pot is something the wind is doing right now, not a sign of neglect.
    Nothing sinister, nothing haunted, nothing sad-looking about the building itself.

13. NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, Chinese characters,
    logos, captions or watermarks, in any language. The sign panel above the shutter is a plain
    empty surface with nothing written on it, even though the real building carries lettering
    there. The shutter is a plain ribbed metal surface with nothing written on it and nothing
    taped, stuck or hung on it. The bag, the raincoats and the umbrellas are all plain. Any
    writing that appears in the reference pictures must be ignored and must not be copied.

14. STYLE - the same hand-drawn editorial illustration as the earlier attempt. Thin hand-drawn
    linework in warm dark brown or soft charcoal, weight varying, strokes tapering and sometimes
    breaking - not a thick even outline, not a ruled vector line. Colour applied like soft
    coloured pencil and light marker, edges a little loose and not always meeting the line. Flat
    fills with two or three tones per hue, no gradients except to describe light. A fine even
    paper grain over the whole image. Each face is one flat skin tone carrying only its outline,
    eyes drawn as small simple dots or short lines, two short eyebrows, a tiny nose mark, a small
    mouth and an ear - no wrinkles, no cheek lines.

15. COLOUR - dark and stormy, but never grey and never colourless. Keep the key of the earlier
    attempt: a black-green sky, mid warm grey concrete, near black-brown columns and shutter,
    cool slate grey wet road; the water on the walls and on the road is that same grey a few steps
    darker - never brown, never rusty, never green. All the colour is carried by a few small saturated things: the
    bright yellow poncho, the deep teal umbrella, the coral umbrella, the dark navy and dark
    green raincoats, the deep green of the tree and the plants, and the RICH DARK BROWN of the
    spilled wet soil. At least six distinct colours must still be readable at thumbnail size, and
    the yellow poncho must be the one the eye finds first. This is not a monochrome picture, not
    a sepia picture and not a blue-only picture, and there is no cyan, no turquoise and no patch
    of blue or bright sky anywhere.

AVOID: rust-coloured, orange, green or black streaks running down from the windows; mould, algae,
dirt trails, old water stains or discoloured render; a continuous curtain, sheet or waterfall of
water off the canopy instead of separate drips; drips falling straight down as if there were no
wind; a building that stays completely dry in heavy rain; a soaking wet covered walkway floor right
up to the shutter; so many wet streaks that the wall reads as stripes; the shutter drawn across the
front of the building instead of deep inside the covered
walkway; a shutter that touches the outer edge of the canopy or comes down onto the pavement;
columns flattened against the shutter with no air, floor or shadow between them; a missing covered
walkway; ribbed metal or a second shutter anywhere on the side wall to the right of the corner
column; rain blowing onto the backs of the people instead of into their faces; an umbrella folding
back towards the left; any letters, words, Chinese characters or writing anywhere, and in particular any English
word from these instructions painted onto the shutter, the sign panel or anywhere else; ANY RAIN
STROKE SHAPED LIKE A FORWARD SLASH; any rain stroke that starts near the top-right of the picture
and ends near the bottom-left; rain falling towards the left; a tree bent towards the left;
branches or leaves blown towards the left; anything loose on a person streaming towards the left;
turning the people round to face right; a flat grey rectangle, panel or block of diagonal stripes
copied from the rain diagram; neat upright undisturbed pots by the door; a swept, tidy, undamaged
doorway; litter, rubbish, weeds, an old dirty cracked pot or general mess; dry soil; ANY LONG, SOFT, CURVING OR
S-SHAPED WHITE RIBBON SWEEPING ACROSS THE PICTURE; any single white line longer than a tenth of
the picture's width; white air lines floating free in the middle of the empty sky; the gentle chalk
breeze lines copied from the fine-day illustration of this building; a wind streak that curves,
bends round an object or crosses a face; a calm, upright, untouched street tree; a round undisturbed tree crown; light
drizzle or a few scattered raindrops; a pale cream, sunlit, brightly lit or cheerful building; a
wall as light as the yellow poncho; a bright, pale or white sky; a blue, cyan or turquoise sky;
sunlight, sunbeams or cast sun shadows; a re-invented or re-proportioned shopfront; the shutter
drawn in front of the columns or across the outer edge of the covered walkway instead of behind
the columns in the plane of the glass; the covered walkway turned into a garage or a car port;
any glass, waiting room, lamp, lit window or warm light visible anywhere in the clinic; night,
sunset, an orange sky, lit street lamps, headlights; lightning, a thunderbolt, flying debris, a
fallen, snapped or uprooted tree, deep flood water, an overturned scooter, an emergency vehicle;
anyone falling, injured, frightened, shouting, scowling or crying; tears, a screwed-up crying
face, a hand rubbing or covering the eyes; an umbrella stripped to bare ribs with no fabric; an
intact, undamaged, ordinary umbrella; an empty street with nobody in it; small distant figures in
a wide empty scene; any figure drawn pale, faint, translucent, ghostly or in outline only;
peeling paint, cracks, stains, mould, rust, boards over the front, cobwebs, a derelict or haunted
building; greyscale, sepia or a single-colour picture; thick uniform black outlines;
photo-realism; 3D rendering; dental instruments, chairs, X-rays or teeth.```

---

## 六、⚠ 十四個一定會踩的坑（都是這一站踩過的）

1. **「辛苦」寫成揉眼睛或嘴角往下張嘴 ＝ 在哭**（第七節第 7 條，〈擴張牙弓〉踩過）。
   所以第 5 段整段在寫「怎麼畫用力、怎麼不畫哭」，而且「手抓帽兜」明講**手不可以蓋到眼睛**。
2. **風雨畫成一條長曲線 ＝ 靈魂出竅**（第七節第 17 條）。雨一定是**一群同向的短線**；
   長的那三四條白線是**天上的氣流線**，沿用一般牙科那張的畫法，而且不可以碰到人。
3. **「陰暗 ＋ 關著的老房子」＝ 鬼屋**（第十一之一節，使用者原話「像鬼屋欸」）。
   這是全線最容易踩的一張，所以第 7 段整段在擋剝落、水漬、鏽、封板、蛛網。
4. **舊提示詞的 AVOID 禁鐵捲門**（第一節）—— 照抄會自相矛盾。
5. ⚠⚠⚠ **方向寫成「和某某同方向」會漂**（第五之一節第 2 件，第一版踩到）——
   雨的方向和人抵擋的方向剛好相反。**每一項都要用畫面的左／右／上／下各自寫死一次。**
6. ⚠⚠ **沿用風格參考圖時，要逐項問「這一項在新的天氣底下還成立嗎」**
   （第五之一節第 1、4 件）—— 晴天那組白色氣流線與 `warm pale grey concrete`
   照抄過來，就變成「微風」與「亮牆」。
7. ⚠⚠⚠ **「順著模型的先驗、改另一半」之前，要先問「那一半真的是自由的嗎」**
   （第五之三、五之五節，雨的方向）—— 第二版已經把「每一道雨從左上落到右下、
   一道反的都沒有」寫進正文與 `AVOID`，出圖照樣往左下落，所以第三版我整個掉頭：
   風改成從右邊來、雨與樹不動、把人轉過來。**使用者當場退回：「風是從左往右吹」。**
   那個掉頭把**他的意圖**當成了可以交換的變數。
   ⚠ 通則因此要寫全：**兩半都自由才可以挑一半改；有一半是使用者指定的，就只能治另一半，
   治不動也要回頭問，不可以自己選邊。**
   ⚠ 檢查仍然只要一句話：**人往哪邊傾，雨就一定往另一邊落**（人頂著風、雨順著風）——
   這一句在兩種方向底下都成立，它查的是「一不一致」不是「哪一邊」。
8. ⚠⚠ **自己寫下的 `AVOID` 會在下一輪反咬**（第五之三節第 ② 件）——
   第二版為了擋災難片寫了「盆栽都還站著」，第三版使用者要的正好是「一個倒了破掉」。
   **每一輪都要把自己上一版的 `AVOID` 逐條唸過一次**（和第 4 條那個「舊提示詞的
   AVOID 禁鐵捲門」是同一件事，只是這一次那份舊的是我自己昨天寫的）。
9. ⚠⚠⚠ **方向也是形狀 —— 文字寫死兩次都沒用的時候，改用參考圖 ＋ 一個沒有第二種讀法的錨點**
   （第五之五節）。ILLUSTRATION.md 第十之一節本來就寫著「形狀不要用文字描述，用參考圖」，
   **方向是形狀的一種**，只是以前沒有人把它算進去。第四版做了兩件：
   ・**生一張只有雨線的方向參考圖**（`node drafts/channels/typhoon-rain-ref.mjs`
     → `preview/line-typhoon/rain-direction-ref.png`）。
     ⚠⚠ 它**故意長得像圖表不像場景**（平的地、只有線、沒有物件、沒有字、**沒有箭頭**）——
     箭頭會被當成畫面的一部分畫進成品裡；提示詞也要明講「只抄角度，不要抄它的顏色，
     不要在畫面上畫一塊灰色的斜紋板」。
   ・**反斜線錨點**：「左上 → 右下 ＝ `\`；右上 → 左下 ＝ `/`」。
     比「離垂直 40 度」或「和風同方向」都硬 —— 那兩種寫法各自有第二種讀法，這一種沒有。
   ⚠ **第四版還是反的話，不要再改提示詞** —— 改成**拿第二版那張圖去修**：
   「把每一道雨鏡射過來，其他一個像素都不要動」。一次只改一件。
10. ⚠⚠⚠ **要模型畫出「A 在 B 後面」，就要把 A 和 B 之間那個空間當成一個東西寫出來**
   （第五之七節①，第四版把騎樓畫沒了）。第四版逐字寫著鐵門「hangs BEHIND the three columns」，
   可是整段的主語從頭到尾都是那塊金屬，**騎樓本身一個名詞都沒有** —— 沒有地板、沒有低階、
   沒有天花、沒有「柱子和門之間有空氣」。**只寫「在後面」，模型會理解成「貼著」。**
   第五版因此把騎樓當成一個房間來寫（地板一條、階一道、天花一片、影子一片），
   並補一條「側牆沒有捲門」（它會順手把捲門延伸到轉角右邊那面牆上）。
11. ⚠⚠⚠ **絕對方向講不動的時候，把方向掛在模型畫得最穩的那個東西上**（第五之七節②）。
   這一條是第 9 條的下一層：正文寫死 → `AVOID` 寫死 → **給只有線條的方向參考圖**，
   雨仍然連四版都反。而**三個人面向哪一邊四版都沒錯**，所以第五版改寫成
   「**雨是打在她臉上的，她的背是被遮住的那一側**」，再補兩個同樣是形狀的錨點
   （傘往右折回、樹是被推的所以倒向她背過去的那一邊）。
   ⚠ **再失敗就不要再改提示詞了**，走第五之七節最後那個**鏡射法**：
   把圖左右翻了再叫它畫（模型畫 `/` 的雨從來沒失手），出圖再翻回來。
   ⚠ 那一招只有在**畫面上一個字都沒有**時才成立。
12. ⚠⚠⚠ **一條「不要照抄參考圖上某個元素」的禁令，要寫在「叫它照抄那張圖」的那一段裡**
   （第五之九節，白弧線第二次跑回來）。第五版**兩處都寫了**（第 4 段尾巴 ＋ `AVOID`），
   **兩條都輸給第 1 段那句「THE BUILDING IS COPIED FROM THE PROVIDED ILLUSTRATIONS」** ——
   那幾條白弧線就畫在那張晴天圖的建築上。
   **`AVOID` 是最後一道網，不是放置條件的地方；距離會決定哪一條贏。**
   ⚠ 同一輪的第二件：**風的線條要自己一節、而且要給可以量的幾何**
   （一群六到十五道、每道不超過畫面寬的十分之一、和雨同角度、貼著東西走不要浮在天上）——
   塞在雨那一段的尾巴當從屬子句是不夠的（同第 3 條那棵路樹）。
13. ⚠⚠⚠ **每一版都要把「上一版還沒對」的句子逐條清掉，否則它會去翻已經對的東西。**
   第六版第一次組出來的時候，抬頭那一塊還留著第四版的話 ——
   「**唯一要改的兩件：雨反過來、樹反過來**」，而那兩件第五版都已經對了。
   ⚠ 症狀會是「上一版對的東西，這一版又壞了」，而且**看起來像模型不穩，其實是提示詞在叫它翻**。
   ⚠ 成因是我用 `String.replace` 改那一塊、**沒有 assert**，字串對不上就靜靜地沒換
   （同第九節第 24、25 條那種病）。**改提示詞的腳本，每一處替換都要 assert 命中。**
   ⚠ 做法：每一輪定稿前 grep 一次「上一版的病名」（`GOT WRONG`／`Mirror it`／
   `now mirrored`／`ONLY TWO CHANGES`／`stand neatly upright`…），一條都不能留。
14. ⚠⚠⚠ **在一張「必須看起來保養得很好」的建築上加天氣的痕跡，一定要先擋「髒」**
   （第五之十一節，第七版加窗框流水與屋簷滴水）。**牆上往下流的深色痕跡，
   正是「年久失修」最典型的畫法** —— 鏽、青苔、水漬、髒污全部長那個樣子，
   而這一站有前科（2026-08-22「像鬼屋欸」）。
   所以那一段最後要明寫：**「這些水是乾淨的雨水，深色只是濕，乾了還是同一個乾淨的灰」**，
   `AVOID` 再補鏽色／橘／綠／黑的流痕、青苔、髒污、舊水漬。
   ⚠ 同一段還要補一條**縮圖的**：濕痕與水滴是**細而安靜的質感**，
   不可以讓牆變成條紋、不可以搶過畫面裡最亮的那一塊顏色。
   ⚠ 順帶一條畫法：**滴水要有「落點」才讀得出來** —— 掛在屋簷上的短線只是裝飾，
   要在它打到的地方畫**同心的小圈 ＋ 往上彈的小濺點**，那才是「正在滴」。
   ⚠ 而且**風大的時候水滴不是垂直落下的**，要和雨同角度被吹斜。

---

## 七、驗收（生成之後逐條看，任何一條沒過就重生成，不要後製）

| | 門檻 | 怎麼量 |
| --- | --- | --- |
| 無彩空白 | **< 5%** | `node drafts/og-measure.mjs`（S<12 且 L>80。⚠ 深色的天空不算，**淡而平的天空才算** —— 這一張最可能失分的就是天空被畫成一片淺灰） |
| 邊緣密度 | **≥ 30%** | `node drafts/og-measure-ink.mjs`（雨的短線會幫上忙） |
| 三個人的線一樣實 | 各框最暗 5 百分位**相差 < 20 階** | 同上 |
| 268px 下讀得出三件事 | 鐵門拉下來／在下大雨／有人走得很辛苦 | 縮到 268 寬再看 |
| 零文字 | 放大鐵門與招牌那一條 | 眼睛 |
| 建築沒有走鐘 | 三根柱子、兩個開間、上面那排突出窗盒還在、轉角在右邊 | 和 `-src.jpg` 並排 |
| 是白天 | 沒有任何點亮的燈、沒有橘色天空 | 眼睛 |
| 沒有災難 | 沒有閃電、沒有東西飛、沒有人跌倒、水不過腳踝 | 眼睛 |
| **雨的方向** | **每一道都是右上 → 左下**；判準是**人往右傾、雨往左落，兩者一定相反** | 眼睛（第一、二版都死在這一格） |
| **盆栽** | 一個歪著還站、**一個倒了破掉**、深色濕土灑成一片往左拖；破片乾淨、植株還綠 | 眼睛 |
| **風不像微風** | 沒有柔軟的白色弧線／S 形緞帶；風是**一群短而直、硬邊、和雨同角度**的陣風線 | 眼睛 |
| **樹在被吹** | 樹幹彎向右、枝葉全部掃向右、樹冠不是圓的、左側露出一塊天空、有幾片葉子飛出去 | 眼睛 |
| **建築夠暗** | **黃雨衣是全畫面最亮**；水泥牆明顯比雨衣暗；天空又比牆暗；騎樓與鐵門最暗 | 把圖轉成灰階看那五塊的順序 |

---

## 八、裁成 1024×512

照 `drafts/channels/remind-hero-crop.mjs` 改一支 `typhoon-hero-crop.mjs`，
出 `preview/line-typhoon/hero-typhoon.jpg`。

⚠⚠ **守門不可以照抄** —— `remind-hero-crop.mjs` 那道「深墨離上緣 ≥12 列」是為了
「臉沒被切」，而**這一張最上面就是濃到不能再濃的暴風天空**，那一道會一直誤報
（同 `review-hero-crop.mjs` 那一輪，那張上緣有彩旗與燈）。
**守門要跟著這一張圖的形狀走**：上緣改成掃「最高那顆頭的頂端」離上緣還有幾列，
下緣改成掃騎樓那條地面線，兩邊都不要對半裁。

⚠ 接上去的時候 `<img>` 的 `width`／`height` 屬性 ＋ CSS 的 `height:auto` **三個都要寫**
（少寫一個，面板會量出一張矮 134px 的卡）。

---

## 九、還沒做的

1. **使用者出圖** → `drafts/typhoon-hero-src.jpg`
2. 裁成 1024×512 → `preview/line-typhoon/hero-typhoon.jpg`
3. 換掉提案頁那兩個佔位框（聊天室那張與 Flex 頭圖**是同一張**）
4. ⚠⚠ **圖畫好不代表會用到** —— 那一頁還開著的唯一一題是
   **「要不要為了有圖，每個人多貼一次」**（他自己打字那條路，圖是另外貼的一則）。
   畫的成本只有一次，而且 2:1 兩條路共用，所以先畫不會白畫。
