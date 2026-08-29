// The "360-Degree Solution" workflow map Inkarp exhibits on its stall at
// analytica Lab India — 7 stages of a typical lab process, each with the
// steps involved and the instruments (principal + product) that cover them.
// Sourced from the stall artwork (Inkarp_Workflow_Rearranged.pdf).
//
// `principalSlug: null` marks a named product with no live catalogue page to
// link to yet (Rotachrom CPC, Anvajo — the source artwork itself footnotes
// Anvajo as "subject to confirmation"). Everything else links to that
// principal's brand-filtered product listing.
export const stallWorkflowStages = [
  {
    id: "sample-preparation",
    number: 1,
    title: "Sample Preparation",
    steps: [
      { label: "Purify water", products: [{ principalName: "Sartorius", principalSlug: "sartorius", name: "Arium" }] },
      { label: "Weigh accurately", products: [{ principalName: "Mettler Toledo", principalSlug: "mettler-toledo", name: "Balance" }] },
      { label: "Adjust pH", products: [{ principalName: "Mettler Toledo", principalSlug: "mettler-toledo", name: "pH Meter" }] },
      { label: "Assay, water content", products: [{ principalName: "Mettler Toledo", principalSlug: "mettler-toledo", name: "Titrator" }] },
    ],
  },
  {
    id: "synthesis-and-reaction",
    number: 2,
    title: "Synthesis and Reaction",
    steps: [
      {
        label: "Stir and heat",
        products: [
          { principalName: "Heidolph", principalSlug: "heidolph", name: "Overhead Stirrer with Findenser, Magnetic Stirrer + Heat-On Blocks, Hei-VAP Expert Controller, Pump" },
          { principalName: "Polyscience", principalSlug: "polyscience", name: "BRO5/BR03 Chiller" },
        ],
      },
      { label: "Jacketed reaction", products: [{ principalName: "Radleys", principalSlug: "radleys", name: "Reactor Ready" }] },
      { label: "Parallel screening", products: [{ principalName: "Radleys", principalSlug: "radleys", name: "Mya 4, Carousel and Accessories" }] },
      { label: "Hold temperature", products: [{ principalName: "Polyscience", principalSlug: "polyscience", name: "Chiller" }] },
      { label: "Flow hydrogenation", products: [{ principalName: "ThalesNano", principalSlug: "thalesnano", name: "H-Cube" }] },
    ],
    footnote: { principalName: "Rotzmeier", principalSlug: "rotzmeier", note: "Safety Cans-2L, Canister-5L/10L" },
  },
  {
    id: "homogenisation-and-dispersion",
    number: 3,
    title: "Homogenisation and Dispersion",
    steps: [
      { label: "Disrupt and sonicate", products: [{ principalName: "Sonics", principalSlug: "sonics", name: "VCX 750" }] },
      { label: "Homogenise", products: [{ principalName: "GEA", principalSlug: "gea", name: "Panda Smart" }] },
    ],
  },
  {
    id: "separation-and-purification",
    number: 4,
    title: "Separation and Purification",
    steps: [
      { label: "Support-free separation", products: [{ principalName: "Rotachrom", principalSlug: null, name: "CPC" }] },
      { label: "Flash purification", products: [{ principalName: "Advion Interchim Scientific", principalSlug: "advion-interchim-scientific", name: "Flash" }] },
      { label: "Mass-directed collection", products: [{ principalName: "Advion Interchim Scientific", principalSlug: "advion-interchim-scientific", name: "Compact MS" }] },
      {
        label: "Preparative HPLC",
        products: [
          { principalName: "ECOM", principalSlug: "ecom", name: "Prep" },
          { principalName: "Advion Interchim Scientific", principalSlug: "advion-interchim-scientific", name: "Prep" },
        ],
      },
      { label: "Confirm purity", products: [{ principalName: "Waters", principalSlug: "waters", name: "ARC HPLC" }] },
    ],
  },
  {
    id: "concentration-and-drying",
    number: 5,
    title: "Concentration and Drying",
    steps: [
      { label: "Concentrate", products: [{ principalName: "SP Genevac", principalSlug: "sp-genevac", name: "" }] },
      { label: "Freeze dry, lab scale", products: [{ principalName: "Buchi", principalSlug: "buchi", name: "" }] },
      { label: "Freeze dry, pilot scale", products: [{ principalName: "Daralyo", principalSlug: "daralyo", name: "" }] },
      {
        label: "Final dry and store",
        products: [
          { principalName: "Jeio Tech", principalSlug: "jeiotech", name: "Vacuum Oven OVA 30/OVA4 65, Auto Desiccator DC211/DC2-21" },
        ],
      },
    ],
  },
  {
    id: "characterisation-and-analysis",
    number: 6,
    title: "Characterisation and Analysis",
    steps: [
      { label: "Confirm structure", products: [{ principalName: "Nanalysis", principalSlug: "nanalysis", name: "NMR" }] },
      { label: "Functional groups", products: [{ principalName: "Bruker", principalSlug: "bruker", name: "FTIR ALPHA II" }] },
      { label: "Material identity", products: [{ principalName: "Bruker", principalSlug: "bruker", name: "NIR MPA/Tango" }] },
      { label: "Rapid material ID", products: [{ principalName: "Bruker", principalSlug: "bruker", name: "Bravo" }] },
    ],
  },
  {
    id: "quantitation-and-bioanalysis",
    number: 7,
    title: "Quantitation and Bioanalysis",
    steps: [
      { label: "DNA and protein quant", products: [{ principalName: "Implen", principalSlug: "implen", name: "NanoPhotometer N30 Touch" }] },
      { label: "Cell density", products: [{ principalName: "Implen", principalSlug: "implen", name: "OD600" }] },
      { label: "Cell count", products: [{ principalName: "Anvajo", principalSlug: null, name: "Cell Counter" }] },
      { label: "Imaging", products: [{ principalName: "Zeiss", principalSlug: "zeiss", name: "Microscope" }] },
      { label: "Elemental Na, K, Ca", products: [{ principalName: "BWB Technologies", principalSlug: "bwb-technologies", name: "Flash FL2" }] },
    ],
    footnote: { note: "Anvajo subject to confirmation." },
  },
];
