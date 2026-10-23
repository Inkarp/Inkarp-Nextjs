import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const wb = Workbook.create();
const recommendation = wb.worksheets.add("Recommendation");
const comparison = wb.worksheets.add("Tool Comparison");
const requirements = wb.worksheets.add("Requirements Matrix");
const rollout = wb.worksheets.add("Implementation");

const navy = "#17365D";
const blue = "#1F4E78";
const teal = "#0F6B78";
const lightBlue = "#DDEBF7";
const lightGreen = "#E2F0D9";
const lightYellow = "#FFF2CC";
const lightRed = "#FCE4D6";
const grey = "#667085";
const font = "Arial";

for (const sheet of [recommendation, comparison, requirements, rollout]) {
  sheet.showGridLines = false;
  sheet.getRange("A1:Z200").format.font = { name: font, size: 10, color: "#1F2937" };
}

function title(sheet, range, text, subtitle) {
  sheet.getRange(range).merge();
  sheet.getRange(range.split(":")[0]).values = [[text]];
  sheet.getRange(range).format = { font: { name: font, size: 16, bold: true, color: navy }, verticalAlignment: "center" };
  const start = range.split(":")[0];
  const row = Number(start.match(/\d+/)[0]) + 1;
  const cols = range.match(/[A-Z]+/g);
  const subtitleRange = `${cols[0]}${row}:${cols[1]}${row}`;
  sheet.getRange(subtitleRange).merge();
  sheet.getRange(`${cols[0]}${row}`).values = [[subtitle]];
  sheet.getRange(subtitleRange).format = { font: { name: font, size: 10, italic: true, color: grey } };
}

function header(range) {
  range.format = {
    fill: blue,
    font: { name: font, size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "inside", style: "thin", color: "#FFFFFF" },
  };
}

title(recommendation, "A2:H2", "Inkarp File Storage Recommendation", "Manager summary for website media and secure employee document storage");
recommendation.getRange("A5:H5").values = [["Area", "Recommended tool", "What it should store", "Why it fits", "What it should not be used for", "Access model", "Priority", "Decision"]];
header(recommendation.getRange("A5:H5"));
recommendation.getRange("A6:H8").values = [
  ["Public website files", "Azure Blob Storage + Azure Front Door", "Approved product images, PDFs, videos and downloadable files", "Stable URLs, CDN delivery, custom domain, scalable storage and download logging", "Employee collaboration and personal working folders", "Website/application-controlled public or signed access", "High", "Recommended"],
  ["Internal employee files", "SharePoint Online + OneDrive", "Office documents, working PDFs, images, videos and department/person folders", "Easy folder/library permissions, Office collaboration, version history and recovery", "High-volume public website delivery", "Microsoft 365 groups, departments and individual permissions", "High", "Recommended"],
  ["Temporary transition", "Existing Google Drive", "Current catalogue PDFs until migration is complete", "Already connected to the website and requires no immediate infrastructure change", "Permanent website CDN or large-scale controlled publishing", "Existing Drive sharing permissions", "Medium", "Use temporarily"],
];
recommendation.getRange("A6:H8").format.wrapText = true;
recommendation.getRange("H6:H7").format = { fill: lightGreen, font: { bold: true, color: "#385723" }, horizontalAlignment: "center" };
recommendation.getRange("H8").format = { fill: lightYellow, font: { bold: true, color: "#7F6000" }, horizontalAlignment: "center" };

recommendation.getRange("A11:H11").merge();
recommendation.getRange("A11").values = [["Recommended long-term design"]];
recommendation.getRange("A11:H11").format = { fill: teal, font: { bold: true, color: "#FFFFFF", size: 11 } };
recommendation.getRange("A12:H15").values = [
  ["1", "Employees prepare files", "SharePoint / OneDrive", "Private working area", "", "", "", ""],
  ["2", "Manager approves files", "Approved catalogue/media library", "Controlled publishing step", "", "", "", ""],
  ["3", "Approved files are published", "Azure Blob Storage", "Public or protected website origin", "", "", "", ""],
  ["4", "Customers download files", "Azure Front Door / CDN", "Fast branded URL such as catalogues.inkarp.co.in", "", "", "", ""],
];
recommendation.getRange("A12:D15").format.wrapText = true;
recommendation.getRange("A18:H18").merge();
recommendation.getRange("A18").values = [["Management conclusion"]];
recommendation.getRange("A18:H18").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 11 } };
recommendation.getRange("A19:H21").merge();
recommendation.getRange("A19").values = [["No single tool is best at both collaboration and public website delivery. Use SharePoint/OneDrive for private employee files and Azure Blob Storage with Front Door for approved website images, videos and PDFs. Keep Google Drive only during migration."]];
recommendation.getRange("A19:H21").format = { fill: lightBlue, font: { size: 11, bold: true, color: navy }, wrapText: true, verticalAlignment: "center" };

title(comparison, "A2:K2", "Storage Tool Comparison", "What each option helps with and what remains missing");
comparison.getRange("A5:K5").values = [["Tool/platform", "Website images/PDFs", "Video delivery", "Office collaboration", "Individual folders/permissions", "CDN/custom domain", "Version history", "Ease for employees", "Main advantages", "What is missing / limitation", "Best use"]];
header(comparison.getRange("A5:K5"));
const comparisonRows = [
  ["SharePoint Online + OneDrive", "Supported", "Supported, not optimized as a public CDN", "Excellent", "Excellent", "No native public CDN", "Excellent", "Excellent", "Office editing, folder permissions, auditability and recovery", "Not intended for high-volume public website assets", "Internal company files"],
  ["Azure Blob Storage + Front Door", "Excellent", "Excellent", "No", "Possible through Entra/IAM, but technical", "Excellent", "Available", "Technical", "Fast website delivery, custom domain, scaling and security", "Poor employee collaboration and folder browsing experience", "Public website files"],
  ["Google Drive / Shared Drives", "Supported", "Supported", "Good", "Good", "No production CDN", "Good", "Excellent", "Easy sharing and familiar interface", "Public links, quotas and download behaviour are less suitable for a production website", "Temporary/internal sharing"],
  ["Google Cloud Storage + Cloud CDN", "Excellent", "Excellent", "No", "Possible through IAM, but technical", "Excellent", "Available", "Technical", "Scalable object storage with CDN delivery", "Needs technical setup and is not an Office collaboration portal", "Public website files"],
  ["Amazon S3 + CloudFront", "Excellent", "Excellent", "No", "Possible through IAM/Access Grants, but technical", "Excellent", "Available", "Technical", "Mature object storage, CDN and detailed access policies", "More infrastructure administration; no normal employee document workspace", "Public website files"],
  ["Cloudflare R2 + Cloudflare CDN", "Excellent", "Excellent", "No", "Technical access policies", "Excellent", "Available", "Technical", "Good public asset delivery and no R2 internet egress charges", "No Office collaboration or simple employee-folder experience", "Public website files"],
  ["Dropbox Business", "Supported", "Supported", "Good", "Good", "No production CDN", "Good", "Excellent", "Simple synchronization and sharing", "Not designed as the origin/CDN for a public product website", "Internal file sharing"],
  ["Website repository/public folder", "Supported", "Possible but unsuitable for large files", "No", "No", "Uses website hosting CDN", "Only through source control/deployments", "Poor", "Simple for a very small number of static files", "Increases repository and deployment size; every change needs deployment", "Small, rarely changed assets"],
];
comparison.getRangeByIndexes(5, 0, comparisonRows.length, 11).values = comparisonRows;
comparison.getRange(`A6:K${5 + comparisonRows.length}`).format.wrapText = true;
comparison.freezePanes.freezeRows(5);
comparison.freezePanes.freezeColumns(1);

title(requirements, "A2:J2", "Requirements Matrix", "Suggested management scoring: 1 = poor, 5 = excellent");
requirements.getRange("A5:J5").values = [["Option", "Website media (25%)", "Employee permissions (20%)", "Office collaboration (15%)", "CDN/custom domain (10%)", "Versioning (10%)", "Administration (10%)", "Scalability (10%)", "Weighted score / 5", "Comment"]];
header(requirements.getRange("A5:J5"));
const scoreRows = [
  ["SharePoint + OneDrive only", 3, 5, 5, 1, 5, 5, 3, null, "Strong internally; weak for public website delivery"],
  ["Azure Blob + Front Door only", 5, 3, 1, 5, 4, 3, 5, null, "Strong website platform; poor employee workspace"],
  ["Google Drive only", 3, 4, 4, 1, 4, 5, 3, null, "Convenient but not a production CDN"],
  ["AWS S3 + CloudFront only", 5, 3, 1, 5, 4, 2, 5, null, "Excellent website delivery; technical internal access"],
  ["SharePoint + Azure Blob/Front Door", 5, 5, 5, 5, 5, 4, 5, null, "Best fit when the company uses Microsoft 365"],
  ["Google Shared Drives + Cloud Storage/CDN", 5, 5, 4, 5, 5, 4, 5, null, "Best alternative when the company uses Google Workspace"],
];
requirements.getRangeByIndexes(5, 0, scoreRows.length, 10).values = scoreRows;
for (let row = 6; row <= 11; row++) {
  requirements.getRange(`I${row}`).formulas = [[`=B${row}*25%+C${row}*20%+D${row}*15%+E${row}*10%+F${row}*10%+G${row}*10%+H${row}*10%`]];
}
requirements.getRange("B6:I11").format.numberFormat = "0.0";
requirements.getRange("I10").format = { fill: lightGreen, font: { bold: true, color: "#385723" }, numberFormat: "0.0" };
requirements.getRange("A6:J11").format.wrapText = true;
requirements.getRange("A14:J14").merge();
requirements.getRange("A14").values = [["Scoring note: weights are suggested for management discussion and can be changed if employee collaboration or website delivery has a different priority."]];
requirements.getRange("A14:J14").format = { fill: lightYellow, font: { italic: true, color: "#7F6000" }, wrapText: true };

title(rollout, "A2:H2", "Suggested Implementation Plan", "A practical transition from Google Drive to controlled internal and website storage");
rollout.getRange("A5:H5").values = [["Phase", "Action", "Owner", "Output", "Security requirement", "Website impact", "Dependency", "Status"]];
header(rollout.getRange("A5:H5"));
rollout.getRange("A6:H13").values = [
  [1, "Confirm Microsoft 365/Azure or Google Workspace preference", "Management + IT", "Approved platform decision", "Named business owner and administrator", "None", "Existing subscriptions", "Decision required"],
  [2, "Create employee and department document structure", "IT", "SharePoint libraries or Shared Drives", "Use groups; avoid uncontrolled public links", "None", "Employee/department list", "Not started"],
  [3, "Create private approval library for website files", "Marketing + Product team", "Reviewed catalogue/media library", "Only publishers can approve", "None", "Approval workflow", "Not started"],
  [4, "Create object storage and CDN", "IT / Web team", "Blob bucket/container and custom domain", "Private origin; CDN/Front Door access", "New asset base URL", "Cloud account and DNS", "Not started"],
  [5, "Define filenames, metadata and retention rules", "Product team", "Naming and versioning standard", "No personal/confidential data in public storage", "Stable product mappings", "Product catalogue list", "Not started"],
  [6, "Migrate approved images and PDFs", "Web team", "Published website assets", "Checksum and access verification", "Update product catalogue URLs", "Storage/CDN ready", "Not started"],
  [7, "Test permissions and website downloads", "QA + IT", "Access and functional test report", "Test unauthorized access and expired links", "Validate redirects and performance", "Migration completed", "Not started"],
  [8, "Retire Google Drive public links after monitoring", "IT + Web team", "Single controlled production source", "Keep backup and rollback period", "Remove legacy dependencies", "Successful monitoring period", "Not started"],
];
rollout.getRange("A6:H13").format.wrapText = true;
rollout.getRange("H6").format = { fill: lightYellow, font: { bold: true, color: "#7F6000" } };
rollout.getRange("H7:H13").format = { fill: lightRed, font: { color: "#9C0006" } };

rollout.getRange("A16:D16").values = [["Official reference", "Purpose", "Provider", "URL"]];
header(rollout.getRange("A16:D16"));
rollout.getRange("A17:D22").values = [
  ["SharePoint permission scopes", "Folder/library permissions and inheritance", "Microsoft", "https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope"],
  ["Azure Blob static content", "Images, videos and static file storage", "Microsoft", "https://learn.microsoft.com/azure/storage/blobs/storage-blob-static-website"],
  ["Azure Blob security", "Front Door, access controls and public-content security", "Microsoft", "https://learn.microsoft.com/en-us/azure/storage/blobs/secure-blobs"],
  ["Amazon S3 access control", "Prefix, IAM and Access Grants concepts", "AWS", "https://docs.aws.amazon.com/AmazonS3/latest/user-guide/access-control-overview.html"],
  ["CloudFront private S3 origin", "Secure CDN access to S3", "AWS", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"],
  ["Azure custom domain", "Custom domain and CDN integration", "Microsoft", "https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name"],
];
rollout.getRange("A17:D22").format.wrapText = true;

const widths = {
  Recommendation: [23, 32, 45, 50, 46, 40, 14, 18],
  "Tool Comparison": [31, 24, 24, 24, 31, 24, 20, 22, 48, 55, 30],
  "Requirements Matrix": [38, 22, 25, 25, 24, 18, 20, 18, 21, 48],
  Implementation: [10, 48, 27, 40, 48, 38, 35, 20],
};
for (const sheet of [recommendation, comparison, requirements, rollout]) {
  widths[sheet.name].forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
  });
  sheet.getUsedRange().format.verticalAlignment = "center";
}
recommendation.getRange("A6:H8").format.rowHeight = 64;
comparison.getRange("A6:K13").format.rowHeight = 78;
requirements.getRange("A6:J11").format.rowHeight = 52;
rollout.getRange("A6:H13").format.rowHeight = 58;
rollout.getRange("A17:D22").format.rowHeight = 44;
recommendation.freezePanes.freezeRows(5);
requirements.freezePanes.freezeRows(5);
rollout.freezePanes.freezeRows(5);

wb.recalculate();
const outputDir = "outputs/storage-solution-comparison";
await fs.mkdir(outputDir, { recursive: true });
for (const [sheetName, range, file] of [
  ["Recommendation", "A1:H22", "recommendation-preview.png"],
  ["Tool Comparison", "A1:K13", "comparison-preview.png"],
  ["Requirements Matrix", "A1:J14", "requirements-preview.png"],
  ["Implementation", "A1:H22", "implementation-preview.png"],
]) {
  const preview = await wb.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${file}`, new Uint8Array(await preview.arrayBuffer()));
}
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const check = await wb.inspect({ kind: "table", range: "Requirements Matrix!A5:J11", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 10, maxChars: 8000 });
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/Inkarp_Storage_Solution_Comparison.xlsx`);
console.log(check.ndjson);
console.log(errors.ndjson);
