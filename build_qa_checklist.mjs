import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const wb = Workbook.create();
const sh = wb.worksheets.add("Website QA Checklist");
sh.showGridLines = false;
sh.tabColor = "#1F4E78";

const raw = `Planning|P0|Confirm test URL, environment and latest build|Correct environment and latest build are used
Planning|P0|Confirm browser and device test scope|Required browsers and screen sizes are listed
Planning|P1|Confirm test accounts and user roles|Valid accounts exist for each role
Sitemap & Indexing|P0|Open sitemap.xml|File loads and uses the correct domain
Sitemap & Indexing|P0|Check important public pages in sitemap|Main pages included; private and duplicate pages excluded
Sitemap & Indexing|P0|Check sitemap URLs return HTTP 200|No broken, redirected or server-error URLs
Sitemap & Indexing|P0|Open robots.txt|Required pages and assets are not blocked
Sitemap & Indexing|P1|Check canonical URLs|Each indexable page has one correct canonical
SEO Metadata|P0|Check page title on every main page|Unique and relevant title is present
SEO Metadata|P0|Check meta description on every main page|Unique and relevant description is present
SEO Metadata|P0|Check one H1 per page|One clear H1 matches the page topic
SEO Metadata|P1|Check heading order|H2 and H3 headings follow a logical structure
SEO Metadata|P1|Check social sharing metadata|Open Graph title, description and image are correct
SEO Metadata|P1|Check favicon and app icons|Correct icons display
SEO Metadata|P1|Check structured data where applicable|Schema is valid and matches visible content
Main Static Pages|P0|Test Home page|Content and primary actions work
Main Static Pages|P0|Test About or Company page|Page loads and content is current
Main Static Pages|P0|Test Products or Services listing|Cards, filters and links work
Main Static Pages|P0|Test Product or Service detail pages|Content, images and enquiry actions work
Main Static Pages|P0|Test Contact page|Address, phone, email, map and form are correct
Main Static Pages|P1|Test Careers, Blog, News or Resources if present|Listings, pagination and detail pages work
Main Static Pages|P0|Test Privacy Policy and Terms pages|Pages load from the correct footer links
Navigation & Links|P0|Test header navigation and dropdowns|Menus open and links reach correct pages
Navigation & Links|P0|Test footer navigation|All footer links reach correct pages
Navigation & Links|P0|Check internal links|No broken links, wrong destinations or redirect chains
Navigation & Links|P0|Check external links|Correct destination and new-tab behavior
Navigation & Links|P1|Check logo and breadcrumb links|Logo returns Home and breadcrumbs are correct
Navigation & Links|P1|Check anchors and back-to-top links|Page scrolls to correct section
Navigation & Links|P0|Test browser Back and Forward|Navigation history works without broken states
Forms|P0|Submit every form with valid data|Success shown and data reaches correct destination
Forms|P0|Submit forms with empty required fields|Clear required-field validation appears
Forms|P0|Enter invalid email, phone and formats|Invalid input is rejected with helpful message
Forms|P1|Check min/max length and special characters|Boundary values are handled safely
Forms|P1|Check duplicate clicks and submissions|Only one submission is created
Forms|P0|Check consent checkbox and policy links|Required consent and links work
Forms|P1|Check CAPTCHA or spam protection if present|Protection works for normal users
Buttons & Interactions|P0|Test all primary and secondary buttons|Correct page, modal or action opens
Buttons & Interactions|P0|Test menus, tabs, accordions, sliders and carousels|Controls work without overlap
Buttons & Interactions|P1|Test search, filters, sorting and pagination|Results and empty states are correct
Buttons & Interactions|P1|Test modals and popups|Open, close, Esc and outside-click work
Buttons & Interactions|P1|Run random realistic user journeys|No stuck or inconsistent state
Images & Media|P0|Check all images load|No broken images or missing placeholders
Images & Media|P1|Check image quality, crop and ratio|Images are sharp and not stretched
Images & Media|P1|Check image alt text|Meaningful images have useful alt text
Images & Media|P1|Test video, audio, downloads and documents|Media plays and files open or download
UI & Responsive|P0|Check alignment, spacing, fonts and colors|Layout matches the approved design
UI & Responsive|P0|Test desktop, tablet and mobile widths|No scrolling, overlap, clipping or hidden content
UI & Responsive|P0|Test portrait and landscape orientation|Layout adjusts after rotation
UI & Responsive|P1|Check hover, focus, active and disabled states|States are visible and consistent
Accessibility|P0|Navigate key journeys using keyboard only|Logical tab order and visible focus
Accessibility|P0|Check labels and accessible names|Controls have clear accessible names
Accessibility|P1|Check contrast and zoom to 200%|Content remains readable and usable
Compatibility|P0|Test required Chrome, Edge, Firefox and Safari|Core functions behave consistently
Performance|P0|Check page loading and interaction speed|Pages meet agreed speed targets
Performance|P1|Check optimized images and lazy loading|Large off-screen images are optimized
Security & Privacy|P0|Confirm HTTPS and no mixed content|All pages and assets are secure
Security & Privacy|P0|Check sensitive data is not exposed|No passwords, tokens or private data in URLs or logs
Security & Privacy|P1|Check cookie consent if required|Choices save and tracking respects consent
Analytics & Tracking|P0|Check analytics or tag manager|Page views and key events fire once
Analytics & Tracking|P1|Check form, CTA, download and outbound events|Important conversions track correctly
Errors & Edge Cases|P0|Test a nonexistent URL|Useful custom 404 page appears
Errors & Edge Cases|P0|Test failure and slow-network states|Clear loading and error states appear
Errors & Edge Cases|P1|Test long text, missing images and empty content|Layout remains stable with clear fallbacks
Content Quality|P0|Check spelling, contact details and legal text|Published content is accurate and approved
Content Quality|P1|Check dates, prices, units and currencies|Values are current and correctly formatted
Release & Maintenance|P0|Check redirects from changed URLs|Redirects reach correct new pages
Release & Maintenance|P0|Check console and network errors on key journeys|No significant errors or failed requests
Release & Maintenance|P0|Retest fixes and run regression|Fixes work and critical features remain working
Release & Maintenance|P0|Record approval and unresolved risks|Sign-off, open issues and release decision documented`;

const tests = raw.split("\n").map((x) => x.split("|"));
const headers = ["ID","Category","Priority","Test item","Expected result","Status","Owner","Test date","Page / URL","Actual result / Notes","Issue ID","Manager review"];
const first = 10;
const last = 9 + tests.length;
const rows = tests.map((x, i) => [i + 1, ...x, "Not Started", "", "", "", "", "", "Pending"]);

sh.mergeCells("B2:H2"); sh.getRange("B2").values = [["Website QA Checklist"]];
sh.mergeCells("B3:H3"); sh.getRange("B3").values = [["Simple pre-launch and regression checklist for QA and manager review"]];
sh.getRange("B5:C8").values = [["Summary","Value"],["Total",tests.length],["Passed",null],["Failed / Blocked",null]];
sh.getRange("C7").formulas = [[`=COUNTIF(F${first}:F${last},"Passed")`]];
sh.getRange("C8").formulas = [[`=COUNTIF(F${first}:F${last},"Failed")+COUNTIF(F${first}:F${last},"Blocked")`]];
sh.getRange("E5:F8").values = [["Review","Value"],["Completion %",null],["Manager approval","Pending"],["Release decision","Pending"]];
sh.getRange("F6").formulas = [[`=IF(C6=0,0,COUNTIF(F${first}:F${last},"Passed")/C6)`]];
sh.getRange("A9:L9").values = [headers];
sh.getRangeByIndexes(9, 0, rows.length, 12).values = rows;

const table = sh.tables.add(`A9:L${last}`, true, "WebsiteQAChecklist");
table.style = "TableStyleMedium2"; table.showFilterButton = true;
sh.getRange(`F${first}:F${last}`).dataValidation = { rule: { type: "list", values: ["Not Started","In Progress","Passed","Failed","Blocked","Not Applicable"] } };
sh.getRange(`L${first}:L${last}`).dataValidation = { rule: { type: "list", values: ["Pending","Reviewed","Approved","Needs Rework"] } };
sh.getRange("F7").dataValidation = { rule: { type: "list", values: ["Pending","Approved","Needs Rework"] } };
sh.getRange("F8").dataValidation = { rule: { type: "list", values: ["Pending","Go","No-Go","Go with Risks"] } };

sh.getRange(`A1:L${last}`).format.font = { name: "Arial", size: 10, color: "#1F2937" };
sh.getRange("B2:H2").format.font = { name: "Arial", size: 16, bold: true, color: "#1F2937" };
sh.getRange("B3:H3").format.font = { name: "Arial", size: 10, italic: true, color: "#6B7280" };
for (const r of ["B5:C5", "E5:F5"]) sh.getRange(r).format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sh.getRange("B6:B8").format.font = { bold: true }; sh.getRange("E6:E8").format.font = { bold: true };
sh.getRange("C6:C8").format.numberFormat = "#,##0"; sh.getRange("F6").format.numberFormat = "0%";
sh.getRange("F7:F8").format.fill = "#FFF2CC"; sh.getRange(`F${first}:L${last}`).format.fill = "#FFFDF3";
sh.getRange(`D${first}:E${last}`).format.wrapText = true; sh.getRange(`J${first}:J${last}`).format.wrapText = true;
sh.getRange(`H${first}:H${last}`).format.numberFormat = "dd-mmm-yyyy"; sh.getRange(`A9:L${last}`).format.verticalAlignment = "center";
const sr = sh.getRange(`F${first}:F${last}`);
sr.conditionalFormats.add("containsText", { text: "Passed", format: { fill: "#E2F0D9", font: { color: "#006100", bold: true } } });
sr.conditionalFormats.add("containsText", { text: "Failed", format: { fill: "#FCE4D6", font: { color: "#9C0006", bold: true } } });
sr.conditionalFormats.add("containsText", { text: "Blocked", format: { fill: "#F4CCCC", font: { color: "#9C0006", bold: true } } });
sr.conditionalFormats.add("containsText", { text: "In Progress", format: { fill: "#DDEBF7", font: { color: "#1F4E78", bold: true } } });
const widths = {A:7,B:25,C:10,D:42,E:44,F:16,G:18,H:14,I:30,J:38,K:14,L:18};
for (const [col, width] of Object.entries(widths)) sh.getRange(`${col}:${col}`).format.columnWidth = width;
sh.getRange("2:2").format.rowHeight = 26; sh.getRange(`9:${last}`).format.rowHeight = 34; sh.getRange("9:9").format.rowHeight = 30;
sh.freezePanes.freezeRows(9); sh.freezePanes.freezeColumns(3);

wb.recalculate();
const check = await wb.inspect({ kind: "table", range: "Website QA Checklist!A2:L18", include: "values,formulas", tableMaxRows: 18, tableMaxCols: 12, maxChars: 5000 });
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const preview = await wb.render({ sheetName: "Website QA Checklist", range: "A1:L24", scale: 1, format: "png" });
const dir = "outputs/website-qa-checklist";
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(`${dir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${dir}/Website_QA_Manager_Checklist.xlsx`);
console.log(check.ndjson);
console.log(errors.ndjson);
