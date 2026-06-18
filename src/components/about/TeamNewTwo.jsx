"use client";

import Image from "next/image";
import { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
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

function DirectorTab({ director, index, isActive, onSelect }) {
  return (
    <button
      className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition duration-300 ${
        isActive
          ? "border-[#BE0010] bg-[#BE0010] shadow-lg shadow-[#BE0010]/20"
          : "border-zinc-200 bg-white hover:border-[#BE0010]/40 hover:bg-[#fff3f4]"
      }`}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span
        className={`font-maxot text-xl font-bold tabular-nums ${
          isActive ? "text-white/60" : "text-zinc-300 group-hover:text-[#BE0010]/40"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-maxot text-sm font-bold ${
            isActive ? "text-white" : "text-zinc-950"
          }`}
        >
          {director.name}
        </span>
        <span
          className={`block truncate text-xs ${
            isActive ? "text-white/75" : "text-zinc-500"
          }`}
        >
          {director.title}
        </span>
      </span>
      <FiArrowUpRight
        aria-hidden="true"
        className={`shrink-0 text-lg transition ${
          isActive
            ? "text-white"
            : "text-zinc-300 group-hover:translate-x-0.5 group-hover:text-[#BE0010]"
        }`}
      />
    </button>
  );
}

export default function TeamNewTwo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = directors[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#fff3f4] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(30deg,#BE0010_1px,transparent_1px),linear-gradient(150deg,#BE0010_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          description="Meet the people steering operations, service, and growth across every region we serve."
          eyebrow="Our Directors"
        />

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="flex flex-col gap-3">
            {directors.map((director, index) => (
              <DirectorTab
                director={director}
                index={index}
                isActive={index === activeIndex}
                key={director.name}
                onSelect={setActiveIndex}
              />
            ))}
          </div>

          <article
            className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-zinc-950/10"
            data-scroll-reveal="true"
            key={active.name}
          >
            <div className="grid sm:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
              <div className="relative aspect-square overflow-hidden bg-zinc-50 sm:aspect-auto">
                <Image
                  alt={active.name}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 100vw"
                  src={active.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
                <span className="absolute bottom-3 left-3 font-maxot text-5xl font-bold text-white/25 sm:hidden">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <span className="hidden font-maxot text-6xl font-bold text-[#BE0010]/10 sm:block">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <h3 className="font-maxot mt-1 text-2xl text-zinc-950 sm:text-3xl">
                  {active.name}
                </h3>
                <p className="mt-1 font-maxot text-sm font-semibold text-[#BE0010]">
                  {active.title}
                </p>

                <p className="mt-4 flex-1 text-sm leading-7 text-zinc-600 sm:text-base">
                  {active.message}
                </p>

                <a
                  aria-label={`${active.name} on LinkedIn`}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-blue-600 hover:text-blue-700"
                  href={active.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaLinkedin aria-hidden="true" className="size-4 text-blue-600" />
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
