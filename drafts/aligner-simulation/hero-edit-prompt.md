# HERO：把白袍醫師改成男性（**改圖，不是重生成**）

2026-09-19 第六輪。底圖是 **`drafts/aligner-simulation/v4-output.jpg`**
（那一版是女醫師，其餘全部通過）。

## 為什麼改用改圖

第五輪把「換成男醫師」寫進完整提示詞重新生成，結果**整張的角度與構圖都跑掉了**
（`v5-output-rejected.jpg`：鏡頭推近、大螢幕被切掉一塊、人物比例變大），
而且那位男醫師**臉上長出法令紋與眼下陰影，看起來偏老**。使用者：
「新作的男醫師有點老　而且原版只有女醫師要調整　我比較喜歡原版的角度和畫面呈現」。

⚠⚠ **通則：只有一個人要改的時候，不要重生成。** 文生圖每一次都是重擲骰子，
構圖、角度、光、每個人的位置全部會重來；已經對的九成因此被賠掉。
站上這條路已經驗證過（見 `drafts/og-topic-general-edit-prompt.md` 那一輪的數字：
編輯版對原版，無彩空白 0.5% vs 0.5%、邊緣密度 37.5% vs 37.4%、暖色 24.6% vs 24.6%，
四項幾乎逐項相同）。

⚠ 「有點老」的成因不是年齡寫錯，是 **STYLE 段那條「每個色相用兩三階」被套到皮膚上**
（ILLUSTRATION 第十之五節）。所以改圖提示詞裡要**正面講死**：皮膚一個平塗色、
臉上只准六樣、不准有法令紋與眼下陰影，而且給一個**畫面內的錨點** ——
「不可以比左邊穿芥末黃毛衣那位看起來老」。比寫「三十幾歲」可靠得多
（同膠原蛋白那一輪的教訓：用畫面內的錨點，不要用百分比或形容詞）。

## 用法

Gemini（**建議 Pro，不要 Flash**）開**新對話** →
**只上傳 `v4-output.jpg` 這一張** → 貼下面那段。
⚠ **不要附那五張參考圖** —— 改圖的時候附參考圖會把模型拉回「重畫一張」。

## 提示詞（逐字）

```
Here is a finished illustration. Make exactly ONE change and leave everything else
pixel-for-pixel identical.

DO NOT CHANGE: the framing, the crop, the aspect ratio, the camera angle or the zoom. The
big blue floating screen and everything drawn on it — the crowded dental arch, the white
arrows, the four small amber warning triangles, the enlarged tooth with its root in the
block of bone, the amber ERROR badge and the characters in it. The man in the
mustard-yellow jumper typing at the laptop on the left, and both of his screens. The man
in blue-grey scrubs with the raised open palm and the tablet on the right. The young woman
in the pale green top looking at her phone. The wall poster, the plant, the mugs, the
plaster model, the aligner tray, the worktop, the cabinet, the walls, the floor, the long
white atmosphere arcs, all the small movement strokes, the lighting, the colours and the
drawing style. Nobody moves, nobody changes size, nothing is redrawn.

THE ONE CHANGE — THE PERSON IN THE WHITE COAT, standing in the middle of the picture in
front of the big blue screen with one index finger raised and touching the screen, IS
CURRENTLY A WOMAN. MAKE THAT PERSON A MAN.

He is a Taiwanese man in his early thirties. His hair is SHORT BLACK HAIR, neatly
side-parted, drawn as ONE flat shape with two or three interior strokes — the shoulder-
length hair is gone. He is clean-shaven, with slightly broader shoulders and a slightly
squarer jaw.

HE MUST NOT LOOK OLD. His skin is ONE SINGLE FLAT COLOUR with no modelling whatsoever.
His face contains ONLY six things — the outline of the head, the eyes, the eyebrows, the
nose, the mouth and the ears. There are NO wrinkles, NO nasolabial folds, NO lines around
the mouth, NO shadow under the eyes, NO shading on the cheeks, the jaw or the neck, and NO
grey hair. Draw his face exactly as simply as the face of the man in the mustard-yellow
jumper on the left of this picture, and HE MUST NOT LOOK ANY OLDER THAN THAT MAN.

EVERYTHING ELSE ABOUT HIM STAYS EXACTLY AS IT IS: the same position, the same height, the
same three-quarter turn towards the screen, the same white coat over the same blue-grey
scrubs, the same raised arm and pointing index finger touching the same spot on the
screen, the same other arm hanging relaxed and holding the same slim pen, the same relaxed
shoulders, the same slight tilt of the head towards the screen, the same eyes looking down
at his own fingertip, and the same small closed upward-curving smile. Keep the three tiny
movement strokes at his fingertip exactly where they are.

No writing anywhere except the characters already on the amber badge. Nothing else in the
picture changes.
```

## 收到之後要看的三件

1. **角度有沒有守住** —— 和 `v4-output.jpg` 並排看，大螢幕的四個角、左邊筆電的位置、
   右邊兩人的站位應該完全一樣。跑掉就是模型偷偷重畫了，退回再試一次。
2. **臉有沒有顯老** —— 放大看法令紋、眼下、下顎有沒有多出陰影。
3. **其他三個人有沒有被順手改到** —— 尤其右邊那兩位的臉（前幾輪就是那位最容易走鐘）。

⚠ 如果連兩次都守不住構圖，退路是**把這一張當定案（女醫師）**，
或另外用局部遮罩的工具只重畫頭部。**不要再整張重生成** —— 那是這一輪剛學到的事。
