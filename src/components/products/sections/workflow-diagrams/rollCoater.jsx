import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Roll-to-roll slot-die coater: the substrate is fed off the unwind roll, the
// slot-die coats it with ink from the pump, the dryer dries the film, the
// lamp cures it, and the coated web is wound onto the rewind roll.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Table and legs, roll stands, guide rollers and the web. */}
      <g data-part="frame">
        <rect height="8" rx="2" width="232" x="10" y="168" />
        <path d="M20 176v14M232 176v14M30 120V168M222 120V168" />
        <circle cx="64" cy="146" r="6" />
        <circle cx="196" cy="146" r="6" />
        <path d="M44 110L60 140H200L208 112" />
      </g>

      {/* The unwind roll turning, feeding the web. */}
      <g {...part('feed')}>
        <circle cx="30" cy="120" r="18" />
        <path className={styles.whirl} d="M30 106v28M16 120h28" />
        <path className={styles.flow} d="M44 110L60 140H200L208 112" />
      </g>

      {/* The pump and slot-die laying ink onto the web. */}
      <g {...part('coat')}>
        <rect height="20" rx="2" width="16" x="74" y="70" />
        <path d="M82 90v18" />
        <rect height="24" rx="2" width="20" x="72" y="108" />
        <path className={styles.flow} d="M82 92V136" />
        <path d="M86 138H108" style={{ strokeWidth: 3 }} />
      </g>

      {/* The dryer over the web, solvent leaving the film. */}
      <g {...part('dry')}>
        <rect height="22" rx="3" width="52" x="108" y="112" />
        <path className={styles.heat} d="M120 134q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M134 134q-2-3 0-6t0-6" />
        <path className={styles.heat} d="M148 134q-2-3 0-6t0-6" />
      </g>

      {/* The curing lamp. */}
      <g {...part('cure')}>
        <rect height="12" rx="2" width="24" x="166" y="104" />
        <path className={styles.glow} d="M172 118l-2 14M178 118v14M184 118l2 14" />
      </g>

      {/* The rewind roll winding up the coated web. */}
      <g {...part('wind')}>
        <circle cx="222" cy="120" r="18" />
        <circle cx="222" cy="120" r="11" />
        <path className={styles.whirl} d="M222 106v28M208 120h28" />
      </g>
    </>
  );
}

const rollCoater = {
  Drawing,
  parts: [
    { part: 'feed', test: /feed|unwind/ },
    { part: 'coat', test: /coat|print|deposit/ },
    { part: 'dry', test: /dry|anneal/ },
    { part: 'cure', test: /cure|uv/ },
    { part: 'wind', test: /wind|collect/ },
  ],
  tags: {
    feed: { at: [30, 90], align: 'center' },
    coat: { at: [82, 56], align: 'center' },
    dry: { at: [134, 100], align: 'center' },
    cure: { at: [178, 90], align: 'center' },
    wind: { at: [222, 90], align: 'center' },
  },
};

export default rollCoater;
