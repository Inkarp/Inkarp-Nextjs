import {
    getProductDetailByPrincipalAndSlug,
    getProductDetailBySlug,
} from "./productDetails";
import {
    getJsonCatalogPrincipalBySlug,
    getJsonCatalogPrincipalSummaries,
    getJsonCatalogProductByPrincipalAndSlug,
    getJsonCatalogProductBySlug,
    getJsonCatalogProducts,
} from "@/data/principals/catalog";
import { productMatchesSearch } from "@/lib/productSearch";

function uniqueValues(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
    );
}

function toArray(value) {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value.filter(Boolean) : [value];
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

function mergeProductsByKey(products) {
    const merged = new Map();

    products.filter(Boolean).forEach((product) => {
        merged.set(`${product.principalSlug}:${product.slug}`, product);
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
        "slug": "vacuubrand",
        "principalName": "Vacuubrand",
        "countryOfOrigin": "Germany",
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
        "slug": "brookfield",
        "principalName": "Brookfield",
        "countryOfOrigin": "United States of America",
        "products": []
    },
    {
        "slug": "khimod",
        "principalName": "Khimod",
        "countryOfOrigin": "France",
        "products": []
    },
    {
        "slug": "rotachrom",
        "principalName": "RotaChrom",
        "countryOfOrigin": "Hungary",
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
        "slug": "lumicks",
        "principalName": "Lumicks",
        "countryOfOrigin": "Netherlands",
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
        "slug": "being",
        "principalName": "Being",
        "countryOfOrigin": "China",
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
        "slug": "dlab",
        "principalName": "DLAB",
        "countryOfOrigin": "China",
        "products": []
    },
    {
        "slug": "mettler-toledo",
        "principalName": "Mettler Toledo",
        "countryOfOrigin": "Switzerland",
        "products": []
    },
    {
        "slug": "inkarp-usb",
        "principalName": "Inkarp USB",
        "countryOfOrigin": "India",
        "products": []
    }
];

export function getAllPrincipals() {
    const slugs = uniqueValues([
        ...productPrincipals.map((principal) => principal.slug),
        ...getJsonCatalogPrincipalSummaries().map((principal) => principal.slug),
    ]);

    return slugs.map((slug) => getPrincipalBySlug(slug)).filter(Boolean);
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

    const principal = productPrincipals.find((item) => item.slug === principalSlug);
    const product = principal?.products.find((item) => item.slug === productSlug);

    if (!principal || !product) {
        return undefined;
    }

    const detail = getProductDetailByPrincipalAndSlug(principalSlug, productSlug);
    const metadata = { ...product, ...detail };
    const taxonomy = getProductTaxonomy(product.name, metadata);
    const applications = toArray(metadata.applications);
    const tags = uniqueValues([...toArray(product.tags), ...toArray(detail?.tags)]);

    return {
        ...product,
        ...detail,
        category: metadata.category ?? taxonomy.industry,
        industry: metadata.industry ?? metadata.category ?? taxonomy.industry,
        applications: applications.length ? applications : taxonomy.applications,
        tags,
        principalSlug: principal.slug,
        principalName: principal.principalName,
        countryOfOrigin: metadata.countryOfOrigin ?? principal.countryOfOrigin,
        href: `/products/${product.slug}`,
        apiPath: `/api/products/${principal.slug}/${product.slug}`,
        hasDetails: Boolean(detail),
    };
}

export function getProductBySlug(productSlug) {
    const jsonProduct = getJsonCatalogProductBySlug(productSlug);

    if (jsonProduct) {
        return jsonProduct;
    }

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
    const legacyProducts = productPrincipals.flatMap((principal) =>
        principal.products.map((product) =>
            getProductByPrincipalAndSlug(principal.slug, product.slug)
        )
    );

    return mergeProductsByKey([...legacyProducts, ...getJsonCatalogProducts()]);
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
        categories: uniqueValues(products.map((product) => product.category)),
    };
}

export function searchProducts(filters = {}) {
    const query = filters.q?.trim().toLowerCase();
    const selectedPrincipals = toArray(filters.principals ?? filters.principal);

    return getAllProducts().filter((product) => {
        return (
            productMatchesSearch(product, query) &&
            (!selectedPrincipals.length ||
                selectedPrincipals.includes(product.principalSlug)) &&
            (!filters.country || product.countryOfOrigin === filters.country) &&
            (!filters.industry || product.industry === filters.industry) &&
            (!filters.application ||
                (product.applications ?? []).includes(filters.application)) &&
            (!filters.details || product.hasDetails)
        );
    });
}
