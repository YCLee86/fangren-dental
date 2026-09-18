import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const guide = wb.worksheets.getItem("主管操作導引");
const dashboard = wb.worksheets.getItem("主管工作台");
const demand = wb.worksheets.getItem("班次需求輸入");
const checks = wb.worksheets.getItem("班次檢核總覽");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const fitBefore = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});

assert(guide.getRange("B6").values[0][0] === "完成初始資料與資格核定", "Initial guide priority is incorrect");
assert(dashboard.getRange("I20").values[0][0] === guide.getRange("B6").values[0][0], "Dashboard and guide priorities differ");
assert(guide.getRange("D14").values[0][0] === dashboard.getRange("A7").values[0][0] + dashboard.getRange("B24").values[0][0] + dashboard.getRange("B25").values[0][0] + dashboard.getRange("B26").values[0][0], "Governance pending count is not reconciled");
assert(guide.getRange("D15").values[0][0] === 27, "Official-rule pending count should be 27");
assert(guide.getRange("D18").values[0][0] === 36, "Assessment/checklist pending count should be 36");

demand.getRange("A10:H10").values = [["GUIDE-TST-001", 46286, 0.75, 0.79, "李侑津醫師", "LJT-SCALING", "一般診已確認", 1]];
demand.getRange("K10:L10").values = [["正式", "主管導引優先順序測試"]];
demand.getRange("N10:O10").values = [["測試諮詢", 46265]];
demand.getRange("Q10:W10").values = [["測試跟診", 46279, "無影響", "無異動", null, null, null]];
checks.getRange("A10").values = [["GUIDE-TST-001"]];
wb.recalculate();

assert(dashboard.getRange("D7").values[0][0] === 1, "New formal shift did not create a scheduling alert");
assert(guide.getRange("B6").values[0][0] === "先處理班次安全異常", "Guide priority did not switch to the scheduling alert");
assert(guide.getRange("B7").values[0][0] === "班次檢核總覽／排班配置輸入", "Guide did not point to the correct operating location");
assert(dashboard.getRange("I20").values[0][0] === "先處理班次安全異常", "Dashboard priority did not switch with the guide");
assert(guide.getRange("D16").values[0][0] === 1 && guide.getRange("K16").values[0][0] === "待處理", "Workflow row did not react to the scheduling alert");

const fitAfter = JSON.stringify({
  values: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").values,
  formulas: wb.worksheets.getItem("排班適配試算").getRange("S7:U7").formulas,
});
assert(fitAfter === fitBefore, "Scheduling-fit calculation changed during guide priority test");

console.log(JSON.stringify({
  status: "PASS",
  initialPriority: "完成初始資料與資格核定",
  alertPriority: guide.getRange("B6:B8").values.map((r) => r[0]),
  guideAndDashboardSynchronized: true,
  workflowStatusUpdated: guide.getRange("D16:K16").values[0],
  schedulingFitUnchanged: true,
}, null, 2));
