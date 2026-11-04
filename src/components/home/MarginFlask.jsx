"use client";

import { useEffect, useRef } from "react";
import { FLASK_STOPS } from "./FlaskDock";
import JourneyFlask, { VESSELS } from "./JourneyFlask";
import styles from "./MarginFlask.module.css";

/**
 * The homepage's "subtle" glassware (HomeBody motion "subtle"): a small
 * piece of glassware that rides the page's left margin, so it never passes
 * over the content. It rests beside each section's tag (RecTag,
 * `data-rec-tag`) while that tag passes the middle of the screen, glides down
 * to the next one, and on landing becomes that section's glassware (the same
 * six as the travelling glassware, FLASK_STOPS), a little fuller each time.
 * It falls in from the top of the screen as the page opens (after the
 * opening animation, LabIntro, if that is playing). Wide screens only, and
 * not with reduced motion: on narrower screens the margin is too slim.
 *
 * A scroll frame reads nothing from the page: the tags are measured up
 * front and again when the page's size changes.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, t) => from + (to - from) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// The glassware's width (px). A tag is reached when it is this far down the
// screen; the glassware rests by it while it is within a fifth of a screen
// of that (never more than a quarter of the way to the next tag).
const SIZE = 30;
const FOCUS = 0.5;
const HOLD_SCREENS = 0.2;
const HOLD_SHARE = 0.25;
const SWAP_MS = 320;
const FALL = [
  { offset: 0, opacity: 1, transform: "translateY(-75vh) rotate(-12deg)", easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  { offset: 0.6, opacity: 1, transform: "translateY(0) scale(1.08, 0.9)", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
  { offset: 0.8, opacity: 1, transform: "translateY(-6px) scale(0.98, 1.03)" },
  { offset: 1, opacity: 1, transform: "none" },
];

// How far the site's scroll reveal (ScrollAnimations) still has a tag's
// section pushed down: the tags are measured where they will come to rest.
function revealShift(node) {
  let shift = 0;
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (el.dataset.scrollReveal !== "true") continue;
    const { transform } = getComputedStyle(el);
    if (transform && transform !== "none") shift += new DOMMatrixReadOnly(transform).m42;
  }
  return shift;
}

export default function MarginFlask() {
  const travellerRef = useRef(null);
  const fallRef = useRef(null);

  useEffect(() => {
    const traveller = travellerRef.current;
    const fall = fallRef.current;
    if (!traveller || !fall) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const vessels = new Map(Array.from(fall.querySelectorAll("[data-vessel]"), (el) => [el.dataset.vessel, el]));
    const introPlaying = () => body.dataset.labIntro === "playing";

    let disposed = false;
    let on = false;
    let opened = false;
    let stops = [];
    let x = 0;
    let vh = window.innerHeight;
    let stale = true;
    let frame = 0;
    let current = null;
    let lastKey = "";

    const measure = () => {
      stale = false;
      vh = window.innerHeight;
      const y = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      const main = document.querySelector("main");
      // Centred in the margin left of the page's content.
      x = (main ? main.getBoundingClientRect().left : 0) / 2 - SIZE / 2;
      const tags = Array.from(document.querySelectorAll("main section"), (section) => section.querySelector("[data-rec-tag]")).filter(
        (tag) => tag && tag.offsetWidth,
      );
      stops = tags
        .map((tag) => {
          const box = tag.getBoundingClientRect();
          return { y: box.top + box.height / 2 + y - revealShift(tag) };
        })
        .sort((a, b) => a.y - b.y)
        .map((stop, index) => {
          const plan = FLASK_STOPS[Math.min(index, FLASK_STOPS.length - 1)];
          return { ...stop, kind: plan.kind, fill: plan.level };
        });
      let floor = 0;
      for (const stop of stops) {
        stop.at = Math.max(floor, clamp(stop.y - vh * FOCUS, 0, maxScroll));
        floor = stop.at;
      }
    };

    const locate = (y) => {
      const last = stops.length - 1;
      if (y <= stops[0].at) return { i: 0, p: 0 };
      if (y >= stops[last].at) return { i: last - 1, p: 1 };
      let i = 0;
      while (i < last - 1 && y >= stops[i + 1].at) i += 1;
      const from = stops[i].at;
      const gap = stops[i + 1].at - from;
      const hold = Math.min(gap * HOLD_SHARE, vh * HOLD_SCREENS);
      return { i, p: smoother(clamp((y - from - hold) / Math.max(gap - 2 * hold, 1))) };
    };

    // On landing it becomes the spot's glassware: a quick cross-fade.
    const show = (kind) => {
      if (kind === current) return;
      const previous = current;
      current = kind;
      vessels.forEach((el, name) => {
        el.getAnimations().forEach((animation) => animation.cancel());
        el.style.display = name === kind || name === previous ? "block" : "none";
      });
      if (!previous) return;
      const old = vessels.get(previous);
      old
        .animate([{ opacity: 1 }, { opacity: 0, transform: "scale(0.8)" }], { duration: SWAP_MS, easing: "ease-in", fill: "forwards" })
        .finished.then(() => {
          if (current !== previous) old.style.display = "none";
        })
        .catch(() => {});
      vessels
        .get(kind)
        .animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "none" }], { duration: SWAP_MS, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" });
    };

    const update = () => {
      frame = 0;
      if (!on) return;
      if (stale) measure();
      if (stops.length < 2) return;
      const y = window.scrollY;
      const { i, p } = locate(y);
      const from = stops[i];
      const to = stops[i + 1];
      const top = lerp(from.y, to.y, p) - (SIZE * 130) / 120 / 2;
      const key = `${x.toFixed(1)} ${(top - y).toFixed(1)}`;
      if (key !== lastKey) {
        lastKey = key;
        traveller.style.transform = `translate3d(${x.toFixed(1)}px, ${(top - y).toFixed(1)}px, 0)`;
        traveller.style.setProperty("--flask-fill", lerp(from.fill, to.fill, p).toFixed(3));
      }
      // It carries this spot's glassware until it lands in the next.
      if (p === 0) show(from.kind);
      else if (p === 1) show(to.kind);
      else if (!current) show(from.kind);
    };

    function request() {
      if (!frame && !disposed) frame = window.requestAnimationFrame(update);
    }

    const decide = () => {
      const allowed = wide.matches && !still.matches && !introPlaying();
      if (allowed === on) return;
      on = allowed;
      root.toggleAttribute("data-margin-flask", on);
      if (!on) return;
      stale = true;
      lastKey = "";
      request();
      // The first showing falls in from the top of the screen, when the page
      // is still at the top.
      if (!opened) {
        opened = true;
        if (window.scrollY < vh * 0.4) fall.animate(FALL, { delay: 250, duration: 1000, fill: "backwards" });
      }
    };

    const watcher = new MutationObserver(decide);
    watcher.observe(body, { attributeFilter: ["data-lab-intro"], attributes: true });
    decide();

    const resized = new ResizeObserver(() => {
      if (!on) return;
      measure();
      lastKey = "";
      request();
    });
    resized.observe(body);
    const remeasure = () => {
      stale = true;
      request();
    };
    document.fonts?.ready.then(() => !disposed && remeasure());
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    wide.addEventListener("change", decide);
    still.addEventListener("change", decide);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      root.removeAttribute("data-margin-flask");
      watcher.disconnect();
      resized.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      wide.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
      [fall, ...vessels.values()].forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.traveller} ref={travellerRef} style={{ width: SIZE }}>
      <span className={styles.shadow} />
      <span className={styles.fall} ref={fallRef}>
        {Object.keys(VESSELS).map((kind) => (
          <span className={styles.vessel} data-vessel={kind} key={kind}>
            <JourneyFlask kind={kind} uid={`margin-flask-${kind}`} />
          </span>
        ))}
      </span>
    </div>
  );
}
