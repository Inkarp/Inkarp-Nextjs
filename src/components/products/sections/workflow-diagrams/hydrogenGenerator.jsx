import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Hydrogen generator: the reservoir is filled with water, the cell splits it
// by electrolysis, the gas is dried in the purifier, pressure builds on the
// gauge, and hydrogen is supplied out to the reactor.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body and feet. */}
      <g data-part="frame">
        <rect height="136" rx="6" width="160" x="40" y="60" />
        <path d="M54 196v5M186 196v5" />
      </g>

      {/* Water poured into the reservoir. */}
      <g {...part('fill')}>
        <rect height="30" rx="3" width="40" x="56" y="30" />
        <path className={styles.liquid} d="M58 44h36v14H58z" />
        <circle className={styles.drop} cx="76" cy="14" r="1.4" style={{ '--fall': '24px' }} />
      </g>

      {/* The electrolysis cell, bubbles rising off the electrodes. */}
      <g {...part('electrolyse')}>
        <rect height="70" rx="4" width="50" x="60" y="100" />
        <path className={styles.liquid} d="M62 118h46v50H62z" />
        <path d="M74 110v50M96 110v50" />
        <circle className={styles.rise} cx="74" cy="150" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="96" cy="146" r="1.4" />
        <circle className={styles.rise} cx="96" cy="156" r="1.4" />
      </g>

      {/* The drying column the gas passes through. */}
      <g {...part('purify')}>
        <path className={styles.flow} d="M85 100V90H133V96" />
        <rect height="74" rx="3" width="14" x="126" y="96" />
        <path d="M130 110h0M136 118h0M130 126h0M136 134h0M130 142h0M136 150h0M130 158h0" strokeWidth="2.5" />
      </g>

      {/* Pressure building on the gauge. */}
      <g {...part('pressurise')}>
        <path className={styles.flow} d="M140 120H158" />
        <circle cx="172" cy="110" r="14" />
        <path className={styles.tilt} d="M172 110l7-9" style={{ transformBox: 'view-box', transformOrigin: '172px 110px' }} />
      </g>

      {/* Hydrogen out through the valve to the reactor. */}
      <g {...part('supply')}>
        <path className={styles.flow} d="M172 124V140H244" />
        <path d="M212 134l8 12v-12l-8 12z" />
      </g>
    </>
  );
}

const hydrogenGenerator = {
  Drawing,
  parts: [
    { part: 'fill', test: /fill|water/ },
    { part: 'electrolyse', test: /electroly|split/ },
    { part: 'purify', test: /purif|dry/ },
    { part: 'pressurise', test: /pressur/ },
    { part: 'supply', test: /supply|deliver|feed/ },
  ],
  tags: {
    fill: { at: [76, 6], align: 'center' },
    electrolyse: { at: [85, 184], align: 'center' },
    purify: { at: [133, 184], align: 'center' },
    pressurise: { at: [172, 84], align: 'center' },
    supply: { at: [222, 124], align: 'center' },
  },
};

export default hydrogenGenerator;
