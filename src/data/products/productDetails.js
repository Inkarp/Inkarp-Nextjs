export const productDetails = [
  {
    slug: "hei-vap-core-rotary-Evaporator",
    principalSlug: "photon-etc",
    principalName: "Photon Etc",
    name: "Hyperspectral Imaging Systems",
    category: "Imaging and Microscopy",
    href: "/products/hyperspectral-imaging-systems",
    apiPath: "/api/products/photon-etc/hyperspectral-imaging-systems",
    metaTitle: "Photon Etc Hyperspectral Imaging Systems in India - Inkarp",
    metaDescription:
      "Explore Photon Etc hyperspectral imaging systems for advanced spectral imaging, material analysis, life sciences, and research applications in India.",
    overview:
      "Photon Etc hyperspectral imaging systems combine high-quality imaging with spectral information to help researchers identify, compare, and characterize samples across scientific and industrial applications.",
    features: [
      "High-resolution spectral image acquisition",
      "Useful for non-destructive sample analysis",
      "Supports material, biological, and chemical imaging workflows",
      "Designed for advanced laboratory and research environments",
      "Can be configured for application-specific spectral ranges",
    ],
    technicalSpecs: [
      {
        label: "Technology",
        value: "Hyperspectral imaging",
      },
      {
        label: "Principal",
        value: "Photon Etc",
      },
      {
        label: "Country of Origin",
        value: "Canada",
      },
      {
        label: "Applications",
        value: "Material analysis, life sciences, chemical imaging, research",
      },
    ],
    applications: [
      "Material characterization",
      "Life science imaging",
      "Chemical distribution mapping",
      "Nanotechnology research",
      "Quality and research analysis",
    ],
    caseStudies: [
      {
        title: "Spectral imaging for material identification",
        description:
          "Researchers can use hyperspectral imaging to compare spectral signatures across a sample and identify differences that are not visible in normal imaging.",
      },
    ],
    faqs: [
      {
        question: "What is hyperspectral imaging used for?",
        answer:
          "It is used to capture both spatial and spectral information from a sample, helping users analyze composition, variation, and distribution.",
      },
      {
        question: "Can this product page be expanded later?",
        answer:
          "Yes. Add brochures, images, detailed specifications, videos, and application notes to this same data object.",
      },
    ],
  },
];

export function getProductDetailBySlug(productSlug) {
  return productDetails.find((product) => product.slug === productSlug);
}

export function getProductDetailByPrincipalAndSlug(principalSlug, productSlug) {
  return productDetails.find(
    (product) =>
      product.principalSlug === principalSlug && product.slug === productSlug
  );
}
