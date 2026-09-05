# 〈三個月一次的洗牙與塗氟〉的 HERO — 五個提案（2026-09-05）

文章草稿：`drafts/three-month-recall/ARTICLE-v5.md`
提案頁：`/preview/three-month-recall-hero/`

⚠ **這一份是提案，不是定稿。** 使用者挑完之後，被選上的那一份要照
ILLUSTRATION.md 第七節第 19 條**逐字留在 repo 裡**，日後改圖只換出問題的那一段。

---

## 一、挑這五個的判準

**這一篇的定位**（COPY-v1.md）：〈半年一次的洗牙〉講的是「那一次在做什麼」＝**動作**；
這一篇講的是「**誰的嘴和半年這個數字對不上**」＝**對象**。所以圖的主詞要是人或人的處境，
不是療程。

**已經用過、不要再用的結構**（同一排卡片上會並排，撞了就變成同一個模子）：

| 已上線 | 結構 |
| --- | --- |
| 〈半年一次的洗牙〉`hero-checkup` | **一個大場景塞很多小事**（櫃檯＋候診區，十幾個人）—— ⚠ 同一科、卡片會並排，**這一張絕對不能再做熱鬧的候診室** |
| 〈牙齦流血〉`hero-gum` | 四格退火，同機位、變的是時間 |
| 〈拔智齒〉`hero-wisdom` | 人 ＋ 一個大泡泡分三段 ＋ 右側第二格 |
| 〈擴張牙弓〉`hero-arch` | 三格因果鏈 ＋ 放大圈 |
| 〈孩子第一次看牙〉`hero-kids` | 人是主角的喜悅場面 |

**五個提案各自對到文章的哪一段**：

| | 梗 | 對到 | 結構 |
| --- | --- | --- | --- |
| **Ⓐ** | 同一張椅子，四個不同的人 | 〈哪些人適用〉 | 同機位重複，**變的是人** |
| **Ⓑ** | 桌上那一攤（藥袋、用藥紀錄） | 〈來的時候〉 | 一個放大的日常物件當整個環境 |
| **Ⓒ** | 阿公和孫女一起塗氟 | 〈年紀大了，氟的角色會變〉 | 人是主角的喜悅場面 |
| **Ⓓ** | 人 ＋ 一個大泡泡三段 | 〈為什麼是三個月〉 | 拔智齒那個結構（⚠ 重複，見下） |
| **Ⓔ** | 同一扇窗，一年裡回來幾次 | 〈不只是把牙結石清掉〉 | 同機位重複，**變的是季節** |
| **Ⓕ** | **不規則分格 ＋ 中間一位醫師**（Ⓐ 的改寫） | 〈哪些人適用〉 | 鑲嵌式分格，**4:3** |

⚠ **Ⓓ 和〈拔智齒〉同結構**，放進來是因為它是唯一畫得出「口乾／血糖／慢癒合」那三件的
做法；**要選它就要接受兩張圖的骨架一樣**（泡泡裡的內容完全不同，但一眼看過去會像親戚）。

**建議 Ⓐ 主推、Ⓒ 次推。** 理由：
・Ⓐ 直接畫「對象」＝ 文章的定位，而且**一眼破掉「這是老人的事」那個刻板印象**
　（ILLUSTRATION.md 第七節第 14 條：缺牙那篇踩過「爺爺的意象太明顯」）。
・Ⓒ 解掉整篇最反直覺的一句「塗氟不再只是小孩才做的事」，而且是喜悅的場面、記憶點最高。
・Ⓑ 最不像牙科插畫、辨識度最高，但它只講到最後一段。
・Ⓔ 最安靜、最像站上的調性，但它講的是「常來」不是「誰」。

---

## 一之二、⚠⚠ 2026-09-05：不再拘泥 16:9（使用者指定）

使用者：「**之前的尺寸都是很扁的，所以這個框這樣畫下去就會不好看**……
其實我們不需要這麼拘泥於每次都用橫幅的……用一些比較符合新的我們概念上的
**垂直比例拉高**一點的尺寸來畫畫看。」

**站上十一張 HERO 全部是 2000×1116（1.792:1）。** 這一張要拉高，先量代價：

| 比例 | 375 | 390 | 430 | 744 | 1440 |
| --- | --- | --- | --- | --- | --- |
| **16:9（現況）** | 195／24% | 204／24% | 226／24% | 371／33% | 369／41% |
| 3:2 | 231／28% | 241／29% | 268／29% | 440／39% | 437／49% |
| **4:3（建議）** | 260／32% | 272／32% | 302／32% | 495／44% | **492／55%** |
| 5:4 | 278／34% | 290／34% | 322／35% | 528／47% | 525／58% |
| 1:1 | 347／43% | 362／43% | 402／43% | 659／58% | **656／73%** |
| 4:5 | 434／53% | 453／54% | 503／54% | 824／73% | **820／91%** |

（圖高 px ／佔那個視窗一屏的百分比。內文欄寬 375 上 347、1440 上 656，
`.post-hero img` 是 `height: auto`，所以**文章頁不會破圖，只是變高**。）

⚠⚠ **卡住的不是手機是電腦版**：1440 上內文欄 656px，1:1 就吃掉 **73% 的螢幕**、
4:5 是 **91%**（＝點進文章第一眼只有一張圖）。**4:3 的 55% 還在可以接受的一側。**

### ⚠⚠⚠ 三個一定會被波及的地方

1. **首頁文章卡的縮圖是 `aspect-ratio: 16/9` ＋ `object-fit: cover`** ——
   十一張卡並排，**不能為了一張圖改掉**（改了另外十張全部要重裁）。
   所以拉高的圖在卡片上會**只露出中間一條**：
   ・4:3 → 露出高度的 **75%**（上下各切 12.5%）
   ・5:4 → 70%　　・1:1 → **56%**　　・4:5 → 45%
   **→ 這是構圖的硬條件：最重要的東西要落在中間那 75% 裡**（同分享卡那條
   「在成品的尺寸上量，不要在素材的尺寸上量」）。延伸閱讀那三張卡同理。
2. **`tools/hero-resize.mjs` 會擋下來** —— 它寫死 `RATIO = 2000/1116`、容差 ±0.02，
   比例不對就拒絕寫檔。要改成可以指定比例（**等挑定再改，兩行**）。
3. **`tools/build.mjs` 的卡片與延伸閱讀寫死 `width="2000" height="1116"`** ——
   要改成用它自己已經有的 `jpegSize()` 讀真實尺寸。文章頁那一行是手寫的，跟著改。

⚠ `sizes` **不必動**（那三段講的是**寬度**，欄寬沒有變）。
⚠ `og:image` 指的就是這張 HERO，寬高由 `jpegSize()` 讀 —— 會自己對，
但**訊息 app 的卡片槽約 1.5:1**，比它高的圖會被上下裁；4:3 只差一點，1:1 以上就明顯。

**建議 4:3（2000×1500）。** 它落在你給的兩張參考圖中間
（絨毛玩偶那張跨頁約 1.45:1、羽扇豆那張 1:1），電腦版 55%、卡片還看得到 75%。

---

## 二、五個提案的畫面與擋的坑

### Ⓐ 同一張椅子，四個不同的人

橫向四等分，**同一張診療椅、同一個機位、同一位女醫師站在同一個位置**，
坐上去的人每一格不同：三十幾歲的孕婦／五十幾歲的男性上班族／七十幾歲的阿嬤／
四十幾歲綁著頭巾的女性。醫師的動作每一格微調（拿口鏡看／側頭聽／遞漱口杯／笑著點頭）。

・**身分靠手邊的東西給，不靠身體給** —— 媽媽手冊、膝上的藥袋、靠著椅子的拐杖、
　手邊的保溫杯。⚠ 不要畫點滴、不要畫輪椅、不要畫病容，那會把人變成病例。
・⚠ **不要讓四個人變成型錄**：每個人的姿勢、視線、表情各自不同，衣服顏色互不重複。
・這是 ILLUSTRATION.md 第七節第 2 條那個「同一個機位重複、只有一件事在變」，
　站上最好讀的手法 —— 但〈牙齦流血〉那張變的是時間，這一張變的是人。

### Ⓑ 桌上那一攤

一格，微微俯視。**一張淺木色的診間桌面幾乎佔滿整張圖**（第三節構圖 (a)：
一個放大的日常物件當整個環境）。桌上是一個牛皮紙藥袋、幾板藥、一本翻開的用藥紀錄、
一張健保卡、一副老花眼鏡、一杯水。上方入畫的是兩雙手：病患的手把藥袋推過去，
醫師的手扶著小冊。畫面上緣只露出一點診療椅的扶手與白袍下襬。

・⚠⚠ **這一格長字的風險最高**（藥板、小冊、卡片、藥袋都是「該有字的表面」）——
　`NO WRITING` 那一段要逐項點名（第七節第 4 條）。
・⚠ 概念外溢（第八節第 6 條）：桌上每多一個「沒指定內容的表面」就多一個落點，
　所以每一樣東西的表面都寫死。

### Ⓒ 阿公和孫女一起塗氟

診間裡兩張並排的椅子。右邊小孫女剛塗完氟，護理師遞給她一張貼紙，她很得意；
左邊的阿公也剛塗完，手上拿著一張一模一樣的貼紙，有點好笑又有點得意地看著孫女；
中間的媽媽笑出來。

・人是主角、可以置中、可以佔畫面一大半 —— ILLUSTRATION.md 第三節 2026-08-16 那條放寬，
　**條件是「那一篇的重點就是一個家庭的時刻」**，這一格成立。
・⚠ **貼紙上不能有字**，畫一顆簡單的牙或一顆星星。
・⚠ **旁邊的人不可以看起來在笑他**（第七節第 14 條，缺牙那篇踩過）——
　要寫成「一起覺得好玩」，不是「笑一個老人在做小孩的事」。

### Ⓓ 人 ＋ 一個大泡泡三段

左三分之二是診間，女醫師與五十幾歲的病患坐著談；上方一個**大圓角泡泡**、
**兩條細分隔線**分成三段（⚠ 不是三個獨立泡泡、不要箭頭，第八節第 2 條），
畫的是**生活場景不是醫學圖**：① 半夜起來倒水喝 ② 早餐前在餐桌上量血糖
③ 早上刷牙時停下來，對著鏡子拉開下唇看一處紅腫的牙齦。

・⚠ 三段都不要器械、不要剖面圖 —— 第七節第 11 條：使用者嫌過「太學術了，
　是我們看模型或書上才會出現的樣子」。
・⚠ 牙齦的紅要靠**形狀**（邊緣鼓起、乳突最腫）不是色名，而且**不要畫血**
　（第七節第 18 條最後一段）。

### Ⓔ 同一扇窗，一年裡回來幾次

橫向三等分，**同一個診所窗邊的同一張椅子、同一個六十幾歲的男人坐著等**，
三格的差別只有窗外：綠葉的樹／下著雨／葉子黃了。他每一格穿的不一樣
（短袖 → 薄外套 → 毛背心），手上的東西也不同（帽子／傘／保溫杯）。

・講的是「這件事已經是他生活的一部分」——〈不只是把牙結石清掉〉那一段的情緒。
・⚠ 這一格沒有任何「牙」的資訊，所以**識別物要自己列**（第七節第 3 條）：
　牆上無字的牙齒海報、門內露出的診療椅一角、淺色刷手服。
・⚠ 窗外的雨要畫成**一群同向的短線**，不是一條長曲線（第三節那條，
　〈擴張牙弓〉的靈魂出竅踩過）。


### Ⓕ 不規則分格 ＋ 右下兩位醫事人員（2026-09-05 新增，Ⓐ 的改寫；09-05 晚間第二版）

**起因**：使用者看過五案之後選 Ⓐ，但指出它的毛病 ——
「**只有診療〔椅上〕的人不一樣，都一樣，所以畫面看起來很單調**」。
他給的方向：**每個不一樣的人單獨變成一個框**，框可以帶一點不規則、
或用對話框的方式，**中間是醫療人員**，讀起來像
「**這幾個人要特別注意自己牙齒的健康**」的呼籲。
參考圖是三張日本車站的海報（GRANSTA 的多角形分格、声かけサポート 的對話框、
カスハラ 的四格）。

**第一版出圖之後他提了五件**（2026-09-05 晚間）：
① 人物風格跟站上現有的不一樣，要重新參考　② 每個人的環境有點單調，要更寫實、
把環境細節加上去　③ 參考那三張海報：**人物和動作的細節清楚、周圍環境線條和顏色淡化**
④ 中間的醫事人員**多畫一個** —— 一個穿白袍、一個不穿，**刷手服顏色可以不一樣**
⑤ 動作與表情是 **「接納」** 和 **「介紹」**。

第二版照這五件改，四件改動：

・⚠⚠⚠ **風格不再只靠文字描述，改成餵站上自己的三張圖**（ILLUSTRATION.md 第七節第 19 條：
　**能餵參考圖就餵，文字描述風格一定會漂**）。哪三張、為什麼是那三張，見第三之二節。
　提示詞第一段就寫著「**文字和參考圖衝突時，以參考圖為準**」。
・⚠⚠ **「環境要更寫實」和「環境要淡化」不是互相矛盾，是兩件事** ——
　要的是**東西多、但畫得淡**。提示詞因此多了一整段
　「**兩層畫法**」：人物用最深最粗的線、衣服吃最強的顏色、在做什麼要最清楚；
　**房間裡的東西樣樣都畫，但線更細更淡、顏色更淡一階**，
　而且明寫「**環境的線永遠不可以和人的線一樣深、一樣粗**」。
　唯一的例外是那個人手上正拿著的東西（那是動作的一部分，跟著人用全力畫）。
・⚠⚠ **六格的家從一句話變成一張道具清單**（第七節第 3、18 條：**每一格要點名該有的道具，
　不寫就會變成空牆**）。第一版中間那格寫的是「only a hint of a clinic」——
　**單調就是這樣寫出來的**。現在六格各自有磁磚牆、瓦斯爐上的水壺、掛著的鍋鏟、
　竹編籃、立扇、塑膠桌巾、電鍋、鐵窗、瀝水架、藤椅、針織毯……
　中間那一格也從「一點診所的暗示」換成真的診所一角（玻璃門的器械櫃、一排無字的瓶罐、
　摺好的毛巾、只畫一顆牙的無字掛圖）。`AVOID` 補一條「不准有空房間、空牆、
　只有一個人加一張椅子的格子」。
・**中間變成兩個人**：醫師（三十幾歲、**白袍**穿在淺鼠尾草綠刷手服外面、低馬尾）站前半步，
　一手向外攤開介紹；護理師（四十幾歲、**只有刷手服**、**暗一階的青藍**、短髮）站後半步，
　手交疊在身前、側頭對著其中一格點頭。**接納**靠身體微微前傾與攤開的手，
　**介紹**靠兩個人都看向四周那幾格。⚠ 兩件刷手服的顏色都是站上既有的低彩度族
　（鼠尾草綠／青藍），**沒有新增顏色**；`AVOID` 另外擋掉「兩個人擺成一模一樣的姿勢」。

沒有動的三件（第一版就定下來的判斷）：

・⚠⚠ **格子做成不規則的多角形，不做對話框** —— 我們這一站的圖**一個字都不能有**
　（第七節第 4 條），而**空的對話框讀起來是「在想一件沒有內容的事」**；
　參考圖那三張全部靠文字說話，我們不能照抄那一半。
　**要對話框版我可以另出一份，一句話換掉。**
・⚠⚠ **兩位醫事人員都不看鏡頭** —— A 類紅線那一條仍然有效。呼籲靠**攤開的手**與
　**兩個人都在看那幾個人**給；看鏡頭指著讀者是另一種東西（而且離站上的調子很遠）。
　**要她們看鏡頭也是一句話的事，但要你點頭。**
・⚠⚠⚠ **上下各 12% 是「會被卡片切掉」的區域**（見第一之二節）：
　人臉與那幾樣關鍵的東西**一個都不可以放在那裡面**。

⚠ 順帶擋掉一組第一版沒防到的東西：**時鐘、月曆、手機螢幕、電腦螢幕、任何數位顯示** ——
六個家一寫實，這些東西就會自己長出來，而**它們身上一定會有數字**（＝第七節第 4 條那條
「一個字都不能有」的破口）。血糖機那個小螢幕也逐項點名了。

---

#### ⚠⚠⚠ 第三版（2026-09-05 更晚）：「還是比站上寫實了一點」

**先量過再改，量出來把方向修掉了。** 直覺的第一個猜測是「顏色太淡、太多留白」，
可是站上那十一張自己就分成兩群：

| | 近白（L\*>92） | 墨（L\*<45） | 彩度中位 |
| --- | --- | --- | --- |
| 〈牙齦流血〉 | 6.3% | 19.2% | 19.3 |
| 〈換牙〉 | 18.0% | 13.3% | 9.9 |
| 〈缺牙之後〉 | 17.1% | 12.9% | 13.5 |
| **〈定期檢查〉** | **48.0%** | 8.0% | 6.6 |
| **〈貝氏刷牙法〉** | **50.1%** | 6.1% | 4.8 |

**站上有兩張比第二版那一張還淡。所以「太寫實」不在顏色，也不在留白多少** ——
把顏色加濃只會改壞另一件事。

真正的成因是兩個，兩個都是**「畫得太準」**：

・⚠⚠⚠ **臉有立體感。** 站上的臉是「一個小小的深色弧形當眼睛、一筆鼻子、一筆嘴」，
　臉頰、額頭、下巴**完全沒有陰影**；第二版那張的臉有眼皮、有眼白、有反光點、有顴骨、
　頭髮一根一根。**這是「寫實」最強的訊號，而且它只在臉上，改一段就治得掉。**
・⚠⚠⚠ **每一樣東西用的筆畫太多。** 電風扇的護網畫出了整圈網格、磁磚牆畫出完整的格線、
　鐵窗每一根都畫、瀝水架每一個碗都畫、透視是準的。站上〈定期檢查〉那張東西一樣多，
　但**每一樣只用三到八筆**。

⚠⚠⚠ **而這兩件都是第二版的提示詞自己寫出來的**：那一段「兩層畫法」我寫了
「**環境要細到你叫得出這是什麼房間**」，那句話等於在說「畫準一點」——
**而「畫得準」正是寫實的定義**。同一段還是整份提示詞裡最長的一段，
照〈口腔外科〉那一輪的通則（**哪一段字最多，模型就把哪一個當主角**），
整張圖因此被推去比「畫工」。

第三版三件改動：

・**新增一整段 `FACES AND HANDS`，而且放在最前面第二段**（僅次於 `STYLE`），
　逐項寫死：眼睛是一個小弧形、**沒有睫毛、沒有眼白、沒有反光點、沒有眼皮的褶**、
　鼻子一筆、嘴一筆、**臉上任何地方都不上陰影**、頭髮是兩三塊色塊。
　收尾是一句判準：「**這張圖裡的臉如果看起來像肖像畫，就是錯的。**」
・**新增 `ECONOMY OF LINE`**：每一樣東西**用能認出它的最少筆畫畫完就停**，
　並逐項舉例（電風扇 ＝ 一個圓、四五根輻條加一支腳，不是準確的護網；
　磁磚牆是幾條線不是完整格線；鐵窗是幾根不是每一根），
　並明寫「**透視是手判斷的，不是用尺量的**」。
・**「兩層畫法」從九行砍到五行**，而且把那句話反過來寫：
　「**房間不是比人更細，是比人更粗略**。每個房間裡東西很多，但每一樣都只用很少的筆畫 ——
　**東西多，每一樣簡單**。」

⚠ `AVOID` 跟著補了一整排：不要肖像式的臉、臉上不要陰影、不要睫毛眼白反光點、
不要一根根的頭髮、**不要柔和／漸層／噴槍式的陰影**（一律是硬邊的平塗階）、
**不要技術製圖與建築製圖、不要用尺拉的透視、電風扇與磁磚與鐵窗不要準確的機械細節**、
不要均勻的細灰色輪廓線。

⚠ 參考圖那一段也跟著改了一句：要抄的東西從「線條品質」擴成
「**每一樣東西用了幾筆**」與「**臉畫得多簡單**」。

---

#### ⚠⚠⚠ 第四版（2026-09-05 更晚）：「人的臉變得有點呆板」

**照使用者說的去對站上的臉，三張放大之後成因很清楚** ——
第三版治「太寫實」的那一段，**順手把表情的每一個載體都關掉了**。

站上的臉實際上有這些（〈牙齦流血〉〈換牙〉〈定期檢查〉三張放大逐項看）：

| | 站上 | 第三版的提示詞 |
| --- | --- | --- |
| **眉毛** | 每張臉都有，**一筆，而且角度就是情緒**（挑起、垂下、一高一低） | **一個字都沒提到** |
| **嘴** | **開合幅度最大**：笑起來是張開的一個「形狀」＋一塊淺色的牙，想事情是一條偏一邊的波浪線 | 「**A mouth is one short stroke**」＝ 把唯一大幅度的載體鎖死 |
| **眼睛** | 實心深色、沒有描邊；**開心時彎成上弧或閉起來的月牙**，想睡時是一條縫 | 只寫「一個小小的深色弧形」，沒有說它會變 |
| **腮紅** | 有，一塊平塗的淡色 | 「**no blush**」← 直接禁掉了 |
| **年紀的線** | 有，一到兩筆**畫出來的**線（嘴邊一條笑紋、眼尾兩筆） | 「no modelling, no contour」把它一起掃掉了 |

⚠⚠⚠ **成因是那一段全部都是禁令**：沒有睫毛、沒有眼白、沒有反光點、沒有眼皮的褶、
沒有陰影、沒有腮紅、沒有一根根的頭髮 —— 七條全是「不要有什麼」，
**一條「要有什麼」都沒有**。它成功地把寫實拿掉了，也順手把臉清空了。

**通則：一段全是禁令的規格，會做出一個「什麼都沒有」的東西。**
每一條「不要有 X」旁邊要配一條「要有 Y」——
這一版因此把 `FACES` 拆成明確的兩半：**這張臉有什麼**（眉毛／嘴／眼／腮紅／年紀的線
／頭會歪）與**這張臉沒有什麼**（原本那七條原封不動）。

⚠⚠⚠ **第二個成因也是我自己寫的：「ALL SIX ARE CALM, ORDINARY AND AT EASE」** ——
那一句是為了擋「病容、虛弱、可憐」寫的，但它**同時等於叫模型畫六張一模一樣的表情**。
現在改成**逐格點名**（孕婦低頭看著小冊子偷偷笑／阿嬤伸手拿杯子、眉毛抬起來有點使勁／
中年男子一邊眉毛高、嘴偏一邊在想事情／量血糖的人**刻意就是很平常**、眉毛平嘴一直線
／半夜那位眼睛只剩一條縫、眉毛垂下來／頭巾那位讀到有趣的地方笑出來），
「不是病人、不可憐」那條禁令留著。中間兩位也各給一種
（醫師張嘴笑、護理師眼睛彎成月牙閉著嘴笑、頭歪一點）。

⚠ **第三件：`ECONOMY OF LINE` 那一段要補一句「這條是給東西的，不是給臉的」** ——
第三版寫「每一樣東西用能認出它的最少筆畫」，臉也是東西。

⚠ 判準從一條變兩條：原本只有「看起來像肖像畫就是錯的」，
現在多一條反方向的 —— **「七張臉如果互換位置沒有人看得出來，也是錯的」**。

⚠ `AVOID` 補了四條：不要一整排一模一樣的和善空臉、不要沒有眉毛的臉、
不要每張嘴都是同一個小小的閉合弧線、不要有人是面無表情的。

---

#### ⚠⚠⚠ 第五版（2026-09-05 更晚）：「變成蠟筆風格了」——**兩處是我第四版改壞的**

先量（3×3 鄰域的亮度極差；平塗 ＝ 極差 <1.5、硬邊 ＝ >25）：

| | 平塗 | 硬邊 |
| --- | --- | --- |
| 站上〈牙齦流血〉 | 25.9% | 21.1% |
| 站上〈換牙〉 | 22.0% | 24.0% |
| 站上〈定期檢查〉 | 30.9% | 32.0% |
| Ⓕ 第三版 | 32.5% | 36.4% |
| **Ⓕ 第四版** | **9.1%** | **54.2%** |

**真正平的面積從三成掉到 9.1%，而「有硬邊」的像素超過一半** ——
多出來的那些不是輪廓，是**填色裡面的筆觸**。這一版的填色不再是填色。

⚠⚠⚠ **成因不是模型漂掉，是第四版的 diff。** 逐行比對第三版與第四版，
**有兩處是我改壞的**：

1. **參考圖那一段的「`how flat the colour is`」被我刪掉了。**
   第三版寫的是「抄它的線質、抄每一樣東西用幾筆、抄臉多簡單、**抄顏色多平**」；
   第四版為了強調臉，把後半整句換成臉的三件事，**那句「顏色多平」順手被換掉了** ——
   而它是整份提示詞裡**唯一**叫模型去看參考圖的顏色怎麼上的一句。
2. **中間那一格的 `THEIR ROOM`（診所那一角）與 `TOGETHER THEY READ AS…`
   兩整段消失了。** 那是第四版重寫中間兩個人時整段覆蓋掉的，
   ——**第二版那個「單調」的成因（「only a hint of a clinic」）等於又回來了一半。**

⚠⚠⚠ **通則：每一輪為了治新問題而重寫某一段，會順手弄丟上一輪為了治舊問題寫進去的句子。**
三輪連著發生：第三版治寫實 → 第四版治呆板時刪掉「顏色是平的」與整段房間 → 蠟筆。
**做法：改完一定要 `diff` 上一版，逐條問「這一行是為了治什麼，現在還在不在」**，
並且**把治過的病寫成守門**（產生器現在擋五件，見下面）。

第五版四件改動：

・**參考圖那一句補回來並排到最前面**：`HOW FLAT AND SOLID THE COLOUR IS`。
・⚠⚠ **`STYLE` 裡那句「每一個表面都有色鉛筆的顆粒」整句換掉** ——
  它**從第一版就在**，前三版都沒事；第四版把「手繪／很快／不準／畫出來的線」
  這一類的字加多之後，**它就變成主角了**（＝口外那一輪的通則）。
  現在寫成：**填色裡面沒有任何筆觸**（不要蠟筆、不要色鉛筆的排線、不要交叉線、
  不要塗鴉式的填色、不要素描質感），最多一點點紙紋；線是**實的、連續的**，
  不可以毛、不可以描兩次。收一句判準：**「看起來像用蠟筆或色鉛筆塗的，就是錯的。」**
  ⚠ **那一句在 Ⓐ~Ⓔ 五份裡都還在，刻意沒動** —— 那五案一張都沒出過圖，
  真的要拿其中一案去出圖，先把這一句照 Ⓕ 改掉。
・**`ECONOMY OF LINE` 那句「這張圖沒有一樣東西是畫準的、什麼都畫得很快」收掉** ——
  它和「填色要平」互相拉扯。改成「**這一條講的是一個東西給幾條線，不是顏色怎麼上**」。
・**`AVOID` 最前面補一整排**：蠟筆／色鉛筆／粉彩棒的外觀、填色裡的筆觸與排線、
  整張罩上的粗紙紋、素描稿的樣子、毛邊或描兩次的輪廓。

---

#### ⚠⚠⚠ 第六版（2026-09-05 更晚）：醫事人員從中間搬到右下 —— **成因是首頁卡片的裁切**

使用者：「如果直接把這個圖放在網站文章，**首頁卡片的預覽圖片可能會重點都是在中間的
醫事人員**……是不是把醫事人員改到右下框比較好（然後移過去的醫事人員視線或手勢動作
要往左上帶）。」

**量過，他說的成立，而且是三件事疊起來的：**

| | |
| --- | --- |
| 首頁卡的縮圖是 **16:9** | 4:3 的圖被裁掉上下各 **12.4%**，只留中間 **75.3%** |
| 裁切是**置中**的 | **中間那一格是七格裡唯一完全沒有被裁到的**，其餘六格各被切掉一塊 |
| 中間那一格本來就最大 | 它在整張圖佔 **32.3%**，在卡片那一條裡變成 **36.1%**（＋12%） |

三件合起來：**卡片上唯一完整、最大、又在正中央的東西就是那兩位醫事人員**。
實際把圖裁成 393px 的卡片看過 —— 六個人只剩上下被切掉一截的碎片，
讀起來就是「一張診所的照片」，而這一篇講的是**哪些人需要三個月回來一次**。

⚠⚠⚠ **通則：一張圖會在兩個尺寸、兩個比例底下被看** ——
文章頁是完整的 4:3、首頁卡是置中裁切的 16:9。
**「畫面正中央」在文章頁只是構圖的一個位置，在卡片上等於「唯一的主角」。**
畫之前要先問：**這張圖被裁成卡片之後，站在正中央的是誰？**

**第六版四件改動：**

・**右下那一格換成診所**（原本是量血糖的那位），兩位醫事人員**都轉向左上**、
  醫師攤開的那隻手也**往左上伸出去**，穿過整張圖指回其他格子。
  ⚠ 那一格**貼著畫面下緣**，所以明寫：**兩張臉與那隻手都要在那一格的上半部**，
  底下只留房間與地板 —— 不然卡片會把她們的臉切掉。
・**中間那一格換成孕婦**（原本在左上）。她是六個人裡**縮到卡片大小還讀得出來**的一個
  （剪影就看得出來），而且她本來就是三個月回診最主流的一群。
・**左上換成量血糖的那位**（和右下對調）。
・**每一格的顏色跟著位置重新分配** —— 那一串本來是照位置寫的，人一換位置就對不上了。

⚠ **中間那一格仍然是最大的，那是刻意的。**
ILLUSTRATION.md 第十一節量過：**多格分割、沒有視覺中心的場面，縮到小尺寸會整張糊掉**。
所以不能把七格拉成一樣大 —— 要的是**換掉站在中央的那個人**，不是拆掉中央。

⚠ **這一輪逐條 diff 過第五版**（＝第五版學到的那條）：
顏色多平、填色裡沒有筆觸、臉不是空的、房間那一段、接納與介紹那一段，五條都還在；
顆粒、嘴巴一筆、六張一樣的臉、細到叫得出房間、沒有一樣東西是畫準的，五條都沒有回來。

---

## 三、五個提案共用的規格（每一份提示詞裡都逐字帶著）

- **Ⓐ~Ⓔ 是 16:9 橫幅**（`tools/hero-resize.mjs` 擋長寬比 2000/1116 ±0.02，16:9 過得了）；
  **Ⓕ 是 4:3**，那一支要改兩行才過得了 —— 見第一之二節。
- **`STYLE` 段放最前面並標成最重要的一段**（第七節第 18 條：提示詞為了修內容越寫越長，
  風格就會被擠掉）。
- **線是暖深棕不是純黑、粗細有變化**；平塗兩三階；**每個表面都有色鉛筆顆粒**。
- **高明度但暖冷都要有、每個人衣服不同色** —— ⚠ 只寫 `high-key / desaturated /
  plenty of paper white` 會退成單色（第七節第 18 條第二點）。
- **華人／亞洲面孔、正常頭身、沒有人看鏡頭、不逆光、不寫實、不無臉、不灰階**（A 類紅線）。
- **科別色只當點綴**：這一篇是一般牙科，`#3f654a`（套色）與 `#2c5238`（深階），
  只出現在一面牆的一條帶、一扇櫃門、一條毛巾這種地方 —— ⚠ 一定要補
  「不准整張罩上綠」（第八節第 15 條）。
- **`CRITICAL — NO WRITING ANYWHERE` 獨立一段大寫、逐項點名**（第七節第 4 條）。

---

## 三之二、⚠⚠⚠ Ⓕ 出圖之前**先餵這三張參考圖**（2026-09-05）

使用者第一版的第一句回饋是「**人物風格跟網站現有的不太一樣**」。
成因不是提示詞寫得不夠細 —— 那一段 `STYLE` 已經是站上最長的一份了 ——
是 **ILLUSTRATION.md 第七節第 19 條那條通則：形狀（含畫風）不要用文字描述，用參考圖。**
〈根管治療的生物陶瓷〉那一輪走過同一條路：標誌與根管的形狀用文字描述失敗三到四輪，
改成給圖之後一次就中。

**要餵的三張，都是站上自己的 HERO，直接從網站上存下來就好**（提案頁上也擺著）：

| 檔案 | 為什麼是這一張 |
| --- | --- |
| `assets/hero-gum-photo-1600.jpg`（〈牙齦流血〉） | ⭐ **最重要的一張。** 它就是 Ⓕ 想要的結構：**一格一個人、一格一個家、一格一個底色**（灰藍的臥室／米色的廚房／橘色的客廳／深色的夜間浴室）。連「唯一一格是暗的」都已經在裡面 |
| `assets/hero-checkup-photo-1600.jpg`（〈定期檢查〉） | **環境密度**看這一張：候診區、櫃檯、玻璃門的器械櫃、櫃上一排瓶罐、牆上的掛圖、診療椅 —— 東西很多，可是那些線**全部比人淡**。中間那一格的診所照它畫。⚠ 它同時是「**不要再畫候診室**」的理由（同一科、卡片會並排） |
| `assets/hero-kids-photo-1600.jpg`（〈換牙〉） | ⭐⭐ **臉**看這一張，而且要看仔細：五官很簡單，可是**嘴是張開的、眉毛有角度、臉頰有一塊平塗的腮紅**。2026-09-05 那一輪「臉呆板」就是因為只抄了「簡單」沒抄「在做什麼」 |

⚠⚠ **要抄的第一件不是「線好不好看」，是「一樣東西用幾筆」**（2026-09-05 第三版改的）——
第二版寫的是「copy the line quality」，結果線畫得很像、**筆數卻多了好幾倍**，
整張圖因此偏向技術製圖。現在那一句是「copy HOW FEW STROKES each object is drawn with，
以及 how simply faces and hands are drawn」。〈定期檢查〉那張是最好的樣本：
東西一樣多，但**每一樣只用三到八筆**。

⚠ **只抄畫風，不要抄構圖與人** —— 提示詞第一段就寫著這件事，
而且明寫「**文字和參考圖衝突時以參考圖為準**」（不寫的話，長長的文字會把圖蓋掉）。

⚠ 這三張裡的**環境線本來就比人淡**，正好就是使用者要的第 ③ 件
（「人物和動作相關的細節比較清楚，周圍環境線條和顏色淡化」）——
所以那一條**同時**用文字寫了一段（提示詞的「兩層畫法」）**又**用圖給了一次。

## 四、五份提示詞（逐字，可以直接複製）

### Ⓐ 同一張椅子，四個不同的人

```
Editorial illustration, 16:9 landscape.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration. Every line is drawn by hand in a warm dark brown, never pure black, with
visible variation in width and dry broken ends — never an even mechanical vector line,
never a loose scribble. Colour is laid down in flat areas, two or three steps of the same
colour; no smooth gradients except where light needs describing. EVERY surface carries a
fine coloured-pencil grain. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present, and each person wears a different colour family from everyone else. People are
simplified but their proportions are natural and their age is readable: Taiwanese / East
Asian faces, normal head-to-body proportion, small simple features that still carry
expression, hair drawn as a few shaped masses. Nobody looks at the viewer.

STRUCTURE — One illustration divided into four equal vertical panels by thin hand-drawn
lines. In all four panels the camera does not move: the SAME dental chair, seen from the
same three-quarter angle, in the same treatment room, and the same woman dentist standing
in the same place beside it, in a pale sage-green scrub top with her hair in a low bun.
The only thing that changes from panel to panel is WHO is sitting in the chair — and the
small thing each of them has brought with them.

PANEL 1 — a woman in her early thirties, visibly but not dramatically pregnant, sitting up
comfortably, one hand resting on the arm of the chair. On the small side table beside her
lies a slim booklet with a blank cover. The dentist is leaning in slightly, holding a
small round dental mirror, talking to her.
PANEL 2 — a man in his early fifties in an open-collared work shirt, sitting a little
stiffly, a soft brown paper pharmacy bag resting on his lap with a couple of blister packs
just showing at the top. The dentist has turned her head to listen to him, one hand
lightly on the back of the chair.
PANEL 3 — a woman in her seventies with short grey permed hair, settled back in the chair
looking relaxed and amused; a wooden walking stick is hooked over the arm of the chair
beside her. The dentist is handing her a small rinsing cup.
PANEL 4 — a woman in her forties wearing a soft printed headscarf, sitting upright with
her hands folded; a small vacuum flask stands on the side table. The dentist is nodding
and smiling at something she has just said.

ALL FOUR PEOPLE ARE CALM, ORDINARY AND AT EASE — they are not ill, not frail, not sad and
not frightened. Each has a different posture, a different direction of gaze and a
different expression. They are simply four different people whose mouths need looking at
more often than most.

THE ROOM — behind the chair, the same background in every panel: a low wooden cabinet, a
row of small bottles on a shelf, a wall poster showing ONLY a simple drawing of a tooth
and no writing at all, and a soft towel folded on the cabinet. A window out of frame
throws daylight in from the upper left.

LIGHT AND COLOUR — bright ordinary daytime indoors, high key, one soft daylight source
from the upper left; no sunset, no lamplight, no long orange shadows. Many colours, each
of them held low and dusty: brick red, mustard, sage green, teal, greyish violet, cream.
Assign them so no two people clash: panel 1 dusty rose, panel 2 pale slate blue, panel 3
mustard cardigan, panel 4 muted teal, dentist pale sage green. Clothes are not flat single
blocks of colour — give every garment two or three steps, with collars, cuffs, hems and
folds drawn in, and different fabrics hanging differently. As a small accent only, a
deep forest green (#3f654a / #2c5238) appears on one band of the wall and on the folded
towel — a touch, never a wash. Teeth, wherever they show, stay clean near-white and take
none of this colour.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters,
no logos and no signage anywhere in this picture — not on the wall poster, not on the
booklet cover, not on the pharmacy bag, not on the blister packs, not on the bottles on
the shelf, not on the flask, not on any label. Every surface that would normally carry
writing is left blank.

AVOID — no drips, no IV stands, no wheelchairs, no hospital beds, no oxygen tubes, no
face masks covering anyone's face, no sick or pained expressions, no tears; nobody looks
at the viewer; no backlit heroic silhouettes; no photorealism; no faceless figures; no
exaggerated cartoon head-to-body proportions; no greyscale; no close-up dental
instruments, no needles, no drills, no trays of tools; no blood; no photorealistic mouth
interiors; no green cast over the whole picture; no arrows; the four people must not be
posed identically like a catalogue.
```

### Ⓑ 桌上那一攤

```
Editorial illustration, 16:9 landscape.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration. Every line is drawn by hand in a warm dark brown, never pure black, with
visible variation in width and dry broken ends — never an even mechanical vector line,
never a loose scribble. Colour is laid down in flat areas, two or three steps of the same
colour; no smooth gradients except where light needs describing. EVERY surface carries a
fine coloured-pencil grain. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present. Hands are simplified but correctly proportioned, East Asian skin tones.

STRUCTURE — A single scene, seen from slightly above and at a slight angle. A pale wooden
consulting-room desk FILLS ALMOST THE WHOLE FRAME; the desktop is the environment. Laid
out on it, arranged the way a real person empties a bag, not tidily spaced like a product
photograph:
  • a soft brown paper pharmacy bag, creased and a little worn, lying on its side with two
    blister packs of tablets half slid out of the mouth of the bag;
  • a small notebook lying open, its two visible pages COMPLETELY BLANK — no lines, no
    writing, no printing;
  • a plain card the size of a bank card, blank, with a single narrow green stripe across
    it and nothing else;
  • a pair of reading glasses folded beside the notebook;
  • a glass of water, half full, with a faint ring of condensation on the desk;
  • one small potted plant at the far corner.
TWO PAIRS OF HANDS enter the frame from the top and bottom edges — we see only forearms
and hands, no faces. From the near edge, the older patient's hands: one hand pushing the
paper bag forward across the desk, the other resting flat beside it. From the far edge,
the dentist's hands in pale sage-green sleeves: one hand steadying the open notebook, the
other with a finger resting lightly on the blister pack, paying attention.
At the very top edge of the picture, only just entering the frame, the arm of a dental
chair and the lower hem of a pale coat — enough to say this is a dental clinic, no more.

LIGHT AND COLOUR — bright ordinary daytime indoors, high key, one soft daylight source
from the upper left; no sunset, no lamplight, no long orange shadows. Many colours, each
of them held low and dusty: brick red, mustard, sage green, teal, greyish violet, cream.
The desk is pale warm wood with visible grain; the paper bag is warm kraft brown; the
blister packs are a muted silver-grey with dusty rose and pale blue tablets; the patient's
sleeve is mustard, the dentist's sleeve pale sage green. As a small accent only, a deep
forest green (#3f654a / #2c5238) on the card's stripe and on a folded towel at the edge of
the desk — a touch, never a wash.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters,
no logos, no barcodes and no printed labels anywhere in this picture — not on the paper
bag, not on the blister packs, not on the open notebook pages, not on the card, not on the
water glass, not on the pot, not anywhere on the desk. Every surface that would normally
carry writing is left completely blank. This is the single most important rule after the
style.

AVOID — no faces, no full figures; no close-up dental instruments, no needles, no drills,
no trays of tools; no syringes; no pill bottles with childproof caps that suggest a
pharmacy counter rather than a clinic; no clipboard; no computer screen; no smartphone; no
blood; no photorealism; no greyscale; no green cast over the whole picture; nothing
arranged in a neat symmetrical grid like a flat-lay product shot; no arrows; no diagrams.
```

### Ⓒ 阿公和孫女一起塗氟

```
Editorial illustration, 16:9 landscape.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration. Every line is drawn by hand in a warm dark brown, never pure black, with
visible variation in width and dry broken ends — never an even mechanical vector line,
never a loose scribble. Colour is laid down in flat areas, two or three steps of the same
colour; no smooth gradients except where light needs describing. EVERY surface carries a
fine coloured-pencil grain. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present, and each person wears a different colour family from everyone else. People are
simplified but their proportions are natural and their age is readable: Taiwanese / East
Asian faces, normal head-to-body proportion, small simple features that still carry
expression. Nobody looks at the viewer.

STRUCTURE — A single warm scene in a bright dental treatment room. TWO DENTAL CHAIRS STAND
SIDE BY SIDE, seen from a three-quarter angle. This is a happy moment and the people fill
most of the frame.
ON THE RIGHT CHAIR — a girl of about six, sitting up on her knees, delighted, both hands
held out to take a small round sticker that a nurse in a pale sage-green scrub top is
passing to her. The sticker carries a simple drawing of a tooth and NO writing. The girl's
mouth is open in a laugh; her front teeth are clean and white.
ON THE LEFT CHAIR — her grandfather, in his seventies, short grey hair, sitting comfortably
sideways so he can see her. He has just had the same treatment: he is holding up an
identical sticker between his finger and thumb, looking at his granddaughter with an
expression that is half amused at himself and half quietly pleased. He is not embarrassed
and nobody is teasing him.
BETWEEN AND SLIGHTLY BEHIND THEM — the girl's mother, in her thirties, standing with one
hand on the back of the grandfather's chair, laughing warmly at the two of them. Her
warmth is generous: NOBODY in this picture is mocking the old man, laughing AT him,
pointing at him or treating him as a child.

THE ROOM — a low wooden cabinet behind the chairs, a row of small bottles on a shelf, a
wall poster showing ONLY a simple drawing of a tooth with no writing, a folded towel, and a
small tray with two soft applicator brushes on it. A window out of frame throws daylight
in from the upper left.

LIGHT AND COLOUR — bright ordinary daytime indoors, high key, one soft daylight source from
the upper left; no sunset, no lamplight, no long orange shadows. Many colours, each of them
held low and dusty: brick red, mustard, sage green, teal, greyish violet, cream. Assign
them so nobody clashes: the girl in dusty rose, the grandfather in a mustard knitted vest
over a cream shirt, the mother in muted teal, the nurse in pale sage green. Clothes are not
flat single blocks of colour — give every garment two or three steps, with collars, cuffs,
hems and folds drawn in. As a small accent only, a deep forest green (#3f654a / #2c5238)
on one band of the wall and on the folded towel — a touch, never a wash. Teeth stay clean
near-white and take none of this colour.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters and
no logos anywhere in this picture — not on the stickers, not on the wall poster, not on the
bottles, not on the cabinet, not on any label. Every surface that would normally carry
writing is left blank.

AVOID — nobody is mocking, teasing, laughing at or pointing at the grandfather; no tears,
no crying child, no frightened child, no hands rubbing or covering eyes; nobody looks at
the viewer; no close-up dental instruments, no needles, no drills; no blood; no
photorealistic mouth interiors; no photorealism; no faceless figures; no exaggerated
cartoon head-to-body proportions; no greyscale; no backlit heroic silhouettes; no green
cast over the whole picture; the grandfather must not be drawn as frail, bent, toothless or
pitiable; no arrows; no diagrams.
```

### Ⓓ 人 ＋ 一個大泡泡三段

```
Editorial illustration, 16:9 landscape.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration. Every line is drawn by hand in a warm dark brown, never pure black, with
visible variation in width and dry broken ends — never an even mechanical vector line,
never a loose scribble. Colour is laid down in flat areas, two or three steps of the same
colour; no smooth gradients except where light needs describing. EVERY surface carries a
fine coloured-pencil grain. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present, and each person wears a different colour family from everyone else. People are
simplified but their proportions are natural and their age is readable: Taiwanese / East
Asian faces, normal head-to-body proportion, small simple features that still carry
expression. Nobody looks at the viewer.

STRUCTURE — The lower left two thirds of the picture is a dental consulting room. A woman
dentist in a pale sage-green scrub top, hair in a short bob, sits on a low stool on the
LEFT, turned towards her patient, one hand open in the middle of explaining something. The
patient, a man in his early fifties in an open-collared shirt, sits on the RIGHT of her in
the dental chair, turned towards her, listening, relaxed and interested — not worried, not
in pain. Never put the patient on the left.

ABOVE THEM, filling the upper part of the picture, is ONE LARGE ROUNDED THOUGHT BUBBLE with
a thin hand-drawn outline, joined to the patient by three small circles rising from his
head. The inside of the bubble is divided into THREE equal parts by TWO THIN HAND-DRAWN
VERTICAL LINES — it is one single bubble with two dividers, NOT three separate bubbles,
and there are no arrows anywhere. Inside it, three small ordinary moments from his own
life, drawn simply, all in the same pale palette:
  LEFT THIRD — the middle of the night. He stands at his kitchen counter in a T-shirt,
  pouring a glass of water, half asleep. The room is dim blue with one small warm pool of
  light; the wall behind him is dark, never left pale or empty.
  MIDDLE THIRD — early morning at the dining table. He sits with a small handheld meter in
  one hand and the fingertip of his other hand held to it, looking at it matter-of-factly.
  A breakfast bowl and a mug stand beside him. Bright ordinary daylight.
  RIGHT THIRD — later that morning, at the bathroom basin. He has stopped brushing, leans
  towards the mirror and uses one finger to pull his lower lip down to look at one patch of
  gum, his eyebrows drawn slightly together. In the mirror the gum along the edge of those
  teeth is a rich muted rose-red, distinctly redder than the calm pale pink gum nearby, and
  visibly puffed so the margin bulges a little over the edges of the teeth — the redness is
  strongest right at that one patch and eases away from it. Never a glaring neon or blood
  red, no blood, no bleeding, no wound. His teeth are clean and white. Keep this simple and
  illustrative, never a photorealistic mouth interior and never a textbook cross-section
  diagram.

THE ROOM — behind the dentist, a low wooden cabinet, a row of small bottles on a shelf, a
wall poster showing ONLY a simple abstract landscape and no writing, and a folded towel.
Daylight from the upper left. Keep everything that belongs inside the bubble INSIDE the
bubble — no teeth, no gums, no diagrams and no medical drawings anywhere in the room
itself.

LIGHT AND COLOUR — the consulting room and the middle and right thirds of the bubble are
bright ordinary daytime, high key, daylight from the upper left. The LEFT third of the
bubble is the exception and must read as clearly darker than the other two. Many colours,
each of them held low and dusty: brick red, mustard, sage green, teal, greyish violet,
cream. The patient wears mustard, the dentist pale sage green. Clothes are not flat single
blocks of colour — give every garment two or three steps with collars, cuffs, hems and
folds drawn in. As a small accent only, a deep forest green (#3f654a / #2c5238) on one band
of the wall and on the folded towel — a touch, never a wash. Teeth stay clean near-white.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters and
no logos anywhere in this picture — not on the wall poster, not on the bottles, not on the
handheld meter, not on its little screen, not on the packaging, not on any label. Every
surface that would normally carry writing, and the meter's screen, is left completely
blank.

AVOID — not three separate bubbles; no arrows; no numbered steps; no cross-sections, no
anatomical diagrams, no textbook illustrations; no close-up dental instruments, no needles,
no drills, no syringes; no blood, no bleeding, no wounds; no photorealistic mouth interiors;
no crying, no pained or frightened expressions; nobody looks at the viewer; no photorealism;
no faceless figures; no exaggerated cartoon head-to-body proportions; no greyscale; no
backlit heroic silhouettes; no green cast over the whole picture; the night third must not
be left pale, white or empty.
```

### Ⓔ 同一扇窗，一年裡回來幾次

```
Editorial illustration, 16:9 landscape.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration. Every line is drawn by hand in a warm dark brown, never pure black, with
visible variation in width and dry broken ends — never an even mechanical vector line,
never a loose scribble. Colour is laid down in flat areas, two or three steps of the same
colour; no smooth gradients except where light needs describing. EVERY surface carries a
fine coloured-pencil grain. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present. People are simplified but their proportions are natural and their age is readable:
Taiwanese / East Asian faces, normal head-to-body proportion, small simple features that
still carry expression. Nobody looks at the viewer.

STRUCTURE — One illustration divided into three equal vertical panels by thin hand-drawn
lines. In all three panels the camera does not move: the SAME corner of a dental clinic
waiting area, seen from the same angle — the same tall window on the right, the same pale
wooden bench beneath it, the same low table with a small plant, the same doorway on the
left through which the arm of a dental chair and a pale sage-green sleeve can just be seen.
On the wall, a poster showing ONLY a simple drawing of a tooth and no writing.
THE SAME MAN, in his sixties, short grey hair, sits on the bench in every panel, waiting
comfortably and unhurriedly, looking towards the window or down at his hands. He is at
ease; this place is part of his life. He is alone in the waiting area — this is a quiet
morning, not a crowded clinic.
THE ONLY THINGS THAT CHANGE ARE THE SEASON OUTSIDE THE WINDOW, HIS CLOTHES AND WHAT HE HAS
BROUGHT:
  PANEL 1 — through the window, a street tree in full green leaf and bright sky. He wears a
  short-sleeved shirt in muted teal; a soft cloth hat rests on the bench beside him.
  PANEL 2 — through the window, rain: THREE OR FOUR GROUPS OF SHORT PARALLEL HAND-DRAWN
  STROKES all slanting the same way, evenly spaced, solid at the top and fading to dry
  flecks at the lower end — moving rain, never one long continuous curved line, never
  loops. The tree is dark and wet. He wears a thin mustard jacket; a closed umbrella leans
  against the bench, a small pool of water beneath it.
  PANEL 3 — through the window, the same tree with yellowed leaves and a low warm sky. He
  wears a dusty rose knitted vest over a cream shirt; a small vacuum flask stands on the
  bench beside him.

LIGHT AND COLOUR — ordinary daytime in all three panels, high key, daylight coming in
through the window on the right; no sunset, no lamplight, no long orange shadows. The
middle rainy panel is a little cooler and softer than the other two but must NOT be dark or
gloomy. Many colours, each of them held low and dusty: brick red, mustard, sage green,
teal, greyish violet, cream. Clothes are not flat single blocks of colour — give every
garment two or three steps, with collars, cuffs, hems and folds drawn in, and different
fabrics hanging differently. As a small accent only, a deep forest green (#3f654a /
#2c5238) on one band of the wall and on the seat cushion — a touch, never a wash.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters and
no logos anywhere in this picture — not on the wall poster, not on the magazines or leaflets
on the low table, not on the flask, not on the window, not on any sign. Every surface that
would normally carry writing is left completely blank. There is no calendar and no clock
with numbers.

AVOID — no calendar, no clock face, no dates, no numbers of any kind; the rain must not be
one long continuous ribbon, must not loop or curl back on itself and must not grow thicker
as it falls; nobody looks at the viewer; no crowd of waiting patients; no reception counter
with staff; no close-up dental instruments, no needles, no drills; no blood; no
photorealism; no faceless figures; no exaggerated cartoon head-to-body proportions; no
greyscale; no backlit heroic silhouettes; no green cast over the whole picture; the man
must not look ill, frail, sad or bored; no arrows; no diagrams.
```

### Ⓕ 不規則分格 ＋ 右下兩位醫事人員

```
Editorial illustration, 4:3 landscape (slightly wider than tall, NOT a wide banner).

REFERENCE IMAGES — THREE IMAGES ARE ATTACHED. They are existing illustrations from the
same website and this new picture must look like it belongs beside them. Copy from them:
the exact line quality, HOW FLAT AND SOLID THE COLOUR IS, HOW FEW STROKES each object is
drawn with, and HOW THE FACES ARE DRAWN — look at how much those faces are doing, how wide
the mouths open, how the eyebrows tilt. Do NOT copy their layouts, their people or their
scenes. Wherever the words below and the attached images disagree, THE ATTACHED IMAGES WIN.

STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST. Warm hand-drawn editorial
illustration, drawn quickly and confidently BY HAND. Every line is drawn in a warm dark
brown, never pure black and never grey, with visible variation in width and dry broken
ends — never an even mechanical vector line. Colour is laid down in FLAT areas, two or
three steps of the same colour, with a clean hard edge between the steps.
THE INSIDE OF EVERY FILL IS SMOOTH AND EVEN — there are no strokes inside it: no
crayon marks, no coloured-pencil hatching, no cross-hatching, no scribbled fill, no
sketchy texture. At most a barely visible paper tooth that you only notice if you go
looking for it. The lines are solid, continuous and confident: never feathered, never
drawn twice, never hairy. IF THIS PICTURE LOOKS LIKE IT WAS COLOURED IN WITH CRAYONS OR
COLOURED PENCILS, IT IS WRONG. High key overall with plenty of pale paper showing through,
BUT the picture must stay properly colourful — warm colours and cool colours both clearly
present, and each person wears a different colour family from everyone else. People are
simplified but their proportions are natural and their age is readable: Taiwanese / East
Asian faces, normal head-to-body proportion.

FACES — READ THIS TWICE. THESE FACES ARE SIMPLE, BUT THEY ARE NOT BLANK. Every face here
is doing something, and every one of them is doing something DIFFERENT.
  WHAT A FACE HAS. Eyebrows: every face has two clearly drawn eyebrows, each one a single
  confident stroke, and THEIR ANGLE IS THE MAIN THING CARRYING THE MOOD — raised, level,
  one higher than the other, inner ends tipped up. Eyes: a solid dark shape with no
  outline; when someone is pleased the eye becomes an upward curve or a closed crescent,
  and when someone is sleepy it becomes a narrow slit. Mouths: THE MOUTH VARIES MORE THAN
  ANYTHING ELSE ON THE FACE. A laughing mouth is open wide — a shape, not a line, with a
  plain pale block of teeth inside. A thinking mouth is a wavy line pushed off to one
  side. A calm mouth is a small curve. NOT EVERY MOUTH IS THE SAME SMALL CLOSED ARC. A
  flat soft patch of blush on the cheek is welcome. On older faces, one or two deliberate
  drawn lines are welcome — a single smile line beside the mouth, two short strokes at the
  outer corner of an eye — DRAWN LINES, not shading. Heads tilt; shoulders lean.
  WHAT A FACE DOES NOT HAVE. No shading or modelling anywhere on the face — no cheekbones,
  no contouring, no shadow under the nose or chin. No eyelashes, no visible white of the
  eye, no catchlight, no eyelid crease. Hair is two or three large shaped masses of flat
  colour with at most a few interior strokes — never individual strands, never rendered
  curls, never highlights. Hands are simple: fingers are simple tapering shapes, no
  knuckle modelling, no fingernails.
  TWO TESTS. If a face looks like a portrait, it is wrong. And if the faces could be
  swapped between panels without anyone noticing, it is also wrong.

ECONOMY OF LINE — Every object is drawn with THE SMALLEST NUMBER OF STROKES THAT STILL
NAMES IT, and then stopped. An electric fan is a circle, four or five spokes and a stand —
not an accurate wire guard. A tiled wall is a few lines suggesting tiles, not a complete
grid. A window grille is a few bars, not every bar. A dish rack is three or four dishes,
not a full rack. A rice cooker is a rounded box with a lid. Perspective is relaxed and
judged by hand, never ruled, never architecturally correct. THIS RULE IS ABOUT HOW MANY LINES AN
OBJECT GETS, NOT ABOUT HOW THE COLOUR IS PUT DOWN — the fills stay flat and even. AND IT
IS ABOUT THINGS, NOT ABOUT FACES — the faces still get their eyebrows, their mouths and their expression.

TWO LEVELS — the people are drawn with the darkest, thickest lines and wear the strongest
colours in their panel; the rooms behind them use thinner, paler lines and quieter colour.
That is the only difference between them. The rooms are NOT more detailed than the people
— they are LESS detailed. Each room holds MANY ordinary objects, but every one of those
objects is drawn with very few strokes. Many things, each one simple. The one exception is
the small object each person is holding or touching: that is drawn at full strength,
because it is part of what they are doing.

STRUCTURE — The whole picture is ONE MOSAIC of seven panels, like a page of an
illustrated poster. The panels are irregular polygons of different sizes, fitted together
edge to edge and separated by THIN HAND-DRAWN GUTTER LINES that are slightly wobbly, never
ruler-straight and never a regular grid of rectangles. The mosaic fills the whole frame.
Each panel has its own pale background tint, and each panel is a DIFFERENT ROOM with
DIFFERENT FURNITURE — the six homes must never look like the same house drawn six times.

THE CENTRE PANEL is the largest: an irregular five-sided panel in the middle of the
picture. IT IS A HOME, NOT THE CLINIC — the clinic is a smaller panel at the LOWER RIGHT.
The centre panel holds a woman in her early thirties, visibly but not dramatically
pregnant, sitting back on a fabric sofa with one hand resting on her middle, the other
holding a slim blank booklet she is reading. FACE: looking down at the booklet, eyes
curved, one corner of the mouth lifted — quietly pleased. HER ROOM: cushions, a low wooden
coffee table with a glass of water and a small stack of plain books, slippers on the floor,
a leafy pot plant, a barred Taiwanese window with daylight coming through, a standing fan.

THE SIX PANELS AROUND HER: five of them hold ONE ordinary person in their own home, doing
an ordinary thing, and the sixth — the LOWER RIGHT — is the clinic. EACH ONE HAS A
DIFFERENT EXPRESSION, LISTED BELOW — do not give them all the same pleasant neutral face.
All of the objects below must be there, and every one of them is drawn with very few
strokes.
  UPPER LEFT — a man in his sixties at his breakfast table, holding a small handheld meter
  to his fingertip. FACE: completely matter-of-fact — level eyebrows, mouth a small
  straight line, eyes down on his own finger. He has done this a thousand times and it is
  not an event. HIS ROOM: a bowl of rice porridge, two small dishes of vegetables, a cup of
  soy milk, a steel vacuum flask; behind him a kitchen doorway, a rice cooker on a counter,
  a hanging cloth, and beyond the window the pillars of a Taiwanese covered walkway.
  UPPER RIGHT — a woman in her seventies with short grey permed hair, standing in her own
  kitchen, a wooden walking stick hooked over her forearm, reaching up into a cupboard for
  a cup. FACE: mouth slightly open with the effort, both eyebrows raised, eyes on the cup —
  busy and a little triumphant, two smile lines at the corner of the eye. HER ROOM: an
  old-fashioned counter, a tiled wall, a kettle on the gas ring, a ladle and a cloth on
  hooks, a few unlabelled jars on the windowsill, a bamboo basket of vegetables, a bunch of
  garlic hanging up, a wooden crockery cupboard.
  RIGHT — a man in his early fifties in an open-collared work shirt, sitting at his dining
  table with a soft brown paper pharmacy bag in front of him and two blister packs of
  tablets half slid out of it, one hand resting on the bag. FACE: one eyebrow higher than
  the other, mouth a wavy line pushed to one side, looking down at the tablets — thinking
  something over, not worried.  HIS ROOM: a round table with a patterned plastic
  tablecloth, a glass of tea, wooden chairs, a standing fan, a towel over a chair back, a
  barred window, a remote control and reading glasses on the table.
  LOWER RIGHT — THE CLINIC. This panel is SMALLER THAN THE CENTRE PANEL and it is a
  SUPPORTING panel, not the subject of the picture. TWO members of clinic staff stand side
  by side, seen from the chest up, BOTH TURNED THREE-QUARTERS TOWARDS THE UPPER LEFT OF THE
  WHOLE PICTURE and both looking that way, out across the other panels. NEITHER OF THEM
  LOOKS AT THE VIEWER, and THEIR TWO FACES ARE DOING DIFFERENT THINGS.
    THE DENTIST, a woman in her thirties, wears an open WHITE COAT over a pale sage-green
    scrub top, hair in a low bun. She stands slightly forward of the other. ONE ARM IS OPEN
    AND EXTENDED UP AND TO THE LEFT, out across the picture towards the other panels — a
    calm, welcoming, presenting gesture, the gesture of someone introducing people she is
    glad to see; NOT a warning, NOT a raised finger, and NOT pointing at any one person.
    Her weight leans very slightly the same way. HER FACE: an open smile with the mouth
    clearly open, eyebrows relaxed and lifted, eyes bright and wide, looking up and to the
    left, in the same direction as her hand.
    THE NURSE, a woman in her forties, wears NO WHITE COAT — only a scrub top, and it is a
    DIFFERENT COLOUR from the dentist's: a muted dusty teal. Short hair tucked behind one
    ear. She stands half a step behind, hands resting easily together in front of her, head
    TILTED, nodding slightly up towards the same upper-left corner. HER FACE: eyes curved
    into happy closed crescents, mouth closed in a small warm smile — visibly quieter and
    gentler than the dentist's face, not the same expression repeated.
    TOGETHER THEY READ AS WELCOME AND INTRODUCTION — these are the people we are glad to
    look after, and there they are. Nobody is scolding, warning, pointing at the viewer or
    raising a finger.
    THEIR ROOM, simply drawn and mostly behind them — a low wooden cabinet, a glass-fronted
    cabinet with rows of small unlabelled bottles, a stack of folded towels, a potted plant,
    a simple picture on the wall showing ONLY a single tooth and no writing at all.
    BOTH THEIR FACES AND THE OPEN HAND SIT IN THE UPPER PART OF THIS PANEL, well clear of
    the bottom edge of the whole picture.
  LOWER LEFT — the middle of the night. A woman in her fifties in a T-shirt stands at her
  kitchen counter pouring herself a glass of water. FACE: half asleep — eyes narrowed to
  slits, eyebrows sloping down and out, mouth slightly open, hair a bit flattened on one
  side. THIS IS THE ONLY DARK PANEL: deep dusty blue-grey, with exactly two sources of
  light — a small warm lamp above the counter, and a few lit windows in the block of flats
  across the street. A draining rack with a few bowls, a tap and the counter are there, but
  they sit down in the dark. The wall behind her is dark, never left pale.
  LEFT — a woman in her forties wearing a soft printed headscarf, sitting comfortably in a
  rattan armchair reading a book with blank pages. FACE: she has just reached something she
  likes — eyes curved into crescents, mouth open in a small laugh, eyebrows lifted. HER
  ROOM: a small side table with a vacuum flask, a knitted blanket over her knees, a pot
  plant, a shelf of plain books, and a simple framed picture on the wall with no writing.

NONE OF THE SIX PEOPLE AT HOME IS ILL, FRAIL, SAD OR FRIGHTENED, and none of them is in a
hospital or a clinic — but they are not all wearing the same mild pleasant expression
either. Each has a
different posture, a different direction of gaze and a different face. Nobody looks at the
viewer.

CROPPING — the top 12% and the bottom 12% of the whole picture will sometimes be cut off,
leaving a wide letterbox strip through the middle. Keep every face, and every one of the
small objects listed above, well inside the middle of the frame. The top and bottom edges
of the picture may hold only background: wall, floor, tint, the edge of a panel.
  THIS MATTERS MOST FOR THE LOWER-RIGHT CLINIC PANEL, which touches the bottom edge of the
  picture: the two staff, their faces and the open hand must all sit high enough in that
  panel to survive the cut, with only their room and the floor below them.
  WHEN THE PICTURE IS CUT DOWN TO THAT MIDDLE STRIP, THE THING IN THE CENTRE IS THE WOMAN
  AT HOME ON HER SOFA — she is the one the strip is about. The clinic staff are off at the
  lower right, partly cut, pointing back in towards her.

LIGHT AND COLOUR — bright ordinary daytime in six of the seven panels, high key, soft
daylight; no sunset, no long orange shadows. The lower-left night panel is the single
exception and must read as clearly darker than all the others. Many colours, each of them
held low and dusty: brick red, mustard, sage green, teal, greyish violet, cream. Give each
panel a different pale tint for its background and assign the clothes so that no two
neighbouring people clash: CENTRE dusty rose, upper left warm sand, upper right mustard,
right pale slate blue, lower left deep blue in shadow, left muted teal with a patterned
headscarf; in the LOWER-RIGHT CLINIC PANEL the dentist wears a white coat over pale sage
green and the nurse wears dusty teal, and that panel keeps the palest, creamiest background
of the seven. Every garment has two or three FLAT steps of colour with hard edges, plus collars,
cuffs and hems — never a soft airbrushed gradient. As a small accent only, a deep forest
green (#3f654a / #2c5238) on the gutter lines and on one shelf behind the staff — a touch,
never a wash. Teeth, wherever they show, stay clean near-white.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters, no
logos, no captions, no labels and no signage anywhere in this picture — not in the gutters
between panels, not on the booklet, not on the books or the bookshelf, not on the framed
pictures, not on the pharmacy bag, not on the blister packs, not on the handheld meter or
its little screen, not on the jars, not on the bottles in the clinic cabinet, not on the
flasks, not on the rice cooker, not on the remote control, and not on any wall. Every
surface that would normally carry writing is left blank.

AVOID — no crayon look, no coloured-pencil look, no pastel-stick look; no visible strokes,
hatching, cross-hatching or scribble inside any filled area; no rough paper texture laid
over the picture; no pencil-sketch or rough-sketch look; no feathered, doubled or hairy
outlines; no row of identical blank pleasant faces; no face without eyebrows; not every
mouth is the same small closed curve; nobody is expressionless. No realistic or
portrait-like faces, no shading or modelling on any face, no eyelashes, no eye whites, no
catchlights, no individually drawn hair strands; no soft, smooth or airbrushed gradient
shading anywhere, on fabric, walls, skin or furniture — all shading is flat steps with
hard edges; no technical, architectural or engineering drawing, no ruled perspective, no
accurate mechanical detail on fans, appliances, tiles, window grilles or racks; no thin
uniform grey outlines; no clocks, no calendars, no phone screens, no computer screens and
no digital displays of any kind, because they all carry numbers; no speech bubbles, no
thought bubbles, no captions, no arrows, no numbers on the panels and no icons or symbols
of any kind; the gutters are plain hand-drawn lines, not a neat rectangular grid and not
comic-book panel borders with heavy black outlines; nobody looks at the viewer and nobody
points at the viewer; the dentist is not scolding, not warning and not raising a finger;
the two staff must not be drawn as a matching pair in the same pose, must not wear the
same colour and must not wear the same expression; no empty rooms and no bare walls; no
hospital beds, no IV stands, no wheelchairs, no oxygen tubes, no face masks covering
anyone's face, no sick or pained expressions, no tears; no close-up dental instruments, no
needles, no drills, no trays of tools; no blood; no photorealistic mouth interiors; no
teeth diagrams; no photorealism; no faceless figures; no exaggerated cartoon head-to-body
proportions; no greyscale; no backlit heroic silhouettes; no green cast over the whole
picture; the six homes must not look like the same room drawn six times.
```

---

## 五、挑定之後要做的事

1. 使用者出圖 → 原檔放 `drafts/three-month-recall/hero-src.jpg`（16:9）。
2. `node tools/hero-resize.mjs drafts/three-month-recall/hero-src.jpg three-month-photo`
   → `assets/hero-three-month-photo-{2000,1600,800}.jpg`
   ⚠ 那一支會擋兩件：四邊有沒有烘進去的白框、長寬比對不對得上 2000×1116。
3. 定稿的那一份提示詞**逐字搬進 ILLUSTRATION.md**（第七節第 19 條），
   並寫下每一輪為什麼改。
4. 文章從 `drafts/` `git mv` 進 `posts/three-month-recall/`、`post-meta` 的 `hero`
   填 `hero-three-month-photo-1600.jpg`，再跑 `node tools/build.mjs`。
