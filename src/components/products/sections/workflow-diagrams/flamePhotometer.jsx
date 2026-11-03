import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Flame photometer: calibrate with standards, the sample is drawn up the
// capillary, atomised in the flame, the emitted light passes a filter to the
// detector, and the reading is shown and printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet, chimney, the flame window and the other keys. */}
      <g data-part="frame">
        <rect height="126" rx="8" width="160" x="60" y="70" />
        <path d="M74 196v6M206 196v6" />
        <path d="M156 70V42h28v28M150 42h40" />
        <rect height="50" rx="3" width="58" x="146" y="82" />
        <circle cx="188" cy="160" r="4" />
        <circle cx="204" cy="160" r="4" />
      </g>

      {/* Standards, and the calibrate key. */}
      <g {...part('calibrate')}>
        <path d="M6 128v-20a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v20zM10 104v-4h6v4M9 116h8" />
        <path d="M26 128v-20a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v20zM30 104v-4h6v4M29 116h8" />
        <circle className={styles.press} cx="172" cy="160" r="4" />
      </g>

      {/* The sample in its cup, drawn up the capillary to the burner. */}
      <g {...part('aspirate')}>
        <path d="M14 150h32M17 150v42a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4v-42" />
        <path className={styles.liquid} d="M17 168h26v24a4 4 0 0 1-4 4h-18a4 4 0 0 1-4-4z" />
        <path className={styles.flow} d="M32 188V138H175V132" />
      </g>

      {/* The burner and its flame, hot gases out of the chimney. */}
      <g {...part('atomise')}>
        <path d="M168 132v-6h14v6" />
        <g className={styles.flicker}>
          <path d="M175 94c6 10 10 16 10 21a10 10 0 0 1-20 0c0-5 4-11 10-21z" />
          <path d="M175 106c3 5 5 8 5 10a5 5 0 0 1-10 0c0-2 2-5 5-10z" />
        </g>
        <path className={styles.heat} d="M164 36q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M176 36q-2-3 0-6t0-6" />
      </g>

      {/* Emitted light through the filter to the detector. */}
      <g {...part('measure')}>
        <path className={styles.flow} d="M163 108H128" />
        <rect height="20" width="6" x="120" y="98" />
        <rect height="16" rx="2" width="10" x="104" y="100" />
      </g>

      {/* The reading on the display, and the printout. */}
      <g {...part('report')}>
        <rect height="26" rx="3" width="70" x="76" y="146" />
        <path className={styles.blink} d="M84 159h10M100 159h10M116 159h20" />
        <g className={styles.feed}>
          <path d="M84 70V46h24v24" />
          <path d="M88 54h16M88 60h16M88 66h10" />
        </g>
      </g>
    </>
  );
}

const flamePhotometer = {
  Drawing,
  // "Measure Emission" is checked before "aspirate" ("sample" is in both).
  parts: [
    { part: 'calibrate', test: /calibrat|standard/ },
    { part: 'atomise', test: /atomi|flame|burn/ },
    { part: 'measure', test: /measur|emission|detect/ },
    { part: 'report', test: /report|print|result|read/ },
    { part: 'aspirate', test: /aspirat|sample|draw/ },
  ],
  tags: {
    calibrate: { at: [23, 88], align: 'center' },
    aspirate: { at: [30, 214], align: 'center' },
    atomise: { at: [170, 24], align: 'center' },
    measure: { at: [112, 88], align: 'center' },
    report: { at: [96, 34], align: 'center' },
  },
};

export default flamePhotometer;
