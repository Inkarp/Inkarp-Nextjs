"use client";

import { useEffect, useRef } from "react";
import JourneyFlask, { VESSELS } from "./JourneyFlask";
import styles from "./FlaskJourney.module.css";

/**
 * The sample that travels down the homepage. Each section there has
 * a landing spot (FlaskDock) with its own piece of glassware. On wide screens
 * one traveller, fixed to the screen, carries the sample from spot to spot
 * step for step with the scroll: it rests in a spot while that spot passes
 * the middle of the screen, lifts off, glides down to the next spot as it
 * comes up, and lands in it. Half-way it turns from this spot's glassware
 * into the next one's, like a coin turning over. It fills a little more at
 * every spot, leans into the way it is going and its liquid sloshes as it
 * settles. It takes over from the hero's flask once that has fallen in (or at
 * the first scroll); after the opening animation (LabIntro) it falls into the
 * hero itself, from the top of the screen.
 * Phones, tablets and reduced motion keep still glassware in each spot.
 *
 * A scroll frame reads nothing from the page, which would force a layout: the
 * spots are measured up front and again when the page's size changes, and a
 * frame writes only transforms, opacity, display and custom properties.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, t) => from + (to - from) * t;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// A spot is reached when its middle is this far down the screen; the flask
// rests in it while it is within a fifth of a screen either side of that
// (and never more than a quarter of the way to the next spot).
const FOCUS = 0.5;
const HOLD_SCREENS = 0.2;
const HOLD_SHARE = 0.25;
// The lean: degrees per px/ms of sideways speed (averaged over SPEED_MS, so a
// single wheel step still reads as a push), and at most. The springs that
// ease the lean and slosh the liquid: natural period (ms) and damping.
const LEAN_PER_SPEED = 12;
const LEAN_MAX = 14;
const SPEED_MS = 140;
const LEAN = { period: 520, damping: 0.45 };
const SLOSH = { period: 900, damping: 0.15 };
const SLOSH_MAX = 26;
const STEP_MS = 8;
// Half-way through a flight (by scroll) the glassware turns into the next
// spot's, over a fixed time, so it reads the same however fast the page
// moves: the old one narrows to edge-on, the new one widens out with a little
// overshoot, and a ring bursts from them.
const SWAP_AT = 0.5;
const TURN_OUT = [
  { offset: 0, opacity: 1, transform: "none" },
  { offset: 0.85, opacity: 1 },
  { offset: 1, opacity: 0, transform: "scale(0.02, 0.9)" },
];
// Unseen until its turn (edge-on it would still show as a hairline).
const TURN_IN = [
  { offset: 0, opacity: 0, transform: "scale(0.02, 0.9)" },
  { offset: 0.12, opacity: 1 },
  { offset: 0.6, transform: "scale(1.1, 0.97)" },
  { offset: 1, opacity: 1, transform: "none" },
];
const TURN_OUT_MS = 170;
const TURN_IN_MS = 330;
const BURST = [
  { opacity: 0.85, transform: "scale(0.35)" },
  { opacity: 0, transform: "scale(1.5)" },
];
// The opening fall into the hero, from above the screen: the same keyframes
// and timing as the spots' CSS flask-drop and flask-fill.
const DROP = [
  { offset: 0, transform: "translateY(-75vh) rotate(-14deg)", easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  { offset: 0.58, transform: "translateY(0) scale(1.07, 0.9)", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
  { offset: 0.74, transform: "translateY(-12px) scale(0.97, 1.04)", easing: "cubic-bezier(0.5, 0, 0.8, 0.5)" },
  { offset: 0.88, transform: "translateY(0) scale(1.03, 0.97)" },
  { offset: 1, transform: "none" },
];
const EASE_OUT = "cubic-bezier(0.3, 0.7, 0.3, 1)";

function spring(state, target, { period, damping }, dt) {
  const omega = (2 * Math.PI) / period;
  state.v += (-omega * omega * (state.x - target) - 2 * damping * omega * state.v) * dt;
  state.x += state.v * dt;
}

// How far the site's scroll reveal (ScrollAnimations) still has a spot's
// section pushed down: the spots are measured where they will come to rest.
function revealShift(node) {
  let shift = 0;
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (el.dataset.scrollReveal !== "true") continue;
    const { transform } = getComputedStyle(el);
    if (transform && transform !== "none") shift += new DOMMatrixReadOnly(transform).m42;
  }
  return shift;
}

export default function FlaskJourney() {
  const travellerRef = useRef(null);
  const tiltRef = useRef(null);
  const dropRef = useRef(null);
  const flightRef = useRef(null);
  const burstRef = useRef(null);

  useEffect(() => {
    const traveller = travellerRef.current;
    const tilt = tiltRef.current;
    const drop = dropRef.current;
    const flight = flightRef.current;
    const burst = burstRef.current;
    if (!traveller || !tilt || !drop || !flight || !burst) return undefined;

    const root = document.documentElement;
    const vessels = new Map(Array.from(drop.querySelectorAll("[data-vessel]"), (el) => [el.dataset.vessel, el]));
    const body = document.body;
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const docks = () => document.querySelectorAll("[data-flask-dock]");
    const introPlaying = () => body.dataset.labIntro === "playing";
    const canTravel = () => wide.matches && !still.matches && docks().length > 1;

    let disposed = false;
    let travelling = false;
    let stops = [];
    let base = 1;
    let vh = window.innerHeight;
    let stale = true;
    let frame = 0;
    let lastTime = 0;
    let lastX = null;
    let speed = 0;
    let here = null;
    let busy = false;
    const lean = { x: 0, v: 0 };
    const slosh = { x: 0, v: 0 };

    const measure = () => {
      stale = false;
      vh = window.innerHeight;
      const y = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      stops = Array.from(docks(), (el) => {
        if (!el.offsetWidth) return null;
        const box = el.getBoundingClientRect();
        return {
          el,
          x: box.left,
          y: box.top + y - revealShift(el),
          w: box.width,
          h: box.height,
          fill: Number(el.dataset.flaskLevel) || 0,
          kind: vessels.has(el.dataset.flaskKind) ? el.dataset.flaskKind : "erlenmeyer",
        };
      })
        .filter(Boolean)
        .sort((a, b) => a.y - b.y);
      // The scroll at which each spot is reached, never before the last one's.
      let floor = 0;
      for (const stop of stops) {
        stop.at = Math.max(floor, clamp(stop.y + stop.h / 2 - vh * FOCUS, 0, maxScroll));
        floor = stop.at;
      }
      // Drawn at the widest spot's size and only scaled down from there.
      base = Math.max(1, ...stops.map((stop) => stop.w));
      traveller.style.width = `${base}px`;
    };

    // Which two spots the flask is between at this scroll, and how far along
    // its flight (t, by scroll; p, eased: 0 resting in the first spot, 1
    // resting in the second).
    const locate = (y) => {
      const last = stops.length - 1;
      if (y <= stops[0].at) return { i: 0, p: 0, t: 0 };
      if (y >= stops[last].at) return { i: last - 1, p: 1, t: 1 };
      let i = 0;
      while (i < last - 1 && y >= stops[i + 1].at) i += 1;
      const from = stops[i].at;
      const gap = stops[i + 1].at - from;
      const hold = Math.min(gap * HOLD_SHARE, vh * HOLD_SCREENS);
      const t = clamp((y - from - hold) / Math.max(gap - 2 * hold, 1));
      return { i, p: smoother(t), t };
    };

    // Style writes, skipped when the value has not changed (a resting
    // flask's liquid and lean, say), so they do not mark anything to redraw.
    const written = new WeakMap();
    const write = (el, property, value) => {
      let values = written.get(el);
      if (!values) written.set(el, (values = new Map()));
      if (values.get(property) === value) return;
      values.set(property, value);
      el.style.setProperty(property, value);
    };

    // The glassware in hand. Only what is being shown is displayed (and
    // animates); a change turns the old one out and the new one in.
    let current = null;
    const turnTo = (kind) => {
      const previous = current;
      current = kind;
      vessels.forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
      vessels.forEach((el, name) => write(el, "display", name === kind || name === previous ? "block" : "none"));
      if (!previous) return;
      const old = vessels.get(previous);
      old.animate(TURN_OUT, { duration: TURN_OUT_MS, easing: "cubic-bezier(0.5, 0, 1, 0.5)", fill: "forwards" })
        .finished.then(() => {
          if (current !== previous) write(old, "display", "none");
        })
        .catch(() => {});
      vessels.get(kind).animate(TURN_IN, { delay: TURN_OUT_MS, duration: TURN_IN_MS, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "backwards" });
      burst.animate(BURST, { delay: TURN_OUT_MS - 40, duration: 520, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "backwards" });
    };

    const setHere = (stop) => {
      if ((stop?.el ?? null) === (here?.el ?? null)) return;
      here?.el.removeAttribute("data-flask-here");
      stop?.el.setAttribute("data-flask-here", "");
      here = stop;
    };

    const update = (now) => {
      frame = 0;
      if (!travelling) return;
      if (stale) measure();
      if (stops.length < 2) return;

      const y = window.scrollY;
      const { i, p, t } = locate(y);
      const from = stops[i];
      const to = stops[i + 1];
      const x = lerp(from.x, to.x, p);
      const top = lerp(from.y, to.y, p);
      const width = lerp(from.w, to.w, p);
      const lift = Math.sin(Math.PI * p);

      // The lean follows the sideways speed through a spring, and the liquid
      // follows the lean through a looser one, so it lags and sloshes.
      const dt = lastTime ? clamp(now - lastTime, 1, 64) : 16;
      lastTime = now;
      const vx = lastX === null ? 0 : (x - lastX) / dt;
      lastX = x;
      speed = lerp(speed, vx, Math.min(1, dt / SPEED_MS));
      const target = clamp(speed * LEAN_PER_SPEED, -LEAN_MAX, LEAN_MAX);
      for (let left = dt; left > 0; left -= STEP_MS) {
        const step = Math.min(STEP_MS, left);
        spring(lean, target, LEAN, step);
        spring(slosh, -lean.x, SLOSH, step);
      }

      write(traveller, "transform", `translate3d(${x.toFixed(2)}px, ${(top - y).toFixed(2)}px, 0) scale(${(width / base).toFixed(4)})`);
      write(tilt, "transform", `rotate(${lean.x.toFixed(2)}deg) scale(${(1 + 0.07 * lift).toFixed(4)})`);
      write(traveller, "--flask-fill", lerp(from.fill, to.fill, p).toFixed(3));
      write(traveller, "--flask-slosh", `${clamp(slosh.x, -SLOSH_MAX, SLOSH_MAX).toFixed(1)}deg`);
      write(flight, "opacity", (lift * 0.9).toFixed(3));
      write(flight, "transform", `translateY(${(lift * 18).toFixed(1)}px) scale(${(1 - lift * 0.3).toFixed(3)})`);

      // Half-way, this spot's glassware turns into the next one's (back
      // again if the page goes back up). Drawn flat, a squeeze rather than a
      // 3D turn: Chrome stops clipping the liquid under one.
      const kind = t < SWAP_AT ? from.kind : to.kind;
      if (kind !== current) {
        if (current === null) {
          current = kind;
          vessels.forEach((el, name) => write(el, "display", name === kind ? "block" : "none"));
        } else {
          turnTo(kind);
        }
      }

      setHere(p === 0 ? from : p === 1 ? to : null);
      const moving = p > 0 && p < 1;
      if (moving !== busy) {
        busy = moving;
        traveller.toggleAttribute("data-busy", busy);
      }

      // Keep drawing until the springs have settled, then stop.
      const settling =
        Math.abs(speed) > 0.001 ||
        Math.abs(lean.v) > 0.0004 ||
        Math.abs(lean.x - target) > 0.04 ||
        Math.abs(slosh.v) > 0.0004 ||
        Math.abs(slosh.x + lean.x) > 0.04;
      if (settling) request();
      else lastTime = 0;
    };

    function request() {
      if (!frame && !disposed) frame = window.requestAnimationFrame(update);
    }

    const start = () => {
      travelling = true;
      root.dataset.flaskJourney = "travel";
      stale = true;
      lastX = null;
      request();
    };

    const stop = () => {
      travelling = false;
      delete root.dataset.flaskJourney;
      setHere(null);
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    // Travel when the screen and settings allow, never under the opening
    // animation (the hero's flask waits for it to end).
    const decide = () => {
      if (introPlaying()) {
        root.dataset.flaskWait = "";
        return;
      }
      delete root.dataset.flaskWait;
      if (canTravel()) {
        if (!travelling) start();
      } else if (travelling) {
        stop();
      }
    };

    const playEntrance = () => {
      drop.animate(DROP, { delay: 300, duration: 1150, fill: "backwards" });
      traveller.animate([{ offset: 0, "--flask-fill": 0 }], { delay: 1050, duration: 1300, easing: EASE_OUT, fill: "backwards" });
    };

    // When the opening animation ends: drop into the hero (if the page is
    // still at the top), or let the hero's own flask replay its drop.
    const watcher = new MutationObserver(() => {
      const waited = "flaskWait" in root.dataset;
      decide();
      if (waited && !introPlaying() && travelling && window.scrollY < vh * 0.5) playEntrance();
    });
    watcher.observe(body, { attributeFilter: ["data-lab-intro"], attributes: true });

    // The hero's flask falls in by itself (CSS) as the page opens; the
    // traveller takes over once it has landed, or at the first scroll (or at
    // once, if the page opened further down).
    let hurry = null;
    const begin = () => {
      const running = introPlaying() || !canTravel()
        ? []
        : (document.querySelector("[data-flask-enter]")?.getAnimations?.() ?? []).filter((a) => a.playState !== "finished");
      if (running.length && window.scrollY > vh * 0.5) running.forEach((animation) => animation.finish());
      if (!running.length || window.scrollY > vh * 0.5) {
        decide();
        return;
      }
      hurry = () => running.forEach((animation) => animation.finish());
      window.addEventListener("scroll", hurry, { once: true, passive: true });
      Promise.all(running.map((animation) => animation.finished.catch(() => {}))).then(() => {
        window.removeEventListener("scroll", hurry);
        hurry = null;
        if (!disposed) decide();
      });
    };
    begin();

    // Images, fonts and the strip at the top settling change the page's
    // height: measure again then, right after the browser's own layout.
    const resized = new ResizeObserver(() => {
      if (!travelling) return;
      measure();
      request();
    });
    resized.observe(body);
    const remeasure = () => {
      stale = true;
      request();
    };
    const modeChange = () => {
      stale = true;
      decide();
    };
    document.fonts?.ready.then(() => !disposed && remeasure());
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    wide.addEventListener("change", modeChange);
    still.addEventListener("change", modeChange);

    return () => {
      disposed = true;
      stop();
      delete root.dataset.flaskWait;
      watcher.disconnect();
      resized.disconnect();
      if (hurry) window.removeEventListener("scroll", hurry);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      wide.removeEventListener("change", modeChange);
      still.removeEventListener("change", modeChange);
      [drop, traveller, burst, ...vessels.values()].forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.traveller} ref={travellerRef}>
      <span className={styles.flight} ref={flightRef} />
      <span className={styles.burst} ref={burstRef} />
      <span className={styles.tilt} ref={tiltRef}>
        <span className={styles.drop} ref={dropRef}>
          {Object.keys(VESSELS).map((kind) => (
            <span className={styles.vessel} data-vessel={kind} key={kind}>
              <JourneyFlask kind={kind} uid={`flask-traveller-${kind}`} />
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}
