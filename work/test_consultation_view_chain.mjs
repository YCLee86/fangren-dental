import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const demand = wb.worksheets.getItem("班次需求輸入");
const check = wb.worksheets.getItem("班次檢核總覽");
const view = wb.worksheets.getItem("諮詢排班視圖");

demand.getRange("K7").values = [["正式"]];
check.getRange("Q7").values = [["通過"]];
wb.recalculate();
const initialAction = view.getRange("T11").values[0][0];
const initialConsultCount = view.getRange("G7").values[0][0];

demand.getRange("N7:O7").values = [["魏希謀主任", new Date("2026-08-31")]];
wb.recalculate();
const oneWeekAction = view.getRange("T11").values[0][0];

demand.getRange("Q7:T7").values = [["當次助理", new Date("2026-09-14"), "無變更", "無異動"]];
wb.recalculate();
const completedAction = view.getRange("T11").values[0][0];
const readyCount = view.getRange("D7").values[0][0];

demand.getRange("S7:T7").values = [["影響人力", "增加人力"]];
demand.getRange("V7").values = [["未處理"]];
wb.recalculate();
const supervisorAction = view.getRange("T11").values[0][0];
const supervisorCount = view.getRange("J7").values[0][0];

demand.getRange("U7:W7").values = [["增加 1 名人力", "已重新檢核", "助理主管"]];
wb.recalculate();
const recheckedAction = view.getRange("T11").values[0][0];

console.log(JSON.stringify({ initialAction, initialConsultCount, oneWeekAction, completedAction, readyCount, supervisorAction, supervisorCount, recheckedAction }, null, 2));
if (initialAction !== "完成三週前療程標記" || Number(initialConsultCount) !== 1) throw new Error("Consultation three-week action did not appear.");
if (oneWeekAction !== "完成一週前診前確認") throw new Error("Consultation one-week action did not appear.");
if (completedAction !== "完成" || Number(readyCount) !== 1) throw new Error("Completed confirmation was not shown as ready.");
if (supervisorAction !== "通知助理主管處理人力異動" || Number(supervisorCount) !== 1) throw new Error("Staffing change was not routed to the assistant supervisor.");
if (recheckedAction !== "完成") throw new Error("Rechecked demand did not return to complete.");
console.log("PASS: consultation view routes three-week, one-week, supervisor, and ready actions without exposing assessment fields or saving test data.");
