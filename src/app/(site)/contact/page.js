import ContactFaq from"@/components/contact/ContactFaq";
import ContactHero from"@/components/contact/ContactHero";
import ContactJsonLd from"@/components/contact/ContactJsonLd";
import ContactSteps from"@/components/contact/ContactSteps";
import HeadOfficeVisit from"@/components/contact/HeadOfficeVisit";
import IndiaNetworkMap from"@/components/contact/IndiaNetworkMap";
import SupportSection from"@/components/contact/SupportSection";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/contact");

export default function ContactUs() {
  return (
    <main className="overflow-hidden bg-white">
      <BreadcrumbJsonLd path="/contact" />
      <ContactJsonLd />
      <PageBreadcrumbs path="/contact" />
      {/* Ways to reach us and the form come first; it carries the page's h1. */}
      <ContactHero />
      <SupportSection />
      <IndiaNetworkMap />
      <HeadOfficeVisit />
      <ContactSteps />
      <ContactFaq />
    </main>
  );
}
