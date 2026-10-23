import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const wb = Workbook.create();
const checklist = wb.worksheets.add("Checklist");
const guide = wb.worksheets.add("Simple Guide");
const font = "Arial";
const navy = "#17365D";
const blue = "#1F4E78";
const green = "#E2F0D9";
const yellow = "#FFF2CC";

for (const sheet of [checklist, guide]) {
  sheet.showGridLines = false;
  sheet.getRange("A1:H200").format.font = { name: font, size: 10, color: "#1F2937" };
}

checklist.getRange("A2:G2").merge();
checklist.getRange("A2").values = [["Company File Storage Selection Checklist"]];
checklist.getRange("A2:G2").format = { font: { name: font, size: 16, bold: true, color: navy } };
checklist.getRange("A3:G3").merge();
checklist.getRange("A3").values = [["Recommended setup: SharePoint and OneDrive for employee files; Azure Blob Storage and Front Door for public website images, videos and PDFs"]];
checklist.getRange("A3:G3").format = { fill: green, font: { name: font, size: 10, bold: true, color: "#385723" }, wrapText: true };

checklist.getRange("A5:G5").values = [["No.", "Requirement to check", "Why it matters", "Recommended tool", "Required?", "Checked?", "Notes / decision"]];
checklist.getRange("A5:G5").format = { fill: blue, font: { name: font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };

const checks = [
  [1, "Store images, videos, PDFs, HTML and Microsoft Office files", "One system must accept the company’s common file formats", "SharePoint/OneDrive for internal files; Azure Blob for website files", "Yes", "Not checked", ""],
  [2, "Create a separate folder or library for each person", "Each employee needs an assigned work area", "SharePoint or OneDrive", "Yes", "Not checked", ""],
  [3, "Give each person access only to assigned folders", "Prevents staff from seeing files outside their responsibility", "SharePoint permissions using Microsoft 365 groups", "Yes", "Not checked", ""],
  [4, "Allow managers or administrators to access required folders", "Management needs oversight and continuity", "SharePoint owner/admin groups", "Yes", "Not checked", ""],
  [5, "Use company-owned user accounts", "The company keeps control when an employee leaves", "Microsoft 365 business accounts", "Yes", "Not checked", ""],
  [6, "Support Word, Excel and PowerPoint editing", "Employees can work without downloading and re-uploading files", "Microsoft 365 + SharePoint/OneDrive", "Yes", "Not checked", ""],
  [7, "Keep previous file versions", "Accidental changes can be reversed", "SharePoint/OneDrive version history", "Yes", "Not checked", ""],
  [8, "Recover deleted files", "Protects against accidental deletion", "Recycle bin and retention policy", "Yes", "Not checked", ""],
  [9, "Record who viewed, changed or shared files", "Provides accountability and helps investigate mistakes", "Microsoft 365 audit logs", "Yes", "Not checked", ""],
  [10, "Require multi-factor authentication", "Protects accounts if a password is stolen", "Microsoft Entra ID / Microsoft 365", "Yes", "Not checked", ""],
  [11, "Control external sharing", "Stops uncontrolled public links", "SharePoint sharing policies", "Yes", "Not checked", ""],
  [12, "Set storage and upload limits", "Confirms that large videos and archives will fit", "Review Microsoft 365 and Azure limits", "Yes", "Not checked", ""],
  [13, "Provide mobile and desktop access", "Employees can work from approved devices", "OneDrive sync and mobile apps", "Preferred", "Not checked", ""],
  [14, "Store approved website images and PDFs separately", "Public website files should not be mixed with private employee files", "Azure Blob Storage", "Yes", "Not checked", ""],
  [15, "Deliver website files quickly", "Customers should receive images and downloads without Drive delays", "Azure Front Door/CDN", "Yes", "Not checked", ""],
  [16, "Use a company web address for downloads", "Provides stable and professional links", "Example: catalogues.inkarp.co.in", "Preferred", "Not checked", ""],
  [17, "Keep public storage separate from confidential storage", "Prevents private documents from becoming public", "Separate SharePoint libraries and Azure containers", "Yes", "Not checked", ""],
  [18, "Define who can publish files to the website", "Only approved content should reach customers", "Publisher group and approval process", "Yes", "Not checked", ""],
  [19, "Confirm backup, retention and disaster recovery", "Files must remain recoverable after mistakes or outages", "Microsoft 365 retention plus Azure redundancy", "Yes", "Not checked", ""],
  [20, "Confirm monthly cost and support responsibility", "Management needs predictable ownership and expense", "Management and IT decision", "Yes", "Not checked", ""],
  [21, "Test access before migration", "Ensures one employee cannot open another person’s folder", "IT permission test", "Yes", "Not checked", ""],
  [22, "Plan migration from Google Drive", "Avoids broken website links and lost internal files", "Phased migration with backup and rollback", "Yes", "Not checked", ""],
];
checklist.getRangeByIndexes(5, 0, checks.length, 7).values = checks;
const checklistLast = checks.length + 5;
const checklistTable = checklist.tables.add(`A5:G${checklistLast}`, true, "StorageSelectionChecklist");
checklistTable.style = "TableStyleMedium2";
checklistTable.showFilterButton = true;
checklist.getRange(`A6:G${checklistLast}`).format = { verticalAlignment: "top", wrapText: true, rowHeight: 55 };
checklist.getRange(`F6:F${checklistLast}`).dataValidation = { rule: { type: "list", values: ["Not checked", "Yes", "No", "Not applicable"] } };
checklist.getRange(`F6:F${checklistLast}`).format.fill = yellow;
const checklistWidths = [8, 42, 50, 45, 15, 18, 42];
checklistWidths.forEach((width, index) => checklist.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width);
checklist.freezePanes.freezeRows(5);
checklist.freezePanes.freezeColumns(2);

guide.getRange("A2:D2").merge();
guide.getRange("A2").values = [["Simple Guide: What the Recommended Tools Do"]];
guide.getRange("A2:D2").format = { font: { name: font, size: 16, bold: true, color: navy } };
guide.getRange("A3:D3").merge();
guide.getRange("A3").values = [["Plain-language explanation for management and non-technical users"]];
guide.getRange("A3:D3").format = { font: { name: font, italic: true, color: "#667085" } };

guide.getRange("A5:D5").values = [["Topic", "Simple explanation", "Recommended choice", "Example"]];
guide.getRange("A5:D5").format = { fill: blue, font: { name: font, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
const details = [
  ["Final recommendation", "Use two connected systems because employee documents and public website files have different security and performance needs.", "SharePoint/OneDrive internally and Azure Blob/Front Door for the website", "Employees prepare a brochure privately, a manager approves it, and the approved PDF is published to the website."],
  ["SharePoint", "A secure company filing cabinet. It stores team, department and company documents with controlled permissions.", "Use for shared internal documents", "Sales, Service, Marketing and Management can each have separate libraries."],
  ["OneDrive", "An employee’s company-controlled personal work folder. It is useful for work in progress before sharing it with a team.", "Use for individual working files", "Employee A can access their OneDrive; the company administrator retains account control."],
  ["Azure Blob Storage", "A large online storage area designed for website files. It stores files but is not intended to behave like a normal employee document folder.", "Use for approved public website files", "Product images, catalogue PDFs and website videos."],
  ["Azure Front Door / CDN", "A delivery service placed in front of website storage. It gives customers faster downloads and protects the storage location.", "Use with Azure Blob Storage", "A customer downloads a catalogue from catalogues.inkarp.co.in rather than Google Drive."],
  ["Why two systems?", "SharePoint is easy for people and permissions. Blob Storage is better for fast public website delivery. One tool alone would compromise either usability or performance.", "Keep internal and public files separate", "Private quotation files stay in SharePoint; public brochures go to Blob Storage."],
  ["Separate folders for each person", "Create a private OneDrive or secured SharePoint folder/library and grant access only to that person and approved managers.", "Prefer groups and clear ownership", "Employee A cannot open Employee B’s folder unless specifically authorized."],
  ["Supported file types", "These platforms can store images, videos, PDFs, HTML and Microsoft Office documents. Office files can be edited directly in Microsoft 365.", "Confirm size limits before purchase", "JPG, PNG, MP4, PDF, HTML, DOCX, XLSX and PPTX."],
  ["HTML safety", "HTML can contain scripts. Internal HTML should normally be stored for download, while only approved HTML should be published publicly.", "Do not publish employee-uploaded HTML automatically", "A manager or web team reviews HTML before it reaches the website."],
  ["Google Drive", "Google Drive is suitable during transition and for ordinary sharing, but it is not the preferred permanent delivery system for a customer-facing website.", "Keep temporarily, then migrate", "Move catalogue links only after the new storage has been tested."],
  ["Alternative for Google Workspace users", "If the company already uses Google Workspace, Shared Drives can replace SharePoint and Google Cloud Storage/CDN can replace Azure Blob/Front Door.", "Use one ecosystem consistently", "Shared Drives internally; Cloud Storage for website files."],
  ["Alternative for AWS users", "Amazon S3 and CloudFront provide excellent website storage and delivery, but employee document collaboration still needs SharePoint, Google Workspace or another document platform.", "Choose when the technical team already uses AWS", "S3 stores PDFs and images; CloudFront delivers them."],
  ["What not to do", "Do not place confidential employee files in public website storage. Do not give everyone access to every folder. Do not depend on personal accounts.", "Use company accounts and least access", "Each employee receives only the folders required for their role."],
  ["Suggested folder structure", "Organize internal documents by department and responsibility rather than creating uncontrolled links to individual files.", "Use libraries and permission groups", "Company Documents > Sales > Employee A; Website Content > Approved Catalogues."],
  ["Migration approach", "Move in stages, test permissions and links, keep a temporary backup, and retire old links only after everything works.", "Do not move everything in one step", "Pilot with one department and a small group of website PDFs first."],
  ["Management decision needed", "Confirm whether the company already pays for Microsoft 365/Azure or Google Workspace. Existing subscriptions may make one option simpler and cheaper.", "Ask IT for current licences and storage use", "If Microsoft 365 is already used, the Microsoft option is usually the most straightforward."],
];
guide.getRangeByIndexes(5, 0, details.length, 4).values = details;
const guideLast = details.length + 5;
const guideTable = guide.tables.add(`A5:D${guideLast}`, true, "StorageSimpleGuide");
guideTable.style = "TableStyleMedium2";
guideTable.showFilterButton = true;
guide.getRange(`A6:D${guideLast}`).format = { verticalAlignment: "top", wrapText: true, rowHeight: 76 };
guide.getRange("A:A").format.columnWidth = 34;
guide.getRange("B:B").format.columnWidth = 72;
guide.getRange("C:C").format.columnWidth = 50;
guide.getRange("D:D").format.columnWidth = 62;
guide.getRange("A6:D6").format.fill = green;
guide.freezePanes.freezeRows(5);

wb.recalculate();
const outputDir = "outputs/storage-solution-comparison";
await fs.mkdir(outputDir, { recursive: true });
const check = await wb.inspect({ kind: "table", range: "Checklist!A2:G15", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 7, maxChars: 12000 });
const guideCheck = await wb.inspect({ kind: "table", range: "Simple Guide!A2:D12", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 4, maxChars: 12000 });
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
for (const [sheetName, range, file] of [["Checklist", "A1:G16", "tmp/storage-checklist-preview.png"], ["Simple Guide", "A1:D14", "tmp/storage-guide-preview.png"]]) {
  const preview = await wb.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(file, new Uint8Array(await preview.arrayBuffer()));
}
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/Inkarp_Storage_Solution_Comparison.xlsx`);
console.log(check.ndjson);
console.log(guideCheck.ndjson);
console.log(errors.ndjson);
