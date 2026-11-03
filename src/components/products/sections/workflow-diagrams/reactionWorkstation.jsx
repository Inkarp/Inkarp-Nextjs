import styles from '../WorkflowDiagram.module.css';
import { HotplateBase } from './benchHotplate';
import { partOf } from './part';

// Reaction work station: round-bottom flasks in a block on a stirring
// hotplate. Reagent is charged through a funnel, the bars stir, the block
// heats or cools, the mixture is extracted in the separating funnel, and the
// product is recovered into the flask below it.
const FLASKS = [84, 120, 156];

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <HotplateBase heat="heat" part={part} stir="stir" />

      {/* The flasks of liquid, the block cradling them, and the ring stand. */}
      <g data-part="frame">
        {FLASKS.map((x) => (
          <g key={x}>
            <path d={`M${x - 4} 104V122.6A14 14 0 1 0 ${x + 4} 122.6V104`} />
            <path className={styles.liquid} d={`M${x - 13.4} 140H${x + 13.4}A14 14 0 0 1 ${x - 13.4} 140Z`} />
          </g>
        ))}
        <rect height="26" rx="3" width="112" x="64" y="136" />
        <path d="M236 30V198M226 198h20" />
      </g>

      {/* Reagent poured through the funnel. */}
      <g {...part('charge')}>
        <path d="M72 70h24l-9 14v14h-6v-14z" />
        <circle className={styles.drop} cx="84" cy="100" r="1.6" style={{ '--fall': '14px' }} />
      </g>

      {/* A stir bar spinning in each flask. */}
      <g {...part('stir')}>
        {FLASKS.map((x) => (
          <rect className={styles.spinBar} height="3" key={x} rx="1.5" width="8" x={x - 4} y="144" />
        ))}
      </g>

      {/* The separating funnel on its ring, two layers settling. */}
      <g {...part('extract')}>
        <path d="M200 66h36" />
        <path d="M208 44h8v8c14 10 18 28 6 44l-8 8h-4l-8-8c-12-16-8-34 6-44z" />
        <path className={styles.liquid} d="M199 80h26c0 6-1 11-3 16l-8 8h-4l-8-8c-2-5-3-10-3-16z" />
        <path className={styles.blink} d="M201 90h22" />
        <path d="M210 104v46h4v-46M206 112h12" />
      </g>

      {/* The product run off into the flask below. */}
      <g {...part('recover')}>
        <path d="M207 160h10M209 160v10l-10 24a2 2 0 0 0 2 3h22a2 2 0 0 0 2-3l-10-24v-10" />
        <path className={styles.liquid} d="M204 184h16l4 10a2 2 0 0 1-2 3h-20a2 2 0 0 1-2-3z" />
        <circle className={styles.drop} cx="212" cy="153" r="1.6" style={{ '--fall': '26px' }} />
      </g>
    </>
  );
}

const reactionWorkstation = {
  Drawing,
  parts: [
    { part: 'recover', test: /recover|collect|isolat/ },
    { part: 'extract', test: /extract|separat|work-up/ },
    { part: 'charge', test: /charge|add|fill/ },
    { part: 'stir', test: /stir|mix/ },
    { part: 'heat', test: /heat|cool|temperat/ },
  ],
  tags: {
    charge: { at: [64, 62], align: 'end' },
    stir: { at: [136, 216], align: 'center' },
    heat: { at: [172, 216], align: 'center' },
    extract: { at: [196, 30], align: 'end' },
    recover: { at: [212, 216], align: 'center' },
  },
};

export default reactionWorkstation;
