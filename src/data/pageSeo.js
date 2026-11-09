export const SITE_URL = "https://inkarp.co.in";
export const SITE_NAME = "Inkarp Instruments";
export const SITE_AUTHOR = "Inkarp Instruments Pvt Ltd";
export const SITE_PUBLISHER = "Inkarp Instruments Pvt Ltd";

// Social share card shown by WhatsApp, LinkedIn, X, Slack etc. Every page falls
// back to this unless its pageSeo entry sets its own `image`. Replace with a
// purpose-made 1200x630 banner when one is available — the current file is a
// 1672x941 photo, which crops acceptably but is not ideal.
export const SITE_OG_IMAGE = "/assets/home/inkarp-lab-hero-generated.png";
export const SITE_OG_IMAGE_ALT =
  "Inkarp Instruments — laboratory and analytical instrumentation across India";

export const pageSeo = {
  "/": {
    label: "Home",
    title:
      "Inkarp Instruments — Lab Equipment Distributor & Service in India",
    description:
      "Inkarp Instruments: authorised distributor & service provider of laboratory and analytical instruments in India since 1985. 475+ products from 45+ global brands.",
    keywords:
      "laboratory equipment distributor india, lab instruments supplier india, analytical instruments india, scientific equipment distributor, inkarp instruments",
  },
  "/products": {
    label: "Products",
    title:
      "Lab Instruments & Equipment Catalogue — India | Inkarp",
    description:
      "Browse 475+ laboratory and analytical instruments from 45+ global brands. Inkarp is the authorised distributor and service provider across India. Get a quote or demo.",
    keywords:
      "laboratory instruments india, lab equipment catalogue, analytical instruments catalogue, scientific equipment india, inkarp products",
  },
  "/magazine": {
    label: "Magazine",
    title: "CATALYSTCue — Inkarp Magazine for Lab Insights & Trends",
    description:
      "CATALYSTCue, the Inkarp magazine: laboratory technology insights, application stories, product launches and trends in scientific instrumentation in India.",
    keywords:
      "CATALYSTCue, inkarp magazine, lab technology magazine, scientific instrument news, laboratory trends india",
  },
  "/application-resources": {
    label: "Application Resources",
    title: "Application Notes & Lab Resources | Inkarp India",
    description:
      "Download application notes, technical guides and resources for laboratory instruments across pharma, chemical, food, battery and research applications.",
    keywords:
      "application notes, lab instrument guides, technical resources, analytical applications, inkarp resources",
  },
  "/blog": {
    label: "Blog",
    title: "Lab Equipment Blog — Guides & Buying Advice | Inkarp",
    description:
      "Expert blogs on choosing, using and maintaining laboratory instruments. Buying guides, comparisons and how-tos from Inkarp's product specialists.",
    keywords:
      "lab equipment blog, instrument buying guide, laboratory how-to, inkarp blog, scientific equipment advice",
  },
  "/events": {
    label: "Events",
    title: "Events & Exhibitions — Meet Inkarp Instruments",
    description:
      "Meet Inkarp Instruments at upcoming laboratory and scientific exhibitions, conferences and roadshows across India. See live demos of our latest instruments.",
    keywords:
      "lab equipment events india, scientific exhibitions india, inkarp events, instrument trade shows",
  },
  "/webinars": {
    label: "Webinars",
    title: "Webinars on Lab Instruments & Applications | Inkarp",
    description:
      "Join live and on-demand webinars by Inkarp and global brand experts on laboratory instruments, applications and best practices. Register free.",
    keywords:
      "laboratory webinars india, lab instrument webinar, scientific webinar, on-demand lab training, inkarp webinars",
  },
  "/contact": {
    label: "Contact",
    title: "Contact Inkarp Instruments — Sales, Demo & Service",
    description:
      "Contact Inkarp Instruments for quotes, demos, installation and service of laboratory instruments. Offices across India. Call, email or send an enquiry.",
    keywords:
      "contact inkarp instruments, inkarp phone number, inkarp office, lab equipment quote, lab equipment demo request",
  },
  "/our-story": {
    label: "Our Story",
    title: "Our Story — Inkarp Instruments Since 1985",
    description:
      "Since 1985, Inkarp Instruments has partnered with global brands to bring world-class laboratory and analytical instruments, service and support to labs across India.",
    keywords:
      "about inkarp instruments, inkarp history, inkarp company profile, lab equipment company india",
  },
  "/awards": {
    label: "Awards & Recognitions",
    title: "Awards & Recognitions — Inkarp Instruments",
    description:
      "Awards and recognitions earned by Inkarp Instruments from global principals and industry bodies for excellence in sales, service and support in India.",
    keywords:
      "inkarp awards, inkarp recognitions, best distributor award, lab equipment distributor awards",
  },
  "/service": {
    label: "Service & Support",
    title: "Lab Instrument Service, AMC & Calibration | Inkarp",
    description:
      "Factory-trained engineers for installation, AMC, calibration, repairs and spare parts for laboratory instruments across India. Raise a service request.",
    keywords:
      "lab instrument service india, laboratory equipment amc, instrument calibration service, lab equipment repair, spare parts",
  },
  "/careers": {
    label: "Careers",
    title: "Careers at Inkarp Instruments — Join Our Team",
    description:
      "Build your career in scientific instrumentation with Inkarp Instruments. Explore openings in sales, service, applications and marketing across India.",
    keywords:
      "inkarp careers, inkarp jobs, lab equipment sales jobs, service engineer jobs, application scientist jobs india",
  },
  "/workflows": {
    label: "Workflows",
    title: "Lab Workflow Solutions by Application | Inkarp India",
    description:
      "Explore complete lab workflows – sample prep, synthesis, purification, analysis – with matched instruments from Inkarp's global brands. Talk to an application expert.",
    keywords:
      "lab workflow solutions, laboratory workflow, sample preparation workflow, purification workflow, analytical workflow india",
  },
};

export function getCanonicalUrl(path) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function metadataFromSeo(seo, path) {
  // Absolute URL — WhatsApp/LinkedIn/X will not resolve a relative og:image.
  // Only the default share image is known to be 1200x630; a page's own photo
  // (a product shot, a blog banner) goes out without claimed dimensions.
  const image = {
    url: `${SITE_URL}${seo.image ?? SITE_OG_IMAGE}`,
    ...(seo.image ? {} : { width: 1200, height: 630 }),
    alt: seo.imageAlt ?? seo.title ?? SITE_OG_IMAGE_ALT,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
    creator: SITE_AUTHOR,
    publisher: SITE_PUBLISHER,
    alternates: {
      canonical: getCanonicalUrl(path),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: getCanonicalUrl(path),
      siteName: SITE_NAME,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image.url],
    },
  };
}

export function buildPageMetadata(path) {
  return metadataFromSeo(pageSeo[path], path);
}

// For dynamic routes (e.g. /workflows/[industry]/[topic]) that aren't in the
// static pageSeo table — caller supplies title/description/keywords per-record.
// `image` is a site path; WhatsApp and LinkedIn previews only handle JPEG/PNG
// reliably, so anything else falls back to the default share image.
export function buildDynamicMetadata({ path, title, description, keywords, image, imageAlt }) {
  const shareImage = /\.(jpe?g|png)$/i.test(image ?? "") && image.startsWith("/") ? image : undefined;
  return metadataFromSeo({ title, description, keywords, image: shareImage, imageAlt: shareImage ? imageAlt : undefined }, path);
}

// Accepts either a static path (looked up in pageSeo) or an explicit trail of
// { label, href } steps for pages nested deeper than the static table models.
export function buildBreadcrumbJsonLd(pathOrTrail) {
  const trail = Array.isArray(pathOrTrail)
    ? pathOrTrail
    : pathOrTrail === "/" || !pageSeo[pathOrTrail]
      ? []
      : [{ label: pageSeo[pathOrTrail].label, href: pathOrTrail }];

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: pageSeo["/"].label,
      item: getCanonicalUrl("/"),
    },
    ...trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: step.label,
      item: getCanonicalUrl(step.href),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
