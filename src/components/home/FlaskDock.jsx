import JourneyFlask from "./JourneyFlask";
import styles from "./FlaskJourney.module.css";

/**
 * A landing spot for the homepage's travelling sample (FlaskJourney):
 * a small stand with glassware, or a glass icon for the section, on it: a
 * different one at every stop. The travelling sample finds the spots by
 * `data-flask-dock` and goes through them in page order, turning into each
 * spot's on the way; while it travels, the one here hides and the stands
 * wait, dashed, until it lands. Without the journey (phones, reduced motion)
 * each spot simply shows its own. The first spot's falls in from the top of
 * the screen as the page opens.
 *
 * `name`: tells apart two spots for the same stop (the hero has one for wide
 * screens and one for narrow), so their drawings' ids differ. `className`
 * must set the display (e.g. "block" or "hidden lg:block").
 */

// The stops down the page, top to bottom: what the sample is in there
// (VESSELS in JourneyFlask), its width (px) and how full it is (0–1). The
// sample fills a little more at every stop, to the brim at the end; the last
// four stand for their sections.
export const FLASK_STOPS = [
  { kind: "erlenmeyer", size: 64, level: 0.2 }, // About Inkarp (hero), under the 1985 badge
  { kind: "beaker", size: 48, level: 0.36 }, // the workflow wheel's centre
  { kind: "wrench", size: 56, level: 0.52 }, // Service support
  { kind: "pin", size: 52, level: 0.66 }, // standing on the principals globe
  { kind: "calendar", size: 56, level: 0.8 }, // Events & insights
  { kind: "speech", size: 64, level: 1 }, // Client reviews: a full speech bubble, glowing
];

export default function FlaskDock({ stop, name = "", className = "block" }) {
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
        <JourneyFlask kind={kind} uid={`flask-stop-${stop}${name}`} />
      </span>
    </span>
  );
}
