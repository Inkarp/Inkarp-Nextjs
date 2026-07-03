// Content for the home page "Lab workflows" and "Why choose us" sections.
// Brand names in featuredProducts map to real principals already served by
// /products?q=<brand>; industry step counts/taglines are editorial copy.

export const workflowIndustries = [
  {
    cat: "pharma",
    industry: "Pharmaceuticals",
    tagline:
      "Impurity profiling, dissolution, and release testing — instrumented for every stage of drug development.",
    steps: 6,
  },
  {
    cat: "biotech",
    industry: "Biotechnology",
    tagline:
      "From cell line development to bioreactor monitoring, equipped for every stage of the bioprocess.",
    steps: 6,
  },
  {
    cat: "rnd",
    industry: "R&D Laboratories",
    tagline:
      "Reaction screening through crystallization studies, built for fast iteration on the bench.",
    steps: 6,
  },
  {
    cat: "food",
    industry: "Food & Beverage",
    tagline:
      "Raw material identification to formulation QC, keeping every batch within specification.",
    steps: 6,
  },
  {
    cat: "environmental",
    industry: "Environmental & Water",
    tagline:
      "Trace contaminants, microplastics, and effluent testing, instrumented for regulatory compliance.",
    steps: 6,
  },
  {
    cat: "chemical",
    industry: "Chemical & Petrochemical",
    tagline:
      "Purity, composition, and in-process control, built for continuous production quality.",
    steps: 6,
  },
  {
    cat: "academic",
    industry: "Academic & Research",
    tagline:
      "Discovery science across every department, from teaching labs to grant-funded research.",
    steps: 6,
  },
  {
    cat: "materials",
    industry: "Materials & Nanotechnology",
    tagline:
      "Surface, structure, and particle characterisation, for materials from bulk to nanoscale.",
    steps: 6,
  },
  {
    cat: "clinical",
    industry: "Clinical & Diagnostics",
    tagline:
      "Molecular testing and diagnostic assays, equipped for accredited, audit-ready labs.",
    steps: 6,
  },
];

export const workflowTopics = {
  pharma: [
    { tag: "impurity profiling", title: "Impurity profiling in drug substances", desc: "Separation, detection, and quantification of related substances below regulatory thresholds." },
    { tag: "dissolution", title: "Dissolution testing of solid dosage", desc: "Release profiles that meet the monograph and hold across batches." },
    { tag: "residual solvents", title: "Residual solvent analysis", desc: "Headspace methods that detect class solvents at ICH limits." },
    { tag: "elemental impurities", title: "Elemental impurities per ICH Q3D", desc: "Trace metal quantification with the sensitivity the guideline demands." },
    { tag: "karl fischer moisture", title: "Water content by Karl Fischer", desc: "Moisture control that keeps product inside specification." },
    { tag: "balance qualification", title: "Weighing and balance qualification", desc: "Accurate, compliant weighing for potent and reference material." },
  ],
  biotech: [
    { tag: "cell line development", title: "Cell line development & screening", desc: "Orbital shaking and incubation conditions tuned for consistent clone growth." },
    { tag: "bioreactor monitoring", title: "Bioreactor process monitoring", desc: "Track pH, dissolved oxygen, and agitation through every scale-up stage." },
    { tag: "protein purification", title: "Protein purification workflows", desc: "Chromatographic separation methods for high-purity biomolecule recovery." },
    { tag: "endotoxin testing", title: "Endotoxin & bioburden testing", desc: "Rapid screening methods that keep bioprocess batches release-ready." },
    { tag: "sample homogenization", title: "Sample extraction & homogenization", desc: "Consistent cell lysis and tissue prep ahead of downstream analysis." },
    { tag: "cold chain storage", title: "Cold chain sample storage", desc: "Reliable ultra-low temperature storage for sensitive biological material." },
  ],
  rnd: [
    { tag: "reaction screening", title: "Reaction screening & optimization", desc: "Parallel small-scale trials to identify the best synthetic route fast." },
    { tag: "crystallization studies", title: "Crystallization & polymorph studies", desc: "Controlled cooling and seeding profiles for reproducible crystal form." },
    { tag: "material characterization", title: "Material characterization by FT-IR", desc: "Rapid identity confirmation for raw materials and novel compounds." },
    { tag: "thermal analysis", title: "Thermal stability analysis", desc: "DSC and TGA profiling to understand decomposition and phase behaviour." },
    { tag: "solvent recovery", title: "Anhydrous solvent recovery", desc: "Moisture-free solvent supply for air- and water-sensitive chemistry." },
    { tag: "data documentation", title: "Research data documentation", desc: "Traceable records that carry results from bench to publication." },
  ],
  food: [
    { tag: "material identification", title: "Raw material identification & QC", desc: "Fast FT-IR screening confirms identity before materials enter production." },
    { tag: "composition analysis", title: "Composition & purity analysis", desc: "HPLC quantification of actives, additives, and contaminants." },
    { tag: "moisture content", title: "Moisture content determination", desc: "Karl Fischer and loss-on-drying methods for shelf-life assurance." },
    { tag: "authenticity testing", title: "Authenticity & adulteration testing", desc: "Detect substitution and adulteration against reference profiles." },
    { tag: "solvent extraction", title: "Solvent extraction & recovery", desc: "Concentrate extracts and recover solvents during sample preparation." },
    { tag: "formulation weighing", title: "Formulation weighing & QC", desc: "Precision balances for accurate batching and quality release testing." },
  ],
  environmental: [
    { tag: "water quality", title: "Water quality & effluent testing", desc: "Multi-parameter analysis for discharge compliance and process water monitoring." },
    { tag: "microplastics", title: "Microplastics screening", desc: "FT-IR and microscopy-based identification of microplastic contamination." },
    { tag: "trace metals", title: "Trace & heavy metal analysis", desc: "ICP and AAS methods for regulatory-grade metal quantification." },
    { tag: "air quality", title: "Air quality monitoring", desc: "Particulate and volatile compound sampling for ambient and stack testing." },
    { tag: "soil contamination", title: "Soil & sediment contamination studies", desc: "Extraction and analysis of persistent organic pollutants and metals." },
    { tag: "sample preservation", title: "Sample preservation & cold storage", desc: "Reliable low-temperature storage for time-sensitive environmental samples." },
  ],
  chemical: [
    { tag: "purity analysis", title: "Purity & composition analysis", desc: "Chromatographic and spectroscopic methods for feedstock and product QC." },
    { tag: "process control", title: "In-process quality control", desc: "Real-time monitoring that keeps production runs within specification." },
    { tag: "distillation", title: "Distillation & solvent recovery", desc: "Efficient separation and recovery across the process chain." },
    { tag: "viscosity", title: "Viscosity & rheology testing", desc: "Flow behaviour characterization for formulation and process design." },
    { tag: "corrosion testing", title: "Corrosion & material compatibility", desc: "Assessing material resistance under process chemical exposure." },
    { tag: "batch documentation", title: "Batch release documentation", desc: "Traceable QC records supporting release and compliance." },
  ],
  academic: [
    { tag: "teaching labs", title: "Teaching lab instrumentation", desc: "Rugged, easy-to-operate instruments built for high-throughput student use." },
    { tag: "research grants", title: "Grant-funded research equipment", desc: "Instrumentation sized and specified to funding scope and timelines." },
    { tag: "thesis analytics", title: "Thesis & publication-grade analytics", desc: "Precision measurement that stands up to peer review." },
    { tag: "shared facilities", title: "Interdisciplinary shared facilities", desc: "Multi-user platforms serving chemistry, biology, and materials departments." },
    { tag: "student training", title: "Student training & method development", desc: "Hands-on protocols that build analytical skill alongside results." },
    { tag: "equipment amc", title: "Equipment AMC & calibration", desc: "Scheduled maintenance that keeps departmental instruments audit-ready." },
  ],
  materials: [
    { tag: "surface characterization", title: "Surface characterization", desc: "Topography and composition analysis at micro and nanoscale." },
    { tag: "particle sizing", title: "Particle size & distribution analysis", desc: "Laser diffraction and imaging methods for powders and suspensions." },
    { tag: "structural analysis", title: "Structural & crystallographic analysis", desc: "Phase identification and structural confirmation for novel materials." },
    { tag: "thermal properties", title: "Thermal property characterization", desc: "DSC and TGA profiling of stability, transitions, and composition." },
    { tag: "nanoparticle synthesis", title: "Nanoparticle synthesis support", desc: "Controlled reaction conditions for reproducible nanomaterial production." },
    { tag: "mechanical testing", title: "Mechanical & tribological testing", desc: "Hardness, wear, and friction measurement for material qualification." },
  ],
  clinical: [
    { tag: "molecular diagnostics", title: "Molecular diagnostics", desc: "PCR and sequencing-ready workflows for accurate pathogen and marker detection." },
    { tag: "clinical sample prep", title: "Clinical sample preparation", desc: "Standardized extraction and homogenization ahead of downstream assays." },
    { tag: "immunoassay", title: "Immunoassay & biomarker testing", desc: "Sensitive detection platforms for diagnostic and research biomarkers." },
    { tag: "cold chain", title: "Cold chain sample storage", desc: "Ultra-low temperature storage protecting sample integrity." },
    { tag: "calibration compliance", title: "Calibration & compliance documentation", desc: "Audit-ready records supporting diagnostic lab accreditation." },
    { tag: "point of care", title: "Point-of-care testing support", desc: "Compact, reliable instrumentation for decentralized testing sites." },
  ],
};

export const achievements = [
  { num: "1985", label: "Founded by Mr. S. Balu" },
  { num: "14", label: "Branch offices pan-India" },
  { num: "45+", label: "Global principal brands" },
  { num: "HYD", label: "Headquartered in Hyderabad" },
];

export const testimonials = [
  {
    quote:
      "Best service provided by Inkarp. Service engineer response toward the equipment is very good and our Heidolph rotary evaporator has been functioning smoothly without any interruptions — fully satisfied.",
    name: "Anil Pasunuti",
    role: "Inkarp Customer",
  },
  {
    quote:
      "Inkarp supplied and installed their Labstation-i four-port glovebox in our lab. Their service is on time, professional, and top notch. So far, so smooth.",
    name: "Omprakash Kushwaha",
    role: "Inkarp Customer",
  },
  {
    quote:
      "Mr. Jerbin is the service person visiting our lab. He is very helpful and always ready to assist. His service is very appreciable — we are very satisfied and happy.",
    name: "Renitta Benny",
    role: "Inkarp Customer",
  },
];

export const featuredProducts = [
  { cat: "pharma", tag: "HPLC System", name: "Alliance HPLC System", brand: "Waters", spec: "Impurity profiling & dissolution release testing", avail: "In stock — pan-India", quoteQuery: "waters" },
  { cat: "pharma", tag: "Karl Fischer", name: "Titroline KF Titrator", brand: "Mettler Toledo", spec: "Moisture content to ICH Q3D limits", avail: "Ships in 2 weeks", quoteQuery: "mettler" },
  { cat: "biotech", tag: "Bioreactor", name: "Orbital Shaking Incubator", brand: "Heidolph", spec: "Cell line development & bioprocess monitoring", avail: "In stock — pan-India", quoteQuery: "heidolph" },
  { cat: "biotech", tag: "Purification", name: "Chromatography Workstation", brand: "Buchi", spec: "Protein purification & biomolecule recovery", avail: "Ships in 2 weeks", quoteQuery: "buchi" },
  { cat: "rnd", tag: "Reaction Screening", name: "Parallel Synthesis Platform", brand: "Radleys", spec: "Reaction screening & route optimization", avail: "In stock — pan-India", quoteQuery: "radleys" },
  { cat: "rnd", tag: "Thermal Analysis", name: "DSC/TGA Analyzer", brand: "Hitachi", spec: "Thermal stability & decomposition profiling", avail: "Ships in 2 weeks", quoteQuery: "hitachi" },
  { cat: "food", tag: "FT-IR", name: "FT-IR Spectrometer", brand: "Bruker", spec: "Raw material identification & authenticity testing", avail: "In stock — pan-India", quoteQuery: "bruker" },
  { cat: "food", tag: "Precision Balance", name: "Analytical Balance", brand: "Sartorius", spec: "Formulation weighing & QC release testing", avail: "Ships in 2 weeks", quoteQuery: "sartorius" },
];
