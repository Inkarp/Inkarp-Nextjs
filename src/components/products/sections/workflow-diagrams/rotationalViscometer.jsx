import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Rotational viscometer / rheometer on its stand: the sample beaker is raised
// round the spindle, the bath brings it to temperature, the spindle turns,
// the head reads the viscosity, and the curve is reported on screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Stand base and rod, the clamp arm, the head and its coupling. */}
      <g data-part="frame">
        <rect height="8" rx="3" width="120" x="24" y="196" />
        <path d="M128 196V24M128 60H110" />
        <rect height="62" rx="6" width="60" x="50" y="34" />
        <rect height="20" rx="2" width="44" x="58" y="44" />
        <path d="M77 96h6v6h-6z" />
      </g>

      {/* The sample beaker raised into place. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '14px' }}>
          <path d="M58 136h44M60 136v54a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4v-54" />
          <path className={styles.liquid} d="M60 146h40v44a4 4 0 0 1-4 4H64a4 4 0 0 1-4-4z" />
        </g>
      </g>

      {/* The bath and the circulator holding the temperature. */}
      <g {...part('set')}>
        <rect height="68" rx="4" width="68" x="46" y="128" />
        <path className={styles.flow} d="M114 150H160M160 180H114" />
        <rect height="66" rx="4" width="60" x="160" y="130" />
        <path className={styles.blink} d="M170 146h12M186 146h12" />
      </g>

      {/* The spindle turning in the sample. */}
      <g {...part('rotate')}>
        <path d="M80 102V170" />
        <rect className={styles.spinBar} height="14" rx="2" width="12" x="74" y="170" />
        <path className={styles.turn} d="M68 156q12 6 24 0" />
      </g>

      {/* The viscosity reading on the head's display. */}
      <g {...part('measure')}>
        <path className={styles.blink} d="M64 54h10M78 54h10M92 54h4" />
      </g>

      {/* The curve on screen. */}
      <g {...part('report')}>
        <path className={styles.flow} d="M110 40H156" />
        <rect height="52" rx="3" width="80" x="156" y="24" />
        <path className={styles.draw} d="M162 68c12-2 20-8 28-18s18-16 40-18" pathLength="100" />
      </g>
    </>
  );
}

const rotationalViscometer = {
  Drawing,
  parts: [
    { part: 'load', test: /load|sample|fill/ },
    { part: 'set', test: /set|temperat/ },
    { part: 'rotate', test: /rotat|spindle|spin/ },
    { part: 'measure', test: /measur|viscosit|read/ },
    { part: 'report', test: /report|print|result/ },
  ],
  tags: {
    load: { at: [80, 216], align: 'center' },
    set: { at: [190, 116], align: 'center' },
    rotate: { at: [22, 150], align: 'center' },
    measure: { at: [80, 22], align: 'center' },
    report: { at: [196, 12], align: 'center' },
  },
};

export default rotationalViscometer;
