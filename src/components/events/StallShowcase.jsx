"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ShowcaseDeck from "./ShowcaseDeck";
import styles from "./StallShowcase.module.css";

/**
 * What is on show at the stall, in the show's colours, under the events
 * banner. On wide screens the stall from the banner comes down the screen as
 * the page scrolls, step for step with the scroll; when this section reaches
 * the top it holds still (sticky, over a runway of extra scroll) while the
 * stall settles into its centre and the two decks of product cards
 * (ShowcaseDeck), gathered behind it, split out to either side. Phones,
 * tablets and reduced motion get the stall in place and one deck under it.
 * The banner marks its stall with `data-stall-origin` (StageEventBanner).
 * Data: `bannerEvent.displayProducts` in src/data/events.js.
 */

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (from, to, t) => from + (to - from) * t;
// The decks stay behind the stall until this share of the way down.
const CARDS_FROM = 0.62;

export default function StallShowcase({ event }) {
  const products = event.displayProducts ?? [];
  const half = Math.ceil(products.length / 2);
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const landingRef = useRef(null);
  const landingImageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const origin = document.querySelector("[data-stall-origin]");
    const section = sectionRef.current;
    const pin = pinRef.current;
    const landing = landingRef.current;
    const landingImage = landingImageRef.current;
    const ring = ringRef.current;
    if (!section || !pin || !landing || !landingImage || !ring) return undefined;

    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The travelling stall lives on <body>, outside any transformed parent.
    const traveller = document.createElement("div");
    traveller.className = styles.traveller;
    traveller.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    image.src = event.stallImage;
    traveller.appendChild(image);
    document.body.appendChild(traveller);
    // Decode it now, off the main thread, rather than mid-scroll; the same for
    // this section's own pictures (the landed stall and the product photos),
    // which would otherwise be decoded the moment they first come into view.
    image.decode().catch(() => {});
    section.querySelectorAll("img").forEach((img) => img.decode?.().catch(() => {}));

    const cards = () => cardRefs.current.filter(Boolean);

    const settle = () => {
      traveller.style.visibility = "hidden";
      traveller.style.opacity = "0";
      if (origin) origin.style.visibility = "";
      landingImage.style.opacity = "1";
      ring.style.opacity = "1";
      cards().forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
    };

    // Everything is measured up front (and again when the page's size
    // changes), so a scroll frame reads nothing from the page, which would
    // force a layout, and writes only transforms and opacity.
    let m = null;
    const measure = () => {
      const y = window.scrollY;
      const from = origin.getBoundingClientRect();
      const to = landing.getBoundingClientRect();
      const box = section.getBoundingClientRect();
      const held = pin.getBoundingClientRect();
      m = {
        fromTop: from.top + y,
        fromLeft: from.left,
        fromWidth: from.width,
        sectionTop: box.top + y,
        // How far the held part can slide within the section (the runway).
        travel: box.height - held.height,
        // The landing spot within the held part.
        toTop: to.top - held.top,
        toLeft: to.left,
        toWidth: to.width,
        // It lifts off with the first scroll and lands as the held section
        // lets go (or at the bottom of the page, if that comes first).
        endY: Math.min(box.top + y + box.height - held.height, document.documentElement.scrollHeight - window.innerHeight),
        // Each card's offset to the landing spot's centre: both sit in the
        // held section, so the offset holds whatever the scroll.
        cards: cards().map((card) => {
          const slot = card.parentElement.getBoundingClientRect();
          return {
            card,
            dx: to.left + to.width / 2 - (slot.left + slot.width / 2),
            dy: to.top + to.height / 2 - (slot.top + slot.height / 2),
          };
        }),
      };
      // Drawn at the banner size and only scaled down from there (no resizing
      // of the picture on every frame). It waits, invisible but already drawn
      // on its own layer, over the banner's stall: the first scroll only has
      // to show it, not draw it.
      traveller.style.width = `${m.fromWidth}px`;
      traveller.style.visibility = "visible";
    };

    let frame = 0;
    let stale = true;
    let lastP = -1;
    const update = () => {
      frame = 0;
      if (!origin || !wide.matches || still.matches) {
        settle();
        lastP = -1;
        stale = true;
        return;
      }
      if (stale) {
        measure();
        stale = false;
        lastP = -1;
      }
      if (m.endY < 80) {
        settle();
        return;
      }

      // Step for step with the scroll: from where the stall sat in the banner
      // (its place at the top of the page) towards wherever the landing spot
      // is on screen right now, so it comes down the screen as the page moves
      // up, and meets the spot exactly as the section lets go.
      const y = window.scrollY;
      const p = clamp(y / m.endY);
      if (p === lastP && (p === 0 || p === 1)) return;
      lastP = p;
      // Where the landing spot is on screen now, worked out rather than
      // measured: the held part rides with the section until it reaches the
      // top, stays there for the runway, then rides on.
      const sectionTop = m.sectionTop - y;
      const heldTop = Math.min(Math.max(sectionTop, 0), sectionTop + m.travel);
      const top = lerp(m.fromTop, heldTop + m.toTop, p);
      const left = lerp(m.fromLeft, m.toLeft, p);
      const scale = lerp(1, m.toWidth / m.fromWidth, p);
      traveller.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
      traveller.style.opacity = p > 0 && p < 1 ? "1" : "0";
      // Hidden (not just transparent) so the banner stops painting its
      // floating, sheened stall while it is away.
      origin.style.visibility = p > 0 ? "hidden" : "";
      landingImage.style.opacity = p >= 1 ? "1" : "0";

      // The cards wait behind the landing spot and split out as it lands.
      const q = ease(clamp((p - CARDS_FROM) / (1 - CARDS_FROM)));
      ring.style.opacity = String(q);
      const scaleCard = lerp(0.8, 1, q);
      m.cards.forEach(({ card, dx, dy }) => {
        card.style.transform = `translate3d(${dx * (1 - q)}px, ${dy * (1 - q)}px, 0) scale(${scaleCard})`;
        card.style.opacity = String(q);
      });
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      stale = true;
      request();
    };

    // Images and fonts settling change the page's height: measure again then,
    // right after the browser's own layout (so the measuring costs nothing).
    const resized = new ResizeObserver(() => {
      if (origin && wide.matches && !still.matches) {
        measure();
        stale = false;
        lastP = -1;
      }
      request();
    });
    resized.observe(document.body);

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    wide.addEventListener("change", remeasure);
    still.addEventListener("change", remeasure);
    return () => {
      window.cancelAnimationFrame(frame);
      resized.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      wide.removeEventListener("change", remeasure);
      still.removeEventListener("change", remeasure);
      traveller.remove();
      if (origin) origin.style.visibility = "";
    };
  }, [event.stallImage]);

  if (!products.length) return null;

  return (
    <section
      aria-labelledby="stall-showcase-title"
      className="relative isolate overflow-clip bg-[linear-gradient(180deg,#001e36_0%,#0b3150_55%,#102f4b_100%)] text-white"
      data-scroll-skip=""
      ref={sectionRef}
    >
      {/* PMEC's light strands, faint, sweeping round the right this time. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] top-1/2 -z-10 h-[140%] w-[65%] -translate-y-1/2 opacity-[0.12]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 400 400"
      >
        {[0, 1, 2, 3, 4].map((n) => (
          <ellipse cx="200" cy="200" key={n} rx={190 - n * 10} ry={120 - n * 16} stroke="#c9d6f2" strokeWidth="1.2" transform={`rotate(${16 - n * 6} 200 200)`} />
        ))}
      </svg>

      {/* overflow-clip (not hidden) on the section, so this can stick. */}
      <div className={styles.pin} ref={pinRef}>
        <div className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20">
          {/* On wide screens the heading sits top left, clear of the stall's
              path down the middle; the stall and the two stacks share the row
              below it. */}
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-2">
            <div className="mx-auto max-w-[620px] text-center lg:col-start-1 lg:row-start-1 lg:mx-0 lg:text-left">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6b75]">
                {event.hall} · Stall {event.stallNumber}
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl" id="stall-showcase-title">
                {event.showcaseTitle ?? `On display at ${event.name} ${event.edition}`}
              </h2>
              {event.showcaseIntro ? (
                <p className="mt-3 text-base leading-relaxed text-white/70">{event.showcaseIntro}</p>
              ) : null}
            </div>

            {/* The landing spot, between the two stacks on wide screens. */}
            <div className="relative mx-auto w-full max-w-[440px] lg:col-start-2 lg:row-start-2">
              <div aria-hidden="true" className={styles.floorGlow} />
              <div aria-hidden="true" className={styles.floorRing} ref={ringRef} />
              <div className="relative aspect-[4/3] w-full" ref={landingRef}>
                <div className="absolute inset-0" ref={landingImageRef}>
                  <Image
                    alt={event.stallImageAlt ?? `${event.name} ${event.edition} stall`}
                    className="object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.55)]"
                    fill
                    // Loaded with the page, not lazily as the stall travels in
                    // (decoding mid-scroll stalled a frame).
                    loading="eager"
                    sizes="(min-width: 1024px) 440px, 90vw"
                    src={event.stallImage}
                  />
                </div>
              </div>
            </div>

            {/* A deck either side of the stall on wide screens; the script
                moves each deck's wrapper (its parent keeps the place). */}
            <div className="hidden lg:col-start-1 lg:row-start-2 lg:block">
              <div
                className={styles.flyer}
                ref={(node) => {
                  cardRefs.current[0] = node;
                }}
              >
                <ShowcaseDeck label="Products on show, first half" products={products.slice(0, half)} side="left" />
              </div>
            </div>
            <div className="hidden lg:col-start-3 lg:row-start-2 lg:block">
              <div
                className={styles.flyer}
                ref={(node) => {
                  cardRefs.current[1] = node;
                }}
              >
                <ShowcaseDeck label="Products on show, second half" products={products.slice(half)} side="right" />
              </div>
            </div>
            {/* Phones and tablets: one deck of them all, under the stall. */}
            <div className="lg:hidden">
              <ShowcaseDeck label="Products on show" products={products} />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={styles.runway} />
    </section>
  );
}
