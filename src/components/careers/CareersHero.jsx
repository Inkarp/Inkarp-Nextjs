"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import { branches } from "@/data/branches";
import styles from "./CareersHero.module.css";

// Words and names exactly as they were on the careers page.
const TEAM = [
  {
    name: "D. Saritha",
    role: "Manager, Commercials",
    quote: "Mentoring and freedom at Inkarp shaped my career. Proud of our impact; excited for what's next.",
  },
  {
    name: "M. Srinivas",
    role: "General Manager",
    quote: "23+ years of opportunity and supportive leadership. Grateful for growth and confident we'll keep leading.",
  },
  {
    name: "I. Hari Krishna",
    role: "Warehouse Incharge",
    quote: "Joining in 1992 was a turning point. Thankful for leadership support. Proud of our impact and future.",
  },
  {
    name: "L. Vijaya Bhaskar",
    role: "Service Manager",
    quote: "21 years of growth and lasting relationships. Thankful for trust and support; excited for more milestones.",
  },
  { name: "Dasari Raju", quote: "Inkarp isn't just a workplace - it's where passion meets purpose." },
  { name: "Praneeth", quote: "You're encouraged to grow - not just in role, but in vision." },
  { name: "Sharath", quote: "Ownership, learning, and impact are part of everyday work." },
  { name: "Pavan", quote: "A culture that listens, trusts, and enables you to do your best work." },
  { name: "Sanghavi", quote: "We celebrate ideas and encourage experimentation." },
  { name: "Apoorva", quote: "Growth here isn't a buzzword - it's a roadmap." },
];

// Same three figures as the contact page hero.
const FACTS = [
  { value: "1985", label: "Serving labs since" },
  { value: "45+", label: "Global principals" },
  { value: String(branches.length), label: "Branches in India" },
];

// How long each quote stays up: the time its tube takes to fill.
const DWELL_MS = 6500;

const pad = (value) => String(value).padStart(2, "0");

// "D. Saritha" → DS, "I. Hari Krishna" → IK, "Praneeth" → PR.
function initials(name) {
  const words = name.replace(/\./g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default function CareersHero() {
  const panelRef = useRef(null);
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);

  const paused = userPaused || hovered || focused || !inView;
  const total = TEAM.length;

  const go = useCallback((step) => setActive((current) => (current + step + total) % total), [total]);

  // Hold the timer while the panel is off screen, so nobody scrolls back to a
  // quote they never saw.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative" data-scroll-skip>
      {/* On laptops and desktops the whole hero fits the first screen under
          the header: spacing and type scale with the window height (see
          .frame and friends in the CSS module). */}
      <div className={`${styles.frame} mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-12">
          {/* ── We are hiring: top flush with the panel's top edge, figures flush with its bottom ── */}
          <div className={`${styles.lead} flex flex-col gap-10 lg:justify-between`}>
            <div>
              <div className={styles.rise} style={{ "--i": 0 }}>
                <RecTag>We Are Hiring</RecTag>
              </div>
              <h1
                className={`${styles.rise} ${styles.title} text-[36px] leading-[1.04] tracking-tight text-ink sm:text-5xl`}
                style={{ "--i": 1 }}
              >
                Do the most meaningful work of your career at{" "}
                <em className="italic text-red">Inkarp.</em>
              </h1>
              <p
                className={`${styles.rise} ${styles.lede} mt-5 max-w-[500px] text-base leading-relaxed text-ink-soft sm:text-lg`}
                style={{ "--i": 2 }}
              >
                We hire for potential, not just positions. If you love solving real problems and learning fast,
                you&apos;ll feel at home.
              </p>

              <div
                className={`${styles.rise} ${styles.ctas} mt-8 flex flex-wrap items-center gap-x-6 gap-y-4`}
                style={{ "--i": 3 }}
              >
                <a
                  className="inline-flex h-12 items-center gap-2 border border-rose-200 bg-rose-50 px-6 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 motion-reduce:hover:translate-y-0"
                  href="#open-roles"
                >
                  See open roles
                  <FiArrowDown aria-hidden="true" className="size-4" />
                </a>
                <a
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line-light decoration-2 underline-offset-[6px] transition hover:text-red hover:decoration-red"
                  href="#careers-form"
                >
                  Share your profile
                  <FiArrowRight
                    aria-hidden="true"
                    className="size-4 transition group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  />
                </a>
              </div>
            </div>

            <dl
              className={`${styles.rise} ${styles.facts} grid max-w-[500px] grid-cols-3 border-y border-line-light`}
              style={{ "--i": 4 }}
            >
              {FACTS.map((fact, index) => (
                <div
                  className={`flex flex-col-reverse py-4 ${index ? "border-l border-line-light pl-4" : "pr-4"}`}
                  key={fact.label}
                >
                  <dt className="mt-1.5 text-[11px] uppercase leading-snug tracking-[0.1em] text-ink-soft">
                    {fact.label}
                  </dt>
                  <dd className="font-mono text-2xl font-semibold leading-none text-ink sm:text-[28px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── What our team says ── */}
          <div className={styles.rise} style={{ "--i": 2 }}>
            <div
              aria-label="What our team says"
              aria-roledescription="carousel"
              className={`${styles.panel} flex h-full flex-col p-5 text-white sm:p-8`}
              data-paused={paused ? "" : undefined}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              ref={panelRef}
              role="region"
              style={{ "--dwell": `${DWELL_MS}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-[0.14em] text-white/75">
                  <span aria-hidden="true" className="h-px w-[22px] bg-[#ff3b4a]" />
                  What Our Team Says
                </span>
                <div className="flex items-center gap-2">
                  {/* The tubes already show where you are; the counter only where there is room. */}
                  <span aria-hidden="true" className="mr-1 hidden whitespace-nowrap font-mono text-xs tracking-[0.12em] text-white/55 xl:inline">
                    <span className="text-white">{pad(active + 1)}</span> / {pad(total)}
                  </span>
                  <PanelButton className="hidden sm:inline-flex" label="Previous quote" onClick={() => go(-1)}>
                    <FiChevronLeft aria-hidden="true" className="size-4" />
                  </PanelButton>
                  <PanelButton className="hidden sm:inline-flex" label="Next quote" onClick={() => go(1)}>
                    <FiChevronRight aria-hidden="true" className="size-4" />
                  </PanelButton>
                  <PanelButton
                    label={userPaused ? "Play quotes" : "Pause quotes"}
                    onClick={() => setUserPaused((value) => !value)}
                    pressed={userPaused}
                  >
                    {userPaused ? (
                      <FiPlay aria-hidden="true" className="size-3.5" />
                    ) : (
                      <FiPause aria-hidden="true" className="size-3.5" />
                    )}
                  </PanelButton>
                </div>
              </div>

              {/* While quotes change on their own, screen readers aren't
                  interrupted; once paused, a change is announced. */}
              <div
                aria-live={paused ? "polite" : "off"}
                className={`${styles.stack} flex-1 content-center py-10`}
              >
                {TEAM.map((member, index) => {
                  const isActive = index === active;
                  return (
                    <figure
                      aria-hidden={isActive ? undefined : true}
                      aria-label={`${index + 1} of ${total}`}
                      aria-roledescription="slide"
                      className={styles.quote}
                      data-active={isActive ? "" : undefined}
                      key={member.name}
                    >
                      <span
                        aria-hidden="true"
                        className={`${styles.mark} block h-10 font-display text-[88px] leading-none text-[#ff3b4a] sm:h-12 sm:text-[104px]`}
                      >
                        &ldquo;
                      </span>
                      <blockquote
                        className={`${styles.quoteText} mt-4 max-w-[32ch] text-[22px] leading-snug text-white sm:text-[28px] sm:leading-[1.3]`}
                      >
                        {member.quote}
                      </blockquote>
                      <figcaption className={`${styles.caption} mt-8 flex items-center gap-4`}>
                        <span
                          aria-hidden="true"
                          className="inline-flex size-11 shrink-0 items-center justify-center border border-white/25 bg-white/5 font-mono text-sm tracking-[0.06em] text-white"
                        >
                          {initials(member.name)}
                        </span>
                        <span className="block">
                          <cite className="block text-base font-semibold not-italic text-white">{member.name}</cite>
                          {member.role ? (
                            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
                              {member.role}
                            </span>
                          ) : null}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              <div role="group" aria-label="Choose a colleague">
                <div className={styles.rack}>
                  <span aria-hidden="true" className={styles.plate} />
                  <span aria-hidden="true" className={styles.base} />
                  {TEAM.map((member, index) => {
                    const isActive = index === active;
                    const state = isActive ? "active" : index < active ? "read" : "idle";
                    return (
                      <button
                        aria-current={isActive ? "true" : undefined}
                        aria-label={`Read ${member.name}`}
                        className={styles.tubeButton}
                        data-state={state}
                        key={member.name}
                        onClick={() => setActive(index)}
                        title={member.name}
                        type="button"
                      >
                        <span aria-hidden="true" className={styles.glass}>
                          <span className={styles.tube}>
                            <span
                              className={`${styles.liquid} ${isActive ? styles.filling : ""}`}
                              onAnimationEnd={isActive ? () => go(1) : undefined}
                            />
                          </span>
                        </span>
                        <span aria-hidden="true" className={styles.label}>
                          {initials(member.name)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelButton({ children, className = "inline-flex", label, onClick, pressed }) {
  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={`${className} size-9 shrink-0 items-center justify-center border border-white/20 text-white/80 transition hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b4a]`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
