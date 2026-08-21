# 臘腸叼著眼鏡男孩 —— 提示詞（草稿，2026-08-21）

**這一張不是站上的圖**，是個人用的。放 `drafts/` 不會進 `_site/`（CLAUDE.md 第二節）。

## 這是什麼

參考 IG 上那件木雕（`akn.mokumoku`：一隻鵝站在直立的熊頭上，兩隻都正面朝鏡頭，
躺在淡薄荷綠的細條紋布上、由正上方俯拍）。**構圖照搬，主角換掉**：

| 原作 | 這一張 |
| --- | --- |
| 直立的棕熊 | **奶油金色的長毛臘腸**（照片二，那張去背貼圖） |
| 頭上那隻鵝 | **叼在嘴裡的圓框眼鏡男生**（照片三） |
| 木雕質感、實物照片 | **診所網站的插畫風格**（ILLUSTRATION.md 第三節） |

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
of two small standing figures laid on a bedsheet. Symmetrical and centred, both facing the
viewer straight on.
THEY ARE SMALL IN THE FRAME — this matters as much as anything else here. The dog is a
little figure lying on a large sheet, NOT a close-up: from the top of its head to the tips
of its hind feet it takes up only about TWO THIRDS of the picture height, and its body is
about two fifths of the picture width. Leave a wide, empty margin of plain cloth all the
way round — roughly a sixth of the picture height as bare cloth above the top of its head,
a sixth as bare cloth below its feet, and a broad band of cloth down each side. Nothing is
cropped and nothing touches the edge: the whole animal, both ears, all four paws and the
man's shoes sit comfortably inside the frame with cloth to spare.
The cloth is very pale mint green with soft white stripes running diagonally across the
whole background, evenly spaced, drawn by hand so they wobble slightly.

THE DOG — A long-haired dachshund, standing upright on its hind legs and facing the
viewer, filling the middle of the frame from top to bottom. Its two front paws hang loose
and relaxed in front of its chest, slightly apart, the way a standing bear figurine holds
its arms. Long low body, short sturdy legs, big rounded feathered ears hanging down beside
its cheeks and reaching below its jaw, a long feathered tail, a long fine muzzle and a
small dark nose. Round dark friendly eyes, calm and soft, looking straight out at the
viewer. The coat is long and silky: draw its direction with fine hand-drawn strokes that
follow the body and break into feathery fringes at the ears, the chest, the backs of the
legs and the tail. The coat colours are EXACTLY these and nothing else — the lit fur
#e8d0b0, the deeper fur along the back, the top of the head and the ears #d8b088, the
shadowed fur #b0a090, and the chest and belly #f0ece4. Its mouth is CLOSED and gentle, with
no teeth showing at all.

THE MAN — Held crosswise in the dog's closed mouth, exactly the way a dog carries a soft
toy: the dog holds a fold at the middle of his t-shirt, so he hangs horizontally across the
muzzle, arms and legs dangling loose and heavy, completely relaxed. He is about one quarter
of the dog's height — a small figure, but with entirely normal adult head-to-body
proportions. An east-Asian man in his late twenties with very short dark spiky hair, ROUND
black-rimmed glasses, an olive-green crew-neck t-shirt and dark trousers. He is perfectly
happy about this: eyes open, a small closed-mouth smile, looking straight out at the viewer
alongside the dog. He is NOT struggling, NOT frightened, NOT hurt, and the dog is NOT
biting him — this is affectionate and funny, like a dog proudly carrying its favourite
thing. Clothes are never flat single-tone shapes: model the t-shirt and trousers with two
or three tones of their own colour, with soft coloured-pencil shading in the folds, at the
collar, the sleeve hems and wherever the fabric gathers as it hangs.

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
huge glossy anime eyes or a human expression; an open mouth, visible teeth, fangs, a
growl, a bite mark, a wound or blood; any suggestion of pain, fear or distress; a faceless
or noodle-limbed man; exaggerated head-to-body proportions on the man himself; a wooden,
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
