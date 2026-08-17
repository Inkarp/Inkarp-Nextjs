import { normalizeTag } from "@/lib/workflowContent";

/**
 * Every product detail page carries an "Industry Explorer" section whose
 * industries are written as free prose ("Pharmaceutical Process Chemistry",
 * "Battery Electrode Manufacturing", ...). Across the catalogue that is ~1,000
 * distinct labels — far too many to list in a dropdown, and none of them match
 * the nine workflow industries the /products filter offers.
 *
 * This module maps those free-text labels onto the nine filter industries so
 * the Industry dropdown actually reflects what each product page claims.
 *
 * Rules are matched against the normalised label (lowercased, punctuation and
 * "&" collapsed by normalizeTag). A label may map to several industries —
 * "Pharmaceutical QC" is both pharma and rnd — which is intended.
 */
const INDUSTRY_RULES = {
  pharma: [
    "pharma", "drug", "api manufactur", "active pharmaceutical",
    "formulation", "dosage", "tablet", "capsule", "injectable", "parenteral",
    "cdmo", "cmo", "excipient", "generic", "biopharma", "preformulation",
  ],
  biotech: [
    "biotech", "bioprocess", "biologic", "biomanufactur", "bioreactor",
    "fermentation", "cell culture", "cell biology", "molecular biology",
    "protein", "enzyme", "genomic", "proteomic", "dna", "rna", "pcr",
    "vaccine", "antibody", "microbiolog", "life science", "bioanalytical",
    "tissue", "stem cell", "biosensor", "biofuel", "biomass",
    "biolog", "neuroscience", "immunolog", "genetic", "purification",
    "organoid", "cytometr",
  ],
  rnd: [
    "r and d", "research and development", "contract research", "cro",
    "analytical laborator", "analytical chemistry", "analytical testing",
    "quality control", "quality assurance", "qc", "qa", "method development",
    "contract testing", "contract manufactur", "testing laborator",
    "process development", "process chemistry", "core facilit",
    "innovation", "product development", "pilot plant", "scale up",
    "regulated", "validation", "laboratory operations", "high throughput screening",
  ],
  food: [
    "food", "beverage", "dairy", "brewing", "brewery", "winery", "distiller",
    "nutraceutical", "nutrition", "agricultur", "agro", "flavour", "flavor",
    "confection", "bakery", "meat", "edible oil", "feed",
  ],
  environmental: [
    "environment", "water", "wastewater", "effluent", "soil", "air quality",
    "emission", "pollution", "contaminant", "ecolog", "sustainab",
    "recycl", "waste", "climate", "geochem", "marine",
  ],
  chemical: [
    "chemical", "petrochemical", "petroleum", "refinery", "specialty chem",
    "fine chemical", "catalys", "paint", "coating", "ink", "adhesive",
    "sealant", "lubricant", "surfactant", "detergent", "cosmetic",
    "personal care", "fragrance", "agrochemical", "pesticide", "solvent",
    "electroplat", "process chemical",
    "chemistry", "synthesis", "synthetic", "organic", "inorganic",
    "electrochem", "distillation", "extraction",
  ],
  academic: [
    "academic", "universit", "teaching", "education", "school", "college",
    "student", "institute of technology", "scholar", "campus",
  ],
  materials: [
    "material", "nanotech", "nanomaterial", "nanoparticle", "semiconductor",
    "battery", "electrode", "photovoltaic", "perovskite", "solar",
    "fuel cell", "polymer", "plastic", "rubber", "elastomer", "composite",
    "ceramic", "metal", "alloy", "metallurg", "electronics", "thin film",
    "coating technolog", "surface science", "crystallograph", "textile",
    "additive manufactur", "3d printing", "graphene", "energy storage",
    "corrosion", "tribolog", "optical", "photonic", "aerospace", "automotive",
  ],
  clinical: [
    "clinical", "diagnostic", "medical", "hospital", "pathology", "forensic",
    "toxicolog", "in vitro diagnostic", "ivd", "patient", "healthcare",
    "veterinar", "blood", "serum", "plasma testing", "cytolog", "histolog",
    "oncolog", "biomedical", "renal", "cardio", "dental",
  ],
};

// Precompute normalised needles once.
const NORMALISED_RULES = Object.entries(INDUSTRY_RULES).map(([cat, needles]) => [
  cat,
  needles.map(normalizeTag).filter(Boolean),
]);

/**
 * Map one free-text industry label to zero or more filter industry slugs.
 * @param {string} label
 * @returns {string[]}
 */
export function mapIndustryLabelToCats(label) {
  const normalised = normalizeTag(label);
  if (!normalised) return [];

  const cats = [];
  for (const [cat, needles] of NORMALISED_RULES) {
    if (needles.some((needle) => normalised.includes(needle))) {
      cats.push(cat);
    }
  }

  return cats;
}

/** Pull the Industry Explorer labels off a product, whatever shape they use. */
export function getProductIndustryLabels(product) {
  const industries = product?.applicationsExplorer?.industries;
  if (!Array.isArray(industries)) return [];

  return industries
    .map((entry) =>
      typeof entry === "string" ? entry : (entry?.name ?? entry?.title ?? entry?.label ?? "")
    )
    .filter(Boolean);
}

/**
 * The set of filter industries a product belongs to, derived from its own
 * Industry Explorer section.
 * @returns {Set<string>}
 */
export function getProductIndustryCats(product) {
  const cats = new Set();
  for (const label of getProductIndustryLabels(product)) {
    for (const cat of mapIndustryLabelToCats(label)) {
      cats.add(cat);
    }
  }
  return cats;
}
