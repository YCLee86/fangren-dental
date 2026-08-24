# 著陸頁線稿底圖・顯微根管（`lineart-endo`）

**狀態（2026-08-24）：提示詞與參考圖已備妥，等出圖。**
容器裡沒有 Gemini 的金鑰，出圖要在使用者那一側跑 —— 把第四節整段貼進去、
附第三節那八張圖，回傳的圖存成 `drafts/lineart-endo-v1.jpg` 就能接第六節的管線。

模板在 [`drafts/topic-lineart-prompt.md`](topic-lineart-prompt.md)（風格規格、門檻、管線都在那裡，
**這一份只寫顯微根管這一科不一樣的地方**）。通則在 ILLUSTRATION.md 第十二節，
一般牙科那一輪的推導在 `/history/topic-lineart.html`、牙周那一輪在
`/history/topic-lineart-perio.html`。

| | |
| --- | --- |
| 成品要放哪 | `assets/lineart-endo.png`（透明底、顯微根管套色 `#ae4f4d`） |
| 分享圖（前置作業，**已上線**） | `assets/og-topic-endo.jpg`，原檔 `drafts/og-topic-endo-src.jpg` 1424×708 |
| 參考圖（這一輪新裁） | `drafts/lineart-endo-pose-ref.jpg` 1314×1968、`drafts/lineart-endo-scope-ref.jpg` 1710×900 |
| 裁圖腳本 | `node drafts/lineart-endo-refs-crop.mjs` |

---

## 一、使用者指定的取材（2026-08-24，逐字）

> 「顯微根管的著陸頁圖片已經上線　**用那個圖片中醫師和顯微鏡的部分**　製作線稿」

所以這一張**只有兩樣東西**：**醫師（坐在醫師椅上）＋ 顯微鏡（含關節臂）**。
分享圖裡的**大臼齒、放大圈裡那九隻細菌、櫃子、診療椅、牆與地板全部不畫** ——
線稿是壓在文字底下的底圖，元素愈少愈耐看，而且第十二節那三條門檻
（線佔 4~6%、粗細一致、零實心填色）撐不住一個滿版的場景。

同牙周那一輪：**分享圖與線稿的題材不必一致**（分享圖的主角是那顆牙與放大圈裡的細菌，
線稿只留「有人真的湊上去看」這個動作）。兩張圖出現的地方不一樣，
分享圖只在訊息卡上、線稿只在頁面上。

⚠ 這一幕接得上那一頁的軸：使用者定案時說的是「顯微根管是**為牙齒增加一個保留的機會**」，
而那一次機會是**看得到**才多出來的（`tools/topic-copy.mjs` 的 endo 段）。
所以畫的是「一個人真的把眼睛湊上去」，不是器械型錄。

---

## 二、和模板不一樣的三處（**刻意的，不是漏看**）

| 模板 | 這一科 | 為什麼 |
| --- | --- | --- |
| **畫到腰就好，不要畫腿** | **畫到鞋子，含醫師椅** | 這一張的動作是「**坐著**、上身從髖部往前傾湊到目鏡」，坐姿整個寫在下半身與那張椅子上。切在腰際就只剩一個人靠著一台機器，讀不出「坐下來慢慢看」 |
| 姿勢參考**一張** | **兩張**（醫師、顯微鏡） | 器械的形狀**不要用文字描述**（ILLUSTRATION.md 第十之一節，〈生物陶瓷〉那一輪十二次才學到）。關節臂、鏡頭、目鏡的相對長度用圖給，一次就對 |
| 一般是人物 ＋ 道具 | 多一個**光錐**（兩條直線，可有可無） | 它是這張圖唯一交代「往一個看不見的地方看進去」的東西，而且只花兩條線。⚠ 規格寫死成兩條直線、裡面是空的，不然一定會長出放射線與亮點 |

其餘（畫法規格、單色、無填色、無投影、無背景、門檻、管線）**逐字照模板**。

---

## 三、要餵哪幾張圖（三組，**說明一定要分開寫**）

| # | 檔案 | 這一張只提供 | 附圖時要寫的話 |
| --- | --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | **畫法** | 「只參考線條畫法（均勻粗細、無濃淡、無陰影、無材質、大量留白）；**不要參考題材、人物、道具**。」 |
| 6a | `drafts/lineart-endo-pose-ref.jpg` | **醫師的姿勢・視線・髮型・表情** | 「坐姿、上身前傾的角度、兩手扶在哪、兩腳的位置、視線方向、髮型、表情，完全照這張；**畫法照 1~5**。⚠ **左下角那一截白白的是別的東西（一顆擬人化的牙齒的腳），不要畫進去。**」 |
| 6b | `drafts/lineart-endo-scope-ref.jpg` | **顯微鏡的形狀與比例** | 「顯微鏡的形狀、關節臂的走向、鏡頭與目鏡的相對長度照這張；但**牆壁、櫃子、檯面一律不要畫**，畫法照 1~5。」 |
| 7 | `drafts/og-topic-endo-src.jpg` | **長相・服裝・年齡層** | 「人物的長相、服裝、年齡層照這張，但**畫法完全不同**，而且**這張裡的牙齒、放大圈與圈裡的細菌、櫃子、診療椅、牆、地板一律不要畫**。」 |

⚠ 第 7 張用**原檔**不是 `assets/og-topic-endo.jpg` —— 成品上緣疊著玻璃帶，
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
Outline only. Do not fill any area with solid colour, including hair, clothing and the
lenses.

WHO — one dentist of a small Taiwanese neighbourhood clinic, seen FULL LENGTH IN PROFILE,
sitting on a low stool and looking into the eyepieces of a surgical microscope. Follow the
attached photo-references for pose, gaze, hair and expression EXACTLY; only the drawing
style comes from the line-art references.

  - THE DENTIST, on the RIGHT — a Taiwanese woman in her thirties, FACING LEFT, seen from
    her left-hand side in near profile. Her dark hair is drawn as an OUTLINE ONLY, with two
    or three interior strokes for the parting; it is TIED BACK IN A LOW PONYTAIL that hangs
    behind her shoulder — it is not filled in, not loose, not a bob. Her mouth is a short
    closed curve, a small calm smile — she is concentrating and unhurried. She wears an OPEN
    white coat over a V-neck scrub top and plain long trousers, and flat plain shoes, all
    drawn as outlines only.
    Her posture is SEATED AND LEANING IN, in profile:
      * she sits on a low stool, thighs roughly horizontal, both knees bent about a right
        angle, both feet flat on the floor, one foot slightly ahead of the other;
      * her upper body is tipped FORWARD FROM THE HIPS by about fifteen degrees towards the
        microscope — her back is a single relaxed curve, not straight and not hunched;
      * her face comes right up to the eyepieces: her brow almost touches them, and the
        eyepieces meet her face at eye level;
      * BOTH hands are on the microscope's two handgrips, at about her own chest height,
        elbows bent and kept close to her sides, forearms roughly horizontal.
    Her one visible eye is a small dot pressed against the near eyepiece. She looks INTO the
    microscope, to the LEFT — she does not look at the viewer.

  - THE STOOL — a plain low clinic stool seen from the side: a simple seat pad, a short
    rounded backrest behind her lower back, one central post, and a five-star base with
    small castors, drawn with outlines only. No levers, no gas-cylinder detail, no upholstery
    buttons, no seams.

  - THE MICROSCOPE, on the LEFT — a DENTAL SURGICAL MICROSCOPE ON A LONG ARTICULATED ARM,
    NOT a laboratory microscope standing on a table. Draw it with big simple shapes:
      * a pair of BINOCULAR EYEPIECES, two short parallel tubes angled UP towards her eyes,
        meeting her face on the right;
      * a compact body block below and to the left of the eyepieces, with the OBJECTIVE LENS
        underneath it pointing DOWN AND TO THE LEFT;
      * one straight handgrip sticking out on each side of the body, which her two hands
        hold;
      * a long ARTICULATED ARM leaving the top of the body: a short curved section, then one
        clearly drawn HINGE JOINT — a plain circle — then one long straight boom that rises
        to the LEFT and runs out of the picture at the TOP LEFT CORNER.
    Every part is drawn as a clean outline. No screws, no knobs, no dials, no cables, no
    brand plate, no glass reflection, no glare lines, no sparkle. The lenses are empty white.

  - THE LIGHT — exactly TWO STRAIGHT LINES leaving the objective lens and spreading apart
    slightly as they travel DOWN AND TO THE LEFT, running out of the picture at the LEFT
    EDGE. THE SPACE BETWEEN THEM IS EMPTY WHITE. No third line, no rays, no dashes, no
    sparkles, no stars, no glow, no hatching, and nothing at all at the end of the beam.

⚠ CRITICAL — THIS PICTURE CONTAINS ONLY THE DENTIST, HER STOOL, THE MICROSCOPE WITH ITS ARM,
AND THE TWO LIGHT LINES. Do NOT draw a giant tooth, a tooth character, a magnified circle,
cartoon germs, a patient, a dental chair, an operatory lamp, a table, a desk, a worktop,
cabinets, a wall, a window, a floor, a ground line or a room of any kind, even though the
attached colour illustration contains them. That colour image is there only for the woman's
face, clothing and age. Everyone and everything floats on empty white.

⚠ CRITICAL — IT IS NOT A TABLETOP LABORATORY MICROSCOPE. Do not draw a small microscope
standing on a bench with a stage, a slide, a mirror or a focus wheel, and do not draw her
bending down over a table. The microscope hangs from a long arm that comes in from the TOP
LEFT of the picture, and she meets it sitting upright.

⚠ CRITICAL — SHE IS SEEN FROM THE SIDE AND SHE FACES LEFT. Not from the front, not from
behind, and she never turns towards the viewer.
```

### 這一版為什麼這樣寫（各對應哪一條規則）

| 寫法 | 出處 |
| --- | --- |
| 坐姿寫成**幾何**（大腿水平、膝蓋直角、上身從髖部前傾十五度、前臂水平、手在胸高） | 第十二節二：形容詞擋不住預設姿勢 |
| 髮型、表情、視線**逐項寫出來** | 同上（一般牙科那次這三件全跑掉） |
| 顯微鏡拆成**目鏡／機身／物鏡／兩支握把／關節臂**五塊，每一塊寫朝向 | ILLUSTRATION.md 第十之一節：形狀不要用文字描述 —— 這裡是**用參考圖 ＋ 文字只補朝向**，兩者分工 |
| 「**不是桌上型顯微鏡**」單獨立一條 CRITICAL | 這一張最可能翻車的地方：`microscope` 這個字的預設解就是實驗室那台，一旦畫成那個，連帶會長出桌子、載玻片、對焦輪，整張圖的意思就變了 |
| 光錐寫成「**恰好兩條直線、裡面是空的、盡頭什麼都沒有**」 | 同牙周那條水柱：會發光的東西在彩圖裡是**體積**，線稿裡只能是**輪廓**。不寫死就會長出放射線與亮點，直接踩死「粗細一致」與「零實心填色」 |
| 椅子明講「五爪 ＋ 小輪 ＋ 一片矮靠背」，並禁掉拉桿與縫線 | 醫師椅是這張圖裡第二容易長出雜訊的東西（分享圖那張本身就有布紋） |
| 三條 ⚠ CRITICAL（沒有牙齒與診間／不是桌上型／不看鏡頭） | 第 7 張參考圖裡有牙齒、放大圈與整間診間，**不明講一定會被抄進來** |
| 否定句收在最後、能寫正面就寫正面 | TEAM.md 第一節第 10 號（AI 專家的紅線） |

---

## 五、交件門檻（收到圖先自己跑，不過就重生成）

    node drafts/lineart-measure.mjs drafts/lineart-endo-v1.jpg

線佔畫面 4~6%／筆畫寬中位 4~6‰／粗細一致 p90÷中位 < 2.5／實心填色 0 塊／四角乾淨。

⚠⚠ **前兩項是參考值不是門檻**（牙周那一輪量到的）——已上線的一般牙科那張實測是
`inkPct 7.84`、`strokePermil 6.8`，兩項都超出模板寫的區間，使用者仍然選了它。
**真正卡得住的是後三項**：粗細一致 < 2.5、實心填色 0 塊、四角乾淨。
⚠ 這一張左上角本來就有關節臂穿出去、左下角本來就有兩條光線穿出去，
**那兩角量到墨是對的**，不是雜點（同牙周那條水管）。

⚠ **門檻過了不代表對**，內容這一側逐條看：
① 是不是**吊臂式**顯微鏡（有沒有偷偷變成桌上型、有沒有長出桌子）
② 上身有沒有前傾、兩腳是不是踩在地上、椅子有沒有五爪
③ 光是不是只有兩條線、中間是不是空的、盡頭有沒有多畫東西
④ 有沒有偷長牙齒／放大圈／細菌／診療椅／地面線
⑤ 頭髮與白袍有沒有被填成一團實心
⑥ 臉是不是側面朝左、有沒有轉過來看鏡頭

---

## 六、出圖之後的管線

```
node tools/topic-lineart.mjs endo --art drafts/lineart-endo-v1.jpg --crop x,y,w,h
```

⚠ 裁切座標收到圖再量（生成的線稿幾乎一定會多一條地面線與一大圈空白）。
⚠ 不要餵透明底的 PNG 進去（有守門會擋）。

⚠⚠ **這一科不必 `--flip`。** 圖擺在介紹區的**右下角**，要的是人物朝版心裡面（朝左）；
分享圖裡的醫師本來就面向左，線稿照抄就已經是對的。
（牙周那次要翻，是因為那張的醫師朝右、等於背對整頁的文字。**開工前先想一次朝向**。）

接著把顯微根管加進 `index.html`（搜尋 `3-0 介紹區右下角的線稿底圖`）——
**三條選擇器各加一條，不要改成 `[data-topic]` 一網打盡**；
`aspect-ratio` 換成裁完的長寬，`background` 的 url 換成 `assets/lineart-endo.png`。

⚠⚠ **大小與濃度有兩組值可以抄，不要自己重挑，也不要互抄**：

| | 一般牙科 | 牙周 |
| --- | --- | --- |
| 分段 | `@media (min-width: 834px)` | **721px**（使用者是在 iPad mini 直放 744 上定的） |
| 大小 | `min(76%, 360px)` | 手機 `min(81.25%, 390px)`／≥721 `min(100%, 480px)` |
| 濃度 | `.10`／`.48` | `.115`／`.15` |

顯微根管的套色是 `#ae4f4d`，**比那兩支都深**，所以柔墨壓在圖上的臨界濃度會**比 .101 更緊**
（一般牙科 `#3f654a` 是 .101、牙周 `#317d78` 是 .115，愈淺愈寬鬆）。
**收到圖之後照牙周那一輪的做法先量一次臨界濃度再給值**，不要直接抄 .115。

```
node tools/topics.mjs && node tools/build.mjs
```

驗收：九個寬度（1440／1280／1200／1041／834／430／390／375／320）介紹區高度與加圖之前
**逐格相同**、無水平捲動；其餘沒有圖的科目與首頁**沒有畫出那個偽元素**。

---

## 七、要使用者決定的

1. **光錐要不要**（第二節第三列）。留著的話這張圖讀起來是「正在看某個看不見的地方」，
   拿掉就只剩「一個人坐在顯微鏡前」。我的建議是**留著**，它只花兩條線。
2. **圖裡要不要有第二個人**（助理）。分享圖沒有，這一張也沒放 —— 底圖愈簡單愈耐看。
