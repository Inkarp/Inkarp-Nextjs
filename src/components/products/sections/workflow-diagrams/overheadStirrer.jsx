import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Overhead stirrer: the drive is mounted on the stand, the vessel clamped
// under it, the speed set on the knob, the impeller stirs the liquid, and the
// torque is watched on the display.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Stand: base plate and rod. */}
      <g data-part="frame">
        <rect height="10" rx="3" width="120" x="24" y="188" />
        <path d="M46 188V26" />
      </g>

      {/* The drive clamped onto the rod. */}
      <g {...part('mount')}>
        <rect height="12" rx="2" width="12" x="40" y="52" />
        <path d="M52 58H70" />
        <rect height="50" rx="8" width="60" x="70" y="34" />
        <rect height="8" width="12" x="94" y="84" />
      </g>

      {/* The vessel of liquid held by its clamp. */}
      <g {...part('clamp')}>
        <rect height="12" rx="2" width="12" x="40" y="114" />
        <path d="M52 120H66" />
        <path d="M62 110h76M66 110v72a4 4 0 0 0 4 4h60a4 4 0 0 0 4-4v-72" />
        <path className={styles.liquid} d="M66 132h68v50a4 4 0 0 1-4 4H70a4 4 0 0 1-4-4z" />
      </g>

      {/* The speed knob. */}
      <g {...part('set')}>
        <circle cx="114" cy="72" r="6" />
        <path className={styles.whirl} d="M114 67v10M109 72h10" />
      </g>

      {/* Shaft and impeller turning, the liquid swirling. */}
      <g {...part('stir')}>
        <path d="M100 92V170" />
        <path className={styles.spinBar} d="M86 172h28" />
        <path className={styles.flow} d="M74 150q26 8 52 0" />
      </g>

      {/* The torque reading on the drive's display. */}
      <g {...part('monitor')}>
        <rect height="14" rx="2" width="40" x="78" y="42" />
        <path className={styles.draw} d="M82 52c6 0 8-5 14-5s8 2 18 2" pathLength="100" />
      </g>
    </>
  );
}

const overheadStirrer = {
  Drawing,
  // "Mount Stirrer" is checked before "stir".
  parts: [
    { part: 'mount', test: /mount|attach/ },
    { part: 'clamp', test: /clamp|vessel|place/ },
    { part: 'set', test: /set|speed/ },
    { part: 'monitor', test: /monitor|torque|record/ },
    { part: 'stir', test: /stir|mix/ },
  ],
  tags: {
    mount: { at: [100, 20], align: 'center' },
    clamp: { at: [144, 120], align: 'start' },
    set: { at: [140, 72], align: 'start' },
    stir: { at: [144, 164], align: 'start' },
    monitor: { at: [140, 46], align: 'start' },
  },
};

export default overheadStirrer;
