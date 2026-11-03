import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Laser flash photolysis: the cuvette goes in the holder, a laser pulse
// excites it, a probe beam through it to the monochromator and detector
// catches the short-lived transient, its decay is traced on the scope, and
// the spectra are analysed.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The cuvette holder. */}
      <g data-part="frame">
        <path d="M104 134h30M108 134v8M130 134v8" />
      </g>

      {/* The cuvette set in the holder. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="34" rx="1.5" width="14" x="112" y="98" />
          <path className={styles.liquid} d="M112 112h14v20h-14z" />
        </g>
      </g>

      {/* The laser firing its pulse into the cuvette. */}
      <g {...part('excite')}>
        <rect height="24" rx="3" width="60" x="10" y="104" />
        <path d="M18 112h20" />
        <path className={styles.flow} d="M70 116H110" style={{ strokeWidth: 3 }} />
        <path className={styles.glow} d="M108 108l-4-4M108 124l-4 4" />
      </g>

      {/* The probe lamp's beam up through the cuvette to the monochromator
          and detector. */}
      <g {...part('detect')}>
        <circle cx="119" cy="172" r="8" />
        <path className={styles.flow} d="M119 164V72" />
        <rect height="28" rx="2" width="30" x="104" y="40" />
        <path d="M110 48h18M110 56h12" />
        <path className={styles.signal} d="M136 50q4 6 0 12" />
      </g>

      {/* The transient's decay traced on the scope. */}
      <g {...part('kinetics')}>
        <path className={styles.flow} d="M134 54H150" />
        <rect height="60" rx="3" width="90" x="150" y="40" />
        <path className={styles.draw} d="M156 92V52c8 0 10 20 20 30s30 8 56 8" pathLength="100" />
      </g>

      {/* The transient spectra analysed. */}
      <g {...part('analyse')}>
        <rect height="60" rx="3" width="90" x="150" y="120" />
        <path className={styles.draw} d="M156 172c10 0 12-30 22-30s10 16 18 12 12-20 20-20 10 22 18 28" pathLength="100" />
      </g>
    </>
  );
}

const flashPhotolysis = {
  Drawing,
  parts: [
    { part: 'load', test: /load|sample|place/ },
    { part: 'excite', test: /excit|flash|pulse/ },
    { part: 'detect', test: /detect|transient|probe/ },
    { part: 'kinetics', test: /kinetic|decay/ },
    { part: 'analyse', test: /analy/ },
  ],
  tags: {
    load: { at: [96, 90], align: 'end' },
    excite: { at: [40, 92], align: 'center' },
    detect: { at: [117, 26], align: 'center' },
    kinetics: { at: [195, 26], align: 'center' },
    analyse: { at: [195, 196], align: 'center' },
  },
};

export default flashPhotolysis;
