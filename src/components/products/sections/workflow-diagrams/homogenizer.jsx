import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Rotor-stator homogenizer on its stand: the generator probe is lowered into
// the sample, the speed is dialled in, the rotor spins and breaks the sample
// up, the probe is cleaned in the wash beaker, and the sample is recovered.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Stand, clamp, the motor unit and the sample beaker of liquid. */}
      <g data-part="frame">
        <rect height="8" rx="3" width="120" x="24" y="196" />
        <path d="M44 196V24M48 52H70" />
        <rect height="8" width="8" x="40" y="48" />
        <rect height="66" rx="8" width="36" x="70" y="24" />
        <path d="M66 140h44M68 140v50a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4v-50" />
        <path className={styles.liquid} d="M68 156h40v34a4 4 0 0 1-4 4H72a4 4 0 0 1-4-4z" />
      </g>

      {/* The generator probe lowered into the sample. */}
      <g {...part('immerse')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M88 90V160" />
          <rect height="16" rx="1.5" width="12" x="82" y="160" />
          <path d="M85 166h6M85 170h6" />
        </g>
      </g>

      {/* The speed dial. */}
      <g {...part('set')}>
        <circle cx="88" cy="40" r="6" />
        <path className={styles.whirl} d="M88 35v10M83 40h10" />
      </g>

      {/* The rotor spinning, the sample swirling and breaking up. */}
      <g {...part('homogenise')}>
        <path className={styles.spinBar} d="M83 178h10" />
        <path className={styles.flow} d="M72 186q16 6 32 0" />
        <circle className={styles.rise} cx="76" cy="176" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="100" cy="180" r="1.4" />
      </g>

      {/* The wash beaker the probe is cleaned in. */}
      <g {...part('clean')}>
        <path d="M120 160h32M122 160v30a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4v-30" />
        <path className={styles.liquid} d="M122 172h28v18a4 4 0 0 1-4 4h-20a4 4 0 0 1-4-4z" />
        <circle className={styles.rise} cx="130" cy="184" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="142" cy="186" r="1.4" />
      </g>

      {/* The homogenised sample tube back in the rack. */}
      <g {...part('recover')}>
        <path d="M164 172h44M168 172v24M204 172v24" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M182 144v22a4 4 0 0 0 8 0v-22M181 144h10" />
          <path className={styles.liquid} d="M182 154h8v12a4 4 0 0 1-8 0z" />
        </g>
      </g>
    </>
  );
}

const homogenizer = {
  Drawing,
  // "Clean Probe" is checked before "immerse".
  parts: [
    { part: 'clean', test: /clean|rinse|wash/ },
    { part: 'recover', test: /recover|collect|remove/ },
    { part: 'immerse', test: /immers|insert|dip/ },
    { part: 'set', test: /set|speed/ },
    { part: 'homogenise', test: /homogen|disrupt|mix/ },
  ],
  tags: {
    immerse: { at: [60, 150], align: 'end' },
    set: { at: [112, 40], align: 'start' },
    homogenise: { at: [88, 216], align: 'center' },
    clean: { at: [135, 146], align: 'center' },
    recover: { at: [186, 130], align: 'center' },
  },
};

export default homogenizer;
