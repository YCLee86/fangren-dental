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

## 五之四、⭐ 第三版的提示詞（逐字，可直接複製）

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

## 六、⚠ 八個一定會踩的坑（都是這一站踩過的）

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
7. ⚠⚠⚠ **同一件事寫死兩次還是失敗，就順著模型的先驗、改另一半**
   （第五之三節，雨的方向）—— 第二版已經把「每一道雨從左上落到右下、一道反的都沒有」
   寫進正文與 `AVOID`，出圖照樣往左下落。**模型對「雨往左下」有很強的先驗，
   而「人往哪走」在這張圖裡是完全自由的** —— 第三版因此整個掉頭：風改成從右邊來、
   雨與樹一個字不改、**把人轉過來**。
   ⚠ 檢查只要一句話：**人往哪邊傾，雨就一定往另一邊落**（人頂著風、雨順著風）。
8. ⚠⚠ **自己寫下的 `AVOID` 會在下一輪反咬**（第五之三節第 ② 件）——
   第二版為了擋災難片寫了「盆栽都還站著」，第三版使用者要的正好是「一個倒了破掉」。
   **每一輪都要把自己上一版的 `AVOID` 逐條唸過一次**（和第 4 條那個「舊提示詞的
   AVOID 禁鐵捲門」是同一件事，只是這一次那份舊的是我自己昨天寫的）。

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
