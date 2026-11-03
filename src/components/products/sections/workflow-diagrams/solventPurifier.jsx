import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Solvent purification system: the reservoir is charged with solvent, it is
// pushed up through the columns, the packing strips out water and oxygen,
// and dry solvent is dispensed through the valve into a flask.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The cabinet and feet. */}
      <g data-part="frame">
        <rect height="156" rx="6" width="160" x="30" y="40" />
        <path d="M44 196v5M176 196v5" />
      </g>

      {/* Solvent charged into the reservoir. */}
      <g {...part('charge')}>
        <rect height="56" rx="4" width="40" x="40" y="130" />
        <path className={styles.liquid} d="M42 150h36v34H42z" />
        <circle className={styles.drop} cx="60" cy="112" r="1.6" style={{ '--fall': '30px' }} />
      </g>

      {/* Solvent pushed up through the column lines. */}
      <g {...part('pass')}>
        <path className={styles.flow} d="M60 130V60H108V70" />
        <path className={styles.flow} d="M108 170V176H138V170" />
      </g>

      {/* The columns' packing taking out water and oxygen. */}
      <g {...part('purify')}>
        <rect height="100" rx="4" width="16" x="100" y="70" />
        <rect height="100" rx="4" width="16" x="130" y="70" />
        <path className={styles.blink} d="M104 82h0M112 92h0M104 102h0M112 112h0M104 122h0M112 132h0M104 142h0M112 152h0M134 82h0M142 92h0M134 102h0M142 112h0M134 122h0M142 132h0M134 142h0M142 152h0" strokeWidth="2.5" />
      </g>

      {/* Dry solvent dispensed through the valve into the flask. */}
      <g {...part('dispense')}>
        <path d="M146 72H200V150" />
        <path className={styles.blink} d="M194 110l12 10v-10l-12 10z" />
        <circle className={styles.drop} cx="200" cy="154" r="1.6" style={{ '--fall': '14px' }} />
        <path d="M195 166h10M197 166v6l-10 20a2 2 0 0 0 2 3h22a2 2 0 0 0 2-3l-10-20v-6" />
        <path className={styles.liquid} d="M191 186h18l3 6a2 2 0 0 1-2 3h-20a2 2 0 0 1-2-3z" />
      </g>
    </>
  );
}

const solventPurifier = {
  Drawing,
  parts: [
    { part: 'charge', test: /charge|fill|load/ },
    { part: 'pass', test: /pass|column/ },
    { part: 'purify', test: /purif|dry/ },
    { part: 'dispense', test: /dispens|collect/ },
  ],
  tags: {
    charge: { at: [60, 100], align: 'center' },
    pass: { at: [84, 28], align: 'center' },
    purify: { at: [123, 184], align: 'center' },
    dispense: { at: [212, 96], align: 'center' },
  },
};

export default solventPurifier;
