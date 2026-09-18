import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const versions = wb.worksheets.getItem("檢核表版本");
const items = wb.worksheets.getItem("檢核表項目輸入");
const assessments = wb.worksheets.getItem("考核紀錄輸入");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(wb.worksheets.getItem("主管工作台").getRange("B27").values[0][0] === 7, "Initial checklist pending count should be 7");
assert(versions.getRange("Q7").values[0][0] === "待主管核定", "Draft checklist should not be published");

items.getRange("G7:N7").values = [["關鍵必要", "測試用操作項目", "可獨立完成且不需提醒", "現場操作紀錄", "是", "已核定", 46282, "測試主管"]];
items.getRange("Q7:R7").values = [["測試檢核表 V1", "第 1 頁／項目 1"]];
versions.getRange("E7").values = [["已核定"]];
versions.getRange("L7:N7").values = [[46282, "測試主管", 46282]];
wb.recalculate();
assert(items.getRange("P7").values[0][0] === "可發布", "Completed checklist item did not pass");
assert(versions.getRange("P7:R7").values[0][0] === "可發布", "Completed checklist version did not pass receipt check");
assert(versions.getRange("Q7").values[0][0] === "已發布", "Completed checklist version was not published");
assert(wb.worksheets.getItem("主管工作台").getRange("B27").values[0][0] === 6, "Dashboard pending count did not drop after publication");

assessments.getRange("A7:Q7").values = [["ASSESS-TEST-001", 46282, "1001", "員工1001", "FLOW-STERILIZATION", "CHK-STERIL-01", "V1 草案", "測試考核人", 0, 0, "無", "通過", "Ø", null, "已知悉", 46282, "無異議"]];
wb.recalculate();
assert(assessments.getRange("R7:U7").values[0][0] === "已發布", "Assessment did not resolve published checklist version");
assert(assessments.getRange("S7").values[0][0] === "可送主管核定", `Valid assessment did not pass receipt check: ${JSON.stringify({input: assessments.getRange("A7:Q7").values[0], output: assessments.getRange("R7:U7").values[0]})}`);
assert(assessments.getRange("T7").values[0][0] === "可進入主管核定", "Valid assessment did not reach supervisor gate");

assessments.getRange("I7").values = [[1]];
wb.recalculate();
assert(assessments.getRange("S7").values[0][0] === "結果與必要項目矛盾", "Passing result with critical failure was not blocked");

assessments.getRange("A8:Q8").values = [["ASSESS-TEST-002", 46282, "1001", "員工1001", "COMMON-PA", "CHK-IMAGE-01", "V1 草案", "測試考核人", 0, 0, "無", "通過", "Ø", null, "已知悉", 46282, "無異議"]];
wb.recalculate();
assert(assessments.getRange("R8").values[0][0] === "未發布版本", "Unpublished checklist version was not identified");
assert(assessments.getRange("S8").values[0][0] === "檢核表版本未發布", "Assessment improperly accepted an unpublished checklist version");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit output changed during checklist workflow test");

console.log(JSON.stringify({
  status: "PASS",
  publishedVersion: versions.getRange("P7:R7").values[0],
  validAssessment: ["已發布", "可送主管核定", "可進入主管核定"],
  contradictionBlocked: assessments.getRange("S7").values[0][0],
  unpublishedVersionBlocked: assessments.getRange("S8").values[0][0],
  schedulingFitUnchanged: true,
}, null, 2));
