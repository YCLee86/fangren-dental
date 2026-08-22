# 分享圖提示詞：一般牙科・定期檢查（`og-topic-general`）

**狀態：第十一版提案。第四版起使用者說「很棒」，之後都是在那一版上逐項修。**
規格依 [ILLUSTRATION.md](../ILLUSTRATION.md) 第十一節（250px 判準）與
[TEAM.md](../TEAM.md) 第一節第 9 號（插畫師的三個交件門檻）。
文案脈絡見 COPY.md 第九之十四節。

## 這一張要講的事

使用者 2026-08-22 指定的概念（他拿一張自己生成的巷弄立面圖當參考）：
**「診所跟診所的人跟整棟房子，在巷弄裡跟場景融在一起」** ——
對上那一頁的兩行：［老屋新生］永樂街的五十年老屋、［在地］四十多年不少人陪著走到現在。

---

## 三版的量測紀錄（每一版都用同一支腳本）

腳本：`drafts/og-measure.mjs`、`og-measure-ink.mjs`（Chromium canvas 讀像素，
方法同 ILLUSTRATION.md 第十之四節）。

| | 使用者的參考圖 | 第一版 | 第二版 | 門檻 |
| --- | --- | --- | --- | --- |
| 無彩空白（S<12 且 L>80） | 1.4% | 19.6% ❌ | **0.9%** ✅ | < 5% |
| 邊緣密度 | 41.1% | 19.3% ❌ | 25.0% ❌ | ≥ 30% |
| 每個人的線相差（最暗 5 百分位） | — | 99.5 階 ❌ | **10.8 階** ✅ | < 20 階 |
| 左半 vs 右半密度 | — | — | 11.5% vs 35.7% ❌ | 左半 ≥ 20% |
| 主要人物高佔畫面 | — | — | 47.3% ❌ | ≥ 75% |
| 250px 卡上，人的頭有多高 | — | — | 約 9~10px ❌ | ≥ 20px |

### 第一版錯在哪（三條通則，已入 ILLUSTRATION.md 第十一之一節）

使用者：「像鬼屋欸」「旁邊還有淡淡的人影像鬼魂」。三個成因全部逐字出自我寫的提示詞：

1. ⚠⚠ **次要角色絕不可以靠「畫淡」** ← `small and lightly drawn … paler colour`。
   次要只能靠**小、位置、被前景遮住**。
2. ⚠⚠ **「老」是結構老，不是表面爛** ← `visible repair patches and soft weathering`。
3. ⚠⚠ **「背景簡單」不等於「畫面空」** ← 為了守硬規格 5，把一整面淺灰牆放進左半。

### 第二版錯在哪（使用者 2026-08-22）

> 「氛圍好很多了……**留白太多**……人物的動作、病人來的那個樣子**太小了**，
> 　放在訊息縮圖上還要放大會模糊，還是要**再聚焦一點**。」

⚠⚠ **關鍵是：這不是「把人畫大一點」，是「把鏡頭推進去」。**
第二版的人其實已經佔了畫面高的 47%，但**整組門口只佔畫面寬的 36%**，
左邊 44% 是一片密度只有右邊三分之一的牆與路。縮到 250px 之後臉只剩 9 個像素 ——
**原檔就沒有那麼多像素在臉上，放大當然糊。**
所以第三版把那片空牆**裁掉**，人從頭到膝入鏡，頭放大到畫面高的六分之一。

---

## 第四版（現行）—— 回到「三組人各自在做一件事」

**第三版被退回**（2026-08-22）：「比上一個還安靜」「像是診所人員在對外歡迎」
「所有病人都是老太太」「跟畫面那個活潑度差很多」。通則已寫進
ILLUSTRATION.md 第十一之二節。**這一版的設計依據是使用者自己那張圖的實測**：

把參考圖裁成 1.91:1、縮到真實的 250px（`drafts/og-crop-test.mjs`）：

| 裁法 | 250px 下 | 大人全身佔畫面 |
| --- | --- | --- |
| **門口那一段（三組人）** | ✅ 讀得出門、光、三組互動 | **69~70%**（頭約 14px） |
| 老夫婦與學生那一段 | ⭕ 活，但看不出是診所 | 70% |
| 含二樓的大景（十幾個人） | ❌ 糊成一排小點 | 約 45% |

**所以人數不是問題，站法才是** —— 六個人分成三組、排成一條橫帶、有一個亮著的門
當中心，在 250px 下照樣讀得出來。§11 硬規格第 3、4 條已照這個實測改寫。

### 第四版的取景與卡司

- **取景**＝參考圖「門口那一段」：一個開間、亮著的門在中央偏右、人排成一條橫帶。
- **六個人、三組，每組各做自己的事，彼此不互看：**
  1. **中央（主組，最大）**：穿刷手服的診所人員站在騎樓上，和**牽腳踏車停下來的老先生**
     講話 —— 是街坊在聊天，不是招呼客人。
  2. **左**：年輕媽媽帶著五歲小男孩，小孩踮腳伸手指著亮著的門，媽媽微彎腰跟著看。
  3. **右緣**：兩位同事邊走邊聊（一位白袍、一位刷手服，手上拿飲料），
     一個騎腳踏車的女學生從他們前面經過、被右緣裁掉。
- **病人不再全是老太太**：老先生、年輕媽媽、小男孩、女學生，四種人。
- **明令不准有兩個長得像的人**（第三版畫出兩個一模一樣的老太太）。
- **明令沒有人做迎賓手勢**。
- **加回參考圖裡那種短的手繪白色動作線**（人物旁邊、表示有人在動），
  ⚠ 仍然不准從嘴巴或身上長出來。
- **色牌的安靜區縮小並移到最左**：左 34% × 下 30%＝騎樓地面 ＋ 一台被裁掉一半的
  停放機車（大塊、沒有臉沒有手）。⚠ 合成之後要用 250px 再看一次。

## 第三版相對第二版改了什麼

1. **鏡頭推近一大步**：屋簷、二樓、左邊那片牆全部裁出畫面外，門口那一組**填滿畫面**。
2. **人從頭到膝入鏡**，身高約畫面高的 85%，**頭 ≈ 畫面高的 1/6**
   （250px 卡上約 22px，第二版是 9.6px，**放大 2.3 倍**）。
3. **二樓窗口那位鄰居拿掉** —— 這個鏡頭放不下，強留只會又變成小人。剩三個人。
4. **左下那塊安靜區改成「婦人的背影＋掃過的地面」**（硬規格 8 本來就允許
   「大面積的衣服」），不再是空牆。⚠ 色牌會疊在她的背與地面上，
   **合成之後要用 250px 再看一次**。
5. **老屋、乾淨、同一種線、暖光門口、無字**這幾條**逐字保留**（第二版驗證過的東西不要動 ——
   ILLUSTRATION.md 第七節第 19 條：改圖只換出問題的那一段）。

> ⚠ 生成時**把第二版那張圖一起附上當風格參考**，並註明：
> 「**保留這張的畫風、乾淨程度、配色與光線**，只把鏡頭推近、人物放大。」

## 第五版（現行）—— 立面換成真的芳仁 ＋ 有人回應小孩

**第四版使用者：「這個很棒我非常喜歡」**，只提兩件：

1. **左邊小孩的視線與動作沒有人回應** —— 他指定：**最右邊那兩個醫療人員來回應**，
   「一個對著小孩招手，另一個會意地笑著對小孩和媽媽」。
   ⚠⚠ 這修掉第四版一條我自己寫的規則：`each group … not looking at the others`。
   **通則：三組各做各的事會活，但如果有一組做出「指向另一組」的動作（指、喊、招手），
   就一定要有人接。沒人接的指向動作，看起來是那個人在自言自語。**
2. **診所的外觀是有實景照的，可以拿照片的局部來當插圖背景。**

### ⚠⚠ 前四版的立面全是我編的，不是芳仁

實景照拆出來，這棟樓真正的辨識特徵是**六件**，一件都對不上我前四版寫的
「木頭雙開門＋紅磚柱」：

| # | 真的長這樣 | 我前四版寫的 |
| --- | --- | --- |
| 1 | 一樓**退縮成騎樓**，兩根**深咖啡色金屬方柱**撐起上面樓層 | 紅磚柱 |
| 2 | 整面**落地玻璃**（深色細框），玻璃後看得到候診區的木家具與暖燈 | 木頭雙開門 |
| 3 | 招牌是**一條細鋼樑上的細白字**（左英文、右中文） | 空白招牌板 |
| 4 | 二、三樓是**清水模灰牆** ＋ **成對突出的深色金屬窗盒**（往外挑，像盒子） | 紅磚與奶油色灰泥 |
| 5 | 頂樓有**深出挑的鋼構大屋簷** | 淺雨庇 |
| 6 | 隔壁右邊是**紅招牌的火鍋店棚架**，左邊是老瓦房 | 沒有鄰居 |

### 抓背景：抓哪一段、怎麼抓（`drafts/og-photo-crop.mjs`）

**抓「騎樓帶」** —— 從招牌那條橫樑到人行道，上緣留一排窗盒的下半。
正面照（7322×6271）上的座標是 **`1853, 4108, 3727, 1950`**，
剛好是 1.91:1，縮成 1200×628 不必變形。

為什麼是這一段：**分享卡的人是站在一條橫帶上的**，而這一段同時有
柱、玻璃、招牌樑、窗盒、人行道 —— 五樣辨識物齊了，而且高度正好吃掉畫面上三分之二。

### 用照片還是重畫？兩案，數字在這裡

| | 平均彩度 S | 平均明度 L |
| --- | --- | --- |
| 第四版那張插畫 | **43.6** | 61.6 |
| 實景照（原） | **10.6** | 54.0 |
| 實景照（提亮＋暖罩＋去雜訊後） | **12.4** | 62.9 |

⚠⚠ **明度可以拉齊，彩度拉不上來** —— 那棟樓本來就是清水模灰＋深咖啡鋼＋深色玻璃，
**它沒有顏色可以提**。把照片當底、插畫人物疊上去，兩邊彩度差 3.5 倍，人會像貼紙。

- **A 案（建議）：照片當參考圖，插畫重畫那棟樓。**
  上面那六個特徵原封不動搬進插畫，用我們的線與暖色重畫；
  暖色不從牆來，從**玻璃裡透出來的燈光、人物的衣服、隔壁的紅棚架**來。
  好處：認得出是芳仁，而且和站上另外十張插畫是同一家人。
  ⚠ 這正是 ILLUSTRATION.md 第十之一節那條「形狀不要用文字描述，用參考圖」。
- **B 案：照片局部真的當底，插畫人物疊上去**（ILLUSTRATION.md ⑪ 的照片拼貼）。
  要先做三件事：提亮到 L≈63、罩一層暖色、把玻璃裡的反射與室內雜訊糊掉；
  人物要加一圈淺描邊才站得住。**而且要先確認照片的授權** ——
  那看起來是建築攝影師拍的（打光與透視矯正都是專業的），
  不是診所隨手拍的（CLAUDE.md 第一節第 7 條）。

**第五版的提示詞走 A 案**，並把那張騎樓帶的裁切當參考圖一起餵進去。


## 第六版（現行）—— 白天、白袍、轉角

第五版使用者三件回饋（2026-08-22）：**「看起來很像黃昏，我喜歡白天」「正中間那位穿刷手服的
幫他加個白袍」「診所在轉角，右邊沒有騎樓、右邊是街道，這部分再忠實對照一下」。**

### ⚠⚠ 「像黃昏」是一句話造成的，而且量得出來

| | 濃琥珀（h20~55 且 S>35）佔全圖 | 亮處是琥珀的比例 |
| --- | --- | --- |
| 第四版（使用者說很棒） | 44% | 85.5% |
| 第五版（被說像黃昏） | **26.7%** | 82% |

**橘色其實變少了** —— 所以成因不是「多暖」，是**「誰比較亮」**。
第五版的提示詞寫了 `the glass GLOWS warm and is the brightest thing in the picture`，
但**白天室外一定比室內亮**，玻璃從外面看是暗的、反著天光；
**只有傍晚以後，室內的燈才會變成畫面裡最亮的東西**。

⚠⚠ **通則（可推廣到任何有室內外的插畫）：時間是靠「室內外誰比較亮」讀出來的，
不是靠色溫。** 要畫白天就把「室外比室內亮」寫成一段獨立的、放在最前面的指令。

### 轉角：放大實景照確認過

診所右緣**確實是轉角** —— 建築到那裡結束，接的是一條橫向的街／空地，
**劉家酸白菜火鍋的棚架在對面更遠處，不是貼著隔壁**。
第五版寫的「右緣有隔壁店家的紅棚架」是錯的，第六版改成：
右邊＝建築的角柱 → 側街 → 遠處淡淡的深棕紅棚架與幾台車；**騎樓只在正面**。
左邊＝低矮的老瓦房（照片上確實貼著）。


### 第六版出圖的量測（2026-08-22，六版裡第一次幾乎全過）

| | 第二版 | 第五版 | **第六版** | 門檻 |
| --- | --- | --- | --- | --- |
| 無彩空白 | 0.9% | — | **0.1%** ✅ | < 5% |
| 邊緣密度 | 25.0% ❌ | — | **38.9%** ✅ | ≥ 30% |
| 左半密度 | 11.5% ❌ | — | **36.1%** ✅ | ≥ 20% |
| 每個人的線相差 | 10.8 ✅ | — | **6.1 階** ✅ | < 20 階 |
| 大人高佔畫面 | 47.3% ❌ | — | **58~66%** ⭕ | ≈ 70%（參考圖實測） |
| 濃琥珀占全圖（白天感） | 44%（v4） | 26.7% | **19.9%** ✅ | 越低越像白天 |

⚠ **人物高度 58~66% 略低於參考圖的 69~70%**，250px 上大人 77~87px、頭約 12~13px。
還在可讀範圍，但**下一版可以再放大一點**（把畫面下緣再往上收一點就有了）。

### ⚠ 轉角還沒定案（2026-08-22）

使用者看第六版：**「右邊不是轉角欸」**，並補了兩張照片（轉角 3/4 視角 ＋ 更寬的正面）。
**兩張照片我讀出來的方位互相矛盾**，所以還沒改提示詞：

- 3/4 那張：長向立面（有白盆栽與穿堂）**往右後方退**，corner 在正面的右手邊。
- 更寬的正面那張：診所左邊貼著低矮老瓦房，右邊是一條巷子、對面是劉家火鍋。

**待使用者確認**：站在馬路上正對大門時，轉角在左手邊還是右手邊。
在確認之前的安全做法：**兩端都停在建築上、不畫轉角**（畫面左右緣都落在立面之內）。

### 順手修掉三件照片上對不上的（使用者沒提）

1. 柱子是**三根、兩個開間**（前幾版寫兩根）。
2. 二樓是**直立細長窗**，成對嵌在往外挑的深色金屬窗盒裡（前幾版只寫「窗盒」）。
3. 玻璃白天是**深灰綠、反著天光**，不是暖黃發光。

提示詞逐字見下面那一段（第六版）。

## 提示詞（第五版，已作廢，第六版是從這一份改的）


> ⚠ 生成時附**兩張**參考圖，並講清楚各是什麼：
> ① **第四版那張插畫** —— 「畫風、配色、線的實度、人物比例、氣氛，全部照這張」
> ② **`drafts/og-facade-ref.png`（騎樓帶的照片裁切）** ——
> 　 「**這是這間診所真正的樣子，建築照這張畫**：騎樓方柱、大面玻璃、招牌橫樑、
> 　 清水模灰牆、突出的深色窗盒。**只參考建築，不要參考它的顏色調性、不要照抄照片質感、
> 　 招牌上的字一律拿掉。**」

```
Editorial illustration for a social-media preview card, 1200 x 628 landscape (1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Big simple shapes, no fine detail, no panels, no speech
bubbles, no insets, no icons, no arrows, no diagrams.

THE FEELING — an ordinary weekday afternoon on a quiet lane in a small town in central
Taiwan. The dental clinic is simply part of this street, and its people are OUT ON THE
PAVEMENT among the neighbours. SEVERAL SMALL THINGS ARE HAPPENING AT THE SAME TIME.
Nobody is posing, nobody is performing a welcome, nobody looks at the viewer. The mood is
warm, easy and alive — the opposite of a quiet, empty, staged picture.

THE BUILDING — this is a REAL building; follow the photograph reference closely for its
architecture, but draw it entirely in the illustration style described below, never as a
photograph. It is a renovated old townhouse, immaculately kept and quietly modern:
  • the ground floor is SET BACK under the upper storeys, forming a covered walkway
    carried by TWO SQUARE COLUMNS clad in dark chocolate-brown metal;
  • between the columns the front is ONE BIG SHEET OF GLASS in slim dark frames, and
    through it we can see the softly lit waiting area — warm lamplight, pale wood
    furniture — so the glass GLOWS warm and is the brightest thing in the picture;
  • a slim dark steel BEAM runs across above the glass carrying a completely BLANK sign
    panel — no letters of any kind;
  • above that, a smooth PALE WARM-GREY CONCRETE wall, and along it a ROW OF DARK METAL
    WINDOW BOXES that project outward from the wall like open boxes, in pairs — this is
    the most recognisable feature of the building and must be clearly drawn;
  • the picture is cropped by the TOP EDGE just above those window boxes: no roof, no
    sky.
Old means renovated and cared for: no peeling paint, no cracks, no stains, no rust, no
litter, nothing derelict.
NEIGHBOURS — at the right edge, cropped, the corner of the next shop: a simple awning in
a warm red, no writing on it. At the left edge, cropped, the low tiled roof of an old
neighbouring house. They show this is a real street, nothing more.

FRAMING — a straight-on street-level view. The lit glass front sits at the CENTRE-RIGHT
and is the anchor of the picture. The people stand along the covered walkway and the
pavement in one horizontal band across the lower two thirds.

SCALE — THE ADULTS ARE BIG: each standing adult is about 70% of the picture height, drawn
from head to foot. Their heads must be large enough to read as faces in a small thumbnail.

THE CAST — SIX people in THREE groups, spread left to right with clear gaps between them:
  1. CENTRE, in front of the lit glass — THE MAIN GROUP, the largest figures. A CLINIC
     MEMBER in pale sage-green scrubs stands talking with an OLD MAN who has stopped
     beside his bicycle, one hand on the handlebar and the other raised mid-sentence.
     They face each other in three-quarter view, in the middle of an easy everyday
     conversation between neighbours.
  2. LEFT — a YOUNG MOTHER in her thirties with a SMALL BOY of about five. The boy is up
     on his toes, arm stretched out, waving and pointing across towards the two clinic
     colleagues at the right; he is delighted. His mother bends slightly, holding his
     other hand, looking where he points and smiling.
  3. RIGHT — TWO CLINIC COLLEAGUES walking along the pavement, one in a white coat over
     scrubs, the other in scrubs holding a cold drink. THEY BOTH NOTICE THE BOY AND
     ANSWER HIM: the one in the white coat has turned towards him and is WAVING BACK,
     hand up and open, smiling; the other has turned her head to the boy and his mother
     with a knowing, amused smile, as if to say "there he is again". Their bodies still
     face the direction they are walking; only their heads and one arm turn.
     A SCHOOLGIRL rides past on a bicycle in front of them, cut off by the right edge.
THE BOY'S WAVE AND THE COLLEAGUES' ANSWER ARE THE ONE CONNECTION ACROSS THE PICTURE.
Everyone else stays inside their own group. Nobody is greeting a customer, nobody holds
out an inviting palm, nobody bows, nobody queues, nobody is being escorted inside.

EVERYONE LOOKS DIFFERENT — no two people in this picture may look alike. Give each a
clearly different age, build, hairstyle and clothing colour: the old man is thin with
short grey hair and a brown polo shirt; the young mother has shoulder-length dark hair, a
coral top and jeans; the small boy has a round face and a pale blue tee; the clinic member
in the centre wears her hair tied back; the colleague in the white coat has short hair;
the colleague with the drink has a low ponytail; the schoolgirl has a high ponytail, white
school shirt and navy skirt. There is only ONE old person. Never draw the same face twice.

EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR. A figure further away is made secondary ONLY by being smaller or
partly overlapped — NEVER by pale, thin, faint, washed-out, semi-transparent or
outline-only drawing. Nobody wears a mask, nobody holds any dental instrument.

WHAT ELSE IS IN THE PICTURE — a few large, simple things: two healthy potted plants
against the wall, a low wooden stool, the old man's bicycle, a scooter parked and cropped
by the LEFT edge, and the warm light from the glass spilling onto the walkway. Nothing
small or fussy: no posters, no meter boxes, no hanging cables, no bins, no banners.

MOVEMENT MARKS — small white hand-drawn strokes, two or three short lines at a time,
placed just outside a moving thing: beside the boy's waving arm, beside the schoolgirl's
wheel, beside a waving hand. Chalk-like, light and quick. They NEVER emerge from anyone's
mouth, nose or body, never loop, never cross, never form a long ribbon.

KEEP THE LOWER LEFT CORNER QUIET — the rectangle covering the LEFT 34% of the width and
the BOTTOM 30% of the height holds only the swept pavement, a soft shadow and the cropped
body of the parked scooter: large calm shapes, no face, no hands, no small detail. Quiet
does NOT mean empty or colourless.

FILL THE FRAME — the picture must never look empty or still. No large flat blank field
anywhere; no single area of one flat colour may take up more than about a tenth of the
picture.

LIGHT — clean, bright mid-afternoon daylight outside, gentle and even. The ONE warm light
is the glow from inside the glass front, falling on the people nearest it and on the
walkway floor. NOT a sunset, no orange sky, no long orange shadows, no night scene, no
dramatic contrast, no gloom.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue, no
smooth decorative gradients. A fine even paper grain over the whole image. The building is
drawn the same way as the people — hand-drawn and simplified, NEVER photographic, no
photo texture, no reflections, no perspective distortion.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat tone
with no modelling. A face carries only six things — its outline, eyes, eyebrows, nose,
mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes, no
nose-to-mouth lines, no blush. Eyes are simple dots or short lines.

COLOUR — clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture carries
real colour. The building itself is quiet — pale warm grey concrete, dark chocolate-brown
metal columns and window boxes — so THE COLOUR MUST COME FROM EVERYTHING ELSE: the warm
amber glow through the glass and the pale honey wood inside; clinic scrubs in pale sage
(#bfd7b7 with #99b899 in the folds); the old man in warm brown; the young mother in muted
coral; the small boy in pale blue; the schoolgirl in white and navy; deep green foliage; a
warm red awning at the right edge; a warm sandy pavement. Keep the concrete WARM grey,
never a cold blue-grey, and never let the whole picture go grey — at least seven distinct
colours must be readable at thumbnail size. Hair is very dark and warm-toned (#374840,
shading to #283930, with #404f47 highlights) — never flat pure black, never brown or
auburn, except the old man's grey hair. Clothes are never flat single-tone shapes: two or
three tones each, with folds, collar, cuffs and hem drawn.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGN PANEL ABOVE THE GLASS IS
COMPLETELY BLANK, and so is the neighbour's awning — even though the real building has
lettering there, leave both surfaces plain and empty. The scooter, the drink cup, the
school bag and all clothing carry no writing.

AVOID — a still, quiet, staged or empty picture; only one thing happening; a child
pointing or waving with nobody answering him; a shop-front welcome, an inviting open palm,
a bow, a queue, a customer being received; two people who look alike; every patient being
elderly; a faded, pale, translucent or ghostly figure; any person drawn with lighter or
thinner lines than the others; small distant figures; large empty walls or pavement;
photographic rendering of the building, photo texture, glass reflections, lens
perspective; peeling paint, cracks, stains, rust, litter; a derelict or melancholy
atmosphere; a cold grey overall cast; panels or split screens; speech bubbles; magnified
insets; arrows or icons; a dense crowd or more than six people; anything small and fussy
in the lower-left corner; teeth, tooth models, dental chairs, instruments, X-rays or
clinical equipment; masks; anyone looking at the viewer; greyscale; photorealism; thick
uniform black outlines; chrome or iridescent gradients; faceless figures, oversized heads
or noodle limbs; blood, pain or fear; sunset or night lighting.
```

## 第四版的提示詞（使用者說「很棒」，第五版是從這一份改的，只換了立面與右邊那組）

<details><summary>展開</summary>

## 提示詞（第四版，逐字，可直接複製）

> ⚠ 生成時**把使用者那張巷弄參考圖一起附上**，並註明：
> 「**參考這張的畫風、乾淨程度、配色、光線，以及人與人之間那種自然流動的關係**；
> 　不要參考它的寬度與人數 —— 這一張只放三組人。」

```
Editorial illustration for a social-media preview card, 1200 x 628 landscape (1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Big simple shapes, no fine detail, no panels, no speech
bubbles, no insets, no icons, no arrows, no diagrams.

THE FEELING — an ordinary weekday afternoon on a quiet lane in a small town in central
Taiwan. The dental clinic is simply part of this street, and its people are OUT ON THE
PAVEMENT among the neighbours. SEVERAL SMALL THINGS ARE HAPPENING AT THE SAME TIME, each
group busy with its own moment and not looking at the others. Nobody is posing, nobody is
performing a welcome, nobody looks at the viewer. The mood is warm, easy and alive — the
opposite of a quiet, empty, staged picture.

FRAMING — a straight-on street-level view of ONE bay of a fifty-year-old terraced
townhouse that has been renovated into a small dental clinic. The WIDE WOODEN DOUBLE DOOR
stands OPEN at the CENTRE-RIGHT with warm light spilling out of it; that lit doorway is
the anchor of the picture. The building is cropped by the TOP EDGE just above the door —
no upper storey, no sky, no long row of shops. The people stand along the pavement in one
horizontal band across the lower two thirds of the picture.

SCALE — THE ADULTS ARE BIG: each standing adult is about 70% of the picture height, drawn
from head to foot. Their heads must be large enough to read as faces in a small thumbnail.

THE CAST — SIX people in THREE separate groups, spread left to right with clear gaps
between the groups:
  1. CENTRE, beside the lit doorway — THE MAIN GROUP, the largest figures. A CLINIC
     MEMBER in pale sage-green scrubs stands on the pavement talking with an OLD MAN who
     has stopped and is standing beside his bicycle, one hand on the handlebar and the
     other raised mid-sentence. They face each other in three-quarter view, plainly in
     the middle of an easy everyday conversation between neighbours.
  2. LEFT — a YOUNG MOTHER in her thirties with a SMALL BOY of about five. The boy is up
     on his toes, arm stretched out, pointing at the open door, pleased with himself; his
     mother bends slightly, holding his other hand and looking where he points.
  3. RIGHT EDGE — TWO CLINIC COLLEAGUES walking along the pavement together in
     conversation, one in a white coat over scrubs, the other in scrubs and holding a
     cold drink; and a SCHOOLGIRL riding past on a bicycle in front of them, cut off by
     the right edge of the picture. These figures are smaller because they are further
     away, but drawn just as solidly.

NOT A WELCOME — this is NOT a shop greeting a customer. Nobody stands at the door
receiving anyone, nobody holds out an open palm to invite someone in, nobody bows, nobody
queues, nobody is being escorted inside. The clinic people are talking, walking and
getting on with their afternoon, exactly like the neighbours around them.

EVERYONE LOOKS DIFFERENT — no two people in this picture may look alike. Give each person
a clearly different age, build, hairstyle and clothing colour: the old man is thin with
short grey hair and a brown polo shirt; the young mother has shoulder-length dark hair and
a coral top with jeans; the small boy has a round face and a pale blue tee; the clinic
member in the centre has her hair tied back; the colleague in the white coat has short
hair; the schoolgirl has a ponytail, a white school shirt and a navy skirt. There is only
ONE old man and NO two people of the same age and sex. Never draw the same face twice.

EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR. A figure further away is made secondary ONLY by being smaller or
partly overlapped — NEVER by pale, thin, faint, washed-out, semi-transparent or
outline-only drawing. No figure may look like a ghost, a reflection or an unfinished
sketch. Nobody wears a mask, nobody holds any dental instrument.

THE BUILDING — old but IMMACULATELY KEPT: recently renovated, freshly painted, swept and
cared for. Old means the SHAPE is old — a low terraced townhouse with wide wooden doors
and neat terracotta brickwork framing them, a covered walkway with a square pillar. Old
must NEVER mean shabby: absolutely no peeling paint, no flaking or patched plaster, no
cracks, no water stains, no mould, no rust, no litter, no gloom, nothing derelict or
haunted. Above the door there is a BLANK signboard.

WHAT ELSE IS IN THE PICTURE — a few large, simple things, all of them ordinary street
life: two healthy potted plants beside the door, a low wooden stool, the old man's
bicycle, a parked scooter cropped by the LEFT edge, and the warm pool of light on the
pavement. Nothing small or fussy: no posters, no meter boxes, no hanging cables, no bins,
no banners, no signage, no crowd.

MOVEMENT MARKS — small white hand-drawn strokes, two or three short lines at a time,
placed just outside a moving thing to show it is in motion: beside the boy's raised arm,
beside the schoolgirl's wheel, beside a walking colleague's shoulder. Chalk-like, light
and quick. They NEVER emerge from anyone's mouth, nose or body, never loop, never cross,
and never form a long ribbon.

KEEP THE LOWER LEFT CORNER QUIET — the rectangle covering the LEFT 34% of the width and
the BOTTOM 30% of the height holds only the swept pavement, the long soft shadow and the
cropped body of the parked scooter: large calm shapes, no face, no hands, no small
detail. Quiet does NOT mean empty or colourless — the ground carries warm colour and
gentle shading.

FILL THE FRAME — the picture must never look empty or still. Every part carries something
large: the three groups of people, the open door and its warm light, the brick surround,
the plants, the bicycle, the scooter, the pavement. No large flat blank field anywhere;
no single area of one flat colour may take up more than about a tenth of the picture.

LIGHT — clean, bright mid-afternoon daylight, gentle and even, with soft shadows on the
pavement. The ONE warm light is the glow from the open doorway. NOT a sunset, no orange
sky, no long orange shadows, no night scene, no dramatic contrast, no gloom.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue,
no smooth decorative gradients. A fine even paper grain over the whole image.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat tone
with no modelling. A face carries only six things — its outline, eyes, eyebrows, nose,
mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes, no
nose-to-mouth lines, no blush. Eyes are simple dots or short lines.

COLOUR — clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture carries
real colour rather than bare paper. At least seven distinct colours must be readable at
thumbnail size, each assigned to its own thing: warm cream plaster; muted terracotta
brick; warm honey wood doors and stool; clinic scrubs in pale sage (#bfd7b7 with #99b899
in the folds); the old man in warm brown; the young mother in muted coral; the small boy
in pale blue; the schoolgirl in white and navy; deep green foliage; a warm grey pavement;
the amber glow inside the doorway. Hair is very dark and warm-toned (#374840, shading to
#283930, with #404f47 highlights) — never flat pure black, never brown or auburn, except
the old man's grey hair. Clothes are never flat single-tone shapes: two or three tones
each, with folds, collar, cuffs and hem drawn. Colour throughout — never greyscale, never
a chilly blue-grey cast, and no large area left as bare neutral pale.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGNBOARD ABOVE THE DOOR IS
COMPLETELY BLANK — a plain empty panel with no lettering, no symbol, no house number and
no clinic mark of any kind. The scooter, the drink cup, the school bag and all clothing
are blank as well. Where writing would normally appear, leave the surface plain.

AVOID — a still, quiet, staged or empty picture; only one thing happening; a shop-front
welcome, an inviting open palm, a bow, a queue, a customer being received; two people who
look alike; two older women; every patient being elderly; a faded, pale, translucent,
ghostly or outline-only figure; any person drawn with lighter or thinner lines than the
others; small distant figures; empty walls, empty pavement or empty sky taking up a large
part of the picture; peeling or flaking paint, patched or cracked plaster, water stains,
damp, mould, rust, cobwebs, litter, weeds; a derelict, abandoned, eerie or melancholy
atmosphere; panels or split screens; speech bubbles; magnified circular insets; arrows or
icons; a dense crowd or more than six people; anything small and fussy in the lower-left
corner; teeth, tooth models, dental chairs, instruments, X-rays or clinical equipment of
any kind; masks; anyone looking at the viewer; greyscale; photorealism; thick uniform
black outlines; chrome or iridescent gradients; faceless figures, oversized heads or
noodle limbs; blood, pain or fear; sunset or night lighting.
```

</details>

## 第三版的提示詞（已作廢，留著看推導）

<details><summary>展開</summary>

```
Editorial illustration for a small social-media preview card, 1200 x 628 landscape
(1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Everything in it must still be readable at that size, so the
picture is CLOSE UP and TIGHTLY FRAMED: three people meeting at a doorway, drawn LARGE.
ONE single scene, ONE focal point. Do NOT divide the image into panels. No speech
bubbles, no insets, no icons, no arrows, no diagrams.

THE MOMENT — An older woman arrives at her neighbourhood dental clinic and is met at the
open door by the dentist, who is greeting her and welcoming her in. A second clinic
member stands a step inside the lit doorway. It is an ordinary, friendly afternoon on a
quiet lane in a small town in central Taiwan.

FRAMING — CLOSE. We stand only a few steps away. The OPEN WOODEN DOUBLE DOOR and its
brick surround fill the RIGHT-HAND 60% of the picture and run from the top edge to the
bottom edge; the canopy, the upper storey and the rest of the street are OUTSIDE the
frame. On the left edge we see only a narrow slice of the building — one clean plaster
wall, one large potted plant and the swept pavement. There is NO wide empty wall, NO
distant view, NO sky.

THE PEOPLE — exactly THREE, all East Asian (Taiwanese), drawn BIG:
  • The OLDER WOMAN, in her sixties, arriving. She stands in the LEFT-CENTRE of the
    picture, seen from three-quarters BEHIND, so we read her back, her shoulder and the
    side of her cheek but not her full face. A cloth shopping bag hangs from the hand
    furthest from us. She is stepping towards the door, her near shoulder turned into it.
  • The DENTIST in pale sage-green scrubs stands in the doorway facing her, body open and
    turned towards her, one hand on the door edge and the other extended in a small
    welcoming gesture towards the woman, palm up, at about waist height. She is looking
    at the woman, smiling with her mouth closed. She stands in the warm light of the
    doorway.
  • A CLINIC ASSISTANT in the same pale sage-green, one step further inside the doorway,
    half hidden behind the other door leaf, also turned towards the woman. Smaller only
    because she is further away.
SIZE — the woman and the dentist are drawn from the HEAD DOWN TO JUST BELOW THE KNEE,
cropped by the bottom edge of the picture. Standing, each of them fills about 85% of the
picture height, and EACH HEAD IS ABOUT ONE SIXTH OF THE PICTURE HEIGHT — big enough for
the face to read clearly in a small thumbnail. The two of them, plus the space of the
doorway between them, take up at least two thirds of the width of the picture.
EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR. A figure further away is made secondary ONLY by being smaller or
partly overlapped — NEVER by pale, thin, faint, washed-out, semi-transparent or
outline-only drawing. No figure may look like a ghost, a reflection or an unfinished
sketch.
Nobody wears a mask, nobody holds any dental instrument, nobody looks at the viewer.

THE BUILDING — old but IMMACULATELY KEPT: recently renovated, freshly painted, swept and
cared for. Old means the SHAPE is old — a low terraced townhouse with wide wooden doors
and neat terracotta brickwork framing them. Old must NEVER mean shabby: absolutely no
peeling paint, no flaking or patched plaster, no cracks, no water stains, no mould, no
rust, no litter, no gloom. Nothing may look derelict, abandoned or haunted. Above the
door, cropped by the top edge, there is a BLANK signboard. The brickwork is crisp and in
good order; the plaster is smooth and evenly painted warm cream.

WHAT ELSE IS IN THE PICTURE — very little, and all of it large: ONE healthy potted plant
at the left, ONE low wooden stool beside the door, and the warm pool of light on the
pavement. Nothing else — no posters, no meter boxes, no hanging cables, no bins, no
banners, no signage, no bicycles, no cars, no crowd.

KEEP THE LOWER LEFT QUIET — the rectangle covering the LEFT 46% of the width and the
BOTTOM 40% of the height must stay calm and uncluttered: it holds only the older woman's
back and coat as one large soft area of colour, and the swept pavement beside her. No
face, no hands, no small objects, no busy detail and no hard edges in that rectangle.
Quiet does NOT mean empty or colourless — the coat and the ground both carry warm colour
and gentle shading.

FILL THE FRAME — the picture must NOT look empty. Every part of it carries something
large: the two big figures, the open door and its warm interior light, the brick
surround, the plant, the pavement. No large flat blank field anywhere; no single area of
one flat colour may take up more than about a tenth of the picture.

ATMOSPHERE LINES — two or three LONG soft white hand-drawn arcs drift across the upper
corner of the picture only, chalk-like, thinning to dry flecks at their ends. They never
touch or emerge from any person's mouth, nose, hands or body, and never loop or cross.

LIGHT — Clean, bright mid-afternoon daylight, gentle and even, with soft shadows. The ONE
warm light in the picture is the glow coming out of the open doorway, falling on the
dentist and pooling on the pavement between the two women. NOT a sunset, no orange sky,
no long orange shadows, no night scene, no dramatic contrast, no gloom.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a
little loose and not always meeting the line. Flat fills with two or three tones per hue,
no smooth decorative gradients. A fine even paper grain over the whole image.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat tone
with no modelling. A face carries only six things — its outline, eyes, eyebrows, nose,
mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes, no
nose-to-mouth lines, no blush. Eyes are simple dots or short lines. Because the faces are
large here, keep them SIMPLE — do not add extra detail just because there is room.

COLOUR — Clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture
carries real colour rather than bare paper. At least six distinct colours must be
readable at thumbnail size, each assigned to its own thing: warm cream plaster; muted
terracotta brick; warm honey wood doors and stool; the dentist's and the assistant's
scrubs in pale sage (#bfd7b7 with #99b899 in the folds); the older woman in muted dusty
rose with warm grey trousers; deep green foliage in the pot; a warm grey pavement; the
warm amber glow inside the doorway. Hair is very dark and warm-toned (#374840, shading to
#283930, with #404f47 highlights) — never flat pure black, never brown or auburn. Clothes
are never flat single-tone shapes: two or three tones each, with folds, collar, cuffs and
hem drawn. Colour throughout — never greyscale, never a chilly blue-grey cast, and no
large area left as bare neutral pale.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGNBOARD ABOVE THE DOOR IS
COMPLETELY BLANK — a plain empty panel with no lettering, no symbol, no house number and
no clinic mark of any kind. The door glass, the shopping bag and all clothing are blank
as well. Where writing would normally appear, leave the surface plain and empty.

AVOID — a wide or distant view; small figures; empty walls, empty pavement or empty sky
taking up a large part of the picture; a faded, pale, translucent, ghostly or
outline-only figure; any person drawn with lighter or thinner lines than the others;
peeling or flaking paint, patched or cracked plaster, water stains, damp, mould, rust,
cobwebs, litter, weeds; a derelict, abandoned, eerie or melancholy atmosphere; a thin or
washed-out picture; panels or split screens; speech bubbles; magnified circular insets;
arrows, icons or diagram lines; a crowded street; more than three people; anything busy
in the lower-left quarter of the image; teeth, tooth models, dental chairs, instruments,
X-rays or clinical equipment of any kind; masks; anyone looking at the viewer; greyscale;
photorealism; thick uniform black outlines; chrome or iridescent gradients; faceless
figures, oversized heads or noodle limbs; blood, pain or fear; sunset or night lighting.
```

---

</details>

## 色牌（後製疊上去，不畫進圖裡）

左下角：`#3f654a` 的牌子，兩行 —— 「一般牙科・定期檢查」（大）／標誌＋「芳仁牙醫診所」（小）。
⚠ 九個字是七科裡最長的，版面要先用它試（第十一節）。
⚠ 第三版的左下角是婦人的背影，**色牌合成之後一定要用 250px 再看一次**。

## 管線

原檔（≥1200 寬）放 `drafts/og-topic-general-src.png`，用 `tools/hero-resize.mjs` 的
同一條 Chromium 路徑產出 `assets/og-topic-general.jpg`，畫布 **1200×628**
（不是文章 HERO 的 2000×1116）；`tools/topics.mjs` 的 `seoBlock` 補上
`og:image`／`:width`／`:height`／`:alt`，同時**刪掉 `index.html` 手寫的那組 `og:image*`**
（重複的 og 屬性爬蟲取第一個，不刪的話七頁還是顯示首頁那張夜景）。

## 交件前要過的門檻（插畫師自己跑，不過就不拿出來）

| | 門檻 | 第二版 |
| --- | --- | --- |
| 無彩空白 | < 5% | 0.9% ✅ |
| 邊緣密度 | ≥ 30% | 25.0% ❌ |
| 每個人的線相差 | < 20 階 | 10.8 ✅ |
| 左半密度 | ≥ 20% | 11.5% ❌ |
| 主要人物高佔畫面 | ≥ 75% | 47.3% ❌ |
| 250px 卡上頭的高度 | ≥ 20px | 9.6px ❌ |

另外還要看：四邊有沒有烘進去的白框（ILLUSTRATION.md 第七節第 6 條，
`tools/hero-resize.mjs` 會自動擋）、色牌疊上去之後左下角讀不讀得下去。


## 第七版（現行）—— 轉角定案在右手邊 ＋ 提示詞照模型特性重排

**轉角方位使用者確認了**（2026-08-22）：「站在馬路上正對大門時，**轉角在我的右手邊**。」
所以我原本讀照片是對的；第六版被退回是因為**畫出來那張的右邊畫成了隔壁店家的紅棚架**，
不是轉角。第七版把右邊改成真的轉角，而且**讓長向立面入鏡**
（同一種深色突出窗盒 ＋ 三個白色圓筒盆栽 ＋ 側巷往後退）——
那比一條空街道有辨識度得多，證據就在 `drafts/og-corner-ref.png`。

### 這一版由第 10 號（AI Agent 應用專家）重排過，四件事

出圖用 Gemini，所以提示詞的結構跟著改（TEAM.md 第一節第 10 號）：

1. **最要緊的五件事拉到最前面**，編號列出（光線／人的大小／三組同時發生／
   真實建築與轉角／不要有字）。前六版把「白天」寫在中段的 LIGHT 裡，
   第五版就是這樣被吃掉的。
2. **能寫成正面敘述的一律改成正面。** 例如「不要用畫淡來表示遠」改寫成
   「距離只用大小與遮擋表示，每個人都完整上色」。
3. **AVOID 從 20 幾條壓到 11 條**，只留真正致命的。
   理由是 ILLUSTRATION.md 第八節第 6 條那個「概念外溢」——
   在否定句裡重複最多次的東西，反而會跑進畫面。
4. **參考圖標清楚用途**（見下面那張表）。不標用途的參考圖會被整張抄。

### 要餵哪幾張參考圖

| # | 檔案 | 跟模型講什麼 |
| --- | --- | --- |
| ① | `drafts/og-topic-general-v6.jpg` | 「**畫風、配色、線的實度、人物比例與氣氛照這張**，這是已經通過的版本」 |
| ② | `drafts/og-facade-ref.png`（正面騎樓帶） | 「**正面的細節照這張**：三根深色方柱、大面玻璃、招牌橫樑、上方的清水模與突出窗盒。**招牌的字拿掉**，不要抄照片的顏色調性與質感」 |
| ③ | `drafts/og-corner-ref.png`（轉角 3/4 視角） | 「**轉角怎麼轉照這張**：右邊是建築的角，長向立面往右後方退，牆面有同樣的突出窗盒，底下一排白色圓筒盆栽。同樣只參考建築」 |

⚠ 三張是上限。再多會開始互相打架（顏色、構圖、光線各抄一點）。

## 提示詞（第六版，已作廢，第七版是從這一份改的）

> ⚠ 生成時附**兩張**參考圖：① **第四版那張插畫**（`drafts/og-topic-general-v4.jpg`）——
> 「畫風、配色、線的實度、人物比例、氣氛照這張」；② **`drafts/og-facade-ref.png`** ——
> 「建築照這張畫，招牌的字拿掉，不要照抄照片的顏色調性與質感」。

```
Editorial illustration for a social-media preview card, 1200 x 628 landscape (1.91:1).

READ THIS FIRST — THIS IMAGE WILL BE SEEN AT ABOUT 250 PIXELS WIDE, the size of a
thumbnail in a chat message. Big simple shapes, no fine detail, no panels, no speech
bubbles, no insets, no icons, no arrows, no diagrams.

IT IS THE MIDDLE OF A BRIGHT AFTERNOON — READ THIS BEFORE ANYTHING ELSE. Daylight outside
is STRONGER than any light indoors. The pavement, the concrete wall and the sky are the
brightest things in the picture; the glass shopfront is DARKER than the wall around it,
quietly reflecting the pale sky, with only a soft hint of the lit waiting room deep
inside. Shadows are short, soft and slightly cool. This is NOT evening: no glowing orange
windows, no amber light spilling onto the pavement, no golden or sunset cast over the
picture, no lamps as the brightest thing, no dusk sky.

THE FEELING — an ordinary weekday afternoon on a quiet lane in a small town in central
Taiwan. The dental clinic is simply part of this street, and its people are OUT ON THE
PAVEMENT among the neighbours. SEVERAL SMALL THINGS ARE HAPPENING AT THE SAME TIME.
Nobody is posing, nobody is performing a welcome, nobody looks at the viewer. The mood is
warm, easy and alive — the opposite of a quiet, empty, staged picture.

THE BUILDING — this is a REAL building; follow the photograph reference closely for its
architecture, but draw it entirely in the illustration style described below, never as a
photograph. It is a renovated old townhouse, immaculately kept and quietly modern:
  • the ground floor is SET BACK under the upper storeys, forming a covered walkway
    carried by THREE SQUARE COLUMNS clad in dark chocolate-brown metal, making TWO BAYS;
  • between the columns the front is FULL-HEIGHT GLASS in slim dark frames. In daylight
    this glass reads DARK and slightly cool — a deep grey-green, with soft pale
    reflections of the sky across it. Through it, faint and low-contrast, we can just
    make out a calm waiting area: pale wood furniture and a soft warm light far inside.
    The glass must NEVER be a bright glowing orange panel;
  • a slim dark steel BEAM runs across above the glass carrying a completely BLANK sign
    panel — no letters of any kind;
  • above that, a smooth PALE WARM-GREY CONCRETE wall with TALL NARROW VERTICAL WINDOWS
    set in DARK METAL BOXES that project outward from the wall, arranged in PAIRS — this
    is the most recognisable feature of the building and must be clearly drawn;
  • the picture is cropped by the TOP EDGE just above the first row of window boxes: a
    thin strip of pale blue sky may show at the very top left, no roof.
Old means renovated and cared for: no peeling paint, no cracks, no stains, no rust, no
litter, nothing derelict.

THE CLINIC IS ON A CORNER — this matters and must be drawn correctly. The building ENDS
at the RIGHT-HAND SIDE of the picture: the last column is the corner of the building, and
beyond it there is NO neighbouring shopfront and NO covered walkway — the ground opens
into a side road running away to the right, with a low kerb and open sky above it. Far
back across that road, small and pale, a dark maroon canopy and a couple of parked cars
suggest the rest of the town. At the LEFT edge, cropped, the low tiled roof of an old
neighbouring house sits against the clinic. Left = attached old neighbour, right = open
corner and street.

FRAMING — a straight-on street-level view. The two glass bays sit at the CENTRE of the
picture. The people stand along the covered walkway and the pavement in one horizontal
band across the lower two thirds.

SCALE — THE ADULTS ARE BIG: each standing adult is about 70% of the picture height, drawn
from head to foot. Their heads must be large enough to read as faces in a small thumbnail.

THE CAST — SIX people in THREE groups, spread left to right with clear gaps between them:
  1. CENTRE, in front of the glass — THE MAIN GROUP, the largest figures. A DENTIST
     wearing an OPEN WHITE COAT OVER pale sage-green scrubs stands talking with an OLD
     MAN who has stopped beside his bicycle, one hand on the handlebar and the other
     raised mid-sentence. They face each other in three-quarter view, in the middle of an
     easy everyday conversation between neighbours. The white coat makes her clearly the
     clinic's doctor.
  2. LEFT — a YOUNG MOTHER in her thirties with a SMALL BOY of about five. The boy is up
     on his toes, arm stretched out, waving and pointing across towards the two clinic
     colleagues at the right; he is delighted. His mother bends slightly, holding his
     other hand, looking where he points and smiling.
  3. RIGHT, at the corner — TWO CLINIC COLLEAGUES walking along the pavement, one in a
     white coat over scrubs, the other in scrubs holding a cold drink. THEY BOTH NOTICE
     THE BOY AND ANSWER HIM: the one in the white coat has turned towards him and is
     WAVING BACK, hand up and open, smiling; the other has turned her head to the boy and
     his mother with a knowing, amused smile. Their bodies still face the direction they
     are walking; only their heads and one arm turn.
     A SCHOOLGIRL rides past on a bicycle in front of them, cut off by the right edge.
THE BOY'S WAVE AND THE COLLEAGUES' ANSWER ARE THE ONE CONNECTION ACROSS THE PICTURE.
Everyone else stays inside their own group. Nobody is greeting a customer, nobody holds
out an inviting palm, nobody bows, nobody queues, nobody is being escorted inside.

EVERYONE LOOKS DIFFERENT — no two people in this picture may look alike. Give each a
clearly different age, build, hairstyle and clothing colour: the old man is thin with
short grey hair and a brown polo shirt; the young mother has shoulder-length dark hair, a
coral top and jeans; the small boy has a round face and a pale blue tee; the dentist in
the centre wears her hair tied back; the colleague in the white coat has short hair; the
colleague with the drink has a low ponytail; the schoolgirl has a high ponytail, white
school shirt and navy skirt. There is only ONE old person. Never draw the same face twice.

EVERY PERSON IS DRAWN WITH EXACTLY THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE
SAME SOLIDITY OF COLOUR. A figure further away is made secondary ONLY by being smaller or
partly overlapped — NEVER by pale, thin, faint, washed-out, semi-transparent or
outline-only drawing. Nobody wears a mask, nobody holds any dental instrument.

WHAT ELSE IS IN THE PICTURE — a few large, simple things: two healthy potted plants
against the wall, a low wooden stool, the old man's bicycle, a scooter parked and cropped
by the LEFT edge. Nothing small or fussy: no posters, no meter boxes, no hanging cables,
no bins, no banners.

MOVEMENT MARKS — small white hand-drawn strokes, two or three short lines at a time,
placed just outside a moving thing: beside the boy's waving arm, beside the schoolgirl's
wheel, beside a waving hand. Chalk-like, light and quick. They NEVER emerge from anyone's
mouth, nose or body, never loop, never cross, never form a long ribbon.

KEEP THE LOWER LEFT CORNER QUIET — the rectangle covering the LEFT 34% of the width and
the BOTTOM 30% of the height holds only the swept pavement, a soft shadow and the cropped
body of the parked scooter: large calm shapes, no face, no hands, no small detail. Quiet
does NOT mean empty or colourless.

FILL THE FRAME — the picture must never look empty or still. No large flat blank field
anywhere; no single area of one flat colour may take up more than about a tenth of the
picture.

STYLE — Contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, NEVER pure black: thin, hand-drawn, weight varies, strokes taper and
sometimes break. Colour applied like soft coloured pencil and light marker, edges a little
loose and not always meeting the line. Flat fills with two or three tones per hue, no
smooth decorative gradients. A fine even paper grain over the whole image. The building is
drawn the same way as the people — hand-drawn and simplified, NEVER photographic, no photo
texture, no mirror-like reflections, no lens perspective.
SKIN IS THE ONE EXCEPTION to the two-or-three-tones rule: each face is a single flat tone
with no modelling. A face carries only six things — its outline, eyes, eyebrows, nose,
mouth and ears. No wrinkles, no cheekbone or jaw shading, no shadow under the eyes, no
nose-to-mouth lines, no blush. Eyes are simple dots or short lines.

COLOUR — clear, warm and lively, never dull and never washed out: most colour blocks sit
around HSL saturation 30-50 and lightness 65-82, and well over half of the picture carries
real colour. The building itself is quiet — pale warm grey concrete, dark chocolate-brown
metal columns and window boxes, deep grey-green glass — so THE COLOUR MUST COME FROM THE
PEOPLE AND THE STREET: white coats; clinic scrubs in pale sage (#bfd7b7 with #99b899 in
the folds); the old man in warm brown; the young mother in muted coral; the small boy in
pale blue; the schoolgirl in white and navy; deep green foliage; a warm sandy pavement; a
thin strip of pale blue sky. Keep the concrete WARM grey, never a cold blue-grey, and
never let the whole picture go grey — at least seven distinct colours must be readable at
thumbnail size. Hair is very dark and warm-toned (#374840, shading to #283930, with
#404f47 highlights) — never flat pure black, never brown or auburn, except the old man's
grey hair. Clothes are never flat single-tone shapes: two or three tones each, with folds,
collar, cuffs and hem drawn.

CRITICAL — NO WRITING ANYWHERE IN THE IMAGE. No text, letters, words, numbers, logos,
signage, captions or watermarks, in any language. THE SIGN PANEL ABOVE THE GLASS IS
COMPLETELY BLANK, and so is the distant canopy across the road — even though the real
building has lettering there, leave both surfaces plain and empty. The scooter, the drink
cup, the school bag and all clothing carry no writing.

AVOID — evening or sunset light; glowing orange or amber windows; interior light brighter
than daylight; a golden cast over the picture; long orange shadows; a dark sky; a still,
quiet, staged or empty picture; only one thing happening; a child waving with nobody
answering him; a shop-front welcome, an inviting open palm, a bow, a queue, a customer
being received; a neighbouring shop or covered walkway continuing past the right edge of
the building; two people who look alike; every patient being elderly; a faded, pale,
translucent or ghostly figure; any person drawn with lighter or thinner lines than the
others; small distant figures; large empty walls or pavement; photographic rendering,
photo texture, mirror reflections, lens perspective; peeling paint, cracks, stains, rust,
litter; a cold grey overall cast; panels or split screens; speech bubbles; magnified
insets; arrows or icons; a dense crowd or more than six people; anything small and fussy
in the lower-left corner; teeth, tooth models, dental chairs, instruments, X-rays or
clinical equipment; masks; anyone looking at the viewer; greyscale; photorealism; thick
uniform black outlines; chrome or iridescent gradients; faceless figures, oversized heads
or noodle limbs; blood, pain or fear.
```


## 第八版（現行）—— 人再放大 ＋ 右邊那兩位真的轉過來

第七版使用者：「**這版很不錯耶我非常喜歡**，不過左邊小孩跟媽媽打招呼，
**右邊沒有人回應**，讓右邊那兩個互相聊天的診所人員跟他們有點回應或互動。」

### 第七版出圖的量測

| | 第六版 | **第七版** | 門檻 |
| --- | --- | --- | --- |
| 無彩空白 | 0.1% | 0.7% ✅ | < 5% |
| 邊緣密度 | 38.9% | 37.1% ✅ | ≥ 30% |
| 左半密度 | 36.1% | 35.5% ✅ | ≥ 20% |
| 大人高佔畫面 | 58~66% | **44~48%** ❌ | ≈ 70% |

⚠⚠ **加了轉角，人就被推遠了**（模型為了塞下轉角把鏡頭往後拉），
250px 上大人只剩 59~64px、頭約 9~10px —— 回到第二版被嫌「太小」的尺寸。
**這是取捨沒做對，不是模型畫錯**：提示詞沒有講「兩者衝突時誰讓誰」。
第八版因此在最前面那五條裡寫死：**「轉角和人的大小衝突時，縮轉角，不縮人」**。

### ⚠⚠ 兩件互相衝突的事不能交給同一個人

第七版寫她們「**邊走邊聊**」，又要她們「**回應小孩**」——
模型選了比較近的那一件，兩個人就面對面聊起來了。
**通則：一個角色同時被指派兩個互相衝突的動作時，模型會選空間上比較近的那一個。
要指定哪一件正在發生、另一件是暫停的。**（第八版寫成
`THEIR OWN CONVERSATION HAS STOPPED`。）

### ⚠⚠ 250px 下「回應」只有三個可讀的線索

眼睛在縮圖上只有一兩個像素，寫 `looking at him` 完全無效。讀得到的只有：

1. **頭與上半身的轉向**（要整個胸廓轉過去，不是只轉頭）；
2. **手臂的角度**（舉高過肩、手肘彎、手掌張開，而且要用**靠近對方那一側**的手）；
3. **視線路徑上有沒有東西擋住**。

提示詞因此加了一句 `Read it from the turn of the bodies and the angle of the arms,
not from the eyes`。

提示詞逐字見下面（第八版）。

## 提示詞（第七版，已作廢，第八版是從這一份改的）

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview
card. It will be seen at about 250 pixels wide, so everything must read at thumbnail size:
big simple shapes, few large objects, one continuous scene.

THE FIVE THINGS THAT MATTER MOST, IN ORDER:

1. BRIGHT MIDDAY LIGHT. Daylight outside is stronger than any light indoors. The pavement,
   the concrete wall and the strip of pale blue sky are the brightest things in the
   picture. The glass shopfront is DARKER than the wall around it, a deep grey-green
   quietly reflecting the sky, with only a faint hint of a warm-lit waiting room deep
   inside. Shadows are short and soft.
2. SIX PEOPLE, DRAWN BIG, IN THREE GROUPS along one horizontal band across the lower two
   thirds. Each standing adult is about 70% of the picture height, head to foot, with
   heads large enough to read as faces in a thumbnail.
3. THREE SMALL THINGS HAPPENING AT ONCE — neighbours and clinic staff sharing an ordinary
   afternoon on their own street.
4. THE REAL BUILDING, drawn from the photograph references, ON A CORNER: the front
   elevation faces us, and at the RIGHT-HAND SIDE the building turns the corner and its
   long side elevation runs away from us down a side lane.
5. NO WRITING ANYWHERE in the image, in any language.

THE BUILDING — a renovated old townhouse in a small town in central Taiwan, immaculately
kept and quietly modern. Draw it in the illustration style described below, hand-drawn and
simplified, never photographic.
  • The ground floor is SET BACK under the upper storeys, forming a covered walkway
    carried by SQUARE COLUMNS clad in dark chocolate-brown metal — three columns across
    the front, making two bays.
  • Between the columns the front is FULL-HEIGHT GLASS in slim dark frames, deep grey-green
    in the daylight, with soft pale sky reflections and a calm, dimly visible waiting area
    behind it: pale wood furniture, one soft warm light far inside.
  • A slim dark steel BEAM runs across above the glass carrying a completely BLANK sign
    panel.
  • Above the beam, a smooth PALE WARM-GREY CONCRETE wall with TALL NARROW VERTICAL
    WINDOWS set in DARK METAL BOXES that project out from the wall, arranged in pairs.
    These projecting window boxes are the building's most recognisable feature.
  • The frame is cropped just above the first row of window boxes; a thin strip of pale
    blue sky shows at the top left. No roof.
  • THE CORNER, at the RIGHT: the last column of the front is the corner of the building.
    From there the LONG SIDE ELEVATION recedes away to the right in gentle perspective —
    the same pale concrete, a couple more of the same dark projecting window boxes, and a
    row of THREE WHITE CYLINDRICAL PLANTERS with small green shrubs standing along its
    base. A narrow side lane runs beside it into the distance, where a few small pale
    rooftops suggest the rest of the town. On the LEFT edge, cropped, the low tiled roof
    of the old neighbouring house sits against the clinic.

THE PEOPLE — six, all East Asian (Taiwanese), in three groups with clear gaps between them:
  1. CENTRE, in front of the glass, the largest figures: a DENTIST in an OPEN WHITE COAT
     over pale sage-green scrubs stands talking with an OLD MAN who has stopped beside his
     bicycle, one hand on the handlebar and the other raised mid-sentence. They face each
     other in three-quarter view, in the middle of an easy everyday conversation.
  2. LEFT: a YOUNG MOTHER in her thirties with a SMALL BOY of about five. The boy is up on
     his toes, arm stretched out, waving across at the two clinic colleagues on the right,
     delighted. His mother bends slightly, holding his other hand, looking where he waves
     and smiling.
  3. RIGHT, at the corner: TWO CLINIC COLLEAGUES walking along the pavement, one in a
     white coat over scrubs, the other in scrubs holding a cold drink. BOTH ANSWER THE
     BOY — the one in the white coat has turned to him and is WAVING BACK, hand up and
     open, smiling; the other has turned her head towards the boy and his mother with a
     knowing, amused smile. Their bodies keep walking; only heads and one arm turn.
     A SCHOOLGIRL rides past on a bicycle in front of them, cut off by the right edge.
The boy's wave and the colleagues' answer are the one connection across the picture;
everyone else stays inside their own group. They are neighbours and staff sharing a
street: talking, walking, passing by.

EVERYONE LOOKS DIFFERENT — every person has a clearly different age, build, hairstyle and
clothing colour: the old man is thin with short grey hair and a brown polo shirt; the
young mother has shoulder-length dark hair, a coral top and jeans; the small boy has a
round face and a pale blue tee; the dentist in the centre wears her hair tied back; the
colleague in the white coat has short hair; the colleague with the drink has a low
ponytail; the schoolgirl has a high ponytail, white school shirt and navy skirt. Exactly
one elderly person appears. Every face is drawn once.

DRAW EVERY PERSON WITH THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME SOLIDITY
OF COLOUR AS EVERY OTHER PERSON. Distance is shown by size and by overlapping, and by
nothing else — every figure is fully drawn and fully coloured.

ALSO IN THE PICTURE, all large and simple: two potted plants against the front wall, a low
wooden stool, the old man's bicycle, and a scooter parked and cropped by the LEFT edge.

THE LOWER LEFT CORNER STAYS CALM — the area covering the left third of the width and the
bottom third of the height holds only the swept pavement, a soft shadow and the cropped
body of the parked scooter: large quiet shapes carrying warm colour, no faces, no hands,
no small detail.

MOVEMENT MARKS — small white hand-drawn strokes, two or three short lines at a time,
placed just outside something that is moving: beside the boy's waving arm, beside the
schoolgirl's wheel, beside the waving hand. Chalk-like, light and quick, always separate
from the body.

STYLE — contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, thin and hand-drawn, weight varying, strokes tapering and sometimes
breaking. Colour applied like soft coloured pencil and light marker, edges a little loose
and not always meeting the line. Flat fills with two or three tones per hue. A fine even
paper grain over the whole image. Skin is the one exception to the two-or-three-tones
rule: each face is a single flat tone, carrying only its outline, eyes, eyebrows, nose,
mouth and ears; eyes are simple dots or short lines.

COLOUR — clear, warm and lively. Most colour blocks sit around HSL saturation 30-50 and
lightness 65-82, and well over half the picture carries real colour. The building is quiet
— pale WARM grey concrete, dark chocolate-brown metal, deep grey-green glass — so the
colour comes from the people and the street: white coats; pale sage scrubs (#bfd7b7 with
#99b899 in the folds); the old man in warm brown; the mother in muted coral; the boy in
pale blue; the schoolgirl in white and navy; deep green foliage in the pots and planters;
a warm sandy pavement; a thin strip of pale blue sky. At least seven distinct colours are
readable at thumbnail size. Hair is very dark and warm-toned (#374840, shading to #283930,
with #404f47 highlights), except the old man's grey hair. Clothes carry two or three tones
each, with folds, collar, cuffs and hem drawn.

NO WRITING ANYWHERE IN THE IMAGE — no text, letters, words, numbers, logos, signage,
captions or watermarks, in any language. The sign panel above the glass is a plain empty
surface, even though the real building carries lettering there. The scooter, the drink cup,
the school bag and all clothing are blank.

AVOID — evening, sunset or lamplight; glowing orange windows; a shopfront welcome or an
inviting open palm; a neighbouring shop or covered walkway continuing past the right-hand
corner; any figure drawn pale, faint, translucent or in outline only; two people who look
alike; a crowd; greyscale; photorealism; thick uniform black outlines; dental instruments,
chairs, X-rays or teeth.
```

## 第九版（現行）—— 女醫師、窗盒留住、玻璃要透光

第八版使用者三件（2026-08-22）：**「醫師變成綁馬尾的男生，鄉下地方太特別了，
回原來那個版本」「視角拉近，可是上面的窗框被裁掉了，那個特色要保留」
「玻璃裡面看起來很黑，前一版裡面有東西透出來，那個效果比較好」。**

### 第八版的量測

| | 第七版 | **第八版** | 門檻 |
| --- | --- | --- | --- |
| 無彩空白 | 0.7% | 0.1% ✅ | < 5% |
| 邊緣密度 | 37.1% | 37.6% ✅ | ≥ 30% |
| 左半密度 | 35.5% | 39.1% ✅ | ≥ 20% |
| 大人高佔畫面 | 44~48% | **49~55%** ⭕ | ≈ 70% |

⚠⚠ **裁掉建築不是讓人變大的辦法。** 第八版把窗盒整排裁掉，人只換到 +6 個百分點
（49~55%，250px 上大人 65~73px、頭約 10~11px），而**那排窗盒正是這棟樓最有辨識度的東西**。
第九版改成**把人往前站**（人在最前面的人行道上、建築整個退到後面），
這樣人可以大、窗盒也留得住 —— 提示詞第 2 條寫死：
「做不到就把人往觀者拉近，**不准縮小或裁掉窗盒**」。

### ⚠⚠ 「隱約可見」在提示詞裡等於「什麼都不用畫」

第六版寫玻璃 `faint and low-contrast`、`dimly visible waiting area` ——
第八版就畫成一片平的深墨綠。**要看得見東西，就得逐項點名裡面有什麼**
（兩三張淺色木椅、一幅小掛畫、一盆植物、深處一盞暖燈），再說它比牆暗一階。
⚠ 同一條的近親：第五版寫 `the glass GLOWS warm and is the brightest thing`
就得到黃昏。**玻璃的亮度是一把很敏感的尺，兩端都會出事。**

### ⚠ 這一輪我沒有拿數字當證據（誠實紀錄）

玻璃暗度我量了兩次，框選抓到的東西不同、結論互相矛盾（一次 v8 比較暗、一次比較亮），
所以**沒有拿它當證據**，只用畫面上看得到的事實（v7 玻璃裡有家具與燈，v8 幾乎是平的）。
⚠ **量測框要能重現才算數**：日後量「某一塊材質」要先定義那一塊的座標並存下來，
不要每次憑印象抓框。

### 順帶修掉的一件（我的疏忽）

提示詞只寫 `the dentist … wears her hair tied back`，**沒有指定性別**，
模型就自己決定畫成男性。第九版明寫「**女醫師、四十多歲、低髮髻**」，
並補一句「這張圖裡的診所人員都是女性，只有老先生與小男孩是男性」。

提示詞逐字見下面（第九版）。

## 第十版（現行）—— 一位男性、藍天與雲、讓畫面流動起來

第九版使用者：「**很不錯了**，加一個細節：診所人員都是女性，換一個男性上去，
就把**對小朋友招手那位換成男生**；左邊本來有個房子現在去掉沒關係，不過**有點空**；
**天空整個是白的**，連右上角那一小角也是白的，加點藍色或雲；
**氛圍感可以再出來一點**，人很多但**有點停住的感覺**。」

### 第九版的量測 —— 他講的三件都量得出來

| | 第八版 | **第九版** | 讀出來是什麼 |
| --- | --- | --- | --- |
| 無彩空白 | 0.1% | **2.9%** | 天空白掉了 |
| 邊緣密度 | 37.6% | **30.2%** | 壓在門檻上＝「停住」的感覺 |
| 左半密度 | 39.1% | **26.2%** | 老瓦房拿掉＝「左邊有點空」 |
| 濃琥珀（暖色） | 22.4% | **6.7%** | 整張偏灰白 |
| 大人高佔畫面 | 49~55% | **43~48%** | **又縮小了** |

⚠⚠ **每次把建築細節加回去，人就被推遠一次**（第七版加轉角、第九版加窗盒，兩次都縮）。
第十版因此改用**畫面內的錨點**而不是百分比 —— 同第八之一節那條
「大小不要用百分比，用畫面內的錨點」：

> **大人的頭頂大約到招牌橫樑的高度，腳接近畫面下緣。**

### 「流動感」在這一站怎麼畫（第十版新增的一段 `MOVEMENT AND AIR`）

使用者要的不是更多人，是**這一刻正在發生**。四樣一起做：
① 三四條**長的白色氛圍線**橫掃畫面上部（第十之六節：氛圍線可以長，
但**絕不能從人身上長出來**）；② 小的白色動作線分佈在四處（揮手的手、
小孩的手臂、學生的輪子、媽媽被風掀起的衣襬）；③ 頭髮與衣襬被風帶起、
學生身體前傾、揮手那位**停在跨步中（後腳跟離地）**、腳踏車前輪微轉；
④ **地上的影子全部同一個方向**，給地面一個方向感。
⚠ 一兩片被風帶著跑的葉子就夠，不要鋪滿。

提示詞逐字見本檔最後（第十版）。


## 第十一版（現行）—— 用幾何擋掉「自己聊自己」＋ 男醫師寫三次

第十版使用者：「**很不錯喔**，不過**男性的醫療人員沒有畫進來**，
最右邊那兩個也**變成自己聊自己**，沒有跟左邊的小孩與媽媽回應的感覺。」

### 第十版的量測

| | 第九版 | **第十版** |
| --- | --- | --- |
| 無彩空白 | 2.9% | **0.5%** ✅（天空藍回來了） |
| 邊緣密度 | 30.2% | **37.4%** ✅（流動感有效） |
| 左半密度 | 26.2% | **35.8%** ✅（老瓦房與街樹補上了） |
| 濃琥珀（暖色） | 6.7% | **24.6%** ✅ |
| 大人高佔畫面 | 43~48% | **43~46%** ❌ 沒有變大 |

### ⚠⚠ 三條通則（這一輪最重要的東西）

1. **「回應」失敗兩次，成因不是敘述不夠，是幾何。**
   兩個人被畫成「並肩站在一起的一對」，模型就會保留他們互相面對的關係，
   不管提示詞寫幾次「對話停了、轉向小孩」。
   **解法是讓面對面在幾何上不可能**：改成**一前一後、兩人朝同一個方向走**
   （都朝小孩那一側），前面那位回身揮手，後面那位被前面那位部分遮住。
   ⚠ 通則：**要改變兩個人的關係，先改他們的相對位置，不要只改敘述。**
2. **模型忽略的東西，多半是被埋在段落中段的東西。** 男性醫療人員前兩版都寫了，
   但寫在第三組的中段 —— 第十一版改成**寫三次**：最前面那份清單的第 1 條、
   人物段的第一位、AVOID 各一次。**順序就是權重。**
3. **人物大小連續三版都在 43~55% 之間下不去**（門檻 ≈70%）。
   前面所有辦法（裁建築、錨點寫法）都沒有用，剩下唯一沒試過的槓桿是
   **少畫一個開間** —— 第十一版寫死「只露一個完整開間加轉角，
   不要為了把整棟塞進畫面而把人縮小」。
   ⚠ 如果這一版仍然無效，那就是**「建築完整」與「人夠大」本來就衝突**，
   要請使用者做一次取捨（PM 的建議：人優先）。

提示詞逐字見本檔最後（第十一版）。

## 提示詞（第十版，已作廢，第十一版是從這一份改的）

> ⚠ 參考圖三張：① `drafts/og-topic-general-v9.jpg`（畫風、配色、線的實度、人物比例）
> ② `drafts/og-facade-ref.png`（正面細節，招牌的字拿掉）
> ③ `drafts/og-corner-ref.png`（轉角怎麼轉、長向立面）。

```
Editorial illustration, landscape 1.91:1 (1200 x 628), for a small social-media preview
card. It will be seen at about 250 pixels wide, so everything must read at thumbnail size:
big simple shapes, few large objects, one continuous scene.

THE FIVE THINGS THAT MATTER MOST, IN ORDER:

1. BRIGHT MIDDAY LIGHT UNDER A BLUE SKY. Daylight outside is stronger than any light
   indoors. The sky is a soft clear blue with two or three thin white clouds drifting
   across it — never a blank white sky, never a colourless one. The pavement, the concrete
   wall and that blue sky are the brightest things in the picture. The glass shopfront is
   one step darker than the wall — never black, never empty.
2. THE PEOPLE STAND IN THE FOREGROUND AND THEY ARE LARGE. They are on the near edge of the
   pavement, close to us, with the whole building set back behind them. USE THIS ANCHOR
   rather than a percentage: the top of each standing adult's head reaches about the height
   of the dark sign beam above the shopfront, and their feet come close to the bottom edge
   of the picture. If they cannot be that large, move the people closer to the viewer — do
   NOT shrink the building's window boxes and do NOT crop them away.
3. THE STREET IS IN MOTION. Several small things are happening at the same time and the
   air is moving through the picture; nothing is posed or frozen.
4. THE REAL BUILDING behind them, drawn from the photograph references, ON A CORNER: the
   front elevation faces us, and at the RIGHT-HAND SIDE it turns the corner. ONE FULL ROW
   OF THE DARK PROJECTING WINDOW BOXES IS VISIBLE ABOVE THE SIGN BEAM — they are the
   building's signature and must never be cropped out.
5. NO WRITING ANYWHERE in the image, in any language.

MOVEMENT AND AIR — this is what makes the picture feel alive, so draw all four:
  • THREE OR FOUR LONG WHITE HAND-DRAWN LINES sweep right across the upper part of the
    picture, above the people and across the sky and the wall — soft chalk quality,
    tapering to dry flecks at their ends, all running the same way, suggesting a light
    breeze passing down the street. They are drawn in the open air only and NEVER touch or
    emerge from any person's mouth, nose, hands or body.
  • SMALL WHITE MOVEMENT MARKS, two or three short strokes at a time, beside four
    different things that are moving: the boy's raised arm, the waving colleague's raised
    hand, the schoolgirl's front wheel, and the mother's skirt hem.
  • THE BREEZE TOUCHES THE PEOPLE: loose strands of hair and the hems of coats and shirts
    lift slightly, all blown the same way; the schoolgirl leans forward as she pedals; the
    waving colleague is caught MID-STRIDE with his back heel off the ground; one or two
    small leaves tumble along the pavement. Keep it to that — no swirling debris.
  • EVERY SHADOW ON THE GROUND FALLS THE SAME WAY, short and soft, giving the pavement one
    clear direction.

THE BUILDING — a renovated old townhouse in a small town in central Taiwan, immaculately
kept and quietly modern. Draw it in the illustration style described below, hand-drawn and
simplified, never photographic.
  • The ground floor is SET BACK under the upper storeys, forming a covered walkway carried
    by SQUARE COLUMNS clad in dark chocolate-brown metal — three columns across the front,
    making two bays.
  • Between the columns the front is FULL-HEIGHT GLASS in slim dark frames. The glass is a
    soft deep grey-green, one step darker than the concrete wall, and YOU CAN CLEARLY SEE
    THE WAITING ROOM THROUGH IT: two or three pale wood chairs, a small framed picture on
    the back wall, a potted plant, and one warm lamp glowing softly in the depth of the
    room. Draw those things plainly, in muted colour — the glass is a window into a calm
    room, not a dark panel. A few pale diagonal sky reflections cross it.
  • A slim dark steel BEAM runs across above the glass carrying a completely BLANK sign
    panel.
  • ABOVE THE BEAM, a band of smooth pale warm-grey concrete carrying ONE COMPLETE ROW of
    TALL NARROW VERTICAL WINDOWS set in DARK METAL BOXES that project out from the wall,
    arranged in pairs. This whole row is inside the frame, uncropped, with the blue sky
    above it. No roof, no second row of windows.
  • THE CORNER, at the RIGHT: the last column of the front is the corner of the building.
    From there a SHORT stretch of the LONG SIDE ELEVATION recedes to the right in gentle
    perspective — the same pale concrete, one more dark projecting window box, and TWO
    WHITE CYLINDRICAL PLANTERS with small green shrubs along its base. A narrow side lane
    runs past it out of frame.
  • AT THE LEFT EDGE, filling what would otherwise be an empty corner: the low tiled roof
    and pale wall of the old neighbouring house, cropped by the frame, with a small street
    tree beside it whose leaves catch the same breeze. Blue sky and one thin cloud show
    above them.

THE PEOPLE — six, all East Asian (Taiwanese), in three groups with clear gaps between them:
  1. CENTRE, in front of the glass, the largest figures: a WOMAN DENTIST — female, in her
     forties, her dark hair gathered in a low bun, wearing an OPEN WHITE COAT over pale
     sage-green scrubs — stands talking with an OLD MAN who has stopped beside his bicycle,
     one hand on the handlebar and the other raised mid-sentence. They face each other in
     three-quarter view, in the middle of an easy everyday conversation.
  2. LEFT: a YOUNG MOTHER in her thirties with a SMALL BOY of about five. The boy is up on
     his toes, arm stretched out, waving across at the two clinic colleagues on the right,
     delighted. His mother bends slightly, holding his other hand, looking where he waves
     and smiling.
  3. RIGHT, at the corner: TWO CLINIC COLLEAGUES who were walking along the pavement
     together — A MAN in a white coat over scrubs, and a WOMAN in scrubs holding a cold
     drink. THEIR OWN CONVERSATION HAS STOPPED — they have both noticed the little boy and
     are answering him, and this must be unmistakable at thumbnail size:
     • THE MAN — a Taiwanese man in his thirties with short black hair, clean-shaven, a
       white coat open over pale sage-green scrubs — has stopped mid-stride, back heel off
       the ground, and turned his HEAD, SHOULDERS AND CHEST to his left, squarely towards
       the boy on the far side of the picture. He raises the arm nearest the boy high, well
       above his shoulder, palm open, elbow bent, WAVING BACK at him, grinning. His whole
       silhouette leans the boy's way.
     • THE WOMAN WITH THE DRINK has turned her head the same way, chin towards the boy and
       his mother, smiling — she is watching her colleague answer the child. She still
       holds the cup, but she is no longer facing her colleague.
     • NEITHER OF THEM FACES THE OTHER any more; both are turned across the picture towards
       the boy, and nothing stands between them and him.
     A SCHOOLGIRL rides past on a bicycle in front of them, cut off by the right edge.
This exchange — the boy waving and the two colleagues turning and waving back across the
street — is the one connection that spans the picture. Everyone else stays inside their own
group. Read it from the turn of the bodies and the angle of the arms, not from the eyes: at
thumbnail size the eyes are only a dot.

EVERYONE LOOKS DIFFERENT — every person has a clearly different age, build, hairstyle and
clothing colour: the old man is thin with short grey hair and a brown polo shirt; the young
mother has shoulder-length dark hair, a coral top and jeans; the small boy has a round face
and a pale blue tee; the woman dentist in the centre has a low bun; the man in the white
coat has short black hair; the colleague with the drink has a low ponytail; the schoolgirl
has a high ponytail, white school shirt and navy skirt. Exactly one elderly person appears.
Every face is drawn once.

DRAW EVERY PERSON WITH THE SAME LINE WEIGHT, THE SAME LINE DARKNESS AND THE SAME SOLIDITY
OF COLOUR AS EVERY OTHER PERSON. Distance is shown by size and by overlapping, and by
nothing else — every figure is fully drawn and fully coloured.

ALSO IN THE PICTURE, all large and simple: two potted plants against the front wall, a low
wooden stool, the old man's bicycle, and a scooter parked and cropped by the LEFT edge.

THE LOWER LEFT CORNER STAYS CALM — the area covering the left third of the width and the
bottom third of the height holds only the swept pavement, a soft shadow and the cropped
body of the parked scooter: large quiet shapes carrying warm colour, no faces, no hands, no
small detail.

STYLE — contemporary printed-magazine editorial illustration. Linework in warm dark brown
or soft charcoal, thin and hand-drawn, weight varying, strokes tapering and sometimes
breaking. Colour applied like soft coloured pencil and light marker, edges a little loose
and not always meeting the line. Flat fills with two or three tones per hue. A fine even
paper grain over the whole image. Skin is the one exception to the two-or-three-tones rule:
each face is a single flat tone, carrying only its outline, eyes, eyebrows, nose, mouth and
ears; eyes are simple dots or short lines.

COLOUR — clear, warm and lively. Most colour blocks sit around HSL saturation 30-50 and
lightness 65-82, and well over half the picture carries real colour. The building is quiet
— pale WARM grey concrete, dark chocolate-brown metal, deep grey-green glass — so the
colour comes from the sky, the people, the street and the lit room behind the glass: a soft
blue sky with white clouds; white coats; pale sage scrubs (#bfd7b7 with #99b899 in the
folds); the old man in warm brown; the mother in muted coral; the boy in pale blue; the
schoolgirl in white and navy; deep green foliage in the pots, planters and street tree; a
warm sandy pavement; the honey wood and warm lamplight inside the waiting room. At least
seven distinct colours are readable at thumbnail size. Hair is very dark and warm-toned
(#374840, shading to #283930, with #404f47 highlights), except the old man's grey hair.
Clothes carry two or three tones each, with folds, collar, cuffs and hem drawn.

NO WRITING ANYWHERE IN THE IMAGE — no text, letters, words, numbers, logos, signage,
captions or watermarks, in any language. The sign panel above the glass is a plain empty
surface, even though the real building carries lettering there. The scooter, the drink cup,
the school bag, the framed picture inside and all clothing are blank.

AVOID — a blank white or colourless sky; a still, posed or frozen street; everyone standing
upright and motionless; dark, black, empty or mirror-like glass with nothing visible behind
it; the row of projecting window boxes cropped away or reduced to a thin sliver; small
distant figures; an empty corner at the left edge; evening, sunset or lamplight outdoors;
glowing orange windows; the two colleagues on the right facing each other or absorbed in
their own conversation; a child waving with nobody answering him; a shopfront welcome or an
inviting open palm; a neighbouring shop or covered walkway continuing past the right-hand
corner; any figure drawn pale, faint, translucent or in outline only; two people who look
alike; a crowd; greyscale; photorealism; thick uniform black outlines; dental instruments,
chairs, X-rays or teeth.
```
