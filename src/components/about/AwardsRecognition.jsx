import Image from "next/image";
import { FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";

// Three separate 2013 Heidolph certificates share one year and title, so they
// are grouped into a single milestone rather than repeating the same label
// three times along the timeline.
const timelineMilestones = [
  {
    year: "2013",
    title: "Heidolph Premium Distributor",
    images: [
      "/assets/awards/award-2013-heidolph-premium-distributor-a.png",
      "/assets/awards/award-2013-heidolph-premium-distributor-b.png",
      "/assets/awards/award-2013-heidolph-premium-distributor-c.png",
    ],
  },
  {
    year: "2016",
    title: "Heidolph Premium Distributor",
    images: ["/assets/awards/award-2016-heidolph-premium-distributor.png"],
  },
  {
    year: "2022",
    title: "Jeio Tech Plaque of Appreciation",
    images: ["/assets/awards/award-2022-jeiotech-plaque-of-appreciation.png"],
  },
  {
    year: "2023",
    title: "Exceptional International Distributor",
    images: ["/assets/awards/award-2023-exceptional-international-distributor.png"],
  },
];

const recognitionSignals = [
  {
    icon: FiUsers,
    title: "Customer confidence",
    body: "Awards become meaningful when they reflect the confidence customers place in our people, service, and long-term support.",
  },
  {
    icon: FiShield,
    title: "Operational discipline",
    body: "Every recognition points back to dependable processes, trained teams, and consistent execution across branches.",
  },
  {
    icon: FiTrendingUp,
    title: "Sustained growth",
    body: "Milestones are tracked as part of a larger journey: stronger partnerships, wider reach, and better laboratory outcomes.",
  },
];

const recognitionJourney = [
  "Partnered with global scientific brands",
  "Expanded application and service capabilities",
  "Built trusted customer relationships across India",
];

function AwardsRoadTimeline() {
  return (
    <section className="relative bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          as="h1"
          eyebrow="Our Journey"
          title="Years of Recognition, Mapped Out"
          description="Every milestone on this road marks a moment our partners and principals chose to recognize Inkarp's work."
        />
      </div>

      <div className="mx-auto max-w-[1180px] overflow-x-auto pb-6">
        <div className="relative flex min-w-[1100px] items-center gap-6 px-6">
          <div className="absolute left-0 right-0 top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-red/30" />

          {timelineMilestones.map((milestone, index) => {
            const isUp = index % 2 === 0;
            const card = (
              <div className="w-fit border border-line-light bg-white p-3">
                <div className="flex items-center gap-2">
                  {milestone.images.map((src, imageIndex) => (
                    <div
                      className="relative h-56 w-40 overflow-hidden border border-line-light"
                      key={src}
                    >
                      <Image
                        alt={`${milestone.title} certificate ${imageIndex + 1}, ${milestone.year}`}
                        className="object-contain"
                        fill
                        sizes="160px"
                        src={src}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-sm leading-5 text-ink">
                  {milestone.title}
                  {milestone.images.length > 1 ? (
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {milestone.images.length} certificates
                    </span>
                  ) : null}
                </p>
              </div>
            );

            return (
              <div
                className="relative flex flex-1 flex-col items-center"
                key={`${milestone.year}-${milestone.title}`}
              >
                {isUp ? <div className="mb-4">{card}</div> : null}

                <span className="relative z-10 flex size-4 shrink-0 items-center justify-center border-2 border-white bg-red" />
                <span className="mt-2 text-base font-semibold text-red">{milestone.year}</span>

                {!isUp ? <div className="mt-4">{card}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RecognitionSignalCard({ item, index }) {
  const Icon = item.icon;

  return (
    <article className="group border border-line-light bg-white p-5 transition hover:-translate-y-1 hover:border-red/35">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center bg-red/8 text-red">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <span className="text-xs font-semibold text-ink-soft/40">0{index + 1}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold leading-tight text-ink">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{item.body}</p>
    </article>
  );
}

function RecognitionDifference() {
  return (
    <section className="border-y border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8" data-reveal>
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
        <aside className="flex flex-col justify-between border border-line-light bg-parchment-alt p-6 sm:p-8">
          <div>
            <SectionHeading
              className="mb-0"
              eyebrow="Why it matters"
              title="Recognition is not just a badge. It is proof of consistency."
              description="Behind every milestone is a pattern of dependable support, technical clarity, and partnerships that keep scientific teams moving with confidence."
            />
          </div>

          <div className="mt-8 space-y-4">
            {recognitionJourney.map((item, index) => (
              <div className="grid grid-cols-[auto_1fr] gap-4" key={item}>
                <span className="flex size-8 items-center justify-center border border-red/20 bg-white text-xs font-bold text-red">
                  {index + 1}
                </span>
                <p className="border-b border-line-light pb-4 text-sm font-medium leading-6 text-ink-soft">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {recognitionSignals.map((item, index) => (
            <RecognitionSignalCard item={item} index={index} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AwardsRecognition() {
  return (
    <main className="overflow-hidden bg-white">
      <AwardsRoadTimeline />
      <RecognitionDifference />
    </main>
  );
}
