import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// FT-IR / Raman microscope: the sample is mounted on the stage, the focus
// knob brings the objective into focus, the beam from the spectrometer
// irradiates the sample while the stage scans it point by point, the spectra
// build a chemical image, and the spectra are analysed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Base, arm, head, the spectrometer housing and the nosepiece. */}
      <g data-part="frame">
        <rect height="14" rx="4" width="140" x="30" y="184" />
        <rect height="98" rx="4" width="18" x="140" y="86" />
        <rect height="24" rx="4" width="110" x="60" y="62" />
        <rect height="80" rx="6" width="66" x="170" y="40" />
        <path d="M180 56h46M180 64h46" />
        <path d="M82 86L88 94H102L108 86" />
      </g>

      {/* The beam down onto the sample, and the stage scanning under it
          (carrying the mounted sample with it). */}
      <g {...part('scan')}>
        <path className={styles.flow} d="M170 74H95V86M95 110V136" />
        <g className={styles.sweep}>
          <rect height="6" width="90" x="50" y="140" />
          <g {...part('mount')}>
            <g className={styles.lower} style={{ '--lower': '-12px' }}>
              <rect height="4" width="42" x="74" y="136" />
              <ellipse className={styles.liquid} cx="95" cy="138" rx="5" ry="1.2" />
            </g>
          </g>
        </g>
      </g>

      {/* The focus knob turning, the objective moving. */}
      <g {...part('focus')}>
        <circle cx="149" cy="160" r="9" />
        <path className={styles.whirl} d="M149 153v14M142 160h14" />
        <g className={styles.nudge}>
          <rect height="14" width="10" x="90" y="94" />
          <path d="M92 108h6v3h-6z" />
        </g>
      </g>

      {/* The chemical image building up, tile by tile. */}
      <g {...part('image')}>
        <rect height="50" rx="3" width="70" x="0" y="14" />
        <path d="M30 64v10M20 74h20" />
        <path className={styles.liquid} d="M6 22h8v8h-8zM22 30h8v8h-8zM14 38h8v8h-8z" />
        <path className={styles.blink} d="M6 22h24v24h-24zM14 22v24M22 22v24M6 30h24M6 38h24" />
      </g>

      {/* A spectrum from the map, analysed. */}
      <g {...part('analyse')}>
        <path className={styles.draw} d="M36 52l5-6 4 4 5-18 4 14 5-4 5 8 6-2" pathLength="100" />
      </g>
    </>
  );
}

const spectralMicroscope = {
  Drawing,
  parts: [
    { part: 'image', test: /image|map|build/ },
    { part: 'mount', test: /mount|sample|place/ },
    { part: 'focus', test: /focus/ },
    { part: 'scan', test: /irradiat|scan|spectr/ },
    { part: 'analyse', test: /analy/ },
  ],
  tags: {
    mount: { at: [80, 160], align: 'end' },
    focus: { at: [164, 160], align: 'start' },
    scan: { at: [203, 132], align: 'center' },
    image: { at: [35, 86], align: 'center' },
    analyse: { at: [52, 6], align: 'center' },
  },
};

export default spectralMicroscope;
