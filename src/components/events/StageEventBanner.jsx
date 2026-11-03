"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowUpRight, FiCheckCircle } from "react-icons/fi";
import EventTicket from "./EventTicket";
import styles from "./StageEventBanner.module.css";

/**
 * Events page banner for the next show, staged like the stand itself in the
 * show's own colours (PMEC India: deep indigo to navy, sky blue, glowing light
 * strands, soft rounded shapes): a spotlight on the stall render, a truss along
 * the top edge and the red LED strip of the booth's plinths along the bottom. When the page opens
 * the light comes up, the text slides in from the left line by line (the title
 * uncovered by a sweeping red block, in silver lettering) and the stall drops
 * onto the stage and settles; then it floats with a light sweeping across it
 * (animations: StageEventBanner.module.css). The text stays real text. The
 * dates, venue and stall sit on a pass (EventTicket), the show's logo stands
 * in for its name in the title, and on wide screens the stall travels down
 * into the section below as the page scrolls (StallShowcase).
 * Data: `bannerEvent` in src/data/events.js.
 */

// PMEC India's palette, sampled from its official artwork (cphi.com/india).
// Inkarp's red stays on the eyebrow, the year, the stall plate and the strip.
const PMEC_INDIGO = "#001e36";

// Soft rounded shapes, like those in PMEC's artwork (not its logo mark).
const ROUNDED = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="64" viewBox="0 0 120 64"><rect x="4" y="6" width="52" height="22" rx="11" fill="#fff"/><circle cx="84" cy="17" r="11" fill="#fff"/><rect x="64" y="38" width="52" height="22" rx="11" fill="#fff"/><circle cx="26" cy="49" r="11" fill="#fff"/></svg>'
)}")`;

// The truss along the top edge, echoing the booth's frame.
const TRUSS = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16"><path d="M0 1H24M0 15H24M0 15L12 1L24 15" fill="none" stroke="#fff" stroke-width="1"/></svg>'
)}")`;

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

function splitRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Countdown to doors-open; then "happening now", then a thank-you once it is over. */
function StageCountdown({ event, order = 0 }) {
  // null until mounted: the time left depends on the visitor's clock, so it is
  // never baked into the server HTML.
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const startsAt = new Date(event.startsAt).getTime();
    const endsAt = new Date(event.endsAt).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= endsAt) setRemaining({ state: "over" });
      else if (now >= startsAt) setRemaining({ state: "live" });
      else setRemaining({ state: "counting", ...splitRemaining(startsAt - now) });
    };
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [event.startsAt, event.endsAt]);

  if (remaining?.state === "over") {
    return (
      <p className={`${styles.enter} mt-7 max-w-[460px] border-l-2 border-red pl-4 text-sm leading-6 text-white/75`} style={{ "--i": order }}>
        Thank you to everyone who visited us at {event.name} {event.edition}.
      </p>
    );
  }

  if (remaining?.state === "live") {
    return (
      <p className={`${styles.enter} mt-7 inline-flex items-center gap-2 border border-red/50 bg-red/15 px-4 py-2.5 text-sm font-semibold`} style={{ "--i": order }}>
        <span aria-hidden="true" className="size-2 rounded-full bg-red motion-safe:animate-pulse" />
        Happening now: find us in {event.hall}, Stall {event.stallNumber}
      </p>
    );
  }

  const counting = remaining?.state === "counting";
  return (
    <div className={`${styles.enter} mt-7`} style={{ "--i": order }}>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/50">Doors open in</p>
      <div className="mt-3 grid max-w-[420px] grid-cols-4 gap-2">
        {UNITS.map((unit) => (
          <div className="border border-white/10 bg-white/[0.05] px-2 py-3 text-center" key={unit.key}>
            <span
              className={`block font-mono text-2xl font-semibold leading-none tabular-nums sm:text-3xl ${
                unit.key === "seconds" ? "text-red" : styles.silver
              }`}
            >
              {counting ? String(remaining[unit.key]).padStart(2, "0") : "--"}
            </span>
            <span className="mt-1.5 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/50">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StageEventBanner({ event }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#001e36_0%,#0b3150_48%,#1d4968_100%)] text-white"
      style={{ backgroundColor: PMEC_INDIGO }}
    >
      {/* Cool light from the rig above the stall, the sky-blue glow of the
          stage floor, and a touch of Inkarp red low on the left. */}
      <div
        aria-hidden="true"
        className={`${styles.lightOn} pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_65%_at_72%_-8%,rgba(170,200,235,0.22),transparent_65%),radial-gradient(45%_45%_at_72%_105%,rgba(69,124,163,0.5),transparent_70%),radial-gradient(35%_50%_at_0%_100%,rgba(190,0,16,0.12),transparent_70%)]`}
      />
      {/* Glowing light strands sweeping round the left, as in PMEC's artwork. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] top-1/2 -z-10 h-[150%] w-[70%] -translate-y-1/2 opacity-[0.16] blur-[0.5px]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 400 400"
      >
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <ellipse cx="200" cy="200" key={n} rx={190 - n * 9} ry={120 - n * 14} stroke="#c9d6f2" strokeWidth="1.2" transform={`rotate(${-18 + n * 6} 200 200)`} />
        ))}
      </svg>
      {/* Soft rounded shapes behind the stall. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[55%] opacity-[0.045] [mask-image:linear-gradient(to_left,#000_40%,transparent)]"
        style={{ backgroundImage: ROUNDED, backgroundSize: "120px 64px" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-4 border-b border-white/10 opacity-25"
        style={{ backgroundImage: TRUSS, backgroundSize: "24px 16px" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-red shadow-[0_0_20px_3px_rgba(190,0,16,0.75)]"
      />

      {/* The stall sits at the top of its column (not centred against the
          taller text), so the whole stand is in view on the first screen. */}
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-6 lg:px-8 lg:pb-14 lg:pt-10">
        <div className="min-w-0">
          {/* Each line slides in from the left in turn (--i is its place). */}
          {/* The lead-in ("Meet us at"), picked out as a glowing red tag. */}
          <p className={`${styles.enter} inline-flex items-center gap-2 rounded-full bg-red px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(190,0,16,0.55)]`} style={{ "--i": 0 }}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white motion-safe:animate-pulse" />
            {event.eyebrow}
          </p>

          {/* Uncovered by a red block sweeping across: the show's own logo in
              place of its name (bannerEvent.logo; the name in silver if
              there is none), then the year. */}
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            <span className={styles.reveal}>
              <span className={`${styles.revealText} inline-flex items-end gap-3 sm:gap-4`}>
                {event.logo ? (
                  <Image
                    alt={event.name}
                    className="h-11 w-auto sm:h-[52px]"
                    height={event.logo.height}
                    priority
                    src={event.logo.src}
                    width={event.logo.width}
                  />
                ) : (
                  <span className={styles.silver}>{event.name}</span>
                )}{" "}
                <em className="italic leading-[0.8] text-red">{event.edition}</em>
              </span>
            </span>
          </h1>
          {event.partOf ? (
            <p className={`${styles.enter} mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50`} style={{ "--i": 2 }}>
              Part of {event.partOf}
            </p>
          ) : null}

          {/* Dates, venue, hall and stall as a pass with a tear-off stub. The
              slide-in sits on a wrapper so the pass's own hover lift works. */}
          <div className={`${styles.enter} mt-6`} style={{ "--i": 3 }}>
            <EventTicket event={event} />
          </div>

          <p className={`${styles.enter} mt-6 max-w-[500px] text-base leading-relaxed text-white/70`} style={{ "--i": 5 }}>
            {event.summary}
          </p>

          <StageCountdown event={event} order={6} />

          {event.registrationUrl ? (
            <a
              className={`${styles.enter} mt-7 inline-flex items-center gap-2 bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#99000d]`}
              href={event.registrationUrl}
              style={{ "--i": 8 }}
              rel="noopener noreferrer"
              target="_blank"
            >
              Register to visit
              <FiArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          ) : null}
        </div>

        {/* The stall, under a spotlight, on a lit floor (first on phones, so
            the stand is the first thing seen). It drops in from the top of the
            banner, lands, and lights up the floor; what you will find there
            sits in a row beneath it. */}
        <div className="relative order-first lg:order-none">
          <div
            aria-hidden="true"
            className={`${styles.lightOn} pointer-events-none absolute left-1/2 top-[-14%] h-[85%] w-[75%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_152deg,rgba(255,255,255,0.10)_180deg,transparent_208deg)] blur-md`}
          />
          <div
            aria-hidden="true"
            className={`${styles.landGlow} pointer-events-none absolute inset-x-[8%] bottom-[12%] h-[16%] rounded-[50%] bg-[#457ca3]/55 blur-3xl`}
          />
          <div
            aria-hidden="true"
            className={`${styles.landRing} pointer-events-none absolute inset-x-[12%] bottom-[16%] h-[13%] rounded-[50%] border-2 border-[#7fa8d1]/70`}
          />
          {/* data-stall-origin: where StallShowcase picks the stall up from as
              the page scrolls (this wrapper itself never moves). On short
              screens it is kept small enough to fit under the header. */}
          <div className="mx-auto lg:max-w-[calc((100vh_-_250px)*4/3)]" data-stall-origin="">
            <div className={styles.drop}>
              <div className={`${styles.float} relative`}>
                <Image
                  alt={event.stallImageAlt ?? `${event.name} ${event.edition} stall`}
                  className="h-auto w-full drop-shadow-[0_28px_36px_rgba(0,0,0,0.55)]"
                  height={1050}
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  src={event.stallImage}
                  width={1400}
                />
                {/* A light sweeping across the stand, masked to the stall's own shape. */}
                <span
                  aria-hidden="true"
                  className={`${styles.sheen} pointer-events-none absolute inset-0`}
                  style={{
                    WebkitMaskImage: `url("${event.stallImage}")`,
                    maskImage: `url("${event.stallImage}")`,
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                  }}
                />
              </div>
            </div>
          </div>

          <ul className={`${styles.enter} relative mt-3 flex flex-wrap justify-center gap-1.5`} style={{ "--i": 7 }}>
            {event.highlights.map((item) => (
              <li
                className="inline-flex items-center gap-1.5 whitespace-nowrap border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur-sm"
                key={item}
              >
                <FiCheckCircle aria-hidden="true" className="size-3.5 shrink-0 text-[#7fa8d1]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
