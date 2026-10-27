import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "outputs/storage-solution-comparison";
const inputPath = `${outputDir}/Inkarp_Storage_Solution_Comparison.xlsx`;
const outputPath = `${outputDir}/Inkarp_Storage_Solution_Comparison_Updated.xlsx`;
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const guide = workbook.worksheets.getItem("Simple Guide");
guide.getRange("A2").values = [["Simple Guide: File Storage Solutions"]];
guide.getRange("A3").values = [["Storage for images, videos, PDFs, HTML files and Microsoft Office documents, with controlled access for each person"]];
guide.getRange("A5:D5").values = [["Topic", "Simple explanation", "Recommended choice", "Example"]];
guide.getRange("A6:D21").values = [
  ["Best overall choice", "Use Microsoft SharePoint for shared folders and OneDrive for each person's private work files. Both support common business file types and detailed access permissions.", "SharePoint and OneDrive", "Each person receives a private folder. Managers can receive access only where required."],
  ["SharePoint", "A central company storage platform for team, department and project files. Access can be assigned to specific people or security groups.", "Best for shared company folders", "Create separate libraries or folders for Sales, Service, Finance and Management."],
  ["OneDrive", "A company-controlled personal storage area for each user. Files remain under the organization's Microsoft 365 administration.", "Best for individual work folders", "Employee A can access their OneDrive. An authorized administrator can manage access and recovery."],
  ["Supported file types", "SharePoint and OneDrive can store images, videos, PDFs, HTML files, Word documents, Excel workbooks, PowerPoint files and many other formats.", "Confirm file-size and storage limits", "JPG, PNG, MP4, PDF, HTML, DOCX, XLSX and PPTX."],
  ["Separate folders for each person", "Create a private OneDrive for each person or a secured SharePoint folder when the folder must sit inside a company library.", "Use OneDrive for personal files and SharePoint for controlled shared folders", "Employee A cannot open Employee B's folder unless access is explicitly granted."],
  ["Access permissions", "Grant access by named user or security group. Give each person only the folders needed for their work.", "Use least-privilege access", "A staff member can edit their assigned folder but cannot view other private folders."],
  ["Manager access", "Managers or administrators can receive access to selected folders for supervision, continuity and recovery.", "Use separate manager and administrator groups", "A department manager can access folders for their own team only."],
  ["File protection", "Version history, recycle bins, retention policies and audit logs help recover files and track changes.", "Enable retention and auditing", "Restore an earlier Excel version or recover a deleted PDF."],
  ["Microsoft Office files", "Microsoft 365 provides browser and desktop editing for Word, Excel and PowerPoint files stored in SharePoint or OneDrive.", "Best fit for Microsoft 365 users", "Several authorized users can collaborate on the same Excel workbook."],
  ["Google Workspace alternative", "Google Shared Drives and individual Google Drive accounts can store the required file types and restrict access by person or group.", "Choose when the company already uses Google Workspace", "Create one Shared Drive per department and private folders for assigned users."],
  ["Dropbox Business alternative", "Dropbox Business supports many file types, team folders, user groups, sharing controls and administrator oversight.", "Good for simple file sharing and synchronization", "Assign a team folder to one person and their manager."],
  ["Box alternative", "Box provides business file storage, detailed permissions, retention controls and strong governance features.", "Good for organizations needing advanced compliance controls", "Restrict a confidential folder to named employees and compliance administrators."],
  ["Object storage options", "Azure Blob Storage, Amazon S3 and Google Cloud Storage can store all required file types, but they usually require technical setup for user-friendly folders and permissions.", "Use only when IT needs large-scale or application storage", "A technical team stores large video archives with controlled cloud identities."],
  ["What to avoid", "Avoid personal accounts, public sharing links and one shared password. These approaches reduce control and make employee departures difficult to manage.", "Use company-managed accounts", "Disable a departing employee's account without changing access for everyone else."],
  ["Suggested folder structure", "Organize folders by department, person or project. Assign access through groups wherever possible so permissions remain easy to manage.", "Keep ownership and access rules documented", "Company Files > Sales > Employee A; Company Files > Finance > Employee B."],
  ["Selection decision", "Choose the platform that matches the company's existing licences, administrator skills, storage needs, file sizes, retention requirements and budget.", "Microsoft 365: SharePoint and OneDrive; Google Workspace: Shared Drives and Drive", "If Microsoft 365 is already in use, SharePoint and OneDrive are usually the simplest starting point."],
];
guide.getRange("E5:E21").clear({ contents: true });

const checklist = workbook.worksheets.getItem("Checklist");
checklist.getRange("A2").values = [["Company File Storage Selection Checklist"]];
checklist.getRange("A3").values = [["Recommended starting point: SharePoint for shared folders and OneDrive for individual folders, with access assigned to named users or groups"]];
checklist.getRange("A6:G27").values = [
  [1, "Store images, videos, PDFs, HTML and Microsoft Office files", "The platform must accept all common company file formats", "SharePoint and OneDrive", "Yes", "Not checked", null],
  [2, "Create a separate folder or storage area for each person", "Each person needs an assigned private work area", "OneDrive or secured SharePoint folders", "Yes", "Not checked", null],
  [3, "Give each person access only to assigned folders", "Prevents users from seeing files outside their responsibility", "Named-user or group permissions", "Yes", "Not checked", null],
  [4, "Allow managers to access selected folders", "Supports supervision and business continuity", "Manager security groups", "Yes", "Not checked", null],
  [5, "Use company-owned user accounts", "The company retains control when a person leaves", "Microsoft 365, Google Workspace, Dropbox Business or Box accounts", "Yes", "Not checked", null],
  [6, "Support Word, Excel and PowerPoint files", "Users need reliable storage and editing for Office documents", "Microsoft 365 with SharePoint and OneDrive", "Yes", "Not checked", null],
  [7, "Support large images and videos", "Large media files may exceed upload or storage limits", "Confirm per-file and total storage limits", "Yes", "Not checked", null],
  [8, "Keep previous file versions", "Accidental changes can be reversed", "Version history", "Yes", "Not checked", null],
  [9, "Recover deleted files", "Protects against accidental deletion", "Recycle bin and retention policy", "Yes", "Not checked", null],
  [10, "Record file changes and sharing activity", "Provides accountability and supports investigations", "Audit logs and activity reports", "Yes", "Not checked", null],
  [11, "Require multi-factor authentication", "Protects accounts if a password is stolen", "Identity and access management controls", "Yes", "Not checked", null],
  [12, "Control external sharing", "Prevents uncontrolled access outside the company", "Sharing policies and expiry dates", "Yes", "Not checked", null],
  [13, "Remove access promptly when a person leaves", "Prevents former users from retaining company access", "Account deactivation and ownership transfer process", "Yes", "Not checked", null],
  [14, "Use groups to manage permissions", "Groups are easier to maintain than many individual permissions", "Department, manager and administrator groups", "Preferred", "Not checked", null],
  [15, "Provide mobile and desktop access", "Users may need approved access from different devices", "Desktop synchronization and mobile apps", "Preferred", "Not checked", null],
  [16, "Encrypt files during transfer and storage", "Protects data from unauthorized access", "Platform encryption controls", "Yes", "Not checked", null],
  [17, "Set retention periods", "Required files should remain available for the correct period", "Retention labels or policies", "Yes", "Not checked", null],
  [18, "Confirm administrator access and recovery", "The company needs oversight and account recovery", "Dedicated administrator roles", "Yes", "Not checked", null],
  [19, "Confirm backup and disaster recovery", "Files must remain recoverable after mistakes or outages", "Retention, recovery and documented backup approach", "Yes", "Not checked", null],
  [20, "Confirm monthly cost and storage allowance", "Management needs predictable cost and sufficient capacity", "Compare licences, included storage and additional-storage pricing", "Yes", "Not checked", null],
  [21, "Test permissions before migration", "Confirms one person cannot open another person's folder", "Permission test with sample user accounts", "Yes", "Not checked", null],
  [22, "Plan a phased migration", "Reduces the risk of missing files or incorrect permissions", "Pilot, backup, validation and rollback plan", "Yes", "Not checked", null],
];

workbook.recalculate();
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const sheet of [guide, checklist]) {
  const inspection = await workbook.inspect({
    kind: "table",
    range: `${sheet.name}!A1:G27`,
    include: "values,formulas",
    tableMaxRows: 27,
    tableMaxCols: 7,
  });
  console.log(`\n--- ${sheet.name} ---\n${inspection.ndjson}`);
  const preview = await workbook.render({ sheetName: sheet.name, range: "A1:G27", scale: 2, format: "png" });
  await fs.writeFile(`${outputDir}/${sheet.name.replace(/[^a-z0-9_-]/gi, "_")}_updated.png`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`Saved ${outputPath}`);
