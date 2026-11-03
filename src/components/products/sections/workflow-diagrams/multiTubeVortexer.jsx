import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Multi-tube vortexer: a rack of tubes is loaded onto the platform, the
// speed is set, the platform vortexes, the liquid in every tube spins up and
// mixes, and the tubes go back to the rack.
const TUBES = [62, 82, 102, 122, 142, 162];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The base, feet and display window. */}
      <g data-part="frame">
        <rect height="46" rx="8" width="160" x="40" y="150" />
        <path d="M54 196v5M186 196v5" />
        <rect height="16" rx="2" width="44" x="56" y="164" />
      </g>

      {/* The platform and its rack of tubes, circling fast. */}
      <g className={styles.orbit}>
        <g {...part('vortex')}>
          <rect height="10" rx="2" width="140" x="50" y="132" />
          <path d="M120 142v8" />
        </g>
        <g {...part('load')}>
          <g className={styles.lower} style={{ '--lower': '-14px' }}>
            {TUBES.map((x) => (
              <g key={x}>
                <path d={`M${x} 90v36a5 5 0 0 0 10 0V90M${x - 1} 90h12`} />
                <path className={styles.liquid} d={`M${x} 112q5 8 10 0v14a5 5 0 0 1-10 0z`} />
              </g>
            ))}
            <g {...part('mix')}>
              <path className={styles.flow} d={TUBES.map((x) => `M${x + 1} 122q4 3 8 0`).join('')} />
            </g>
          </g>
        </g>
      </g>

      {/* The speed knob. */}
      <g {...part('set')}>
        <circle cx="176" cy="172" r="8" />
        <path className={styles.whirl} d="M176 166v12M170 172h12" />
        <path className={styles.blink} d="M62 172h10M76 172h10M90 172h6" />
      </g>

      {/* A mixed tube back in the side rack. */}
      <g {...part('unload')}>
        <path d="M206 172h34M209 172v24M237 172v24" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M218 140v26a5 5 0 0 0 10 0v-26M217 140h12" />
          <path className={styles.liquid} d="M218 154h10v12a5 5 0 0 1-10 0z" />
        </g>
      </g>
    </>
  );
}

const multiTubeVortexer = {
  Drawing,
  // "Unload" is checked before "load".
  parts: [
    { part: 'unload', test: /unload|remove/ },
    { part: 'vortex', test: /vortex|shake/ },
    { part: 'mix', test: /mix/ },
    { part: 'set', test: /set|speed/ },
    { part: 'load', test: /load|tube|sample/ },
  ],
  tags: {
    load: { at: [120, 74], align: 'center' },
    set: { at: [176, 210], align: 'center' },
    vortex: { at: [-6, 137], align: 'start' },
    mix: { at: [120, 74], align: 'center' },
    unload: { at: [223, 124], align: 'center' },
  },
};

export default multiTubeVortexer;
