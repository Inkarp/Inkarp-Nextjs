"use client";

import Image from"next/image";
import { useState } from"react";
import SectionHeading from"@/components/home/SectionHeading";

const TABS = [
  {
    key:"evolution",
    label:"Our Evolution",
    heading:"From Core Instruments to Integrated, Data-Ready Platforms",
    body:"Across decades, we expanded capabilities, instrumentation, and data systems to serve complex clinical and R&D needs with speed, traceability, and scalability.",
    img:"/assets/our-story/InkarpBuilding.jpg",
  },
  {
    key:"history",
    label:"Our History",
    heading:"Four Decades of Growth & Strategic Acquisitions",
    body:"As an industry leader, we are relentless in advancing the science of wellness and working with laboratory partners to uphold high standards of accuracy and reliability.",
    img:"/assets/our-story/evolution/OldImagesCollage.webp",
  },
  {
    key:"philosophy",
    label:"Our Philosophy",
    heading:"Science-First. Customer-Centric. Quality-Driven.",
    body:"We invest in people, training, and technology to ensure every solution is accurate, actionable, and delivered with care for the communities we serve.",
    img:"/assets/our-story/evolution/Philosophy.webp",
  },
  {
    key:"quality",
    label:"Commitment To Quality",
    heading:"Validated Processes. Reliable Results. Global Standards.",
    body:"From sample integrity to result reporting, our processes are validated, audited, and continuously improved to exceed regulatory and customer expectations.",
    img:"/assets/our-story/evolution/Commitment.webp",
  },
];

export default function InkarpBio() {
  const [activeKey, setActiveKey] = useState(TABS[0].key);
  const active = TABS.find((tab) => tab.key === activeKey) ?? TABS[0];

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Distinct from MissionVision above — that section covers mission, vision
          and values; this one covers how the company changed over four decades. */}
      <SectionHeading
        eyebrow="Inkarp Bio"
        title="How We Have Grown"
        description="Four decades changed what a laboratory needs from a partner. Follow how Inkarp moved from supplying core instruments to supporting complete, data-ready workflows."
      />

      <div className="overflow-hidden border border-line-light bg-white">
        <div className="grid grid-cols-2 border-b border-line-light md:grid-cols-4">
          {TABS.map((tab) => {
            const isActive = tab.key === activeKey;

            return (
              <button
                className={`min-h-16 px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ?"bg-red text-parchment"
                    :"bg-white text-ink-soft hover:bg-parchment-alt"
                }`}
                key={tab.key}
                onClick={() => setActiveKey(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:p-10">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl leading-tight text-ink-soft">
              {active.heading}
            </h3>
            <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
              {active.body}
            </p>
          </div>

          <div className="relative min-h-[260px] overflow-hidden sm:min-h-[340px]">
            <Image
              alt={active.label}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              src={active.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
