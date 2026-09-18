import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./checklist-workflow-previews/主管工作台-final.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const assessments = wb.worksheets.getItem("考核紀錄輸入");
const formulas = [];
for (let r = 7; r <= 206; r++) {
  formulas.push([
    `=IF($A${r}="","",IF(OR(LEN($B${r})=0,LEN($C${r})=0,LEN($E${r})=0,LEN($F${r})=0,LEN($G${r})=0,LEN($H${r})=0,LEN($I${r})=0,LEN($J${r})=0,LEN($L${r})=0,LEN($M${r})=0,LEN($O${r})=0),"待補欄位",IF($R${r}<>"已發布","檢核表版本未發布",IF(AND($L${r}="通過",OR($I${r}>0,$J${r}>0)),"結果與必要項目矛盾",IF(AND($L${r}="通過",$M${r}<>"Ø"),"通過後建議評等應為 Ø",IF($O${r}<>"已知悉","待助理知悉",IF($P${r}="","待補知悉日",IF(OR($Q${r}="有異議",$Q${r}="複核中"),"異議處理中","可送主管核定"))))))))`,
  ]);
}
assessments.getRange("S7:S206").formulas = formulas;
wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "考核紀錄輸入!R6:U10", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 6, maxChars: 8000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 500 }, maxChars: 12000 })).ndjson);
const image = await wb.render({ sheetName: "主管工作台", range: "A20:E27", scale: 1.4, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
console.log(`SAVED ${path}`);
