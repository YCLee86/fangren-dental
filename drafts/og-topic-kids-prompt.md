# 分享圖提示詞：兒童牙科（`og-topic-kids`）

**狀態：⏳ 梗已定（2026-08-24，使用者選 Ⓑ 並改了三件），第五節是可以直接貼的第一版提示詞。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十三節與 `tools/topic-copy.mjs` 的 `kids`。
順序：**分享圖在前、線稿底圖在後**（線稿要從這張裁一段當姿勢參考，ILLUSTRATION.md 第十二節）。

## 使用者給的概念（2026-08-24，逐字）

> 「這個概念很不錯　不過小孩不需要躲　小孩是很開心的接受　和醫師互動的感覺
> 　小〔孩〕還是坐在診療椅上　媽媽在旁邊　媽媽站右邊、包包還掛著、肩膀鬆下來
> 　醫師除了穿刷手服＋醫師服外　頭上帶手術帽　像附圖那樣　手術帽和刷手服上有同樣
> 　系列的塗鴉圖案　也有放附圖參考　要搭配兒童牙科主題色」

四件因此定下來：**① 梗是 Ⓑ「蹲下來，跟他一樣高」，但孩子是開心的、坐在診療椅上**
（不是躲在媽媽腿邊 —— 那是我原提案的寫法，被改掉了）、**② 媽媽站右邊**、
**③ 醫師戴綁帶式手術帽**、**④ 帽子與刷手服是同一系列的塗鴉印花，套兒牙的主題色**。

---

## 一、動筆之前已經被鎖死的三件

### 1. 這一張不能和站上那四張撞

| 已上線 | 它的語彙 |
| --- | --- |
| 一般牙科（分享卡） | 白天的巷弄街景、三組人各做各的事 |
| 牙周治療（分享卡） | 診間、醫師持水槍、擬人牙齒＋細菌四散（**動**） |
| 顯微根管（分享卡） | 診間、醫師坐椅子＋顯微鏡＋大放大圈（**靜的一瞬**） |
| 〈孩子第一次看牙〉（文章 HERO，會出現在同一頁的文章卡上） | 家裡餐桌、換牙得意、五個人圍著、夜晚吊燈 |

→ 兒牙這一張**不畫擬人牙齒**（會變成第三張同一個模子）、**不畫餐桌**（同一頁下面就有那張卡）、
**醫師不坐醫師椅**（顯微根管那張已經是坐姿）—— 這一張的動作是**單膝蹲下**。

### 2. 玻璃帶：兒牙是七科裡**最緊**的一科（先算再構圖）

帶子用相乘上色，補償來源色 `M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆`，
`M` 任何一個通道超過 255 就補不上去、帶子只能往深階漂（顏色對不上標籤那顆琥珀）。
兒牙套色 `#c28229` 的紅通道最高，所以**牆的下限是七科裡最高的**：

| 科別 | 套色 | 牆的下限 R / G / B |
| --- | --- | --- |
| **兒童牙科** | `#c28229` | **227.4** / 148.9 / 41.4 ← 最緊 |
| 顯微根管 | `#ae4f4d` | 203.0 / 86.7 / 85.3 |
| 口腔外科 | `#8e6299` | 164.0 / 109.9 / 178.0 |
| 齒顎矯正 | `#4478b5` | 73.7 / 136.7 / 212.2 |
| 一般牙科 | `#3f654a` | 67.6 / 113.5 / 81.7 |
| 植牙・假牙 | `#335b8b` | 53.0 / 101.3 / 161.0 |
| 牙周治療 | `#317d78` | 50.5 / 142.8 / 137.8 |

實測幾面候選牆（頂 17% 的中位色）：`#f2e6d2` → `#f0a532` ✅／`#ece0cd` → `#f6a934` ✅／
`#e8dcc6` → `#faad35` ✅（接近上限）／`#e5ded4` → `#fdab32` ✅（剛好）／
`#d9cfc4` ❌（267）／`#a8c8e0` 藍天 ❌❌（345）。

> **頂 17% 只能是一面「暖的亮牆」（R ≥ 228）**：不可以是藍天、不可以是冷灰、
> 也不要純白（純白會踩另一條門檻：無彩空白 < 5%）。**這一張只能在室內畫。**

### 3. 那一頁的文案不准出現的，圖上也不准出現

- **「根管治療」「抽神經」整頁不准出現**（COPY.md 第九之十三節，使用者指定）——
  所以**不要畫鑽針、針筒、血、眼淚**。
- **不能讓家長讀到責備**（那一頁的兩組現場都是已經被退過件、還在自責的家長）。
- **不要畫舒眠／麻醉** —— `ask` 裡「鎮靜怎麼做、誰執行、什麼情況才建議」還沒問到診所。
- ⚠ **醫師不戴口罩** —— 這一張的重點是兩張臉在同一個高度上對看，蓋住半張臉就沒有了。
  （手術帽戴著、口罩不戴，這在兒牙的診間是常見的畫面，不是矛盾。）

---

## 二、梗（定案）：兩張臉在同一個高度上

**一句話**：孩子坐在放到最低的診療椅上，醫師**單膝蹲在椅子旁邊**，
兩個人的眼睛在同一條水平線上，一起看著醫師手上那面小圓鏡；孩子笑著、伸手指鏡子裡的牙齒。
媽媽站在右邊，包包還掛在手上、另一手搭著椅背，肩膀鬆下來。

- **對應哪一句文案**：`close`「**孩子願意來**、牙齒撐得住，其他的我們一起來努力」，
  以及 `flow` 的「先試過　能配合多少先試」。
- **為什麼是這一張**：這一頁的家長帶著「不配合，沒辦法處理」被退回的經驗來。
  **「蹲下來」是這件事唯一畫得出來的答案** —— 它不是服務業的招呼動作，
  是一個大人把自己降到小孩的高度。而孩子**主動指著鏡子**，
  代表他在參與，不是被處理。
- ⚠ **為什麼是「一起看鏡子」而不是「把鏡子遞給他」**：遞東西容易被畫成發禮物
  （ILLUSTRATION.md 第十一之二節：診所的人不要做服務業的招呼動作）。
  一起看同一個小東西＝共同注意力，在 250px 下也更好讀（兩個頭朝向同一個亮點）。
  要改成「遞出去讓他自己拿」是提示詞第 3 段換一句話的事。

### 印花：量過再決定要畫多大

使用者給的兩張參考（見第四節）量出來：

| | 圖案的大小 |
| --- | --- |
| 手術帽（那隻熊） | 約帽寬的 **1/4**；旁邊的小圖案約 1/12 |
| 刷手服（那隻小雞） | 約軀幹寬的 **1/7**，圖案之間留著和圖案差不多寬的空隙 |

換算到 1200×628 的畫布：帽子大約 90px 寬、蹲著的軀幹大約 150px 寬，
所以圖案要畫到 **20~24px** 才等於參考圖的比例；**縮到 250px 的卡片上只剩 4~5px**。
→ **結論：印花在卡片上讀到的是「這件衣服上有東西」的質感，不是圖案本身。**
所以圖案要**大、少、只用兩個顏色**（`#c28229` ＋ `#9e6301`）畫在暖白布上 ——
細碎多彩的印花（參考圖裡那件淺藍小圖案的）在這個尺寸會變成雜點，
而且會把「邊緣密度 ≥30%」灌成假數字。

---

## 三、250px 下會讀到什麼（先想這件事，再想畫面好不好看）

訊息卡實測只有 **212 CSS px** 寬。這張圖縮到那個尺寸時，能活下來的只有五塊：

    ① 一張大椅子，上面坐著一個笑著的小孩　② 蹲在旁邊、頭一樣高的白袍大人
    ③ 她頭上那頂有花紋的帽子（畫面裡唯一有花紋的東西）　④ 兩人中間那面小圓鏡的亮點
    ⑤ 右邊站著的媽媽

⚠⚠ **訊息 app 會左右裁**（LINE 只顯示 89.7%、iMessage 只有 78.7%），
**這五塊全部要收在畫面中央 73% 之內**；媽媽不要貼著右緣。

---

## 四、參考圖清單（六張，用途要分開標）

⚠ 不標用途的參考圖會被整張抄走（風格、顏色、構圖一起）——TEAM.md 第一節第 10 號。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `drafts/endo-face-ref.jpg` | **大人的畫法**：線的實度、平塗的臉、點狀的眼睛、白袍與刷手服的形狀 | 顏色（那是一般牙科的綠）、姿勢、構圖 |
| ② | `drafts/kids-child-ref.jpg` | **小孩的畫法與頭身比**（站上唯一為分享卡尺寸畫過的小孩） | 構圖、戶外的顏色、牽手那個動作 |
| ③ | `drafts/kids-chair-ref.jpg` | **診療椅的形狀**（椅背、頭枕、扶手、底座） | 顏色、旁邊那條腿、它在原圖裡是躺平的角度 |
| ④ | `drafts/kids-cap-ref.jpg` | **綁帶式手術帽的形狀**：怎麼包住頭髮、後腦的綁帶、帽緣的位置；以及**印花的尺度**（大圖案約帽寬 1/4） | **照片的風格**（這是照片不是插畫）、深藍底色、那些圖案本身（熊、蔬菜）、臉、背景 |
| ⑤ | `drafts/kids-scrub-print-ref.jpg` | **印花刷手服長什麼樣**：V 領、短袖、口袋，以及**圖案的大小與疏密**（約軀幹寬 1/7、彼此留空隙） | **顏色**（要換成兒牙的琥珀）、細碎多彩的畫法、照片的質感、手機與手 |
| ⑥ | `assets/og-topic-general.jpg`（整張） | **整體色調、紙紋、密度、線的實度** | **構圖**（那是街景）、人數 |

產生 ②③④⑤ 的腳本：`node drafts/og-topic-kids-refs-crop.mjs`
（④⑤ 的來源是使用者的手機截圖，不在版控裡；裁好的成品已經進版控，腳本會自動略過）。

---

## 五、提示詞（第一版，逐字，可直接複製）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big
simple shapes, few large objects, ONE single continuous scene, no panels, no dividing lines,
no inset boxes.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a bright, calm, warm
children's dental room at midday. The back wall is a WARM CREAM WHITE (#f2e6d2) that keeps a
clear hint of warmth in it - never grey, never blue-white, never pure white, never mustard.
The floor is light warm wood. The whole picture is friendly and unhurried. NOTHING here is
frightening: no needle, no drill, no blood, no tears.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is
plain warm cream wall only - no head, no hand, no lamp, no shelf, no cable, no sign.

THE PICTURE IS ABOUT TWO FACES AT THE SAME HEIGHT. A dentist has come all the way down to a
small child's level, and the child is delighted. Everything below serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling. On a face there is only: the outline,
   two eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a
   tiny nose mark, a small mouth and an ear. Hair is a flat shape in two tones with no
   individual strands. EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME
   SOLIDITY - nobody is paler, softer, thinner or more transparent than anybody else.

2. THE CHILD IS SITTING UP ON THE DENTAL CHAIR AND HE IS ENJOYING HIMSELF. A boy of about
   five. THE CHAIR IS UPRIGHT AND LOWERED TO ITS LOWEST POSITION, sage green (#8fae9b), with
   the shape of the reference chair; he sits on it with his legs dangling over the front edge.
   He leans forward towards the dentist, ONE SMALL HAND POINTING AT THE LITTLE ROUND MIRROR
   SHE IS HOLDING, the other hand resting on the armrest. His mouth is open in a happy laugh
   and his eyes are on the dentist. HIS IS THE BIGGEST FACE IN THE PICTURE, near the
   horizontal centre, the top of his head about one third down from the top edge.

3. THE DENTIST IS DOWN ON ONE KNEE BESIDE THE CHAIR, AND HER EYES ARE EXACTLY LEVEL WITH HIS.
   A woman kneeling on her right knee to the LEFT of the chair, back straight, leaning in a
   little. SHE HOLDS A SMALL ROUND DENTAL MIRROR LOW BETWEEN THEM, angled so the child can
   see into it, and her other hand rests easily on her own knee. Her eyes are on the child and
   she is smiling with him. THE TOP OF HER HEAD IS AT THE SAME HEIGHT AS THE TOP OF HIS HEAD -
   this equal height is the single most important thing in the picture. She is NOT standing,
   NOT bending over him, NOT reaching towards his mouth, NOT offering him a gift, and SHE
   WEARS NO FACE MASK - her whole face is visible.

4. WHAT THE DENTIST IS WEARING (this is a brand detail, draw it carefully). A TIE-BACK
   SURGICAL CAP covering her hair completely, with the fabric gathered and knotted into short
   ties at the back of her head, exactly the shape of the reference photograph of the cap. Over
   printed scrubs she wears an OPEN WHITE COAT, so the printed V-neck top, the printed sleeves
   and the printed trousers all stay visible. THE CAP AND THE SCRUBS ARE THE SAME PRINTED
   FABRIC: a warm off-white cloth (#f4ead8) scattered with SIMPLE FLAT CHILDLIKE DOODLES -
   little bears, chicks, clouds, stars and small flowers - drawn in ONLY TWO COLOURS, amber
   (#c28229) and deep caramel (#9e6301). THE DOODLES ARE BIG AND FEW, NOT SMALL AND BUSY:
   each doodle is about a quarter of the width of the cap, with a clear gap of about the same
   size between them. No letters, no numbers and no words in the pattern.

5. THE MOTHER IS THE TALL FIGURE ON THE RIGHT AND SHE HAS LET GO. She stands with her full
   height about 70% of the picture height - the top of her head just below the empty top
   strip, her shoes close to the bottom edge - her bag still hanging from one arm, the other
   hand resting on the back of the chair, shoulders dropped, watching her child and smiling.
   She is NOT holding him, NOT restraining him, NOT anxious, and she does not look at the
   viewer. Keep her well inside the right edge, not touching it.

6. THREE SEPARATE THINGS HAPPEN AT ONCE, spread along one horizontal band on the same floor
   with clear gaps between the groups: (a) the dentist and the child over the little mirror,
   left of centre; (b) the mother, on the right; (c) far right and slightly behind her, a
   smaller girl of about three sits on a low stool swinging her legs and looking at a picture
   book on her knees. Nobody looks at anybody outside their own group and nobody looks at the
   viewer.

7. LIGHT AND COLOUR. One warm light source from outside the frame at the upper left, so the
   light pools on the two faces and on the little mirror between them and softens towards the
   edges; NO LAMP IS DRAWN INSIDE THE PICTURE. The colours are warm: amber and caramel for the
   printed cap and scrubs, white for the coat, sage green for the chair, light warm wood for
   the floor, warm cream for the wall. Fine paper grain over the whole image and loose
   hand-drawn shading strokes; no large flat empty areas anywhere.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width;
the chair base and the mother's shoes sit close to the bottom edge; the background is only
two things - the wall and the floor - plus a single low cabinet line behind them. No posters,
no shelves, no plants, no wall toys, no equipment trolley, no screens, no monitors.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets,
speech bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only;
anybody looking at the viewer; needles, syringes, drills, blood, tears; face masks; a child
who looks frightened or is hiding; grey or blue-white walls; an overall yellow or sepia cast;
tiny busy multicoloured patterns; large empty white areas; photorealism; 3D rendering; heavy
even black outlines.
```

---

## 六、交件前要過的門檻（圖回來之後我自己先跑，不過就重跑）

| | 門檻 | 腳本 |
| --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **< 5%** | `node drafts/og-measure.mjs <檔>` |
| 邊緣密度 | **≥ 30%** | `node drafts/og-measure-ink.mjs <檔>` |
| 每個人的線一樣實 | 各框最暗 5 百分位**相差 < 20 階** | 同上 |
| 頂 17% 有沒有被東西佔到 | 0%（被佔到要重生成或用 `drafts/og-topclean.mjs`） | 同上 |
| 頂 17% 的中位色 | **R ≥ 228**（第一節第 2 條） | 同上 |
| 兩個人的頭頂高度差 | **< 10px**（＝這張圖的梗，量了才算數） | 現場量 |

⚠ 印花會把邊緣密度灌高 —— 量的時候要**另外量一次「把醫師那一塊蓋掉」的密度**，
確認畫面其他地方不是空的。

## 七、管線（圖定案之後，兩行）

    node tools/og-resize.mjs drafts/og-topic-kids-src.jpg kids
    node tools/og-plate.mjs kids --blend multiply --tintcolor <補償色> \
      --ink 0.18 --blur 6 --loc full --locpos stack

⚠ `--tintcolor` 要**用回來那張圖的牆現場算**，不要抄第一節那張表（那是候選值不是實測值）。
⚠ 驗收要模擬訊息 app 的裁切（iMessage 中央 78.7%、LINE 中央 89.7%）。

## 八、還要問使用者的

1. 右後方那個看繪本的妹妹要不要留（我傾向留：畫面才有「好幾件事同時在發生」）。
2. 印花的圖案要不要指定成診所自己的東西（例如站上那顆標誌的形狀）——
   目前寫的是通用的小熊／小雞／雲／星星／小花。
3. 這一張定案之後才做**線稿底圖**（從這張裁一段當姿勢參考）。
