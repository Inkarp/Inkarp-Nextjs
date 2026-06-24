import Image from "next/image";
import ProductHandlingGuide from "@/components/service/ProductHandlingGuide";
import ServiceAbout from "@/components/service/ServiceAbout";
import ServiceContactForm from "@/components/service/ServiceContactForm";
import ServiceTabs from "@/components/service/ServiceTabs";

export const metadata = {
  title: "Inkarp Services | Scientific Instrument Installation, Maintenance & Support in India",
  description:
    "Discover Inkarp's trusted service solutions for scientific instruments in India. From product installation and technical support to preventive maintenance, AMCs, and genuine spare parts, we ensure reliable performance and smooth research operations. Backed by 40+ years of expertise and nationwide service teams.",
  alternates: {
    canonical: "https://inkarp.co.in/service",
  },
};

export default function ServicePage() {
  return (
    <main className="relative w-full overflow-hidden">
      {/* Banner */}
      <div className="relative mb-6 h-56 w-full overflow-hidden rounded-2xl sm:h-72 lg:h-96">
        <Image
          alt="Inkarp Service"
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="/assets/service/BannerImage.jpg"
        />
      </div>

      {/* Intro */}
      <div className="mx-auto mb-8 w-[95%] rounded-xl border-l-4 border-[#E63946] bg-white p-3 shadow-sm dark:bg-zinc-900">
        <p className="font-maxot text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">
          At Inkarp Instruments, service is more than just support — it is the
          backbone of our partnership with scientists, researchers, and
          industries across India. For over 40 years, we have delivered
          world-class instruments backed by one of the most trusted service
          networks in the country. Our factory-trained engineers, application
          specialists, and service managers ensure smooth research journeys
          with quick response times, genuine spares, and expert technical
          care from installation to long-term maintenance.
        </p>

        <p className="font-maxot mt-4 text-lg leading-relaxed text-[#E63946]">
          Every lab is unique, and so are its needs. That&apos;s why our
          service portfolio covers installation, technical support,
          preventive care, long-term maintenance, and spares replacement.
          With Inkarp, you don&apos;t just buy an instrument — you invest in a
          partnership built on performance, reliability, and trust.
        </p>

        <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-800 dark:text-zinc-300">
          Below are the five major types of services we provide, each crafted
          to meet the real-world demands of laboratories and industries
          across India.
        </p>
      </div>

      <div className="space-y-3">
        <ServiceTabs />
        <ServiceAbout />
        <ProductHandlingGuide />
        <ServiceContactForm />
      </div>
    </main>
  );
}
