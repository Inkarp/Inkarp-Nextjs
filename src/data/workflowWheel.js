// Source: "Laboratory Analytical Workflows — The 8-Step Workflow Across Nine
// Industries" reference document. Every industry runs the same eight
// analytical stages, worded for its own context.
//
// `workflowWheelLinks` is index-aligned with `workflowWheelSteps`: it maps a
// stage to a workflow topic page at /workflows/<industry>/<topic>. A null
// topic falls back to the industry landing page, /workflows/<industry>.

export const workflowIntros = {
  pharma:
    "Analytical workflow for testing drug products and raw materials to ensure identity, purity, potency, and shelf-life stability under GMP and ICH guidelines.",
  biotech:
    "Workflow for characterizing biological molecules (proteins, antibodies, nucleic acids) and biologic drug products, emphasizing purity, structure, and bioactivity.",
  rnd:
    "General research workflow for developing and validating methods, characterizing new compounds, and generating reproducible experimental data.",
  food:
    "Workflow for testing food and drink products for composition, nutrition, contaminants, and compliance with food-safety regulations.",
  environmental:
    "Workflow for monitoring water, soil, and air for pollutants, ensuring environmental and drinking-water quality against regulatory limits.",
  chemical:
    "Workflow for characterizing chemicals, fuels, and petrochemical products for composition, purity, and specification compliance.",
  academic:
    "Teaching and research workflow for training, exploratory experiments, and generating publishable scientific data.",
  materials:
    "Workflow for characterizing advanced materials and nanomaterials for structure, composition, and functional properties.",
  clinical:
    "Workflow for analyzing patient samples to support diagnosis, treatment, and monitoring under clinical laboratory standards.",
};

export const workflowWheelSteps = {
  pharma: [
    { name: "Sampling & weighing", description: "Take a representative sample of the drug substance or product and weigh it accurately." },
    { name: "Dissolution & prep", description: "Dissolve and prepare the sample; dissolution testing measures drug-release from the dosage form." },
    { name: "Purification", description: "Clean up the sample by filtration, extraction, or SPE to remove interfering matrix components." },
    { name: "Separation (HPLC)", description: "Separate active ingredients and impurities using high-performance liquid chromatography." },
    { name: "Detection & ID", description: "Identify each component from its detector response (UV/DAD/MS), retention time, and spectra." },
    { name: "Quantification", description: "Measure the amount of each component (assay, content uniformity) against calibration standards." },
    { name: "Stability study", description: "Confirm the product maintains quality over its shelf life under ICH storage conditions." },
    { name: "QC release", description: "Review all results against specifications and make the formal batch-release decision." },
  ],
  biotech: [
    { name: "Sampling & harvesting", description: "Collect cell culture, fermentation broth, or purified fractions for analysis." },
    { name: "Lysis & extraction", description: "Break open cells and extract the target biomolecule into a workable buffer." },
    { name: "Purification", description: "Isolate the target using affinity, ion-exchange, or size-exclusion chromatography." },
    { name: "Separation (SDS-PAGE / HPLC)", description: "Separate species by size or charge using electrophoresis or chromatography." },
    { name: "Detection & ID", description: "Confirm identity by mass spectrometry, Western blot, or sequencing." },
    { name: "Quantification & purity", description: "Determine concentration, purity, and aggregate levels." },
    { name: "Bioactivity / stability", description: "Assess potency by bioassay and monitor stability over time." },
    { name: "QC release", description: "Verify results against specifications and release the batch or lot." },
  ],
  rnd: [
    { name: "Sample preparation", description: "Prepare and weigh samples or synthesized materials for study." },
    { name: "Method development", description: "Design and optimize the analytical or experimental method." },
    { name: "Purification / isolation", description: "Isolate the compound of interest from reaction mixtures or matrices." },
    { name: "Separation", description: "Separate components using chromatography or electrophoresis." },
    { name: "Detection & structural ID", description: "Identify structure using MS, NMR, IR, or UV-Vis." },
    { name: "Quantification", description: "Measure yields, concentrations, or reaction conversion." },
    { name: "Method validation", description: "Validate accuracy, precision, linearity, and robustness." },
    { name: "Documentation & reporting", description: "Record data, interpret results, and report findings." },
  ],
  food: [
    { name: "Sampling & homogenization", description: "Collect a representative sample and homogenize it for uniform testing." },
    { name: "Sample preparation", description: "Digest, dissolve, or extract analytes (nutrients, additives, residues)." },
    { name: "Clean-up / purification", description: "Remove fats, proteins, or matrix interferences before analysis." },
    { name: "Separation (HPLC / GC)", description: "Separate components using liquid or gas chromatography." },
    { name: "Detection & ID", description: "Identify additives, contaminants, or nutrients by detector response." },
    { name: "Quantification", description: "Measure levels of nutrients, additives, pesticides, or toxins." },
    { name: "Shelf-life / stability", description: "Assess spoilage, oxidation, and shelf life over time." },
    { name: "QC release", description: "Confirm compliance with food-safety limits and release the product." },
  ],
  environmental: [
    { name: "Field sampling", description: "Collect representative environmental samples with proper preservation." },
    { name: "Sample preparation", description: "Filter, digest, or concentrate the sample for analysis." },
    { name: "Extraction / clean-up", description: "Extract target pollutants and remove matrix interferences (SPE, liquid-liquid)." },
    { name: "Separation (GC / IC / HPLC)", description: "Separate contaminants by chromatography or ion chromatography." },
    { name: "Detection & ID", description: "Identify pollutants by MS, ICP, or spectroscopic detectors." },
    { name: "Quantification", description: "Measure contaminant concentrations against regulatory thresholds." },
    { name: "Trend monitoring", description: "Track results over time for compliance and early warning." },
    { name: "Reporting & compliance", description: "Compare to limits and report to regulatory authorities." },
  ],
  chemical: [
    { name: "Sampling", description: "Collect a representative sample of feedstock, intermediate, or product." },
    { name: "Sample preparation", description: "Dilute, dissolve, or condition the sample for analysis." },
    { name: "Purification / separation prep", description: "Remove particulates or interferences before analysis." },
    { name: "Separation (GC / GC-MS)", description: "Separate components using gas chromatography." },
    { name: "Detection & ID", description: "Identify compounds by MS, FID, or spectroscopy." },
    { name: "Quantification", description: "Measure component concentrations and product purity." },
    { name: "Property / stability testing", description: "Test physical properties, oxidation stability, and specification limits." },
    { name: "QC release", description: "Confirm specification compliance and release the product." },
  ],
  academic: [
    { name: "Sample preparation", description: "Prepare samples or standards for the experiment." },
    { name: "Experimental design", description: "Define the method, controls, and variables." },
    { name: "Isolation / purification", description: "Isolate target species where required." },
    { name: "Separation", description: "Separate components using appropriate techniques." },
    { name: "Detection & characterization", description: "Characterize samples using spectroscopy or MS." },
    { name: "Quantification / analysis", description: "Analyze and quantify experimental results." },
    { name: "Data validation", description: "Check reproducibility and statistical significance." },
    { name: "Publication & reporting", description: "Interpret, document, and publish findings." },
  ],
  materials: [
    { name: "Sampling", description: "Obtain a representative sample of the material or nanomaterial." },
    { name: "Sample preparation", description: "Mount, disperse, or section the sample for analysis." },
    { name: "Purification / isolation", description: "Remove impurities or isolate particle fractions." },
    { name: "Separation / fractionation", description: "Separate by size or composition (e.g., field-flow fractionation)." },
    { name: "Detection & imaging", description: "Characterize structure by SEM, TEM, XRD, or AFM." },
    { name: "Quantification", description: "Measure particle size, composition, and surface area." },
    { name: "Property testing", description: "Test mechanical, thermal, or electronic properties and stability." },
    { name: "Reporting", description: "Compile characterization data and report material specifications." },
  ],
  clinical: [
    { name: "Specimen collection", description: "Collect and label the patient specimen (blood, urine, tissue)." },
    { name: "Sample preparation", description: "Centrifuge, dilute, or extract analytes from the specimen." },
    { name: "Purification / extraction", description: "Isolate target analytes (e.g., DNA, metabolites, proteins)." },
    { name: "Separation (HPLC / LC-MS)", description: "Separate analytes for accurate measurement." },
    { name: "Detection & ID", description: "Identify biomarkers or analytes by immunoassay or MS." },
    { name: "Quantification", description: "Measure analyte levels against clinical reference ranges." },
    { name: "Quality control", description: "Run controls and verify assay performance." },
    { name: "Result release", description: "Validate and report results to clinicians." },
  ],
};

export const workflowWheelLinks = {
  pharma: [
    "balance-qualification",
    "dissolution",
    "residual-solvents",
    "impurity-profiling",
    "impurity-profiling",
    "elemental-impurities",
    "karl-fischer-moisture",
    null,
  ],
  biotech: [
    "cell-line-development",
    "sample-homogenization",
    "protein-purification",
    "protein-purification",
    "bioreactor-monitoring",
    "endotoxin-testing",
    "cold-chain-storage",
    null,
  ],
  rnd: [
    "reaction-screening",
    "reaction-screening",
    "crystallization-studies",
    "solvent-recovery",
    "material-characterization",
    "thermal-analysis",
    "data-documentation",
    "data-documentation",
  ],
  food: [
    "formulation-weighing",
    "solvent-extraction",
    "solvent-extraction",
    "composition-analysis",
    "material-identification",
    "composition-analysis",
    "moisture-content",
    "authenticity-testing",
  ],
  environmental: [
    "sample-preservation",
    "sample-preservation",
    "soil-contamination",
    "microplastics",
    "trace-metals",
    "water-quality",
    "air-quality",
    null,
  ],
  chemical: [
    "process-control",
    "process-control",
    "distillation",
    "distillation",
    "purity-analysis",
    "purity-analysis",
    "viscosity",
    "batch-documentation",
  ],
  academic: [
    "teaching-labs",
    "research-grants",
    "shared-facilities",
    "shared-facilities",
    "thesis-analytics",
    "thesis-analytics",
    "student-training",
    "research-grants",
  ],
  materials: [
    "nanoparticle-synthesis",
    "surface-characterization",
    "nanoparticle-synthesis",
    "particle-sizing",
    "structural-analysis",
    "particle-sizing",
    "mechanical-testing",
    "thermal-properties",
  ],
  clinical: [
    "clinical-sample-prep",
    "clinical-sample-prep",
    "molecular-diagnostics",
    "molecular-diagnostics",
    "immunoassay",
    "point-of-care",
    "calibration-compliance",
    "cold-chain",
  ],
};

/**
 * Stage names for an industry that map to a given workflow topic. A topic can
 * be the destination of more than one stage (e.g. both "Separation (HPLC)" and
 * "Detection & ID" point at impurity-profiling). Returns [] for the two topics
 * no stage links to, so callers can fall back to the full stage set.
 */
export function stagesForTopic(cat, topic) {
  const links = workflowWheelLinks[cat] ?? [];
  const steps = workflowWheelSteps[cat] ?? [];
  return links
    .map((t, i) => (t === topic ? steps[i]?.name : null))
    .filter(Boolean);
}

/** URL slug for a stage name, e.g. "Sampling & weighing" -> "sampling-and-weighing". */
export function stageSlug(name) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every stage of an industry, with its slug and position. */
export function stagesWithSlugs(cat) {
  return (workflowWheelSteps[cat] ?? []).map((step, index) => ({
    ...step,
    slug: stageSlug(step.name),
    index,
    number: String(index + 1).padStart(2, "0"),
  }));
}

/** Resolve a stage by its slug. */
export function findStage(cat, slug) {
  return stagesWithSlugs(cat).find((s) => s.slug === slug) ?? null;
}

/**
 * Old topic slug -> the stage that fed it, so legacy
 * /workflows/<industry>/<topic> URLs can redirect to the stage page.
 */
export function stageSlugForLegacyTopic(cat, topic) {
  const links = workflowWheelLinks[cat] ?? [];
  const steps = workflowWheelSteps[cat] ?? [];
  const i = links.indexOf(topic);
  return i >= 0 && steps[i] ? stageSlug(steps[i].name) : null;
}

/**
 * Industries whose workflow contains a stage of this name, with that
 * industry's slug for it. Most stages are unique to one industry; eight are
 * shared (e.g. "Purification" runs in both pharma and biotech).
 */
export function industriesWithStage(name) {
  return Object.keys(workflowWheelSteps)
    .filter((cat) => workflowWheelSteps[cat].some((step) => step.name === name))
    .map((cat) => ({ cat, slug: stageSlug(name) }));
}
