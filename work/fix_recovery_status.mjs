import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./recovery-upgrade-previews/資格恢復處理.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("資格恢復處理");
const formulas = [];
for (let r = 7; r <= 62; r++) {
  formulas.push([
    `=IF($F${r}="未建立","先完成考核",IF($F${r}="待主管核定","先完成資格核定",IF(AND($F${r}<>"資格暫停",$F${r}<>"逾期"),"無需恢復",IF($N${r}="不恢復","維持暫停",IF($N${r}="核定恢復",IF(AND($I${r}<>"",$J${r}<>"",$K${r}<>"",$L${r}="通過",$M${r}="符合",$O${r}<>"",$P${r}<>"",$Q${r}<>""),IF($P${r}<TODAY(),"新到期日已逾期","資格已恢復"),"恢復資料未完整"),"待完成恢復條件")))))`,
  ]);
}
sheet.getRange("S7:S62").formulas = formulas;
wb.recalculate();
const image = await wb.render({ sheetName: "資格恢復處理", range: "A1:S20", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "資格恢復處理!A6:S14", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 22, maxChars: 14000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
