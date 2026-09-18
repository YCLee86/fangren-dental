import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const readiness = wb.worksheets.getItem("上線準備");
const dashboard = wb.worksheets.getItem("主管工作台");
const guide = wb.worksheets.getItem("主管操作導引");
const checks = wb.worksheets.getItem("班次檢核總覽");
const pilot = wb.worksheets.getItem("正式試排驗收");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(readiness.getRange("B6").values[0][0] === "尚有 14 項未完成", "Initial go-live blocker count is incorrect");
assert(readiness.getRange("G7").values[0][0] === 10 && readiness.getRange("I7").values[0][0] === 4, "System/manual blocker split is incorrect");
assert(readiness.getRange("K7").values[0][0] === 0, "Formal pilot count should start at zero");
assert(dashboard.getRange("B29").values[0][0] === 14 && guide.getRange("D22").values[0][0] === 14, "Dashboard and guide are not synchronized with readiness blockers");

readiness.getRange("J22").values = [["已完成"]];
wb.recalculate();
assert(readiness.getRange("M22").values[0][0] === "待人工確認", "Manual gate passed without date and confirmer");

for (let r = 22; r <= 25; r++) readiness.getRange(`J${r}:L${r}`).values = [["已完成", 46282, "測試主管"]];
wb.recalculate();
assert(readiness.getRange("I7").values[0][0] === 0, "Completed manual confirmations remain pending");
assert(readiness.getRange("B6").values[0][0] === "尚有 10 項未完成", "Overall blocker count did not drop after manual confirmations");

dashboard.getRange("A7").values = [[0]];
for (const cell of ["B25", "B26", "B27", "B24", "B20", "B21", "B22", "B17"]) dashboard.getRange(cell).values = [[0]];
checks.getRange("A10:W10").values = [["FORMAL-GOLIVE-TEST", 46290, 0.375, 0.5, "TEST-MODE", "測試療程", "特殊療程已確認", 1, 1, 1, 1, 1, 1, 0, 0, 0, "通過", "正式", "確認完成", "無異動", "可發布", "無例外", "可發布"]];
pilot.getRange("A7").values = [["FORMAL-GOLIVE-TEST"]];
pilot.getRange("C28:D28").values = [["FORMAL-GOLIVE-TEST", null]];
pilot.getRange("G28:H28").values = [["測試執行人", null]];
pilot.getRange("K28:L28").values = [[46282, null]];
pilot.getRange("N28").values = [[46282]];
pilot.getRange("C29:D29").values = [["通過", null]];
pilot.getRange("G29:H29").values = [["測試主管", null]];
wb.recalculate();

assert(readiness.getRange("D12:D21").values.flat().every((v, i) => i === 9 ? v >= 1 : v === 0), "System gates did not reconcile after prerequisites were completed");
assert(readiness.getRange("B6").values[0][0] === "可進入正式上線", "All completed gates did not produce go-live readiness");
assert(readiness.getRange("B7").values[0][0] === "安排正式上線日期與責任人", "Final next step is incorrect");
assert(dashboard.getRange("B29").values[0][0] === 0 && guide.getRange("K22").values[0][0] === "已完成", "Readiness completion did not propagate to dashboard and guide");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during readiness test");

console.log(JSON.stringify({
  status: "PASS",
  initial: { totalBlockers: 14, system: 10, manual: 4, formalPilots: 0 },
  manualEvidenceRequired: true,
  completedState: ["可進入正式上線", "安排正式上線日期與責任人"],
  dashboardAndGuideSynchronized: true,
  schedulingFitUnchanged: true,
}, null, 2));
