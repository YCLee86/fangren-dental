# 分享圖提示詞：兒童牙科（`og-topic-kids`）

**狀態：⏳ 第四版已產圖並疊上帶子（2026-08-24），等使用者點頭。成品 `assets/og-topic-kids.jpg`。
原檔 `drafts/og-topic-kids-src.jpg`（第三版那張留在 `drafts/og-topic-kids-src-v3.jpg`）。
第五之二節是第三版的數字，第五之四節是第四版的。**
舊註：第一版的梗、姿勢、兩人同高、媽媽的位置全部一次就對，
使用者退回四件（安靜／褲子沒印花／椅子顏色／像倉庫）—— 量測與改法在第五之〇節，提示詞在第五節。**
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

## 五之〇、第一版的量測與使用者的四件（2026-08-24，使用者：「蠻好的　不過…」）

原檔 `drafts/og-topic-kids-v1.jpg`。**梗、姿勢、兩人同高、媽媽的位置全部一次就對了**，
四件回饋逐字：「畫面有點安靜」「醫師的褲子也要和帽子上衣同樣花色」
「椅子顏色也要改成兒童牙科主題色系」「診所空間環境很像倉庫　太空曠了　不像診間」。

| | v1 | 門檻 | |
| --- | --- | --- | --- |
| 邊緣密度 | **21.4%** | ≥ 30% | ❌ **不過** |
| 無彩空白（S<12 且 L>80） | 0.1% | < 5% | ✅ |
| 頂 17% 的邊緣密度 | 2.8% | 乾淨 | ✅ |
| 頂 17% 的中位色 | R245 G237 B219 | R ≥ 228 | ✅ 有餘裕（`--tintcolor` 會是 `#eda030`） |

**「太空曠」量得出來，而且量得出在哪裡。** 把畫面切成 6×3 格看邊緣密度：

    上排　 0.0　 0.0　 4.8　 0.1　24.1　 0.4   ← 除了媽媽那一格，整條上半部沒有東西
    中排　 9.8　12.1　38.5　40.1　41.5　25.4
    下排　12.1　23.4　41.9　47.6　36.7　26.1

→ **成因是我自己寫的那一條**：「背景只有牆與地板，加一條低櫃線；不要海報、不要盆栽、
不要器械推車」。那條是為 250px 寫的，但它把 ILLUSTRATION.md 第十一之一節第 3 條
（**「背景簡單」不等於「畫面空」—— 簡單要靠元素少而大**）做反了。
第二版改成**放五樣大東西**（窗、治療台的臂與托盤、長檯面與洗手台、牆上三片大雲、
收起來的診療燈），不是放很多小東西。

⚠ **頂 17% 要保住 2.8% 那個成績** —— 窗框、燈臂、牆貼一律壓在那條線以下。

### 這一版的四件改動

| 使用者說 | 改法 |
| --- | --- |
| 畫面有點安靜 | 新增一段「**同時要有三個小動作**」（孩子晃腳、妹妹跪起來探頭、後面的護理師在放紙杯），並把組數從三組變成三組五人（媽媽與妹妹算同一組） |
| 褲子也要同花色 | 帽子＋上衣＋**褲子**寫成「同一塊布」，白袍**敞開**讓印花露得出來 |
| 椅子換兒牙色系 | 鼠尾草綠 → **焦糖 `#d2a161`**（深階 `#a97a3c`）；護理師改穿素面鼠尾草綠，把站上那一支綠留在畫面裡 |
| 像倉庫、不像診間 | 五樣大東西（見上），目標邊緣密度 21.4% → **≥30%** |

---

## 五之一、第二版的量測與使用者的一件（2026-08-24，使用者：「很不錯欸　我喜歡」）

原檔 `drafts/og-topic-kids-v2.jpg`。**四件回饋全部治好了，而且量得出來：**

| | v1 | **v2** | 門檻 |
| --- | --- | --- | --- |
| 邊緣密度 | 21.4% | **30.2%** | ≥ 30% ✅（中央 73% 內是 31.0%） |
| 無彩空白 | 0.1% | **0.1%** | < 5% ✅ |
| 頂 17% 的邊緣密度 | 2.8% | **2.0%** | 乾淨 ✅（窗框、燈臂、牆貼都壓在線下了） |
| 頂 17% 的中位色 | R245 | **R244 G236 B217** | R ≥ 228 ✅ → `--tintcolor` 會是 `#eea131` |

6×3 格的邊緣密度，上排從 `0 / 0 / 4.8 / 0.1 / 24.1 / 0.4` 變成
`9.9 / 11.3 / 5.7 / 6.9 / 10.4 / 14.5` —— **倉庫感就是那一排 0 造成的，補上五樣大東西之後整排都活了。**

⚠ **兩人頭頂差那一項沒有可靠的自動量法**：牆上的雲和星星和醫師的頭在同一欄，
偵測到的最上緣是牆貼不是帽子。眼睛的高度目視是平的（使用者也接受了這一版），
**這一項改成用眼睛驗，不要拿那個偵測值當數據。**

⚠ 裁切模擬（iMessage 中央 78.7%、LINE 中央 89.7%，都縮到 212px 再放大檢查）：
**五塊該讀到的東西全部留得住**，iMessage 那一刀會切掉媽媽的包包與半邊身體，
臉還在畫面裡 —— 可以接受，第三版不動構圖。

### 第三版只改一件

使用者：「左邊的助理刷手服顏色也要是和醫師類似的黃色主題色　但花紋圖案和顏色不要和醫師一樣」
→ 護理師從**素面鼠尾草綠**換成**素面芥末琥珀 `#dda85a`（深階 `#b3812f`）＋奶油白小圓點
＋奶油白領口滾邊**，**沒有塗鴉圖案**（熊／小雞／雲／星／花是醫師那塊布的專屬）。
⚠ 站上那支鼠尾草綠因此完全離開這張圖，綠只剩兩盆盆栽 —— 那是刻意的，
畫面現在整組落在兒牙的琥珀色系裡。

---

## 五之三、疊上帶子之後退一步（2026-08-24，使用者：「套帶子之後我覺得畫面太多黃色」）

⚠⚠ **這是這一輪最值得記住的一件：底圖單獨看可以，疊上帶子之後可能就不行了。**
帶子是一整條深琥珀（`#9e6301`）壓在畫面最上面 17%，等於**又加了一大塊黃**，
而底圖裡本來就有焦糖椅、琥珀牆貼、印花制服、木頭檯面 —— 第三版的助理還整件芥末黃。
**驗收要看疊完帶子的那一張，不要只看底圖。**

改法（只動助理一個人）：

| | 第三版 | **第四版** |
| --- | --- | --- |
| 底色 | 芥末琥珀 `#dda85a`（整件） | **和醫師同一塊暖白布 `#f4ead8`** |
| 圖案 | 奶油白小圓點 `#f6ecd9` | **芥末琥珀小圓點 `#dda85a`**（＝她原本的底色） |
| 滾邊 | 奶油白 | 芥末琥珀（白底配白邊會消失） |

→ 她和醫師的區別從「**一大塊不同顏色**」變成「**同一塊布、不同圖案**」
（塗鴉 vs 圓點），黃色的面積因此少掉一整個人。
⚠ 醫師、椅子、牆貼、帶子**一個值都沒動**。

---

## 五、提示詞（第四版，逐字，可直接複製）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big
simple shapes, few large objects, ONE single continuous scene, no panels, no dividing lines,
no inset boxes.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a bright, calm, warm
children's dental clinic at midday, WITH THINGS GOING ON IN IT. The back wall is a WARM CREAM
WHITE (#f2e6d2) that keeps a clear hint of warmth in it - the wall is never grey, never
blue-white, never pure white and never mustard-yellow. The floor is light warm wood. Nothing
here is frightening: no needle, no drill, no blood, no tears.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is
plain warm cream wall only - no head, no hand, no lamp, no lamp arm, no window frame, no
shelf, no cable, no sign. Everything else in the room starts below that line.

THE PICTURE IS ABOUT TWO FACES AT THE SAME HEIGHT. A dentist has come all the way down to a
small child's level, and the child is delighted. Everything else serves that one idea.

THE EIGHT THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling. On a face there is only: the outline,
   two eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a
   tiny nose mark, a small mouth and an ear. Hair is a flat shape in two tones with no
   individual strands. EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME
   SOLIDITY - nobody is paler, softer, thinner or more transparent than anybody else.

2. THE CHILD IS SITTING UP ON THE DENTAL CHAIR AND HE IS ENJOYING HIMSELF. A boy of about
   five in a soft blue t-shirt and khaki shorts. THE CHAIR IS UPRIGHT AND LOWERED TO ITS
   LOWEST POSITION, and ITS UPHOLSTERY IS WARM CARAMEL (#d2a161, shaded with #a97a3c, with
   cream piping along the seams) - not green, not blue, not grey. He sits on it with his legs
   dangling over the front edge and HE IS SWINGING BOTH FEET, with two or three small motion
   lines beside his shoes. He leans forward towards the dentist, ONE SMALL HAND POINTING AT
   THE LITTLE ROUND MIRROR SHE IS HOLDING, the other hand on the armrest, mouth open in a
   happy laugh, eyes on the dentist. HIS IS THE BIGGEST FACE IN THE PICTURE, near the
   horizontal centre, the top of his head about one third down from the top edge.

3. THE DENTIST IS DOWN ON ONE KNEE BESIDE THE CHAIR, AND HER EYES ARE EXACTLY LEVEL WITH HIS.
   A woman kneeling on her right knee to the LEFT of the chair, back straight, leaning in a
   little. SHE HOLDS A SMALL ROUND DENTAL MIRROR LOW BETWEEN THEM, angled so the child can see
   into it; her other hand rests easily on her own knee. Her eyes are on the child and she is
   smiling with him. THE TOP OF HER HEAD IS AT THE SAME HEIGHT AS THE TOP OF HIS HEAD - this
   equal height is the single most important thing in the picture. She is NOT standing, NOT
   bending over him, NOT reaching towards his mouth, NOT offering him a gift, and SHE WEARS NO
   FACE MASK - her whole face is visible.

4. WHAT THE DENTIST IS WEARING (this is a brand detail, draw it carefully). HER CAP, HER TOP
   AND HER TROUSERS ARE ALL CUT FROM ONE AND THE SAME PRINTED FABRIC. On her head, a TIE-BACK
   SURGICAL CAP covering her hair completely, the fabric gathered and knotted into short ties
   at the back of her head, exactly the shape of the reference photograph of the cap. Over the
   printed scrubs she wears a WHITE COAT HANGING OPEN AND UNBUTTONED, so that the printed
   V-neck top, the printed short sleeves AND THE PRINTED TROUSERS DOWN TO HER SHOES are all
   clearly visible. THE FABRIC: warm off-white cloth (#f4ead8) scattered with SIMPLE FLAT
   CHILDLIKE DOODLES - little bears, chicks, clouds, stars and small flowers - drawn in ONLY
   TWO COLOURS, amber (#c28229) and deep caramel (#9e6301). THE DOODLES ARE BIG AND FEW, NOT
   SMALL AND BUSY: each doodle is about a quarter of the width of the cap, with a clear gap of
   about the same size between them, and the same doodles run over cap, top and trousers alike.
   No letters, no numbers and no words in the pattern.

5. THIS ROOM MUST READ AS A CHILDREN'S DENTAL CLINIC, NOT AN EMPTY HALL. Fill it with FIVE
   LARGE, SIMPLE THINGS - large and few, never many and small:
   • A WINDOW in the left half of the back wall, its frame beginning below the empty top strip,
     with warm daylight slanting in through it.
   • THE DENTAL DELIVERY UNIT behind the chair: one thick curved arm and a small instrument
     tray holding two paper cups and a folded cloth; its arm stays low, well below the top
     strip.
   • THE OPERATING LIGHT folded down and parked low behind the chair, its head pointing at the
     floor, its arm never rising into the top strip.
   • A LONG LOW WOODEN COUNTER along the back wall with a sink and tap, a stack of small paper
     cups, a lidded jar and one round potted plant on it.
   • THREE BIG AMBER CLOUD SHAPES AND TWO STARS stuck on the wall between the counter and the
     empty top strip - flat, simple, no outlines around them, no letters.

6. AT LEAST THREE SMALL THINGS ARE MOVING AT ONCE - this is what makes the picture feel alive.
   (a) the boy swinging his feet and pointing; (b) the little girl on the right rising up onto
   her knees on her stool, leaning towards her brother with her picture book still in one hand;
   (c) A DENTAL NURSE standing at the counter in the background, half turned away from us,
   setting a paper cup down on a tray. Nobody looks at the viewer.
   WHAT THE NURSE WEARS - THE SAME CLOTH AS THE DENTIST, BUT A DIFFERENT PATTERN ON IT:
   plain scrubs (no coat, no cap) cut from THE SAME WARM OFF-WHITE CLOTH (#f4ead8) as the
   dentist's, patterned with A SPRINKLE OF SMALL MUSTARD-AMBER POLKA DOTS (#dda85a) and a
   narrow mustard-amber trim along the V-neck and the pocket. HER PATTERN IS NOT THE DENTIST'S
   PATTERN: dots only - no bears, no chicks, no clouds, no stars and no flowers on her. The two
   women read as the same team in the same fabric, told apart by the pattern, NOT by a block of
   solid colour: her clothes must NOT be a solid mustard, ochre or yellow garment.

7. THE MOTHER IS THE TALL FIGURE ON THE RIGHT AND SHE HAS LET GO. She stands with her full
   height about 70% of the picture height - the top of her head just below the empty top strip,
   her shoes close to the bottom edge - in a muted coral top and denim jeans, her bag still
   hanging from one arm, the other hand resting on the back of the chair, shoulders dropped,
   watching her child and smiling. She is NOT holding him, NOT restraining him, NOT anxious.
   THE LITTLE GIRL SITS CLOSE BESIDE HER so that mother and daughter read as one group. Keep
   them both well inside the right edge, not touching it.

8. LIGHT AND COLOUR. Warm daylight comes from the window on the left, so the light pools on the
   two faces and on the little mirror between them and softens towards the edges. The colours
   are warm: amber and caramel for the printed cap, top and trousers and for the chair; white
   for the open coat; the nurse in the same off-white cloth with mustard dots; green only in the
   potted plants; light warm wood for the floor and counter; warm cream for the wall. Fine paper
   grain over the whole image and loose hand-drawn shading strokes; NO LARGE FLAT EMPTY AREAS
   ANYWHERE - if a part of the picture has nothing in it, put one of the five large things there
   instead.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
chair base, the dentist's knee and the mother's shoes sit close to the bottom edge; the top 17%
stays completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets,
speech bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only;
anybody looking at the viewer; needles, syringes, drills, blood, tears; face masks; a child who
looks frightened or is hiding; a green, blue or grey dental chair; sage-green or blue scrubs on
the nurse; a nurse dressed in a solid mustard, ochre or yellow uniform; a nurse wearing the
dentist's doodle print; grey or blue-white walls; an overall yellow or sepia cast; tiny busy
multicoloured patterns; posters or charts on the wall; large empty white areas; photorealism;
3D rendering; heavy even black outlines.
```

---

## 五之二、定案那一張的實際數字與指令（2026-08-24）

原檔 `drafts/og-topic-kids-src.jpg`（1424×752），**兩步都跑過**：

    node tools/og-resize.mjs drafts/og-topic-kids-src.jpg kids
    node tools/og-plate.mjs kids --blend multiply --tintcolor '#c17900' \
      --ink 0.18 --blur 6 --loc full --locpos stack

| | 值 | 門檻 |
| --- | --- | --- |
| 裁切 | 左右 0.00%／上下 −0.90%（只往內裁） | < 8% ✅ |
| 邊緣密度（疊帶子前） | **33.5%** | ≥ 30% ✅ |
| 無彩空白 | 0.1% | < 5% ✅ |
| 頂 17% 的邊緣密度（疊帶子前） | 2.4% | 乾淨 ✅ |
| 頂 17% 的中位色 | R242 G234 B215 | R ≥ 228 ✅ |
| 帶子落在 | `rgb(158,99,7)` ＝ 深階 `#9e6301` | 見下 |
| 紙色字對帶子 | **3.91** | 見下 |
| 帶子安全區 | 左右各 160px、兩組字之間 410px | ≥ 160 ✅ |

### ⚠⚠ 這一科的帶子**不能落在套色上**（七科第一次）

紙色字壓在兒牙套色 `#c28229` 上只有 **2.54** —— 三格並排在 212px 下看，
「兒童牙科」四個字明顯比另外兩格糊（Ⓐ 套色 2.53／Ⓑ 深階 3.91／Ⓒ 再深一階 4.83）。
**定案取 Ⓑ 深階 `#9e6301`**：它是站上兒牙的字與框色（不是新色），
對比和顯微根管那張已上線的 4.12 同一級，而且第十一節開頭寫的本來就是
「**玻璃要用深階不是套色**」。Ⓒ 雖然過得了 4.5，但那個棕色站上不存在。
⚠ 七科的對比表在 ILLUSTRATION.md 第十一節，**下一科動手前先查那張表**。

### 順帶做掉的兩件

・`tools/topics.mjs` 的 `OG_ALT.kids`（描述圖裡實際有什麼）與
  `OG_DESC.kids`＝ 那一頁自己的收尾句「孩子願意來、牙齒撐得住，其他的我們一起來努力。」
  —— **兩句都是站上原本就有的字**，不是另外寫的文案。
・裁切驗收：iMessage 中央 78.7%、LINE 中央 89.7%，兩種都模擬過 ——
  科別名、標誌、診所名、地名**全部留得住**；被切掉的是媽媽的包包與半邊身體，臉還在。

---

## 五之四、第四版的數字（2026-08-24）

    node tools/og-resize.mjs drafts/og-topic-kids-src.jpg kids
    node tools/og-plate.mjs kids --blend multiply --tintcolor '#c27a00' \
      --ink 0.18 --blur 6 --loc full --locpos stack

| | v3 | **v4** | 門檻 |
| --- | --- | --- | --- |
| 邊緣密度 | 33.5% | **33.5%** | ≥30% ✅ |
| 無彩空白 | 0.1% | **0.1%** | <5% ✅ |
| 頂 17% 邊緣密度 | 2.4% | **2.4%** | 乾淨 ✅ |
| 頂 17% 中位色 | R242 G234 B215 | **R241 G233 B214** | R≥228 ✅ |
| `--tintcolor` | `#c17900` | **`#c27a00`**（牆差一階，補償色跟著算） | — |
| 帶子落在／紙色字對比 | `#9e6301`／3.91 | **同上** | 見第五之二節 |

### ⚠ 使用者問「上面那條乳白色的帶子是不是把插圖截掉了」——沒有，但值得記住

那是**我們自己要求的安靜區**（提示詞第三段：頂 17% 只畫牆）。模型這一版把它畫成
**比下面的牆亮一階的一條**（接縫在 y≈124/752 ＝ **16.5%**，上面 `rgb(241,233,214)`、
下面 `rgb(241,228,211)`），所以在**底圖**上看得出一條橫線，像被切掉一截。
疊上帶子（蓋掉 16.56%）之後**整條被蓋住**，逐列看過成品沒有殘留的線。

⚠⚠ **但餘裕只有 2px（16.56% vs 16.5%）。** 下一科要注意兩件：
・提示詞那一段要**再加一句「那條牆和下面的牆是同一片，不要有任何橫線或深淺變化」**；
・`og-resize` 會往內裁掉約 0.9% 的高度，接縫的百分比因此會**往上跑一點點**（有利），
  但只要模型把接縫畫在 17% 以下就會露出來 —— **每一版都要把成品的頂端逐列看一次。**

---

## 五之五、帶子上的字換成純白（2026-08-24，使用者：「帶子上的字灰灰的」）

**成因是兩件，都量得出來：**

1. **紙色 `#e2e5e6` 是偏冷的灰**（站上它是「紙」，底是白的所以看起來乾淨），
   壓在暖琥珀的帶子上就讀成髒灰。主名對帶子只有 **3.91**。
2. **地名那一行的不透明度只有 .65** —— 紙色 .65 疊在 `#9e6301` 上合成
   `rgb(202,184,152)`，對帶子只有 **2.49**，是整條帶子最弱的一行。

定案：**`--fg #ffffff` ＋ `--locop 0.9`** → 主名 **4.95**（過站上的 4.5）、地名 **4.33**。

    node tools/og-plate.mjs kids --blend multiply --tintcolor '#c27a00' --ink 0.18 --blur 6 \
      --loc full --locpos stack --fg '#ffffff' --locop 0.9

⚠⚠ **這兩個參數是 2026-08-24 新加到 `tools/og-plate.mjs` 的，預設值沒有動** ——
一般牙科／牙周／顯微根管那三張重跑照舊是紙色 .65／.72，**不要為了一致順手全改成白**：
它們的帶子是綠、青綠、磚紅，紙色在那些底上不會發灰，而紙色是站上的顏色。
**判準：帶子是暖色（琥珀、芥末、褐）就用純白；冷色與深色維持紙色。**

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

1. ~~妹妹要不要留~~ —— 第一版使用者沒有反對，留著，第二版讓她跪起來探頭（比坐著看書有動作）。
1.5 護理師是第二版才加的（為了「太安靜」），組數因此是三組五人。**不要再往上加人**。
2. 印花的圖案要不要指定成診所自己的東西（例如站上那顆標誌的形狀）——
   目前寫的是通用的小熊／小雞／雲／星星／小花。
3. 這一張定案之後才做**線稿底圖**（從這張裁一段當姿勢參考）。
