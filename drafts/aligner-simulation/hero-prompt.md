# HERO 提示詞：〈隱形矯正：模擬之後，醫師怎麼讓牙齒走得準〉

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

## 三、要附的參考圖（兩張，說明分開寫）

| # | 檔案 | 附圖時要寫的話 |
| --- | --- | --- |
| 1 | `assets/og-topic-ortho.jpg` | 「**飄浮螢幕的語彙、螢幕的藍、白色氛圍弧線、人物長相與服裝**照這張。⚠ 不要照它的**構圖**（那是醫師對病人講解，這一張沒有病人）；⚠ 不要照它上面那條藍色的標題帶。」 |
| 2 | `assets/hero-ortho-photo-1600.jpg` | 「**畫法、質感、明度照這張**：線寬有變化、色鉛筆顆粒、大量紙白透出來、整體淡。⚠ **不要照它的分格**，這一張是一個連續的空間。」 |

## 四、提示詞（逐字，可直接複製）

```
STYLE — THIS IS THE MOST IMPORTANT SECTION, READ IT FIRST.

A warm, calm editorial ILLUSTRATION in coloured-pencil texture, 16:9, 2000 x 1116.
Hand-drawn ink outlines with VISIBLE VARIATION IN LINE WEIGHT — thicker where forms
meet, thinner and occasionally broken at the ends. The outline colour is a warm dark
brown, never pure black. Never a uniform vector line, never a rough sketchy scribble.
Every surface carries a fine pencil grain; large areas of pale paper are left showing
through. Flat fills with two or three steps of the same hue for shading — no gradients
except where light falls, no airbrush, no photo-realism, no 3D render, no greyscale.

SKIN IS THE ONE EXCEPTION TO THE TWO-OR-THREE-STEPS RULE: every face and hand is ONE
FLAT COLOUR with no modelling at all. A face contains ONLY six things — the outline of
the head, the eyes, the eyebrows, the nose, the mouth and the ears. NO wrinkles, no
nasolabial folds, no under-eye lines, no cheek shading, no jaw shading, no blush
gradients. Everyone is East Asian (Taiwanese), aged about 28 to 45, with natural human
head-to-body proportions. NOBODY LOOKS AT THE VIEWER.

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
low wooden worktop running along the back wall, a leafy potted plant in the far corner,
two plain mugs on the worktop. It is a room where a treatment is being worked out, NOT a
treatment room: there is NO dental chair, NO patient, NO overhead surgical lamp, NO
instruments.

CENTRE-LEFT, THE FOCAL POINT — A LARGE TRANSLUCENT BLUE SCREEN FLOATS IN MID-AIR, about
55% of the picture height, tilted very slightly towards the viewer, with soft rounded
corners and a faint glow at its edges. On it, drawn in white line only:
  • a top-down view of an upper dental arch, the teeth as simple rounded white shapes;
  • three thin white curved arrows, each beside a different tooth, showing it turning or
    sliding a small amount;
  • ONE TOOTH IS PULLED OUT OF THE ARCH AND ENLARGED at the right-hand side of the screen.
    THIS ENLARGED TOOTH IS THE WHOLE POINT OF THE PICTURE: it is drawn COMPLETE, with its
    CROWN ABOVE AND ITS LONG ROOT BELOW, and the root is embedded in a translucent
    cut-away slab of jawbone so that the viewer can see how much bone sits on each side of
    the root. A single thin white arrow shows the root tilting.
  Nothing else is on this screen.

A WOMAN DENTIST STANDS IN FRONT OF THAT SCREEN, seen from the waist up, turned
three-quarters towards the screen, on the LEFT of it. She wears a white coat over
blue-grey scrubs. The hand nearer the viewer is raised to chest height with the index
finger extended, its tip touching the enlarged tooth as if turning it a few degrees; her
other arm hangs relaxed, holding a slim pen. Her shoulders are low and relaxed, her head
tilts slightly towards the screen, and her eyes look at her own fingertip. HER MOUTH IS
ONE SHORT LINE CURVING GENTLY UPWARDS AT BOTH ENDS — a small, closed, easy smile. She is
absorbed and completely at ease.

FAR LEFT — A MAN IN HIS THIRTIES, A DESIGN ENGINEER, sits at a low desk in a
mustard-yellow knit top, an open laptop in front of him and a tablet propped on a stand
beside it. HE IS LEANING BACK A LITTLE, one hand resting under his chin, giving a small
nod towards the big screen: he has just seen how to solve it. His eyebrows are LEVEL and
his mouth is a short, faintly upturned closed line. TWO SMALL FLOATING SCREENS hover above
his desk, each showing white line drawings only:
  • the upper one shows A ROW OF FIVE CLEAR ALIGNER TRAYS lined up left to right, each one
    a simple horseshoe outline, identical in size;
  • the lower one shows A SINGLE TOOTH WITH ONE SMALL ROUNDED-SQUARE BLOCK BONDED TO ITS
    FRONT SURFACE — the block is a plain rounded square with flat sides, it has no crown,
    no root and no face.
  THE LAPTOP SCREEN SHOWS A PALE, SMALLER COPY OF THE SAME DENTAL ARCH and nothing else.
  THE TABLET ON THE STAND SHOWS THE SAME ARCH, PALER STILL, and nothing else.

RIGHT SIDE — A MAN IN HIS LATE TWENTIES IN BLUE-GREY SCRUBS STANDS HOLDING A TABLET flat
in one hand at chest height, his other hand lifted with an open palm towards the big
screen, comparing the two. HIS TABLET SHOWS THE SAME ENLARGED TOOTH WITH ITS ROOT, in
white line, and nothing else. He is serious and attentive but NOT tense: his brow is
smooth, his lips are just parted as if he is about to say one short sentence.

BESIDE HIM, SLIGHTLY BEHIND — A YOUNG WOMAN ASSISTANT in a pale sage-green top looks down
at a PHONE held in both hands, calm and unhurried. HER PHONE SCREEN SHOWS THE SAME PALE
ARCH, tiny, and nothing else.

ON THE LOW CABINET BETWEEN THEM stand TWO REAL OBJECTS, not screens: a small plaster model
of an upper arch of teeth, and one clear aligner tray resting beside it.

ON THE BACK WALL hangs ONE POSTER showing ONLY a simple line drawing of a dental arch —
an abstract horseshoe of rounded shapes. THE POSTER HAS NO WRITING OF ANY KIND.

ATMOSPHERE LINES — Three or four long, soft, pale-white arcs sweep across the upper part
of the room, behind the people, giving the air a sense of movement. THEY MUST NOT COME OUT
OF ANYONE'S MOUTH, NOSE, HANDS OR BODY, they must not loop back on themselves, and they
must not be thicker at the far end than at the start.

CRITICAL — NO WRITING ANYWHERE IN THE PICTURE.
There is NO text, NO lettering, NO words, NO letters, NO numbers, NO digits, NO
percentages, NO dates, NO labels, NO captions, NO logos, NO brand marks, NO watermark and
NO signature — not on the floating screens, not on the laptop, not on the tablets, not on
the phone, not on the poster, not on the mugs, not on the clothing, not on any name badge,
and not on the cabinet. There are NO user-interface elements: no buttons, no sliders, no
menus, no toolbars, no progress bars, no tabs, no cursors, no charts, no graphs, no axes,
no rulers, no scales, no gauges, no tick marks, no keyboard letters — the laptop keys are
plain blank rectangles. Wherever writing would normally appear, LEAVE THE SURFACE BLANK.

AVOID — a dental chair, a patient, a person lying down, an overhead surgical lamp, trays
of instruments, syringes, needles, drills, blood, a mouth held open, a close-up of a real
mouth, cartoon teeth with faces, arms, legs or eyes, before-and-after pairs, a calendar, a
clock, a progress bar, a timeline, a countdown, anyone frowning, gritting their teeth,
holding their head in their hands, rubbing their temples, sighing, sweating, looking
exhausted, stacks of paperwork, an untidy desk, anyone cheering, laughing out loud, giving
a thumbs-up or a high five, anyone looking at the viewer, a person in silhouette, dramatic
backlighting, a dark server room, glowing neon, holographic rainbow or chrome gradients,
floating particles, circuit-board patterns, network node diagrams, DNA helices, a robot,
a brain icon, panel dividers, comic frames, speech bubbles, thought bubbles, photo-realism,
3D rendering, greyscale.
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
