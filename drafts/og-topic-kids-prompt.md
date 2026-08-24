# 分享圖提示詞：兒童牙科（`og-topic-kids`）

**狀態：⏳ 概念提案中（2026-08-24）。使用者：「兒童牙科著陸頁的圖片　帶我沒什麼概念」——
所以這一輪交的是「梗」，三案給他挑，第五節先把推薦案（Ⓐ）寫成可以直接貼的提示詞。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十三節與 `tools/topic-copy.mjs` 的 `kids`。
順序：**分享圖在前、線稿底圖在後**（線稿要從這張裁一段當姿勢參考，ILLUSTRATION.md 第十二節）。

---

## 一、動筆之前已經被鎖死的三件

### 1. 這一張不能和站上那四張撞

| 已上線 | 它的語彙 |
| --- | --- |
| 一般牙科（分享卡） | 白天的巷弄街景、三組人各做各的事 |
| 牙周治療（分享卡） | 診間、醫師持水槍、擬人牙齒＋細菌四散（**動**） |
| 顯微根管（分享卡） | 診間、醫師＋顯微鏡＋大放大圈（**靜的一瞬**） |
| 〈孩子第一次看牙〉（文章 HERO，會出現在同一頁的文章卡上） | 家裡餐桌、換牙得意、五個人圍著、夜晚吊燈 |

→ 兒牙這一張**不要再畫擬人牙齒**（會變成第三張同一個模子），
也**不要畫餐桌**（同一頁下面就有那張卡）。剩下最有價值的空位是：
**診間裡、小孩是主角、而且他是主動的那一方。**

### 2. 玻璃帶：兒牙是七科裡**最緊**的一科（這一節是硬約束，先算再構圖）

帶子用相乘上色，補償來源色 `M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆`，
`M` 任何一個通道超過 255 就補不上去、帶子只能往深階漂（顏色會對不上標籤那顆琥珀）。
兒牙的套色是 `#c28229`，紅通道最高，所以**牆的下限是七科裡最高的**：

| 科別 | 套色 | 帶子後面那面牆的下限 R / G / B |
| --- | --- | --- |
| **兒童牙科** | `#c28229` | **227.4** / 148.9 / 41.4 ← 最緊 |
| 顯微根管 | `#ae4f4d` | 203.0 / 86.7 / 85.3 |
| 口腔外科 | `#8e6299` | 164.0 / 109.9 / 178.0 |
| 齒顎矯正 | `#4478b5` | 73.7 / 136.7 / 212.2 |
| 一般牙科 | `#3f654a` | 67.6 / 113.5 / 81.7 |
| 植牙・假牙 | `#335b8b` | 53.0 / 101.3 / 161.0 |
| 牙周治療 | `#317d78` | 50.5 / 142.8 / 137.8 |

實測幾面候選牆（頂 17% 的中位色）：

| 牆 | 補償色 `--tintcolor` | |
| --- | --- | --- |
| `#f2e6d2` 暖奶油 | `#f0a532`（240/165/50） | ✅ 有餘裕 |
| `#ece0cd` | `#f6a934` | ✅ |
| `#e8dcc6` | `#faad35` | ✅ 接近上限 |
| `#e5ded4` 暖白（顯微根管那張的牆） | `#fdab32` | ✅ 剛好 |
| `#d9cfc4` 陶土 | 267/183/54 | ❌ 補不上去 |
| `#a8c8e0` 藍天 | 345/190/47 | ❌❌ 差很遠 |

> **結論：頂 17% 只能是一面「暖的亮牆」（R ≥ 228）。**
> **不可以是藍天、不可以是冷灰、也不要純白**（純白會踩另一條門檻：
> 無彩空白 < 5%，S<12 且 L>80 的像素會被算進去）。
> 所以這一張**只能在室內畫**，戶外場景一開始就出局。

### 3. 那一頁的文案不准出現的，圖上也不准出現

- **「根管治療」「抽神經」整頁不准出現**（COPY.md 第九之十三節，使用者指定）——
  所以**不要畫任何鑽針、針筒、血、眼淚**。
- **不能讓家長讀到責備**。那一頁的兩組現場都是「已經被退過件、還在自責」的家長。
- **不要畫舒眠／麻醉** —— `ask` 裡「鎮靜怎麼做、誰執行、什麼情況才建議」
  還沒問到診所，站上寧可不寫（TEAM.md 第五節第 11 條）。

---

## 二、三個梗（使用者挑一個）

### Ⓐ 「先試過」——他自己拿著那支水，笑出來　⭐ **我建議這一個**

診間裡，**孩子坐在直立的診療椅上（不是躺著）**，雙手自己握著吸唾管，
朝醫師遞過來的小紙杯噴出一小道水，笑得瞇起眼睛；
**女醫師坐在醫師椅上、頭跟他一樣高**，一手拿杯子一手扶著管子，在笑；
**媽媽站在右邊**（全身高約畫面 70%），包包還掛在手上、另一手搭在椅背上，肩膀鬆下來。
右後方還有一個三歲的妹妹坐小凳晃著腳看繪本。

- **對應哪一句文案**：`flow` 的「**先試過**　能配合多少先試，不行才談舒眠」，
  以及 `close`「孩子**願意來**」。
- **為什麼是這一張**：這一頁的家長帶著兩種經驗來 ——「不配合、沒辦法處理」被退回，
  和「補了又掉」。這張圖把診間裡最可怕的那支器械**放到孩子自己手上**，
  一個畫面同時回答「他會不會怕」和「你們拿他有沒有辦法」，
  而且**沒有任何東西朝著他的嘴**。
- **250px 下活得下來**：一個大椅子、一個笑著的大臉、一道亮亮的水、
  一個站著的大人 —— 四塊大形狀，中心明確。
- **躺著 vs 坐著**：躺下＝要被處理，坐著晃腳＝還在試，這一格是這張圖的關鍵。

### Ⓑ 「蹲下來，跟他一樣高」

診間門邊，醫師**單膝蹲下**把一面小鏡子遞出去，孩子從媽媽腿邊探出半個身子伸手要拿；
右邊另一組是剛看完的小男孩舉著貼紙轉圈、護理師蹲著收東西。

- **對應**：`close`「孩子願意來」。
- **好處**：三組各做各的事，最「活潑」；畫面裡完全沒有器械。
- **風險兩件**：① **躲＝負面情緒**，分享卡開場放退縮是推力
  （同顯微根管那一輪「求救」被否決的理由）；
  ② 遞東西給小孩很容易被畫成「發禮物」，那是服務業招呼動作（ILLUSTRATION.md 第十一之二節）。

### Ⓒ 「留到換牙」——一排小乳牙

擬人的小乳牙排排站，其中一顆搖搖晃晃、底下的恆牙正探頭上來，醫師伸手扶著它。

- **對應**：`flow` 的「留位置」「讓它留到換牙」——**這是兒牙獨有的概念**
  （乳牙的成功不是永久，是撐到換牙）。
- **不建議的三個理由**：① 站上已經有兩張擬人牙齒的分享卡，第三張就變成模子了；
  ② **畫面裡沒有小孩**，家長不見得認得出這是兒童牙科；
  ③「底下有一顆正在長上來」在 250px 下讀不出來。
- 留著當日後的**線稿底圖**或文章插圖是好題目。

---

## 三、250px 下會讀到什麼（先想這件事，再想畫面好不好看）

訊息卡實測只有 **212 CSS px** 寬。Ⓐ 縮到那個尺寸時，能活下來的只有五塊：

    ① 中間一張笑到瞇眼的小臉　② 他身下一張大椅子　③ 一道細細亮亮的水
    ④ 左邊一個穿白袍、坐得很低的大人　⑤ 右邊一個站著的大人

牆、地板、櫃線在那個尺寸只是「有東西在那裡」——**那沒關係，但它們不能是重點**。
所以：孩子的臉要**大**（整張圖最大的一張臉，頭頂落在畫面高的三分之一）、
椅子要**大而簡單**（不畫控制面板、不畫小零件）、水那一道要**亮**（畫面裡唯一的高光）。

⚠⚠ **訊息 app 會左右裁**（LINE 只顯示 89.7%、iMessage 只有 78.7%），
所以**這五塊全部要收在畫面中央 73% 之內** —— 右邊那位媽媽不要貼著邊，
妹妹那一組被裁掉一半是可以接受的（她本來就是第三組）。

---

## 四、參考圖清單（四張，用途要分開標）

⚠ 不標用途的參考圖會被整張抄走（風格、顏色、構圖一起）——TEAM.md 第一節第 10 號。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `drafts/endo-face-ref.jpg` | **大人的畫法**：線的實度、平塗的臉、點狀的眼睛、白袍與刷手服的形狀 | 顏色（那是一般牙科的綠）、姿勢、構圖 |
| ② | `drafts/kids-child-ref.jpg` | **小孩的畫法與頭身比**（站上唯一為分享卡尺寸畫過的小孩），以及大人與小孩並排時的高度差 | 構圖、戶外的顏色、那個牽手的動作 |
| ③ | `drafts/kids-chair-ref.jpg` | **診療椅的形狀**（椅背、頭枕、扶手、底座） | 顏色、旁邊那條腿、它在原圖裡是躺平的角度 |
| ④ | `assets/og-topic-general.jpg`（整張） | **整體色調、紙紋、密度、線的實度** | **構圖**（那是街景）、人數 |

產生 ②③ 的腳本：`node drafts/og-topic-kids-refs-crop.mjs`。

---

## 五、提示詞（Ⓐ 第一版，逐字，可直接複製）

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

THE SIX THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE IMAGES. Thin hand-drawn linework
   whose weight varies and sometimes breaks - NOT a thick even outline. Each face is ONE FLAT
   SKIN TONE with no shading and no modelling. On a face there is only: the outline, two eyes
   drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear. Hair is a flat shape in two tones with no individual
   strands. EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY -
   nobody is paler, softer, thinner or more transparent than anybody else.

2. THE HERO IS A CHILD OF ABOUT FIVE, SITTING UP ON A DENTAL CHAIR AND ENJOYING HIMSELF. The
   chair is UPRIGHT, not reclined, and has the shape of the reference chair. He sits on it
   with his legs dangling. HE HOLDS THE SUCTION TIP IN BOTH HANDS HIMSELF and is squirting a
   small thin arc of water into a small paper cup - he is trying it out and it is working.
   HIS IS THE BIGGEST FACE IN THE PICTURE: the top of his head is about one third down from
   the top edge, near the horizontal centre; his mouth is open in a delighted laugh, his eyes
   are squeezed into happy curves. HE LOOKS AT THE WATER, not at the viewer.

3. THE DENTIST IS DOWN AT HIS EYE LEVEL. A woman in a white coat over sage scrubs, SEATED ON
   A DENTIST'S OPERATING STOOL (round padded seat, slim column, five-star base on castors) to
   the LEFT of the chair, leaning in slightly, HOLDING THE PAPER CUP OUT FOR HIM with one
   hand, the other hand resting lightly on the tubing. Her eyes are on the child and she is
   laughing with him. HER HEAD IS NO HIGHER THAN THE CHILD'S HEAD. She is not standing over
   him, not reaching towards his mouth, not holding any instrument near his face, and SHE
   WEARS NO MASK - her whole face is visible.

4. THE MOTHER IS THE TALL FIGURE ON THE RIGHT AND SHE HAS LET GO. She stands with her full
   height about 70% of the picture height - the top of her head just below the empty top
   strip, her shoes close to the bottom edge - one hand resting on the back of the chair, her
   bag still on her other arm, shoulders dropped, watching her child and smiling. She is NOT
   holding him, NOT restraining him, NOT anxious, and she does not look at the viewer.

5. THREE SEPARATE LITTLE THINGS HAPPEN AT ONCE, spread along one horizontal band on the same
   floor with clear gaps between the groups: (a) the child and the water, in the centre;
   (b) the dentist with the cup, on the left; (c) far right and slightly behind the mother, a
   smaller girl of about three sits on a low stool swinging her legs and looking at a picture
   book on her knees. Nobody looks at anybody outside their own group, and nobody looks at
   the viewer.

6. LIGHT AND COLOUR. One warm light source from outside the frame at the upper left, so the
   light pools on the child and on the arc of water and softens towards the edges; NO LAMP IS
   DRAWN INSIDE THE PICTURE. The colours are warm: amber and caramel (#c28229, #e0a95c) for
   the child's shirt and the low stool, sage green (#8fae9b) for the chair and the scrubs,
   light warm wood for the floor, warm cream for the wall. Fine paper grain over the whole
   image and loose hand-drawn shading strokes; no large flat empty areas anywhere.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width;
the stool castors and the mother's shoes sit close to the bottom edge; the background is only
two things - the wall and the floor - plus a single low cabinet line behind them. No posters,
no shelves, no plants, no wall toys, no equipment trolley, no screens, no monitors.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets,
speech bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only;
anybody looking at the viewer; needles, syringes, drills, blood, tears; face masks; grey or
blue-white walls; an overall yellow or sepia cast; large empty white areas; photorealism;
3D rendering; heavy even black outlines.
```

---

## 六、交件前要過的門檻（圖回來之後我自己先跑，不過就重跑）

| | 門檻 | 腳本 |
| --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **< 5%** | `node drafts/og-measure.mjs <檔>` |
| 邊緣密度 | **≥ 30%** | `node drafts/og-measure-ink.mjs <檔>` |
| 每個人的線一樣實 | 各框最暗 5 百分位**相差 < 20 階** | 同上 |
| 頂 17% 有沒有被東西佔到 | 0%（被佔到就要重生成或用 `drafts/og-topclean.mjs`） | 同上 |
| 頂 17% 的中位色 | **R ≥ 228**（第一節第 2 條） | 同上 |

## 七、管線（圖定案之後，兩行）

    node tools/og-resize.mjs drafts/og-topic-kids-src.jpg kids
    node tools/og-plate.mjs kids --blend multiply --tintcolor <補償色> \
      --ink 0.18 --blur 6 --loc full --locpos stack

⚠ `--tintcolor` 要**用回來那張圖的牆現場算**，不要抄上面的表（那是候選值不是實測值）。
⚠ 驗收要模擬訊息 app 的裁切（iMessage 中央 78.7%、LINE 中央 89.7%），不要只看 1200 寬的原圖。

## 八、還要問使用者的

1. **三個梗選哪一個**（我建議 Ⓐ）。
2. Ⓐ 裡那個妹妹要不要留 —— 她讓畫面「有好幾件事同時發生」，但也可能被訊息 app 裁掉一半。
3. 這一張定案之後才做**線稿底圖**（從這張裁一段當姿勢參考）。
