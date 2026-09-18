import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const doctor = wb.worksheets.getItem("醫師模式規則輸入");
const mobility = wb.worksheets.getItem("流動層級規則輸入");
const grade = wb.worksheets.getItem("職級矩陣規則輸入");
const checklist = wb.worksheets.getItem("檢核表項目輸入");
const dashboard = wb.worksheets.getItem("主管工作台");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(dashboard.getRange("B20:B22").values.flat().join(",") === "8,9,10", "Baseline rule gaps changed unexpectedly");

doctor.getRange("C7:O7").values = [["測試型態", "TEST-MODE", "測試治療", "測試階段", "高", 1, 0, 0, 21, "V-TEST", 46282, "已核定", "測試主管"]];
wb.recalculate();
assert(doctor.getRange("Q7").values[0][0] === "已核定但缺來源依據", `Approved doctor rule published without source evidence: ${doctor.getRange("Q7").values[0][0]}`);
assert(dashboard.getRange("B20").values[0][0] === 8, "Missing source incorrectly reduced doctor blocker count");

doctor.getRange("R7:S7").values = [["測試規則文件 V1", "第 2 頁／治療模式表"]];
wb.recalculate();
assert(doctor.getRange("Q7").values[0][0] === "可發布", "Complete doctor rule with source evidence did not publish");
assert(dashboard.getRange("B20").values[0][0] === 7, "Published doctor rule did not reduce blocker count");

doctor.getRange("A15:B15").values = [["PENDING-DOC-01", "測試醫師"]];
wb.recalculate();
assert(doctor.getRange("Q7").values[0][0] === "規則編號重複" && doctor.getRange("Q15").values[0][0] === "規則編號重複", "Duplicate doctor rule IDs were not blocked");

mobility.getRange("D7:K7").values = [["SKILL-TEST", "測試任務", "◎", "必要", "V-TEST", 46282, "已核定", "測試主管"]];
mobility.getRange("N7:O7").values = [["測試流動規則 V1", "第 1 節"]];
wb.recalculate();
assert(mobility.getRange("M7").values[0][0] === "可發布", "Complete mobility rule with source evidence did not publish");

grade.getRange("C7:J7").values = [["技能條件", "SKILL-TEST", "◎", "必要", "V-TEST", 46282, "已核定", "測試主管"]];
grade.getRange("M7:N7").values = [["測試職級規則 V1", "第 1 節"]];
wb.recalculate();
assert(grade.getRange("L7").values[0][0] === "可發布", "Complete grade rule with source evidence did not publish");

checklist.getRange("G7:J7").values = [["關鍵必要", "測試操作項目", "測試通過標準", "測試紀錄"]];
checklist.getRange("L7:N7").values = [["已核定", 46282, "測試主管"]];
wb.recalculate();
assert(checklist.getRange("P7").values[0][0] === "已核定但缺來源依據", "Approved checklist item published without source evidence");
checklist.getRange("Q7:R7").values = [["測試檢核表 V1", "第 3 頁／項目 1"]];
wb.recalculate();
assert(checklist.getRange("P7").values[0][0] === "可發布", "Complete checklist item with source evidence did not publish");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during source traceability test");

console.log(JSON.stringify({
  status: "PASS",
  approvedWithoutSourceBlocked: true,
  completeSourceEvidencePublishes: true,
  duplicateRuleIdsBlocked: true,
  doctorMobilityGradeAndChecklistCovered: true,
  dashboardSynchronized: true,
  schedulingFitUnchanged: true,
}, null, 2));
