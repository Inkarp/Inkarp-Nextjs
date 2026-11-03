import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// HPLC / UPLC stack: the sample is pipetted into a vial, the sample manager's
// needle injects it, the column separates it into bands, the detector reads
// them, and the chromatogram is reported on screen.
const VIALS = [58, 70, 82, 94];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Solvent bottles on their tray, the four stacked modules (detector,
          column compartment, sample manager, pump) and the solvent line. */}
      <g data-part="frame">
        <path d="M46 50V28a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22zM74 50V28a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22zM102 50V28a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22z" />
        <path className={styles.liquid} d="M46 38h16v12H46zM74 34h16v16H74zM102 40h16v10h-16z" />
        <rect height="4" width="100" x="40" y="50" />
        <rect height="34" rx="3" width="100" x="40" y="58" />
        <rect height="34" rx="3" width="100" x="40" y="96" />
        <rect height="34" rx="3" width="100" x="40" y="134" />
        <rect height="26" rx="3" width="100" x="40" y="172" />
        <rect height="22" rx="2" width="82" x="50" y="102" />
        <rect height="22" rx="2" width="82" x="50" y="140" />
        <rect height="12" rx="2" width="30" x="50" y="179" />
        <path d="M50 198v4M130 198v4" />
      </g>

      {/* The sample pipetted into its vial. */}
      <g {...part('prepare')}>
        <path d="M16 104v8M12 112h8v30h-8zM14 142l2 22 2-22" />
        <circle className={styles.drop} cx="16" cy="166" r="1.4" style={{ '--fall': '12px' }} />
        <path d="M10 176h12v20a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
        <path className={styles.liquid} d="M10 188h12v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
      </g>

      {/* Vials in the sample manager, the needle going down to inject. */}
      <g {...part('inject')}>
        <path d={VIALS.map((x) => `M${x} 162v-12h7v12z`).join('')} />
        <g className={styles.lower} style={{ '--lower': '-6px' }}>
          <path d="M112 140v16" />
        </g>
        <circle cx="123" cy="151" r="5" />
      </g>

      {/* The column, its bands moving along it. */}
      <g {...part('separate')}>
        <rect height="8" rx="4" width="66" x="58" y="109" />
        <path className={styles.flow} d="M64 113H118" style={{ strokeWidth: 4 }} />
      </g>

      {/* Lamp, flow cell and photodiode, the signal out to the computer. */}
      <g {...part('detect')}>
        <circle cx="98" cy="75" r="4" />
        <path className={styles.glow} d="M98 67v-2M98 83v2" />
        <path className={styles.flow} d="M102 75H108" />
        <rect height="10" width="8" x="108" y="70" />
        <rect height="8" width="6" x="120" y="71" />
        <path className={styles.flow} d="M140 75H150V48H160" />
      </g>

      {/* The chromatogram on screen. */}
      <g {...part('report')}>
        <rect height="56" rx="3" width="84" x="160" y="20" />
        <path d="M202 76v10M190 86h24" />
        <path className={styles.draw} d="M166 68h10l3-24 3 24h10l2-14 2 14h12l3-34 3 34h14" pathLength="100" />
      </g>
    </>
  );
}

const lcSystem = {
  Drawing,
  parts: [
    { part: 'prepare', test: /prepar/ },
    { part: 'inject', test: /inject|load/ },
    { part: 'separate', test: /separat|column|elut/ },
    { part: 'detect', test: /detect/ },
    { part: 'report', test: /report|print|result|analy/ },
  ],
  tags: {
    prepare: { at: [-6, 96], align: 'start' },
    inject: { at: [146, 151], align: 'start' },
    separate: { at: [146, 113], align: 'start' },
    detect: { at: [156, 92], align: 'start' },
    report: { at: [202, 98], align: 'center' },
  },
};

export default lcSystem;
