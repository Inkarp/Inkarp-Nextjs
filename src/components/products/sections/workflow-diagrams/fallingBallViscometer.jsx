import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Falling-ball viscometer: the glass tube is filled with sample, the water
// jacket brings it to temperature, the ball is dropped, its fall between the
// two ring marks is timed, and the viscosity is calculated from the time.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The stand and the thermostat box. */}
      <g data-part="frame">
        <rect height="10" rx="3" width="120" x="60" y="186" />
        <path d="M120 176v10" />
        <rect height="120" rx="4" width="44" x="20" y="50" />
      </g>

      {/* The tube, filled with the sample from the pipette. */}
      <g {...part('fill')}>
        <path d="M114 44V172M126 44V172" />
        <path className={styles.liquid} d="M115 56h10v116h-10z" />
        <path d="M120 20v14M116 12h8v8h-8z" />
      </g>

      {/* The water jacket held at temperature by the thermostat. */}
      <g {...part('set')}>
        <rect height="136" rx="6" width="32" x="104" y="40" />
        <path className={styles.flow} d="M64 60H104M104 156H64" />
        <path className={styles.blink} d="M28 64h10M42 64h10" />
      </g>

      {/* The ball released down the tube. */}
      <g {...part('drop')}>
        <circle className={styles.drop} cx="120" cy="62" r="4" style={{ '--fall': '96px' }} />
      </g>

      {/* The ring marks and the stopwatch timing the fall between them. */}
      <g {...part('time')}>
        <path className={styles.blink} d="M108 80h24M108 140h24" />
        <circle cx="196" cy="90" r="14" />
        <path d="M196 72v4M192 72h8" />
        <path className={styles.whirl} d="M196 90V80" style={{ transformBox: 'view-box', transformOrigin: '196px 90px' }} />
      </g>

      {/* The viscosity worked out from the time. */}
      <g {...part('calculate')}>
        <rect height="56" rx="4" width="56" x="172" y="130" />
        <rect height="12" rx="1.5" width="44" x="178" y="136" />
        <path className={styles.blink} d="M182 142h10M196 142h10" />
        <path d="M180 156h0M192 156h0M204 156h0M216 156h0M180 166h0M192 166h0M204 166h0M216 166h0M180 176h0M192 176h0M204 176h0M216 176h0" strokeWidth="4" />
      </g>
    </>
  );
}

const fallingBallViscometer = {
  Drawing,
  parts: [
    { part: 'fill', test: /fill/ },
    { part: 'set', test: /set|temperat/ },
    { part: 'drop', test: /drop|release/ },
    { part: 'time', test: /time|measur/ },
    { part: 'calculate', test: /calculat|viscosit|result/ },
  ],
  tags: {
    fill: { at: [134, 20], align: 'start' },
    set: { at: [42, 36], align: 'center' },
    drop: { at: [142, 62], align: 'start' },
    time: { at: [196, 116], align: 'center' },
    calculate: { at: [200, 204], align: 'center' },
  },
};

export default fallingBallViscometer;
