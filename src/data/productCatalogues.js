const driveCatalogue = (fileId, fileName) => ({
  fileId,
  fileName,
  // PDFs are temporarily served from the website itself. Keep the legacy
  // Drive ID in the mapping so migration to external storage remains simple.
  downloadUrl: `/catalogues/${fileName}`,
});

const PRINCIPAL_CATALOGUES = {
  "ametek-brookfield": driveCatalogue("15pOghLHZsumKQ2-u28fLSQACRVWsqJgq", "Ametek_Brookfield_2026_Product_Catalogue.pdf"),
  "bwb-technologies": driveCatalogue("1STMe3oewxHOA4t5wMgiACnAyMFdzU0wN", "BWB_Technologies_Flame_Photometers_Catalogue.pdf"),
  chemspeed: driveCatalogue("1L5OO3Dp7YDctjhZ0SipU_bNQ8niKwkgH", "Chemspeed_CRYSTAL_POWDERDOSE_Brochure.pdf"),
  gea: driveCatalogue("1NnBGhJ5Edn_9kWgGAO6cbkrURm_dkFsK", "GEA_Niro_Soavi_Homogenizers_Catalogue.pdf"),
  heidolph: driveCatalogue("14Awh9HsxUg5uUV9gjgCcFqdwl0TOgJnf", "Heidolph_Laboratory_Solutions_2025_Catalogue.pdf"),
  kubota: driveCatalogue("1T5sWw11UiIibyGkqRMAYukWkGWSIKeF9", "Kubota_Models_6000_7000_Centrifuges_Catalogue.pdf"),
  "labstation-i": driveCatalogue("1czyytD7uhOX2s65K4F-ftXznrbysOAw5", "Labstation_i_Glovebox_and_Accessories_Brochure.pdf"),
  litescope: driveCatalogue("1TO3mlbM9CF0oU012G243gx4wHBOn6fgP", "NenoVision_LiteScope_AFM_in_SEM_Brochure.pdf"),
  radleys: driveCatalogue("1MauFt8w6QCKnFkLAJMstiQE81X4nRSap", "Radleys_Laboratory_Reaction_Solutions_Catalogue.pdf"),
  rotachrom: driveCatalogue("1rjvDvLvs2puE5Gz5jcw1ngdDH4i5fx84", "RotaChrom_CPC_Platform_Catalogue.pdf"),
  "sonics-and-materials": driveCatalogue("1N7BDDavMmMLmdw901EBRD-jHDYLOUgD4", "Sonics_Ultrasonic_Processors_and_Accessories_Catalogue.pdf"),
  "sp-genevac": driveCatalogue("1XzHK9wRv40wkCbAHQsxXmCJrXT_jXOTS", "SP_Genevac_Evaporation_Solutions_Catalogue.pdf"),
};

const PRODUCT_CATALOGUES = {
  "freeze-dryer-lyovapor-l-210": driveCatalogue("1Dg4aUmLXe2KmQHD-E306XIy3osQTxgtu", "Buchi_Lyovapor_L200_L250_Freeze_Dryers_Brochure.pdf"),
  "freeze-dryer-lyovapor-l-250": driveCatalogue("1Dg4aUmLXe2KmQHD-E306XIy3osQTxgtu", "Buchi_Lyovapor_L200_L250_Freeze_Dryers_Brochure.pdf"),
  "kjel-line": driveCatalogue("1eUjVcAZ_NfxaJ6hx2WPf_WyWkyeBjUcX", "Buchi_Kjel_Line_Digestion_Distillation_Solutions_Catalogue.pdf"),
  "bravo-handheld-raman-spectrometer": driveCatalogue("15iM8BZf2n99b2GGY2B-lW27544ilBNsS", "Bruker_BRAVO_Handheld_Raman_Spectrometer_Brochure.pdf"),
  "tango-ii-ft-nir-spectrometer": driveCatalogue("1c1NPM73-a5lGdiRv0QMUw7GsiYjHMOl_", "Bruker_TANGO_II_FT_NIR_Spectrometer_Brochure.pdf"),
  "nanophotometer-n30-touch": driveCatalogue("15QKh67CSm8RhWFebkgWQbnHcoN75MVDq", "Implen_NanoPhotometer_N30_Touch_Brochure.pdf"),
  "nanophotometer-n120": driveCatalogue("1-lmtkks0cfukyHbplk3Njkky02AU_xmy", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"),
  "nanophotometer-np80": driveCatalogue("1-lmtkks0cfukyHbplk3Njkky02AU_xmy", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"),
  "nanophotometer-n60-n50": driveCatalogue("1-lmtkks0cfukyHbplk3Njkky02AU_xmy", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"),
  "nanophotometer-c40": driveCatalogue("1-lmtkks0cfukyHbplk3Njkky02AU_xmy", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"),
  "nanophotometer-od600": driveCatalogue("1-lmtkks0cfukyHbplk3Njkky02AU_xmy", "Implen_NanoPhotometer_Product_Family_Catalogue.pdf"),
  driveafm: driveCatalogue("1MuPRLUqaHa04X8XGrNlq6wkNxpJc3-8i", "Nanosurf_DriveAFM_Brochure.pdf"),
  flexafm: driveCatalogue("1lOl1hBVUeb8hlafuu5AqNMLDtUbwIqbK", "Nanosurf_FlexAFM_Mount_Brochure.pdf"),
  naioafm: driveCatalogue("1wK1vVPrij40J7tzUSnvLWPLX7tmOXnBR", "Nanosurf_NaioAFM_NaioSTM_CoreAFM_Catalogue.pdf"),
  naiostm: driveCatalogue("1wK1vVPrij40J7tzUSnvLWPLX7tmOXnBR", "Nanosurf_NaioAFM_NaioSTM_CoreAFM_Catalogue.pdf"),
  coreafm: driveCatalogue("1wK1vVPrij40J7tzUSnvLWPLX7tmOXnBR", "Nanosurf_NaioAFM_NaioSTM_CoreAFM_Catalogue.pdf"),
  naniteafm: driveCatalogue("1arsCsg4EwEodAHLBKR4yrdI0CON4LMFm", "Nanosurf_NaniteAFM_Brochure.pdf"),
  "nexta-dma200-dynamic-mechanical-analyzer": driveCatalogue("1mBSLk9Ett6m9_6Uy2msFiYukv8rLCKUv", "Hitachi_NEXTA_DMA200_Brochure.pdf"),
  "nexta-dsc600-dsc200-differential-scanning-calorimeters": driveCatalogue("10M2eOWvvI1IS6hDSNQgOZdmPYB1rLQa9", "Hitachi_NEXTA_DSC200_DSC600_Brochure.pdf"),
  "nexta-sta200-sta200rv-sta300-simultaneous-thermal-analyzers": driveCatalogue("1Mw1nEZeonnuWb99VHuJjiHVrp-NeUNX2", "Hitachi_NEXTA_STA200_STA200RV_STA300_Brochure.pdf"),
};

// These products inherit a principal-level catalogue, but the supplied PDF
// does not contain the product/model. Keep their catalogue button hidden until
// a matching brochure is supplied.
const PRODUCTS_WITHOUT_MATCHING_CATALOGUE = new Set([
  "freeze-dryer-lyovapor-l-210",
  "bwb-soil-flame-photometer",
  "bwb-synfuels-flame-photometer",
  "flex-isynth",
  "flex-autoplant",
  "swing-sp",
  "flex-quechers",
  "gea-xstream-lab-homogenizer",
  "homogenizers-plug-and-play-pharma-skid",
  "reax-top-vortex-mixer",
  "reax-control-vortex-mixer",
  "multi-reax-vortex-mixer",
  "titramax-101-vibrating-shaker",
  "titramax-100-vibrating-shaker",
  "titramax-1000-vibrating-shaker",
  "rotamax-120-orbital-shaker",
  "unimax-1010-orbital-shaker",
  "promax-1020-orbital-shaker",
  "vibramax-100-orbital-shaker",
  "hei-shake-orbital-expert-orbital-shaker",
  "hei-shake-orbital-expert-2000-orbital-shaker",
  "hei-shake-orbital-core-orbital-shaker",
  "hei-shake-orbital-core-2000-orbital-shaker",
  "hei-shake-wave-core-3d-shaker",
  "hei-shake-wave-core-2000-3d-shaker",
  "hei-shake-rock-core-rocking-shaker",
  "hei-shake-rock-core-2000-rocking-shaker",
  "duomax-1030-rocking-shaker",
  "hei-vac-valve-control-vacuum-pump",
  "hei-vac-valve-tec-vacuum-pump",
  "hei-vac-vario-station-rpm-regulated-vacuum-pump",
  "hei-vac-vario-control-rpm-regulated-vacuum-pump",
  "benchtop-high-speed-refrigerated-centrifuge-model-m500tr",
  "benchtop-centrifuge-model-s300t",
  "benchtop-centrifuge-model-s500t",
  "benchtop-centrifuge-model-s700t",
  "benchtop-refrigerated-centrifuge-model-s300tr",
  "benchtop-refrigerated-centrifuge-model-s700tr",
  "floor-standing-refrigerated-centrifuge-s500fr",
  "floor-standing-refrigerated-centrifuge-s700fr",
  "tabletop-refrigerated-centrifuge-model-5500",
  "tabletop-micro-centrifuge-model-3300",
  "benchtop-centrifuge-plate-spin-3",
  "hybrid-high-speed-refrigerated-centrifuge-model-6200",
  "high-capacity-refrigerated-centrifuge-model-8730",
  "large-capacity-refrigerated-centrifuge-model-9945",
  "large-capacity-refrigerated-centrifuge-model-9925",
  "labstation-i-solvent-purification-system-sps",
]);

export function getProductCatalogue(product) {
  if (!product?.slug) return null;
  if (PRODUCTS_WITHOUT_MATCHING_CATALOGUE.has(product.slug)) return null;
  return PRODUCT_CATALOGUES[product.slug] ?? PRINCIPAL_CATALOGUES[product.principalSlug] ?? null;
}
