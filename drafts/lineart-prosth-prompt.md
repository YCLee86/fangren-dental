# 線稿底圖的提示詞：植牙・假牙重建（`lineart-prosth`）

**狀態：⏳ 2026-08-25 寫好，等生圖。** 規格見 [topic-lineart-prompt.md](topic-lineart-prompt.md)（模板）
與 ILLUSTRATION.md 第十二節。分享圖已於同日定案上線（`assets/og-topic-prosth.jpg`）。

## 使用者選的梗：**A＋B**

「Ⓐ 醫師拿著地圖指路」＋「Ⓑ 夫妻挽著手登階」= 左下那一組三個人，連同他們腳下的階梯。

## ⚠⚠ 這一科要破模板的一條規矩：**畫到腳，不是畫到腰**

前四科都是 `cropped at the waist`（診間場景，站著或坐著，腰以上就讀得出來）。
**這一張不行 —— 「正在登階」這件事是靠腿與腳下那幾階讀出來的**，切在腰就變成三個人站著。
代價是線會變多（門檻是線佔畫面 4~6%），所以階梯**只畫兩三階的邊線 ＋ 一條斜扶手**，
不畫整座樓梯、不畫盆栽、不畫背景。

## 這一科的兩個數字（現算的，不要抄前五科）

| | 值 |
| --- | --- |
| 套色 | `#335b8b` |
| **柔墨（`#5c5f57`）的 AA 上限 α** | **0.097** ← 六科裡**最緊**的一支 |
| 深墨（`#2a2c27`）的上限 α | 0.588 |

六科對照：一般牙科 .100／牙周 .115／顯微根管 .107／兒牙 .152／矯正 .120／**植牙 .097**。
成因是 `#335b8b` 是六支套色裡最深的。**手機那一段大概只能給到 .09~.10。**

## 要附的七張圖（三組，說明分開寫）

| # | 檔案 | 說明 |
| --- | --- | --- |
| 1~5 | `drafts/lineart-ref-1-walking.png` ~ `-5-bubbles.png` | 「**只參考線條畫法**（均勻粗細、無濃淡、無陰影、無材質、大量留白）；**不要參考題材、人物、道具**。」 |
| 6 | **`drafts/lineart-pose-prosth.png`**（2026-08-25 從分享圖裁：`x120 y300 560×452 ×2 → 1120×904`） | 「**姿勢、視線方向、髮型、表情、手的高度與角度、腳踩在階梯上的位置，完全照這張**；但畫法照 1~5。⚠ 這一張**要畫到腳**，不是畫到腰。」 |
| 7 | `assets/og-topic-prosth.jpg` | 「人物長相、服裝、年齡層照這張，但**畫法完全不同** —— 那張是上色插畫。」 |

## 提示詞（可直接複製）

```
A single-colour LINE DRAWING, square, 1200 x 1200, on a plain near-white background.

THE MOST IMPORTANT RULE — EVERY LINE HAS EXACTLY THE SAME WEIGHT AND THE SAME DARKNESS.
Uniform stroke width throughout, about 5 to 7 pixels at 1200px wide. No thick-and-thin
strokes, no tapering, no pressure variation, no sketchy or hand-drawn wobble, no double
lines, no broken lines. Think of a clean vector icon illustration, not a pencil sketch.

NO SHADING OF ANY KIND — no hatching, no cross-hatching, no stippling, no screentone,
no gradients, no grey tones, no drop shadows, no cast shadows on the ground, no highlights.
Outline only. Do not fill any area with solid colour, including hair and clothing.

WHO — three people on a short flight of stairs: a married couple in their fifties climbing
the steps, and a dentist just above them showing them a map. Follow the attached
photo-reference for pose, gaze, hair and expression EXACTLY; only the drawing style comes
from the line-art references.

  - LEFT — the husband, about fifty-five, in a short-sleeved polo shirt. He is MID-STRIDE ON
    THE STEPS: his front foot is already planted on the step above, his back leg still
    straight on the lower step, so his body leans slightly forward and upward. His body is
    in THREE-QUARTER view, turned up and to the RIGHT, NOT square to the viewer. HIS FAR ARM
    IS RAISED HIGH AND WAVING towards someone off-frame beyond the TOP RIGHT corner:
      * the upper arm points up and forward at roughly 45 degrees from his shoulder;
      * the hand is above the level of his own head;
      * the palm is turned outward at an ANGLE, seen partly edge-on;
      * the fingers are relaxed and slightly spread.
    His near arm is bent, and his wife's hand is hooked through it. His hair is SHORT, swept
    back, receding a little at the temples. HIS MOUTH IS WIDE OPEN — he is calling out.

  - MIDDLE — the wife, about fifty, in a plain short-sleeved round-neck top. She stands one
    step below and slightly behind him, ONE ARM HOOKED THROUGH HIS ELBOW, her other hand
    raised only to about shoulder height in a SMALL wave, elbow bent and close to her side.
    Her hair is a SHORT BOB that just reaches her jaw, curving inwards, with a side parting —
    it is NOT long, NOT tied back. She is smiling with her mouth slightly open, looking the
    same way he is.

  - RIGHT — the dentist, a woman in her forties, standing on the step above them and turned
    back down towards them, in an OPEN white coat over a V-neck scrub top. SHE HOLDS AN OPEN
    PAPER MAP IN ONE HAND at chest height, tilted so the couple can see it; HER OTHER ARM IS
    RAISED AND HER INDEX FINGER POINTS UP AND OFF-FRAME TO THE TOP RIGHT, along the direction
    of the stairs. Her hair is TIED UP IN A SMALL LOW BUN at the back of her head, with a
    side-parted fringe. Her mouth is slightly open — she is explaining something.
    THE MAP IS BLANK: draw only the outline of the folded sheet and ONE simple winding line
    with three small dots on it. No writing, no letters, no numbers, no symbols.

⚠ CRITICAL — ALL THREE FACES POINT THE SAME WAY: up and off-frame to the TOP RIGHT. Nobody
looks at the viewer, and the couple do not look at each other.

⚠ CRITICAL — NOT A CAMPAIGN-POSTER WAVE. The husband is NOT a frontal, symmetrical figure
with a straight arm and a flat open palm beside his head. His body is angled, he is walking
upward, and the wave is thrown up and forward past the top-right corner.

FACES — extremely simple: eyes are small solid dots or short curved strokes, the nose is one
tiny stroke or omitted. No eyebrow detail, no eyelashes, no blush, no wrinkles. The husband's
mouth is a wide open oval (calling out); the wife's is a small open smile; the dentist's is a
small open oval (speaking). Hair is drawn as an OUTLINE ONLY with a few interior strokes for
the parting — it must not be filled in.

COMPOSITION — ⚠ THIS ONE IS DRAWN FULL-LENGTH, DOWN TO THE SHOES — do NOT crop at the waist.
"Climbing the stairs" is read from the legs and feet, so the feet and the steps under them
must be visible. The three figures together occupy the middle of the square and about 75% of
its height, arranged along a diagonal that rises from the lower left to the upper right.
Generous empty margin on all four sides.

THE STAIRS — draw them with as few lines as possible: only TWO OR THREE steps under the
figures, each step just its front edge and one short vertical line, plus ONE simple straight
handrail running diagonally up behind them (a single line with two short posts). Nothing
else: no full staircase, no landing, no flags, no plants, no pots, no table, no railing
detail, no floor line beyond the steps themselves.

BACKGROUND — completely empty apart from those few step lines and the handrail. No room, no
doorway, no window, no wall, no furniture, no plants, no clinic sign, no speech bubbles, no
icons, no arrows, no text, no logo, no decorative sparkles, no frame or border.

COLOUR — the drawing is in ONE colour only: #335b8b, on a near-white background, hex #f7f8f7.
Nothing else is coloured. No second colour anywhere.

The result should read as a calm, friendly, extremely clean editorial line illustration with
a lot of white space.
```

## 生出來之後

1. 量三個門檻：`node drafts/lineart-measure.mjs <檔>` —— 線佔畫面 4~6%、筆畫寬 4~6‰、
   粗細一致（實心填色 0 塊）。⚠ 這一張人多又有階梯，**線佔比最可能超標**，
   超了就把階梯再減（只留兩階、拿掉扶手）。
2. `node tools/topic-lineart.mjs prosth --art <線稿檔> --crop x,y,w,h [--flip]`
   ⚠ 生成的線稿幾乎一定會多畫一條地面線，要用 `--crop` 裁掉。
   ⚠ **要不要 `--flip` 現場判斷**：圖擺在介紹區右下角，人物要朝**版心裡面**（朝左）。
   這一張的三個人朝右上 → **很可能要翻**，但翻了之後醫師的手指會指向左上（朝版心），
   反而更好。⚠ `--crop` 的座標一律在**原圖**上量（先裁再翻）。
3. 大小／濃度／分段四個值做成提案頁讓使用者挑（`tools/lineart-preview.mjs`），
   手機那一段的濃度上限是 **.097**。
