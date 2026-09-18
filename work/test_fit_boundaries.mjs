import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const w = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const ability = w.worksheets.getItem("試行能力狀態");
const fit = w.worksheets.getItem("排班適配試算");
const values = ability.getRange("A7:L258").values;

function ratingCell(key) {
  const index = values.findIndex((row) => row[11] === key);
  if (index < 0) throw new Error(`Missing key ${key}`);
  return ability.getRange(`E${7 + index}`);
}

const main = ratingCell("1001|LJT-PREP-SCALING");
const common = ratingCell("1001|COMMON-RECORD");
const originalMain = main.values[0][0];
const originalCommon = common.values[0][0];

const results = [];
w.recalculate();
results.push(["baseline", fit.getRange("S7").values[0][0], fit.getRange("L7:M7").values[0]]);
main.values = [["Ø"]];
w.recalculate();
results.push(["one_O", fit.getRange("S7").values[0][0], fit.getRange("L7:M7").values[0]]);
common.values = [["Ø"]];
w.recalculate();
results.push(["two_O", fit.getRange("S7").values[0][0], fit.getRange("L7:M7").values[0]]);
main.values = [["△"]];
common.values = [[originalCommon]];
w.recalculate();
results.push(["below_O", fit.getRange("S7").values[0][0], fit.getRange("K7:M7").values[0]]);
main.values = [[originalMain]];
common.values = [[originalCommon]];
w.recalculate();

console.log(JSON.stringify(results));
