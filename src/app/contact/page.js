import ContactForm from "@/components/contact/ContactForm";
import LocationCards from "@/components/contact/LocationCards";
import SupportSection from "@/components/contact/SupportSection";
import ServiceMap from "@/components/products/sections/ServiceMap";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/contact");

export default function ContactUs() {
  return (
    <main className="overflow-hidden">
      <BreadcrumbJsonLd path="/contact" />
      <PageBreadcrumbs path="/contact" />
      <LocationCards />
      <ServiceMap />
      <SupportSection />
      <ContactForm />
    </main>
  );
}
