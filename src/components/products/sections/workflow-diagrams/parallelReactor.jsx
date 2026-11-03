import styles from '../WorkflowDiagram.module.css';
import { HotplateBase } from './benchHotplate';
import { partOf } from './part';

// Parallel reaction station: reaction tubes in a block on a stirring hotplate.
// Each tube is charged by syringe, the head seals them, the bars stir, the
// block heats or cools, the reactions bubble, and a product vial comes out.
const TUBES = [76, 98, 120, 142, 164];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <HotplateBase heat="heat" part={part} stir="stir" />

      {/* The block and its tubes of liquid. */}
      <g data-part="frame">
        <rect height="42" rx="4" width="120" x="60" y="120" />
        {TUBES.map((x) => (
          <g key={x}>
            <path d={`M${x - 5} 96v54a5 5 0 0 0 10 0V96`} />
            <path className={styles.liquid} d={`M${x - 5} 138h10v12a5 5 0 0 1-10 0z`} />
          </g>
        ))}
      </g>

      {/* Reagent added by syringe through the head. */}
      <g {...part('charge')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="30" rx="1.5" width="8" x="72" y="34" />
          <path d="M76 24v10M70 24h12M76 64v18" />
        </g>
      </g>

      {/* The head sealing every tube. */}
      <g {...part('seal')}>
        <rect height="10" rx="2" width="112" x="64" y="86" />
        <path d={TUBES.map((x) => `M${x - 5} 86v-5h10v5`).join('')} />
      </g>

      {/* A stir bar spinning in each tube. */}
      <g {...part('stir')}>
        {TUBES.map((x) => (
          <rect className={styles.spinBar} height="3" key={x} rx="1.5" width="7" x={x - 3.5} y="150" />
        ))}
      </g>

      {/* The reactions bubbling. */}
      <g {...part('react')}>
        {TUBES.map((x, i) => (
          <circle className={i % 2 ? `${styles.rise} ${styles.later}` : styles.rise} cx={x} cy="146" key={x} r="1.4" />
        ))}
      </g>

      {/* A product vial taken out to the rack. */}
      <g {...part('discharge')}>
        <path d="M206 172h34M209 172v26M237 172v26" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M219 146v20a4 4 0 0 0 8 0v-20M218 146h10" />
          <path className={styles.liquid} d="M219 156h8v10a4 4 0 0 1-8 0z" />
        </g>
      </g>
    </>
  );
}

const parallelReactor = {
  Drawing,
  // "Discharge" is checked before "charge".
  parts: [
    { part: 'discharge', test: /discharg|recover|collect/ },
    { part: 'charge', test: /charge|add|fill/ },
    { part: 'seal', test: /seal|close|cap/ },
    { part: 'stir', test: /stir|mix/ },
    { part: 'heat', test: /heat|cool|temperat/ },
    { part: 'react', test: /react|reflux/ },
  ],
  tags: {
    charge: { at: [64, 30], align: 'end' },
    seal: { at: [184, 90], align: 'start' },
    stir: { at: [136, 216], align: 'center' },
    heat: { at: [172, 216], align: 'center' },
    react: { at: [120, 70], align: 'center' },
    discharge: { at: [223, 132], align: 'center' },
  },
};

export default parallelReactor;
