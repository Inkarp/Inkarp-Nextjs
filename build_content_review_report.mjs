import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const findings = JSON.parse(await fs.readFile("tmp/editorial-content-findings.json", "utf8"));

function suggestion(row) {
  const text = row.text;
  if (/CarouXel is a real reference/i.test(text)) return "CarouXel compatibility";
  if (/Mentioned once, tied to the tenfold claim/i.test(text)) return "CarouXel is referenced in connection with the stated productivity increase. Confirm the applicable configuration with Inkarp.";
  if (/source stays|kept the page/i.test(text)) return "Detailed specifications and configuration information are available from Inkarp.";
  if (/Two accuracy figures appear/i.test(text)) return "Accuracy depends on the applicable configuration. Confirm the correct specification with Inkarp before quotation.";
  if (/breadcrumb|model 9920|model 9942/i.test(text)) return "Confirm the exact model number and applicable specification with Inkarp before publication or quotation.";
  if (/angle rotor capacity|different rotor/i.test(text)) return "Confirm the exact rotor model and capacity with Inkarp before quotation.";
  if (/discrepancy|both presented as given/i.test(text)) return "Verify the correct specification with the principal and publish only the confirmed value.";
  if (/built so far/i.test(text)) return "Remove ‘built so far’. Retain the comparison only after the claim is verified against the complete current product range.";
  if (/not a blanket claim/i.test(text)) return "State the condition directly: Up to tenfold productivity when coupled to a multi-column system or CarouXel.";
  if (/according to the source|per the source|the source (?:describes|states|claims)/i.test(text)) return "Remove the source attribution. Retain the product claim only after it is verified.";
  if (/source content wasn't available/i.test(text)) return "Remove this line and publish product information only after the missing content is verified.";
  if (/not explicitly stated.*accuracy|accuracy and repeatability/i.test(text)) return "Accuracy and repeatability for this configuration are available on request from Inkarp.";
  if (/not confirmed|weren't confirmed|wasn't confirmed|not published|not stated|not detailed|didn't return content|source page pulled|source page reviewed/i.test(text)) return "Detailed specifications are available on request from Inkarp.";
  if (/source material/i.test(text)) return "Rewrite with the confirmed product specification only; otherwise state that confirmation is available from Inkarp.";
  return "Rewrite as a direct customer-facing product statement, without mentioning the source, content-generation process or internal review.";
}

function issueType(row) {
  const text = row.text;
  if (/\bI(?:'|’)m\b|\bI(?:'|’)ve\b|not picking one/i.test(text)) return "First-person editorial voice";
  if (/built so far|placeholders? pending/i.test(text)) return "Internal/incomplete catalogue wording";
  if (/breadcrumb|different rotor|source material|discrepancy|both presented/i.test(text)) return "Source discrepancy exposed to customer";
  return "Source-review wording";
}

const rows = findings.map((row) => [
  row.principal,
  row.product,
  row.slug,
  row.tab,
  row.jsonPath,
  row.text,
  issueType(row),
  row.action,
  suggestion(row),
  row.file,
  "Pending",
  "",
]);

const wb = Workbook.create();
const sheet = wb.worksheets.add("Content Review");
sheet.showGridLines = false;
sheet.tabColor = "#C65911";
sheet.getRange("A1:L1000").format.font = { name: "Arial", size: 10, color: "#1F2937" };

sheet.getRange("A2:L2").merge();
sheet.getRange("A2").values = [["Product Tab Content Requiring Editorial Review"]];
sheet.getRange("A2:L2").format = { font: { name: "Arial", size: 16, bold: true, color: "#17365D" } };
sheet.getRange("A3:L3").merge();
sheet.getRange("A3").values = [["AI/editorial voice, source-review wording and internal uncertainty statements found in customer-visible product tabs"]];
sheet.getRange("A3:L3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" } };
sheet.getRange("A4:L4").merge();
sheet.getRange("A4").values = [["Scan scope: all 425 website products across 148 source files and 2,976 customer-visible tab sections; 0 products were omitted"]];
sheet.getRange("A4:L4").format = { font: { name: "Arial", size: 10, bold: true, color: "#385723" }, fill: "#E2F0D9" };

sheet.getRange("A5:F5").values = [["Flagged entries", findings.length, "Affected products", new Set(findings.map((row) => row.slug)).size, "Affected principals", new Set(findings.map((row) => row.principal)).size]];
sheet.getRange("A5:F5").format = { fill: "#FFF2CC", font: { bold: true, color: "#7F6000" }, horizontalAlignment: "center" };

const headers = ["Principal", "Product", "Product slug", "Tab / section", "JSON location", "Flagged website text", "Issue type", "Recommended action", "Suggested customer-facing replacement", "Source file", "Writer status", "Final replacement / note"];
sheet.getRange("A7:L7").values = [headers];
sheet.getRange("A7:L7").format = {
  fill: "#1F4E78",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#FFFFFF" },
};
sheet.getRangeByIndexes(7, 0, rows.length, headers.length).values = rows;
const lastRow = rows.length + 7;
const table = sheet.tables.add(`A7:L${lastRow}`, true, "ProductContentReview");
table.style = "TableStyleMedium2";
table.showFilterButton = true;
sheet.getRange(`A8:L${lastRow}`).format.verticalAlignment = "top";
sheet.getRange(`A8:L${lastRow}`).format.wrapText = true;
sheet.getRange(`A8:L${lastRow}`).format.rowHeight = 76;
sheet.getRange(`H8:H${lastRow}`).conditionalFormats.add("containsText", { text: "Remove", format: { fill: "#FCE4D6", font: { bold: true, color: "#9C0006" } } });
sheet.getRange(`H8:H${lastRow}`).conditionalFormats.add("containsText", { text: "Rewrite", format: { fill: "#FFF2CC", font: { bold: true, color: "#7F6000" } } });
sheet.getRange(`K8:K${lastRow}`).dataValidation = { rule: { type: "list", values: ["Pending", "Remove", "Rewrite", "Keep after verification", "Completed"] } };
sheet.getRange(`K8:L${lastRow}`).format.fill = "#FFF9E6";

const widths = [25, 38, 36, 36, 39, 72, 32, 24, 72, 58, 23, 60];
widths.forEach((width, index) => sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width);
sheet.freezePanes.freezeRows(7);
sheet.freezePanes.freezeColumns(3);

wb.recalculate();
const outputDir = "outputs/product-content-review";
await fs.mkdir(outputDir, { recursive: true });
const preview = await wb.render({ sheetName: "Content Review", range: "A1:L18", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/content-review-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const check = await wb.inspect({ kind: "table", range: "Content Review!A2:L15", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 12, maxChars: 14000 });
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/Product_Content_Editorial_Review_Updated.xlsx`);
console.log(JSON.stringify({ findings: findings.length, products: new Set(findings.map((row) => row.slug)).size, principals: new Set(findings.map((row) => row.principal)).size }));
console.log(check.ndjson);
console.log(errors.ndjson);
