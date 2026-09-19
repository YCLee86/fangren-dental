# HERO 提示詞：〈隱形矯正：模擬之後，醫師怎麼讓牙齒跑到位〉

**狀態：⏳ 提示詞寫好，還沒生圖（2026-09-19）。** 出圖用 Gemini。
規格依 [ILLUSTRATION.md](../../ILLUSTRATION.md) 第三節（規格）、第四節（紅線）、
第七節（寫提示詞學到的事）、第十之四／之五（顏色與臉）。文章在 `drafts/aligner-simulation/`。

## 一、使用者指定的梗（2026-09-19，逐字）

> 「之前已經畫過矯正落地頁　醫師透過各種飄浮在空中的螢幕操控牙齒移動　這個概念繼續沿用。
> 　另外也要展現出　醫師　透過電腦　高強度計算　運算　各種可能影響牙齒移動的因素
> 　並設計各種方法　或裝置　來移動牙齒。
> 　有點像工程師〔上線前〕修改程式碼跑測試的感覺　不過一個醫師太辛苦了
> 　多畫幾個醫師人員和研發工程師的人員一起用電腦、手機、平板或是在旁邊一起工作、協助的樣子
> 　表情或許有一兩個是很認真　但不要有太困難、艱辛、痛苦的樣子，
> 　稍微一點胸有成竹、不怕困難(不是非常開心喜悅)、即將解決困難、複雜問題帶有期待的樣子」

翻成畫面：**一間規劃室**，不是診療椅旁邊。四個人一起把一個療程算出來，
像上線前的工程團隊——但**平靜、有把握**。

## 二、動筆之前已經被鎖死的六件

### 1. 沿用哪些語彙、不准沿用哪些

**沿用**（來自 `assets/og-topic-ortho.jpg`）：飄浮在空中的半透明藍色螢幕、
白袍＋藍刷手服、長而柔的白色氛圍弧線、冷白牆的室內。
⚠ **這一科天生要冷光**（ILLUSTRATION 第十一節那張表：矯正卡在藍通道，暖色牆一開始就出局）。

**不准沿用**：`assets/hero-ortho-photo-*.jpg`（同一篇文章的鄰居）是**分格**的
——街上／餐廳／臥室三格。這一張要是**一個連續的空間，不分格**，
不然兩張在同一個列表裡會長得像同一張。
⚠ 第八節那張〈拔智齒〉是「人＋泡泡」，也不要用泡泡。

### 2. 這一張要讓人讀到的一句話

**「模擬畫面上沒有牙根，也沒有骨頭——有人在旁邊把這件事補上。」**
所以中央那面大螢幕上，**一顆牙被拉出來放大、整根牙根插進一塊半透明的齒槽骨剖面裡**。
這是整篇的論點，也是縮圖尺寸下唯一需要讀懂的東西。

### 3. 縮圖判準（335px）

首頁的文章卡只有 335px 寬，分享出去在 LINE 上只有 212px。
**那個尺寸要一眼讀到的只有兩樣：一面大的藍螢幕 ＋ 一個人伸手碰它。**
其餘三個人是氛圍，不要畫到跟主角一樣大。

### 4. 人可以是主角（這一次是例外，不是違規）

第三節那條「人物高度不超過畫面二分之一、主角是場景不是人」是 **B 類（推的）**，
2026-08-16 已經為了〈孩子第一次看牙〉放寬過一次。這一張使用者指定要畫一群人一起工作，
所以人可以佔比較大——**但 A 類紅線一條都沒鬆**：不逆光剪影、不寫實、不無臉、
不誇張頭身、不灰階、**沒有人轉頭看讀者**。

### 5. 表情的界線（使用者這一輪講得最細的一件）

| 要 | 不要 |
| --- | --- |
| 專注但放鬆的淺笑（閉嘴） | 皺眉、咬牙、抿成一條線的嘴 |
| 往後靠、托著下巴、微微點頭 —— 胸有成竹 | 扶額、揉太陽穴、雙手抱頭、嘆氣 |
| 眉毛保持水平 | 眉頭糾結、眼下黑眼圈、汗滴 |
| 一兩個人很認真（但不緊繃） | 疲憊、加班、桌上堆滿東西 |
| 帶一點期待、快要解開了 | 大笑、歡呼、擊掌、比讚、非常開心 |

⚠ 第七節第 7 條的近親：**情緒畫過頭會被讀成另一件事**。
「認真」用**身體的方向與視線**去畫（都朝著同一面螢幕），不要用臉上的線條。

### 6. ⚠⚠ 這一張最大的風險是「長出字」與「概念外溢」

**四面以上的螢幕 ＝ 四個以上會長出亂碼英文的表面**（第七節第 4 條：
`Brashriashing`／`Rowch teeth` 就是這樣來的），而且第七節第 6 條說
**每多一個「沒指定內容的表面」，就多一個外溢的落點**。
所以提示詞裡**每一面螢幕、每一台裝置、牆上那張海報的內容全部寫死**，
`NO WRITING ANYWHERE` 獨立成段、逐項點名。

## 二之二、第二輪：第一版出圖之後使用者退回的四件（2026-09-19）

| # | 使用者說的 | 改了什麼 |
| --- | --- | --- |
| 1 | 「右邊數來的第二個的人物風格明顯不搭」 | STYLE 段新增一整段 **ALL FOUR PEOPLE ARE DRAWN BY THE SAME HAND**，並**指名**右邊那位穿刷手服的男性要畫得和白袍醫師一樣簡單；AVOID 補一條 `one person drawn in a different style from the rest`。⚠ 成因和第十之五節是同一個：STYLE 段只要留一點空間，模型就會對某一張臉多加細節 |
| 2 | 「大螢幕上牙齒排列蠻整齊的　應該要亂一點」 | 牙弓改成**四條寫死的亂**：一顆轉三十度、一顆退到後面被左右蓋住、一顆往旁邊倒、**切端連線呈鋸齒不是平順的弧**。最後那一條是 ILLUSTRATION 第七節第 10 條的教訓（縮圖尺寸下眼睛讀的就是那條線）。AVOID 補 `a tidy evenly spaced dental arch` |
| 3 | 「並顯示類似 error 之類的標語」 | 放大的那顆牙上方加一個**琥珀色警示牌**：驚嘆號三角形 ＋ 單字 `ERROR`，逐字母拼出來；牙根抵到骨頭外緣的那一段也用同色標一下，讓人看懂警示在講哪一件事 |
| 4 | 「左一的先生表情太過輕鬆　不像認真工作的工程師」 | 從「往後靠、手托下巴」改成**身體前傾、雙手在鍵盤上、視線在自己的筆電、嘴是一條平直的閉合線**。AVOID 補 `anyone leaning back with a hand under the chin`。⚠ 「胸有成竹」這個調性移到女醫師身上（她的淺笑），不再要求每個人都帶一點 |
| 5 | 「挑幾台畫成診所 Logo　其他電腦或手機不用每台都壓圖片」 | 新增一整段 **WHAT IS ON EACH DEVICE**，六台逐台寫死：大螢幕（亂牙弓＋牙根＋警示）／小飄浮螢幕（五副牙套）／左上小螢幕（**診所標誌**）／筆電（**診所標誌**待機）／立架上的平板（**關機，全黑空白**）／技師的平板（牙根對照）／助理的手機（**關機**）。⚠ 少一個有內容的表面就少一個長字與外溢的落點（第七節第 6 條） |

另外自己抓到一件使用者沒提的：**第一版牆上那張海報長出了假文字**（幾條短橫線排成像句子的樣子）。
提示詞因此加了一句「海報上不可以有排成行的短橫線、破折號或曲線去模仿文字」。

### ⚠⚠ 兩個新的風險（出圖前先知道）

1. **`ERROR` 這個字八成會歪。** 整份提示詞原本的 `NO WRITING ANYWHERE` 就是因為
   模型會長出 `Brashriashing`／`Rowch teeth` 這種亂碼（第七節第 4 條）。
   現在刻意開了一個字的例外，所以**那五個字母要逐個放大檢查**。
   歪掉的話有兩條路：① 只留驚嘆號三角形、不要字（圖示本身就讀得懂「這裡要注意」）；
   ② 出圖時那一格留白，事後用腳本把乾淨的字疊上去（站上 `tools/og-plate.mjs`
   已經在做同一件事）。
2. **標誌會被畫走樣。** 模型畫品牌標誌幾乎一定會變形。**附 `assets/logo.png` 當參考圖**
   可以拉近，但要有心理準備要幾輪；真的要準，也是走上面第 ② 條那條路（留白後疊上去）。
   ⚠ 站上的標誌不是牙齒、不是愛心、不是葉子 —— 是一片有兩個圓弧的寬形，
   右側挖一個牙齒形狀的洞，洞是**真的穿透**的。

### ⚠ 品牌那一關：`ERROR` 不會變成在罵廠商嗎

不會，但寫法有差。提示詞裡那個警示牌寫成
**「規劃軟體自己把這一步標出來，請團隊看一下」** —— 是工具在做它該做的事，
正好接上這一篇定下來的視角（工具把力量傳得穩，醫師讓它跑到位），
不是「軟體算錯了」。⚠ **不要改寫成螢幕當機、紅色大叉、系統崩潰那種畫面。**

---

## 二之三、第三輪：動起來，以及警示牌上的數字（2026-09-19）

使用者：「雖然有白色線條氛圍感了　還是可以加一點動作或是說話的提示標記線條
讓場面沒那麼靜止」「因為牙齒很亂系統跳出的驚嘆提醒　也可以加入數字
（例如 200 到無限大之類的表示會需要很多組牙套）或是呈現治療時間要很久
（6-9 年以上）的概念」

### 1. 動作線與說話標記：五個位置，一種規格

新增 `MOTION AND SPEECH MARKS` 一段。**規格完全照 ILLUSTRATION 第七節第 17 條**
（那一條是〈擴張牙弓〉的氣流被讀成靈魂出竅學來的）：
**二到四條、同向、等距、極短（不超過手掌寬的三分之一）、起點實往外飛白、
不繞圈、不閉合、不比它所屬的東西大。**

五個位置：醫師的指尖（剛點了一下）／螢幕上那顆剛被轉動的牙（沿箭頭方向兩條）／
工程師的手腕上方（正在打字）／右邊那位抬起的手掌外緣／**同一個人的嘴邊兩條短斜線**（正在說話）。

⚠ **說話只用嘴邊那兩條，不給泡泡。** 泡泡是〈拔智齒〉那張的語彙（第八節），
再用會撞；而且泡泡一出現就會想往裡面填東西，那是長字的落點。
⚠ AVOID 補四條：背景速度線、集中線、星芒、任何形式的對話框。

### 2. ⚠⚠ 警示牌上的數字：放了「200+ ∞」，**沒有放年份**

放進去的：牌子變成兩行，上行是驚嘆號三角 ＋ `ERROR`，
下行小一點，是**一個牙套的小圖示 ＋ `200+` ＋ 無限符號**。
同一輪把工程師頭上那面小螢幕從「五副牙套」改成
**一長排牙套往畫面外延伸、越遠越淡、數不完** —— 數量這件事主要靠這個講，
牌子上的數字只是補一刀。

**沒有放年份，這是刻意的，成因寫在這裡免得日後被當成漏做：**

- **這張 HERO 同時是這一篇的 `og:image`。** 分享到 LINE 的時候圖是單獨出現的，
  旁邊沒有文章。圖上寫「6-9 年」，讀者會讀成「在這裡矯正要六到九年」，
  而文章正文寫的是**兩年上下**（使用者自己口述的規劃節奏）。
- 矯正著陸頁當初就是**刻意一個數字都沒有**（COPY.md 第九之十六節、
  `tools/topic-copy.mjs` 的 `ask`：療程長度與回診間隔還沒問到診所），
  而且 `og-topic-ortho` 的規則明文寫著「⚠⚠ 任何時間暗示：日曆、月份、進度條」不准。
- 「6-9 年」這個數字本身也沒有來源。站上寧可不寫，不能猜（CLAUDE.md 第二節）。

**療程很長這件事改用畫面講**：那一排戴不完的牙套本身就是「要很久」。
⚠ 使用者若仍要年份，改法只有一句：把牌子下行的 `200+` 換成
`6-9 YEARS`（或兩者並列），並把 CRITICAL 段裡「no years, no months, no units of time」
那幾個字拿掉 —— **但那三條紅線是同時放掉的，要知道自己在放什麼。**

---

## 二之四、第四輪：亂度照臨床照片、螢幕改成程式碼（2026-09-19）

使用者看第三輪的出圖：「好多了　不過大螢幕上的牙齒還是太整齊　像照片這樣才夠亂
而且亂的牙齒在螢幕上要標記驚嘆號　另外工程師電腦螢幕顯示 logo 很怪　應該是密密麻麻的
程式碼和牙齒排列的圖示　他眼前飄浮在空中的螢幕也是　不應該是 logo」
並附了**三張上顎咬合面觀的臨床照片**。

| # | 改了什麼 |
| --- | --- |
| 1 | **牙弓的亂度改成「照參考圖」**，不再只用文字描述。這正是 ILLUSTRATION 第十之一節那條通則：**形狀不要用文字描述，用參考圖** —— 前三輪都在用文字加碼（轉三十度、切端呈鋸齒⋯），模型每次都往「整齊一點」退。文字仍然留著當第二道保險，但改寫成照片上真正看得到的六件：弓形左右不對稱、一顆往唇側一顆往腭側形成鋸齒狀的進出、至少四對相鄰牙重疊三分之一到一半、至少兩顆明顯旋轉、一顆幾乎整個被卡在兩顆後面、間距時擠時開 |
| 2 | **四個琥珀色小驚嘆號三角形**直接標在最擠的那四顆牙旁邊，像軟體逐點標記；每個不寬於一顆牙 |
| 3 | **兩面螢幕的標誌整個拿掉**，改成**密密麻麻的程式碼 ＋ 一個小的牙弓圖示**（筆電、以及他眼前那面飄浮螢幕）。畫面上**不再有任何標誌** |

### ⚠⚠ 「程式碼」怎麼畫才不會變成長字

新增一段 `HOW TO DRAW "CODE" WITHOUT WRITING ANYTHING`：
**一行一行長短不一的短橫線、小點與勾，密密地疊起來、照程式碼的樣子分段縮排，
左邊一條等距的小點當行號。遠看就是一整螢幕的程式碼，近看一個字母都沒有。**
可以有兩三條不同顏色的短線，模擬語法高亮。

⚠⚠ **這一段和海報那條規則會打架，所以兩邊都要寫死範圍。**
海報那條原本寫著「不可以有排成行的短橫線去模仿文字」（第二輪加的，因為第一版海報
長出了假手寫字），現在螢幕上偏偏就要這個紋理。做法是**兩邊都指名**：
程式碼紋理「只准出現在工程師那兩面螢幕上」，海報那邊補一句
「前兩版都長出了假手寫字，不可以再發生」。
⚠ 第三輪的出圖海報上**仍然有兩條波浪線** —— 這一條是第三次寫了，要盯。

### 這一輪的字符例外清單（又多了一項）

`ERROR`、`200`、`+`、`∞`、**四個驚嘆號**。程式碼那一片是短橫線不是字母，不算。
其餘一律留白。

---

## 二之五、第五輪：白袍醫師換成男性（2026-09-19）

使用者看第四輪出圖：「很不錯　只有一個地方要調整　白袍女醫師換成男醫師」。
那一版其餘全部保留（牙弓的亂度、四個驚嘆號、假程式碼、動作線、ERROR 牌）。

**換性別不是只改一個字**，同一輪跟著改三處：

| 位置 | 改了什麼 |
| --- | --- |
| 主角那一段 | `A WOMAN DENTIST` → `A MAN DENTIST, IN HIS EARLY FORTIES`，整段代名詞 she／her → he／his |
| STYLE 段的對照句 | 「和**白袍女性**畫得一樣簡單」→「和**白袍那位醫師**」（那句話是用來壓右邊那位的風格的，主詞換了就要跟著換） |
| MOTION 段 | 指尖與被轉動的那顆牙那兩條，`she` → `he` |

⚠ **換成男性之後房間裡是三男一女**，所以主角加了**細框眼鏡**（兩個圓角矩形加一條橋），
避免三個短髮男性在縮圖尺寸下分不出來。眼鏡是**六樣臉部元素以外唯一的例外**，
提示詞裡明講了這件事，不然模型會順手把「可以多畫一樣」擴張到別的地方（第十之五節那個坑）。
⚠ 助理仍然是女性 —— 不要四個人全換成男性。

---

## 二之六、⚠⚠ 第六輪：只有一個人要改的時候，不要重生成（2026-09-19）

第五輪把「換成男醫師」寫進完整提示詞**重新生成**，結果**整張的角度與構圖都跑掉了**
（`v5-output-rejected.jpg`：鏡頭推近、大螢幕被切掉一塊、人物比例變大），
那位男醫師臉上還長出法令紋與眼下陰影。使用者：
「新作的男醫師有點老　而且原版只有女醫師要調整　**我比較喜歡原版的角度和畫面呈現**」。

**通則：文生圖每一次都是重擲骰子** —— 構圖、角度、光、每個人的位置全部會重來，
已經對的九成因此被賠掉。**只有一個人（或一塊）要改，就改圖，不要重生成。**
提示詞在 **[`hero-edit-prompt.md`](hero-edit-prompt.md)**，底圖是 `v4-output.jpg`。

⚠ 站上這條路早就驗證過，而且有數字：`drafts/og-topic-general-edit-prompt.md` 那一輪
「只編輯一小塊」的成品對原版，無彩空白 0.5% vs 0.5%、邊緣密度 37.5% vs 37.4%、
暖色 24.6% vs 24.6%，四項幾乎逐項相同。
⚠ 那一份同時記著改圖自己的坑：**一次只改一件**、**用畫面上的位置指代不要用名字**、
**要明確保護不准動的那一半**。

⚠ 「有點老」的成因不是年齡寫錯，是 STYLE 段那條「每個色相用兩三階」被套到皮膚上
（ILLUSTRATION 第十之五節，站上第二次踩到）。治法是**正面講死**皮膚一個平塗色、
臉上只准六樣，並給一個**畫面內的錨點**：「不可以比左邊穿芥末黃毛衣那位看起來老」。
⚠ 第五輪加的細框眼鏡**拿掉了** —— 白袍本來就分得出他是誰，多一樣東西就多一個走鐘的點。

---

## 三、要附的參考圖（五張，說明分開寫）

| # | 檔案 | 附圖時要寫的話 |
| --- | --- | --- |
| 1 | `assets/og-topic-ortho.jpg` | 「**飄浮螢幕的語彙、螢幕的藍、白色氛圍弧線、人物長相與服裝**照這張。⚠ 不要照它的**構圖**（那是醫師對病人講解，這一張沒有病人）；⚠ 不要照它上面那條藍色的標題帶。」 |
| 2 | `assets/hero-ortho-photo-1600.jpg` | 「**畫法、質感、明度照這張**：線寬有變化、色鉛筆顆粒、大量紙白透出來、整體淡。⚠ **不要照它的分格**，這一張是一個連續的空間。」 |
| 3~5 | `drafts/aligner-simulation/ref-crowding-{1,2,3}`（使用者提供的三張臨床照，上顎咬合面觀） | 「**大螢幕上那個牙弓的亂度與排列照這三張**：哪一顆卡在前面、重疊多少、弓形怎麼歪。⚠⚠ **只照排列**，不要照它們的寫實、顏色、牙齦、嘴唇、舌頭與反光 —— 螢幕上仍然是藍底白線的線條圖。」（2026-09-19 第四輪新增） |

⚠ `assets/logo.png` **第四輪起不再附**：使用者退回了螢幕上的標誌（見二之四）。

## 四、提示詞（第五輪，逐字，可直接複製）

```
STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST.

A warm, calm editorial ILLUSTRATION in coloured-pencil texture, 16:9, 2000 x 1116.
Hand-drawn ink outlines with VISIBLE VARIATION IN LINE WEIGHT — thicker where forms
meet, thinner and occasionally broken at the ends. The outline colour is a warm dark
brown, never pure black. Never a uniform vector line, never a rough sketchy scribble.
Every surface carries a fine pencil grain; large areas of pale paper are left showing
through. Flat fills with two or three steps of the same hue for shading — no gradients
except where light falls, no airbrush, no photo-realism, no 3D render, no greyscale.

ALL FOUR PEOPLE ARE DRAWN BY THE SAME HAND, IN EXACTLY THE SAME STYLE. Same outline
weight, same single flat skin colour, same simplified eyes (two short curving strokes —
no eyelashes, no glossy irises, no catchlights), same eyebrows (one short stroke each),
same simple hair drawn as ONE flat shape with two or three interior strokes. NO ONE is
rendered more realistically, more softly shaded or with more facial detail than the
others — IN PARTICULAR THE MAN STANDING ON THE RIGHT IN SCRUBS MUST BE DRAWN EXACTLY AS
SIMPLY AS THE DENTIST IN THE WHITE COAT. No manga or anime styling on any face, no cheek
blush, no airbrushed or shaded skin, no rendered hair strands.

SKIN IS THE ONE EXCEPTION TO THE TWO-OR-THREE-STEPS RULE: every face and hand is ONE
FLAT COLOUR with no modelling at all. A face contains ONLY six things — the outline of
the head, the eyes, the eyebrows, the nose, the mouth and the ears. NO wrinkles, no
nasolabial folds, no under-eye lines, no cheek shading, no jaw shading. Everyone is East
Asian (Taiwanese), aged about 28 to 45, with natural human head-to-body proportions.
NOBODY LOOKS AT THE VIEWER.

COLOUR TARGET: most colour blocks sit around HSL saturation 30–50 and lightness 70–85,
and roughly half the picture is chromatic rather than paper white. AT LEAST SIX clearly
different colours must be visible, each assigned to a real object: cool blue for the
floating screens, white for the doctor's coat, blue-grey for the scrubs, a mustard-yellow
knit for the engineer, pale sage green for the assistant's top, warm light brown for the
wooden worktop, and a small terracotta note in a mug or a plant pot. EVERY PERSON WEARS A
DIFFERENT COLOUR.

LIGHT: ONE warm light source, from a window high on the RIGHT, falling on the people, the
wooden worktop and the floor. Everything else sits on the cool, neutral side. Bright,
even, mid-morning indoor daylight — NOT sunset, NOT lamplight, NO long orange shadows,
NO dark or moody room, NO dramatic backlighting, NO glow rims around people.

THE SCENE — ONE SINGLE CONTINUOUS ROOM. DO NOT DIVIDE THE PICTURE INTO PANELS, FRAMES,
GRIDS OR SPEECH BUBBLES.

A bright, calm planning room in a dental clinic — cool white walls, a pale grey floor, a
low wooden worktop along the back wall, a leafy potted plant in the far corner, two plain
mugs on the worktop. It is a room where a treatment is being worked out, NOT a treatment
room: there is NO dental chair, NO patient, NO overhead surgical lamp, NO instruments.

CENTRE-LEFT, THE FOCAL POINT — A LARGE TRANSLUCENT BLUE SCREEN FLOATS IN MID-AIR, about
55% of the picture height, tilted very slightly towards the viewer, with soft rounded
corners and a faint glow at its edges. On it, drawn in white line only:

  • A TOP-DOWN (OCCLUSAL) VIEW OF AN UPPER DENTAL ARCH, drawn in white line.
    THESE TEETH ARE SEVERELY CROWDED. FOLLOW THE ATTACHED CLINICAL PHOTOGRAPHS OF CROWDED
    UPPER ARCHES FOR THE ARRANGEMENT OF THE TEETH — that degree of disorder is what is
    wanted, and the previous attempts were far too tidy. TAKE ONLY THE ARRANGEMENT from
    those photographs: which tooth sits in front of which, how far they overlap, how
    irregular the curve is. DO NOT take their realism, their colours, the gums, the lips,
    the tongue or the wet shine — on this screen everything remains a clean white line
    drawing on blue.
    The arrangement must contain ALL of the following:
      – THE ARCH IS NOT A SMOOTH SYMMETRICAL HORSESHOE: its left and right sides clearly
        differ, and the curve is dented and irregular;
      – ON EACH SIDE ONE TOOTH IS PUSHED RIGHT OUT OF THE ARCH TOWARDS THE LIPS while a
        neighbouring tooth IS PUSHED INWARDS BEHIND THE ARCH, so the row zig-zags in and
        out instead of following one curve;
      – AT LEAST FOUR PAIRS OF NEIGHBOURING TEETH VISIBLY OVERLAP, each one hiding a third
        to a half of the tooth beside it;
      – AT LEAST TWO TEETH ARE CLEARLY ROTATED, standing at an angle to their neighbours;
      – ONE TOOTH IS ALMOST COMPLETELY TRAPPED BEHIND ITS TWO NEIGHBOURS, with only a
        sliver of it still showing;
      – THE SPACING IS UNEVEN: in places the teeth are jammed hard against one another,
        elsewhere an obvious gap opens up.
    Every tooth is still a clean white shape — no decay, no black spots, no missing teeth,
    no blood, no gums, no tongue, no lips, no photographic detail.
  • FOUR SMALL AMBER EXCLAMATION MARKS SIT ON THE CROWDED TEETH — each one a tiny triangle
    with an exclamation mark inside it, placed right beside one of the four worst-crowded
    teeth, as if the software were tagging each problem spot in turn. Each mark is small:
    no wider than a single tooth.
  • THREE THIN WHITE CURVED ARROWS, each beside a different tooth, showing it turning or
    sliding a small amount.
  • ONE TOOTH IS PULLED OUT OF THE ARCH AND ENLARGED at the right-hand side of the screen.
    THIS ENLARGED TOOTH IS THE WHOLE POINT OF THE PICTURE: it is drawn COMPLETE, with its
    CROWN ABOVE AND ITS LONG ROOT BELOW, and the root is embedded in a translucent
    cut-away slab of jawbone so the viewer can see how much bone sits on each side of the
    root. A single thin white arrow shows the root tilting, and THE TIP OF THE ROOT HAS
    REACHED THE OUTER EDGE OF THE BONE — a short AMBER LINE marks the bone exactly where
    the root tip is pressing against it.
  • A SMALL AMBER WARNING BADGE — a rounded rectangle in soft amber — FLOATS JUST ABOVE
    THE ENLARGED TOOTH. It has TWO LINES inside it:
      – TOP LINE: a TRIANGLE WITH AN EXCLAMATION MARK inside it, and beside it the single
        word ERROR in plain, evenly spaced, upright uppercase sans-serif letters —
        E, R, R, O, R — spelled exactly like that and nothing else.
      – BOTTOM LINE, smaller: a TINY OUTLINE OF ONE CLEAR ALIGNER TRAY (a small horseshoe),
        then the characters 200+ (the digits two, zero, zero followed by a plus sign),
        then a MATHEMATICAL INFINITY SYMBOL — a simple sideways figure of eight.
    The badge reads as the planning software flagging this one movement and estimating that
    an unreasonable number of trays would be needed — it is the software doing its job and
    asking the team to look, NOT a broken machine and NOT an accusation.
    THE ONLY CHARACTERS ANYWHERE IN THIS PICTURE ARE: E R R O R, the digits 2 0 0, a plus
    sign and an infinity symbol inside this badge, together with the exclamation marks in
    the small amber triangles on the crowded teeth. There are NO OTHER letters, digits or
    symbols anywhere — in particular NO YEARS, NO MONTHS, NO DATES and NO UNITS OF TIME
    appear anywhere in the picture.

  Nothing else is on this screen.

A MAN DENTIST, IN HIS EARLY THIRTIES, STANDS IN FRONT OF THAT SCREEN, seen from the waist
up, turned three-quarters towards the screen, on the LEFT of it. He wears a white coat
over blue-grey scrubs. HIS HAIR IS SHORT, BLACK AND NEATLY SIDE-PARTED, drawn as one flat
shape with two or three interior strokes, and he is clean-shaven. HE MUST NOT LOOK OLD:
no wrinkles, no nasolabial folds, no shadow under the eyes, no shading on the cheeks or
jaw, no grey hair — his face is drawn exactly as simply as the engineer's, and he must not
look any older than the engineer. The white coat is what tells him apart from the other
two men; he needs no other distinguishing feature. The hand nearer the viewer is raised to chest height with the index finger extended, its tip
touching the enlarged tooth as if turning it a few degrees; his other arm hangs relaxed,
holding a slim pen. His shoulders are low and relaxed, his head tilts slightly towards
the screen, and his eyes look at his own fingertip. HIS MOUTH IS ONE SHORT LINE CURVING
GENTLY UPWARDS AT BOTH ENDS — a small, closed, easy smile. He is absorbed and completely
at ease: he has seen this before and he knows what to do next.

FAR LEFT — A MAN IN HIS THIRTIES, A DESIGN ENGINEER IN A MUSTARD-YELLOW KNIT TOP, SITS AT
A LOW DESK AND IS ACTIVELY WORKING. HE LEANS FORWARD TOWARDS HIS LAPTOP WITH BOTH HANDS
ON THE KEYBOARD, mid-keystroke, his eyes down on his own laptop screen, his back inclined
towards the work. HIS EYEBROWS ARE LEVEL AND HIS MOUTH IS A SHORT, STRAIGHT, CLOSED LINE —
concentrated and businesslike, in the middle of a task. HE IS NOT LEANING BACK, NOT
resting his chin or cheek on his hand, NOT folding his arms, NOT smiling, NOT lounging —
but he is not strained either: his shoulders stay down, his brow is smooth.

WHAT IS ON EACH DEVICE — FOLLOW THIS EXACTLY. Most devices are simply blank.
  • THE BIG FLOATING SCREEN: the crowded arch, the enlarged tooth in bone, the arrows and
    the amber badge, as described above.
  • ONE SMALL SCREEN FLOATING ABOVE THE ENGINEER'S DESK: A LONG ROW OF CLEAR ALIGNER TRAYS,
    each a simple horseshoe outline, marching from left to right and CONTINUING PAST THE
    RIGHT-HAND EDGE OF THAT SCREEN, the furthest ones getting fainter and fainter until
    they fade out — there are far too many of them to count. White line on pale blue.
    Nothing else on this screen: no numbers, no labels.
  • A SECOND SMALL SCREEN FLOATS IN FRONT OF THE ENGINEER AT EYE LEVEL, showing THE
    PLANNING SOFTWARE AT WORK: the upper two thirds is DENSE CODE, packed tight, and the
    lower third is A SMALL WHITE OUTLINE OF THAT SAME CROWDED DENTAL ARCH. Draw the code
    as described under HOW TO DRAW "CODE" below. There is NO logo on this screen.
  • THE ENGINEER'S LAPTOP SCREEN: the same again — the screen is FULL OF DENSE CODE from
    edge to edge, with ONE SMALL WHITE DIAGRAM OF THE CROWDED ARCH tucked into a corner.
    There is NO logo on this screen either.
  • THE TABLET PROPPED ON A STAND BESIDE THE LAPTOP: SWITCHED OFF — a plain, empty dark
    grey rectangle with nothing on it at all.
  • THE TABLET HELD BY THE MAN ON THE RIGHT: the same enlarged tooth with its root in
    bone, in white line on pale blue — he is holding it up against the big screen to
    compare. Nothing else.
  • THE ASSISTANT'S PHONE: SWITCHED OFF — a plain, empty dark rectangle. Nothing on it.

HOW TO DRAW "CODE" WITHOUT WRITING ANYTHING — READ THIS CAREFULLY. The code on those two
screens is drawn as ROWS OF SHORT HORIZONTAL DASHES, TICKS AND DOTS OF VARYING LENGTH,
stacked in many closely spaced lines and INDENTED IN BLOCKS the way real program code is,
with a narrow column of evenly spaced dots down the left edge standing in for the line
numbers. From arm's length it reads instantly as a screen full of code. UP CLOSE IT
CONTAINS NO ACTUAL LETTERS, NO DIGITS, NO WORDS AND NO PUNCTUATION — every "word" is
simply a small blank dash. A few dashes may be tinted a different colour, the way syntax
highlighting looks. THIS DASH-TEXTURE IS ALLOWED ONLY ON THOSE TWO SCREENS AND NOWHERE
ELSE IN THE PICTURE.

RIGHT SIDE — A MAN IN HIS LATE TWENTIES IN BLUE-GREY SCRUBS STANDS HOLDING THAT TABLET
flat in one hand at chest height, his other hand lifted with an open palm towards the big
screen, comparing the two. He is serious and attentive but NOT tense: his brow is smooth,
his lips just parted as if he is about to say one short sentence. DRAWN IN THE SAME
SIMPLE STYLE AS EVERYONE ELSE — flat skin, six facial features, no shading.

BESIDE HIM, SLIGHTLY BEHIND — A YOUNG WOMAN ASSISTANT in a pale sage-green top looks down
at her phone held in both hands, calm and unhurried.

ON THE LOW CABINET BETWEEN THEM stand TWO REAL OBJECTS, not screens: a small plaster model
of an upper arch of teeth, and one clear aligner tray resting beside it.

ON THE BACK WALL hangs ONE POSTER showing ONLY a simple line drawing of a dental arch — an
abstract horseshoe of rounded shapes. THE POSTER CONTAINS NOTHING ELSE: no title, no
caption, and ABSOLUTELY NO ROWS OF SHORT LINES, DASHES, WAVY LINES OR SQUIGGLES THAT
IMITATE LINES OF WRITING — the two previous attempts both grew fake handwriting under the
drawing, and that must not happen again. The space around the drawing is simply EMPTY
PAPER. (The dash-texture described under HOW TO DRAW "CODE" belongs ONLY on the
engineer's two screens; it must never appear on this poster, on the walls, on the mugs or
anywhere else.)

ATMOSPHERE LINES — Three or four long, soft, pale-white arcs sweep across the upper part
of the room, behind the people, giving the air a sense of movement. THEY MUST NOT COME OUT
OF ANYONE'S MOUTH, NOSE, HANDS OR BODY, they must not loop back on themselves, and they
must not be thicker at the far end than at the start.

MOTION AND SPEECH MARKS — small hand-drawn comic marks that keep the room from looking
frozen. THE SPEC FOR EVERY ONE OF THEM IS THE SAME: a group of TWO TO FOUR very short
strokes, all running the SAME WAY, evenly spaced, NONE OF THEM LONGER THAN A THIRD OF A
HAND'S WIDTH, solid where they start and fading to a dry, broken end. They never curl
round, never close into a loop, never cross each other, and no group is ever bigger than
the thing it belongs to. Put them in exactly these five places and nowhere else:
  • at the DENTIST'S FINGERTIP where it touches the enlarged tooth — three tiny strokes
    fanning out from the point of contact, as if he has just tapped it;
  • on the SCREEN beside the tooth he is turning — two short strokes trailing behind it
    along the direction of its white arrow, so it reads as having just moved;
  • above each of the ENGINEER'S WRISTS — two short horizontal strokes, so his hands read
    as moving over the keys;
  • outside the raised OPEN PALM of the man on the right — two short strokes following the
    edge of his hand, so the gesture reads as live;
  • beside that same man's MOUTH — two very short diagonal strokes angled away from his
    lips, the ordinary comic mark for someone who is speaking. THIS IS THE ONLY SPEECH
    INDICATION IN THE PICTURE: there is NO speech bubble, NO thought bubble, NO tail, NO
    balloon, NO words coming out of anyone.
NOWHERE ELSE gets motion marks. No speed lines across the background, no radiating focus
lines, no starbursts, no impact flashes, no dust puffs, no sparkles.

CRITICAL — THE ONLY REAL CHARACTERS IN THIS PICTURE ARE: the word ERROR, the digits 200,
a plus sign and an infinity symbol INSIDE THE AMBER BADGE, plus the exclamation marks
inside the small amber warning triangles on the crowded teeth. The "code" on the
engineer's two screens is made of blank dashes, NOT of letters. THERE IS NO OTHER WRITING
ANYWHERE.
No other text, no lettering, no words, no letters, no other numbers, no other digits, no
percentages, no years, no months, no dates, no units of time, no labels, no captions, NO LOGOS OR BRAND MARKS OF ANY KIND
(the clinic logo was removed this round — there is no logo anywhere in the picture), no
watermark and no signature — not on the floating screens, not on the
laptop, not on the tablets, not on the phone, not on the poster, not on the mugs, not on
the clothing, not on any name badge, not on the cabinet. There are NO user-interface
elements: no buttons, no sliders, no menus, no toolbars, no progress bars, no tabs, no
cursors, no charts, no graphs, no axes, no rulers, no scales, no gauges, no tick marks, no
keyboard letters — the laptop keys are plain blank rectangles. Wherever writing would
normally appear, LEAVE THE SURFACE BLANK.

AVOID — a dental chair, a patient, a person lying down, an overhead surgical lamp, trays
of instruments, syringes, needles, drills, blood, a mouth held open, a close-up of a real
mouth, cartoon teeth with faces, arms, legs or eyes, a tidy evenly spaced dental arch,
before-and-after pairs, a calendar, a clock, a progress bar, a timeline, a countdown,
any number of years or months written anywhere, speed lines across the background,
radiating focus lines, starbursts, impact flashes, sparkles, a speech balloon of any
kind,
anyone frowning, gritting their teeth, holding their head in their hands, rubbing their
temples, sighing, sweating, looking exhausted, stacks of paperwork, an untidy desk, anyone
leaning back with a hand under the chin, anyone cheering, laughing out loud, giving a
thumbs-up or a high five, anyone looking at the viewer, one person drawn in a different
style from the rest, a person in silhouette, dramatic backlighting, a dark server room,
glowing neon, holographic rainbow or chrome gradients, floating particles, circuit-board
patterns, network node diagrams, DNA helices, a robot, a brain icon, panel dividers, comic
frames, speech bubbles, thought bubbles, photo-realism, 3D rendering, greyscale.
```

## 五、出圖之後要做的事

```bash
node tools/hero-resize.mjs <原檔> aligner-photo   # → assets/hero-aligner-photo-{2000,1600,800}.jpg
node tools/webp.mjs                               # 三張的 WebP
```

接著手動補三件：
1. `drafts/aligner-simulation/index.html` 的 `post-meta`：`heroAlt` 現在是佔位字串，
   要照**實際畫出來的畫面**逐項描述（人、動作、螢幕上有什麼、房間裡有什麼）。
2. 同一份檔案裡那段「HERO 還沒畫」的註解要換成 `posts/orthodontics/` 的 post-hero 區塊
   （picture ＋ 三段 srcset，sizes 照抄）。
3. 跑一次 `node drafts/aligner-simulation/preview.mjs` 讓預覽頁跟上。

⚠ 出圖的比例要是 **16:9**（`hero-resize.mjs` 只收 16:9 與 4:3，其餘直接拒絕寫檔）。
⚠ 對話裡貼的圖落在 `/root/.claude/uploads/<session-id>/`，不在 `/tmp`
（ILLUSTRATION 第十之八節）。

## 六、收到第一版之後要逐項看的（出圖前先講好）

1. **縮圖讀得出來嗎** —— 把圖縮到 335px 再看一次，讀不到「大藍螢幕＋一隻手」就要重來。
2. **有沒有長出字** —— 螢幕、筆電、平板、手機、海報、馬克杯、鍵盤逐個放大看。
3. **那顆放大的牙有沒有牙根與骨頭** —— 只畫牙冠的話這張圖就不是這篇文章的圖。
4. **表情有沒有跑到「辛苦」那一端** —— 對第二節第 5 點那張表逐個人看。
5. **是不是四個人衣服同色** —— 第七節第 18 條踩過（五個人全穿同一件淡綠）。
6. **有沒有變成分格** —— 一個連續的空間。
