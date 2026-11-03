import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Vacuum pump with controller: the hose is connected to the flask, the target
// vacuum is set, the pump draws the air out through the hose, the valve holds
// the vacuum, and the vent lets air back in at the end.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The flask on its cork ring, and the pump body with its two heads. */}
      <g data-part="frame">
        <path d="M46 104V124.3A24 24 0 1 0 54 124.3V104" />
        <path className={styles.liquid} d="M27.4 156H72.6A24 24 0 0 1 27.4 156Z" />
        <ellipse cx="50" cy="174" rx="14" ry="3" />
        <rect height="56" rx="8" width="96" x="124" y="140" />
        <path d="M136 196v5M208 196v5" />
        <path d="M136 140v-8a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v8M176 140v-8a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v8" />
      </g>

      {/* The vacuum hose from the flask to the pump. */}
      <g {...part('connect')}>
        <path d="M47 104V77H153V128M53 104V83H147V128" />
        <path d="M43 100h14M146 124h14" />
      </g>

      {/* The target vacuum set on the controller. */}
      <g {...part('set')}>
        <rect height="20" rx="2" width="50" x="136" y="154" />
        <path className={styles.blink} d="M142 164h10M156 164h10M170 164h10" />
        <circle cx="204" cy="164" r="7" />
        <path className={styles.whirl} d="M204 158v12M198 164h12" />
      </g>

      {/* Air drawn out through the hose and out of the exhaust. */}
      <g {...part('evacuate')}>
        <path className={styles.flow} d="M50 104V80H150V128" />
        <path d="M208 134h10" />
        <path className={styles.heat} d="M224 132q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M230 132q-2-3 0-6t0-6" />
      </g>

      {/* The valve holding the vacuum. */}
      <g {...part('regulate')}>
        <path className={styles.blink} d="M104 72L116 88V72L104 88Z" />
      </g>

      {/* The vent valve letting air back in. */}
      <g {...part('vent')}>
        <path d="M47 92H32" />
        <circle cx="29" cy="92" r="3" />
        <path className={styles.flow} d="M4 92H24" />
      </g>
    </>
  );
}

const vacuumPump = {
  Drawing,
  // "Set Vacuum" is checked before "evacuate" ("vacuum" is in both).
  parts: [
    { part: 'connect', test: /connect|attach|hose/ },
    { part: 'vent', test: /vent|release/ },
    { part: 'set', test: /set|target/ },
    { part: 'evacuate', test: /evacuat|pump down|vacuum/ },
    { part: 'regulate', test: /regulat|control|hold/ },
  ],
  tags: {
    connect: { at: [100, 62], align: 'center' },
    set: { at: [172, 214], align: 'center' },
    evacuate: { at: [222, 110], align: 'center' },
    regulate: { at: [110, 102], align: 'center' },
    vent: { at: [16, 76], align: 'center' },
  },
};

export default vacuumPump;
