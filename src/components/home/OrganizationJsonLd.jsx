import { SITE_NAME, SITE_URL } from "@/data/pageSeo";
import { siteConfig } from "@/data/siteConfig";

// Company and site details for search engines (knowledge panel, sitelinks
// search box). Shares its @id with the fuller Organization on /contact, so
// Google treats both as the same company.
export default function OrganizationJsonLd() {
  const { contact, company, socials } = siteConfig;

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Inkarp Instruments Pvt Ltd",
      alternateName: company.name,
      url: SITE_URL,
      logo: `${SITE_URL}${company.originalLogo}`,
      foundingDate: "1985",
      email: contact.email,
      sameAs: Object.values(socials),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
