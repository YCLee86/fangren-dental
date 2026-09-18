import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const doctor = wb.worksheets.getItem("醫師模式規則輸入");
const mobility = wb.worksheets.getItem("流動層級規則輸入");
const grade = wb.worksheets.getItem("職級矩陣規則輸入");
const dashboard = wb.worksheets.getItem("主管工作台");

doctor.getRange("N7").values = [["已核定"]];
mobility.getRange("J7").values = [["已核定"]];
grade.getRange("I7").values = [["已核定"]];
wb.recalculate();
const incomplete = {
  doctor: doctor.getRange("Q7").values[0][0],
  mobility: mobility.getRange("M7").values[0][0],
  grade: grade.getRange("L7").values[0][0],
  counts: dashboard.getRange("B20:B22").values.flat(),
};

doctor.getRange("C7:O7").values = [["固定型", "LBH-SCALING", "洗牙", "一般", "一般", 1, 0, null, 21, "V1", new Date("2026-09-17"), "已核定", "助理長"]];
mobility.getRange("D7:K7").values = [["FLOW-CLEAN", "器械清消流程", "◎", "必備", "V1", new Date("2026-09-17"), "已核定", "助理長"]];
grade.getRange("C7:J7").values = [["技能", "FLOW-CLEAN", "◎", "必備", "V1", new Date("2026-09-17"), "已核定", "助理長"]];
wb.recalculate();
const complete = {
  doctor: doctor.getRange("Q7").values[0][0],
  mobility: mobility.getRange("M7").values[0][0],
  grade: grade.getRange("L7").values[0][0],
  counts: dashboard.getRange("B20:B22").values.flat(),
};

console.log(JSON.stringify({ incomplete, complete }, null, 2));
if (incomplete.doctor !== "已核定但資料未完整" || incomplete.mobility !== "已核定但資料未完整" || incomplete.grade !== "已核定但資料未完整") throw new Error("An incomplete approved row was not blocked.");
if (incomplete.counts.map(Number).join(",") !== "8,9,10") throw new Error("Incomplete approved rows disappeared from dashboard counts.");
if (complete.doctor !== "可發布" || complete.mobility !== "可發布" || complete.grade !== "可發布") throw new Error("A complete approved row did not become publishable.");
if (complete.counts.map(Number).join(",") !== "7,8,9") throw new Error("Publishable rows did not reduce dashboard counts exactly once.");
console.log("PASS: all three rule-intake workflows keep incomplete approvals open and publish only complete approved rows without saving test data.");
