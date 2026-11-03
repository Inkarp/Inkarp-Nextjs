import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Battery cycler: the cells are connected to the channel cabinet, the test
// protocol is set on the computer, current charges and discharges the cells,
// the channels run cycle after cycle, and the capacity curve is analysed.
const CELLS = [128, 152, 176];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The channel cabinet with its rows of modules, the cell tray, and the
          computer screen. */}
      <g data-part="frame">
        <rect height="166" rx="4" width="80" x="20" y="30" />
        <path d="M30 52h48M30 76h48M30 100h48M30 124h48M30 148h48M30 172h48" />
        <rect height="10" width="88" x="116" y="170" />
        <rect height="76" rx="3" width="114" x="132" y="20" />
        <path d="M189 96v8M177 104h24" />
      </g>

      {/* The cells clipped onto their leads. */}
      <g {...part('connect')}>
        {CELLS.map((x) => (
          <path d={`M${x - 7} 170v-36a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v36zM${x - 3} 131v-4h6v4`} key={x} />
        ))}
        <g className={styles.lower} style={{ '--lower': '-8px' }}>
          <path d="M100 110H180V122M128 110v12M152 110v12" />
        </g>
      </g>

      {/* The protocol's steps set on the computer. */}
      <g {...part('set')}>
        <path className={styles.blink} d="M140 34h28M140 44h22M140 54h28M140 64h18M140 74h24" />
      </g>

      {/* Current flowing in and out, the cells filling and emptying. */}
      <g {...part('charge')}>
        <path className={styles.flow} d="M100 110H180V122" />
        {CELLS.map((x) => (
          <path className={`${styles.liquid} ${styles.blink}`} d={`M${x - 5} 150h10v18h-10z`} key={x} />
        ))}
      </g>

      {/* Cycle after cycle: the channel lights running down the cabinet. */}
      <g {...part('cycle')}>
        <path className={styles.blink} d="M86 52h0M86 100h0M86 148h0" strokeWidth="4" />
        <path className={`${styles.blink} ${styles.later}`} d="M86 76h0M86 124h0M86 172h0" strokeWidth="4" />
        <path className={styles.turn} d="M224 150a12 12 0 1 1-4-9" />
        <path d="M219 136l1 5 5-1" />
      </g>

      {/* The capacity curve on screen. */}
      <g {...part('analyse')}>
        <path d="M182 88h58M182 88V30" />
        <path className={styles.draw} d="M184 40c14 2 26 6 36 14s14 18 18 26" pathLength="100" />
      </g>
    </>
  );
}

const batteryCycler = {
  Drawing,
  parts: [
    { part: 'connect', test: /connect|attach|mount/ },
    { part: 'set', test: /set|protocol|program/ },
    { part: 'charge', test: /charg/ },
    { part: 'cycle', test: /cycl/ },
    { part: 'analyse', test: /analy|report/ },
  ],
  tags: {
    connect: { at: [160, 196], align: 'center' },
    set: { at: [157, 10], align: 'center' },
    charge: { at: [60, 214], align: 'center' },
    cycle: { at: [224, 124], align: 'center' },
    analyse: { at: [214, 10], align: 'center' },
  },
};

export default batteryCycler;
