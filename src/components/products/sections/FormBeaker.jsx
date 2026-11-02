'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './FormBeaker.module.css';

/**
 * Turns the box around a form into a glass beaker seen slightly from above:
 * an oval mouth, an oval base, % graduations on the right wall and liquid that
 * rises behind the fields, one step per correctly filled field. The liquid's
 * top is a lit oval surface that sloshes when the level changes; each newly
 * completed field drops a bead of liquid from that field into the beaker,
 * which ripples the surface. A bold reading rides the surface. `state`:
 * - 'idle'     — follows `filled` / `total`;
 * - 'sending'  — the liquid comes to the boil while the request is on its way;
 * - 'draining' — after a successful send it drains to 0%, the reading counting down;
 * - 'sent'     — empty.
 * `drop`: { id, fieldId, level } — a new id drops a bead from the element with
 * that id, landing on the surface at `level` (0–1).
 * The liquid and marks are decorative (aria-hidden); the form states the same
 * progress in text.
 */

// 100% fills the box to 90% of its height, leaving a little glass above.
const BRIM = 90;
// Graduations every 5%, longer every 10%, labelled every 25%.
const TICKS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);
// A completed field's bead takes this long to fall; the liquid waits for it
// (the 400 ms delays in FormBeaker.module.css) and then rises.
const BEAD_MS = 420;
// How long the reading follows the liquid after a change (its CSS transitions
// run 400 + 900 ms when filling and 1300 ms when draining).
const FOLLOW_MS = 1400;
const DRAIN_FOLLOW_MS = 1450;

const BUBBLES = [
  { left: '8%', size: 7, delay: '0s', duration: '4.2s' },
  { left: '21%', size: 5, delay: '1.8s', duration: '3.6s' },
  { left: '37%', size: 8, delay: '0.9s', duration: '4.8s' },
  { left: '52%', size: 5, delay: '2.6s', duration: '3.9s' },
  { left: '66%', size: 7, delay: '0.4s', duration: '4.4s' },
  { left: '79%', size: 6, delay: '1.4s', duration: '3.4s' },
];

/**
 * The % reading, taken from the liquid's actual height every frame while it
 * moves, so the number and the liquid always agree. Kept between the old and
 * new values, so the slosh overshoot never shows as 66% on the way to 64%.
 */
function useLiquidReading(target, duration, glassRef, liquidRef) {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const from = shown.current;
    if (from === target) return undefined;
    const low = Math.min(from, target);
    const high = Math.max(from, target);
    let frame;
    const start = performance.now();
    const step = (now) => {
      const glass = glassRef.current?.clientHeight;
      const liquid = liquidRef.current?.offsetHeight ?? 0;
      const done = now - start >= duration || !glass;
      const measured = done ? target : (liquid / glass) * (100 * 100) / BRIM;
      const next = Math.min(Math.max(measured, low), high);
      shown.current = next;
      setValue(next);
      if (!done) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, glassRef, liquidRef]);

  return Math.round(value);
}

/**
 * Drops a bead from the completed field onto the liquid's surface, then sends
 * a ripple across it. Drawn straight into two empty layers (no React state),
 * and skipped for visitors who prefer reduced motion. A field already under
 * the surface just ripples it.
 */
function useFieldDrops(drop, glassRef, beadLayerRef, rippleLayerRef) {
  useEffect(() => {
    if (!drop?.id) return undefined;
    const glass = glassRef.current;
    const beads = beadLayerRef.current;
    const field = drop.fieldId ? document.getElementById(drop.fieldId) : null;
    if (!glass || !beads || !field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const box = glass.getBoundingClientRect();
    const from = field.getBoundingClientRect();
    const x = from.left + from.width / 2 - box.left;
    const surfaceY = glass.clientHeight * (1 - (drop.level * BRIM) / 100);
    const startY = from.bottom - box.top;
    const fall = surfaceY - startY;

    const ripple = () => {
      const ripples = rippleLayerRef.current;
      if (!ripples) return;
      const ring = document.createElement('span');
      ring.className = styles.ripple;
      ring.style.left = `${x}px`;
      ripples.appendChild(ring);
      ring.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.12)', opacity: 0.95 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
        ],
        { duration: 1000, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
      ).onfinish = () => ring.remove();
    };

    if (fall < 16) {
      ripple();
      return undefined;
    }

    const bead = document.createElement('span');
    bead.className = styles.bead;
    bead.style.left = `${x}px`;
    bead.style.top = `${startY}px`;
    beads.appendChild(bead);
    // Falls under gravity: slow off the field, quick at the surface, and
    // stretches a little as it speeds up.
    const falling = bead.animate(
      [
        { transform: 'translate(-50%, -6px) scale(0.3)', opacity: 0 },
        { transform: 'translate(-50%, 0) scale(1)', opacity: 1, offset: 0.2 },
        { transform: `translate(-50%, ${fall}px) scale(0.8, 1.3)`, opacity: 1 },
      ],
      { duration: BEAD_MS, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' },
    );
    falling.onfinish = () => {
      bead.remove();
      ripple();
    };
    return () => {
      falling.cancel();
      bead.remove();
    };
  }, [drop, glassRef, beadLayerRef, rippleLayerRef]);
}

export default function FormBeaker({ filled = 0, total = 1, state = 'idle', drop, children }) {
  const empty = state === 'draining' || state === 'sent';
  const level = empty ? 0 : Math.min(Math.max(filled / total, 0), 1);
  const glassRef = useRef(null);
  const liquidRef = useRef(null);
  const beadLayerRef = useRef(null);
  const rippleLayerRef = useRef(null);
  const percent = useLiquidReading(Math.round(level * 100), state === 'draining' ? DRAIN_FOLLOW_MS : FOLLOW_MS, glassRef, liquidRef);
  useFieldDrops(drop, glassRef, beadLayerRef, rippleLayerRef);
  const height = level * BRIM;

  return (
    <div className="relative min-w-0">
      {/* Soft shadow on the bench under the beaker. */}
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 left-[6%] right-[6%] h-8 rounded-[50%] bg-ink/20 blur-md" />

      {/* The mouth, seen from slightly above: an oval rim whose far edge is
          fainter, then the pouring spout (left) and rolled lip (right). */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[9px] z-20 h-[18px] w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 18"
      >
        <ellipse className={styles.mouth} cx="50" cy="9" rx="50" ry="8" />
        <path className={styles.rimBack} d="M0 9A50 8 0 0 1 100 9" />
        <path className={styles.rimInner} d="M1.2 9A48.8 6 0 0 0 98.8 9" />
        <path className={styles.rimFront} d="M0 9A50 8 0 0 0 100 9" />
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute -left-[17px] -top-[3px] z-20 h-7 w-5" fill="none" viewBox="0 0 20 28">
        <path className={styles.edge} d="M18.5 28V15C18.5 8 13 3.5 3 3" />
        <path className={styles.edgeLine} d="M15.5 28V15.5C15.5 10.5 12 7 5 6.4" />
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute -right-[9px] -top-[3px] z-20 h-7 w-3" fill="none" viewBox="0 0 12 28">
        <path className={styles.edge} d="M1.5 28V12C1.5 6.5 4 3.5 9.5 3" />
        <path className={styles.edgeLine} d="M4.5 28V12.5C4.5 9 6 7 9 6.5" />
      </svg>

      {/* overflow-clip (not hidden) keeps sticky children working inside. The
          oval bottom corners are the front of the beaker's round base. */}
      <div
        className={`${styles.glass} relative overflow-clip rounded-b-[50%_30px] border-x-[3px] border-b-[3px] border-[#2d3742] bg-white`}
        data-state={state}
        ref={glassRef}
      >
        <div
          aria-hidden="true"
          className={styles.liquid}
          ref={liquidRef}
          // Empty sinks below the bottom so the surface oval doesn't show.
          style={{ height: `${height}%`, bottom: level > 0 ? 0 : -24 }}
        >
          {/* The top of the liquid: remounted on every new level, which replays the slosh. */}
          <span className={styles.surface} key={filled}>
            <span className={styles.glint} />
            <span className={styles.ripples} ref={rippleLayerRef} />
          </span>
          {BUBBLES.map((bubble) => (
            <span
              className={styles.bubble}
              key={bubble.left}
              style={{ left: bubble.left, width: bubble.size, height: bubble.size, animationDelay: bubble.delay, animationDuration: bubble.duration }}
            />
          ))}
        </div>

        {/* The glass itself, over the liquid and under the fields: curved-wall
            shading, the inner edge of the wall's thickness, and reflections. */}
        <span aria-hidden="true" className={styles.tint} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[4px] bottom-[4px] top-0 z-[1] rounded-b-[50%_26px] border-x border-b border-[#c3cdd7]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-16 left-3 top-10 z-[1] w-2.5 rounded-full bg-white/60 blur-[1px]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-24 left-[22px] top-20 z-[1] w-[2px] rounded-full bg-white/90" />

        {/* Graduations on the right wall, and the reading that rides the surface. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[88px] sm:block">
          {TICKS.map((tick) => {
            const major = tick % 25 === 0;
            return (
              <div className="absolute right-[5px] flex translate-y-1/2 items-center gap-1.5" key={tick} style={{ bottom: `${tick * BRIM / 100}%` }}>
                {major ? <span className="text-[10px] font-semibold text-[#2d3742]/80 tabular-nums">{tick}%</span> : null}
                <span
                  className={major ? 'h-[2px] w-4 bg-[#2d3742]/80' : tick % 10 === 0 ? 'h-px w-3 bg-[#2d3742]/55' : 'h-px w-2 bg-[#2d3742]/40'}
                />
              </div>
            );
          })}
          {state === 'sent' ? null : (
            <span
              className={`${styles.reading} absolute right-[58px] text-xl font-bold text-red tabular-nums`}
              // Above the surface, until near the top it would meet the form's
              // first line; from there it rides just under the surface.
              style={{ bottom: height > 80 ? `calc(${height}% - 30px)` : `calc(${height}% + 12px)` }}
            >
              {percent}%
            </span>
          )}
        </div>

        {/* Extra room at the bottom keeps the last row clear of the curved base. */}
        <div className="relative z-10 p-4 pb-9 sm:py-6 sm:pb-10 sm:pl-6 sm:pr-[104px]">{children}</div>

        {/* Falling beads, above the fields so they can be seen dropping. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" ref={beadLayerRef} />
      </div>
    </div>
  );
}

/** The fill as a whole percentage, for progress shown elsewhere in the form. */
export function fillPercent(filled, total) {
  return Math.round(Math.min(Math.max(filled / total, 0), 1) * 100);
}
