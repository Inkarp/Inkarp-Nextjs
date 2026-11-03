import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Handheld Raman spectrometer: the sample is put into a vial, the vial is
// set in the holder on the nose, the trigger fires the laser into it, the
// spectrum is analysed on the device's screen, and the result is reported.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* The handheld body, its grip, the nose cone and the vial holder. */}
      <g data-part="frame">
        <rect height="130" rx="12" width="60" x="80" y="20" />
        <path d="M86 130h48M86 138h48" />
        <path d="M96 150h28l-4 14h-20z" />
        <path d="M98 164v36h24v-36" />
      </g>

      {/* The sample spooned into a vial at the bench. */}
      <g {...part('prepare')}>
        <path d="M24 170v24a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-24M22 170h20" />
        <path className={styles.liquid} d="M24 184h16v10a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3z" />
        <g className={styles.nudge}>
          <path d="M44 150l-12 16M30 166l4 2" />
        </g>
      </g>

      {/* The vial set in the holder under the nose. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '14px' }}>
          <path d="M104 168v26a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-26M102 168h16" />
          <path className={styles.liquid} d="M104 182h12v12a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3z" />
        </g>
      </g>

      {/* The trigger pressed, the laser into the vial, light scattering back. */}
      <g {...part('scan')}>
        <circle className={styles.press} cx="110" cy="112" r="6" />
        <path className={styles.flow} d="M110 164V188" style={{ strokeWidth: 2.5 }} />
        <path className={styles.signal} d="M120 180q5 6 0 12M100 180q-5 6 0 12" />
      </g>

      {/* The spectrum on the device's screen. */}
      <g {...part('analyse')}>
        <rect height="60" rx="3" width="40" x="90" y="32" />
        <path className={styles.draw} d="M94 84h6l2-26 2 26h6l2-14 2 14h4l2-34 2 34h4" pathLength="100" />
      </g>

      {/* The report: a pass against the reference. */}
      <g {...part('report')}>
        <g className={styles.feed}>
          <path d="M168 40h36v48h-36z" />
          <path d="M174 50h24M174 58h18" />
          <path d="M176 72l6 6 12-12" />
        </g>
      </g>
    </>
  );
}

const handheldRaman = {
  Drawing,
  parts: [
    { part: 'prepare', test: /prepar/ },
    { part: 'load', test: /load|insert|place/ },
    { part: 'analyse', test: /analy|identif|match/ },
    { part: 'scan', test: /scan|measur|acquir/ },
    { part: 'report', test: /report|result|pass/ },
  ],
  tags: {
    prepare: { at: [34, 136], align: 'center' },
    load: { at: [130, 186], align: 'start' },
    scan: { at: [150, 112], align: 'start' },
    analyse: { at: [110, 10], align: 'center' },
    report: { at: [186, 102], align: 'center' },
  },
};

export default handheldRaman;
