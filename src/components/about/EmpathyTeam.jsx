import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

const people = [
  {
    image: "/assets/our-story/team/BaluFullImage.jpg",
    side: "right",
    quote: "When I started this journey, I knew it was not enough to build a company. We had to build trust, values, and people who could carry them forward. Every milestone we reached came from holding firm to integrity, nurturing relationships, and believing that lasting success belongs to everyone together.",
    author: "S. Balu",
    role: "Chairman",
    link: "https://www.linkedin.com/in/balu-s-9b870b26/",
  },
  {
    image: "/assets/our-story/team/NateshFullImage.jpg",
    side: "left",
    quote: "I was entrusted with a vision built on strong values. My responsibility has been to shape it into a company that could endure, expand, and deliver greater impact. Growth has meaning only when it strengthens the foundation, empowers every department, and keeps us relentlessly focused on serving customers better.",
    author: "K. Natesh",
    role: "Managing Director",
    link: "https://www.linkedin.com/in/natesh-krishnamurthy-75054518/",
  },
];

export default function EmpathyTeam() {
  return (
    <section className="mx-auto w-full max-w-[1180px] space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Meet Our Leadership"
        title="Built by people who chose trust first"
        description="The company story begins with leaders who shaped Inkarp around integrity, relationships, and a service mindset."
      />

      {people.map((person) => {
        const isTextRight = person.side === "right";

        return (
          <article className="relative overflow-hidden border border-line-light bg-white" data-scroll-reveal="true" key={person.author}>
            <div className="relative min-h-[560px] w-full sm:min-h-[470px] lg:min-h-[430px]">
              <Image
                alt={`${person.author}, ${person.role}`}
                className={`object-cover ${isTextRight ? "object-left" : "object-right"}`}
                fill
                priority
                sizes="(min-width: 1024px) 1152px, 90vw"
                src={person.image}
              />
              <div
                className={`absolute inset-0 ${
                  isTextRight
                    ? "bg-gradient-to-l from-black/70 via-black/30 to-transparent"
                    : "bg-gradient-to-r from-black/70 via-black/30 to-transparent"
                }`}
              />
              <div
                className={`absolute inset-0 flex items-end p-4 sm:items-center sm:p-6 lg:p-8 ${
                  isTextRight ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-full border border-line-light bg-parchment/92 p-5 text-ink backdrop-blur sm:max-w-[62%] lg:max-w-[45%]">
                  <p className="text-sm leading-7 text-ink-soft sm:text-base">
                    {person.quote}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-2xl font-semibold text-red">
                      {person.author}
                    </h3>
                    <p className="text-sm font-semibold text-ink-soft">
                      {person.role}
                    </p>
                  </div>
                  <a
                    aria-label={`${person.author} on LinkedIn`}
                    className="mt-4 inline-flex size-10 items-center justify-center border border-line-light bg-parchment text-red transition hover:border-red hover:text-red"
                    href={person.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FaLinkedin aria-hidden="true" className="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}