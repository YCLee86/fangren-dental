import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const pilot = wb.worksheets.getItem("正式試排驗收");
const checks = wb.worksheets.getItem("班次檢核總覽");
const readiness = wb.worksheets.getItem("上線準備");
const dashboard = wb.worksheets.getItem("主管工作台");
const intake = wb.worksheets.getItem("正式資料收件");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(pilot.getRange("M7").values[0][0] === "待選擇班次", "Pilot should begin without a selected shift");
assert(readiness.getRange("D21").values[0][0] === 0 && dashboard.getRange("B31").values[0][0] === 1, "Pilot baseline is not synchronized");

pilot.getRange("A7").values = [["S001"]];
wb.recalculate();
assert(pilot.getRange("J15").values[0][0] === "未通過", "Example shift was not rejected as non-formal");
assert(pilot.getRange("M7").values[0][0] === "系統條件未完成", "Example shift incorrectly passed formal pilot");

checks.getRange("A10:W10").values = [[
  "FORMAL-TEST-001", 46290, 0.375, 0.5, "TEST-MODE", "測試療程", "特殊療程已確認",
  1, 1, 1, 1, 1, 1, 0, 0, 0, "通過", "正式", "確認完成", "無異動", "可發布", "無例外", "可發布",
]];
pilot.getRange("A7").values = [["FORMAL-TEST-001"]];
wb.recalculate();
assert(pilot.getRange("G7").values[0][0] === 12 && pilot.getRange("I7").values[0][0] === 0, "Valid formal shift did not pass all system checks");
assert(pilot.getRange("K7").values[0][0] === "待簽核" && pilot.getRange("M7").values[0][0] === "待人工驗收", "System checks improperly bypassed manual signoff");

pilot.getRange("C28:D28").values = [["OTHER-SHIFT", null]];
pilot.getRange("G28:H28").values = [["測試執行人", null]];
pilot.getRange("K28:L28").values = [[46282, null]];
pilot.getRange("N28").values = [[46282]];
pilot.getRange("C29:D29").values = [["通過", null]];
pilot.getRange("G29:H29").values = [["測試主管", null]];
wb.recalculate();
assert(pilot.getRange("K7").values[0][0] === "核定班次不一致", "Stale signoff was applied to another shift");
assert(pilot.getRange("M7").values[0][0] === "待人工驗收", "Mismatched signoff passed acceptance");

pilot.getRange("C28").values = [["FORMAL-TEST-001"]];
wb.recalculate();
assert(pilot.getRange("K7").values[0][0] === "已簽核" && pilot.getRange("M7").values[0][0] === "驗收通過", "Complete matching signoff did not pass formal pilot");
assert(readiness.getRange("D21").values[0][0] === 1 && readiness.getRange("F21").values[0][0] === "系統條件完成", "Formal pilot did not satisfy go-live system gate");
assert(dashboard.getRange("B31").values[0][0] === 0, "Dashboard did not clear formal pilot task");
assert(intake.getRange("D20").values[0][0] === 0 && intake.getRange("M20").values[0][0] === "已完成", "Formal data intake did not close pilot package");

checks.getRange("V10:W10").values = [["例外有效", "例外核定可發布"]];
wb.recalculate();
assert(pilot.getRange("J24").values[0][0] === "未通過" && pilot.getRange("J25").values[0][0] === "未通過", "Exception-based shift was not rejected for formal pilot");
assert(pilot.getRange("M7").values[0][0] === "系統條件未完成" && readiness.getRange("D21").values[0][0] === 0, "Exception-based shift counted toward go-live readiness");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during formal pilot test");

console.log(JSON.stringify({
  status: "PASS",
  exampleShiftRejected: true,
  twelveSystemChecksRequired: true,
  manualSignoffRequired: true,
  staleSignoffBlocked: true,
  cleanFormalShiftAccepted: true,
  exceptionBasedPilotRejected: true,
  readinessDashboardAndIntakeSynchronized: true,
  schedulingFitUnchanged: true,
}, null, 2));
