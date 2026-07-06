import ContactForm from "@/components/contact/ContactForm";
import LocationCards from "@/components/contact/LocationCards";
import SupportSection from "@/components/contact/SupportSection";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/contact");

export default function ContactUs() {
  return (
    <main className="overflow-hidden bg-white">
      <BreadcrumbJsonLd path="/contact" />
      <PageBreadcrumbs path="/contact" />
      <LocationCards calm/>
      <SupportSection />
      <ContactForm />
    </main>
  );
}
