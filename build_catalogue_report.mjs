import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const projectRoot = process.cwd();
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
const rows = [];
const seen = new Set();

for (const principal of apiData.data ?? []) {
  for (const category of principal.categories ?? []) {
    for (const product of category.products ?? []) {
      const key = `${principal.slug}:${product.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const mappedCatalogue = productCatalogues.get(product.slug) ?? principalCatalogues.get(principal.slug) ?? null;
      const catalogue = excludedProducts.has(product.slug) ? null : mappedCatalogue;
      rows.push({
        brand: principal.principalName ?? principal.name ?? principal.slug,
        principalSlug: principal.slug,
        category: category.name ?? "Uncategorised",
        product: product.name ?? product.slug,
        slug: product.slug,
        productUrl: `https://inkarp.co.in/products/${product.slug}`,
        catalogue, mappedCatalogue, catalogueRemoved: Boolean(mappedCatalogue && !catalogue),
      });
    }
  }
}

rows.sort((a, b) => a.brand.localeCompare(b.brand) || a.category.localeCompare(b.category) || a.product.localeCompare(b.product));
const withCatalogue = rows.filter((row) => row.catalogue);
const withoutCatalogue = rows.filter((row) => !row.catalogue);

const brands = [...new Set(rows.map((row) => row.brand))].sort((a, b) => a.localeCompare(b));
const brandSummary = brands.map((brand) => {
  const all = rows.filter((row) => row.brand === brand);
  const available = all.filter((row) => row.catalogue).length;
  return [brand, all.length, available, all.length - available, available / all.length];
});

const ametekWebsiteProducts = rows.filter((row) => row.principalSlug === "ametek-brookfield");
const ametekMatchMap = new Map([
  ["cap2000-plus-viscometer", ["Instrument", "Special Viscometers", "CAP 2000+", 12, "Direct match"]],
  ["dv2plus-viscometer", ["Instrument", "Viscometers", "DV2Plus", 11, "Direct match"]],
  ["dvnext-cone-plate-rheometer", ["Instrument", "Viscometers", "DVNext Cone/Plate", 10, "Direct match"]],
  ["dvnext-rheometer", ["Instrument", "Viscometers", "DVNext", 10, "Direct match"]],
  ["dvplus-viscometer", ["Instrument", "Viscometers", "DVPlus", 11, "Direct match"]],
  ["ku-3-viscometer", ["Instrument", "Special Viscometers", "KU-3 Viscometer", 12, "Direct match"]],
  ["dial-reading-viscometer", ["Instrument", "Special Viscometers", "Dial Reading Viscometer", 12, "Direct match"]],
  ["computrac-max-4000xl-moisture-analyzer", ["Instrument", "Moisture Analyzers", "Computrac MAX 4000XL", 17, "Direct match"]],
  ["computrac-max-5000xl-moisture-analyzer", ["Instrument", "Moisture Analyzers", "Computrac MAX 5000XL", 17, "Direct match"]],
  ["computrac-vapor-pro-xl-moisture-analyzer", ["Instrument", "Moisture Analyzers", "Computrac Vapor Pro XL", 16, "Direct match"]],
  ["pft-powder-flow-tester", ["Instrument", "Powder Flow Tester", "PFT Powder Flow Analyzer", 18, "Direct match"]],
  ["pvs-rheometer", ["Instrument", "Rheometers", "PVS Rheometer", 14, "Direct match"]],
  ["rso-rheometer", ["Instrument", "Rheometers", "RSO", 14, "Direct match"]],
  ["rsx-coaxial-cylinder-rheometer", ["Instrument", "Rheometers", "RSX Coaxial Cylinder", 15, "Direct match"]],
  ["rsx-cone-plate-rheometer", ["Instrument", "Rheometers", "RSX Cone Plate", 15, "Direct match"]],
  ["rsx-sst-rheometer", ["Instrument", "Rheometers", "RSX Soft Solid Tester", 15, "Website abbreviation SST refers to Soft Solid Tester"]],
  ["dv360-software", ["Software", "Software", "DV360", 25, "Direct match"]],
  ["ctx-texture-analyzer", ["Instrument", "Texture Analyzers", "CTX Texture Analyzer", 19, "Direct match"]],
]);

const ametekComparison = ametekWebsiteProducts.map((row) => {
  const match = ametekMatchMap.get(row.slug);
  return match
    ? [match[0], match[1], match[2], row.product, row.slug, "Matched", match[3], match[4]]
    : ["Instrument page", "Viscometers", "DVNext (gel timer is listed as a feature)", row.product, row.slug, "Website-only separate page", 10, "The PDF does not present this as a separate product model"];
});

const catalogueOnly = [
  ["Instrument", "Viscometers", "DVNext Compliant", 10, "21 CFR Part 11 compliant configuration"],
  ["Instrument", "Inline Process Viscometers", "FAST Viscometer", 13, ""],
  ["Instrument", "Inline Process Viscometers", "VTE Electric Viscosel", 13, ""],
  ["Instrument", "Moisture Analyzers", "Computrac Vapor Pro XL Autosampler", 16, "Separate autosampler model"],
  ["Instrument", "Jerome Toxic Gas Analyzers", "Jerome J505", 20, "Mercury vapor analyzer"],
  ["Instrument", "Jerome Toxic Gas Analyzers", "Jerome J405", 20, "Mercury vapor analyzer"],
  ["Instrument", "Jerome Toxic Gas Analyzers", "Jerome J605", 21, "Hydrogen sulfide analyzer"],
  ["Instrument", "Jerome Toxic Gas Analyzers", "Jerome X631", 21, "Hydrogen sulfide analyzer"],
  ["Temperature control", "Water Baths", "TC-150", 22, ""],
  ["Temperature control", "Water Baths", "TC-650", 22, ""],
  ["Temperature control", "Water Baths", "TC-250", 22, ""],
  ["Temperature control", "Water Baths", "TC-550", 22, ""],
  ["Temperature control", "Water Baths", "MX Series", 22, ""],
  ["Temperature control", "Water Baths", "SD Series", 22, ""],
  ["Temperature control", "Water Baths", "AP Series", 22, ""],
  ["Temperature control", "Temperature Control", "Thermosel System", 22, ""],
  ["Temperature control", "Temperature Control", "Lauda Loop 100", 22, ""],
  ["Software", "Software", "Rheovision - PVS", 25, ""],
  ["Software", "Software", "DVPlus Connect - DVPlus", 25, ""],
  ["Software", "Software", "Rheo3000 - RSO, RSX", 25, ""],
  ["Software", "Software", "Capcalc - CAP 2000+", 25, ""],
  ["Software", "Software", "Powder Flow Pro - PFT", 25, ""],
  ["Software", "Software", "DV Create - DV2Plus", 25, ""],
  ["Software", "Software", "Texture Pro - CTX", 25, ""],
  ["Accessory", "Powder Flow Tester Accessories", "Friction Lid", 18, ""],
  ["Accessory", "Powder Flow Tester Accessories", "Vane Lid", 18, ""],
  ["Accessory", "Powder Flow Tester Accessories", "Outer and Inner Catch Trays", 18, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-DEC", 19, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-STF", 19, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-SBA-WB-1", 19, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-52", 19, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-TPB", 19, ""],
  ["Accessory", "Texture Analyzer Accessories", "TA-CTP", 19, ""],
  ["Accessory", "Viscosity Standards", "CAP Oil Fluids", 23, ""],
  ["Accessory", "Viscosity Standards", "General Purpose Oil", 23, ""],
  ["Accessory", "Viscosity Standards", "General Purpose Silicone", 23, ""],
  ["Accessory", "Viscosity Standards", "High-Temperature Silicone Fluids", 23, ""],
  ["Accessory", "Viscosity Standards", "Special Order Silicone Fluids", 23, ""],
  ["Accessory", "Viscosity Standards", "VisCal Kit", 23, ""],
  ["Accessory", "Viscosity Standards", "Krebs Viscometer Oil Fluids", 23, ""],
  ["Accessory", "Viscometer Accessories", "Enhanced UL Adapter", 24, ""],
  ["Accessory", "Viscometer Accessories", "Small Sample Adapter", 24, ""],
  ["Accessory", "Viscometer Accessories", "DIN Adapter", 24, ""],
  ["Accessory", "Viscometer Accessories", "Vane Spindles", 24, ""],
  ["Accessory", "Viscometer Accessories", "Spindles, Cones, Cups, & Chambers", 24, ""],
  ["Accessory", "Viscometer Accessories", "HPQA Helipath Quick Action Stand", 24, ""],
];
for (const item of catalogueOnly) ametekComparison.push([item[0], item[1], item[2], "", "", "Catalogue-only", item[3], item[4]]);

const bwbVariantOnly = new Set([
  "bwb-sugar-flame-photometer", "bwb-nuclear-flame-photometer",
]);
const bwbNotFound = new Set([
  "bwb-soil-flame-photometer", "bwb-synfuels-flame-photometer",
]);
const chemspeedConfirmed = new Set(["crystal-powder-dose"]);
const geaConfirmed = new Set(["homogenizers-ariete-series", "gea-pandaplus-table-top-homogenizer"]);
const heidolphNotFoundPrefixes = [
  "reax-", "multi-reax-", "titramax-", "rotamax-", "unimax-", "promax-", "vibramax-",
  "hei-shake-", "duomax-", "hei-vac-",
];
const kubotaConfirmed = new Set([
  "high-speed-refrigerated-centrifuge-model-6000",
  "high-speed-refrigerated-centrifuge-model-7000",
]);

function pdfComparison(row) {
  if (row.principalSlug === "ametek-brookfield" && row.slug === "dvnext-rheometer-with-gel-timer-functionality") {
    return ["Family / feature only", "Gel timer is shown as a DVNext feature, not as a separate PDF product model"];
  }
  if (row.principalSlug === "bwb-technologies" && bwbVariantOnly.has(row.slug)) {
    return ["Family / variant mentioned", "Industry-specific variant is mentioned but does not have a dedicated product section"];
  }
  if (row.principalSlug === "bwb-technologies" && bwbNotFound.has(row.slug)) {
    return ["Not found in PDF", "SOIL or SynFuels is not named as a product/variant in the supplied BWB catalogue"];
  }
  if (row.principalSlug === "chemspeed" && !chemspeedConfirmed.has(row.slug)) {
    return ["Not found in PDF", "The supplied PDF is focused on CRYSTAL POWDERDOSE"];
  }
  if (row.principalSlug === "gea" && !geaConfirmed.has(row.slug)) {
    return ["Not found in PDF", "The supplied PDF covers Niro Soavi laboratory, pilot and Ariete/PandaPLUS homogenizers"];
  }
  if (row.principalSlug === "heidolph" && heidolphNotFoundPrefixes.some((prefix) => row.slug.startsWith(prefix))) {
    return ["Not found in PDF", "The supplied overview covers evaporation, magnetic stirring, overhead stirring and peristaltic pumps"];
  }
  if (row.principalSlug === "kubota" && !kubotaConfirmed.has(row.slug)) {
    return ["Not found in PDF", "The supplied Kubota PDF covers Models 6000 and 7000"];
  }
  if (row.principalSlug === "labstation-i" && row.slug === "labstation-i-solvent-purification-system-sps") {
    return ["Not found in PDF", "The supplied PDF covers the glovebox and its configurations/accessories"];
  }
  if (row.slug === "freeze-dryer-lyovapor-l-210") {
    return ["Not found in PDF", "The supplied brochure contains L-200 and L-250, not L-210"];
  }
  return ["Confirmed in PDF", "Product or clearly corresponding model/family is present"];
}

const websitePdfComparison = rows.filter((row) => row.mappedCatalogue).map((row) => {
  const [status, note] = pdfComparison(row);
  return {
    brand: row.brand, category: row.category, product: row.product, slug: row.slug,
    catalogue: row.mappedCatalogue.fileName, downloadUrl: row.mappedCatalogue.downloadUrl,
    status: row.catalogueRemoved ? "Catalogue button removed" : status,
    note: row.catalogueRemoved ? `${note}. Catalogue button removed from the website after review` : note,
  };
});

const otherCatalogueOnly = [
  ["Buchi", "Instrument", "Freeze Dryers", "Lyovapor L-200", "Buchi_Lyovapor_L200_L250_Freeze_Dryers_Brochure.pdf", "Catalogue-only main product", "The website maps L-210 instead of the L-200 shown in this PDF"],
  ["Gea", "Instrument", "Laboratory Homogenizers", "TwinPANDA 400", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Gea", "Instrument", "Laboratory Homogenizers", "TwinPANDA 600", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Gea", "Instrument", "Pilot Plant Homogenizers", "Pony 1200", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Gea", "Instrument", "Pilot Plant Homogenizers", "Pony 1500", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Gea", "Instrument", "Pilot Plant Homogenizers", "Panther 1200", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Gea", "Instrument", "Pilot Plant Homogenizers", "Panther 1500", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf", "Catalogue-only model", "Variant listed in the PDF"],
  ["Buchi", "Instrument", "Digestion and Distillation", "Kjel Line", "Buchi_Kjel_Line_Digestion_Distillation_Solutions_Catalogue.pdf", "Catalogue-only main product", "A catalogue mapping exists, but no website product uses the kjel-line slug"],
  ["NenoVision", "Instrument", "AFM-in-SEM", "LiteScope", "NenoVision_LiteScope_AFM_in_SEM_Brochure.pdf", "Catalogue-only main product", "No NenoVision/LiteScope principal or product exists in the website product data"],
  ["RotaChrom", "Software", "CPC Platform", "CPC Modeler", "RotaChrom_CPC_Platform_Catalogue.pdf", "Catalogue-only main product", "No RotaChrom principal or product exists in the website product data"],
  ["RotaChrom", "Software", "CPC Platform", "CPC Simulator", "RotaChrom_CPC_Platform_Catalogue.pdf", "Catalogue-only main product", "No RotaChrom principal or product exists in the website product data"],
  ["RotaChrom", "Platform", "CPC Platform", "RotaChrom CPC Platform", "RotaChrom_CPC_Platform_Catalogue.pdf", "Catalogue-only main product", "No RotaChrom principal or product exists in the website product data"],
  ["BWB Technologies", "Related offering", "Software and accessories", "FP-PC, BWB Drive, AFHS and collection cup", "BWB_Technologies_Flame_Photometers_Catalogue.pdf", "Catalogue-only related offering", "Grouped supporting software/accessories"],
  ["Chemspeed", "Related offering", "Software", "AutoSuite, ARK Suite and AUTOPREP integration", "Chemspeed_CRYSTAL_POWDERDOSE_Brochure.pdf", "Catalogue-only related offering", "Grouped supporting software/integration"],
  ["Heidolph", "Related offering", "Evaporation accessories", "Condensate cooler and base cart chiller", "Heidolph_Laboratory_Solutions_2025_Catalogue.pdf", "Catalogue-only related offering", "Grouped accessories"],
  ["Kubota", "Related offering", "Centrifuge accessories", "Rotors, adapters and stainless-steel bottles", "Kubota_Models_6000_7000_Centrifuges_Catalogue.pdf", "Catalogue-only related offering", "Grouped accessories"],
  ["Labstation i", "Related offering", "Glovebox accessories", "Glovebox accessories and custom configurations", "Labstation_i_Glovebox_and_Accessories_Brochure.pdf", "Catalogue-only related offering", "Grouped accessories/configurations"],
  ["Sonics & Materials", "Related offering", "Sonicator accessories", "Probes, horns, atomizer, flow cell and sonochemistry equipment", "Sonics_Ultrasonic_Processors_and_Accessories_Catalogue.pdf", "Catalogue-only related offering", "Grouped accessories and related equipment"],
  ["SP Genevac", "Related offering", "Evaporator accessories", "Rotors, sample holders and accessories", "SP_Genevac_Evaporation_Solutions_Catalogue.pdf", "Catalogue-only related offering", "Grouped accessories"],
];

const allCatalogueOnly = catalogueOnly.map((item) => [
  "Ametek Brookfield", item[0], item[1], item[2], "Ametek_Brookfield_2026_Product_Catalogue.pdf",
  item[0] === "Instrument" ? "Catalogue-only main product" : "Catalogue-only related offering", item[4] || `PDF page ${item[3]}`,
]).concat(otherCatalogueOnly);

const renameIndex = [
  ["Brookfield Ametek A4 landscape v5.pdf", "Ametek_Brookfield_2026_Product_Catalogue.pdf"],
  ["BWB.pdf", "BWB_Technologies_Flame_Photometers_Catalogue.pdf"],
  ["Chemspeed catalog v4.pdf", "Chemspeed_CRYSTAL_POWDERDOSE_Brochure.pdf"],
  ["Gea V6 copy.pdf", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf"],
  ["Heidolph 2025 v7.pdf", "Heidolph_Laboratory_Solutions_2025_Catalogue.pdf"],
  ["Kubota Centrifuges.pdf", "Kubota_Models_6000_7000_Centrifuges_Catalogue.pdf"],
  ["Labstationi Glove Box.pdf", "Labstation_i_Glovebox_and_Accessories_Brochure.pdf"],
  ["Litescope.pdf", "NenoVision_LiteScope_AFM_in_SEM_Brochure.pdf"],
  ["Radleys PP.pdf", "Radleys_Laboratory_Reaction_Solutions_Catalogue.pdf"],
  ["RotaChrom v3.pdf", "RotaChrom_CPC_Platform_Catalogue.pdf"],
  ["Sonics copy.pdf v2.pdf", "Sonics_Ultrasonic_Processors_and_Accessories_Catalogue.pdf"],
  ["SP v3.pdf", "SP_Genevac_Evaporation_Solutions_Catalogue.pdf"],
  ["Freeze drying.pdf", "Buchi_Lyovapor_L200_L250_Freeze_Dryers_Brochure.pdf"],
  ["Kjel line.pdf", "Buchi_Kjel_Line_Digestion_Distillation_Solutions_Catalogue.pdf"],
  ["Inkarp Bravo V2.pdf", "Bruker_BRAVO_Handheld_Raman_Spectrometer_Brochure.pdf"],
  ["Tango.pdf", "Bruker_TANGO_II_FT_NIR_Spectrometer_Brochure.pdf"],
  ["N30-Touch tri-fold brochure v4.pdf", "Implen_NanoPhotometer_N30_Touch_Brochure.pdf"],
  ["Nanophotometer.pdf", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"],
  ["DriveAFM v2.pdf", "Nanosurf_DriveAFM_Brochure.pdf"],
  ["AFM FLEX MOUNT.pdf", "Nanosurf_FlexAFM_Mount_Brochure.pdf"],
  ["AFM.pdf", "Nanosurf_NaioAFM_NaioSTM_CoreAFM_Catalogue.pdf"],
  ["AFM Flex final.pdf", "Nanosurf_NaniteAFM_Brochure.pdf"],
  ["DMA copy.pdf", "Hitachi_NEXTA_DMA200_Brochure.pdf"],
  ["DSC.pdf", "Hitachi_NEXTA_DSC200_DSC600_Brochure.pdf"],
  ["STA copy.pdf", "Hitachi_NEXTA_STA200_STA200RV_STA300_Brochure.pdf"],
];

const comparisonCounts = {
  confirmed: websitePdfComparison.filter((row) => row.status === "Confirmed in PDF").length,
  family: websitePdfComparison.filter((row) => row.status.includes("Family")).length,
  missing: websitePdfComparison.filter((row) => row.status === "Catalogue button removed").length,
  catalogueMain: allCatalogueOnly.filter((row) => row[5].includes("main product") || row[5].includes("model")).length,
  catalogueRelated: allCatalogueOnly.filter((row) => row[5].includes("related")).length,
};

const wb = Workbook.create();
const summary = wb.worksheets.add("Summary");
const available = wb.worksheets.add("With Catalogue");
const missing = wb.worksheets.add("Without Catalogue");
const ametek = wb.worksheets.add("Ametek Comparison");
const catalogueSummarySheet = wb.worksheets.add("Catalogue Summary");
const productComparisonSheet = wb.worksheets.add("Product Comparison");
const renameSheet = wb.worksheets.add("PDF Rename Index");

function setBase(sheet, tabColor) {
  sheet.showGridLines = false;
  sheet.tabColor = tabColor;
  sheet.getRange("A1:H1000").format.font = { name: "Arial", size: 10, color: "#1F2937" };
}

setBase(summary, "#1F4E78");
setBase(available, "#548235");
setBase(missing, "#C65911");
setBase(ametek, "#7030A0");
setBase(catalogueSummarySheet, "#2F75B5");
setBase(productComparisonSheet, "#4472C4");
setBase(renameSheet, "#8064A2");

summary.mergeCells("A2:E2");
summary.getRange("A2").values = [["Product Catalogue Coverage"]];
summary.mergeCells("A3:E3");
summary.getRange("A3").values = [["Based on the catalogue mapping currently implemented on the website"]];
summary.getRange("A5:B9").values = [
  ["Metric", "Value"],
  ["Total products", null],
  ["Products with catalogue", null],
  ["Products without catalogue", null],
  ["Catalogue coverage", null],
];
summary.getRange("B6").formulas = [["=B7+B8"]];
summary.getRange("B7").formulas = [[`=COUNTA('With Catalogue'!C5:C${withCatalogue.length + 4})`]];
summary.getRange("B8").formulas = [[`=COUNTA('Without Catalogue'!C5:C${withoutCatalogue.length + 4})`]];
summary.getRange("B9").formulas = [["=IF(B6=0,0,B7/B6)"]];
summary.getRange("D5:E11").values = [
  ["PDF comparison", "Count"],
  ["Confirmed in supplied PDFs", comparisonCounts.confirmed],
  ["Family / variant only", comparisonCounts.family],
  ["Catalogue buttons removed after PDF review", comparisonCounts.missing],
  ["Catalogue-only main products/models", comparisonCounts.catalogueMain],
  ["Catalogue-only related offerings", comparisonCounts.catalogueRelated],
  ["Renamed catalogue PDFs", renameIndex.length],
];
summary.getRange("A12:E12").values = [["Brand", "Total products", "With catalogue", "Without catalogue", "Coverage"]];
summary.getRangeByIndexes(12, 0, brandSummary.length, 5).values = brandSummary;
summary.tables.add(`A12:E${brandSummary.length + 12}`, true, "BrandCatalogueCoverage").style = "TableStyleMedium2";
summary.getRange("A2:E2").format = { fill: "#D9EAF7", font: { name: "Arial", size: 16, bold: true, color: "#17365D" }, horizontalAlignment: "center" };
summary.getRange("A3:E3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" }, horizontalAlignment: "center" };
summary.getRange("A5:B5").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("D5:E5").format = { fill: "#2F75B5", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
summary.getRange("A6:A9").format.font = { bold: true };
summary.getRange("D6:D11").format.font = { bold: true };
summary.getRange("B9").format.numberFormat = "0.0%";
summary.getRange(`E13:E${brandSummary.length + 12}`).format.numberFormat = "0.0%";
summary.getRange("A:A").format.columnWidth = 34;
summary.getRange("B:C").format.columnWidth = 18;
summary.getRange("D:D").format.columnWidth = 42;
summary.getRange("E:E").format.columnWidth = 14;
summary.freezePanes.freezeRows(12);

function buildListSheet(sheet, title, subtitle, data, hasCatalogue) {
  const columns = hasCatalogue
    ? ["Brand", "Category", "Product", "Product slug", "Product URL", "Catalogue file", "Catalogue download URL"]
    : ["Brand", "Category", "Product", "Product slug", "Product URL", "Status"];
  const values = data.map((row) => hasCatalogue
    ? [row.brand, row.category, row.product, row.slug, row.productUrl, row.catalogue.fileName, row.catalogue.downloadUrl]
    : [row.brand, row.category, row.product, row.slug, row.productUrl, row.catalogueRemoved ? "Catalogue button removed after PDF mismatch" : "No catalogue mapped"]);
  const lastCol = hasCatalogue ? "G" : "F";
  const lastRow = data.length + 4;
  sheet.mergeCells(`A2:${lastCol}2`);
  sheet.getRange("A2").values = [[title]];
  sheet.mergeCells(`A3:${lastCol}3`);
  sheet.getRange("A3").values = [[subtitle]];
  sheet.getRange(`A4:${lastCol}4`).values = [columns];
  if (values.length) sheet.getRangeByIndexes(4, 0, values.length, columns.length).values = values;
  const table = sheet.tables.add(`A4:${lastCol}${lastRow}`, true, hasCatalogue ? "ProductsWithCatalogue" : "ProductsWithoutCatalogue");
  table.style = hasCatalogue ? "TableStyleMedium4" : "TableStyleMedium9";
  table.showFilterButton = true;
  sheet.getRange(`A2:${lastCol}2`).format = { fill: hasCatalogue ? "#E2F0D9" : "#FCE4D6", font: { name: "Arial", size: 15, bold: true, color: hasCatalogue ? "#385723" : "#843C0C" }, horizontalAlignment: "center" };
  sheet.getRange(`A3:${lastCol}3`).format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" }, horizontalAlignment: "center" };
  sheet.getRange(`A5:${lastCol}${lastRow}`).format.verticalAlignment = "center";
  sheet.getRange(`A5:${lastCol}${lastRow}`).format.rowHeight = 28;
  sheet.getRange(`A5:${lastCol}${lastRow}`).format.wrapText = true;
  sheet.getRange("A:A").format.columnWidth = 25;
  sheet.getRange("B:B").format.columnWidth = 27;
  sheet.getRange("C:C").format.columnWidth = 39;
  sheet.getRange("D:D").format.columnWidth = 37;
  sheet.getRange("E:E").format.columnWidth = 48;
  sheet.getRange("F:F").format.columnWidth = hasCatalogue ? 38 : 23;
  if (hasCatalogue) sheet.getRange("G:G").format.columnWidth = 50;
  sheet.freezePanes.freezeRows(4);
  sheet.freezePanes.freezeColumns(2);
}

buildListSheet(available, "Products With Catalogues", `${withCatalogue.length} products currently show a catalogue download on the website`, withCatalogue, true);
buildListSheet(missing, "Products Without Catalogues", `${withoutCatalogue.length} products currently have no catalogue button; 48 were removed after PDF review`, withoutCatalogue, false);

ametek.mergeCells("A2:H2");
ametek.getRange("A2").values = [["Ametek Brookfield Website vs Catalogue"]];
ametek.mergeCells("A3:H3");
ametek.getRange("A3").values = [["Main instruments, software and accessories are separated so catalogue-only accessories are not mistaken for missing product pages"]];
ametek.getRange("A5:C10").values = [
  ["Comparison result", null, "Count"],
  ["Website Ametek products", null, ametekWebsiteProducts.length],
  ["Matched website products", null, ametekComparison.filter((row) => row[5] === "Matched").length],
  ["Website-only separate pages", null, ametekComparison.filter((row) => row[5] === "Website-only separate page").length],
  ["Catalogue-only main instruments", null, ametekComparison.filter((row) => row[5] === "Catalogue-only" && row[0] === "Instrument").length],
  ["Catalogue-only software/accessories/temperature control", null, ametekComparison.filter((row) => row[5] === "Catalogue-only" && row[0] !== "Instrument").length],
];
for (let summaryRow = 5; summaryRow <= 10; summaryRow += 1) ametek.mergeCells(`A${summaryRow}:B${summaryRow}`);
ametek.getRange("A12:H12").values = [["Offering type", "Catalogue section", "Catalogue offering", "Website product", "Website slug", "Comparison", "PDF page", "Notes"]];
ametek.getRangeByIndexes(12, 0, ametekComparison.length, 8).values = ametekComparison;
const ametekLastRow = ametekComparison.length + 12;
const ametekTable = ametek.tables.add(`A12:H${ametekLastRow}`, true, "AmetekCatalogueComparison");
ametekTable.style = "TableStyleMedium5";
ametekTable.showFilterButton = true;
ametek.getRange("A2:H2").format = { fill: "#E4DFEC", font: { name: "Arial", size: 15, bold: true, color: "#4C2A69" }, horizontalAlignment: "center" };
ametek.getRange("A3:H3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" }, horizontalAlignment: "center" };
ametek.getRange("A5:C5").format = { fill: "#7030A0", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" } };
ametek.getRange("A6:A10").format.font = { bold: true };
ametek.getRange(`A13:H${ametekLastRow}`).format.verticalAlignment = "center";
ametek.getRange(`A13:H${ametekLastRow}`).format.wrapText = true;
ametek.getRange("A:A").format.columnWidth = 19;
ametek.getRange("B:B").format.columnWidth = 28;
ametek.getRange("C:D").format.columnWidth = 34;
ametek.getRange("E:E").format.columnWidth = 38;
ametek.getRange("F:F").format.columnWidth = 25;
ametek.getRange("G:G").format.columnWidth = 11;
ametek.getRange("H:H").format.columnWidth = 47;
ametek.getRange(`F13:F${ametekLastRow}`).conditionalFormats.add("containsText", { text: "Matched", format: { fill: "#E2F0D9", font: { color: "#385723", bold: true } } });
ametek.getRange(`F13:F${ametekLastRow}`).conditionalFormats.add("containsText", { text: "Catalogue-only", format: { fill: "#FFF2CC", font: { color: "#7F6000", bold: true } } });
ametek.getRange(`F13:F${ametekLastRow}`).conditionalFormats.add("containsText", { text: "Website-only", format: { fill: "#FCE4D6", font: { color: "#843C0C", bold: true } } });
ametek.freezePanes.freezeRows(12);
ametek.freezePanes.freezeColumns(3);

const allMappedCatalogues = [...principalCatalogues.values(), ...productCatalogues.values()];
const catalogueInfoByName = new Map(allMappedCatalogues.map((item) => [item.fileName, item]));
const comparisonTableRows = websitePdfComparison.map((row) => [
  "Website product", row.brand, row.category, row.product, row.slug, row.product,
  row.catalogue, row.status, row.note, row.downloadUrl,
]);
for (const extra of allCatalogueOnly) {
  const catalogueInfo = catalogueInfoByName.get(extra[4]);
  comparisonTableRows.push([
    "Catalogue-only offering", extra[0], extra[2], "", "", extra[3], extra[4], extra[5], extra[6],
    catalogueInfo?.downloadUrl ?? "",
  ]);
}
comparisonTableRows.sort((a, b) => a[1].localeCompare(b[1]) || a[6].localeCompare(b[6]) || a[7].localeCompare(b[7]) || (a[3] || a[5]).localeCompare(b[3] || b[5]));

const catalogueNames = [...new Set([...websitePdfComparison.map((row) => row.catalogue), ...allCatalogueOnly.map((row) => row[4])])].sort();
const catalogueSummaryRows = catalogueNames.map((catalogue) => {
  const websiteRows = websitePdfComparison.filter((row) => row.catalogue === catalogue);
  const extras = allCatalogueOnly.filter((row) => row[4] === catalogue);
  const principals = [...new Set([...websiteRows.map((row) => row.brand), ...extras.map((row) => row[0])])].join(", ");
  const confirmed = websiteRows.filter((row) => row.status === "Confirmed in PDF").length;
  const family = websiteRows.filter((row) => row.status.includes("Family")).length;
  const notFound = websiteRows.filter((row) => row.status === "Catalogue button removed").length;
  const mainExtras = extras.filter((row) => row[5].includes("main product") || row[5].includes("model")).length;
  const relatedExtras = extras.filter((row) => row[5].includes("related")).length;
  let action = "No product-list change identified";
  if (websiteRows.length === 0) action = "Catalogue is not mapped to any website product";
  else if (notFound > 0 && mainExtras > 0) action = "Catalogue buttons removed; review catalogue-only products separately";
  else if (notFound > 0) action = "Catalogue buttons removed; add matching PDFs before restoring them";
  else if (mainExtras > 0) action = "Review catalogue-only products for possible website addition";
  return [principals, catalogue, websiteRows.length, confirmed, family, notFound, mainExtras, relatedExtras, action];
});

catalogueSummarySheet.getRange("A2:I2").merge();
catalogueSummarySheet.getRange("A2").values = [["Catalogue Coverage Summary"]];
catalogueSummarySheet.getRange("A3:I3").merge();
catalogueSummarySheet.getRange("A3").values = [["Comparison of every supplied PDF against the website products currently mapped to it"]];
catalogueSummarySheet.getRange("A5:I5").values = [["Principal", "Renamed PDF", "Products reviewed", "Confirmed", "Family / variant", "Button removed", "Catalogue-only main", "Related offerings", "Recommended action"]];
catalogueSummarySheet.getRangeByIndexes(5, 0, catalogueSummaryRows.length, 9).values = catalogueSummaryRows;
const catalogueSummaryLast = catalogueSummaryRows.length + 5;
const catalogueSummaryTable = catalogueSummarySheet.tables.add(`A5:I${catalogueSummaryLast}`, true, "CatalogueComparisonSummary");
catalogueSummaryTable.style = "TableStyleMedium2";
catalogueSummaryTable.showFilterButton = true;
catalogueSummarySheet.getRange("A2:I2").format = { font: { name: "Arial", size: 15, bold: true, color: "#17365D" }, horizontalAlignment: "left" };
catalogueSummarySheet.getRange("A3:I3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" } };
catalogueSummarySheet.getRange(`A6:I${catalogueSummaryLast}`).format.wrapText = true;
catalogueSummarySheet.getRange(`A6:I${catalogueSummaryLast}`).format.verticalAlignment = "center";
catalogueSummarySheet.getRange("A:A").format.columnWidth = 24;
catalogueSummarySheet.getRange("B:B").format.columnWidth = 48;
catalogueSummarySheet.getRange("C:C").format.columnWidth = 25;
catalogueSummarySheet.getRange("D:H").format.columnWidth = 20;
catalogueSummarySheet.getRange("I:I").format.columnWidth = 52;
catalogueSummarySheet.freezePanes.freezeRows(5);
catalogueSummarySheet.freezePanes.freezeColumns(2);

productComparisonSheet.getRange("A2:J2").merge();
productComparisonSheet.getRange("A2").values = [["Complete Website and Catalogue Product Comparison"]];
productComparisonSheet.getRange("A3:J3").merge();
productComparisonSheet.getRange("A3").values = [["Confirmed, unmatched and catalogue-only offerings across all supplied PDFs"]];
productComparisonSheet.getRange("A5:J5").values = [["Record type", "Principal", "Category / section", "Website product", "Website slug", "Catalogue offering", "Renamed PDF", "Comparison", "Notes", "Catalogue URL"]];
productComparisonSheet.getRangeByIndexes(5, 0, comparisonTableRows.length, 10).values = comparisonTableRows;
const productComparisonLast = comparisonTableRows.length + 5;
const productComparisonTable = productComparisonSheet.tables.add(`A5:J${productComparisonLast}`, true, "CompleteProductCatalogueComparison");
productComparisonTable.style = "TableStyleMedium2";
productComparisonTable.showFilterButton = true;
productComparisonSheet.getRange("A2:J2").format = { font: { name: "Arial", size: 15, bold: true, color: "#17365D" }, horizontalAlignment: "left" };
productComparisonSheet.getRange("A3:J3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" } };
productComparisonSheet.getRange(`A6:J${productComparisonLast}`).format.wrapText = true;
productComparisonSheet.getRange(`A6:J${productComparisonLast}`).format.verticalAlignment = "center";
const comparisonStatusRange = productComparisonSheet.getRange(`H6:H${productComparisonLast}`);
comparisonStatusRange.conditionalFormats.add("containsText", { text: "Confirmed", format: { fill: "#E2F0D9", font: { color: "#385723", bold: true } } });
comparisonStatusRange.conditionalFormats.add("containsText", { text: "Not found", format: { fill: "#FCE4D6", font: { color: "#9C0006", bold: true } } });
comparisonStatusRange.conditionalFormats.add("containsText", { text: "button removed", format: { fill: "#FCE4D6", font: { color: "#9C0006", bold: true } } });
comparisonStatusRange.conditionalFormats.add("containsText", { text: "Catalogue-only", format: { fill: "#FFF2CC", font: { color: "#7F6000", bold: true } } });
comparisonStatusRange.conditionalFormats.add("containsText", { text: "Family", format: { fill: "#DDEBF7", font: { color: "#1F4E78", bold: true } } });
const comparisonWidths = { A: 22, B: 24, C: 27, D: 39, E: 38, F: 39, G: 50, H: 27, I: 55, J: 50 };
for (const [column, width] of Object.entries(comparisonWidths)) productComparisonSheet.getRange(`${column}:${column}`).format.columnWidth = width;
productComparisonSheet.freezePanes.freezeRows(5);
productComparisonSheet.freezePanes.freezeColumns(3);

const renameRows = renameIndex.map(([original, renamed]) => {
  const info = catalogueInfoByName.get(renamed);
  return [original, renamed, renamed.split("_")[0], info?.fileId ?? "", info?.downloadUrl ?? "", "Renamed in project copies and website metadata"];
});
renameSheet.getRange("A2:F2").merge();
renameSheet.getRange("A2").values = [["PDF Rename Index"]];
renameSheet.getRange("A3:F3").merge();
renameSheet.getRange("A3").values = [["Readable filenames use Principal_Product-or-Family_Document-Type.pdf; Google Drive IDs are unchanged"]];
renameSheet.getRange("A5:F5").values = [["Original filename", "Meaningful filename", "Principal", "Google Drive file ID", "Download URL", "Status"]];
renameSheet.getRangeByIndexes(5, 0, renameRows.length, 6).values = renameRows;
const renameLast = renameRows.length + 5;
const renameTable = renameSheet.tables.add(`A5:F${renameLast}`, true, "CatalogueRenameIndex");
renameTable.style = "TableStyleMedium5";
renameTable.showFilterButton = true;
renameSheet.getRange("A2:F2").format = { font: { name: "Arial", size: 15, bold: true, color: "#4C2A69" }, horizontalAlignment: "left" };
renameSheet.getRange("A3:F3").format = { font: { name: "Arial", size: 10, italic: true, color: "#667085" } };
renameSheet.getRange(`A6:F${renameLast}`).format.wrapText = true;
renameSheet.getRange("A:B").format.columnWidth = 55;
renameSheet.getRange("C:C").format.columnWidth = 24;
renameSheet.getRange("D:D").format.columnWidth = 38;
renameSheet.getRange("E:E").format.columnWidth = 52;
renameSheet.getRange("F:F").format.columnWidth = 36;
renameSheet.freezePanes.freezeRows(5);

wb.recalculate();
const outputDir = "outputs/product-catalogue-coverage";
await fs.mkdir(outputDir, { recursive: true });
for (const [sheetName, range, fileName] of [
  ["Summary", `A1:E${Math.min(brandSummary.length + 12, 35)}`, "summary-preview.png"],
  ["With Catalogue", `A1:G${Math.min(withCatalogue.length + 4, 25)}`, "with-catalogue-preview.png"],
  ["Without Catalogue", `A1:F${Math.min(withoutCatalogue.length + 4, 25)}`, "without-catalogue-preview.png"],
  ["Ametek Comparison", "A1:H30", "ametek-comparison-preview.png"],
  ["Catalogue Summary", `A1:I${Math.min(catalogueSummaryLast, 35)}`, "catalogue-summary-preview.png"],
  ["Product Comparison", "A1:J28", "product-comparison-preview.png"],
  ["PDF Rename Index", `A1:F${renameLast}`, "pdf-rename-index-preview.png"],
]) {
  const preview = await wb.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}
const check = await wb.inspect({ kind: "table", range: "Summary!A2:E20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 5, maxChars: 6000 });
const comparisonCheck = await wb.inspect({ kind: "table", range: "Catalogue Summary!A2:I20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 9, maxChars: 12000 });
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
const exported = await SpreadsheetFile.exportXlsx(wb);
await exported.save(`${outputDir}/Complete_Product_Catalogue_Comparison.xlsx`);
console.log(JSON.stringify({ total: rows.length, withCatalogue: withCatalogue.length, withoutCatalogue: withoutCatalogue.length, ...comparisonCounts, comparisonRows: comparisonTableRows.length, renamedPdfs: renameRows.length }));
console.log(check.ndjson);
console.log(comparisonCheck.ndjson);
console.log(errors.ndjson);
