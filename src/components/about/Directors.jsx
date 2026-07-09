import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

const directors = [
  {
    name: "K. Sreedhar",
    title: "Director (South & East)",
    img: "/assets/our-story/team/Sreedar.jpeg",
    message: "Over the years I have seen how trust shapes lasting partnerships. My effort has always been to listen carefully, guide customers toward the right solutions, and support teams in doing the same. Experience has taught me that consistency and commitment are what truly sustain growth for both people and the company.",
    link: "https://www.linkedin.com/in/koora-sreedhar-06934019/",
  },
  {
    name: "M. Madhusudhan",
    title: "Director (North)",
    img: "/assets/our-story/team/Madhusudhan.jpeg",
    message: "My approach has always been rooted in science. Understanding the details, whether in chromatography or instrumentation, helps me guide customers toward solutions that genuinely work. Sales, to me, is not persuasion but problem solving. Every interaction is about applying knowledge with sincerity so researchers can move forward with confidence.",
    link: "https://www.linkedin.com/in/madhusudhan-mohan-04219329/",
  },
  {
    name: "M. S. Reddy",
    title: "Director (West)",
    img: "/assets/our-story/team/MsReddy.jpg",
    message: "I have always believed that the real value of sales lies in enabling progress for our customers. By introducing solutions that simplify research and strengthen outcomes, my focus has been to build trust step by step. Innovation matters, but what matters more is delivering it with honesty and consistency.",
    link: "https://www.linkedin.com/in/m-srinivasa-reddy-8874731/",
  },
  {
    name: "N. Saravanan",
    title: "Chief Operating Officer (All India)",
    img: "/assets/our-story/team/Saravanan.jpeg",
    message: "Service is where promises meet reality. My focus has always been on making sure every instrument we deliver continues to perform and every customer feels supported long after a sale is made. Reliability in service is not optional, it is the foundation on which lasting relationships are built.",
    link: "https://www.linkedin.com/in/saravanan-natarajan-027a2744/",
  },
];

function DirectorCard({ director, index }) {
  return (
    <article className="relative overflow-hidden border border-line-light bg-white" data-scroll-reveal="true">
      <div className="grid sm:grid-cols-[160px_1fr] lg:grid-cols-[190px_1fr]">
        <div className="relative h-44 overflow-hidden bg-parchment-alt sm:h-full">
          <Image
            alt={director.name}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 190px, (min-width: 640px) 160px, 100vw"
            src={director.img}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
          <span className="absolute bottom-2 left-3 text-4xl font-bold text-white/25 sm:hidden">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col p-4 sm:p-5">
          <h3 className="mt-1 text-lg font-semibold text-ink sm:text-xl">
            {director.name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-red">
            {director.title}
          </p>

          <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">
            {director.message}
          </p>

          <a
            aria-label={`${director.name} on LinkedIn`}
            className="mt-4 inline-flex w-fit items-center gap-2 border border-line-light px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-red hover:text-red"
            href={director.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaLinkedin aria-hidden="true" className="size-4 text-red" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Directors() {
  return (
    <section className="relative overflow-hidden bg-parchment-alt px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(30deg,rgba(190,0,16,0.18)_1px,transparent_1px),linear-gradient(150deg,rgba(190,0,16,0.18)_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeading
          eyebrow="Our Directors"
          title="Regional leaders with one standard of support"
          description="Meet the people steering operations, service, and growth across every region we serve."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {directors.map((director, index) => (
            <DirectorCard director={director} index={index} key={director.name} />
          ))}
        </div>
      </div>
    </section>
  );
}