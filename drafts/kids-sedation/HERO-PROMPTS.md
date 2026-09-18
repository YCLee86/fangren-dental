# HERO 提示詞 —— 兒童舒眠治療（2026-09-18，第一版）

## ⛔ 先講狀態

**這個容器出不了圖。** 下面這一份是**完整、可以直接複製貼上**的提示詞（TEAM.md 第 10 號
角色的紅線：不准給片段修改、不准只寫進檔案）。出圖用 Gemini，由使用者在自己那邊跑。

收到圖之後要做的三件：

```bash
node tools/hero-resize.mjs <原檔路徑> kids-sedation-photo   # 出 800／1600／2000
node tools/webp.mjs                                        # 三張的 WebP
# 再把 drafts/kids-sedation/preview-gen.mjs 裡的 HERO 佔位框換成真的 <picture>
```

⚠ **交件前要跑的三個數字還沒跑**（沒有圖）。圖出來的當下先跑，任何一項不過就重跑：

| | 門檻 | 腳本 |
| --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **< 5%** | `node drafts/og-measure.mjs <圖>` |
| 邊緣密度 | **≥ 30%** | `node drafts/og-measure-ink.mjs <圖>` |
| 同一張圖裡每個人的線一樣實 | 各框最暗 5 百分位相差 **< 20 階** | 同上 |

## 這一張要畫什麼（梗）

**不畫療程，畫那一場談話。**

三個理由：

1. **文章的工作就是這個。** 這一篇不是在介紹一個療程，是在幫家長**做一個決定**
   （第 4 節「一次做完，和分成很多次」才是全篇的軸）。畫成「孩子睡著、醫師在治療」
   等於把文章講成了廣告。
2. ⚠⚠ **診所實際做到哪一格還沒問到**（`FACTCHECK.md` 第二節第 1~3 題）。
   畫一個診間裡的鎮靜場面，等於用圖宣稱了一件我們還不知道的事 ——
   圖和文字受同一條紅線管。
3. **和〈同一顆補了又掉〉那一張要長得不一樣。** 那一張是「三格失敗 ＋ 一條寬格」的
   對照結構；這一張是**單一場景**，節奏就分開了（COPY.md 九之十三那條
   「不要照抄上一頁的形狀」的精神）。

**那條刻度放進對話框裡**：同一個孩子的頭像出現四次，從睜著眼到完全放鬆閉眼，
底下一條由淺到深的橫條。用對話框是這一站已經驗證過的做法（〈同一顆補了又掉〉
那兩個裝著牙齒的框），而且它天然地把「這是在講解的內容」和「真實的場面」分開。

⚠ **角色沿用**：兒牙醫師就是〈同一顆補了又掉〉下半格那一位（印花手術帽 ＋ 敞開的白袍），
媽媽 dusty rose、孩子 sage green、爸爸 slate blue —— 同一科的兩篇文章共用一組人，
讀者翻過去會認得。

---

## 完整提示詞（第一版・整份可貼）

```
Editorial illustration for a dental clinic's article, 16:9 landscape. Output at least 2000
pixels wide.

ONE SINGLE SCENE — no panels, no dividing lines, no frame around the image. A quiet corner of
a children's dental clinic where a paediatric dentist is explaining something to two parents.
Nobody is being treated, no instrument is near anybody's mouth, and the treatment chair is
empty and off to one side.

STYLE. Contemporary printed-magazine editorial illustration, hand-made throughout. Linework in
warm dark brown or soft charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies
along a stroke, strokes taper and sometimes break and run dry at the end. Colour applied like
soft coloured pencil and light marker; colour edges a little loose. Flat fills with two or
three tones per hue — no gradients, no airbrush, no glow. A fine even paper grain over every
surface.

FACES AND HANDS. Every face and every hand is ONE single flat tone: no shading, no cheekbones,
no jawline. On a face draw ONLY these six things plus blush: the outline of the head, the eyes,
the eyebrows, the nose, the mouth, the ears — and two soft round patches of warm pink blush
high on each cheek. An eye is one small dark curved mark. NO eyelashes, NO whites of the eyes,
NO catchlights, NO eyelid crease, NO wrinkle, NO line beside the nose, NO shadow under the eye.
Hair is two or three flat shapes and stays very dark. IF A FACE LOOKS LIKE A PORTRAIT, IT IS
WRONG. Every person has exactly two hands and two arms, and every hand can be traced along a
visible arm back to its own shoulder.

EAST ASIAN FAMILY AND STAFF. Everyone in the picture is Taiwanese.

ECONOMY OF LINE. Each object is drawn with the fewest strokes that still make it recognisable.
The room is LESS detailed than the people.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No letters, no numbers, no words, no logos, no
labels on anything.

WHO IS IN THE PICTURE — exactly four people, arranged left to right across the width.
  • THE PAEDIATRIC DENTIST, on the LEFT. A woman in her thirties, hair tied back, sitting on a
    low round stool, leaning forward, SMILING, warm and unhurried. Her near hand is open, palm
    up, resting on her knee; her other hand is raised to about her own shoulder height with the
    index finger pointing up and to the right, towards the wide speech bubble described below.
    Her TIE-BACK SURGICAL CAP, top and trousers are all cut from ONE printed fabric: warm
    off-white cloth (#f4ead8) with SIMPLE FLAT CHILDLIKE DOODLES — bears, chicks, clouds,
    stars, small flowers — in ONLY amber (#c28229) and deep caramel (#9e6301), BIG AND FEW;
    over it a WHITE CLINICAL COAT hanging open and unbuttoned.
  • THE MOTHER, on the RIGHT, sitting on a simple chair, her body turned towards the dentist.
    DUSTY-ROSE blouse. Her shoulders are RELAXED AND DOWN. Mouth closed in a small calm line,
    eyes on the dentist, eyebrows level — she is listening and taking it in. She is not
    frightened, not crying, not pleading. One hand rests lightly on the boy's near shoulder,
    the other in her own lap.
  • THE BOY, standing between his mother's knees at the FRONT RIGHT, about six years old,
    SAGE-GREEN T-shirt and dark shorts. He holds a small soft toy rabbit against his chest with
    both arms. His chin is lifted and he is looking up at the dentist, mouth slightly open,
    CURIOUS AND UNAFRAID. He is not crying, not hiding, not being held down.
  • THE FATHER, standing behind and just beyond the mother so the three form ONE GROUP. A man
    of her age, MUTED SLATE-BLUE shirt with the sleeves rolled to the forearm, dark grey
    trousers, one hand on the back of her chair, leaning in to listen, a small relaxed
    closed-mouth smile.

THE WIDE SPEECH BUBBLE — the most important object in the picture. ONE single hand-drawn
speech bubble, WIDE AND LOW, floating in the UPPER MIDDLE of the frame between the dentist and
the parents, its tail pointing down towards the dentist. It is plain white with a thin
hand-drawn outline; nothing overlaps it.
INSIDE IT, and nothing else inside it: FOUR SMALL HEADS OF THE SAME SLEEPING-SLEEPIER BOY in a
single row, evenly spaced, all the same size, all facing the viewer, drawn in the same style as
the people in the room. Reading LEFT TO RIGHT they get steadily more relaxed:
  1st head — eyes OPEN and round, eyebrows level, mouth a small open oval. Awake.
  2nd head — eyes HALF CLOSED (each eye a shallow downward curve), mouth a small closed line.
  3rd head — eyes CLOSED (each eye a simple closed curve), mouth a small closed line, head
             tipped very slightly to one side.
  4th head — eyes CLOSED, mouth closed and soft, head tipped further to the side, fully at
             rest. Asleep and peaceful.
UNDER THE FOUR HEADS, running the whole width of the bubble, ONE simple horizontal bar that
shades smoothly from very pale warm cream at the left end to deep muted teal-blue at the right
end. No arrows, no ticks, no marks, no numbers, no words on or near the bar.
⚠ ALL FOUR HEADS ARE CALM. None of them frowns, cries, grimaces or looks unwell. The change
from the first to the fourth is ONLY in the eyes and the tilt of the head.

THE ROOM — warm, ordinary, unmistakably a children's clinic, and drawn with far fewer strokes
than the people. Warm cream walls with a band of pale amber along the lower wall. A window on
the left with a white frame. Behind and to the right: a low shelf with a basket of wooden toys,
three children's crayon drawings pinned up as simple coloured shapes, a height chart with NO
numbers on it, a small potted plant, a step stool. An EMPTY treatment chair sits at the far
right edge, mostly out of frame, turned away — it is quiet furniture, not the subject. No
trays, no instruments, no syringes, no drills, no tubes, no masks, no monitors, no screens, no
wires.

LIGHT AND COLOUR. One warm, soft daylight coming from the window on the left. The whole picture
is warm and low-contrast; the only cool note is the teal-blue at the right-hand end of the bar
inside the speech bubble, and it should read as the coolest, quietest thing in the frame.

COMPOSITION. The four people run as one horizontal band across the middle of the frame, with
the speech bubble sitting above the gap between the dentist and the family, near the centre.
Nothing important in the top eighth or the bottom eighth. The picture is full: the background
objects are FEW BUT LARGE, and there is no large empty area of blank pale paper anywhere.

AVOID — any writing, letters, numbers or logos anywhere; a child crying, frightened, held down,
restrained or in distress; tears; a mask over anyone's face; any instrument, syringe, needle,
drill, tube, cannula, drip stand, monitor, screen or wire; anybody lying in the treatment
chair; the treatment chair being the subject; an anatomical or textbook diagram; a cross
section; teeth drawn on their own; arrows; the four heads in the bubble looking unwell, sad or
frowning; a fifth person; a third hand or a floating hand; a portrait-like face; photorealism;
grey-scale; a border or frame around the image; large areas of blank white paper; blood.
```

---

## 如果第一版出問題，先往這三個方向分類（TEAM.md 第 10 號的交付第 3 項）

1. **模型能力的邊界** —— 最可能出事的是**對話框裡那四顆頭**（「精確數量」與
   「同一個人重複四次而且要有漸變」正好踩在兩個已知的弱項上，見 ILLUSTRATION.md
   第七節與 kids-crown 第七／八版那兩次「串台」）。
   ⚠ 若四顆頭數量不對或表情串台，**不要用一長串 AVOID 去修** ——
   改成把四顆頭的清單整個搬到提示詞最前面、寫成一份「這四張臉」的獨立清單，
   做法逐字照 `drafts/kids-crown/HERO-PROMPTS.md` 第七版。
2. **提示詞寫錯** —— 例如它把「刻度」畫成了溫度計或進度條（那就是 bar 那一段寫得不夠死），
   或把空的治療椅畫成了主體（把它移得更邊、更小）。
3. **參考圖沒餵** —— 如果兒牙醫師的印花衣服長得和〈同一顆補了又掉〉那張不一樣，
   ⚠ **不要用文字去修形狀**（ILLUSTRATION.md 第十之一節）：直接把
   `assets/hero-kids-crown-photo-2000.jpg` 當參考圖餵進去，並註明
   「**只參考這位醫師的衣服花紋與畫風，不要參考它的構圖、分格與其他人物**」。

## Ⓖ 第一版的產出（2026-09-18）—— 檔案 `hero-v1.jpg`，2000×1116

⚠ **原檔已存進 repo**（`drafts/kids-sedation/hero-v1.jpg`），不要只留在對話裡。

### 三個門檻：過兩項、不過一項

| | 門檻 | 實測 | |
| --- | --- | --- | --- |
| 無彩空白（S<12 且 L>80） | < 5% | **4.8%** | ✅ 過，但只差 0.2 |
| 邊緣密度 | ≥ 30% | **18.9%** | ⚠⚠ **不過** |
| 四個人的線一樣實（最暗 5 百分位） | 差 < 20 階 | 醫師 38.8／爸爸 30.7／媽媽 25.9／小孩 24.3，**差 14.5** | ✅ 過 |

量法：`node drafts/og-measure.mjs <圖>` 與 `node drafts/kids-sedation/measure-ink.mjs <圖>`。

> ⚠ **第一次跑 `measure-ink` 把對話框也放進「線一樣實」的比較，量出 53.4、整組誤判成不過。**
> 對話框框內大半是白底，最暗 5 百分位會被白底拉高。**那個門檻比的是人，不是物件。**
> 腳本已經改成把對話框單獨印出來當參考，不進比較。

### 比例是對的

2000×1116 ＝ 1.792，和站上其他 HERO **逐格相同**（`hero-kids-crown-photo-2000.jpg` 也是 2000×1116），
所以 `tools/hero-resize.mjs` 的 RATIOS 白名單過得了。

### 對到的（不要在下一版弄壞）

圖上沒有任何字／四個人都各自兩隻手而且追得回自己的肩膀／臉是單一平塗＋腮紅、
沒有畫成肖像／衣服顏色四個人全對（dusty rose、sage green、slate blue、印花奶白＋琥珀）／
身高尺上沒有數字／醫師的手術帽是綁帶式、白袍敞開／治療椅是空的而且在最右緣。

### 要改的（PM 這一側看到的，使用者的意見另外收）

1. ⚠⚠ **那條刻度被畫成了「載入進度條」。** 圓角膠囊外框、切成四段、右端是亮藍 ——
   讀起來像「下載中 75%」。而且**段的邊界和上面四顆頭對不齊**。
   這正是提示詞第一版就預測到的失敗方向（見上一節「如果第一版出問題」第 2 點）。
2. ⚠⚠ **畫面太空（邊緣密度 18.9%，門檻 30%）。** 左半邊整片奶油色牆、地板一片空白。
   ILLUSTRATION.md 第四節那條：**「背景簡單」不等於「畫面空」——簡單靠元素少而大。**
   無彩空白 4.8% 只差 0.2 就爆，也是同一個成因。
3. **醫師翹腳。** 提示詞沒有指定坐姿，出來是蹺二郎腿，而且小腿佔掉左下一大塊 ——
   那正好是最該放背景元素的地方。
4. **四顆頭的第 3 與第 4 幾乎一樣**，差異只剩一點點頭的傾斜。第 1 顆也變成了微笑
   （提示詞寫的是 mouth a small open oval）。四顆的節奏因此是「笑／沒表情／睡／睡」。
5. **空的治療椅是灰色的**，是畫面裡唯一有器材感的東西，有點搶。

---

# ⭐ 第二版：**換梗**（2026-09-18，使用者指定四個階段）

第一版整個放掉。不是修圖，是換一個完全不同的東西，所以**從零重寫**（這是第七節第 19 條
「改圖從定稿那份改」的例外：那一條講的是同一個梗的逐輪修，換梗不適用）。

## 使用者指定的四個階段（逐字）

> 1. 兒童牙科醫師建議在舒眠下進行治療　小朋友因為剛經歷完一些基礎治療過程中很抗拒，
>    現在在爸媽陪同下還是有點緊張、驚魂未定
> 2. 爸媽在家裡接到麻醉醫師打電話詢問小朋友相關資料、做麻醉諮詢
> 3. 診間進行舒眠兒童牙科治療　除了有兒童牙科醫師治療外，旁邊要有麻醉醫師、麻醉護理師
>    進行監測、紀錄、操作生理監控設備
> 4. 治療順利完成、麻醉醫師和兒童牙科醫師親切的向家長解釋、術後注意事項、家長如釋重負、
>    不在擔憂、小朋友還趴在爸爸身上半夢半醒

## 兩件被使用者推翻的，記下來免得日後誤以為是漏看

1. ⚠ **第一版刻意「不畫療程」的理由之一是「診所實際做到哪一格還沒問到」**
   （見 Ⓕ 那一節）。使用者指定要畫診間的舒眠治療，**以他的決定為準**。
   文章本文仍然全部用通稱，沒有一句宣稱診所做什麼 —— 圖與文這一輪分開處理。
2. ⚠ **比例從 16:9 改成 4:3**（使用者：「不要限制在之前的橫幅……垂直幅度應該要拉長一點」）。
   `tools/hero-resize.mjs` 的 `RATIOS` 本來就收 4:3，不必改程式。
   ⚠⚠ **代價**：首頁卡的縮圖是 `aspect-ratio: 16/9` ＋ `object-fit: cover`，
   4:3 會被**置中裁掉上下各 12.4%**。所以提示詞把「臉與關鍵的東西不要落在上下 13%」
   寫成硬規定，而且 2×2 的上排要把頭壓低一點、下排要把頭抬高一點。

## 這一版預先處理的三個坑（不是等它出錯才修）

1. ⚠⚠⚠ **同一個人出現在多格，情緒與姿勢會「串台」**（〈同一顆補了又掉〉第七、八版各踩一次）。
   所以這一份把**「小孩的四張臉」「媽媽的三張臉」「爸爸的三張臉」寫成三份獨立清單，
   放在所有其他指令的最前面**，並附自我檢查。這是上次驗證過有效的解法，這次不等它出錯。
2. ⚠⚠ **監視器與紙張是「字」最容易跑出來的地方**（參考圖的螢幕上就有一堆亂碼數字）。
   提示詞明寫：螢幕只有三條波形、沒有任何數字；紙張留白；**整張圖不要有時鐘**。
3. ⚠ **第一版邊緣密度只有 18.9%。** 四格本身會把密度拉上來，但仍寫進「每一格都要滿」
   與「背景元素少而大」。

## 選角與顏色 —— ⭐ 兩隊穿兩個色系

沿用〈同一顆補了又掉〉那一組人（媽媽 dusty rose、小孩 sage green、爸爸 slate blue、
兒牙醫師 印花奶白＋琥珀焦糖 ＋ 敞開的白袍），**新增的兩位穿 teal 系**：

| | 穿什麼 | 為什麼 |
| --- | --- | --- |
| 兒童牙科醫師 | 印花奶白（#f4ead8 ＋ 琥珀 #c28229／焦糖 #9e6301 的童趣圖案）＋ 敞開白袍 | 和 kids-crown 那張同一個人，讀者認得 |
| **麻醉專科醫師** | **素面深青藍刷手服（deep teal-blue）＋ 同色手術帽** | 牙科端印花、麻醉端素色 teal，**一眼分得出兩隊** |
| **麻醉護理師** | **同一支 teal 的淺一階**，素面 | 同上，而且和醫師同隊 |

⭐ 這正好對應文章裡那一句「麻醉端與牙科端各司其職」。

## 完整提示詞（第二版・整份可貼）

```
Editorial illustration for a dental clinic's article. ASPECT RATIO 4:3 (four units wide by
three units tall). Output at least 2000 pixels wide.

FOUR PANELS IN A 2x2 GRID telling one story in four stages, read LEFT TO RIGHT then DOWN:
panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right. ONE hand-drawn
vertical line and ONE hand-drawn horizontal line separate them. NO border around the whole
image. Nothing crosses those two lines. Each panel is itself a 4:3 scene and each panel is
FULL — no panel has a large empty area of blank pale paper.

REFERENCE IMAGE — one reference picture is attached. USE IT ONLY for what is in panel 3: which
people and which equipment belong in a paediatric dental sedation room (the sleeping child on
the treatment chair under a light blanket, the drip stand, the vital-signs monitor, the
paediatric dentist working at the child's head, the anaesthesia staff beside the monitor).
DO NOT copy its drawing style, its colours, its rendering, its shading, its clock, its flying
tooth fairies, or the numbers on its monitor screen. The style of the picture you draw is
defined entirely by the STYLE section below.

=====================================================================
⚠⚠⚠ READ THESE THREE LISTS BEFORE DRAWING ANY FACE.
Three people each appear in more than one panel. THEIR FACES ARE DELIBERATELY DIFFERENT FROM
PANEL TO PANEL, and no expression or pose may be copied from one panel into another. ALL OF
THEM MATTER EQUALLY; give each face the same care.

THE BOY'S FOUR FACES (he is in all four panels)
  • PANEL 1 — SHAKEN. Standing, pressed against his mother's side, BOTH HANDS gripping her
    clothes, shoulders drawn up. Eyes open and round, the rims a little pink. Mouth closed in
    a small tight line. HE IS NOT CRYING AND THERE ARE NO TEARS — he has already stopped; this
    is the moment just after.
  • PANEL 2 — RELAXED AND BUSY. Sitting on the floor playing with wooden blocks, seen from the
    side. Eyes down on the toy, mouth slightly open, shoulders loose. He is not paying any
    attention to the adults. Completely untroubled.
  • PANEL 3 — ASLEEP. Lying on the treatment chair, eyes CLOSED (each eye a simple closed
    curve), mouth slightly open, face completely smooth, a light blanket up to his chest, one
    foot showing at the end of the chair. Peaceful. NOT frightened, NOT grimacing.
  • PANEL 4 — HALF AWAKE. Draped over his father's shoulder, cheek against it, hair slightly
    messy. Eyes HALF CLOSED (each eye a shallow droopy curve), mouth closed and soft. Drowsy
    and safe.

THE MOTHER'S THREE FACES (panels 1, 2 and 4 — SHE IS NOT IN PANEL 3)
  • PANEL 1 — WORRIED. Crouching or sitting beside the boy, one arm around him. Inner ends of
    the eyebrows RAISED, mouth closed in a short line, eyes on the paediatric dentist. Not
    smiling, not angry, not crying.
  • PANEL 2 — FOCUSED. Sitting at the dining table, a phone held to her ear with one hand, a
    pen in the other. Eyebrows LEVEL, mouth slightly OPEN because she is speaking. Neither
    worried nor smiling — she is concentrating.
  • PANEL 4 — RELIEVED. Standing, SHOULDERS CLEARLY DROPPED AND RELAXED, eyes on the two
    doctors, mouth open with BOTH CORNERS CURVING UP. She is the one person in the whole
    picture who is plainly smiling with an open mouth.

THE FATHER'S THREE FACES (panels 1, 2 and 4 — HE IS NOT IN PANEL 3)
  • PANEL 1 — CONCERNED. Standing behind the mother, one hand on her shoulder. Mouth closed,
    inner ends of the eyebrows slightly raised, eyes on the dentist.
  • PANEL 2 — LEANING IN. Sitting beside her, head tilted towards the phone, one finger
    resting on the paper on the table, mouth closed, eyebrows level.
  • PANEL 4 — CARRYING HIS SON. Both arms holding the boy against his shoulder, a small
    relaxed CLOSED-MOUTH smile, eyes on the doctors.

SELF-CHECK — before you finish, put the boy's four faces side by side and read them in order:
  1st — eyes open, tight mouth, NOT crying.   2nd — looking down at a toy, at ease.
  3rd — eyes fully closed, mouth slightly open, completely smooth.
  4th — eyes half closed and droopy, on his father's shoulder.
If any two of the four look the same, the drawing is wrong. Then check that the MOTHER and the
FATHER DO NOT APPEAR AT ALL in panel 3, and that the mother is smiling ONLY in panel 4.
=====================================================================

STYLE. Contemporary printed-magazine editorial illustration, hand-made throughout. Linework in
warm dark brown or soft charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies
along a stroke, strokes taper and sometimes break and run dry at the end. Colour applied like
soft coloured pencil and light marker; colour edges a little loose. Flat fills with two or
three tones per hue — no gradients, no airbrush, no glow. A fine even paper grain over every
surface.

FACES AND HANDS. Every face and every hand is ONE single flat tone: no shading, no cheekbones,
no jawline. On a face draw ONLY these six things plus blush: the outline of the head, the eyes,
the eyebrows, the nose, the mouth, the ears — and two soft round patches of warm pink blush
high on each cheek. An eye is one small dark curved mark. NO eyelashes, NO whites of the eyes,
NO catchlights, NO eyelid crease, NO wrinkle, NO line beside the nose, NO shadow under the eye.
Hair is two or three flat shapes and stays very dark. IF A FACE LOOKS LIKE A PORTRAIT, IT IS
WRONG. Every person has exactly two hands and two arms, and every hand that touches another
person can be traced along a visible arm back to its own shoulder. No spare hand, no floating
hand, no sleeve without an arm in it.

EVERYONE IN THIS PICTURE IS TAIWANESE.

ECONOMY OF LINE. Each object is drawn with the fewest strokes that still make it recognisable.
The rooms are LESS detailed than the people. Background objects are FEW BUT LARGE.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No letters, no numbers, no words, no logos, no
labels. In particular: THE MONITOR SCREEN IN PANEL 3 SHOWS ONLY THREE SIMPLE COLOURED WAVY
LINES AND NOTHING ELSE — no digits, no readouts. Every sheet of paper and every clipboard is
BLANK. There is NO CLOCK anywhere in the picture.

CLOTHING — fixed, and the same in every panel the person appears in.
  • THE MOTHER — dusty-rose blouse.
  • THE BOY — sage-green T-shirt and dark shorts.
  • THE FATHER — muted slate-blue shirt with the sleeves rolled to the forearm, dark grey
    trousers.
  • THE PAEDIATRIC DENTIST — a woman in her thirties, hair tied back. Her TIE-BACK SURGICAL
    CAP, top and trousers are all cut from ONE printed fabric: warm off-white cloth (#f4ead8)
    with SIMPLE FLAT CHILDLIKE DOODLES — bears, chicks, clouds, stars, small flowers — in ONLY
    amber (#c28229) and deep caramel (#9e6301), BIG AND FEW; over it a WHITE CLINICAL COAT
    hanging open and unbuttoned.
  • THE ANAESTHETIST — a man in his forties, PLAIN DEEP TEAL-BLUE scrubs and a matching plain
    teal cap, NO pattern, NO white coat.
  • THE ANAESTHESIA NURSE — a woman, PLAIN scrubs in a LIGHTER SHADE OF THE SAME TEAL, and a
    matching plain cap.
⚠ THE TWO TEAMS ARE TOLD APART BY COLOUR: the dental side wears the off-white printed fabric,
the anaesthesia side wears plain teal. Keep that separation in every panel.
⚠ NOBODY WEARS A FACE MASK IN ANY PANEL — every face must be visible.

PANEL 1 (TOP LEFT) — THE RECOMMENDATION. A children's dental treatment room, just after a
short procedure. On the LEFT the PAEDIATRIC DENTIST sits on a low round stool, BOTH FEET ON
THE FLOOR, leaning forward, one hand open palm-up, talking gently to the parents. On the RIGHT
the MOTHER, the BOY and the FATHER stand together as one group, faces as described above. An
empty treatment chair is behind them. Room: warm cream walls with a band of pale amber along
the lower wall, a basket of wooden toys, a height chart with NO numbers on it.

PANEL 2 (TOP RIGHT) — THE PHONE CALL. The family's home, warm and domestic: a wooden dining
table, a hanging lamp above it, a potted plant, a sofa behind. The MOTHER sits at the table
with a phone to her ear and a pen in her other hand; a BLANK sheet of paper and a small card
lie on the table in front of her. The FATHER sits beside her leaning in. The BOY plays with
wooden blocks on the floor in the foreground. FLOATING ABOVE AND BESIDE THE PHONE, a single
hand-drawn ROUND SPEECH BUBBLE with its tail pointing at the phone: inside it, head and
shoulders of THE ANAESTHETIST in his plain teal scrubs and cap, holding a telephone handset to
his ear, looking down at a BLANK sheet of paper, friendly and attentive. The bubble is plain
white with a thin hand-drawn outline and contains nothing else.

PANEL 3 (BOTTOM LEFT) — THE TREATMENT. The dental treatment room, busiest panel of the four.
FIVE THINGS, arranged across the width: the BOY ASLEEP on the treatment chair under a light
blanket in the centre; the PAEDIATRIC DENTIST at his head on the left, leaning in, working
calmly with a small mirror in one hand; the ANAESTHETIST standing just behind the child's head,
one hand on the controls of the vital-signs monitor, HIS EYES ON THE CHILD, not on the machine;
the ANAESTHESIA NURSE standing on the right holding a clipboard and writing on it; and the
EQUIPMENT — a drip stand with a bag and a line running down to the child's arm, and the
vital-signs monitor on a small trolley, ITS SCREEN SHOWING ONLY THREE SIMPLE COLOURED WAVY
LINES. A dental operating light hangs above. ⚠ NO PARENTS IN THIS PANEL AT ALL — exactly four
people: the boy and the three staff. Everyone is calm and unhurried; this is routine work, not
an emergency.

PANEL 4 (BOTTOM RIGHT) — AFTERWARDS. A quiet corner of the same clinic. On the LEFT the
PAEDIATRIC DENTIST and the ANAESTHETIST stand side by side facing the parents, both warm and
unhurried; the dentist is speaking with one hand open, the anaesthetist holds a BLANK sheet of
paper at waist height and is nodding. On the RIGHT the FATHER carries the sleepy BOY against
his shoulder, and the MOTHER stands beside them, relieved and smiling. Room: warm cream walls,
a low shelf with a potted plant, a window with a white frame.

CROP SAFETY — this picture will sometimes be shown cropped to a wide band, so KEEP EVERY FACE
AND EVERY IMPORTANT OBJECT OUT OF THE TOP 13% AND THE BOTTOM 13% OF THE WHOLE IMAGE. In the
top two panels push the heads down a little; in the bottom two panels lift them a little.

LIGHT AND COLOUR. Every panel is warm and low-contrast. Panels 1, 3 and 4 are clinic rooms in
warm cream and pale amber; panel 2 (the home) is the warmest, lit by the lamp over the table.
The plain teal of the anaesthesia team and the wavy lines on the monitor are the only cool
notes in the picture, and they should read as quiet, not bright.

AVOID — any writing, letters, numbers, digits or logos anywhere; numbers or readouts on the
monitor screen; writing on any paper or clipboard; a clock; a child crying, screaming, held
down or restrained; tears; a face mask on anybody; anyone looking alarmed, rushed or panicked;
the parents appearing in panel 3; the mother smiling in panel 1 or panel 2; the same expression
on the boy in more than one panel; a fifth person in panel 3; a third hand, a spare hand or a
floating hand on anyone; blood; an anatomical or textbook diagram; a cross section; teeth drawn
on their own; photorealism; a portrait-like face; grey-scale; a border or frame around the
whole image; anything crossing the two dividing lines; large areas of blank white paper.
```

## 出圖之後

```bash
node tools/hero-resize.mjs <原檔> kids-sedation-photo   # 4:3 在 RATIOS 裡，過得了
node tools/webp.mjs
node drafts/og-measure.mjs <原檔>                        # 無彩空白 < 5%
node drafts/kids-sedation/measure-ink.mjs <原檔>         # 邊緣密度 ≥ 30%、線一樣實 < 20 階
```

⚠ `measure-ink.mjs` 裡的人物框是**第一版那張圖**的座標，換成四格之後要重寫
（一格一個框，或逐人給框）。不改就會量到別的東西。

---

## Ⓗ 第二版的產出（2026-09-18）—— 檔案 `hero-v2.jpg`，1200×896

### 三個門檻：**全部過**

| | 門檻 | 第一版 | 第二版 |
| --- | --- | --- | --- |
| 無彩空白（S<12 且 L>80） | < 5% | 4.8% | **0%** ✅ |
| 邊緣密度 | ≥ 30% | 18.9% ⚠ | **36.2%** ✅ |
| 四格的線一樣實（最暗 5 百分位） | 差 < 20 階 | — | ①40.0／②35.8／③40.6／④34.2，**差 6.4** ✅ |

⚠ `measure-ink.mjs` 的框已經改成**一格一個**（第一版那張是單一場景、逐人給框，換梗之後不能沿用）。

### ⚠⚠ palePct ＝ 0% 正好量到使用者說的「太黃」

整張圖**沒有任何一塊是「淺而無彩」的**，每一塊都帶著暖色。
所以「改亮、改乾淨」這件事有很大的空間：一路加到 5% 才碰門檻。
⚠ 但**不要用純白牆**去換 —— 那會直接把 palePct 推上去。做法是
**極淺但仍帶一點彩度的牆**（淡到接近白，色相留一點），而且**牆上要有東西**。

### ⚠ 尺寸不夠：1200×896

比例 1.339，落在 4:3 的容許範圍內（`RATIO_TOL` 0.02）✅，但**寬度只有 1200**。
站上要 2000／1600／800 三個尺寸，**定案那一張一定要出 2000 以上**
（同 kids-crown 第七版那一條「定案那一張要出大的」）。

### 使用者的六點回饋（2026-09-18，逐字）

> 治療那張　醫療人員還是要戴口罩　這四張圖的背景都太黃了　特別是診所場景的三張
> 診所應該是明亮乾淨的空間　周圍也要比較像是牙醫診所的環境細節　噢最後一張麻醉醫師
> 拿著文件不能戴手套　另外這四張明顯很安靜　能不能用一些氛圍的線條貫穿整個四張圖
> 比較有點流動感　第一張小孩的臉要有點紅腫表示牙齒有問題的樣子

⚠⚠ **第一點推翻了第二版提示詞裡「NOBODY WEARS A FACE MASK IN ANY PANEL」那一條。**
當初寫它的理由是「戴了臉就沒了，而這張圖靠的全是表情」—— 但**第三格本來就不是靠表情**
（那一格要傳達的是分工與監測），而且不戴口罩在臨床上是錯的。
定案：**只有第三格戴口罩**，其餘三格不戴；口罩是素面的，眼睛與眉毛要看得見。

⚠ **第五點要改掉版面規則。** 第二版寫著「Nothing crosses those two lines」，
氛圍帶要貫穿四格就一定得跨線。定案：**只有那一條氛圍帶可以跨線，其他一律不行。**
帶子照 ILLUSTRATION.md 第十之六節的規矩：可以長，但**不從任何人身上出來、不打圈、
不跨過任何一張臉**。顏色取**極淡的薄荷藍綠** —— 和麻醉那一隊的 teal 同一支色相，
等於用顏色把「這條路」串起來。

⚠ **第六點要靠輪廓線，不能靠陰影。** 臉只有單一平塗（STYLE 那一段的硬規定），
所以「紅腫」＝ **臉的下半邊輪廓往外鼓一點** ＋ **一塊比腮紅更大、位置更低的淡紅暈染**，
另外半邊維持正常。**不可以畫成陰影或漸層。**

## 完整提示詞（第三版・整份可貼）

⚠ 從第二版那一份改，只換出問題的段落 —— 改動的是 LAYOUT（氛圍帶可以跨線）、
小孩第一格的臉、口罩與手套、房間的色調與細節、輸出尺寸。其餘逐字沒動。

```
Editorial illustration for a dental clinic's article. ASPECT RATIO 4:3 (four units wide by
three units tall). OUTPUT AT LEAST 2000 PIXELS WIDE — this is a hard requirement.

FOUR PANELS IN A 2x2 GRID telling one story in four stages, read LEFT TO RIGHT then DOWN:
panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right. ONE hand-drawn
vertical line and ONE hand-drawn horizontal line separate them — thin, slightly wobbly, drawn
by hand, NOT thick white gutters. NO border around the whole image. Each panel is itself a 4:3
scene and each panel is FULL — no panel has a large empty area of blank paper.

⚠ THE ONE THING THAT CROSSES THE PANELS — A RIBBON OF AIR. One single continuous, VERY PALE
MINT-TEAL ribbon, like a slow wide current of air, enters at the top-left of panel 1, drifts
right into panel 2, turns down and sweeps back left into panel 3, and leaves at the bottom-right
of panel 4, fading out at both ends. It is the ONLY thing in the picture allowed to cross the
two dividing lines, and it must cross them so the four panels read as one moving story. It is
soft-edged, barely tinted, and sits BEHIND all the people and furniture. It NEVER comes out of
a person's body or mouth, NEVER curls into a loop or a spiral, NEVER crosses a face, and NEVER
turns into steam, smoke, sparkles or stars.

REFERENCE IMAGE — one reference picture is attached. USE IT ONLY for what is in panel 3: which
people and which equipment belong in a paediatric dental sedation room (the sleeping child on
the treatment chair under a light blanket, the drip stand, the vital-signs monitor, the
paediatric dentist working at the child's head, the anaesthesia staff beside the monitor).
DO NOT copy its drawing style, its colours, its rendering, its shading, its clock, its flying
tooth fairies, or the numbers on its monitor screen. The style of the picture you draw is
defined entirely by the STYLE section below.

=====================================================================
⚠⚠⚠ READ THESE THREE LISTS BEFORE DRAWING ANY FACE.
Three people each appear in more than one panel. THEIR FACES ARE DELIBERATELY DIFFERENT FROM
PANEL TO PANEL, and no expression or pose may be copied from one panel into another. ALL OF
THEM MATTER EQUALLY; give each face the same care.

THE BOY'S FOUR FACES (he is in all four panels)
  • PANEL 1 — SHAKEN, AND ONE CHEEK IS SWOLLEN. Standing, pressed against his mother's side,
    BOTH HANDS gripping her clothes, shoulders drawn up. Eyes open and round, the rims a little
    pink. Mouth closed in a small tight line. HE IS NOT CRYING AND THERE ARE NO TEARS — he has
    already stopped; this is the moment just after.
    ⚠ HIS LEFT CHEEK (the viewer's right) IS PUFFY because of a bad tooth. Draw it with TWO
    things only: (a) the OUTLINE of the lower half of that side of his face bulges outward in a
    soft curve, clearly wider than the other side; (b) over that bulge, ONE SOFT PATCH OF WARM
    RED — BIGGER and LOWER than a blush patch, sitting over the jaw and lower cheek. The other
    cheek keeps its small ordinary round pink blush. DO NOT draw the swelling with shading, a
    gradient, a shadow or extra lines — outline and one flat patch of colour only.
  • PANEL 2 — RELAXED AND BUSY. Sitting on the floor playing with wooden blocks, seen from the
    side. Eyes down on the toy, mouth slightly open, shoulders loose. He is not paying any
    attention to the adults. Completely untroubled. HIS FACE IS BACK TO NORMAL — no swelling.
  • PANEL 3 — ASLEEP. Lying on the treatment chair, eyes CLOSED (each eye a simple closed
    curve), mouth slightly open, face completely smooth, a light blanket up to his chest, one
    foot showing at the end of the chair with a small sensor taped to it. Peaceful. NOT
    frightened, NOT grimacing.
  • PANEL 4 — HALF AWAKE. Draped over his father's shoulder, cheek against it, hair slightly
    messy. Eyes HALF CLOSED (each eye a shallow droopy curve), mouth closed and soft. Drowsy
    and safe.

THE MOTHER'S THREE FACES (panels 1, 2 and 4 — SHE IS NOT IN PANEL 3)
  • PANEL 1 — WORRIED. Crouching or sitting beside the boy, one arm around him. Inner ends of
    the eyebrows RAISED, mouth closed in a short line, eyes on the paediatric dentist. Not
    smiling, not angry, not crying.
  • PANEL 2 — FOCUSED. Sitting at the dining table, a phone held to her ear with one hand, a
    pen in the other. Eyebrows LEVEL, mouth slightly OPEN because she is speaking. Neither
    worried nor smiling — she is concentrating.
  • PANEL 4 — RELIEVED. Standing, SHOULDERS CLEARLY DROPPED AND RELAXED, eyes on the two
    doctors, mouth open with BOTH CORNERS CURVING UP. She is the one person in the whole
    picture who is plainly smiling with an open mouth.

THE FATHER'S THREE FACES (panels 1, 2 and 4 — HE IS NOT IN PANEL 3)
  • PANEL 1 — CONCERNED. Standing behind the mother, one hand on her shoulder. Mouth closed,
    inner ends of the eyebrows slightly raised, eyes on the dentist.
  • PANEL 2 — LEANING IN. Sitting beside her, head tilted towards the phone, one finger
    resting on the paper on the table, mouth closed, eyebrows level.
  • PANEL 4 — CARRYING HIS SON. Both arms holding the boy against his shoulder, a small
    relaxed CLOSED-MOUTH smile, eyes on the doctors.

SELF-CHECK — before you finish, put the boy's four faces side by side and read them in order:
  1st — eyes open, tight mouth, ONE CHEEK CLEARLY PUFFY AND RED, NOT crying.
  2nd — looking down at a toy, at ease, face normal on both sides.
  3rd — eyes fully closed, mouth slightly open, completely smooth.
  4th — eyes half closed and droopy, on his father's shoulder.
If any two of the four look the same, the drawing is wrong. Then check that the MOTHER and the
FATHER DO NOT APPEAR AT ALL in panel 3, and that the mother is smiling ONLY in panel 4.
=====================================================================

STYLE. Contemporary printed-magazine editorial illustration, hand-made throughout. Linework in
warm dark brown or soft charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies
along a stroke, strokes taper and sometimes break and run dry at the end. Colour applied like
soft coloured pencil and light marker; colour edges a little loose. Flat fills with two or
three tones per hue — no gradients, no airbrush, no glow. A fine even paper grain over every
surface.

⚠⚠ OVERALL COLOUR — THE THREE CLINIC PANELS ARE BRIGHT, CLEAN AND AIRY, NOT YELLOW.
Panels 1, 3 and 4 are lit like a well-lit modern clinic: the walls are VERY PALE and READ AS
CLEAN — a soft near-white with only the faintest cool tint of mint or pale sky, never cream,
never beige, never butter, never amber. Cabinets, worktops and equipment are white and very
pale grey. The floor is a pale cool grey or a very light grey-toned wood. ⚠ Do NOT flood these
three panels with warm yellow light and do NOT paint a band of amber along the lower wall. The
warm colours in these panels are LOCAL AND SMALL ONLY: the wooden toys, a wooden stool, the
dentist's printed fabric, a plant pot.
⚠ BUT THE WALLS ARE NOT BLANK WHITE PAPER — they always carry something: a cabinet, a shelf, a
window, a washbasin. Pale, clean, and furnished.
PANEL 2 (the home) IS THE EXCEPTION and is the only warm panel: warm wood, a warm lamp.

FACES AND HANDS. Every face and every hand is ONE single flat tone: no shading, no cheekbones,
no jawline. On a face draw ONLY these six things plus blush: the outline of the head, the eyes,
the eyebrows, the nose, the mouth, the ears — and two soft round patches of warm pink blush
high on each cheek. An eye is one small dark curved mark. NO eyelashes, NO whites of the eyes,
NO catchlights, NO eyelid crease, NO wrinkle, NO line beside the nose, NO shadow under the eye.
Hair is two or three flat shapes and stays very dark. IF A FACE LOOKS LIKE A PORTRAIT, IT IS
WRONG. Every person has exactly two hands and two arms, and every hand that touches another
person can be traced along a visible arm back to its own shoulder. No spare hand, no floating
hand, no sleeve without an arm in it.

EVERYONE IN THIS PICTURE IS TAIWANESE.

ECONOMY OF LINE. Each object is drawn with the fewest strokes that still make it recognisable.
The rooms are LESS detailed than the people, but they are clearly dental rooms.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No letters, no numbers, no words, no logos, no
labels. In particular: THE MONITOR SCREEN IN PANEL 3 SHOWS ONLY THREE SIMPLE COLOURED WAVY
LINES AND NOTHING ELSE — no digits, no readouts. Every sheet of paper and every clipboard is
BLANK. There is NO CLOCK anywhere in the picture.

MASKS AND GLOVES — this matters and applies differently per panel.
  • PANEL 3 ONLY: ALL THREE STAFF WEAR A PLAIN SURGICAL FACE MASK covering nose and mouth, and
    ALL THREE WEAR THIN MEDICAL GLOVES. The masks are plain, single-colour and un-patterned;
    the EYES AND EYEBROWS STAY FULLY VISIBLE above them, and every one of the three still reads
    as calm and attentive.
  • PANELS 1, 2 AND 4: NOBODY WEARS A MASK AND NOBODY WEARS GLOVES — every face is fully
    visible and every hand is a bare hand. ⚠ In panel 4 the anaesthetist holds a sheet of paper
    with BARE HANDS; he must not be wearing gloves.

CLOTHING — fixed, and the same in every panel the person appears in.
  • THE MOTHER — dusty-rose blouse.
  • THE BOY — sage-green T-shirt and dark shorts.
  • THE FATHER — muted slate-blue shirt with the sleeves rolled to the forearm, dark grey
    trousers.
  • THE PAEDIATRIC DENTIST — a woman in her thirties, hair tied back. Her TIE-BACK SURGICAL
    CAP, top and trousers are all cut from ONE printed fabric: warm off-white cloth (#f4ead8)
    with SIMPLE FLAT CHILDLIKE DOODLES — bears, chicks, clouds, stars, small flowers — in ONLY
    amber (#c28229) and deep caramel (#9e6301), BIG AND FEW; over it a WHITE CLINICAL COAT
    hanging open and unbuttoned.
  • THE ANAESTHETIST — a man in his forties, PLAIN DEEP TEAL-BLUE scrubs and a matching plain
    teal cap, NO pattern, NO white coat.
  • THE ANAESTHESIA NURSE — a woman, PLAIN scrubs in a LIGHTER SHADE OF THE SAME TEAL, and a
    matching plain cap.
⚠ THE TWO TEAMS ARE TOLD APART BY COLOUR: the dental side wears the off-white printed fabric,
the anaesthesia side wears plain teal. Keep that separation in every panel.

PANEL 1 (TOP LEFT) — THE RECOMMENDATION. A bright, clean children's dental treatment room, just
after a short procedure. On the LEFT the PAEDIATRIC DENTIST sits on a low round stool, BOTH FEET
ON THE FLOOR, leaning forward, one hand open palm-up, talking gently to the parents, no mask, no
gloves. On the RIGHT the MOTHER, the BOY and the FATHER stand together as one group, faces as
described above. DENTAL DETAIL, drawn simply but unmistakably: a proper dental chair with a
headrest and a swing-out instrument arm with hoses, a small tray table beside it, an overhead
operating light folded up out of the way, a white wall cabinet with a worktop, a washbasin with
a tall tap. Plus a basket of wooden toys and a height chart with NO numbers on it.

PANEL 2 (TOP RIGHT) — THE PHONE CALL. The family's home, the one warm panel: a wooden dining
table, a hanging lamp above it, a potted plant, a sofa behind. The MOTHER sits at the table with
a phone to her ear and a pen in her other hand; a BLANK sheet of paper and a small card lie on
the table in front of her. The FATHER sits beside her leaning in. The BOY plays with wooden
blocks on the floor in the foreground. FLOATING ABOVE AND BESIDE THE PHONE, a single hand-drawn
ROUND SPEECH BUBBLE with its tail pointing at the phone: inside it, head and shoulders of THE
ANAESTHETIST in his plain teal scrubs and cap, NO MASK, holding a telephone handset to his ear,
looking down at a BLANK sheet of paper, friendly and attentive. The bubble is plain white with a
thin hand-drawn outline and contains nothing else.

PANEL 3 (BOTTOM LEFT) — THE TREATMENT. The same bright clean dental room, busiest panel of the
four, ALL THREE STAFF MASKED AND GLOVED. Arranged across the width: the BOY ASLEEP on the
treatment chair under a light blanket in the centre; the PAEDIATRIC DENTIST at his head on the
left, leaning in, working calmly with a small mirror in one hand; the ANAESTHETIST standing just
behind the child's head, one hand on the controls of the vital-signs monitor, HIS EYES ON THE
CHILD, not on the machine; the ANAESTHESIA NURSE standing on the right holding a clipboard and
writing on it. EQUIPMENT: a drip stand with a bag and a line running down to the child's arm;
the vital-signs monitor on a slim trolley, ITS SCREEN SHOWING ONLY THREE SIMPLE COLOURED WAVY
LINES; the dental unit's instrument arm with its hoses and a suction tube; a tray of instruments
on a small table; the overhead operating light angled down over the child; a white cabinet run
along the back wall. ⚠ NO PARENTS IN THIS PANEL AT ALL — exactly four people: the boy and the
three staff. Everyone is calm and unhurried; this is routine work, not an emergency.

PANEL 4 (BOTTOM RIGHT) — AFTERWARDS. A bright, clean corner of the same clinic. On the LEFT the
PAEDIATRIC DENTIST and the ANAESTHETIST stand side by side facing the parents, NO MASKS AND NO
GLOVES, both warm and unhurried; the dentist is speaking with one hand open, the anaesthetist
holds a BLANK sheet of paper in his BARE HANDS at waist height and is nodding. On the RIGHT the
FATHER carries the sleepy BOY against his shoulder, and the MOTHER stands beside them, relieved
and smiling. Room: pale clean walls, a low white cabinet, a washbasin, a potted plant, a window
with a white frame letting in soft daylight.

CROP SAFETY — this picture will sometimes be shown cropped to a wide band, so KEEP EVERY FACE
AND EVERY IMPORTANT OBJECT OUT OF THE TOP 13% AND THE BOTTOM 13% OF THE WHOLE IMAGE. In the top
two panels push the heads down a little; in the bottom two panels lift them a little.

LIGHT AND COLOUR. Panels 1, 3 and 4 are bright, clean and cool-leaning, lit by even daylight;
panel 2 (the home) is warm, lit by the lamp over the table. The teal of the anaesthesia team,
the wavy lines on the monitor and the pale mint-teal ribbon of air are the cool notes that tie
the four panels together, and they should read as quiet, not bright.

AVOID — any writing, letters, numbers, digits or logos anywhere; numbers or readouts on the
monitor screen; writing on any paper or clipboard; a clock; warm yellow or cream walls in panels
1, 3 and 4; a band of amber along the lower wall; a whole panel flooded with yellow light; blank
white featureless walls; gloves on anyone in panels 1, 2 or 4; a mask on anyone in panels 1, 2
or 4; an unmasked or ungloved person in panel 3; a child crying, screaming, held down or
restrained; tears; anyone looking alarmed, rushed or panicked; the parents appearing in panel 3;
the mother smiling in panel 1 or panel 2; the same expression on the boy in more than one panel;
the boy's cheek still swollen in panels 2, 3 or 4; swelling drawn as shading or a gradient; a
fifth person in panel 3; a third hand, a spare hand or a floating hand on anyone; the ribbon of
air coming out of a person, curling into a loop, crossing a face, or turning into steam, smoke,
sparkles or stars; anything other than the ribbon crossing the two dividing lines; thick white
gutters between the panels; blood; an anatomical or textbook diagram; a cross section; teeth
drawn on their own; photorealism; a portrait-like face; grey-scale; a border or frame around the
whole image.
```

---

## Ⓘ 第四版：麻醉團隊改穿櫃檯立牌那兩塊印花布（2026-09-18）

> 使用者：「這個圖卡裡的中間兩個刷手服有花紋的人剛好可以用來當這次的麻醉團隊樣式
> 　頭帽也要有一樣的花紋喔」（指 `/preview/line-stand/`）

⚠ 這台機器連不出 fangren.net，但**那一頁與那張圖都在 repo 裡**，規格也在
`drafts/stand-card-illustration-prompt.md` 第六節（v2 那一版的定案）：

| | 布 | 圖案 | 顏色 |
| --- | --- | --- | --- |
| 中間偏左那位（男） | **針葉樹印花** | 小松樹、圓樹叢、小三角形 | 深青綠 `#317d78` ＋ 米白，底是**同色的淡色** |
| 中間偏右那位（女） | **恐龍印花** | 長頸龍、背板帶斑點的龍、小翼龍 | 深藍 `#4478b5` ＋ 米白，底是**同色的淡色** |

### 指派

- **麻醉專科醫師（男）→ 針葉樹印花**
- **麻醉護理師（女）→ 恐龍印花**

性別和立牌那張一致（針葉樹那位是男的、恐龍那位是女的），不必另外解釋。

⭐ **這樣三塊布正好對上站上既有的三種**：兒牙醫師的塗鴉印花（暖・琥珀焦糖）、
麻醉醫師的針葉樹（冷・青綠）、麻醉護理師的恐龍（冷・藍）。
**兩隊仍然分得出來 —— 牙科端是暖色印花，麻醉端是冷色印花。**

### ⚠ 三件參考圖不可以照抄的

1. **帽子。** 立牌那張裡，針葉樹那位戴的是**素色深青綠**的帽子，恐龍那位**根本沒戴帽**。
   使用者要的是「頭帽也要有一樣的花紋」→ **兩位都戴同一塊印花布做的綁帶手術帽**，
   提示詞要明寫「不要照抄參考圖裡那頂素色的帽子」。
2. **構圖。** 那是一整排人的橫幅，整張餵進去會被連構圖一起抄走。
   已經裁成只有那兩個人：`drafts/kids-sedation/ref-scrub-prints.jpg`（495×524），
   裁圖腳本 `drafts/kids-sedation/ref-crop.mjs`。
3. ⚠⚠ **印花的密度。** 這是立牌那一輪最難的一條（該份提示詞第 7 點）：
   參考圖裡的恐龍印花已經偏密，而這一張的每個人只佔**四分之一格**，
   照抄密度會變成一片灰色雜點。**圖案要大而少**：一個圖案約佔身體寬度的四分之一，
   胸前看得到的只有三、四個。

### 顏色沒有衝突（查過）

麻醉護理師的恐龍布是藍的，爸爸的襯衫是 muted slate-blue —— 但**護理師只出現在第三格，
而爸爸不在第三格**，兩個人不會同框。

## 完整提示詞（第四版・整份可貼）

⚠ 從第三版改，只換 CLOTHING、參考圖那一段、與相關的 AVOID。其餘逐字沒動。
**要餵兩張參考圖**：① `ref-sedation-concept.jpg`（第三格的場景與設備）
② `ref-scrub-prints.jpg`（兩塊印花布）。

```
Editorial illustration for a dental clinic's article. ASPECT RATIO 4:3 (four units wide by
three units tall). OUTPUT AT LEAST 2000 PIXELS WIDE — this is a hard requirement.

FOUR PANELS IN A 2x2 GRID telling one story in four stages, read LEFT TO RIGHT then DOWN:
panel 1 top-left, panel 2 top-right, panel 3 bottom-left, panel 4 bottom-right. ONE hand-drawn
vertical line and ONE hand-drawn horizontal line separate them — thin, slightly wobbly, drawn
by hand, NOT thick white gutters. NO border around the whole image. Each panel is itself a 4:3
scene and each panel is FULL — no panel has a large empty area of blank paper.

⚠ THE ONE THING THAT CROSSES THE PANELS — A RIBBON OF AIR. One single continuous, VERY PALE
MINT-TEAL ribbon, like a slow wide current of air, enters at the top-left of panel 1, drifts
right into panel 2, turns down and sweeps back left into panel 3, and leaves at the bottom-right
of panel 4, fading out at both ends. It is the ONLY thing in the picture allowed to cross the
two dividing lines, and it must cross them so the four panels read as one moving story. It is
soft-edged, barely tinted, and sits BEHIND all the people and furniture. It NEVER comes out of
a person's body or mouth, NEVER curls into a loop or a spiral, NEVER crosses a face, and NEVER
turns into steam, smoke, sparkles or stars.

REFERENCE IMAGES — TWO reference pictures are attached, and they are for two different things.
  • REFERENCE 1 (a dental sedation room). USE IT ONLY for what is in panel 3: which people and
    which equipment belong in a paediatric dental sedation room (the sleeping child on the
    treatment chair under a light blanket, the drip stand, the vital-signs monitor, the
    paediatric dentist working at the child's head, the anaesthesia staff beside the monitor).
    DO NOT copy its drawing style, its colours, its rendering, its shading, its clock, its
    flying tooth fairies, or the numbers on its monitor screen.
  • REFERENCE 2 (two people in printed scrubs). USE IT ONLY for TWO PRINTED FABRICS — the
    pine-tree cloth on the man and the dinosaur cloth on the woman: their motifs and their two
    colours. ⚠ DO NOT copy anything else from it: not its composition, not the phone, not the
    gestures, not the other people at its edges, and ESPECIALLY NOT THE HEADWEAR — in that
    picture the man's cap is plain teal and the woman has no cap at all, and in YOUR picture
    both of them wear a cap cut from their own printed cloth. ⚠ DO NOT copy the DENSITY of its
    prints either; see the rule on print scale below.

The style of the picture you draw is defined entirely by the STYLE section below.

=====================================================================
⚠⚠⚠ READ THESE THREE LISTS BEFORE DRAWING ANY FACE.
Three people each appear in more than one panel. THEIR FACES ARE DELIBERATELY DIFFERENT FROM
PANEL TO PANEL, and no expression or pose may be copied from one panel into another. ALL OF
THEM MATTER EQUALLY; give each face the same care.

THE BOY'S FOUR FACES (he is in all four panels)
  • PANEL 1 — SHAKEN, AND ONE CHEEK IS SWOLLEN. Standing, pressed against his mother's side,
    BOTH HANDS gripping her clothes, shoulders drawn up. Eyes open and round, the rims a little
    pink. Mouth closed in a small tight line. HE IS NOT CRYING AND THERE ARE NO TEARS — he has
    already stopped; this is the moment just after.
    ⚠ HIS LEFT CHEEK (the viewer's right) IS PUFFY because of a bad tooth. Draw it with TWO
    things only: (a) the OUTLINE of the lower half of that side of his face bulges outward in a
    soft curve, clearly wider than the other side; (b) over that bulge, ONE SOFT PATCH OF WARM
    RED — BIGGER and LOWER than a blush patch, sitting over the jaw and lower cheek. The other
    cheek keeps its small ordinary round pink blush. DO NOT draw the swelling with shading, a
    gradient, a shadow or extra lines — outline and one flat patch of colour only.
  • PANEL 2 — RELAXED AND BUSY. Sitting on the floor playing with wooden blocks, seen from the
    side. Eyes down on the toy, mouth slightly open, shoulders loose. He is not paying any
    attention to the adults. Completely untroubled. HIS FACE IS BACK TO NORMAL — no swelling.
  • PANEL 3 — ASLEEP. Lying on the treatment chair, eyes CLOSED (each eye a simple closed
    curve), mouth slightly open, face completely smooth, a light blanket up to his chest, one
    foot showing at the end of the chair with a small sensor taped to it. Peaceful. NOT
    frightened, NOT grimacing.
  • PANEL 4 — HALF AWAKE. Draped over his father's shoulder, cheek against it, hair slightly
    messy. Eyes HALF CLOSED (each eye a shallow droopy curve), mouth closed and soft. Drowsy
    and safe.

THE MOTHER'S THREE FACES (panels 1, 2 and 4 — SHE IS NOT IN PANEL 3)
  • PANEL 1 — WORRIED. Crouching or sitting beside the boy, one arm around him. Inner ends of
    the eyebrows RAISED, mouth closed in a short line, eyes on the paediatric dentist. Not
    smiling, not angry, not crying.
  • PANEL 2 — FOCUSED. Sitting at the dining table, a phone held to her ear with one hand, a
    pen in the other. Eyebrows LEVEL, mouth slightly OPEN because she is speaking. Neither
    worried nor smiling — she is concentrating.
  • PANEL 4 — RELIEVED. Standing, SHOULDERS CLEARLY DROPPED AND RELAXED, eyes on the two
    doctors, mouth open with BOTH CORNERS CURVING UP. She is the one person in the whole
    picture who is plainly smiling with an open mouth.

THE FATHER'S THREE FACES (panels 1, 2 and 4 — HE IS NOT IN PANEL 3)
  • PANEL 1 — CONCERNED. Standing behind the mother, one hand on her shoulder. Mouth closed,
    inner ends of the eyebrows slightly raised, eyes on the dentist.
  • PANEL 2 — LEANING IN. Sitting beside her, head tilted towards the phone, one finger
    resting on the paper on the table, mouth closed, eyebrows level.
  • PANEL 4 — CARRYING HIS SON. Both arms holding the boy against his shoulder, a small
    relaxed CLOSED-MOUTH smile, eyes on the doctors.

SELF-CHECK — before you finish, put the boy's four faces side by side and read them in order:
  1st — eyes open, tight mouth, ONE CHEEK CLEARLY PUFFY AND RED, NOT crying.
  2nd — looking down at a toy, at ease, face normal on both sides.
  3rd — eyes fully closed, mouth slightly open, completely smooth.
  4th — eyes half closed and droopy, on his father's shoulder.
If any two of the four look the same, the drawing is wrong. Then check that the MOTHER and the
FATHER DO NOT APPEAR AT ALL in panel 3, and that the mother is smiling ONLY in panel 4.
=====================================================================

STYLE. Contemporary printed-magazine editorial illustration, hand-made throughout. Linework in
warm dark brown or soft charcoal, NEVER pure black: thin, hand-drawn, the weight visibly varies
along a stroke, strokes taper and sometimes break and run dry at the end. Colour applied like
soft coloured pencil and light marker; colour edges a little loose. Flat fills with two or
three tones per hue — no gradients, no airbrush, no glow. A fine even paper grain over every
surface.

⚠⚠ OVERALL COLOUR — THE THREE CLINIC PANELS ARE BRIGHT, CLEAN AND AIRY, NOT YELLOW.
Panels 1, 3 and 4 are lit like a well-lit modern clinic: the walls are VERY PALE and READ AS
CLEAN — a soft near-white with only the faintest cool tint of mint or pale sky, never cream,
never beige, never butter, never amber. Cabinets, worktops and equipment are white and very
pale grey. The floor is a pale cool grey or a very light grey-toned wood. ⚠ Do NOT flood these
three panels with warm yellow light and do NOT paint a band of amber along the lower wall. The
warm colours in these panels are LOCAL AND SMALL ONLY: the wooden toys, a wooden stool, the
dentist's printed fabric, a plant pot.
⚠ BUT THE WALLS ARE NOT BLANK WHITE PAPER — they always carry something: a cabinet, a shelf, a
window, a washbasin. Pale, clean, and furnished.
PANEL 2 (the home) IS THE EXCEPTION and is the only warm panel: warm wood, a warm lamp.

FACES AND HANDS. Every face and every hand is ONE single flat tone: no shading, no cheekbones,
no jawline. On a face draw ONLY these six things plus blush: the outline of the head, the eyes,
the eyebrows, the nose, the mouth, the ears — and two soft round patches of warm pink blush
high on each cheek. An eye is one small dark curved mark. NO eyelashes, NO whites of the eyes,
NO catchlights, NO eyelid crease, NO wrinkle, NO line beside the nose, NO shadow under the eye.
Hair is two or three flat shapes and stays very dark. IF A FACE LOOKS LIKE A PORTRAIT, IT IS
WRONG. Every person has exactly two hands and two arms, and every hand that touches another
person can be traced along a visible arm back to its own shoulder. No spare hand, no floating
hand, no sleeve without an arm in it.

EVERYONE IN THIS PICTURE IS TAIWANESE.

ECONOMY OF LINE. Each object is drawn with the fewest strokes that still make it recognisable.
The rooms are LESS detailed than the people, but they are clearly dental rooms.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No letters, no numbers, no words, no logos, no
labels. In particular: THE MONITOR SCREEN IN PANEL 3 SHOWS ONLY THREE SIMPLE COLOURED WAVY
LINES AND NOTHING ELSE — no digits, no readouts. Every sheet of paper and every clipboard is
BLANK. There is NO CLOCK anywhere in the picture.

MASKS AND GLOVES — this matters and applies differently per panel.
  • PANEL 3 ONLY: ALL THREE STAFF WEAR A PLAIN SURGICAL FACE MASK covering nose and mouth, and
    ALL THREE WEAR THIN MEDICAL GLOVES. The masks are plain, single-colour and un-patterned (the printed cloth is their clothing,
    never their mask);
    the EYES AND EYEBROWS STAY FULLY VISIBLE above them, and every one of the three still reads
    as calm and attentive.
  • PANELS 1, 2 AND 4: NOBODY WEARS A MASK AND NOBODY WEARS GLOVES — every face is fully
    visible and every hand is a bare hand. ⚠ In panel 4 the anaesthetist holds a sheet of paper
    with BARE HANDS; he must not be wearing gloves.

CLOTHING — fixed, and the same in every panel the person appears in.
  • THE MOTHER — dusty-rose blouse.
  • THE BOY — sage-green T-shirt and dark shorts.
  • THE FATHER — muted slate-blue shirt with the sleeves rolled to the forearm, dark grey
    trousers.
  • THE PAEDIATRIC DENTIST — a woman in her thirties, hair tied back. Her TIE-BACK SURGICAL
    CAP, top and trousers are all cut from ONE printed fabric: warm off-white cloth (#f4ead8)
    with SIMPLE FLAT CHILDLIKE DOODLES — bears, chicks, clouds, stars, small flowers — in ONLY
    amber (#c28229) and deep caramel (#9e6301), BIG AND FEW; over it a WHITE CLINICAL COAT
    hanging open and unbuttoned.
  • THE ANAESTHETIST — a man in his forties, PINE-TREE PRINTED SCRUBS, taken from reference
    image 2: little pine trees, round bushes and tiny triangles, SIMPLE FLAT TWO-COLOUR SHAPES
    in deep teal (#317d78) and off-white, on A PALE TINT OF THAT SAME TEAL. ⚠ HIS TIE-BACK
    SURGICAL CAP IS CUT FROM THE SAME PINE-TREE CLOTH — not a plain teal cap. No white coat.
  • THE ANAESTHESIA NURSE — a woman, DINOSAUR PRINTED SCRUBS, taken from reference image 2: a
    long-necked dinosaur, a spotted plated dinosaur and a small flying one, SIMPLE FLAT
    TWO-COLOUR SHAPES in deep blue (#4478b5) and off-white, on A PALE TINT OF THAT SAME BLUE.
    ⚠ HER TIE-BACK SURGICAL CAP IS CUT FROM THE SAME DINOSAUR CLOTH. No white coat.
⚠ ALL THREE STAFF WEAR A PRINTED CLOTH, AND EACH ONE'S CAP MATCHES THEIR OWN TOP AND TROUSERS.
THE TWO TEAMS ARE STILL TOLD APART AT A GLANCE: the dental side's print is WARM (amber and
caramel on off-white), the anaesthesia side's prints are COOL (teal pine trees, blue dinosaurs).
Keep that separation in every panel.
⚠⚠ PRINT SCALE — THE EASIEST THING TO GET WRONG. Every one of the three prints must be BIG AND
FEW, NOT small and busy. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a
clear gap of about the same size between motifs, so only THREE OR FOUR MOTIFS are visible across
a chest. Each person here is only a quarter of the picture, so a dense print turns into grey
speckle. Each print uses ONLY its own two colours. No letters or numbers inside any pattern.

PANEL 1 (TOP LEFT) — THE RECOMMENDATION. A bright, clean children's dental treatment room, just
after a short procedure. On the LEFT the PAEDIATRIC DENTIST sits on a low round stool, BOTH FEET
ON THE FLOOR, leaning forward, one hand open palm-up, talking gently to the parents, no mask, no
gloves. On the RIGHT the MOTHER, the BOY and the FATHER stand together as one group, faces as
described above. DENTAL DETAIL, drawn simply but unmistakably: a proper dental chair with a
headrest and a swing-out instrument arm with hoses, a small tray table beside it, an overhead
operating light folded up out of the way, a white wall cabinet with a worktop, a washbasin with
a tall tap. Plus a basket of wooden toys and a height chart with NO numbers on it.

PANEL 2 (TOP RIGHT) — THE PHONE CALL. The family's home, the one warm panel: a wooden dining
table, a hanging lamp above it, a potted plant, a sofa behind. The MOTHER sits at the table with
a phone to her ear and a pen in her other hand; a BLANK sheet of paper and a small card lie on
the table in front of her. The FATHER sits beside her leaning in. The BOY plays with wooden
blocks on the floor in the foreground. FLOATING ABOVE AND BESIDE THE PHONE, a single hand-drawn
ROUND SPEECH BUBBLE with its tail pointing at the phone: inside it, head and shoulders of THE
ANAESTHETIST in his plain teal scrubs and cap, NO MASK, holding a telephone handset to his ear,
looking down at a BLANK sheet of paper, friendly and attentive. The bubble is plain white with a
thin hand-drawn outline and contains nothing else.

PANEL 3 (BOTTOM LEFT) — THE TREATMENT. The same bright clean dental room, busiest panel of the
four, ALL THREE STAFF MASKED AND GLOVED. Arranged across the width: the BOY ASLEEP on the
treatment chair under a light blanket in the centre; the PAEDIATRIC DENTIST at his head on the
left, leaning in, working calmly with a small mirror in one hand; the ANAESTHETIST standing just
behind the child's head, one hand on the controls of the vital-signs monitor, HIS EYES ON THE
CHILD, not on the machine; the ANAESTHESIA NURSE standing on the right holding a clipboard and
writing on it. EQUIPMENT: a drip stand with a bag and a line running down to the child's arm;
the vital-signs monitor on a slim trolley, ITS SCREEN SHOWING ONLY THREE SIMPLE COLOURED WAVY
LINES; the dental unit's instrument arm with its hoses and a suction tube; a tray of instruments
on a small table; the overhead operating light angled down over the child; a white cabinet run
along the back wall. ⚠ NO PARENTS IN THIS PANEL AT ALL — exactly four people: the boy and the
three staff. Everyone is calm and unhurried; this is routine work, not an emergency.

PANEL 4 (BOTTOM RIGHT) — AFTERWARDS. A bright, clean corner of the same clinic. On the LEFT the
PAEDIATRIC DENTIST and the ANAESTHETIST stand side by side facing the parents, NO MASKS AND NO
GLOVES, both warm and unhurried; the dentist is speaking with one hand open, the anaesthetist
holds a BLANK sheet of paper in his BARE HANDS at waist height and is nodding. On the RIGHT the
FATHER carries the sleepy BOY against his shoulder, and the MOTHER stands beside them, relieved
and smiling. Room: pale clean walls, a low white cabinet, a washbasin, a potted plant, a window
with a white frame letting in soft daylight.

CROP SAFETY — this picture will sometimes be shown cropped to a wide band, so KEEP EVERY FACE
AND EVERY IMPORTANT OBJECT OUT OF THE TOP 13% AND THE BOTTOM 13% OF THE WHOLE IMAGE. In the top
two panels push the heads down a little; in the bottom two panels lift them a little.

LIGHT AND COLOUR. Panels 1, 3 and 4 are bright, clean and cool-leaning, lit by even daylight;
panel 2 (the home) is warm, lit by the lamp over the table. The cool prints of the anaesthesia team
(teal pine trees and blue dinosaurs), the wavy lines on the monitor and the pale mint-teal ribbon
of air are the cool notes that tie the four panels together, and they should read as quiet, not
bright.

AVOID — any writing, letters, numbers, digits or logos anywhere; numbers or readouts on the
monitor screen; writing on any paper or clipboard; a clock; warm yellow or cream walls in panels
1, 3 and 4; a band of amber along the lower wall; a whole panel flooded with yellow light; blank
white featureless walls; gloves on anyone in panels 1, 2 or 4; a mask on anyone in panels 1, 2
or 4; an unmasked or ungloved person in panel 3; a child crying, screaming, held down or
restrained; tears; anyone looking alarmed, rushed or panicked; the parents appearing in panel 3;
the mother smiling in panel 1 or panel 2; the same expression on the boy in more than one panel;
the boy's cheek still swollen in panels 2, 3 or 4; swelling drawn as shading or a gradient; a
fifth person in panel 3; a third hand, a spare hand or a floating hand on anyone; the ribbon of
air coming out of a person, curling into a loop, crossing a face, or turning into steam, smoke,
sparkles or stars; anything other than the ribbon crossing the two dividing lines; thick white
gutters between the panels; blood; an anatomical or textbook diagram; a cross section; teeth
drawn on their own; photorealism; a portrait-like face; grey-scale; a border or frame around the
whole image.
```
