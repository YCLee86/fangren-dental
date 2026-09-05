#!/usr/bin/env node
/* 〈三個月一次的洗牙與塗氟〉HERO 五個提案的提案頁
 *
 *   node drafts/three-month-recall/hero-preview-gen.mjs
 *   → preview/three-month-recall-hero/index.html
 *
 * ⚠ 這一頁是**自己寫的獨立頁**，不是 index.html 的複本
 *   （同 clinic-schedule 那一輪，CLAUDE.md 第八節：小元件的提案頁這樣做省事很多），
 *   所以第八節那四個坑一個都不必踩：沒有相對路徑要改、沒有 counter.js、
 *   沒有 SEO:START、沒有 RELATED。class 一律 pv- 前綴。
 *
 * ⚠⚠ **五份提示詞的唯一出處是 HERO-PROMPTS.md**，這一支只把它的 fenced code block
 *   抓出來排版 —— 不要在這裡再寫一份，不然哪天改了一邊就開始說謊。
 *
 * 守門：抓不到五塊、少了 noindex、或提示詞裡出現中文，都 throw。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "preview/three-month-recall-hero/index.html");

const md = fs.readFileSync(path.join(HERE, "HERO-PROMPTS.md"), "utf8");

// 只抓「四、五份提示詞」那一節底下的 code block
const sec = md.split("## 四、五份提示詞")[1];
if (!sec) throw new Error("HERO-PROMPTS.md 裡找不到第四節");
const blocks = [...sec.matchAll(/### (Ⓐ|Ⓑ|Ⓒ|Ⓓ|Ⓔ|Ⓕ) ([^\n]+)\n\n```\n([\s\S]*?)\n```/g)]
  .map((m) => ({ key: m[1], title: m[2].trim(), prompt: m[3] }));
if (blocks.length !== 6) throw new Error(`抓到 ${blocks.length} 份提示詞，應該是 6 份`);
for (const b of blocks) {
  if (/[一-鿿]/.test(b.prompt)) throw new Error(`${b.key} 的提示詞裡有中文`);
  if (!/CRITICAL — NO WRITING ANYWHERE/.test(b.prompt)) throw new Error(`${b.key} 少了 NO WRITING 那一段`);
  if (!/\b(16:9|4:3|3:2|5:4|1:1|4:5)\b/.test(b.prompt)) throw new Error(`${b.key} 開頭沒有指定長寬比`);
}
// ⚠ Ⓕ 的風格是靠參考圖給的（第三之二節），那一段掉了整案就退回文字描述風格。
{
  const f = blocks.find((b) => b.key === "Ⓕ");
  if (!/REFERENCE IMAGES — THREE IMAGES ARE ATTACHED/.test(f.prompt)) throw new Error("Ⓕ 少了『先餵參考圖』那一段");
  if (!/TWO LEVELS/.test(f.prompt)) throw new Error("Ⓕ 少了『兩層畫法』那一段");
  // ⚠ 第三版加的兩段：治「太寫實」的就是這兩段，掉了就會回到肖像式的臉與技術製圖。
  if (!/\nFACES —/.test(f.prompt)) throw new Error("Ⓕ 少了『臉』那一段");
  if (!/ECONOMY OF LINE/.test(f.prompt)) throw new Error("Ⓕ 少了『用最少的筆畫』那一段");
  // ⚠⚠ 第四版加的：治「臉呆板」的三件。少一件就會走回一整排空臉。
  if (!/THESE FACES ARE SIMPLE, BUT THEY ARE NOT BLANK/.test(f.prompt)) throw new Error("Ⓕ 少了『臉不是空的』那一段");
  if (!/WHAT A FACE HAS/.test(f.prompt)) throw new Error("Ⓕ 的臉那一段沒有『要有什麼』那一半");
  if (/A mouth is one short stroke/.test(f.prompt)) throw new Error("Ⓕ 又出現第三版那句『嘴巴是一筆』");
  if (/ALL SIX ARE CALM, ORDINARY AND AT EASE/.test(f.prompt)) throw new Error("Ⓕ 又出現『六個人都很平常自在』（＝六張一樣的臉）");
  // ⚠ 第二版那句「細到叫得出這是什麼房間」＝ 在叫它畫準，不可以回來。
  if (/enough detail that you could name the room/.test(f.prompt)) throw new Error("Ⓕ 又出現第二版那句『細到叫得出房間』");
  // ⚠⚠⚠ 第五版加的：治「蠟筆風格」的四件。前兩件是第四版自己弄丟的，所以擋的是「還在不在」。
  if (!/HOW FLAT AND SOLID THE COLOUR IS/.test(f.prompt)) throw new Error("Ⓕ 的參考圖那一段又少了『顏色多平』");
  if (!/THEIR ROOM, simply drawn/.test(f.prompt)) throw new Error("Ⓕ 中間那一格又少了『診所那一角』");
  if (!/TOGETHER THEY READ AS WELCOME AND INTRODUCTION/.test(f.prompt)) throw new Error("Ⓕ 中間那一格又少了『接納與介紹』");
  if (!/COLOURED PENCILS, IT IS WRONG/.test(f.prompt)) throw new Error("Ⓕ 少了『看起來像蠟筆就是錯的』那一句判準");
  if (/coloured-pencil grain/.test(f.prompt)) throw new Error("Ⓕ 又出現第一~四版那句『每個表面都有色鉛筆顆粒』");
  if (/Nothing in this picture is drawn accurately/.test(f.prompt)) throw new Error("Ⓕ 又出現第三版那句『沒有一樣東西是畫準的』（會拉走填色）");
  // ⚠⚠⚠ 第六版加的：治「首頁卡片的重點都在中間的醫事人員」。卡片是 16:9 置中裁切，
  //     中間那一格是唯一完全沒被裁到的，所以「站在正中央的是誰」＝「卡片的主角是誰」。
  if (!/LOWER RIGHT — THE CLINIC/.test(f.prompt)) throw new Error("Ⓕ 的診所不在右下那一格");
  if (!/TOWARDS THE UPPER LEFT OF THE/.test(f.prompt)) throw new Error("Ⓕ 的醫事人員沒有轉向左上");
  if (!/IT IS A HOME, NOT THE CLINIC/.test(f.prompt)) throw new Error("Ⓕ 中間那一格沒有寫明是家不是診所");
  if (!/THE THING IN THE CENTRE IS THE WOMAN/.test(f.prompt)) throw new Error("Ⓕ 少了『裁成卡片之後正中央是誰』那一條");
  if (/picture, holding TWO members of clinic staff/.test(f.prompt)) throw new Error("Ⓕ 的醫事人員又回到中間那一格");
}
// 三張參考圖：站上自己的 HERO，相對路徑往上兩層。
// ⚠ 不要改成根目錄絕對路徑 /assets/… —— 舊站 yclee86.github.io 還活著，那邊會壞。
const REFS = [
  { f: "hero-gum-photo", t: "〈牙齦流血〉", why: "⭐ <b>最重要的一張</b>：一格一個人、一格一個家、一格一個底色，連「只有一格是暗的」都已經在裡面。" },
  { f: "hero-checkup-photo", t: "〈定期檢查〉", why: "<b>環境密度</b>看這一張：東西很多，可是那些線全部比人淡。中間那一格的診所照它畫。" },
  { f: "hero-kids-photo", t: "〈換牙〉", why: "<b>臉、表情、手</b>看這一張：五官很簡單但表情讀得出來。" },
];
for (const r of REFS) {
  if (!fs.existsSync(path.join(ROOT, "assets", r.f + "-1600.jpg"))) throw new Error(`參考圖不在：${r.f}`);
}

// ⚠ Ⓕ 排到最前面 —— 它是建議的那一案，手機上不能要他捲過五案才看到。
//    markdown 裡仍然照字母順序寫，兩邊不必一致。
const ORDER = ["Ⓕ", "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ"];
blocks.sort((a, b) => ORDER.indexOf(a.key) - ORDER.indexOf(b.key));

// 每一案的中文說明（畫面／對到哪一段／擋的坑）
const NOTES = {
  "Ⓐ": {
    lead: "同一張診療椅、同一個機位、同一位醫師，四格裡換的是坐上去的人。",
    maps: "〈哪些人適用〉",
    scene: [
      "三十幾歲的孕婦、五十幾歲的男性上班族、七十幾歲的阿嬤、四十幾歲綁著頭巾的女性，四個人依序坐上同一張椅子。",
      "醫師的動作每一格微調：拿口鏡看／側頭聽／遞漱口杯／笑著點頭。",
    ],
    guards: [
      "身分靠<b>手邊的東西</b>給，不靠身體給 —— 媽媽手冊、膝上的藥袋、靠著椅子的拐杖、手邊的保溫杯。不畫點滴、不畫輪椅、不畫病容。",
      "四個人的姿勢、視線、表情各自不同，衣服顏色互不重複 —— 不然會變成型錄。",
      "站上最好讀的手法是「同一個機位重複、只有一件事在變」；〈牙齦流血〉那張變的是時間，這一張變的是人。",
    ],
    why: "直接畫「對象」＝ 這一篇的定位，而且一眼破掉「這是老人的事」那個刻板印象。",
  },
  "Ⓑ": {
    lead: "一張診間桌面幾乎佔滿整張圖，桌上是藥袋、藥板、用藥紀錄、健保卡。",
    maps: "〈來的時候〉",
    scene: [
      "微微俯視。只看得到兩雙手：病患的手把藥袋推過去，醫師的手扶著翻開的小冊。",
      "畫面最上緣只露出一點診療椅的扶手與白袍下襬，剛好夠說這是牙科。",
    ],
    guards: [
      "這一格長字的風險最高（藥板、小冊、卡片、藥袋都是「該有字的表面」），所以那一段禁令要逐項點名。",
      "桌上每多一個「沒指定內容的表面」，就多一個外溢的落點 —— 每一樣東西的表面都寫死了。",
    ],
    why: "最不像牙科插畫、辨識度最高，而且畫的是診所真正希望病人做的那件事。缺點是它只講到文章最後一段。",
  },
  "Ⓒ": {
    lead: "孫女剛塗完氟拿到貼紙，阿公手上也有一張一模一樣的。",
    maps: "〈年紀大了，氟的角色會變〉",
    scene: [
      "兩張並排的診療椅。右邊小孫女得意地伸手接貼紙，左邊阿公側坐著看她，半是覺得自己好笑、半是有點得意。",
      "中間的媽媽笑出來。人是主角、佔畫面一大半。",
    ],
    guards: [
      "貼紙上不能有字，畫一顆簡單的牙。",
      "旁邊的人不可以看起來在笑他 —— 要寫成「一起覺得好玩」，不是「笑一個老人在做小孩的事」。〈缺牙之後〉那篇踩過這個坑。",
      "阿公不可以被畫成虛弱、駝背、可憐的樣子。",
    ],
    why: "解掉整篇最反直覺的那一句「塗氟不再只是小孩才做的事」，記憶點最高。",
  },
  "Ⓓ": {
    lead: "醫師和病患在談，上面一個大泡泡分三段，畫的是他自己的生活。",
    maps: "〈為什麼是三個月〉",
    scene: [
      "泡泡裡三段：半夜起來倒水喝（嘴巴乾）／早餐前在餐桌上量血糖／早上刷牙時停下來，對著鏡子看一處紅腫的牙齦。",
      "一個大圓角泡泡加兩條細分隔線，不是三個泡泡，也沒有箭頭。",
    ],
    guards: [
      "三段都不要器械、不要剖面圖 —— 使用者嫌過「太學術了，是我們看模型或書上才會出現的樣子」。",
      "牙齦的紅靠<b>形狀</b>（邊緣鼓起、乳突最腫）不是靠色名，而且不畫血。",
      "⚠ 這個骨架和〈拔智齒〉那張一樣。選它就要接受兩張圖一眼看過去像親戚。",
    ],
    why: "唯一畫得出「口乾／血糖／傷口慢」那三件的做法，而且用生活場景講、不是醫學圖。",
  },
  "Ⓔ": {
    lead: "同一個窗邊、同一張椅子、同一個人，三格裡變的只有窗外的季節。",
    maps: "〈不只是把牙結石清掉〉",
    scene: [
      "六十幾歲的男人坐在候診的長椅上等，很自在。窗外依序是綠葉的樹／下著雨／葉子黃了。",
      "他每一格穿的不一樣（短袖 → 薄外套 → 毛背心），手上的東西也不同（帽子／傘／保溫杯）。",
    ],
    guards: [
      "這一格沒有任何「牙」的資訊，所以識別物要自己列：牆上無字的牙齒海報、門內露出的診療椅一角、淺色刷手服。",
      "窗外的雨要畫成<b>一群同向的短線</b>，不是一條長曲線 —— 〈擴張牙弓〉那張的「靈魂出竅」就是這樣來的。",
      "不准出現月曆、時鐘或任何數字。",
    ],
    why: "最安靜、最像站上的調性，講的是「這件事已經是他生活的一部分」。缺點是它講「常來」不講「誰」。",
  },
  "Ⓕ": {
    lead: "整張圖是七格拼起來的：六個不同的人各自在自己家裡一格，中間一格是兩位醫事人員。",
    maps: "〈哪些人適用〉（Ⓐ 的改寫）",
    scene: [
      "格子是<b>不規則的多角形</b>、大小不一，中間隔著手繪的細線 —— 不是整齊的四方格。每一格自己一個很淡的底色。",
      "七格：<b>中間</b>孕婦／<b>左上</b>早餐桌上量血糖／<b>右上</b>拿拐杖的阿嬤／<b>右</b>桌上放著藥袋的中年男子／<b>左下</b>半夜起來倒水喝／<b>左</b>綁著頭巾、手邊保溫杯的中年女性 —— <b>這六個人都在自己家裡，不是在診間</b>；<b>右下</b>那一格才是診所。",
      "<b>中間那一格最大，裡面是孕婦</b>（六個人之一，不是診所）—— 首頁卡是 16:9 置中裁切，站在正中央的人就是卡片的主角。",
      "<b>右下那一格是診所</b>：醫師（白袍配淺鼠尾草綠刷手服）站前半步，<b>手往左上攤開、穿過整張圖</b>；護理師（只有刷手服、暗一階的青藍）站後半步，側頭往同一個方向點頭。<b>兩個人都轉向左上，臉與手都在那一格的上半部</b>（那一格貼著畫面下緣，會被卡片切掉一截）。",
      "<b>比例 4:3</b>，比站上現在那十一張高（見最上面那一段）。",
    ],
    guards: [
      "⚠⚠⚠ <b>第六版（09-05 更晚）治的是「首頁卡片的重點都在中間的醫事人員」，量過是三件事疊起來的</b>：首頁卡的縮圖是 <b>16:9</b>，所以 4:3 的圖上下各被裁掉 <b>12.4%</b>；而<b>裁切是置中的</b>，於是<b>中間那一格是七格裡唯一完全沒被裁到的</b>（其餘六格各被切掉一塊）；再加上它本來就最大（整張圖 32.3%、在卡片那一條裡 <b>36.1%</b>）—— <b>卡片上唯一完整、最大、又在正中央的東西就是那兩位醫事人員</b>。實際裁成 393px 看過，六個人只剩碎片。",
      "⚠⚠⚠ <b>通則：一張圖會在兩個尺寸、兩個比例底下被看</b> —— 文章頁是完整的 4:3、首頁卡是置中裁切的 16:9。<b>「畫面正中央」在文章頁只是構圖的一個位置，在卡片上等於唯一的主角。</b>畫之前先問：<b>這張圖被裁成卡片之後，站在正中央的是誰？</b>四件改動：右下換成診所（兩位轉向左上、手往左上伸；⚠ 那一格貼著下緣，明寫<b>臉與手都要在那一格的上半部</b>）／中間換成孕婦（剪影就讀得出來）／左上換成量血糖的那位／每一格的顏色跟著位置重排。⚠ <b>中間那一格仍然最大是刻意的</b>：站上量過「多格分割、沒有視覺中心的場面，縮到小尺寸會整張糊掉」，所以是換掉站在中央的人，不是拆掉中央。",
      "⚠⚠⚠ <b>第五版（09-05 更晚）治的是「變成蠟筆風格了」，而且成因是我第四版的 diff</b>：量顆粒（3×3 鄰域的亮度極差）—— 真正平塗的面積站上是 22~31%、第三版 32.5%，<b>第四版只剩 9.1%</b>；有硬邊的像素站上 21~32%、<b>第四版 54.2%</b>，多出來的不是輪廓是<b>填色裡面的筆觸</b>。逐行比對第三、四版：<b>①「抄它顏色多平」被我刪掉</b>（第四版為了強調臉把後半整句換掉，而那是唯一一句叫模型看參考圖顏色怎麼上的）、<b>②「診所那一角」與「接納與介紹」兩整段被覆蓋掉</b>（第二版那個單調的成因回來一半）、<b>③「每個表面都有色鉛筆顆粒」</b>那句<b>從第一版就在</b>、前三版都沒事，第四版把「手繪／很快／不準」的字加多之後它就變成主角了。",
      "⚠⚠⚠ <b>通則：每一輪為了治新問題而重寫某一段，會順手弄丟上一輪為了治舊問題寫進去的句子。</b>三輪連著發生。做法：<b>改完一定要 diff 上一版</b>，逐條問「這一行是為了治什麼，現在還在不在」，並<b>把治過的病寫成守門</b>（產生器現在擋十二件）。第五版四件：那一句補回來並排到最前面；顆粒整句換成「<b>填色裡面沒有任何筆觸</b>」＋判準「看起來像用蠟筆或色鉛筆塗的，就是錯的」；「沒有一樣東西是畫準的」收掉（它和「填色要平」互相拉扯）；<code>AVOID</code> 最前面補一整排蠟筆／排線／紙紋／毛邊。",
      "⚠⚠⚠ <b>第四版（09-05 更晚）治的是「人的臉變得有點呆板」，成因是第三版的提示詞自己寫的</b>：治「太寫實」那一段<b>全部都是禁令</b>（沒有睫毛／眼白／反光點／眼皮的褶／陰影／腮紅／一根根的頭髮 —— 七條全是「不要有什麼」，一條「要有什麼」都沒有），寫實是拿掉了，<b>表情的載體也順手被清空</b>。對照站上三張放大：<b>眉毛</b>每張臉都有、角度就是情緒（第三版一個字都沒提）；<b>嘴</b>開合幅度最大，笑起來是張開的一個形狀＋一塊淺色的牙（第三版寫「嘴是一筆」）；<b>眼睛</b>開心時彎成月牙；<b>腮紅</b>站上有、第三版直接禁掉；<b>年紀的線</b>（嘴邊一條笑紋、眼尾兩筆）也被「no contour」一起掃掉。",
      "⚠⚠⚠ <b>第二個成因也是我寫的：「六個人都很平常、很自在」</b> —— 那句是為了擋病容，卻等於叫它畫六張一樣的表情。現在<b>逐格點名</b>（孕婦低頭偷偷笑／阿嬤伸手拿杯子、眉毛抬起來／中年男子一邊眉毛高、嘴偏一邊／量血糖的人刻意就是很平常／半夜那位眼睛只剩一條縫／頭巾那位讀到有趣的地方笑出來），中間兩位也各給一種。判準也多一條反方向的：<b>七張臉如果互換位置沒有人看得出來，也是錯的</b>。",
      "⚠⚠⚠ <b>第三版（09-05 更晚）治的是「還是比站上寫實了一點」，而且是量過才改的</b>：站上十一張自己就分兩群，〈定期檢查〉48%、〈貝氏刷牙法〉50% 的面積是近白的，<b>比第二版那張還淡</b> —— 所以「太寫實」不在顏色。真正的成因是兩件<b>「畫得太準」</b>：<b>臉有立體感</b>（眼皮、眼白、反光點、顴骨、一根根的頭髮）、<b>每一樣東西用的筆畫太多</b>（電風扇畫出整圈護網、磁磚畫出完整格線、透視是準的）。",
      "⚠⚠⚠ <b>而這兩件是第二版的提示詞自己寫出來的</b>：那一段「兩層畫法」我寫了「環境要細到你叫得出這是什麼房間」——<b>那句話等於在叫它畫準，而畫得準正是寫實的定義</b>；它同時是整份最長的一段（＝口外那一輪的通則：哪一段字最多，模型就把哪一個當主角）。第三版新增<b>「臉與手」</b>與<b>「用最少的筆畫」</b>兩段放到最前面，並把「兩層畫法」砍掉一半、反過來寫成「房間不是比人更細，是比人更粗略；東西多，每一樣簡單」。",
      "⚠⚠⚠ <b>出圖之前要先餵上面那三張參考圖</b> —— 風格用文字描述一定會漂（〈生物陶瓷〉那一輪的形狀失敗三四輪，改成給圖之後一次就中）。提示詞第一段明寫「文字和參考圖衝突時以參考圖為準」。",
      "⚠⚠ <b>「環境要更寫實」和「環境要淡化」不衝突，是兩件事</b>：要的是<b>東西多、但畫得淡</b>。提示詞多了一整段「兩層畫法」——人用最深最粗的線、房間裡的東西樣樣都畫但線更細更淡，並明寫「環境的線永遠不可以和人的線一樣深」。唯一例外是那個人手上正拿著的東西。",
      "⚠⚠ <b>六格的家從一句話換成一張道具清單</b>（磁磚牆、瓦斯爐上的水壺、掛著的鍋鏟、竹編籃、立扇、塑膠桌巾、電鍋、鐵窗、瀝水架、藤椅、針織毯……）。第一版單調的成因就在這裡：中間那一格原本只寫「一點診所的暗示」。",
      "⚠ 順帶擋掉<b>時鐘、月曆、手機與電腦螢幕、任何數位顯示</b> —— 六個家一寫實它們就會自己長出來，而它們身上一定有數字。血糖機那個小螢幕也逐項點名了。",
      "⚠ <b>不做對話框</b> —— 這一站的圖一個字都不能有，而空的對話框讀起來是「在想一件沒有內容的事」。參考的那三張日本海報全部靠文字說話，我們不能照抄那一半。<b>要對話框版，一句話就換得掉。</b>",
      "⚠ <b>兩位醫事人員都不看鏡頭</b>（站上的紅線）。「接納」靠身體微微前傾與攤開的手，「介紹」靠兩個人都在看那幾格。要她們看鏡頭也是一句話，但要你先點頭。",
      "⚠⚠ <b>上下各 12% 會被首頁的卡片切掉</b>（卡片縮圖固定 16:9），所以臉和那幾樣關鍵的東西一個都不能放在那裡 —— 提示詞裡已經寫死這一條。",
    ],
    why: "把 Ⓐ 的內容（誰要三個月一次）換一個排法：從「同一張椅子換人坐」變成「六個人各自在自己的生活裡，中間有人在看著他們」。單調的成因是背景一直沒變，不是人不夠多。",
  }
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cards = blocks.map((b, i) => {
  const n = NOTES[b.key];
  return `
  <section class="pv-case" id="case-${i + 1}">
    <h2><span class="pv-mark">${b.key}</span>${esc(b.title)}</h2>
    <p class="pv-lead">${n.lead}</p>
    <p class="pv-maps">對到文章的　<b>${n.maps}</b></p>
    <h3>畫面</h3>
    ${n.scene.map((s) => `<p>${s}</p>`).join("\n    ")}
    <h3>擋掉的坑</h3>
    <ul>${n.guards.map((g) => `<li>${g}</li>`).join("")}</ul>
    <h3>為什麼提這一案</h3>
    <p>${n.why}</p>
    <div class="pv-pbar"><span>提示詞</span><button class="pv-copy" type="button" data-i="${i}">複製</button></div>
    <pre class="pv-prompt" id="p${i}">${esc(b.prompt)}</pre>
  </section>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>三個月一次的洗牙・HERO 五個提案 — 芳仁牙醫診所</title>
<style>
:root{
  --paper:#e2e5e6; --card:#f4f4f5; --ink:#2a2c27; --ink-soft:#5c5f57;
  --rule:#c9ccc6; --accent:#3f654a; --deep:#2c5238;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  line-height:1.85;font-size:16px}
.pv-shell{max-width:44rem;margin:0 auto;padding:0 14px 4rem}
.pv-head{background:#393736;color:#f4f4f5;padding:.9rem 0}
.pv-head .pv-shell{padding-bottom:0}
.pv-head b{font-weight:700;letter-spacing:.04em}
.pv-head span{color:#c9ccc6;font-size:.86rem;margin-left:.6rem}
h1{font-size:1.5rem;line-height:1.5;margin:1.8rem 0 .4rem}
.pv-sub{color:var(--ink-soft);font-size:.94rem;margin:0 0 1.4rem}
.pv-note{background:var(--card);border:1px solid var(--rule);border-radius:12px;
  padding:1rem 1.1rem;margin:0 0 2rem}
.pv-note p{margin:.4rem 0}
.pv-note p:first-child{margin-top:0}
.pv-note p:last-child{margin-bottom:0}
.pv-ratio table{border-collapse:collapse;width:100%;font-size:.88rem;margin:.6rem 0}
.pv-ratio th,.pv-ratio td{border-bottom:1px solid var(--rule);padding:.4rem .3rem;text-align:right;white-space:nowrap}
.pv-ratio th:first-child,.pv-ratio td:first-child{text-align:left}
.pv-ratio tr.pv-pick td{background:rgba(63,101,74,.09)}
.pv-tw{overflow-x:auto}
.pv-t2 th,.pv-t2 td{border-bottom:1px solid var(--rule);padding:.35rem .3rem;text-align:right;white-space:nowrap}
.pv-t2{border-collapse:collapse;width:100%;font-size:.88rem;margin:.6rem 0}
.pv-t2 th:first-child,.pv-t2 td:first-child{text-align:left}
.pv-t2 tr.pv-pick td{background:rgba(63,101,74,.09)}
.pv-wrap th,.pv-wrap td{white-space:normal;text-align:left;line-height:1.6}
.pv-wrap td:first-child,.pv-wrap th:first-child{width:4.6em}
.pv-ratio code{font-size:.9em;background:#fff;border:1px solid var(--rule);border-radius:4px;padding:0 .25em}
.pv-ref{margin:1rem 0 0}
.pv-ref img{display:block;width:100%;height:auto;border:1px solid var(--rule);border-radius:8px;background:#fff}
.pv-ref figcaption{font-size:.88rem;color:var(--ink-soft);line-height:1.7;margin-top:.35rem}
.pv-case{background:var(--card);border:1px solid var(--rule);border-radius:12px;
  padding:1.1rem 1.1rem 1.3rem;margin:0 0 1.6rem}
.pv-case h2{font-size:1.18rem;line-height:1.5;margin:0 0 .5rem;display:flex;
  align-items:baseline;gap:.5rem;flex-wrap:wrap}
.pv-mark{display:inline-block;background:var(--accent);color:#fff;border-radius:8px;
  padding:.05em .45em;font-size:.92em;line-height:1.5}
.pv-case h3{font-size:.86rem;letter-spacing:.06em;color:var(--deep);
  margin:1.2rem 0 .3rem;font-weight:700}
.pv-case p{margin:.35rem 0}
.pv-lead{font-weight:700}
.pv-maps{color:var(--ink-soft);font-size:.92rem}
.pv-case ul{margin:.3rem 0;padding-left:1.2rem}
.pv-case li{margin:.35rem 0}
.pv-pbar{display:flex;align-items:center;justify-content:space-between;
  margin:1.3rem 0 .4rem;gap:.8rem}
.pv-pbar span{font-size:.86rem;letter-spacing:.06em;color:var(--deep);font-weight:700}
.pv-copy{font:inherit;font-size:.86rem;line-height:1;background:var(--accent);color:#fff;
  border:0;border-radius:8px;padding:.6rem 1.1rem;min-height:44px;cursor:pointer}
.pv-copy.is-done{background:var(--deep)}
.pv-prompt{margin:0;background:#fff;border:1px solid var(--rule);border-radius:8px;
  padding:.8rem .9rem;overflow-x:auto;font-size:12.5px;line-height:1.6;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  white-space:pre-wrap;word-break:break-word;color:#3a3d36;max-height:22rem;overflow-y:auto}
footer{color:var(--ink-soft);font-size:.9rem;margin-top:2.4rem}
footer ol{padding-left:1.2rem}
</style>
</head>
<body>
<header class="pv-head"><div class="pv-shell"><b>芳仁牙醫診所</b><span>提案頁・尚未上線</span></div></header>
<div class="pv-shell">
<h1>〈三個月一次的洗牙與塗氟〉<br>插畫・六個提案</h1>
<p class="pv-sub">文章已經定稿，這一頁只決定圖要畫什麼。都還沒畫，先挑梗。</p>

<div class="pv-note">
<p><b>⚠⚠⚠ Ⓕ 出圖之前，先把這三張存下來一起餵進去</b></p>
<p>你說「人物風格跟網站現有的不太一樣」—— 成因不是提示詞寫得不夠細，是<b>風格用文字描述一定會漂</b>
（〈生物陶瓷〉那一輪：形狀用文字講失敗三四輪，改成給圖之後一次就中）。
下面三張是站上自己的 HERO，<b>長按存下來，出圖時一起附上</b>。提示詞第一段已經寫著
「文字和參考圖衝突時，以參考圖為準」。</p>
${REFS.map((r) => `<figure class="pv-ref">
  <img src="../../assets/${r.f}-800.jpg" alt="" width="800" height="447"
       srcset="../../assets/${r.f}-800.jpg 800w, ../../assets/${r.f}-1600.jpg 1600w"
       sizes="(min-width: 705px) 639px, calc(100vw - 66px)" loading="eager">
  <figcaption><b>${r.t}</b>　${r.why}</figcaption>
</figure>`).join("\n")}
</div>

<div class="pv-note">
<p><b>2026-09-05：Ⓕ 是照你的方向新加的，建議走它。</b></p>
<p>你選了 Ⓐ 但指出它單調 —— <b>成因是四格共用同一個診間、同一片背景</b>，變的只有坐上去的人。
Ⓕ 把它換成七格拼起來的鑲嵌：六個人各自在<b>自己的生活裡</b>、各自一個底色，中間一格是醫師。</p>
<p><b>2026-09-05 晚間：Ⓕ 照你那五件改成第二版了</b> —— 換成餵站上自己的三張圖來定風格、
六個家從一句話變成一張道具清單、多寫一段「人用實線、環境用淡線」的兩層畫法、
中間變成兩個人（一個白袍、一個只有刷手服，兩件刷手服不同色）。</p>
<p><b>2026-09-05 更晚：Ⓕ 第三版</b> —— 治「還是比站上寫實了一點」。
<b>先量過再改，量出來把方向修掉了</b>：站上十一張自己就分兩群，
〈定期檢查〉48%、〈貝氏刷牙法〉50% 的面積是近白的，<b>比你看到那張還淡</b>，
所以問題不在顏色。是兩件「畫得太準」——</p>
<div class="pv-tw"><table class="pv-t2">
<tr><th></th><th>近白</th><th>墨</th><th>彩度中位</th></tr>
<tr><td>〈牙齦流血〉</td><td>6.3%</td><td>19.2%</td><td>19.3</td></tr>
<tr><td>〈換牙〉</td><td>18.0%</td><td>13.3%</td><td>9.9</td></tr>
<tr><td>〈缺牙之後〉</td><td>17.1%</td><td>12.9%</td><td>13.5</td></tr>
<tr class="pv-pick"><td>〈定期檢查〉</td><td>48.0%</td><td>8.0%</td><td>6.6</td></tr>
<tr class="pv-pick"><td>〈貝氏刷牙法〉</td><td>50.1%</td><td>6.1%</td><td>4.8</td></tr>
</table></div>
<p>① <b>臉有立體感</b> —— 眼皮、眼白、反光點、顴骨、一根一根的頭髮。站上的臉是
「一個小弧形當眼睛、一筆鼻子、一筆嘴，臉上完全沒有陰影」。<br>
② <b>每一樣東西用的筆畫太多</b> —— 電風扇畫出整圈護網、磁磚畫出完整格線、鐵窗每一根都畫、
透視是準的。〈定期檢查〉那張東西一樣多，但每一樣只用三到八筆。</p>
<p>⚠ <b>而這兩件是我第二版的提示詞自己寫出來的</b>：那一段我寫了
「環境要細到你叫得出這是什麼房間」——<b>那等於在叫它畫準，而畫得準正是寫實的定義</b>。
第三版把「臉與手」和「用最少的筆畫」兩段放到最前面，「兩層畫法」砍掉一半並反過來寫。</p>
<p><b>2026-09-05 更晚：Ⓕ 第四版</b> —— 治「人的臉變得有點呆板」。
<b>成因是我第三版的提示詞自己寫的</b>：治「太寫實」那一段<b>七條全是禁令</b>
（沒有睫毛／眼白／反光點／眼皮的褶／陰影／腮紅／一根根的頭髮），
<b>一條「要有什麼」都沒有</b> —— 寫實是拿掉了，表情的載體也一起被清空。
照你說的去對站上那三張，差的是這些：</p>
<div class="pv-tw"><table class="pv-t2 pv-wrap">
<tr><th></th><th>站上</th><th>我第三版寫的</th></tr>
<tr class="pv-pick"><td>眉毛</td><td>每張臉都有，一筆，<b>角度就是情緒</b></td><td>一個字都沒提</td></tr>
<tr class="pv-pick"><td>嘴</td><td><b>開合幅度最大</b>，笑起來是張開的形狀＋一塊牙</td><td>「嘴巴是一筆」</td></tr>
<tr><td>眼睛</td><td>開心時彎成月牙、想睡是一條縫</td><td>只說是一個小弧形</td></tr>
<tr><td>腮紅</td><td>有，一塊平塗的淡色</td><td><b>直接禁掉了</b></td></tr>
<tr><td>年紀的線</td><td>嘴邊一條笑紋、眼尾兩筆</td><td>被「不要輪廓」一起掃掉</td></tr>
</table></div>
<p>第二個成因也是我寫的：<b>「六個人都很平常、很自在」</b> —— 那句是為了擋病容，
可是它等於<b>叫模型畫六張一模一樣的表情</b>。現在改成逐格點名，中間兩位也各給一種。
判準多一條反方向的：<b>七張臉如果互換位置沒有人看得出來，也是錯的</b>。</p>
<p><b>2026-09-05 更晚：Ⓕ 第五版</b> —— 治「變成蠟筆風格了」。
<b>量的是顆粒</b>（每個像素取 3×3 鄰域的亮度極差：極差很小 ＝ 那一塊是平塗的，
極差很大 ＝ 那裡有一條邊）：</p>
<div class="pv-tw"><table class="pv-t2">
<tr><th></th><th>平塗</th><th>硬邊</th></tr>
<tr><td>〈牙齦流血〉</td><td>25.9%</td><td>21.1%</td></tr>
<tr><td>〈換牙〉</td><td>22.0%</td><td>24.0%</td></tr>
<tr><td>〈定期檢查〉</td><td>30.9%</td><td>32.0%</td></tr>
<tr><td>Ⓕ 第三版</td><td>32.5%</td><td>36.4%</td></tr>
<tr class="pv-pick"><td><b>Ⓕ 第四版</b></td><td><b>9.1%</b></td><td><b>54.2%</b></td></tr>
</table></div>
<p><b>真正平的面積從三成掉到 9.1%，而「有硬邊」的像素超過一半</b> ——
多出來的那些不是輪廓，是<b>填色裡面的筆觸</b>。這一版的填色不再是填色。</p>
<p>⚠⚠⚠ <b>成因不是模型漂掉，是我第四版的 diff 弄丟了兩句。</b>
逐行比對第三版與第四版：<b>① 參考圖那一段的「抄它顏色多平」被我刪掉了</b>
（第四版為了強調臉，把後半整句換成臉的三件事 —— 而那是整份提示詞裡<b>唯一</b>
叫模型去看參考圖的顏色怎麼上的一句）；<b>② 中間那一格的「診所那一角」與
「接納與介紹」兩整段消失了</b>（重寫中間兩個人時整段覆蓋掉的，
等於第二版那個「單調」的成因又回來一半）。第三件是
<b>「每一個表面都有色鉛筆的顆粒」</b> —— 那句<b>從第一版就在</b>、前三版都沒事，
第四版把「手繪／很快／不準」這一類的字加多之後<b>它就變成主角了</b>。</p>
<p>⚠⚠⚠ <b>通則：每一輪為了治新問題而重寫某一段，會順手弄丟上一輪為了治舊問題
寫進去的句子。</b> 三輪連著發生。做法是<b>改完一定要 diff 上一版</b>，
逐條問「這一行是為了治什麼，現在還在不在」，並且<b>把治過的病寫成守門</b> ——
產生器現在擋十二件，第四版那一句顆粒也在擋的名單上。</p>
<p>第五版四件：參考圖那一句<b>補回來並排到最前面</b>；<b>顆粒那句整句換掉</b>，
改成「填色裡面沒有任何筆觸」＋一句判準「<b>看起來像用蠟筆或色鉛筆塗的，就是錯的</b>」；
「這張圖沒有一樣東西是畫準的」那句<b>收掉</b>（它和「填色要平」互相拉扯）；
<code>AVOID</code> 最前面補一整排蠟筆／色鉛筆／排線／紙紋／毛邊。</p>
<p><b>2026-09-05 更晚：Ⓕ 第六版</b> —— 醫事人員從中間搬到右下。
起因是你說「首頁卡片的預覽圖片可能會重點都是在中間的醫事人員」。
<b>量過，成立，而且是三件事疊起來的</b>：</p>
<div class="pv-tw"><table class="pv-t2 pv-wrap">
<tr class="pv-pick"><td>首頁卡的縮圖是 <b>16:9</b></td><td>4:3 的圖上下各被裁掉 <b>12.4%</b>，只留中間 75.3%</td></tr>
<tr class="pv-pick"><td>裁切是<b>置中</b>的</td><td><b>中間那一格是七格裡唯一完全沒被裁到的</b>，其餘六格各被切掉一塊</td></tr>
<tr><td>中間那一格本來就最大</td><td>整張圖佔 32.3%，在卡片那一條裡變成 <b>36.1%</b></td></tr>
</table></div>
<p>三件合起來：<b>卡片上唯一完整、最大、又在正中央的東西就是那兩位醫事人員</b>。
實際裁成 393px 的卡片看過 —— 六個人只剩上下被切掉一截的碎片，讀起來就是「一張診所的照片」，
而這一篇講的是<b>哪些人需要三個月回來一次</b>。</p>
<p>⚠⚠⚠ <b>通則：一張圖會在兩個尺寸、兩個比例底下被看</b> ——
文章頁是完整的 4:3、首頁卡是置中裁切的 16:9。
<b>「畫面正中央」在文章頁只是構圖的一個位置，在卡片上等於「唯一的主角」。</b>
畫之前要先問：<b>這張圖被裁成卡片之後，站在正中央的是誰？</b></p>
<p>四件改動：<b>右下那一格換成診所</b>（兩位都轉向左上、醫師攤開的手也往左上伸出去，
穿過整張圖指回其他格子；⚠ 那一格貼著畫面下緣，所以明寫<b>兩張臉與那隻手都要在那一格的上半部</b>）／
<b>中間那一格換成孕婦</b>（六個人裡縮到卡片大小還讀得出來的一個，剪影就看得出來，
而且本來就是三個月回診最主流的一群）／<b>左上換成量血糖的那位</b>（和右下對調）／
<b>每一格的顏色跟著位置重新分配</b>（那一串本來是照位置寫的，人一換位置就對不上了）。</p>
<p>⚠ <b>中間那一格仍然是最大的，那是刻意的</b> —— 站上量過：
<b>多格分割、沒有視覺中心的場面，縮到小尺寸會整張糊掉</b>。
所以不是把七格拉成一樣大，是<b>換掉站在中央的那個人</b>。</p>
<p>Ⓐ~Ⓔ 留著沒有動，往下捲還在。</p>
</div>

<div class="pv-note pv-ratio">
<p><b>拉高之後會長多高（實測）</b></p>
<p>站上十一張 HERO 全部是 16:9。下面是<b>圖高 px ／佔一屏的百分比</b>：</p>
<div class="pv-tw"><table>
<tr><th>比例</th><th>390</th><th>744</th><th>1440</th></tr>
<tr><td>16:9 現況</td><td>204／24%</td><td>371／33%</td><td>369／41%</td></tr>
<tr><td>3:2</td><td>241／29%</td><td>440／39%</td><td>437／49%</td></tr>
<tr class="pv-pick"><td><b>4:3 建議</b></td><td>272／32%</td><td>495／44%</td><td>492／55%</td></tr>
<tr><td>5:4</td><td>290／34%</td><td>528／47%</td><td>525／58%</td></tr>
<tr><td>1:1</td><td>362／43%</td><td>659／58%</td><td>656／73%</td></tr>
<tr><td>4:5</td><td>453／54%</td><td>824／73%</td><td>820／91%</td></tr>
</table></div>
<p>⚠⚠ <b>卡住的是電腦版不是手機</b>：1440 上內文欄 656px，1:1 就吃掉 73% 的螢幕、
4:5 是 91%（點進文章第一眼只有一張圖）。<b>4:3 的 55% 還在可以接受的一側</b>，
而且它正好落在你給的兩張圖中間（絨毛玩偶那張跨頁約 1.45、羽扇豆那張 1:1）。</p>
<p>⚠⚠ <b>首頁的文章卡不能跟著變</b> —— 縮圖固定 16:9，十一張並排，改一張就要重裁十張。
所以拉高的圖<b>在卡片上只露出中間一條</b>：4:3 露 75%、5:4 露 70%、1:1 只剩 56%。
Ⓕ 的提示詞已經把「上下各 12% 不可以放臉與關鍵物件」寫死。</p>
<p>⚠ 另外兩支工具要跟著改（<b>等你挑定再動，各兩行</b>）：縮圖那一支寫死了 16:9 會拒絕出圖、
產生首頁卡的那一支寫死了 <code>width="2000" height="1116"</code>。</p>
</div>

${cards}

<footer>
<p><b>挑定之後</b></p>
<ol>
<li>你出圖（16:9），把原檔給我。</li>
<li>我縮成站上的三個寬度並接進文章，出圖前會擋兩件：四邊有沒有烘進去的白框、長寬比對不對。</li>
<li>定稿的提示詞逐字存進插畫規範，日後要改圖從那一份改、只換出問題的那一段。</li>
<li>文章從草稿搬進正式站、跑一次建置，首頁就會多一張卡。</li>
</ol>
</footer>
</div>
<script>
document.querySelectorAll(".pv-copy").forEach(function (b) {
  b.addEventListener("click", function () {
    var t = document.getElementById("p" + b.dataset.i).textContent;
    var done = function () {
      b.textContent = "已複製";
      b.classList.add("is-done");
      setTimeout(function () { b.textContent = "複製"; b.classList.remove("is-done"); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function () { fallback(t, done); });
    } else { fallback(t, done); }
  });
});
function fallback(t, done) {
  var a = document.createElement("textarea");
  a.value = t; a.setAttribute("readonly", "");
  a.style.position = "fixed"; a.style.top = "-1000px";
  document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(a);
}
</script>
</body>
</html>
`;

if (!/noindex/.test(html)) throw new Error("少了 noindex");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`寫好了：${path.relative(ROOT, OUT)}　${html.length} 字元　${blocks.length} 案：${blocks.map((b) => b.key).join(" ")}`);
