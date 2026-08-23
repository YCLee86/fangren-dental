# 分享圖提示詞：牙周治療（`og-topic-perio`）

**狀態：第七版提示詞（2026-08-23），還沒定案。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十一、十二節與 `tools/topic-copy.mjs` 的 `perio`。

## 使用者給的概念（2026-08-23，逐字）

> 「牙醫師拿著雷射槍 幫 牙齒趕走細菌　之前牙周雷射的文章已經有這個概念
> 　只是當時的牙齒並沒有表情 有表情的是助理和病人 但這樣重點四散
> 　不適合當成訊息分享顯示的圖片」

第二輪他把概念換成消防：

> 「我覺得可以用像消防救火的概念 牙醫師背很粗的高科技水柱噴射器
> 　幫牙齒沖走細菌 那個水柱可以是牙周主題色的液體」

---

## 一、玻璃帶決定了背景可以多亮（這一節是這張圖最硬的約束）

牙周的深階 `#2a6d69` **比一般牙科的 `#2c5238` 淺**，所以同一組玻璃參數
（`--tint 0.70 --ink 0.18`），牙周的帶子天生比較弱。紙色字 `#e2e5e6` 壓上去的對比：

| 底色（RGB 灰階） | 235 | 200 | 170 | 160 | 140 | 110 | 80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 一般牙科 `#2c5238` | 3.95 | 4.49 | 5.01 | — | 5.61 | 6.29 | 7.06 |
| **牙周 `#2a6d69`** | 3.12 | 3.51 | 3.90 | **4.05** | 4.34 | 4.84 | 5.40 |

已上線那張 general 的頂 17% 實測 **平均 L 39.7／p95 L 88.8**（＝RGB 226），
模型算出的對比 **4.08**（帶子上實測最亮處 4.40，模型略低估，因為它沒算模糊）。

> **所以牙周這張的判準是：頂 17% 的 p95 ≤ HSL L 63（＝RGB 160）。**

⚠⚠ **這一條 2026-08-23 修正過，前一版我寫成「平均 ≤ 50、p95 ≤ 60」，過嚴。**
使用者看到第二版的圖說「背景太黑，不像乾淨明亮的診間」—— 他是對的，
牆只要中間調就夠了，不必壓到近黑。

### ⚠⚠ 但亮白牆救不回來，不要試著改帶子

牆若是亮白（bg 215）：

| | ink .18 | .24 | .30 | .34 | .38 | .42 |
| --- | --- | --- | --- | --- | --- | --- |
| 對比 | 3.33 | 3.48 | 3.63 | 3.74 | 3.85 | **3.97** |
| 照片透出率 | 25% | 23% | 21% | 20% | 19% | **17%** |

墨拉到 .42 還是過不了 4.08，而透出率已經掉到 17% —— 接近使用者退回的那塊實心板
（他選的那一格是 16%~24% 那一段）。改抬 tint 更糟：.90 才 4.22，透出率只剩 **8%**。
**結論：背景亮度是圖這一側的事，不能拿帶子去補。**

---

## 二、走過的三版（每一版錯在哪）

| | 第一版 | 第二版 | 第三版（提示詞已寫，還沒生成） |
| --- | --- | --- | --- |
| 動作 | 醫師拿雷射手機，白色短筆觸當氣流 | 消防式水柱、背著氣瓶 | 同二，改成粗水管 |
| 使用者的話 | 「太安靜了　那個東西像噴水還是吹氣而已」 | 「不錯了」 | — |
| 顏色 | 「牙周的主題色不是這個綠　這個綠很像一般牙科」 | 水色「很棒」，牆「太黑」 | — |

### ⚠⚠ 第一版的綠是提示詞自己寫出來的（第十之二節的實例）

我寫 `deep muted teal-green ... in soft shadow`，**形容詞把色值蓋掉了** ——
牙周是 `#317d78`（藍綠、色相 176），畫出來變成暗森林綠 ＝ 一般牙科那一支。
`ILLUSTRATION.md` 第十之二節就寫著「色值和形容詞打架時，模型跟形容詞」。
**改法：把 muted／deep／in soft shadow 這類形容詞拿掉，改用正面比較句**
（「比森林綠、松綠、草綠都更偏藍」）。

### ⚠ 第一版「太安靜」的成因不是幅度不夠，是畫錯語彙

我用「六到八條白色短筆觸」當水 —— 那是站上畫**氣流**的語彙（第三節「線畫抽象的東西」），
本來就是輕的。**力量要靠反作用力**（人被推得往後仰、衣襬頭髮往後吹）**＋ 有體積的水柱**，
不是加線。

### ⚠ 第二版的水色是對的，不要「訂正」它

第二版的水是**淺的、會發光的青綠**（白色泡沫 ＋ 一圈青綠色的光暈），使用者：
「上一個版本水的顏色比較好 甚至有點發青綠色的光 那個很棒」。
⚠⚠ **第三版我把水改成飽和的 `#317d78` 當主體，那個方向是錯的** ——
主題色要出現在**光暈與陰影側**，水體本身要亮、要透。

### ⚠⚠ 第四版：環境「像展場或倉庫，不像診間」（2026-08-23）

人物、水、細菌全部過關，卡在環境。**四個成因，第一個最要緊：**

1. ⚠⚠ **診療椅與無影燈被畫成淺灰色的細線、幾乎沒上色** —— 醫師是深棕實線，
   兩件道具卻淡到等於不存在，畫面上就只剩一面空牆。
   **這是十一之一節「次要不可以靠畫淡」的同一個坑，只是這次發生在道具上。**
   成因是我寫了 `very few internal details`，模型讀成「畫淡一點」。
   **改法：道具也要「完整上色、同樣的線深」，次要只能靠小、靠被擋住。**
2. ⚠⚠ **一面什麼都沒有沿著它擺的長牆 ＝ 倉庫。** 我第三版把櫃子列進 AVOID
   （為了守 250px 的簡潔），**那條禁令是這一版的元凶** ——
   **一排低矮的檯面櫃是「這是診間」最強、形狀最大、最好讀的證據**，收回禁令。
   ⚠ 但只准一排、大形狀、**檯面上不放任何東西、不畫把手**。
3. **牆色跑掉**：寫 `#8e8f84`（暖灰綠）畫出來是褐灰／taupe ＝ 倉庫色。
   要正面擋掉 brown／taupe。
4. **無影燈的臂從畫面正上方橫過去**，壓在玻璃帶的安靜區裡。**改成從左緣進來。**
   另外地板是一整片平的沙色、沒有收邊 —— 診間是**無縫地板 ＋ 牆腳圓弧收邊**。

---

## 三、A 案與 B 案怎麼判（第一輪的紀錄，仍然有效）

使用者原本給兩案：Ⓐ 牙齒站在醫師旁邊感謝欣慰／Ⓑ 牙齒喊救命。**兩案各對一半：**

- **Ⓑ 喊救命** 踩第四節 B 類第 8 條（疼痛與恐懼的暗示），而且分享卡是最先被看到的東西，
  開場先喊救命 ＝ 推力。
- **Ⓐ 感謝欣慰** ①只有一件事、而且已經結束（＝ general 第三版被退回的「安靜」）；
  ②「感謝救援」＝ 治好了，可是那一頁刻意不寫療程時間、收尾是「牙周要長期維護」；
  ③ 鞠躬道謝把診所寫成救世主，這個站要的是街坊（十一之二節第 3 條）。

**定案的方向：Ⓐ 的站姿 ＋ Ⓑ 的時機** —— 牙齒站著（不是躺著、不是被圍攻），
正在被沖洗，表情是舒服／鬆一口氣。那一頁的重心句是「常見不等於沒事，
**嚴重也不等於沒救**」，第一句由頁面文字負責，**分享卡負責第二句**。

---

## 四、提示詞（第七版，逐字，可直接複製）

> 參考圖三張，**用途要分開標**（第十二節二：一組只准提供一件事）：
> ① `drafts/perio-face-ref.png` —— **只看臉與人物的畫法**（細線、平塗膚色、點眼睛）。
>    從已上線的 `assets/og-topic-general.jpg` 裁出來的。
> ② `drafts/perio-room-ref.png` —— **只看診間有哪些東西**（無影燈、診療椅）。
>    已裁掉人，避免它的線與臉汙染。
> ③ `assets/og-topic-general.jpg` —— 整體色調、紙紋與明亮度的份量。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview
card. It will be seen at about 250 pixels wide, so everything must read at thumbnail size:
big simple shapes, few large objects, one continuous scene.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW THE PEOPLE EXACTLY IN THE STYLE OF THE REFERENCE IMAGE OF THE TWO CLINIC STAFF.
   Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline. Each face is ONE FLAT SKIN TONE with no shading, no modelling, no cheekbones and
   no jaw shadow. On the face there is only: the outline, two eyes drawn as small simple
   dots with NO whites, NO pupils and NO highlights, two short eyebrows, a tiny nose mark, a
   small mouth line and an ear. Hair is a flat shape in two tones with no individual
   strands. This is the single most important instruction.

2. A CLEAN, BRIGHT DENTAL TREATMENT ROOM IN THE MIDDLE OF THE DAY. The room is airy and
   freshly kept. A dentist grips a thick two-handed nozzle and blasts a POWERFUL JET OF
   GLOWING BLUE-GREEN WATER at the base of a giant tooth, washing the dirt and a crowd of
   germs off it and away to the right.

3. THE WATER IS LIGHT, WET AND LUMINOUS, AND IT GLOWS BLUE-GREEN. The body of the jet is a
   pale luminous blue-green (#a8ded6 to #8fd3cc), its foam, its burst and its flying
   droplets are white, its shaded underside and the pool on the floor are a deeper sea-green
   (#317d78), and A SOFT BLUE-GREEN GLOW spills out of it onto the wall, the floor and the
   side of the tooth. The whole jet reads as clean glowing water, never as paint, never as a
   flat dark green shape. The blue-green is clearly bluer than a forest green, a pine green,
   a grass green or an olive.

4. THE JET IS THICK AND FORCEFUL - as thick as the dentist's forearm where it leaves the
   nozzle, with a hard core, torn turbulent edges, and a big burst of spray and foam where
   it strikes the base of the tooth. It is a heavy pressurised jet of water: NOT a thin
   spray, NOT a mist, NOT a puff of air, NOT a beam or laser line.

5. THERE IS NO BACKPACK AND NO TANK. Instead ONE VERY THICK HOSE - about as thick as the
   dentist's forearm - sweeps into the picture from the BOTTOM LEFT CORNER in a single big
   S-curve and rises to his hands. The hose is CLEAN AND NEW: a pale warm-grey ribbed sleeve
   with one blue-green stripe running along its length. It is not black, not rubbery, not
   worn, not dirty. Its end is a CLEAN HIGH-TECH NOZZLE MODULE held in both hands: a smooth
   white housing with a pale sage-green grip, a chrome collar at the tip, a glowing
   blue-green indicator ring just behind the collar, and one small blue-green control panel
   on top. Big simple shapes only - no tiny buttons, dials or gauges.

6. THERE IS A WHOLE CROWD OF GERMS AND THEY COME IN TWO SIZES. All of them are on the RIGHT
   HALF and all of them are being driven away to the right:
   • THREE BIG ONES, each about as tall as the dentist's head - one tumbling head over heels
     high in the air in the upper right, one skidding backwards on the wet floor, one
     running out through the right edge and cropped by it.
   • ONE TIGHT CLUMP OF SIX OR SEVEN SMALL ONES, each about a third the size of the big
     ones, packed together and overlapping so that they read as a SINGLE CLUMP at thumbnail
     size, scrambling away at the right edge.
   • TWO MORE still clinging to the dirty right side of the mound, about to be washed off.
   They must never be spread evenly across the picture and never drawn as small dots or
   specks - the crowd is made of a few big shapes plus one clump, not of scattered dots.
   Each germ is a simple rounded blob with two dot eyes, a small open mouth and short stick
   arms and legs, in brick red, olive, mustard and dusty plum, two tones each, comic and
   clumsy, never frightening.

7. NO WRITING ANYWHERE in the image, in any language.

THE WALL AND THE LIGHT - IMPORTANT AND EXACT. The room is bright, but the wall is NOT white
and NOT pale: it is a clean MID-TONE SAGE-GREY WITH A GREEN CAST, around #8e8f84. It must
NOT be brown, NOT taupe, NOT beige and NOT a neutral grey. The operatory lamp lights the
middle of the picture, so the wall is at its lightest just behind the tooth and grows gently
DARKER towards the top edge, where it settles to about #6f7167. THE TOP SEVENTH OF THE
PICTURE IS THAT DARKER WALL AND NOTHING ELSE - no faces, no hands, no objects, no lamp, no
lamp arm, no window, no shelf, no highlight, and nothing pale or white anywhere inside that
strip. The floor is a PALE SEAMLESS VINYL CLINIC FLOOR in warm sand, wet and softly
reflective, lighter than the wall, and it meets the wall in a CONTINUOUS COVED SKIRTING that
curves up the wall - not a bare concrete slab and not an open hall floor.

THE DENTIST - a Taiwanese man in his thirties with a soft, slightly rounded young face,
short black hair, an open white coat over pale sage-green scrubs (#bfd7b7, with #99b899 in
the folds). NO face mask. He wears CLEAR PROTECTIVE GOGGLES: a thin frame with a completely
transparent lens, both eyes fully visible through it and drawn as the same simple dots as in
the reference; the lens carries NO white glare and NO reflection. He stands at the LEFT,
BRACED AGAINST THE RECOIL - feet planted wide apart, front knee deeply bent, back leg
straight and pushing, his whole body leaning BACK away from the nozzle, both hands gripping
it hard, his open coat and his hair blown backwards by the force. This bracing posture is
what tells the viewer the jet is powerful. He is focused and clearly enjoying himself. USE
THIS ANCHOR rather than a percentage: the top of his head sits just below the darker strip
along the top edge, and his shoes come close to the bottom edge of the picture.

THE TOOTH - one big molar drawn as a character, standing at the CENTRE beside the dentist and
reaching the height of his head. A rounded crown with soft bumps, a tapering body, and two
short stubby arms. Warm ivory (#f2e7d5, shaded with #ddcbb0 and #c9b294), with hand-drawn
shading strokes curving over its surface so it never reads as a flat white shape. IT IS
ENJOYING THIS, like someone being hosed down on a hot day: eyes
squeezed shut in a happy squint, a wide closed smile, both stubby arms lifted, leaning very
slightly back from the force. It is not frightened, not screaming and not in pain.

THE MOUND OF EARTH - THE TOOTH IS NOT STANDING ON THE BARE FLOOR AND IT HAS NO LEGS AND NO
FEET: IT IS PLANTED IN A SMALL MOUND OF DIRTY EARTH, LIKE SOMETHING BURIED THAT IS BEING
WASHED OUT OF THE GROUND. Draw it as real earth: warm brown in two or three tones, a lumpy
uneven surface, loose clods and a few small stones around its foot, damp and darker where
the water has soaked it, drier and dustier at the edges, with its own shading and its own
soft cast shadow. It is NOT pink, NOT flesh, NOT a stripe, NOT a band and NOT a smooth
painted shape.

⚠ THE MOUND IS SMALL AND IT STAYS AROUND THE TOOTH. It is a single compact heap no wider
than about one and a half times the width of the tooth, and no higher than about a quarter
of the tooth's height. Its edges end cleanly on the floor a short step from the tooth on
each side. EVERYWHERE ELSE THE FLOOR IS CLEAN, PALE CLINIC FLOOR: no earth in the right half
of the picture, no earth in the corners, no second heap, no earth reaching either edge of
the picture, no soil covering the ground the germs are running on. Only three or four loose
clods lie on the clean floor immediately beside the mound.

THE WASHING IS HALF DONE, AND YOU CAN SEE THE DIFFERENCE:
  • On the LEFT, where the jet is hitting, the earth has been blasted away and the tooth
    below is BRIGHT, CLEAN, GLEAMING IVORY, with a couple of small highlights.
  • On the RIGHT, not yet reached by the water, dark earth still clings to the tooth in
    uneven smudges and the mound is higher and dirtier.
  • A few clods of earth break off and tumble a short way to the right with the spray, and
    then stop - they do not build up into another heap and they never reach the right edge.
  • A SMALL puddle at the foot of the mound is muddy brown, turning into clear glowing
    blue-green water at its outer rim. It stays close to the mound.

THE ROOM - THIS IS UNMISTAKABLY A DENTAL SURGERY, NOT A GALLERY, A SHOWROOM, A WAREHOUSE OR
AN EMPTY HALL. It is built from exactly THREE large clinic objects, all set behind the people
and partly overlapped by them. EVERY ONE OF THEM IS FULLY DRAWN AND FULLY COLOURED, WITH THE
SAME LINE WEIGHT AND THE SAME LINE DARKNESS AS THE PEOPLE. They are secondary only because
they are further away and partly hidden - NEVER because they are pale, faint, greyed out,
thinly outlined or unpainted. Keep their inner detail simple, but keep their colour solid.
  • A LONG LOW RUN OF CLINIC CABINETS along the wall, running the whole width of the picture
    behind everything and cropped by both edges: plain pale-wood doors with NO handles, under
    one continuous pale worktop with NOTHING standing on it. It sits low, behind the people,
    with the wall showing above it. This cabinet run is the main thing that says "clinic" -
    it must be clearly visible and clearly coloured.
  • A DENTAL CHAIR at the LEFT, fully coloured in pale sage upholstery on a light grey base,
    with a headrest and a padded backrest, standing at a slight angle, cropped by the left
    edge and half hidden behind the dentist.
  • AN OPERATORY LAMP, switched on, its big rounded rectangular head hanging at about a
    quarter of the way down the picture on the LEFT, angled down towards the tooth and
    throwing a warm pool of light onto it. ITS JOINTED ARM ENTERS FROM THE LEFT EDGE OF THE
    PICTURE, NOT FROM THE TOP - no part of the lamp or its arm may enter the top seventh of
    the picture.
There is nothing else in the room: no window, no poster, no shelf, no bottles, no tray of
instruments, no monitor, no plant, nothing standing on the worktop.

WATER ON THE FLOOR - a small shallow pool at the foot of the mound with ripples and a few
standing splashes, muddy brown near the earth and clear glowing blue-green at its rim. It
stays close to the mound and does not spread across the floor. Both wall and floor carry a fine
hand-drawn grain so no area is ever empty or flat, and no empty patch of flat colour is
wider than a tenth of the picture.

STYLE - contemporary printed-magazine editorial illustration, exactly as in the reference
image of the clinic staff. Colour applied like soft coloured pencil and light marker, edges
a little loose and not always meeting the line. Flat fills with two or three tones per hue.
A fine even paper grain over the whole image.

DRAW THE DENTIST, THE TOOTH, EVERY GERM, THE CABINETS, THE CHAIR AND THE LAMP WITH THE SAME
LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME SOLIDITY OF COLOUR. Distance is shown by
size and by overlapping, and by nothing else - every character AND every piece of furniture
is fully drawn and fully coloured. Nothing in this picture is a pale outline.

COLOUR - CLEAR, WARM AND NOTICEABLY COLOURFUL. This picture is livelier and more saturated
than a muted pastel illustration: most colour areas sit around HSL saturation 45-65, and
well over half the picture carries real colour. Glowing blue-green water, warm ivory tooth,
brown earth, white coat, sage-green scrubs, warm sand floor, pale wood cabinets, and germs
in brick red, olive, mustard and dusty plum. THE WALL IS THE ONE CALM THING - it stays a
mid-tone sage-grey and does not get more saturated. At least seven distinct colours are
readable at thumbnail size. Hair is very dark and warm-toned (#374840, shading to #283930).

NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, logos, signage, captions
or watermarks, in any language. The nozzle's control panel is blank.

AVOID - thick even outlines like an American comic book; any shading, modelling, blush
rendering or highlight on a face; eyes with whites, pupils or catchlights; a face that looks
older than the thirties; a backpack, a tank, a cylinder, a gas bottle or a fire extinguisher;
a black, rubbery, worn or dirty hose; a garden hose or watering can; a thin spray, a mist, a
puff of air, a narrow beam or a laser line; a dark, flat or heavily saturated green jet; a
saturated or strongly coloured green wall; a wall in the same green as the water; forest
green, pine green, grass green or olive anywhere; a dark,
black, gloomy or dim room; a white, pale, neutral grey, brown, taupe or beige WALL - the
earth is brown, the wall never is; a window
or any bright opening; the lamp or its arm crossing the top of the picture; any pale or
bright area inside the top strip; furniture drawn pale, faint, greyed out, thinly outlined or
left unpainted; a bare wall with nothing standing along it; a gallery, showroom, warehouse,
workshop, garage or empty hall; a bare concrete floor; a large empty area of flat colour;
germs spread evenly across the picture or drawn as dots and specks; fire, flames, smoke,
sparks or an alarm; a firefighter's helmet or uniform; a screaming, crying or frightened
tooth; a pink, red or flesh-coloured mound under the tooth; gums, tissue or anything
anatomical under the tooth; a stripe, band, belt, ring or line painted across the tooth; a
smooth flat mound with no lumps or texture; earth spreading across the floor, filling the
right half, reaching an edge or a corner, or forming a second heap; a wide field of soil
under the germs; visible roots, legs or feet under the tooth; an
equally clean tooth on both sides; muted, washed-out, dusty or pastel colour overall; blood,
redness, swelling or any suggestion of pain; the nozzle aimed at the tooth's
face; a tooth lying in a dental chair; the dentist standing upright, relaxed, posing, in
silhouette or lit from behind; a face mask covering the dentist's face; speech bubbles,
thought bubbles, magnifying circles, arrows, icons, sparkles or stars; any figure drawn pale,
faint, translucent or in outline only; greyscale; photorealism.
```

---

## 四之一、⚠⚠ 出圖之後多一步：把畫面往下推，讓開玻璃帶（2026-08-23）

第一次疊上牌子，**帶子下緣切到醫師的頭髮**（使用者：「帶子壓到牙醫師的頭了」）。
量出來：帶高 104px，而髮頂在 **y=61**、無影燈的臂在 **y=21**，兩個都在安靜區裡。

⚠ **這不是裁切能解的** —— 原檔 2848×1504 ＝ 1.894，離 1.91 只差 13 列，
往上根本沒有畫面可以讓。提示詞裡那句「頭頂剛好在暗帶下面」模型沒有照做。

**做法（在原檔那一端做，管線維持兩步、可重跑）：**

1. 原始出圖存成 `drafts/og-topic-perio-src-raw.jpg`（不要覆蓋掉）。
2. 把整張往下推 **121 原檔 px（＝ 出圖後的 51px）**，頂端補上的那一條
   **用每一欄自己的牆面漸層往上外插**（取第 0 列與第 40 列的斜率；
   最高的物件在第 50 列，所以 0~40 列一定是純牆）。存成 `drafts/og-topic-perio-src.jpg`。
   ⚠ 補出來的那一條**整條都在帶子底下**（帶子 104px ＞ 51px），所以不必完美。
3. 照常跑那兩步。

**代價**：底部少掉 51px（水管最下面那一圈與水窪邊緣被裁到），可接受。
**效果**：髮頂 61 → **112**、燈臂 21 → **72**，兩個都離開帶子；
帶子上紙色字的對比同時從 中位 5.23／最亮 4.53 變成 **中位 5.42／最亮 4.95**。

> **通則（其餘六科會再遇到）**：出圖模型**不會照「頂端 17% 留白」那條指令**
> 把主體壓低。與其一直重跑，不如**出圖之後用這一步機械地讓開** ——
> 補出來的那一條反正被帶子蓋住，看不到。

## 五、交件前要過的門檻（插畫師自己跑，不過就不拿出來）

    powershell -NoProfile -ExecutionPolicy Bypass -File drafts/og-measure-win.ps1 drafts/og-topic-perio-v4.jpg 醫師=x0,y0,x1,y1 牙齒=x0,y0,x1,y1 細菌=x0,y0,x1,y1

| | 門檻 |
| --- | --- |
| 無彩空白（S<12 且 L>80） | < 5% ⚠ 牆改亮之後這一格變成主要風險，所以牆要**帶暖色**不能是中性灰或白 |
| 邊緣密度 | ≥ 30% |
| 角色的線相差（最暗 5 百分位） | < 20 階 |
| **頂 17% 安靜區・p95** | **≤ HSL L 63**（＝RGB 160，和 general 的 4.08 打平，見第一節） |

⚠ **量測腳本是 `drafts/og-measure-win.ps1`**（Windows 版，只用 .NET `System.Drawing`）——
雲端寫的 `og-measure.mjs`／`og-measure-ink.mjs` 寫死了 `/opt/node22/.../playwright`，
在這台跑不動。⚠ 那支**必須存成 UTF-8 with BOM**（同 CLAUDE.md 對 `tools/setup.ps1`
的警告），沒有 BOM 會被當 ANSI 讀、中文全變亂碼、整支解析失敗。已踩過一次。

⚠⚠ **貼在對話裡的圖，這台讀不到檔案** —— 要跑上面那些數字，
圖必須由使用者自己存進 `drafts/`。

## 六、管線

⚠ 這台（Windows）沒有 Playwright，兩支都要靠 `tools/chrome-cdp.mjs` 驅動本機的 Chrome：

    CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
    PLAYWRIGHT_MODULE="file:///C:/MyProjects/fangren-dental/tools/chrome-cdp.mjs"

    node tools/og-resize.mjs drafts/og-topic-perio-src.jpg perio
    node tools/og-plate.mjs perio --tint 0.78 --ink 0.22 --loc full --locpos stack

⚠⚠ **牙周用 `.78/.22`，不是七科通用的 `.70/.18`**（2026-08-23 定案）。
這一張的診間是亮的，玻璃後面是淺色牆 —— `.70/.18` 量出來只有 **3.11**，
`.78/.22` 拉回 **3.66**（＝使用者先前在暗牆版接受的 3.62 同一級），而且還看得出是玻璃。
⚠ 牙周的深階 `#2a6d69` 本來就比一般牙科的 `#2c5238` 淺，**同一組參數在兩張圖上
不會給出同樣的可讀性** —— 要一致的是「字讀不讀得到」，不是那兩個數字。
（.84/.26 → 4.24、.90/.30 → 4.84，都過得了，但玻璃愈來愈像實心板。）

⚠ **原檔要往下推 52 個原檔 px（＝出圖後的 21px）**，帶子才不會壓到頭髮（見第四之一節）。
原始出圖在 `drafts/og-topic-perio-src-raw.jpg`；**暗牆那一版**（第九版，使用者後來要求
改亮）留在 `drafts/og-topic-perio-src-dark.jpg` 當退路。

`tools/topics.mjs` 的 `seoBlock` 看到 `assets/og-topic-perio.jpg` 就會自己改用它
（沒有就退回診所夜景），另外要在 `topics.mjs` 的 `OG_ALT` 補一句**描述圖裡實際有什麼**。
產完跑 `node tools/topics.mjs`。

## 七、還要問使用者的

1. **醫師畫成男性還是女性？**（牙周的專長掛在李侑津醫師身上；general 那張已經有一男一女。
   提示詞現在寫男性。）
2. 這一張定案之後，**它同時是牙周線稿底圖的姿勢參考圖**
   （CLAUDE.md：順序是分享圖在前、線稿在後，`drafts/topic-lineart-prompt.md`）。
