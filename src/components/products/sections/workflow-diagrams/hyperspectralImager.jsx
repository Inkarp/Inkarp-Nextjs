import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Hyperspectral imager: the camera is set up over the sample, the lens is
// focused, light from the sample builds an image cube slice by slice through
// the tunable filter, a reference target calibrates it, and the spectra are
// analysed on screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, column and arm, the sample stage, and the screen's stand. */}
      <g data-part="frame">
        <rect height="8" rx="3" width="126" x="24" y="196" />
        <path d="M136 196V30M136 50H104" />
        <rect height="8" width="54" x="60" y="172" />
        <path d="M208 170v10M196 180h24" />
      </g>

      {/* The camera on its arm and the sample set under it. */}
      <g {...part('setup')}>
        <rect height="40" rx="4" width="34" x="70" y="36" />
        <path d="M78 48h18" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <rect height="6" width="34" x="70" y="166" />
          <path className={styles.liquid} d="M73 166q7-5 14 0t14 0z" />
        </g>
      </g>

      {/* The lens being focused. */}
      <g {...part('focus')}>
        <g className={styles.nudge}>
          <rect height="20" rx="2" width="18" x="78" y="76" />
          <path d="M78 84h18M78 90h18" />
        </g>
      </g>

      {/* Light from the sample, and the image cube building slice by slice. */}
      <g {...part('acquire')}>
        <path className={styles.flow} d="M87 160V98" />
        <rect height="30" width="30" x="180" y="40" />
        <rect className={styles.blink} height="30" width="30" x="186" y="46" />
        <rect className={`${styles.blink} ${styles.later}`} height="30" width="30" x="192" y="52" />
        <rect className={`${styles.blink} ${styles.latest}`} height="30" width="30" x="198" y="58" />
      </g>

      {/* The reference target on the stage. */}
      <g {...part('calibrate')}>
        <rect height="6" width="16" x="112" y="166" />
        <path className={styles.blink} d="M114 162h12" />
      </g>

      {/* A spectrum from the cube, analysed on screen. */}
      <g {...part('analyse')}>
        <rect height="60" rx="3" width="76" x="170" y="110" />
        <path className={styles.draw} d="M176 160c10 0 12-30 22-30s10 22 18 18 10-12 24-14" pathLength="100" />
      </g>
    </>
  );
}

const hyperspectralImager = {
  Drawing,
  parts: [
    { part: 'setup', test: /set ?up|mount|position/ },
    { part: 'focus', test: /focus/ },
    { part: 'acquire', test: /acquir|image cube|captur/ },
    { part: 'calibrate', test: /calibrat|reference/ },
    { part: 'analyse', test: /analy/ },
  ],
  tags: {
    setup: { at: [44, 160], align: 'end' },
    focus: { at: [102, 88], align: 'start' },
    acquire: { at: [208, 26], align: 'center' },
    calibrate: { at: [120, 154], align: 'center' },
    analyse: { at: [208, 192], align: 'center' },
  },
};

export default hyperspectralImager;
