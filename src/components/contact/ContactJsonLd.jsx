import { branches, parseBranchPhones, phoneHref } from "@/data/branches";
import { contactDirectory, SERVICE_DESK } from "@/data/contactDirectory";
import { pageSeo, SITE_URL } from "@/data/pageSeo";
import { siteConfig } from "@/data/siteConfig";

const DIRECTORY_CONTACT_TYPES = {
  import: "import and logistics",
  accounts: "billing support",
  hr: "human resources",
};

function toTel(number) {
  const digits = phoneHref(number);
  return digits.startsWith("+") ? digits : `+91${digits}`;
}

function postalCode(address) {
  const match = address.match(/\b(\d{3})\s?(\d{3})\b/);
  return match ? `${match[1]}${match[2]}` : undefined;
}

// Branch coords are city-level (they place the map pins), not the office's
// own location, so no `geo` here — it would point Google at the wrong spot.
// The full address goes in streetAddress: some branches sit in a
// neighbouring city (Delhi's office is in Ghaziabad), so the branch name
// isn't a safe addressLocality.
function branchSchema(branch) {
  const emails = branch.email.split(",").map((email) => email.trim());

  return {
    "@type": "LocalBusiness",
    name: `Inkarp Instruments – ${branch.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      postalCode: postalCode(branch.address),
      addressCountry: "IN",
    },
    contactPoint: parseBranchPhones(branch.phone).flatMap(({ label, numbers }, index) =>
      numbers.map((number) => ({
        "@type": "ContactPoint",
        contactType: /service/i.test(label) ? "technical support" : "sales",
        telephone: toTel(number),
        email: emails[index],
        areaServed: "IN",
      }))
    ),
  };
}

function buildContactJsonLd() {
  const { contact, company, socials } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/contact`,
    name: pageSeo["/contact"].title,
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Inkarp Instruments Pvt Ltd",
      alternateName: company.name,
      url: SITE_URL,
      logo: `${SITE_URL}${company.originalLogo}`,
      foundingDate: "1985",
      email: contact.email,
      telephone: toTel(contact.phone),
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address.replace(/,\s*Hyderabad.*$/, ""),
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: postalCode(contact.address),
        addressCountry: "IN",
      },
      sameAs: Object.values(socials),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: toTel(contact.phone),
          email: contact.email,
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          contactType: "technical support",
          telephone: toTel(SERVICE_DESK.phone),
          email: SERVICE_DESK.email,
          areaServed: "IN",
        },
        ...contactDirectory.map((entry) => ({
          "@type": "ContactPoint",
          contactType: DIRECTORY_CONTACT_TYPES[entry.id],
          telephone: toTel(entry.phone),
          email: entry.email,
        })),
      ],
      department: branches.map(branchSchema),
    },
  };
}

export default function ContactJsonLd() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildContactJsonLd()) }}
      type="application/ld+json"
    />
  );
}
