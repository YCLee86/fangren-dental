# 提醒卡的頭圖：一群人朝鏡頭招手（「時間快到了，來喔」）

2026-09-04。使用者：

> 製作 line 提醒訊息圖卡要用的圖片。畫面是**很多人往螢幕的視角看過來**，因為是提醒，
> 大家表現的是**開心、歡迎、提醒時間要到了、快來喔**的樣子。風格要**比照診所網站上的圖片**。
> 人物**不限於診所醫療人員**的形象，甚至**有小孩很興奮地擠到最前面**看向螢幕，
> 覺得好奇又興奮的樣子。做提示詞。

他同時附了兩張圖當風格參考：**站上〈定期檢查〉那張 HERO**
（＝ `drafts/style-ref-waiting-room.jpg`／`assets/hero-checkup-photo-*.jpg`）與**一張街屋前
一整排人招手的圖**（那一張**不在 repo 裡**，是他自己手上的檔 —— 餵 Gemini 時直接附原檔）。

用在 `/preview/line-remind/` 那張卡的 Flex `hero`（現在是虛線的預留位置）。

---

## 一、⚠⚠ 動手之前要先知道的四件（三件是判斷，一件是推翻站上的規則）

### 1. ⚠⚠⚠ 「很多人」在 268px 上會糊成一排點 —— 所以靠**縱深**，不是靠人數

這張圖在卡片上只有 **268 × 134 px**。ILLUSTRATION.md 第十一節那個 250px 實測的結論
逐條適用，而且最要命的正是這一條：

> 刷牙／定期檢查／牙齦流血三張糊掉的成因是**人太多、沒有視覺中心** ——
> 十來個人一樣大，眼睛不知道看哪裡。

⚠ **他附的第一張參考圖（〈定期檢查〉）正是那三張糊掉的其中之一。**
所以那張只能拿來當**畫風**的參考，**不能拿來當構圖的參考** —— 照它的排法畫，
縮到 268px 就是一片雜點。

**做法**：人排成**三層、三個明顯不同的大小**，互相重疊：

| 層 | 誰 | 頭高（佔畫面高） | 縮到 268px 卡上 |
| --- | --- | ---: | ---: |
| 前 | **那個小孩**（一個人） | **30%** | 40px ← 表情看得到 |
| 中 | 三個大人 | 16% | 21px |
| 後 | 三到四個人，只露頭、肩與招手的手 | 10% | 13px ← 分享圖那條 14px 的下限 |

**總共八到九個人**。「人很多」的感覺由**重疊與高低差**給，不是由數量給
（同第十一節第 4 條：人數不是判準，「怎麼站」才是）。

### 2. ⚠⚠⚠ 「大家看鏡頭」**推翻了站上一條規則**，這一次是刻意的

ILLUSTRATION.md 第三節寫著「**不轉頭看讀者**」，2026-08-16 放寬「人可以是主角」那一次
還特別註明這一條仍然有效（定案那張〈孩子第一次看牙〉裡沒有任何人看鏡頭）。

**這一張刻意違反它，理由是它不是文章插圖**：文章 HERO 是「讀者在旁邊看一個場景」，
所以看鏡頭會打破那道牆；**這一則是寄給某一個人的訊息**，看鏡頭＝**對著收到訊息的那個人
打招呼**，那正是使用者要的東西。

⚠ **這條例外只給 LINE 的訊息圖，不要帶回站上的文章 HERO 與分享圖。**

### 3. 風格照站上（色鉛筆＋顆粒），所以**和「綁定完成」那張不同一路**

綁定完成那張頭圖是**平面線條風**（`drafts/line-bind-done-prompt.md` 第三節已經記著
「那個帳號從此有兩種畫風」）。使用者這一次指定「比照診所網站上的圖片」，
所以這一張走站上那一套：**手繪線、粗細有變化、暖深棕不是純黑、色鉛筆的淡色、細顆粒、
高明度、每個人衣服不同色**。

⚠ 結果是 LINE 上兩張頭圖畫風不同。**要不要回頭把綁定完成那張也改成站上這一套，是使用者
一句話的事** —— 那張的構圖、寓意、那一團人都不必動，只換 `STYLE` 與 `COLOUR` 兩段。

### 4. 「快來喔」不要畫成催促，也不要畫成招攬

- **不要有人指著鏡頭**、不要招手叫人過來（「快點」的手勢）、不要有人看錶。
  ⚠ 指著鏡頭在提醒訊息裡讀起來是**責備**（「你怎麼還沒來」）。
- **不要比讚、比 OK、鼓掌、舉牌** —— 一群病人比讚讀起來是**見證推薦**，那是醫療廣告的紅線邊上。
- **不要氣球、彩帶、派對帽** —— 開幕的語彙，而且這一則**每次約診都會送一次**
  （`channels/README.md` 20-11 第七項：**要耐看，不要有太強的梗**）。
- 「時間快到了」這件事**由卡片上的文字講**（日期與時間本來就是全卡最大的字），
  圖上**不畫時鐘、不畫月曆** —— 268px 下那是雜點，而且時鐘有數字就違反「圖上不放字」。

---

## 二、規格

| | |
| --- | --- |
| 用在哪 | `/preview/line-remind/` 那張卡的 Flex `hero`（`size: full`、`aspectRatio: "2:1"`、`aspectMode: cover`） |
| 成品尺寸 | **1024×512（2:1）** ⚠ 不是 1040 —— Flex 的 `image` 上限是 1024×1024（CLAUDE.md 第十一之二節） |
| 生成尺寸 | **請 Gemini 出 16:9**（2:1 不在它的選項裡），之後**上下各裁 5.6%** |
| 卡片上實際多大 | **268 × 134 px**（整張卡的兩成高） |
| 圖上有字嗎 | **沒有。** 卡片上的字是 Flex 的真文字 |
| accent | 一般牙科那一支綠，由**淡鼠尾草綠的刷手服**承接。⚠ 提示詞裡不要寫 HEX（ILLUSTRATION.md 第七節第 8 條：色值和形容詞打架時模型跟形容詞） |
| 存哪裡 | `preview/line-remind/hero-remind.jpg`；上線前另外放一份到 `https://fangren.net/assets/line/`（CLAUDE.md 第十一之七節第 4 項，那個資料夾還不存在） |

---

## 三、參考圖要附哪幾張（**分兩組，一組只講一件事**）

| 組 | 檔案 | 只提供這一件 | 要跟 Gemini 說的話 |
| --- | --- | --- | --- |
| **A・畫風** ⭐ | `drafts/style-ref-waiting-room.jpg`（＝〈定期檢查〉那張 HERO）、`assets/hero-kids-photo-1600.jpg` | 線的畫法、臉與膚色、色鉛筆的淡色、細顆粒、每個人不同色 | 「**線條、上色、人臉與膚色完全照這兩張**，**構圖與人數不要參考**」 |
| **B・氣氛** | 使用者手上那張街屋招手圖 | 只有「**一整排人朝鏡頭招手、有人從窗口探出來**」那個氣氛 | 「**只參考大家朝鏡頭招手的感覺**，人數、排法與場景不要參考」 |

⚠⚠ **A 那兩張裡有假字**（〈定期檢查〉牆上的海報與櫃檯那張小卡）—— 餵的時候一定要多講一句：
**「參考圖裡出現的任何文字一律不要學，成品不能有字。」**（同綁定完成那一輪）

⚠⚠ **B 那張是「反例的一半」**：氣氛對，但它把十幾個人平排成一列同樣大 ——
**那正是第一節第 1 點要避開的排法**。所以附它的時候要明講「**人數與排法不要參考**」。

---

## 四、提示詞（逐字，可直接複製貼上）

```
Editorial illustration, landscape 16:9. It will be cropped to a 2:1 letterbox and then shown
very small — about 268 pixels wide inside a phone message card — so every shape must still
read at thumbnail size.

READ THIS FIRST — STYLE. This is the most important section; keep it fully in force no matter
how long the rest of this brief is. Draw everything in the style of the reference
illustrations: THIN HAND-DRAWN LINEWORK whose weight varies and sometimes breaks — never a
thick even outline, never a mechanical vector line, and never pure black (the line is a warm
dark brown-grey). Colour is laid in soft coloured-pencil tones, light and high-key, with FINE
PAPER GRAIN over the whole image and a few loose hand-drawn shading strokes; plenty of pale
paper shows through. EVERY PERSON WEARS A DIFFERENT COLOUR so the group never reads as one
block, and warm colours and cool colours are both present — this is not a monochrome picture
and not a pastel-only one. Friendly, everyday, alive; never slick, never corporate, never
photographic.

FACES — each face is ONE FLAT WARM SKIN TONE with no modelling. On a face there is only: the
outline, two eyes drawn as small simple marks, two short eyebrows, a small nose mark, a
smiling mouth and an ear. Hair is a flat shape in two tones with no individual strands. EVERY
PERSON IS DRAWN WITH THE SAME LINE WEIGHT AND THE SAME SOLIDITY — nobody is paler, softer,
thinner or more transparent than anybody else. Every face is clearly HAPPY: an easy open
smile, eyebrows lifted, eyes crinkled. Nobody is anxious, nobody is blank, and nobody is
pushed into a wild cartoon grin.

WHAT IS HAPPENING — this is the one idea and everything else serves it. A GROUP OF PEOPLE
INSIDE A SMALL NEIGHBOURHOOD DENTAL CLINIC HAVE ALL TURNED TOWARDS US AND ARE WAVING HELLO,
pleased to see us, as if the person holding the phone has just walked through the door. It is
an ordinary happy moment — not a party, not a ceremony, not a group photograph being posed.
EVERYBODY LOOKS STRAIGHT INTO THE CAMERA. This is deliberate and it is the whole point of the
picture: do not turn anybody away from us.

THE CHILD IS THE CENTRE OF THE PICTURE. A boy of about five has squeezed through to the very
front, closest to us, looking straight into the camera, curious and thrilled — eyes wide open
and bright, mouth open in a laugh, one hand up in a big wave, the other hand holding the near
corner of the counter. He stands a little LEFT OF CENTRE and the bottom edge cuts him off at
about the waist. HIS HEAD IS THE BIGGEST IN THE PICTURE — about three tenths of the height of
the whole picture. Draw it that large: at thumbnail size a smaller head turns into a dot. No
adult and no object overlaps his face.

DEPTH, NOT A ROW — THIS IS THE MOST IMPORTANT RULE OF THE COMPOSITION. The people stand in
THREE CLEAR LAYERS at three clearly different sizes, overlapping one another, so that the
group reads as "a lot of people" without the picture filling up with small heads:
  • FRONT — the boy, alone, head about 30% of the picture height.
  • MIDDLE — THREE adults gathered just behind and around him, heads about 16% of the picture
    height, their bodies overlapping his shoulders: a dentist of about forty in an open white
    coat over pale sage-green scrubs, waving with one open hand; a grandmother in a soft lilac
    blouse with both hands lifted, laughing; a young mother in a coral top with a toddler on
    her hip, and the toddler lifts one small hand too.
  • BACK — THREE OR FOUR more people further inside the room, heads about 10% of the picture
    height, with only their heads, shoulders and waving hands visible between the shoulders in
    front: a dental nurse in pale sage-green scrubs behind the counter, a man in his forties in
    a checked shirt, a teenage girl with a backpack, an older man with a walking stick.
NEVER line everybody up side by side at the same size and at the same height. Heads sit at
clearly different heights and clearly different sizes. EIGHT OR NINE PEOPLE IN TOTAL, no more.

NOT EVERYBODY IS CLINIC STAFF — only two people wear scrubs. All the others are ordinary
neighbours of every age in ordinary everyday clothes, each one in a different colour.

THE WAVES ARE ALL DIFFERENT — one flat open palm held high; one person lifting both hands;
one hand raised only as high as the shoulder; one hand showing between two shoulders with no
face behind it. Beside two or three of the hands put two or three SHORT curved motion marks,
all short and all going the same way. NOBODY POINTS AT THE VIEWER, nobody beckons or waves
anybody in, nobody claps, nobody gives a thumbs-up or an OK sign, nobody holds anything up to
show us, and nobody looks at a watch or a clock.

THE ROOM — a small, bright, ordinary Taiwanese neighbourhood dental clinic, seen from just
inside its front door. Keep it to FOUR LARGE SIMPLE THINGS, large and few, all quiet enough to
stay behind the people:
  • A LOW LIGHT-WOOD RECEPTION COUNTER running across the lower right, with the boy's hand on
    its near corner.
  • Behind the counter, a plain light-wood cabinet wall.
  • ON THE LEFT, ONE BIG BRIGHT WINDOW with warm daylight coming through it — the brightest
    thing in the picture and the reason the whole room feels open.
  • Through a doorway on the right, one corner of a dental chair and the folded arm of the
    treatment light, so that the room is unmistakably a dental clinic.
No posters, no charts, no shelves of little bottles, no scattered pot plants, no clutter — at
268 pixels wide those turn into dirt.

LIGHT AND COLOUR — bright, calm midday daylight coming from the window on the left, so the
light pools on the boy's face and on the faces of the middle group and softens towards the
edges. Walls warm cream; floor light warm wood; the two sets of scrubs pale sage green;
everyone else in soft everyday colours — coral, lilac, mustard, denim blue, warm brown — one
colour per person. Not a sunset, not lamplight, no long orange shadows, no overall yellow or
sepia cast, never grey and never blue-white.

CROP SAFETY — this image will be cropped to 2:1 by cutting an equal strip off the top and off
the bottom, about 6% of the height each. Everything that matters — every face, every waving
hand and the near corner of the counter — must sit comfortably inside the central horizontal
band, well away from the top and bottom edges. Put nothing essential in the top sixth or the
bottom sixth of the frame.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions, labels or watermarks, in any language. The counter carries no sign; the
scrubs and the white coat carry no badge, no name tag and no embroidery; there is no poster,
no wall chart, no calendar, no clock face with numerals, no screen or monitor with anything on
it, no price list and no name plate. Wherever writing would normally appear, leave the surface
plain. If any of the reference images contains lettering, ignore it completely.

AVOID — photorealism; 3D rendering; thick even black outlines; flat vector art with no grain;
anybody turned away from the camera; anybody pointing at the viewer, beckoning, or waving
somebody in; thumbs-up, OK signs, applause, held-up signs or banners; a posed straight row of
people all at the same size and the same height; more than nine people; small faces at the
front of the picture; anxious, tired, bored or blank faces; face masks covering faces;
needles, syringes, drills, probes, blood or tears; anything inside anybody's mouth; a
frightened child; balloons, confetti, streamers, party hats or a grand-opening feeling;
speech bubbles, arrows, small icons, sparkles or stars; panels, frames, insets or dividing
lines; large empty white areas; an overall yellow or sepia cast; greyscale.
```

---

## 四之二、場景 B「騎樓門口版」——⚠ 要換就把 `THE ROOM` 與 `LIGHT AND COLOUR` **兩整段**換掉

⚠ 第四節那一版是**室內（門一進來）**。要改成他附的第二張參考圖那種**街邊騎樓**，
就整塊換下面這兩段，**其餘一個字都不要動**（同 ILLUSTRATION.md 第十三節第 10 條：
要換就整塊換，混著改會長出互相打架的線索）。

```
THE ROOM — the covered pavement arcade right outside a small Taiwanese neighbourhood dental
clinic. Keep it to FOUR LARGE SIMPLE THINGS, large and few, all quiet enough to stay behind
the people:
  • THE CLINIC'S OWN GLASS DOOR standing WIDE OPEN behind the group, with warm light spilling
    out of it onto the pavement — this is the brightest thing in the picture and the centre
    that the eye lands on.
  • The clinic's plain wall to each side of the door: light render below, one band of plain
    tile above, no signboard and no lettering of any kind.
  • Two or three plain white pots of green plants standing along the wall.
  • One parked scooter at the far left edge, drawn small and simple.
The pavement is a plain light band across the bottom. No shop signs, no banners, no cables,
no traffic, no crowd of extra passers-by behind the group.

LIGHT AND COLOUR — bright, calm mid-morning daylight in the shade of the arcade, with the
warm light from the open doorway falling on the group from behind and a little to the right.
The light lands on the boy's face and on the faces of the middle group and softens towards
the edges. The wall is warm cream; the pavement is a light warm grey; the two sets of scrubs
are pale sage green; everyone else is in soft everyday colours — coral, lilac, mustard, denim
blue, warm brown — one colour per person. Not a sunset, not night, no long orange shadows, no
overall yellow or sepia cast, never grey and never blue-white.
```

⚠ 換成 B 的時候，`THE CHILD` 那一段裡「holding the near corner of the counter」要改成
「holding onto the edge of the open door」，而 `THE WAVES` 段的最後一句不動。

**我推薦先出 A（室內）**：招呼圖卡的頭圖已經是**診所的街景照**了，兩則放在同一個帳號裡，
第二張再畫一次街景會太像；而且室內那一版有櫃檯可以讓小孩扶著，前景的錨點比較穩。

---

## 五、驗收（生成之後逐條看，任何一條沒過就重生成，不要後製）

1. ⚠⚠ **先縮成 268px 寬再看** —— 這是唯一真的判準。看得出「一群人在朝我招手」
   且一眼落在那個小孩身上就算過；讀成一排點就重生成。
   （做法：把圖丟進 `preview/line-remind/` 那張卡的頭圖位置，直接看提案頁。）
2. **小孩的頭高 ≥ 畫面高的 27%**，而且沒有被任何人擋到臉。
3. **三層的頭高差得出來**（前 ÷ 中 ≈ 1.9、中 ÷ 後 ≈ 1.6）；沒有一整排等高的人。
4. **人數 ≤ 9**。
5. **每一個人都看鏡頭**，而且**沒有人指著鏡頭**、沒有比讚、沒有舉牌。
6. **只有兩個人穿刷手服**，其餘是一般民眾，每個人衣服不同色。
7. **整張圖沒有任何字**（海報、月曆、時鐘數字、名牌、招牌一律沒有）。
8. **線是暖深棕不是純黑、粗細有變化**；表面有細顆粒；不是平塗的向量圖。
9. **四邊沒有烘進去的白框**（ILLUSTRATION.md 第七節第 6 條，量法在那裡 ——
   逐列算亮度標準差，`< 12` 就是白框）。
10. **上下各裁 5.6% 之後**，每一張臉與每一隻招手的手都還在畫面裡。

## 六、產圖之後要做的

```bash
# 1. 裁成 1024×512（照 bind-done 那一支的做法改檔名即可）
node drafts/bind-done-hero-crop.mjs   # ⚠ 要複製一份改成 remind 的來源／輸出路徑
# 2. 接進提案頁（把 .hero.ph 那個虛線塊換成真的 <img>），再重出圖片檔
node drafts/channels/remind-png.mjs --chat
```

⚠ **提案頁改了就要重跑 `remind-png.mjs`**，否則那幾張圖會開始說謊
（`channels/README.md` 19-19 那條）。

---

## 七、第二版（2026-09-04）：**人再多一點、前排把畫面擠滿、有人把臉貼在玻璃上**

第一版產出的圖存在 `drafts/line-remind-hero-v1.jpg`（1376×768，16:9）。使用者：

> 蠻不錯的，很有我說的感覺。但這個畫面**有點平靜**，人物可以**再多一點**，
> 小朋友或幾個年輕人**站很前面把畫面擠滿**（甚至一兩個人**把臉貼到畫面玻璃上**的感覺）。

### 7-1　⚠⚠ 「人再多」要往**前排**加，不可以往後排加

第一節第 1 點那條（268px 上會糊）**沒有被推翻，只是有方向**：

| | 加人 | 對 268px 的影響 |
| --- | --- | --- |
| **往前加**（頭高 24~32%） | ✅ 這一輪加的三個都在這裡 | 卡上 32~43px，**比第一版還好讀** |
| 往中間加（16%） | 第一版三個 → 四個 | 21px，還可以 |
| **往後加**（10%） | ⛔ **維持三到四個，不准再加** | 13px 已經是下限（分享圖那條 14px），再加就是他當初嫌過的「一排小點」 |

所以總人數 8~9 → **11~12**，而**畫面反而更好讀** —— 因為多出來的三個都很大。
**「平靜」的解法也是同一件事**：第一版前排只有一個人、四周留白很多（左邊整片窗、
右邊整片櫃），擠滿之後那些空白被身體吃掉，畫面自己就熱鬧了。

### 7-2　「貼在玻璃上」怎麼給，才不會在 268px 上變成一團糊

- **鏡頭改成站在診所那扇玻璃門外面**，整個畫面就是一片乾淨的玻璃 ——
  這樣「貼玻璃」有實體的理由，而且**收到訊息的人＝正要走到門口的那個人**，
  和這一則訊息的情境完全對上。
- ⚠⚠ **真的壓扁的臉只准一張**（那個小孩）：鼻頭稍微壓平、一邊臉頰被推上去、
  嘴張開在笑。**壓太多張、壓太誇張，在 268px 上就只是一團肉色**。
  其他人給**手掌貼玻璃**就好 —— 手掌很好讀（一片肉色 ＋ 五根手指的縫）。
- **玻璃本身只給三個提示**：貼著的手掌邊緣有一圈**壓白**、小孩嘴邊一小塊**呵氣的霧**、
  某一角一道**很淡的斜向反光**。⚠ **不要畫窗框、不要畫橫在畫面中間的框條** ——
  那會把畫面切成上下兩塊，違反「不准分格」。
- ⚠ **反光不要拉滿整張**：它會蓋掉臉。只准在一個角落、而且很淡。

### 7-3　其餘不動

`STYLE`／`FACES` 兩段、看鏡頭、不要指鏡頭／比讚／舉牌／氣球、不畫時鐘月曆、
圖上不放字 —— **一個字都沒改**（第一版那四條判斷仍然成立）。

### 7-4　提示詞・第二版（逐字，可直接複製貼上）

```
Editorial illustration, landscape 16:9. It will be cropped to a 2:1 letterbox and then shown
very small — about 268 pixels wide inside a phone message card — so every shape must still
read at thumbnail size.

READ THIS FIRST — STYLE. This is the most important section; keep it fully in force no matter
how long the rest of this brief is. Draw everything in the style of the reference
illustrations: THIN HAND-DRAWN LINEWORK whose weight varies and sometimes breaks — never a
thick even outline, never a mechanical vector line, and never pure black (the line is a warm
dark brown-grey). Colour is laid in soft coloured-pencil tones, light and high-key, with FINE
PAPER GRAIN over the whole image and a few loose hand-drawn shading strokes; plenty of pale
paper shows through. EVERY PERSON WEARS A DIFFERENT COLOUR so the group never reads as one
block, and warm colours and cool colours are both present — this is not a monochrome picture
and not a pastel-only one. Friendly, everyday, alive; never slick, never corporate, never
photographic.

FACES — each face is ONE FLAT WARM SKIN TONE with no modelling. On a face there is only: the
outline, two eyes drawn as small simple marks, two short eyebrows, a small nose mark, a
smiling mouth and an ear. Hair is a flat shape in two tones with no individual strands. EVERY
PERSON IS DRAWN WITH THE SAME LINE WEIGHT AND THE SAME SOLIDITY — nobody is paler, softer,
thinner or more transparent than anybody else. Every face is clearly HAPPY: an easy open
smile, eyebrows lifted, eyes crinkled. Nobody is anxious, nobody is blank, and nobody is
pushed into a wild cartoon grin.

WHAT IS HAPPENING — this is the one idea and everything else serves it. WE ARE STANDING JUST
OUTSIDE THE GLASS FRONT DOOR OF A SMALL NEIGHBOURHOOD DENTAL CLINIC, LOOKING IN THROUGH THE
GLASS, AND EVERYONE INSIDE HAS CROWDED UP TO IT TO WAVE HELLO AT US. They are delighted to
see us, jostling to get to the front, as if the person holding the phone has just walked up
to the door. It is a happy, slightly chaotic everyday moment — not a party, not a ceremony,
not a posed group photograph. EVERYBODY LOOKS STRAIGHT INTO THE CAMERA. This is deliberate
and it is the whole point of the picture: do not turn anybody away from us.

THE PICTURE IS FULL OF PEOPLE — ELEVEN OR TWELVE IN ALL, packed together, shoulders
overlapping, heads at many different heights, arms crossing in front of each other, so that
very little empty background is left. Nobody stands alone with space around them.

DEPTH, NOT A ROW — THIS IS THE MOST IMPORTANT RULE OF THE COMPOSITION. The people stand in
THREE CLEAR LAYERS at three clearly different sizes, overlapping one another, so that the
crowd reads as "a lot of people" without the picture filling up with small heads:

  • FRONT — THREE people crammed right up against the glass, very large, cut off by the
    bottom edge at about chest height, and reaching almost to the left and right edges of the
    frame. They fill the lower half of the picture.
      – THE LITTLE BOY IS THE CENTRE OF THE PICTURE: about five years old, just LEFT OF
        CENTRE, HEAD ABOUT THREE TENTHS OF THE PICTURE HEIGHT — the biggest head in the
        picture. HE HAS PRESSED HIS FACE FLAT AGAINST THE GLASS: the tip of his nose is
        slightly squashed, ONE CHEEK IS PUSHED UP a little, his eyes are wide open and
        bright, his mouth is open in a laugh. BOTH PALMS ARE FLAT ON THE GLASS beside his
        face, fingers spread. KEEP THE SQUASHING GENTLE — he must still read instantly as a
        happy little boy, never as a distorted or scary face.
      – A GIRL OF ABOUT EIGHT on the right side of the frame, head about a quarter of the
        picture height, leaning in with BOTH PALMS FLAT ON THE GLASS, up on her toes,
        laughing, looking straight at us. Her face is NOT squashed.
      – A YOUNG WOMAN IN HER EARLY TWENTIES on the left, head about a quarter of the picture
        height, bent forward to the boy's level with ONE PALM ON THE GLASS and the other hand
        waving beside her head, grinning at us.
    ONLY THE BOY'S FACE TOUCHES THE GLASS. Everybody else touches it with hands only.

  • MIDDLE — FOUR adults standing right behind the front three, heads about one sixth of the
    picture height, their shoulders overlapping the front row: a dentist of about forty in an
    open white coat over pale sage-green scrubs, waving with one open hand; a grandmother in
    a soft lilac blouse with both hands lifted, laughing; a young mother in a coral top with
    a toddler on her hip, and the toddler lifts one small hand too; a young man in his
    twenties in a mustard t-shirt leaning in over someone's shoulder, waving.

  • BACK — THREE OR FOUR more people further inside the room, heads only about one tenth of
    the picture height, with only their heads, shoulders and waving hands visible in the gaps
    between the shoulders in front: a dental nurse in pale sage-green scrubs, a man in his
    forties in a checked shirt, a teenage girl with a backpack, an older man with a walking
    stick. DO NOT ADD ANY MORE PEOPLE TO THIS BACK LAYER — at thumbnail size they turn into
    dots.

NEVER line everybody up side by side at the same size and at the same height. Heads sit at
clearly different heights and clearly different sizes, and the three layers must be
immediately distinguishable by size.

NOT EVERYBODY IS CLINIC STAFF — only two people wear scrubs. All the others are ordinary
neighbours of every age in ordinary everyday clothes, each one in a different colour.

THE GLASS — a single big clean sheet of clear glass fills the whole frame between us and
them. THERE IS NO WINDOW FRAME, NO DOOR FRAME, NO GLAZING BAR AND NO BORDER ANYWHERE IN THE
PICTURE — the glass is shown ONLY by three small quiet signs:
  • where a palm or a cheek presses on it, the skin flattens and goes slightly PALER at the
    contact patch, with a thin soft outline around it;
  • a SMALL SOFT PATCH OF BREATH MIST beside the boy's mouth, no bigger than his hand;
  • ONE very faint pale diagonal reflection streak across ONE CORNER of the picture only.
Keep all three subtle. The reflection must never cross a face and must never wash out the
picture.

THE WAVES ARE ALL DIFFERENT — flat palms on the glass, one person lifting both hands, one
hand raised only as high as a shoulder, one hand showing between two shoulders with no face
behind it. Beside two or three of the hands put two or three SHORT curved motion marks, all
short and all going the same way. NOBODY POINTS AT THE VIEWER, nobody beckons or waves
anybody in, nobody knocks or bangs on the glass, nobody claps, nobody gives a thumbs-up or an
OK sign, nobody holds anything up to show us, and nobody looks at a watch or a clock.

THE ROOM BEHIND THEM — a small, bright, ordinary Taiwanese neighbourhood dental clinic. The
crowd hides most of it, and that is correct. Only these things show in the gaps, drawn large
and simple and quiet:
  • A LOW LIGHT-WOOD RECEPTION COUNTER on the right, behind the crowd.
  • A plain light-wood cabinet wall behind the counter.
  • Warm daylight from a window on the left, mostly hidden behind the people.
  • Through a doorway on the right, one corner of a dental chair and the folded arm of the
    treatment light, so that the room is unmistakably a dental clinic.
No posters, no charts, no shelves of little bottles, no scattered pot plants, no clutter — at
268 pixels wide those turn into dirt.

LIGHT AND COLOUR — bright, calm midday daylight from the left, so the light pools on the
boy's face and on the faces of the front three and softens towards the edges. Walls warm
cream; floor light warm wood; the two sets of scrubs pale sage green; everyone else in soft
everyday colours — coral, lilac, mustard, denim blue, warm brown, soft green — one colour per
person, and no two people next to each other in the same colour. Not a sunset, not lamplight,
no long orange shadows, no overall yellow or sepia cast, never grey and never blue-white.

CROP SAFETY — this image will be cropped to 2:1 by cutting an equal strip off the top and off
the bottom, about 6% of the height each. EVERY FACE and EVERY WAVING HAND must sit
comfortably inside the central band, clear of the top 10% and the bottom 10% of the frame.
The front three may run off the bottom edge from the chest down — that is intended — but
their faces and their hands on the glass stay well inside.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions, labels or watermarks, in any language. The glass carries no lettering and
no sticker; the counter carries no sign; the scrubs and the white coat carry no badge, no
name tag and no embroidery; there is no poster, no wall chart, no calendar, no clock face
with numerals, no screen or monitor with anything on it, no price list and no name plate.
Wherever writing would normally appear, leave the surface plain. If any of the reference
images contains lettering, ignore it completely.

AVOID — photorealism; 3D rendering; thick even black outlines; flat vector art with no grain;
a window frame, a door frame, a glazing bar or any border drawn across the picture; a heavy
or mirror-like reflection that hides faces; more than one face pressed on the glass; a
squashed face distorted so far that it stops looking friendly; anybody turned away from the
camera; anybody pointing at the viewer, beckoning, knocking or banging on the glass;
thumbs-up, OK signs, applause, held-up signs or banners; a posed straight row of people all
at the same size and the same height; small faces at the front of the picture; extra people
added far away in the background; anxious, tired, bored or blank faces; face masks covering
faces; needles, syringes, drills, probes, blood or tears; anything inside anybody's mouth; a
frightened child; balloons, confetti, streamers, party hats or a grand-opening feeling;
speech bubbles, arrows, small icons, sparkles or stars; panels, frames, insets or dividing
lines; large empty background areas; an overall yellow or sepia cast; greyscale.
```

### 7-5　驗收（在第五節那十條之外，這一輪多四條）

11. **人數 11~12**，而且**後排仍然只有三到四個**（往後加就退回去）。
12. **只有一張臉貼在玻璃上**（那個小孩），而且壓得很輕 —— 縮到 268px 還讀得出是一張笑臉。
13. **畫面上沒有任何框**（窗框、門框、橫條），反光只在一個角落、沒有跨過任何一張臉。
14. **前排三個人有沒有真的把下半部擠滿** —— 把圖縮到 268px，下半部應該幾乎沒有背景。
