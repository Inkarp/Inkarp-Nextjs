// The "360-Degree Solution" workflow map Inkarp exhibits on its stall at
// analytica Lab India — 7 stages of a typical lab process, each with the
// steps involved and the instruments (principal + product) that cover them.
// Sourced from the stall artwork (Inkarp_Workflow_Rearranged.pdf).
//
// `principalSlug: null` marks a named product with no live catalogue page to
// link to yet (Rotachrom CPC, Anvajo — the source artwork itself footnotes
// Anvajo as "subject to confirmation"). Everything else links to that
// principal's brand-filtered product listing.
//
// `productSlugs` (where present) names the exact catalogue page(s) this stall
// product corresponds to — verified against src/data/principals/**/*.json
// rather than guessed. It is also what drives the "on display at analytica"
// badge on product pages/cards (see getAnalyticaShowcaseProductSlugs below).
// Left off deliberately where the named model has no exact catalogue match
// (e.g. Polyscience "BR05/BR03 Chiller", GEA "Panda Smart", Buchi "Kjeldahl")
// or the principal has no live products at all (Jeio Tech) — those items
// still show in the workflow map below, they just don't carry a badge yet.
export const stallWorkflowStages = [
  {
    id: "sample-preparation",
    number: 1,
    title: "Sample Preparation",
    steps: [
      {
        label: "Purify water",
        products: [
          {
            principalName: "Sartorius",
            principalSlug: "sartorius",
            name: "Arium",
            productSlugs: [
              "arium-mini-plus-lab-water-purification-system",
              "arium-comfort-1-lab-water-purification-system",
              "arium-comfort-2-lab-water-purification-system",
            ],
          },
        ],
      },
      {
        label: "Weigh accurately",
        products: [
          {
            principalName: "Mettler Toledo",
            principalSlug: "mettler-toledo",
            name: "Balance",
            productSlugs: ["analytical-balance-ma204"],
          },
        ],
      },
      {
        label: "Adjust pH",
        products: [
          {
            principalName: "Mettler Toledo",
            principalSlug: "mettler-toledo",
            name: "pH Meter",
            productSlugs: ["ph-meter-fp20-bio-kit"],
          },
        ],
      },
      {
        label: "Assay, water content",
        products: [
          {
            principalName: "Mettler Toledo",
            principalSlug: "mettler-toledo",
            name: "Titrator",
            productSlugs: ["titrator-easyplus-easy-ph"],
          },
        ],
      },
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
          {
            principalName: "Heidolph",
            principalSlug: "heidolph",
            name: "Overhead Stirrer with Findenser, Magnetic Stirrer + Heat-On Blocks, Hei-VAP Expert Controller, Pump",
            productSlugs: [
              // Hei-VAP Expert Controller
              "hei-vap-expert-control-rotary-evaporator",
              // Overhead stirrer line
              "hei-torque-core-with-rs232-overhead-stirrer",
              "hei-torque-expert-100-overhead-stirrer",
              "hei-torque-expert-200-overhead-stirrer",
              "hei-torque-expert-400-overhead-stirrer",
              "hei-torque-ultimate-100-overhead-stirrer",
              "hei-torque-ultimate-200-overhead-stirrer",
              "hei-torque-ultimate-400-overhead-stirrer",
              // Magnetic stirrer + heat-on-blocks line
              "hei-mix-s-magnetic-stirrer",
              "hei-plate-mix-20-l-magnetic-stirrer",
              "hei-plate-mix-n-heat-core-magnetic-stirrer",
              "hei-plate-mix-n-heat-core-plus-magnetic-stirrer",
              "hei-plate-mix-n-heat-core-ultimate-magnetic-stirrer",
              "hei-plate-mix-n-heat-core-expert-magnetic-stirrer",
              // Pump line (vacuum + peristaltic)
              "hei-vac-valve-control-vacuum-pump",
              "hei-vac-valve-tec-vacuum-pump",
              "hei-vac-vario-station-rpm-regulated-vacuum-pump",
              "hei-vac-vario-control-rpm-regulated-vacuum-pump",
              "hei-flow-ultimate-600-single-channel-peristaltic-pump",
              "hei-flow-expert-600-single-channel-peristaltic-pump",
              "hei-flow-core-120-multi-channel-peristaltic-pump",
              "hei-flow-expert-120-multi-channel-peristaltic-pump",
              "hei-flow-ultimate-120-multi-channel-peristaltic-pump",
            ],
          },
          {
            principalName: "Radleys",
            principalSlug: "radleys",
            name: "Findenser, Heat-On Blocks",
            productSlugs: ["findenser-super-air-condenser", "heat-on-block-system"],
          },
          {
            principalName: "Polyscience",
            principalSlug: "polyscience",
            name: "BRO5/BR03 Chiller",
            // No exact "BR05/BR03" SKU in the catalogue — closest is DuraChill
            // Portable Chiller, but that's a different model number, so left
            // unbadged until confirmed.
          },
        ],
      },
      {
        label: "Jacketed reaction",
        products: [
          {
            principalName: "Radleys",
            principalSlug: "radleys",
            name: "Reactor Ready Mini",
            productSlugs: ["reactor-ready-mini-lab-reactor"],
          },
        ],
      },
      {
        label: "Parallel screening",
        products: [
          {
            principalName: "Radleys",
            principalSlug: "radleys",
            name: "Mya 4, Carousel and Accessories",
            productSlugs: [
              "mya-4-reaction-station",
              "mya-4-control-options",
              "mya-4-vessels-and-accessories",
              "carousel-12-plus-parallel-reaction-station",
              "cooled-carousel-12-plus-parallel-reaction-station",
              "carousel-work-up-parallel-reaction-station",
              "carousel-6-plus-parallel-reaction-station",
              "carousel-stirring-hotplates",
            ],
          },
        ],
      },
      {
        label: "Hold temperature",
        products: [
          {
            principalName: "Polyscience",
            principalSlug: "polyscience",
            name: "Durachill-CA10",
            // No exact "CA10" SKU in the catalogue — closest is DuraChill
            // Portable Chiller at other wattages, left unbadged until confirmed.
          },
        ],
      },
      {
        label: "Flow hydrogenation",
        products: [
          {
            principalName: "ThalesNano",
            principalSlug: "thalesnano",
            name: "H-Cube Mini",
            productSlugs: ["h-cube-mini-plus"],
          },
        ],
      },
    ],
    footnote: {
      principalName: "Rotzmeier",
      principalSlug: "rotzmeier",
      note: "Safety Cans-2L, Canister-5L/10L",
      products: [
        {
          principalName: "Rotzmeier",
          principalSlug: "rotzmeier",
          name: "Safety Cans-2L",
          productSlugs: ["safety-cans-for-in-plant-use"],
        },
        {
          principalName: "Rotzmeier",
          principalSlug: "rotzmeier",
          name: "Canister-5L/10L",
          productSlugs: ["safety-canisters-for-in-plant-use"],
        },
      ],
    },
  },
  {
    id: "homogenisation-and-dispersion",
    number: 3,
    title: "Homogenisation and Dispersion",
    steps: [
      {
        label: "Disrupt and sonicate",
        products: [
          {
            principalName: "Sonics",
            // Real catalogue slug is "sonics-and-materials" — "sonics" doesn't
            // resolve to anything and was a dead link.
            principalSlug: "sonics-and-materials",
            name: "VCX 750",
            productSlugs: ["vcx-750-ultrasonic-probe-sonicator"],
          },
        ],
      },
      {
        label: "Homogenise",
        products: [
          {
            principalName: "GEA",
            principalSlug: "gea",
            name: "Panda Smart",
            // Closest catalogue match is "GEA PandaPLUS", a different tier —
            // left unbadged until the exact model is confirmed.
          },
        ],
      },
    ],
  },
  {
    id: "separation-and-purification",
    number: 4,
    title: "Separation and Purification",
    steps: [
      {
        label: "Support-free separation",
        products: [{ principalName: "Rotachrom", principalSlug: null, name: "CPC" }],
      },
      {
        label: "Flash purification",
        products: [
          {
            principalName: "Advion Interchim Scientific",
            principalSlug: "advion-interchim-scientific",
            name: "Flash",
            productSlugs: ["puriflash-xs-530", "puriflash-5-030", "puriflash-5-050"],
          },
        ],
      },
      {
        label: "Mass-directed collection",
        products: [
          {
            principalName: "Advion Interchim Scientific",
            principalSlug: "advion-interchim-scientific",
            name: "Compact MS",
            productSlugs: ["expression-cms"],
          },
        ],
      },
      {
        label: "Preparative HPLC",
        products: [
          {
            principalName: "ECOM",
            principalSlug: "ecom",
            name: "Prep",
            // No product literally named "Preparative System" — closest are
            // Separchrom DAC / Separsys columns, left unbadged until confirmed.
          },
          {
            principalName: "Advion Interchim Scientific",
            principalSlug: "advion-interchim-scientific",
            name: "Prep",
            productSlugs: ["puriflash-5-250", "puriflash-5-400-uv"],
          },
        ],
      },
      {
        label: "Confirm purity",
        products: [
          {
            principalName: "Waters",
            principalSlug: "waters",
            name: "ARC HPLC",
            productSlugs: ["arc-hplc-system"],
          },
        ],
      },
    ],
  },
  {
    id: "concentration-and-drying",
    number: 5,
    title: "Concentration and Drying",
    steps: [
      {
        label: "Concentrate",
        products: [
          {
            principalName: "SP Genevac",
            principalSlug: "sp-genevac",
            name: "",
            productSlugs: [
              "genevac-rocket-synergy-2-benchtop-evaporator",
              "genevac-ez-2-4-0-bionic-centrifugal-evaporator",
              "genevac-mivac-2-centrifugal-evaporator",
              "genevac-ez-2-4-0-series-centrifugal-evaporator",
              "genevac-ht-series-3i-centrifugal-evaporator",
            ],
          },
        ],
      },
      {
        label: "Freeze dry, lab scale",
        products: [
          {
            principalName: "Buchi",
            principalSlug: "buchi",
            name: "Freeze Dryer L250",
            productSlugs: ["freeze-dryer-lyovapor-l-250"],
          },
        ],
      },
      {
        label: "Freeze dry, pilot scale",
        products: [
          {
            principalName: "Daralyo",
            // Real catalogue slug is "dara-lyo" — "daralyo" doesn't resolve to
            // anything and was a dead link.
            principalSlug: "dara-lyo",
            name: "",
          },
        ],
      },
      {
        label: "Final dry and store",
        products: [
          {
            principalName: "Jeio Tech",
            principalSlug: "jeiotech",
            name: "Vacuum Oven OVA 30/OVA4 65, Auto Desiccator DC211/DC2-21",
            // Jeio Tech is a registered principal with zero live products in
            // the catalogue — nothing to link to yet.
          },
        ],
      },
    ],
  },
  {
    id: "characterisation-and-analysis",
    number: 6,
    title: "Characterisation and Analysis",
    steps: [
      {
        label: "Confirm structure",
        products: [
          {
            principalName: "Nanalysis",
            principalSlug: "nanalysis",
            name: "NMR",
            productSlugs: ["nanalysis-100-benchtop-nmr-spectrometer"],
          },
        ],
      },
      {
        label: "Functional groups",
        products: [
          {
            principalName: "Bruker",
            principalSlug: "bruker",
            name: "FTIR ALPHA II",
            productSlugs: ["alpha-ii-compact-ft-ir-spectrometer"],
          },
        ],
      },
      {
        label: "Material identity",
        products: [
          {
            principalName: "Bruker",
            principalSlug: "bruker",
            name: "NIR MPA/Tango",
            productSlugs: ["mpa-iii-ft-nir-spectrometer", "tango-ii-ft-nir-spectrometer"],
          },
        ],
      },
      {
        label: "Rapid material ID",
        products: [
          {
            principalName: "Bruker",
            principalSlug: "bruker",
            name: "Bravo",
            productSlugs: ["bravo-handheld-raman-spectrometer"],
          },
        ],
      },
    ],
  },
  {
    id: "quantitation-and-bioanalysis",
    number: 7,
    title: "Quantitation and Bioanalysis",
    steps: [
      {
        label: "DNA and protein quant",
        products: [
          {
            principalName: "Implen",
            principalSlug: "implen",
            name: "NanoPhotometer N30 Touch",
            productSlugs: ["nanophotometer-n30-touch"],
          },
        ],
      },
      {
        label: "Cell density",
        products: [
          {
            principalName: "Implen",
            principalSlug: "implen",
            name: "OD600",
            productSlugs: ["nanophotometer-od600"],
          },
        ],
      },
      {
        label: "Cell count",
        products: [{ principalName: "Anvajo", principalSlug: null, name: "Cell Counter" }],
      },
      {
        label: "Imaging",
        products: [
          {
            principalName: "Zeiss",
            principalSlug: "zeiss",
            name: "Microscope",
            // "Microscope" alone spans a dozen-plus Zeiss product lines in the
            // catalogue with no single model named — badge falls back to the
            // principal's brand-filtered listing instead of an exact
            // productSlug. Explicit flag (rather than "no productSlugs")
            // because several other entries above also lack productSlugs for
            // an unrelated reason: no catalogue match, not "intentionally
            // generic" — those should get no badge at all.
            showcaseFallback: true,
          },
        ],
      },
      {
        label: "Elemental Na, K, Ca",
        products: [
          {
            principalName: "BWB Technologies",
            principalSlug: "bwb-technologies",
            name: "Flash FL2",
            productSlugs: ["bwb-flash-flame-photometer"],
          },
        ],
      },
    ],
    footnote: { note: "Anvajo subject to confirmation." },
  },
];

/**
 * Product-page "on display at analytica" badges expire the day doors open —
 * The campaign is inactive after the event closes, so visitors no longer see
 * a stale promotional badge. Kept as a plain string constant (compared client-side, never at
 * build time) so it needs updating in exactly one place next year.
 */
export const ANALYTICA_SHOWCASE_ACTIVE_THROUGH = "2026-09-12";

export function isAnalyticaShowcaseActive(today = new Date()) {
  const cutoff = new Date(`${ANALYTICA_SHOWCASE_ACTIVE_THROUGH}T23:59:59+05:30`);
  return today.getTime() <= cutoff.getTime();
}

function flattenShowcaseProducts() {
  const products = [];

  for (const stage of stallWorkflowStages) {
    for (const step of stage.steps) {
      products.push(...step.products);
    }
    if (stage.footnote?.products) {
      products.push(...stage.footnote.products);
    }
  }

  return products;
}

let cachedProductSlugs = null;
let cachedFallbackPrincipalSlugs = null;

/** Every product slug on display at analytica, as a Set for O(1) lookups. */
export function getAnalyticaShowcaseProductSlugs() {
  if (!cachedProductSlugs) {
    cachedProductSlugs = new Set(
      flattenShowcaseProducts().flatMap((product) => product.productSlugs ?? [])
    );
  }
  return cachedProductSlugs;
}

/**
 * Principals shown at analytica broadly enough (a whole product family, no
 * single named model) that a product page can only be matched at the
 * principal level, not a specific slug — currently just Zeiss ("Microscope").
 */
export function getAnalyticaShowcaseFallbackPrincipalSlugs() {
  if (!cachedFallbackPrincipalSlugs) {
    cachedFallbackPrincipalSlugs = new Set(
      flattenShowcaseProducts()
        .filter((product) => product.principalSlug && product.showcaseFallback)
        .map((product) => product.principalSlug)
    );
  }
  return cachedFallbackPrincipalSlugs;
}
