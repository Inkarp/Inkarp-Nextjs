import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Freeze dryer: the vials freeze on the shelves, the pump pulls a vacuum, the
// ice sublimes across to the condenser (primary drying), the shelves warm to
// drive off the last moisture (secondary drying), and the stoppered vials
// come out.
const SHELVES = [80, 112, 144];
const VIALS = [44, 60, 76, 92];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Cabinet, feet, the product chamber and its shelves, the condenser
          chamber. */}
      <g data-part="frame">
        <rect height="156" rx="6" width="150" x="20" y="40" />
        <path d="M34 196v5M156 196v5" />
        <rect height="98" rx="3" width="80" x="30" y="52" />
        <path d={SHELVES.map((y) => `M34 ${y}h72`).join('')} />
        <rect height="98" rx="3" width="40" x="120" y="52" />
      </g>

      {/* The vials frozen on the shelves. */}
      <g {...part('freeze')}>
        {SHELVES.map((y) =>
          VIALS.map((x) => (
            <g key={`${x}-${y}`}>
              <path d={`M${x} ${y}v-14h8v14`} />
              <path className={styles.liquid} d={`M${x} ${y - 6}h8v6h-8z`} />
            </g>
          ))
        )}
        <path className={styles.blink} d="M38 60l4 4M42 60l-4 4M100 92l4 4M104 92l-4 4" />
      </g>

      {/* The vacuum pump, its line and the gauge. */}
      <g {...part('evacuate')}>
        <rect height="30" rx="3" width="40" x="120" y="160" />
        <path className={styles.flow} d="M140 160V150" />
        <circle cx="60" cy="172" r="10" />
        <path className={styles.tilt} d="M60 172l5-6" style={{ transformBox: 'view-box', transformOrigin: '60px 172px' }} />
      </g>

      {/* Ice subliming across to the condenser's frozen coil. */}
      <g {...part('primary')}>
        <path className={styles.vapour} d="M106 100H124" />
        <path className={styles.coil} d="M128 62l24 10-24 10 24 10-24 10 24 10-24 10 24 10" />
      </g>

      {/* The shelves warming to drive off the last moisture. */}
      <g {...part('secondary')}>
        <path className={styles.glow} d={SHELVES.map((y) => `M34 ${y + 2}h72`).join('')} />
        <path className={styles.heat} d="M52 76q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M84 108q-2-3 0-6t0-6" />
      </g>

      {/* A stoppered, dried vial taken out to the tray. */}
      <g {...part('recover')}>
        <path d="M184 196h52" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M204 196v-26h12v26M202 170h16v-6h-16z" />
          <path className={styles.liquid} d="M204 188h12v8h-12z" />
        </g>
      </g>
    </>
  );
}

const freezeDryer = {
  Drawing,
  parts: [
    { part: 'freeze', test: /freez/ },
    { part: 'evacuate', test: /evacuat|vacuum/ },
    { part: 'primary', test: /primary|sublimat/ },
    { part: 'secondary', test: /secondary|desorp/ },
    { part: 'recover', test: /recover|unload|stopper/ },
  ],
  tags: {
    freeze: { at: [70, 28], align: 'center' },
    evacuate: { at: [140, 208], align: 'center' },
    primary: { at: [140, 28], align: 'center' },
    secondary: { at: [70, 208], align: 'center' },
    recover: { at: [210, 150], align: 'center' },
  },
};

export default freezeDryer;
