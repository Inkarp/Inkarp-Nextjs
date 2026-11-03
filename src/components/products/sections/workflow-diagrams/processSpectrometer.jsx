import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Process (in-line) spectrometer: the probe is installed in the process line,
// the model is calibrated against reference samples, light runs down the
// fibre while product flows past the probe, the trend is analysed on screen,
// and the report is printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Analyzer cabinet and its display, the fibre cable, and the process
          pipe with its flanges. */}
      <g data-part="frame">
        <rect height="120" rx="6" width="70" x="10" y="70" />
        <rect height="20" rx="2" width="50" x="20" y="84" />
        <path d="M20 160h50M20 168h50M20 176h50" />
        <path d="M80 136h40q20 0 20-20v-6h35v10" />
        <path d="M100 170H250M100 190H250M140 164v32M210 164v32" />
      </g>

      {/* The probe fitted into the line. */}
      <g {...part('install')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <rect height="40" rx="2" width="10" x="170" y="120" />
          <path d="M173 160v14h4v-14M164 160h22" />
        </g>
      </g>

      {/* Reference samples, the reading checked on the display. */}
      <g {...part('calibrate')}>
        <path d="M96 100V80h8v20zM110 100V80h8v20z" />
        <path className={styles.liquid} d="M96 92h8v8h-8zM110 88h8v12h-8z" />
        <path className={styles.blink} d="M26 94h10M40 94h10M54 94h10" />
      </g>

      {/* Product flowing past the probe, light along the fibre. */}
      <g {...part('monitor')}>
        <path className={styles.flow} d="M100 180H250" />
        <path className={styles.flow} d="M80 136h40q20 0 20-20v-6h35v10" />
      </g>

      {/* The trend on the plant screen. */}
      <g {...part('analyse')}>
        <rect height="56" rx="3" width="80" x="160" y="20" />
        <path className={styles.flow} d="M80 90H120V48H160" />
        <path className={styles.draw} d="M166 66c10 0 14-20 24-20s14 14 24 6 10-12 20-14" pathLength="100" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M22 70V36h28v34" />
          <path d="M26 44h20M26 50h20M26 56h12" />
        </g>
      </g>
    </>
  );
}

const processSpectrometer = {
  Drawing,
  parts: [
    { part: 'install', test: /install|probe|fit/ },
    { part: 'calibrate', test: /calibrat|model/ },
    { part: 'monitor', test: /monitor|in-line|measur/ },
    { part: 'analyse', test: /analy|trend/ },
    { part: 'report', test: /report|print|result/ },
  ],
  tags: {
    install: { at: [190, 140], align: 'start' },
    calibrate: { at: [107, 66], align: 'center' },
    monitor: { at: [175, 214], align: 'center' },
    analyse: { at: [200, 10], align: 'center' },
    report: { at: [36, 24], align: 'center' },
  },
};

export default processSpectrometer;
