import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';
import rotaryEvaporator from './rotaryEvaporator';

// Large-scale rotary evaporator with continuous feed: the rotary evaporator
// drawing, plus the feed line that draws solvent into the turning flask and
// the valve that discharges the distillate from the receiving flask.
const RotavapDrawing = rotaryEvaporator.Drawing;

function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <RotavapDrawing on={on} />

      {/* The feed bottle and its line into the evaporating flask. */}
      <g {...part('feed')}>
        <path d="M30 60V30a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v30zM40 26v-6h10v6" />
        <path className={styles.liquid} d="M30 42h30v18H30z" />
        <path className={styles.flow} d="M45 60V96L66 140" />
        <path d="M39 84l12 8v-8l-12 8z" />
      </g>

      {/* The discharge valve under the receiving flask, distillate let out. */}
      <g {...part('discharge')}>
        <path d="M183 194v10" />
        <path className={styles.blink} d="M177 204l12 8v-8l-12 8z" />
        <circle className={styles.drop} cx="183" cy="214" r="1.6" style={{ '--fall': '8px' }} />
        <path d="M168 220v10a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4v-10" />
      </g>
    </>
  );
}

const industrialRotavap = {
  Drawing,
  // "Discharge" is checked before "feed" and the rotavap's own parts.
  parts: [
    { part: 'discharge', test: /discharg|empty/ },
    { part: 'feed', test: /feed|charg|fill/ },
    { part: 'rotate', test: /rotat|spin|turn/ },
    { part: 'heat', test: /heat|bath|warm/ },
    { part: 'evaporate', test: /evapor|vapo|boil|distil/ },
    { part: 'condense', test: /condens|cool/ },
    { part: 'collect', test: /collect|recover|receiv/ },
  ],
  tags: {
    ...rotaryEvaporator.tags,
    feed: { at: [45, 12], align: 'center' },
    discharge: { at: [204, 222], align: 'start' },
  },
};

export default industrialRotavap;
