# 臘腸叼著眼鏡男孩 —— 提示詞（草稿，2026-08-21）

**這一張不是站上的圖**，是個人用的。放 `drafts/` 不會進 `_site/`（CLAUDE.md 第二節）。

## 這是什麼

參考 IG 上那件木雕（`akn.mokumoku`：一隻鵝站在直立的熊頭上，兩隻都正面朝鏡頭，
躺在淡薄荷綠的細條紋布上、由正上方俯拍）。**構圖照搬，主角換掉**：

| 原作 | 這一張 |
| --- | --- |
| 直立的棕熊（大的那隻） | **站直的圓框眼鏡男生**（照片三） |
| 頭上那隻鵝（小的那隻） | **被叼在嘴裡、垂著四肢的小臘腸**（照片二） |
| 木雕質感、實物照片 | **診所網站的插畫風格**（ILLUSTRATION.md 第三節） |

⚠⚠ **大小關係是「人大狗小」，不要再畫成一隻巨大的狗叼著小人**（第一、二版都畫錯了，
見下面的修改紀錄）。

## 三件刻意破例的事（不是漏看）

1. **兩個角色都正面看著讀者。** ILLUSTRATION.md「不轉頭看讀者」那條被推翻了 ——
   原作的笑點就是兩隻一起正對鏡頭。**這條只在這一張破例**，站上的圖不要跟著改。
2. **人是主角、而且被誇張縮小。** A 類紅線第 4 條管的是「無臉」與「誇張頭身比」，
   人自己的頭身比是正常的，只是相對狗很小 —— 沒有踩到那條。
3. **「叼」要寫成叼衣服、不是咬人。** 嘴要合著、不露牙、被叼的人放鬆帶笑，
   否則會滑進 A 類紅線第 8 條（疼痛、恐懼的暗示）。

## 毛色（從照片二實測，Chromium canvas 取 5-bit 眾數）

| | |
| --- | --- |
| 受光的毛 | `#e8d0b0` |
| 背與耳的深金 | `#d8b088` |
| 陰影 | `#b0a090` |
| 胸腹的近白 | `#f0ece4` |

⚠ 給了 hex 就**不要**在旁邊再寫色名（ILLUSTRATION.md 第十之二節：色值和形容詞
打架時模型跟形容詞走）。下面那份提示詞已經照這條寫。

## 修改紀錄

**第三版（2026-08-21）—— 兩段主角對調。** 使用者：「狗要像鵝小小的　人像熊那樣叼著
被拎起來的樣子」。前兩版把**狗當成熊**（大的那隻）是根本性的讀錯，難怪改畫面佔比
也治不好 —— **他要的是人站在熊的位置、狗站在鵝的位置**。

| 從原作量到的 | 這一張照著寫 |
| --- | --- |
| 熊高 ÷ 畫面高 **67%** | 人的身高 ＝ 畫面高的三分之二 |
| 鵝高 ÷ 熊高 **28%** | 狗的身長 ＝ 人身高的四分之一（＝真實臘腸對成年人的比例，好畫） |

⚠ 對調之後 `AVOID` 要補「狗比人的軀幹還大」「像被掐著脖子吊起來」那幾條 ——
被叼的一方從人換成狗，「不能讀成受傷」那條的對象也要跟著換。
⚠ 風格、顏色、無文字三段**一個字都沒動**（第 19 條：只換出問題的那一段）。


**第二版（2026-08-21）—— 只改 `COMPOSITION` 一段。** 使用者看第一版的圖：
「大小錯了。狗太大隻 要像圖片那樣的比例」。量過兩張才確定他指的是**畫面佔比**，
不是狗與人的相對大小（人相對狗其實已經比原作的鵝相對熊還大）：

| | 參考照 | 第一版 |
| --- | --- | --- |
| 主體高 ÷ 畫面高 | 熊 **67%**（熊＋鵝 71%） | 狗 **82%** |
| 主體寬 ÷ 畫面寬 | 43% | 43%（本來就對） |
| 上方留白 | 15% | 13% |
| 下方留白 | 13% | **5.5%**（後腳幾乎頂到畫面底） |

⚠ **「小一點」要給比例與四邊留白，不要只寫 smaller** —— 模型對「佔畫面幾分之幾」
與「上下各留幾分之一」讀得懂，對形容詞讀不懂。同時在 `AVOID` 補三條擋回去：
特寫、狗佔滿整個畫面、耳朵或腳被裁掉。
⚠ 量法：Chromium canvas 讀原始像素抓遮罩的 bounding box（狗＝暖金、熊＝棕）。

## 用法

**把照片二與照片三一起餵進去當參考圖**（第十之一節：形狀不要用文字描述，用參考圖）。
長相、毛的層次這兩件用文字寫一定會走鐘。

---

## 提示詞（逐字，可直接複製）

```
Editorial illustration, 3:4 portrait.

STYLE — THIS IS THE MOST IMPORTANT SECTION. Contemporary printed-magazine editorial
illustration. Linework in warm dark brown, NEVER pure black: thin, hand-drawn, the weight
varies, strokes taper and sometimes break. Colour applied like soft coloured pencil and
light marker, with plenty of the pale paper left showing through; colour edges a little
loose, not always meeting the line. Flat fills with two or three tones per hue — no smooth
decorative gradients, no airbrushing, no 3D shading. A fine even paper grain over the whole
image, including the empty background. SKIN IS THE ONE EXCEPTION to the two-or-three-tones
rule: the man's face, neck, arms and hands are ONE FLAT TONE with no modelling, and his
face carries only six things — the outline, the eyes, the eyebrows, the nose, the mouth and
the ears. No wrinkles, no cheek or jaw shading, no nasolabial lines, no under-eye lines, no
blush, no highlights. He must read as a relaxed man in his late twenties, never older.

COMPOSITION — Seen from DIRECTLY ABOVE, flat-lay: the two of them are lying on a cloth
spread flat, but they are drawn as if standing, so the picture reads exactly like a photo
of two small figures laid out on a bedsheet. Symmetrical and centred, both facing the
viewer straight on.
SIZE — read this carefully, it is the thing most likely to go wrong. THE MAN IS THE BIG
ONE AND THE DOG IS THE SMALL ONE. The man stands in the middle of the picture and, from
the top of his head to his shoes, takes up about TWO THIRDS of the picture height. The dog
is a small animal he is carrying: from nose to rump it is only about A QUARTER OF THE MAN'S
HEIGHT — roughly the real size of a dachshund next to a grown adult. The dog is never
larger than the man's chest, and it is never the biggest thing in the picture.
THEY ARE SMALL IN THE FRAME — the man is a little figure lying on a large sheet, NOT a
close-up. Leave a wide, empty margin of plain cloth all the way round: roughly a sixth of
the picture height as bare cloth above his head, a sixth as bare cloth below his shoes,
and a broad band of cloth down each side. Nothing is cropped and nothing touches the edge.
The cloth is very pale mint green with soft white stripes running diagonally across the
whole background, evenly spaced, drawn by hand so they wobble slightly.

THE MAN — A man standing upright and facing the viewer, straight on and symmetrical, in
exactly the pose of a small standing carved bear: feet together and pointing forward, legs
straight, both arms hanging loose and slightly away from his sides with the hands relaxed
and open, shoulders soft. He is calm and pleased with himself, looking straight out at the
viewer. An east-Asian man in his late twenties, ordinary build, with very short dark spiky
hair, ROUND black-rimmed glasses, an olive-green crew-neck t-shirt and dark trousers, plain
dark shoes. Normal adult head-to-body proportions. Clothes are never flat single-tone
shapes: model the t-shirt and trousers with two or three tones of their own colour, with
soft coloured-pencil shading in the folds, at the collar, the sleeve hems, the waist and
wherever the fabric gathers.

THE DOG — A SMALL long-haired dachshund, carried crosswise in the man's mouth, hanging in
front of his chest: the man holds a soft fold of the loose fur across the dog's shoulders
between his closed lips, and the little dog hangs there completely relaxed and content —
short legs dangling straight down, long body horizontal, tail loose, ears hanging, its
head turned to face the viewer with round dark friendly eyes and a calm soft expression.
It is enjoying this, the way a puppy carried by its mother goes soft and still. Long low
body, short sturdy legs, big rounded feathered ears reaching below its jaw, a long
feathered tail, a long fine muzzle and a small dark nose. The coat is long and silky: draw
its direction with fine hand-drawn strokes that follow the body and break into feathery
fringes at the ears, the chest, the backs of the legs and the tail. The coat colours are
EXACTLY these and nothing else — the lit fur #e8d0b0, the deeper fur along the back, the
top of the head and the ears #d8b088, the shadowed fur #b0a090, and the chest and belly
#f0ece4. The man's lips are CLOSED and gentle around the fur, with no teeth showing at
all; the dog is NOT held by its neck or throat, is NOT limp or lifeless, is NOT hurt and
is NOT frightened.

COLOUR — Clear and lively, never dull. Most colour areas should sit around HSL saturation
30–50 and lightness 70–85, and roughly half of the picture should be genuinely coloured
rather than paper white. At least five distinct colours are visible: the cream and gold of
the coat, the pale mint of the cloth, the white of the stripes, the olive of the t-shirt,
and the dark of his hair, glasses and trousers. Warm and cool both present. Desaturated
overall, nothing heavy, no orange or amber cast, no neon, no greyscale.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signatures, captions or watermarks, in any language. The t-shirt carries no print of any
kind, the cloth carries no pattern other than the plain diagonal stripes, and there is no
frame, border, sticker outline or caption around the image. Where writing would normally
appear, leave the surface plain.

AVOID — greyscale; photorealism; a photographic or 3D-rendered look; thick uniform black
outlines; chrome, metallic or iridescent gradients; a cartoon dog with an oversized head,
huge glossy anime eyes or a human expression; a dog bigger than the man's chest, a giant
dog, or the dog as the largest thing in the picture; an open mouth, visible teeth, fangs, a
bite mark, a wound or blood; a dog held by its neck or throat, a dog hanging limp,
lifeless or choking, a frightened dog with flattened ears and wide white eyes; any
suggestion of pain, fear or distress; a faceless or noodle-limbed man; exaggerated
head-to-body proportions on the man himself; a wooden,
carved, ceramic or plastic toy surface; a drop shadow or product-photography lighting;
extra animals, hands, props or furniture; a close-up or a tightly cropped composition;
the dog filling the frame from edge to edge; ears, paws or feet running off the picture.
```

---

## 想更接近原作那件木雕的話（變體，只換一段）

把 `STYLE` 段最後補一句、`AVOID` 段裡的 `a wooden, carved ... surface` 拿掉：

```
The two figures are hand-carved from pale wood: keep every surface faceted with small flat
chisel marks and let a fine straight wood grain run down the body, but still draw the whole
picture as a flat illustration — hand-drawn lines and coloured-pencil fills, never a
photograph or a 3D render.
```

⚠ 這一版和 `THE DOG` 段那句「毛用細線畫出方向、耳與胸有羽狀飛白」互相打架，
要換就把那句一起拿掉（毛的層次改由鑿痕負責）。

## 另一個位置（要更貼原作的話）

原作的鵝是**站在熊頭上**、沒有用嘴叼。想完全照那個構圖，就把 `THE DOG` 段開頭那句
`carried crosswise in the man's mouth, hanging in front of his chest` 換成：

```
standing on top of the man's head, its four short legs planted on his hair and its long
body lying along the top of his head, facing the viewer in the same direction he is
```

同一段裡「嘴唇合著咬住毛」那幾句要一起刪掉（沒有嘴這件事了），`AVOID` 裡咬傷那幾條
可以留著當保險。
