export const SITE_URL = "https://inkarp.co.in";
export const SITE_NAME = "Inkarp Instruments";
export const SITE_AUTHOR = "Inkarp Instruments Pvt Ltd";
export const SITE_PUBLISHER = "Inkarp Instruments Pvt Ltd";

export const pageSeo = {
  "/": {
    label: "Home",
    title:
      "Inkarp Instruments — Laboratory Equipment Distributor & Service Provider in India",
    description:
      "Inkarp Instruments is a leading authorized distributor and service provider of laboratory and analytical instruments in India since 1985. Explore 480+ products from 45+ global brands.",
    keywords:
      "lab equipment distributor india, laboratory instruments supplier, analytical instruments india, inkarp instruments, scientific equipment distributor",
  },
  "/products": {
    label: "Products",
    title:
      "Laboratory Instruments & Equipment — Authorized Distributor in India | Inkarp",
    description:
      "Browse 480+ laboratory and analytical instruments from 45+ global brands. Inkarp is the authorized distributor and service provider across India. Request a quote or demo.",
    keywords:
      "laboratory instruments india, lab equipment products, analytical instruments catalog, scientific equipment india, inkarp products",
  },
  "/magazine": {
    label: "Magazine",
    title: "Inkarp Magazine — Lab Insights, Trends & Product News",
    description:
      "Read the Inkarp magazine for laboratory technology insights, application stories, product launches and industry trends in scientific instrumentation.",
    keywords:
      "lab technology magazine, scientific instrument news, laboratory trends india, inkarp magazine",
  },
  "/application-resources": {
    label: "Application Resources",
    title: "Application Notes & Resources — Lab Instrument Guides | Inkarp",
    description:
      "Access application notes, technical guides and resources for laboratory instruments across pharma, chemical, food and research applications.",
    keywords:
      "application notes, lab instrument guides, technical resources, analytical applications, inkarp resources",
  },
  "/blog": {
    label: "Blog",
    title: "Inkarp Blog — Laboratory Equipment Guides & Buying Advice",
    description:
      "Expert blogs on choosing, using and maintaining laboratory instruments. Buying guides, comparisons and how-tos from Inkarp's product specialists.",
    keywords:
      "lab equipment blog, instrument buying guide, laboratory how-to, inkarp blog, scientific equipment advice",
  },
  "/events": {
    label: "Events",
    title: "Events & Exhibitions — Meet Inkarp Instruments",
    description:
      "Find Inkarp Instruments at upcoming laboratory and scientific exhibitions, conferences and events across India.",
    keywords:
      "lab equipment events india, scientific exhibitions, inkarp events, instrument trade shows",
  },
  "/webinars": {
    label: "Webinars",
    title: "Webinars — Laboratory Instrument Training & Demos | Inkarp",
    description:
      "Join Inkarp webinars for product demonstrations, application training and expert sessions on laboratory and analytical instruments.",
    keywords:
      "lab instrument webinars, product demo webinar, analytical training, inkarp webinars",
  },
  "/contact": {
    label: "Contact",
    title: "Contact Inkarp Instruments — Lab Equipment Distributor in India",
    description:
      "Contact Inkarp Instruments for sales, service, demos and support on laboratory instruments. Authorized distributor and service provider across India.",
    keywords:
      "contact inkarp, lab equipment distributor contact, instrument supplier india contact, inkarp hyderabad",
  },
  "/our-story": {
    label: "Our Story",
    title: "Our Story — Inkarp Instruments | Trusted Since 1985",
    description:
      "Learn about Inkarp Instruments — our history since 1985, our mission, and our partnerships with 45+ global laboratory instrument manufacturers across India.",
    keywords:
      "about inkarp, inkarp instruments history, lab equipment company india, our story",
  },
  "/awards": {
    label: "Awards & Recognitions",
    title: "Awards & Recognitions — Inkarp Instruments",
    description:
      "Discover the awards and recognitions earned by Inkarp Instruments as a leading laboratory equipment distributor and service provider in India.",
    keywords:
      "inkarp awards, lab equipment distributor awards, recognitions, inkarp achievements",
  },
  "/service": {
    label: "Service & Support",
    title: "Service & Support — Laboratory Instrument AMC, Calibration | Inkarp",
    description:
      "Inkarp provides installation, AMC, calibration, repair and spare parts for laboratory instruments across India. Expert service for 45+ global brands.",
    keywords:
      "lab instrument service india, amc calibration, instrument repair, laboratory equipment service, inkarp service",
  },
  "/careers": {
    label: "Careers",
    title: "Careers at Inkarp Instruments — Lab Equipment Jobs in India",
    description:
      "Explore careers at Inkarp Instruments. Join a leading laboratory equipment distributor in India — sales, service, application and support roles.",
    keywords:
      "inkarp careers, lab equipment jobs india, scientific instrument jobs, careers hyderabad, inkarp recruitment",
  },
};

export function getCanonicalUrl(path) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function buildPageMetadata(path) {
  const seo = pageSeo[path];

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
    },
  };
}

export function buildBreadcrumbJsonLd(path) {
  const seo = pageSeo[path];
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: pageSeo["/"].label,
      item: getCanonicalUrl("/"),
    },
  ];

  if (path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: seo.label,
      item: getCanonicalUrl(path),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
