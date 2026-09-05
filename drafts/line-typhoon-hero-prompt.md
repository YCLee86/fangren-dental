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

⚠⚠ **①一定要用 `-src.jpg`，不可以用 `assets/og-topic-general.jpg`** ——
那一張上緣有一條綠色的帶子、上面印著中文字（那是後製疊的），**餵進去會被學走**。
⚠ ② 那張照片上有三處字（招牌、英文店名、隔壁那家），要多講一句
「參考圖裡出現的任何文字一律不要學，成品不能有字」。

---

## 五、⭐ 提示詞（逐字，可直接複製）

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

## 六、⚠ 四個一定會踩的坑（都是這一站踩過的）

1. **「辛苦」寫成揉眼睛或嘴角往下張嘴 ＝ 在哭**（第七節第 7 條，〈擴張牙弓〉踩過）。
   所以第 5 段整段在寫「怎麼畫用力、怎麼不畫哭」，而且「手抓帽兜」明講**手不可以蓋到眼睛**。
2. **風雨畫成一條長曲線 ＝ 靈魂出竅**（第七節第 17 條）。雨一定是**一群同向的短線**；
   長的那三四條白線是**天上的氣流線**，沿用一般牙科那張的畫法，而且不可以碰到人。
3. **「陰暗 ＋ 關著的老房子」＝ 鬼屋**（第十一之一節，使用者原話「像鬼屋欸」）。
   這是全線最容易踩的一張，所以第 7 段整段在擋剝落、水漬、鏽、封板、蛛網。
4. **舊提示詞的 AVOID 禁鐵捲門**（第一節）—— 照抄會自相矛盾。

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
