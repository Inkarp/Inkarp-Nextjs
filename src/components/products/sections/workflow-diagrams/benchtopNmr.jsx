import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Benchtop NMR (and, with `auto`, its autosampler on top): the sample tube is
// prepared, inserted between the magnet's poles, the field is shimmed, the
// coil picks up the signal, and the spectrum is processed on the built-in
// tablet. The autosampler adds a rack of tubes, a queue on the tablet and a
// gripper that inserts and ejects each tube.
export function NmrDrawing({ on, auto = false }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet, the magnet window, the sample port and the tablet stand. */}
      <g data-part="frame">
        <rect height="96" rx="16" width="150" x="40" y="100" />
        <path d="M56 196v5M174 196v5" />
        <rect height="70" rx="4" width="52" x="130" y="116" />
        <path d="M150 100v-6h12v6M80 94v6" />
      </g>

      {/* The tube prepared at the bench: a pipette filling it. */}
      {auto ? null : (
        <g {...part('prepare')}>
          <path d="M14 112v8M10 120h8v24h-8zM12 144l2 16 2-16" />
          <circle className={styles.drop} cx="14" cy="162" r="1.4" style={{ '--fall': '12px' }} />
          <path d="M12 176v20M16 176v20M10 176h8" />
          <path className={styles.liquid} d="M12 188h4v8h-4z" />
        </g>
      )}

      {/* The autosampler's rack of tubes. */}
      {auto ? (
        <g {...part('load')}>
          <g className={styles.lower} style={{ '--lower': '-10px' }}>
            <path d="M186 76h52M190 76v-22M200 76v-22M210 76v-22M220 76v-22M230 76v-22" />
          </g>
        </g>
      ) : null}

      {/* The tube going down between the poles. */}
      <g {...part('insert')}>
        <g className={styles.lower} style={{ '--lower': '-24px' }}>
          <path d="M154 70v94a2 2 0 0 0 4 0V70" />
          <path className={styles.liquid} d="M154 148h4v16a2 2 0 0 1-4 0z" />
          {auto ? <path d="M150 64h12v6h-12z" /> : null}
        </g>
      </g>

      {/* The magnet's poles, the field between them being evened out. */}
      <g {...part('shim')}>
        <rect height="12" rx="2" width="40" x="136" y="120" />
        <rect height="12" rx="2" width="40" x="136" y="170" />
        <g className={styles.nudge}>
          <path d="M142 134v34M148 134v34M164 134v34M170 134v34" strokeDasharray="2 3" />
        </g>
      </g>

      {/* The coil round the tube picking up the signal. */}
      <g {...part('acquire')}>
        <ellipse cx="156" cy="150" rx="8" ry="3" />
        <ellipse cx="156" cy="156" rx="8" ry="3" />
        <path className={styles.signal} d="M168 146q4 7 0 14" />
        <path className={styles.flow} d="M130 152H112V90" />
      </g>

      {/* The spectrum processed on the tablet (and the run queue, with the
          autosampler). */}
      <g {...part('process')}>
        <rect height="56" rx="4" width="80" x="40" y="38" />
        <path className={styles.draw} d="M46 86h10l2-24 2 24h12l2-12 2 12h10l2-34 2 34h18" pathLength="100" />
      </g>
      {auto ? (
        <g {...part('queue')}>
          <path className={styles.blink} d="M46 46h22M46 52h18M46 58h22" />
        </g>
      ) : null}

      {/* The gripper lifting the tube back out. */}
      {auto ? (
        <g {...part('eject')}>
          <path d="M156 40V20H212V54" />
          <path className={styles.blink} d="M146 52v-10M143 45l3-3 3 3" />
        </g>
      ) : null}
    </>
  );
}

function Drawing({ on }) {
  return <NmrDrawing on={on} />;
}

const benchtopNmr = {
  Drawing,
  parts: [
    { part: 'prepare', test: /prepar/ },
    { part: 'insert', test: /insert|load/ },
    { part: 'shim', test: /shim|lock|tune/ },
    { part: 'acquire', test: /acquir|scan|measur/ },
    { part: 'process', test: /process|analy|report/ },
  ],
  tags: {
    prepare: { at: [-6, 100], align: 'start' },
    insert: { at: [168, 62], align: 'start' },
    shim: { at: [156, 206], align: 'center' },
    acquire: { at: [214, 150], align: 'center' },
    process: { at: [80, 26], align: 'center' },
  },
};

export default benchtopNmr;
