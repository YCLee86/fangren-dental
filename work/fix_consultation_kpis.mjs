import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const previewPath = "./consultation-view-preview/諮詢排班視圖.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheet = wb.worksheets.getItem("諮詢排班視圖");
sheet.getRange("G7").formulas = [[`=COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"完成三週前療程標記")+COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"完成一週前診前確認")`]];
sheet.getRange("J7").formulas = [[`=COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"通知助理主管處理人力異動")+COUNTIFS($B$11:$B$40,"正式",$T$11:$T$40,"等候助理主管完成人力或資格檢核")`]];
wb.recalculate();
const image = await wb.render({ sheetName: "諮詢排班視圖", range: "A1:T18", scale: 1.2, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));
console.log((await wb.inspect({ kind: "table", range: "諮詢排班視圖!A6:N13", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 16, maxChars: 12000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path);
