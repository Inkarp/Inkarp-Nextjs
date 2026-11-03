import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Upright microscope: the slide goes on the stage, light comes up from the
// base, the focus knob brings the objective into focus, the image goes up to
// the eyepieces, and the camera sends it to the screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, arm, head, nosepiece, stage and condenser. */}
      <g data-part="frame">
        <rect height="14" rx="4" width="130" x="40" y="184" />
        <rect height="98" rx="4" width="18" x="140" y="86" />
        <rect height="24" rx="4" width="88" x="70" y="62" />
        <path d="M78 86L84 96H106L112 86" />
        <rect height="6" width="88" x="52" y="128" />
        <rect height="10" rx="1" width="14" x="88" y="136" />
      </g>

      {/* The slide set down on the stage. */}
      <g {...part('mount')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="4" width="42" x="74" y="124" />
          <ellipse className={styles.liquid} cx="95" cy="126" rx="5" ry="1.2" />
        </g>
      </g>

      {/* The lamp in the base, light rising to the stage. */}
      <g {...part('illuminate')}>
        <circle cx="95" cy="191" r="3.5" />
        <path className={styles.glow} d="M84 191h-5M106 191h5" />
        <path className={styles.flow} d="M95 186V148" />
      </g>

      {/* The focus knob turning, the objective moving. */}
      <g {...part('focus')}>
        <circle cx="149" cy="150" r="9" />
        <path className={styles.whirl} d="M149 143v14M142 150h14" />
        <g className={styles.nudge}>
          <rect height="16" width="10" x="90" y="96" />
          <path d="M92 112h6v4h-6z" />
        </g>
      </g>

      {/* Binocular eyepieces, the image travelling up to them. */}
      <g {...part('observe')}>
        <g transform="rotate(-36 80 62)">
          <rect height="28" width="12" x="74" y="34" />
          <rect height="6" rx="1" width="16" x="72" y="28" />
        </g>
        <path className={styles.flow} d="M95 84V72L68 44" />
      </g>

      {/* Camera on top, sending the image to the screen. */}
      <g {...part('capture')}>
        <rect height="22" rx="2" width="22" x="112" y="40" />
        <path className={styles.flow} d="M134 50H176" />
        <rect height="44" rx="3" width="62" x="176" y="40" />
        <path d="M207 84v16M195 100h24" />
        <circle cx="207" cy="62" r="16" />
        <circle className={styles.draw} cx="201" cy="58" pathLength="100" r="4" />
        <circle className={styles.draw} cx="212" cy="67" pathLength="100" r="5" />
        <circle className={styles.blink} cx="232" cy="46" r="1.6" />
      </g>
    </>
  );
}

const microscopeUpright = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|slide|place/ },
    { part: 'illuminate', test: /illuminat|light/ },
    { part: 'focus', test: /focus/ },
    { part: 'observe', test: /observ|view/ },
    { part: 'capture', test: /captur|image|record|document/ },
  ],
  tags: {
    mount: { at: [34, 114], align: 'center' },
    illuminate: { at: [95, 214], align: 'center' },
    focus: { at: [164, 150], align: 'start' },
    observe: { at: [52, 22], align: 'center' },
    capture: { at: [207, 26], align: 'center' },
  },
};

export default microscopeUpright;
