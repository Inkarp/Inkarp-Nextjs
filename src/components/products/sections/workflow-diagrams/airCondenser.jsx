import styles from '../WorkflowDiagram.module.css';
import { HotplateBase } from './benchHotplate';
import { partOf } from './part';

// Air condenser on a refluxing flask: the finned condenser is fitted to the
// flask, room air cools its fins, the vapour condenses inside, and the
// condensate drips back into the flask.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <HotplateBase part={part} />

      {/* The block and the flask of liquid in it. */}
      <g data-part="frame">
        <path d="M88 162V140q0-4 4-4h56q4 0 4 4v22" />
        <path d="M115 100V116.6A20 20 0 1 0 125 116.6V100" />
        <path className={styles.liquid} d="M100.9 142H139.1A20 20 0 0 1 100.9 142Z" />
      </g>

      {/* The finned condenser, fitted onto the flask. */}
      <g {...part('fit')}>
        <g className={styles.lower} style={{ '--lower': '-12px' }}>
          <path d="M113 22V88l2 4v8M127 22V88l-2 4v8M113 22h14" />
          <path d="M101 32h12M127 32h12M101 42h12M127 42h12M101 52h12M127 52h12M101 62h12M127 62h12M101 72h12M127 72h12" />
        </g>
      </g>

      {/* Room air flowing over the fins. */}
      <g {...part('aircool')}>
        <path className={styles.flow} d="M64 37h30M64 57h30M64 77h30" />
        <path className={styles.flow} d="M146 37h30M146 57h30M146 77h30" />
      </g>

      {/* Vapour rising up the condenser. */}
      <g {...part('condense')}>
        <path className={styles.vapour} d="M120 112V30" />
      </g>

      {/* Condensate running back into the flask. */}
      <g {...part('return')}>
        <circle className={styles.drop} cx="116" cy="44" r="1.6" style={{ '--fall': '70px' }} />
        <circle className={`${styles.drop} ${styles.later}`} cx="124" cy="52" r="1.6" style={{ '--fall': '62px' }} />
      </g>
    </>
  );
}

const airCondenser = {
  Drawing,
  parts: [
    { part: 'fit', test: /fit|attach|mount/ },
    { part: 'aircool', test: /air|cool|fin/ },
    { part: 'condense', test: /condens|vapou?r/ },
    { part: 'return', test: /return|reflux|drip/ },
  ],
  tags: {
    fit: { at: [146, 18], align: 'start' },
    aircool: { at: [50, 24], align: 'center' },
    condense: { at: [150, 96], align: 'start' },
    return: { at: [72, 124], align: 'end' },
  },
};

export default airCondenser;
