import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Open water bath: the tank is filled, the temperature is set, the heater
// warms the water, the flasks are lowered into it on their rack, and the
// thermometer shows it held steady.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The tank, feet and front panel. */}
      <g data-part="frame">
        <rect height="86" rx="6" width="180" x="30" y="110" />
        <path d="M44 196v5M196 196v5" />
      </g>

      {/* Water poured in. */}
      <g {...part('fill')}>
        <path d="M24 72l20-8 8 16-20 8z" />
        <circle className={styles.drop} cx="40" cy="94" r="1.6" style={{ '--fall': '30px' }} />
        <path className={styles.liquid} d="M36 130h168v52H36z" />
      </g>

      {/* The temperature set on the panel. */}
      <g {...part('set')}>
        <rect height="14" rx="2" width="36" x="160" y="186" />
        <path className={styles.blink} d="M165 193h8M177 193h8M189 193h4" />
      </g>

      {/* The heater glowing, the water warming. */}
      <g {...part('heat')}>
        <path className={styles.glow} d="M44 176l6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6" />
        <path className={styles.heat} d="M60 126q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M150 126q-2-3 0-6t0-6" />
      </g>

      {/* The flasks lowered into the water on their rack. */}
      <g {...part('immerse')}>
        <g className={styles.lower} style={{ '--lower': '-16px' }}>
          <path d="M70 100h100M80 100v12M160 100v12" />
          <path d="M96 112h8M98 112v12l-10 20a2 2 0 0 0 2 3h20a2 2 0 0 0 2-3l-10-20v-12M136 112h8M138 112v12l-10 20a2 2 0 0 0 2 3h20a2 2 0 0 0 2-3l-10-20v-12" />
        </g>
      </g>

      {/* The thermometer holding steady. */}
      <g {...part('maintain')}>
        <path d="M196 80V168" />
        <circle cx="196" cy="172" r="4" />
        <circle className={styles.blink} cx="196" cy="78" r="2" />
      </g>
    </>
  );
}

const waterBath = {
  Drawing,
  parts: [
    { part: 'fill', test: /fill/ },
    { part: 'set', test: /set|temperat/ },
    { part: 'heat', test: /heat|warm/ },
    { part: 'immerse', test: /immers|sample|place|load/ },
    { part: 'maintain', test: /maintain|hold|incubat/ },
  ],
  tags: {
    fill: { at: [38, 52], align: 'center' },
    set: { at: [178, 214], align: 'center' },
    heat: { at: [100, 214], align: 'center' },
    immerse: { at: [120, 84], align: 'center' },
    maintain: { at: [196, 64], align: 'center' },
  },
};

export default waterBath;
