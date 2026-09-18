import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const support = wb.worksheets.getItem("支援者資格核定");
const assign = wb.worksheets.getItem("排班配置輸入");
const check = wb.worksheets.getItem("班次檢核總覽");

const keys = support.getRange("A7:A188").values.flat();
const rowFor = (key) => {
  const index = keys.indexOf(key);
  if (index < 0) throw new Error(`Missing support qualification key: ${key}`);
  return index + 7;
};

const implantRow = rowFor("SUP|1001|LJT-IMPLANT");
const scalingRow = rowFor("SUP|1001|LJT-SCALING");

// Full supporter: two slots and high-complexity work are allowed after approval.
support.getRange(`H${implantRow}`).values = [["初步可獨立"]];
support.getRange(`J${implantRow}:L${implantRow}`).values = [["核定完整支援者", new Date("2026-09-17"), "助理主管"]];
assign.getRange("B9:H9").values = [["S002", "1001", "員工1001", "完整支援", 2, "是", "LJT-IMPLANT"]];
wb.recalculate();
const fullResult = support.getRange(`N${implantRow}:P${implantRow}`).values[0];
const fullRoleCheck = assign.getRange("K9").values[0][0];
const fullCapacity = check.getRange("M8").values[0][0];

// Technical backup: high-complexity work is prohibited and contributes no capacity.
support.getRange(`H${implantRow}`).values = [["待確認共通技能門檻"]];
support.getRange(`J${implantRow}:L${implantRow}`).values = [["核定技術備援者", new Date("2026-09-17"), "助理主管"]];
assign.getRange("E9:F9").values = [["技術備援", 1]];
wb.recalculate();
const highTechResult = support.getRange(`N${implantRow}:P${implantRow}`).values[0];
const highTechRoleCheck = assign.getRange("K9").values[0][0];
const highTechCapacity = check.getRange("M8").values[0][0];

// Technical backup: one general slot is allowed, but two slots exceed the cap.
support.getRange(`H${scalingRow}`).values = [["待確認共通技能門檻"]];
support.getRange(`J${scalingRow}:L${scalingRow}`).values = [["核定技術備援者", new Date("2026-09-17"), "助理主管"]];
assign.getRange("B9:H9").values = [["S001", "1001", "員工1001", "技術備援", 1, "是", "LJT-SCALING"]];
wb.recalculate();
const generalTechResult = support.getRange(`N${scalingRow}:P${scalingRow}`).values[0];
const generalOneRoleCheck = assign.getRange("K9").values[0][0];
const generalOneCapacity = check.getRange("M7").values[0][0];

assign.getRange("F9").values = [[2]];
wb.recalculate();
const generalTwoRoleCheck = assign.getRange("K9").values[0][0];
const generalTwoCapacity = check.getRange("M7").values[0][0];

const observed = {
  fullResult,
  fullRoleCheck,
  fullCapacity,
  highTechResult,
  highTechRoleCheck,
  highTechCapacity,
  generalTechResult,
  generalOneRoleCheck,
  generalOneCapacity,
  generalTwoRoleCheck,
  generalTwoCapacity,
};
console.log(JSON.stringify(observed, null, 2));

if (fullResult[0] !== "完整支援者" || Number(fullResult[1]) !== 2 || fullResult[2] !== "是") throw new Error("Full supporter approval did not produce the expected qualification.");
if (fullRoleCheck !== "支援資格通過" || Number(fullCapacity) !== 2) throw new Error("Full supporter did not contribute two high-complexity slots.");
if (highTechResult[0] !== "技術備援者" || Number(highTechResult[1]) !== 1 || highTechResult[2] !== "否") throw new Error("Technical backup approval did not produce the expected qualification.");
if (highTechRoleCheck !== "高複雜度不可由技術備援" || Number(highTechCapacity) !== 0) throw new Error("Technical backup was incorrectly accepted for high complexity.");
if (generalTechResult[0] !== "技術備援者" || generalOneRoleCheck !== "支援資格通過" || Number(generalOneCapacity) !== 1) throw new Error("One general technical-backup slot was not accepted.");
if (generalTwoRoleCheck !== "支援名額超過核定上限" || Number(generalTwoCapacity) !== 0) throw new Error("Technical backup cap was not enforced.");

console.log("PASS: support approval, slot caps, high-complexity restriction, and capacity aggregation work without saving test data.");
