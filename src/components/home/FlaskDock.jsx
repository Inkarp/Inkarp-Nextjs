import JourneyFlask from "./JourneyFlask";
import styles from "./FlaskJourney.module.css";

/**
 * A landing spot for the homepage's travelling sample (FlaskJourney):
 * a small stand with a piece of glassware on it, a different one at every
 * stop. The travelling sample finds the spots by `data-flask-dock` and goes
 * through them in page order, turning into each spot's glassware on the way;
 * while it travels, the glassware here hides and the stands wait, dashed,
 * until it lands. Without the journey (phones, reduced motion) each spot
 * simply shows its glassware. The first spot's falls in from the top of the
 * screen as the page opens.
 *
 * `className` must set the display (e.g. "block" or "hidden lg:block").
 */

// The stops down the page, top to bottom: the glassware there (VESSELS in
// JourneyFlask), its width (px) and how full it is (0–1). The sample fills
// a little more at every stop, up to the volumetric flask's mark at the end.
export const FLASK_STOPS = [
  { kind: "erlenmeyer", size: 64, level: 0.2 }, // About Inkarp (hero)
  { kind: "beaker", size: 48, level: 0.36 }, // the workflow wheel's centre
  { kind: "testTube", size: 56, level: 0.52 }, // Service support
  { kind: "roundBottom", size: 52, level: 0.66 }, // on top of the principals globe
  { kind: "cylinder", size: 56, level: 0.8 }, // Events & insights
  { kind: "volumetric", size: 64, level: 1 }, // Client reviews: made up to the mark, glowing
];

export default function FlaskDock({ stop, className = "block" }) {
  const { kind, size, level } = FLASK_STOPS[stop];
  const first = stop === 0;
  const last = stop === FLASK_STOPS.length - 1;

  return (
    <span
      aria-hidden="true"
      className={`${styles.dock} ${className}`}
      data-flask-dock=""
      data-flask-first={first ? "" : undefined}
      data-flask-kind={kind}
      data-flask-level={level}
      style={{ width: size, "--flask-fill": level }}
    >
      {last ? <span className={styles.halo} /> : null}
      <span className={styles.pad}>
        <span className={styles.padShadow} />
        <span className={styles.padRing} />
      </span>
      <span className={styles.dockFlask} data-flask-enter={first ? "" : undefined}>
        <JourneyFlask kind={kind} uid={`flask-stop-${stop}`} />
      </span>
    </span>
  );
}
