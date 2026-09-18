import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const w = await SpreadsheetFile.importXlsx(await FileBlob.load("../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx"));
const s = w.worksheets.add("tmp");
s.getRange("A1").formulas = [[`=_xlfn.XLOOKUP("1001|LJT-RPD-FINAL",'試行能力狀態'!$L$7:$L$258,'試行能力狀態'!$E$7:$E$258,"未評估",0)`]];
s.getRange("A2").formulas = [[`=_xlfn.XLOOKUP("1001|LJT-RPD-FINAL",'資格有效性'!$L$7:$L$62,'資格有效性'!$E$7:$E$62,"未建立",0)`]];
w.recalculate();
console.log(JSON.stringify(s.getRange("A1:A2").values));
console.log(JSON.stringify(s.getRange("A1:A2").formulas));
