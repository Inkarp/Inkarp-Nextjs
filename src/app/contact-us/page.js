import ContactForm from "@/components/contact/ContactForm";
import LocationCards from "@/components/contact/LocationCards";
import SupportSection from "@/components/contact/SupportSection";
import ServiceMap from "@/components/products/sections/ServiceMap";

export const metadata = {
  title: "Contact Us - Inkarp Instruments",
  description:
    "Get in touch with Inkarp Instruments for sales, service, and support across India. Find our branches and contact details here.",
};

export default function ContactUs() {
  return (
    <main className="overflow-hidden">
      <ServiceMap />
      <LocationCards />
      <SupportSection />
      <ContactForm />
    </main>
  );
}
