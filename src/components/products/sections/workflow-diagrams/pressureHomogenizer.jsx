import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// High-pressure homogenizer: product is fed from the hopper, the pistons
// pressurise it, it is forced through the narrow gap of the homogenizing
// valve, cooled in the heat exchanger, and collected.
const PISTONS = [50, 70, 90];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The machine body and feet. */}
      <g data-part="frame">
        <rect height="106" rx="6" width="120" x="30" y="90" />
        <path d="M44 196v5M136 196v5" />
      </g>

      {/* Product in the hopper, flowing into the pump. */}
      <g {...part('feed')}>
        <path d="M60 50h40l-12 24v16h-16v-16z" />
        <path className={styles.liquid} d="M64 54h32l-8 16H72z" />
        <path className={styles.flow} d="M80 90V112" />
      </g>

      {/* The pistons driving, the pressure gauge. */}
      <g {...part('pressurise')}>
        {PISTONS.map((x, i) => (
          <g className={styles.nudge} key={x} style={{ animationDelay: `${i * -0.8}s` }}>
            <rect height="30" rx="1.5" width="12" x={x} y="120" />
          </g>
        ))}
        <circle cx="128" cy="112" r="10" />
        <path className={styles.tilt} d="M128 112l5-6" style={{ transformBox: 'view-box', transformOrigin: '128px 112px' }} />
      </g>

      {/* The homogenizing valve: product forced through its narrow gap. */}
      <g {...part('shear')}>
        <rect height="20" rx="2" width="26" x="150" y="120" />
        <path className={styles.flow} d="M150 130H176" style={{ strokeWidth: 3 }} />
        <path className={styles.glow} d="M163 116v-4M163 144v4" />
      </g>

      {/* The heat exchanger coil cooling it. */}
      <g {...part('cool')}>
        <path d="M176 130H186" />
        <rect height="80" rx="4" width="28" x="186" y="60" />
        <path className={styles.coil} d="M190 68l20 8-20 8 20 8-20 8 20 8-20 8 20 8" />
      </g>

      {/* Collected in the beaker. */}
      <g {...part('collect')}>
        <path d="M200 140v12" />
        <circle className={styles.drop} cx="200" cy="154" r="1.6" style={{ '--fall': '20px' }} />
        <path d="M184 166h32M186 166v26a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4v-26" />
        <path className={styles.liquid} d="M186 180h28v12a4 4 0 0 1-4 4h-20a4 4 0 0 1-4-4z" />
      </g>
    </>
  );
}

const pressureHomogenizer = {
  Drawing,
  parts: [
    { part: 'feed', test: /feed|load/ },
    { part: 'pressurise', test: /pressur|pump/ },
    { part: 'shear', test: /shear|valve|homogen/ },
    { part: 'cool', test: /cool|exchang/ },
    { part: 'collect', test: /collect|discharg|recover/ },
  ],
  tags: {
    feed: { at: [80, 36], align: 'center' },
    pressurise: { at: [76, 210], align: 'center' },
    shear: { at: [163, 156], align: 'center' },
    cool: { at: [200, 44], align: 'center' },
    collect: { at: [200, 212], align: 'center' },
  },
};

export default pressureHomogenizer;
