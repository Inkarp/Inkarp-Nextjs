import styles from '../WorkflowDiagram.module.css';
import { HotplateBase } from './benchHotplate';
import { partOf } from './part';

// Heating block on a hotplate: the block is fitted on the plate, the flask
// set into it, the plate heats, the probe holds the temperature, and the
// block gives off its heat as it cools.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <HotplateBase heat="heat" part={part} />

      {/* The block, set down on the plate. */}
      <g {...part('fit')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M78 162V134q0-4 4-4h76q4 0 4 4v28M98 130a22 22 0 0 0 44 0" />
        </g>
      </g>

      {/* The round-bottom flask seated in the block. */}
      <g {...part('insert')}>
        <g className={styles.lower} style={{ '--lower': '-16px' }}>
          <path d="M115 88V112.6A20 20 0 1 0 125 112.6V88" />
          <path className={styles.liquid} d="M100.9 138H139.1A20 20 0 0 1 100.9 138Z" />
        </g>
      </g>

      {/* The probe in the block and its reading. */}
      <g {...part('hold')}>
        <path d="M150 96h8v8h-8zM154 104v36" />
        <path className={styles.blink} d="M62 183h10M76 183h10M90 183h6" />
      </g>

      {/* Heat leaving the block as it cools. */}
      <g {...part('cool')}>
        <path className={styles.heat} d="M86 126q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M94 126q-2-3 0-6t0-6" />
        <path className={styles.heat} d="M162 126q-2-3 0-6t0-6" />
      </g>
    </>
  );
}

const heatBlock = {
  Drawing,
  // "Fit Block to Hotplate" is checked before "heat".
  parts: [
    { part: 'fit', test: /fit|block/ },
    { part: 'insert', test: /insert|flask|place/ },
    { part: 'hold', test: /hold|maintain|temperat/ },
    { part: 'cool', test: /cool/ },
    { part: 'heat', test: /heat|warm/ },
  ],
  tags: {
    fit: { at: [168, 140], align: 'start' },
    insert: { at: [120, 76], align: 'center' },
    heat: { at: [172, 216], align: 'center' },
    hold: { at: [162, 92], align: 'start' },
    cool: { at: [60, 112], align: 'center' },
  },
};

export default heatBlock;
