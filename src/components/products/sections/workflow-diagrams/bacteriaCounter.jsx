import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Bacteria counter (impedance flow cytometry): the sample tube is loaded,
// cells flow one by one past the electrodes to be measured, the count runs
// up on the display, and the report shows on the screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The instrument, feet, the sample port and the channel window. */}
      <g data-part="frame">
        <rect height="136" rx="8" width="130" x="40" y="60" />
        <path d="M54 196v5M156 196v5M102 60v-6h16v6" />
        <rect height="30" rx="3" width="90" x="60" y="110" />
      </g>

      {/* The sample tube pushed into the port. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M104 34v34a6 6 0 0 0 12 0V34M102 34h16" />
          <path className={styles.liquid} d="M104 54h12v14a6 6 0 0 1-12 0z" />
        </g>
      </g>

      {/* Cells flowing past the electrodes, each one sensed. */}
      <g {...part('measure')}>
        <path d="M66 125H144" />
        <path className={styles.vapour} d="M66 125H144" />
        <rect height="6" width="10" x="100" y="114" />
        <rect height="6" width="10" x="100" y="130" />
        <path className={styles.signal} d="M114 116q4 9 0 18" />
      </g>

      {/* The count running up on the display. */}
      <g {...part('enumerate')}>
        <rect height="26" rx="2" width="90" x="60" y="152" />
        <path className={styles.blink} d="M68 165h10M82 165h10M96 165h10M110 165h10" />
      </g>

      {/* The report on the screen. */}
      <g {...part('report')}>
        <rect height="60" rx="3" width="66" x="180" y="90" />
        <path d="M186 142h54" />
        <path className={styles.draw} d="M192 142v-14M204 142v-34M216 142v-22M228 142v-10" pathLength="100" />
      </g>
    </>
  );
}

const bacteriaCounter = {
  Drawing,
  parts: [
    { part: 'load', test: /load|sample|insert/ },
    { part: 'measure', test: /measur|scan|detect/ },
    { part: 'enumerate', test: /enumerat|count/ },
    { part: 'report', test: /report|result/ },
  ],
  tags: {
    load: { at: [110, 22], align: 'center' },
    measure: { at: [-6, 125], align: 'start' },
    enumerate: { at: [105, 210], align: 'center' },
    report: { at: [213, 76], align: 'center' },
  },
};

export default bacteriaCounter;
