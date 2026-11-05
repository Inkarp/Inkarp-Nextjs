// Which products have a line drawing of their instrument at work. It is shown
// as a live diagram beside the workflow section's title
// (src/components/products/sections/WorkflowDiagram.jsx; the drawings:
// src/components/products/sections/workflow-diagrams/), lighting up the part
// that does the active step. Products without a drawing keep the plain
// workflow cards.

// By brand, then category: one line switches on every product in a category.
// Only list a category when every step of its products lights a part.
const WORKFLOW_DRAWINGS = {
  "Advion Interchim Scientific": {
    "AVANT (U)HPLC": "lc-system",
    "Expression CMS": "mass-spec",
    "Flash Purification Systems": "flash-system",
    "Preparative Purification Systems": "flash-system",
    "Solation ICP-MS": "mass-spec",
    "TriVersa NanoMate": "nanospray-robot",
  },
  "Affinite Instruments": {
    "Compact Surface Plasmon Resonance (SPR) Systems": "spr",
  },
  "Ametek Brookfield": {
    "Laboratory Viscometers": "rotational-viscometer",
    "Moisture Analyzers": "moisture-analyzer",
    "Powder Flow Testers": "powder-flow-tester",
    Rheometers: "rotational-viscometer",
    "Texture Analyzers": "texture-analyzer",
  },
  Bandelin: {
    "Ultrasonic Baths": "ultrasonic-bath",
  },
  Bruker: {
    "FT-IR Gas Analyzer": "process-spectrometer",
    "FT-IR Microscopes": "spectral-microscope",
    "FT-IR Research Spectrometers": "ft-spectrometer",
    "FT-IR Spectrometer": "ft-spectrometer",
    "FT-NIR Spectrometer": "ft-spectrometer",
    "Process Monitoring Spectrometer": "process-spectrometer",
    "Raman Microscopes": "spectral-microscope",
    "Raman Spectrometer": "ft-spectrometer",
  },
  Buchi: {
    "Freeze Dryer (Lyophilizer)": "freeze-dryer",
  },
  "BWB Technologies": {
    "Flame Photometers": "flame-photometer",
  },
  Chemspeed: {
    "Automated Extraction (QuEChERS)": "automation-platform",
    "Automated Synthesis for Innovative Medicines": "automation-platform",
    "Crystal Benchtop Solution": "automation-platform",
  },
  "Dara-Lyo": {
    "Pilot Freeze Dryers": "freeze-dryer",
  },
  ECOM: {
    "PLC Industrial Systems": "flash-system",
  },
  "FOM Technologies": {
    "Roll-to-Roll Slot-Die Coating Systems": "roll-coater",
    "Sheet-Based Slot-Die Coating Systems": "sheet-coater",
  },
  GEA: {
    "Industrial Homogenizers": "pressure-homogenizer",
    "Laboratory Homogenizers": "pressure-homogenizer",
  },
  Heidolph: {
    "Rotary Evaporators": "rotary-evaporator",
    "Large Scale Rotary Evaporators": "rotary-evaporator",
    "Magnetic Stirrers": "hotplate-stirrer",
    "Overhead Stirrers": "overhead-stirrer",
    "Peristaltic Pumps": "peristaltic-pump",
    "Shakers & Mixers": "orbital-shaker",
    "Vacuum Pumps": "vacuum-pump",
  },
  "Hohsen Corp": {
    "Equipment For Battery": "coin-cell-crimper",
  },
  Implen: {
    NanoPhotometer: "uv-vis",
    "OD 600": "uv-vis",
  },
  "Inkarp USB": {
    "Ultrasonic Cleaners & Baths": "ultrasonic-bath",
  },
  Kubota: {
    "General Purpose Centrifuges": "centrifuge",
    "Laboratory Centrifuges": "centrifuge",
    "Large Laboratory Centrifuges": "centrifuge",
  },
  "Labstation i": {
    "Solvent Purification Systems": "solvent-purifier",
  },
  Luzchem: {
    "Laser Flash Photolysis": "flash-photolysis",
    "LED Illuminator": "photoreactor",
    "Solar Simulators (300–800 nm)": "photoreactor",
    "Well Plate Illuminator": "photoreactor",
  },
  Maccor: {
    "Battery And Cell Test Equipment": "battery-cycler",
  },
  "Mettler Toledo": {
    "Weighing Balances": "balance",
    "pH Meters": "ph-meter",
    Titrators: "titrator",
    "Density Meter": "density-meter",
    "Moisture Analyzers": "moisture-analyzer",
    "UV/VIS Spectrophotometers": "uv-vis",
  },
  Nanalysis: {
    "Automation / Sample Handling (NMR)": "nmr-autosampler",
    "Benchtop NMR": "benchtop-nmr",
    "NMR Spectroscopy / Analysis": "benchtop-nmr",
  },
  Nanosurf: {
    Industry: "afm",
    Integration: "afm",
    Research: "afm",
  },
  "NenoVision s.r.o.": {
    Litescope: "afm",
  },
  "Photon ETC": {
    "Area Scan Imaging": "hyperspectral-imager",
    "eSWIR Cameras": "hyperspectral-imager",
    "Linescan Cameras": "hyperspectral-imager",
    Microscopy: "hyperspectral-imager",
    "NIR-I & NIR-II Preclinical Imaging": "hyperspectral-imager",
    "Plate Readers": "hyperspectral-imager",
    "SWIR Cameras": "hyperspectral-imager",
  },
  PolyScience: {
    Chillers: "circulator",
    "Circulating Baths": "circulator",
    "Water Baths": "water-bath",
  },
  ProScientific: {
    "Automated Homogenizer": "homogenizer",
    "Digital Benchtop Homogenizers": "homogenizer",
    "Digital Homogenizer": "homogenizer",
    "Hand-Held Rotor-Stator Homogenizers": "homogenizer",
    "Programmable Benchtop Homogenizers": "homogenizer",
  },
  Radleys: {
    "Automated Reaction Stations": "parallel-reactor",
    "Benchtop and Hotplate Tools": "reaction-workstation",
    "Jacketed Lab Reactors": "jacketed-reactor",
    "Parallel Reaction Stations": "parallel-reactor",
  },
  "Reichert Technologies": {
    "High-Sensitivity Surface Plasmon Resonance (SPR) Systems": "spr",
  },
  "Robot Coupe": {
    "Blixer Systems (Fine Homogenization for Semi-Solid Samples)": "blixer",
  },
  Sartorius: {
    "Arium Advance": "water-purifier",
    "Arium Comfort": "water-purifier",
    "Arium Mini Plus": "water-purifier",
    "Arium Pro": "water-purifier",
  },
  "SBT Instruments": {
    "Bacteria Enumeration Systems": "bacteria-counter",
  },
  "Sonics & Materials": {
    "Laboratory Scale Models, Volume 150 µL to 150 mL": "probe-sonicator",
    "Laboratory Scale Models, Volume 200 µL to 1 L": "probe-sonicator",
    "Laboratory Scale Models, Volume 200 µL to 2 L": "probe-sonicator",
    "Ultrasonic Probe Sonicators": "probe-sonicator",
    "Ultrasonic Probe Sonicators (Production Scale)": "probe-sonicator",
  },
  "Sp Genevac": {
    "Benchtop Evaporators": "centrifugal-evaporator",
    "Centrifugal Evaporators": "centrifugal-evaporator",
  },
  ThalesNano: {
    "H Cube Systems": "flow-reactor",
    "Hydrogen Gas Generators": "hydrogen-generator",
    "Phoenix Flow Systems": "flow-reactor",
    "PhotoCube™": "flow-reactor",
  },
  "ThermoFisher Scientific": {
    Viscometers: "falling-ball-viscometer",
  },
  Waters: {
    "Chromatography and LC-MS Systems": "lc-system",
    "LC-MS Systems (High Sensitivity, Regulatory Compliant)": "mass-spec",
    UPLC: "lc-system",
  },
  Zeiss: {
    "Upright Microscopes": "microscope-upright",
    "Inverted Microscopes": "microscope-inverted",
    "Stereo Microscopes": "microscope-stereo",
    "SteREO Discovery Family": "microscope-stereo",
    "Zoom Microscopes": "microscope-stereo",
    "Automated Microscopy Systems": "slide-scanner",
  },
};

// Single products that differ from the rest of their category: a kind, or
// null to keep the drawing off (their steps don't match it).
const WORKFLOW_DRAWING_BY_SLUG = {
  // Continuous-feed rotavap: the lab drawing plus a feed line and a
  // discharge valve.
  "large-scale-hei-volume-distimatic-pro": "industrial-rotavap",
  // Sealed-vial vapour analyzer, not a pan and halogen lamp.
  "computrac-vapor-pro-xl-moisture-analyzer": "vapour-moisture-analyzer",
  // Fully digital (no eyepieces): observed on its screen.
  "smart-zoom-5-microscope": "digital-microscope",
  // Heidolph stirrers without heating.
  "hei-mix-s-magnetic-stirrer": "magnetic-stirrer",
  "hei-plate-mix-20-l-magnetic-stirrer": "magnetic-stirrer",
  // Heidolph "Shakers & Mixers" that aren't orbital shakers.
  "duomax-1030-rocking-shaker": "rocking-shaker",
  "hei-shake-rock-core-2000-rocking-shaker": "rocking-shaker",
  "hei-shake-rock-core-rocking-shaker": "rocking-shaker",
  "hei-shake-wave-core-2000-3d-shaker": "wave-shaker",
  "hei-shake-wave-core-3d-shaker": "wave-shaker",
  "titramax-100-vibrating-shaker": "plate-shaker",
  "titramax-1000-vibrating-shaker": "plate-shaker",
  "titramax-101-vibrating-shaker": "plate-shaker",
  "reax-control-vortex-mixer": "vortex-mixer",
  "reax-top-vortex-mixer": "vortex-mixer",
  // Multi-tube vortexer: a rack of tubes, not a single tube on a cup.
  "multi-reax-vortex-mixer": "multi-tube-vortexer",
  // Handheld Raman, not a benchtop spectrometer.
  "bravo-handheld-raman-spectrometer": "handheld-raman",
  // Radleys products that differ from the rest of their category.
  "breeze-heating-cooling-work-station": "reaction-workstation",
  "greenhouse-work-up-station": "reaction-workstation",
  "storm-heating-cooling-work-station": "reaction-workstation",
  "greenhouse-blowdown-evaporator": "blowdown-evaporator",
  "tornado-overhead-stirring-system": "overhead-stirrer",
  "heat-on-block-system": "heat-block",
  "findenser-super-air-condenser": "air-condenser",
  // ThermoFisher's rotational viscometer (the category draws the falling-ball one).
  "rotational-viscometers": "rotational-viscometer",
  // Hohsen's slurry mixer, among its coin-cell crimpers.
  "mixing-machine": "slurry-mixer",
  // The Titramax Package's shaker is the Titramax 1000 (plate shaker).
  "titramax-package-orbital-platform-shaker": "plate-shaker",
  // Steps the drawing has no part for (laser excitation, illumination,
  // locating, saving; the PRO400PCEL's stand, program and record): plain cards.
  lima: null,
  rima: null,
  lightir: null,
  "pro400pcel-programmable-benchtop-homogenizer": null,
};

// The same drawing faint in the page background (HeroDrawing.jsx), switched
// off 2 Nov 2026: the manager did not like it across the page. true brings
// it back as it was (only the rotary evaporator is drawn for it).
const HERO_DRAWINGS = {
  "hei-vap-core-rotary-evaporator": "rotary-evaporator",
};
const SHOW_HERO_DRAWINGS = false;

// The live diagram in the workflow section (approved 2 Nov 2026).
const SHOW_WORKFLOW_DIAGRAMS = true;

export function getWorkflowDiagramKind(product) {
  if (!SHOW_WORKFLOW_DIAGRAMS || !product) return null;
  if (product.slug in WORKFLOW_DRAWING_BY_SLUG) return WORKFLOW_DRAWING_BY_SLUG[product.slug];
  return WORKFLOW_DRAWINGS[product.principalName]?.[product.category] ?? null;
}

export function getHeroDrawingKind(slug) {
  return SHOW_HERO_DRAWINGS ? HERO_DRAWINGS[slug] ?? null : null;
}
