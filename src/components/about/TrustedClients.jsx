import Image from "next/image";
import SectionHeading from "@/components/home/SectionHeading";

const logos = [
  ["Alembic.png", "Alembic"],
  ["Aragen.png", "Aragen"],
  ["Aurobindo.png", "Aurobindo"],
  ["Basf.png", "BASF"],
  ["Biocon.png", "Biocon"],
  ["Divis.png", "Divis"],
  ["Eisai.png", "Eisai"],
  ["Gland.png", "Gland"],
  ["Granuals.png", "Granules"],
  ["GVK.png", "GVK"],
  ["Hikal.png", "Hikal"],
  ["Macleods.png", "Macleods"],
  ["Mylan.png", "Mylan"],
  ["Natco.png", "Natco"],
  ["Pi.png", "PI Industries"],
  ["Reddy.png", "Dr. Reddy's"],
  ["Sai.png", "Sai Life Sciences"],
  ["Srigene.png", "Srigene"],
  ["Syngene.png", "Syngene"],
  ["Syngenta.png", "Syngenta"],
  ["Tcg.png", "TCG"],
].map(([file, alt]) => ({
  alt,
  src: `/assets/our-story/clients/${file}`,
}));

export default function TrustedClients() {
  const marqueeLogos = [...logos, ...logos];

  return (
    <section className="relative mx-auto w-full overflow-hidden px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_460px_at_20%_0%,rgba(190,0,16,0.08),transparent),radial-gradient(1000px_460px_at_80%_100%,rgba(230,57,70,0.08),transparent)]" />

      <SectionHeading
        eyebrow="Our Clients"
        title="Trusted by Industry Leaders"
      />

      <div className="mx-auto max-w-6xl overflow-hidden border-y border-zinc-100 bg-white/85 py-4 shadow-sm">
        <div className="flex w-max animate-[logo-marquee_42s_linear_infinite] items-center gap-8 pr-8 hover:[animation-play-state:paused]">
          {marqueeLogos.map((logo, index) => (
            <div
              className="relative flex h-20 w-36 shrink-0 items-center justify-center sm:h-24 sm:w-44"
              key={`${logo.alt}-${index}`}
            >
              <Image
                alt={logo.alt}
                className="object-contain"
                fill
                sizes="176px"
                src={logo.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
