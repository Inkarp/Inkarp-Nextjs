import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import { DIRECTORS } from "./storyContent";

function LinkedIn({ person, compact = false }) {
  return (
    <a
      aria-label={`${person.name} on LinkedIn`}
      className={`inline-flex w-fit items-center gap-2 border border-line-light text-xs font-semibold text-ink-soft transition hover:border-red hover:text-red ${compact ? "size-9 justify-center" : "px-3 py-1.5"}`}
      href={person.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FaLinkedin aria-hidden="true" className="size-4 text-red" />
      {compact ? null : "Connect on LinkedIn"}
    </a>
  );
}

function Heading({ center = false }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow className={center ? "justify-center" : ""}>{DIRECTORS.eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
        {DIRECTORS.title}
      </h2>
      <p className={`mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg ${center ? "mx-auto" : ""}`} data-reveal style={{ "--i": 1 }}>
        {DIRECTORS.description}
      </p>
    </div>
  );
}

/**
 * The four directors. portraits (B): tall portraits in a row. rows (C): a
 * register, one row per director sliding in from the left.
 */
export default function Directors({ variant = "portraits" }) {
  const { people } = DIRECTORS;

  if (variant === "rows") {
    return (
      <section className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Heading />
        <ol className="mt-12 border-b border-line-light">
          {people.map((person, index) => (
            <li
              className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-4 border-t border-line-light py-7 lg:grid-cols-[44px_120px_230px_minmax(0,1fr)_auto] lg:items-start lg:gap-7"
              data-reveal="left"
              key={person.name}
              style={{ "--i": index }}
            >
              <span className="hidden font-mono text-sm text-red lg:block">{String(index + 1).padStart(2, "0")}</span>
              <div className="relative size-24 overflow-hidden bg-parchment-alt lg:size-[120px]">
                <Image alt={person.name} className="object-cover object-top" fill sizes="120px" src={person.img} />
              </div>
              <div className="self-center lg:self-start">
                <h3 className="text-xl font-semibold text-ink">{person.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-red">{person.title}</p>
              </div>
              <p className="col-span-2 text-[15px] leading-relaxed text-ink-soft lg:col-span-1">{person.message}</p>
              <div className="col-span-2 lg:col-span-1">
                <LinkedIn compact person={person} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Heading center />
      <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person, index) => (
          <li className="flex flex-col" data-reveal key={person.name} style={{ "--i": index }}>
            <div className="group relative aspect-[3/4] overflow-hidden bg-parchment-alt">
              <Image alt={person.name} className="object-cover object-top transition duration-700 group-hover:scale-105" fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 92vw" src={person.img} />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-white">
                <span className="block text-lg font-semibold">{person.name}</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85">{person.title}</span>
              </p>
            </div>
            <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{person.message}</p>
            <div className="mt-4">
              <LinkedIn person={person} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
