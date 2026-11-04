"use client";

import { FiArrowUp } from "react-icons/fi";
import styles from "./DnaScrollProgress.module.css";

/**
 * Back-to-top button whose page progress is a DNA double helix. Each row is a
 * base pair: two nucleotides orbiting the helix axis, joined by a bond, with
 * front nucleotides larger and brighter than those behind. Successive rows are
 * a tenth of a turn apart, so together they twist like a real helix.
 * - Rows light up from the bottom as the page is read, base pairs in their
 *   own colours (A–T and G–C).
 * - The helix spins while the page is scrolling and rests when it stops.
 * - Complete (100%): it keeps turning slowly and glows.
 */

const ROWS = 12;
// One full turn every ten base pairs, as in B-DNA. Delays are negative, so
// every row starts already part way through its turn.
const TURN_ROWS = 10;
// A–T and G–C pairs in a mixed order, bottom row first.
const PAIRS = ["at", "gc", "gc", "at", "gc", "at", "at", "gc", "at", "gc", "gc", "at"];

export default function DnaScrollProgress({ percent, onClick, spinning = false }) {
  const complete = percent >= 100;
  const litRows = Math.floor((percent / 100) * ROWS + 0.0001);

  return (
    <button
      aria-label={`Back to top, page ${percent}% read`}
      className={`group relative inline-flex h-[112px] w-12 flex-col items-center justify-between rounded-full border bg-parchment py-2.5 shadow-lg shadow-zinc-900/15 transition ${
        complete ? "border-red/40" : "border-line-light"
      }`}
      onClick={onClick}
      type="button"
    >
      <FiArrowUp aria-hidden="true" className="text-sm text-ink-soft transition group-hover:-translate-y-0.5 group-hover:text-red" />

      <span
        aria-hidden="true"
        className={styles.helix}
        data-complete={complete || undefined}
        data-spinning={spinning || complete || undefined}
      >
        {PAIRS.map((pair, row) => {
          const delay = `calc(var(--dna-turn) * ${-row / TURN_ROWS})`;
          const lit = row < litRows;
          return (
            <span className={styles.row} data-lit={lit || undefined} data-pair={pair} key={row} style={{ bottom: `${2 + row * 5.6}px` }}>
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
