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
