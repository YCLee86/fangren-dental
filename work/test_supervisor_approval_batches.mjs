import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const batch = wb.worksheets.getItem("主管核定批次");
const dashboard = wb.worksheets.getItem("主管工作台");
const intake = wb.worksheets.getItem("正式資料收件");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(batch.getRange("A7").values[0][0] === 6, "Baseline should have six unassigned approval workflows");
assert(batch.getRange("M7").values[0][0] === 710, "Baseline approval workload total is incorrect");
assert(batch.getRange("C7").values[0][0] === "未建立必要資格", "Highest unassigned workflow is incorrect");
assert(dashboard.getRange("B32").values[0][0] === 6, "Dashboard batch count is not synchronized");
assert(batch.getRange("O7").values[0][0] === 38, "Suggested batch total is incorrect");
assert(JSON.stringify(batch.getRange("I12:J17").values) === JSON.stringify([[10,3],[25,8],[30,13],[1,7],[7,2],[25,5]]), "Suggested sizes or batch counts are incorrect");

intake.getRange("G7").values = [[0]];
wb.recalculate();
assert(dashboard.getRange("I20").values[0][0] === "安排主管核定批次", "Dashboard did not route to batch planning after external intake was cleared");

batch.getRange("A23:B23").values = [["BATCH-001", "AP-02"]];
batch.getRange("D23:G23").values = [[5, "測試主管", 46290, "未開始"]];
batch.getRange("K23").values = [["資格記錄 1–5"]];
batch.getRange("L23").values = [[29]];
wb.recalculate();
assert(batch.getRange("C23").values[0][0] === "未建立必要資格", "Batch workflow lookup failed");
assert(batch.getRange("M23").values[0][0] === "批次有效", "Complete planned batch did not pass validation");
assert(batch.getRange("O23").values[0][0] === "在建議單批量內", "Suggested batch-size comparison failed");
assert(batch.getRange("E12").values[0][0] === 1 && batch.getRange("G12").values[0][0] === "部分已規劃", "Partial batch planning was not shown");
assert(batch.getRange("M12").values[0][0] === 5 && batch.getRange("N12").values[0][0] === 24, "Planned and unplanned volumes are incorrect");
assert(batch.getRange("A7").values[0][0] === 6 && dashboard.getRange("B32").values[0][0] === 6, "Partial planning incorrectly closed the workflow");

batch.getRange("D23").values = [[29]];
wb.recalculate();
assert(batch.getRange("O23").values[0][0] === "高於建議單批量", "Oversized batch warning did not appear");
assert(batch.getRange("G12").values[0][0] === "規劃已涵蓋" && batch.getRange("N12").values[0][0] === 0, "Full planning coverage was not recognized");
assert(batch.getRange("A7").values[0][0] === 5 && dashboard.getRange("B32").values[0][0] === 5, "Fully planned workflow count did not decrease");

batch.getRange("A24:B24").values = [["BATCH-001", "AP-03"]];
wb.recalculate();
assert(batch.getRange("M23").values[0][0] === "批次編號重複" && batch.getRange("M24").values[0][0] === "批次編號重複", "Duplicate batch IDs were not blocked");
batch.getRange("A24:B24").clear({ applyTo: "contents" });

batch.getRange("G23").values = [["已完成"]];
wb.recalculate();
assert(batch.getRange("M23").values[0][0] === "待補完成證據", "Completed batch passed without completion evidence");
batch.getRange("H23:J23").values = [[46289, 29, "複核主管"]];
wb.recalculate();
assert(batch.getRange("M23").values[0][0] === "批次有效", "Completed batch with evidence did not pass validation");
assert(batch.getRange("G12").values[0][0] === "未安排", "Completed batch incorrectly remained active while system work is pending");
assert(batch.getRange("A7").values[0][0] === 6, "Completed batch incorrectly closed a workflow while system work is pending");

dashboard.getRange("B17").values = [[0]];
wb.recalculate();
assert(batch.getRange("D12").values[0][0] === 0 && batch.getRange("G12").values[0][0] === "系統已完成", "System completion did not close the approval workflow");
assert(batch.getRange("K7").values[0][0] === 3, "Completed workflow count did not increase");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during approval batch test");

console.log(JSON.stringify({
  status: "PASS",
  baseline: { unassignedWorkflows: 6, pendingItems: 710 },
  priorityRoutingWorks: true,
  suggestedBatchTotal: 38,
  partialPlanningDoesNotFakeCoverage: true,
  fullPlanningCoverageWorks: true,
  oversizedBatchWarningWorks: true,
  duplicateBatchIdsBlocked: true,
  completionEvidenceRequired: true,
  batchCompletionDoesNotFakeSystemCompletion: true,
  dashboardSynchronized: true,
  schedulingFitUnchanged: true,
}, null, 2));
