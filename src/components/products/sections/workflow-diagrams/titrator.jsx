import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Titrator: the sample stirs in its beaker, the burette doses titrant drop by
// drop, the electrode finds the endpoint on the curve, the terminal calculates
// and prints the report.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The dosing unit's body. */}
      <g data-part="frame">
        <rect height="96" rx="6" width="62" x="22" y="104" />
        <path d="M32 118h42M32 128h30" />
      </g>

      {/* Sample in its beaker, stirred on the stirrer. */}
      <g {...part('prepare')}>
        <rect height="14" rx="4" width="76" x="100" y="186" />
        <circle cx="168" cy="193" r="3" />
        <path d="M108 128h60M112 128v54a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4v-54" />
        <path className={styles.liquid} d="M112 152q8.7-4 17.3 0t17.3 0t17.4 0v30a4 4 0 0 1-4 4h-44a4 4 0 0 1-4-4z" />
        <rect className={styles.spinBar} height="4" rx="2" width="16" x="130" y="178" />
      </g>

      {/* Burette, tubing and tip, dosing titrant drop by drop. */}
      <g {...part('dose')}>
        <rect height="74" rx="4" width="22" x="42" y="30" />
        <path d="M42 44h6M42 56h6M42 68h6M42 80h6M42 92h6M53 30v-8" />
        <path className={styles.liquid} d="M46 62h14v38h-14z" />
        <path d="M53 22q0-8 8-8h64q9 0 9 9v89" />
        <path d="M131 112h6l-3 8z" />
        <circle className={styles.drop} cx="134" cy="122" r="1.6" style={{ '--fall': '28px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="134" cy="122" r="1.6" style={{ '--fall': '28px' }} />
      </g>

      {/* Electrode in the sample, and the curve with its endpoint. */}
      <g {...part('detect')}>
        <path d="M152 104v58M152 104q0-14 14-14h20" />
        <circle cx="152" cy="166" r="4" />
        <path className={styles.draw} d="M196 98C206 98 208 96 212 88C215 80 218 78 230 77" pathLength="100" />
        <circle className={styles.blink} cx="212" cy="88" r="2" />
      </g>

      {/* The terminal working out the result. */}
      <g {...part('calculate')}>
        <rect height="50" rx="5" width="54" x="186" y="66" />
        <rect height="30" rx="2" width="42" x="192" y="72" />
        <circle className={styles.press} cx="200" cy="109" r="2.5" />
        <circle cx="213" cy="109" r="2.5" />
        <circle cx="226" cy="109" r="2.5" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M198 116v22h30v-22" />
          <path d="M203 124h20M203 130h14" />
        </g>
      </g>
    </>
  );
}

const titrator = {
  Drawing,
  parts: [
    { part: 'prepare', test: /prepar|sample|stir/ },
    { part: 'dose', test: /dos|titrant|add|dispens/ },
    { part: 'detect', test: /detect|endpoint|electrode/ },
    { part: 'calculate', test: /calculat|result/ },
    { part: 'report', test: /report|print|record/ },
  ],
  tags: {
    prepare: { at: [138, 214], align: 'center' },
    dose: { at: [68, 36], align: 'start' },
    detect: { at: [168, 160], align: 'start' },
    calculate: { at: [213, 56], align: 'center' },
    report: { at: [213, 150], align: 'center' },
  },
};

export default titrator;
