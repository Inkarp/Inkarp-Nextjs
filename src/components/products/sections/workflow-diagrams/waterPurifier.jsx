import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Lab water purification system: tap water is fed in, pre-treated in the
// first cartridge, purified through the membrane module, polished in the last
// cartridge under the UV lamp, and dispensed from the gun into a bottle.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet and its display window. */}
      <g data-part="frame">
        <rect height="156" rx="8" width="110" x="70" y="40" />
        <path d="M84 196v5M166 196v5" />
        <rect height="22" rx="2" width="52" x="84" y="52" />
      </g>

      {/* Tap water fed in from the wall. */}
      <g {...part('feed')}>
        <path d="M8 56h22v10H8zM30 61h6" />
        <path className={styles.flow} d="M36 61H52V120H70" />
      </g>

      {/* The pre-treatment cartridge. */}
      <g {...part('pretreat')}>
        <rect height="80" rx="3" width="16" x="82" y="96" />
        <path d="M86 108h0M94 116h0M86 124h0M94 132h0M86 140h0M94 148h0M86 156h0M94 164h0" strokeWidth="2.5" />
      </g>

      {/* The membrane module, water passing through it. */}
      <g {...part('purify')}>
        <rect height="80" rx="3" width="24" x="106" y="96" />
        <path d="M112 104v64M118 104v64M124 104v64" />
        <path className={styles.flow} d="M98 172h8M130 104h10" />
      </g>

      {/* The polishing cartridge, the UV lamp and the purity reading. */}
      <g {...part('polish')}>
        <rect height="80" rx="3" width="16" x="140" y="96" />
        <path className={styles.glow} d="M164 100v72" />
        <path className={styles.blink} d="M90 63h10M104 63h10M118 63h12" />
      </g>

      {/* The dispensing gun filling a bottle. */}
      <g {...part('dispense')}>
        <path className={styles.flow} d="M180 90h8" />
        <path d="M188 84h12v30l-4 8h-4l-4-8z" />
        <circle className={styles.drop} cx="194" cy="126" r="1.6" style={{ '--fall': '30px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="194" cy="126" r="1.6" style={{ '--fall': '30px' }} />
        <path d="M184 196v-30a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v30zM188 162v-6h12v6" />
        <path className={styles.liquid} d="M184 180h20v16h-20z" />
      </g>
    </>
  );
}

const waterPurifier = {
  Drawing,
  parts: [
    { part: 'feed', test: /feed|supply|inlet/ },
    { part: 'pretreat', test: /pre-?treat|filter|carbon/ },
    { part: 'purify', test: /purif|reverse|osmosis|edi\b/ },
    { part: 'polish', test: /polish|ultra|uv/ },
    { part: 'dispense', test: /dispens|deliver/ },
  ],
  tags: {
    feed: { at: [20, 44], align: 'center' },
    pretreat: { at: [90, 188], align: 'center' },
    purify: { at: [118, 188], align: 'center' },
    polish: { at: [148, 188], align: 'center' },
    dispense: { at: [210, 140], align: 'center' },
  },
};

export default waterPurifier;
