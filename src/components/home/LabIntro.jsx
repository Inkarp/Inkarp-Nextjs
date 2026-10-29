"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuAtom,
  LuBeaker,
  LuDna,
  LuFlaskRound,
  LuMicroscope,
  LuPipette,
  LuScale,
  LuTestTubes,
} from "react-icons/lu";
import { INKARP_LOGO_PATHS, INKARP_LOGO_VIEWBOX } from "./inkarpLogoPaths";
import { LAB_INTRO_STORAGE_KEY } from "./labIntroSession";
import styles from "./LabIntro.module.css";

// Clockwise from the top of the orbit around the flask.
const ORBIT_ICONS = [LuMicroscope, LuDna, LuBeaker, LuAtom, LuTestTubes, LuScale, LuPipette, LuFlaskRound];
const ORBIT_START_S = 0.5;
const ORBIT_STAGGER_S = 0.08;

// Spokes from the flask out to each orbit badge, in the 400-unit dial.
const SPOKES = ORBIT_ICONS.map((_, index) => {
  const angle = (index * 2 * Math.PI) / ORBIT_ICONS.length;
  const point = (radius) => [200 + radius * Math.sin(angle), 200 - radius * Math.cos(angle)];
  const round = (value) => Math.round(value * 100) / 100;
  const [x1, y1] = point(100).map(round);
  const [x2, y2] = point(124).map(round);
  return { x1, y1, x2, y2, delay: ORBIT_START_S + index * ORBIT_STAGGER_S };
});

// x inside the flask neck (48-72), so bubbles rise out of the top cleanly.
const BUBBLES = [
  { x: 55, r: 2.6, delay: 1.1, duration: 1.7 },
  { x: 63, r: 1.8, delay: 1.35, duration: 1.4 },
  { x: 59, r: 3.2, delay: 1.6, duration: 1.9 },
  { x: 66, r: 2.2, delay: 1.85, duration: 1.5 },
  { x: 53, r: 1.6, delay: 2.0, duration: 1.3 },
  { x: 61, r: 2.4, delay: 2.25, duration: 1.6 },
];

const PARTICLES = [
  { left: "8%", top: "72%", size: 6, delay: 0.2, red: true },
  { left: "17%", top: "34%", size: 4, delay: 0.6 },
  { left: "26%", top: "86%", size: 5, delay: 0.9 },
  { left: "71%", top: "18%", size: 5, delay: 0.4, red: true },
  { left: "83%", top: "44%", size: 4, delay: 0.75 },
  { left: "90%", top: "70%", size: 6, delay: 0.3 },
  { left: "62%", top: "88%", size: 4, delay: 1.1, red: true },
  { left: "38%", top: "12%", size: 4, delay: 1.0 },
];

const FALLBACK_END_MS = 6000;
const FLOATS_HIDDEN_CSS = `body[data-lab-intro="playing"] [data-floating-widget]{visibility:hidden!important}`;

function Molecule({ className }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 100 100">
      <path d="M50 28 69.05 39v22L50 72 30.95 61V39Z" pathLength="1" />
      <circle cx="50" cy="50" pathLength="1" r="12" />
      <path d="M69.05 39 86 29M30.95 61 14 71M50 72v18M50 28V10" pathLength="1" />
      <circle className={styles.atomRed} cx="86" cy="29" r="3.2" />
      <circle cx="14" cy="71" r="3.2" />
      <circle className={styles.atomRed} cx="50" cy="90" r="3.2" />
      <circle cx="50" cy="10" r="3.2" />
    </svg>
  );
}

// Opening animation on the homepage: a flask fills while lab instruments swing
// into orbit around it, the Inkarp logo writes itself in, and an aperture opens
// from the flask onto the page. Once per browser session, only when the visit
// starts on the homepage, never with reduced motion, and skippable at any time.
// Everything is CSS-timed (LabIntro.module.css), so it ends even without JS.
export default function LabIntro() {
  const rootRef = useRef(null);
  const [phase, setPhase] = useState("playing");

  const skip = useCallback(() => {
    setPhase((current) => (current === "playing" ? "skipping" : current));
  }, []);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = Boolean(window.sessionStorage.getItem(LAB_INTRO_STORAGE_KEY));
    } catch {
      seen = false;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const landing = performance.getEntriesByType?.("navigation")?.[0];
    // A client-side navigation back to "/" is not "opening the website".
    const landedOnHome = !landing || new URL(landing.name).pathname === "/";

    if (seen || reducedMotion || !landedOnHome) {
      if (rootRef.current) rootRef.current.style.display = "none";
      return undefined;
    }

    try {
      window.sessionStorage.setItem(LAB_INTRO_STORAGE_KEY, "1");
    } catch {
      // Private mode: the intro simply plays again on the next homepage load.
    }

    // The chat launcher sits at the maximum z-index, above any overlay, so the
    // floating widgets step aside while this plays (FLOATS_HIDDEN_CSS).
    document.body.dataset.labIntro = "playing";
    const onKeyDown = (event) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKeyDown);
    const fallback = window.setTimeout(() => setPhase("done"), FALLBACK_END_MS);
    return () => {
      delete document.body.dataset.labIntro;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(fallback);
    };
  }, [skip]);

  useEffect(() => {
    if (phase === "done") delete document.body.dataset.labIntro;
  }, [phase]);

  const handleAnimationEnd = (event) => {
    if (event.target === event.currentTarget && event.animationName.includes("iris")) {
      setPhase("done");
    }
  };

  // React hoists this into <head> once and keeps it; it only bites while
  // <body> carries the "playing" flag.
  const floatsHidden = (
    <style href="lab-intro-floats" precedence="default">
      {FLOATS_HIDDEN_CSS}
    </style>
  );

  if (phase === "done") return floatsHidden;

  return (
    <>
      {floatsHidden}
      <div
        className={`${styles.root} ${phase === "skipping" ? styles.skipping : ""}`}
        data-lab-intro=""
        onAnimationEnd={handleAnimationEnd}
        onClick={skip}
        onTouchStart={skip}
        onWheel={skip}
        ref={rootRef}
      >
        <div aria-hidden="true" className={styles.grid} />
        <Molecule className={`${styles.molecule} ${styles.moleculeTop}`} />
        <Molecule className={`${styles.molecule} ${styles.moleculeBottom}`} />
        {PARTICLES.map((particle) => (
          <span
            aria-hidden="true"
            className={`${styles.particle} ${particle.red ? styles.particleRed : ""}`}
            key={`${particle.left}-${particle.top}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <div aria-hidden="true" className={styles.content}>
          <div className={styles.stage}>
            <svg className={styles.dial} fill="none" viewBox="0 0 400 400">
              <circle className={styles.ticks} cx="200" cy="200" r="186" />
              <circle className={styles.majorTicks} cx="200" cy="200" r="186" />
              <circle className={styles.ring} cx="200" cy="200" pathLength="1" r="150" />
              <circle className={styles.innerRing} cx="200" cy="200" r="112" />
              {SPOKES.map((spoke) => (
                <g key={`${spoke.x2}-${spoke.y2}`} style={{ "--d": `${spoke.delay}s` }}>
                  <line className={styles.spoke} pathLength="1" x1={spoke.x1} x2={spoke.x2} y1={spoke.y1} y2={spoke.y2} />
                  <circle className={styles.node} cx={spoke.x1} cy={spoke.y1} r="3" />
                </g>
              ))}
            </svg>

            <div className={styles.orbit}>
              {ORBIT_ICONS.map((Icon, index) => (
                <span
                  className={styles.slot}
                  key={index}
                  style={{
                    "--a": `${(index * 360) / ORBIT_ICONS.length}deg`,
                    "--d": `${ORBIT_START_S + index * ORBIT_STAGGER_S}s`,
                  }}
                >
                  <span className={`${styles.badge} ${index % 2 ? "" : styles.badgeAccent}`}>
                    <Icon />
                  </span>
                </span>
              ))}
            </div>

            <svg className={styles.flask} fill="none" viewBox="0 -24 120 164">
              <defs>
                <clipPath id="lab-intro-flask-inside">
                  <path d="M47 12V50L15 110Q10 124 25 126H95Q110 124 105 110L73 50V12Z" />
                </clipPath>
                <linearGradient id="lab-intro-liquid" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#d71920" />
                  <stop offset="1" stopColor="#8f000c" />
                </linearGradient>
              </defs>
              <path className={styles.glass} d="M47 12V50L15 110Q10 124 25 126H95Q110 124 105 110L73 50V12Z" />
              <g clipPath="url(#lab-intro-flask-inside)">
                <g className={styles.liquid}>
                  <rect fill="url(#lab-intro-liquid)" height="60" width="120" x="0" y="84" />
                  <path
                    className={styles.wave}
                    d="M-120 84q7.5-5 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0 15 0V92H-120Z"
                  />
                </g>
              </g>
              {BUBBLES.map((bubble) => (
                <circle
                  className={styles.bubble}
                  cx={bubble.x}
                  cy="118"
                  key={`${bubble.x}-${bubble.delay}`}
                  r={bubble.r}
                  style={{ animationDelay: `${bubble.delay}s`, animationDuration: `${bubble.duration}s` }}
                />
              ))}
              <path className={styles.marks} d="M77 70h5M85 86h6M93 102h6" pathLength="1" />
              <path className={styles.outline} d="M47 12V50L15 110Q10 124 25 126H95Q110 124 105 110L73 50V12" pathLength="1" />
              <path className={styles.outline} d="M41 12H79" pathLength="1" />
              <path className={styles.glint} d="M43 64 26 96" pathLength="1" />
            </svg>
          </div>

          <svg className={styles.logo} viewBox={INKARP_LOGO_VIEWBOX}>
            {INKARP_LOGO_PATHS.map((path, index) => (
              <path
                className={path.accent ? styles.logoAccent : styles.logoInk}
                d={path.d}
                fillRule="evenodd"
                key={path.d.slice(0, 24)}
                pathLength="1"
                style={{ "--d": `${1.25 + index * 0.06}s` }}
              />
            ))}
          </svg>
          <p className={styles.tagline}>Your Knowledge... Our Solution...!</p>
          <span className={styles.progress}>
            <span />
          </span>
        </div>

        <button className={styles.skip} onClick={skip} type="button">
          Skip intro <LuArrowRight aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
