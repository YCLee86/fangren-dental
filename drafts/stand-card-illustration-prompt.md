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
| **QR 底下到帶子** | **43.8 mm** ← **插圖就畫在這裡** |
| 底下那條標誌帶子 | 高約 **9.4 mm**，滿版，一般牙科綠 `#3f654a` ＋ 十一顆白色標誌 |

所以這張圖是一條 **98 × 43.8 mm（約 2.2:1）的橫幅**，而不是一張畫。
印刷 300 dpi 換算 ＝ **1157 × 517 px**，畫大一點即可，不必很大。

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

## 五、驗收（出圖之後逐條跑一次）

1. **圖裡沒有 QR、沒有任何字** —— 這兩件是紅線，一眼看。
2. **四個動作分得出來**（喊／展示／舉著掃／低頭看），而且**沒有人看鏡頭**。
3. **三種印花分得出來**，而且**都不是一整塊飽和色**。
4. **把圖縮到 98 mm 寬看一次** —— 那才是印出來的大小；在螢幕上放大看不算數
   （分享卡那一輪的同一條：在成品的尺寸上量，不要在素材的尺寸上量）。
5. **白袍在白底上看得到邊**。
6. **上下各 11% 是空的**（裁切要用得到）。
7. 裁成 2.2:1 之後放進 `/preview/line-stand/` 那張卡，量一次
   **介紹區（QR 底下到帶子）的高度有沒有被撐開** —— 那一塊是 43.8 mm，不可以變。

## 六、還沒決定的

1. **Ⓐ 要不要對著讀的人喊**（現在是朝畫面左外側）。
2. **Ⓒ Ⓓ 的底色要不要加濃到接近照片上那兩塊布**（現在是淡一階的主題色）。
3. **四個人夠不夠** —— 98 mm 排四個人，一個 22 mm；排五個會掉到 18 mm。
   ⚠ 廠商那張是**一隻 31 mm**，所以另一條路是**只畫三個人**（一人 27 mm，
   份量接近他們那隻，但要砍掉一個動作或一種印花）。
4. **要不要有一位是病人不是醫事人員** —— 使用者寫的是「這些人是診所的醫事人員」，
   所以這一版四個人全部是自己人；⚠ 代價是「快來喔」那一喊沒有人接。
5. ⚠⚠⚠ **頭上那三條短線要不要畫** —— 這是唯一一件廠商那張真的會改到提示詞的：
   **他們畫了**（三條同向的短斜線，表示「哇」），而我們現在的 `AVOID` 明文禁止
   `sparkles, motion lines`。⚠ 站上對這件事其實是**評價最高**的
   （ILLUSTRATION.md 第三節「✓✓ 線畫抽象的東西」：用線去畫看不見的東西），
   只是站上一直畫的是**風與氣流**，不是情緒。
   **要畫就照那一條的規格**：三到四條**同向、等距的短直線**，不可以是一條長曲線
   （第七節第 17 條：一條會被讀成靈魂出竅），而且**只給 Ⓐ 一個人**
   —— 四個人頭上都有就變成漫畫。**沒有自己改掉 AVOID，等使用者決定。**
6. **腳要不要藏進帶子裡** —— 廠商那張是身體被帶子切掉；我們現在是
   「腳下一小塊淡影子」。藏進帶子讀起來更像同一張卡上的東西，
   代價是插圖必須**貼齊帶子上緣**、下緣不能再留那 11% 的空白。
