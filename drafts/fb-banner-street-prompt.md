# Facebook 粉絲專頁橫幅：永樂街街景插畫（提示詞）

> ⚠ **目前要用的是第十節那一份（第五輪）**。第三／七／八／九節是第一到四輪，留著看改了什麼。

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
| **`drafts/facade-side-ref.jpg`**（1600×1384，側拍） | **第三層的依據**（正面拍不到） | 三層樓＋頂上一層鋼構斜屋頂；**三樓的立面和二樓一模一樣**；整排是連棟，隔壁單元重複同一套立面 |
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


---

## 八、第三輪（2026-08-20）—— 三樓確認、騎士不准被切、加漫畫式的動感與聲音

使用者看過第二輪的說明之後給了三件：

### 1. 三樓：立面和二樓**一模一樣**（已確認，有側拍照）

使用者：「3 層因為平常拍不到，所以只有從別的角度側拍，不過它的立面跟第二層是一模一樣的。」
側拍照存成 `drafts/facade-side-ref.jpg`。看得到的三件：**三層樓**、
**頂上還有一層鋼構的斜屋頂與外露的鋼樑**、**整排是連棟**（隔壁單元重複同一套立面）。

**做法不變**（第七節那條理由仍然成立）：**三樓只露下緣一條、被畫面上緣切掉。**
差別是現在可以寫死它長什麼樣 —— 和二樓同一套：紅磚嵌在混凝土柱樑之間、深色鋁窗。
⚠ **鋼構屋頂不畫**，它在畫面外；畫了就會冒出屋頂線、水塔那些第七節已經擋掉的東西。

> 要完整的三層＋鋼構屋頂，那是另一張圖（直式、或網站頁首那種用途），不是這張橫幅。

### 2. ⚠ 騎機車那個人不准被切到

使用者：「那個人我希望⋯⋯比如說騎機車那個不要被切到。」
第二輪已經把他改成中景並要求整台在中間帶裡，第三輪再寫死一句：
**整個人與整台車（含兩個輪子）都要完整畫出來，離下緣還有一段距離。**

### 3. ⚠⚠ 白線要開始做事：漫畫式的動感與聲音

使用者：「用前面那個白色⋯⋯其他圖片出現的那個白色手繪線條，你創造一點動感，
比如說兩個人在聊天，你就可以〔畫成〕他們聊很開心的樣子，或是有點聲音那個感覺，
就是一般漫畫常用的手法那樣子⋯⋯像這個畫面比較繽紛熱鬧、會有點聲音的感覺。」

第一、二輪的白線只有「橫過上方的氛圍線」，畫面因此是安靜的。第三輪多一整段
`MOTION AND SOUND`，把同一支白線用在六個定點（聊天的兩位、機車後面的速度線、
兩個女學生、小孩的腳步、狗尾巴、門口那道光），並且**逐項擋掉會壞掉的用法**：

- **不要對話框、不要思考泡泡、不要狀聲字** —— 有框就會長出亂碼中文／英文（第七節第 4 條）。
- **不要放射狀的大爆炸線**（漫畫的「集中線」）—— 它會把整張圖變成漫畫分鏡，
  而這一站的插畫是編輯式插畫，不是漫畫。
- **不要從嘴巴或鼻子長出來**（第十之六節）—— 聲音的記號**浮在頭旁邊的空氣裡**，
  不接觸身體，每一筆都不超過半顆頭。

⚠ 順帶把「繽紛」補上：第一、二輪的色數其實夠，但**彩度高的東西全是小面積**
（衣服）。第三輪指定幾件**本來就該有顏色的台灣街道道具**：
最左邊鄰居門口的條紋塑膠遮陽棚、紅／藍／綠的塑膠籃、幾盆會開花的盆栽、
停著那台機車上的彩色安全帽。**這些都在原始照片的取景之外**（左緣鄰居那一側），
所以不會動到診所自己的立面。

### 提示詞（第三輪完整版，直接複製）

⚠ 餵三張：`facade-yongle-ref.jpg`（正面立面）、`facade-side-ref.jpg`（三樓）、
**第一輪那張圖**（風格與人物：「維持這個畫風與這些人，只改取景與加動感」）。

```
Editorial illustration for a wide banner, 16:9 landscape. A lively neighbourhood street in
front of a real building. THE BUILDING IS GIVEN IN THE ATTACHED PHOTOGRAPHS and must be
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

THE BUILDING — copy the attached photograph of the frontage: a Taiwanese street building
seen almost straight on, flat elevation, no dramatic wide-angle perspective.
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
    the bottom;
  • this is a terraced row: the same facade repeats in the neighbouring units and runs off
    both edges of the picture.
THE BUILDING IS THREE STOREYS TALL, and the third floor is IDENTICAL to the second — the
same red brick panels between the same concrete columns, the same dark aluminium windows.
In this picture the THIRD FLOOR IS CUT OFF BY THE TOP EDGE OF THE FRAME: along the very top
of the image we see only the deep concrete beam beneath it and the lowest strip of that
identical wall — the bottom edge of its brick panels and the bottom rail of its windows —
so it is obvious that the building carries on upward beyond the picture. Do NOT draw a
roofline, a parapet, a steel roof canopy, a water tank or a complete third floor. Do NOT
leave sky above the building: the facade fills the entire top edge of the image. Keep this
third-floor strip shallow — no more than one seventh of the image height.
THREE thin dark power lines cross the picture horizontally IN FRONT of the facade, sagging
slightly, exactly as they do in the photograph.
Keep the proportions and the rhythm of the doors and windows as in the photograph; simplify
the detail but do NOT invent extra shopfronts or a different building.

COMPOSITION — the wooden double door sits SLIGHTLY RIGHT OF CENTRE. This banner will be
cropped along the top and the bottom — only the middle two thirds of the height is certain
to be seen — so build it in bands:
  • the TOP SEVENTH holds the cut-off third floor and the power lines, and nothing else
    that matters;
  • the middle holds everything important: the open door with its warm light, every face,
    the whole of every person;
  • THE PAVEMENT LINE THE PEOPLE STAND ON SITS AT ABOUT FOUR FIFTHS OF THE IMAGE HEIGHT.
    Every person, plant pot, scooter, bicycle, stool and the dog stands entirely ABOVE that
    line. NOTHING is cut by the bottom edge — no feet, no wheels, no tails, no pots;
  • the BOTTOM SIXTH is plain asphalt road with only soft shadows on it;
  • the LOWER LEFT CORNER, about one sixth of the width, stays quiet: plain pavement and
    road with nothing important in it.

STREET LIFE — the street is busy, colourful and cheerful, but easy to read. Draw EXACTLY
these people and nothing more, all East Asian (Taiwanese), black or dark brown hair, all in
different clothing colours:
  • just right of the open door, a mother of about 35 holding the hand of a five-year-old
    boy, both stepping in through the doorway, seen three-quarters from behind; the boy
    looks up at her and she looks down at him;
  • a man of about 70 and a woman of about 65 standing a few steps to the left of the
    entrance, in the middle of a HAPPY conversation: both are plainly enjoying it, mouths
    open in easy laughter, eyes crinkled, one of her hands raised in a small gesture as she
    talks, his head tipped back a little as he laughs. She holds a cloth bag with spring
    onions and a radish sticking out of it; he keeps one hand on the handlebar of a parked
    bicycle;
  • two schoolgirls of about twelve with backpacks walking briskly along the pavement
    towards the right, one of them wheeling a bicycle, both talking and smiling;
  • a woman of about 28 walking away from the entrance towards the left, a small paper bag
    in one hand, her face calm and softly smiling;
  • a man of about 45 riding a scooter slowly along the road from left to right, placed in
    the MIDDLE DISTANCE towards the left and drawn small, seen from behind and slightly to
    the side. HE MUST BE DRAWN COMPLETE: his whole body and the whole scooter including
    both wheels are fully inside the picture, clear of the bottom edge with room to spare.
    He is never cropped, never cut in half, never hidden behind anything;
  • a shopkeeper of about 50 at the far left edge, half cut off by the frame, bending to
    water a row of potted plants outside her own doorway;
  • a small short-haired dog sitting on the pavement near the bicycles, tail wagging.
Nobody looks at the viewer. Nobody is a dark silhouette. Nobody is mocking or arguing. NO
figure is taller than half the height of the image; the nearest people reach about half, the
ones further down the street are clearly smaller and drawn with fewer lines and lighter
colour. Keep the men and women roughly balanced in number.

PROPS along the street: at the far left, over the neighbour's doorway, a STRIPED plastic
awning in green and cream; two parked scooters angled to the kerb on the left, one with a
brightly coloured helmet hooked on its mirror; one bicycle leaning by the wall; seven or
eight potted plants of different sizes by the doorways, two or three of them FLOWERING in
warm pink and orange; a small folding stool; a rolled hose; a stack of plastic crates in
red, blue and green. They sit on the pavement above the pavement line, never cover a face,
and are never cut by the bottom edge.

MOOD — an ordinary weekday afternoon in a small town where people know each other. Warm,
busy, unhurried, neighbourly, and just a little noisy in a good way. This is a clinic that
has been on this street for a long time.

MOTION AND SOUND — this is what makes the picture feel alive, and it is drawn ENTIRELY in
the same WHITE chalky hand-drawn line, sitting on top of the colour: the light shorthand a
comic uses to show movement and cheerful noise. Place it at exactly these six points and
nowhere else:
  • beside the heads of the laughing elderly couple, floating in the air BETWEEN them: a
    small cluster of short radiating strokes and two or three tiny curved ticks — the
    ordinary comic sign for happy chatter;
  • behind the moving scooter: three or four short straight parallel speed lines, all the
    same length, trailing horizontally;
  • behind the two schoolgirls: two short curved motion lines at shoulder height;
  • at the boy's stepping foot: one or two tiny arcs of movement;
  • at the dog's tail: two small arcs showing it wagging;
  • around the open doorway: a few short strokes radiating outward from the warm light.
Every one of these marks is small, thin, dry-chalk white and quiet; none is longer than one
head width; together they occupy only a tiny fraction of the picture. They float in the air
and NEVER touch or come out of anyone's mouth, nose, hands or body.
NO speech balloons, NO thought bubbles, NO written sound effects or onomatopoeia, NO
letters or symbols of any kind, NO stars, hearts, musical notes or exclamation marks, and NO
large radiating "impact" burst filling the picture. This is an editorial illustration
borrowing a little comic shorthand — it must not turn into a comic panel.

ATMOSPHERE LINES — separately from those marks, two or three LONG shallow white arcs sweep
across the upper third of the picture, passing over the facade itself and running roughly
parallel to the power lines but clearly different from them — white, soft and chalky against
the thin dark wires. They are solid where they begin and thin out into dry chalk flecks; they
run the same way and never cross, never loop, never close into a shape, and never read as
smoke, steam or a spirit.

LIGHT AND COLOUR — bright mid-to-late AFTERNOON DAYLIGHT, unmistakably daytime and airy.
NOT sunset, NOT dusk, NOT night, no lamplight over the street, no long orange shadows, no
orange or amber cast over the whole image, no neon. Soft short shadows under the people and
the scooters. The one warm accent is the light coming out of the open doorway.
The picture should feel COLOURFUL and lively, not dusty: most colour areas sit around HSL
saturation 30–50 with lightness 70–85, and clearly more than half of the picture is
genuinely coloured rather than neutral grey. No sky is visible here, so the colour has to
come from the building, the people and the street clutter. At least EIGHT clearly different
colours must be visible, assigned like this: muted brick red on the brick panels; warm pale
grey on the render; warm reddish-brown on the wooden doors; deep warm charcoal on the window
frames and the narrow metal side doors; cool pale blue-grey in the window glass; green and
cream stripes on the neighbour's awning; red, blue and green on the plastic crates; warm
pink and orange on the flowering plants; and the people in dusty rose, pale butter yellow,
soft powder blue, sage green, muted clay and warm grey — no two of them in the same hue.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat at the entrance,
the small plaque beside the door, and one plant pot. Do NOT tint the whole image green, no
bright emerald, no green skin or green road.

THE PLAQUE — the small rectangular plaque on the wall beside the entrance is COMPLETELY
BLANK: a plain panel with no letters, no numbers, no symbols and no logo.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos, shop
signs, banners, posters, stickers, captions, sound effects or watermarks, in any language.
The plaque beside the door is blank; the awning and any signboard or shutter is blank;
scooters and bicycles carry NO number plates and no badges; the crates, bags, packaging and
the paper bag are blank; the schoolbags carry no printing; there are no street signs, no
house numbers, no notices taped to the wall, no menu boards. Where writing would normally
appear, leave the surface plain.

AVOID — greyscale or a single-colour image; photorealism or a 3D render; thick uniform
black outlines; flat untextured vector shapes; faceless people, noodle limbs, oversized
heads or exaggerated cartoon proportions; anyone looking at the viewer; a large backlit
figure or silhouette in the foreground; a crowd, a queue, a market with stalls, or more
people than the ones listed; a complete third floor, a roofline, a parapet, a steel roof
canopy, a rooftop water tank or sky above the building; the scooter rider cropped, cut off
or partly out of frame; feet, wheels or plant pots cut off by the bottom edge; speech
balloons, thought bubbles, written sound effects, stars, hearts or impact bursts; comic
panel borders; anybody in medical uniform, masks, gloves, or any dental instrument, tooth
model, giant tooth or medical diagram anywhere in the picture; blood, pain, illness or
distress; sunset, night, neon, heavy shadow; rain; a Western or European street; wrinkles
and heavy facial shading; smoke, steam or spirit-like lines; text of any kind.
```

### 第四節的檢查清單再多兩項

11. **騎士**：整個人與整台車在不在畫面裡、離下緣夠不夠遠。
12. **白線**：有沒有變成對話框／狀聲字／集中線；有沒有從嘴巴長出來；
    是不是仍然「小、細、安靜」——它是重音，不是主角。


---

## 九、第四輪（2026-08-20）—— 拿掉電線、騎士貼在牆上、白線再豐富

第三輪的圖使用者三件回饋，另外我自己量到兩件。

### 1. ⚠⚠ 騎機車那位「變得很小、跑到牆壁上」

使用者：「騎機車的人變得很小，然後跑到牆壁上，好好笑，怎麼變這樣。」

**成因是我自己寫的**：第二輪為了讓他不被下緣切掉，把他改成
`in the MIDDLE DISTANCE towards the left and drawn small`。可是這張是**正面平立面**，
**畫面裡根本沒有「遠方」可以放他** —— 街道沒有往裡面延伸的透視，唯一的「深處」就是牆。
模型只好把他縮小貼在立面上。

**改法：不要用「遠近」解決構圖問題，用「站的位置」。** 他回到**前景的路面上**、
**和人行道上的人同一個大小**，輪子踩在柏油上、離下緣還有一段。
⚠ 這一條是 ILLUSTRATION.md 第八節第 5 條那個教訓的近親：
**指定不了的東西就換一種指定方式** —— 那次是左右手改成「靠近觀者那一邊」，
這次是遠近改成「腳踩在哪」。

### 2. 電線拿掉（使用者決定）

使用者：「圖上有兩條黑色，那些是電線，那乾脆就不需要電線了。」
第二輪把電線從天空移到立面前面，是因為天空沒有了、電線在照片上本來就橫過立面。
既然拿掉，那條位置就整條讓給白線。

### 3. ⚠ 白線要再豐富一點

使用者：「黑線旁邊應該有白線、那個動感氛圍的樣子，那個白線可以再豐富一點試試看。」
第三輪的白線只有兩三條長弧＋六個小記號，份量偏輕。第四輪拆成**兩層**並各自加量：

| 層 | 第三輪 | 第四輪 |
| --- | --- | --- |
| 氛圍（長弧） | 2~3 條，只在上三分之一 | **5~7 條**，分三個高度（第三層那條帶、二樓、人的頭上），長短粗細各不同，可以斷成虛線 |
| 動感與聲音（小記號） | 六個定點 | **九個定點**（多了澆花的水、腳踏車輪、機車騎士身後的氣流） |

⚠ **兩層的規則不同，不要混在一起寫**（第十之六節）：長弧可以掃過整個畫面，
但**不能從人身上長出來**；從人身上或物件上出來的（水、輪子、氣流）一律是**一群同向的短線**。
⚠ **豐富 ≠ 變重**：線還是細的、白堊質、可以飛白，禁止項一條都沒有放寬
（不要對話框、不要狀聲字、不要集中線爆點、不要星星愛心）。

### 4. ⚠ 中間多了一扇關著的木門（我量到的，使用者沒提）

真實的房子**只有一扇木門**，其餘是深色的金屬窄門。第三輪的圖在中央多畫了一扇關著的木門、
右邊又一扇開著的 —— 等於把診所的門畫成兩個入口。第四輪寫死：**整張圖只有一扇木門，
而且就是開著的那一扇**。

### 5. ⚠⚠ 腳還是被切掉（第三輪也沒過）

實測第三輪那張：地面線在畫面高度 **86%**，電腦版只留到 84% —— 又是一整排沒有腳的人。
第二、三輪寫的是「地面線在五分之四、底下六分之一留白」，模型兩次都把畫面塞滿。
第四輪改成**用命令句寫成一件「刻意留白」的事**，並把數字放寬到 **78%／底下五分之一**。

> **如果第四輪還是塞滿**：不必再重生成 —— 那條柏油是一片平的灰，
> 我可以直接把它接長（複製最底下幾列往下延伸），等於把整排人往上抬。
> 這是後製，不是重畫，十秒鐘的事。

### 提示詞（第四輪完整版，直接複製）

⚠ 餵三張：`facade-yongle-ref.jpg`（正面立面）、`facade-side-ref.jpg`（三樓）、
**第三輪那張圖**（風格、人物與配色都已經對了：「維持這個畫風、這些人與這組顏色，
只改下面指出的幾件」）。

```
Editorial illustration for a wide banner, 16:9 landscape. A lively neighbourhood street in
front of a real building. THE BUILDING IS GIVEN IN THE ATTACHED PHOTOGRAPHS and must be
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

THE BUILDING — copy the attached photograph of the frontage: a Taiwanese street building
seen almost straight on, flat elevation, no dramatic wide-angle perspective.
  • ground floor: pale warm grey terrazzo / granite-chip render, with a slightly darker
    plinth along the bottom and dark-framed square windows;
  • second floor: panels of muted red brick set between pale grey concrete columns and a
    deep beam, dark aluminium sliding windows, and one smaller window directly above the
    entrance;
  • THE ENTRANCE APPEARS ONLY ONCE IN THE WHOLE PICTURE: a single pair of tall doors in
    warm reddish-brown wood with slim dark frames, standing OPEN, with soft warm light
    spilling out onto the pavement. There is NO second wooden door anywhere — every other
    doorway along the row is a narrow DARK METAL door;
  • a boxy water heater and meter boxes on the left-hand wall, two round electricity meters
    on the wall to the right of the entrance;
  • a concrete pavement with a low kerb and one square drain grate, and asphalt road along
    the bottom;
  • this is a terraced row: the same facade repeats in the neighbouring units and runs off
    both edges of the picture.
THE BUILDING IS THREE STOREYS TALL, and the third floor is IDENTICAL to the second — the
same red brick panels between the same concrete columns, the same dark aluminium windows.
In this picture the THIRD FLOOR IS CUT OFF BY THE TOP EDGE OF THE FRAME: along the very top
we see only the deep concrete beam beneath it and the lowest strip of that identical wall,
so it is obvious the building carries on upward beyond the picture. Do NOT draw a roofline,
a parapet, a steel roof canopy, a water tank or a complete third floor, and do NOT leave sky
above the building: the facade fills the entire top edge.
THERE ARE NO POWER LINES, NO CABLES AND NO WIRES ANYWHERE IN THIS PICTURE — not across the
top, not in front of the facade, not between the buildings. The only lines crossing the air
are the white hand-drawn ones described below.
Keep the proportions and the rhythm of the doors and windows as in the photograph; simplify
the detail but do NOT invent extra shopfronts or a different building.

COMPOSITION — the open wooden doorway sits SLIGHTLY RIGHT OF CENTRE. This banner will be
cropped along the top and the bottom, so:
  • the TOP SEVENTH holds the cut-off third floor and nothing else that matters;
  • the middle holds everything important: the open door, every face, the whole of every
    person and every vehicle;
  • THE LOWEST FIFTH OF THE IMAGE IS EMPTY ASPHALT ROAD. Nothing stands in it: no people,
    no shoes, no wheels, no pots, no dog — only road surface and soft shadows. THIS EMPTY
    BAND IS DELIBERATE; do not fill it, do not extend the pavement into it, and do not
    enlarge the figures until they reach it. The ground the people stand on sits at about
    78% of the image height, and every shoe, wheel, pot and tail is ABOVE that line;
  • the LOWER LEFT CORNER, about one sixth of the width, stays quiet: plain pavement and
    road with nothing important in it.

STREET LIFE — the street is busy, colourful and cheerful, but easy to read. Draw EXACTLY
these people and nothing more, all East Asian (Taiwanese), black or dark brown hair, all in
different clothing colours:
  • a man of about 45 RIDING A SCOOTER along the road, moving from left to right, placed in
    the NEAR FOREGROUND on the road surface just below the kerb, roughly a third of the way
    in from the left. He is drawn at THE SAME SCALE as the people standing on the pavement —
    his head reaches about the same height as theirs — and he and the whole scooter,
    including both wheels, are completely inside the picture, with the wheels sitting on the
    road ABOVE the empty bottom band. He is seen from behind and slightly to the side. He is
    NEVER small, NEVER drawn on or against the building wall, NEVER floating in the air, and
    NEVER cropped;
  • just right of the open door, a mother of about 35 holding the hand of a five-year-old
    boy, both stepping in through the doorway, seen three-quarters from behind; the boy
    looks up at her and she looks down at him;
  • a man of about 70 and a woman of about 65 standing a few steps to the left of the
    entrance, in the middle of a HAPPY conversation: both plainly enjoying it, mouths open
    in easy laughter, eyes crinkled, one of her hands raised in a small gesture as she
    talks, his head tipped back a little as he laughs. She holds a cloth bag with spring
    onions and a radish sticking out of it; he keeps one hand on the handlebar of a parked
    bicycle;
  • two schoolgirls of about twelve with backpacks walking briskly along the pavement
    towards the right, one of them wheeling a bicycle, both talking and smiling;
  • a woman of about 28 walking away from the entrance towards the left, a small paper bag
    in one hand, her face calm and softly smiling;
  • at the right-hand side, a young mother walking hand in hand with a toddler, the two of
    them heading towards the doorway;
  • a shopkeeper of about 50 at the far left edge, half cut off by the frame, bending to
    water a row of potted plants outside her own doorway;
  • a small short-haired dog sitting on the pavement near the bicycles, tail wagging.
Nobody looks at the viewer. Nobody is a dark silhouette. Nobody is mocking or arguing. NO
figure is taller than half the height of the image. Keep the men and women roughly balanced.

PROPS along the street: at the far left, over the neighbour's doorway, a STRIPED plastic
awning in green and cream; two parked scooters angled to the kerb at the left edge, one with
a brightly coloured helmet hooked on its mirror — helmets hang on those scooters and nowhere
else; one bicycle leaning by the wall; seven or eight potted plants of different sizes by the
doorways, two or three of them FLOWERING in warm pink and orange; a small folding stool; a
rolled hose; a stack of plastic crates in red, blue and green. They all sit on the pavement
above the ground line, never cover a face, and never enter the empty bottom band.

MOOD — an ordinary weekday afternoon in a small town where people know each other. Warm,
busy, unhurried, neighbourly, and just a little noisy in a good way. This is a clinic that
has been on this street for a long time.

WHITE HAND-DRAWN LINES — these are the life of the picture and there should be PLENTY of
them. All of them are drawn in the same white chalky hand-drawn line, sitting on top of the
colour, solid where they begin and thinning into dry chalk flecks. They come in TWO KINDS
and the two follow different rules.
(A) LONG ATMOSPHERE ARCS — FIVE TO SEVEN long shallow arcs of moving air sweeping right
across the picture at three different heights: two or three high up across the third-floor
strip, two across the second floor, and one or two lower down passing over the heads of the
people. They vary in length and weight — some run almost the full width, some are short,
some break into a dashed run of flecks. They all travel the same general direction, they
never cross each other, never loop, never close into a shape, and never read as smoke, steam
or a spirit. These arcs replace the power lines that used to cross the picture.
(B) SMALL MOTION AND SOUND MARKS — the light shorthand a comic uses for movement and
cheerful noise, placed at exactly these nine points:
  • floating in the air BETWEEN the heads of the laughing elderly couple: a small cluster of
    short radiating strokes and two or three tiny curved ticks;
  • behind the moving scooter: four or five short straight parallel speed lines trailing
    horizontally;
  • a few short curved strokes fanning off the rider's shoulders to show the air he moves
    through — short, all running the same way, none longer than his head;
  • behind the two schoolgirls: two short curved motion lines at shoulder height;
  • at the spokes of the wheeled bicycle: three tiny arcs showing it turning;
  • at the boy's stepping foot: one or two tiny arcs of movement;
  • at the dog's tail: two small arcs showing it wagging;
  • from the shopkeeper's watering can: a short group of parallel strokes for the falling
    water;
  • around the open doorway: a few short strokes radiating outward from the warm light.
Every mark in group (B) is small and thin, none longer than one head width, and none of them
touches or comes out of anyone's mouth or nose.
NO speech balloons, NO thought bubbles, NO written sound effects or onomatopoeia, NO letters
or symbols, NO stars, hearts, musical notes or exclamation marks, and NO large radiating
"impact" burst. This is an editorial illustration borrowing a little comic shorthand — it
must not turn into a comic panel.

LIGHT AND COLOUR — bright mid-to-late AFTERNOON DAYLIGHT, unmistakably daytime and airy.
NOT sunset, NOT dusk, NOT night, no lamplight over the street, no long orange shadows, no
orange or amber cast over the whole image, no neon. Soft short shadows under the people and
the scooters. The one warm accent is the light coming out of the open doorway.
The picture should feel COLOURFUL and lively, not dusty: most colour areas sit around HSL
saturation 30–50 with lightness 70–85, and clearly more than half of the picture is
genuinely coloured rather than neutral grey. No sky is visible here, so the colour has to
come from the building, the people and the street clutter. At least EIGHT clearly different
colours must be visible: muted brick red on the brick panels; warm pale grey on the render;
warm reddish-brown on the wooden doors; deep warm charcoal on the window frames and the
narrow metal side doors; cool pale blue-grey in the window glass; green and cream stripes on
the awning; red, blue and green on the plastic crates; warm pink and orange on the flowering
plants; and the people in dusty rose, pale butter yellow, soft powder blue, sage green,
muted clay and warm grey — no two of them in the same hue.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat at the entrance,
the small plaque beside the door, and one plant pot. Do NOT tint the whole image green, no
bright emerald, no green skin or green road.

THE PLAQUE — the small rectangular plaque on the wall beside the entrance is COMPLETELY
BLANK: a plain panel with no letters, no numbers, no symbols and no logo.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos, shop
signs, banners, posters, stickers, captions, sound effects or watermarks, in any language.
The plaque beside the door is blank; the awning and any signboard or shutter is blank;
scooters and bicycles carry NO number plates and no badges; the crates, bags, packaging and
the paper bag are blank; the schoolbags carry no printing; there are no street signs, no
house numbers, no notices taped to the wall, no menu boards. Where writing would normally
appear, leave the surface plain.

AVOID — power lines, cables, wires or utility poles of any kind; a second wooden door or
more than one entrance; the scooter rider drawn small, drawn against or on top of the
building wall, floating, or cut off by the frame; anything standing in the empty bottom band
of road; feet, wheels or plant pots cut off by the bottom edge; greyscale or a single-colour
image; photorealism or a 3D render; thick uniform black outlines; flat untextured vector
shapes; faceless people, noodle limbs, oversized heads or exaggerated cartoon proportions;
anyone looking at the viewer; a large backlit figure or silhouette; a crowd, a queue, a
market with stalls, or more people than the ones listed; a complete third floor, a roofline,
a parapet, a steel roof canopy, a rooftop water tank or sky above the building; speech
balloons, thought bubbles, written sound effects, stars, hearts or impact bursts; comic panel
borders; anybody in medical uniform, masks, gloves, or any dental instrument, tooth model,
giant tooth or medical diagram; blood, pain, illness or distress; sunset, night, neon, heavy
shadow; rain; a Western or European street; wrinkles and heavy facial shading; smoke, steam
or spirit-like lines; text of any kind.
```

### 第四節的檢查清單再多三項

13. **電線**：有沒有殘留任何黑色的線、電線桿。
14. **木門**：整張圖是不是只有一扇，而且是開著的那一扇。
15. **騎士**：大小和人行道上的人差不多嗎、輪子在不在柏油上、有沒有貼在牆上。


---

## 十、第五輪（2026-08-20）—— 把診所的人放進街上

第四輪使用者說「這樣好多了」，剩兩件。

### 1. ⚠ 這是**診所**的粉專，街上卻沒有診所的人

使用者：「因為是診所的粉絲專頁，所以好像缺乏一些診所的人⋯⋯可以把醫師或助理這些
診所人員也放進這個街景裡面，讓他們跟其他人或彼此之間自在地走路、站著聊天什麼的。
這些醫師都穿刷手服，可以有一兩位是刷手服外面披著白色長袍。
刷手服顏色也可以都不一樣，像裡面現在有淡綠色、淡紅色，可以再放個淡藍色、淡黃色。」

**定案四位**（照他點名的四個顏色，剛好一色一人）：

| | 誰 | 刷手服 | 白袍 | 在做什麼 |
| --- | --- | --- | --- | --- |
| 1 | 女醫師約 40、鮑伯頭 | **淡藍 `#b7c6d7`** | **有**（敞開） | 站在開著的門邊，側身和那對老夫妻一起笑 |
| 2 | 男醫師約 35 | **淡綠 `#b7d7c0`** | **有**（敞開） | 從右邊沿人行道走回來，手上一杯飲料，和助理邊走邊講 |
| 3 | 助理約 28 | **淡黃 `#d7d2b7`** | 無 | 走在醫師 2 旁邊，笑著 |
| 4 | 助理約 30 | **淡玫瑰 `#d7b7b7`** | 無 | 蹲在中間偏左摸那隻狗 |

⚠⚠ **顏色不是憑感覺挑的，是照 ILLUSTRATION.md 第十之三節那個方法算的**：
量到站上刷手服的錨點是 **HSL(105, 29%, 78%)**（`#bfd7b7`，一般牙科）與
**HSL(0, 29%, 78%)**（`#d7b7b7`，顯微根管），所以**明度與彩度固定、只把色相移到各科的套色上**：

| 色相來源 | H | 刷手服 | 陰影（S 18%／L 66%） |
| --- | --- | --- | --- |
| 一般牙科 `#3f654a` | 137 | `#b7d7c0` | `#99b8a2` |
| 顯微根管 `#ae4f4d` | 1 | `#d7b7b7` | `#b89999` |
| 齒顎矯正 `#4478b5` | 212 | `#b7c6d7` | `#99a7b8` |
| 牙周治療 `#317d78` | 176 | `#b7d7d5` | `#99b8b6` |
| 口腔外科 `#8e6299` | 288 | `#d1b7d7` | `#b299b8` |

⚠ **淡黃是唯一一個不直接取科別色相的**：兒牙的琥珀 `#c28229` 色相只有 35，
拉成刷手服會變米沙色（`#d7cab7`）看不出是黃，所以推到 **H 50**（`#d7d2b7`）。
這不是新增品牌色，是同一族的刷手服色。

⚠ 這一輪必須把上一版 `AVOID` 裡那句 **`anybody in medical uniform`** 拿掉
（那是第一輪為了擋「診間場景」寫的，現在正好相反）。改成擋**口罩、手套、
手上拿器械、名牌上有字、一整排站著給人拍照**。

⚠ **四位分開站，不要排成一排**，而且**十五個人裡只有四個是診所的人** ——
這張是街景，不是員工合照。

### 2. ⚠ 騎士的輪子還是掉在裁切線下面

第四輪騎士回到路面上了、大小也對了（這一項成功），但實測他的**輪子在畫面高度 93%**，
電腦版只留到 84% —— 切出來他從膝蓋以下不見。第五輪把數字寫死：
**輪子在 82% 左右，就在人行道緣石下面一點，不要貼著畫面最底下。**

### 提示詞（第五輪完整版，直接複製）

⚠ 餵三張：`facade-yongle-ref.jpg`、`facade-side-ref.jpg`、**第四輪那張圖**
（「畫風、人物、顏色與街道都對了，只改下面指出的兩件」）。

```
Editorial illustration for a wide banner, 16:9 landscape. A lively neighbourhood street in
front of a real building — the street outside a small family dental clinic. THE BUILDING IS
GIVEN IN THE ATTACHED PHOTOGRAPHS and must be followed closely; everything else — the
people, the street life, the light — is invented around it.

STYLE — READ THIS SECTION FIRST, IT MATTERS MORE THAN ANYTHING ELSE BELOW.
Contemporary printed-magazine editorial illustration, clearly hand-drawn — never a
photograph, never 3D, never a flat vector graphic. Linework in warm dark brown or soft
charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies along each stroke,
strokes taper and sometimes break. Colour applied like soft coloured pencil and light
marker; flat fills with two or three tones per hue; no smooth decorative gradients — a
gradient may only ever describe light. A fine even paper grain sits over every surface of
the whole image. No wall, awning, garment or road is a flat single-tone shape: each carries
visible pencil texture and two or three tones of its own colour.
FACES ARE THE ONE EXCEPTION to the two-or-three-tones rule: skin is a single flat tone with
NO shading, NO wrinkles, NO nasolabial lines, NO cheekbone or jaw modelling. On each face
draw only six things — the outline of the head, the eyes, the eyebrows, a small nose, a
simple line mouth, the ears. Everyone looks their own age and nobody looks old or tired.

THE BUILDING — copy the attached photograph of the frontage: a Taiwanese street building
seen almost straight on, flat elevation, no dramatic wide-angle perspective.
  • ground floor: pale warm grey terrazzo / granite-chip render, with a slightly darker
    plinth along the bottom and dark-framed square windows;
  • second floor: panels of muted red brick set between pale grey concrete columns and a
    deep beam, dark aluminium sliding windows, and one smaller window directly above the
    entrance;
  • THE ENTRANCE APPEARS ONLY ONCE IN THE WHOLE PICTURE: a single pair of tall doors in
    warm reddish-brown wood with slim dark frames, standing OPEN, with soft warm light
    spilling out onto the pavement. There is NO second wooden door anywhere — every other
    doorway along the row is a narrow DARK METAL door;
  • a boxy water heater and meter boxes on the left-hand wall, two round electricity meters
    on the wall to the right of the entrance;
  • a concrete pavement with a low kerb and one square drain grate, and asphalt road along
    the bottom;
  • this is a terraced row: the same facade repeats in the neighbouring units and runs off
    both edges of the picture.
THE BUILDING IS THREE STOREYS TALL, and the third floor is IDENTICAL to the second — the
same red brick panels between the same concrete columns, the same dark aluminium windows.
In this picture the THIRD FLOOR IS CUT OFF BY THE TOP EDGE OF THE FRAME: along the very top
we see only the deep concrete beam beneath it and the lowest strip of that identical wall,
so it is obvious the building carries on upward beyond the picture. Do NOT draw a roofline,
a parapet, a steel roof canopy, a water tank or a complete third floor, and do NOT leave sky
above the building: the facade fills the entire top edge.
THERE ARE NO POWER LINES, NO CABLES AND NO WIRES ANYWHERE IN THIS PICTURE. The only lines
crossing the air are the white hand-drawn ones described below.

COMPOSITION — the open wooden doorway sits SLIGHTLY RIGHT OF CENTRE. This banner will be
cropped along the top and the bottom, so:
  • the TOP SEVENTH holds the cut-off third floor and nothing else that matters;
  • the middle holds everything important: the open door, every face, the whole of every
    person and every vehicle;
  • THE LOWEST FIFTH OF THE IMAGE IS EMPTY ASPHALT ROAD. Nothing stands in it: no people,
    no shoes, no wheels, no pots, no dog — only road surface and soft shadows. THIS EMPTY
    BAND IS DELIBERATE; do not fill it and do not enlarge the figures until they reach it.
    The pavement the people stand on sits at about 76% of the image height, and the scooter
    rider's wheels — the lowest thing in the whole picture — rest on the road at about 82%,
    just below the kerb. Nothing at all is drawn below that;
  • the LOWER LEFT CORNER, about one sixth of the width, stays quiet.

STREET LIFE — the street is busy, colourful and cheerful, but easy to read. Everyone is East
Asian (Taiwanese) with black or dark brown hair. Draw EXACTLY these people and nobody else.

THE NEIGHBOURS:
  • a man of about 45 RIDING A SCOOTER along the road, moving from left to right, in the
    NEAR FOREGROUND just below the kerb, roughly a third of the way in from the left, drawn
    at THE SAME SCALE as the people on the pavement. He and the whole scooter, including
    both wheels, are completely inside the picture, the wheels resting at about 82% of the
    image height. He is seen from behind and slightly to the side. NEVER small, NEVER drawn
    on or against the building wall, NEVER floating, NEVER cropped;
  • just right of the open door, a mother of about 35 holding the hand of a five-year-old
    boy, both stepping in through the doorway, seen three-quarters from behind;
  • a man of about 70 and a woman of about 65 a few steps to the left of the entrance, in
    the middle of a HAPPY conversation — mouths open in easy laughter, eyes crinkled, one of
    her hands raised as she talks, his head tipped back a little as he laughs. She holds a
    cloth bag with spring onions in it; he keeps a hand on a parked bicycle;
  • two schoolgirls of about twelve with backpacks walking briskly towards the right, one
    wheeling a bicycle, both talking and smiling;
  • a woman of about 28 walking away from the entrance towards the left with a small paper
    bag, calm and softly smiling;
  • at the right-hand side, a young mother walking hand in hand with a toddler towards the
    doorway;
  • a shopkeeper of about 50 at the far left edge, half cut off by the frame, watering potted
    plants outside her own doorway;
  • a small short-haired dog on the pavement near the bicycles, tail wagging.

THE CLINIC PEOPLE — FOUR of the people on this street work at the clinic, and they are part
of the street, not on show: they stand and walk among the neighbours exactly as everyone
else does. They are SPREAD ACROSS THE PICTURE, never grouped into a row, never posed, never
facing the viewer, never in a line-up. They wear SCRUBS — a simple short-sleeved V-neck top
and matching trousers — and TWO of them wear an open, knee-length WHITE COAT over the
scrubs. Nobody wears a mask, nobody wears gloves, nobody carries any instrument.
  • A WOMAN DENTIST of about 40 with a short neat bob, in PALE BLUE scrubs (#b7c6d7, shaded
    with #99a7b8) under an open white coat. She stands just outside the open doorway, turned
    three-quarters away from us, laughing along with the elderly couple's conversation, one
    hand resting on the door frame;
  • A MAN DENTIST of about 35 in PALE GREEN scrubs (#b7d7c0, shaded with #99b8a2) under an
    open white coat, walking back towards the clinic along the pavement from the right, a
    lidded drink cup in one hand, talking to the assistant beside him;
  • A DENTAL ASSISTANT of about 28 in PALE YELLOW scrubs (#d7d2b7, shaded with #b8b399), no
    coat, walking beside him and laughing at what he is saying;
  • A DENTAL ASSISTANT of about 30 in PALE ROSE scrubs (#d7b7b7, shaded with #b89999), no
    coat, crouched down on the pavement left of centre with one hand out to the little dog,
    smiling at it.
The white coats are a soft warm off-white, softly shaded, never glaring white, and completely
PLAIN — no badge, no name tag, no embroidery, no logo, no writing of any kind.
Nobody looks at the viewer. Nobody is a dark silhouette. Nobody is mocking or arguing. NO
figure is taller than half the height of the image. Keep the men and women roughly balanced.

PROPS along the street: at the far left, over the neighbour's doorway, a STRIPED plastic
awning in green and cream; two parked scooters angled to the kerb at the left edge, one with
a brightly coloured helmet hooked on its mirror — helmets hang there and nowhere else; one
bicycle leaning by the wall; seven or eight potted plants of different sizes by the doorways,
two or three FLOWERING in warm pink and orange; a small folding stool; a rolled hose; a stack
of plastic crates in red, blue and green. They all sit on the pavement above the kerb line,
never cover a face, and never enter the empty bottom band.

MOOD — an ordinary weekday afternoon in a small town where people know each other, and the
clinic is simply one of the doors on the street. Warm, busy, unhurried, neighbourly, and
just a little noisy in a good way.

WHITE HAND-DRAWN LINES — these are the life of the picture and there should be PLENTY of
them, all in the same white chalky hand-drawn line sitting on top of the colour, solid where
they begin and thinning into dry chalk flecks. Two kinds, different rules.
(A) LONG ATMOSPHERE ARCS — FIVE TO SEVEN long shallow arcs of moving air sweeping right
across the picture at three different heights: two or three high across the third-floor
strip, two across the second floor, one or two lower down passing over the heads of the
people. They vary in length and weight; some run almost the full width, some are short, some
break into a dashed run of flecks. They travel the same general direction, never cross, never
loop, never close into a shape, and never read as smoke, steam or a spirit.
(B) SMALL MOTION AND SOUND MARKS — the light shorthand a comic uses for movement and
cheerful noise, at exactly these ten points:
  • floating in the air BETWEEN the heads of the laughing elderly couple: a small cluster of
    short radiating strokes and two or three tiny curved ticks;
  • a second, smaller cluster between the walking dentist and the assistant beside him, for
    their easy conversation;
  • behind the moving scooter: four or five short straight parallel speed lines;
  • a few short curved strokes fanning off the rider's shoulders, none longer than his head;
  • behind the two schoolgirls: two short curved motion lines at shoulder height;
  • at the spokes of the wheeled bicycle: three tiny arcs showing it turning;
  • at the boy's stepping foot: one or two tiny arcs of movement;
  • at the dog's tail: two small arcs showing it wagging;
  • from the shopkeeper's watering can: a short group of parallel strokes for the water;
  • around the open doorway: a few short strokes radiating outward from the warm light.
Every mark in group (B) is small and thin, none longer than one head width, and none of them
touches or comes out of anyone's mouth or nose.
NO speech balloons, NO thought bubbles, NO written sound effects or onomatopoeia, NO letters
or symbols, NO stars, hearts, musical notes or exclamation marks, and NO large radiating
"impact" burst. This is an editorial illustration borrowing a little comic shorthand — it
must not turn into a comic panel.

LIGHT AND COLOUR — bright mid-to-late AFTERNOON DAYLIGHT, unmistakably daytime and airy.
NOT sunset, NOT dusk, NOT night, no lamplight over the street, no long orange shadows, no
orange or amber cast over the whole image, no neon. Soft short shadows under the people and
the scooters. The one warm accent is the light coming out of the open doorway.
The picture should feel COLOURFUL and lively, not dusty: most colour areas sit around HSL
saturation 30–50 with lightness 70–85, and clearly more than half of the picture is
genuinely coloured rather than neutral grey. No sky is visible here, so the colour has to
come from the building, the people and the street clutter. At least EIGHT clearly different
colours must be visible: muted brick red on the brick panels; warm pale grey on the render;
warm reddish-brown on the wooden doors; deep warm charcoal on the window frames and the
narrow metal side doors; cool pale blue-grey in the window glass; green and cream stripes on
the awning; red, blue and green on the plastic crates; warm pink and orange on the flowering
plants; the four clinic people in the four pale scrub colours given above, each different;
and the neighbours in dusty rose, pale butter yellow, soft powder blue, sage green, muted
clay and warm grey — no two people side by side in the same hue.
A muted forest green (#3f654a) appears ONLY as small accents: the doormat at the entrance,
the small plaque beside the door, and one plant pot. Do NOT tint the whole image green, no
bright emerald, no green skin or green road.

THE PLAQUE — the small rectangular plaque on the wall beside the entrance is COMPLETELY
BLANK: a plain panel with no letters, no numbers, no symbols and no logo.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos, shop
signs, banners, posters, stickers, captions, sound effects, name badges or watermarks, in any
language. The plaque beside the door is blank; the white coats are blank; the awning and any
signboard or shutter is blank; scooters and bicycles carry NO number plates and no badges;
the crates, bags, drink cups and packaging are blank; the schoolbags carry no printing; there
are no street signs, no house numbers, no notices taped to the wall. Where writing would
normally appear, leave the surface plain.

AVOID — surgical masks, gloves, or any dental instrument, tooth model, giant tooth or medical
diagram anywhere in the picture; clinic staff lined up, posing, facing the viewer or standing
apart from the neighbours as a group; name badges, embroidery or writing on the coats; power
lines, cables, wires or utility poles; a second wooden door or more than one entrance; the
scooter rider drawn small, drawn against the building wall, floating, or cut off by the
frame; anything standing in the empty bottom band of road; feet, wheels or plant pots cut off
by the bottom edge; greyscale or a single-colour image; photorealism or a 3D render; thick
uniform black outlines; flat untextured vector shapes; faceless people, noodle limbs,
oversized heads or exaggerated cartoon proportions; anyone looking at the viewer; a large
backlit figure or silhouette; a crowd, a queue, a market with stalls, or more people than the
ones listed; a complete third floor, a roofline, a parapet, a steel roof canopy, a rooftop
water tank or sky above the building; speech balloons, thought bubbles, written sound
effects, stars, hearts or impact bursts; comic panel borders; blood, pain, illness or
distress; sunset, night, neon, heavy shadow; rain; a Western or European street; wrinkles and
heavy facial shading; smoke, steam or spirit-like lines; text of any kind.
```

### 第四節的檢查清單再多兩項

16. **診所的人**：四位是不是分散在不同位置、有沒有排成一排或面對鏡頭、
    白袍上有沒有長出名牌或字、有沒有戴口罩或手套。
17. **刷手服**：四個顏色是不是都不一樣、有沒有變成飽和的醫療藍綠、
    有沒有和旁邊的鄰居撞色。
