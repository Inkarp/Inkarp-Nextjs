import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Halogen moisture analyzer: weigh the sample on the pan, the halogen lamp
// heats it, moisture dries off, the display tracks the weight loss, and the
// result is printed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, keys, and the hood over the sample chamber. */}
      <g data-part="frame">
        <rect height="60" rx="10" width="228" x="6" y="124" />
        <path d="M23 184v7M217 184v7" />
        <circle cx="129" cy="155" r="5" />
        <circle cx="148" cy="155" r="5" />
        <path d="M112 124v-41a14 14 0 0 1 14-14h87a14 14 0 0 1 14 14v41M155 69v-10h29v10" />
      </g>

      {/* The sample on its pan. */}
      <g {...part('weigh')}>
        <ellipse cx="169" cy="119" rx="38" ry="5" />
        <path className={styles.liquid} d="M145 118q24-11 48 0z" />
      </g>

      {/* The halogen lamp glowing. */}
      <g {...part('heat')}>
        <path d="M129 88h82" />
        <path className={styles.glow} d="M138 95v7M155 95v7M172 95v7M189 95v7M203 95v7" />
      </g>

      {/* Moisture rising off the sample. */}
      <g {...part('dry')}>
        <path className={styles.heat} d="M157 112q-2.5-3.5 0-7t0-7" />
        <path className={`${styles.heat} ${styles.later}`} d="M169 112q-2.5-3.5 0-7t0-7" />
        <path className={`${styles.heat} ${styles.latest}`} d="M181 112q-2.5-3.5 0-7t0-7" />
      </g>

      {/* The weight-loss curve on the display. */}
      <g {...part('measure')}>
        <rect height="34" rx="4" width="89" x="21" y="138" />
        <path className={styles.draw} d="M28 146c12 0 14 10 26 14s19 5 48 5" pathLength="100" />
      </g>

      {/* The printed result. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M23 119v-36h36v36" />
          <path d="M29 93h24M29 100h24M29 107h14" />
        </g>
      </g>
    </>
  );
}

const moistureAnalyzer = {
  Drawing,
  // "Measure Weight Loss" also contains "weigh", so measure is checked first.
  parts: [
    { part: 'measure', test: /measur|loss/ },
    { part: 'report', test: /report|print|result|record/ },
    { part: 'heat', test: /heat/ },
    { part: 'dry', test: /dry|evapor/ },
    { part: 'weigh', test: /weigh|sample|load/ },
  ],
  tags: {
    weigh: { at: [169, 208], align: 'center' },
    heat: { at: [169, 48], align: 'center' },
    dry: { at: [169, 48], align: 'center' },
    measure: { at: [65, 208], align: 'center' },
    report: { at: [41, 70], align: 'center' },
  },
};

export default moistureAnalyzer;
