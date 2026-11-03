import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Texture analyzer: the sample sits on the table, the probe is fitted under
// the load cell, the crosshead drives down to compress (or up to pull), the
// force curve is drawn on screen, and the report is printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, column and the sample table. */}
      <g data-part="frame">
        <rect height="20" rx="4" width="140" x="50" y="180" />
        <rect height="140" rx="3" width="16" x="160" y="40" />
        <rect height="8" width="60" x="80" y="168" />
        <rect height="50" rx="3" width="60" x="2" y="30" />
        <path d="M32 80v10M22 90h20" />
      </g>

      {/* The sample set on the table. */}
      <g {...part('mount')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M96 168v-18q0-4 4-4h20q4 0 4 4v18z" />
          <path className={styles.liquid} d="M98 166v-14q0-3 3-3h18q3 0 3 3v14z" />
        </g>
      </g>

      {/* The crosshead driving down, carrying the load cell and probe. */}
      <g {...part('compress')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <rect height="14" rx="2" width="76" x="84" y="70" />
          <g {...part('measure')}>
            <rect height="12" rx="1.5" width="12" x="104" y="84" />
          </g>
          <g {...part('set')}>
            <path d="M108 96v24M100 120h20v6h-20z" />
          </g>
        </g>
        <path className={styles.blink} d="M146 96v12M143 105l3 3 3-3" />
      </g>

      {/* The force curve on screen. */}
      <g {...part('measure')}>
        <path className={styles.draw} d="M8 72c10 0 14-4 20-16s10-18 14-6 8 18 16 22" pathLength="100" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M164 40V16h22v24" />
          <path d="M168 24h14M168 30h14" />
        </g>
      </g>
    </>
  );
}

const textureAnalyzer = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|place/ },
    { part: 'set', test: /set|probe|fixture/ },
    { part: 'compress', test: /compress|extend|penetrat|test/ },
    { part: 'measure', test: /measur|force/ },
    { part: 'report', test: /report|print|result/ },
  ],
  tags: {
    mount: { at: [70, 158], align: 'end' },
    set: { at: [72, 123], align: 'end' },
    compress: { at: [124, 58], align: 'center' },
    measure: { at: [32, 100], align: 'center' },
    report: { at: [176, 6], align: 'center' },
  },
};

export default textureAnalyzer;
