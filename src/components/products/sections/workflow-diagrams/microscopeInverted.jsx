import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Inverted microscope: the culture dish goes on the stage, light shines down
// from the illuminator arm, the objective underneath focuses from below, the
// image goes to the eyepieces in front, and a camera sends it to the screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, stage on its posts, the illuminator pillar and arm, nosepiece. */}
      <g data-part="frame">
        <rect height="56" rx="6" width="150" x="40" y="140" />
        <path d="M54 196v6M176 196v6" />
        <rect height="6" width="110" x="70" y="112" />
        <path d="M78 118v22M172 118v22" />
        <rect height="100" width="14" x="182" y="40" />
        <rect height="12" width="96" x="100" y="40" />
        <rect height="22" width="14" x="106" y="52" />
        <path d="M100 136h26v4h-26z" />
      </g>

      {/* The culture dish set down on the stage. */}
      <g {...part('mount')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M92 112v-8h40v8" />
          <path className={styles.liquid} d="M94 112v-5h36v5z" />
        </g>
      </g>

      {/* The lamp on top, light along the arm and down onto the sample. */}
      <g {...part('illuminate')}>
        <rect height="16" rx="3" width="28" x="178" y="24" />
        <path className={styles.glow} d="M192 20v-6M182 21l-4-4M202 21l4-4" />
        <path className={styles.flow} d="M178 46H113V102" />
      </g>

      {/* The focus knob turning, the objective under the stage moving. */}
      <g {...part('focus')}>
        <circle cx="160" cy="170" r="9" />
        <path className={styles.whirl} d="M160 163v14M153 170h14" />
        <g className={styles.nudge}>
          <rect height="14" width="10" x="108" y="122" />
          <path d="M110 122v-3h6v3" />
        </g>
      </g>

      {/* Eyepieces in front, the image travelling to them. */}
      <g {...part('observe')}>
        <g transform="rotate(-40 52 140)">
          <rect height="32" width="12" x="46" y="108" />
          <rect height="6" rx="1" width="16" x="44" y="102" />
        </g>
        <path className={styles.flow} d="M113 142v8H62L40 124" />
      </g>

      {/* Camera on the body, sending the image to the screen. */}
      <g {...part('capture')}>
        <rect height="20" rx="2" width="14" x="60" y="120" />
        <path className={styles.flow} d="M67 120V64" />
        <rect height="40" rx="3" width="60" x="10" y="24" />
        <path d="M40 64v10M30 74h20" />
        <circle cx="40" cy="44" r="14" />
        <circle className={styles.draw} cx="35" cy="41" pathLength="100" r="4" />
        <circle className={styles.draw} cx="45" cy="48" pathLength="100" r="4.5" />
        <circle className={styles.blink} cx="64" cy="30" r="1.6" />
      </g>
    </>
  );
}

const microscopeInverted = {
  Drawing,
  parts: [
    { part: 'mount', test: /mount|sample|slide|place/ },
    { part: 'illuminate', test: /illuminat|light/ },
    { part: 'focus', test: /focus/ },
    { part: 'observe', test: /observ|view/ },
    { part: 'capture', test: /captur|image|record|document/ },
  ],
  tags: {
    mount: { at: [140, 98], align: 'start' },
    illuminate: { at: [176, 12], align: 'center' },
    focus: { at: [160, 214], align: 'center' },
    observe: { at: [-6, 92], align: 'start' },
    capture: { at: [40, 10], align: 'center' },
  },
};

export default microscopeInverted;
