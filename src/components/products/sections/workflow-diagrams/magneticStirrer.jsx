import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Magnetic stirrer (and, with `heats`, a hotplate stirrer): the beaker goes on
// the plate, the stir bar drops in, the knobs are set, the bar spins up a
// vortex (with the plate glowing when it heats), and the display (plus the
// temperature probe when it heats) is watched.
export function StirrerDrawing({ on, heats = false }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet, top plate and display window. */}
      <g data-part="frame">
        <rect height="46" rx="8" width="160" x="40" y="150" />
        <path d="M54 196v5M186 196v5" />
        <rect height="8" rx="3" width="148" x="46" y="142" />
        <rect height="20" rx="2" width="54" x="58" y="162" />
      </g>

      {/* The beaker of liquid set down on the plate, with the vortex the
          spinning bar pulls (its own part, so it moves with the beaker). */}
      <g {...part('place')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M84 70h72M88 70v68a4 4 0 0 0 4 4h56a4 4 0 0 0 4-4v-68" />
          <path className={styles.liquid} d="M88 100Q112 100 120 118Q128 100 152 100V138a4 4 0 0 1-4 4H92a4 4 0 0 1-4-4z" />
          <g {...part('stir')}>
            <path d="M88 100Q112 100 120 118Q128 100 152 100" />
            <path className={styles.flow} d="M96 126q24 7 48 0" />
          </g>
        </g>
      </g>

      {/* The stir bar dropped into the beaker. */}
      <g {...part('stirbar')}>
        <g className={styles.lower} style={{ '--lower': '-46px' }}>
          <rect className={styles.spinBar} height="4" rx="2" width="16" x="112" y="134" />
        </g>
      </g>

      {/* Speed knob (and temperature knob). */}
      <g {...part('set')}>
        <circle cx="140" cy="172" r="9" />
        <path className={styles.whirl} d="M140 165v14M133 172h14" />
        {heats ? (
          <>
            <circle cx="172" cy="172" r="9" />
            <path className={styles.whirl} d="M172 165v14M165 172h14" />
          </>
        ) : null}
      </g>

      {/* The plate glowing while it heats. */}
      {heats ? (
        <g {...part('stir')}>
          <path className={styles.glow} d="M58 146h124" />
        </g>
      ) : null}

      {/* The reading on the display (and the probe in the liquid). */}
      <g {...part('monitor')}>
        <path className={styles.blink} d="M66 172h10M80 172h10M94 172h12" />
        {heats ? <path d="M140 34h8v12h-8zM144 46v84" /> : null}
      </g>
    </>
  );
}

function Drawing({ on }) {
  return <StirrerDrawing on={on} />;
}

const magneticStirrer = {
  Drawing,
  // "Add Stir Bar" is checked before "stir".
  parts: [
    { part: 'stirbar', test: /bar/ },
    { part: 'place', test: /place|vessel|beaker|load/ },
    { part: 'set', test: /set|speed|temperat/ },
    { part: 'stir', test: /stir|heat|mix/ },
    { part: 'monitor', test: /monitor|read|record/ },
  ],
  tags: {
    place: { at: [120, 56], align: 'center' },
    stirbar: { at: [80, 128], align: 'end' },
    set: { at: [156, 214], align: 'center' },
    stir: { at: [164, 100], align: 'start' },
    monitor: { at: [85, 214], align: 'center' },
  },
};

export default magneticStirrer;
