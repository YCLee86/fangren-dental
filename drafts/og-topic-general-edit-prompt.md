# 第十三版：編輯提示詞（不是從零生成）

用法：Gemini（**建議 Pro，不要 Flash**）新對話 → **只上傳 `og-topic-general-v10.jpg`**
→ 貼下面這段。**不要附其他參考圖。**

```
Here is a finished illustration. Edit it, changing ONLY the two clinic staff standing on the right-hand side. Everything else must stay exactly as it is: the building and all its proportions, the sign band, the windows and window boxes, the corner, the sky and clouds, the long white air lines, the pavement and shadows, the mother and the little boy on the left, the woman dentist and the old man with the bicycle in the centre, the schoolgirl on her bicycle, the scooter, the plants, the colours and the drawing style. Do not redraw the building. Do not change the framing, the crop or the aspect ratio.

THE CHANGE — the person nearer the centre of that pair, currently a woman in a white coat, becomes a MAN: a Taiwanese man in his thirties, short black hair, clean-shaven, slightly broader shoulders, wearing the same open white coat over the same pale sage-green scrubs, drawn with exactly the same line weight, the same colours and the same simple face as everyone else in the picture. He is walking towards the LEFT of the picture and has turned his head and shoulders back over his shoulder towards the little boy in the distance on the far left. The arm nearest the boy is raised high above his shoulder, palm open, waving back at the child, and he is grinning. Keep his body the same height as the woman dentist in the centre.

His colleague — the woman in scrubs with the low ponytail holding a cold drink — stays a woman, steps half a pace behind him so he partly overlaps her, and turns her head the same way, towards the boy and his mother, smiling. Neither of them looks at the other; there is no conversation between them.

Add two or three small white movement strokes beside the man's raised hand, matching the ones already in the picture. Nothing else changes.
```

---

## 編輯二：男醫師的臉要轉向小孩（2026-08-22）

第十三版（編輯版）建築回來了、男醫師也出現了，但**他的臉與上半身朝右**，
看起來像在跟旁邊的同事打招呼。**「對誰揮手」是靠臉的朝向讀出來的，手的位置是次要的。**

```
Here is a finished illustration. Make ONE small change and leave absolutely everything else untouched — the building, the sky, the air lines, the pavement, the colours, the style, and every other person including the woman in scrubs beside him.

THE CHANGE — the man in the white coat on the right is waving, but he is facing the wrong way. Turn his HEAD and his UPPER BODY to face LEFT, towards the little boy in the distance at the far left of the picture. We should see his face in three-quarter view from his left side, his nose, chin and gaze all pointing across the picture at the boy, his chest turned that way too, his shoulders squared towards the boy. He is smiling at the child. Keep his raised waving arm exactly where it is, and keep his legs mid-stride as they are. Do not move him, do not resize him, do not change his clothes.

The whole picture must otherwise stay pixel-for-pixel the same.
```

## 編輯三：補上轉角後面那一段（後棟）

使用者指出實景照裡**轉角那一棟後面還連著一段**（同樣的清水模與突出窗盒，
**屋簷線往下退一階**，順著側巷延伸）。插圖到轉角就切掉，看起來像孤立的方塊。

```
Here is a finished illustration. Make ONE addition and leave everything else untouched — all the people, the pavement, the sky, the clouds, the white air lines, the shopfront, the glass, the sign band, the colours and the drawing style must stay exactly as they are.

THE ADDITION — right now the building stops at the corner, which makes it look like a single isolated block. In reality the same building CONTINUES past the corner, down the side lane. Draw that continuation: attached to the corner block and running away from us towards the right edge of the picture, a SECOND SECTION of the same building — the same pale warm-grey concrete, the same dark metal window boxes projecting from its wall in a row, and its own thin dark overhanging eave whose line STEPS DOWN one level lower than the corner block's roof. It recedes in gentle perspective, becoming smaller and paler towards the right edge, where it is cropped by the frame. The narrow side lane runs along its base, past the white cylindrical planters.

Keep it simple and quiet — it is background: fewer lines, no extra doors, no shops, no signs, no writing, and it must never draw attention away from the people in front.
```

⚠ **一次只改一件。** 兩件一起下，漂掉的風險高一階（第十一、十二版就是這樣壞的）。

### 這一條路已經驗證有效（數字）

編輯版對第十版：無彩空白 0.5% vs 0.5%、邊緣密度 37.5% vs 37.4%、
左半密度 35.9% vs 35.8%、暖色 24.6% vs 24.6% —— **四項幾乎逐項相同**，
證明「只編輯一小塊」真的不會動到其他地方。
