import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Stereo / zoom microscope: the specimen goes on the base, the ring light
// lights it from above, the focus drive moves the optics, the image goes to
// the eyepieces, and a camera sends it to the screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base with its stage plate, column, focus carrier and the zoom body. */}
      <g data-part="frame">
        <rect height="16" rx="4" width="150" x="30" y="180" />
        <ellipse cx="90" cy="180" rx="30" ry="3" />
        <rect height="140" width="12" x="150" y="40" />
        <rect height="34" rx="4" width="30" x="136" y="92" />
        <path d="M116 104H136" />
        <rect height="40" rx="6" width="50" x="66" y="84" />
      </g>

      {/* The specimen set down on the stage plate. */}
      <g {...part('mount')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M80 178v-6q0-4 4-4h14q4 0 4 4v6z" />
          <path className={styles.liquid} d="M84 172h14v6h-14z" />
        </g>
      </g>

      {/* The ring light around the objective. */}
      <g {...part('illuminate')}>
        <ellipse cx="91" cy="138" rx="20" ry="4" />
        <path className={styles.glow} d="M78 144l-4 10M91 145v11M104 144l4 10" />
      </g>

      {/* The focus knob turning, the objective moving. */}
      <g {...part('focus')}>
        <circle cx="151" cy="109" r="8" />
        <path className={styles.whirl} d="M151 103v12M145 109h12" />
        <g className={styles.nudge}>
          <rect height="10" width="30" x="76" y="124" />
        </g>
      </g>

      {/* Binocular eyepieces, the image travelling up to them. */}
      <g {...part('observe')}>
        <g transform="rotate(-30 80 84)">
          <rect height="32" width="12" x="74" y="52" />
          <rect height="6" rx="1" width="16" x="72" y="46" />
        </g>
        <path className={styles.flow} d="M91 126V94L70 64" />
      </g>

      {/* Camera on top, sending the image to the screen. */}
      <g {...part('capture')}>
        <rect height="22" rx="2" width="18" x="96" y="62" />
        <path className={styles.flow} d="M105 62V34H176" />
        <rect height="44" rx="3" width="62" x="176" y="22" />
        <path d="M207 66v12M195 78h24" />
        <circle cx="207" cy="44" r="15" />
        <path className={styles.draw} d="M199 49q0-9 8-9t8 9z" pathLength="100" />
        <circle className={styles.blink} cx="232" cy="28" r="1.6" />
      </g>
    </>
  );
}

const microscopeStereo = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|specimen|place/ },
    { part: 'illuminate', test: /illuminat|light/ },
    { part: 'focus', test: /focus|zoom/ },
    { part: 'observe', test: /observ|view/ },
    { part: 'capture', test: /captur|image|record|document/ },
  ],
  tags: {
    mount: { at: [40, 160], align: 'center' },
    illuminate: { at: [42, 140], align: 'center' },
    focus: { at: [172, 112], align: 'start' },
    observe: { at: [50, 30], align: 'center' },
    capture: { at: [207, 10], align: 'center' },
  },
};

export default microscopeStereo;
