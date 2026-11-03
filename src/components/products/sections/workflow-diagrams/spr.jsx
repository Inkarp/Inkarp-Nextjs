import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Surface plasmon resonance: the ligand is immobilised on the gold sensor,
// the analyte is injected through the flow cell, light reflected off the
// gold film measures it binding, a buffer regenerates the surface, and the
// sensorgram is analysed.
const LIGANDS = [92, 108, 124, 140];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The prism with the gold film on top, the flow cell over it, the
          outlet to the waste vial. */}
      <g data-part="frame">
        <path d="M70 110H170L120 160Z" />
        <path d="M80 110h80" strokeWidth="2.5" />
        <rect height="16" rx="2" width="80" x="80" y="92" />
        <path d="M160 100H180M180 96h16v24h-16z" />
      </g>

      {/* Ligand molecules bound to the gold. */}
      <g {...part('immobilise')}>
        <path d={LIGANDS.map((x) => `M${x} 108v-5l-3-3M${x} 103l3-3`).join('')} />
      </g>

      {/* The syringe pushing the analyte through the flow cell. */}
      <g {...part('inject')}>
        <rect height="14" rx="2" width="36" x="22" y="60" />
        <g className={styles.nudge}>
          <path d="M10 67h12M10 61v12" />
        </g>
        <path d="M58 67H70V100H80" />
        <path className={styles.vapour} d="M84 100H156" />
      </g>

      {/* Light reflected off the gold film to the detector as it binds. */}
      <g {...part('measure')}>
        <rect height="14" rx="2" width="20" x="30" y="164" />
        <path className={styles.flow} d="M50 168L120 112L190 168" />
        <rect height="14" rx="2" width="20" x="190" y="164" />
        <path className={styles.signal} d="M212 166q4 5 0 10" />
      </g>

      {/* Regeneration buffer washing the surface clean. */}
      <g {...part('regenerate')}>
        <path d="M112 70V44a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v26z" />
        <path className={styles.liquid} d="M112 56h16v14h-16z" />
        <path className={styles.flow} d="M120 70V92" />
      </g>

      {/* The sensorgram on screen. */}
      <g {...part('analyse')}>
        <rect height="50" rx="3" width="76" x="170" y="20" />
        <path className={styles.draw} d="M176 62h12c6 0 8-26 20-26h10c4 0 6 18 22 18" pathLength="100" />
      </g>
    </>
  );
}

const spr = {
  Drawing,
  parts: [
    { part: 'immobilise', test: /immobili[sz]|ligand|coat/ },
    { part: 'inject', test: /inject|analyte/ },
    { part: 'measure', test: /measur|bind|detect/ },
    { part: 'regenerate', test: /regenerat|wash/ },
    { part: 'analyse', test: /analy|kinetic/ },
  ],
  tags: {
    immobilise: { at: [40, 124], align: 'center' },
    inject: { at: [40, 46], align: 'center' },
    measure: { at: [120, 188], align: 'center' },
    regenerate: { at: [120, 28], align: 'center' },
    analyse: { at: [208, 84], align: 'center' },
  },
};

export default spr;
