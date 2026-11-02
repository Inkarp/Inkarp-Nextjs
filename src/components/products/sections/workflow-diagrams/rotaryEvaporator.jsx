import styles from '../WorkflowDiagram.module.css';
import { partOf } from './part';

// Rotary evaporator: the flask turns in its heating bath, vapour rises through
// the duct, the condenser cools it, and condensate drips into the receiving flask.
function Drawing({ on }) {
  const part = partOf(on);
  return (
    <>
      <defs>
        <clipPath id="wf-rv-flask"><circle cx="76" cy="166" r="28.6" /></clipPath>
        <clipPath id="wf-rv-receiver"><circle cx="183" cy="172" r="20.6" /></clipPath>
        <clipPath id="wf-rv-bath"><rect height="44" width="112" x="19" y="172" /></clipPath>
      </defs>

      {/* Heating bath: water rocking, heat rising. */}
      <g {...part('heat')}>
        <path d="M18 172v36a8 8 0 0 0 8 8h98a8 8 0 0 0 8-8v-36" />
        <g clipPath="url(#wf-rv-bath)">
          <path className={styles.rock} d="M18 188q7.5-5 15 0t15 0M100 188q7-5 14 0t14 0t14 0" />
        </g>
        <path className={styles.heat} d="M30 212q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.later}`} d="M44 212q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.latest}`} d="M116 212q-2-3 0-6t0-6" />
      </g>

      {/* Evaporating flask turning on its drive. */}
      <g {...part('rotate')}>
        <circle cx="76" cy="166" r="30" />
        <path d="M95 142l24-24M103 150l24-24" />
        <rect height="26" rx="5" transform="rotate(-45 135 109)" width="36" x="117" y="96" />
        <path className={styles.turn} d="M97 120A18 6 45 1 0 125 148" />
        <path d="M125 148l-8-1M125 148l-1-8" />
        <g clipPath="url(#wf-rv-flask)">
          <g className={styles.film}>
            <path d="M76 143a23 23 0 0 1 20 11.5M76 189a23 23 0 0 1-20-11.5" />
          </g>
        </g>
      </g>

      {/* Solvent evaporating: vapour rising through the duct. */}
      <g {...part('evaporate')}>
        <g clipPath="url(#wf-rv-flask)">
          <path className={`${styles.liquid} ${styles.slosh}`} d="M38 178q9-3 18 0t18 0t18 0t18 0V200H38Z" />
        </g>
        <path d="M147 92l22-22M153 100l17-17" />
        <path className={styles.vapour} d="M99 146L135 110L161 84L178 64" />
      </g>

      {/* Condenser: coolant running through the coil. */}
      <g {...part('condense')}>
        <rect height="112" rx="6" width="26" x="170" y="16" />
        <path className={styles.coil} d="M175 110l16-8l-16-8l16-8l-16-8l16-8l-16-8l16-8l-16-8l16-8l-16-8" />
        <path className={styles.port} d="M208 116H196M196 28H208" />
      </g>

      {/* Receiving flask: condensate dripping in. */}
      <g {...part('collect')}>
        <path d="M183 128v20" />
        <circle cx="183" cy="172" r="22" />
        <circle className={styles.drop} cx="183" cy="131" r="1.6" />
        <circle className={`${styles.drop} ${styles.later}`} cx="183" cy="131" r="1.6" />
        <g clipPath="url(#wf-rv-receiver)">
          <path className={`${styles.liquid} ${styles.slosh}`} d="M155 182q7-2.5 14 0t14 0t14 0t14 0V196H155Z" />
        </g>
      </g>
    </>
  );
}

const rotaryEvaporator = {
  Drawing,
  parts: [
    { part: 'rotate', test: /rotat|spin|turn/ },
    { part: 'heat', test: /heat|bath|warm/ },
    { part: 'evaporate', test: /evapor|vapo|boil|distil/ },
    { part: 'condense', test: /condens|cool/ },
    { part: 'collect', test: /collect|recover|receiv|drain/ },
  ],
  tags: {
    rotate: { at: [28, 126], align: 'start' },
    heat: { at: [-6, 230], align: 'start' },
    evaporate: { at: [104, 76], align: 'start' },
    condense: { at: [164, 52], align: 'end' },
    collect: { at: [183, 206], align: 'center' },
  },
};

export default rotaryEvaporator;
