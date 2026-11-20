"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { sectionProgress, useReducedMotion } from "./magazineMotion";
import styles from "./MagazineCueDial.module.css";

// The ring is the "C" of the CATALYSTCue logo: a circle with an opening on the
// right. A volume runs to six issues, so each dial has six places, 60° apart;
// scrolling turns the issues so each one in turn comes out through the opening.
const SLOTS = 6;
const STEP = 360 / SLOTS;
const GAP_DEGREES = 64;
// Scroll length per issue, in screen heights × 100.
const STEP_VH = 50;
const pad = (value) => String(value).padStart(2, "0");
// Server and browser can differ in the last digits of sin/cos; rounding keeps
// the drawn ring identical in both (no hydration mismatch).
const round = (value) => Math.round(value * 1000) / 1000;

/**
 * CATALYSTCue "cue dial", one dial per volume (newest volume first), on
 * /magazine after the archive shelf. Each volume's issues ride round the logo's
 * red C in issue order; scrolling turns the dial, the issue at the opening
 * grows out of it, the centre shows the volume number and that issue's month,
 * and the panel beside it shows the issue. Places not yet filled (issues still
 * to come) show as dashed outlines on the ring. Left out with reduced motion:
 * the archive above already lists every issue.
 */
export default function MagazineCueDial({ issues }) {
  const reduced = useReducedMotion();
  const volumes = useMemo(() => {
    const numbers = [...new Set(issues.map((issue) => issue.volume))].sort((a, b) => b - a);
    return numbers.map((number) => ({
      number,
      issues: issues.filter((issue) => issue.volume === number).sort((a, b) => a.issue - b.issue),
    }));
  }, [issues]);

  if (reduced) return null;

  return volumes.map((volume) => <VolumeDial issues={volume.issues} key={volume.number} number={volume.number} />);
}

function VolumeDial({ number, issues }) {
  const count = issues.length;
  const sectionRef = useRef(null);
  const coverRefs = useRef([]);
  const ghostRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const place = (node, index, turn, isCover) => {
      // Angle 0 is the opening, on the right.
      const angle = (index - turn) * STEP;
      const distance = Math.min(1, Math.abs(angle) / STEP);
      const scale = isCover ? 1 + 0.5 * (1 - distance) : 1;
      node.style.transform = `rotate(${angle}deg) translateX(var(--r)) rotate(${-angle}deg) scale(${scale})`;
      if (!isCover) return;
      node.style.zIndex = String(Math.round(100 - distance * 50));
      // Covers away from the opening fade towards the white page. They stay
      // solid (no opacity), so the red ring behind can't tint them.
      const far = Math.min(1, Math.abs(angle) / (STEP * 2.5));
      node.style.filter = `saturate(${(1 - 0.65 * far).toFixed(3)}) contrast(${(1 - 0.45 * far).toFixed(3)}) brightness(${(1 + 0.3 * far).toFixed(3)})`;
    };

    let frame = 0;
    let shown = -1;
    const update = () => {
      frame = 0;
      // 0 → count-1: which issue sits at the opening (fractions between).
      const turn = count > 1 ? sectionProgress(section) * (count - 1) : 0;
      coverRefs.current.forEach((node, index) => node && place(node, index, turn, true));
      ghostRefs.current.forEach((node, index) => node && place(node, count + index, turn, false));
      const index = Math.min(count - 1, Math.max(0, Math.round(turn)));
      if (index !== shown) {
        shown = index;
        setActive(index);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  const issue = issues[active];
  const first = issues[0];
  const last = issues[count - 1];
  // The red C: an arc of (360 - gap) degrees, its opening centred on the right.
  const radius = 46;
  const circumference = round(2 * Math.PI * radius);
  const arc = round((circumference * (360 - GAP_DEGREES)) / 360);
  const ghosts = Math.max(0, SLOTS - count);

  return (
    <section
      aria-label={`Volume ${pad(number)}, around the cue dial`}
      className={`${styles.page} ${styles.section}`}
      data-scroll-skip
      ref={sectionRef}
      style={{ height: `${(count - 1) * STEP_VH + 100}vh` }}
    >
      <div className={styles.sticky}>
        <p className={styles.label}>
          Volume {pad(number)} · {first.monthShort} {first.year}
          {count > 1 ? ` – ${last.monthShort} ${last.year}` : ""} · {count} of {SLOTS} issues
        </p>
        <div className={styles.dial}>
          <svg aria-hidden="true" className={styles.ring} viewBox="0 0 100 100">
            <circle className={styles.track} cx="50" cy="50" r={radius} />
            <circle
              className={styles.c}
              cx="50"
              cy="50"
              r={radius}
              strokeDasharray={`${arc} ${circumference}`}
              transform={`rotate(${GAP_DEGREES / 2} 50 50)`}
            />
            {Array.from({ length: SLOTS }, (_, index) => {
              const a = (index * STEP * Math.PI) / 180;
              return (
                <line
                  className={styles.tick}
                  key={index}
                  x1={round(50 + Math.cos(a) * 40)}
                  x2={round(50 + Math.cos(a) * 42.5)}
                  y1={round(50 + Math.sin(a) * 40)}
                  y2={round(50 + Math.sin(a) * 42.5)}
                />
              );
            })}
          </svg>

          <div className={styles.readout}>
            <span className={styles.readWord}>Volume</span>
            <span className={styles.readVol}>{pad(number)}</span>
            <span className={styles.readMonth} key={`m-${issue.id}`}>
              Issue {pad(issue.issue)} · {issue.monthShort} {issue.year}
            </span>
          </div>

          {Array.from({ length: ghosts }, (_, index) => (
            <span
              aria-hidden="true"
              className={styles.ghost}
              key={`ghost-${index}`}
              ref={(node) => {
                ghostRefs.current[index] = node;
              }}
              style={{ transform: `rotate(${(count + index) * STEP}deg) translateX(var(--r)) rotate(${-(count + index) * STEP}deg)` }}
            />
          ))}

          {issues.map((item, index) => (
            <Link
              aria-hidden={index !== active ? "true" : undefined}
              className={styles.cover}
              href={item.href}
              key={item.id}
              ref={(node) => {
                coverRefs.current[index] = node;
              }}
              style={{ transform: `rotate(${index * STEP}deg) translateX(var(--r)) rotate(${-index * STEP}deg)` }}
              tabIndex={index === active ? 0 : -1}
            >
              <Image alt={item.coverAlt} className="object-cover" fill sizes="170px" src={item.cover} />
            </Link>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.info} key={issue.id}>
            <Link aria-label={`Read ${issue.label}`} className={styles.big} href={issue.href}>
              <Image alt={issue.coverAlt} className="object-cover" fill sizes="(min-width: 768px) 240px, 34vw" src={issue.cover} />
            </Link>
            <div className={styles.text}>
              <p className={styles.meta}>{issue.label} · {issue.date}</p>
              <h3 className={styles.theme}>{issue.theme}</h3>
              <p className={styles.notes}>
                {issue.notes.length ? `${issue.notes.length} application notes and articles` : "Read the full issue online"}
              </p>
              <Link className={styles.read} href={issue.href}>
                Read this issue <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
