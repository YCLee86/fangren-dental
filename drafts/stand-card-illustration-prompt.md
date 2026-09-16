# 插圖提示詞：櫃檯的小立牌（`line-stand`）

**狀態：⏳ 第一版提示詞寫好，還沒出圖。** 成品要放進
`/preview/line-stand/` 那張卡 **QR 底下、那條標誌帶子上面**的空白裡。
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md)（線／面／質感／人物／紅線）、
顏色一律回 [PALETTE.md](../PALETTE.md) 拿，
文字那一輪的推導在 `drafts/channels/README.md` 第七十一節。

## 使用者給的概念（2026-09-16，逐字）

> 「參考像廠商原本那張有個人拿著手機，也有其他人是展示這個 QRcode 和拿著手機準備
> 　對著這個 Qrcode 掃碼 或是指著這個 Qrcode 向其他人喊（表示快來喔 快看過來）
> 　這些人是診所的醫事人員 刷手服顏色是網站上的主題色、有的有穿白色醫師長袍，
> 　有的有戴醫師帽，特別是之前兒童牙科的花紋圖案醫師一定要有並增加照片這兩種花紋的
> 　刷手服醫事人員」

---

## 一、動筆之前已經被鎖死的：那一塊有多大

文字那一輪（第七十一節，十二輪）收出來的空間是**量得出來的**，不是感覺：

| | |
| --- | --- |
| 卡片 | **98 × 146 mm**（比例 1.49，白卡）。⚠ 2026-09-16 使用者拿尺貼著現況那張拍了一張照，**量出來 ≈ 97 × 146 mm**（尺 15 cm ↔ 3410 px ＝ 22.8 px/mm，卡片上緣到帶子下緣 3330 px）——誤差 1%，**先前從照片推的這一組是對的**，第七十一節那個「要請診所用尺量一次」可以收掉 |
| 版心 | 卡寬的 84% ＝ **82.3 mm** |
| QR 的框 | 卡寬的 45% ＝ **44.1 mm**（碼本身 36.3 mm） |
| QR 上面那一行 | `@fafa070`（2026-09-16 加的，**它從插圖那一條扣掉 6.9 mm**） |
| **QR 底下到帶子** | **36.9 mm**（加那一行之前是 43.8） |
| 底下那條標誌帶子 | 高約 **9.4 mm**，滿版，一般牙科綠 `#3f654a` ＋ 十一顆白色標誌 |
| **插圖畫出來那一條** | **98 × 46.3 mm ＝ 比例 2.117** ← **看得到 36.9（80%），下面 9.4（20%）在帶子後面** |

所以這張圖是一條 **98 × 46.3 mm（約 2.1:1）的橫幅**，而不是一張畫。
印刷 300 dpi 換算 ＝ **1157 × 547 px**，畫大一點即可，不必很大。

⚠⚠⚠ **從 v2 起它沉進帶子後面**（使用者：「腳藏進帶子裡」）——
卡片那一側已經做好了（負的下外距 ＋ 帶子補一個堆疊脈絡畫在它上面），
**版面一個數字都沒有動**。對畫圖的人只有一句話：
**畫面最底下那 20% 會被一條綠色的帶子整條蓋住，重要的東西不要放在那裡。**

### ⚠⚠⚠ 一個一定要先講的取捨：人畫出來只有 22 mm 寬

四個人排開，一個人**約 22 mm 寬、35 mm 高**，軀幹只有 **10 mm** 左右。
兒牙那一輪已經量過同一件事（`og-topic-kids-prompt.md` 第二節）：
照片上那兩塊印花，圖案約軀幹寬的 **1/7**，而且彼此幾乎沒有空隙 ——
**照那個密度畫在 10 mm 的軀幹上，印出來是一片灰色的雜點，不是圖案。**

所以提示詞裡的印花一律**放大、變少、只用兩個顏色**：
**圖案 ≈ 軀幹寬的 1/4 ~ 1/5（印出來 2~2.5 mm），胸前橫著看得到三到四個。**
這是「照片上那兩種圖案」，不是「照片上那兩塊布」——
**要的是梗（針葉樹／恐龍），不是密度。**

### ⚠⚠ 第二件：不要在圖裡再畫一個 QR code

使用者三次都寫「這個 QRcode」，兩種讀法：畫面裡的，或**卡片上那顆真的**。
這張卡的 QR 就在插圖正上方 44 mm 處，再畫一顆有兩個問題 ——
同一張卡上兩顆碼（讀的人不知道要掃哪一顆），而且
**生成的 QR 一定掃不出來**，印在卡上就是一顆假的碼。
→ **所有人都在看／指／掃「畫面上緣外面」那個東西**，圖裡不畫碼。
這是我的判斷，要改回去只要把第 2 段換掉。

### ⚠ 第三件：底是白的，所以不要畫一個方塊

卡片本身是白卡，插圖**沒有邊框、沒有背景、沒有地平線** ——
人站在白底上，腳下只有一小塊很淡的橢圓影子。
畫成一張有背景的插畫，貼上去就是「卡片上黏了一張照片」。

---

## 二、四個人是誰（角色 ＝ 使用者列的四個動作）

| | 動作（使用者的話） | 穿什麼 |
| --- | --- | --- |
| **Ⓐ 最左** | **指著 QR 向其他人喊**（快來喔　快看過來） | **兒牙那位**：塗鴉印花刷手服 ＋ 同布綁帶手術帽 ＋ 敞開的白袍 |
| **Ⓑ 左中** | **展示 QR**（雙手向上攤開，掌心朝上） | 素色刷手服（一般牙科綠）＋ 白袍，不戴帽 |
| **Ⓒ 右中** | **舉著手機對準 QR 掃** | **針葉樹印花**（照片①）＋ 同布綁帶手術帽 |
| **Ⓓ 最右** | **拿著手機在看**（呼應廠商那張） | **恐龍印花**（照片②），不戴帽、不穿白袍 |

⚠ **Ⓐ 是「一定要有」的那一位** —— 使用者指名兒童牙科那位花紋圖案醫師，
她的布料規格在 `og-topic-kids-prompt.md` 第五節第 4 段，**逐字沿用、不要重新設計**：
暖白布 `#f4ead8` ＋ 兩個顏色（琥珀 `#c28229`、深焦糖 `#9e6301`）的簡單塗鴉
（小熊、小雞、雲、星星、小花），帽子、上衣、褲子同一塊布。

⚠ **Ⓐ 不看鏡頭**：她朝**畫面左外側**喊，不是對著讀的人。
站上每一張插圖都沒有人看鏡頭（ILLUSTRATION.md 第三節）。
⚠ 這一條是可以翻的 —— 這張卡擺在櫃檯上、讀的人就站在前面，
「快看過來」對著他喊其實說得通。**要翻是使用者的決定。**

⚠ **Ⓑ 那件白袍畫在白卡上會不見**：白袍一律用細的手繪線與**一階暖灰的陰影**
把邊界畫出來，不要一整塊純白。

### 顏色（一律是站上七科的套色，沒有新增）

| | 色 | 出處 |
| --- | --- | --- |
| Ⓐ 塗鴉 | `#c28229` ＋ `#9e6301` | 兒童牙科（已定案的那一位） |
| Ⓑ 素色刷手服 | `#3f654a` | 一般牙科 |
| Ⓒ 針葉樹 | `#317d78` | 牙周治療 |
| Ⓓ 恐龍 | `#4478b5` | 齒顎矯正 |
| 素色（2026-09-16 v4 新加） | `#ae4f4d` | 顯微根管（正好一人） |
| 素色（2026-09-16 v4 新加） | `#8e6299` | 口腔外科（正好一人） |
| 底下的帶子 | `#3f654a` | （已經在卡片上了，插圖不要重複） |

⚠⚠ **Ⓒ Ⓓ 的底色走「淡一階的主題色」，不是照片上那種飽和的黃與薄荷** ——
兒牙那一輪已經踩過：**一整塊飽和的顏色在這個尺寸會讀成一塊色板，不是一件衣服**
（那一輪的 AVOID 就寫著 `a nurse dressed in a solid mustard, ochre or yellow uniform`）。
要更接近照片就是把底色加濃，**那是使用者的決定**，改一行就好。

---

## 三、參考圖清單（四張，用途要分開標）

⚠ 不標用途的參考圖會被整張抄走（風格、顏色、構圖一起）——TEAM.md 第一節第 10 號。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `assets/og-topic-kids.jpg` | **Ⓐ 那位醫師本人**：臉的畫法、塗鴉印花的樣子、綁帶手術帽的形狀、敞開的白袍 | 構圖、診療椅、小孩、媽媽、房間 |
| ② | `drafts/stand-print-tree-ref.jpg` | **圖案①長什麼樣**：針葉樹、圓樹叢、小三角形，兩個顏色、簡單的輪廓 | **底色**（要換成牙周青綠的淡階）、**密度**（要放大、變少）、布料的質感 |
| ③ | `drafts/stand-print-dino-ref.jpg` | **圖案②長什麼樣**：長頸的、背上有板子的、會飛的恐龍，兩個顏色 | **底色**（要換成矯正藍的淡階）、**密度**、底下那些圓形色塊 |
| ④ | `assets/og-topic-general.jpg`（整張） | **整體色調、紙紋、線的實度、平塗的臉** | **構圖**（那是街景）、人數、顏色 |

### ⚠⚠ 廠商那張本人（2026-09-16 拿到了）——**它不進參考圖清單**

寫這一版的時候手上只有使用者的描述（那張照片不在暫存區），拿到之後量了三件：

| | |
| --- | --- |
| 那隻角色多大 | **≈ 31 × 30 mm**（含頭上那三條線 31 × 40 mm）＝ 卡寬的 **32%** |
| 擺在哪裡 | **右下角一隻**，底下被那條深藍帶子切掉（身體藏在帶子後面），QR 底下其餘的地方是空白 |
| 畫成什麼 | **一隻吉祥物**：白色團塊、閉著眼笑、垂耳、腮紅、一手舉著手機、一手舉在頭邊 |

⚠⚠⚠ **所以「參考廠商那張」參考的是那個「動作」，不是畫風也不是構圖** ——
那是一種和站上這一套人物插畫**完全不同的語言**（它沒有身體比例、沒有臉的畫法可以抄）。
**這一張不要餵給模型**，餵了會把整張圖帶去吉祥物那一邊，而那撞到
ILLUSTRATION.md 第四節的 A 級紅線（人物要簡化但自然，不是誇張變形）。

⚠ 順帶兩件量出來的差異，**兩件都是刻意的**：
・**份量**：他們一隻 31 mm 寬，我們四個人排開一人只有 22 mm ——
　**高度差不多，但一個人的份量小三成**（換到的是四個動作與三種印花）。
・**手機螢幕**：他們那隻的螢幕上有一小行字，印出來根本看不清楚；
　我們的提示詞第 4 段寫死**螢幕空白**，是刻意不跟。

產生 ②③ 的腳本：`node drafts/stand-card-refs-crop.mjs`
（來源是使用者的手機截圖，不在版控裡；裁好的成品已經進版控，腳本會自動略過）。

---

## 三之二、v2 要附哪幾張（2026-09-16）

⚠ 規則同上：**不標用途的參考圖會被整張抄走**。v2 附**五張**，前四張和 v1 完全相同
（畫風、三種印花的梗、Ⓐ 那位醫師本人一個字都沒改），第五張是新加的。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `assets/og-topic-kids.jpg` | **Ⓐ 那位醫師本人**：臉的畫法、塗鴉印花的樣子、綁帶手術帽的形狀、敞開的白袍 | 構圖、診療椅、小孩、媽媽、房間 |
| ② | `drafts/stand-print-tree-ref.jpg` | **針葉樹／圓樹叢／小三角形長什麼樣**，兩個顏色、簡單的輪廓 | **底色**（換成牙周青綠的淡階）、**密度**（要放大、變少）、布料質感 |
| ③ | `drafts/stand-print-dino-ref.jpg` | **三隻恐龍長什麼樣**，兩個顏色 | **底色**（換成矯正藍的淡階）、**密度**、底下那些圓形色塊 |
| ④ | `assets/og-topic-general.jpg`（整張） | **整體色調、紙紋、線的實度、平塗的臉** | **構圖**（那是街景）、人數、顏色 |
| ⑤ | `drafts/stand-card-illus-v1-src.jpg`（**v2 新加**） | **上一版的畫風本人**：線的粗細與斷筆、臉的畫法、三種印花已經畫出來的樣子、白袍的邊與陰影 | ⚠⚠ **人數（四個）、站姿、腳、排成一列、四周的留白** —— 那五件正是這一版要換掉的 |
| ⑤′ | `drafts/stand-card-illus-v2-src.jpg`（**v3 用的**） | **上一版的畫風本人**：線、臉、三種印花、白袍的邊、人擠在一起的密度 | ⚠⚠ **綠色的比例（六個人同一色）、最左邊那個被切掉臉的人、中間那顆半身的頭** —— 那三件正是 v3 要換掉的 |
| ⑤″ | `drafts/stand-card-illus-v3-src.jpg`（**v4 起換成這一張**） | **整張照抄** —— 畫風、臉、擠在一起的密度、三種印花、白袍、裁法 | ⚠ 只有三件要改：一個人換磚紅 `#ae4f4d`、一個人換紫 `#8e6299`、左邊第 2 位的帽子要和上衣同色、左邊第 4 位那隻指上去的手要換成**裸露的前臂** |

⚠⚠⚠ **第 ⑤ 張是有風險的一張**：它是我們自己上一版，所以畫風最穩；
但它整張的構圖**正好是 v2 要推翻的那一種**（四個人、站著、腳在畫面裡、四周留白）。
**出圖若又變成四個人站著，就把 ⑤ 拿掉再試一次** —— 前四張本來就足夠定住畫風。

⚠ **廠商那張照片仍然不進清單**（理由見上一節）。

---

## 四、提示詞（第一版，逐字）

```
Editorial illustration for a printed counter card, drawn as A SINGLE WIDE HORIZONTAL BAND OF
PEOPLE - a frieze, not a scene. Landscape 16:9; it will afterwards be trimmed to a strip of
about 2.2:1 taken from the middle, so THE TOP 11% AND THE BOTTOM 11% OF THE PICTURE MUST BE
COMPLETELY EMPTY WHITE. Printed at about 98 mm wide, so every person is only about 22 mm tall
on paper: big simple shapes, no small detail, and ABSOLUTELY NO TEXT, LETTERS, NUMBERS OR LOGOS
ANYWHERE IN THE PICTURE.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: four members of a small dental
clinic's staff are standing in a row, all of them delighted about A QR CODE THAT IS NOT IN THE
PICTURE - it is on the card ABOVE THE TOP EDGE. One of them is calling other people over to
look at it, one is presenting it with both hands, one is holding a phone up to scan it, and one
is already looking at her own phone at what has just appeared on it.

1. THE BACKGROUND IS PLAIN WHITE AND COMPLETELY EMPTY. No room, no wall, no floor, no horizon
   line, no furniture, no frame, no border, no panel, no background colour, no scenery of any
   kind. The only thing under the figures is A SMALL SOFT PALE-GREY ELLIPTICAL SHADOW under each
   pair of shoes so that nobody floats. The picture must look like four people drawn straight
   onto white paper.

2. THERE IS NO QR CODE IN THIS PICTURE - THIS IS A HARD RULE. Do not draw a QR code, a square of
   black and white dots, a barcode, a phone screen with a code on it, a sign, a poster, a board,
   a card or a framed rectangle anywhere. Everyone is looking at, pointing at or aiming a phone
   at SOMETHING JUST ABOVE THE TOP EDGE OF THE PICTURE, which we cannot see. Their eyes and
   their hands go UP AND SLIGHTLY TOWARDS THE CENTRE of the top edge.

3. THE FOUR PEOPLE STAND IN ONE ROW ACROSS THE WHOLE WIDTH, evenly spaced, all the same size,
   all standing on the same invisible ground line at 86% of the picture height, the tops of
   their heads at about 22% of the picture height. They are all EAST ASIAN, mixed ages, both
   sexes, drawn at natural human proportions - not stylised, not big-headed, not chibi. NOBODY
   WEARS A FACE MASK; every face is visible. NOBODY LOOKS OUT AT THE VIEWER. They do not touch
   one another and they do not overlap more than a little at the shoulders.

4. FROM LEFT TO RIGHT, EXACTLY THESE FOUR:
   (a) A WOMAN CALLING OTHER PEOPLE OVER. Her right arm is raised and she is POINTING UP AND
       OUT OF THE TOP OF THE PICTURE with one finger; her left hand is beside her mouth and her
       head is turned AWAY TO THE LEFT, towards somebody outside the left edge, mouth open in a
       cheerful shout. She is happy, not alarmed.
   (b) A MAN PRESENTING IT WITH BOTH HANDS. He stands square to us with BOTH ARMS RAISED AND
       OPEN, palms turned upwards and outwards towards the top edge, elbows bent, in the plain
       "here it is, please look" gesture of a person introducing something. He is smiling and
       looking up at it.
   (c) A WOMAN ABOUT TO SCAN IT. She holds A PLAIN SMARTPHONE UP IN BOTH HANDS at about the
       height of her own face, THE BACK OF THE PHONE TOWARDS US AND THE TOP OF THE PHONE TILTED
       UP towards the top edge, as if lining up a camera. WE SEE THE BACK OF THE PHONE, NOT THE
       SCREEN: a plain rounded rectangle with one small camera circle, nothing else on it. Her
       eyes are on the top edge, over the phone.
   (d) A WOMAN ALREADY LOOKING AT HER PHONE. She holds A PLAIN SMARTPHONE in one hand at chest
       height, THE SCREEN TURNED AWAY FROM US at an angle so we cannot see anything on it, her
       other hand resting on her hip, her head tilted down towards it, smiling to herself. THE
       SCREEN IS BLANK AND FEATURELESS - no icons, no text, no picture, no code on it.

5. WHAT THEY ARE WEARING - THIS IS THE BRAND DETAIL, DRAW IT CAREFULLY. All four wear V-neck
   short-sleeved scrubs with a chest pocket, and scrub trousers.
   (a) PRINTED DOODLE SCRUBS, exactly the ones in reference image 1: her CAP, her TOP and her
       TROUSERS are all cut from ONE AND THE SAME PRINTED FABRIC - warm off-white cloth
       (#f4ead8) scattered with SIMPLE FLAT CHILDLIKE DOODLES (little bears, chicks, clouds,
       stars, small flowers) drawn in ONLY TWO COLOURS, amber (#c28229) and deep caramel
       (#9e6301). On her head A TIE-BACK SURGICAL CAP of the same cloth, covering her hair
       completely and knotted into short ties at the back. Over it all, A WHITE COAT HANGING
       OPEN AND UNBUTTONED so the print stays visible.
   (b) PLAIN SCRUBS in a muted deep green (#3f654a), no pattern at all, under A WHITE COAT
       WORN OPEN. No cap.
   (c) PRINTED PINE-TREE SCRUBS, the motifs of reference image 2 ONLY: little pine trees,
       round bushes and tiny triangles, drawn as SIMPLE FLAT TWO-COLOUR SHAPES in deep teal
       (#317d78) and off-white, on a PALE TINT OF THAT SAME TEAL. She also wears A TIE-BACK
       SURGICAL CAP cut from the same printed cloth. No coat.
   (d) PRINTED DINOSAUR SCRUBS, the motifs of reference image 3 ONLY: a long-necked dinosaur,
       a spotted plated dinosaur and a small flying one, drawn as SIMPLE FLAT TWO-COLOUR SHAPES
       in deep blue (#4478b5) and off-white, on a PALE TINT OF THAT SAME BLUE. No cap, no coat.

6. THE TWO PRINTS MUST BE BIG AND FEW, NOT SMALL AND BUSY - THIS IS THE EASIEST THING TO GET
   WRONG. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a clear gap of
   about the same size between motifs, so that only THREE OR FOUR MOTIFS ARE VISIBLE ACROSS THE
   CHEST. Do not copy the density of the reference fabrics - they are photographs of real cloth
   and at this size that density turns into grey speckle. Each print uses only its two colours.
   No letters, no numbers, no words in any pattern. The three printed people must be told apart
   BY THEIR PATTERN, NOT by a block of solid colour: none of them wears a solid saturated
   garment.

7. THE WHITE COATS MUST STILL READ ON WHITE PAPER. Draw each coat with a clear thin hand-drawn
   outline and ONE STEP OF WARM GREY shading in the folds, the lapels and under the arms, so the
   coat separates from the empty white background. Never a flat pure-white shape with no edge.

8. STYLE. Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline, NOT a ruled vector line. Each face is ONE FLAT SKIN TONE with no shading: only the
   outline, two eyes drawn as small simple dots, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines. Hair is a flat shape in two tones. EVERY
   PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND SOLIDITY. Flat fills in two or three
   steps per colour, no gradients except to describe light. Fine paper grain over the whole
   image. Warm, calm, cheerful - never slick, never corporate, never a stock illustration.

9. COLOUR. The white background is the largest area by far and stays empty. The only strong
   colours in the picture are the four uniforms: amber doodles, muted deep green, pale teal with
   teal trees, pale blue with blue dinosaurs. Skin is a warm flat tone; hair is warm near-black;
   the phones are a neutral warm grey. NO neon, NO strong saturated red, NO gold, NO surgical
   blue or bright green, NO grey-blue clinical cast.

COMPOSITION ANCHORS: the four figures fill the middle 84% of the width, none of them touching
the left or right edge; their shoes sit on the line at 86% of the height; the top 11% and the
bottom 11% are empty white and will be cut off.

AVOID: any text, letters, numbers, words or logos anywhere; a QR code, barcode, matrix of dots,
poster, sign, board, placard or framed rectangle; anything visible on a phone screen; any
background, room, wall, floor, furniture, horizon line, frame or border; any coloured background
panel; anybody looking at the viewer; face masks; needles, syringes, drills, dental instruments,
blood; a dental chair; solid saturated yellow, mustard, mint or turquoise uniforms; tiny busy
multicoloured patterns; speech bubbles, arrows, sparkles, motion lines, icons; anybody drawn
faded, translucent, ghostly or outline-only; photorealism; 3D rendering; heavy even black
outlines; a thick drop shadow behind the figures.
```

---

## 五、驗收（**v1 用的**，v2 的那一份在五之三最後面）

1. **圖裡沒有 QR、沒有任何字** —— 這兩件是紅線，一眼看。
2. **四個動作分得出來**（喊／展示／舉著掃／低頭看），而且**沒有人看鏡頭**。
3. **三種印花分得出來**，而且**都不是一整塊飽和色**。
4. **把圖縮到 98 mm 寬看一次** —— 那才是印出來的大小；在螢幕上放大看不算數
   （分享卡那一輪的同一條：在成品的尺寸上量，不要在素材的尺寸上量）。
5. **白袍在白底上看得到邊**。
6. **上下各 11% 是空的**（裁切要用得到）。
7. 裁成 2.2:1 之後放進 `/preview/line-stand/` 那張卡，量一次
   **介紹區（QR 底下到帶子）的高度有沒有被撐開** —— 那一塊是 43.8 mm，不可以變。

## 五之二、v1 畫好了（2026-09-16）—— 已經接到卡片上

成品 `preview/line-stand/illus.jpg`，原檔 `drafts/stand-card-illus-v1-src.jpg`，
裁圖 `node drafts/channels/stand-illus-crop.mjs`。

⚠⚠⚠ **交出來那一張不能直接放進卡片，而且成因是這一份自己要的**：
`COMPOSITION ANCHORS` 寫著「上下各 11% 完全空白」，模型給了 **上 17.5%／下 7.5%**，
整張是 **2000×1116 ＝ 16:9**，而卡片上那一塊是 **98 × 43.8 mm ＝ 比例 2.237** ——
整張放進去照寬度縮會高 54.7 mm ＝ **爆框 10.9 mm**。
**裁到墨的框就合了**：1784×853 ＝ 比例 2.091，在那一塊裡畫出來
**91.6 × 43.8 mm、左右各餘 3.2 mm、495 dpi**，版面一個數字都沒有動。

⚠ 一個人在卡片上：Ⓐ 18.7／Ⓑ 27.4／Ⓒ 16.1／Ⓓ 17.2 mm 寬，站著 40~44 mm 高，一顆頭約 7.3 mm。

⚠⚠ ~~**下一版要先決定那條留白怎麼寫**~~ —— ✅ **2026-09-16 收掉了，而且兩條都不必選**：
裁圖那一支現在**只要求上緣留白**（唯一的調節閥），下緣與左右一律出血；
裁到墨之後若比那一條還寬，它會**從頭頂上那塊白裡把高度借回來**，
輸出的比例因此**一定正好是那一條**。所以 v2 不必賭模型畫得出 2.117，
畫成 2:1、上面留一條白就好（見五之三）。
**通則：一個「模型每次都會失手」的要求，先問這一側能不能自己把它補回來。**

## 五之三、v2 的提示詞（2026-09-16，使用者四件）

使用者看過 v1 之後給了四件（逐字）：

```
1. 人太少 再多一點 8-9個人比較熱鬧
2. 要有人擠進來畫面裡高興熱情推廣介紹的感覺
3. 腳藏進帶子裡，人臉和動作要大一點 現在好小
4. QRcode 上面加一串字 @fafa070 (line 商家帳號 ID)
```

**第 4 件是卡片的事，已經做了**（見 `stand-card.json` 的「帳號ID」那一塊）。
**第 1~3 件是這一版的規格**，而它們不是三件並列的事 ——

### ⚠⚠⚠ ① 和 ③ 直接打架，② 正是讓它們同時成立的那一件

一條 **98 mm 寬**的帶子，**臉多大由「一個人佔掉這一條多少高度」決定、人數由寬度決定**：

| 只加人、其他不改 | 4 人 | 6 人 | 8 人 | 9 人 |
| --- | --- | --- | --- | --- |
| 一個人多寬 | 22.9 | 15.3 | 11.4 | 10.2 mm |
| **一顆頭** | **7.3** | 4.9 | 3.6 | **3.2 mm** |

**愈熱鬧臉愈小** —— 照字面做，③ 會被 ① 吃掉。**解法是第 ② 件**：
人擠在一起（互相重疊、前後兩排），一個人就不必佔滿一個身位；
再加上第 ③ 件的**下半身切掉**，同樣一條裡一個人可以畫得大得多。

| 畫到哪裡（畫面下緣切在） | 全身若畫完會有多高 | **一顆頭** | 肩寬 | 9 人每人前進 |
| --- | --- | --- | --- | --- |
| 整個人、腳在畫面裡（v1） | 44.3 | 7.4 | 11.6 | 89% 個肩寬 |
| 小腿 | 52.1 | 8.7 | 13.6 | 74% |
| 大腿 | 63.3 | 10.5 | 16.5 | 59% |
| **髖下（定案）** | **71.5** | **11.9** | **18.6** | **51%** |
| 腰 | 80.5 | 13.4 | 21.0 | 43% |

**定案走「髖下」：9 個人、前後兩排、一顆頭 7.3 → 約 12 mm（大六成）。**
排法是**前排 5 人、後排 4 人從肩膀之間探出來**（後排略小、站高一點）——
這比「9 個人排成一列各自站好」好畫，也才是「熱鬧」的樣子。

### ⚠⚠ 那一條的形狀換了，裁圖那一支跟著換

| | v1 | **v2** |
| --- | --- | --- |
| 那一條 | 98 × 43.8 mm ＝ 2.237 | **98 × 46.3 mm ＝ 2.117**（沉進帶子後面 ＋ 多了那一行 ID） |
| 上緣 | 留 11% 白、裁掉 | **仍然要留白**（約 8%）—— 它是唯一的調節閥 |
| 下緣 | 留白、腳站在畫面裡 | **出血**：人被畫面下緣切掉 |
| 左右 | 不碰到邊 | **出血**：兩側的人被左右緣切掉（「擠進來」） |

⚠⚠⚠ `stand-illus-crop.mjs` 因此改了兩件（v1 重跑仍然逐位元組相同）：
**只有上緣不准碰到邊**（頭被切掉救不回來，而且那是唯一可以補白的一側），
以及**裁到墨之後若比那一條還寬，就從頭頂上那塊白裡把高度借回來**，
讓輸出的比例**正好是那一條** —— 所以這一版**不必賭模型畫得出 2.117**，
畫成 2:1、上面留一條白就好。

### 要附的參考圖

**五張，見第三之二節**（前四張同 v1，第 ⑤ 張是 v1 的成品本人 ——
只抄畫風，**不要抄人數、站姿與腳**；出圖若又變成四個人站著就把它拿掉再試一次）。

### 提示詞（v2，逐字）

⚠ 和 v1 比，**沒有動的**：畫風、臉的畫法、顏色、印花的規格（大而少、兩個顏色）、
白袍要有邊、零文字、不要畫 QR、白底不要背景。**只換了「有幾個人、怎麼站、畫到哪裡」。**

```
Editorial illustration for a printed counter card, drawn as A SINGLE WIDE HORIZONTAL BAND OF
PEOPLE - a frieze, not a scene. Wide landscape, about 2:1 (for example 1200 x 600 px). Printed
only 98 mm wide, so keep every shape big and simple, no small detail, and ABSOLUTELY NO TEXT,
LETTERS, NUMBERS OR LOGOS ANYWHERE IN THE PICTURE.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: NINE members of a small dental
clinic's staff have crowded together in a cheerful huddle, all of them delighted about A QR CODE
THAT IS NOT IN THE PICTURE - it is on the card ABOVE THE TOP EDGE. They are pressing in from
both sides to get into the picture, waving, pointing and calling other people over to look.

0. THE FRAME. Leave A NARROW EMPTY WHITE BAND ACROSS THE TOP, about 8% of the height - nothing
   but white paper there, it will be trimmed off. EVERYWHERE ELSE THE PICTURE IS FULL: the
   people RUN OFF THE LEFT EDGE, OFF THE RIGHT EDGE AND OFF THE BOTTOM EDGE. Do not leave an
   empty margin at the bottom or at the sides, and do not shrink the group to fit inside the
   frame.

1. HOW MUCH OF EACH PERSON WE SEE - THIS IS THE MOST IMPORTANT INSTRUCTION. WE SEE THEM FROM THE
   TOP OF THE HEAD DOWN TO JUST BELOW THE HIPS, AND THAT FILLS THE WHOLE HEIGHT OF THE PICTURE.
   THE BOTTOM EDGE OF THE PICTURE CUTS STRAIGHT THROUGH THEM JUST BELOW THE HIPS. NO LEGS, NO
   KNEES, NO FEET, NO SHOES, NO SHADOWS ON THE GROUND, NO GROUND LINE - the lower body simply
   continues past the bottom edge. A HEAD IS ABOUT A QUARTER OF THE HEIGHT OF THE PICTURE. They
   are drawn at natural human proportions - not big-headed, not chibi; they look large because
   we are close to them, not because their heads are oversized.

2. THE BACKGROUND IS PLAIN WHITE AND COMPLETELY EMPTY. No room, no wall, no floor, no horizon
   line, no furniture, no frame, no border, no panel, no background colour, no scenery of any
   kind. The picture must look like nine people drawn straight onto white paper.

3. THERE IS NO QR CODE IN THIS PICTURE - THIS IS A HARD RULE. Do not draw a QR code, a square of
   black and white dots, a barcode, a phone screen with a code on it, a sign, a poster, a board,
   a card or a framed rectangle anywhere. Everyone is looking at, pointing at or aiming a phone
   at SOMETHING JUST ABOVE THE TOP EDGE OF THE PICTURE, which we cannot see. Their eyes and
   their hands go UP AND SLIGHTLY TOWARDS THE CENTRE of the top edge.

4. HOW THEY ARE CROWDED - TWO ROWS, PRESSED TOGETHER. FIVE of them stand in front, shoulder to
   shoulder, OVERLAPPING EACH OTHER BY ABOUT HALF A SHOULDER so the row is genuinely packed. The
   OTHER FOUR lean in FROM BEHIND, their heads appearing IN THE GAPS BETWEEN THE FRONT
   SHOULDERS, drawn slightly smaller and slightly higher up so they read as further away. THE
   PERSON AT EACH END IS CUT IN HALF BY THE SIDE EDGE, leaning inwards as if squeezing into the
   picture. Nobody is evenly spaced; nobody stands alone. They are EAST ASIAN, mixed ages, both
   sexes. NOBODY WEARS A FACE MASK; every face is visible and smiling. NOBODY LOOKS OUT AT THE
   VIEWER - every face is turned up towards the top edge or sideways towards a neighbour.

5. WHAT THEY ARE DOING - the whole group is enthusiastic, warm and a little noisy. Somewhere in
   the front row, EXACTLY THESE FOUR ACTIONS MUST BE THERE, one person each:
   (a) A WOMAN CALLING OTHER PEOPLE OVER: one arm raised, POINTING UP AND OUT OF THE TOP OF THE
       PICTURE with one finger, her other hand beside her mouth, head turned away to one side,
       mouth open in a cheerful shout.
   (b) A MAN PRESENTING IT WITH BOTH HANDS: BOTH ARMS RAISED AND OPEN, palms turned upwards and
       outwards towards the top edge, elbows bent - the plain "here it is, please look" gesture.
   (c) A WOMAN ABOUT TO SCAN IT: A PLAIN SMARTPHONE HELD UP IN BOTH HANDS at about the height of
       her own face, THE BACK OF THE PHONE TOWARDS US AND THE TOP OF THE PHONE TILTED UP, as if
       lining up a camera. We see the back of the phone, not the screen: a plain rounded
       rectangle with one small camera circle.
   (d) A WOMAN ALREADY LOOKING AT HER PHONE: phone in one hand at chest height, THE SCREEN
       TURNED AWAY FROM US so we cannot see anything on it, head tilted down, smiling to
       herself. THE SCREEN IS BLANK AND FEATURELESS - no icons, no text, no picture.
   The other five are simply glad to be there: waving with one hand, both hands raised in a
   small cheer, a hand on a colleague's shoulder, leaning in to look, one arm up beckoning.
   No two of them make the same gesture.

6. WHAT THEY ARE WEARING - THIS IS THE BRAND DETAIL, DRAW IT CAREFULLY. They all wear V-neck
   short-sleeved scrubs. THREE PRINTED FABRICS MUST BE THERE, one person each, in the front row
   where they can be seen:
   (a) PRINTED DOODLE SCRUBS, exactly the ones in reference image 1 - THIS ONE IS REQUIRED: her
       CAP and her TOP are cut from ONE AND THE SAME PRINTED FABRIC - warm off-white cloth
       (#f4ead8) scattered with SIMPLE FLAT CHILDLIKE DOODLES (little bears, chicks, clouds,
       stars, small flowers) in ONLY TWO COLOURS, amber (#c28229) and deep caramel (#9e6301). On
       her head A TIE-BACK SURGICAL CAP of the same cloth. Over it A WHITE COAT HANGING OPEN.
   (b) PRINTED PINE-TREE SCRUBS, the motifs of reference image 2 ONLY: little pine trees, round
       bushes and tiny triangles, SIMPLE FLAT TWO-COLOUR SHAPES in deep teal (#317d78) and
       off-white, on A PALE TINT OF THAT SAME TEAL, with a matching tie-back cap.
   (c) PRINTED DINOSAUR SCRUBS, the motifs of reference image 3 ONLY: a long-necked dinosaur, a
       spotted plated dinosaur and a small flying one, SIMPLE FLAT TWO-COLOUR SHAPES in deep
       blue (#4478b5) and off-white, on A PALE TINT OF THAT SAME BLUE.
   THE OTHER SIX wear PLAIN scrubs in a muted deep green (#3f654a) with no pattern at all; two
   or three of them wear A WHITE COAT OPEN OVER IT, one or two wear a plain cap in the same
   green. Nobody wears a solid saturated yellow, mustard, mint or turquoise garment.

7. THE TWO PRINTS MUST BE BIG AND FEW, NOT SMALL AND BUSY - THIS IS THE EASIEST THING TO GET
   WRONG. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a clear gap of
   about the same size between motifs, so that only THREE OR FOUR MOTIFS ARE VISIBLE ACROSS THE
   CHEST. Do not copy the density of the reference fabrics - they are photographs of real cloth
   and at this size that density turns into grey speckle. Each print uses only its two colours.
   No letters, no numbers, no words in any pattern.

8. THE WHITE COATS MUST STILL READ ON WHITE PAPER. Draw each coat with a clear thin hand-drawn
   outline and ONE STEP OF WARM GREY shading in the folds, the lapels and under the arms, so the
   coat separates from the empty white background. Never a flat pure-white shape with no edge.

9. STYLE. Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline, NOT a ruled vector line. Each face is ONE FLAT SKIN TONE with no shading: only the
   outline, two eyes drawn as small simple dots, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines. Hair is a flat shape in two tones. EVERY
   PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND SOLIDITY, including the ones further
   back - nobody is faded, greyed out or drawn as an outline only. Flat fills in two or three
   steps per colour, no gradients except to describe light. Fine paper grain over the whole
   image. Warm, calm, cheerful - never slick, never corporate, never a stock illustration.

10. COLOUR. The white background is the largest area by far and stays empty. The only strong
    colours are the uniforms: amber doodles, pale teal with teal trees, pale blue with blue
    dinosaurs, and muted deep green for everyone else. Skin is a warm flat tone; hair is warm
    near-black; the phones are a neutral warm grey. NO neon, NO strong saturated red, NO gold,
    NO surgical blue or bright green, NO grey-blue clinical cast.

COMPOSITION ANCHORS: the top 8% of the picture is empty white and will be cut off; the group
touches and runs off the left edge, the right edge and the bottom edge; the bottom edge cuts
every figure just below the hips; a head is about a quarter of the picture height; nine people,
five in front and four behind.

AVOID: any text, letters, numbers, words or logos anywhere; a QR code, barcode, matrix of dots,
poster, sign, board, placard or framed rectangle; anything visible on a phone screen; any
background, room, wall, floor, furniture, horizon line, frame or border; any coloured background
panel; legs, knees, feet, shoes, ground shadows or a ground line; an empty margin at the bottom
or at the sides; a neat evenly spaced row of separated figures; anybody looking at the viewer;
face masks; needles, syringes, drills, dental instruments, blood; a dental chair; solid
saturated yellow, mustard, mint or turquoise uniforms; tiny busy multicoloured patterns; speech
bubbles, arrows, sparkles, motion lines, icons; anybody drawn faded, translucent, ghostly or
outline-only; photorealism; 3D rendering; heavy even black outlines; a thick drop shadow.
```

### v2 的驗收（出圖之後逐條跑一次）

1. **圖裡沒有 QR、沒有任何字** —— 兩件都是紅線，一眼看。
2. **數一次有幾個人**（要 8~9），而且**看得出是擠在一起的**（有人被左右緣切掉、
   後排的頭從肩膀之間探出來）——排成一列各自站好就是沒做到第 ② 件。
3. **沒有腳、沒有影子、沒有地平線**，而且**最底下那一排人是被畫面下緣切斷的**。
4. **三種印花分得出來**，而且都不是一整塊飽和色；⚠ Ⓐ 那位（兒牙塗鴉）一定要在。
5. **上面有一條空白**（裁圖那一支要用它補比例），左右與下緣是滿的。
6. 跑 `node drafts/channels/stand-illus-crop.mjs` ——
   它會印出裁完的比例、有沒有從上緣補白、畫出來幾 mm、幾 dpi。
7. **把卡片縮到 98 mm 寬看一次**（螢幕上放大看不算數），量一顆頭有沒有到 **12 mm** 左右；
   然後跑 `node drafts/channels/check-stand-card.mjs`，
   它會量「QR 底下到帶子」有沒有被撐開、插圖有沒有真的沉進帶子後面。

---

---

## 五之四、v3 的提示詞（2026-09-16，使用者看過 v2 之後四件）

使用者原話：「大致可以　但太多綠色刷手服的人　而且最左邊的人長得好怪　
再加上他的刷手服和帽子沒有連成一套　中間有一個人畫了一半下半部消失了」。

### 先記一件：**臉的大小這一版已經到了，v3 不要再動**

量 v2 的成品（2000×989，印 98 mm 寬 ＝ 1px 0.049 mm）：

| | |
| --- | --- |
| 前排一顆頭 | **約 12 mm**（膚色連通區 10~17 mm 含頸與手，前排那幾張臉落在 12 上下）＝ **五之三那張表算的 11.9 mm** |
| 上緣留白 | 14.0%（提示詞要 8%）—— **不是問題**，裁圖那一支會把多的白補掉／裁掉 |
| 左右與下緣 | 都出血 ✓（人被切在髖下，沒有腳、沒有影子、沒有地平線） |
| 圖裡有沒有字或 QR | **沒有** ✓ |

所以 v3 只治那四件，**第 1 段（畫到身體哪裡、一顆頭佔四分之一）一個字都不要改**。

### 四件的成因，四件不同

**① 綠色太多** —— 量出來**素色深綠佔了「人」那一塊面積的 24.7%**，是全圖制服裡最大的一塊。
成因不是模型畫錯：**v2 的提示詞自己寫著「其餘六個人穿素色深綠」** —— 九個人裡六個同一色。
→ 六個素色拆成**三個顏色、各兩人**（深綠 `#3f654a`／青綠 `#317d78`／藍灰 `#465885`，
**全部是站上七科現成的色，一個新顏色都沒有加**），並把**白袍從「兩三件」提到「四件」**。
⚠ 素色青綠那兩位**不要站在松樹印花旁邊**（同色相會糊成一塊）。

**② 最左邊那個人長得怪** —— 放大看是三件疊在一起：
她的**臉被左緣切掉一半**、**頭比旁邊的手臂小一號**、而且她旁邊那隻揮手的手
（袖子是塗鴉印花）**接不到任何一個人身上**。
⚠⚠⚠ 成因是 v2 寫著 `THE PERSON AT EACH END IS CUT IN HALF BY THE SIDE EDGE` ——
**「切一半」被照字面執行在臉上**。
→ 改成 **邊緣可以切身體、肩膀、手臂，但永遠不可以切臉；九張臉每一張都完整在畫面裡**，
並加一條 **每一隻手都要看得出接到某一個人身上**。
**通則：一個「要被切掉」的指令，一定要指名切的是哪一部分 —— 不指名，模型會切在最醒目的地方（臉）。**

**③ 帽子和刷手服沒有連成一套** —— 最左邊那位戴**塗鴉印花帽**、身上卻是**素色綠 ＋ 白袍**。
成因：v2 只寫了 Ⓐ 那位「帽子和上衣是同一塊布」，**沒有禁止別人也戴印花帽**。
→ **有印花帽的人，上衣一定是同一塊布；素色的人只戴同色素帽或不戴帽**，
而且**塗鴉印花全圖只有一個人**。

**④ 中間有一個人只畫了一半** —— 在松樹印花那位的胸口高度，有一顆戴塗鴉帽的小頭，
露出頭和一點點肩膀，身體就消失了（讀起來像一個小孩卡在中間）。
成因：v2 寫著後排「頭從前排肩膀的縫裡露出來，**畫小一點、站高一點**」——
模型把「小一點」做了、「高一點」沒做，於是落在前排的胸口。
→ 改成 **後排的頭要和前排一樣高或更高，絕對不可以出現在前排胸口的高度**；
**每一位後排都要看得到頭 ＋ 至少一邊肩膀，身體是被前排擋住、不是被畫掉**（輪廓不可以在半空中收掉）；
**後排幾乎和前排一樣大（不小於九成），九個人全部是成年人，沒有小孩**。

### 要附的參考圖

**同五之三那五張**（見第三之二節）—— 一張都沒有換。
⚠ 第 ⑤ 張現在可以換成 **v2 的成品**（畫風、臉、三種印花、白袍的邊都對了），
標籤要寫成「**只抄畫風與印花；不要抄：綠色的比例、最左邊那個人、中間那顆半身的頭**」。

### 提示詞（v3，逐字）

⚠ 和 v2 比，**沒有動的**：第 0、1、2、3、5、7、8、9 段（畫風、臉的畫法、畫到髖下、
一顆頭佔四分之一、零文字、不要畫 QR、四個動作、印花要大而少、白袍要有邊）。
**只改了第 4 段（怎麼站、怎麼切）與第 6 段（誰穿什麼），`AVOID` 補了八條。**

```
Editorial illustration for a printed counter card, drawn as A SINGLE WIDE HORIZONTAL BAND OF
PEOPLE - a frieze, not a scene. Wide landscape, about 2:1 (for example 1200 x 600 px). Printed
only 98 mm wide, so keep every shape big and simple, no small detail, and ABSOLUTELY NO TEXT,
LETTERS, NUMBERS OR LOGOS ANYWHERE IN THE PICTURE.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: NINE members of a small dental
clinic's staff have crowded together in a cheerful huddle, all of them delighted about A QR CODE
THAT IS NOT IN THE PICTURE - it is on the card ABOVE THE TOP EDGE. They are pressing in from
both sides to get into the picture, waving, pointing and calling other people over to look.

0. THE FRAME. Leave A NARROW EMPTY WHITE BAND ACROSS THE TOP, about 8% of the height - nothing
   but white paper there, it will be trimmed off. EVERYWHERE ELSE THE PICTURE IS FULL: the
   people RUN OFF THE LEFT EDGE, OFF THE RIGHT EDGE AND OFF THE BOTTOM EDGE. Do not leave an
   empty margin at the bottom or at the sides, and do not shrink the group to fit inside the
   frame.

1. HOW MUCH OF EACH PERSON WE SEE - THIS IS THE MOST IMPORTANT INSTRUCTION. WE SEE THEM FROM THE
   TOP OF THE HEAD DOWN TO JUST BELOW THE HIPS, AND THAT FILLS THE WHOLE HEIGHT OF THE PICTURE.
   THE BOTTOM EDGE OF THE PICTURE CUTS STRAIGHT THROUGH THEM JUST BELOW THE HIPS. NO LEGS, NO
   KNEES, NO FEET, NO SHOES, NO SHADOWS ON THE GROUND, NO GROUND LINE - the lower body simply
   continues past the bottom edge. A HEAD IS ABOUT A QUARTER OF THE HEIGHT OF THE PICTURE. They
   are drawn at natural human proportions - not big-headed, not chibi; they look large because
   we are close to them, not because their heads are oversized.

2. THE BACKGROUND IS PLAIN WHITE AND COMPLETELY EMPTY. No room, no wall, no floor, no horizon
   line, no furniture, no frame, no border, no panel, no background colour, no scenery of any
   kind. The picture must look like nine people drawn straight onto white paper.

3. THERE IS NO QR CODE IN THIS PICTURE - THIS IS A HARD RULE. Do not draw a QR code, a square of
   black and white dots, a barcode, a phone screen with a code on it, a sign, a poster, a board,
   a card or a framed rectangle anywhere. Everyone is looking at, pointing at or aiming a phone
   at SOMETHING JUST ABOVE THE TOP EDGE OF THE PICTURE, which we cannot see. Their eyes and
   their hands go UP AND SLIGHTLY TOWARDS THE CENTRE of the top edge.

4. HOW THEY ARE CROWDED - TWO ROWS, PRESSED TOGETHER. ALL NINE ARE ADULTS OF ROUGHLY THE SAME
   BUILD; THERE ARE NO CHILDREN IN THIS PICTURE.
   FIVE of them stand in front, shoulder to shoulder, OVERLAPPING EACH OTHER BY ABOUT HALF A
   SHOULDER so the row is genuinely packed.
   THE OTHER FOUR STAND BEHIND AND LEAN IN. Draw them like this, and check each one:
     - THEIR HEADS SIT AT THE SAME HEIGHT AS THE FRONT ROW'S HEADS OR SLIGHTLY HIGHER. A BACK-ROW
       HEAD MUST NEVER APPEAR DOWN AT THE CHEST HEIGHT OF THE PEOPLE IN FRONT.
     - THEY ARE THE SAME SIZE AS THE FRONT ROW, or at most a little smaller - never small enough
       to read as a child.
     - EACH ONE SHOWS A HEAD AND AT LEAST ONE WHOLE SHOULDER, AND THE BODY CONTINUES DOWNWARDS
       AND DISAPPEARS BEHIND THE PERSON IN FRONT. NOBODY'S OUTLINE MAY SIMPLY STOP IN MID-AIR: no
       head floating with nothing under it, no half a person wedged between two others.
   THE SIDE EDGES CUT THROUGH BODIES, NOT THROUGH FACES. The person at each end is cut by the
   edge THROUGH THE SHOULDER, THE ARM OR THE TORSO, and leans inwards as if squeezing into the
   picture - but ALL NINE FACES ARE COMPLETE AND FULLY INSIDE THE PICTURE. Never cut a face,
   never cut a head in half.
   EVERY ARM AND EVERY HAND MUST CLEARLY BELONG TO A PERSON WE CAN SEE - follow each raised arm
   back to its own shoulder. No hand or sleeve floating on its own.
   Nobody is evenly spaced; nobody stands alone. They are EAST ASIAN, mixed ages, both sexes.
   NOBODY WEARS A FACE MASK; every face is visible and smiling. NOBODY LOOKS OUT AT THE VIEWER -
   every face is turned up towards the top edge or sideways towards a neighbour.

5. WHAT THEY ARE DOING - the whole group is enthusiastic, warm and a little noisy. Somewhere in
   the front row, EXACTLY THESE FOUR ACTIONS MUST BE THERE, one person each:
   (a) A WOMAN CALLING OTHER PEOPLE OVER: one arm raised, POINTING UP AND OUT OF THE TOP OF THE
       PICTURE with one finger, her other hand beside her mouth, head turned away to one side,
       mouth open in a cheerful shout.
   (b) A MAN PRESENTING IT WITH BOTH HANDS: BOTH ARMS RAISED AND OPEN, palms turned upwards and
       outwards towards the top edge, elbows bent - the plain "here it is, please look" gesture.
   (c) A WOMAN ABOUT TO SCAN IT: A PLAIN SMARTPHONE HELD UP IN BOTH HANDS at about the height of
       her own face, THE BACK OF THE PHONE TOWARDS US AND THE TOP OF THE PHONE TILTED UP, as if
       lining up a camera. We see the back of the phone, not the screen: a plain rounded
       rectangle with one small camera circle.
   (d) A WOMAN ALREADY LOOKING AT HER PHONE: phone in one hand at chest height, THE SCREEN
       TURNED AWAY FROM US so we cannot see anything on it, head tilted down, smiling to
       herself. THE SCREEN IS BLANK AND FEATURELESS - no icons, no text, no picture.
   The other five are simply glad to be there: waving with one hand, both hands raised in a
   small cheer, a hand on a colleague's shoulder, leaning in to look, one arm up beckoning.
   No two of them make the same gesture.

6. WHAT THEY ARE WEARING - THIS IS THE BRAND DETAIL, DRAW IT CAREFULLY. They all wear V-neck
   short-sleeved scrubs.
   A CAP AND A TOP ALWAYS MATCH: if someone wears a PRINTED cap, their top is cut from THE SAME
   PRINTED CLOTH; if someone wears a PLAIN top, any cap they wear is PLAIN AND THE SAME COLOUR AS
   THAT TOP. NEVER a printed cap over a plain top.
   THREE PRINTED FABRICS MUST BE THERE, ONE PERSON EACH - and only one person each - in the
   front row where they can be seen:
   (a) PRINTED DOODLE SCRUBS, exactly the ones in reference image 1 - THIS ONE IS REQUIRED, AND
       EXACTLY ONE PERSON IN THE WHOLE PICTURE WEARS THIS PRINT: her CAP and her TOP are cut from
       ONE AND THE SAME PRINTED FABRIC - warm off-white cloth (#f4ead8) scattered with SIMPLE
       FLAT CHILDLIKE DOODLES (little bears, chicks, clouds, stars, small flowers) in ONLY TWO
       COLOURS, amber (#c28229) and deep caramel (#9e6301). On her head A TIE-BACK SURGICAL CAP
       of the same cloth. Over it A WHITE COAT HANGING OPEN.
   (b) PRINTED PINE-TREE SCRUBS, the motifs of reference image 2 ONLY: little pine trees, round
       bushes and tiny triangles, SIMPLE FLAT TWO-COLOUR SHAPES in deep teal (#317d78) and
       off-white, on A PALE TINT OF THAT SAME TEAL, with a matching tie-back cap.
   (c) PRINTED DINOSAUR SCRUBS, the motifs of reference image 3 ONLY: a long-necked dinosaur, a
       spotted plated dinosaur and a small flying one, SIMPLE FLAT TWO-COLOUR SHAPES in deep
       blue (#4478b5) and off-white, on A PALE TINT OF THAT SAME BLUE.
   THE OTHER SIX WEAR PLAIN SCRUBS IN THREE DIFFERENT MUTED COLOURS, TWO PEOPLE EACH - NOT ALL
   IN THE SAME COLOUR:
       TWO in muted deep green (#3f654a),
       TWO in deep teal (#317d78),
       TWO in muted slate blue (#465885).
   NEVER MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR. Keep the two plain deep-teal people AWAY
   FROM the pine-tree person, at the other side of the group, so the two teals do not merge into
   one shape. FOUR of the nine wear A WHITE COAT HANGING OPEN over their scrubs; one or two wear
   a plain cap matching their own top. Nobody wears a solid saturated yellow, mustard, mint or
   turquoise garment.

7. THE TWO PRINTS MUST BE BIG AND FEW, NOT SMALL AND BUSY - THIS IS THE EASIEST THING TO GET
   WRONG. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a clear gap of
   about the same size between motifs, so that only THREE OR FOUR MOTIFS ARE VISIBLE ACROSS THE
   CHEST. Do not copy the density of the reference fabrics - they are photographs of real cloth
   and at this size that density turns into grey speckle. Each print uses only its two colours.
   No letters, no numbers, no words in any pattern.

8. THE WHITE COATS MUST STILL READ ON WHITE PAPER. Draw each coat with a clear thin hand-drawn
   outline and ONE STEP OF WARM GREY shading in the folds, the lapels and under the arms, so the
   coat separates from the empty white background. Never a flat pure-white shape with no edge.

9. STYLE. Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline, NOT a ruled vector line. Each face is ONE FLAT SKIN TONE with no shading: only the
   outline, two eyes drawn as small simple dots, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines. Hair is a flat shape in two tones. EVERY
   PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND SOLIDITY, including the ones further
   back - nobody is faded, greyed out or drawn as an outline only. Flat fills in two or three
   steps per colour, no gradients except to describe light. Fine paper grain over the whole
   image. Warm, calm, cheerful - never slick, never corporate, never a stock illustration.

10. COLOUR. The white background is the largest area by far and stays empty. The only strong
    colours are the uniforms: amber doodles, pale teal with teal trees, pale blue with blue
    dinosaurs, and the three muted plains - deep green, deep teal and slate blue - spread evenly
    across the group rather than bunched together. NO ONE COLOUR MAY DOMINATE THE UNIFORMS.
    Skin is a warm flat tone; hair is warm near-black; the phones are a neutral warm grey. NO
    neon, NO strong saturated red, NO gold, NO surgical blue or bright green, NO grey-blue
    clinical cast.

COMPOSITION ANCHORS: the top 8% of the picture is empty white and will be cut off; the group
touches and runs off the left edge, the right edge and the bottom edge; the bottom edge cuts
every figure just below the hips; a head is about a quarter of the picture height; nine adults,
five in front and four behind whose heads are as high as the front row's; every face complete
and inside the picture; six plain uniforms in three different colours, two people each.

AVOID: any text, letters, numbers, words or logos anywhere; a QR code, barcode, matrix of dots,
poster, sign, board, placard or framed rectangle; anything visible on a phone screen; any
background, room, wall, floor, furniture, horizon line, frame or border; any coloured background
panel; legs, knees, feet, shoes, ground shadows or a ground line; an empty margin at the bottom
or at the sides; a neat evenly spaced row of separated figures; anybody looking at the viewer;
A FACE OR A HEAD CUT BY THE EDGE OF THE PICTURE; A HEAD WITH NO BODY UNDER IT, OR A FIGURE WHOSE
OUTLINE STOPS IN MID-AIR; A BACK-ROW HEAD DOWN AT CHEST HEIGHT; A CHILD OR A CHILD-SIZED FIGURE;
A HAND, ARM OR SLEEVE THAT BELONGS TO NOBODY; A PRINTED CAP WORN WITH A PLAIN TOP; MORE THAN ONE
PERSON IN THE DOODLE PRINT; MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR; face masks; needles,
syringes, drills, dental instruments, blood; a dental chair; solid saturated yellow, mustard,
mint or turquoise uniforms; tiny busy multicoloured patterns; speech bubbles, arrows, sparkles,
motion lines, icons; anybody drawn faded, translucent, ghostly or outline-only; photorealism;
3D rendering; heavy even black outlines; a thick drop shadow.
```

### v3 的驗收（出圖之後逐條跑一次）

1. **九張臉每一張都完整**（左右緣切的是肩膀或手臂），而且**沒有一顆頭是浮著的** ——
   後排每一位都看得到頭 ＋ 一邊肩膀，身體往下接進前排後面。
2. **後排的頭沒有一顆落在前排的胸口高度**，也沒有任何一個人小到像小孩。
3. **每一隻舉起來的手都追得回它自己的肩膀。**
4. **素色刷手服三個顏色、各兩人**（深綠／青綠／藍灰），**沒有任何一色超過兩人**；
   素色青綠那兩位不在松樹印花旁邊。
5. **塗鴉印花只有一個人**，而且**戴印花帽的人身上一定是同一塊布**（素色的人不戴印花帽）。
6. 前四件仍然要在：沒有字、沒有 QR、沒有腳與影子、上面留著一條白。
7. 跑 `node drafts/channels/stand-illus-crop.mjs`，
   再**把卡片縮到 98 mm 寬看一次**，量一顆頭有沒有到 **12 mm** 左右
   （v2 已經到了，v3 若掉下來就是第 1 段被動到了），
   最後跑 `node drafts/channels/check-stand-card.mjs`。

## 五之五、✅ v3 定稿（2026-09-16）

使用者：「這版很好~ 用這個」。
成品 **`drafts/stand-card-illus-v3-src.jpg`（2000×989 ＝ 2.022）**，
`drafts/channels/stand-card.json` 的 `插圖.原檔` 已經指過去，
`node drafts/channels/stand-illus-crop.mjs` 裁成 **2000×945 ＝ 2.116**
（裁到墨是 2.262、比那一條寬，所以**從頭頂上那塊白裡把 61px 借回來**，
輸出的比例正好等於那一條）。

**v3 的驗收七條全過**：三種印花（塗鴉／松樹／恐龍）＋ 三個素色各兩人、
每一張臉都完整、後排的頭在前排的頭那一帶、兩側切的是身體、四件白袍、
沒有字也沒有 QR。臉量出來（膚色連通區，印 98 mm 寬）**前排 11.7~14.5 mm**，
連著帽子或頭髮的整顆頭比它再高一截 —— 第 7 條那個 12 mm 到了。

### ⚠⚠⚠ 接上去那一刻查出來的：那一塊實際只有 86.2 mm，不是 98

v3 的比例是照那一條算的（2.117），可是量 rect 得到的是
**86.24 × 40.75、兩側各留 5.88 mm 白、上面空 5.56 mm** ——
`.card .illus` 寫的是 `width:100%`，**那是內距框**（98 − 2×6%），
而裁圖那一支與面板**從第一版起都拿整張卡寬 98 在算**。
後果三件、一件都不會讓既有的守門翻臉：**兩側的出血變成兩條白**
（而「人被邊緣切掉」是 v2 起的規格，留白時會讀成畫錯）、
圖從高度在卡變成寬度在卡、**一顆頭小 12%**。
修法照帶子那一條（`width:var(--cw)` ＋ 負的左右外距），改完量到
**98 × 46.3、左右 0.0、上面 0.0**。推導與新的守門在
`drafts/channels/README.md` 第七十一之二十三節。

⚠ **所以第 7 條要多一句**：量頭之前先確認插圖真的被畫成整張卡寬
（守門已經在量，`✓ 全綠` 裡那一行寫著「插圖滿版」）。

## 五之六、v4 的提示詞（2026-09-16，使用者三件）

使用者原話：「那個圖片有地方要調整　**左邊數來第二個男生　頭帽和刷手服顏色不一致**／
**左邊數來第四位女生　她的手食指指向上方　但卻畫成白袍的袖子　他是穿刷手服沒有白袍**／
另外**診所主題色有根管的紅色　和口外的紫色　各找一個人把這兩個顏色加在刷手服上
（有頭帽的話也要改）**」。

⚠⚠⚠ **v3 已經定稿並接到卡片上了，所以這一版是「修三處」不是「重畫」** ——
提示詞最前面因此多一塊 `WHAT CHANGES IN THIS VERSION`，逐條寫「哪三件要改、其餘都只是讓你核對」，
而且把 **v3 的成品本人**當第 ⑤ 張參考圖。**沒有這一塊，已經對的東西會被重新擲一次骰子**
（同第二十五節颱風那一輪：每一段的口氣要換成「上一版已經對了，這一段只是讓你核對」）。

### 先量再改（v3 成品 2000×945，印 98 mm 寬）

| 使用者指的 | 量出來 |
| --- | --- |
| 左邊數來第 2 位（男） | **帽 `#687d77`（灰綠）、上衣 `#666e84`（藍灰 ≒ `#465885` 的亮階）** —— 兩個色相差一大截 |
| 左邊數來第 4 位（女） | 上衣 `#3f7377`（≒ 青綠 `#317d78`），**身上沒有白袍**；那隻舉起來指上方的手，袖子量到 `#fefefe` ＝ **白袍的袖子** |

⚠ 他是**按人頭數的不是按性別數的**（第 2 位剛好是男生、第 4 位剛好是女生），
兩處都對得上，**不必再問是哪一個**。
⚠⚠ 順帶量到一件沒有人提的：**v3 實際畫了十個人，提示詞寫的是九個**。
使用者沒有意見（他要的正是「熱鬧」），所以 **v4 的九這個數字一個字都沒有改** ——
素色那一段改寫成「**其餘每一個穿素色的人**」，九個或十個都成立。
⚠ 卡片上那張圖的 `alt` 從第一版起就刻意沒有寫人數，理由就是這個。

### 兩件的成因，兩件不同 —— 而且**兩條規則 v3 都寫了**

**① 帽子和上衣不成套** —— v3 第 6 段寫著「素色的人戴的帽子是**同色**的素帽」，
可是 `AVOID` 那一側只擋了 **`A PRINTED CAP WORN WITH A PLAIN TOP`**（印花帽配素色上衣），
**沒有擋「素帽配另一個顏色的素上衣」** —— 這一次違反的正好是沒被擋到的那一半。
⚠⚠⚠ **通則：寫一條「A 要和 B 一致」的規則時，`AVOID` 要擋的是「不一致」本身，
不是某一種特定的不一致** —— 正文的規則會被當成建議，`AVOID` 才是硬的（第十四節那條），
而一條只擋住半邊的禁令，看起來和擋住整件事一模一樣。
→ v4 把那一段改成**逐個核對**（「戴帽子的人一個一個看過」），
並明寫兩個反例（綠帽配藍上衣、青綠帽配綠上衣），`AVOID` 補上
`A PLAIN CAP IN A DIFFERENT COLOUR FROM ITS WEARER'S OWN TOP`。

**② 舉起來的手穿錯衣服** —— v3 第 4 段寫著「每一隻手都要追得回它自己的肩膀」，
而這一隻**真的接得回去**、畫面也完全正常 —— 錯的是**袖子**。
⚠⚠⚠ **通則：「這隻手是誰的」有兩層 —— 接得回肩膀（幾何）與袖子對不對（衣服）。**
只寫第一層的話，第二層失敗時**每一條既有的規則都通過**，
而讀的人一眼就看到一個穿短袖的人長出一隻白袍的手臂。
→ v4 補上「**袖子一定是它主人身上那一件**」：刷手服是**短袖**，所以沒穿白袍的人
舉起來的是**裸露的前臂**；只有穿白袍的那四位才有白袖子。`AVOID` 同步補兩條。

### 三、兩個新顏色 —— **七科到此全部到齊**

| 科 | 色 | 這一版怎麼出現 |
| --- | --- | --- |
| 一般牙科 | `#3f654a` | 素色（最多兩人） |
| 牙周治療 | `#317d78` | 松樹印花 ＋ 素色（最多兩人） |
| 植牙・假牙重建 | `#465885` | 素色（最多兩人） |
| 兒童牙科 | `#c28229` ＋ `#9e6301` | 塗鴉印花（全圖只有一人） |
| 齒顎矯正 | `#4478b5` | 恐龍印花 |
| **顯微根管** | **`#ae4f4d`** | **素色，正好一人（新加）** |
| **口腔外科** | **`#8e6299`** | **素色，正好一人（新加）** |

⚠ 兩支都是**站上現成的套色**（出處 `preview/line-booked/wm-sizes.json`），**一個新顏色都沒有加**。
⚠⚠ 素色因此從「三色各兩人」變成「**五色，同一色最多兩人，紅與紫各正好一人**」——
寫成「各正好一人」是照使用者的話（「各找一個人」），而且它同時擋掉「一整排紅色」。
⚠⚠⚠ **磚紅要離塗鴉那位遠一點**（兩個暖色並排會糊成一塊），
素色青綠要離松樹印花遠一點（v3 就有的那一條）—— 紅與紫**各站一邊、不要相鄰**。
⚠⚠ **`AVOID` 與第 10 段原本寫著 `NO strong saturated red`**，不鬆綁的話新指令會被它擋掉
（第十四節：`AVOID` 通常贏過正文）—— 改寫成「**全圖唯一的紅就是那一件磚紅制服**，
不要消防車紅、不要猩紅、不要任何會讀成血的紅」，**「不要有血」那一條原封不動**。

### 要附的參考圖

**同五之三那五張**，第 ⑤ 張換成 **`drafts/stand-card-illus-v3-src.jpg`（v3 的成品本人）**，
標籤要寫成：**「整張照抄 —— 畫風、臉、擠在一起的密度、三種印花、白袍、裁法；
⚠ 只有三件要改：一個人換磚紅、一個人換紫、那位男生的帽子要和上衣同色、
那隻指上去的手要換成裸露的前臂」**。

### 提示詞（v4，逐字）

⚠ 和 v3 比，**沒有動的**：第 0、1、2、3、5、7、8、9 段（畫風、臉的畫法、畫到髖下、
一顆頭佔四分之一、零文字、不要畫 QR、四個動作、印花要大而少、白袍要有邊）。
**改的是第 4 段的最後一句（袖子）、第 6 段（帽子成套 ＋ 素色那五色）、第 10 段（顏色），
最前面多一塊「這一版只改三件」，`COMPOSITION ANCHORS` 與 `AVOID` 跟著換。**

```
Editorial illustration for a printed counter card, drawn as A SINGLE WIDE HORIZONTAL BAND OF
PEOPLE - a frieze, not a scene. Wide landscape, about 2:1 (for example 1200 x 600 px). Printed
only 98 mm wide, so keep every shape big and simple, no small detail, and ABSOLUTELY NO TEXT,
LETTERS, NUMBERS OR LOGOS ANYWHERE IN THE PICTURE.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: NINE members of a small dental
clinic's staff have crowded together in a cheerful huddle, all of them delighted about A QR CODE
THAT IS NOT IN THE PICTURE - it is on the card ABOVE THE TOP EDGE. They are pressing in from
both sides to get into the picture, waving, pointing and calling other people over to look.

WHAT CHANGES IN THIS VERSION - reference image 5 is the previous version and IT IS ALREADY
ALMOST RIGHT. Keep its style, its faces, its crowding, its three printed fabrics, its white coats
and its framing. ONLY THREE THINGS CHANGE, and everything else below is there for you to check
against, not to redo:
  (i)   ONE person's plain scrubs become MUTED BRICK RED (#ae4f4d) and one other person's become
        MUTED PLUM PURPLE (#8e6299) - see section 6.
  (ii)  Every cap must be exactly the same colour or the same cloth as the top of the person
        wearing it - in the previous version one man wore a green cap over a blue top.
  (iii) Every raised arm must wear its owner's own sleeve - in the previous version a woman in
        short-sleeved scrubs pointed upwards with a WHITE COAT SLEEVE on her arm; she has no
        white coat, so that forearm is bare.

0. THE FRAME. Leave A NARROW EMPTY WHITE BAND ACROSS THE TOP, about 8% of the height - nothing
   but white paper there, it will be trimmed off. EVERYWHERE ELSE THE PICTURE IS FULL: the
   people RUN OFF THE LEFT EDGE, OFF THE RIGHT EDGE AND OFF THE BOTTOM EDGE. Do not leave an
   empty margin at the bottom or at the sides, and do not shrink the group to fit inside the
   frame.

1. HOW MUCH OF EACH PERSON WE SEE - THIS IS THE MOST IMPORTANT INSTRUCTION. WE SEE THEM FROM THE
   TOP OF THE HEAD DOWN TO JUST BELOW THE HIPS, AND THAT FILLS THE WHOLE HEIGHT OF THE PICTURE.
   THE BOTTOM EDGE OF THE PICTURE CUTS STRAIGHT THROUGH THEM JUST BELOW THE HIPS. NO LEGS, NO
   KNEES, NO FEET, NO SHOES, NO SHADOWS ON THE GROUND, NO GROUND LINE - the lower body simply
   continues past the bottom edge. A HEAD IS ABOUT A QUARTER OF THE HEIGHT OF THE PICTURE. They
   are drawn at natural human proportions - not big-headed, not chibi; they look large because
   we are close to them, not because their heads are oversized.

2. THE BACKGROUND IS PLAIN WHITE AND COMPLETELY EMPTY. No room, no wall, no floor, no horizon
   line, no furniture, no frame, no border, no panel, no background colour, no scenery of any
   kind. The picture must look like nine people drawn straight onto white paper.

3. THERE IS NO QR CODE IN THIS PICTURE - THIS IS A HARD RULE. Do not draw a QR code, a square of
   black and white dots, a barcode, a phone screen with a code on it, a sign, a poster, a board,
   a card or a framed rectangle anywhere. Everyone is looking at, pointing at or aiming a phone
   at SOMETHING JUST ABOVE THE TOP EDGE OF THE PICTURE, which we cannot see. Their eyes and
   their hands go UP AND SLIGHTLY TOWARDS THE CENTRE of the top edge.

4. HOW THEY ARE CROWDED - TWO ROWS, PRESSED TOGETHER. ALL NINE ARE ADULTS OF ROUGHLY THE SAME
   BUILD; THERE ARE NO CHILDREN IN THIS PICTURE.
   FIVE of them stand in front, shoulder to shoulder, OVERLAPPING EACH OTHER BY ABOUT HALF A
   SHOULDER so the row is genuinely packed.
   THE OTHER FOUR STAND BEHIND AND LEAN IN. Draw them like this, and check each one:
     - THEIR HEADS SIT AT THE SAME HEIGHT AS THE FRONT ROW'S HEADS OR SLIGHTLY HIGHER. A BACK-ROW
       HEAD MUST NEVER APPEAR DOWN AT THE CHEST HEIGHT OF THE PEOPLE IN FRONT.
     - THEY ARE THE SAME SIZE AS THE FRONT ROW, or at most a little smaller - never small enough
       to read as a child.
     - EACH ONE SHOWS A HEAD AND AT LEAST ONE WHOLE SHOULDER, AND THE BODY CONTINUES DOWNWARDS
       AND DISAPPEARS BEHIND THE PERSON IN FRONT. NOBODY'S OUTLINE MAY SIMPLY STOP IN MID-AIR: no
       head floating with nothing under it, no half a person wedged between two others.
   THE SIDE EDGES CUT THROUGH BODIES, NOT THROUGH FACES. The person at each end is cut by the
   edge THROUGH THE SHOULDER, THE ARM OR THE TORSO, and leans inwards as if squeezing into the
   picture - but ALL NINE FACES ARE COMPLETE AND FULLY INSIDE THE PICTURE. Never cut a face,
   never cut a head in half.
   EVERY ARM AND EVERY HAND MUST CLEARLY BELONG TO A PERSON WE CAN SEE - follow each raised arm
   back to its own shoulder. No hand or sleeve floating on its own.
   AND THE SLEEVE ON THAT ARM MUST BE THE GARMENT ITS OWNER IS ACTUALLY WEARING - CHECK EVERY
   RAISED ARM ONE BY ONE. Scrubs have SHORT sleeves, so a person who is NOT wearing a white coat
   raises A BARE FOREARM, with the short sleeve ending high on the upper arm. ONLY the people who
   wear a white coat have a white sleeve running down to the wrist. Never draw a white coat
   sleeve on somebody who has no white coat, and never draw a bare forearm coming out of a coat.
   Nobody is evenly spaced; nobody stands alone. They are EAST ASIAN, mixed ages, both sexes.
   NOBODY WEARS A FACE MASK; every face is visible and smiling. NOBODY LOOKS OUT AT THE VIEWER -
   every face is turned up towards the top edge or sideways towards a neighbour.

5. WHAT THEY ARE DOING - the whole group is enthusiastic, warm and a little noisy. Somewhere in
   the front row, EXACTLY THESE FOUR ACTIONS MUST BE THERE, one person each:
   (a) A WOMAN CALLING OTHER PEOPLE OVER: one arm raised, POINTING UP AND OUT OF THE TOP OF THE
       PICTURE with one finger, her other hand beside her mouth, head turned away to one side,
       mouth open in a cheerful shout.
   (b) A MAN PRESENTING IT WITH BOTH HANDS: BOTH ARMS RAISED AND OPEN, palms turned upwards and
       outwards towards the top edge, elbows bent - the plain "here it is, please look" gesture.
   (c) A WOMAN ABOUT TO SCAN IT: A PLAIN SMARTPHONE HELD UP IN BOTH HANDS at about the height of
       her own face, THE BACK OF THE PHONE TOWARDS US AND THE TOP OF THE PHONE TILTED UP, as if
       lining up a camera. We see the back of the phone, not the screen: a plain rounded
       rectangle with one small camera circle.
   (d) A WOMAN ALREADY LOOKING AT HER PHONE: phone in one hand at chest height, THE SCREEN
       TURNED AWAY FROM US so we cannot see anything on it, head tilted down, smiling to
       herself. THE SCREEN IS BLANK AND FEATURELESS - no icons, no text, no picture.
   The other five are simply glad to be there: waving with one hand, both hands raised in a
   small cheer, a hand on a colleague's shoulder, leaning in to look, one arm up beckoning.
   No two of them make the same gesture.

6. WHAT THEY ARE WEARING - THIS IS THE BRAND DETAIL, DRAW IT CAREFULLY. They all wear V-neck
   short-sleeved scrubs.
   A CAP AND A TOP ARE ALWAYS ONE SET - GO THROUGH THE PEOPLE WHO WEAR A CAP ONE BY ONE AND CHECK
   THIS. If someone wears a PRINTED cap, their top is cut from THE SAME PRINTED CLOTH. If someone
   wears a PLAIN top, any cap they wear is PLAIN AND EXACTLY THE SAME COLOUR AS THAT TOP - not a
   different shade, not a neighbouring colour, THE SAME COLOUR. A green cap over a blue top, or a
   teal cap over a green top, is WRONG. NEVER a printed cap over a plain top. If in doubt, leave
   the cap off.
   THREE PRINTED FABRICS MUST BE THERE, ONE PERSON EACH - and only one person each - in the
   front row where they can be seen:
   (a) PRINTED DOODLE SCRUBS, exactly the ones in reference image 1 - THIS ONE IS REQUIRED, AND
       EXACTLY ONE PERSON IN THE WHOLE PICTURE WEARS THIS PRINT: her CAP and her TOP are cut from
       ONE AND THE SAME PRINTED FABRIC - warm off-white cloth (#f4ead8) scattered with SIMPLE
       FLAT CHILDLIKE DOODLES (little bears, chicks, clouds, stars, small flowers) in ONLY TWO
       COLOURS, amber (#c28229) and deep caramel (#9e6301). On her head A TIE-BACK SURGICAL CAP
       of the same cloth. Over it A WHITE COAT HANGING OPEN.
   (b) PRINTED PINE-TREE SCRUBS, the motifs of reference image 2 ONLY: little pine trees, round
       bushes and tiny triangles, SIMPLE FLAT TWO-COLOUR SHAPES in deep teal (#317d78) and
       off-white, on A PALE TINT OF THAT SAME TEAL, with a matching tie-back cap.
   (c) PRINTED DINOSAUR SCRUBS, the motifs of reference image 3 ONLY: a long-necked dinosaur, a
       spotted plated dinosaur and a small flying one, SIMPLE FLAT TWO-COLOUR SHAPES in deep
       blue (#4478b5) and off-white, on A PALE TINT OF THAT SAME BLUE.
   EVERYONE ELSE WEARS PLAIN SCRUBS, AND THEIR COLOURS COME FROM THIS LIST OF FIVE - SPREAD THEM
   ACROSS THE GROUP, NEVER BUNCHED TOGETHER:
       muted deep green (#3f654a)        - at most two people
       deep teal (#317d78)               - at most two people
       muted slate blue (#465885)        - at most two people
       MUTED BRICK RED (#ae4f4d)         - EXACTLY ONE PERSON, NO MORE AND NO FEWER
       MUTED PLUM PURPLE (#8e6299)       - EXACTLY ONE PERSON, NO MORE AND NO FEWER
   THE BRICK-RED PERSON AND THE PLUM-PURPLE PERSON ARE BOTH IN THE FRONT ROW, FULLY VISIBLE, AND
   THEY STAND ON OPPOSITE SIDES OF THE GROUP - not next to each other. Keep the brick-red person
   AWAY FROM the amber doodle person (two warm colours side by side merge into one patch), and
   keep the plain deep-teal person AWAY FROM the pine-tree person. If either of them wears a cap,
   THAT CAP IS PLAIN AND EXACTLY THE SAME BRICK RED OR PLUM PURPLE AS THEIR OWN TOP.
   NEVER MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR. FOUR of them wear A WHITE COAT HANGING
   OPEN over their scrubs; one or two wear a plain cap matching their own top. Nobody wears a
   solid saturated yellow, mustard, mint or turquoise garment.

7. THE TWO PRINTS MUST BE BIG AND FEW, NOT SMALL AND BUSY - THIS IS THE EASIEST THING TO GET
   WRONG. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a clear gap of
   about the same size between motifs, so that only THREE OR FOUR MOTIFS ARE VISIBLE ACROSS THE
   CHEST. Do not copy the density of the reference fabrics - they are photographs of real cloth
   and at this size that density turns into grey speckle. Each print uses only its two colours.
   No letters, no numbers, no words in any pattern.

8. THE WHITE COATS MUST STILL READ ON WHITE PAPER. Draw each coat with a clear thin hand-drawn
   outline and ONE STEP OF WARM GREY shading in the folds, the lapels and under the arms, so the
   coat separates from the empty white background. Never a flat pure-white shape with no edge.

9. STYLE. Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline, NOT a ruled vector line. Each face is ONE FLAT SKIN TONE with no shading: only the
   outline, two eyes drawn as small simple dots, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines. Hair is a flat shape in two tones. EVERY
   PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND SOLIDITY, including the ones further
   back - nobody is faded, greyed out or drawn as an outline only. Flat fills in two or three
   steps per colour, no gradients except to describe light. Fine paper grain over the whole
   image. Warm, calm, cheerful - never slick, never corporate, never a stock illustration.

10. COLOUR. The white background is the largest area by far and stays empty. The only strong
    colours are the uniforms: amber doodles, pale teal with teal trees, pale blue with blue
    dinosaurs, and the plains - deep green, deep teal, slate blue, ONE BRICK RED (#ae4f4d) AND ONE
    PLUM PURPLE (#8e6299) - spread evenly across the group rather than bunched together. NO ONE
    COLOUR MAY DOMINATE THE UNIFORMS. Skin is a warm flat tone; hair is warm near-black; the
    phones are a neutral warm grey. THE ONLY RED IN THE PICTURE IS THAT ONE MUTED BRICK-RED
    UNIFORM: no fire-engine red, no scarlet, no crimson, nothing that could read as blood. NO
    neon, NO gold, NO surgical blue or bright green, NO grey-blue clinical cast.

COMPOSITION ANCHORS: the top 8% of the picture is empty white and will be cut off; the group
touches and runs off the left edge, the right edge and the bottom edge; the bottom edge cuts
every figure just below the hips; a head is about a quarter of the picture height; nine adults,
five in front and four behind whose heads are as high as the front row's; every face complete
and inside the picture; the plain uniforms use five colours with at most two people in any one of
them, and EXACTLY ONE brick-red uniform and EXACTLY ONE plum-purple uniform; every cap is the same
cloth or the same colour as its own wearer's top; every raised arm wears its owner's own sleeve.

AVOID: any text, letters, numbers, words or logos anywhere; a QR code, barcode, matrix of dots,
poster, sign, board, placard or framed rectangle; anything visible on a phone screen; any
background, room, wall, floor, furniture, horizon line, frame or border; any coloured background
panel; legs, knees, feet, shoes, ground shadows or a ground line; an empty margin at the bottom
or at the sides; a neat evenly spaced row of separated figures; anybody looking at the viewer;
A FACE OR A HEAD CUT BY THE EDGE OF THE PICTURE; A HEAD WITH NO BODY UNDER IT, OR A FIGURE WHOSE
OUTLINE STOPS IN MID-AIR; A BACK-ROW HEAD DOWN AT CHEST HEIGHT; A CHILD OR A CHILD-SIZED FIGURE;
A HAND, ARM OR SLEEVE THAT BELONGS TO NOBODY; A WHITE COAT SLEEVE ON THE RAISED ARM OF SOMEBODY
WHO IS NOT WEARING A WHITE COAT, OR ANY SLEEVE THAT IS NOT THE GARMENT ITS OWNER IS WEARING; A
PRINTED CAP WORN WITH A PLAIN TOP; A PLAIN CAP IN A DIFFERENT COLOUR FROM ITS WEARER'S OWN TOP;
MORE THAN ONE PERSON IN THE DOODLE PRINT; MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR; MORE THAN
ONE BRICK-RED UNIFORM OR MORE THAN ONE PLUM-PURPLE UNIFORM, OR NONE OF EITHER; face masks; needles,
syringes, drills, dental instruments, blood; a dental chair; solid saturated yellow, mustard,
mint or turquoise uniforms; tiny busy multicoloured patterns; speech bubbles, arrows, sparkles,
motion lines, icons; anybody drawn faded, translucent, ghostly or outline-only; photorealism;
3D rendering; heavy even black outlines; a thick drop shadow.
```

### v4 的驗收（出圖之後逐條跑一次）

1. **戴帽子的人一個一個看過**：帽子和上衣**同一塊布或同一個顏色**，一個例外都沒有。
2. **每一隻舉起來的手**：追得回自己的肩膀（v3 那一條），**而且袖子是它主人身上那一件** ——
   沒穿白袍的人舉的是裸露的前臂。
3. **磚紅正好一人、紫正好一人**，兩個人不相鄰，磚紅沒有站在塗鴉那位旁邊。
4. **同一個素色最多兩人**，而且沒有任何一個顏色佔掉制服的一半。
5. 紅色只有那一件 —— **沒有任何一塊會被讀成血**。
6. v3 已經對的那幾件**一件都沒有壞掉**：九（或十）張臉都完整、沒有浮著的頭、
   後排的頭不在前排胸口、沒有腳沒有影子、上緣留白、圖裡零文字零 QR。
7. **把圖縮到 98 mm 寬看一次** —— 螢幕上放大看不算數。

---

## 五之七、v5 的提示詞（2026-09-16，使用者：圖片有點太安靜了）

> 「我覺得圖片有點太安靜了　雖然很多人也有動作　加一點線條　例如　左三黃衣服的看起來是
> 往上叫喊的樣子　或是右邊拿手機打字　應該都可以加點線條或標示動作　聲音的感覺
> 其他人也可以稍微加一點　給提示詞」

⚠⚠⚠ **他決定的正是第六節第 5 項，而且範圍比那一條大。** 那一條寫的是
「頭上那三條短線要不要畫……**只給 Ⓐ 一個人**」，講的是**情緒**（「哇」）；
他要的是**動作與聲音**，而且點名了兩個人、還加一句「其他人也可以稍微加一點」。
所以 `AVOID` 那一行明文禁止的 `motion lines` **這一版要拿掉**
（⚠ `sparkles`／`speech bubbles`／`icons` 三個仍然禁，見下面那一段）——
**這是「每一輪都要把自己上一版的 `AVOID` 逐條唸過一次」那條的第三次現場。**

### 先認人（v4 成品，左 → 右，量過不是猜的）

| | 誰 | 在做什麼 | 這一版加線嗎 |
| --- | --- | --- | --- |
| ① | 磚紅素色 女（被左緣切到） | 舉手打招呼 | 一到兩道 |
| ② | 藍灰帽＋藍灰上衣 男（後排） | 站著微笑 | **不加** |
| ③ | **米黃塗鴉印花 ＋ 白袍 女** | **張嘴往上喊**、一手張開舉起 | ⭐ **這一張最響的一組**（他說的「左三黃衣服」） |
| ④ | 深青綠素色 女（後排） | 食指往上指 | 一到兩道 |
| ⑤ | 松樹印花 ＋ 青綠帽 男 | 手臂高舉揮手 | 一到兩道 |
| ⑥ | 恐龍印花 女 | 雙手把手機舉起來 | 一道 |
| ⑦ | 深綠帽＋深綠上衣 男（後排） | 站著微笑 | **不加** |
| ⑧ | **磚紅素色 馬尾 女** | **低頭看手機打字** | ⭐ 他說的「右邊拿手機打字」 |
| ⑨ | 藍綠帽＋藍灰上衣 男（後排） | 站著微笑 | **不加** ⚠ 帽與上衣不同色（v4 留下的瑕疵） |
| ⑩ | 紫帽＋紫上衣 ＋ 白袍 女 | 站著微笑 | **不加** |

### ⚠⚠⚠ 一條只有量過才知道的硬邊界：線不可以往上長

原檔 2000×989，**墨的框從 y=104 開始**（上面 104 列是白的），而裁圖那一支
（`stand-illus-crop.mjs`）為了把比例撐到卡片那一條的 2.117，**已經從那塊白裡借走 60 列**
（裁出來是 y 44..988）。所以**還剩 44 列的餘裕 ＝ 畫面高度的 4.5%**。

線如果畫到 y=44 以上，裁出來就會比那一條**高**，`object-fit: contain` 會改成高度在卡、
**左右各留一條白** —— 而「人被左右緣切掉」從 v2 起是規格，留白就會被讀成畫錯。
**所以第 0 段那條「上面留一條白」這一版要多一句：那條白不可以被任何線佔用。**

### ⚠⚠ 誠實的一半：線加得再多，站著不動的人還是安靜的

這一版的規矩是「**一道線沒有在解釋畫面裡已經發生的動作就不要畫**」
（＝颱風那一輪第 25-19 節那條），而九（十）個人裡**只有四個有動作**，其餘是站著微笑。
所以線治得到的是「有動作的人看起來更用力」，治不到「一半的人只是站著」。
要更熱鬧還有第二條路：**給後排的人動作**（拍肩、探頭、兩手比讚）——
那會動到構圖、等於重畫，**沒有自己走**，寫進第六節。

### ⚠ 順手一起修 v4 留下的兩件（反正要重新生成，修它是免費的）

1. **磚紅有兩個人穿**（①與⑧），提示詞寫的是 EXACTLY ONE。
   → **⑧ 留著磚紅**（她在前排、完整看得到、離塗鴉那位最遠 ＝ 提示詞自己那三條），
   **① 換成深綠 `#3f654a`**（⑦ 也是深綠，兩個人剛好在最左與偏右、不相鄰）。
2. **⑨ 的帽 `#447378`（藍綠）配上衣 `#5a677e`（藍灰）** —— 和 v4 那一輪點名的第一件
   同一種、只是換了一個人（＝**「一條『每一個都要如何』的規則，模型只會改被點名的那一個」**）。

### 要附的參考圖

**同五之三那五張**，第 ⑤ 張換成 **`drafts/stand-card-illus-v4-src.jpg`（v4 的成品本人）**，
標籤要寫成：**「整張照抄 —— 畫風、臉、姿勢、擠在一起的密度、三種印花、白袍、裁法；
⚠ 只有三件要改：加幾道動作與聲音的短線、最左那位的磚紅換成深綠、
後排右邊那位的帽子換成和上衣同色」**。

### 提示詞（v5，逐字）

⚠ 和 v4 比，**沒有動的**：第 0 段以外的第 1~10 段（畫風、臉的畫法、畫到髖下、
一顆頭佔四分之一、零文字、不要畫 QR、四個動作、印花要大而少、白袍要有邊、顏色）。
**改的是最前面那一塊「這一版只改三件」、第 0 段多一句、新增第 11 段，
`COMPOSITION ANCHORS` 與 `AVOID` 跟著換。**

```
Editorial illustration for a printed counter card, drawn as A SINGLE WIDE HORIZONTAL BAND OF
PEOPLE - a frieze, not a scene. Wide landscape, about 2:1 (for example 1200 x 600 px). Printed
only 98 mm wide, so keep every shape big and simple, no small detail, and ABSOLUTELY NO TEXT,
LETTERS, NUMBERS OR LOGOS ANYWHERE IN THE PICTURE.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: NINE members of a small dental
clinic's staff have crowded together in a cheerful huddle, all of them delighted about A QR CODE
THAT IS NOT IN THE PICTURE - it is on the card ABOVE THE TOP EDGE. They are pressing in from
both sides to get into the picture, waving, pointing and calling other people over to look.

WHAT CHANGES IN THIS VERSION - reference image 5 is the previous version and IT IS ALREADY
ALMOST RIGHT. Keep its style, its faces, its poses, its crowding, its three printed fabrics, its
white coats and its framing - DO NOT RE-DRAW THE GROUP. ONLY THREE THINGS CHANGE, and everything
else below is there for you to check against, not to redo:
  (i)   ADD A FEW SHORT ACTION AND SOUND LINES - see section 11. THIS IS THE MAIN CHANGE.
  (ii)  TWO people wear brick red in the previous version and only ONE may. THE WOMAN ON THE
        RIGHT WHO IS LOOKING DOWN AT HER PHONE KEEPS HER BRICK RED (#ae4f4d); THE WOMAN AT THE
        FAR LEFT - the one the left edge cuts through, who is waving - CHANGES TO MUTED DEEP
        GREEN (#3f654a).
  (iii) The man in the back row on the right wears a TEAL cap over a SLATE BLUE top. HIS CAP
        BECOMES EXACTLY THE SAME SLATE BLUE AS HIS OWN TOP.

0. THE FRAME. Leave A NARROW EMPTY WHITE BAND ACROSS THE TOP, about 8% of the height - nothing
   but white paper there, it will be trimmed off, AND NOTHING MAY REACH INTO IT: no hand, no
   finger, no hair and NONE OF THE NEW ACTION LINES. EVERYWHERE ELSE THE PICTURE IS FULL: the
   people RUN OFF THE LEFT EDGE, OFF THE RIGHT EDGE AND OFF THE BOTTOM EDGE. Do not leave an
   empty margin at the bottom or at the sides, and do not shrink the group to fit inside the
   frame.

1. HOW MUCH OF EACH PERSON WE SEE - THIS IS THE MOST IMPORTANT INSTRUCTION. WE SEE THEM FROM THE
   TOP OF THE HEAD DOWN TO JUST BELOW THE HIPS, AND THAT FILLS THE WHOLE HEIGHT OF THE PICTURE.
   THE BOTTOM EDGE OF THE PICTURE CUTS STRAIGHT THROUGH THEM JUST BELOW THE HIPS. NO LEGS, NO
   KNEES, NO FEET, NO SHOES, NO SHADOWS ON THE GROUND, NO GROUND LINE - the lower body simply
   continues past the bottom edge. A HEAD IS ABOUT A QUARTER OF THE HEIGHT OF THE PICTURE. They
   are drawn at natural human proportions - not big-headed, not chibi; they look large because
   we are close to them, not because their heads are oversized.

2. THE BACKGROUND IS PLAIN WHITE AND COMPLETELY EMPTY. No room, no wall, no floor, no horizon
   line, no furniture, no frame, no border, no panel, no background colour, no scenery of any
   kind. The picture must look like nine people drawn straight onto white paper.

3. THERE IS NO QR CODE IN THIS PICTURE - THIS IS A HARD RULE. Do not draw a QR code, a square of
   black and white dots, a barcode, a phone screen with a code on it, a sign, a poster, a board,
   a card or a framed rectangle anywhere. Everyone is looking at, pointing at or aiming a phone
   at SOMETHING JUST ABOVE THE TOP EDGE OF THE PICTURE, which we cannot see. Their eyes and
   their hands go UP AND SLIGHTLY TOWARDS THE CENTRE of the top edge.

4. HOW THEY ARE CROWDED - TWO ROWS, PRESSED TOGETHER. ALL NINE ARE ADULTS OF ROUGHLY THE SAME
   BUILD; THERE ARE NO CHILDREN IN THIS PICTURE.
   FIVE of them stand in front, shoulder to shoulder, OVERLAPPING EACH OTHER BY ABOUT HALF A
   SHOULDER so the row is genuinely packed.
   THE OTHER FOUR STAND BEHIND AND LEAN IN. Draw them like this, and check each one:
     - THEIR HEADS SIT AT THE SAME HEIGHT AS THE FRONT ROW'S HEADS OR SLIGHTLY HIGHER. A BACK-ROW
       HEAD MUST NEVER APPEAR DOWN AT THE CHEST HEIGHT OF THE PEOPLE IN FRONT.
     - THEY ARE THE SAME SIZE AS THE FRONT ROW, or at most a little smaller - never small enough
       to read as a child.
     - EACH ONE SHOWS A HEAD AND AT LEAST ONE WHOLE SHOULDER, AND THE BODY CONTINUES DOWNWARDS
       AND DISAPPEARS BEHIND THE PERSON IN FRONT. NOBODY'S OUTLINE MAY SIMPLY STOP IN MID-AIR: no
       head floating with nothing under it, no half a person wedged between two others.
   THE SIDE EDGES CUT THROUGH BODIES, NOT THROUGH FACES. The person at each end is cut by the
   edge THROUGH THE SHOULDER, THE ARM OR THE TORSO, and leans inwards as if squeezing into the
   picture - but ALL NINE FACES ARE COMPLETE AND FULLY INSIDE THE PICTURE. Never cut a face,
   never cut a head in half.
   EVERY ARM AND EVERY HAND MUST CLEARLY BELONG TO A PERSON WE CAN SEE - follow each raised arm
   back to its own shoulder. No hand or sleeve floating on its own.
   AND THE SLEEVE ON THAT ARM MUST BE THE GARMENT ITS OWNER IS ACTUALLY WEARING - CHECK EVERY
   RAISED ARM ONE BY ONE. Scrubs have SHORT sleeves, so a person who is NOT wearing a white coat
   raises A BARE FOREARM, with the short sleeve ending high on the upper arm. ONLY the people who
   wear a white coat have a white sleeve running down to the wrist. Never draw a white coat
   sleeve on somebody who has no white coat, and never draw a bare forearm coming out of a coat.
   Nobody is evenly spaced; nobody stands alone. They are EAST ASIAN, mixed ages, both sexes.
   NOBODY WEARS A FACE MASK; every face is visible and smiling. NOBODY LOOKS OUT AT THE VIEWER -
   every face is turned up towards the top edge or sideways towards a neighbour.

5. WHAT THEY ARE DOING - the whole group is enthusiastic, warm and a little noisy. Somewhere in
   the front row, EXACTLY THESE FOUR ACTIONS MUST BE THERE, one person each:
   (a) A WOMAN CALLING OTHER PEOPLE OVER: one arm raised, POINTING UP AND OUT OF THE TOP OF THE
       PICTURE with one finger, her other hand beside her mouth, head turned away to one side,
       mouth open in a cheerful shout.
   (b) A MAN PRESENTING IT WITH BOTH HANDS: BOTH ARMS RAISED AND OPEN, palms turned upwards and
       outwards towards the top edge, elbows bent - the plain "here it is, please look" gesture.
   (c) A WOMAN ABOUT TO SCAN IT: A PLAIN SMARTPHONE HELD UP IN BOTH HANDS at about the height of
       her own face, THE BACK OF THE PHONE TOWARDS US AND THE TOP OF THE PHONE TILTED UP, as if
       lining up a camera. We see the back of the phone, not the screen: a plain rounded
       rectangle with one small camera circle.
   (d) A WOMAN ALREADY LOOKING AT HER PHONE: phone in one hand at chest height, THE SCREEN
       TURNED AWAY FROM US so we cannot see anything on it, head tilted down, smiling to
       herself. THE SCREEN IS BLANK AND FEATURELESS - no icons, no text, no picture.
   The other five are simply glad to be there: waving with one hand, both hands raised in a
   small cheer, a hand on a colleague's shoulder, leaning in to look, one arm up beckoning.
   No two of them make the same gesture.

6. WHAT THEY ARE WEARING - THIS IS THE BRAND DETAIL, DRAW IT CAREFULLY. They all wear V-neck
   short-sleeved scrubs.
   A CAP AND A TOP ARE ALWAYS ONE SET - GO THROUGH THE PEOPLE WHO WEAR A CAP ONE BY ONE AND CHECK
   THIS. If someone wears a PRINTED cap, their top is cut from THE SAME PRINTED CLOTH. If someone
   wears a PLAIN top, any cap they wear is PLAIN AND EXACTLY THE SAME COLOUR AS THAT TOP - not a
   different shade, not a neighbouring colour, THE SAME COLOUR. A green cap over a blue top, or a
   teal cap over a green top, is WRONG. NEVER a printed cap over a plain top. If in doubt, leave
   the cap off.
   THREE PRINTED FABRICS MUST BE THERE, ONE PERSON EACH - and only one person each - in the
   front row where they can be seen:
   (a) PRINTED DOODLE SCRUBS, exactly the ones in reference image 1 - THIS ONE IS REQUIRED, AND
       EXACTLY ONE PERSON IN THE WHOLE PICTURE WEARS THIS PRINT: her CAP and her TOP are cut from
       ONE AND THE SAME PRINTED FABRIC - warm off-white cloth (#f4ead8) scattered with SIMPLE
       FLAT CHILDLIKE DOODLES (little bears, chicks, clouds, stars, small flowers) in ONLY TWO
       COLOURS, amber (#c28229) and deep caramel (#9e6301). On her head A TIE-BACK SURGICAL CAP
       of the same cloth. Over it A WHITE COAT HANGING OPEN.
   (b) PRINTED PINE-TREE SCRUBS, the motifs of reference image 2 ONLY: little pine trees, round
       bushes and tiny triangles, SIMPLE FLAT TWO-COLOUR SHAPES in deep teal (#317d78) and
       off-white, on A PALE TINT OF THAT SAME TEAL, with a matching tie-back cap.
   (c) PRINTED DINOSAUR SCRUBS, the motifs of reference image 3 ONLY: a long-necked dinosaur, a
       spotted plated dinosaur and a small flying one, SIMPLE FLAT TWO-COLOUR SHAPES in deep
       blue (#4478b5) and off-white, on A PALE TINT OF THAT SAME BLUE.
   EVERYONE ELSE WEARS PLAIN SCRUBS, AND THEIR COLOURS COME FROM THIS LIST OF FIVE - SPREAD THEM
   ACROSS THE GROUP, NEVER BUNCHED TOGETHER:
       muted deep green (#3f654a)        - at most two people
       deep teal (#317d78)               - at most two people
       muted slate blue (#465885)        - at most two people
       MUTED BRICK RED (#ae4f4d)         - EXACTLY ONE PERSON, NO MORE AND NO FEWER
       MUTED PLUM PURPLE (#8e6299)       - EXACTLY ONE PERSON, NO MORE AND NO FEWER
   THE BRICK-RED PERSON AND THE PLUM-PURPLE PERSON ARE BOTH IN THE FRONT ROW, FULLY VISIBLE, AND
   THEY STAND ON OPPOSITE SIDES OF THE GROUP - not next to each other. Keep the brick-red person
   AWAY FROM the amber doodle person (two warm colours side by side merge into one patch), and
   keep the plain deep-teal person AWAY FROM the pine-tree person. If either of them wears a cap,
   THAT CAP IS PLAIN AND EXACTLY THE SAME BRICK RED OR PLUM PURPLE AS THEIR OWN TOP.
   NEVER MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR. FOUR of them wear A WHITE COAT HANGING
   OPEN over their scrubs; one or two wear a plain cap matching their own top. Nobody wears a
   solid saturated yellow, mustard, mint or turquoise garment.

7. THE TWO PRINTS MUST BE BIG AND FEW, NOT SMALL AND BUSY - THIS IS THE EASIEST THING TO GET
   WRONG. Each motif is ABOUT A QUARTER OF THE WIDTH OF THE WEARER'S BODY, with a clear gap of
   about the same size between motifs, so that only THREE OR FOUR MOTIFS ARE VISIBLE ACROSS THE
   CHEST. Do not copy the density of the reference fabrics - they are photographs of real cloth
   and at this size that density turns into grey speckle. Each print uses only its two colours.
   No letters, no numbers, no words in any pattern.

8. THE WHITE COATS MUST STILL READ ON WHITE PAPER. Draw each coat with a clear thin hand-drawn
   outline and ONE STEP OF WARM GREY shading in the folds, the lapels and under the arms, so the
   coat separates from the empty white background. Never a flat pure-white shape with no edge.

9. STYLE. Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline, NOT a ruled vector line. Each face is ONE FLAT SKIN TONE with no shading: only the
   outline, two eyes drawn as small simple dots, two short eyebrows, a tiny nose mark, a small
   mouth and an ear - no wrinkles, no cheek lines. Hair is a flat shape in two tones. EVERY
   PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND SOLIDITY, including the ones further
   back - nobody is faded, greyed out or drawn as an outline only. Flat fills in two or three
   steps per colour, no gradients except to describe light. Fine paper grain over the whole
   image. Warm, calm, cheerful - never slick, never corporate, never a stock illustration.

10. COLOUR. The white background is the largest area by far and stays empty. The only strong
    colours are the uniforms: amber doodles, pale teal with teal trees, pale blue with blue
    dinosaurs, and the plains - deep green, deep teal, slate blue, ONE BRICK RED (#ae4f4d) AND ONE
    PLUM PURPLE (#8e6299) - spread evenly across the group rather than bunched together. NO ONE
    COLOUR MAY DOMINATE THE UNIFORMS. Skin is a warm flat tone; hair is warm near-black; the
    phones are a neutral warm grey. THE ONLY RED IN THE PICTURE IS THAT ONE MUTED BRICK-RED
    UNIFORM: no fire-engine red, no scarlet, no crimson, nothing that could read as blood. NO
    neon, NO gold, NO surgical blue or bright green, NO grey-blue clinical cast.

11. A FEW SHORT ACTION LINES - NEW IN THIS VERSION, AND THE ONLY REAL ADDITION. The picture is a
    little too quiet. Add SMALL HAND-DRAWN MOTION AND SOUND MARKS, drawn WITH THE SAME PEN AS THE
    FIGURES' OUTLINES and in the same dark ink - never in colour, never thin and hairline, never
    a different style from the drawing.
    THE SHAPE, AND IT IS ALWAYS THE SAME SHAPE: A GROUP OF THREE OR FOUR SHORT STRAIGHT STROKES,
    PARALLEL TO EACH OTHER, EVENLY SPACED, ALL ABOUT THE SAME LENGTH. ONE STROKE IS ABOUT A
    QUARTER TO A THIRD OF A HEAD LONG - they are short. Each group sits JUST OUTSIDE the thing it
    explains, starting about half a stroke away from it, and NEVER touches a face, a hand or a
    garment. A group is NEVER a single long curve, never a spiral, never a full ring of rays
    around a head.
    WHERE THEY GO - and nowhere else:
    (a) THE WOMAN CALLING OUT (the one in the doodle print with the white coat, her mouth open and
        her head turned up): THREE OR FOUR strokes just outside the corner of her open mouth,
        FANNING OUT SLIGHTLY in the direction she is shouting. This is the loudest mark in the
        picture and the only group of four.
    (b) THE WOMAN LOOKING DOWN AT HER PHONE: TWO OR THREE VERY SHORT strokes above the top edge of
        the phone - HALF THE LENGTH of the shouting marks - and one or two tiny strokes beside the
        fingertips of the hand that is tapping. NOTHING ELSE: no speech bubble, no message bubble,
        no hearts, no icons, and HER SCREEN STAYS BLANK.
    (c) EVERY OTHER PERSON WHO IS ALREADY MOVING gets ONE OR TWO strokes only, tucked against the
        part that moves: beside a waving palm, above a pointing fingertip, beside the phone that
        is being held up. THE PEOPLE WHO ARE ONLY STANDING AND SMILING GET NOTHING AT ALL.
    HOW MANY ALTOGETHER: about TWELVE, AND NEVER MORE THAN SIXTEEN STROKES IN THE WHOLE PICTURE.
    IF A STROKE IS NOT EXPLAINING A MOVEMENT THAT IS ALREADY HAPPENING IN THE PICTURE, DO NOT DRAW
    IT.
    AND THEY STAY INSIDE THE PICTURE: NO STROKE MAY REACH UP INTO THE EMPTY WHITE BAND ACROSS THE
    TOP (section 0), and no stroke may be drawn in the bottom fifth of the picture.

COMPOSITION ANCHORS: the top 8% of the picture is empty white, will be cut off, and NOTHING
REACHES INTO IT; the group touches and runs off the left edge, the right edge and the bottom edge;
the bottom edge cuts every figure just below the hips; a head is about a quarter of the picture
height; nine adults, five in front and four behind whose heads are as high as the front row's;
every face complete and inside the picture; the plain uniforms use five colours with at most two
people in any one of them, and EXACTLY ONE brick-red uniform and EXACTLY ONE plum-purple uniform;
every cap is the same cloth or the same colour as its own wearer's top; every raised arm wears its
owner's own sleeve; AND A FEW GROUPS OF SHORT PARALLEL ACTION STROKES, ONLY BESIDE PEOPLE WHO ARE
ALREADY MOVING, SIXTEEN STROKES AT THE VERY MOST.

AVOID: any text, letters, numbers, words or logos anywhere; a QR code, barcode, matrix of dots,
poster, sign, board, placard or framed rectangle; anything visible on a phone screen; any
background, room, wall, floor, furniture, horizon line, frame or border; any coloured background
panel; legs, knees, feet, shoes, ground shadows or a ground line; an empty margin at the bottom
or at the sides; a neat evenly spaced row of separated figures; anybody looking at the viewer;
A FACE OR A HEAD CUT BY THE EDGE OF THE PICTURE; A HEAD WITH NO BODY UNDER IT, OR A FIGURE WHOSE
OUTLINE STOPS IN MID-AIR; A BACK-ROW HEAD DOWN AT CHEST HEIGHT; A CHILD OR A CHILD-SIZED FIGURE;
A HAND, ARM OR SLEEVE THAT BELONGS TO NOBODY; A WHITE COAT SLEEVE ON THE RAISED ARM OF SOMEBODY
WHO IS NOT WEARING A WHITE COAT, OR ANY SLEEVE THAT IS NOT THE GARMENT ITS OWNER IS WEARING; A
PRINTED CAP WORN WITH A PLAIN TOP; A PLAIN CAP IN A DIFFERENT COLOUR FROM ITS WEARER'S OWN TOP;
MORE THAN ONE PERSON IN THE DOODLE PRINT; MORE THAN TWO PEOPLE IN THE SAME PLAIN COLOUR; MORE THAN
ONE BRICK-RED UNIFORM OR MORE THAN ONE PLUM-PURPLE UNIFORM, OR NONE OF EITHER; face masks; needles,
syringes, drills, dental instruments, blood; a dental chair; solid saturated yellow, mustard,
mint or turquoise uniforms; tiny busy multicoloured patterns; speech bubbles, thought bubbles,
arrows, sparkles, stars, hearts, musical notes, exclamation marks, sweat drops, icons or any other
comic-book symbol; AN ACTION LINE BESIDE SOMEBODY WHO IS STANDING STILL; A SINGLE LONG CURVED
SWOOSH, A SPIRAL, OR A RING OF RAYS AROUND A HEAD; COLOURED OR RAINBOW ACTION LINES; MORE THAN
SIXTEEN STROKES IN TOTAL; ANY STROKE IN THE EMPTY WHITE BAND AT THE TOP OR IN THE BOTTOM FIFTH OF
THE PICTURE; anybody drawn faded, translucent, ghostly or outline-only; photorealism; 3D
rendering; heavy even black outlines; a thick drop shadow.
```

⚠⚠ 上面那一整塊**就是要送出去的全文**（第 1~10 段已經把 v4 的原字貼進來了）——
這一版只有「這一版只改三件」、第 0 段最後那一句、第 11 段、`COMPOSITION ANCHORS` 與 `AVOID` 和 v4 不一樣。

### v5 的驗收（出圖之後逐條跑一次）

1. **線的形狀**：每一組都是**三到四道同向、等距、等長的短直線**，一道長度 ≈ 一顆頭的 1/4~1/3；
   沒有一條長曲線、沒有螺旋、沒有整圈放射狀的光芒。
2. **線的位置**：只出現在**有動作的人**旁邊（喊、揮手、指、舉手機、打字），
   站著微笑的四個人身上**一道都沒有**；沒有任何一道碰到臉或手。
3. ⚠⚠⚠ **墨的框上緣不可以往上跑** —— 跑 `node drafts/channels/stand-illus-crop.mjs`，
   面板印的「左右各餘」必須還是 **0.0 mm**。不是 0 就表示線畫進上面那條白裡了，
   **那一條會變成左右留白、人被邊緣切掉就讀成畫錯**。
4. **總數不超過 16 道**（數得出來，不是感覺）。
5. **磚紅正好一人**（右邊拿手機那位），**紫正好一人**，最左那位是深綠。
6. **每一頂帽子和它自己的上衣同色或同一塊布** —— 一個一個看過，⑨ 那位要對上。
7. v4 已經對的那幾件**一件都沒有壞掉**：十張臉都完整、沒有浮著的頭、後排的頭不在前排胸口、
   沒有腳沒有影子、圖裡零文字零 QR、螢幕空白。
8. **把圖縮到 98 mm 寬看一次** —— 線在那個尺寸還讀得出是線、不是一團灰。

---

## 六、還沒決定的

1. **Ⓐ 要不要對著讀的人喊**（現在是朝畫面左外側）。
2. **Ⓒ Ⓓ 的底色要不要加濃到接近照片上那兩塊布**（現在是淡一階的主題色）。
3. ~~**四個人夠不夠**~~ —— ✅ **2026-09-16 使用者決定了，而且方向和這一條相反**：
   「人太少 再多一點 8-9個人比較熱鬧」。所以「只畫三個人」那條路**作廢，不要走回去** ——
   ⚠⚠ 它當時的理由（一人 27 mm、份量接近廠商那隻）**沒有錯，錯的是前提**：
   那一條假設「一個人多大」由人數決定，而 v2 證明**真正決定臉多大的是「畫到身體哪裡」**
   （見五之三那兩張表）—— 九個人擠在一起、切在髖下，一顆頭反而從 7.3 變成約 12 mm。
   **通則：一條「A 和 B 只能選一個」的取捨，先問有沒有第三個量可以動。**
4. **要不要有一位是病人不是醫事人員** —— 使用者寫的是「這些人是診所的醫事人員」，
   所以這一版四個人全部是自己人；⚠ 代價是「快來喔」那一喊沒有人接。
5. ~~**頭上那三條短線要不要畫**~~ —— ✅ **2026-09-16 使用者決定：畫，而且範圍比這一條大**
   （「圖片有點太安靜了……加一點線條……其他人也可以稍微加一點」）。
   ⚠ 這一條當時寫的**只給 Ⓐ 一個人**、講的是**情緒**；他要的是**動作與聲音**，
   點名了兩個人（往上喊、低頭打字）並要其他有動作的人也加一點。
   規格與 v5 的提示詞在**五之七**，`AVOID` 那一行的 `motion lines` 已經拿掉
   （`sparkles`／`speech bubbles`／`icons` 仍然禁）。
   ⚠⚠ 站上那條「用線畫看不見的東西」（ILLUSTRATION.md 第三節）因此第一次從
   **風與氣流**擴到**動作與聲音**，而形狀的規格照抄颱風那一輪（第 25-19 節）：
   一組三到四道**同向等距的短直線**，不可以是一條長曲線。

6.5 ⚠⚠ **要不要給後排那幾個人動作** —— v5 加線之後仍然會剩下「一半的人只是站著微笑」，
   因為規則是「**一道線沒有在解釋畫面裡已經發生的動作就不要畫**」。
   要真的更熱鬧只有給他們動作（拍肩、探頭、兩手比讚），而**那會動到構圖 ＝ 等於重畫**，
   **沒有自己走**。

6. ~~**腳要不要藏進帶子裡**~~ —— ✅ **2026-09-16 使用者決定：藏**（「腳藏進帶子裡」）。
   ⚠ 這一條當時寫的代價（貼齊帶子上緣、下緣不留白）成立，**但漏掉了真正的收穫**：
   那一條因此從 43.8 長到 46.3 mm，而且**多出來的那一截不必畫得好看**（在帶子後面）——
   它是 v2 把臉畫大的兩個來源之一。卡片那一側已經做好了（負的下外距 ＋ 帶子的堆疊脈絡）。

7. **那一行 `@fafa070` 要不要留** —— 2026-09-16 使用者指定加的，**它從插圖那一條扣掉 6.9 mm**
   （一顆頭因此小約 1.8 mm）。⚠ 要買回來還有一條沒有走的路：**QR 自己還有餘裕**
   （框 44.1 mm、碼本身 36.3 mm，下限 15 mm）—— 那是另一個決定，**沒有自己動**。
