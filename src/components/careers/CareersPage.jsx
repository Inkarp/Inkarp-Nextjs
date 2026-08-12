"use client";

import { useEffect, useMemo, useState } from"react";
import CareersForm from"@/components/careers/CareersForm";
import CareersKeka from"@/components/careers/CareersKeka";
import RecTag from"@/components/home/RecTag";

const team = [
  {
    name:"D. Saritha - Manager, Commercials",
    quote:"Mentoring and freedom at Inkarp shaped my career. Proud of our impact; excited for what's next.",
  },
  {
    name:"M. Srinivas - General Manager",
    quote:"23+ years of opportunity and supportive leadership. Grateful for growth and confident we'll keep leading.",
  },
  {
    name:"I. Hari Krishna - Warehouse Incharge",
    quote:"Joining in 1992 was a turning point. Thankful for leadership support. Proud of our impact and future.",
  },
  {
    name:"L. Vijaya Bhaskar - Service Manager",
    quote:"21 years of growth and lasting relationships. Thankful for trust and support; excited for more milestones.",
  },
  {
    name:"Dasari Raju",
    quote:"Inkarp isn't just a workplace - it's where passion meets purpose.",
  },
  {
    name:"Praneeth",
    quote:"You're encouraged to grow - not just in role, but in vision.",
  },
  {
    name:"Sharath",
    quote:"Ownership, learning, and impact are part of everyday work.",
  },
  {
    name:"Pavan",
    quote:"A culture that listens, trusts, and enables you to do your best work.",
  },
  {
    name:"Sanghavi",
    quote:"We celebrate ideas and encourage experimentation.",
  },
  {
    name:"Apoorva",
    quote:"Growth here isn't a buzzword - it's a roadmap.",
  },
];

function getSlidesPerView() {
  if (typeof window ==="undefined") {
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
        <div className="relative mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-10">
            <div
              className="flex flex-col items-start justify-center gap-2 p-6 lg:col-span-4"
              data-reveal
            >
              <RecTag>We Are Hiring</RecTag>
              <h1 className="max-w-[18ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                Do the most meaningful work of your career at{" "}
                <em className="italic text-red">Inkarp.</em>
              </h1>
              <p className="mt-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
                We hire for potential, not just positions. If you love solving
                real problems and learning fast, you&apos;ll feel at home.
              </p>
            </div>

            <div
              className="overflow-hidden bg-white p-5 lg:col-span-6"
              data-reveal
            >
              <RecTag>What Our Team Says</RecTag>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:[&>div:nth-child(n+3)]:hidden">
                {visibleTeam.map((member, offset) => (
                  <div
                    className="group border border-line-light bg-white p-6 transition hover:-translate-y-0.5 hover:border-red/35"
                    key={`${member.name}-${offset}`}
                    style={{
                      transform: `rotate(${
                        offset === 1 ? 0.2 : offset === 2 ? -0.2 : 0
                      }deg)`,
                    }}
                  >
                    {/* A quote and its attribution — rendered as blockquote/cite
                        rather than a heading, which would skip from h1 to h3. */}
                    <blockquote className="italic leading-relaxed text-ink-soft">
                      &quot;{member.quote}&quot;
                    </blockquote>
                    <p className="mt-4 text-sm font-semibold not-italic text-ink">
                      <cite className="not-italic">{member.name}</cite>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-2 sm:hidden">
                {Array.from({ length: totalDots }, (_, dotIndex) => (
                  <span
                    className={`size-2 ${
                      activeDot === dotIndex ?"bg-red" :"bg-parchment-alt"
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
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 bg-red p-6 text-parchment md:flex-row md:p-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-[22px] font-semibold tracking-tight md:text-3xl">
              Don&apos;t see a perfect role?
            </h2>
            <p className="text-parchment/90">
              We always welcome exceptional talent. Share your profile with us.
            </p>
          </div>
        </div>
      </section>

      <CareersForm />
    </main>
  );
}
