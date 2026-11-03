import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Planetary (slurry) mixer: the cup of materials is loaded, it revolves and
// spins to mix them, the slurry turns smooth and even, and it is poured off
// into a jar.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The mixer body, feet and its chamber window. */}
      <g data-part="frame">
        <rect height="106" rx="8" width="140" x="40" y="90" />
        <path d="M54 196v5M166 196v5" />
        <circle cx="110" cy="130" r="30" />
      </g>

      {/* The cup of materials, circling in the chamber. */}
      <g className={styles.orbit}>
        <g {...part('load')}>
          <g className={styles.lower} style={{ '--lower': '-12px' }}>
            <path d="M96 116h28v26a4 4 0 0 1-4 4h-20a4 4 0 0 1-4-4z" />
            <path d="M102 124h0M110 122h0M118 126h0" strokeWidth="3" />
          </g>
        </g>
        {/* The slurry turned smooth (its own part, so it moves with the cup). */}
        <g {...part('homogenise')}>
          <path className={styles.liquid} d="M97 132h26v10a4 4 0 0 1-4 4h-18a4 4 0 0 1-4-4z" />
          <path className={styles.flow} d="M100 138q10-5 20 0" />
        </g>
      </g>

      {/* The revolution round the chamber. */}
      <g {...part('mix')}>
        <circle className={styles.turn} cx="110" cy="130" r="24" />
      </g>

      {/* The slurry poured off into the jar. */}
      <g {...part('discharge')}>
        <path d="M190 120h22l-4 18h-14z" />
        <circle className={styles.drop} cx="208" cy="142" r="1.6" style={{ '--fall': '24px' }} />
        <path d="M196 196v-26a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v26z" />
        <path className={styles.liquid} d="M196 182h28v14h-28z" />
      </g>
    </>
  );
}

const slurryMixer = {
  Drawing,
  // "Discharge" is checked before "load" ("charge").
  parts: [
    { part: 'discharge', test: /discharg|unload|pour/ },
    { part: 'load', test: /load|charge|add/ },
    { part: 'homogenise', test: /homogen|disper|degas/ },
    { part: 'mix', test: /mix|blend/ },
  ],
  tags: {
    load: { at: [110, 78], align: 'center' },
    mix: { at: [110, 210], align: 'center' },
    homogenise: { at: [58, 72], align: 'center' },
    discharge: { at: [210, 104], align: 'center' },
  },
};

export default slurryMixer;
