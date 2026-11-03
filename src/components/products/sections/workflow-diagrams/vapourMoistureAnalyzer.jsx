import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Vapour-pressure moisture analyzer: the sealed vial goes into the heating
// block, the sample is heated, a needle through the septum carries the
// released moisture to the sensor, the reading is correlated to moisture
// content, and the result is reported.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The instrument body, feet and the top of the well. */}
      <g data-part="frame">
        <rect height="106" rx="8" width="150" x="30" y="90" />
        <path d="M44 196v5M166 196v5M60 90v-6h40v6" />
      </g>

      {/* The sealed vial set into the well. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-16px' }}>
          <path d="M70 72v74a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V72M68 64h24v8H68z" />
          <path className={styles.liquid} d="M70 136h20v10a4 4 0 0 1-4 4H74a4 4 0 0 1-4-4z" />
        </g>
      </g>

      {/* The heating block warming the sample. */}
      <g {...part('heat')}>
        <rect height="60" rx="3" width="48" x="56" y="100" />
        <path className={styles.glow} d="M58 156h44" />
        <path className={styles.heat} d="M76 132q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M84 132q-2-3 0-6t0-6" />
      </g>

      {/* The needle through the septum, moisture carried to the sensor. */}
      <g {...part('detect')}>
        <path d="M80 30V76" />
        <path className={styles.flow} d="M80 30H140V100" />
        <rect height="22" rx="3" width="28" x="126" y="100" />
        <path className={styles.signal} d="M156 104q4 7 0 14" />
      </g>

      {/* The reading correlated to moisture content. */}
      <g {...part('correlate')}>
        <rect height="60" rx="3" width="60" x="186" y="40" />
        <path d="M192 94h48M192 94V46" />
        <path className={styles.draw} d="M194 90L238 50" pathLength="100" />
        <path d="M200 84h0M212 74h0M222 64h0M232 56h0" strokeWidth="4" />
      </g>

      {/* The result on the display. */}
      <g {...part('report')}>
        <rect height="30" rx="3" width="50" x="120" y="140" />
        <path className={styles.blink} d="M127 155h10M141 155h10M155 155h8" />
      </g>
    </>
  );
}

const vapourMoistureAnalyzer = {
  Drawing,
  parts: [
    { part: 'load', test: /load|vial|seal/ },
    { part: 'heat', test: /heat|warm/ },
    { part: 'detect', test: /detect|sens|measur/ },
    { part: 'correlate', test: /correlat|calculat/ },
    { part: 'report', test: /report|result/ },
  ],
  tags: {
    load: { at: [36, 52], align: 'center' },
    heat: { at: [80, 178], align: 'center' },
    detect: { at: [104, 18], align: 'start' },
    correlate: { at: [216, 28], align: 'center' },
    report: { at: [145, 184], align: 'center' },
  },
};

export default vapourMoistureAnalyzer;
