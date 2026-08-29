import {
    getProductDetailByPrincipalAndSlug,
    getProductDetailBySlug,
    productDetails,
} from "./productDetails";
import {
    getJsonCatalogPrincipalBySlug,
    getJsonCatalogPrincipalSummaries,
    getJsonCatalogProductByPrincipalAndSlug,
    getJsonCatalogProductBySlug,
    getJsonCatalogProducts,
} from "@/data/principals/catalog";
import { productMatchesSearch } from "@/lib/productSearch";
import { getAuthorizedRegion } from "@/data/products/authorizedRegions";

let allProductsCache;
let allPrincipalsCache;

function uniqueValues(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b))
    );
}

function toArray(value) {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function toTextValue(value) {
    if (value && typeof value === "object") {
        return value.title || value.name || value.label || value.description || "";
    }

    return value;
}

function getApplicationFilterValues(product) {
    const sheetApplications = toArray(product.processApplication).map(toTextValue).filter(Boolean);

    return sheetApplications.length
        ? sheetApplications
        : toArray(product.applications).map(toTextValue).filter(Boolean);
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

function mergeArrayValues(...values) {
    return uniqueValues(values.flatMap(toArray));
}

function mergeProductsByKey(products) {
    const merged = new Map();

    products.filter(Boolean).forEach((product) => {
        const key = `${product.principalSlug}:${product.slug}`;
        const existing = merged.get(key);

        if (!existing) {
            merged.set(key, product);
            return;
        }

        merged.set(key, {
            ...existing,
            ...product,
            applications: mergeArrayValues(existing.applications, product.applications),
            tags: mergeArrayValues(existing.tags, product.tags),
            searchTags: mergeArrayValues(existing.searchTags, product.searchTags),
            industryTags: mergeArrayValues(existing.industryTags, product.industryTags),
            workflowTags: mergeArrayValues(existing.workflowTags, product.workflowTags),
            problemSolutionTags: mergeArrayValues(
                existing.problemSolutionTags,
                product.problemSolutionTags
            ),
        });
    });

    return [...merged.values()];
}
export const productPrincipals = [
    {
        "slug": "heidolph",
        "principalName": "Heidolph",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "radleys",
        "principalName": "Radleys",
        "countryOfOrigin": "United Kingdom",
        "products": []
    },
    {
        "slug": "rotzmeier",
        "principalName": "Rotzmeier",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "polyscience",
        "principalName": "PolyScience",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "thalesnano",
        "principalName": "ThalesNano",
        "countryOfOrigin": "Hungary",
        "products": []
    },
    {
        "slug": "sp-genevac",
        "principalName": "SP Genevac",
        "countryOfOrigin": "United Kingdom",
        "products": []
    },
    {
        "slug": "bruker",
        "principalName": "Bruker",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "nanalysis",
        "principalName": "Nanalysis",
        "countryOfOrigin": "Canada",
        "products": []
    },
    {
        "slug": "ecom",
        "principalName": "ECOM",
        "countryOfOrigin": "Czech Republic",
        "products": []
    },
    {
        "slug": "advion-interchim-scientific",
        "principalName": "Advion Interchim Scientific",
        "countryOfOrigin": "United States of America \u0026 France",
        "products": []
    },
    {
        "slug": "labomatic",
        "principalName": "Labomatic",
        "countryOfOrigin": "Switzerland",
        "products": []
    },
    {
        "slug": "khimod",
        "principalName": "Khimod",
        "countryOfOrigin": "France",
        "products": []
    },
    {
        "slug": "hohsen-corp",
        "principalName": "Hohsen Corp",
        "countryOfOrigin": "Japan",
        "products": []
    },
    {
        "slug": "maccor",
        "principalName": "Maccor",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "fom-technologies",
        "principalName": "FOM Technologies",
        "countryOfOrigin": "Denmark",
        "products": []
    },
    {
        "slug": "labstation-i",
        "principalName": "Labstation i",
        "countryOfOrigin": "India",
        "products": []
    },
    {
        "slug": "luzchem",
        "principalName": "Luzchem",
        "countryOfOrigin": "Canada",
        "products": []
    },
    {
        "slug": "robot-coupe",
        "principalName": "Robot Coupe",
        "countryOfOrigin": "France",
        "products": []
    },
    {
        "slug": "bandelin",
        "principalName": "Bandelin",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "kubota",
        "principalName": "Kubota",
        "countryOfOrigin": "Japan",
        "products": []
    },
    {
        "slug": "jeiotech",
        "principalName": "JeioTech",
        "countryOfOrigin": "South Korea",
        "products": []
    },
    {
        "slug": "sonics-and-materials",
        "principalName": "Sonics \u0026 Materials",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "zeiss",
        "principalName": "Zeiss",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "dara-lyo",
        "principalName": "Dara-Lyo",
        "countryOfOrigin": "Spain",
        "products": []
    },
    {
        "slug": "photon-etc",
        "principalName": "Photon Etc",
        "countryOfOrigin": "Canada",
        "products": []
    },
    {
        "slug": "nenovision-s-r-o",
        "principalName": "NenoVision s.r.o.",
        "countryOfOrigin": "Czech Republic",
        "products": []
    },
    {
        "slug": "implen",
        "principalName": "Implen",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "nanosurf",
        "principalName": "Nanosurf",
        "countryOfOrigin": "Switzerland",
        "products": []
    },
    {
        "slug": "bwb-technologies",
        "principalName": "BWB Technologies",
        "countryOfOrigin": "United Kingdom",
        "products": []
    },
    {
        "slug": "reichert-technologies",
        "principalName": "Reichert Technologies",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "affinite-instruments",
        "principalName": "Affinite Instruments",
        "countryOfOrigin": "Canada",
        "products": []
    },
    {
        "slug": "sbt-instruments",
        "principalName": "SBT Instruments",
        "countryOfOrigin": "Denmark",
        "products": []
    },
    {
        "slug": "evonik",
        "principalName": "Evonik",
        "countryOfOrigin": "Canada",
        "products": []
    },
    {
        "slug": "gea",
        "principalName": "Gea",
        "countryOfOrigin": "Italy",
        "products": []
    },
    {
        "slug": "hitachi",
        "principalName": "Hitachi",
        "countryOfOrigin": "Japan",
        "products": []
    },
    {
        "slug": "proscientific",
        "principalName": "ProScientific",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "thermofisher-scientific",
        "principalName": "ThermoFisher Scientific",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "chemspeed",
        "principalName": "Chemspeed",
        "countryOfOrigin": "Switzerland",
        "products": []
    },
    {
        "slug": "waters",
        "principalName": "Waters",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "sartorius",
        "principalName": "Sartorius",
        "countryOfOrigin": "Germany",
        "products": []
    },
    {
        "slug": "buchi",
        "principalName": "Buchi",
        "countryOfOrigin": "Switzerland",
        "products": []
    },
    {
        "slug": "mettler-toledo",
        "principalName": "Mettler Toledo",
        "countryOfOrigin": "Switzerland",
        "products": []
    }
];

export function getAllPrincipals() {
    if (!allPrincipalsCache) {
        const slugs = uniqueValues([
            ...productPrincipals.map((principal) => principal.slug),
            ...getJsonCatalogPrincipalSummaries().map((principal) => principal.slug),
        ]);

        allPrincipalsCache = slugs.map((slug) => getPrincipalBySlug(slug)).filter(Boolean);
    }

    return allPrincipalsCache;
}

export function getPrincipalBySlug(slug) {
    const principal = productPrincipals.find((item) => item.slug === slug);
    const jsonPrincipal = getJsonCatalogPrincipalBySlug(slug);

    if (!principal && !jsonPrincipal) {
        return undefined;
    }

    const legacyProducts = principal
        ? principal.products.map((product) => ({
            ...getProductByPrincipalAndSlug(principal.slug, product.slug),
        }))
        : [];
    const products = mergeProductsByKey([
        ...legacyProducts,
        ...(jsonPrincipal?.products ?? []),
    ]);

    return {
        slug: principal?.slug ?? jsonPrincipal.slug,
        principalName: principal?.principalName ?? jsonPrincipal.principalName,
        countryOfOrigin:
            principal?.countryOfOrigin ?? jsonPrincipal.countryOfOrigin,
        categories: jsonPrincipal?.categories ?? [],
        products,
    };
}

export function getProductByPrincipalAndSlug(principalSlug, productSlug) {
    const jsonProduct = getJsonCatalogProductByPrincipalAndSlug(
        principalSlug,
        productSlug
    );

    if (jsonProduct) {
        return jsonProduct;
    }

    const detail = getProductDetailByPrincipalAndSlug(principalSlug, productSlug);

    if (detail) {
        return normalizeStandaloneProductDetail(detail);
    }

    const principal = productPrincipals.find((item) => item.slug === principalSlug);
    const product = principal?.products.find((item) => item.slug === productSlug);

    if (!principal || !product) {
        return undefined;
    }

    const metadata = { ...product, ...detail };
    const taxonomy = getProductTaxonomy(product.name, metadata);
    const applications = toArray(metadata.applications);
    const industryTags = uniqueValues([
        ...toArray(product.industryTags),
        ...toArray(detail?.industryTags),
    ]);
    const workflowTags = uniqueValues([
        ...toArray(product.workflowTags),
        ...toArray(detail?.workflowTags),
    ]);
    const problemSolutionTags = uniqueValues([
        ...toArray(product.problemSolutionTags),
        ...toArray(detail?.problemSolutionTags),
    ]);
    const tags = uniqueValues([
        ...toArray(product.tags),
        ...toArray(detail?.tags),
        ...industryTags,
        ...workflowTags,
        ...problemSolutionTags,
    ]);

    return {
        ...product,
        ...detail,
        category: metadata.category ?? taxonomy.industry,
        industry: metadata.industry ?? metadata.category ?? taxonomy.industry,
        applications: applications.length ? applications : taxonomy.applications,
        industryTags,
        workflowTags,
        problemSolutionTags,
        tags,
        principalSlug: principal.slug,
        principalName: principal.principalName,
        countryOfOrigin: metadata.countryOfOrigin ?? principal.countryOfOrigin,
        authorizedRegion: getAuthorizedRegion(principal.slug),
        href: `/products/${product.slug}`,
        apiPath: `/api/products/${principal.slug}/${product.slug}`,
        hasDetails: Boolean(detail),
    };
}

function normalizeStandaloneProductDetail(detail) {
    const principal =
        productPrincipals.find((item) => item.slug === detail.principalSlug) ??
        getJsonCatalogPrincipalBySlug(detail.principalSlug);
    const taxonomy = getProductTaxonomy(detail.name, detail);
    const applications = toArray(detail.applications);
    const industryTags = toArray(detail.industryTags);
    const workflowTags = toArray(detail.workflowTags);
    const problemSolutionTags = toArray(detail.problemSolutionTags);
    const tags = uniqueValues([
        ...toArray(detail.tags),
        ...industryTags,
        ...workflowTags,
        ...problemSolutionTags,
        detail.category,
        detail.principalName ?? principal?.principalName,
    ]);

    return {
        ...detail,
        category: detail.category ?? taxonomy.industry,
        industry: detail.industry ?? detail.category ?? taxonomy.industry,
        applications: applications.length ? applications : taxonomy.applications,
        industryTags,
        workflowTags,
        problemSolutionTags,
        tags,
        principalSlug: detail.principalSlug,
        principalName: detail.principalName ?? principal?.principalName,
        countryOfOrigin: detail.countryOfOrigin ?? principal?.countryOfOrigin,
        authorizedRegion: detail.authorizedRegion ?? getAuthorizedRegion(detail.principalSlug),
        href: detail.href ?? `/products/${detail.slug}`,
        apiPath: detail.apiPath ?? `/api/products/${detail.principalSlug}/${detail.slug}`,
        hasDetails: true,
    };
}

export function getProductBySlug(productSlug) {
    const jsonProduct = getJsonCatalogProductBySlug(productSlug);

    if (jsonProduct) {
        return jsonProduct;
    }

    const detail = getProductDetailBySlug(productSlug);

    if (detail) {
        return normalizeStandaloneProductDetail(detail);
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
    if (!allProductsCache) {
        const legacyProducts = productPrincipals.flatMap((principal) =>
            principal.products.map((product) =>
                getProductByPrincipalAndSlug(principal.slug, product.slug)
            )
        );
        const standaloneDetailProducts = productDetails.map((detail) =>
            normalizeStandaloneProductDetail(detail)
        );

        allProductsCache = mergeProductsByKey([
            ...legacyProducts,
            ...standaloneDetailProducts,
            ...getJsonCatalogProducts(),
        ]).sort((a, b) =>
            String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
    }

    return allProductsCache;
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
        applications: uniqueValues(products.flatMap(getApplicationFilterValues)),
        categories: uniqueValues(products.map((product) => product.category)),
    };
}

export function searchProducts(filters = {}) {
    const query = filters.q?.trim().toLowerCase();
    const selectedPrincipals = toArray(filters.principals ?? filters.principal);
    const selectedIndustries = toArray(filters.industries);
    const selectedApplications = toArray(filters.applications ?? filters.application);

    return getAllProducts().filter((product) => {
        return (
            productMatchesSearch(product, query) &&
            (!selectedPrincipals.length ||
                selectedPrincipals.includes(product.principalSlug)) &&
            (!selectedIndustries.length ||
                (product.industryTags ?? []).some((tag) => selectedIndustries.includes(tag))) &&
            (!filters.country || product.countryOfOrigin === filters.country) &&
            (!filters.industry || product.industry === filters.industry) &&
            (!selectedApplications.length ||
                getApplicationFilterValues(product).some((application) =>
                    selectedApplications.includes(application)
                )) &&
            (!filters.details || product.hasDetails)
        );
    });
}
