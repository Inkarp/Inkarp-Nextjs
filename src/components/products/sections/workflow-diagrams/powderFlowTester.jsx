import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Powder flow tester: the trough is filled with powder, the lid presses down
// to consolidate it, the cell turns under the lid to shear it, the load cell
// measures the flow function, and the report is printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, columns, crosshead and the rod down to the lid. */}
      <g data-part="frame">
        <rect height="24" rx="4" width="140" x="30" y="176" />
        <path d="M44 176V40M156 176V40M100 44V110" />
        <rect height="14" rx="3" width="128" x="36" y="30" />
        <rect height="8" width="76" x="62" y="150" />
      </g>

      {/* Powder poured from the scoop into the trough. */}
      <g {...part('fill')}>
        <path d="M48 98l20 6-3 6-20-6z" />
        <circle className={styles.drop} cx="70" cy="112" r="1.4" style={{ '--fall': '20px' }} />
        <rect height="20" width="64" x="68" y="130" />
        <path className={styles.liquid} d="M70 138h60v10h-60z" />
      </g>

      {/* The lid pressed down onto the powder. */}
      <g {...part('consolidate')}>
        <g className={styles.lower} style={{ '--lower': '-16px' }}>
          <rect height="8" width="56" x="72" y="110" />
        </g>
        <path className={styles.blink} d="M66 96v10M63 103l3 3 3-3M134 96v10M131 103l3 3 3-3" />
      </g>

      {/* The cell turning under the lid. */}
      <g {...part('shear')}>
        <ellipse className={styles.turn} cx="100" cy="154" rx="44" ry="4" />
      </g>

      {/* The load cell, and the flow function plotted on screen. */}
      <g {...part('measure')}>
        <rect height="14" rx="2" width="12" x="94" y="70" />
        <path className={styles.blink} d="M97 77h6" />
        <rect height="52" rx="3" width="68" x="180" y="40" />
        <path d="M186 86h56M186 86V46" />
        <path className={styles.draw} d="M188 82c14-4 24-14 32-24s14-8 20-8" pathLength="100" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M200 40V16h22v24" />
          <path d="M204 24h14M204 30h14" />
        </g>
      </g>
    </>
  );
}

const powderFlowTester = {
  Drawing,
  parts: [
    { part: 'fill', test: /fill|load/ },
    { part: 'consolidate', test: /consolidat|compress|press/ },
    { part: 'shear', test: /shear|rotat/ },
    { part: 'measure', test: /measur|flow function/ },
    { part: 'report', test: /report|print|result/ },
  ],
  tags: {
    fill: { at: [36, 88], align: 'center' },
    consolidate: { at: [150, 106], align: 'start' },
    shear: { at: [100, 216], align: 'center' },
    measure: { at: [248, 104], align: 'end' },
    report: { at: [211, 8], align: 'center' },
  },
};

export default powderFlowTester;
