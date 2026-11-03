import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Mass spectrometer: the sample is prepared, sprayed and ionised in the
// source, the ions are separated by mass between the rods, the detector
// counts them, and the mass spectrum is analysed on screen.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet, the source housing and the window onto the analyser. */}
      <g data-part="frame">
        <rect height="72" rx="6" width="188" x="44" y="112" />
        <path d="M58 184v5M218 184v5" />
        <path d="M84 112v72" />
        <rect height="44" rx="3" width="80" x="96" y="126" />
        <path d="M188 172h36M188 178h36" />
      </g>

      {/* The sample pipetted into its vial. */}
      <g {...part('prepare')}>
        <path d="M16 104v8M12 112h8v30h-8zM14 142l2 22 2-22" />
        <circle className={styles.drop} cx="16" cy="166" r="1.4" style={{ '--fall': '12px' }} />
        <path d="M10 176h12v20a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
        <path className={styles.liquid} d="M10 188h12v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
      </g>

      {/* The spray needle, its plume of ions drawn into the analyser. */}
      <g {...part('ionise')}>
        <path d="M64 80V128" />
        <path className={styles.glow} d="M64 128l-6 14M64 128l6 14M64 128v16" />
        <path className={styles.vapour} d="M70 148H96" />
      </g>

      {/* The rods, ions weaving between them. */}
      <g {...part('separate')}>
        <path d="M100 136H172M100 160H172" />
        <path className={styles.flow} d="M100 148q9-8 18 0t18 0t18 0t18 0" />
      </g>

      {/* The detector counting ions, the signal up to the computer. */}
      <g {...part('detect')}>
        <rect height="20" rx="2" width="14" x="186" y="138" />
        <path className={styles.signal} d="M178 142q-4 6 0 12" />
        <path className={styles.flow} d="M200 148H238V84" />
      </g>

      {/* The mass spectrum on screen. */}
      <g {...part('analyse')}>
        <rect height="64" rx="3" width="90" x="150" y="20" />
        <path className={styles.draw} d="M158 76v-14m12 14v-34m12 34v-8m12 8v-44m12 44v-18m12 18v-6" pathLength="100" />
      </g>
    </>
  );
}

const massSpec = {
  Drawing,
  parts: [
    { part: 'prepare', test: /prepar/ },
    { part: 'ionise', test: /ioni[sz]|spray|plasma/ },
    { part: 'separate', test: /separat|mass|filter/ },
    { part: 'detect', test: /detect/ },
    { part: 'analyse', test: /analy|report|result/ },
  ],
  tags: {
    prepare: { at: [-6, 92], align: 'start' },
    ionise: { at: [72, 84], align: 'start' },
    separate: { at: [136, 196], align: 'center' },
    detect: { at: [212, 196], align: 'center' },
    analyse: { at: [195, 10], align: 'center' },
  },
};

export default massSpec;
