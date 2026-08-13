import ContactForm from"@/components/contact/ContactForm";
import IndiaNetworkMap from"@/components/contact/IndiaNetworkMap";
import SupportSection from"@/components/contact/SupportSection";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/contact");

export default function ContactUs() {
  return (
    <main className="overflow-hidden bg-white">
      <BreadcrumbJsonLd path="/contact" />
      <PageBreadcrumbs path="/contact" />
      {/* This section now carries the page's h1. */}
      <IndiaNetworkMap as="h1" />
      <SupportSection />
      <ContactForm />
    </main>
  );
}
