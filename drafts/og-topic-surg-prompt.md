# 口腔外科的分享圖（`og:image`）—— 第一輪：三個場景提案

2026-08-25 開。使用者的起點只有一句：

> 「口腔外科著陸頁圖片設計　感覺這裡的口腔外科醫師要戴醫師帽和口罩
> 　至於是什麼場景　你們幫我想看看」

所以這一輪交的是**場景（梗）＋ 兩份可以直接貼的提示詞**，不是成品。
規格一律回 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準、九條硬規格、
上緣的玻璃帶）；文案的依據是 `tools/topic-copy.mjs` 的 `surg` 與
[COPY.md](../COPY.md) 第九之十八節。

**這一科是最後一科** —— 其餘六科的分享圖與線稿都已上線。

---

## 一、這一頁在講什麼（圖要接住的四件事）

| 頁面上的字 | 圖要接住的 |
| --- | --- |
| 現場①「智齒腫過一次，消了就沒再管。」 | 橫躺、卡住的那一顆 |
| 現場②「牙齒只剩牙根，拔起來很麻煩。」 | 只剩半截的那一顆（⚠ **不要畫成爛的**，使用者否決過「爛到只剩牙根」） |
| 現場③「上次拔牙的感覺，到現在還記得。」 | 這一群人是**從容的**，畫面裡沒有人在用力 |
| stance「難拔的，有人專門在拔 —— 智齒、殘根、長不出來的都是」 | **不只智齒**（這是使用者上一輪親自糾正的那一件） |
| flow「先看片　要不要拔、離神經多近，先看清楚」 | 動作是**看**，不是拔 |
| close「難處理的那幾顆，交給口腔顎面外科專科醫師」 | 帽子與口罩＝「這件事屬於誰」 |

### ⚠ 三條這一張特別容易踩的

1. **不可以畫「輕鬆拔起」。** ［怎麼拔　知道從哪裡使力，不必硬來］那一行
   2026-08-21 被使用者整行刪掉，理由是**那是一張支票**（「有時候還是真的會硬來，
   就是骨頭修多一點」）。文字不能開的支票，圖也不能開。
2. **不可以出現拔牙鉗、針筒、血、張開的嘴巴內部。** ILLUSTRATION.md 第四節 B7／B8，
   而且這一科的讀者正是最怕那個畫面的人。
3. **帽子要和兒牙那張分得開。** `og-topic-kids.jpg` 的醫師已經戴著**塗鴉印花**的
   綁帶手術帽。口外這一張用**素色的紫（該科的套色）＋ 一副口罩** ——
   同一個站上兩頂帽子，靠花色與口罩分辨，不是靠款式。

---

## 二、帶子（先算再構圖，這是「圖」那一側的事）

口外的套色是 `#8e6299`、深階 `#784e84`（PALETTE.md 第六之九節）。
相乘上色的補償色公式（ILLUSTRATION.md 第十一節）：

    N(每個通道) = (套色 − 0.18 × 墨) ÷ 0.82        墨 = rgb(42,44,39)
    補償色 M    = N × 255 ÷ 頂 17% 那面牆的該通道   → M 超過 255 就追不到套色

口外的分子 **N = R 164.0 / G 109.9 / B 178.0**，所以

> ⚠⚠ **頂端那面牆的藍色通道要 ≥ 178**（紅 ≥ 164、綠 ≥ 110 很寬鬆，**卡住的是藍**）。

| 牆 | 補償色 | 行不行 |
| --- | --- | --- |
| `#e7e4dd` 站上插畫的米白（兩份提示詞都用它） | `#b57bcd` | ✓ |
| `#d8d4cb` 再暗一階 | `#c284e0` | ✓ |
| `#cbbfb2` 暖奶油／木頭色 | 藍通道 255 爆掉 | ✗ |

**結論：頂端不可以是暖奶油、木頭、夕陽或土色的牆** —— 紫是全站最需要藍的一支。
提示詞裡因此把上緣寫死成 `#e7e4dd`。

其他兩個數字（帶子那一輪才會用到，先記著）：

- 紙色字壓在 `#8e6299` 上 **3.81**、純白字 **4.82**。
  站上已經接受過 4.40（一般）／4.06（根管）／3.61（矯正）／3.23（兒牙白字），
  所以兩種都在可接受的範圍，**冷色維持紙色**那條規則指向紙色。到時候做兩版讓使用者挑。
- 對其他六條帶子的 ΔE(76)：矯正 **29.7**、植牙 39.5、根管 44.5、牙周 55.5、
  一般 59.3、兒牙 79.5。最近的一對（矯正）仍是全站最近那一對 13.3 的兩倍以上，
  **不會有植牙那次「和矯正撞色」的問題**，可以直接用套色。

---

## 三、三個場景

### Ⓐ 難的那幾顆，都來找他　←（建議）

一間明亮的診間，戴著紫色手術帽與口罩的口外醫師單膝蹲著，面前是一顆**橫躺的大智齒**，
他一手平放在地上（不是抓著它），另一手舉著一張簡單的片子給它看；後面還有**兩顆在等**：
一顆**只剩半截的牙根**、一顆**只從土丘裡冒出頭頂和兩隻手**（長不出來的）。
右後方助理端著托盤（冰袋 ＋ 一張折好的紙）走進來。

- **為什麼建議它**：它是唯一**把「不只智齒」直接畫出來**的一案，而那正是
  使用者上一輪對這一頁最重的一句糾正；三顆牙形狀大、輪廓各不相同，250px 下最好認；
  三組人各自在做一件事＝ILLUSTRATION.md 第十一之二節那個「活潑」。
- **要指名的偏離**：站上已經有兩張「醫師＋擬人的大牙」（牙周、顯微根管），
  這是第三次用同一套語彙。**差別在梗**：那兩張是「醫師在對一顆牙工作」，
  這一張是「三顆難處理的牙**來找他**」，而且他沒有動手。
  —— 若使用者覺得重複，就走 Ⓑ 或 Ⓒ。

### Ⓑ 先看清楚，底下那條河

一顆很大的牙站在土丘上，**根往下長進地裡**；地下橫過一條**發著淡紫光的河**（下顎神經），
離最長的那根還有一段距離。口外醫師（紫帽＋口罩）蹲在土坡邊，一手舉燈照亮那條河、
一手拿一把小尺量那段距離；助理拉著測量線的另一端；牙齒低頭看自己的根，好奇不害怕。

- **為什麼值得考慮**：它畫的是這一科真正的專業 ——［先看片　要不要拔、離神經多近，
  先看清楚］；而且是七張裡唯一的「地上／地下」構圖，和前六張都不像。
- **要指名的偏離**：剖面會有一條地平線，接近硬規格第 2 條（不准分格）的邊緣。
  對策寫進提示詞：**牙齒本體跨過那條線**，所以它是一個連續的場景不是兩格。

### Ⓒ 還沒開始，先坐下來講一遍

診療椅上一位四十幾歲的先生（手還輕輕搭著扶手 ＝ 現場③），紫帽＋口罩的醫師坐在他頭側，
側身舉著片子指著上面一個點；病人抬眼看；旁邊護理師正把冰袋和一張折好的術後說明
放到小桌上。全張沒有任何器械。

- **為什麼留著**：三個現場裡最有重量的是「上次拔牙的感覺，到現在還記得」，
  這一案是唯一**用真人**回答它的。
- **風險**：使用者 2026-08-22 已經退過一次「太安靜」的圖（一般牙科第三版）。
  真人＋沒有動作的診間很容易再落回那裡，所以排第三。

**要哪一案的提示詞都可以，Ⓒ 的還沒寫（等使用者選）。**

---

## 四、參考圖清單（餵圖時用途要分開講）

| | 檔案 | 參考什麼 | **不要**參考 |
| --- | --- | --- | --- |
| ① | `drafts/style-ref-perio-full.jpg` | 線的實度、平塗的階數、紙的顆粒、整體乾淨度 | 構圖、人數、水柱、青綠色 |
| ② | `drafts/style-ref-endo-consult.jpg` | 臉的畫法（一色平塗、點眼睛、無皺紋）、擬人牙齒的身體比例 | 顯微鏡、放大圈、磚紅色 |
| ③ | `drafts/kids-cap-ref.jpg` | **綁帶手術帽的形狀**：怎麼包住頭髮、後腦的綁帶、帽緣位置 | 照片的風格、深藍底、上面的圖案（口外這頂是素色） |
| ④ | `drafts/perio-face-ref.png` | 擬人牙齒的表情尺度 | 那一張的姿勢與情緒 |

---

## 五、兩份完整提示詞（2026-08-25，可直接複製）

### Ⓐ 難的那幾顆，都來找他

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: in a bright, calm clinic room,
THREE DIFFERENT AWKWARD TEETH HAVE COME TO THE SAME PERSON FOR HELP - a big wisdom tooth lying
on its side, a short tooth that is only a root left, and one that is still half buried in a low
mound of earth - and AN ORAL SURGEON WEARING A PLAIN VIOLET SURGICAL CAP AND A MATCHING VIOLET
MASK IS DOWN ON ONE KNEE BESIDE THE FIRST ONE, ONE OPEN HAND RESTING CALMLY ON THE GROUND BESIDE
IT AND THE OTHER HOLDING UP A SMALL CARD FOR IT TO LOOK AT. NOBODY IS PULLING ANYTHING AND NOBODY
IS TOUCHING ANY TOOTH. This is the moment of LOOKING FIRST, and the room is busy and friendly,
not tense.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS strung along one gentle diagonal from the lower left
to the middle right, with clear empty space between the groups so each one reads separately at
thumbnail size:
  GROUP A, lower left and NEAREST: the oral surgeon and the big lying-down wisdom tooth. The
  surgeon is the largest figure - kneeling, he fills about 62% of the picture height; standing he
  would fill about 85%. The wisdom tooth lying on its side is about 30% of the picture height and
  about 26% of its width - a big, unmistakable shape.
  GROUP B, middle and slightly behind: the two other teeth waiting their turn - the root-only
  tooth about 26% of the picture height, the half-buried one about 15%.
  GROUP C, middle right and furthest: one clinic assistant walking in with a tray, about 50% of
  the picture height.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE. The upper 17% of
the image (the top 105 pixels of 628) is plain pale background and nothing else. NOTHING may
cross that line: not a head, not a cap, not a raised hand, not a lamp, not a shelf, not a plant,
not a wisp of steam. GIVE YOURSELF A MARGIN: compose so that EVERY head and EVERY raised hand
sits BELOW A LINE ONE FIFTH OF THE WAY DOWN FROM THE TOP (about 126 of the 628 pixels). The
surgeon's cap and the assistant's head are the highest things in the picture and they must both
start below that line, with a clear band of plain background above everything.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn linework
   whose weight varies and sometimes breaks - NOT a thick even outline, NOT a ruled vector line.
   Each human face is ONE FLAT SKIN TONE with no shading and no modelling: only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark and an ear - no wrinkles, no cheek lines, no jaw shading. Hair is a flat shape in two
   tones with no individual strands. EVERY PERSON AND EVERY TOOTH IS DRAWN WITH EXACTLY THE SAME
   LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or more transparent than
   anybody else. EVERYONE LOOKS DIFFERENT: different age, build, hair and clothes. Flat fills in
   two or three steps per colour, no gradients except to describe light. Fine paper grain over the
   whole image.

2. THE ORAL SURGEON - THE CAP AND THE MASK ARE THE POINT OF THIS PICTURE, DRAW THEM CAREFULLY.
   A person in their forties, kneeling on ONE KNEE, body turned towards the lying-down tooth and
   leaning slightly in. THEY WEAR A SOFT TIE-BACK SURGICAL CAP THAT COVERS THE HAIR COMPLETELY,
   the fabric gathered and knotted into short ties at the back of the head, exactly the shape in
   the cap reference photograph - BUT PLAIN, WITH NO PATTERN AND NO PRINT AT ALL, in a muted
   violet (#8e6299, shaded #784e84). A MATCHING PLAIN VIOLET SURGICAL MASK COVERS THE NOSE AND
   MOUTH, with a simple loop over each ear and a soft fold across the middle. Over that, an open
   white coat and pale grey-violet scrubs (#c9bcd0). BECAUSE THE MOUTH IS HIDDEN, THE WHOLE
   EXPRESSION HAS TO COME FROM THE EYES AND THE BODY: the eyes are creased into two gentle
   upward curves as if smiling, the eyebrows lifted and relaxed, the head tilted a little towards
   the tooth, the shoulders low and unhurried. ONE HAND IS OPEN AND FLAT, RESTING ON THE GROUND
   BESIDE THE TOOTH - not gripping it, not touching it. THE OTHER HAND HOLDS UP A SMALL CARD,
   turned so the tooth can see it, showing ONE SIMPLE LINE DRAWING - a plain outline of a tooth
   with two roots and one short curved line running past below them - AND NO WRITING OF ANY KIND.

3. GROUP A - THE BIG WISDOM TOOTH IS LYING ON ITS SIDE AND IT IS STUCK, NOT HURT. A large
   cream-white molar (#f2ece2, shaded #d9cfc0) with a rounded crown and two stubby roots, LYING
   TILTED ON ITS SIDE like someone who has toppled over sideways in a narrow gap, propping itself
   up on one elbow-like root, the other little arm scratching the back of its head. It has a
   simple friendly face in the house style - two dot eyes, two short eyebrows, a small mouth -
   and it is LOOKING UP AT THE CARD THE SURGEON IS HOLDING, eyebrows raised, mildly embarrassed
   and curious. It is NOT crying, NOT frightened, NOT in pain, NOT cracked, NOT dirty, NOT
   decayed, NOT bleeding.

4. GROUP B - THE OTHER TWO ARE WAITING THEIR TURN, AND EACH IS DOING ITS OWN THING. Behind the
   first tooth, standing on and around a LOW ROUNDED MOUND OF WARM PALE-BROWN EARTH (#c8ab86)
   that runs across the lower middle of the room:
   FIRST, A TOOTH THAT IS ONLY A ROOT LEFT: a short, stout, perfectly SMOOTH and CLEAN tooth
   whose crown is simply not there - the top is a soft, even, rounded edge, like a worn stone -
   with two little legs, two little arms and a calm face. It stands patiently with its hands
   behind its back, looking towards the surgeon. IT IS NOT BROKEN, NOT JAGGED, NOT BLACKENED,
   NOT ROTTEN, NOT CRACKED - just short.
   SECOND, A TOOTH THAT HAS NOT COME UP YET: only THE TOP OF ITS HEAD, its two dot eyes and its
   two small hands show above the mound of earth, hands gripping the edge, eyebrows up, trying to
   climb out, cheerful about it. The rest of it is hidden under the ground.
   The two of them are NOT looking at each other and NOT queueing in a straight line - each is
   busy with its own small moment.

5. GROUP C - SOMEBODY IS ALREADY GETTING THE AFTERCARE READY. A clinic assistant in their
   twenties, in the SAME PLAIN VIOLET CAP AND MASK and pale grey-violet scrubs, walking in from
   the right, mid-stride, one foot lifted, CARRYING A SHALLOW TRAY WITH BOTH HANDS. On the tray
   there are exactly TWO THINGS AND NOTHING ELSE: a soft pale-blue ice pack and one folded sheet
   of cream paper. NO instruments of any kind on the tray. Their eyes are creased in a smile.

6. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: the
   surgeon leaning in, the buried tooth pulling itself up, the root tooth shifting its weight, the
   assistant walking in with the tray, the card tilting in the surgeon's hand. Add a FEW light
   hand-drawn motion marks - two or three short curved strokes beside the climbing hands or the
   walking foot - drawn in the same thin ink line as everything else. Keep them few and light;
   they are never arrows and never speed stripes.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE WALL
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   wood, never sunset, never a warm yellow cast, and never darker than that. Bright, even daylight
   from a tall window at the left edge, one soft warm pool of light on the ground where the
   surgeon and the first tooth are, so the eye lands there. Below the wall, a plain floor in a
   slightly deeper warm grey (#d8d4cb) and the pale-brown mound of earth across the lower middle.
   At least six clearly different colours: the off-white wall, the warm grey floor, the pale-brown
   earth, violet caps and masks, grey-violet scrubs, the white coat, cream-white teeth, the
   pale-blue ice pack, and two big rounded potted plants in deep green - one beside the window and
   one leaning in from the bottom right corner. Most colour blocks sit around HSL saturation 30-50
   and lightness 70-85. NO LARGE FLAT EMPTY AREAS ANYWHERE except the top strip; no dusk, no
   golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the surgeon kneels in the lower left quarter, his knee close to the bottom
edge and his cap reaching about a third of the way down the picture; the big wisdom tooth lies
across the bottom centre-left in front of him; the mound of earth with the other two teeth runs
across the lower middle; the assistant walks in on the middle right, further away and smaller;
everything that must be read sits inside the middle 73% of the width; the top 17% stays
completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; dental pliers, forceps,
extraction tools, syringes, needles, scalpels, drills, trays of instruments, surgical lights,
operating theatres; anybody gripping, pulling, lifting or holding a tooth; any hand touching a
tooth; blood, wounds, stitches, swelling, bruises, tears, pain, fear, gritted teeth; a mouth seen
from inside; gums, jawbones, anatomical cross-sections, X-ray films with visible detail; teeth
that are cracked, chipped, jagged, blackened, stained, decayed or dirty; patterned or printed
caps; a face mask pulled down under the chin; anybody looking at the viewer; anybody drawn faded,
translucent, ghostly or outline-only; panels, insets, speech bubbles, thought bubbles, arrows,
small icons, magnifying circles; a queue of identical teeth; dusk, sunset, golden hour, an orange
or sepia cast; cream, beige or wooden walls at the top of the picture; bare empty backgrounds;
grey or blue-white walls; photorealism; 3D rendering; heavy even black outlines.
```

### Ⓑ 先看清楚，底下那條河

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a big friendly molar is standing
on a low mound of earth with ITS LONG ROOTS REACHING DOWN INTO THE GROUND BENEATH IT, where a
SOFT GLOWING VIOLET STREAM runs quietly past at a clear distance below the root tips - and AN
ORAL SURGEON IN A PLAIN VIOLET SURGICAL CAP AND MASK IS KNEELING AT THE EDGE OF THE OPENED
GROUND, HOLDING UP A LAMP TO LIGHT THE STREAM AND MEASURING THE GAP BETWEEN IT AND THE ROOTS.
The tooth is leaning over to look down at its own roots, curious and completely unafraid. This
is the moment of LOOKING FIRST AND MEASURING: nobody is pulling anything.

THIS IS ONE SINGLE CONTINUOUS SCENE, NOT TWO PANELS. The ground line runs across the picture at
about 55% of the height, and THE TOOTH'S BODY CROSSES IT - the tooth stands above, its roots
continue below in the same drawing, so the eye travels down without a break. There is NO frame,
NO border and NO dividing line anywhere; the earth below is simply an open cutaway, drawn with a
soft irregular hand-drawn edge, not a ruled straight line.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS strung along the middle of the picture, with clear
empty space between them so each one reads separately at thumbnail size:
  GROUP A, left of centre and NEAREST: the oral surgeon kneeling at the edge of the opened
  ground, holding a lamp. Kneeling, they fill about 60% of the picture height; standing they
  would fill about 85%.
  GROUP B, centre right: the big molar, about 40% of the picture height above ground, with its
  roots reaching a further 20% below ground - the single biggest shape in the picture.
  GROUP C, far right and furthest: one clinic assistant holding the other end of a simple
  measuring line, about 46% of the picture height.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE. The upper 17% of
the image (the top 105 pixels of 628) is plain pale background and nothing else. NOTHING may
cross that line: not a head, not a cap, not the lamp, not a raised hand, not a leaf, not a bird.
GIVE YOURSELF A MARGIN: compose so that EVERY head, EVERY raised hand and THE WHOLE LAMP sit
BELOW A LINE ONE FIFTH OF THE WAY DOWN FROM THE TOP (about 126 of the 628 pixels). The tooth's
crown and the surgeon's lamp are the highest things in the picture and they must both start below
that line, with a clear band of plain background above everything.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn linework
   whose weight varies and sometimes breaks - NOT a thick even outline, NOT a ruled vector line.
   Each human face is ONE FLAT SKIN TONE with no shading and no modelling: only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark and an ear - no wrinkles, no cheek lines, no jaw shading. Hair is a flat shape in two
   tones with no individual strands. EVERY PERSON AND THE TOOTH ARE DRAWN WITH EXACTLY THE SAME
   LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or more transparent than
   anybody else. The two people LOOK DIFFERENT from each other: different age, build and hair.
   Flat fills in two or three steps per colour, no gradients except to describe light. Fine paper
   grain over the whole image.

2. THE ORAL SURGEON - THE CAP AND THE MASK ARE THE POINT OF THIS PICTURE, DRAW THEM CAREFULLY.
   A person in their forties, kneeling on ONE KNEE at the edge of the opened ground, body turned
   towards the roots and leaning in. THEY WEAR A SOFT TIE-BACK SURGICAL CAP THAT COVERS THE HAIR
   COMPLETELY, the fabric gathered and knotted into short ties at the back of the head, exactly
   the shape in the cap reference photograph - BUT PLAIN, WITH NO PATTERN AND NO PRINT AT ALL, in
   a muted violet (#8e6299, shaded #784e84). A MATCHING PLAIN VIOLET SURGICAL MASK COVERS THE
   NOSE AND MOUTH, with a simple loop over each ear and a soft fold across the middle. Over that,
   an open white coat and pale grey-violet scrubs (#c9bcd0). BECAUSE THE MOUTH IS HIDDEN, THE
   WHOLE EXPRESSION HAS TO COME FROM THE EYES AND THE BODY: the eyes are creased into two gentle
   upward curves as if smiling, the eyebrows lifted in concentration, the head tilted down towards
   the roots, the shoulders low and unhurried. ONE HAND HOLDS UP A SMALL ROUND HAND LAMP WITH A
   WARM GLOW, angled down into the opened ground; THE OTHER HAND HOLDS ONE END OF A SIMPLE
   STRAIGHT MEASURING STICK held horizontally in the gap between the root tips and the stream,
   clearly measuring THE DISTANCE BETWEEN THEM. The measuring stick carries NO NUMBERS AND NO
   MARKINGS.

3. THE MOLAR IS BIG, FRIENDLY AND CURIOUS. A large cream-white molar (#f2ece2, shaded #d9cfc0)
   with a rounded crown, two little arms and two little legs, STANDING on the mound of earth,
   BENDING FORWARD FROM THE WAIST AND LOOKING DOWN over the edge at its own roots, one hand
   resting on its knee, the other pointing down at the glowing stream. Simple friendly face in
   the house style - two dot eyes, two short eyebrows, a small open mouth - eyebrows raised in
   interest. It is NOT crying, NOT frightened, NOT in pain, NOT cracked, NOT decayed.
   ITS ROOTS ARE THE OTHER HALF OF THE DRAWING: two or three long, tapering, gently curved roots
   in the same cream-white, reaching down into the earth like the roots of a tree, drawn just as
   clearly and solidly as everything above ground - never faded, never ghostly, never a
   see-through diagram.

4. THE GLOWING STREAM IS CALM, NOT DANGEROUS. Below the root tips, and CLEARLY SEPARATED FROM
   THEM BY AN OPEN GAP ABOUT AS TALL AS THE MOLAR'S CROWN, a soft rounded channel runs across the
   picture from left to right, filled with gently glowing pale violet light (#b48fc0 with a
   lighter #d6bfdd core), with two or three little curved highlight strokes on its surface like
   slow water. It is smooth, quiet and pretty - NOT a wire, NOT a cable, NOT electricity, NOT a
   lightning bolt, NOT red, NOT a warning sign. Nothing touches it.

5. THE OPENED GROUND. Below the ground line, the earth is a warm pale brown (#c8ab86, shaded
   #a5855f) in two or three flat steps, with a few small rounded pebbles and two or three short
   grass tufts along the top edge. The cutaway edge on the left and right is soft and
   hand-drawn. The surgeon's lamp throws ONE warm pool of light down into the opened ground so
   the roots and the stream are the brightest things in the lower half of the picture.

6. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: the
   surgeon leaning in with the lamp, the tooth bending over to look, the assistant taking a step
   while paying out the measuring line, a few grass tufts bending, one small brown sparrow flying
   across the upper part of the picture WELL BELOW the empty top strip. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside the lamp's glow or the moving line -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE SKY OR WALL
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   wood, never sunset, never a warm yellow cast, and never darker than that. Bright even daylight
   above ground; one warm lamp glow below ground. At least six clearly different colours: the
   off-white sky, the warm brown earth, cream-white tooth and roots, violet cap and mask,
   grey-violet scrubs, the white coat, the pale violet stream, deep green grass and one big
   rounded potted plant leaning in from the bottom left corner. Most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. NO LARGE FLAT EMPTY AREAS ANYWHERE except the top strip;
   no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the ground line runs across at about 55% of the height; the surgeon kneels
left of centre with his knee on the ground line and his cap about a third of the way down the
picture; the molar stands right of centre with its crown just below the empty top strip and its
roots reaching into the lower third; the glowing stream runs across the bottom fifth; the
assistant stands at the far right, further away and smaller; everything that must be read sits
inside the middle 73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; numbers, tick marks or
scale markings on the measuring stick; dental pliers, forceps, extraction tools, syringes,
needles, scalpels, drills, trays of instruments, surgical lights, operating theatres; anybody
gripping, pulling or lifting the tooth; blood, wounds, pain, fear; a mouth seen from inside; gums,
jawbones, medical cross-section diagrams, labelled anatomy, X-ray films with visible detail;
roots drawn as a faint see-through overlay; teeth that are cracked, chipped, blackened, stained or
decayed; the glowing stream drawn as a wire, cable, electric current, lightning, red channel or
hazard marking; patterned or printed caps; a face mask pulled down under the chin; anybody looking
at the viewer; anybody drawn faded, translucent, ghostly or outline-only; panels, insets, frames,
borders, speech bubbles, arrows, small icons, magnifying circles; dusk, sunset, golden hour, an
orange or sepia cast; cream, beige or wooden colours in the top strip; bare empty backgrounds;
grey or blue-white walls; photorealism; 3D rendering; heavy even black outlines.
```

---

## 六、選定之後要跑的

1. 原檔存 `drafts/og-topic-surg-src.jpg`，先跑三個門檻（不過就重生成，不拿給使用者）：

       node drafts/og-measure.mjs drafts/og-topic-surg-src.jpg      # 無彩空白 <5%
       node drafts/og-measure-ink.mjs drafts/og-topic-surg-src.jpg  # 邊緣密度 ≥30%、逐人線的實度 <20 階

2. 頂 17% 逐欄量一次亮度：**藍色通道要 ≥ 178**（第二節）。被東西佔到的話，
   優先「把圖往下移」（`drafts/og-shift.mjs`），推不動才用 `drafts/og-topclean.mjs`。

3. 縮圖與帶子：

       node tools/og-resize.mjs drafts/og-topic-surg-src.jpg surg
       node tools/og-plate.mjs surg --blend multiply --tintcolor '#b57bcd' \
         --ink 0.18 --blur 6 --loc full --locpos stack

4. 模擬訊息卡（LINE 中央 89.7%、iMessage 中央 78.7%）：

       node drafts/line-mock.mjs surg

5. `og:description` 照其餘六科的慣例，用那一頁自己的字 —— 候選是 close
   「難處理的那幾顆，交給口腔顎面外科專科醫師。」（19 字，卡片上一行）。

---

## 七、第二輪：使用者換了梗 ——「潛盾工程」（2026-08-25）

兩張都生出來了。使用者：

> 「這兩版的**風格顏色都抓的蠻好的**，不過**概念上不太好，有點看不太懂**。
> 　我想到**挖地道或是挖隧道的工程師** —— 因為他們也是要**避開一些重要的地方**，
> 　一些地方是不能去靠近的。目前的科技可能表面就是**潛盾**吧，人跟潛盾大小差很多，
> 　我們可以用比較**卡通式**的方式**用人操控**，然後去比如說是往下挖或是挖下水道的概念。
> 　那當然**醫師要穿著刷手服跟醫師服**，然後可以像是**幾顆牙齒埋在地底**，
> 　然後**在醫師旁邊覺得太好了、終於可以放心讓醫師去把那個東西挖出來**。」

### 兩張的實測（先量再改，兩張都沒過門檻）

| | Ⓐ 診間三顆牙 | Ⓑ 地下的河 | 門檻 |
| --- | --- | --- | --- |
| 邊緣密度 | **12.3%** | **15.0%** | ≥ 30% |
| 無彩空白（S<12 且 L>80） | **47.0%** | 4.8% | < 5% |
| 頂 17% 中位 RGB | 228/229/223 | 239/239/243 | 藍 ≥ 178 ✓ 兩張都過 |
| 頂 17% 有沒有被佔到 | 第 30 列起就有線（左側窗框） | 第 70 列起（**那隻鳥**） | 應為 0 |

**三件要帶進下一版的：**

1. ⚠⚠ **密度不足是兩張共同的病**，而且和「看不懂」是同一件事 ——
   畫面裡**能看的東西太少**。Ⓐ 那面白牆一個人吃掉 47%（第十一之一節第 3 條那個坑
   又踩了一次：「背景簡單」被寫成了「畫面空」）。
   → 潛盾這個梗天生會贏：**環片、土層、石頭、機具、纜線**全都是「元素少而大」
   但**自帶線**的東西。下一版把它們寫死進提示詞。
2. ⚠ **鳥不要再放了。** 上一版寫了「flying WELL BELOW the empty top strip」，
   模型還是把牠放進第 70 列。**會飛的東西不要出現在有淨空區的圖裡。**
3. ✅ **風格與顏色照舊** —— 使用者說這兩張抓得好，線、平塗、紫帽、米白背景、
   奶白色的牙全部不動。

### ⚠⚠ 一個非講不可的判斷：**被挖的那一顆不要有臉**

使用者要的是「旁邊的牙覺得太好了，終於可以放心讓醫師把**那個東西**挖出來」——
他自己用的詞就是「那個東西」。所以：

- **有臉的是鄰居**（地面上那兩顆，鬆一口氣／歡呼）。
- **埋在地底、要被挖出來的那一顆沒有臉**，就是一顆橫躺卡住的牙。

否則畫面會變成「一群人開著機器去挖一個有表情的角色」，那是這一頁最不能給人的感覺
（同 COPY 第九之十八節：不畫用力、不畫硬來）。**若使用者其實要的是「埋著的那顆
在求救」，那是另一個方向，要先問他。**

### Ⓓ 從上面操控，往下挖到它（建議）

地面線在畫面 42% 高。**地上左側**：醫師半跪在一台矮矮的操作台前（紫帽＋紫口罩＋
白袍＋灰紫刷手服），雙手握著兩根操縱桿，眼睛看著地下；一條粗纜線從操作台垂進洞裡。
**地上右側**：兩顆牙齒鄰居趴在土坡邊往下看，一顆舉手歡呼、一顆手貼著臉鬆口氣。
**地下**：一條鋪著環片的隧道從開口斜斜往下、再彎過去，盡頭是一台卡通潛盾機
（圓刀盤、燈、履帶），前方土裡露出那顆橫躺的智齒；隧道**明顯從發光的淡紫管線上方
繞過去**，留出清楚的間隙，也避開旁邊一根鄰牙的長根。

- **為什麼建議它**：醫師仍然夠大（60% 高 → 250px 的卡上臉約 12px），
  「避開不能碰的地方」在畫面上是**看得見的幾何**（隧道彎過去），不必靠猜。

### Ⓔ 坐進去，開著它挖（卡通比例）

鏡頭壓低到地下：右邊是大圓刀盤（露出三分之二），醫師坐在刀盤後面的開放駕駛座上握桿，
後方隧道的環片一路退到左邊地面開口的亮光，兩顆牙齒鄰居在開口邊探頭往下看；
下方橫過發光的淡紫管線，隧道明顯抬高避開；刀盤前方的土裡露出那顆橫躺智齒的一角。
⚠ 這一版**地表線壓到 30% 高**，上面仍留一條天空 —— 因為頂 17% 若是土色（B≈134），
帶子就追不上口外的紫（第二節，藍通道要 ≥178）。

---

## 八、第二輪的兩份完整提示詞（2026-08-25，可直接複製）

### Ⓓ 從上面操控，往下挖到它

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: THIS IS A TUNNELLING JOB. An oral
surgeon in a violet surgical cap and mask, a white coat and scrubs is KNEELING AT A SMALL CONTROL
DESK ON THE GROUND, both hands on the levers, DRIVING A LITTLE CARTOON TUNNEL-BORING MACHINE that
is working its way through the earth below him towards ONE AWKWARD TOOTH THAT IS LYING ON ITS SIDE,
BURIED - and the tunnel he has driven CURVES CLEARLY AROUND AND OVER A GLOWING VIOLET PIPE that
must not be touched. Two other teeth are leaning over the edge of the hole watching, delighted
that somebody has finally come to get that thing out. It is a calm, well-run little engineering
site, not a rescue and not an attack.

IT IS ONE SINGLE CONTINUOUS SCENE, NOT TWO PANELS: the ground line runs across the picture at
about 42% of the height, and the open hole, the cable and the tunnel carry the eye from the top
half down into the bottom half without a break. There is NO frame, NO border and NO dividing
line; the cutaway edge of the earth is soft and hand-drawn, never a ruled straight line.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS, with clear space between them so each reads
separately at thumbnail size:
  GROUP A, upper left, ABOVE GROUND and NEAREST: the surgeon kneeling at the control desk -
  the biggest figure, about 60% of the picture height as he kneels.
  GROUP B, upper right, ABOVE GROUND: two tooth characters lying on their fronts at the edge of
  the hole, looking down - about 22% and 20% of the picture height.
  GROUP C, the whole lower half, BELOW GROUND: the lined tunnel, the little boring machine at
  its far end, the glowing violet pipe it curves around, and the buried tooth ahead of the
  machine. The machine is about 20% of the picture height.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST TWO
VERSIONS BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is plain pale
background and nothing else. NOTHING may cross that line: not a head, not a cap, not a raised
hand, not a lever, not a plant, not a cloud, AND ABSOLUTELY NO BIRDS - there are no birds
anywhere in this picture. GIVE YOURSELF A MARGIN: compose so that EVERY head and EVERY raised
hand sits BELOW A LINE ONE FIFTH OF THE WAY DOWN FROM THE TOP (about 126 of the 628 pixels).

THE PICTURE MUST BE FULL OF DRAWN DETAIL - THIS IS THE OTHER THING THE LAST TWO VERSIONS GOT
WRONG. Apart from the empty top strip there must be NO large area of flat empty colour anywhere:
the earth carries three or four soft horizontal strata lines, scattered small pebbles, little
root hairs and short grass tufts along its surface; the tunnel is lined with clearly drawn
segment rings; the machine has visible plates, bolts, a lamp and tracks; the control desk has
levers, a dial and a thick cable. Everything is drawn with the same thin ink line, so the picture
reads as busy and hand-made rather than bare.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS - the same style as the
   two previous versions, which were right. Thin hand-drawn linework whose weight varies and
   sometimes breaks - NOT a thick even outline, NOT a ruled vector line. Each human face is ONE
   FLAT SKIN TONE with no shading: only the outline, two eyes drawn as small simple dots with no
   whites, two short eyebrows, a tiny nose mark and an ear - no wrinkles, no cheek lines. Hair is
   a flat shape in two tones. EVERY PERSON AND EVERY TOOTH IS DRAWN WITH EXACTLY THE SAME LINE
   WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer or more transparent than anybody else.
   Flat fills in two or three steps per colour, no gradients except to describe light. Fine paper
   grain over the whole image.

2. THE SURGEON IS DRIVING THE MACHINE FROM THE SURFACE, AND HIS CAP AND MASK ARE THE POINT.
   A person in their forties KNEELING ON ONE KNEE beside the open hole, body turned towards it,
   leaning forward and looking down into it with obvious concentration. THEY WEAR A SOFT TIE-BACK
   SURGICAL CAP THAT COVERS THE HAIR COMPLETELY, gathered and knotted into short ties at the back
   of the head, PLAIN, WITH NO PATTERN AT ALL, in a muted violet (#8e6299, shaded #784e84); a
   MATCHING PLAIN VIOLET SURGICAL MASK over the nose and mouth with a loop over each ear; an OPEN
   WHITE COAT over pale grey-violet scrubs (#c9bcd0). BECAUSE THE MOUTH IS HIDDEN, THE EXPRESSION
   COMES FROM THE EYES AND THE BODY: eyes creased into two calm upward curves, eyebrows lifted,
   head tilted down towards the tunnel, shoulders low and unhurried.
   IN FRONT OF HIM STANDS A SMALL, LOW CONTROL DESK on short legs - about knee height - with TWO
   UPRIGHT LEVERS that HIS TWO HANDS ARE HOLDING, one round dial and one big round button on its
   sloping top, and A THICK CABLE that runs from the back of the desk, over the lip of the hole
   and down along the tunnel to the machine. NO screens, NO monitors, NO writing, NO numbers on
   the desk.

3. THE LITTLE TUNNEL-BORING MACHINE IS CARTOON-SMALL AND FRIENDLY. At the far end of the tunnel,
   a stubby machine ABOUT THE SIZE OF A LARGE DOG, drawn from the side: a BIG ROUND CUTTING HEAD
   at the front made of a flat disc with a few simple spokes and a rounded rim, a short body
   behind it with visible plates and bolts, TWO SMALL TRACKS underneath, ONE ROUND LAMP on top
   throwing a soft warm cone of light forward, and the thick cable trailing back out of it. It is
   moving forward slowly - a few small crumbs of earth tumbling in front of the cutting head and
   two or three short curved motion strokes behind it. IT HAS NO FACE. It is NOT a drill, NOT a
   weapon, NOT sharp, NOT menacing; it looks like a friendly little digger.

4. THE TUNNEL IS THE PROOF THAT HE WENT ROUND THE THING HE MUST NOT TOUCH - DRAW THIS CLEARLY.
   Starting at the open hole under the control desk, the tunnel goes DOWN and then BENDS to the
   right in one smooth, generous curve, arriving beside the buried tooth. ITS WALLS ARE LINED
   WITH SEGMENT RINGS: a row of clearly drawn arches, evenly spaced along the whole tunnel like
   the rings of a sewer or a subway tunnel. HALFWAY ALONG, THE TUNNEL RISES TO PASS OVER A
   GLOWING VIOLET PIPE that runs across the picture from left to right - the tunnel arches over
   it with AN OBVIOUS OPEN GAP OF EARTH between them, about as tall as the machine itself, so a
   viewer can see at a glance that he went round it on purpose. The tunnel ALSO curves aside to
   avoid ONE LONG TAPERING TOOTH ROOT hanging down from a neighbouring tooth above. Nothing
   touches the pipe and nothing touches that root.

5. THE GLOWING PIPE IS CALM, NOT DANGEROUS. A smooth rounded channel filled with gently glowing
   pale violet light (#b48fc0 with a lighter #d6bfdd core), two or three little curved highlight
   strokes along it. It is quiet and pretty - NOT electricity, NOT a lightning bolt, NOT red, NOT
   a hazard stripe, NO warning signs, NO skulls, NO exclamation marks.

6. THE BURIED TOOTH HAS NO FACE; THE TWO WATCHING TEETH DO. Ahead of the machine, half embedded
   in the earth, lies ONE LARGE CREAM-WHITE MOLAR (#f2ece2, shaded #d9cfc0) ON ITS SIDE, tilted,
   its crown pointing towards the machine and its two stubby roots to the right - A PLAIN TOOTH
   WITH NO EYES, NO MOUTH AND NO FACE, clean and undamaged, simply stuck there. ABOVE GROUND, at
   the right-hand edge of the hole, TWO SMALLER TOOTH CHARACTERS WITH FACES are lying on their
   fronts on the grass, chins over the edge, looking down at the work: ONE HAS BOTH LITTLE ARMS
   RAISED IN A CHEER, mouth open in a happy shout; THE OTHER PRESSES ONE HAND TO ITS CHEEK AND
   LETS OUT A RELIEVED BREATH, eyes closed into two happy curves. They are pleased and relaxed -
   NOT frightened, NOT crying, NOT cracked, NOT decayed.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE SKY
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   brown, never sunset, never a warm yellow cast, and never darker than that. Bright even daylight
   above ground; below ground the machine's lamp makes ONE warm pool of light at the tunnel face,
   the brightest thing in the lower half. The earth is warm pale brown (#c8ab86, shaded #a5855f)
   in three flat steps with its strata lines and pebbles. At least six clearly different colours:
   off-white sky, warm brown earth, cream-white teeth, violet cap and mask, grey-violet scrubs,
   white coat, the pale violet pipe, the muted steel blue-grey of the machine and the tunnel
   rings, and deep green grass with one big rounded potted plant at the bottom left corner. Most
   colour blocks sit around HSL saturation 30-50 and lightness 70-85.

COMPOSITION ANCHORS: the ground line runs across at about 42% of the height; the surgeon kneels
in the upper left with his cap about a quarter of the way down the picture and his knee on the
ground line; the control desk and the open hole are just right of him; the two watching teeth lie
at the upper right; the tunnel curves from the hole down and to the right across the lower half;
the glowing pipe runs across the bottom fifth; the machine and the buried tooth are at the lower
right; everything that must be read sits inside the middle 73% of the width; the top 17% stays
completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; birds, clouds, kites,
balloons or anything else in the sky; dental pliers, forceps, syringes, needles, scalpels, dental
drills, trays of instruments, operating theatres; hard hats, high-visibility vests, warning signs,
hazard tape, traffic cones with markings; anybody gripping, pulling or lifting a tooth by hand;
blood, wounds, pain, fear, cracks, decay, stains; a face on the buried tooth or on the machine; a
mouth seen from inside; gums, jawbones, labelled anatomy, X-ray films with visible detail; the
machine drawn as a sharp drill, a weapon or a monster; the glowing pipe drawn as electricity,
lightning, a red channel or a hazard marking; the tunnel cutting through or touching the pipe;
patterned or printed caps; a mask pulled down under the chin; anybody looking at the viewer;
anybody drawn faded, translucent, ghostly or outline-only; panels, insets, frames, borders,
speech bubbles, arrows, small icons, magnifying circles; large flat empty areas anywhere except
the top strip; dusk, sunset, golden hour, an orange or sepia cast; brown, cream or beige at the
top of the picture; photorealism; 3D rendering; heavy even black outlines.
```

### Ⓔ 坐進去，開著它挖

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: WE ARE LOOKING INTO A CUTAWAY OF
THE GROUND. An oral surgeon in a violet surgical cap and mask, a white coat and scrubs IS SITTING
IN THE OPEN DRIVING SEAT OF A LITTLE CARTOON TUNNEL-BORING MACHINE, both hands on the levers,
driving it slowly forward through the earth towards ONE AWKWARD TOOTH THAT IS LYING ON ITS SIDE,
BURIED, just ahead of the cutting head - and he has STEERED THE TUNNEL UP AND OVER A GLOWING
VIOLET PIPE that must not be touched. Behind him the finished tunnel runs back to the daylight of
the entrance shaft, where two other teeth are leaning in and looking down, delighted that somebody
has finally come to get that thing out.

IT IS ONE SINGLE CONTINUOUS SCENE, NOT TWO PANELS. The surface of the ground runs across the
picture high up, at about 30% of the height, with plain pale sky above it and the open cutaway of
the earth below it; the entrance shaft joins the two, so the eye travels down without a break.
There is NO frame, NO border and NO dividing line; the cutaway edge is soft and hand-drawn.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS, with clear space between them so each reads
separately at thumbnail size:
  GROUP A, centre and NEAREST: the surgeon in the driving seat - the biggest figure, about 55% of
  the picture height as he sits.
  GROUP B, right: the big round cutting head of the machine, about two thirds of it visible, and
  just beyond it the buried tooth - the cutting head is about 45% of the picture height.
  GROUP C, upper left and furthest: the entrance shaft with daylight coming down it and two tooth
  characters leaning in over its rim, about 15% of the picture height each.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST TWO
VERSIONS BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is PLAIN PALE SKY and
nothing else - IT MUST NOT BE EARTH, NOT BROWN, NOT A TUNNEL WALL. NOTHING may cross that line:
not a head, not a tooth, not a raised hand, not a plant, not a cloud, AND ABSOLUTELY NO BIRDS.
GIVE YOURSELF A MARGIN: compose so that EVERY head and EVERY raised hand sits BELOW A LINE ONE
FIFTH OF THE WAY DOWN FROM THE TOP (about 126 of the 628 pixels), and the ground surface itself
sits just below that line.

THE PICTURE MUST BE FULL OF DRAWN DETAIL - THIS IS THE OTHER THING THE LAST TWO VERSIONS GOT
WRONG. Apart from the empty sky strip there must be NO large area of flat empty colour anywhere:
the earth carries three or four soft horizontal strata lines, scattered small pebbles, little
root hairs and short grass tufts along its surface; the tunnel behind the machine is lined with
clearly drawn segment rings receding into the distance; the machine has visible plates, bolts,
a lamp, levers and tracks. Everything is drawn with the same thin ink line, so the picture reads
as busy and hand-made rather than bare.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS - the same style as the
   two previous versions, which were right. Thin hand-drawn linework whose weight varies and
   sometimes breaks - NOT a thick even outline, NOT a ruled vector line. Each human face is ONE
   FLAT SKIN TONE with no shading: only the outline, two eyes drawn as small simple dots with no
   whites, two short eyebrows, a tiny nose mark and an ear - no wrinkles, no cheek lines. Hair is
   a flat shape in two tones. EVERY PERSON AND EVERY TOOTH IS DRAWN WITH EXACTLY THE SAME LINE
   WEIGHT AND THE SAME SOLIDITY. Flat fills in two or three steps per colour, no gradients except
   to describe light. Fine paper grain over the whole image.

2. THE SURGEON IS SITTING IN THE MACHINE AND DRIVING IT, AND HIS CAP AND MASK ARE THE POINT.
   A person in their forties SITTING IN AN OPEN SEAT on the back half of the machine, seen from
   the side, leaning forward, BOTH HANDS ON TWO UPRIGHT LEVERS in front of him, looking ahead
   past the cutting head with obvious concentration. THEY WEAR A SOFT TIE-BACK SURGICAL CAP THAT
   COVERS THE HAIR COMPLETELY, gathered and knotted into short ties at the back of the head,
   PLAIN, WITH NO PATTERN AT ALL, in a muted violet (#8e6299, shaded #784e84); a MATCHING PLAIN
   VIOLET SURGICAL MASK over the nose and mouth with a loop over each ear; an OPEN WHITE COAT
   over pale grey-violet scrubs (#c9bcd0). BECAUSE THE MOUTH IS HIDDEN, THE EXPRESSION COMES FROM
   THE EYES AND THE BODY: eyes creased into two calm upward curves, eyebrows lifted, shoulders
   low and unhurried. HE IS DRAWN BIG - his head and shoulders are among the largest shapes in
   the picture.

3. THE MACHINE IS CARTOON-SIZED SO THAT A PERSON CAN DRIVE IT. Seen from the side: a BIG ROUND
   CUTTING HEAD at the right, drawn as a flat disc with a few simple spokes and a rounded rim,
   about two thirds of it inside the picture; behind it a short body with visible plates and
   bolts, TWO SMALL TRACKS underneath, ONE ROUND LAMP on top throwing a soft warm cone of light
   forward past the cutting head, and the open driving seat with its levers. It is moving forward
   slowly - a few small crumbs of earth tumbling in front of the cutting head and two or three
   short curved motion strokes behind the machine. IT HAS NO FACE. It is NOT a drill, NOT a
   weapon, NOT sharp, NOT menacing; it looks like a friendly little digger.

4. THE TUNNEL BEHIND HIM IS THE PROOF THAT HE WENT ROUND THE THING HE MUST NOT TOUCH - DRAW THIS
   CLEARLY. From the machine, the finished tunnel runs back to the LEFT and slightly UP, LINED
   WITH SEGMENT RINGS - a row of clearly drawn arches, evenly spaced, getting smaller as they
   recede - and ends at the bright entrance shaft in the upper left. PART WAY ALONG, THE TUNNEL
   ARCHES UP AND OVER A GLOWING VIOLET PIPE that runs across the bottom of the picture from left
   to right, WITH AN OBVIOUS OPEN GAP OF EARTH between the pipe and the tunnel floor, about as
   tall as the cutting head is wide, so a viewer can see at a glance that he went round it on
   purpose. Nothing touches the pipe.

5. THE GLOWING PIPE IS CALM, NOT DANGEROUS. A smooth rounded channel filled with gently glowing
   pale violet light (#b48fc0 with a lighter #d6bfdd core), two or three little curved highlight
   strokes along it. It is quiet and pretty - NOT electricity, NOT a lightning bolt, NOT red, NOT
   a hazard stripe, NO warning signs, NO exclamation marks.

6. THE BURIED TOOTH HAS NO FACE; THE TWO WATCHING TEETH DO. Just beyond the cutting head, half
   embedded in the earth at the right edge, lies ONE LARGE CREAM-WHITE MOLAR (#f2ece2, shaded
   #d9cfc0) ON ITS SIDE, tilted, its crown towards the machine and its two stubby roots to the
   right - A PLAIN TOOTH WITH NO EYES, NO MOUTH AND NO FACE, clean and undamaged, simply stuck
   there. AT THE TOP OF THE ENTRANCE SHAFT in the upper left, TWO SMALLER TOOTH CHARACTERS WITH
   FACES lean in over the rim and look down the shaft: ONE HAS BOTH LITTLE ARMS RAISED IN A
   CHEER, mouth open in a happy shout; THE OTHER PRESSES ONE HAND TO ITS CHEEK AND LETS OUT A
   RELIEVED BREATH, eyes closed into two happy curves. They are pleased and relaxed - NOT
   frightened, NOT crying, NOT cracked, NOT decayed. Their heads stay well below the empty sky
   strip.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE SKY
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   brown, never earth, never sunset, never a warm yellow cast, and never darker than that. Bright
   daylight pours down the entrance shaft; the machine's lamp makes ONE warm pool of light at the
   tunnel face. The earth is warm pale brown (#c8ab86, shaded #a5855f) in three flat steps with
   its strata lines and pebbles. At least six clearly different colours: off-white sky, warm brown
   earth, cream-white teeth, violet cap and mask, grey-violet scrubs, white coat, the pale violet
   pipe, the muted steel blue-grey of the machine and the tunnel rings, and deep green grass along
   the surface. Most colour blocks sit around HSL saturation 30-50 and lightness 70-85.

COMPOSITION ANCHORS: the ground surface runs across at about 30% of the height with plain sky
above it; the entrance shaft comes down at the far left with the two teeth at its rim; the lined
tunnel recedes from the centre-left to the machine; the surgeon sits at the centre with his cap
about a third of the way down the picture; the cutting head fills the right edge; the buried
tooth is beyond it at the lower right; the glowing pipe runs across the bottom fifth; everything
that must be read sits inside the middle 73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; birds, clouds, kites or
anything else in the sky; earth or tunnel wall in the top strip; dental pliers, forceps, syringes,
needles, scalpels, dental drills, trays of instruments, operating theatres; hard hats,
high-visibility vests, warning signs, hazard tape; anybody gripping, pulling or lifting a tooth by
hand; blood, wounds, pain, fear, cracks, decay, stains; a face on the buried tooth or on the
machine; a mouth seen from inside; gums, jawbones, labelled anatomy, X-ray films with visible
detail; the machine drawn as a sharp drill, a weapon or a monster; the glowing pipe drawn as
electricity, lightning, a red channel or a hazard marking; the tunnel cutting through or touching
the pipe; patterned or printed caps; a mask pulled down under the chin; anybody looking at the
viewer; anybody drawn faded, translucent, ghostly or outline-only; panels, insets, frames,
borders, speech bubbles, arrows, small icons; large flat empty areas anywhere except the top
strip; dusk, sunset, golden hour, an orange or sepia cast; photorealism; 3D rendering; heavy even
black outlines.
```

---

## 九、第三輪：機器要高科技，而且**醫師背著挖**（2026-08-25）

使用者：

> 「這個挖掘設備感覺**舊舊的、有點古老**。我放一張比較新的，你們挑戰成
> 　**比較高科技感**的樣子。**讓醫師背著挖掘。**」

附了一張全斷面隧道鑽掘機（TBM）的照片（slgear.com.tw）。

### 這一輪的實測（Ⓓ 生了兩版）

| | Ⓓ v1（土色蟲洞） | Ⓓ v2（灰色環片） | 門檻 |
| --- | --- | --- | --- |
| 邊緣密度 | 18.6% | 16.4% | ≥ 30% |
| 無彩空白 | 35.3% | **0.3%** | < 5% |
| 頂 17% 中位 RGB | 238/238/236 ✓ | 234/231/224 ✓ | 藍 ≥ 178 |
| 頂 17% 被誰佔到 | **醫師的帽子（第 40 列）** | **醫師的帽子（第 45 列）** | 應為 0 |

**兩件通則：**

1. ⚠⚠ **「淨空區」不要靠文字約束人物的位置，要靠構圖讓它不可能發生。**
   兩版都寫了「頭要在 126px 以下」，兩版都把帽子放到第 40 列。
   → 這一輪**把醫師整個放到地面以下**：地表線就是天花板，帽子不可能越線。
2. ⚠ **v1 的無彩空白 35.3%** 是土色被畫得太淡太平（大片沒有東西的淺色土）。
   v2 把土加了層次與石頭就掉到 0.3% —— **密度與空白是同一件事的兩面。**

### 參考照片的量測（不要用形容詞轉述）

- **機身中位 RGB = 253/251/254 ＝ 幾乎純白。**
  ⚠⚠ **不要照抄成純白** —— 純白（S<12、L>80）在我們的量測裡直接算「無彩空白」，
  一台佔畫面兩成的純白機器會讓那一項失守（v1 就是這樣壞的）。
  **翻譯成「淡紫灰 `#dcd8e4`」**：明度接近、彩度 18% 過得了門檻，而且它同時是這一科的色。
- **形狀的重點（照片上真的看得到的）**：圓筒狀殼、接縫是**幾條乾淨的細直線**、
  前端一個**平的圓盤刀盤**、盤面上是**格狀排列的圓形滾刀**（同心圓＋放射狀）、
  幾道細長的開口、側面兩三支**油壓缸**。
- **「舊」是哪裡來的**：前兩版畫了**鉚釘、輻條輪、鍋爐狀的圓桶**——那是蒸汽時代的語彙。
  提示詞要**正面寫死**「接縫是細直線、滾刀是格狀的圓、外緣一圈柔和的紫光」，
  AVOID 裡再點名鉚釘／輻條／煙囪／黃銅／蒸氣。

### 背負式的裝置（這一輪的新東西）

背包本體是圓角的方塊，面板線 ＋ 一條紫色光帶；**兩支輕巧的關節臂**從肩膀伸到身前，
前端是一個**小型刀盤**（直徑約醫師肩寬），正在挖；一條細軟管沿著手臂走。
⚠ 這同時解掉了「人跟潛盾大小差很多」那件事 —— **不縮小機器，改成人穿著它。**

### Ⓕ／Ⓖ 的差別

- **Ⓕ 全景剖面**：地表線壓在 28%，醫師在地下中央偏右背著裝置往右挖，
  左邊是已經挖好的白色環片隧道通到豎井，地面上兩顆牙在井口探頭。
- **Ⓖ 近景**：鏡頭推近，醫師佔 70%、刀盤佔 45%，隧道與豎井退到左後方。
  臉在 250px 的卡上約 14px（Ⓕ 約 11px）。**要最好認就選 Ⓖ，要說明「繞過去」就選 Ⓕ。**

---

## 十、第三輪的兩份完整提示詞（2026-08-25，可直接複製）

（提示詞逐字見對話紀錄與下面兩段，兩份都以「醫師背著裝置、機器是高科技」為前提。）

### Ⓕ 背著裝置，在地下往它挖（全景剖面）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: WE ARE LOOKING INTO A CUTAWAY OF
THE GROUND. An oral surgeon in a violet surgical cap and mask, a white coat and scrubs is DOWN
INSIDE THE TUNNEL HE IS MAKING, WEARING A SLEEK HIGH-TECH TUNNELLING RIG ON HIS BACK - two light
jointed arms reach from the backpack to a COMPACT ROUND CUTTING HEAD held in front of him, which
is quietly boring forward through the earth towards ONE AWKWARD TOOTH THAT IS LYING ON ITS SIDE,
BURIED, a little ahead of him. Behind him the finished tunnel, lined with clean pale rings, runs
back to a bright entrance shaft, and the tunnel CLEARLY ARCHES UP AND OVER A GLOWING VIOLET PIPE
that must not be touched. At the top of the shaft two other teeth lean in and look down,
delighted that somebody has finally come to get that thing out. It is a calm, precise, modern
piece of engineering - not a rescue, not an attack, nothing is being yanked.

IT IS ONE SINGLE CONTINUOUS SCENE, NOT TWO PANELS. The surface of the ground runs across the
picture high up, at about 28% of the height, with plain pale sky above it and the open cutaway of
the earth below it; the entrance shaft joins the two, so the eye travels down without a break.
There is NO frame, NO border and NO dividing line; the cutaway edge is soft and hand-drawn.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS, with clear space between them so each reads
separately at thumbnail size:
  GROUP A, centre right and NEAREST: the surgeon wearing the rig, with the cutting head in front
  of him - the surgeon is the biggest figure, about 55% of the picture height.
  GROUP B, lower right: the buried tooth ahead of the cutting head, about 22% of the picture
  height.
  GROUP C, upper left and furthest: the entrance shaft with daylight coming down it, and two
  tooth characters leaning in over its rim above ground, about 14% of the picture height each.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND EVERY PREVIOUS
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is PLAIN PALE SKY and
nothing else - not earth, not brown, not a tunnel wall. NOTHING may cross that line: not a head,
not a cap, not a tooth, not a raised hand, not a plant, not a cloud, AND ABSOLUTELY NO BIRDS.
THE EASIEST WAY TO GUARANTEE THIS IS BUILT INTO THE SCENE: THE SURGEON IS COMPLETELY UNDERGROUND,
so his cap is far below the sky; the two teeth at the shaft rim are small and sit just above the
ground line, well below a line one fifth of the way down from the top (about 126 of the 628
pixels).

THE PICTURE MUST BE FULL OF DRAWN DETAIL - THIS IS THE OTHER THING THE PREVIOUS VERSIONS GOT
WRONG (they were half as dense as they should be). Apart from the empty sky strip, NO patch of
the picture bigger than about a tenth of its area may be left as flat empty colour. The earth is
NOT one flat fill: it carries three or four soft horizontal strata lines, many scattered small
pebbles of two or three sizes, little root hairs, small soil speckles, and short grass tufts
along the surface; the finished tunnel is lined with clearly drawn segment rings; the rig and the
cutting head carry panel seams, bolted flanges and a grid of round disc cutters. Everything is
drawn with the same thin ink line, so the picture reads as busy and hand-made rather than bare.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS - the same hand-drawn
   style as the previous versions, which was right. Thin hand-drawn linework whose weight varies
   and sometimes breaks - NOT a thick even outline, NOT a ruled vector line. Each human face is
   ONE FLAT SKIN TONE with no shading: only the outline, two eyes drawn as small simple dots with
   no whites, two short eyebrows, a tiny nose mark and an ear - no wrinkles, no cheek lines. Hair
   is a flat shape in two tones. EVERY PERSON AND EVERY TOOTH IS DRAWN WITH EXACTLY THE SAME LINE
   WEIGHT AND THE SAME SOLIDITY. Flat fills in two or three steps per colour, no gradients except
   to describe light. Fine paper grain over the whole image.

2. THE SURGEON IS WEARING THE MACHINE, AND HIS CAP AND MASK ARE THE POINT. A person in their
   forties standing inside the tunnel, seen from the side, leaning forward into the work with one
   foot ahead of the other, looking at the tunnel face with obvious concentration. THEY WEAR A
   SOFT TIE-BACK SURGICAL CAP THAT COVERS THE HAIR COMPLETELY, gathered and knotted into short
   ties at the back of the head, PLAIN, WITH NO PATTERN AT ALL, in a muted violet (#8e6299,
   shaded #784e84); a MATCHING PLAIN VIOLET SURGICAL MASK over the nose and mouth with a loop
   over each ear; an OPEN WHITE COAT over pale grey-violet scrubs (#c9bcd0). BECAUSE THE MOUTH IS
   HIDDEN, THE EXPRESSION COMES FROM THE EYES AND THE BODY: eyes creased into two calm upward
   curves, eyebrows lifted, shoulders low and unhurried. He is NOT straining, NOT hunched, NOT
   braced as if against a heavy load - the rig is light.

3. THE RIG ON HIS BACK IS SLEEK AND MODERN - THIS IS THE THING THE LAST VERSION GOT WRONG, WHERE
   IT LOOKED LIKE AN OLD STEAM BOILER. On his back sits a NEAT ROUNDED-RECTANGLE BACKPACK UNIT
   about the size of a school bag, its shell drawn as SMOOTH PANELS DIVIDED BY A FEW CLEAN
   STRAIGHT SEAMS, with ONE SLIM HORIZONTAL LIGHT STRIP glowing soft violet along its side and
   two small flush round ports. TWO LIGHT JOINTED ARMS - slim, smoothly tapered, with two visible
   pivot joints each and a thin flexible hose running along them - reach from the top of the
   backpack over his shoulders to the cutting head in front of him, which he steers with both
   hands on two compact grips. THE SHELL IS PALE GREY-LILAC (#dcd8e4), shaded #b9b2c6 - NEVER
   PURE WHITE, NEVER PLAIN GREY. NO rivets, NO bolted plate seams, NO chimney, NO smoke, NO
   exhaust pipe, NO brass, NO wood, NO spoked wheels, NO exposed gears, NO chains.

4. THE CUTTING HEAD IS DRAWN FROM THE MODERN TUNNEL-BORING MACHINE IN THE PHOTOGRAPH. A FLAT
   ROUND DISC held in front of him, about as wide as his shoulders, seen slightly turned so it
   reads as a disc: its FACE CARRIES A GRID OF SMALL ROUND DISC CUTTERS arranged in two or three
   concentric rings plus a few radial spokes - about twenty small dark circles in an orderly
   pattern (#6f6878) - with three or four SLIM CURVED SLOTS between them. The rim is a smooth
   deep band (#a79fb4) with A RING OF SOFT VIOLET LIGHT (#b48fc0) glowing around its outer edge,
   throwing a gentle cone of light onto the tunnel face. It is turning slowly: a few small crumbs
   of earth tumbling away from it, and two or three short curved motion strokes. IT HAS NO FACE.
   It is NOT a drill bit, NOT a saw blade, NOT a weapon, NOT sharp or menacing - it is a calm,
   precise machine.

5. THE TUNNEL IS THE PROOF THAT HE WENT ROUND THE THING HE MUST NOT TOUCH - DRAW THIS CLEARLY.
   Behind him the finished tunnel runs back to the LEFT and slightly UP, LINED WITH SEGMENT RINGS
   in the same pale grey-lilac as the rig - a row of clearly drawn arches, evenly spaced, getting
   smaller as they recede - and ends at the bright entrance shaft in the upper left. PART WAY
   ALONG, THE TUNNEL ARCHES UP AND OVER A GLOWING VIOLET PIPE that runs across the lower part of
   the picture from left to right, WITH AN OBVIOUS OPEN GAP OF EARTH between the pipe and the
   tunnel floor, about as tall as the cutting head is wide, so a viewer can see at a glance that
   he went round it on purpose. Nothing touches the pipe.

6. THE BURIED TOOTH HAS NO FACE; THE TWO WATCHING TEETH DO. A little ahead of the cutting head,
   half embedded in the earth at the lower right, lies ONE LARGE CREAM-WHITE MOLAR (#f2ece2,
   shaded #d9cfc0) ON ITS SIDE, tilted, its crown towards the machine and its two stubby roots to
   the right - A PLAIN TOOTH WITH NO EYES, NO MOUTH AND NO FACE, clean and undamaged, simply
   stuck there. ABOVE GROUND at the top of the entrance shaft, TWO SMALLER TOOTH CHARACTERS WITH
   FACES lean in over the rim and look down: ONE HAS BOTH LITTLE ARMS RAISED IN A CHEER, mouth
   open in a happy shout; THE OTHER PRESSES ONE HAND TO ITS CHEEK AND LETS OUT A RELIEVED BREATH,
   eyes closed into two happy curves. They are pleased and relaxed - NOT frightened, NOT crying,
   NOT cracked, NOT decayed.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE SKY
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   brown, never earth, never sunset, never a warm yellow cast, and never darker than that. Bright
   daylight pours down the entrance shaft; the ring of violet light on the cutting head makes the
   brightest point underground. The earth is warm pale brown (#c8ab86, shaded #a5855f and #8d7250)
   in three clear flat steps, with all the strata lines, pebbles and root hairs described above -
   it must never look like one big empty area. At least six clearly different colours: off-white
   sky, three browns of earth, cream-white teeth, violet cap and mask, grey-violet scrubs, white
   coat, pale grey-lilac machine and rings, the pale violet pipe and its light, deep green grass
   along the surface and one big rounded potted plant at the bottom left corner. Most colour
   blocks sit around HSL saturation 30-50 and lightness 70-85.

COMPOSITION ANCHORS: the ground surface runs across at about 28% of the height with plain sky
above it; the entrance shaft comes down at the far left with the two teeth at its rim; the lined
tunnel recedes from the left towards the centre; the surgeon stands centre-right with his cap
about 40% of the way down the picture; the cutting head is in front of him at the right; the
buried tooth is at the lower right; the glowing pipe runs across the bottom fifth; everything
that must be read sits inside the middle 73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; birds, clouds or
anything else in the sky; earth or tunnel wall in the top strip; rivets, riveted plates, boilers,
chimneys, smoke, steam, brass, copper, wood panelling, spoked wheels, exposed gears, chains,
levers with round knobs, steampunk or Victorian machinery of any kind; a machine that looks old,
rusty, worn or improvised; dental pliers, forceps, syringes, needles, scalpels, dental drills,
trays of instruments, operating theatres; hard hats, high-visibility vests, warning signs, hazard
tape; anybody gripping, pulling or lifting a tooth by hand; blood, wounds, pain, fear, cracks,
decay, stains; a face on the buried tooth or on the machine; a mouth seen from inside; gums,
jawbones, labelled anatomy, X-ray films with visible detail; the cutting head drawn as a saw
blade, a drill bit or a weapon; the glowing pipe drawn as electricity, lightning, a red channel
or a hazard marking; the tunnel cutting through or touching the pipe; a pure white or neutral
grey machine; patterned or printed caps; a mask pulled down under the chin; anybody looking at
the viewer; anybody drawn faded, translucent, ghostly or outline-only; panels, insets, frames,
borders, speech bubbles, arrows, small icons; large flat empty areas anywhere except the top
strip; dusk, sunset, golden hour, an orange or sepia cast; photorealism; 3D rendering; heavy even
black outlines.
```

### Ⓖ 同一台裝置，鏡頭推近（臉最大）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: CLOSE UP INSIDE A TUNNEL UNDER
THE GROUND. An oral surgeon in a violet surgical cap and mask, a white coat and scrubs is WEARING
A SLEEK HIGH-TECH TUNNELLING RIG ON HIS BACK - two light jointed arms reach from the backpack to
a BIG ROUND CUTTING HEAD held in front of him, quietly boring forward towards ONE AWKWARD TOOTH
THAT IS LYING ON ITS SIDE, BURIED, just beyond it. Far behind him, small in the distance, the
finished tunnel curves away over A GLOWING VIOLET PIPE he steered around, towards the bright
entrance shaft where two other teeth are leaning in and looking down, delighted that somebody has
finally come to get that thing out. It is a calm, precise, modern piece of engineering.

IT IS ONE SINGLE CONTINUOUS SCENE, NOT TWO PANELS. The ground surface runs across the picture
high up, at about 25% of the height, with plain pale sky above it and the open cutaway of the
earth below. There is NO frame, NO border and NO dividing line; the cutaway edge is soft and
hand-drawn.

THE PICTURE IS BUILT AS THREE TIGHT GROUPS, with clear space between them so each reads
separately at thumbnail size:
  GROUP A, centre and NEAREST: the surgeon wearing the rig - the biggest figure, about 70% of the
  picture height, his head and shoulders the clearest shapes in the picture.
  GROUP B, right: the big round cutting head, about 45% of the picture height, and just beyond it
  the buried tooth, about 25%.
  GROUP C, upper left and FAR AWAY: the receding tunnel, the glowing pipe it arches over, the
  bright entrance shaft and the two small tooth characters at its rim above ground, each about
  10% of the picture height.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND EVERY PREVIOUS
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is PLAIN PALE SKY and
nothing else - not earth, not brown, not a tunnel wall. NOTHING may cross that line: not a head,
not a cap, not a tooth, not a raised hand, not a plant, not a cloud, AND ABSOLUTELY NO BIRDS.
THIS IS GUARANTEED BY THE SCENE ITSELF: THE SURGEON IS COMPLETELY UNDERGROUND, so his cap is far
below the sky; the two teeth in the distance are tiny and sit just above the ground line, well
below a line one fifth of the way down from the top (about 126 of the 628 pixels).

THE PICTURE MUST BE FULL OF DRAWN DETAIL - THIS IS THE OTHER THING THE PREVIOUS VERSIONS GOT
WRONG (they were half as dense as they should be). Apart from the empty sky strip, NO patch of
the picture bigger than about a tenth of its area may be left as flat empty colour. The earth is
NOT one flat fill: it carries three or four soft horizontal strata lines, many scattered small
pebbles of two or three sizes, little root hairs, small soil speckles, and short grass tufts
along the surface; the receding tunnel is lined with clearly drawn segment rings; the rig and the
cutting head carry panel seams, bolted flanges and a grid of round disc cutters. Everything is
drawn with the same thin ink line, so the picture reads as busy and hand-made rather than bare.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERYTHING EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS - the same hand-drawn
   style as the previous versions, which was right. Thin hand-drawn linework whose weight varies
   and sometimes breaks - NOT a thick even outline, NOT a ruled vector line. Each human face is
   ONE FLAT SKIN TONE with no shading: only the outline, two eyes drawn as small simple dots with
   no whites, two short eyebrows, a tiny nose mark and an ear - no wrinkles, no cheek lines. Hair
   is a flat shape in two tones. EVERY PERSON AND EVERY TOOTH IS DRAWN WITH EXACTLY THE SAME LINE
   WEIGHT AND THE SAME SOLIDITY. Flat fills in two or three steps per colour, no gradients except
   to describe light. Fine paper grain over the whole image.

2. THE SURGEON IS WEARING THE MACHINE, AND HIS CAP AND MASK ARE THE POINT. A person in their
   forties standing inside the tunnel, seen from the side and drawn LARGE, leaning forward into
   the work with one foot ahead of the other, looking at the tunnel face with obvious
   concentration. THEY WEAR A SOFT TIE-BACK SURGICAL CAP THAT COVERS THE HAIR COMPLETELY,
   gathered and knotted into short ties at the back of the head, PLAIN, WITH NO PATTERN AT ALL,
   in a muted violet (#8e6299, shaded #784e84); a MATCHING PLAIN VIOLET SURGICAL MASK over the
   nose and mouth with a loop over each ear; an OPEN WHITE COAT over pale grey-violet scrubs
   (#c9bcd0). BECAUSE THE MOUTH IS HIDDEN, THE EXPRESSION COMES FROM THE EYES AND THE BODY: eyes
   creased into two calm upward curves, eyebrows lifted, shoulders low and unhurried. He is NOT
   straining, NOT hunched, NOT braced against a heavy load - the rig is light.

3. THE RIG ON HIS BACK IS SLEEK AND MODERN - THIS IS THE THING THE LAST VERSION GOT WRONG, WHERE
   IT LOOKED LIKE AN OLD STEAM BOILER. On his back sits a NEAT ROUNDED-RECTANGLE BACKPACK UNIT
   about the size of a school bag, its shell drawn as SMOOTH PANELS DIVIDED BY A FEW CLEAN
   STRAIGHT SEAMS, with ONE SLIM HORIZONTAL LIGHT STRIP glowing soft violet along its side and
   two small flush round ports. TWO LIGHT JOINTED ARMS - slim, smoothly tapered, with two visible
   pivot joints each and a thin flexible hose running along them - reach from the top of the
   backpack over his shoulders to the cutting head in front of him, which he steers with both
   hands on two compact grips. THE SHELL IS PALE GREY-LILAC (#dcd8e4), shaded #b9b2c6 - NEVER
   PURE WHITE, NEVER PLAIN GREY. NO rivets, NO bolted plate seams, NO chimney, NO smoke, NO
   exhaust pipe, NO brass, NO wood, NO spoked wheels, NO exposed gears, NO chains.

4. THE CUTTING HEAD IS DRAWN FROM THE MODERN TUNNEL-BORING MACHINE IN THE PHOTOGRAPH, AND HERE
   IT IS BIG. A FLAT ROUND DISC in front of him, wider than his shoulders, seen slightly turned
   so it reads as a disc: its FACE CARRIES A GRID OF SMALL ROUND DISC CUTTERS arranged in two or
   three concentric rings plus a few radial spokes - about twenty small dark circles in an orderly
   pattern (#6f6878) - with three or four SLIM CURVED SLOTS between them. The rim is a smooth
   deep band (#a79fb4) with A RING OF SOFT VIOLET LIGHT (#b48fc0) glowing around its outer edge,
   throwing a gentle cone of light onto the tunnel face. It is turning slowly: a few small crumbs
   of earth tumbling away from it, and two or three short curved motion strokes. IT HAS NO FACE.
   It is NOT a drill bit, NOT a saw blade, NOT a weapon, NOT sharp or menacing.

5. THE DISTANCE TELLS THE REST OF THE STORY. Behind him, small and clearly further away, the
   finished tunnel recedes to the upper left, LINED WITH SEGMENT RINGS in the same pale grey-lilac
   that get smaller as they go, ARCHING UP AND OVER A GLOWING VIOLET PIPE that crosses the picture
   from left to right, WITH AN OBVIOUS OPEN GAP OF EARTH between the pipe and the tunnel floor,
   so a viewer can see at a glance that he went round it on purpose. The tunnel ends at the bright
   entrance shaft in the far upper left. Nothing touches the pipe.

6. THE BURIED TOOTH HAS NO FACE; THE TWO DISTANT TEETH DO. Just beyond the cutting head, half
   embedded in the earth at the right edge, lies ONE LARGE CREAM-WHITE MOLAR (#f2ece2, shaded
   #d9cfc0) ON ITS SIDE, tilted, its crown towards the machine and its two stubby roots to the
   right - A PLAIN TOOTH WITH NO EYES, NO MOUTH AND NO FACE, clean and undamaged, simply stuck
   there. FAR AWAY at the top of the entrance shaft, TWO SMALL TOOTH CHARACTERS WITH FACES lean
   in over the rim and look down: one with both little arms raised in a cheer, the other with one
   hand pressed to its cheek in relief. Even though they are small, they are drawn with the same
   solid line as everything else - never faint, never a silhouette.

7. COLOUR AND LIGHT. THE UPPER 17% OF THE PICTURE IS A PLAIN, SLIGHTLY COOL OFF-WHITE SKY
   (#e7e4dd) AND MUST STAY THAT COLOUR ACROSS THE WHOLE WIDTH - never cream, never beige, never
   brown, never earth, never sunset, never a warm yellow cast, and never darker than that. Bright
   daylight far away down the entrance shaft; the ring of violet light on the cutting head is the
   brightest thing near us. The earth is warm pale brown (#c8ab86, shaded #a5855f and #8d7250) in
   three clear flat steps, with all the strata lines, pebbles and root hairs described above. At
   least six clearly different colours: off-white sky, three browns of earth, cream-white teeth,
   violet cap and mask, grey-violet scrubs, white coat, pale grey-lilac machine and rings, the
   pale violet pipe and its light, and deep green grass along the surface. Most colour blocks sit
   around HSL saturation 30-50 and lightness 70-85.

COMPOSITION ANCHORS: the ground surface runs across at about 25% of the height with plain sky
above it; the surgeon stands just left of centre, his cap about 30% of the way down the picture
and his feet close to the bottom edge; the cutting head fills the right third; the buried tooth
sits at the lower right beyond it; the receding tunnel, the glowing pipe and the entrance shaft
are small in the upper left; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words, numbers or logos anywhere in the image; birds, clouds or
anything else in the sky; earth or tunnel wall in the top strip; rivets, riveted plates, boilers,
chimneys, smoke, steam, brass, copper, wood panelling, spoked wheels, exposed gears, chains,
steampunk or Victorian machinery of any kind; a machine that looks old, rusty, worn or
improvised; dental pliers, forceps, syringes, needles, scalpels, dental drills, trays of
instruments, operating theatres; hard hats, high-visibility vests, warning signs, hazard tape;
anybody gripping, pulling or lifting a tooth by hand; blood, wounds, pain, fear, cracks, decay,
stains; a face on the buried tooth or on the machine; a mouth seen from inside; gums, jawbones,
labelled anatomy, X-ray films with visible detail; the cutting head drawn as a saw blade, a drill
bit or a weapon; the glowing pipe drawn as electricity, lightning, a red channel or a hazard
marking; the tunnel cutting through or touching the pipe; a pure white or neutral grey machine;
patterned or printed caps; a mask pulled down under the chin; anybody looking at the viewer;
anybody drawn faded, translucent, ghostly or outline-only; panels, insets, frames, borders,
speech bubbles, arrows, small icons; large flat empty areas anywhere except the top strip; dusk,
sunset, golden hour, an orange or sepia cast; photorealism; 3D rendering; heavy even black
outlines.
```

⚠ **餵圖時多加一張**：使用者給的 **TBM 照片**，用途寫成
「**參考刀盤上滾刀的排列、圓筒殼上乾淨的接縫、油壓缸的形狀**；
**不要**參考它的顏色（那是純白）、材質、比例與背景」。
