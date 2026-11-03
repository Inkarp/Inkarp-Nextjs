import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// The shared shaker drawing (orbitalShaker, rockingShaker, waveShaker and
// plateShaker set the motion and what sits on the platform): samples go on
// the platform, the speed is set, the platform moves, the display is watched,
// and a sample comes off onto the bench.
const MOTION = { orbit: styles.orbit, tilt: styles.tilt, wave: styles.wave, vibrate: styles.vibrate };

// Erlenmeyer flask standing on the platform at x = cx.
function Flask({ cx }) {
  return (
    <>
      <path d={`M${cx - 6} 112h12M${cx - 4} 112v12l-12 20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2l-12-20v-12`} />
      <path className={styles.liquid} d={`M${cx - 11} 136h22l5 8a2 2 0 0 1-2 2h-28a2 2 0 0 1-2-2z`} />
    </>
  );
}

// Flat tray (gel box, staining dish) on the platform from x.
function Tray({ x }) {
  return (
    <>
      <rect height="14" rx="2" width="64" x={x} y="132" />
      <path className={styles.liquid} d={`M${x + 3} 138h58v6h-58z`} />
    </>
  );
}

// Microplate on the platform from x.
function Plate({ x }) {
  return (
    <>
      <rect height="10" rx="1.5" width="64" x={x} y="136" />
      <path d={`M${x + 6} 141h0M${x + 16} 141h0M${x + 26} 141h0M${x + 36} 141h0M${x + 46} 141h0M${x + 56} 141h0`} strokeWidth="3" />
    </>
  );
}

const LOADS = {
  flasks: [<Flask cx={70} key="a" />, <Flask cx={120} key="b" />, <Flask cx={170} key="c" />],
  trays: [<Tray key="a" x={48} />, <Tray key="b" x={128} />],
  plates: [<Plate key="a" x={48} />, <Plate key="b" x={128} />],
};

export function ShakerDrawing({ on, motion, load }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet and display window. */}
      <g data-part="frame">
        <rect height="36" rx="8" width="160" x="40" y="160" />
        <path d="M54 196v5M186 196v5" />
        <rect height="14" rx="2" width="48" x="56" y="172" />
      </g>

      {/* The platform and its samples, moving together. */}
      <g className={MOTION[motion]}>
        <g {...part('shake')}>
          <rect height="6" rx="2" width="180" x="30" y="146" />
          <path d="M120 152v8" />
        </g>
        <g {...part('load')}>
          <g className={styles.lower} style={{ '--lower': '-14px' }}>{LOADS[load]}</g>
        </g>
      </g>

      {/* The speed knob. */}
      <g {...part('set')}>
        <circle cx="176" cy="179" r="7" />
        <path className={styles.whirl} d="M176 173v12M170 179h12" />
      </g>

      {/* Speed and time on the display. */}
      <g {...part('monitor')}>
        <path className={styles.blink} d="M62 179h10M76 179h10M90 179h8" />
      </g>

      {/* A sample taken off, set down on the bench. */}
      <g {...part('unload')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M14 178h8M16 178v6l-8 10a1.5 1.5 0 0 0 1 2h18a1.5 1.5 0 0 0 1-2l-8-10v-6" />
          <path className={styles.liquid} d="M11 190h16l2.5 3.5a1.5 1.5 0 0 1-1 2.5h-19a1.5 1.5 0 0 1-1-2.5z" />
        </g>
      </g>
    </>
  );
}
