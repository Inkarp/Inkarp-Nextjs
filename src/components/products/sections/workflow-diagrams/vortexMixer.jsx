import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Vortex mixer: the tube is pressed onto the cup, the speed is set, the cup
// circles fast, the liquid in the tube spins into a vortex and mixes, and the
// tube goes back in the rack.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The rounded body and its feet. */}
      <g data-part="frame">
        <path d="M60 196V150q0-20 20-24h80q20 4 20 24v46z" />
        <path d="M72 196v5M168 196v5" />
      </g>

      {/* The cup head circling. */}
      <g {...part('vortex')}>
        <g className={styles.orbit}>
          <path d="M104 126v-8q16-8 32 0v8" />
        </g>
        <path className={styles.turn} d="M96 128q24 10 48 0" />
      </g>

      {/* The tube pressed onto the cup, with its liquid spinning into a vortex. */}
      <g {...part('load')}>
        <g className={styles.nudge}>
          <path d="M114 50v58a6 6 0 0 0 12 0V50M112 50h16" />
          <path className={styles.liquid} d="M114 84Q120 100 126 84v24a6 6 0 0 1-12 0z" />
          <g {...part('mix')}>
            <path d="M114 84Q120 100 126 84" />
            <path className={styles.flow} d="M116 104q4 3 8 0M116 96q4 3 8 0" />
          </g>
        </g>
      </g>

      {/* The speed knob. */}
      <g {...part('set')}>
        <circle cx="86" cy="168" r="8" />
        <path className={styles.whirl} d="M86 162v12M80 168h12" />
      </g>

      {/* The mixed tube back in the rack. */}
      <g {...part('unload')}>
        <path d="M200 172h36M203 172v24M233 172v24" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M214 140v26a4 4 0 0 0 8 0v-26M213 140h10" />
          <path className={styles.liquid} d="M214 154h8v12a4 4 0 0 1-8 0z" />
        </g>
      </g>
    </>
  );
}

const vortexMixer = {
  Drawing,
  // "Unload" is checked before "load".
  parts: [
    { part: 'unload', test: /unload|remove/ },
    { part: 'vortex', test: /vortex|shake/ },
    { part: 'mix', test: /mix|homogen/ },
    { part: 'set', test: /set|speed/ },
    { part: 'load', test: /load|tube|sample/ },
  ],
  tags: {
    load: { at: [120, 36], align: 'center' },
    set: { at: [86, 214], align: 'center' },
    vortex: { at: [152, 116], align: 'start' },
    mix: { at: [134, 92], align: 'start' },
    unload: { at: [218, 126], align: 'center' },
  },
};

export default vortexMixer;
