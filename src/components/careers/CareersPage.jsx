"use client";

import { useEffect, useMemo, useState } from "react";
import CareersForm from "@/components/careers/CareersForm";
import CareersKeka from "@/components/careers/CareersKeka";

const team = [
  {
    name: "D. Saritha - Manager, Commercials",
    quote:
      "Mentoring and freedom at Inkarp shaped my career. Proud of our impact; excited for what's next.",
  },
  {
    name: "M. Srinivas - General Manager",
    quote:
      "23+ years of opportunity and supportive leadership. Grateful for growth and confident we'll keep leading.",
  },
  {
    name: "I. Hari Krishna - Warehouse Incharge",
    quote:
      "Joining in 1992 was a turning point. Thankful for leadership support. Proud of our impact and future.",
  },
  {
    name: "L. Vijaya Bhaskar - Service Manager",
    quote:
      "21 years of growth and lasting relationships. Thankful for trust and support; excited for more milestones.",
  },
  {
    name: "Dasari Raju",
    quote: "Inkarp isn't just a workplace - it's where passion meets purpose.",
  },
  {
    name: "Praneeth",
    quote: "You're encouraged to grow - not just in role, but in vision.",
  },
  {
    name: "Sharath",
    quote: "Ownership, learning, and impact are part of everyday work.",
  },
  {
    name: "Pavan",
    quote: "A culture that listens, trusts, and enables you to do your best work.",
  },
  {
    name: "Sanghavi",
    quote: "We celebrate ideas and encourage experimentation.",
  },
  {
    name: "Apoorva",
    quote: "Growth here isn't a buzzword - it's a roadmap.",
  },
];

function getSlidesPerView() {
  if (typeof window === "undefined") {
    return 2;
  }

  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}

export default function CareersPage() {
  const [slidesPerView, setSlidesPerView] = useState(2);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const updateSlidesPerView = () => setSlidesPerView(getSlidesPerView());

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + slidesPerView) % team.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slidesPerView]);

  const visibleTeam = useMemo(
    () =>
      Array.from({ length: slidesPerView }, (_, offset) => {
        return team[(index + offset) % team.length];
      }),
    [index, slidesPerView]
  );

  const totalDots = Math.ceil(team.length / slidesPerView);
  const activeDot = Math.floor(index / slidesPerView) % totalDots;

  return (
    <main className="mx-auto w-[98%] overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(230,57,70,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-10">
            <div
              className="flex flex-col items-start justify-center gap-2 rounded-lg p-6 lg:col-span-4"
              data-reveal
            >
              <h1 className="font-maxot mt-1 text-4xl font-bold leading-tight text-[#E63946]">
                We are hiring
              </h1>
              <h2 className="font-maxot text-2xl leading-tight">
                Do the most meaningful work of your career at{" "}
                <span className="text-[#E63946]">INKARP</span>
              </h2>
              <p className="mt-2 text-lg text-zinc-700">
                We hire for potential, not just positions. If you love solving
                real problems and learning fast, you&apos;ll feel at home.
              </p>
            </div>

            <div
              className="overflow-hidden rounded-lg bg-white p-5 shadow-lg lg:col-span-6"
              data-reveal
            >
              <div className="flex justify-center">
                <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800 md:text-sm">
                  What Our Team Says
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:[&>div:nth-child(n+3)]:hidden">
                {visibleTeam.map((member, offset) => (
                  <div
                    className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    key={`${member.name}-${offset}`}
                    style={{
                      transform: `rotate(${
                        offset === 1 ? 0.2 : offset === 2 ? -0.2 : 0
                      }deg)`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <h4 className="font-maxot text-[#E63946]">
                        {member.name}
                      </h4>
                    </div>
                    <p className="mt-4 italic text-zinc-800">
                      &quot;{member.quote}&quot;
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-2 sm:hidden">
                {Array.from({ length: totalDots }, (_, dotIndex) => (
                  <span
                    className={`size-2 rounded-full ${
                      activeDot === dotIndex ? "bg-[#E63946]" : "bg-zinc-300"
                    }`}
                    key={dotIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CareersKeka />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-lg bg-[#E63946] p-6 text-white md:flex-row md:p-10">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-maxot text-xl md:text-2xl">
              Don&apos;t see a perfect role?
            </h4>
            <p className="text-white/90">
              We always welcome exceptional talent. Share your profile with us.
            </p>
          </div>
        </div>
      </section>

      <CareersForm />
    </main>
  );
}
