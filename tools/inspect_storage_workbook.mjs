import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const source = "outputs/storage-solution-comparison/Inkarp_Storage_Solution_Comparison.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));

console.log("SHEETS", workbook.worksheets.items.map((sheet) => sheet.name));
for (const sheet of workbook.worksheets.items) {
  const inspection = await workbook.inspect({
    kind: "table",
    range: `${sheet.name}!A1:Z60`,
    include: "values,formulas",
    tableMaxRows: 60,
    tableMaxCols: 26,
  });
  console.log(`\n--- ${sheet.name} ---\n${inspection.ndjson}`);
  const preview = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`outputs/storage-solution-comparison/${sheet.name.replace(/[^a-z0-9_-]/gi, "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}
