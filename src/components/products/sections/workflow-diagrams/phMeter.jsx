import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Benchtop pH / conductivity meter: calibrate with buffers, lower the electrode
// into the sample, measure, read the display, rinse the electrode.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Meter body and keys, electrode stand and arm, sample beaker. */}
      <g data-part="frame">
        <rect height="70" rx="8" width="90" x="40" y="130" />
        <circle cx="60" cy="186" r="3.5" />
        <circle cx="78" cy="186" r="3.5" />
        <circle cx="96" cy="186" r="3.5" />
        <circle cx="114" cy="186" r="3.5" />
        <path d="M146 204V60M136 204h20M146 76h40" />
        <path d="M164 128h48M168 128v68a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4v-68" />
        <path className={styles.liquid} d="M168 158q6.7-4 13.3 0t13.3 0t13.4 0v38a4 4 0 0 1-4 4h-32a4 4 0 0 1-4-4z" />
      </g>

      {/* Three buffer bottles. */}
      <g {...part('calibrate')}>
        <path d="M28 110V84a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v26zM33 80v-6h6v6M32 96h8" />
        <path d="M52 110V84a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v26zM57 80v-6h6v6M56 96h8" />
        <path d="M76 110V84a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v26zM81 80v-6h6v6M80 96h8" />
      </g>

      {/* The electrode, dipping into the sample. */}
      <g {...part('immerse')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="12" rx="2" width="12" x="180" y="70" />
          <path d="M186 82v82" />
          <circle cx="186" cy="170" r="5" />
        </g>
      </g>

      {/* The signal from the electrode, running up the cable to the meter. */}
      <g {...part('measure')}>
        <path className={styles.flow} d="M186 70q0-18-24-18h-14q-24 0-24 22v56" />
        <path className={styles.signal} d="M195 165a8 8 0 0 1 0 10M199 161a14 14 0 0 1 0 18" />
      </g>

      {/* The reading on the display. */}
      <g {...part('read')}>
        <rect height="30" rx="3" width="66" x="52" y="142" />
        <path className={styles.blink} d="M60 157h12M76 157h12M92 157h4M100 157h10" />
      </g>

      {/* Wash bottle rinsing the electrode. */}
      <g {...part('rinse')}>
        <path d="M216 140v-32a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v32zM228 102v-8q0-6-6-6h-14" />
        <circle className={styles.drop} cx="204" cy="92" r="1.5" style={{ '--fall': '30px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="200" cy="92" r="1.5" style={{ '--fall': '30px' }} />
      </g>
    </>
  );
}

const phMeter = {
  Drawing,
  parts: [
    { part: 'calibrate', test: /calibrat|buffer/ },
    { part: 'immerse', test: /immers|electrode|dip|insert/ },
    { part: 'measure', test: /measur/ },
    { part: 'read', test: /read|display|result|record/ },
    { part: 'rinse', test: /rinse|clean|wash/ },
  ],
  tags: {
    calibrate: { at: [28, 62], align: 'start' },
    immerse: { at: [174, 100], align: 'end' },
    measure: { at: [188, 216], align: 'center' },
    read: { at: [85, 214], align: 'center' },
    rinse: { at: [230, 72], align: 'center' },
  },
};

export default phMeter;
