# HERO 試改：加上情緒標記（**改圖，不是重生成**）

2026-09-20。ILLUSTRATION.md **第十八節**定出情緒標記那套字彙之後的第一次試用，
使用者指定拿這張試（「好　就試改八成人有牙周病那張」）。

底圖 **`drafts/perio-prevalence/hero-src.jpg`**（2000×1116，和線上那張同一張）。

## 為什麼是改圖

第十八之四／〈隱形矯正〉第六輪：**只加東西、不改構圖的時候不要重生成。**
這張的構圖與「四位醫事人員是四個不同的人」是第三輪才喬好的，
重擲骰子會把已經對的九成賠掉。

## ⚠⚠⚠ 標記為什麼加在**病患**身上，不是醫師身上

第十八之四那張表：**不要給已經有動作線的人再加情緒標記**
（一個人既有指尖動作線、頭上又有符號，讀起來是兩件事在搶同一個人）。

這張圖的 `MOTION AND SPEECH MARKS` 已經給了八個位置 ——
**四位醫事人員全部都有**（遞卡、口鏡、抬起的手、點片子），中控室五個人裡四個也有。
**身上一個標記都沒有的，正好就是四格裡的一般民眾。**

而那正是文章的軸：「全島都在數，**而每一個數字底下都是一個人**」。
所以標記加在病患身上不是將就，是這張圖本來就缺的那一層。

## 這一輪只用兩個符號，另外兩格**明講沒有**

| 格 | 誰 | 標記 | 為什麼 |
| --- | --- | --- | --- |
| 右上・社區活動中心 | 坐在對面的**少年** | **耳邊同心弧線**（35%） | 第十八之五那張表裡「牙科很好用」的那一個：病患在聽醫師說明 |
| 右下・一起看 X 光片 | 坐在圓凳上**抬頭看片子的男子** | **四角星**（≤ 頭高 1/4） | 想通了。對到文章的收尾（所以去量） |
| 左上・櫃檯 | — | **沒有** | 逐格點名，明講沒有 |
| 左下・診療椅 | — | **沒有** | 同上 |
| 中控室五個人 | — | **沒有** | 那一塊要撐 LINE 分享卡的 119px，不能再加東西 |

⚠⚠⚠ **兩格明講沒有，是這一輪真正要測的東西**：第十八之九預測
「標記也會串台 —— 一格給了，模型會每一格都給」。兩格有、兩格明講沒有，
一次就驗得出來。

### ⚠⚠ 刻意沒有用的兩個，和理由

- **問號** —— 它是一個**字符**。這張圖的字符白名單只開了四個數字與警示三角裡的驚嘆號
  （第六節：「一面大螢幕 ＋ 五六個圖表 ＝ 七八個會長出亂碼英文的表面」）。
  為了一個標記重開白名單，等於在這張**最怕長字**的圖上自己再開一個洞。
- **三個漸大的圓（引導泡）** —— 九個符號裡最大的（頭高 49%），而診療椅那一格
  正上方就是無影燈的臂，位置會打架；而且它一出現模型就想補泡泡本體 ＝ 長字的落點。

兩個都留到下一輪，**等這一輪證明標記畫得出我們要的線質再說**。

## ⚠⚠ 這段提示詞要正面解掉原提示詞的三條禁令

原提示詞（`hero-prompt.txt`）裡寫死了：標記「never curled, never looping」、
`MOTION AND SPEECH MARKS` 結尾「no sparkles」、`AVOID` 又有
「glow, sparkle or lens flare」。**弧線與星星正好撞這三條**，
所以改圖提示詞必須逐條開例外，而且**把其餘的禁令再講一次**
（第十八之六：家族 A 一條都沒有放寬）。

## 用法

Gemini（**建議 Pro，不要 Flash**）開**新對話** →
**只上傳 `hero-src.jpg` 這一張** → 貼下面那段。
⚠ **不要附任何參考圖** —— 改圖時附參考圖會把模型拉回「重畫一張」
（〈隱形矯正〉第六輪的教訓）。

## 出圖回來要看的五件

1. 兩個標記有沒有畫出來，而且**墨量比頭輕**（第十八之四：頭的 4~16%）。
2. **左上、左下、中控室有沒有偷偷長出標記**（串台那一條）。
3. 弧線是不是**同心弧**，不是三條直線（那會變成家族 A 的動作線）。
4. 星星是不是**只有一顆、四個角**，旁邊沒有小星星、沒有光暈。
5. **四個數字有沒有歪**，以及有沒有冒出任何新字符（第六節那條逐個放大檢查）。

## ⚠ 定案之後才要做的（現在不要做）

把這兩個標記**併回 `hero-prompt.txt`**（在 `MOTION AND SPEECH MARKS` 後面新增一段
`EMOTION MARKS`，並把那三條禁令改寫成第十八之六的分開寫法），
免得日後真的要重生成時又回到沒有標記的版本 —— 同〈隱形矯正〉第六輪的收尾。
**現在還沒併**：全份提示詞目前**如實描述著線上那一張**，
在試改被接受之前改它，就是讓它描述一張不存在的圖。

---

## 提示詞（逐字，整段可貼）

```
EDIT THIS PICTURE. Do not redraw it, do not re-compose it, do not change the style.

EVERYTHING ALREADY IN THE IMAGE STAYS EXACTLY AS IT IS: the same camera, the same framing
and crop, the same five people in the middle operations room, the same four side panels,
the same thin hand-drawn divider lines, the same props, the same colours, the same
linework, the same light. Do not move, resize, redraw or re-pose any person or object. Do
not change any face, any hairstyle, any age or any expression. Do not add or remove any
person, prop, chart, screen or line. Do not change the island, the main display, the two
amber warning triangles, the white atmosphere lines, or any of the four numbers. Do not
change any of the existing short motion strokes.

THE ONLY CHANGE IS THAT TWO SMALL HAND-DRAWN SYMBOLS ARE ADDED, one in each of two side
panels, exactly as described below. Nothing else in the picture may change.

BOTH SYMBOLS are drawn with the SAME hand-made ink line as the rest of the picture, in the
same warm dark ink, never coloured, never filled with an accent colour, and both read as
MUCH LIGHTER INK THAN THE HEAD they sit beside — fewer, faster strokes. Each one sits in
EMPTY BACKGROUND OUTSIDE the person's outline, with a clear gap of background between the
symbol and their hair. Neither one overlaps a face, hair, a prop, a wall object or a panel
divider line.

1. TOP RIGHT PANEL (the community hall) — beside the TEENAGE BOY who sits opposite the
   clinician with his hands on his knees: add TWO OR THREE NESTED CONCENTRIC CURVED ARCS
   just outside the ear on the side of his head that faces AWAY from her, the marks used to
   show that someone is listening. The arcs are nested and grow outward, the outermost is
   about one third as tall as his head, and none of them touches his hair. NOTHING is added
   to the clinician. NOTHING is added to the waiting woman and the young girl behind them.

2. BOTTOM RIGHT PANEL (looking at the X-ray together) — above the MAN IN HIS THIRTIES who
   sits on the stool looking up at the film: add ONE small FOUR-POINTED STAR in the empty
   space diagonally above his head, on the side away from the lightbox. It has EXACTLY FOUR
   points, two long and two short, it is solid dark ink, and it is NO TALLER THAN ONE
   QUARTER of his head. There is only ONE star and there is nothing around it: no second
   star, no smaller star, no dots, no rays, no glow, no halo, no burst. NOTHING is added to
   the clinician standing beside the lightbox.

THE OTHER TWO PANELS GET NOTHING AT ALL. The TOP LEFT panel (the reception desk) and the
BOTTOM LEFT panel (the dental surgery) must have NO symbol above or beside anyone — not
above the woman at the counter, not above the receptionist, not above the patient lying in
the chair, not above the dentist on the stool. THE MIDDLE ROOM GETS NOTHING: not one of the
five people in the operations room gets a symbol of any kind.

THESE TWO SYMBOLS ARE THE ONLY EXCEPTIONS TO THREE THINGS THIS PICTURE OTHERWISE AVOIDS,
AND EVERY OTHER PART OF THOSE BANS STILL HOLDS:
  • the listening arcs are the ONLY curved, nested marks allowed anywhere; every other mark
    in the picture stays a short straight stroke and none of them may be changed;
  • the single four-pointed star is the ONLY star allowed anywhere; there is still no
    sparkle anywhere else, no glow, no lens flare, no radiating focus lines, no speed lines
    and no concentration lines;
  • no speech bubble and no thought bubble is added anywhere, and no circles, dots or
    bubbles are added above anyone's head.

NO NEW CHARACTERS. The only characters anywhere in this picture are still the four numbers
with their percent signs on the main display and the short exclamation stroke inside the two
small amber warning triangles. Do NOT add a question mark, an exclamation mark, a letter, a
digit, a word, or any squiggle or row of dashes that imitates writing — nowhere, in any
language. Where writing would normally appear, the surface stays plain.
```
