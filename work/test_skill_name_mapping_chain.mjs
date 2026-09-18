import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("技能名稱對照");
const rows = sheet.getRange("A7:V123").values;
const findRow = (skill) => {
  const index = rows.findIndex((row) => row[3] === skill);
  if (index < 0) throw new Error(`Missing source skill: ${skill}`);
  return index + 7;
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

const incompleteRow = 7;
sheet.getRange(`L${incompleteRow}`).values = [["採用建議"]];
wb.recalculate();
assert(sheet.getRange(`R${incompleteRow}`).values[0][0] === "待補建議或核定資料", "Incomplete adoption was not blocked");

const recordRow = findRow("病歷紀錄");
sheet.getRange(`L${recordRow}:P${recordRow}`).values = [["採用建議", null, null, "2026-09-17", "測試主管"]];
wb.recalculate();
const recordResult = sheet.getRange(`R${recordRow}:V${recordRow}`).values[0];
assert(recordResult[0] === "可發布", "Complete record mapping did not pass receipt check");
assert(recordResult[1] === "病歷基本操作" && recordResult[2] === "COMMON-RECORD", "Final mapping values were not populated");
assert(recordResult[3] === "一致" && recordResult[4] === "已發布", "Complete record mapping was not published");
assert(wb.worksheets.getItem("主管工作台").getRange("B26").values[0][0] === 116, "Dashboard pending count did not drop by one");

const compoundRow = findRow("拍PANO、PA");
sheet.getRange(`L${compoundRow}:P${compoundRow}`).values = [["採用建議", null, null, "2026-09-17", "測試主管"]];
wb.recalculate();
assert(sheet.getRange(`R${compoundRow}`).values[0][0] === "需完成拆分", "Compound PANO/PA item was not blocked for splitting");

const collisionRow = 8;
sheet.getRange(`L${collisionRow}:P${collisionRow}`).values = [["另訂標準", "不同病歷名稱", "COMMON-RECORD", "2026-09-17", "測試主管"]];
wb.recalculate();
assert(sheet.getRange(`U${recordRow}:V${recordRow}`).values[0].every((v) => v === "代碼對應多名稱"), "Existing mapping did not detect code/name collision");
assert(sheet.getRange(`U${collisionRow}:V${collisionRow}`).values[0].every((v) => v === "代碼對應多名稱"), "New mapping did not detect code/name collision");
assert(wb.worksheets.getItem("主管工作台").getRange("B26").values[0][0] === 117, "Dashboard did not count both conflicted mappings as pending");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Existing scheduling-fit output changed during mapping test");

console.log(JSON.stringify({
  status: "PASS",
  incompleteBlocked: sheet.getRange(`R${incompleteRow}`).values[0][0],
  completeMapping: recordResult,
  compoundBlocked: sheet.getRange(`R${compoundRow}`).values[0][0],
  collision: sheet.getRange(`U${recordRow}:V${recordRow}`).values[0],
  schedulingFitUnchanged: true,
}, null, 2));
