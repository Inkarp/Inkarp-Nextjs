import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Coin-cell crimper: the cell's parts are stacked, set in the die, the ram
// comes down to crimp the case, the gauge shows the seal pressure, and the
// finished cell comes out.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The press: base, columns and crosshead. */}
      <g data-part="frame">
        <rect height="16" rx="3" width="120" x="50" y="180" />
        <path d="M64 180V40M156 180V40" />
        <rect height="14" rx="3" width="108" x="56" y="30" />
      </g>

      {/* The cell's parts stacked into place. */}
      <g {...part('stack')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M98 124h24v3h-24zM100 131h20v3h-20zM98 138h24v3h-24zM100 145h20v3h-20z" />
        </g>
      </g>

      {/* The die the stack is set into. */}
      <g {...part('align')}>
        <path d="M90 150h10v6h20v-6h10v30H90z" />
        <path className={styles.blink} d="M84 140l6 6M136 140l-6 6" />
      </g>

      {/* The ram and handle coming down to crimp. */}
      <g {...part('crimp')}>
        <path d="M110 30l40-16" />
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          <path d="M110 44V100M96 100h28v12H96z" />
        </g>
      </g>

      {/* The seal: the pressure gauge and the crimped edge. */}
      <g {...part('seal')}>
        <circle cx="176" cy="90" r="10" />
        <path className={styles.tilt} d="M176 90l5-6" style={{ transformBox: 'view-box', transformOrigin: '176px 90px' }} />
        <path d="M156 90h10" />
        <path className={styles.glow} d="M100 152h20" />
      </g>

      {/* The finished cell out on the tray. */}
      <g {...part('remove')}>
        <path d="M184 196h52" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M196 188v-6h24v6zM196 182a12 2 0 0 1 24 0" />
        </g>
      </g>
    </>
  );
}

const coinCellCrimper = {
  Drawing,
  parts: [
    { part: 'stack', test: /stack|assembl|component/ },
    { part: 'align', test: /align|die|place/ },
    { part: 'crimp', test: /crimp|press/ },
    { part: 'seal', test: /seal/ },
    { part: 'remove', test: /remove|eject|recover/ },
  ],
  tags: {
    stack: { at: [92, 132], align: 'end' },
    align: { at: [140, 166], align: 'start' },
    crimp: { at: [110, 18], align: 'center' },
    seal: { at: [200, 72], align: 'center' },
    remove: { at: [210, 170], align: 'center' },
  },
};

export default coinCellCrimper;
