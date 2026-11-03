import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Jacketed lab reactor: reagents are charged through the funnel, the lid is
// clamped shut, the overhead stirrer turns the impeller, the circulator heats
// or cools the jacket, the reaction bubbles under the temperature probe, and
// the product is drained from the bottom valve.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Stand rod and base, the vessel's clamp, the inner vessel and its
          contents, and the circulator. */}
      <g data-part="frame">
        <path d="M44 230V30M24 230h50" />
        <rect height="8" width="8" x="40" y="116" />
        <path d="M48 120H80" />
        <path d="M88 86v62a32 22 0 0 0 64 0v-62" />
        <path className={styles.liquid} d="M88 112h64v36a32 22 0 0 1-64 0z" />
        <rect height="80" rx="4" width="46" x="190" y="92" />
        <rect height="14" rx="2" width="30" x="198" y="102" />
      </g>

      {/* Reagent charged through the addition funnel. */}
      <g {...part('charge')}>
        <path d="M86 50h20l-7 12v16h-6v-16z" />
        <circle className={styles.drop} cx="96" cy="84" r="1.6" style={{ '--fall': '24px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="96" cy="84" r="1.6" style={{ '--fall': '24px' }} />
      </g>

      {/* The lid, clamped shut. */}
      <g {...part('seal')}>
        <rect height="8" width="80" x="80" y="78" />
        <path className={styles.press} d="M77 74v16M163 74v16" />
      </g>

      {/* Overhead drive, shaft and impeller, the liquid swirling. */}
      <g {...part('stir')}>
        <rect height="30" rx="4" width="28" x="106" y="8" />
        <path d="M120 38V156" />
        <path className={styles.spinBar} d="M106 156h28" />
        <path className={styles.flow} d="M96 136q24 8 48 0" />
      </g>

      {/* The jacket and the circulator's hoses, heating or cooling. */}
      <g {...part('heat')}>
        <path d="M80 92v58a40 28 0 0 0 80 0v-58" />
        <path className={styles.flow} d="M160 100H190" />
        <path className={styles.flow} d="M190 160H158" />
        <path className={styles.blink} d="M203 109h8M215 109h8" />
      </g>

      {/* The reaction bubbling, watched by the temperature probe. */}
      <g {...part('react')}>
        <path d="M142 52h8v8h-8zM146 60v84" />
        <circle className={styles.rise} cx="104" cy="148" r="1.6" />
        <circle className={`${styles.rise} ${styles.later}`} cx="118" cy="152" r="1.6" />
        <circle className={styles.rise} cx="134" cy="146" r="1.6" />
      </g>

      {/* Product drained from the bottom valve into the receiver. */}
      <g {...part('discharge')}>
        <path d="M120 170V196" />
        <rect height="6" width="12" x="114" y="184" />
        <path d="M126 187h8" />
        <circle className={styles.drop} cx="120" cy="199" r="1.6" style={{ '--fall': '14px' }} />
        <path d="M102 206h36M105 206v20a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4v-20" />
        <path className={styles.liquid} d="M105 218h30v8a4 4 0 0 1-4 4h-22a4 4 0 0 1-4-4z" />
      </g>
    </>
  );
}

const jacketedReactor = {
  Drawing,
  // "Discharge" is checked before "charge".
  parts: [
    { part: 'discharge', test: /discharg|drain|empty/ },
    { part: 'charge', test: /charge|add|fill/ },
    { part: 'seal', test: /seal|close|cap/ },
    { part: 'stir', test: /stir|mix/ },
    { part: 'heat', test: /heat|cool|temperat/ },
    { part: 'react', test: /react|reflux/ },
  ],
  tags: {
    charge: { at: [80, 46], align: 'end' },
    seal: { at: [166, 72], align: 'start' },
    stir: { at: [140, 22], align: 'start' },
    heat: { at: [213, 82], align: 'center' },
    react: { at: [76, 140], align: 'end' },
    discharge: { at: [146, 218], align: 'start' },
  },
};

export default jacketedReactor;
