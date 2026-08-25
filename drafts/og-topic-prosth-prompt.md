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

## 二之三、第二輪先試兩版（2026-08-25）——Ⓕ 與 Ⓖ 的提示詞

使用者：「你們先試試看，先給我兩版提示詞。」
選的是 **Ⓕ（桌上一杯茶）與 Ⓖ（桌上一張手畫的順序）** —— 兩版是**同一個場景只換桌上那一件東西**，
正好把第二之一節那把「距離尺」的兩格實際試出來，回來就知道要停在哪一格。

**兩版共同的三件（和第一輪五案不同的地方）：**

- **醫師不穿白袍**（刷手服 `#b7c5d7`，距離尺的第二格）。
- **畫面上沒有任何一顆牙、沒有石膏模型、沒有器械、沒有診療椅。**
  診所的線索只留三樣溫和的：木質櫃台上那疊紙杯、候診的長木凳、窗邊的盆栽。
- **視覺中心是兩張臉與他們之間那件小東西**，不是物件。

⚠ 參考圖這一輪**只附風格那三張**（`drafts/style-ref-*.jpg`），
`prosth-model-ref.png` **不要附** —— 附了模型就會被畫進來。

### Ⓕ 都吃些什麼

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: the quiet talking corner of a
small neighbourhood dental clinic in the afternoon, WITH THINGS GOING ON IN IT. This is a
conversation, NOT a treatment and NOT an examination. The back wall is a soft warm off-white
(#e7e4dd) - never grey, never blue-white, never pure white, never wood-coloured and never dark.
The floor and the furniture are light warm wood. THERE IS NOTHING CLINICAL IN THIS PICTURE: no
dental chair, no instruments, no gloves, no plaster models, no teeth of any kind, no X-rays, no
screens, no white coat.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no shelf, no cable, no sign, no window
frame. Everything else starts below that line.

THE PICTURE IS ABOUT AN OLDER MAN TELLING SOMEONE WHAT HE USUALLY EATS, AND SOMEBODY REALLY
LISTENING. Two people sit across a small wooden table; on the table there is only A CUP OF TEA
and AN OPEN NOTEBOOK. THE TWO FACES ARE THE BIGGEST THINGS IN THE PICTURE. Everything else
serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE PATIENT IS ON THE RIGHT AND HE IS IN THE MIDDLE OF A SENTENCE. A man of about sixty-five,
   upright and healthy-looking - NOT frail, NOT stooped, NOT sad, NOT in pain - in a warm ochre
   polo shirt (#c08a5c). BOTH HIS HANDS ARE UP IN A SMALL EVERYDAY GESTURE just above the table,
   as if he is describing something he eats; his mouth is slightly open in mid-speech and he is
   looking at the woman opposite him. He is relaxed, leaning back a little, one elbow near the
   table edge. Seated, he fills about 65% of the picture height from the top of his head down.

3. THE DENTIST IS ON THE LEFT AND SHE IS LISTENING, NOT WRITING. A woman in her thirties or
   forties, leaning in slightly, chin a little down, eyes on him, a faint attentive smile. SHE
   HOLDS A SLIM PEN LOOSELY IN ONE HAND BUT THE PEN IS NOT TOUCHING THE PAPER - she is listening
   first. Her other forearm rests on the table. SHE WEARS PLAIN SCRUBS in muted blue-grey
   (#b7c5d7, shaded #99a7b8) - V-neck, short sleeves, NO WHITE COAT, NO FACE MASK, NO GLOVES,
   NO LANYARD - hair (#373f48) tied back. She looks like a person, not like a specialist.

4. WHAT IS ON THE TABLE - AND NOTHING ELSE. One warm cream cup of tea on a small saucer, sitting
   nearer the man; one open notebook with plain unmarked pages lying in front of the woman.
   THAT IS ALL. NO plaster model, NO teeth, NO instruments, NO phone, NO price list, NO folder,
   NO leaflet. The table is light warm wood and quite small - their hands are close together.

5. AT LEAST TWO MORE SMALL THINGS ARE HAPPENING AT ONCE - this is what makes the picture feel
   alive, and nobody looks at the viewer. (a) A CLINIC ASSISTANT in the same blue-grey scrubs
   stands at the window in the background, half turned away, turning a potted plant round on the
   sill; (b) further back, an older woman waits on a long wooden bench, one bag beside her,
   looking out of the window. Both are SMALLER and FURTHER AWAY, never fainter - the same line
   weight as everyone else.

6. THE ROOM MUST STILL READ AS A CLINIC, WITHOUT ONE SINGLE CLINICAL OBJECT. Do it with FOUR
   LARGE SIMPLE THINGS, large and few: the small wooden table with two simple chairs; a long low
   wooden counter along the back wall carrying A NEAT STACK OF SMALL PAPER CUPS, a lidded jar and
   one round potted plant; a LONG WOODEN WAITING BENCH against the right-hand wall; and a wide
   window on the left whose frame begins BELOW the empty top strip, with warm afternoon light
   slanting in. No posters, no charts, no cabinets full of small objects, no signage.

7. LIGHT AND COLOUR. One warm light source from the window on the left; the light pools on the
   two faces and on the tea cup between them and softens towards the edges. At least five
   clearly different colours: warm off-white wall, light warm wood floor, table and bench,
   blue-grey scrubs, ochre polo shirt, cream tea cup, one green plant. Most colour blocks sit
   around HSL saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour,
   no gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE - if a part of the
   picture has nothing in it, put one of the four large things there instead.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge and both people's knees sit close to the bottom edge; the two heads sit just below the
empty top strip; the top 17% stays completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image; plaster dental models, dental
casts, teeth, toothbrushes, dental instruments, drills, needles, syringes, implant screws,
cross-sections or diagrams; a dental chair; a white coat; a face mask; gloves; a glowing screen,
light box or X-ray; price lists, invoices, calculators, money, calendars; before-and-after pairs;
panels, frames, insets, speech bubbles, arrows, small icons; anybody drawn faded, translucent,
ghostly or outline-only; anybody looking at the viewer; a frail, sad or suffering old man; a
hand covering a face; a night-time or street-food scene; cartoon teeth with faces; grey or
blue-white walls; an overall yellow or sepia cast; large empty white areas; photorealism; 3D
rendering; heavy even black outlines.
```

### Ⓖ 把順序畫在紙上

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: the quiet talking corner of a
small neighbourhood dental clinic in the afternoon, WITH THINGS GOING ON IN IT. This is two
people planning something together, NOT a treatment and NOT an examination. The back wall is a
soft warm off-white (#e7e4dd) - never grey, never blue-white, never pure white, never
wood-coloured and never dark. The floor and furniture are light warm wood. THERE IS NOTHING
CLINICAL IN THIS PICTURE: no dental chair, no instruments, no gloves, no plaster models, no
teeth of any kind, no X-rays, no screens, no white coat.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no lamp, no shelf, no cable, no sign, no window
frame. Everything else starts below that line.

THE PICTURE IS ABOUT SOMEBODY DRAWING THE ORDER OF THINGS ON A SHEET OF PAPER WHILE THE MAN IT
BELONGS TO POINTS AT ONE STEP AND ASKS ABOUT IT. Two people sit across a small wooden table with
ONE LARGE SHEET OF PAPER between them. Everything else serves that one idea.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE SHEET OF PAPER IS THE THING BETWEEN THEM, AND WHAT IS DRAWN ON IT IS EXTREMELY SIMPLE.
   One large sheet of WARM CREAM paper (#f3ece0, never bright white) lying flat on the table,
   tilted slightly towards the viewer, about a quarter of the picture width. On it, DRAWN IN PEN
   BY HAND: FOUR OR FIVE BIG EMPTY ROUNDED SQUARES IN A ROW, JOINED BY ONE SIMPLE LINE - like the
   steps of a plan. THE SQUARES ARE COMPLETELY EMPTY: no writing, no letters, no numbers, no
   symbols, no ticks, no shading inside them. Nothing else is drawn on the paper - no tables, no
   grids, no columns of figures, no tooth shapes, no charts.

3. THE DENTIST IS ON THE LEFT, DRAWING THE LAST SQUARE. A woman in her thirties or forties
   leaning over the paper, PEN TIP TOUCHING THE FAR END OF THE ROW, her other palm flat on the
   table. She glances up at the man as she draws. SHE WEARS PLAIN SCRUBS in muted blue-grey
   (#b7c5d7, shaded #99a7b8) - V-neck, short sleeves, NO WHITE COAT, NO FACE MASK, NO GLOVES,
   NO LANYARD - hair (#373f48) tied back. She looks like a person, not like a specialist.

4. THE PATIENT IS ON THE RIGHT AND HE IS ASKING ABOUT ONE OF THE STEPS. A man of about
   sixty-five, upright and healthy-looking - NOT frail, NOT stooped, NOT sad - in a warm ochre
   polo shirt (#c08a5c), body tipped forward, ONE INDEX FINGER RESTING ON ONE OF THE SQUARES IN
   THE MIDDLE OF THE ROW, his other hand on the table, eyebrows slightly raised, mouth slightly
   open in mid-question. He looks at the paper. Seated, he fills about 65% of the picture height
   from the top of his head down.

5. AT LEAST TWO MORE SMALL THINGS ARE HAPPENING AT ONCE - this is what makes the picture feel
   alive, and nobody looks at the viewer. (a) A CLINIC ASSISTANT in the same blue-grey scrubs
   stands at the back counter, half turned away, setting two paper cups down; (b) further back,
   an older woman waits on a long wooden bench, looking out of the window. Both are SMALLER and
   FURTHER AWAY, never fainter - the same line weight as everyone else.

6. THE ROOM MUST STILL READ AS A CLINIC, WITHOUT ONE SINGLE CLINICAL OBJECT. Do it with FOUR
   LARGE SIMPLE THINGS, large and few: the small wooden table with two simple chairs; a long low
   wooden counter along the back wall carrying A NEAT STACK OF SMALL PAPER CUPS, a lidded jar and
   one round potted plant; a LONG WOODEN WAITING BENCH against the right-hand wall; and a wide
   window on the left whose frame begins BELOW the empty top strip, with warm afternoon light
   slanting in. No posters, no charts, no cabinets full of small objects, no signage.

7. LIGHT AND COLOUR. One warm light source from the window on the left; THE LIGHT FALLS ACROSS
   THE PAPER so that the sheet is warm cream and softly coloured, NEVER a flat white rectangle.
   At least five clearly different colours: warm off-white wall, light warm wood floor, table and
   bench, blue-grey scrubs, ochre polo shirt, cream paper, one green plant. Most colour blocks sit
   around HSL saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour,
   no gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE - if a part of the
   picture has nothing in it, put one of the four large things there instead.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge and both people's knees sit close to the bottom edge; the row of squares runs
horizontally across the middle of the picture; the top 17% stays completely empty.

AVOID: any text, letters, numbers or logos anywhere in the image, including on the paper;
anything written or printed inside the squares; tables, grids, forms, charts, columns of figures;
plaster dental models, dental casts, teeth, toothbrushes, dental instruments, drills, needles,
syringes, implant screws, cross-sections or diagrams; a dental chair; a white coat; a face mask;
gloves; a glowing screen, light box or X-ray; price lists, invoices, calculators, money,
calendars; before-and-after pairs; panels, frames, insets, speech bubbles, arrows, small icons;
anybody drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; a
frail, sad or suffering old man; a night-time or street-food scene; cartoon teeth with faces;
grey or blue-white walls; an overall yellow or sepia cast; large empty white areas; photorealism;
3D rendering; heavy even black outlines.
```

⚠ **兩版回來之後要先量的三件**（不是先看好不好看）：
無彩空白 < 5%（Ⓖ 那張紙最容易踩）、邊緣密度 ≥ 30%、頂 17% 的 B 通道 ≥ 161。

## 二之四、第三輪：方向確認 ＋ 兩條規則被使用者推翻（2026-08-25）

使用者看過 Ⓕ／Ⓖ 兩張之後：

> 「我有一點頭緒了，就是**醫師在跟病患解說順序或流程**，我覺得這個不錯。不過你這個
> 　順序流程圖**是放在桌上，其實不是很清楚**……比如說**有箭頭啊、或是有數字的概念**，
> 　這樣比較知道**有流的感覺**，像一般經營管理的 PDCA，一個步驟一個步驟、
> 　**甚至循環回來**……另外一個很重要的重點：做假牙的**有可能高齡也可能不是**，
> 　但**通常都是因為自己難以做決定**，我覺得可以加入**家人陪伴一起來了解**，
> 　有一種**恍然大悟**、或是一邊聽一邊**覺得很有道理、同意**的表情……
> 　另外也可以是：**吃飯不方便嘛**，所以可以做『牙齒做完之後**全家人高高興興吃飯**』，
> 　**飯桌上的東西不會只有粥、軟爛的食物**，會是**比較正常人**的，有魚有肉、
> 　可能有帶骨的、或蝦子海鮮，要像**一般家常**的樣子，甚至可以是家人**正在把剛煮好的
> 　飯菜端出來**。不過現在都是**小家庭**，所以不見得要放那麼多人。」

**方向確認**：`Ⓖ 講流程` 這條路是對的（Ⓕ 的「一杯茶」那一格沒有被選）。

### ⚠⚠ 兩條硬規格被使用者指定推翻（都是有條件的）

1. **箭頭與數字**（ILLUSTRATION.md 第十一節硬規格 6：「不放泡泡、不放放大圈、
   不放小圖示、**不放箭頭**」＋ 第 7 條「圖上不放任何字」）。
   ⚠ **推翻的條件和顯微根管那個放大圈一樣：要大、要少。**
   限度寫死：**四個大圓 ＋ 只有 1 2 3 4 這四個數字 ＋ 粗箭頭 ＋ 一條繞回來的弧**，
   除此之外一個字、一個符號都不准。形狀直接給參考圖
   **`drafts/prosth-flow-ref.png`**（第十之一節：形狀不要用文字描述）。
2. **牆上的圖表**（第十一節那份 AVOID 有 `posters or charts on the wall`）。
   那一條擋的是**背景雜訊**；這裡的流程圖是**主體**，而且必須立起來正對讀者
   —— 平放在桌上會被透視壓扁（Ⓖ 那一版實測就是這個問題）。

### 這一輪確定下來的三件

- **病人不要畫太老**：使用者說「有可能高齡也可能不是」→ 定 **六十歲上下**，
  和第一輪的六十五歲拉開，也避免七科的長輩看起來都同一個人。
- **家人一定要在場**，而且是**一起了解**、不是代為決定（同第一輪 Ⓓ 那條：
  長輩仍然是主導的那一個）。表情是**恍然大悟／點頭同意**。
- **吃飯那一版的紅線是「食物」**：不准粥、不准軟爛、不准流質、不准嬰兒食物 ——
  要**魚、帶骨的肉、蝦、青菜、白飯**。⚠ 但**不要畫成大口啃骨頭**（誇張的動作會變成
  療效宣稱），重點在**那一桌菜是正常的**，不在他咬得多用力。

## 二之五、第三輪的兩份提示詞（2026-08-25）

### Ⓙ 一步一步，還會繞回來（流程圖立起來 ＋ 家人陪伴）

⚠ 這一版要附 **`drafts/prosth-flow-ref.png`**（流程圖的形狀）＋ 風格那三張。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: the quiet talking corner of a
small neighbourhood dental clinic in the afternoon, WITH THINGS GOING ON IN IT. This is an
explanation, NOT a treatment and NOT an examination. The back wall is a soft warm off-white
(#e7e4dd) - never grey, never blue-white, never pure white, never wood-coloured and never dark.
The floor and furniture are light warm wood. THERE IS NOTHING CLINICAL IN THIS PICTURE: no
dental chair, no instruments, no gloves, no plaster models, no teeth of any kind, no X-rays, no
screens, no white coat.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no board, no lamp, no shelf, no cable, no sign.
Everything else starts below that line.

THE PICTURE IS ABOUT A DENTIST EXPLAINING THE ORDER OF THE STEPS ON A BIG BOARD, AND A MAN AND
HIS DAUGHTER BOTH GETTING IT AT THE SAME TIME. Everything else serves that one idea.

THE EIGHT THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. THE BOARD IS THE CENTRE OF THE PICTURE AND IT FACES US SQUARELY. A large flat board in a
   simple light wooden frame, STANDING UPRIGHT on a plain wooden easel against the back wall,
   turned straight towards the viewer so nothing on it is foreshortened. It is about 45% of the
   picture height and its top edge stays BELOW the empty top strip. ON THE BOARD, DRAWN BY HAND
   IN DARK INK ON WARM CREAM PAPER (#f3ece0), EXACTLY LIKE THE SHAPE-REFERENCE DRAWING: FOUR BIG
   OPEN CIRCLES IN A ROW, each holding ONE LARGE HANDWRITTEN NUMERAL - 1, 2, 3 and 4 - JOINED BY
   THREE THICK ARROWS pointing right, and ONE LONG CURVED ARROW SWEEPING BACK UNDERNEATH FROM
   THE FOURTH CIRCLE TO THE FIRST. THE CIRCLES, THE NUMERALS AND THE ARROWS ARE BIG AND FEW AND
   THEY MUST BE READABLE AT THUMBNAIL SIZE. THERE IS NOTHING ELSE ON THE BOARD AT ALL: no words,
   no letters, no other numbers, no dates, no prices, no tooth shapes, no small marks, no
   handwriting of any kind besides those four numerals.

3. THE DENTIST STANDS AT THE LEFT OF THE BOARD, EXPLAINING. A woman in her thirties or forties,
   standing beside the easel and turned three-quarters towards the family, ONE OPEN HAND RESTING
   BESIDE THE SECOND CIRCLE (an open palm, not a pointing stick), her other arm relaxed at her
   side. She is speaking calmly and looking at the two of them, not at us. SHE WEARS PLAIN SCRUBS
   in muted blue-grey (#b7c5d7, shaded #99a7b8) - V-neck, short sleeves, NO WHITE COAT, NO FACE
   MASK, NO GLOVES, NO LANYARD - hair (#373f48) tied back. She looks like a person, not like a
   specialist.

4. THE PATIENT SITS ON THE RIGHT AND HE HAS JUST UNDERSTOOD SOMETHING. A man of about SIXTY -
   ordinary, upright and healthy-looking, NOT frail, NOT stooped, NOT sad - in a warm ochre polo
   shirt (#c08a5c), sitting on a simple wooden chair turned towards the board, body tipped
   forward, forearms on his knees, EYEBROWS RAISED AND CHIN LIFTED IN A SMALL NOD, mouth slightly
   open as if he has just said "ah - I see". HIS EYES ARE ON THE BOARD.

5. HIS DAUGHTER STANDS JUST BEHIND HIS CHAIR AND SHE AGREES. A woman of about thirty-five in a
   soft moss-green top (#8a9a72), a shoulder bag still on her arm, ONE HAND RESTING LIGHTLY ON
   THE BACK OF HIS CHAIR, head tilted slightly, NODDING - she is following the same explanation,
   NOT speaking for him, NOT taking over, NOT anxious. Father and daughter read as ONE GROUP on
   the right; the dentist and the board are the group on the left.

6. ONE MORE SMALL THING IS HAPPENING AT THE SAME TIME, and nobody looks at the viewer: a CLINIC
   ASSISTANT in the same blue-grey scrubs is at the back counter, half turned away, setting two
   paper cups down. She is SMALLER and FURTHER AWAY, never fainter - the same line weight as
   everyone else.

7. THE ROOM MUST STILL READ AS A CLINIC, WITHOUT ONE SINGLE CLINICAL OBJECT. Do it with FOUR
   LARGE SIMPLE THINGS, large and few: the easel and board; two simple wooden chairs; a long low
   wooden counter along the back wall carrying A NEAT STACK OF SMALL PAPER CUPS, a lidded jar and
   one round potted plant; and a wide window on the left whose frame begins BELOW the empty top
   strip, with warm afternoon light slanting in. No posters, no charts on the walls, no cabinets
   full of small objects, no signage.

8. LIGHT AND COLOUR. One warm light source from the window on the left; the light falls across
   the board so the cream paper is warm and softly coloured, NEVER a flat white rectangle. At
   least five clearly different colours: warm off-white wall, light warm wood floor, easel and
   counter, blue-grey scrubs, ochre polo shirt, moss-green top, cream board, one green plant.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
chair legs, the easel feet and the daughter's shoes sit close to the bottom edge; the row of four
circles runs across the middle of the picture; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the four
numerals 1 2 3 4 inside the circles; dates, prices, percentages, tables, grids, forms, charts,
columns of figures; plaster dental models, dental casts, teeth, toothbrushes, dental instruments,
drills, needles, syringes, implant screws, cross-sections or diagrams; a dental chair; a white
coat; a face mask; gloves; a glowing screen, light box or X-ray; a pointer stick or laser
pointer; before-and-after pairs; calendars; panels, frames, insets, speech bubbles, small icons;
anybody drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; a frail
or passive old man; a daughter speaking for her father; a lecture-hall or classroom feeling; a
night-time or street-food scene; cartoon teeth with faces; grey or blue-white walls; an overall
yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even black
outlines.
```

### Ⓚ 做完之後，那一桌菜（全家吃飯・食物是主角）

⚠ 這一版**只附風格那三張**參考圖，流程圖那張不要附。
⚠ 它離「一眼認出是芳仁」最遠（畫面上沒有診所），所以窗外留了一角**老街屋的屋簷**
當在地線索 —— 呼應一般牙科那張的巷弄，但不畫街景本身。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: an ordinary family lunch at
home in a small Taiwanese town, in the middle of the day, warm and cheerful and completely
undramatic. The wall behind is a soft warm off-white (#e7e4dd) - never grey, never blue-white,
never pure white and never dark. The floor and furniture are light warm wood. THIS IS NOT A
CLINIC: no dentist, no scrubs, no white coat, no clinical object of any kind, and NOT ONE TOOTH
anywhere in the picture.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
warm off-white wall only - no head, no hand, no hanging lamp, no shelf, no picture frame, no
window frame. Everything else starts below that line.

THE PICTURE IS ABOUT A NORMAL MEAL: THREE PEOPLE AT A TABLE THAT IS PROPERLY LOADED WITH REAL
FOOD, AND SOMEONE BRINGING ONE MORE DISH IN FROM THE KITCHEN. Everything else serves that one
idea. THE FOOD ON THE TABLE IS THE SECOND MAIN CHARACTER - it must be unmistakably ordinary
family cooking, not invalid food.

THE EIGHT THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. WHAT IS ON THE TABLE - DRAW ALL FIVE, LARGE AND CLEARLY SEPARATE. A WHOLE STEAMED FISH on an
   oval plate; a plate of BRAISED MEAT ON THE BONE (short ribs or chicken pieces, the bones
   clearly visible); a plate of WHOLE PRAWNS with their shells and tails on; a plate of GREEN
   LEAFY VEGETABLES; and INDIVIDUAL BOWLS OF WHITE RICE in front of each person, with chopsticks.
   Two or three small wisps of steam rise from the dishes. THIS IS ORDINARY FOOD FOR PEOPLE WHO
   CAN CHEW PROPERLY. THERE IS ABSOLUTELY NO porridge, no congee, no rice soup, no plain broth,
   no mashed, blended, minced or pureed food, no soft invalid food of any kind, and no medicine
   on the table.

3. THE OLDER MAN SITS AT THE FAR SIDE OF THE TABLE, EATING NORMALLY AND ENJOYING IT. A man of
   about SIXTY-FIVE - ordinary, upright, healthy-looking, NOT frail - in a soft blue-grey shirt,
   holding his chopsticks and JUST LIFTING A PIECE OF FISH FROM THE PLATE, smiling with his mouth
   closed, eyes on the food. HE IS RELAXED AND UNREMARKABLE - he is NOT being watched, NOT being
   helped, NOT showing anybody anything, NOT biting hard into a bone, NOT making a big gesture.

4. A WOMAN OF ABOUT THIRTY-FIVE IS BRINGING IN ONE MORE DISH FROM THE KITCHEN. She walks in from
   the right in a moss-green top (#8a9a72), an oven cloth over one shoulder, CARRYING A SHALLOW
   DISH OF FRESHLY COOKED FOOD IN BOTH HANDS with steam curling off it, leaning slightly forward
   as she sets it down. She is mid-step, clearly moving.

5. A THIRD PERSON SITS AT THE NEAR LEFT WITH HIS BACK THREE-QUARTERS TO US. A man of about forty
   in a warm ochre shirt (#c08a5c), seated at the corner of the table, one hand holding his rice
   bowl, turning to say something to the older man. WE SEE HIM MOSTLY FROM BEHIND AND TO THE
   SIDE, so he frames the table without hiding it. THIS IS A SMALL FAMILY: exactly three people
   at the table, nobody else.

6. NOBODY LOOKS AT THE VIEWER AND NOBODY IS POSING. There is no toast, no raised glasses, no
   celebration, no birthday, no camera moment - it is just lunch, and it is a good one.

7. THE HOME AROUND THEM: FOUR LARGE SIMPLE THINGS, large and few. The wooden dining table itself,
   seen slightly from above so the whole spread of dishes is visible; three simple wooden chairs;
   a low wooden sideboard along the back wall with a teapot and one round potted plant; and A
   WIDE WINDOW on the left whose frame begins BELOW the empty top strip - THROUGH IT, SMALL AND
   QUIET IN THE DISTANCE, THE TILED EAVES AND PARAPET OF AN OLD TOWN SHOPHOUSE ACROSS THE LANE.
   No television, no clutter, no posters, no framed photographs on the wall.

8. LIGHT AND COLOUR. One warm light source: midday daylight through the window on the left,
   pooling on the dishes in the middle of the table and softening towards the edges. At least
   five clearly different colours: warm off-white wall, light warm wood floor and table,
   moss-green top, ochre shirt, blue-grey shirt, the food itself (cream fish, warm brown braised
   meat, coral prawns, green vegetables), one green plant. Most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
table edge and the chairs sit close to the bottom edge; the loaded table runs across the middle
of the picture; the three heads sit just below the empty top strip; the top 17% stays completely
empty.

AVOID: any text, letters, numbers or logos anywhere in the image; porridge, congee, rice soup,
broth, mashed, blended, minced or pureed food, soft invalid food, medicine, pill bottles;
dentures, teeth, toothbrushes, dental instruments, a dentist, scrubs, a white coat, a clinic, a
hospital; before-and-after pairs; anybody biting hard into a bone or opening their mouth wide;
raised glasses, toasting, a birthday cake, party decorations; anybody looking at the viewer or
posing for a photograph; panels, frames, insets, speech bubbles, arrows, small icons; anybody
drawn faded, translucent, ghostly or outline-only; a frail or bedridden old person; a crowded
table with more than three diners; a night-time or street-food scene; grey or blue-white walls;
an overall yellow or sepia cast; large empty white areas; photorealism; 3D rendering; heavy even
black outlines.
```

⚠ 兩版回來先量三件：無彩空白 < 5%、邊緣密度 ≥ 30%、頂 17% 的 B 通道 ≥ 161。
⚠ Ⓙ 另外要單獨檢查一件：**板子上有沒有長出 1234 以外的字**（模型最愛在這裡加東西）。

## 二之六、第四輪：走流程圖，但四件要修（2026-08-25）

使用者看過 Ⓙ／Ⓚ 之後：

> 「我們**走流程圖的概念**好了。首先，**病患和家人人數有點少，圖片上只有老人家**，
> 　診所的受眾不只這樣。另外，**流程圖太簡陋**，我放幾個參考〔PDCA 與流程圖的搜尋截圖〕。
> 　**診所環境有點黃昏簡陋感**。另外**要套植牙假牙標籤主題色**。」

**方向定了：Ⓙ 那條路（醫師對著立起來的板子解說 ＋ 家人陪著聽）。** 吃飯那版沒有被選。
四件要修：

1. ⚠⚠ **卡司的年齡要展開，不能整張都是老人。**
   植牙假牙的受眾**不等於長輩** —— 病人改成 **五十歲上下**，陪的人是**同齡的太太**，
   候診區另外坐著**一位七十幾的長輩**與**一位三十幾的上班族**。
   六個人、三組，年齡從二十幾（助理）到七十幾都有。
   ⚠ 這和第十一節硬規格 4 不衝突：判準從來不是人數，是**分成 2~3 組、排成一條橫帶、
   有一個亮的落點**。
2. ⚠⚠ **流程圖要「像一張真的流程圖」**：色塊、粗箭頭、白數字、看得出有「流」。
   形狀給兩張參考圖讓使用者選（第十之一節：形狀不要用文字描述）：
   **`drafts/prosth-flow-ref-linear.png`**（橫向四格 ＋ 繞回第 2 格的弧）與
   **`drafts/prosth-flow-ref-cycle.png`**（他給的 PDCA 那一種，四段粗弧箭頭圍成環）。
   ⚠ 上一版那四個空心圓細線就是「簡陋」的成因：**沒有色塊、線太細**。
   ⚠ 但仍然**只有 1 2 3 4，沒有任何文字** —— 療程分幾階段還沒問到診所（`ask`），
   寫上去就是編的。
3. ⚠⚠ **「黃昏簡陋感」有兩個成因，要分開治**：
   ・**光**：上一版提示詞寫的是 `warm afternoon light slanting in`，模型畫成低角度的
     橘光 ＝ 黃昏。改成**明亮的上午日光**，並在 AVOID 點名 dusk／golden hour／
     orange cast／長影子。
   ・**空**：大片沒有東西的牆＝簡陋（同第十一之一節第 3 條：**「背景簡單」不等於
     「畫面空」**）。解法不是加很多小東西，是**元素仍然少而大、但要填滿畫面**：
     整面木格柵層板牆、一株大的垂墜植物、長木凳、櫃台。
4. ⚠⚠ **主題色要出現在畫面上**（`#335b8b`，站上那顆標籤的顏色）。
   放三處：**流程圖的色塊**（主場）、**長木凳的坐墊**、**櫃台下方的門片**，
   合計不超過畫面的 15%。⚠ **刷手服仍然是量出來的淡階 `#b7c5d7`**，
   那是全站七科共用的規則（第十之三節），不要為了「套主題色」把它改深。
   ⚠ 頂 17% 那面牆仍然要淺（B ≥ 161），主題色不可以爬進安靜區。

## 二之七、第四輪的兩份提示詞（差別只在板子上那張圖）

⚠ 兩版都要附 **對應的那一張流程圖參考** ＋ 風格那三張（`drafts/style-ref-*.jpg`）。
⚠ 牙模那張**不要附**。

### Ⓛ 橫向流程（四格 ＋ 繞回來的弧）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE MOOD OF THE WHOLE IMAGE - READ THIS BEFORE DRAWING ANYTHING: the consultation corner of a
small, WELL-KEPT, BUSY neighbourhood dental clinic in the BRIGHT LATE MORNING. The light is
clear, even, daylight-white - NOT dusk, NOT golden hour, NOT orange, no long dramatic shadows,
no dim corners. The room is warm but tidy and modern: light warm wood, a soft warm off-white
wall (#e7e4dd), and it is FULL - there is no bare empty wall anywhere. This is an explanation,
NOT a treatment: no dental chair, no instruments, no gloves, no plaster models, no teeth of any
kind, no X-rays, no screens, no white coat.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm off-white wall only - no head, no board, no lamp, no shelf, no plant, no sign. It must
stay PALE; no dark or strongly coloured object may enter it. Everything else starts below.

THE PICTURE IS ABOUT A DENTIST EXPLAINING THE ORDER OF THE STEPS ON A BIG BOARD, AND A COUPLE
IN THEIR FIFTIES BOTH GETTING IT AT THE SAME TIME, IN A CLINIC WHERE OTHER PEOPLE OF ALL AGES
ARE WAITING. Everything else serves that one idea.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. Fine paper grain over the whole image.

2. THE BOARD IS THE CENTRE OF THE PICTURE AND IT FACES US SQUARELY. A large board in a simple
   light wooden frame, STANDING UPRIGHT on a wooden easel, turned straight towards the viewer so
   nothing on it is foreshortened. It is about 45% of the picture height; its top edge stays
   BELOW the empty top strip. ON THE BOARD, EXACTLY LIKE THE SHAPE-REFERENCE DIAGRAM: FOUR BIG
   SOLID ROUNDED RECTANGLES IN A ROW, FILLED IN FOUR STEPS OF THE SAME BLUE - #7d9cc0, #5f83ab,
   #476e97 and #335b8b from left to right - each outlined in dark navy (#182f4b) and each
   carrying ONE LARGE WHITE NUMERAL: 1, 2, 3, 4. THREE THICK NAVY ARROWS point right between
   them, and ONE THICK CURVED NAVY ARROW sweeps back underneath from the fourth box to the
   second. The boxes, numerals and arrows are BIG, SOLID AND FEW so they read at thumbnail size.
   THERE IS NOTHING ELSE ON THE BOARD AT ALL: no words, no letters, no other numbers, no dates,
   no prices, no tooth shapes, no small marks, no handwriting besides those four numerals.

3. THE DENTIST STANDS AT THE LEFT OF THE BOARD, EXPLAINING. A woman in her thirties, standing
   beside the easel, turned three-quarters towards the couple, ONE OPEN PALM RESTING BESIDE THE
   SECOND BOX, her other arm relaxed. She speaks calmly and looks at them, not at us. SHE WEARS
   PLAIN SCRUBS in muted blue-grey (#b7c5d7, shaded #99a7b8) - V-neck, short sleeves, NO WHITE
   COAT, NO FACE MASK, NO GLOVES - hair (#373f48) tied back. She looks like a person, not like a
   specialist.

4. THE PATIENT SITS ON THE RIGHT AND HE HAS JUST UNDERSTOOD SOMETHING. A man of about FIFTY -
   middle-aged, NOT elderly, dark hair with a little grey, ordinary and healthy-looking - in a
   warm ochre polo shirt (#c08a5c), on a simple wooden chair turned towards the board, tipped
   forward, forearms on his knees, EYEBROWS RAISED AND CHIN LIFTED IN A SMALL NOD, mouth slightly
   open as if he has just said "ah - I see". HIS EYES ARE ON THE BOARD.

5. HIS WIFE STANDS JUST BEHIND HIS CHAIR AND SHE AGREES. A woman of about forty-eight in a soft
   moss-green top (#8a9a72), bag still on her arm, ONE HAND LIGHTLY ON THE BACK OF HIS CHAIR,
   head tilted, NODDING - following the same explanation, NOT speaking for him, NOT anxious.
   Husband and wife read as ONE GROUP on the right.

6. THE CLINIC IS BUSY AND THE PEOPLE IN IT ARE OF ALL AGES - THIS MATTERS. Behind them, along
   the back of the room: A LONG WOODEN BENCH with TWO PEOPLE WAITING AT ITS TWO ENDS - at one
   end A MAN IN HIS SEVENTIES with white hair, hands on his knees, looking out of the window; at
   the other end A WOMAN IN HER EARLY THIRTIES in a plain shirt, looking down at a book. Further
   back, A CLINIC ASSISTANT IN HER TWENTIES in the same blue-grey scrubs is at the counter, half
   turned away, setting paper cups down. All three are SMALLER and FURTHER AWAY, never fainter -
   the same line weight as everyone else. NOBODY LOOKS AT THE VIEWER. Nobody is old and frail;
   nobody is being helped to walk.

7. THE ROOM IS FULL, WITH FEW BUT LARGE THINGS - NO BARE WALLS ANYWHERE. Use: the easel and
   board; the long wooden bench WITH A DEEP BLUE SEAT CUSHION (#335b8b); a long low wooden
   counter whose lower cupboard doors are the SAME DEEP BLUE (#335b8b), carrying a neat stack of
   paper cups, a lidded jar and one round potted plant; A FULL-HEIGHT SLATTED WOOD PANEL WALL
   behind the bench (vertical wooden battens, warm and evenly textured); ONE LARGE TRAILING
   PLANT on a high shelf at the right, its leaves hanging down; and a wide window on the left
   whose frame begins BELOW the empty top strip. No posters, no charts on the walls, no signage,
   no cabinets full of small objects.

8. COLOUR - THE CLINIC'S BLUE MUST BE VISIBLE. The deep blue #335b8b appears in exactly three
   places: the boxes on the board, the bench cushion, and the counter doors - together no more
   than about 15% of the picture. Everything else stays warm: light wood floor, walls, ochre
   shirt, moss-green top, blue-grey scrubs, green plants. At least six clearly different colours
   in the picture; most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat
   fills in two or three steps per colour, no gradients except to describe light.

9. LIGHT. Clear bright daylight from the window on the left, spread EVENLY through the room; a
   gentle pool of light on the board and on the couple. No orange cast, no sunset, no heavy
   shadows, no dark corners, NO LARGE FLAT EMPTY AREAS ANYWHERE.

COMPOSITION ANCHORS: everything that must be read sits inside the middle 73% of the width; the
easel feet, the chair legs and the wife's shoes sit close to the bottom edge; the row of four
boxes runs across the middle of the picture; the top 17% stays completely empty and pale.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the four
numerals 1 2 3 4 in the boxes; dates, prices, percentages, tables, grids, forms, charts, columns
of figures; plaster dental models, dental casts, teeth, toothbrushes, dental instruments, drills,
needles, syringes, implant screws, cross-sections or diagrams; a dental chair; a white coat; a
face mask; gloves; a glowing screen, light box or X-ray; a pointer stick; before-and-after pairs;
calendars; panels, frames, insets, speech bubbles, small icons; anybody drawn faded, translucent,
ghostly or outline-only; anybody looking at the viewer; a cast of only elderly people; a frail or
stooped patient; a classroom or lecture-hall feeling; dusk, sunset, golden hour, an orange or
sepia cast, long dramatic shadows, dim corners; bare empty walls; a sparse half-furnished room;
grey or blue-white walls; large empty white areas; photorealism; 3D rendering; heavy even black
outlines.
```

### Ⓜ 環形循環（他給的 PDCA 那一種）

⚠ 和 Ⓛ **逐字相同，只有第 2 點換掉**（板子上的圖形），其餘八點與 AVOID 一模一樣。

第 2 點換成：

```
2. THE BOARD IS THE CENTRE OF THE PICTURE AND IT FACES US SQUARELY. A large board in a simple
   light wooden frame, STANDING UPRIGHT on a wooden easel, turned straight towards the viewer so
   nothing on it is foreshortened. It is about 45% of the picture height; its top edge stays
   BELOW the empty top strip. ON THE BOARD, EXACTLY LIKE THE SHAPE-REFERENCE DIAGRAM: FOUR THICK
   CURVED ARROWS ARRANGED IN ONE BIG RING, each arrow a quarter of the circle, all running
   clockwise, with a clear gap between the tail of one and the head of the next, and AN EMPTY
   CENTRE. The four arrows are FILLED IN FOUR STEPS OF THE SAME BLUE - #7d9cc0, #5f83ab, #476e97
   and #335b8b clockwise from the top - each outlined in dark navy (#182f4b) and each carrying
   ONE LARGE WHITE NUMERAL: 1, 2, 3, 4. The ring nearly fills the board. THERE IS NOTHING ELSE
   ON THE BOARD AT ALL: no words, no letters, no other numbers, no dates, no prices, no tooth
   shapes, no small marks, nothing written in the empty centre.
```

⚠ 若要一份可以整段複製的 Ⓜ，就把 Ⓛ 的第 2 點整段換成上面這一段，其餘不動；
`COMPOSITION ANCHORS` 那行的「the row of four boxes runs across the middle」
改成「the ring sits at the centre of the board」。


## 二之八、⚠⚠ 使用者給了臨床的四個階段（2026-08-25）——這同時是 `ask` 第一條的答案

> 「以治療來說，**第一階段是去除感染**，包括去除蛀牙、牙結石，或是根管治療。
> 　**第二階段通常是移除慢性感染＋手術**，比如牙周手術、複雜根管治療、根尖手術、植牙之類的。
> 　**第三階段是重建**，包括假牙、矯正。**第四階段是維護**，維護如果發現問題就再評估
> 　進入哪一個階段。一般來說，第一次四個階段做完，是希望**就不要再進入前幾個階段**，
> 　做到好、病患自己會維護，但大部分情況其實蠻難的。比較常的狀況是：**哪些部分第一次
> 　無法處理，但知道以後大概多久會出問題，也預判出問題要怎麼處理，儘量不要大幅度
> 　打掉重來**（但很偶爾難免）。所以流程圖我覺得**不是真的循環**，
> 　不然病患會以為怎麼沒有終點。」

⚠⚠ **這一段是診所事實，不是我們推的** —— 它正好回答了 `tools/topic-copy.mjs` 裡
`prosth.ask` 的第一條（「療程實際上會分成哪幾個階段」）。
**要不要把它補進著陸頁的 `flow`，是另一個決定，要問過使用者**（那一頁 2026-08-21
九輪定稿，CLAUDE.md 第九節寫著「不要再重寫這一頁」，補一行是補、不是重寫）。
⚠ 目前**先只用在圖上**，而且圖上仍然**不寫階段名**（250px 下中文一定糊）。

### 這一段話對圖的三個硬性後果

1. ⚠⚠ **不可以畫成閉合的循環。** 上一輪那個環形（`prosth-flow-ref-cycle.png`）
   因此**出局** —— 使用者的理由是「病患會以為怎麼沒有終點」。
2. ⚠⚠ **第四段要看起來像「到了」**，不是第四個一樣大的節點。維護是**停留的狀態**，
   所以它在圖上要比前三段**長／寬／或高出一截**（一個平台、一條帶子），不是一個等大的圓。
3. ⚠⚠ **回頭的那條線要指回「第二段」，不是第一段，而且要畫得比主線輕。**
   這是把他那句「**儘量不要大幅度打掉重來**」直接畫進去：
   ・指回第 2 ＝ 通常是局部再處理，不是從頭來過；
   ・虛線、細、淡 ＝ 例外不是常態（實線同粗細會讀成「一定會回去」）。
   ⚠ 也不能整條拿掉 —— 拿掉就變成「一次做完永遠不會有事」，那是空白支票
   （COPY.md 第九之十七節 C）。**留著、但畫輕**，剛好等於他說的那句實話。

### 四個骨架（對照圖 `drafts/prosth-flow-shapes.png`）

| | 商管／人資的語彙 | 終點感 | 250px | 判斷 |
| --- | --- | --- | --- | --- |
| **A 階梯 → 平台** | 成長階梯、職涯階梯 | ✅ 最強（走上去就待在平台上） | ✅ 四塊大色塊往右上，最好讀的形狀之一 | **推薦** |
| B 路線圖 | roadmap、里程碑 | ✅ 終點是雙圈 | ⚠ 路徑的彎與圓點在縮圖下會糊成一條帶 | 備案 |
| C 階段閘門 | stage-gate（每關確認過才往下） | ○ 尾巴是延伸的帶子 | ❌ 菱形在 250px 下會消失，變成四個方塊 | 不建議 |
| D 疊起來 | 金字塔、地基→上蓋 | ○ 蓋完就在那裡 | ✅ 好讀 | 值得考慮（見下） |

**推薦 A 的三個理由：**

- **它自己就有終點**：階梯走完之後那一塊是**平台**（比前三階長一截），
  眼睛讀到的是「上去了，停在這裡」，不是「還要再繞一圈」。
- **往右上 ＝ 變好**，讀者不需要翻譯（第七節第 11 條：需要翻譯的比喻是失敗的）。
- **250px 下只剩四塊色塊 ＋ 一條往右上的走勢**，那正好就是要傳達的全部。

**D 值得考慮的地方**：它是全站唯一接得上文案那句「**打底，地基要穩**」與使用者
自己那個「建築師／土木技師」比喻的形狀。⚠ 但它把時間感換成了層級感
（「先做哪一層」變成「哪一層在上面」），而這一頁講的是**順序**。
若使用者偏好建築的味道，可以走 D。

**C 出局的原因值得記下來**：它在紙上（電腦螢幕上）是四種裡最「像流程圖」的，
但**分享卡只有 250px**，菱形和方框的差別在那個尺寸下不存在。
⚠ **「哪一種圖比較專業」和「哪一種圖在縮圖下還讀得出來」是兩個問題。**

## 二之九、第六輪：階梯本身變成畫面（2026-08-25）——⚠ 這是整個梗的第三次轉向

使用者（附「成長階梯」的搜尋截圖，特別是那張手繪的螺旋階梯）：

> 「我喜歡**階梯感**，這個階梯也可以**稍微有點旋轉**的感覺，**每隔幾階就有人在那邊
> 　加油打氣、支持**，可以是醫療人員也可以是家人，然後**要治療的病患正在一步一步
> 　往上往前走**，如果**年紀大一點，可能有人牽著或扶著一起走**。」

⚠⚠ **這一版不再是「診間裡有一塊板子」，階梯自己就是整個畫面。**
四段階梯 ＝ 四個治療階段（第二之八節），但**圖上不寫字、不寫數字** ——
階段的資訊藏在**顏色的四階**與**段間的平台**裡。

**構圖參考圖：`drafts/prosth-stair-ref.png`**（畫布就是 1200×628，位置可以直接對上）。
那張只給**階梯的形狀、四段的分界、平台在哪、人站在哪、多大**。

### 這一版的五個硬條件（都是算過的，不是感覺）

1. ⚠⚠ **頂端一定要是一個「大平台」，而且要有人已經站在上面。**
   第二之八節那條「不可以看起來沒有終點」在這一版靠它成立 ——
   階梯若一路往上出畫面，讀起來就是「走不完」。
2. ⚠⚠ **近大遠小。** 主角在畫面左下前景（高約畫面的 40%），越往上的人越小
   （頂端那位約 20%）。這同時解決兩件事：**縱深＝「還要往上」**，
   以及**頂端的人頭遠低於頂 17% 的安靜區**（實測那條線在 105px，
   頂端平台落在 y≈310、人高 122 → 頭頂 188 ✓）。
3. ⚠ **「旋轉」用段與段的斜度變化做**（緩→陡→緩→陡），不要真的畫成螺旋樓梯 ——
   250px 下螺旋會糊成一團麻花。Ⓞ 那一版是「轉四分之一圈的縱深」，不是繞圈。
4. ⚠⚠ **加油打氣不可以變成勵志海報**：不舉拳、不歡呼、不撒花、不逆光剪影
   （ILLUSTRATION.md 第四節 A 類第 2 條是使用者親口說的紅線）。
   只能是**伸手招呼、拍手、微笑點頭**這種日常的動作。
5. ⚠ **圖上完全沒有牙科**（沒有牙、器械、診療椅、白袍）。診所的線索只剩
   **兩位穿刷手服的人**；科別由帶子上那六個字承擔（第二之一節第 3 條）。

## 二之十、第六輪的兩份提示詞

⚠ 兩版都附 **`drafts/prosth-stair-ref.png`**（構圖）＋ 風格那三張（`style-ref-*.jpg`）。
⚠ 牙模、流程圖那幾張**都不要附了**。

### Ⓝ 一步一步往上（側視・微彎・最好讀）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE IDEA IN ONE SENTENCE: a wide, gentle STAIRCASE climbing from the lower left to the upper
right, with people at intervals cheering the climbers on - and at the top, a broad landing where
someone has already arrived. It is calm and everyday, NOT a motivational poster.

THE STAIRCASE IS THE MAIN SUBJECT, EXACTLY AS IN THE COMPOSITION-REFERENCE DRAWING. It is built
in FOUR CLEARLY SEPARATE FLIGHTS, each flight three broad steps, and BETWEEN THE FLIGHTS THERE IS
A SMALL FLAT LANDING. The four flights are coloured in four steps of the same blue, getting
deeper as they rise: #7d9cc0, then #5f83ab, then #476e97, then #335b8b. The flights lean at
slightly different angles - gentle, steeper, gentle, steeper - so the whole staircase reads as a
soft S-curve rather than a straight ramp. AT THE TOP RIGHT IT ENDS IN A WIDE FLAT LANDING, about
twice as deep as the others: THIS IS THE DESTINATION AND IT MUST LOOK LIKE ONE. The staircase
does NOT continue past it and does NOT run off the edge of the picture.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no step, no landing, no plant, no cloud, no sign. The top
landing and everybody standing on it sit well below that line.

DEPTH: FIGURES GET SMALLER AS THEY GO UP. The people at the bottom are the biggest, those on the
top landing are the smallest - this is what makes the staircase feel long.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. BOTTOM LEFT, THE BIGGEST FIGURES: AN OLD MAN BEING WALKED UP THE FIRST STEP. A man of about
   SEVENTY-FIVE in a soft blue-grey shirt, one hand on a simple handrail, lifting one foot onto
   the first step; BESIDE HIM HIS DAUGHTER, about forty-five, in a moss-green top (#8a9a72),
   HOLDING HIS FOREARM WITH ONE HAND AND STEADYING HIS BACK WITH THE OTHER, climbing WITH him,
   not pulling him. He is about 36% of the picture height. THEY ARE CALM AND ORDINARY: he is not
   struggling, not stooped over, not being carried.

3. HALFWAY UP, THE MAIN CLIMBER - A MIDDLE-AGED MAN WHO IS WALKING UP BY HIMSELF. A man of about
   FIFTY in a warm ochre polo shirt (#c08a5c), mid-stride on the second flight, one foot on the
   step above, body leaning slightly forward, looking UP towards the landing ahead. He is about
   30% of the picture height. HE IS THE ONE THE PICTURE IS ABOUT: give him the clearest silhouette
   and the most open space around him.

4. PEOPLE ARE WAITING AT THE LANDINGS TO CHEER THEM ON - QUIETLY. On the FIRST landing, A CLINIC
   WORKER in muted blue-grey scrubs (#b7c5d7, shaded #99a7b8, no white coat, no mask, no gloves)
   half-turned back down the stairs, ONE ARM EXTENDED IN AN EASY WELCOMING GESTURE towards the old
   man. On the THIRD landing, A YOUNG WOMAN IN HER TWENTIES clapping softly, and beside her A
   SECOND CLINIC WORKER in the same scrubs, one hand raised in a small wave. NOBODY punches the
   air, NOBODY shouts, NOBODY throws confetti, NOBODY holds a banner.

5. ON THE TOP LANDING, SOMEONE HAS ALREADY ARRIVED. A woman of about thirty-five standing
   relaxed on the wide top landing, hands at her sides, TURNED BACK TO LOOK DOWN THE STAIRS with
   a quiet smile - she has finished, and she is waiting for the others. She is the smallest
   figure, about 20% of the picture height, and her head stays far below the empty top strip.

6. THE SPACE AROUND THE STAIRCASE IS WARM AND SIMPLE BUT NEVER EMPTY. A soft warm off-white
   background (#e7e4dd) with clear bright daylight; A GENTLE POOL OF WARM LIGHT around the top
   landing so the eye travels up towards it. Fill the empty corners with a FEW LARGE SOFT SHAPES
   ONLY: two or three big rounded plants growing beside the staircase, one broad soft cloud-like
   band of colour behind it, and the simple wooden handrail running up the whole flight. No
   buildings, no rooms, no furniture, no clinic, no street, no sky full of detail.

7. COLOUR AND LIGHT. The four blues of the flights are the anchor; everything else is warm:
   off-white background, warm wood handrail, ochre shirt, moss-green top, blue-grey scrubs and
   shirt, green plants. At least six clearly different colours; most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE; no dusk, no golden
   hour, no orange cast, no dark corners, no dramatic shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left corner to the upper right; everything
that must be read sits inside the middle 73% of the width; the bottom of the first flight and the
two biggest figures sit close to the bottom edge; the top landing sits in the right third, well
below the empty top strip.

AVOID: any text, letters, numbers, logos, arrows or icons anywhere in the image; teeth, dentures,
toothbrushes, dental instruments, dental chairs, white coats, face masks, gloves, clinics,
hospitals, X-rays or screens; a motivational-poster feeling; anybody punching the air, cheering
loudly, jumping, holding a banner, a flag, a trophy, balloons or confetti; a silhouette against a
bright sky; a heroic backlit figure; a mountain summit; a ladder; a spiral staircase that coils
around itself; stairs that run off the top edge of the picture; anybody drawn faded, translucent,
ghostly or outline-only; anybody looking at the viewer; a frail old man being carried or dragged;
a cast of only elderly people; panels, insets, speech bubbles; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```

### Ⓞ 轉上去的階梯（多一點旋轉與縱深）—— 完整版，可直接複製

⚠ 附 `drafts/prosth-stair-ref.png`（**四段、平台、人的位置與大小**看它；**轉彎照文字**，
那張參考圖是側視的）＋ 風格那三張。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE IDEA IN ONE SENTENCE: a wide, gentle STAIRCASE climbing from the lower left to the upper
right, with people at intervals cheering the climbers on - and at the top, a broad landing where
someone has already arrived. It is calm and everyday, NOT a motivational poster.

THE STAIRCASE IS THE MAIN SUBJECT, AND IT TURNS AS IT RISES. Follow the composition-reference
drawing for the FOUR FLIGHTS, the LANDINGS, and WHERE THE PEOPLE STAND AND HOW BIG THEY ARE; take
the turn from this description. It is built in FOUR CLEARLY SEPARATE FLIGHTS of three broad steps
each, with A SMALL FLAT LANDING between the flights, coloured in four steps of the same blue as
they rise: #7d9cc0, then #5f83ab, then #476e97, then #335b8b. THE FIRST TWO FLIGHTS COME TOWARDS
US FROM THE LOWER LEFT; AT THE SECOND LANDING THE STAIRCASE TURNS ABOUT A QUARTER TURN, and the
last two flights climb away from us towards the upper right, seen slightly from the side and
getting visibly smaller. IT IS ONE SINGLE WIDE, EASY TURN - NOT a spiral, NOT a coil, NOT a helix;
the steps never overlap or pass behind each other, and every step stays clearly separate at
thumbnail size. AT THE TOP IT ENDS IN A WIDE FLAT LANDING, about twice as deep as the others:
THIS IS THE DESTINATION AND IT MUST LOOK LIKE ONE. The staircase does NOT continue past it and
does NOT run off the edge of the picture.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no step, no landing, no plant, no cloud, no sign. The top
landing and everybody standing on it sit well below that line.

DEPTH: FIGURES GET SMALLER AS THEY GO UP. The people at the bottom are the biggest, those on the
top landing are the smallest - this is what makes the staircase feel long.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. BOTTOM LEFT, THE BIGGEST FIGURES: AN OLD MAN BEING WALKED UP THE FIRST STEP. A man of about
   SEVENTY-FIVE in a soft blue-grey shirt, one hand on a simple handrail, lifting one foot onto
   the first step; BESIDE HIM HIS DAUGHTER, about forty-five, in a moss-green top (#8a9a72),
   HOLDING HIS FOREARM WITH ONE HAND AND STEADYING HIS BACK WITH THE OTHER, climbing WITH him,
   not pulling him. He is about 36% of the picture height. THEY ARE CALM AND ORDINARY: he is not
   struggling, not stooped over, not being carried.

3. HALFWAY UP, THE MAIN CLIMBER - A MIDDLE-AGED MAN WHO IS WALKING UP BY HIMSELF. A man of about
   FIFTY in a warm ochre polo shirt (#c08a5c), mid-stride on the second flight, one foot on the
   step above, body leaning slightly forward, looking UP towards the landing ahead. He is about
   30% of the picture height. HE IS THE ONE THE PICTURE IS ABOUT: give him the clearest silhouette
   and the most open space around him.

4. PEOPLE ARE WAITING AT THE LANDINGS TO CHEER THEM ON - QUIETLY. On the FIRST landing, A CLINIC
   WORKER in muted blue-grey scrubs (#b7c5d7, shaded #99a7b8, no white coat, no mask, no gloves)
   half-turned back down the stairs, ONE ARM EXTENDED IN AN EASY WELCOMING GESTURE towards the old
   man. On the THIRD landing, A YOUNG WOMAN IN HER TWENTIES clapping softly, and beside her A
   SECOND CLINIC WORKER in the same scrubs, one hand raised in a small wave. NOBODY punches the
   air, NOBODY shouts, NOBODY throws confetti, NOBODY holds a banner.

5. ON THE TOP LANDING, SOMEONE HAS ALREADY ARRIVED. A woman of about thirty-five standing
   relaxed on the wide top landing, hands at her sides, TURNED BACK TO LOOK DOWN THE STAIRS with
   a quiet smile - she has finished, and she is waiting for the others. She is the smallest
   figure, about 20% of the picture height, and her head stays far below the empty top strip.

6. THE SPACE AROUND THE STAIRCASE IS WARM AND SIMPLE BUT NEVER EMPTY. A soft warm off-white
   background (#e7e4dd) with clear bright daylight; A GENTLE POOL OF WARM LIGHT around the top
   landing so the eye travels up towards it. Fill the empty corners with a FEW LARGE SOFT SHAPES
   ONLY: two or three big rounded plants growing beside the staircase, one broad soft cloud-like
   band of colour behind it, and the simple wooden handrail running up the whole flight. No
   buildings, no rooms, no furniture, no clinic, no street, no sky full of detail.

7. COLOUR AND LIGHT. The four blues of the flights are the anchor; everything else is warm:
   off-white background, warm wood handrail, ochre shirt, moss-green top, blue-grey scrubs and
   shirt, green plants. At least six clearly different colours; most colour blocks sit around HSL
   saturation 30-50 and lightness 70-85. Flat fills in two or three steps per colour, no
   gradients except to describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE; no dusk, no golden
   hour, no orange cast, no dark corners, no dramatic shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left corner to the upper right; everything
that must be read sits inside the middle 73% of the width; the bottom of the first flight and the
two biggest figures sit close to the bottom edge; the top landing sits in the right third, well
below the empty top strip.

AVOID: any text, letters, numbers, logos, arrows or icons anywhere in the image; teeth, dentures,
toothbrushes, dental instruments, dental chairs, white coats, face masks, gloves, clinics,
hospitals, X-rays or screens; a motivational-poster feeling; anybody punching the air, cheering
loudly, jumping, holding a banner, a flag, a trophy, balloons or confetti; a silhouette against a
bright sky; a heroic backlit figure; a mountain summit; a ladder; a spiral staircase that coils
around itself; stairs that run off the top edge of the picture; anybody drawn faded, translucent,
ghostly or outline-only; anybody looking at the viewer; a frail old man being carried or dragged;
a cast of only elderly people; panels, insets, speech bubbles; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```

## 二之十一、第七輪：前兩版被退，成因是「人小」與「累」（2026-08-25）

> 「這兩個版本都不好。**為了強調樓梯，人都變小了**，而且**看起來好累喔**。
> 　我傳給你的之前那個**螺旋樓梯是很有趣味的**。」
> 　（再附三張參考：阿洲仔教室「樓梯類型」的**折返梯／弧形梯**、
> 　　「十年經驗 vs 一年重複十年」的**弧形階梯上放著東西**、CLIP STUDIO 的方形螺旋。）

**兩個成因，是提示詞自己寫出來的，不是模型亂畫：**

1. ⚠⚠ **「階梯是主角」寫進了提示詞的第一句**（`THE STAIRCASE IS THE MAIN SUBJECT`），
   模型照辦，於是階梯佔滿畫面、人只好縮到 20~36%。
   **這一版要整個反過來：人是主角，階梯是舞台。** 主角要到 **40~45%**。
2. ⚠⚠ **「累」是階數與姿勢一起造成的**：四段十二階 ＝ 一眼看不到頭；
   而 `mid-stride, leaning forward, looking up` 逐字就是「奮力往上爬」。
   → **階數砍到 8~9 階、踏面加寬、級高放矮**（一眼看得到頂），
   **姿勢全部換成輕鬆的**：邊走邊聊、坐在階梯邊晃腳、蹲下來擺盆栽、回頭等人。
   ⚠ 「加油打氣」不要畫成**一整排人站在平台上對著爬的人加油** ——
   那個構圖本身就在說「這條路很難」。改成**每個人各自在做一件事**
   （第十一之二節那條「活潑 ＝ 好幾件小事同時發生」）。

⚠ **形狀不要我自己畫骨架了。** 我試著畫一條「捲上去的緞帶階梯」當參考，
兩版都畫成**一條平躺的環形跑道**（2D 曲線少了透視就是環，不是升高）——
**使用者手上那張 CodePro 的螺旋階梯本來就是最好的形狀參考**，直接餵它
（第十之一節：形狀給圖不給字）。骨架圖 `drafts/prosth-stair-ref-ribbon.png`
留著當反例，**不要拿去餵模型**。

## 二之十二、第七輪的兩份提示詞

⚠ 參考圖這一輪附三種：**① 風格**（`drafts/style-ref-*.jpg`）、
**② 階梯的形狀與趣味**（使用者傳的 CodePro 螺旋階梯那張／Ⓠ 版用阿洲仔那張折返梯）、
**③ 不要附**牙模、流程圖、我畫的緞帶骨架。

### Ⓟ 蜿蜒的階梯（照 CodePro 那張的味道・人是主角）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE PEOPLE ARE THE SUBJECT. THE STAIRCASE IS ONLY THE STAGE THEY ARE STANDING ON. Draw the
people BIG - the nearest figures are about 45% of the picture height - and keep the staircase
SHORT: eight or nine broad, shallow steps in total, so the whole climb is easy to see at a
glance. It must NEVER look long, steep or tiring.

THE IDEA IN ONE SENTENCE: a short, wide, GENTLY WINDING staircase - like the friendly hand-drawn
winding stairs in the shape reference - climbing from the lower left to the upper right, with a
few people spread along it, EACH DOING SOMETHING DIFFERENT AND RELAXED, and at the top a broad
landing where someone has already arrived and is turning back to wave. It is warm, everyday and
a little playful. It is NOT a motivational poster and NOT a hard climb.

THE STAIRCASE: take its winding, playful shape from the shape-reference picture, but make it
SHORTER and WIDER - broad steps, low risers, one easy S-shaped bend, seen slightly from the
side so we can tell it rises. The steps are coloured in four steps of the same blue as they go
up: #7d9cc0, then #5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline
(#182f4b). A simple warm wooden handrail runs along the outer edge. AT THE TOP IT ENDS IN A WIDE
FLAT LANDING - the destination - and the staircase does NOT continue past it and does NOT run off
the edge of the picture. NO spiral that coils around itself, NO helix, NO long flight of many
steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no step, no landing, no plant, no sign.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. NEAREST, BOTTOM LEFT - AN OLD MAN AND HIS DAUGHTER, WALKING UP ARM IN ARM AND TALKING. He is
   about seventy-five in a soft blue-grey shirt, one hand resting on the handrail; she is about
   forty-five in a moss-green top (#8a9a72), her arm hooked through his. THEY ARE CHATTING, HEADS
   SLIGHTLY TURNED TOWARDS EACH OTHER, both smiling a little. THEY ARE THE BIGGEST FIGURES, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT being pulled.

3. IN THE MIDDLE - THE MAIN CHARACTER, A MAN OF ABOUT FIFTY, WALKING UP EASILY AND LOOKING BACK.
   In a warm ochre polo shirt (#c08a5c), standing on a step with both feet, TURNED HALF ROUND TO
   SAY SOMETHING TO THE TWO BEHIND HIM, one hand loose at his side. About 38% of the picture
   height. HE IS RELAXED - not leaning forward, not straining, not gripping the rail.

4. SOMEONE IS SITTING DOWN, AND THAT IS WHAT MAKES IT FEEL EASY. A young woman of about thirty
   SITTING ON THE EDGE OF ONE OF THE UPPER STEPS, feet dangling over the side, hands resting
   beside her, watching the others come up with a small smile. About 30% of the picture height.

5. ONE MORE PERSON IS BUSY WITH SOMETHING OF THEIR OWN. A clinic worker in muted blue-grey scrubs
   (#b7c5d7, shaded #99a7b8 - no white coat, no mask, no gloves) CROUCHING BESIDE THE STAIRS to
   set a potted plant straight, half turned away from us. NOBODY IS STANDING IN A ROW CHEERING;
   nobody punches the air; nobody shouts.

6. AT THE TOP, SOMEONE HAS ALREADY ARRIVED. A woman of about thirty-five standing easily on the
   wide top landing, one hand raised in a small wave back down the stairs. She is the smallest
   figure, about 24% of the picture height, and her head stays well below the empty top strip.

7. PLAYFUL DETAILS AND LIGHT - a few, and large. Three or four big rounded potted plants sitting
   on and beside the steps; one large leafy plant leaning in from the bottom right corner; A
   SMALL BROWN SPARROW perched on the handrail. A soft warm off-white background (#e7e4dd) in
   clear bright daylight, with a gentle pool of warm light around the top landing. At least six
   clearly different colours - off-white background, warm wood handrail, four blues, ochre shirt,
   moss-green top, blue-grey scrubs, green plants. Most colour blocks sit around HSL saturation
   30-50 and lightness 70-85. Flat fills in two or three steps per colour, no gradients except to
   describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE; no dusk, no golden hour, no orange cast,
   no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture; the two nearest figures stand close to the bottom edge and their
heads reach roughly halfway up the picture; everything that must be read sits inside the middle
73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, numbers, logos, arrows or icons anywhere in the image; teeth, dentures,
toothbrushes, dental instruments, dental chairs, white coats, face masks, gloves, clinics,
hospitals, X-rays or screens; tiny figures dwarfed by a huge staircase; a long, steep or endless
flight of stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder;
a mountain; a motivational-poster feeling; anybody straining, panting, hunched, gripping the rail
with both hands, being carried or being dragged; anybody punching the air, cheering loudly,
jumping, holding a banner, a flag, a trophy, balloons or confetti; a row of people standing to
applaud; a silhouette against a bright sky; a heroic backlit figure; anybody drawn faded,
translucent, ghostly or outline-only; anybody looking at the viewer; a cast of only elderly
people; panels, insets, speech bubbles; dusk, sunset, golden hour, an orange or sepia cast; bare
empty backgrounds; grey or blue-white walls; photorealism; 3D rendering; heavy even black
outlines.
```

### Ⓠ 折返梯（照阿洲仔那張第 2 格・人最大、最不累）—— 完整版，可直接複製

⚠ 附**風格三張** ＋ **阿洲仔那張「2. 折返梯」**當形狀參考。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE PEOPLE ARE THE SUBJECT. THE STAIRCASE IS ONLY THE STAGE THEY ARE STANDING ON. Draw the
people BIG - the nearest figures are about 45% of the picture height - and keep the staircase
SHORT: eight or nine broad, shallow steps in total, so the whole climb is easy to see at a
glance. It must NEVER look long, steep or tiring.

THE IDEA IN ONE SENTENCE: a short HALF-TURN STAIRCASE - two flights with a big square landing
between them, exactly the type in the shape reference - with a few people spread along it, EACH
DOING SOMETHING DIFFERENT AND RELAXED, and on the upper landing someone who has already arrived,
turning back to wave. It is warm, everyday and a little playful. It is NOT a motivational poster
and NOT a hard climb.

THE STAIRCASE: a HALF-TURN (dog-leg) staircase, the friendly wooden-and-blue kind in the shape
reference. FOUR broad shallow steps climb from the lower left to a GENEROUS SQUARE LANDING in the
middle of the picture - the landing is big enough for two people to stand and talk on - then the
stairs TURN and FOUR more broad steps climb away to the upper right, ending in A WIDE TOP LANDING.
EIGHT STEPS IN TOTAL, NO MORE. Broad treads, low risers, seen slightly from the side so we can
tell it rises. The steps are coloured in four steps of the same blue as they go up: #7d9cc0, then
#5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline (#182f4b), and a simple
warm wooden handrail runs along the outer edge. The staircase does NOT continue past the top
landing and does NOT run off the edge of the picture. NO spiral that coils around itself, NO
helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no step, no landing, no plant, no sign.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. NEAREST, BOTTOM LEFT - AN OLD MAN AND HIS DAUGHTER, WALKING UP ARM IN ARM AND TALKING. He is
   about seventy-five in a soft blue-grey shirt, one hand resting on the handrail; she is about
   forty-five in a moss-green top (#8a9a72), her arm hooked through his. THEY ARE CHATTING, HEADS
   SLIGHTLY TURNED TOWARDS EACH OTHER, both smiling a little. THEY ARE THE BIGGEST FIGURES, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT being pulled.

3. IN THE MIDDLE - THE MAIN CHARACTER, A MAN OF ABOUT FIFTY, WALKING UP EASILY AND LOOKING BACK.
   In a warm ochre polo shirt (#c08a5c), standing on a step with both feet, TURNED HALF ROUND TO
   SAY SOMETHING TO THE TWO BEHIND HIM, one hand loose at his side. About 38% of the picture
   height. HE IS RELAXED - not leaning forward, not straining, not gripping the rail.

4. SOMEONE IS SITTING DOWN, AND THAT IS WHAT MAKES IT FEEL EASY. A young woman of about thirty
   SITTING ON THE EDGE OF THE MIDDLE LANDING, feet dangling over the side, hands resting
   beside her, watching the others come up with a small smile. About 30% of the picture height.

5. ONE MORE PERSON IS BUSY WITH SOMETHING OF THEIR OWN. A clinic worker in muted blue-grey scrubs
   (#b7c5d7, shaded #99a7b8 - no white coat, no mask, no gloves) CROUCHING BESIDE THE STAIRS to
   set a potted plant straight, half turned away from us. NOBODY IS STANDING IN A ROW CHEERING;
   nobody punches the air; nobody shouts.

6. AT THE TOP, SOMEONE HAS ALREADY ARRIVED. A woman of about thirty-five standing easily on the
   wide top landing, one hand raised in a small wave back down the stairs. She is the smallest
   figure, about 24% of the picture height, and her head stays well below the empty top strip.

7. PLAYFUL DETAILS AND LIGHT - a few, and large. Three or four big rounded potted plants sitting
   on and beside the steps; one large leafy plant leaning in from the bottom right corner; A
   SMALL BROWN SPARROW perched on the handrail. A soft warm off-white background (#e7e4dd) in
   clear bright daylight, with a gentle pool of warm light around the top landing. At least six
   clearly different colours - off-white background, warm wood handrail, four blues, ochre shirt,
   moss-green top, blue-grey scrubs, green plants. Most colour blocks sit around HSL saturation
   30-50 and lightness 70-85. Flat fills in two or three steps per colour, no gradients except to
   describe light. NO LARGE FLAT EMPTY AREAS ANYWHERE; no dusk, no golden hour, no orange cast,
   no dark corners, no long shadows.

COMPOSITION ANCHORS: the lower flight runs up from the lower left, the middle landing sits at the
centre of the picture and the upper flight climbs to the right; the staircase occupies the lower
two thirds of the picture; the two nearest figures stand close to the bottom edge and their
heads reach roughly halfway up the picture; everything that must be read sits inside the middle
73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, numbers, logos, arrows or icons anywhere in the image; teeth, dentures,
toothbrushes, dental instruments, dental chairs, white coats, face masks, gloves, clinics,
hospitals, X-rays or screens; tiny figures dwarfed by a huge staircase; a long, steep or endless
flight of stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder;
a mountain; a motivational-poster feeling; anybody straining, panting, hunched, gripping the rail
with both hands, being carried or being dragged; anybody punching the air, cheering loudly,
jumping, holding a banner, a flag, a trophy, balloons or confetti; a row of people standing to
applaud; a silhouette against a bright sky; a heroic backlit figure; anybody drawn faded,
translucent, ghostly or outline-only; anybody looking at the viewer; a cast of only elderly
people; panels, insets, speech bubbles; dusk, sunset, golden hour, an orange or sepia cast; bare
empty backgrounds; grey or blue-white walls; photorealism; 3D rendering; heavy even black
outlines.
```

## 二之十三、第八輪：闖關 ＋ 終點是一桌飯菜（2026-08-25）

三張折返梯都被退：**「感覺是不知道在幹嘛」** —— 階梯畫對了、人也夠大了，
但**沒有故事**：一群人在樓梯上各自做事，看不出要去哪裡、為什麼要上去。

使用者補上整套意象：

> 「增加一點意象。**終點是一桌的飯菜**，有幾個家人已經坐那邊**呼喚著病人和陪伴家人開飯**。
> 　病人和陪伴家人在階梯下，**回應著終點的家人**。病人旁邊有**醫師穿著白袍＋刷手服，
> 　歡迎病患登上階梯**。階梯上有**兩個比較大的平台階，平台階上有標示數字**，
> 　意思是**第幾關**，可以是旗幟或其他物品標示。平台上有醫護人員等著病人來
> 　**闖關、考試、或幫病患加裝備、補能量**的概念。大家都是歡迎病患、希望他能成功。
> 　然後**場面要動感一點**。」

⚠⚠ **這一輪把「終點是一桌飯菜」和「階梯」接起來了** —— 那正是第三輪那個
被擱置的 Ⓚ（全家吃飯）：它不是另一個梗，是**這個梗的終點**。
`close` 那句「整理好，**吃得順**、用得久」因此第一次真的畫進畫面裡。

### 使用者這一輪推翻的兩條（都要照做，不要「訂正」回去）

1. ⚠⚠ **白袍回來了。** 第二之一節那把「距離尺」把白袍列為距離最遠的一格，
   前四輪都刻意不穿；這一輪使用者指定**「醫師穿著白袍＋刷手服」**。
   照做，但**只有階梯下那位醫師**穿白袍（他是來迎接的那個人），
   **平台上的醫護仍然只穿刷手服**。
2. ⚠⚠ **數字回來了。** 第十一節硬規格 6~7（不放小圖示、圖上不放字）
   在這一輪對**兩面旗子上的 1 和 2** 放行 —— 條件同前：**大、少、只有這兩個數字**。

### 這一輪的三個風險（提示詞裡已經寫死對策）

- **人變多了**（八到九個）→ 250px 下最容易糊。對策：**綁成三組**
  （階梯下三人一組／兩個平台各一人／頂端餐桌三人一組），組與組之間留空，
  用階梯本身把三組串成一條斜線。
- **「闖關」不能變成電玩** → 只用**旗子與數字**，AVOID 點名血條、金幣、寶箱、
  關卡 UI、獎盃、獎牌。
- **餐桌不能爬進頂 17%** → 餐桌與家人的頭頂要在 y≈130 以下（安靜區在 105）。

### Ⓡ 闖關去吃飯（第八輪・完整版，可直接複製）

⚠ 參考圖：**風格三張**（`drafts/style-ref-*.jpg`）＋ **上一輪那第三張成品**
（折返梯的形狀、人物大小與線條都已經對了，這一輪只加故事，附它當構圖底）。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: at the bottom of a short, friendly
staircase a middle-aged man is about to start climbing, his wife beside him and a dentist
welcoming him up; two landings on the way are little checkpoints where clinic staff hand out
supplies and cheer; and AT THE TOP, HIS FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD,
CALLING DOWN TO THEM TO COME AND EAT. Everybody wants him to get there. THE WHOLE PICTURE IS ONE
LIVELY MOMENT WITH THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers - EIGHT
STEPS IN TOTAL, NO MORE - climbing from the lower left to the upper right, seen slightly from the
side so we can tell it rises. TWO OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a
person to stand on with room to spare, one about a third of the way up and one about two thirds
of the way up. The steps are coloured in four steps of the same blue as they go up: #7d9cc0, then
#5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline (#182f4b); a simple warm
wooden handrail runs along the outer edge. The staircase ends at the top landing where the table
is; it does NOT continue past it and does NOT run off the edge of the picture. NO spiral, NO
helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no table, no flag, no step, no plant, no sign. The table and
everybody's heads sit below that line.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. GROUP A - THE PATIENT IS SETTING OFF, AND HE IS CALLING BACK UP TO THE TABLE. A man of about
   FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), ONE FOOT ALREADY UP ON THE FIRST STEP, body
   turned upward, ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a
   cheerful shout - he is answering the family who are calling him. He is the largest figure in
   the picture. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM, GOING UP WITH HIM. A woman of about fifty in a moss-green
   top (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the stairs - they are
   about to move.

4. GROUP A - THE DENTIST IS WELCOMING THEM UP. A woman in her forties standing at the foot of
   the stairs on the near side, WEARING AN OPEN WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7,
   shaded #99a7b8), no mask, no gloves, hair (#373f48) tied back. ONE ARM SWEEPS UPWARD ALONG
   THE LINE OF THE STAIRCASE IN A CLEAR "THIS WAY UP, PLEASE" GESTURE, her other hand open at
   her side, smiling at the couple. She is NOT touching them, NOT holding a clipboard, NOT
   holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: A GRANDMOTHER OF ABOUT SEVENTY STANDING UP AND
   CUPPING BOTH HANDS AROUND HER MOUTH TO CALL DOWN THE STAIRS; A YOUNG MAN OF ABOUT THIRTY
   CARRYING ONE MORE STEAMING DISH IN FROM THE side, mid-stride; and A GIRL OF ABOUT TEN kneeling
   up on her chair and waving down at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture; GROUP A stands on the ground at the bottom left with their feet
close to the bottom edge and their heads reaching about halfway up the picture; the two flagged
landings sit along the middle of the diagonal; the table and GROUP C sit in the upper right, with
their heads well below the empty top strip; everything that must be read sits inside the middle
73% of the width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


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

### Ⓢ 走了一段了，快到了（第九輪・完整版，可直接複製）

⚠ 第八輪那三張「很接近了」，使用者要三件修正：**樓梯起點往遠方延伸**（看得出已經走了一段）、
**病人和家人不是站在起點而是在階梯上**、**醫師拿著地圖指引方向、表示快到了**。
⚠⚠ **那張地圖是這一輪最有價值的一件**：它把「醫師＝訂治療計畫的人」（使用者最早那個
「建築師／土木技師」的比喻）用完全白話、零醫療符號的方式畫出來了。
⚠ 地圖上**一個字都不准有**，只有一條蜿蜒的線與三四個點（同旗子那條的邏輯）。
⚠ 參考圖：**風格三張** ＋ **第八輪那張成品**（構圖底）。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a middle-aged man and his wife
ARE ALREADY PART-WAY UP a short, friendly staircase - the first stretch of it runs away behind
them into the distance, so we can see how far they have come - and beside them A DENTIST IS
HOLDING AN OPEN MAP, POINTING UP AHEAD TO SHOW THEM THEY ARE NEARLY THERE. Two landings above
are little checkpoints where clinic staff hand out supplies and cheer them on, and AT THE TOP HIS
FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD, CALLING DOWN TO THEM TO COME AND EAT.
Everybody wants him to get there, AND HE IS CLOSE. THE WHOLE PICTURE IS ONE LIVELY MOMENT WITH
THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers, climbing
from the lower left to the upper right, seen slightly from the side so we can tell it rises. TWO
OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a person to stand on with room to
spare, one about a third of the way up and one about two thirds of the way up, and the staircase
ends at the top landing where the table is.

THE FIRST STRETCH OF THE STAIRCASE RUNS AWAY INTO THE DISTANCE BEHIND THE COUPLE - THIS IS THE
PART THEY HAVE ALREADY WALKED. At the lower left, a few more steps continue down and away from
us towards the far background, getting smaller and partly hidden behind a large leafy plant, and
they simply fade out of the picture - we never see where they began. THOSE ALREADY-WALKED STEPS
ARE THE PALEST BLUE (#7d9cc0). The steps the couple are standing on now, and everything above
them, get deeper as they rise: #5f83ab, then #476e97, then #335b8b, each with a soft dark navy
outline (#182f4b). A simple warm wooden handrail runs along the outer edge the whole way. Count
only EIGHT STEPS between the couple and the table - the climb that is left must look SHORT. NO
spiral, NO helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY EMPTY: the upper 17% (the top 105 pixels of 628) is plain
pale warm background only - no head, no table, no flag, no step, no plant, no sign. The table and
everybody's heads sit below that line.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. GROUP A - THE PATIENT IS ALREADY ON THE STAIRS AND HE IS CALLING UP TO THE TABLE. A man of
   about FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), STANDING ON THE STEPS - NOT on the
   ground, NOT at the very bottom - with one foot lifting onto the next step, body turned upward,
   ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a cheerful shout - he
   is answering the family who are calling him. He is the largest figure in the picture, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM ON THE SAME STEP. A woman of about fifty in a moss-green top
   (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the climb ahead - they
   are in the middle of walking, not standing still.

4. GROUP A - THE DENTIST IS SHOWING THEM ON A MAP THAT THEY ARE NEARLY THERE. A woman in her
   forties standing on the step just above them and turned back towards them, WEARING AN OPEN
   WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7, shaded #99a7b8), no mask, no gloves, hair
   (#373f48) tied back. SHE HOLDS AN OPEN PAPER MAP IN ONE HAND, HELD OUT SO THE COUPLE CAN SEE
   IT, AND HER OTHER HAND POINTS UP THE STAIRCASE TOWARDS THE TABLE - the clear message is "we
   are nearly there". THE MAP IS SIMPLE AND CARRIES NO WRITING AT ALL: just a folded sheet of
   warm cream paper with ONE WINDING LINE AND THREE OR FOUR SMALL DOTS drawn on it. She is
   smiling at them, NOT touching them, NOT holding a clipboard, NOT holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: A GRANDMOTHER OF ABOUT SEVENTY STANDING UP AND
   CUPPING BOTH HANDS AROUND HER MOUTH TO CALL DOWN THE STAIRS; A YOUNG MAN OF ABOUT THIRTY
   CARRYING ONE MORE STEAMING DISH IN FROM THE side, mid-stride; and A GIRL OF ABOUT TEN kneeling
   up on her chair and waving down at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture, with its already-walked stretch trailing away into the distance
at the lower left; GROUP A stands ON THE STEPS in the lower left quarter, their feet close to the
bottom edge and their heads reaching about halfway up the picture; the two flagged landings sit
along the middle of the diagonal; the table and GROUP C sit in the upper right, with their heads
well below the empty top strip; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain; any writing, letters, place names or
symbols on the map; a treasure map, a pirate map or a game minimap;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


### Ⓣ 奶奶朝著階梯下叫（第十輪・完整版，可直接複製）

⚠ 使用者只點了一件：**「右邊的奶奶叫的方向不太對，應該是對著階梯下的病人叫」**。
⚠⚠ 另外**我自己抓到一件會壞掉的**：上一版**旗子 2 的頂端與奶奶的頭都爬進了頂 17% 的安靜區**
（換算成 1200×628 約在 y=66 與 y=91，安靜區的界線是 105）——那一條帶子疊上去會把她的頭
和旗尖切掉。這一版把安靜區那一段整個改寫成硬規則並點名旗子與頭髮。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a middle-aged man and his wife
ARE ALREADY PART-WAY UP a short, friendly staircase - the first stretch of it runs away behind
them into the distance, so we can see how far they have come - and beside them A DENTIST IS
HOLDING AN OPEN MAP, POINTING UP AHEAD TO SHOW THEM THEY ARE NEARLY THERE. Two landings above
are little checkpoints where clinic staff hand out supplies and cheer them on, and AT THE TOP HIS
FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD, CALLING DOWN TO THEM TO COME AND EAT.
Everybody wants him to get there, AND HE IS CLOSE. THE WHOLE PICTURE IS ONE LIVELY MOMENT WITH
THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers, climbing
from the lower left to the upper right, seen slightly from the side so we can tell it rises. TWO
OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a person to stand on with room to
spare, one about a third of the way up and one about two thirds of the way up, and the staircase
ends at the top landing where the table is.

THE FIRST STRETCH OF THE STAIRCASE RUNS AWAY INTO THE DISTANCE BEHIND THE COUPLE - THIS IS THE
PART THEY HAVE ALREADY WALKED. At the lower left, a few more steps continue down and away from
us towards the far background, getting smaller and partly hidden behind a large leafy plant, and
they simply fade out of the picture - we never see where they began. THOSE ALREADY-WALKED STEPS
ARE THE PALEST BLUE (#7d9cc0). The steps the couple are standing on now, and everything above
them, get deeper as they rise: #5f83ab, then #476e97, then #335b8b, each with a soft dark navy
outline (#182f4b). A simple warm wooden handrail runs along the outer edge the whole way. Count
only EIGHT STEPS between the couple and the table - the climb that is left must look SHORT. NO
spiral, NO helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is plain pale warm
background and nothing else. NOTHING may cross that line: not a head, not a raised hand, not a
strand of hair, not the tip of a flag or its pole, not a step, not a plant, not a bird, not a
wisp of steam. Compose so that THE HIGHEST THING IN THE PICTURE - the grandmother's head and the
upper flag - still sits comfortably below it, with a clear band of empty background above
everything.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. GROUP A - THE PATIENT IS ALREADY ON THE STAIRS AND HE IS CALLING UP TO THE TABLE. A man of
   about FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), STANDING ON THE STEPS - NOT on the
   ground, NOT at the very bottom - with one foot lifting onto the next step, body turned upward,
   ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a cheerful shout - he
   is answering the family who are calling him. He is the largest figure in the picture, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM ON THE SAME STEP. A woman of about fifty in a moss-green top
   (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the climb ahead - they
   are in the middle of walking, not standing still.

4. GROUP A - THE DENTIST IS SHOWING THEM ON A MAP THAT THEY ARE NEARLY THERE. A woman in her
   forties standing on the step just above them and turned back towards them, WEARING AN OPEN
   WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7, shaded #99a7b8), no mask, no gloves, hair
   (#373f48) tied back. SHE HOLDS AN OPEN PAPER MAP IN ONE HAND, HELD OUT SO THE COUPLE CAN SEE
   IT, AND HER OTHER HAND POINTS UP THE STAIRCASE TOWARDS THE TABLE - the clear message is "we
   are nearly there". THE MAP IS SIMPLE AND CARRIES NO WRITING AT ALL: just a folded sheet of
   warm cream paper with ONE WINDING LINE AND THREE OR FOUR SMALL DOTS drawn on it. She is
   smiling at them, NOT touching them, NOT holding a clipboard, NOT holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: A GRANDMOTHER OF ABOUT SEVENTY STANDING UP,
   HER WHOLE BODY AND FACE TURNED DOWN AND TO THE LEFT TOWARDS THE COUPLE ON THE STAIRS, BOTH
   HANDS CUPPED AROUND HER MOUTH, CALLING DOWN THE STAIRCASE AT THEM - her eyes follow the line
   of the stairs down to the man in the ochre shirt, NOT out at the viewer, NOT to the right, NOT
   at the table; A YOUNG MAN OF ABOUT THIRTY CARRYING ONE MORE STEAMING DISH IN FROM THE side,
   mid-stride; and A GIRL OF ABOUT TEN kneeling up on her chair and ALSO WAVING DOWN AND TO THE
   LEFT at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture, with its already-walked stretch trailing away into the distance
at the lower left; GROUP A stands ON THE STEPS in the lower left quarter, their feet close to the
bottom edge and their heads reaching about halfway up the picture; the two flagged landings sit
along the middle of the diagonal; the table and GROUP C sit in the upper right, with their heads
well below the empty top strip; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain; any writing, letters, place names or
symbols on the map; a treasure map, a pirate map or a game minimap;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; anybody calling or waving out of the picture instead of down the
stairs; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


### Ⓤ 已經走過的那一段要看得見（第十一輪・完整版，可直接複製）

⚠ 使用者：**「延伸的樓梯不見了」**。成因在提示詞裡：上一版寫了
`getting smaller and partly hidden behind a large leafy plant` ＋ `fade out of the picture`，
模型照辦，把那一段縮成角落一點點、甚至整段不畫。
→ 這一版改成**明確的量**（四五階、佔畫面左六分之一、自帶扶手、**跑出左邊緣**），
並在 AVOID 點名「畫得很淡／很小／被植物擋住」與「樓梯從左下角憑空開始」。
⚠ 順手再鎖兩件第三張跑掉的：**夫妻必須雙腳站在階梯上**（不是地面）、
**醫師手上一定要有攤開的地圖**。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a middle-aged man and his wife
ARE ALREADY PART-WAY UP a short, friendly staircase - the first stretch of it runs away behind
them into the distance, so we can see how far they have come - and beside them A DENTIST IS
HOLDING AN OPEN MAP, POINTING UP AHEAD TO SHOW THEM THEY ARE NEARLY THERE. Two landings above
are little checkpoints where clinic staff hand out supplies and cheer them on, and AT THE TOP HIS
FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD, CALLING DOWN TO THEM TO COME AND EAT.
Everybody wants him to get there, AND HE IS CLOSE. THE WHOLE PICTURE IS ONE LIVELY MOMENT WITH
THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers, climbing
from the lower left to the upper right, seen slightly from the side so we can tell it rises. TWO
OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a person to stand on with room to
spare, one about a third of the way up and one about two thirds of the way up, and the staircase
ends at the top landing where the table is.

THE STAIRCASE CONTINUES DOWN AND OUT OF THE PICTURE ON THE LEFT - THIS IS THE PART THEY HAVE
ALREADY WALKED, AND IT MUST BE PLAINLY VISIBLE. Below and to the left of the couple, FOUR OR FIVE
MORE STEPS carry on downwards to the left and RUN OFF THE LEFT EDGE OF THE PICTURE, so we never
see where the staircase began. THIS LOWER STRETCH IS DRAWN AS CLEARLY AS THE REST - it takes up
roughly the LEFT SIXTH of the image, complete with its own handrail. It is NOT faded, NOT blurred,
NOT hidden behind a plant, NOT a tiny detail in the corner - a viewer must see at a glance that
the couple have already come up a good stretch of stairs. THOSE ALREADY-WALKED STEPS ARE THE
PALEST BLUE (#7d9cc0). The steps the couple are standing on now, and everything above them, get
deeper as they rise: #5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline
(#182f4b). A simple warm wooden handrail runs along the outer edge the whole way. Count only
EIGHT STEPS between the couple and the table - the climb that is LEFT must look SHORT. NO spiral,
NO helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is plain pale warm
background and nothing else. NOTHING may cross that line: not a head, not a raised hand, not a
strand of hair, not the tip of a flag or its pole, not a step, not a plant, not a bird, not a
wisp of steam. Compose so that THE HIGHEST THING IN THE PICTURE - the grandmother's head and the
upper flag - still sits comfortably below it, with a clear band of empty background above
everything.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.

2. GROUP A - THE PATIENT IS ALREADY ON THE STAIRS AND HE IS CALLING UP TO THE TABLE. A man of
   about FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), STANDING WITH BOTH FEET ON THE STEPS
   THEMSELVES, WELL ABOVE THE BOTTOM OF THE PICTURE - never on flat ground, never at the very
   start of the staircase, with several already-walked steps visible below and behind him - one
   foot lifting onto the next step, body turned upward,
   ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a cheerful shout - he
   is answering the family who are calling him. He is the largest figure in the picture, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM ON THE SAME STEP. A woman of about fifty in a moss-green top
   (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the climb ahead - they
   are in the middle of walking, not standing still.

4. GROUP A - THE DENTIST IS SHOWING THEM ON A MAP THAT THEY ARE NEARLY THERE. A woman in her
   forties standing on the step just above them and turned back towards them, WEARING AN OPEN
   WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7, shaded #99a7b8), no mask, no gloves, hair
   (#373f48) tied back. SHE IS DEFINITELY HOLDING AN OPEN PAPER MAP - THIS IS NOT OPTIONAL - HELD UP
   IN ONE HAND AND TURNED SO THE COUPLE CAN SEE IT, big enough to read as a map at a glance, AND HER OTHER HAND POINTS UP THE STAIRCASE TOWARDS THE TABLE - the clear message is "we
   are nearly there". THE MAP IS SIMPLE AND CARRIES NO WRITING AT ALL: just a folded sheet of
   warm cream paper with ONE WINDING LINE AND THREE OR FOUR SMALL DOTS drawn on it. She is
   smiling at them, NOT touching them, NOT holding a clipboard, NOT holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: A GRANDMOTHER OF ABOUT SEVENTY STANDING UP,
   HER WHOLE BODY AND FACE TURNED DOWN AND TO THE LEFT TOWARDS THE COUPLE ON THE STAIRS, BOTH
   HANDS CUPPED AROUND HER MOUTH, CALLING DOWN THE STAIRCASE AT THEM - her eyes follow the line
   of the stairs down to the man in the ochre shirt, NOT out at the viewer, NOT to the right, NOT
   at the table; A YOUNG MAN OF ABOUT THIRTY CARRYING ONE MORE STEAMING DISH IN FROM THE side,
   mid-stride; and A GIRL OF ABOUT TEN kneeling up on her chair and ALSO WAVING DOWN AND TO THE
   LEFT at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture, with its already-walked stretch trailing away into the distance
at the lower left; GROUP A stands ON THE STEPS in the lower left quarter, their feet close to the
bottom edge and their heads reaching about halfway up the picture; the two flagged landings sit
along the middle of the diagonal; the table and GROUP C sit in the upper right, with their heads
well below the empty top strip; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain; a staircase that simply begins at the
bottom-left corner with nothing below it; the already-walked steps drawn faint, blurred, tiny or
hidden behind plants; a dentist with empty hands or with the map put away; any writing, letters, place names or
symbols on the map; a treasure map, a pirate map or a game minimap;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; anybody calling or waving out of the picture instead of down the
stairs; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


### Ⓥ 奶奶更生動 ＋ 醫療人員的藍黑髮（第十二輪・完整版，可直接複製）

⚠ 使用者兩件：**「右上的奶奶像我附圖那張比較生動」**、
**「醫療人員頭髮要換成附圖那樣藍黑色感，這樣才符合植牙假牙重建的主題色標籤」**。

- **藍黑髮**照第十之三節的做法算出來，不是挑的：把頭髮的色相移到植牙套色的
  **212.7°** → 主色 **`#202d3c`**、暗處 **`#131b26`**、藍色高光 **`#344a65`**。
  ⚠ **只有醫療人員**（醫師＋兩位刷手服）換；病人、太太、餐桌那一家維持一般的深棕與灰白 ——
  這樣主題色就由「診所的人」帶著走。⚠ 這一條寫進 **STYLE 段**（第十之五節：越前面權重越高）。
- **奶奶的生動**照參考圖，但**皺紋不照抄**：站上的臉部規則是「一個平塗色 ＋ 只有六樣」，
  而且使用者 2026-08-20 退過「臉部細節太多、顯老」。所以力度全部改由
  **大張的 O 形嘴（全畫面最大的嘴）＋ 高高揚起的眉毛 ＋ 張開的手掌 ＋ 前傾的上半身 ＋
  兩三條飛出去的聲音線**來給。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a middle-aged man and his wife
ARE ALREADY PART-WAY UP a short, friendly staircase - the first stretch of it runs away behind
them into the distance, so we can see how far they have come - and beside them A DENTIST IS
HOLDING AN OPEN MAP, POINTING UP AHEAD TO SHOW THEM THEY ARE NEARLY THERE. Two landings above
are little checkpoints where clinic staff hand out supplies and cheer them on, and AT THE TOP HIS
FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD, CALLING DOWN TO THEM TO COME AND EAT.
Everybody wants him to get there, AND HE IS CLOSE. THE WHOLE PICTURE IS ONE LIVELY MOMENT WITH
THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers, climbing
from the lower left to the upper right, seen slightly from the side so we can tell it rises. TWO
OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a person to stand on with room to
spare, one about a third of the way up and one about two thirds of the way up, and the staircase
ends at the top landing where the table is.

THE STAIRCASE CONTINUES DOWN AND OUT OF THE PICTURE ON THE LEFT - THIS IS THE PART THEY HAVE
ALREADY WALKED, AND IT MUST BE PLAINLY VISIBLE. Below and to the left of the couple, FOUR OR FIVE
MORE STEPS carry on downwards to the left and RUN OFF THE LEFT EDGE OF THE PICTURE, so we never
see where the staircase began. THIS LOWER STRETCH IS DRAWN AS CLEARLY AS THE REST - it takes up
roughly the LEFT SIXTH of the image, complete with its own handrail. It is NOT faded, NOT blurred,
NOT hidden behind a plant, NOT a tiny detail in the corner - a viewer must see at a glance that
the couple have already come up a good stretch of stairs. THOSE ALREADY-WALKED STEPS ARE THE
PALEST BLUE (#7d9cc0). The steps the couple are standing on now, and everything above them, get
deeper as they rise: #5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline
(#182f4b). A simple warm wooden handrail runs along the outer edge the whole way. Count only
EIGHT STEPS between the couple and the table - the climb that is LEFT must look SHORT. NO spiral,
NO helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is plain pale warm
background and nothing else. NOTHING may cross that line: not a head, not a raised hand, not a
strand of hair, not the tip of a flag or its pole, not a step, not a plant, not a bird, not a
wisp of steam. Compose so that THE HIGHEST THING IN THE PICTURE - the grandmother's head and the
upper flag - still sits comfortably below it, with a clear band of empty background above
everything.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.
   THE CLINIC PEOPLE ALL HAVE THE SAME BLUE-BLACK HAIR - the dentist and both clinic workers:
   a flat shape in DEEP BLUE-BLACK (#202d3c), shaded #131b26, WITH ONE CLEAR COOL BLUE HIGHLIGHT
   (#344a65) across the top of the head - dark, but unmistakably BLUE-black, never neutral black,
   never brown, never grey. THE PATIENT, HIS WIFE AND THE FAMILY AT THE TABLE KEEP ORDINARY HAIR
   (warm dark brown, or grey and white for the older ones) - the blue-black hair belongs only to
   the clinic team.

2. GROUP A - THE PATIENT IS ALREADY ON THE STAIRS AND HE IS CALLING UP TO THE TABLE. A man of
   about FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), STANDING WITH BOTH FEET ON THE STEPS
   THEMSELVES, WELL ABOVE THE BOTTOM OF THE PICTURE - never on flat ground, never at the very
   start of the staircase, with several already-walked steps visible below and behind him - one
   foot lifting onto the next step, body turned upward,
   ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a cheerful shout - he
   is answering the family who are calling him. He is the largest figure in the picture, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM ON THE SAME STEP. A woman of about fifty in a moss-green top
   (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the climb ahead - they
   are in the middle of walking, not standing still.

4. GROUP A - THE DENTIST IS SHOWING THEM ON A MAP THAT THEY ARE NEARLY THERE. A woman in her
   forties standing on the step just above them and turned back towards them, WEARING AN OPEN
   WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7, shaded #99a7b8), no mask, no gloves, hair in the deep blue-black described above, tied back. SHE IS DEFINITELY HOLDING AN OPEN PAPER MAP - THIS IS NOT OPTIONAL - HELD UP
   IN ONE HAND AND TURNED SO THE COUPLE CAN SEE IT, big enough to read as a map at a glance, AND HER OTHER HAND POINTS UP THE STAIRCASE TOWARDS THE TABLE - the clear message is "we
   are nearly there". THE MAP IS SIMPLE AND CARRIES NO WRITING AT ALL: just a folded sheet of
   warm cream paper with ONE WINDING LINE AND THREE OR FOUR SMALL DOTS drawn on it. She is
   smiling at them, NOT touching them, NOT holding a clipboard, NOT holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: A GRANDMOTHER OF ABOUT SEVENTY STANDING UP AND SHOUTING
   WITH REAL ENERGY - THIS IS THE LIVELIEST FACE IN THE PICTURE. Her whole body and face are
   turned down and to the LEFT towards the couple on the stairs; BOTH HANDS ARE OPEN, PALMS
   FORWARD, HELD UP BESIDE HER MOUTH like a megaphone, fingers spread; HER MOUTH IS WIDE OPEN IN
   A BIG ROUND SHOUTING "O" (draw it as a clear open oval, the largest mouth in the picture);
   HER EYEBROWS ARE RAISED HIGH and her eyes are creased into cheerful curves; TWO OR THREE SHORT
   INK STROKES fly off beside her mouth to show the sound carrying. Her whole upper body leans
   forward over the table towards the stairs. Her eyes follow the line of the stairs down to the
   man in the ochre shirt - NOT out at the viewer, NOT to the right, NOT at the table. Keep her
   face in the house style all the same: ONE FLAT SKIN TONE, no wrinkles, no shading, no lines on
   the cheeks or forehead - the liveliness comes ENTIRELY from the open mouth, the raised
   eyebrows, the spread hands, the leaning body and the little sound strokes; A YOUNG MAN OF ABOUT THIRTY CARRYING ONE MORE STEAMING DISH IN FROM THE side,
   mid-stride; and A GIRL OF ABOUT TEN kneeling up on her chair and ALSO WAVING DOWN AND TO THE
   LEFT at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture, with its already-walked stretch trailing away into the distance
at the lower left; GROUP A stands ON THE STEPS in the lower left quarter, their feet close to the
bottom edge and their heads reaching about halfway up the picture; the two flagged landings sit
along the middle of the diagonal; the table and GROUP C sit in the upper right, with their heads
well below the empty top strip; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain; a staircase that simply begins at the
bottom-left corner with nothing below it; the already-walked steps drawn faint, blurred, tiny or
hidden behind plants; a dentist with empty hands or with the map put away; any writing, letters, place names or
symbols on the map; a treasure map, a pirate map or a game minimap;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; anybody calling or waving out of the picture instead of down the
stairs; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


### Ⓦ 奶奶站到桌子左邊（第十三輪・完整版，可直接複製）

⚠ 使用者：**「頭髮對了，但奶奶沒有轉過去」**。
⚠⚠ 這一輪的判斷：**她不轉身，是因為她的位置讓那個轉身不合理** ——
前兩版她站在**餐桌後面**，要朝左下喊就得越過整張桌子，模型於是把她畫回正面。
**改姿勢沒有用，要改位置**：把她移到**餐桌的左側、最靠近樓梯的那一邊**，桌子在她右後方，
她和樓梯之間什麼都沒有；再用幾何講朝向（**肩、鼻、下巴、視線全部指向左下**，
「從她嘴巴拉一條直線會沿著樓梯落到那位先生身上」）。
⚠ 順手把頂端安靜區改成**有餘裕的門檻**：所有的頭、舉起的手、旗尖都要在
**畫面上方五分之一（628 的 126px）以下** —— 前一版寫「不可以越過 105」，
模型仍然把奶奶的頭放在約 62px；給一條**比真正的界線更保守的線**才守得住。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview card.
It will be seen at about 250 pixels wide, so everything must read at thumbnail size: big simple
shapes, few large objects, ONE single continuous scene, no panels, no dividing lines, no insets.

THE STORY IN ONE SENTENCE - READ THIS BEFORE DRAWING ANYTHING: a middle-aged man and his wife
ARE ALREADY PART-WAY UP a short, friendly staircase - the first stretch of it runs away behind
them into the distance, so we can see how far they have come - and beside them A DENTIST IS
HOLDING AN OPEN MAP, POINTING UP AHEAD TO SHOW THEM THEY ARE NEARLY THERE. Two landings above
are little checkpoints where clinic staff hand out supplies and cheer them on, and AT THE TOP HIS
FAMILY IS ALREADY SITTING AROUND A TABLE FULL OF FOOD, CALLING DOWN TO THEM TO COME AND EAT.
Everybody wants him to get there, AND HE IS CLOSE. THE WHOLE PICTURE IS ONE LIVELY MOMENT WITH
THINGS MOVING - it is not a quiet, still scene.

THE PEOPLE ARE THE SUBJECT AND THEY ARE DRAWN BIG. The staircase is only the stage. THE PICTURE
IS BUILT AS THREE TIGHT GROUPS strung along one diagonal, with clear empty space between the
groups so each one reads separately at thumbnail size:
  GROUP A, bottom left and NEAREST: the patient, his wife and the dentist - the biggest figures,
  about 45% of the picture height.
  GROUP B, the middle of the staircase: ONE clinic worker on each of TWO LANDINGS - about 30% and
  26% of the picture height.
  GROUP C, upper right and furthest: THREE family members around a table of food - about 22% of
  the picture height.

THE STAIRCASE: a short, friendly HALF-TURN staircase with broad treads and low risers, climbing
from the lower left to the upper right, seen slightly from the side so we can tell it rises. TWO
OF THE STEPS ARE MUCH LARGER FLAT LANDINGS, big enough for a person to stand on with room to
spare, one about a third of the way up and one about two thirds of the way up, and the staircase
ends at the top landing where the table is.

THE STAIRCASE CONTINUES DOWN AND OUT OF THE PICTURE ON THE LEFT - THIS IS THE PART THEY HAVE
ALREADY WALKED, AND IT MUST BE PLAINLY VISIBLE. Below and to the left of the couple, FOUR OR FIVE
MORE STEPS carry on downwards to the left and RUN OFF THE LEFT EDGE OF THE PICTURE, so we never
see where the staircase began. THIS LOWER STRETCH IS DRAWN AS CLEARLY AS THE REST - it takes up
roughly the LEFT SIXTH of the image, complete with its own handrail. It is NOT faded, NOT blurred,
NOT hidden behind a plant, NOT a tiny detail in the corner - a viewer must see at a glance that
the couple have already come up a good stretch of stairs. THOSE ALREADY-WALKED STEPS ARE THE
PALEST BLUE (#7d9cc0). The steps the couple are standing on now, and everything above them, get
deeper as they rise: #5f83ab, then #476e97, then #335b8b, each with a soft dark navy outline
(#182f4b). A simple warm wooden handrail runs along the outer edge the whole way. Count only
EIGHT STEPS between the couple and the table - the climb that is LEFT must look SHORT. NO spiral,
NO helix, NO long flight of many steps, NO ladder.

THE TOP STRIP OF THE PICTURE MUST STAY COMPLETELY EMPTY - THIS IS A HARD RULE AND THE LAST
VERSION BROKE IT. The upper 17% of the image (the top 105 pixels of 628) is plain pale warm
background and nothing else. NOTHING may cross that line: not a head, not a raised hand, not a
strand of hair, not the tip of a flag or its pole, not a step, not a plant, not a bird, not a
wisp of steam. GIVE YOURSELF A MARGIN: compose so that EVERY head, EVERY raised hand and EVERY
flag tip sits BELOW A LINE ONE FIFTH OF THE WAY DOWN FROM THE TOP (about 126 of the 628 pixels).
The grandmother's head and the upper flag are the highest things in the picture and they must
both start below that line, with a clear band of plain background above everything.

THE NINE THINGS THAT MATTER MOST, IN ORDER:

1. DRAW EVERY PERSON EXACTLY IN THE STYLE OF THE REFERENCE ILLUSTRATIONS. Thin hand-drawn
   linework whose weight varies and sometimes breaks - NOT a thick even outline. Each face is
   ONE FLAT SKIN TONE with no shading and no modelling: on a face there is only the outline, two
   eyes drawn as small simple dots with no whites and no highlights, two short eyebrows, a tiny
   nose mark, a small mouth and an ear - nothing else, no wrinkles, no cheek lines, no jaw
   shading. Hair is a flat shape in two tones with no individual strands. EVERY PERSON IS DRAWN
   WITH EXACTLY THE SAME LINE WEIGHT AND THE SAME SOLIDITY - nobody is paler, softer, thinner or
   more transparent than anybody else. EVERYONE LOOKS DIFFERENT: different age, hair, build and
   clothes. Fine paper grain over the whole image.
   THE CLINIC PEOPLE ALL HAVE THE SAME BLUE-BLACK HAIR - the dentist and both clinic workers:
   a flat shape in DEEP BLUE-BLACK (#202d3c), shaded #131b26, WITH ONE CLEAR COOL BLUE HIGHLIGHT
   (#344a65) across the top of the head - dark, but unmistakably BLUE-black, never neutral black,
   never brown, never grey. THE PATIENT, HIS WIFE AND THE FAMILY AT THE TABLE KEEP ORDINARY HAIR
   (warm dark brown, or grey and white for the older ones) - the blue-black hair belongs only to
   the clinic team.

2. GROUP A - THE PATIENT IS ALREADY ON THE STAIRS AND HE IS CALLING UP TO THE TABLE. A man of
   about FIFTY-FIVE in a warm ochre polo shirt (#c08a5c), STANDING WITH BOTH FEET ON THE STEPS
   THEMSELVES, WELL ABOVE THE BOTTOM OF THE PICTURE - never on flat ground, never at the very
   start of the staircase, with several already-walked steps visible below and behind him - one
   foot lifting onto the next step, body turned upward,
   ONE ARM RAISED HIGH WAVING TOWARDS THE TOP OF THE STAIRS, mouth open in a cheerful shout - he
   is answering the family who are calling him. He is the largest figure in the picture, about
   45% of the picture height. He is NOT struggling, NOT hunched, NOT nervous.

3. GROUP A - HIS WIFE IS BESIDE HIM ON THE SAME STEP. A woman of about fifty in a moss-green top
   (#8a9a72), ONE ARM HOOKED THROUGH HIS, her other hand raised in a small wave towards the
   table, laughing and looking up. Their two bodies clearly lean towards the climb ahead - they
   are in the middle of walking, not standing still.

4. GROUP A - THE DENTIST IS SHOWING THEM ON A MAP THAT THEY ARE NEARLY THERE. A woman in her
   forties standing on the step just above them and turned back towards them, WEARING AN OPEN
   WHITE COAT OVER MUTED BLUE-GREY SCRUBS (#b7c5d7, shaded #99a7b8), no mask, no gloves, hair in the deep blue-black described above, tied back. SHE IS DEFINITELY HOLDING AN OPEN PAPER MAP - THIS IS NOT OPTIONAL - HELD UP
   IN ONE HAND AND TURNED SO THE COUPLE CAN SEE IT, big enough to read as a map at a glance, AND HER OTHER HAND POINTS UP THE STAIRCASE TOWARDS THE TABLE - the clear message is "we
   are nearly there". THE MAP IS SIMPLE AND CARRIES NO WRITING AT ALL: just a folded sheet of
   warm cream paper with ONE WINDING LINE AND THREE OR FOUR SMALL DOTS drawn on it. She is
   smiling at them, NOT touching them, NOT holding a clipboard, NOT holding any instrument.

5. THE TWO LANDINGS ARE CHECKPOINTS, AND EACH ONE HAS A FLAG WITH A NUMBER ON IT. On the FIRST
   (lower) landing stands A SMALL TRIANGULAR PENNANT FLAG on a short pole, and the flag carries
   ONE LARGE CLEAR NUMERAL: 1. On the SECOND (upper) landing an identical pennant carries ONE
   LARGE CLEAR NUMERAL: 2. THE FLAGS ARE BLOWING SIDEWAYS as if in a light breeze. THESE TWO
   NUMERALS ARE THE ONLY WRITTEN CHARACTERS ANYWHERE IN THE PICTURE - no words, no letters, no
   other numbers, nothing written on anything else.

6. GROUP B - A CLINIC WORKER IS WAITING AT EACH CHECKPOINT TO HELP HIM THROUGH IT. On the FIRST
   landing, a young man in blue-grey scrubs LEANING FORWARD AND HOLDING OUT A SMALL WATER BOTTLE
   AND A FOLDED TOWEL with both hands, ready to pass them to whoever arrives - like handing out
   supplies at a checkpoint. On the SECOND landing, a woman in blue-grey scrubs WITH BOTH ARMS UP,
   CLAPPING AND BECKONING THEM ONWARD, one foot forward, clearly in motion. Both are cheerful and
   turned back down the stairs towards the couple. NEITHER of them holds any medical instrument.

7. GROUP C - THE FINISH LINE IS A TABLE FULL OF FOOD, AND THE FAMILY IS CALLING THEM UP. On the
   wide TOP LANDING, a round wooden table properly loaded with ORDINARY FAMILY FOOD: a whole
   steamed fish on an oval plate, a plate of braised meat on the bone, a plate of whole prawns,
   a plate of green vegetables and bowls of white rice, with two or three wisps of steam rising.
   THIS IS NORMAL FOOD FOR PEOPLE WHO CAN CHEW - absolutely no porridge, no congee, no soup-only
   meal, no mashed or pureed food. Around it: THE GRANDMOTHER - AND WHERE SHE STANDS
   MATTERS MORE THAN ANYTHING ELSE ABOUT HER. A woman of about seventy STANDING ON THE LEFT-HAND
   SIDE OF THE TABLE, THE SIDE NEAREST THE STAIRS, WITH THE TABLE BEHIND HER TO HER RIGHT - she
   is NOT standing behind the table, NOT on the far side of it, NOTHING is between her and the
   staircase. WE SEE HER IN THREE-QUARTER PROFILE FROM HER RIGHT SIDE: her shoulders, her nose,
   her chin and her eyes ALL POINT DOWN AND TO THE LEFT, straight along the staircase towards the
   man in the ochre shirt, who is far below her at the bottom left of the picture. If you could
   draw a straight line from her mouth it would run down the stairs to him. SHE IS SHOUTING WITH
   REAL ENERGY - THIS IS THE LIVELIEST FACE IN THE PICTURE: BOTH HANDS OPEN, PALMS FORWARD, HELD
   BESIDE HER MOUTH LIKE A MEGAPHONE with the fingers spread; HER MOUTH WIDE OPEN IN A BIG ROUND
   SHOUTING "O" (a clear open oval, the largest mouth in the picture); HER EYEBROWS RAISED HIGH,
   her eyes creased into cheerful curves; her upper body LEANING FORWARD AND DOWNWARD towards the
   stairs; and TWO OR THREE SHORT INK STROKES flying off to the LEFT of her mouth, in the
   direction she is shouting, to show the sound carrying down to him. Keep her face in the house
   style: ONE FLAT SKIN TONE, no wrinkles, no shading, no lines on the cheeks or forehead - the
   liveliness comes ENTIRELY from the open mouth, the raised eyebrows, the spread hands, the
   leaning body and the sound strokes. She must NOT face the viewer, NOT face right, NOT face the
   table, NOT stand upright and calm; A YOUNG MAN OF ABOUT THIRTY CARRYING ONE MORE STEAMING DISH IN FROM THE side,
   mid-stride; and A GIRL OF ABOUT TEN kneeling up on her chair and ALSO WAVING DOWN AND TO THE
   LEFT at the couple with both hands. They are clearly shouting
   "come and eat" - happy, noisy and welcoming.

8. THE WHOLE SCENE IS IN MOTION - THIS IS WHAT MAKES IT WORK. Everybody is mid-action: a foot
   lifting onto a step, an arm swinging up, a dish being carried, hands clapping, flags snapping
   in the breeze, a small brown sparrow flying across the picture. Add a FEW light hand-drawn
   motion marks - two or three short curved strokes beside a waving arm or a fluttering flag -
   drawn in the same thin ink line as everything else. Keep them few and light; they are never
   arrows and never speed stripes.

9. COLOUR AND LIGHT. A soft warm off-white background (#e7e4dd) in clear bright daylight, with a
   gentle pool of warm light around the top landing and the table so the eye travels up to it.
   Three or four big rounded potted plants sit on and beside the steps and one large leafy plant
   leans in from the bottom right corner. At least six clearly different colours: off-white
   background, warm wood handrail and table, the four blues of the steps, ochre polo shirt,
   moss-green top, white coat, blue-grey scrubs, green plants, and the warm colours of the food.
   Most colour blocks sit around HSL saturation 30-50 and lightness 70-85. Flat fills in two or
   three steps per colour, no gradients except to describe light. NO LARGE FLAT EMPTY AREAS
   ANYWHERE; no dusk, no golden hour, no orange cast, no dark corners, no long shadows.

COMPOSITION ANCHORS: the staircase runs from the lower left to the upper right and occupies the
lower two thirds of the picture, with its already-walked stretch trailing away into the distance
at the lower left; GROUP A stands ON THE STEPS in the lower left quarter, their feet close to the
bottom edge and their heads reaching about halfway up the picture; the two flagged landings sit
along the middle of the diagonal; the table and GROUP C sit in the upper right, with their heads
well below the empty top strip; everything that must be read sits inside the middle 73% of the
width; the top 17% stays completely empty.

AVOID: any text, letters, words or logos anywhere in the image; any number other than the single
numerals 1 and 2 on the two flags; scoreboards, health bars, coins, treasure chests, game menus,
level-up effects, sparkles, stars, trophies, medals, finish-line tape, banners with writing,
balloons or confetti; teeth, dentures, toothbrushes, dental instruments, dental chairs, syringes,
X-rays, screens, clipboards, clinics or hospitals; porridge, congee, mashed or pureed food,
medicine bottles; tiny figures dwarfed by a huge staircase; a long, steep or endless flight of
stairs; stairs that run off the top edge; a spiral that coils around itself; a ladder; a mountain; a staircase that simply begins at the
bottom-left corner with nothing below it; the already-walked steps drawn faint, blurred, tiny or
hidden behind plants; a dentist with empty hands or with the map put away; any writing, letters, place names or
symbols on the map; a treasure map, a pirate map or a game minimap;
a motivational-poster feeling; anybody straining, panting, hunched, being carried or dragged;
anybody punching the air; a silhouette against a bright sky; a heroic backlit figure; anybody
drawn faded, translucent, ghostly or outline-only; anybody looking at the viewer; anybody calling or waving out of the picture instead of down the
stairs; a cast of only
elderly people; panels, insets, speech bubbles, arrows, small icons; dusk, sunset, golden hour, an
orange or sepia cast; bare empty backgrounds; grey or blue-white walls; photorealism; 3D
rendering; heavy even black outlines.
```


---

## 六、✅ 2026-08-25 定稿（第十三輪那一張）—— 量測與帶子

原檔 `drafts/og-topic-prosth-src.jpg`（1422×752）。兩步：

    node tools/og-resize.mjs drafts/og-topic-prosth-src.jpg prosth
    node tools/og-plate.mjs prosth --blend multiply --tintcolor '#3971bd' \
      --ink 0.18 --blur 6 --loc full --locpos stack

⚠ 補償色 `#3971bd` 是算出來的：頂 17% 的實測中位色 **rgb(233,229,217)**，
`M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆` → 58 / 113 / 189。

| | 值 | 門檻 |
| --- | --- | --- |
| 裁切 | 左右 0.00%／上下 −1.04% | < 8% ✅ |
| 無彩空白 | **0.6%** | < 5% ✅ |
| 邊緣密度 | **25.6%** | ≥ 30% ❌ **差 4.4** |
| 每個人的線一樣實 | 53.8 / 56.0 / 62.3 / 62.7（相差 **8.9 階**） | < 20 ✅ |
| 頂 17% 的中位色 | R233 G229 B217 | B ≥ 161 ✅ |
| 帶子實際落在 | **rgb(50,91,137)** ＝ 逐格命中套色 `#335b8b` | — |
| 紙色字對帶子 | **中位 5.54・最亮處 5.42** | ≥ 4.5 ✅✅ |

⚠⚠ **這是七科第一次「套色版」就過 4.5**（一般牙科 4.40、兒牙套色只有 2.54 只好退深階）。
成因是這張的頂端是**亮的米白牆**（233/229/217），補償空間充足。深階版量到 10.7，
顏色會對不上站上那顆標籤，**所以定案用套色版**。

### ⚠⚠ 兩件還沒解決的

1. **端菜的年輕人整顆頭被帶子切掉了。** 最高的墨實測在 **y=59**，而帶子高 104px
   （安靜區 105）。第十三輪的提示詞已經寫了「所有的頭與旗尖要在 126px 以下」，
   模型沒守住。→ 要重生成，或接受。
2. **邊緣密度 25.6% 未達 30%。** 這一張的空白是**淺色背景**不是無彩空白
   （palePct 只有 0.6%），視覺上不空，但門檻是使用者 2026-08-22 自己定的，
   要不要放行由他決定。

### 六之一、✅ 定案的做法：**不重生成，把圖往下移 45px**（2026-08-25）

使用者：「感覺圖片可以往下移，比較不會被帶子壓到上面的人。」

    node drafts/og-shift.mjs drafts/og-topic-prosth-src.jpg prosth --shift 45
    node tools/og-plate.mjs prosth --blend multiply --tintcolor '#3971bd' \
      --ink 0.18 --blur 6 --loc full --locpos stack

⚠⚠ **新工具 `drafts/og-shift.mjs`**（這一輪寫的，七科都可以用）：把內容整體往下移、
上方補**原圖最上面三列的中位色**、底部裁掉同樣的高度。
**填充色是量出來的（rgb 233,229,217），所以接縫看不出來** —— 頂端本來就是純色背景。
⚠ 代價是**底部被裁掉 77px**（1.91:1 是硬規格，不能改）：兩盆前景盆栽只剩上半、
階梯前緣少一截。**前景元素被畫框裁切在插畫裡是自然的**，使用者接受。

| | 移之前 | 移之後 |
| --- | --- | --- |
| 最高的墨 | y=**59**（帶子高 104 → 端菜的人整顆頭被切掉） | y=**132** ✅ 帶子下方還有 28px 餘裕 |
| 紙色字對帶子 | 5.54 / 5.42 | **5.54 / 5.50** ✅ |
| 邊緣密度（整張） | 25.6% | 22.8%（上方多了一條純色） |
| **邊緣密度（帶子以下）** | — | **28.3%** ← 讀者真正看得到的那塊 |

⚠ **密度要量「帶子以下」才有意義**（帶子會蓋掉上緣 104px）。28.3% 仍略低於 30% 的門檻，
成因是這一張的背景是大片**淺色牆**（無彩空白只有 0.6%，和「像鬼屋」那版是兩回事）。
**放行與否由使用者決定** —— 那個門檻是他 2026-08-22 自己定的。

### 六之二、⚠⚠ 位移量不是挑的，是**兩端夾出來的**（2026-08-25）

第一次移了 70px，使用者：「**可是左下登階的人腳被切到了，取個中間值。**」
→ 位移有**上下兩個限制**，量出來才知道區間有多窄：

| 限制 | 量到的位置（未位移） | 得到的條件 |
| --- | --- | --- |
| 頭不能被帶子壓到 | 端菜男士的頭頂 **y=61**、奶奶 63、旗子 2 是 95 | 帶子高 104 → **D ≥ 43** |
| 鞋不能被畫面切到 | 左下三人的鞋褲最低 **y=581** | 畫面高 628 → **D ≤ 47** |

**可行區間只有 43~47，取 45。** 兩端各剩 2px 餘裕。

⚠⚠ **量鞋子不能用「亮度 < 80」找最低的墨** —— 階梯的立面是深藍（`#335b8b` 一族），
整條底邊都會命中，量出來永遠是 627。**要用顏色分**：鞋與褲是**暖色的深**（R > B + 18），
階梯是藍（B > R）。換這個判準之後才量到真正的 581。

| | 移 70 | **移 45（定案）** |
| --- | --- | --- |
| 端菜男士的頭頂 | 131 ✅ | **106** ✅（帶子下緣 104） |
| 左下三人的鞋 | 651 ❌ 被切 23px | **626** ✅ 剩 2px |
| 底部裁掉 | 77px | **52px** |
| 紙色字對帶子 | 5.54 / 5.50 | **5.54 / 5.42** ✅ |
| 帶子以下的邊緣密度 | 28.3% | **29.9%**（門檻 30，差 0.1） |
