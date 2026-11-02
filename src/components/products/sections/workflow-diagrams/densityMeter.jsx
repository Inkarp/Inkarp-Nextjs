import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Oscillating U-tube density meter: rinse the cell, fill it from the syringe,
// the U-tube oscillates to measure, read the display, clean out to waste.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The instrument body, its feet and keys. */}
      <g data-part="frame">
        <rect height="104" rx="8" width="176" x="24" y="96" />
        <path d="M40 200v6M184 200v6" />
        <circle cx="48" cy="170" r="4" />
        <circle cx="66" cy="170" r="4" />
      </g>

      {/* Solvent bottle rinsing the cell through its tube. */}
      <g {...part('rinse')}>
        <path d="M206 170v-38a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v38zM212 126v-6h12v6M161 96v-10" />
        <path className={styles.flow} d="M161 86v-8q0-6 6-6h44q7 0 7 7v41" />
      </g>

      {/* Syringe filling the cell with sample. */}
      <g {...part('fill')}>
        <rect height="44" rx="2" width="16" x="133" y="36" />
        <path d="M141 80v16" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M141 36V20M133 20h16" />
        </g>
        <path className={styles.liquid} d="M141 130v24a10 10 0 0 0 20 0v-24z" />
      </g>

      {/* The measuring cell: the U-tube oscillating in its window. */}
      <g {...part('measure')}>
        <rect height="72" rx="4" width="70" x="116" y="110" />
        <g className={styles.vibrate}>
          <path d="M138 112v42a13 13 0 0 0 26 0v-42M144 112v42a7 7 0 0 0 14 0v-42" />
        </g>
        <path className={styles.blink} d="M126 150h-4M126 160h-4M176 150h4M176 160h4" />
      </g>

      {/* The density on the display. */}
      <g {...part('read')}>
        <rect height="40" rx="3" width="62" x="36" y="110" />
        <path className={styles.blink} d="M44 124h12M60 124h12M76 124h10M44 136h34" />
      </g>

      {/* Emptied and cleaned out to the waste beaker. */}
      <g {...part('clean')}>
        <path d="M151 182v20M138 206h28M141 206v18a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-18" />
        <circle className={styles.drop} cx="151" cy="204" r="1.5" style={{ '--fall': '14px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="151" cy="204" r="1.5" style={{ '--fall': '14px' }} />
      </g>
    </>
  );
}

const densityMeter = {
  Drawing,
  // "Rinse" comes before "Clean", so a first rinse lights the solvent bottle.
  parts: [
    { part: 'rinse', test: /rinse/ },
    { part: 'fill', test: /fill|inject|load|sample/ },
    { part: 'measure', test: /measur|oscillat/ },
    { part: 'read', test: /read|result|display/ },
    { part: 'clean', test: /clean|dry|empty|waste/ },
  ],
  tags: {
    rinse: { at: [218, 184], align: 'center' },
    fill: { at: [153, 26], align: 'start' },
    measure: { at: [151, 190], align: 'center' },
    read: { at: [67, 188], align: 'center' },
    clean: { at: [170, 218], align: 'start' },
  },
};

export default densityMeter;
