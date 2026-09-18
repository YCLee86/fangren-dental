import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const demand = wb.worksheets.getItem("班次需求輸入");
const check = wb.worksheets.getItem("班次檢核總覽");

demand.getRange("K7").values = [["正式"]];
check.getRange("Q7").values = [["通過"]];
wb.recalculate();
const initialFlow = demand.getRange("X7").values[0][0];
const initialRelease = check.getRange("U7").values[0][0];

demand.getRange("N7:O7").values = [["魏希謀主任", new Date("2026-08-31")]];
wb.recalculate();
const afterThreeWeek = demand.getRange("X7").values[0][0];

demand.getRange("Q7:T7").values = [["當次助理", new Date("2026-09-14"), "無變更", "無異動"]];
wb.recalculate();
const completeFlow = demand.getRange("X7").values[0][0];
const publishable = check.getRange("U7").values[0][0];

demand.getRange("S7:T7").values = [["影響人力", "增加人力"]];
demand.getRange("V7").values = [["未處理"]];
wb.recalculate();
const changePending = demand.getRange("X7").values[0][0];
const releasePending = check.getRange("U7").values[0][0];

demand.getRange("U7:W7").values = [["增加 1 名具備洗牙能力之助理", "已重新檢核", "助理主管"]];
wb.recalculate();
const recheckedFlow = demand.getRange("X7").values[0][0];
const republishable = check.getRange("U7").values[0][0];

demand.getRange("T7").values = [["病患取消"]];
demand.getRange("U7:W7").values = [["病患取消，原人力可調整", "人力可調整", "助理主管"]];
wb.recalculate();
const cancelledFlow = demand.getRange("X7").values[0][0];
const released = check.getRange("U7").values[0][0];

console.log(JSON.stringify({ initialFlow, initialRelease, afterThreeWeek, completeFlow, publishable, changePending, releasePending, recheckedFlow, republishable, cancelledFlow, released }, null, 2));
if (initialFlow !== "待三週前標記" || initialRelease !== "待三週前標記") throw new Error("Three-week marker gate failed.");
if (afterThreeWeek !== "待一週前確認") throw new Error("One-week confirmation gate failed.");
if (completeFlow !== "確認完成" || publishable !== "可發布") throw new Error("Confirmed schedule was not publishable.");
if (changePending !== "人力異動待處理" || releasePending !== "人力異動待處理") throw new Error("Staffing change did not reopen checks.");
if (recheckedFlow !== "確認完成" || republishable !== "可發布") throw new Error("Rechecked staffing change did not return to publishable.");
if (cancelledFlow !== "確認完成" || released !== "人力已釋出") throw new Error("Cancellation did not preserve and release staffing correctly.");
console.log("PASS: three-week marker, one-week confirmation, staffing change recheck, and cancellation release all work without saving test data.");
