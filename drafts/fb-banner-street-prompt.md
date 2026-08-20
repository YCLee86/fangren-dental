# Facebook 粉絲專頁橫幅：永樂街街景插畫（提示詞）

> ⚠ **目前要用的是第七節那一份（第二輪）**。第三節是第一輪，留著看改了什麼。

用途：**Facebook 粉絲專頁的封面橫幅**（不是文章 HERO，所以不進 `assets/`、
也不跑 `tools/hero-resize.mjs` —— 那支鎖死 2000×1116 的比例）。

梗：**把診所的實際門面畫成插畫，門口那條街是活的** —— 有人走進門、有人在門口聊天、
有小孩、有機車、有盆栽，加上 ILLUSTRATION.md 第十之六節那種長的白色氛圍線。

依據：ILLUSTRATION.md 第三節（規格）、第四節（紅線）、第七節（寫提示詞學到的事）、
第九節第 1／3／4 條（背景密度、華人面孔、表情）、第十之一／四／五／六節
（參考圖、彩度目標帶、皮膚平塗、氛圍線可以長）。顏色回 PALETTE.md 拿。

---

## 一、尺寸（先看這一段，構圖是照這個排的）

Facebook 封面**同一張圖在電腦與手機上是兩種裁法**，所以「畫得好看」不夠，
**要畫得禁得起裁**。

| | |
| --- | --- |
| **出圖比例** | **16:9**（＝手機顯示的比例，最寬鬆的那一種） |
| **建議上傳** | **1640 × 924 px**（sRGB、JPEG 品質 85 左右）。生成端能給多大就給多大（2048×1152、1536×864 都好），最後再縮到 1640×924 |
| 電腦上顯示 | 820 × 312（比例 2.63）→ **等於從 1640×924 中間裁出 1640×624**，**上下各約 150px（16%）看不到** |
| 手機上顯示 | 640 × 360（比例 1.78）→ 整張都看得到 |
| 大頭貼會蓋到 | **左下角**（約畫面寬的 15%、一個圓）—— 那一塊要留成單純的路面或人行道 |

> ⚠ Facebook 的版面每隔一陣子就會改一次，上面那兩組顯示尺寸是目前的說法。
> **不要把構圖賭在某一種裁法上** —— 用 16:9 出圖、重要的東西收在中間，
> 不管它之後怎麼裁都活得下來。

**所以構圖的三條硬規則（已經寫進提示詞的 `COMPOSITION` 段）：**

1. **重要的東西全部收在中間那條 68% 的橫帶裡** —— 二樓的頂與最下面那條柏油路
   是「可以被切掉」的犧牲區。
2. **木門（焦點）放在中央偏右**，左下角留空。
3. 人物與招牌不要頂到上下邊緣。

> ⚠ 生成的圖若是 4:3 或 3:2，**不要直接上傳**：先裁成 16:9 再縮到 1640×924。
> 裁的時候把木門留在中央偏右、上下各留一點餘裕。

---

## 二、參考圖怎麼餵（第十之一節：形狀不要用文字描述，用參考圖）

| 檔案 | 當什麼用 | 一定要講的話 |
| --- | --- | --- |
| **`drafts/facade-yongle-ref.jpg`**（2400×1087，使用者提供的 8000×3624 原檔縮出來的） | **建築的唯一依據** | 「照這張畫建築，比例、開窗節奏、材質都要跟著；但畫成插畫，不是照片」 |
| `assets/logo.png`（選用） | 門邊那面小牌子上的標誌 | 「只畫這個圖形，**不要有任何文字**」 |

**兩張都不餵也可以跑**，但建築會走鐘（樓層數、紅磚的位置、門的比例最容易錯）。
如果工具只吃一張參考圖，優先餵門面照；標誌那面牌子就讓它**空白**，
名稱等排版時再疊上去 —— 這也是比較安全的做法（模型畫中文字幾乎一定是亂碼）。

⚠ 照片本身是 2.21:1，比 16:9 扁。提示詞裡已經寫了「往上補天空與電線、往下補路面」，
不然模型會自己把建築拉高或塞滿。

---

## 三、提示詞（完整一份，直接複製）

```
Editorial illustration for a wide banner, 16:9 landscape. A lively neighbourhood street in
front of a real building. THE BUILDING IS GIVEN IN THE ATTACHED PHOTOGRAPH and must be
followed closely; everything else — the people, the street life, the light — is invented
around it.

STYLE — READ THIS SECTION FIRST, IT MATTERS MORE THAN ANYTHING ELSE BELOW.
Contemporary printed-magazine editorial illustration, clearly hand-drawn — never a
photograph, never 3D, never a flat vector graphic. Linework in warm dark brown or soft
charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies along each stroke,
strokes taper and sometimes break. Colour applied like soft coloured pencil and light
marker; flat fills with two or three tones per hue; no smooth decorative gradients — a
gradient may only ever describe light. A fine even paper grain sits over every surface of
the whole image, including the sky. No wall, awning, garment or road is a flat single-tone
shape: each carries visible pencil texture and two or three tones of its own colour.
Colour throughout — never greyscale, never monochrome, never washed out into near-white
pastels.
FACES ARE THE ONE EXCEPTION to the two-or-three-tones rule: skin is a single flat tone with
NO shading, NO wrinkles, NO nasolabial lines, NO cheekbone or jaw modelling. On each face
draw only six things — the outline of the head, the eyes, the eyebrows, a small nose, a
simple line mouth, the ears. Everyone looks their own age and nobody looks old or tired.

THE BUILDING — copy the attached photograph: a two-storey Taiwanese street building seen
almost straight on, flat elevation, no dramatic wide-angle perspective.
  • ground floor: pale warm grey terrazzo / granite-chip render, with a slightly darker
    plinth along the bottom and dark-framed square windows;
  • upper floor: panels of muted red brick set between pale grey concrete columns and a
    deep beam, dark aluminium sliding windows, and one smaller window directly above the
    entrance;
  • in the middle: a pair of tall doors in warm reddish-brown wood with slim dark frames —
    this is the clinic entrance and the focal point of the whole picture. Today one leaf
    stands OPEN, and a soft warm light spills out from inside onto the pavement;
  • one narrow dark metal door to either side of the entrance, a boxy water heater and
    meter boxes on the left-hand wall, two round electricity meters on the wall to the
    right of the entrance;
  • a concrete pavement with a low kerb and one square drain grate, and asphalt road along
    the bottom.
EXTEND THE SCENE beyond the photograph: add a strip of pale sky and three thin power lines
crossing the upper part of the image, and add more road at the bottom. Keep the proportions
and the rhythm of the doors and windows exactly as in the photograph; simplify the detail
but do NOT invent extra floors, extra shopfronts or a different building.

COMPOSITION — the wooden double door sits SLIGHTLY RIGHT OF CENTRE. The building fills the
middle band of the image and runs off both edges. This is a banner that will be cropped:
keep every important thing — the open door, the faces, the main figures — inside the
CENTRAL 68% of the height; the top of the upper floor and the near edge of the road are the
parts that may be cut away. The LOWER LEFT CORNER, about one sixth of the width, must stay
quiet: plain pavement and road with nothing important in it.

STREET LIFE — the street is busy and cheerful but easy to read. Draw EXACTLY these people
and nothing more, all East Asian (Taiwanese), black or dark brown hair, all in different
clothing colours:
  • just right of the open door, a mother of about 35 holding the hand of a five-year-old
    boy, both stepping in through the doorway, seen three-quarters from behind; the boy
    looks up at her and she looks down at him;
  • a man of about 70 and a woman of about 65 standing a few steps to the left of the
    entrance, talking to each other; she holds a cloth bag with spring onions and a radish
    sticking out of it; he has one hand resting on the handlebar of a parked bicycle;
  • two schoolgirls of about twelve with backpacks walking along the pavement towards the
    right, one of them wheeling a bicycle, both talking;
  • a woman of about 28 walking away from the entrance towards the left, a small paper bag
    in one hand, her face calm and softly smiling;
  • a man of about 45 riding a scooter slowly along the road from left to right, seen from
    behind and slightly to the side, small in the picture;
  • a shopkeeper of about 50 at the far left edge, half cut off by the frame, bending to
    water a row of potted plants outside her own doorway;
  • a small short-haired dog sitting on the pavement near the bicycles.
Nobody looks at the viewer. Nobody is a dark silhouette. Nobody is mocking, arguing or in a
hurry. NO figure is taller than half the height of the image; the nearest people reach about
half, the ones further down the street are clearly smaller and drawn with fewer lines and
lighter colour. Keep the men and women roughly balanced in number.

PROPS along the street, low and near the bottom: two parked scooters angled to the kerb on
the left side, one bicycle leaning by the wall, five or six potted plants of different sizes
by the doorways, a small folding stool, a rolled hose, a couple of stacked plastic crates.
These sit low and never cover a face.

MOOD — an ordinary weekday afternoon in a small town where people know each other. Warm,
unhurried, neighbourly. This is a clinic that has been on this street for a long time.

ATMOSPHERE LINES — hand-drawn WHITE chalk lines drawn ON TOP of the colour, as a light
decorative layer describing moving air. Two or three LONG shallow arcs sweep across the
upper part of the image, roughly parallel to the power lines, plus two or three shorter ones
low across the street. They are solid where they begin and thin out into dry chalk flecks;
they run the same way and never cross. They must NOT come out of anyone's mouth, nose, hands
or body, must NOT loop or curl into a closed shape, and must NOT read as smoke, steam or a
spirit. They are quiet — never the loudest thing in the picture.

LIGHT AND COLOUR — bright mid-to-late AFTERNOON DAYLIGHT, unmistakably daytime and airy.
NOT sunset, NOT dusk, NOT night, no lamplight over the street, no long orange shadows, no
orange or amber cast over the whole image, no neon. Soft short shadows under the people and
the scooters. The one warm accent is the light coming out of the open doorway.
Keep the colour clear and alive, not dusty: most colour areas sit around HSL saturation
30–50 with lightness 70–85, and roughly half the picture is genuinely coloured rather than
neutral grey. At least six clearly different colours must be visible, assigned like this:
muted brick red on the upper-floor brick; warm pale grey on the render; warm reddish-brown
on the wooden doors; deep warm charcoal on the window frames; pale cream-blue sky; and the
people in, respectively, dusty rose, pale butter yellow, soft powder blue, sage green,
muted clay and warm grey — no two of them in the same hue. The potted plants bring in
several greens.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat at the entrance,
the small plaque beside the door, one plant pot, and one of the crates. Do NOT tint the
whole image green, no bright emerald, no green skin or green road.

THE PLAQUE — the small rectangular plaque on the wall beside the entrance is COMPLETELY
BLANK: a plain panel with no letters, no numbers, no symbols and no logo.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos, shop
signs, banners, posters, stickers, captions or watermarks, in any language. The plaque
beside the door is blank; any signboard, awning or shutter is blank; scooters and bicycles
carry NO number plates and no badges; the crates, bags, packaging and the paper bag are
blank; the schoolbags carry no printing; there are no street signs, no house numbers, no
notices taped to the wall, no menu boards. Where writing would normally appear, leave the
surface plain.

AVOID — greyscale or a single-colour image; photorealism or a 3D render; thick uniform
black outlines; flat untextured vector shapes; faceless people, noodle limbs, oversized
heads or exaggerated cartoon proportions; anyone looking at the viewer; a large backlit
figure or silhouette in the foreground; a crowd, a queue, a market with stalls, or more
people than the ones listed; anybody in medical uniform, masks, gloves, or any dental
instrument, tooth model, giant tooth or medical diagram anywhere in the picture; blood,
pain, illness or distress; sunset, night, neon, heavy shadow; rain; a Western or European
street; wrinkles and heavy facial shading; smoke, steam or spirit-like lines; text of any
kind.
```

---

## 四、傍晚版（只換這一段，其餘逐字不動）

如果想要暖一點的門口燈光版本，**只把 `LIGHT AND COLOUR` 整段換成下面這份**
（第七節第 19 條：只換出問題的那一段，其餘保留）：

```
LIGHT AND COLOUR — early evening, just after the light has gone blue but before it is dark.
The sky and the upper floor sit in a soft dusty blue; the street is still clearly readable,
never murky and never black. The warm light from the OPEN DOORWAY is the single warm light
source in the picture: it spills across the pavement, catches the mother and the boy
stepping in, the nearest potted plants and the edge of the kerb, and falls away quickly into
the blue. A second, much fainter warm glow comes from one upstairs window. Everything
outside those pools is a cool blue-grey, drawn with fewer lines. Faces stay the brightest
things in the picture.
Keep the colour clear and alive rather than dusty: the lit areas sit around HSL saturation
30–50 with lightness 65–80, and the picture still reads as coloured, never as a monochrome
blue image. At least six clearly different colours must be visible, assigned like this:
muted brick red on the upper-floor brick; blue-grey on the render; warm reddish-brown on the
wooden doors; deep warm charcoal on the window frames; and the people in dusty rose, pale
butter yellow, soft powder blue, sage green, muted clay and warm grey — no two in the same
hue.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat, the plaque beside
the door, one plant pot, one crate. No neon, no orange sunset sky, no street floodlight, no
headlights pointing at the viewer.
```

---

## 五、收到圖要檢查的（照這個順序看，前三項最常出錯）

1. **字**：牌子、招牌、車牌、袋子、書包上有沒有長出亂碼。有就整張退回重生成。
2. **建築對不對得上照片**：兩層、紅磚在二樓、木門在中央偏右、左邊有熱水器與電表箱。
3. **裁切**：把圖蓋一層「上下各切 16%」看看 —— 有沒有把臉或門切掉；左下角乾不乾淨。
4. 人有沒有看鏡頭、有沒有人比畫面一半高、有沒有變成一大群人。
5. 臉有沒有被畫老（皺紋、法令紋）—— 第十之五節。
6. 白線有沒有從人身上長出來、有沒有繞成閉合圈 —— 第十之六節。
7. 彩度：是不是整張退成灰／整張泛橘／整張泛綠。
8. 有沒有跑出牙齒、器械、白袍這些「診所內部」的東西 —— 這張要的是**街**。

## 六、定案之後

- 這一份**逐字留在 repo**（第七節第 19 條），要再改圖就從這一份改、只換出問題的那一段。
- 產出的圖檔放 `drafts/`（橫幅不是站上資產）。要順便放到網站上再另外討論尺寸與 `sizes`。


---

## 七、第二輪（2026-08-20）—— 三層樓與裁切修正

第一輪的圖使用者看過，兩件事要修：

### 1. ⚠ 房子其實是**三層**，照片只是沒拍到最上面那一層

使用者：「照片裡的房子其實三層，他只是沒有上面那一層拍出來。」

**做法：三層都算數，但第三層只露下緣一條、被畫面上緣切掉。** 理由是裁切：

- 電腦版會把**上面 16% 切掉**，所以完整畫一層第三樓，等於畫了一層在電腦上看不到的東西；
- 而且三層要塞進 16:9，一二樓與門口那一條街全部得往下壓，**人會變小** ——
  這張的重點是街上的人，不是建築測繪。
- 「被上緣切掉」本來就是街拍的自然取景，讀者會自己知道樓還在上面。

⚠ 代價是**天空不見了**（立面填滿上緣）。電線因此改成**橫過立面前面**——
照片裡本來就是這樣，所以不是妥協，是照實畫。`COLOUR` 段裡原本派給天空的那個色
要改派給別的東西（已改成金屬側門與窗玻璃）。

⚠ **第三層長什麼樣還沒有照片**，下面那一版是照二樓的語彙推的（紅磚嵌在混凝土柱樑之間、
深色鋁窗）。**拿到看得到三樓的照片要回來修這一段**（第十之一節：形狀用參考圖，不要用文字描述）。

### 2. ⚠⚠ 前景的腳、機車、盆栽會被裁掉

實測第一輪那張（1376×768）：人物站的地面線在畫面高度的 **90%**、騎機車那位到 **95%**，
而電腦版只留 16%~84% —— 切出來所有人都是**沒有腳的**，狗只剩半隻，騎士被攔腰切斷。

**改法**：把整條街往上搬，**地面線放在畫面高度的 80%**，底下 16% 只留柏油。
⚠ 這**不會讓人變小** —— 省下來的是原本閒置的路面，人物佔的高度（約 27%）一格都沒少。
騎機車那位改成中景、整台在 84% 以上。

### 提示詞（第二輪完整版，直接複製）

⚠ 這一輪**能餵三張就餵三張**：門面照（建築）、**第一輪那張圖**（風格與人物，
告訴模型「維持這個畫風與這些人，只改取景」）、`assets/logo.png`（選用）。

```
Editorial illustration for a wide banner, 16:9 landscape. A lively neighbourhood street in
front of a real building. THE BUILDING IS GIVEN IN THE ATTACHED PHOTOGRAPH and must be
followed closely; everything else — the people, the street life, the light — is invented
around it.

STYLE — READ THIS SECTION FIRST, IT MATTERS MORE THAN ANYTHING ELSE BELOW.
Contemporary printed-magazine editorial illustration, clearly hand-drawn — never a
photograph, never 3D, never a flat vector graphic. Linework in warm dark brown or soft
charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies along each stroke,
strokes taper and sometimes break. Colour applied like soft coloured pencil and light
marker; flat fills with two or three tones per hue; no smooth decorative gradients — a
gradient may only ever describe light. A fine even paper grain sits over every surface of
the whole image. No wall, awning, garment or road is a flat single-tone shape: each carries
visible pencil texture and two or three tones of its own colour. Colour throughout — never
greyscale, never monochrome, never washed out into near-white pastels.
FACES ARE THE ONE EXCEPTION to the two-or-three-tones rule: skin is a single flat tone with
NO shading, NO wrinkles, NO nasolabial lines, NO cheekbone or jaw modelling. On each face
draw only six things — the outline of the head, the eyes, the eyebrows, a small nose, a
simple line mouth, the ears. Everyone looks their own age and nobody looks old or tired.

THE BUILDING — copy the attached photograph: a Taiwanese street building seen almost
straight on, flat elevation, no dramatic wide-angle perspective.
  • ground floor: pale warm grey terrazzo / granite-chip render, with a slightly darker
    plinth along the bottom and dark-framed square windows;
  • second floor: panels of muted red brick set between pale grey concrete columns and a
    deep beam, dark aluminium sliding windows, and one smaller window directly above the
    entrance;
  • in the middle: a pair of tall doors in warm reddish-brown wood with slim dark frames —
    this is the clinic entrance and the focal point of the whole picture. Today one leaf
    stands OPEN, and a soft warm light spills out from inside onto the pavement;
  • one narrow dark metal door to either side of the entrance, a boxy water heater and
    meter boxes on the left-hand wall, two round electricity meters on the wall to the
    right of the entrance;
  • a concrete pavement with a low kerb and one square drain grate, and asphalt road along
    the bottom.
THE BUILDING IS THREE STOREYS TALL. The photograph records only the lower two; a third
floor stands above them. In this picture the THIRD FLOOR IS CUT OFF BY THE TOP EDGE OF THE
FRAME: along the very top of the image we see only the deep concrete beam beneath it and
the lowest strip of its wall — the bottom edge of its brick panels between the concrete
columns, and the bottom rail of its dark aluminium windows — so it is obvious that the
building carries on upward beyond the picture. Do NOT draw a roofline, a parapet, a water
tank or a complete third floor. Do NOT leave sky above the building: the facade fills the
entire top edge of the image. Keep this third-floor strip shallow — no more than one
seventh of the image height.
THREE thin dark power lines cross the picture horizontally IN FRONT of the facade, sagging
slightly, exactly as they do in the photograph.
Keep the proportions and the rhythm of the doors and windows as in the photograph; simplify
the detail but do NOT invent extra shopfronts or a different building.

COMPOSITION — the wooden double door sits SLIGHTLY RIGHT OF CENTRE. The building runs off
both edges of the picture. This banner will be cropped along the top and the bottom — only
the middle two thirds of the height is certain to be seen — so build it in bands:
  • the TOP SEVENTH holds the cut-off third floor and the power lines, and nothing else
    that matters;
  • the middle holds everything important: the open door with its warm light, every face,
    the whole of every person;
  • THE PAVEMENT LINE THE PEOPLE STAND ON SITS AT ABOUT FOUR FIFTHS OF THE IMAGE HEIGHT.
    Every person, plant pot, scooter, bicycle, stool and the dog stands entirely ABOVE that
    line. NOTHING is cut by the bottom edge — no feet, no wheels, no tails, no pots;
  • the BOTTOM SIXTH is plain asphalt road with only soft shadows on it.
  • the LOWER LEFT CORNER, about one sixth of the width, stays quiet: plain pavement and
    road with nothing important in it.

STREET LIFE — the street is busy and cheerful but easy to read. Draw EXACTLY these people
and nothing more, all East Asian (Taiwanese), black or dark brown hair, all in different
clothing colours:
  • just right of the open door, a mother of about 35 holding the hand of a five-year-old
    boy, both stepping in through the doorway, seen three-quarters from behind; the boy
    looks up at her and she looks down at him;
  • a man of about 70 and a woman of about 65 standing a few steps to the left of the
    entrance, talking to each other; she holds a cloth bag with spring onions and a radish
    sticking out of it; he has one hand resting on the handlebar of a parked bicycle;
  • two schoolgirls of about twelve with backpacks walking along the pavement towards the
    right, one of them wheeling a bicycle, both talking;
  • a woman of about 28 walking away from the entrance towards the left, a small paper bag
    in one hand, her face calm and softly smiling;
  • a man of about 45 riding a scooter slowly along the road from left to right, placed in
    the MIDDLE DISTANCE towards the left and drawn small, seen from behind and slightly to
    the side; he and his scooter sit ENTIRELY inside the middle band and are never touched
    by the bottom edge;
  • a shopkeeper of about 50 at the far left edge, half cut off by the frame, bending to
    water a row of potted plants outside her own doorway;
  • a small short-haired dog sitting on the pavement near the bicycles.
Nobody looks at the viewer. Nobody is a dark silhouette. Nobody is mocking, arguing or in a
hurry. NO figure is taller than half the height of the image; the nearest people reach about
half, the ones further down the street are clearly smaller and drawn with fewer lines and
lighter colour. Keep the men and women roughly balanced in number.

PROPS along the street: two parked scooters angled to the kerb on the left side, one bicycle
leaning by the wall, five or six potted plants of different sizes by the doorways, a small
folding stool, a rolled hose, a couple of stacked plastic crates. They sit on the pavement
above the pavement line, never cover a face, and are never cut by the bottom edge.

MOOD — an ordinary weekday afternoon in a small town where people know each other. Warm,
unhurried, neighbourly. This is a clinic that has been on this street for a long time.

ATMOSPHERE LINES — hand-drawn WHITE chalk lines drawn ON TOP of the colour, as a light
decorative layer describing moving air. Two or three LONG shallow arcs sweep across the
upper third of the picture, passing over the facade itself and running roughly parallel to
the power lines but clearly different from them — white, soft and chalky against the thin
dark wires. Two or three shorter ones drift low across the street. They are solid where they
begin and thin out into dry chalk flecks; they run the same way and never cross. They must
NOT come out of anyone's mouth, nose, hands or body, must NOT loop or curl into a closed
shape, and must NOT read as smoke, steam or a spirit. They are quiet — never the loudest
thing in the picture.

LIGHT AND COLOUR — bright mid-to-late AFTERNOON DAYLIGHT, unmistakably daytime and airy.
NOT sunset, NOT dusk, NOT night, no lamplight over the street, no long orange shadows, no
orange or amber cast over the whole image, no neon. Soft short shadows under the people and
the scooters. The one warm accent is the light coming out of the open doorway.
Keep the colour clear and alive, not dusty: most colour areas sit around HSL saturation
30–50 with lightness 70–85, and roughly half the picture is genuinely coloured rather than
neutral grey. No sky is visible in this picture, so the colour must come from the building
and the people. At least six clearly different colours must be visible, assigned like this:
muted brick red on the brick panels; warm pale grey on the render; warm reddish-brown on the
wooden doors; deep warm charcoal on the window frames and the narrow metal side doors; cool
pale blue-grey in the window glass; and the people in, respectively, dusty rose, pale butter
yellow, soft powder blue, sage green, muted clay and warm grey — no two of them in the same
hue. The potted plants bring in several greens.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat at the entrance,
the small plaque beside the door, one plant pot, and one of the crates. Do NOT tint the
whole image green, no bright emerald, no green skin or green road.

THE PLAQUE — the small rectangular plaque on the wall beside the entrance is COMPLETELY
BLANK: a plain panel with no letters, no numbers, no symbols and no logo.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos, shop
signs, banners, posters, stickers, captions or watermarks, in any language. The plaque
beside the door is blank; any signboard, awning or shutter is blank; scooters and bicycles
carry NO number plates and no badges; the crates, bags, packaging and the paper bag are
blank; the schoolbags carry no printing; there are no street signs, no house numbers, no
notices taped to the wall, no menu boards. Where writing would normally appear, leave the
surface plain.

AVOID — greyscale or a single-colour image; photorealism or a 3D render; thick uniform
black outlines; flat untextured vector shapes; faceless people, noodle limbs, oversized
heads or exaggerated cartoon proportions; anyone looking at the viewer; a large backlit
figure or silhouette in the foreground; a crowd, a queue, a market with stalls, or more
people than the ones listed; a complete third floor, a roofline, a parapet, a rooftop water
tank or sky above the building; feet, wheels or plant pots cut off by the bottom edge;
anybody in medical uniform, masks, gloves, or any dental instrument, tooth model, giant
tooth or medical diagram anywhere in the picture; blood, pain, illness or distress; sunset,
night, neon, heavy shadow; rain; a Western or European street; wrinkles and heavy facial
shading; smoke, steam or spirit-like lines; text of any kind.
```

### 落選的兩條路（留著，不要重走）

| | 為什麼不走 |
| --- | --- |
| **完整畫出三層** | 三層塞進 16:9，一二樓與街道全部被壓扁，人物明顯變小；而且最上面那層正好落在電腦版看不到的 16% 裡。**要完整的三層立面，那是另一張圖**（例如網站頁首或名片），不是這張橫幅 |
| **維持兩層（照照片的取景）** | 使用者已經指出房子是三層，畫成兩層等於畫錯一棟房子 |

### 第四節的檢查清單多兩項

9. **上緣**：第三層是不是只露一條、有沒有自己長出屋頂或水塔、有沒有留天空。
10. **下緣**：把圖的下面 16% 蓋起來看 —— 有沒有人被切到腳、機車有沒有被腰斬。
