import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const apiData = JSON.parse(await fs.readFile("outputs/local-products.json", "utf8"));
const mappingSource = await fs.readFile("src/data/productCatalogues.js", "utf8");

function parseMapping(blockName) {
  const block = mappingSource.match(new RegExp(`const ${blockName} = \\{([\\s\\S]*?)\\n\\};`))?.[1] ?? "";
  const result = new Map();
  const entryPattern = /(?:"([^"]+)"|([a-zA-Z0-9-]+)):\s*driveCatalogue\("([^"]+)",\s*"([^"]+)"\)/g;
  for (const match of block.matchAll(entryPattern)) {
    result.set(match[1] ?? match[2], {
      fileId: match[3],
      fileName: match[4],
      downloadUrl: `https://drive.google.com/uc?export=download&id=${match[3]}`,
    });
  }
  return result;
}

const principalCatalogues = parseMapping("PRINCIPAL_CATALOGUES");
const productCatalogues = parseMapping("PRODUCT_CATALOGUES");
const excludedBlock = mappingSource.match(/const PRODUCTS_WITHOUT_MATCHING_CATALOGUE = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const excludedProducts = new Set([...excludedBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]));

const products = [];
const seen = new Set();
for (const principal of apiData.data ?? []) {
  for (const category of principal.categories ?? []) {
    for (const product of category.products ?? []) {
      const key = `${principal.slug}:${product.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const mapped = productCatalogues.get(product.slug) ?? principalCatalogues.get(principal.slug) ?? null;
      const catalogue = excludedProducts.has(product.slug) ? null : mapped;
      products.push({
        principal: principal.principalName ?? principal.name ?? principal.slug,
        category: category.name ?? "Uncategorised",
        product: product.name ?? product.slug,
        slug: product.slug,
        url: `https://inkarp.co.in/products/${product.slug}`,
        catalogue,
      });
    }
  }
}
products.sort((a, b) => a.principal.localeCompare(b.principal) || a.category.localeCompare(b.category) || a.product.localeCompare(b.product));

const principals = [...new Set(products.map((row) => row.principal))].sort((a, b) => a.localeCompare(b));
const principalSummary = principals.map((principal) => {
  const rows = products.filter((row) => row.principal === principal);
  const withPdf = rows.filter((row) => row.catalogue).length;
  return [principal, rows.length, withPdf, rows.length - withPdf, rows.length ? withPdf / rows.length : 0];
});

const wb = Workbook.create();
const dashboard = wb.worksheets.add("Dashboard");
const allProducts = wb.worksheets.add("All Products");
const navy = "#17365D";
const blue = "#1F4E78";
const green = "#E2F0D9";
const red = "#FCE4D6";
const font = "Arial";

for (const sheet of [dashboard, allProducts]) {
  sheet.showGridLines = false;
  sheet.getRange("A1:H1000").format.font = { name: font, size: 10, color: "#1F2937" };
}

dashboard.getRange("A2:E2").merge();
dashboard.getRange("A2").values = [["Product Catalogue Dashboard"]];
dashboard.getRange("A2:E2").format = { fill: "#D9EAF7", font: { name: font, size: 16, bold: true, color: navy }, horizontalAlignment: "center" };
dashboard.getRange("A3:E3").merge();
dashboard.getRange("A3").values = [["Current catalogue availability on the Inkarp website"]];
dashboard.getRange("A3:E3").format = { font: { name: font, italic: true, color: "#667085" }, horizontalAlignment: "center" };
dashboard.getRange("A5:B9").values = [
  ["Metric", "Count"],
  ["Total products", products.length],
  ["Products with PDF", products.filter((row) => row.catalogue).length],
  ["Products with no PDF", products.filter((row) => !row.catalogue).length],
  ["Catalogue coverage", products.filter((row) => row.catalogue).length / products.length],
];
dashboard.getRange("A5:B5").format = { fill: blue, font: { bold: true, color: "#FFFFFF" } };
dashboard.getRange("A6:A9").format.font = { bold: true };
dashboard.getRange("B9").format.numberFormat = "0.0%";
dashboard.getRange("A12:E12").values = [["Principal", "Total products", "With PDF", "No PDF", "Coverage"]];
dashboard.getRange("A12:E12").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
dashboard.getRangeByIndexes(12, 0, principalSummary.length, 5).values = principalSummary;
dashboard.tables.add(`A12:E${principalSummary.length + 12}`, true, "PrincipalCatalogueSummary").style = "TableStyleMedium2";
dashboard.getRange(`E13:E${principalSummary.length + 12}`).format.numberFormat = "0.0%";
dashboard.getRange("A:A").format.columnWidth = 32;
dashboard.getRange("B:D").format.columnWidth = 18;
dashboard.getRange("E:E").format.columnWidth = 16;
dashboard.freezePanes.freezeRows(12);

allProducts.getRange("A2:H2").merge();
allProducts.getRange("A2").values = [["All Website Products and Catalogue Availability"]];
allProducts.getRange("A2:H2").format = { fill: "#D9EAF7", font: { name: font, size: 16, bold: true, color: navy }, horizontalAlignment: "center" };
allProducts.getRange("A3:H3").merge();
allProducts.getRange("A3").values = [["Catalogue filename is shown when available; otherwise the row displays No PDF"]];
allProducts.getRange("A3:H3").format = { font: { name: font, italic: true, color: "#667085" }, horizontalAlignment: "center" };
allProducts.getRange("A5:H5").values = [["Principal", "Category", "Product", "Product slug", "Product URL", "PDF status", "Catalogue PDF", "Catalogue download URL"]];
allProducts.getRange("A5:H5").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
const productRows = products.map((row) => [
  row.principal,
  row.category,
  row.product,
  row.slug,
  row.url,
  row.catalogue ? "PDF available" : "No PDF",
  row.catalogue?.fileName ?? "No PDF",
  row.catalogue?.downloadUrl ?? "",
]);
allProducts.getRangeByIndexes(5, 0, productRows.length, 8).values = productRows;
const lastRow = productRows.length + 5;
allProducts.tables.add(`A5:H${lastRow}`, true, "AllProductsCatalogueList").style = "TableStyleMedium2";
allProducts.getRange(`A6:H${lastRow}`).format = { verticalAlignment: "center", wrapText: true, rowHeight: 28 };
allProducts.getRange(`F6:F${lastRow}`).conditionalFormats.add("containsText", { text: "PDF available", format: { fill: green, font: { bold: true, color: "#385723" } } });
allProducts.getRange(`F6:F${lastRow}`).conditionalFormats.add("containsText", { text: "No PDF", format: { fill: red, font: { bold: true, color: "#9C0006" } } });
const widths = [26, 29, 42, 38, 49, 18, 52, 54];
widths.forEach((width, index) => allProducts.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width);
allProducts.freezePanes.freezeRows(5);
allProducts.freezePanes.freezeColumns(3);

wb.recalculate();
const outputDir = "outputs/product-catalogue-coverage";
await fs.mkdir(outputDir, { recursive: true });
for (const [sheetName, range, fileName] of [
  ["Dashboard", `A1:E${Math.min(principalSummary.length + 12, 35)}`, "simple-dashboard-preview.png"],
  ["All Products", "A1:H28", "simple-all-products-preview.png"],
]) {
  const preview = await wb.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const check = await wb.inspect({ kind: "table", range: "Dashboard!A2:E20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 5, maxChars: 7000 });
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/Complete_Product_Catalogue_Comparison.xlsx`);
console.log(JSON.stringify({ total: products.length, withPdf: products.filter((row) => row.catalogue).length, noPdf: products.filter((row) => !row.catalogue).length }));
console.log(check.ndjson);
console.log(errors.ndjson);
