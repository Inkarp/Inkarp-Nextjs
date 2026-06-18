import Image from "next/image";
import { FaLinkedin, FaQuoteLeft } from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

const directors = [
  {
    name: "K. Sreedhar",
    title: "Director (South & East)",
    img: "/assets/our-story/team/Sreedar.jpeg",
    message:
      "Over the years I have seen how trust shapes lasting partnerships. My effort has always been to listen carefully, guide customers toward the right solutions, and support teams in doing the same. Experience has taught me that consistency and commitment are what truly sustain growth for both people and the company.",
    link: "https://www.linkedin.com/in/koora-sreedhar-06934019/",
  },
  {
    name: "M. Madhusudhan",
    title: "Director (North)",
    img: "/assets/our-story/team/Madhusudhan.jpeg",
    message:
      "My approach has always been rooted in science. Understanding the details, whether in chromatography or instrumentation, helps me guide customers toward solutions that genuinely work. Sales, to me, is not persuasion but problem solving. Every interaction is about applying knowledge with sincerity so researchers can move forward with confidence.",
    link: "https://www.linkedin.com/in/madhusudhan-mohan-04219329/",
  },
  {
    name: "M. S. Reddy",
    title: "Director (West)",
    img: "/assets/our-story/team/MsReddy.jpg",
    message:
      "I have always believed that the real value of sales lies in enabling progress for our customers. By introducing solutions that simplify research and strengthen outcomes, my focus has been to build trust step by step. Innovation matters, but what matters more is delivering it with honesty and consistency.",
    link: "https://www.linkedin.com/in/m-srinivasa-reddy-8874731/",
  },
  {
    name: "N. Saravanan",
    title: "Chief Operating Officer (All India)",
    img: "/assets/our-story/team/Saravanan.jpeg",
    message:
      "Service is where promises meet reality. My focus has always been on making sure every instrument we deliver continues to perform and every customer feels supported long after a sale is made. Reliability in service is not optional, it is the foundation on which lasting relationships are built.",
    link: "https://www.linkedin.com/in/saravanan-natarajan-027a2744/",
  },
];

function DirectorRow({ director, index }) {
  const isReversed = index % 2 === 1;

  return (
    <article
      className="relative grid items-center gap-6 border-b border-zinc-200 py-10 last:border-b-0 sm:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] lg:gap-10"
      data-scroll-reveal="true"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-6 font-maxot text-7xl font-bold text-zinc-900/[0.04] sm:text-8xl ${
          isReversed ? "right-0" : "left-0"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={`relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl bg-zinc-50 shadow-md shadow-zinc-950/10 sm:mx-0 sm:w-full ${
          isReversed ? "sm:order-2" : ""
        }`}
      >
        <Image
          alt={director.name}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 160px"
          src={director.img}
        />
      </div>

      <div className={`relative ${isReversed ? "sm:order-1 sm:text-right" : ""}`}>
        <FaQuoteLeft
          aria-hidden="true"
          className={`text-xl text-[#BE0010]/20 ${
            isReversed ? "ml-auto" : ""
          }`}
        />
        <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
          {director.message}
        </p>

        <div
          className={`mt-4 flex items-center gap-3 ${
            isReversed ? "justify-end" : ""
          }`}
        >
          <a
            aria-label={`${director.name} on LinkedIn`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-blue-600 shadow-sm transition hover:border-blue-600 hover:text-blue-800"
            href={director.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaLinkedin aria-hidden="true" className="size-4" />
          </a>
          <div className={isReversed ? "order-first" : ""}>
            <h3 className="font-maxot text-lg text-zinc-950 sm:text-xl">
              {director.name}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
              {director.title}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DirectorsShowcase() {
  return (
    <section className="relative bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          description="Meet the people steering operations, service, and growth across every region we serve."
          eyebrow="Our Directors"
        />

        <div>
          {directors.map((director, index) => (
            <DirectorRow director={director} index={index} key={director.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
