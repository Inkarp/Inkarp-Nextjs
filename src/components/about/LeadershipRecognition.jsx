import { FiArrowRight } from "react-icons/fi";
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

const directorAwardCards = directors.map((director) => ({
  title: director.name,
  titleBreak: director.title,
  description: director.message,
  image: director.img,
}));

const leadershipCorners = [
  {
    key: "br",
    clip: "[clip-path:circle(calc(6.25rem_+_7.5vw)_at_100%_100%)]",
    textPad: "lg:pr-52",
  },
  {
    key: "bl",
    clip: "[clip-path:circle(calc(6.25rem_+_7.5vw)_at_0%_100%)]",
    textPad: "lg:pl-48",
  },
  {
    key: "tr",
    clip: "[clip-path:circle(calc(6.25rem_+_7.5vw)_at_100%_0%)]",
    textPad: "lg:pr-44",
  },
  {
    key: "tl",
    clip: "[clip-path:circle(calc(6.25rem_+_7.5vw)_at_0%_0%)]",
    textPad: "lg:pl-48",
  },
];

function LeadershipShowcaseGrid() {
  return (
    <section className="bg-gray-900 px-8 py-20 text-center xl:px-0">
    
      <div className="mx-auto grid max-w-5xl gap-5 text-left sm:grid-cols-2 md:grid-cols-2">
        {directorAwardCards.map((card, index) => {
          const corner = leadershipCorners[index % leadershipCorners.length];

          return (
            <div
              className="group relative overflow-hidden p-5 shadow-none transition-shadow duration-300 hover:shadow-[0.063rem_0.063rem_1.25rem_0.375rem_rgba(0,0,0,0.53)]"
              key={card.title}
            >
              <div
                className={`absolute inset-0 z-0 bg-[#BE0010] transition-[clip-path] duration-700 ${corner.clip} group-hover:[clip-path:circle(110vw_at_100%_100%)]`}
              />
              <div
                className={`absolute inset-0 z-[1] bg-cover bg-center ${corner.clip}`}
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className={`relative z-[2] ${corner.textPad}`}>
                <h3 className="font-maxot mb-2 text-xl text-white xl:text-xl">
                  {card.title} <br /> {card.titleBreak}
                </h3>
                <p className="text-gray-400 transition-colors duration-700 group-hover:text-white">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
      <LeadershipShowcaseGrid />
    </div>
  );
}
