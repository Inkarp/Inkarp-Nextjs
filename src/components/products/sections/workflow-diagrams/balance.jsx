import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Analytical / precision balance: level it, calibrate with a weight, tare,
// weigh the sample in its beaker, record the result.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Draft shield, its handle and glass, and the balance body. */}
      <g data-part="frame">
        <rect height="106" rx="4" width="148" x="46" y="62" />
        <path d="M100 54h40M120 54v8" />
        <path d="M60 152l26-26M68 160l18-18" />
        <rect height="36" rx="8" width="180" x="30" y="168" />
      </g>

      {/* Feet and the level bubble settling in its ring. */}
      <g {...part('level')}>
        <path d="M42 204v8M198 204v8" />
        <circle cx="44" cy="186" r="7" />
        <circle className={styles.bubble} cx="44" cy="186" r="2.4" />
      </g>

      {/* A calibration weight set down on the pan. */}
      <g {...part('calibrate')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <rect height="13" rx="2" width="12" x="140" y="136" />
          <path d="M143 136v-3h6v3" />
        </g>
      </g>

      {/* The tare key, pressed. */}
      <g {...part('tare')}>
        <circle className={styles.press} cx="160" cy="186" r="4" />
        <circle cx="180" cy="186" r="4" />
      </g>

      {/* The pan, and the sample going into the beaker on it. */}
      <g {...part('weigh')}>
        <ellipse cx="120" cy="150" rx="34" ry="5" />
        <path d="M120 155v13" />
        <path d="M104 106h32M107 106v38a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4v-38" />
        <path className={styles.liquid} d="M107 126q6.5-4 13 0t13 0v18a4 4 0 0 1-4 4h-18a4 4 0 0 1-4-4z" />
        <path className={styles.flow} d="M120 76v24" />
      </g>

      {/* The reading on the display, and the record printed out. */}
      <g {...part('record')}>
        <rect height="16" rx="3" width="84" x="58" y="178" />
        <path className={styles.blink} d="M68 186h10M84 186h10M100 186h10M116 186h14" />
        <g className={styles.feed}>
          <path d="M214 132h22v30h-22z" />
          <path d="M218 140h14M218 146h14M218 152h9" />
        </g>
      </g>
    </>
  );
}

const balance = {
  Drawing,
  // Checked in order, so "record" wins over "weigh" for a step like "Record weight".
  parts: [
    { part: 'level', test: /level/ },
    { part: 'calibrate', test: /calibrat/ },
    { part: 'tare', test: /tare|zero/ },
    { part: 'record', test: /record|print|report|document|result/ },
    { part: 'weigh', test: /weigh|sample|load/ },
  ],
  tags: {
    level: { at: [30, 224], align: 'start' },
    calibrate: { at: [156, 118], align: 'start' },
    tare: { at: [170, 224], align: 'center' },
    weigh: { at: [102, 88], align: 'end' },
    record: { at: [225, 122], align: 'center' },
  },
};

export default balance;
