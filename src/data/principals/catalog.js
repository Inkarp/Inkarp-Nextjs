import heidolphCatalog from "./heidolph/products.json";
import heidolphRotaryEvaporatorsCatalog from "./heidolph/rotary-evaporators.json";
import heidolphLargeScaleRotaryEvaporatorsCatalog from "./heidolph/large-scale-rotary-evaporators.json";
import heidolphMagneticStirrersCatalog from "./heidolph/magnetic-stirrers.json";
import heidolphOverheadStirrersCatalog from "./heidolph/overhead-stirrers.json";
import heidolphShakersAndMixersCatalog from "./heidolph/shakers-and-mixers.json";
import heidolphPeristalticPumpsCatalog from "./heidolph/peristaltic-pumps.json";
import heidolphVacuumPumpsCatalog from "./heidolph/vacuum-pumps.json";
import brukerFtIrResearchSpectrometersCatalog from "./bruker/ft-ir-research-spectrometers.json";
import brukerFtIrMicroscopesCatalog from "./bruker/ft-ir-microscopes.json";
import brukerFtIrSpectrometerCatalog from "./bruker/ft-ir-spectrometer.json";
import brukerFtNirSpectrometerCatalog from "./bruker/ft-nir-spectrometer.json";
import brukerRamanSpectrometerCatalog from "./bruker/raman-spectrometer.json";
import brukerRamanMicroscopesCatalog from "./bruker/raman-microscopes.json";
import brukerProcessMonitoringSpectrometerCatalog from "./bruker/process-monitoring-spectrometer.json";
import brukerFtIrGasAnalyzerCatalog from "./bruker/ft-ir-gas-analyzer.json";
import polyscienceChillersCatalog from "./polyscience/chillers.json";
import polyscienceCirculatingBathsCatalog from "./polyscience/circulating-baths.json";
import polyscienceWaterBathsCatalog from "./polyscience/water-baths.json";
import rotzmeierSafetyBarrelsCatalog from "./rotzmeier/safety-barrels.json";
import rotzmeierSafetyCanistersCatalog from "./rotzmeier/safety-canisters.json";
import rotzmeierSafetyCansCatalog from "./rotzmeier/safety-cans.json";
import rotzmeierAccessoriesCatalog from "./rotzmeier/accessories.json";
import rotzmeierSafetyFunnelsCatalog from "./rotzmeier/safety-funnels.json";
import rotzmeierTransportationContainersCatalog from "./rotzmeier/transportation-containers.json";
import thalesnanoCatalog from "./thalesnano/h-cube-systems.json";
import thalesnanoHydrogenGasGeneratorsCatalog from "./thalesnano/hydrogen-gas-generators.json";
import thalesnanoPhoenixFlowSystemsCatalog from "./thalesnano/phoenix-flow-systems.json";
import thalesnanoPhotocubeCatalog from "./thalesnano/photocube.json";
import spGenevacCentrifugalEvaporatorsCatalog from "./sp-genevac/centrifugal-evaporators.json";
import spGenevacBenchtopEvaporatorsCatalog from "./sp-genevac/benchtop-evaporators.json";
import radleysAutomatedReactionStationsCatalog from "./radleys/automated-reaction-stations.json";
import radleysJacketedLabReactorsCatalog from "./radleys/jacketed-lab-reactors.json";
import radleysParallelReactionStationsCatalog from "./radleys/parallel-reaction-stations.json";
import radleysAvaLabControlSoftwareCatalog from "./radleys/ava-lab-control-software.json";
import radleysBenchtopAndHotplateToolsCatalog from "./radleys/benchtop-and-hotplate-tools.json";
import workbookProductsCatalog from "./workbook-products.json";
import {
  principalFallbackImages,
  productImageMap,
} from "@/data/products/productImageMap";
import { getPrincipalLogo } from "@/data/products/principalLogos";

let jsonCatalogCategoriesCache;
let jsonCatalogProductsCache;
let jsonCatalogPrincipalSummariesCache;

const principalCatalogs = [
  heidolphCatalog,
  heidolphRotaryEvaporatorsCatalog,
  heidolphLargeScaleRotaryEvaporatorsCatalog,
  heidolphMagneticStirrersCatalog,
  heidolphOverheadStirrersCatalog,
  heidolphShakersAndMixersCatalog,
  heidolphPeristalticPumpsCatalog,
  heidolphVacuumPumpsCatalog,
  brukerFtIrResearchSpectrometersCatalog,
  brukerFtIrMicroscopesCatalog,
  brukerFtIrSpectrometerCatalog,
  brukerFtNirSpectrometerCatalog,
  brukerRamanSpectrometerCatalog,
  brukerRamanMicroscopesCatalog,
  brukerProcessMonitoringSpectrometerCatalog,
  brukerFtIrGasAnalyzerCatalog,
  polyscienceChillersCatalog,
  polyscienceCirculatingBathsCatalog,
  polyscienceWaterBathsCatalog,
  rotzmeierSafetyBarrelsCatalog,
  rotzmeierSafetyCanistersCatalog,
  rotzmeierSafetyCansCatalog,
  rotzmeierAccessoriesCatalog,
  rotzmeierSafetyFunnelsCatalog,
  rotzmeierTransportationContainersCatalog,
  thalesnanoCatalog,
  thalesnanoHydrogenGasGeneratorsCatalog,
  thalesnanoPhoenixFlowSystemsCatalog,
  thalesnanoPhotocubeCatalog,
  spGenevacCentrifugalEvaporatorsCatalog,
  spGenevacBenchtopEvaporatorsCatalog,
  radleysAutomatedReactionStationsCatalog,
  radleysJacketedLabReactorsCatalog,
  radleysParallelReactionStationsCatalog,
  radleysAvaLabControlSoftwareCatalog,
  radleysBenchtopAndHotplateToolsCatalog,
  ...toCatalogList(workbookProductsCatalog),
];

function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function mergeTagValues(...values) {
  return uniqueValues(values.flatMap(toArray));
}

function getPrincipal(catalog) {
  return catalog.principal ?? {};
}

function toCatalogList(catalog) {
  if (Array.isArray(catalog?.principals)) {
    return catalog.principals;
  }

  return [catalog];
}

function getCategories(catalog) {
  return toArray(catalog.categories);
}

function getProductImage(product, principal) {
  const mappedImage = productImageMap[`${principal.slug}:${product.slug}`];
  return (
    product.image ||
    mappedImage ||
    principalFallbackImages[principal.slug] ||
    getPrincipalLogo(principal.slug) ||
    ""
  );
}

function normalizeProduct(product, category, principal) {
  const applications = toArray(product.applications).length
    ? toArray(product.applications)
    : toArray(category.applications);
  const categoryName = product.category ?? category.name;
  const industryTags = mergeTagValues(category.industryTags, product.industryTags);
  const workflowTags = mergeTagValues(category.workflowTags, product.workflowTags);
  const problemSolutionTags = mergeTagValues(
    category.problemSolutionTags,
    product.problemSolutionTags
  );
  const tags = uniqueValues([
    ...toArray(category.tags),
    ...toArray(product.tags),
    ...industryTags,
    ...workflowTags,
    ...problemSolutionTags,
    category.name,
    principal.principalName,
  ]);

  return {
    ...product,
    image: getProductImage(product, principal),
    category: categoryName,
    categorySlug: product.categorySlug ?? category.slug,
    industry: product.industry ?? category.industry ?? categoryName,
    industryTags,
    workflowTags,
    problemSolutionTags,
    applications,
    tags,
    principalSlug: principal.slug,
    principalName: principal.principalName,
    countryOfOrigin: product.countryOfOrigin ?? principal.countryOfOrigin,
    href: `/products/${product.slug}`,
    apiPath: `/api/products/${principal.slug}/${product.slug}`,
    hasDetails: true,
    source: "json-catalog",
  };
}

export function getJsonCatalogs() {
  return principalCatalogs;
}

function getAllJsonCatalogCategories() {
  if (!jsonCatalogCategoriesCache) {
    jsonCatalogCategoriesCache = principalCatalogs.flatMap((catalog) => {
      const principal = getPrincipal(catalog);

      return getCategories(catalog).map((category) => ({
        ...category,
        principalSlug: principal.slug,
        principalName: principal.principalName,
        products: toArray(category.products).map((product) =>
          normalizeProduct(product, category, principal)
        ),
      }));
    });
  }

  return jsonCatalogCategoriesCache;
}

export function getJsonCatalogCategories(principalSlug) {
  const categories = getAllJsonCatalogCategories();

  if (!principalSlug) {
    return categories;
  }

  return categories.filter((category) => category.principalSlug === principalSlug);
}

export function getJsonCatalogProducts() {
  if (!jsonCatalogProductsCache) {
    jsonCatalogProductsCache = getAllJsonCatalogCategories().flatMap(
      (category) => category.products
    );
  }

  return jsonCatalogProductsCache;
}

export function getJsonCatalogPrincipalBySlug(principalSlug) {
  const catalog = principalCatalogs.find(
    (item) => getPrincipal(item).slug === principalSlug
  );

  if (!catalog) {
    return undefined;
  }

  const principal = getPrincipal(catalog);
  const categories = getJsonCatalogCategories(principal.slug);

  return {
    ...principal,
    categories,
    products: categories.flatMap((category) => category.products),
  };
}

export function getJsonCatalogPrincipalSummaries() {
  if (!jsonCatalogPrincipalSummariesCache) {
    const slugs = uniqueValues(
      principalCatalogs.map((catalog) => getPrincipal(catalog).slug)
    );

    jsonCatalogPrincipalSummariesCache = slugs
      .map((slug) => getJsonCatalogPrincipalBySlug(slug))
      .filter(Boolean);
  }

  return jsonCatalogPrincipalSummariesCache;
}

export function getJsonCatalogProductByPrincipalAndSlug(
  principalSlug,
  productSlug
) {
  return getJsonCatalogProducts().find(
    (product) =>
      product.principalSlug === principalSlug && product.slug === productSlug
  );
}

export function getJsonCatalogProductBySlug(productSlug) {
  return getJsonCatalogProducts().find((product) => product.slug === productSlug);
}
