import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Centrifugal / benchtop evaporator: the sample tubes go into the rotor, the
// rotor spins, the lamp heats them under vacuum, the solvent evaporates off
// to the condenser, condenses into the flask, and the dried samples are
// collected.
const TUBES = [70, 85, 100];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Cabinet, feet, the chamber window, the condenser's column and the
          solvent flask's stand. */}
      <g data-part="frame">
        <rect height="126" rx="6" width="120" x="20" y="70" />
        <path d="M34 196v5M126 196v5" />
        <circle cx="85" cy="128" r="44" />
      </g>

      {/* Sample tubes set into the rotor. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          {TUBES.map((x) => (
            <g key={x}>
              <path d={`M${x - 4} 124v18a4 4 0 0 0 8 0v-18`} />
              <path className={styles.liquid} d={`M${x - 4} 134h8v8a4 4 0 0 1-8 0z`} />
            </g>
          ))}
        </g>
      </g>

      {/* The rotor spinning. */}
      <g {...part('spin')}>
        <ellipse className={styles.turn} cx="85" cy="146" rx="34" ry="6" />
        <circle cx="85" cy="146" r="3" />
      </g>

      {/* The lamp heating, the vacuum gauge. */}
      <g {...part('heat')}>
        <path d="M66 94h38" />
        <path className={styles.glow} d="M70 100v8M85 100v8M100 100v8" />
        <circle cx="122" cy="182" r="8" />
        <path className={styles.tilt} d="M122 182l4-5" style={{ transformBox: 'view-box', transformOrigin: '122px 182px' }} />
      </g>

      {/* Solvent evaporating off, drawn across to the condenser. */}
      <g {...part('evaporate')}>
        <path className={styles.heat} d="M70 120q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M85 120q-2-3 0-6t0-6" />
        <path className={styles.heat} d="M100 120q-2-3 0-6t0-6" />
        <path className={styles.vapour} d="M140 100H190V72" />
      </g>

      {/* The condenser coil and the solvent dripping into the flask. */}
      <g {...part('condense')}>
        <rect height="80" rx="4" width="20" x="180" y="64" />
        <path className={styles.coil} d="M184 72l12 8-12 8 12 8-12 8 12 8-12 8 12 8" />
        <circle className={styles.drop} cx="190" cy="150" r="1.6" style={{ '--fall': '22px' }} />
        <path d="M184 160h12M186 160v8l-12 22a2 2 0 0 0 2 3h28a2 2 0 0 0 2-3l-12-22v-8" />
        <path className={styles.liquid} d="M178 182h24l3 7a2 2 0 0 1-2 3h-26a2 2 0 0 1-2-3z" />
      </g>

      {/* The dried samples collected in a rack on top. */}
      <g {...part('collect')}>
        <path d="M108 70v-6h32v6M112 64v-4M136 64v-4" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M120 64v-18a4 4 0 0 1 8 0v18" />
          <path className={styles.liquid} d="M120 60h8v4h-8z" />
        </g>
      </g>
    </>
  );
}

const centrifugalEvaporator = {
  Drawing,
  // "Heat under Vacuum" is checked before "evaporate".
  parts: [
    { part: 'load', test: /load|place/ },
    { part: 'spin', test: /spin|rotat|centrifug/ },
    { part: 'heat', test: /heat|vacuum/ },
    { part: 'evaporate', test: /evapor|dry/ },
    { part: 'condense', test: /condens/ },
    { part: 'collect', test: /collect|recover|remove/ },
  ],
  tags: {
    load: { at: [70, 58], align: 'center' },
    spin: { at: [50, 208], align: 'center' },
    heat: { at: [112, 208], align: 'center' },
    evaporate: { at: [160, 88], align: 'center' },
    condense: { at: [214, 52], align: 'center' },
    collect: { at: [124, 30], align: 'center' },
  },
};

export default centrifugalEvaporator;
