import styles from './HeroDrawing.module.css';

/**
 * A faint line drawing of the instrument at work, large in the background of
 * a product page on wide screens (opt-in per product in
 * src/data/products/heroDrawings.js). It is fixed to the screen, so it stays in
 * view, still working, while the whole page scrolls past. The still outline
 * sits at 7%; the moving parts are a little stronger so the work shows. No
 * motion for visitors who prefer reduced motion.
 */

// Rotary evaporator, on a 240-unit grid drawn at 560px (1.3 units ≈ a 3px
// line): the flask turns in its heating bath, vapour rises through the duct
// into the coil condenser, coolant flows through the coil, and condensate
// drips into the receiving flask, which fills as the evaporating flask empties.
function RotaryEvaporator() {
  return (
    <>
      <defs>
        <clipPath id="hero-rv-flask"><circle cx="76" cy="166" r="28.6" /></clipPath>
        <clipPath id="hero-rv-receiver"><circle cx="183" cy="172" r="20.6" /></clipPath>
        <clipPath id="hero-rv-bath"><rect height="44" width="112" x="19" y="172" /></clipPath>
      </defs>

      {/* The instrument itself. */}
      <g className={styles.frame}>
        <path d="M18 172v36a8 8 0 0 0 8 8h98a8 8 0 0 0 8-8v-36" />
        <circle cx="76" cy="166" r="30" />
        <path d="M95 142l24-24M103 150l24-24" />
        <rect height="26" rx="5" transform="rotate(-45 135 109)" width="36" x="117" y="96" />
        <path d="M147 92l22-22M153 100l17-17" />
        <rect height="112" rx="6" width="26" x="170" y="16" />
        <path d="M175 30l16 8l-16 8l16 8l-16 8l16 8l-16 8l16 8l-16 8l16 8l-16 8" />
        <path d="M196 28h12M196 116h12" />
        <path d="M183 128v20" />
        <circle cx="183" cy="172" r="22" />
        <path d="M125 148l-8-1M125 148l-1-8" />
      </g>

      {/* Moving mechanics: the turning flask, rocking bath water, coolant. */}
      <g className={styles.mechanics}>
        <path className={styles.turn} d="M97 120A18 6 45 1 0 125 148" />
        <g clipPath="url(#hero-rv-flask)">
          <g className={styles.film}>
            <path d="M76 143a23 23 0 0 1 20 11.5M76 189a23 23 0 0 1-20-11.5" />
          </g>
        </g>
        <g clipPath="url(#hero-rv-bath)">
          <path className={styles.bathWater} d="M18 188q7.5-5 15 0t15 0M100 188q7-5 14 0t14 0t14 0" />
        </g>
        <path className={styles.coolant} d="M175 110l16-8l-16-8l16-8l-16-8l16-8l-16-8l16-8l-16-8l16-8l-16-8" />
        <path className={styles.coolantPort} d="M208 116H196M196 28H208" />
      </g>

      {/* The liquid: heat in the bath, vapour, condensate and both flasks' contents. */}
      <g className={styles.liquid}>
        <path className={`${styles.heat} ${styles.heat1}`} d="M30 212q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.heat2}`} d="M44 212q-2-3 0-6t0-6" />
        <path className={`${styles.heat} ${styles.heat3}`} d="M116 212q-2-3 0-6t0-6" />

        <g clipPath="url(#hero-rv-flask)">
          <g className={styles.flaskLevel}>
            <path className={styles.slosh} d="M38 178q9-3 18 0t18 0t18 0t18 0V200H38Z" />
          </g>
        </g>

        <path className={styles.vapour} d="M99 146L135 110L161 84L178 64" />

        <circle className={`${styles.drop} ${styles.drop1}`} cx="183" cy="131" r="1.5" />
        <circle className={`${styles.drop} ${styles.drop2}`} cx="183" cy="131" r="1.5" />

        <g clipPath="url(#hero-rv-receiver)">
          <g className={styles.receiverLevel}>
            <path className={styles.slosh} d="M155 180q7-2.5 14 0t14 0t14 0t14 0V196H155Z" />
          </g>
        </g>
      </g>
    </>
  );
}

const DRAWINGS = {
  'rotary-evaporator': RotaryEvaporator,
};

export default function HeroDrawing({ kind }) {
  const Drawing = DRAWINGS[kind];
  if (!Drawing) return null;

  return (
    <div aria-hidden="true" className={`${styles.layer} pointer-events-none absolute inset-0 hidden lg:block`}>
      <svg className={styles.drawing} fill="none" focusable="false" viewBox="0 0 240 240">
        <Drawing />
      </svg>
    </div>
  );
}
