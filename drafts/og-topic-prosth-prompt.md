# 分享圖提示詞：植牙・假牙重建（`og-topic-prosth`）

**狀態：⚠ 第一輪五案（Ⓐ~Ⓔ）全部生出來了，但 2026-08-25 被使用者退回整條路 ——
石膏牙模不夠白話、醫療符號在著陸頁上距離感太強。見第二之一節。第二輪的梗提案中。**
**五案的提示詞都已寫好（第四節，可直接複製）**，形狀參考圖 `drafts/prosth-model-ref.png` 已產出。還沒生圖。
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十六、十七節與 `tools/topic-copy.mjs` 的 `prosth`。
順序：**分享圖在前、線稿底圖在後**（線稿的姿勢參考要從這張裁，ILLUSTRATION.md 第十二節）。

---

## 一、動筆之前已經被鎖死的四件

### 1. 那一頁的軸（圖要接的是這個，不是「植牙」這兩個字）

- `lead`：**牙齒好像該好好整理了 —— 可是從哪裡開始？**
- `cases`：缺了好幾年只能用另一邊咬／補過的、缺的、鬆的不只一顆／怕是一大筆錢／說法都不一樣
- `flowTitle`：**要整理的話，順序大概是這樣**（看全口 → 打底 → 恢復功能 → 目標 → 按療程）
- `close`：整理好，吃得順、用得久 —— 部定專科醫師做過全口評估，幫你安排治療計畫。

⚠⚠ **這一頁不是「三選一」**（2026-08-21 使用者換掉的框架）：它回答的是
**「一口牙該從哪裡開始整理」**。所以圖上**不可以把活動假牙／牙橋／植牙並列**，
那既是分格、又是比較，而且把頁面打回被否決的舊框架。

### 2. 牆的顏色：這一科是七科裡**第二寬鬆**的（先算再構圖）

帶子相乘上色，補償來源色 `M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆`，
任一通道 > 255 就補不上去、帶子只能往深階漂。
植牙套色 `#335b8b` 的分子是 **R 53.0 / G 101.3 / B 161.0** ——
也就是**頂 17% 那面牆的藍通道要 ≥ 161**（R ≥ 53、G ≥ 101）。

| 候選牆 | M（R/G/B） | |
| --- | --- | --- |
| 冷白牆 `#eef1f2` | 57/107/170 | ✅ |
| 淺灰牆 `#dfe3e4` | 61/114/180 | ✅ |
| 淺米牆 `#ece0cd` | 57/115/200 | ✅ |
| 米黃牆 `#e8dcc6` | 58/117/207 | ✅ |
| 暖灰牆 `#d9cfc4` | 62/125/209 | ✅（兒牙那一科在這面牆上就掛了） |
| 淺藍天 `#a8c8e0` | 80/129/183 | ✅ |
| 暖木質 `#b08050` | 77/202/**513** | ❌ |
| 陶土 `#c98a5f` | 67/187/**432** | ❌ |
| 夜景 | — | ❌ |

→ **室內室外都可以，冷光暖光也都可以，唯一擋掉的是「木頭色／陶土色／暗」的頂端。**
構圖時只要把上緣 17% 訂在一面淺色的牆、天花、或天空就好。
深階 `#182f4b` 的下限只有 B ≥ 83，更寬鬆；落套色還是落深階，等圖出來照兒牙／矯正
那樣做成 LINE 模擬（`node drafts/line-mock.mjs prosth`）讓使用者挑。

### 3. 不能和站上這六張撞

| 已上線 | 它的語彙 |
| --- | --- |
| 一般牙科（分享卡） | 白天巷弄街景、三組人各做各的事 |
| 牙周治療（分享卡） | 診間、醫師持水槍、擬人牙齒＋細菌四散（**動**） |
| 顯微根管（分享卡） | 診間、醫師**坐**醫師椅＋顯微鏡＋大放大圈（靜的一瞬） |
| 兒童牙科（分享卡） | 診間、醫師單膝蹲下、孩子坐**診療椅**、媽媽站右邊 |
| 齒顎矯正（分享卡） | 看片角落、兩人站著一起看一片**發亮的側顱 X 光** |
| 〈缺牙之後〉（文章 HERO，會出現在同一頁的文章卡上） | **夜市與暖燈**、多格 |

→ 這一張**不畫擬人牙齒**、**不畫診療椅上的治療**、**醫師不坐醫師椅**、
**不畫發亮的螢幕／燈箱**（矯正那張剛用掉，而且兩張都是「兩個人看同一件東西」，
撞的是關係不只是道具）、**不畫夜市或吃東西的場景**（同一頁下面就有那張卡）。
→ 這一科**還沒有人用過的語彙是「手上有一件實體的東西 ＋ 坐下來談」**
（矯正那一輪的 Ⓑ「模型在手上」正是因為「容易被讀成假牙」而讓給這一科的）。

### 4. 圖上不准出現的（除了第十一節那九條）

- ⚠⚠ **三種方案並列**（見上面第 1 條）、任何 before/after 兩格。
- ⚠⚠ **時間與階段的暗示**：日曆、階段編號、進度條 —— 療程分幾階段、各要等多久
  **都還沒問到診所**（`ask`），整頁刻意一個數字都沒有。
- ⚠⚠ **金額、價目、計算機、帳單**。錢是他的**不安**（`cases` 第三句），不是資訊。
- ⚠⚠ **缺牙的洞、鬆動的牙、萎縮的牙床的特寫** —— 品牌那關要拉力不要推力
  （COPY.md 第九之十七節）。這一頁的讀者已經知道自己缺牙了，不必再被提醒一次。
- ⚠ **植體的螺絲特寫、剖面圖、器械盤** —— 器械特寫是反方向（CLAUDE.md 第九節第 19 項）。
- ⚠ 病人不要畫成年輕人：`cases` 第一句是「缺了好幾年」，第二句是「不只一顆」。
  建議 **55~70 歲**，而且**不要畫成虛弱的長輩**（他是自己走進來要把事情弄好的人）。

---

## 二、五個梗（提案中，2026-08-25）

### Ⓐ 坐下來，先看全口（插畫師推薦）

診間旁的談話角落。**醫師與病人隔著一張小桌斜對坐**，桌上攤著**一副很大的全口模型**，
醫師的筆尖停在其中一區、另一手掌心朝上在講；病人身體前傾、手扶著桌沿在看。
右後方一位穿刷手服的助理正把另一副模型放上矮櫃（各做各的事 ＝「活潑」）。

- **對到**：`flow` 的［看全口］「缺一邊，一直靠另一邊撐著用」＋ `close` 的
  「做過全口評估，幫你安排治療計畫」。**它畫的是那一頁的框架本身**（順序，不是選項）。
- **視覺中心**：桌上那副模型（畫面高的 ~30%），全圖最大的單一物件。
- **250px**：兩個人隔著桌子相對、中間一塊淺色大團塊 —— 三塊面，掃一眼就讀得出。
- **牆**：室內淺灰／米白牆，輕鬆過 B ≥ 161。✅
- **和矯正那張怎麼分開**：那張是**站著、看發亮的平面**；這張是**坐著、俯視桌上的實體**，
  而且多了第三個人。
- **風險**：模型畫太細會變雜點 —— 只留牙弓的形狀與缺牙那一段的空隙，不要畫每一顆的溝紋。

### Ⓑ 上下對得上（模型在手上）

醫師站著，**雙手各拿上下顎模型正把它們合起來**，一根手指停在後牙咬合的位置；
病人在旁邊湊近看，手上還捏著自己在別處拿到的說明單。背後矮櫃上還有兩副模型。

- **對到**：`flow` 的［目標］「都吃些什麼、以後想吃什麼，看能到哪」——
  **咬得到才吃得到**，這是全頁最具體的一件事；`cases` 第四句（說法都不一樣）
  由他手上那張單子承接。
- **視覺中心**：那副模型可以放到畫面高的 **~35%**，**五案裡 250px 最好讀的**。
- **風險**：只有兩個人、動作很小，容易掉進第十一之二節那個「安靜」的坑 ——
  一定要補第三組（後方有人在做別的事）。
- **備註**：這個語彙是矯正那一輪**刻意讓給這一科**的（「模型容易被讀成假牙」）。

### Ⓒ 一直靠另一邊（把那句機制畫出來）

病人坐著、手不自覺搭在習慣咬的那半邊臉頰上；醫師拿著一副模型，
手指點的是**另一邊**那個空缺。兩個人都在看同一個地方。

- **對到**：`cases` 第一句與 `flow` 第一行**同一件事**——
  「缺一邊，一直靠另一邊撐著用」是整頁唯一一個「他自己看不到的問題」，
  被說中的力道最強。
- **風險（三件，所以列為備案）**：① 「手扶臉頰」在 250px 下讀不出來（同矯正 Ⓒ 的風險）；
  ② 容易畫成**牙痛／忍耐**的表情 ＝ 推力；③ 手碰臉會擋住臉，臉本來就只剩 14px。
- **建議**：不單獨做，把它的**情緒**疊到 Ⓐ／Ⓑ 的病人身上
  （表情是「原來是這樣」，不是「痛」）。

### Ⓓ 陪他來的那一趟

長輩坐著、**成年子女站在旁邊代問**（手上拿著手機記重點）、醫師在講，
桌上同樣有一副模型。三個人分成兩組：醫師一組、父子／母女一組。

- **對到**：`cases` 第四句「問過幾個地方，說法都不一樣」——
  這一次有人陪他一起聽。也接得上一般牙科那頁「人在外地、替爸媽找診所的子女」
  （COPY.md 第九之十四節）那條讀者線。
- **風險**：**三個人容易散**（第十一節硬規格 4：要分成 2~3 組、排成一條橫帶、
  有一個亮的落點）。而且「子女代問」有機會被讀成長輩沒有主導權 ——
  要讓**長輩是坐在中間、正在說話的那一個**。
- **備註**：這是五案裡唯一把「陪伴」畫出來的，品牌上最軟，但軸最偏
  （它講的是「來看診這件事」，不是「怎麼整理一口牙」）。

### Ⓔ 講究的那一雙手

一位醫師（或技師）在窗邊的光裡，**兩手捧著一副做好的假牙／牙橋在對細節**，
另一位站在旁邊看；後方病人正走進診間。**沒有治療動作、沒有器械盤。**

- **對到**：`close` 的「吃得順、**用得久**」與 HERO 第三行「講究　顧牢牢」——
  這是七張裡唯一畫**做工**的。
- **風險（最大，所以排最後）**：① **病人沒有位置** ——
  第十一節的判準是「讓人一眼認出這是哪一科」，工藝感容易讀成「這裡在賣東西」；
  ② 逼近「器械特寫」那條紅線；③ 和那一頁「從哪裡開始」的軸接不太上。
- **建議**：不做成主圖。這個語彙**留給日後的線稿底圖或文章 HERO** 比較合適。

---

## 二之一、⚠⚠ 五案都生出來了，但**整條路被退回**（2026-08-25）

使用者看過五張之後：

> 「假牙醫師就像**建築師、土木技師、裝修技師**，是要負責訂定全口治療計畫的，
> 　概念上是這樣。但**用石膏模型表現這個意象不夠白話，一般人不懂**；
> 　而且**看到醫療專業就會覺得有距離、害怕、防衛**，所以我們前面著陸頁和文章圖片
> 　都會儘量避開這個問題，**特別是著陸頁，那個呈現意象更強烈**。」

⚠ **被退的不是某一案，是五案共用的道具**：五張裡有四張的視覺中心是石膏牙模。
內核（**醫師＝統籌整件事的人**）他認可了，**要換的是道具與距離**。

**三條通則（會用到口腔外科那一科，也會用到日後的文章插畫）：**

1. ⚠⚠ **石膏牙模不是白話，是行話。** 它在診間裡是最溫和的教具，可是在
   訊息卡上、對還沒進門的人來說，它是「一整排牙齒」——**放大、單獨、擺在桌子中間**，
   醫療感比它在診間裡強得多。**同一個物件，換一個顯示情境就換了意思。**
2. ⚠⚠ **著陸頁的意象比文章強，所以醫療符號的門檻要更低。** 文章的讀者已經點進來了，
   著陸頁（與它的分享卡）攔的是**還在猶豫要不要進門的人**——這一格的人對
   白袍、器械、教具的防衛心最高。
3. ⚠⚠⚠ **帶子上已經寫著「植牙・假牙重建」六個字，所以圖不必自己證明這是牙科。**
   這是這一輪最有用的一句：已上線那五張每一張都還帶著診間或牙的符號，
   **這一張可以是第一張離開的**。圖的工作只剩兩件 —— **「這是芳仁」** 與
   **「他心裡那件事被看見了」**。

### 這一輪新增的一把尺：**距離尺**（桌上放什麼、醫師穿什麼）

把使用者那句抽象的意見變成可以逐格挑的東西。**兩條各四格，可以套在任何一個梗上：**

| 桌上放什麼 | 距離 |
| --- | --- |
| 一杯茶 ＋ 一本筆記本 | 最近（完全是生活場景） |
| 一張手畫的順序（幾個大方塊連成一條線） | 近（「有人幫你排」，但不是牙） |
| 一張口內／全口的照片 | 遠 |
| **石膏牙模** | **最遠 ← 這一輪被退的那一格** |

| 醫師穿什麼 | 距離 |
| --- | --- |
| 素色襯衫捲起袖子 | 最近（像來幫你看房子的師傅） |
| 刷手服，沒有白袍 | 近 |
| 刷手服 ＋ 敞開的白袍 | 遠 ← 五案都用這一格 |
| 白袍扣起來 ＋ 口罩掛著 | 最遠 |

⚠ 距離不是越近越好：**近到看不出這是一間診所也不行**（第十一節：圖要讓人一眼認出
這是芳仁）。定案要在「認得出是診所」與「沒有防衛心」之間挑一格，**由使用者挑**。

## 二之二、第二輪的四個梗（2026-08-25，提案中）

共同的轉向：**視覺中心從「一件醫療教具」換成「兩個人之間正在發生的事」**，
醫師的身分靠**姿態**建立（在聽、在排、在帶路），不靠道具。

### Ⓕ 都吃些什麼（插畫師推薦・距離最近）

診所裡的談話角落。醫師與病人隔著小木桌坐著，**桌上只有一杯茶和一本翻開的筆記本**。
病人（六十五歲上下）兩手比出一個小小的動作，正在講他平常都吃些什麼；醫師手上握著筆，
身體微微前傾在聽，**沒有在寫**。後方一位穿刷手服的人正把窗邊的盆栽轉個方向。

- **對到**：`flow` 的［目標］「都吃些什麼、以後想吃什麼，看能到哪」——
  那一行是使用者自己改了三次才定下來的，判準正是**「問他，他答得出來嗎」**。
  這一格是全頁最白話的一句，**畫出來也最白話**。
- **250px**：兩個人隔著桌子相對、一杯茶在中間，三塊面。臉是最大的兩塊 —— 這一案
  唯一的中心是**人的表情**，不是物件。
- **距離尺**：桌上＝一杯茶（最近）／醫師＝刷手服不穿白袍（近）。
- **風險**：離「牙科」最遠，光看圖會像任何一種諮詢 —— 由帶子上那六個字承擔
  （第二之一節第 3 條）。若使用者覺得太遠，把筆記本換成 Ⓖ 那張手畫的順序即可。

### Ⓖ 把順序畫在紙上（「訂計畫」的白話版）

同一張桌子，**桌上攤一張大紙**，醫師握筆正在紙上畫出**四五個大方塊連成一條線**
（那是順序，不是牙位圖、不是表格、不是數字），病人的手指停在其中一格上，抬眼在問。
後方有人端著兩杯水走過。

- **對到**：`close`「做過全口評估，**幫你安排治療計畫**」＋ `flowTitle`
  「要整理的話，**順序大概是這樣**」。這是使用者那個「建築師／土木技師」比喻
  **唯一不需要翻譯的畫法** —— 建築師的白話符號是**紙與筆**，不是工地。
- **250px**：紙是畫面上最大的一塊淺色，方塊夠大就讀得出「有一條線、有幾格」。
- **距離尺**：桌上＝手畫的順序（近）／醫師＝刷手服（近）。
- **風險**：① 紙上的東西畫細就變雜點 —— 只准四五個大方塊和一條線，
  **一個數字、一個字都不准有**（有數字就會被讀成報價）；② 紙太白會踩到
  「無彩空白 < 5%」那條門檻，紙必須是暖白並被光染上顏色。

### Ⓗ 帶你走一趟（最接近「裝修師傅」的動作）

醫師和病人**並肩走在診所的走廊上**，醫師側身講話、手往前一指；病人一邊走一邊聽。
走廊盡頭一扇亮著的窗，兩側是診間的門和一張長木凳，凳上有人在等。**全畫面沒有
任何器械、沒有教具、沒有一顆牙。**

- **對到**：使用者的比喻本身 —— 師傅帶屋主**走一遍、講一遍**。也對到
  `flow` 的［看全口］：先把整個地方走過一次，再談要動哪裡。
- **250px**：走廊的透視把兩個人和那扇亮窗串成一條線，**亮窗就是落點**。
- **距離尺**：桌上＝沒有桌子（最近）／醫師＝襯衫捲袖或刷手服都行。
- **風險**：① 沒有物件當中心，全靠走廊的透視撐 —— 是四案裡最需要構圖功力的一張；
  ② 「走廊」容易畫成醫院的長廊（冷、空、大），必須是**小診所**：木質、短、
  一眼看得到底。

### Ⓘ 一整排房子裡的那一戶（使用者的比喻直接畫，風險最高）

老街屋一整排，中間那一戶正在整理：師傅和屋主站在騎樓下抬頭看，屋主手插腰、師傅比劃著。
**一整排連棟街屋 ＝ 一整排牙齒，中間缺的那一戶 ＝ 缺牙**。

- **為什麼列出來**：這是使用者自己給的比喻，而且**老屋新生正是這個站的品牌語彙**
  （COPY.md 第九之十四節）。
- **風險（所以排最後）**：① ⚠⚠ **會和一般牙科那張撞** —— 那張就是白天的巷弄、
  老屋門面、三組人各做各的事，兩張並排會像同一系列的兩格；
  ② ⚠⚠ **這個比喻要翻譯**（第七節第 11 條：需要翻譯的比喻是失敗的）——
  看得懂的人會很喜歡，看不懂的人只看到一排房子；
  ③ 畫面上沒有任何醫療線索，連「診所」都不見了。
- **建議**：不做成分享卡。**它比較適合日後的線稿底圖**（線稿是墊在文字底下的，
  比喻可以慢慢被讀出來，不必一眼就懂）。

---

## 三、五案共用的東西（顏色、參考圖、門檻）

### 顏色（**量出來的，不是挑的** —— ILLUSTRATION.md 第十之三節）

植牙套色 `#335b8b` 的色相是 **212.7°**。照〈半年一次的洗牙〉那張的實測值同明度同彩度
把色相移過來，得到這一科的人物色：

| | 一般牙科（站上實測） | → 植牙・假牙重建 |
| --- | --- | --- |
| 刷手服・主色 | `#bfd7b7` HSL(105, 29, 78) | **`#b7c5d7`** |
| 刷手服・陰影 | `#99b899` HSL(120, 18, 66) | **`#99a7b8`** |
| 頭髮・主色 | `#374840` HSL(150, 13, 25) | **`#373f48`** |
| 頭髮・暗處 | `#283930` | **`#283039`** |
| 頭髮・亮處 | `#404f47` | **`#40474f`** |

其餘固定值：**牆 `#e7e4dd`**（頂 17% 用它，補償色算出來 58/113/186，過關）、
地板與桌面淺暖木、白袍純白、**牙模石膏 `#efeae1`／底座 `#e3dbcd`／線 `#7d766b`**。
病人的衣服走暖側（赭 `#c08a5c`、苔綠 `#8a9a72`、暗紅 `#a05a52` 任選）——
整張要**至少五個看得出來的顏色**，多數色塊落在 HSL S 30~50、L 70~85
（第十之四節：「暗淡」的成因是整片只有一個顏色，不是彩度不夠）。

### 參考圖（餵圖的時候用途要分開講）

| 檔案 | 怎麼說 |
| --- | --- |
| `drafts/style-ref-waiting-room.jpg`、`style-ref-endo-consult.jpg`、`style-ref-perio-full.jpg` | **「參考它的乾淨程度、線的實度、密度與氛圍，不要參考構圖與人數」** |
| **`drafts/prosth-model-ref.png`**（2026-08-25 新畫） | **「牙模就是這個形狀」** —— 左＝下顎模型俯視（馬蹄形牙弓、右後方缺兩顆）／右＝上下顎對咬的側面。⚠ 第十之一節：**形狀不要用文字描述，用參考圖**；五案有四案手上／桌上有牙模 |
| 姿勢參考 | 目前沒有。第一版若姿勢跑掉（人的角度、手的位置），再從既有的分享圖裁一張補上，**不要用更多文字去描述動作**（一般牙科那次文字描述動作四件全錯） |

### 交件門檻（不過就不拿出來）

無彩空白 **< 5%**／邊緣密度 **≥ 30%**／每個人的線相差 **< 20 階**
（`drafts/og-measure.mjs`、`og-measure-ink.mjs`）；**頂 17% 的 B 通道實測 ≥ 161**。

---

## 四、五份提示詞（2026-08-25，可直接複製）

⚠ 五份都是完整的，不必互相拼接。**每一份的第 1 點（STYLE）與最後的 AVOID 段逐字相同**，
差別只在中間的畫面 —— 那是刻意的：臉的規則放在 STYLE 段裡權重最高（第十之五節），
AVOID 段收在最後一小段（TEAM.md 第 10 號的排法）。

### Ⓐ 坐下來，先看全口

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a calm, bright, unhurried
consultation corner in a small neighbourhood dental clinic in the afternoon, WITH THINGS GOING
ON IN IT. The back wall is a soft warm off-white (#e7e4dd) - never grey, never blue-white, never
pure white, never wood-coloured and never dark. The floor and the furniture are light warm wood.
Nothing here is frightening and nothing is being treated: no drill, no needle, no blood, no
open mouth, no dental chair in use.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no lamp arm, no shelf, no cable, no sign,
no window frame. Everything else starts below that line.

THE PICTURE IS ABOUT TWO PEOPLE SITTING DOWN TOGETHER AND LOOKING AT A WHOLE SET OF TEETH. A
dentist and an older patient are on either side of a small table; between them lies one large
plaster study model of a full dental arch. Everything else serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE PLASTER MODEL ON THE TABLE IS THE CENTRE OF THE PICTURE. One large horseshoe-shaped
   plaster model of a lower dental arch, EXACTLY THE SHAPE OF THE SHAPE-REFERENCE DRAWING: a
   horseshoe of simple rounded teeth on a smooth plaster base, with A GAP WHERE TWO BACK TEETH
   ARE MISSING on one side. It lies flat on the table, tilted slightly towards the viewer, and it
   is BIG - about 30% of the picture height, larger than either person's head. Plaster cream
   (#efeae1) with a warmer base (#e3dbcd) and soft grey-brown outlines (#7d766b). Draw only the
   overall horseshoe, the row of simple teeth and the gap - NO grooves, NO numbers, NO markings,
   NO tiny detail on the teeth.

3. THE DENTIST IS SEATED ON THE LEFT, TURNED TOWARDS THE PATIENT. A woman in her thirties or
   forties sitting at an angle to the table, leaning in a little. She holds a slim pen and ITS
   TIP RESTS ON THE MODEL AT THE GAP; her other palm is turned upwards on the table as she
   explains. She looks at the model, not at us. She wears plain scrubs in muted blue-grey
   (#b7c5d7, shaded #99a7b8) under AN OPEN WHITE COAT, hair (#373f48) tied back, NO FACE MASK.

4. THE PATIENT IS SEATED ON THE RIGHT AND HE IS LEANING IN. A man of about sixty-five, upright
   and healthy-looking - NOT frail, NOT stooped, NOT sad - in a warm ochre polo shirt (#c08a5c),
   both hands resting on the table edge, body clearly tipped forward towards the model, eyebrows
   slightly raised as if he has just understood something. HIS EYES ARE ON THE MODEL. He has
   come to sort things out; he is not being comforted.

5. AT LEAST TWO MORE SMALL THINGS ARE HAPPENING AT ONCE - this is what makes the picture feel
   alive, and nobody looks at the viewer. (a) A DENTAL NURSE in the same blue-grey scrubs stands
   at a low counter in the background, half turned away, setting a second plaster model down on a
   tray; (b) beyond her an open doorway shows a sliver of the corridor with a person walking past.
   Both are SMALLER and FURTHER AWAY, never fainter - same line weight as everyone else.

6. FILL THE ROOM WITH FOUR LARGE SIMPLE THINGS, never many small ones: the small wooden table
   itself; a long low counter along the back wall with a potted plant and a stack of paper cups;
   two simple wooden chairs; and a wide window on the left whose frame begins BELOW the empty top
   strip, letting warm afternoon light slant across the table. No posters, no charts, no shelves
   of instruments, no cabinets full of small objects.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the light pools on the
   plaster model between the two people and softens towards the edges. At least five clearly
   different colours: warm off-white wall, light warm wood floor and table, blue-grey scrubs,
   white coat, ochre shirt, cream plaster, one green plant. Most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE - if a part of the
   picture has nothing in it, put one of the four large things there instead.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge and both people's knees sit close to the bottom edge; the top 17% stays completely
empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets, speech
bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only; anybody
looking at the viewer; a dental chair with a patient lying in it; a dentist sitting on an
operator stool beside a reclined patient; a glowing screen, light box, X-ray or monitor; rows of
instruments, drills, needles, syringes, implant screws, cross-sections or diagrams; a mouth being
treated; missing teeth or damaged teeth shown in a real mouth; three different treatment options
lined up for comparison; before-and-after pairs; calendars, price tags, money, invoices; a
night-time or street-food scene; cartoon teeth with faces; face masks; grey or blue-white walls;
an overall yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even
black outlines.
```

### Ⓑ 上下對得上（模型在手上）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a calm, bright, unhurried
corner of a small neighbourhood dental clinic in the afternoon, WITH THINGS GOING ON IN IT. The
back wall is a soft warm off-white (#e7e4dd) - never grey, never blue-white, never pure white,
never wood-coloured and never dark. The floor and furniture are light warm wood. Nothing is
being treated: no drill, no needle, no blood, no open mouth, no dental chair in use.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no lamp arm, no shelf, no cable, no sign,
no window frame. Everything else starts below that line.

THE PICTURE IS ABOUT TWO PLASTER MODELS BEING CLOSED TOGETHER IN A DENTIST'S HANDS, AND A
PATIENT LEANING IN TO SEE HOW THEY MEET. Everything else serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE TWO MODELS IN HER HANDS ARE THE CENTRE OF THE PICTURE AND THEY ARE BIG. An upper and a
   lower plaster arch, EXACTLY THE SHAPE OF THE SHAPE-REFERENCE DRAWING (the right-hand view:
   two horseshoe arches seen from the side, their simple rounded teeth meeting tip to tip on a
   smooth plaster base). She holds one in each hand and is CLOSING THEM TOGETHER so that the back
   teeth meet. Together they are about 35% of the picture height - clearly larger than her head.
   Plaster cream (#efeae1), warmer base (#e3dbcd), soft grey-brown outlines (#7d766b). Draw only
   the arches, the base and the simple row of teeth - NO grooves, NO numbers, NO markings.

3. THE DENTIST IS STANDING, SLIGHTLY LEFT OF CENTRE, HOLDING THE MODELS AT CHEST HEIGHT. A woman
   in her thirties or forties, standing three-quarters towards us, elbows in, forearms raised so
   that the two models are held up between her and the patient. ONE INDEX FINGER POINTS AT THE
   PLACE WHERE THE BACK TEETH MEET. Her eyes are on the models. Plain scrubs in muted blue-grey
   (#b7c5d7, shaded #99a7b8) under AN OPEN WHITE COAT, hair (#373f48) tied back, NO FACE MASK.

4. THE PATIENT STANDS ON THE RIGHT AND LEANS IN TO LOOK. A woman of about sixty, upright and
   healthy-looking - NOT frail, NOT sad - in a soft moss-green cardigan (#8a9a72), one hand
   holding a folded printed leaflet she has brought with her, the other hand at her side, head
   tipped towards the models, eyebrows slightly raised. HER EYES ARE ON THE MODELS, not on us.

5. AT LEAST TWO MORE SMALL THINGS ARE HAPPENING AT ONCE, and nobody looks at the viewer. (a) A
   DENTAL NURSE in the same blue-grey scrubs is at a low counter behind them, half turned away,
   arranging two more plaster models on a wooden tray; (b) a second patient is seated further
   back on a bench by the wall, reading. Both are SMALLER and FURTHER AWAY, never fainter - the
   same line weight as everyone else.

6. FILL THE ROOM WITH FOUR LARGE SIMPLE THINGS, never many small ones: a long low wooden counter
   along the back wall with a sink and one round potted plant; a wooden bench; a wide window on
   the left whose frame begins BELOW the empty top strip; and a tall narrow cabinet on the far
   right. No posters, no charts, no trays of instruments, no shelves full of small objects.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the light falls on the
   two plaster models held between the women and softens towards the edges. At least five clearly
   different colours: warm off-white wall, light warm wood, blue-grey scrubs, white coat,
   moss-green cardigan, cream plaster, one green plant. Most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; both
women's feet sit close to the bottom edge; the models are at the exact vertical centre of the
picture; the top 17% stays completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets, speech
bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only; anybody
looking at the viewer; a dental chair with a patient lying in it; a dentist sitting on an
operator stool beside a reclined patient; a glowing screen, light box, X-ray or monitor; rows of
instruments, drills, needles, syringes, implant screws, cross-sections or diagrams; a mouth being
treated; missing teeth or damaged teeth shown in a real mouth; three different treatment options
lined up for comparison; before-and-after pairs; calendars, price tags, money, invoices; a
night-time or street-food scene; cartoon teeth with faces; face masks; grey or blue-white walls;
an overall yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even
black outlines.
```

### Ⓒ 一直靠另一邊

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a calm, bright, unhurried
consultation corner in a small neighbourhood dental clinic in the afternoon, WITH THINGS GOING
ON IN IT. The back wall is a soft warm off-white (#e7e4dd) - never grey, never blue-white, never
pure white, never wood-coloured and never dark. The floor and furniture are light warm wood.
NOTHING HERE IS PAINFUL: no drill, no needle, no blood, no open mouth, no dental chair in use,
and nobody is wincing or suffering.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no lamp arm, no shelf, no cable, no sign,
no window frame. Everything else starts below that line.

THE PICTURE IS ABOUT A MAN REALISING SOMETHING HE HAD NEVER NOTICED: he has been chewing on one
side for years, and the dentist is pointing at the OTHER side of the model. His hand happens to
be resting against the cheek he always chews with. Everything else serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE PATIENT IS THE LARGER FIGURE, SEATED ON THE RIGHT, AND HIS EXPRESSION IS "OH - I SEE". A
   man of about sixty-five, upright and healthy-looking - NOT frail, NOT stooped, NOT in pain -
   in a warm ochre polo shirt (#c08a5c). His LEFT HAND RESTS LOOSELY AGAINST HIS OWN LEFT CHEEK,
   fingers relaxed and open so that they DO NOT COVER HIS FACE - the whole face stays visible.
   His head is tipped forward towards the model and his eyebrows are slightly raised. HE IS NOT
   HOLDING HIS JAW IN PAIN, NOT FROWNING, NOT SIGHING.

3. THE PLASTER MODEL BETWEEN THEM CARRIES THE MEANING AND IT IS BIG. One large horseshoe-shaped
   plaster model of a lower arch, EXACTLY THE SHAPE OF THE SHAPE-REFERENCE DRAWING, held up by
   the dentist at chest height between the two of them, tilted towards the patient. THE GAP WHERE
   TWO BACK TEETH ARE MISSING IS ON THE SIDE AWAY FROM THE HAND ON HIS CHEEK, and the dentist's
   index finger rests in that gap. The model is about 30% of the picture height, larger than
   either head. Plaster cream (#efeae1), warmer base (#e3dbcd), grey-brown outlines (#7d766b);
   no grooves, no numbers, no markings.

4. THE DENTIST IS SEATED ON THE LEFT, TURNED TOWARDS HIM. A woman in her thirties or forties,
   one hand holding the model up, the index finger of the other resting in the gap; she looks at
   the model, not at us, and she is calm and matter-of-fact - NOT consoling him, NOT touching
   him. Plain scrubs in muted blue-grey (#b7c5d7, shaded #99a7b8) under AN OPEN WHITE COAT, hair
   (#373f48) tied back, NO FACE MASK.

5. AT LEAST TWO MORE SMALL THINGS ARE HAPPENING AT ONCE, and nobody looks at the viewer. (a) A
   DENTAL NURSE in the same blue-grey scrubs stands at a low counter in the background, half
   turned away, setting a tray down; (b) an open doorway beyond her shows a sliver of corridor
   with someone walking past. Both are SMALLER and FURTHER AWAY, never fainter - the same line
   weight as everyone else.

6. FILL THE ROOM WITH FOUR LARGE SIMPLE THINGS, never many small ones: the small wooden table the
   two of them sit at; a long low counter along the back wall with one round potted plant; two
   simple wooden chairs; and a wide window on the left whose frame begins BELOW the empty top
   strip. No posters, no charts, no trays of instruments, no cabinets full of small objects.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the light pools on the
   model held between them and softens towards the edges. At least five clearly different
   colours: warm off-white wall, light warm wood, blue-grey scrubs, white coat, ochre shirt,
   cream plaster, one green plant. Most colour blocks sit around HSL saturation 30-50 and
   lightness 70-85. Flat fills in two or three steps per colour, no gradients except to describe
   light. NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge and both people's knees sit close to the bottom edge; the top 17% stays completely
empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets, speech
bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only; anybody
looking at the viewer; a hand that covers the face; a pained, wincing, regretful or sighing
expression; a dental chair with a patient lying in it; a dentist sitting on an operator stool
beside a reclined patient; a glowing screen, light box, X-ray or monitor; rows of instruments,
drills, needles, syringes, implant screws, cross-sections or diagrams; a mouth being treated;
missing teeth or damaged teeth shown in a real mouth; three different treatment options lined up
for comparison; before-and-after pairs; calendars, price tags, money, invoices; a night-time or
street-food scene; cartoon teeth with faces; face masks; grey or blue-white walls; an overall
yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even black
outlines.
```

### Ⓓ 陪他來的那一趟

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a calm, bright, unhurried
consultation corner in a small neighbourhood dental clinic in the afternoon, WITH THINGS GOING
ON IN IT. The back wall is a soft warm off-white (#e7e4dd) - never grey, never blue-white, never
pure white, never wood-coloured and never dark. The floor and furniture are light warm wood.
Nothing is being treated: no drill, no needle, no blood, no open mouth, no dental chair in use.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no lamp arm, no shelf, no cable, no sign,
no window frame. Everything else starts below that line.

THE PICTURE IS ABOUT AN OLDER MAN WHO HAS BROUGHT HIS GROWN-UP DAUGHTER ALONG, AND THE THREE OF
THEM ARE WORKING IT OUT TOGETHER. THE FATHER IS THE ONE TALKING. Everything else serves that
one idea. THE THREE PEOPLE READ AS TWO GROUPS ALONG ONE HORIZONTAL BAND: the dentist on the
left, father and daughter together on the right, with a clear gap of table between the groups.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, different hair,
   different build, different clothes - no two figures resemble each other. Fine paper grain over
   the whole image.

2. THE FATHER IS SEATED IN THE MIDDLE OF THE RIGHT-HAND GROUP AND HE IS THE ONE SPEAKING. A man
   of about seventy, upright and healthy-looking - NOT frail, NOT stooped, NOT passive - in a
   warm ochre shirt (#c08a5c), one hand open in front of him mid-sentence, the other resting on
   the table beside the plaster model. He looks at the dentist. HE IS THE LARGEST FIGURE ON THAT
   SIDE and he is clearly in charge of his own visit.

3. THE DAUGHTER STANDS JUST BEHIND HIS CHAIR, LISTENING. A woman of about forty in a soft
   moss-green top (#8a9a72), a shoulder bag still on her arm, ONE HAND RESTING LIGHTLY ON THE
   BACK OF HER FATHER'S CHAIR and the other holding a phone down at her side - she is listening,
   NOT speaking, NOT taking over, NOT holding him. Her head is turned towards the dentist. Her
   full standing height is about 70% of the picture height, the top of her head just below the
   empty top strip.

4. THE PLASTER MODEL ON THE TABLE IS THE OBJECT EVERYONE IS TALKING ABOUT. One large
   horseshoe-shaped plaster model of a lower arch, EXACTLY THE SHAPE OF THE SHAPE-REFERENCE
   DRAWING, lying flat on the table between the groups with A GAP WHERE TWO BACK TEETH ARE
   MISSING, about 25% of the picture height. Plaster cream (#efeae1), warmer base (#e3dbcd),
   grey-brown outlines (#7d766b); no grooves, no numbers, no markings.

5. THE DENTIST IS SEATED ON THE LEFT, LISTENING TO THE FATHER. A woman in her thirties or
   forties, body turned towards them, one hand resting beside the model, chin slightly down - she
   is LISTENING, not lecturing. Plain scrubs in muted blue-grey (#b7c5d7, shaded #99a7b8) under
   AN OPEN WHITE COAT, hair (#373f48) tied back, NO FACE MASK.

6. FILL THE ROOM WITH FOUR LARGE SIMPLE THINGS, never many small ones: the wooden table; a long
   low counter along the back wall with one round potted plant and a stack of paper cups; two
   simple wooden chairs; and a wide window on the left whose frame begins BELOW the empty top
   strip. In the far background a DENTAL NURSE in the same blue-grey scrubs is half turned away
   at the counter, doing something of her own - smaller and further away, never fainter. Nobody
   looks at the viewer. No posters, no charts, no trays of instruments.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the light pools on the
   table and the plaster model and softens towards the edges. At least five clearly different
   colours: warm off-white wall, light warm wood, blue-grey scrubs, white coat, ochre shirt,
   moss-green top, cream plaster, one green plant. Most colour blocks sit around HSL saturation
   30-50 and lightness 70-85. Flat fills in two or three steps per colour, no gradients except to
   describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge, the chairs and the daughter's shoes sit close to the bottom edge; the top 17% stays
completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets, speech
bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only; two
figures who look alike; anybody looking at the viewer; a daughter speaking for her father or
holding him; a frail or passive old man; a dental chair with a patient lying in it; a dentist
sitting on an operator stool beside a reclined patient; a glowing screen, light box, X-ray or
monitor; rows of instruments, drills, needles, syringes, implant screws, cross-sections or
diagrams; a mouth being treated; missing teeth or damaged teeth shown in a real mouth; three
different treatment options lined up for comparison; before-and-after pairs; calendars, price
tags, money, invoices; a night-time or street-food scene; cartoon teeth with faces; face masks;
grey or blue-white walls; an overall yellow or sepia cast; large empty white areas; photorealism;
3D rendering; heavy even black outlines.
```

### Ⓔ 講究的那一雙手

⚠ 這一份**風險最高**（病人沒有位置、逼近器械特寫那條紅線），提示詞裡因此硬性要求
背景有病人正走進來。真的要用，建議先看過再決定要不要繼續走這一條。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: a calm, bright, unhurried
working corner in a small neighbourhood dental clinic in the afternoon, WITH THINGS GOING ON IN
IT. The back wall is a soft warm off-white (#e7e4dd) - never grey, never blue-white, never pure
white, never wood-coloured and never dark. The floor and the workbench are light warm wood. This
is craft, not surgery: no drill, no needle, no blood, no open mouth, no dental chair in use.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no lamp arm, no shelf, no cable, no sign,
no window frame. Everything else starts below that line.

THE PICTURE IS ABOUT A PAIR OF HANDS CHECKING A FINISHED PIECE OF WORK IN GOOD DAYLIGHT, WHILE
THE PERSON IT WAS MADE FOR IS ALREADY ARRIVING. Everything else serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE HANDS AND THE WORK THEY HOLD ARE THE CENTRE OF THE PICTURE. A dentist stands at a wooden
   workbench by a window, holding UP a small finished dental bridge - a short row of a few
   simple ceramic teeth on a plain base, EXACTLY THE SHAPE OF THE TEETH IN THE SHAPE-REFERENCE
   DRAWING but only three or four teeth wide - in both hands at chest height, turning it slightly
   towards the light. Together the two hands and the piece are about 25% of the picture height.
   Cream (#efeae1) with grey-brown outlines (#7d766b); no grooves, no numbers, no markings.

3. THE DENTIST IS STANDING, SLIGHTLY LEFT OF CENTRE, ABSORBED IN THE WORK. A woman in her
   thirties or forties, three-quarters towards us, shoulders relaxed, head tipped down towards
   the piece she is holding; her eyes are ON THE WORK. Plain scrubs in muted blue-grey (#b7c5d7,
   shaded #99a7b8) under AN OPEN WHITE COAT, hair (#373f48) tied back, NO FACE MASK, NO LOUPES,
   NO GLOVES HOLDING INSTRUMENTS.

4. A COLLEAGUE STANDS BESIDE HER AND LOOKS AT THE SAME PIECE. A dental nurse in the same
   blue-grey scrubs, half a step behind, leaning in slightly, one hand resting on the bench, a
   plaster model of a lower arch on the bench in front of her (the shape from the reference
   drawing). She is smaller in the frame but drawn with exactly the same line weight.

5. THE PATIENT IS ARRIVING IN THE BACKGROUND - THIS IS NOT OPTIONAL. On the right, further back
   and smaller, an older man of about sixty-five in a warm ochre shirt (#c08a5c) is stepping in
   through an open doorway, one hand on the door frame, looking towards the bench. He makes the
   picture about a person, not about an object. He is smaller and further away, never fainter -
   the same line weight as everyone else. Nobody looks at the viewer.

6. FILL THE ROOM WITH FOUR LARGE SIMPLE THINGS, never many small ones: the long wooden workbench
   itself; a wide window on the left whose frame begins BELOW the empty top strip, with warm
   daylight slanting in; a low counter behind with one round potted plant and a stack of paper
   cups; and the open doorway on the right. NO tray of instruments, NO rows of tools, NO shelves
   full of small objects, NO posters or charts.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the strongest light falls
   on the piece in her hands and softens towards the edges. At least five clearly different
   colours: warm off-white wall, light warm wood bench and floor, blue-grey scrubs, white coat,
   ochre shirt, cream ceramic and plaster, one green plant. Most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
bench edge and both women's feet sit close to the bottom edge; the piece in her hands is at the
vertical centre; the top 17% stays completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image; panels, frames, insets, speech
bubbles, arrows, small icons; anybody drawn faded, translucent, ghostly or outline-only; anybody
looking at the viewer; a close-up of instruments, drills, needles, syringes, implant screws,
cross-sections or diagrams; a laboratory bench covered in tools; a dental chair with a patient
lying in it; a glowing screen, light box, X-ray or monitor; a mouth being treated; missing teeth
or damaged teeth shown in a real mouth; three different treatment options lined up for
comparison; before-and-after pairs; calendars, price tags, money, invoices; a night-time or
street-food scene; cartoon teeth with faces; face masks; grey or blue-white walls; an overall
yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even black
outlines.
```

---

## 五、選定之後要跑的

1. ~~提示詞~~ ✅ **五份都寫好了（第四節）**，參考圖與用途見第三節。
   選定之後只要把那一份連同四張參考圖一起餵進去。
2. 交件門檻：無彩空白 < 5%、邊緣密度 ≥ 30%、每個人的線相差 < 20 階
   （`drafts/og-measure.mjs`、`og-measure-ink.mjs`）；頂 17% 的 **B 通道實測 ≥ 161**。
3. `node tools/og-resize.mjs drafts/og-topic-prosth-src.jpg prosth`
   → `node tools/og-plate.mjs prosth --blend multiply --tintcolor <算出來的補償色> --ink 0.18 --blur 6 --loc full --locpos stack`
4. 帶子落套色還是深階，做成 LINE 模擬（`node drafts/line-mock.mjs prosth`）讓使用者挑。
   ⚠ `#335b8b` 是冷色 → 依判準先用**紙色字**（暖色底才換純白）。
5. 定案之後才做線稿底圖（姿勢參考從這張裁），大小／濃度／分段／要不要翻轉
   **四個值各自現算，不要抄前四科**。
