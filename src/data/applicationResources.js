const BASE = "/assets/application-resources";

// `exactTitle` (optional) is the article's title as printed in the PDF, for
// titles a file name can't hold (UV/VIS, Fluorine-19, ™). Without it the title
// is read from the file name.
function resource(volume, issue, filename, exactTitle) {
  const title =
    exactTitle ??
    filename
      .replace(/\.pdf$/i, "")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const url = `${BASE}/${volume}/${issue}/${filename}`;

  return {
    id: `${volume}-${issue}-${filename}`,
    title,
    volume,
    issue,
    group: `${volume.replace("-", " ")} / ${issue.replace("-", " ")}`,
    url,
    // First page as an image, saved next to the PDF with the same name.
    thumbUrl: url.replace(/\.pdf$/i, ".webp"),
  };
}

export const applicationResources = [
  // Volume 1 / Issue 01
  resource("Volume-1", "Issue-01", "Automated-synthesis-of-a-triazole-library-in-Chemspeed-FLEX-Isynth.pdf"),
  resource("Volume-1", "Issue-01", "Catalyst-screening-and-DOE-optimization-for-Buchwald-Hartwig-amination-via-Radleys-Mya4-parallel-reaction-station.pdf"),
  resource("Volume-1", "Issue-01", "Mid-IR-Spectroscopic-reaction-monitoring-using-Bruker-Alpha-II-FT-IR-spectrometer.pdf"),
  resource("Volume-1", "Issue-01", "Precise-determination-of-potassium-and-sodium-via-BWB-Flame-Photometer.pdf"),
  resource("Volume-1", "Issue-01", "Safe-hydrogenations-on-solid-supported-Rh-catalysts-in-ThalesNano-H-cube-reactor.pdf"),
  resource("Volume-1", "Issue-01", "Safe-reprocessing-of-surgical-instruments-in-Bandelin-SONOREX-ultrasonic-bath.pdf"),
  resource("Volume-1", "Issue-01", "Sustainable-practices-using-Heidolph-Distimatic-rotary-evaporator.pdf"),
  resource("Volume-1", "Issue-01", "Tuning-the-Luzchem-ICH-photoreactor-for-selective-CO2-production.pdf"),

  // Volume 1 / Issue 02
  resource("Volume-1", "Issue-02", "Exploring-a-tissue-sectioning-protocol-with-LICORbios-Odyssey-Imagers.pdf"),
  resource("Volume-1", "Issue-02", "Exploring-cell-based-liquid-biopsy-through-the-RareCyte-platform.pdf"),
  resource("Volume-1", "Issue-02", "Exploring-pre-clinical-reseacrh-with-Photon-etc-NIR-II-Imager.pdf"),
  resource("Volume-1", "Issue-02", "Exploring-the-role-of-Precision-X-Ray-Imaging-in-cancer-biology.pdf"),
  resource("Volume-1", "Issue-02", "Nucleic-acid-quantification-using-the-Implen-NanoPhotometer.pdf"),
  resource("Volume-1", "Issue-02", "Understanding-structure-function-and-host-interaction-of-viruses-in-Nanosurf-AFM-s-WaveMode.pdf"),

  // Volume 1 / Issue 03
  resource("Volume-1", "Issue-03", "Batch-Ethanol-recovery-using-the-Heidolph-Hei-VAP-Industrial-Package.pdf"),
  resource("Volume-1", "Issue-03", "Complement-Flow-Synthesis-with-In-Line-Purification-with-the-with-the-Advion-Interchim-Scientific-puriFlash-5.250-prep-LC-System.pdf"),
  resource("Volume-1", "Issue-03", "Eliminating-background-signals-in-mass-spectroscopy-with-the-Sartorius-Arium-Mini-Plus.pdf"),
  resource("Volume-1", "Issue-03", "High-Pressure-Homogenization-of-Liposomes-in-the-GEA-PandaPLUS-2000.pdf"),
  resource("Volume-1", "Issue-03", "Introducing-the-Temperature-Modulated-DSC-with-Hitachi-NEXTA-DSC200.pdf"),
  resource("Volume-1", "Issue-03", "Purity-and-content-uniformity-testing-of-tadalafil-using-Nanalysis-60-PRO-benchtop-qNMR.pdf"),

  // Volume 1 / Issue 04
  resource("Volume-1", "Issue-04", "Analysis-of-battery-components-using-Nenovision-s-AFM-in-SEM-LiteScope.pdf"),
  resource("Volume-1", "Issue-04", "Evaluation-of-Recycled-Polymers-by-Thermal-Analysis.pdf"),
  resource("Volume-1", "Issue-04", "Fully-Automated-High-Throughput-Battery-Development-using-the-Chemspeed-FLEXSHUTTLE.pdf"),
  resource("Volume-1", "Issue-04", "In-situ-electrochemical-study-using-a-Bruker-VERTEX-80-FT-IR-Spectrometer.pdf"),
  resource("Volume-1", "Issue-04", "Nanosurfs-AFM-Solutions-for-Graphene-Research.pdf"),
  resource("Volume-1", "Issue-04", "Potentiometric-Titration-in-the-Mettler-Toledo-Titration-Excellence-T5.pdf"),
  resource("Volume-1", "Issue-04", "Rheological-Characterisation-of-Polymers-using-the-Thermo-Scientific-HAAKE-MARS-Rheometer.pdf"),
  resource("Volume-1", "Issue-04", "Understanding-Metallic-Structures-with-Zeiss-Microscopy-Solutions.pdf"),

  // Volume 1 / Issue 05
  resource("Volume-1", "Issue-05", "Analysis-of-Aqueous-Matrices-using-the-Waters-Xevo-TQ-MS.pdf"),
  resource("Volume-1", "Issue-05", "Contamination-to-Compliance-The-Role-of-Sartorius-Lab-Water-System-in-PFAS-Detection.pdf"),
  resource("Volume-1", "Issue-05", "DSC-Measurement-of-Polypropylene-Using-the-Hitachi-NEXTA-DSC-200.pdf"),
  resource("Volume-1", "Issue-05", "Deprotection-Reactions-Using-the-ThalesNano-H-Cube-Continuous-Flow-Reactor.pdf"),
  resource("Volume-1", "Issue-05", "FT-IR-Spectroscopy-in-Ultrahigh-Vacuum.pdf"),
  resource("Volume-1", "Issue-05", "Freeze-drying-of-Active-Pharmaceutical-Ingredients.pdf"),
  resource("Volume-1", "Issue-05", "On-line-TLCCMS-technique-using-the-Advion-Interchim-Scientific-expression-CMS.pdf"),
  resource("Volume-1", "Issue-05", "Optimised-Kjeldahl-analysis-with-the-Buchi-KjelMaster.pdf"),

  // Volume 1 / Issue 06
  resource("Volume-1", "Issue-06", "3D-Fluorescence-Imaging-with-Structured-Illumination-with-ZEISS-Widefield-Fluorescence-Microscopes.pdf"),
  resource("Volume-1", "Issue-06", "A-Robust-LC-MSMS-Method-Utilizing-the-Waters-Xevo-TQ-XS-Mass-Spectrometer.pdf"),
  resource("Volume-1", "Issue-06", "Detection-of-Adulterants-in-Morphine-Sulphate-Solutions-Using-the-Implen-UV-Vis-NanoPhotometer.pdf"),
  resource("Volume-1", "Issue-06", "High-speed-in-vivo-imaging-of-a-zebrafish-heart-using-the-Lambert-HiCAM-Fluo.pdf"),
  resource("Volume-1", "Issue-06", "Live-Cell-Imaging-and-Manipulation-with-Nanosurf-Bio-AFM.pdf"),
  resource("Volume-1", "Issue-06", "Preclinical-Imaging-and-Radiation-Therapy-with-Precision-X-Ray-SmART-adn-X-Rad-systems.pdf"),
  resource("Volume-1", "Issue-06", "Using-Reichert-Surface-Plasmon-Resonance-SPR-for-Screening-of-Small-Molecule-Inhibitors.pdf"),

  // Volume 2 / Issue 01
  resource("Volume-2", "Issue-01", "Ensuring-Nucleic-Acid-Quality-for-Reliable-Research-Outcomes-Using-the-Implen-NanoPhotometer.pdf"),
  resource("Volume-2", "Issue-01", "Fast-non-destructive-microanalysis-in-drug-development-using-the-Bruker-FT-IR.pdf"),
  resource("Volume-2", "Issue-01", "Improving-Process-Control-and-Reproducibility-with-Radleys-Reactors-for-Scalabale-mRNA-Synthesis.pdf"),
  resource("Volume-2", "Issue-01", "Nitrogen-and-Protein-Determination-in-Rice-Using-the-Buchi-KjelLine.pdf"),
  resource("Volume-2", "Issue-01", "Pure-Water-Pure-Outcome-Powering-Cell-Cultures-with-Sartorius-Arium-Ultrapure-Water.pdf"),

  // Volume 2 / Issue 02
  resource("Volume-2", "Issue-02", "Enhancing-2D-Gel-Electrophoresis-Results-with-Sartorius-Ultrapure-Water.pdf"),
  resource("Volume-2", "Issue-02", "Fighting-Food-Fraud-With-Bruker-FT-NIR-for-Adulterant-Screening.pdf"),
  resource("Volume-2", "Issue-02", "Mechanistic-Insights-into-PP1-Enzyme-Binding-Mechanism-on-the-Reichert-4SPR.pdf"),
  resource("Volume-2", "Issue-02", "Studying-effects-of-molecular-weight-on-glass-transition-using-Hitachi-NEXTA-DSC.pdf"),
  resource("Volume-2", "Issue-02", "ThalesNano-Solutions-in-Nanoparticle-Catalysis-for-Flow-Chemistry.pdf"),

  // Volume 2 / Issue 03
  resource("Volume-2", "Issue-03", "Advancing-drug-discovery-through-rapid-high-resolution-visualization-of-organoids-and-spheroids-with-LICORbio-ATLAS-IMAGER.pdf"),
  resource("Volume-2", "Issue-03", "Fast-tracking-quality-assessment-in-omega-3-production-lines-using-Bruker-FT-NIR-analyzers.pdf"),
  resource("Volume-2", "Issue-03", "Lyophilisation-of-Apples-with-the-BUCHI-Lyovapor-L-200.pdf"),
  resource("Volume-2", "Issue-03", "Mapping-the-Nanoscale-Organization-of-Long-Chain-Alkanes-Using-the-Nanosurf-DriveAFM.pdf"),
  resource("Volume-2", "Issue-03", "The-Role-of-Sartorius-Lab-Water-System-in-Reduction-of-the-Microplastic-Content-in-Ultrapure-Water.pdf"),

  // Volume 2 / Issue 04
  resource("Volume-2", "Issue-04", "Boosting-Food-Production-Efficiency-with-Mettler-Toledo-Lean-Principles-in-Moisture-Determination.pdf"),
  resource("Volume-2", "Issue-04", "Bruker-ALPHA-II-FTIR-for-Rapid-Reliable-Material-Verification-in-Modern-QC-Labs.pdf"),
  resource("Volume-2", "Issue-04", "Non-destructive-insight-into-formulation-quality-and-efficacy-enabled-by-ZEISS-X-ray-microscopy-and-AI.pdf"),
  resource("Volume-2", "Issue-04", "Reducing-cost-per-analysis-for-Kjeldahl-Nitrogen-Determination-Using-BUCHI-Reaction-Detection-Sensor-Technology.pdf"),
  resource("Volume-2", "Issue-04", "The-Role-of-Ultrapure-Water-for-HPLC-Analysis-enabled-by-the-Sartorius-Arium-Water-Purification-System.pdf"),

  // Volume 2 / Issue 05
  resource("Volume-2", "Issue-05", "IR-Spectroscopic-analysis-of-polymer-fillers-and-compatibilizers-with-the-Bruker-Alpha-II-FTIR-Spectrometer.pdf"),
  resource("Volume-2", "Issue-05", "Measurement-of-moisture-and-dry-content-in-paints-with-Mettler-Toledo-Halogen-Moisture-Analyzers.pdf"),
  resource("Volume-2", "Issue-05", "Rheological-characterization-of-chocolate-for-processing-and-quality-control-with-the-Brookfield-AMETEK-Viscometer.pdf"),
  resource("Volume-2", "Issue-05", "Surface-roughness-determination-by-Nanosurf-AFM.pdf"),
  resource("Volume-2", "Issue-05", "The-use-of-organic-solvents-in-BUCHI-laboratory-freeze-dryers.pdf"),

  // Volume 3 / Issue 02 (CATALYSTCue, October 2026)
  resource("Volume-3", "Issue-02", "Authenticity-Testing-of-Spirits-in-the-Implen-UV-VIS-NanoPhotometer.pdf", "Authenticity testing of spirits in the Implen UV/VIS NanoPhotometer®"),
  resource("Volume-3", "Issue-02", "Automating-Eluent-Preparation-with-the-Chemspeed-FLEX-EP.pdf", "Preparing for the Run: Automating eluent preparation for modern analytical workflows"),
  resource("Volume-3", "Issue-02", "Engineering-the-Journey-Between-Drug-and-Disease.pdf", "Engineering the Journey Between Drug and Disease"),
  resource("Volume-3", "Issue-02", "Fluorine-19-NMR-for-Pesticide-Analysis-with-Nanalysis-Benchtop-NMR-Spectrometers.pdf", "Fluorine-19 NMR for Pesticide Analysis with Nanalysis Benchtop NMR Spectrometers"),
  resource("Volume-3", "Issue-02", "Glycoprotein-Detection-with-the-LICORbio-Odyssey-Infrared-Imaging-System.pdf", "Glycoprotein Detection with the LICORbio™ Odyssey® Infrared Imaging System"),
  resource("Volume-3", "Issue-02", "NenoVision-LiteScope-for-Correlative-Semiconductor-Failure-and-Defect-Analysis.pdf", "NenoVision’s LiteScope™ for Correlative Semiconductor Failure and Defect Analysis"),
  resource("Volume-3", "Issue-02", "Polymer-Characterization-Through-Thermal-Analysis-with-Hitachi.pdf", "Polymer Characterization Through Thermal Analysis"),
  resource("Volume-3", "Issue-02", "Rapid-Polymer-Identification-Using-the-Bruker-ALPHA-II-FTIR-Spectrometer.pdf", "Rapid Polymer Identification Using the Bruker ALPHA II FTIR Spectrometer"),
  resource("Volume-3", "Issue-02", "Sensitive-Arsenic-Speciation-in-Water-Using-Advion-HPLC-ICP-MS.pdf", "Sensitive Arsenic Speciation in Water Using Advion HPLC-ICP-MS"),
  resource("Volume-3", "Issue-02", "Simultaneous-Analysis-of-Monovalent-and-Divalent-Cations-Using-the-Shodex-IC-YS-50-Columns.pdf", "Simultaneous Analysis of Monovalent and Divalent Cations at a higher sensitivity using the Shodex™ IC YS-50 columns"),
  resource("Volume-3", "Issue-02", "Structured-Illumination-in-Fluorescence-Microscopy-with-the-ZEISS-ApoTome.pdf", "Structured Illumination in Fluorescence Microscopy: ApoTome Imaging System"),
  resource("Volume-3", "Issue-02", "The-Art-of-pH-Measurement-with-Mettler-Toledo.pdf", "The Art of pH Measurement"),
  resource("Volume-3", "Issue-02", "Transfer-of-Cell-Culture-Media-Method-to-the-Waters-Xevo-G3-QTof-Mass-Spectrometer.pdf", "Transfer of Cell Culture Media Method to Xevo™ G3 QTof Mass Spectrometer and Refinement of Parameters for Labile Amino Acids"),
  resource("Volume-3", "Issue-02", "Understanding-PFAS-Complexity-with-Advion-Interchim-Scientific.pdf", "Understanding PFAS Complexity with Advion Interchim Scientific"),
];

export const volumeOptions = [...new Set(applicationResources.map((r) => r.volume))];

export function getIssueOptions(volume) {
  const filtered = volume
    ? applicationResources.filter((r) => r.volume === volume)
    : applicationResources;
  return [...new Set(filtered.map((r) => r.issue))];
}
