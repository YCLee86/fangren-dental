import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const demand = wb.worksheets.getItem("班次需求輸入");
const assignments = wb.worksheets.getItem("排班配置輸入");
const checks = wb.worksheets.getItem("班次檢核總覽");
const exceptions = wb.worksheets.getItem("排班例外核定");
const dashboard = wb.worksheets.getItem("主管工作台");
const consultation = wb.worksheets.getItem("諮詢排班視圖");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

function addDemand(row, id, start, end) {
  demand.getRange(`A${row}:H${row}`).values = [[id, 46286, start, end, "李侑津醫師", "LJT-SCALING", "一般診已確認", 1]];
  demand.getRange(`K${row}:L${row}`).values = [["正式", "例外流程測試"]];
  demand.getRange(`N${row}:O${row}`).values = [["測試諮詢", 46265]];
  demand.getRange(`Q${row}:W${row}`).values = [["測試跟診", 46279, "無影響", "無異動", null, null, null]];
}

addDemand(10, "TST001", 0.75, 0.79);
assignments.getRange("A11:C11").values = [["C005", "TST001", "1001"]];
assignments.getRange("E11:G11").values = [["主跟診", 0, "否"]];
checks.getRange("A10").values = [["TST001"]];
wb.recalculate();
assert(checks.getRange("Q10").values[0][0] === "正式資格未完成", "Test shift did not reach the intended qualification-pending state");
assert(checks.getRange("S10").values[0][0] === "確認完成", "Test shift confirmation workflow was not complete");
assert(checks.getRange("W10").values[0][0] === "正式資格未完成", "Unapproved exception changed final publication state");
assert(dashboard.getRange("D7").values[0][0] === 1, "Dashboard should show one pending formal shift before exception approval");

exceptions.getRange("A7:B7").values = [["EXC-TEST-001", "TST001"]];
exceptions.getRange("F7:Q7").values = [["已核定資料待回寫", "資格核定已完成，等待系統回寫", "主管逐筆核對紙本核定與班次", "C005", "核定文件 TEST-001", "測試申請人", 46282, 46286, "已核定", "測試主管", 46282, "生效"]];
wb.recalculate();
assert(JSON.stringify(exceptions.getRange("R7:T7").values[0]) === JSON.stringify(["資料完整", "可限時核定", "例外有效"]), `Valid exception did not pass: ${JSON.stringify(exceptions.getRange("R7:T7").values[0])}`);
assert(checks.getRange("V10:W10").values[0][0] === "例外有效", "Shift did not receive effective exception status");
assert(checks.getRange("W10").values[0][0] === "例外核定可發布", "Safe exception did not reach final publication gate");
assert(dashboard.getRange("D7").values[0][0] === 0, "Dashboard pending shift count did not clear after safe exception");
assert(consultation.getRange("S14:T14").values[0][0] === "例外核定可發布" && consultation.getRange("T14").values[0][0] === "完成", "Consultation view did not reflect final exception publication state");

demand.getRange("Q10:R10").values = [[null, null]];
wb.recalculate();
assert(checks.getRange("S10").values[0][0] === "待一週前確認", "Confirmation workflow did not reopen after removing one-week confirmation");
assert(checks.getRange("W10").values[0][0] !== "例外核定可發布", "Exception improperly bypassed one-week confirmation");
assert(consultation.getRange("T14").values[0][0] === "完成一週前診前確認", "Consultation view did not preserve the one-week confirmation action");
demand.getRange("Q10:R10").values = [["測試跟診", 46279]];

addDemand(11, "TST002", 0.8, 0.84);
checks.getRange("A11").values = [["TST002"]];
exceptions.getRange("A8:B8").values = [["EXC-TEST-002", "TST002"]];
exceptions.getRange("F8:Q8").values = [["已核定資料待回寫", "嘗試覆蓋缺人", "另行確認", "C-NOT-FOUND", "測試佐證", "測試申請人", 46282, 46286, "已核定", "測試主管", 46282, "生效"]];
wb.recalculate();
assert(checks.getRange("Q11").values[0][0] === "缺主跟診配置", "Second test shift did not reach missing-assignment state");
assert(exceptions.getRange("S8").values[0][0] === "不可例外：缺主跟診配置", "Missing main assistant was not blocked by safety gate");
assert(exceptions.getRange("T8").values[0][0] === "不可例外：缺主跟診配置", "Blocked exception became effective");
assert(checks.getRange("W11").values[0][0] === "缺主跟診配置", "Final publication gate allowed a non-overridable shortage");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during exception workflow test");

console.log(JSON.stringify({
  status: "PASS",
  safeException: ["資料完整", "可限時核定", "例外有效", "例外核定可發布"],
  confirmationNotBypassed: true,
  missingMainAssistantBlocked: exceptions.getRange("S8:T8").values[0],
  consultationUpdated: true,
  schedulingFitUnchanged: true,
}, null, 2));
