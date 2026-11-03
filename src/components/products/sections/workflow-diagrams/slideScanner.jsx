import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Automated slide scanner / imaging system: slides are loaded on the tray, the
// objective finds focus by itself, the stage sweeps the whole slide under it,
// the camera digitises each field, and the image is analysed on the screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Housing, feet, viewing window, stage and the tray slot. */}
      <g data-part="frame">
        <rect height="126" rx="8" width="140" x="20" y="70" />
        <path d="M34 196v6M146 196v6" />
        <rect height="72" rx="4" width="112" x="34" y="84" />
        <rect height="6" width="80" x="50" y="128" />
        <rect height="14" rx="2" width="100" x="40" y="168" />
      </g>

      {/* Slides set down on the loading tray. */}
      <g {...part('load')}>
        <rect height="6" width="92" x="44" y="172" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M50 172v-4h20v4M80 172v-4h20v4M110 172v-4h20v4" />
        </g>
      </g>

      {/* The objective finding focus. */}
      <g {...part('focus')}>
        <g className={styles.nudge}>
          <rect height="16" width="12" x="84" y="98" />
          <path d="M86 114h8v4h-8z" />
        </g>
        <path d="M104 100v12M101 103l3-3 3 3M101 109l3 3 3-3" />
      </g>

      {/* The stage sweeping the slide under the objective, field by field. */}
      <g {...part('scan')}>
        <g className={styles.sweep}>
          <rect height="4" width="40" x="70" y="124" />
          <path d="M80 124v4M90 124v4M100 124v4" />
        </g>
      </g>

      {/* The camera digitising each field, sent to the computer. */}
      <g {...part('digitise')}>
        <rect height="10" rx="2" width="20" x="80" y="86" />
        <path className={styles.flow} d="M100 91H168V82H176" />
        <path className={styles.blink} d="M182 66h10v10h-10zM194 66h10v10h-10zM182 78h10v10h-10zM194 78h10v10h-10z" />
      </g>

      {/* The screen, and the analysis drawn on it. */}
      <g {...part('analyse')}>
        <rect height="44" rx="3" width="64" x="176" y="60" />
        <path d="M208 104v14M196 118h24" />
        <path d="M210 96h24M210 96V66" />
        <path className={styles.draw} d="M212 94l6-10 6 4 8-16" pathLength="100" />
      </g>
    </>
  );
}

const slideScanner = {
  Drawing,
  // "Scan Whole Slide" is checked before "load" ("slide" is in both).
  parts: [
    { part: 'scan', test: /scan|sweep|tile/ },
    { part: 'focus', test: /focus/ },
    { part: 'digitise', test: /digiti|camera|acquir/ },
    { part: 'analyse', test: /analy|report|result/ },
    { part: 'load', test: /load|slide|plate|sample/ },
  ],
  tags: {
    load: { at: [90, 214], align: 'center' },
    focus: { at: [78, 106], align: 'end' },
    scan: { at: [90, 146], align: 'center' },
    digitise: { at: [132, 76], align: 'center' },
    analyse: { at: [208, 46], align: 'center' },
  },
};

export default slideScanner;
