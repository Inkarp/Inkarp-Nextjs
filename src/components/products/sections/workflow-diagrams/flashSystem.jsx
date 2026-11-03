import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Flash / preparative purification: the sample is injected at the head of
// the column, solvent equilibrates the column, the compounds separate into
// bands, the detector traces them on screen, and the collector drops each
// band into its own tube.
const TUBES = [184, 194, 204, 214, 224, 234];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      {/* Body, feet, solvent bottles, the column and its fittings, the
          outlet line and the collector's rail. */}
      <g data-part="frame">
        <rect height="136" rx="6" width="96" x="74" y="60" />
        <path d="M86 196v5M158 196v5" />
        <path d="M84 56V34a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22zM112 56V34a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v22z" />
        <path className={styles.liquid} d="M84 42h16v14H84zM112 46h16v10h-16z" />
        <rect height="84" rx="4" width="20" x="38" y="74" />
        <path d="M44 74v-6h8v6M44 158v6h8v-6M48 164V176H74M170 130H200V140M176 140h70" />
      </g>

      {/* Sample injected at the head of the column. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-10px' }}>
          <rect height="24" rx="1.5" width="8" x="44" y="30" />
          <path d="M48 22v8M42 22h12M48 54v12" />
        </g>
      </g>

      {/* Solvent pumped in and down through the column. */}
      <g {...part('equilibrate')}>
        <path className={styles.flow} d="M74 66H48V74" />
        <path className={styles.flow} d="M44 80V152" />
      </g>

      {/* The compounds moving down the column as bands. */}
      <g {...part('separate')}>
        <path className={styles.flow} d="M50 82V150" style={{ strokeWidth: 5 }} />
      </g>

      {/* The detector's trace on the screen. */}
      <g {...part('detect')}>
        <rect height="44" rx="3" width="76" x="84" y="72" />
        <path className={styles.draw} d="M90 108h10l3-22 3 22h12l3-14 3 14h10l3-28 3 28h10" pathLength="100" />
      </g>

      {/* The collector head moving along the tubes, filling them. */}
      <g {...part('collect')}>
        <path d={TUBES.map((x) => `M${x} 164v26a3 3 0 0 0 6 0v-26`).join('')} />
        <path className={styles.liquid} d="M184 176h6v14a3 3 0 0 1-6 0zM194 180h6v10a3 3 0 0 1-6 0zM204 184h6v6a3 3 0 0 1-6 0z" />
        <path d="M178 196h68" />
        <g className={styles.sweep}>
          <rect height="10" rx="1.5" width="8" x="204" y="140" />
          <path d="M208 150v4" />
          <circle className={styles.drop} cx="208" cy="156" r="1.4" style={{ '--fall': '8px' }} />
        </g>
      </g>
    </>
  );
}

const flashSystem = {
  Drawing,
  parts: [
    { part: 'collect', test: /collect|fraction/ },
    { part: 'equilibrate', test: /equilibrat|condition/ },
    { part: 'separate', test: /separat|elut|gradient/ },
    { part: 'detect', test: /detect/ },
    { part: 'load', test: /load|inject|sample/ },
  ],
  tags: {
    load: { at: [-6, 38], align: 'start' },
    equilibrate: { at: [-6, 178], align: 'start' },
    separate: { at: [30, 116], align: 'end' },
    detect: { at: [122, 128], align: 'center' },
    collect: { at: [212, 124], align: 'center' },
  },
};

export default flashSystem;
