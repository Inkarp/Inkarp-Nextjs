import fs from "node:fs/promises";
import path from "node:path";

const productsApi = JSON.parse(await fs.readFile("outputs/local-products.json", "utf8"));
const mappingSource = await fs.readFile("src/data/productCatalogues.js", "utf8");

function parseMap(name) {
  const body = mappingSource.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`))?.[1] ?? "";
  const map = new Map();
  const re = /(?:"([^"]+)"|([a-zA-Z0-9-]+)):\s*driveCatalogue\("([^"]+)",\s*"([^"]+)"\)/g;
  for (const m of body.matchAll(re)) map.set(m[1] ?? m[2], { id: m[3], fileName: m[4] });
  return map;
}

const principalMap = parseMap("PRINCIPAL_CATALOGUES");
const productMap = parseMap("PRODUCT_CATALOGUES");
const localByOriginal = new Map([
  ["Brookfield Ametek A4 landscape v5.pdf", "Ametek_Brookfield_catalogue"], ["BWB.pdf", "BWB"],
  ["Chemspeed catalog v4.pdf", "Chemspeed"], ["Gea V6 copy.pdf", "GEA"], ["Heidolph 2025 v7.pdf", "Heidolph"],
  ["Kubota Centrifuges.pdf", "Kubota"], ["Labstationi Glove Box.pdf", "Labstationi"], ["Litescope.pdf", "Litescope"],
  ["Radleys PP.pdf", "Radleys"], ["RotaChrom v3.pdf", "RotaChrom"], ["Sonics copy.pdf v2.pdf", "Sonics"], ["SP v3.pdf", "SP"],
  ["Freeze drying.pdf", "Freeze_drying"], ["Kjel line.pdf", "Kjel_line"], ["Inkarp Bravo V2.pdf", "Bravo"],
  ["Tango.pdf", "Tango"], ["N30-Touch tri-fold brochure v4.pdf", "N30_Touch"], ["Nanophotometer.pdf", "Nanophotometer"],
  ["DriveAFM v2.pdf", "DriveAFM"], ["AFM FLEX MOUNT.pdf", "FlexAFM"], ["AFM.pdf", "AFM"], ["AFM Flex final.pdf", "NaniteAFM"],
  ["DMA copy.pdf", "DMA"], ["DSC.pdf", "DSC"], ["STA copy.pdf", "STA"],
]);

const stop = new Set("the and with for plus series model models analyzer analyzers rheometer rheometers viscometer viscometers spectrometer spectrometers centrifuge refrigerated benchtop tabletop high speed laboratory lab rotary evaporator magnetic stirrer overhead shaker pump system systems product products instrument instruments software data analysis configuration accessories accessory control controller dynamic differential scanning simultaneous thermal ultrasonic probe sonicator flame photometer handheld microscope atomic force".split(" "));
const clean = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
function matchScore(productName, text) {
  const tokens = [...new Set(clean(productName).split(" ").filter((t) => t.length > 1 && !stop.has(t)))];
  const compactText = clean(text);
  const found = tokens.filter((t) => compactText.includes(t));
  const score = tokens.length ? found.length / tokens.length : 0;
  return { score, tokens: tokens.join(" "), found: found.join(" ") };
}

const textCache = new Map();
async function getText(fileName) {
  if (!textCache.has(fileName)) {
    const stem = localByOriginal.get(fileName);
    textCache.set(fileName, stem ? await fs.readFile(path.join("tmp/pdfs/text", `${stem}.txt`), "utf8") : "");
  }
  return textCache.get(fileName);
}

const results = [];
for (const principal of productsApi.data ?? []) {
  for (const category of principal.categories ?? []) {
    for (const product of category.products ?? []) {
      const catalogue = productMap.get(product.slug) ?? principalMap.get(principal.slug);
      if (!catalogue) continue;
      const text = await getText(catalogue.fileName);
      const matched = matchScore(product.name, text);
      results.push({ brand: principal.principalName, category: category.name, product: product.name, slug: product.slug, catalogue: catalogue.fileName, ...matched });
    }
  }
}

await fs.writeFile("tmp/pdfs/catalogue-website-match.json", JSON.stringify(results, null, 2));
const grouped = new Map();
for (const row of results) {
  if (!grouped.has(row.catalogue)) grouped.set(row.catalogue, []);
  grouped.get(row.catalogue).push(row);
}
for (const [catalogue, group] of grouped) {
  const weak = group.filter((r) => r.score < 0.6);
  console.log(`\n===== ${catalogue}: ${group.length} website products; ${weak.length} weak matches =====`);
  for (const row of weak) console.log(`${row.score.toFixed(2)} | ${row.brand} | ${row.product} | tokens=${row.tokens} | found=${row.found}`);
}
