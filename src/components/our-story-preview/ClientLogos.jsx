import Image from "next/image";
import ClientRows from "./ClientRows";
import Eyebrow from "./Eyebrow";
import { CLIENTS } from "./storyContent";

/**
 * The client logos. wall (B): every logo on a grid, popping in one after
 * another. scroll (C): three rows that slide as the page scrolls.
 */
export default function ClientLogos({ variant = "wall" }) {
  const { logos } = CLIENTS;
  const heading = (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
      <Eyebrow>{CLIENTS.eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
        {CLIENTS.title}
      </h2>
    </div>
  );

  if (variant === "scroll") {
    return (
      <section className="overflow-hidden py-20 lg:py-28">
        {heading}
        <ClientRows logos={logos} />
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28">
      {heading}
      <ul className="mx-auto mt-12 grid max-w-[1180px] grid-cols-3 border-l border-t border-line-light sm:grid-cols-4 lg:grid-cols-7">
        {logos.map((logo, index) => (
          <li className="flex items-center justify-center border-b border-r border-line-light bg-white p-3 transition-colors hover:bg-parchment-alt" data-reveal="scale" key={logo.alt} style={{ "--i": index % 7 }}>
            <div className="relative h-14 w-full shrink-0 sm:h-16">
              <Image alt={logo.alt} className="object-contain" fill sizes="160px" src={logo.src} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
