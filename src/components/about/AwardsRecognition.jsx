import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiLayers,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";

const awards = [
  {
    title: "Trusted Scientific Solutions Partner",
    description:
      "Recognition for building long-term partnerships with laboratories, research institutions, hospitals, and industry teams across India.",
    image: "/assets/our-story/InkarpBuilding.jpg",
    imageSide: "left",
    meta: "Customer trust",
    year: "40+ years",
  },
  {
    title: "Excellence in Application Support",
    description:
      "Celebrating the teams that help customers choose, install, validate, and sustain high-performance scientific and analytical instruments.",
    image: "/assets/our-story/evolution/Commitment.webp",
    imageSide: "right",
    meta: "Service excellence",
    year: "Pan India",
  },
  {
    title: "Partner Recognition for Growth",
    description:
      "A milestone that reflects our commitment to representing global technology leaders with technical depth, care, and market reach.",
    image: "/assets/our-story/evolution/OldImagesCollage.webp",
    imageSide: "center",
    meta: "Global partners",
    year: "Strategic growth",
  },
  {
    title: "Innovation in Laboratory Enablement",
    description:
      "Honoring our focus on dependable instruments, workflow guidance, and practical support that helps scientific teams move faster.",
    image: "/assets/our-story/evolution/Philosophy.webp",
    imageSide: "left",
    meta: "Innovation",
    year: "Future ready",
  },
];

const highlights = [
  "Customer-first technical support",
  "Strong global principal relationships",
  "Reliable service and installation network",
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

function AwardRow({ award, index }) {
  const isLightRed = index % 2 === 0;
  const isCenter = award.imageSide === "center";
  const imageFirst = award.imageSide === "left";

  if (isCenter) {
    return (
      <section
        className={`px-4 py-14 sm:px-6 lg:px-8 ${
          isLightRed ? "bg-[#fff3f4]" : "bg-white"
        }`}
      >
        <article className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#BE0010]/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
              <FiStar aria-hidden="true" />
              {award.meta}
            </span>
            <h2 className="font-maxot mt-4 text-3xl leading-tight text-zinc-950 sm:text-4xl">
              {award.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              {award.description}
            </p>
          </div>

          <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-lg border border-[#BE0010]/15 bg-white shadow-2xl shadow-[#BE0010]/10">
            <div className="relative h-72 sm:h-96">
              <Image
                alt={award.title}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 896px, 92vw"
                src={award.image}
              />
            </div>
            <div className="grid gap-px bg-zinc-100 sm:grid-cols-3">
              {highlights.map((item) => (
                <div className="bg-white px-5 py-4 text-sm font-semibold text-zinc-700" key={item}>
                  <FiCheckCircle className="mb-2 text-[#BE0010]" />
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

function RecognitionSignalCard({ item, index }) {
  const Icon = item.icon;

  return (
    <article className="group border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#BE0010]/35 hover:shadow-lg hover:shadow-[#BE0010]/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff3f4] text-[#BE0010]">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <span className="font-maxot text-xs font-semibold text-zinc-300">
          0{index + 1}
        </span>
      </div>
      <h3 className="font-maxot mt-5 text-xl leading-tight text-zinc-950">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{item.body}</p>
    </article>
  );
}

function RecognitionDifference() {
  return (
    <section className="border-y border-[#BE0010]/10 bg-[#fff3f4] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
        <aside className="flex flex-col justify-between bg-[#BE0010] p-6 text-white shadow-2xl shadow-[#BE0010]/20 sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              <FiLayers aria-hidden="true" />
              Why it matters
            </span>
            <h2 className="font-maxot mt-6 text-3xl leading-tight sm:text-4xl">
              Recognition is not just a badge. It is proof of consistency.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/80 sm:text-base">
              Behind every milestone is a pattern of dependable support,
              technical clarity, and partnerships that keep scientific teams
              moving with confidence.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {recognitionJourney.map((item, index) => (
              <div className="grid grid-cols-[auto_1fr] gap-4" key={item}>
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#BE0010]">
                  {index + 1}
                </span>
                <p className="border-b border-white/20 pb-4 text-sm font-medium leading-6 text-white/90">
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
      <section className="relative px-4 pb-12 pt-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_460px_at_18%_0%,rgba(190,0,16,0.08),transparent),radial-gradient(1000px_460px_at_82%_100%,rgba(230,57,70,0.08),transparent)]" />
        <SectionHeading
          eyebrow="Awards and Recognitions"
          title="Milestones That Reflect Trust, Service, and Scientific Partnership"
          description="A dedicated space to showcase the awards, recognitions, and partner milestones that represent Inkarp's commitment to dependable scientific solutions."
        />
      </section>

      {awards.map((award, index) => (
        <AwardRow award={award} index={index} key={award.title} />
      ))}

      <RecognitionDifference />

   
    </main>
  );
}
