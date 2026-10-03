import Image from "next/image";
import { FiExternalLink, FiMapPin, FiNavigation } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import { siteConfig } from "@/data/siteConfig";

export default function HeadOfficeVisit() {
  const { contact, googleBusinessUrl, mapDirectionsUrl, mapEmbedUrl } = siteConfig;

  return (
    <section className="border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" id="head-office">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 max-w-2xl" data-reveal>
          <RecTag>Visit us</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Visit our <em className="italic text-red">head office</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Find us in Nacharam, Hyderabad.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col border border-line-light bg-white">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                alt="Inkarp Instruments head office building in Hyderabad"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                src="/assets/our-story/InkarpBuilding.jpg"
              />
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <p className="flex items-start gap-3 text-sm font-medium leading-relaxed text-ink">
                <FiMapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red" />
                {contact.address}
              </p>
              <div className="mt-auto flex flex-wrap gap-3">
                <a
                  className="inline-flex min-h-11 items-center gap-2 bg-red px-5 text-sm font-semibold text-white shadow-lg shadow-red/15 transition hover:bg-[#a3000e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                  href={mapDirectionsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FiNavigation aria-hidden="true" className="size-4" />
                  Get directions
                </a>
                <a
                  className="inline-flex min-h-11 items-center gap-2 border border-line-light bg-white px-5 text-sm font-semibold text-ink transition hover:border-red hover:text-red"
                  href={googleBusinessUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  See us on Google
                  <FiExternalLink aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border border-line-light bg-white lg:min-h-0">
            <iframe
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
              title="Map showing the Inkarp Instruments head office in Hyderabad"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
