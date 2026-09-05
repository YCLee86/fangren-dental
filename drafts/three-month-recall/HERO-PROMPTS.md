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


### Ⓕ 不規則分格 ＋ 中間一位醫師（2026-09-05 新增，Ⓐ 的改寫）

**起因**：使用者看過五案之後選 Ⓐ，但指出它的毛病 ——
「**只有診療〔椅上〕的人不一樣，都一樣，所以畫面看起來很單調**」。
他給的方向：**每個不一樣的人單獨變成一個框**，框可以帶一點不規則、
或用對話框的方式，**中間是一位醫療人員**，讀起來像
「**這幾個人要特別注意自己牙齒的健康**」的呼籲。
參考圖是三張日本車站的海報（GRANSTA 的多角形分格、声かけサポート 的對話框、
カスハラ 的四格）。

・**六格 ＋ 中間一格**：孕婦／拿拐杖的阿嬤／膝上放著藥袋的中年男子／
　餐桌上量血糖／半夜起來倒水喝／綁著頭巾、手邊保溫杯的中年女性。
　中間那一格是女醫師，一手向外攤開，看著四周那幾個人。
・**每一格一個很淡的底色**（＝參考圖那一套），Ⓐ 之所以單調正是因為
　四格共用同一個診間、同一片背景。
・⚠⚠ **格子做成不規則的多角形，不做對話框** —— 我們這一站的圖**一個字都不能有**
　（第七節第 4 條），而**空的對話框讀起來是「在想一件沒有內容的事」**；
　參考圖那三張全部靠文字說話，我們不能照抄那一半。
　**要對話框版我可以另出一份，一句話換掉。**
・⚠⚠ **中間那位醫師不看鏡頭** —— A 類紅線那一條仍然有效。呼籲靠**攤開的手**與
　**她在看那幾個人**給；她看鏡頭指著讀者是另一種東西（而且離站上的調子很遠）。
　**要她看鏡頭也是一句話的事，但要你點頭。**
・⚠⚠⚠ **上下各 12% 是「會被卡片切掉」的區域**（見第一之二節）：
　人臉與那幾樣關鍵的東西**一個都不可以放在那裡面**。

---

## 三、五個提案共用的規格（每一份提示詞裡都逐字帶著）

- **16:9 橫幅**（`tools/hero-resize.mjs` 擋長寬比 2000/1116 ±0.02，16:9 過得了）。
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

### Ⓕ 不規則分格 ＋ 中間一位醫師

```
Editorial illustration, 4:3 landscape (slightly wider than tall, NOT a wide banner).

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
expression, hair drawn as a few shaped masses. NOBODY LOOKS OUT AT THE VIEWER.

STRUCTURE — The whole picture is ONE MOSAIC of seven panels, like a page of an
illustrated poster. The panels are irregular polygons of different sizes, fitted together
edge to edge and separated by THIN HAND-DRAWN GUTTER LINES that are slightly wobbly, never
ruler-straight and never a regular grid of rectangles. The mosaic fills the whole frame.
Each panel has its own very pale background tint, so the seven panels are immediately
distinguishable from one another.

THE CENTRE PANEL is the largest: an irregular five-sided panel in the middle of the
picture. In it stands a woman dentist in her thirties in a pale sage-green scrub top, hair
in a low bun, seen from the waist up, turned three-quarters. One arm is open and extended
outward in a calm, welcoming gesture, and she is looking OUT TOWARDS THE PANELS AROUND HER
— warm, attentive, unhurried. She is not looking at the viewer, not pointing at the
viewer, and not making a warning or scolding gesture. Behind her, only a hint of a clinic:
a low wooden cabinet edge and a small shelf.

THE SIX PANELS AROUND HER, each holding ONE ordinary person in an ordinary moment. Place
them exactly like this:
  UPPER LEFT — a woman in her early thirties, visibly but not dramatically pregnant,
  sitting on a sofa with one hand resting on her middle, a slim blank booklet on the arm of
  the sofa beside her.
  UPPER RIGHT — a woman in her seventies with short grey permed hair, standing in her own
  kitchen with a wooden walking stick hooked over her forearm, reaching for a cup.
  RIGHT — a man in his early fifties in an open-collared work shirt, sitting at a table
  with a soft brown paper pharmacy bag in front of him and two blister packs of tablets
  half slid out of it.
  LOWER RIGHT — the same kind of ordinary morning: a man in his sixties at a breakfast
  table, holding a small handheld meter to his fingertip, matter-of-fact, a bowl and a mug
  beside him.
  LOWER LEFT — the middle of the night: a woman in her fifties in a T-shirt at her kitchen
  counter, pouring a glass of water, half asleep. This is the only dark panel — deep dusty
  blue with one small warm pool of light; the wall behind her is dark, never left pale.
  LEFT — a woman in her forties wearing a soft printed headscarf, sitting in an armchair
  with a small vacuum flask on the side table, reading, calm and comfortable.

ALL SIX ARE CALM, ORDINARY AND AT EASE — they are not ill, not frail, not sad, not
frightened, not in a hospital. Each one is in their own home or their own everyday
surroundings, not in a clinic. Each has a different posture and a different direction of
gaze. Nobody looks at the viewer.

CROPPING — the top 12% and the bottom 12% of the whole picture will sometimes be cut off.
Keep every face, and every one of the small objects listed above, well inside the middle of
the frame. The top and bottom edges of the picture may hold only background: wall, floor,
tint, the edge of a panel.

LIGHT AND COLOUR — bright ordinary daytime in six of the seven panels, high key, soft
daylight; no sunset, no long orange shadows. The lower-left night panel is the single
exception and must read as clearly darker than all the others. Many colours, each of them
held low and dusty: brick red, mustard, sage green, teal, greyish violet, cream. Give each
panel a different pale tint for its background and assign the clothes so that no two
neighbouring people clash: upper left dusty rose, upper right mustard, right pale slate
blue, lower right cream and brick red, lower left deep blue in shadow, left muted teal,
the dentist pale sage green. Clothes are not flat single blocks of colour — give every
garment two or three steps, with collars, cuffs, hems and folds drawn in. As a small
accent only, a deep forest green (#3f654a / #2c5238) on the gutter lines and on one shelf
behind the dentist — a touch, never a wash. Teeth, wherever they show, stay clean
near-white and take none of this colour.

CRITICAL — NO WRITING ANYWHERE. There is no text, no lettering, no numbers, no letters, no
logos, no captions, no labels and no signage anywhere in this picture — not in the gutters
between panels, not on the booklet, not on the pharmacy bag, not on the blister packs, not
on the handheld meter or its little screen, not on the flask, not on any wall. Every
surface that would normally carry writing is left blank. This is the single most important
rule after the style.

AVOID — no speech bubbles, no thought bubbles, no captions, no arrows, no numbers on the
panels and no icons or symbols of any kind; the gutters are plain hand-drawn lines, not a
neat rectangular grid and not comic-book panel borders with heavy black outlines; nobody
looks at the viewer and nobody points at the viewer; the dentist is not scolding, not
warning and not raising a finger; no hospital beds, no IV stands, no wheelchairs, no oxygen
tubes, no face masks covering anyone's face, no sick or pained expressions, no tears; no
close-up dental instruments, no needles, no drills, no trays of tools; no blood; no
photorealistic mouth interiors; no teeth diagrams; no photorealism; no faceless figures; no
exaggerated cartoon head-to-body proportions; no greyscale; no backlit heroic silhouettes;
no green cast over the whole picture; the six panels must not all show the same room.
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
