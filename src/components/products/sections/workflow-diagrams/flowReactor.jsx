import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Continuous-flow reactor: the pump is primed with solvent, pressure and
// temperature are set, the reagents are pumped into the reactor cartridge,
// the reaction runs in the heated (or lit) cartridge, and the product is
// collected at the outlet.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body and feet. */}
      <g data-part="frame">
        <rect height="136" rx="6" width="120" x="70" y="60" />
        <path d="M84 196v5M176 196v5" />
      </g>

      {/* Solvent drawn from the bottle to prime the pump. */}
      <g {...part('prime')}>
        <path d="M14 196v-46a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v46zM24 144v-6h10v6" />
        <path className={styles.liquid} d="M14 166h30v30H14z" />
        <path className={styles.flow} d="M29 188V124H96V160" />
        <circle cx="96" cy="170" r="10" />
      </g>

      {/* Pressure and temperature set on the display, the gauge needle. */}
      <g {...part('set')}>
        <rect height="26" rx="2" width="52" x="84" y="74" />
        <path className={styles.blink} d="M90 87h10M104 87h10M118 87h10" />
        <circle cx="164" cy="87" r="12" />
        <path className={styles.tilt} d="M164 87l6-8" style={{ transformBox: 'view-box', transformOrigin: '164px 87px' }} />
      </g>

      {/* The reagents pumped into the cartridge. */}
      <g {...part('flow')}>
        <path className={styles.flow} d="M106 170H130V160" />
      </g>

      {/* The reaction running in the heated cartridge. */}
      <g {...part('react')}>
        <rect height="50" rx="3" width="20" x="120" y="110" />
        <path className={styles.glow} d="M114 118v34M146 118v34" />
        <circle className={styles.rise} cx="126" cy="150" r="1.4" />
        <circle className={`${styles.rise} ${styles.later}`} cx="134" cy="142" r="1.4" />
      </g>

      {/* Product out to the collection flask. */}
      <g {...part('collect')}>
        <path className={styles.flow} d="M130 110V104H200V150" />
        <path d="M195 158h10M197 158v8l-10 26a2 2 0 0 0 2 3h22a2 2 0 0 0 2-3l-10-26v-8" />
        <path className={styles.liquid} d="M191 184h18l4 8a2 2 0 0 1-2 3h-22a2 2 0 0 1-2-3z" />
        <circle className={styles.drop} cx="200" cy="153" r="1.4" style={{ '--fall': '26px' }} />
      </g>
    </>
  );
}

const flowReactor = {
  Drawing,
  parts: [
    { part: 'prime', test: /prime|purge/ },
    { part: 'set', test: /set|pressure|temperat/ },
    { part: 'flow', test: /flow|pump|reagent|feed/ },
    { part: 'react', test: /react|hydrogenat|irradiat/ },
    { part: 'collect', test: /collect|product/ },
  ],
  tags: {
    prime: { at: [29, 112], align: 'center' },
    set: { at: [110, 48], align: 'center' },
    flow: { at: [118, 214], align: 'center' },
    react: { at: [150, 136], align: 'start' },
    collect: { at: [214, 128], align: 'center' },
  },
};

export default flowReactor;
