import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const path = "../outputs/clinic-assistant-model/assistant_skill_matrix_v1_pilot.xlsx";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const qual = wb.worksheets.getItem("資格有效性");
const due = wb.worksheets.getItem("複評待辦");
const q = qual.getRange("A7:L62").values;
const dToF = [], g = [], hToI = [], j = [];
for (let i = 0; i < q.length; i++) {
  const r = i + 7, src = i + 7;
  dToF.push([[`='資格有效性'!D${src}`, `='資格有效性'!E${src}`, `=IF('資格有效性'!G${src}="","",'資格有效性'!G${src})`]]);
  g.push([q[i][7]]);
  hToI.push([[`=IF('資格有效性'!I${src}="","",'資格有效性'!I${src})`, `=IF($F${r}="","n.a.",$F${r}-TODAY())`]]);
  j.push([`=IF($E${r}="未建立","先完成考核",IF($E${r}="資格暫停","完成補訓與複評",IF($F${r}="","設定到期日",IF($I${r}<0,"立即停止使用資格",IF($I${r}<=30,"安排複評","尚未到期")))))`]);
}
due.getRange("D7:F62").formulas = dToF.map(x => x[0]);
due.getRange("G7:G62").values = g;
due.getRange("H7:I62").formulas = hToI.map(x => x[0]);
due.getRange("J7:J62").formulas = j;
wb.recalculate();
console.log((await wb.inspect({ kind: "table", range: "複評待辦!A6:J14", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 12, maxChars: 12000 })).ndjson);
console.log((await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, maxChars: 10000 })).ndjson);
const out = await SpreadsheetFile.exportXlsx(wb); await out.save(path);
