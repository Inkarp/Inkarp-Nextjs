import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Peristaltic pump: the tubing goes into the pump head, liquid is primed up
// from the bottle, the flow rate is set, the rollers turn and squeeze the
// tube, and the liquid is dispensed drop by drop.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Drive body, feet and the pump head housing. */}
      <g data-part="frame">
        <rect height="106" rx="8" width="108" x="66" y="90" />
        <path d="M80 196v5M160 196v5" />
        <circle cx="120" cy="132" r="34" />
      </g>

      {/* The tubing seated round the rollers. */}
      <g {...part('load')}>
        <path d="M92 132A28 28 0 0 0 148 132" />
      </g>

      {/* Liquid drawn up from the bottle to the head. */}
      <g {...part('prime')}>
        <path d="M10 196v-40a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v40zM21 150v-6h12v6" />
        <path className={styles.liquid} d="M10 170h34v26h-34z" />
        <path className={styles.flow} d="M27 186V76H92V132" />
      </g>

      {/* The flow-rate display and its knob. */}
      <g {...part('set')}>
        <rect height="14" rx="2" width="46" x="86" y="172" />
        <path className={styles.blink} d="M92 179h8M104 179h8M116 179h10" />
        <circle cx="150" cy="179" r="6" />
        <path className={styles.whirl} d="M150 174v10M145 179h10" />
      </g>

      {/* The rotor and its rollers turning. */}
      <g {...part('pump')}>
        <g className={styles.whirl} style={{ transformBox: 'view-box', transformOrigin: '120px 132px' }}>
          <circle cx="120" cy="132" r="5" />
          <path d="M120 127V110M124.3 134.5L139 143M115.7 134.5L101 143" />
          <circle cx="120" cy="110" r="5" />
          <circle cx="139" cy="143" r="5" />
          <circle cx="101" cy="143" r="5" />
        </g>
      </g>

      {/* Out of the head and dispensed into the receiver. */}
      <g {...part('dispense')}>
        <path className={styles.flow} d="M148 132V76H212V150" />
        <path d="M194 160h36M197 160v32a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4v-32" />
        <path className={styles.liquid} d="M197 182h30v10a4 4 0 0 1-4 4h-22a4 4 0 0 1-4-4z" />
        <circle className={styles.drop} cx="212" cy="153" r="1.6" style={{ '--fall': '26px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="212" cy="153" r="1.6" style={{ '--fall': '26px' }} />
      </g>
    </>
  );
}

const peristalticPump = {
  Drawing,
  parts: [
    { part: 'load', test: /load|tub/ },
    { part: 'prime', test: /prime|fill/ },
    { part: 'set', test: /set|flow rate|speed/ },
    { part: 'pump', test: /pump|run|transfer|empty|revers/ },
    { part: 'dispense', test: /dispens|deliver|collect/ },
  ],
  tags: {
    load: { at: [120, 62], align: 'center' },
    prime: { at: [40, 62], align: 'center' },
    set: { at: [109, 214], align: 'center' },
    pump: { at: [150, 214], align: 'start' },
    dispense: { at: [212, 214], align: 'center' },
  },
};

export default peristalticPump;
