/* 提醒時機 vs 協議期限。
   假設：診所週六日休診（站上門診表只列一到五）。
   協議：看診日的「兩天前（不含假日）」＝ 往回數 2 個開診日。 */
const NAME = ["日", "一", "二", "三", "四", "五", "六"];
const isOpen = (d) => d.getDay() >= 1 && d.getDay() <= 5;
const backWorkdays = (d, n) => { const x = new Date(d); let i = 0; while (i < n) { x.setDate(x.getDate() - 1); if (isOpen(x)) i++; } return x; };
const backDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };
const f = (d) => `${d.getMonth() + 1}/${d.getDate()}(${NAME[d.getDay()]})`;

/* 拿一個確定的週一當基準，往後五個看診日 */
const base = new Date(2026, 8, 7); // 2026-09-07 是週一
const plans = [
  ["現況 48 小時（＝2 曆日）", (d) => backDays(d, 2)],
  ["提前到 4 曆日前", (d) => backDays(d, 4)],
  ["提前到 5 曆日前", (d) => backDays(d, 5)],
  ["3 個開診日前", (d) => backWorkdays(d, 3)],
];

for (const [label, fn] of plans) {
  console.log(`\n── ${label} ──`);
  let lateN = 0, closedN = 0;
  for (let i = 0; i < 5; i++) {
    const appt = new Date(base); appt.setDate(base.getDate() + i);
    const deadline = backWorkdays(appt, 2);
    const remind = fn(appt);
    const late = remind > deadline;
    const same = remind.toDateString() === deadline.toDateString();
    const closed = !isOpen(remind);
    if (late) lateN++;
    if (closed) closedN++;
    const verdict = late ? "❌ 比期限晚" : same ? "⚠ 就是期限當天" : "✓ 期限之前";
    console.log(`  看診 ${f(appt)}　期限 ${f(deadline)}　提醒 ${f(remind)}　${verdict}${closed ? "　❌ 診所沒開" : ""}`);
  }
  console.log(`  → 晚於期限 ${lateN}/5，落在休診日 ${closedN}/5`);
}
