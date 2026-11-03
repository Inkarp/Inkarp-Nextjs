import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Ultrasonic probe sonicator: the probe is lowered into the sample, the
// amplitude is set on the generator, the tip sonicates the sample, the ice
// bath keeps it cool, and the sample is recovered to the rack.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Stand, clamp, the converter, its cable to the generator, the
          generator box and the sample beaker. */}
      <g data-part="frame">
        <rect height="8" rx="3" width="100" x="20" y="196" />
        <path d="M36 196V24M40 48H62" />
        <rect height="8" width="8" x="32" y="44" />
        <rect height="60" rx="4" width="24" x="62" y="26" />
        <path d="M86 40H150" />
        <rect height="66" rx="4" width="90" x="150" y="30" />
        <path d="M54 140h40M56 140v42a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-42" />
        <path className={styles.liquid} d="M56 154h36v28a4 4 0 0 1-4 4H60a4 4 0 0 1-4-4z" />
      </g>

      {/* The probe lowered into the sample. */}
      <g {...part('immerse')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M68 86h12v16h-12zM72 102h4v62h-4z" />
        </g>
      </g>

      {/* The amplitude set on the generator. */}
      <g {...part('set')}>
        <rect height="20" rx="2" width="42" x="158" y="40" />
        <path className={styles.blink} d="M164 50h8M176 50h8M188 50h6" />
        <path d="M160 86v-6M166 86v-10M172 86v-14" />
        <circle cx="222" cy="74" r="8" />
        <path className={styles.whirl} d="M222 67v14M215 74h14" />
      </g>

      {/* The tip sonicating: waves and cavitation bubbles round it. */}
      <g {...part('sonicate')}>
        <path className={styles.signal} d="M84 160q4 6 0 12M64 160q-4 6 0 12" />
        <circle className={styles.rise} cx="70" cy="172" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="80" cy="176" r="1.4" />
        <circle className={styles.rise} cx="76" cy="178" r="1.4" />
      </g>

      {/* The ice bath round the beaker. */}
      <g {...part('cool')}>
        <path d="M44 156v34a4 4 0 0 0 4 4h52a4 4 0 0 0 4-4v-34" />
        <path className={styles.blink} d="M47 168h6v6h-6zM95 172h6v6h-6zM48 182h6v6h-6zM94 160h6v6h-6z" />
      </g>

      {/* The sample back in the rack. */}
      <g {...part('recover')}>
        <path d="M144 172h44M148 172v24M184 172v24" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M162 146v20a4 4 0 0 0 8 0v-20M161 146h10" />
          <path className={styles.liquid} d="M162 156h8v10a4 4 0 0 1-8 0z" />
        </g>
      </g>
    </>
  );
}

const probeSonicator = {
  Drawing,
  parts: [
    { part: 'immerse', test: /immers|insert|dip/ },
    { part: 'set', test: /set|amplitude/ },
    { part: 'sonicate', test: /sonicat|ultrason/ },
    { part: 'cool', test: /cool|ice/ },
    { part: 'recover', test: /recover|collect|remove/ },
  ],
  tags: {
    immerse: { at: [62, 116], align: 'end' },
    set: { at: [195, 16], align: 'center' },
    sonicate: { at: [112, 140], align: 'start' },
    cool: { at: [74, 214], align: 'center' },
    recover: { at: [166, 128], align: 'center' },
  },
};

export default probeSonicator;
