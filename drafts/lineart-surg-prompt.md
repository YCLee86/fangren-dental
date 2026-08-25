# 口腔外科的線稿底圖（`lineart-surg`）—— 提示詞與交接

2026-08-25 開。**分享圖已定案上線**（`assets/og-topic-surg.jpg`，十六輪，
推導在 `og-topic-surg-prompt.md`），所以順序上輪到線稿了
（規矩：**分享圖在前、線稿在後**，因為線稿要從分享圖裁姿勢／長相參考）。

使用者指定的內容：

> 「著陸頁的線稿另外畫，是**插圖中的女醫師（鮑伯頭戴醫師帽）**，
> 　**一手叉腰、一手把比較小台的潛盾扛在肩膀上**，覺得**自信輕鬆露齒燦爛笑**。」

## 這一輪特別要注意的三件

1. ⚠⚠ **這一張沒有現成的姿勢參考。** 前四科的姿勢都是從該科分享圖裁一段
   （模板第 6 張），但「叉腰 ＋ 扛機器」是**新的動作**，分享圖裡沒有。
   → 附的那張 `drafts/surg-lineart-pose-ref.jpg` 只提供**長相／髮型／帽子／服裝／機器造型**，
   **姿勢必須用幾何寫死**（角度、高度、朝向），這正是模板裡那張「文字描述動作一定會漂」的表
   在講的事，所以下面 WHO 那一段寫得比前四科都長。
2. ⚠⚠ **「露齒燦爛笑」是使用者指定的例外。** 這一站的五官規格是「眼睛小圓點、
   嘴一條短線」（ILLUSTRATION.md 第十二節、模板 FACES 那一段），分享圖那一側甚至明文
   `never a wide toothy grin`。這一張**破例**：嘴是張開的大弧，**用兩三筆短線暗示牙齒**，
   仍然是線稿（不填色、不畫牙齦、不畫每一顆牙）。**是使用者要的，不要退回去。**
3. **她要面向畫面左邊**（＝朝著版面裡的文字）。底圖擺在介紹區右下角，
   人物朝右等於背對整頁的字（牙周那一輪就是為了這件事才 `--flip`）。
   這一張直接畫成朝左，**出圖後就不必翻**。

## 這一科的臨界濃度（現算，不要抄別科）

柔墨 `#5c5f57` 壓在「紙色 ＋ 套色 `#8e6299` 按濃度混合」的底上，剛好掉到 4.5 的濃度：

| 科 | 一般 | 牙周 | 根管 | 兒牙 | 矯正 | 植牙 | **口外** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 柔墨 4.5 的臨界濃度 | .101 | .116 | .107 | .152 | .120 | .097 | **.118** |

（同一支算式把前六科的紀錄值一個不差地重算出來，所以 .118 可以直接用。）
深墨 `#2a2c27` 的臨界是 **.718** —— 只壓到深墨的位置（`.tp-reply`／`.tp-close`）就寬鬆得多。

## 要附的圖（三組，說明分開寫）

| # | 檔案 | 這一張只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）；不要參考題材、人物、道具。」 |
| 6 | `drafts/surg-lineart-pose-ref.jpg` | **長相・髮型・帽子・服裝・機器造型** | 「人物的臉、鮑伯頭與紫色綁帶手術帽、白袍與刷手服、以及那台潛盾機的造型照這張；**姿勢完全不要照它**（那張是雙手推機器），畫法照 1~5。」 |
| 7 | `assets/og-topic-surg.jpg` | **年齡層與整體氣質** | 「年齡層與氣質照這張，但畫法完全不同 —— 那張是上色插畫。」 |

## 提示詞（2026-08-25 第一版，可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair, cap and clothing.

WHO — one woman oral surgeon from a small Taiwanese neighbourhood dental clinic, seen from
the waist up, standing still and relaxed, carrying a small tunnelling machine on one
shoulder. Her face, hair, cap, clothes and the machine's design come from the attached
colour illustration; the drawing style comes only from the line-art references; and the
POSE below is new — follow the geometry exactly, it is not in any reference.

  - She is turned in THREE-QUARTER VIEW towards the LEFT of the picture: her shoulders are
    at an angle, not square to the viewer, and her face points forward and slightly to the
    LEFT. She is NOT looking at the viewer.
  - HER LEFT ARM (the far one, on the right of the picture) IS RAISED TO HER SHOULDER: the
    upper arm hangs close to her body, the forearm rises so the hand sits just above the
    shoulder, and the fingers curl over the top of the machine's cylinder to steady it. The
    wrist is relaxed.
  - THE MACHINE RESTS ACROSS THAT SHOULDER like a rolled-up mat: its cylinder lies at about
    a 25 degree angle, rising from her shoulder backwards and upwards, so the round cutter
    disc sits BEHIND HER HEAD at about the height of her ear and slightly higher than her
    cap. The cutter disc faces backwards, away from her face and away from the viewer, and
    is seen at an angle as an ellipse. Nothing rests on her head.
  - HER RIGHT ARM (the near one, on the left of the picture) IS ON HER HIP: the hand sits on
    the waist with the fingers forward and the thumb behind, and the elbow points clearly
    OUT AND BACK so the arm makes an open triangle with her body.
  - Her weight is on one leg so the hips tilt very slightly. The posture is easy and
    confident: shoulders down and level, chin level, back straight but not stiff. She is
    NOT straining, NOT leaning under a weight, NOT flexing, NOT posing like a strongman or a
    superhero.

THE MACHINE — a SMALL, light hand-held tunnelling machine, clearly a scaled-down version of
the one in the attached colour illustration: a short smooth cylinder about as long as her
forearm and about as wide as her head, with two or three clean straight seam lines and a
row of small round bolt heads along each seam, a slim grip underneath, and at its far end a
round cutter disc whose face carries a ring of small circles and a few straight spokes. It
is drawn in OUTLINE ONLY, no filled areas, no glow, no motion lines, no dust, no hose, no
cable. It is a friendly piece of engineering equipment, never a weapon.

FACES — extremely simple: the eyes are two short upward curves, as in a warm smile; the
nose is one tiny stroke. No eyebrow detail, no eyelashes, no blush, no wrinkles.
THE MOUTH IS THE EXCEPTION IN THIS DRAWING AND MUST BE DRAWN AS DESCRIBED: she is smiling
broadly with her mouth open — a wide, generous curved shape with TWO OR THREE SHORT STROKES
INSIDE IT to suggest the upper teeth. Nothing is filled in: no black mouth, no shaded
tongue, no gum line, no individually drawn teeth. It should read as a bright, delighted,
open smile in pure line.

HAIR AND CAP — she has a SHORT BOB that ends at the jaw with a soft fringe, and she wears a
soft tie-back surgical cap pushed back on her head so the fringe and the ends of the bob
show clearly in front of it and below it, with two short ties at the back. Hair and cap are
drawn as OUTLINES ONLY with a few interior strokes for the parting and the fabric folds —
neither is filled in.

CLOTHES — an OPEN white coat worn over a V-neck scrub top, with a chest pocket on the coat.
Outline only, with a few clean folds; no texture, no patterning, no filled areas.

COMPOSITION — the figure and the machine together occupy the middle of the square and about
70% of its height, with generous empty margin on all four sides. She is cropped at the
waist by a clean horizontal edge at the bottom — no legs, no belt detail. Nothing crosses
the outer margin.

BACKGROUND — completely empty. No tunnel, no soil, no room, no floor, no wall, no ground
line, no furniture, no plants, no speech bubbles, no icons, no arrows, no text, no logo, no
sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #8e6299, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

---

## 第二版：要畫到腳（2026-08-25）

使用者：「**蠻好的誒，不過少了下半身。**」

### v1 的量測（門檻只差一項）

| | v1 | 門檻 |
| --- | --- | --- |
| 線佔畫面 | **6.99%** | 4~6%（略高） |
| 筆畫寬中位 | 6px＝5.9‰ | 4~6‰ ✓ |
| 粗細一致 | 1.17 | < 2.5 ✓ |
| 實心填色 | 0 塊 | 0 ✓ |
| 四角乾淨 | 四角都 0 | ✓ |

⚠ **線佔 6.99% 偏高的成因就是「只有上半身」** —— 人物把畫面塞滿了。
畫到腳之後同樣的線會分散到更大的面積，這一項應該會自己落回 4~6%。

### 這一版改的（其餘逐字不動）

- **畫全身**：從頭到鞋子，不要在腰部裁掉。模板那句
  「cropped at the waist … no legs」是給前四科的，**這一科由使用者指定破例**
  （植牙那一輪也破過同一條）。
- **站姿寫成幾何**：重心在一腳、那一側的髖略高、另一腳膝蓋放鬆微屈、腳尖略朝外；
  刷手服長褲、素面球鞋。
- **不要地面線、不要影子** —— v1 底下那一條橫線要拿掉（不然還要靠 `--crop` 裁）。
- 人物在畫面裡佔約 **85% 高**（上半身版是 70%）。

---

## 第三版：腿的比例（2026-08-25）

使用者：「**腿的長度偏短，比例怪怪的。**」

### v2 的量測

| | v2 | 門檻 |
| --- | --- | --- |
| 線佔畫面 | **3.25%**（v1 是 6.99） | 4~6% |
| 筆畫寬中位 | 3px＝**2.9‰** | 4~6‰ |
| 粗細一致 | 1.67 | < 2.5 ✓ |
| 實心填色 | 0 塊 | ✓ |

⚠ **畫到腳之後線一次掉太多**：人物變細長、筆畫也跟著變細（5.9‰ → 2.9‰）。
兩件要在 v3 一起講回來。

### 腿為什麼看起來短（不是腿真的畫短，是被蓋住）

白袍畫成**及膝以下**，大腿整段被蓋住，露出來的只有小腿 ——
所以視覺上「腿 ＝ 小腿」。修法有兩條，兩條都要寫：

1. **白袍下擺收到膝蓋上方**（大腿露出來）。
2. **比例用幾何寫死**：全身高 ＝ **七個頭**；**胯下正好在全身高的一半**
   （腳底到頭頂量）；**膝蓋在胯下與腳底的正中間**；腳踝在鞋口上方看得到一小段。

⚠ 這是這一輪第三個「模型對百分比沒反應、對『和某某一樣長』有反應」的例子 ——
所以寫成「胯下到腳底 ＝ 胯下到頭頂」，不要寫「腿佔 50%」。

## 第四版：潛盾像電風扇（2026-08-25）

使用者：「**比例好多了，但潛盾變得像電風扇。**」

### v3 的量測（五項全部過門檻，所以問題純粹是造型）

| | v3 | 門檻 |
| --- | --- | --- |
| 線佔畫面 | 3.88%（v2 是 3.25） | 4~6%（略低，可接受） |
| 筆畫寬中位 | 5px＝**4.9‰**（v2 是 2.9） | 4~6‰ ✓ |
| 粗細一致 | 1.20 | < 2.5 ✓ |
| 實心填色 | 0 塊 | ✓ |
| 四角乾淨 | 四角都 0 | ✓ |

腿的比例、白袍長度、叉腰的手肘、露齒笑**全部到位**，這一版只有機器要改。

### 為什麼會變成電風扇（三個成因，缺一不可）

把 v3 的機器和分享圖裡那一台並排量，差別是三件事 ——
**每一件單獨都不足以變成電風扇，三件湊齊就是**：

1. **刀盤畫成正圓、而且是全站最大的一個圓**（比她的頭還大），
   筒身反而縮成一根細管 —— **主體與配件對調了**。
2. **細長的輻條從正中央一個小圓往外放射** ＝ 電風扇／輪子的核心特徵。
   分享圖那一台其實也有輻條，但它**貼在一個又胖又長的鼓身上**，
   所以讀起來是機器；v3 的圓盤和筒身之間還有一段空隙，等於把圓盤架在一根棒子上。
3. **刀盤正面朝向我們**。正面朝我們的圓 ＋ 輻條，就是電風扇的正面照。

### 這一版改的（其餘逐字不動）

- **主角換成筒身**：胖鼓一節，**側面看**，長度＝她的前臂、粗細＝她的頭，
  長直的兩側是整台機器最大的形狀；靠近肩膀的那一端收成較細的尾管＋握把。
- **切削端轉開，只看得到窄窄的一道**：畫成**扁橢圓**（寬只有高的四分之一），
  **緊貼**在筒身末端、中間沒有空隙也沒有支架；外面套一圈略寬的凸緣（前盾環）。
- **明文禁止「從中心點往外拉的長線」** —— 沒有輪轂、沒有輻條、沒有葉片、沒有柵格；
  可見的那道窄面上只放五六顆小橢圓（滾刀）和最多兩根短粗的橫桿。
- **`AVOID` 清單逐項寫出來**：電風扇、立扇、扇葉、螺旋槳、船舵、腳踏車輪、
  輻條車輪、紡車、太陽芒、由下往上看的傘、圓形柵格。
- ⚠⚠ **要講明「附的彩色插圖裡那一台是正面朝我們的，這一張不是」** ——
  參考圖本身就有輻條正面，不講清楚等於一邊禁止一邊給範例。

⚠ 通則（第四次遇到「講規格沒用、講東西才有用」）：
**要模型不要畫成 A，光寫 `not A` 不夠，得同時把 B 的形狀寫死**
（這裡是「扁橢圓、貼著筒身、外面一圈凸緣」），再把 A 連同它的近親一起列進 AVOID。

### v4 提示詞（只有 THE MACHINE 那一段與姿勢裡提到刀盤的那一句換掉）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair, cap and clothing.

WHO — one woman oral surgeon from a small Taiwanese neighbourhood dental clinic, drawn FULL
LENGTH from the top of her head to the soles of her shoes, standing still and relaxed,
carrying a small tunnelling machine on one shoulder. Her face, hair, cap, clothes and the
machine's design come from the attached colour illustration; the drawing style comes only
from the line-art references; and the POSE and PROPORTIONS below are new — follow the
geometry exactly, they are not in any reference.

  - PROPORTIONS: she is seven heads tall. The crotch is exactly halfway between the soles of
    her shoes and the top of her head. The knee is exactly halfway between the crotch and the
    sole. A short length of ankle shows above the shoe.
  - She is turned in THREE-QUARTER VIEW towards the LEFT of the picture: her shoulders are
    at an angle, not square to the viewer, and her face points forward and slightly to the
    LEFT. She is NOT looking at the viewer.
  - HER LEFT ARM (the far one, on the right of the picture) IS RAISED TO HER SHOULDER: the
    upper arm hangs close to her body, the forearm rises so the hand sits just above the
    shoulder, and the fingers curl over the top of the machine's drum to steady it. The
    wrist is relaxed.
  - THE MACHINE RESTS ACROSS THAT SHOULDER like a rolled-up mat: the drum lies at about a 25
    degree angle, rising from her shoulder backwards and upwards, so its far end sits BEHIND
    HER HEAD at about the height of her ear and slightly higher than her cap. That far end is
    turned away from her face and away from the viewer, so we see only the narrow edge of it.
    Nothing rests on her head.
  - HER RIGHT ARM (the near one, on the left of the picture) IS ON HER HIP: the hand sits on
    the waist with the fingers forward and the thumb behind, and the elbow points clearly
    OUT AND BACK so the arm makes an open triangle with her body.
  - Her weight is on one leg, so that hip is slightly higher and the other knee is slightly
    bent and relaxed, with the toes turned a little outwards. The posture is easy and
    confident: shoulders down and level, chin level, back straight but not stiff. She is
    NOT straining, NOT leaning under a weight, NOT flexing, NOT posing like a strongman or a
    superhero.

THE MACHINE — a SMALL hand-held tunnelling shield machine, a scaled-down version of the one
in the attached colour illustration.
ITS MAIN SHAPE IS A FAT DRUM, NOT A DISC. Draw a stubby cylinder lying along her shoulder
and seen FROM THE SIDE, about as long as her forearm and about as thick as her head, so the
two long straight sides of the drum are the biggest shape in the whole machine. The near
end, the one resting in front of her shoulder, narrows into a shorter tail piece with a slim
grip underneath. Two or three straight seam lines run around the drum, each with a row of
small round bolt heads.
THE FAR END, THE CUTTING END, IS TURNED AWAY FROM US AND IS THEREFORE SEEN ALMOST EDGE ON.
Draw it as a NARROW ELLIPSE — a flattened oval no wider than the drum and only about a
quarter as wide as it is tall — sitting flush against the end of the drum, with no gap and
no stalk or shaft between them. Around that ellipse draw one slightly wider raised rim ring,
the shield ring. Inside the thin sliver of face that is still visible, draw five or six small
ovals spaced around the rim and at most two short stubby bars near the middle.
NEVER DRAW LONG THIN LINES RUNNING FROM A CENTRE POINT OUT TO A RIM. There is no hub, no
spokes, no blades, no vanes, no grille, no cage.
In the attached colour illustration the machine happens to be pointing towards the viewer so
its round cutting face is fully visible; in THIS drawing it is turned away, so copy the drum,
the seams and the bolts from it, but NOT that face.
AVOID AT ALL COSTS: an electric fan, a standing fan, fan blades, a propeller, a ship's wheel
or helm, a bicycle wheel, a spoked wagon wheel, a spinning wheel, a sunburst, an umbrella
seen from below, a round grille.
It is drawn in OUTLINE ONLY, no filled areas, no glow, no motion lines, no dust, no hose, no
cable. It is a friendly piece of engineering equipment, never a weapon.

FACES — extremely simple: the eyes are two short upward curves, as in a warm smile; the
nose is one tiny stroke. No eyebrow detail, no eyelashes, no blush, no wrinkles.
THE MOUTH IS THE EXCEPTION IN THIS DRAWING AND MUST BE DRAWN AS DESCRIBED: she is smiling
broadly with her mouth open — a wide, generous curved shape with TWO OR THREE SHORT STROKES
INSIDE IT to suggest the upper teeth. Nothing is filled in: no black mouth, no shaded
tongue, no gum line, no individually drawn teeth. It should read as a bright, delighted,
open smile in pure line.

HAIR AND CAP — she has a SHORT BOB that ends at the jaw with a soft fringe, and she wears a
soft tie-back surgical cap pushed back on her head so the fringe and the ends of the bob
show clearly in front of it and below it, with two short ties at the back. Hair and cap are
drawn as OUTLINES ONLY with a few interior strokes for the parting and the fabric folds —
neither is filled in.

CLOTHES — an OPEN white coat that ends ABOVE THE KNEE so the whole thigh is visible, worn
over a V-neck scrub top, with a chest pocket on the coat. Below it, straight scrub trousers
and plain lace-up trainers. Outline only, with a few clean folds; no texture, no patterning,
no filled areas.

COMPOSITION — the figure and the machine together occupy the middle of the square and about
85% of its height, with generous empty margin on all four sides. Nothing crosses the outer
margin.

BACKGROUND — completely empty. No tunnel, no soil, no room, no floor, no wall, no ground
line, no shadow under her shoes, no furniture, no plants, no speech bubbles, no icons, no
arrows, no text, no logo, no sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #8e6299, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

---

## 第五版：整個風格歪掉（2026-08-25）

使用者：「**整個風格歪掉欸，重弄吧，仔細確認提示詞。**」

### v4 的量測 —— 五項門檻其實都過，所以「歪掉」不在數字上

| | v3 | **v4** | 門檻 |
| --- | --- | --- | --- |
| 線佔畫面 | 3.88% | 4.56% | 4~6% ✓ |
| 筆畫寬中位 | 4.9‰ | 4.9‰ | 4~6‰ ✓ |
| 粗細一致 | 1.20 | **1.60** | < 2.5（變差但沒破） |
| 實心填色 | 0 | 0 | ✓ |
| 四角乾淨 | 0 | 0 | ✓ |

**這一輪的教訓就是這個**：`lineart-measure.mjs` 只看得到「線畫得乾不乾淨」，
看不到「畫的是什麼、誰是主角」。內容那一側只能逐條看圖。

### 歪掉的是四件事，成因同一個

1. ⚠⚠ **機器變成主角。** 墨的界框 185~732 × 60~967，機器橫跨 **547px 寬（畫面的 53%）**、
   佔掉整個上半部；筒身長度約 **3.9 個頭高**，而提示詞寫的是「＝她的前臂」（約 1.2 個頭）——
   **大了三倍**。
2. **尾端那個「slim grip / tail piece」被畫成一根伸到畫面外緣的細長砲管**，
   整台讀起來是火箭筒或望遠鏡。
3. **切削端還是正面朝我們的大橢圓**，只是從輻條換成條紋 —— 電風扇沒了，變成砲口。
4. ⚠ **她轉向畫面右邊了**（v3 是朝左）。底圖擺在介紹區右下角，朝右＝背對整頁的字。
5. 螺栓畫成幾十顆小圓點、鞋帶與手指的線都變多 —— **細節密度超過那五張風格參考**，
   這才是「風格歪掉」四個字最直接的來源。

**成因是同一個：我把 THE MACHINE 那一段寫成整份提示詞裡最長的一段**
（v4 那一段 240 個字，比 WHO 還長）。

⚠⚠⚠ **通則（這一站第一次記下來）：提示詞裡哪一段字最多，模型就把哪一個當主角。**
上一輪為了治「電風扇」把機器寫得鉅細靡遺，等於同時在說「這張圖是在畫這台機器」。
**要治造型，靠的是把形狀寫死＋列 AVOID，不是靠字數。**

### 逐條確認提示詞之後，另外抓到三個自己寫壞的地方

1. ⚠ **COMPOSITION 寫的是「the figure and the machine together occupy about 85%」** ——
   機器一大，人就被擠小，而且完全合乎字面。改成 **「她自己（頭頂到鞋底）佔 85%」**，
   機器多大都不會壓縮到人。
2. ⚠ **「a narrow ellipse … no wider than the drum and only about a quarter as wide as it
   is tall」** —— 橢圓的「寬」在這裡指的是短軸，但這句話同時出現「不比筒身寬」，
   讀起來像在講外徑。改成拿筒身當尺：**「橫過去的那一道約等於筒身直徑的四分之一」**。
3. ⚠ **「narrows into a shorter tail piece with a slim grip underneath」** ——
   「narrow」「slim」「tail」三個字加起來就是一根細管。改成
   **「筒身的軸線方向不准有任何東西伸出去；握把是筒身底下一小截短粗的把手」**。

### 這一版改的

- **THE MACHINE 收成四句**（比 WHO 短），並在開頭寫明 **她是主角、機器是小道具**。
- **尺寸鎖死在她身上**：整台（含握把）**不超過她的上臂長、不比她的頭粗**，
  而且**明講它在畫面裡佔的面積要遠小於她**。
- **細節上限逐項寫出來**：兩條接縫、約六顆螺栓、一圈凸緣、可見窄面上三四顆小橢圓，
  **不准再多**。（同一條也治「細節密度超過參考圖」。）
- **朝向補一道可檢查的敘述**：鼻子、笑容與帽子的前緣都在她頭部的**左半邊**。
- **AVOID 壓成一行**，電風扇那一族留著，另外補上火箭筒、望遠鏡、砲管。
- 加一段 **STYLE DISCIPLINE**：細節要比參考圖**少**不要多，寧可空。

### v5 提示詞

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE SUBJECT OF THIS DRAWING IS THE WOMAN. The machine she carries is a small prop: it must
take up far less of the picture than she does.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

STYLE DISCIPLINE — match the black-and-white line-art references for the LEVEL OF DETAIL as
well as for the line quality. Those references simplify everything: a hand is a soft mitten
shape with three or four short strokes, a shoe is two clean shapes, clothing has three or
four folds and nothing else. When in doubt, draw FEWER lines, not more. No rows of tiny
repeated dots, no rivets scattered over a surface, no shoelace detail, no seams on the
clothes, no texture anywhere.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair, cap and clothing.

WHO — one woman oral surgeon from a small Taiwanese neighbourhood dental clinic, drawn FULL
LENGTH from the top of her head to the soles of her shoes, standing still and relaxed,
carrying a small tunnelling machine on one shoulder. Her face, hair, cap and clothes come
from the attached colour illustration; the drawing style and the level of detail come only
from the line-art references; and the POSE and PROPORTIONS below are new — follow the
geometry exactly, they are not in any reference.

  - PROPORTIONS: she is seven heads tall. The crotch is exactly halfway between the soles of
    her shoes and the top of her head. The knee is exactly halfway between the crotch and the
    sole. A short length of ankle shows above the shoe.
  - SHE FACES THE LEFT OF THE PICTURE. Her shoulders are turned at an angle, not square to
    the viewer, and her nose, her smile and the front edge of her cap are all on the LEFT
    half of her head. She is NOT looking at the viewer and NOT facing right.
  - HER LEFT ARM (the far one, on the right of the picture) IS RAISED TO HER SHOULDER: the
    upper arm hangs close to her body, the forearm rises so the hand sits just above the
    shoulder, and the fingers curl over the top of the machine to steady it. The wrist is
    relaxed.
  - THE MACHINE RESTS ACROSS THAT SHOULDER like a rolled-up mat, lying at about a 25 degree
    angle, rising from her shoulder backwards and upwards, so its far end sits just BEHIND
    HER HEAD, no higher than the top of her cap. Nothing rests on her head.
  - HER RIGHT ARM (the near one, on the left of the picture) IS ON HER HIP: the hand sits on
    the waist with the fingers forward and the thumb behind, and the elbow points clearly
    OUT AND BACK so the arm makes an open triangle with her body.
  - Her weight is on one leg, so that hip is slightly higher and the other knee is slightly
    bent and relaxed, with the toes turned a little outwards. The posture is easy and
    confident: shoulders down and level, chin level, back straight but not stiff. She is
    NOT straining, NOT leaning under a weight, NOT flexing, NOT posing like a strongman or a
    superhero.

THE MACHINE — a small hand-held tunnelling shield machine, and a small object in this
picture: the whole thing is no longer than her upper arm and no thicker than her head, small
enough that one hand steadies it easily.
Its main shape is a SHORT FAT DRUM seen from the side, so the two long straight sides of the
drum are its biggest shape. Nothing sticks out along the drum's axis at either end; the only
thing underneath it is a short stubby handle.
The far end, the cutting end, is turned away from us and is seen almost edge on, so it shows
only as a thin sliver about a quarter as wide across as the drum's diameter, sitting flush
against the drum with no gap and no shaft. One slightly wider ring runs around it.
THE WHOLE MACHINE CARRIES AT MOST: two straight seam lines around the drum, about six small
bolt dots, that one ring, and three or four small ovals on the visible sliver. Nothing more.
Never draw long thin lines running from a centre point out to a rim: there is no hub, no
spokes, no blades, no grille.
AVOID: an electric fan, fan blades, a propeller, a ship's wheel, a bicycle wheel, a sunburst,
a bazooka, a rocket launcher, a telescope, a cannon barrel.
It is drawn in OUTLINE ONLY, no filled areas, no glow, no motion lines, no dust, no hose, no
cable. It is a friendly piece of engineering equipment, never a weapon.

FACES — extremely simple: the eyes are two short upward curves, as in a warm smile; the
nose is one tiny stroke. No eyebrow detail, no eyelashes, no blush, no wrinkles.
THE MOUTH IS THE EXCEPTION IN THIS DRAWING AND MUST BE DRAWN AS DESCRIBED: she is smiling
broadly with her mouth open — a wide, generous curved shape with TWO OR THREE SHORT STROKES
INSIDE IT to suggest the upper teeth. Nothing is filled in: no black mouth, no shaded
tongue, no gum line, no individually drawn teeth. It should read as a bright, delighted,
open smile in pure line.

HAIR AND CAP — she has a SHORT BOB that ends at the jaw with a soft fringe, and she wears a
soft tie-back surgical cap pushed back on her head so the fringe and the ends of the bob
show clearly in front of it and below it, with two short ties at the back. Hair and cap are
drawn as OUTLINES ONLY with a few interior strokes for the parting and the fabric folds —
neither is filled in.

CLOTHES — an OPEN white coat that ends ABOVE THE KNEE so the whole thigh is visible, worn
over a V-neck scrub top, with a chest pocket on the coat. Below it, straight scrub trousers
and plain soft trainers. Outline only, with a few clean folds; no texture, no patterning,
no filled areas.

COMPOSITION — SHE occupies about 85% of the height of the square, measured from the top of
her head to the soles of her shoes, and stands in the middle of it with generous empty
margin on all four sides. The machine sits inside that margin too. Nothing crosses the outer
margin.

BACKGROUND — completely empty. No tunnel, no soil, no room, no floor, no wall, no ground
line, no shadow under her shoes, no furniture, no plants, no speech bubbles, no icons, no
arrows, no text, no logo, no sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #8e6299, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

---

## 交件前要跑的

    node drafts/lineart-measure.mjs drafts/lineart-surg-v1.jpg

| | 門檻 |
| --- | --- |
| 線佔畫面 | 4~6%（未裁的整張） |
| 筆畫寬中位 | 畫面寬的 4~6‰（橫縱取較小值） |
| 粗細一致 | p90 ÷ 中位 < 2.5 |
| 實心填色 | **0 塊**（看填滿外接矩形多少，> 0.5 才算） |
| 四角乾淨 | 各 10% 的方塊裡沒有墨 |

⚠ 內容這一側要逐條看圖：**朝向（左）／叉腰的手肘有沒有打開／機器在肩上而不是頭上／
刀盤朝後／嘴巴是不是張開帶兩三筆牙**。

## 出圖之後

    node tools/topic-lineart.mjs surg --art drafts/lineart-surg-v1.jpg --crop x,y,w,h

（⚠ 生成的線稿幾乎一定會多畫一條地面線，`--crop` 要把它裁掉；
這一張朝左，**不必 `--flip`**。）
然後把 `[data-topic="surg"]` 加進 `index.html` 那三條選擇器的清單，
再開提案頁 `node tools/lineart-preview.mjs surg` 讓使用者挑大小與濃度
（**七科七組值，不要互抄**；這一科的柔墨臨界是 **.118**）。
