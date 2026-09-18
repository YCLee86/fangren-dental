import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const intake = wb.worksheets.getItem("正式資料收件");
const dashboard = wb.worksheets.getItem("主管工作台");
const guide = wb.worksheets.getItem("主管操作導引");
const readiness = wb.worksheets.getItem("上線準備");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(intake.getRange("A7").values[0][0] === 9, "Initial package count should be 9");
assert(intake.getRange("G7").values[0][0] === 4, "Initial external unreceived count should be 4");
assert(intake.getRange("I7").values[0][0] === 0, "Initial received-awaiting-approval count should be 0");
assert(intake.getRange("K7").values[0][0] === 5, "Initial internal/pilot pending count should be 5");
assert(dashboard.getRange("B30").values[0][0] === 9, "Dashboard intake count is not synchronized");
assert(dashboard.getRange("I20").values[0][0] === "先收齊診所正式資料", "Dashboard priority should point to external data intake");
assert(guide.getRange("D15").values[0][0] === 4, "Guide should show four external packages pending");
assert(readiness.getRange("B7").values[0][0] === "先收齊診所正式資料", "Go-live next step should point to formal data collection");

intake.getRange("I12").values = [["已提供"]];
wb.recalculate();
assert(intake.getRange("M12").values[0][0] === "待補收件資料", "Receipt should not advance without date and receiver");

intake.getRange("J12:K12").values = [[46282, "測試收件人"]];
wb.recalculate();
assert(intake.getRange("M12").values[0][0] === "已收件，待核定", "Complete receipt evidence should advance to approval");
assert(intake.getRange("G7").values[0][0] === 3, "External unreceived count did not decrease");
assert(intake.getRange("I7").values[0][0] === 1, "Received-awaiting-approval count did not increase");
assert(intake.getRange("A7").values[0][0] === 9, "Receipt alone must not count as completed");

dashboard.getRange("B20").values = [[0]];
wb.recalculate();
assert(intake.getRange("L12").values[0][0] === "系統條件完成", "Completed source data did not pass system completeness");
assert(intake.getRange("M12").values[0][0] === "已完成", "Completed and approved source data did not close the package");
assert(intake.getRange("A7").values[0][0] === 8, "Completed package did not reduce overall pending count");
assert(intake.getRange("I7").values[0][0] === 0, "Completed package remained in received-awaiting-approval count");
assert(dashboard.getRange("B30").values[0][0] === 8, "Dashboard did not update after package completion");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during intake test");

console.log(JSON.stringify({
  status: "PASS",
  baseline: { pendingPackages: 9, externalUnreceived: 4, receivedAwaitingApproval: 0, internalOrPilotPending: 5 },
  receiptEvidenceRequired: true,
  receiptDoesNotBypassApproval: true,
  sourceCompletionClosesPackage: true,
  dashboardGuideAndReadinessSynchronized: true,
  schedulingFitUnchanged: true,
}, null, 2));
