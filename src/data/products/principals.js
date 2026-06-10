import {
  getProductDetailByPrincipalAndSlug,
  getProductDetailBySlug,
} from "./productDetails";

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function getProductTaxonomy(productName, detail) {
  const name = productName.toLowerCase();

  if (detail?.applications?.length) {
    return {
      industry: detail.category ?? "Research and Analytical Labs",
      applications: detail.applications,
    };
  }

  if (
    name.includes("chromatography") ||
    name.includes("hplc") ||
    name.includes("lc-ms") ||
    name.includes("columns") ||
    name.includes("fraction")
  ) {
    return {
      industry: "Chromatography and Separation",
      applications: [
        "Analytical testing",
        "Purification",
        "Method development",
      ],
    };
  }

  if (
    name.includes("battery") ||
    name.includes("cell") ||
    name.includes("electrode")
  ) {
    return {
      industry: "Battery and Energy Research",
      applications: [
        "Battery testing",
        "Cell development",
        "Material research",
      ],
    };
  }

  if (
    name.includes("imaging") ||
    name.includes("microscope") ||
    name.includes("spectrometer") ||
    name.includes("spectrophotometer") ||
    name.includes("raman") ||
    name.includes("nmr")
  ) {
    return {
      industry: "Spectroscopy and Imaging",
      applications: [
        "Material characterization",
        "Research analysis",
        "Quality testing",
      ],
    };
  }

  if (
    name.includes("incubator") ||
    name.includes("biosafety") ||
    name.includes("laminar") ||
    name.includes("microbial") ||
    name.includes("bacteria")
  ) {
    return {
      industry: "Life Sciences and Microbiology",
      applications: [
        "Cell culture",
        "Microbiology",
        "Contamination control",
      ],
    };
  }

  if (
    name.includes("reactor") ||
    name.includes("flow chemistry") ||
    name.includes("hydrogen") ||
    name.includes("pilot")
  ) {
    return {
      industry: "Chemistry and Process Development",
      applications: [
        "Chemical synthesis",
        "Process development",
        "Scale-up studies",
      ],
    };
  }

  if (
    name.includes("centrifuge") ||
    name.includes("bath") ||
    name.includes("shaker") ||
    name.includes("stirrer") ||
    name.includes("oven") ||
    name.includes("freezer")
  ) {
    return {
      industry: "General Laboratory Equipment",
      applications: [
        "Sample preparation",
        "Routine lab workflows",
        "Research laboratories",
      ],
    };
  }

  return {
    industry: "Laboratory and Analytical Instruments",
    applications: [
      "Research laboratories",
      "Quality control",
      "Industrial testing",
    ],
  };
}
export const productPrincipals = [
    {
        "slug":  "heidolph",
        "principalName":  "Heidolph",
        "group":  "G1",
        "productManager":  "Praveen Reddy",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Magnetic Stirrers",
                             "slug":  "magnetic-stirrers"
                         },
                         {
                             "name":  "Overhead Stirrers",
                             "slug":  "overhead-stirrers"
                         },
                         {
                             "name":  "Orbital Shakers",
                             "slug":  "orbital-shakers"
                         },
                         {
                             "name":  "Peristaltic Pumps",
                             "slug":  "peristaltic-pumps"
                         },
                         {
                             "name":  "Rotary Evaporators",
                             "slug":  "rotary-evaporators"
                         }
                     ]
    },
    {
        "slug":  "radleys",
        "principalName":  "Radleys",
        "group":  "",
        "productManager":  "Praveen Reddy",
        "countryOfOrigin":  "United Kingdom",
        "products":  [
                         {
                             "name":  "Automated Reaction Stations",
                             "slug":  "automated-reaction-stations"
                         },
                         {
                             "name":  "Parallel Reaction Systems",
                             "slug":  "parallel-reaction-systems"
                         },
                         {
                             "name":  "Heat-On Systems",
                             "slug":  "heat-on-systems"
                         },
                         {
                             "name":  "Air Cooled Condensers",
                             "slug":  "air-cooled-condensers"
                         },
                         {
                             "name":  "Pilot Reactors",
                             "slug":  "pilot-reactors"
                         }
                     ]
    },
    {
        "slug":  "rotzmeier",
        "principalName":  "Rotzmeier",
        "group":  "",
        "productManager":  "Praveen Reddy",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Safety Containers",
                             "slug":  "safety-containers"
                         },
                         {
                             "name":  "Safety Cans",
                             "slug":  "safety-cans"
                         },
                         {
                             "name":  "Safety Canisters",
                             "slug":  "safety-canisters"
                         },
                         {
                             "name":  "Safety Barrels",
                             "slug":  "safety-barrels"
                         },
                         {
                             "name":  "Transport Containers",
                             "slug":  "transport-containers"
                         },
                         {
                             "name":  "Safety Funnels",
                             "slug":  "safety-funnels"
                         },
                         {
                             "name":  "Chemical Handling Accessories",
                             "slug":  "chemical-handling-accessories"
                         }
                     ]
    },
    {
        "slug":  "polyscience",
        "principalName":  "PolyScience",
        "group":  "",
        "productManager":  "Praveen Reddy",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Circulating Baths",
                             "slug":  "circulating-baths"
                         },
                         {
                             "name":  "Heated Circulators",
                             "slug":  "heated-circulators"
                         },
                         {
                             "name":  "Cryoprecipitate Baths",
                             "slug":  "cryoprecipitate-baths"
                         },
                         {
                             "name":  "Chillers",
                             "slug":  "chillers"
                         },
                         {
                             "name":  "Recirculating Chillers",
                             "slug":  "recirculating-chillers"
                         },
                         {
                             "name":  "Low Temperature Coolers",
                             "slug":  "low-temperature-coolers"
                         }
                     ]
    },
    {
        "slug":  "vacuubrand",
        "principalName":  "Vacuubrand",
        "group":  "",
        "productManager":  "Praveen Reddy",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Screw Vacuum Pumps",
                             "slug":  "screw-vacuum-pumps"
                         },
                         {
                             "name":  "Rotary Vane Vacuum Pumps",
                             "slug":  "rotary-vane-vacuum-pumps"
                         },
                         {
                             "name":  "Vacuum Controllers",
                             "slug":  "vacuum-controllers"
                         },
                         {
                             "name":  "Vacuum Gauges",
                             "slug":  "vacuum-gauges"
                         },
                         {
                             "name":  "Vacuum Systems",
                             "slug":  "vacuum-systems"
                         }
                     ]
    },
    {
        "slug":  "thalesnano",
        "principalName":  "ThalesNano",
        "group":  "",
        "productManager":  "K. Sreedhar",
        "countryOfOrigin":  "Hungary",
        "products":  [
                         {
                             "name":  "Flow Chemistry Reactors",
                             "slug":  "flow-chemistry-reactors"
                         },
                         {
                             "name":  "Continuous Flow Reactors",
                             "slug":  "continuous-flow-reactors"
                         },
                         {
                             "name":  "Hydrogenation Flow Reactors",
                             "slug":  "hydrogenation-flow-reactors"
                         },
                         {
                             "name":  "Hydrogen Generators",
                             "slug":  "hydrogen-generators"
                         },
                         {
                             "name":  "Photochemistry Reactors",
                             "slug":  "photochemistry-reactors"
                         }
                     ]
    },
    {
        "slug":  "sp-genevac",
        "principalName":  "SP Genevac",
        "group":  "",
        "productManager":  "K. Sreedhar",
        "countryOfOrigin":  "United Kingdom",
        "products":  [
                         {
                             "name":  "Centrifugal Vacuum Evaporators",
                             "slug":  "centrifugal-vacuum-evaporators"
                         },
                         {
                             "name":  "Evaporation Systems",
                             "slug":  "evaporation-systems"
                         },
                         {
                             "name":  "Sample Concentration Systems",
                             "slug":  "sample-concentration-systems"
                         }
                     ]
    },
    {
        "slug":  "bruker",
        "principalName":  "Bruker",
        "group":  "",
        "productManager":  "B. Krishna",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "FT-IR Spectrometers",
                             "slug":  "ft-ir-spectrometers"
                         },
                         {
                             "name":  "FT-NIR Spectrometers",
                             "slug":  "ft-nir-spectrometers"
                         },
                         {
                             "name":  "FT-IR Microscopes",
                             "slug":  "ft-ir-microscopes"
                         },
                         {
                             "name":  "Handheld Raman Spectrometers",
                             "slug":  "handheld-raman-spectrometers"
                         },
                         {
                             "name":  "Gas Analyzers",
                             "slug":  "gas-analyzers"
                         },
                         {
                             "name":  "Process Monitoring Systems",
                             "slug":  "process-monitoring-systems"
                         }
                     ]
    },
    {
        "slug":  "nanalysis",
        "principalName":  "Nanalysis",
        "group":  "G2",
        "productManager":  "M. Madhusudhan",
        "countryOfOrigin":  "Canada",
        "products":  [
                         {
                             "name":  "Benchtop NMR Spectrometers",
                             "slug":  "benchtop-nmr-spectrometers"
                         }
                     ]
    },
    {
        "slug":  "ecom",
        "principalName":  "ECOM",
        "group":  "",
        "productManager":  "M. Madhusudhan",
        "countryOfOrigin":  "Czech Republic",
        "products":  [
                         {
                             "name":  "Analytical HPLC Systems (Modular / Budget-Friendly)",
                             "slug":  "analytical-hplc-systems-modular-budget-friendly"
                         },
                         {
                             "name":  "Preparative HPLC Systems (Entry-Level Scale-Up)",
                             "slug":  "preparative-hplc-systems-entry-level-scale-up"
                         },
                         {
                             "name":  "Chromatography Columns (Analytical \u0026 Prep – Cost Range)",
                             "slug":  "chromatography-columns-analytical-and-prep-cost-range"
                         },
                         {
                             "name":  "Autosamplers (Standalone / Basic Integration)",
                             "slug":  "autosamplers-standalone-basic-integration"
                         },
                         {
                             "name":  "Fraction Collectors (Standalone / Simple Systems)",
                             "slug":  "fraction-collectors-standalone-simple-systems"
                         }
                     ]
    },
    {
        "slug":  "advion-interchim-scientific",
        "principalName":  "Advion Interchim Scientific",
        "group":  "",
        "productManager":  "K. Natesh",
        "countryOfOrigin":  "United States of America \u0026 France",
        "products":  [
                         {
                             "name":  "Mass Spectrometers (Compact \u0026 Single Quadrupole)",
                             "slug":  "mass-spectrometers-compact-and-single-quadrupole"
                         },
                         {
                             "name":  "LC-MS Systems",
                             "slug":  "lc-ms-systems"
                         },
                         {
                             "name":  "Flash Chromatography Systems",
                             "slug":  "flash-chromatography-systems"
                         },
                         {
                             "name":  "Preparative Chromatography Systems",
                             "slug":  "preparative-chromatography-systems"
                         },
                         {
                             "name":  "Chromatography Systems (Analytical \u0026 Preparative)",
                             "slug":  "chromatography-systems-analytical-and-preparative"
                         },
                         {
                             "name":  "Chromatography Columns (Analytical \u0026 Preparative)",
                             "slug":  "chromatography-columns-analytical-and-preparative"
                         },
                         {
                             "name":  "Fraction Collectors",
                             "slug":  "fraction-collectors"
                         }
                     ]
    },
    {
        "slug":  "labomatic",
        "principalName":  "Labomatic",
        "group":  "",
        "productManager":  "M. Madhusudhan",
        "countryOfOrigin":  "Switzerland",
        "products":  [
                         {
                             "name":  "Custom Analytical Chromatography Systems (Application-Specific Design)",
                             "slug":  "custom-analytical-chromatography-systems-application-specific-design"
                         },
                         {
                             "name":  "Custom Preparative Chromatography Systems (Process-Oriented)",
                             "slug":  "custom-preparative-chromatography-systems-process-oriented"
                         },
                         {
                             "name":  "Flash Chromatography Systems (Customized Workflows)",
                             "slug":  "flash-chromatography-systems-customized-workflows"
                         },
                         {
                             "name":  "Process Chromatography Systems (Pilot to Production Scale)",
                             "slug":  "process-chromatography-systems-pilot-to-production-scale"
                         },
                         {
                             "name":  "Skid-Mounted Chromatography Systems (Integrated Process Units)",
                             "slug":  "skid-mounted-chromatography-systems-integrated-process-units"
                         },
                         {
                             "name":  "Multi-Column Chromatography Systems (Continuous Separation)",
                             "slug":  "multi-column-chromatography-systems-continuous-separation"
                         },
                         {
                             "name":  "Fully Integrated Chromatography Platforms (End-to-End Systems)",
                             "slug":  "fully-integrated-chromatography-platforms-end-to-end-systems"
                         },
                         {
                             "name":  "Automation \u0026 Control Systems (PLC / Software Driven)",
                             "slug":  "automation-and-control-systems-plc-software-driven"
                         }
                     ]
    },
    {
        "slug":  "brookfield",
        "principalName":  "Brookfield",
        "group":  "",
        "productManager":  "Varun Bajpai",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Rheometers",
                             "slug":  "rheometers"
                         },
                         {
                             "name":  "Viscometers (Rotational / Viscosity)",
                             "slug":  "viscometers-rotational-viscosity"
                         }
                     ]
    },
    {
        "slug":  "khimod",
        "principalName":  "Khimod",
        "group":  "",
        "productManager":  "M. Madhusudhan",
        "countryOfOrigin":  "France",
        "products":  [
                         {
                             "name":  "Continuous Flow Reactors",
                             "slug":  "continuous-flow-reactors"
                         },
                         {
                             "name":  "Flow Chemistry Reactors",
                             "slug":  "flow-chemistry-reactors"
                         },
                         {
                             "name":  "Hydrogenation Flow Reactors",
                             "slug":  "hydrogenation-flow-reactors"
                         },
                         {
                             "name":  "Heat Exchanger Reactors",
                             "slug":  "heat-exchanger-reactors"
                         },
                         {
                             "name":  "Pilot Plants \u0026 Pilot Reactors",
                             "slug":  "pilot-plants-and-pilot-reactors"
                         }
                     ]
    },
    {
        "slug":  "rotachrom",
        "principalName":  "RotaChrom",
        "group":  "",
        "productManager":  "M. Madhusudhan",
        "countryOfOrigin":  "Hungary",
        "products":  [
                         {
                             "name":  "Centrifugal Partition Chromatography Systems",
                             "slug":  "centrifugal-partition-chromatography-systems"
                         }
                     ]
    },
    {
        "slug":  "hohsen-corp",
        "principalName":  "Hohsen Corp",
        "group":  "G3",
        "productManager":  "K. Sreedhar",
        "countryOfOrigin":  "Japan",
        "products":  [
                         {
                             "name":  "Battery Cell Assembly Systems",
                             "slug":  "battery-cell-assembly-systems"
                         },
                         {
                             "name":  "Electrode Coating Machines",
                             "slug":  "electrode-coating-machines"
                         },
                         {
                             "name":  "Electrode Mixing Systems",
                             "slug":  "electrode-mixing-systems"
                         },
                         {
                             "name":  "Calendering Roll Press Systems",
                             "slug":  "calendering-roll-press-systems"
                         },
                         {
                             "name":  "Coin Cell Crimpers",
                             "slug":  "coin-cell-crimpers"
                         },
                         {
                             "name":  "Winding Machines",
                             "slug":  "winding-machines"
                         }
                     ]
    },
    {
        "slug":  "maccor",
        "principalName":  "Maccor",
        "group":  "",
        "productManager":  "K. Sreedhar",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Battery Cyclers",
                             "slug":  "battery-cyclers"
                         },
                         {
                             "name":  "Battery Test Systems",
                             "slug":  "battery-test-systems"
                         },
                         {
                             "name":  "Battery Environmental Test Chambers",
                             "slug":  "battery-environmental-test-chambers"
                         }
                     ]
    },
    {
        "slug":  "fom-technologies",
        "principalName":  "FOM Technologies",
        "group":  "",
        "productManager":  "K. Sreedhar",
        "countryOfOrigin":  "Denmark",
        "products":  [
                         {
                             "name":  "Roll-to-Roll Slot-Die Coating Systems",
                             "slug":  "roll-to-roll-slot-die-coating-systems"
                         },
                         {
                             "name":  "Sheet-Based Slot-Die Coating Systems",
                             "slug":  "sheet-based-slot-die-coating-systems"
                         },
                         {
                             "name":  "Laboratory-Scale Coating Systems",
                             "slug":  "laboratory-scale-coating-systems"
                         },
                         {
                             "name":  "Pilot-Scale Coating Systems",
                             "slug":  "pilot-scale-coating-systems"
                         },
                         {
                             "name":  "Slot-Die Coating Heads (Steel Series)",
                             "slug":  "slot-die-coating-heads-steel-series"
                         },
                         {
                             "name":  "Slot-Die Coating Heads (PEEK Series)",
                             "slug":  "slot-die-coating-heads-peek-series"
                         },
                         {
                             "name":  "Thin-Film Coating Machines",
                             "slug":  "thin-film-coating-machines"
                         }
                     ]
    },
    {
        "slug":  "labstation-i",
        "principalName":  "Labstation i",
        "group":  "",
        "productManager":  "K. Natesh",
        "countryOfOrigin":  "India",
        "products":  [
                         {
                             "name":  "Glovebox Workstations",
                             "slug":  "glovebox-workstations"
                         },
                         {
                             "name":  "Solvent Purification Systems",
                             "slug":  "solvent-purification-systems"
                         }
                     ]
    },
    {
        "slug":  "luzchem",
        "principalName":  "Luzchem",
        "group":  "G4",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "Canada",
        "products":  [
                         {
                             "name":  "Chamber Photoreactors",
                             "slug":  "chamber-photoreactors"
                         },
                         {
                             "name":  "ICH Photoreactors (Pharma Stability Testing Systems)",
                             "slug":  "ich-photoreactors-pharma-stability-testing-systems"
                         },
                         {
                             "name":  "Computer-Controlled Photoreactors",
                             "slug":  "computer-controlled-photoreactors"
                         },
                         {
                             "name":  "Xenon Photoreactors (Solar Simulation Systems)",
                             "slug":  "xenon-photoreactors-solar-simulation-systems"
                         }
                     ]
    },
    {
        "slug":  "robot-coupe",
        "principalName":  "Robot Coupe",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "France",
        "products":  [
                         {
                             "name":  "High-Speed Laboratory Blenders",
                             "slug":  "high-speed-laboratory-blenders"
                         },
                         {
                             "name":  "Immersion Homogenizers (Handheld High-Shear Mixers)",
                             "slug":  "immersion-homogenizers-handheld-high-shear-mixers"
                         },
                         {
                             "name":  "Cutter Mixers (Sample Preparation Systems)",
                             "slug":  "cutter-mixers-sample-preparation-systems"
                         },
                         {
                             "name":  "Blixer Systems (Fine Homogenization for Semi-Solid Samples)",
                             "slug":  "blixer-systems-fine-homogenization-for-semi-solid-samples"
                         },
                         {
                             "name":  "Sample Preparation Systems (Cutting, Slicing, Size Reduction)",
                             "slug":  "sample-preparation-systems-cutting-slicing-size-reduction"
                         }
                     ]
    },
    {
        "slug":  "bandelin",
        "principalName":  "Bandelin",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Ultrasonic Baths",
                             "slug":  "ultrasonic-baths"
                         }
                     ]
    },
    {
        "slug":  "kubota",
        "principalName":  "Kubota",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "Japan",
        "products":  [
                         {
                             "name":  "Benchtop Centrifuges",
                             "slug":  "benchtop-centrifuges"
                         },
                         {
                             "name":  "High-Speed Refrigerated Centrifuges",
                             "slug":  "high-speed-refrigerated-centrifuges"
                         },
                         {
                             "name":  "Floor-Standing Refrigerated Centrifuges",
                             "slug":  "floor-standing-refrigerated-centrifuges"
                         }
                     ]
    },
    {
        "slug":  "jeiotech",
        "principalName":  "JeioTech",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "South Korea",
        "products":  [
                         {
                             "name":  "Incubators",
                             "slug":  "incubators"
                         },
                         {
                             "name":  "Drying Ovens",
                             "slug":  "drying-ovens"
                         },
                         {
                             "name":  "Vacuum Ovens",
                             "slug":  "vacuum-ovens"
                         },
                         {
                             "name":  "Environmental Chambers",
                             "slug":  "environmental-chambers"
                         },
                         {
                             "name":  "Heated Circulators",
                             "slug":  "heated-circulators"
                         },
                         {
                             "name":  "Orbital Shakers",
                             "slug":  "orbital-shakers"
                         },
                         {
                             "name":  "Refrigerated Shakers",
                             "slug":  "refrigerated-shakers"
                         },
                         {
                             "name":  "Vortex Mixers",
                             "slug":  "vortex-mixers"
                         },
                         {
                             "name":  "Auto Desiccator Cabinets",
                             "slug":  "auto-desiccator-cabinets"
                         }
                     ]
    },
    {
        "slug":  "sonics-and-materials",
        "principalName":  "Sonics \u0026 Materials",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Ultrasonic Probe Sonicators",
                             "slug":  "ultrasonic-probe-sonicators"
                         }
                     ]
    },
    {
        "slug":  "zeiss",
        "principalName":  "Zeiss",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Optical Microscopes",
                             "slug":  "optical-microscopes"
                         },
                         {
                             "name":  "Confocal Microscopes",
                             "slug":  "confocal-microscopes"
                         },
                         {
                             "name":  "Field Emission Scanning Electron Microscopes (FESEM)",
                             "slug":  "field-emission-scanning-electron-microscopes-fesem"
                         }
                     ]
    },
    {
        "slug":  "dara-lyo",
        "principalName":  "Dara-Lyo",
        "group":  "",
        "productManager":  "K. Pavan Kumar",
        "countryOfOrigin":  "Spain",
        "products":  [
                         {
                             "name":  "Pilot Freeze Dryers\nPilot Filling Lines",
                             "slug":  "pilot-freeze-dryers-pilot-filling-lines"
                         }
                     ]
    },
    {
        "slug":  "photon-etc",
        "principalName":  "Photon Etc",
        "group":  "G5",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Canada",
        "products":  [
                         {
                             "name":  "Hyperspectral Imaging Systems",
                             "slug":  "hyperspectral-imaging-systems"
                         },
                         {
                             "name":  "Preclinical Imaging Systems",
                             "slug":  "preclinical-imaging-systems"
                         }
                     ]
    },
    {
        "slug":  "nenovision-s-r-o",
        "principalName":  "NenoVision s.r.o.",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Czech Republic",
        "products":  [
                         {
                             "name":  "AFM-in-SEM Systems",
                             "slug":  "afm-in-sem-systems"
                         }
                     ]
    },
    {
        "slug":  "implen",
        "principalName":  "Implen",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Microvolume UV/VIS Spectrophotometers",
                             "slug":  "microvolume-uv-vis-spectrophotometers"
                         }
                     ]
    },
    {
        "slug":  "lumicks",
        "principalName":  "Lumicks",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Netherlands",
        "products":  [
                         {
                             "name":  "Optical Tweezers Systems",
                             "slug":  "optical-tweezers-systems"
                         }
                     ]
    },
    {
        "slug":  "nanosurf",
        "principalName":  "Nanosurf",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Switzerland",
        "products":  [
                         {
                             "name":  "Atomic Force Microscopes (AFM)",
                             "slug":  "atomic-force-microscopes-afm"
                         }
                     ]
    },
    {
        "slug":  "bwb-technologies",
        "principalName":  "BWB Technologies",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "United Kingdom",
        "products":  [
                         {
                             "name":  "Flame Photometers",
                             "slug":  "flame-photometers"
                         }
                     ]
    },
    {
        "slug":  "reichert-technologies",
        "principalName":  "Reichert Technologies",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "High-Sensitivity Surface Plasmon Resonance (SPR) Systems",
                             "slug":  "high-sensitivity-surface-plasmon-resonance-spr-systems"
                         }
                     ]
    },
    {
        "slug":  "affinite-instruments",
        "principalName":  "Affinite Instruments",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Canada",
        "products":  [
                         {
                             "name":  "Compact Surface Plasmon Resonance (SPR) Systems",
                             "slug":  "compact-surface-plasmon-resonance-spr-systems"
                         }
                     ]
    },
    {
        "slug":  "sbt-instruments",
        "principalName":  "SBT Instruments",
        "group":  "",
        "productManager":  "R. LakshmiNarayanan",
        "countryOfOrigin":  "Denmark",
        "products":  [
                         {
                             "name":  "Bacteria Enumeration Systems",
                             "slug":  "bacteria-enumeration-systems"
                         },
                         {
                             "name":  "Microbial Analysis Systems",
                             "slug":  "microbial-analysis-systems"
                         },
                         {
                             "name":  "Process Monitoring Systems",
                             "slug":  "process-monitoring-systems"
                         }
                     ]
    },
    {
        "slug":  "evonik",
        "principalName":  "Evonik",
        "group":  "G6",
        "productManager":  "M. S. Reddy",
        "countryOfOrigin":  "Canada",
        "products":  [
                         {
                             "name":  "Liposome Extrusion Systems",
                             "slug":  "liposome-extrusion-systems"
                         }
                     ]
    },
    {
        "slug":  "gea",
        "principalName":  "Gea",
        "group":  "",
        "productManager":  "M. S. Reddy",
        "countryOfOrigin":  "Italy",
        "products":  [
                         {
                             "name":  "High-Pressure Homogenizers",
                             "slug":  "high-pressure-homogenizers"
                         },
                         {
                             "name":  "Pilot \u0026 Production Homogenizers",
                             "slug":  "pilot-and-production-homogenizers"
                         }
                     ]
    },
    {
        "slug":  "hitachi",
        "principalName":  "Hitachi",
        "group":  "",
        "productManager":  "Sivakumar Ganapathy",
        "countryOfOrigin":  "Japan",
        "products":  [
                         {
                             "name":  "DSC (Differential Scanning Calorimeters)",
                             "slug":  "dsc-differential-scanning-calorimeters"
                         },
                         {
                             "name":  "DMA (Dynamic Mechanical Analyzers)",
                             "slug":  "dma-dynamic-mechanical-analyzers"
                         },
                         {
                             "name":  "TGA (Thermogravimetric Analyzers)",
                             "slug":  "tga-thermogravimetric-analyzers"
                         },
                         {
                             "name":  "TMA (Thermal Mechanical Analyzers)",
                             "slug":  "tma-thermal-mechanical-analyzers"
                         }
                     ]
    },
    {
        "slug":  "proscientific",
        "principalName":  "ProScientific",
        "group":  "",
        "productManager":  "M. S. Reddy",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Hand-Held Rotor-Stator Homogenizers",
                             "slug":  "hand-held-rotor-stator-homogenizers"
                         }
                     ]
    },
    {
        "slug":  "thermofisher-scientific",
        "principalName":  "ThermoFisher Scientific",
        "group":  "",
        "productManager":  "Sivakumar Ganapathy",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Rheometers",
                             "slug":  "rheometers"
                         },
                         {
                             "name":  "Viscometers",
                             "slug":  "viscometers"
                         }
                     ]
    },
    {
        "slug":  "chemspeed",
        "principalName":  "Chemspeed",
        "group":  "G7",
        "productManager":  "Stanley Thomas",
        "countryOfOrigin":  "Switzerland",
        "products":  [
                         {
                             "name":  "Automated Laboratory Platforms",
                             "slug":  "automated-laboratory-platforms"
                         },
                         {
                             "name":  "Liquid Handling \u0026 Dispensing Systems",
                             "slug":  "liquid-handling-and-dispensing-systems"
                         },
                         {
                             "name":  "Automated Powder Dispensing Systems",
                             "slug":  "automated-powder-dispensing-systems"
                         },
                         {
                             "name":  "Pilot Plants \u0026 Pilot Reactors",
                             "slug":  "pilot-plants-and-pilot-reactors"
                         }
                     ]
    },
    {
        "slug":  "being",
        "principalName":  "Being",
        "group":  "G8",
        "productManager":  "Anantha Chakravarthi",
        "countryOfOrigin":  "China",
        "products":  [
                         {
                             "name":  "Biological Safety Cabinets",
                             "slug":  "biological-safety-cabinets"
                         },
                         {
                             "name":  "Laminar Flow Cabinets",
                             "slug":  "laminar-flow-cabinets"
                         },
                         {
                             "name":  "CO₂ Incubators",
                             "slug":  "co-incubators"
                         },
                         {
                             "name":  "Heating Incubator",
                             "slug":  "heating-incubator"
                         },
                         {
                             "name":  "Cooling Incubator",
                             "slug":  "cooling-incubator"
                         },
                         {
                             "name":  "Shaking Incubator",
                             "slug":  "shaking-incubator"
                         },
                         {
                             "name":  "Drying Ovens",
                             "slug":  "drying-ovens"
                         },
                         {
                             "name":  "Vacuum Ovens",
                             "slug":  "vacuum-ovens"
                         },
                         {
                             "name":  "Muffle Furnaces",
                             "slug":  "muffle-furnaces"
                         },
                         {
                             "name":  "Environmental Chambers",
                             "slug":  "environmental-chambers"
                         },
                         {
                             "name":  "Plant Growth Chambers",
                             "slug":  "plant-growth-chambers"
                         },
                         {
                             "name":  "Chillers",
                             "slug":  "chillers"
                         },
                         {
                             "name":  "Recirculating Chillers",
                             "slug":  "recirculating-chillers"
                         },
                         {
                             "name":  "Circulating Baths",
                             "slug":  "circulating-baths"
                         },
                         {
                             "name":  "Heated Circulators",
                             "slug":  "heated-circulators"
                         },
                         {
                             "name":  "Water Baths",
                             "slug":  "water-baths"
                         },
                         {
                             "name":  "Orbital \u0026 Linear Shakers",
                             "slug":  "orbital-and-linear-shakers"
                         },
                         {
                             "name":  "Refrigerated Shakers",
                             "slug":  "refrigerated-shakers"
                         },
                         {
                             "name":  "Oil Vacuum Pumps",
                             "slug":  "oil-vacuum-pumps"
                         },
                         {
                             "name":  "Diaphragm Vacuum Pumps",
                             "slug":  "diaphragm-vacuum-pumps"
                         },
                         {
                             "name":  "Deep Freezers (-25°C / -40°C)",
                             "slug":  "deep-freezers-25-c-40-c"
                         },
                         {
                             "name":  "ULT Freezers (-86°C)",
                             "slug":  "ult-freezers-86-c"
                         }
                     ]
    },
    {
        "slug":  "waters",
        "principalName":  "Waters",
        "group":  "",
        "productManager":  "Anantha Chakravarthi",
        "countryOfOrigin":  "United States of America",
        "products":  [
                         {
                             "name":  "Advanced Analytical HPLC / UPLC Systems (High Performance, GMP Ready)",
                             "slug":  "advanced-analytical-hplc-uplc-systems-high-performance-gmp-ready"
                         },
                         {
                             "name":  "LC-MS Systems (High Sensitivity, Regulatory Compliant)",
                             "slug":  "lc-ms-systems-high-sensitivity-regulatory-compliant"
                         }
                     ]
    },
    {
        "slug":  "sartorius",
        "principalName":  "Sartorius",
        "group":  "",
        "productManager":  "Anantha Chakravarthi",
        "countryOfOrigin":  "Germany",
        "products":  [
                         {
                             "name":  "Lab Water Purification Systems (Type I, II, III)",
                             "slug":  "lab-water-purification-systems-type-i-ii-iii"
                         }
                     ]
    },
    {
        "slug":  "buchi",
        "principalName":  "Buchi",
        "group":  "",
        "productManager":  "Anantha Chakravarthi",
        "countryOfOrigin":  "Switzerland",
        "products":  [
                         {
                             "name":  "Freeze Dryer (Lyophilizer)",
                             "slug":  "freeze-dryer-lyophilizer"
                         },
                         {
                             "name":  "Kjeldahl Systems",
                             "slug":  "kjeldahl-systems"
                         },
                         {
                             "name":  "Soxhlet Apparatus",
                             "slug":  "soxhlet-apparatus"
                         },
                         {
                             "name":  "Melting Point Apparatus",
                             "slug":  "melting-point-apparatus"
                         }
                     ]
    },
    {
        "slug":  "dlab",
        "principalName":  "DLAB",
        "group":  "",
        "productManager":  "Anantha Chakravarthi",
        "countryOfOrigin":  "China",
        "products":  [
                         {
                             "name":  "Benchtop Centrifuges",
                             "slug":  "benchtop-centrifuges"
                         },
                         {
                             "name":  "High-Speed Refrigerated Centrifuges",
                             "slug":  "high-speed-refrigerated-centrifuges"
                         },
                         {
                             "name":  "Microcentrifuges",
                             "slug":  "microcentrifuges"
                         },
                         {
                             "name":  "Dry Baths \u0026 Heating Blocks",
                             "slug":  "dry-baths-and-heating-blocks"
                         },
                         {
                             "name":  "Incubators",
                             "slug":  "incubators"
                         },
                         {
                             "name":  "Magnetic Stirrers",
                             "slug":  "magnetic-stirrers"
                         },
                         {
                             "name":  "Overhead Stirrers",
                             "slug":  "overhead-stirrers"
                         },
                         {
                             "name":  "Orbital Shakers",
                             "slug":  "orbital-shakers"
                         },
                         {
                             "name":  "Benchtop Rotary Evaporators",
                             "slug":  "benchtop-rotary-evaporators"
                         },
                         {
                             "name":  "UV/VIS Spectrophotometers",
                             "slug":  "uv-vis-spectrophotometers"
                         },
                         {
                             "name":  "Vortex Mixers",
                             "slug":  "vortex-mixers"
                         },
                         {
                             "name":  "Pipettes",
                             "slug":  "pipettes"
                         },
                         {
                             "name":  "Bottle-top Dispensers",
                             "slug":  "bottle-top-dispensers"
                         }
                     ]
    },
    {
        "slug":  "mettler-toledo",
        "principalName":  "Mettler Toledo",
        "group":  "",
        "productManager":  "Durga Prasad",
        "countryOfOrigin":  "Switzerland",
        "products":  [
                         {
                             "name":  "Weighing Balances",
                             "slug":  "weighing-balances"
                         },
                         {
                             "name":  "pH Meters",
                             "slug":  "ph-meters"
                         },
                         {
                             "name":  "Titrators",
                             "slug":  "titrators"
                         },
                         {
                             "name":  "Moisture Analyzers",
                             "slug":  "moisture-analyzers"
                         },
                         {
                             "name":  "Melting Point Systems",
                             "slug":  "melting-point-systems"
                         },
                         {
                             "name":  "UV/VIS Spectrophotometers",
                             "slug":  "uv-vis-spectrophotometers"
                         }
                     ]
    },
    {
        "slug":  "inkarp-usb",
        "principalName":  "Inkarp USB",
        "group":  "",
        "productManager":  "Saravanan Natarajan",
        "countryOfOrigin":  "India",
        "products":  [
                         {
                             "name":  "Ultrasonic Baths",
                             "slug":  "ultrasonic-baths"
                         }
                     ]
    }
];

export function getAllPrincipals() {
  return productPrincipals.map((principal) => getPrincipalBySlug(principal.slug));
}

export function getPrincipalBySlug(slug) {
  const principal = productPrincipals.find((item) => item.slug === slug);

  if (!principal) {
    return undefined;
  }

  return {
    ...principal,
    products: principal.products.map((product) => ({
      ...getProductByPrincipalAndSlug(principal.slug, product.slug),
    })),
  };
}

export function getProductByPrincipalAndSlug(principalSlug, productSlug) {
  const principal = productPrincipals.find((item) => item.slug === principalSlug);
  const product = principal?.products.find((item) => item.slug === productSlug);

  if (!principal || !product) {
    return undefined;
  }

  const detail = getProductDetailByPrincipalAndSlug(principalSlug, productSlug);
  const taxonomy = getProductTaxonomy(product.name, detail);

  return {
    ...product,
    ...detail,
    category: detail?.category ?? taxonomy.industry,
    industry: detail?.industry ?? detail?.category ?? taxonomy.industry,
    applications: detail?.applications?.length
      ? detail.applications
      : taxonomy.applications,
    principalSlug: principal.slug,
    principalName: principal.principalName,
    group: principal.group,
    productManager: principal.productManager,
    countryOfOrigin: principal.countryOfOrigin,
    href: `/products/${product.slug}`,
    apiPath: `/api/products/${principal.slug}/${product.slug}`,
    hasDetails: Boolean(detail),
  };
}

export function getProductBySlug(productSlug) {
  const detail = getProductDetailBySlug(productSlug);

  if (detail) {
    return getProductByPrincipalAndSlug(detail.principalSlug, detail.slug);
  }

  for (const principal of productPrincipals) {
    const product = principal.products.find((item) => item.slug === productSlug);

    if (product) {
      return getProductByPrincipalAndSlug(principal.slug, product.slug);
    }
  }

  return undefined;
}

export function getAllProducts() {
  return productPrincipals.flatMap((principal) =>
    principal.products.map((product) =>
      getProductByPrincipalAndSlug(principal.slug, product.slug)
    )
  );
}

export function getProductFilterOptions() {
  const products = getAllProducts();

  return {
    principals: productPrincipals.map((principal) => ({
      label: principal.principalName,
      value: principal.slug,
    })),
    countries: uniqueValues(products.map((product) => product.countryOfOrigin)),
    industries: uniqueValues(products.map((product) => product.industry)),
    applications: uniqueValues(
      products.flatMap((product) => product.applications ?? [])
    ),
    groups: uniqueValues(products.map((product) => product.group)),
  };
}

export function searchProducts(filters = {}) {
  const query = filters.q?.trim().toLowerCase();

  return getAllProducts().filter((product) => {
    const searchableText = [
      product.name,
      product.slug,
      product.principalName,
      product.countryOfOrigin,
      product.productManager,
      product.group,
      product.industry,
      product.category,
      product.overview,
      ...(product.applications ?? []),
      ...(product.features ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchableText.includes(query)) &&
      (!filters.principal || product.principalSlug === filters.principal) &&
      (!filters.country || product.countryOfOrigin === filters.country) &&
      (!filters.industry || product.industry === filters.industry) &&
      (!filters.application ||
        (product.applications ?? []).includes(filters.application)) &&
      (!filters.group || product.group === filters.group) &&
      (!filters.details || product.hasDetails)
    );
  });
}
