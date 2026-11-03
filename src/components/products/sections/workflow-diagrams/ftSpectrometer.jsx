import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Benchtop FT-IR / FT-NIR spectrometer: the sample is ground and prepared,
// pressed onto the ATR crystal, the interferometer's moving mirror scans the
// beam through it to the detector, the spectrum is analysed on screen, and
// the report is printed.
function Drawing({ on }) {
  const part = partOf(on);
  // Drawn on the bench line like the others, then raised to sit centred:
  // the instrument is wide and low.
  return (
    <g transform="translate(0 -28)">
      {/* Body, feet, the window onto the optics, the ATR plate and its clamp tower. */}
      <g data-part="frame">
        <rect height="76" rx="8" width="140" x="44" y="120" />
        <path d="M58 196v5M170 196v5" />
        <rect height="56" rx="4" width="80" x="54" y="130" />
        <rect height="8" width="40" x="140" y="112" />
        <path d="M176 112V84H150" />
      </g>

      {/* The sample ground in the mortar. */}
      <g {...part('prepare')}>
        <path d="M2 182h32q0 14-16 14t-16-14z" />
        <g className={styles.nudge}>
          <path d="M26 162l-8 18" />
        </g>
      </g>

      {/* The sample on the crystal, the clamp pressing it down. */}
      <g {...part('load')}>
        <ellipse className={styles.liquid} cx="150" cy="110" rx="6" ry="2" />
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <path d="M150 84v18M144 102h12" />
        </g>
      </g>

      {/* Source, beam splitter, fixed and moving mirrors, the beam out
          through the sample and back to the detector. */}
      <g {...part('scan')}>
        <circle cx="68" cy="166" r="6" />
        <path className={styles.glow} d="M68 156v-4M58 166h-4M68 176v4" />
        <path d="M88 158l12 16M88 142h12" />
        <g className={styles.rock}>
          <path d="M120 160v12" />
        </g>
        <path className={styles.flow} d="M74 166H118M94 166V144M94 166V180H150V122" />
        <path className={styles.flow} d="M162 122V140" />
        <rect height="10" width="10" x="157" y="140" />
      </g>

      {/* The spectrum on the screen. */}
      <g {...part('analyse')}>
        <rect height="44" rx="3" width="56" x="192" y="118" />
        <path d="M220 162v34M210 196h20" />
        <path className={styles.draw} d="M198 152l6-8 4 6 6-22 5 18 6-6 6 10 7-4 6 6" pathLength="100" />
      </g>

      {/* The printed report. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M222 118V94h22v24" />
          <path d="M226 102h14M226 108h14M226 114h9" />
        </g>
      </g>
    </g>
  );
}

const ftSpectrometer = {
  Drawing,
  // "Analyse Spectrum" is checked before "scan" ("spectr").
  parts: [
    { part: 'prepare', test: /prepar|grind/ },
    { part: 'load', test: /load|insert|place|mount/ },
    { part: 'analyse', test: /analy|interpret/ },
    { part: 'scan', test: /scan|measur|acquir|spectr/ },
    { part: 'report', test: /report|print|result/ },
  ],
  tags: {
    prepare: { at: [-6, 122], align: 'start' },
    load: { at: [140, 62], align: 'end' },
    scan: { at: [94, 186], align: 'center' },
    analyse: { at: [214, 186], align: 'center' },
    report: { at: [233, 52], align: 'center' },
  },
};

export default ftSpectrometer;
