"use client";

import { useEffect, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import styles from "./DnaScrollProgress.module.css";

/**
 * Back-to-top button whose page progress is a DNA double helix on a dark
 * capsule. Each row is a base pair: two nucleotides orbiting the helix axis,
 * joined by a bond, with front nucleotides larger and brighter than those
 * behind. Successive rows are a tenth of a turn apart, so together they twist
 * like a real helix.
 * - The helix starts white and turns red from the bottom as the page is read.
 * - It turns slowly all the time, and faster while the page is scrolling.
 * - Complete (100%): all red, with a soft red glow.
 */

const ROWS = 12;
// One full turn every ten base pairs, as in B-DNA. Delays are negative, so
// every row starts already part way through its turn.
const TURN_ROWS = 10;
// A–T and G–C pairs in a mixed order, bottom row first.
const PAIRS = ["at", "gc", "gc", "at", "gc", "at", "at", "gc", "at", "gc", "gc", "at"];
// While scrolling the helix turns this many times faster than at rest.
const SCROLL_SPEED = 2.5;

export default function DnaScrollProgress({ percent, onClick, spinning = false }) {
  const complete = percent >= 100;
  const readRows = Math.floor((percent / 100) * ROWS + 0.0001);
  const helixRef = useRef(null);

  // Speed changes go through the running animations' playback rate, which
  // carries on from where each nucleotide is; changing the CSS duration
  // instead would make the whole helix jump.
  useEffect(() => {
    const helix = helixRef.current;
    if (!helix?.getAnimations) return;
    for (const animation of helix.getAnimations({ subtree: true })) {
      animation.updatePlaybackRate(spinning ? SCROLL_SPEED : 1);
    }
  }, [spinning]);

  return (
    <button
      aria-label={`Back to top, page ${percent}% read`}
      className={`group relative inline-flex h-[112px] w-12 flex-col items-center justify-between rounded-full border bg-ink py-2.5 shadow-lg shadow-zinc-900/30 transition ${
        complete ? "border-red/70" : "border-white/10"
      }`}
      onClick={onClick}
      type="button"
    >
      <FiArrowUp aria-hidden="true" className="text-sm text-white/75 transition group-hover:-translate-y-0.5 group-hover:text-white" />

      <span aria-hidden="true" className={styles.helix} data-complete={complete || undefined} ref={helixRef}>
        {PAIRS.map((pair, row) => {
          const delay = `calc(var(--dna-turn) * ${-row / TURN_ROWS})`;
          const read = row < readRows;
          return (
            <span className={styles.row} data-pair={pair} data-read={read || undefined} key={row} style={{ bottom: `${2 + row * 5.6}px` }}>
              <span className={styles.bond} style={{ animationDelay: delay }} />
              <span className={`${styles.base} ${styles.strandA}`} style={{ animationDelay: delay }} />
              {/* The partner sits half a turn round the axis. */}
              <span
                className={`${styles.base} ${styles.strandB}`}
                style={{ animationDelay: `calc(${delay} - var(--dna-turn) / 2)` }}
              />
            </span>
          );
        })}
      </span>
    </button>
  );
}
