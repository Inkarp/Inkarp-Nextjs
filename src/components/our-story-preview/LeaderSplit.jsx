"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import { LEADERS } from "./storyContent";
import { passProgress, useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

// Where in the wide photo each leader stands, so the tall crop centres on them.
const FOCUS = { left: "6% 40%", right: "94% 40%" };

function Leader({ person, index }) {
  const frameRef = useRef(null);
  useScrollFrame(frameRef, (progress, element) => element.style.setProperty("--d", progress.toFixed(4)), passProgress);

  return (
    <article className={index ? "lg:mt-24" : ""} data-reveal style={{ "--i": index }}>
      <div className={styles.ticks}>
        <div className="relative aspect-[4/5] overflow-hidden bg-ink" ref={frameRef}>
          <div className={`${styles.drift} absolute inset-x-0 -inset-y-[8%]`}>
            <Image alt={`${person.author}, ${person.role}`} className="object-cover" fill sizes="(min-width: 1024px) 540px, 92vw" src={person.image} style={{ objectPosition: FOCUS[person.side] }} />
          </div>
          <p className="absolute bottom-0 left-0 bg-white px-4 py-3">
            <span className="block text-xl font-semibold text-red">{person.author}</span>
            <span className="block text-sm text-ink-soft">{person.role}</span>
          </p>
        </div>
      </div>
      <blockquote className="mt-6 border-l-2 border-red pl-5 text-[16px] leading-[1.75] text-ink sm:text-[17px]">{person.quote}</blockquote>
      <a
        aria-label={`${person.author} on LinkedIn`}
        className="ml-5 mt-4 inline-flex items-center gap-2 border border-line-light px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-red hover:text-red"
        href={person.link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <FaLinkedin aria-hidden="true" className="size-4 text-red" />
        Connect on LinkedIn
      </a>
    </article>
  );
}

/** The chairman and managing director side by side, offset, each portrait drifting inside its frame. */
export default function LeaderSplit() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="max-w-3xl">
        <Eyebrow>{LEADERS.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
          {LEADERS.title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg" data-reveal style={{ "--i": 1 }}>
          {LEADERS.description}
        </p>
      </div>
      <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:gap-14">
        {LEADERS.people.map((person, index) => (
          <Leader index={index} key={person.author} person={person} />
        ))}
      </div>
    </section>
  );
}
