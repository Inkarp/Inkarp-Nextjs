import Image from"next/image";
import Link from"next/link";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiLayers,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from"react-icons/fi";
import RecTag from"@/components/home/RecTag";

const timelineMilestones = [
  {
    year:"2013",
    title:"Heidolph Premium Distributor",
    image:"/assets/awards/award-2013-heidolph-premium-distributor-a.png",
  },
  {
    year:"2013",
    title:"Heidolph Premium Distributor",
    image:"/assets/awards/award-2013-heidolph-premium-distributor-b.png",
  },
  {
    year:"2013",
    title:"Heidolph Premium Distributor",
    image:"/assets/awards/award-2013-heidolph-premium-distributor-c.png",
  },
  {
    year:"2016",
    title:"Heidolph Premium Distributor",
    image:"/assets/awards/award-2016-heidolph-premium-distributor.png",
  },
  {
    year:"2022",
    title:"Jeio Tech Plaque of Appreciation",
    image:"/assets/awards/award-2022-jeiotech-plaque-of-appreciation.png",
  },
  {
    year:"2023",
    title:"Exceptional International Distributor",
    image:"/assets/awards/award-2023-exceptional-international-distributor.png",
  },
];

const awards = [
  {
    title:"Exceptional International Distributor",
    description:"Awarded for outstanding performance as an international distribution partner, recognizing the consistency and reach of our distribution network.",
    image:"/assets/awards/award-2023-exceptional-international-distributor.png",
    imageSide:"left",
    meta:"International Distribution",
    year:"2023",
  },
  {
    title:"Heidolph Premium Distributor",
    description:"Certified by Heidolph, a global leader in laboratory technology since 1880, for successfully earning approval as a Premium Distributor in India.",
    image:"/assets/awards/award-2016-heidolph-premium-distributor.png",
    imageSide:"right",
    meta:"Principal Partnership",
    year:"2016",
  },
  {
    title:"Jeio Tech Plaque of Appreciation",
    description:"A Plaque of Appreciation from Jeio Tech (Lab Companion), recognizing the support, dedication, and collaboration shown toward the growth of their business in India.",
    image:"/assets/awards/award-2022-jeiotech-plaque-of-appreciation.png",
    imageSide:"center",
    meta:"Partner Appreciation",
    year:"March 2022",
  },
  {
    title:"Heidolph Premium Distributor",
    description:"Our earliest Heidolph Premium Distributor certification, marking the start of a partnership with one of our longest-standing global principals.",
    image:"/assets/awards/award-2013-heidolph-premium-distributor-a.png",
    imageSide:"left",
    meta:"Founding Partnership",
    year:"2013",
  },
];

const highlights = ["Customer-first technical support","Strong global principal relationships","Reliable service and installation network",
];

const recognitionSignals = [
  {
    icon: FiUsers,
    title:"Customer confidence",
    body:"Awards become meaningful when they reflect the confidence customers place in our people, service, and long-term support.",
  },
  {
    icon: FiShield,
    title:"Operational discipline",
    body:"Every recognition points back to dependable processes, trained teams, and consistent execution across branches.",
  },
  {
    icon: FiTrendingUp,
    title:"Sustained growth",
    body:"Milestones are tracked as part of a larger journey: stronger partnerships, wider reach, and better laboratory outcomes.",
  },
];

const recognitionJourney = ["Partnered with global scientific brands","Expanded application and service capabilities","Built trusted customer relationships across India",
];

const showcaseCorners = [
  {
    key:"br",
    pos:"bottom-0 right-0",
    clip:"[clip-path:circle(calc(6.25rem_+_7.5vw)_at_100%_100%)]",
    textPad:"lg:pr-52",
  },
  {
    key:"bl",
    pos:"bottom-0 left-0",
    clip:"[clip-path:circle(calc(6.25rem_+_7.5vw)_at_0%_100%)]",
    textPad:"lg:pl-48",
  },
  {
    key:"tr",
    pos:"top-0 right-0",
    clip:"[clip-path:circle(calc(6.25rem_+_7.5vw)_at_100%_0%)]",
    textPad:"lg:pr-44",
  },
  {
    key:"tl",
    pos:"top-0 left-0",
    clip:"[clip-path:circle(calc(6.25rem_+_7.5vw)_at_0%_0%)]",
    textPad:"lg:pl-48",
  },
];

const showcaseCards = [
  {
    title:"customer-first",
    titleBreak:"service excellence",
    description:"Recognition that reflects the confidence laboratories, hospitals, and research teams place in our people and support.",
    image:"/assets/our-story/InkarpBuilding.jpg",
  },
  {
    title:"strong global",
    titleBreak:"partner network",
    description:"Honoured by leading global technology principals for representing their instruments with technical depth and care.",
    image:"/assets/our-story/evolution/Commitment.webp",
  },
  {
    title:"pan-india",
    titleBreak:"service reach",
    description:"Celebrating a service and installation network that keeps scientific teams supported across every branch we serve.",
    image:"/assets/our-story/evolution/OldImagesCollage.webp",
  },
  {
    title:"future-ready",
    titleBreak:"lab innovation",
    description:"Recognised for dependable instruments and workflow guidance that help scientific teams move faster, with confidence.",
    image:"/assets/our-story/evolution/Philosophy.webp",
  },
];

function RecognitionShowcaseGrid() {
  return (
    <section className="bg-ink px-8 py-20 text-center xl:px-0">
      <span className="mx-auto mb-2 flex max-w-lg items-center justify-center gap-3 text-lg capitalize text-ink-muted">
        what recognition reflects
        <FiArrowRight aria-hidden="true" className="text-red" />
      </span>
      <h2 className="mx-auto max-w-3xl text-xl leading-snug text-parchment md:text-5xl xl:text-6xl">
        Awards That Mirror Trust, Service, and Partnership
      </h2>

      <div className="mx-auto grid max-w-[1180px] gap-5 text-left sm:grid-cols-2 md:grid-cols-2">
        {showcaseCards.map((card, index) => {
          const corner = showcaseCorners[index % showcaseCorners.length];

          return (
            <div
              className="group relative overflow-hidden bg-ink-soft p-10 transition duration-300 hover:border-red/35"
              key={card.title}
            >
              <div
                className={`absolute hidden h-full w-full bg-cover bg-center lg:block ${corner.pos} ${corner.clip}`}
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div
                className={`absolute inset-0 z-[1] bg-red transition-[clip-path] duration-700 ${corner.clip} group-hover:[clip-path:circle(110vw_at_100%_100%)]`}
              />
              <div className={`relative z-[2] ${corner.textPad}`}>
                <h3 className="mb-4 text-2xl capitalize text-parchment xl:text-3xl">
                  {card.title} <br /> {card.titleBreak}
                </h3>
                <p className="text-ink-muted transition-colors duration-700 group-hover:text-parchment">
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

function AwardRow({ award, index }) {
  const isLightRed = index % 2 === 0;
  const isCenter = award.imageSide ==="center";
  const imageFirst = award.imageSide ==="left";

  if (isCenter) {
    return (
      <section
        className={`px-4 py-14 sm:px-6 lg:px-8 ${isLightRed ?"bg-parchment-alt" :"bg-white"
          }`}
      >
        <article className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 border border-red/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red">
              <FiStar aria-hidden="true" />
              {award.meta}
            </span>
            <h2 className="mt-4 text-3xl leading-tight text-ink-soft sm:text-4xl">
              {award.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
              {award.description}
            </p>
          </div>

          <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden border border-red/15 bg-white">
            <div className="relative mx-auto h-[260px] w-[195px] overflow-hidden border border-line-light">
              <Image
                alt={award.title}
                className="object-contain"
                fill
                sizes="195px"
                src={award.image}
              />
            </div>
            <div className="grid gap-px bg-parchment-alt sm:grid-cols-3">
              {highlights.map((item) => (
                <div className="bg-white px-5 py-4 text-sm font-semibold text-ink-soft" key={item}>
                  <FiCheckCircle className="mb-2 text-red" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section
      className={`px-4 py-14 sm:px-6 lg:px-8 ${isLightRed ?"bg-parchment-alt" :"bg-white"
        }`}
    >
      <article className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className={`${imageFirst ?"lg:order-1" :"lg:order-2"}`}>
          <div className="relative overflow-hidden border border-red/15 bg-white p-3">
            <div className="relative mx-auto aspect-[1086/1448] w-full max-w-[280px] overflow-hidden border border-line-light">
              <Image
                alt={award.title}
                className="object-contain transition duration-500 hover:scale-105"
                fill
                sizes="280px"
                src={award.image}
              />
            </div>
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-red">
              <FiAward aria-hidden="true" />
              {String(index + 1).padStart(2,"0")}
            </div>
          </div>
        </div>

        <div className={`${imageFirst ?"lg:order-2" :"lg:order-1"}`}>
          <div className="max-w-xl">
            <span className="inline-flex border border-red/20 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red">
              {award.meta}
            </span>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-ink-soft">
              {award.year}
            </p>
            <h2 className="mt-3 text-3xl leading-tight text-ink-soft sm:text-4xl">
              {award.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-soft sm:text-base">
              {award.description}
            </p>
            <div className="mt-7 h-1 w-24 bg-red" />
          </div>
        </div>
      </article>
    </section>
  );
}

function RecognitionSignalCard({ item, index }) {
  const Icon = item.icon;

  return (
    <article className="group border border-line-light bg-white p-5 transition hover:-translate-y-1 hover:border-red/35 hover:border-red/35">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center bg-red/8 text-red">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <span className="text-xs font-semibold text-ink-soft/40">
          0{index + 1}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold leading-tight text-ink">
        {item.title}
      </h3>
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
            <span className="inline-flex items-center gap-2 border border-red/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red">
              <FiLayers aria-hidden="true" />
              Why it matters
            </span>
            <h2 className="mt-6 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Recognition is not just a badge. It is proof of consistency.
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-soft sm:text-base">
              Behind every milestone is a pattern of dependable support,
              technical clarity, and partnerships that keep scientific teams
              moving with confidence.
            </p>
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

function AwardsRoadTimeline() {
  return (
    <section className="relative bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" data-reveal>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <RecTag>Our Journey</RecTag>
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          Years of Recognition, Mapped Out
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
          Every milestone on this road marks a moment our partners and principals chose to
          recognize Inkarp&apos;s work.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-[1180px] overflow-x-auto pb-6">
        <div className="relative flex min-w-[1600px] items-center gap-6 px-6">
          <div className="absolute left-0 right-0 top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-red/30" />

          {timelineMilestones.map((milestone, index) => {
            const isUp = index % 2 === 0;
            const card = (
              <div className="w-fit border border-line-light bg-white p-3">
                <div className="relative h-64 w-48 overflow-hidden border border-line-light">
                  <Image
                    alt={milestone.title}
                    className="object-contain"
                    fill
                    sizes="192px"
                    src={milestone.image}
                  />
                </div>
                <p className="mt-3 w-48 text-center text-sm leading-5 text-ink-soft">
                  {milestone.title}
                </p>
              </div>
            );

            return (
              <div
                className="relative flex flex-1 flex-col items-center"
                key={`${milestone.year}-${milestone.title}-${index}`}
              >
                {isUp ? <div className="mb-4">{card}</div> : null}

                <span className="relative z-10 flex size-4 shrink-0 items-center justify-center border-2 border-white bg-red" />
                <span className="mt-2 text-base font-semibold text-red">
                  {milestone.year}
                </span>

                {!isUp ? <div className="mt-4">{card}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function AwardsRecognition() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <RecognitionShowcaseGrid /> */}
      <AwardsRoadTimeline />
      <RecognitionDifference />
    </main>
  );
}
