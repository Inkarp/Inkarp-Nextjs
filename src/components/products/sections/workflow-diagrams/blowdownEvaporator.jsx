import styles from '../WorkflowDiagram.module.css';
import { HotplateBase } from './benchHotplate';
import { partOf } from './part';

// Blowdown evaporator: sample tubes go into the warmed block, needles blow
// gas down onto each sample, the solvent evaporates off, and the dried
// sample is collected.
const TUBES = [76, 98, 120, 142, 164];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <HotplateBase heat="warm" part={part} />

      {/* The block and the posts holding the gas manifold. */}
      <g data-part="frame">
        <rect height="38" rx="4" width="120" x="60" y="124" />
        <path d="M62 124V76M178 124V76" />
      </g>

      {/* Sample tubes set into the block. */}
      <g {...part('load')}>
        <g className={styles.lower} style={{ '--lower': '-14px' }}>
          {TUBES.map((x) => (
            <g key={x}>
              <path d={`M${x - 5} 96v54a5 5 0 0 0 10 0V96`} />
              <path className={styles.liquid} d={`M${x - 5} 144h10v6a5 5 0 0 1-10 0z`} />
            </g>
          ))}
        </g>
      </g>

      {/* Gas in along the manifold and down the needles. */}
      <g {...part('blow')}>
        <path className={styles.flow} d="M8 72H62" />
        <rect height="8" rx="2" width="116" x="62" y="68" />
        <path d={TUBES.map((x) => `M${x} 76v26`).join('')} />
      </g>

      {/* Solvent evaporating out of the tubes. */}
      <g {...part('evaporate')}>
        {TUBES.map((x, i) => (
          <path className={i % 2 ? `${styles.heat} ${styles.later}` : styles.heat} d={`M${x + 4} 94q-2-3 0-6t0-6`} key={x} />
        ))}
      </g>

      {/* A dried sample vial collected in the rack. */}
      <g {...part('collect')}>
        <path d="M206 172h34M209 172v26M237 172v26" />
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M219 146v20a4 4 0 0 0 8 0v-20M218 146h10" />
          <path className={styles.liquid} d="M219 162h8v4a4 4 0 0 1-8 0z" />
        </g>
      </g>
    </>
  );
}

const blowdownEvaporator = {
  Drawing,
  parts: [
    { part: 'load', test: /load|insert|place/ },
    { part: 'warm', test: /warm|heat/ },
    { part: 'blow', test: /blow|gas|nitrogen/ },
    { part: 'evaporate', test: /evapor|dry/ },
    { part: 'collect', test: /collect|recover/ },
  ],
  tags: {
    load: { at: [52, 100], align: 'end' },
    warm: { at: [172, 216], align: 'center' },
    blow: { at: [30, 58], align: 'center' },
    evaporate: { at: [120, 52], align: 'center' },
    collect: { at: [223, 132], align: 'center' },
  },
};

export default blowdownEvaporator;
