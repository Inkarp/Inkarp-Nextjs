import Image from "next/image";
import { FiAward } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";

const directors = [
  {
    name: "K. Sreedhar",
    title: "Director (South & East)",
    img: "/assets/our-story/team/Sreedar.jpeg",
    message:
      "Over the years I have seen how trust shapes lasting partnerships. My effort has always been to listen carefully, guide customers toward the right solutions, and support teams in doing the same.",
  },
  {
    name: "M. Madhusudhan",
    title: "Director (North)",
    img: "/assets/our-story/team/Madhusudhan.jpeg",
    message:
      "My approach has always been rooted in science. Understanding the details, whether in chromatography or instrumentation, helps me guide customers toward solutions that genuinely work.",
  },
  {
    name: "M. S. Reddy",
    title: "Director (West)",
    img: "/assets/our-story/team/MsReddy.jpg",
    message:
      "I have always believed that the real value of sales lies in enabling progress for our customers, building trust step by step with honesty and consistency.",
  },
  {
    name: "N. Saravanan",
    title: "Chief Operating Officer (All India)",
    img: "/assets/our-story/team/Saravanan.jpeg",
    message:
      "Service is where promises meet reality. My focus has always been on making sure every instrument we deliver continues to perform and every customer feels supported.",
  },
];

const directorAwardCards = directors.map((director, index) => ({
  title: director.name,
  description: director.message,
  image: director.img,
  imageSide: index % 2 === 0 ? "right" : "left",
  meta: director.title,
  year: "Inkarp Leadership",
}));

function LeadershipRow({ award, index }) {
  const isLightRed = index % 2 === 0;
  const imageFirst = award.imageSide === "left";

  return (
    <section
      className={`px-4 py-14 sm:px-6 lg:px-8 ${
        isLightRed ? "bg-[#fff3f4]" : "bg-white"
      }`}
    >
      <article className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className={`${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
          <div className="relative overflow-hidden rounded-lg border border-[#BE0010]/15 bg-white p-3 shadow-xl shadow-[#BE0010]/10">
            <div className="relative min-h-[300px] overflow-hidden rounded-md sm:min-h-[380px]">
              <Image
                alt={award.title}
                className="object-cover transition duration-500 hover:scale-105"
                fill
                sizes="(min-width: 1024px) 520px, 92vw"
                src={award.image}
              />
            </div>
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#BE0010] shadow-lg shadow-zinc-950/10">
              <FiAward aria-hidden="true" />
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className={`${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-[#BE0010]/20 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
              {award.meta}
            </span>
            <p className="font-maxot mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
              {award.year}
            </p>
            <h2 className="font-maxot mt-3 text-3xl leading-tight text-zinc-950 sm:text-4xl">
              {award.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-zinc-600 sm:text-base">
              {award.description}
            </p>
            <div className="mt-7 h-1 w-24 rounded-full bg-[#BE0010]" />
          </div>
        </div>
      </article>
    </section>
  );
}

export default function LeadershipRecognition() {
  return (
    <div>
      <section className="relative px-4 pb-4 pt-14 sm:px-6 lg:px-8">
        <SectionHeading
          description="Duplicate of the awards layout, applied to the leaders who earn that recognition every day."
          eyebrow="Leadership Recognition"
          title="The People Behind Every Award"
        />
      </section>

      {directorAwardCards.map((award, index) => (
        <LeadershipRow award={award} index={index} key={award.title} />
      ))}
    </div>
  );
}
