import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Automated nanospray robot: the well plate goes on the deck, the pipette tip
// aspirates a sample, the chip nozzle sprays and ionises it, and the ions are
// delivered into the mass spectrometer's inlet.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Housing, deck, the gantry rail and its carriage. */}
      <g data-part="frame">
        <rect height="156" rx="6" width="150" x="20" y="40" />
        <path d="M28 170h134M30 60h130" />
        <rect height="16" rx="2" width="24" x="62" y="60" />
      </g>

      {/* The well plate set on the deck. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <rect height="14" rx="2" width="60" x="40" y="156" />
          <path d="M48 163h0M58 163h0M68 163h0M78 163h0M88 163h0" strokeWidth="3" />
        </g>
      </g>

      {/* The pipette tip dipping down to draw up a sample. */}
      <g {...part('aspirate')}>
        <g className={styles.nudge}>
          <path d="M70 76h8v40l-3 18h-2l-3-18z" />
          <path className={styles.liquid} d="M71.5 124h5l-1.5 10h-2z" />
        </g>
      </g>

      {/* The chip's nozzle spraying a fine plume. */}
      <g {...part('ionise')}>
        <rect height="30" rx="2" width="30" x="120" y="100" />
        <path d="M150 115h8" />
        <path className={styles.glow} d="M158 115l14-8M158 115l14 8M158 115h16" />
      </g>

      {/* The ions drawn into the mass spectrometer. */}
      <g {...part('deliver')}>
        <path className={styles.vapour} d="M174 115H200" />
        <path d="M190 100l20 15-20 15" />
        <rect height="70" rx="4" width="38" x="210" y="80" />
      </g>
    </>
  );
}

const nanosprayRobot = {
  Drawing,
  parts: [
    { part: 'load', test: /load|plate/ },
    { part: 'aspirate', test: /aspirat|pipett|sample/ },
    { part: 'ionise', test: /ioni[sz]|spray/ },
    { part: 'deliver', test: /deliver|transfer|mass spec/ },
  ],
  tags: {
    load: { at: [70, 186], align: 'center' },
    aspirate: { at: [92, 88], align: 'start' },
    ionise: { at: [135, 146], align: 'center' },
    deliver: { at: [248, 70], align: 'end' },
  },
};

export default nanosprayRobot;
