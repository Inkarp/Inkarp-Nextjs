import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Sheet-based slot-die coater: the substrate is laid on the vacuum chuck, the
// slot-die head travels across laying the film, the heated chuck dries it,
// the lamp cures it, and the coated sheet is lifted off onto the cart.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Table and legs, the chuck, the gantry and the cart. */}
      <g data-part="frame">
        <rect height="20" rx="3" width="200" x="20" y="150" />
        <path d="M30 170v12M210 170v12" />
        <rect height="8" width="140" x="50" y="142" />
        <path d="M40 150V60M200 150V60M40 60H200" />
        <rect height="20" rx="2" width="26" x="224" y="150" />
        <path d="M228 170v6M246 170v6" />
      </g>

      {/* The substrate laid on the chuck. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="6" width="112" x="64" y="136" />
        </g>
      </g>

      {/* The slot-die head travelling across, laying ink. */}
      <g {...part('coat')}>
        <g className={styles.sweep}>
          <rect height="28" rx="2" width="24" x="100" y="64" />
          <path d="M108 92h8v6h-8z" />
          <path className={styles.flow} d="M112 98V134" />
        </g>
      </g>

      {/* The heated chuck drying the film. */}
      <g {...part('dry')}>
        <path className={styles.glow} d="M54 146h132" />
        <path className={styles.heat} d="M80 132q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M144 132q-2-3 0-6t0-6" />
      </g>

      {/* The curing lamp on the gantry. */}
      <g {...part('cure')}>
        <rect height="12" rx="2" width="36" x="150" y="64" />
        <path className={styles.glow} d="M156 78l-3 12M168 78v12M180 78l3 12" />
      </g>

      {/* The coated sheet lifted onto the cart. */}
      <g {...part('unload')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="6" width="24" x="225" y="144" />
          <path d="M228 144h18" style={{ strokeWidth: 2.5 }} />
        </g>
      </g>
    </>
  );
}

const sheetCoater = {
  Drawing,
  // "Unload" is checked before "load".
  parts: [
    { part: 'unload', test: /unload|remove/ },
    { part: 'load', test: /load|substrate|place/ },
    { part: 'coat', test: /coat|print|deposit/ },
    { part: 'dry', test: /dry|anneal/ },
    { part: 'cure', test: /cure|uv/ },
  ],
  tags: {
    load: { at: [120, 196], align: 'center' },
    coat: { at: [112, 46], align: 'center' },
    dry: { at: [-6, 128], align: 'start' },
    cure: { at: [168, 46], align: 'center' },
    unload: { at: [234, 128], align: 'center' },
  },
};

export default sheetCoater;
