# 分享圖提示詞：顯微根管（`og-topic-endo`）

**狀態：第一版提示詞（2026-08-24），還沒生成過。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十六節與 `tools/topic-copy.mjs` 的 `endo`。

## 使用者給的概念（2026-08-24，逐字）

> 「你們參考網站的圖片 風格 製作 顯微根管著陸頁的圖片 先不要做線稿 感覺要有顯微鏡」

三件事因此定下來：**① 這一輪只做分享圖**（線稿底圖等這張定案再做，順序是
分享圖在前、線稿在後 —— ILLUSTRATION.md 第十二節）、**② 風格對齊站上既有的圖**
（已上線的兩張分享卡與〈根管治療的生物陶瓷〉那張 HERO）、**③ 顯微鏡要在畫面裡**。

---

## 一、梗：光照進去的那一刻（回到那一頁的軸）

那一頁的軸是使用者自己那句話 ——「**顯微根管是為牙齒增加一個保留的機會**」，
落到文案上是 lead：「這顆還留得住嗎？—— **顯微鏡下看清楚，牙齒就多一次機會**。」

所以這張圖要畫的**不是**治療的過程，是**看清楚的那一刻**：

| 文案 | 圖上對應的東西 |
| --- | --- |
| 顯微鏡下 | 一台真的牙科顯微鏡，大、在畫面左半，醫師的眼睛貼在目鏡上 |
| 看清楚 | 一道暖金色的**光錐**打在牙齒上；**光裡面的東西畫得清楚、光外面的收暗** |
| 多一次機會 | 牙齒**裡面**那條又細又彎的管子第一次被照亮，躲在最裡面的兩隻細菌被抓到 |
| 「留下來要能用得久」 | 牙齒的表情是**鬆一口氣**，不是得救、不是道謝（close 沒有承諾留得住） |

⚠⚠ **不要畫成「治療中」** —— 那會踩到那一頁最要緊的一條禁令：這一科
**不准出現任何和「快」有關的暗示**，而「正在做」的畫面必然引出「要做多久」。
畫「找到了」就沒有這個問題。

### 這一張的節奏刻意和牙周那張不一樣

七頁的文案有一張節奏對照表（COPY.md 第九之十五節），圖也要照這個精神走 ——
牙周那張是**動的**（水柱、後座力、細菌四散），這一張是**靜的一瞬間**（發現）。
但「靜」不等於「安靜到沒事發生」（ILLUSTRATION.md 第十一之二節，一般牙科第三版
就是這樣被退回的），所以畫面裡同時有三組各自在做自己的事：

1. **醫師 ＋ 顯微鏡**（主組）—— 貼著目鏡、手在調焦、眉毛揚起來。
2. **牙齒**（次組）—— 低頭看自己被照亮的裡面，一隻短手指著那條細管。
3. **細菌**（第三組）—— 被光抓到，一隻當場僵住摀眼睛、一隻連滾帶爬往右溜。

---

## 二、玻璃帶：顯微根管的方向和牙周**相反**（這一節是硬約束）

牙周那張的難處是「背景太亮，帶子上的字讀不到」。**顯微根管反過來** ——
`multiply` 上色底下，磚紅色會把背景的綠與藍打掉七成，所以**字永遠讀得到**，
真正會出事的是**帶子的顏色追不上標籤那顆磚紅**（＝使用者 2026-08-23 對牙周提出的
那個問題：「帶子的顏色看起來和主題色很不一樣」）。

**這一輪實測**（Chromium 疊真的三層，`--blend multiply --ink 0.18 --blur 6`，
紙色字 `#e2e5e6`）：

| 帶子後面那面牆 | 直接用套色當來源 | 補償後的 `--tintcolor` | 補償後帶子落在 | 紙色字對比 |
| --- | --- | --- | --- | --- |
| `#cbbfb2`（L75） | `#7a3832`（太深） | `#ff747a` ← 已到頂 | `#af4f4c` | **4.10** |
| `#d1c6ba`（L78） | — | `#f76f74` | `#ae4e4b` | **4.16** |
| **`#d9cfc4`（L81）** | `#823c37` | **`#ef6b6f`** | **`#af4f4c`** | **4.10** |
| `#e0d7cc`（L84） | `#89403b` | `#e7676b` | `#af4f4c` | **4.10** |

> **所以這張圖的牆（頂 17% 的中位）要落在 `#cbbfb2` ~ `#e0d7cc`
> ＝ HSL H 25~35・S 18~24・L 75~84 的暖陶土色。**

三件跟著來的判斷：

1. ⚠⚠ **不能比 `#cbbfb2` 更暗。** 補償的來源色是
   `M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆`，牆的紅色通道低於 **203** 時
   `M` 的紅就超過 255 補不上去，帶子只能往深階漂。
   （漂掉不會不能讀 —— 對比反而升到 5~9 —— 但那就和牙周那張「帶子逐值等於站上
   那顆標籤」的做法不一致了。）
2. ⚠ **也不要更亮。** 亮到接近白牆會踩另一條門檻：**無彩空白 < 5%**
   （S < 12 且 L > 80）。暖陶土的 S 有 20 上下，白牆是 0。
3. ⚠ **對比 4.10 過不了站上的 4.5，那是已經被接受的那一級**（一般牙科 4.40、
   牙周 4.40／3.83，ILLUSTRATION.md 第十一節寫著「不要拿對比度來訂正它」）。
   **不要為了補這 0.4 去加墨或加濃度**，那會把玻璃變成一塊實心板。

---

## 三、250px 下會讀到什麼（先想這件事，再想畫面好不好看）

訊息卡實測只有 **212 CSS px** 寬。這張圖縮到那個尺寸時，能活下來的只有四塊：

    ① 左半一台白色的機器（顯微鏡）　② 一個穿白袍的人貼在它上面
    ③ 一道從機器斜下來的暖光　　　　④ 光底下一顆亮著的大牙齒

細菌、細管、櫃子在那個尺寸都是「有東西在那裡」而已 —— **那沒關係，但它們不能是
畫面的重點**。所以：光錐要**大**（斜跨畫面約三分之一寬）、牙齒要**大**、
顯微鏡要**大而簡單**（不要畫小零件、不要畫刻度、不要畫螺絲）。

---

## 四、參考圖清單（四張，用途要分開標）

⚠ 不標用途的參考圖會被整張抄走（風格、顏色、構圖一起）——TEAM.md 第一節第 10 號。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `drafts/endo-scope-ref.jpg` | **牙科顯微鏡的形狀**：雙目鏡、機身上的黑色調焦旋鈕、兩支握把、白色關節臂；以及**人怎麼用它**（眼睛貼上目鏡） | 顏色、構圖、臉、那張圖的房間 |
| ② | `drafts/endo-face-ref.jpg` | **人的畫法與比例**：線的實度、平塗的臉、白袍與刷手服的形狀、全身高度佔畫面多少 | **顏色**（那張是一般牙科的綠，這一張要換成磚紅系）、姿勢 |
| ③ | `drafts/canal-ref.png` | **根管的形狀**：細、彎、有分支，**每一條末端到輪廓都留著一段牙質**（不穿出去） | 它的畫法（那是結構圖不是插畫）、顏色、格數 |
| ④ | `assets/og-topic-perio.jpg` | **整體色調、紙紋、密度**，以及**細菌的畫法**（圓身體、兩點眼睛、短手短腳、兩階色、滑稽不嚇人） | **構圖**（那張是動作場面）、人數、水的語彙 |

⚠ ①②③ 的來源都是站上自己的圖，所以「風格對齊站上」這件事是**用圖對齊的，
不是用形容詞對齊的**（ILLUSTRATION.md 第十之一節）。
產生 ①② 的腳本：`node drafts/og-topic-endo-refs-crop.mjs`。

---

## 五、提示詞（第一版，逐字，可直接複製）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview
card. It will be seen at about 250 pixels wide, so everything must read at thumbnail size:
big simple shapes, few large objects, one single continuous scene, no panels and no dividing
lines.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW THE PEOPLE EXACTLY IN THE STYLE OF THE REFERENCE IMAGE OF THE FEMALE DENTIST.
   Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline. Each face is ONE FLAT SKIN TONE with no shading, no modelling, no cheekbones and
   no jaw shadow. On the face there is only: the outline, two eyes drawn as small simple
   dots with NO whites, NO pupils and NO highlights, two short eyebrows, a tiny nose mark, a
   small mouth line and an ear. Hair is a flat shape in two tones with no individual
   strands. This is the single most important instruction.

2. A CLEAN, BRIGHT DENTAL TREATMENT ROOM IN THE MIDDLE OF THE DAY. A dentist leans into the
   eyepieces of a BIG DENTAL OPERATING MICROSCOPE on the LEFT. Its lamp throws ONE WIDE CONE
   OF WARM GOLDEN LIGHT down to the right onto A GIANT MOLAR TOOTH standing on the floor in
   the CENTRE-RIGHT. This is the moment of FINDING something, not the moment of treating
   anything: nobody is holding a drill, a syringe or any hand instrument.

3. THE MICROSCOPE IS BUILT EXACTLY LIKE THE ONE IN THE REFERENCE IMAGE OF THE MICROSCOPE,
   but drawn BIG AND SIMPLE: a pair of angled binocular eyepieces, a boxy body with two big
   dark-grey focus knobs and two curved dark-grey handles, and a white jointed arm. It is
   about as tall as the dentist. ITS ARM ENTERS FROM THE LEFT EDGE OF THE PICTURE, never
   from the top. Its housing is a clean pale cream-white with a light grey underside, its
   knobs and handles are dark warm grey, and there is ONE BRICK-RED RING (#ae4f4d) around
   the lens housing at the bottom - that ring is the only saturated red on the machine. Big
   simple shapes only: no screws, no scales, no small buttons, no cables, no dials.

4. THE LIGHT IS THE STORY. A wide cone of warm golden light (#f7e3c0, fading to #f6ecd6 at
   its edges) leaves the bottom of the microscope and falls across to the tooth, lighting
   the tooth, the floor around its feet and a little of the wall behind it. EVERYTHING
   INSIDE THE CONE IS BRIGHT AND CLEARLY DRAWN; everything outside it is the same colours
   but a little deeper and quieter. The cone is soft-edged light, NOT a solid yellow wedge,
   NOT a laser beam, NOT a spotlight ring on the floor.

5. THE TOOTH IS A CHARACTER WITH ITS INSIDE LIT UP. One big molar standing on the floor on
   two short root-legs, its crown reaching the dentist's shoulder. Warm ivory (#f2e7d5,
   shaded with #ddcbb0 and #c9b294), with hand-drawn shading strokes curving over its
   surface so it never reads as a flat white shape. THE FRONT OF ITS BODY IS OPEN LIKE A
   LIT DOORWAY - a soft rounded opening about a third of its width - and inside that opening
   you can see, warmly lit by the cone: a wide chamber at the top, TWO STRAIGHT PASSAGES
   running down into the roots, and ONE EXTRA VERY THIN, STRONGLY CURVED PASSAGE branching
   off to the side and running down deep into the back root, exactly like the thin curved
   canals in the reference diagram. That thin curved passage is the thing the light has just
   found: it is the brightest, cleanest line inside the tooth. THE INSIDE IS WARM CREAM AND
   PALE GOLD, LIKE A LIT CORRIDOR IN A HOUSE - it is NOT pink, NOT red, NOT flesh, there is
   no gum, no blood and no anatomical cross-section hatching. The tooth has two short stubby
   arms and a simple face: eyes open and looking DOWN at its own lit inside, eyebrows lifted,
   a small relieved closed smile, one stubby arm pointing at the thin curved passage. It is
   relieved and curious - not frightened, not in pain, not grateful, not cheering.

6. TWO COMIC GERMS ARE CAUGHT IN THE LIGHT, drawn exactly like the germs in the reference
   share card. ONE is deep inside the thin curved passage, only its head and two little
   hands showing, frozen and squinting at the light. THE OTHER is bigger, about as tall as
   the dentist's head, standing on the floor just outside the tooth at the RIGHT, caught
   mid-step with both hands over its eyes, about to scramble away to the right. A THIRD,
   smaller one is already running out through the right edge and is cropped by it. Each germ
   is a simple rounded blob with two dot eyes, a small open mouth and short stick arms and
   legs, in brick red, olive, mustard and dusty plum, two tones each, comic and clumsy,
   never frightening, never spread evenly across the picture and never drawn as small dots
   or specks.

7. NO WRITING ANYWHERE in the image, in any language.

THE WALL AND THE TOP OF THE PICTURE - IMPORTANT AND EXACT. The wall is a clean WARM CLAY
colour, about #d9cfc4: light, but clearly warm and clearly coloured, never white, never a
neutral grey, never beige-grey and never brown. THE TOP SEVENTH OF THE PICTURE IS THAT WALL
AND NOTHING ELSE - no faces, no hands, no objects, no microscope, no microscope arm, no
lamp, no window, no shelf, no light cone and nothing darker or brighter anywhere inside that
strip. Keep that strip as even as a plain wall, with only the fine paper grain on it. The
floor is a PALE SEAMLESS VINYL CLINIC FLOOR in warm sand, softly reflective, lighter than
the wall, and it meets the wall in a CONTINUOUS COVED SKIRTING that curves up the wall - not
a bare concrete slab and not an open hall floor.

THE DENTIST - a Taiwanese woman in her thirties with a soft, slightly rounded young face and
dark hair in a low ponytail. Her hair is very dark and warm-toned (#483837, shading to
#392928, catching light at #4f4040). She wears an open white coat over DUSTY-ROSE SCRUBS
(#d7b7b7, with #b89999 in the folds) and white shoes. NO face mask and NO goggles. She
stands at the LEFT, side-on to us, bending slightly forward from the waist with both eyes
pressed to the eyepieces, one hand resting on the big focus knob and the other steadying the
arm of the microscope. Her eyebrows are lifted and she wears a small, delighted, private
smile - she has just found something. USE THIS ANCHOR rather than a percentage: the top of
her head sits just below the top seventh of the picture, and her shoes come close to the
bottom edge.

THE ROOM - THIS IS UNMISTAKABLY A DENTAL SURGERY, NOT A LABORATORY, A GALLERY, A SHOWROOM OR
AN EMPTY HALL. Besides the microscope it is built from exactly TWO large clinic objects, both
set behind the people and partly overlapped by them. EVERY ONE OF THEM IS FULLY DRAWN AND
FULLY COLOURED, WITH THE SAME LINE WEIGHT AND THE SAME LINE DARKNESS AS THE PEOPLE. They are
secondary only because they are further away and partly hidden - NEVER because they are pale,
faint, greyed out, thinly outlined or unpainted.
  • A LONG LOW RUN OF CLINIC CABINETS along the wall, running the whole width of the picture
    behind everything and cropped by both edges: plain pale-wood doors with NO handles, under
    one continuous pale worktop with NOTHING standing on it. It sits low, behind everything,
    with the wall showing above it. This cabinet run is the main thing that says "clinic".
  • A DENTAL CHAIR at the RIGHT, fully coloured in pale sage upholstery on a light grey base,
    with a headrest and a padded backrest, standing at a slight angle, cropped by the right
    edge and half hidden behind the tooth and the germs. It is EMPTY - nobody is lying in it.
There is nothing else in the room: no window, no poster, no shelf, no bottles, no tray of
instruments, no monitor, no plant, nothing standing on the worktop.

STYLE - contemporary printed-magazine editorial illustration, exactly as in the reference
image of the dentist. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue -
EXCEPT SKIN, which is always one single flat tone. A fine even paper grain over the whole
image, so no area is ever empty or flat, and no empty patch of flat colour is wider than a
tenth of the picture.

DRAW THE DENTIST, THE TOOTH, EVERY GERM, THE MICROSCOPE, THE CABINETS AND THE CHAIR WITH THE
SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME SOLIDITY OF COLOUR. Distance is shown
by size and by overlapping, and by nothing else. Nothing in this picture is a pale outline.

COLOUR - CLEAR, WARM AND NOTICEABLY COLOURFUL. This picture is livelier and more saturated
than a muted pastel illustration: most colour areas sit around HSL saturation 40-60, and
well over half the picture carries real colour. Warm golden light, warm ivory tooth, dusty
rose scrubs, white coat, warm clay wall, warm sand floor, pale wood cabinets, pale sage
chair, and germs in brick red, olive, mustard and dusty plum. THE WALL IS THE ONE CALM THING
- it stays a light warm clay and does not get more saturated. At least seven distinct colours
are readable at thumbnail size.

NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, logos, signage, captions
or watermarks, in any language.

AVOID - thick even outlines like an American comic book; any shading, modelling, blush
rendering or highlight on a face; eyes with whites, pupils or catchlights; a face that looks
older than the thirties; a laboratory microscope standing on a bench; the microscope or its
arm entering from the top of the picture; anything at all inside the top seventh; a hard
yellow wedge, a laser beam or a spotlight ring instead of soft light; a magnifying glass, a
magnifying circle, a lens flare, sparkles or stars; speech bubbles, thought bubbles, arrows,
icons or diagrams; a pink, red or flesh-coloured inside of the tooth; gums, blood, nerves or
an anatomical cross-section; a textbook diagram; a patient lying in the chair; a drill, a
syringe, a needle, tweezers or any hand instrument; a face mask or goggles on the dentist; a
white, pale, neutral grey, brown or beige-grey WALL; a dark, gloomy or dim room; a window or
any bright opening; furniture drawn pale, faint, greyed out, thinly outlined or left
unpainted; a bare wall with nothing standing along it; a bare concrete floor; a large empty
area of flat colour; germs spread evenly across the picture or drawn as dots and specks; a
screaming, crying or frightened tooth; a tooth that is bowing or saying thank you; any figure
drawn pale, faint, translucent or in outline only; muted, washed-out, dusty or pastel colour
overall; greyscale; photorealism.
```

---

## 六、交件前要過的門檻（插畫師自己跑，不過就不拿出來）

| | 門檻 | 出處 |
| --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **< 5%** | TEAM.md 第一節第 9 號 |
| 邊緣密度 | **≥ 30%** | 同上 |
| 每個角色的線一樣實（最暗 5 百分位） | **相差 < 20 階** | 同上 |
| **頂 17% 的牆・中位** | **落在 `#cbbfb2` ~ `#e0d7cc`**（R 203~224、S 18~24） | 本篇第二節（實測） |
| 頂 17% 裡有沒有東西 | **一樣都不能有**（含光錐、顯微鏡的臂） | ILLUSTRATION.md 第十一節第 8 條 |

量測腳本：`drafts/og-measure.mjs`（空白／彩度／明度）、`drafts/og-measure-ink.mjs`
（邊緣密度／逐人線的實度）。
⚠ 那兩支寫死了 `/opt/node22/.../playwright`，**只在雲端 session 跑得動**；
Windows 那台請用 `drafts/og-measure-win.ps1`（必須是 UTF-8 with BOM）。
⚠⚠ **貼在對話裡的圖，雲端這一側讀不到檔案** —— 要跑數字，圖必須先存進 `drafts/`。

---

## 七、管線（圖回來之後，兩行）

原檔存成 `drafts/og-topic-endo-src.jpg`（**原始出圖另存
`-src-raw.jpg`，不要覆蓋掉**），然後：

    node tools/og-resize.mjs drafts/og-topic-endo-src.jpg endo
    node tools/og-plate.mjs endo --blend multiply --tintcolor #ef6b6f --ink 0.18 --blur 6 \
      --loc full --locpos stack

⚠⚠ **`--tintcolor` 要照實際的牆重算**，不要照抄上面那個值：

    M(每個通道) = ((#ae4f4d 的該通道 − 0.18 × 墨) ÷ 0.82) × 255 ÷ 牆的該通道
    （墨 ＝ rgb(42,44,39)；分子固定是 R 203.0 / G 86.7 / B 85.3）

⚠ **牙周與一般牙科用的參數不一樣，這一張也會不一樣** —— 要一致的是
「帶子等於站上那顆標籤、字讀得到」，不是那幾個數字。
⚠ **兩步要從頭跑**：`og-plate.mjs` 讀寫同一個檔，只跑第二步兩次會把帶子疊兩層。
⚠ **出圖模型通常不會照「頂端 17% 留白」那條指令**（牙周那張踩過）。
若髮頂或機器伸進帶子裡，照 `og-topic-perio-prompt.md` 第四之一節那一步
**把整張往下推**、頂端用每一欄自己的牆色往上外插補一條 —— 那一條反正被帶子蓋住。
⚠ 產完要在 `tools/topics.mjs` 的 `OG_ALT` 補一句**描述圖裡實際有什麼**，
需要的話一併補 `OG_DESC`（訊息卡的描述可以和搜尋結果不一樣），再跑 `node tools/topics.mjs`。

---

## 八、還要問使用者的

1. **醫師畫成女性** —— 這一科的專長掛在陳芷鈴醫師身上（顯微根管／根尖手術／活髓治療），
   而且牙周那張已經是男醫師，七張卡不要都同一個人。**建議：女性。**
   ⚠ 服裝與頭髮用的是 ILLUSTRATION.md 第十之三節**量出來**的那一組磚紅系
   （刷手服 `#d7b7b7`／`#b89999`、頭髮 `#483837`／`#392928`／`#4f4040`），
   和〈根管治療的生物陶瓷〉那張 HERO 同一組，不是新挑的。
2. **牙齒要不要「看得到裡面」** —— 那是這張圖唯一在講「顯微」的東西，
   但它也最靠近「牙齒解剖圖」那條紅線。**建議：保留，但畫成「亮起來的走廊」**
   （暖米白＋暖金光、不畫粉紅牙髓、不畫牙齦與血）。
   ⚠ 這一條使用者說不要的話，退路是**把光錐打在牙齒表面**、細管改成只有細菌的頭
   從一個小洞口探出來 —— 梗還在，只是少了「多出來的那條管子」。
3. **細菌沿用牙周那張的畫法** —— 同一組角色跨兩張卡是好事（品牌一致），
   但也可能讓兩張看起來像同一張。**建議：沿用畫法、換配置**（牙周是被沖走的一群，
   這裡是被光抓到的兩三隻）。
4. **這張定案之後，它同時是顯微根管線稿底圖的姿勢參考圖**
   （ILLUSTRATION.md 第十二節：分享圖在前、線稿在後）——
   線稿那一輪要從這張裁一段含腿的人物出來。
