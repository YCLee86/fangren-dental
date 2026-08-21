# 小臘腸叼起大男生 —— 提示詞（草稿，2026-08-21）

**這一張不是站上的圖**，是個人用的。放 `drafts/` 不會進 `_site/`（CLAUDE.md 第二節）。

## 這是什麼

參考 IG 上那件木雕（`akn.mokumoku`：一隻鵝站在直立的熊頭上，兩隻都正面朝鏡頭，
躺在淡薄荷綠的細條紋布上、由正上方俯拍）。

| 原作 | 這一張 |
| --- | --- |
| 小小的鵝（在上面） | **小小的長毛臘腸**（照片二），**而且是牠在叼** |
| 大大的熊（在下面） | **被叼起來、雙腳離地的圓框眼鏡男生**（照片三） |
| 木雕質感、實物照片 | **診所網站的插畫風格**（ILLUSTRATION.md 第三節） |

⚠⚠ **「誰大」和「誰叼」是兩件事，不要綁在一起** —— 這是前三版全部畫錯的地方：
・**大小**照原作：人大、狗小（鵝是熊高的 28%）。
・**動作**相反：**小狗叼著大人**，人整個被拎起來、腳離地。
梗就在這個不可能：那麼小一隻居然叼得動一個成年人。**狗一畫大，梗就沒了。**

## 修改紀錄

**第四版（2026-08-21）—— 大小與動作拆開，另加表情。** 使用者：「狗要叼著但是狗是
很小隻……像那個鵝小小的，然後〔人〕像熊一樣這麼大大，然後被那個小小的狗咬著叼」
＋「人物表情跟狗的樣子再活潑開心一點生動一點，看起來表情好死哦」。

| 版本 | 誰大 | 誰叼 | 結果 |
| --- | --- | --- | --- |
| 一、二 | 狗大人小 | 狗 | ✗ 狗變成巨獸 |
| 三 | 人大狗小 | **人** | ✗ 我把「叼」也跟著換給大的那一方 |
| **四** | **人大狗小** | **狗** | ✅ |

新增 `MOOD` 段（獨立一段、排在兩個主角之前，權重才夠）：大笑開嘴、眼睛彎成月牙、
眉毛揚起、狗耳朵豎、尾巴甩；並明文擋掉「一條直線的閉嘴」「木頭人般的對稱站姿」。
⚠ 「表情好死」的成因多半不是沒寫笑，是**整張太對稱** —— 所以 `MOOD` 段裡同時要求
四處小不對稱（狗歪頭、人屈膝、兩手不等高、衣服被拉歪）。
⚠ 尾巴的甩動照 ILLUSTRATION.md 第三節：**同向的一群短弧**，不可以是一條長曲線
（一條會被讀成靈魂出竅，第七節第 17 條）。

**第三版** 兩段主角對調（人站熊的位置）。**第二版** 只改畫面佔比：量到參考照裡
熊佔畫面高 67%、鵝是熊高的 28%，而第一版的狗佔到 82%、下方只剩 5.5% 留白。
⚠ 「小一點」要給比例與四邊留白，不要只寫 smaller。

## 毛色（從照片二實測，Chromium canvas 取 5-bit 眾數）

| | |
| --- | --- |
| 受光的毛 | `#e8d0b0` |
| 背與耳的深金 | `#d8b088` |
| 陰影 | `#b0a090` |
| 胸腹的近白 | `#f0ece4` |

⚠ 給了 hex 就**不要**在旁邊再寫色名（ILLUSTRATION.md 第十之二節：色值和形容詞
打架時模型跟形容詞走）。下面那份提示詞已經照這條寫。

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
blush, no highlights. He must read as a cheerful man in his late twenties, never older.

THE JOKE — A TINY dog is carrying a WHOLE GROWN MAN in its mouth, lifted clean off the
ground, and both of them think this is wonderful. The little dachshund is at the TOP of the
picture, upright and facing us; the man hangs straight down underneath it, held by the
back of his t-shirt, his feet dangling well clear of the ground.

SIZE — read this carefully, it is the thing most likely to go wrong. THE DOG IS TINY AND
THE MAN IS BIG. The man is the large figure: from the top of his head to his shoes he takes
up about THREE FIFTHS of the picture height. The little dog above him is only about A
QUARTER OF THE MAN'S HEIGHT — its body is roughly twice as long as the man's head is tall,
no more. A real dachshund next to a grown adult. The dog must NEVER be drawn large, never
man-sized, never as big as his torso: the whole point is that something that small is
carrying him. And the dog is the one doing the carrying — never the other way round.

COMPOSITION — Seen from DIRECTLY ABOVE, flat-lay: the two of them are lying on a cloth
spread flat, but they are drawn as if upright, so the picture reads exactly like a photo of
two small figures laid out on a bedsheet. Centred, stacked vertically — little dog on top,
big man hanging below — and both facing the viewer straight on.
THEY ARE SMALL IN THE FRAME: leave a wide, empty margin of plain cloth all the way round —
roughly an eighth of the picture height as bare cloth above the dog, an eighth below the
man's shoes, and a broad band of cloth down each side. Nothing is cropped and nothing
touches the edge.
The cloth is very pale mint green with soft white stripes running diagonally across the
whole background, evenly spaced, drawn by hand so they wobble slightly.

MOOD — This picture is FUNNY, WARM AND FULL OF LIFE, and that must be obvious at a glance.
Both of them are delighted. THE MAN IS BEAMING: a wide open happy grin with the mouth
clearly open, the eyes curved into cheerful upward crescents behind his round glasses, the
eyebrows raised high, the cheeks pushed up. THE DOG IS THRILLED WITH ITSELF: eyes wide,
round and bright, ears perked up and lifted away from its cheeks, head tilted a few degrees
to one side, tail swinging. NOBODY is blank, deadpan, polite, sleepy, worried or stiff —
no small straight closed line for a mouth, no flat neutral stare, no mannequin standing to
attention. Keep small asymmetries everywhere so nothing looks frozen: the dog's tilted
head, one of the man's knees bent with that foot kicked a little to the side, one hand
higher and more open than the other, the t-shirt pulled crooked where it is gripped.

THE LITTLE DOG — the small one, and the one doing the carrying. A long-haired dachshund
seen from the front, upright on its short hind legs at the top of the picture, its two
front paws hanging loose and happy in front of its chest like a small standing bear
figurine. Long low body, short sturdy legs, big rounded feathered ears reaching below its
jaw, a long feathered tail, a long fine muzzle and a small dark nose. Its tail is up and
swinging: draw the swing as THREE OR FOUR SHORT hand-drawn arcs of equal length, all
curving the same way beside the tail, evenly spaced and fading out as they go — never one
long continuous ribbon, never a loop, never bigger than the dog itself.
Gathered in its closed mouth is a big soft fold of the back of the man's t-shirt, bunched
and stretched into folds where it is held — fabric only. No teeth are visible, nothing is
bitten and nobody is hurt.
The coat is long and silky: draw its direction with fine hand-drawn strokes that follow the
body and break into feathery fringes at the ears, the chest, the backs of the legs and the
tail. The coat colours are EXACTLY these and nothing else — the lit fur #e8d0b0, the
deeper fur along the back, the top of the head and the ears #d8b088, the shadowed fur
#b0a090, and the chest and belly #f0ece4.

THE MAN — the big one, and the one being carried. He hangs straight down from the little
dog's mouth, lifted clean off the ground with a clear gap of empty cloth beneath his shoes,
facing the viewer. His shoulders are pulled up a little by the grip on his shirt, his arms
hang loose and swing slightly away from his sides with the hands open and the fingers a
little spread, one knee bent with that foot kicked out to the side. He is having the time
of his life — completely relaxed, grinning, delighted to be carried. An east-Asian man in
his late twenties, ordinary build, with very short dark spiky hair, ROUND black-rimmed
glasses, an olive-green crew-neck t-shirt and dark trousers, plain dark shoes. Normal adult
head-to-body proportions. Clothes are never flat single-tone shapes: model the t-shirt and
trousers with two or three tones of their own colour, with soft coloured-pencil shading in
the folds, at the collar, the sleeve hems, the waist, and especially in the fabric pulled
tight and gathered up towards the dog's mouth.

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
outlines; chrome, metallic or iridescent gradients; A BIG DOG — a dog as tall as the man,
as big as his torso, or the largest thing in the picture; the man carrying or holding the
dog, which is the wrong way round; the man standing on the ground with his feet down; a
blank, deadpan, sleepy, polite or worried face; a small straight closed line for a mouth;
a stiff, perfectly symmetrical mannequin pose; a cartoon dog with an oversized head, huge
glossy anime eyes or a human expression; an open mouth, visible teeth, fangs, a bite mark,
a wound or blood; a man held by his neck or throat; anyone hanging limp, lifeless or
distressed; a faceless or noodle-limbed man; exaggerated head-to-body proportions on the
man himself; a wooden, carved, ceramic or plastic toy surface; a drop shadow or
product-photography lighting; extra animals, hands, props or furniture; a close-up or a
tightly cropped composition; anything running off the edge of the picture.
```

---

## 兩個可以換的地方

**① 人改成橫著被叼**（狗叼東西通常是橫的，也更像真的在搬）：把 `THE JOKE` 與
`COMPOSITION` 裡「人垂直吊在下面」改成「人橫躺在狗的嘴下、四肢往下垂」，
`SIZE` 段改成「人的身長約畫面寬的四分之三」。⚠ 直式畫面裡橫著會擠，兩側留白要收。

**② 更貼原作：狗站到頭頂上**（原作的鵝沒有用嘴叼）。把 `THE LITTLE DOG` 段開頭
換成：

```
standing on top of the man's head, its four short legs planted in his hair and its long
body lying along the top of his head, facing the viewer in the same direction he is
```

同段「嘴裡咬著衣服」那幾句一起刪掉，人改成站在地上。**這一版就沒有「叼」了。**

**③ 木雕質感**（想更接近原作那件實物）：`STYLE` 段補一句、`AVOID` 裡
`a wooden, carved ... surface` 拿掉：

```
The two figures are hand-carved from pale wood: keep every surface faceted with small flat
chisel marks and let a fine straight wood grain run down the body, but still draw the whole
picture as a flat illustration — hand-drawn lines and coloured-pencil fills, never a
photograph or a 3D render.
```

⚠ 這一版和毛的飛白那句打架，要換就把那句一起拿掉（毛的層次改由鑿痕負責）。
