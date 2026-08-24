# 分享圖提示詞：顯微根管（`og-topic-endo`）

**狀態：第四版提示詞（2026-08-24）。已經生成過三次。**
v1 的量測在第五之〇節、v2 在第五之二節、v3 在第五之三節。
**梗（放大圈）v2 就被接受了**，**房間、坐姿、鏡頭與燈光 v3 也過了**——
v4 只改兩件：**牙齒和醫師的關係**（不要置身事外）與**細菌要多、要鬧**。
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十六節與 `tools/topic-copy.mjs` 的 `endo`。

## 使用者給的概念（2026-08-24，逐字）

> 「你們參考網站的圖片 風格 製作 顯微根管著陸頁的圖片 先不要做線稿 感覺要有顯微鏡」

三件事因此定下來：**① 這一輪只做分享圖**（線稿底圖等這張定案再做，順序是
分享圖在前、線稿在後 —— ILLUSTRATION.md 第十二節）、**② 風格對齊站上既有的圖**
（已上線的兩張分享卡與〈根管治療的生物陶瓷〉那張 HERO）、**③ 顯微鏡要在畫面裡**。

---

## 一、梗：光照進去的那一刻（回到那一頁的軸）

那一頁的軸是使用者自己那句話 ——「**顯微根管是為牙齒增加一個保留的機會**」，
落到文案上是 lead：「這顆還留得住嗎？—— **顯微鏡下看清楚，牙齒就多一次機會**。」

所以這張圖要畫的**不是**治療的過程，是**看清楚的那一刻**：

| 文案 | 圖上對應的東西 |
| --- | --- |
| 顯微鏡下 | 一台真的牙科顯微鏡，大、在畫面左半，醫師的眼睛貼在目鏡上 |
| 看清楚 | 一道暖金色的**光錐**打在牙齒上；**光裡面的東西畫得清楚、光外面的收暗** |
| 多一次機會 | 牙齒表面只有一小塊暗暗的東西，**放大圈裡**才看得到那底下有一條細縫、細菌正往裡面鑽（⚠ 第二版換過，原本是把牙齒剖開，見第五之一節） |
| 「留下來要能用得久」 | 牙齒的表情是**好奇 ＋ 有點意外**（抬頭看那個圈），不是得救、不是道謝（close 沒有承諾留得住） |

⚠⚠ **不要畫成「治療中」** —— 那會踩到那一頁最要緊的一條禁令：這一科
**不准出現任何和「快」有關的暗示**，而「正在做」的畫面必然引出「要做多久」。
畫「找到了」就沒有這個問題。

### 這一張的節奏刻意和牙周那張不一樣

七頁的文案有一張節奏對照表（COPY.md 第九之十五節），圖也要照這個精神走 ——
牙周那張是**動的**（水柱、後座力、細菌四散），這一張是**靜的一瞬間**（發現）。
但「靜」不等於「安靜到沒事發生」（ILLUSTRATION.md 第十一之二節，一般牙科第三版
就是這樣被退回的），所以畫面裡同時有三組各自在做自己的事：

1. **醫師 ＋ 顯微鏡**（主組）—— 貼著目鏡、手在調焦、眉毛揚起來。
2. **牙齒**（次組）—— 抬頭看那個放大圈，眉毛揚起來、嘴角有一點笑。
3. **細菌**（第三組，**只出現在圈裡**）—— 兩隻在表面被光照到摀眼睛、兩隻正往細縫裡鑽、
   一隻要溜出圈外。**圈外面一隻都沒有** —— 肉眼本來就看不到，這正是這張圖要講的事。

---

## 二、玻璃帶：顯微根管的方向和牙周**相反**（這一節是硬約束）

牙周那張的難處是「背景太亮，帶子上的字讀不到」。**顯微根管反過來** ——
`multiply` 上色底下，磚紅色會把背景的綠與藍打掉七成，所以**字永遠讀得到**，
真正會出事的是**帶子的顏色追不上標籤那顆磚紅**（＝使用者 2026-08-23 對牙周提出的
那個問題：「帶子的顏色看起來和主題色很不一樣」）。

**這一輪實測**（Chromium 疊真的三層，`--blend multiply --ink 0.18 --blur 6`，
紙色字 `#e2e5e6`）：

| 帶子後面那面牆 | 直接用套色當來源 | 補償後的 `--tintcolor` | 補償後帶子落在 | 紙色字對比 |
| --- | --- | --- | --- | --- |
| `#cbbfb2`（L75） | `#7a3832`（太深） | `#ff747a` ← 已到頂 | `#af4f4c` | **4.10** |
| `#d1c6ba`（L78） | — | `#f76f74` | `#ae4e4b` | **4.16** |
| **`#d9cfc4`（L81）** | `#823c37` | **`#ef6b6f`** | **`#af4f4c`** | **4.10** |
| `#e0d7cc`（L84） | `#89403b` | `#e7676b` | `#af4f4c` | **4.10** |

> **所以這張圖的牆（頂 17% 的中位）只有一個硬條件：紅色通道 ≥ 203。**
> 愈亮愈寬鬆 —— 2026-08-24 使用者要「白色明亮的診間」，牆改成 `#e5ded4`（R 229）之後
> 補償色換成 `#e26467`，帶子照樣落在 `#af4f4c`、對比照樣 4.10（實測）。
> ⚠ 唯一的上界不是帶子，是**無彩空白 < 5%**：牆要留得住暖色（HSL S 約 20），
> 中性灰或純白會被算進去。

三件跟著來的判斷：

1. ⚠⚠ **不能比 `#cbbfb2` 更暗。** 補償的來源色是
   `M = ((套色 − 0.18×墨) ÷ 0.82) × 255 ÷ 牆`，牆的紅色通道低於 **203** 時
   `M` 的紅就超過 255 補不上去，帶子只能往深階漂。
   （漂掉不會不能讀 —— 對比反而升到 5~9 —— 但那就和牙周那張「帶子逐值等於站上
   那顆標籤」的做法不一致了。）
2. ⚠ **也不要更亮。** 亮到接近白牆會踩另一條門檻：**無彩空白 < 5%**
   （S < 12 且 L > 80）。暖陶土的 S 有 20 上下，白牆是 0。
3. ⚠ **對比 4.10 過不了站上的 4.5，那是已經被接受的那一級**（一般牙科 4.40、
   牙周 4.40／3.83，ILLUSTRATION.md 第十一節寫著「不要拿對比度來訂正它」）。
   **不要為了補這 0.4 去加墨或加濃度**，那會把玻璃變成一塊實心板。

---

## 三、250px 下會讀到什麼（先想這件事，再想畫面好不好看）

訊息卡實測只有 **212 CSS px** 寬。這張圖縮到那個尺寸時，能活下來的只有四塊：

    ① 左半一台白色的機器（顯微鏡）　② 一個穿白袍的人貼在它上面
    ③ 一道從機器斜下來的暖光　　　　④ 光底下一顆大牙齒
    ⑤ 壓在牙齒上的一個**大圓**（放大圈），圈裡有幾隻看得出形狀的細菌

櫃子、地板、牆在那個尺寸都是「有東西在那裡」而已 —— **那沒關係，但它們不能是
畫面的重點**。所以：光錐要**大**（斜跨畫面約三分之一寬）、牙齒要**大**、
顯微鏡要**大而簡單**（不要畫小零件、不要畫刻度、不要畫螺絲），
**放大圈的直徑要有畫面高的六成**（212px 的卡上約 67px，圈裡五隻細菌各約 17px）。

---

## 四、參考圖清單（五張，用途要分開標）

⚠ 不標用途的參考圖會被整張抄走（風格、顏色、構圖一起）——TEAM.md 第一節第 10 號。

| # | 檔案 | **只參考這個** | **不要參考** |
| --- | --- | --- | --- |
| ① | `drafts/endo-scope-ref.jpg` | **牙科顯微鏡的形狀**：雙目鏡、機身上的黑色調焦旋鈕、兩支握把、白色關節臂；以及**人怎麼用它**（眼睛貼上目鏡） | 顏色、構圖、臉、那張圖的房間 |
| ② | `drafts/endo-face-ref.jpg` | **人的畫法與比例**：線的實度、平塗的臉、白袍與刷手服的形狀、全身高度佔畫面多少 | **顏色**（那張是一般牙科的綠，這一張要換成磚紅系）、姿勢 |
| ③ | `drafts/canal-ref.png` | **根管的形狀**：細、彎、有分支，**每一條末端到輪廓都留著一段牙質**（不穿出去） | 它的畫法（那是結構圖不是插畫）、顏色、格數 |
| ④ | `assets/og-topic-perio.jpg` | **整體色調、紙紋、密度**，以及**細菌的畫法**（圓身體、兩點眼睛、短手短腳、兩階色、滑稽不嚇人） | **構圖**（那張是動作場面）、人數、水的語彙 |
| ⑤ | `drafts/endo-zoom-concept-ref.jpg` | **概念**：肉眼只看到一點東西，放大之後才看到細菌 | **風格全部不要**（粗黑等寬外框、上百隻小菌、紅腫牙齦、紅箭頭）、構圖、顏色 |

⚠ ①②③ 的來源都是站上自己的圖，所以「風格對齊站上」這件事是**用圖對齊的，
不是用形容詞對齊的**（ILLUSTRATION.md 第十之一節）。
產生 ①② 的腳本：`node drafts/og-topic-endo-refs-crop.mjs`。

---

## 五之〇、第一版的量測（2026-08-24，使用者：「風格和品質蠻好的　我很喜歡」）

生成圖存成 `drafts/og-topic-endo-v1.jpg`（1424×752），疊上帶子的預覽是
`drafts/endo-v1-card-preview.jpg`，**212px 的訊息卡實況**是
`drafts/endo-v1-thumb212.jpg`（放大三倍檢視）。

| | v1 | 門檻 | |
| --- | --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **0%** | < 5% | ✅ |
| 邊緣密度（縮到 1200×628 再量） | **16.5%** | ≥ 30% | ❌ **這一格差最多**（牙周那張 31.6%） |
| 各角色的線一樣實（最暗 5 百分位） | 原尺寸 **相差 16.0**（醫師 25.3／牙齒 34.7／細菌 18.7／顯微鏡 26.4）；縮到卡片尺寸 20.2 | < 20 階 | ✅ 沒有鬼魂 |
| 頂 17% 的牆・中位 | **`#d7c1ac`**（R 215） | R ≥ 203 | ✅ 落在算出來的窗口裡 |
| 頂 17% 有沒有東西伸進來 | **有：6.54% 的像素不是牆，橫跨 212 欄，從 y=0 就開始** | 0 | ❌ 顯微鏡的臂爬到畫面最上面 |

⚠ 那 20.2 是**框沒框好**造成的，不是有人被畫淡：牙齒那個框幾乎整片是亮色塊、線只佔一點點，最暗 5 百分位就被拉高了。**框要框在有線的地方**（臉、輪廓、衣褶），不要整個角色連背景一起框。

**所以要修的是三件（不是風格，風格保留）：**

1. ⚠⚠ **牙齒不要開膛剖腹。** 使用者：「牙齒被開膛剖腹的意象有點可怕＋詭異。」
   —— 這一條同時解掉 250px 的問題：那扇打開的門在訊息卡上只是一片白，讀不出來
   （見 `endo-v1-thumb212.jpg`）。
2. ⚠⚠ **顯微鏡的臂爬進頂 17%。** 提示詞第五版就寫了「臂從左緣進來」，模型沒照做
   （牙周那張也發生過，那是通則不是個案）。v2 把顯微鏡改成**落地的支架**，
   臂從左緣進來、整台的最高點在畫面 25% 以下；若還是爬上去，就照第七節那一步
   機械地把整張往下推。
3. ⚠ **密度只有門檻的一半。** 成因是大面積的平塗：牆、地板、牙齒本體幾乎沒有筆觸。
   v2 靠三件補回來：**放大圈本身**（紋理 ＋ 細菌 ＋ 圈的邊）、
   **櫃子畫出門片分割與檯面邊線**、**牆與地板要看得見手繪顆粒**。

## 五之一、使用者給的新概念（2026-08-24，逐字）

> 「我找到一張　牙齒上肉眼看起來好像有東西　但放大看上面很多細菌　可以參考這個概念
> 　而且也不用一定要把牙齒開膛剖腹　可以是牙齒表面的髒汙放大看到細菌們」

參考圖存成 `drafts/endo-zoom-concept-ref.jpg`。⚠ **只取「概念」，不取風格** ——
量過那張：邊緣密度 15.8%、無彩空白 5.1%、粗黑等寬外框、上百隻小菌、
紅腫的牙齦、三支紅箭頭。**後四項站上一項都不能要**（紅腫與箭頭各自踩一條紅線）。

⚠⚠ **這一改推翻了 ILLUSTRATION.md 第十一節硬規格第 6 條的一半**（「不放放大圈」）。
那一條的理由是「250px 下會變成雜點」，所以**推翻是有條件的**：

- 圈要**大** —— 直徑 ≥ 畫面高的 60%（1200×628 上約 380px，212px 的卡上約 67px）。
  小圈就是那一條原本要擋的東西。
- 圈裡**只准五隻大細菌 ＋ 一條縫**，不准像參考圖那樣塞滿上百隻。
- 圈是**顯微鏡看到的東西**，不是手持放大鏡（沒有握把）——這張圖的主角是顯微鏡。
- 這一站本來就有「圓圈裝放大的內容」這個語彙（〈生物陶瓷〉那張 HERO 的兩個泡泡），
  所以它不是新東西，只是**不能有泡泡的尾巴**（尾巴＝在想什麼，這裡是在看什麼）。

**梗因此往前挪了一步，而且更貼那一頁的軸**：肉眼只看到牙齒上一小塊暗暗的東西，
放大之後才看到**那底下有一條細縫、細菌正往裡面鑽** ——
「看不到的地方才是問題所在，放大了才找得到」正是顯微根管在賣的那一件事。

## 五之二、第二版的量測與使用者的三件（2026-08-24，使用者：「好多了」）

生成圖存成 `drafts/og-topic-endo-v2.jpg`。**放大圈這條路成立** ——
細菌只在圈裡、牙齒完好、圈夠大，250px 下讀得到。使用者只退三件，
而且三件**都量得出來**：

| 使用者說 | 量出來是什麼 |
| --- | --- |
| 「診間偏黃色，之前的白色明亮比較好」 | 牆的彩度 **S25→S42**、地板 **S53→S66**、整體平均 L **76.4→73.9**。**確實整張泛黃、而且變暗了** |
| 「醫師是半蹲，好可憐好奇怪，給她一張醫師椅吧」 | v1／v2 的提示詞寫的都是「站著、從腰部前傾」—— 真的顯微鏡是**坐著**用的，這是我寫錯不是模型畫錯 |
| 「顯微鏡的角度是往下，應該轉成對牙齒；燈光畫的往右上放射很奇怪」 | 提示詞只說了光錐「往右下」，**沒說鏡頭要瞄準牙齒**，模型就把光當成一把往外撒的扇子 |

**其餘的數字：**

| | v1 | v2 | 門檻 |
| --- | --- | --- | --- |
| 無彩空白 | 0.03% | 4.18% | < 5%　⚠ 已經很靠近，v3 把房間改亮時要盯著這一格 |
| 邊緣密度 | 16.5% | **21.7%** | ≥ 30%　❌ 還是不夠（一般牙科 39.3／牙周 31.6／生物陶瓷 HERO 29.9） |
| 頂 17% 牆色中位 | `#d6c1ac` | `#d9b9a1` | R ≥ 203　✅ |
| 頂 104px 有東西伸進來 | 6.54%（y=0 起） | **14.6%（y=22 起）** | ≈ 0　❌ 顯微鏡的架子與臂又爬上去了 |

⚠⚠ **「房間改亮」不會動到帶子** —— 這是先算過才敢改的：牆改成 `#e5ded4` 之後
補償色換成 `#e26467`，帶子一樣落在 `#af4f4c`、對比一樣 **4.10**。
（能不能落在主題色上看的是**紅色通道 ≥ 203**，而愈白的牆紅色通道愈高，所以改亮只會更寬鬆。）

⚠ **改亮唯一要盯的是無彩空白那一格**：白牆若失去暖色就會被算進去（S<12 且 L>80）。
所以 v3 寫的是「**帶著暖意的白**（S 約 20），不是中性灰也不是純白」，
彩度改由刷手服、櫃子、椅子、細菌與那道暖光負責。

⚠ **密度還差 8 個百分點**，v3 用四件補：牆與地板要有**看得見的手繪顆粒與淡排線**、
櫃子畫出**門片分割與檯面邊線**、牙齒表面多幾道**彎曲的排線**、
新加的**醫師椅**（椅腳、輪子、椅背本身就是線）。

## 五之三、第三版的量測與使用者的兩件（2026-08-24，使用者：「大部分都改了很棒」）

生成圖 `drafts/og-topic-endo-v3.jpg`。**上一輪那三件全部過了** ——
房間白了（牆 `#e9e2d8`、無彩空白 1.21%）、醫師坐在醫師椅上、鏡頭與光都對著牙齒。

| | v1 | v2 | v3 | 門檻 |
| --- | --- | --- | --- | --- |
| 無彩空白 | 0.03% | 4.18% | **1.21%** | < 5% ✅ ⚠ 房間改亮**沒有**讓這一格惡化（暖色留住了） |
| 邊緣密度 | 16.5% | 21.7% | **21.5%** | ≥ 30% ❌ 三版都沒過 |
| 頂 17% 牆色中位 | `#d6c1ac` | `#d9b9a1` | **`#e9e2d8`**（R 233） | R ≥ 203 ✅ |
| 頂 104px 有東西伸進來 | 6.5% | 14.6% | **12.6%** | ≈ 0 ❌ **第三次** |

### 使用者的兩件

> 「牙齒看起來有點置身事外欸，蠻奇怪的。牙齒應該會有兩種狀況：
> 　1. 知道自己生病了希望醫師救救他　2. 知道醫師正在努力救他，覺得放心信任安心。
> 　另外細菌有點少，而且看起來很安靜，要激烈調皮作怪的樣子」

**① 「置身事外」的成因是三件同時發生的**（v3 的牙齒：眼睛看著鏡頭／圈、身體正面朝觀眾、
兩隻手擺在身前沒有指涉）—— **沒有任何一條線把牠和醫師連起來**，所以牠只是站在那裡。
v4 因此把**眼神線**當成最重要的一條寫死：眼睛看醫師（不是看鏡頭、不是看圈），
身體轉向醫師，**一隻手按在自己那塊髒污上**（＝牠知道自己哪裡出問題），另一隻手放鬆。

⚠⚠ **兩種狀況我選第 2 種（信任），第 1 種只保留「牠知道自己生病了」那一半。**
理由是牙周那一輪已經走過同一題：使用者當時給的兩案裡，
**「牙齒喊救命」被否決**（推導在本篇第三節的來源、`og-topic-perio-prompt.md` 第三節）——
分享卡是最先被看到的東西，**開場先求救就是推力不是拉力**。
而「知道哪裡有問題 ＋ 相信有人在處理」正好把兩種狀況合起來，也接得住那一頁的收尾
（「看到什麼都會告訴你，再一起決定」）。

**② 「細菌很安靜」的成因也量得出來**：五隻、**均勻分布**、**直立站著**、
只有表情沒有動作。v4 改成 **九隻（四大五小）、擠成兩三團、每一隻都在做一件事**
（往縫裡鏟土、扭打翻滾、頭下腳上鑽進去、被拖著走、扮鬼臉、被光嚇得跳起來、
沿著縫狂奔），加**短動線**與飛起來的土屑，並寫死一句
「牠們玩得很開心，還不知道自己被發現了」。
⚠ 仍然守著：**只在圈裡**、不尖刺不噁心、不拿工具。

### ⚠⚠ ③ 頂 17% 連三次踩到 —— 改用機械修法，不要再靠提示詞

三版的提示詞都寫了「頂端留白」，三版都失敗（6.5%／14.6%／12.6%），
而且**在 212px 的卡上看得見**：v3 那條顯微鏡的臂變成一道劃過「顯微根管」四個字的
髒污（`drafts/endo-v3-thumb212.jpg`）。牙周那次的解法是「把整張往下推」，
但這一張**推不得** —— 底部就是醫師椅的輪子與地板，推下去會切掉。

所以新增 **`drafts/og-topclean.mjs`**：把頂 17% 那一條**重畫成牆**
（那一條本來就被帶子整片蓋住，看不見的東西不必留）。

    node drafts/og-topclean.mjs <原檔> <輸出> --cols 0.375,0.48

實測 v3：帶子從「有一顆深色的旋鈕壓在字上」變成乾淨的一條
（`drafts/endo-v3-clean-card-preview.jpg`）。**兩件踩過的坑寫在那支的檔頭**：

- ⚠⚠ **不要重畫整條** —— 第一次沒給 `--cols`，把**放大圈的上緣一起抹平**，
  變成一條切齊的橫線。**只有「伸進去的是背景物件」才可以抹**，臉、手、圈這種
  有意義的東西要回頭改構圖（v4 因此多寫一句「整個圈都要在頂 17% 以下」）。
- ⚠⚠ **逐欄各自往上外插會長出直條紋** —— 每一欄的取樣各自帶雜訊，外插一百多列
  就放大成一條一條。改成**橫向先平滑、斜率取整段平均並夾在 ±6 階**之後才乾淨。

## 五、提示詞（第四版，逐字，可直接複製）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview
card. It will be seen at about 250 pixels wide, so everything must read at thumbnail size:
big simple shapes, few large objects, one single continuous scene, no panels and no dividing
lines.

THE WHOLE PICTURE IS BRIGHT, CLEAN AND WHITE - a dental treatment room at midday with plenty
of daylight in it. The walls and floor are WHITE WITH ONLY A HINT OF WARMTH IN THEM, never
cream, never beige, never tan, never mustard and never yellow. DO NOT PUT AN OVERALL YELLOW,
AMBER OR SEPIA CAST OVER THE IMAGE: the only golden thing in the picture is the microscope's
light. Read this paragraph as the mood of the whole image before drawing anything else.

THE SEVEN THINGS THAT MATTER MOST, IN ORDER:

1. DRAW THE PEOPLE EXACTLY IN THE STYLE OF THE REFERENCE IMAGE OF THE FEMALE DENTIST.
   Thin hand-drawn linework whose weight varies and sometimes breaks - NOT a thick even
   outline. Each face is ONE FLAT SKIN TONE with no shading, no modelling, no cheekbones and
   no jaw shadow. On the face there is only: the outline, two eyes drawn as small simple
   dots with NO whites, NO pupils and NO highlights, two short eyebrows, a tiny nose mark, a
   small mouth line and an ear. Hair is a flat shape in two tones with no individual
   strands. This is the single most important instruction.

2. THE DENTIST IS SITTING ON A DENTIST'S OPERATING STOOL. The stool has a round padded seat,
   a small curved back support, a slim gas-lift column and a five-star base on castors. SHE
   SITS UPRIGHT: back straight, thighs level, feet flat on the floor, leaning in only
   slightly from the hips so that her eyes reach the eyepieces. SHE IS NOT CROUCHING, NOT
   SQUATTING, NOT KNEELING, NOT PERCHING AND NOT BENDING OVER WITH STRAIGHT LEGS - she is
   comfortably seated and working, and she looks completely at ease. USE THIS ANCHOR: seated,
   the top of her head sits just below the top sixth of the picture and the castors of her
   stool are close to the bottom edge, so she is drawn large and close to us.

3. THE MICROSCOPE IS AIMED STRAIGHT AT THE TOOTH, AND SO IS ITS LIGHT. The machine stands to
   the LEFT of the tooth. Its body is TILTED so that the objective lens at its lower front
   end POINTS DIRECTLY AT THE GIANT TOOTH along one straight, slightly downward line. The
   binocular eyepieces angle back and upwards towards the dentist's eyes at about forty-five
   degrees, exactly as in the reference image of the microscope. THE LIGHT LEAVES THE
   OBJECTIVE ALONG THAT SAME LINE: narrow where it leaves the lens, widening gently, and
   landing on the tooth as a soft warm pool of light that wraps around the tooth and spills
   onto the floor at its feet. THE LIGHT NEVER FANS UPWARDS, never spreads towards the upper
   right, never radiates in more than one direction, and never becomes a big triangle across
   the picture. Light colour #f7e3c0, fading to #f6ecd6 at its edges; soft-edged, NOT a solid
   yellow wedge, NOT a laser beam, NOT a spotlight ring on the floor.

4. THE TOOTH IS WHOLE AND CLOSED, AND IT IS PART OF WHAT IS HAPPENING. One big molar
   standing on the floor on two short root-legs, its crown reaching the dentist's eye level.
   Warm ivory (#f2e7d5, shaded with #ddcbb0 and #c9b294), WITH PLENTY OF LOOSE HAND-DRAWN
   SHADING STROKES CURVING OVER ITS SURFACE so it never reads as a flat white shape. IT IS
   NOT CUT OPEN: no window, no door, no opening, no hatch, no cross-section, and the viewer
   never sees its inside. HIGH ON ITS UPPER RIGHT SHOULDER there is ONE SMALL DULL BROWNISH
   SMUDGE about a tenth of the tooth's width, sitting in a shallow groove - so faint that you
   would barely notice it. That smudge is the only mark on the tooth.

   ITS WHOLE ATTITUDE IS "SOMETHING IS WRONG WITH ME, AND SHE IS ON IT". Draw all four of
   these together, or the tooth will look like a bystander:
   • ITS BODY IS TURNED TOWARDS THE DENTIST, leaning very slightly her way, not square to
     the viewer.
   • ITS EYES ARE ON THE DENTIST - looking across at her, NOT at the viewer, NOT at the
     circle, NOT into the distance. This eye-line is the most important part.
   • ONE STUBBY ARM IS RAISED AND ITS HAND RESTS ON ITS OWN SMUDGE, the way a person touches
     the spot that hurts - it knows exactly where its problem is. The other arm hangs
     relaxed, NOT clasped, NOT wringing, NOT held out begging.
   • ITS FACE IS TRUSTING AND RELIEVED: eyebrows lifted a little at the inner ends, eyes
     softly open, a small closed smile, shoulders down and easy. It is being looked after
     and it knows it. It is NOT frightened, NOT crying, NOT pleading, NOT in pain, NOT
     grinning wildly and NOT indifferent.

5. THE BIG ROUND MAGNIFIED VIEW IS THE SECOND HERO OF THIS PICTURE. It is a large circle
   whose diameter is about three fifths of the picture height, hanging in the UPPER RIGHT of
   the picture, its lower left edge touching and slightly overlapping the tooth's upper right
   shoulder, DIRECTLY ABOVE THE SMALL BROWN SMUDGE - so that it reads as that one patch of
   tooth surface enormously enlarged. THE WHOLE CIRCLE, INCLUDING THE TOP OF ITS RIM, SITS
   BELOW THE TOP SIXTH OF THE PICTURE. It is NOT what the light is pointed at. Its rim is a
   clean pale cream-and-chrome ring, evenly thick, with a soft shadow behind it, a thin
   brick-red (#ae4f4d) inner line, and a faint pale halo around it. It has NO handle, NO
   stalk and NO bubble tail: it is what the microscope sees, not a hand lens and not a
   thought bubble. INSIDE THE CIRCLE, hugely magnified: the ivory tooth surface drawn with
   fine texture, and ONE NARROW DARK CREVICE running across it in a soft curve, with soft
   brown dirt caught along it. THE CIRCLE IS CROWDED, BUSY AND FULL OF MOVEMENT - it is the
   noisiest, most detailed part of the whole picture, and it is where all the mischief is.

6. THE GERMS ARE A ROWDY LITTLE GANG AND THEY ARE MAKING A MESS. THERE ARE NINE OF THEM,
   ALL INSIDE THE CIRCLE, IN TWO SIZES: FOUR BIG ONES (each about a quarter of the circle's
   diameter) and FIVE SMALLER ONES. THEY ARE NOT STANDING IN A ROW AND THEY ARE NOT EVENLY
   SPREAD - they are bunched into TWO OR THREE OVERLAPPING CLUMPS with gaps between the
   clumps, and every single one of them is caught in the middle of DOING SOMETHING:
   • one shovelling brown dirt into the crevice with both hands, bottom up;
   • two wrestling and tumbling over each other on the surface, legs in the air;
   • one diving head-first into the crevice with only its legs still showing, kicking;
   • one hanging on to that one's leg and being dragged in;
   • one standing at the crevice's edge pulling a face and sticking its tongue out;
   • one jumping in fright as the light hits it, arms up, feet off the ground;
   • two scampering along the crevice, leaning far forward as they run.
   Give the movement SHORT HAND-DRAWN MOTION STROKES beside the ones that are moving, a few
   small crumbs of dirt flying, and tilt their bodies - nobody stands upright and still.
   THEY ARE HAVING A WONDERFUL TIME AND THEY DO NOT KNOW THEY HAVE BEEN FOUND.
   Each germ is a simple rounded blob with two dot eyes, an open mouth and short stick arms
   and legs, in brick red, olive, mustard and dusty plum, two tones each, comic, clumsy and
   naughty, never frightening and never disgusting. They have NO spikes, NO bristles, NO
   hair, NO fangs and NO tentacles, and they hold NO tools. A light scatter of much smaller
   specks and crumbs sits behind them as texture, INSIDE THE CIRCLE ONLY. THEY EXIST ONLY
   INSIDE THE CIRCLE - there is not a single germ anywhere else in the picture, because to
   the naked eye they cannot be seen. That is the whole point.

7. NO WRITING ANYWHERE in the image, in any language.

THE MICROSCOPE'S SHAPE is exactly the one in the reference image of the microscope, but drawn
BIG AND SIMPLE: a pair of angled binocular eyepieces, a boxy body with two big dark-grey
focus knobs and two curved dark-grey handles, and a white jointed arm. ONLY THE LOWER PART OF
ITS FLOOR STAND IS VISIBLE at the far left, cropped by the left edge, and its arm reaches in
from the LEFT EDGE at about one third of the way down the picture. THE WHOLE MACHINE -
EYEPIECES, BODY, ARM AND STAND - STAYS BELOW THE TOP SIXTH OF THE PICTURE, AND NO PART OF IT
IS EVER HIGHER THAN THE TOP OF THE DENTIST'S HEAD. Its housing is a
clean pale cream-white with a light grey underside, its knobs and handles are dark warm grey,
and there is ONE BRICK-RED RING (#ae4f4d) around the objective housing - that ring is the only
saturated red on the machine. Big simple shapes only: no screws, no scales, no small buttons,
no dials.

THE WALL, THE FLOOR AND THE TOP OF THE PICTURE - IMPORTANT AND EXACT. The wall is a VERY
LIGHT WARM OFF-WHITE, about #e5ded4: it must read as a bright white clinic wall that merely
leans warm - never a neutral grey, never a pure flat white, and never cream, beige, tan or
yellow. The floor is a pale seamless vinyl clinic floor, slightly lighter and slightly cooler
than the wall (about #ece8e2), softly reflective with a few long horizontal reflection
strokes, meeting the wall in a CONTINUOUS COVED SKIRTING that curves up the wall. THE TOP
SIXTH OF THE PICTURE IS PLAIN WALL AND NOTHING ELSE - no faces, no hands, no objects, no
microscope, no arm, no stand, no circle, no light and nothing darker or brighter anywhere
inside that strip.

THE DENTIST - a Taiwanese woman in her thirties with a soft, slightly rounded young face and
dark hair in a low ponytail. Her hair is very dark and warm-toned (#483837, shading to
#392928, catching light at #4f4040). She wears an open white coat over DUSTY-ROSE SCRUBS
(#d7b7b7, with #b89999 in the folds) and white shoes. NO face mask and NO goggles. Both eyes
are at the eyepieces, one hand rests on the big focus knob and the other steadies the body of
the microscope. Her eyebrows are lifted and she wears a small, delighted, private smile - she
has just found something.

THE ROOM - THIS IS UNMISTAKABLY A DENTAL SURGERY, NOT A LABORATORY, A GALLERY, A SHOWROOM OR
AN EMPTY HALL. Besides the microscope and the stool it is built from exactly TWO large clinic
objects, both set behind the people and partly overlapped by them. EVERY ONE OF THEM IS FULLY
DRAWN AND FULLY COLOURED, WITH THE SAME LINE WEIGHT AND THE SAME LINE DARKNESS AS THE PEOPLE.
They are secondary only because they are further away and partly hidden - NEVER because they
are pale, faint, greyed out, thinly outlined or unpainted.
  • A LONG LOW RUN OF CLINIC CABINETS along the wall, running the whole width of the picture
    behind everything and cropped by both edges: PALE ASH-WOOD doors (#e0d5c4, a quiet greyed
    wood - not honey, not orange, not golden oak) with NO handles, but WITH VISIBLE DIVISIONS
    BETWEEN THE DOORS AND A CLEAR EDGE LINE ALONG THE WORKTOP, and NOTHING standing on the
    worktop. It sits low, behind everything, with the wall showing above it.
  • A DENTAL CHAIR at the RIGHT, fully coloured in pale sage upholstery on a light grey base,
    with a headrest and a padded backrest, standing at a slight angle, cropped by the right
    edge. It is EMPTY - nobody is lying in it.
There is nothing else in the room: no window, no poster, no shelf, no bottles, no tray of
instruments, no monitor, no plant, nothing standing on the worktop.

DENSITY - THE PICTURE MUST NOT BE EMPTY, EVEN THOUGH IT IS WHITE AND BRIGHT. Every surface
carries visible drawing: a fine hand-drawn grain over the whole image, light pencil hatching
across the wall and the floor, loose curved shading strokes over the tooth, panel lines on the
cabinets, the skirting line, the stool's column, base and castors, and the dense texture
inside the circle. No empty patch of flat colour is wider than a tenth of the picture. A
bright room is not an empty room.

STYLE - contemporary printed-magazine editorial illustration, exactly as in the reference
image of the dentist. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue -
EXCEPT SKIN, which is always one single flat tone.

DRAW THE DENTIST, THE TOOTH, EVERY GERM, THE MICROSCOPE, THE STOOL, THE CIRCLE, THE CABINETS
AND THE CHAIR WITH THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME SOLIDITY OF
COLOUR. Distance is shown by size and by overlapping, and by nothing else. Nothing in this
picture is a pale outline.

COLOUR - THE ROOM IS WHITE AND BRIGHT, AND THE COLOUR COMES FROM THE THINGS IN IT. The wall
and the floor are the two palest areas and stay that way; everything else carries real colour:
dusty rose scrubs, white coat, pale ash cabinets, pale sage chair, dark warm-grey stool, warm
ivory tooth, the warm golden light, and germs in brick red, olive, mustard and dusty plum. At
least seven distinct colours are readable at thumbnail size, and the picture never looks
washed out, dusty or pastel.

NO WRITING ANYWHERE IN THE IMAGE - no text, letters, words, numbers, logos, signage, captions
or watermarks, in any language.

AVOID - a tooth that looks like a bystander: staring at the viewer, staring at the circle,
gazing into the distance, standing square-on with both arms hanging or folded, or showing no
reaction to what is happening; a tooth that is begging, praying, crying, screaming or
frightened; germs standing in a row, evenly spaced, standing still, standing upright or
posing for the viewer; only a handful of germs; an overall yellow, amber, golden or sepia
cast over the picture; a cream, beige, tan,
mustard or yellow wall; honey, orange or golden-oak wood; a dim, gloomy or evening room; a
dentist who is crouching, squatting, kneeling, half-standing or bending over with straight
legs; a dentist standing up; a stool with no base, no column or no castors; light that fans
out upwards, spreads to the upper right, radiates in several directions or forms a wide
triangle; a microscope pointing at the floor, at the viewer or at nothing; the microscope, its
arm or its stand rising into the top of the picture; anything at all inside the top sixth; a
tooth that is cut open, opened, hinged, hollowed, sectioned or has a window, door or hatch in
it; any view of the inside of a tooth; gums, blood, nerves, pulp or anything anatomical; red
or pink inflamed tissue; arrows; a magnifying glass with a handle or a stalk; a bubble tail on
the circle; a small circle; several circles; germs anywhere outside the circle; germs with
spikes, bristles, hair, fangs or tentacles; hundreds of tiny germs; thick even outlines like
an American comic book; any shading, modelling, blush rendering or highlight on a face; eyes
with whites, pupils or catchlights; a face that looks older than the thirties; a laboratory
microscope standing on a bench; lens flare, sparkles or stars; speech bubbles, thought
bubbles, icons or diagrams; a patient lying in the chair; a drill, a syringe, a needle,
tweezers or any hand instrument; a face mask or goggles on the dentist; furniture drawn pale,
faint, greyed out, thinly outlined or left unpainted; a bare wall with nothing standing along
it; a bare concrete floor; a large empty area of flat colour; a screaming, crying or
frightened tooth; any figure drawn pale, faint, translucent or in outline only; greyscale;
photorealism.
```

## 六、交件前要過的門檻（插畫師自己跑，不過就不拿出來）

| | 門檻 | 出處 |
| --- | --- | --- |
| 無彩空白（S<12 且 L>80） | **< 5%** | TEAM.md 第一節第 9 號 |
| 邊緣密度 | **≥ 30%** | 同上 |
| 每個角色的線一樣實（最暗 5 百分位） | **相差 < 20 階** | 同上 |
| **頂 17% 的牆・中位** | **紅色通道 ≥ 203，且 HSL S ≥ 15**（v3 的目標是 `#e5ded4`） | 本篇第二節（實測） |
| 頂 17% 裡有沒有東西 | **一樣都不能有**（含光錐、顯微鏡的臂） | ILLUSTRATION.md 第十一節第 8 條 |

量測腳本：**`node drafts/og-measure-card.mjs <圖檔> [名稱=x0,y0,x1,y1 ...]`**
（2026-08-24 新增，五格一次跑完，框用比例不用像素）。
⚠ **邊緣密度一律先縮到 1200×628 再量**，不然和已上線那幾張不能比
（一般牙科 39.3％／牙周 31.6％／生物陶瓷 HERO 29.9％）。
⚠ **線的實度那一格，框要框在「有線的地方」**（臉、輪廓、衣褶）——
整個角色連背景一起框的話，亮色塊會把最暗 5 百分位拉高，看起來像有人被畫淡。
⚠ 那兩支寫死了 `/opt/node22/.../playwright`，**只在雲端 session 跑得動**；
Windows 那台請用 `drafts/og-measure-win.ps1`（必須是 UTF-8 with BOM）。
⚠⚠ **貼在對話裡的圖，雲端這一側讀不到檔案** —— 要跑數字，圖必須先存進 `drafts/`。

---

## 七、管線（圖回來之後，最多三步）

原檔存成 `drafts/og-topic-endo-src.jpg`（**原始出圖另存
`-src-raw.jpg`，不要覆蓋掉**），然後：

    node drafts/og-topclean.mjs drafts/og-topic-endo-src-raw.jpg drafts/og-topic-endo-src.jpg --cols <x0,x1>
    node tools/og-resize.mjs drafts/og-topic-endo-src.jpg endo
    node tools/og-plate.mjs endo --blend multiply --tintcolor #de6265 --ink 0.18 --blur 6 \
      --loc full --locpos stack

⚠ 第一步只有在**頂 17% 真的被東西佔到**時才跑（連三版都被佔到，見第五之三節）；
`--cols` 要先量出是哪幾欄，**不要整條重畫**。

⚠ 上面那個 `#de6265` 是照 **v3 實際的牆色 `#e9e2d8`** 算的。
v1 `#d7c1ac` → `#f17380`、v2 `#d9b9a1` → `#f27285`、提示詞裡寫的目標 `#e5ded4` → `#e26467`。
**牆一變就要重算**：

    M(每個通道) = ((#ae4f4d 的該通道 − 0.18 × 墨) ÷ 0.82) × 255 ÷ 牆的該通道
    （墨 ＝ rgb(42,44,39)；分子固定是 R 203.0 / G 86.7 / B 85.3）

⚠ **牙周與一般牙科用的參數不一樣，這一張也會不一樣** —— 要一致的是
「帶子等於站上那顆標籤、字讀得到」，不是那幾個數字。
⚠ **兩步要從頭跑**：`og-plate.mjs` 讀寫同一個檔，只跑第二步兩次會把帶子疊兩層。
⚠ **出圖模型通常不會照「頂端 17% 留白」那條指令**（牙周那張踩過）。
若髮頂或機器伸進帶子裡，照 `og-topic-perio-prompt.md` 第四之一節那一步
**把整張往下推**、頂端用每一欄自己的牆色往上外插補一條 —— 那一條反正被帶子蓋住。
⚠ 產完要在 `tools/topics.mjs` 的 `OG_ALT` 補一句**描述圖裡實際有什麼**，
需要的話一併補 `OG_DESC`（訊息卡的描述可以和搜尋結果不一樣），再跑 `node tools/topics.mjs`。

---

## 八、還要問使用者的

1. **醫師畫成女性** —— v1 就是女醫師（陳芷鈴醫師是這一科的專長掛的人），使用者沒有異議，
   **當作定了**。服裝與頭髮沿用 ILLUSTRATION.md 第十之三節量出來的那一組磚紅系。
2. ✅ **已經默認過了（v2、v3 都在畫面裡，使用者說「好多了」「很棒」）**：
   ⚠⚠ **「表面的髒汙」在語彙上其實比較靠近牙周／洗牙** —— 顯微根管真正藏東西的地方
   是牙齒**裡面**（那一頁寫的是「又細又彎的牙髓，放大了才找得到」）。
   v2 的折衷是：放大圈裡**不是單純的牙菌斑**，而是**一條細縫 ＋ 細菌正往裡面鑽** ——
   「看不到的地方才是問題所在」這件事仍然成立，而且不必把牙齒剖開。
   **建議：保留那條細縫。** 若你要更純粹的「表面髒汙」，我就把細縫拿掉，
   但那張圖會和牙周那一頁的意象靠得很近。
3. **細菌只出現在放大圈裡，圈外一隻都沒有** —— 這是刻意的（肉眼看不到才需要顯微鏡），
   也順便解掉 v1 那幾隻大細菌看起來有點恐怖的問題。**建議：這樣。**
4. **放大圈推翻了 250px 那條「不放放大圈」的硬規格**（ILLUSTRATION.md 第十一節第 6 條）。
   我沒有整條拿掉，是加了四個條件（圈要大、內容要少、沒有握把、沒有泡泡尾巴）——
   **這一張定案之後我會把它寫回 ILLUSTRATION.md**，日後其他科才知道界線在哪。
5. ✅ **牙齒的兩種狀況（2026-08-24）已經照第五之三節判了**：取第 2 種（信任），
   第 1 種只留「牠知道自己生病了」那一半（手按在自己的髒污上）——
   「喊救命」在牙周那一輪已經被否決過，分享卡開場求救是推力。
   **若你要的其實是第 1 種（求救）**，說一聲，我把那四條眼神／姿勢改掉就好。
6. **這張定案之後，它同時是顯微根管線稿底圖的姿勢參考圖**
   （順序是分享圖在前、線稿在後）—— 線稿那一輪要從這張裁一段含腿的人物出來。
