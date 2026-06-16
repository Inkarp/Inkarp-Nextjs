import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
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

function DirectorCard({ director }) {
  return (
    <article
      className="group flex h-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#E63946] hover:shadow-md"
      data-scroll-reveal="true"
    >
      <div className="p-3">
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg bg-zinc-50">
          <Image
            alt={director.name}
            className="object-contain transition duration-300 group-hover:scale-[1.02]"
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            src={director.img}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 text-center">
        <h3 className="font-maxot text-xl text-[#BE0010]">{director.name}</h3>
        <p className="mt-1 font-maxot text-sm text-zinc-500">
          {director.title}
        </p>
        <p className="mt-3 flex-1 text-left text-sm leading-6 text-zinc-700">
          {director.message}
        </p>
        <a
          aria-label={`${director.name} on LinkedIn`}
          className="mx-auto mt-4 inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-blue-600 shadow-sm transition hover:text-blue-800 hover:shadow"
          href={director.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaLinkedin aria-hidden="true" className="size-5" />
        </a>
      </div>
    </article>
  );
}

export default function TeamNewTwo() {
  return (
    <section className="relative px-4 py-12 sm:px-6 lg:px-10">
      <SectionHeading eyebrow="Our Directors" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {directors.map((director) => (
          <DirectorCard director={director} key={director.name} />
        ))}
      </div>
    </section>
  );
}
