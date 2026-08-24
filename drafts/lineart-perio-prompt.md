# 著陸頁線稿底圖・牙周治療（`lineart-perio`）

**狀態（2026-08-24）：一次就過，成品 `assets/lineart-perio.png`（1024×755），提案頁做好了。**
第一版提示詞生出來的圖就是定案候選（`drafts/lineart-perio-v1.jpg`），
使用者：「一次就做好了……把這張照一般牙科的方式合到著陸頁上 **不過要左右水平翻轉** 先做成預覽給我看」。
提案頁 `preview/topic-lineart-perio/index.html`（產生器 `drafts/lineart-perio-preview.mjs`）——
**正式站的 `index.html` 一個字都還沒動。**

模板在 [`drafts/topic-lineart-prompt.md`](topic-lineart-prompt.md)（風格規格、門檻、管線都在那裡，
**這一份只寫牙周這一科不一樣的地方**）。通則在 ILLUSTRATION.md 第十二節，
一般牙科那一輪的推導在 `/history/topic-lineart.html`。

| | |
| --- | --- |
| 成品要放哪 | `assets/lineart-perio.png`（透明底、牙周套色 `#317d78`） |
| 分享圖（前置作業，**已上線**） | `assets/og-topic-perio.jpg`，原檔 `drafts/og-topic-perio-src.jpg` 2848×1504 |
| 姿勢參考（這一輪新裁） | `drafts/lineart-perio-pose-ref.jpg` 1446×1893、`drafts/lineart-perio-germs-ref.jpg` 951×1268 |
| 裁圖腳本 | `node drafts/lineart-perio-refs-crop.mjs` |

---

## 一、使用者指定的取材（2026-08-23，逐字）

> 「牙周的線稿底圖 但我覺得**只要抓 醫師噴水 細菌被嚇跑噴走的部分就好** 你們先做看看」

所以這一張**只有三樣東西**：**醫師 ＋ 水柱 ＋ 被沖走的細菌**。
分享圖裡的**大臼齒、土堆、診療椅、無影燈、櫃子、牆與地板全部不畫** ——
線稿是壓在文字底下的底圖，元素愈少愈耐看，而且第十二節那三條門檻
（線佔 4~6%、粗細一致、零實心填色）本來就撐不住一個滿版的場景。

⚠ 這也是**唯一一次分享圖與線稿的題材不同**：分享圖的主角是那顆牙
（「嚴重也不等於沒救」由牙齒的表情負責），線稿把鏡頭往左搖，只留動作。
兩張圖出現的地方不一樣（分享圖只在訊息卡、線稿只在頁面上），不必一致。

---

## 二、和模板不一樣的兩處（**刻意的，不是漏看**）

| 模板 | 這一科 | 為什麼 |
| --- | --- | --- |
| **畫到腰就好，不要畫腿** | **畫到鞋子，全身** | 一般牙科那張的動作是「走著、招手」，腰以上讀得出來；這一張的動作是**頂著後座力**，而站穩這件事整個寫在下半身（前腳弓、後腳蹬、身體往後仰）。切在腰際等於把動作切掉，只剩一個人拿著管子 |
| 姿勢參考**一張** | **兩張**（醫師、細菌） | 細菌的「被嚇跑噴走」也是姿勢（翻滾、剎車、回頭看），一樣屬於第十二節二那個「姿勢・視線・表情」組，**不是新開一組**。文字描述動作一定會漂（第十二節二那張表） |

其餘（畫法規格、單色、無填色、無投影、無背景、門檻、管線）**逐字照模板**。

---

## 三、要餵哪幾張圖（三組，**說明一定要分開寫**）

| # | 檔案 | 這一張只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）；**不要參考題材、人物、道具**。」 |
| 6a | `drafts/lineart-perio-pose-ref.jpg` | **醫師的姿勢・視線・髮型・表情** | 「姿勢、重心、兩腳的位置、手的高度、視線方向、髮型、表情，完全照這張；**畫法照 1~5**。」 |
| 6b | `drafts/lineart-perio-germs-ref.jpg` | **細菌的姿勢與表情** | 「細菌被沖走的姿勢與表情照這張；但**造型要簡化成光滑的圓胖團塊，不要畫那些棘刺**，畫法照 1~5。」 |
| 7 | `drafts/og-topic-perio-src.jpg` | **長相・服裝・年齡層** | 「人物的長相、服裝、年齡層照這張，但**畫法完全不同**，而且**這張裡的牙齒、土堆、診療椅、無影燈、櫃子、牆、地板一律不要畫**。」 |

⚠ 第 7 張用**原檔**不是 `assets/og-topic-perio.jpg` —— 成品上緣疊著玻璃帶，
模型會把那條帶子當成畫面的一部分抄進去（同 `topic-lineart.mjs` 檔頭那條）。

---

## 四、提示詞（第一版，逐字，可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair and clothing.

WHO — one dentist of a small Taiwanese neighbourhood clinic, seen FULL LENGTH, blasting a
jet of water to the RIGHT, and four cartoon germs being blown away by it. Follow the
attached photo-references for pose, gaze, hair and expression EXACTLY; only the drawing
style comes from the line-art references.

  - THE DENTIST, on the LEFT — a Taiwanese man in his thirties. His short black hair is
    drawn as an OUTLINE ONLY, with two or three interior strokes for the parting; it is not
    filled in. He wears clear protective goggles: a thin rectangular frame with both eyes
    fully visible through it, drawn as two small dots; the lens is empty, with no glare
    line. His mouth is a short closed curve, a small calm smile — he is concentrating and
    enjoying himself. He wears an OPEN white coat over a V-neck scrub top and plain
    trousers, all drawn as outlines only.
    His stance is BRACED AGAINST THE RECOIL, seen in three-quarter view and facing RIGHT:
      * his feet are planted wide apart, the front knee deeply bent, the back leg straight
        and pushing, both shoes flat on the ground;
      * his body leans BACK, away from the nozzle, his chest turned slightly towards the
        viewer;
      * BOTH hands grip the nozzle at about chest height, arms reaching forward to the
        RIGHT with the elbows still slightly bent;
      * the tails of his open coat and his hair are blown BACKWARDS, to the LEFT.
    He is looking along the jet, forward and to the RIGHT.

  - THE NOZZLE AND THE HOSE — the nozzle is one simple smooth cylinder about as long as his
    forearm, with a chunky grip underneath and a single narrow collar ring near its tip.
    Big simple shapes only: no buttons, no dials, no gauges, no panel. ONE THICK HOSE, about
    as thick as his forearm, leaves the bottom of the nozzle, sweeps down in a single big
    S-curve and runs out of the picture at the BOTTOM LEFT CORNER. The hose is drawn as TWO
    parallel outline edges with a few short cross strokes for its ribbing; it is not filled.

  - THE JET OF WATER — a thick, forceful jet leaving the nozzle and travelling to the RIGHT,
    widening as it goes, as thick as his forearm where it leaves the nozzle. DRAW IT WITH
    OUTLINES ONLY: two long clean edges that spread apart, a row of rounded scallops along
    its leading front where it breaks up, and SIX TO EIGHT separate teardrop-shaped droplets
    flying off it. THE INSIDE OF THE JET IS EMPTY WHITE — no fill, no bundle of parallel
    speed lines, no hatching, no spray texture, no spiral. It must read as a heavy jet of
    water: not a thin spray, not a mist, not a beam, not a laser.

  - THE GERMS, on the RIGHT — exactly FOUR of them, each a SIMPLE SMOOTH ROUNDED BLOB with
    two dot eyes, a small open oval mouth and short stick arms and legs. No spikes, no
    hairs, no teeth, no claws. They are comic and clumsy, never frightening. Each is about
    one third as tall as the dentist. All four are being driven to the RIGHT by the jet:
      * ONE tumbling head over heels high up in the upper right, arms and legs flung out;
      * ONE skidding backwards at the middle right, leaning away from the jet with both
        arms up in front of it;
      * TWO close together at the right edge, running away to the right, the outer one
        cropped by the edge of the picture.
    Their faces are turned back over their shoulders towards the jet, or away to the right.
    Add TWO OR THREE short curved motion strokes in total behind the flying germs, and no
    more than three.

⚠ CRITICAL — THIS PICTURE CONTAINS ONLY THE DENTIST, THE NOZZLE, THE HOSE, THE JET AND THE
FOUR GERMS. Do NOT draw a giant tooth, a tooth character, a mound of earth, a dental chair,
an operatory lamp, cabinets, a wall, a floor, a ground line or a room of any kind, even
though the attached colour illustration contains them. That colour image is there only for
the man's face, clothing and age.

⚠ CRITICAL — NOT A SOLDIER AIMING A WEAPON AND NOT A FRONT-ON FIREFIGHTER POSTER. Do not
draw a stiff, frontal, symmetrical figure with straight arms and the nozzle pointing at the
viewer. The stance is wide, low and leaning back, seen from the side, and the jet travels
across the picture to the RIGHT.

⚠ CRITICAL — NOBODY LOOKS AT THE VIEWER. The dentist looks to the RIGHT along the jet; the
germs look back at the jet or away to the right.

FACES — extremely simple: eyes are small solid dots, the nose is one tiny stroke or omitted.
No eyebrow detail, no eyelashes, no blush, no wrinkles. The dentist's mouth is a short
closed smiling curve; each germ's mouth is a small open oval. Hair is drawn as an OUTLINE
ONLY with a few interior strokes for the parting — it must not be filled in.

COMPOSITION — one horizontal band across the middle of the square: the dentist on the LEFT
at about 70% of the picture height, the jet crossing the middle, the four germs scattered up
and to the RIGHT. Generous empty margin on all four sides. THE FIGURES ARE DRAWN COMPLETE,
DOWN TO THE SHOES — they are not cropped at the waist. There is NO GROUND LINE, no horizon
and no shadow under anyone: everyone stands on empty white.

BACKGROUND — completely empty. No room, no doorway, no window, no wall, no floor, no
furniture, no plants, no street, no clinic sign, no speech bubbles, no icons, no arrows,
no text, no logo, no decorative sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #317d78, on a near-white background, hex
#f7f8f7. Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration
with a lot of white space.
```

### 這一版為什麼這樣寫（各對應哪一條規則）

| 寫法 | 出處 |
| --- | --- |
| 動作全部寫成**幾何**（前腳弓、後腳直、身體往後仰、手在胸高） | 第十二節二：形容詞擋不住預設姿勢 |
| 髮型、表情、視線**逐項寫出來** | 同上（一般牙科那次這三件全跑掉） |
| 水柱寫成「**兩條外緣 ＋ 一排扇形 ＋ 六到八滴水珠，裡面是空的**」 | 這一張最可能翻車的地方：水在彩圖裡是**體積**，線稿裡只能是**輪廓**。不指定的話會畫成一束密集的速度線或一塊填色，直接踩死「粗細一致」與「零實心填色」兩道門檻 |
| 細菌**指定四隻、指定簡化成光滑團塊** | 參考圖那幾隻有棘刺與網點，照抄會變成一堆雜訊；數量不指定模型會畫一整群 |
| 動態線**上限三條** | 同上，這是唯一允許的「不是輪廓」的線 |
| 三條 ⚠ CRITICAL（沒有牙齒與診間／不是持槍站姿／沒有人看鏡頭） | 第 7 張參考圖裡有牙齒與整間診間，**不明講一定會被抄進來**；持槍站姿與正面對稱是這個動作的預設解 |
| 否定句收在最後、能寫正面就寫正面 | TEAM.md 第一節第 10 號（AI 專家的紅線） |

---

## 五、交件門檻（收到圖先自己跑，不過就重生成）

    node drafts/lineart-measure.mjs <圖檔>

線佔畫面 4~6%／筆畫寬中位 4~6‰／粗細一致 p90÷中位 < 2.5／實心填色 0 塊／四角乾淨。

⚠⚠ **前兩項是參考值不是門檻** —— 已經上線的一般牙科那張（`drafts/lineart-general-v2.jpg`）
實測是 `inkPct 7.84`、`strokePermil 6.8`，兩項都超出模板寫的區間，使用者仍然選了它。
**真正卡得住的是後三項**（粗細一致 1.43、實心填色 0 塊、四角乾淨），
牙周這張照同一把尺看：粗細一致 < 2.5、實心 0 塊、四角乾淨，前兩項落在同一個量級就好。

⚠ **門檻過了不代表對**，內容這一側逐條看：
① 兩腳是不是弓箭步、身體有沒有往後仰　② 水柱裡面是不是空的
③ 細菌是不是四隻、有沒有棘刺　④ 有沒有偷偷長出牙齒／診療椅／地面線
⑤ 頭髮有沒有被填成一團實心

---

## 六、出圖之後的管線

```
node tools/topic-lineart.mjs perio --art drafts/lineart-perio-v1.jpg --crop x,y,w,h
```

⚠ 裁切座標收到圖再量（生成的線稿幾乎一定會多一條地面線與一大圈空白）。
⚠ 不要餵透明底的 PNG 進去（有守門會擋）。

接著把牙周加進 `index.html`（搜尋 `3-0 介紹區右下角的線稿底圖`）——
**三條選擇器各加一條，不要改成 `[data-topic]` 一網打盡**；
`aspect-ratio` 換成裁完的長寬，`background` 的 url 換成 `assets/lineart-perio.png`；
大小 `min(76%, 360px)` 與濃度 `.10`／`.48` **不要重挑**（一般牙科那組是量出來的，六科共用）。

```
node tools/topics.mjs && node tools/build.mjs
```

驗收：九個寬度（1440／1280／1200／1041／834／430／390／375／320）介紹區高度與加圖之前**逐格相同**、
無水平捲動；其餘沒有圖的科目與首頁**沒有畫出那個偽元素**。

---

## 七、要使用者決定的

1. **這張圖生出來給誰看**：容器裡沒有 Gemini 的金鑰，出圖仍然要在使用者那一側跑。
   把上面第四節整段貼進 Gemini，附第三節那八張圖（1~5 五張畫法、6a、6b、7），
   回傳的圖丟進 `drafts/lineart-perio-v1.jpg` 就能接管線。
2. **細菌要不要有臉**：這裡照分享圖給了眼睛與嘴（被沖走才讀得出來是「逃」）。
   若覺得壓在文字底下太熱鬧，可以改成只有輪廓沒有五官 —— 但那樣就只剩幾個橢圓，
   我的建議是**留著臉**。


---

## 八、出圖之後實際做了什麼（2026-08-24）

### 量測（`node drafts/lineart-measure.mjs drafts/lineart-perio-v1.jpg`）

    W 1024  H 1024  bg 246  inkPct 6.34  strokeMed 5  strokePermil 4.9
    ratio 1.60  greys 31  blobs 0（實心填色）  worstFill 0.14  corners 0,0,492,0

・線佔 6.34%、筆畫 4.9‰ 都落在模板寫的區間裡（一般牙科那張是 7.84%／6.8‰）。
・粗細一致 1.60 < 2.5、實心填色 0 塊。
・左下角那個 492 是**水管**（提示詞要它從左下角出去），不是雜點。
・內容五件逐條看過：弓箭步 ✓／水柱裡面是空的 ✓／細菌四隻、沒有棘刺 ✓／
　沒有偷長牙齒、診療椅或地面線 ✓／頭髮是輪廓沒有填成一團 ✓。

### 裁切與翻轉

```
node tools/topic-lineart.mjs perio --art drafts/lineart-perio-v1.jpg --crop 0,180,1024,755 --flip
```

・`--crop 0,180,1024,755`：上下的空白裁掉（墨的外接框是 y 180~934），
　**左右不裁** —— 水管本來就走到左緣、最右邊那隻細菌本來就被切到。
・**`--flip` 是這一輪新加的**（`tools/topic-lineart.mjs`）。理由：圖擺在介紹區的**右下角**，
　人物面向右邊等於背對整頁的文字、朝著版心外面噴；翻過來才是朝內。
　實作是「先裁再翻」，所以 `--crop` 的座標一律在原圖上量，不必自己換算。

### 版面驗收（九個寬度，`opacity` 與大小沿用一般牙科那組）

| | 1440 | 1280 | 1200 | 1041 | 834 | 430 | 390 | 375 | 320 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 介紹區高（有圖／現況） | 逐格**完全相同**（475.8／475.8 … 658.7／658.7） ||||||||
| 水平捲動 | 無 ||||||||
| 圖 | 360×265 |||| 360×265 | 306×225 | 275×203 | 264×194 | 222×164 |

### ⚠ 對比度：這一科的字壓在線上的情況和一般牙科**不一樣，但一樣安全**

一般牙科那一輪的結論是「≥834 實測 0% 的字落在圖上，所以濃度純粹是美感」。
牙周這張是**橫的**（1024×755，一般牙科是 832×788），同樣 360px 寬時矮了 76px，
但**橫向伸得更進去**，所以 ≥834 不是 0%。逐行量「字下面到底有沒有線」（不是框相交）：

| 視窗 | 濃度 | 真的壓到線 | 那幾行是什麼字 | 最差對比 |
| --- | --- | --- | --- | --- |
| 1440／1200 | .48 | 2／34 行（最糟一行 3.8% 的面積） | `.tp-reply`、`.tp-close` ＝ **深墨 `#2a2c27`** | **6.20** ✓ |
| 834 | .48 | 4／34 行（最糟 2.9%） | 同上，深墨 | **6.20** ✓ |
| 430／390／375 | .10 | 7~8／37 行（最糟 18.7%） | `.tp-step` ＝ **柔墨 `#5c5f57`** | **4.58** ✓ |

・柔墨在牙周套色底下的**臨界濃度是 .115**（一般牙科是 .101）—— `#317d78` 比
　`#3f654a` 淺，混出來的底更亮，所以同樣 .10 反而比一般牙科寬鬆一點（4.58 vs 4.51）。
・**所以大小與濃度兩個值不必為牙周重挑**，直接沿用。


---

## 九、第二輪提案：大小與濃度做成尺（2026-08-24）

使用者在手機（375×667）上看第一版：「**手機上看有點淡　做幾個版本讓我選　大小也讓我切換
　感覺可以再大一點**」。切換條因此長出兩條尺 ＋ 一條細調：

| 尺 | 各格 |
| --- | --- |
| **大小** | Ⓐ `min(76%,360px)`（現況）／Ⓑ `min(86%,410px)`／Ⓒ `min(93%,440px)`／Ⓓ `min(100%,480px)` |
| **濃度・手機（<834）** | .10（現況）／**.115（AA 上限）**／.15／.20 |
| **濃度・iPad 電腦（≥834）** | .48（現況）／.56／.64／.72 |
| 細調・下沉 | 0（現況）／12／24px |

⚠ **尺只顯示目前這個寬度吃得到的那一條** —— 手機與 ≥834 站上本來就是兩個獨立的值，
兩條都攤開會吃掉半個手機畫面（`hero-motion-mobile` 那一輪的教訓）。
⚠ **寬度不准超過 100%**：偽元素是 `right:0`，比容器寬就往左凸出版心，手機直接多出水平捲動。

### ⚠⚠ 這一輪最要緊的一句：**大小是免費的，濃度不是**

| | 大小 Ⓐ→Ⓓ | 濃度 .10→.20 |
| --- | --- | --- |
| 對比度 | **完全不變**（最壞底色只是紙色與套色按濃度混合，和圖多大無關） | 4.58 → **4.05** |
| 壓到線的行數（390） | 7 → 8 → 12 → **19** | 不變 |

所以「想更明顯」有兩條路，**先走大小那一條**：Ⓓ 在 390 上是 362×267，比現況的
275×203 大 **73%**，一個字的對比度都沒有動。濃度那一條**過了 .116 就開始欠 AA**：

| 手機濃度 | .10 | **.115** | .15 | .20 |
| --- | --- | --- | --- | --- |
| 柔墨 `#5c5f57`（流程那五行）壓在線上 | 4.58 ✓ | **4.50 ✓（剛好）** | 4.32 ⚠ | 4.05 ⚠ |

⚠ 那個 **.116 是算出來的**（二分逼近，面板上的「這一格的濃度上限」就是它），
不是抓的。牙周比一般牙科的 .101 寬鬆一點，因為 `#317d78` 比 `#3f654a` 淺。
⚠ ≥834 的上限是 **.710**（那邊壓到線的只有深墨的兩塊），所以 .48→.64 都還很安全。

### 面板改成會下判斷

逐行量「字底下**真的有沒有墨**」（框相交不算），只對命中的行算對比，
再印出「這一格的濃度上限」。低於 4.5 時整句標紅。
⚠ 用 `file://` 開這一頁時 `getImageData` 會因為跨來源直接丟例外（站上同來源不會），
已經用 try/catch 接住並改印「量不到墨圖，請用 http 開」—— 不然面板會停在上一格的數字。

### 下沉那條尺幾乎沒有用（量過才知道）

390 上 Ⓓ：下沉 0／12／24px → 壓到線的行數 19／20／18。**位置換不到可讀性**，
因為手機上文字是滿版的，圖往哪沉都還在文字帶裡。留著只是給構圖用。


---

## 十、第三輪：往右挪（2026-08-24）

使用者（375×667，選在「最大 ＋ 更濃」那一格）：「我喜歡這個大小 不過**線稿一直往中間移**
感覺可以是現在的位置**往右一點** 因為右邊比較有空位 **醫師右後 應該可以被裁掉一些沒關係**」。

**成因**：圖檔右緣不是人物的邊 —— 翻轉之後醫師的背後還有飛起來的白袍下襬與水管的尾巴
（第 830~1024 欄），所以「靠右對齊」對齊到的是那一截空白，人看起來就往中間縮。

**做法：從圖的右緣裁掉一段**，四格 `0（現況）／64／128／192`（圖檔 1024 寬）。

⚠ **比例尺刻意不變** —— 使用者說喜歡現在的大小。所以裁掉多少，框就跟著窄多少
（`width: calc(var(--pv-w) * (1024−cut)/1024)`、`aspect-ratio: (1024−cut)/755`、
`background: left center / auto 100%`），高度九個寬度實測**完全不動**（375 上一律 256px）。

| 375 上 | 現況 | 往右 64 | 再往右 128 | 最右 192 |
| --- | --- | --- | --- | --- |
| 圖 | 347×256 | 325×256 | 304×256 | 282×256 |
| 人物往右移 | 0 | 22px | 43px | 65px |
| 壓到線的字 | 18／37 | 14／37 | 9／37 | 9／37 |
| 裁到什麼 | — | 白袍下襬的尖端 | 下襬＋後腳鞋跟 | 連背也切到一截 |

⚠ 順帶的好處：**往右挪同時讓壓到字的行數少一半**（18 → 9），因為左邊那幾隻細菌
跟著往右收，不再壓在流程那五行上。**但它不改變對比度**（最壞底色只看濃度）。

⚠⚠ **提案頁是用 CSS 模擬裁切**（框窄 ＋ 圖靠左），**定案時是真的重裁 PNG**
（`--crop` 的 x 往右挪、寬度減掉那一段），頁面那一側就回到單純的 `contain`。


---

## 十一、第四輪：iPad 要自己一組值（2026-08-24）

手機那一段使用者定了：**最大 ＋ 裁右 192 ＋ 濃度 .115**（面板 4.50 ✓、壓到 9／37 行）。
接著看 iPad —— **同一組值搬到 834 上會出事**：

| 834 上（大小 最大） | 裁右 0 | 64 | 128 | 192 | **256** | 320 |
| --- | --- | --- | --- | --- | --- | --- |
| 壓到線的行數（**其中柔墨**） | 10（6） | 10（6） | 8（4） | 5（**2**） | **4（0）** | 3（0） |
| 最差對比 @ .48 | 2.86 ⚠ | 2.86 ⚠ | 2.86 ⚠ | 2.86 ⚠ | **6.20 ✓** | 6.20 ✓ |

⚠⚠ **成因是 iPad 的字比較長**（那一段的字級 +19%），流程那五行往右伸得更遠，
所以同樣的圖在 834 上會壓到**柔墨**；一壓到柔墨，.48 的對比就只剩 2.86。
1024 與 1112（iPad Pro／橫放）反而沒事 —— 版心更寬、文字相對更短。

**所以大小與裁右也要分兩段記，不能只有濃度分兩段。** 提案頁改成：

| | 手機（<834） | iPad／電腦（≥834） |
| --- | --- | --- |
| 裁右的四格 | 0／64／128／**192** | 0／128／192／**256** |
| 預設 | 最大 ＋ .115 ＋ 192 | 最大 ＋ .48 ＋ **256** |

切換條頂上會寫「調的是『手機』／『iPad／電腦』這一段」，按鈕上直接印 `+192` 這種實際值。

⚠ ≥834 這一段壓到的只剩深墨（`.tp-reply`／`.tp-close`），**濃度上限 .710**，
所以 .48 → .64 都還過得了 4.5，.72 是 4.44 ⚠。
