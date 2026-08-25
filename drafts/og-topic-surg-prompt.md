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
