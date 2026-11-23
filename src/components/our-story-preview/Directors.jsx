import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import { DIRECTORS } from "./storyContent";

function LinkedIn({ person }) {
  return (
    <a
      aria-label={`${person.name} on LinkedIn`}
      className="inline-flex w-fit items-center gap-2 border border-line-light px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-red hover:text-red"
      href={person.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FaLinkedin aria-hidden="true" className="size-4 text-red" />
      Connect on LinkedIn
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

/** The four directors: tall portraits in a row, each with their message. */
export default function Directors() {
  const { people } = DIRECTORS;

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
