import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Digital microscope (no eyepieces): the sample goes on the motorized stage,
// the ring light lights it, the motorized zoom optics focus, the live image
// is watched on the screen, and a snapshot is captured.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, column, the zoom/camera head and the stage. */}
      <g data-part="frame">
        <rect height="14" rx="4" width="120" x="30" y="184" />
        <rect height="144" rx="3" width="14" x="120" y="40" />
        <rect height="60" rx="6" width="50" x="70" y="50" />
        <path d="M78 62h34" />
        <rect height="6" width="80" x="50" y="166" />
      </g>

      {/* The sample set on the stage. */}
      <g {...part('mount')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M80 166v-6q0-4 4-4h22q4 0 4 4v6z" />
          <path className={styles.liquid} d="M84 160h22v6H84z" />
        </g>
      </g>

      {/* The ring light round the objective. */}
      <g {...part('illuminate')}>
        <ellipse cx="95" cy="128" rx="20" ry="4" />
        <path className={styles.glow} d="M82 134l-4 12M95 135v13M108 134l4 12" />
      </g>

      {/* The motorized zoom optics finding focus. */}
      <g {...part('focus')}>
        <g className={styles.nudge}>
          <rect height="14" width="26" x="82" y="110" />
        </g>
        <path className={styles.blink} d="M64 74v20M61 77l3-3 3 3M61 91l3 3 3-3" />
      </g>

      {/* The live image on the screen. */}
      <g {...part('observe')}>
        <path className={styles.flow} d="M120 70H160" />
        <rect height="70" rx="3" width="84" x="160" y="40" />
        <path d="M202 110v8M190 118h24" />
        <circle cx="202" cy="75" r="20" />
        <path d="M194 80q0-12 8-12t8 12z" />
        <path className={styles.blink} d="M202 60v6M202 84v6M187 75h6M211 75h6" />
      </g>

      {/* A snapshot captured and saved. */}
      <g {...part('capture')}>
        <path className={styles.glow} d="M95 44v-6M83 46l-4-4M107 46l4-4" />
        <g className={styles.feed}>
          <path d="M196 124h40v28h-40z" />
          <path d="M202 146q8-14 14-6t14-4" />
        </g>
      </g>
    </>
  );
}

const digitalMicroscope = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|slide|place/ },
    { part: 'illuminate', test: /illuminat|light/ },
    { part: 'focus', test: /focus|zoom/ },
    { part: 'observe', test: /observ|view/ },
    { part: 'capture', test: /captur|image|record|document/ },
  ],
  tags: {
    mount: { at: [40, 150], align: 'center' },
    illuminate: { at: [52, 128], align: 'end' },
    focus: { at: [56, 64], align: 'end' },
    observe: { at: [202, 26], align: 'center' },
    capture: { at: [216, 166], align: 'center' },
  },
};

export default digitalMicroscope;
